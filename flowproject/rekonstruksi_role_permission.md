# Brainstorming: Sinkronisasi Employee & Rekonstruksi Role/Permission

## Tujuan

1. Menyelaraskan struktur employee `unit-apps` dengan `app_laravel`
2. Merekonstruksi role/permission agar lebih bersih dan konsisten

---

## BAGIAN 1: Keadaan Saat Ini (Analisa Mendalam)

### A. Pola Filter Data yang Tersebar di Mana-mana

Saat ini ada 1 pola filter yang di-_copy-paste_ berulang kali di seluruh codebase (42 lokasi!). Pola ini muncul di:

- `RekapTrait.php` (5x)
- `PinjamanTrait.php` (6x)
- `TransactionLoanController.php` (2x)
- `EmployeeController.php` (1x)
- `AppHelper.php` (2x)

Polanya selalu seperti ini:

```php
$branch_id = $authorized->can('can show branch')
    ? ($request->branch_id ?? 1)
    : $authorized->employee->branch_id;

$wilayah = $authorized->can('can show branch')
    ? (Branch::find($branch_id)->wilayah ?? 1)
    : $authorized->employee->branch->wilayah;

$kelompok = $authorized->can('can show kelompok')
    ? ($request->kelompok ?? 1)
    : $authorized->employee->area;
```

**Masalah pola ini:**

- Hardcoded default ke branch_id `1` dan wilayah `1` jika tidak ada input
- Tidak mendukung multi-cabang (user selalu hanya punya 1 `branch_id`)
- Permission `can show branch` dan `can show kelompok` dicampur-aduk fungsinya (kadang sebagai filter visibilitas, kadang sebagai guard CRUD)

### B. Tabel `employment_permissions` (Mekanisme Multi-Cabang Lama)

Di `unit-apps` sebenarnya **sudah ada** mekanisme multi-cabang untuk Pengawas, yaitu tabel `employment_permissions`:

- Schema: `id`, `employee_id`, `branch_id`, `can_create`
- Digunakan di `AppHelper::branch_permission()` untuk role `unit_pengawas`

Ini **serupa** dengan tabel `employee_branches` di `app_laravel`, tapi cuma dipakai untuk 1 role. Di `app_laravel` kita sudah membuatnya lebih generik.

### C. Tabel `user_zones` (Staf Kontrol Lama)

Di `unit-apps` juga sudah ada `user_zones`:

- Schema: `id`, `employee_id`, `wilayah`, `branch_id`
- Tapi di codebase hanya dipakai via tabel, **model-nya kosong** (tak ada relasi)

Di `app_laravel`, ini sudah dijadikan `employee_zones` yang lebih bersih dan terintegrasi.

### D. Daftar Jabatan (`employments` table)

Dari seeder, jabatan yang ada:
| ID | Jabatan |
|---|---|
| 1 | pimpinan |
| 2 | wakil pimpinan |
| 3 | kepala mantri |
| 4 | staf |
| 5 | kasir |
| 6 | mantri |
| 7 | pusat |
| 8 | pengawas (ada di app_laravel) |

---

## BAGIAN 2: Desain Role/Permission yang Baru

### A. Prinsip Desain

> **Jabatan (employment) menentukan kemampuan bawaan.**
> **Delegasi cabang (employee_branches) menentukan jangkauan data.**

Artinya: kita tidak perlu 17 permission yang tumpang tindih. Cukup beberapa permission kunci yang jelas fungsinya.

### B. Matriks Akses per Jabatan

| Jabatan                | Lihat Cabang Sendiri | Lihat Kelompok Sendiri | Lihat Semua Kelompok di Cabang | Lihat Cabang Lain (Delegasi) | Lihat Semua Cabang | CRUD di Cabang Sendiri |
| ---------------------- | :------------------: | :--------------------: | :----------------------------: | :--------------------------: | :----------------: | :--------------------: |
| **Mantri**             |          ✅          |  ✅ (hanya area-nya)   |               ❌               |              ❌              |         ❌         |     ✅ (area-nya)      |
| **Kepala Mantri (KM)** |          ✅          |  ✅ (hanya area-nya)   |               ❌               |              ❌              |         ❌         |     ✅ (area-nya)      |
| **Kasir**              |          ✅          |           —            |               ✅               |              ❌              |         ❌         |           ✅           |
| **Pimpinan**           |          ✅          |           —            |               ✅               | ✅ (via `employee_branches`) |         ❌         |           ✅           |
| **Pengawas**           |          ✅          |           —            |               ✅               | ✅ (via `employee_branches`) |         ❌         |    ❌ (lihat saja)     |
| **Staf Kontrol**       |          —           |           —            |               ✅               |  ✅ (via `employee_zones`)   |         ❌         |       ❌ (audit)       |
| **Pusat / Admin**      |          —           |           —            |               —                |              —               |     ✅ (semua)     |           ✅           |

