# Rombak Resort — Tahap 1 (Fondasi) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sesudah tahap ini, satu pinjaman yang dipindah resort lewat `Mutasi::catat` tampil di kelompok/hari baru untuk bulan berlaku dan sesudahnya, tapi tetap di kelompok/hari lama untuk bulan sebelumnya — di semua pembaca yang terdaftar di rancangan §8.2.

**Architecture:** Cara B (timpa + catat). `Mutasi::catat` menimpa kolom `transaction_loan_officer_grouping_id` + `hari` pinjaman dan mencatat baris `transaction_loan_mutations`. Pembaca bulan lalu memakai helper baru `Mutasi::kelompokSql` / `hariSql` / `saring` yang membalik catatan ("kelompok PADA tanggal X = asal mutasi paling awal yang berlaku sesudah X, kalau tidak ada kolom pinjaman"). Selama tabel mutasi kosong, helper mengembalikan kolom pinjaman apa adanya — SQL identik dengan sekarang.

**Tech Stack:** Laravel 12, MariaDB 10.11, Inertia/React (tidak disentuh di tahap ini).

**Spec:** `.agents/rombak_resort.md`

## Global Constraints

- Migrasi hanya ditulis & dijalankan dari **app_laravel**: `docker exec laravel-app php artisan migrate --force`. Tidak pernah dari unit-apps.
- **Jangan jalankan `php artisan test`** (phpunit). Pengujian = skrip tinker di DB lokal, dibungkus transaksi yang di-rollback.
- DB lokal (`laravel-db`, `ubmi_db`) = salinan prod 2026-11-02 14:16. Boleh diubah; prod tidak disentuh sama sekali.
- Tidak commit `.agents/*`, `public/build`, `bootstrap/ssr`, `graphify-out`. Stage berkas per nama.
- Commit, push, tag = panggilan terpisah; push/tag/deploy hanya kalau mas minta.
- Pesan commit diakhiri `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Perubahan tabel bersama → kabari sesi applaravel (SendMessage).
- Gaya kode: komentar Bahasa Indonesia, 2 spasi indent di Traits/Controllers, 4 spasi di Helpers (ikuti berkas yang disentuh).

## Peta berkas

| Berkas | Tanggung jawab | Task |
|---|---|---|
| `../app_laravel/database/migrations/2026_11_03_100000_create_rombak_resort_tables.php` (baru) | 2 tabel rombak + `rombak_id` di mutasi | 1 |
| `app/Models/TransactionLoanMutation.php` | `rombak_id` fillable | 1 |
| `app/Helpers/Mutasi.php` | helper "kelompok pada tanggal", `catat` jadi timpa+catat | 2 |
| `scripts/cek_rombak_tahap1.php` (baru) | satu-satunya cek runnable tahap ini | 2–5 |
| `app/Helpers/HitungAgregat.php` | `drop`, `portofolio`, `saldoMasuk` pakai helper | 3 |
| `app/Traits/RekapTrait.php` | 5 kueri drop pakai helper | 4 |
| `app/Traits/PinjamanTrait.php`, `app/Http/Controllers/TransactionLoanController.php` | daftar pinjaman per bulan pakai helper | 5 |
| `app/Http/Controllers/MutasiNasabahController.php`, `resources/js/Pages/Admin/MutasiNasabah.jsx`, `routes/web.php`, `resources/js/Components/Sidebar.jsx`, `app/Http/Controllers/MigrasiController.php` | cabut menu Mutasi Nasabah lama (arah arus) | 6 |
| (laporan) | sapu ulang + periksa app_laravel | 7 |

---

### Task 1: Migrasi tabel rombak (app_laravel)

**Files:**
- Create: `/home/supermario/projects/app_laravel/database/migrations/2026_11_03_100000_create_rombak_resort_tables.php`
- Modify: `app/Models/TransactionLoanMutation.php` (fillable)

**Interfaces:**
- Produces: tabel `transaction_resort_rombaks`, `transaction_resort_rombak_peta`, kolom `transaction_loan_mutations.rombak_id` (nullable). Dipakai tahap 2.

Prod terakhir: `2026_10_29_100000_add_pindah_sisa_to_tb_capital_loans` — semua berkas app_laravel sudah di prod, jadi berkas baru ini sah (aturan "satu migrasi terbaru": migrasi berikutnya yang belum rilis digabung ke berkas ini).

- [ ] **Step 1: Tulis migrasi**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Rombak resort (unit-apps .agents/rombak_resort.md, 2026-11-02).
 * Satu rombak = peta resort asal (kelompok, hari) -> resort tujuan untuk satu
 * kantor, berlaku mulai tanggal 1 bulan tertentu. Saat diterapkan, kolom
 * kelompok & hari pinjaman ditimpa dan tiap pinjaman dicatat di
 * transaction_loan_mutations (rombak_id) supaya bulan lalu tetap terbaca
 * dengan susunan lama dan rombak bisa dibatalkan.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transaction_resort_rombaks', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('branch_id');
            $table->date('berlaku_bulan');
            $table->string('status', 12)->default('draf'); // draf | diterapkan | dibatalkan
            $table->string('catatan')->nullable();
            $table->json('ringkasan')->nullable(); // preview saat diterapkan + target_lama per resort tujuan
            $table->unsignedBigInteger('dibuat_oleh');
            $table->unsignedBigInteger('diterapkan_oleh')->nullable();
            $table->timestamp('diterapkan_at')->nullable();
            $table->unsignedBigInteger('dibatalkan_oleh')->nullable();
            $table->timestamp('dibatalkan_at')->nullable();
            $table->timestamps();
            $table->index(['branch_id', 'berlaku_bulan', 'status'], 'trr_kantor_bulan_idx');
        });

        Schema::create('transaction_resort_rombak_peta', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rombak_id')->constrained('transaction_resort_rombaks')->cascadeOnDelete();
            $table->unsignedBigInteger('dari_grouping_id');
            $table->string('dari_hari', 10);
            $table->unsignedBigInteger('ke_grouping_id');
            $table->string('ke_hari', 10);
            // Satu resort asal hanya ke satu tujuan.
            $table->unique(['rombak_id', 'dari_grouping_id', 'dari_hari'], 'trrp_asal_unik');
        });

        Schema::table('transaction_loan_mutations', function (Blueprint $table) {
            $table->unsignedBigInteger('rombak_id')->nullable()->after('transaction_loan_id')->index();
        });
    }

    public function down(): void
    {
        Schema::table('transaction_loan_mutations', function (Blueprint $table) {
            $table->dropIndex(['rombak_id']);
            $table->dropColumn('rombak_id');
        });
        Schema::dropIfExists('transaction_resort_rombak_peta');
        Schema::dropIfExists('transaction_resort_rombaks');
    }
};
```

- [ ] **Step 2: Jalankan di lokal (container app_laravel)**

Run: `docker exec laravel-app php artisan migrate --force`
Expected: `2026_11_03_100000_create_rombak_resort_tables ... DONE`

- [ ] **Step 3: Cek skema**

Run: `docker exec laravel-db sh -c 'mariadb -ularavel -psecret ubmi_db -e "show columns from transaction_loan_mutations like \"rombak_id\"; show tables like \"transaction_resort_rombak%\""'`
Expected: kolom `rombak_id bigint(20) unsigned YES`, dua tabel.

- [ ] **Step 4: Uji rollback migrasi lalu migrate lagi**

