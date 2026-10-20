<?php

namespace App\Helpers;

use App\Models\TransactionDailyClosing;
use App\Models\TransactionDailyRecap;
use App\Models\TransactionLoanOfficerGrouping;
use App\Models\TransactionLockHistory;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * Koreksi target / keluar hari D dari Buku Transaksi (ACC KM), dua alur
 * (mas 2026-10-20):
 *  - Hanya bulan berjalan (bulan aktif); bulan lalu sudah / akan ditutup buku.
 *  - Boleh walau D sudah dikunci / TTD kasir: target & keluar saja. Masuk tidak
 *    (ikut drop). Pinjaman & angsuran D tetap terkunci (trigger DB).
 *  - Tanggal sebelum D tidak tersentuh. D ditandai koreksi (alur baru
 *    target_source='koreksi'; alur lama target_on = D sendiri) supaya ACC
 *    minggu sebelumnya tidak menimpanya.
 *  - Menjalar ke depan SAMPAI TANGGAL TERAKHIR yang sudah punya baris:
 *    target(next) = target(d) + masuk(d) - keluar(d), menimpa apa pun termasuk
 *    koreksi yang lebih baru (keputusan mas).
 *
 * pratinjau() menghitung tanpa menyimpan; simpan() menghitung lalu menulis.
 */
class KoreksiTarget
{
    /** Pengaman putaran rantai (± 1 tahun mingguan). */
    private const MAKS_RANTAI = 60;

    /**
     * @return array{migrasi:bool, perubahan:array<int,array{tanggal:string,lama:int,baru:int}>, keluar_lama:int}
     *
     * @throws \RuntimeException pesan untuk user
     */
    public static function pratinjau(int $groupingId, string $tanggal, ?int $target, ?int $keluar): array
    {
        return self::jalankan($groupingId, $tanggal, $target, $keluar, false);
    }

    /** @throws \RuntimeException pesan untuk user */
    public static function simpan(int $groupingId, string $tanggal, ?int $target, ?int $keluar, string $alasan, int $employeeId): array
    {
        // Rantai dihitung di sini; hook updating lama di TransactionDailyRecap (ikut
        // menjalar lewat target_on) dimatikan supaya tidak dobel / berputar.
        return DB::transaction(fn() => TransactionDailyRecap::withoutEvents(
            fn() => self::jalankan($groupingId, $tanggal, $target, $keluar, true, $alasan, $employeeId)
        ));
    }

