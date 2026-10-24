<?php

namespace App\Helpers;

use App\Models\TransactionDailyClosing;
use App\Models\TransactionLockHistory;
use Illuminate\Support\Facades\DB;

/**
 * Mengunci dan membuka agregat harian, beserta jejaknya.
 *
 * Penegakan sesungguhnya ada di TRIGGER database — kelas ini yang menentukan
 * SYARAT dan mencatat JEJAK. Trigger menolak penulisan ke tanggal terkunci
 * lewat jalur apa pun (Eloquent, mass update, raw SQL, tinker); kelas ini
 * memastikan penguncian hanya terjadi kalau syaratnya terpenuhi, dan setiap
 * buka-tutup meninggalkan catatan.
 *
 * Lihat .agents/agregasi_rekap.md §4.
 */
class Gembok
{

    /**
     * Syarat mengunci satu baris harian.
     *
     * Yang SENGAJA BUKAN syarat: kas seimbang. Selisih fisik dibebankan ke
     * penagih lewat pembukuan terpisah; kalau kas seimbang jadi syarat, rantai
     * penguncian jadi sandera masalah yang penyelesaiannya ada di buku lain.
     *
     * @return array{boleh:bool,alasan:string[]}
     */
    public static function bolehKunci(TransactionDailyClosing $baris): array
    {
        $alasan = [];

        if ($baris->terkunci()) {
            $alasan[] = 'Baris ini sudah terkunci.';
        }

        if (!$baris->sudahDisetujuiKepala()) {
            $alasan[] = 'Kepala belum menyetujui rekap hari ini.';
        }

        // Setoran kosong dianggap 0 (keputusan mas 2026-10-09) - bukan lagi
        // syarat kunci.

        if ($sebelumnya = self::barisSebelumnyaBelumTerkunci($baris)) {
            $alasan[] = sprintf(
                'Hari sebelumnya (%s) belum dikunci.',
                $sebelumnya->date->format('d M Y')
            );
        }

        return ['boleh' => empty($alasan), 'alasan' => $alasan];
    }

    /**
     * Baris ADA sebelumnya yang belum terkunci — bukan "tanggal kemarin persis".
     *
     * Dibaca begitu karena tidak setiap tanggal kalender punya baris: hari
     * libur memang tidak dibuatkan. Rantainya menyusuri baris yang ada.
     *
     * Efeknya disengaja: hari yang setoran atau pendataannya bolong otomatis
     * menahan rantai, jadi ketahuan besoknya — bukan berbulan-bulan kemudian.
     */
    public static function barisSebelumnyaBelumTerkunci(TransactionDailyClosing $baris): ?TransactionDailyClosing
    {
        $mulai = AgregasiScope::tanggalMulai($baris->loan_officer_grouping?->branch_id);

        return TransactionDailyClosing::where(
                'transaction_loan_officer_grouping_id',
                $baris->transaction_loan_officer_grouping_id
            )
            ->whereDate('date', '<', $baris->date)
            // Jangan menuntut hari-hari SEBELUM kantor migrasi ikut dikunci —
            // di zona itu alur lama yang berlaku.
            ->when($mulai, fn($q) => $q->whereDate('date', '>=', $mulai))
            // Baris di tanggal yang (belakangan) ditandai libur tidak ikut
            // rantai: di hari libur tidak boleh ada transaksi, jadi tidak ada
            // yang perlu dikunci - tanpa ini satu baris libur menyandera
            // semua hari sesudahnya.
            ->whereNotIn('date', \App\Models\WorkDay::where('is_libur', true)
                ->whereDate('date', '<', $baris->date)->select('date'))
            ->whereNull('kasir_lock_at')
            ->orderByDesc('date')
            ->first();
    }

    /**
     * Kunci satu baris. Melempar kalau syaratnya belum terpenuhi.
     *
     * @throws \RuntimeException
     */
    public static function kunci(TransactionDailyClosing $baris, int $employeeId): TransactionDailyClosing
    {
        $cek = self::bolehKunci($baris);

        if (!$cek['boleh']) {
            throw new \RuntimeException(implode(' ', $cek['alasan']));
        }

        return DB::transaction(function () use ($baris, $employeeId) {
            // Dibaca SEBELUM dikunci: `tunai` generated, jadi kalau nanti kunci
            // dibuka dan inputnya berubah, angka ini tidak bisa direkonstruksi
            // dari mana pun.
            $tunai = (int) $baris->tunai;

            $baris->update([
                'kasir_lock_at' => now(),
                'kasir_lock_user' => $employeeId,
            ]);

            self::catat($baris, TransactionLockHistory::AKSI_KUNCI, $employeeId, $tunai, $tunai);

            return $baris->fresh();
        });
    }

