<?php

namespace App\Http\Controllers;

use App\Helpers\AgregasiScope;
use App\Helpers\AuthScope;
use App\Helpers\Ember;
use App\Helpers\KoreksiBeku;
use App\Helpers\PenyesuaianSaldo;
use App\Models\Branch;
use App\Models\TransactionKoreksiBeku;
use App\Models\TransactionLoan;
use App\Models\TransactionLoanOfficerGrouping;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * Menu Koreksi Pasca Migrasi (superuser): koreksi angsuran bertanggal sebelum
 * migrasi kantor + log koreksinya. Logika & pengamannya di App\Helpers\KoreksiBeku.
 */
class KoreksiBekuController extends Controller
{
    private function wajibSuperuser(): void
    {
        abort_unless(auth()->user()?->hasRole('superuser'), 403, 'Koreksi data beku khusus superuser.');
    }

    /**
     * Buku angsuran beku, seperti buku angsuran: kelompok x hari x BULAN DROP.
     * Baris = pinjaman yang di-drop di bulan itu; kolom = tanggal tagih dari
     * bulan drop s/d akhir BULAN MIGRASI (+ tanggal lain yang ternyata berisi
     * angsuran). Kolom sebelum migrasi bisa dikoreksi; bulan migrasi hanya
     * tampil (ubah lewat menu biasa). Bulan sendiri (?bulan), tidak ikut global.
     */
    public function index(Request $request)
    {
        $this->wajibSuperuser();
        $scope = AuthScope::resolve();
        $branchId = $scope->branch_id;
        $mulai = AgregasiScope::tanggalMulai($branchId);
        $hari = \App\Helpers\AppHelper::hariTagih($request->input('hari'));

        $kantor = [
            'unit' => Branch::whereKey($branchId)->value('unit'),
            'mulai' => $mulai?->toDateString(),
            'jumlah_koreksi' => TransactionKoreksiBeku::where('branch_id', $branchId)->count(),
        ];
        $kelompokAda = TransactionLoanOfficerGrouping::where('branch_id', $branchId)->orderBy('kelompok')->pluck('kelompok');

        if (!$mulai) {
            return Inertia::render('Migrasi/KoreksiBeku', ['kantor' => $kantor, 'filter' => null, 'kolom' => [], 'nasabah' => []]);
        }

        // Bulan drop: bawaan sebulan sebelum migrasi; tidak boleh >= bulan migrasi.
        $bulan = preg_match('/^\d{4}-\d{2}$/', (string) $request->input('bulan'))
            ? Carbon::parse($request->input('bulan') . '-01')
            : $mulai->copy()->subMonthNoOverflow()->startOfMonth();
        if ($bulan->gte($mulai->copy()->startOfMonth())) {
            $bulan = $mulai->copy()->subMonthNoOverflow()->startOfMonth();
        }
        $akhir = $mulai->copy()->subDay();
        $akhirTampil = $mulai->copy()->endOfMonth();

        $grouping = TransactionLoanOfficerGrouping::where('branch_id', $branchId)->where('kelompok', $scope->kelompok)->first();
        $loans = $grouping
            ? TransactionLoan::with(['customer', 'manage_customer', 'loan_instalment' => fn($q) => $q->where('transaction_date', '<=', $akhirTampil->toDateString())])
                ->where('transaction_loan_officer_grouping_id', $grouping->id)
                ->where('hari', $hari)
                ->where('status', 'success')
                ->whereBetween('drop_date', [$bulan->toDateString(), $bulan->copy()->endOfMonth()->toDateString()])
                ->orderBy('drop_date')
                ->get()
            : collect();

        $saldo = PenyesuaianSaldo::saldoBanyak($loans->pluck('id')->all(), $akhir);

        // Kolom: semua tanggal hari tagih itu dari awal bulan drop s/d sebelum migrasi,
        // ditambah tanggal lain yang berisi angsuran (supaya tidak ada yang tersembunyi).
        $tanggal = collect();
        for ($d = $bulan->copy(); $d->lte($akhirTampil); $d->addDay()) {
            if (\App\Helpers\AppHelper::dateName($d) === $hari) {
                $tanggal->push($d->toDateString());
            }
        }
        $tanggal = $tanggal
            ->merge($loans->flatMap(fn($l) => $l->loan_instalment->map(fn($a) => Carbon::parse($a->transaction_date)->toDateString())))
            ->unique()->sort()->values();

        return Inertia::render('Migrasi/KoreksiBeku', [
            'kantor' => $kantor,
            'filter' => [
                'kelompok' => $scope->kelompok,
                'kelompok_ada' => $kelompokAda,
                'hari' => $hari,
                'bulan' => $bulan->format('Y-m'),
                // Pilihan bulan drop: 12 bulan sebelum migrasi.
                'bulan_ada' => collect(range(1, 12))->map(fn($i) => $mulai->copy()->startOfMonth()->subMonthsNoOverflow($i)->format('Y-m'))->values(),
            ],
            'kolom' => $tanggal,
            'nasabah' => $loans->map(fn($l) => [
                'id' => $l->id,
                'nama' => $l->customer?->nama,
                'nik' => $l->customer?->nik,
                'nomor_anggota' => $l->manage_customer?->nomor_anggota,
                'kelompok' => $scope->kelompok,
                'hari' => $l->hari,
                'drop_date' => Carbon::parse($l->drop_date)->toDateString(),
                'pinjaman' => (int) $l->pinjaman,
                'ember' => Ember::dari($l->drop_date, $mulai),
                'saldo_awal' => $saldo[$l->id]['saldo'] ?? 0,
                'angsuran' => $l->loan_instalment
                    ->groupBy(fn($a) => Carbon::parse($a->transaction_date)->toDateString())
                    ->map(fn($g) => $g->map(fn($a) => [
                        'id' => $a->id,
                        'tanggal' => Carbon::parse($a->transaction_date)->toDateString(),
                        'nominal' => (int) $a->nominal,
                        'katrol' => (bool) $a->danatitipan,
                        'transfer' => (bool) $a->is_transfer,
                        'topup' => (bool) $a->settled_by_loan_id,
                    ])->values()),
            ])->values(),
        ]);
    }

