<?php

namespace App\Http\Controllers;

use App\Models\TransactionLoan;
use Carbon\Carbon;
use Illuminate\Http\Request;

class TransactionLoanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index_buku_transaksi(Request $request)
    {

        // dd(auth()->user()->employee);
        $branch_id = $request->branch_id ?? auth()->user()->employee->branch_id;
        $kelompok = $request->kelompok ?? (auth()->user()->employee->kelompok ?? 5);
        // dd($kelompok);
        $transaction_date = $request->kelompok ?? Carbon::now()->subDays(20)->format('Y-m-d');
        $loan = TransactionLoan::with('loan_instalment', 'loan_nominal', 'manage_customer.customers')
            ->where('request_date', $transaction_date)
            ->where('branch_id', $branch_id)
            ->whereHas('manage_customer', function ($item) use ($kelompok) {
                $item->where('kelompok', $kelompok);
            })
            ->get();

        $pengajuan = $loan->map(function ($rencana_drop) {
            $countPinjaman = TransactionLoan::where('transaction_manage_customer_id', $rencana_drop->manage_customer->id)->where('id', "<", $rencana_drop->id)->where('status', 'acc')->orderBy('id', 'desc');
            return [
                'nomor_pengajuan' => $rencana_drop->id,
                'nomor_anggota' => $rencana_drop->manage_customer->id,
                'pinjaman_ke' => $countPinjaman->count('id') + 1,
                'nama' => $rencana_drop->manage_customer->customers->nama,
                'alamat' => $rencana_drop->manage_customer->customers->alamat,
                'nik' => $rencana_drop->manage_customer->customers->nik,
                'drop' => $rencana_drop->loan_nominal->drop_before,
            ];
        })->values();
        ddd($pengajuan);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(TransactionLoan $transactionLoan)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(TransactionLoan $transactionLoan)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, TransactionLoan $transactionLoan)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TransactionLoan $transactionLoan)
    {
        //
    }
}
