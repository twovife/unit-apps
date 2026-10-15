<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SavingTransaction extends Model
{
    /**
     * Padanan hook app_laravel SavingTransaction::booted: kantor rekening ikut
     * transaksi terakhir (syncBranch), dan menghapus satu baris mutasi ikut
     * menghapus pasangannya (mutasi_ref). Regenerasi snapshot batch TERKUNCI
     * sengaja tidak disalin: unit-apps tidak pernah menulis ke batch terkunci
     * (SkswUnitController menolak tanpa pengecualian).
     */
    protected static function booted(): void
    {
        $sinkron = fn(self $tx) => $tx->rekening?->syncBranch();
        static::created($sinkron);
        static::updated($sinkron);
        static::deleting(function (self $tx) {
            if ($tx->mutasi_ref) {
                static::where('mutasi_ref', $tx->mutasi_ref)->where('id', '!=', $tx->id)->delete();
            }
        });
        static::deleted($sinkron);
    }

    protected $fillable = [
        'saving_id',
        'branch_id',
        'jenis',
        'transaction_date',
        'transaction_type',
        'debit',
        'kredit',
        'batch_id',
        'note',
        'created_by',
        'mutasi_ref',
    ];

    protected $casts = [
        'transaction_date' => 'date',
        'voided_at' => 'datetime',
        'debit' => 'integer',
        'kredit' => 'integer',
    ];

    public function scopeActive(Builder $query): void
    {
        $query->whereNull('voided_at');
    }

    public function rekening(): BelongsTo
    {
        return $this->belongsTo(Saving::class, 'saving_id');
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function batch(): BelongsTo
    {
        return $this->belongsTo(SavingBatch::class, 'batch_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function voidedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'voided_by');
    }
}
