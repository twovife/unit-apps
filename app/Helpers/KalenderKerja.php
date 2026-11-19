<?php

namespace App\Helpers;

use App\Helpers\DaftarMigrasi;
use App\Models\TransactionDailyClosing;
use App\Models\WorkDay;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * Penetapan kalender kerja nasional.
 *
 * `WorkDay` sudah menjawab "tanggal ini hari kerja?" dan dipakai pembangkit
 * baris closing. Kelas ini sisi lainnya: menyusun bahan layar dan menjaga
 * perubahannya.
 *
 * KALENDER HANYA BERLAKU MAJU
 * ---------------------------
 * Bulan sebelum bulan migrasi TIDAK BISA dibuka. Alasannya bukan kehati-hatian
 * berlebihan: tidak ada satu pun baris agregat baru bertanggal sebelum itu,
 * jadi menetapkan kalendernya tidak mengubah apa pun — cuma memberi kesan
 * bahwa sesuatu sedang diatur.
 *
 * Batas itu punya akibat yang menyederhanakan banyak hal. Bulan lampau tidak
 * terjangkau, dan bulan yang belum berjalan tidak punya transaksi. Jadi
 * TIDAK ADA keadaan di mana data angsuran bisa berkata apa-apa tentang bulan
 * yang boleh disetel.
 *
 * Versi pertama kelas ini membaca `transaction_loan_instalments` (11,75 juta
 * baris) untuk menawarkan "hari sepi" sebagai libur. Itu dibuang seluruhnya,
 * karena dua sebab:
 *
 *   1. Sia-sia — untuk bulan yang boleh disetel, kueri itu selalu kosong.
 *      Terukur menyumbang 30,3 detik dari waktu muat, dan nol saran.
 *   2. BERBAHAYA. Ambangnya "di bawah 10% median" menyarankan 27 Juli 2026
 *      sebagai libur padahal hari itu punya 335 angsuran sungguhan. Menyetujui
 *      saran semacam itu mengubah kenyataan operasional jadi kebohongan
 *      kalender, dan transaksi 335 nasabah mendarat di hari yang menurut
 *      sistem tidak ada orang bekerja.
 *
 * Dua arah kesalahannya tidak seimbang: hari kerja yang salah ditandai libur
 * menghapus baris closing dan menguburkan transaksinya; hari libur yang
 * terlewat cuma perlu ditandai manual. Jadi sarannya sekarang hanya berisi
 * yang PASTI — hari Minggu dan libur bertanggal tetap. Sisanya ditetapkan
 * orang, dan layar mengatakannya terang-terangan.
 *
 * Rancangan: .agents/agregasi_rekap.md §9
 */
class KalenderKerja
{
    /**
     * Libur nasional bertanggal TETAP. Hanya yang tanggalnya tidak pernah
     * bergeser. Idul Fitri, Nyepi, Waisak dan kawan-kawan sengaja tidak ada di
     * sini: tanggalnya berubah tiap tahun, dan menebaknya salah lebih buruk
     * daripada tidak menebak sama sekali.
     */
    private const LIBUR_TETAP = [
        '01-01' => 'Tahun Baru Masehi',
        '05-01' => 'Hari Buruh',
        '06-01' => 'Hari Lahir Pancasila',
        '08-17' => 'Hari Kemerdekaan RI',
        '12-25' => 'Hari Natal',
    ];

    /**
     * Bulan paling awal yang boleh disetel.
     *
     * Bulan migrasi global. Sebelum itu tidak ada baris agregat baru sama
     * sekali, jadi kalendernya tidak dibaca siapa pun — menetapkannya cuma
     * memberi kesan sesuatu sedang diatur.
     *
     * Kalau bulan migrasi belum ditetapkan (fitur mati), jatuh ke bulan
     * berjalan: tidak ada alasan menyetel masa lalu.
     */
    public static function bulanPalingAwal(): Carbon
    {
        return DaftarMigrasi::bulanMigrasi() ?? Carbon::now()->startOfMonth();
    }

