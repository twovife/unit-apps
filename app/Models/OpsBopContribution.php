<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OpsBopContribution extends Model
{
    protected $table = 'ops_bop_contributions';

    protected $fillable = [
        'branch_id',
        'period',
        'amount',
        'payment_date',
        'notes',
        'created_by',
    ];

    protected $casts = [
        'payment_date' => 'date:Y-m-d',
        'amount' => 'integer',
    ];

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
