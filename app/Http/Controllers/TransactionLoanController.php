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
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TransactionLoanController extends Controller
{
  /**
   * Display a listing of the resource.
   */
  public function index_buku_transaksi(Request $request)
  {

    $branches = AppHelper::branch_permission();
    $branch_id = auth()->user()->can('can show branch') ? ($request->branch_id ?? 1) : auth()->user()->branch->id;
    $wilayah =  auth()->user()->can('can show branch') ? (Branch::find($branch_id)->wilayah ?? 1) : auth()->user()->employee->branch->wilayah;
    $kelompok = auth()->user()->can('can show kelompok') ? ($request->kelompok ?? 1) : auth()->user()->employee->area;
    $transaction_date = $request->date ?? Carbon::now()->format('Y-m-d');
    $groupingId = TransactionLoanOfficerGrouping::where('branch_id', $branch_id)->where('kelompok', $kelompok)->first();


    $loan = TransactionLoan::with('loan_instalment', 'manage_customer', 'customer', 'branch', 'loan_officer_grouping')
      ->where(function ($data) use ($transaction_date) {
        $data->where('drop_date', $transaction_date)
          ->orWhere('request_date', $transaction_date);
      })
      ->whereHas('branch', function ($branch) use ($branch_id, $kelompok) {
        $branch->where('branch_id', $branch_id)
          ->where('kelompok', $kelompok);
      })
      ->orderByDesc('drop_date')
      ->get();


    $pengajuan = $loan->where('drop_date', $transaction_date)->map(function ($rencana_drop) {
      $countPinjaman = TransactionLoan::where('transaction_manage_customer_id', $rencana_drop->manage_customer->id)->where('id', "<", $rencana_drop->id)->where('status', 'success')->orderBy('id', 'desc');
      return [
        'tanggal_pengajuan' => AppHelper::dateName($rencana_drop->request_date) . " : " . Carbon::parse($rencana_drop->request_date)->format('d-m-y'),
        'nama' => $rencana_drop->customer->nama,
        'alamat' => $rencana_drop->customer->alamat,
        'nomor_anggota' => $rencana_drop->manage_customer->id,
        'pinjaman_ke' => $countPinjaman->count('id') + 1,
        'tanggal_drop' => $rencana_drop->drop_date,

        'drop' => $rencana_drop->drop_before,
        'request' => $rencana_drop->request_nominal,
        'acc' => $rencana_drop->approved_nominal,
        'drop_jadi' => $rencana_drop->nominal_drop,

        'check_date' => $rencana_drop->check_date,

        'nomor_pengajuan' => $rencana_drop->id,
        'nik' => $rencana_drop->customer->nik,
        'kelompok' => $rencana_drop->loan_officer_grouping->kelompok,
        'unit' => $rencana_drop->branch->unit,
        'hari' => $rencana_drop->hari,
        'status' => $rencana_drop->status,
        'drop_langsung' => $rencana_drop->drop_langsung ? 'baru' : "lama"
      ];
    })->values();

    $pengajuan_next = $loan->where('request_date', $transaction_date)->where('drop_langsung', 0)->map(function ($rencana_drop) {
      $countPinjaman = TransactionLoan::where('transaction_manage_customer_id', $rencana_drop->manage_customer->id)->where('id', "<", $rencana_drop->id)->where('status', 'success')->orderBy('id', 'desc');
      return [
        'tanggal_pengajuan' => AppHelper::dateName($rencana_drop->request_date) . " : " . Carbon::parse($rencana_drop->request_date)->format('d-m-y'),
        'nama' => $rencana_drop->customer->nama,
        'alamat' => $rencana_drop->customer->alamat,
        'nomor_anggota' => $rencana_drop->manage_customer->id,
        'pinjaman_ke' => $countPinjaman->count('id') + 1,
        'tanggal_drop' => $rencana_drop->drop_date,

        'drop' => $rencana_drop->drop_before,
        'request' => $rencana_drop->request_nominal,
        'acc' => $rencana_drop->approved_nominal,
        'drop_jadi' => $rencana_drop->nominal_drop,

        'check_date' => $rencana_drop->check_date,

        'nomor_pengajuan' => $rencana_drop->id,
        'nik' => $rencana_drop->customer->nik,
        'kelompok' => $rencana_drop->kelompok,
        'unit' => $rencana_drop->branch->unit,
        'hari' => $rencana_drop->hari,
        'status' => $rencana_drop->status,
        'drop_langsung' => $rencana_drop->drop_langsung ? 'baru' : "lama"
      ];
    })->values();

    // rencana drop
    // ddd($pengajuan);


    $daily_recap = TransactionDailyRecap::where('transaction_loan_officer_grouping_id', $groupingId->id)->where('date', $transaction_date)->first();
    $rencana_next = TransactionLoan::where('transaction_loan_officer_grouping_id', $groupingId->id)->where('request_date', $transaction_date)->where('drop_langsung', 0)->sum('request_nominal');

    $buku_rencana_drop = [
      'tanggal' => $transaction_date,
      'is_generated' => $daily_recap ? true : false,
      'kasbon' => $daily_recap ? $daily_recap->kasbon : 0,
      'target' => $daily_recap ? $daily_recap->target : 0,
      'masuk' => (int) round($pengajuan->sum('drop_jadi') * 0.13),
      'keluar' => (int) round($rencana_next * 0.13),
      'storting' => $daily_recap ? TransactionLoan::where('transaction_loan_officer_grouping_id', $groupingId)->where('transaction_date', $transaction_date)->sum('nominal') : 0,
      'baru' => $pengajuan->where('drop_langsung', 'baru')->sum('drop_jadi'),
      'lama' => $pengajuan->where('drop_langsung', 'lama')->sum('drop_jadi'),
      'drop' => $pengajuan->sum('drop_jadi'),
      'rencana' => $pengajuan->where('drop_langsung', 'lama')->sum('acc'),
    ];



    return Inertia::render('BukuTransaksi/BukuTransaksi', [
      'datas' => $pengajuan,
      'buku_rencana' => $buku_rencana_drop,
      'pengajuan_next' => $pengajuan_next,
      'server_filter' => ['date' => $transaction_date, 'wilayah' => $wilayah, 'branch' => $branches, 'branch_id' => $branch_id, 'kelompok' => $kelompok]
    ]);
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
                ->orderByDesc('request_date');;
            },
            'branch',
            'loan_officer_grouping'
          ]);
        }
      ]
    )->where('nik', $request->nik)->first();

    $oldNasabah = $nasabah ? true : false;
    $nasabahHasLoan = $nasabah && !$nasabah->manage_customer->isEmpty() ? true : false;

    if ($nasabahHasLoan) {
      $data = $nasabah->manage_customer->map(function ($cust) {
        return [
          'id' => $cust->id,
          'unit' => $cust->branch->unit,
          'kelompok' => $cust->loan_officer_grouping->kelompok,
          'jumlah_pengajuan' => $cust->loan->count(),
          'jumlah_pinjaman' => $cust->loan->where('status', 'success')->count(),
          'pinjaman' => $cust->loan->map(function ($l) {
            return [
              'loan_id' => $l->id,
              'request_date' => $l->request_date,
              'drop_date' => $l->drop_date,
              'hari' => $l->hari,
              'status' => $l->status,
              'request_nominal' => $l->request_nominal,
              'drop' => $l->nominal_drop,

              'lunas' => !$l->loan_instalment->isEmpty() ? ($l->pinjaman == $l->loan_instalment->sum('nominal') ? true : false) : "",
              'total_angsuran' => !$l->loan_instalment->isEmpty() ? $l->loan_instalment->sum('nominal') : "",
              'pinjaman' => !$l->loan_instalment->isEmpty() ? $l->pinjaman : "",
              'pinjaman_id' => !$l->loan_instalment->isEmpty() ? $l->id : "",
              'status_pinjaman' => !$l->loan_instalment->isEmpty() ? AppHelper::status_pinjaman($l->loan_instalment->first()->status) : "",
            ];
          })->values()
        ];
      })->values();
    }
    return response()->json(['data' => $data ?? null, 'falidate_nik' => $oldNasabah, 'return_nik' => $request->nik]);
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
      $mantri = Employee::where('branch_id', $request->branch)->where('area', $request->kelompok)->first();
      $loan = $manage->loan()->create([
        'transaction_loan_officer_grouping_id' => $officerGrouping->id,
        'request_date' => $request->request_date,
        'user_mantri' => $mantri->id,

        'check_date' => $drop_langsung ? $request->request_date : null,
        'user_check' => $drop_langsung  ? $mantri->id : null,

        'drop_date' => $request->tanggal_drop,
        'user_drop' => $drop_langsung  ? $mantri->id : null,


        'hari' => AppHelper::dateName($request->tanggal_drop),
        'status' => $drop_langsung ? "success" : "open",
        'user_input' => auth()->user()->employee->id,

        'drop_before' => $request['drop_before'],
        'request_nominal' => $request->request_nominal,
        'approved_nominal' => $drop_langsung ? $request->request_nominal : null,
        'nominal_drop' => $drop_langsung ? $request->request_nominal : null,
      ]);


      DB::commit();
    } catch (Exception $exception) {
      DB::rollBack();
      ddd($exception);
      return redirect()->back()->withErrors($exception->getMessage());
    }
    return redirect()->back()->with('success', 'Berhasil Menambahkan Pengajuan');
  }

  /**
   * Display the specified resource.
   */
  public function action_buku_transaksi(TransactionLoan $transactionLoan, Request $request)
  {
    $val = $request->validate([
      'status' => ['required'],
      'approved_nominal' => ['required_if:status,acc'],
      'drop' => ['required_if:status,success'],
    ]);

    try {
      DB::beginTransaction();
      $transactionLoan->update([
        'status' => $request->status,
        'user_check' => auth()->user()->employee->id,
        'check_date' => Carbon::now()->format('Y-m-d'),
        'approved_nominal' => $request->approved_nominal ?? $transactionLoan->approved_nominal,
        'drop' => $request->drop,
      ]);

      DB::commit();
    } catch (Exception $exception) {
      DB::rollBack();
      return redirect()->back()->with('error', 'Terjadi Kesalahan Mohon Ulangi Lagi');
    }
    return redirect()->back()->with('message', 'Berhasil Menyimpan');
  }

  /**
   * Show the form for editing the specified resource.
   */
  public function index_pinjaman(Request $request)
  {
    $transaction_date = Carbon::parse($request->month)->endOfMonth() ?? Carbon::now()->endOfMonth();
    $transaction_start_date = $transaction_date->copy()->startOfMonth();
    $begin_transaction = $transaction_date->copy()->startOfMonth()->subMonthNoOverflow(4);

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
          'saldo' => $item->pinjaman - $item->loan_instalment->where('transaction_date', '<', $transaction_date->format('Y-m-d'))->sum('nominal'),
          'notes' => $item->notes
        ];
      })->sortBy('nama')->sortBy('tanggal_drop')->values(),
    ];


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
            'saldo_sebelumnya' => $item->pinjaman - $item->loan_instalment->where('transaction_date', '<', $transaction_start_date->format('Y-m-d'))->sum('nominal'),
            'angsuran' => $item->loan_instalment->whereBetween('transaction_date', [$transaction_start_date->format('Y-m-d'), $transaction_date->format('Y-m-d')])->sum('nominal'),
            'saldo' => $item->pinjaman - $item->loan_instalment->where('transaction_date', '<', $transaction_date->format('Y-m-d'))->sum('nominal'),
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
      'select_branch' => auth()->user()->can('can show branch'),
      'select_kelompok' => auth()->user()->can('can show kelompok'),
      'server_filter' => ['month' => $transaction_date->format('Y-m'), 'hari' => $hari, 'wilayah' => $wilayah, 'branch' => $branches, 'branch_id' => $branch_id, 'kelompok' => $kelompok],
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
    if (!auth()->user()->hasPermissionTo('can update')) {
      return redirect()->back()->withErrors('Anda Tidak Mempunyai Akses Menghapus');
    }
    $val = $request->validate([
      'type_transaksi' => ['required'],
      'nominal' => ['required_if:type_transaksi,bayar', 'integer'],
      'transaction_date' => ['required_if:type_transaksi,bayar', 'date'],
    ]);

    try {
      DB::beginTransaction();
      if ($request->type_transaksi == "bayar") {
        $transactionLoan->loan_instalment()->create([
          'nominal' => $request->nominal,
          'transaction_loan_officer_grouping_id' => $transactionLoan->transaction_loan_officer_grouping_id,
          'transaction_date' => $request->transaction_date,
          'status' => AppHelper::generateStatusAngsuran($transactionLoan->drop_date, $request->transaction_date),
          'danatitipan' => $request->danatitipan,
          'user_mantri' => auth()->user()->employee->id,
          'user_input' => auth()->user()->employee->id,
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
      return redirect()->back()->with('error', 'data gagal diubah');
    }
    $previousUrl = url()->previous();
    return redirect()->back()->with('message', 'data berhasil diubah');
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy_angsuran(TransactionLoanInstalment $transactionLoanInstalment)
  {

    if (!auth()->user()->hasPermissionTo('can update')) {
      return redirect()->back()->withErrors('Anda Tidak Mempunyai Akses Menghapus');
    }
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
  public function index_pimpinan()
  {
    //
  }
}
