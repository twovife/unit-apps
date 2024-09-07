<?php

namespace App\Models;

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
    return $this->belongsToThrough(Branch::class, TransactionLoanOfficerGrouping::class);
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
