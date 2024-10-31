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


  protected static function boot()
  {
    parent::boot();

    static::creating(function ($transactionLoanInstalment) {
      if ($transactionLoanInstalment->nominal > 0) {
        $transactionDailyRecap = TransactionDailyRecap::firstOrCreate([
          "transaction_loan_officer_grouping_id" => $transactionLoanInstalment->transaction_loan_officer_grouping_id,
          "date" => $transactionLoanInstalment->transaction_date,
        ]);
        $transactionDailyRecap->increment('storting', $transactionLoanInstalment->nominal);
      }
    });


    static::deleting(function ($transactionLoanInstalment) {
      if ($transactionLoanInstalment->nominal > 0) {
        $transactionDailyRecap = TransactionDailyRecap::firstOrCreate([
          "transaction_loan_officer_grouping_id" => $transactionLoanInstalment->transaction_loan_officer_grouping_id,
          "date" => $transactionLoanInstalment->transaction_date,
        ]);
        $transactionDailyRecap->decrement('storting', $transactionLoanInstalment->nominal);
      }
    });
  }

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
