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
use App\Models\TransactionSirculation;
use App\Traits\PinjamanTrait;
use App\Traits\RekapTrait;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class MobileAppsMantriController extends Controller
{
  use RekapTrait;
  use PinjamanTrait;
  public function index()
  {

    return Inertia::render('MobileApps/Index');
  }



  public function create()
  {
    return Inertia::render('MobileApps/Create/Index');
  }



  public function transaksi(Request $request)
  {


    $data = $this->getTransactionLoan($request, true, true);

    // dd($data);
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

    // ddd($groupByMonth)

    // ddd($groupByMonth);

    $data = $this->getLoanByDate($request);
    return Inertia::render("MobileApps/Angsuran/SearchByDate", $data);
  }


  public function buku_transaksi_kepala(Request $request)
  {

    $data = $this->getTransactionLoan($request, true);
    // dd($data);
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
