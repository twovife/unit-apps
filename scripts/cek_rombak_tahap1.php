// Cek tahap 1 rombak resort (tanpa <?php: isinya disuapkan ke tinker). Jalankan:
//   grep -v '^\s*//' scripts/cek_rombak_tahap1.php | tr '\n' ' ' | docker exec -i unit-app php artisan tinker
// Semua perubahan di-rollback. Hanya untuk DB lokal (salinan prod).
(function () {
    if (!app()->environment('local')) { echo "lokal saja\n"; return; }
    $gagal = 0;
    $cek = function (bool $ok, string $pesan) use (&$gagal) {
        echo ($ok ? "\nOK    " : "\nGAGAL ") . $pesan;
        $ok || $gagal++;
    };
    $M = \App\Helpers\Mutasi::class;
    $bulanIni = now()->startOfMonth()->toDateString();
    $bulanLalu = now()->startOfMonth()->subMonth()->toDateString();
    $akhirBulanLalu = now()->startOfMonth()->subDay()->toDateString();
    // Sidoarjo 5, kel 1..10
    $kantor = range(1221, 1230);

    DB::beginTransaction();
    try {
        // Rombak #2 (Babat 1) sudah diterapkan sungguhan di lokal: dibatalkan dulu di dalam transaksi ini supaya tabel mutasi kosong.
        $r2 = \App\Models\TransactionResortRombak::find(2);
        if ($r2 && $r2->status === 'diterapkan') {
            auth()->login(\App\Models\User::findOrFail(40));
            \App\Helpers\RombakResort::batal($r2, auth()->user());
        }
        // 1. Tabel kosong -> SQL kolom asli persis.
        $cek(\App\Models\TransactionLoanMutation::count() === 0, 'tabel mutasi kosong di awal');
        $cek($M::kelompokSql('l', $M::tgl($bulanLalu)) === 'l.transaction_loan_officer_grouping_id', 'kosong: kelompokSql = kolom');
        $cek($M::hariSql('l', 'l.drop_date') === 'LOWER(l.hari)', 'kosong: hariSql = LOWER(kolom)');

        // Pinjaman aktif K3 Senin (1223) yang drop bulan lalu -> pindah ke K1 Rabu (1221).
        $loan = \App\Models\TransactionLoan::where('transaction_loan_officer_grouping_id', 1223)
            ->where('hari', 'senin')->where('status', 'success')->whereNull('pay_off_date')
            ->whereBetween('drop_date', [$bulanLalu, $akhirBulanLalu])->orderBy('id')->firstOrFail();
        $user = \App\Models\User::role('superuser')->whereHas('employee')->firstOrFail();

        $sebelumLaluPorto = \App\Helpers\HitungAgregat::portofolio($kantor, $akhirBulanLalu, $bulanLalu);
        $sebelumLaluHarian = \App\Helpers\HitungAgregat::harianBanyak($kantor, $bulanLalu, $akhirBulanLalu);

        auth()->login($user);
        $m = $M::catat($loan, 1221, 'rabu', $bulanIni, 'cek tahap 1', $user);
        $loan->refresh();
        $cek(\App\Models\TransactionLockHistory::where('created_at', '>=', now()->subMinute())->where('alasan', 'like', '%ubah pinjaman #' . $loan->id . '%')->doesntExist(), 'catat tidak membuka kunci hari drop lama');

        // 2. catat menimpa + mencatat.
        $cek((int) $loan->transaction_loan_officer_grouping_id === 1221 && $loan->hari === 'rabu', 'catat menimpa kolom pinjaman');
        $cek((int) $m->dari_grouping_id === 1223 && $m->dari_hari === 'senin' && (int) $m->ke_grouping_id === 1221 && $m->ke_hari === 'rabu', 'catat mencatat asal & tujuan');

        // 3. Helper: bulan lalu = asal, bulan ini = tujuan.
        $pada = fn ($ref) => DB::table(DB::raw('transaction_loans l'))->where('l.id', $loan->id)
            ->selectRaw($M::kelompokSql('l', $M::tgl($ref)) . ' g, ' . $M::hariSql('l', $M::tgl($ref)) . ' h')->first();
        $lalu = $pada($bulanLalu);
        $ini = $pada($bulanIni);
        $cek((int) $lalu->g === 1223 && $lalu->h === 'senin', 'bulan lalu: K3 senin');
        $cek((int) $ini->g === 1221 && $ini->h === 'rabu', 'bulan ini: K1 rabu');

        // 4. saring: bulan lalu pinjaman ada di 1223 senin, tidak di 1221 rabu; bulan ini sebaliknya.
        $ada = function ($g, $hari, $ref) use ($M, $loan) {
            $q = DB::table(DB::raw('transaction_loans l'))->where('l.id', $loan->id);
            $M::saring($q, 'l', [$g], $M::tgl($ref), $hari);
            return $q->exists();
        };
        $cek($ada(1223, 'senin', $bulanLalu) && !$ada(1221, 'rabu', $bulanLalu), 'saring bulan lalu');
        $cek(!$ada(1223, 'senin', $bulanIni) && $ada(1221, 'rabu', $bulanIni), 'saring bulan ini');

        // 5. penyesuaianBaca (dipakai buku storting): bulan lalu 1223 senin dapat 'masuk', 1221 rabu dapat 'keluar'; bulan ini kosong.
        $cek(in_array($loan->id, $M::penyesuaianBaca(1223, 'senin', $bulanLalu)['masuk']), 'penyesuaianBaca lalu: masuk ke K3 senin');
        $cek(in_array($loan->id, $M::penyesuaianBaca(1221, 'rabu', $bulanLalu)['keluar']), 'penyesuaianBaca lalu: keluar dari K1 rabu');
        $cek($M::penyesuaianBaca(1221, 'rabu', $bulanIni) === ['masuk' => [], 'keluar' => []], 'penyesuaianBaca bulan ini kosong');

        // Task 3 menambah cek agregat di bawah baris ini.
        // [CEK-TASK-3]
        $sesudahLaluPorto = \App\Helpers\HitungAgregat::portofolio($kantor, $akhirBulanLalu, $bulanLalu);
        $sesudahLaluHarian = \App\Helpers\HitungAgregat::harianBanyak($kantor, $bulanLalu, $akhirBulanLalu);
        $cek($sesudahLaluPorto == $sebelumLaluPorto, 'portofolio bulan lalu tidak bergeser');
        $cek($sesudahLaluHarian == $sebelumLaluHarian, 'harian (drop/storting) bulan lalu tidak bergeser');
        $portoIni = \App\Helpers\HitungAgregat::portofolio($kantor, $akhirBulanLalu, $bulanIni);
        $total = fn ($p) => array_sum(array_map('array_sum', $p));
        $cek($total($portoIni) === $total($sebelumLaluPorto), 'total kantor bulan ini = bulan lalu');
        $cek(array_sum($portoIni['1221|rabu'] ?? []) > array_sum($sebelumLaluPorto['1221|rabu'] ?? []), 'saldo K1 rabu bertambah di bulan ini');
        // Task 4 menambah cek rekap di bawah baris ini.
        // [CEK-TASK-4]
        $dropPer = function ($ids, $dari, $sampai) use ($M) {
            $g = $M::kelompokSql('transaction_loans', 'transaction_loans.drop_date');
            return \App\Models\TransactionLoan::query()
                ->tap(fn ($q) => $M::saring($q, 'transaction_loans', $ids, 'transaction_loans.drop_date'))
                ->where('status', 'success')->whereBetween('drop_date', [$dari, $sampai])
                ->groupByRaw($g)->selectRaw("$g AS g, SUM(nominal_drop) AS n")
                ->toBase()->get()->pluck('n', 'g')->map(fn ($n) => (int) $n)->all();
        };
        $dropLalu = $dropPer($kantor, $bulanLalu, $akhirBulanLalu);
        $cek(($dropLalu[1223] ?? 0) >= (int) $loan->nominal_drop, 'drop bulan lalu tetap di K3');
        $harianLalu = collect($sebelumLaluHarian)->groupBy(fn ($v, $k) => (int) explode('|', $k)[0], true)->map(fn ($c) => $c->sum('drop'))->all();
        $cek(($dropLalu[1223] ?? 0) === ($harianLalu[1223] ?? 0), 'drop rekap K3 = HitungAgregat');
        // Task 5 menambah cek daftar pinjaman di bawah baris ini.
        // [CEK-TASK-5]
        $daftar = function ($g, $hari, $bulan) use ($M) {
            return DB::table('transaction_loans as l')
                ->tap(fn ($q) => $M::saring($q, 'l', [$g], $M::tgl($bulan), $hari))
                ->where('l.status', 'success')
                ->whereBetween('l.drop_date', [$bulan, \Carbon\Carbon::parse($bulan)->endOfMonth()->toDateString()])
                ->pluck('l.id')->all();
        };
        $cek(in_array($loan->id, $daftar(1223, 'senin', $bulanLalu)), 'Daftar Nasabah bulan lalu: di K3 senin');
        $cek(!in_array($loan->id, $daftar(1221, 'rabu', $bulanLalu)), 'Daftar Nasabah bulan lalu: tidak di K1 rabu');

        // [CEK-TASK-9]
        // Pembaca bulan lalu sisa (N2-N5), lewat fungsi asli layar. Sidoarjo 5 (123) migrasi 2026-10-01.
        $props = fn ($resp) => (fn () => $this->props)->call($resp);
        $scope = function ($kelompok) {
            \App\Helpers\AuthScope::simpanFilterGlobal(['branch_id' => 123, 'kelompok' => $kelompok]);
        };
        $req = fn (array $isi) => \Illuminate\Http\Request::create('/', 'GET', $isi);
        // N2 getLoanByDate (SearchByDate): drop bulan lalu ada di K3 senin, tidak di K1 rabu.
        $idsByDate = fn ($kelompok, $hari) => (function () use ($scope, $kelompok, $req, $hari, $bulanLalu) {
            $scope($kelompok);
            return collect(\App\Http\Controllers\TransactionLoanController::getLoanByDate($req(['month' => substr($bulanLalu, 0, 7), 'hari' => $hari]))['datas'])->flatMap(fn ($b) => collect($b['data'])->pluck('id'))->all();
        })();
        $cek(in_array($loan->id, $idsByDate(3, 'senin')), 'getLoanByDate bulan lalu: di K3 senin');
        $cek(!in_array($loan->id, $idsByDate(1, 'rabu')), 'getLoanByDate bulan lalu: tidak di K1 rabu');
        // Pinjaman ML 873149 (K3 senin) jadi MACET LAMA palsu (rekeningnya dialihkan) lalu dipindah; 475836 (K10 selasa, punya penyesuaian 4168) dipindah; 2511802 (drop Sep, K3 senin) dipindah.
        $nikMl = \App\Http\Controllers\MigrasiController::NIK_MACET_LAMA;
        $custMl = \App\Models\TransactionCustomer::firstOrCreate(['nik' => $nikMl], ['nama' => \App\Http\Controllers\MigrasiController::NAMA_MACET_LAMA, 'alamat' => '-']);
        $ml = \App\Models\TransactionLoan::findOrFail(873149);
        DB::table('transaction_manage_customers')->where('id', $ml->transaction_manage_customer_id)->update(['transaction_customer_id' => $custMl->id]);
        $M::catat($ml, 1221, 'rabu', $bulanIni, 'cek tahap 1', $user);
        $adjLoan = \App\Models\TransactionLoan::findOrFail(475836);
        $M::catat($adjLoan, 1221, 'rabu', $bulanIni, 'cek tahap 1', $user);
        $sep = \App\Models\TransactionLoan::findOrFail(2511802);
        $M::catat($sep, 1221, 'rabu', $bulanIni, 'cek tahap 1', $user);
        // N3 MigrasiController: nasabahMacet K3 senin memuat 873149; kesiapan menandai MACET LAMA di K3 senin, tidak di K1 rabu.
        $scope(3);
        $nm = $props(app(\App\Http\Controllers\MigrasiController::class)->nasabahMacet($req(['kelompok' => 3, 'hari' => 'senin'])));
        $cek(collect($nm['datas'])->contains('id', 873149), 'nasabahMacet periode migrasi: ML di K3 senin');
        $nm1 = $props(app(\App\Http\Controllers\MigrasiController::class)->nasabahMacet($req(['kelompok' => 1, 'hari' => 'rabu'])));
        $cek(!collect($nm1['datas'])->contains('id', 873149), 'nasabahMacet periode migrasi: ML tidak di K1 rabu');
        $kes = app(\App\Http\Controllers\MigrasiController::class)->barisKesiapan(123, \Carbon\Carbon::parse('2026-10-01'))->keyBy('kunci');
        $cek(($kes['1223|senin']['macet_lama'] ?? false) && !($kes['1221|rabu']['macet_lama'] ?? false), 'barisKesiapan: MACET LAMA di K3 senin, tidak di K1 rabu');
        // N4 SelisihMigrasi: macetLama & penyesuaianMl ber-key resort pada bulan migrasi.
        $priv = fn ($nama, ...$arg) => (new \ReflectionMethod(\App\Helpers\SelisihMigrasi::class, $nama))->invoke(null, ...$arg);
        $smMl = $priv('macetLama', $kantor, \Carbon\Carbon::parse('2026-10-01'));
        $cek((int) ($smMl['1223|senin']->id ?? 0) === 873149 && !isset($smMl['1221|rabu']), 'SelisihMigrasi::macetLama: K3 senin');
        $smAdj = $priv('penyesuaianMl', $kantor, \Carbon\Carbon::parse('2026-10-01'));
        $cek(collect($smAdj['1230|selasa'] ?? [])->contains('id', 4168) && !collect($smAdj['1221|rabu'] ?? [])->contains('id', 4168), 'SelisihMigrasi::penyesuaianMl: K10 selasa');
        // N5 KoreksiBeku: index Sep (bulan sebelum migrasi) K3 senin memuat 2511802; buku Sep K3 senin -> MACET LAMA 873149.
        $kb = app(\App\Http\Controllers\KoreksiBekuController::class);
        $scope(3);
        $cek(collect($props($kb->index($req(['bulan' => '2026-09', 'hari' => 'senin'])))['nasabah'])->contains('id', 2511802), 'KoreksiBeku index Sep: di K3 senin');
        $scope(1);
        $cek(!collect($props($kb->index($req(['bulan' => '2026-09', 'hari' => 'rabu'])))['nasabah'])->contains('id', 2511802), 'KoreksiBeku index Sep: tidak di K1 rabu');
        // Rekening 873149 juga memegang 468904 (tetap K3 senin), jadi K3 senin bisa menjawab salah satunya; pembedanya K1 rabu.
        $scope(3);
        $cek(in_array((int) $props($kb->buku($req(['month' => '2026-09', 'hari' => 'senin'])))['beku']['macet_lama_id'], [873149, 468904]), 'KoreksiBeku buku Sep: MACET LAMA K3 senin');
        $scope(1);
        $cek((int) $props($kb->buku($req(['month' => '2026-09', 'hari' => 'rabu'])))['beku']['macet_lama_id'] !== 873149, 'KoreksiBeku buku Sep: MACET LAMA pindahan tidak di K1 rabu');
        // [CEK-TASK-10]
        // N6 penulis bertanggal mundur: baris dicap resort PADA tanggal transaksi / berlaku_bulan.
        $cek($M::kelompokPada($loan, $akhirBulanLalu) === 1223 && $M::hariPada($loan, $akhirBulanLalu) === 'senin', 'kelompokPada/hariPada bulan lalu: K3 senin');
        $cek($M::kelompokPada($loan, $bulanIni) === 1221 && $M::hariPada($loan, $bulanIni) === 'rabu', 'kelompokPada/hariPada bulan ini: K1 rabu');
        // bayar_pinjaman headless (user superuser login). Angsuran lama di tanggal itu dihapus lewat model: hook Gembok membuka kunci kasir resmi.
        $ctl = app(\App\Http\Controllers\TransactionLoanController::class);
        $Ang = \App\Models\TransactionLoanInstalment::class;
        $seninLalu = \Carbon\Carbon::parse($bulanLalu)->lastOfMonth(\Carbon\Carbon::MONDAY)->toDateString();
        $rabuIni = \Carbon\Carbon::parse($bulanIni)->firstOfMonth(\Carbon\Carbon::WEDNESDAY)->toDateString();
        $bayar = function ($tgl) use ($ctl, $loan, $Ang) {
            $Ang::where('transaction_loan_id', $loan->id)->whereDate('transaction_date', $tgl)->get()->each->delete();
            session()->forget('errors');
            $ctl->bayar_pinjaman(\Illuminate\Http\Request::create('/', 'POST', ['type_transaksi' => 'bayar', 'nominal' => 1000, 'transaction_date' => $tgl]), $loan->fresh());
            return [(int) $Ang::where('transaction_loan_id', $loan->id)->whereDate('transaction_date', $tgl)->value('transaction_loan_officer_grouping_id'), (string) session('errors')?->first()];
        };
        [$gLalu, $eLalu] = $bayar($seninLalu);
        $cek($gLalu === 1223, "bayar_pinjaman $seninLalu (bulan lalu): angsuran di K3 ($gLalu $eLalu)");
        // Bulan ini hari tagihnya Rabu (tahap 2 T1). Kalau Rabu itu belum tiba, jam dimajukan ke sana.
        \Carbon\Carbon::setTestNow(max(now(), \Carbon\Carbon::parse($rabuIni)->setTime(10, 0)));
        [$gIni, $eIni] = $bayar($rabuIni);
        \Carbon\Carbon::setTestNow();
        $cek($gIni === 1221, "bayar_pinjaman $rabuIni (bulan ini): angsuran di K1 ($gIni $eIni)");
        // white_off_loan bulan lalu: kunci diperiksa & baris dicap K3 (hari itu sudah dibuka di atas).
        session()->forget('errors');
        $ctl->white_off_loan($loan->fresh(), \Illuminate\Http\Request::create('/', 'POST', ['nominal' => 1000, 'transaction_date' => $seninLalu]));
        $gWo = (int) \App\Models\TransactionWhiteOff::where('transaction_loan_id', $loan->id)->value('transaction_loan_officer_grouping_id');
        $cek($gWo === 1223, "white_off_loan $seninLalu: pemutihan di K3 ($gWo " . session('errors')?->first() . ')');
        // KoreksiBeku 'tambah' Sep (sebelum migrasi Okt) untuk 2511802 (dipindah K3 senin -> K1 rabu di atas).
        $kbHasil = \App\Helpers\KoreksiBeku::jalankan('tambah', ['loan_id' => $sep->id, 'tanggal' => '2026-09-14', 'nominal' => 1000], 'cek tahap 1');
        $gKb = (int) $Ang::where('transaction_loan_id', $sep->id)->whereDate('transaction_date', '2026-09-14')->latest('id')->value('transaction_loan_officer_grouping_id');
        $cek($gKb === 1223, "KoreksiBeku tambah Sep: angsuran di K3 ($gKb)");
        $cek(collect($kbHasil['dampak'])->contains(fn ($d) => $d['periode'] === '2026-10' && (int) $d['kelompok'] === 3 && $d['hari'] === 'senin'), 'KoreksiBeku tambah Sep: saldo Okt K3 senin ikut ditulis ulang');
        // oper: 475836 & 601224 di K10 selasa saat bulan migrasi, sekarang keduanya K1 rabu.
        $c601 = \App\Models\TransactionLoan::findOrFail(601224);
        $M::catat($c601, 1221, 'rabu', $bulanIni, 'cek tahap 1', $user);
        $eOper = '';
        try {
            \App\Helpers\PenyesuaianSaldo::oper($adjLoan->fresh(), $c601->fresh(), 1000, 'cek tahap 1', $user);
        } catch (\Throwable $e) {
            $eOper = $e->getMessage();
        }
        $gOper = \App\Models\TransactionSaldoAdjustment::whereIn('transaction_loan_id', [$adjLoan->id, $c601->id])->where('catatan', 'like', 'oper %')->pluck('transaction_loan_officer_grouping_id')->map(fn ($g) => (int) $g)->unique()->values()->all();
        $cek($gOper === [1230], 'oper: penyesuaian dicap K10 (bulan migrasi) ' . json_encode($gOper) . " $eOper");
    } finally {
        \Carbon\Carbon::setTestNow();
        DB::rollBack();
    }
    echo "\n" . ($gagal ? "$gagal GAGAL" : 'SEMUA OK') . "\n";
})();
