<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Saving extends Model
{
    protected $fillable = [
        'employee_id',
        'branch_id',
        'nomor_rekening',
        'tgl_daftar',
    ];

    protected $casts = [
        'tgl_daftar' => 'date',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(SavingTransaction::class);
    }

    public function saldoSW(): int
    {
        return (int) $this->transactions()
            ->where('jenis', 'SW')
            ->active()
            ->selectRaw('COALESCE(SUM(debit), 0) - COALESCE(SUM(kredit), 0) as net')
            ->value('net');
    }

    /**
     * Kantor rekening = kantor transaksi aktif terakhir (sesudah mutasi rekening
     * ikut pindah). Sama dengan app_laravel Saving::syncBranch.
     */
    public function syncBranch(): void
    {
        $latestTx = $this->transactions()->active()->orderByDesc('transaction_date')->orderByDesc('id')->first();

        if ($latestTx && (int) $latestTx->branch_id !== (int) $this->branch_id) {
            $this->update(['branch_id' => $latestTx->branch_id]);
        }
    }

    public function saldoSK(): int
    {
        return (int) $this->transactions()
            ->where('jenis', 'SK')
            ->active()
            ->selectRaw('COALESCE(SUM(debit), 0) - COALESCE(SUM(kredit), 0) as net')
            ->value('net');
    }
}