Run: `docker exec laravel-app php artisan migrate:rollback --step=1 --force && docker exec laravel-app php artisan migrate --force`
Expected: keduanya DONE tanpa error.

- [ ] **Step 5: Tambah `rombak_id` ke fillable model unit-apps**

`app/Models/TransactionLoanMutation.php`, di `$fillable` sesudah `'transaction_loan_id',`:

```php
        'rombak_id',
```

- [ ] **Step 6: Commit (dua repo, terpisah)**

```bash
git -C /home/supermario/projects/app_laravel add database/migrations/2026_11_03_100000_create_rombak_resort_tables.php
git -C /home/supermario/projects/app_laravel commit -m "Rombak resort: tables for resort remap drafts and rombak_id on loan mutations

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

```bash
git add app/Models/TransactionLoanMutation.php
git commit -m "Loan mutation: rombak_id fillable

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

- [ ] **Step 7: Kabari sesi applaravel** (SendMessage): migrasi baru `2026_11_03_100000_create_rombak_resort_tables` (2 tabel baru + kolom `rombak_id` di `transaction_loan_mutations`), belum untuk prod, jangan dijalankan di prod.

---

### Task 2: Helper `Mutasi` dibalik — "kelompok pada tanggal" + `catat` timpa

**Files:**
- Modify: `app/Helpers/Mutasi.php` (ganti `ekspresiEfektifSql`, `ekspresiHariEfektifSql`, `kelompokEfektif`, `hariEfektif`, `penyesuaianBaca`, `catat`; docblock kelas)
- Create: `scripts/cek_rombak_tahap1.php`

**Interfaces:**
- Produces (dipakai Task 3–5 dan tahap 2):
  - `Mutasi::tgl($tanggal): string` — tanggal (string/Carbon) → literal SQL ter-quote `'Y-m-d'`.
  - `Mutasi::kelompokSql(string $alias, string $refSql): string` — ekspresi SQL kelompok pinjaman `$alias` PADA tanggal `$refSql` (literal dari `tgl()` atau kolom seperti `'l.drop_date'`). Tabel mutasi kosong → `"$alias.transaction_loan_officer_grouping_id"` persis.
  - `Mutasi::hariSql(string $alias, string $refSql): string` — sama untuk hari, sudah `LOWER(...)`. Kosong → `"LOWER($alias.hari)"`.
  - `Mutasi::saring($query, string $alias, array $groupingIds, string $refSql, ?string $hari = null): void` — saring pinjaman yang PADA `$refSql` ada di `$groupingIds` (dan `$hari` kalau diisi). Kosong → `whereIn` (+ `where hari`) persis seperti sekarang.
  - `Mutasi::penyesuaianBaca(int $groupingId, string $hari, $ref): array{masuk:int[], keluar:int[]}` — tanda tangan tetap, arti dibalik.
  - `Mutasi::catat(TransactionLoan $loan, int $keGroupingId, ?string $keHari, $berlakuBulan, ?string $alasan, $user, ?int $rombakId = null): TransactionLoanMutation` — menimpa pinjaman + mencatat.

Aturan baru `catat` (tambahan rancangan, dilaporkan ke mas): `berlaku_bulan` **harus bulan berjalan**. Menimpa sebelum bulan M tiba akan memindah sisa bulan sebelumnya; sesudah M lewat, bulan M mungkin sudah ditutup.

- [ ] **Step 1: Tulis cek yang gagal**

`scripts/cek_rombak_tahap1.php` (dijalankan lewat tinker; semua tulis di-rollback):

```php
// Cek tahap 1 rombak resort (tanpa <?php: isinya disuapkan ke tinker). Jalankan:
//   tr '\n' ' ' < scripts/cek_rombak_tahap1.php | docker exec -i unit-app php artisan tinker
// Semua perubahan di-rollback. Hanya untuk DB lokal (salinan prod).
(function () {
    $gagal = 0;
    $cek = function (bool $ok, string $pesan) use (&$gagal) {
        echo ($ok ? "\nOK    " : "\nGAGAL ") . $pesan;
        $ok || $gagal++;
    };
    $M = \App\Helpers\Mutasi::class;
    $bulanIni = now()->startOfMonth()->toDateString();
    $bulanLalu = now()->startOfMonth()->subMonth()->toDateString();
    $akhirBulanLalu = now()->startOfMonth()->subDay()->toDateString();
    $kantor = range(1221, 1230); // Sidoarjo 5, kel 1..10

    DB::beginTransaction();
    try {
        // 1. Tabel kosong -> SQL kolom asli persis.
        $cek(\App\Models\TransactionLoanMutation::count() === 0, 'tabel mutasi kosong di awal');
        $cek($M::kelompokSql('l', $M::tgl($bulanLalu)) === 'l.transaction_loan_officer_grouping_id', 'kosong: kelompokSql = kolom');
        $cek($M::hariSql('l', 'l.drop_date') === 'LOWER(l.hari)', 'kosong: hariSql = LOWER(kolom)');

        // Pinjaman aktif K3 Senin (1223) yang drop bulan lalu -> pindah ke K1 Rabu (1221).
        $loan = \App\Models\TransactionLoan::where('transaction_loan_officer_grouping_id', 1223)
            ->where('hari', 'senin')->where('status', 'success')->whereNull('pay_off_date')
            ->whereBetween('drop_date', [$bulanLalu, $akhirBulanLalu])->orderBy('id')->firstOrFail();
        $user = \App\Models\User::role('superuser')->whereHas('employee')->firstOrFail();

        $sebelumLaluPorto = \App\Helpers\HitungAgregat::portofolio($kantor, $akhirBulanLalu, $bulanLalu);
        $sebelumLaluHarian = \App\Helpers\HitungAgregat::harianBanyak($kantor, $bulanLalu, $akhirBulanLalu);

        $m = $M::catat($loan, 1221, 'rabu', $bulanIni, 'cek tahap 1', $user);
        $loan->refresh();

        // 2. catat menimpa + mencatat.
        $cek((int) $loan->transaction_loan_officer_grouping_id === 1221 && $loan->hari === 'rabu', 'catat menimpa kolom pinjaman');
        $cek((int) $m->dari_grouping_id === 1223 && $m->dari_hari === 'senin' && (int) $m->ke_grouping_id === 1221 && $m->ke_hari === 'rabu', 'catat mencatat asal & tujuan');

        // 3. Helper: bulan lalu = asal, bulan ini = tujuan.
        $pada = fn ($ref) => DB::table(DB::raw('transaction_loans l'))->where('l.id', $loan->id)
            ->selectRaw($M::kelompokSql('l', $M::tgl($ref)) . ' g, ' . $M::hariSql('l', $M::tgl($ref)) . ' h')->first();
        $lalu = $pada($bulanLalu);
        $ini = $pada($bulanIni);
        $cek((int) $lalu->g === 1223 && $lalu->h === 'senin', 'bulan lalu: K3 senin');
        $cek((int) $ini->g === 1221 && $ini->h === 'rabu', 'bulan ini: K1 rabu');

        // 4. saring: bulan lalu pinjaman ada di 1223 senin, tidak di 1221 rabu; bulan ini sebaliknya.
        $ada = function ($g, $hari, $ref) use ($M, $loan) {
            $q = DB::table(DB::raw('transaction_loans l'))->where('l.id', $loan->id);
            $M::saring($q, 'l', [$g], $M::tgl($ref), $hari);
            return $q->exists();
        };
        $cek($ada(1223, 'senin', $bulanLalu) && !$ada(1221, 'rabu', $bulanLalu), 'saring bulan lalu');
        $cek(!$ada(1223, 'senin', $bulanIni) && $ada(1221, 'rabu', $bulanIni), 'saring bulan ini');

        // 5. penyesuaianBaca (dipakai buku storting): bulan lalu 1223 senin dapat 'masuk', 1221 rabu dapat 'keluar'; bulan ini kosong.
        $cek(in_array($loan->id, $M::penyesuaianBaca(1223, 'senin', $bulanLalu)['masuk']), 'penyesuaianBaca lalu: masuk ke K3 senin');
        $cek(in_array($loan->id, $M::penyesuaianBaca(1221, 'rabu', $bulanLalu)['keluar']), 'penyesuaianBaca lalu: keluar dari K1 rabu');
        $cek($M::penyesuaianBaca(1221, 'rabu', $bulanIni) === ['masuk' => [], 'keluar' => []], 'penyesuaianBaca bulan ini kosong');

        // Task 3 menambah cek agregat di bawah baris ini.
        // [CEK-TASK-3]
        // Task 4 menambah cek rekap di bawah baris ini.
        // [CEK-TASK-4]
        // Task 5 menambah cek daftar pinjaman di bawah baris ini.
        // [CEK-TASK-5]
    } finally {
        DB::rollBack();
    }
    echo "\n" . ($gagal ? "$gagal GAGAL" : 'SEMUA OK') . "\n";
})();
```

