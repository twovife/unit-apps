<?php

namespace App\Http\Controllers;
use App\Helpers\AuthScope;
use App\Models\Branch;
use App\Models\Saving;
use App\Models\SavingBatch;
use App\Models\SavingTransaction;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class SkswUnitController extends Controller
{
    public function index(Request $request)
    {
        $validated = $request->validate([
            'period' => ['nullable', 'date_format:Y-m'],
        ]);

        $scope = AuthScope::resolve();
        $branch = Branch::query()
            ->whereKey($scope->branch_id)
            ->when(
                $scope->allowed_branches !== null,
                fn ($query) => $query->whereIn('id', $scope->allowed_branches),
            )
            ->first();
        $period = $validated['period'] ?? Carbon::now()->format('Y-m');
        $data = $branch ? $this->reportForBranch($branch->id, $period) : [];

        return Inertia::render('Sksw/Unit', [
            'branch' => $branch ? [
                'id' => $branch->id,
                'unit' => $branch->unit,
                'wilayah' => $branch->wilayah,
            ] : null,
            'period' => $period,
            'batch' => $branch
                ? SavingBatch::query()->where('branch_id', $branch->id)->where('period', $period)->first(['id', 'status', 'period'])
                : null,
            'data' => $data,
        ]);
    }

    /**
     * Detail rekening untuk drawer, bentuk payload sama dengan app_laravel
     * SavingController::detailPayload (semua transaksi lintas kantor, rekap
     * bulanan per kantor, can_void, mutasi_ref) supaya tampilannya sama.
     */
    public function detail(Saving $saving)
    {
        $scope = AuthScope::resolve();
        $this->authorizeBranch($scope->branch_id);
        $this->pastikanRekeningKantor($saving, $scope->branch_id);

        $saving->load(['employee.employment', 'employee.branch', 'branch']);
        $user = Auth::user();

        $transactions = $saving->transactions()
            ->with(['batch:id,period,status', 'creator.employee'])
            ->orderByDesc('transaction_date')->orderByDesc('id')
            ->get();

        $sw = 0;
        $sk = 0;
        $snapshot = SavingTransaction::where('saving_transactions.saving_id', $saving->id)
            ->whereNull('saving_transactions.voided_at')
            ->join('branches', 'saving_transactions.branch_id', '=', 'branches.id')
            ->selectRaw("DATE_FORMAT(saving_transactions.transaction_date, '%Y-%m') as period, branches.unit as branch_unit,
                MIN(saving_transactions.transaction_date) as first_tx_date, MIN(saving_transactions.id) as first_tx_id,
                SUM(CASE WHEN saving_transactions.jenis='SW' THEN saving_transactions.debit ELSE 0 END) as sw_debit,
                SUM(CASE WHEN saving_transactions.jenis='SW' THEN saving_transactions.kredit ELSE 0 END) as sw_kredit,
                SUM(CASE WHEN saving_transactions.jenis='SK' THEN saving_transactions.debit ELSE 0 END) as sk_debit,
                SUM(CASE WHEN saving_transactions.jenis='SK' THEN saving_transactions.kredit ELSE 0 END) as sk_kredit")
            ->groupByRaw("DATE_FORMAT(saving_transactions.transaction_date, '%Y-%m'), branches.unit")
            ->orderBy('period')->orderBy('first_tx_date')->orderBy('first_tx_id')
            ->get()
            ->map(function ($row) use (&$sw, &$sk) {
                $sw += (int) $row->sw_debit - (int) $row->sw_kredit;
                $sk += (int) $row->sk_debit - (int) $row->sk_kredit;

                return ['period' => $row->period, 'branch_unit' => $row->branch_unit, 'sw_saldo' => $sw, 'sk_saldo' => $sk];
            })
            ->reverse()->values();

        return response()->json([
            'saving' => [
                'id' => $saving->id,
                'nomor_rekening' => $saving->nomor_rekening,
                'saldo_sw' => $saving->saldoSW(),
                'saldo_sk' => $saving->saldoSK(),
                'employee' => [
                    'nama_karyawan' => $saving->employee?->nama_karyawan,
                    'date_resign' => $saving->employee?->date_resign,
                    'jabatan' => $saving->employee?->employment?->jabatan,
                    'branch' => $saving->employee?->branch ? ['id' => $saving->employee->branch->id, 'unit' => $saving->employee->branch->unit] : null,
                ],
                'branch' => $saving->branch ? ['id' => $saving->branch->id, 'unit' => $saving->branch->unit] : null,
            ],
            'boleh_input' => $this->bolehInput() && (int) $saving->branch_id === (int) $scope->branch_id,
            'transactions' => $transactions->map(fn(SavingTransaction $tx) => [
                'id' => $tx->id,
                'jenis' => $tx->jenis,
                'transaction_date' => $tx->transaction_date?->format('Y-m-d'),
                'transaction_type' => $tx->transaction_type,
                'debit' => (int) $tx->debit,
                'kredit' => (int) $tx->kredit,
                'note' => $tx->note,
                'batch_period' => $tx->batch?->period,
                'batch_status' => $tx->batch?->status,
                'created_by_name' => $tx->creator?->employee?->nama_karyawan ?? $tx->creator?->username,
                'voided_at' => $tx->voided_at?->format('Y-m-d H:i'),
                'can_void' => $this->bisaHapus($tx, $user),
                'mutasi_ref' => $tx->mutasi_ref,
            ]),
            'snapshot' => $snapshot,
        ]);
    }

    /**
     * Tambah satu transaksi (D setoran / K penarikan / KRMD pencairan resign),
     * = app_laravel SavingController::addTransaction: setoran sekali per bulan
     * per jenis, penarikan tidak boleh melebihi saldo, tidak boleh mundur.
     */
    public function transaksi(Request $request, Saving $saving)
    {
        $data = $request->validate([
            'jenis' => ['required', 'in:SW,SK'],
            'transaction_date' => ['required', 'date', 'before_or_equal:today'],
            'transaction_type' => ['required', 'in:D,K,KRMD'],
            'debit' => ['nullable', 'integer', 'min:0'],
            'kredit' => ['nullable', 'integer', 'min:0'],
            'note' => ['nullable', 'string', 'max:500'],
        ], ['transaction_date.before_or_equal' => 'Tanggal transaksi tidak boleh di masa depan.']);
        $batch = $this->siapTulis($saving, $data['transaction_date']);

        $setoran = $data['transaction_type'] === 'D';
        $nominal = (int) ($setoran ? ($data['debit'] ?? 0) : ($data['kredit'] ?? 0));
        if ($nominal <= 0) {
            throw ValidationException::withMessages([$setoran ? 'debit' : 'kredit' => 'Nominal wajib diisi.']);
        }
        if ($setoran && $this->setoranSudahAda($saving->id, $data['jenis'], $data['transaction_date'])) {
            throw ValidationException::withMessages(['debit' => "Setoran {$data['jenis']} bulan " . Carbon::parse($data['transaction_date'])->format('m-Y') . ' sudah ada. Hapus dulu yang lama kalau mau diganti.']);
        }
        if (!$setoran) {
            $saldo = $data['jenis'] === 'SW' ? $saving->saldoSW() : $saving->saldoSK();
            if ($nominal > $saldo) {
                throw ValidationException::withMessages(['kredit' => "Saldo {$data['jenis']} tidak mencukupi. Saldo saat ini: " . number_format($saldo, 0, ',', '.')]);
            }
        }

        SavingTransaction::create([
            'saving_id' => $saving->id,
            'branch_id' => $saving->branch_id,
            'jenis' => $data['jenis'],
            'transaction_date' => $data['transaction_date'],
            'transaction_type' => $data['transaction_type'],
            'debit' => $setoran ? $nominal : 0,
            'kredit' => $setoran ? 0 : $nominal,
            'batch_id' => $batch->id,
            'note' => $data['note'] ?? null,
            'created_by' => Auth::id(),
        ]);

        return back()->with('message', 'Transaksi berhasil dicatat.');
    }

    /**
     * Mutasi seluruh saldo SW & SK ke kantor karyawan saat ini, = app_laravel
     * SavingController::mutate (tanpa jalur bypass: tujuan selalu kantor
     * karyawan, jadi karyawannya harus sudah dimutasi lebih dulu).
     */
    public function mutasi(Request $request, Saving $saving)
    {
        $data = $request->validate([
            'transaction_date' => ['required', 'date', 'before_or_equal:today'],
            'note' => ['nullable', 'string', 'max:500'],
        ]);
        $fromBatch = $this->siapTulis($saving, $data['transaction_date']);

        $tujuan = (int) $saving->employee()->value('branch_id');
        if (!$tujuan || $tujuan === (int) $saving->branch_id) {
            throw ValidationException::withMessages(['transaction_date' => 'Karyawan belum dimutasi. Mutasikan karyawannya dulu di menu Karyawan.']);
        }
        $toBatch = SavingBatch::firstOrCreate(['branch_id' => $tujuan, 'period' => $fromBatch->period], ['status' => 'open']);
        if ($toBatch->status === 'locked') {
            throw ValidationException::withMessages(['transaction_date' => "Batch periode {$fromBatch->period} kantor tujuan sudah dikunci. Hubungi kantor pusat."]);
        }

        $saldo = ['SW' => $saving->saldoSW(), 'SK' => $saving->saldoSK()];
        if ($saldo['SW'] <= 0 && $saldo['SK'] <= 0) {
            throw ValidationException::withMessages(['transaction_date' => 'Saldo SW dan SK kosong, tidak ada yang bisa dimutasikan.']);
        }

        $ref = (string) \Illuminate\Support\Str::uuid();
        $dari = Branch::whereKey($saving->branch_id)->value('unit') ?? 'Kantor Lama';
        $ke = Branch::whereKey($tujuan)->value('unit') ?? 'Kantor Baru';
        $note = $data['note'] ?? null;
        $asal = (int) $saving->branch_id;

        DB::transaction(function () use ($saving, $saldo, $data, $fromBatch, $toBatch, $ref, $dari, $ke, $note, $asal, $tujuan) {
            foreach ($saldo as $jenis => $nilai) {
                if ($nilai <= 0) {
                    continue;
                }
                $umum = ['saving_id' => $saving->id, 'jenis' => $jenis, 'transaction_date' => $data['transaction_date'], 'created_by' => Auth::id(), 'mutasi_ref' => $ref];
                SavingTransaction::create($umum + ['branch_id' => $asal, 'transaction_type' => 'KM', 'debit' => 0, 'kredit' => $nilai, 'batch_id' => $fromBatch->id,
                    'note' => $note ? "{$note} ({$jenis})" : "Mutasi Keluar {$jenis} ke {$ke}"]);
                SavingTransaction::create($umum + ['branch_id' => $tujuan, 'transaction_type' => 'DM', 'debit' => $nilai, 'kredit' => 0, 'batch_id' => $toBatch->id,
                    'note' => $note ? "{$note} ({$jenis})" : "Mutasi Masuk {$jenis} dari {$dari}"]);
            }
        });

        return back()->with('message', 'Mutasi saldo berhasil diproses.');
    }

    /** Hapus transaksi (permanen, = app_laravel void): batch harus masih terbuka. Mutasi ikut pasangannya. */
    public function hapus(SavingTransaction $transaction)
    {
        abort_unless($this->bolehInput(), 403, 'Input SKSW untuk kasir, staf kontrol, pusat, dan superuser.');
        $this->authorizeBranch((int) $transaction->branch_id);
        abort_unless($this->bisaHapus($transaction, Auth::user()), 403, 'Transaksi ini tidak bisa dihapus (batch terkunci / data lama).');

        $transaction->delete();

        return back()->with('message', 'Transaksi berhasil dihapus.');
    }

    /**
     * Input setoran bulanan SW/SK banyak karyawan sekaligus (mas 2026-10-15),
     * aturan = app_laravel SavingController::fastInput: batch per kantor+bulan
     * (dibuat kalau belum ada), batch terkunci ditolak (tanpa pengecualian di sini),
     * tidak boleh mundur sebelum bulan transaksi terakhir rekening, setoran (D)
     * sekali per bulan per jenis. Semua baris atau tidak sama sekali.
     */
    public function setoran(Request $request)
    {
        $user = Auth::user();
        abort_unless($this->bolehInput(), 403, 'Input SKSW untuk kasir, staf kontrol, pusat, dan superuser.');

        $data = $request->validate([
            'transaction_date' => ['required', 'date', 'before_or_equal:today'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.saving_id' => ['required', 'integer'],
            'items.*.sw' => ['nullable', 'integer', 'min:0'],
            'items.*.sk' => ['nullable', 'integer', 'min:0'],
        ], ['transaction_date.before_or_equal' => 'Tanggal setoran tidak boleh di masa depan.']);

        $branchId = (int) AuthScope::resolve()->branch_id;
        $this->authorizeBranch($branchId);
        $tanggal = Carbon::parse($data['transaction_date']);
        $period = $tanggal->format('Y-m');
        $bypass = false; // unit-apps tidak menulis ke batch terkunci (lihat SavingTransaction::booted)

        $batch = SavingBatch::firstOrCreate(['branch_id' => $branchId, 'period' => $period], ['status' => 'open']);
        if ($batch->status === 'locked') {
            return back()->withErrors(['batch' => "Batch periode {$period} sudah dikunci. Hubungi kantor pusat."]);
        }

        $items = collect($data['items'])->filter(fn($i) => (int) ($i['sw'] ?? 0) > 0 || (int) ($i['sk'] ?? 0) > 0)->values();
        if ($items->isEmpty()) {
            return back()->withErrors(['items' => 'Isi minimal satu setoran.']);
        }

        $savings = Saving::with('employee:id,nama_karyawan')->whereIn('id', $items->pluck('saving_id'))->get()->keyBy('id');
        $galat = [];
        foreach ($items as $i) {
            $saving = $savings->get((int) $i['saving_id']);
            $nama = $saving?->employee?->nama_karyawan ?? ('rekening ' . $i['saving_id']);
            if (!$saving || (int) $saving->branch_id !== $branchId) {
                $galat[] = "{$nama}: rekening bukan milik kantor aktif.";
                continue;
            }
            if (!$bypass) {
                $terakhir = SavingTransaction::active()->where('saving_id', $saving->id)->max('transaction_date');
                if ($terakhir && $tanggal->copy()->startOfMonth()->lt(Carbon::parse($terakhir)->startOfMonth())) {
                    $galat[] = "{$nama}: tidak bisa input mundur (sebelum " . Carbon::parse($terakhir)->format('Y-m') . ').';
                    continue;
                }
            }
            foreach (['SW' => 'sw', 'SK' => 'sk'] as $jenis => $k) {
                if ((int) ($i[$k] ?? 0) > 0 && SavingTransaction::active()->where('saving_id', $saving->id)->where('jenis', $jenis)
                    ->where('transaction_type', 'D')->whereYear('transaction_date', $tanggal->year)->whereMonth('transaction_date', $tanggal->month)->exists()) {
                    $galat[] = "{$nama}: setoran {$jenis} bulan " . $tanggal->format('m-Y') . ' sudah ada.';
                }
            }
        }
        if ($galat) {
            return back()->withErrors(['items' => implode(' ', $galat)]);
        }

        DB::transaction(function () use ($items, $savings, $batch, $tanggal, $user) {
            foreach ($items as $i) {
                $saving = $savings->get((int) $i['saving_id']);
                foreach (['SW' => 'sw', 'SK' => 'sk'] as $jenis => $k) {
                    if ((int) ($i[$k] ?? 0) <= 0) {
                        continue;
                    }
                    SavingTransaction::create([
                        'saving_id' => $saving->id,
                        'branch_id' => $saving->branch_id,
                        'jenis' => $jenis,
                        'transaction_date' => $tanggal->toDateString(),
                        'transaction_type' => 'D',
                        'debit' => (int) $i[$k],
                        'kredit' => 0,
                        'batch_id' => $batch->id,
                        'note' => 'Input Bulanan',
                        'created_by' => $user->id,
                    ]);
                }
            }
        });

        return back()->with('message', 'Setoran SKSW tersimpan (' . $items->count() . ' karyawan).');
    }

    private function reportForBranch(int $branchId, string $period): array
    {
        $month = Carbon::parse($period . '-01');
        $startOfMonth = $month->toDateString();
        $endOfMonth = $month->copy()->endOfMonth()->toDateString();
        $previousPeriod = $month->copy()->subMonth()->format('Y-m');
        $previousBatchLocked = SavingBatch::query()
            ->where('branch_id', $branchId)
            ->where('period', $previousPeriod)
            ->where('status', 'locked')
            ->exists();

        $activeSavingIds = SavingTransaction::query()
            ->active()
            ->where('branch_id', $branchId)
            ->whereBetween('transaction_date', [$startOfMonth, $endOfMonth])
            ->distinct()
            ->pluck('saving_id')
            ->map(fn ($id) => (int) $id)
            ->all();

        if ($previousBatchLocked) {
            $openingRows = \Illuminate\Support\Facades\DB::table('saving_monthly_snapshots')
                ->where('branch_id', $branchId)
                ->where('period', $previousPeriod)
                ->where(function ($query) {
                    $query->where('saldo_sw', '!=', 0)->orWhere('saldo_sk', '!=', 0);
                })
                ->get(['saving_id', 'saldo_sw', 'saldo_sk']);
            $openingSavingIds = $openingRows->pluck('saving_id')->map(fn ($id) => (int) $id)->all();
        } else {
            $openingRows = collect();
            $openingSavingIds = SavingTransaction::query()
                ->active()
                ->where('branch_id', $branchId)
                ->where('transaction_date', '<', $startOfMonth)
                ->select('saving_id')
                ->groupBy('saving_id')
                ->havingRaw('SUM(CASE WHEN jenis IN (?, ?) THEN debit - kredit ELSE 0 END) != 0', ['SW', 'SK'])
                ->pluck('saving_id')
                ->map(fn ($id) => (int) $id)
                ->all();
        }

        $savingIds = array_values(array_unique(array_merge($activeSavingIds, $openingSavingIds)));

        if ($savingIds === []) {
            return [];
        }

        $openingBalances = [];
        if ($previousBatchLocked) {
            foreach ($openingRows as $row) {
                $openingBalances[(int) $row->saving_id] = [
                    'sw' => (int) $row->saldo_sw,
                    'sk' => (int) $row->saldo_sk,
                ];
            }
        } else {
            $openingRows = SavingTransaction::query()
                ->active()
                ->where('branch_id', $branchId)
                ->where('transaction_date', '<', $startOfMonth)
                ->whereIn('saving_id', $savingIds)
                ->select('saving_id', 'jenis')
                ->selectRaw('SUM(debit) as total_debit, SUM(kredit) as total_kredit')
                ->groupBy('saving_id', 'jenis')
                ->get();

            foreach ($openingRows as $row) {
                $jenis = strtolower($row->jenis);
                $openingBalances[$row->saving_id][$jenis] =
                    (int) $row->total_debit - (int) $row->total_kredit;
            }
        }

        $monthlyMovements = SavingTransaction::query()
            ->active()
            ->where('branch_id', $branchId)
            ->whereBetween('transaction_date', [$startOfMonth, $endOfMonth])
            ->whereIn('saving_id', $savingIds)
            ->select('saving_id', 'jenis')
            ->selectRaw("
                CAST(SUM(debit) AS SIGNED) as total_debit,
                CAST(SUM(kredit) AS SIGNED) as total_kredit,
                CAST(SUM(CASE WHEN transaction_type = 'D' THEN debit ELSE 0 END) AS SIGNED) as setoran,
                CAST(SUM(CASE WHEN transaction_type = 'DM' THEN debit ELSE 0 END) AS SIGNED) as debit_mutasi,
                CAST(SUM(CASE WHEN transaction_type = 'K' THEN kredit ELSE 0 END) AS SIGNED) as pengambilan,
                CAST(SUM(CASE WHEN transaction_type = 'KM' THEN kredit ELSE 0 END) AS SIGNED) as kredit_mutasi,
                CAST(SUM(CASE WHEN transaction_type = 'KRMD' THEN kredit ELSE 0 END) AS SIGNED) as kredit_resign
            ")
            ->groupBy('saving_id', 'jenis')
            ->get()
            ->groupBy('saving_id');

        return Saving::query()
            ->with(['employee.employment'])
            ->whereIn('id', $savingIds)
            ->get()
            ->sortBy(fn (Saving $saving) => [
                $saving->employee?->date_resign !== null,
                $saving->employee?->employment_id ?? PHP_INT_MAX,
                $saving->employee?->area ?? PHP_INT_MAX,
                mb_strtolower($saving->employee?->nama_karyawan ?? ''),
            ])
            ->values()
            ->map(function (Saving $saving) use ($openingBalances, $monthlyMovements) {
                $moves = $monthlyMovements->get($saving->id, collect())->keyBy('jenis');
                $sw = $moves->get('SW');
                $sk = $moves->get('SK');
                $swOpening = (int) ($openingBalances[$saving->id]['sw'] ?? 0);
                $skOpening = (int) ($openingBalances[$saving->id]['sk'] ?? 0);
                $swDebit = (int) ($sw?->total_debit ?? 0);
                $swCredit = (int) ($sw?->total_kredit ?? 0);
                $skDebit = (int) ($sk?->total_debit ?? 0);
                $skCredit = (int) ($sk?->total_kredit ?? 0);

                return [
                    'saving_id' => $saving->id,
                    'nomor_rekening' => $saving->nomor_rekening,
                    'employee' => [
                        'id' => $saving->employee?->id,
                        'nama_karyawan' => $saving->employee?->nama_karyawan ?? 'Karyawan tidak ditemukan',
                        'jabatan' => $saving->employee?->employment?->jabatan,
                        'area' => $saving->employee?->area,
                        'date_resign' => $saving->employee?->date_resign,
                    ],
                    'sw_awal' => $swOpening,
                    'sk_awal' => $skOpening,
                    'sw_debit' => $swDebit,
                    'sk_debit' => $skDebit,
                    'sw_kredit' => $swCredit,
                    'sk_kredit' => $skCredit,
                    'saldo_sw' => $swOpening + $swDebit - $swCredit,
                    'saldo_sk' => $skOpening + $skDebit - $skCredit,
                    'sw_setoran' => (int) ($sw?->setoran ?? 0),
                    'sw_debit_mutasi' => (int) ($sw?->debit_mutasi ?? 0),
                    'sw_pengambilan' => (int) ($sw?->pengambilan ?? 0),
                    'sw_kredit_mutasi' => (int) ($sw?->kredit_mutasi ?? 0),
                    'sw_kredit_resign' => (int) ($sw?->kredit_resign ?? 0),
                    'sk_setoran' => (int) ($sk?->setoran ?? 0),
                    'sk_debit_mutasi' => (int) ($sk?->debit_mutasi ?? 0),
                    'sk_pengambilan' => (int) ($sk?->pengambilan ?? 0),
                    'sk_kredit_mutasi' => (int) ($sk?->kredit_mutasi ?? 0),
                    'sk_kredit_resign' => (int) ($sk?->kredit_resign ?? 0),
                    'is_active' => $saving->employee?->date_resign === null,
                ];
            })
            ->all();
    }

    private function bolehInput(): bool
    {
        return Auth::user()->hasAnyRole(['kasir', 'stafkontrol', 'pusat', 'superuser']);
    }

    /** Rekening harus terkait kantor aktif (rekening, transaksi, atau snapshot di kantor itu). */
    private function pastikanRekeningKantor(Saving $saving, int $branchId): void
    {
        $terkait = (int) $saving->branch_id === $branchId
            || SavingTransaction::where('saving_id', $saving->id)->where('branch_id', $branchId)->exists()
            || DB::table('saving_monthly_snapshots')->where('saving_id', $saving->id)->where('branch_id', $branchId)->exists();
        abort_unless($terkait, 404);
    }

    /**
     * Gerbang tulis satu rekening: peran input, rekening milik kantor aktif,
     * batch bulan itu terbuka (tanpa bypass), tidak mundur sebelum bulan
     * transaksi terakhir. Mengembalikan batch bulan itu.
     */
    private function siapTulis(Saving $saving, string $tanggal): SavingBatch
    {
        abort_unless($this->bolehInput(), 403, 'Input SKSW untuk kasir, staf kontrol, pusat, dan superuser.');
        $branchId = (int) AuthScope::resolve()->branch_id;
        $this->authorizeBranch($branchId);
        abort_unless((int) $saving->branch_id === $branchId, 403, 'Rekening ini bukan milik kantor aktif.');

        $period = Carbon::parse($tanggal)->format('Y-m');
        $batch = SavingBatch::firstOrCreate(['branch_id' => $branchId, 'period' => $period], ['status' => 'open']);
        if ($batch->status === 'locked') {
            throw ValidationException::withMessages(['transaction_date' => "Batch periode {$period} sudah dikunci. Hubungi kantor pusat."]);
        }
        $terakhir = SavingTransaction::active()->where('saving_id', $saving->id)->max('transaction_date');
        if ($terakhir && Carbon::parse($tanggal)->startOfMonth()->lt(Carbon::parse($terakhir)->startOfMonth())) {
            throw ValidationException::withMessages(['transaction_date' => 'Tidak bisa input mundur (sebelum ' . Carbon::parse($terakhir)->format('Y-m') . ').']);
        }

        return $batch;
    }

    private function setoranSudahAda(int $savingId, string $jenis, string $tanggal): bool
    {
        $t = Carbon::parse($tanggal);

        return SavingTransaction::active()->where('saving_id', $savingId)->where('jenis', $jenis)->where('transaction_type', 'D')
            ->whereYear('transaction_date', $t->year)->whereMonth('transaction_date', $t->month)->exists();
    }

    /** = app_laravel SavingTransaction::canBeVoidedBy, tanpa jalur bypass. */
    private function bisaHapus(SavingTransaction $tx, $user): bool
    {
        return $this->bolehInput() && $tx->voided_at === null && $tx->batch_id !== null && $tx->batch?->status === 'open';
    }

    private function authorizeBranch(int $branchId): void
    {
        $allowedBranchIds = Branch::getAllowedBranchIds(Auth::user());

        abort_if(
            $allowedBranchIds !== null && !in_array($branchId, $allowedBranchIds),
            403,
            'Anda tidak memiliki akses ke kantor ini.',
        );
    }
}
