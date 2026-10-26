<?php

namespace App\Http\Controllers;

use App\Helpers\AuthScope;
use App\Helpers\JasaModal;
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
 * dan setoran Goro Umrah, angsuran pinjaman modal. Semua tabel milik app_laravel (DB bersama); aturan
 * input disalin dari app_laravel IuranGabunganController / GoroUmrohController
 * (masa tenggang, kunci bulanan contribution_locks, bukti wajib, rekening).
 * BON Panjer sengaja tidak tampil (privasi). Pinjaman Modal per sumber dana.
 */
class PembayaranKantorController extends Controller
{
    private const TARGET_TABUNGAN = 1000000;
    private const TARGET_BOP = 1500000;
    private const SUMBER_MODAL = ['pusat' => 'Pinjaman Modal Pusat', 'tawan' => 'Pinjaman Modal Hertawan', 'sherly' => 'Pinjaman Modal Sherly'];
    /** Buku pinjaman modal (= app_laravel, mas 2026-10-21): tiap sumber TANPA modal awal + buku Modal Awal sendiri. */
    private const BUKU_MODAL = self::SUMBER_MODAL + [JasaModal::MODAL_AWAL => 'Modal Awal'];

    /** Halaman Dashboard Kasir; angkanya dimuat lewat ringkasan() (JSON). */
    public function halaman()
    {
        abort_unless(\App\Helpers\AppHelper::bolehAdmKantor(auth()->user()), 403, 'Dashboard kasir untuk kepala mantri, kasir, dan pimpinan.');

        return \Inertia\Inertia::render('Kasir/Dashboard/Index', [
            'videos' => \App\Helpers\VideoTutorial::url(['iuran', 'pinjamanmodal', 'sksw', 'sksw_karyawan_baru', 'tabungangoro']),
        ]);
    }

