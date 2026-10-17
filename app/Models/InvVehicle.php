<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class InvVehicle extends Model
{
    protected $fillable = [
        'asset_id',
        'plat_nomor',
        'plat_prefix',
        'nama_stnk',
        'tanggal_stnk',
        'tanggal_pajak_tahunan',
        'bpkb_location',
    ];

    protected $casts = [
        'tanggal_stnk' => 'date',
        'tanggal_pajak_tahunan' => 'date',
    ];

    public function asset(): BelongsTo
    {
        return $this->belongsTo(InvAsset::class, 'asset_id');
    }

    public function taxes(): HasMany
    {
        return $this->hasMany(InvVehicleTax::class, 'vehicle_id');
    }

    public function isPajak5Tahunan(?\Carbon\CarbonInterface $due = null): bool
    {
        $due ??= $this->tanggal_pajak_tahunan;

        return $due->greaterThanOrEqualTo($this->tanggal_stnk);
    }

    public function pajakTahunKe(?\Carbon\CarbonInterface $due = null): int
    {
        $due ??= $this->tanggal_pajak_tahunan;
        $remainingYears = $this->tanggal_stnk->year - $due->year;

        return 5 - max(0, min(4, $remainingYears));
    }

    public function labelJenisPajak(?\Carbon\CarbonInterface $due = null): string
    {
        return $this->isPajak5Tahunan($due) ? '5 Tahunan (Ganti Plat)' : '1 Tahunan';
    }
}
