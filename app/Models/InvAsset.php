<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class InvAsset extends Model
{
    protected $fillable = [
        'category_id',
        'asset_code',
        'name',
        'purchase_date',
        'purchase_cost',
        'status',
        'description',
    ];

    protected $casts = [
        'purchase_date' => 'date',
        'purchase_cost' => 'integer',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(InvCategory::class, 'category_id');
    }

    public function vehicle(): HasOne
    {
        return $this->hasOne(InvVehicle::class, 'asset_id');
    }

    public function currentLocation(): HasOne
    {
        return $this->hasOne(InvLocation::class, 'asset_id')->latestOfMany();
    }

    public function locations(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(InvLocation::class, 'asset_id');
    }

    public function maintenanceLogs(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(InvMaintenanceLog::class, 'asset_id');
    }
}
