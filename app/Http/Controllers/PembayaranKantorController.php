<?php

namespace App\Http\Controllers;

use App\Helpers\AuthScope;
use App\Models\Branch;
use App\Support\Unggahan;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

/**
 * Dashboard Kasir (mas 2026-10-15): ringkasan pembayaran kantor aktif per
 * bulan + tugas kasir hari ini + input iuran (Tabungan 1 Juta / BOP, gabungan)
 * dan setoran Goro Umrah, angsuran pinjaman modal. Semua tabel milik app_laravel (DB bersama); aturan
 * input disalin dari app_laravel IuranGabunganController / GoroUmrohController
 * (masa tenggang, kunci bulanan contribution_locks, bukti wajib, rekening).
 * BON Panjer sengaja tidak tampil (privasi). Pinjaman Modal per sumber dana.
 */
class PembayaranKantorController extends Controller
{
    private const TARGET_TABUNGAN = 1000000;
    private const TARGET_BOP = 1500000;
    private const SUMBER_MODAL = ['pusat' => 'Pinjaman Modal Pusat', 'tawan' => 'Pinjaman Modal Hertawan', 'sherly' => 'Pinjaman Modal Sherly'];

    /** Halaman Dashboard Kasir; angkanya dimuat lewat ringkasan() (JSON). */
    public function halaman()
    {
        abort_unless(auth()->user()->hasPermissionTo('view-all-groups'), 403, 'Dashboard kasir untuk kepala mantri, kasir, dan pimpinan.');

        return \Inertia\Inertia::render('Kasir/Dashboard/Index');
    }

    public function ringkasan(Request $request)
    {
        abort_unless(auth()->user()->hasPermissionTo('view-all-groups'), 403);
        $branch = $this->kantor();
        $bulan = $this->bulan($request->input('bulan'));
        $awal = $bulan->copy()->startOfMonth()->toDateString();
        $akhir = $bulan->copy()->endOfMonth()->toDateString();
        $periode = $bulan->format('Y-m');

        return response()->json([
            'unit' => $branch->unit,
            'bulan' => $periode,
            'boleh_bayar' => $this->bolehBayar($branch->id),
            'rekening' => DB::table('rekening_tujuan')->whereNull('deleted_at')->orderBy('nomor')->get(['id', 'nomor', 'atas_nama', 'keterangan']),
            'tugas' => $this->tugas($branch->id),
            'kartu' => [
                'tabungan' => $this->iuran('tb_contributions', 'tb', $branch, $bulan, self::TARGET_TABUNGAN, $this->tenggangTb($branch, $periode)),
                'bop' => $this->iuran('ops_bop_contributions', 'bop', $branch, $bulan, self::TARGET_BOP, $this->tenggangBop($branch)),
                'modal' => collect(self::SUMBER_MODAL)->map(fn($judul, $sumber) => ['sumber' => $sumber, 'judul' => $judul] + $this->modal($branch->id, $sumber, $awal, $akhir))->values(),
                'sksw' => $this->sksw($branch->id, $awal, $akhir),
                'umrah' => $this->umrah($branch->id, $awal, $akhir, $periode),
            ],
        ]);
    }