    public function ringkasan(Request $request)
    {
        abort_unless(\App\Helpers\AppHelper::bolehAdmKantor(auth()->user()), 403);
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
                'modal' => $this->modal($branch->id, $awal, $akhir),
                'sksw' => $this->sksw($branch->id, $awal, $akhir),
                'umrah' => $this->umrah($branch->id, $awal, $akhir, $periode),
                'kendaraan' => $this->pajakKendaraan($branch->id),
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
            'rekening_id' => ['required', 'exists:rekening_tujuan,id,deleted_at,NULL'],
            'notes' => ['nullable', 'string', 'max:255'],
            'bukti' => array_merge(['required'], Unggahan::ATURAN),
        ], ['tanggal.before_or_equal' => 'Tanggal setor tidak boleh di masa depan.', 'rekening_id.required' => 'Pilih rekening tujuan.'] + Unggahan::pesan('bukti'));

        $this->pastikanTerbuka('goro', $branch->id, substr((string) $data['tanggal'], 0, 7));
        $file = $request->file('bukti');
        $path = Unggahan::simpan($file, 'goro-umroh/setoran', 'bukti');

        DB::table('goro_umroh_setoran')->insert([
            'branch_id' => $branch->id,
            'tanggal' => $data['tanggal'],
            'amount' => (int) $data['amount'],
            'rekening_id' => (int) $data['rekening_id'],
            'notes' => $data['notes'] ?? null,
            'bukti_path' => $path,
            'bukti_name' => $file->getClientOriginalName(),
            'created_by' => auth()->id(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return back()->with('message', 'Setoran tabungan goro umrah dicatat.');
    }

    /** Hapus setoran Tabungan Goro Umrah sebelum dikunci staf kontrol. */
    public function destroyUmrah(Request $request, int $id)
    {
        $setoran = DB::table('goro_umroh_setoran')->where('id', $id)->first();
        abort_unless($setoran, 404, 'Data setoran tidak ditemukan.');

        abort_unless($this->bolehBayar((int) $setoran->branch_id), 403, 'Anda tidak memiliki hak akses untuk menghapus setoran kantor ini.');

        $periode = substr((string) $setoran->tanggal, 0, 7);
        $this->pastikanTerbuka('goro', (int) $setoran->branch_id, $periode);

        $bukti = $setoran->bukti_path;
        DB::table('goro_umroh_setoran')->where('id', $id)->delete();

        if ($bukti) {
            Storage::disk(Unggahan::DISK)->delete($bukti);
        }

        return back()->with('message', 'Setoran tabungan goro umrah berhasil dihapus.');
    }

    /**
     * Angsuran pinjaman modal: SATU nominal untuk semua pinjaman aktif kantor (mas 2026-10-21,
     * revisi): dibagi JasaModal::alokasi (jasa wajib Modal Awal, jasa wajib lain, pokok Modal
     * Awal, pokok lain lewat tempo, lebihnya ke pinjaman tempo). Satu input = satu `slip` (uuid);
     * stafkontrol memindah / meng-0-kan bagiannya lewat re-split slip di app_laravel. Status ikut
     * sisa (active/paid). Tabel tunggakan jasa TIDAK ditulis - dibangun ulang app_laravel.
     * Pinjaman sumber Pusat hanya ikut kalau penginput bendahara (kasirpusat).
     */
    public function bayarModal(Request $request)
    {
        $branch = $this->kantor();
        abort_unless($this->bolehBayar($branch->id), 403, 'Input pembayaran untuk kasir, staf kontrol, pusat, dan superuser.');
        $data = $request->validate([
            'nominal' => ['required', 'integer', 'min:1'],
            'payment_date' => ['required', 'date', 'before_or_equal:today'],
            'rekening_id' => ['required', 'exists:rekening_tujuan,id,deleted_at,NULL'],
            'notes' => ['nullable', 'string', 'max:255'],
            'bukti' => array_merge(['required'], Unggahan::ATURAN),
        ], ['payment_date.before_or_equal' => 'Tanggal bayar tidak boleh di masa depan.', 'rekening_id.required' => 'Pilih rekening tujuan.'] + Unggahan::pesan('bukti'));

        $periode = substr((string) $data['payment_date'], 0, 7);
        if (DB::table('contribution_locks')->where('module', 'modal')->whereNull('branch_id')->where('period', $periode)->exists()) {
            throw ValidationException::withMessages(['nominal' => "Pinjaman modal bulan {$periode} sudah dikunci kasir pusat."]);
        }

        [$pinjaman, $info, $hasil] = $this->bagiModal($branch->id, (int) $data['nominal'], $data['payment_date']);
        if ($pinjaman->isEmpty()) {
            throw ValidationException::withMessages(['nominal' => 'Tidak ada pinjaman modal aktif.']);
        }
        if ($hasil['lebih'] > 0) {
            $maks = (int) $data['nominal'] - $hasil['lebih'];
            throw ValidationException::withMessages(['nominal' => 'Nominal melebihi total sisa pokok + jasa (maks Rp ' . number_format($maks, 0, ',', '.') . ').']);
        }

        // Diunggah sesudah semua validasi lolos supaya tidak ada file yatim.
        $bukti = Unggahan::simpan($request->file('bukti'), 'modal-bukti', 'bukti');
        $slip = (string) \Illuminate\Support\Str::uuid();

        DB::transaction(function () use ($info, $hasil, $data, $bukti, $slip) {
            foreach ($hasil['bagian'] as $id => $b) {
                DB::table('tb_capital_loan_payments')->insert([
                    'tb_capital_loan_id' => $id,
                    'slip' => $slip,
                    'amount_principal' => $b['pokok'],
                    'amount_jasa_modal' => $b['jasa'],
                    'payment_date' => $data['payment_date'],
                    'rekening_id' => (int) $data['rekening_id'],
                    'notes' => $data['notes'] ?? null,
                    'created_by' => auth()->id(),
                    'bukti_path' => $bukti,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
                DB::table('tb_capital_loans')->where('id', $id)
                    ->update(['status' => $info[$id]['sisa'] - $b['pokok'] > 0 ? 'active' : 'paid', 'updated_at' => now()]);
            }
        });

        return back()->with('message', 'Pembayaran pinjaman modal dicatat. Pembagiannya bisa dipindah staf kontrol.');
    }

    /** Slip angsuran modal boleh dihapus: penginput berhak, bulannya belum dikunci, dan slip TERAKHIR kantor (alokasi slip sesudahnya bergantung padanya). */
    private function bolehHapusModal(int $paymentId): bool
    {
        $p = DB::table('tb_capital_loan_payments as p')->join('tb_capital_loans as l', 'l.id', '=', 'p.tb_capital_loan_id')
            ->where('p.id', $paymentId)->first(['p.payment_date', 'l.branch_id']);
        if (!$p || !$this->bolehBayar((int) $p->branch_id)) {
            return false;
        }
        $periode = substr((string) $p->payment_date, 0, 7);
        if (DB::table('contribution_locks')->where('module', 'modal')->whereNull('branch_id')->where('period', $periode)->exists()) {
            return false;
        }
        $terakhir = DB::table('tb_capital_loan_payments as p')->join('tb_capital_loans as l', 'l.id', '=', 'p.tb_capital_loan_id')
            ->where('l.branch_id', $p->branch_id)->max('p.id');
        $slip = fn($id) => DB::table('tb_capital_loan_payments')->where('id', $id)->value(DB::raw('COALESCE(slip, id)'));

        return (string) $slip($terakhir) === (string) $slip($paymentId);
    }

    /** Hapus satu slip angsuran modal (semua barisnya); status pinjaman dihitung ulang dari sisa pokok. */
    public function hapusModal(int $id)
    {
        abort_unless($this->bolehHapusModal($id), 403, 'Slip ini tidak bisa dihapus (bukan slip terakhir / bulan dikunci / tanpa hak).');
        $slip = DB::table('tb_capital_loan_payments')->where('id', $id)->value('slip');
        $baris = DB::table('tb_capital_loan_payments')->when($slip, fn($q) => $q->where('slip', $slip), fn($q) => $q->where('id', $id))->get();

        DB::transaction(function () use ($baris) {
            DB::table('tb_capital_loan_payments')->whereIn('id', $baris->pluck('id'))->delete();
            foreach ($baris->pluck('tb_capital_loan_id')->unique() as $loanId) {
                $pokok = (int) DB::table('tb_capital_loans')->where('id', $loanId)->value('amount');
                $bayar = (int) DB::table('tb_capital_loan_payments')->where('tb_capital_loan_id', $loanId)->sum('amount_principal');
                DB::table('tb_capital_loans')->where('id', $loanId)->update(['status' => $pokok - $bayar > 0 ? 'active' : 'paid', 'updated_at' => now()]);
            }
        });

        $bukti = $baris->first()?->bukti_path;
        if ($bukti && !DB::table('tb_capital_loan_payments')->where('bukti_path', $bukti)->exists()) {
            Storage::disk(Unggahan::DISK)->delete($bukti);
        }

        return back()->with('message', 'Angsuran pinjaman modal dihapus.');
    }

    /**
     * Tambah pinjaman modal kantor aktif dengan bukti transfer masuk (mas 2026-10-22),
     * = app_laravel storeCapitalLoan: jenis selalu Pinjaman Modal (Modal Awal dicatat
     * pusat); sumber Pusat hanya bendahara (kasirpusat); kunci bulanan modal berlaku.
     */
    public function tambahModal(Request $request)
    {
        $branch = $this->kantor();
        abort_unless($this->bolehBayar($branch->id), 403, 'Input pinjaman modal untuk kasir, staf kontrol, pusat, dan superuser.');
        $data = $request->validate([
            'source' => ['required', 'in:' . implode(',', array_keys(self::SUMBER_MODAL))],
            'amount' => ['required', 'integer', 'min:1'],
            'loan_date' => ['required', 'date', 'before_or_equal:today'],
            'notes' => ['nullable', 'string', 'max:255'],
            'bukti' => array_merge(['required'], Unggahan::ATURAN),
        ], ['loan_date.before_or_equal' => 'Tanggal pinjaman tidak boleh di masa depan.'] + Unggahan::pesan('bukti'));
        abort_if($data['source'] === 'pusat' && !auth()->user()->can('kasirpusat'), 403, 'Pinjaman modal sumber Pusat hanya dicatat Bendahara.');

        $periode = substr((string) $data['loan_date'], 0, 7);
        if (DB::table('contribution_locks')->where('module', 'modal')->whereNull('branch_id')->where('period', $periode)->exists()) {
            throw ValidationException::withMessages(['amount' => "Pinjaman modal bulan {$periode} sudah dikunci kasir pusat."]);
        }

        // Baris dulu (id = nama file bukti), lalu unggah; gagal unggah -> baris batal.
        DB::transaction(function () use ($request, $branch, $data) {
            $id = DB::table('tb_capital_loans')->insertGetId([
            'branch_id' => $branch->id,
            'source' => $data['source'],
            'jenis' => JasaModal::PINJAMAN,
            'amount' => (int) $data['amount'],
            'loan_date' => $data['loan_date'],
            'status' => 'active',
            'notes' => $data['notes'] ?? null,
            'created_by' => auth()->id(),
            'created_at' => now(),
            'updated_at' => now(),
            ]);
            Unggahan::simpan($request->file('bukti'), rtrim(self::BUKTI_PINJAMAN, '/'), 'bukti', (string) $id);
        });

        return back()->with('message', 'Pinjaman modal dicatat.');
    }

    /** Bukti transfer pinjaman modal: nama tetap per id (tanpa kolom di tb_capital_loans, mas 2026-10-23). */
    private const BUKTI_PINJAMAN = 'modal-pinjaman-bukti/';

    /** Pratinjau pembagian satu nominal (JSON) - angka yang sama dengan yang disimpan bayarModal. */
    public function pratinjauModal(Request $request)
    {
        $branch = $this->kantor();
        abort_unless($this->bolehBayar($branch->id), 403);
        $data = $request->validate(['nominal' => ['required', 'integer', 'min:0'], 'payment_date' => ['required', 'date']]);
        [$pinjaman, $info, $hasil] = $this->bagiModal($branch->id, (int) $data['nominal'], $data['payment_date']);

        return response()->json([
            'rincian' => $pinjaman->filter(fn($l) => isset($hasil['bagian'][$l->id]))->values()->map(fn($l) => [
                'id' => $l->id,
                'label' => $this->labelPinjaman($l),
                'tempo' => $info[$l->id]['tempo'],
            ] + $hasil['bagian'][$l->id]),
            'lebih' => $hasil['lebih'],
        ]);
    }

    /** @return array{0:\Illuminate\Support\Collection,1:array,2:array} pinjaman aktif, info JasaModal, alokasi */
    private function bagiModal(int $branchId, int $nominal, string $tanggal): array
    {
        $pinjaman = DB::table('tb_capital_loans')->where('branch_id', $branchId)->where('status', 'active')
            ->where('loan_date', '<=', $tanggal)
            ->when(!auth()->user()->can('kasirpusat'), fn($q) => $q->where('source', '!=', 'pusat'))
            ->orderBy('loan_date')->orderBy('id')->get(['id', 'amount', 'loan_date', 'source', 'jenis']);
        $info = JasaModal::perPinjaman($pinjaman, $tanggal, $tanggal);

        return [$pinjaman, $info, JasaModal::alokasi($pinjaman, $info, $nominal)];
    }

    private function labelPinjaman(object $l): string
    {
        return ($l->jenis === JasaModal::MODAL_AWAL ? 'Modal Awal' : self::BUKU_MODAL[$l->source] ?? $l->source)
            . ' ' . Carbon::parse($l->loan_date)->locale('id')->isoFormat('D MMM YY');
    }

    /** Halaman detail Tabungan Goro Umrah kantor aktif: rekap per bulan setahun + semua setoran. */
    public function detailUmrah(Request $request)
    {
        abort_unless(\App\Helpers\AppHelper::bolehAdmKantor(auth()->user()), 403);
        $branch = $this->kantor();
        $tahun = $request->input('tahun');
        $tahunFilter = preg_match('/^\d{4}$/', (string) $tahun) ? (int) $tahun : null;

        $query = DB::table('goro_umroh_setoran as s')
            ->leftJoin('users as u', 'u.id', '=', 's.created_by')
            ->leftJoin('employees as e', 'e.id', '=', 'u.employee_id')
            ->where('s.branch_id', $branch->id);

        if ($tahunFilter) {
            $query->whereYear('s.tanggal', $tahunFilter);
        }

        $setoran = $query
            ->orderByDesc('s.tanggal')
            ->orderByDesc('s.id')
            ->get(['s.id', 's.tanggal', 's.amount', 's.notes', 's.bukti_path', DB::raw('COALESCE(e.nama_karyawan, u.username) as oleh')]);

        $tahunAda = DB::table('goro_umroh_setoran')
            ->where('branch_id', $branch->id)
            ->selectRaw('DISTINCT YEAR(tanggal) t')
            ->orderByDesc('t')
            ->pluck('t');

        $totalAkumulasi = (int) DB::table('goro_umroh_setoran')->where('branch_id', $branch->id)->sum('amount');
        $bulanTerkunci = DB::table('contribution_locks')
            ->where('module', 'goro')
            ->where('branch_id', $branch->id)
            ->pluck('period')
            ->all();
        $bolehHapus = $this->bolehBayar($branch->id);

        return \Inertia\Inertia::render('Kasir/Dashboard/GoroUmrah', [
            'unit' => $branch->unit,
            'wilayah' => $branch->wilayah,
            'tahun' => $tahunFilter ? (string) $tahunFilter : 'semua',
            'tahun_ada' => $tahunAda,
            'total' => $totalAkumulasi,
            'total_tampil' => (int) $setoran->sum('amount'),
            'can_manage' => $bolehHapus,
            'setoran' => $setoran->map(fn($x) => [
                'id' => $x->id,
                'tanggal' => Carbon::parse($x->tanggal)->toDateString(),
                'nominal' => (int) $x->amount,
                'catatan' => $x->notes,
                'oleh' => $x->oleh,
                'bukti' => $x->bukti_path ? route('dashboard.kasir.bukti', ['umrah', $x->id]) : null,
                'can_delete' => $bolehHapus && !in_array(substr((string) $x->tanggal, 0, 7), $bulanTerkunci),
            ]),
        ]);
    }

    /** Halaman detail Pinjaman Modal kantor aktif per sumber: daftar pinjaman + riwayat angsuran. */
    public function detailModal(Request $request)
    {
        abort_unless(\App\Helpers\AppHelper::bolehAdmKantor(auth()->user()), 403);
        $branch = $this->kantor();
        // Tab buku (= drawer app_laravel, mas 2026-10-21): Semua | Pusat | Hertawan | Sherly |
        // Modal Awal. Modal Awal hanya di bukunya sendiri, tidak di buku sumbernya.
        $buku = (string) $request->input('sumber');
        $buku = $buku === 'semua' || array_key_exists($buku, self::BUKU_MODAL) ? $buku : 'semua';

        $q = DB::table('tb_capital_loans')->where('branch_id', $branch->id);
        $pinjaman = ($buku === 'semua' ? $q : $this->pinjamanBuku($q, $buku))
            ->orderByDesc('loan_date')->orderByDesc('id')->get(['id', 'amount', 'loan_date', 'status', 'notes', 'source', 'jenis']);
        $info = JasaModal::perPinjaman($pinjaman, now());
        $bayar = DB::table('tb_capital_loan_payments as p')
            ->leftJoin('users as u', 'u.id', '=', 'p.created_by')
            ->leftJoin('employees as e', 'e.id', '=', 'u.employee_id')
            ->whereIn('p.tb_capital_loan_id', $pinjaman->pluck('id'))
            ->orderByDesc('p.payment_date')->orderByDesc('p.id')
            ->get(['p.id', 'p.tb_capital_loan_id', 'p.amount_principal', 'p.amount_jasa_modal', 'p.payment_date', 'p.notes', 'p.bukti_path', DB::raw('COALESCE(e.nama_karyawan, u.username) as oleh')]);
        $pokokPer = $bayar->groupBy('tb_capital_loan_id')->map(fn($g) => (int) $g->sum('amount_principal'));

        $daftar = $pinjaman->map(fn($l) => [
            'id' => $l->id,
            'tanggal' => Carbon::parse($l->loan_date)->toDateString(),
            'jumlah' => (int) $l->amount,
            'dibayar' => $pokokPer[$l->id] ?? 0,
            'sisa' => max(0, (int) $l->amount - ($pokokPer[$l->id] ?? 0)),
            'status' => $l->status,
            'catatan' => $l->notes,
            'jasa_wajib' => $info[$l->id]['wajib'], // bulan berjalan; Pusat selalu 0
            // Belum bulan ke-4 / Pusat (dan belum ada jasa dibayar bulan ini) -> jasa tidak ditampilkan.
            'jasa_berlaku' => $info[$l->id]['seharusnya'] > 0 || $info[$l->id]['dibayar'] > 0,
            'wajib_mulai' => $info[$l->id]['tempo'] ? JasaModal::wajibMulai($l->loan_date) : null,
            'sumber' => self::SUMBER_MODAL[$l->source] ?? $l->source,
            'jenis' => JasaModal::LABEL[$l->jenis] ?? $l->jenis,
            'bukti' => Unggahan::ada(self::BUKTI_PINJAMAN . $l->id) ? route('dashboard.kasir.bukti', ['pinjaman', $l->id]) : null,
        ]);

        return \Inertia\Inertia::render('Kasir/Dashboard/PinjamanModal', [
            'unit' => $branch->unit,
            'sumber' => $buku,
            'sumber_ada' => collect(['semua' => 'Semua'] + self::BUKU_MODAL)->map(fn($judul, $k) => ['kunci' => $k, 'judul' => $judul])->values(),
            // Form Tambah pinjaman modal: sumber yang boleh dipilih (Pusat hanya bendahara).
            'boleh_tambah' => $this->bolehBayar($branch->id),
            'sumber_tambah' => collect(self::SUMBER_MODAL)->except(auth()->user()->can('kasirpusat') ? [] : ['pusat'])
                ->map(fn($judul, $k) => ['kunci' => $k, 'judul' => $judul])->values(),
            'ringkas' => [
                'total_pinjaman' => (int) $daftar->sum('jumlah'),
                'total_pokok' => (int) $bayar->sum('amount_principal'),
                'total_jasa' => (int) $bayar->sum('amount_jasa_modal'),
                'sisa' => (int) $daftar->sum('sisa'),
                'jasa_wajib' => $daftar->contains('jasa_berlaku', true) ? (int) $daftar->sum('jasa_wajib') : null,
            ],
            'pinjaman' => $daftar,
            'angsuran' => $bayar->map(fn($p) => [
                'id' => $p->id,
                'pinjaman_id' => $p->tb_capital_loan_id,
                'tanggal' => Carbon::parse($p->payment_date)->toDateString(),
                'pokok' => (int) $p->amount_principal,
                'jasa' => (int) $p->amount_jasa_modal,
                'catatan' => $p->notes,
                'oleh' => $p->oleh,
                'bukti' => $p->bukti_path ? route('dashboard.kasir.bukti', ['modal', $p->id]) : null,
                // Hapus satu slip penuh (semua barisnya), hanya slip terakhir & bulan belum dikunci.
                'hapus' => $this->bolehHapusModal($p->id) ? route('dashboard.kasir.modal.destroy', $p->id) : null,
            ]),
        ]);
    }

    /** Foto bukti transfer (tb / bop / umrah / modal) kantor yang boleh diakses. */
    public function bukti(string $modul, int $id)
    {
        abort_unless(\App\Helpers\AppHelper::bolehAdmKantor(auth()->user()), 403);
        $tabel = ['tb' => 'tb_contributions', 'bop' => 'ops_bop_contributions', 'umrah' => 'goro_umroh_setoran', 'modal' => 'tb_capital_loan_payments', 'pinjaman' => 'tb_capital_loans'][$modul] ?? abort(404);
        $baris = DB::table($tabel)->find($id) ?? abort(404);
        if ($modul === 'pinjaman') {
            $baris->bukti_path = self::BUKTI_PINJAMAN . $baris->id;
        }
        if ($modul === 'modal') {
            $baris->branch_id = DB::table('tb_capital_loans')->where('id', $baris->tb_capital_loan_id)->value('branch_id');
        }
        $boleh = Branch::getAllowedBranchIds(auth()->user());
        abort_unless($boleh === null || in_array((int) $baris->branch_id, $boleh), 403, 'Anda tidak memiliki akses ke kantor ini.');

        return Unggahan::tampilkan($baris->bukti_path, 'File bukti tidak ditemukan.');
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
        $bolehHapus = $this->bolehBayar($branch->id) && !$this->terkunci($modul, $branch->id, $periode);
        $terakhirId = DB::table($tabel)->where('branch_id', $branch->id)
            ->orderByDesc('period')->orderByDesc('payment_date')->orderByDesc('id')->value('id');

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
            // Semua pembayaran bulan ini. Hapus = aturan TbContribution/BopContribution::destroy:
            // hanya transaksi terakhir kantor, bulannya belum dikunci.
            'riwayat' => (clone $baris)->orderByDesc('payment_date')->orderByDesc('id')
                ->get(['id', 'amount', 'payment_date', 'bukti_path'])
                ->map(fn($r) => [
                    'id' => $r->id,
                    'nominal' => (int) $r->amount,
                    'tanggal' => Carbon::parse($r->payment_date)->toDateString(),
                    'bukti' => $r->bukti_path ? route('dashboard.kasir.bukti', [$modul, $r->id]) : null,
                    'hapus' => $bolehHapus && $r->id === $terakhirId
                        ? route($modul === 'tb' ? 'tabungan.contributions.destroy' : 'bop.contributions.destroy', $r->id) : null,
                ]),
        ];
    }


    /** Pinjaman modal satu buku: sumber pusat/tawan/sherly TANPA modal awal, atau buku Modal Awal (semua sumber). */
    private function pinjamanBuku($query, string $buku)
    {
        return $buku === JasaModal::MODAL_AWAL
            ? $query->where('jenis', JasaModal::MODAL_AWAL)
            : $query->where('source', $buku)->where('jenis', '!=', JasaModal::MODAL_AWAL);
    }

    /**
     * Kartu Pinjaman Modal (satu kartu, mas 2026-10-21 revisi): per buku (Modal Awal, Hertawan,
     * Sherly, Pusat) sisa pokok + jasa 2% wajib bulan ini (null = belum ada yang lewat tempo /
     * Pusat) + bulan wajib pinjaman yang masih tempo; total jasa wajib & sisa; satu tombol Bayar.
     */
    private function modal(int $branchId, string $awal, string $akhir): array
    {
        $pinjaman = DB::table('tb_capital_loans')->where('branch_id', $branchId)->where('loan_date', '<=', $akhir)
            ->orderBy('loan_date')->orderBy('id')->get(['id', 'amount', 'loan_date', 'source', 'jenis']);
        $info = JasaModal::perPinjaman($pinjaman, $awal, $akhir);
        $aktif = $pinjaman->filter(fn($l) => $info[$l->id]['sisa'] > 0);
        $jasaAda = fn($l) => $info[$l->id]['seharusnya'] > 0 || $info[$l->id]['dibayar'] > 0;

        $urut = array_replace(array_flip([JasaModal::MODAL_AWAL, 'tawan', 'sherly', 'pusat']), self::BUKU_MODAL);
        $buku = collect($urut)->map(function ($judul, $kunci) use ($pinjaman, $aktif, $info, $jasaAda) {
            $isi = $pinjaman->filter(fn($l) => $kunci === JasaModal::MODAL_AWAL ? $l->jenis === JasaModal::MODAL_AWAL
                : $l->source === $kunci && $l->jenis !== JasaModal::MODAL_AWAL);
            $isiAktif = $aktif->intersectByKeys($isi);
            $tempo = $isiAktif->filter(fn($l) => $info[$l->id]['tempo']);

            return [
                'kunci' => $kunci,
                'judul' => $kunci === JasaModal::MODAL_AWAL ? $judul : str_replace('Pinjaman Modal', 'Pinjaman', $judul),
                'jumlah_aktif' => $isiAktif->count(),
                'sisa' => (int) $isiAktif->sum(fn($l) => $info[$l->id]['sisa']),
                'jasa_wajib' => $kunci !== 'pusat' && $isi->contains($jasaAda) ? (int) $isi->sum(fn($l) => $info[$l->id]['wajib']) : null,
                'tempo_sampai' => $tempo->isEmpty() ? null : JasaModal::wajibMulai($tempo->max('loan_date')),
            ];
        })->filter(fn($b) => $b['jumlah_aktif'] > 0 || $b['jasa_wajib'] !== null)->values();

        $bulanIni = DB::table('tb_capital_loan_payments as p')->join('tb_capital_loans as l', 'l.id', '=', 'p.tb_capital_loan_id')
            ->where('l.branch_id', $branchId)->whereBetween('p.payment_date', [$awal, $akhir]);

        return [
            'buku' => $buku,
            'jumlah_aktif' => $aktif->count(),
            'sisa' => (int) $aktif->sum(fn($l) => $info[$l->id]['sisa']),
            'jasa_wajib' => $pinjaman->contains($jasaAda) ? (int) $pinjaman->sum(fn($l) => $info[$l->id]['wajib']) : null,
            'pokok_bulan_ini' => (int) (clone $bulanIni)->sum('p.amount_principal'),
            'jasa_bulan_ini' => (int) (clone $bulanIni)->sum('p.amount_jasa_modal'),
            'terakhir' => ($t = (clone $bulanIni)->max('p.payment_date')) ? Carbon::parse($t)->toDateString() : null,
            'boleh_bayar' => $this->bolehBayar($branchId),
            'terkunci_modal' => DB::table('contribution_locks')->where('module', 'modal')->whereNull('branch_id')->where('period', substr($awal, 0, 7))->exists(),
            // Satu baris per slip (satu input kasir), bukti dari baris pertamanya.
            'riwayat' => (clone $bulanIni)->groupByRaw('COALESCE(p.slip, p.id)')
                ->selectRaw('MIN(p.id) id, SUM(p.amount_principal + p.amount_jasa_modal) nominal, MAX(p.payment_date) tanggal, MAX(p.bukti_path) bukti_path')
                ->orderByDesc('tanggal')->orderByDesc('id')->get()
                ->map(fn($r) => [
                    'id' => $r->id,
                    'nominal' => (int) $r->nominal,
                    'tanggal' => Carbon::parse($r->tanggal)->toDateString(),
                    'bukti' => $r->bukti_path ? route('dashboard.kasir.bukti', ['modal', $r->id]) : null,
                    'hapus' => $this->bolehHapusModal($r->id) ? route('dashboard.kasir.modal.destroy', $r->id) : null,
                ]),
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

        // Transaksi bulan ini. Hapus = SkswUnitController::hapus (batch bulan itu masih
        // terbuka, bukan data lama); mutasi cukup baris pertamanya (pasangannya ikut).
        $boleh = $this->bolehBayar($branchId);
        $mutasiPertama = [];
        $riwayat = \App\Models\SavingTransaction::with(['batch:id,status', 'rekening.employee:id,nama_karyawan'])
            ->where('branch_id', $branchId)->whereNull('voided_at')->whereBetween('transaction_date', [$awal, $akhir])
            ->orderBy('id')->get()
            ->map(function ($t) use ($boleh, &$mutasiPertama) {
                $pertama = !$t->mutasi_ref || !isset($mutasiPertama[$t->mutasi_ref]);
                if ($t->mutasi_ref) {
                    $mutasiPertama[$t->mutasi_ref] = true;
                }

                return [
                    'id' => $t->id,
                    'nominal' => (int) ($t->debit ?: $t->kredit),
                    'tanggal' => $t->transaction_date->toDateString(),
                    'keterangan' => trim(($t->rekening?->employee?->nama_karyawan ?? '') . ' · ' . $t->jenis . ($t->kredit > 0 ? ' keluar' : '')),
                    'hapus' => $boleh && $pertama && $t->batch_id && $t->batch?->status === 'open' ? route('sksw.hapus', $t->id) : null,
                ];
            })->reverse()->values();

        return [
            'saldo_sw' => $ambil('SW', 'saldo'),
            'saldo_sk' => $ambil('SK', 'saldo'),
            'masuk' => $ambil('SW', 'masuk') + $ambil('SK', 'masuk'),
            'keluar' => $ambil('SW', 'keluar') + $ambil('SK', 'keluar'),
            'riwayat' => $riwayat,
        ];
    }

    /**
     * Kendaraan aktif di kantor ini yang pajak (her) tahunannya sudah lewat atau jatuh tempo
     * <= 30 hari lagi (mas 2026-10-26). Selalu dihitung dari HARI INI, tidak ikut pilihan bulan.
     */
    private function pajakKendaraan(int $branchId): array
    {
        $hariIni = Carbon::today();

        return \App\Models\InvVehicle::query()
            ->with(['asset:id,name,status,category_id', 'asset.currentLocation']) // tanpa pilih kolom: latestOfMany join ke tabelnya sendiri -> 'asset_id' ambigu (prod 2026-10-26)
            ->whereHas('asset', fn($q) => $q->where('status', 'aktif')->where('category_id', \App\Models\InvCategory::KENDARAAN)
                ->whereHas('currentLocation', fn($l) => $l->where('branch_id', $branchId)))
            ->whereDate('tanggal_pajak_tahunan', '<=', $hariIni->copy()->addDays(30))
            ->orderBy('tanggal_pajak_tahunan')
            ->get()
            ->map(fn($v) => [
                'asset_id' => $v->asset_id,
                'plat' => $v->plat_nomor,
                'nama' => $v->asset?->name,
                'pengguna' => $v->asset?->currentLocation?->pengguna,
                'tanggal' => $v->tanggal_pajak_tahunan->toDateString(),
                'sisa_hari' => (int) $hariIni->diffInDays($v->tanggal_pajak_tahunan, false),
            ])->all();
    }

    /** Tabungan Goro Umrah (goro_umroh_setoran). */
    private function umrah(int $branchId, string $awal, string $akhir, string $periode): array
    {
        $bulanIni = DB::table('goro_umroh_setoran')->where('branch_id', $branchId)->whereBetween('tanggal', [$awal, $akhir]);
        $bolehHapus = $this->bolehBayar($branchId) && !$this->terkunci('goro', $branchId, $periode);

        return [
            'setoran_bulan_ini' => (int) (clone $bulanIni)->sum('amount'),
            'kali_bulan_ini' => (clone $bulanIni)->count(),
            'terkunci' => $this->terkunci('goro', $branchId, $periode),
            'total' => (int) DB::table('goro_umroh_setoran')->where('branch_id', $branchId)->where('tanggal', '<=', $akhir)->sum('amount'),
            'riwayat' => (clone $bulanIni)->orderByDesc('tanggal')->orderByDesc('id')
                ->get(['id', 'amount', 'tanggal', 'bukti_path'])
                ->map(fn($r) => [
                    'id' => $r->id,
                    'nominal' => (int) $r->amount,
                    'tanggal' => Carbon::parse($r->tanggal)->toDateString(),
                    'bukti' => $r->bukti_path ? route('dashboard.kasir.bukti', ['umrah', $r->id]) : null,
                    'hapus' => $bolehHapus ? route('dashboard.kasir.umrah.destroy', $r->id) : null,
                ]),
        ];
    }
}
