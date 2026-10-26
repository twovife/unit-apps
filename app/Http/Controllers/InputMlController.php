<?php

namespace App\Http\Controllers;

use App\Helpers\AgregasiScope;
use App\Helpers\AppHelper;
use App\Helpers\AuthScope;
use App\Helpers\PecahanMacetLama;
use App\Helpers\PenyesuaianSaldo;
use App\Models\TransactionLoan;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

/**
 * Input ML untuk kantor migrasi (mas 2026-10-26): pengganti Input Macet. Setoran nasabah
 * macet lama dipecah dari MACET LAMA kelompok x hari (penampung Z) menjadi pinjaman atas
 * nama nasabah itu dan langsung diangsur lunas - App\Helpers\PecahanMacetLama.
 *
 * Kelompok & hari = filter halaman. Tanggal bayar = tanggal hari tagih itu MINGGU INI
 * (sudah lewat / hari ini), hari kerja, belum dikunci kasir.
 */
class InputMlController extends Controller
{

    private function pastikanBoleh(): int
    {
        // Semua peran ber-can-create, termasuk mantri & KM (mas 2026-10-26); mantri dibatasi
        // ke kelompoknya sendiri lewat bolehAksesKelompok di simpan / hapus.
        abort_unless(auth()->user()->hasPermissionTo('can-create'), 403, 'Anda tidak mempunyai akses menambahkan.');
        $branchId = (int) AuthScope::getActiveBranchId();
        abort_unless(AgregasiScope::sudahMigrasi($branchId), 422, 'Input ML hanya untuk kantor yang sudah migrasi.');

        return $branchId;
    }

    /** Tanggal hari tagih ini di minggu ini, kalau sudah lewat / hari ini, hari kerja & belum dikunci. */
    private function tanggalBayar(TransactionLoan $loan): ?string
    {
        $hariKe = ['senin' => 0, 'selasa' => 1, 'rabu' => 2, 'kamis' => 3, 'jumat' => 4, 'sabtu' => 5][$loan->hari] ?? null;
        if ($hariKe === null) {
            return null;
        }
        $tgl = Carbon::now()->startOfWeek(Carbon::MONDAY)->addDays($hariKe);
        if ($tgl->gt(Carbon::today()) || !\App\Models\WorkDay::hariKerja($tgl)
            || AppHelper::tanggalTerkunci($loan->transaction_loan_officer_grouping_id, $tgl->toDateString())) {
            return null;
        }

        return $tgl->toDateString();
    }

    private function pinjamanMacetLama(int $branchId)
    {
        return TransactionLoan::query()
            ->with('loan_officer_grouping:id,kelompok,branch_id')
            ->whereHas('loan_officer_grouping', fn($g) => $g->where('branch_id', $branchId))
            ->whereHas('manage_customer.customers', fn($c) => $c->where('nik', MigrasiController::NIK_MACET_LAMA))
            ->where('status', 'success')
            ->get();
    }

    /** Isi dialog (JSON): MACET LAMA kantor aktif + sisa + tanggal bayar + riwayat. */
    public function index(Request $request)
    {
        $branchId = $this->pastikanBoleh();
        $loans = $this->pinjamanMacetLama($branchId);
        $saldo = PenyesuaianSaldo::saldoBanyak($loans->pluck('id')->all());
        // Riwayat hanya MACET LAMA kelompok x hari yang sedang dibuka (filter halaman).
        $ini = $loans->first(fn($l) => (string) $l->loan_officer_grouping?->kelompok === (string) $request->query('kelompok')
            && $l->hari === $request->query('hari'));
        $tanggalIni = $ini ? $this->tanggalBayar($ini) : null;

        return response()->json([
            'batas_drop' => PecahanMacetLama::BATAS_DROP,
            'macet_lama' => $loans->map(fn($l) => [
                'id' => $l->id,
                'kelompok' => $l->loan_officer_grouping?->kelompok,
                'hari' => $l->hari,
                'sisa' => max(0, (int) ($saldo[$l->id]['saldo'] ?? 0)),
                'tanggal_bayar' => $this->tanggalBayar($l),
            ])->sortBy([['kelompok', 'asc'], ['hari', 'asc']])->values(),
            // Pecahan terbaru: notes "PECAHAN MACET LAMA #<id MACET LAMA>".
            // Setoran di tanggal angsuran ini; kalau belum ada, 5 input terakhir (mas 2026-10-26).
            'riwayat' => !$ini ? [] : TransactionLoan::with(['manage_customer.customers:id,nama,nik', 'loan_instalment:id,transaction_loan_id,transaction_date,nominal'])
                ->where('notes', PecahanMacetLama::CATATAN . ' #' . $ini->id)
                ->when(
                    $tanggalIni && TransactionLoan::where('notes', PecahanMacetLama::CATATAN . ' #' . $ini->id)
                        ->whereHas('loan_instalment', fn($q) => $q->where('transaction_date', $tanggalIni))->exists(),
                    fn($q) => $q->whereHas('loan_instalment', fn($i) => $i->where('transaction_date', $tanggalIni)),
                    fn($q) => $q->limit(5),
                )
                ->orderByDesc('id')->get()
                ->map(fn($l) => [
                    'id' => $l->id,
                    'loan_id' => (int) substr(strrchr($l->notes, '#'), 1),
                    'nama' => $l->manage_customer?->customers?->nama,
                    'nik' => $l->manage_customer?->customers?->nik,
                    'drop' => Carbon::parse($l->drop_date)->toDateString(),
                    'tanggal' => ($t = $l->loan_instalment->max('transaction_date')) ? Carbon::parse($t)->toDateString() : null,
                    'nominal' => (int) $l->loan_instalment->sum('nominal'),
                    // Hapus (salah input): selama tanggal angsurannya belum dikunci kasir.
                    'boleh_hapus' => $l->loan_instalment->every(fn($a) => !AppHelper::tanggalTerkunci(
                        $l->transaction_loan_officer_grouping_id, Carbon::parse($a->transaction_date)->toDateString())),
                ]),
        ]);
    }

