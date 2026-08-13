# Skema Database `ubmi_db` (yang dipakai unit-apps)

Diambil langsung dari DB live (`information_schema`), bukan dari migration.
Akses: `docker exec laravel-db mysql -ularavel -psecret ubmi_db -e "..."`
Total 93 tabel di `ubmi_db`; di bawah ini hanya yang disentuh `unit-apps`. Sisanya milik `app_laravel` (HRIS, tabungan, aset, BOP) — **jangan diubah dari sini**.

Jumlah baris = snapshot per 2026-08-11, gunakan sebagai indikator beban query.

---

## 1. Inti transaksi (milik unit-apps)

### `transaction_loan_officer_groupings` — 1.590 baris (stabil sejak 08-01)
Kunci scoping **semua** data transaksi. Satu cabang = 10 kelompok (Mantri 1–10).
```
id, branch_id [idx], kelompok int, timestamps
```
Relasi: `belongsTo Branch`, `hasMany TransactionDailyRecap`, `hasMany TransactionSirculation`.

### `transaction_customers` — 496.656 baris
Identitas nasabah.
```
id, nama, nik [idx], no_kk, alamat, timestamps
```
Relasi: `hasMany TransactionManageCustomer`, `hasManyThrough` ke loan.
NIK prefix `UB`/`ML` → NIK sintetis dari `AppHelper::callUnknownNik()`.

### `transaction_manage_customers` — 870.464 baris
Keanggotaan nasabah pada satu kelompok + hari setoran. Nasabah yang sama bisa punya beberapa baris di sini (satu per kelompok/kantor tempat dia pinjam).
```
id, transaction_customer_id [idx], transaction_loan_officer_grouping_id,
day int (1=Senin..7=Minggu, dayOfWeekIso), residential_address,
alternative_name, status, notes varchar(45),
nomor_anggota varchar (BARU 2026-08-03, nullable, manual input), timestamps
```
- `residential_address` — "Domisili Nasabah", ada sejak migrasi Nov 2024 tapi baru disambungkan ke UI 2026-08-03 (form `PengajuanLama.jsx`). Alamat alternatif PER kelompok/kantor (beda dari `transaction_customers.alamat` yang levelnya per-NIK) — kosong berarti pakai alamat identitas sebagai fallback tampilan.
- `nomor_anggota` — sebelum 2026-08-03 UI selalu menampilkan `id` baris ini sebagai "nomor anggota" (keliru). Sekarang field asli, diisi manual & wajib lewat form pengajuan baru, tapi utamanya masih `NULL` untuk mayoritas baris lama (belum ada mekanisme backfill massal).

### `transaction_loans` — 1.954.557 baris ⚠️ TERPANAS
```
id
previous_loan_id (BARU 2026-08-03, nullable, indexed, tanpa FK)
postponed_loan_id (BARU 2026-08-03, nullable, indexed, tanpa FK)
transaction_manage_customer_id [idx]
transaction_loan_officer_grouping_id [idx]
old_id, drop_before, drop_date_before
drop_date date            -- tanggal pencairan
request_date date         -- tanggal pengajuan
request_nominal bigint    -- diajukan
user_mantri bigint        -- employees.id
approved_nominal bigint   -- disetujui (diisi saat status 'acc')
check_date, user_check    -- diisi saat acc/tolak/gagal
nominal_drop bigint, user_drop   -- diisi saat status 'success'
pinjaman bigint (⚠️ GENERATED COLUMN: `nominal_drop * 1.3`, STORED - TIDAK BISA ditulis manual lewat Eloquent/`create()`/`update()`, MySQL akan error 1906. Makanya selalu NULL sampai `nominal_drop` terisi di status 'success'. Ditemukan 2026-08-04 saat testing tinker), total_angsuran int
hari varchar              -- 'senin'..'sabtu' (huruf kecil, dari AppHelper::dateName)
pinjaman_ke int (⚠️ SELALU NULL, tidak pernah ditulis — nomor urut pinjaman ke berapa DIHITUNG on-the-fly di kode, lihat 06_fungsi_custom.md), status varchar, notes, user_input
drop_langsung tinyint(1)
out_date date, out_status varchar, transaction_out_reasons_id int
timestamps
```
- `previous_loan_id` — dipakai fitur "Pengajuan" (top-up/refinance, bagian U di CHANGELOG): kalau terisi, berarti pinjaman ini dibuat untuk melunasi pinjaman lama itu. `TransactionLoan::boot()` (hook `updating`) otomatis membuat baris angsuran pelunasan pada pinjaman lama begitu pinjaman INI status-nya jadi `'success'`. **Ikut disalin/diperpanjang** setiap kali lewat Tundaan, supaya hook auto-pelunasan tetap menemukan pinjaman asli walau sudah berapa kali ditunda.
- `postponed_loan_id` — dipakai fitur "Tundaan" (bagian W di CHANGELOG): kalau terisi, berarti pinjaman ini dibuat menggantikan pinjaman lain yang tanggal drop-nya ditunda (pinjaman lama jadi status `gagal`, TIDAK dihapus). **Terpisah dari `previous_loan_id`** supaya hook auto-pelunasan tidak salah nembak Tundaan sebagai pelunasan pinjaman lain.
**Nilai `status`**: `acc`, `tolak`, `success`, `gagal` (+ null saat baru diajukan).
Relasi: `hasMany loan_instalment`, `belongsTo manage_customer`, `belongsTo loan_officer_grouping`, `belongsTo Employee (user_input / user_mantri)`, `hasOne TransactionWhiteOff`.

