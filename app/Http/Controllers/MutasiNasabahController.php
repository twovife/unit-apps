<?php

namespace App\Http\Controllers;

use App\Helpers\AuthScope;
use App\Helpers\Mutasi;
use App\Helpers\PenyesuaianSaldo;
use App\Models\Branch;
use App\Models\TransactionLoan;
use App\Models\TransactionLoanMutation;
use App\Models\TransactionLoanOfficerGrouping;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

/**
 * Mutasi nasabah — memindah pinjaman antar (kelompok, hari) di kantor yang sama.
 * Superuser saja.
 *
 * Alurnya borongan, bukan satu-satu: pilih (hari, kelompok) asal → daftar
 * nasabah belum lunas → centang → pindah ke (kelompok, hari) tujuan. Rancangan
 * memperingatkan satu-satu terlalu lambat untuk satu superuser di 157 kantor,
 * dan orang akan kembali ke jalan lama.
 *
 * Yang direkam ARUS (App\Helpers\Mutasi): kolom kelompok/hari di
 * transaction_loans tak ditimpa, keanggotaan efektif dibaca `basis − keluar +
 * masuk`. Berlaku paling cepat bulan depan (tanggal 1).
 *
 * Lihat .agents/agregasi_rekap.md §7b.
 */
class MutasiNasabahController extends Controller
{
    private const HARI = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];

    private function pastikanSuperuser(): void
    {
        if (!auth()->user()->hasRole('superuser')) {
            abort(403, 'Mutasi nasabah hanya untuk superuser.');
        }
    }

    public function index(Request $request)
    {
        $this->pastikanSuperuser();

        $scope = AuthScope::resolve();
        $bulanDepan = Carbon::now()->addMonthNoOverflow()->startOfMonth();

        $kelompok = TransactionLoanOfficerGrouping::where('branch_id', $scope->branch_id)
            ->orderBy('kelompok')->get(['id', 'kelompok'])
            ->map(fn($g) => ['id' => $g->id, 'kelompok' => $g->kelompok]);

        $riwayat = TransactionLoanMutation::with('dari', 'ke', 'penginput')
            ->whereIn('ke_grouping_id', $kelompok->pluck('id'))
            ->orderByDesc('id')->limit(50)->get()
            ->map(fn($m) => [
                'id' => $m->id,
                'loan_id' => $m->transaction_loan_id,
                'dari' => ($m->dari->kelompok ?? $m->dari_grouping_id) . ' / ' . ($m->dari_hari ?? '—'),
                'ke' => ($m->ke->kelompok ?? $m->ke_grouping_id) . ' / ' . ($m->ke_hari ?? $m->dari_hari ?? '—'),
                'berlaku_bulan' => $m->berlaku_bulan?->format('Y-m'),
                'berlaku_sampai' => $m->berlaku_sampai?->format('Y-m'),
                'alasan' => $m->alasan,
                'penginput' => $m->penginput->nama_karyawan ?? null,
            ]);

        return Inertia::render('Admin/MutasiNasabah', [
            'kelompok' => $kelompok,
            'hari_opsi' => self::HARI,
            'riwayat' => $riwayat,
            'server_filter' => [
                'unit' => Branch::whereKey($scope->branch_id)->value('unit'),
                'bulan_depan' => $bulanDepan->format('Y-m-d'),
            ],
        ]);
    }

    /** Daftar nasabah belum lunas di (hari, kelompok) asal, per bulan berlaku. */
    public function cari(Request $request)
    {
        $this->pastikanSuperuser();

        $val = $request->validate([
            'grouping_id' => ['required', 'integer'],
            'hari' => ['required', 'string'],
            'berlaku_bulan' => ['required', 'date'],
        ]);

        $scope = AuthScope::resolve();
        $ref = Carbon::parse($val['berlaku_bulan'])->startOfMonth()->toDateString();
        $hari = strtolower($val['hari']);

        $branchIds = TransactionLoanOfficerGrouping::where('branch_id', $scope->branch_id)->pluck('id');

        // Kandidat: pinjaman di kantor ini yang secara EFEKTIF (pada bulan
        // berlaku) berada di (kelompok, hari) yang dipilih. Pakai ekspresi
        // efektif yang sama dengan portofolio, jadi pinjaman yang sudah pernah
        // dimutasi ikut benar.
        $gEff = Mutasi::ekspresiEfektifSql('transaction_loans', $ref);
        $hEff = Mutasi::ekspresiHariEfektifSql('transaction_loans', $ref);

        $loans = TransactionLoan::with('customer', 'loan_officer_grouping')
            ->whereIn('transaction_loan_officer_grouping_id', $branchIds)
            ->where('status', 'success')
            ->whereNotNull('hari')
            ->whereRaw("$gEff = ?", [$val['grouping_id']])
            ->whereRaw("LOWER($hEff) = ?", [$hari])
            ->orderByDesc('drop_date')
            ->get();

        // Hanya yang BELUM LUNAS (saldo > 0) yang perlu dipindah.
        $out = [];
        foreach ($loans as $l) {
            $saldo = PenyesuaianSaldo::hitungSaldo($l)['saldo'];
            if ($saldo <= 0) {
                continue;
            }
            $out[] = [
                'loan_id' => $l->id,
                'nama' => $l->customer->nama ?? '—',
                'nik' => $l->customer->nik ?? null,
                'drop_date' => Carbon::parse($l->drop_date)->toDateString(),
                'saldo' => $saldo,
            ];
        }

        return response()->json(['loans' => $out]);
    }

    /** Pindahkan pinjaman terpilih (borongan) ke (kelompok, hari) tujuan. */
    public function simpan(Request $request)
    {
        $this->pastikanSuperuser();

        $val = $request->validate([
            'loan_ids' => ['required', 'array', 'min:1'],
            'loan_ids.*' => ['integer'],
            'ke_grouping_id' => ['required', 'integer'],
            'ke_hari' => ['required', 'string'],
            'berlaku_bulan' => ['required', 'date'],
            'alasan' => ['nullable', 'string', 'max:255'],
        ]);

        $loans = TransactionLoan::whereIn('id', $val['loan_ids'])->get();

        $berhasil = 0;
        $gagal = [];

        // Satu transaksi: borongan sukses semua atau tidak sama sekali, supaya
        // tidak ada mutasi separuh jalan kalau satu baris bermasalah.
        try {
            DB::transaction(function () use ($loans, $val, &$berhasil, &$gagal) {
                foreach ($loans as $loan) {
                    try {
                        Mutasi::catat(
                            $loan,
                            (int) $val['ke_grouping_id'],
                            $val['ke_hari'],
                            $val['berlaku_bulan'],
                            $val['alasan'] ?? null,
                            auth()->user()
                        );
                        $berhasil++;
                    } catch (\Throwable $e) {
                        $gagal[] = "#{$loan->id}: {$e->getMessage()}";
                        throw $e; // batalkan seluruh borongan
                    }
                }
            });
        } catch (\Throwable $e) {
            return back()->withErrors('Mutasi dibatalkan — ' . implode('; ', $gagal ?: [$e->getMessage()]));
        }

        return back()->with('message', "$berhasil pinjaman dipindahkan.");
    }
}
