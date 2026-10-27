<?php

namespace App\Helpers;

use App\Http\Controllers\MigrasiController;
use App\Models\TransactionCustomer;
use App\Models\TransactionLoan;
use App\Models\TransactionManageCustomer;
use App\Models\TransactionMonthlyClosing;
use App\Models\TransactionSaldoAdjustment;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * Cek Selisih Migrasi (superuser, mas 2026-10-27): saldo awal bulan migrasi per kelompok x
 * hari dibandingkan lagi dengan bucket serah terima (transaction_sirculations), sesudah
 * kantor migrasi. Selisih ML dibetulkan lewat MACET LAMA (penampung Z); selisih lancar/CM/MB
 * hanya ditampilkan (penyebabnya harus dicek manual).
 *
 * Contoh kasus: perbaikan tanggal lunas membuat saldo nasabah terhitung, padahal MACET LAMA
 * sudah menampungnya saat migrasi -> ML dobel (Gresik 1 kel 1 kamis +112.000); atau kantor
 * migrasi dengan Z positif tanpa MACET LAMA -> ML kurang.
 */
class SelisihMigrasi
{
    /** @return array<int,array> baris yang selisih (atau semua kalau $semua) */
    public static function pindai(array $branchIds, bool $semua = false): array
    {
        $hasil = [];
        foreach (DB::table('branches')->whereIn('id', $branchIds)->whereNotNull('mulai_pendataan_baru')->get(['id', 'unit', 'mulai_pendataan_baru']) as $b) {
            $periode = Carbon::parse($b->mulai_pendataan_baru)->startOfMonth();
            $kelompok = DB::table('transaction_loan_officer_groupings')->where('branch_id', $b->id)->pluck('kelompok', 'id');
            $sistem = HitungAgregat::portofolio($kelompok->keys()->all(), $periode->copy()->subDay(), $periode);
            $bucket = DB::table('transaction_sirculations')->whereIn('transaction_loan_officer_grouping_id', $kelompok->keys())
                ->whereDate('date', $periode)->get()
                ->groupBy(fn($r) => $r->transaction_loan_officer_grouping_id . '|' . strtolower(trim($r->day)));
            $macetLama = self::macetLama($kelompok->keys()->all());

            foreach ($bucket as $kunci => $rows) {
                if ($rows->count() !== 1) {
                    continue; // dobel / kosong: urusan layar Kesiapan
                }
                $r = $rows->first();
                $s = array_merge(array_fill_keys(Ember::SEMUA, 0), $sistem[$kunci] ?? []);
                $kat = array_map(fn($isi) => array_sum(array_intersect_key($s, array_flip($isi))), Ember::KATEGORI);
                $lama = [
                    'lancar' => (int) $r->amount - (int) $r->cm_amount - (int) $r->mb_amount - (int) $r->ml_amount,
                    'cm' => (int) $r->cm_amount,
                    'mb' => (int) $r->mb_amount,
                    'ml' => (int) $r->ml_amount,
                ];
                $selisih = array_map(fn($k) => $kat[$k] - $lama[$k], array_combine(array_keys($lama), array_keys($lama)));
                if (!$semua && !array_filter($selisih)) {
                    continue;
                }
                [$g, $hari] = explode('|', $kunci);
                $ml = $macetLama[$kunci] ?? null;
                $hasil[] = [
                    'kantor' => $b->unit, 'branch_id' => $b->id, 'mulai' => $periode->toDateString(),
                    'grouping_id' => (int) $g, 'kelompok' => $kelompok[$g], 'hari' => $hari,
                    'bucket' => $lama, 'sistem' => $kat, 'selisih' => $selisih,
                    'macet_lama' => $ml ? ['id' => $ml->id, 'saldo' => (int) PenyesuaianSaldo::hitungSaldo($ml)['saldo']] : null,
                ];
            }
        }

        return $hasil;
    }

    /** Pinjaman MACET LAMA per "groupingId|hari". */
    private static function macetLama(array $groupingIds): array
    {
        return TransactionLoan::whereIn('transaction_loan_officer_grouping_id', $groupingIds)
            ->whereHas('manage_customer.customers', fn($c) => $c->where('nik', MigrasiController::NIK_MACET_LAMA))
            ->where('status', 'success')->get()
            ->keyBy(fn($l) => $l->transaction_loan_officer_grouping_id . '|' . strtolower($l->hari))->all();
    }

