<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/** Satu item Checklist Aplikasi Baru yang sudah diselesaikan satu kantor (sekali per kantor). */
class BranchChecklist extends Model
{
    protected $fillable = ['branch_id', 'item', 'done_at', 'user_id'];

    protected $casts = ['done_at' => 'datetime'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
