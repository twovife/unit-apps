<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransactionLoanInstalment extends Model
{
  use HasFactory;

  protected $fillable = [
    "transaction_loan_id",
    "settled_by_loan_id",
    "transaction_loan_officer_grouping_id",
    "transaction_date",
    "nominal",
    "status",
    "instalment_notes",
    "danatitipan",
    "is_transfer",
    "user_mantri",
    "user_input"
  ];


  private static function bukaKunci($groupingId, $tanggal, string $aksi, $nominal): void
  {
    \App\Helpers\Gembok::bukaOtomatis($groupingId, $tanggal,
      sprintf('%s Rp %s', $aksi, number_format((int) $nominal, 0, ',', '.')));
  }

  protected static function boot()
  {
    parent::boot();

    // Penjaga terakhir untuk semua jalur tulis (bayar, fastcreate, sinkron, batch).
    static::creating(function (self $angsuran) {
      if ($angsuran->nominal < 0) {
        throw new \DomainException('Nominal angsuran tidak boleh minus.');
      }
      self::bukaKunci($angsuran->transaction_loan_officer_grouping_id, $angsuran->transaction_date, 'tambah angsuran', $angsuran->nominal);
    });

    // Koreksi user can-edit di tanggal terkunci -> tanggalnya dibuka otomatis
    // (Gembok::bukaOtomatis). Tanggal lama & baru sama-sama.
    static::updating(function (self $angsuran) {
      self::bukaKunci($angsuran->getOriginal('transaction_loan_officer_grouping_id'), $angsuran->getOriginal('transaction_date'), 'ubah angsuran #' . $angsuran->id, $angsuran->getOriginal('nominal'));
      self::bukaKunci($angsuran->transaction_loan_officer_grouping_id, $angsuran->transaction_date, 'ubah angsuran #' . $angsuran->id, $angsuran->nominal);
    });

    static::deleting(function (self $angsuran) {
      self::bukaKunci($angsuran->transaction_loan_officer_grouping_id, $angsuran->transaction_date, 'hapus angsuran #' . $angsuran->id, $angsuran->nominal);
    });

    // F1: angsuran masuk/keluar -> status lunas induk dihitung ulang penuh dari
    // sumber (TransactionLoan::hitungUlangPelunasan). Di created/deleted, bukan
    // creating/deleting, supaya baris ini sudah / tidak lagi ikut terjumlah.
    // (Increment storting ke transaction_daily_recaps dicabut 2026-08-02.)
    static::created(function (self $angsuran) {
      if ($angsuran->nominal <= 0 || !$loan = $angsuran->loan) {
        return;
      }

      // Rekening -> 'ist' (istirahat): lunas lewat pelunasan MANUAL, tanpa
      // topup. Settlement topup (settled_by_loan_id) ditandai 'pelunasan' di
      // hook TransactionLoan. Penanda lunak.
      if ($loan->hitungUlangPelunasan() && !$angsuran->settled_by_loan_id) {
        \App\Helpers\SiklusRekening::tandai($loan->transaction_manage_customer_id, \App\Helpers\SiklusRekening::IST);
      }
    });

    static::deleted(function (self $angsuran) {
      if ($angsuran->nominal <= 0 || !$loan = $angsuran->loan) {
        return;
      }

      // Pelunasan manual dibatalkan -> siklus 'ist' ikut kosong. Baris
      // settlement topup dibersihkan lewat reverseAutoSettlement.
      if (!$loan->hitungUlangPelunasan() && !$angsuran->settled_by_loan_id) {
        \App\Helpers\SiklusRekening::bersihkan($loan->transaction_manage_customer_id);
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
