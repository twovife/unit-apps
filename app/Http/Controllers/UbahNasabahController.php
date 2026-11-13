<?php

namespace App\Http\Controllers;

use App\Models\TransactionCustomer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

/**
 * Ubah Data Nasabah (superuser): nama, NIK, No KK, alamat KTP di transaction_customers.
 * Cari dengan NIK persis; NIK dobel (data lama) tampil semua untuk dipilih. Rekening
 * (transaction_manage_customers) hanya dibaca; domisili per rekening tidak disentuh.
 * Tiap simpan dicatat ke laravel.log (siapa, kapan, lama, baru).
 * Rancangan: .agents/handoff_2026-10-15.md "menu Ubah Data Nasabah".
 */
class UbahNasabahController extends Controller
{
    private function pastikanSuperuser(): void
    {
        abort_unless(auth()->user()->hasRole('superuser'), 403, 'Ubah data nasabah hanya untuk superuser.');
    }

    public function index(Request $request)
    {
        $this->pastikanSuperuser();
        $nik = preg_replace('/\D/', '', (string) $request->input('nik'));

        $nasabah = $nik === '' ? collect() : TransactionCustomer::where('nik', $nik)
            ->with(['manage_customer.loan_officer_grouping.branch:id,unit', 'manage_customer.latestTransaction', 'manage_customer' => fn($q) => $q->withCount('loan')])
            ->orderBy('id')->get();
        // Lunas = aturan Daftar Nasabah: pay_off_date terisi atau saldo <= 0 (pinjaman terakhir rekening).
        $terakhir = $nasabah->flatMap(fn($c) => $c->manage_customer->pluck('latestTransaction'))->filter();
        $saldo = $terakhir->isEmpty() ? [] : \App\Helpers\PenyesuaianSaldo::saldoBanyak($terakhir->pluck('id')->all());

        $hasil = $nasabah->map(fn($c) => [
                'id' => $c->id,
                'nama' => $c->nama,
                'nik' => $c->nik,
                'no_kk' => $c->no_kk,
                'alamat' => $c->alamat,
                'rekening' => $c->manage_customer->map(fn($m) => [
                    'id' => $m->id,
                    'kantor' => $m->loan_officer_grouping?->branch?->unit,
                    'kelompok' => $m->loan_officer_grouping?->kelompok,
                    // manage_customers.day campur angka & nama hari: hari pinjaman terakhir lebih andal.
                    'hari' => $m->latestTransaction?->hari ?? $m->day,
                    'nomor_anggota' => $m->nomor_anggota,
                    'jumlah_pinjaman' => $m->loan_count,
                    'drop_terakhir' => ($l = $m->latestTransaction)?->drop_date ? \Carbon\Carbon::parse($l->drop_date)->toDateString() : null,
                    'lunas' => $l ? (bool) ($l->pay_off_date || ($saldo[$l->id]['saldo'] ?? 0) <= 0) : null,
                    'tanggal_lunas' => $l?->pay_off_date ? \Carbon\Carbon::parse($l->pay_off_date)->toDateString() : null,
                ])->values(),
            ]);

        return Inertia::render('Admin/UbahNasabah', ['nik' => $nik, 'hasil' => $hasil]);
    }

    public function simpan(Request $request, TransactionCustomer $nasabah)
    {
        $this->pastikanSuperuser();
        $data = $request->validate([
            'nama' => ['required', 'string', 'max:255'],
            'nik' => ['required', 'digits:16'],
            'no_kk' => ['nullable', 'digits:16'],
            'alamat' => ['nullable', 'string', 'max:255'],
        ], [
            'nik.digits' => 'NIK harus 16 digit angka.',
            'no_kk.digits' => 'No KK harus 16 digit angka.',
        ]);

        // Hanya NIK yang BERUBAH yang dicek bentrok: NIK dobel lama tetap bisa diubah
        // nama / KK / alamatnya tanpa terhalang kembarannya.
        if ($data['nik'] !== (string) $nasabah->nik
            && TransactionCustomer::where('nik', $data['nik'])->whereKeyNot($nasabah->id)->exists()) {
            throw ValidationException::withMessages(['nik' => "NIK {$data['nik']} sudah dipakai nasabah lain."]);
        }

        $lama = $nasabah->only(['nama', 'nik', 'no_kk', 'alamat']);
        $nasabah->update($data);
        Log::info('Ubah data nasabah', [
            'user_id' => auth()->id(),
            'transaction_customer_id' => $nasabah->id,
            'lama' => $lama,
            'baru' => $nasabah->only(['nama', 'nik', 'no_kk', 'alamat']),
        ]);

        return redirect()->route('ubah_nik.index', ['nik' => $nasabah->nik])->with('message', 'Data nasabah disimpan.');
    }
}
