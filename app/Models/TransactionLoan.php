<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransactionLoan extends Model
{
    use HasFactory;

    protected $fillable = [
        "transaction_manage_customers", "branch_id", "request_date", "check_date", "drop_date", "hari", "pinjaman_ke", "status", "notes", "user_input", "old_id",
    ];

    public function loan_instalment()
    {
        return $this->hasMany(TransactionLoanInstalment::class, 'transaction_loan_id', 'id');
    }
    public function loan_nominal()
    {
        return $this->hasMany(TransactionLoanNominal::class, 'transaction_loan_id', 'id');
    }
}
