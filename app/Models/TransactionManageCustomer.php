<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransactionManageCustomer extends Model
{
  use HasFactory;

  protected $fillable = [
    "transaction_customer_id",
    "transaction_loan_officer_grouping_id"
  ];

  public function customers()
  {
    return $this->belongsTo(TransactionCustomer::class, 'transaction_customer_id', 'id');
  }

  public function loan()
  {
    return $this->hasMany(TransactionLoan::class, 'transaction_manage_customer_id', 'id');
  }

  public function branch()
  {
    return $this->belongsTo(Branch::class, 'branch_id', 'id');
  }
}