    private function aturan(Request $request): array
    {
        return $request->validate([
            'aksi' => ['required', 'in:' . implode(',', KoreksiBeku::AKSI)],
            'angsuran_id' => ['nullable', 'integer'],
            'loan_id' => ['nullable', 'integer'],
            'tanggal' => ['nullable', 'date'],
            'nominal' => ['nullable', 'integer', 'min:0'],
            'alasan' => ['nullable', 'string', 'max:1000'],
        ]);
    }

    /** Pratinjau dampak: koreksi dijalankan lalu dibatalkan (JSON). */
    public function pratinjau(Request $request)
    {
        $this->wajibSuperuser();
        $v = $this->aturan($request);

        try {
            return response()->json(KoreksiBeku::jalankan($v['aksi'], $v, $v['alasan'] ?? '', false));
        } catch (\RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function simpan(Request $request)
    {
        $this->wajibSuperuser();
        $v = $this->aturan($request);

        try {
            KoreksiBeku::jalankan($v['aksi'], $v, $v['alasan'] ?? '', true);
        } catch (\RuntimeException $e) {
            return back()->withErrors($e->getMessage());
        }

        return back()->with('message', 'Koreksi tersimpan, saldo bulanan sudah dihitung ulang.');
    }

    public function log(Request $request)
    {
        $this->wajibSuperuser();
        $branchId = $request->boolean('semua') ? null : AuthScope::resolve()->branch_id;

        $log = TransactionKoreksiBeku::with(['user', 'branch'])
            ->when($branchId, fn($w) => $w->where('branch_id', $branchId))
            ->latest()
            ->paginate(25)
            ->withQueryString()
            ->through(fn($r) => [
                'id' => $r->id,
                'waktu' => $r->created_at->toDateTimeString(),
                'oleh' => $r->user?->username,
                'kantor' => $r->branch?->unit,
                'aksi' => $r->aksi,
                'sebelum' => $r->sebelum,
                'sesudah' => $r->sesudah,
                'dampak' => $r->dampak,
                'alasan' => $r->alasan,
            ]);

        return Inertia::render('Migrasi/LogKoreksiBeku', [
            'log' => $log,
            'semua' => $request->boolean('semua'),
            'unit' => $branchId ? Branch::whereKey($branchId)->value('unit') : null,
        ]);
    }
}
