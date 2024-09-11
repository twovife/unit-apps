<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransactionSirculation extends Model
{
  use HasFactory;

  protected $fillable = ['transaction_loan_officer_grouping_id', 'date', 'amount', 'mb_amount'];

  public function transaction_loan_officer_grouping()
  {
    return $this->belongsTo(TransactionLoanOfficerGrouping::class, 'transaction_loan_officer_grouping_id', 'id');
  }
}
