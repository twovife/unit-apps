# Rencana Implementasi — Rekap Sirkulasi Wilayah

> **Untuk pekerja agen:** jalankan tugas satu per satu, berhenti di akhir tiap
> tugas untuk ditinjau. Langkah bertanda `- [ ]`.

**Tujuan:** menggantikan Excel staf kontrol dengan satu halaman per wilayah per
tanggal: satu baris per kantor, angka WA kasir diketik tangan, dibandingkan
dengan Rekap 2, dicek, dan dicatat jejaknya.

**Spec:** `.agents/rekap_sirkulasi_wilayah.md` (disetujui mas 2026-11-23).

**Pendekatan:** satu controller baru + satu halaman Inertia baru. Angka sistem
diambil dengan satu kueri agregat per wilayah per tanggal (bukan memanggil
`getDataRekapDua` 10 kali). Angka yang diketik disimpan di dua tabel baru.
**Tidak ada tabel agregasi baru**: drop bulan rujukan dihitung dari
`transaction_loans` lalu di-cache (spec §6). Rumus (saldo, persen, selisih)
ditaruh di satu helper PHP murni supaya bisa diuji tanpa basis data.

**Lingkup yang disetujui mas (2026-11-23): Tugas 1 sampai 4.** Tugas 5–8
ditunda.

**Tumpukan:** Laravel + Inertia + React, shadcn/ui, `exceljs` (ditambah di
Tugas 7).

## Batasan global

- **Migrasi ditulis dan dijalankan dari `app_laravel`, tidak pernah dari
  `unit-apps`.** Berkas migrasi terbaru app_laravel
  (`2026_11_23_100000_add_keterangan_to_privat_loans.php`) sudah ada di tag
  `prod-v1.3.47`, jadi sudah di prod. Berarti **buat satu berkas migrasi baru**
  di `app_laravel`, dan semua migrasi berikutnya yang belum di prod digabung ke
  berkas itu.
- `php artisan migrate` dijalankan mas sendiri di `laravel-app`:
  `docker exec laravel-app php artisan migrate --force`.
- **Jangan jalankan `php artisan test`** — phpunit menghantam `ubmi_db` prod.
  Uji logika hitungan dengan skrip PHP murni (`php berkas.php`), tanpa Laravel.
- Jangan push, tag, atau deploy. Tunggu perintah mas.
- Kabari sesi `applaravel` sebelum migrasi ditulis.
- Nama kolom angka mengikuti `KOLOM_HARIAN`
  (`resources/js/Pages/Kasir/Rekap/Components/TableRekap.jsx:33`).
- Peran: `stafkontrol` (hanya wilayahnya), `superuser` boleh semua.
  `pusat` hanya melihat.

## Struktur berkas

| Berkas | Tanggung jawab |
|---|---|
| `app/Helpers/RekapWilayah.php` (baru) | Rumus murni: saldo lama, persen, cek selisih. Tanpa DB, tanpa Eloquent. |
| `app/Models/RegionalCirculationRecap.php` (baru) | Model baris angka yang diketik. |
| `app/Models/RegionalCirculationRecapLog.php` (baru) | Model log. |
| `app/Http/Controllers/RekapWilayahController.php` (baru) | Halaman, simpan, cek, buka, log, ekspor Excel. |
| `app/Services/AngkaRekapWilayah.php` (baru) | Satu kueri agregat per wilayah per tanggal -> angka sistem per kantor, plus drop bulan rujukan (di-cache). |
| `resources/js/Pages/Laporan/RekapWilayah.jsx` (baru) | Halaman. |
| `resources/js/Pages/Laporan/RekapWilayah/TabelWilayah.jsx` (baru) | Tabel + sel input + tanda selisih. |
| `resources/js/Pages/Laporan/RekapWilayah/kolom.js` (baru) | Daftar kolom + rumus turunan di layar. |
| `resources/js/Pages/Laporan/RekapWilayah/ekspor.js` (baru) | Excel (`exceljs`). |
| `routes/web.php` | Rute baru. |
| `resources/js/Components/Sidebar.jsx` | Butir menu di grup Laporan. |
| `app_laravel/database/migrations/2026_11_24_100000_rekap_sirkulasi_wilayah.php` (baru, di app_laravel) | Dua tabel. |

---

## Tugas 1: Helper rumus (PHP murni)

**Berkas:**
- Buat: `app/Helpers/RekapWilayah.php`
- Uji: `.agents/uji/uji_rekap_wilayah.php`

**Antarmuka:**
- Menghasilkan (dipakai Tugas 3, 4, 5):
  - `RekapWilayah::persen(int $pembilang, int $penyebut): ?float` — null bila
    penyebut 0.
  - `RekapWilayah::saldoLama(int $dropBulanRujukan): int` —
    `round($drop * 1.3)`.
  - `RekapWilayah::sirkulasiBerjalan(int $saldoSebelum, int $drop, int $storting): int`
    — `round($saldoSebelum + $drop * 1.3 - $storting)`.
  - `RekapWilayah::bulanRujukan(string $tanggal, string $jenis): string` —
    `$jenis` `'cm'` -> bulan T−3, `'mb'` -> bulan T−4; kembalian `'Y-m-01'`.

- [ ] **Langkah 1: tulis uji yang gagal**

Berkas `.agents/uji/uji_rekap_wilayah.php`:

