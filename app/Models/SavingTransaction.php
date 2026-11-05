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
     * menghapus pasangannya (mutasi_ref), dan tiap perubahan menghitung ulang
     * snapshot bulan terkunci kantor itu (SavingBatch::refreshLocked) - bulan
     * terbuka pun memengaruhi saldo kumulatif bulan terkunci sesudahnya.
     */
    protected static function booted(): void
    {
        $sinkron = function (self $tx) {
            $tx->rekening?->syncBranch();
            SavingBatch::refreshLocked($tx->branch_id, $tx->transaction_date);
            if ($tx->wasChanged(['branch_id', 'transaction_date'])) {
                SavingBatch::refreshLocked($tx->getOriginal('branch_id'), $tx->getOriginal('transaction_date'));
            }
        };
        static::created($sinkron);
        static::updated($sinkron);
        static::deleting(function (self $tx) {
            if ($tx->mutasi_ref) {
                $pasangan = static::where('mutasi_ref', $tx->mutasi_ref)->where('id', '!=', $tx->id);
                $kena = $pasangan->get(['branch_id', 'transaction_date']);
                $pasangan->delete();
                // delete() lewat query tidak memicu event: snapshot kantor pasangan dihitung di sini
                $kena->each(fn ($t) => SavingBatch::refreshLocked($t->branch_id, $t->transaction_date));
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
        'transaction_date' => 'date:Y-m-d',
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
