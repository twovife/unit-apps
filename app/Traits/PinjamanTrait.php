<?php

namespace App\Traits;

use App\Helpers\AppHelper;
use App\Models\Branch;
use App\Models\OnlineBranch;
use App\Models\TransactionDailyRecap;
use App\Models\TransactionLoan;
use App\Models\TransactionLoanInstalment;
use App\Models\TransactionLoanOfficerGrouping;
use App\Models\TransactionSirculation;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

trait PinjamanTrait
{
  public function getTransactionLoan(Request $request, bool $withPlan = false)
  {

    $scope = \App\Helpers\AuthScope::resolve();
    $branch_id = $scope->branch_id;
    $wilayah = $scope->wilayah;
    $kelompok = $scope->kelompok;
    $userAuthorized = AppHelper::branch_permission($scope->user, $branch_id);

// dd($scope);

    $transaction_date = $request->month ?? Carbon::now()->format('Y-m');
    $startOfMonth = Carbon::parse($transaction_date)->copy()->startOfMonth();
    $endOfMonth = Carbon::parse($transaction_date)->copy()->endOfMonth();

    $hari = AppHelper::hariTagih($request->hari);

    $groupingId = AppHelper::kelompokAktif($branch_id, $kelompok);

    // GERBANG alur baru: status kunci/approve & rekap harian dibaca dari
    // daily_closings untuk kantor migrasi. Belum-migrasi -> jalur lama, IDENTIK.
    $migrasi = \App\Helpers\AgregasiScope::pakaiAgregatBaru($branch_id, $startOfMonth);


    // mantri/userinput/pemeriksa/pencair di-eager-load agar nama pengaju &
    // pengesah bisa ditampilkan di dialog Action tanpa memicu N+1.
    $loan = TransactionLoan::with([
      'loan_officer_grouping',
      'customer',
      'manage_customer',
      'branch',
      'mantri:id,nama_karyawan',
      'userinput:id,nama_karyawan',
      'pemeriksa:id,nama_karyawan',
      'pencair:id,nama_karyawan',
    ])
      ->where(function ($data) use ($startOfMonth, $endOfMonth) {
        $data->whereBetween('drop_date', [$startOfMonth->format('Y-m-d'), $endOfMonth->format('Y-m-d')])
          ->orWhereBetween('request_date', [$startOfMonth->format('Y-m-d'), $endOfMonth->format('Y-m-d')]);
      })
      ->where('transaction_loan_officer_grouping_id', $groupingId->id)
      ->where('hari', $hari)
      ->orderBy('drop_date')
      ->get();



    $loanCustId = collect($loan->pluck('transaction_manage_customer_id'))->unique();


    $transactionManageCustomer = TransactionLoan::whereIn('transaction_manage_customer_id', $loanCustId)
      ->where('status', 'success')
      ->orderBy('id', 'desc')
      ->get()
      ->groupBy('transaction_manage_customer_id');

    // Tanggal-tanggal yang rekap hariannya SUDAH di-approve kepala.
    // Dipakai UI untuk mengunci Reset Status & Hapus Pinjaman: begitu rekap
    // harian diketuk, angka drop/storting hari itu sudah masuk laporan,
    // sehingga mengubah pinjaman di belakangnya membuat laporan tidak cocok.
    if ($migrasi) {
      // Hari terkunci = dikunci kasir (ACC KM saja belum mengunci; mas 2026-10-15).
      $approvedRecapDates = \App\Models\TransactionDailyClosing::where('transaction_loan_officer_grouping_id', $groupingId->id)
        ->whereNotNull('kasir_lock_at')
        ->pluck('date')
        ->map(fn($d) => Carbon::parse($d)->format('Y-m-d'))
        ->flip();
    } else {
      $approvedRecapDates = TransactionDailyRecap::where('transaction_loan_officer_grouping_id', $groupingId->id)
        ->whereNotNull('daily_kasir_approval')
        ->pluck('date')
        ->map(fn($d) => Carbon::parse($d)->format('Y-m-d'))
        ->flip();
    }

    // Id pinjaman yang SUDAH punya pengajuan pengganti aktif (top-up lewat
    // previous_loan_id ATAU Tundaan lewat postponed_loan_id, status masih
    // open/acc/success) - dipakai mengunci Reset Status & Hapus Pinjaman
    // supaya tidak menghapus/reset pinjaman yang sudah dijadikan dasar
    // pengajuan lain. Query dibatch sekali untuk semua baris di halaman ini,
    // bukan per-baris, biar tidak N+1.
    $loanIds = $loan->pluck('id');
    $sudahDiajukanPenggantiIds = TransactionLoan::where(function ($q) use ($loanIds) {
      $q->whereIn('previous_loan_id', $loanIds)
        ->orWhereIn('postponed_loan_id', $loanIds);
    })
      ->whereIn('status', ['open', 'acc', 'success'])
      ->get(['previous_loan_id', 'postponed_loan_id'])
      ->flatMap(fn($item) => [$item->previous_loan_id, $item->postponed_loan_id])
      ->filter()
      ->unique()
      ->flip();

    // Angsuran pelunasan otomatis pinjaman lama (topup sukses), per pinjaman
    // baru - dialog Hapus menyebut storting yang ikut berkurang.
    $angsuranPelunasan = \App\Models\TransactionLoanInstalment::whereIn('settled_by_loan_id', $loanIds)
      ->get(['settled_by_loan_id', 'transaction_date', 'nominal'])
      ->groupBy('settled_by_loan_id');

    $bolehKoreksi = \App\Helpers\Gembok::bolehBuka(auth()->user());
    $pengajuan = collect($loan->map(function ($drop, $key) use ($transactionManageCustomer, $approvedRecapDates, $sudahDiajukanPenggantiIds, $bolehKoreksi, $angsuranPelunasan) {
      $lunasi = $angsuranPelunasan->get($drop->id);
      $countPinjaman = $transactionManageCustomer->get($drop->transaction_manage_customer_id, collect())->count('id') + 1;
      $dropDateKey = $drop->drop_date ? Carbon::parse($drop->drop_date)->format('Y-m-d') : null;
      return [
        'nama' => $drop->customer->nama,
        'alamat' => $drop->customer->alamat,
        'nomor_anggota' => $drop->manage_customer->nomor_anggota,
        'pinjaman_ke' => $countPinjaman,
        'tanggal_drop' => $drop->drop_date,
        'request_date' => $drop->request_date,

        'drop' => $drop->drop_langsung ? null : $drop->drop_before,
        'request' => $drop->drop_langsung ? null : $drop->request_nominal,
        'acc' => $drop->drop_langsung ? null : $drop->approved_nominal,
        'drop_jadi' => $drop->nominal_drop,

        'check_date' => $drop->check_date,

        // Jejak siapa-mengerjakan-apa, dipakai di dialog Action.
        'diajukan_oleh' => $drop->mantri?->nama_karyawan,
        'diinput_oleh' => $drop->userinput?->nama_karyawan,
        'acc_oleh' => $drop->pemeriksa?->nama_karyawan,
        'user_check' => $drop->user_check, // id karyawan yang meng-ACC (Ubah Tolak)
        'drop_oleh' => $drop->pencair?->nama_karyawan,
        'diinput_pada' => $drop->created_at,

        // true = rekap harian tanggal drop ini sudah di-approve kepala,
        // sehingga Reset Status & Hapus Pinjaman harus dikunci di UI.
        // can-edit / superuser boleh reset / hapus di hari terkunci (dibuka otomatis).
        'recap_approved' => $dropDateKey && !$bolehKoreksi ? $approvedRecapDates->has($dropDateKey) : false,

        'nomor_pengajuan' => $drop->id,
        'nik' => $drop->customer->nik,
        'kelompok' => $drop->loan_officer_grouping->kelompok,
        'unit' => $drop->branch->unit,
        'hari' => $drop->hari,
        'status' => $drop->status,
        'drop_langsung' => $drop->drop_langsung ? 'baru' : "lama",
        'drop_langsung_status' => $drop->drop_langsung ? 2 : 1,
        // Badge "TD" - pengajuan ini dibuat lewat Tundaan (menggantikan
        // pengajuan lain yang tanggal drop-nya dipindah).
        'is_tundaan' => (bool) $drop->postponed_loan_id,

        // true = pinjaman ini sudah dijadikan dasar pengajuan lain yang
        // masih aktif (top-up ATAU Tundaan) - Reset Status & Hapus Pinjaman
        // harus dikunci di UI.
        'sudah_diajukan_pengganti' => $sudahDiajukanPenggantiIds->has($drop->id),

        // Pengajuan pelunasan (topup): menghapusnya membatalkan keluar target
        // pinjaman lama; kalau sudah sukses, angsuran pelunasannya ikut terhapus.
        'dari_pelunasan' => (bool) $drop->previous_loan_id,
        'pelunasan' => $lunasi ? [
          'tanggal' => Carbon::parse($lunasi->first()->transaction_date)->toDateString(),
          'nominal' => (int) $lunasi->sum('nominal'),
        ] : null,
      ];
    })->sortBy('nama')->sortBy('drop_langsung_status')->sortBy('tanggal_drop')->groupBy('tanggal_drop'));


    $numberDays = AppHelper::getNumbDays($hari);
    $datesMatchDay = collect();

    for ($i = $startOfMonth; $i->lte($endOfMonth); $i->addDays()) {
      if ($i->dayOfWeek == $numberDays) {
        $datesMatchDay->push($i->format('Y-m-d'));
      }
    }

    $lastTransaction = $migrasi
      ? \App\Models\TransactionDailyClosing::where('transaction_loan_officer_grouping_id', $groupingId->id)->whereNotNull('kepala_approval_at')->whereNotNull('kasir_lock_at')->max('date')
      : TransactionDailyRecap::where('transaction_loan_officer_grouping_id', $groupingId->id)->whereNotNull('daily_kepala_approval')->whereNotNull('daily_kasir_approval')->max('date');
    $ClosedTransaction = AppHelper::get_closed_date($lastTransaction);
    // jika beserta plan maka ini yang akan dikembalikan

    if ($withPlan) {
      if ($migrasi) {
        $daily_recap = \App\Models\TransactionDailyClosing::where('transaction_loan_officer_grouping_id', $groupingId->id)
          ->whereIn('date', $datesMatchDay)->get()
          ->map(fn($r) => (object) [
            'closing_id' => $r->id,               // dipakai tombol kunci kasir di Rencana
            'setoran_tunai' => $r->setoran_tunai, // null = belum dicatat kasir
            'date' => Carbon::parse($r->date)->toDateString(),
            'kasbon' => (int) $r->kasbon,
            'transport' => (int) $r->transport,
            'masuk' => 0,
            'keluar' => (int) $r->keluar,
            'target' => (int) $r->target,
            'target_source' => $r->target_source, // manual/auto/null - dipakai badge status cek KM
            'storting' => (int) $r->storting,
            'drop' => (int) $r->drop,
            // Timestamp (bukan bool): at_approved/at_kasir butuh nilainya.
            'daily_kepala_approval' => $r->kepala_approval_at,
            'daily_kasir_approval' => $r->kasir_lock_at,
            'daily_kepala_approval_user' => $r->kepala_approval_user,
            'daily_kasir_approval_user' => $r->kasir_lock_user,
          ])->groupBy('date');
      } else {
        $daily_recap = TransactionDailyRecap::where('transaction_loan_officer_grouping_id', $groupingId->id)->whereIn('date', $datesMatchDay)->get()->groupBy('date');
      }

      $instalment = TransactionLoanInstalment::where('transaction_loan_officer_grouping_id', $groupingId->id)->whereIn('transaction_date', $datesMatchDay)->get()->groupBy('transaction_date');

      // Tanda "dibuka ulang": buka-kunci terakhir per baris (alur baru).
      $dibuka = $migrasi
        ? \App\Models\TransactionLockHistory::whereIn('transaction_daily_closing_id', $daily_recap->flatten()->pluck('closing_id')->filter())
          ->where('aksi', \App\Models\TransactionLockHistory::AKSI_BUKA)
          ->orderBy('id')->get(['transaction_daily_closing_id', 'alasan', 'created_at'])
          ->keyBy('transaction_daily_closing_id')
        : collect();

      // Nama yang ACC KM / TTD kasir (ditampilkan di form ACC KM).
      $namaPegawai = \App\Models\Employee::whereIn('id', $daily_recap->flatten()
        ->flatMap(fn($r) => [$r->daily_kepala_approval_user, $r->daily_kasir_approval_user])->filter()->unique())
        ->pluck('nama_karyawan', 'id');

      $buku_rencana_drop = $datesMatchDay->map(function ($tanggal) use ($pengajuan, $daily_recap, $instalment, $groupingId, $dibuka, $migrasi, $namaPegawai) {
        $thisDailyRecap = $daily_recap->get($tanggal, collect())->first(); //stored as database
        // Flow lama: ACC KM otomatis dari TTD kasir (jam KM = jam kasir) = KM belum cek,
        // tetap tampil belum ACC (X) di layar KM (mas 2026-10-19).
        $kmAsli = (bool) $thisDailyRecap?->daily_kepala_approval
          && ($migrasi || (string) $thisDailyRecap->daily_kepala_approval !== (string) $thisDailyRecap->daily_kasir_approval);
        $thisData = $pengajuan->get($tanggal, collect()); //summary of drop
        // Drop = pinjaman yang benar-benar cair (success) - sama dengan angka
        // yang dikunci & dasar target (HitungAgregat::drop).
        $cair = $thisData->where('status', 'success');
        $thisInstalment = $instalment->get($tanggal, collect())->sum('nominal'); //summary of instalment

        // dd($thisData);
        return [
          'is_generated' => $thisDailyRecap ? true : false,
          'grouping_id' => $groupingId->id,
          'closing_id' => $thisDailyRecap?->closing_id,     // alur baru: id baris daily_closings (tombol kunci)
          'dibuka_at' => $dibuka->get($thisDailyRecap?->closing_id)?->created_at?->toDateTimeString(),
          'dibuka_alasan' => $dibuka->get($thisDailyRecap?->closing_id)?->alasan,
          'setoran_tunai' => $thisDailyRecap?->setoran_tunai,
          'kelompok' => $groupingId->kelompok,
          'tanggal' => $tanggal,
          // Hari tagih berikutnya (H+7, libur dilompati) - tempat target &
          // rencana minggu depan hasil ACC KM tanggal ini. Satu sumber dengan
          // server (TargetMingguan::tanggalDepan), bukan baris "berikutnya" di
          // daftar yang urutannya bisa berubah.
          'tanggal_depan' => \App\Helpers\TargetMingguan::tanggalDepan($tanggal),
          'kasbon' =>  $thisDailyRecap?->kasbon,
          'transport' => $thisDailyRecap?->transport,
          // Alur baru tidak menyimpan masuk: 13% drop D, rumus yang sama dengan target.
          'masuk' => $migrasi ? \App\Helpers\TargetMingguan::masuk((int) $cair->sum('drop_jadi')) : $thisDailyRecap?->masuk,
          'keluar' => $thisDailyRecap?->keluar,
          'target' => $thisDailyRecap?->target,
          // Sumber target: 'manual' = sudah dicek KM, 'auto' = placeholder cron
          // (belum dicek), null = belum ada. Dipakai badge status di UI.
          'target_source' => $thisDailyRecap?->target_source,
          'storting_on_database' => $thisDailyRecap?->storting,
          'storting' => $thisInstalment,
          'storting_validate' => $thisInstalment == ($thisDailyRecap?->storting) ? true : false,
          'baru' => $cair->where('drop_langsung', 'baru')->sum('drop_jadi'),
          'lama' => $cair->where('drop_langsung', 'lama')->sum('drop_jadi'),

          'drop' => $cair->sum('drop_jadi'),
          'drop_on_database' => $thisDailyRecap?->drop,
          'drop_validate' => $cair->sum('drop_jadi') == ($thisDailyRecap?->drop) ? true : false,

          'rencana' => $thisData->where('drop_langsung', 'lama')->sum('acc'),

          'is_approved' => $kmAsli,
          'is_kasir' => $thisDailyRecap?->daily_kasir_approval ? true : false,
          'at_approved' => $thisDailyRecap?->daily_kepala_approval,
          'at_kasir' => $thisDailyRecap?->daily_kasir_approval,
          'oleh_acc' => $namaPegawai->get($thisDailyRecap?->daily_kepala_approval_user ?? 0),
          'oleh_kasir' => $namaPegawai->get($thisDailyRecap?->daily_kasir_approval_user ?? 0),
          'is_closed' => $kmAsli,
          'button_color' => $kmAsli ? ($thisDailyRecap?->daily_kasir_approval ? 'success' : 'baru') : 'open',
        ];
      })->sortByDesc('tanggal')->values();
    }


    // Terbaru di atas (keputusan mas 2026-10-09): bulan lama yang dimuat
    // belakangan menyambung di bawah, jadi seluruh daftar urut mundur.
    return [
      'datas' => $pengajuan->sortKeysDesc()->values(),
      'buku_rencana' => $buku_rencana_drop ?? [],
      'server_filter' => [
        'month' => $transaction_date,
        'wilayah' => $wilayah,
        'branch' => $userAuthorized['branches'],
        'userAuthorized' => $userAuthorized,
        'branch_id' => $branch_id,
        'kelompok' => $kelompok,
        'hari' => $hari,
        'closed_transaction' => $ClosedTransaction,
        'migrasi' => $migrasi, // true = kantor pakai alur baru (daily_closings)
      ]
    ];
  }