    /**
     * Samakan ML sistem dengan bucket lewat MACET LAMA, lalu baris bulanan tersimpan ikut
     * (selisih hitung sebelum/sesudah ditambahkan, jejak 'perbarui'). Penyesuaian berlaku
     * SEBULAN SEBELUM migrasi -> masuk saldo awal bulan migrasi, tidak jadi "saldo masuk".
     */
    public static function sesuaikanMl(int $groupingId, string $hari, $user): array
    {
        $baris = collect(self::pindai([DB::table('transaction_loan_officer_groupings')->where('id', $groupingId)->value('branch_id')], true))
            ->first(fn($b) => $b['grouping_id'] === $groupingId && $b['hari'] === $hari);
        if (!$baris) {
            throw new \RuntimeException('Kelompok x hari ini tidak ada di bucket serah terima.');
        }
        $z = $baris['bucket']['ml'] - $baris['sistem']['ml']; // + = ML sistem kurang
        if ($z === 0) {
            throw new \RuntimeException('ML sudah sama dengan bucket.');
        }
        $mulai = Carbon::parse($baris['mulai']);
        $berlaku = $mulai->copy()->subMonthNoOverflow()->toDateString();
        $bulan = [];
        for ($b = $mulai->copy(); $b->lte(Carbon::now()->startOfMonth()->addMonthNoOverflow()); $b->addMonthNoOverflow()) {
            $bulan[] = $b->copy();
        }
        $hitung = fn() => array_map(fn($b) => TutupBulanan::hitung([$groupingId], $b), $bulan);
        $ml = $baris['macet_lama'] ? TransactionLoan::find($baris['macet_lama']['id']) : null;
        if ($z < 0 && (!$ml || $baris['macet_lama']['saldo'] < -$z)) {
            throw new \RuntimeException('ML lebih ' . number_format(-$z, 0, ',', '.') . ' tapi saldo MACET LAMA tidak cukup untuk dikurangi - cek manual.');
        }

        return DB::transaction(function () use ($baris, $z, $berlaku, $bulan, $hitung, $ml, $groupingId, $hari, $user) {
            $sebelum = $hitung();
            $adj = fn(int $loanId, string $jenis, int $n, string $catatan) => TransactionSaldoAdjustment::create([
                'transaction_loan_id' => $loanId, 'transaction_loan_officer_grouping_id' => $groupingId,
                'jenis' => $jenis, 'nominal' => $n, 'berlaku_bulan' => $berlaku,
                'user_input' => $user->employee->id, 'catatan' => $catatan,
            ]);
            $catatan = 'Cek Selisih Migrasi: ML ' . ($z > 0 ? 'kurang ' : 'lebih ') . number_format(abs($z), 0, ',', '.') . ' terhadap bucket';

            if ($z < 0) {
                $adj($ml->id, TransactionSaldoAdjustment::JENIS_SALDO_AWAL, -$z, $catatan);
            } elseif ($ml) {
                $adj($ml->id, TransactionSaldoAdjustment::JENIS_KURANG_INPUT, $z, $catatan);
            } else {
                // MACET LAMA baru (= MigrasiController::buatMacetLama), drop 2020 -> trigger beku dibuka satu aksi.
                $customer = TransactionCustomer::firstOrCreate(['nik' => MigrasiController::NIK_MACET_LAMA], ['nama' => 'MACET LAMA', 'alamat' => '-']);
                $drop = Carbon::parse('2019-12-31')->next(AppHelper::getNumbDays($hari));
                $rekening = TransactionManageCustomer::firstOrCreate([
                    'transaction_customer_id' => $customer->id, 'transaction_loan_officer_grouping_id' => $groupingId, 'day' => $drop->dayOfWeek,
                ]);
                DB::statement('SET @koreksi_beku = 1');
                try {
                    $id = DB::table('transaction_loans')->insertGetId([
                        'transaction_manage_customer_id' => $rekening->id, 'transaction_loan_officer_grouping_id' => $groupingId,
                        'request_date' => $drop->toDateString(), 'drop_date' => $drop->toDateString(), 'hari' => $hari,
                        'status' => 'success', 'nominal_drop' => (int) ceil($z / 1.3),
                        'user_input' => $user->employee->id, 'user_mantri' => $user->employee->id, 'user_drop' => $user->employee->id,
                        'created_at' => now(), 'updated_at' => now(),
                    ]);
                } finally {
                    DB::statement('SET @koreksi_beku = NULL');
                }
                $lebih = (int) TransactionLoan::find($id)->pinjaman - $z;
                if ($lebih > 0) {
                    $adj($id, TransactionSaldoAdjustment::JENIS_SALDO_AWAL, $lebih, 'Penampung Z (MACET LAMA), ' . $catatan);
                }
            }

            // Baris bulanan tersimpan ikut digeser selisihnya.
            $sesudah = $hitung();
            $perbarui = ['employee_id' => $user->employee?->id, 'sumber' => $catatan];
            foreach ($bulan as $i => $b) {
                foreach (array_unique(array_merge(array_keys($sebelum[$i]), array_keys($sesudah[$i]))) as $k) {
                    $sel = [];
                    foreach (array_diff_key($sesudah[$i][$k] ?? $sebelum[$i][$k], ['hari_kerja' => 0, 'hari_terkunci' => 0]) as $kol => $_) {
                        $d = ($sesudah[$i][$k][$kol] ?? 0) - ($sebelum[$i][$k][$kol] ?? 0);
                        if ($d !== 0) {
                            $sel[$kol] = $d;
                        }
                    }
                    if (!$sel) {
                        continue;
                    }
                    [$g, $h] = explode('|', $k);
                    $row = TransactionMonthlyClosing::where('transaction_loan_officer_grouping_id', $g)->where('hari', $h)
                        ->whereDate('periode', $b->toDateString())->first();
                    if ($row) {
                        TutupBulanan::tambahkan($row, $sel, $perbarui);
                    }
                }
            }

            $hasil = ['kantor' => $baris['kantor'], 'kelompok' => $baris['kelompok'], 'hari' => $hari, 'z' => $z, 'user_id' => $user->id];
            Log::info('Cek Selisih Migrasi: MACET LAMA disesuaikan', $hasil);

            return $hasil;
        });
    }
}