> `hari` disimpan **redundan** terhadap `drop_date`. Banyak validasi membandingkan keduanya (`AppHelper::dateName($drop_date) !== $hari`) — `AdminController@loan_balancing` dibuat untuk mencari yang tidak sinkron.

### `transaction_loan_instalments` — 11.750.392 baris ⚠️ TERBESAR
```
id
transaction_loan_id [idx]
settled_by_loan_id (BARU 2026-08-04, nullable, indexed, tanpa FK)
transaction_loan_officer_grouping_id [idx]
transaction_date date, nominal bigint
status int                -- 1=normal, 2=cm, 3=mb, 4=ml (AppHelper::status_pinjaman)
instalment_notes, danatitipan smallint
user_input, user_mantri, timestamps
```
**Selalu filter minimal `transaction_loan_officer_grouping_id` + rentang tanggal.**
- `settled_by_loan_id` — terisi HANYA pada baris yang dibuat otomatis oleh hook pelunasan top-up (`TransactionLoan::boot()`, bagian U/Y di CHANGELOG). Nilainya = id pinjaman yang sukses drop dan memicu baris ini. Dipakai `reverseAutoSettlement()` untuk membongkar baris ini secara presisi kalau pinjaman pemicunya di-Reset/dihapus.

### `transaction_daily_recaps` — 482.076 baris
Rekap harian per kelompok. Kunci unik logis: `{transaction_loan_officer_grouping_id, date}` (dipakai `firstOrNew`/`firstOrCreate`).
```
id, transaction_loan_officer_grouping_id [idx], date, target_on
kasbon, storting, drop, transport, keluar, target  (bigint, BISA ditulis)
month1_amount, month2_amount, ccm_amount, cm_amount, mb_amount, ml_amount (int)
daily_kepala_approval   + daily_kepala_approval_user
daily_kasir_approval    + daily_kasir_approval_user
monthly_kepala_approval + monthly_kepala_approval_user
monthly_kasir_approval  + monthly_kasir_approval_user
timestamps
```

⚠️ **ENAM kolom di tabel ini adalah `VIRTUAL GENERATED` — TIDAK BISA DITULIS.**
Ada di `$fillable` (`TransactionDailyRecap.php:16-47`), tapi MySQL akan menolak.
Diverifikasi 2026-08-12 lewat `information_schema.columns.generation_expression`:
```
sharingdo = `drop` * 0.11                     ← ini do11, BUKAN kolom mati
titipan   = `drop` * 0.09
debt      = sharingdo + kasbon + storting
kred      = `drop` + transport
tunai     = debt - kred
masuk     = `drop` * 0.13
```
Konsekuensi yang sering salah dipahami:
- **`tunai` tidak pernah tersimpan.** Dia dihitung ulang tiap dibaca, jadi begitu `storting`
  berubah karena koreksi, tunai hari itu **ikut berubah surut, diam-diam, tanpa jejak**.
  Tidak ada cara merekonstruksi angka tunai yang dulu diteken kasir.
- **`sharingdo` BUKAN kolom mati** (dokumen lama sempat mengklaim begitu) — dia menyuplai
  `debt` → `tunai`. Membuangnya mematikan perhitungan tunai.