  public function getLoan(Request $request, $dailyView = false)
  {

    $date = $request->date ?? null;
    if ($date) {
      $request->merge([
        'month' => Carbon::parse($date)->format('Y-m'),
        'hari' => AppHelper::dateName($date)
      ]);
    }


    $now = Carbon::now();
    $transaction_date = $dailyView
      ? $now->copy()->endOfMonth()
      : Carbon::parse($request->month ?? $now)->endOfMonth();
    // dd($transaction_date->format('Y-m-d'));
    $transaction_start_date = $transaction_date->copy()->startOfMonth();
    $begin_transaction = $transaction_date->copy()->startOfMonth()->subMonthNoOverflow(4);

    $hari = AppHelper::hariTagih($request->hari);

    $tanggalSeleksi  = AppHelper::getStortingShowDate($hari);

    // dd($tanggalSeleksi);


    $scope = \App\Helpers\AuthScope::resolve();
    $branch_id = $scope->branch_id;
    $wilayah = $scope->wilayah;
    $kelompok = $scope->kelompok;
    $authorized = $scope->user;
    $userAuthorized = AppHelper::branch_permission($authorized, $branch_id);



    $groupingId = AppHelper::kelompokAktif($branch_id, $kelompok);


    $hariIni = AppHelper::dateName(Carbon::now()) == $hari;
    $lastDayOfThisWeek = Carbon::now()->previous(AppHelper::getNumbDays($hari))->format('Y-m-d');
    $dayClosedParams = $hariIni ? Carbon::now()->format('Y-m-d') : $lastDayOfThisWeek;
    $ClosedTransaction = AppHelper::get_closed_date($dayClosedParams);

    // Koleksi harian ikut hari EFEKTIF (lihat getLoanMantri): mutasi yang
    // berlaku pada bulan yang dilihat memindahkan nasabah ke hari/kelompok baru.
    $refMutasi = $transaction_start_date->copy()->startOfMonth()->toDateString();
    $mut = \App\Helpers\Mutasi::penyesuaianBaca($groupingId->id, $hari, $refMutasi);
    $filterEfektif = function ($q) use ($groupingId, $hari, $mut) {
      $q->where(function ($qq) use ($groupingId, $hari, $mut) {
        $qq->where('transaction_loan_officer_grouping_id', $groupingId->id)->where('hari', $hari);
        if ($mut['keluar']) {
          $qq->whereNotIn('id', $mut['keluar']);
        }
      });
      if ($mut['masuk']) {
        $q->orWhereIn('id', $mut['masuk']);
      }
    };

    // GERBANG alur baru: saldo awal (grup+hari+bulan) dari monthly_closings
    // awal_*, dipetakan ke nama kolom sirkulasi lama yang dibaca frontend
    // (amount/cm_amount/mb_amount/ml_amount). Belum-migrasi -> jalur lama.
    $migrasi = \App\Helpers\AgregasiScope::pakaiAgregatBaru($branch_id, $transaction_start_date);
    if ($migrasi) {
      $mc = \App\Models\TransactionMonthlyClosing::where('transaction_loan_officer_grouping_id', $groupingId->id)
        ->where('hari', $hari)
        ->whereDate('periode', $transaction_start_date->format('Y-m-d'))
        ->first();
      $transactionSirkulan = $mc ? (object) [
        'amount' => (int) $mc->awal_total,
        'cm_amount' => (int) $mc->awal_cm,
        'mb_amount' => (int) $mc->awal_mb,
        'ml_amount' => (int) $mc->awal_ml,
      ] : null;
    } else {
      $transactionSirkulan = TransactionSirculation::where('transaction_loan_officer_grouping_id', $groupingId->id)
        ->where('day', $hari)
        ->where('date', $transaction_start_date->format('Y-m-d'))
        ->first();
    }

    // Tutup Buku Storting alur baru (mas 2026-10-10): angka dari baris
    // bulanan buku ini (awal/akhir per ember) + awal bulan depan; tanda
    // tangan sekali (GembokBulanan::tutupBuku), lalu tombolnya hilang.
    $tutupBuku = null;
    if ($migrasi && $mc) {
      $mc->segarkanKelengkapan(); // hari terkunci & halangan dari kunci harian sekarang
      $depan = \App\Models\TransactionMonthlyClosing::where('transaction_loan_officer_grouping_id', $groupingId->id)
        ->where('hari', $hari)
        ->whereDate('periode', $transaction_start_date->copy()->addMonthNoOverflow()->format('Y-m-d'))
        ->first();
      $ember = fn($b, $awalan) => $b ? collect(\App\Helpers\Ember::SEMUA)->mapWithKeys(fn($e) => [$e => (int) $b->{$awalan . $e}])->all() : null;
      $tutupBuku = [
        'id' => $mc->id,
        'awal' => $ember($mc, 'awal_'),
        'akhir' => $ember($mc, 'akhir_'),
        'depan' => $ember($depan, 'awal_'),
        'awal_total' => (int) $mc->awal_total,
        'akhir_total' => (int) $mc->akhir_total,
        'drop' => (int) $mc->drop,
        'storting' => (int) $mc->storting,
        'pemutihan' => (int) $mc->pemutihan,
        'hari_kerja' => (int) $mc->hari_kerja,
        'hari_terkunci' => (int) $mc->hari_terkunci,
        'ditutup_at' => $mc->kasir_lock_at?->toDateTimeString(),
        'ditutup_oleh' => $mc->kasir?->nama_karyawan,
        'halangan' => \App\Helpers\GembokBulanan::halanganTutupBuku($mc),
      ];
    }

    $loan = TransactionLoan::with(
      ['loan_instalment' => function ($item) {
        $item->orderByDesc('transaction_date');
      }, 'manage_customer' => function ($item) {
        $item->with('loan');
      }, 'branch', 'customer', 'white_off', 'loan_officer_grouping']
    )
      ->whereBetween('drop_date', [$begin_transaction, $transaction_date->format('Y-m-d')])
      ->where($filterEfektif)
      ->where('status', 'success')
      ->orderBy('drop_date')
      ->get()
      ->groupBy(function ($item) {
        return Carbon::parse($item->drop_date)->format('Y-m');
      });

    $loanMl = TransactionLoan::with(
      ['loan_instalment' => function ($item) {
        $item->orderByDesc('transaction_date');
      }, 'manage_customer' => function ($item) {
        $item->with('loan');
      }, 'branch', 'customer', 'loan_officer_grouping', 'white_off']
    )
      ->where('drop_date', "<", $begin_transaction->format('Y-m-d'))
      ->where($filterEfektif)
      ->where(function ($item) use ($transaction_start_date, $transaction_date) {
        $item->whereHas('loan_instalment', function ($query) use ($transaction_start_date, $transaction_date) {
          $query->whereBetween('transaction_date', [$transaction_start_date->format('Y-m-d'), $transaction_date->format('Y-m-d')])
            ->where('nominal', '>', 0);
        })->orWhereHas('white_off', function ($query) use ($transaction_start_date, $transaction_date) {
          $query->whereBetween('transaction_date', [$transaction_start_date->format('Y-m-d'), $transaction_date->format('Y-m-d')])
            ->where('nominal', '>', 0);
        });
      })

      //
      ->where('status', 'success')
      ->orderBy('drop_date')
      ->get();

    // F8 (satu rumus dengan rekap): saldo akhir bulan terpilih & akhir bulan sebelumnya.
    $idsF8 = $loan->collapse()->pluck('id')->merge($loanMl->pluck('id'))->all();
    $saldoF8 = \App\Helpers\PenyesuaianSaldo::saldoBanyak($idsF8, $transaction_date);
    $saldoAwalF8 = \App\Helpers\PenyesuaianSaldo::saldoBanyak($idsF8, $transaction_start_date->copy()->subDay(), $transaction_start_date);
    // Pemutihan sebelum bulan terpilih per pinjaman per bulan (Y-m => total),
    // untuk blok bulan di buku angsuran.
    $mdPerBulan = DB::table('transaction_white_offs')
      ->whereIn('transaction_loan_id', $idsF8)
      ->where('transaction_date', '<', $transaction_start_date->format('Y-m-d'))
      ->selectRaw("transaction_loan_id, DATE_FORMAT(transaction_date, '%Y-%m') AS b, SUM(nominal) AS n")
      ->groupBy('transaction_loan_id', 'b')
      ->get()
      ->groupBy('transaction_loan_id')
      ->map(fn($g) => $g->mapWithKeys(fn($r) => [$r->b => (int) $r->n]));

    $dataMlGenerate = [
      'month' => "ML",
      'type' => "ml",
      'type2' => "ML",
      'date' => Carbon::parse($begin_transaction)->subMonthNoOverflow(1)->format('Y-m-d'),
      'data' => $loanMl->map(function ($item) use ($transaction_start_date, $transaction_date, $tanggalSeleksi, $dailyView, $saldoF8, $saldoAwalF8, $mdPerBulan) {
        $pemutihan = $item->white_off?->transaction_date == $tanggalSeleksi ? $item->white_off->nominal : 0;

        $pemutihan_before_month = $item->white_off ? ($item->white_off->transaction_date < $transaction_start_date->format('Y-m-d') ? $item->white_off->nominal : 0) : 0;
        $pemutihan_this_month = $item->white_off ? (Carbon::parse($item->white_off->transaction_date)->format('Y-m') == $transaction_date->format('Y-m') ? $item->white_off->nominal : 0) : 0;
        $saldo = $saldoF8[$item->id]['saldo'];

        $countPinjaman = $item->manage_customer->loan->where('drop_date', '<=', $item->drop_date)->where('status', 'success')->count();

        $data = [
          'tanggal_drop' => $item->drop_date,
          'nama' => $item->customer->nama,
          'alamat' => $item->customer->alamat,
          'nomor_anggota' => $item->manage_customer->nomor_anggota,

          'status_pinjaman' => AppHelper::status_pinjaman($item->loan_instalment->first()?->status),

          // ini status lunas
          // Pecahan MACET LAMA (Input ML): tanpa tanda lunas & besar pinjaman (mas 2026-10-26).
          'pecahan_ml' => \App\Helpers\PecahanMacetLama::adalah($item->notes),
          'lunas' => $saldo <= 0 && !\App\Helpers\PecahanMacetLama::adalah($item->notes),
          // Keluar target per akhir bulan terpilih (lingkaran merah di No Ang).
          'keluar_target' => self::keluarTarget($item, $transaction_date->format('Y-m-d')),
          'pinjaman_ke' => $countPinjaman,
          'dari_pelunasan' => (bool) $item->previous_loan_id,
          'is_nasabah_lama' => (bool) $item->previous_loan_id || ($countPinjaman > 1),
          'drop' => $item->nominal_drop,
          'pinjaman' => $item->pinjaman,
          'hari' => $item->hari,
          'nik' => $item->customer->nik,
          'kelompok' => $item->loan_officer_grouping->kelompok,
          'jumlah_angsuran' => $item->loan_instalment->count(),
          'id' => $item->id,
          'instalment' => $item->loan_instalment->groupBy(function ($instalment) {
            return Carbon::parse($instalment->transaction_date)->format('Y-m-d');
          })->map(function ($instalments) {
            return [
              'total_nominal' => $instalments->sum('nominal'),
              'is_active' => $instalments->contains(function ($instalment) {
                return $instalment['danatitipan'] == true;  // Cek apakah ada 'isactive' yang true
              }),
              // Dibayar lewat transfer (label TF di buku angsuran HP).
              'is_transfer' => $instalments->contains(fn($instalment) => (bool) $instalment['is_transfer'])
            ];
          }),
          'angs_today' => $item->loan_instalment->where('transaction_date', $tanggalSeleksi)?->sum('nominal') ?? 0,
          'pemutihan_today' => $pemutihan,
          'pemutihanThisMonth' => $pemutihan_this_month,
          'x_angs' => $item->loan_instalment->count(),
          'saldo_sebelumnya' => $saldoAwalF8[$item->id]['saldo'],
          // Angsuran per bulan SEBELUM bulan terpilih (Y-m => total) - dibuka di
          // tabel lewat tombol rinci di samping Saldo Sebelumnya, untuk melacak selisih.
          'per_bulan' => $item->loan_instalment
            ->where('transaction_date', '<', $transaction_start_date->format('Y-m-d'))
            ->groupBy(fn($i) => Carbon::parse($i->transaction_date)->format('Y-m'))
            ->map(fn($g) => (int) $g->sum('nominal')),
          'md_per_bulan' => $mdPerBulan->get($item->id, collect()),
          'saldo' => $saldo,
          'notes' => $item->notes
        ];

        if ($dailyView) {
          $data['angsuran'] = $item->loan_instalment->sum('nominal');
          $data['is_paid'] = $item->loan_instalment->where('transaction_date', $tanggalSeleksi)->isNotEmpty() || $item->white_off?->transaction_date == $tanggalSeleksi;
        } else {
          $data['angsuran'] = $item->loan_instalment->whereBetween('transaction_date', [$transaction_start_date->format('Y-m-d'), $transaction_date->format('Y-m-d')])->sum('nominal');
        }

        return $data;
      })->sortBy('nama')->sortBy('tanggal_drop')->values(),
    ];
    // dd($dataMlGenerate);

    $groupByMonth = $loan->map(function ($item, $key) use ($transaction_date, $transaction_start_date, $tanggalSeleksi, $dailyView, $saldoF8, $saldoAwalF8, $mdPerBulan) {
      return [
        'month' => Carbon::parse($key)->format('FY'),
        'type' => AppHelper::generateStatusAngsuranString2(Carbon::parse($key)->startOfMonth()->format('Y-m-d'), $transaction_date->format('Y-m-d')),
        'type2' => AppHelper::generateStatusAngsuranString(Carbon::parse($key)->startOfMonth()->format('Y-m-d'), $transaction_date->format('Y-m-d')),
        'date' => Carbon::parse($key)->startOfMonth()->format('Y-m-d'),
        'data' => $item->map(function ($item) use ($transaction_start_date, $transaction_date, $tanggalSeleksi, $dailyView, $saldoF8, $saldoAwalF8, $mdPerBulan) {
          $pemutihan = $item->white_off?->transaction_date == $tanggalSeleksi ? $item->white_off->nominal : 0;

          $pemutihan_before_month = $item->white_off ? ($item->white_off->transaction_date < $transaction_start_date->format('Y-m-d') ? $item->white_off->nominal : 0) : 0;
          $pemutihan_this_month = $item->white_off ? (Carbon::parse($item->white_off->transaction_date)->format('Y-m') == $transaction_date->format('Y-m') ? $item->white_off->nominal : 0) : 0;
          $saldo = $saldoF8[$item->id]['saldo'];

          $countPinjaman = $item->manage_customer->loan->where('drop_date', '<=', $item->drop_date)->where('status', 'success')->count();

          $data = [
            'tanggal_drop' => $item->drop_date,
            'nama' => $item->customer->nama,
            'alamat' => $item->customer->alamat,
            'nomor_anggota' => $item->manage_customer->nomor_anggota,

            'status_pinjaman' => AppHelper::status_pinjaman($item->loan_instalment->first()?->status),
            // ini adalah status lunas
            // Pecahan MACET LAMA (Input ML): tanpa tanda lunas & besar pinjaman (mas 2026-10-26).
          'pecahan_ml' => \App\Helpers\PecahanMacetLama::adalah($item->notes),
          'lunas' => $saldo <= 0 && !\App\Helpers\PecahanMacetLama::adalah($item->notes),
            // Keluar target per akhir bulan terpilih (lingkaran merah di No Ang).
            'keluar_target' => self::keluarTarget($item, $transaction_date->format('Y-m-d')),
            'pinjaman_ke' => $countPinjaman,
            'dari_pelunasan' => (bool) $item->previous_loan_id,
            'is_nasabah_lama' => (bool) $item->previous_loan_id || ($countPinjaman > 1),
            'drop' => $item->nominal_drop,
            'pinjaman' => $item->pinjaman,
            'hari' => $item->hari,
            'nik' => $item->customer->nik,
            'kelompok' => $item->loan_officer_grouping->kelompok,
            'jumlah_angsuran' => $item->loan_instalment->count(),
            'id' => $item->id,
            'instalment' => $item->loan_instalment->groupBy(function ($instalment) {
              return Carbon::parse($instalment->transaction_date)->format('Y-m-d');
            })->map(function ($instalments) {
              return [
                'total_nominal' => $instalments->sum('nominal'),
                'is_active' => $instalments->contains(function ($instalment) {
                  return $instalment['danatitipan'] == true;  // Cek apakah ada 'isactive' yang true
                }),
                // Dibayar lewat transfer (label TF di buku angsuran HP).
                'is_transfer' => $instalments->contains(fn($instalment) => (bool) $instalment['is_transfer'])
              ];
            }),
            'angs_today' => $item->loan_instalment->where('transaction_date', $tanggalSeleksi)?->sum('nominal') ?? 0,
            'pemutihan_today' => $pemutihan,
            'pemutihanThisMonth' => $pemutihan_this_month,
            'x_angs' => $item->loan_instalment->count(),
            'saldo_sebelumnya' => $saldoAwalF8[$item->id]['saldo'],
            // Angsuran per bulan SEBELUM bulan terpilih (Y-m => total) - dibuka di
            // tabel lewat tombol rinci di samping Saldo Sebelumnya, untuk melacak selisih.
            'per_bulan' => $item->loan_instalment
              ->where('transaction_date', '<', $transaction_start_date->format('Y-m-d'))
              ->groupBy(fn($i) => Carbon::parse($i->transaction_date)->format('Y-m'))
              ->map(fn($g) => (int) $g->sum('nominal')),
            'md_per_bulan' => $mdPerBulan->get($item->id, collect()),
            'saldo' => $saldo,
            'notes' => $item->notes
          ];


          if ($dailyView) {
            $data['angsuran'] = $item->loan_instalment->sum('nominal');
            $data['is_paid'] = $item->loan_instalment->where('transaction_date', $tanggalSeleksi)->isNotEmpty() ||  $item->white_off?->transaction_date == $tanggalSeleksi;
          } else {
            $data['angsuran'] = $item->loan_instalment->whereBetween('transaction_date', [$transaction_start_date->format('Y-m-d'), $transaction_date->format('Y-m-d')])->sum('nominal');
          }

          return $data;
        })->sortBy('nama')->sortBy('tanggal_drop')->values(),
      ];
    })->values();

    // ddd($groupByMonth);

    $mergedData = collect([$dataMlGenerate])->merge($groupByMonth)->values();

    $dateOfWeek = [];
    for ($date = $transaction_start_date; $date->lte($transaction_date); $date->addDay()) {
      if (AppHelper::dateName($date) == $hari) {
        $dateOfWeek[] = $date->copy()->format('Y-m-d');
      }
    }
    return [
      'datas' => $mergedData,
      'dateOfWeek' => $dateOfWeek,
      'sirkulasi' => $transactionSirkulan,
      'tutup_buku' => $tutupBuku,
      'server_filter' => [
        'closed_transaction' => $ClosedTransaction,
        'month' => $transaction_date->format('Y-m'),
        'hari' => $hari,
        'wilayah' => $wilayah,
        'branch' => $userAuthorized['branches'],
        'userAuthorized' => $userAuthorized,
        'branch_id' => $branch_id,
        'kelompok' => $kelompok,
        'groupId' => $groupingId->id,
        'today' => $dayClosedParams
      ],
    ];
  }
  /**
   * Keluar target per tanggal: sudah dicap keluar (out_date) sampai tanggal itu,
   * ATAU embernya MB/ML (aturan BHT: masuk MB = keluar target). Penanda BHT di
   * database belum dibangun, jadi MB/ML diturunkan dari ember.
   */
  private static function keluarTarget($loan, string $tanggal): bool
  {
    return ($loan->out_date && $loan->out_date <= $tanggal)
      || in_array(\App\Helpers\Ember::dari($loan->drop_date, $tanggal), [\App\Helpers\Ember::MB, \App\Helpers\Ember::ML], true);
  }

