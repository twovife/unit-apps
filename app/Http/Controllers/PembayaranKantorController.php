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
 * dan setoran Goro Umrah. Semua tabel milik app_laravel (DB bersama); aturan
 * input disalin dari app_laravel IuranGabunganController / GoroUmrohController
 * (masa tenggang, kunci bulanan contribution_locks, bukti wajib, rekening).
 * BON Panjer sengaja tidak tampil (privasi). Pinjaman Modal: baca-saja per
 * sumber dana.
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

    /** Foto bukti transfer (tb / bop / umrah) kantor yang boleh diakses. */
    public function bukti(string $modul, int $id)
    {
        abort_unless(auth()->user()->hasPermissionTo('view-all-groups'), 403);
        $tabel = ['tb' => 'tb_contributions', 'bop' => 'ops_bop_contributions', 'umrah' => 'goro_umroh_setoran'][$modul] ?? abort(404);
        $baris = DB::table($tabel)->find($id) ?? abort(404);
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

    /** Pinjaman modal kantor per sumber dana (tb_capital_loans), baca-saja. */
    private function modal(int $branchId, string $sumber, string $awal, string $akhir): array
    {
        $bayar = DB::table('tb_capital_loan_payments')->where('payment_date', '<=', $akhir)
            ->groupBy('tb_capital_loan_id')->selectRaw('tb_capital_loan_id, SUM(amount_principal) pokok');
        $pinjaman = DB::table('tb_capital_loans as l')
            ->leftJoinSub($bayar, 'p', 'p.tb_capital_loan_id', '=', 'l.id')
            ->where('l.branch_id', $branchId)->where('l.source', $sumber)->where('l.loan_date', '<=', $akhir)
            ->get(['l.amount', DB::raw('COALESCE(p.pokok, 0) as pokok')]);
        $aktif = $pinjaman->filter(fn($l) => (int) $l->amount > (int) $l->pokok);
        $bulanIni = DB::table('tb_capital_loan_payments as p')
            ->join('tb_capital_loans as l', 'l.id', '=', 'p.tb_capital_loan_id')
            ->where('l.branch_id', $branchId)->where('l.source', $sumber)->whereBetween('p.payment_date', [$awal, $akhir])
            ->selectRaw('COALESCE(SUM(p.amount_principal),0) pokok, COALESCE(SUM(p.amount_jasa_modal),0) jasa, MAX(p.payment_date) terakhir')
            ->first();

        return [
            'jumlah_aktif' => $aktif->count(),
            'sisa' => (int) $aktif->sum(fn($l) => (int) $l->amount - (int) $l->pokok),
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