### C. Desain Permission Baru (Ringkas & Jelas)

Dari tabel di atas, kita bisa memangkas 17 permission menjadi hanya **6 permission inti**:

| Permission Baru           | Fungsi                                                          | Pemilik                                                                 |
| ------------------------- | --------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `view-all-branches`       | Akses tanpa batas cabang                                        | Staf Kontrol, Superuser                                                 |
| `view-delegated-branches` | Bisa lihat cabang yang didelegasikan (dari `employee_branches`) | Pimpinan, Pengawas                                                      |
| `view-zone-branches`      | Bisa lihat cabang audit (dari `employee_zones`)                 | (Opsional) Jika Staf Kontrol dibatasi zonanya                           |
| `view-all-groups`         | Bisa lihat semua kelompok/area dalam 1 cabang                   | Kasir, Pimpinan, Pengawas, Staf Kontrol, Superuser                      |
| `can-create`              | Bisa input/create data transaksi                                | Mantri, KM, Kasir, Pimpinan, Superuser                                  |
| `can-edit`                | Bisa edit data transaksi                                        | Kasir, Pimpinan, Superuser                                              |
| `can-approve`             | Bisa menyetujui (ACC/Action) pengajuan/transaksi                | KM, Kasir, Pimpinan, Pengawas, Staf Kontrol (jika diizinkan), Superuser |
| `maintenance-worker`      | Akses teknis khusus untuk merombak pembukuan / data lama        | Superuser                                                               |

### D. Pemetaan Role Baru

| Role                | Permissions                                                                                                            |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **`mantri`**        | `can-create`                                                                                                           |
| **`kepala-mantri`** | `can-create`, `can-approve`                                                                                            |
| **`kasir`**         | `can-create`, `can-edit`, `can-approve`, `view-all-groups`                                                             |
| **`pimpinan`**      | `can-create`, `can-edit`, `can-approve`, `view-all-groups`, `view-delegated-branches`                                  |
| **`pengawas`**      | `can-approve`, `view-all-groups`, `view-delegated-branches`                                                            |
| **`staf-kontrol`**  | `view-all-branches`, `view-all-groups` (Readonly)                                                                      |
| **`superuser`**     | `can-create`, `can-edit`, `can-approve`, `view-all-branches`, `view-all-groups`, `maintenance-worker` (Bisa Segalanya) |

> [!IMPORTANT]
> **Mantri dan KM tidak punya `view-all-groups`**, sehingga mereka otomatis terkunci ke `employee.area` milik mereka sendiri. Filter `kelompok` di UI tidak muncul untuk mereka.

> [!IMPORTANT]
> **Pimpinan dan Pengawas punya `view-delegated-branches`**, sehingga dropdown cabang hanya menampilkan cabang utama + cabang yang terdaftar di `employee_branches`.

---

## BAGIAN 3: Yang Harus Diubah (Dampak ke Codebase)

### A. Database — Sinkronisasi Tabel

| Tabel                    | Aksi                                                                               |
| ------------------------ | ---------------------------------------------------------------------------------- |
| `employees`              | **Tidak berubah** — tetap pakai `branch_id`, `area`, `employment_id`               |
| `employments`            | **Tidak berubah** — tetap sebagai master jabatan. Tambah `pengawas` jika belum ada |
| `employment_permissions` | **DEPRECATED** → digantikan `employee_branches`                                    |
| `user_zones`             | **DEPRECATED** → digantikan `employee_zones`                                       |
| `employee_branches`      | **BARU** — copy dari `app_laravel`, sebagai pivot multi-cabang                     |
| `employee_zones`         | **BARU** — copy dari `app_laravel`, sebagai pivot multi-zona audit                 |

### B. Models — Yang Harus Diubah

