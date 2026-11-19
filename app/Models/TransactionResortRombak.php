<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Rombak resort — kepala. Satu baris = satu rancangan susunan resort sebuah
 * kantor yang berlaku mulai `berlaku_bulan` (tanggal 1). Status: draf /
 * diterapkan / dibatalkan. Lihat .agents/rombak_resort.md §5.1.
 */
class TransactionResortRombak extends Model
{
    protected $fillable = [
        'branch_id',
        'berlaku_bulan',
        'status',
        'catatan',
        'ringkasan',
        'dibuat_oleh',
        'diterapkan_oleh',
        'diterapkan_at',
        'dibatalkan_oleh',
        'dibatalkan_at',
    ];

    protected $casts = [
        'berlaku_bulan' => 'date:Y-m-d',
        'ringkasan' => 'array',
        'diterapkan_at' => 'datetime',
        'dibatalkan_at' => 'datetime',
    ];

    public function peta()
    {
        return $this->hasMany(TransactionResortRombakPeta::class, 'rombak_id');
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }
}
