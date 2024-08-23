<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransactionLoan extends Model
{
  use HasFactory;

  protected $fillable = [
    "transaction_manage_customer_id",
    "branch_id",
    "request_date",
    "check_date",
    "drop_date",
    "hari",
    "pinjaman_ke",
    "status",
    "notes",
    "user_input",
    "old_id",
    "drop_before",
    "request_nominal",
    "approved_nominal",
    "drop",
    "pinjaman",
  ];

  public function loan_instalment()
  {
    return $this->hasMany(TransactionLoanInstalment::class, 'transaction_loan_id', 'id');
  }

  public function manage_customer()
  {
    return $this->belongsTo(TransactionManageCustomer::class, 'transaction_manage_customer_id', 'id');
  }
  public function branch()
  {
    return $this->belongsTo(Branch::class, 'branch_id', 'id');
  }
}
