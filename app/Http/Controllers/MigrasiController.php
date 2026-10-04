<?php

namespace App\Http\Controllers;

use App\Helpers\AgregasiScope;
use App\Helpers\AuthScope;
use App\Helpers\DaftarMigrasi;
use App\Helpers\Ember;
use App\Helpers\HitungAgregat;
use App\Helpers\PemeriksaAgregat;
use App\Helpers\PenyesuaianSaldo;
use App\Helpers\TargetBayangan;
use App\Helpers\SerahTerima;
use App\Models\Branch;
use App\Models\TransactionMonthlyClosing;
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
 * Hampir seluruhnya laporan BACA-SAJA. Dua pengecualian, keduanya milik serah
 * terima saldo awal: `simpanZ()` mencatat ML yang belum terinput, dan
 * `sahkanSerahTerima()` membubuhkan tanda tangannya. Tidak ada yang lain di
 * kelas ini yang menulis, dan tidak ada satu pun — termasuk kedua method itu —
 * yang bisa menyetel `awal_*`.
 *
 * Lihat .agents/agregasi_rekap.md §13.2.
 */
class MigrasiController extends Controller
{
    /**
     * Berapa bulan jarak minimal drop_date supaya sebuah pinjaman terhitung ML.
     * Golongan: selisih 0-2 lancar, 3 CM, 4 MB, >=5 ML.
     */
    private const SELISIH_BULAN_ML = 5;

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
     * Stock-take ML: bandingkan `ml_amount` (kuota yang dinyatakan kantor)
     * dengan saldo ML dari data nyata, per (kelompok, hari).
     *
     * Grain (kelompok, hari) disengaja — menggabungkannya per mantri
     * menyembunyikan selisih antar hari yang saling meniadakan. Diukur Juli
     * 2026: Rp 1,11 miliar hilang dari pandangan kalau digabung.
     * Lihat §13.3.
     *
     * Laporan ini TIDAK memaksa angka cocok dan tidak menulis apa pun. Yang
     * dipakai dari selisihnya cuma arah (buka/tutup pintu input ML) dan
     * besarnya (kuota saat terbuka).
     */
    public function stockTakeMl(Request $request)
    {
        if (!auth()->user()->hasPermissionTo('view-all-groups')) {
            abort(403, 'Laporan ini untuk kepala mantri, kasir, dan pimpinan.');
        }

        $scope = AuthScope::resolve();

        $groupings = DB::table('transaction_loan_officer_groupings')
            ->where('branch_id', $scope->branch_id)
            ->orderBy('kelompok')
            ->get(['id', 'kelompok']);

        $groupingIds = $groupings->pluck('id')->all();

        $diminta = Carbon::now()->startOfMonth();
        $mundur = false;

        if ($request->filled('periode')) {
            // Pilihan eksplisit user selalu menang - termasuk kalau bulannya
            // memang kosong, karena "kosong" itu sendiri informasi.
            $periode = Carbon::parse($request->periode)->startOfMonth();
        } else {
            $periode = $this->periodeTerakhirBerdata($groupingIds, $diminta);
            $mundur = !$periode->equalTo($diminta);
        }

        // ML pada periode P = selisih bulan >= 5, yaitu drop_date jatuh
        // sebelum awal bulan (P - 4). Contoh P = Juli 2026 -> batas 1 Maret
        // 2026: drop Februari (selisih 5) masuk, drop Maret (selisih 4, masih
        // MB) tidak.
        $batasMl = $periode->copy()->subMonthsNoOverflow(self::SELISIH_BULAN_ML - 1);

        $baris = $groupings->isEmpty()
            ? collect()
            : $this->susunBarisStockTake($groupings, $periode, $batasMl);

        return Inertia::render('Migrasi/StockTakeMl', [
            'datas' => $baris->values(),
            'server_filter' => [
                'periode' => $periode->format('Y-m-d'),
                'periode_diminta' => $diminta->format('Y-m-d'),
                'periode_mundur' => $mundur,
                'batas_ml' => $batasMl->format('Y-m-d'),
                'branch_id' => $scope->branch_id,
                'sudah_migrasi' => AgregasiScope::sudahMigrasi($scope->branch_id),
                'mulai_pendataan_baru' => AgregasiScope::tanggalMulai($scope->branch_id)?->format('Y-m-d'),
                'unit' => Branch::whereKey($scope->branch_id)->value('unit'),
            ],
            'ringkasan' => $this->ringkas($baris),
        ]);
    }