    /**
     * Buka kunci. Hanya superuser, atau user yang diberi permission
     * `can-edit` oleh superuser (keputusan mas 2026-10-08: role pusat /
     * stafkontrol tidak lagi menentukan).
     *
     * @throws \RuntimeException
     */
    public static function buka(TransactionDailyClosing $baris, $user, string $alasan): TransactionDailyClosing
    {
        if (!$baris->terkunci()) {
            throw new \RuntimeException('Baris ini memang belum terkunci.');
        }

        if (trim($alasan) === '') {
            throw new \RuntimeException('Alasan membuka kunci wajib diisi.');
        }

        if (!self::bolehBuka($user)) {
            throw new \RuntimeException(
                'Buka kunci hanya untuk superuser atau user ber-izin can-edit.'
            );
        }

        return DB::transaction(function () use ($baris, $user, $alasan) {
            $tunai = (int) $baris->tunai;

            $baris->update(['kasir_lock_at' => null, 'kasir_lock_user' => null]);

            self::catat(
                $baris,
                TransactionLockHistory::AKSI_BUKA,
                $user->employee->id,
                $tunai,
                null,
                $alasan
            );

            return $baris->fresh();
        });
    }

    /**
     * Koreksi oleh user can-edit / superuser di tanggal yang sudah dikunci:
     * kunci tanggal itu dibuka OTOMATIS sebelum perubahan ditulis (mas
     * 2026-10-10), tercatat di riwayat gembok dengan alasannya. Dikunci lagi
     * satu per satu lewat Rekap 1. User lain tidak dibukakan - trigger DB
     * tetap menolak. Tanggal sebelum migrasi tidak punya baris harian, jadi
     * tetap beku.
     *
     * Dipanggil dari event model angsuran & pinjaman, jadi semua jalur tulis
     * ikut. Berjalan di transaksi pemanggil: tulisnya gagal -> bukanya batal.
     */
    public static function bukaOtomatis($groupingId, $tanggal, string $alasan): void
    {
        $user = auth()->user();
        if (!$groupingId || !$tanggal || !self::bolehBuka($user)) {
            return;
        }

        $baris = TransactionDailyClosing::where('transaction_loan_officer_grouping_id', $groupingId)
            ->whereDate('date', \Carbon\Carbon::parse($tanggal)->toDateString())
            ->whereNotNull('kasir_lock_at')
            ->first();

        if ($baris) {
            self::buka($baris, $user, 'Dibuka otomatis: ' . $alasan);
            return;
        }

        // Alur lama (mas 2026-10-22): kunci = TTD kasir di daily_recaps, tanpa trigger DB.
        // Dulu tetap terkunci sementara angkanya berubah -> rekap tertinggal. Sekarang
        // dibuka: TTD kasir dihapus, ACC KM otomatis (jam = TTD) ikut; ACC KM asli
        // dibiarkan. Rekap disegarkan sesudah perubahan tertulis (segarkanSesudahTulis).
        $tgl = \Carbon\Carbon::parse($tanggal)->toDateString();
        $rekap = \App\Models\TransactionDailyRecap::where('transaction_loan_officer_grouping_id', $groupingId)
            ->whereDate('date', $tgl)->whereNotNull('daily_kasir_approval')->first();
        if (!$rekap) {
            return;
        }
        $kmOtomatis = (string) $rekap->daily_kepala_approval === (string) $rekap->daily_kasir_approval;
        \App\Models\TransactionDailyRecap::withoutEvents(fn() => $rekap->update([
            'daily_kasir_approval' => null,
            'daily_kasir_approval_user' => null,
        ] + ($kmOtomatis ? ['daily_kepala_approval' => null, 'daily_kepala_approval_user' => null] : [])));
        self::$segarkan["$groupingId|$tgl"] = true;
        \Illuminate\Support\Facades\Log::info('Kunci alur lama dibuka otomatis', [
            'rekap_id' => $rekap->id, 'oleh' => $user->employee->id, 'alasan' => $alasan, 'acc_km_otomatis_dihapus' => $kmOtomatis,
        ]);
    }

