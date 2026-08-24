<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Znck\Eloquent\Traits\BelongsToThrough;

/**
 * Agregat BULANAN alur baru. Lihat .agents/agregasi_rekap.md §10.2, §11.
 *
 * ⚠️ `awal_total` dan `akhir_total` GENERATED STORED — tidak bisa ditulis.
 */
class TransactionMonthlyClosing extends Model
{
    use HasFactory, BelongsToThrough;

    /** Enam ember, urut dari termuda. Urutan ini yang dipakai pergeseran. */
    public const EMBER = ['month1', 'month2', 'ccm', 'cm', 'mb', 'ml'];

    /**
     * Pergeseran ember antar bulan: saldo akhir sebuah ember jadi saldo awal
     * ember BERIKUTNYA bulan depan, bukan ember yang sama. `ml` mentok di `ml`.
     *
     * Ini juga alat periksa: saldo tiap ember bulan depan bisa ditebak dari
     * bulan ini. Kalau meleset, ada pinjaman yang embernya melompat atau
     * `drop_date`-nya diubah belakangan.
     */
    public const GESER_EMBER = [
        'month1' => 'month2',
        'month2' => 'ccm',
        'ccm' => 'cm',
        'cm' => 'mb',
        'mb' => 'ml',
        'ml' => 'ml',
    ];

    protected $fillable = [
        'transaction_loan_officer_grouping_id', 'hari', 'periode',
        'awal_month1', 'awal_month2', 'awal_ccm', 'awal_cm', 'awal_mb', 'awal_ml',
        'awal_ml_belum_terinput',
        'drop', 'storting',
        'storting_month1', 'storting_month2', 'storting_ccm',
        'storting_cm', 'storting_mb', 'storting_ml',
        'pemutihan', 'saldo_masuk', 'mutasi_masuk', 'mutasi_keluar',
        'akhir_month1', 'akhir_month2', 'akhir_ccm', 'akhir_cm', 'akhir_mb', 'akhir_ml',
        'hari_kerja', 'hari_terkunci',
        'kepala_approval_at', 'kepala_approval_user',
        'kasir_lock_at', 'kasir_lock_user',
    ];

    protected $casts = [
        'periode' => 'date',
        'kepala_approval_at' => 'datetime',
        'kasir_lock_at' => 'datetime',
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

    /**
     * Sirkulasi akhir menurut arus — EMPAT pintu masuk, bukan satu.
     *
     * Rumus yang berjalan sekarang (RekapTrait.php:204) cuma punya
     * `awal + drop*1,3 − storting`. Satu pintu masuk itulah sebabnya orang
     * terpaksa mengarang drop untuk memasukkan nasabah lama.
     *
     * ⚠️ Begitu keempat pintu hidup, `sirkulasi ≈ Σdrop × 1,3 − Σstorting`
     * BERHENTI berlaku sebagai pemeriksaan. Laporan kewajaran mana pun wajib
     * menyertakan keempatnya — kalau tidak, alarmnya berbunyi terus di kelompok
     * yang datanya justru paling rapi, dan orang belajar mengabaikannya.
     */
    public function akhirMenurutArus(): int
    {
        return (int) round(
            $this->awal_total
            + ($this->drop * 1.3)
            + $this->saldo_masuk
            + $this->mutasi_masuk
            - $this->mutasi_keluar
            - $this->storting
            - $this->pemutihan
        );
    }

    /**
     * Selisih antara saldo akhir hasil hitung portofolio dan hasil hitung arus.
     * Nol berarti kedua jalur sepakat. Bukan nol = ada yang perlu ditelusuri.
     */
    public function selisihArusVsPortofolio(): int
    {
        return (int) $this->akhir_total - $this->akhirMenurutArus();
    }

    /**
     * Semua hari kerja bulan ini sudah terkunci? Syarat tanda tangan bulanan.
     * Inilah yang membuat "lupa tutup buku" mustahil lolos — bukan karena ada
     * yang mengingatkan, tapi karena pengesahannya tidak bisa jalan.
     */
    public function lengkap(): bool
    {
        return $this->hari_kerja > 0 && $this->hari_terkunci >= $this->hari_kerja;
    }

    /** Pintu input ML tertutup permanen begitu sisa kuota habis. */
    public function kuotaMlHabis(): bool
    {
        return (int) $this->awal_ml_belum_terinput <= 0;
    }

    public function terkunci(): bool
    {
        return $this->kasir_lock_at !== null;
    }
}
