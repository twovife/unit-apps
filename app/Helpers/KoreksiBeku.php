<?php

namespace App\Helpers;

use App\Models\TransactionKoreksiBeku;
use App\Models\TransactionLoan;
use App\Models\TransactionLoanInstalment;
use App\Models\TransactionLoanOfficerGrouping;
use App\Models\TransactionMonthlyClosing;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * Koreksi angsuran bertanggal SEBELUM migrasi kantor (data beku).
 *
 * Data sebelum `branches.mulai_pendataan_baru` dibekukan trigger tanpa
 * pengecualian. Kesalahan lama yang baru ketahuan sesudah migrasi (angsuran
 * tercatat ke nasabah yang salah, angsuran ditambah sesudah bucket ditutup)
 * dibetulkan di sini - superuser saja, alasan wajib, dan:
 *
 *   1. trigger beku dibuka lewat `@koreksi_beku = 1` hanya selama satu aksi
 *      (migrasi app_laravel 2026_10_11_100000);
 *   2. baris bulanan dihitung ulang dari bulan migrasi s/d bulan depan,
 *      TERMASUK saldo awal yang sudah diserahterimakan (keputusan mas
 *      2026-10-11, opsi a) - baris yang sudah diteken ditulis ulang dengan
 *      jejak di riwayat kunci;
 *   3. satu baris log di transaction_koreksi_beku: sebelum/sesudah angsuran
 *      dan dampak ke saldo awal/akhir per ember per bulan.
 *
 * Pratinjau ($simpan = false) menjalankan koreksi yang sama persis lalu
 * rollback - angka dampaknya pasti sama dengan hasil sesudah disimpan.
 */
class KoreksiBeku
{
    public const AKSI = ['ubah', 'hapus', 'tambah'];

    private const KOLOM = [
        'awal_month1', 'awal_month2', 'awal_ccm', 'awal_cm', 'awal_mb', 'awal_ml',
        'awal_total', 'akhir_total',
    ];

