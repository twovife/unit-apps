<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InvLocation extends Model
{
    protected $fillable = [
        'asset_id',
        'branch_id',
        'before_branch_id',
        'pengguna',
        'assigned_date',
        'notes',
    ];

    protected $casts = [
        'assigned_date' => 'date',
    ];

    public function asset(): BelongsTo
    {
        return $this->belongsTo(InvAsset::class, 'asset_id');
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function beforeBranch(): BelongsTo
    {
        return $this->belongsTo(Branch::class, 'before_branch_id');
    }
}
