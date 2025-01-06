<?php

namespace App\Http\Controllers;

use App\Helpers\AppHelper;
use App\Models\Branch;
use App\Models\TransactionLoan;
use App\Models\TransactionLoanOfficerGrouping;
use App\Traits\PinjamanTrait;
use App\Traits\RekapTrait;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MobileAppsMantriController extends Controller
{
  use RekapTrait;
  use PinjamanTrait;
  public function index()
  {
    $authorized = auth()->user();
    $branch_id = $authorized->can('can show branch') ? ($request->branch_id ?? 1) : $authorized->employee->branch_id;
    $wilayah = $authorized->can('can show branch') ? (Branch::find($branch_id)->wilayah ?? 1) : $authorized->employee->branch->wilayah;
    $kelompok = $authorized->can('can show kelompok') ? ($request->kelompok ?? 1) : $authorized->employee->area;
    $userAuthorized = AppHelper::branch_permission($authorized, $branch_id);


    $getToday = Carbon::now();
    $getTodayName = AppHelper::dateName($getToday);
    $getCmDate = $getToday->copy()->subMonthsNoOverflow(3)->startOfMonth()->format('Y-m-d');
    $getLancarDate = $getToday->copy()->endOfMonth()->format('Y-m-d');
    $groupingId = TransactionLoanOfficerGrouping::where('branch_id', $branch_id)->where('kelompok', $kelompok)->first();

    $totalPinjaman = TransactionLoan::where('transaction_loan_officer_grouping_id', $groupingId->id)
      ->where('hari', $getTodayName)
      ->whereBetween('drop_date', [$getCmDate, $getLancarDate])->sum('pinjaman');

    // dd($totalPinjaman);
    return Inertia::render('MobileApps/Index');
  }

  public function create()
  {
    // $branch_id = auth()->user()->can('can show branch') ? ($request->branch_id ?? 1) : auth()->user()->employee->branch_id;
    // $groupingId = TransactionLoanOfficerGrouping::where('branch_id', 3)->get();
    // $loan = TransactionLoan::whereIn('transaction_loan_officer_grouping_id', $groupingId->pluck('id'))
    //   ->groupBy('transaction_manage_customer_id') // Mengelompokkan berdasarkan transaction_manage_customer_id
    //   ->havingRaw('COUNT(transaction_manage_customer_id) > 1') // Menyaring hanya yang memiliki lebih dari 1 customer_id
    //   ->get();
    // dd($loan);
    return Inertia::render('MobileApps/Create/Index');
  }

  public function transaksi(Request $request)
  {
    $data = $this->getTransactionLoan($request, true, true);
    return Inertia::render('MobileApps/BukuTransaksiMantri/TransaksiMantri', $data);
  }

  public function angsuran(Request $request)
  {
    $data = $this->getLoan($request, true);


    return Inertia::render("MobileApps/Angsuran/Index", $data);
  }

  public function buku_angsuran(Request $request)
  {
    $data = $this->getLoan($request);
    return Inertia::render("MobileApps/BukuAngsuranMantri/Index", $data);
  }

  public function macet(Request $request)
  {
    $data = $this->getLoanByDate($request);
    return Inertia::render("MobileApps/Angsuran/SearchByDate", $data);
  }

  public function byDates(Request $request)
  {
    $data = $this->getLoanMacet($request);
    return Inertia::render("MobileApps/Angsuran/SearchByDate", $data);
  }


  public function buku_transaksi_kepala(Request $request)
  {
    $data = $this->getTransactionLoan($request, true);
    return Inertia::render('MobileApps/BukuTransaksiKepala/TransaksiMantri', $data);
  }

  public function rencana_drop_kepala(Request $request)
  {
    $data = $this->getRencanaDropKepalaData($request);
    return Inertia::render('MobileApps/RencanaDropKepala/Index', $data);
  }

  public function rekap_permantri(Request $request)
  {
    $data = $this->getRekapPermantriData($request);
    return Inertia::render('MobileApps/Rekap/RekapPerMantri', $data);
  }

  public function rekap_dua(Request $request)
  {
    $data = $this->getRekapDuaData($request);
    return Inertia::render('MobileApps/Rekap/RekapDua', $data);
  }
  public function rekap_satu(Request $request)
  {
    $data = $this->getRekapDuaData($request);
    return Inertia::render('MobileApps/Rekap/RekapSatu', $data);
  }
}
