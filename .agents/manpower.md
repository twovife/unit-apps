# Flow & Tabel Modul Manpower (`/administrasi/manpower`)

Dokumen ini mencatat alur kerja, kontroler, komponen UI, serta struktur & relasi tabel database untuk modul **Manpower (Data Karyawan & Generate User)** di `unit-apps`.

---

## 1. Rute & Akses (Routes)

- **Prefix Route**: `/administrasi/manpower`
- **Name Prefix**: `administrasi.manpower.`
- **Daftar Endpoint**:
  1. `GET /administrasi/manpower` 
     - **Name**: `administrasi.manpower.index`
     - **Action**: `EmployeeController@index`
     - **Fungsi**: Menampilkan daftar karyawan di cabang aktif beserta status akun user & jabatannya.
  2. `POST /administrasi/manpower`
     - **Name**: `administrasi.manpower.store`
     - **Action**: `EmployeeController@store`
     - **Fungsi**: Membuat akun `User` baru untuk karyawan terdaftar dan menetapkan `Role` (Spatie Permission).

---

## 2. Controller & Logika (Backend)

**Controller**: `App\Http\Controllers\EmployeeController`

- **`index(Request $request)`**:
  - Resolusi cakupan akses via `AuthScope::resolve()`.
  - Mengambil data karyawan dari tabel `employees` berdasarkan `branch_id` aktif.
  - Melakukan eager loading `username.rolelist` dan `employment`.
  - **Catatan Penting Struktur Tabel Baru**: Kolom `jabatan` **TIDAK LAGI** ada langsung di tabel `employees`, melainkan diambil dari relasi `employment` (`employments.jabatan`) melalui FK `employment_id`.
  - Format data `employment`: jika jabatannya `"mantri"`, ditampilkan sebagai `"mantri {area}"` (contoh: `"mantri 2"`).

- **`store(Request $request)`**:
  - Menerima `id` (employee_id), `branch_id`, `username`, dan `role`.
  - Menambahkan suffix kode cabang ke username (contoh: `budi_kdr`).
  - Menggunakan `DB::transaction` untuk membuat entry baru di tabel `users` (dengan default password) dan meng-assign Spatie Role via `syncRoles()`.

---

## 3. Komponen UI (Frontend - React & Inertia)

1. **Page Wrapper**: `resources/js/Pages/WebView/ManPower/Index.jsx`
   - Dibungkus dalam `<AuthenticatedLayout>`.
2. **Main Page Component**: `resources/js/Pages/Administrasi/ManPower/ManPower.jsx`
   - Memakai Shadcn `<Table>` untuk menampilkan list karyawan.
   - Komponen `SearchComponent` untuk pencarian/filter cabang.
   - Menggunakan `BadgeStatus` / `BargeStatus` untuk indikator status aktif & trigger pembuatan user.
3. **Modal Dialog**: `resources/js/Pages/Administrasi/ManPower/GenerateUser.jsx`
   - Menggunakan Shadcn `<Dialog>` untuk form modal pembuatan akun user karyawan (Username, Jabatan Readonly, Select Role).

---

## 4. Struktur & Relasi Tabel Database (`ubmi_db`)

```
   +-------------------+        +--------------------+
   |    employments    |        |      branches      |
   +-------------------+        +--------------------+
   | id (PK)           |        | id (PK)            |
   | jabatan           |        | code               |
   +---------+---------+        | name               |
             | 1                | wilayah            |
             |                  +---------+----------+
             | N                          | 1
   +---------+---------+                  |
   |     employees     |                  |
   +-------------------+                  |
   | id (PK)           |<-----------------+ N
   | nip               |
   | nama_karyawan     |
   | nik               |
   | alamat            |
   | hire_date         |
   | area              |
   | branch_id (FK)    |
   | employment_id(FK) |
   | date_resign       |
   | resign_status     |
   +---------+---------+
             | 1
             |
             | N
   +---------+---------+        +--------------------+
   |       users       |------->| model_has_roles    |
   +-------------------+ N    1 +--------------------+
   | id (PK)           |        | role_id            |
   | employee_id (FK)  |        | model_id (user_id) |
   | username          |        +--------------------+
   | email             |
   | isactive          |
   +-------------------+
```

### Penjelasan Tabel:
1. **`employees`**: Berisi data profil karyawan. **TIDAK MEMILIKI** kolom `jabatan` langsung.
2. **`employments`**: Master data jabatan (`id`, `jabatan` like `mantri`, `kasir`, `pimpinan`, `kepala mantri`, dll). Linked via `employees.employment_id`.
3. **`users`**: Akun login karyawan. Linked via `users.employee_id`.
4. **`employee_branches`**: Pivot multi-cabang karyawan.
5. **`employee_zones`**: Pivot zona audit staf kontrol.