- `RekapTrait` menghitung ulang `$do11`/`$titipan9`/`$debit` sendiri di PHP (`:168-171`) dengan
  rumus identik, jadi ada dua perhitungan paralel untuk hal yang sama.

Alur approval: **kepala dulu** (`ceklist_kepala`) → **baru kasir** (`rekap_post` dengan `type=2`).

### `transaction_sirculations` — 69.879 baris
Saldo sirkulasi awal bulan per kelompok.
```
id, transaction_loan_officer_grouping_id [idx], date, day varchar, amount bigint,
month1_amount, month2_amount, ccm_amount (int), cm_amount, mb_amount, ml_amount (bigint), timestamps
```
Rumus sirkulasi berjalan (di `RekapTrait`): `round(saldo_awal + (total_drop * 1.3) - total_storting)`. Angka **1.3** = pokok + bunga 30%, muncul juga di `BatchInputController`.

### `transaction_white_offs` — 18.813 baris (turun dari 18.876 di 08-01 — kemungkinan ada baris dibersihkan/dikoreksi manual, belum ditelusuri)
Pemutihan pinjaman.
```
id, transaction_loan_id [idx], transaction_loan_officer_grouping_id, transaction_date, nominal, timestamps
```

### `transaction_out_reasons` — 6 baris
Master alasan keluar, dirujuk `transaction_loans.transaction_out_reasons_id`.

### `transaction_branch_daily_recaps` — 0 baris
**Hanya `id` + timestamps.** Model ada, tabel kosong tanpa kolom berarti — belum diimplementasi.

### View SQL
`v_is_balance_loan_with_daily_reports`, `v_is_balance_drop_with_daily_reports` — model `VIsBalanceLoanWithDailyReport` / `VIsBalanceDropWithDailyReport`. Hanya dipakai di route debug `/getviewasd` dan `AdminController` (import tak terpakai).

---

## 2. Master bersama dengan `app_laravel` (JANGAN diubah dari unit-apps)

### `branches` — 157 baris
```
id, type enum('pusat','cabang'), wilayah int, opening_date, unit varchar, isactive int, code varchar, timestamps
```
`wilayah` 0 = pusat, 1–12 = wilayah operasional. `code` dipakai sebagai suffix username (`EmployeeController@store`).

### `employees` — 7.378 baris
```
id, nip, nama_karyawan, nik, alamat, kota, hire_date,
area int              -- = nomor kelompok mantri (1..10)
branch_id int         -- cabang utama
janis_jaminan, date_resign, resign_status, resign_reson,
pencairan_simpanan_date/_by, handover_jaminan/_by, pencairan_simpanan_w_date/_by,
status_kontrak int, employment_id int, avatar,
has_ktp, has_kk, has_skck, has_ijazah, has_lamaran_kerja (tinyint)
timestamps
```
🔴 **Tidak ada kolom `jabatan`** — jabatan ada di `employments.jabatan` via `employment_id`. `BatchInputController@store` salah di sini.
`date_resign IS NULL` = karyawan aktif (dipakai `AppHelper::getMantri`).

### `users` — 2.625 baris
```
id, employee_id int, username, email, email_verified_at, password, remember_token, isactive int, timestamps
```
Login pakai **`username`**, bukan email. `isactive` dicek manual di `AuthenticatedSessionController@store`.

### `employments` — 8 baris — `id, jabatan, timestamps`
### `employment_permissions` — 8 baris — `id, employee_id, branch_id, can_create, timestamps` (legacy, model ada tapi tak dipakai jalur utama)
### `employee_branches` — 31 baris — `id, employee_id, branch_id, employment_id, timestamps`
Cabang tambahan struktural → dibaca kalau punya permission `view-delegated-branches`.
### `employee_zones` — 16 baris — `id, employee_id, branch_id, timestamps`
Zona pantau staf kontrol → dibaca kalau punya `view-zone-branches`.
### `user_zones` — 0 baris (model `UserZone` ada, tak dipakai)
### `online_branches` — 51 baris — `id, branch_id, online_date, timestamps`

### Spatie Permission
`roles` (8), `permissions` (21), `model_has_roles` (2.624), `model_has_permissions` (0), `role_has_permissions` (53). Detail isi: `03_auth_roles_scope.md`.

---

## 3. ⛔ Tabel & model LEGACY — SUDAH TIDAK DIPAKAI