    /**
     * @param array $data ubah: angsuran_id, nominal | hapus: angsuran_id |
     *                    tambah: loan_id, tanggal, nominal
     * @return array{dampak:array, log_id:?int}
     * @throws \RuntimeException pesan untuk ditampilkan ke user
     */
    public static function jalankan(string $aksi, array $data, string $alasan, bool $simpan = true): array
    {
        $user = auth()->user();
        if (!$user?->hasRole('superuser')) {
            throw new \RuntimeException('Koreksi data beku hanya untuk superuser.');
        }
        if (!in_array($aksi, self::AKSI, true)) {
            throw new \RuntimeException('Aksi tidak dikenal.');
        }
        // Alasan boleh kosong (mas 2026-10-23): diisi bawaan.
        $alasan = trim($alasan) ?: 'selisih penyesuaian';

        $angsuran = in_array($aksi, ['ubah', 'hapus'], true)
            ? TransactionLoanInstalment::findOrFail($data['angsuran_id'] ?? 0)
            : null;
        $loan = $angsuran ? $angsuran->loan : TransactionLoan::findOrFail($data['loan_id'] ?? 0);
        $branchId = (int) TransactionLoanOfficerGrouping::whereKey($loan->transaction_loan_officer_grouping_id)->value('branch_id');
        $mulai = AgregasiScope::tanggalMulai($branchId);

        if (!$mulai) {
            throw new \RuntimeException('Kantor ini belum migrasi - datanya tidak beku, ubah lewat menu biasa.');
        }

        $tanggal = $angsuran ? Carbon::parse($angsuran->transaction_date) : Carbon::parse($data['tanggal'] ?? '');
        if (!$tanggal->lt($mulai)) {
            throw new \RuntimeException('Hanya angsuran bertanggal sebelum migrasi (' . $mulai->toDateString() . '). Sesudahnya ubah lewat menu biasa.');
        }
        if ($angsuran?->settled_by_loan_id) {
            throw new \RuntimeException('Angsuran ini pelunasan otomatis topup - tidak bisa dikoreksi di sini.');
        }

        $nominal = null;
        if (in_array($aksi, ['ubah', 'tambah'], true)) {
            $nominal = (int) ($data['nominal'] ?? -1);
            if ($nominal < ($aksi === 'tambah' ? 1 : 0)) {
                throw new \RuntimeException('Nominal tidak valid.');
            }
        }
        if ($aksi === 'tambah' && $tanggal->lt(Carbon::parse($loan->drop_date)->startOfDay())) {
            throw new \RuntimeException('Tanggal angsuran sebelum tanggal drop pinjaman.');
        }

        // Hanya kelompok pinjaman ini (mas 2026-10-24): kelompok lain tidak berubah oleh koreksi.
        $ids = [(int) $loan->transaction_loan_officer_grouping_id];
        $bulan = [];
        for ($b = $mulai->copy()->startOfMonth(); $b->lte(Carbon::now()->startOfMonth()->addMonthNoOverflow()); $b->addMonthNoOverflow()) {
            $bulan[] = $b->copy();
        }

        DB::beginTransaction();
        try {
            $potretAwal = self::potret($ids, $bulan);
            $sebelum = $angsuran ? self::isi($angsuran) : null;
            // Dampak = hitungan SESUDAH - SEBELUM koreksi, keduanya dari data sekarang.
            // Angka tersimpan yang belum mengikuti data (hari belum dikunci) tidak ikut
            // terbawa: yang ditulis hanya selisih akibat koreksi (mas 2026-10-24).
            $hitungSemua = fn() => array_map(fn($b) => TutupBulanan::hitung($ids, $b), $bulan);
            $hitungSebelum = $hitungSemua();

            DB::statement('SET @koreksi_beku = 1');
            try {
                $sesudah = self::kerjakan($aksi, $angsuran, $loan, $tanggal, $nominal, $user);
            } finally {
                DB::statement('SET @koreksi_beku = NULL');
            }

            $hitungSesudah = $hitungSemua();
            $perbarui = [
                'employee_id' => $user->employee?->id,
                'sumber' => 'koreksi data beku (' . $aksi . '): ' . trim($alasan),
            ];
            foreach ($bulan as $i => $b) {
                foreach (array_unique(array_merge(array_keys($hitungSebelum[$i]), array_keys($hitungSesudah[$i]))) as $k) {
                    $selisih = [];
                    foreach (array_diff_key($hitungSesudah[$i][$k] ?? $hitungSebelum[$i][$k], ['hari_kerja' => 0, 'hari_terkunci' => 0]) as $kolom => $_) {
                        $d = ($hitungSesudah[$i][$k][$kolom] ?? 0) - ($hitungSebelum[$i][$k][$kolom] ?? 0);
                        if ($d !== 0) {
                            $selisih[$kolom] = $d;
                        }
                    }
                    if (!$selisih) {
                        continue;
                    }
                    [$g, $hari] = explode('|', $k);
                    $baris = TransactionMonthlyClosing::where('transaction_loan_officer_grouping_id', $g)
                        ->where('hari', $hari)->whereDate('periode', $b->toDateString())->first();
                    if ($baris) {
                        TutupBulanan::tambahkan($baris, $selisih, $perbarui);
                    } else {
                        TransactionMonthlyClosing::create(array_merge($hitungSesudah[$i][$k], [
                            'transaction_loan_officer_grouping_id' => $g, 'hari' => $hari, 'periode' => $b->toDateString(),
                        ]));
                    }
                }
            }

            $dampak = self::selisih($potretAwal, self::potret($ids, $bulan));
            $logId = null;

            if ($simpan) {
                $logId = TransactionKoreksiBeku::create([
                    'branch_id' => $branchId,
                    'transaction_loan_id' => $loan->id,
                    'transaction_loan_instalment_id' => $angsuran?->id ?? ($sesudah['id'] ?? null),
                    'aksi' => $aksi,
                    'sebelum' => $sebelum,
                    'sesudah' => $aksi === 'hapus' ? null : $sesudah,
                    'dampak' => $dampak,
                    'alasan' => trim($alasan),
                    'user_id' => $user->id,
                ])->id;
                DB::commit();
            } else {
                DB::rollBack();
            }
        } catch (\Throwable $e) {
            DB::rollBack();
            throw $e;
        }

        return ['dampak' => $dampak, 'log_id' => $logId];
    }

