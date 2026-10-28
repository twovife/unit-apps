<?php

namespace App\Http\Controllers;

use App\Helpers\AgregasiScope;
use App\Helpers\AuthScope;
use App\Helpers\DaftarMigrasi;
use App\Helpers\PemeriksaanMigrasi;
use App\Helpers\Ember;
use App\Helpers\HitungAgregat;
use App\Helpers\PenyesuaianSaldo;
use App\Models\Branch;
use App\Models\TransactionCustomer;
use App\Models\TransactionLoan;
use App\Models\TransactionLoanOfficerGrouping;
use App\Models\TransactionSaldoAdjustment;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

/**
 * Perkakas persiapan migrasi ke alur agregasi baru.
 *
 * Sebagian besar laporan baca-saja; yang menulis hanya penyesuaian saldo,
 * pinjaman macet lama, dan tombol Migrasikan.
 *
 * Lihat .agents/agregasi_rekap.md §13.2.
 */
class MigrasiController extends Controller
{
    /**
     * Nasabah penampung Z (ML yang belum terinput), satu NIK untuk semua
     * kantor. Satu pinjaman per kelompok x hari menampung Z baris itu.
     *
     * BUKAN 0000000000000001: NIK nol-nol itu sudah dipakai staf sebagai NIK
     * darurat nasabah sungguhan (0..01 = Faridatul, 0..00/02/03 lainnya).
     * Awalan ML tidak bisa diketik di form (digits:16) dan sudah dilewati
     * pencarian NIK (nasabah_buku_transaksi), jadi tidak bentrok dan tidak
     * muncul di pencarian.
     */
    public const NIK_MACET_LAMA = 'ML00000000000001';

    /**
     * Simpan satu penyesuaian dari sisa saldo yang diketik. Arahnya dari
     * angka itu sendiri (lihat PenyesuaianSaldo::buat), tanpa persetujuan.
     */
    public function simpanPenyesuaian(Request $request)
    {
        $this->pastikanBolehUbahSaldo();

        $val = $request->validate([
            'loan_id' => ['required', 'integer'],
            'sisa_saldo' => ['required', 'integer', 'min:0'],
            'catatan' => ['nullable', 'string', 'max:500'],
        ]);

        $loan = TransactionLoan::find($val['loan_id']);
        if (!$loan) {
            return back()->withErrors('Pinjaman tidak ditemukan.');
        }

        // Pastikan pinjamannya di kantor user — tak boleh menyesuaikan kantor lain.
        $scope = AuthScope::resolve();
        $branchLoan = DB::table('transaction_loan_officer_groupings')
            ->where('id', $loan->transaction_loan_officer_grouping_id)->value('branch_id');
        if ((int) $branchLoan !== (int) $scope->branch_id) {
            abort(403, 'Pinjaman ini milik kantor lain.');
        }

        try {
            PenyesuaianSaldo::buat($loan, null, (int) $val['sisa_saldo'], $val['catatan'] ?? null, auth()->user());
        } catch (\Throwable $e) {
            return back()->withErrors($e->getMessage());
        }

        return back()->with('message', 'Penyesuaian tersimpan.');
    }

    /** Oper saldo antar dua nasabah ML (kantor sudah migrasi) - PenyesuaianSaldo::oper. */
    public function operSaldo(Request $request)
    {
        $val = $request->validate([
            'dari_id' => ['required', 'integer'],
            'ke_id' => ['required', 'integer'],
            'nominal' => ['required', 'integer', 'min:1'],
            'catatan' => ['nullable', 'string', 'max:400'],
        ]);
        $dari = TransactionLoan::with('customer')->findOrFail($val['dari_id']);
        $ke = TransactionLoan::with('customer')->findOrFail($val['ke_id']);
        $branchLoan = DB::table('transaction_loan_officer_groupings')
            ->where('id', $dari->transaction_loan_officer_grouping_id)->value('branch_id');
        if ((int) $branchLoan !== (int) AuthScope::resolve()->branch_id) {
            abort(403, 'Pinjaman ini milik kantor lain.');
        }

        try {
            PenyesuaianSaldo::oper($dari, $ke, (int) $val['nominal'], $val['catatan'] ?? null, auth()->user());
        } catch (\RuntimeException $e) {
            return back()->withErrors($e->getMessage());
        }

        return back()->with('message', 'Saldo dioper, total kelompok tetap.');
    }

