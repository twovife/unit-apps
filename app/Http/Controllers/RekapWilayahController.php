<?php

namespace App\Http\Controllers;

use App\Helpers\AppHelper;
use App\Helpers\AuthScope;
use App\Models\Branch;
use App\Models\RegionalCirculationRecap;
use App\Models\WorkDay;
use App\Services\AngkaRekapWilayah;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * Rekap Sirkulasi Wilayah: pengganti berkas Excel staf kontrol.
 * Rancangan: .agents/rekap_sirkulasi_wilayah.md
 *
 * Satu halaman untuk satu wilayah pada satu tanggal, satu baris per kantor.
 * Angka bawaan tiap sel dari Rekap 2 (AngkaRekapWilayah); staf kontrol
 * menimpanya dengan angka yang dilaporkan kasir lewat WA.
 */
class RekapWilayahController extends Controller
{
    /** Boleh mengetik, cek, dan buka. Peran lain hanya melihat. */
    private const PERAN_UBAH = ['stafkontrol', 'superuser'];

    /** Boleh membuka halaman. */
    private const PERAN_LIHAT = ['stafkontrol', 'superuser', 'pusat'];

    public function index(Request $request)
    {
        $user = auth()->user();
        abort_unless($user?->hasAnyRole(self::PERAN_LIHAT), 403, 'Rekap Sirkulasi Wilayah untuk staf kontrol, pusat & superuser.');

        $tanggal = Carbon::parse($request->tanggal ?: now())->toDateString();
        $wilayah = $this->wilayahTerpilih($request);

        $sistem = AngkaRekapWilayah::untukWilayah($wilayah, $tanggal);
        $unit = Branch::whereIn('id', array_keys($sistem))->orderBy('unit')->pluck('unit', 'id');

        $diketik = RegionalCirculationRecap::with('pengecek.employee:id,nama_karyawan')
            ->whereDate('tanggal', $tanggal)
            ->whereIn('branch_id', array_keys($sistem))
            ->get()->keyBy('branch_id');

        return Inertia::render('Laporan/RekapWilayah', [
            'wilayah' => $wilayah,
            'tanggal' => $tanggal,
            'hari_kerja_ke' => $this->hariKerjaKe($tanggal),
            'daftar_wilayah' => $this->wilayahBoleh(),
            'boleh_ubah' => $user->hasAnyRole(self::PERAN_UBAH),
            'baris' => $unit->map(function ($nama, $id) use ($sistem, $diketik) {
                $d = $diketik->get($id);

                return [
                    'branch_id' => (int) $id,
                    'unit' => $nama,
                    'sistem' => $sistem[$id],
                    'diketik' => $d?->only([
                        ...RegionalCirculationRecap::KOLOM_ANGKA,
                        ...RegionalCirculationRecap::KOLOM_AWAL,
                        ...RegionalCirculationRecap::KOLOM_BEKU,
                    ]),
                    'terkunci' => (bool) $d?->terkunci(),
                    'dicek_oleh' => $d?->pengecek?->employee?->nama_karyawan,
                    'dicek_pada' => $d?->checked_at?->format('d/m/Y H:i'),
                ];
            })->values(),
        ]);
    }

    /** Hari kerja ke-n dalam bulan tanggal itu; null kalau tanggal itu libur. */
    private function hariKerjaKe(string $tanggal): ?int
    {
        $urut = WorkDay::hariKerjaBulan($tanggal)
            ->map(fn ($t) => $t->toDateString())
            ->values()
            ->search($tanggal);

        return $urut === false ? null : $urut + 1;
    }

    /**
     * Wilayah yang boleh dilihat user. Superuser & pusat semua wilayah,
     * staf kontrol hanya wilayah kantor-kantor di zonanya.
     *
     * @return array<int, int>
     */
    private function wilayahBoleh(): array
    {
        $ids = Branch::getAllowedBranchIds(auth()->user());

        return Branch::where('isactive', true)
            ->when($ids !== null, fn ($q) => $q->whereIn('id', $ids))
            ->distinct()->orderBy('wilayah')->pluck('wilayah')
            ->map(fn ($w) => (int) $w)
            ->filter() // wilayah 0 = Pusat, bukan wilayah lapangan
            ->values()->all();
    }

    private function wilayahTerpilih(Request $request): int
    {
        $boleh = $this->wilayahBoleh();
        abort_if(empty($boleh), 403, AppHelper::PESAN_BUKAN_WILAYAH);

        // Staf kontrol tidak bisa mengintip wilayah lain lewat query string.
        $diminta = (int) ($request->wilayah ?: AuthScope::resolve()->wilayah);

        return in_array($diminta, $boleh, true) ? $diminta : $boleh[0];
    }
}
