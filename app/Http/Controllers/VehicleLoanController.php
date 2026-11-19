<?php

namespace App\Http\Controllers;

use App\Models\InvAsset;
use App\Models\InvVehicleLoan;
use App\Models\InvVehicleLoanPayment;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

/**
 * Angsuran Motor (mas 2026-11-19): kontrak angsuran tetap x tenor per kendaraan, bukan
 * pembukuan kas. Tagihan per awal bulan (periode = tgl 1), tanggal bayar = tanggal transfer.
 * Kontrak ikut kendaraan: daftar per kantor = kendaraan yang sekarang di kantor aktif.
 * Peran = menu Aset (gate route). Mewarisi helper kantor aktif VehicleAssetController.
 */
class VehicleLoanController extends VehicleAssetController
{
    /**
     * "Hapus semua angsuran" (kontrak utuh) hanya untuk masa pendataan: s/d tanggal ini
     * (mas 2026-11-19, akhir bulan pendataan). Sesudahnya hanya superuser.
     */
    public const BATAS_HAPUS_SEMUA = '2026-11-30';

    public static function bolehHapusSemua(): bool
    {
        return now()->toDateString() <= self::BATAS_HAPUS_SEMUA || (bool) auth()->user()?->hasRole('superuser');
    }

    public function page()
    {
        return Inertia::render('Assets/Angsuran');
    }

    /** Bahan layar (menu & tab Dashboard Kasir): kontrak + kendaraan yang belum punya kontrak berjalan. */
    public function data()
    {
        $branchId = $this->activeBranchId();
        $assets = $this->vehicleAssetsAt($branchId)
            ->with(['vehicle:id,asset_id,plat_nomor', 'currentLocation'])
            ->get(['id', 'name', 'status', 'kondisi']);
        $loans = InvVehicleLoan::query()->whereIn('asset_id', $assets->pluck('id'))
            ->with(['payments' => fn ($q) => $q->orderBy('angsuran_ke')])->orderBy('id')->get();
        $bulanIni = now()->startOfMonth();

        $kontrak = $loans->map(function (InvVehicleLoan $l) use ($assets, $bulanIni) {
            $a = $assets->firstWhere('id', $l->asset_id);
            $terakhir = $l->payments->last();
            $berikut = $l->status === InvVehicleLoan::BERJALAN && $terakhir ? $terakhir->periode->copy()->addMonthNoOverflow() : null;

            return [
                'id' => $l->id,
                'asset_id' => $l->asset_id,
                'plat' => $a?->vehicle?->plat_nomor,
                'nama' => $a?->name,
                'pemakai' => $a?->currentLocation?->pengguna,
                'aset_aktif' => $a?->status === 'aktif',
                'angsuran' => $l->angsuran,
                'tenor' => $l->tenor,
                'total_harga' => $l->total_harga,
                'terbayar' => $l->payments->count(),
                'total_bayar' => (int) $l->payments->sum('nominal'),
                'sisa' => $l->total_harga - (int) $l->payments->sum('nominal'),
                'periode_terakhir' => $terakhir?->periode?->toDateString(),
                'tanggal_bayar_terakhir' => $terakhir?->tanggal_bayar?->toDateString(),
                'tagihan_berikut' => $berikut?->toDateString(),
                // Bulan tagihan yang sudah lewat / jatuh bulan ini dan belum dibayar.
                'tunggakan' => $berikut && $berikut->lte($bulanIni) ? (int) $berikut->diffInMonths($bulanIni) + 1 : 0,
                'status' => $l->status,
                'lunas_at' => $l->lunas_at?->toDateString(),
                // Per periode, untuk filter bulan di daftar (dihitung di browser).
                'bayar' => $l->payments->map(fn ($p) => [$p->periode->format('Y-m'), $p->tanggal_bayar->toDateString(), $p->nominal])->values(),
            ];
        })->sortBy([['status', 'asc'], ['tagihan_berikut', 'asc']])->values();

        // Belum diinput = kendaraan tanpa kontrak apa pun (berjalan, atau ditandai lunas / tanpa angsuran).
        $sudah = $loans->pluck('asset_id')->all();
        $kandidat = $assets->reject(fn ($a) => in_array($a->id, $sudah, true))
            ->map(fn ($a) => ['asset_id' => $a->id, 'plat' => $a->vehicle?->plat_nomor, 'nama' => $a->name, 'aktif' => $a->status === 'aktif', 'kondisi' => $a->kondisi])
            ->sortBy([['aktif', 'desc'], ['plat', 'asc']])->values();

        // Tambah motor = motor yang belum diinput sama sekali (yang ditandai "tidak ada angsuran" / lunas
        // tidak muncul; salah tandai -> hapus dulu lewat filter "Tidak ada angsuran", lalu input lagi).
        $bisaTambah = $kandidat;

        return response()->json([
            'kontrak' => $kontrak, 'kandidat' => $kandidat, 'bisa_tambah' => $bisaTambah, 'bulan_ini' => $bulanIni->toDateString(),
            'boleh_hapus_semua' => self::bolehHapusSemua(),
        ]);
    }

