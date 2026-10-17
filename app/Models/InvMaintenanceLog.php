<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InvMaintenanceLog extends Model
{
    protected $fillable = [
        'asset_id',
        'maintenance_date',
        'cost',
        'odometer',
        'description',
    ];

    protected $casts = [
        'maintenance_date' => 'date',
        'cost' => 'integer',
        'odometer' => 'integer',
    ];

    public function asset(): BelongsTo
    {
        return $this->belongsTo(InvAsset::class, 'asset_id');
    }
}