    private static function kerjakan(string $aksi, ?TransactionLoanInstalment $angsuran, TransactionLoan $loan, Carbon $tanggal, ?int $nominal, $user): ?array
    {
        switch ($aksi) {
            case 'ubah':
                $angsuran->update(['nominal' => $nominal]);
                $loan->hitungUlangPelunasan();
                return self::isi($angsuran->fresh());

            case 'hapus':
                $angsuran->delete();
                return null;

            case 'tambah':
                $baru = TransactionLoanInstalment::create([
                    'transaction_loan_id' => $loan->id,
                    'transaction_loan_officer_grouping_id' => $loan->transaction_loan_officer_grouping_id,
                    'transaction_date' => $tanggal->toDateString(),
                    'nominal' => $nominal,
                    'status' => AppHelper::generateStatusAngsuran($loan->drop_date, $tanggal->toDateString()),
                    'danatitipan' => 0,
                    'is_transfer' => false,
                    'user_input' => $user->employee?->id,
                    'user_mantri' => $loan->user_mantri,
                ]);
                return self::isi($baru);
        }

        return null;
    }

    /** Keadaan satu angsuran untuk log. */
    private static function isi(TransactionLoanInstalment $a): array
    {
        $loan = TransactionLoan::with('customer')->find($a->transaction_loan_id);

        return [
            'id' => $a->id,
            'transaction_loan_id' => $a->transaction_loan_id,
            'nasabah' => $loan?->customer?->nama,
            'drop_date' => $loan ? Carbon::parse($loan->drop_date)->toDateString() : null,
            'tanggal' => Carbon::parse($a->transaction_date)->toDateString(),
            'nominal' => (int) $a->nominal,
        ];
    }

    /** Saldo awal per ember + akhir total, per "Y-m|kelompok|hari". */
    private static function potret(array $ids, array $bulan): array
    {
        return TransactionMonthlyClosing::with('loan_officer_grouping:id,kelompok')
            ->whereIn('transaction_loan_officer_grouping_id', $ids)
            ->whereIn('periode', array_map(fn($b) => $b->toDateString(), $bulan))
            ->get()
            ->mapWithKeys(fn($r) => [
                Carbon::parse($r->periode)->format('Y-m') . '|' . $r->loan_officer_grouping?->kelompok . '|' . $r->hari
                    => collect(self::KOLOM)->mapWithKeys(fn($k) => [$k => (int) $r->$k])->all(),
            ])->all();
    }

    /** Hanya baris & kolom yang berubah: [{periode, kelompok, hari, kolom: {k: [sebelum, sesudah]}}]. */
    private static function selisih(array $sebelum, array $sesudah): array
    {
        $hasil = [];
        foreach (array_unique(array_merge(array_keys($sebelum), array_keys($sesudah))) as $k) {
            $kolom = [];
            foreach (self::KOLOM as $c) {
                $a = $sebelum[$k][$c] ?? 0;
                $b = $sesudah[$k][$c] ?? 0;
                if ($a !== $b) {
                    $kolom[$c] = [$a, $b];
                }
            }
            if ($kolom) {
                [$periode, $kelompok, $hari] = explode('|', $k);
                $hasil[] = compact('periode', 'kelompok', 'hari', 'kolom');
            }
        }
        usort($hasil, fn($x, $y) => [$x['periode'], (int) $x['kelompok'], $x['hari']] <=> [$y['periode'], (int) $y['kelompok'], $y['hari']]);

        return $hasil;
    }
}