    /**
     * Kesiapan migrasi satu kantor (kantor aktif) ke pendataan baru — superuser,
     * BACA-SAJA. Per kelompok x hari tagih membandingkan:
     *
     *   sistem = saldo per ember dari daftar nasabah (F8, HitungAgregat::
     *            portofolio per hari terakhir sebelum $periode) - fungsi yang
     *            sama dengan rekap bulanan sesudah migrasi
     *   lama   = transaction_sirculations bertanggal $periode (saldo awal
     *            yang dinyatakan kantor di sistem lama). Sistem lama hanya
     *            mengisi amount (total), cm, mb, ml - kolom month1/month2/ccm
     *            selalu 0 - jadi dibandingkan per KATEGORI (lancar = total -
     *            cm - mb - ml), bukan per ember.
     *   Z      = ML lama - ML sistem (ML yang belum terinput)
     *
     * Siap = baris lama tepat satu, lancar/CM/MB selisih 0, Z >= 0.
     * Keputusan atas baris yang belum siap diambil manusia; layar ini hanya
     * menunjukkan.
     */
    public function kesiapanMigrasi(Request $request)
    {
        if (!auth()->user()->hasRole('superuser')) {
            return redirect()->route('home')->with('message', 'Layar kesiapan migrasi khusus superuser.');
        }

        $scope = AuthScope::resolve();
        $periode = Carbon::parse($request->input('periode', AgregasiScope::RENCANA_MULAI))->startOfMonth();

        $baris = $this->barisKesiapan($scope->branch_id, $periode);

        $jumlah = fn($kolom, $kunci) => array_map(
            fn($e) => $baris->sum(fn($b) => $b[$kolom][$e] ?? 0),
            array_combine($kunci, $kunci)
        );

        return Inertia::render('Migrasi/Kesiapan', [
            'datas' => $baris,
            'ringkasan' => [
                'baris' => $baris->count(),
                'siap' => $baris->where('siap', true)->count(),
                'sistem' => $jumlah('sistem', Ember::SEMUA),
                'lama' => $jumlah('lama', array_keys(Ember::KATEGORI)),
                'z' => $baris->sum(fn($b) => max($b['z'] ?? 0, 0)),
                'z_minus' => $baris->filter(fn($b) => ($b['z'] ?? 0) < 0)->count(),
            ],
            'server_filter' => [
                'periode' => $periode->format('Y-m-d'),
                'unit' => Branch::whereKey($scope->branch_id)->value('unit'),
                'sudah_migrasi' => AgregasiScope::sudahMigrasi($scope->branch_id),
                'mulai' => AgregasiScope::tanggalMulai($scope->branch_id)?->toDateString(),
            ],
        ]);
    }

