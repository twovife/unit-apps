<?php

namespace App\Http\Controllers;

use App\Helpers\AppHelper;
use App\Models\Branch;
use App\Models\Employee;
use App\Models\TransactionCustomer;
use App\Models\TransactionDailyRecap;
use App\Models\TransactionLoan;
use App\Models\TransactionLoanInstalment;
use App\Models\TransactionLoanOfficerGrouping;
use App\Models\TransactionManageCustomer;
use App\Models\TransactionSirculation;
use App\Traits\PinjamanTrait;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TransactionLoanController extends Controller
{


  use PinjamanTrait;

  public function fastcreate(Request $request)
  {
    return Inertia::render('BukuTransaksi/BatchUpload');
  }
  public function index_buku_transaksi(Request $request)
  {

    $data = $this->getTransactionLoan($request, true);
    return Inertia::render('WebView/BukuTransaksi/TransaksiMantri', $data);
  }

  /**
   * Show the form for creating a new resource.
   */
  public function nasabah_buku_transaksi(Request $request)
  {
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
            'loan' => function ($loan) {
              $loan->with([
                'loan_instalment' => function ($inst) {
                  $inst->orderByDesc('transaction_date');
                },
                'branch'
              ])
                ->orderByDesc('request_date');
            },
            'branch',
            'loan_officer_grouping'
          ])->whereHas('loan', function ($item) {
            $item->where('status', 'success');
          });
        }
      ]
    )->where('nik', $request->nik)->first();

    $data = $nasabah ? [
      'nik' => $nasabah->nik,
      'nama' => $nasabah->nama,
      'alamat' => $nasabah->alamat,
      'history_branch' => $nasabah->manage_customer->filter(function ($customer) {
        return $customer->branch && $customer->branch->id === auth()->user()->employee->branch_id;
      })->flatMap(function ($filtered_data) {
        // Memproses loan yang berstatus 'success'
        return $filtered_data->loan->where('status', 'success')->map(function ($item) use ($filtered_data) {
          // Mengecek apakah pinjaman sudah lunas
          $isLunas = $item->loan_instalment->sum('nominal') >= $item->pinjaman;
          // Mendapatkan tanggal transaksi terakhir
          $maxTransactionDate = $isLunas ? $item->loan_instalment->max('transaction_date') : Carbon::now()->format('Y-m-d');

          return [
            'drop_date' => $item->drop_date,
            'pinjaman' => $item->pinjaman,
            'unit' => $item->branch->unit,
            'kelompok' => optional($filtered_data->loan_officer_grouping)->kelompok, // Menggunakan optional() langsung
            'saldo' => $item->pinjaman - ($item->loan_instalment->sum('nominal') ?? 0),
            'lunas' => $isLunas,
            'status' => AppHelper::generateStatusAngsuranString($item->drop_date, $maxTransactionDate),
          ];
        });
      })->sortBy('kelompok')->sortBy('drop_date')->values(),
      'history_lain' => $nasabah->manage_customer->filter(function ($customer) {
        return $customer->branch && $customer->branch->id != auth()->user()->employee->branch_id;
      })->flatMap(function ($filtered_data) {
        // Memproses loan yang berstatus 'success'
        return $filtered_data->loan->where('status', 'success')->map(function ($item) use ($filtered_data) {
          // Mengecek apakah pinjaman sudah lunas
          $isLunas = $item->loan_instalment->sum('nominal') >= $item->pinjaman;
          // Mendapatkan tanggal transaksi terakhir
          $maxTransactionDate = $isLunas ? $item->loan_instalment->max('transaction_date') : Carbon::now()->format('Y-m-d');

          return [
            'drop_date' => $item->drop_date,
            'pinjaman' => $item->pinjaman,
            'unit' => $item->branch->unit, // Menggunakan optional() langsung
            'kelompok' => optional($filtered_data->loan_officer_grouping)->kelompok, // Menggunakan optional() langsung
            'saldo' => $item->pinjaman - ($item->loan_instalment->sum('nominal') ?? 0),
            'lunas' => $isLunas,
            'status' => AppHelper::generateStatusAngsuranString($item->drop_date, $maxTransactionDate),
          ];
        });
      })->sortBy('kelompok')->sortBy('unit')->sortBy('drop_date')->values(),
      // Reset indeks setelah proses pemetaan
    ] : null;

    return response()->json(['data' => $data ?? null, 'return_nik' => $request->nik]);
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store_buku_transaksi(Request $request)
  {
    // dd('asd');
    if (!auth()->user()->hasPermissionTo('can create')) {
      return redirect()->back()->withErrors('Anda Tidak Mempunyai Akses Menghapus');
    }

    if (AppHelper::dateName($request->request_date) !== AppHelper::dateName($request->tanggal_drop)) {
      return redirect()->back()->withErrors('Hari Tidak Sama');
    }

    $val = $request->validate([
      'isActiveMember' => ['boolean', 'required'],
      'nik' => ['required', 'digits:16'],
      'kelompok' => ['required'],
      'request_nominal' =>  ["required", 'integer'],
      'nama' => ['required_if:isActiveMember,false'],
      'alamat' => ['required_if:isActiveMember,false'],
      'request_date' => ['required', 'date'],
      'tanggal_drop' =>  ['required', 'date'],
    ]);

    $request['kelompok'] = auth()->user()->can('can show kelompok') ? $request->kelompok : auth()->user()->employee->area;
    $request['branch'] = auth()->user()->can('can show branch') ? $request->branch_id : auth()->user()->employee->branch_id;

    try {
      DB::beginTransaction();
      $drop_langsung = $request->request_date == $request->tanggal_drop;

      $customer = TransactionCustomer::firstorCreate(['nik' => $request->nik], ['nama' => $request->nama, 'alamat' => $request->alamat]);
      $officerGrouping = TransactionLoanOfficerGrouping::where('branch_id', $request->branch)->where('kelompok', $request->kelompok)->first();
      $manage =  $customer->manage_customer()->firstOrCreate(['transaction_loan_officer_grouping_id' => $officerGrouping->id]);

      $isExistDailtRecap = TransactionDailyRecap::where('transaction_loan_officer_grouping_id', $officerGrouping->id)->where('date', $request->tanggal_drop)->first();

      if ($isExistDailtRecap->target == 0) {
        return redirect()->back()->withErrors('Tidak Ada Target Hari ini');
      }

      if ($manage->wasRecentlyCreated) {
        $request['drop_before'] = 0;
      } else {
        $drop_before = $manage->loan()->where('status', 'success')->orderBy('drop_date', 'desc')->first();
        $request['drop_before'] = $drop_before?->nominal_drop ?? 0;
        $request['drop_date_before'] = $drop_before?->drop_date ?? 0;
      }
      $mantri = Employee::where('branch_id', $request->branch)->where('area', $request->kelompok)->first();

      $loan = $manage->loan()->create([
        'transaction_loan_officer_grouping_id' => $officerGrouping->id,
        'request_date' => $request->request_date,
        'user_mantri' => $mantri->id,
        'drop_date' => $request->tanggal_drop,
        'hari' => AppHelper::dateName($request->tanggal_drop),
        'status' => "open",
        'user_input' => auth()->user()->employee->id,

        'drop_before' => $request['drop_before'],
        'request_nominal' => $request->request_nominal,
      ]);


      if ($drop_langsung) {
        $loan->update([
          'user_drop' => $mantri->id,
          'status' => "success",
          'nominal_drop' => $request->request_nominal,
          'request_nominal' => null,
        ]);
      }

      DB::commit();
    } catch (Exception $exception) {
      DB::rollBack();
      dd($exception);
      return redirect()->back()->withErrors($exception->getMessage());
    }
    return redirect()->back()->with('message', 'Berhasil Menambahkan Pengajuan');
  }


  // store for batch Transksi
  public function store_buku_transaksi_batch(Request $request)
  {

    if (!auth()->user()->hasPermissionTo('can create')) {
      return redirect()->back()->withErrors('Anda Tidak Mempunyai Akses Menghapus');
    }

    if (AppHelper::dateName($request->request_date) !== AppHelper::dateName($request->tanggal_drop)) {
      return redirect()->back()->withErrors('Hari Tidak Sama');
    }


    $val = $request->validate([
      'isActiveMember' => ['boolean', 'required'],
      'nik' => ['required', 'digits:16'],
      'kelompok' => ['required'],
      'request_nominal' =>  ["required", 'integer'],
      'nama' => ['required_if:isActiveMember,false'],
      'alamat' => ['required_if:isActiveMember,false'],
      'request_date' => ['required', 'date'],
      'tanggal_drop' =>  ['required', 'date'],
    ]);

    $request['kelompok'] = auth()->user()->can('can show kelompok') ? $request->kelompok : auth()->user()->employee->area;
    $request['branch'] = auth()->user()->can('can show branch') ? $request->branch_id : auth()->user()->employee->branch_id;

    try {
      DB::beginTransaction();
      $drop_langsung = $request->request_date == $request->tanggal_drop;

      $customer = TransactionCustomer::firstorCreate(['nik' => $request->nik], ['nama' => $request->nama, 'alamat' => $request->alamat]);
      $officerGrouping = TransactionLoanOfficerGrouping::where('branch_id', $request->branch)->where('kelompok', $request->kelompok)->first();
      $manage =  $customer->manage_customer()->firstOrCreate(['transaction_loan_officer_grouping_id' => $officerGrouping->id]);



      if ($manage->wasRecentlyCreated) {
        $request['drop_before'] = 0;
      } else {
        $drop_before = $manage->loan()->where('status', 'success')->orderBy('drop_date', 'desc')->first();
        $request['drop_before'] = $drop_before?->nominal_drop ?? 0;
        $request['drop_date_before'] = $drop_before?->drop_date ?? 0;
      }
      $mantri = Employee::where('branch_id', $request->branch)->where('area', $request->kelompok)->orderBy('id', 'desc')->first();
      $loan = $manage->loan()->create([
        'transaction_loan_officer_grouping_id' => $officerGrouping->id,
        'request_date' => $request->request_date,
        'user_mantri' => $mantri->id,

        'check_date' =>  $request->request_date,
        'user_check' =>  $mantri->id,

        'drop_date' => $request->tanggal_drop,
        'user_drop' =>  $mantri->id,


        'hari' => AppHelper::dateName($request->tanggal_drop),
        'status' => "success",
        'user_input' => auth()->user()->employee->id,

        'drop_before' => $request['drop_before'],
        'request_nominal' => $request->request_nominal,
        'approved_nominal' => $request->request_nominal,
        'nominal_drop' => $request->request_nominal,
      ]);

      $angsuran = collect($request->angsuran)->sortBy('transaction_date')->values();

      if (!$angsuran->isEmpty()) {
        $angsuran->each(function ($item) use ($loan, $officerGrouping, $mantri) {
          $loan->loan_instalment()->create([
            'transaction_date' => $item['transaction_date'],
            'nominal' => $item['nominal'],
            'danatitipan' =>  isset($item['dana_titipan']) ? ($item['dana_titipan'] ? "true" : "false") : "false",
            'transaction_loan_officer_grouping_id' => $officerGrouping->id,
            'status' => AppHelper::generateStatusAngsuran($loan->drop_date,  $item['transaction_date']),
            'user_input' => auth()->user()->employee->id,
            'user_mantri' =>  $mantri->id,
          ]);
        });
      }

      DB::commit();
    } catch (Exception $exception) {
      DB::rollBack();
      return redirect()->back()->withErrors($exception->getMessage());
    }
    return redirect()->back()->with('success', 'Berhasil Menambahkan Pengajuan');
  }



  // post data action for buku transaksi
  /**
   * Display the specified resource.
   */
  public function action_buku_transaksi(TransactionLoan $transactionLoan, Request $request)
  {
    // dd($request->all());
    $val = $request->validate([
      'status' => ['required'],
      'approved_nominal' => ['required_if:status,acc'],
      'drop' => ['required_if:status,success'],
    ]);

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

      if ($request->status == 'success') {
        $transactionLoan->update([
          'status' =>  $request->status,
          'nominal_drop' => $request->drop,
          'user_drop' => $transactionLoan->user_mantri,
        ]);
      }

      if ($request->status == 'gagal') {
        $transactionLoan->update([
          'status' =>  $request->status,
          'user_check' => auth()->user()->employee->id,
          'check_date' => Carbon::now()->format('Y-m-d'),
        ]);
      }

      if ($request->status == 'tolak') {
        $transactionLoan->update([
          'status' =>  $request->status,
          'user_check' => auth()->user()->employee->id,
          'check_date' => Carbon::now()->format('Y-m-d'),
        ]);
      }

      DB::commit();
    } catch (Exception $exception) {
      DB::rollBack();
      ddd($exception);
      return redirect()->back()->with('error', 'Terjadi Kesalahan Mohon Ulangi Lagi');
    }
    return redirect()->back()->with('message', 'Berhasil Menyimpan');
  }



  /**
   * Show the form for editing the specified resource.
   */
  public function index_pinjaman(Request $request)
  {
    $date = $request->date ?? null;
    if ($date) {
      $request->merge(['month' => Carbon::parse($date)->format('Y-m'), 'hari' => AppHelper::dateName($date)]);
    }
    $transaction_date = Carbon::parse($request->month)->endOfMonth() ?? Carbon::now()->endOfMonth();
    $transaction_start_date = $transaction_date->copy()->startOfMonth();
    $begin_transaction = $transaction_date->copy()->startOfMonth()->subMonthNoOverflow(4);

    $branches = AppHelper::branch_permission();
    $branch_id = auth()->user()->can('can show branch') ? ($request->branch_id ?? 1) : auth()->user()->employee->branch_id;
    $wilayah =  auth()->user()->can('can show branch') ? (Branch::find($branch_id)->wilayah ?? 1) : auth()->user()->employee->branch->wilayah;
    $kelompok = auth()->user()->can('can show kelompok') ? ($request->kelompok ?? 1) : auth()->user()->employee->area;
    $hari = $request->hari ?? AppHelper::dateName(Carbon::now()->format('Y-m-d'));
    // dd($hari);

    $groupingId = TransactionLoanOfficerGrouping::where('branch_id', $branch_id)->where('kelompok', $kelompok)->first();

    $transactionSirkulan = TransactionSirculation::where('transaction_loan_officer_grouping_id', $groupingId->id)
      ->where('day', $hari)
      ->whereIn('date', [$transaction_start_date->format('Y-m-d'), $transaction_date->copy()->addDay()->format('Y-m-d')])
      ->get();

    // dd($transactionSirkulan);

    $loan = TransactionLoan::with(
      ['loan_instalment' => function ($item) {
        $item->orderByDesc('transaction_date');
      }, 'manage_customer' => function ($item) {
        $item->with('loan');
      }, 'branch', 'customer', 'loan_officer_grouping']
    )
      ->whereBetween('drop_date', [$begin_transaction, $transaction_date->format('Y-m-d')])
      ->where('hari', $hari)
      ->whereHas('loan_officer_grouping', function ($branch) use ($branch_id, $kelompok) {
        $branch->where('branch_id', $branch_id)->where('kelompok', $kelompok);
      })
      ->where('status', 'success')
      ->orderBy('drop_date')
      ->get()
      ->groupBy(function ($item) {
        return Carbon::parse($item->drop_date)->format('Y-m');
      });

    $ClosedTransaction = TransactionDailyRecap::where('transaction_loan_officer_grouping_id', $groupingId->id)->whereNotNull('daily_kepala_approval')->whereNotNull('daily_kasir_approval')->max('date');

    $loanMl = TransactionLoan::with(
      ['loan_instalment' => function ($item) {
        $item->orderByDesc('transaction_date');
      }, 'manage_customer' => function ($item) {
        $item->with('loan');
      }, 'branch', 'customer', 'loan_officer_grouping']
    )
      ->where('drop_date', "<", $begin_transaction->format('Y-m-d'))
      ->where('hari', $hari)
      ->whereHas('branch', function ($branch) use ($branch_id, $kelompok) {
        $branch->where('branch_id', $branch_id)->where('kelompok', $kelompok);
      })
      ->whereHas('loan_instalment', function ($query) use ($transaction_start_date, $transaction_date) {
        $query->whereBetween('transaction_date', [$transaction_start_date->format('Y-m-d'), $transaction_date->format('Y-m-d')])
          ->where('nominal', '>', 0);
      })
      ->where('status', 'success')
      ->orderBy('drop_date')
      ->get();

    $dataMlGenerate = [
      'month' => "ML",
      'type' => "ml",
      'date' => Carbon::parse($begin_transaction)->subMonthNoOverflow(1)->format('Y-m-d'),
      'data' => $loanMl->map(function ($item) use ($transaction_start_date, $transaction_date) {
        return [
          'tanggal_drop' => $item->drop_date,
          'nama' => $item->customer->nama,
          'alamat' => $item->customer->alamat,
          'nomor_anggota' => $item->manage_customer->id,

          'status_pinjaman' => AppHelper::status_pinjaman($item->loan_instalment->first()?->status),
          'lunas' => $item->loan_instalment->sum('nominal') == $item->pinjaman,
          'pinjaman_ke' => $item->manage_customer->loan->where('drop_date', '<=', $item->drop_date)->where('status', 'success')->count(),
          'drop' => $item->nominal_drop,
          'pinjaman' => $item->pinjaman,
          'hari' => $item->hari,
          'note' => $item->note,
          'nik' => $item->customer->nik,
          'kelompok' => $item->loan_officer_grouping->kelompok,
          'jumlah_angsuran' => $item->loan_instalment->count(),
          'id' => $item->id,
          'instalment' => $item->loan_instalment->reduce(function ($carry, $instalment) {
            $key = Carbon::parse($instalment->transaction_date)->format('Y-m-d');
            $carry[$key] = $instalment->nominal;
            return $carry;
          }, []),
          'x_angs' => $item->loan_instalment->count(),
          'saldo_sebelumnya' => $item->pinjaman - $item->loan_instalment->where('transaction_date', '<', $transaction_start_date->format('Y-m-d'))->sum('nominal'),
          'angsuran' => $item->loan_instalment->whereBetween('transaction_date', [$transaction_start_date->format('Y-m-d'), $transaction_date->format('Y-m-d')])->sum('nominal'),
          'saldo' => $item->pinjaman - $item->loan_instalment->where('transaction_date', '<=', $transaction_date->format('Y-m-d'))->sum('nominal'),
          'notes' => $item->notes
        ];
      })->sortBy('nama')->sortBy('tanggal_drop')->values(),
    ];


    $groupByMonth = $loan->map(function ($item, $key) use ($transaction_date, $transaction_start_date) {
      return [
        'month' => Carbon::parse($key)->format('FY'),
        'type' => AppHelper::generateStatusAngsuranString2(Carbon::parse($key)->startOfMonth()->format('Y-m-d'), $transaction_date->format('Y-m-d')),
        'date' => Carbon::parse($key)->startOfMonth()->format('Y-m-d'),
        'data' => $item->map(function ($item) use ($transaction_start_date, $transaction_date) {
          return [
            'tanggal_drop' => $item->drop_date,
            'nama' => $item->customer->nama,
            'alamat' => $item->customer->alamat,
            'nomor_anggota' => $item->manage_customer->id,

            'status_pinjaman' => AppHelper::status_pinjaman($item->loan_instalment->first()?->status),
            'lunas' => $item->loan_instalment->sum('nominal') == $item->pinjaman,
            'pinjaman_ke' => $item->manage_customer->loan->where('drop_date', '<=', $item->drop_date)->where('status', 'success')->count(),
            'drop' => $item->nominal_drop,
            'pinjaman' => $item->pinjaman,
            'hari' => $item->hari,
            'note' => $item->note,
            'nik' => $item->customer->nik,
            'kelompok' => $item->loan_officer_grouping->kelompok,
            'jumlah_angsuran' => $item->loan_instalment->count(),
            'id' => $item->id,
            'instalment' => $item->loan_instalment->reduce(function ($carry, $instalment) {
              $key = Carbon::parse($instalment->transaction_date)->format('Y-m-d');
              $carry[$key] = $instalment->nominal;
              return $carry;
            }, []),
            'x_angs' => $item->loan_instalment->count(),
            'saldo_sebelumnya' => $item->pinjaman - $item->loan_instalment->where('transaction_date', '<', $transaction_start_date->format('Y-m-d'))->sum('nominal'),
            'angsuran' => $item->loan_instalment->whereBetween('transaction_date', [$transaction_start_date->format('Y-m-d'), $transaction_date->format('Y-m-d')])->sum('nominal'),
            'saldo' => $item->pinjaman - $item->loan_instalment->where('transaction_date', '<=', $transaction_date->format('Y-m-d'))->sum('nominal'),
            'notes' => $item->notes
          ];
        })->sortBy('nama')->sortBy('tanggal_drop')->values(),
      ];
    })->values();

    $mergedData = collect([$dataMlGenerate])->merge($groupByMonth)->values();

    $dateOfWeek = [];
    for ($date = $transaction_start_date; $date->lte($transaction_date); $date->addDay()) {
      if (AppHelper::dateName($date) == $hari) {
        $dateOfWeek[] = $date->copy()->format('Y-m-d');
      }
    }
    return Inertia::render("NewAngsuran/Index", [
      'datas' => $mergedData,
      'dateOfWeek' => $dateOfWeek,
      'sirkulasi' => $transactionSirkulan,
      'select_branch' => auth()->user()->can('can show branch'),
      'select_kelompok' => auth()->user()->can('can show kelompok'),
      'server_filter' => ['closed_transaction' => $ClosedTransaction, 'month' => $transaction_date->format('Y-m'), 'hari' => $hari, 'wilayah' => $wilayah, 'branch' => $branches, 'branch_id' => $branch_id, 'kelompok' => $kelompok, 'groupId' => $groupingId->id],
    ]);
  }
  /**
   * Show the form for editing the specified resource.
   */
  public function index_pinjaman_search(Request $request)
  {
    $transaction_date = Carbon::parse($request->month)->endOfMonth() ?? Carbon::now()->endOfMonth();
    $transaction_start_date = $transaction_date->copy()->startOfMonth();
    $begin_transaction = $transaction_date->copy()->startOfMonth();

    $branches = AppHelper::branch_permission();
    $branch_id = auth()->user()->can('can show branch') ? ($request->branch_id ?? 1) : auth()->user()->employee->branch_id;
    $wilayah =  auth()->user()->can('can show branch') ? (Branch::find($branch_id)->wilayah ?? 1) : auth()->user()->employee->branch->wilayah;
    $kelompok = auth()->user()->can('can show kelompok') ? ($request->kelompok ?? 1) : auth()->user()->employee->area;
    $hari = $request->hari ?? AppHelper::dateName(Carbon::now()->format('Y-m-d'));
    // dd($hari);

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
            'nomor_anggota' => $item->manage_customer->id,

            'status_pinjaman' => AppHelper::status_pinjaman($item->loan_instalment->first()?->status),
            'lunas' => $item->loan_instalment->sum('nominal') == $item->pinjaman,
            'pinjaman_ke' => $item->manage_customer->loan->where('drop_date', '<=', $item->drop_date)->where('status', 'success')->count(),
            'drop' => $item->nominal_drop,
            'pinjaman' => $item->pinjaman,
            'hari' => $item->hari,
            'note' => $item->note,
            'nik' => $item->customer->nik,
            'kelompok' => $item->loan_officer_grouping->kelompok,
            'jumlah_angsuran' => $item->loan_instalment->count(),
            'id' => $item->id,
            'instalment' => $item->loan_instalment->reduce(function ($carry, $instalment) {
              $key = Carbon::parse($instalment->transaction_date)->format('Y-m-d');
              $carry[$key] = $instalment->nominal;
              return $carry;
            }, []),
            'x_angs' => $item->loan_instalment->count(),
            'angsuran' => $item->loan_instalment->sum('nominal'),
            'saldo' => $item->pinjaman - $item->loan_instalment->sum('nominal'),
            'notes' => $item->notes
          ];
        })->sortBy('nama')->sortBy('tanggal_drop')->values(),
      ];
    })->values();

    // ddd($groupByMonth);


    return Inertia::render("NewAngsuran/SearchByDate", [
      'datas' => $groupByMonth,
      'select_branch' => auth()->user()->can('can show branch'),
      'select_kelompok' => auth()->user()->can('can show kelompok'),
      'server_filter' => ['month' => $transaction_date->format('Y-m'), 'hari' => $hari, 'wilayah' => $wilayah, 'branch' => $branches, 'branch_id' => $branch_id, 'kelompok' => $kelompok],
    ]);
  }
  /**
   * This method is used to get the loan details for a TransactionLoan object.
   *
   * @param TransactionLoan $transactionLoan The TransactionLoan object for which the loan details are to be retrieved.
   * @return void
   */
  public function get_loan_pinjaman(TransactionLoan $transactionLoan)
  {

    $loan = $transactionLoan->load(
      [
        'loan_instalment' => function ($item) {
          $item->with('usermantri', 'userinput')
            ->orderByDesc('transaction_date');
        },
        'branch',
        'customer',
        'mantri',
        'loan_officer_grouping'
      ]
    );


    $pinjaman = [
      'nomor_anggota' => $loan->manage_customer->id,
      'id' => $loan->id,
      'nama' => $loan->customer->nama,
      'alamat' => $loan->customer->alamat,
      'nik' => $loan->customer->nik,
      // 'tanggal_pengajuan' => $loan->request_date,
      'tanggal_drop' => $loan->drop_date,
      'hari' => $loan->hari,
      'kelompok' => $loan->loan_officer_grouping->kelompok,
      'branch' => $loan->branch->unit,
      'pinjaman' => $loan->pinjaman,
      'status_pinjaman' => AppHelper::status_pinjaman($loan->loan_instalment->first()?->status),
      'notes' => $loan->notes ?? null,
      'lunas' => $loan->loan_instalment->sum('nominal') == $loan->pinjaman,
      'mantri' => $loan->mantri->nama_karyawan,
    ];

    $saldo = $loan->pinjaman - $loan->loan_instalment->sum('nominal');
    $instalment = $loan->loan_instalment->map(function ($instalment) use (&$saldo) {
      $saldoBefore = $saldo;
      $saldo += $instalment->nominal;

      return [
        'id' => $instalment->id,
        'nominal' => $instalment->nominal,
        'transaction_date' => $instalment->transaction_date,
        'status' => AppHelper::status_pinjaman($instalment->status),
        'danatitipan' => $instalment->danatitipan,
        'mantri' => $instalment->usermantri->nama_karyawan,
        'saldo' => $saldoBefore
      ];
    });


    // ddd([$pinjaman, $instalment]);


    $loan = $transactionLoan->load('loan_instalment');
    return response()->json(['pinjaman' => $pinjaman, 'instalment' => $instalment]);
  }

  /**
   * Update the specified resource in storage.
   */
  public function bayar_pinjaman(Request $request, TransactionLoan $transactionLoan)
  {
    // dd($request->all());
    if (!auth()->user()->hasPermissionTo('can create')) {
      return redirect()->back()->withErrors('Anda Tidak Mempunyai Akses Untuk Melakukan ini');
    }


    $val = $request->validate([
      'type_transaksi' => ['required'],
      'nominal' => ['required_if:type_transaksi,bayar'],
      'transaction_date' => ['required_if:type_transaksi,bayar', 'date'],
    ]);

    $transactionLoan->with('loan_instalment', 'loan_officer_grouping');

    $isPaidToday = $transactionLoan->loan_instalment->where('transaction_date', $request->transaction_date);

    if (!auth()->user()->hasPermissionTo('area')) {
      $user_area = auth()->user()->employee->area;
      if ($transactionLoan->loan_officer_grouping->kelompok == $user_area) {
        return redirect()->back()->withErrors('Anda Tidak Boleh Mengubah Angsuran Yang Ditandatangani Oleh Karyawan Lain');
      };
    }

    if ($request->type_transaksi == 'bayar') {
      if (AppHelper::dateName($request->transaction_date) !== AppHelper::dateName($transactionLoan->drop_date)) {
        return redirect()->back()->withErrors('Hari Tidak Sama');
      }

      if ($isPaidToday->isNotEmpty()) {
        return redirect()->back()->withErrors('Angsuran Hari Ini Sudah Dibayar');
      }

      $totalAngsuran = $transactionLoan->loan_instalment->sum('nominal');
      $pinjaman = $transactionLoan->pinjaman;
      if ($pinjaman == $totalAngsuran || $pinjaman < $totalAngsuran) {
        return redirect()->back()->withErrors('Pinjaman Sudah Lunas');
      }
      if ($transactionLoan->pinjaman < ($totalAngsuran + $request->nominal)) {
        return redirect()->back()->withErrors('Angsuran Tidak Boleh Minus');
      }
    }



    $employee = Employee::where('branch_id', $transactionLoan->loan_officer_grouping->branch_id)->where('area', $transactionLoan->loan_officer_grouping->kelompok)->orderBy('id', 'desc')->first();

    try {
      DB::beginTransaction();
      if ($request->type_transaksi == "bayar") {
        $transactionLoan->loan_instalment()->create([
          'nominal' => $request->nominal,
          'transaction_loan_officer_grouping_id' => $transactionLoan->transaction_loan_officer_grouping_id,
          'transaction_date' => $request->transaction_date,
          'status' => AppHelper::generateStatusAngsuran($transactionLoan->drop_date, $request->transaction_date),
          'danatitipan' => $request->danatitipan,
          'user_input' => auth()->user()->employee->id,
          'user_mantri' => $employee->id,
        ]);
      }

      if ($request->type_transaksi == "notes") {
        // dd($request->all());
        $transactionLoan->notes = $request->notes;
        $transactionLoan->save();
      }


      DB::commit();
    } catch (Exception $e) {
      DB::rollBack();
      dd($e);
      return redirect()->back()->with('error', 'data gagal diubah');
    }
    return redirect()->back()->with('message', 'data berhasil diubah');
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy_angsuran(TransactionLoanInstalment $transactionLoanInstalment)
  {


    try {
      DB::beginTransaction();
      $transactionLoanInstalment->delete();
      DB::commit();
    } catch (Exception $e) {
      DB::rollBack();
      return redirect()->back()->withErrors('data gagal diubah');
    }
    return redirect()->back()->with('message', 'data berhasil diubah');
  }


  public function destroy_loan(TransactionLoan $transactionLoan)
  {
    try {
      DB::beginTransaction();
      $transactionLoan->delete();
      DB::commit();
    } catch (Exception $e) {
      DB::rollBack();
      return redirect()->back()->withErrors('data gagal diubah');
    }
    return redirect()->back()->with('message', 'data berhasil dihapus');
  }

  public function delete_loan(TransactionLoan $transactionLoan)
  {
    try {
      DB::beginTransaction();
      $transactionLoan->delete();
      DB::commit();
    } catch (Exception $e) {
      DB::rollBack();
      return redirect()->back()->withErrors('data gagal diubah');
    }
    return redirect()->back()->with('message', 'data berhasil dihapus');
  }




  public function updateEverything(TransactionLoan $transactionLoan, Request $request)
  {
    // id, transaction_manage_customer_id, transaction_loan_officer_grouping_id, old_id, drop_before, drop_date_before, drop_date, request_date, request_nominal, user_mantri, approved_nominal, check_date, user_check, nominal_drop, user_drop, pinjaman, hari, pinjaman_ke, status, notes, user_input, drop_langsung, created_at, updated_at
    // dd($request->all());

    $validate = $request->validate([
      "updateType" => ['required'],
    ]);

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
      if ($request->updateType == "detailchange") {
        $transactionLoan->update([
          "request_date" => $request->request_date,
          "drop_date" => $request->drop_date,
          "request_nominal" =>  $request->request_nominal,
          "approved_nominal" => $request->approved_nominal,
          "user_check" => $request->approved_nominal ?  ($transactionLoan->user_check ?? auth()->user()->employee->id) : null,
          "check_date" => $request->approved_nominal ?  ($transactionLoan->check_date ?? Carbon::now()) : null,
          "nominal_drop" => $request->nominal_drop,
          "user_drop" => $request->approved_nominal ? ($transactionLoan->user_drop ?? auth()->user()->employee->id)  : null,
          "status" => $request->request_date == $request->drop_date ? 'success' : $transactionLoan->status,
        ]);
      }
      if ($request->updateType == "resetdata") {
        $transactionLoan->update([
          "approved_nominal" => null,
          "check_date" => null,
          "user_check" => null,
          "nominal_drop" => null,
          "user_drop" => null,
          "status" => 'open',
        ]);
        $transactionLoan->loan_instalment()->delete();
      }
      DB::commit();
    } catch (Exception $e) {
      DB::rollBack();
      return redirect()->back()->withErrors('data gagal diubah');
    }



    return redirect()->back()->with('message', 'data berhasil diubah');
  }
}