    /** Jumlah kendaraan AKTIF kantor aktif yang belum diinput (tombol merah di navbar). */
    public function belum()
    {
        $branchId = $this->activeBranchId();

        $ids = $this->vehicleAssetsAt($branchId)->pluck('id');
        $bulanIni = now()->startOfMonth()->toDateString();
        // Tagihan = kontrak berjalan yang periode terakhirnya sebelum bulan ini (tagihan bulan ini / tunggakan).
        $tagihan = InvVehicleLoan::query()->whereIn('asset_id', $ids)->where('status', InvVehicleLoan::BERJALAN)
            ->whereRaw('(select max(periode) from inv_vehicle_loan_payments p where p.loan_id = inv_vehicle_loans.id) < ?', [$bulanIni])
            ->count();

        return response()->json([
            'belum' => $this->vehicleAssetsAt($branchId)->where('status', 'aktif')
                ->whereDoesntHave('vehicleLoans')->count(),
            'tagihan' => $tagihan,
        ]);
    }

    /** Riwayat angsuran satu kontrak (drawer). */
    public function detail(InvVehicleLoan $loan)
    {
        $this->pastikanKantor($loan);

        return response()->json([
            'pembayaran' => $loan->payments()->with('user.employee:id,nama_karyawan')->orderByDesc('angsuran_ke')->get()
                ->map(fn ($p) => [
                    'id' => $p->id,
                    'angsuran_ke' => $p->angsuran_ke,
                    'periode' => $p->periode->toDateString(),
                    'tanggal_bayar' => $p->tanggal_bayar->toDateString(),
                    'nominal' => $p->nominal,
                    'sumber' => $p->sumber,
                    'bukti' => collect($p->bukti_path ?? [])->keys()->map(fn ($n) => route('assets.angsuran.bukti', [$p->id, $n]))->values(),
                    'oleh' => $p->user?->employee?->nama_karyawan,
                ]),
        ]);
    }