    /**
     * Nasabah macet (ember ML pada bulan acuan) yang belum lunas, satu
     * kelompok x hari - tempat menyesuaikan saldo sebelum / sesudah migrasi
     * supaya saldo awal benar. Superuser. Penyimpanan lewat route
     * penyesuaian_saldo_simpan (PenyesuaianSaldo::buat; arahnya otomatis
     * dari angka yang diketik).
     *
     * ponytail: kelompok & hari diambil dari kolom asli pinjaman, bukan
     * kelompok efektif mutasi; samakan dengan Mutasi::ekspresiEfektifSql kalau
     * mutasi nasabah mulai dipakai.
     */
    public function nasabahMacet(Request $request)
    {
        if (!auth()->user()->hasRole('superuser')) {
            return redirect()->route('home')->with('message', 'Layar nasabah macet khusus superuser.');
        }

        $scope = AuthScope::resolve();
        $periode = AgregasiScope::acuanPenyesuaian($scope->branch_id);
        $daftarKelompok = DB::table('transaction_loan_officer_groupings')
            ->where('branch_id', $scope->branch_id)
            ->orderBy('kelompok')->pluck('kelompok')->unique()->values();
        $kelompok = $request->input('kelompok', $daftarKelompok->first());
        $hari = strtolower($request->input('hari', 'senin'));

        $groupingIds = DB::table('transaction_loan_officer_groupings')
            ->where('branch_id', $scope->branch_id)->where('kelompok', $kelompok)->pluck('id');

        // ML pada bulan acuan = drop >= 5 bulan kalender sebelumnya.
        $batasMl = $periode->copy()->subMonthsNoOverflow(Ember::SELISIH_ML - 1);
        $batasSesuai = AgregasiScope::batasPenyesuaian($scope->branch_id);

        $loans = TransactionLoan::with('customer')
            ->whereIn('transaction_loan_officer_grouping_id', $groupingIds)
            ->whereRaw('LOWER(hari) = ?', [$hari])
            ->where('status', 'success')
            ->where('drop_date', '<', $batasMl->toDateString())
            // Sama dengan Pinjaman Macet: yang sudah ditutup (pay_off_date) sebelum bulan acuan tidak ikut.
            ->where(fn($q) => $q->whereNull('pay_off_date')->orWhere('pay_off_date', '>=', $periode->toDateString()))
            ->orderBy('drop_date')
            ->get();
        $ids = $loans->pluck('id')->all();
        $awal = PenyesuaianSaldo::saldoBanyak($ids, $periode->copy()->subDay(), $periode);
        $kini = PenyesuaianSaldo::saldoBanyak($ids);
        $penyesuaian = TransactionSaldoAdjustment::whereIn('transaction_loan_id', $ids)->orderBy('id')->get()
            ->groupBy('transaction_loan_id');

        $datas = $loans
            ->filter(fn($l) => ($kini[$l->id]['saldo'] ?? 0) > 0 || ($awal[$l->id]['saldo'] ?? 0) > 0)
            ->map(fn($l) => [
                'id' => $l->id,
                'nama' => $l->customer?->nama,
                'nik' => $l->customer?->nik,
                'drop_date' => $l->drop_date,
                'pinjaman' => (int) $l->pinjaman,
                'angsuran' => $kini[$l->id]['angsuran'],
                'pemutihan' => $kini[$l->id]['pemutihan'],
                'saldo_awal' => $awal[$l->id]['saldo'],
                'saldo_kini' => $kini[$l->id]['saldo'],
                'boleh' => $batasSesuai && Carbon::parse($l->drop_date)->lte($batasSesuai),
                'penyesuaian' => ($penyesuaian[$l->id] ?? collect())->map(fn($a) => [
                    'jenis' => $a->jenis,
                    'efek' => $a->efek_saldo,
                ])->values(),
            ])
            ->values();

        return Inertia::render('Migrasi/NasabahMacet', [
            'datas' => $datas,
            'ringkasan' => $this->barisKesiapan($scope->branch_id, $periode, $kelompok)->firstWhere('hari', $hari),
            'server_filter' => [
                'kelompok' => (string) $kelompok,
                'hari' => $hari,
                'daftar_kelompok' => $daftarKelompok,
                'periode' => $periode->toDateString(),
                'batas_penyesuaian' => $batasSesuai?->toDateString(),
                'unit' => Branch::whereKey($scope->branch_id)->value('unit'),
                'sudah_migrasi' => AgregasiScope::sudahMigrasi($scope->branch_id),
            ],
        ]);
    }

