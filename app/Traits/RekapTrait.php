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
  public function getRencanaDropKepalaData(Request $request)
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
    $groupingId = TransactionLoanOfficerGrouping::where('branch_id', $branch_id)->get();

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

    $loan = TransactionLoan::whereIn('transaction_loan_officer_grouping_id', $groupingId->pluck('id'))
      ->whereBetween('drop_date', [$startOfMonth->toDateString(), $sampai])
      ->get(['transaction_loan_officer_grouping_id', 'drop_date', 'status', 'drop_langsung', 'nominal_drop', 'approved_nominal'])
      ->groupBy(fn($l) => Carbon::parse($l->drop_date)->toDateString());

    $migrasi = \App\Helpers\AgregasiScope::pakaiAgregatBaru($branch_id, $startOfMonth);

    // GERBANG alur baru: kantor migrasi membaca kasbon/transport/keluar/target
    // dari daily_closings. `masuk` belum ada di alur baru -> 0 sementara.
    if ($migrasi) {
      $daily_recap = \App\Models\TransactionDailyClosing::whereIn('transaction_loan_officer_grouping_id', $groupingId->pluck('id'))
        ->whereIn('date', $datesMatchDay)->get()
        ->map(fn($r) => (object) [
          'transaction_loan_officer_grouping_id' => $r->transaction_loan_officer_grouping_id,
          'date' => Carbon::parse($r->date)->toDateString(),
          'kasbon' => (int) $r->kasbon,
          'masuk' => 0,
          'keluar' => (int) $r->keluar,
          'target' => (int) $r->target,
        ])->groupBy('date');
    } else {
      $daily_recap = TransactionDailyRecap::whereIn('transaction_loan_officer_grouping_id', $groupingId->pluck('id'))
        ->whereIn('date', $datesMatchDay)->get()
        ->groupBy(fn($r) => Carbon::parse($r->date)->toDateString());
    }

    $instalment = TransactionLoanInstalment::whereIn('transaction_loan_officer_grouping_id', $groupingId->pluck('id'))
      ->whereIn('transaction_date', $datesMatchDay)
      ->get(['transaction_loan_officer_grouping_id', 'transaction_date', 'nominal'])
      ->groupBy(fn($a) => Carbon::parse($a->transaction_date)->toDateString());

    // Rencana & drop satu kelompok di satu tanggal (sisi kanan).
    $sisiDrop = function (?string $tanggal, int $gid) use ($loan) {
      $l = $tanggal ? $loan->get($tanggal, collect())->where('transaction_loan_officer_grouping_id', $gid) : collect();
      $sukses = $l->where('status', 'success');
      return [
        // Hanya pengajuan yang masih hidup / sudah jadi - tolak & gagal bukan rencana lagi.
        'rencana' => (int) $l->where('drop_langsung', 0)->whereIn('status', ['open', 'acc', 'success'])->sum('approved_nominal'),
        'drop' => (int) $sukses->sum('nominal_drop'),
        'baru' => (int) $sukses->where('drop_langsung', 1)->sum('nominal_drop'),
        'lama' => (int) $sukses->where('drop_langsung', 0)->sum('nominal_drop'),
      ];
    };

    $buku_rencana_drop = $datesMatchDay->map(function ($tanggal) use ($groupingId, $daily_recap, $instalment, $pasangan, $sisiDrop) {
      $p = $pasangan[$tanggal];

      return $groupingId->map(function ($g) use ($tanggal, $p, $daily_recap, $instalment, $sisiDrop) {
        $rekap = $daily_recap->get($tanggal, collect())->where('transaction_loan_officer_grouping_id', $g->id)->first();
        $kanan = $sisiDrop($p, $g->id);

        return [
          'grouping_id' => $g->id,
          'kelompok' => $g->kelompok,
          'tanggal' => $tanggal,
          'pasangan' => $p,
          // Kiri: hari D.
          'target' => (int) ($rekap->target ?? 0),
          'storting' => (int) $instalment->get($tanggal, collect())->where('transaction_loan_officer_grouping_id', $g->id)->sum('nominal'),
          'kasbon' => (int) ($rekap->kasbon ?? 0),
          'masuk' => (int) ($rekap->masuk ?? 0),
          'keluar' => (int) ($rekap->keluar ?? 0),
          // Kanan: pasangan D (minggu depan).
          'p_rencana' => $kanan['rencana'],
          'p_drop' => $kanan['drop'],
          'p_baru' => $kanan['baru'],
          'p_lama' => $kanan['lama'],
          // Rencana vs drop yang memang dari pengajuan (lama) - drop langsung
          // (baru) tidak pernah direncanakan, jadi tidak ikut dibandingkan.
          'p_selisih' => $kanan['rencana'] - $kanan['lama'],
        ];
      });
    })->values();

    return [
      'datas' => $buku_rencana_drop,
      'server_filter' => [
        'month' => $transaction_date,
        'wilayah' => $wilayah,
        'branch' => $userAuthorized['branches'],
        'userAuthorized' => $userAuthorized,
        'branch_id' => $branch_id
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

    $instalment = TransactionLoanInstalment::select('transaction_loan_officer_grouping_id', 'transaction_date', 'status', 'nominal', 'is_transfer', 'danatitipan')
      ->whereIn('transaction_loan_officer_grouping_id', $transactionOffice->pluck('id'))
      ->whereBetween('transaction_date', [$startDateofMonth, $transaction_date->format('Y-m-d')])
      ->get()->groupBy('transaction_loan_officer_grouping_id');

    // Hanya yang sukses cair - sama dengan HitungAgregat::drop. success->gagal
    // tidak mengosongkan nominal_drop, jadi tanpa ini drop yang batal ikut terhitung.
    $loan = TransactionLoan::select('transaction_loan_officer_grouping_id', 'drop_date', 'nominal_drop', 'pinjaman')
      ->whereIn('transaction_loan_officer_grouping_id', $transactionOffice->pluck('id'))
      ->where('status', 'success')
      ->whereBetween('drop_date', [$startDateofMonth, $transaction_date->format('Y-m-d')])
      ->get()->groupBy('transaction_loan_officer_grouping_id');


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

    $data =  $transactionOffice->map(function ($item) use ($loan, $instalment, $transactionSirculation, $transactionDailyRecap, $transaction_date, $startDateofMonth, $dateOfCm, $dateOfMb, $alurBaru, $harianBulan) {
      $transaction_date = $transaction_date->format('Y-m-d');
      // dd($transaction_date);
      $thisLoan = $loan->get($item->id, collect());
      $thisInstalment = $instalment->get($item->id, collect());
      $thisSirculation = $transactionSirculation->get($item->id, collect());
      $thisDailyRecap = $transactionDailyRecap->where('transaction_loan_officer_grouping_id', $item->id)->first();
      $status_kepala = $thisDailyRecap?->daily_kepala_approval ? true : false;
      $status_kasir = $thisDailyRecap?->daily_kasir_approval ? true : false;

      $totalDrop = $thisLoan->whereBetween('drop_date', [$startDateofMonth, $transaction_date])->sum('nominal_drop') ?? 0;

      $totalStorting = $thisInstalment->whereBetween('transaction_date', [$startDateofMonth, $transaction_date])->sum('nominal') ?? 0;

      $angusuranExistingCm = $thisInstalment->where('transaction_date', $transaction_date)->where('status', 2)->sum('nominal') ?? 0;
      $totalStortingCm =  $thisInstalment->whereBetween('transaction_date', [$startDateofMonth, $transaction_date])->where('status', 2)->sum('nominal') ?? 0;

      $angusuranExistingMb = $thisInstalment->where('transaction_date', $transaction_date)->where('status', 3)->sum('nominal') ?? 0;
      $totalStortingMb =  $thisInstalment->whereBetween('transaction_date', [$startDateofMonth, $transaction_date])->where('status', 3)->sum('nominal') ?? 0;

      $angusuranExistingMl = $thisInstalment->where('transaction_date', $transaction_date)->where('status', 4)->sum('nominal') ?? 0;
      $totalStortingMl =  $thisInstalment->whereBetween('transaction_date', [$startDateofMonth, $transaction_date])->where('status', 4)->sum('nominal') ?? 0;

      $sirkulasi = $thisSirculation->sum('amount') ?? 0;
      $sirkulasiCm = $thisSirculation->sum('cm_amount') ?? 0;
      $sirkulasiMb = $thisSirculation->sum('mb_amount') ?? 0;
      $sirkulasiMl = $thisSirculation->sum('ml_amount') ?? 0;

      $storting = $thisInstalment->where('transaction_date', $transaction_date)->sum('nominal') ?? 0;
      // Storting hari ini per cara bayar: transfer (is_transfer), katrol
      // (danatitipan), sisanya cash.
      $perCara = $thisInstalment->where('transaction_date', $transaction_date)
        ->groupBy(fn($a) => \App\Helpers\HitungAgregat::caraBayar($a))
        ->map(fn($g) => (int) $g->sum('nominal'));
      $stortingTransfer = $perCara->get('transfer', 0);
      $stortingKatrol = $perCara->get('katrol', 0);
      $stortingCash = $perCara->get('tunai', 0);
      $do11 = (int) round($thisLoan->where('drop_date', $transaction_date)->sum('nominal_drop') * 0.11) ?? 0;
      $titipan9 = (int) round($thisLoan->where('drop_date', $transaction_date)->sum('nominal_drop') * 0.09) ?? 0;
      $kasbon = $thisDailyRecap?->kasbon ?? 0;
      $debit = $do11 + $kasbon + $storting;

      $transport = $thisDailyRecap?->transport ?? 0;
      $nominaldrop =  $thisLoan->where('drop_date', $transaction_date)->sum('nominal_drop');
      $kredit = $nominaldrop + $transport;

      // --- GLOBAL (awal bulan s/d tanggal filter), rumus sama dengan harian.
      $hb = $harianBulan->get($item->id, collect())->keyBy(fn($r) => Carbon::parse($r->date)->toDateString());
      $gDrop = (int) $thisLoan->sum('nominal_drop');
      $gStorting = (int) $thisInstalment->sum('nominal');
      $gKasbon = (int) $hb->sum('kasbon');
      $gTransport = (int) $hb->sum('transport');
      $gDo11 = (int) $thisLoan->groupBy(fn($l) => Carbon::parse($l->drop_date)->toDateString())
        ->sum(fn($g) => round($g->sum('nominal_drop') * 0.11));
      $gTitipan9 = (int) $thisLoan->groupBy(fn($l) => Carbon::parse($l->drop_date)->toDateString())
        ->sum(fn($g) => round($g->sum('nominal_drop') * 0.09));
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
    if (\App\Helpers\AgregasiScope::pakaiAgregatBaru($branch_id, $startDateofMonth)) {
      $transactionDailyRecap = \App\Models\TransactionDailyClosing::whereIn('transaction_loan_officer_grouping_id', $groupingIds)
        ->whereBetween('date', [$startDateofMonth, $endDateofMonth])
        ->get()
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
      $drop = [];
      $angsur = [];
      foreach (\App\Helpers\HitungAgregat::harianBanyak($groupingIds->all(), $startDateofMonth, $endDateofMonth) as $k => $v) {
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

    $data = collect($datesOfMonth)->map(function ($date) use (
      $transactionOffice,
      $loanAgg,
      $instalmentAgg,
      $transactionSirculation,
      $transactionDailyRecap,
      $startDateofMonth
    ) {

      return [
        'tanggal' => $date,
        'data' => $transactionOffice->map(function ($item) use (
          $date,
          $loanAgg,
          $instalmentAgg,
          $transactionSirculation,
          $transactionDailyRecap,
          $startDateofMonth
        ) {

          $thisLoan = data_get($loanAgg, $item->id . '.' . $date . '.0.drop_total', 0);
          $thisInst = data_get($instalmentAgg, $item->id . '.' . $date . '.0', null);

          $storting = $thisInst->total ?? 0;
          $cm = $thisInst->cm ?? 0;
          $mb = $thisInst->mb ?? 0;
          $ml = $thisInst->ml ?? 0;

          $thisSirculation = $transactionSirculation->get($item->id, collect());
          $thisDailyRecap = $transactionDailyRecap
            ->where('transaction_loan_officer_grouping_id', $item->id)
            ->where('date', $date)
            ->first();

          $totalDrop = collect($loanAgg[$item->id] ?? [])
            ->filter(function ($rows, $d) use ($startDateofMonth, $date) {
              return $d >= $startDateofMonth && $d <= $date;
            })
            ->sum(function ($rows) {
              return $rows->first()->drop_total ?? 0;
            });


          $stortingAgg = collect($instalmentAgg[$item->id] ?? [])
            ->filter(function ($rows, $d) use ($startDateofMonth, $date) {
              return $d >= $startDateofMonth && $d <= $date;
            })
            ->reduce(function ($carry, $rows) {

              $row = $rows->first();

              $carry['total'] += $row->total ?? 0;
              $carry['cm'] += $row->cm ?? 0;
              $carry['mb'] += $row->mb ?? 0;
              $carry['ml'] += $row->ml ?? 0;

              return $carry;
            }, [
              'total' => 0,
              'cm' => 0,
              'mb' => 0,
              'ml' => 0
            ]);

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

    $instalment = TransactionLoanInstalment::select('transaction_loan_officer_grouping_id', 'transaction_date', 'status', 'nominal')
      ->where('transaction_loan_officer_grouping_id', $transactionOffice->id)
      ->whereBetween('transaction_date', [$startDateofMonth, $endDateofMonth])
      ->get();

    $loan = TransactionLoan::select('transaction_loan_officer_grouping_id', 'drop_date', 'nominal_drop', 'pinjaman')
      ->where('transaction_loan_officer_grouping_id', $transactionOffice->id)
      ->whereBetween('drop_date', [$startDateofMonth, $endDateofMonth])
      ->get();

    // Semua hari kerja (Kalender Kerja) + tanggal libur yang ternyata berisi
    // (drop, angsuran, isian kasir) - hari kerja kosong tetap tampil, libur
    // kosong disembunyikan. Dibatasi s/d ?sampai (detail dari tabel Global
    // Rekap 1, supaya jumlahnya sama), selain itu s/d hari ini.
    $berdata = $loan->pluck('drop_date')->merge($instalment->pluck('transaction_date'))
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

    $data = $dates->map(function ($date) use ($loan, $instalment, $transactionSirculation, $transactionDailyRecap, $transactionOffice, $startDateofMonth, $kelompok, $alurBaruMantri) {
      // 'tanggal' => $date,

      $transaction_date = Carbon::parse($date)->format('Y-m-d');

      $thisLoan = $loan->where('drop_date', $transaction_date);
      $thisInstalment = $instalment->where('transaction_date', $transaction_date);
      $thisSirculation = $transactionSirculation;
      $thisDailyRecap = $transactionDailyRecap->where('date', $transaction_date)->first();
      $status_kepala = $thisDailyRecap?->daily_kepala_approval ? true : false;
      $status_kasir = $thisDailyRecap?->daily_kasir_approval ? true : false;

      $totalDrop = $loan->whereBetween('drop_date', [$startDateofMonth, $transaction_date])->sum('nominal_drop') ?? 0;
      $totalStorting = $instalment->whereBetween('transaction_date', [$startDateofMonth, $transaction_date])->sum('nominal') ?? 0;

      $angusuranExistingCm = $thisInstalment->where('status', 2)->sum('nominal') ?? 0;
      $totalStortingCm = $instalment->whereBetween('transaction_date', [$startDateofMonth, $transaction_date])->where('status', 2)->sum('nominal') ?? 0;

      $angusuranExistingMb = $thisInstalment->where('status', 3)->sum('nominal') ?? 0;
      $totalStortingMb = $instalment->whereBetween('transaction_date', [$startDateofMonth, $transaction_date])->where('status', 3)->sum('nominal') ?? 0;

      $angusuranExistingMl = $thisInstalment->where('status', 4)->sum('nominal') ?? 0;
      $totalStortingMl = $instalment->whereBetween('transaction_date', [$startDateofMonth, $transaction_date])->where('status', 4)->sum('nominal') ?? 0;

      $sirkulasi = $thisSirculation->sum('amount') ?? 0;
      $sirkulasiCm = $thisSirculation->sum('cm_amount') ?? 0;
      $sirkulasiMb = $thisSirculation->sum('mb_amount') ?? 0;
      $sirkulasiMl = $thisSirculation->sum('ml_amount') ?? 0;

      $storting = $thisInstalment->sum('nominal') ?? 0;
      $do11 = (int) round($thisLoan->sum('nominal_drop') * 0.11) ?? 0;
      $titipan9 = (int) round($thisLoan->sum('nominal_drop') * 0.09) ?? 0;
      $kasbon = $thisDailyRecap?->kasbon ?? 0;
      $debit = $do11 + $kasbon + $storting;

      $transport = $thisDailyRecap?->transport ?? 0;
      $nominaldrop = $thisLoan->sum('nominal_drop');
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
        'wilayah' => $wilayah,
        'branch' => $userAuthorized['branches'],
        'userAuthorized' => $userAuthorized,
        'branch_id' => $branch_id
      ]
    ];
  }
}
