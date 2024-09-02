<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransactionPlan extends Model
{
  use HasFactory;
  protected $fillable = ['transaction_hash_id', 'plan_date', 'branch_id', 'kelompok', 'kasbon', 'target', 'masuk', 'keluar', 'storting', 'drop', 'baru', 'lama', 'rencana'];
}