    private static function jalankan(int $groupingId, string $tanggal, ?int $target, ?int $keluar, bool $tulis, string $alasan = '', int $employeeId = 0): array
    {
        $grouping = TransactionLoanOfficerGrouping::findOrFail($groupingId);
        $d = Carbon::parse($tanggal)->startOfDay();

        if (!$d->isSameMonth(Carbon::now())) {
            throw new \RuntimeException('Koreksi target hanya untuk bulan berjalan (' . Carbon::now()->locale('id')->isoFormat('MMMM Y') . ').');
        }
        if ($d->gt(Carbon::today())) {
            throw new \RuntimeException('Tanggal ini belum lewat.');
        }

        $migrasi = AgregasiScope::sudahMigrasi($grouping->branch_id);
        if ($migrasi && AppHelper::tanggalBeku($groupingId, $d)) {
            throw new \RuntimeException('Tanggal ini sebelum migrasi kantor (beku).');
        }

        $model = $migrasi ? TransactionDailyClosing::class : TransactionDailyRecap::class;
        $baris = fn(string $tgl) => $model::where('transaction_loan_officer_grouping_id', $groupingId)->whereDate('date', $tgl)->first();
        $masuk = fn($r, string $tgl) => $migrasi || $r?->masuk === null
            ? TargetMingguan::masuk((int) (HitungAgregat::harian($groupingId, $tgl)['drop'] ?? 0))
            : (int) $r->masuk;

        $awal = $baris($d->toDateString());
        if (!$awal) {
            throw new \RuntimeException('Belum ada data rekap / ACC di tanggal ini.');
        }

        $targetLama = (int) $awal->target;
        $keluarLama = (int) $awal->keluar;
        $targetBaru = $target ?? $targetLama;
        $keluarBaru = $keluar ?? $keluarLama;

        $perubahan = [['tanggal' => $d->toDateString(), 'lama' => $targetLama, 'baru' => $targetBaru]];
        if ($tulis) {
            // Tanda koreksi (putus dari ACC minggu lalu) hanya kalau TARGET-nya yang
            // diubah; ubah keluar saja tetap ikut rantai biasa.
            $tanda = $targetBaru === $targetLama ? [] : ($migrasi
                ? ['target_source' => 'koreksi']
                : ['target_on' => $d->toDateString()]);
            $awal->update(['target' => $targetBaru, 'keluar' => $keluarBaru] + $tanda);
        }

        // Menjalar ke depan sampai baris terakhir yang ada.
        $tgl = $d->toDateString();
        $nilai = $targetBaru;
        $keluarHari = $keluarBaru;
        $masukHari = $masuk($awal, $tgl);
        for ($i = 0; $i < self::MAKS_RANTAI; $i++) {
            $depan = TargetMingguan::tanggalDepan($tgl);
            $r = $depan ? $baris($depan) : null;
            if (!$r) {
                break;
            }
            $baru = $nilai + $masukHari - $keluarHari;
            $perubahan[] = ['tanggal' => $depan, 'lama' => (int) $r->target, 'baru' => $baru];
            if ($tulis) {
                $r->update(['target' => $baru, 'target_on' => $tgl] + ($migrasi ? ['target_source' => 'manual'] : []));
            }
            $tgl = $depan;
            $nilai = $baru;
            $keluarHari = (int) $r->keluar;
            $masukHari = $masuk($r, $tgl);
        }

        if ($tulis && $migrasi) {
            TransactionLockHistory::create([
                'transaction_daily_closing_id' => $awal->id,
                'transaction_loan_officer_grouping_id' => $groupingId,
                'tanggal' => $d->toDateString(),
                'aksi' => TransactionLockHistory::AKSI_TARGET,
                'user_id' => $employeeId,
                'alasan' => sprintf('Koreksi target %s -> %s, keluar %s -> %s; menjalar %d tanggal. %s',
                    number_format($targetLama, 0, ',', '.'), number_format($targetBaru, 0, ',', '.'),
                    number_format($keluarLama, 0, ',', '.'), number_format($keluarBaru, 0, ',', '.'),
                    count($perubahan) - 1, $alasan),
            ]);
        }

        return ['migrasi' => $migrasi, 'perubahan' => $perubahan, 'keluar_lama' => $keluarLama];
    }

    /**
     * Dipanggil sesudah ACC KM (dua alur): target hari D diubah di form -> koreksi +
     * menjalar; keluar diubah pada hari yang SUDAH pernah di-ACC (ACC ulang) ->
     * menjalar ulang bila bulan berjalan. ACC pertama biasa -> diam (D+7 sudah
     * ditulis CeklistKepala / ACC lama).
     *
     * @throws \RuntimeException target diubah di luar bulan berjalan, dsb.
     */
    public static function sesudahAcc(int $groupingId, string $tanggal, int $targetLama, int $targetBaru, int $keluarLama, int $keluarBaru, ?string $alasan, int $employeeId, bool $sudahAcc): void
    {
        $targetBerubah = $targetBaru !== $targetLama;
        $keluarBerubah = $sudahAcc && $keluarBaru !== $keluarLama;
        if (!$targetBerubah && !($keluarBerubah && Carbon::parse($tanggal)->isSameMonth(Carbon::now()))) {
            return;
        }
        // Tanpa alasan (mas 2026-10-20): ubah target langsung dari form ACC.
        self::simpan($groupingId, $tanggal, $targetBaru, $keluarBaru, (string) ($alasan ?: 'Diubah dari form ACC KM.'), $employeeId);
    }

    /** Alur lama: target tanggal ini dikoreksi tangan (target_on = tanggalnya sendiri) - jangan ditimpa ACC minggu lalu. */
    public static function recapDikoreksi(?TransactionDailyRecap $r): bool
    {
        return $r && $r->target_on && Carbon::parse($r->target_on)->isSameDay(Carbon::parse($r->date));
    }
}