    /** Bayar iuran Tabungan 1 Juta dan/atau BOP sekali input (satu bukti), = app_laravel IuranGabungan. */
    public function bayarIuran(Request $request)
    {
        $branch = $this->kantor();
        abort_unless($this->bolehBayar($branch->id), 403, 'Input pembayaran untuk kasir, staf kontrol, pusat, dan superuser.');

        $data = $request->validate([
            'period' => ['required', 'date_format:Y-m'],
            'payment_date' => ['required', 'date', 'before_or_equal:today'],
            'rekening_id' => ['required', 'exists:rekening_tujuan,id,deleted_at,NULL'],
            'bukti' => array_merge(['required'], Unggahan::ATURAN),
            'notes' => ['nullable', 'string', 'max:255'],
            'tb' => ['boolean'],
            'tb_amount' => ['required_if_accepted:tb', 'nullable', 'integer', 'min:1'],
            'bop' => ['boolean'],
            'bop_amount' => ['required_if_accepted:bop', 'nullable', 'integer', 'min:1'],
        ], [
            'rekening_id.required' => 'Pilih rekening tujuan.',
            'payment_date.before_or_equal' => 'Tanggal bayar tidak boleh di masa depan.',
        ] + Unggahan::pesan('bukti'));

        $tb = $request->boolean('tb');
        $bop = $request->boolean('bop');
        if (!$tb && !$bop) {
            throw ValidationException::withMessages(['tb' => 'Centang minimal satu: Tabungan 1 Juta atau BOP.']);
        }
        if ($tb) {
            if ($this->tenggangTb($branch, $data['period'])) {
                throw ValidationException::withMessages(['tb' => 'Kantor ini masih masa tenggang, belum wajib iuran 1 Juta.']);
            }
            $this->pastikanTerbuka('tb', $branch->id, $data['period']);
        }
        if ($bop) {
            if (!$branch->isactive || $this->tenggangBop($branch)) {
                throw ValidationException::withMessages(['bop' => 'Kantor ini belum wajib iuran BOP.']);
            }
            $this->pastikanTerbuka('bop', $branch->id, $data['period']);
        }

        $bukti = Unggahan::simpan($request->file('bukti'), 'iuran-bukti', 'bukti');
        $baris = [
            'branch_id' => $branch->id,
            'period' => $data['period'],
            'payment_date' => $data['payment_date'],
            'notes' => $data['notes'] ?? null,
            'rekening_id' => (int) $data['rekening_id'],
            'bukti_path' => $bukti,
            'created_by' => auth()->id(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
        DB::transaction(function () use ($tb, $bop, $baris, $data) {
            if ($tb) {
                DB::table('tb_contributions')->insert($baris + ['amount' => (int) $data['tb_amount']]);
            }
            if ($bop) {
                DB::table('ops_bop_contributions')->insert($baris + ['amount' => (int) $data['bop_amount']]);
            }
        });

        return back()->with('message', 'Pembayaran iuran dicatat.');
    }

    /** Setoran Tabungan Goro Umrah, = app_laravel GoroUmrohController::storeSetoran. */
    public function setorUmrah(Request $request)
    {
        $branch = $this->kantor();
        abort_unless($this->bolehBayar($branch->id), 403, 'Input pembayaran untuk kasir, staf kontrol, pusat, dan superuser.');

        $data = $request->validate([
            'tanggal' => ['required', 'date', 'before_or_equal:today'],
            'amount' => ['required', 'integer', 'min:1'],
            'notes' => ['nullable', 'string', 'max:255'],
            'bukti' => array_merge(['required'], Unggahan::ATURAN),
        ], ['tanggal.before_or_equal' => 'Tanggal setor tidak boleh di masa depan.'] + Unggahan::pesan('bukti'));

        $this->pastikanTerbuka('goro', $branch->id, substr((string) $data['tanggal'], 0, 7));
        $file = $request->file('bukti');
        $path = Unggahan::simpan($file, 'goro-umroh/setoran', 'bukti');

        DB::table('goro_umroh_setoran')->insert([
            'branch_id' => $branch->id,
            'tanggal' => $data['tanggal'],
            'amount' => (int) $data['amount'],
            'notes' => $data['notes'] ?? null,
            'bukti_path' => $path,
            'bukti_name' => $file->getClientOriginalName(),
            'created_by' => auth()->id(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return back()->with('message', 'Setoran tabungan goro umrah dicatat.');
    }

    /**
     * Angsuran pinjaman modal satu sumber, = app_laravel
     * TabunganController::storeCapitalLoanPayment: tawan/sherly satu nominal;
     * jasa modal 2% dari sisa pokok TIAP pinjaman yang sudah masuk bulan ke-5
     * (lihat jasaPinjaman), dibagi FIFO ke pinjaman tertua dan dibatasi
     * nominal; sisa nominal jadi pokok, FIFO juga. Pusat: jasa diisi manual,
     * dicatat di pinjaman tertua. Lunas -> status paid. Sumber pusat hanya bendahara (kasirpusat).
     * Kunci bulanan modal berlaku untuk semua kantor (branch_id null).
     */
    public function bayarModal(Request $request)
    {
        $branch = $this->kantor();
        $data = $request->validate([
            'source' => ['required', 'in:' . implode(',', array_keys(self::SUMBER_MODAL))],
            'nominal' => ['required', 'integer', 'min:1'],
            'jasa' => ['nullable', 'integer', 'min:0'],
            'payment_date' => ['required', 'date', 'before_or_equal:today'],
            'notes' => ['nullable', 'string', 'max:255'],
            'bukti' => array_merge(['required'], Unggahan::ATURAN),
        ], ['payment_date.before_or_equal' => 'Tanggal bayar tidak boleh di masa depan.'] + Unggahan::pesan('bukti'));
        abort_unless($this->bolehBayarModal($branch->id, $data['source']), 403,
            $data['source'] === 'pusat' ? 'Pinjaman modal sumber Pusat hanya dicatat Bendahara.' : 'Input pembayaran untuk kasir, staf kontrol, pusat, dan superuser.');

        $periode = substr((string) $data['payment_date'], 0, 7);
        if (DB::table('contribution_locks')->where('module', 'modal')->whereNull('branch_id')->where('period', $periode)->exists()) {
            throw ValidationException::withMessages(['nominal' => "Pinjaman modal bulan {$periode} sudah dikunci kasir pusat."]);
        }

        $pinjaman = DB::table('tb_capital_loans')->where('branch_id', $branch->id)->where('source', $data['source'])
            ->where('status', 'active')->orderBy('loan_date')->orderBy('id')->get(['id', 'amount', 'loan_date']);
        $dibayar = DB::table('tb_capital_loan_payments')->whereIn('tb_capital_loan_id', $pinjaman->pluck('id'))
            ->groupBy('tb_capital_loan_id')->selectRaw('tb_capital_loan_id, SUM(amount_principal) pokok')->pluck('pokok', 'tb_capital_loan_id');
        $sisa = fn($l) => (int) $l->amount - (int) ($dibayar[$l->id] ?? 0);
        $totalSisa = (int) $pinjaman->sum($sisa);
        if ($pinjaman->isEmpty() || $totalSisa <= 0) {
            throw ValidationException::withMessages(['nominal' => 'Tidak ada pinjaman modal aktif untuk sumber ini.']);
        }

        $jasaPer = []; // id pinjaman => jasa modal
        if ($data['source'] === 'pusat') {
            // Pusat: pokok & jasa diisi terpisah (nominal = pokok).
            $pokok = (int) $data['nominal'];
            if ((int) ($data['jasa'] ?? 0) > 0) {
                $jasaPer[$pinjaman->first()->id] = (int) $data['jasa'];
            }
        } else {
            $pokok = (int) $data['nominal'];
            foreach ($pinjaman as $l) {
                $j = min(self::jasaPinjaman($l->loan_date, $sisa($l), $data['payment_date']), $pokok);
                if ($j > 0) {
                    $jasaPer[$l->id] = $j;
                    $pokok -= $j;
                }
            }
        }
        if ($pokok > $totalSisa) {
            throw ValidationException::withMessages(['nominal' => 'Angsuran pokok melebihi total sisa hutang (Rp ' . number_format($totalSisa, 0, ',', '.') . ').']);
        }

        // Diunggah sesudah semua validasi lolos supaya tidak ada file yatim.
        $bukti = Unggahan::simpan($request->file('bukti'), 'modal-bukti', 'bukti');

        DB::transaction(function () use ($pinjaman, $sisa, $pokok, $jasaPer, $data, $bukti) {
            foreach ($pinjaman as $l) {
                $sisaIni = $sisa($l);
                if ($sisaIni <= 0) {
                    DB::table('tb_capital_loans')->where('id', $l->id)->update(['status' => 'paid', 'updated_at' => now()]);
                    continue;
                }
                $bayarPokok = min($pokok, $sisaIni);
                $jasa = $jasaPer[$l->id] ?? 0;
                if ($bayarPokok <= 0 && $jasa <= 0) {
                    continue;
                }
                DB::table('tb_capital_loan_payments')->insert([
                    'tb_capital_loan_id' => $l->id,
                    'amount_principal' => $bayarPokok,
                    'amount_jasa_modal' => $jasa,
                    'payment_date' => $data['payment_date'],
                    'notes' => $data['notes'] ?? null,
                    'created_by' => auth()->id(),
                    'bukti_path' => $bukti,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
                $pokok -= $bayarPokok;
                if ($sisaIni - $bayarPokok <= 0) {
                    DB::table('tb_capital_loans')->where('id', $l->id)->update(['status' => 'paid', 'updated_at' => now()]);
                }
            }
        });

        return back()->with('message', 'Pembayaran pinjaman modal dicatat (dialokasikan ke pinjaman tertua).');
    }

    /** Halaman detail Tabungan Goro Umrah kantor aktif: rekap per bulan setahun + semua setoran. */
    public function detailUmrah(Request $request)
    {
        abort_unless(auth()->user()->hasPermissionTo('view-all-groups'), 403);
        $branch = $this->kantor();
        $tahun = preg_match('/^\d{4}$/', (string) $request->input('tahun')) ? (int) $request->input('tahun') : (int) now()->year;

        $setoran = DB::table('goro_umroh_setoran as s')
            ->leftJoin('users as u', 'u.id', '=', 's.created_by')
            ->leftJoin('employees as e', 'e.id', '=', 'u.employee_id')
            ->where('s.branch_id', $branch->id)->whereYear('s.tanggal', $tahun)
            ->orderByDesc('s.tanggal')->orderByDesc('s.id')
            ->get(['s.id', 's.tanggal', 's.amount', 's.notes', 's.bukti_path', DB::raw('COALESCE(e.nama_karyawan, u.username) as oleh')]);

        return \Inertia\Inertia::render('Kasir/Dashboard/GoroUmrah', [
            'unit' => $branch->unit,
            'tahun' => $tahun,
            'tahun_ada' => DB::table('goro_umroh_setoran')->where('branch_id', $branch->id)->selectRaw('DISTINCT YEAR(tanggal) t')->orderByDesc('t')->pluck('t'),
            'total' => (int) DB::table('goro_umroh_setoran')->where('branch_id', $branch->id)->sum('amount'),
            'per_bulan' => collect(range(1, 12))->map(fn($b) => [
                'bulan' => sprintf('%d-%02d', $tahun, $b),
                'jumlah' => (int) $setoran->filter(fn($x) => (int) Carbon::parse($x->tanggal)->month === $b)->sum('amount'),
                'kali' => $setoran->filter(fn($x) => (int) Carbon::parse($x->tanggal)->month === $b)->count(),
            ]),
            'setoran' => $setoran->map(fn($x) => [
                'id' => $x->id,
                'tanggal' => Carbon::parse($x->tanggal)->toDateString(),
                'nominal' => (int) $x->amount,
                'catatan' => $x->notes,
                'oleh' => $x->oleh,
                'bukti' => $x->bukti_path ? route('dashboard.kasir.bukti', ['umrah', $x->id]) : null,
            ]),
        ]);
    }

    /** Halaman detail Pinjaman Modal kantor aktif per sumber: daftar pinjaman + riwayat angsuran. */
    public function detailModal(Request $request)
    {
        abort_unless(auth()->user()->hasPermissionTo('view-all-groups'), 403);
        $branch = $this->kantor();
        $sumber = array_key_exists((string) $request->input('sumber'), self::SUMBER_MODAL) ? (string) $request->input('sumber') : 'pusat';

        $pinjaman = DB::table('tb_capital_loans')->where('branch_id', $branch->id)->where('source', $sumber)
            ->orderByDesc('loan_date')->orderByDesc('id')->get(['id', 'amount', 'loan_date', 'status', 'notes']);
        $bayar = DB::table('tb_capital_loan_payments as p')
            ->leftJoin('users as u', 'u.id', '=', 'p.created_by')
            ->leftJoin('employees as e', 'e.id', '=', 'u.employee_id')
            ->whereIn('p.tb_capital_loan_id', $pinjaman->pluck('id'))
            ->orderByDesc('p.payment_date')->orderByDesc('p.id')
            ->get(['p.id', 'p.tb_capital_loan_id', 'p.amount_principal', 'p.amount_jasa_modal', 'p.payment_date', 'p.notes', 'p.bukti_path', DB::raw('COALESCE(e.nama_karyawan, u.username) as oleh')]);
        $pokokPer = $bayar->groupBy('tb_capital_loan_id')->map(fn($g) => (int) $g->sum('amount_principal'));

        $daftar = $pinjaman->map(fn($l) => [
            'id' => $l->id,
            'tanggal' => Carbon::parse($l->loan_date)->toDateString(),
            'jumlah' => (int) $l->amount,
            'dibayar' => $pokokPer[$l->id] ?? 0,
            'sisa' => max(0, (int) $l->amount - ($pokokPer[$l->id] ?? 0)),
            'status' => $l->status,
            'catatan' => $l->notes,
        ]);

        return \Inertia\Inertia::render('Kasir/Dashboard/PinjamanModal', [
            'unit' => $branch->unit,
            'sumber' => $sumber,
            'sumber_ada' => collect(self::SUMBER_MODAL)->map(fn($judul, $k) => ['kunci' => $k, 'judul' => $judul])->values(),
            'ringkas' => [
                'total_pinjaman' => (int) $daftar->sum('jumlah'),
                'total_pokok' => (int) $bayar->sum('amount_principal'),
                'total_jasa' => (int) $bayar->sum('amount_jasa_modal'),
                'sisa' => (int) $daftar->sum('sisa'),
            ],
            'pinjaman' => $daftar,
            'angsuran' => $bayar->map(fn($p) => [
                'id' => $p->id,
                'pinjaman_id' => $p->tb_capital_loan_id,
                'tanggal' => Carbon::parse($p->payment_date)->toDateString(),
                'pokok' => (int) $p->amount_principal,
                'jasa' => (int) $p->amount_jasa_modal,
                'catatan' => $p->notes,
                'oleh' => $p->oleh,
                'bukti' => $p->bukti_path ? route('dashboard.kasir.bukti', ['modal', $p->id]) : null,
            ]),
        ]);
    }

    /** Foto bukti transfer (tb / bop / umrah / modal) kantor yang boleh diakses. */
    public function bukti(string $modul, int $id)
    {
        abort_unless(auth()->user()->hasPermissionTo('view-all-groups'), 403);
        $tabel = ['tb' => 'tb_contributions', 'bop' => 'ops_bop_contributions', 'umrah' => 'goro_umroh_setoran', 'modal' => 'tb_capital_loan_payments'][$modul] ?? abort(404);
        $baris = DB::table($tabel)->find($id) ?? abort(404);
        if ($modul === 'modal') {
            $baris->branch_id = DB::table('tb_capital_loans')->where('id', $baris->tb_capital_loan_id)->value('branch_id');
        }
        $boleh = Branch::getAllowedBranchIds(auth()->user());
        abort_unless($boleh === null || in_array((int) $baris->branch_id, $boleh), 403, 'Anda tidak memiliki akses ke kantor ini.');

        $disk = Storage::disk(Unggahan::DISK);
        abort_unless($baris->bukti_path && $disk->exists($baris->bukti_path), 404, 'File bukti tidak ditemukan.');

        return response($disk->get($baris->bukti_path), 200, [
            'Content-Type' => $disk->mimeType($baris->bukti_path) ?: 'application/octet-stream',
            'Content-Disposition' => 'inline; filename="' . addslashes(basename($baris->bukti_path)) . '"',
            'Cache-Control' => 'private, max-age=86400',
        ]);
    }

    // ------------------------------------------------------------------

    private function kantor(): Branch
    {
        $branchId = (int) AuthScope::resolve()->branch_id;
        $boleh = Branch::getAllowedBranchIds(auth()->user());
        abort_unless($boleh === null || in_array($branchId, $boleh), 403, 'Cabang ini bukan cabang Anda.');

        return Branch::findOrFail($branchId);
    }

    private function bulan($nilai): Carbon
    {
        return preg_match('/^\d{4}-\d{2}$/', (string) $nilai) ? Carbon::parse($nilai . '-01') : Carbon::now()->startOfMonth();
    }

    /** Input pembayaran: kasir, staf kontrol, pusat, superuser (mas 2026-10-15), untuk kantor yang boleh diakses. */
    private function bolehBayar(int $branchId): bool
    {
        $user = auth()->user();
        if (!$user->hasAnyRole(['kasir', 'stafkontrol', 'pusat', 'superuser'])) {
            return false;
        }
        $boleh = Branch::getAllowedBranchIds($user);

        return $boleh === null || in_array($branchId, $boleh);
    }

    /** Pinjaman modal: tawan/sherly ikut bolehBayar; pusat hanya bendahara (kasirpusat), = app_laravel. */
    private function bolehBayarModal(int $branchId, string $sumber): bool
    {
        if ($sumber === 'pusat') {
            return (bool) auth()->user()->can('kasirpusat') && $this->bolehBayar($branchId);
        }

        return $this->bolehBayar($branchId);
    }

    private function terkunci(string $modul, int $branchId, string $periode): bool
    {
        return DB::table('contribution_locks')->where('module', $modul)->where('branch_id', $branchId)->where('period', $periode)->exists();
    }

    /** = app_laravel ContributionLock::pastikanTerbuka. */
    private function pastikanTerbuka(string $modul, int $branchId, string $periode): void
    {
        if ($this->terkunci($modul, $branchId, $periode)) {
            throw ValidationException::withMessages(['bukti' => "Bulan {$periode} untuk kantor ini sudah dikunci. Minta kasir pusat membuka kuncinya."]);
        }
    }

    /** = app_laravel IuranGabunganController::masaTenggangTb. */
    private function tenggangTb(Branch $branch, string $periode): bool
    {
        $buka = $branch->opening_date ? Carbon::parse($branch->opening_date) : Carbon::parse('2026-01-01');
        $bulan = Carbon::parse($periode . '-01');

        return $bulan->lt($buka) || $buka->diffInMonths($bulan) < 3;
    }

    /** = app_laravel IuranGabunganController::masaTenggangBop. */
    private function tenggangBop(Branch $branch): bool
    {
        return $branch->opening_date && Carbon::parse($branch->opening_date)->diffInMonths(Carbon::now()) < 3;
    }

    /** Tugas kasir hari ini: kunci/TTD Rekap 1, ACC KM, iuran bulan ini. */
    private function tugas(int $branchId): array
    {
        $hariIni = Carbon::today();
        $ids = DB::table('transaction_loan_officer_groupings')->where('branch_id', $branchId)->pluck('id');
        $migrasi = \App\Helpers\AgregasiScope::pakaiAgregatBaru($branchId, $hariIni);
        $harian = $migrasi
            ? DB::table('transaction_daily_closings')->whereIn('transaction_loan_officer_grouping_id', $ids)->whereDate('date', $hariIni)
                ->selectRaw('SUM(kepala_approval_at IS NOT NULL) km, SUM(kasir_lock_at IS NOT NULL) kasir')->first()
            : DB::table('transaction_daily_recaps')->whereIn('transaction_loan_officer_grouping_id', $ids)->whereDate('date', $hariIni)
                ->selectRaw('SUM(daily_kepala_approval IS NOT NULL) km, SUM(daily_kasir_approval IS NOT NULL) kasir')->first();
        $periode = $hariIni->format('Y-m');

        return [
            'tanggal' => $hariIni->toDateString(),
            'hari_kerja' => \App\Models\WorkDay::hariKerja($hariIni),
            'kelompok' => $ids->count(),
            'acc_km' => (int) ($harian->km ?? 0),
            'kunci' => (int) ($harian->kasir ?? 0),
            'migrasi' => $migrasi,
            'iuran_tb' => (int) DB::table('tb_contributions')->where('branch_id', $branchId)->where('period', $periode)->sum('amount'),
            'iuran_bop' => (int) DB::table('ops_bop_contributions')->where('branch_id', $branchId)->where('period', $periode)->sum('amount'),
            'target_tb' => self::TARGET_TABUNGAN,
            'target_bop' => self::TARGET_BOP,
        ];
    }

    /** Iuran bulanan ber-target (Tabungan 1 Juta / BOP). */
    private function iuran(string $tabel, string $modul, Branch $branch, Carbon $bulan, int $target, bool $tenggang): array
    {
        $periode = $bulan->format('Y-m');
        $baris = DB::table($tabel)->where('branch_id', $branch->id)->where('period', $periode);
        $dibayar = (int) (clone $baris)->sum('amount');

        $status = 'belum';
        if ($tenggang && $dibayar === 0) {
            $status = 'tenggang';
        } elseif ($dibayar >= $target) {
            $status = 'lunas';
        } elseif ($dibayar > 0) {
            $status = 'kurang';
        }

        return [
            'target' => $target,
            'dibayar' => $dibayar,
            'kurang' => max(0, $target - $dibayar),
            'status' => $status,
            'tenggang' => $tenggang,
            'terkunci' => $this->terkunci($modul, $branch->id, $periode),
            'terakhir' => ($t = (clone $baris)->max('payment_date')) ? Carbon::parse($t)->toDateString() : null,
            'akumulasi' => (int) DB::table($tabel)->where('branch_id', $branch->id)->where('period', '<=', $periode)->sum('amount'),
            'riwayat' => (clone $baris)->orderByDesc('payment_date')->orderByDesc('id')->limit(3)
                ->get(['id', 'amount', 'payment_date', 'bukti_path'])
                ->map(fn($r) => [
                    'id' => $r->id,
                    'nominal' => (int) $r->amount,
                    'tanggal' => Carbon::parse($r->payment_date)->toDateString(),
                    'bukti' => $r->bukti_path ? route('dashboard.kasir.bukti', [$modul, $r->id]) : null,
                ]),
        ];
    }

    /**
     * Jasa modal satu pinjaman tawan/sherly = app_laravel TbCapitalLoan::anjuranJasaModal:
     * 2% dari sisa pokok pinjaman itu, mulai bulan kalender ke-5 (bulan cair = bulan
     * ke-1, jadi selisih bulan kalender >= 4; bukan hitungan 30 hari).
     */
    private static function jasaPinjaman($tanggalPinjam, int $sisa, $tanggalBayar): int
    {
        $cair = Carbon::parse($tanggalPinjam);
        $bayar = Carbon::parse($tanggalBayar);
        $selisih = ($bayar->year * 12 + $bayar->month) - ($cair->year * 12 + $cair->month);

        return $selisih >= 4 ? (int) round($sisa * 0.02) : 0;
    }

    /** Pinjaman modal kantor per sumber dana (tb_capital_loans), baca-saja. */
    private function modal(int $branchId, string $sumber, string $awal, string $akhir): array
    {
        $bayar = DB::table('tb_capital_loan_payments')->where('payment_date', '<=', $akhir)
            ->groupBy('tb_capital_loan_id')->selectRaw('tb_capital_loan_id, SUM(amount_principal) pokok');
        $pinjaman = DB::table('tb_capital_loans as l')
            ->leftJoinSub($bayar, 'p', 'p.tb_capital_loan_id', '=', 'l.id')
            ->where('l.branch_id', $branchId)->where('l.source', $sumber)->where('l.loan_date', '<=', $akhir)
            ->orderBy('l.loan_date')->orderBy('l.id')
            ->get(['l.amount', 'l.loan_date', DB::raw('COALESCE(p.pokok, 0) as pokok')]);
        $aktif = $pinjaman->filter(fn($l) => (int) $l->amount > (int) $l->pokok);
        $bulanIni = DB::table('tb_capital_loan_payments as p')
            ->join('tb_capital_loans as l', 'l.id', '=', 'p.tb_capital_loan_id')
            ->where('l.branch_id', $branchId)->where('l.source', $sumber)->whereBetween('p.payment_date', [$awal, $akhir])
            ->selectRaw('COALESCE(SUM(p.amount_principal),0) pokok, COALESCE(SUM(p.amount_jasa_modal),0) jasa, MAX(p.payment_date) terakhir')
            ->first();

        $sisa = (int) $aktif->sum(fn($l) => (int) $l->amount - (int) $l->pokok);

        return [
            'jumlah_aktif' => $aktif->count(),
            'sisa' => $sisa,
            // Pinjaman aktif tertua dulu: dialog bayar menghitung jasa per pinjaman
            // menurut tanggal bayar (server menghitung ulang saat simpan).
            'pinjaman' => $aktif->values()->map(fn($l) => [
                'tanggal' => Carbon::parse($l->loan_date)->toDateString(),
                'sisa' => (int) $l->amount - (int) $l->pokok,
            ]),
            'boleh_bayar' => $this->bolehBayarModal($branchId, $sumber),
            'terkunci_modal' => DB::table('contribution_locks')->where('module', 'modal')->whereNull('branch_id')->where('period', substr($awal, 0, 7))->exists(),
            'riwayat' => DB::table('tb_capital_loan_payments as p')
                ->join('tb_capital_loans as l', 'l.id', '=', 'p.tb_capital_loan_id')
                ->where('l.branch_id', $branchId)->where('l.source', $sumber)->whereBetween('p.payment_date', [$awal, $akhir])
                ->orderByDesc('p.payment_date')->orderByDesc('p.id')->limit(3)
                ->get(['p.id', 'p.amount_principal', 'p.amount_jasa_modal', 'p.payment_date', 'p.bukti_path'])
                ->map(fn($r) => [
                    'id' => $r->id,
                    'nominal' => (int) $r->amount_principal + (int) $r->amount_jasa_modal,
                    'tanggal' => Carbon::parse($r->payment_date)->toDateString(),
                    'bukti' => $r->bukti_path ? route('dashboard.kasir.bukti', ['modal', $r->id]) : null,
                ]),
            'pokok_bulan_ini' => (int) $bulanIni->pokok,
            'jasa_bulan_ini' => (int) $bulanIni->jasa,
            'sudah_bayar' => (int) $bulanIni->pokok + (int) $bulanIni->jasa > 0,
            'terakhir' => $bulanIni->terakhir ? Carbon::parse($bulanIni->terakhir)->toDateString() : null,
        ];
    }

    /** SKSW: saldo SW / SK kantor per akhir bulan + mutasi bulan itu (void dikecualikan). */
    private function sksw(int $branchId, string $awal, string $akhir): array
    {
        $rows = DB::table('saving_transactions')
            ->where('branch_id', $branchId)->whereNull('voided_at')->where('transaction_date', '<=', $akhir)
            ->groupBy('jenis')
            ->selectRaw('jenis, SUM(debit - kredit) saldo,
                SUM(CASE WHEN transaction_date >= ? THEN debit ELSE 0 END) masuk,
                SUM(CASE WHEN transaction_date >= ? THEN kredit ELSE 0 END) keluar', [$awal, $awal])
            ->get()->keyBy('jenis');
        $ambil = fn($jenis, $k) => (int) ($rows[$jenis]->$k ?? 0);

        return [
            'saldo_sw' => $ambil('SW', 'saldo'),
            'saldo_sk' => $ambil('SK', 'saldo'),
            'masuk' => $ambil('SW', 'masuk') + $ambil('SK', 'masuk'),
            'keluar' => $ambil('SW', 'keluar') + $ambil('SK', 'keluar'),
        ];
    }

    /** Tabungan Goro Umrah (goro_umroh_setoran). */
    private function umrah(int $branchId, string $awal, string $akhir, string $periode): array
    {
        $bulanIni = DB::table('goro_umroh_setoran')->where('branch_id', $branchId)->whereBetween('tanggal', [$awal, $akhir]);

        return [
            'setoran_bulan_ini' => (int) (clone $bulanIni)->sum('amount'),
            'kali_bulan_ini' => (clone $bulanIni)->count(),
            'terkunci' => $this->terkunci('goro', $branchId, $periode),
            'total' => (int) DB::table('goro_umroh_setoran')->where('branch_id', $branchId)->where('tanggal', '<=', $akhir)->sum('amount'),
            'riwayat' => (clone $bulanIni)->orderByDesc('tanggal')->orderByDesc('id')->limit(3)
                ->get(['id', 'amount', 'tanggal', 'bukti_path'])
                ->map(fn($r) => [
                    'id' => $r->id,
                    'nominal' => (int) $r->amount,
                    'tanggal' => Carbon::parse($r->tanggal)->toDateString(),
                    'bukti' => $r->bukti_path ? route('dashboard.kasir.bukti', ['umrah', $r->id]) : null,
                ]),
        ];
    }
}
