<?php

namespace App\Http\Controllers;

use App\Helpers\AppHelper;
use App\Models\Customer;
use App\Models\Employee;
use App\Models\Loan;
use App\Models\LoanRequest;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class MantriAppsController extends Controller
{
    public function mantri_index()
    {
        return Inertia::render('Mantri/Index');
    }

    public function mantri_create()
    {
        $previledge = auth()->user()->hasPermissionTo('unit') ? 'unit' : (auth()->user()->hasPermissionTo('area') ? 'mantri' : "pusat");
        $branch = $previledge == "pusat" ? (request()->branch_id ?? 91) : auth()->user()->employee->branch_id;

        $mantri = Employee::where('branch_id', $branch)->when($previledge == 'mantri', function ($que) {
            $que->where('id', auth()->user()->employee_id);
        })->get();


        return Inertia::render('Mantri/Create', [
            'max_date' => Carbon::now()->format('Y-m-d'),
            'min_date' => Carbon::now()->subRealDays(7)->format('Y-m-d'),
            'mantri' => $mantri,
        ]);
    }

    public function mantri_store(Request $request)
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

        if (AppHelper::dateName($request->transaction_date) != AppHelper::dateName($request->tanggal_drop)) {
            return redirect()->back()->withErrors('Hari Tanggal Pinjam dan drop tiadk sama');
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
                'transaction_date' => $request->transaction_date,
                'branch_id' => $mantri->branch_id,
                'mantri' => $request->mantri,
                'kelompok' => $mantri->area,
                'hari' => AppHelper::dateName($request->transaction_date),
                'pinjaman' => $request->pinjaman,
                'tanggal_drop' => $request->tanggal_drop,
                'approved_date' => $request->droplangsung ? $request->tanggal_drop : null,
                'approved_by' => $request->droplangsung ? $request->mantri : null,
                'status' => $request->droplangsung ? 'acc' : 'open',
                'loan_notes' => null,

            ]);
            $loansreq->pinjaman_ke = $customer->load('loan_request')->loan_request->count('id');
            $loansreq->save();

            if ($request->droplangsung) {
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
        $passingData = [
            'id' => $loansreq->id,
            'transaction_date' => $request->transaction_date,
            'kelompok' => $loansreq->kelompok,
        ];
        // $getSessionFilter = Session::get('transaction_index_request');
        return redirect()->route('mantriapps.transaksi', $passingData)->with('message', 'data berhasil ditambahkan');
    }

    function mantri_transaksi(Request $request)
    {
        $date = $request->date ?? Carbon::now()->format('Y-m-d');
        $kelompok = auth()->user()->employee->area > 0 ? auth()->user()->employee->area : ($request->kelompok ?? 1);
        $previledge = auth()->user()->hasPermissionTo('unit') ? 'unit' : (auth()->user()->hasPermissionTo('area') ? 'mantri' : "pusat");
        $branch = $previledge == "pusat" ? ($request->branch_id ?? 91) : auth()->user()->employee->branch_id;
        $loanRequest = LoanRequest::with('droper', 'customer', 'approver', 'branch')->where('transaction_date', $date)->where('kelompok', $kelompok)->orderByDesc('id')->get();
        $data = $loanRequest->map(function ($item) {
            return [
                'id' => $item->id,
                'transaction_date' => $item->transaction_date,
                'tanggal_drop' => $item->tanggal_drop,
                'hari' => $item->hari,
                'nama' => $item->customer->nama,
                'nik' => $item->customer->nik,
                'alamat' => $item->customer->alamat,
                'drop' => $item->pinjaman,

                'kelompok' => $item->kelompok,
                'status' => $item->status,
                'mantri' => $item->droper->nama_karyawan,
            ];
        });

        return Inertia::render('Mantri/Transaksi', [
            'data' => $data,
            'branch' => $branch,
            'id' => $request->id,
            'server_filters' => ['date' => $date, 'kelompok' => $kelompok, 'branch' => $branch, 'previledge' => $previledge]
        ]);
    }

    function mantri_drop(Request $request)
    {
        $date = Carbon::now()->format('Y-m-d');
        $kelompok = auth()->user()->employee->area > 0 ? auth()->user()->employee->area : ($request->kelompok ?? 1);
        $previledge = auth()->user()->hasPermissionTo('unit') ? 'unit' : (auth()->user()->hasPermissionTo('area') ? 'mantri' : "pusat");
        $branch = $previledge == "pusat" ? ($request->branch_id ?? 91) : auth()->user()->employee->branch_id;
        $loanRequest = LoanRequest::with('droper', 'customer', 'approver', 'branch')->where('tanggal_drop', $date)->where('kelompok', $kelompok)->orderByDesc('id')->get();
        $data = $loanRequest->map(function ($item) {
            return [
                'id' => $item->id,
                'transaction_date' => $item->transaction_date,
                'tanggal_drop' => $item->tanggal_drop,
                'hari' => $item->hari,
                'nama' => $item->customer->nama,
                'nik' => $item->customer->nik,
                'alamat' => $item->customer->alamat,
                'drop' => $item->pinjaman,

                'kelompok' => $item->kelompok,
                'status' => $item->status,
                'mantri' => $item->droper->nama_karyawan,
            ];
        });

        return Inertia::render('Mantri/Drop', [
            'data' => $data,
            'branch' => $branch,
            'id' => $request->id,
            'server_filters' => ['date' => $date, 'kelompok' => $kelompok, 'branch' => $branch, 'previledge' => $previledge]
        ]);
        return Inertia::render('Mantri/Drop');
    }

    function mantri_angsur(Request $request)
    {
        // $date = Carbon::now()->format('Y-m-d');
        // $kelompok = auth()->user()->employee->area > 0 ? auth()->user()->employee->area : ($request->kelompok ?? 1);
        // $previledge = auth()->user()->hasPermissionTo('unit') ? 'unit' : (auth()->user()->hasPermissionTo('area') ? 'mantri' : "pusat");
        // $branch = $previledge == "pusat" ? ($request->branch_id ?? 91) : auth()->user()->employee->branch_id;
        // $loanRequest = Loan::with('customer', 'droper', 'branch', 'angsuran')->where('tanggal_drop', $date)->where('kelompok', $kelompok)->orderByDesc('id')->get();
        // $data = $loanRequest->map(function ($item) {
        //     return [
        //         'id' => $item->id,
        //         'transaction_date' => $item->transaction_date,
        //         'tanggal_drop' => $item->tanggal_drop,
        //         'hari' => $item->hari,
        //         'nama' => $item->customer->nama,
        //         'nik' => $item->customer->nik,
        //         'alamat' => $item->customer->alamat,
        //         'drop' => $item->pinjaman,

        //         'kelompok' => $item->kelompok,
        //         'status' => $item->status,
        //         'mantri' => $item->droper->nama_karyawan,
        //     ];
        // });

        // $data = Loan::with('customer', 'mantri', 'branch', 'angsuran')
        //     ->where('tanggal_drop', '<=', $getFilter->end_date)
        //     ->where('hari', $getFilter->transaction_day)
        //     ->where('kelompok', $getFilter->mantri)
        //     ->where('branch_id', $getFilter->branch_id)
        //     ->where(function ($query) use ($getFilter) {
        //         $query->whereHas('angsuran', function ($subquery) use ($getFilter) {
        //             $subquery->where('pembayaran_date', '<=', $getFilter->end_date)
        //                 ->havingRaw('sum(jumlah) < loans.pinjaman');
        //         })->orWhereDoesntHave('angsuran', function ($subquery) use ($getFilter) {
        //             $subquery->where('pembayaran_date', '<=', $getFilter->end_date);
        //         });
        //     })
        //     ->get();
        // ddd($data);
        // $loans = $data->map(function ($item) use ($getFilter) {
        //     $subStartDate = Carbon::parse($getFilter->start_date)->subMonthsNoOverflow(1)->format('Y-m-d');
        //     $subEndDate = Carbon::parse($getFilter->end_date)->subMonthsNoOverflow(1)->format('Y-m-d');
        //     // dd($subEndDate);
        //     return [
        //         'id' => $item->id,
        //         'nomor_pinjaman' => $item->loan_request_id,
        //         'tanggal_drop' => $item->tanggal_drop,
        //         'nama_customer' => $item->customer?->nama,
        //         'nik_customer' => $item->customer?->nik,
        //         'alamat_customer' => $item->customer?->alamat,
        //         'kelompok' => $item->kelompok,
        //         'hari' => $item->hari,
        //         'bulannumber' => AppHelper::monthNumber($item->tanggal_drop),
        //         'bulan' => AppHelper::monthName($item->tanggal_drop),
        //         'pinjaman_ke' => $item->pinjaman_ke,
        //         'jumlah_angsuran' => $item->angsuran->where('pembayaran_date', '<', $getFilter->start_date)->count('id'),
        //         'pinjaman' => $item->pinjaman,
        //         'total_angsuran_bulan_lalu' => $item->angsuran->whereBetween('pembayaran_date', [$subStartDate, $subEndDate])->sum('jumlah'),
        //         'saldo_bulan_lalu' => $item->pinjaman -  $item->angsuran->where('pembayaran_date', '<', $getFilter->start_date)->sum('jumlah'),
        //         'total_angsuran_bulan_ini' => $item->angsuran->whereBetween('pembayaran_date', [$getFilter->start_date, $getFilter->end_date])->sum('jumlah'),
        //         'saldo_bulan_ini' => $item->pinjaman - $item->angsuran->where('pembayaran_date', '<=', $getFilter->end_date)->sum('jumlah'),
        //         'angsuran' => $item->angsuran->whereBetween('pembayaran_date', [$getFilter->start_date, $getFilter->end_date])->map(function ($itemm) {
        //             return [
        //                 'jumlah' => $itemm->jumlah,
        //                 'status' => AppHelper::status_pinjaman($itemm->status),
        //                 'dana_titipan' => $itemm->danatitipan,
        //                 'pembayaran_date' => $itemm->pembayaran_date
        //             ];
        //         })->values(),
        //         'status' => AppHelper::status_pinjaman($item->status),
        //         'loan_notes' => $item->loan_notes,
        //         'lunas' => $item->lunas
        //     ];
        // })->sortBy('nama_customer')->sortBy('bulannumber')->values();


        // return Inertia::render('Mantri/Drop', [
        //     'data' => $loans,
        //     'branch' => $branch,
        //     'id' => $request->id,
        //     'server_filters' => ['date' => $date, 'kelompok' => $kelompok, 'branch' => $branch, 'previledge' => $previledge]
        // ]);
        // return Inertia::render('Mantri/Drop');
    }

    public function mantri_show(LoanRequest $loanRequest)
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

        return Inertia::render('Mantri/Show', [
            'requesttoApprove' => $requesttoApprove,
            'requestHistory' => $requestHistory,
            'loanHistory' => $loanHistory,
            'can_edit' => AppHelper::getCheckAuth('unit'),
            'can_reject' => AppHelper::getCheckAuth('unit'),
            'back_to_index' => route('transaction.index', Session::get('transaction_index_request'))
        ]);
    }

    public function mantri_update(Request $request, LoanRequest $loanRequest)
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
        return redirect()->route('mantriapps.show', $loanRequest->id)->with('message', 'data berhasil ditambahkan');
    }
}
