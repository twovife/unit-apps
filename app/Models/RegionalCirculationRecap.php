<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Angka Rekap Sirkulasi Wilayah yang diketik staf kontrol dari laporan WA
 * kasir. Satu baris per kantor per tanggal.
 * Rancangan: .agents/rekap_sirkulasi_wilayah.md
 */
class RegionalCirculationRecap extends Model
{
    /**
     * Yang DIKETIK staf kontrol: mutasi hari itu saja (keputusan mas
     * 2026-11-23). Kumulatif dan saldo dihitung, tidak diketik.
     */
    public const KOLOM_MUTASI = ['drop', 'storting', 'angsuran_cm', 'angsuran_mb', 'angsuran_ml'];

    /**
     * Yang DIHITUNG dari mutasi sebulan, lalu disimpan supaya ekspor dan hari
     * berikutnya tidak perlu menghitung ulang.
     */
    public const KOLOM_TURUNAN = [
        'total_drop', 'total_storting', 'sirkulasi',
        'total_angsuran_cm', 'saldo_cm',
        'total_angsuran_mb', 'saldo_mb',
        'total_angsuran_ml', 'saldo_ml',
    ];

    /** Semua kolom angka; urutannya sama dengan kolom di layar. */
    public const KOLOM_ANGKA = [
        'drop', 'total_drop', 'storting', 'total_storting', 'sirkulasi',
        'angsuran_cm', 'total_angsuran_cm', 'saldo_cm',
        'angsuran_mb', 'total_angsuran_mb', 'saldo_mb',
        'angsuran_ml', 'total_angsuran_ml', 'saldo_ml',
    ];

    /** Saldo awal bulan; hanya diketik pada tanggal 1. */
    public const KOLOM_AWAL = ['awal_sirkulasi', 'awal_cm', 'awal_mb', 'awal_ml'];

    /** Dibekukan saat baris dicek, bukan diketik. */
    public const KOLOM_BEKU = ['saldo_lama_cm', 'saldo_lama_mb'];

    protected $guarded = ['id'];

    protected $casts = [
        'tanggal' => 'date',
        'checked_at' => 'datetime',
    ];

    public function logs()
    {
        return $this->hasMany(RegionalCirculationRecapLog::class);
    }

    public function pengecek()
    {
        return $this->belongsTo(User::class, 'checked_by');
    }

    /** Sudah dicek = terkunci. Mengubahnya harus lewat buka beralasan. */
    public function terkunci(): bool
    {
        return $this->checked_at !== null;
    }
}
