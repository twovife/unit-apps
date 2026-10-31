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
            $penyesuaian = self::penyesuaianMl($kelompok->keys()->all(), $periode);

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
                    'penyesuaian' => $selisih['ml'] !== 0 ? ($penyesuaian[$kunci] ?? []) : [],
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
     * Penyesuaian saldo pinjaman ember ML (bulan migrasi) per "groupingId|hari" - calon yang
     * bisa dikoreksi sebesar selisih ML (mas 2026-10-27: dipilih manual, bukan otomatis).
     * MACET LAMA (tombolnya sendiri) & pasangan Input ML (PecahanMacetLama) tidak ikut.
     */
    private static function penyesuaianMl(array $groupingIds, Carbon $periode): array
    {
        $hasil = [];
        $rows = DB::table('transaction_saldo_adjustments as a')
            ->join('transaction_loans as l', 'l.id', '=', 'a.transaction_loan_id')
            ->join('transaction_manage_customers as m', 'm.id', '=', 'l.transaction_manage_customer_id')
            ->join('transaction_customers as c', 'c.id', '=', 'm.transaction_customer_id')
            ->whereIn('a.transaction_loan_officer_grouping_id', $groupingIds)
            ->where('c.nik', '<>', MigrasiController::NIK_MACET_LAMA)
            ->where(fn($q) => $q->whereNull('l.notes')->orWhere('l.notes', 'not like', PecahanMacetLama::CATATAN . '%'))
            ->get(['a.id', 'a.transaction_loan_officer_grouping_id as g', 'l.hari', 'l.drop_date', 'c.nama', 'a.jenis', 'a.nominal', 'a.berlaku_bulan', 'a.catatan']);
        foreach ($rows as $a) {
            if (Ember::kategori(Ember::dari($a->drop_date, $periode)) !== 'ml') {
                continue;
            }
            $hasil[$a->g . '|' . strtolower($a->hari)][] = [
                'id' => $a->id, 'nama' => $a->nama, 'jenis' => $a->jenis, 'nominal' => (int) $a->nominal,
                'berlaku' => Carbon::parse($a->berlaku_bulan)->format('Y-m'), 'catatan' => $a->catatan,
                'drop' => Carbon::parse($a->drop_date)->toDateString(),
            ];
        }

        return $hasil;
    }

    /**
     * Samakan ML sistem dengan bucket dengan mengoreksi SATU penyesuaian yang dipilih:
     * efeknya digeser sebesar Z (nominal ± Z sesuai arah jenis; nol = dihapus). Pengaman:
     * sesudahnya ML sistem harus tepat = bucket, kalau tidak batal. Baris bulanan ikut.
     */
    public static function sesuaikanPenyesuaian(int $adjId, $user): array
    {
        $adj = TransactionSaldoAdjustment::findOrFail($adjId);
        $loan = TransactionLoan::findOrFail($adj->transaction_loan_id);
        $groupingId = (int) $adj->transaction_loan_officer_grouping_id;
        $hari = strtolower($loan->hari);
        $baris = collect(self::pindai([DB::table('transaction_loan_officer_groupings')->where('id', $groupingId)->value('branch_id')], true))
            ->first(fn($b) => $b['grouping_id'] === $groupingId && $b['hari'] === $hari);
        if (!$baris || !collect($baris['penyesuaian'])->contains('id', $adjId)) {
            throw new \RuntimeException('Penyesuaian ini bukan calon koreksi selisih ML kelompok & hari itu.');
        }
        $z = $baris['bucket']['ml'] - $baris['sistem']['ml'];
        if ($z === 0 || !isset(TransactionSaldoAdjustment::ARAH[$adj->jenis])) {
            throw new \RuntimeException('Tidak ada selisih ML / jenis penyesuaian tidak dikenal.');
        }
        $nominal = (int) $adj->nominal + TransactionSaldoAdjustment::ARAH[$adj->jenis] * $z;
        if ($nominal < 0) {
            throw new \RuntimeException('Nominal penyesuaian (' . number_format($adj->nominal, 0, ',', '.') . ') kurang untuk digeser ' . number_format(abs($z), 0, ',', '.') . '.');
        }
        $catatan = 'Cek Selisih Migrasi: penyesuaian #' . $adjId . ' (' . $baris['penyesuaian'][array_search($adjId, array_column($baris['penyesuaian'], 'id'))]['nama'] . ') '
            . number_format($adj->nominal, 0, ',', '.') . ' -> ' . number_format($nominal, 0, ',', '.');

        return DB::transaction(function () use ($adj, $nominal, $baris, $groupingId, $hari, $z, $catatan, $user) {
            $bulan = self::bulanSejak(Carbon::parse($baris['mulai']));
            $hitung = fn() => array_map(fn($b) => TutupBulanan::hitung([$groupingId], $b), $bulan);
            $sebelum = $hitung();
            $nominal === 0 ? $adj->delete() : $adj->update(['nominal' => $nominal]);

            $kunci = $groupingId . '|' . $hari;
            $s = HitungAgregat::portofolio([$groupingId], Carbon::parse($baris['mulai'])->subDay(), $baris['mulai'])[$kunci] ?? [];
            if (array_sum(array_intersect_key($s, array_flip(Ember::KATEGORI['ml']))) !== $baris['bucket']['ml']) {
                throw new \RuntimeException('Sesudah dikoreksi ML belum sama dengan bucket (saldo nasabah habis / pindah ember) - dibatalkan, pakai MACET LAMA.');
            }
            self::geserBulanan($bulan, $sebelum, $hitung(), $catatan, $user);

            $hasil = ['kantor' => $baris['kantor'], 'kelompok' => $baris['kelompok'], 'hari' => $hari, 'z' => $z, 'adj_id' => $adj->id, 'user_id' => $user->id];
            Log::info($catatan, $hasil);

            return $hasil;
        });
    }

    /** Bulan migrasi s/d bulan depan (baris bulanan yang mungkin tersimpan). */
    private static function bulanSejak(Carbon $mulai): array
    {
        $bulan = [];
        for ($b = $mulai->copy(); $b->lte(Carbon::now()->startOfMonth()->addMonthNoOverflow()); $b->addMonthNoOverflow()) {
            $bulan[] = $b->copy();
        }

        return $bulan;
    }

    /** Selisih hitung sebelum/sesudah ditambahkan ke baris bulanan tersimpan (jejak 'perbarui'). */
    private static function geserBulanan(array $bulan, array $sebelum, array $sesudah, string $catatan, $user): void
    {
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
        $bulan = self::bulanSejak($mulai);
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
            self::geserBulanan($bulan, $sebelum, $hitung(), $catatan, $user);

            $hasil = ['kantor' => $baris['kantor'], 'kelompok' => $baris['kelompok'], 'hari' => $hari, 'z' => $z, 'user_id' => $user->id];
            Log::info('Cek Selisih Migrasi: MACET LAMA disesuaikan', $hasil);

            return $hasil;
        });
    }
}
