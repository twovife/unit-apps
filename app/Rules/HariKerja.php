<?php

namespace App\Rules;

use App\Models\WorkDay;
use Carbon\Carbon;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

/**
 * Gerbang tanggal: tolak tanggal libur dan tanggal mustahil.
 *
 * KENAPA SATU ATURAN, BUKAN PEMERIKSAAN DI TIAP CONTROLLER
 * -------------------------------------------------------
 * Ada TUJUH pintu masuk tanggal di TransactionLoanController saja — pengajuan,
 * pengajuan batch, pengajuan lama, tundaan, bayar angsuran, pelunasan,
 * pemutihan. Menyalin logikanya tujuh kali berarti suatu hari salah satunya
 * ketinggalan saat aturannya berubah, dan pintu yang ketinggalan itu tidak
 * bersuara — dia cuma menerima apa saja.
 *
 * Sebagai Rule, logikanya hidup di satu berkas dan tiap pintu tinggal memasang
 * `new HariKerja` di deretan aturannya yang sudah ada.
 *
 * APA YANG DITOLAK
 * ----------------
 *   1. Tahun di luar 2015-2035. Terverifikasi di produksi: 80 pinjaman
 *      ber-drop_date seperti `0225-06-04`, `0025-07-12`, `1923-12-07`, dan satu
 *      `3026-07-07` lolos tanpa satu pun penjagaan. Pinjaman bertanggal tahun
 *      0025 punya selisih ribuan bulan sehingga SELAMANYA masuk ember ML dan
 *      tidak akan pernah bisa keluar.
 *   2. Tanggal yang ditandai libur di `work_days`.
 *   3. Hari Minggu, untuk tanggal yang kalendernya belum ditetapkan.
 *
 * Butir 3 memakai bawaan yang sama dengan `WorkDay::hariKerja()`, jadi bulan
 * yang belum dikonfirmasi tetap terjaga. Aman: dari ~880rb drop dan ~5,9 juta
 * angsuran sepanjang 2026, yang jatuh hari Minggu cuma 16 dan 6 — itu salah
 * input, bukan alur kerja yang dipatahkan.
 *
 * PESANNYA MENYEBUTKAN JALAN KELUAR
 * ---------------------------------
 * Hari tagih kelompok tidak boleh berubah, jadi tanggal pengganti yang benar
 * adalah HARI YANG SAMA MINGGU BERIKUTNYA — 17 Agustus jadi 24 Agustus, bukan
 * 18 Agustus. Pesannya menyebutkan tanggal itu langsung supaya user tidak
 * perlu menghitung sendiri. Lihat .agents/agregasi_rekap.md §9.
 */
class HariKerja implements ValidationRule
{
    /**
     * @param  string|null  $konteks  kata benda untuk pesan, mis. "Tanggal drop"
     */
    public function __construct(private ?string $konteks = null) {}

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (blank($value)) {
            return; // urusan aturan `required`, bukan urusan di sini
        }

        try {
            $t = Carbon::parse($value)->startOfDay();
        } catch (\Throwable $e) {
            return; // urusan aturan `date`
        }

        $sebutan = $this->konteks ?? 'Tanggal';

        if (!WorkDay::tanggalWajar($t)) {
            $fail(sprintf(
                '%s %s di luar rentang wajar (%d-%d).',
                $sebutan,
                $t->toDateString(),
                WorkDay::TAHUN_MIN,
                WorkDay::TAHUN_MAKS
            ));
            return;
        }

        if (WorkDay::hariKerja($t)) {
            return;
        }

        // Hari Minggu bukan "libur sekali ini" — dia memang bukan hari tagih.
        // Menyarankan "hari yang sama minggu berikutnya" untuk hari Minggu
        // berarti menyarankan hari Minggu lagi.
        if ($t->isSunday()) {
            $fail(sprintf(
                '%s %s jatuh hari Minggu, bukan hari kerja.',
                $sebutan,
                $t->locale('id')->isoFormat('D MMMM Y')
            ));
            return;
        }

        $usul = $this->hariSamaBerikutnya($t);

        $fail(sprintf(
            '%s %s jatuh pada hari libur%s.%s',
            $sebutan,
            $t->locale('id')->isoFormat('D MMMM Y'),
            $this->keterangan($t),
            $usul
                ? sprintf(
                    ' Hari tagih kelompok tidak berubah — pakai %s, hari yang sama minggu berikutnya.',
                    $usul->locale('id')->isoFormat('D MMMM Y')
                )
                : ''
        ));
    }

    /**
     * Hari tagih yang sama pada minggu berikutnya yang BENAR-BENAR hari kerja.
     *
     * Melompat lebih dari satu minggu kalau perlu: menyarankan tanggal yang
     * ternyata libur juga cuma memindahkan penolakannya satu langkah, dan user
     * kehilangan kepercayaan pada sarannya. Dibatasi 8 minggu — kalau sampai
     * sejauh itu tidak ketemu, lebih baik diam daripada menyarankan tanggal
     * yang tak masuk akal.
     */
    private function hariSamaBerikutnya(Carbon $t): ?Carbon
    {
        $calon = $t->copy();

        for ($i = 0; $i < 8; $i++) {
            $calon->addWeek();

            if (WorkDay::tanggalWajar($calon) && WorkDay::hariKerja($calon)) {
                return $calon;
            }
        }

        return null;
    }

    /** Sebutkan alasan liburnya kalau kalender mencatatnya. */
    private function keterangan(Carbon $t): string
    {
        $baris = WorkDay::whereDate('date', $t->toDateString())->first();

        return $baris && filled($baris->keterangan)
            ? ' (' . $baris->keterangan . ')'
            : '';
    }
}
