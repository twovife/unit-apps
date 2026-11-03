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
    } finally {
        \Carbon\Carbon::setTestNow();
        DB::rollBack();
    }
    echo "\n" . ($gagal ? "$gagal GAGAL" : 'SEMUA OK') . "\n";
})();
