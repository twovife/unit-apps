<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Znck\Eloquent\Traits\BelongsToThrough;

/**
 * Agregat HARIAN alur baru. Lihat .agents/agregasi_rekap.md §3, §4, §10.1.
 *
 * ⚠️ Enam kolom di tabel ini GENERATED STORED dan TIDAK BISA DITULIS:
 * `do11`, `titipan9`, `debit`, `kredit`, `tunai`, `selisih`. Mereka sengaja
 * TIDAK dimasukkan ke $fillable — MySQL akan menolak penulisannya (error 1906),
 * dan tabel lama membuat jebakan ini dengan mencantumkannya di $fillable.
 */
class TransactionDailyClosing extends Model
{
    use HasFactory, BelongsToThrough;

    /**
     * Kolom yang dihitung aplikasi dari tabel SUMBER saat pengesahan.
     * Sifatnya cache: selalu bisa dihitung ulang, dan harus bisa diverifikasi
     * ulang terhadap sumbernya.
     */
    public const KOLOM_TURUNAN = [
        'drop', 'storting',
        'storting_month1', 'storting_month2', 'storting_ccm',
        'storting_cm', 'storting_mb', 'storting_ml',
        'pemutihan',
    ];

    /**
     * Input manusia — sumber kebenaran sendiri, tidak diturunkan dari mana pun.
     * Justru karena itu WAJIB ikut beku saat dikunci: mengunci tabel sumber
     * tidak membekukan kolom-kolom ini, padahal kasbon & transport masuk ke
     * rumus tunai.
     */
    public const KOLOM_MANUAL = [
        'kasbon', 'transport', 'keluar', 'target', 'target_on',
        'target_source', 'setoran_mantri',
    ];

    /** Asal-usul angka target. Lihat §5.3. */
    public const TARGET_RANTAI = 'rantai';
    public const TARGET_RECOUNT = 'recount';
    public const TARGET_MANUAL = 'manual';

    protected $fillable = [
        'transaction_loan_officer_grouping_id',
        'date',
        ...self::KOLOM_TURUNAN,
        ...self::KOLOM_MANUAL,
        'kepala_approval_at', 'kepala_approval_user',
        'kasir_lock_at', 'kasir_lock_user',
    ];

    protected $casts = [
        'date' => 'date',
        'target_on' => 'date',
        'kepala_approval_at' => 'datetime',
        'kasir_lock_at' => 'datetime',
        'setoran_mantri' => 'integer',
    ];

    public function loan_officer_grouping()
    {
        return $this->belongsTo(
            TransactionLoanOfficerGrouping::class,
            'transaction_loan_officer_grouping_id',
            'id'
        );
    }

    public function branch()
    {
        return $this->belongsToThrough(Branch::class, TransactionLoanOfficerGrouping::class);
    }

    public function kepala()
    {
        return $this->belongsTo(Employee::class, 'kepala_approval_user', 'id');
    }

    public function kasir()
    {
        return $this->belongsTo(Employee::class, 'kasir_lock_user', 'id');
    }

    /** Terkunci = seluruh baris ini + sumbernya di tanggal itu beku. */
    public function terkunci(): bool
    {
        return $this->kasir_lock_at !== null;
    }

    public function sudahDisetujuiKepala(): bool
    {
        return $this->kepala_approval_at !== null;
    }

    /**
     * Setoran mantri sudah dicatat kasir?
     *
     * `0` sah — artinya mantri memang tidak menyetor. Yang belum dicatat itu
     * `null`. Tanpa membedakan keduanya, hari yang terlewat tidak bisa
     * dibedakan dari hari yang sepi.
     */
    public function setoranSudahDicatat(): bool
    {
        return $this->setoran_mantri !== null;
    }

    public function scopeTerkunci($query)
    {
        return $query->whereNotNull('kasir_lock_at');
    }

    public function scopeBelumTerkunci($query)
    {
        return $query->whereNull('kasir_lock_at');
    }
}
