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
        $transactionDailyRecap->save();
      }

      $sumNominal = TransactionLoanInstalment::where('transaction_loan_id', $transactionLoanInstalment->transaction_loan_id)->where('id', "!=", $transactionLoanInstalment->id)->sum('nominal') + $transactionLoanInstalment->nominal;

      if ($transactionDailyRecap->loan()->pinjaman == $sumNominal) {
        $transactionDailyRecap->loan()->update([
          'out_date' => $transactionLoanInstalment->transaction_date,
          'out_status' => 'LUNAS',
        ]);
      }

      if ($transactionDailyRecap->loan()->pinjaman < $sumNominal) {
        $transactionDailyRecap->loan()->update([
          'out_date' => $transactionLoanInstalment->transaction_date,
          'out_status' => 'LUNAS Xs',
        ]);
      }
    });


    static::deleting(function ($transactionLoanInstalment) {

      if ($transactionLoanInstalment->nominal > 0) {
        $transactionDailyRecap = TransactionDailyRecap::where(
          "transaction_loan_officer_grouping_id",
          $transactionLoanInstalment->transaction_loan_officer_grouping_id,
        )->where("date", $transactionLoanInstalment->transaction_date)->first();

        // dd($transactionDailyRecap);
        if ($transactionDailyRecap) {
          $transactionDailyRecap->decrement('storting', $transactionLoanInstalment->nominal);
          $transactionDailyRecap->save();
        }
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