  // $hanyaMl: menu ML (Angsuran Lancar versi ML) - hanya grup ML, berisi SEMUA
  // pinjaman ML yang belum lunas sebelum tanggal terpilih (bukan cuma yang
  // bayar bulan ini).
  public function getLoanMantri(Request $request, $dailyView = true, $hanyaMl = false)
  {

    // Filter menu angsuran kini berbasis TANGGAL, bukan nama hari + bulan.
    // Bawaannya hari ini, dimundurkan ke hari kerja terakhir kalau hari ini
    // libur. Dulu $tanggalSeleksi dihitung dari NAMA HARI lewat
    // getStortingShowDate(), yang mundur SATU langkah tanpa peduli hari libur —
    // sehingga kelompok Senin yang dibuka Selasa 18 Agu menunjuk 17 Agu
    // (Kemerdekaan) dan SELURUH nasabah tampak nunggak.
    $date = $request->date ?? null;
    if (!$date) {
      $cursor = Carbon::today();
      for ($i = 0; $i < 14 && !\App\Models\WorkDay::hariKerja($cursor); $i++) {
        $cursor->subDay();
      }
      $date = $cursor->format('Y-m-d');
    }
    $request->merge([
      'date' => $date,
      'month' => Carbon::parse($date)->format('Y-m'),
      'hari' => AppHelper::dateName($date),
    ]);


    $now = Carbon::now();
    // Jendela ikut BULAN TANGGAL TERPILIH, bukan bulan hari ini: membuka tanggal
    // lampau harus menampilkan keadaan saat itu (ember, saldo awal, kunci).
    $transaction_date = Carbon::parse($date)->endOfMonth();
    $transaction_start_date = $transaction_date->copy()->startOfMonth();
    $begin_transaction = $transaction_date->copy()->startOfMonth()->subMonthNoOverflow(4);

    $hari = AppHelper::hariTagih($request->hari);

    // Tanggal terpilih dipakai LANGSUNG — tidak lagi diturunkan dari nama hari.
    $tanggalSeleksi = $date;

    $scope = \App\Helpers\AuthScope::resolve();
    $branch_id = $scope->branch_id;
    $wilayah = $scope->wilayah;
    $kelompok = $scope->kelompok;
    $authorized = $scope->user;
    $userAuthorized = AppHelper::branch_permission($authorized, $branch_id);



    $groupingId = AppHelper::kelompokAktif($branch_id, $kelompok);

    // Koleksi harian ikut hari EFEKTIF: mutasi yang berlaku pada bulan tanggal
    // terpilih memindahkan nasabah ke hari/kelompok barunya. Mayoritas tetap
    // lewat indeks (grouping,hari); yang pindah ditambal daftar ID kecil.
    $refMutasi = Carbon::parse($tanggalSeleksi)->startOfMonth()->toDateString();
    $mut = \App\Helpers\Mutasi::penyesuaianBaca($groupingId->id, $hari, $refMutasi);
    $filterEfektif = function ($q) use ($groupingId, $hari, $mut) {
      $q->where(function ($qq) use ($groupingId, $hari, $mut) {
        $qq->where('transaction_loan_officer_grouping_id', $groupingId->id)->where('hari', $hari);
        if ($mut['keluar']) {
          $qq->whereNotIn('id', $mut['keluar']);
        }
      });
      if ($mut['masuk']) {
        $q->orWhereIn('id', $mut['masuk']);
      }
    };

    // GERBANG alur baru: kantor migrasi membaca status kunci & saldo awal dari
    // daily_closings / monthly_closings. Untuk kantor belum-migrasi -> jalur
    // lama, IDENTIK dengan sebelumnya.
    $migrasi = \App\Helpers\AgregasiScope::pakaiAgregatBaru($branch_id, $transaction_start_date);

    // Status kunci & libur untuk tanggal terpilih — dipakai frontend untuk
    // mematikan input. "Kunci" = kasir kunci; kepala cek = pengecekan. Di alur
    // baru itu kasir_lock_at / kepala_approval_at pada daily_closings.
    if ($migrasi) {
      $closingTanggal = \App\Models\TransactionDailyClosing::where('transaction_loan_officer_grouping_id', $groupingId->id)
        ->whereDate('date', $tanggalSeleksi)
        ->first();
      $isLocked = $closingTanggal?->kasir_lock_at !== null;
      $isKepalaApproved = $closingTanggal?->kepala_approval_at !== null;
    } else {
      $rekapTanggal = TransactionDailyRecap::where('transaction_loan_officer_grouping_id', $groupingId->id)
        ->whereDate('date', $tanggalSeleksi)
        ->first();
      $isLocked = $rekapTanggal?->daily_kasir_approval !== null;
      $isKepalaApproved = $rekapTanggal?->daily_kepala_approval !== null;
    }
    $hariKerjaTerpilih = \App\Models\WorkDay::hariKerja($tanggalSeleksi);
    $liburTerpilih = \App\Models\WorkDay::whereDate('date', $tanggalSeleksi)->first();

    $hariIni = AppHelper::dateName(Carbon::now()) == $hari;
    $lastDayOfThisWeek = Carbon::now()->previous(AppHelper::getNumbDays($hari))->format('Y-m-d');
    $dayClosedParams = $hariIni ? Carbon::now()->format('Y-m-d') : $lastDayOfThisWeek;
    $ClosedTransaction = AppHelper::get_closed_date($dayClosedParams);

    // Saldo awal (satu baris grup+hari+bulan). Migrasi: dari monthly_closings
    // awal_*, dipetakan ke nama kolom sirkulasi lama yang dibaca frontend
    // (amount/cm_amount/mb_amount/ml_amount di ApprovalAkhir.jsx).
    if ($migrasi) {
      $mc = \App\Models\TransactionMonthlyClosing::where('transaction_loan_officer_grouping_id', $groupingId->id)
        ->where('hari', $hari)
        ->whereDate('periode', $transaction_start_date->format('Y-m-d'))
        ->first();
      $transactionSirkulan = $mc ? (object) [
        'amount' => (int) $mc->awal_total,
        'cm_amount' => (int) $mc->awal_cm,
        'mb_amount' => (int) $mc->awal_mb,
        'ml_amount' => (int) $mc->awal_ml,
      ] : null;
    } else {
      $transactionSirkulan = TransactionSirculation::where('transaction_loan_officer_grouping_id', $groupingId->id)
        ->where('day', $hari)
        ->where('date', $transaction_start_date->format('Y-m-d'))
        ->first();
    }
    // dd($transaction_date);
    $loan = TransactionLoan::with(
      ['loan_instalment' => fn($q) => $q->where('transaction_date', $tanggalSeleksi), 'manage_customer', 'customer', 'white_off']
    )
      ->when($hanyaMl, fn($q) => $q->whereRaw('1 = 0'))
      // Pinjaman yang di-drop SESUDAH tanggal terpilih belum ada pada tanggal itu.
      ->whereBetween('drop_date', [$begin_transaction, $tanggalSeleksi])
      ->where($filterEfektif)
      ->where('status', 'success')
      ->orderBy('drop_date')
      ->get()
      ->groupBy(function ($item) {
        return Carbon::parse($item->drop_date)->format('Y-m');
      });
    // dd($loan);

    $loanMl = TransactionLoan::with(
      ['loan_instalment' => fn($q) => $q->where('transaction_date', $tanggalSeleksi), 'manage_customer', 'customer', 'white_off']
    )
      ->where('drop_date', "<", $begin_transaction->format('Y-m-d'))
      ->where($filterEfektif)
      // Angsuran Lancar: ML hanya yang bayar bulan ini. Menu ML: semua yang
      // belum lunas sebelum tanggal terpilih (pay_off_date = tanggal lunas;
      // disaring lagi dengan saldo F8 di bawah).
      ->when(!$hanyaMl, fn($q) => $q->whereHas('loan_instalment', function ($query) use ($transaction_start_date, $transaction_date) {
        $query->whereBetween('transaction_date', [$transaction_start_date->format('Y-m-d'), $transaction_date->format('Y-m-d')])
          ->where('nominal', '>', 0);
      }))
      ->when($hanyaMl, fn($q) => $q->where(fn($w) => $w->whereNull('pay_off_date')->orWhere('pay_off_date', '>=', $tanggalSeleksi)))
      ->where('status', 'success')
      ->orderBy('drop_date')
      ->get();

    // F8: saldo per tanggal terpilih, satu rumus dengan rekap (PenyesuaianSaldo).
    $saldoF8 = \App\Helpers\PenyesuaianSaldo::saldoBanyak(
      $loan->collapse()->pluck('id')->merge($loanMl->pluck('id'))->all(),
      $tanggalSeleksi
    );

    if ($hanyaMl) {
      // Lunas SEBELUM tanggal terpilih -> hilang. Yang lunas tepat di tanggal
      // itu (dibayar / diputihkan hari itu) tetap tampil.
      $loanMl = $loanMl->filter(fn($l) => $saldoF8[$l->id]['saldo'] > 0
        || $l->loan_instalment->isNotEmpty()
        || $l->white_off?->transaction_date == $tanggalSeleksi)->values();
    }

    // Ambil riwayat pinjaman sukses per manage customer untuk menentukan pinjaman_ke & nasabah lama
    $manageCustomerIds = $loan->collapse()->pluck('transaction_manage_customer_id')
      ->merge($loanMl->pluck('transaction_manage_customer_id'))
      ->unique()->filter()->values();

    $pinjamanCounts = TransactionLoan::whereIn('transaction_manage_customer_id', $manageCustomerIds)
      ->where('status', 'success')
      ->select('id', 'transaction_manage_customer_id', 'drop_date')
      ->get()
      ->groupBy('transaction_manage_customer_id');

    // Pengurutan nasabah:
    // 1. Tanggal drop
    // 2. Nasabah lama dulu / pelunasan
    // 3. Urut per nomor anggota (punya no anggota duluan, urut numerik kecil ke besar)
    // 4. Nasabah baru
    // 5. Urut per nomor anggota
    // Seri pemutus: nama A-Z.
    $sortRows = function ($collection) {
      return $collection->sort(function ($a, $b) {
        $cmpDrop = strcmp($a['tanggal_drop'] ?? '', $b['tanggal_drop'] ?? '');
        if ($cmpDrop !== 0) return $cmpDrop;

        $isLamaA = !empty($a['is_nasabah_lama']) || !empty($a['dari_pelunasan']) || (($a['pinjaman_ke'] ?? 0) > 1);
        $isLamaB = !empty($b['is_nasabah_lama']) || !empty($b['dari_pelunasan']) || (($b['pinjaman_ke'] ?? 0) > 1);
        if ($isLamaA !== $isLamaB) {
          return $isLamaA ? -1 : 1;
        }

        $hasNoA = !empty($a['nomor_anggota']);
        $hasNoB = !empty($b['nomor_anggota']);
        if ($hasNoA !== $hasNoB) {
          return $hasNoA ? -1 : 1;
        }
        if ($hasNoA && $hasNoB) {
          $cmpNo = strnatcasecmp((string) $a['nomor_anggota'], (string) $b['nomor_anggota']);
          if ($cmpNo !== 0) return $cmpNo;
        }

        return strcasecmp((string) ($a['nama'] ?? ''), (string) ($b['nama'] ?? ''));
      })->values();
    };

    $dataMlGenerate = [
      'month' => "ML",
      'type' => "ml",
      'type2' => "ML",
      'date' => Carbon::parse($begin_transaction)->subMonthNoOverflow(1)->format('Y-m-d'),
      'data' => $sortRows($loanMl->map(function ($item) use ($transaction_start_date, $transaction_date, $tanggalSeleksi, $dailyView, $saldoF8, $pinjamanCounts) {
        $pemutihan = $item->white_off ? $item->white_off->nominal : 0;

        $pemutihan_this_month = $item->white_off ? (Carbon::parse($item->white_off->transaction_date)->format('Y-m') == $transaction_date->format('Y-m') ? $item->white_off->nominal : 0) : 0;
        $saldo = $saldoF8[$item->id]['saldo'];

        $history = $pinjamanCounts->get($item->transaction_manage_customer_id, collect());
        $countPinjaman = $history->filter(fn($h) => $h->drop_date <= $item->drop_date)->count();
        $isLama = (bool) $item->previous_loan_id || $countPinjaman > 1;

        $data = [
          'tanggal_drop' => $item->drop_date,
          'nama' => $item->customer->nama,
          'alamat' => $item->customer->alamat,
          'nomor_anggota' => $item->manage_customer->nomor_anggota,
          'keluar_target' => self::keluarTarget($item, $tanggalSeleksi),
          'drop_baru' => $item->drop_date == $tanggalSeleksi,
          'pinjaman_ke' => $countPinjaman,
          'dari_pelunasan' => (bool) $item->previous_loan_id,
          'is_nasabah_lama' => $isLama,

          'status_pinjaman' => AppHelper::status_pinjaman($item->loan_instalment->first()?->status),

          // ini status lunas
          // Pecahan MACET LAMA (Input ML): tanpa tanda lunas & besar pinjaman (mas 2026-10-26).
          'pecahan_ml' => \App\Helpers\PecahanMacetLama::adalah($item->notes),
          'lunas' => $saldo <= 0 && !\App\Helpers\PecahanMacetLama::adalah($item->notes),
          'drop' => $item->nominal_drop,
          'pinjaman' => $item->pinjaman,
          'hari' => $item->hari,
          'nik' => $item->customer->nik,
          'id' => $item->id,

          'angs_today' => $item->loan_instalment?->sum('nominal') ?? 0,
          'instalment' => $item->loan_instalment->groupBy(function ($instalment) {
            return Carbon::parse($instalment->transaction_date)->format('Y-m-d');
          })->map(function ($instalments) {
            return [
              'total_nominal' => $instalments->sum('nominal'),
              'is_active' => $instalments->contains(function ($instalment) {
                return $instalment['danatitipan'] == true;  // Cek apakah ada 'isactive' yang true
              }),
              // Dibayar lewat transfer (label TF di buku angsuran HP).
              'is_transfer' => $instalments->contains(fn($instalment) => (bool) $instalment['is_transfer'])
            ];
          }),
          'pemutihan_today' => $pemutihan,
          'md_hari_ini' => $item->white_off?->transaction_date == $tanggalSeleksi ? (int) $item->white_off->nominal : 0,
          'pemutihanThisMonth' => $pemutihan_this_month,
          'saldo' => $saldo,
          'notes' => $item->notes
        ];

        if ($dailyView) {
          $data['angsuran'] = $saldoF8[$item->id]['angsuran'];
          $data['is_paid'] = $item->loan_instalment->where('transaction_date', $tanggalSeleksi)->isNotEmpty() || $item->white_off?->transaction_date == $tanggalSeleksi; //
        }

        return $data;
      })),
    ];
    // dd($dataMlGenerate);

    $groupByMonth = $loan->map(function ($item, $key) use ($transaction_date, $transaction_start_date, $tanggalSeleksi, $dailyView, $saldoF8, $pinjamanCounts, $sortRows) {
      return [
        'month' => Carbon::parse($key)->format('FY'),
        'type' => AppHelper::generateStatusAngsuranString2(Carbon::parse($key)->startOfMonth()->format('Y-m-d'), $transaction_date->format('Y-m-d')),
        'type2' => AppHelper::generateStatusAngsuranString(Carbon::parse($key)->startOfMonth()->format('Y-m-d'), $transaction_date->format('Y-m-d')),
        'date' => Carbon::parse($key)->startOfMonth()->format('Y-m-d'),
        'data' => $sortRows($item->map(function ($item) use ($transaction_start_date, $transaction_date, $tanggalSeleksi, $dailyView, $saldoF8, $pinjamanCounts) {
          $pemutihan = $item->white_off ? $item->white_off->nominal : 0;

          $pemutihan_this_month = $item->white_off ? (Carbon::parse($item->white_off->transaction_date)->format('Y-m') == $transaction_date->format('Y-m') ? $item->white_off->nominal : 0) : 0;
          $saldo = $saldoF8[$item->id]['saldo'];

          $history = $pinjamanCounts->get($item->transaction_manage_customer_id, collect());
          $countPinjaman = $history->filter(fn($h) => $h->drop_date <= $item->drop_date)->count();
          $isLama = (bool) $item->previous_loan_id || $countPinjaman > 1;

          $data = [
            'tanggal_drop' => $item->drop_date,
            'nama' => $item->customer->nama,
            'alamat' => $item->customer->alamat,
            'nomor_anggota' => $item->manage_customer->nomor_anggota,
            'keluar_target' => self::keluarTarget($item, $tanggalSeleksi),
            'drop_baru' => $item->drop_date == $tanggalSeleksi,
            'pinjaman_ke' => $countPinjaman,
            'dari_pelunasan' => (bool) $item->previous_loan_id,
            'is_nasabah_lama' => $isLama,

            'status_pinjaman' => AppHelper::status_pinjaman($item->loan_instalment->first()?->status),

            // ini status lunas
            // Pecahan MACET LAMA (Input ML): tanpa tanda lunas & besar pinjaman (mas 2026-10-26).
          'pecahan_ml' => \App\Helpers\PecahanMacetLama::adalah($item->notes),
          'lunas' => $saldo <= 0 && !\App\Helpers\PecahanMacetLama::adalah($item->notes),
            'drop' => $item->nominal_drop,
            'pinjaman' => $item->pinjaman,
            'hari' => $item->hari,
            'nik' => $item->customer->nik,
            'id' => $item->id,

            'angs_today' => $item->loan_instalment?->sum('nominal') ?? 0,
            'instalment' => $item->loan_instalment->groupBy(function ($instalment) {
              return Carbon::parse($instalment->transaction_date)->format('Y-m-d');
            })->map(function ($instalments) {
              return [
                'total_nominal' => $instalments->sum('nominal'),
                'is_active' => $instalments->contains(function ($instalment) {
                  return $instalment['danatitipan'] == true;  // Cek apakah ada 'isactive' yang true
                }),
                // Dibayar lewat transfer (label TF di buku angsuran HP).
                'is_transfer' => $instalments->contains(fn($instalment) => (bool) $instalment['is_transfer'])
              ];
            }),
            'pemutihan_today' => $pemutihan,
            'md_hari_ini' => $item->white_off?->transaction_date == $tanggalSeleksi ? (int) $item->white_off->nominal : 0,
            'pemutihanThisMonth' => $pemutihan_this_month,
            'saldo' => $saldo,
            'notes' => $item->notes
          ];

          if ($dailyView) {
            $data['angsuran'] = $saldoF8[$item->id]['angsuran'];
            $data['is_paid'] = $item->loan_instalment->where('transaction_date', $tanggalSeleksi)->isNotEmpty() || $item->white_off?->transaction_date == $tanggalSeleksi; //
          }

          return $data;
        })),
      ];
    })->values();

    // ddd($groupByMonth);

    $mergedData = $hanyaMl
      ? collect([$dataMlGenerate])
      : collect([$dataMlGenerate])->merge($groupByMonth)->values();

    $dateOfWeek = [$tanggalSeleksi];
    // for ($date = $transaction_start_date; $date->lte($transaction_date); $date->addDay()) {
    //   if (AppHelper::dateName($date) == $hari) {
    //     $dateOfWeek[] = $date->copy()->format('Y-m-d');
    //   }
    // }
    return [
      'datas' => $mergedData,
      'dateOfWeek' => $dateOfWeek,
      'sirkulasi' => $transactionSirkulan,
      'server_filter' => [
        'closed_transaction' => $ClosedTransaction,
        'month' => $transaction_date->format('Y-m'),
        'hari' => $hari,
        'tanggal' => $tanggalSeleksi,
        // can-edit / superuser: tetap bisa mengubah - kunci dibuka otomatis.
        'is_locked' => $isLocked && !\App\Helpers\Gembok::bolehBuka(auth()->user()),
        'koreksi_kunci' => $isLocked && \App\Helpers\Gembok::bolehBuka(auth()->user()),
        'is_kepala_approved' => $isKepalaApproved,
        'is_libur' => !$hariKerjaTerpilih,
        'libur_alasan' => $hariKerjaTerpilih ? null : ($liburTerpilih?->keterangan ?? 'Hari libur'),
        'wilayah' => $wilayah,
        'branch' => $userAuthorized['branches'],
        'userAuthorized' => $userAuthorized,
        'branch_id' => $branch_id,
        'kelompok' => $kelompok,
        'groupId' => $groupingId->id,
        'today' => $dayClosedParams
      ],
    ];
  }

