<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Lookup siklus rekening nasabah (pelunasan/ist/bht/…).
 *
 * Nilainya DATA, bukan hardcode: menambah jenis baru cukup insert baris.
 * transaction_manage_customers menunjuk ke sini lewat `siklus_id`.
 * Lihat migrasi app_laravel 2026_09_10_100000_create_transaction_siklus_table.
 */
class TransactionSiklus extends Model
{
    protected $table = 'transaction_siklus';

    protected $fillable = ['kode', 'nama', 'keterangan', 'urutan'];

    public function manage_customers()
    {
        return $this->hasMany(TransactionManageCustomer::class, 'siklus_id', 'id');
    }
}