| File                       | Perubahan                                                                |
| -------------------------- | ------------------------------------------------------------------------ |
| `Employee.php`             | Tambah relasi: `employeeBranches()`, `employeeZones()`                   |
| `Branch.php`               | Tambah helper: `getAllowedBranchIds($user)`, `getDefaultBranchId($user)` |
| `EmployeeBranch.php`       | **BARU** — copy dari `app_laravel`                                       |
| `EmployeeZone.php`         | **BARU** — copy dari `app_laravel`                                       |
| `UserZone.php`             | Bisa dihapus / tetap ada tapi tidak dipakai                              |
| `EmploymentPermission.php` | Bisa dihapus / tetap ada tapi tidak dipakai                              |

### C. Helpers & Traits — Jantung Perubahan (Global Filter)

**Konsep Baru (Global Filter via Session):**
Alih-alih mengirim `branch_id` dari setiap halaman (via query parameter / dropdown lokal), kita akan menyimpan **Active Branch** di dalam Session/Inertia Middleware.

- Jika user pindah kantor lewat Sidebar, server menyimpan state tersebut di session (contoh: `session(['active_branch_id' => $id])`).
- Semua controller dan Trait otomatis membaca dari session ini.

**`AppHelper.php`** — Fungsi yang harus dirombak:

| Fungsi                | Sekarang                               | Nanti                                                     |
| --------------------- | -------------------------------------- | --------------------------------------------------------- |
| `user_permission()`   | Cek 4 level permission manual          | Cukup baca `employment->jabatan`                          |
| `branch_permission()` | Logika bercabang-cabang rumit 50 baris | Diganti 1 panggilan: `Branch::getAllowedBranchIds($user)` |
| `user_authorized()`   | Duplikat dari `branch_permission()`    | Hapus, ganti `Branch::getAllowedBranchIds()`              |

**`RekapTrait.php` & `PinjamanTrait.php`** — Pola `$branch_id / $wilayah / $kelompok` yang berulang 11x:

Kita buat 1 helper terpusat, misal `AuthScope`:

```php
// SEBELUM (di 11 lokasi):
$branch_id = $authorized->can('can show branch') ? ($request->branch_id ?? 1) : $authorized->employee->branch_id;
$kelompok = $authorized->can('can show kelompok') ? ($request->kelompok ?? 1) : $authorized->employee->area;

// SESUDAH (1 helper membaca Active Session):
$scope = AuthScope::resolve();
// Otomatis membaca session('active_branch_id') jika ada, atau fallback ke default branch employee.
```

### D. Controllers — Yang Terdampak

| Controller                            | Perlu diubah? | Alasan                                               |
| ------------------------------------- | ------------- | ---------------------------------------------------- |
| `TransactionLoanController.php`       | ✅            | Pakai pola filter lama (baris 270-271, 391-392, 905) |
| `EmployeeController.php`              | ✅            | Pakai pola filter lama (baris 24-26)                 |
| `TransactionDailyRecapController.php` | ✅            | Pakai `RekapTrait`                                   |
| `MobileAppsMantriController.php`      | ✅            | Pakai `RekapTrait` + `PinjamanTrait`                 |
| `AdminController.php`                 | ⚠️ Sedikit    | Perlu update RolePermitSeeder dan panel assign role  |
| `BatchInputController.php`            | ❓ Perlu cek  | Kemungkinan pakai pola yang sama                     |

### E. Frontend (React/Inertia) — Yang Terdampak

| Komponen                          | Perubahan                                                                                                                                                                                                                                   |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Global Branch Selector (Baru)** | Diletakkan di Sidebar/Header (hanya muncul jika user punya `view-delegated-branches` atau `view-all-branches`). Opsinya dari `Branch::getAllowedBranchIds()`. Ketika diklik, akan mengubah Global State (Session) dan me-_refresh_ halaman. |
| Dropdown filter cabang (lama)     | **Dihapus** dari semua halaman karena sudah digantikan oleh Global Selector.                                                                                                                                                                |
| Dropdown kelompok/area            | Tetap ada (per halaman/komponen), tapi hanya tampil jika user punya `view-all-groups`.                                                                                                                                                      |
| Admin Panel (role assign)         | Update list role dan permission baru                                                                                                                                                                                                        |

### F. Seeders — Yang Harus Diubah

| Seeder                 | Perubahan                                                 |
| ---------------------- | --------------------------------------------------------- |
| `RolePermitSeeder.php` | **Tulis ulang** — gunakan 6 permission baru + 7 role baru |
| `EmploymentSeeder.php` | Tambah `pengawas` jika belum ada                          |

---

## BAGIAN 4: Urutan Eksekusi yang Aman