  public static function getLoanByDate(Request $request)
  {
    $transaction_date = Carbon::parse($request->month)->endOfMonth() ?? Carbon::now()->endOfMonth();
    $transaction_start_date = $transaction_date->copy()->startOfMonth();
    $begin_transaction = $transaction_date->copy()->startOfMonth();

    $scope = \App\Helpers\AuthScope::resolve();
    $branch_id = $scope->branch_id;
    $wilayah = $scope->wilayah;
    $kelompok = $scope->kelompok;
    $authorized = $scope->user;
    $userAuthorized = AppHelper::branch_permission($authorized, $branch_id);


    $hari = AppHelper::hariTagih($request->hari);
    // dd($hari);


    $hariIni = AppHelper::dateName(Carbon::now()) == $hari;
    $lastDayOfThisWeek = Carbon::now()->previous(AppHelper::getNumbDays($hari))->format('Y-m-d');
    $dayClosedParams = $hariIni ? Carbon::now()->format('Y-m-d') : $lastDayOfThisWeek;
    $ClosedTransaction = AppHelper::get_closed_date($dayClosedParams);

    $loan = TransactionLoan::with(
      ['loan_instalment' => function ($item) {
        $item->orderByDesc('transaction_date');
      }, 'manage_customer' => function ($item) {
        $item->with('loan');
      }, 'branch', 'customer', 'loan_officer_grouping']
    )
      ->whereBetween('drop_date', [$begin_transaction, $transaction_date->format('Y-m-d')])
      ->where('hari', $hari)
      ->whereHas('branch', function ($branch) use ($branch_id, $kelompok) {
        $branch->where('branch_id', $branch_id)->where('kelompok', $kelompok);
      })
      ->where('status', 'success')
      // Cari nama: substring biasa (LIKE). Sempat dicoba tambah SOUNDEX
      // (toleran typo semacam "azis" -> "Aziz") tapi dibatalkan - SOUNDEX
      // tanpa index berarti full scan tiap kolom nama dihitung ulang per
      // baris, dan bikin indexnya (generated column + index) tidak
      // sepadan untuk sekarang.
      ->when($request->filled('nama'), function ($query) use ($request) {
        $query->whereHas('customer', function ($q) use ($request) {
          $q->where('nama', 'like', '%' . $request->nama . '%');
        });
      })
      ->orderBy('drop_date')
      ->get()
      ->groupBy(function ($item) {
        return Carbon::parse($item->drop_date)->format('Y-m');
      });



    $groupByMonth = $loan->map(function ($item, $key) use ($transaction_date, $transaction_start_date) {
      return [
        'month' => Carbon::parse($key)->format('FY'),
        'date' => Carbon::parse($key)->startOfMonth()->format('Y-m-d'),
        'data' => $item->map(function ($item) use ($transaction_start_date, $transaction_date) {

          return [
            'tanggal_drop' => $item->drop_date,
            'nama' => $item->customer->nama,

            'alamat' => $item->customer->alamat,
            'nomor_anggota' => $item->manage_customer->nomor_anggota,

            'status_pinjaman' => AppHelper::status_pinjaman($item->loan_instalment->first()?->status),
            'lunas' => $item->loan_instalment->sum('nominal') == $item->pinjaman,

            'pinjaman_ke' => $item->manage_customer->loan->where('drop_date', '<=', $item->drop_date)->where('status', 'success')->count(),
            'drop' => $item->nominal_drop,

            'pinjaman' => $item->pinjaman,
            'hari' => $item->hari,

            'nik' => $item->customer->nik,

            'kelompok' => $item->loan_officer_grouping->kelompok,
            'jumlah_angsuran' => $item->loan_instalment->count(),

            'id' => $item->id,
            'instalment' => $item->loan_instalment->groupBy(function ($instalment) {
              return Carbon::parse($instalment->transaction_date)->format('Y-m-d');
            })->map(function ($instalments) {
              return $instalments->sum('nominal');
            }),
            'x_angs' => $item->loan_instalment->count(),
            'angsuran' => $item->loan_instalment->sum('nominal'),

            'saldo' => $item->pinjaman - $item->loan_instalment->sum('nominal'),
            'notes' => $item->notes

          ];
        })->sortBy('nama')->sortBy('tanggal_drop')->values(),
      ];
    })->values();

    return  [
      'datas' => $groupByMonth,
      'select_branch' => auth()->user()->can('view-all-branches'),
      'select_kelompok' => auth()->user()->can('view-all-groups'),
      'server_filter' => [
        'closed_transaction' => $ClosedTransaction,
        'today' => $dayClosedParams,
        'month' => $transaction_date->format('Y-m'),
        'hari' => $hari,
        'wilayah' => $wilayah,
        'branch' => $userAuthorized['branches'],
        'userAuthorized' => $userAuthorized,
        'branch_id' => $branch_id,
        'kelompok' => $kelompok,
        'nama' => $request->nama,
        'searchMonth' => true
      ],
    ];
  }