- [ ] **Step 2: Jalankan, pastikan gagal**

Run: `tr '\n' ' ' < scripts/cek_rombak_tahap1.php | docker exec -i unit-app php artisan tinker 2>&1 | grep -E "OK|GAGAL|Error"`
Expected: error `Call to undefined method App\Helpers\Mutasi::kelompokSql()`.

(Catatan: skrip memakai `//` komentar; `tr '\n' ' '` membuat semuanya satu baris sehingga komentar `//` memakan sisa baris. **Sebelum dijalankan**, buang komentar dulu: `grep -v '^\s*//' scripts/cek_rombak_tahap1.php | tr '\n' ' ' | docker exec -i unit-app php artisan tinker`. Pakai bentuk ini di semua step "Run" tahap ini.)

- [ ] **Step 3: Tulis helper baru di `app/Helpers/Mutasi.php`**

Ganti docblock kelas dengan:

```php
/**
 * Mutasi nasabah — perpindahan resort (kelompok, hari) per pinjaman.
 *
 * CARA B (TIMPA + CATAT), rancangan .agents/rombak_resort.md:
 * kolom `transaction_loan_officer_grouping_id` & `hari` pinjaman DITIMPA ke
 * tujuan, dan tiap perpindahan dicatat di sini dengan `berlaku_bulan`. Jadi
 * bulan berjalan cukup membaca kolom pinjaman. Bulan SEBELUM perpindahan
 * dibaca lewat catatan: kelompok PADA tanggal X = asal mutasi paling awal yang
 * berlaku sesudah X; kalau tidak ada, kolom pinjaman.
 *
 * Selama tabel mutasi kosong, semua helper mengembalikan kolom pinjaman apa
 * adanya — SQL identik dengan sebelum fitur ini ada.
 */
```

Hapus `ekspresiEfektifSql`, `ekspresiHariEfektifSql`, `kelompokEfektif`, `hariEfektif`. Tambahkan:

```php
    /** Tanggal -> literal SQL ter-quote, untuk argumen $refSql. */
    public static function tgl($tanggal): string
    {
        return DB::getPdo()->quote(Carbon::parse($tanggal)->toDateString());
    }

    /** Tabel mutasi kosong? Satu kueri kecil; tidak di-cache karena worker panjang bisa basi. */
    private static function kosong(): bool
    {
        return !TransactionLoanMutation::query()->exists();
    }

    /**
     * Ekspresi SQL kelompok pinjaman $alias PADA tanggal $refSql (literal dari
     * tgl() atau kolom, mis. 'l.drop_date' untuk "kelompok saat drop").
     */
    public static function kelompokSql(string $alias, string $refSql): string
    {
        $kolom = "$alias.transaction_loan_officer_grouping_id";
        if (self::kosong()) {
            return $kolom;
        }

        return "COALESCE((SELECT m.dari_grouping_id FROM transaction_loan_mutations m
            WHERE m.transaction_loan_id = $alias.id AND m.berlaku_bulan > $refSql
            ORDER BY m.berlaku_bulan, m.id LIMIT 1), $kolom)";
    }

    /** Sama dengan kelompokSql() untuk hari tagih, sudah LOWER. */
    public static function hariSql(string $alias, string $refSql): string
    {
        if (self::kosong()) {
            return "LOWER($alias.hari)";
        }

        return "LOWER(COALESCE((SELECT m.dari_hari FROM transaction_loan_mutations m
            WHERE m.transaction_loan_id = $alias.id AND m.berlaku_bulan > $refSql
            ORDER BY m.berlaku_bulan, m.id LIMIT 1), $alias.hari))";
    }

    /**
     * Saring pinjaman yang PADA $refSql ada di $groupingIds (dan $hari kalau
     * diisi). whereIn kolom asli tetap dipakai supaya terindeks, ditambah
     * pinjaman yang dulu di sini tapi sudah pindah keluar; lalu ekspresi
     * "pada" membuang yang baru pindah masuk.
     */
    public static function saring($query, string $alias, array $groupingIds, string $refSql, ?string $hari = null): void
    {
        $kolom = "$alias.transaction_loan_officer_grouping_id";
        if (empty($groupingIds)) {
            $query->whereRaw('0 = 1');
            return;
        }
        if (self::kosong()) {
            $query->whereIn($kolom, $groupingIds);
            if ($hari !== null) {
                $query->where("$alias.hari", $hari);
            }
            return;
        }

        $ids = implode(',', array_map('intval', $groupingIds));
        $query->where(function ($w) use ($kolom, $alias, $groupingIds) {
            $w->whereIn($kolom, $groupingIds)
                ->orWhereIn("$alias.id", TransactionLoanMutation::whereIn('dari_grouping_id', $groupingIds)->select('transaction_loan_id'));
        })->whereRaw(self::kelompokSql($alias, $refSql) . " IN ($ids)");
        if ($hari !== null) {
            $query->whereRaw(self::hariSql($alias, $refSql) . ' = ?', [strtolower($hari)]);
        }
    }
```

Ganti isi `penyesuaianBaca` (tanda tangan & docblock "@return" tetap; ubah kalimat pembuka docblock menjadi "Tambalan pembacaan per (grouping, hari) PADA bulan $ref: kolom pinjaman sudah susunan baru, jadi bulan sebelum mutasi perlu menambah yang pindah KELUAR sesudahnya (`masuk`) dan membuang yang pindah MASUK sesudahnya (`keluar`)."):

