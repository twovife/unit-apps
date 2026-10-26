<?php

namespace App\Http\Controllers;

use App\Helpers\AppHelper;
use App\Models\Employee;
use App\Models\TransactionCustomer;
use App\Models\TransactionLoan;
use App\Models\TransactionLoanInstalment;
use App\Models\TransactionLoanOfficerGrouping;
use App\Models\TransactionManageCustomer;
use App\Models\WorkDay;
use App\Rules\HariKerja;
use App\Traits\PinjamanTrait;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class TransactionLoanController extends Controller
{


  use PinjamanTrait;

  /**
   * Perpindahan status pinjaman yang sah (disepakati 2026-10-03). Selain ini
   * ditolak. Keputusan bisa dibalik: acc <-> tolak, success <-> gagal.
   * Kembali ke 'open' hanya lewat Reset (updateEverything), tundaan lewat
   * tundaan_pengajuan.
   */
  private const TRANSISI_STATUS = [
    'open' => ['acc', 'tolak'],
    'acc' => ['tolak', 'success', 'gagal'],
    'tolak' => ['acc'],
    'success' => ['gagal'],
    'gagal' => ['success'],
  ];

  public function fastcreate(Request $request)
  {

    return Inertia::render('BukuTransaksi/Web/BatchUpload');
  }


  // 1
  public function fastcreatev2(Request $request)
  {
    abort_unless(AppHelper::bolehRekapPenuh(auth()->user()), 403, 'Fastcreate bukan untuk mantri.');


    return Inertia::render('BukuTransaksi/Web/FastCreateV2');
  }


  public function inputmacet(Request $request)
  {
    abort_unless(AppHelper::bolehRekapPenuh(auth()->user()), 403, 'Input macet bukan untuk mantri.');


    return Inertia::render('BukuTransaksi/Web/InputMacet');
  }


  public function index_buku_transaksi(Request $request)
  {

    $data = $this->getTransactionLoan($request, true);
    return Inertia::render('BukuTransaksi/Web/TransaksiMantri', $data);
  }

  // JSON drop + rencana satu bulan untuk buku aktif (branch/kelompok dari
  // AuthScope, hari & month dari request). Dipakai layar Buku Transaksi untuk
  // menyambung bulan sebelumnya saat scroll / "Muat bulan sebelumnya" - tanpa
  // reload penuh, dan kedua tab (Buku Transaksi + Rencana Drop) ikut memanjang.
  // Membungkus getTransactionLoan (withPlan=true) supaya satu sumber logika.
  // JSON buku angsuran harian (sama dengan mobile_apps.angsuran) untuk satu
  // tanggal + kelompok - dipakai drawer storting di ACC KM supaya angsuran
  // bisa dibetulkan tanpa pindah halaman.
  public function angsuran_hari(Request $request)
  {
    $request->validate(['date' => ['required', 'date']]);

    return response()->json($this->getLoanMantri($request, true));
  }

  public function drop_bulan(Request $request)
  {
    $data = $this->getTransactionLoan($request, true);
    return response()->json([
      'datas' => $data['datas'],
      'buku_rencana' => $data['buku_rencana'],
    ]);
  }

  // Superuser: paksa materialisasi target auto untuk SATU buku (kelompok + hari
  // di cabang aktif), tanpa nunggu cron `target:auto`. Memanggil service yang
  // SAMA dengan cron (TargetMingguan) - bukan logika kembar. Cabang aktif dari
  // AuthScope; hanya kantor migrasi.
  public function generate_target_auto(Request $request)
  {
    if (!auth()->user()->hasRole('superuser')) {
      return redirect()->back()->withErrors('Hanya superuser yang bisa memaksa generate target.');
    }

    $request->validate([
      'kelompok' => ['required'],
      'hari' => ['required', 'string'],
    ]);

    $branchId = (int) \App\Helpers\AuthScope::getActiveBranchId();

    if (!\App\Helpers\AgregasiScope::sudahMigrasi($branchId)) {
      return redirect()->back()->withErrors('Kantor ini belum migrasi ke alur baru.');
    }

    $grouping = TransactionLoanOfficerGrouping::where('branch_id', $branchId)
      ->where('kelompok', $request->kelompok)->first();
    if (!$grouping) {
      return redirect()->back()->withErrors('Kelompok tidak ditemukan di cabang aktif.');
    }

    $weekday = AppHelper::getNumbDays($request->hari); // Carbon dayOfWeek (senin=1..sabtu=6)
    $jumlah = \App\Helpers\TargetMingguan::materialisasiAuto($grouping->id, $weekday);

    return redirect()->back()->with('message', "Target otomatis dibuat: {$jumlah} baris (kelompok {$request->kelompok}, {$request->hari}).");
  }

  // Cek #1 pimpinan, alur BARU (daily_closings). Pimpinan verifikasi drop &
  // storting hari D benar -> set kepala_approval + keluar (manual), lalu
  // materialisasi target minggu depan (D+7) sebagai 'manual':
  //   target(D+7) = target(D) + drop(D)*0,13 - keluar
  // EVENT, bukan hook rekursif; drop satu sumber (HitungAgregat). Menimpa nilai
  // 'auto' (verifikasi manusia mengalahkan placeholder cron).
  /**
   * Koreksi target / keluar hari D (bulan berjalan), menjalar ke tanggal sesudahnya
   * (AppHelper\KoreksiTarget). Boleh walau hari D sudah dikunci kasir. can-approve
   * selain stafkontrol, kelompok di wilayahnya. GET = pratinjau, POST = simpan.
   */
  private function validasiKoreksiTarget(Request $request): array
  {
    $user = auth()->user();
    abort_unless($user->hasPermissionTo('can-approve') && !$user->hasRole('stafkontrol'), 403, 'Koreksi target butuh izin can-approve.');
    $val = $request->validate([
      'id' => ['required', 'integer'],
      'date' => ['required', 'date'],
      'target' => ['nullable', 'integer', 'min:0'],
      'keluar' => ['nullable', 'integer', 'min:0'],
    ]);
    $grouping = TransactionLoanOfficerGrouping::findOrFail($val['id']);
    abort_unless(AppHelper::bolehAksesKelompok($grouping), 403, AppHelper::PESAN_BUKAN_WILAYAH);

    return $val;
  }

  public function koreksi_target_pratinjau(Request $request)
  {
    $val = $this->validasiKoreksiTarget($request);
    try {
      return response()->json(\App\Helpers\KoreksiTarget::pratinjau((int) $val['id'], $val['date'], $val['target'] ?? null, $val['keluar'] ?? null));
    } catch (\RuntimeException $e) {
      return response()->json(['message' => $e->getMessage()], 422);
    }
  }

  public function koreksi_target(Request $request)
  {
    $val = $this->validasiKoreksiTarget($request);
    $employeeId = (int) auth()->user()->employee->id;

    // Alur lama, hari yang ACC KM-nya otomatis dari TTD kasir (jam KM = jam kasir): simpan
    // dari form = KM sudah cek, jadi ACC KM ditulis ulang atas nama KM (tombol jadi hijau).
    // Tanpa ini form hari terkunci hanya mengoreksi target dan tombol merah selamanya.
    $grouping = TransactionLoanOfficerGrouping::find($val['id']);
    $recap = \App\Helpers\AgregasiScope::sudahMigrasi($grouping->branch_id) ? null
      : \App\Models\TransactionDailyRecap::where('transaction_loan_officer_grouping_id', $grouping->id)->whereDate('date', $val['date'])->first();
    $accKm = $recap?->daily_kepala_approval && (string) $recap->daily_kepala_approval === (string) $recap->daily_kasir_approval;
    $berubah = !$recap || (int) ($val['target'] ?? $recap->target) !== (int) $recap->target
      || (int) ($val['keluar'] ?? $recap->keluar) !== (int) $recap->keluar;

    // ACC ulang hari terkunci (alur lama, mas 2026-10-22): drop yang diinput sesudah ACC ikut
    // masuk (hanya naik). Target diubah -> menjalar (KoreksiTarget, target + masuk - keluar);
    // tidak diubah tapi drop naik -> cukup target minggu depan (ACC per tanggal).
    $dropNaik = $recap ? \App\Helpers\KoreksiTarget::segarkanRekapLama($recap) : false;
    try {
      $hasil = $berubah ? \App\Helpers\KoreksiTarget::simpan((int) $val['id'], $val['date'], $val['target'] ?? null, $val['keluar'] ?? null,
        'Diubah dari form ACC KM (hari terkunci).', $employeeId) : null;
    } catch (\RuntimeException $e) {
      return redirect()->back()->withErrors($e->getMessage());
    }
    if (!$hasil && $dropNaik) {
      \App\Helpers\KoreksiTarget::tulisMingguDepanLama($recap);
    }
    if ($accKm) {
      \App\Models\TransactionDailyRecap::withoutEvents(fn() => $recap->update([
        'daily_kepala_approval' => Carbon::now(),
        'daily_kepala_approval_user' => $employeeId,
      ]));
    }

    return redirect()->back()->with('message', implode(' ', array_filter([
      $accKm ? 'ACC KM dicatat.' : null,
      $dropNaik ? 'Drop rekap diperbarui dari transaksi.' . ($hasil ? '' : ' Target minggu depan dihitung ulang.') : null,
      $hasil ? 'Target dikoreksi; ' . (count($hasil['perubahan']) - 1) . ' tanggal sesudahnya ikut dihitung ulang.' : null,
    ])) ?: 'Tidak ada perubahan.');
  }

  public function ceklist_kepala_baru(Request $request)
  {
    $user = auth()->user();
    if (!$user->hasPermissionTo('can-approve') || $user->hasRole('stafkontrol')) {
      return redirect()->back()->withErrors('Anda tidak punya akses Ceklist Kepala.');
    }

    $request->validate([
      'id' => ['required'],            // grouping id
      'date' => ['required', 'date', 'before_or_equal:today'],
      'keluar' => ['required', 'integer', 'min:0'],
      // Koreksi target hari ini (opsional): memutus rantai di tanggal ini.
      'target_koreksi' => ['nullable', 'integer', 'min:0'],
      'alasan_koreksi' => ['nullable', 'string', 'max:500'],
    ], [
      'date.before_or_equal' => 'Belum harinya — Ceklist Kepala baru bisa pada hari itu atau sesudahnya.',
    ]);

    $groupingId = (int) $request->id;
    $date = Carbon::parse($request->date)->toDateString();

    $grouping = TransactionLoanOfficerGrouping::find($groupingId);
    if (!$grouping || !\App\Helpers\AgregasiScope::sudahMigrasi($grouping->branch_id)) {
      return redirect()->back()->withErrors('Kantor ini belum migrasi ke alur baru.');
    }
    if (!AppHelper::bolehAksesKelompok($grouping)) {
      return redirect()->back()->withErrors(AppHelper::PESAN_BUKAN_WILAYAH);
    }

    // Diperiksa di server, bukan cuma di drawer: drawer bisa memakai data
    // yang sudah basi (mantri menginput sesudah drawer dibuka).
    $gantung = TransactionLoan::where('transaction_loan_officer_grouping_id', $groupingId)
      ->where(fn($q) => $q
        ->where(fn($q) => $q->whereDate('drop_date', $date)->whereIn('status', ['open', 'acc']))
        ->orWhere(fn($q) => $q->whereDate('request_date', $date)->where('status', 'open')))
      ->get(['drop_date', 'request_date', 'status']);
    if ($gantung->isNotEmpty()) {
      $drop = $gantung->filter(fn($l) => Carbon::parse($l->drop_date)->toDateString() === $date && in_array($l->status, ['open', 'acc']))->count();
      $pengajuan = $gantung->count() - $drop;
      return redirect()->back()->withErrors(trim(
        ($drop ? "{$drop} drop hari ini belum diselesaikan mantri (klik SUKSES / GAGAL). " : '')
        . ($pengajuan ? "{$pengajuan} pengajuan hari ini belum diselesaikan KM (klik ACC / TOLAK)." : '')
      ));
    }

    try {
      DB::beginTransaction();

      $closing = \App\Models\TransactionDailyClosing::firstOrCreate([
        'transaction_loan_officer_grouping_id' => $groupingId,
        'date' => $date,
      ]);

      if ($closing->kasir_lock_at) {
        DB::rollBack();
        return redirect()->back()->withErrors('Baris ini sudah dikunci kasir.');
      }

      $targetLama = (int) $closing->target;
      $keluarLama = (int) $closing->keluar;
      $sudahAcc = $closing->kepala_approval_at !== null;

      // Simpan keluar + tanda cek kepala + target minggu depan - logika yang
      // sama dipakai ACC otomatis saat kunci kasir (CeklistKepala).
      $depanDikoreksi = \App\Helpers\CeklistKepala::simpan($closing, (int) $request->keluar, $user->employee->id);

      // Target / keluar diubah di form ACC: koreksi + menjalar ke tanggal sesudahnya.
      \App\Helpers\KoreksiTarget::sesudahAcc($groupingId, $date, $targetLama,
        $request->filled('target_koreksi') ? (int) $request->target_koreksi : $targetLama,
        $keluarLama, (int) $request->keluar, $request->alasan_koreksi, (int) $user->employee->id, $sudahAcc);

      DB::commit();
    } catch (\Illuminate\Database\QueryException $e) {
      DB::rollBack();
      return redirect()->back()->withErrors('Gagal menyimpan cek kepala. Ulangi / hubungi IT.');
    } catch (\RuntimeException $e) {
      // Pesan untuk user dari CeklistKepala (mis. minggu depan sudah dikunci).
      DB::rollBack();
      return redirect()->back()->withErrors($e->getMessage());
    } catch (\Throwable $e) {
      DB::rollBack();
      return redirect()->back()->withErrors('Gagal menyimpan cek kepala. Ulangi / hubungi IT.');
    }

    return redirect()->back()->with('message', !empty($depanDikoreksi)
      ? 'Ceklist Kepala tersimpan; target minggu depan sudah dikoreksi, tidak diubah.'
      : 'Ceklist Kepala tersimpan; target minggu depan diperbarui.');
  }





  // 2

  //  GET NIK FOR AXIOS
  public function nasabah_buku_transaksi(Request $request)
  {
    $prefix = strtoupper(substr($request->nik, 0, 2));

    if ($prefix == "UB" || $prefix == "ML") {
      return response()->json(['data' =>  null, 'return_nik' => $request->nik]);
    }

    // Split riwayat pakai CABANG AKTIF (filter), bukan kantor asal employee.
    // User multi-cabang: kalau filter di Krian 6, "kantor ini" harus rekening
    // Krian 6, bukan kantor asalnya. AuthScope sudah validasi lawan allowed_branches.
    $activeBranchId = (int) \App\Helpers\AuthScope::getActiveBranchId();

    $validate = $request->validate([
      'nik' => ['required', 'digits:16']
    ], [
      'required' => 'Harus Di isi',
      'digits' => 'Angka Harus 16 Digit'
    ]);

    $nasabah = TransactionCustomer::with(
      [
        'manage_customer' => function ($cust) {
          $cust->with([
            'latestTransaction',
            'loan_officer_grouping',
            'branch'
          ])->whereHas('latestTransaction', function ($item) {
            $item->where('status', 'success');
          });
        }
      ]
    )->where('nik', $request->nik)->first();


    $mapingBranch = $nasabah?->manage_customer
      ->groupBy(
        function ($customer) {
          return $customer->loan_officer_grouping->id; // Group by branch ID
        }
      )->map(function ($group) {
        $outDate = $group->first()->latestTransaction->pay_off_date;
        $latestTransaction = $group->first()->latestTransaction;
        return [
          'wilayah' => $group->first()->branch->wilayah,
          'branch_id' => $group->first()->branch->id,
          'branch' => $group->first()->branch->unit,
          'branch2' => $group->first()->branch->unit,
          'kelompok' => $group->first()->loan_officer_grouping->kelompok,
          'kelompok_id' => $group->first()->loan_officer_grouping->kelompok,
          'day' => AppHelper::getNumberToNameDays($group->first()->day),
          'day_num' => $group->first()->day, // buat banding hari presisi di alert crash
          'pinjaman' => $latestTransaction->drop_date,
          'out_date' => $latestTransaction->out_date,
          'lunas' => $outDate ? 'lunas' : 'belum_lunas',
          'status_show' => true,
          'status_id' => $outDate ? AppHelper::generateStatusAngsuran($latestTransaction->drop_date, $outDate) : AppHelper::generateStatusAngsuran($latestTransaction->drop_date, Carbon::now()->format('Y-m-d')),
          'status' => $outDate ? AppHelper::generateStatusAngsuranString($latestTransaction->drop_date, $outDate) : AppHelper::generateStatusAngsuranString($latestTransaction->drop_date, Carbon::now()->format('Y-m-d')),
          // 'tanggal_pinjaman' => $group->loan->latest('drop_date')->drop_date->format('Y-m-d'),
        ];
      });

    // Kantor lain: buka sensor kalau user PUNYA AKSES kantor itu (allowed_branches,
    // null = akses semua). Yang tak berakses tetap '??'. Urutan: kantor berakses
    // di atas (drop terbaru dulu), lalu kantor '??' di bawah.
    $allowedBranches = \App\Models\Branch::getAllowedBranchIds(auth()->user());
    $adaAkses = fn($branchId) => $allowedBranches === null || in_array($branchId, $allowedBranches);
    $urutkan = function ($a, $b) {
      if ($a['punya_akses'] !== $b['punya_akses']) {
        return $a['punya_akses'] ? -1 : 1; // berakses dulu
      }
      return strtotime((string) ($b['pinjaman'] ?? '')) <=> strtotime((string) ($a['pinjaman'] ?? '')); // drop terbaru dulu
    };

    // Prioritaskan domisili nasabah terakhir di cabang aktif (jika ada), fallback ke alamat KTP
    $manageCabang = $nasabah?->manage_customer
      ->where('branch_id', $activeBranchId)
      ->whereNotNull('residential_address')
      ->first();
    $alamatTampil = $manageCabang?->residential_address ?: $nasabah?->alamat;

    $data = $nasabah ?
      [
        'nik' => $nasabah->nik,
        'nama' => $nasabah->nama,
        'alamat' => $alamatTampil,
        'history_branch' => $mapingBranch->filter(function ($item) use ($activeBranchId) {
          return $item['branch_id'] === $activeBranchId;
        })->sortBy('kelompok')->values(),


        'history_lain' => $mapingBranch->filter(function ($item) use ($activeBranchId) {
          return $item['branch_id'] !== $activeBranchId;
        })->sortBy('kelompok')->sortBy('branch2')->sortBy('wilayah')->values(),


        'history_macet_lain' => $mapingBranch->filter(function ($item) use ($activeBranchId) {
          return $item['branch_id'] !== $activeBranchId && $item['status_id'] >= 3;
        })
          ->map(function ($item) use ($adaAkses) {
            $item['punya_akses'] = $adaAkses($item['branch_id']);
            if (!$item['punya_akses']) {
              $item['kelompok'] = '??'; // sensor hanya kalau tak berakses
            }
            return $item;
          })->sort($urutkan)->values(),

        'history_target' => $mapingBranch->filter(function ($item) use ($activeBranchId) {
          return $item['branch_id'] !== $activeBranchId && $item['status_id'] < 3 && $item['lunas'] == 'belum_lunas';
        })
          ->map(function ($item) use ($adaAkses) {
            $item['punya_akses'] = $adaAkses($item['branch_id']);
            if ($item['punya_akses']) {
              $item['status_show'] = true; // kantor berakses: tampilkan status
            } else {
              // sensor kantor tanpa akses
              $item['branch'] = '????';
              $item['kelompok'] = '??';
              $item['status_show'] = false;
            }
            return $item;
          })->sort($urutkan)->values(),


        // $nasabah->manage_customer
        //   ->filter(function ($customer) use ($userEmp) {
        //     return $customer->branch && $customer->branch->id === $userEmp->branch_id;
        //   })
        //   ->groupBy(
        //     function ($customer) {
        //       return $customer->loan_officer_grouping->id; // Group by branch ID
        //     }
        //   )->map(function ($group) {
        //     $outDate = $group->first()->latestTransaction->out_date;
        //     $latestTransaction = $group->first()->latestTransaction;
        //     return [
        //       'branch' => $group->first()->branch->unit,
        //       'kelompok' => $group->first()->loan_officer_grouping->kelompok,
        //       'day' => AppHelper::getNumberToNameDays($group->first()->day),
        //       'pinjaman' => $latestTransaction->drop_date,
        //       'out_date' => $latestTransaction->out_date,
        //       'lunas' => $outDate ? 'lunas' : 'belum_lunas',
        //       'status' => $outDate ? AppHelper::generateStatusAngsuranString($latestTransaction->drop_date, $latestTransaction->out_date) : AppHelper::generateStatusAngsuranString($latestTransaction->drop_date, Carbon::now()->format('Y-m-d')),
        //       // 'tanggal_pinjaman' => $group->loan->latest('drop_date')->drop_date->format('Y-m-d'),
        //     ];
        //   })->sortBy('kelompok')->values(),
        // maping group disini dengan return (transaction_manage_customers.transaction_loan_officer_grouping_id, transaction_manage_customers.day)

        // 'history_lain' => $nasabah->manage_customer
        //   ->filter(function ($customer) use ($userEmp) {
        //     return $customer->branch && $customer->branch->id != $userEmp->branch_id;
        //   })
        //   ->groupBy(
        //     function ($customer) {
        //       return $customer->loan_officer_grouping->id; // Group by branch ID
        //     }
        //   )->map(function ($group, $key) {
        //     $outDate = $group->first()->latestTransaction->out_date;
        //     $latestTransaction = $group->first()->latestTransaction;
        //     return [
        //       'branch' => $group->first()->branch->unit,
        //       'kelompok' => $group->first()->loan_officer_grouping->kelompok,
        //       'day' => AppHelper::getNumberToNameDays($group->first()->day),
        //       'pinjaman' => $latestTransaction->drop_date,
        //       'out_date' => $latestTransaction->out_date,
        //       'lunas' => $outDate ? 'lunas' : 'belum_lunas',
        //       'status' => $outDate ? AppHelper::generateStatusAngsuranString($latestTransaction->drop_date, $latestTransaction->out_date) : AppHelper::generateStatusAngsuranString($latestTransaction->drop_date, Carbon::now()->format('Y-m-d')),
        //       // 'tanggal_pinjaman' => $group->loan->latest('drop_date')->drop_date->format('Y-m-d'),
        //     ];
        //   })->sortBy('branch_id')->sortBy('kelompok')->values(),
        // maping group disini dengan return group per transaction_manage_customers.day total manage_customer


      ] : null;

    return response()->json(['data' => $data ?? null, 'return_nik' => $request->nik]);
  }

  public function get_instalment_nasabah(TransactionLoan $transactionLoan, Request $request)
  {

    $pinjaman = 0;
    $transactionLoan->load(['loan_instalment' => function ($query) {
      $query->orderBy('transaction_date', 'desc');
    }]);

    $instalments = $transactionLoan->loan_instalment;
    $saldo = $pinjaman;

    $sortedInstalments = [];

    foreach ($instalments as $instalment) {
      $sortedInstalments[] = [
        'transaction_date' => $instalment->transaction_date,
        'nominal' => $instalment->nominal,
        'saldo' => $saldo,
        'dana_titipan' => $instalment->danatitipan ? true : false,
        'status' => AppHelper::generateStatusAngsuranString($transactionLoan->drop_date,  $instalment['transaction_date']),
      ];
      $saldo += $instalment->nominal;
    }
    return response()->json(['data' => $sortedInstalments ?? null], 200);
  }


  public function store_buku_transaksi(Request $request)
  {

    if (!auth()->user()->hasPermissionTo('can-create')) {
      return redirect()->back()->withErrors('Anda Tidak Mempunyai Akses Menambahkan');
    }

    $previousUrl = url()->previous();


    $previousRouteName = app('router')->getRoutes()->match(app('request')->create($previousUrl))->getName();
    if (!auth()->user()->hasPermissionTo('can-create')) {
      return redirect()->back()->withErrors('Anda Tidak Mempunyai Akses Menghapus');
    }

    // Aturan tanggal pengajuan (keputusan mas 2026-10-09). Satu-satunya pintu
    // pengajuan biasa (popup Buku Transaksi & mobile); fastcreate / input macet
    // lewat store_buku_transaksi_batch dan tidak terkena aturan ini.
    //   - drop = hari tagih kerja berikutnya sesudah pengajuan (H+7; kalau
    //     libur, minggu sesudahnya) - tidak boleh lebih jauh ke depan;
    //   - atau drop langsung (drop = tanggal pengajuan);
    //   - tanggal drop yang sudah dikunci ditolak (dicek sesudah kelompok
    //     diketahui, di bawah).
    try {
      $tglPengajuan = Carbon::parse($request->request_date)->startOfDay();
      $tglDrop = Carbon::parse($request->tanggal_drop)->startOfDay();
    } catch (\Throwable $e) {
      return redirect()->back()->withErrors('Tanggal pengajuan / drop tidak terbaca.');
    }
    // Berlaku juga untuk can-edit (mas 2026-10-12): pengajuan salah ketik ke
    // tanggal jauh membuat rencana drop KM melenceng.
    $dropSeharusnya = WorkDay::hariSamaBerikutnya($tglPengajuan);
    if (!$tglDrop->equalTo($tglPengajuan) && !($dropSeharusnya && $tglDrop->equalTo($dropSeharusnya))) {
      return redirect()->back()->withErrors(sprintf(
        'Tanggal drop harus %s (hari tagih kerja berikutnya sesudah pengajuan), atau sama dengan tanggal pengajuan untuk drop langsung.',
        $dropSeharusnya ? $dropSeharusnya->locale('id')->isoFormat('D MMMM Y') : '-'
      ));
    }

    $newNik = AppHelper::callUnknownNik($request);
    $request->merge(['nik' => $newNik]);


    $val = $request->validate([
      'isActiveMember' => ['boolean', 'required'],
      'request_nominal' =>  ["required", 'integer', 'min:100000'],
      'nik' => ['required', 'digits:16'],
      // Opsional (mas 2026-10-12): diisi kalau ada, angka saja.
      'nomor_anggota' => ['nullable', 'regex:/^[0-9]+$/', 'max:20'],
      'nama' => ['required_if:isActiveMember,false'],
      'alamat' => ['required_if:isActiveMember,false'],
      // Alamat domisili (mas 2026-10-14): ditulis ke manage_customers
      // (per kelompok/hari), bukan ke alamat identitas TransactionCustomer.
      'residential_address' => ['nullable', 'string', 'max:255'],
      // Hari libur ditolak SELALU (keputusan mas
      // 2026-10-09: tidak ada transaksi sama sekali di hari libur).
      'request_date' => ['required', 'date', 'before_or_equal:today', new HariKerja('Tanggal pengajuan')],
      'tanggal_drop' =>  ['required', 'date', new HariKerja('Tanggal drop')],
    ], [
      'nomor_anggota.regex' => 'Nomor anggota hanya boleh angka.',
      '*.min' => 'minimal diisi 100rb',
      'request_date.before_or_equal' => 'Tanggal pengajuan tidak boleh di masa depan.',
    ]);

    // Permission 'can show kelompok'/'can show branch' tidak pernah ada -> can()
    // selalu false -> dulu SELALU jatuh ke employee->area / employee->branch_id,
    // mengabaikan kelompok yang dipilih & cabang aktif (filter). Untuk user
    // multi-cabang berujung salah kantor / grouping null (fatal).
    // Kelompok: pakai permission asli 'view-all-groups'. Branch: pakai cabang
    // aktif (AuthScope, sama seperti sisi baca) supaya tulis == tampilan.
    $request['kelompok'] = auth()->user()->can('view-all-groups') ? ($request->kelompok ?? 1) : auth()->user()->employee->area;
    $request['branch'] = \App\Helpers\AuthScope::getActiveBranchId();

    try {
      DB::beginTransaction();
      $drop_langsung = $request->request_date == $request->tanggal_drop;

      $customer = TransactionCustomer::firstorCreate(['nik' => $request->nik], ['nama' => $request->nama, 'alamat' => $request->alamat]);
      $officerGrouping = TransactionLoanOfficerGrouping::where('branch_id', $request->branch)->where('kelompok', $request->kelompok)->first();
      // Grouping bisa null kalau kelompok tak ada di cabang aktif (mis. area 0).
      // Tolak dengan pesan, bukan biarkan $officerGrouping->id fatal 500.
      if (!$officerGrouping) {
        DB::rollBack();
        return redirect()->back()->withErrors('Kelompok ' . $request->kelompok . ' tidak ada di cabang ini. Tidak bisa input pengajuan.');
      }
      if (AppHelper::tanggalTerkunci($officerGrouping->id, $tglDrop)) {
        DB::rollBack();
        return redirect()->back()->withErrors('Tanggal drop ' . $tglDrop->locale('id')->isoFormat('D MMMM Y') . ' sudah dikunci. Tidak bisa input pengajuan di tanggal itu.');
      }
      $manage =  $customer->manage_customer()->firstOrCreate(['transaction_loan_officer_grouping_id' => $officerGrouping->id, 'day' => Carbon::parse($request->tanggal_drop)->dayOfWeek]);
      // Nomor anggota melekat ke rekening (kelompok+hari), sama seperti store_pengajuan_lama.
      if ($request->filled('nomor_anggota')) {
        $manage->update(['nomor_anggota' => $request->nomor_anggota]);
      }
      // 1 Kolom Alamat:
      // - Nasabah baru: firstOrCreate di atas otomatis menyimpan alamat ke tabel `transaction_customers.alamat`.
      //   Kemudian di sini otomatis disimpan juga ke tabel `transaction_manage_customers.residential_address` (2 tabel terisi).
      // - Nasabah lama: jika alamat diubah/ditimpa, HANYA disimpan ke `transaction_manage_customers.residential_address` (customer grouping tok).
      //   Tabel master `transaction_customers.alamat` tidak disentuh / tidak diubah.
      $alamatInput = trim((string) ($request->input('alamat') ?: $request->input('residential_address')));
      if ($alamatInput !== '') {
        $manage->update(['residential_address' => $alamatInput]);
      }

      // drop_before hanya bermakna untuk topup (punya previous_loan_id), diisi
      // di store_pengajuan_lama dari nominal_drop pinjaman lama. Create biasa
      // bukan topup -> selalu 0, tak peduli drop langsung atau rekening lama.
      $request['drop_before'] = 0;

      // user_input = yang mengetik; user_mantri/user_drop = getMantri (seragam,
      // bisa null kalau kelompok tanpa mantri aktif & bukan mantri/KM/pimpinan).
      $userInput = auth()->user()->employee->id;
      $mantri = AppHelper::getMantri($officerGrouping);

      $loan = $manage->loan()->create([
        'transaction_loan_officer_grouping_id' => $officerGrouping->id,
        'request_date' => $request->request_date,
        'user_mantri' => $mantri,
        'drop_date' => $request->tanggal_drop,
        'hari' => AppHelper::dateName($request->tanggal_drop),
        'status' => "open",
        'user_input' => $userInput,

        'drop_before' => $request['drop_before'],
        'request_nominal' => $request->request_nominal,
      ]);


      if ($drop_langsung) {
        $loan->update([
          'user_drop' => $mantri,
          'status' => "success",
          'nominal_drop' => $request->request_nominal,
          'request_nominal' => null,
        ]);
      }

      DB::commit();
    } catch (Exception $exception) {
      DB::rollBack();
      return redirect()->back()->withErrors($exception->getMessage());
    }

    if ($previousRouteName == "mobile_apps.create") {
      // mobile_apps.transaksi sudah dihapus -> masuk ke layar transaksi web.
      return redirect()->route('transaction.index_buku_transaksi', ['kelompok' => $officerGrouping->kelompok]);
    }
    return redirect()->back()->with('message', 'Berhasil Menambahkan Pengajuan');
  }


  // store for batch Transksi
  public function store_buku_transaksi_batch(Request $request)
  {
    abort_unless(AppHelper::bolehRekapPenuh(auth()->user()), 403, 'Fastcreate bukan untuk mantri.');
    // dd($request->all());
    if (!auth()->user()->hasPermissionTo('can-create')) {
      return redirect()->back()->withErrors('Anda Tidak Mempunyai Akses Menambahkan');
    }

    // if (AppHelper::dateName($request->request_date) !== AppHelper::dateName($request->tanggal_drop)) {
    //   return redirect()->back()->withErrors('Hari Tidak Sama');
    // }

    // `bebas` (fastcreate) melewati cek tanggal ketat untuk sementara.
    $bebas = $request->boolean('bebas');

    // Input Macet dimatikan untuk kantor yang sudah migrasi (mas 2026-10-12).
    if ($request->boolean('macet') && \App\Helpers\AgregasiScope::sudahMigrasi(\App\Helpers\AuthScope::getActiveBranchId())) {
      return redirect()->back()->withErrors('Input Macet tidak tersedia untuk kantor yang sudah migrasi.');
    }

    if (!$bebas && AppHelper::dateName($request->tanggal_drop) === 'minggu') {
      return redirect()->back()->withErrors('Tidak bisa input transaksi untuk hari Minggu');
    }

    $angsuran = collect($request->angsuran)->sortBy('transaction_date')->values();

    $newNik = AppHelper::callUnknownNik($request);
    $request->merge(['nik' => $newNik]);


    $val = $request->validate([
      'isActiveMember' => ['boolean', 'required'],
      'nik' => ['required', 'digits:16'],

      'request_nominal' =>  ["required", 'integer', 'min:100000'],
      'kelompok' => ['required'],
      // Opsional (mas 2026-10-12): diisi kalau ada, angka saja.
      'nomor_anggota' => ['nullable', 'regex:/^[0-9]+$/', 'max:20'],

      'nama' => ['required_if:isActiveMember,false'],
      'alamat' => ['required_if:isActiveMember,false'],

      // Fastcreate / input macet langsung jadi pinjaman success: drop tidak
      // mungkin di masa depan (mas 2026-10-12).
      'tanggal_drop' =>  ['required', 'date', 'before_or_equal:today', new HariKerja('Tanggal drop')],
    ], [
      'nomor_anggota.regex' => 'Nomor anggota hanya boleh angka.',
      'tanggal_drop.before_or_equal' => 'Tanggal drop tidak boleh di masa depan.',
      '*.required' => "Wajib Diisi",
      '*.min' => 'minimal diisi 100rb'

    ]);


    // validasi tambahan jika angsuran ada
    if (!$angsuran->isEmpty()) {
      $dateToocheck = AppHelper::dateName($request->tanggal_drop);

      $filtered = $angsuran->filter(function ($item) use ($dateToocheck) {
        return AppHelper::dateName($item['transaction_date']) !== $dateToocheck;
      }); // mencari apakah hari sama dengan tanggal drop

      $groupedByDate = $angsuran->groupBy('transaction_date');
      $duplicates = $groupedByDate->filter(function ($group) {
        return $group->count() > 1; // Mencari grup dengan lebih dari satu item
      });


      if (!$bebas && $filtered->isNotEmpty()) {
        return redirect()->back()->withErrors('Hari Angsuran Tidak Sama');
      }

      // Angsuran di sini divalidasi manual, bukan lewat $request->validate(),
      // jadi Rule HariKerja tidak ikut jalan sendiri. Diperiksa di sini supaya
      // pintu ini tidak jadi satu-satunya yang menerima tanggal libur.
      $libur = $angsuran->reject(fn($item) => WorkDay::hariKerja($item['transaction_date']));

      if ($libur->isNotEmpty()) {
        return redirect()->back()->withErrors(sprintf(
          'Ada %d angsuran jatuh pada hari libur: %s.',
          $libur->count(),
          $libur->pluck('transaction_date')->unique()->implode(', ')
        ));
      }

      if ($duplicates->isNotEmpty()) {
        return redirect()->back()->withErrors('Ada angsuran yang duplikat pada tanggal yang sama.');
      }

      if ($angsuran->sum('nominal') > ($request->request_nominal * 1.3)) {
        return redirect()->back()->withErrors('Tidak Boleh Minus');
      }
    }


    // Sama seperti store_buku_transaksi: permission lama fiktif. Pakai
    // 'view-all-groups' untuk kelompok, AuthScope untuk cabang aktif.
    $request['kelompok'] = auth()->user()->can('view-all-groups') ? $request->kelompok : auth()->user()->employee->area;
    $request['branch'] = \App\Helpers\AuthScope::getActiveBranchId();

    try {


      DB::beginTransaction();
      $drop_langsung = !$request->request_date ? true : $request->request_date == $request->tanggal_drop;

      $customer = TransactionCustomer::firstorCreate(['nik' => $request->nik], ['nama' => $request->nama, 'alamat' => $request->alamat]);
      $officerGrouping = TransactionLoanOfficerGrouping::where('branch_id', $request->branch)->where('kelompok', $request->kelompok)->first();
      if (!$officerGrouping) {
        DB::rollBack();
        return redirect()->back()->withErrors('Kelompok ' . $request->kelompok . ' tidak ada di cabang ini. Tidak bisa input pengajuan.');
      }
      // $manage =  $customer->manage_customer()->firstOrCreate(['transaction_loan_officer_grouping_id' => $officerGrouping->id]);
      $manage =  $customer->manage_customer()->firstOrCreate(['transaction_loan_officer_grouping_id' => $officerGrouping->id, 'day' => Carbon::parse($request->tanggal_drop)->dayOfWeek]);
      // Nomor anggota melekat ke rekening (kelompok+hari), sama seperti store_pengajuan_lama.
      if ($request->filled('nomor_anggota')) {
        $manage->update(['nomor_anggota' => $request->nomor_anggota]);
      }



      // drop_before hanya bermakna untuk topup (punya previous_loan_id), diisi
      // di store_pengajuan_lama dari nominal_drop pinjaman lama. Create biasa
      // bukan topup -> selalu 0, tak peduli drop langsung atau rekening lama.
      $request['drop_before'] = 0;


      // Sesuai request: user_mantri disamakan dengan user_input
      $userInput = auth()->user()->employee->id;
      $mantri = AppHelper::getMantri($officerGrouping);

      $loan = $manage->loan()->create([
        'transaction_loan_officer_grouping_id' => $officerGrouping->id,
        'request_date' => $request->request_date ?? $request->tanggal_drop,
        'user_mantri' => $mantri,
        'drop_date' => $request->tanggal_drop,
        'hari' => AppHelper::dateName($request->tanggal_drop),
        'status' => "open",
        'user_input' => $userInput,

        'drop_before' => $request['drop_before'],
        'request_nominal' => $request->request_nominal,
      ]);


      if ($drop_langsung) {
        $loan->update([
          'user_drop' => $mantri,
          'status' => "success",
          'nominal_drop' => $request->request_nominal,
          'request_nominal' => null,
        ]);
      } else {
        $loan->update([
          'status' =>  "success",
          'user_check' => $userInput,
          'check_date' => Carbon::now()->format('Y-m-d'),
          'approved_nominal' => $request->request_nominal,

          'nominal_drop' => (int) $request->request_nominal,
          'user_drop' => $mantri,
        ]);
      }

      if (!$angsuran->isEmpty()) {
        $hutang = $request->request_nominal * 1.3;

        $angsuran->each(function ($item) use ($loan, $officerGrouping, $mantri, &$hutang) {
          if ($hutang <= 0) return false; // Hentikan loop jika hutang sudah lunas

          $loan->loan_instalment()->create([
            'transaction_date' => $item['transaction_date'],
            'nominal' => $item['nominal'] ?? 0,
            'danatitipan' =>  isset($item['dana_titipan']) ? ($item['dana_titipan'] ? 1 : 0) : 0,
            'transaction_loan_officer_grouping_id' => $officerGrouping->id,
            'status' => AppHelper::generateStatusAngsuran($loan->drop_date,  $item['transaction_date']),
            'user_input' => auth()->user()->employee->id,
            'user_mantri' =>  $mantri,
          ]);

          $hutang -=  $item['nominal'] ?? 0;
        });
      }


      DB::commit();
    } catch (Exception $exception) {
      DB::rollBack();
      // `dd($exception)` dihapus 2026-08-12 - membuat baris di bawahnya tidak
      // pernah tercapai, jadi kegagalan input tampil sebagai layar dump.
      Log::error('store_buku_transaksi_batch gagal: ' . $exception->getMessage(), [
        'nik' => $request->nik,
        'kelompok' => $request->kelompok,
        'user_id' => auth()->id(),
        'line' => $exception->getLine(),
      ]);
      return redirect()->back()->withErrors($exception->getMessage());
    }



    return redirect()->back()->with('message', 'BERHASIL DITAMBAHKAN')->with('printUrl', route('pinjaman.index_pinjaman_search', ['kelompok' => $officerGrouping->kelompok, 'month' => Carbon::parse($request->tanggal_drop)->format('Y-m'), 'branch_id' =>  $request['branch'], 'hari' => AppHelper::dateName($request->tanggal_drop)]));
  }


  public function store_pengajuan_lama(TransactionLoan $transactionLoan, Request $request)
  {

    if (!auth()->user()->hasPermissionTo('can-create')) {
      return redirect()->back()->withErrors('Anda Tidak Mempunyai Akses Menambahkan');
    }
    if (!AppHelper::bolehAksesPinjaman($transactionLoan)) {
      return redirect()->back()->withErrors(AppHelper::PESAN_BUKAN_WILAYAH);
    }

    $previousUrl = url()->previous();

    $previousRouteName = app('router')->getRoutes()->match(app('request')->create($previousUrl))->getName();
    if (!auth()->user()->hasPermissionTo('can-create')) {
      return redirect()->back()->withErrors('Anda Tidak Mempunyai Akses Menghapus');
    }

    if (AppHelper::dateName($transactionLoan->drop_date) !== AppHelper::dateName($request->request_date)) {
      return redirect()->back()->withErrors('Hari Tidak Sama');
    }
    if (AppHelper::dateName($request->request_date) !== AppHelper::dateName($request->tanggal_drop)) {
      return redirect()->back()->withErrors('Hari Tidak Sama');
    }
    // Pengajuan nasabah lama: drop dikunci ke hari tagih kerja berikutnya
    // (minggu depan, lompati libur) - tidak ada drop di hari pengajuan.
    // Berlaku juga untuk can-edit (mas 2026-10-12).
    try {
      $dropSeharusnya = WorkDay::hariSamaBerikutnya(Carbon::parse($request->request_date)->startOfDay());
      $tglDrop = Carbon::parse($request->tanggal_drop)->startOfDay();
    } catch (\Throwable $e) {
      return redirect()->back()->withErrors('Tanggal pengajuan / drop tidak terbaca.');
    }
    if (!$dropSeharusnya || !$tglDrop->equalTo($dropSeharusnya)) {
      return redirect()->back()->withErrors(sprintf(
        'Tanggal drop harus %s (hari tagih kerja berikutnya sesudah pengajuan).',
        $dropSeharusnya ? $dropSeharusnya->locale('id')->isoFormat('D MMMM Y') : '-'
      ));
    }

    $val = $request->validate([
      'request_nominal' =>  ["required", 'integer', 'min:100000'],
      'request_date' => ['required', 'date', 'before_or_equal:today', new HariKerja('Tanggal pengajuan')],
      'tanggal_drop' =>  ['required', 'date', new HariKerja('Tanggal drop')],
      'type' =>  ['required'],
      'nomor_anggota' => ['required', 'regex:/^[0-9]+$/', 'max:20'],
      'residential_address' => ['nullable', 'string', 'max:255'],
    ], [
      'nomor_anggota.regex' => 'Nomor anggota hanya boleh angka.',
      'request_date.before_or_equal' => 'Tanggal pengajuan tidak boleh di masa depan.',
      '*.min' => 'minimal diisi 100rb'
    ]);

    try {
      DB::beginTransaction();

      // Kunci pinjaman lama: dua pengajuan bersamaan tidak bisa sama-sama
      // lolos cek "belum punya pengganti". Cek syarat harus sesudah kunci.
      TransactionLoan::whereKey($transactionLoan->id)->lockForUpdate()->first();
      if ($alasan = $transactionLoan->alasanTolakPengajuan($request->request_date)) {
        DB::rollBack();
        return redirect()->back()->withErrors('Belum memenuhi syarat pengajuan pelunasan: ' . $alasan);
      }

      $drop_langsung = $request->request_date == $request->tanggal_drop;

      $officerGrouping = TransactionLoanOfficerGrouping::find($transactionLoan->transaction_loan_officer_grouping_id);
      $mantri = AppHelper::getMantri($officerGrouping);

      // Domisili & nomor anggota melekat ke manage_customer (per
      // kelompok/kantor), bukan ke TransactionCustomer (identitas NIK) -
      // nasabah yang sama bisa punya manage_customer berbeda di kantor lain.
      TransactionManageCustomer::whereKey($transactionLoan->transaction_manage_customer_id)
        ->update([
          'nomor_anggota' => $request->nomor_anggota,
          'residential_address' => $request->residential_address,
        ]);

      $loan = TransactionLoan::create([
        'transaction_manage_customer_id' => $transactionLoan->transaction_manage_customer_id,
        'transaction_loan_officer_grouping_id' => $transactionLoan->transaction_loan_officer_grouping_id,
        'previous_loan_id' => $transactionLoan->id,
        'request_date' => $request->request_date,
        'user_mantri' => $mantri,
        'drop_date' => $request->tanggal_drop,
        'hari' => AppHelper::dateName($request->tanggal_drop),
        'status' => "open",
        'user_input' => auth()->user()->employee->id,
        'drop_before' => $transactionLoan->nominal_drop,
        'request_nominal' => $request->request_nominal,
      ]);
      // dd($loan);

      if ($drop_langsung) {
        $loan->update([
          'user_drop' => $mantri,
          'status' => "success",
          'nominal_drop' => $request->request_nominal,
          'request_nominal' => null,
        ]);
      }

      // Penandaan pinjaman lama sebagai LUNAS (out_date/transaction_out_reasons_id
      // + baris angsuran pelunasan otomatis) TIDAK lagi dilakukan di sini -
      // dulu terjadi seketika saat pengajuan disubmit, padahal pinjaman
      // barunya belum tentu jadi di-drop (bisa ditolak/gagal di ACC kepala).
      // Sekarang ditangani otomatis oleh TransactionLoan::boot() begitu
      // pinjaman baru ini status-nya benar-benar berubah jadi 'success'
      // (baik langsung di atas kalau $drop_langsung, maupun belakangan lewat
      // action_buku_transaksi ketika kepala meng-ACC lalu drop).

      DB::commit();
    } catch (Exception $exception) {
      DB::rollBack();
      return redirect()->back()->withErrors($exception->getMessage());
    }


    return redirect()->back()->with('message', 'Berhasil Menambahkan Pengajuan');
  }


  /**
   * TUNDAAN: pengajuan yang sudah di-ACC KM tapi mau dipindah tanggal
   * drop-nya. Pengajuan LAMA (ini) otomatis jadi 'gagal' - TIDAK dihapus -
   * dan dibuat 1 pengajuan BARU dengan tanggal drop baru, status **'open'**
   * (BUKAN 'acc' - KM tetap harus meng-ACC/Tolak ulang, karena kadang KM
   * berubah pikiran dan menolak nasabahnya saat itu juga). Ditandai
   * `postponed_loan_id` supaya kelihatan di UI sebagai badge "TD".
   *
   * `previous_loan_id` (kalau ada, berarti pengajuan ini sendiri adalah
   * top-up/refinance dari pinjaman lain) DIPROPAGASI ke pengajuan baru,
   * supaya hook auto-pelunasan di TransactionLoan::boot() tetap menemukan
   * pinjaman ASLI yang mau dilunaskan, walau sudah berapa kali ditunda.
   */
  public function tundaan_pengajuan(TransactionLoan $transactionLoan, Request $request)
  {
    if (!auth()->user()->hasPermissionTo('can-approve')) {
      return redirect()->back()->withErrors('Anda Tidak Mempunyai Akses Menunda Pengajuan');
    }

    if ($transactionLoan->status !== 'acc') {
      return redirect()->back()->withErrors('Tundaan cuma bisa dilakukan pada pengajuan yang sudah di-ACC.');
    }
    if (Carbon::parse($transactionLoan->drop_date)->startOfDay()->gt(Carbon::today())) {
      return redirect()->back()->withErrors('Belum hari drop. Sebelum hari drop hanya bisa ACC / Tolak.');
    }
    if (!AppHelper::bolehAksesPinjaman($transactionLoan)) {
      return redirect()->back()->withErrors(AppHelper::PESAN_BUKAN_WILAYAH);
    }

    // Tundaan = create ulang drop di hari tagih kerja BERIKUTNYA (keputusan mas
    // 2026-10-09): tanggalnya ditentukan server, bukan dipilih - sama dengan
    // aturan tanggal drop pengajuan baru, tidak bisa menclong lebih jauh.
    $tanggalBaru = WorkDay::hariSamaBerikutnya(Carbon::parse($transactionLoan->drop_date)->startOfDay());
    if (!$tanggalBaru) {
      return redirect()->back()->withErrors('Tidak ada hari tagih kerja dalam 8 minggu ke depan. Periksa Kalender Kerja.');
    }
    if (AppHelper::tanggalTerkunci($transactionLoan->transaction_loan_officer_grouping_id, $tanggalBaru)) {
      return redirect()->back()->withErrors('Tanggal drop baru ' . $tanggalBaru->locale('id')->isoFormat('D MMMM Y') . ' sudah dikunci.');
    }

    try {
      DB::beginTransaction();

      // Status 'open' (BUKAN 'acc') - KM tetap harus meng-ACC/Tolak ulang.
      // Tundaan cuma memindah tanggal drop, tapi kadang KM berubah pikiran
      // dan menolak nasabahnya saat itu juga - jadi approved_nominal/
      // user_check/check_date TIDAK diwariskan (masih kosong sampai
      // benar-benar di-ACC lagi lewat action_buku_transaksi).
      TransactionLoan::create([
        'transaction_manage_customer_id' => $transactionLoan->transaction_manage_customer_id,
        'transaction_loan_officer_grouping_id' => $transactionLoan->transaction_loan_officer_grouping_id,
        'previous_loan_id' => $transactionLoan->previous_loan_id,
        'postponed_loan_id' => $transactionLoan->id,
        // Diajukan ulang di tanggal drop yang ditunda (5 Okt -> drop 12 Okt),
        // bukan tanggal pengajuan lama - supaya ikut rencana ACC KM hari itu.
        'request_date' => $transactionLoan->drop_date,
        'drop_date' => $tanggalBaru->toDateString(),
        'hari' => $transactionLoan->hari,
        'request_nominal' => $transactionLoan->request_nominal,
        'user_mantri' => $transactionLoan->user_mantri,
        'user_input' => auth()->user()->employee->id,
        'status' => 'open',
      ]);

      $transactionLoan->update(['status' => 'gagal']);

      DB::commit();
    } catch (Exception $exception) {
      DB::rollBack();
      return redirect()->back()->withErrors(AppHelper::pesanGagal($exception, 'Tundaan gagal disimpan. Ulangi / hubungi IT.'));
    }

    return redirect()->back()->with('message', 'Pengajuan ditunda ke ' . $tanggalBaru->locale('id')->isoFormat('D MMMM Y') . '.');
  }

  // UBAH STATUS PINJAMAN
  public function action_buku_transaksi(TransactionLoan $transactionLoan, Request $request)
  {


    // Gate per-status:
    //  - acc / tolak  = keputusan persetujuan -> butuh 'can-approve' (kasir, staf
    //    kontrol, KM ke atas). Mantri otomatis tertolak (tak punya can-approve).
    //  - success / gagal = realisasi drop -> butuh 'can-create' (mantri/pembuat).
    $user = auth()->user();

    if ($request->status == 'acc' || $request->status == 'tolak') {
      if (!$user->hasPermissionTo('can-approve')) {
        return redirect()->back()->withErrors('Anda Tidak Mempunyai Akses ACC / Tolak');
      }
    }

    if ($request->status == 'success' || $request->status == 'gagal') {
      if (!$user->hasPermissionTo('can-create')) {
        return redirect()->back()->withErrors('Anda Tidak Mempunyai Akses Drop / Gagal');
      }
    }

    // Drop / Gagal hanya di hari drop-nya atau sesudahnya - sebelum itu cuma
    // ACC / Tolak (pengajuan minggu depan tidak ter-drop karena salah klik).
    if (in_array($request->status, ['success', 'gagal'], true) && Carbon::parse($transactionLoan->drop_date)->startOfDay()->gt(Carbon::today())) {
      return redirect()->back()->withErrors('Belum hari drop (' . Carbon::parse($transactionLoan->drop_date)->format('d-m-Y') . '). Sebelum hari drop hanya bisa ACC / Tolak.');
    }


    $val = $request->validate([
      'status' => ['required'],
      'approved_nominal' => ['required_if:status,acc'],
      'drop' => ['required_if:status,success'],
    ]);

    if (!AppHelper::bolehAksesPinjaman($transactionLoan)) {
      return redirect()->back()->withErrors(AppHelper::PESAN_BUKAN_WILAYAH);
    }

    if (!in_array($request->status, self::TRANSISI_STATUS[$transactionLoan->status] ?? [], true)) {
      return redirect()->back()->withErrors("Status {$transactionLoan->status} tidak bisa diubah menjadi {$request->status}.");
    }

    // ACC dibatalkan (acc -> tolak) hanya oleh karyawan yang meng-ACC.
    if ($transactionLoan->status === 'acc' && $request->status === 'tolak'
      && (int) $transactionLoan->user_check !== (int) auth()->user()->employee?->id) {
      return redirect()->back()->withErrors('Hanya yang meng-ACC yang bisa mengubah jadi tolak.');
    }

    // Drop dibatalkan (success -> gagal): hanya selama belum ada angsuran dan
    // belum jadi dasar pengajuan lain. Hari terkunci ditolak trigger DB.
    if ($transactionLoan->status === 'success') {
      if ($transactionLoan->loan_instalment()->exists()) {
        return redirect()->back()->withErrors('Pinjaman sudah ada angsuran, tidak bisa digagalkan.');
      }
      if (AppHelper::sudahDiajukanPengganti($transactionLoan)) {
        return redirect()->back()->withErrors('Pinjaman ini sudah jadi dasar pengajuan lain, tidak bisa digagalkan.');
      }
    }

    // Membalik tolak -> acc / gagal -> success: jangan sampai ada dua pengajuan
    // hidup untuk nasabah / pinjaman lama yang sama (sudah diajukan ulang, atau
    // sudah ditunda jadi pengajuan baru).
    if (in_array($transactionLoan->status, ['tolak', 'gagal'], true)) {
      $kembar = AppHelper::sudahDiajukanPengganti($transactionLoan)
        || TransactionLoan::where('id', '!=', $transactionLoan->id)
          ->where(function ($q) use ($transactionLoan) {
            $q->where(fn($q) => $q->where('transaction_manage_customer_id', $transactionLoan->transaction_manage_customer_id)->whereIn('status', ['open', 'acc']))
              ->when($transactionLoan->previous_loan_id, fn($q) => $q->orWhere(
                fn($q) => $q->where('previous_loan_id', $transactionLoan->previous_loan_id)->whereIn('status', ['open', 'acc', 'success'])
              ));
          })
          ->exists();
      if ($kembar) {
        return redirect()->back()->withErrors('Sudah ada pengajuan lain yang berjalan untuk nasabah ini, status tidak bisa dibalik.');
      }
    }

    try {
      DB::beginTransaction();

      if ($request->status == 'acc') {
        $transactionLoan->update([
          'status' =>  $request->status,
          'user_check' => auth()->user()->employee->id,
          'check_date' => Carbon::now()->format('Y-m-d'),
          'approved_nominal' => $request->approved_nominal ?? $transactionLoan->approved_nominal,
        ]);
      }

      if ($request->status == 'tolak') {
        $transactionLoan->update([
          'status' =>  $request->status,
          'user_check' => auth()->user()->employee->id,
          'check_date' => Carbon::now()->format('Y-m-d'),
        ]);
      }

      if ($request->status == 'success') {
        $transactionLoan->update([
          'status' =>  $request->status,
          'nominal_drop' => $request->drop,
          // user_drop bersifat sama dengan user_mantri: pakai aturan getMantri
          // (role-override pengklik / mantri aktif kelompok / terbaru / null),
          // bukan copy mentah user_mantri lama.
          'user_drop' => AppHelper::getMantri($transactionLoan->loan_officer_grouping),
        ]);
      }


      if ($request->status == 'gagal') {
        $transactionLoan->update([
          'status' =>  $request->status,
          // success -> gagal: uang batal cair, nominal drop dikosongkan
          // (diisi ulang kalau nanti dijadikan success lagi).
          'nominal_drop' => null,
          'user_check' => auth()->user()->employee->id,
          'check_date' => Carbon::now()->format('Y-m-d'),
        ]);
      }


      DB::commit();
    } catch (Exception $exception) {
      DB::rollBack();
      // withErrors, bukan with('error'): flash 'error' tidak diteruskan ke layar.
      return redirect()->back()->withErrors(AppHelper::pesanGagal($exception, 'Terjadi Kesalahan Mohon Ulangi Lagi'));
    }
    return redirect()->back()->with('message', 'Berhasil Menyimpan');
  }



  // INI ADALAH PINJAMAN YA
  // JSON buku angsuran bulanan (sama dengan index_pinjaman) untuk drawer
  // storting di Rekap 1.
  public function buku_angsuran_json(Request $request)
  {
    return response()->json($this->getLoan($request));
  }

  public function index_pinjaman(Request $request)
  {
    // dd('asd');
    $data = $this->getLoan($request);
    return Inertia::render("WebView/Angsuran/Index", $data);
  }



  // INI INDEX PINJAMAN PERBULAN ( UNTUK CARI ML / PENGGANTI MENU MACET )
  public function index_pinjaman_search(Request $request)
  {

    $data = $this->getLoanByDate($request);
    // Input Macet dimatikan untuk kantor migrasi (mas 2026-10-12, menu baru menyusul).
    $data['input_macet_mati'] = \App\Helpers\AgregasiScope::sudahMigrasi(\App\Helpers\AuthScope::getActiveBranchId());
    return Inertia::render("WebView/Angsuran/SearchByDate", $data);
  }

  /**
   * Daftar Nasabah (mas 2026-10-22): nasabah yang di-drop pada satu bulan di kelompok
   * aktif (filter global), dengan pinjaman dan saldo SEKARANG (F8,
   * PenyesuaianSaldo::saldoBanyak). Lunas = punya pay_off_date (walau angsurannya
   * kurang - ditutup sistem lama, mas 2026-10-22) atau saldo <= 0. Tanggal lunas =
   * pay_off_date, kalau kosong tanggal angsuran / pemutihan terakhir.
   */
  public function daftar_nasabah(Request $request)
  {
    return Inertia::render('Pinjaman/DaftarNasabah', $this->dataDaftarNasabah($request));
  }

  /** Data Daftar Nasabah; dipakai juga menu Ganti Nasabah (GantiNasabahController). */
  public function dataDaftarNasabah(Request $request): array
  {
    $scope = \App\Helpers\AuthScope::resolve();
    $grouping = AppHelper::kelompokAktif($scope->branch_id, $scope->kelompok);
    // Bulan drop pakai parameter sendiri (bulan_drop), BUKAN `month` filter global:
    // memilih Agustus 2025 di sini tidak menggeser bulan menu lain (mas 2026-10-22).
    // Pilihan terakhir diingat di sesi sendiri.
    $bulanDrop = preg_match('/^\d{4}-\d{2}$/', (string) $request->query('bulan_drop'))
      ? $request->query('bulan_drop') : session('daftar_nasabah_bulan', Carbon::now()->format('Y-m'));
    session(['daftar_nasabah_bulan' => $bulanDrop]);
    $bulan = Carbon::parse($bulanDrop . '-01');
    // Per hari tagih seperti /pinjaman (bawaan hari ini); tanggal tutup untuk dialog Pay.
    $hari = AppHelper::hariTagih($request->hari);
    $hariIni = AppHelper::dateName(Carbon::now()) == $hari;
    $tutup = AppHelper::get_closed_date($hariIni ? Carbon::now()->format('Y-m-d') : Carbon::now()->previous(AppHelper::getNumbDays($hari))->format('Y-m-d'));

    $loans = DB::table('transaction_loans as l')
      ->join('transaction_manage_customers as m', 'm.id', '=', 'l.transaction_manage_customer_id')
      ->join('transaction_customers as c', 'c.id', '=', 'm.transaction_customer_id')
      ->where('l.transaction_loan_officer_grouping_id', $grouping->id)
      ->where('l.status', 'success')
      ->where('l.hari', $hari)
      ->whereBetween('l.drop_date', [$bulan->copy()->startOfMonth()->toDateString(), $bulan->copy()->endOfMonth()->toDateString()])
      ->orderBy('l.drop_date')->orderBy('c.nama')
      ->get(['l.id', 'l.drop_date', 'l.hari', 'l.nominal_drop', 'l.pinjaman', 'l.pay_off_date', 'c.nama', 'c.nik', 'm.nomor_anggota',
        DB::raw('COALESCE(NULLIF(m.residential_address, ""), c.alamat) AS alamat')]);
    $ids = $loans->pluck('id')->all();
    $saldo = \App\Helpers\PenyesuaianSaldo::saldoBanyak($ids);
    $bayarTerakhir = DB::query()->fromSub(
      DB::table('transaction_loan_instalments')->whereIn('transaction_loan_id', $ids)->select('transaction_loan_id', 'transaction_date')
        ->unionAll(DB::table('transaction_white_offs')->whereIn('transaction_loan_id', $ids)->select('transaction_loan_id', 'transaction_date')),
      'b'
    )->groupBy('transaction_loan_id')->selectRaw('transaction_loan_id, MAX(transaction_date) t')->pluck('t', 'transaction_loan_id');

    $daftar = $loans->map(fn($l) => [
      'id' => $l->id,
      'tanggal' => Carbon::parse($l->drop_date)->toDateString(),
      'hari' => $l->hari,
      'nama' => $l->nama,
      'nik' => $l->nik,
      'nomor_anggota' => $l->nomor_anggota,
      'alamat' => $l->alamat,
      'drop' => (int) $l->nominal_drop,
      'pinjaman' => (int) $l->pinjaman,
      'saldo' => $l->pay_off_date ? 0 : max(0, $saldo[$l->id]['saldo'] ?? 0),
      'lunas' => $l->pay_off_date || ($saldo[$l->id]['saldo'] ?? 0) <= 0,
      'tanggal_lunas' => ($t = $l->pay_off_date ?? $bayarTerakhir[$l->id] ?? null) ? Carbon::parse($t)->toDateString() : null,
    ]);

    return [
      'server_filter' => [
        'closed_transaction' => $tutup,
        'bulan_drop' => $bulanDrop,
        'hari' => $hari,
        'kelompok' => $grouping->kelompok,
        'branch_id' => $scope->branch_id,
        'wilayah' => $scope->wilayah,
        'userAuthorized' => AppHelper::branch_permission($scope->user, $scope->branch_id),
      ],
      'unit' => \App\Models\Branch::whereKey($scope->branch_id)->value('unit'),
      'nasabah' => $daftar,
    ];
  }

  public function index_pinjaman_macet(Request $request)
  {
    $data = $this->getLoanMacet($request, true);
    // dd($data);
    // Input Macet dimatikan untuk kantor migrasi (mas 2026-10-12, menu baru menyusul).
    $data['input_macet_mati'] = \App\Helpers\AgregasiScope::sudahMigrasi(\App\Helpers\AuthScope::getActiveBranchId());
    return Inertia::render("WebView/Angsuran/SearchByDate", $data);
  }


  // INI CONTROLLER API AXIOS ( UNTUK MENCARI KEBENARAH YANG HAKIKI , EH SALAH UNTUK MEMUNCULKAN DATA ANGSURAN )

  public function get_loan_pinjaman(TransactionLoan $transactionLoan)
  {
    if (!AppHelper::bolehAksesPinjaman($transactionLoan)) {
      return response()->json(['message' => AppHelper::PESAN_BUKAN_WILAYAH], 403);
    }

    $loan = $transactionLoan->load(
      [
        'loan_instalment' => function ($item) {
          $item->with('usermantri', 'userinput')
            ->orderByDesc('transaction_date');
        },
        'branch',
        'customer',
        'mantri',
        'white_off',
        'loan_officer_grouping',
        'userinput',
        'pemeriksa',
        'pencair',
        'manage_customer.loan',
      ]
    );

    // F8: satu rumus dengan rekap (angsuran, semua pemutihan, penyesuaian).
    $saldo = \App\Helpers\PenyesuaianSaldo::hitungSaldo($loan)['saldo'];

    // Semua pemutihan (bisa lebih dari satu) dan penyesuaian yang berlaku -
    // dipakai rincian per bulan supaya sisa tiap bulan ikut rumus yang sama.
    $pemutihan = \App\Models\TransactionWhiteOff::where('transaction_loan_id', $loan->id)
      ->orderBy('transaction_date')
      ->get(['id', 'transaction_loan_officer_grouping_id', 'transaction_date', 'nominal']);
    $koreksi = $pemutihan->map(fn($w) => ['tanggal' => $w->transaction_date, 'efek' => -(int) $w->nominal])
      ->concat(
        \App\Models\TransactionSaldoAdjustment::where('transaction_loan_id', $loan->id)
          ->whereRaw(\App\Models\TransactionSaldoAdjustment::ekspresiBerlakuSql())
          ->get()
          // toDateString: cast 'date' di-serialize ke UTC (01-09 jadi 31-08T17:00Z).
          ->map(fn($a) => ['tanggal' => $a->berlaku_bulan->toDateString(), 'efek' => $a->efek_saldo])
      )
      ->values();

    $pinjaman = [
      'nomor_anggota' => $loan->manage_customer->nomor_anggota,
      'id' => $loan->id,
      'nama' => $loan->customer->nama,
      'alamat' => $loan->customer->alamat,
      // Domisili per kelompok/kantor (manage_customer) - nasabah yang sama
      // bisa terdaftar di kantor lain dengan alamat berbeda. Kosong berarti
      // belum diisi -> tampilkan alamat identitas (TransactionCustomer) saja.
      'domisili' => $loan->manage_customer->residential_address,
      'nik' => $loan->customer->nik,
      'saldo' => $saldo,
      // Kolom `pinjaman_ke` di tabel SELALU null (tidak pernah ditulis) -
      // dihitung dari riwayat, sama seperti PinjamanTrait::getTransactionLoan().
      'pinjaman_ke' => $loan->manage_customer->loan
        ->where('drop_date', '<=', $loan->drop_date)
        ->where('status', 'success')
        ->count(),
      'tanggal_pengajuan' => $loan->request_date,
      'tanggal_acc' => $loan->check_date,
      'tanggal_drop' => $loan->drop_date,
      'out_date' => $loan->out_date, // keluar target
      'pay_off_date' => $loan->pay_off_date, // lunas
      'hari' => $loan->hari,
      'kelompok' => $loan->loan_officer_grouping->kelompok,
      'branch' => $loan->branch->unit,
      'pinjaman' => $loan->pinjaman,
      'status_pinjaman' => AppHelper::status_pinjaman($loan->loan_instalment->first()?->status),
      'notes' => $loan->notes ?? null,
      'pecahan_ml' => \App\Helpers\PecahanMacetLama::adalah($loan->notes),
      'lunas' => $saldo <= 0 && !\App\Helpers\PecahanMacetLama::adalah($loan->notes),
      'alasan_tolak_pengajuan' => $loan->alasanTolakPengajuan(now()->toDateString()),
      'mantri' => $loan->mantri?->nama_karyawan,
      // Trio "siapa mengerjakan apa" - sama seperti dipakai StatusPengajuan.jsx
      // di modal Buku Transaksi (lihat PinjamanTrait::getTransactionLoan()).
      'diinput_oleh' => $loan->userinput?->nama_karyawan,
      'acc_oleh' => $loan->pemeriksa?->nama_karyawan,
      'drop_oleh' => $loan->pencair?->nama_karyawan,
      // Dipakai BayarAngsuran.jsx untuk mengunci input manual TEPAT di
      // tanggal drop pengajuan pengganti yang masih pending (open/acc) -
      // jaga-jaga bentrok dengan auto-pelunasan (TransactionLoan::boot())
      // kalau pengajuan itu tiba-tiba sukses di-drop hari itu juga. Begitu
      // pengajuan penggantinya gagal (termasuk lewat Tundaan, yang memindah
      // previous_loan_id ke pengajuan baru), kuncinya lepas dengan sendirinya
      // karena query ini hanya menghitung status open/acc.
      'pengajuan_pengganti' => TransactionLoan::where('previous_loan_id', $loan->id)
        ->whereIn('status', ['open', 'acc'])
        ->latest('id')
        ->first(['id', 'drop_date', 'status']),
      // Lunas karena drop pelunasan (pinjaman pengganti sukses): modal menampilkan
      // peringatan + link ke Buku Transaksi tempat drop pelunasan dihapus.
      'pelunasan_oleh' => ($p = TransactionLoan::where('previous_loan_id', $loan->id)->where('status', 'success')
        ->with('loan_officer_grouping:id,kelompok')->latest('id')->first(['id', 'drop_date', 'hari', 'transaction_loan_officer_grouping_id']))
        ? ['drop_date' => Carbon::parse($p->drop_date)->toDateString(), 'hari' => $p->hari, 'kelompok' => $p->loan_officer_grouping?->kelompok]
        : null,
      // Kartu "Hapus Pinjaman" di modal Angsuran: hanya untuk can-edit /
      // superuser (koreksi). null = kartu tidak ditampilkan.
      'hapus_pinjaman' => \App\Helpers\Gembok::bolehBuka(auth()->user()) ? AppHelper::canDeleteLoan($loan) + [
        'dari_pelunasan' => (bool) $loan->previous_loan_id,
        'jumlah_angsuran' => $loan->loan_instalment->count(),
        'total_angsuran' => (int) $loan->loan_instalment->sum('nominal'),
        'migrasi' => \App\Helpers\AgregasiScope::sudahMigrasi($loan->loan_officer_grouping->branch_id),
      ] : null,
    ];

    $saldo = $loan->pinjaman - $loan->loan_instalment->sum('nominal');
    // Tanggal angsuran yang terkunci kasir / beku (sebelum migrasi) - tombol
    // hapus disembunyikan di layar. can-edit / superuser tetap boleh (kunci
    // dibuka otomatis), kecuali beku.
    $bolehKoreksi = \App\Helpers\Gembok::bolehBuka(auth()->user());
    $tglKunci = \App\Models\TransactionDailyClosing::whereIn('transaction_loan_officer_grouping_id', $loan->loan_instalment->pluck('transaction_loan_officer_grouping_id')->unique())
      ->whereIn('date', $loan->loan_instalment->pluck('transaction_date')->unique())
      ->whereNotNull('kasir_lock_at')
      ->get(['transaction_loan_officer_grouping_id', 'date'])
      ->map(fn($c) => $c->transaction_loan_officer_grouping_id . '|' . $c->date->toDateString())
      ->flip();
    $terkunci = fn($i) => AppHelper::tanggalBeku($i->transaction_loan_officer_grouping_id, $i->transaction_date)
      || (!$bolehKoreksi && $tglKunci->has($i->transaction_loan_officer_grouping_id . '|' . \Carbon\Carbon::parse($i->transaction_date)->toDateString()));
    $instalment = $loan->loan_instalment->map(function ($instalment) use (&$saldo, $terkunci) {
      $saldoBefore = $saldo;
      $saldo += $instalment->nominal;
      return [
        'id' => $instalment->id,
        'nominal' => $instalment->nominal,
        'transaction_date' => $instalment->transaction_date,
        'status' => AppHelper::status_pinjaman($instalment->status),
        'danatitipan' => $instalment->danatitipan,
        'is_transfer' => (bool) $instalment->is_transfer,
        'pelunasan' => (bool) $instalment->settled_by_loan_id,
        'mantri' => $instalment->usermantri?->nama_karyawan,
        'user_input' => $instalment->userinput?->nama_karyawan,
        'terkunci' => $terkunci($instalment),
        'saldo' => $saldoBefore
      ];
    });



    // Pemutihan + boleh dihapus? (tanggal terkunci kasir / beku -> tidak;
    // can-edit / superuser boleh di hari terkunci, kecuali beku).
    $pemutihan = $pemutihan->map(fn($w) => [
      'id' => $w->id,
      'transaction_date' => \Carbon\Carbon::parse($w->transaction_date)->toDateString(),
      'nominal' => (int) $w->nominal,
      'terkunci' => AppHelper::tanggalTerkunci($w->transaction_loan_officer_grouping_id, $w->transaction_date),
    ]);

    return response()->json(['pinjaman' => $pinjaman, 'instalment' => $instalment, 'pemutihan' => $pemutihan, 'koreksi' => $koreksi], 200);
  }

  public function checkpengajuan(TransactionLoan $transactionLoan, Request $request)
  {
    // Sebelumnya field ini dihitung dari transaction_out_reasons_id /
    // rentang drop_date - tidak pernah benar-benar mendeteksi "pinjaman ini
    // sudah diajukan pengganti", dan `cek_pengajuan` yang dihasilkan tidak
    // pernah dipakai di frontend (dead data). Sekarang pakai `previous_loan_id`
    // (bagian U) yang memang dibuat untuk menghubungkan pengajuan pengganti
    // ke pinjaman lama ini. `tolak`/`gagal` TIDAK dianggap "sudah diajukan" -
    // kalau pengajuan penggantinya ditolak/gagal, nasabah boleh diajukan lagi.
    $penggantiLoan = TransactionLoan::where('previous_loan_id', $transactionLoan->id)
      ->whereIn('status', ['open', 'acc', 'success'])
      ->with('loan_officer_grouping')
      ->latest('id')
      ->first();

    $data = [
      'sudah_diajukan' => (bool) $penggantiLoan,
      'pengajuan' => $penggantiLoan ? [
        'id' => $penggantiLoan->id,
        'request_date' => $penggantiLoan->request_date,
        'tanggal_drop' => $penggantiLoan->drop_date,
        'status' => $penggantiLoan->status,
        'nominal_drop' => $penggantiLoan->nominal_drop,
        'request_nominal' => $penggantiLoan->request_nominal,
        'kelompok' => $penggantiLoan->loan_officer_grouping?->kelompok,
        'hari' => $penggantiLoan->hari, // link ke Buku Transaksi (hari buku pengajuan itu)
        // Tombol "Batalkan pengajuan" (open/acc): boleh tidaknya ikut aturan hapus pinjaman.
        'batal' => in_array($penggantiLoan->status, ['open', 'acc'], true)
          ? AppHelper::canDeleteLoan($penggantiLoan)
          : null,
      ] : null,
    ];

    return response()->json(['data' => $data], 200);
  }

  //  NAH INI POST UNTUK BAYAR ASUNYA
  public function bayar_pinjaman(Request $request, TransactionLoan $transactionLoan)
  {

    if (!auth()->user()->hasPermissionTo('can-create')) {
      return redirect()->back()->withErrors('Anda Tidak Mempunyai Akses Untuk Melakukan ini');
    }


    $val = $request->validate([
      'type_transaksi' => ['required'],
      'nominal' => ['required_if:type_transaksi,bayar', 'nullable', 'integer', 'min:0'],
      // Sama dengan pemilih tanggal di filter: hari kerja, paling jauh hari ini.
      'transaction_date' => ['required_if:type_transaksi,bayar', 'date', 'before_or_equal:today', new HariKerja('Tanggal transaksi')],
    ], [
      'nominal.min' => 'Nominal angsuran tidak boleh minus.',
      'transaction_date.before_or_equal' => 'Tanggal bayar tidak boleh melewati hari ini.',
    ]);

    if (!AppHelper::bolehAksesPinjaman($transactionLoan)) {
      return redirect()->back()->withErrors(AppHelper::PESAN_BUKAN_WILAYAH);
    }

    if ($request->type_transaksi == 'bayar') {
      // Sedang diajukan pelunasan (pengganti open/acc): angsurannya lewat drop pelunasan.
      if (TransactionLoan::where('previous_loan_id', $transactionLoan->id)->whereIn('status', ['open', 'acc'])->exists()) {
        return redirect()->back()->withErrors('Angsuran ini ada di drop pelunasan, klik drop untuk mengisi pelunasan / gagalkan terlebih dahulu.');
      }

      if (AppHelper::dateName($request->transaction_date) !== AppHelper::dateName($transactionLoan->drop_date)) {
        return redirect()->back()->withErrors('Hari Tidak Sama');
      }

      if ($request->transaction_date == $transactionLoan->drop_date) {
        return redirect()->back()->withErrors('Ini drop Baru, isi yang bulan sebelumnya (pelunasan)');
      }

      if ($request->transaction_date < $transactionLoan->drop_date) {
        return redirect()->back()->withErrors('tanggal bayar tidak boleh kurang dari tanggal drop');
      }

      // Katrol (danatitipan) tidak mungkin dibayar lewat transfer.
      if ($request->boolean('danatitipan') && $request->boolean('is_transfer')) {
        return redirect()->back()->withErrors('Pilih salah satu: katrol atau transfer.');
      }

      // Katrol hanya untuk pinjaman CM sampai ML (selisih bulan kalender >= 3).
      if ($request->boolean('danatitipan') && \App\Helpers\Ember::selisihBulan($transactionLoan->drop_date, $request->transaction_date) < 3) {
        return redirect()->back()->withErrors('Katrol hanya untuk pinjaman CM sampai ML.');
      }

    }



    $employee = AppHelper::getMantri($transactionLoan->loan_officer_grouping);


    try {
      DB::beginTransaction();
      if ($request->type_transaksi == "bayar") {
        // Kunci baris pinjaman sampai commit: input kedua untuk pinjaman yang
        // sama (ketuk dua kali, dua HP) menunggu di sini, lalu membaca angsuran
        // yang baru tersimpan. Cek di bawah harus sesudah kunci ini.
        TransactionLoan::whereKey($transactionLoan->id)->lockForUpdate()->first();

        $tolak = null;
        $sisa = \App\Helpers\PenyesuaianSaldo::hitungSaldo($transactionLoan)['saldo'];
        if (!$request->boolean('danatitipan') && $transactionLoan->loan_instalment()->where('transaction_date', $request->transaction_date)->exists()) {
          $tolak = 'Angsuran Hari Ini Sudah Dibayar';
        } elseif ($sisa <= 0) {
          $tolak = 'Pinjaman Sudah Lunas';
        } elseif ($request->nominal > $sisa) {
          $tolak = 'Angsuran melebihi sisa saldo (Rp ' . number_format($sisa, 0, ',', '.') . ').';
        }
        if ($tolak) {
          DB::rollBack();
          return redirect()->back()->withErrors($tolak);
        }

        $transactionLoan->loan_instalment()->create([
          'nominal' => $request->nominal,
          'transaction_loan_officer_grouping_id' => $transactionLoan->transaction_loan_officer_grouping_id,
          'transaction_date' => $request->transaction_date,
          'status' => AppHelper::generateStatusAngsuran($transactionLoan->drop_date, $request->transaction_date),
          'danatitipan' => $request->danatitipan ? 1 : 0,
          'is_transfer' => $request->boolean('is_transfer'),
          'user_input' => auth()->user()->employee->id,
          'user_mantri' => $employee,
        ]);
      }

      if ($request->type_transaksi == "notes") {
        $transactionLoan->notes = $request->notes;
        $transactionLoan->save();
      }


      DB::commit();
    } catch (Exception $e) {
      DB::rollBack();
      // `dd($e)` dihapus 2026-08-12.
      Log::error('bayar_pinjaman gagal: ' . $e->getMessage(), [
        'loan_id' => $transactionLoan->id,
        'user_id' => auth()->id(),
        'line' => $e->getLine(),
      ]);
      // `with('error', ...)` diganti `withErrors`: HandleInertiaRequests hanya
      // meneruskan flash key `message`, jadi 'error' tidak pernah sampai ke UI
      // (temuan D1) - user melihat aksi "berhasil" padahal gagal.
      return redirect()->back()->withErrors('Data gagal diubah: ' . $e->getMessage());
    }
    return redirect()->back()->with('message', 'data berhasil diubah');
  }


  /**
   * Nomor anggota (promes / buku manual) diisi langsung dari sel buku
   * angsuran. Melekat ke rekening (manage_customer), sama seperti saat
   * pengajuan.
   */
  public function simpan_nomor_anggota(TransactionLoan $transactionLoan, Request $request)
  {
    if (!auth()->user()->hasPermissionTo('can-create')) {
      return redirect()->back()->withErrors('Anda Tidak Mempunyai Akses Mengubah Nomor Anggota');
    }
    if (!AppHelper::bolehAksesPinjaman($transactionLoan)) {
      return redirect()->back()->withErrors(AppHelper::PESAN_BUKAN_WILAYAH);
    }

    $val = $request->validate([
      'nomor_anggota' => ['nullable', 'regex:/^[0-9]+$/', 'max:20'],
    ], ['nomor_anggota.regex' => 'Nomor anggota hanya boleh angka.']);

    TransactionManageCustomer::whereKey($transactionLoan->transaction_manage_customer_id)
      ->update(['nomor_anggota' => trim((string) ($val['nomor_anggota'] ?? '')) ?: null]);

    // Tanpa flash message: disimpan sel per sel, popup tiap simpan mengganggu.
    return redirect()->back();
  }

  public function  white_off_loan(TransactionLoan $transactionLoan, Request $request)
  {
    if (!AppHelper::bolehAksesPinjaman($transactionLoan)) {
      return redirect()->back()->withErrors(AppHelper::PESAN_BUKAN_WILAYAH);
    }

    $val = $request->validate([
      'nominal' => ['required', 'integer', 'min:1'],
      'transaction_date' => ['required', 'date', 'before_or_equal:today', new HariKerja('Tanggal pemutihan')],
    ], [
      'transaction_date.before_or_equal' => 'Tanggal pemutihan tidak boleh melewati hari ini.',
    ]);

    if (AppHelper::dateName($request->transaction_date) !== AppHelper::dateName($transactionLoan->drop_date)) {
      return redirect()->back()->withErrors('Hari Tidak Sama');
    }
    if (\App\Models\TransactionWhiteOff::where('transaction_loan_id', $transactionLoan->id)->exists()) {
      return redirect()->back()->withErrors('Pinjaman ini sudah diputihkan. Hapus pemutihan lama dulu kalau perlu diulang.');
    }
    // Tanggal yang sudah dikunci kasir / beku tidak bisa dipakai (can-edit:
    // boleh, kuncinya dibuka otomatis lewat model TransactionWhiteOff).
    if (AppHelper::tanggalTerkunci($transactionLoan->transaction_loan_officer_grouping_id, $request->transaction_date)) {
      return redirect()->back()->withErrors('Tanggal ' . Carbon::parse($request->transaction_date)->format('d-m-Y') . ' sudah dikunci. Pilih tanggal yang belum dikunci.');
    }

    try {
      DB::beginTransaction();

      $transactionLoan->white_off()->create([
        'transaction_loan_officer_grouping_id' => $transactionLoan->transaction_loan_officer_grouping_id,
        'transaction_date' => $request->transaction_date,
        'nominal' => $request->nominal,
      ]);

      // F1: tutup + keluar target (sebab PEMUTIHAN) dihitung dari sumber.
      // Nominal pemutihan TIDAK lagi ditambahkan ke total_angsuran - saldo
      // sudah mengurangi pemutihan, jadi dulu terhitung dua kali.
      $transactionLoan->hitungUlangPelunasan();
      DB::commit();
    } catch (Exception $e) {
      DB::rollBack();
      return redirect()->back()->withErrors('Data gagal diubah');
    }

    return redirect()->back()->with('message', 'Data berhasil diubah');
  }

  /**
   * Hapus pemutihan selama tanggalnya belum dikunci (can-edit: boleh, kunci
   * dibuka otomatis; beku: tidak). Status lunas & keluar target karena
   * pemutihan ikut dihitung ulang -> batal.
   */
  public function destroy_white_off(\App\Models\TransactionWhiteOff $transactionWhiteOff)
  {
    $loan = $transactionWhiteOff->transaction_loan;
    if (!auth()->user()->hasPermissionTo('can-create')) {
      return redirect()->back()->withErrors('Anda Tidak Mempunyai Akses Menghapus');
    }
    if (!$loan || !AppHelper::bolehAksesPinjaman($loan)) {
      return redirect()->back()->withErrors(AppHelper::PESAN_BUKAN_WILAYAH);
    }
    if (AppHelper::tanggalTerkunci($transactionWhiteOff->transaction_loan_officer_grouping_id, $transactionWhiteOff->transaction_date)) {
      return redirect()->back()->withErrors('Tanggal pemutihan sudah dikunci, pemutihan tidak bisa dihapus.');
    }

    try {
      DB::beginTransaction();
      $transactionWhiteOff->delete();
      $loan->hitungUlangPelunasan();
      DB::commit();
    } catch (Exception $e) {
      DB::rollBack();
      return redirect()->back()->withErrors(AppHelper::pesanGagal($e, 'Pemutihan gagal dihapus'));
    }

    return redirect()->back()->with('message', 'Pemutihan dihapus, target keluar dibatalkan.');
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy_angsuran(TransactionLoanInstalment $transactionLoanInstalment)
  {
    // Angsuran pelunasan otomatis (topup) ikut drop penggantinya: hanya hilang
    // lewat reset / hapus drop itu. Dihapus sendiri = pinjaman lama aktif lagi
    // padahal sudah dilunasi drop baru -> nasabah tertagih dua kali.
    if ($transactionLoanInstalment->settled_by_loan_id) {
      return redirect()->back()->withErrors('Angsuran pelunasan hanya bisa dibatalkan lewat reset / hapus drop penggantinya.');
    }
    if (!auth()->user()->hasPermissionTo('can-create') && !auth()->user()->hasPermissionTo('can-edit')) {
      return redirect()->back()->withErrors('Anda Tidak Mempunyai Akses Menghapus');
    }
    if (!AppHelper::bolehAksesPinjaman($transactionLoanInstalment->loan)) {
      return redirect()->back()->withErrors(AppHelper::PESAN_BUKAN_WILAYAH);
    }
    // Nasabah sudah diajukan pinjaman baru (pelunasan) yang masih berjalan:
    // syarat pengajuan dihitung dari angsuran ini, jadi angsuran tidak boleh
    // dihapus sebelum pengajuannya dibatalkan.
    if (TransactionLoan::where('previous_loan_id', $transactionLoanInstalment->transaction_loan_id)->whereIn('status', ['open', 'acc'])->exists()) {
      return redirect()->back()->withErrors('Nasabah ini sudah diajukan pinjaman baru. Batalkan pengajuannya dulu (menu Pengajuan), baru angsuran bisa dihapus.');
    }

    $permission =  AppHelper::havePermissionByDate($transactionLoanInstalment->transaction_date);
    if (!$permission['status']) {
      return redirect()->back()->withErrors($permission['message']);
    }
    if ($pesan = AppHelper::tolakHapusLewatSeminggu($transactionLoanInstalment->transaction_loan_officer_grouping_id, $transactionLoanInstalment->transaction_date, 'angsuran')) {
      return redirect()->back()->withErrors($pesan);
    }
    try {
      DB::beginTransaction();
      $transactionLoanInstalment->delete();
      DB::commit();
    } catch (Exception $e) {
      // `ddd($e)` dihapus 2026-08-12. Dia MENDAHULUI DB::rollBack(), jadi saat
      // gagal transaksinya tidak pernah di-rollback secara eksplisit -
      // eksekusi berhenti total di baris dump.
      DB::rollBack();
      Log::error('destroy_angsuran gagal: ' . $e->getMessage(), [
        'instalment_id' => $transactionLoanInstalment->id,
        'user_id' => auth()->id(),
        'line' => $e->getLine(),
      ]);
      return redirect()->back()->withErrors(AppHelper::pesanGagal($e, 'Data gagal dihapus. Ulangi / hubungi IT.'));
    }
    return redirect()->back()->with('message', 'data berhasil diubah');
  }


  public function destroy_loan(TransactionLoan $transactionLoan)
  {

    // check permission - gerbang khusus hapus, lihat AppHelper::canDeleteLoan()
    $permission = AppHelper::canDeleteLoan($transactionLoan);
    if (!$permission['status']) {
      return redirect()->back()->withErrors($permission['message']);
    }
    if (!AppHelper::bolehAksesPinjaman($transactionLoan)) {
      return redirect()->back()->withErrors(AppHelper::PESAN_BUKAN_WILAYAH);
    }

    try {
      DB::beginTransaction();
      $transactionLoan->delete();
      DB::commit();
    } catch (Exception $e) {
      DB::rollBack();
      return redirect()->back()->withErrors(AppHelper::pesanGagal($e, 'data gagal diubah'));
    }
    return redirect()->back()->with('message', 'data berhasil dihapus');
  }

  public function updateEverything(TransactionLoan $transactionLoan, Request $request)
  {

    // Superuser selalu boleh Reset (tanpa batas tanggal role). Hari yang sudah
    // dikunci kasir tetap ditolak trigger DB - termasuk untuk superuser.
    $permission = auth()->user()->hasRole('superuser')
      ? ['status' => true]
      : AppHelper::havePermissionByDate($transactionLoan->drop_date);
    if (!$permission['status']) {
      return redirect()->back()->withErrors($permission['message']);
    }



    $validate = $request->validate([
      "updateType" => ['required'],
    ]);

    // Edit pinjaman sudah ditiadakan (2026-10-03); yang tersisa hanya Reset.
    if ($request->updateType !== 'resetdata') {
      return redirect()->back()->withErrors('Edit pinjaman sudah ditiadakan. Gunakan Reset.');
    }
    if (!AppHelper::bolehAksesPinjaman($transactionLoan)) {
      return redirect()->back()->withErrors(AppHelper::PESAN_BUKAN_WILAYAH);
    }

    $wrongLoansInstalment = $transactionLoan->loan_instalment->where('transaction_date', "<", $transactionLoan->drop_date);
    if ($wrongLoansInstalment->count() > 0) {
      return redirect()->back()->withErrors('Pinjaman Mempunyai Angsuran Dengan Tanggal < Tanggal Drop yang diubah, Hubungi IT Untuk Mengubah');
    }

    if ($transactionLoan->drop_date < $transactionLoan->request_date) {
      return redirect()->back()->withErrors('Tanggal Drop Lebih Kecil Dari Tanggal Pengajuan');
    }

    if (AppHelper::dateName($transactionLoan->drop_date) != AppHelper::dateName($transactionLoan->request_date)) {
      return redirect()->back()->withErrors('Nama Hari Tidak Sama');
    } else {
      if (AppHelper::dateName($transactionLoan->drop_date) != $transactionLoan->hari) {
        return redirect()->back()->withErrors('Nama Hari Tidak Sama');
      }
    }


    try {
      DB::beginTransaction();
      if ($request->updateType == "resetdata") {
        if (AppHelper::sudahDiajukanPengganti($transactionLoan)) {
          DB::rollBack();
          return redirect()->back()->withErrors('Transaksi ini sudah diajukan (jadi dasar pengajuan/Tundaan lain yang masih berjalan), tidak bisa direset.');
        }
        $transactionLoan->update([
          "approved_nominal" => null,
          "check_date" => null,
          "user_check" => null,
          "nominal_drop" => null,
          "user_drop" => null,
          "status" => 'open',
        ]);
        // Per baris, bukan hapus massal: hook angsuran harus jalan supaya
        // total_angsuran & status lunas dihitung ulang dan siklus 'ist' bersih.
        $transactionLoan->loan_instalment()->get()->each->delete();
      }
      DB::commit();
    } catch (Exception $e) {
      DB::rollBack();
      return redirect()->back()->withErrors(AppHelper::pesanGagal($e, 'data gagal diubah'));
    }

    return redirect()->back()->with('message', 'data berhasil diubah');
  }
}