    /**
     * Input awal (batch): kontrak yang masih berjalan. Terbayar n kali dengan angsuran terakhir
     * tanggal T -> angsuran ke-n tanggal T, ke-(n-1) T-1 bulan, dst. (periode = awal bulannya).
     */
    public function awal(Request $request)
    {
        $branchId = $this->activeBranchId();
        $v = $request->validate([
            'baris' => ['required', 'array', 'min:1'],
            'baris.*.asset_id' => ['required', 'integer', 'distinct'],
            'baris.*.lunas' => ['nullable', 'boolean'],
            // Bukti transfer angsuran terakhir: sekali unggah (boleh beberapa file), dipakai semua baris.
            'bukti' => ['nullable', 'array', 'max:10'],
            'bukti.*' => \App\Support\Unggahan::ATURAN,
        ], \App\Support\Unggahan::pesan('bukti.*'));
        // Baris "tidak ada angsuran / sudah lunas" cukup asset_id; sisanya wajib isian angsuran.
        foreach ($v['baris'] as $i => $b) {
            if (! empty($b['lunas'])) {
                continue;
            }
            // Sumber = isian mentah baris ini ($v hanya berisi asset_id & lunas).
            [$aturan, $pesan] = InvVehicleLoan::aturan();
            $cek = validator((array) $request->input("baris.$i"), $aturan, $pesan);
            if ($cek->fails()) {
                // Pesan menyebut barisnya (plat), supaya kasir tahu motor mana yang kurang.
                $plat = \App\Models\InvVehicle::where('asset_id', $b['asset_id'])->value('plat_nomor');
                throw ValidationException::withMessages(collect($cek->errors()->toArray())
                    ->mapWithKeys(fn ($m, $k) => ["baris.$i.$k" => ($plat ? "$plat: " : '') . $m[0]])->all());
            }
            $v['baris'][$i] += $cek->validated();
        }
        $di = $this->vehicleAssetsAt($branchId)->pluck('id')->all();
        foreach ($v['baris'] as $i => $b) {
            if (! in_array((int) $b['asset_id'], $di, true)) {
                throw ValidationException::withMessages(["baris.$i.asset_id" => 'Kendaraan tidak ada di kantor aktif.']);
            }
        }

        $ref = (string) Str::uuid();
        $adaAngsuran = collect($v['baris'])->contains(fn ($b) => empty($b['lunas']));
        if ($adaAngsuran && ! $request->hasFile('bukti')) {
            throw ValidationException::withMessages(['bukti' => 'Bukti transfer angsuran terakhir wajib diunggah.']);
        }
        $bukti = $adaAngsuran ? self::simpanBukti($request) : null;
        DB::transaction(function () use ($v, $branchId, $ref, $bukti) {
            foreach ($v['baris'] as $i => $b) {
                try {
                    InvVehicleLoan::catatAwal((int) $b['asset_id'], $branchId, $b, $ref, $bukti);
                } catch (\RuntimeException $e) {
                    throw ValidationException::withMessages(["baris.$i.asset_id" => $e->getMessage()]);
                }
            }
        });

        return back()->with('success', count($v['baris']) . ' angsuran motor dicatat.');
    }

    /**
     * Bayar angsuran (batch atau satu unit): tiap kontrak bayar `bulan` periode berikutnya
     * (bawaan 1) pada tanggal transfer yang sama. Angsuran ke-tenor -> lunas.
     */
    public function bayar(Request $request)
    {
        $branchId = $this->activeBranchId();
        $v = $request->validate([
            'tanggal_bayar' => ['required', 'date', 'before_or_equal:today'],
            'item' => ['required', 'array', 'min:1'],
            'item.*.loan_id' => ['required', 'integer', 'distinct'],
            'item.*.bulan' => ['nullable', 'integer', 'min:1', 'max:120'],
            // Bukti transfer sekali unggah (boleh beberapa file) untuk satu kali bayar (batch / satu unit).
            'bukti' => ['required', 'array', 'min:1', 'max:10'],
            'bukti.*' => \App\Support\Unggahan::ATURAN,
        ], [
            'item.required' => 'Pilih minimal satu motor.',
            'tanggal_bayar.before_or_equal' => 'Tanggal bayar tidak boleh di masa depan.',
            'bukti.required' => 'Bukti transfer wajib diunggah.',
        ] + \App\Support\Unggahan::pesan('bukti.*'));
        $di = $this->vehicleAssetsAt($branchId)->pluck('id')->all();
        $ref = (string) Str::uuid();
        $jumlah = 0;
        $bukti = self::simpanBukti($request);

        DB::transaction(function () use ($v, $di, $ref, $bukti, &$jumlah) {
            foreach ($v['item'] as $i => $it) {
                $loan = InvVehicleLoan::whereKey($it['loan_id'])->lockForUpdate()->first();
                if (! $loan || ! in_array((int) $loan->asset_id, $di, true)) {
                    throw ValidationException::withMessages(["item.$i.loan_id" => 'Angsuran tidak ditemukan di kantor aktif.']);
                }
                if ($loan->status !== InvVehicleLoan::BERJALAN) {
                    throw ValidationException::withMessages(["item.$i.loan_id" => 'Angsuran ini sudah lunas.']);
                }
                $terakhir = $loan->payments()->orderByDesc('angsuran_ke')->first();
                $sisaBulan = $loan->tenor - (int) ($terakhir?->angsuran_ke ?? 0);
                $bulan = (int) ($it['bulan'] ?? 1);
                if ($bulan > $sisaBulan) {
                    throw ValidationException::withMessages(["item.$i.bulan" => "Sisa angsuran tinggal {$sisaBulan} bulan."]);
                }
                $periode = $terakhir ? $terakhir->periode->copy()->addMonthNoOverflow() : Carbon::parse($v['tanggal_bayar'])->startOfMonth();
                for ($n = 1; $n <= $bulan; $n++) {
                    $loan->payments()->create([
                        'angsuran_ke' => ($terakhir?->angsuran_ke ?? 0) + $n,
                        'periode' => $periode->copy()->addMonthsNoOverflow($n - 1)->toDateString(),
                        'tanggal_bayar' => $v['tanggal_bayar'],
                        'nominal' => $loan->angsuran,
                        'bukti_path' => $bukti,
                        'sumber' => 'kasir',
                        'batch_ref' => $ref,
                        'user_id' => auth()->id(),
                    ]);
                    $jumlah++;
                }
                if ($bulan === $sisaBulan) {
                    $loan->update(['status' => InvVehicleLoan::LUNAS, 'lunas_at' => $v['tanggal_bayar']]);
                }
            }
        });

        return back()->with('success', "{$jumlah} angsuran motor dibayar.");
    }

