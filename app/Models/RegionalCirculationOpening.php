<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Saldo awal bulan yang DILAPORKAN kantor, satu baris per kantor per bulan.
 *
 * Bukan hasil hitungan sistem: angka sistem tetap dihitung dari
 * transaction_monthly_closings (alur baru) atau transaction_sirculations
 * (alur lama) dan dipakai sebagai isian awal. Kalau yang diketik berbeda,
 * layar menandai selisihnya dan tetap menyimpan yang diketik — supaya staf
 * kontrol tahu saldo awal versi kantor tidak cocok dengan versi digital.
 *
 * Tidak per hari tagih seperti rekap mantri (mas 2026-11-24): yang ditagih
 * cuma angka sebulannya.
 */
class RegionalCirculationOpening extends Model
{
    protected $guarded = ['id'];

    protected $casts = [
        'periode' => 'date',
        'checked_at' => 'datetime',
    ];

    /** Kolom yang diketik staf kontrol. */
    public const KOLOM = ['awal_sirkulasi', 'awal_cm', 'awal_mb', 'awal_ml'];

    public function pengecek()
    {
        return $this->belongsTo(User::class, 'checked_by');
    }

    public function terkunci(): bool
    {
        return $this->checked_at !== null;
    }
}