    /** Batalkan satu Input ML (salah input): saldo kembali ke MACET LAMA. */
    public function hapus(TransactionLoan $loan)
    {
        $branchId = $this->pastikanBoleh();
        abort_unless((int) $loan->loan_officer_grouping?->branch_id === $branchId, 404);
        abort_unless(AppHelper::bolehAksesKelompok($loan->loan_officer_grouping), 403, AppHelper::PESAN_BUKAN_WILAYAH);
        try {
            $hasil = PecahanMacetLama::hapus($loan, auth()->user());
        } catch (\RuntimeException $e) {
            return back()->withErrors(['nominal' => $e->getMessage()]);
        }

        return back()->with('message', "Input ML {$hasil['nama']} dihapus, saldo kembali ke MACET LAMA.");
    }

    public function simpan(Request $request)
    {
        $branchId = $this->pastikanBoleh();
        $v = $request->validate([
            'loan_id' => ['required', 'integer'],
            'nama' => ['required', 'string', 'max:150'],
            // Wajib: NIK asli, atau "UB" -> NIK UB dibuatkan (sama dengan Input Macet lama).
            'nik' => ['required', 'string', 'max:20', 'not_in:' . MigrasiController::NIK_MACET_LAMA],
            'tanggal_drop' => ['required', 'date', 'before:' . PecahanMacetLama::BATAS_DROP],
            'nominal' => ['required', 'integer', 'min:1'],
            'katrol' => ['boolean'],
        ], [
            'tanggal_drop.before' => 'Nasabah ML harus drop sebelum 1 Juni 2026.',
            'nik.not_in' => 'NIK itu milik MACET LAMA.',
        ]);

        $hasil = DB::transaction(function () use ($v, $branchId) {
            $loan = $this->pinjamanMacetLama($branchId)->firstWhere('id', (int) $v['loan_id']);
            if ($loan && !AppHelper::bolehAksesKelompok($loan->loan_officer_grouping)) {
                throw ValidationException::withMessages(['loan_id' => AppHelper::PESAN_BUKAN_WILAYAH]);
            }
            if (!$loan) {
                throw ValidationException::withMessages(['loan_id' => 'MACET LAMA tidak ditemukan di kantor ini.']);
            }
            TransactionLoan::whereKey($loan->id)->lockForUpdate()->first();
            $tanggal = $this->tanggalBayar($loan);
            if (!$tanggal) {
                throw ValidationException::withMessages(['loan_id' => "Hari {$loan->hari} minggu ini belum tiba, libur, atau sudah dikunci kasir."]);
            }
            $sisa = (int) PenyesuaianSaldo::hitungSaldo($loan)['saldo'];
            if ($v['nominal'] > $sisa) {
                throw ValidationException::withMessages(['nominal' => 'Melebihi sisa saldo MACET LAMA (Rp ' . number_format(max(0, $sisa), 0, ',', '.') . ').']);
            }

            try {
                return PecahanMacetLama::simpan($loan, $v, $tanggal, auth()->user());
            } catch (\RuntimeException $e) {
                throw ValidationException::withMessages(['nominal' => $e->getMessage()]);
            }
        });

        return back()->with('message', "Setoran ML {$hasil['nama']} dicatat (NIK {$hasil['nik']}), saldo MACET LAMA berkurang.");
    }
}