```php
    public static function penyesuaianBaca(int $groupingId, string $hari, $ref): array
    {
        $refDate = Carbon::parse($ref)->startOfMonth()->toDateString();
        $hari = strtolower($hari);

        // Hanya mutasi yang BELUM berlaku di bulan $ref dan menyentuh grouping ini.
        $loanIds = TransactionLoanMutation::where('berlaku_bulan', '>', $refDate)
            ->where(function ($q) use ($groupingId) {
                $q->where('ke_grouping_id', $groupingId)
                    ->orWhere('dari_grouping_id', $groupingId);
            })
            ->distinct()->pluck('transaction_loan_id');

        if ($loanIds->isEmpty()) {
            return ['masuk' => [], 'keluar' => []];
        }

        $ref = self::tgl($refDate);
        $rows = DB::table(DB::raw('transaction_loans l'))
            ->whereIn('l.id', $loanIds)
            ->get([
                DB::raw('l.id AS id'),
                DB::raw('l.transaction_loan_officer_grouping_id AS og'),
                DB::raw('LOWER(l.hari) AS oh'),
                DB::raw(self::kelompokSql('l', $ref) . ' AS pg'),
                DB::raw(self::hariSql('l', $ref) . ' AS ph'),
            ]);

        $masuk = [];
        $keluar = [];
        foreach ($rows as $r) {
            $kolom = ((int) $r->og === $groupingId) && ($r->oh === $hari);
            $pada = ((int) $r->pg === $groupingId) && ($r->ph === $hari);
            if ($pada && !$kolom) {
                $masuk[] = (int) $r->id;
            } elseif ($kolom && !$pada) {
                $keluar[] = (int) $r->id;
            }
        }

        return ['masuk' => $masuk, 'keluar' => $keluar];
    }
```

Ganti `catat` seluruhnya:

```php
    /**
     * Pindahkan satu pinjaman ke resort (kelompok, hari) tujuan mulai
     * $berlakuBulan: timpa kolom pinjaman + catat asalnya. Hanya bulan
     * berjalan: menimpa lebih awal memindah sisa bulan sebelumnya.
     * Angsuran bulan berjalan yang telanjur masuk TIDAK ikut dipindah di sini
     * (itu tugas penerapan rombak, tahap 2).
     *
     * @throws \RuntimeException
     */
    public static function catat(TransactionLoan $loan, int $keGroupingId, ?string $keHari, $berlakuBulan, ?string $alasan, $user, ?int $rombakId = null): TransactionLoanMutation
    {
        if (!$user || !$user->hasAnyRole(self::ROLE_PEMUTASI)) {
            throw new \RuntimeException('Hanya superuser yang boleh melakukan mutasi.');
        }

        $bulan = Carbon::parse($berlakuBulan)->startOfDay();
        if ($bulan->toDateString() !== Carbon::now()->startOfMonth()->toDateString()) {
            throw new \RuntimeException('Mutasi hanya berlaku mulai tanggal 1 bulan berjalan.');
        }

        $tujuan = TransactionLoanOfficerGrouping::find($keGroupingId);
        if (!$tujuan) {
            throw new \RuntimeException('Kelompok tujuan tidak ditemukan.');
        }

        // Satu kantor dulu (rancangan §11): pindah kantor belum dicakup.
        $branchAsal = $loan->loan_officer_grouping->branch_id ?? null;
        if ($branchAsal !== null && (int) $tujuan->branch_id !== (int) $branchAsal) {
            throw new \RuntimeException('Mutasi antar kantor belum didukung — tujuan harus di kantor yang sama.');
        }

        $dari = (int) $loan->transaction_loan_officer_grouping_id;
        $dariHari = strtolower($loan->hari);
        $keHariBersih = $keHari ? strtolower($keHari) : $dariHari;

        if ($dari === $keGroupingId && $keHariBersih === $dariHari) {
            throw new \RuntimeException('Tujuan sama dengan kelompok & hari sekarang.');
        }

        return DB::transaction(function () use ($loan, $keGroupingId, $dari, $dariHari, $keHariBersih, $bulan, $alasan, $user, $rombakId) {
            $loan->forceFill([
                'transaction_loan_officer_grouping_id' => $keGroupingId,
                'hari' => $keHariBersih,
            ])->save();

            return TransactionLoanMutation::create([
                'transaction_loan_id' => $loan->id,
                'rombak_id' => $rombakId,
                'dari_grouping_id' => $dari,
                'dari_hari' => $dariHari,
                'ke_grouping_id' => $keGroupingId,
                'ke_hari' => $keHariBersih,
                'berlaku_bulan' => $bulan->toDateString(),
                'alasan' => $alasan ?: null,
                'user_input' => $user->employee->id,
            ]);
        });
    }
```

- [ ] **Step 4: Ganti pemakai `ekspresi*` di `HitungAgregat::portofolio`** (wajib sekarang, karena fungsinya dihapus)

Di `app/Helpers/HitungAgregat.php`, ganti blok komentar + dua baris `$gEfektif` / `$hariEfektif` dengan:

```php
        // Kelompok & hari PADA bulan referensi (rancangan rombak_resort §8.3):
        // sebelum mutasi = asal, sesudahnya = kolom pinjaman. Tanpa mutasi =
        // kolom pinjaman persis.
        $gEfektif = Mutasi::kelompokSql('l', Mutasi::tgl($ref));
        $hariEfektif = Mutasi::hariSql('l', Mutasi::tgl($ref));
```

dan ganti `->whereIn('l.transaction_loan_officer_grouping_id', $groupingIds)` di fungsi itu dengan:

```php
            ->tap(fn ($q) => Mutasi::saring($q, 'l', $groupingIds, Mutasi::tgl($ref)))
```

Tambahkan `use App\Helpers\Mutasi;` tidak perlu (namespace sama, `App\Helpers`).

- [ ] **Step 5: Jalankan cek, pastikan lolos**

Run: `grep -v '^\s*//' scripts/cek_rombak_tahap1.php | tr '\n' ' ' | docker exec -i unit-app php artisan tinker 2>&1 | grep -E "OK|GAGAL|Error"`
Expected: semua baris `OK`, akhir `SEMUA OK`.

Kalau `User::role` tidak ada: model user memakai spatie `HasRoles` (dipakai `hasAnyRole` di `catat`); ganti query superuser dengan `\App\Models\User::whereHas('roles', fn ($q) => $q->where('name', 'superuser'))->whereHas('employee')->firstOrFail()`.

- [ ] **Step 6: Commit**

```bash
git add app/Helpers/Mutasi.php app/Helpers/HitungAgregat.php scripts/cek_rombak_tahap1.php
git commit -m "Mutasi: overwrite loan resort and read past months through the log

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

(`MutasiNasabahController` masih memanggil `ekspresiEfektifSql` — dicabut di Task 6. Sampai Task 6 selesai, menu itu error; jangan deploy di antaranya.)

---

### Task 3: `HitungAgregat::drop` dan `saldoMasuk`

**Files:**
- Modify: `app/Helpers/HitungAgregat.php` (`drop`, `saldoMasuk`)
- Modify: `scripts/cek_rombak_tahap1.php` (di bawah `[CEK-TASK-3]`)

**Interfaces:**
- Consumes: `Mutasi::saring`, `Mutasi::kelompokSql`, `Mutasi::hariSql`, `Mutasi::tgl` (Task 2).

- [ ] **Step 1: Tambah cek** di bawah `// [CEK-TASK-3]`:

```php
        $sesudahLaluPorto = \App\Helpers\HitungAgregat::portofolio($kantor, $akhirBulanLalu, $bulanLalu);
        $sesudahLaluHarian = \App\Helpers\HitungAgregat::harianBanyak($kantor, $bulanLalu, $akhirBulanLalu);
        $cek($sesudahLaluPorto == $sebelumLaluPorto, 'portofolio bulan lalu tidak bergeser');
        $cek($sesudahLaluHarian == $sebelumLaluHarian, 'harian (drop/storting) bulan lalu tidak bergeser');
        $portoIni = \App\Helpers\HitungAgregat::portofolio($kantor, $akhirBulanLalu, $bulanIni);
        $total = fn ($p) => array_sum(array_map('array_sum', $p));
        $cek($total($portoIni) === $total($sebelumLaluPorto), 'total kantor bulan ini = bulan lalu');
        $cek(array_sum($portoIni['1221|rabu'] ?? []) > array_sum($sebelumLaluPorto['1221|rabu'] ?? []), 'saldo K1 rabu bertambah di bulan ini');
```

- [ ] **Step 2: Jalankan, pastikan `harian ... tidak bergeser` GAGAL**

Run: `grep -v '^\s*//' scripts/cek_rombak_tahap1.php | tr '\n' ' ' | docker exec -i unit-app php artisan tinker 2>&1 | grep -E "OK|GAGAL|Error"`
Expected: `GAGAL harian (drop/storting) bulan lalu tidak bergeser` (drop bulan lalu pindah ke 1221).

- [ ] **Step 3: Ubah `drop`** — ganti isi kueri:

```php
        // Kelompok SAAT DROP (rancangan rombak_resort §8.3): pinjaman yang
        // dipindah sesudahnya tetap dihitung di kelompok asalnya.
        $g = Mutasi::kelompokSql('l', 'l.drop_date');
        $rows = DB::table(DB::raw('transaction_loans l'))
            ->tap(fn ($q) => Mutasi::saring($q, 'l', $groupingIds, 'l.drop_date'))
            ->where('l.status', 'success')
            ->whereBetween('l.drop_date', [$dari, $sampai])
            ->whereNotExists(function ($q) {
                $q->select(DB::raw(1))
                    ->from('transaction_saldo_adjustments as sa')
                    ->whereColumn('sa.transaction_loan_id', 'l.id')
                    ->where('sa.jenis', TransactionSaldoAdjustment::JENIS_SALDO_AWAL);
            })
            ->groupBy(DB::raw($g), 'l.drop_date')
            ->get([
                DB::raw("$g AS g"),
                DB::raw('l.drop_date AS tgl'),
                DB::raw('SUM(l.nominal_drop) AS n'),
            ]);
```

- [ ] **Step 4: Ubah `saldoMasuk`** — hari dari loan dibaca PADA bulan itu:

```php
        $h = Mutasi::hariSql('l', Mutasi::tgl($ref));
```

lalu di kueri ganti `DB::raw('LOWER(l.hari)')` di `groupBy` dengan `DB::raw($h)` dan `DB::raw('LOWER(l.hari) AS hari')` dengan `DB::raw("$h AS hari")`. (`sa.transaction_loan_officer_grouping_id` tetap — kelompok tersimpan per baris.)

- [ ] **Step 5: Jalankan cek**

Expected: `SEMUA OK`.

- [ ] **Step 6: Commit**

```bash
git add app/Helpers/HitungAgregat.php scripts/cek_rombak_tahap1.php
git commit -m "Aggregates: drop counts in the resort at drop time, saldo masuk by day at that month

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: `RekapTrait` — 5 kueri drop

**Files:**
- Modify: `app/Traits/RekapTrait.php` (sekitar baris 49, 67, 255, 835, 1098)
- Modify: `scripts/cek_rombak_tahap1.php` (di bawah `[CEK-TASK-4]`)

**Interfaces:**
- Consumes: `Mutasi::saring`, `Mutasi::kelompokSql` (Task 2). Alias tabel untuk kueri Eloquent tanpa alias = `'transaction_loans'`.

Semua kueri ini menjumlah drop per (kelompok, `drop_date`). Kelompok yang dipakai = kelompok **saat drop** → `$refSql = 'transaction_loans.drop_date'`.

- [ ] **Step 1: Tambah cek** di bawah `// [CEK-TASK-4]` — kueri tiruan rekap per kelompok:

```php
        $dropPer = function ($ids, $dari, $sampai) use ($M) {
            $g = $M::kelompokSql('transaction_loans', 'transaction_loans.drop_date');
            return \App\Models\TransactionLoan::query()
                ->tap(fn ($q) => $M::saring($q, 'transaction_loans', $ids, 'transaction_loans.drop_date'))
                ->where('status', 'success')->whereBetween('drop_date', [$dari, $sampai])
                ->groupByRaw($g)->selectRaw("$g AS g, SUM(nominal_drop) AS n")
                ->toBase()->get()->pluck('n', 'g')->map(fn ($n) => (int) $n)->all();
        };
        $dropLalu = $dropPer($kantor, $bulanLalu, $akhirBulanLalu);
        $cek(($dropLalu[1223] ?? 0) >= (int) $loan->nominal_drop, 'drop bulan lalu tetap di K3');
        $harianLalu = collect($sebelumLaluHarian)->groupBy(fn ($v, $k) => (int) explode('|', $k)[0], true)->map(fn ($c) => $c->sum('drop'))->all();
        $cek(($dropLalu[1223] ?? 0) === ($harianLalu[1223] ?? 0), 'drop rekap K3 = HitungAgregat');
```

(Cek ini menguji pola kueri yang sama persis dengan yang dipasang di RekapTrait; fungsi RekapTrait sendiri butuh `Request` + sesi login, diuji manual di Step 6.)

- [ ] **Step 2: Jalankan cek** — Expected: lolos (pola sudah benar karena memakai helper Task 2). Kalau `drop rekap K3 = HitungAgregat` GAGAL, bedanya karena `HitungAgregat::drop` mengecualikan pinjaman ber-`saldo_awal` — samakan cek dengan menambah `whereNotExists` yang sama, jangan ubah kode produksi.

- [ ] **Step 3: Ubah 5 kueri**

(a) `getRencanaDropKepalaData`, `$dropBulanIni` (± baris 49):

```php
    $dropBulanIni = TransactionLoan::query()
      ->tap(fn($q) => \App\Helpers\Mutasi::saring($q, 'transaction_loans', $groupingId->pluck('id')->all(), 'transaction_loans.drop_date'))
      ->whereBetween('drop_date', [$startOfMonth->toDateString(), $endOfMonth->toDateString()])
      ->distinct()->pluck('drop_date')->map(fn($t) => Carbon::parse($t)->toDateString());
```

(b) `getRencanaDropKepalaData`, `$loan` (± baris 67): ganti `TransactionLoan::whereIn('transaction_loan_officer_grouping_id', $groupingId->pluck('id'))` dengan

```php
    $gDrop = \App\Helpers\Mutasi::kelompokSql('transaction_loans', 'transaction_loans.drop_date');
    $loan = TransactionLoan::query()
      ->tap(fn($q) => \App\Helpers\Mutasi::saring($q, 'transaction_loans', $groupingId->pluck('id')->all(), 'transaction_loans.drop_date'))
```

ganti `->groupBy('transaction_loan_officer_grouping_id', 'drop_date')` dengan `->groupByRaw("$gDrop, drop_date")`, dan di `selectRaw` ganti `transaction_loan_officer_grouping_id AS g` dengan `$gDrop AS g` (string `selectRaw` sudah kutip ganda — sisipkan `{$gDrop}`).

(c) `getRekapDuaData`, `$loan` (± baris 255):