    /** Tanggal alur lama yang dibuka otomatis di permintaan ini, menunggu disegarkan. */
    private static array $segarkan = [];

    /**
     * Dipanggil event model SESUDAH pinjaman / angsuran tertulis: kalau tanggal itu baru
     * dibuka otomatis (alur lama), drop & storting rekapnya disegarkan
     * (KoreksiTarget::segarkanRekapLama). Target minggu depan lewat ACC KM ulang.
     */
    public static function segarkanSesudahTulis($groupingId, $tanggal): void
    {
        if (!$groupingId || !$tanggal) {
            return;
        }
        $kunci = $groupingId . '|' . \Carbon\Carbon::parse($tanggal)->toDateString();
        if (!isset(self::$segarkan[$kunci])) {
            return;
        }
        unset(self::$segarkan[$kunci]);
        $rekap = \App\Models\TransactionDailyRecap::where('transaction_loan_officer_grouping_id', $groupingId)
            ->whereDate('date', \Carbon\Carbon::parse($tanggal)->toDateString())->first();
        if ($rekap) {
            KoreksiTarget::segarkanRekapLama($rekap);
        }
    }

    /**
     * Hari yang TERBUKA DI TENGAH RANTAI: belum terkunci padahal ada hari
     * sesudahnya (kelompok sama) yang sudah terkunci - hasil buka kunci /
     * koreksi can-edit yang belum dikunci lagi. Selama ada, kasir tidak bisa
     * mengunci hari sesudahnya. Dipakai pemberitahuan di Rekap 1 & 2.
     *
     * @return array<int,array{kelompok:int,tanggal:string,alasan:?string,dibuka_at:?string}>
     */
    public static function hariTerbuka($branchId): array
    {
        $grup = \App\Models\TransactionLoanOfficerGrouping::where('branch_id', $branchId)->pluck('kelompok', 'id');
        if ($grup->isEmpty()) {
            return [];
        }

        $baris = TransactionDailyClosing::from('transaction_daily_closings as c')
            ->whereIn('c.transaction_loan_officer_grouping_id', $grup->keys())
            ->whereNull('c.kasir_lock_at')
            ->whereExists(fn($q) => $q->select(DB::raw(1))->from('transaction_daily_closings as n')
                ->whereColumn('n.transaction_loan_officer_grouping_id', 'c.transaction_loan_officer_grouping_id')
                ->whereColumn('n.date', '>', 'c.date')
                ->whereNotNull('n.kasir_lock_at'))
            ->orderBy('c.date')
            ->get(['c.id', 'c.transaction_loan_officer_grouping_id', 'c.date']);

        $buka = TransactionLockHistory::whereIn('transaction_daily_closing_id', $baris->pluck('id'))
            ->where('aksi', TransactionLockHistory::AKSI_BUKA)
            ->orderBy('id')->get()->keyBy('transaction_daily_closing_id');

        return $baris->map(fn($b) => [
            'kelompok' => (int) $grup[$b->transaction_loan_officer_grouping_id],
            'tanggal' => \Carbon\Carbon::parse($b->date)->toDateString(),
            'alasan' => $buka->get($b->id)?->alasan,
            'dibuka_at' => $buka->get($b->id)?->created_at?->toDateTimeString(),
        ])->values()->all();
    }

    /** Alur lama: mulai tanggal ini hari yang belum dikunci kasir diperingatkan di Rekap 1. */
    public const MULAI_CEK_KUNCI_LAMA = '2026-10-01';

