<?php

namespace App\Http\Controllers;

use App\Helpers\AgregasiScope;
use App\Helpers\AuthScope;
use App\Models\TransactionLoan;
use App\Models\TransactionLoanInstalment;
use App\Models\TransactionSirculation;
use App\Traits\PinjamanTrait;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * Perbaikan Angsuran (mas 2026-11-10): buku angsuran lebar untuk kantor yang
 * BELUM migrasi. Tiap bulan yang dibuka = getLoan bulan itu apa adanya (ember,
 * sirkulasi, Buku Storting sama dengan /pinjaman bulan itu); sel tanggal diisi
 * langsung lewat jalur angsuran biasa. Izin: maintenance-worker (superuser punya).
 */
class PerbaikanAngsuranController extends Controller
{
    use PinjamanTrait;

    private const MAKS_MUNDUR = 24;

    public function index(Request $request)
    {
        $kantor = AuthScope::resolve()->branch_id;
        $migrasi = $kantor && AgregasiScope::sudahMigrasi($kantor);

        // ML = hanya yang ada angsuran / MD bulan itu (sama dengan /pinjaman).
        $utama = $this->getLoan($request);
        $akhir = Carbon::parse($utama['server_filter']['month'] . '-01');
        // Tanpa ?mundur: buka sejak tutup buku terakhir (sirkulasi awal terbaru s/d bulan
        // terpilih), supaya tutup buku bisa diulang berurutan dari satu layar (mas 2026-11-10).
        $mundur = $request->has('mundur')
            ? (int) $request->query('mundur')
            : $this->sejakTutupBuku($utama['server_filter']['groupId'], $utama['server_filter']['hari'], $akhir);
        $mundur = min(self::MAKS_MUNDUR, max(0, $mundur));
        $bulan = [];
        if (!$migrasi) {
            // Paling lama di depan: blok tabel & Buku Storting urut dari kiri / atas.
            for ($i = $mundur; $i >= 1; $i--) {
                // Permintaan baru tanpa `date`: FilterGlobal menyisipkan date (hari tagih bulan
                // terpilih) dan getLoan mengutamakan date di atas month (bug prod 2026-11-10).
                $r = Request::create($request->url(), 'GET', array_filter([
                    'month' => $akhir->copy()->subMonthsNoOverflow($i)->format('Y-m'),
                    'hari' => $utama['server_filter']['hari'],
                    'kelompok' => $request->input('kelompok'),
                ]));
                $r->setUserResolver($request->getUserResolver());
                $d = $this->getLoan($r);
                $bulan[] = ['month' => $d['server_filter']['month'], 'datas' => $d['datas'], 'dateOfWeek' => $d['dateOfWeek'], 'sirkulasi' => $d['sirkulasi']];
            }
        }
        $bulan[] = ['month' => $utama['server_filter']['month'], 'datas' => $utama['datas'], 'dateOfWeek' => $utama['dateOfWeek'], 'sirkulasi' => $utama['sirkulasi']];

        return Inertia::render('PerbaikanAngsuran/Index', [
            'server_filter' => $utama['server_filter'],
            'bulan' => $bulan,
            'mundur' => $mundur,
            'maks_mundur' => self::MAKS_MUNDUR,
            'sudah_migrasi' => $migrasi,
        ]);
    }

    /** Jumlah bulan dari sirkulasi awal tersimpan terakhir (<= bulan terpilih) ke bulan terpilih. */
    private function sejakTutupBuku($groupId, $hari, Carbon $bulan): int
    {
        $terakhir = TransactionSirculation::where('transaction_loan_officer_grouping_id', $groupId)
            ->where('day', $hari)->where('date', '<=', $bulan->toDateString())->max('date');

        return $terakhir ? (int) Carbon::parse($terakhir)->startOfMonth()->diffInMonths($bulan) : 0;
    }

    /** Satu sel tanggal: kosong = bayar, 0 = hapus, angka lain = ubah nominal (jalur angsuran biasa). */
    public function sel(Request $request)
    {
        $v = $request->validate([
            'loan_id' => ['required', 'integer'],
            'tanggal' => ['required', 'date', 'before_or_equal:today'],
            'nominal' => ['required', 'integer', 'min:0'],
        ]);
        $loan = TransactionLoan::with('loan_officer_grouping')->findOrFail($v['loan_id']);
        $branchId = (int) $loan->loan_officer_grouping?->branch_id;
        abort_unless($branchId === (int) AuthScope::resolve()->branch_id, 403, 'Pinjaman ini bukan kantor yang sedang dipilih.');
        if (AgregasiScope::sudahMigrasi($branchId)) {
            return back()->withErrors('Kantor ini sudah migrasi - perbaiki lewat Buku Angsuran Beku.');
        }
        if (Carbon::parse($v['tanggal'])->lt(Carbon::parse($loan->drop_date)->startOfDay())) {
            return back()->withErrors('Tanggal angsuran sebelum tanggal drop.');
        }

        $isi = TransactionLoanInstalment::where('transaction_loan_id', $loan->id)->whereDate('transaction_date', $v['tanggal'])->get();
        $nominal = (int) $v['nominal'];
        if ($isi->count() > 1 || $isi->contains(fn($a) => $a->settled_by_loan_id)) {
            return back()->withErrors('Sel ' . Carbon::parse($v['tanggal'])->format('d-m-Y') . ' berisi lebih dari satu angsuran / pelunasan topup - perbaiki lewat tombol Pay.');
        }
        if (($isi->isEmpty() && $nominal === 0) || ($isi->count() === 1 && (int) $isi->first()->nominal === $nominal)) {
            return back();
        }

        return app(KoreksiBekuController::class)->selBiasa($request, $loan, $isi->first(), $v['tanggal'], $nominal);
    }
}
