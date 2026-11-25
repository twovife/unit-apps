<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Rombak resort — isi peta: resort asal -> resort tujuan. Baris dari == ke
 * tidak disimpan. Lihat .agents/rombak_resort.md §5.2.
 */
class TransactionResortRombakPeta extends Model
{
    protected $table = 'transaction_resort_rombak_peta';

    public $timestamps = false;

    protected $fillable = [
        'rombak_id',
        'dari_grouping_id',
        'dari_hari',
        'ke_grouping_id',
        'ke_hari',
    ];
}
