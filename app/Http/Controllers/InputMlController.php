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
 * Kelompok & hari = filter halaman. Tanggal bayar = hari tagih terakhir (hari ini / sudah
 * lewat, lompat libur), belum dikunci kasir.
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

    /** Hari tagih terakhir (hari ini / sudah lewat, lompat libur), kalau belum dikunci. */
    private function tanggalBayar(TransactionLoan $loan): ?string
    {
        $tgl = AppHelper::getStortingShowDate($loan->hari);

        return AppHelper::tanggalTerkunci($loan->transaction_loan_officer_grouping_id, $tgl) ? null : $tgl;
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
            // Batas bawah pilihan tanggal angsuran (Buku Angsuran Beku, superuser).
            'mulai' => AgregasiScope::tanggalMulai($branchId)->toDateString(),
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

        return back()->with('message', "Input ML {$hasil['nama']} dihapus, saldo kembali ke SISA MACET BLM TERINPUT.");
    }

    /** Tombol Hapus di Pinjaman Macet: seluruh sisa saldo nasabah pindah ke SISA MACET BLM TERINPUT. */
    public function hapusNasabah(TransactionLoan $loan)
    {
        abort_unless(self::bolehHapusNasabah(), 403, 'Hanya KM ke atas dan kasir.');
        abort_unless(AgregasiScope::sudahMigrasi((int) AuthScope::getActiveBranchId()), 422, 'Hanya untuk kantor yang sudah migrasi.');
        abort_unless((int) $loan->loan_officer_grouping?->branch_id === (int) AuthScope::getActiveBranchId(), 404);
        abort_unless(AppHelper::bolehAksesKelompok($loan->loan_officer_grouping), 403, AppHelper::PESAN_BUKAN_WILAYAH);
        if ($loan->customer?->nik === MigrasiController::NIK_MACET_LAMA) {
            return back()->withErrors('Nasabah ini penampung saldonya sendiri.');
        }

        $saldo = (int) PenyesuaianSaldo::hitungSaldo($loan)['saldo'];
        if ($saldo <= 0) {
            return back()->withErrors('Saldo nasabah ini sudah 0.');
        }
        try {
            PenyesuaianSaldo::operKeMacetLama($loan, $saldo, 'hapus dari Pinjaman Macet', auth()->user());
        } catch (\RuntimeException $e) {
            return back()->withErrors($e->getMessage());
        }

        return back()->with('message', 'Saldo Rp ' . number_format($saldo, 0, ',', '.') . ' pindah ke ' . MigrasiController::NAMA_MACET_LAMA . '.');
    }

    /** can-approve (KM ke atas) atau kasir; mantri tidak. */
    public static function bolehHapusNasabah(): bool
    {
        $user = auth()->user();

        return $user->hasRole(['superuser', 'kasir']) || $user->hasPermissionTo('can-approve');
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
            'tanggal_bayar' => ['nullable', 'date', 'before_or_equal:today', new \App\Rules\HariKerja('Tanggal angsuran')],
        ], [
            'tanggal_bayar.before_or_equal' => 'Tanggal angsuran tidak boleh di masa depan.',
            'tanggal_drop.before' => 'Nasabah ML harus drop sebelum 1 Juni 2026.',
            'nik.not_in' => 'NIK itu milik SISA MACET BLM TERINPUT.',
        ]);

        $hasil = DB::transaction(function () use ($v, $branchId) {
            $loan = $this->pinjamanMacetLama($branchId)->firstWhere('id', (int) $v['loan_id']);
            if ($loan && !AppHelper::bolehAksesKelompok($loan->loan_officer_grouping)) {
                throw ValidationException::withMessages(['loan_id' => AppHelper::PESAN_BUKAN_WILAYAH]);
            }
            if (!$loan) {
                throw ValidationException::withMessages(['loan_id' => 'SISA MACET BLM TERINPUT tidak ditemukan di kantor ini.']);
            }
            TransactionLoan::whereKey($loan->id)->lockForUpdate()->first();
            // Superuser boleh memilih tanggal (mas 2026-11-07: macet Oktober terlewat input ->
            // selisih). Hari terkunci dibuka otomatis oleh Gembok saat angsuran ditulis; tanggal
            // sebelum migrasi tetap ditolak (beku). Peran lain: hari tagih terakhir.
            if (!empty($v['tanggal_bayar']) && auth()->user()->hasRole('superuser')) {
                $tanggal = Carbon::parse($v['tanggal_bayar'])->toDateString();
                if (Carbon::parse($tanggal)->dayOfWeek !== AppHelper::getNumbDays($loan->hari)) {
                    throw ValidationException::withMessages(['tanggal_bayar' => "Tanggal angsuran harus hari {$loan->hari}."]);
                }
                if ($tanggal < AgregasiScope::tanggalMulai($branchId)->toDateString() || AppHelper::tanggalTerkunci($loan->transaction_loan_officer_grouping_id, $tanggal)) {
                    throw ValidationException::withMessages(['tanggal_bayar' => 'Tanggal sebelum migrasi kantor sudah beku.']);
                }
            } else {
                $tanggal = $this->tanggalBayar($loan);
            }
            if (!$tanggal) {
                throw ValidationException::withMessages(['loan_id' => "Hari tagih {$loan->hari} terakhir sudah dikunci kasir."]);
            }
            $sisa = (int) PenyesuaianSaldo::hitungSaldo($loan)['saldo'];
            if ($v['nominal'] > $sisa) {
                throw ValidationException::withMessages(['nominal' => 'Melebihi sisa saldo SISA MACET BLM TERINPUT (Rp ' . number_format(max(0, $sisa), 0, ',', '.') . ').']);
            }

            try {
                return PecahanMacetLama::simpan($loan, $v, $tanggal, auth()->user());
            } catch (\RuntimeException $e) {
                throw ValidationException::withMessages(['nominal' => $e->getMessage()]);
            }
        });

        return back()->with('message', "Setoran ML {$hasil['nama']} dicatat (NIK {$hasil['nik']}), saldo SISA MACET BLM TERINPUT berkurang.");
    }
}
