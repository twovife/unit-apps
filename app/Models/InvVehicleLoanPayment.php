<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/** Satu angsuran motor: periode = bulan tagihan (tgl 1), tanggal_bayar = tanggal transfer sebenarnya. */
class InvVehicleLoanPayment extends Model
{
    protected $fillable = ['loan_id', 'angsuran_ke', 'periode', 'tanggal_bayar', 'nominal', 'bukti_path', 'sumber', 'batch_ref', 'user_id'];

    protected $casts = [
        'angsuran_ke' => 'integer',
        'nominal' => 'integer',
        'periode' => 'date:Y-m-d',
        'tanggal_bayar' => 'date:Y-m-d',
        'bukti_path' => 'array', // daftar path bukti transfer (satu slip bisa dipakai banyak motor)
    ];

    public function loan(): BelongsTo
    {
        return $this->belongsTo(InvVehicleLoan::class, 'loan_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