```php
<?php
// Uji rumus Rekap Sirkulasi Wilayah. Tanpa Laravel, tanpa DB.
// Jalankan: php .agents/uji/uji_rekap_wilayah.php
require __DIR__ . '/../../app/Helpers/RekapWilayah.php';

use App\Helpers\RekapWilayah;

// persen
assert(RekapWilayah::persen(103_565_000, 614_300_000) !== null);
assert(round(RekapWilayah::persen(103_565_000, 614_300_000), 4) === 0.1686);
assert(RekapWilayah::persen(1000, 0) === null, 'penyebut 0 -> null');
assert(RekapWilayah::persen(0, 1000) === 0.0);

// saldoLama = drop * 1,3
assert(RekapWilayah::saldoLama(100_000_000) === 130_000_000);
assert(RekapWilayah::saldoLama(0) === 0);
assert(RekapWilayah::saldoLama(3) === 4, 'pembulatan: 3*1,3 = 3,9 -> 4');

// sirkulasi berjalan
assert(RekapWilayah::sirkulasiBerjalan(1_000_000, 100_000, 50_000) === 1_080_000);
assert(RekapWilayah::sirkulasiBerjalan(0, 0, 0) === 0);

// bulan rujukan: CM = T-3, MB = T-4
assert(RekapWilayah::bulanRujukan('2026-11-23', 'cm') === '2026-08-01');
assert(RekapWilayah::bulanRujukan('2026-11-23', 'mb') === '2026-07-01');
assert(RekapWilayah::bulanRujukan('2026-01-15', 'cm') === '2025-10-01', 'lintas tahun');
assert(RekapWilayah::bulanRujukan('2026-03-31', 'cm') === '2025-12-01', 'akhir bulan tidak meluber');

echo "OK semua\n";
```

- [ ] **Langkah 2: jalankan, pastikan gagal**

```bash
docker exec unit-app php -d zend.assertions=1 .agents/uji/uji_rekap_wilayah.php
```

Diharapkan: gagal, `Failed opening required ... RekapWilayah.php`.

- [ ] **Langkah 3: tulis helper**

```php
<?php

namespace App\Helpers;

/**
 * Rumus Rekap Sirkulasi Wilayah (.agents/rekap_sirkulasi_wilayah.md).
 *
 * Sengaja tanpa Eloquent dan tanpa Carbon: supaya bisa diuji dengan
 * `php .agents/uji/uji_rekap_wilayah.php` tanpa menyentuh ubmi_db.
 */
class RekapWilayah
{
    /** Pengali sirkulasi & saldo lama; sama dengan yang dipakai RekapTrait. */
    public const PENGALI = 1.3;

    /** Pembilang/penyebut; null kalau penyebut 0 (bukan 0, supaya layar bisa menulis '-'). */
    public static function persen(int $pembilang, int $penyebut): ?float
    {
        if ($penyebut === 0) {
            return null;
        }

        return $pembilang / $penyebut;
    }

    /** Saldo lama CM/MB = jumlah drop bulan rujukan x 1,3. */
    public static function saldoLama(int $dropBulanRujukan): int
    {
        return (int) round($dropBulanRujukan * self::PENGALI);
    }

    /** Sirkulasi hari ini = saldo sebelumnya + drop x 1,3 - storting. */
    public static function sirkulasiBerjalan(int $saldoSebelum, int $drop, int $storting): int
    {
        return (int) round($saldoSebelum + $drop * self::PENGALI - $storting);
    }

    /** Bulan rujukan saldo lama: CM = T-3, MB = T-4. Kembalian 'Y-m-01'. */
    public static function bulanRujukan(string $tanggal, string $jenis): string
    {
        $mundur = ['cm' => 3, 'mb' => 4][$jenis] ?? throw new \InvalidArgumentException("jenis: $jenis");

        // Pakai hari ke-1 supaya 31 Maret - 3 bulan tidak meluber ke Desember.
        [$th, $bl] = array_map('intval', explode('-', substr($tanggal, 0, 7)));
        $total = $th * 12 + ($bl - 1) - $mundur;

        return sprintf('%04d-%02d-01', intdiv($total, 12), $total % 12 + 1);
    }
}
```

- [ ] **Langkah 4: jalankan, pastikan lulus**

```bash
docker exec unit-app php -d zend.assertions=1 .agents/uji/uji_rekap_wilayah.php
```

Diharapkan: `OK semua`.

- [ ] **Langkah 5: commit**

```bash
git add app/Helpers/RekapWilayah.php .agents/uji/uji_rekap_wilayah.php
git commit -m "Rekap wilayah: helper rumus saldo lama, persen, bulan rujukan"
```

---

## Tugas 2: Migrasi dua tabel (di app_laravel)

**Berkas:**
- Buat: `../app_laravel/database/migrations/2026_11_24_100000_rekap_sirkulasi_wilayah.php`

**Antarmuka:**
- Menghasilkan: tabel `regional_circulation_recaps` dan
  `regional_circulation_recap_logs` (kolom seperti spec §3).

- [ ] **Langkah 1: kabari sesi app_laravel**

Kirim lewat `SendMessage` ke sesi `applaravel`: dua tabel baru untuk unit-apps,
nama berkas migrasi, dan bahwa mas yang akan menjalankan `migrate`.
Tunggu balasan bahwa tidak ada tabrakan nama berkas.

