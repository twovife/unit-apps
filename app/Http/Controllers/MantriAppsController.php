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
        $date = Carbon::parse($request->date ?? Carbon::now()->format('Y-m'));
        $hari = $request->hari ?? AppHelper::dateName(Carbon::now());
        $kelompok = auth()->user()->employee->area > 0 ? auth()->user()->employee->area : ($request->kelompok ?? 1);
        $previledge = auth()->user()->hasPermissionTo('unit') ? 'unit' : (auth()->user()->hasPermissionTo('area') ? 'mantri' : "pusat");
        $branch = $previledge == "pusat" ? ($request->branch_id ?? 91) : auth()->user()->employee->branch_id;
        $loanRequest = LoanRequest::with('droper', 'customer', 'approver', 'branch')->whereBetween('transaction_date', [$date->startOfMonth()->format('Y-m-d'), $date->endOfMonth()->format('Y-m-d')])->where('hari', $hari)->where('kelompok', $kelompok)->orderByDesc('id')->get();
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
            'server_filters' => ['date' => $date->format('Y-m'), 'kelompok' => $kelompok, 'branch' => $branch, 'previledge' => $previledge, 'hari' => $hari]
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
    }

    function mantri_angsur(Request $request)
    {
        $kelompok = (auth()->user()->hasPermissionTo('area') ? auth()->user()->employee->area : (request()->kelompok ?? 1));
        $hari =  AppHelper::dateName(Carbon::now());
        $tanggal_tude =  Carbon::parse(Carbon::now())->format('Y-m-d');
        $previledge = auth()->user()->hasPermissionTo('unit') ? 'unit' : (auth()->user()->hasPermissionTo('area') ? 'mantri' : "pusat");
        $data = Loan::with('customer', 'mantri', 'branch', 'angsuran')
            ->where('kelompok', $kelompok)
            ->where('hari', $hari)
            ->where('tanggal_drop', "<", $tanggal_tude)
            ->where(function ($query) {
                $query->whereHas('angsuran', function ($subquery) {
                    $subquery->havingRaw('sum(jumlah) < loans.pinjaman');
                })->orWhereDoesntHave('angsuran');
            })
            ->get();

        $loans = $data->map(function ($item) {

            return [
                'id' => $item->id,
                'nomor_pinjaman' => $item->id,
                'nomor_request' => $item->loan_request_id,
                'tanggal_drop' => $item->tanggal_drop,
                'nama' => $item->customer?->nama,
                'nik' => $item->customer?->nik,
                'alamat' => $item->customer?->alamat,

                'kelompok' => $item->kelompok,
                'hari' => $item->hari,
                'bulannumber' => AppHelper::monthNumber($item->tanggal_drop),
                'bulan' => AppHelper::monthName($item->tanggal_drop),

                'pinjaman_ke' => $item->pinjaman_ke,
                'jumlah_angsuran' => $item->angsuran->count('id'),
                'pinjaman' => $item->pinjaman,
                'total_angsuran' => $item->angsuran->sum('jumlah'),
                'saldo_ansuran' => $item->pinjaman -  $item->angsuran->sum('jumlah'),

                'status' => AppHelper::status_pinjaman($item->status),
                'loan_notes' => $item->loan_notes,
                'lunas' => $item->lunas,
                'is_paid' => Carbon::parse(Carbon::now())->format('Y-m-d') == $item->angsuran->max('pembayaran_date') ? 1 : 0,

            ];
        })->sortBy('nama')->sortBy('bulannumber')->sortBy('is_paid')->values();

        // dd($loans);

        $server_filters = ['hari' => $hari, 'kelompok' => $kelompok,  'previledge' => $previledge];
        Session::put('storting_mantri_apps', $server_filters);

        return Inertia::render('Mantri/Storting', [
            'data' => $loans,
            'id' => $request->id,
            'server_filters' => Session::get('storting_mantri_apps')
        ]);
    }

    public function mantri_bayar_angsuran(Loan $loan)
    {
        $batasan = [
            'maxdate' => Carbon::now()->format('Y-m-d'),
            'mindate' => Carbon::parse($loan->angsuran->max('pembayaran_date') ?? $loan->tanggal_drop)->addRealWeek()->format('Y-m-d'),
            'max_angsuran' => $loan->pinjaman - $loan->angsuran->sum('jumlah'),
            'previledge' => auth()->user()->hasPermissionTo('unit') ? 'unit' : (auth()->user()->hasPermissionTo('area') ? 'mantri' : "pusat")
        ];
        return Inertia::render('Mantri/Bayar', [
            'loan' => $loan->load('angsuran', 'droper', 'branch', 'customer'),
            'back_button' => route('mantriapps.angsur', Session::get('storting_mantri_apps')),
            'batasan' => $batasan
        ]);
    }

    public function mantri_bayar_angsuran_post(Loan $loan, Request $request)
    {
        $maksimal_angsuran =  (int)$loan->pinjaman - $loan->angsuran->sum('jumlah');
        $request->validate([
            'jumlah' => ['required', 'numeric', "max:$maksimal_angsuran", 'min:0'],
            'status' => ['required'],
            'pembayaran_date' => ['required'],
        ], [
            '*.required' => 'wajib diisi',
            '*.max' => "Nilai Maksimal Angsuran Adalah $maksimal_angsuran",
            '*.min' => 'Tidak boleh dibawah 0',
        ]);

        $totalAngsuranSebelumnya = $loan->angsuran->sum('jumlah') ?? 0;
        $totalAngsuran = $totalAngsuranSebelumnya + $request->jumlah;
        $hariPembayaran = AppHelper::dateName($request->pembayaran_date);

        if ($loan->hari !== $hariPembayaran) {
            return redirect()->back()->withErrors('Hari Pada Tanggal Berbeda');
        }
        if ($loan->pinjaman < $totalAngsuran) {
            return redirect()->back()->withErrors('Saldo Tidak Boleh Kurang Dari 0');
        }

        try {
            DB::beginTransaction();
            $loan->angsuran()->create([
                "pembayaran_date" => $request->pembayaran_date,
                "jumlah" => $request->jumlah,
                "status" => $request->status,
                "mantri" => auth()->user()->employee->id,
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

        return redirect()->route('mantriapps.bayar', $loan->id)->with('message', 'Angsuran Berhasil Ditambahkan');
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
                    'id' => $item->id,
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
            dd($e);
            return redirect()->back()->withErrors('Terjadi Kesalahan, Refresh / Hubungi IT');
        }
        return redirect()->route('mantriapps.show', $loanRequest->id)->with('message', 'data berhasil ditambahkan');
    }
}
