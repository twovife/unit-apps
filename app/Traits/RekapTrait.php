<?php

namespace App\Traits;

use App\Helpers\AppHelper;
use App\Models\Branch;
use App\Models\TransactionDailyRecap;
use App\Models\TransactionLoan;
use App\Models\TransactionLoanInstalment;
use App\Models\TransactionLoanOfficerGrouping;
use App\Models\TransactionSirculation;
use Carbon\Carbon;
use Illuminate\Http\Request;

trait RekapTrait
{
  // $hanyaKelompok: Rekap Mantri cukup satu kelompok, bukan seluruh cabang.
  /**
   * Kantor lama: ACC KM otomatis saat TTD kasir ditandai dengan waktu ACC KM
   * = waktu TTD persis (TransactionDailyRecapController::ttdLama). Baris alur
   * baru (objek dari daily_closings, kolomnya boolean) tidak pernah cocok.
   */
  private static function accKmOtomatisLama($r): bool
  {
    if (!$r || !($r instanceof TransactionDailyRecap) || !$r->daily_kepala_approval || !$r->daily_kasir_approval) {
      return false;
    }

    return (string) $r->daily_kepala_approval === (string) $r->daily_kasir_approval;
  }

  public function getRencanaDropKepalaData(Request $request, $hanyaKelompok = null)
  {
    $scope = \App\Helpers\AuthScope::resolve();
    $branch_id = $scope->branch_id;
    $wilayah = $scope->wilayah;
    $kelompok = $scope->kelompok;
    $authorized = $scope->user;
    $userAuthorized = AppHelper::branch_permission($authorized, $branch_id);

    $transaction_date = $request->month ?? Carbon::now()->format('Y-m');
    $startOfMonth = Carbon::parse($transaction_date)->copy()->startOfMonth();
    $endOfMonth = Carbon::parse($transaction_date)->copy()->endOfMonth();
    $groupingId = TransactionLoanOfficerGrouping::where('branch_id', $branch_id)
      ->when($hanyaKelompok, fn($q) => $q->where('kelompok', $hanyaKelompok))->get();

    // Sama seperti getDataRekapDua: ikut kalender kerja, tapi tanggal yang
    // sudah punya drop tetap tampil walau libur - biar kelihatan, bukan hilang.
    $dropBulanIni = TransactionLoan::whereIn('transaction_loan_officer_grouping_id', $groupingId->pluck('id'))
      ->whereBetween('drop_date', [$startOfMonth->toDateString(), $endOfMonth->toDateString()])
      ->distinct()->pluck('drop_date')->map(fn($t) => Carbon::parse($t)->toDateString());
    $datesMatchDay = \App\Models\WorkDay::tanggalRekapBulan($startOfMonth, $dropBulanIni);

    // BERSANDINGAN (mas 2026-10-10): tiap tanggal D dipasangkan dengan hari
    // yang sama minggu depan (lompati libur) = tanggal drop pengajuan yang
    // diinput di D. Kiri = kegiatan D, kanan = rencana & drop di pasangannya.
    // Pasangan akhir bulan jatuh di bulan depan, jadi data diambil s/d +2 minggu.
    $pasangan = $datesMatchDay->mapWithKeys(fn($t) => [
      $t => \App\Models\WorkDay::hariSamaBerikutnya(Carbon::parse($t))?->toDateString(),
    ]);
    $semuaTanggal = $datesMatchDay->merge($pasangan->filter()->values())->unique()->values();
    $sampai = $semuaTanggal->max();

    // Dijumlah di SQL per (tanggal, kelompok) - dulu ribuan baris pinjaman &
    // angsuran ditarik lalu disaring koleksi per sel, itu yang membuat menu
    // ini ~1 detik lebih lambat. Kunci: "Y-m-d|grouping_id".
    $loan = TransactionLoan::whereIn('transaction_loan_officer_grouping_id', $groupingId->pluck('id'))
      ->whereBetween('drop_date', [$startOfMonth->toDateString(), $sampai])
      ->groupBy('transaction_loan_officer_grouping_id', 'drop_date')
      ->selectRaw("transaction_loan_officer_grouping_id AS g, drop_date AS d,
        SUM(CASE WHEN status = 'success' THEN nominal_drop ELSE 0 END) AS drop_,
        SUM(CASE WHEN status = 'success' AND drop_langsung = 1 THEN nominal_drop ELSE 0 END) AS baru,
        SUM(CASE WHEN status = 'success' AND drop_langsung = 0 THEN nominal_drop ELSE 0 END) AS lama,
        SUM(CASE WHEN drop_langsung = 0 AND status IN ('open', 'acc', 'success', 'gagal') THEN approved_nominal ELSE 0 END) AS rencana")
      ->toBase()->get()
      ->keyBy(fn($r) => Carbon::parse($r->d)->toDateString() . '|' . $r->g);

    $migrasi = \App\Helpers\AgregasiScope::pakaiAgregatBaru($branch_id, $startOfMonth);

    // GERBANG alur baru: kantor migrasi membaca kasbon/keluar/target dari
    // daily_closings. `masuk` belum ada di alur baru -> 0 sementara.
    // Diambil untuk tanggal D DAN pasangannya - kedua sisi kolomnya sama.
    if ($migrasi) {
      $daily_recap = \App\Models\TransactionDailyClosing::whereIn('transaction_loan_officer_grouping_id', $groupingId->pluck('id'))
        ->whereIn('date', $semuaTanggal)->get()
        ->map(fn($r) => (object) [
          'transaction_loan_officer_grouping_id' => $r->transaction_loan_officer_grouping_id,
          'date' => Carbon::parse($r->date)->toDateString(),
          'kasbon' => (int) $r->kasbon,
          'masuk' => 0,
          'keluar' => (int) $r->keluar,
          'target' => (int) $r->target,
          'cek_km' => $r->kepala_approval_at !== null,
        ])->groupBy('date');
    } else {
      $daily_recap = TransactionDailyRecap::whereIn('transaction_loan_officer_grouping_id', $groupingId->pluck('id'))
        ->whereIn('date', $semuaTanggal)->get()
        // Bukan each(fn => ...): arrow fn mengembalikan nilai assignment, dan
        // each() BERHENTI begitu callback mengembalikan false - baris pertama
        // yang belum di-ACC KM membuat semua baris sesudahnya tanpa cek_km.
        ->each(function ($r) {
          $r->cek_km = (bool) $r->daily_kepala_approval;
          $r->km_otomatis = self::accKmOtomatisLama($r);
        })
        ->groupBy(fn($r) => Carbon::parse($r->date)->toDateString());
    }

    $instalment = TransactionLoanInstalment::whereIn('transaction_loan_officer_grouping_id', $groupingId->pluck('id'))
      ->whereIn('transaction_date', $semuaTanggal)
      ->groupBy('transaction_loan_officer_grouping_id', 'transaction_date')
      ->selectRaw('transaction_loan_officer_grouping_id AS g, transaction_date AS d, SUM(nominal) AS n')
      ->toBase()->get()
      ->mapWithKeys(fn($r) => [Carbon::parse($r->d)->toDateString() . '|' . $r->g => (int) $r->n]);

    // Semua kolom satu kelompok di satu tanggal - dipakai untuk D & pasangannya.
    $isi = function (?string $tanggal, int $gid) use ($loan, $daily_recap, $instalment, $migrasi) {
      if (!$tanggal) {
        return array_fill_keys(['kasbon', 'target', 'masuk', 'keluar', 'storting', 'drop', 'baru', 'lama', 'rencana'], 0);
      }
      $rekap = $daily_recap->get($tanggal, collect())->where('transaction_loan_officer_grouping_id', $gid)->first();
      $l = $loan->get("$tanggal|$gid");
      $drop = (int) ($l->drop_ ?? 0);

      return [
        'kasbon' => (int) ($rekap->kasbon ?? 0),
        'target' => (int) ($rekap->target ?? 0),
        // Alur baru tidak menyimpan masuk: 13% drop, rumus yang sama dengan target.
        'masuk' => $migrasi ? \App\Helpers\TargetMingguan::masuk($drop) : (int) ($rekap->masuk ?? 0),
        'keluar' => (int) ($rekap->keluar ?? 0),
        'storting' => $instalment->get("$tanggal|$gid", 0),
        'drop' => $drop,
        'baru' => (int) ($l->baru ?? 0),
        'lama' => (int) ($l->lama ?? 0),
        // Rencana = yang sudah di-ACC (approved_nominal), termasuk yang akhirnya
        // gagal (mas 2026-10-13); hanya tolak yang bukan rencana.
        'rencana' => (int) ($l->rencana ?? 0),
      ];
    };

    $kmOtomatis = $migrasi
      ? \App\Helpers\CeklistKepala::daftarOtomatis($groupingId->pluck('id'), $startOfMonth, $endOfMonth)
      : [];

    $buku_rencana_drop = $datesMatchDay->map(function ($tanggal) use ($groupingId, $pasangan, $isi, $daily_recap, $kmOtomatis) {
      $p = $pasangan[$tanggal];

      return $groupingId->map(fn($g) => [
        'grouping_id' => $g->id,
        'kelompok' => $g->kelompok,
        'tanggal' => $tanggal,
        'pasangan' => $p,
        // Ceklist Kepala (ACC KM) hari D sudah? Target pasangan baru final sesudahnya.
        'cek_km' => (bool) ($daily_recap->get($tanggal, collect())->where('transaction_loan_officer_grouping_id', $g->id)->first()?->cek_km),
        'kepala_otomatis' => isset($kmOtomatis[$g->id . '|' . $tanggal])
          || (bool) ($daily_recap->get($tanggal, collect())->where('transaction_loan_officer_grouping_id', $g->id)->first()?->km_otomatis),
      ] + $isi($tanggal, $g->id) + collect($isi($p, $g->id))->mapWithKeys(fn($v, $k) => ["p_$k" => $v])->all());
    })->values();

    return [
      'datas' => $buku_rencana_drop,
      'server_filter' => [
        'month' => $transaction_date,
        'wilayah' => $wilayah,
        'branch' => $userAuthorized['branches'],
        'userAuthorized' => $userAuthorized,
        'branch_id' => $branch_id,
        // Dibaca Rencana/Approval di drawer ACC KM (alur baru vs lama).
        'migrasi' => $migrasi,
      ]
    ];
  }

  public function getRekapDuaData(Request $request)
  {
    $scope = \App\Helpers\AuthScope::resolve();
    $branch_id = $scope->branch_id;
    $wilayah = $scope->wilayah;
    $kelompok = $scope->kelompok;
    $authorized = $scope->user;
    $userAuthorized = AppHelper::branch_permission($authorized, $branch_id);

    $transaction_date = Carbon::parse($request->date ?? Carbon::now());
    $startDateofMonth = $transaction_date->copy()->startOfMonth()->format('Y-m-d');

    $dateOfMb = $transaction_date->copy()->subMonth(4);
    $dateOfCm = $transaction_date->copy()->subMonth(3);
    $transactionOffice = TransactionLoanOfficerGrouping::where('branch_id', $branch_id)->get();

    // GERBANG alur baru (lihat getDataRekapDua): kantor migrasi mengambil
    // kasbon/transport/tunai + status kunci dari daily_closings, dan saldo awal
    // dari monthly_closings. awal_* dipetakan ke nama kolom sirkulasi lama
    // (amount/cm_amount/…) supaya sum() di bawah tak perlu tahu bedanya.
    // Kantor belum-migrasi -> else, IDENTIK jalur lama.
    if (\App\Helpers\AgregasiScope::pakaiAgregatBaru($branch_id, $startDateofMonth)) {
      $transactionDailyRecap = \App\Models\TransactionDailyClosing::whereIn('transaction_loan_officer_grouping_id', $transactionOffice->pluck('id'))
        ->where('date', $transaction_date->format('Y-m-d'))->get()
        ->map(fn($r) => (object) [
          'transaction_loan_officer_grouping_id' => $r->transaction_loan_officer_grouping_id,
          'kasbon' => (int) $r->kasbon,
          'transport' => (int) $r->transport,
          'tunai' => (int) $r->tunai,
          'setoran_tunai' => $r->setoran_tunai, // SU Lapangan; null = belum dicatat
          'setoran_transfer' => $r->setoran_transfer,
          'setoran_katrol' => $r->setoran_katrol,
          'daily_kepala_approval' => $r->kepala_approval_at !== null,
          'daily_kasir_approval' => $r->kasir_lock_at !== null,
        ]);

      $transactionSirculation = \App\Models\TransactionMonthlyClosing::whereIn('transaction_loan_officer_grouping_id', $transactionOffice->pluck('id'))
        ->whereDate('periode', $startDateofMonth)->get()
        ->map(fn($r) => (object) [
          'transaction_loan_officer_grouping_id' => $r->transaction_loan_officer_grouping_id,
          'amount' => (int) $r->awal_total,
          'cm_amount' => (int) $r->awal_cm,
          'mb_amount' => (int) $r->awal_mb,
          'ml_amount' => (int) $r->awal_ml,
        ])->groupBy('transaction_loan_officer_grouping_id');
    } else {
      $transactionDailyRecap = TransactionDailyRecap::whereIn('transaction_loan_officer_grouping_id', $transactionOffice->pluck('id'))
        ->where('date', $transaction_date->format('Y-m-d'))->get();

      $transactionSirculation = TransactionSirculation::whereIn('transaction_loan_officer_grouping_id', $transactionOffice->pluck('id'))
        ->where('date', $startDateofMonth)
        ->get()->groupBy('transaction_loan_officer_grouping_id');
    }

    // dd($transactionSirculation);

    // Dijumlah di SQL per kelompok (dulu ribuan baris angsuran sebulan ditarik
    // sebagai model lalu disaring ~10x per kelompok). `h_*` = hari ini saja;
    // cara bayar mengikuti HitungAgregat::caraBayar (transfer > katrol > tunai).
    $instalment = TransactionLoanInstalment::whereIn('transaction_loan_officer_grouping_id', $transactionOffice->pluck('id'))
      ->whereBetween('transaction_date', [$startDateofMonth, $transaction_date->format('Y-m-d')])
      ->groupBy('transaction_loan_officer_grouping_id')
      ->selectRaw("transaction_loan_officer_grouping_id AS g, SUM(nominal) AS total,
        SUM(CASE WHEN status = 2 THEN nominal ELSE 0 END) AS cm,
        SUM(CASE WHEN status = 3 THEN nominal ELSE 0 END) AS mb,
        SUM(CASE WHEN status = 4 THEN nominal ELSE 0 END) AS ml,
        SUM(CASE WHEN transaction_date = ? THEN nominal ELSE 0 END) AS h_total,
        SUM(CASE WHEN transaction_date = ? AND status = 2 THEN nominal ELSE 0 END) AS h_cm,
        SUM(CASE WHEN transaction_date = ? AND status = 3 THEN nominal ELSE 0 END) AS h_mb,
        SUM(CASE WHEN transaction_date = ? AND status = 4 THEN nominal ELSE 0 END) AS h_ml,
        SUM(CASE WHEN transaction_date = ? AND COALESCE(is_transfer, 0) THEN nominal ELSE 0 END) AS h_transfer,
        SUM(CASE WHEN transaction_date = ? AND NOT COALESCE(is_transfer, 0) AND COALESCE(danatitipan, 0) THEN nominal ELSE 0 END) AS h_katrol,
        SUM(CASE WHEN transaction_date = ? AND NOT COALESCE(is_transfer, 0) AND NOT COALESCE(danatitipan, 0) THEN nominal ELSE 0 END) AS h_tunai",
        array_fill(0, 7, $transaction_date->format('Y-m-d')))
      ->toBase()->get()->keyBy('g');

    // Hanya yang sukses cair - sama dengan HitungAgregat::drop. success->gagal
    // tidak mengosongkan nominal_drop, jadi tanpa ini drop yang batal ikut terhitung.
    // Per kelompok per tanggal (do11/titipan9 global dibulatkan per tanggal).
    $loan = TransactionLoan::whereIn('transaction_loan_officer_grouping_id', $transactionOffice->pluck('id'))
      ->where('status', 'success')
      ->whereBetween('drop_date', [$startDateofMonth, $transaction_date->format('Y-m-d')])
      ->groupBy('transaction_loan_officer_grouping_id', 'drop_date')
      ->selectRaw('transaction_loan_officer_grouping_id AS g, drop_date AS d, SUM(nominal_drop) AS n')
      ->toBase()->get()
      ->map(fn($r) => (object) ['g' => $r->g, 'd' => Carbon::parse($r->d)->toDateString(), 'n' => (int) $r->n])
      ->groupBy('g');


    // dd($loan);

    $alurBaru = \App\Helpers\AgregasiScope::pakaiAgregatBaru($branch_id, $transaction_date);

    // GLOBAL Rekap 1 = awal bulan s/d tanggal filter. Isian manual harian
    // sebulan itu (kasbon, transport, setoran) per kelompok per tanggal.
    $harianBulan = ($alurBaru
      ? \App\Models\TransactionDailyClosing::query()
      : TransactionDailyRecap::query())
      ->whereIn('transaction_loan_officer_grouping_id', $transactionOffice->pluck('id'))
      ->whereBetween('date', [$startDateofMonth, $transaction_date->format('Y-m-d')])
      ->get()
      ->groupBy('transaction_loan_officer_grouping_id');

    // ACC KM otomatis saat kunci kasir (belum dicek KM) -> ditandai kuning.
    $kmOtomatis = $alurBaru
      ? \App\Helpers\CeklistKepala::daftarOtomatis($transactionOffice->pluck('id'), $transaction_date, $transaction_date)
      : [];

    $data =  $transactionOffice->map(function ($item) use ($loan, $instalment, $transactionSirculation, $transactionDailyRecap, $transaction_date, $startDateofMonth, $dateOfCm, $dateOfMb, $alurBaru, $harianBulan, $kmOtomatis) {
      $transaction_date = $transaction_date->format('Y-m-d');
      // dd($transaction_date);
      $thisLoan = $loan->get($item->id, collect());
      $i = $instalment->get($item->id);
      $thisSirculation = $transactionSirculation->get($item->id, collect());
      $thisDailyRecap = $transactionDailyRecap->where('transaction_loan_officer_grouping_id', $item->id)->first();
      $status_kepala = $thisDailyRecap?->daily_kepala_approval ? true : false;
      $status_kasir = $thisDailyRecap?->daily_kasir_approval ? true : false;

      $totalDrop = $thisLoan->sum('n');

      $totalStorting = (int) ($i->total ?? 0);

      $angusuranExistingCm = (int) ($i->h_cm ?? 0);
      $totalStortingCm = (int) ($i->cm ?? 0);

      $angusuranExistingMb = (int) ($i->h_mb ?? 0);
      $totalStortingMb = (int) ($i->mb ?? 0);

      $angusuranExistingMl = (int) ($i->h_ml ?? 0);
      $totalStortingMl = (int) ($i->ml ?? 0);

      $sirkulasi = $thisSirculation->sum('amount') ?? 0;
      $sirkulasiCm = $thisSirculation->sum('cm_amount') ?? 0;
      $sirkulasiMb = $thisSirculation->sum('mb_amount') ?? 0;
      $sirkulasiMl = $thisSirculation->sum('ml_amount') ?? 0;

      $storting = (int) ($i->h_total ?? 0);
      // Storting hari ini per cara bayar: transfer (is_transfer), katrol
      // (danatitipan), sisanya cash.
      $stortingTransfer = (int) ($i->h_transfer ?? 0);
      $stortingKatrol = (int) ($i->h_katrol ?? 0);
      $stortingCash = (int) ($i->h_tunai ?? 0);
      $nominaldrop = $thisLoan->where('d', $transaction_date)->sum('n');
      $do11 = (int) round($nominaldrop * 0.11);
      $titipan9 = (int) round($nominaldrop * 0.09);
      $kasbon = $thisDailyRecap?->kasbon ?? 0;
      $debit = $do11 + $kasbon + $storting;

      $transport = $thisDailyRecap?->transport ?? 0;
      $kredit = $nominaldrop + $transport;

      // --- GLOBAL (awal bulan s/d tanggal filter), rumus sama dengan harian.
      $hb = $harianBulan->get($item->id, collect())->keyBy(fn($r) => Carbon::parse($r->date)->toDateString());
      $gDrop = (int) $totalDrop;
      $gStorting = $totalStorting;
      $gKasbon = (int) $hb->sum('kasbon');
      $gTransport = (int) $hb->sum('transport');
      $gDo11 = (int) $thisLoan->sum(fn($l) => round($l->n * 0.11));
      $gTitipan9 = (int) $thisLoan->sum(fn($l) => round($l->n * 0.09));
      $gDebit = $gDo11 + $gKasbon + $gStorting;
      $gKredit = $gDrop + $gTransport;
      // Setoran global = hanya yang benar-benar diisi kasir (mas 2026-10-10);
      // angka bawaan tidak ikut. Belum ada isian sama sekali -> kosong.
      $gSetoran = ['setoran_tunai' => 0, 'setoran_transfer' => 0, 'setoran_katrol' => 0];
      $adaSetoran = false;
      if ($alurBaru) {
        foreach ($hb as $baris) {
          foreach ($gSetoran as $kol => $v) {
            if ($baris->$kol !== null) {
              $gSetoran[$kol] += (int) $baris->$kol;
              $adaSetoran = true;
            }
          }
        }
      }
      $global = [
        'kasbon' => $gKasbon,
        'storting' => $gStorting,
        'do11' => $gDo11,
        'debit' => $gDebit,
        'drop' => $gDrop,
        'transport' => $gTransport,
        'kredit' => $gKredit,
        'tunai' => $gDebit - $gKredit,
        'titipan9' => $gTitipan9,
        'sisa_uang' => $gTitipan9 + ($gDebit - $gKredit),
        'su_lapangan' => $adaSetoran ? $gSetoran['setoran_tunai'] : null,
        'setoran_transfer' => $adaSetoran ? $gSetoran['setoran_transfer'] : null,
        'setoran_katrol' => $adaSetoran ? $gSetoran['setoran_katrol'] : null,
        // -/+ global: setoran kosong = 0, jadi = jumlah -/+ detail per hari.
        'selisih_uang' => $alurBaru
          ? array_sum($gSetoran) - ($gTitipan9 + ($gDebit - $gKredit))
          : null,
      ];

      return [
        'type' => 'daily',
        'global' => $global,
        'kelompok' => $item->kelompok,
        'id' => $item->id,
        'tanggal' => $transaction_date,
        'rekap_status' => $thisDailyRecap ? true : false,
        'status_approve_kepala' => $status_kepala,
        'status_approve_kasir' => $status_kasir,
        // Kantor lama: ACC KM otomatis saat TTD kasir = waktu ACC KM sama persis dengan TTD.
        'kepala_otomatis' => $alurBaru
          ? isset($kmOtomatis[$item->id . '|' . $transaction_date])
          : self::accKmOtomatisLama($thisDailyRecap),
        'status_dayly_approval' => $status_kepala && $status_kasir,
        'transaction_date' => $transaction_date,

        'kasbon' => $kasbon, //stored db
        'drop' => $nominaldrop,
        'total_drop' => $totalDrop,
        'do11' => $do11,
        'titipan9' => $titipan9,

        'debit' => $debit,
        'transport' => $transport, //stored db
        'kredit' => $kredit,
        'tunai' => $debit - $kredit,
        'tunai_ondb' => $thisDailyRecap?->tunai ?? 0, //stored db
        'is_balance' => ($debit - $kredit) == $thisDailyRecap?->tunai,


        'storting' => $storting,
        'storting_cash' => $stortingCash,
        'storting_transfer' => $stortingTransfer,
        'storting_katrol' => $stortingKatrol,
        // SU Lapangan: uang yang dibawa pulang mantri (setoran_tunai, alur
        // baru). Kantor lama tidak mencatatnya -> null.
        'su_lapangan' => $thisDailyRecap?->setoran_tunai ?? null,
        'setoran_transfer' => $thisDailyRecap?->setoran_transfer ?? null,
        'setoran_katrol' => $thisDailyRecap?->setoran_katrol ?? null,
        // Sisa Uang = titipan 9% + tunai (debit - kredit).
        'sisa_uang' => $titipan9 + ($debit - $kredit),
        // -/+ = (setoran tunai + transfer + katrol) - (tunai + titipan 9%).
        // Setoran yang belum diisi kasir memakai angka bawaan dari angsuran
        // (cash / transfer / katrol) - sama dengan yang ditulis saat kunci.
        // Kantor lama (tanpa setoran) -> null.
        'selisih_uang' => $alurBaru
          ? ($thisDailyRecap?->setoran_tunai ?? $stortingCash)
            + ($thisDailyRecap?->setoran_transfer ?? $stortingTransfer)
            + ($thisDailyRecap?->setoran_katrol ?? $stortingKatrol)
            - (($debit - $kredit) + $titipan9)
          : null,
        'total_storting' => $totalStorting,
        'sirkulasi' => (int) round($sirkulasi + ($totalDrop * 1.3) - ($totalStorting)),

        'angsuran_cm' => $angusuranExistingCm,
        'total_angsuran_cm' => $totalStortingCm,
        'saldo_cm' => $sirkulasiCm - $totalStortingCm,

        'angsuran_mb' => $angusuranExistingMb,
        'total_angsuran_mb' => $totalStortingMb,
        'saldo_mb' => $sirkulasiMb - $totalStortingMb,

        'angsuran_ml' => $angusuranExistingMl,
        'total_angsuran_ml' => $totalStortingMl,
        'saldo_ml' => $sirkulasiMl - $totalStortingMl,
      ];
    })->values();


    return  [
      'datas' => $data,
      'server_filter' => [
        'date' => $transaction_date->format('Y-m-d'),
        'tanggal' => $transaction_date->format('Y-m-d'), // dibaca FilterBar (mode tanggal)
        'wilayah' => $wilayah,
        'branch' => $userAuthorized['branches'],
        'userAuthorized' => $userAuthorized,
        'branch_id' => $branch_id,
        // Kantor alur baru: SU Lapangan bisa diisi kasir di Rekap 1.
        'migrasi' => $alurBaru,
        // Kunci / TTD hari ini baru boleh mulai jam ini (WIB); dibaca tombol Kunci.
        'jam_kunci' => config('agregasi.jam_kunci'),
        // Hari dibuka ulang yang belum dikunci lagi (menahan rantai kunci).
        'hari_terbuka' => $alurBaru ? \App\Helpers\Gembok::hariTerbuka($branch_id) : [],
      ]
    ];
  }

  // public function getDataRekapDua(Request $request)
  // {
  //   $authorized = auth()->user();
  //   $branch_id = $authorized->can('can show branch') ? ($request->branch_id ?? 1) : $authorized->employee->branch_id;
  //   $wilayah = $authorized->can('can show branch') ? (Branch::find($branch_id)->wilayah ?? 1) : $authorized->employee->branch->wilayah;
  //   $kelompok = $authorized->can('can show kelompok') ? ($request->kelompok ?? 1) : $authorized->employee->area;
  //   $userAuthorized = AppHelper::branch_permission($authorized, $branch_id);

  //   $transaction_date = Carbon::parse($request->date ?? Carbon::now());

  //   $startDateofMonth = $transaction_date->copy()->startOfMonth()->format('Y-m-d');
  //   $startDateofMonthNoFormat = $transaction_date->copy()->startOfMonth();
  //   $endDateofMonth = $transaction_date->copy()->endOfMonth()->format('Y-m-d');
  //   $endDateofMonthNoFormat = $transaction_date->copy()->endOfMonth();

  //   $dateOfMb = $transaction_date->copy()->subMonth(4);
  //   $dateOfCm = $transaction_date->copy()->subMonth(3);
  //   $transactionOffice = TransactionLoanOfficerGrouping::where('branch_id', $branch_id)->get();

  //   $transactionDailyRecap = TransactionDailyRecap::whereIn('transaction_loan_officer_grouping_id', $transactionOffice->pluck('id'))
  //     ->whereBetween('date', [$startDateofMonth, $endDateofMonth])->get();

  //   $transactionSirculation = TransactionSirculation::with('transaction_loan_officer_grouping')
  //     ->whereIn('transaction_loan_officer_grouping_id', $transactionOffice->pluck('id'))
  //     ->whereBetween('date', [$startDateofMonth, $endDateofMonth])
  //     ->get()->groupBy('transaction_loan_officer_grouping_id');

  //   $saldoAwalBulan = $transactionSirculation->map(function ($item) use ($startDateofMonth) {
  //     $sirkulasi = $item->sum('amount') ?? 0;
  //     $sirkulasiCm = $item->sum('cm_amount') ?? 0;
  //     $sirkulasiMb = $item->sum('mb_amount') ?? 0;
  //     $sirkulasiMl = $item->sum('ml_amount') ?? 0;
  //     return [
  //       'kelompok' => $item->first()->transaction_loan_officer_grouping->kelompok,
  //       'sirkulasi' => $sirkulasi,
  //       'sirkulasiCm' => $sirkulasiCm,
  //       'sirkulasiMb' => $sirkulasiMb,
  //       'sirkulasiMl' => $sirkulasiMl,
  //     ];
  //   })->sortBy('kelompok')->values();

  //   $datesOfMonth = [];
  //   while ($startDateofMonthNoFormat->lte($endDateofMonthNoFormat)) {
  //     if ($startDateofMonthNoFormat->dayOfWeek !== Carbon::SUNDAY) {
  //       $datesOfMonth[] = $startDateofMonthNoFormat->format('Y-m-d');
  //     }
  //     $startDateofMonthNoFormat->addDay(); // Tambah 1 hari
  //   }

  //   $instalment = TransactionLoanInstalment::select('transaction_loan_officer_grouping_id', 'transaction_date', 'status', 'nominal')
  //     ->whereIn('transaction_loan_officer_grouping_id', $transactionOffice->pluck('id'))
  //     ->whereBetween('transaction_date', [$startDateofMonth, $endDateofMonth])
  //     ->get()->groupBy('transaction_loan_officer_grouping_id');

  //   $loan = TransactionLoan::select('transaction_loan_officer_grouping_id', 'drop_date', 'nominal_drop', 'pinjaman')
  //     ->whereIn('transaction_loan_officer_grouping_id', $transactionOffice->pluck('id'))
  //     ->whereBetween('drop_date', [$startDateofMonth, $endDateofMonth])
  //     ->get()->groupBy('transaction_loan_officer_grouping_id');

  //   $data = collect($datesOfMonth)->map(function ($date) use ($transactionOffice, $loan, $instalment, $transactionSirculation, $transactionDailyRecap, $startDateofMonth, $dateOfCm, $dateOfMb) {
  //     return [
  //       'tanggal' => $date,
  //       'data' =>  $transactionOffice->map(function ($item) use ($date, $loan, $instalment, $transactionSirculation, $transactionDailyRecap, $startDateofMonth, $dateOfCm, $dateOfMb) {
  //         $transaction_date = $date;
  //         // dd($transaction_date);
  //         $thisLoan = $loan->get($item->id, collect());
  //         $thisInstalment = $instalment->get($item->id, collect());
  //         $thisSirculation = $transactionSirculation->get($item->id, collect());
  //         $thisDailyRecap = $transactionDailyRecap->where('transaction_loan_officer_grouping_id', $item->id)->where('date', $transaction_date)->first();

  //         $status_kepala = $thisDailyRecap?->daily_kepala_approval ? true : false;
  //         $status_kasir = $thisDailyRecap?->daily_kasir_approval ? true : false;

  //         $totalDrop = $thisLoan->whereBetween('drop_date', [$startDateofMonth, $transaction_date])->sum('nominal_drop') ?? 0;

  //         $totalStorting = $thisInstalment->whereBetween('transaction_date', [$startDateofMonth, $transaction_date])->sum('nominal') ?? 0;

  //         $angusuranExistingCm = $thisInstalment->where('transaction_date', $transaction_date)->where('status', 2)->sum('nominal') ?? 0;
  //         $totalStortingCm =  $thisInstalment->whereBetween('transaction_date', [$startDateofMonth, $transaction_date])->where('status', 2)->sum('nominal') ?? 0;

  //         $angusuranExistingMb = $thisInstalment->where('transaction_date', $transaction_date)->where('status', 3)->sum('nominal') ?? 0;
  //         $totalStortingMb =  $thisInstalment->whereBetween('transaction_date', [$startDateofMonth, $transaction_date])->where('status', 3)->sum('nominal') ?? 0;

  //         $angusuranExistingMl = $thisInstalment->where('transaction_date', $transaction_date)->where('status', 4)->sum('nominal') ?? 0;
  //         $totalStortingMl =  $thisInstalment->whereBetween('transaction_date', [$startDateofMonth, $transaction_date])->where('status', 4)->sum('nominal') ?? 0;

  //         $sirkulasi = $thisSirculation->sum('amount') ?? 0;
  //         $sirkulasiCm = $thisSirculation->sum('cm_amount') ?? 0;
  //         $sirkulasiMb = $thisSirculation->sum('mb_amount') ?? 0;
  //         $sirkulasiMl = $thisSirculation->sum('ml_amount') ?? 0;

  //         $storting = $thisInstalment->where('transaction_date', $transaction_date)->sum('nominal') ?? 0;
  //         $do11 = (int) round($thisLoan->where('drop_date', $transaction_date)->sum('nominal_drop') * 0.11) ?? 0;
  //         $titipan9 = (int) round($thisLoan->where('drop_date', $transaction_date)->sum('nominal_drop') * 0.09) ?? 0;
  //         $kasbon = $thisDailyRecap?->kasbon ?? 0;
  //         $debit = $do11 + $kasbon + $storting;

  //         $transport = $thisDailyRecap?->transport ?? 0;
  //         $nominaldrop =  $thisLoan->where('drop_date', $transaction_date)->sum('nominal_drop');
  //         $kredit = $nominaldrop + $transport;

  //         return [
  //           'type' => 'daily',
  //           'kelompok' => $item->kelompok,
  //           'id' => $item->id,
  //           'tanggal' => $transaction_date,
  //           'rekap_status' => $thisDailyRecap ? true : false,
  //           'status_approve_kepala' => $status_kepala,
  //           'status_approve_kasir' => $status_kasir,
  //           'status_dayly_approval' => $status_kepala && $status_kasir,
  //           'transaction_date' => $transaction_date,

  //           'kasbon' => $kasbon, //stored db
  //           'drop' => $nominaldrop,
  //           'total_drop' => $totalDrop,
  //           'do11' => $do11,
  //           'titipan9' => $titipan9,

  //           'debit' => $debit,
  //           'transport' => $transport, //stored db
  //           'kredit' => $kredit,
  //           'tunai' => $debit - $kredit,
  //           'tunai_ondb' => $thisDailyRecap?->tunai ?? 0, //stored db
  //           'is_balance' => ($debit - $kredit) == $thisDailyRecap?->tunai,


  //           'storting' => $storting,
  //           'total_storting' => $totalStorting,
  //           'sirkulasi' => (int) round($sirkulasi + ($totalDrop * 1.3) - ($totalStorting)),

  //           'angsuran_cm' => $angusuranExistingCm,
  //           'total_angsuran_cm' => $totalStortingCm,
  //           'saldo_cm' => $sirkulasiCm - $totalStortingCm,

  //           'angsuran_mb' => $angusuranExistingMb,
  //           'total_angsuran_mb' => $totalStortingMb,
  //           'saldo_mb' => $sirkulasiMb - $totalStortingMb,

  //           'angsuran_ml' => $angusuranExistingMl,
  //           'total_angsuran_ml' => $totalStortingMl,
  //           'saldo_ml' => $sirkulasiMl - $totalStortingMl,
  //         ];
  //       })->values()
  //     ];
  //   })->values();


  //   return  [
  //     'datas' => $data,
  //     'saldoAwalBulan' => $saldoAwalBulan,
  //     'server_filter' => [
  //       'date' => $transaction_date->format('Y-m-d'),
  //       'wilayah' => $wilayah,
  //       'branch' => $userAuthorized['branches'],
  //       'userAuthorized' => $userAuthorized,
  //       'branch_id' => $branch_id
  //     ]
  //   ];

  //   // dd($data);
  // }

  public function getDataRekapDua(Request $request)
  {
    $scope = \App\Helpers\AuthScope::resolve();
    $branch_id = $scope->branch_id;
    $wilayah = $scope->wilayah;
    $kelompok = $scope->kelompok;
    $authorized = $scope->user;
    $userAuthorized = AppHelper::branch_permission($authorized, $branch_id);

    // Rekap 2 difilter per bulan (?month=Y-m, ikut filter global).
    $transaction_date = preg_match('/^\d{4}-\d{2}$/', (string) $request->month)
      ? Carbon::parse($request->month . '-01')
      : Carbon::now()->startOfMonth();

    $startDateofMonth = $transaction_date->copy()->startOfMonth()->format('Y-m-d');
    $endDateofMonth = $transaction_date->copy()->endOfMonth()->format('Y-m-d');

    $transactionOffice = TransactionLoanOfficerGrouping::where('branch_id', $branch_id)->get();
    $groupingIds = $transactionOffice->pluck('id');

    // GERBANG: kantor migrasi mengambil kasbon/transport dari daily_closings
    // (alur baru), bukan daily_recaps lama. Dibungkus stdClass berdate-string
    // supaya `->where('date',$date)` di bawah cocok sama seperti recap lama
    // (recap.date string mentah; closing.date di-cast Carbon).
    $closingBulan = collect();
    if (\App\Helpers\AgregasiScope::pakaiAgregatBaru($branch_id, $startDateofMonth)) {
      $closingBulan = \App\Models\TransactionDailyClosing::whereIn('transaction_loan_officer_grouping_id', $groupingIds)
        ->whereBetween('date', [$startDateofMonth, $endDateofMonth])
        ->get();
      $transactionDailyRecap = $closingBulan
        ->map(fn($r) => (object) [
          'transaction_loan_officer_grouping_id' => $r->transaction_loan_officer_grouping_id,
          'date' => Carbon::parse($r->date)->toDateString(),
          'kasbon' => (int) $r->kasbon,
          'transport' => (int) $r->transport,
          'tunai' => (int) $r->tunai,
          // Alur baru: persetujuan kepala & kunci kasir menggantikan dua
          // checkbox harian lama. Dipetakan ke nama field lama supaya kode
          // hilir (status_approve_*) tak perlu tahu bedanya.
          'daily_kepala_approval' => $r->kepala_approval_at !== null,
          'daily_kasir_approval' => $r->kasir_lock_at !== null,
        ]);
    } else {
      $transactionDailyRecap = TransactionDailyRecap::whereIn('transaction_loan_officer_grouping_id', $groupingIds)
        ->whereBetween('date', [$startDateofMonth, $endDateofMonth])
        ->get();
    }

    // GERBANG alur baru: base grid harian (sirkulasi + saldo cm/mb/ml per hari)
    // ikut saldo awal baru. Untuk kantor migrasi diambil dari monthly_closings
    // awal_*, dipetakan ke nama kolom sirkulasi lama supaya sum() di grid tak
    // berubah — sejajar dgn Rekap 1 & Rekap per-Mantri. Belum-migrasi -> lama.
    if (\App\Helpers\AgregasiScope::pakaiAgregatBaru($branch_id, $startDateofMonth)) {
      $transactionSirculation = \App\Models\TransactionMonthlyClosing::whereIn('transaction_loan_officer_grouping_id', $groupingIds)
        ->whereDate('periode', $startDateofMonth)->get()
        ->map(fn($r) => (object) [
          'transaction_loan_officer_grouping_id' => $r->transaction_loan_officer_grouping_id,
          'amount' => (int) $r->awal_total,
          'cm_amount' => (int) $r->awal_cm,
          'mb_amount' => (int) $r->awal_mb,
          'ml_amount' => (int) $r->awal_ml,
        ])->groupBy('transaction_loan_officer_grouping_id');
    } else {
      $transactionSirculation = TransactionSirculation::with('transaction_loan_officer_grouping')
        ->whereIn('transaction_loan_officer_grouping_id', $groupingIds)
        ->whereBetween('date', [$startDateofMonth, $endDateofMonth])
        ->get()
        ->groupBy('transaction_loan_officer_grouping_id');
    }

    // GERBANG alur baru: kantor yang sudah migrasi membaca saldo awal dari
    // transaction_monthly_closings (agregat baru), bukan transaction_sirculations
    // lama. Untuk kantor belum-migrasi, pakaiAgregatBaru() = false -> jalur lama
    // di bawah, IDENTIK dengan sebelumnya. Diverifikasi: kantor non-migrasi
    // byte-identik, Krian 2 Juli baca dari tabel baru.
    if (\App\Helpers\AgregasiScope::pakaiAgregatBaru($branch_id, $startDateofMonth)) {
      $saldoAwalBulan = \App\Models\TransactionMonthlyClosing::with('loan_officer_grouping')
        ->whereIn('transaction_loan_officer_grouping_id', $groupingIds)
        ->whereDate('periode', $startDateofMonth)
        ->get()
        ->groupBy('transaction_loan_officer_grouping_id')
        ->map(function ($item) {
          return [
            'kelompok' => $item->first()->loan_officer_grouping->kelompok ?? null,
            'sirkulasi' => (int) $item->sum('awal_total'),
            'sirkulasiCm' => (int) $item->sum('awal_cm'),
            'sirkulasiMb' => (int) $item->sum('awal_mb'),
            'sirkulasiMl' => (int) $item->sum('awal_ml'),
          ];
        })->sortBy('kelompok')->values();
    } else {
      $saldoAwalBulan = $transactionSirculation->map(function ($item) {
        return [
          'kelompok' => $item->first()->transaction_loan_officer_grouping->kelompok,
          'sirkulasi' => $item->sum('amount') ?? 0,
          'sirkulasiCm' => $item->sum('cm_amount') ?? 0,
          'sirkulasiMb' => $item->sum('mb_amount') ?? 0,
          'sirkulasiMl' => $item->sum('ml_amount') ?? 0,
        ];
      })->sortBy('kelompok')->values();
    }

    // Pemutihan bulan SEBELUMNYA per kelompok: sirkulasi bulan itu belum
    // dikurangi pemutihan (aturan mas 2026-10-05), baru keluar di saldo awal
    // bulan ini - jadi ditampilkan di samping sirkulasi awal, plus siapa saja.
    $kelompokPerGrup = $transactionOffice->pluck('kelompok', 'id');
    $bulanLalu = Carbon::parse($startDateofMonth)->subMonth();
    $pemutihan = \App\Models\TransactionWhiteOff::with('transaction_loan.customer')
      ->whereIn('transaction_loan_officer_grouping_id', $groupingIds)
      ->whereBetween('transaction_date', [$bulanLalu->toDateString(), $bulanLalu->copy()->endOfMonth()->toDateString()])
      ->orderBy('transaction_date')
      ->get()
      ->groupBy(fn($w) => $kelompokPerGrup[$w->transaction_loan_officer_grouping_id] ?? null);
    $saldoAwalBulan = $saldoAwalBulan->map(function ($r) use ($pemutihan) {
      $daftar = $pemutihan->get($r['kelompok'], collect());
      return $r + [
        'pemutihan' => (int) $daftar->sum('nominal'),
        'pemutihan_daftar' => $daftar->map(fn($w) => [
          'tanggal' => Carbon::parse($w->transaction_date)->toDateString(),
          'nama' => $w->transaction_loan?->customer?->nama,
          'hari' => $w->transaction_loan?->hari,
          'drop_date' => $w->transaction_loan?->drop_date ? Carbon::parse($w->transaction_loan->drop_date)->toDateString() : null,
          'pinjaman' => (int) ($w->transaction_loan?->pinjaman ?? 0),
          'nominal' => (int) $w->nominal,
        ])->values(),
      ];
    })->values();

    // GERBANG alur baru: drop & storting (per ember cm/mb/ml) dari
    // HitungAgregat - sumber yang sama dengan daily_closings: hanya pinjaman
    // sukses, nasabah saldo_awal tidak dihitung sebagai drop, ember ikut
    // drop_date (bukan status angsuran). Dibentuk sama dengan agregasi lama
    // supaya kode di bawah tidak berubah.
    if (\App\Helpers\AgregasiScope::pakaiAgregatBaru($branch_id, $startDateofMonth)) {
      // Hari yang SUDAH dikunci dibaca dari daily_closings (angka final; sumbernya
      // dibekukan trigger, jadi sama dengan hitungan langsung). Hitung langsung
      // dari sumber hanya mulai hari pertama yang belum aman di salah satu
      // kelompok: baris terbuka pertama, atau sehari sesudah kunci terakhir.
      // Kunci berurutan, jadi hari tanpa baris di bawah kunci terakhir = kosong.
      // ponytail: anggap data tanpa baris closing di hari yang sudah lewat kunci
      // tidak ada (dicek 2026-10-11: 0 kasus); kalau muncul, hitung langsung semua.
      $angka = [];
      $mulaiLive = $endDateofMonth;
      foreach ($groupingIds as $gid) {
        $baris = $closingBulan->where('transaction_loan_officer_grouping_id', $gid);
        $terkunci = $baris->whereNotNull('kasir_lock_at');
        $terbuka = $baris->whereNull('kasir_lock_at')->min(fn($r) => $r->date->toDateString());
        $batas = $terkunci->isEmpty()
          ? $startDateofMonth
          : $terkunci->max('date')->copy()->addDay()->toDateString();
        $mulaiLive = min($mulaiLive, $terbuka ?? $batas, $batas);
        foreach ($terkunci as $r) {
          $angka[$gid . '|' . $r->date->toDateString()] = $r->only(['drop', 'storting', 'storting_cm', 'storting_mb', 'storting_ml']);
        }
      }
      $angka = array_filter($angka, fn($k) => substr($k, strpos($k, '|') + 1) < $mulaiLive, ARRAY_FILTER_USE_KEY);
      if ($mulaiLive <= $endDateofMonth) {
        $angka += \App\Helpers\HitungAgregat::harianBanyak($groupingIds->all(), $mulaiLive, $endDateofMonth);
      }

      $drop = [];
      $angsur = [];
      foreach ($angka as $k => $v) {
        [$g, $t] = explode('|', $k);
        if ($v['drop']) {
          $drop[$g][$t] = collect([(object) ['drop_total' => $v['drop']]]);
        }
        if ($v['storting']) {
          $angsur[$g][$t] = collect([(object) [
            'total' => $v['storting'],
            'cm' => $v['storting_cm'],
            'mb' => $v['storting_mb'],
            'ml' => $v['storting_ml'],
          ]]);
        }
      }
      $loanAgg = collect($drop)->map(fn($perTanggal) => collect($perTanggal));
      $instalmentAgg = collect($angsur)->map(fn($perTanggal) => collect($perTanggal));
    } else {
      // ============================
      // AGREGASI INSTALMENT (SQL)
      // ============================

      $instalmentAgg = TransactionLoanInstalment::selectRaw("
          transaction_loan_officer_grouping_id,
          transaction_date,
          SUM(nominal) as total,
          SUM(CASE WHEN status = 2 THEN nominal ELSE 0 END) as cm,
          SUM(CASE WHEN status = 3 THEN nominal ELSE 0 END) as mb,
          SUM(CASE WHEN status = 4 THEN nominal ELSE 0 END) as ml
      ")
        ->whereIn('transaction_loan_officer_grouping_id', $groupingIds)
        ->whereBetween('transaction_date', [$startDateofMonth, $endDateofMonth])
        ->groupBy('transaction_loan_officer_grouping_id', 'transaction_date')
        ->get()
        ->groupBy(['transaction_loan_officer_grouping_id', 'transaction_date']);

      // ============================
      // AGREGASI LOAN (SQL)
      // ============================

      $loanAgg = TransactionLoan::selectRaw("
          transaction_loan_officer_grouping_id,
          drop_date,
          SUM(nominal_drop) as drop_total
      ")
        ->whereIn('transaction_loan_officer_grouping_id', $groupingIds)
        ->where('status', 'success')
        ->whereBetween('drop_date', [$startDateofMonth, $endDateofMonth])
        ->groupBy('transaction_loan_officer_grouping_id', 'drop_date')
        ->get()
        ->groupBy(['transaction_loan_officer_grouping_id', 'drop_date']);
    }

    // ============================
    // GENERATE DATES
    // ============================

    // Dulu dipatok "semua hari kecuali Minggu", sehingga 17 Agustus tetap
    // muncul sebagai kolom kosong padahal libur nasional. Sekarang mengikuti
    // kalender kerja — yang jatuh ke bawaan Senin-Sabtu untuk bulan yang belum
    // ditetapkan, jadi kantor yang kalendernya belum disetel tidak berubah
    // apa-apa.
    //
    // Tanggal yang PUNYA DATA tetap ditampilkan walau libur. Menyaringnya
    // begitu saja akan menyembunyikan transaksi yang telanjur tercatat di
    // sana, dan totalnya berhenti cocok tanpa ada yang tahu sebabnya.
    $tanggalBerdata = collect()
      ->merge($instalmentAgg->flatMap(fn($perTanggal) => $perTanggal->keys()))
      ->merge($loanAgg->flatMap(fn($perTanggal) => $perTanggal->keys()))
      // Baris rekap harian (kasbon/transport) TIDAK dihitung: Rekap 2 tidak
      // menampilkan kolomnya, dan baris kosong yang terlanjur dibuat di hari
      // Minggu/libur memunculkan tanggal itu tanpa angka apa pun.
      ->map(fn($t) => Carbon::parse($t)->toDateString());

    $datesOfMonth = \App\Models\WorkDay::tanggalRekapBulan(
      $startDateofMonth,
      $tanggalBerdata
    )->all();

    // ============================
    // BUILD RESPONSE
    // ============================

    $kmOtomatis = \App\Helpers\AgregasiScope::pakaiAgregatBaru($branch_id, $startDateofMonth)
      ? \App\Helpers\CeklistKepala::daftarOtomatis($groupingIds, $startDateofMonth, $endDateofMonth)
      : [];

    // Total berjalan per kelompok per tanggal, sekali jalan (dulu tiap sel
    // menyaring & menjumlah ulang semua tanggal sebelumnya). Rekap harian
    // diindeks "grouping|tanggal" (dulu ->where() memindai semua baris per sel).
    $berjalan = [];
    $tanggalUrut = collect($datesOfMonth)->sort()->values();
    foreach ($transactionOffice as $item) {
      $dropG = collect($loanAgg[$item->id] ?? [])->filter(fn($r, $d) => $d >= $startDateofMonth)->sortKeys();
      $instG = collect($instalmentAgg[$item->id] ?? [])->filter(fn($r, $d) => $d >= $startDateofMonth)->sortKeys();
      $dk = $dropG->keys()->all();
      $ik = $instG->keys()->all();
      $di = $ii = 0;
      $acc = ['drop' => 0, 'total' => 0, 'cm' => 0, 'mb' => 0, 'ml' => 0];
      foreach ($tanggalUrut as $t) {
        for (; $di < count($dk) && $dk[$di] <= $t; $di++) {
          $acc['drop'] += $dropG[$dk[$di]]->first()->drop_total ?? 0;
        }
        for (; $ii < count($ik) && $ik[$ii] <= $t; $ii++) {
          $row = $instG[$ik[$ii]]->first();
          foreach (['total', 'cm', 'mb', 'ml'] as $k) {
            $acc[$k] += $row->$k ?? 0;
          }
        }
        $berjalan[$item->id][$t] = $acc;
      }
    }
    $recapIdx = [];
    foreach ($transactionDailyRecap as $r) {
      $recapIdx[$r->transaction_loan_officer_grouping_id . '|' . Carbon::parse($r->date)->toDateString()] ??= $r;
    }

    $data = collect($datesOfMonth)->map(function ($date) use (
      $kmOtomatis,
      $transactionOffice,
      $loanAgg,
      $instalmentAgg,
      $transactionSirculation,
      $berjalan,
      $recapIdx
    ) {

      return [
        'tanggal' => $date,
        'data' => $transactionOffice->map(function ($item) use (
          $kmOtomatis,
          $date,
          $loanAgg,
          $instalmentAgg,
          $transactionSirculation,
          $berjalan,
          $recapIdx
        ) {

          $thisLoan = data_get($loanAgg, $item->id . '.' . $date . '.0.drop_total', 0);
          $thisInst = data_get($instalmentAgg, $item->id . '.' . $date . '.0', null);

          $storting = $thisInst->total ?? 0;
          $cm = $thisInst->cm ?? 0;
          $mb = $thisInst->mb ?? 0;
          $ml = $thisInst->ml ?? 0;

          $thisSirculation = $transactionSirculation->get($item->id, collect());
          $thisDailyRecap = $recapIdx[$item->id . '|' . $date] ?? null;

          $jalan = $berjalan[$item->id][$date];
          $totalDrop = $jalan['drop'];
          $stortingAgg = $jalan;

          $totalStorting = $stortingAgg['total'];
          $totalStortingCm = $stortingAgg['cm'];
          $totalStortingMb = $stortingAgg['mb'];
          $totalStortingMl = $stortingAgg['ml'];

          $do11 = (int) round($thisLoan * 0.11);
          $titipan9 = (int) round($thisLoan * 0.09);

          $kasbon = $thisDailyRecap?->kasbon ?? 0;
          $transport = $thisDailyRecap?->transport ?? 0;

          $debit = $do11 + $kasbon + $storting;
          $kredit = $thisLoan + $transport;

          return [
            'type' => 'daily',
            'kelompok' => $item->kelompok,
            'id' => $item->id,
            'tanggal' => $date,
            'rekap_status' => $thisDailyRecap ? true : false,
            'status_approve_kepala' => $thisDailyRecap?->daily_kepala_approval ? true : false,
            'status_approve_kasir' => $thisDailyRecap?->daily_kasir_approval ? true : false,
            'kepala_otomatis' => isset($kmOtomatis[$item->id . '|' . $date]) || self::accKmOtomatisLama($thisDailyRecap),
            'status_dayly_approval' => ($thisDailyRecap?->daily_kepala_approval && $thisDailyRecap?->daily_kasir_approval),

            'kasbon' => $kasbon,
            'drop' => $thisLoan,
            'total_drop' => $totalDrop,
            'do11' => $do11,
            'titipan9' => $titipan9,

            'debit' => $debit,
            'transport' => $transport,
            'kredit' => $kredit,
            'tunai' => $debit - $kredit,
            'tunai_ondb' => $thisDailyRecap?->tunai ?? 0,
            'is_balance' => ($debit - $kredit) == $thisDailyRecap?->tunai,

            'storting' => $storting,
            'total_storting' => $totalStorting,
            'sirkulasi' => (int) round($thisSirculation->sum('amount') + ($totalDrop * 1.3) - $totalStorting),

            'angsuran_cm' => $cm,
            'total_angsuran_cm' => $totalStortingCm,
            'saldo_cm' => $thisSirculation->sum('cm_amount') - $totalStortingCm,

            'angsuran_mb' => $mb,
            'total_angsuran_mb' => $totalStortingMb,
            'saldo_mb' => $thisSirculation->sum('mb_amount') - $totalStortingMb,

            'angsuran_ml' => $ml,
            'total_angsuran_ml' => $totalStortingMl,
            'saldo_ml' => $thisSirculation->sum('ml_amount') - $totalStortingMl,
          ];
        })->values()
      ];
    })->values();

    return [
      'datas' => $data,
      'saldoAwalBulan' => $saldoAwalBulan,
      'server_filter' => [
        'date' => $transaction_date->format('Y-m-d'),
        'month' => $transaction_date->format('Y-m'),
        // Dibaca Rencana/Approval di drawer ACC KM (alur baru vs lama).
        'migrasi' => \App\Helpers\AgregasiScope::pakaiAgregatBaru($branch_id, $startDateofMonth),
        'hari_terbuka' => \App\Helpers\AgregasiScope::sudahMigrasi($branch_id) ? \App\Helpers\Gembok::hariTerbuka($branch_id) : [],
        // Jumlah Koreksi Data Beku kantor ini (penanda di Saldo Awal Bulan).
        'koreksi_beku' => \App\Models\TransactionKoreksiBeku::where('branch_id', $branch_id)->count(),
        'wilayah' => $wilayah,
        'branch' => $userAuthorized['branches'],
        'userAuthorized' => $userAuthorized,
        'branch_id' => $branch_id
      ]
    ];
  }

  public function getRekapPermantriData(Request $request)
  {
    $scope = \App\Helpers\AuthScope::resolve();
    $branch_id = $scope->branch_id;
    $wilayah = $scope->wilayah;
    $kelompok = $scope->kelompok;
    $authorized = $scope->user;
    $userAuthorized = AppHelper::branch_permission($authorized, $branch_id);

    $transaction_date = Carbon::parse($request->month ?? Carbon::now());

    $startDateofMonth = $transaction_date->copy()->startOfMonth()->format('Y-m-d');
    $endDateofMonth = $transaction_date->copy()->endOfMonth()->format('Y-m-d');

    $dateOfMb = $transaction_date->copy()->subMonth(4);
    $dateOfCm = $transaction_date->copy()->subMonth(3);

    $transactionOffice = TransactionLoanOfficerGrouping::where('branch_id', $branch_id)->where('kelompok', $kelompok)->first();

    // GERBANG alur baru (lihat getDataRekapDua/getRekapDuaData): kantor migrasi
    // ambil kasbon/transport/tunai + status kunci dari daily_closings, dan saldo
    // awal per hari dari monthly_closings. awal_* dipetakan ke nama kolom
    // sirkulasi lama (amount/cm_amount/…) dan hari -> day supaya map & sum() di
    // bawah tak berubah. Kantor belum-migrasi -> else, IDENTIK jalur lama.
    if (\App\Helpers\AgregasiScope::pakaiAgregatBaru($branch_id, $startDateofMonth)) {
      $transactionDailyRecap = \App\Models\TransactionDailyClosing::where('transaction_loan_officer_grouping_id', $transactionOffice->id)
        ->whereBetween('date', [$startDateofMonth, $endDateofMonth])->get()
        ->map(fn($r) => (object) [
          'date' => Carbon::parse($r->date)->toDateString(),
          'kasbon' => (int) $r->kasbon,
          'transport' => (int) $r->transport,
          'tunai' => (int) $r->tunai,
          'setoran_tunai' => $r->setoran_tunai,
          'setoran_transfer' => $r->setoran_transfer,
          'setoran_katrol' => $r->setoran_katrol,
          'daily_kepala_approval' => $r->kepala_approval_at !== null,
          'daily_kasir_approval' => $r->kasir_lock_at !== null,
        ]);

      $transactionSirculation = \App\Models\TransactionMonthlyClosing::with('loan_officer_grouping')
        ->where('transaction_loan_officer_grouping_id', $transactionOffice->id)
        ->whereDate('periode', $startDateofMonth)->get()
        ->map(fn($r) => (object) [
          'transaction_loan_officer_grouping' => (object) ['kelompok' => $r->loan_officer_grouping->kelompok ?? null],
          'day' => $r->hari,
          'amount' => (int) $r->awal_total,
          'cm_amount' => (int) $r->awal_cm,
          'mb_amount' => (int) $r->awal_mb,
          'ml_amount' => (int) $r->awal_ml,
        ]);
    } else {
      $transactionDailyRecap = TransactionDailyRecap::where('transaction_loan_officer_grouping_id', $transactionOffice->id)
        ->whereBetween('date', [$startDateofMonth, $endDateofMonth])->get();

      $transactionSirculation = TransactionSirculation::where('transaction_loan_officer_grouping_id', $transactionOffice->id)
        ->where('date', $startDateofMonth)
        ->get();
    }

    // Dijumlah di SQL per tanggal (dulu ribuan baris angsuran ditarik lalu
    // disaring & dijumlah ulang per tanggal - Rekap Mantri sampai 3 detik).
    $instalment = TransactionLoanInstalment::where('transaction_loan_officer_grouping_id', $transactionOffice->id)
      ->whereBetween('transaction_date', [$startDateofMonth, $endDateofMonth])
      ->groupBy('transaction_date')
      ->selectRaw('transaction_date AS d, SUM(nominal) AS total,
        SUM(CASE WHEN status = 2 THEN nominal ELSE 0 END) AS cm,
        SUM(CASE WHEN status = 3 THEN nominal ELSE 0 END) AS mb,
        SUM(CASE WHEN status = 4 THEN nominal ELSE 0 END) AS ml')
      ->toBase()->get()
      ->keyBy(fn($r) => Carbon::parse($r->d)->toDateString());

    // Hanya yang sukses cair - sama dengan Rekap 1 & 2.
    $loan = TransactionLoan::where('transaction_loan_officer_grouping_id', $transactionOffice->id)
      ->where('status', 'success')
      ->whereBetween('drop_date', [$startDateofMonth, $endDateofMonth])
      ->groupBy('drop_date')
      ->selectRaw('drop_date AS d, SUM(nominal_drop) AS n')
      ->toBase()->get()
      ->keyBy(fn($r) => Carbon::parse($r->d)->toDateString());

    // Kantor migrasi: angsuran per ember (CM/MB/ML) dari HitungAgregat - ember
    // menurut tanggal drop, sama dengan Rekap 2 & daily_closings - bukan kolom
    // status angsuran lama.
    $emberHarian = \App\Helpers\AgregasiScope::pakaiAgregatBaru($branch_id, $startDateofMonth)
      ? \App\Helpers\HitungAgregat::harianBanyak([$transactionOffice->id], $startDateofMonth, $endDateofMonth)
      : null;

    // Semua hari kerja (Kalender Kerja) + tanggal libur yang ternyata berisi
    // (drop, angsuran, isian kasir) - hari kerja kosong tetap tampil, libur
    // kosong disembunyikan. Dibatasi s/d ?sampai (detail dari tabel Global
    // Rekap 1, supaya jumlahnya sama), selain itu s/d hari ini.
    $berdata = $loan->keys()->merge($instalment->keys())
      ->merge($transactionDailyRecap->filter(fn($r) => ($r->kasbon ?? 0) || ($r->transport ?? 0)
        || isset($r->setoran_tunai) || isset($r->setoran_transfer) || isset($r->setoran_katrol))->pluck('date'));
    $sampai = $request->filled('sampai') ? Carbon::parse($request->sampai)->toDateString() : null;
    $hariIni = min($endDateofMonth, Carbon::today()->toDateString());
    $tglBerdata = $berdata->map(fn($b) => Carbon::parse($b)->toDateString())->flip();
    $dates = \App\Models\WorkDay::tanggalRekapBulan($startDateofMonth, $berdata)
      // ?sampai: tegas s/d tanggal itu. Tanpa itu: hari kerja s/d hari ini,
      // plus tanggal sesudahnya yang ternyata berisi (supaya kelihatan).
      ->filter(fn($d) => $sampai ? $d <= $sampai : ($d <= $hariIni || $tglBerdata->has($d)))
      ->values();

    $saldoAwalBulan = $transactionSirculation->map(function ($item) {
      return [
        'kelompok' => $item->transaction_loan_officer_grouping->kelompok,
        'hari' => $item->day,
        'day' => AppHelper::getNumbDays($item->day),
        'sirkulasi' => $item->amount ?? 0,
        'sirkulasiCm' =>  $item->cm_amount ?? 0,
        'sirkulasiMb' =>  $item->mb_amount ?? 0,
        'sirkulasiMl' =>  $item->ml_amount ?? 0,
      ];
    })->sortBy('day')->values();

    // dd($saldoAwalBulan);
    $alurBaruMantri = \App\Helpers\AgregasiScope::pakaiAgregatBaru($branch_id, $startDateofMonth);

    $kmOtomatis = $alurBaruMantri
      ? \App\Helpers\CeklistKepala::daftarOtomatis([$transactionOffice->id], $startDateofMonth, $endDateofMonth)
      : [];

    // Total berjalan s/d tiap tanggal, sekali jalan atas tanggal urut (semua
    // tanggal berisi ikut dijumlah, termasuk yang tidak ditampilkan).
    $berjalan = [];
    $ember = collect($emberHarian ?? [])->mapWithKeys(fn($v, $k) => [explode('|', $k)[1] => $v]);
    $sumber = ['drop' => $loan, 'inst' => $instalment, 'ember' => $ember];
    $kunciUrut = array_map(fn($c) => $c->keys()->sort()->values()->all(), $sumber);
    $pos = ['drop' => 0, 'inst' => 0, 'ember' => 0];
    $acc = ['drop' => 0, 'total' => 0, 'cm' => 0, 'mb' => 0, 'ml' => 0, 'e_cm' => 0, 'e_mb' => 0, 'e_ml' => 0];
    foreach ($dates->sort()->values() as $t) {
      for (; $pos['drop'] < count($kunciUrut['drop']) && $kunciUrut['drop'][$pos['drop']] <= $t; $pos['drop']++) {
        $acc['drop'] += (int) $loan[$kunciUrut['drop'][$pos['drop']]]->n;
      }
      for (; $pos['inst'] < count($kunciUrut['inst']) && $kunciUrut['inst'][$pos['inst']] <= $t; $pos['inst']++) {
        $r = $instalment[$kunciUrut['inst'][$pos['inst']]];
        foreach (['total', 'cm', 'mb', 'ml'] as $k) {
          $acc[$k] += (int) $r->$k;
        }
      }
      for (; $pos['ember'] < count($kunciUrut['ember']) && $kunciUrut['ember'][$pos['ember']] <= $t; $pos['ember']++) {
        $v = $ember[$kunciUrut['ember'][$pos['ember']]];
        foreach (['cm', 'mb', 'ml'] as $e) {
          $acc['e_' . $e] += $v['storting_' . $e];
        }
      }
      $berjalan[$t] = $acc;
    }
    $recapIdx = [];
    foreach ($transactionDailyRecap as $r) {
      $recapIdx[Carbon::parse($r->date)->toDateString()] ??= $r;
    }

    $data = $dates->map(function ($date) use ($loan, $instalment, $transactionSirculation, $recapIdx, $berjalan, $transactionOffice, $kelompok, $alurBaruMantri, $emberHarian, $kmOtomatis) {
      // 'tanggal' => $date,

      $transaction_date = Carbon::parse($date)->format('Y-m-d');

      $thisInst = $instalment->get($transaction_date);
      $thisSirculation = $transactionSirculation;
      $thisDailyRecap = $recapIdx[$transaction_date] ?? null;
      $status_kepala = $thisDailyRecap?->daily_kepala_approval ? true : false;
      $status_kasir = $thisDailyRecap?->daily_kasir_approval ? true : false;

      $jalan = $berjalan[$transaction_date];
      $totalDrop = $jalan['drop'];
      $totalStorting = $jalan['total'];

      $angusuranExistingCm = (int) ($thisInst->cm ?? 0);
      $totalStortingCm = $jalan['cm'];

      $angusuranExistingMb = (int) ($thisInst->mb ?? 0);
      $totalStortingMb = $jalan['mb'];

      $angusuranExistingMl = (int) ($thisInst->ml ?? 0);
      $totalStortingMl = $jalan['ml'];

      if ($emberHarian !== null) {
        $hariIni = $emberHarian[$transactionOffice->id . '|' . $transaction_date] ?? \App\Helpers\HitungAgregat::kosong();
        foreach (['cm' => 'Cm', 'mb' => 'Mb', 'ml' => 'Ml'] as $e => $E) {
          ${'angusuranExisting' . $E} = $hariIni['storting_' . $e];
          ${'totalStorting' . $E} = $jalan['e_' . $e];
        }
      }

      $sirkulasi = $thisSirculation->sum('amount') ?? 0;
      $sirkulasiCm = $thisSirculation->sum('cm_amount') ?? 0;
      $sirkulasiMb = $thisSirculation->sum('mb_amount') ?? 0;
      $sirkulasiMl = $thisSirculation->sum('ml_amount') ?? 0;

      $nominaldrop = (int) ($loan->get($transaction_date)?->n ?? 0);
      $storting = (int) ($thisInst->total ?? 0);
      $do11 = (int) round($nominaldrop * 0.11);
      $titipan9 = (int) round($nominaldrop * 0.09);
      $kasbon = $thisDailyRecap?->kasbon ?? 0;
      $debit = $do11 + $kasbon + $storting;

      $transport = $thisDailyRecap?->transport ?? 0;
      $kredit = $nominaldrop + $transport;
      // Setoran = hanya isian kasir, kosong = 0 (sama dengan tabel Global Rekap 1).
      $setoran = (int) ($thisDailyRecap?->setoran_tunai ?? 0) + (int) ($thisDailyRecap?->setoran_transfer ?? 0) + (int) ($thisDailyRecap?->setoran_katrol ?? 0);
      return [
        'type' => 'permantri',
        'sisa_uang' => $titipan9 + ($debit - $kredit),
        'su_lapangan' => $thisDailyRecap?->setoran_tunai ?? null,
        'setoran_transfer' => $thisDailyRecap?->setoran_transfer ?? null,
        'setoran_katrol' => $thisDailyRecap?->setoran_katrol ?? null,
        'selisih_uang' => $alurBaruMantri ? $setoran - ($titipan9 + ($debit - $kredit)) : null,
        'kelompok' => $kelompok,
        'id' => $transactionOffice->id,
        'tanggal' => $transaction_date,
        'rekap_status' => $thisDailyRecap ? true : false,
        'status_approve_kepala' => $status_kepala,
        'status_approve_kasir' => $status_kasir,
        'kepala_otomatis' => isset($kmOtomatis[$transactionOffice->id . '|' . $transaction_date]) || self::accKmOtomatisLama($thisDailyRecap),
        'status_dayly_approval' => $status_kepala && $status_kasir,
        'transaction_date' => $transaction_date,

        'kasbon' => $kasbon,
        'drop' => $nominaldrop,
        'total_drop' => $totalDrop,
        'do11' => $do11,
        'titipan9' => $titipan9,

        'debit' => $debit,
        'transport' => $transport,
        'kredit' => $kredit,
        'tunai' => $debit - $kredit,
        'tunai_ondb' => $thisDailyRecap?->tunai ?? 0,
        'is_balance' => ($debit - $kredit) == $thisDailyRecap?->tunai,

        'storting' => $storting,
        'total_storting' => $totalStorting,
        'sirkulasi' => (int) round($sirkulasi + ($totalDrop * 1.3) - $totalStorting),

        'angsuran_cm' => $angusuranExistingCm,
        'total_angsuran_cm' => $totalStortingCm,
        'saldo_cm' => $sirkulasiCm - $totalStortingCm,

        'angsuran_mb' => $angusuranExistingMb,
        'total_angsuran_mb' => $totalStortingMb,
        'saldo_mb' => $sirkulasiMb - $totalStortingMb,

        'angsuran_ml' => $angusuranExistingMl,
        'total_angsuran_ml' => $totalStortingMl,
        'saldo_ml' => $sirkulasiMl - $totalStortingMl,
      ];
    })->values();

    return [
      'datas' => $data,
      'saldoAwalBulan' => $saldoAwalBulan,
      'server_filter' => [
        'month' => $transaction_date->format('Y-m'),
        // Dibaca drawer ACC KM (alur baru vs lama).
        'migrasi' => $alurBaruMantri,
        'kelompok' => $kelompok,
        'wilayah' => $wilayah,
        'branch' => $userAuthorized['branches'],
        'userAuthorized' => $userAuthorized,
        'branch_id' => $branch_id
      ]
    ];
  }
}