> [!WARNING]
> Kedua proyek berbagi database `ubmi_db`. Perubahan tabel berdampak ke keduanya. Oleh karena itu, perubahan permission harus dilakukan **bertahap dan backward-compatible**.

### Fase 1: Fondasi (Tidak Breaking)

1. Buat migrasi `employee_branches` dan `employee_zones` (tabel baru, tidak mengganggu apapun)
2. Copy Model `EmployeeBranch.php` dan `EmployeeZone.php`
3. Migrasi data dari `employment_permissions` → `employee_branches`
4. Migrasi data dari `user_zones` → `employee_zones`
5. Update `Employee.php` dan `Branch.php` dengan relasi dan helper baru

### Fase 2: Permission Baru (Backward-Compatible)

1. Buat permission baru (`view-all-branches`, `view-delegated-branches`, dll) via seeder/tinker
2. Assign permission baru ke role yang sudah ada (tanpa menghapus yang lama dulu)
3. Buat helper `AuthScope` yang membaca permission baru

### Fase 3: Migrasi Kode (Ganti Pola)

1. Refaktor `AppHelper::branch_permission()` → gunakan `Branch::getAllowedBranchIds()`
2. Ganti 11 lokasi pola filter di Traits → pakai `AuthScope::resolve()`
3. Update Controllers yang terdampak
4. Update frontend dropdown

### Fase 4: Cleanup

1. Hapus permission lama yang sudah tidak terpakai
2. Hapus tabel `employment_permissions` dan `user_zones` (opsional, bisa tetap ada)
3. Hapus model `EmploymentPermission` dan `UserZone`

---

## BAGIAN 5: Daftar Menu & Aksi (Visibilitas & CRUD)

Berdasarkan struktur frontend (Sidebar & routes) serta penjagaan di backend, berikut adalah pembatasan eksisting yang akan dipertahankan atau diperbaiki dalam rekonstruksi ini:

### A. Visibilitas Menu

1. **WebView (Desktop)**: Seluruh menu di web (Data Karyawan, Buku Transaksi, Angsuran, Rekap) saat ini diikat oleh permission `unit apps`. Artinya, Mantri (yang hanya punya `mantri apps`) tidak bisa mengakses web sama sekali.
2. **MobileApps**: Menjadi antarmuka utama Mantri, tetapi juga menyediakan laporan untuk Kepala/Pimpinan (seperti `buku-transaksi-kepala`, `rencana-drop-kepala`).

### B. Otorisasi Aksi (CRUD)

1. **Membuat Transaksi (`can create`)**:
   Akses untuk membuat Pengajuan, Angsuran, atau Batch Input dikunci oleh permission ini. Dimiliki oleh Mantri, Kasir, Pimpinan.
2. **Persetujuan / ACC (Action)**:
   Meskipun Mantri punya `can create`, mereka secara _hardcode_ **dilarang** melakukan ACC/Tolak. Hanya Kasir & Pimpinan yang berhak.
3. **Batas Waktu Edit/Hapus (`AppHelper::havePermissionByDate`)**:
   - **Mantri (`area`)**: Hanya boleh edit/hapus mundur maksimal 2 hari.
   - **Kasir & Pimpinan (`unit`)**: Boleh edit/hapus mundur hingga 2 bulan.
   - **Pusat (`pusat apps`)**: Tanpa batasan waktu.
4. **Dropdown Filter (Cabang & Kelompok)**:
   - **Filter Cabang**: Muncul jika ada `can show branch`.
   - **Filter Kelompok**: Muncul jika ada `can show kelompok`. Mantri tidak punya ini, sehingga view mereka terkunci paksa (hardcoded) ke area mereka sendiri.

---

## Open Questions untuk User

1. **KM (Kepala Mantri)**: Apakah KM perlu role sendiri (`kepala-mantri`), atau cukup pakai role `mantri` saja karena akses datanya sama (hanya area sendiri)?
2. **Kasir**: Apakah kasir boleh melihat semua kelompok di cabangnya (`view-all-groups`), atau kasir juga terkunci ke kelompok tertentu?
3. **Data lama `employment_permissions`**: Apakah data pengawas yang sudah ada di tabel `employment_permissions` harus dipindah ke `employee_branches`, atau kita isi ulang dari nol?
4. **Wakil Pimpinan**: Akses wakil pimpinan sama persis dengan pimpinan, atau ada batasan?
5. **`maintenance worker`**: Permission ini tetap dipertahankan atau dihapus? Karena sifatnya sangat teknis dan tidak berkaitan dengan jabatan.