    /** @throws \RuntimeException kalau periodenya sebelum bulan migrasi */
    private static function pastikanBolehDisetel(Carbon $periode): void
    {
        $batas = self::bulanPalingAwal();

        if ($periode->lt($batas)) {
            throw new \RuntimeException(sprintf(
                'Kalender hanya berlaku sejak %s — bulan migrasi. Sebelum itu tidak ada agregat baru yang membacanya.',
                $batas->locale('id')->isoFormat('MMMM Y')
            ));
        }
    }

    /**
     * Susun bahan layar satu bulan.
     *
     * @return array{periode:string, sudah_dikonfirmasi:bool, hari_kerja:int,
     *               hari_libur:int, belum_ditetapkan:int, hari:array}
     */
    public static function bulan($periode): array
    {
        $awal = Carbon::parse($periode)->startOfMonth();
        $akhir = $awal->copy()->endOfMonth();

        $ditetapkan = WorkDay::whereBetween('date', [$awal->toDateString(), $akhir->toDateString()])
            ->get()
            ->keyBy(fn($w) => $w->date->toDateString());

        $closing = self::closingPerTanggal($awal, $akhir);
        $saran = self::saran($periode);

        $hari = [];
        $jmlKerja = 0;
        $jmlLibur = 0;
        $belum = 0;

        for ($t = $awal->copy(); $t->lte($akhir); $t->addDay()) {
            $tgl = $t->toDateString();
            $baris = $ditetapkan->get($tgl);

            // Bawaan Senin-Sabtu kalau belum ditetapkan. Tombol yang lupa
            // ditekan tidak boleh melubangi data.
            $libur = $baris ? (bool) $baris->is_libur : $t->isSunday();

            $libur ? $jmlLibur++ : $jmlKerja++;
            if (!$baris) {
                $belum++;
            }

            $c = $closing[$tgl] ?? ['baris' => 0, 'terkunci' => 0, 'berisi' => 0];
            $penjaga = self::bolehJadikanLibur($c);

            $hari[] = [
                'tanggal' => $tgl,
                'tanggal_pendek' => $t->day,
                'nama_hari' => $t->locale('id')->dayName,
                'minggu_ke' => (int) $t->weekOfMonth,
                'urut_hari' => (int) $t->dayOfWeekIso, // 1 = Senin
                'is_libur' => $libur,
                'ditetapkan' => (bool) $baris,
                'keterangan' => $baris?->keterangan ?? ($saran[$tgl] ?? null),
                'disarankan_libur' => isset($saran[$tgl]),
                'closing_baris' => $c['baris'],
                'closing_terkunci' => $c['terkunci'],
                'closing_berisi' => $c['berisi'],
                'boleh_jadi_libur' => $penjaga['boleh'],
                'alasan_tolak' => $penjaga['alasan'],
            ];
        }

        $batas = self::bulanPalingAwal();

        return [
            'periode' => $awal->format('Y-m'),
            'nama_periode' => $awal->locale('id')->isoFormat('MMMM Y'),
            'bulan_paling_awal' => $batas->format('Y-m'),
            'nama_bulan_paling_awal' => $batas->locale('id')->isoFormat('MMMM Y'),
            'boleh_disetel' => $awal->gte($batas),
            'ada_bulan_sebelumnya' => $awal->copy()->subMonthNoOverflow()->gte($batas),
            'sudah_dikonfirmasi' => $ditetapkan->isNotEmpty(),
            'hari_kerja' => $jmlKerja,
            'hari_libur' => $jmlLibur,
            'belum_ditetapkan' => $belum,
            'jumlah_saran' => count($saran),
            'hari' => $hari,
        ];
    }

