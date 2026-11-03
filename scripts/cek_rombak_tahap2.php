// Cek tahap 2 rombak resort (tanpa <?php: isinya disuapkan ke tinker). Jalankan:
//   grep -v '^\s*//' scripts/cek_rombak_tahap2.php | tr '\n' ' ' | docker exec -i unit-app php artisan tinker
// Semua perubahan di-rollback. Hanya untuk DB lokal (salinan prod).
(function () {
    if (!app()->environment('local')) { echo "lokal saja\n"; return; }
    $gagal = 0;
    $cek = function (bool $ok, string $pesan) use (&$gagal) {
        echo ($ok ? "\nOK    " : "\nGAGAL ") . $pesan;
        $ok || $gagal++;
    };
    $M = \App\Helpers\Mutasi::class;
    $Ang = \App\Models\TransactionLoanInstalment::class;
    $bulanIni = now()->startOfMonth()->toDateString();
    // Babat 1 (branch 21), kel 1..10 = grouping 201..210.
    $kantor = \App\Models\TransactionLoanOfficerGrouping::where('branch_id', 21)->orderBy('kelompok')->pluck('id')->all();
    $user = \App\Models\User::findOrFail(40);

    DB::beginTransaction();
    try {
        auth()->login($user);

        // [CEK-TASK-1] T1: "Hari Tidak Sama" memakai hari tagih pinjaman PADA tanggal transaksi.
        // Pinjaman aktif kel 2 Senin (drop sebelum Senin terakhir bulan lalu) -> pindah ke kel 3 Rabu.
        $seninLalu = \Carbon\Carbon::parse($bulanIni)->subMonth()->lastOfMonth(\Carbon\Carbon::MONDAY)->toDateString();
        $seninIni = now()->startOfWeek(\Carbon\Carbon::MONDAY)->toDateString();
        $rabuIni = now()->startOfWeek(\Carbon\Carbon::MONDAY)->addDays(2)->toDateString();
        $loan = \App\Models\TransactionLoan::where('transaction_loan_officer_grouping_id', $kantor[1])
            ->where('hari', 'senin')->where('status', 'success')->whereNull('pay_off_date')
            ->where('drop_date', '<', $seninLalu)->orderByDesc('drop_date')->firstOrFail();
        $M::catat($loan, $kantor[2], 'rabu', $bulanIni, 'cek tahap 2', $user);
        $ctl = app(\App\Http\Controllers\TransactionLoanController::class);
        $bayar = function ($tgl) use ($ctl, $loan, $Ang) {
            $Ang::where('transaction_loan_id', $loan->id)->whereDate('transaction_date', $tgl)->get()->each->delete();
            session()->forget('errors');
            $ctl->bayar_pinjaman(\Illuminate\Http\Request::create('/', 'POST', ['type_transaksi' => 'bayar', 'nominal' => 1000, 'transaction_date' => $tgl]), $loan->fresh());
            return [(int) $Ang::where('transaction_loan_id', $loan->id)->whereDate('transaction_date', $tgl)->value('transaction_loan_officer_grouping_id'), (string) session('errors')?->first()];
        };
        // Rabu minggu ini belum tiba (hari ini Selasa): jam dimajukan ke Rabu itu, bulan tetap sama.
        \Carbon\Carbon::setTestNow(\Carbon\Carbon::parse($rabuIni)->setTime(10, 0));
        [$g, $e] = $bayar($rabuIni);
        \Carbon\Carbon::setTestNow();
        $cek($g === $kantor[2] && $e === '', "loan {$loan->id} bayar $rabuIni (Rabu, hari baru): diterima di kel 3 ($g $e)");
        [$g, $e] = $bayar($seninLalu);
        $cek($g === $kantor[1] && $e === '', "bayar $seninLalu (Senin bulan lalu, sebelum pindah): diterima di kel 2 ($g $e)");
        [$g, $e] = $bayar($seninIni);
        $cek($g === 0 && $e === 'Hari Tidak Sama', "bayar $seninIni (Senin bulan ini): ditolak Hari Tidak Sama ($g $e)");

        // [CEK-TASK-2] T2: kunci hari drop memakai kelompok PADA drop_date.
        // Pinjaman kel 2 drop Oktober (hari itu terkunci kasir di kel 2) -> pindah ke kel 3; kunci kel 3 di tanggal itu dibuka supaya hanya kelompok lama yang menahan.
        $Tutup = \App\Models\TransactionDailyClosing::class;
        $kunciDi = fn($g, $tgl) => $Tutup::where('transaction_loan_officer_grouping_id', $g)->whereDate('date', $tgl)->whereNotNull('kasir_lock_at')->exists();
        $drop = \App\Models\TransactionLoan::where('transaction_loan_officer_grouping_id', $kantor[1])
            ->where('status', 'success')->whereNull('pay_off_date')
            ->whereBetween('drop_date', [\Carbon\Carbon::parse($bulanIni)->subMonth()->toDateString(), \Carbon\Carbon::parse($bulanIni)->subDay()->toDateString()])
            ->orderByDesc('drop_date')->get()
            ->first(fn($l) => $kunciDi($kantor[1], $l->drop_date));
        $tglDrop = \Carbon\Carbon::parse($drop->drop_date)->toDateString();
        $M::catat($drop, $kantor[2], null, $bulanIni, 'cek tahap 2 T2', $user);
        $Tutup::where('transaction_loan_officer_grouping_id', $kantor[2])->whereDate('date', $tglDrop)->update(['kasir_lock_at' => null, 'kasir_lock_user' => null]);
        $drop = $drop->fresh();
        $cek($M::kelompokPada($drop, $tglDrop) === $kantor[1] && $kunciDi($kantor[1], $tglDrop) && !$kunciDi($kantor[2], $tglDrop), "loan {$drop->id} drop $tglDrop: kel lama terkunci, kel baru terbuka");
        $tolak = function (callable $f) {
            DB::beginTransaction();
            try { $f(); $e = ''; } catch (\Throwable $t) { $e = $t->getMessage(); }
            DB::rollBack();
            return str_contains($e, 'sudah dikunci kasir');
        };
        $cek($tolak(fn() => DB::table('transaction_loans')->where('id', $drop->id)->update(['nominal_drop' => $drop->nominal_drop + 1000])), 'trigger update: ubah nominal_drop ditolak (kunci kel lama)');
        $cek($tolak(fn() => DB::table('transaction_loans')->where('id', $drop->id)->delete()), 'trigger delete: hapus ditolak (kunci kel lama)');
        $mantri = \App\Models\User::findOrFail(1636);
        auth()->login($mantri);
        $hapus = \App\Helpers\AppHelper::canDeleteLoan($drop);
        $cek(!\App\Helpers\Gembok::bolehBuka($mantri) && \App\Helpers\AppHelper::hariDropTerkunci($drop) && $hapus['status'] === false, "hariDropTerkunci & canDeleteLoan (mantri): terkunci ({$hapus['message']})");
        auth()->login($user);
        $ok = true;
        try { $drop->update(['nominal_drop' => $drop->nominal_drop + 1000]); } catch (\Throwable $t) { $ok = $t->getMessage(); }
        $cek($ok === true && !$kunciDi($kantor[1], $tglDrop), 'hook updating (superuser): kunci kel lama dibuka, ubah lolos (' . ($ok === true ? 'ok' : $ok) . ')');
        // [CEK-TASK-3] Pratinjau draf #2 (Babat 1, berlaku bulan ini) dihitung server, hanya baca.
        $RR = \App\Helpers\RombakResort::class;
        $draf2 = \App\Models\TransactionResortRombak::with('peta')->findOrFail(2);
        $p = app(\App\Http\Controllers\RombakResortController::class)->pratinjau($draf2)->getData(true);
        $cek($p['galat'] === [], 'pratinjau draf #2: galat kosong (' . implode(' | ', $p['galat']) . ')');
        $porto = \App\Helpers\HitungAgregat::portofolio($kantor, \Carbon\Carbon::parse($bulanIni)->subDay(), $bulanIni);
        $saldoKantor = array_sum(array_map('array_sum', $porto));
        $nsbKantor = DB::table('transaction_loans')->whereIn('transaction_loan_officer_grouping_id', $kantor)->where('status', 'success')->whereNull('pay_off_date')->whereIn(DB::raw('LOWER(hari)'), $RR::HARI)->count();
        $cek(array_sum(array_column($p['kotak'], 'saldo')) === $saldoKantor && array_sum(array_column($p['kotak'], 'nasabah')) === $nsbKantor, 'total kotak = portofolio kantor (' . array_sum(array_column($p['kotak'], 'saldo')) . " vs $saldoKantor, nsb $nsbKantor)");
        $cek(array_sum(array_map(fn($k) => $k['lancar'] + $k['cm'] + $k['mb'] + $k['ml'], $p['kotak'])) === $saldoKantor, 'pecahan kotak menjumlah ke saldo');
        $ids = implode(',', $kantor);
        $mlGanda = DB::select("SELECT COUNT(*) n, COALESCE(SUM(x.n - 1), 0) lebur FROM (
            SELECT COALESCE(p.ke_grouping_id, l.transaction_loan_officer_grouping_id) g, COALESCE(p.ke_hari, LOWER(l.hari)) h, COUNT(*) n
            FROM transaction_loans l
            JOIN transaction_manage_customers m ON m.id = l.transaction_manage_customer_id
            JOIN transaction_customers c ON c.id = m.transaction_customer_id AND c.nik = 'ML00000000000001'
            LEFT JOIN transaction_resort_rombak_peta p ON p.rombak_id = 2 AND p.dari_grouping_id = l.transaction_loan_officer_grouping_id AND p.dari_hari = LOWER(l.hari)
            WHERE l.transaction_loan_officer_grouping_id IN ($ids) AND l.status = 'success' AND l.pay_off_date IS NULL
            GROUP BY g, h HAVING n > 1 AND (g, h) IN (SELECT ke_grouping_id, ke_hari FROM transaction_resort_rombak_peta WHERE rombak_id = 2)) x")[0];
        $leburP = array_sum(array_map(fn($m) => count($m['lebur']), $p['macet_lama']));
        $cek(count($p['macet_lama']) === (int) $mlGanda->n && $leburP === (int) $mlGanda->lebur, 'MACET LAMA ganda: ' . count($p['macet_lama']) . " resort, $leburP dilebur (kueri: {$mlGanda->n}, {$mlGanda->lebur})");
        $cek(collect($p['macet_lama'])->every(fn($m) => collect($m['lebur'])->every(fn($l) => $l['id'] > $m['pertahankan']['id'])), 'MACET LAMA: yang dipertahankan id terkecil');
        $pindahSql = DB::table('transaction_loans as l')->join('transaction_resort_rombak_peta as p', fn($j) => $j->on('p.dari_grouping_id', '=', 'l.transaction_loan_officer_grouping_id')->on('p.dari_hari', '=', DB::raw('LOWER(l.hari)')))
            ->where('p.rombak_id', 2)->where(fn($q) => $q->whereIn('l.status', ['open', 'acc'])->orWhere(fn($q) => $q->where('l.status', 'success')->where(fn($q) => $q->whereNull('l.pay_off_date')->orWhere('l.pay_off_date', '>=', $bulanIni))))->count();
        $cek(array_sum(array_map(fn($x) => $x['aktif'] + $x['open'] + $x['acc'], $p['pindah'])) === $pindahSql, "pinjaman pindah = kueri ($pindahSql)");
        $tutup = \App\Models\TransactionDailyClosing::firstOrCreate(['transaction_loan_officer_grouping_id' => $kantor[0], 'date' => $bulanIni]);
        DB::table('transaction_daily_closings')->where('id', $tutup->id)->update(['kasir_lock_at' => now()]);
        $cek(collect($RR::pratinjau($draf2->fresh())['hari_dibuka'])->contains(fn($h) => $h['grouping_id'] === $kantor[0] && $h['tanggal'] === $bulanIni), "hari terkunci $bulanIni kel 1 masuk hari_dibuka");
        $stash = \App\Models\TransactionResortRombak::create(['branch_id' => 21, 'berlaku_bulan' => $bulanIni, 'status' => 'draf', 'dibuat_oleh' => $user->employee->id]);
        $stash->peta()->createMany($draf2->peta->map(fn($x, $i) => ['dari_grouping_id' => $x->dari_grouping_id, 'dari_hari' => $x->dari_hari, 'ke_grouping_id' => $i ? $x->ke_grouping_id : null, 'ke_hari' => $i ? $x->ke_hari : null])->all());
        $g = $RR::periksa($stash->fresh());
        $cek(count($g) === 1 && str_contains($g[0], 'stash'), 'draf dengan stash: galat stash (' . implode(' | ', $g) . ')');
        $stash->update(['berlaku_bulan' => \Carbon\Carbon::parse($bulanIni)->subMonth()->toDateString()]);
        $draf2->update(['status' => 'diterapkan']);
        $g = $RR::periksa($stash->fresh());
        $cek(collect($g)->contains(fn($x) => str_contains($x, 'bukan bulan berjalan')) && !collect($g)->contains(fn($x) => str_contains($x, 'diterapkan')), 'bulan lalu: galat bulan berjalan (' . count($g) . ' galat)');
        $stash->update(['berlaku_bulan' => $bulanIni]);
        $cek(collect($RR::periksa($stash->fresh()))->contains(fn($x) => str_contains($x, 'rombak #2 yang diterapkan')), 'rombak lain diterapkan di bulan sama: galat');
    } finally {
        \Carbon\Carbon::setTestNow();
        DB::rollBack();
    }
    echo "\n" . ($gagal ? "$gagal GAGAL" : 'SEMUA OK') . "\n";
})();
