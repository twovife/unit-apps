<?php

namespace App\Http\Controllers;

use App\Helpers\AuthScope;
use App\Models\Branch;
use App\Models\Employee;
use App\Models\Employment;
use App\Models\JobApplication;
use App\Models\JobApplicationDocument;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

/**
 * Lamaran Kerja (mas 2026-10-13): kantor mencatat pelamar untuk cabang aktif
 * dan mengunggah dokumennya. Edit & hapus hanya selama masih menunggu.
 * Terima / tolak tetap di app_laravel (HRD). Tabel & izin `input-lamaran`
 * dipakai bersama app_laravel; aturan validasinya disamakan dengan di sana.
 */
class LamaranKerjaController extends Controller
{
    private const DISK = 's3';

    public function index(Request $request)
    {
        $branchId = $this->cabang();
        $status = (string) $request->input('status', JobApplication::MENUNGGU);

        $lamaran = JobApplication::with(['employment:id,jabatan', 'documents', 'referensi:id,nama_karyawan', 'creator.employee:id,nama_karyawan'])
            ->where('branch_input_id', $branchId)
            ->when(in_array($status, [JobApplication::MENUNGGU, JobApplication::DITERIMA, JobApplication::DITOLAK], true), fn($q) => $q->where('status', $status))
            ->when($status === 'selesai', fn($q) => $q->where('status', '!=', JobApplication::MENUNGGU))
            ->latest('tanggal_lamaran')->latest('id')
            ->limit(300)
            ->get()
            ->map(fn(JobApplication $a) => [
                'id' => $a->id,
                'nama' => $a->nama,
                'nik' => $a->nik,
                'no_hp' => $a->no_hp,
                'alamat' => $a->alamat,
                'tanggal_lamaran' => $a->tanggal_lamaran?->toDateString(),
                'employment_id' => $a->employment_id,
                'employment' => $a->employment?->jabatan,
                'referensi_employee_id' => $a->referensi_employee_id,
                'referensi' => $a->referensi?->nama_karyawan,
                'catatan' => $a->catatan,
                'status' => $a->status,
                'alasan_tolak' => $a->alasan_tolak,
                'diinput_oleh' => $a->creator?->employee?->nama_karyawan ?? $a->creator?->username,
                'dokumen' => $a->documents->map(fn(JobApplicationDocument $d) => [
                    'id' => $d->id,
                    'type' => $d->type,
                    'url' => route('administrasi.lamaran.dokumen', [$a->id, $d->id]),
                ])->values(),
            ]);

        $jumlah = JobApplication::where('branch_input_id', $branchId)
            ->selectRaw("SUM(status = 'menunggu') menunggu, SUM(status <> 'menunggu') selesai, COUNT(*) semua")
            ->first();

        return Inertia::render('Administrasi/Lamaran/Index', [
            'lamaran' => $lamaran,
            'jumlah' => [
                'menunggu' => (int) ($jumlah->menunggu ?? 0),
                'selesai' => (int) ($jumlah->selesai ?? 0),
                'semua' => (int) ($jumlah->semua ?? 0),
            ],
            'filter' => ['status' => $status],
            'unit' => Branch::whereKey($branchId)->value('unit'),
            'jabatan' => Employment::orderBy('jabatan')->get(['id', 'jabatan']),
            'referensi' => Employee::where('branch_id', $branchId)->whereNull('date_resign')->orderBy('nama_karyawan')->get(['id', 'nama_karyawan']),
            'jenis_dokumen' => JobApplication::DOC_TYPES,
            'video' => \App\Helpers\VideoTutorial::url('lamaran')['lamaran'] ?? null,
        ]);
    }

    /** Cek NIK sebelum mencatat: karyawan aktif / mantan / pernah melamar (JSON). */
    public function cekNik(Request $request)
    {
        $this->pastikanBoleh();
        $nik = (string) $request->validate(['nik' => ['required', 'digits_between:15,16']])['nik'];
        $karyawan = Employee::with('branch:id,unit')->where('nik', $nik)->first();

        return response()->json([
            'aktif' => $karyawan && $karyawan->date_resign === null
                ? ['nama' => $karyawan->nama_karyawan, 'kantor' => $karyawan->branch?->unit] : null,
            'mantan' => $karyawan && $karyawan->date_resign !== null
                ? ['nama' => $karyawan->nama_karyawan, 'kantor' => $karyawan->branch?->unit, 'resign' => (string) $karyawan->date_resign] : null,
            'lamaran' => JobApplication::where('nik', $nik)
                ->when($request->integer('kecuali'), fn($q, int $id) => $q->whereKeyNot($id))
                ->latest('tanggal_lamaran')->get()
                ->map(fn($a) => [
                    'tanggal' => $a->tanggal_lamaran?->toDateString(),
                    'kantor' => Branch::whereKey($a->branch_input_id)->value('unit'),
                    'status' => $a->status,
                ]),
        ]);
    }

    public function store(Request $request)
    {
        $branchId = $this->cabang();
        $data = $this->validasi($request);
        $this->pastikanBukanKaryawanAktif($data['nik']);

        JobApplication::create($data + [
            'branch_input_id' => $branchId,
            'status' => JobApplication::MENUNGGU,
            'created_by' => auth()->id(),
        ]);

        return back()->with('message', 'Lamaran dicatat.');
    }

    public function update(Request $request, JobApplication $lamaran)
    {
        $this->pastikanMilikCabang($lamaran);
        $this->pastikanMenunggu($lamaran);
        $data = $this->validasi($request);
        $this->pastikanBukanKaryawanAktif($data['nik']);

        $lamaran->update($data);

        return back()->with('message', 'Lamaran diperbarui.');
    }

