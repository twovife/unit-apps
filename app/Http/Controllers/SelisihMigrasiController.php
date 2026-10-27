<?php

namespace App\Http\Controllers;

use App\Helpers\AuthScope;
use App\Helpers\SelisihMigrasi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

/** Cek Selisih Migrasi (superuser): saldo awal vs bucket serah terima. Logika: App\Helpers\SelisihMigrasi. */
class SelisihMigrasiController extends Controller
{
    private function pastikanSuperuser(): void
    {
        abort_unless(auth()->user()->hasRole('superuser'), 403, 'Cek selisih migrasi hanya untuk superuser.');
    }

    public function index(Request $request)
    {
        $this->pastikanSuperuser();
        $semuaKantor = $request->boolean('semua_kantor');
        $branchIds = $semuaKantor
            ? DB::table('branches')->whereNotNull('mulai_pendataan_baru')->pluck('id')->all()
            : [(int) AuthScope::getActiveBranchId()];

        return Inertia::render('Migrasi/SelisihMigrasi', [
            'semua_kantor' => $semuaKantor,
            'unit' => DB::table('branches')->where('id', AuthScope::getActiveBranchId())->value('unit'),
            'migrasi' => DB::table('branches')->where('id', AuthScope::getActiveBranchId())->value('mulai_pendataan_baru'),
            'baris' => SelisihMigrasi::pindai($branchIds),
        ]);
    }

    public function sesuaikanMl(Request $request)
    {
        $this->pastikanSuperuser();
        $v = $request->validate([
            'grouping_id' => ['required', 'integer'],
            'hari' => ['required', 'in:senin,selasa,rabu,kamis,jumat,sabtu'],
        ]);
        try {
            $h = SelisihMigrasi::sesuaikanMl((int) $v['grouping_id'], $v['hari'], auth()->user());
        } catch (\RuntimeException $e) {
            return back()->withErrors($e->getMessage());
        }

        return back()->with('message', "MACET LAMA {$h['kantor']} kel {$h['kelompok']} {$h['hari']} disesuaikan, ML sekarang sama dengan bucket.");
    }
}