    /**
     * Pemeriksaan agregat: buktikan angka tersimpan masih sama dengan sumbernya.
     *
     * Memakai App\Helpers\PemeriksaAgregat — helper yang sama dengan perintah
     * CLI `closing:verifikasi`, supaya layar dan perintah mustahil menyimpang.
     *
     * BACA-SAJA, dan sengaja tidak menyediakan tombol "perbaiki": memperbaiki
     * diam-diam menghapus buktinya. Kalau angka terkunci meleset, yang perlu
     * dilakukan adalah membuka kunci lewat jalur resmi (beralasan, tercatat),
     * bukan menimpanya tanpa jejak.
     */
    /**
     * Laporan bayangan target: rantai (tersimpan) vs hitung (dari sumber).
     * Read-only, view-all-groups.
     */
    public function targetBayangan(Request $request)
    {
        if (!auth()->user()->hasPermissionTo('view-all-groups')) {
            abort(403, 'Laporan target untuk kepala mantri, kasir, dan pimpinan.');
        }

        $scope = AuthScope::resolve();
        $periode = $request->filled('periode')
            ? Carbon::parse($request->periode)->startOfMonth()
            : Carbon::now()->startOfMonth();

        $ids = DB::table('transaction_loan_officer_groupings')
            ->where('branch_id', $scope->branch_id)->pluck('id')->all();

        // Kantor migrasi: rantai dibaca dari daily_closings (alur baru), bukan
        // daily_recaps yang beku sejak migrasi.
        $migrasi = \App\Helpers\AgregasiScope::pakaiAgregatBaru($scope->branch_id, $periode);
        $baris = TargetBayangan::laporan($ids, $periode, $migrasi);

        $totalRantai = array_sum(array_column($baris, 'rantai'));
        $totalHitung = array_sum(array_column($baris, 'hitung'));

        return Inertia::render('Migrasi/TargetBayangan', [
            'baris' => $baris,
            'ringkas' => [
                'rantai' => $totalRantai,
                'hitung' => $totalHitung,
                'selisih' => $totalRantai - $totalHitung,
                'meleset' => count(array_filter($baris, fn($b) => $b['selisih'] !== 0)),
            ],
            'server_filter' => [
                'periode' => $periode->format('Y-m'),
                'sebelumnya' => $periode->copy()->subMonthNoOverflow()->format('Y-m'),
                'berikutnya' => $periode->copy()->addMonthNoOverflow()->format('Y-m'),
                'unit' => Branch::whereKey($scope->branch_id)->value('unit'),
            ],
        ]);
    }

    /**
     * Recount (stok-opname) SEED satu buku: setel target hari tagih berikutnya
     * yang belum terkunci = target_hitung portofolio, target_source='recount'.
     * Rantai lanjut dari basis yang sudah benar. Superuser + kantor migrasi saja.
     */
    public function recountTarget(Request $request)
    {
        if (!auth()->user()->hasRole('superuser')) {
            abort(403, 'Hanya superuser yang boleh recount target.');
        }

        $request->validate([
            'kelompok' => ['required'],
            'hari' => ['required', 'string'],
            'periode' => ['nullable'],
        ]);

        $branchId = (int) AuthScope::getActiveBranchId();
        if (!AgregasiScope::sudahMigrasi($branchId)) {
            return redirect()->back()->withErrors('Kantor ini belum migrasi ke alur baru.');
        }

        $grouping = \App\Models\TransactionLoanOfficerGrouping::where('branch_id', $branchId)
            ->where('kelompok', $request->kelompok)->first();
        if (!$grouping) {
            return redirect()->back()->withErrors('Kelompok tidak ditemukan di cabang aktif.');
        }

        $periode = $request->filled('periode')
            ? Carbon::parse($request->periode)->startOfMonth()
            : Carbon::now()->startOfMonth();

        // target_hitung dari portofolio - reuse laporan (bukan logika kembar).
        $rows = TargetBayangan::laporan([$grouping->id], $periode, true);
        $hitung = collect($rows)->firstWhere('hari', strtolower($request->hari))['hitung'] ?? null;
        if ($hitung === null) {
            return redirect()->back()->withErrors('Tidak ada data hitung untuk buku ini.');
        }

        // Seed = hari tagih berikutnya (>= hari ini) yang belum terkunci kasir.
        $weekday = \App\Helpers\AppHelper::getNumbDays($request->hari); // Carbon dayOfWeek
        $today = Carbon::today();

        $seed = \App\Models\TransactionDailyClosing::where('transaction_loan_officer_grouping_id', $grouping->id)
            ->whereNull('kasir_lock_at')
            ->whereDate('date', '>=', $today->toDateString())
            ->whereRaw('DAYOFWEEK(date) = ?', [$weekday + 1])
            ->orderBy('date')->first();

        if (!$seed) {
            $tgl = $today->copy();
            while ($tgl->dayOfWeek !== $weekday) {
                $tgl->addDay();
            }
            $seed = \App\Models\TransactionDailyClosing::firstOrCreate([
                'transaction_loan_officer_grouping_id' => $grouping->id,
                'date' => $tgl->toDateString(),
            ]);
        }

        $seed->update([
            'target' => (int) $hitung,
            'target_on' => $today->toDateString(),
            'target_source' => 'recount',
        ]);

        return redirect()->back()->with('message', sprintf(
            'Recount: target %s (kelompok %s, %s) disetel ke %s dari portofolio.',
            Carbon::parse($seed->date)->format('d M Y'),
            $request->kelompok,
            $request->hari,
            number_format((int) $hitung, 0, ',', '.')
        ));
    }

