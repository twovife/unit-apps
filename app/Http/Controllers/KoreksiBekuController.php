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
use App\Traits\PinjamanTrait;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * Menu Koreksi Pasca Migrasi (superuser): koreksi angsuran bertanggal sebelum
 * migrasi kantor + log koreksinya. Logika & pengamannya di App\Helpers\KoreksiBeku.
 */
class KoreksiBekuController extends Controller
{
    use PinjamanTrait;

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
            ? TransactionLoan::with(['customer', 'manage_customer', 'white_off', 'loan_instalment' => fn($q) => $q->where('transaction_date', '<=', $akhirTampil->toDateString())])
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
                'grouping_id' => $grouping?->id,
                'bulan' => $bulan->format('Y-m'),
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
                // Pemutihan (MD) sebelum migrasi: bisa dihapus kalau ternyata salah.
                'pemutihan' => $l->white_off && Carbon::parse($l->white_off->transaction_date)->lt($mulai) ? [
                    'id' => $l->white_off->id,
                    'tanggal' => Carbon::parse($l->white_off->transaction_date)->toDateString(),
                    'nominal' => (int) $l->white_off->nominal,
                ] : null,
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

    /**
     * Buku Angsuran Beku (superuser): tampilan persis /pinjaman (getLoan, komponen
     * Angsuran yang sama), tapi data sebelum migrasi bisa dikoreksi dari modal
     * nasabah lewat KoreksiBeku. /pinjaman untuk client tidak berubah.
     */
    public function buku(Request $request)
    {
        $this->wajibSuperuser();
        $data = $this->getLoan($request, false, true);
        $f = $data['server_filter'] ?? [];
        // Kantor dari kelompok yang benar-benar dimuat (server_filter.branch_id bisa kosong untuk user pusat).
        $branchId = TransactionLoanOfficerGrouping::whereKey($f['groupId'] ?? 0)->value('branch_id') ?? AuthScope::resolve()->branch_id;
        $mulai = AgregasiScope::tanggalMulai($branchId);

        return Inertia::render('Migrasi/BukuBeku', $data + [
            'beku' => [
                'mulai' => $mulai?->toDateString(),
                'banding' => $mulai ? $this->bandingBucket($branchId, $mulai->copy()->startOfMonth(), $f['kelompok'] ?? null, $f['hari'] ?? null) : null,
                'grouping_id' => $f['groupId'] ?? null,
                'kelompok' => $f['kelompok'] ?? null,
                'hari' => $f['hari'] ?? null,
            ],
        ]);
    }

    /**
     * Bucket serah terima bulan migrasi vs jumlah nasabah sekarang, per kategori
     * (Lancar / CM / MB / ML): asli (sebelum koreksi beku = sekarang - geseran di log),
     * sekarang (transaction_sirculations), nasabah (portofolio per akhir bulan lalu,
     * termasuk MACET LAMA). Sama dengan Kesiapan Migrasi.
     */
    private function bandingBucket(int $branchId, Carbon $periode, $kelompok, ?string $hari): ?array
    {
        $baris = app(MigrasiController::class)->barisKesiapan($branchId, $periode, $kelompok)->firstWhere('hari', $hari);
        if (!$baris) {
            return null;
        }
        $nasabah = array_map(fn($isi) => array_sum(array_intersect_key($baris['sistem'], array_flip($isi))), Ember::KATEGORI);

        // Geseran bucket oleh koreksi beku (dampak bucket_*), per kolom sirkulasi.
        $geser = ['amount' => 0, 'cm_amount' => 0, 'mb_amount' => 0, 'ml_amount' => 0];
        foreach (TransactionKoreksiBeku::where('branch_id', $branchId)->get(['dampak']) as $log) {
            foreach ($log->dampak ?? [] as $d) {
                if ((string) ($d['kelompok'] ?? '') !== (string) $kelompok || ($d['hari'] ?? '') !== $hari || ($d['periode'] ?? '') !== $periode->format('Y-m')) {
                    continue;
                }
                foreach ($geser as $c => $_) {
                    if (isset($d['kolom']['bucket_' . $c])) {
                        $geser[$c] += $d['kolom']['bucket_' . $c][1] - $d['kolom']['bucket_' . $c][0];
                    }
                }
            }
        }
        $kategori = fn(array $a) => [
            'lancar' => $a['amount'] - $a['cm_amount'] - $a['mb_amount'] - $a['ml_amount'],
            'cm' => $a['cm_amount'], 'mb' => $a['mb_amount'], 'ml' => $a['ml_amount'],
        ];
        $sekarang = $baris['lama'];
        $asli = $sekarang ? $kategori([
            'amount' => array_sum($sekarang) - $geser['amount'],
            'cm_amount' => $sekarang['cm'] - $geser['cm_amount'],
            'mb_amount' => $sekarang['mb'] - $geser['mb_amount'],
            'ml_amount' => $sekarang['ml'] - $geser['ml_amount'],
        ]) : null;

        return [
            'periode' => $periode->toDateString(),
            'asli' => $asli,
            'sekarang' => $sekarang,
            'nasabah' => $nasabah,
            'alasan' => $baris['alasan'],
        ];
    }

