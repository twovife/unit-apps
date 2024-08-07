<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransactionLoanNominal extends Model
{
    use HasFactory;

    protected $fillable = [
        "transaction_loan_id", "drop_before", "request_nominal", "approved_nominal", "drop", "pinjaman", "created_at",
    ];

    public function loan()
    {
        return $this->belongsTo(TransactionLoan::class, 'transaction_loan_id', 'id');
    }
}
