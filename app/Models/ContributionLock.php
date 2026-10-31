<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Validation\ValidationException;

/**
 * Kunci bulanan per kantor untuk iuran 1 Juta, iuran BOP dan setoran Goro.
 * Mengunci: staf kontrol (kantor zonanya) dan pusat/superuser (semua kantor).
 * Membuka: hanya kasir pusat. Selama terkunci, iuran bulan itu tidak bisa ditambah maupun dihapus.
 *
 * @property int $id
 * @property string $module
 * @property int $branch_id
 * @property string $period
 * @property int|null $locked_by
 */
class ContributionLock extends Model
{
    public const MODULES = ['tb', 'bop', 'goro'];
    public const MODAL = 'modal';

    protected $fillable = ['module', 'branch_id', 'period', 'locked_by'];

    /** @return BelongsTo<User, $this> */
    public function locker(): BelongsTo
    {
        return $this->belongsTo(User::class, 'locked_by');
    }

    public static function terkunci(string $module, int $branchId, string $period): bool
    {
        return static::where('module', $module)->where('period', $period)->where('branch_id', $branchId)->exists();
    }

    /**
     * Bulan yang terkunci untuk satu kantor (untuk menyembunyikan tombol hapus di riwayat).
     *
     * @return list<string>
     */
    public static function bulanTerkunci(string $module, int $branchId): array
    {
        return array_values(array_map('strval', static::where('module', $module)->where('branch_id', $branchId)->pluck('period')->all()));
    }

    /** Tolak tambah/hapus iuran di bulan yang terkunci. */
    public static function pastikanTerbuka(string $module, int $branchId, string $period, string $field = 'amount'): void
    {
        if (static::terkunci($module, $branchId, $period)) {
            $label = match ($module) {
                'tb' => 'Iuran Tabungan 1 Juta',
                'bop' => 'Iuran BOP',
                'goro' => 'Tabungan Goro Umrah',
                default => 'Iuran/setoran',
            };
            throw ValidationException::withMessages([
                $field => "{$label} bulan {$period} untuk kantor ini sudah dikunci staf kontrol. Minta kasir pusat membuka kuncinya.",
            ]);
        }
    }
}