    /**
     * Tanggal mana yang layak ditawarkan sebagai libur.
     *
     * @return array<string,string>  tanggal => alasan
     */
    public static function saran($periode): array
    {
        $awal = Carbon::parse($periode)->startOfMonth();
        $akhir = $awal->copy()->endOfMonth();

        $saran = [];

        // 1. Minggu, dan libur nasional bertanggal tetap. Berlaku untuk bulan
        //    mana pun, termasuk yang belum berjalan.
        for ($t = $awal->copy(); $t->lte($akhir); $t->addDay()) {
            if ($t->isSunday()) {
                $saran[$t->toDateString()] = 'Hari Minggu';
                continue;
            }

            $kunci = $t->format('m-d');
            if (isset(self::LIBUR_TETAP[$kunci])) {
                $saran[$t->toDateString()] = self::LIBUR_TETAP[$kunci];
            }
        }

        ksort($saran);

        return $saran;
    }

    /**
     * Tetapkan satu tanggal.
     *
     * @throws \RuntimeException
     */
    public static function tetapkan($tanggal, bool $isLibur, ?string $keterangan, $user): WorkDay
    {
        $t = Carbon::parse($tanggal)->startOfDay();

        self::pastikanBolehDisetel($t->copy()->startOfMonth());

        if (!WorkDay::tanggalWajar($t)) {
            throw new \RuntimeException(sprintf(
                'Tanggal %s di luar rentang wajar (%d-%d).',
                $t->toDateString(),
                WorkDay::TAHUN_MIN,
                WorkDay::TAHUN_MAKS
            ));
        }

        if ($isLibur) {
            $c = self::closingPerTanggal($t, $t)[$t->toDateString()]
                ?? ['baris' => 0, 'terkunci' => 0, 'berisi' => 0];

            $penjaga = self::bolehJadikanLibur($c);

            if (!$penjaga['boleh']) {
                throw new \RuntimeException($penjaga['alasan']);
            }
        }

        $baris = WorkDay::updateOrCreate(
            ['date' => $t->toDateString()],
            [
                'is_libur' => $isLibur,
                'keterangan' => $keterangan ?: null,
                'dibuat_oleh' => $user->employee->id ?? null,
            ]
        );

        if ($isLibur) {
            self::bersihkanBarisYatim($t);
        }

        return $baris;
    }

    /**
     * Hapus baris closing pada tanggal yang baru ditandai libur.
     *
     * WAJIB, bukan kerapian. `TutupBulanan::kelengkapan()` menghitung
     * `hari_kerja` dari COUNT(*) baris closing bulan itu — BUKAN dari kalender.
     * Jadi menandai 17 Agustus libur tanpa menghapus barisnya menyisakan 10
     * baris yang menuntut dikunci padahal tidak ada yang bekerja, dan bulannya
     * tidak akan pernah bisa ditandatangani. Persis jebakan yang kalender ini
     * dibuat untuk membuka.
     *
     * Aman karena `bolehJadikanLibur()` sudah membuktikan barisnya kosong dan
     * tidak terkunci sebelum sampai ke sini. Syarat `whereNull('kasir_lock_at')`
     * tetap dipasang sebagai jaring kedua — pemeriksaan dan penghapusan terjadi
     * di dua saat berbeda, dan yang menjaga penghapusan sebaiknya penghapusan
     * itu sendiri.
     */
    private static function bersihkanBarisYatim(Carbon $tanggal): int
    {
        return TransactionDailyClosing::whereDate('date', $tanggal->toDateString())
            ->whereNull('kasir_lock_at')
            ->where('drop', 0)->where('storting', 0)
            ->where('kasbon', 0)->where('transport', 0)
            ->whereNull('setoran_tunai')->whereNull('setoran_transfer')->whereNull('setoran_katrol')
            ->delete();
    }

