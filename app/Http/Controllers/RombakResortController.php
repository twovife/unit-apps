<?php

namespace App\Http\Controllers;

use App\Helpers\AuthScope;
use App\Helpers\RombakResort;
use App\Models\TransactionResortRombak;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

/**
 * Menu Rombak Resort (superuser): penyusun peta resort asal -> resort tujuan
 * per kantor, disimpan sebagai draf; pratinjau dihitung server (RombakResort).
 * Terapkan & batal: RombakResort::terapkan / batal.
 * Rancangan: .agents/rombak_resort.md §5–§6.
 */
class RombakResortController extends Controller
{
    private function pastikanSuperuser(): void
    {
        abort_unless(auth()->user()->hasRole('superuser'), 403, 'Rombak resort hanya untuk superuser.');
    }

    /** Kantor yang sudah migrasi (K16). */
    private function kantor()
    {
        return DB::table('branches')->whereNotNull('mulai_pendataan_baru')->orderBy('unit')->get(['id', 'unit']);
    }

    private function idKelompok(int $branchId): array
    {
        return DB::table('transaction_loan_officer_groupings')->where('branch_id', $branchId)->pluck('id')->all();
    }

    public function index(Request $request)
    {
        $this->pastikanSuperuser();
        $request->validate(['bulan' => ['nullable', 'date_format:Y-m'], 'rombak' => ['nullable', 'integer']]);

        $kantor = $this->kantor();
        $ids = $kantor->pluck('id');
        $branchId = (int) $request->input('branch_id');
        if (!$ids->contains($branchId)) {
            $aktif = (int) AuthScope::getActiveBranchId();
            $branchId = $ids->contains($aktif) ? $aktif : (int) $ids->first();
        }

        $draf = $request->filled('rombak')
            ? TransactionResortRombak::with('peta')->where('branch_id', $branchId)->find($request->input('rombak'))
            : null;

        // Bulan berlaku: pilihan di layar, lalu bulan draf yang dibuka, lalu bulan berjalan.
        $bulan = ($request->filled('bulan')
            ? Carbon::parse($request->input('bulan') . '-01')
            : ($draf ? $draf->berlaku_bulan->copy() : Carbon::now()))->startOfMonth();

        $kelompok = DB::table('transaction_loan_officer_groupings')->where('branch_id', $branchId)
            ->orderBy('kelompok')->get(['id', 'kelompok']);
        $blok = RombakResort::blok($branchId, $bulan);

        return Inertia::render('Admin/RombakResort', [
            'kantor' => $kantor,
            'branch_id' => $branchId,
            'bulan' => $bulan->format('Y-m'),
            'kelompok' => $kelompok,
            'blok' => $blok,
            'rombak' => TransactionResortRombak::where('branch_id', $branchId)->withCount('peta')
                ->orderByDesc('updated_at')->orderByDesc('id')->get()
                ->map(fn($r) => [
                    'id' => $r->id,
                    'berlaku_bulan' => $r->berlaku_bulan->toDateString(),
                    'status' => $r->status,
                    'catatan' => $r->catatan,
                    'updated_at' => $r->updated_at?->toDateTimeString(),
                    'jumlah_pindah' => $r->peta_count,
                ]),
            'draf' => $draf ? [
                'id' => $draf->id,
                'berlaku_bulan' => $draf->berlaku_bulan->toDateString(),
                'catatan' => $draf->catatan,
                'status' => $draf->status,
                'peta' => $draf->peta->map->only(['dari_grouping_id', 'dari_hari', 'ke_grouping_id', 'ke_hari'])->values(),
                'diterapkan_at' => $draf->diterapkan_at?->toDateTimeString(),
                'dibatalkan_at' => $draf->dibatalkan_at?->toDateTimeString(),
                'ringkasan' => $this->ringkas($draf->ringkasan),
                'galat_batal' => $draf->status === 'diterapkan' ? RombakResort::periksaBatal($draf) : null,
            ] : null,
        ]);
    }

    /** Angka ringkasan untuk layar (ringkasan lengkap disimpan untuk batal). */
    private function ringkas(?array $x): ?array
    {
        if (!$x) {
            return null;
        }
        $b = $x['batal'] ?? null;

        return [
            'pinjaman' => $x['pinjaman'],
            'baris_m' => collect($x['baris_m'])->map(fn($v) => $v['jumlah']),
            'hari_dibuka' => count($x['hari_dibuka']),
            'macet_lama' => count($x['macet_lama']),
            'target' => count($x['target_lama']),
            'rekening' => count($x['rekening']['ditimpa']),
            'rekening_bentrok' => count($x['rekening']['bentrok']),
            'batal' => $b ? [
                'pinjaman' => $b['pinjaman'],
                'hari_dibuka' => count($b['hari_dibuka']),
                'drop_sesudah' => $b['drop_sesudah'],
            ] : null,
        ];
    }