    private function aturan(Request $request): array
    {
        return $request->validate([
            'aksi' => ['required', 'in:' . implode(',', KoreksiBeku::AKSI)],
            'angsuran_id' => ['nullable', 'integer'],
            'loan_id' => ['nullable', 'integer'],
            'pemutihan_id' => ['nullable', 'integer'],
            'tanggal' => ['nullable', 'date'],
            'nominal' => ['nullable', 'integer', 'min:0'],
            'alasan' => ['nullable', 'string', 'max:1000'],
            'ikut_bucket' => ['boolean'],
            // tambah_pinjaman
            'grouping_id' => ['nullable', 'integer'],
            'hari' => ['nullable', 'string'],
            'nik' => ['nullable', 'string', 'max:16'],
            'nama' => ['nullable', 'string', 'max:255'],
            'alamat' => ['nullable', 'string', 'max:255'],
            'nomor_anggota' => ['nullable', 'regex:/^[0-9]+$/', 'max:20'],
        ]);
    }

    /** Pratinjau dampak: koreksi dijalankan lalu dibatalkan (JSON). */
    public function pratinjau(Request $request)
    {
        $this->wajibSuperuser();
        $v = $this->aturan($request);

        try {
            return response()->json(KoreksiBeku::jalankan($v['aksi'], $v, $v['alasan'] ?? '', false, $request->boolean('ikut_bucket')));
        } catch (\RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function simpan(Request $request)
    {
        $this->wajibSuperuser();
        $v = $this->aturan($request);

        try {
            KoreksiBeku::jalankan($v['aksi'], $v, $v['alasan'] ?? '', true, $request->boolean('ikut_bucket'));
        } catch (\RuntimeException $e) {
            return back()->withErrors($e->getMessage());
        }

        return back()->with('message', 'Koreksi tersimpan, saldo bulanan sudah dihitung ulang.');
    }

    /**
     * Isi satu sel buku angsuran beku langsung (mas 2026-10-28): tanpa pratinjau,
     * bucket bulan migrasi selalu ikut. Sel kosong = tambah, berisi satu angsuran
     * = ubah (0 = hapus). Sel berisi beberapa angsuran / pelunasan topup ditolak -
     * lewat modal nasabah.
     */
    public function sel(Request $request)
    {
        $this->wajibSuperuser();
        $v = $request->validate([
            'loan_id' => ['required', 'integer'],
            'tanggal' => ['required', 'date'],
            'nominal' => ['required', 'integer', 'min:0'],
        ]);
        $isi = \App\Models\TransactionLoanInstalment::where('transaction_loan_id', $v['loan_id'])
            ->whereDate('transaction_date', $v['tanggal'])->get();
        $nominal = (int) $v['nominal'];

        if ($isi->count() > 1 || $isi->contains(fn($a) => $a->settled_by_loan_id)) {
            return back()->withErrors('Sel ' . Carbon::parse($v['tanggal'])->format('d-m-Y') . ' berisi lebih dari satu angsuran / pelunasan topup - koreksi lewat tombol Pay.');
        }
        if ($isi->isEmpty() && $nominal === 0) {
            return back();
        }
        if ($isi->count() === 1 && (int) $isi->first()->nominal === $nominal) {
            return back();
        }
        [$aksi, $data] = $isi->isEmpty()
            ? ['tambah', ['loan_id' => $v['loan_id'], 'tanggal' => $v['tanggal'], 'nominal' => $nominal]]
            : ($nominal === 0
                ? ['hapus', ['angsuran_id' => $isi->first()->id]]
                : ['ubah', ['angsuran_id' => $isi->first()->id, 'nominal' => $nominal]]);

        try {
            $hasil = KoreksiBeku::jalankan($aksi, $data, 'koreksi sel buku angsuran beku', true, true);
        } catch (\RuntimeException $e) {
            return back()->withErrors($e->getMessage());
        }

        // Ringkas: geseran saldo awal bulan migrasi & bucket, supaya dampaknya kelihatan tanpa pratinjau.
        $geser = collect($hasil['dampak'])->flatMap(fn($d) => collect($d['kolom'] ?? [])
            ->only(['awal_total', 'bucket_amount'])
            ->map(fn($ab, $k) => ($k === 'bucket_amount' ? 'bucket ' : 'saldo awal ') . $d['periode'] . ' ' . ($ab[1] >= $ab[0] ? '+' : '-') . number_format(abs($ab[1] - $ab[0]), 0, ',', '.'))->values())
            ->unique()->values()->implode(', ');

        return back()->with('message', 'Koreksi tersimpan' . ($geser ? ': ' . $geser : '') . '.');
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
