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

    /** Pinjaman kantor aktif yang cocok dengan pencarian (nama / NIK / no. anggota). */
    private function cari(int $branchId, string $q, ?Carbon $mulai)
    {
        $ids = TransactionLoanOfficerGrouping::where('branch_id', $branchId)->pluck('id');

        return TransactionLoan::with(['customer', 'manage_customer', 'loan_officer_grouping'])
            ->whereIn('transaction_loan_officer_grouping_id', $ids)
            ->where('status', 'success')
            ->when($mulai, fn($w) => $w->where('drop_date', '<', $mulai->toDateString()))
            ->where(fn($w) => $w
                ->whereHas('customer', fn($c) => $c->where('nama', 'like', "%{$q}%")->orWhere('nik', 'like', "%{$q}%"))
                ->orWhereHas('manage_customer', fn($m) => $m->where('nomor_anggota', $q)))
            ->orderByDesc('drop_date')
            ->limit(30)
            ->get()
            ->map(fn($l) => [
                'id' => $l->id,
                'nama' => $l->customer?->nama,
                'nik' => $l->customer?->nik,
                'nomor_anggota' => $l->manage_customer?->nomor_anggota,
                'kelompok' => $l->loan_officer_grouping?->kelompok,
                'hari' => $l->hari,
                'drop_date' => Carbon::parse($l->drop_date)->toDateString(),
                'pinjaman' => (int) $l->pinjaman,
                'ember' => $mulai ? Ember::dari($l->drop_date, $mulai) : null,
            ]);
    }

    public function index(Request $request)
    {
        $this->wajibSuperuser();
        $branchId = AuthScope::resolve()->branch_id;
        $mulai = AgregasiScope::tanggalMulai($branchId);
        $q = trim((string) $request->input('q', ''));

        $pinjaman = null;
        if ($mulai && $request->filled('loan')) {
            $l = TransactionLoan::with(['customer', 'manage_customer', 'loan_officer_grouping'])->findOrFail($request->integer('loan'));
            abort_unless((int) $l->loan_officer_grouping?->branch_id === (int) $branchId, 403, 'Pinjaman ini milik kantor lain.');

            $pinjaman = [
                'id' => $l->id,
                'nama' => $l->customer?->nama,
                'nik' => $l->customer?->nik,
                'nomor_anggota' => $l->manage_customer?->nomor_anggota,
                'kelompok' => $l->loan_officer_grouping?->kelompok,
                'hari' => $l->hari,
                'drop_date' => Carbon::parse($l->drop_date)->toDateString(),
                'pinjaman' => (int) $l->pinjaman,
                'ember' => Ember::dari($l->drop_date, $mulai),
                // Saldo per hari terakhir sebelum migrasi (patokan saldo awal).
                'saldo_awal' => PenyesuaianSaldo::hitungSaldo($l, $mulai->copy()->subDay())['saldo'],
                'angsuran' => $l->loan_instalment()
                    ->where('transaction_date', '<', $mulai->toDateString())
                    ->orderBy('transaction_date')
                    ->get()
                    ->map(fn($a) => [
                        'id' => $a->id,
                        'tanggal' => Carbon::parse($a->transaction_date)->toDateString(),
                        'nominal' => (int) $a->nominal,
                        'katrol' => (bool) $a->danatitipan,
                        'transfer' => (bool) $a->is_transfer,
                        'topup' => (bool) $a->settled_by_loan_id,
                    ]),
            ];
        }

        return Inertia::render('Migrasi/KoreksiBeku', [
            'kantor' => [
                'unit' => Branch::whereKey($branchId)->value('unit'),
                'mulai' => $mulai?->toDateString(),
                'jumlah_koreksi' => TransactionKoreksiBeku::where('branch_id', $branchId)->count(),
            ],
            'q' => $q,
            'hasil' => $mulai && mb_strlen($q) >= 3 ? $this->cari($branchId, $q, $mulai) : [],
            'pinjaman' => $pinjaman,
        ]);
    }

    /** Pinjaman tujuan untuk aksi "pindah" (JSON). */
    public function cariTujuan(Request $request)
    {
        $this->wajibSuperuser();
        $branchId = AuthScope::resolve()->branch_id;
        $q = trim((string) $request->input('q', ''));

        return response()->json(mb_strlen($q) >= 3 ? $this->cari($branchId, $q, null) : []);
    }

    private function aturan(Request $request): array
    {
        return $request->validate([
            'aksi' => ['required', 'in:' . implode(',', KoreksiBeku::AKSI)],
            'angsuran_id' => ['nullable', 'integer'],
            'loan_id' => ['nullable', 'integer'],
            'loan_tujuan_id' => ['nullable', 'integer'],
            'tanggal' => ['nullable', 'date'],
            'nominal' => ['nullable', 'integer', 'min:0'],
            'alasan' => ['required', 'string', 'min:10', 'max:1000'],
        ], [
            'alasan.required' => 'Alasan wajib diisi.',
            'alasan.min' => 'Alasan minimal 10 huruf.',
        ]);
    }

    /** Pratinjau dampak: koreksi dijalankan lalu dibatalkan (JSON). */
    public function pratinjau(Request $request)
    {
        $this->wajibSuperuser();
        $v = $this->aturan($request);

        try {
            return response()->json(KoreksiBeku::jalankan($v['aksi'], $v, $v['alasan'], false));
        } catch (\RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function simpan(Request $request)
    {
        $this->wajibSuperuser();
        $v = $this->aturan($request);

        try {
            KoreksiBeku::jalankan($v['aksi'], $v, $v['alasan'], true);
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
