<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Riwayat satu baris Rekap Sirkulasi Wilayah: tiap ubah nilai, tiap cek, dan
 * tiap buka beserta alasannya.
 */
class RegionalCirculationRecapLog extends Model
{
    public const UPDATED_AT = null;

    public const UBAH = 'ubah';
    public const CEK = 'cek';
    public const BUKA = 'buka';

    protected $guarded = ['id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