    /** Bukti transfer satu pembayaran (kendaraan di kantor aktif). */
    public function bukti(InvVehicleLoanPayment $payment, int $n = 0)
    {
        $this->pastikanKantor($payment->loan);

        return \App\Support\Unggahan::tampilkan(($payment->bukti_path ?? [])[$n] ?? null, 'Bukti transfer tidak ditemukan.');
    }

    /** Simpan semua file `bukti[]` ke s3; satu daftar path untuk semua angsuran yang dibayar sekali jalan. */
    public static function simpanBukti(Request $request, string $field = 'bukti'): array
    {
        return collect($request->file($field) ?? [])->values()
            ->map(fn ($f, $n) => \App\Support\Unggahan::simpan($f, 'angsuran-motor', "$field.$n"))->all();
    }

    /** Batalkan pembayaran: hanya angsuran terakhir kontrak itu; status lunas ikut dibuka lagi. */
    public function hapus(InvVehicleLoanPayment $payment)
    {
        $loan = $payment->loan;
        $this->pastikanKantor($loan);
        if ($loan->payments()->max('angsuran_ke') !== $payment->angsuran_ke) {
            throw ValidationException::withMessages(['payment' => 'Hanya angsuran terakhir yang bisa dibatalkan.']);
        }
        if ($loan->payments()->count() === 1) {
            throw ValidationException::withMessages(['payment' => 'Angsuran pertama tidak bisa dibatalkan; hapus kontraknya (superuser).']);
        }
        DB::transaction(function () use ($payment, $loan) {
            $payment->delete();
            $loan->update(['status' => InvVehicleLoan::BERJALAN, 'lunas_at' => null]);
        });

        return back()->with('success', 'Angsuran ke-' . $payment->angsuran_ke . ' dibatalkan.');
    }

