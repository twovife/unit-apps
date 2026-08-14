<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Kalender kerja nasional. Lihat .agents/agregasi_rekap.md §9.
 *
 * Dua kegunaan: menentukan tanggal mana yang punya baris closing harian, dan
 * jadi gerbang tanggal — menolak tanggal yang tidak masuk akal, bukan cuma
 * tanggal libur.
 */
class WorkDay extends Model
{
    use HasFactory;

    /**
     * Rentang tahun yang dianggap masuk akal untuk tanggal transaksi.
     *
     * Ada 80 pinjaman di produksi ber-drop_date di luar rentang ini — contoh
     * nyata `0225-06-04`, `0025-07-12`, `1923-12-07`, dan satu `3026-07-07`.
     * Bukan sekadar jelek dipandang: pinjaman bertanggal tahun 0025 punya
     * selisih ribuan bulan sehingga SELAMANYA masuk ember ML, saldonya ikut
     * terhitung di sirkulasi, dan tidak akan pernah bisa keluar.
     */
    public const TAHUN_MIN = 2015;
    public const TAHUN_MAKS = 2035;

    protected $fillable = ['date', 'is_libur', 'keterangan', 'dibuat_oleh'];

    protected $casts = [
        'date' => 'date',
        'is_libur' => 'boolean',
    ];

    public function penetap()
    {
        return $this->belongsTo(Employee::class, 'dibuat_oleh', 'id');
    }

    public function scopeKerja($query)
    {
        return $query->where('is_libur', false);
    }

    /**
     * Apakah tanggal ini hari kerja?
     *
     * Kalau kalendernya belum ditetapkan untuk tanggal itu, JANGAN memblokir —
     * jatuh ke bawaan Senin–Sabtu. Tombol yang lupa ditekan tidak boleh
     * melubangi data; cukup menyisakan pekerjaan yang kelihatan.
     *
     * @param  \DateTimeInterface|string  $tanggal
     */
    public static function hariKerja($tanggal): bool
    {
        $t = Carbon::parse($tanggal)->startOfDay();

        $baris = static::whereDate('date', $t)->first();

        if ($baris) {
            return !$baris->is_libur;
        }

        return !$t->isSunday();
    }

    /**
     * Tanggal masuk akal? Dipakai sebagai gerbang sebelum menyimpan transaksi.
     *
     * @param  \DateTimeInterface|string|null  $tanggal
     */
    public static function tanggalWajar($tanggal): bool
    {
        if ($tanggal === null) {
            return false;
        }

        try {
            $tahun = (int) Carbon::parse($tanggal)->format('Y');
        } catch (\Throwable $e) {
            return false;
        }

        return $tahun >= self::TAHUN_MIN && $tahun <= self::TAHUN_MAKS;
    }

    /**
     * Daftar hari kerja dalam satu bulan.
     *
     * Memakai baris kalender kalau ada; untuk tanggal yang belum ditetapkan,
     * jatuh ke bawaan Senin–Sabtu.
     *
     * @return \Illuminate\Support\Collection<int, Carbon>
     */
    public static function hariKerjaBulan($periode)
    {
        $awal = Carbon::parse($periode)->startOfMonth();
        $akhir = $awal->copy()->endOfMonth();

        $ditetapkan = static::whereBetween('date', [$awal->toDateString(), $akhir->toDateString()])
            ->get()
            ->keyBy(fn($w) => $w->date->toDateString());

        $hasil = collect();

        for ($t = $awal->copy(); $t->lte($akhir); $t->addDay()) {
            $baris = $ditetapkan->get($t->toDateString());

            $kerja = $baris ? !$baris->is_libur : !$t->isSunday();

            if ($kerja) {
                $hasil->push($t->copy());
            }
        }

        return $hasil;
    }

    /** Apakah bulan ini sudah dikonfirmasi staf pusat, atau masih pakai bawaan? */
    public static function sudahDikonfirmasi($periode): bool
    {
        $awal = Carbon::parse($periode)->startOfMonth();

        return static::whereBetween('date', [
            $awal->toDateString(),
            $awal->copy()->endOfMonth()->toDateString(),
        ])->exists();
    }
}