  public static function getLoanMacet(Request $request, $dailyView = false)
  {
    // Bulan dipilih user (bawaan bulan berjalan). Daftar = pinjaman yang ML
    // di bulan itu dan BELUM lunas di awal bulan itu - yang lunas di tengah /
    // sesudah bulan itu tetap tampil, jadi riwayat bayar ML bisa ditelusuri.
    $transaction_date = Carbon::parse($request->month ?? Carbon::now())->endOfMonth();


    $transaction_start_date = $transaction_date->copy()->startOfMonth();
    $begin_transaction = $transaction_date->copy()->startOfMonth()->subMonthNoOverflow(4);


    // DIPERBAIKI 2026-08-05: sebelumnya pakai auth()->user()->can('can show
    // branch'/'can show kelompok') - dua nama itu GHOST, tidak pernah ada di
    // tabel permissions (can() diam-diam selalu false untuk ability yang tak
    // dikenal, beda dari hasPermissionTo() yang melempar exception). Efeknya
    // SEMUA user selalu jatuh ke cabang else: $authorized->employee->area.
    // Untuk role tanpa area spesifik (pimpinan dkk, area=0) itu bukan
    // kelompok yang valid, jadi $groupingId di bawah jadi null dan
    // ->id di baris berikutnya bikin 500 ("Attempt to read property on
    // null"). Disamakan dengan getLoanByDate() (fungsi tetangga di file
    // ini) yang sudah benar pakai AuthScope::resolve().
    $scope = \App\Helpers\AuthScope::resolve();
    $branch_id = $scope->branch_id;
    $wilayah = $scope->wilayah;
    $kelompok = $scope->kelompok;
    $authorized = $scope->user;
    $userAuthorized = AppHelper::branch_permission($authorized, $branch_id);


    $hari = AppHelper::hariTagih($request->hari);
    $tanggalSeleksi = AppHelper::getStortingShowDate($hari);
    $groupingId = AppHelper::kelompokAktif($branch_id, $kelompok);
    $onlineDate = Carbon::parse(OnlineBranch::where('branch_id', $branch_id)->first()?->online_date ?? Carbon::now()->subMonths(4))->subMonth()->endOfMonth()->format('Y-m-d');

    // Macet ikut hari EFEKTIF (lihat getLoanMantri): nasabah yang dipindah
    // muncul di hari barunya. Tanpa mutasi, dua daftar kosong -> tak berubah.
    $refMutasi = $transaction_start_date->copy()->startOfMonth()->toDateString();
    $mut = \App\Helpers\Mutasi::penyesuaianBaca($groupingId->id, $hari, $refMutasi);
    $filterEfektif = function ($q) use ($groupingId, $hari, $mut) {
      $q->where(function ($qq) use ($groupingId, $hari, $mut) {
        $qq->where('transaction_loan_officer_grouping_id', $groupingId->id)->where('hari', $hari);
        if ($mut['keluar']) {
          $qq->whereNotIn('id', $mut['keluar']);
        }
      });
      if ($mut['masuk']) {
        $q->orWhereIn('id', $mut['masuk']);
      }
    };



    $loan = TransactionLoan::with(
      ['loan_instalment' => function ($item) {
        $item->orderByDesc('transaction_date');
      }, 'manage_customer' => function ($item) {
        $item->with('loan');
      }, 'branch', 'customer', 'loan_officer_grouping']
    )
      ->where('drop_date', "<", $begin_transaction)
      ->where($filterEfektif)
      ->where(fn($q) => $q->whereNull('pay_off_date')->orWhere('pay_off_date', '>=', $transaction_start_date->toDateString()))
      ->where('status', 'success')
      // Cari nama: substring biasa (LIKE) - lihat catatan lengkap di
      // getLoanByDate().
      ->when($request->filled('nama'), function ($query) use ($request) {
        $query->whereHas('customer', function ($q) use ($request) {
          $q->where('nama', 'like', '%' . $request->nama . '%');
        });
      })
      ->orderBy('drop_date')
      ->get();

    // F8 di dua titik: akhir bulan sebelumnya dan akhir bulan terpilih.
    $ids = $loan->pluck('id')->all();
    $f8Awal = \App\Helpers\PenyesuaianSaldo::saldoBanyak($ids, $transaction_start_date->copy()->subDay(), $transaction_start_date);
    $f8Akhir = \App\Helpers\PenyesuaianSaldo::saldoBanyak($ids, $transaction_date);
    // Satu daftar ML, tidak disekat per bulan drop.
    $loan = $loan->filter(fn($l) => $f8Awal[$l->id]['saldo'] > 0)
      ->groupBy(fn() => 'ML');

    $hariIni = AppHelper::dateName(Carbon::now()) == $hari;
    $lastDayOfThisWeek = Carbon::now()->previous(AppHelper::getNumbDays($hari))->format('Y-m-d');
    $dayClosedParams = $hariIni ? Carbon::now()->format('Y-m-d') : $lastDayOfThisWeek;
    $ClosedTransaction = AppHelper::get_closed_date($dayClosedParams);


    // dd($dataMlGenerate);

    $groupByMonth = $loan->map(function ($item, $key) use ($transaction_date, $transaction_start_date, $tanggalSeleksi, $f8Awal, $f8Akhir) {
      return [
        'month' => 'ML',
        'type' => 'ml',
        'type2' => 'ML',
        'date' => null,
        'data' => $item->map(function ($item) use ($transaction_start_date, $transaction_date, $tanggalSeleksi, $f8Awal, $f8Akhir) {
          $awal = $f8Awal[$item->id];
          $akhir = $f8Akhir[$item->id];
          return [
            'tanggal_drop' => $item->drop_date,
            'nama' => $item->customer->nama,
            'alamat' => $item->customer->alamat,
            'nomor_anggota' => $item->manage_customer->nomor_anggota,

            'status_pinjaman' => AppHelper::status_pinjaman($item->loan_instalment->first()?->status),
            // Pecahan MACET LAMA (Input ML): tanpa tanda lunas, catatan & besar pinjaman.
            'pecahan_ml' => \App\Helpers\PecahanMacetLama::adalah($item->notes),
            'lunas' => $akhir['saldo'] <= 0 && !\App\Helpers\PecahanMacetLama::adalah($item->notes),
            // Keluar target per akhir bulan terpilih (lingkaran merah di No Ang).
            'keluar_target' => self::keluarTarget($item, $transaction_date->format('Y-m-d')),
            'pinjaman_ke' => $item->manage_customer->loan->where('drop_date', '<=', $item->drop_date)->where('status', 'success')->count(),
            'drop' => $item->nominal_drop,
            'pinjaman' => $item->pinjaman,
            'hari' => $item->hari,
            'nik' => $item->customer->nik,
            'kelompok' => $item->loan_officer_grouping->kelompok,
            'jumlah_angsuran' => $item->loan_instalment->count(),
            'id' => $item->id,
            'instalment' => $item->loan_instalment->groupBy(function ($instalment) {
              return Carbon::parse($instalment->transaction_date)->format('Y-m-d');
            })->map(function ($instalments) {
              return [
                'total_nominal' => $instalments->sum('nominal'),
                'is_active' => $instalments->contains(function ($instalment) {
                  return $instalment['danatitipan'] == true;  // Cek apakah ada 'isactive' yang true
                }),
                // Dibayar lewat transfer (label TF di buku angsuran HP).
                'is_transfer' => $instalments->contains(fn($instalment) => (bool) $instalment['is_transfer'])
              ];
            }),
            'angs_today' => $item->loan_instalment->where('transaction_date', $tanggalSeleksi)?->sum('nominal') ?? 0,
            'x_angs' => $item->loan_instalment->count(),
            // Kolom buku angsuran (sama dengan Angsuran Lancar), semua F8:
            'saldo_sebelumnya' => $awal['saldo'],
            // Angsuran per bulan SEBELUM bulan terpilih (Y-m => total) - dibuka di
            // tabel lewat tombol rinci di samping Saldo Sebelumnya, untuk melacak selisih.
            'per_bulan' => $item->loan_instalment
              ->where('transaction_date', '<', $transaction_start_date->format('Y-m-d'))
              ->groupBy(fn($i) => Carbon::parse($i->transaction_date)->format('Y-m'))
              ->map(fn($g) => (int) $g->sum('nominal')),
            'angsuran' => $akhir['angsuran'] - $awal['angsuran'],
            'pemutihanThisMonth' => $akhir['pemutihan'] - $awal['pemutihan'],
            'saldo' => $akhir['saldo'],
            'notes' => $item->notes
          ];
        })->sortBy('nama')->sortBy('tanggal_drop')->values(),
      ];
    })->values();

    $dateOfWeek = [];
    for ($date = $transaction_start_date; $date->lte($transaction_date); $date->addDay()) {
      if (AppHelper::dateName($date) == $hari) {
        $dateOfWeek[] = $date->copy()->format('Y-m-d');
      }
    }

    return  [
      'datas' => $groupByMonth,
      'dateOfWeek' => $dateOfWeek,
      'select_branch' => auth()->user()->can('view-all-branches'),
      'select_kelompok' => auth()->user()->can('view-all-groups'),
      'server_filter' => [
        'closed_transaction' => $ClosedTransaction,
        'today' => $dayClosedParams,
        'hari' => $hari,
        'wilayah' => $wilayah,
        'branch' => $userAuthorized['branches'],
        'userAuthorized' => $userAuthorized,
        'branch_id' => $branch_id,
        'kelompok' => $kelompok,
        'nama' => $request->nama,
        'type_show' => 'macet',
        'searchMonth' => true,
        'month' => $transaction_date->format('Y-m'),
        'onlineDate' => $onlineDate,
      ],
    ];
  }
}