    /**
     * Dashboard migrasi per wilayah (superuser). Halaman memuat daftar kantor
     * + status migrasi saja (murah); angka kesiapan tiap kantor dihitung saat
     * akordion wilayah dibuka (dashboardKantor), karena satu kantor butuh
     * 1-6 detik.
     */
    public function dashboardMigrasi(Request $request)
    {
        if (!auth()->user()->hasRole('superuser')) {
            return redirect()->route('home')->with('message', 'Dashboard migrasi khusus superuser.');
        }

        // Kantor tutup (isactive = 0) tetap tampil, ditandai "(tutup)" di layar.
        $branches = Branch::orderBy('wilayah')->orderBy('unit')
            ->get(['id', 'unit', 'wilayah', 'isactive', 'mulai_pendataan_baru']);

        return Inertia::render('Migrasi/Dashboard', [
            'wilayah' => $branches->groupBy('wilayah')->map(fn($kantor, $w) => [
                'wilayah' => (int) $w,
                'kantor' => $kantor->map(fn($b) => [
                    'id' => $b->id,
                    'unit' => $b->unit,
                    'tutup' => !$b->isactive,
                    'mulai' => $b->mulai_pendataan_baru,
                ])->values(),
            ])->values(),
            'periode' => AgregasiScope::RENCANA_MULAI,
        ]);
    }

    /**
     * Ringkasan kesiapan satu kantor (axios, JSON) untuk dashboard - dipanggil
     * per kantor, beberapa sekaligus, supaya wilayah besar tidak kena batas
     * waktu request. Cache 30 menit; ?segar=1 menghitung ulang.
     */
    public function dashboardKantor(Request $request, int $branchId)
    {
        if (!auth()->user()->hasRole('superuser')) {
            abort(403);
        }

        $periode = Carbon::parse(AgregasiScope::RENCANA_MULAI);
        $kunci = "kesiapan_migrasi:{$branchId}:{$periode->toDateString()}";
        if ($request->boolean('segar')) {
            \Illuminate\Support\Facades\Cache::forget($kunci);
        }

        return response()->json(\Illuminate\Support\Facades\Cache::remember($kunci, now()->addMinutes(30), function () use ($branchId, $periode) {
            $baris = $this->barisKesiapan($branchId, $periode);

            return [
                'baris' => $baris->count(),
                'siap' => $baris->where('siap', true)->count(),
                'z' => $baris->sum(fn($b) => max($b['z'] ?? 0, 0)),
                'z_minus' => $baris->filter(fn($b) => ($b['z'] ?? 0) < 0)->count(),
                'tanpa_bucket' => $baris->filter(fn($b) => $b['lama'] === null)->count(),
                'macet_lama' => $baris->where('macet_lama', true)->count(),
            ];
        }));
    }