    public function simpan(Request $request)
    {
        $this->pastikanSuperuser();

        $request->validate(['branch_id' => ['required', 'integer', Rule::in($this->kantor()->pluck('id')->all())]]);
        $branchId = (int) $request->input('branch_id');
        $gIds = $this->idKelompok($branchId);

        $val = $request->validate([
            'branch_id' => ['required'],
            'berlaku_bulan' => ['required', 'date_format:Y-m-d', 'ends_with:-01'],
            'catatan' => ['nullable', 'string', 'max:255'],
            'id' => ['nullable', 'integer', Rule::exists('transaction_resort_rombaks', 'id')
                ->where('branch_id', $branchId)->where('status', 'draf')],
            'peta' => ['present', 'array'],
            'peta.*.dari_grouping_id' => ['required', 'integer', Rule::in($gIds)],
            // Tujuan NULL (keduanya) = blok diparkir di stash; hanya satu yang NULL ditolak.
            'peta.*.ke_grouping_id' => ['nullable', 'required_with:peta.*.ke_hari', 'integer', Rule::in($gIds)],
            'peta.*.dari_hari' => ['required', Rule::in(RombakResort::HARI)],
            'peta.*.ke_hari' => ['nullable', 'required_with:peta.*.ke_grouping_id', Rule::in(RombakResort::HARI)],
        ]);

        $peta = collect($val['peta']);
        // K3: satu resort asal hanya ke satu tujuan.
        if ($peta->map(fn($p) => $p['dari_grouping_id'] . '|' . $p['dari_hari'])->duplicates()->isNotEmpty()) {
            throw ValidationException::withMessages(['peta' => 'Satu resort asal muncul dua kali di peta.']);
        }
        // dari == ke dibuang (tidak pindah); stash (tujuan NULL) tetap disimpan.
        $peta = $peta->reject(fn($p) => $p['dari_grouping_id'] == ($p['ke_grouping_id'] ?? null) && $p['dari_hari'] === ($p['ke_hari'] ?? null));

        $rombak = DB::transaction(function () use ($val, $peta, $branchId) {
            $rombak = !empty($val['id'])
                ? TransactionResortRombak::where('status', 'draf')->lockForUpdate()->findOrFail($val['id'])
                : new TransactionResortRombak([
                    'branch_id' => $branchId,
                    'status' => 'draf',
                    'dibuat_oleh' => auth()->user()->employee->id,
                ]);
            $rombak->fill(['berlaku_bulan' => $val['berlaku_bulan'], 'catatan' => $val['catatan'] ?? null]);
            $rombak->save();
            $rombak->touch();

            $rombak->peta()->delete();
            $rombak->peta()->createMany($peta->map(fn($p) => [
                'dari_grouping_id' => $p['dari_grouping_id'],
                'dari_hari' => $p['dari_hari'],
                'ke_grouping_id' => $p['ke_grouping_id'] ?? null,
                'ke_hari' => $p['ke_hari'] ?? null,
            ])->values()->all());

            return $rombak;
        });

        return redirect()->route('rombak_resort.index', ['branch_id' => $branchId, 'rombak' => $rombak->id])
            ->with('message', 'Draf disimpan.');
    }

    public function hapus(TransactionResortRombak $rombak)
    {
        $this->pastikanSuperuser();
        abort_unless($rombak->status === 'draf', 422, 'Hanya draf yang boleh dihapus.');

        $rombak->delete(); // peta ikut terhapus (FK cascade)

        return back()->with('message', 'Draf dihapus.');
    }

    /** Salin peta rombak (biasanya yang dibatalkan) jadi draf baru bulan berjalan, supaya bisa diedit & diterapkan lagi. */
    public function salin(TransactionResortRombak $rombak)
    {
        $this->pastikanSuperuser();
        // Peta rombak diterapkan relatif ke susunan SEBELUM rombak itu; sesudah diterapkan,
        // kolom pinjaman sudah susunan baru, jadi salinannya akan memetakan resort yang sudah tidak ada.
        abort_unless($rombak->status === 'dibatalkan', 422, 'Hanya rombak yang sudah dibatalkan yang bisa disalin.');

        $baru = DB::transaction(function () use ($rombak) {
            $baru = TransactionResortRombak::create([
                'branch_id' => $rombak->branch_id,
                'berlaku_bulan' => Carbon::now()->startOfMonth()->toDateString(),
                'status' => 'draf',
                'catatan' => trim("Salinan #{$rombak->id}. " . ($rombak->catatan ?? '')),
                'dibuat_oleh' => auth()->user()->employee->id,
            ]);
            $baru->peta()->createMany($rombak->peta->map(fn($p) => $p->only(['dari_grouping_id', 'dari_hari', 'ke_grouping_id', 'ke_hari']))->all());

            return $baru;
        });

        return redirect()->route('rombak_resort.index', ['branch_id' => $baru->branch_id, 'rombak' => $baru->id])
            ->with('message', "Draf #{$baru->id} disalin dari #{$rombak->id}.");
    }

    /** Pratinjau draf (hanya baca), JSON untuk dialog. */
    public function pratinjau(TransactionResortRombak $rombak)
    {
        $this->pastikanSuperuser();

        return response()->json(RombakResort::pratinjau($rombak));
    }

    public function terapkan(TransactionResortRombak $rombak)
    {
        return $this->jalankan($rombak, 'terapkan', 'diterapkan');
    }

    public function batal(TransactionResortRombak $rombak)
    {
        return $this->jalankan($rombak, 'batal', 'dibatalkan');
    }

    /** Terapkan / batal: Babat 1 makan ~20 detik, gagal -> kembali dengan pesan galat. */
    private function jalankan(TransactionResortRombak $rombak, string $aksi, string $kata)
    {
        $this->pastikanSuperuser();
        set_time_limit(120);
        if (!auth()->user()->employee) {
            return back()->withErrors(['rombak' => 'Akun superuser ini tidak terhubung ke data karyawan.']);
        }
        try {
            RombakResort::$aksi($rombak, auth()->user());
        } catch (\RuntimeException $e) {
            return back()->withErrors(['rombak' => $e->getMessage()]);
        } catch (\Illuminate\Database\QueryException $e) {
            // Lock wait / deadlock / SIGNAL trigger: transaksi sudah rollback, data aman.
            return back()->withErrors(['rombak' => 'Gagal (database): ' . $e->getPrevious()?->getMessage()]);
        }

        return redirect()->route('rombak_resort.index', ['branch_id' => $rombak->branch_id, 'rombak' => $rombak->id])
            ->with('message', "Rombak #{$rombak->id} $kata.");
    }
}
