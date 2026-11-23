<?php

namespace App\Http\Controllers;

use App\Helpers\AuthScope;
use App\Models\Branch;
use App\Models\RegionalCirculationRecap;
use App\Models\RegionalCirculationRecapLog;
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
            'kemarin' => $this->kumulatifSebelumnya($tanggal, array_keys($sistem)),
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

    /**
     * Simpan angka WA kasir. Satu kiriman untuk beberapa baris kantor
     * sekaligus, karena staf kontrol mengisi kolom demi kolom lintas kantor.
     *
     * Selisih TIDAK menghalangi simpan: angka yang dilaporkan kasir dicatat
     * apa adanya, dan layar hanya menandainya (rancangan §2).
     */
    public function simpan(Request $request)
    {
        $user = auth()->user();
        abort_unless($user?->hasAnyRole(self::PERAN_UBAH), 403, 'Hanya staf kontrol & superuser yang boleh mengisi.');

        $kolom = [...RegionalCirculationRecap::KOLOM_ANGKA, ...RegionalCirculationRecap::KOLOM_AWAL];

        $isi = $request->validate([
            'tanggal' => 'required|date',
            'baris' => 'required|array|min:1',
            'baris.*.branch_id' => 'required|integer|exists:branches,id',
            ...collect($kolom)->mapWithKeys(fn ($k) => ["baris.*.nilai.$k" => 'nullable|integer|min:0'])->all(),
        ]);

        $tanggal = Carbon::parse($isi['tanggal'])->toDateString();
        $bolehKantor = Branch::getAllowedBranchIds($user);

        $kantor = Branch::whereIn('id', collect($isi['baris'])->pluck('branch_id'))
            ->get(['id', 'wilayah'])->keyBy('id');

        \DB::transaction(function () use ($isi, $tanggal, $kolom, $kantor, $bolehKantor) {
            foreach ($isi['baris'] as $kiriman) {
                $branchId = (int) $kiriman['branch_id'];

                // Staf kontrol hanya kantor di zonanya; superuser & pusat null = semua.
                // PESAN_BUKAN_WILAYAH berbunyi "Pinjaman ini bukan ...", tidak
                // cocok di sini; pesannya ditulis sendiri.
                abort_if(
                    $bolehKantor !== null && ! in_array($branchId, $bolehKantor, true),
                    403, 'Kantor ini di luar wilayah Anda.'
                );

                $baris = RegionalCirculationRecap::lockForUpdate()
                    ->firstOrNew(['branch_id' => $branchId, 'tanggal' => $tanggal]);

                abort_if($baris->terkunci(), 422, 'Baris sudah dicek. Buka dulu untuk mengubahnya.');

                // wilayah disalin saat baris dibuat; kantor bisa dipindah nanti.
                $baris->wilayah ??= $kantor[$branchId]->wilayah;
                $baris->save(); // perlu id supaya lognya bisa menunjuk ke baris ini

                foreach ($kolom as $k) {
                    if (! array_key_exists($k, $kiriman['nilai'] ?? [])) {
                        continue;
                    }
                    $lama = $baris->$k === null ? null : (int) $baris->$k;
                    $baru = $kiriman['nilai'][$k] === null ? null : (int) $kiriman['nilai'][$k];
                    if ($lama === $baru) {
                        continue;
                    }

                    $baris->$k = $baru;
                    $baris->logs()->create([
                        'user_id' => auth()->id(),
                        'action' => RegionalCirculationRecapLog::UBAH,
                        'field' => $k,
                        'old_value' => $lama,
                        'new_value' => $baru,
                    ]);
                }

                $baris->save();
            }
        });

        return back();
    }

    /**
     * Angka kumulatif hari kerja SEBELUMNYA dalam bulan yang sama, untuk
     * memeriksa rantai (kemarin + mutasi hari ini = kumulatif hari ini).
     * Hari kerja pertama bulan itu -> null, layar memakai saldo awal bulan.
     *
     * @return array<int, array<string, int|null>>|null
     */
    private function kumulatifSebelumnya(string $tanggal, array $branchIds): ?array
    {
        $sebelum = $this->hariKerjaSebelumnya($tanggal);
        if ($sebelum === null) {
            return null;
        }

        return RegionalCirculationRecap::whereDate('tanggal', $sebelum)
            ->whereIn('branch_id', $branchIds)
            ->get(['branch_id', 'total_drop', 'total_storting', 'sirkulasi',
                'total_angsuran_cm', 'saldo_cm', 'total_angsuran_mb', 'saldo_mb',
                'total_angsuran_ml', 'saldo_ml'])
            ->keyBy('branch_id')
            ->map(fn ($r) => $r->only(['total_drop', 'total_storting', 'sirkulasi',
                'total_angsuran_cm', 'saldo_cm', 'total_angsuran_mb', 'saldo_mb',
                'total_angsuran_ml', 'saldo_ml']))
            ->all();
    }

    /** Hari kerja sebelum tanggal ini DALAM BULAN YANG SAMA; null kalau tidak ada. */
    private function hariKerjaSebelumnya(string $tanggal): ?string
    {
        return WorkDay::hariKerjaBulan($tanggal)
            ->map(fn ($t) => $t->toDateString())
            ->filter(fn ($t) => $t < $tanggal)
            ->last();
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
        abort_if(empty($boleh), 403, 'Anda belum terdaftar di wilayah mana pun.');

        // Staf kontrol tidak bisa mengintip wilayah lain lewat query string.
        $diminta = (int) ($request->wilayah ?: AuthScope::resolve()->wilayah);

        return in_array($diminta, $boleh, true) ? $diminta : $boleh[0];
    }
}