    /**
     * Layar penyesuaian saldo nasabah lama.
     *
     * Melihat: view-all-groups. Membuat/menyetujui: + can-edit (bolehUbah...).
     */
    public function penyesuaianSaldo(Request $request)
    {
        if (!auth()->user()->hasPermissionTo('view-all-groups')) {
            abort(403, 'Penyesuaian saldo untuk kepala mantri, kasir, dan pimpinan.');
        }

        $scope = AuthScope::resolve();
        $ids = DB::table('transaction_loan_officer_groupings')
            ->where('branch_id', $scope->branch_id)->pluck('id');

        $periode = Carbon::now()->startOfMonth();

        // Antrean butuh persetujuan (jenis wajib-persetujuan, belum disetujui).
        $antrean = TransactionSaldoAdjustment::with('loan.customer', 'penginput', 'loan_officer_grouping')
            ->whereIn('transaction_loan_officer_grouping_id', $ids)
            ->whereIn('jenis', TransactionSaldoAdjustment::WAJIB_PERSETUJUAN)
            ->whereNull('approved_at')
            ->orderByDesc('id')
            ->limit(100)
            ->get()
            ->map(fn($a) => [
                'id' => $a->id,
                'jenis' => $a->jenis,
                'nominal' => (int) $a->nominal,
                'kelompok' => $a->loan_officer_grouping->kelompok ?? null,
                'catatan' => $a->catatan,
                'penginput' => $a->penginput->nama_karyawan ?? null,
                'user_input' => $a->user_input,
            ]);

        // Laporan total penyesuaian per mantri bulan ini — pagar wajib (§7):
        // penyesuaian yang menumpuk di satu mantri harus terlihat.
        $perMantri = TransactionSaldoAdjustment::whereIn('transaction_loan_officer_grouping_id', $ids)
            ->whereYear('berlaku_bulan', $periode->year)
            ->whereMonth('berlaku_bulan', $periode->month)
            ->join('employees', 'employees.id', '=', 'transaction_saldo_adjustments.user_input')
            ->selectRaw('employees.nama_karyawan AS mantri, COUNT(*) AS jml, SUM(nominal) AS total')
            ->groupBy('employees.nama_karyawan')
            ->orderByDesc('total')
            ->get();

        return Inertia::render('Migrasi/PenyesuaianSaldo', [
            'antrean' => $antrean,
            'per_mantri' => $perMantri,
            'server_filter' => [
                'unit' => Branch::whereKey($scope->branch_id)->value('unit'),
                'sudah_migrasi' => AgregasiScope::sudahMigrasi($scope->branch_id),
                'batas' => AgregasiScope::batasPenyesuaian($scope->branch_id)?->toDateString(),
                'boleh_ubah' => $this->bolehUbahSerahTerima(),
                'periode' => $periode->format('Y-m'),
            ],
            'jenis_opsi' => [
                ['nilai' => TransactionSaldoAdjustment::JENIS_SALDO_AWAL, 'label' => 'Saldo awal (nasabah lama, mengurangi)', 'butuh_persetujuan' => false],
                ['nilai' => TransactionSaldoAdjustment::JENIS_DUPLIKAT, 'label' => 'Duplikat (mengurangi)', 'butuh_persetujuan' => true],
                ['nilai' => TransactionSaldoAdjustment::JENIS_LEBIH_INPUT, 'label' => 'Lebih input (mengurangi)', 'butuh_persetujuan' => true],
                ['nilai' => TransactionSaldoAdjustment::JENIS_KURANG_INPUT, 'label' => 'Kurang input (menambah)', 'butuh_persetujuan' => true],
            ],
        ]);
    }

    /** Cari pinjaman ML yang memenuhi syarat berdasarkan NIK (axios). */
    public function cariPenyesuaian(Request $request)
    {
        if (!auth()->user()->hasPermissionTo('view-all-groups')) {
            abort(403);
        }

        $val = $request->validate(['nik' => ['required', 'digits:16']], [
            'nik.required' => 'NIK wajib diisi.',
            'nik.digits' => 'NIK harus 16 digit.',
        ]);

        $scope = AuthScope::resolve();

        return response()->json([
            'loans' => PenyesuaianSaldo::cariEligible($scope->branch_id, $val['nik']),
        ]);
    }

