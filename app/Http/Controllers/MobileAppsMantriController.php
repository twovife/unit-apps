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
    $data['video_tutorials'] = \App\Helpers\VideoTutorial::url(['pelunasan', 'input_angsuran']);
    return Inertia::render("MobileApps/Angsuran/Index", $data);
  }

  // Menu ML: tampilan & filter sama dengan Angsuran Lancar, isinya hanya ML.
  public function ml(Request $request)
  {
    $data = $this->getLoanMantri($request, true, true);
    // Tombol Input ML: kantor migrasi + can-create (mantri, KM, kasir, ...; mantri hanya kelompoknya).
    $migrasi = \App\Helpers\AgregasiScope::sudahMigrasi(\App\Helpers\AuthScope::getActiveBranchId());
    $data['input_ml'] = $migrasi && auth()->user()->hasPermissionTo('can-create');
    // Kantor belum migrasi: Input Macet lama, can-create termasuk mantri (kelompoknya sendiri).
    $data['input_macet'] = !$migrasi && auth()->user()->hasPermissionTo('can-create');
    return Inertia::render("MobileApps/Angsuran/Ml", $data);
  }
}
