// Cek tahap 1 rombak resort (tanpa <?php: isinya disuapkan ke tinker). Jalankan:
//   tr '\n' ' ' < scripts/cek_rombak_tahap1.php | docker exec -i unit-app php artisan tinker
// Semua perubahan di-rollback. Hanya untuk DB lokal (salinan prod).
(function () {
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

        $m = $M::catat($loan, 1221, 'rabu', $bulanIni, 'cek tahap 1', $user);
        $loan->refresh();

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
    } finally {
        DB::rollBack();
    }
    echo "\n" . ($gagal ? "$gagal GAGAL" : 'SEMUA OK') . "\n";
})();
