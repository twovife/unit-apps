<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Log Koreksi Data Beku: satu baris per koreksi angsuran bertanggal sebelum
 * migrasi kantor (App\Helpers\KoreksiBeku). Tabel dibuat dari app_laravel
 * (2026_10_11_100000_koreksi_data_beku).
 */
class TransactionKoreksiBeku extends Model
{
    protected $table = 'transaction_koreksi_beku';

    protected $fillable = [
        'branch_id', 'transaction_loan_id', 'transaction_loan_instalment_id',
        'aksi', 'sebelum', 'sesudah', 'dampak', 'alasan', 'user_id',
    ];

    protected $casts = [
        'sebelum' => 'array',
        'sesudah' => 'array',
        'dampak' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function loan()
    {
        return $this->belongsTo(TransactionLoan::class, 'transaction_loan_id');
    }
}
