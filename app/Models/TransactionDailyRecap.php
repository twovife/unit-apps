<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Znck\Eloquent\Traits\BelongsToThrough;

class TransactionDailyRecap extends Model
{
  use HasFactory, BelongsToThrough;

  protected $fillable = [
    "transaction_loan_officer_grouping_id",
    "date",
    "kasbon",
    "target",
    "masuk",
    "keluar",
    "storting",
    "drop",
    "rencana",
    "transport",
    "tunai",
    "kurangan",
    "daily_kepala_approval",
    "daily_kepala_approval_user",
    "daily_kasir_approval",
    "daily_kasir_approval_user",
    "monthly_kepala_approval",
    "monthly_kepala_approval_user",
    "monthly_kasir_approval",
    "monthly_kasir_approval_user",

  ];

  public function transaction_loan_officer_grouping()
  {
    return $this->belongsTo(TransactionLoanOfficerGrouping::class, 'transaction_loan_officer_grouping_id', 'id');
  }

  public function branch()
  {
    return $this->belongsToThrough(Branch::class, TransactionLoanOfficerGrouping::class);
  }
}
