<?php

namespace App\Http\Controllers;


use App\Traits\PinjamanTrait;
use App\Traits\RekapTrait;
use Illuminate\Http\Request;
use Inertia\Inertia;

// Menu mobile_apps yang identik dengan menu web sudah dihapus (transaksi, macet,
// byDates, rekap-*, rencana-drop-kepala, landing). Yang tersisa cuma yang belum
// punya padanan web 1:1: input pengajuan (create) dan angsuran per-mantri.
class MobileAppsMantriController extends Controller
{
  use RekapTrait;
  use PinjamanTrait;

  public function create()
  {
    // User tanpa kelompok di cabang aktif (mis. pusat, area 0) tak bisa create:
    // hasil grouping null -> dulu fatal di store. Tolak di depan.
    if (!\App\Helpers\AppHelper::canCreateLoan()) {
      return redirect()->route('transaction.index_buku_transaksi')
        ->with('message', 'Tidak bisa input pengajuan: tidak ada kelompok di cabang aktif ini.');
    }

    return Inertia::render('MobileApps/Create/Index');
  }

  public function angsuran(Request $request)
  {
    $data = $this->getLoanMantri($request, true);
    return Inertia::render("MobileApps/Angsuran/Index", $data);
  }
}
