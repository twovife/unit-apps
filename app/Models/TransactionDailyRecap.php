<?php

namespace App\Models;

use App\Helpers\AppHelper;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Znck\Eloquent\Traits\BelongsToThrough;

class TransactionDailyRecap extends Model
{
  use HasFactory, BelongsToThrough;

  protected $fillable = [
    "transaction_loan_officer_grouping_id",
    "date",
    "target_on",
    "kasbon",
    "storting",
    "sharingdo",
    "titipan",
    "debt",
    "drop",
    "transport",
    "kred",
    "tunai",
    "masuk",
    "keluar",
    "target",
    "daily_kepala_approval",
    "daily_kepala_approval_user",
    "daily_kasir_approval",
    "daily_kasir_approval_user",
    "monthly_kepala_approval",
    "monthly_kepala_approval_user",
    "monthly_kasir_approval",
    "monthly_kasir_approval_user",

  ];

  protected static function boot()
  {
    parent::boot();

    static::updating(function ($transactionDailyRecap) {

      if ($transactionDailyRecap->isDirty('keluar') || $transactionDailyRecap->isDirty('drop')) {
        //get transaction with same day name

        // dd('im berubah');
        // dd($transactionDailyRecap);
        $transactionAfter = TransactionDailyRecap::where('transaction_loan_officer_grouping_id', $transactionDailyRecap->transaction_loan_officer_grouping_id)
          ->where('target_on', $transactionDailyRecap->date)
          ->first();
        // dd($transactionDailyRecap->target + $transactionDailyRecap->masuk - $transactionDailyRecap->keluar);
        if ($transactionAfter) {
          $transactionAfter->update([
            'target' => $transactionDailyRecap->target + ($transactionDailyRecap->drop * 0.13) - $transactionDailyRecap->keluar,
          ]);
        }
      }

      if ($transactionDailyRecap->isDirty('target')) {

        $transactionAfter = TransactionDailyRecap::where('transaction_loan_officer_grouping_id', $transactionDailyRecap->transaction_loan_officer_grouping_id)
          ->where('target_on', $transactionDailyRecap->date)
          ->first();

        $originalTarget = $transactionDailyRecap->getOriginal('target');
        $newTarget = $transactionDailyRecap->target;

        $rangeTarget = $newTarget - $originalTarget;

        if ($transactionAfter) {
          $transactionAfter->increment('target', $rangeTarget);
        }
      }

      if ($transactionDailyRecap->isDirty('storting') || $transactionDailyRecap->isDirty('drop')) {
        if ($transactionDailyRecap->target_on == null && $transactionDailyRecap->storting == 0 && $transactionDailyRecap->drop == 0) {
          $transactionDailyRecap->delete();
        }
      }
    });
  }
  // static::deleting(function ($transactionDailyRecap) {
  //   $transactionBefore = TransactionDailyRecap::where('transaction_loan_officer_grouping_id', $transactionDailyRecap->transaction_loan_officer_grouping_id)
  //     ->where('target_on', "<", $transactionDailyRecap->target_on)
  //     ->get();

  //   $transactionAfter = TransactionDailyRecap::where('transaction_loan_officer_grouping_id', $transactionDailyRecap->transaction_loan_officer_grouping_id)
  //     ->where('target_on', ">", $transactionDailyRecap->date)
  //     ->get();
  // });


  public function transaction_loan_officer_grouping()
  {
    return $this->belongsTo(TransactionLoanOfficerGrouping::class, 'transaction_loan_officer_grouping_id', 'id');
  }

  public function branch()
  {
    return $this->belongsToThrough(Branch::class, TransactionLoanOfficerGrouping::class);
  }
}