```php
    $gDrop = \App\Helpers\Mutasi::kelompokSql('transaction_loans', 'transaction_loans.drop_date');
    $loan = TransactionLoan::query()
      ->tap(fn($q) => \App\Helpers\Mutasi::saring($q, 'transaction_loans', $transactionOffice->pluck('id')->all(), 'transaction_loans.drop_date'))
      ->where('status', 'success')
      ->whereBetween('drop_date', [$startDateofMonth, $transaction_date->format('Y-m-d')])
      ->groupByRaw("$gDrop, drop_date")
      ->selectRaw("$gDrop AS g, drop_date AS d, SUM(nominal_drop) AS n")
      ->toBase()->get()
      ->map(fn($r) => (object) ['g' => $r->g, 'd' => Carbon::parse($r->d)->toDateString(), 'n' => (int) $r->n])
      ->groupBy('g');
```

(d) `getDataRekapDua`, `$loanAgg` (± baris 835) — nama kolom hasil harus tetap `transaction_loan_officer_grouping_id` karena dipakai `groupBy([...])` koleksi:

```php
      $gDrop = \App\Helpers\Mutasi::kelompokSql('transaction_loans', 'transaction_loans.drop_date');
      $loanAgg = TransactionLoan::selectRaw("
          $gDrop AS transaction_loan_officer_grouping_id,
          drop_date,
          SUM(nominal_drop) as drop_total
      ")
        ->tap(fn($q) => \App\Helpers\Mutasi::saring($q, 'transaction_loans', $groupingIds, 'transaction_loans.drop_date'))
        ->where('status', 'success')
        ->whereBetween('drop_date', [$startDateofMonth, $endDateofMonth])
        ->groupByRaw("$gDrop, drop_date")
        ->get()
        ->groupBy(['transaction_loan_officer_grouping_id', 'drop_date']);
```

(Pastikan `$groupingIds` di sana array; kalau Collection, tambah `->all()`.)

(e) `getRekapPermantriData`, `$loan` (± baris 1098):

```php
    $loan = TransactionLoan::query()
      ->tap(fn($q) => \App\Helpers\Mutasi::saring($q, 'transaction_loans', [$transactionOffice->id], 'transaction_loans.drop_date'))
```

(sisa rantai `->where('status'...)` … tetap).

- [ ] **Step 4: Jalankan cek** — Expected: `SEMUA OK`.

- [ ] **Step 5: Cek kueri tidak lebih lambat tanpa mutasi.** Karena tabel mutasi kosong di luar transaksi cek, `saring` = `whereIn` persis. Buka `http://localhost:8080/kasir/rekap/rencana`, `rekap-dua`, `rekap-permantri` untuk Sidoarjo 5 bulan lalu & bulan ini — tampil seperti sebelum perubahan (bandingkan angka drop dengan `git stash` bila ragu).

- [ ] **Step 6: Uji manual dengan mutasi sungguhan di DB lokal** (DB lokal salinan; dikembalikan di akhir)

Jalankan di tinker lokal (satu baris, tanpa rollback):

```php
$l = \App\Models\TransactionLoan::where('transaction_loan_officer_grouping_id', 1223)->where('hari','senin')->where('status','success')->whereNull('pay_off_date')->whereBetween('drop_date',[now()->startOfMonth()->subMonth(), now()->startOfMonth()->subDay()])->orderBy('id')->first(); $u = \App\Models\User::role('superuser')->whereHas('employee')->first(); \App\Helpers\Mutasi::catat($l, 1221, 'rabu', now()->startOfMonth(), 'uji manual', $u); echo $l->id;
```

Lalu buka Rekap Rencana / Rekap 2 / Permantri Sidoarjo 5: bulan lalu drop pinjaman itu di **Kel 3**, bulan ini pinjaman itu tidak menambah drop siapa pun (drop-nya bulan lalu). Kembalikan:

```php
$m = \App\Models\TransactionLoanMutation::where('alasan','uji manual')->first(); \App\Models\TransactionLoan::whereKey($m->transaction_loan_id)->update(['transaction_loan_officer_grouping_id' => $m->dari_grouping_id, 'hari' => $m->dari_hari]); $m->delete();
```

- [ ] **Step 7: Commit**

```bash
git add app/Traits/RekapTrait.php scripts/cek_rombak_tahap1.php
git commit -m "Rekap: drop counted in the resort at drop time across Rencana, Rekap 2 and Permantri

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Daftar pinjaman per bulan (`getTransactionLoan`, `dataDaftarNasabah`)

**Files:**
- Modify: `app/Traits/PinjamanTrait.php` (± baris 58–59)
- Modify: `app/Http/Controllers/TransactionLoanController.php` (± baris 1295–1297)
- Modify: `scripts/cek_rombak_tahap1.php` (di bawah `[CEK-TASK-5]`)

**Interfaces:**
- Consumes: `Mutasi::saring`, `Mutasi::tgl` (Task 2).

`getLoan`, `getLoanMantri`, dan macet (± baris 366, 758, 1244) sudah memakai `penyesuaianBaca` — otomatis benar sejak Task 2, tidak diubah.

- [ ] **Step 1: Tambah cek** di bawah `// [CEK-TASK-5]`:

```php
        $daftar = function ($g, $hari, $bulan) use ($M) {
            return DB::table('transaction_loans as l')
                ->tap(fn ($q) => $M::saring($q, 'l', [$g], $M::tgl($bulan), $hari))
                ->where('l.status', 'success')
                ->whereBetween('l.drop_date', [$bulan, \Carbon\Carbon::parse($bulan)->endOfMonth()->toDateString()])
                ->pluck('l.id')->all();
        };
        $cek(in_array($loan->id, $daftar(1223, 'senin', $bulanLalu)), 'Daftar Nasabah bulan lalu: di K3 senin');
        $cek(!in_array($loan->id, $daftar(1221, 'rabu', $bulanLalu)), 'Daftar Nasabah bulan lalu: tidak di K1 rabu');
```

- [ ] **Step 2: Jalankan cek** — Expected: lolos (pola helper). Lanjut pasang di kode.

- [ ] **Step 3: `PinjamanTrait::getTransactionLoan`** — ganti

```php
      ->where('transaction_loan_officer_grouping_id', $groupingId->id)
      ->where('hari', $hari)
```

dengan

```php
      // Resort PADA bulan yang dilihat (rombak_resort §8.3): bulan sebelum
      // rombak tetap menampilkan susunan lama.
      ->tap(fn($q) => \App\Helpers\Mutasi::saring($q, 'transaction_loans', [$groupingId->id], \App\Helpers\Mutasi::tgl($startOfMonth), $hari))
```

- [ ] **Step 4: `TransactionLoanController::dataDaftarNasabah`** — ganti

```php
      ->where('l.transaction_loan_officer_grouping_id', $grouping->id)
      ->where('l.status', 'success')
      ->where('l.hari', $hari)
```

dengan

```php
      // Resort pada bulan drop yang dipilih (rombak_resort §8.3).
      ->tap(fn($q) => \App\Helpers\Mutasi::saring($q, 'l', [$grouping->id], \App\Helpers\Mutasi::tgl($bulan->copy()->startOfMonth()), $hari))
      ->where('l.status', 'success')
```

Kolom `l.hari` di `get([...])` tetap (menampilkan hari sekarang). Biarkan; mas belum minta tampilan hari lama.

