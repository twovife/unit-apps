<?php

namespace App\Http\Controllers;

use App\Helpers\AuthScope;
use App\Helpers\RekapWilayah;
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
    /**
     * Boleh mengetik, cek, dan buka.
     *
     * Dibatasi ke superuser saja atas permintaan mas 2026-11-24, sampai
     * menunya siap dibuka untuk staf kontrol. Rancangannya tetap:
     * ['stafkontrol', 'superuser'] untuk mengubah, ditambah 'pusat' untuk
     * melihat, dan penyaringan zona staf kontrol di bawah sudah siap.
     */
    private const PERAN_UBAH = ['superuser'];

    /** Boleh membuka halaman. */
    private const PERAN_LIHAT = ['superuser'];

    /**
     * Rantai cek dimulai di sini. Sejajar Gembok::MULAI_CEK_KUNCI_LAMA di
     * Rekap 1: hari sebelum tanggal ini tidak ditagih.
     */
    private const MULAI = '2026-11-01';

    public function index(Request $request)
    {
        $user = auth()->user();
        abort_unless($user?->hasAnyRole(self::PERAN_LIHAT), 403, 'Rekap Sirkulasi Wilayah masih dibatasi untuk superuser.');

        // Filter bulan, sama dengan Rekap 2 (?bulan=Y-m).
        $bulan = preg_match('/^\d{4}-\d{2}$/', (string) $request->bulan)
            ? $request->bulan
            : Carbon::now()->format('Y-m');
        $periode = $bulan . '-01';
        $wilayah = $this->wilayahTerpilih($request);

        $sebulan = AngkaRekapWilayah::untukBulan($wilayah, $periode);
        if (empty($sebulan)) {
            return Inertia::render('Laporan/RekapWilayah', $this->propKosong($wilayah, $bulan));
        }

        $branchIds = array_keys(reset($sebulan));

        // Urut alami, bukan alfabet: orderBy('unit') menaruh Krian 10 di antara
        // Krian 1 dan Krian 2, karena membandingkan huruf per huruf.
        $unit = Branch::whereIn('id', $branchIds)->pluck('unit', 'id')
            ->sort(fn ($a, $b) => strnatcasecmp($a, $b));

        $ttd = AngkaRekapWilayah::ttdBulan($wilayah, $periode);

        $diketik = RegionalCirculationRecap::with('pengecek.employee:id,nama_karyawan')
            ->whereBetween('tanggal', [$periode, Carbon::parse($periode)->endOfMonth()->toDateString()])
            ->whereIn('branch_id', $branchIds)
            ->get()->groupBy(fn ($r) => $r->tanggal->toDateString());

        $kolomTetap = ['awal_sirkulasi', 'awal_cm', 'awal_mb', 'awal_ml',
            'saldo_lama_cm', 'saldo_lama_mb', 'drop_cm', 'drop_mb',
            'drop_bulan_lalu', 'pemutihan'];
        // saldo_lama_* ikut tiap tanggal walau isinya tetap: itu penyebut
        // kolom persen, jadi tanpa dikirim persennya tidak bisa dihitung.
        $kolomHarian = [...RegionalCirculationRecap::KOLOM_MUTASI, ...RegionalCirculationRecap::KOLOM_TURUNAN,
            ...RegionalCirculationRecap::KOLOM_BEKU];

        $bolehUbah = $user->hasAnyRole(self::PERAN_UBAH);
        $pertama = reset($sebulan);

        return Inertia::render('Laporan/RekapWilayah', [
            'wilayah' => $wilayah,
            'bulan' => $bulan,
            'daftar_wilayah' => $this->wilayahBoleh(),
            'boleh_ubah' => $bolehUbah,

            // Bulan asal angka yang tetap sepanjang bulan.
            'bulan_lalu' => Carbon::parse($periode)->subMonth()->toDateString(),
            'bulan_cm' => RekapWilayah::bulanRujukan($periode, 'cm'),
            'bulan_mb' => RekapWilayah::bulanRujukan($periode, 'mb'),

            // Dikirim sekali per kantor, bukan diulang tiap tanggal: isinya
            // tetap sebulan, dan satu wilayah bisa 33 kantor x 25 tanggal.
            'kantor' => $unit->map(fn ($nama, $id) => [
                'branch_id' => (int) $id,
                'unit' => $nama,
                'sistem' => collect($pertama[$id] ?? [])->only($kolomTetap)->all(),
            ])->values(),

            'hari' => collect($sebulan)->map(function ($perKantor, $tanggal) use ($unit, $diketik, $ttd, $kolomHarian, $bolehUbah) {
                $hariIni = $diketik->get($tanggal, collect())->keyBy('branch_id');
                $hariKerja = WorkDay::hariKerja($tanggal);

                return [
                    'tanggal' => $tanggal,
                    'hari_kerja' => $hariKerja,
                    'hari_kerja_ke' => $this->hariKerjaKe($tanggal),
                    // Hari libur dianggap tidak ada (aturan mas 2026-11-23):
                    // tetap terlihat, tetapi tidak ada yang boleh diisi.
                    'boleh_ubah' => $bolehUbah && $hariKerja,
                    'baris' => $unit->map(function ($nama, $id) use ($perKantor, $hariIni, $ttd, $tanggal, $kolomHarian) {
                        $d = $hariIni->get($id);

                        return [
                            'branch_id' => (int) $id,
                            'unit' => $nama,
                            'sistem' => collect($perKantor[$id] ?? [])->only($kolomHarian)->all(),
                            'diketik' => $d?->only($kolomHarian),
                            'ttd' => $ttd[$tanggal][$id] ?? ['kasir' => 0, 'km' => 0, 'kelompok' => 0],
                            'terkunci' => (bool) $d?->terkunci(),
                            'dicek_oleh' => $d?->pengecek?->employee?->nama_karyawan,
                            'dicek_pada' => $d?->checked_at?->format('d/m/Y H:i'),
                        ];
                    })->values(),
                ];
            })->values(),
        ]);
    }

    /** Wilayah tanpa kantor aktif: halaman tetap terbuka, isinya kosong. */
    private function propKosong(int $wilayah, string $bulan): array
    {
        return [
            'wilayah' => $wilayah,
            'bulan' => $bulan,
            'daftar_wilayah' => $this->wilayahBoleh(),
            'boleh_ubah' => false,
            'bulan_lalu' => null,
            'bulan_cm' => null,
            'bulan_mb' => null,
            'kantor' => [],
            'hari' => [],
        ];
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

        // Hanya mutasi hari itu + saldo awal bulan yang boleh dikirim.
        // Kumulatif dan saldo DIHITUNG di sini, tidak pernah dipercaya dari
        // layar (keputusan mas 2026-11-23).
        $kolom = [...RegionalCirculationRecap::KOLOM_MUTASI, ...RegionalCirculationRecap::KOLOM_AWAL];

        $isi = $request->validate([
            'baris' => 'required|array|min:1',
            'baris.*.branch_id' => 'required|integer|exists:branches,id',
            'baris.*.tanggal' => 'required|date',
            ...collect($kolom)->mapWithKeys(fn ($k) => ["baris.*.nilai.$k" => 'nullable|integer|min:0'])->all(),
        ]);

        $bolehKantor = Branch::getAllowedBranchIds($user);

        $kantor = Branch::whereIn('id', collect($isi['baris'])->pluck('branch_id'))
            ->get(['id', 'wilayah'])->keyBy('id');

        $tersentuh = \DB::transaction(function () use ($isi, $kolom, $kantor, $bolehKantor) {
            $tersentuh = [];

            foreach ($isi['baris'] as $kiriman) {
                $branchId = (int) $kiriman['branch_id'];
                $tanggal = Carbon::parse($kiriman['tanggal'])->toDateString();

                // Hari libur dianggap tidak ada, jadi tidak ada rekap yang
                // diisi di sana. Layar sudah mematikan isiannya; ini penjaga
                // di sisi server.
                abort_unless(WorkDay::hariKerja($tanggal), 422, "Tanggal $tanggal bukan hari kerja.");

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
                $tersentuh[$branchId] = [(int) $kantor[$branchId]->wilayah, $tanggal];
            }

            // Mengubah mutasi satu hari menggeser kumulatif hari-hari
            // SESUDAHNYA juga, jadi sebulan dihitung ulang untuk kantor itu.
            foreach ($tersentuh as $branchId => [$wilayah, $tanggal]) {
                $this->hitungUlangBulan($branchId, $tanggal);
            }

            return $tersentuh;
        });

        if ($request->boolean('ringkas')) {
            return $this->balasTambalan($tersentuh, $isi['baris'][0]['tanggal']);
        }

        return back();
    }


    /**
     * Tanda tangan staf kontrol untuk satu baris kantor.
     *
     * Berantai seperti kunci kasir di Rekap 1: hari kerja sebelumnya di kantor
     * yang sama harus sudah dicek lebih dulu, supaya tidak ada hari yang
     * dilewati diam-diam.
     */
    public function cek(Request $request, Branch $branch)
    {
        $this->pastikanBolehUbah($branch);
        $tanggal = Carbon::parse($request->tanggal)->toDateString();
        abort_unless(WorkDay::hariKerja($tanggal), 422, 'Tanggal itu bukan hari kerja.');

        \DB::transaction(function () use ($branch, $tanggal) {
            $tertinggal = $this->hariBelumDicek($branch->id, $tanggal);
            abort_if(
                $tertinggal->isNotEmpty(),
                422,
                'Hari sebelumnya belum dicek: ' . $tertinggal->take(3)->implode(', ')
                    . ($tertinggal->count() > 3 ? ' dan ' . ($tertinggal->count() - 3) . ' lagi' : '')
            );

            $baris = RegionalCirculationRecap::lockForUpdate()
                ->where('branch_id', $branch->id)->whereDate('tanggal', $tanggal)->first();

            // Baris kosong tetap boleh dicek: angka bawaannya dari Rekap 2, dan
            // nol memang nol (aturan mas 2026-11-23). Barisnya dibuat di sini
            // dengan angka sistem supaya yang ditandatangani tersimpan.
            $baris ??= $this->barisDariSistem($branch, $tanggal);

            abort_if($baris->terkunci(), 422, 'Baris ini sudah dicek.');

            // Saldo lama dibekukan saat dicek: angka yang sudah ditandatangani
            // tidak boleh bergeser kalau drop lama dikoreksi.
            $sistem = AngkaRekapWilayah::untukWilayah((int) $branch->wilayah, $tanggal, $branch->id)[$branch->id] ?? [];
            $baris->saldo_lama_cm ??= $sistem['saldo_lama_cm'] ?? null;
            $baris->saldo_lama_mb ??= $sistem['saldo_lama_mb'] ?? null;

            $baris->checked_by = auth()->id();
            $baris->checked_at = now();
            $baris->save();

            $baris->logs()->create([
                'user_id' => auth()->id(),
                'action' => RegionalCirculationRecapLog::CEK,
            ]);
        });

        if ($request->boolean('ringkas')) {
            return $this->balasTambalan([$branch->id => true], $tanggal);
        }

        return back();
    }

    /** Buka baris yang sudah dicek. Alasan wajib dan masuk log. */
    public function buka(Request $request, Branch $branch)
    {
        $this->pastikanBolehUbah($branch);
        $alasan = $request->validate(['alasan' => 'required|string|min:5|max:255'])['alasan'];
        $tanggal = Carbon::parse($request->tanggal)->toDateString();

        \DB::transaction(function () use ($branch, $tanggal, $alasan) {
            $baris = RegionalCirculationRecap::lockForUpdate()
                ->where('branch_id', $branch->id)->whereDate('tanggal', $tanggal)->firstOrFail();

            abort_unless($baris->terkunci(), 422, 'Baris ini belum dicek.');

            $baris->logs()->create([
                'user_id' => auth()->id(),
                'action' => RegionalCirculationRecapLog::BUKA,
                'reason' => $alasan,
            ]);

            $baris->checked_by = null;
            $baris->checked_at = null;
            $baris->save();

            // Baris ini tadi dilewati hitungUlangBulan karena terkunci.
            // Sekarang terbuka, jadi kumulatifnya ikut dihitung lagi.
            $this->hitungUlangBulan($branch->id, $tanggal);
        });

        if ($request->boolean('ringkas')) {
            return $this->balasTambalan([$branch->id => true], $tanggal);
        }

        return back();
    }

    /** Riwayat satu baris, dibaca drawer di tabel. */
    public function log(Request $request, Branch $branch)
    {
        abort_unless(auth()->user()?->hasAnyRole(self::PERAN_LIHAT), 403);
        $tanggal = Carbon::parse($request->tanggal)->toDateString();

        $baris = RegionalCirculationRecap::where('branch_id', $branch->id)
            ->whereDate('tanggal', $tanggal)->first();

        return response()->json($baris
            ? $baris->logs()->with('user.employee:id,nama_karyawan')->orderByDesc('id')->get()
                ->map(fn ($l) => [
                    'aksi' => $l->action,
                    'kolom' => $l->field,
                    'lama' => $l->old_value,
                    'baru' => $l->new_value,
                    'alasan' => $l->reason,
                    'oleh' => $l->user?->employee?->nama_karyawan ?? '-',
                    'pada' => $l->created_at->format('d/m/Y H:i'),
                ])
            : []);
    }

    /** Boleh mengisi, cek, dan buka: stafkontrol di kantor zonanya, atau superuser. */
    private function pastikanBolehUbah(Branch $branch): void
    {
        $user = auth()->user();
        abort_unless($user?->hasAnyRole(self::PERAN_UBAH), 403, 'Hanya staf kontrol & superuser.');

        $boleh = Branch::getAllowedBranchIds($user);
        abort_if($boleh !== null && ! in_array($branch->id, $boleh, true), 403, 'Kantor ini di luar wilayah Anda.');
    }

    /**
     * Hari kerja sejak MULAI s/d sehari sebelum $tanggal yang belum dicek di
     * kantor ini.
     *
     * @return \Illuminate\Support\Collection<int, string>
     */
    private function hariBelumDicek(int $branchId, string $tanggal)
    {
        $mulai = max(self::MULAI, Carbon::parse($tanggal)->startOfMonth()->toDateString());
        if ($tanggal <= $mulai) {
            return collect();
        }

        $sudah = RegionalCirculationRecap::where('branch_id', $branchId)
            ->whereBetween('tanggal', [$mulai, $tanggal])
            ->whereNotNull('checked_at')
            ->pluck('tanggal')->map(fn ($t) => $t->toDateString())->flip();

        return WorkDay::hariKerjaBulan($tanggal)
            ->map(fn ($t) => $t->toDateString())
            ->filter(fn ($t) => $t >= $mulai && $t < $tanggal && ! $sudah->has($t))
            ->values();
    }

    /** Baris baru berisi angka sistem, untuk kantor yang tidak melapor sama sekali. */
    private function barisDariSistem(Branch $branch, string $tanggal): RegionalCirculationRecap
    {
        $sistem = AngkaRekapWilayah::untukWilayah((int) $branch->wilayah, $tanggal, $branch->id)[$branch->id] ?? [];

        $isi = ['branch_id' => $branch->id, 'tanggal' => $tanggal, 'wilayah' => $branch->wilayah];
        foreach ([...RegionalCirculationRecap::KOLOM_MUTASI, ...RegionalCirculationRecap::KOLOM_TURUNAN] as $k) {
            $isi[$k] = $sistem[$k] ?? 0;
        }

        return RegionalCirculationRecap::create($isi);
    }

    /**
     * Hitung ulang kolom kumulatif & saldo satu kantor untuk SEBULAN.
     *
     * Dijumlah dari mutasi yang diketik sejak tanggal 1, bukan dari baris
     * kemarin, supaya hari yang baru dikoreksi tidak meninggalkan hari-hari
     * sesudahnya dengan angka lama. Rumusnya sama dengan Rekap 2:
     *   sirkulasi = saldo awal + jumlah drop x 1,3 - jumlah storting
     *   saldo cm  = saldo awal cm - jumlah angsuran cm   (mb & ml sama)
     *
     * Baris yang sudah dicek TIDAK diubah: angkanya sudah ditandatangani.
     * Mutasinya tetap ikut dijumlah untuk hari-hari sesudahnya.
     */
    private function hitungUlangBulan(int $branchId, string $tanggal): void
    {
        $periode = Carbon::parse($tanggal)->startOfMonth()->toDateString();
        $akhir = Carbon::parse($tanggal)->endOfMonth()->toDateString();

        $baris = RegionalCirculationRecap::where('branch_id', $branchId)
            ->whereBetween('tanggal', [$periode, $akhir])
            ->orderBy('tanggal')->get();

        if ($baris->isEmpty()) {
            return;
        }

        // Saldo awal bulan: yang diketik staf kontrol kalau ada, kalau belum
        // dari angka sistem (Rekap 2).
        $sistem = AngkaRekapWilayah::awalKantor($branchId, $tanggal);
        $awal = [];
        foreach (['sirkulasi' => 'awal_sirkulasi', 'cm' => 'awal_cm', 'mb' => 'awal_mb', 'ml' => 'awal_ml'] as $ember => $kolom) {
            $diketik = $baris->firstWhere(fn ($r) => $r->$kolom !== null);
            $awal[$ember] = (int) ($diketik->$kolom ?? $sistem[$kolom] ?? 0);
        }

        $jumlah = ['drop' => 0, 'storting' => 0, 'angsuran_cm' => 0, 'angsuran_mb' => 0, 'angsuran_ml' => 0];

        foreach ($baris as $r) {
            foreach ($jumlah as $k => $_) {
                $jumlah[$k] += (int) ($r->$k ?? 0);
            }

            if ($r->terkunci()) {
                continue;
            }

            $r->total_drop = $jumlah['drop'];
            $r->total_storting = $jumlah['storting'];
            $r->sirkulasi = RekapWilayah::sirkulasiBerjalan($awal['sirkulasi'], $jumlah['drop'], $jumlah['storting']);

            foreach (['cm', 'mb', 'ml'] as $ember) {
                $r->{"total_angsuran_$ember"} = $jumlah["angsuran_$ember"];
                $r->{"saldo_$ember"} = $awal[$ember] - $jumlah["angsuran_$ember"];
            }

            $r->save();
        }
    }

    /**
     * Balasan ringkas untuk autosave, cek & buka: sebulan baris kantor-kantor
     * yang tersentuh, berkunci "tanggal|branch_id" seperti state di layar.
     *
     * Dipakai supaya layar tidak perlu dimuat ulang. Memuat ulang halaman
     * berarti menghitung sebulan untuk 33 kantor — 1,9 detik dan 92 kueri —
     * padahal yang berubah cuma satu kantor.
     *
     * @param  array<int, mixed>  $branchIds  branch_id sebagai KUNCI
     */
    private function balasTambalan(array $branchIds, string $tanggal): \Illuminate\Http\JsonResponse
    {
        $periode = Carbon::parse($tanggal)->startOfMonth()->toDateString();
        $akhir = Carbon::parse($tanggal)->endOfMonth()->toDateString();

        $tambalan = RegionalCirculationRecap::with('pengecek.employee:id,nama_karyawan')
            ->whereIn('branch_id', array_keys($branchIds))
            ->whereBetween('tanggal', [$periode, $akhir])
            ->get()
            ->mapWithKeys(fn ($r) => [
                "{$r->tanggal->toDateString()}|{$r->branch_id}" => [
                    'nilai' => collect(RegionalCirculationRecap::KOLOM_ANGKA)
                        ->mapWithKeys(fn ($k) => [$k => $r->$k === null ? null : (int) $r->$k])->all(),
                    'terkunci' => $r->terkunci(),
                    'dicek_oleh' => $r->pengecek?->employee?->nama_karyawan,
                    'dicek_pada' => $r->checked_at?->format('d/m/Y H:i'),
                ],
            ])->all();

        return response()->json(['tambalan' => $tambalan]);
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
