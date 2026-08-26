<?php

namespace App\Helpers;

use App\Models\TransactionMonthlyClosing;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * Serah terima saldo awal — satu-satunya kali sistem lama dan sistem baru
 * bertemu, sekali seumur hidup per kantor.
 *
 * APA YANG SEBENARNYA DIPERIKSA
 * -----------------------------
 * Dua angka yang harus cocok, dan yang penting: keduanya tiba SENDIRI-SENDIRI.
 *
 *   kiri  = `transaction_sirculations` bulan ini — hasil tutup buku sistem
 *           lama, diketik kantor dari angka yang tampil di layar Approval
 *           Akhir (jalur hitung `PinjamanTrait`)
 *   kanan = `awal_*` di agregat bulanan — dihitung `HitungAgregat::portofolio()`
 *           langsung dari `transaction_loans` + angsuran, tidak pernah membaca
 *           tabel sirkulasi
 *
 * Kalau meleset, MIGRASINYA yang ditunda, bukan angkanya yang dipaksa cocok.
 * Kelas ini karena itu tidak punya satu pun jalan untuk menyetel `awal_*`.
 * Menyediakannya sama saja mengulang penyakit yang jadi sebab seluruh rombakan
 * ini: dua angka yang harus cocok, tapi yang satu boleh disetel mengikuti yang
 * lain, sehingga tidak ada yang pernah salah dan tidak ada yang pernah ketahuan.
 *
 * Z — ML YANG BELUM TERINPUT
 * --------------------------
 * Satu-satunya angka yang boleh diketik kantor. Bukan `Y - X` otomatis: `Y`
 * (`ml_amount` lama) sendiri sudah terbukti melenceng ke dua arah, jadi
 * menurunkan Z darinya berarti mewarisi kesalahannya dengan wajah meyakinkan.
 *
 * NULL = belum ditetapkan, 0 = kantor sudah memeriksa dan menyatakan tidak ada
 * ML tercecer. Kantor siap kalau Z **ditetapkan**, bukan kalau Z nol.
 *
 * Rancangan: .agents/agregasi_rekap.md §13.2, §9
 */
class SerahTerima
{
    /**
     * Susun bahan layar serah terima satu kantor satu periode.
     *
     * Read-only. Tidak menulis apa pun.
     *
     * @return array{
     *   periode:string, unit:?string, sudah_migrasi:bool,
     *   sudah_serah_terima:bool, serah_terima_at:?string,
     *   z_belum_ditetapkan:int, beda:int, selisih_total:int,
     *   awal_total:int, sirkulasi_total:int, rincian:array
     * }
     */
    public static function periksa(int $branchId, $periode): array
    {
        $periode = Carbon::parse($periode)->startOfMonth();

        $groupings = DB::table('transaction_loan_officer_groupings')
            ->where('branch_id', $branchId)
            ->orderBy('kelompok')
            ->get(['id', 'kelompok']);

        $namaKelompok = $groupings->pluck('kelompok', 'id');
        $ids = $groupings->pluck('id')->all();

        $kosong = [
            'periode' => $periode->format('Y-m'),
            'unit' => DB::table('branches')->where('id', $branchId)->value('unit'),
            'sudah_migrasi' => AgregasiScope::sudahMigrasi($branchId),
            'mulai_pendataan_baru' => AgregasiScope::tanggalMulai($branchId)?->format('Y-m-d'),
            'periode_migrasi' => null,
            'bulan_serah_terima' => false,
            'sudah_serah_terima' => false,
            'serah_terima_at' => null,
            'z_belum_ditetapkan' => 0,
            'beda' => 0,
            'selisih_total' => 0,
            'awal_total' => 0,
            'sirkulasi_total' => 0,
            'rincian' => [],
        ];

        if (empty($ids)) {
            return $kosong;
        }

        $mulai = AgregasiScope::tanggalMulai($branchId);
        $kosong['periode_migrasi'] = $mulai?->copy()->startOfMonth()->format('Y-m');

        // Serah terima hanya bermakna di bulan PERTAMA kantor ini memakai alur
        // baru. Bulan-bulan sesudahnya saldo awalnya lahir dari bulan sebelumnya
        // di sistem yang sama — tidak ada yang diserahterimakan.
        $kosong['bulan_serah_terima'] = $mulai
            && $mulai->copy()->startOfMonth()->equalTo($periode);

        $baru = TransactionMonthlyClosing::whereIn('transaction_loan_officer_grouping_id', $ids)
            ->whereDate('periode', $periode->toDateString())
            ->get()
            ->keyBy(fn($r) => $r->transaction_loan_officer_grouping_id . '|' . strtolower($r->hari));

        $lama = DB::table('transaction_sirculations')
            ->whereIn('transaction_loan_officer_grouping_id', $ids)
            ->whereDate('date', $periode->toDateString())
            ->get()
            ->keyBy(fn($r) => $r->transaction_loan_officer_grouping_id . '|' . strtolower($r->day));

        // Union: baris yang hanya punya salah satu sisi justru yang paling
        // perlu terlihat. Kelompok tanpa baris sirkulasi berarti sistem lama
        // tidak pernah menutup buku untuknya — itu temuan, bukan nol.
        $kunci = collect($baru->keys())->merge($lama->keys())->unique()->sort()->values();

        $rincian = [];
        $beda = 0;
        $zKosong = 0;
        $totalBaru = 0;
        $totalLama = 0;

        foreach ($kunci as $k) {
            [$g, $hari] = explode('|', $k);
            $b = $baru->get($k);
            $l = $lama->get($k);

            $awalTotal = $b ? (int) $b->awal_total : null;
            $sirkTotal = $l ? (int) $l->amount : null;

            $selisih = ($awalTotal !== null && $sirkTotal !== null)
                ? $awalTotal - $sirkTotal
                : null;

            $z = $b ? $b->awal_ml_belum_terinput : null;

            if ($selisih !== 0) {
                $beda++;
            }
            if ($z === null) {
                $zKosong++;
            }

            $totalBaru += $awalTotal ?? 0;
            $totalLama += $sirkTotal ?? 0;

            $rincian[] = [
                'grouping_id' => (int) $g,
                'kelompok' => $namaKelompok->get((int) $g),
                'hari' => $hari,
                'monthly_id' => $b?->id,
                'awal_total' => $awalTotal,
                'sirkulasi_total' => $sirkTotal,
                'selisih' => $selisih,
                'awal_month1' => $b ? (int) $b->awal_month1 : null,
                'awal_month2' => $b ? (int) $b->awal_month2 : null,
                'awal_ccm' => $b ? (int) $b->awal_ccm : null,
                'awal_cm' => $b ? (int) $b->awal_cm : null,
                'awal_mb' => $b ? (int) $b->awal_mb : null,
                'awal_ml' => $b ? (int) $b->awal_ml : null,
                'sirkulasi_cm' => $l ? (int) $l->cm_amount : null,
                'sirkulasi_mb' => $l ? (int) $l->mb_amount : null,
                'sirkulasi_ml' => $l ? (int) $l->ml_amount : null,
                'z' => $z === null ? null : (int) $z,
                'sudah_serah_terima' => $b && $b->serah_terima_at !== null,
            ];
        }

        $sudah = $baru->isNotEmpty() && $baru->every(fn($r) => $r->serah_terima_at !== null);

        return array_merge($kosong, [
            'sudah_serah_terima' => $sudah,
            'serah_terima_at' => $baru->first(fn($r) => $r->serah_terima_at !== null)?->serah_terima_at?->format('Y-m-d H:i'),
            'z_belum_ditetapkan' => $zKosong,
            'beda' => $beda,
            'selisih_total' => $totalBaru - $totalLama,
            'awal_total' => $totalBaru,
            'sirkulasi_total' => $totalLama,
            'rincian' => $rincian,
        ]);
    }