    /**
     * Hapus angsuran BULAN INI (periode bulan berjalan) untuk satu / banyak motor: hanya kalau itu
     * angsuran terakhir kontraknya dan bukan satu-satunya. Status lunas ikut dibuka lagi.
     */
    public function hapusBulanIni(Request $request)
    {
        $v = $request->validate(['id' => ['required', 'array', 'min:1', 'max:200'], 'id.*' => ['integer', 'distinct']], ['id.required' => 'Pilih minimal satu motor.']);
        $di = $this->vehicleAssetsAt($this->activeBranchId())->pluck('id')->all();
        $periode = now()->startOfMonth()->toDateString();
        $hapus = 0;
        $lewat = [];
        DB::transaction(function () use ($v, $di, $periode, &$hapus, &$lewat) {
            foreach (InvVehicleLoan::whereIn('id', $v['id'])->with('asset.vehicle')->lockForUpdate()->get() as $loan) {
                abort_unless(in_array((int) $loan->asset_id, $di, true), 404);
                $plat = $loan->asset?->vehicle?->plat_nomor ?? "#{$loan->id}";
                $terakhir = $loan->payments()->orderByDesc('angsuran_ke')->first();
                if (! $terakhir || $terakhir->periode->toDateString() !== $periode) {
                    $lewat[] = "$plat (" . ($loan->payments()->whereDate('periode', $periode)->exists() ? 'sudah bayar bulan depan' : 'belum ada angsuran bulan ini') . ')';
                    continue;
                }
                if ($loan->payments()->count() === 1) {
                    $lewat[] = "$plat (satu-satunya angsuran; pakai hapus semua)";
                    continue;
                }
                $terakhir->delete();
                $loan->update(['status' => InvVehicleLoan::BERJALAN, 'lunas_at' => null]);
                $hapus++;
            }
        });
        \Illuminate\Support\Facades\Log::info('Angsuran motor bulan ini dihapus', ['loan' => $v['id'], 'dihapus' => $hapus, 'user_id' => auth()->id()]);
        $pesan = "{$hapus} angsuran bulan ini dihapus." . ($lewat ? ' Dilewati: ' . implode(', ', $lewat) . '.' : '');

        return $hapus ? back()->with('success', $pesan) : back()->withErrors(['id' => $pesan]);
    }

    /** Hapus banyak kontrak sekaligus (salah input batch): kontrak + pembayarannya, kantor aktif saja. */
    public function hapusBatch(Request $request)
    {
        abort_unless(self::bolehHapusSemua(), 403, 'Hapus semua angsuran hanya sampai ' . self::BATAS_HAPUS_SEMUA . ' (masa pendataan).');
        $v = $request->validate(['id' => ['required', 'array', 'min:1', 'max:200'], 'id.*' => ['integer', 'distinct']], ['id.required' => 'Pilih minimal satu motor.']);
        $di = $this->vehicleAssetsAt($this->activeBranchId())->pluck('id')->all();
        $loans = InvVehicleLoan::whereIn('id', $v['id'])->withCount('payments')->get();
        abort_unless($loans->count() === count($v['id']) && $loans->every(fn ($l) => in_array((int) $l->asset_id, $di, true)), 404);
        DB::transaction(fn () => InvVehicleLoan::whereIn('id', $loans->pluck('id'))->delete());
        \Illuminate\Support\Facades\Log::info('Kontrak angsuran motor dihapus (batch)', [
            'loan' => $loans->map(fn ($l) => $l->only(['id', 'asset_id', 'angsuran', 'tenor', 'status', 'payments_count']))->all(),
            'user_id' => auth()->id(),
        ]);

        return back()->with('success', $loans->count() . ' angsuran motor dihapus.');
    }

    /**
     * Hapus kontrak salah input (mas 2026-11-19: kasir boleh, peran menu Aset = gate route):
     * kontrak & semua pembayarannya hilang, motor kembali ke daftar "belum diinput".
     */
    public function hapusKontrak(InvVehicleLoan $loan)
    {
        abort_unless(self::bolehHapusSemua(), 403, 'Hapus semua angsuran hanya sampai ' . self::BATAS_HAPUS_SEMUA . ' (masa pendataan).');
        $this->pastikanKantor($loan);
        \Illuminate\Support\Facades\Log::info('Kontrak angsuran motor dihapus', ['loan' => $loan->only(['id', 'asset_id', 'angsuran', 'tenor', 'status']), 'pembayaran' => $loan->payments()->count(), 'user_id' => auth()->id()]);
        $loan->delete();

        return back()->with('success', 'Kontrak angsuran dihapus.');
    }

    private function pastikanKantor(InvVehicleLoan $loan): void
    {
        abort_unless($this->vehicleAssetsAt($this->activeBranchId())->whereKey($loan->asset_id)->exists(), 404);
    }
}
