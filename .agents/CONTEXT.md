# Konteks Aplikasi: unit-apps (Aplikasi Transaksi Cabang UBMI)

## Deskripsi Umum
`unit-apps` adalah aplikasi front-end/transaksional untuk cabang-cabang dalam ekosistem UBMI. Aplikasi ini menangani operasional harian cabang seperti transaksi kasir, manajemen pinjaman, buku transaksi, dan rekapitulasi harian. Aplikasi ini berjalan berdampingan dengan `app_laravel` (aplikasi pusat/admin).

## Hubungan dengan `app_laravel`
Aplikasi `unit-apps` dan `app_laravel` berbagi **satu database yang sama** yaitu `ubmi_db` (MariaDB) melalui Docker network `app_laravel_laravel-network`.

### Tabel dan Entitas yang Dibagikan (Shared Data)
- **Otentikasi & Otorisasi**: `users`, `roles`, `permissions`, `model_has_roles`, `model_has_permissions`, `role_has_permissions` (menggunakan Spatie Permission). Seeders dan definisi utama berada di `app_laravel`.
- **Manajemen Karyawan & Cabang**: `employees`, `branches`, `employments`, `employee_branches`, `employee_zones`. Entitas ini merupakan tulang punggung relasi antara user dan cabang di aplikasi ini.

## Modul dan Fitur Utama `unit-apps`
1. **Buku Transaksi (`bukutransaksi`)**: Mencatat transaksi harian, pembuatan transaksi cepat (`fastcreate`), update batch, dan input kredit macet.
2. **Manajemen Pinjaman (`pinjaman`)**: Daftar pinjaman, pencairan (drop), pinjaman macet, sinkronisasi angsuran, bayar pinjaman, pemutihan (white-off), dan riwayat angsuran.
3. **Kasir (`kasir`)**: Rekapitulasi harian (rekap post, ceklist kepala), rekapitulasi per mantri, rencana drop, dan rekap lanjutan (rekap-satu, rekap-dua).
4. **Mobile Apps Mantri (`mobile_apps`)**: Tampilan/antarmuka khusus untuk petugas lapangan (mantri) untuk melihat transaksi, angsuran, kredit macet, rencana pencairan, dan rekap transaksi dari perangkat mobile.
5. **Administrasi (`administrasi`)**: Manajemen sumber daya manusia (manpower/employees) tingkat cabang.
6. **Admin Panel (`admin-panel`)**: Monitoring staf, balancing pinjaman, manajemen role/user (sebatas assign di cabang), dan inisiasi sirkulasi awal.
7. **Autentikasi & Sesi**: Pemilihan cabang aktif (`set-branch`), krusial karena satu user (seperti mantri/kepala) dapat di-assign ke beberapa cabang/zona.

## Stack Teknologi (Frontend & Backend)
- **Backend**: Laravel 11.
- **Frontend Framework**: React 18 menggunakan pendekatan Inertia.js v1.
- **Styling**: Tailwind CSS v4.
- **UI Components**: Radix UI Primitives (Accordion, Dialog, Dropdown, Popover, Select, dll) dan sebagian besar komponen Shadcn UI yang telah diporting manual.
- **Form & Input**: `react-currency-input-field` (format mata uang), `react-number-format`, `react-day-picker` (pemilihan tanggal).
- **Tools Tambahan**: Vite (bundler), Axios, Day.js / date-fns (manipulasi waktu), SweetAlert2 / Sonner (notifikasi), Lucide React / React Icons (ikon).

## Database Models (Spesifik di `unit-apps`)
Model lokal yang berhubungan langsung dengan operasional cabang antara lain:
- `TransactionDailyRecap`, `TransactionBranchDailyRecap` (Rekapitulasi)
- `TransactionLoan`, `TransactionLoanInstalment` (Pinjaman dan Angsuran)
- `TransactionCustomer`, `Customer` (Data Nasabah)
- `TransactionManageCustomer`, `TransactionSirculation` (Sirkulasi Keuangan)
- `LoanRequest` (Pengajuan Pinjaman baru/lama)

## Standar Pengembangan
- **Struktur File**: Halaman UI React berada di `resources/js/Pages/` (dengan ekstensi `.jsx`). Komponen reusable berada di `resources/js/Components/`.
- **Build Asset**: **Wajib menjalankan `npm run build`** (dari host OS) setelah mengedit file React/JSX karena aplikasi dirender via Inertia (Vite).
- **Keamanan Data**: **Dilarang keras** melakukan `php artisan migrate:fresh` atau memodifikasi migrasi inti yang merusak database, karena akan berdampak fatal pada operasional `app_laravel` yang menggunakan database yang sama.
- **Desain UI/UX**: Aplikasi harus menggunakan styling modern, responsif (mendukung desktop dan mobile view untuk mantri), dan interaktif. Komponen form dan dialog menggunakan pendekatan Radix UI untuk aksesibilitas yang baik.
