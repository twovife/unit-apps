<?php

namespace App\Helpers;

use App\Models\TransactionLoan;
use App\Models\TransactionLoanMutation;
use App\Models\TransactionLoanOfficerGrouping;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * Mutasi nasabah — perpindahan resort (kelompok, hari) per pinjaman.
 *
 * CARA B (TIMPA + CATAT), rancangan .agents/rombak_resort.md:
 * kolom `transaction_loan_officer_grouping_id` & `hari` pinjaman DITIMPA ke
 * tujuan, dan tiap perpindahan dicatat di sini dengan `berlaku_bulan`. Jadi
 * bulan berjalan cukup membaca kolom pinjaman. Bulan SEBELUM perpindahan
 * dibaca lewat catatan: kelompok PADA tanggal X = asal mutasi paling awal yang
 * berlaku sesudah X; kalau tidak ada, kolom pinjaman.
 *
 * Selama tabel mutasi kosong, semua helper mengembalikan kolom pinjaman apa
 * adanya — SQL identik dengan sebelum fitur ini ada.
 */
class Mutasi
{
    public const ROLE_PEMUTASI = ['superuser'];

    /** Tanggal -> literal SQL ter-quote, untuk argumen $refSql. */
    public static function tgl($tanggal): string
    {
        return DB::getPdo()->quote(Carbon::parse($tanggal)->toDateString());
    }

    /** Tabel mutasi kosong? Satu kueri kecil; tidak di-cache karena worker panjang bisa basi. */
    private static function kosong(): bool
    {
        return !TransactionLoanMutation::query()->exists();
    }