    /**
     * Alur lama (mas 2026-10-22): hari kerja sejak MULAI_CEK_KUNCI_LAMA s/d kemarin yang
     * ada transaksinya (drop sukses / angsuran) atau baris rekapnya, tapi belum di-TTD kasir.
     * Bentuk sama dengan hariTerbuka() (dipakai banner yang sama).
     */
    public static function belumDikunciLama($branchId): array
    {
        $grup = \App\Models\TransactionLoanOfficerGrouping::where('branch_id', $branchId)->pluck('kelompok', 'id');
        $kemarin = \Carbon\Carbon::yesterday()->toDateString();
        if ($grup->isEmpty() || $kemarin < self::MULAI_CEK_KUNCI_LAMA) {
            return [];
        }
        $ids = $grup->keys();
        $rentang = [self::MULAI_CEK_KUNCI_LAMA, $kemarin];

        $ada = DB::table('transaction_loan_instalments')->whereIn('transaction_loan_officer_grouping_id', $ids)
            ->whereBetween('transaction_date', $rentang)->distinct()
            ->select('transaction_loan_officer_grouping_id as g', 'transaction_date as d')
            ->union(DB::table('transaction_loans')->whereIn('transaction_loan_officer_grouping_id', $ids)
                ->where('status', 'success')->whereBetween('drop_date', $rentang)->distinct()
                ->select('transaction_loan_officer_grouping_id as g', 'drop_date as d'))
            ->union(DB::table('transaction_daily_recaps')->whereIn('transaction_loan_officer_grouping_id', $ids)
                ->whereBetween('date', $rentang)->select('transaction_loan_officer_grouping_id as g', 'date as d'))
            ->get();
        $terkunci = DB::table('transaction_daily_recaps')->whereIn('transaction_loan_officer_grouping_id', $ids)
            ->whereBetween('date', $rentang)->whereNotNull('daily_kasir_approval')
            ->get(['transaction_loan_officer_grouping_id as g', 'date as d'])
            ->mapWithKeys(fn($x) => [$x->g . '|' . \Carbon\Carbon::parse($x->d)->toDateString() => true]);

        return $ada->map(fn($x) => ['g' => $x->g, 'd' => \Carbon\Carbon::parse($x->d)->toDateString()])
            ->unique(fn($x) => $x['g'] . '|' . $x['d'])
            ->reject(fn($x) => isset($terkunci[$x['g'] . '|' . $x['d']]) || !\App\Models\WorkDay::hariKerja($x['d']))
            ->sortBy(fn($x) => $x['d'] . '|' . str_pad((string) $grup[$x['g']], 3, '0', STR_PAD_LEFT))
            ->map(fn($x) => ['kelompok' => (int) $grup[$x['g']], 'tanggal' => $x['d'], 'alasan' => null, 'dibuka_at' => null])
            ->values()->all();
    }

    public static function bolehBuka($user): bool
    {
        if (!$user || !$user->employee) {
            return false;
        }

        return $user->hasRole('superuser') || $user->hasPermissionTo('can-edit');
    }

    /**
     * Kunci borongan saat migrasi: semua baris harian kelompok-kelompok ini
     * s/d $sampai yang belum terkunci diberi cek kepala + kunci kasir atas nama
     * $employeeId, masing-masing dengan jejak.
     *
     * Syarat bolehKunci() SENGAJA dilewati: hari-hari ini sudah ditutup di alur
     * lama dan dicocokkan dengan buku sebelum migrasi; angkanya baru saja
     * dihitung ulang dari sumber oleh DaftarMigrasi.
     *
     * @return int jumlah baris yang dikunci
     */
    public static function kunciMigrasi(array $groupingIds, $dari, $sampai, int $employeeId): int
    {
        $baris = TransactionDailyClosing::whereIn('transaction_loan_officer_grouping_id', $groupingIds)
            ->whereBetween('date', [
                \Carbon\Carbon::parse($dari)->toDateString(),
                \Carbon\Carbon::parse($sampai)->toDateString(),
            ])
            ->whereNull('kasir_lock_at')
            ->get();

        $alasan = 'Kunci otomatis saat migrasi s/d ' . \Carbon\Carbon::parse($sampai)->toDateString();

        foreach ($baris as $b) {
            $tunai = (int) $b->tunai;

            $b->update([
                'kepala_approval_at' => $b->kepala_approval_at ?? now(),
                'kepala_approval_user' => $b->kepala_approval_user ?? $employeeId,
                'kasir_lock_at' => now(),
                'kasir_lock_user' => $employeeId,
            ]);

            self::catat($b, TransactionLockHistory::AKSI_KUNCI, $employeeId, $tunai, $tunai, $alasan);
        }

        return $baris->count();
    }

    private static function catat(
        TransactionDailyClosing $baris,
        string $aksi,
        int $employeeId,
        ?int $tunaiSebelum,
        ?int $tunaiSesudah,
        ?string $alasan = null
    ): void {
        TransactionLockHistory::create([
            'transaction_daily_closing_id' => $baris->id,
            'transaction_loan_officer_grouping_id' => $baris->transaction_loan_officer_grouping_id,
            'tanggal' => $baris->date->toDateString(),
            'aksi' => $aksi,
            'user_id' => $employeeId,
            'tunai_sebelum' => $tunaiSebelum,
            'tunai_sesudah' => $tunaiSesudah,
            'alasan' => $alasan,
        ]);
    }
}
