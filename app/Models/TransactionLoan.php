<?php

namespace App\Models;

use App\Helpers\AppHelper;
use Exception;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Staudenmeir\EloquentHasManyDeep\HasRelationships;
use Znck\Eloquent\Traits\BelongsToThrough;

class TransactionLoan extends Model
{
  use HasFactory;
  use HasRelationships;
  use BelongsToThrough;

  protected $fillable = [
    "transaction_manage_customer_id",
    "transaction_loan_officer_grouping_id",
    "previous_loan_id",
    "postponed_loan_id",
    "old_id",
    "drop_before",
    "drop_date_before",
    "drop_date",
    "request_date",
    "request_nominal",
    "user_mantri",
    "approved_nominal",
    "check_date",
    "user_check",
    "nominal_drop",
    "user_drop",
    "pinjaman",
    "hari",
    "pinjaman_ke",
    "status",
    "notes",
    "user_input",
    "drop_langsung",
    "out_date",
    "out_status",
    "total_angsuran",
    "transaction_out_reasons_id"
  ];


  protected static function boot()
  {
    parent::boot();

    /**
     * DIHAPUS 2026-08-02 - sinkronisasi rekap otomatis.
     *
     * Dulu ada hook `updating` yang memantau perpindahan status ke/dari
     * 'success' lalu increment/decrement kolom `drop` di
     * `transaction_daily_recaps`, plus bagian decrement di hook `deleting`.
     * Keduanya dicabut karena alur rekap sedang dibangun ulang.
     *
     * KONSEKUENSI SELAMA MASA TRANSISI: kolom `drop` pada rekap harian TIDAK
     * lagi terkoreksi otomatis saat status pinjaman berubah atau pinjaman
     * dihapus. Nilainya hanya ikut berubah lewat perhitungan ulang di
     * `TransactionDailyRecapController@ceklist_kepala`, yang menjumlah ulang
     * dari sumbernya:
     *   drop     = SUM(nominal_drop) pinjaman status 'success' pada tanggal itu
     *   storting = SUM(nominal) angsuran pada tanggal itu
     * Jadi angka rekap baru benar setelah kepala melakukan ceklist.
     */
    static::deleting(function (self $transactionLoan) {

      DB::transaction(function () use ($transactionLoan) {

        $freshLoan = self::whereKey($transactionLoan->id)
          ->lockForUpdate()
          ->first();

        if (! $freshLoan) {
          return; // sudah dihapus oleh proses lain
        }

        // Kalau pinjaman ini sendiri pernah memicu auto-pelunasan pada
        // previous_loan_id-nya (BARU 2026-08-04), bongkar dulu sebelum
        // pinjaman ini benar-benar hilang - lihat reverseAutoSettlement().
        if ($freshLoan->previous_loan_id) {
          self::reverseAutoSettlement($freshLoan);
        }

        // Hapus semua cicilan terkait. Ini BUKAN bagian dari alur rekap -
        // tanpa ini baris `transaction_loan_instalments` jadi yatim.
        foreach ($freshLoan->loan_instalment as $instalment) {
          $instalment->delete();
        }
      });
    });

    /**
     * BARU 2026-08-03 - auto-lunas via "pengajuan pengganti".
     *
     * BUKAN bagian dari alur rekap yang dihapus di atas - ini siklus hidup
     * pinjaman murni (top-up/refinance): nasabah yang sisa saldonya sudah
     * kecil (lihat gerbang di Pengajuan.jsx) bisa mengajukan pinjaman baru
     * lewat `store_pengajuan_lama()`, yang menyimpan `previous_loan_id` =
     * id pinjaman lama yang mau dilunaskan.
     *
     * Begitu pinjaman BARU ini status-nya benar-benar berubah jadi
     * 'success' (di-drop, baik langsung saat submit maupun lewat ACC kepala
     * di `action_buku_transaksi`), pinjaman LAMA otomatis dibuatkan 1 baris
     * angsuran senilai sisa saldonya (tanggal = tanggal drop pinjaman baru)
     * - bukan cuma menandai kolom status, supaya riwayat angsurannya jelas.
     */
    static::updating(function (self $transactionLoan) {
      if (!$transactionLoan->isDirty('status') || !$transactionLoan->previous_loan_id) {
        return;
      }

      // Reset Pinjaman (updateEverything: resetdata) memutar status dari
      // 'success' balik ke 'open' lewat update() biasa - hook ini juga yang
      // menangkapnya, supaya efek pelunasan yang sudah terlanjur dibuat ikut
      // dibongkar. TIDAK ADA blokir permanen di sini (sengaja) - selama
      // transaksi belum dikunci sistem lock (menyusul), Reset/Hapus tetap
      // bebas dilakukan; yang penting efek sampingnya ikut konsisten.
      if ($transactionLoan->getOriginal('status') === 'success' && $transactionLoan->status !== 'success') {
        DB::transaction(function () use ($transactionLoan) {
          self::reverseAutoSettlement($transactionLoan);
        });
        return;
      }

      if ($transactionLoan->status !== 'success') {
        return;
      }

      DB::transaction(function () use ($transactionLoan) {
        $previousLoan = self::whereKey($transactionLoan->previous_loan_id)
          ->lockForUpdate()
          ->first();

        if (!$previousLoan) {
          return; // referensi pinjaman lama sudah tidak ada (dihapus dll)
        }

        $pemutihan = $previousLoan->white_off?->nominal ?? 0;
        $totalAngsuran = $previousLoan->loan_instalment()->sum('nominal');
        $saldo = $previousLoan->pinjaman - $pemutihan - $totalAngsuran;

        if ($saldo <= 0) {
          return; // sudah lunas duluan lewat jalur normal, tidak ada yang perlu dilunaskan
        }

        $previousLoan->loan_instalment()->create([
          'transaction_loan_officer_grouping_id' => $previousLoan->transaction_loan_officer_grouping_id,
          'settled_by_loan_id' => $transactionLoan->id,
          'transaction_date' => $transactionLoan->drop_date,
          'nominal' => $saldo,
          'status' => AppHelper::generateStatusAngsuran($previousLoan->drop_date, $transactionLoan->drop_date),
          'danatitipan' => 0,
          'user_mantri' => $previousLoan->user_mantri,
          'user_input' => $transactionLoan->user_input,
          'instalment_notes' => 'Pelunasan otomatis - digantikan pengajuan #' . $transactionLoan->id,
        ]);

        // total_angsuran/out_date/out_status pinjaman lama sudah dihitung
        // ulang oleh TransactionLoanInstalment::creating() di atas lewat
        // baris barusan. Tinggal tandai alasan keluarnya secara eksplisit -
        // dibaca checkpengajuan() & tempat lain yang cek transaction_out_reasons_id.
        self::whereKey($previousLoan->id)->update([
          'transaction_out_reasons_id' => 1, // LUNAS
        ]);
      });
    });
  }