- [ ] **Langkah 2: tulis migrasi**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Rekap Sirkulasi Wilayah (unit-apps): angka WA kasir yang diketik staf
// kontrol + log tiap perubahan. Lihat unit-apps/.agents/rekap_sirkulasi_wilayah.md
return new class extends Migration {
    public function up(): void
    {
        Schema::create('regional_circulation_recaps', function (Blueprint $t) {
            $t->id();
            $t->foreignId('branch_id')->constrained('branches');
            $t->date('tanggal');
            // Salinan saat disimpan: kantor bisa pindah wilayah.
            $t->unsignedTinyInteger('wilayah');

            foreach ([
                'drop', 'total_drop', 'storting', 'total_storting', 'sirkulasi',
                'angsuran_cm', 'total_angsuran_cm', 'saldo_cm',
                'angsuran_mb', 'total_angsuran_mb', 'saldo_mb',
                'angsuran_ml', 'total_angsuran_ml', 'saldo_ml',
                'awal_sirkulasi', 'awal_cm', 'awal_mb', 'awal_ml',
                'saldo_lama_cm', 'saldo_lama_mb',
            ] as $kolom) {
                $t->bigInteger($kolom)->nullable();
            }

            $t->foreignId('checked_by')->nullable()->constrained('users');
            $t->timestamp('checked_at')->nullable();
            $t->timestamps();

            $t->unique(['branch_id', 'tanggal']);
            $t->index(['wilayah', 'tanggal']);
        });

        Schema::create('regional_circulation_recap_logs', function (Blueprint $t) {
            $t->id();
            $t->foreignId('regional_circulation_recap_id')
                ->constrained('regional_circulation_recaps')->cascadeOnDelete();
            $t->foreignId('user_id')->constrained('users');
            $t->string('action', 10); // ubah | cek | buka
            $t->string('field', 32)->nullable();
            $t->bigInteger('old_value')->nullable();
            $t->bigInteger('new_value')->nullable();
            $t->string('reason')->nullable(); // wajib untuk 'buka'
            $t->timestamp('created_at')->useCurrent();

            $t->index('regional_circulation_recap_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('regional_circulation_recap_logs');
        Schema::dropIfExists('regional_circulation_recaps');
    }
};
```

- [ ] **Langkah 3: commit di app_laravel (jangan migrate, jangan push)**

```bash
git -C ../app_laravel add database/migrations/2026_11_24_100000_rekap_sirkulasi_wilayah.php
git -C ../app_laravel commit -m "feat(unit-apps): tabel rekap sirkulasi wilayah + log"
```

- [ ] **Langkah 4: minta mas menjalankan migrasi**

Berhenti dan laporkan. Perintahnya untuk mas:

```bash
docker exec laravel-app php artisan migrate --force
```

---

## Tugas 3: Angka sistem per wilayah per tanggal

**Berkas:**
- Buat: `app/Services/AngkaRekapWilayah.php`
- Rujukan: `app/Traits/RekapTrait.php:179-478` (`getRekapDuaData`, satu kantor)

**Antarmuka:**
- Memakai: `RekapWilayah::saldoLama`, `RekapWilayah::bulanRujukan` (Tugas 1).
- Menghasilkan (dipakai Tugas 4):
  `AngkaRekapWilayah::untukWilayah(int $wilayah, string $tanggal): array`
  -> `[branch_id => [...kolom KOLOM_HARIAN..., 'saldo_lama_cm' => int, 'saldo_lama_mb' => int]]`.

**Catatan penting sebelum menulis:**

1. `getRekapDuaData` menghitung **satu kantor** dan menarik `TransactionLoan`,
   `TransactionLoanInstalment`, `TransactionSirculation` per kelompok. Jangan
   memanggilnya 10 kali dalam satu permintaan.
2. Ambil `TransactionLoanOfficerGrouping` untuk **semua** kantor di wilayah
   sekaligus, lalu pakai kueri agregat yang sama seperti `getRekapDuaData`
   (`selectRaw` + `groupBy`) tetapi dikelompokkan per `branch_id`.
3. **Gerbang alur baru per kantor**: `AgregasiScope::pakaiAgregatBaru($branch_id,
   $tanggal)`. Per 2026-11-23 gerbang itu benar untuk **139 dari 142** kantor
   aktif, jadi alur lama hanya menyangkut 3 kantor — tetap harus ditangani.
   Saldo awal bulan alur baru dari `TransactionMonthlyClosing` (`awal_total`,
   `awal_cm`, `awal_mb`, `awal_ml`), alur lama dari `TransactionSirculation`
   (`amount`, `cm_amount`, `mb_amount`, `ml_amount`). Pisahkan daftar
   grouping id menurut gerbang itu, jalankan dua kueri saldo awal, lalu gabung.

6. **Drop dan storting harian JANGAN diambil dari `transaction_daily_closings`.**
   Dicek pada 2026-11-20: 1.363 baris dari 137 kantor, tetapi `SUM(drop)` dan
   `SUM(storting)` keduanya 0 dan tidak satu baris pun `drop > 0`. Kolom
   agregat di tabel itu belum pernah diisi. Ikuti Rekap 2: drop dari
   `transaction_loans`, storting dari `transaction_loan_instalments`.
4. Mutasi kelompok: pakai `Mutasi::saring()` dan `Mutasi::kelompokSql()` seperti
   `getRekapDuaData`, supaya pinjaman yang pindah kelompok tidak hilang. Di sini
   hasilnya dijumlah per kantor, jadi mutasi antar kelompok dalam satu kantor
   tidak mengubah total.
5. **Drop bulan rujukan** untuk saldo lama: satu kueri tambahan,
   `SUM(nominal_drop)` per `branch_id` untuk `drop_date` dalam bulan
   `RekapWilayah::bulanRujukan($tanggal, 'cm')` dan `'mb'`,
   `where('status', 'success')`. Sumbernya **`transaction_loans`**, bukan
   `transaction_monthly_closings.drop` dan bukan tabel baru — alasannya di
   spec §6 (closing hanya ada sejak Oktober 2026, dan drop Oktobernya sudah
   menyimpang 834,8 juta di Sidoarjo 2 serta Solo 1).
   Angkanya tetap sebulan, jadi bungkus dengan `Cache::remember`:

```php
    /** Drop bulan rujukan per kantor; tetap sebulan, jadi boleh di-cache. */
    private static function dropBulan(int $wilayah, string $periode): array
    {
        return \Cache::remember("drop_bulan:$wilayah:$periode", now()->addHours(6), function () use ($wilayah, $periode) {
            // TODO-isi: SUM(nominal_drop) per branch_id, status success,
            // drop_date dalam bulan $periode, disaring Mutasi::saring.
        });
    }
```

   Diukur sebelum rencana ini ditulis: satu wilayah (32 kantor) dua bulan =
   0,9 detik. Jadi tidak perlu tabel agregasi.

- [ ] **Langkah 1: tulis service**

Kerangka yang harus diisi (isi kueri mengikuti `getRekapDuaData`):

```php
<?php

namespace App\Services;

use App\Helpers\RekapWilayah;
use App\Models\Branch;
use App\Models\TransactionLoanOfficerGrouping;

/**
 * Angka sistem untuk Rekap Sirkulasi Wilayah: nilai bawaan tiap sel sebelum
 * staf kontrol menimpanya dengan angka WA kasir.
 *
 * Satu kueri agregat per wilayah, bukan getRekapDuaData() per kantor:
 * satu wilayah berisi 8-10 kantor x 10 kelompok.
 */
class AngkaRekapWilayah
{
    /** @return array<int, array<string, int>> branch_id => kolom */
    public static function untukWilayah(int $wilayah, string $tanggal): array
    {
        $kantor = Branch::where('wilayah', $wilayah)->where('isactive', true)
            ->orderBy('unit')->get(['id', 'unit']);

        $grouping = TransactionLoanOfficerGrouping::whereIn('branch_id', $kantor->pluck('id'))
            ->get(['id', 'branch_id']);

        // TODO-isi: kueri drop, angsuran, saldo awal (dua alur), lalu jumlah
        // per branch_id. Rumus tiap kolom IDENTIK dengan RekapTrait:300-470.
        // sirkulasi  = saldoAwal + total_drop * 1,3 - total_storting
        // saldo_cm   = awal_cm - total_angsuran_cm   (mb, ml sama polanya)
    }
}
```

- [ ] **Langkah 2: bandingkan dengan Rekap 2 lewat tinker (baca saja)**

```bash
docker exec unit-app php artisan tinker --execute="dump(App\Services\AngkaRekapWilayah::untukWilayah(1, '2026-11-20'));"
```

Buka Rekap 2 untuk satu kantor di wilayah itu pada tanggal yang sama, lalu
cocokkan kolom per kolom. **Angkanya harus sama persis.** Kalau beda, cari
sebabnya di kueri, jangan ditambal di layar.

- [ ] **Langkah 3: commit**

```bash
git add app/Services/AngkaRekapWilayah.php
git commit -m "Rekap wilayah: angka sistem per kantor dalam satu kueri wilayah"
```

---

## Tugas 4: Model + halaman baca saja

**Berkas:**
- Buat: `app/Models/RegionalCirculationRecap.php`,
  `app/Models/RegionalCirculationRecapLog.php`,
  `app/Http/Controllers/RekapWilayahController.php`,
  `resources/js/Pages/Laporan/RekapWilayah.jsx`,
  `resources/js/Pages/Laporan/RekapWilayah/kolom.js`,
  `resources/js/Pages/Laporan/RekapWilayah/TabelWilayah.jsx`
- Ubah: `routes/web.php`, `resources/js/Components/Sidebar.jsx`

**Antarmuka:**
- Memakai: `AngkaRekapWilayah::untukWilayah` (Tugas 3), `RekapWilayah::persen`
  (Tugas 1).
- Menghasilkan: rute `laporan.rekap_wilayah` (GET), prop halaman
  `{ wilayah, tanggal, hari_kerja_ke, daftar_wilayah, baris: [...], boleh_ubah }`.
  Tiap `baris` = `{ branch_id, unit, sistem: {...}, diketik: {...}|null,
  checked_by_nama, checked_at }`.

- [ ] **Langkah 1: model**

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RegionalCirculationRecap extends Model
{
    /** Kolom angka yang diketik staf kontrol; urutannya = urutan kolom layar. */
    public const KOLOM_ANGKA = [
        'drop', 'total_drop', 'storting', 'total_storting', 'sirkulasi',
        'angsuran_cm', 'total_angsuran_cm', 'saldo_cm',
        'angsuran_mb', 'total_angsuran_mb', 'saldo_mb',
        'angsuran_ml', 'total_angsuran_ml', 'saldo_ml',
    ];

    /** Hanya diisi di tanggal 1. */
    public const KOLOM_AWAL = ['awal_sirkulasi', 'awal_cm', 'awal_mb', 'awal_ml'];

    protected $guarded = ['id'];

    protected $casts = ['tanggal' => 'date', 'checked_at' => 'datetime'];

    public function logs()
    {
        return $this->hasMany(RegionalCirculationRecapLog::class);
    }

    public function pengecek()
    {
        return $this->belongsTo(User::class, 'checked_by');
    }

    public function terkunci(): bool
    {
        return $this->checked_at !== null;
    }
}
```

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RegionalCirculationRecapLog extends Model
{
    public const UPDATED_AT = null;

    public const UBAH = 'ubah';
    public const CEK = 'cek';
    public const BUKA = 'buka';

    protected $guarded = ['id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
```

- [ ] **Langkah 2: controller (baru `index` saja)**

```php
<?php

namespace App\Http\Controllers;

use App\Helpers\AuthScope;
use App\Models\Branch;
use App\Models\RegionalCirculationRecap;
use App\Models\WorkDay;
use App\Services\AngkaRekapWilayah;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RekapWilayahController extends Controller
{
    /** Yang boleh mengetik/cek/buka. Peran lain hanya melihat. */
    private const PERAN_UBAH = ['stafkontrol', 'superuser'];

    public function index(Request $request)
    {
        $user = auth()->user();
        abort_unless($user?->hasAnyRole(['stafkontrol', 'superuser', 'pusat']), 403);

        $tanggal = \Carbon\Carbon::parse($request->tanggal ?? now())->toDateString();
        $wilayah = $this->wilayahTerpilih($request);

        $sistem = AngkaRekapWilayah::untukWilayah($wilayah, $tanggal);
        $diketik = RegionalCirculationRecap::with('pengecek.employee:id,nama_karyawan')
            ->where('tanggal', $tanggal)
            ->whereIn('branch_id', array_keys($sistem))
            ->get()->keyBy('branch_id');

        $unit = Branch::whereIn('id', array_keys($sistem))->pluck('unit', 'id');

        return Inertia::render('Laporan/RekapWilayah', [
            'wilayah' => $wilayah,
            'tanggal' => $tanggal,
            'hari_kerja_ke' => $this->hariKerjaKe($tanggal),
            'daftar_wilayah' => $this->wilayahBoleh(),
            'boleh_ubah' => $user->hasAnyRole(self::PERAN_UBAH),
            'baris' => collect($sistem)->map(fn ($angka, $id) => [
                'branch_id' => (int) $id,
                'unit' => $unit[$id] ?? '-',
                'sistem' => $angka,
                'diketik' => ($d = $diketik->get($id)) ? $d->only([
                    ...RegionalCirculationRecap::KOLOM_ANGKA,
                    ...RegionalCirculationRecap::KOLOM_AWAL,
                    'saldo_lama_cm', 'saldo_lama_mb',
                ]) : null,
                'terkunci' => (bool) $d?->terkunci(),
                'checked_by_nama' => $d?->pengecek?->employee?->nama_karyawan,
                'checked_at' => $d?->checked_at?->format('d/m/Y H:i'),
            ])->values(),
        ]);
    }

    /** Hari kerja ke-n dalam bulan tanggal itu (kalender WorkDay). */
    private function hariKerjaKe(string $tanggal): ?int
    {
        $urut = WorkDay::hariKerjaBulan($tanggal)
            ->map(fn ($t) => $t->toDateString())->values()
            ->search($tanggal);

        return $urut === false ? null : $urut + 1;
    }

    /** Wilayah yang boleh dilihat user: superuser/pusat semua, stafkontrol zonanya. */
    private function wilayahBoleh(): array
    {
        $ids = Branch::getAllowedBranchIds(auth()->user());

        return Branch::where('isactive', true)
            ->when($ids !== null, fn ($q) => $q->whereIn('id', $ids))
            ->distinct()->orderBy('wilayah')->pluck('wilayah')
            ->filter()->values()->all();
    }

    private function wilayahTerpilih(Request $request): int
    {
        $boleh = $this->wilayahBoleh();
        $minta = (int) ($request->wilayah ?: AuthScope::resolve()->wilayah);

        // Staf kontrol tidak bisa mengintip wilayah lain lewat query string.
        return in_array($minta, $boleh, true) ? $minta : ($boleh[0] ?? abort(403, \App\Helpers\AppHelper::PESAN_BUKAN_WILAYAH));
    }
}
```

- [ ] **Langkah 3: rute**

Di `routes/web.php`, dekat rute checklist laporan (sekitar baris 44):

```php
// Rekap Sirkulasi Wilayah: pengganti Excel staf kontrol (.agents/rekap_sirkulasi_wilayah.md).
Route::middleware(['auth'])->controller(\App\Http\Controllers\RekapWilayahController::class)
  ->prefix('laporan/rekap-wilayah')->name('laporan.rekap_wilayah.')->group(function () {
    Route::get('/', 'index')->name('index');
  });
```

- [ ] **Langkah 4: daftar kolom di frontend**

`resources/js/Pages/Laporan/RekapWilayah/kolom.js`:

```js
// Kolom Rekap Sirkulasi Wilayah, urutan mengikuti Excel staf kontrol.
// ketik: true = sel yang diisi staf kontrol. hitung: nilainya dihitung di layar.
export const BLOK = [
  {
    judul: 'Sirkulasi',
    kolom: [
      { k: 'drop', j: 'Drop', ketik: true },
      { k: 'total_drop', j: 'Jumlah Drop', ketik: true },
      { k: 'storting', j: 'Storting', ketik: true },
      { k: 'total_storting', j: 'Jumlah Storting', ketik: true },
      { k: 'sirkulasi', j: 'Saldo', ketik: true, tebal: true },
    ],
  },
  {
    judul: 'Calon Macet',
    kolom: [
      { k: 'angsuran_cm', j: 'Angs', ketik: true },
      { k: 'total_angsuran_cm', j: 'Jumlah', ketik: true },
      { k: 'saldo_cm', j: 'Saldo', ketik: true, tebal: true },
      { k: 'persen_cm', j: '%', hitung: true },
      { k: 'saldo_lama_cm', j: 'Saldo Lama' },
    ],
  },
  {
    judul: 'Macet Baru',
    kolom: [
      { k: 'angsuran_mb', j: 'Angs', ketik: true },
      { k: 'total_angsuran_mb', j: 'Jumlah', ketik: true },
      { k: 'saldo_mb', j: 'Saldo', ketik: true, tebal: true },
      { k: 'persen_mb', j: '%', hitung: true },
      { k: 'saldo_lama_mb', j: 'Saldo Lama' },
    ],
  },
  {
    judul: 'Macet Lama',
    kolom: [
      { k: 'angsuran_ml', j: 'Angs', ketik: true },
      { k: 'total_angsuran_ml', j: 'Jumlah', ketik: true },
      { k: 'saldo_ml', j: 'Saldo', ketik: true, tebal: true },
      { k: 'persen_ml', j: '%', hitung: true },
    ],
  },
];

export const KOLOM_KETIK = BLOK.flatMap((b) => b.kolom).filter((k) => k.ketik).map((k) => k.k);

/** Persen; null kalau penyebut 0 supaya layar menulis '-'. Cermin RekapWilayah::persen di PHP. */
export const persen = (pembilang, penyebut) => (penyebut ? pembilang / penyebut : null);

/** Nilai satu sel: yang diketik kalau ada, kalau belum pakai angka sistem. */
export const nilai = (baris, k) => baris.diketik?.[k] ?? baris.sistem?.[k] ?? 0;

/** Kolom turunan, dihitung dari nilai() baris. */
export const turunan = (baris, k) => {
  if (k === 'persen_cm') return persen(nilai(baris, 'saldo_cm'), nilai(baris, 'saldo_lama_cm'));
  if (k === 'persen_mb') return persen(nilai(baris, 'saldo_mb'), nilai(baris, 'saldo_lama_mb'));
  if (k === 'persen_ml') return persen(nilai(baris, 'saldo_ml'), nilai(baris, 'sirkulasi'));
  return null;
};
```

- [ ] **Langkah 5: tabel baca saja**

`TabelWilayah.jsx`: header dua lapis (baris 1 = judul blok dengan `colSpan`,
baris 2 = judul kolom), satu baris per kantor, lalu baris total. Angka pakai
`Intl.NumberFormat('id-ID')`, persen `toLocaleString('id-ID', { style:
'percent', minimumFractionDigits: 2 })`, dan `null` ditulis `-`.

Baris total: tiap kolom angka dijumlah; persen dihitung dari jumlah pembilang
dibagi jumlah penyebut (bukan rata-rata persen kantor — spec §2).

`RekapWilayah.jsx`: `Head`, judul, `select` wilayah, `input type="date"`,
keterangan `HARI KERJA KE-n`, lalu `<TabelWilayah>`. Ubah filter =
`router.get(route('laporan.rekap_wilayah.index'), { wilayah, tanggal },
{ preserveState: true })`.

- [ ] **Langkah 6: menu**

Di `resources/js/Components/Sidebar.jsx`, grup Laporan (sekitar baris 327):
tambah butir, dan longgarkan syarat tampil supaya `stafkontrol` ikut melihatnya.

```jsx
{(isSuperUser || auth?.roles?.includes('pusat') || auth?.roles?.includes('stafkontrol')) && (
  <SidebarSubMenuSection
    icon={ClipboardCheck}
    title="Laporan"
    items={[
      ...(isSuperUser || auth?.roles?.includes('pusat')
        ? [{ id: 'lap-checklist', title: 'Checklist Aplikasi Baru', link: route('checklist.laporan'), active: route().current('checklist.laporan') }]
        : []),
      { id: 'lap-rekap-wilayah', title: 'Rekap Sirkulasi Wilayah', link: route('laporan.rekap_wilayah.index'), active: route().current('laporan.rekap_wilayah.*') },
    ]}
  />
)}
```

- [ ] **Langkah 7: buka di browser**

Buka `/laporan/rekap-wilayah`. Pastikan: tabel muncul, angka bawaan sama dengan
Rekap 2, HARI KERJA KE-n benar, ganti wilayah dan tanggal berfungsi.
HMR jalan, tidak perlu `npm run build`.

- [ ] **Langkah 8: commit**

```bash
git add app/Models/RegionalCirculationRecap.php app/Models/RegionalCirculationRecapLog.php app/Http/Controllers/RekapWilayahController.php resources/js/Pages/Laporan/RekapWilayah.jsx resources/js/Pages/Laporan/RekapWilayah/ routes/web.php resources/js/Components/Sidebar.jsx
git commit -m "Rekap wilayah: halaman baca saja per wilayah per tanggal"
```

---

## Tugas 5–8 DITUNDA

Mas menyetujui Tugas 1–4 saja (2026-11-23). **Jangan kerjakan Tugas 5 sampai 8
sebelum diminta.** Rinciannya tetap di bawah supaya tidak perlu disusun ulang.

---

## Tugas 5: Ketik, simpan, tanda selisih

**Berkas:**
- Ubah: `app/Http/Controllers/RekapWilayahController.php`,
  `resources/js/Pages/Laporan/RekapWilayah/TabelWilayah.jsx`,
  `resources/js/Pages/Laporan/RekapWilayah/kolom.js`, `routes/web.php`
- Uji: `.agents/uji/uji_rekap_wilayah.php` (tambah bagian selisih)

**Antarmuka:**
- Menghasilkan: rute `laporan.rekap_wilayah.simpan` (POST
  `/laporan/rekap-wilayah/{branch}`), menerima
  `{ tanggal, nilai: { drop: int|null, ... } }`.
  `RekapWilayah::selisihRantai()` untuk cek kumulatif.

- [ ] **Langkah 1: tambah uji selisih yang gagal**

Tambahkan ke `.agents/uji/uji_rekap_wilayah.php`, sebelum `echo`:

```php
// selisihRantai: kumulatif kemarin + mutasi hari ini vs kumulatif hari ini.
assert(RekapWilayah::selisihRantai(1000, 200, 1200) === 0, 'cocok');
assert(RekapWilayah::selisihRantai(1000, 200, 1250) === 50, 'kelebihan 50');
assert(RekapWilayah::selisihRantai(1000, 200, 1100) === -100, 'kurang 100');
// Tidak ada data kemarin -> tidak bisa dinilai.
assert(RekapWilayah::selisihRantai(null, 200, 1200) === null);
```

- [ ] **Langkah 2: jalankan, pastikan gagal**

```bash
docker exec unit-app php -d zend.assertions=1 .agents/uji/uji_rekap_wilayah.php
```

Diharapkan: gagal, `Call to undefined method ... selisihRantai()`.

- [ ] **Langkah 3: tambah metode di helper**

```php
    /**
     * Selisih rantai kumulatif: (kemarin + mutasi) dibanding kumulatif hari ini.
     * 0 = cocok, null = belum bisa dinilai (tidak ada angka kemarin).
     */
    public static function selisihRantai(?int $kumulatifKemarin, int $mutasi, int $kumulatifIni): ?int
    {
        if ($kumulatifKemarin === null) {
            return null;
        }

        return $kumulatifIni - ($kumulatifKemarin + $mutasi);
    }
```

- [ ] **Langkah 4: jalankan, pastikan lulus**

```bash
docker exec unit-app php -d zend.assertions=1 .agents/uji/uji_rekap_wilayah.php
```

Diharapkan: `OK semua`.

- [ ] **Langkah 5: endpoint simpan**

Di controller, tambah:

```php
    /** Simpan angka WA kasir untuk satu kantor pada satu tanggal. */
    public function simpan(Request $request, Branch $branch)
    {
        $this->pastikanBolehUbah($branch);

        $tanggal = \Carbon\Carbon::parse($request->tanggal)->toDateString();
        $kolom = [...RegionalCirculationRecap::KOLOM_ANGKA, ...RegionalCirculationRecap::KOLOM_AWAL];

        $data = $request->validate(
            collect($kolom)->mapWithKeys(fn ($k) => ["nilai.$k" => 'nullable|integer|min:0'])->all()
        )['nilai'] ?? [];

        \DB::transaction(function () use ($branch, $tanggal, $data, $kolom) {
            $baris = RegionalCirculationRecap::lockForUpdate()
                ->firstOrNew(['branch_id' => $branch->id, 'tanggal' => $tanggal]);

            // Baris yang sudah dicek terkunci: harus dibuka dulu (dengan alasan).
            abort_if($baris->terkunci(), 422, 'Baris sudah dicek. Buka dulu untuk mengubah.');

            $baris->wilayah = $branch->wilayah;
            $baris->save();

            foreach ($kolom as $k) {
                if (!array_key_exists($k, $data)) {
                    continue;
                }
                $lama = $baris->$k;
                $baru = $data[$k] === null ? null : (int) $data[$k];
                if ($lama === $baru) {
                    continue;
                }
                $baris->$k = $baru;
                $baris->logs()->create([
                    'user_id' => auth()->id(),
                    'action' => RegionalCirculationRecapLog::UBAH,
                    'field' => $k,
                    'old_value' => $lama,
                    'new_value' => $baru,
                ]);
            }
            $baris->save();
        });

        return back();
    }

    /** Boleh mengubah: stafkontrol di wilayahnya sendiri, atau superuser. */
    private function pastikanBolehUbah(Branch $branch): void
    {
        $user = auth()->user();
        abort_unless($user?->hasAnyRole(self::PERAN_UBAH), 403);

        if ($user->hasRole('superuser')) {
            return;
        }

        $ids = Branch::getAllowedBranchIds($user);
        abort_if($ids !== null && !in_array($branch->id, $ids, true), 403, \App\Helpers\AppHelper::PESAN_BUKAN_WILAYAH);
    }
```

Rute:

```php
    Route::post('/{branch}', 'simpan')->name('simpan');
```

- [ ] **Langkah 6: angka kemarin untuk cek rantai**

Di `index`, tambah prop `kemarin`: baris `regional_circulation_recaps` pada
**hari kerja sebelumnya** (`WorkDay::hariKerjaBulan` mundur satu dari tanggal
ini; tanggal 1 -> tidak ada, layar memakai `awal_*`), dikunci per `branch_id`,
hanya kolom kumulatif (`total_*`, `sirkulasi`, `saldo_*`).

- [ ] **Langkah 7: sel input + tanda selisih**

Di `kolom.js` tambah:

```js
/** Dua jenis selisih per sel; null = tidak ada. Pesannya dipakai sebagai tooltip. */
export const tandaSelisih = (baris, kemarin, k) => {
  const diketik = baris.diketik?.[k];
  if (diketik == null) return null;

  const sistem = baris.sistem?.[k];
  if (sistem != null && diketik !== sistem) {
    return { jenis: 'sistem', pesan: `Sistem: ${sistem.toLocaleString('id-ID')}` };
  }

  const rantai = RANTAI[k];
  if (rantai && kemarin?.[k] != null) {
    const harusnya = kemarin[k] + (baris.diketik?.[rantai] ?? 0);
    if (harusnya !== diketik) {
      return { jenis: 'rantai', pesan: `Kemarin + hari ini = ${harusnya.toLocaleString('id-ID')}` };
    }
  }
  return null;
};

/** Kolom kumulatif -> kolom mutasi harian yang menambahnya. */
const RANTAI = {
  total_drop: 'drop',
  total_storting: 'storting',
  total_angsuran_cm: 'angsuran_cm',
  total_angsuran_mb: 'angsuran_mb',
  total_angsuran_ml: 'angsuran_ml',
};
```

Sirkulasi punya rumus sendiri (`kemarin.sirkulasi + drop * 1,3 - storting`),
tangani terpisah di `tandaSelisih`.

Di `TabelWilayah.jsx`: sel `ketik` jadi `<input>` angka bila `boleh_ubah` dan
baris belum terkunci. Sel dengan tanda selisih diberi latar kuning dan
`title` berisi pesannya. Simpan satu baris dengan `router.post(route(
'laporan.rekap_wilayah.simpan', branch_id), { tanggal, nilai })`.

**Simpan tetap boleh walau ada selisih** (spec §2) — tanda hanya penanda.

- [ ] **Langkah 8: coba di browser**

Ketik angka yang sengaja beda dari sistem, lalu simpan. Pastikan: tersimpan,
sel kuning, tooltip berisi angka sistem. Muat ulang halaman, angka tetap.

- [ ] **Langkah 9: commit**

```bash
git add -A app/Helpers/RekapWilayah.php .agents/uji/uji_rekap_wilayah.php app/Http/Controllers/RekapWilayahController.php resources/js/Pages/Laporan/RekapWilayah/ routes/web.php
git commit -m "Rekap wilayah: isian staf kontrol, simpan per baris, tanda selisih"
```

---

## Tugas 6: Cek, buka, log

**Berkas:**
- Ubah: `app/Http/Controllers/RekapWilayahController.php`, `routes/web.php`,
  `resources/js/Pages/Laporan/RekapWilayah/TabelWilayah.jsx`
- Buat: `resources/js/Pages/Laporan/RekapWilayah/DrawerLog.jsx`

**Antarmuka:**
- Memakai: `AngkaRekapWilayah::untukWilayah` (saldo lama saat Cek),
  `RegionalCirculationRecapLog` (Tugas 4).
- Menghasilkan: rute `.cek` (POST), `.buka` (POST, wajib `alasan`),
  `.log` (GET, JSON).

- [ ] **Langkah 1: endpoint cek**

```php
    /** Cek satu baris kantor: terkunci, saldo lama dibekukan, log 'cek'. */
    public function cek(Request $request, Branch $branch)
    {
        $this->pastikanBolehUbah($branch);
        $tanggal = \Carbon\Carbon::parse($request->tanggal)->toDateString();

        \DB::transaction(function () use ($branch, $tanggal) {
            $baris = RegionalCirculationRecap::lockForUpdate()
                ->where('branch_id', $branch->id)->where('tanggal', $tanggal)->first();

            abort_if(!$baris, 422, 'Belum ada angka yang diisi untuk kantor ini.');
            abort_if($baris->terkunci(), 422, 'Baris sudah dicek.');

            // Saldo lama dibekukan di sini: angka yang sudah dicek tidak boleh
            // bergeser kalau data drop lama dikoreksi (spec §3).
            $sistem = AngkaRekapWilayah::untukWilayah($branch->wilayah, $tanggal)[$branch->id] ?? [];
            $baris->saldo_lama_cm ??= $sistem['saldo_lama_cm'] ?? null;
            $baris->saldo_lama_mb ??= $sistem['saldo_lama_mb'] ?? null;

            $baris->checked_by = auth()->id();
            $baris->checked_at = now();
            $baris->save();

            $baris->logs()->create([
                'user_id' => auth()->id(),
                'action' => RegionalCirculationRecapLog::CEK,
            ]);
        });

        return back();
    }

    /** Buka baris yang sudah dicek. Alasan wajib dan masuk log. */
    public function buka(Request $request, Branch $branch)
    {
        $this->pastikanBolehUbah($branch);
        $alasan = $request->validate(['alasan' => 'required|string|max:255'])['alasan'];
        $tanggal = \Carbon\Carbon::parse($request->tanggal)->toDateString();

        \DB::transaction(function () use ($branch, $tanggal, $alasan) {
            $baris = RegionalCirculationRecap::lockForUpdate()
                ->where('branch_id', $branch->id)->where('tanggal', $tanggal)->firstOrFail();

            abort_unless($baris->terkunci(), 422, 'Baris ini belum dicek.');

            $baris->logs()->create([
                'user_id' => auth()->id(),
                'action' => RegionalCirculationRecapLog::BUKA,
                'reason' => $alasan,
            ]);

            $baris->checked_by = null;
            $baris->checked_at = null;
            $baris->save();
        });

        return back();
    }

    /** Riwayat satu baris, untuk drawer. */
    public function log(Request $request, Branch $branch)
    {
        $tanggal = \Carbon\Carbon::parse($request->tanggal)->toDateString();
        $baris = RegionalCirculationRecap::where('branch_id', $branch->id)
            ->where('tanggal', $tanggal)->first();

        return response()->json($baris
            ? $baris->logs()->with('user.employee:id,nama_karyawan')->orderByDesc('id')->get()
                ->map(fn ($l) => [
                    'aksi' => $l->action,
                    'kolom' => $l->field,
                    'lama' => $l->old_value,
                    'baru' => $l->new_value,
                    'alasan' => $l->reason,
                    'oleh' => $l->user?->employee?->nama_karyawan ?? '-',
                    'pada' => $l->created_at->format('d/m/Y H:i'),
                ])
            : []);
    }
```

Rute:

```php
    Route::post('/{branch}/cek', 'cek')->name('cek');
    Route::post('/{branch}/buka', 'buka')->name('buka');
    Route::get('/{branch}/log', 'log')->name('log');
```

- [ ] **Langkah 2: tombol di tabel**

Kolom terakhir tiap baris: belum dicek -> tombol **Cek**; sudah dicek ->
nama pengecek + jam, plus tombol **Buka** (dialog isi alasan). Ikon riwayat
membuka `DrawerLog` (`fetch` ke rute `.log`).

Kepala halaman: `n dari m kantor sudah dicek`.

- [ ] **Langkah 3: coba di browser**

Cek satu baris: input jadi mati, nama dan jam muncul. Coba simpan baris itu
lagi lewat `curl`/devtools, harus ditolak 422. Buka tanpa alasan: ditolak.
Buka dengan alasan: input hidup lagi, dan drawer log memuat tiga baris
(ubah, cek, buka).

- [ ] **Langkah 4: commit**

```bash
git add -A app/Http/Controllers/RekapWilayahController.php routes/web.php resources/js/Pages/Laporan/RekapWilayah/
git commit -m "Rekap wilayah: cek per baris, buka beralasan, log perubahan"
```

---

## Tugas 7: Ekspor PDF + Excel

**Berkas:**
- Buat: `resources/js/Pages/Laporan/RekapWilayah/ekspor.js`
- Ubah: `resources/js/Pages/Laporan/RekapWilayah.jsx`,
  `resources/js/Pages/Laporan/RekapWilayah/TabelWilayah.jsx`, `package.json`

- [ ] **Langkah 1: PDF lewat cetak browser**

Tombol **Cetak / PDF** memanggil `window.print()`. Tambah CSS cetak di
`RekapWilayah.jsx` (`@media print`): sembunyikan sidebar, filter, dan tombol;
tabel jadi `landscape` (`@page { size: A4 landscape; margin: 8mm }`); input
dirender sebagai teks biasa. Tanpa library.

- [ ] **Langkah 2: pasang exceljs**

```bash
docker exec unit-vite npm install exceljs@4.4.0
```

- [ ] **Langkah 3: ekspor .xlsx**

`ekspor.js`: satu fungsi `unduhExcel({ wilayah, tanggal, hariKerjaKe, baris })`.
Dua baris header (blok dengan sel gabung, lalu judul kolom), satu baris per
kantor, baris total, format angka `#,##0` dan persen `0.00%`. Nama berkas
`rekap-wilayah-{wilayah}-{tanggal}.xlsx`.

Impor dinamis supaya `exceljs` tidak masuk bundel awal:

```js
const { default: ExcelJS } = await import('exceljs');
```

- [ ] **Langkah 4: coba**

Unduh, buka di Excel. Pastikan header bertingkat utuh dan angkanya bisa
dijumlah (tersimpan sebagai angka, bukan teks).

- [ ] **Langkah 5: commit**

```bash
git add -A resources/js/Pages/Laporan/RekapWilayah/ package.json package-lock.json
git commit -m "Rekap wilayah: cetak PDF dan ekspor Excel"
```

---

## Tugas 8 (paling akhir, tunggu perintah mas): snapshot PNG

Mas menunda ini. Jangan dikerjakan sebelum diminta.

Rencananya: `html-to-image` -> `toPng` atas elemen tabel, unduh sebagai
`rekap-wilayah-{wilayah}-{tanggal}.png` untuk dikirim lewat WA.

---

## Catatan

- Setelah Tugas 2 dijalankan mas, jalankan juga
  `docker exec unit-app php artisan permission:cache-reset` **hanya kalau** ada
  permission baru. Rencana ini tidak menambah permission, jadi tidak perlu.
- Tidak ada perubahan cron. Rencana ini tidak memakai scheduler.
