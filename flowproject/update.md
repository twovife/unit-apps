# Flow Eksekusi: Sinkronisasi & Rekonstruksi

Dokumen ini merupakan panduan final alur kerja (flow) penggabungan konsep dari `synchronization_flow.md` dan `rekonstruksi_role_permission.md` dengan pendekatan *Global Filter* dan Pemusatan Migrasi.

## 1. Pemusatan Database Migrations
**Keputusan:** Migrasi tabel *database* **DIPUSATKAN di `app_laravel`**.
- Mengapa? Karena `app_laravel` bertindak sebagai *core* (inti) untuk data karyawan (HRIS) dan master data.
- Faktanya, tabel `employee_branches` dan `employee_zones` **sudah dibuat** di proyek `app_laravel` pada tanggal 9-10 Juli.
- Oleh karena itu, kita **TIDAK PERLU** membuat *file* migrasi di `unit-apps`. `unit-apps` hanya bertugas mengonsumsi struktur database tersebut melalui Models.

## 2. Urutan Fase Eksekusi di `unit-apps`

### Fase 1: Fondasi Models & Relasi (Backend)
- Menyalin Model `EmployeeBranch.php` dan `EmployeeZone.php` ke `unit-apps`.
- Memperbarui relasi pada `Employee.php` (`employeeBranches()`, `employeeZones()`).
- Menambahkan fungsi helper `Branch::getAllowedBranchIds($user)`.
- Mengatur ulang `RolePermitSeeder` (atau update manual via panel admin) menggunakan konsep 8 permission inti (`can-create`, `can-edit`, `can-approve`, `view-all-branches`, `view-delegated-branches`, `view-zone-branches`, `view-all-groups`, `maintenance-worker`) dan memetakan *role* baru (Mantri, KM, Kasir, Pimpinan, Pengawas, Staf Kontrol, Superuser).

### Fase 2: Implementasi Global Filter (Middleware / Session)
- Membuat mekanisme *Global State* di Laravel (Session) untuk menyimpan `active_branch_id`.
- Membuat kelas `AuthScope` yang bertugas membaca Session ini. Jika kosong, *fallback* ke `employee->branch_id` (cabang bawaan).
- AuthScope ini secara otomatis akan mem-validasi apakah user berhak mengakses *active_branch* tersebut (mencegah *bypass* URL).

### Fase 3: Perombakan Frontend (Global Branch Selector)
- Membuat komponen **Global Branch Selector** di *Sidebar / Navbar* (komponen `Sidebar.jsx`, `AppSidebar.jsx`, `WebSidebar.jsx`).
- Filter ini **hanya akan muncul** jika user memiliki permission `view-all-branches` atau `view-delegated-branches`.
- Ketika cabang dipilih dari sini, sistem akan mengirim *request* ke server untuk mengubah `active_branch_id` di *Session*, lalu melakukan *full-reload* atau *Inertia reload* agar seluruh menu dan *dashboard* langsung mengikuti cabang tersebut.
- **Menghapus semua filter dropdown cabang lokal** yang sebelumnya tersebar di berbagai halaman/menu transaksi.

### Fase 4: Pembersihan Kode (Refactoring Controllers & Traits)
- Menghapus logika 50 baris di `AppHelper::branch_permission()` dan `user_authorized()`.
- Menyisir 42 lokasi di `RekapTrait`, `PinjamanTrait`, dan Controllers yang masih melakukan filter *hardcoded* (`$branch_id = ...`). Semua baris tersebut diganti cukup dengan memanggil satu baris: `$scope = AuthScope::resolve();`.
- Memastikan logika tombol (Action/ACC) dikunci menggunakan permission `can-approve`. Mantri, meskipun bisa `can-create`, tidak akan melihat atau bisa mem-POST aksi ACC.

## Kesimpulan
Dengan alur ini, kode `unit-apps` akan berkurang drastis (karena filter lokal dan *helper* raksasa dihapus), UI menjadi sangat ringkas dengan satu *Global Filter*, dan manajemen *database* tetap rapi terpusat di `app_laravel`.