    /** Hapus beserta file-nya, hanya selama masih menunggu keputusan HRD. */
    public function destroy(JobApplication $lamaran)
    {
        $this->pastikanMilikCabang($lamaran);
        $this->pastikanMenunggu($lamaran);

        $berkas = $lamaran->documents()->pluck('file_path')->filter()->all();
        $lamaran->documents()->delete();
        $lamaran->delete();

        if ($berkas) {
            try {
                Storage::disk(self::DISK)->delete($berkas);
            } catch (\Throwable $e) {
                Log::warning('Berkas lamaran gagal dihapus: ' . $e->getMessage(), ['berkas' => $berkas]);
            }
        }

        return back()->with('message', 'Lamaran dihapus.');
    }

    /** Unggah satu dokumen; tiap jenis sekali (sama dengan app_laravel). */
    public function unggahDokumen(Request $request, JobApplication $lamaran)
    {
        $this->pastikanMilikCabang($lamaran);
        $this->pastikanMenunggu($lamaran);

        $val = $request->validate([
            'type' => ['required', Rule::in(JobApplication::DOC_TYPES)],
            'file' => ['required', 'file', 'mimes:jpeg,png,jpg,pdf', 'max:5120'],
        ], [
            'file.mimes' => 'File harus berupa gambar (JPEG, PNG) atau PDF.',
            'file.max' => 'Ukuran file maksimal 5MB.',
        ]);

        if ($lamaran->documents()->where('type', $val['type'])->exists()) {
            throw ValidationException::withMessages(['type' => 'Dokumen ini sudah diunggah dan tidak bisa diganti.']);
        }

        try {
            $path = $request->file('file')->store("documents/applicants/{$lamaran->id}", self::DISK);
        } catch (\Throwable $e) {
            Log::error('Unggah dokumen lamaran gagal: ' . $e->getMessage(), ['lamaran' => $lamaran->id]);
            $path = false;
        }
        if (!$path) {
            return back()->withErrors('Gagal menyimpan file ke server penyimpanan.');
        }

        $lamaran->documents()->create(['type' => $val['type'], 'file_path' => $path]);

        return back()->with('message', 'Dokumen diunggah.');
    }

    /** Tampilkan dokumen (lewat server, hak akses dicek dulu). */
    public function lihatDokumen(JobApplication $lamaran, JobApplicationDocument $dokumen)
    {
        $this->pastikanMilikCabang($lamaran);
        abort_unless((int) $dokumen->application_id === (int) $lamaran->id, 404);

        $disk = Storage::disk(self::DISK);
        abort_unless($dokumen->file_path && $disk->exists($dokumen->file_path), 404, 'File tidak ditemukan di server penyimpanan.');

        return response($disk->get($dokumen->file_path), 200, [
            'Content-Type' => $disk->mimeType($dokumen->file_path) ?: 'application/octet-stream',
            'Content-Disposition' => 'inline; filename="' . addslashes(basename($dokumen->file_path)) . '"',
            'Cache-Control' => 'private, max-age=86400',
        ]);
    }

    private function validasi(Request $request): array
    {
        return $request->validate([
            'nama' => ['required', 'string', 'max:100'],
            'nik' => ['required', 'digits_between:15,16'],
            'no_hp' => ['nullable', 'string', 'max:20'],
            'alamat' => ['required', 'string', 'max:255'],
            'tanggal_lamaran' => ['required', 'date', 'before_or_equal:today'],
            'employment_id' => ['nullable', 'exists:employments,id'],
            'referensi_employee_id' => ['nullable', 'exists:employees,id'],
            'catatan' => ['nullable', 'string', 'max:1000'],
        ], [
            'nik.digits_between' => 'NIK 15-16 digit angka.',
            'tanggal_lamaran.before_or_equal' => 'Tanggal lamaran tidak boleh di masa depan.',
        ]);
    }

    private function pastikanBoleh(): void
    {
        abort_unless(auth()->user()?->can('input-lamaran'), 403, 'Anda tidak punya hak mencatat lamaran.');
    }

    /** Cabang aktif (filter cabang global), dan harus cabang yang boleh diakses. */
    private function cabang(): int
    {
        $this->pastikanBoleh();
        $branchId = (int) AuthScope::resolve()->branch_id;
        $boleh = Branch::getAllowedBranchIds(auth()->user());
        abort_unless($boleh === null || in_array($branchId, $boleh), 403, 'Cabang ini bukan cabang Anda.');

        return $branchId;
    }

    private function pastikanMilikCabang(JobApplication $lamaran): void
    {
        $this->pastikanBoleh();
        $boleh = Branch::getAllowedBranchIds(auth()->user());
        abort_unless($boleh === null || in_array((int) $lamaran->branch_input_id, $boleh), 403, 'Lamaran ini bukan cabang Anda.');
    }

    private function pastikanMenunggu(JobApplication $lamaran): void
    {
        abort_unless($lamaran->status === JobApplication::MENUNGGU, 422, 'Lamaran sudah diputuskan HRD dan tidak bisa diubah.');
    }

    private function pastikanBukanKaryawanAktif(string $nik): void
    {
        $aktif = Employee::with('branch:id,unit')->where('nik', $nik)->whereNull('date_resign')->first();
        if ($aktif) {
            throw ValidationException::withMessages([
                'nik' => "NIK milik karyawan aktif {$aktif->nama_karyawan} ({$aktif->branch?->unit}) — tidak bisa diinput sebagai pelamar. Mohon hubungi STAF PUSAT / IT.",
            ]);
        }
    }
}
