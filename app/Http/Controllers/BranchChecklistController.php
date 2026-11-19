<?php

namespace App\Http\Controllers;

use App\Helpers\AuthScope;
use App\Models\Branch;
use App\Models\BranchChecklist;
use App\Models\InvCategory;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

/**
 * Checklist Aplikasi Baru (mas 2026-11-19): sekali per kantor. Item manual dicentang kasir /
 * pimpinan / stafkontrol; "angsuran" otomatis selesai begitu tidak ada motor aktif kantor itu
 * yang belum diinput angsurannya. Laporan per kantor untuk superuser & pusat.
 */
class BranchChecklistController extends Controller
{
    /** kunci => [judul, route menu, petunjuk]; urutan = urutan tampil. */
    public const ITEM = [
        'aset' => ['Cek & Update Data Aset Kendaraan', 'assets.index', 'Cek kesesuaian plat, status, dan pajak motor.'],
        'karyawan' => ['Cek & Update Data Karyawan', 'administrasi.manpower.index', 'Cek kesesuaian karyawan, upload berkas serta foto karyawan.'],
        'modal' => ['Cek Pinjaman Modal', 'dashboard.kasir.pinjaman_modal', 'Cek kesesuaian jumlah pinjaman modal.'],
        'sksw' => ['Cek SKSW', 'sksw.unit', 'Cek kesesuaian jumlah SK dan SW.'],
        'angsuran' => ['Update Angsuran Motor', 'assets.angsuran.index', 'Input angsuran semua motor aktif (otomatis selesai).'],
    ];
    private const OTOMATIS = 'angsuran';
    private const PERAN_CENTANG = ['superuser', 'kasir', 'pimpinan', 'stafkontrol'];

    /** Status kantor aktif (Tugas Harian). */
    public function index()
    {
        $branchId = (int) AuthScope::resolve()->branch_id;
        abort_unless($branchId, 404);
        $rows = BranchChecklist::with('user.employee:id,nama_karyawan')->where('branch_id', $branchId)->get()->keyBy('item');
        $angsuranBelum = self::motorBelumDiinput()[$branchId] ?? 0;

        return response()->json([
            'boleh_centang' => (bool) auth()->user()?->hasAnyRole(self::PERAN_CENTANG),
            'item' => collect(self::ITEM)->map(function ($v, $k) use ($rows, $angsuranBelum) {
                $r = $rows->get($k);
                $otomatis = $k === self::OTOMATIS;

                return [
                    'kunci' => $k,
                    'judul' => $v[0],
                    'petunjuk' => $v[2],
                    'link' => route($v[1]),
                    'otomatis' => $otomatis,
                    'selesai' => $otomatis ? $angsuranBelum === 0 : (bool) $r,
                    'ket' => $otomatis
                        ? ($angsuranBelum ? "{$angsuranBelum} motor aktif belum diinput angsurannya" : 'Semua motor aktif sudah diinput')
                        : ($r ? 'Selesai ' . $r->done_at->translatedFormat('d M Y H:i') . ($r->user?->employee?->nama_karyawan ? ' · ' . $r->user->employee->nama_karyawan : '') : null),
                ];
            })->values(),
        ]);
    }

    public function centang(string $item)
    {
        $this->bolehUbah($item);
        BranchChecklist::firstOrCreate(
            ['branch_id' => (int) AuthScope::resolve()->branch_id, 'item' => $item],
            ['done_at' => now(), 'user_id' => auth()->id()],
        );

        return back()->with('success', 'Checklist dicatat.');
    }

    public function batal(string $item)
    {
        $this->bolehUbah($item);
        BranchChecklist::where('branch_id', (int) AuthScope::resolve()->branch_id)->where('item', $item)->delete();

        return back()->with('success', 'Checklist dibatalkan.');
    }

    /** Laporan semua kantor aktif x item. */
    public function laporan()
    {
        abort_unless(auth()->user()?->hasAnyRole(['superuser', 'pusat']), 403, 'Laporan checklist untuk superuser & pusat.');
        $rows = BranchChecklist::with('user.employee:id,nama_karyawan')->get()->groupBy('branch_id');
        $belum = self::motorBelumDiinput();

        $kantor = Branch::query()->where('isactive', true)->orderBy('wilayah')->orderBy('unit')->get(['id', 'unit', 'wilayah'])
            ->map(function ($b) use ($rows, $belum) {
                $punya = ($rows->get($b->id) ?? collect())->keyBy('item');
                $sel = collect(self::ITEM)->map(fn ($v, $k) => $k === self::OTOMATIS
                    ? ['selesai' => ($belum[$b->id] ?? 0) === 0, 'ket' => ($belum[$b->id] ?? 0) ? ($belum[$b->id] . ' motor belum diinput') : 'otomatis']
                    : ['selesai' => $punya->has($k), 'ket' => $punya->has($k) ? $punya[$k]->done_at->format('d/m/Y H:i') . ' · ' . ($punya[$k]->user?->employee?->nama_karyawan ?? '-') : null]);

                return ['id' => $b->id, 'unit' => $b->unit, 'wilayah' => $b->wilayah, 'sel' => $sel, 'jumlah' => $sel->where('selesai', true)->count()];
            })->sortBy([['jumlah', 'asc'], ['wilayah', 'asc'], ['unit', 'asc']])->values();

        return Inertia::render('Laporan/ChecklistAplikasi', [
            'item' => collect(self::ITEM)->map(fn ($v, $k) => ['kunci' => $k, 'judul' => $v[0], 'petunjuk' => $v[2]])->values(),
            'kantor' => $kantor,
        ]);
    }

    /** branch_id => jumlah kendaraan AKTIF di kantor itu (penempatan terakhir) yang belum punya kontrak angsuran. */
    private static function motorBelumDiinput(): array
    {
        return DB::table('inv_assets as a')
            ->join('inv_locations as l', 'l.id', '=', DB::raw('(select max(x.id) from inv_locations x where x.asset_id = a.id)'))
            ->where('a.category_id', InvCategory::KENDARAAN)->where('a.status', 'aktif')
            ->whereNotExists(fn ($q) => $q->from('inv_vehicle_loans as v')->whereColumn('v.asset_id', 'a.id'))
            ->groupBy('l.branch_id')->pluck(DB::raw('count(*)'), 'l.branch_id')->map(fn ($n) => (int) $n)->all();
    }

    private function bolehUbah(string $item): void
    {
        abort_unless(isset(self::ITEM[$item]) && $item !== self::OTOMATIS, 404);
        abort_unless(auth()->user()?->hasAnyRole(self::PERAN_CENTANG), 403, 'Checklist dicentang kasir / pimpinan / stafkontrol.');
    }
}