    /**
     * Simpan Z untuk satu baris bulanan.
     *
     * @throws \RuntimeException kalau barisnya sudah diserahterimakan
     */
    public static function tetapkanZ(TransactionMonthlyClosing $baris, ?int $z): void
    {
        if ($baris->serah_terima_at !== null) {
            throw new \RuntimeException(
                'Baris ini sudah diserahterimakan — Z tidak bisa diubah lagi.'
            );
        }

        if ($z !== null && $z < 0) {
            throw new \RuntimeException('Z tidak boleh negatif.');
        }

        $baris->update(['awal_ml_belum_terinput' => $z]);
    }

    /**
     * Sahkan serah terima satu kantor satu periode.
     *
     * Syaratnya sengaja hanya satu: setiap baris sudah punya Z. Selisih
     * terhadap sistem lama TIDAK memblokir — kantorlah yang memutuskan apakah
     * selisihnya bisa dipertanggungjawabkan, dan layar menampilkannya besar-
     * besar sebelum tombolnya ditekan.
     *
     * Alasannya: kalau selisih memblokir, orang akan menyetel Z sampai
     * selisihnya nol supaya bisa lanjut — dan Z berhenti berarti apa pun.
     * Yang menahan bukan sistem, melainkan tanda tangan yang tercatat namanya.
     *
     * @return array{disahkan:int}
     * @throws \RuntimeException
     */
    public static function sahkan(int $branchId, $periode, $user): array
    {
        $periode = Carbon::parse($periode)->startOfMonth();

        $mulai = AgregasiScope::tanggalMulai($branchId);
        if (!$mulai || !$mulai->copy()->startOfMonth()->equalTo($periode)) {
            throw new \RuntimeException(
                'Serah terima hanya berlaku di bulan pertama kantor ini memakai alur baru.'
            );
        }

        $ids = DB::table('transaction_loan_officer_groupings')
            ->where('branch_id', $branchId)->pluck('id')->all();

        $baris = TransactionMonthlyClosing::whereIn('transaction_loan_officer_grouping_id', $ids)
            ->whereDate('periode', $periode->toDateString())
            ->get();

        if ($baris->isEmpty()) {
            throw new \RuntimeException('Belum ada baris bulanan untuk periode ini.');
        }

        $belum = $baris->filter(fn($r) => $r->awal_ml_belum_terinput === null);
        if ($belum->isNotEmpty()) {
            throw new \RuntimeException(sprintf(
                '%d baris belum ditetapkan ML belum terinput-nya. Isi 0 kalau memang tidak ada — nol yang diketik berbeda artinya dari kolom yang dibiarkan kosong.',
                $belum->count()
            ));
        }

        $sudah = $baris->filter(fn($r) => $r->serah_terima_at !== null);
        if ($sudah->count() === $baris->count()) {
            throw new \RuntimeException('Periode ini sudah diserahterimakan.');
        }

        $jumlah = 0;

        DB::transaction(function () use ($baris, $user, &$jumlah) {
            foreach ($baris as $r) {
                if ($r->serah_terima_at !== null) {
                    continue;
                }

                $r->update([
                    'serah_terima_at' => now(),
                    'serah_terima_user' => $user->employee->id,
                ]);
                $jumlah++;
            }
        });

        return ['disahkan' => $jumlah];
    }
}