    /**
     * Migrasikan kantor aktif ke pendataan baru (superuser). Kesiapan dicek
     * ULANG di server - tombol di layar hanya muncul kalau semua baris siap,
     * tapi layar bisa basi / dilewati.
     */
    public function jalankanMigrasi(Request $request)
    {
        if (!auth()->user()->hasRole('superuser')) {
            abort(403, 'Khusus superuser.');
        }

        $scope = AuthScope::resolve();
        $periode = Carbon::parse($request->input('periode', AgregasiScope::RENCANA_MULAI))->startOfMonth();

        if (AgregasiScope::sudahMigrasi($scope->branch_id)) {
            return back()->withErrors('Kantor ini sudah migrasi.');
        }

        $val = $request->validate([
            'kunci_sampai' => ['nullable', 'date', 'after_or_equal:' . $periode->toDateString(), 'before:today'],
        ]);

        $baris = $this->barisKesiapan($scope->branch_id, $periode);
        if ($baris->isEmpty() || $baris->contains('siap', false)) {
            return back()->withErrors('Belum semua kelompok x hari siap ('
                . $baris->where('siap', true)->count() . '/' . $baris->count() . ').');
        }

        $menahan = PemeriksaanMigrasi::jumlahMenahan(PemeriksaanMigrasi::anomali($scope->branch_id, $periode));
        if ($menahan > 0) {
            return back()->withErrors("Masih ada {$menahan} anomali yang menahan migrasi.");
        }

        try {
            $berhasil = DaftarMigrasi::daftarkan(
                $scope->branch_id,
                $periode,
                $val['kunci_sampai'] ?? null,
                auth()->user()->employee?->id
            );
        } catch (\Throwable $e) {
            return back()->withErrors('Migrasi gagal: ' . $e->getMessage());
        }

        if (!$berhasil) {
            return back()->withErrors('Kantor tidak bisa didaftarkan.');
        }
        \Illuminate\Support\Facades\Cache::forget("kesiapan_migrasi:{$scope->branch_id}:{$periode->toDateString()}");

        return back()->with('message', 'Kantor dimigrasikan ke pendataan baru mulai ' . $periode->translatedFormat('j F Y')
            . (!empty($val['kunci_sampai']) ? ', terkunci s/d ' . Carbon::parse($val['kunci_sampai'])->translatedFormat('j F Y') : '') . '.');
    }

    /**
     * Isi modal Migrasikan (JSON, superuser): anomali, usulan tanggal kunci,
     * dan - kalau ?sampai diisi - pratinjau angka harian yang akan dikunci.
     */
    public function periksaMigrasi(Request $request)
    {
        if (!auth()->user()->hasRole('superuser')) {
            abort(403, 'Khusus superuser.');
        }

        $scope = AuthScope::resolve();
        $periode = Carbon::parse($request->input('periode', AgregasiScope::RENCANA_MULAI))->startOfMonth();

        if ($request->filled('sampai')) {
            $sampai = Carbon::parse($request->input('sampai'));
            if ($sampai->lt($periode) || $sampai->gte(Carbon::today())) {
                abort(422, 'Tanggal kunci harus antara awal bulan migrasi dan kemarin.');
            }

            return response()->json([
                'pratinjau' => PemeriksaanMigrasi::pratinjau($scope->branch_id, $periode, $sampai),
            ]);
        }

        return response()->json([
            'anomali' => PemeriksaanMigrasi::anomali($scope->branch_id, $periode),
            'usulan_kunci' => PemeriksaanMigrasi::usulanKunci($scope->branch_id, $periode),
            'kemarin' => Carbon::yesterday()->toDateString(),
        ]);
    }

