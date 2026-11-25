<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransactionWhiteOff extends Model
{

  protected $fillable = ["id", "transaction_loan_id", "transaction_loan_officer_grouping_id", "transaction_date", "nominal"];
  use HasFactory;

  // Koreksi user can-edit di tanggal terkunci -> tanggalnya dibuka otomatis,
  // sama dengan angsuran (TransactionLoanInstalment).
  protected static function boot()
  {
    parent::boot();
    $buka = fn(self $w, string $aksi) => \App\Helpers\Gembok::bukaOtomatis(
      $w->transaction_loan_officer_grouping_id,
      $w->transaction_date,
      sprintf('%s pemutihan Rp %s', $aksi, number_format((int) $w->nominal, 0, ',', '.'))
    );
    static::creating(fn(self $w) => $buka($w, 'tambah'));
    static::deleting(fn(self $w) => $buka($w, 'hapus'));
  }


  public function transaction_loan()
  {
    return $this->belongsTo(TransactionLoan::class, 'transaction_loan_id', 'id');
  }

  public function transaction_loan_officer_grouping()
  {
    return $this->belongsTo(TransactionLoanOfficerGrouping::class, 'transaction_loan_officer_grouping_id', 'id');
  }
}
