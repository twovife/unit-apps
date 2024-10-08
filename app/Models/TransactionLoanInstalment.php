<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransactionLoanInstalment extends Model
{
  use HasFactory;

  protected $fillable = [
    "transaction_loan_id",
    "transaction_loan_officer_grouping_id",
    "transaction_date",
    "nominal",
    "status",
    "instalment_notes",
    "danatitipan",
    "user_mantri",
    "user_input"
  ];

  public function loan()
  {
    return $this->belongsTo(TransactionLoan::class, 'transaction_loan_id', 'id');
  }

  public function usermantri()
  {
    return $this->belongsTo(Employee::class, 'user_mantri', 'id');
  }

  public function userinput()
  {
    return $this->belongsTo(Employee::class, 'user_input', 'id');
  }

  public function loan_officer_grouping()
  {
    return $this->belongsTo(TransactionLoanOfficerGrouping::class, 'transaction_loan_officer_grouping_id', 'id');
  }
}