    /**
     * Buat pinjaman MACET LAMA untuk satu kelompok x hari: penampung Z (ML di
     * bucket yang belum terinput) supaya ember ML data real = bucket. Z
     * dihitung ulang di server, tidak diambil dari layar.
     *
     * Pinjaman success ber-drop lama (hari tagih sama, 2020) -> pasti ember ML
     * dan di dalam jendela penyesuaian. nominal_drop = Z / 1,3 dibulatkan ke
     * atas; kelebihan pembulatan dipotong satu penyesuaian saldo_awal supaya
     * saldonya tepat Z. Satu kelompok x hari hanya boleh satu.
     *
     * ponytail: penampung belum dikecualikan dari NOA / daftar macet / cari
     * NIK / keluar target; tambahkan penanda is_penampung sebelum migrasi.
     */
    public function buatMacetLama(Request $request)
    {
        if (!auth()->user()->hasRole('superuser')) {
            abort(403, 'Khusus superuser.');
        }

        $val = $request->validate([
            'kelompok' => ['required'],
            'hari' => ['required', 'in:senin,selasa,rabu,kamis,jumat,sabtu'],
            'periode' => ['required', 'date'],
        ]);

        $scope = AuthScope::resolve();
        $periode = Carbon::parse($val['periode'])->startOfMonth();
        $baris = $this->barisKesiapan($scope->branch_id, $periode, $val['kelompok'])->firstWhere('hari', $val['hari']);
        $z = (int) ($baris['z'] ?? 0);

        if (!$baris || $z <= 0) {
            return back()->withErrors('Z baris ini tidak positif, tidak ada yang perlu ditampung.');
        }
        if ($baris['macet_lama']) {
            return back()->withErrors('Kelompok & hari ini sudah punya MACET LAMA. Koreksi saldonya lewat Nasabah Macet.');
        }

        $grouping = TransactionLoanOfficerGrouping::where('branch_id', $scope->branch_id)
            ->where('kelompok', $val['kelompok'])->firstOrFail();
        $dropDate = Carbon::parse('2019-12-31')->next(\App\Helpers\AppHelper::getNumbDays($val['hari']));
        $employee = auth()->user()->employee->id;

        try {
            DB::transaction(function () use ($grouping, $val, $dropDate, $employee, $z) {
            $customer = TransactionCustomer::firstOrCreate(
                ['nik' => self::NIK_MACET_LAMA],
                ['nama' => 'MACET LAMA', 'alamat' => '-']
            );
            if ($customer->nama !== 'MACET LAMA') {
                throw new \RuntimeException('NIK ' . self::NIK_MACET_LAMA . ' sudah dipakai nasabah lain (' . $customer->nama . ').');
            }
            $manage = $customer->manage_customer()->firstOrCreate([
                'transaction_loan_officer_grouping_id' => $grouping->id,
                'day' => $dropDate->dayOfWeek,
            ]);
            $loan = $manage->loan()->create([
                'transaction_loan_officer_grouping_id' => $grouping->id,
                'request_date' => $dropDate->toDateString(),
                'drop_date' => $dropDate->toDateString(),
                'hari' => $val['hari'],
                'status' => 'success',
                'nominal_drop' => (int) ceil($z / 1.3),
                'user_input' => $employee,
                'user_mantri' => $employee,
                'user_drop' => $employee,
            ])->fresh();

            if ((int) $loan->pinjaman !== $z) {
                PenyesuaianSaldo::buat($loan, TransactionSaldoAdjustment::JENIS_SALDO_AWAL, $z, 'Penampung Z (MACET LAMA)', auth()->user());
            }
            });
        } catch (\Throwable $e) {
            return back()->withErrors(\App\Helpers\AppHelper::pesanGagal($e, $e->getMessage()));
        }

        return back()->with('message', 'MACET LAMA dibuat: saldo Rp ' . number_format($z, 0, ',', '.') . '.');
    }