    /**
     * Terapkan seluruh saran satu bulan sekaligus.
     *
     * Hanya menyentuh tanggal yang BELUM ditetapkan — penetapan yang sudah ada
     * adalah keputusan orang, dan saran otomatis tidak boleh menimpanya.
     *
     * @return array{ditetapkan:int, dilewati:int}
     */
    public static function terapkanSaran($periode, $user): array
    {
        $awal = Carbon::parse($periode)->startOfMonth();
        $akhir = $awal->copy()->endOfMonth();

        self::pastikanBolehDisetel($awal);

        $sudahAda = WorkDay::whereBetween('date', [$awal->toDateString(), $akhir->toDateString()])
            ->pluck('date')
            ->map(fn($d) => Carbon::parse($d)->toDateString())
            ->flip();

        $saran = self::saran($periode);
        $closing = self::closingPerTanggal($awal, $akhir);

        $ditetapkan = 0;
        $dilewati = 0;

        DB::transaction(function () use ($awal, $akhir, $saran, $sudahAda, $closing, $user, &$ditetapkan, &$dilewati) {
            for ($t = $awal->copy(); $t->lte($akhir); $t->addDay()) {
                $tgl = $t->toDateString();

                if ($sudahAda->has($tgl)) {
                    $dilewati++;
                    continue;
                }

                $libur = isset($saran[$tgl]);

                if ($libur) {
                    $c = $closing[$tgl] ?? ['baris' => 0, 'terkunci' => 0, 'berisi' => 0];

                    if (!self::bolehJadikanLibur($c)['boleh']) {
                        $dilewati++;
                        continue;
                    }
                }

                WorkDay::create([
                    'date' => $tgl,
                    'is_libur' => $libur,
                    'keterangan' => $saran[$tgl] ?? null,
                    'dibuat_oleh' => $user->employee->id ?? null,
                ]);

                if ($libur) {
                    self::bersihkanBarisYatim($t);
                }

                $ditetapkan++;
            }
        });

        return ['ditetapkan' => $ditetapkan, 'dilewati' => $dilewati];
    }

    /**
     * Boleh menjadikan tanggal ini libur?
     *
     * Menjadikan KERJA selalu aman — paling banter menambah baris closing.
     * Menjadikan LIBUR yang berbahaya: `hari_kerja` bulan itu ikut turun,
     * sementara baris closing yang sudah ada tidak ikut hilang. Kalau barisnya
     * terkunci atau sudah berisi angka, syarat tanda tangan bulanan
     * (`hari_terkunci >= hari_kerja`) bisa lolos padahal ada hari berisi yang
     * belum dikunci — persis kebocoran yang syarat itu dibuat untuk mencegah.
     *
     * @return array{boleh:bool, alasan:?string}
     */
    private static function bolehJadikanLibur(array $c): array
    {
        if ($c['terkunci'] > 0) {
            return [
                'boleh' => false,
                'alasan' => sprintf(
                    '%d baris closing tanggal ini sudah dikunci kasir. Buka kuncinya lewat jalur resmi dulu.',
                    $c['terkunci']
                ),
            ];
        }

        if ($c['berisi'] > 0) {
            return [
                'boleh' => false,
                'alasan' => sprintf(
                    '%d baris closing tanggal ini sudah berisi angka. Hari yang sudah bertransaksi bukan hari libur.',
                    $c['berisi']
                ),
            ];
        }

        return ['boleh' => true, 'alasan' => null];
    }

    /** Berapa baris closing per tanggal, berapa terkunci, berapa sudah berisi angka. */
    private static function closingPerTanggal(Carbon $awal, Carbon $akhir): array
    {
        $rows = TransactionDailyClosing::query()
            ->whereBetween('date', [$awal->toDateString(), $akhir->toDateString()])
            ->selectRaw('DATE(date) AS d, COUNT(*) AS baris,
                         SUM(kasir_lock_at IS NOT NULL) AS terkunci,
                         SUM(`drop` <> 0 OR storting <> 0 OR kasbon <> 0
                             OR transport <> 0 OR setoran_tunai IS NOT NULL OR setoran_transfer IS NOT NULL OR setoran_katrol IS NOT NULL) AS berisi')
            ->groupBy(DB::raw('DATE(date)'))
            ->get();

        $out = [];
        foreach ($rows as $r) {
            $out[$r->d] = [
                'baris' => (int) $r->baris,
                'terkunci' => (int) $r->terkunci,
                'berisi' => (int) $r->berisi,
            ];
        }

        return $out;
    }
}
