<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SavingBatch extends Model
{
    protected $fillable = [
        'branch_id',
        'period',
        'status',
        'validated_at',
        'locked_at',
        'locked_by',
    ];

    protected $casts = [
        'validated_at' => 'datetime',
        'locked_at' => 'datetime',
    ];

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }
}