  /**
   * Membongkar (reverse) efek auto-pelunasan yang pernah dipicu
   * `$transactionLoan` terhadap `previous_loan_id`-nya - simetris dengan
   * blok pembuatan di hook `updating` di atas. Dipanggil saat
   * `$transactionLoan` di-Reset (status berubah dari 'success') atau
   * dihapus, SELAMA masih bebas diubah (belum ada sistem lock - menyusul).
   *
   * Dicari lewat `settled_by_loan_id`, BUKAN menebak dari teks
   * `instalment_notes` - jadi presisi biar pun ada banyak baris angsuran
   * lain di pinjaman lama itu.
   */
  private static function reverseAutoSettlement(self $transactionLoan): void
  {
    $settledInstalments = TransactionLoanInstalment::where('settled_by_loan_id', $transactionLoan->id)->get();

    foreach ($settledInstalments as $instalment) {
      $previousLoanId = $instalment->transaction_loan_id;

      // Hapus baris ini - trigger TransactionLoanInstalment::deleting(),
      // yang SUDAH menghitung ulang total_angsuran/out_date/out_status
      // pinjaman lama secara otomatis (lihat model itu).
      $instalment->delete();

      // transaction_out_reasons_id cuma kita bersihkan kalau nilainya masih
      // 1 (LUNAS) - itu satu-satunya nilai yang KITA yang set di blok
      // pembuatan atas, jadi aman dibersihkan tanpa menimpa alasan keluar
      // lain yang mungkin di-set manual oleh user untuk urusan berbeda.
      self::whereKey($previousLoanId)
        ->where('transaction_out_reasons_id', 1)
        ->update(['transaction_out_reasons_id' => null]);
    }
  }

