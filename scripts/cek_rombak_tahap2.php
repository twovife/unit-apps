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

        // [CEK-TASK-4] Terapkan draf #2 di transaksi uji yang bersih: perubahan cek 1-3 dibuang dulu.
        DB::rollBack();
        DB::beginTransaction();
        auth()->login($user);
        $draf2 = \App\Models\TransactionResortRombak::with('peta')->findOrFail(2);
        $Mc = \Carbon\Carbon::parse($bulanIni);
        $okt = $Mc->copy()->subMonth();
        $HA = \App\Helpers\HitungAgregat::class;
        $plan = $RR::pinjaman($draf2);
        $pindah = $plan->where('pindah', true)->keyBy('id');
        $ids = $pindah->keys()->all();
        $gIds = $RR::kelompokTerkait($draf2);
        // Satu hari November yang punya angsuran pinjaman pindah dikunci lewat Gembok::kunci, supaya jalur buka kunci teruji (lokal tidak ada kunci November).
        $kunciRow = \App\Models\TransactionDailyClosing::whereIn('transaction_loan_officer_grouping_id', $gIds)->whereDate('date', '>=', $bulanIni)->whereNotNull('kepala_approval_at')->orderBy('date')->get()
            ->first(fn($c) => DB::table('transaction_loan_instalments')->whereIn('transaction_loan_id', $ids)->where('transaction_loan_officer_grouping_id', $c->transaction_loan_officer_grouping_id)->whereDate('transaction_date', $c->date)->exists());
        \App\Helpers\Gembok::kunci($kunciRow, $user->employee->id);
        $p = $RR::pratinjau($draf2->fresh('peta'));
        $cek($p['galat'] === [] && count($p['hari_dibuka']) === 1, "pratinjau sebelum terapkan: galat kosong, 1 hari terkunci (kel g{$kunciRow->transaction_loan_officer_grouping_id} {$kunciRow->date->toDateString()})");
        $urut = function ($a) { ksort($a); return $a; };
        $portoOkt = fn() => [$urut($HA::portofolio($kantor, $okt->copy()->subDay(), $okt)), $urut($HA::portofolio($kantor, $okt->copy()->endOfMonth(), $okt))];
        $harianOkt = fn() => $urut($HA::harianBanyak($kantor, $okt, $okt->copy()->endOfMonth()));
        $totalM = fn() => [array_sum(array_map('array_sum', $HA::portofolio($kantor, $okt->copy()->endOfMonth(), $Mc))), array_sum(array_map('array_sum', $HA::portofolio($kantor, now(), $Mc)))];
        $angLalu = fn() => DB::table('transaction_loan_instalments')->whereIn('transaction_loan_id', $ids)->where('transaction_date', '<', $bulanIni)->selectRaw('transaction_loan_officer_grouping_id g, COUNT(*) n, SUM(nominal) s')->groupBy('g')->orderBy('g')->get()->toJson();
        $mlIds = DB::table('transaction_loans as l')->join('transaction_manage_customers as m', 'm.id', '=', 'l.transaction_manage_customer_id')->join('transaction_customers as c', 'c.id', '=', 'm.transaction_customer_id')
            ->where('c.nik', \App\Http\Controllers\MigrasiController::NIK_MACET_LAMA)->whereIn('l.transaction_loan_officer_grouping_id', $kantor)->where('l.status', 'success')->pluck('l.id')->all();
        $saldoMl = fn() => collect(\App\Helpers\PenyesuaianSaldo::saldoBanyak($mlIds))->sum('saldo');
        $sebelum = [$portoOkt(), $harianOkt(), $totalM(), $angLalu(), $saldoMl()];

        $t0 = microtime(true);
        $ring = $RR::terapkan($draf2, $user);
        $detik = round(microtime(true) - $t0, 1);
        $cek(true, "terapkan draf #2 selesai dalam $detik detik (" . count($ids) . ' pinjaman)');

        $mut = \App\Models\TransactionLoanMutation::where('rombak_id', 2)->get()->groupBy('transaction_loan_id');
        $kolom = DB::table('transaction_loans')->whereIn('id', $ids)->get(['id', DB::raw("CONCAT(transaction_loan_officer_grouping_id, '|', LOWER(hari)) k")])->pluck('k', 'id');
        $cek($mut->count() === count($ids) && $pindah->every(fn($l) => ($mut[$l->id] ?? collect())->count() === 1 && $mut[$l->id][0]->ke_grouping_id . '|' . $mut[$l->id][0]->ke_hari === $l->ke && $kolom[$l->id] === $l->ke && $mut[$l->id][0]->dari_grouping_id . '|' . $mut[$l->id][0]->dari_hari === $l->asal),
            'tiap pinjaman pindah: satu mutasi rombak #2, asal & tujuan = rencana, kolom = tujuan (' . $mut->count() . ')');
        $sesudah = [$portoOkt(), $harianOkt(), $totalM(), $angLalu(), $saldoMl()];
        $cek($sesudah[0] === $sebelum[0], 'portofolio Oktober (awal & akhir) per kelompok x hari x ember sama persis');
        $cek($sesudah[1] === $sebelum[1], 'harianBanyak Oktober sama persis (' . count($sesudah[1]) . ' baris)');
        $cek($sesudah[2] === $sebelum[2], 'total portofolio kantor November (awal & hari ini) sama (' . implode(' / ', $sesudah[2]) . ')');
        $cek($sesudah[3] === $sebelum[3], 'angsuran sebelum November pinjaman pindah: kelompoknya tidak berubah');
        $salah = DB::table('transaction_loan_instalments as i')->join('transaction_loans as l', 'l.id', '=', 'i.transaction_loan_id')->whereIn('i.transaction_loan_id', $ids)->where('i.transaction_date', '>=', $bulanIni)->whereColumn('i.transaction_loan_officer_grouping_id', '<>', 'l.transaction_loan_officer_grouping_id')->count();
        $bm = $ring['baris_m'];
        $cek($salah === 0 && $bm['angsuran']['jumlah'] === $p['angsuran_m']['jumlah'] && $bm['pemutihan']['jumlah'] === $p['angsuran_m']['pemutihan_jumlah'] && $bm['penyesuaian']['jumlah'] === $p['angsuran_m']['penyesuaian_jumlah'],
            "angsuran November pinjaman pindah semua di kelompok tujuan ({$bm['angsuran']['jumlah']} = pratinjau {$p['angsuran_m']['jumlah']}, {$bm['angsuran']['ganti_kelompok']} ganti kelompok, salah $salah)");
        $cek($sesudah[4] === $sebelum[4], "total saldo MACET LAMA kantor tetap ({$sesudah[4]})");
        $mlSaldo = \App\Helpers\PenyesuaianSaldo::saldoBanyak($mlIds);
        $mlResort = DB::table('transaction_loans')->whereIn('id', $mlIds)->get(['id', DB::raw("CONCAT(transaction_loan_officer_grouping_id, '|', LOWER(hari)) k")])
            ->filter(fn($l) => $mlSaldo[$l->id]['saldo'] > 0)->countBy('k');
        $tujuan = collect($RR::peta($draf2))->values()->unique();
        $cek($tujuan->every(fn($k) => ($mlResort[$k] ?? 0) <= 1), 'tiap resort tujuan punya <= 1 MACET LAMA bersaldo > 0 (maks ' . $tujuan->map(fn($k) => $mlResort[$k] ?? 0)->max() . ')');
        $leburP = collect($p['macet_lama'])->flatMap(fn($x) => $x['lebur'])->where('saldo', '>', 0)->count();
        $cek(count($ring['macet_lama']) === $leburP && collect($ring['macet_lama'])->every(fn($x) => $mlSaldo[$x['dari']]['saldo'] === 0), 'MACET LAMA dilebur = pratinjau (' . count($ring['macet_lama']) . " pasang penyesuaian, pratinjau $leburP bersaldo), yang dilebur saldo 0");
        $kotak = collect($p['kotak'])->pluck('saldo', 'resort');
        $awal = DB::table('transaction_monthly_closings')->whereIn('transaction_loan_officer_grouping_id', $kantor)->whereDate('periode', $bulanIni)->get(['transaction_loan_officer_grouping_id as g', 'hari', 'awal_total'])
            ->mapWithKeys(fn($x) => [$x->g . '|' . $x->hari => (int) $x->awal_total]);
        $beda = $awal->keys()->merge($kotak->keys())->unique()->filter(fn($k) => ($awal[$k] ?? 0) !== (int) ($kotak[$k] ?? 0));
        $cek($beda->isEmpty() && $awal->sum() === $kotak->sum(), 'saldo awal November per kelompok x hari = kotak papan (' . $awal->sum() . ', beda: ' . $beda->implode(', ') . ')');
        $harianM = $HA::harianBanyak($gIds, $Mc, $Mc->copy()->endOfMonth());
        $basi = \App\Models\TransactionDailyClosing::whereIn('transaction_loan_officer_grouping_id', $gIds)->whereBetween('date', [$bulanIni, $Mc->copy()->endOfMonth()->toDateString()])->get()
            ->filter(fn($c) => collect($harianM[$c->transaction_loan_officer_grouping_id . '|' . $c->date->toDateString()] ?? $HA::kosong())->some(fn($v, $f) => (int) $c->$f !== $v));
        $cek($basi->isEmpty() && $ring['closing_harian'] > 0, "closing harian November = sumber ({$ring['closing_harian']} baris berubah, basi {$basi->count()})");
        $tgtOk = collect($ring['target_lama'])->every(function ($t) {
            $c = \App\Models\TransactionDailyClosing::where('transaction_loan_officer_grouping_id', $t['grouping_id'])->whereDate('date', $t['tanggal_pertama'])->first();
            return (int) $c->target === $t['baru'] && $c->target_source === 'recount'
                && collect($t['rantai'])->every(fn($x) => (int) \App\Models\TransactionDailyClosing::find($x['id'])->target === $x['baru']);
        });
        $rantai = collect($ring['target_lama'])->sum(fn($t) => count($t['rantai']));
        $cek($tgtOk && count($ring['target_lama']) === collect($p['target'])->whereNotNull('tanggal_pertama')->count() && collect($ring['target_lama'])->pluck('baru')->all() === collect($p['target'])->whereNotNull('tanggal_pertama')->pluck('baru')->all(),
            'target hari pertama resort berubah = rumus pratinjau, recount (' . count($ring['target_lama']) . " resort, rantai $rantai baris)");
        $rk = $ring['rekening'];
        $cek(count($rk['ditimpa']) === $p['rekening']['ditimpa'] && count($rk['bentrok']) === count($p['rekening']['bentrok']), 'rekening = pratinjau (' . count($rk['ditimpa']) . ' ditimpa, ' . count($rk['bentrok']) . ' bentrok)');
        $kunciRow->refresh();
        $cek($kunciRow->kasir_lock_at === null && collect($ring['hari_dibuka'])->pluck('id')->all() === [$kunciRow->id]
            && \App\Models\TransactionLockHistory::where('transaction_daily_closing_id', $kunciRow->id)->where('aksi', \App\Models\TransactionLockHistory::AKSI_BUKA)->where('alasan', 'Rombak resort #2')->exists(), 'hari terkunci dibuka lewat Gembok::buka dengan alasan, tercatat di ringkasan');
        $d2 = $draf2->fresh();
        $cek($d2->status === 'diterapkan' && (int) $d2->diterapkan_oleh === (int) $user->employee->id && $d2->ringkasan['pinjaman']['jumlah'] === count($ids), 'status diterapkan, ringkasan tersimpan');
        $ulang = '';
        try { $RR::terapkan($d2, $user); } catch (\RuntimeException $e) { $ulang = $e->getMessage(); }
        $cek(str_contains($ulang, 'bukan draf'), "terapkan ulang ditolak ($ulang)");

        // [CEK-TASK-5] Batal: terapkan lalu batal di transaksi uji yang bersih -> semua kembali persis seperti sebelum terapkan.
        DB::rollBack();
        DB::beginTransaction();
        auth()->login($user);
        $draf2 = \App\Models\TransactionResortRombak::with('peta')->findOrFail(2);
        $pindah = $RR::pinjaman($draf2)->where('pindah', true)->keyBy('id');
        $ids = $pindah->keys()->all();
        $gIds = $RR::kelompokTerkait($draf2);
        $akhirM = $Mc->copy()->endOfMonth()->toDateString();
        $tanpa = fn($rows, $buang) => $rows->map(fn($x) => array_diff_key((array) $x, array_flip($buang)))->toJson();
        $foto = fn() => [
            'pinjaman' => $tanpa(DB::table('transaction_loans')->whereIn('transaction_loan_officer_grouping_id', $kantor)->orderBy('id')->get(), ['updated_at']),
            'angsuran >= M' => DB::table('transaction_loan_instalments')->whereIn('transaction_loan_officer_grouping_id', $kantor)->where('transaction_date', '>=', $bulanIni)->orderBy('id')->get(['id', 'transaction_loan_id', 'transaction_loan_officer_grouping_id', 'transaction_date', 'nominal'])->toJson(),
            'pemutihan >= M' => DB::table('transaction_white_offs')->whereIn('transaction_loan_officer_grouping_id', $kantor)->where('transaction_date', '>=', $bulanIni)->orderBy('id')->get(['id', 'transaction_loan_id', 'transaction_loan_officer_grouping_id', 'transaction_date', 'nominal'])->toJson(),
            'penyesuaian >= M' => DB::table('transaction_saldo_adjustments')->whereIn('transaction_loan_officer_grouping_id', $kantor)->where('berlaku_bulan', '>=', $bulanIni)->orderBy('id')->get(['id', 'transaction_loan_id', 'transaction_loan_officer_grouping_id', 'berlaku_bulan', 'jenis', 'nominal'])->toJson(),
            'penyesuaian semua (jumlah)' => DB::table('transaction_saldo_adjustments')->count(),
            'rekening' => $tanpa(DB::table('transaction_manage_customers')->whereIn('transaction_loan_officer_grouping_id', $kantor)->orderBy('id')->get(), ['updated_at']),
            'saldo MACET LAMA' => json_encode(\App\Helpers\PenyesuaianSaldo::saldoBanyak($mlIds)),
            'target M' => DB::table('transaction_daily_closings')->whereIn('transaction_loan_officer_grouping_id', $kantor)->whereBetween('date', [$bulanIni, $akhirM])->orderBy('id')->get(['id', 'transaction_loan_officer_grouping_id', 'date', 'target', 'target_on', 'target_source'])->toJson(),
            'closing harian M' => $tanpa(DB::table('transaction_daily_closings')->whereIn('transaction_loan_officer_grouping_id', $kantor)->whereBetween('date', [$bulanIni, $akhirM])->orderBy('id')->get(), ['updated_at']),
            'closing bulanan M & M+1' => $tanpa(DB::table('transaction_monthly_closings')->whereIn('transaction_loan_officer_grouping_id', $kantor)->where('periode', '>=', $bulanIni)->orderBy('id')->get(), ['created_at', 'updated_at']),
            'portofolio Oktober' => json_encode($portoOkt()),
            'portofolio November' => json_encode([$urut($HA::portofolio($kantor, $okt->copy()->endOfMonth(), $Mc)), $urut($HA::portofolio($kantor, now(), $Mc))]),
            'harianBanyak Oktober' => json_encode($harianOkt()),
            'harianBanyak November' => json_encode($urut($HA::harianBanyak($kantor, $Mc, $Mc->copy()->endOfMonth()))),
        ];
        // Satu baris hari tagih pertama (belum diteken) dihapus: terapkan harus membuatnya (dibuat), batal harus menghapusnya lagi.
        $hilang = collect($RR::target($draf2, $RR::pinjaman($draf2)))->filter(fn($t) => $t['tanggal_pertama'] > now()->toDateString())
            ->map(fn($t) => \App\Models\TransactionDailyClosing::where('transaction_loan_officer_grouping_id', $t['grouping_id'])->whereDate('date', $t['tanggal_pertama'])->whereNull('kepala_approval_at')->whereNull('kasir_lock_at')->first())->filter()->first();
        DB::table('transaction_daily_closings')->where('id', $hilang->id)->delete();
        // Baris closing lokal basi (hari tanpa segarkan masih nol): segarkan dulu dengan susunan sekarang, supaya beda sesudah batal hanya bisa datang dari terapkan/batal.
        $RR::segarkanClosing($kantor, $Mc, ['employee_id' => $user->employee->id, 'sumber' => 'cek tahap 2', 'paksa_awal' => true]);
        $foto0 = $foto();
        $ring = $RR::terapkan($draf2, $user);
        $foto1 = $foto();
        $berubah = collect($foto0)->filter(fn($v, $k) => $v !== $foto1[$k])->keys();
        $cek($berubah->count() >= 6, 'terapkan mengubah foto (' . $berubah->implode(', ') . ')');

        $dibuat = collect($ring['target_lama'])->where('dibuat', true);
        $cek($dibuat->count() === 1 && $dibuat->first()['grouping_id'] === (int) $hilang->transaction_loan_officer_grouping_id && $dibuat->first()['tanggal_pertama'] === $hilang->date->toDateString(), "terapkan membuat baris hari pertama yang hilang (g{$hilang->transaction_loan_officer_grouping_id} {$hilang->date->toDateString()})");
        $d2 = $draf2->fresh();
        $cek(collect($RR::periksaBatal($d2))->isEmpty() && str_contains($RR::periksaBatal($draf2)[0] ?? '', 'bukan diterapkan'), 'periksaBatal: draf ditolak, yang diterapkan boleh');
        DB::beginTransaction();
        $lagi = \App\Models\TransactionLoan::with('loan_officer_grouping')->findOrFail($ids[0]);
        $M::catat($lagi, $kantor[$lagi->transaction_loan_officer_grouping_id === $kantor[0] ? 1 : 0], null, $bulanIni, 'cek mutasi lagi', $user);
        $g = $RR::periksaBatal($d2->fresh());
        $cek(count($g) === 1 && str_contains($g[0], '1 pinjaman sudah dimutasi lagi'), 'pinjaman dimutasi lagi sesudah terapkan: batal diblokir (' . implode(' | ', $g) . ')');
        DB::rollBack();
        // Satu hari November sesudah terapkan dikunci di kelompok tujuan yang punya angsuran pinjaman pindah: batal harus membukanya.
        $kunciRow = \App\Models\TransactionDailyClosing::whereIn('transaction_loan_officer_grouping_id', $gIds)->whereBetween('date', [$bulanIni, now()->subDay()->toDateString()])->whereNotNull('kepala_approval_at')->orderBy('date')->get()
            ->first(fn($c) => DB::table('transaction_loan_instalments')->whereIn('transaction_loan_id', $ids)->where('transaction_loan_officer_grouping_id', $c->transaction_loan_officer_grouping_id)->whereDate('transaction_date', $c->date)->exists());
        \App\Helpers\Gembok::kunci($kunciRow, $user->employee->id);

        // Angsuran yang masuk SESUDAH terapkan (pinjaman pindah, hari baru, bulan M) -> sesudah batal ada di kelompok lama.
        $hariIni = $RR::HARI[now()->dayOfWeekIso - 1];
        $pil = $pindah->first(fn($l) => $l->status === 'success' && $l->pay_off_date === null && !$l->ml && explode('|', $l->ke)[1] === $hariIni && explode('|', $l->ke)[0] !== explode('|', $l->asal)[0]
            && !DB::table('transaction_loan_instalments')->where('transaction_loan_id', $l->id)->whereDate('transaction_date', now()->toDateString())->exists());
        DB::beginTransaction();
        session()->forget('errors');
        $ctl = app(\App\Http\Controllers\TransactionLoanController::class);
        $ctl->bayar_pinjaman(\Illuminate\Http\Request::create('/', 'POST', ['type_transaksi' => 'bayar', 'nominal' => 1000, 'transaction_date' => now()->toDateString()]), \App\Models\TransactionLoan::findOrFail($pil->id));
        $baru = $Ang::where('transaction_loan_id', $pil->id)->whereDate('transaction_date', now()->toDateString())->first();
        $cek($baru && (int) $baru->transaction_loan_officer_grouping_id === (int) explode('|', $pil->ke)[0], "angsuran baru loan {$pil->id} sesudah terapkan masuk kel tujuan g{$pil->ke} (" . ($baru->transaction_loan_officer_grouping_id ?? session('errors')?->first()) . ')');
        $RR::batal($d2, $user);
        $cek((int) $baru->fresh()->transaction_loan_officer_grouping_id === (int) explode('|', $pil->asal)[0] && \App\Models\TransactionLoan::find($pil->id)->transaction_loan_officer_grouping_id . '|' . \App\Models\TransactionLoan::find($pil->id)->hari === $pil->asal,
            "sesudah batal: angsuran baru itu & pinjamannya kembali ke asal g{$pil->asal} ({$baru->fresh()->transaction_loan_officer_grouping_id})");
        DB::rollBack();

        $t0 = microtime(true);
        $b = $RR::batal($d2, $user);
        $detik = round(microtime(true) - $t0, 1);
        $cek(true, "batal draf #2 selesai dalam $detik detik ({$b['pinjaman']} pinjaman, angsuran kembali {$b['baris_m']['angsuran']}, target dihapus {$b['target_dihapus']}, drop sesudah {$b['drop_sesudah']})");
        $foto2 = $foto();
        $cek($b['target_dihapus'] === 1 && !\App\Models\TransactionDailyClosing::where('transaction_loan_officer_grouping_id', $hilang->transaction_loan_officer_grouping_id)->whereDate('date', $hilang->date)->exists(), 'batal menghapus baris hari pertama yang dibuat terapkan');
        foreach ($foto0 as $k => $v) {
            $cek($foto2[$k] === $v, "sesudah batal: $k sama persis dengan sebelum terapkan");
        }
        $cek(\App\Models\TransactionLoanMutation::where('rombak_id', 2)->count() === 0 && \App\Models\TransactionLoanMutation::count() === 0, 'mutasi rombak #2 terhapus (tabel mutasi kosong)');
        $harianM = $HA::harianBanyak($kantor, $Mc, $Mc->copy()->endOfMonth());
        $basi = \App\Models\TransactionDailyClosing::whereIn('transaction_loan_officer_grouping_id', $kantor)->whereBetween('date', [$bulanIni, $akhirM])->get()
            ->filter(fn($c) => collect($harianM[$c->transaction_loan_officer_grouping_id . '|' . $c->date->toDateString()] ?? $HA::kosong())->some(fn($v, $f) => (int) $c->$f !== $v));
        $cek($basi->isEmpty() && $b['closing_harian'] > 0, "closing harian November = sumber sesudah batal ({$b['closing_harian']} baris ditulis, basi {$basi->count()})");
        $kunciRow->refresh();
        $cek($kunciRow->kasir_lock_at === null && collect($b['hari_dibuka'])->pluck('id')->all() === [$kunciRow->id]
            && \App\Models\TransactionLockHistory::where('transaction_daily_closing_id', $kunciRow->id)->where('aksi', \App\Models\TransactionLockHistory::AKSI_BUKA)->where('alasan', 'Batal rombak resort #2')->exists(), 'hari yang dikunci sesudah terapkan dibuka lewat Gembok::buka dengan alasan batal');
        $d3 = $draf2->fresh();
        $cek($d3->status === 'dibatalkan' && (int) $d3->dibatalkan_oleh === (int) $user->employee->id && $d3->dibatalkan_at !== null && isset($d3->ringkasan['batal'], $d3->ringkasan['target_lama']), 'status dibatalkan, dibatalkan_oleh/at, ringkasan + batal');
        $ulang = '';
        try { $RR::batal($d3, $user); } catch (\RuntimeException $e) { $ulang = $e->getMessage(); }
        $cek(str_contains($ulang, 'bukan diterapkan'), "batal ulang ditolak ($ulang)");
    } finally {
        \Carbon\Carbon::setTestNow();
        DB::rollBack();
    }
    $cek(\App\Models\TransactionResortRombak::find(2)->status === 'draf' && \App\Models\TransactionLoanMutation::count() === 0, 'sesudah rollback: draf #2 tetap draf, mutasi kosong');
    echo "\n" . ($gagal ? "$gagal GAGAL" : 'SEMUA OK') . "\n";
})();
