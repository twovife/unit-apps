<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InvVehicleTax extends Model
{
    protected $fillable = [
        'vehicle_id',
        'periode',
        'due_date',
        'paid_date',
        'jenis',
        'tahun_ke',
        'cost',
        'denda',
        'plat_before',
        'plat_after',
        'stnk_before',
        'stnk_after',
        'pajak_before',
        'pajak_after',
        'notes',
        'created_by',
    ];

    protected $casts = [
        'due_date' => 'date:Y-m-d',
        'paid_date' => 'date:Y-m-d',
        'stnk_before' => 'date:Y-m-d',
        'stnk_after' => 'date:Y-m-d',
        'pajak_before' => 'date:Y-m-d',
        'pajak_after' => 'date:Y-m-d',
        'periode' => 'integer',
        'tahun_ke' => 'integer',
        'cost' => 'integer',
        'denda' => 'integer',
    ];

    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(InvVehicle::class, 'vehicle_id');
    }

    public function bisaDibatalkan(): bool
    {
        return $this->pajak_before !== null;
    }

    public function rantaiUtuh(InvVehicle $vehicle): bool
    {
        return $this->pajak_after?->isSameDay($vehicle->tanggal_pajak_tahunan)
            && $this->stnk_after?->isSameDay($vehicle->tanggal_stnk);
    }
}