    /**
     * Ekspresi SQL kelompok pinjaman $alias PADA tanggal $refSql (literal dari
     * tgl() atau kolom, mis. 'l.drop_date' untuk "kelompok saat drop").
     */
    public static function kelompokSql(string $alias, string $refSql): string
    {
        $kolom = "$alias.transaction_loan_officer_grouping_id";
        if (self::kosong()) {
            return $kolom;
        }

        return "COALESCE((SELECT m.dari_grouping_id FROM transaction_loan_mutations m
            WHERE m.transaction_loan_id = $alias.id AND m.berlaku_bulan > $refSql
            ORDER BY m.berlaku_bulan, m.id LIMIT 1), $kolom)";
    }

    /** Sama dengan kelompokSql() untuk hari tagih, sudah LOWER. */
    public static function hariSql(string $alias, string $refSql): string
    {
        if (self::kosong()) {
            return "LOWER($alias.hari)";
        }

        return "LOWER(COALESCE((SELECT m.dari_hari FROM transaction_loan_mutations m
            WHERE m.transaction_loan_id = $alias.id AND m.berlaku_bulan > $refSql
            ORDER BY m.berlaku_bulan, m.id LIMIT 1), $alias.hari))";
    }

    /**
     * Saring pinjaman yang PADA $refSql ada di $groupingIds (dan $hari kalau
     * diisi). whereIn kolom asli tetap dipakai supaya terindeks, ditambah
     * pinjaman yang dulu di sini tapi sudah pindah keluar; lalu ekspresi
     * "pada" membuang yang baru pindah masuk.
     */
    public static function saring($query, string $alias, array $groupingIds, string $refSql, ?string $hari = null): void
    {
        $kolom = "$alias.transaction_loan_officer_grouping_id";
        if (empty($groupingIds)) {
            $query->whereRaw('0 = 1');
            return;
        }
        if (self::kosong()) {
            $query->whereIn($kolom, $groupingIds);
            if ($hari !== null) {
                $query->where("$alias.hari", $hari);
            }
            return;
        }

        $ids = implode(',', array_map('intval', $groupingIds));
        $query->where(function ($w) use ($kolom, $alias, $groupingIds) {
            $w->whereIn($kolom, $groupingIds)
                ->orWhereIn("$alias.id", TransactionLoanMutation::whereIn('dari_grouping_id', $groupingIds)->select('transaction_loan_id'));
        })->whereRaw(self::kelompokSql($alias, $refSql) . " IN ($ids)");
        if ($hari !== null) {
            $query->whereRaw(self::hariSql($alias, $refSql) . ' = ?', [strtolower($hari)]);
        }
    }

    /**
     * Tambalan pembacaan per (grouping, hari) PADA bulan $ref: kolom pinjaman
     * sudah susunan baru, jadi bulan sebelum mutasi perlu menambah yang pindah
     * KELUAR sesudahnya (`masuk`) dan membuang yang pindah MASUK sesudahnya
     * (`keluar`). Tanpa mutasi, keduanya kosong dan pembacaan persis seperti
     * semula.
     *
     * @return array{masuk: int[], keluar: int[]}
     */
    public static function penyesuaianBaca(int $groupingId, string $hari, $ref): array
    {
        $refDate = Carbon::parse($ref)->startOfMonth()->toDateString();
        $hari = strtolower($hari);

        // Hanya mutasi yang BELUM berlaku di bulan $ref dan menyentuh grouping ini.
        $loanIds = TransactionLoanMutation::where('berlaku_bulan', '>', $refDate)
            ->where(function ($q) use ($groupingId) {
                $q->where('ke_grouping_id', $groupingId)
                    ->orWhere('dari_grouping_id', $groupingId);
            })
            ->distinct()->pluck('transaction_loan_id');

        if ($loanIds->isEmpty()) {
            return ['masuk' => [], 'keluar' => []];
        }

        $ref = self::tgl($refDate);
        $rows = DB::table(DB::raw('transaction_loans l'))
            ->whereIn('l.id', $loanIds)
            ->get([
                DB::raw('l.id AS id'),
                DB::raw('l.transaction_loan_officer_grouping_id AS og'),
                DB::raw('LOWER(l.hari) AS oh'),
                DB::raw(self::kelompokSql('l', $ref) . ' AS pg'),
                DB::raw(self::hariSql('l', $ref) . ' AS ph'),
            ]);

        $masuk = [];
        $keluar = [];
        foreach ($rows as $r) {
            $kolom = ((int) $r->og === $groupingId) && ($r->oh === $hari);
            $pada = ((int) $r->pg === $groupingId) && ($r->ph === $hari);
            if ($pada && !$kolom) {
                $masuk[] = (int) $r->id;
            } elseif ($kolom && !$pada) {
                $keluar[] = (int) $r->id;
            }
        }

        return ['masuk' => $masuk, 'keluar' => $keluar];
    }

    /**
     * Pindahkan satu pinjaman ke resort (kelompok, hari) tujuan mulai
     * $berlakuBulan: timpa kolom pinjaman + catat asalnya. Hanya bulan
     * berjalan: menimpa lebih awal memindah sisa bulan sebelumnya.
     * Angsuran bulan berjalan yang telanjur masuk TIDAK ikut dipindah di sini
     * (itu tugas penerapan rombak, tahap 2).
     *
     * @throws \RuntimeException
     */
    public static function catat(TransactionLoan $loan, int $keGroupingId, ?string $keHari, $berlakuBulan, ?string $alasan, $user, ?int $rombakId = null): TransactionLoanMutation
    {
        if (!$user || !$user->hasAnyRole(self::ROLE_PEMUTASI)) {
            throw new \RuntimeException('Hanya superuser yang boleh melakukan mutasi.');
        }

        $bulan = Carbon::parse($berlakuBulan)->startOfDay();
        if ($bulan->toDateString() !== Carbon::now()->startOfMonth()->toDateString()) {
            throw new \RuntimeException('Mutasi hanya berlaku mulai tanggal 1 bulan berjalan.');
        }

        $tujuan = TransactionLoanOfficerGrouping::find($keGroupingId);
        if (!$tujuan) {
            throw new \RuntimeException('Kelompok tujuan tidak ditemukan.');
        }

        // Satu kantor dulu (rancangan §11): pindah kantor belum dicakup.
        $branchAsal = $loan->loan_officer_grouping->branch_id ?? null;
        if ($branchAsal !== null && (int) $tujuan->branch_id !== (int) $branchAsal) {
            throw new \RuntimeException('Mutasi antar kantor belum didukung — tujuan harus di kantor yang sama.');
        }

        $dari = (int) $loan->transaction_loan_officer_grouping_id;
        $dariHari = strtolower($loan->hari);
        $keHariBersih = $keHari ? strtolower($keHari) : $dariHari;

        if ($dari === $keGroupingId && $keHariBersih === $dariHari) {
            throw new \RuntimeException('Tujuan sama dengan kelompok & hari sekarang.');
        }

        return DB::transaction(function () use ($loan, $keGroupingId, $dari, $dariHari, $keHariBersih, $bulan, $alasan, $user, $rombakId) {
            // Catatan dulu: trigger tl_kunci_before_update hanya mengizinkan ganti
            // kelompok yang didukung mutasi resort yang cocok.
            $mutasi = TransactionLoanMutation::create([
                'transaction_loan_id' => $loan->id,
                'rombak_id' => $rombakId,
                'dari_grouping_id' => $dari,
                'dari_hari' => $dariHari,
                'ke_grouping_id' => $keGroupingId,
                'ke_hari' => $keHariBersih,
                'berlaku_bulan' => $bulan->toDateString(),
                'alasan' => $alasan ?: null,
                'user_input' => $user->employee->id,
            ]);

            $loan->forceFill([
                'transaction_loan_officer_grouping_id' => $keGroupingId,
                'hari' => $keHariBersih,
            ])->save();

            return $mutasi;
        });
    }
}
