<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransactionCustomer extends Model
{
    use HasFactory;

    protected $fillable  = [
        "nama",
        "nik",
        "no_kk",
        "alamat",
    ];

    public function manage_customer()
    {
        return $this->hasMany(TransactionManageCustomer::class, 'transaction_customer_id', 'id');
    }
}
