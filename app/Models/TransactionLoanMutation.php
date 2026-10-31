<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Mutasi nasabah — pinjaman pindah kelompok. Lihat .agents/agregasi_rekap.md §7b.
 *
 * Satu baris = satu pinjaman pindah, berlaku sejak `berlaku_bulan` (tanggal 1)
 * sampai `berlaku_sampai` (diisi saat mutasi berikutnya). Ember dihitung dari
 * drop_date pinjaman, bukan disimpan di sini.
 */
class TransactionLoanMutation extends Model
{
    protected $fillable = [
        'transaction_loan_id',
        'dari_grouping_id',
        'dari_hari',
        'ke_grouping_id',
        'ke_hari',
        'berlaku_bulan',
        'berlaku_sampai',
        'alasan',
        'user_input',
    ];

    protected $casts = [
        'berlaku_bulan' => 'date:Y-m-d',
        'berlaku_sampai' => 'date:Y-m-d',
    ];

    public function loan()
    {
        return $this->belongsTo(TransactionLoan::class, 'transaction_loan_id', 'id');
    }

    public function dari()
    {
        return $this->belongsTo(TransactionLoanOfficerGrouping::class, 'dari_grouping_id', 'id');
    }

    public function ke()
    {
        return $this->belongsTo(TransactionLoanOfficerGrouping::class, 'ke_grouping_id', 'id');
    }

    public function penginput()
    {
        return $this->belongsTo(Employee::class, 'user_input', 'id');
    }
}