  public function loan_instalment()
  {
    return $this->hasMany(TransactionLoanInstalment::class, 'transaction_loan_id', 'id');
  }

  /**
   * Pinjaman lama yang digantikan (dilunaskan) oleh pinjaman ini, kalau
   * dibuat lewat alur "pengajuan pengganti" di `store_pengajuan_lama()`.
   */
  public function previousLoan()
  {
    return $this->belongsTo(self::class, 'previous_loan_id', 'id');
  }

  /**
   * Pinjaman yang ditunda (drop_date-nya dipindah) sehingga pinjaman ini
   * dibuat sebagai penggantinya - lihat `tundaan_pengajuan()`. Pinjaman lama
   * TIDAK dihapus, cuma statusnya jadi 'gagal'.
   */
  public function postponedFrom()
  {
    return $this->belongsTo(self::class, 'postponed_loan_id', 'id');
  }

  public function loanInstalmentOn(string|\DateTimeInterface $date)
  {
    return $this->hasMany(TransactionLoanInstalment::class, 'transaction_loan_id')
      ->whereDate('transaction_date', $date);
  }

  public function manage_customer()
  {
    return $this->belongsTo(TransactionManageCustomer::class, 'transaction_manage_customer_id', 'id');
  }

  public function branch()
  {
    return $this->belongsToThrough(Branch::class, TransactionLoanOfficerGrouping::class);
  }

  public function loan_officer_grouping()
  {
    return $this->belongsTo(TransactionLoanOfficerGrouping::class, 'transaction_loan_officer_grouping_id', 'id');
  }
  public function userinput()
  {
    return $this->belongsTo(Employee::class, 'user_input', 'id');
  }

  public function customer()
  {
    return $this->hasOneThrough(TransactionCustomer::class, TransactionManageCustomer::class, 'id', 'id', 'transaction_manage_customer_id', 'transaction_customer_id');
  }

  public function mantri()
  {
    return $this->belongsTo(Employee::class, 'user_mantri', 'id');
  }

  /**
   * Karyawan yang melakukan ACC / Tolak (mengisi kolom user_check).
   * Bisa null: pengajuan drop langsung tidak melewati tahap ACC.
   */
  public function pemeriksa()
  {
    return $this->belongsTo(Employee::class, 'user_check', 'id');
  }

  /**
   * Karyawan yang menutup pencairan (mengisi kolom user_drop).
   */
  public function pencair()
  {
    return $this->belongsTo(Employee::class, 'user_drop', 'id');
  }

  public function white_off()
  {
    return $this->hasOne(TransactionWhiteOff::class, 'transaction_loan_id', 'id');
  }

  /**
   * Penyesuaian saldo yang TIDAK menyentuh kas (.agents/agregasi_rekap.md §7).
   *
   * hasMany, bukan hasOne: satu pinjaman bisa punya saldo_awal sekali lalu
   * koreksi menyusul kemudian.
   *
   * Pemakaian saldo: pinjaman − angsuran − pemutihan + SUM(efek_saldo).
   * Pakai scope berlaku() supaya koreksi yang belum disetujui tidak ikut.
   */
  public function saldo_adjustments()
  {
    return $this->hasMany(TransactionSaldoAdjustment::class, 'transaction_loan_id', 'id');
  }

  /**
   * Baris saldo awal (kalau ada). Kehadirannya menandai pinjaman ini
   * nasabah lama yang dibawa masuk, sehingga WAJIB dikecualikan dari semua
   * penjumlahan drop, do11, dan titipan9 — di bulan mana pun, termasuk bulan
   * drop_date-nya sendiri.
   */
  public function saldo_awal()
  {
    return $this->hasOne(TransactionSaldoAdjustment::class, 'transaction_loan_id', 'id')
      ->where('jenis', TransactionSaldoAdjustment::JENIS_SALDO_AWAL);
  }
}
