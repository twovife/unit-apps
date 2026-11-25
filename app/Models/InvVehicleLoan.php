<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/** Kontrak angsuran motor (mas 2026-11-19): angsuran tetap x tenor bulan. Bukan pembukuan kas. */
class InvVehicleLoan extends Model
{
    public const BERJALAN = 'berjalan';
    public const LUNAS = 'lunas';

    protected $fillable = ['asset_id', 'branch_id', 'angsuran', 'tenor', 'total_harga', 'status', 'lunas_at', 'catatan', 'user_id'];

    protected $casts = [
        'angsuran' => 'integer',
        'tenor' => 'integer',
        'total_harga' => 'integer',
        'lunas_at' => 'date:Y-m-d',
    ];

    /**
     * Catat kontrak dari input awal / kendaraan baru / tambah motor (satu sumber).
     * $b: lunas=true (penanda "tidak ada angsuran"), atau angsuran, tenor, terbayar (>=1),
     * tanggal_terakhir -> angsuran ke-n tanggal itu, ke-(n-1) sebulan sebelumnya, dst.
     * Penanda "tidak ada angsuran" yang lama diganti kontrak baru; kontrak berjalan ditolak.
     *
     * @throws \RuntimeException pesan untuk user
     */
    public static function catatAwal(int $assetId, int $branchId, array $b, string $ref, ?array $buktiTerakhir = null): void
    {
        $ada = self::where('asset_id', $assetId)->lockForUpdate()->get();
        if ($ada->contains('status', self::BERJALAN)) {
            throw new \RuntimeException('Kendaraan ini sudah punya angsuran berjalan.');
        }
        if (! empty($b['lunas'])) {
            if ($ada->isNotEmpty()) {
                throw new \RuntimeException('Kendaraan ini sudah diinput.');
            }
            self::create([
                'asset_id' => $assetId, 'branch_id' => $branchId, 'angsuran' => 0, 'tenor' => 0, 'total_harga' => 0,
                'status' => self::LUNAS, 'lunas_at' => now()->toDateString(),
                'catatan' => 'Tidak ada angsuran / sudah lunas (input awal)', 'user_id' => auth()->id(),
            ]);

            return;
        }
        $ada->where('tenor', 0)->each->delete();

        $loan = self::create([
            'asset_id' => $assetId,
            'branch_id' => $branchId,
            'angsuran' => (int) $b['angsuran'],
            'tenor' => (int) $b['tenor'],
            'total_harga' => (int) $b['angsuran'] * (int) $b['tenor'],
            'status' => self::BERJALAN,
            'user_id' => auth()->id(),
        ]);
        $akhir = \Carbon\Carbon::parse($b['tanggal_terakhir']);
        for ($ke = 1; $ke <= (int) $b['terbayar']; $ke++) {
            $tgl = $akhir->copy()->subMonthsNoOverflow((int) $b['terbayar'] - $ke);
            $loan->payments()->create([
                'angsuran_ke' => $ke,
                'periode' => $tgl->copy()->startOfMonth()->toDateString(),
                'tanggal_bayar' => $tgl->toDateString(),
                'nominal' => (int) $b['angsuran'],
                // Bukti transfer terakhir (wajib di input awal) menempel di angsuran terakhir.
                'bukti_path' => $ke === (int) $b['terbayar'] ? $buktiTerakhir : null,
                'sumber' => 'awal',
                'batch_ref' => $ref,
                'user_id' => auth()->id(),
            ]);
        }
        // Angsuran ke = tenor: sudah lunas sejak tanggal pembayaran itu (riwayat tetap tercatat).
        if ((int) $b['terbayar'] === (int) $b['tenor']) {
            $loan->update(['status' => self::LUNAS, 'lunas_at' => $akhir->toDateString()]);
        }
    }

    /** Aturan isian kontrak (dipakai input awal & form kendaraan baru). */
    public static function aturan(): array
    {
        return [[
            'angsuran' => ['required', 'integer', 'min:1000'],
            'tenor' => ['required', 'integer', 'min:2', 'max:120'],
            'terbayar' => ['required', 'integer', 'min:1', 'lte:tenor'],
            'tanggal_terakhir' => ['required', 'date', 'before_or_equal:today'],
        ], [
            'angsuran.required' => 'Angsuran wajib diisi.',
            'angsuran.min' => 'Angsuran minimal Rp 1.000.',
            'tenor.required' => 'Tenor wajib diisi.',
            'tenor.min' => 'Tenor minimal 2 bulan.',
            'terbayar.required' => 'Angsuran ke wajib diisi.',
            'terbayar.min' => 'Angsuran ke minimal 1.',
            'terbayar.lte' => 'Angsuran ke tidak boleh melebihi tenor.',
            'tanggal_terakhir.required' => 'Tanggal pembayaran wajib diisi.',
            'tanggal_terakhir.before_or_equal' => 'Tanggal pembayaran tidak boleh di masa depan.',
        ]];
    }

    public function asset(): BelongsTo
    {
        return $this->belongsTo(InvAsset::class, 'asset_id');
    }

    public function payments(): HasMany
    {
        return $this->hasMany(InvVehicleLoanPayment::class, 'loan_id');
    }
}