**Tabel utama aplikasi ini hanya dua: `transaction_loans` dan `transaction_loan_instalments`.**
Skema pinjaman generasi sebelumnya di bawah ini **sudah mati** — jangan dibaca, jangan ditulis, jangan dijadikan acuan saat membuat fitur.

| Model | Tabel | Baris | Tulis terakhir |
|---|---|---:|---|
| `Loan` | `loans` | 9.640 | **2024-09-26** |
| `LoanRequest` | `loan_requests` | 13.222 | **2024-09-26** |
| `Instalment` | `instalments` | 94.004 | **2024-10-02** |
| `Customer` | `customers` | 8.086 | **2024-09-25** |
| `DebtRelief` | `debt_reliefs` | 0 | — |

Pembanding: `transaction_loans` = 1.954.557 baris (per 08-11), tulis terakhir **2026-07-27** waktu snapshot 08-01, masih aktif bertambah tiap hari. Kelima tabel legacy di atas terverifikasi **row count identik persis** dengan snapshot 08-01 — konfirmasi kuat bahwa memang benar-benar tidak ada tulisan baru sejak itu.

**Terverifikasi tidak ada pemakaian nyata di kode.** Semua rujukan hanyalah:
- `LoanController.php` — import `Customer`, `Loan`, `LoanRequest`, `Instalment`, tapi **badan kelas kosong** (`//`)
- `MantriAppsController.php` — import `Customer`, `Loan`, `LoanRequest`, tapi **badan kelas kosong** (`//`)
- `AdminController.php` — `use App\Models\Loan;` **import mati**, tidak pernah dipakai di badan
- Sisanya relasi antar-sesama model legacy (`Loan`↔`Instalment`↔`Customer`↔`LoanRequest`)

Padanannya di sistem sekarang:

| Legacy | Sekarang |
|---|---|
| `customers` | `transaction_customers` + `transaction_manage_customers` |
| `loans` / `loan_requests` | `transaction_loans` |
| `instalments` | `transaction_loan_instalments` |

**Jangan campur keduanya.** Nama kolomnya pun berbeda (`pembayaran_date` vs `transaction_date`, `mantri` vs `user_mantri`).

---

## 4. Diagram relasi inti

```
branches (157)
   └─< transaction_loan_officer_groupings (1.590)   [branch_id + kelompok]
          ├─< transaction_manage_customers (870rb) >── transaction_customers (497rb)
          │        └─< transaction_loans (1,95jt)
          │               ├─< transaction_loan_instalments (11,75jt)
          │               └─o transaction_white_offs (18,8rb)
          ├─< transaction_daily_recaps (482rb)      [+ date]
          └─< transaction_sirculations (69,9rb)     [+ date]

employees (7.378) ──< users (2.625) ──< model_has_roles ──> roles (8) ──< role_has_permissions ──> permissions (21)
   ├─ branch_id ────> branches            (cabang utama)
   ├─< employee_branches (31)  ──> branches   (delegasi struktural)
   ├─< employee_zones (16)     ──> branches   (zona staf kontrol)
   └─ employment_id ──> employments (8)
```

**Jalur query kanonik** untuk data transaksi:
`AuthScope::resolve()` → `{branch_id, kelompok}` → `TransactionLoanOfficerGrouping::where(branch_id)->where(kelompok)->first()` → `->id` dipakai memfilter `transaction_loans` / `transaction_loan_instalments` / `transaction_daily_recaps` / `transaction_sirculations`.

## 5. Perintah cepat

```bash
# daftar tabel + jumlah baris
docker exec laravel-db mysql -ularavel -psecret -N -e \
  "SELECT table_name, table_rows FROM information_schema.tables WHERE table_schema='ubmi_db' ORDER BY table_name;"

# kolom satu tabel
docker exec laravel-db mysql -ularavel -psecret -N -e \
  "SELECT column_name, column_type, is_nullable, column_key FROM information_schema.columns
   WHERE table_schema='ubmi_db' AND table_name='transaction_loans' ORDER BY ordinal_position;"

# role + permission-nya
docker exec laravel-db mysql -ularavel -psecret -N ubmi_db -e \
  "SELECT r.name, GROUP_CONCAT(p.name ORDER BY p.name) FROM role_has_permissions rp
   JOIN roles r ON r.id=rp.role_id JOIN permissions p ON p.id=rp.permission_id GROUP BY r.name;"
```
