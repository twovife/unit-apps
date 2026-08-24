<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Penyesuaian saldo pinjaman yang TIDAK menyentuh kas.
 *
 * Menggeser saldo nasabah tanpa membuat baris angsuran, sehingga storting —
 * dan karenanya tunai — tidak ikut bergerak. Ini pengganti resmi dua cara lama
 * yang dua-duanya merusak:
 *
 *   - angsuran penyesuaian  -> menaikkan storting -> uang hantu di kas
 *   - pemutihan             -> laporan pemutihan menggelembung oleh peristiwa
 *                              yang tidak pernah terjadi
 *
 * Lihat .agents/agregasi_rekap.md §7.
 */
class TransactionSaldoAdjustment extends Model
{
    use HasFactory;

    /** Nasabah lama masuk membawa saldo. Mengurangi saldo. */
    public const JENIS_SALDO_AWAL = 'saldo_awal';

    /** Satu orang terlanjur jadi dua pinjaman. Mengurangi saldo. */
    public const JENIS_DUPLIKAT = 'duplikat';

    /** Nasabah tercatat kurang dari sebenarnya. MENAMBAH saldo. */
    public const JENIS_KURANG_INPUT = 'kurang_input';

    /** Nasabah tercatat lebih dari sebenarnya. Mengurangi saldo. */
    public const JENIS_LEBIH_INPUT = 'lebih_input';

    /**
     * Arah tiap jenis terhadap saldo. `nominal` selalu positif, jadi INI
     * satu-satunya tempat yang menentukan tanda.
     *
     * Jangan menulis tanda minus di tempat lain — kalau arahnya tersebar,
     * satu tempat yang salah tanda menghasilkan saldo yang meleset tanpa ada
     * yang tahu, dan itu jenis kesalahan yang paling sulit dilacak.
     */
    public const ARAH = [
        self::JENIS_SALDO_AWAL   => -1,
        self::JENIS_DUPLIKAT     => -1,
        self::JENIS_LEBIH_INPUT  => -1,
        self::JENIS_KURANG_INPUT => +1,
    ];

    /**
     * Jenis yang WAJIB disetujui orang kedua.
     *
     * `saldo_awal` sengaja tidak masuk: pembatasnya kuota ML (§13.3), bukan
     * orang. Mewajibkan dua orang untuk ribuan baris input nasabah lama cuma
     * mendorong staf mencari jalan pintas — dan jalan pintas yang tersedia
     * adalah inputmacet lama yang justru membuat drop palsu.
     */
    public const WAJIB_PERSETUJUAN = [
        self::JENIS_DUPLIKAT,
        self::JENIS_KURANG_INPUT,
        self::JENIS_LEBIH_INPUT,
    ];

    protected $fillable = [
        'transaction_loan_id',
        'transaction_loan_officer_grouping_id',
        'jenis',
        'nominal',
        'berlaku_bulan',
        'user_input',
        'user_approve',
        'approved_at',
        'catatan',
    ];

    protected $casts = [
        'berlaku_bulan' => 'date',
        'approved_at' => 'datetime',
        'nominal' => 'integer',
    ];

    /**
     * Efek bertanda terhadap saldo pinjaman.
     *
     * Pemakaian: saldo = pinjaman − angsuran − pemutihan + Σ efek_saldo
     */
    public function getEfekSaldoAttribute(): int
    {
        return (self::ARAH[$this->jenis] ?? 0) * (int) $this->nominal;
    }

    public function butuhPersetujuan(): bool
    {
        return in_array($this->jenis, self::WAJIB_PERSETUJUAN, true);
    }

    public function sudahDisetujui(): bool
    {
        return !$this->butuhPersetujuan() || $this->approved_at !== null;
    }

    public function loan()
    {
        return $this->belongsTo(TransactionLoan::class, 'transaction_loan_id', 'id');
    }

    public function loan_officer_grouping()
    {
        return $this->belongsTo(
            TransactionLoanOfficerGrouping::class,
            'transaction_loan_officer_grouping_id',
            'id'
        );
    }

    public function penginput()
    {
        return $this->belongsTo(Employee::class, 'user_input', 'id');
    }

    public function penyetuju()
    {
        return $this->belongsTo(Employee::class, 'user_approve', 'id');
    }

    /** Hanya yang benar-benar berlaku: koreksi yang belum disetujui tidak dihitung. */
    public function scopeBerlaku($query)
    {
        return $query->where(function ($q) {
            $q->whereNotIn('jenis', self::WAJIB_PERSETUJUAN)
              ->orWhereNotNull('approved_at');
        });
    }
}
