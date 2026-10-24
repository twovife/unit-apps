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
    "pay_off_date",
    "total_angsuran",
    "transaction_out_reasons_id"
  ];

  /** Sebab keluar target (transaction_out_reasons.id). */
  public const SEBAB_PELUNASAN = 1;  // dilunasi pinjaman pengganti (topup)
  public const SEBAB_LUNAS = 2;      // lunas tanpa topup
  public const SEBAB_PEMUTIHAN = 3;  // pemutihan (nasabah meninggal)
  public const SEBAB_BHT = 4;
  public const SEBAB_LUNAS_LAMA = 5; // cap data lama saat migrasi pay_off_date


  protected static function boot()
  {
    parent::boot();

    // Koreksi user can-edit di tanggal drop yang sudah dikunci -> tanggalnya
    // dibuka otomatis (Gembok::bukaOtomatis). Hanya kolom yang menggeser
    // angka - sama dengan trigger tl_kunci_before_update; tanggal lunas /
    // keluar target otomatis tidak membuka apa pun.
    static::creating(function (self $loan) {
      \App\Helpers\Gembok::bukaOtomatis($loan->transaction_loan_officer_grouping_id, $loan->drop_date, 'pinjaman baru');
    });
    static::updating(function (self $loan) {
      if (!$loan->isDirty(['status', 'nominal_drop', 'drop_date', 'transaction_loan_officer_grouping_id'])) {
        return;
      }
      $aksi = sprintf('ubah pinjaman #%d (%s)', $loan->id, implode(', ', array_keys(array_intersect_key(
        $loan->getDirty(), array_flip(['status', 'nominal_drop', 'drop_date', 'transaction_loan_officer_grouping_id'])))));
      \App\Helpers\Gembok::bukaOtomatis($loan->getOriginal('transaction_loan_officer_grouping_id'), $loan->getOriginal('drop_date'), $aksi);
      \App\Helpers\Gembok::bukaOtomatis($loan->transaction_loan_officer_grouping_id, $loan->drop_date, $aksi);
    });
    static::deleting(function (self $loan) {
      \App\Helpers\Gembok::bukaOtomatis($loan->transaction_loan_officer_grouping_id, $loan->drop_date, 'hapus pinjaman #' . $loan->id);
    });
    // Alur lama: tanggal yang barusan dibuka otomatis -> rekapnya disegarkan sesudah tertulis.
    $segarkan = function (self $loan) {
      \App\Helpers\Gembok::segarkanSesudahTulis($loan->getOriginal('transaction_loan_officer_grouping_id'), $loan->getOriginal('drop_date'));
      \App\Helpers\Gembok::segarkanSesudahTulis($loan->transaction_loan_officer_grouping_id, $loan->drop_date);
    };
    static::created($segarkan);
    static::updated($segarkan);
    static::deleted($segarkan);

    /**
     * SIKLUS rekening pada DROP baru (BUKAN topup — topup ditangani hook
     * `updating` di bawah -> 'pelunasan'). Prinsipnya: setiap input ulang
     * MERESET siklus, apa pun nilai sebelumnya (ist/bht/pelunasan/…).
     *   - drop pertama rekening & drop langsung (tgl pengajuan = tgl drop)
     *     -> 'nasabah_baru'
     *   - selain itu (input ulang / ada jeda) -> dikosongkan (reset)
     * Penanda lunak: menulis ke transaction_manage_customers, tak menyentuh loan.
     */
    static::updated(function (self $loan) {
      if (!$loan->wasChanged('status') || $loan->status !== 'success' || $loan->previous_loan_id) {
        return;
      }

      $adaSebelumnya = self::where('transaction_manage_customer_id', $loan->transaction_manage_customer_id)
        ->where('status', 'success')
        ->where('id', '!=', $loan->id)
        ->exists();

      $dropLangsung = !$loan->request_date
        || \Carbon\Carbon::parse($loan->request_date)->toDateString() === \Carbon\Carbon::parse($loan->drop_date)->toDateString();

      if (!$adaSebelumnya && $dropLangsung) {
        \App\Helpers\SiklusRekening::tandai($loan->transaction_manage_customer_id, \App\Helpers\SiklusRekening::NASABAH_BARU);
      } else {
        \App\Helpers\SiklusRekening::bersihkan($loan->transaction_manage_customer_id);
      }
    });

    // F1: status atau nominal drop berubah -> status lunas dihitung ulang.
    // Reset ke 'open' mengosongkan pay_off_date/out_date/sebab; edit nominal
    // menggeser `pinjaman` (generated ×1,3) sehingga lunas bisa berubah.
    static::updated(function (self $loan) {
      if ($loan->wasChanged('status') || $loan->wasChanged('nominal_drop')) {
        $loan->hitungUlangPelunasan();
      }

      // Step 3: status pengajuan pengganti (topup) berubah -> keluar target
      // pinjaman lamanya disinkronkan (ACC = keluar, tolak/reset = batal).
      if ($loan->previous_loan_id && $loan->wasChanged('status')) {
        \App\Helpers\KeluarTarget::sinkronTopup($loan->previous_loan_id);
      }
    });

    // Pengajuan pengganti dihapus -> keluar target pinjaman lama dihitung ulang.
    static::deleted(function (self $loan) {
      if ($loan->previous_loan_id) {
        \App\Helpers\KeluarTarget::sinkronTopup($loan->previous_loan_id);
      }
    });

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

        // Status lunas + keluar target pinjaman lama sudah diurus: angsuran
        // pelunasan barusan memicu hitungUlangPelunasan() (pay_off_date, sebab
        // PELUNASAN), dan KeluarTarget::sinkronTopup() di hook updated.

        // Rekening topup ditandai 'pelunasan' — nasabah melunasi lewat topup
        // (masih bersaldo lalu didrop lagi). Hanya sampai sini kalau saldo > 0,
        // jadi definisinya terpenuhi. Penanda lunak, tak menggagalkan transaksi.
        \App\Helpers\SiklusRekening::tandai(
          $transactionLoan->transaction_manage_customer_id,
          \App\Helpers\SiklusRekening::PELUNASAN
        );
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

      // Keluar target karena topup (sebab 1 PELUNASAN) ikut dibatalkan, beserta
      // tanggalnya. Sebab lain tidak disentuh.
      self::whereKey($previousLoanId)
        ->where('transaction_out_reasons_id', self::SEBAB_PELUNASAN)
        ->update(['transaction_out_reasons_id' => null, 'out_date' => null]);
    }

    // Topup dibatalkan (status success -> open lagi) -> siklus 'pelunasan' yang
    // sempat ditandai ikut dikosongkan. Reset, konsisten dgn pembatalan lain.
    \App\Helpers\SiklusRekening::bersihkan($transactionLoan->transaction_manage_customer_id);
  }

  /**
   * F1 — SATU-SATUNYA penulis status lunas pinjaman. Dihitung ulang penuh dari
   * sumber (PenyesuaianSaldo::hitungSaldo), bukan ditambah-kurangi: aman
   * dipanggil berkali-kali, dan cache yang meleset ikut terbetulkan.
   *
   *   total_angsuran : Σ angsuran saja (pemutihan tidak ikut)
   *   pay_off_date   : tanggal transaksi terakhir saat saldo <= 0, selain itu NULL
   *   out_date+sebab : keluar target karena tutup — PELUNASAN (dilunasi topup),
   *                    PEMUTIHAN, atau LUNAS. Keluar target yang sudah tercatat
   *                    tidak ditimpa. Batal tutup -> dikosongkan, kecuali sebab
   *                    yang tidak bergantung pada lunas (PELUNASAN, BHT).
   *   out_status     : tidak ditulis lagi.
   *
   * Pinjaman bukan 'success' (open/acc/tolak/gagal, termasuk hasil reset) tidak
   * bisa lunas maupun keluar target: pay_off_date, out_date, sebab dikosongkan.
   *
   * @return bool  true = lunas
   */
  /**
   * Syarat pengajuan pelunasan (topup) dari pinjaman ini pada $tanggal.
   * null = boleh, selain itu alasan penolakannya. Satu aturan untuk server
   * (store_pengajuan_lama) dan layar (get_loan_pinjaman).
   *
   *  - sudah di-drop (success) dan belum punya pengganti open/acc/success
   *  - ember pada $tanggal belum MB/ML (bukan status angsuran terakhir, yang
   *    basi kalau nasabah lama tidak bayar)
   *  - drop sudah lewat 5 minggu (tanggal pengajuan >= drop + 35 hari)
   *  - sisa saldo F8 <= 48% DROP (bukan pinjaman) - keputusan 2026-10-10;
   *    drop 500rb -> sisa saldo maks 240rb
   */
  /** Syarat pengajuan pelunasan: sisa saldo <= 48% drop, drop >= 5 minggu. */
  public const PELUNASAN_BATAS_DROP = 0.48;
  public const PELUNASAN_MINGGU = 5;

  public function alasanTolakPengajuan(string $tanggal): ?string
  {
    if ($this->status !== 'success') {
      return 'Pinjaman ini belum di-drop.';
    }
    if (\App\Helpers\AppHelper::sudahDiajukanPengganti($this)) {
      return 'Sudah ada pengajuan pelunasan yang masih berjalan.';
    }
    if (in_array(\App\Helpers\Ember::dari($this->drop_date, $tanggal), [\App\Helpers\Ember::MB, \App\Helpers\Ember::ML], true)) {
      return 'Pinjaman sudah MB/ML.';
    }
    $bolehMulai = \Carbon\Carbon::parse($this->drop_date)->addWeeks(self::PELUNASAN_MINGGU)->startOfDay();
    if (\Carbon\Carbon::parse($tanggal)->startOfDay()->lt($bolehMulai)) {
      return 'Drop belum lewat ' . self::PELUNASAN_MINGGU . ' minggu (baru bisa mulai '
        . $bolehMulai->locale('id')->isoFormat('D MMM Y') . ').';
    }
    $batas = (int) round((int) $this->nominal_drop * self::PELUNASAN_BATAS_DROP);
    if (\App\Helpers\PenyesuaianSaldo::hitungSaldo($this)['saldo'] > $batas) {
      return 'Sisa saldo masih di atas 48% drop (maksimal Rp ' . number_format($batas, 0, ',', '.') . ').';
    }
    return null;
  }

  public function hitungUlangPelunasan(): bool
  {
    $saldo = \App\Helpers\PenyesuaianSaldo::hitungSaldo($this);
    $lunas = $this->status === 'success' && $saldo['saldo'] <= 0;
    $isi = ['total_angsuran' => $saldo['angsuran']];

    if ($lunas) {
      $isi['pay_off_date'] = $this->tanggalTutup();
      if (!$this->out_date) {
        [$isi['transaction_out_reasons_id'], $isi['out_date']] = $this->sebabTutup($isi['pay_off_date']);
      }
    } else {
      $isi['pay_off_date'] = null;
      $tetapKeluar = $this->status === 'success'
        && in_array((int) $this->transaction_out_reasons_id, [self::SEBAB_PELUNASAN, self::SEBAB_BHT], true);
      if (!$tetapKeluar) {
        $isi['out_date'] = null;
        $isi['transaction_out_reasons_id'] = null;
      }
    }

    $this->forceFill($isi)->saveQuietly();

    return $lunas;
  }

  /** Tanggal transaksi terakhir yang menggerakkan saldo: angsuran, pemutihan, penyesuaian. */
  private function tanggalTutup(): ?string
  {
    $tanggal = array_filter([
      $this->loan_instalment()->where('nominal', '>', 0)->max('transaction_date'),
      TransactionWhiteOff::where('transaction_loan_id', $this->id)->max('transaction_date'),
      TransactionSaldoAdjustment::where('transaction_loan_id', $this->id)->berlaku()->max('berlaku_bulan'),
    ]);

    return $tanggal ? max($tanggal) : $this->drop_date;
  }

  /** [sebab, out_date] untuk pinjaman yang baru tutup tanpa keluar target sebelumnya. */
  private function sebabTutup(?string $payOffDate): array
  {
    $penggantiId = $this->loan_instalment()->whereNotNull('settled_by_loan_id')->value('settled_by_loan_id');
    if ($penggantiId) {
      // Aturan topup: keluar target per tanggal PENGAJUAN penggantinya.
      return [self::SEBAB_PELUNASAN, self::whereKey($penggantiId)->value('request_date') ?? $payOffDate];
    }

    if (TransactionWhiteOff::where('transaction_loan_id', $this->id)->exists()) {
      return [self::SEBAB_PEMUTIHAN, $payOffDate];
    }

    return [self::SEBAB_LUNAS, $payOffDate];
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
