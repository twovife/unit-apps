# Rencana Sinkronisasi Arsitektur (app_laravel vs unit-apps)

Dokumen ini berisi hasil revisi analisis dan alur (flow) untuk menyelaraskan arsitektur kode antara proyek `app_laravel` (yang sudah memiliki fitur multi-cabang `employee_branches` dan `employee_zones`) dengan proyek `unit-apps`.

## 1. Analisis Struktur (Kabar Baik!)

Setelah dilakukan pengecekan mendalam terhadap backup SQL (`ubmi_db_2026-07-06_02-00.sql`) dan skema *live*, ternyata **kedua proyek berbagi database yang sama (`ubmi_db`)**.

Artinya, struktur dasar tabel `users`, `employees`, dan `employments` sebenarnya sudah **sama dan tersinkronisasi** di tingkat database.
- `User` terikat pada `Employee` via `employee_id`.
- `Employee` memiliki `branch_id` utama dan `employment_id` (sebagai penanda ID Jabatan/Role).
- Tabel `employments` tetap berfungsi sebagai **Master Data Jabatan** (bukan pivot).

Perbedaan utamanya murni ada di tingkat **Kode Proyek (Models & Controllers)**:
`app_laravel` memperkenalkan fitur baru untuk menangani karyawan yang memegang lebih dari 1 cabang secara bersamaan (misal: Pimpinan 2 cabang, atau Staf Kontrol 3 area) tanpa mengubah relasi inti `users` dan `employees`. Hal ini dicapai dengan tabel baru:
1. `employee_branches` (Pivot untuk multi-cabang struktural).
2. `employee_zones` (Pivot untuk multi-zona staf kontrol).
3. `employee_histories` (Riwayat mutasi & resign).

Sementara itu, `unit-apps` belum mengetahui keberadaan tabel-tabel baru ini dan masih mengasumsikan 1 karyawan = 1 cabang (hanya membaca `branch_id` utama di tabel `employees`).

---

## 2. File & Komponen yang Harus Disinkronkan di `unit-apps`

Karena database sudah tersinkronisasi, kita HANYA perlu menyelaraskan *codebase* di `unit-apps` agar bisa membaca struktur multi-cabang tersebut.

### A. Database (Migrations)
- Tidak perlu mengubah migrasi `users` atau `employees`.
- Cukup pastikan `unit-apps` memiliki migrasi untuk `employee_branches`, `employee_zones`, dan `employee_histories` agar *developer* lain bisa melakukan `php artisan migrate:fresh` dengan aman di kemudian hari.

### B. Models (`app/Models/`)
- `Employee.php`: Tambahkan relasi baru:
  - `employeeBranches()` -> `hasMany(EmployeeBranch::class)`
  - `employeeZones()` -> `hasMany(EmployeeZone::class)`
  - `histories()` -> `hasMany(EmployeeHistory::class)`
- Tambahkan Model baru: `EmployeeBranch.php`, `EmployeeZone.php`, `EmployeeHistory.php`.
- `Branch.php`: Tambahkan *helper function* sakti dari `app_laravel` yaitu `getAllowedBranchIds($user)` untuk menghitung total cabang yang boleh diakses seorang user.

### C. Controllers (`app/Http/Controllers/`)
- **Semua Controller Transaksi (Loan, dsb.)**: 
  - Saat ini `unit-apps` memfilter data menggunakan `$request->user()->employee->branch_id`.
  - Ini harus diganti massal menjadi fungsi filter multi-cabang: `Branch::getAllowedBranchIds($request->user())`.
  - Implementasi *Branch Filter Dropdown* (pengguna bisa memilih transaksi cabang mana yang ingin dilihat jika mereka memegang banyak cabang).

### D. Views / Frontend (React/Vue/Blade)
- **Komponen Filter Cabang**: Komponen UI seperti `branch-filter.tsx` harus di-*copy* ke `unit-apps` agar user dengan multi-cabang bisa *switch* cabang secara visual di UI.
- **Form Input Transaksi**: Dropdown pengajuan form harus difilter sesuai dengan hak akses multi-cabang.

---

## 3. Alur Eksekusi (Flow Implementation)

Langkah-langkah yang harus dilakukan secara berurutan di `unit-apps`:

1. **Tahap 1: Sinkronisasi Model & Relasi Baru**
   - *Copy* model `EmployeeBranch`, `EmployeeZone`, `EmployeeHistory` dari `app_laravel`.
   - Update `Employee.php` dan `Branch.php` dengan relasi dan fungsi filter RBAC `getAllowedBranchIds()`.
2. **Tahap 2: Refaktor Query Controller Secara Global**
   - Sisir seluruh *controller* yang melakukan validasi cabang tunggal dan ubah menggunakan validasi `in_array(branch_id, Branch::getAllowedBranchIds())`.
3. **Tahap 3: Implementasi UI Multi-Cabang**
   - Bawa masuk komponen `branch-filter.tsx` ke dalam tata letak utama (layout) `unit-apps`.
   - Modifikasi halaman transaksi agar merespons state filter cabang yang baru.
