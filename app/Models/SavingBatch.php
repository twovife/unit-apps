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

    /**
     * Hitung ulang snapshot semua batch TERKUNCI kantor ini mulai bulan $date.
     * Snapshot = saldo kumulatif per rekening per kantor s/d akhir bulan, jadi
     * tambah/ubah/hapus di bulan terbuka tetap harus menjalar ke bulan terkunci.
     * Kembaran: app_laravel SavingBatch::refreshLocked/generateSnapshot - ubah keduanya.
     */
    public static function refreshLocked(int $branchId, $date): void
    {
        self::where('branch_id', $branchId)
            ->where('status', 'locked')
            ->where('period', '>=', \Carbon\Carbon::parse($date)->format('Y-m'))
            ->orderBy('period')
            ->get()
            ->each(fn (self $batch) => $batch->generateSnapshot());
    }

    public function generateSnapshot(): void
    {
        $DB = \Illuminate\Support\Facades\DB::class;
        $now = now();
        $rows = $DB::table('saving_transactions')
            ->where('branch_id', $this->branch_id)
            ->where('transaction_date', '<=', \Carbon\Carbon::parse($this->period . '-01')->endOfMonth()->toDateString())
            ->whereNull('voided_at')
            ->groupBy('saving_id')
            ->havingRaw("SUM(CASE WHEN jenis IN ('SW', 'SK') THEN debit - kredit ELSE 0 END) != 0")
            ->selectRaw("saving_id, SUM(CASE WHEN jenis = 'SW' THEN debit - kredit ELSE 0 END) saldo_sw, SUM(CASE WHEN jenis = 'SK' THEN debit - kredit ELSE 0 END) saldo_sk")
            ->get()
            ->map(fn ($r) => ['saving_id' => $r->saving_id, 'branch_id' => $this->branch_id, 'period' => $this->period,
                'saldo_sw' => (int) $r->saldo_sw, 'saldo_sk' => (int) $r->saldo_sk, 'created_at' => $now, 'updated_at' => $now])
            ->all();

        $DB::transaction(function () use ($DB, $rows) {
            $DB::table('saving_monthly_snapshots')->where('branch_id', $this->branch_id)->where('period', $this->period)->delete();
            foreach (array_chunk($rows, 1000) as $chunk) {
                $DB::table('saving_monthly_snapshots')->insert($chunk);
            }
        });
    }
}