    /**
     * Baris Kesiapan Migrasi per kelompok x hari (lihat kesiapanMigrasi).
     * $kelompokSaja membatasi ke satu kelompok - dipakai layar Nasabah Macet.
     */
    private function barisKesiapan(int $branchId, Carbon $periode, $kelompokSaja = null): \Illuminate\Support\Collection
    {
        $groupings = DB::table('transaction_loan_officer_groupings')
            ->where('branch_id', $branchId)
            ->when($kelompokSaja !== null, fn($q) => $q->where('kelompok', $kelompokSaja))
            ->get(['id', 'kelompok']);
        $ids = $groupings->pluck('id')->all();
        $kelompok = $groupings->pluck('kelompok', 'id');

        $sistem = HitungAgregat::portofolio($ids, $periode->copy()->subDay(), $periode);
        $lama = DB::table('transaction_sirculations')
            ->whereIn('transaction_loan_officer_grouping_id', $ids)
            ->whereDate('date', $periode)
            ->get()
            ->groupBy(fn($r) => $r->transaction_loan_officer_grouping_id . '|' . strtolower(trim($r->day)));

        // Kelompok x hari yang sudah punya pinjaman MACET LAMA.
        $adaMacetLama = DB::table('transaction_loans as l')
            ->join('transaction_manage_customers as m', 'm.id', '=', 'l.transaction_manage_customer_id')
            ->join('transaction_customers as c', 'c.id', '=', 'm.transaction_customer_id')
            ->where('c.nik', self::NIK_MACET_LAMA)
            ->whereIn('l.transaction_loan_officer_grouping_id', $ids)
            ->get(['l.transaction_loan_officer_grouping_id as g', 'l.hari'])
            ->map(fn($r) => $r->g . '|' . strtolower($r->hari))
            ->flip();

        $nol = array_fill_keys(Ember::SEMUA, 0);
        $kategori = array_keys(Ember::KATEGORI);
        $urutHari = array_flip(['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu']);

        return collect(array_keys($sistem))->merge($lama->keys())->unique()
            ->map(function ($kunci) use ($sistem, $lama, $nol, $kategori, $kelompok, $adaMacetLama) {
                [$g, $hari] = explode('|', $kunci);
                $s = array_merge($nol, $sistem[$kunci] ?? []);
                $sistemKategori = array_map(fn($isi) => array_sum(array_intersect_key($s, array_flip($isi))), Ember::KATEGORI);
                $l = $lama->get($kunci, collect());
                $alasan = [];
                $emberLama = $selisih = $z = null;

                if ($l->isEmpty()) {
                    $alasan[] = 'Sirkulasi lama tidak ada';
                } elseif ($l->count() > 1) {
                    $alasan[] = "Sirkulasi lama dobel ({$l->count()} baris)";
                } else {
                    $r = $l->first();
                    $emberLama = [
                        'lancar' => (int) $r->amount - (int) $r->cm_amount - (int) $r->mb_amount - (int) $r->ml_amount,
                        'cm' => (int) $r->cm_amount,
                        'mb' => (int) $r->mb_amount,
                        'ml' => (int) $r->ml_amount,
                    ];
                    foreach ($kategori as $k) {
                        $selisih[$k] = $sistemKategori[$k] - $emberLama[$k];
                        if ($k !== 'ml' && $selisih[$k] !== 0) {
                            $alasan[] = 'Selisih ' . strtoupper($k);
                        }
                    }
                    $z = $emberLama['ml'] - $sistemKategori['ml'];
                    if ($z < 0) {
                        $alasan[] = 'Z minus';
                    } elseif ($z > 0) {
                        // Z plus dulu lolos - Krian 8 / Surabaya 6 migrasi tanpa MACET LAMA (mas 2026-10-27).
                        $alasan[] = 'Z plus: buat MACET LAMA';
                    }
                }

                return [
                    'kunci' => $kunci,
                    'kelompok' => $kelompok->get((int) $g),
                    'hari' => $hari,
                    'sistem' => $s,
                    'lama' => $emberLama,
                    'selisih' => $selisih,
                    'z' => $z,
                    'alasan' => $alasan,
                    'siap' => empty($alasan),
                    'macet_lama' => $adaMacetLama->has($kunci),
                ];
            })
            ->sortBy([['kelompok', 'asc'], fn($a, $b) => ($urutHari[$a['hari']] ?? 9) <=> ($urutHari[$b['hari']] ?? 9)])
            ->values();
    }

    /**
     * Penyesuaian saldo butuh `can-edit` di atas `view-all-groups`: melihat
     * boleh siapa saja yang berwenang, mengubah butuh izin yang dilepas-pasang
     * superuser.
     */
    private function bolehUbahSaldo(): bool
    {
        $u = auth()->user();

        return $u->hasPermissionTo('view-all-groups') && $u->hasPermissionTo('can-edit');
    }

    private function pastikanBolehUbahSaldo(): void
    {
        if (!$this->bolehUbahSaldo()) {
            abort(403, 'Penyesuaian saldo butuh wewenang kepala mantri/kasir/pimpinan DAN izin can-edit dari superuser.');
        }
    }

}