    /** Simpan satu penyesuaian dari sisa saldo yang diketik. */
    public function simpanPenyesuaian(Request $request)
    {
        $this->pastikanBolehUbahSerahTerima();

        $val = $request->validate([
            'loan_id' => ['required', 'integer'],
            'jenis' => ['required', 'string'],
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
            PenyesuaianSaldo::buat($loan, $val['jenis'], (int) $val['sisa_saldo'], $val['catatan'] ?? null, auth()->user());
        } catch (\Throwable $e) {
            return back()->withErrors($e->getMessage());
        }

        return back()->with('message', 'Penyesuaian tersimpan.');
    }

    /** Setujui penyesuaian (orang kedua). */
    public function setujuiPenyesuaian(TransactionSaldoAdjustment $adjustment)
    {
        $this->pastikanBolehUbahSerahTerima();

        $scope = AuthScope::resolve();
        $branchLoan = DB::table('transaction_loan_officer_groupings')
            ->where('id', $adjustment->transaction_loan_officer_grouping_id)->value('branch_id');
        if ((int) $branchLoan !== (int) $scope->branch_id) {
            abort(403, 'Penyesuaian ini milik kantor lain.');
        }

        try {
            PenyesuaianSaldo::setujui($adjustment, auth()->user());
        } catch (\Throwable $e) {
            return back()->withErrors($e->getMessage());
        }

        return back()->with('message', 'Penyesuaian disetujui.');
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
            ],
        ]);
    }

    /**
     * Nasabah macet (ember ML pada bulan acuan) yang belum lunas, satu
     * kelompok x hari - tempat menyesuaikan saldo sebelum / sesudah migrasi
     * supaya saldo awal benar. Superuser. Penyimpanan lewat route
     * penyesuaian_saldo_simpan (PenyesuaianSaldo::buat, aturan yang sama
     * dengan layar per NIK).
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
            ->orderBy('drop_date')
            ->get();
        $ids = $loans->pluck('id')->all();
        $awal = PenyesuaianSaldo::saldoBanyak($ids, $periode->copy()->subDay());
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
                    'menunggu' => $a->butuhPersetujuan() && $a->approved_at === null,
                ])->values(),
            ])
            ->values();

        return Inertia::render('Migrasi/NasabahMacet', [
            'datas' => $datas,
            'ringkasan' => $this->barisKesiapan($scope->branch_id, $periode, $kelompok)->firstWhere('hari', $hari),
            'jenis' => array_keys(TransactionSaldoAdjustment::ARAH),
            'wajib_persetujuan' => TransactionSaldoAdjustment::WAJIB_PERSETUJUAN,
            'server_filter' => [
                'kelompok' => (string) $kelompok,
                'hari' => $hari,
                'daftar_kelompok' => $daftarKelompok,
                'periode' => $periode->toDateString(),
                'batas_penyesuaian' => $batasSesuai?->toDateString(),
                'unit' => Branch::whereKey($scope->branch_id)->value('unit'),
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

        $branches = Branch::orderBy('wilayah')->orderBy('unit')->get(['id', 'unit', 'wilayah', 'mulai_pendataan_baru']);

        return Inertia::render('Migrasi/Dashboard', [
            'wilayah' => $branches->groupBy('wilayah')->map(fn($kantor, $w) => [
                'wilayah' => (int) $w,
                'kantor' => $kantor->map(fn($b) => [
                    'id' => $b->id,
                    'unit' => $b->unit,
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
     * Layar serah terima saldo awal — pertemuan sistem lama dan baru.
     */
    public function serahTerima(Request $request)
    {
        if (!auth()->user()->hasPermissionTo('view-all-groups')) {
            abort(403, 'Serah terima saldo awal untuk kepala mantri, kasir, dan pimpinan.');
        }

        $scope = AuthScope::resolve();

        // Bawaannya bulan migrasi kantor ini, bukan bulan berjalan. Serah terima
        // hanya pernah terjadi di bulan itu; membuka bulan lain sebagai bawaan
        // cuma menampilkan layar kosong yang membingungkan.
        $periode = $request->filled('periode')
            ? Carbon::parse($request->periode)->startOfMonth()
            : (AgregasiScope::tanggalMulai($scope->branch_id)?->startOfMonth()
                ?? Carbon::now()->startOfMonth());

        return Inertia::render('Migrasi/SerahTerima', [
            'hasil' => SerahTerima::periksa($scope->branch_id, $periode),
            'server_filter' => [
                'periode' => $periode->format('Y-m-d'),
                'boleh_ubah' => $this->bolehUbahSerahTerima(),
            ],
        ]);
    }

    /** Catat Z (ML belum terinput) untuk satu baris bulanan. */
    public function simpanZ(Request $request, TransactionMonthlyClosing $closing)
    {
        $this->pastikanBolehUbahSerahTerima($closing);

        $val = $request->validate([
            // nullable disengaja: mengosongkan kembali berarti "belum
            // ditetapkan", dan itu keadaan yang sah untuk kembali ke sana
            // selama belum diteken.
            'z' => ['nullable', 'integer', 'min:0'],
        ], [
            'z.min' => 'ML belum terinput tidak boleh negatif.',
        ]);

        try {
            SerahTerima::tetapkanZ($closing, $val['z'] ?? null);
        } catch (\Throwable $e) {
            return back()->withErrors($e->getMessage());
        }

        return back()->with('message', 'Tersimpan.');
    }

    /** Bubuhkan tanda tangan serah terima satu kantor satu periode. */
    public function sahkanSerahTerima(Request $request)
    {
        $this->pastikanBolehUbahSerahTerima();

        $scope = AuthScope::resolve();
        $periode = Carbon::parse($request->input('periode'))->startOfMonth();

        try {
            $hasil = SerahTerima::sahkan($scope->branch_id, $periode, auth()->user());
        } catch (\Throwable $e) {
            return back()->withErrors($e->getMessage());
        }

        return back()->with('message', sprintf(
            'Serah terima disahkan untuk %d baris. Saldo awal periode ini tidak dihitung ulang lagi.',
            $hasil['disahkan']
        ));
    }

    /**
     * Menetapkan Z dan menekennya butuh `can-edit` di atas `view-all-groups`.
     *
     * Pola bongkar-pasang yang sudah dipakai untuk membuka kunci: melihat boleh
     * siapa saja yang berwenang, mengubah butuh izin yang dilepas-pasang
     * superuser. Z memotong kuota input ML; sekali diteken, saldo awalnya beku.
     */
    private function bolehUbahSerahTerima(): bool
    {
        $u = auth()->user();

        return $u->hasPermissionTo('view-all-groups') && $u->hasPermissionTo('can-edit');
    }

    private function pastikanBolehUbahSerahTerima(?TransactionMonthlyClosing $closing = null): void
    {
        if (!$this->bolehUbahSerahTerima()) {
            abort(403, 'Serah terima butuh wewenang kepala mantri/kasir/pimpinan DAN izin can-edit dari superuser.');
        }

        if ($closing) {
            $scope = AuthScope::resolve();

            $branchId = DB::table('transaction_loan_officer_groupings')
                ->where('id', $closing->transaction_loan_officer_grouping_id)
                ->value('branch_id');

            if ((int) $branchId !== (int) $scope->branch_id) {
                abort(403, 'Baris ini milik kantor lain.');
            }
        }
    }

    public function pemeriksaanAgregat(Request $request)
    {
        if (!auth()->user()->hasPermissionTo('view-all-groups')) {
            abort(403, 'Pemeriksaan agregat untuk kepala mantri, kasir, dan pimpinan.');
        }

        $scope = AuthScope::resolve();

        $periode = $request->filled('periode')
            ? Carbon::parse($request->periode)->startOfMonth()
            : Carbon::now()->startOfMonth();

        $hasil = PemeriksaAgregat::periksa($scope->branch_id, $periode);

        return Inertia::render('Migrasi/PemeriksaanAgregat', [
            'hasil' => $hasil,
            'server_filter' => [
                'periode' => $periode->format('Y-m-d'),
                'unit' => Branch::whereKey($scope->branch_id)->value('unit'),
                'sudah_migrasi' => AgregasiScope::sudahMigrasi($scope->branch_id),
                'mulai' => AgregasiScope::tanggalMulai($scope->branch_id)?->format('Y-m-d'),
            ],
        ]);
    }

    /**
     * Pemantau migrasi nasional: berapa kantor sudah menyeberang, dan yang
     * belum itu tersendat di mana.
     *
     * Kantor menyeberang dengan MENUTUP BUKU bulan sebelumnya, jadi yang perlu
     * dilihat bukan cuma "sudah atau belum", melainkan APA YANG KURANG:
     * kantor yang sudah menutup buku tapi belum menyeberang berarti ada yang
     * salah; kantor yang belum menutup buku tinggal dikejar tutup bukunya.
     */
    public function pemantauMigrasi(Request $request)
    {
        if (!auth()->user()->hasPermissionTo('view-all-branches')) {
            abort(403, 'Pemantau migrasi untuk staf pusat dan superuser.');
        }

        $bulan = DaftarMigrasi::bulanMigrasi();

        $branches = Branch::orderBy('wilayah')->orderBy('unit')
            ->get(['id', 'unit', 'wilayah', 'type', 'mulai_pendataan_baru']);

        $ids = $branches->pluck('id');

        // Sudah menutup buku untuk bulan migrasi? Barisnya lahir hanya kalau
        // ada yang benar-benar menutup buku, jadi ini penanda yang jujur.
        $sudahTutupBuku = collect();
        if ($bulan) {
            $sudahTutupBuku = DB::table('transaction_sirculations as s')
                ->join('transaction_loan_officer_groupings as og', 'og.id', '=', 's.transaction_loan_officer_grouping_id')
                ->whereIn('og.branch_id', $ids)
                ->whereDate('s.date', $bulan->toDateString())
                ->groupBy('og.branch_id')
                ->pluck(DB::raw('COUNT(*)'), 'og.branch_id');
        }

        $barisClosing = DB::table('transaction_daily_closings as d')
            ->join('transaction_loan_officer_groupings as og', 'og.id', '=', 'd.transaction_loan_officer_grouping_id')
            ->whereIn('og.branch_id', $ids)
            ->groupBy('og.branch_id')
            ->get([
                'og.branch_id',
                DB::raw('COUNT(*) AS baris'),
                DB::raw('SUM(d.kasir_lock_at IS NOT NULL) AS terkunci'),
            ])
            ->keyBy('branch_id');

        $datas = $branches->map(function ($b) use ($sudahTutupBuku, $barisClosing) {
            $tutupBuku = (int) ($sudahTutupBuku[$b->id] ?? 0);
            $closing = $barisClosing->get($b->id);
            $menyeberang = $b->mulai_pendataan_baru !== null;

            return [
                'branch_id' => $b->id,
                'unit' => $b->unit,
                'wilayah' => $b->wilayah,
                'menyeberang' => $menyeberang,
                'mulai' => $b->mulai_pendataan_baru?->toDateString(),
                'kelompok_tutup_buku' => $tutupBuku,
                'baris_closing' => (int) ($closing->baris ?? 0),
                'terkunci' => (int) ($closing->terkunci ?? 0),
                'status' => $this->statusMigrasi($menyeberang, $tutupBuku),
            ];
        })->values();

        return Inertia::render('Migrasi/Pemantau', [
            'datas' => $datas,
            'ringkasan' => [
                'bulan_migrasi' => $bulan?->format('Y-m'),
                'total' => $datas->count(),
                'menyeberang' => $datas->where('menyeberang', true)->count(),
                'siap' => $datas->where('status', 'siap')->count(),
                'belum_tutup_buku' => $datas->where('status', 'belum_tutup_buku')->count(),
            ],
        ]);
    }

    /**
     * Status sebuah kantor terhadap migrasi.
     *
     * `siap` itu keadaan yang perlu diperiksa: kantornya sudah menutup buku,
     * jadi pendaftarannya semestinya sudah jalan. Kalau masih tersangkut di
     * sini, ada yang gagal - bukan sekadar belum dikerjakan.
     */
    private function statusMigrasi(bool $menyeberang, int $tutupBuku): string
    {
        if ($menyeberang) {
            return 'menyeberang';
        }

        return $tutupBuku > 0 ? 'siap' : 'belum_tutup_buku';
    }

    /**
     * Kesiapan closing lama: telusuri hari demi hari dari tanggal 1, berhenti
     * di hari pertama yang salah satu approval-nya belum ada.
     *
     * KENAPA BERHENTI, BUKAN MENGHITUNG TOTAL
     * ---------------------------------------
     * Rekap harian hanya bisa dipercaya sebagai rangkaian. Kalau tanggal 5
     * belum diteken kasir, angka tanggal 6 ke atas tidak otomatis batal — tapi
     * saldo berjalannya sudah tidak bisa ditelusuri lewat rantai yang utuh.
     * Jadi yang berguna diketahui bukan "berapa hari yang lengkap", melainkan
     * "sampai hari ke berapa rantainya masih utuh".
     *
     * Angka 22 dari 27 hari terisi bisa terdengar bagus, padahal kalau yang
     * bolong justru hari pertama, rantainya putus sejak awal.
     */
    public function kesiapanClosing(Request $request)
    {
        if (!auth()->user()->hasPermissionTo('view-all-groups')) {
            abort(403, 'Laporan ini untuk kepala mantri, kasir, dan pimpinan.');
        }

        $scope = AuthScope::resolve();

        $periode = $request->filled('periode')
            ? Carbon::parse($request->periode)->startOfMonth()
            : Carbon::now()->startOfMonth();

        $groupings = DB::table('transaction_loan_officer_groupings')
            ->where('branch_id', $scope->branch_id)
            ->orderBy('kelompok')
            ->get(['id', 'kelompok']);

        $rekap = DB::table('transaction_daily_recaps')
            ->whereIn('transaction_loan_officer_grouping_id', $groupings->pluck('id'))
            ->whereBetween('date', [
                $periode->toDateString(),
                $periode->copy()->endOfMonth()->toDateString(),
            ])
            ->orderBy('date')
            ->get([
                'transaction_loan_officer_grouping_id AS g',
                'date',
                'drop',
                'storting',
                'daily_kepala_approval AS kepala',
                'daily_kasir_approval AS kasir',
            ])
            ->groupBy('g');

        $datas = $groupings->map(function ($g) use ($rekap) {
            $baris = $rekap->get($g->id, collect());
            $putus = false;

            $hari = $baris->map(function ($r) use (&$putus) {
                $adaKepala = $r->kepala !== null;
                $adaKasir = $r->kasir !== null;
                $lengkap = $adaKepala && $adaKasir;

                // Begitu satu hari tidak lengkap, seluruh hari sesudahnya
                // ditandai "di luar rantai" - bukan karena angkanya salah,
                // tapi karena tidak lagi bisa ditelusuri sebagai rangkaian.
                $diLuarRantai = $putus;
                if (!$lengkap) {
                    $putus = true;
                }

                return [
                    'tanggal' => Carbon::parse($r->date)->toDateString(),
                    'drop' => (int) $r->drop,
                    'storting' => (int) $r->storting,
                    'kepala' => $adaKepala,
                    'kasir' => $adaKasir,
                    'lengkap' => $lengkap,
                    'di_luar_rantai' => $diLuarRantai,
                ];
            })->values();

            $utuhSampai = null;
            foreach ($hari as $h) {
                if (!$h['lengkap']) {
                    break;
                }
                $utuhSampai = $h['tanggal'];
            }

            return [
                'kelompok' => $g->kelompok,
                'hari' => $hari,
                'jumlah_hari' => $hari->count(),
                'jumlah_lengkap' => $hari->where('lengkap', true)->count(),
                'utuh_sampai' => $utuhSampai,
                'putus_di' => $hari->firstWhere('lengkap', false)['tanggal'] ?? null,
            ];
        })->values();

        return Inertia::render('Migrasi/KesiapanClosing', [
            'datas' => $datas,
            'server_filter' => [
                'periode' => $periode->format('Y-m-d'),
                'unit' => Branch::whereKey($scope->branch_id)->value('unit'),
                'branch_id' => $scope->branch_id,
            ],
        ]);
    }

    /**
     * Periode bawaan: bulan berjalan kalau sudah punya baris sirkulasi, kalau
     * belum mundur ke periode terakhir yang punya.
     *
     * Kenapa perlu: baris sirkulasi sebuah periode baru lahir saat bulan
     * SEBELUMNYA ditutup. Jadi di awal setiap bulan - sebelum satu pun kantor
     * menutup buku - bulan berjalan pasti belum punya baris, dan halaman ini
     * akan menampilkan semua kelompok sebagai "belum dinyatakan" dengan kolom
     * kuota kosong. Secara angka itu benar, tapi terbaca seperti halaman rusak.
     *
     * Mundur hanya berlaku untuk BAWAAN. Kalau user memilih periode sendiri,
     * pilihannya dihormati apa adanya - termasuk bulan kosong, karena "kosong"
     * itu sendiri jawaban yang dia cari.
     */
    private function periodeTerakhirBerdata(array $groupingIds, Carbon $diminta): Carbon
    {
        if (empty($groupingIds)) {
            return $diminta;
        }

        $adaDiBulanIni = DB::table('transaction_sirculations')
            ->whereIn('transaction_loan_officer_grouping_id', $groupingIds)
            ->where('date', $diminta->format('Y-m-d'))
            ->exists();

        if ($adaDiBulanIni) {
            return $diminta;
        }

        $terakhir = DB::table('transaction_sirculations')
            ->whereIn('transaction_loan_officer_grouping_id', $groupingIds)
            ->where('date', '<', $diminta->format('Y-m-d'))
            ->max('date');

        return $terakhir ? Carbon::parse($terakhir)->startOfMonth() : $diminta;
    }

    /**
     * Gabungkan sisi data (X) dan sisi kuota (Y) jadi satu baris per
     * (kelompok, hari), lalu tetapkan status pintunya.
     */
    private function susunBarisStockTake($groupings, Carbon $periode, Carbon $batasMl)
    {
        $groupingIds = $groupings->pluck('id')->all();
        $namaKelompok = $groupings->pluck('kelompok', 'id');

        $xPerBaris = $this->saldoMlDariData($groupingIds, $batasMl);
        $yPerBaris = $this->kuotaDinyatakan($groupingIds, $periode);

        // Union kunci dari kedua sisi: baris yang cuma punya salah satunya
        // justru yang paling perlu terlihat.
        return collect($xPerBaris->keys())
            ->merge($yPerBaris->keys())
            ->unique()
            ->sort()
            ->map(function ($kunci) use ($xPerBaris, $yPerBaris, $namaKelompok) {
                [$groupingId, $hari] = explode('|', $kunci);

                $x = $xPerBaris->get($kunci);
                $y = $yPerBaris->get($kunci);

                return array_merge([
                    'grouping_id' => (int) $groupingId,
                    'kelompok' => $namaKelompok->get((int) $groupingId),
                    'hari' => $hari,
                    'jumlah_pinjaman_ml' => (int) ($x['jml'] ?? 0),
                    'data_nyata' => (int) ($x['saldo'] ?? 0),
                    'kuota_dinyatakan' => $y,
                ], $this->tetapkanStatus($y, (int) ($x['saldo'] ?? 0)));
            });
    }

    /**
     * X — saldo ML dari data nyata per (kelompok, hari).
     *
     * saldo = pinjaman − angsuran − pemutihan + SUM(efek penyesuaian)
     *
     * Ekspresi efek penyesuaian dibangkitkan dari
     * TransactionSaldoAdjustment::ARAH, BUKAN ditulis ulang di SQL — supaya
     * arah tanda tetap punya satu sumber kebenaran.
     */
    private function saldoMlDariData(array $groupingIds, Carbon $batasMl)
    {
        $efek = $this->ekspresiEfekPenyesuaian();
        $saldo = "(l.pinjaman - IFNULL(l.total_angsuran,0) - IFNULL(w.wo,0) + IFNULL(a.efek,0))";

        $rows = DB::table(DB::raw('transaction_loans l'))
            ->leftJoin(DB::raw(
                '(SELECT transaction_loan_id, SUM(nominal) wo
                    FROM transaction_white_offs GROUP BY transaction_loan_id) w'
            ), 'w.transaction_loan_id', '=', 'l.id')
            ->leftJoin(DB::raw(
                "(SELECT transaction_loan_id, SUM($efek) efek
                    FROM transaction_saldo_adjustments
                   WHERE jenis NOT IN ('" . implode("','", TransactionSaldoAdjustment::WAJIB_PERSETUJUAN) . "')
                      OR approved_at IS NOT NULL
                   GROUP BY transaction_loan_id) a"
            ), 'a.transaction_loan_id', '=', 'l.id')
            ->whereIn('l.transaction_loan_officer_grouping_id', $groupingIds)
            ->where('l.status', 'success')
            ->where('l.drop_date', '<', $batasMl->format('Y-m-d'))
            ->whereNotNull('l.hari')
            ->whereRaw("$saldo > 0")
            ->groupBy('l.transaction_loan_officer_grouping_id', DB::raw('LOWER(l.hari)'))
            ->get([
                DB::raw('l.transaction_loan_officer_grouping_id AS g'),
                DB::raw('LOWER(l.hari) AS hari'),
                DB::raw("SUM($saldo) AS saldo"),
                DB::raw('COUNT(*) AS jml'),
            ]);

        return $rows->keyBy(fn($r) => $r->g . '|' . $r->hari)
            ->map(fn($r) => ['saldo' => $r->saldo, 'jml' => $r->jml]);
    }

    /**
     * Y — kuota yang dinyatakan kantor, dari transaction_sirculations.
     *
     * NULL (bukan 0) kalau kelompok+hari itu tidak punya baris sirkulasi sama
     * sekali. Bedanya penting: "dinyatakan nol" beda dari "belum pernah
     * dinyatakan", dan ±23% kelompok memang tidak punya barisnya.
     */
    private function kuotaDinyatakan(array $groupingIds, Carbon $periode)
    {
        return DB::table('transaction_sirculations')
            ->whereIn('transaction_loan_officer_grouping_id', $groupingIds)
            ->where('date', $periode->format('Y-m-d'))
            ->groupBy('transaction_loan_officer_grouping_id', DB::raw('LOWER(day)'))
            ->get([
                DB::raw('transaction_loan_officer_grouping_id AS g'),
                DB::raw('LOWER(day) AS hari'),
                DB::raw('SUM(ml_amount) AS y'),
            ])
            ->keyBy(fn($r) => $r->g . '|' . $r->hari)
            ->map(fn($r) => (int) $r->y);
    }

    /**
     * Aturan gerbang input ML susulan (§13.3).
     *
     * Perbandingan ini HANYA sah dipakai sekali, saat serah terima. Setelah
     * kantor migrasi, yang berlaku adalah sisa kuota tersimpan yang hanya bisa
     * berkurang — kalau perbandingan ini dijalankan ulang tiap bulan, pintunya
     * akan terbuka lagi tiap kali nasabah ML membayar (karena X turun), dan
     * staf dipersilakan menambah ML fiktif senilai setoran yang baru masuk.
     */
    private function tetapkanStatus(?int $y, int $x): array
    {
        if ($y === null) {
            return [
                'status' => 'belum_dinyatakan',
                'kuota_awal' => null,
                'keterangan' => 'Belum punya baris sirkulasi — kuota belum pernah dinyatakan',
            ];
        }

        if ($y > $x) {
            return [
                'status' => 'dibuka',
                'kuota_awal' => $y - $x,
                'keterangan' => 'Masih ada ML yang orangnya belum masuk sistem',
            ];
        }

        return [
            'status' => 'ditutup',
            'kuota_awal' => 0,
            'keterangan' => $y === $x
                ? 'Kuota sudah penuh'
                : 'Data sudah melebihi kuota yang dinyatakan',
        ];
    }

    private function ringkas($baris): array
    {
        $per = fn(string $status) => $baris->where('status', $status);

        return [
            'dibuka' => [
                'baris' => $per('dibuka')->count(),
                'kuota' => (int) $per('dibuka')->sum('kuota_awal'),
            ],
            'ditutup' => ['baris' => $per('ditutup')->count()],
            'belum_dinyatakan' => [
                'baris' => $per('belum_dinyatakan')->count(),
                'data_nyata' => (int) $per('belum_dinyatakan')->sum('data_nyata'),
            ],
            'total_baris' => $baris->count(),
        ];
    }

    /**
     * Bangun ekspresi SQL untuk efek bertanda penyesuaian, dari konstanta ARAH.
     * Ditulis begini supaya arah tanda tidak pernah didefinisikan dua kali.
     */
    private function ekspresiEfekPenyesuaian(): string
    {
        $cases = '';
        foreach (TransactionSaldoAdjustment::ARAH as $jenis => $arah) {
            $tanda = $arah < 0 ? '-' : '';
            $cases .= " WHEN " . DB::getPdo()->quote($jenis) . " THEN {$tanda}nominal";
        }

        return "CASE jenis{$cases} ELSE 0 END";
    }
}
