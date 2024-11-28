<?php

namespace App\Models;

use App\Helpers\AppHelper;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Staudenmeir\EloquentHasManyDeep\HasRelationships;
use Znck\Eloquent\Traits\BelongsToThrough;

class TransactionLoan extends Model
{
  use HasFactory;
  use HasRelationships;
  use BelongsToThrough;

  protected $fillable = [
    "transaction_manage_customer_id",
    "transaction_loan_officer_grouping_id",
    "old_id",
    "drop_before",
    "drop_date_before",
    "drop_date",
    "request_date",
    "request_nominal",
    "user_mantri",
    "approved_nominal",
    "check_date",
    "user_check",
    "nominal_drop",
    "user_drop",
    "pinjaman",
    "hari",
    "pinjaman_ke",
    "status",
    "notes",
    "user_input",
    "drop_langsung",
    "out_date",
    "out_status"
  ];


  protected static function boot()
  {
    parent::boot();

    static::updating(function ($transactionLoan) {

      $origilanDate = $transactionLoan->getOriginal('drop_date');
      $newDate = $transactionLoan->drop_date;

      if (AppHelper::dateName($origilanDate) !== AppHelper::dateName($newDate)) {
        return redirect()->back()->withErrors('Hari Pada Tanggal Yang Diubah Harus Sama');
      }

      if ($transactionLoan->isDirty('status')) {
        $originalStatus = $transactionLoan->getOriginal('status');
        $newStatus = $transactionLoan->status;

        if (($originalStatus === 'success') !== ($newStatus === 'success')) {

          $sumDropLoanDay = TransactionLoan::where('transaction_loan_officer_grouping_id', $transactionLoan->transaction_loan_officer_grouping_id)
            ->where('drop_date', $transactionLoan->drop_date)->where('status', 'success')->where('id', '!=', $transactionLoan->id)->sum('nominal_drop') ?? 0;

          if ($newStatus == 'success') {
            $sumDropLoanDay += $transactionLoan->nominal_drop;
          }

          $dailyRekap = TransactionDailyRecap::firstOrCreate([
            "transaction_loan_officer_grouping_id" => $transactionLoan->transaction_loan_officer_grouping_id,
            "date" => $transactionLoan->drop_date,
          ]);

          if ($dailyRekap->drop != $sumDropLoanDay) {
            $dailyRekap->update([
              "drop" => $sumDropLoanDay,
            ]);
          }
        }
      }


      if ($transactionLoan->isDirty('drop_date')) {
        $sumLoan = TransactionLoan::where('transaction_loan_officer_grouping_id', $transactionLoan->transaction_loan_officer_grouping_id)
          ->whereIn('drop_date', [$origilanDate, $newDate])->where('status', 'success')->where('id', '!=', $transactionLoan->id)->get()->groupBy('drop_date')->map(function ($item, $key) {
            return $item->sum('nominal_drop');
          });

        $sumOriginalDate = $sumLoan[$origilanDate] ?? 0;
        $sumDestinationDate = $sumLoan[$newDate] ?? 0;

        if ($transactionLoan->getOriginal('status') == 'success') {
          $sumDestinationDate += $transactionLoan->nominal_drop;
        }


        // remove total drop on original Day
        $dailyRekapOriginalDay = TransactionDailyRecap::where(
          "transaction_loan_officer_grouping_id",
          $transactionLoan->transaction_loan_officer_grouping_id
        )->where("date", $origilanDate)->first();

        $dailyRekapOriginalDay->update([
          "drop" => $sumOriginalDate,
        ]);


        // add total drop on new Day

        $dailyRekapNewDay = TransactionDailyRecap::firstOrCreate([
          "transaction_loan_officer_grouping_id" => $transactionLoan->transaction_loan_officer_grouping_id,
          "date" => $newDate,
        ]);

        if ($dailyRekapNewDay->wasRecentlyCreated) {
          $sumAllInstalment = TransactionLoanInstalment::where(
            "transaction_loan_officer_grouping_id",
            $transactionLoan->transaction_loan_officer_grouping_id
          )->where("transaction_date", $newDate)->sum('nominal');
          $dailyRekapNewDay->update([
            "storting" => $sumAllInstalment,
            "drop" => $sumDestinationDate,
          ]);
        } else {
          $dailyRekapNewDay->update([
            "drop" => $sumDestinationDate,
          ]);
        }
      }




      if ($transactionLoan->isDirty('nominal_drop')) {

        if ($transactionLoan->getOriginal('status') == $transactionLoan->status) {
          $sumDropLoanDay = TransactionLoan::where('transaction_loan_officer_grouping_id', $transactionLoan->transaction_loan_officer_grouping_id)
            ->where('drop_date', $transactionLoan->drop_date)->where('status', 'success')->where('id', '!=', $transactionLoan->id)->sum('nominal_drop');

          $sumDropLoanDay += $transactionLoan->nominal_drop;

          $dailyRekap = TransactionDailyRecap::where(
            "transaction_loan_officer_grouping_id",
            $transactionLoan->transaction_loan_officer_grouping_id,
          )->where("date", $transactionLoan->drop_date)->first();

          if ($dailyRekap->drop != $sumDropLoanDay) {
            $dailyRekap->update([
              "drop" => $sumDropLoanDay,
            ]);
          }
        }
      }
    });


    static::deleting(function ($transactionLoan) {


      foreach ($transactionLoan->loan_instalment as $loanInstalment) {
        $loanInstalment->delete();
        // Ini akan memicu event deleting dan deleted pada LoanInstalment
      }

      if ($transactionLoan->status == "success") {
        $sumDropLoanDay = TransactionLoan::where('transaction_loan_officer_grouping_id', $transactionLoan->transaction_loan_officer_grouping_id)
          ->where('drop_date', $transactionLoan->drop_date)->where('status', 'success')->where('id', '!=', $transactionLoan->id)->sum('nominal_drop');

        $dailyRekap = TransactionDailyRecap::where(
          "transaction_loan_officer_grouping_id",
          $transactionLoan->transaction_loan_officer_grouping_id,
        )->where("date", $transactionLoan->drop_date)->first();

        if ($dailyRekap) {
          if ($dailyRekap->drop != $sumDropLoanDay) {
            $dailyRekap->update([
              "drop" => $sumDropLoanDay,
            ]);
          }
        }
      }
    });
  }



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
    return $this->belongsToThrough(Branch::class, TransactionLoanOfficerGrouping::class);
  }

  public function loan_officer_grouping()
  {
    return $this->belongsTo(TransactionLoanOfficerGrouping::class, 'transaction_loan_officer_grouping_id', 'id');
  }
  public function userinput()
  {
    return $this->belongsTo(Employee::class, 'user_input', 'id');
  }

  public function customer()
  {
    return $this->hasOneThrough(TransactionCustomer::class, TransactionManageCustomer::class, 'id', 'id', 'transaction_manage_customer_id', 'transaction_customer_id');
  }

  public function mantri()
  {
    return $this->belongsTo(Employee::class, 'user_mantri', 'id');
  }
}