- [ ] **Step 5: Jalankan cek** — Expected: `SEMUA OK`.

- [ ] **Step 6: Uji manual** — pakai skrip Step 6 Task 4 (catat → cek → kembalikan): `/pinjaman` (buku pengajuan) dan Daftar Nasabah Sidoarjo 5 Kel 3 Senin bulan lalu memuat nasabah itu; Kel 1 Rabu bulan lalu tidak; bulan ini Kel 1 Rabu (buku storting) memuat, Kel 3 Senin tidak.

- [ ] **Step 7: Commit**

```bash
git add app/Traits/PinjamanTrait.php app/Http/Controllers/TransactionLoanController.php scripts/cek_rombak_tahap1.php
git commit -m "Loan lists show the resort at the viewed month

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Cabut menu Mutasi Nasabah lama — **minta persetujuan mas dulu**

Alasan: menu itu dibuat untuk cara A (mutasi berlaku bulan depan, kolom tidak ditimpa). Sesudah Task 2, `catat` menimpa dan hanya menerima bulan berjalan, dan `ekspresiEfektifSql` yang dipanggil controllernya sudah tidak ada. Prod: 0 baris mutasi — tidak ada data yang hilang. Penggantinya menu Rombak Resort (tahap 3); pindah satu nasabah tidak dicakup (rancangan §11).

**Files:**
- Delete: `app/Http/Controllers/MutasiNasabahController.php`, `resources/js/Pages/Admin/MutasiNasabah.jsx`
- Modify: `routes/web.php` (hapus grup `mutasi-nasabah` ± baris 305–311), `resources/js/Components/Sidebar.jsx` (hapus item `Mutasi Nasabah` ± baris 512–517), `app/Http/Controllers/MigrasiController.php:216` (komentar menyebut `ekspresiEfektifSql` → `Mutasi::kelompokSql`)

- [ ] **Step 1: Tanya mas** — "Menu Mutasi Nasabah lama dicabut sekarang?" Kalau tidak, ganti rencana: controller memakai `kelompokSql`/`hariSql` dan validasi bulan berjalan; jangan lanjut tanpa jawaban.
- [ ] **Step 2: Hapus berkas & entri** (lihat daftar di atas).
- [ ] **Step 3: Pastikan tidak ada sisa**

Run: `grep -rn "mutasi_nasabah\|MutasiNasabah\|ekspresiEfektifSql\|ekspresiHariEfektifSql\|kelompokEfektif\|hariEfektif" app routes resources/js`
Expected: kosong.

- [ ] **Step 4: Route cache & halaman**

Run: `docker exec unit-app php artisan route:list --path=mutasi`
Expected: tidak ada `mutasi-nasabah`. Sidebar lokal tidak menampilkan "Mutasi Nasabah" (HMR jalan).

- [ ] **Step 5: Commit**

```bash
git add -A app/Http/Controllers/MutasiNasabahController.php resources/js/Pages/Admin/MutasiNasabah.jsx
git add routes/web.php resources/js/Components/Sidebar.jsx app/Http/Controllers/MigrasiController.php
git commit -m "Remove the old per-loan Mutasi Nasabah menu, superseded by resort remap

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Sapu ulang + periksa app_laravel (hanya baca, laporan)

**Files:** tidak ada perubahan kode. Hasil ditambahkan ke `.agents/rombak_resort.md` §8.2 (tidak di-commit).

- [ ] **Step 1: Sapu unit-apps** — semua kueri pinjaman yang menyaring/mengelompokkan kelompok atau hari untuk **tanggal/bulan yang bukan bulan berjalan**:

Run: `grep -rn "transaction_loan_officer_grouping_id\|'hari'\|\.hari\b" app --include=*.php | grep -v "Instalment\|DailyClosing\|DailyRecap\|MonthlyClosing\|SaldoAdjustment\|Sirculation\|WhiteOff\|Mutasi.php"`

Untuk tiap hasil yang membaca `transaction_loans` dengan filter bulan/tanggal masa lalu dan belum memakai `Mutasi::saring`/`kelompokSql`/`penyesuaianBaca`: catat `berkas:baris`, fungsi, layar yang memakai. Kandidat yang sudah diketahui untuk diperiksa: `RekapTrait` sisa (saldo awal per hari, sirkulasi alur lama), `PemeriksaanMigrasi`, `SelisihMigrasi`, `Gembok`, `KoreksiTarget`, `PecahanMacetLama`, `TransactionDailyRecapController::pratinjauLama`, `ClosingHarianController`.

- [ ] **Step 2: Sapu app_laravel** dengan perintah yang sama di `/home/supermario/projects/app_laravel/app`. Catat tiap tempat yang membaca `transaction_loans` per kelompok/hari untuk bulan lalu.
- [ ] **Step 3: `transaction_manage_customers.transaction_loan_officer_grouping_id`** — cari penulis & pembacanya di dua repo, tulis artinya dan usul (ikut ditimpa saat rombak atau tidak).
- [ ] **Step 4: Laporkan ke mas** daftar temuan + usul tempat mana masuk tahap 1 lanjutan dan mana yang aman dibiarkan (mis. hanya dipakai alur lama, yang tidak dicakup rombak).

---

## Selesai tahap 1 bila

- `scripts/cek_rombak_tahap1.php` → `SEMUA OK`.
- Uji manual Task 4 Step 6 dan Task 5 Step 6 cocok, dan data lokal dikembalikan.
- Laporan Task 7 sudah ke mas.
- Belum ada push/deploy (tahap 1 tidak berguna sendirian di prod; dirilis bersama tahap 2–3 atau sesuai keputusan mas).

---

## Tambahan sesudah Task 7 (disetujui mas 2026-11-02)

Temuan lengkap: `.superpowers/sdd/rombak_resort_tahap1/task-7-report.md` (N1–N7).
Keputusan mas untuk N6: transaksi bertanggal mundur dicatat di **kelompok saat tanggal itu**, tidak ditolak.

### Task 8: `catat` tanpa hook + hapus `/pindah-resort` (N1, N7)

**Files:**
- Modify: `app/Helpers/Mutasi.php` (`catat`)
- Delete: `app/Http/Controllers/PindahResortController.php`
- Modify: `routes/web.php` (grup `PindahResortController` ± baris 107–109 dan `use App\Http\Controllers\PindahResortController;` ± baris 7)
- Modify: `scripts/cek_rombak_tahap1.php`

- [ ] **Step 1: Cek gagal.** Tambahkan di `scripts/cek_rombak_tahap1.php`, SEBELUM `$m = $M::catat(...)`: `auth()->login($user);` (supaya hook model berjalan seperti di web). Tambahkan sesudah `$loan->refresh();`:

```php
        $cek(\App\Models\TransactionLockHistory::where('created_at', '>=', now()->subMinute())->where('aksi', 'like', '%ubah pinjaman #' . $loan->id . '%')->doesntExist(), 'catat tidak membuka kunci hari drop lama');
```

  (Periksa dulu nama model/kolom riwayat kunci yang dipakai `Gembok::bukaOtomatis` — tabel `transaction_lock_histories`; sesuaikan nama kolom `aksi`/`alasan` dengan yang benar. Kalau `bukaOtomatis` tidak menulis riwayat, ganti cek dengan: closing `kasir_lock_at` hari drop pinjaman itu di kelompok 1223 dan 1221 tetap sama sebelum dan sesudah `catat`.)
  Jalankan: harus GAGAL.
