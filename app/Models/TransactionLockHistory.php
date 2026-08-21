<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Jejak buka-tutup gembok. Lihat .agents/agregasi_rekap.md §3.6, §4.7.
 *
 * `tunai_sebelum`/`tunai_sesudah` bukan hiasan: `tunai` adalah generated column
 * yang tidak pernah tersimpan, jadi begitu kunci dibuka dan inputnya diubah,
 * angka yang dulu ditandatangani kasir hilang permanen. Tabel ini satu-satunya
 * tempat angka itu bisa ditemukan lagi.
 */
class TransactionLockHistory extends Model
{
    use HasFactory;

    public const AKSI_KUNCI = 'kunci';
    public const AKSI_BUKA = 'buka';

    protected $fillable = [
        'transaction_daily_closing_id',
        'transaction_monthly_closing_id',
        'transaction_loan_officer_grouping_id',
        'tanggal',
        'aksi',
        'user_id',
        'user_pemberi_izin',
        'tunai_sebelum',
        'tunai_sesudah',
        'alasan',
    ];

    protected $casts = [
        'tanggal' => 'date',
    ];

    public function pelaku()
    {
        return $this->belongsTo(Employee::class, 'user_id', 'id');
    }

    public function pemberiIzin()
    {
        return $this->belongsTo(Employee::class, 'user_pemberi_izin', 'id');
    }

    public function dailyClosing()
    {
        return $this->belongsTo(TransactionDailyClosing::class, 'transaction_daily_closing_id', 'id');
    }
}
