<?php

namespace App\Http\Controllers;

use App\Helpers\AppHelper;
use App\Models\Customer;
use App\Models\Employee;
use App\Models\Instalment;
use App\Models\Loan;
use App\Models\LoanRequest;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class LoanController extends Controller
{


    public function batch_create()
    {
        $branch = auth()->user()->hasPermissionTo('unit') ? auth()->user()->employee->branch_id : (request()->branch_id ?? 1);
        $mantri = Employee::where('jabatan', 'mantri')->where('branch_id', $branch)->orderBy('area')->get();

        return Inertia::render('SuperUser/BatchUpdate', [
            'mantri' => $mantri,
            'back_to_index' => route('transaction.index', Session::get('transaction_index_request'))
        ]);
    }

    public function batch_post(Request $request)
    {

        // dd($request->all());
        $requestData = $request->all();
        // dd($requestData);
        $newCollection = collect();

        $tanggalAngsuranKeys = collect($requestData)->filter(function ($value, $key) {
            return strpos($key, 'tanggal_angsuran') !== false;
        })->keys();



        foreach ($tanggalAngsuranKeys as $key) {
            $index = str_replace('tanggal_angsuran_', '', $key);
            $tanggalAngsuran = $requestData[$key];
            $angsuran = $requestData['angsuran_' . $index];
            $danatitipan = $requestData['danatitipan_' . $index] ?? false;
            $statusAngsuran = $requestData['status_angsuran_' . $index];
            $angsuran = $requestData['angsuran_' . $index];

            // Menambahkan data ke dalam koleksi baru
            $newCollection->push([
                'pembayaran_date' => $tanggalAngsuran,
                'jumlah' => $angsuran,
                'danatitipan' => $danatitipan,
                'status' => $statusAngsuran,
                'mantri' => $request->mantri
            ]);
        }

        try {
            DB::beginTransaction();

            $customer = Customer::firstOrCreate(['nik' => $request->nik], [
                "nama" => $request->nama,
                "nik" => $request->nik,
                "no_kk" => $request->no_kk,
                "alamat" => $request->alamat,

                "unit_id" => $request->unit_id,
                "mantri" => $request->mantri,
                "area" => $request->area,
            ]);

            $mantri = Employee::find($request->mantri);




            $loansreq = $customer->loan_request()->create([
                'transaction_date' => Carbon::parse($request->tanggal_drop)->subRealWeeks(1)->format('Y-m-d'),
                'branch_id' => $mantri->branch_id,
                'mantri' => $request->mantri,
                'kelompok' => $mantri->area,
                'hari' => AppHelper::dateName($request->tanggal_drop),
                'pinjaman' => $request->pinjaman,
                'tanggal_drop' => $request->tanggal_drop,
                'approved_date' => Carbon::parse($request->tanggal_drop)->subRealWeeks(1)->format('Y-m-d'),
                'approved_by' => $request->mantri,
                'status' => 'acc',
                'loan_notes' => null,

            ]);
            $loansreq->pinjaman_ke = $customer->load('loan_request')->loan_request->count('id');
            $loansreq->save();

            $loans =   $loansreq->loan()->create([
                'customer_id' => $customer->id,
                'branch_id' => $loansreq->branch_id,
                'mantri' => $loansreq->mantri,
                'kelompok' => $loansreq->kelompok,
                'hari' => $loansreq->hari,
                'drop' => $loansreq->pinjaman,
                'pinjaman' =>  $loansreq->pinjaman + ($request->pinjaman * 0.3),

                'lunas' => 'belum lunas',
                'status' => 1,
                'tanggal_drop' => $loansreq->tanggal_drop,
                'loan_notes' => $loansreq->loan_notes,
            ]);
            $loans->pinjaman_ke = $customer->load('loan')->loan->count('id');


            if ($loans->pinjaman < $newCollection->sum('jumlah')) {
                DB::rollBack();
                return redirect()->back()->withErrors('Terjadi Kesalahan, Refresh / Hubungi IT');
            }

            if ($loans->pinjaman == $newCollection->sum('jumlah')) {
                $loans->lunas = 'lunas';
            }
            $loans->save();

            $loans->angsuran()->createMany($newCollection->toArray());


            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            dd($e);
            return redirect()->back()->withErrors('Terjadi Kesalahan, Refresh / Hubungi IT');
        }

        // $getSessionFilter = Session::get('transaction_index_request');
        return redirect()->route('batchupdate.batch_create')->with('message', 'data berhasil ditambahkan');
    }
    public function getCustomerLoan(Request $request)
    {
        $validate = $request->validate([
            'nik' => ['required', 'digits:16']
        ], [
            'required' => 'Harus Di isi',
            'digits' => 'Angka Harus 16 Digit'
        ]);

        $customer = Customer::with('loan.droper')->where('nik', $request->nik)->first();

        $data = $customer?->loan->map(function ($item) {
            $pembayaran_cicilan = $item->angsuran?->sum('jumlah') ?? 0;
            $lunas = $item->pinjaman - $pembayaran_cicilan == 0 ? 'Lunas' : "Belum Lunas";
            return [
                'id' => $item->id,
                'tanggal_drop' => $item->tanggal_drop,
                'nik' => $item->customer->nik,
                'customer_id' => $item->customer->id,
                'customer_name' => $item->customer->nama,
                'mantri_name' => $item->droper->nama_karyawan,
                'kelompok' => $item->kelompok,
                'wilayah' => $item->branch->wilayah,
                'unit' => $item->branch->unit,
                'drop' => $item->drop,
                'pinjaman' => $item->pinjaman,
                'cicilan' => $pembayaran_cicilan,
                // 'cicilan' => $pembayaran_cicilan,
                'lunas' => $lunas,
                'status' => AppHelper::status_pinjaman($item->status),

            ];
        });

        // dd($data);

        return response()->json(['data' => $data ?? null, 'reqistered_customer' => $customer ?? null]);
    }

    public function index_transaction()
    {
        $getFilter = new \stdClass;
        $getFilter = (object) request()->all();
        $getFilter->transaction_date = Carbon::parse(request()->transaction_date ?? Carbon::now())->format('Y-m');
        $getFilter->hari =  request()->hari ?? AppHelper::dateName(Carbon::now());
        // $getFilter->transaction_date = Carbon::parse(request()->transaction_date ?? Carbon::now())->format('Y-m-d');
        $getFilter->start_date = Carbon::parse(request()->transaction_date ?? Carbon::now())->startOfMonth()->format('Y-m-d');
        $getFilter->end_date = Carbon::parse(request()->transaction_date ?? Carbon::now())->endOfMonth()->format('Y-m-d');
        $getFilter->branch_id = auth()->user()->hasPermissionTo('unit') ? auth()->user()->employee->branch_id : (request()->branch_id ?? 1);
        $getFilter->mantri = auth()->user()->hasPermissionTo('area') ? auth()->user()->employee->area : (request()->mantri ?? 1);

        $data = LoanRequest::with('customer', 'droper', 'branch', 'approver')->whereBetween('transaction_date', [$getFilter->start_date, $getFilter->end_date])->where('hari', $getFilter->hari)->where('kelompok', $getFilter->mantri)->get();
        $loans = $data->map(function ($item) {
            return [
                'id' => $item->id,
                'transaction_date' => $item->transaction_date,
                'customer_nik' => $item->customer?->nik,
                'customer_nama' => $item->customer?->nama,
                'customer_alamat' => $item->customer?->alamat,
                'droper' => $item->droper?->nama_karyawan,
                'kelompok' => $item->kelompok,
                'hari' => $item->hari,
                'pinjaman' => $item->pinjaman,
                'pengajuan_ke' => $item->pinjaman_ke,
                'tanggal_drop' => $item->tanggal_drop,
                'tanggal_approve' => $item->approved_date,
                'approver' => $item->approver?->nama_karyawan,
                'status' => $item->status,
            ];
        })->values();

        // save the request data
        // $dataSession = request()->all();
        // dd($dataSession);
        Session::put('transaction_index_request', (array)$getFilter);

        return Inertia::render('Transaksi/Index', [
            'loans' => $loans,
            'server_filters' => $getFilter
        ]);
    }

    public function index_transaction_open()
    {
        $getFilter = new \stdClass;
        $getFilter = (object) request()->all();
        $getFilter->branch_id = auth()->user()->hasPermissionTo('unit') ? auth()->user()->employee->branch_id : (request()->branch_id ?? 1);
        $getFilter->mantri = auth()->user()->hasPermissionTo('area') ? auth()->user()->employee->area : (request()->mantri ?? 1);

        $data = LoanRequest::with('customer', 'droper', 'branch', 'approver')->where('kelompok', $getFilter->mantri)->where('status', 'open')->get();
        $loans = $data->map(function ($item) {
            return [
                'id' => $item->id,
                'transaction_date' => $item->transaction_date,
                'customer_nik' => $item->customer?->nik,
                'customer_nama' => $item->customer?->nama,
                'customer_alamat' => $item->customer?->alamat,
                'droper' => $item->droper?->nama_karyawan,
                'kelompok' => $item->kelompok,
                'hari' => $item->hari,
                'pinjaman' => $item->pinjaman,
                'pengajuan_ke' => $item->pinjaman_ke,
                'tanggal_drop' => $item->tanggal_drop,
                'tanggal_approve' => $item->approved_date,
                'approver' => $item->approver?->nama_karyawan,
                'status' => $item->status,
            ];
        })->values();

        Session::put('transaction_index_request', (array)$getFilter);

        return Inertia::render('Transaksi/IndexOpen', [
            'loans' => $loans,
            'server_filters' => $getFilter
        ]);
    }


    public function create_transaction()
    {
        $branch = auth()->user()->hasPermissionTo('unit') ? auth()->user()->employee->branch_id : (request()->branch_id ?? 1);
        $mantri = Employee::where('jabatan', 'mantri')->where('branch_id', $branch)->orderBy('area')->get();

        return Inertia::render('Transaksi/Create', [
            'max_date' => Carbon::now()->format('Y-m-d'),
            'min_date' => Carbon::now()->subRealDays(7)->format('Y-m-d'),
            'mantri' => $mantri,
            'back_to_index' => route('transaction.index', Session::get('transaction_index_request'))
        ]);
        // dd('create');
    }

    public function store_transaction(Request $request)
    {
        // dd($request->all());
        $validate = $request->validate([
            "transaction_date" => ['required'],
            "tanggal_drop" => ['required'],
            "customer_id" => ['required_if:type_create,2'],
            "nama" => ['required_if:type_create,1'],
            "nik" => ['required_if:type_create,1'],
            "alamat" => ['required_if:type_create,1'],
            "mantri" => ['required'],
            "pinjaman" => ['required'],
            "type_create" => ['required']
        ], [
            "required_if" => 'Wajib Di isikan',
            "required" => "Wajib Di Isikan"
        ]);

        try {
            DB::beginTransaction();

            $customer = Customer::firstOrCreate(['nik' => $request->nik], [
                "nama" => $request->nama,
                "nik" => $request->nik,
                "no_kk" => $request->no_kk,
                "alamat" => $request->alamat,

                "unit_id" => $request->unit_id,
                "mantri" => $request->mantri,
                "area" => $request->area,
            ]);

            $mantri = Employee::find($request->mantri);

            $dropLangsung = $request->tanggal_drop == $request->transaction_date ? true : false;


            $loansreq = $customer->loan_request()->create([
                'transaction_date' => $request->transaction_date,
                'branch_id' => $mantri->branch_id,
                'mantri' => $request->mantri,
                'kelompok' => $mantri->area,
                'hari' => AppHelper::dateName($request->transaction_date),
                'pinjaman' => $request->pinjaman,
                'tanggal_drop' => $request->tanggal_drop,
                'approved_date' => $dropLangsung ? $request->tanggal_drop : null,
                'approved_by' => $dropLangsung ? $request->mantri : null,
                'status' => $dropLangsung ? 'acc' : 'open',
                'loan_notes' => null,

            ]);
            $loansreq->pinjaman_ke = $customer->load('loan_request')->loan_request->count('id');
            $loansreq->save();

            if ($dropLangsung) {
                $loans =   $loansreq->loan()->create([
                    'customer_id' => $customer->id,
                    'branch_id' => $loansreq->branch_id,
                    'mantri' => $loansreq->mantri,
                    'kelompok' => $loansreq->kelompok,
                    'hari' => $loansreq->hari,
                    'drop' => $loansreq->pinjaman,
                    'pinjaman' =>  $loansreq->pinjaman + ($request->pinjaman * 0.3),

                    'lunas' => 'belum lunas',
                    'status' => 1,
                    'tanggal_drop' => $loansreq->tanggal_drop,
                    'loan_notes' => $loansreq->loan_notes,
                ]);
                $loans->pinjaman_ke = $customer->load('loan')->loan->count('id');
                $loans->save();
            };

            // dd($customer);

            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors('Terjadi Kesalahan, Refresh / Hubungi IT');
        }

        $getSessionFilter = Session::get('transaction_index_request');
        return redirect()->route('transaction.index', $getSessionFilter)->with('message', 'data berhasil ditambahkan');
    }




    public function show_transaction(LoanRequest $loanRequest)
    {
        $customer = $loanRequest->customer;
        $historyRequestes = LoanRequest::where('customer_id', $customer->id)->get();
        $historyLoans = Loan::where('customer_id', $customer->id)->get();


        $requesttoApprove = [
            'tanggal_pengajuan' => $loanRequest->transaction_date,
            'id' => $loanRequest->id,
            'customer_name' => $loanRequest->customer->nama,
            'customer_nik' => $loanRequest->customer->nik,
            'customer_alamat' => $loanRequest->customer->alamat,
            'unit' => $loanRequest->branch->unit,
            'kelompok' => $loanRequest->kelompok,
            'hari' => $loanRequest->hari,
            'drop' => $loanRequest->pinjaman,
            'tanggal_drop' => $loanRequest->tanggal_drop,

            'mantri_name' => $loanRequest->droper->nama_karyawan,
            'pengajuan_ke' => $loanRequest->pinjaman_ke,
            'status' => $loanRequest->status,
            'instalment' => $loanRequest->loan?->angsuran?->count('id') ?? 0
        ];

        // dd($requesttoApprove);
        $requestHistory =  $historyRequestes->map(function ($item) {
            return
                [
                    'id' => $item->id,
                    'tanggal_pengajuan' => $item->transaction_date,
                    'tanggal_drop' => $item->tanggal_drop,
                    'hari' => $item->hari,
                    'unit' => $item->branch->unit,
                    'kelompok' => $item->kelompok,
                    'mantri_name' => $item->droper->nama_karyawan,
                    'customer_name' => $item->customer->nama,
                    'drop' => $item->pinjaman,
                    'pengajuan_ke' => $item->pinjaman_ke,
                    'status' => $item->status
                ];
        });
        // dd($requestHistory);
        $loanHistory =  $historyLoans->map(function ($item) {
            return
                [
                    'id' => $item->loan_request_id,
                    'tanggal_drop' => $item->tanggal_drop,
                    'hari' => $item->hari,
                    'unit' => $item->branch->unit,
                    'kelompok' => $item->kelompok,
                    'mantri_name' => $item->droper->nama_karyawan,
                    'drop' => $item->drop,
                    'pinjaman' => $item->pinjaman,
                    'juml_pembayaran' => $item->angsuran->count('id'),
                    'saldo' => $item->pinjaman - $item->angsuran->sum('jumlah'),
                    'pinjaman_ke' => $item->pinjaman_ke,
                    'status' => AppHelper::status_pinjaman($item->status),
                ];
        });



        return Inertia::render('Transaksi/Show', [
            'requesttoApprove' => $requesttoApprove,
            'requestHistory' => $requestHistory,
            'loanHistory' => $loanHistory,
            'back_to_index' => route('transaction.index', Session::get('transaction_index_request'))
        ]);
    }



    public function update_transaction(Request $request, LoanRequest $loanRequest)
    {
        $request->validate([
            'action' => ['required', Rule::in([1, 2, 3])]
        ]);

        try {
            DB::beginTransaction();
            $loanRequest->status = $request->action == 1 ? "acc" : "tolak";
            $loanRequest->approved_by = auth()->user()->employee->id;
            $loanRequest->approved_date = Carbon::now();

            if ($request->action == 1) {
                $loans =   $loanRequest->loan()->create([
                    'customer_id' => $loanRequest->customer_id,
                    'branch_id' => $loanRequest->branch_id,
                    'mantri' => $loanRequest->mantri,
                    'kelompok' => $loanRequest->kelompok,
                    'hari' => $loanRequest->hari,
                    'drop' => $loanRequest->pinjaman,
                    'pinjaman' =>  $loanRequest->pinjaman + ($loanRequest->pinjaman * 0.3),

                    'lunas' => 'belum lunas',
                    'status' => 1,
                    'tanggal_drop' => $loanRequest->tanggal_drop,
                    'loan_notes' => $loanRequest->loan_notes,
                ]);
                $loans->pinjaman_ke = $loanRequest->customer->loan->count('id');
                $loans->save();
            }

            if ($request->action == 3) {
                $loanRequest->loan()->delete();
            }
            $loanRequest->save();
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors('Terjadi Kesalahan, Refresh / Hubungi IT');
        }
        return redirect()->route('transaction.show', $loanRequest->id)->with('message', 'data berhasil ditambahkan');
    }


    public function index_angsuran_normal()
    {
        $getFilter = new \stdClass;
        $getFilter = (object) request()->all();
        $getFilter->transaction_date = Carbon::parse(request()->transaction_date ?? Carbon::now())->format('Y-m');
        $getFilter->transaction_day = request()->transaction_day ?? AppHelper::dateName(Carbon::now()->format('Y-m-d'));
        $getFilter->start_date = Carbon::parse(request()->transaction_date ?? Carbon::now())->startOfMonth()->format('Y-m-d');
        $getFilter->end_date = Carbon::parse(request()->transaction_date ?? Carbon::now())->endOfMonth()->format('Y-m-d');

        // dd($getFilter->start_date);

        $getFilter->branch_id = auth()->user()->hasPermissionTo('unit') ? auth()->user()->employee->branch_id : (request()->branch_id ?? auth()->user()->employee->branch_id);
        $getFilter->mantri = auth()->user()->hasPermissionTo('area') ? auth()->user()->employee->area : (request()->mantri ?? 1);


        $start_date = Carbon::parse(request()->transaction_date ?? Carbon::now())->startOfMonth();
        $end_date = Carbon::parse(request()->transaction_date ?? Carbon::now())->endOfMonth();
        $dateOfWeek = [];
        for ($date = $start_date; $date->lte($end_date); $date->addDay()) {
            if (AppHelper::dateName($date) == $getFilter->transaction_day) {
                $dateOfWeek[] = $date->copy()->format('Y-m-d');
            }
        }


        $data = Loan::with('customer', 'mantri', 'branch', 'angsuran')
            ->where('tanggal_drop', '<=', $getFilter->end_date)
            ->where('hari', $getFilter->transaction_day)
            ->where('kelompok', $getFilter->mantri)
            ->where('branch_id', $getFilter->branch_id)
            ->where(function ($query) use ($getFilter) {
                $query->whereHas('angsuran', function ($subquery) use ($getFilter) {
                    $subquery->where('pembayaran_date', '<=', $getFilter->end_date)
                        ->havingRaw('sum(jumlah) < loans.pinjaman');
                })->orWhereDoesntHave('angsuran', function ($subquery) use ($getFilter) {
                    $subquery->where('pembayaran_date', '<=', $getFilter->end_date);
                });
            })
            ->get();
        // ddd($data);
        $loans = $data->map(function ($item) use ($getFilter) {
            $subStartDate = Carbon::parse($getFilter->start_date)->subMonthsNoOverflow(1)->format('Y-m-d');
            $subEndDate = Carbon::parse($getFilter->end_date)->subMonthsNoOverflow(1)->format('Y-m-d');
            // dd($subEndDate);
            return [
                'id' => $item->id,
                'nomor_pinjaman' => $item->id,
                'nomor_request' => $item->loan_request_id,
                'tanggal_drop' => $item->tanggal_drop,
                'nama_customer' => $item->customer?->nama,
                'nik_customer' => $item->customer?->nik,
                'alamat_customer' => $item->customer?->alamat,
                'kelompok' => $item->kelompok,
                'hari' => $item->hari,
                'bulannumber' => AppHelper::monthNumber($item->tanggal_drop),
                'bulan' => AppHelper::monthName($item->tanggal_drop),
                'pinjaman_ke' => $item->pinjaman_ke,
                'jumlah_angsuran' => $item->angsuran->where('pembayaran_date', '<', $getFilter->start_date)->count('id'),
                'pinjaman' => $item->pinjaman,
                'total_angsuran_bulan_lalu' => $item->angsuran->whereBetween('pembayaran_date', [$subStartDate, $subEndDate])->sum('jumlah'),
                'saldo_bulan_lalu' => $item->pinjaman -  $item->angsuran->where('pembayaran_date', '<', $getFilter->start_date)->sum('jumlah'),
                'total_angsuran_bulan_ini' => $item->angsuran->whereBetween('pembayaran_date', [$getFilter->start_date, $getFilter->end_date])->sum('jumlah'),
                'saldo_bulan_ini' => $item->pinjaman - $item->angsuran->where('pembayaran_date', '<=', $getFilter->end_date)->sum('jumlah'),
                'angsuran' => $item->angsuran->whereBetween('pembayaran_date', [$getFilter->start_date, $getFilter->end_date])->map(function ($itemm) {
                    return [
                        'jumlah' => $itemm->jumlah,
                        'status' => AppHelper::status_pinjaman($itemm->status),
                        'dana_titipan' => $itemm->danatitipan,
                        'pembayaran_date' => $itemm->pembayaran_date
                    ];
                })->values(),
                'status' => AppHelper::status_pinjaman($item->status),
                'loan_notes' => $item->loan_notes,
                'lunas' => $item->lunas
            ];
        })->sortBy('nama_customer')->sortBy('bulannumber')->values();

        // dd($loans);

        Session::put('index_angsuran_normal', (array)$getFilter);

        return Inertia::render('Angsuran/Normal/Index', [
            'loans' => $loans,
            'server_filters' => $getFilter,
            'dateOfWeek' => $dateOfWeek
        ]);
    }


    public function create_angsuran_normal()
    {

        // dd('create');
    }

    public function store_angsuran_normal(Request $request)
    {
        //
    }


    public function show_angsuran_normal(Loan $loan)
    {

        $dataloan = [
            'id' => $loan->id,
            'nomor_pinjaman' => $loan->id,
            'nomor_request' => $loan->loan_request_id,
            'nama_customer' => $loan->customer->nama,
            'nik_customer' => $loan->customer->nik,

            'unit' => $loan->branch->unit,
            'kelompok' => $loan->kelompok,
            'mantri' => $loan->droper->nama_karyawan,
            'mantri_id' => $loan->droper?->id,

            'tanggal_drop' => $loan->tanggal_drop,
            'hari' => $loan->hari,
            'pinjaman' => $loan->pinjaman,
            'status' =>   AppHelper::status_pinjaman($loan->status),
            'loan_notes' =>   $loan->loan_notes,
        ];

        // dd($dataloan);
        $saldos = $loan->pinjaman;
        $instalment = $loan->angsuran->map(function ($item) use (&$saldos) {
            $saldos = $saldos - $item->jumlah;
            return [
                'tanggal_pembayaran' => $item->pembayaran_date,
                'jumlah' => $item->jumlah,
                'saldo' => $saldos,
                'danatitipan' => $item->danatitipan,
                'mantri' => $item->picmantri?->nama_karyawan,
                'status' => AppHelper::status_pinjaman($item->status),
            ];
        })->sortByDesc('tanggal_pembayaran')->values();

        $branch = auth()->user()->hasPermissionTo('unit') ? auth()->user()->employee->branch_id : (request()->branch_id ?? 1);
        $mantri = Employee::where('jabatan', 'mantri')->where('branch_id', $branch)->orderBy('area')->get();
        //         dd($instalment);
        return Inertia::render('Angsuran/Normal/Show', [
            'loan' => $dataloan,
            'instalment' => $instalment,
            'min_date' =>  "2023-01-01",
            // 'min_date' =>  $loan->angsuran->max('pembayaran_date'),
            'max_date' => "2024-12-31",
            // 'max_date' => Carbon::now()->format('Y-m-d'),
            'back_to_index' => route('transaction.index', Session::get('index_angsuran_normal')),
            'mantri' => $mantri,
        ]);
    }





    public function update_angsuran_normal(Request $request, Loan $loan)
    {
        $maksimal_angsuran = $loan->pinjaman - $loan->angsuran->sum('jumlah');
        $request->validate([
            'jumlah' => ['required', "max:$maksimal_angsuran", 'min:0'],
            'mantri' => ['required'],
            'status' => ['required'],
            'tanggal_pembayaran' => ['required'],
        ]);


        $totalAngsuranSebelumnya = $loan->angsuran->sum('jumlah') ?? 0;
        $totalAngsuran = $totalAngsuranSebelumnya + $request->jumlah;
        $hariPembayaran = AppHelper::dateName($request->tanggal_pembayaran);

        if ($loan->hari !== $hariPembayaran) {
            return redirect()->back()->withErrors('Bukan Hari Pembayaran');
        }
        if ($loan->pinjaman < $totalAngsuran) {
            return redirect()->back()->withErrors('Saldo Tidak Boleh Kurang Dari 0');
        }

        try {
            DB::beginTransaction();
            $loan->angsuran()->create([
                "pembayaran_date" => $request->tanggal_pembayaran,
                "jumlah" => $request->jumlah,
                "status" => $request->status,
                "mantri" => $request->mantri,
                "danatitipan" => $request->danatitipan == 1 ? 'true' : 'false',
            ]);
            $loan->status = $request->status;
            if ($loan->pinjaman - $totalAngsuran == 0) {
                $loan->lunas = "lunas";
            }
            $loan->save();
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors('Gagal Menyimpan Angsuran, Refresh / Hub IT');
        }

        return redirect()->route('pinjaman.normal.show', $loan->id)->with('message', 'Angsuran Berhasil Ditambahkan');
    }

    public function update_jenis_nasabah(Request $request, Loan $loan)
    {
        $request->validate([
            'loan_notes' => ['required']
        ]);

        try {
            DB::beginTransaction();
            $loan->loan_notes = $request->loan_notes;
            $loan->save();
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors('Gagal Menyimpan Angsuran, Refresh / Hub IT');
        }

        return redirect()->route('pinjaman.normal.show', $loan->id)->with('message', 'Angsuran Berhasil Ditambahkan');
    }
}