- [ ] **Step 2:** Di `Mutasi::catat`, ganti `->save()` dengan `->saveQuietly()`. Komentar satu baris: hook `TransactionLoan::updating` membuka kunci hari drop lama di dua kelompok; rombak tidak menggeser angka hari itu (pembaca memakai kelompok saat drop), jadi hook dilewati; pembukaan kunci bulan M lewat penerapan (tahap 2).
- [ ] **Step 3:** Hapus `PindahResortController.php`, grup route-nya, dan `use`-nya. Cek: `grep -rn "PindahResort\|pindah_resort\|pindah-resort" app routes resources/js` kosong; `docker exec unit-app php artisan route:list --path=pindah` kosong.
- [ ] **Step 4:** Jalankan cek: `SEMUA OK`.
- [ ] **Step 5: Commit** (berkas per nama): "Mutasi: overwrite without model hooks; remove the unguarded /pindah-resort tool" + Co-Authored-By.

### Task 9: Pembaca bulan lalu yang tersisa (N2–N5)

**Files:** `app/Traits/PinjamanTrait.php` (`getLoanByDate` ± 1119–1124), `app/Http/Controllers/MigrasiController.php` (`nasabahMacet` ± 240–243, `barisKesiapan` `$adaMacetLama` ± 541–548, docblock ± 214–217 `ponytail:` dihapus kalau sudah tidak berlaku), `app/Helpers/SelisihMigrasi.php` (`macetLama` ± 76–79, `l.hari` ± 97, `$loan->hari` ± 122, `sesuaikanMl` ± 239–245), `app/Http/Controllers/KoreksiBekuController.php` (`index` ± 70–72, `buku` ± 154–155), `scripts/cek_rombak_tahap1.php`.

Aturan: setiap saringan/kunci kelompok atau hari pinjaman untuk bulan acuan R memakai `Mutasi::saring($q, $alias, [$gid…], Mutasi::tgl(R), $hari)` atau, untuk kunci hasil, `Mutasi::kelompokSql($alias, Mutasi::tgl(R))` / `Mutasi::hariSql(...)`. R per tempat: `getLoanByDate` = awal bulan yang dilihat (`$begin_transaction`); MigrasiController/SelisihMigrasi = `$periode` (bulan migrasi); KoreksiBeku = `$bulan` yang dibuka. Pola sama dengan `TransactionLoanController::dataDaftarNasabah`. Untuk baris PHP per pinjaman (mis. `$loan->hari` di SelisihMigrasi:122) pakai helper PHP baru dari Task 10 kalau sudah ada, kalau belum: ambil `hari`/kelompok lewat kueri yang sudah memilih `hariSql`/`kelompokSql` sebagai kolom.

- [ ] **Step 1:** Tambah cek di bawah marker baru `// [CEK-TASK-9]` (buat marker di bawah `[CEK-TASK-5]`): sesudah `catat`, panggil versi kueri tiap tempat (pola yang sama, bulan lalu) dan pastikan pinjaman uji terbaca di 1223 senin, tidak di 1221 rabu. Minimal satu cek per berkas.
- [ ] **Step 2:** Jalankan — cek baru boleh lolos sebelum perubahan kalau hanya meniru pola; tetap lanjut.
- [ ] **Step 3:** Ubah keempat berkas.
- [ ] **Step 4:** Verifikasi headless (tinker, user 40, rollback): panggil fungsi asli tiap layar (SearchByDate `index_pinjaman_search`/`getLoanByDate`, Migrasi nasabahMacet + kesiapan, SelisihMigrasi untuk Sidoarjo 5 periode 2026-10-01, KoreksiBeku index/buku bulan sebelum migrasi Sidoarjo 5 kalau ada) sesudah `catat`; catat hasil sebelum/sesudah.
- [ ] **Step 5:** Cek `SEMUA OK`. Commit per berkas-nama: "Remaining past-month readers use the resort at that month" + Co-Authored-By.

### Task 10: Penulis bertanggal mundur mencap kelompok saat tanggal itu (N6)

**Files:** `app/Helpers/Mutasi.php` (helper baru), `app/Http/Controllers/TransactionLoanController.php` (`bayar_pinjaman` ± 1645, `white_off_loan` ± 1733), `app/Helpers/KoreksiBeku.php` (± 237), `app/Helpers/PenyesuaianSaldo.php` (`oper` ± 283–320), `app/Helpers/PecahanMacetLama.php` (± 81–133), `scripts/cek_rombak_tahap1.php`.

**Interfaces — Produces:**

```php
    /** Kelompok pinjaman PADA tanggal $tanggal (versi PHP satu pinjaman, untuk mencap baris transaksi). */
    public static function kelompokPada(TransactionLoan $loan, $tanggal): int
    {
        $m = TransactionLoanMutation::where('transaction_loan_id', $loan->id)
            ->where('berlaku_bulan', '>', Carbon::parse($tanggal)->toDateString())
            ->orderBy('berlaku_bulan')->orderBy('id')->first();

        return $m ? (int) $m->dari_grouping_id : (int) $loan->transaction_loan_officer_grouping_id;
    }

    /** Hari tagih pinjaman PADA tanggal $tanggal (versi PHP). */
    public static function hariPada(TransactionLoan $loan, $tanggal): string
    {
        $m = TransactionLoanMutation::where('transaction_loan_id', $loan->id)
            ->where('berlaku_bulan', '>', Carbon::parse($tanggal)->toDateString())
            ->orderBy('berlaku_bulan')->orderBy('id')->first();

        return strtolower($m?->dari_hari ?? $loan->hari);
    }
```

Aturan: setiap baris transaksi (angsuran, white off, penyesuaian saldo, baris MACET LAMA) yang kelompoknya dicap dari pinjaman memakai `Mutasi::kelompokPada($loan, <tanggal transaksi / berlaku_bulan baris itu>)`, bukan kolom pinjaman. Pengecekan kunci/`hitung()` yang terkait ikut memakai kelompok yang sama. Untuk `PecahanMacetLama`/`PenyesuaianSaldo::oper`, tentukan tanggal acuan dari baris yang ditulis (`berlaku_bulan` / tanggal transaksi) dan tulis alasannya di laporan.

- [ ] **Step 1:** Cek gagal di bawah marker baru `// [CEK-TASK-10]`: sesudah `catat` (berlaku bulan ini), buat angsuran lewat jalur yang sama dengan `bayar_pinjaman` untuk tanggal hari terakhir bulan lalu yang belum dikunci di kelompok 1223 (atau buka kuncinya dalam transaksi uji), dan pastikan `transaction_loan_officer_grouping_id` angsuran = 1223. Kalau jalur controller tidak bisa dipanggil dari tinker, uji `Mutasi::kelompokPada` langsung + satu panggilan controller headless di Step 4.
- [ ] **Step 2:** Tulis helper; pasang di 5 penulis.
- [ ] **Step 3:** Cek `SEMUA OK`.
- [ ] **Step 4:** Headless: `bayar_pinjaman` (user 40) untuk pinjaman uji tanggal bulan lalu → angsuran di 1223; tanggal bulan ini → 1221. Rollback.
- [ ] **Step 5:** Commit per berkas-nama: "Back-dated transactions are stamped with the resort at that date" + Co-Authored-By.

Catatan: pengecekan "Hari Tidak Sama" (T1) **bukan** di task ini — tahap 2.
