# Dokumentasi Alur: Avatar Cropper, Dokumen Berkas Digital, dan Tabel Modern Manpower

Tanggal: 2026-10-16  
Pengembang / Asisten: Muvita  
Aplikasi: `unit-apps` (Ekosistem UBMI)  

---

## 1. Latar Belakang & Kebutuhan
1. **Logo Sidebar**: Mengganti ikon sidebar berlatar hitam (`/icons/icon-sidebar.webp`) dengan logo merah bersih (`/icons/logo-ubm.webp?v=3`) agar serasi dengan antarmuka sidebar putih.
2. **Avatar Cropper & Remove Profil Karyawan (`/administrasi/manpower`)**:
   - Sebelum foto profil diunggah ke MinIO / S3, kasir atau superuser dapat mengatur posisi dan pembesaran (crop & zoom slider 1x - 4x) dengan masking lingkaran, persis seperti fitur yang ada di `app_laravel`.
   - Menghapus foto profil avatar karyawan dan mengembalikannya ke avatar inisial nama.
3. **Detail Karyawan & Berkas Dokumen Digital (seperti app_laravel)**:
   - Mengklik nama karyawan atau tombol detail akan membuka modal detail karyawan yang komprehensif.
   - Di dalam modal detail:
     - Header kartu profil menampilkan avatar besar, tombol ganti foto (cropper modal), tombol hapus foto, serta tombol preview foto besar.
     - Tab **Berkas Dokumen**: mengelola 6 jenis berkas digital resmi (`ktp`, `pasfoto`, `kk`, `skck`, `ijazah`, `lamaran_kerja`).
     - Menampilkan status keberadaan dokumen, tombol lihat file (tab baru), tombol ganti/upload ulang, tombol hapus berkas, dan **keterangan waktu terakhir diperbarui (last update)**.
     - Tab **Data Pribadi**: menampilkan NIK, akun login, alamat, tanggal masuk, durasi masa kerja, dan status resign.
4. **Redesain Tabel Manpower**:
   - Tampilan tabel karyawan dipercantik dengan kartu tabel modern berestetika tinggi (clean corporate).
   - Metrik statistik ringkas di atas tabel (Total, Aktif, Resign).
   - Tab status filter `Aktif`, `Resign`, `Semua` tetap dipertahankan.
   - Kolom-kolom diperjelas dengan badge jabatan variatif, badge NIK monospaced, status dot indicator, badge counter dokumen, dan tombol quick actions.

---

## 2. Struktur Rute & Controller

| Method | URI | Nama Route | Controller & Method | Hak Akses | Deskripsi |
|---|---|---|---|---|---|
| `GET` | `/administrasi/manpower` | `administrasi.manpower.index` | `EmployeeController@index` | kasir, superuser, dll. | Menampilkan daftar karyawan cabang aktif beserta relasi dokumen |
| `POST` | `/administrasi/manpower/{employee}/avatar` | `administrasi.manpower.avatar` | `EmployeeController@uploadAvatar` | kasir, superuser | Mengunggah foto hasil crop (JPEG 512px) ke MinIO `avatars/` |
| `DELETE` | `/administrasi/manpower/{employee}/avatar` | `administrasi.manpower.avatar.delete` | `EmployeeController@deleteAvatar` | kasir, superuser | Menghapus file foto di MinIO dan mereset field `avatar = null` |
| `GET` | `/administrasi/manpower/{employee}/documents/{document}` | `administrasi.manpower.documents.show` | `EmployeeController@showDocument` | kasir, superuser, dll. | Menampilkan berkas digital inline di tab peramban |
| `POST` | `/administrasi/manpower/{employee}/documents` | `administrasi.manpower.documents.upload` | `EmployeeController@uploadDocument` | kasir, superuser | Mengunggah/mengganti berkas digital karyawan ke MinIO `documents/{employee->id}` |
| `DELETE` | `/administrasi/manpower/{employee}/documents/{document}` | `administrasi.manpower.documents.destroy` | `EmployeeController@deleteDocument` | kasir, superuser | Menghapus berkas digital karyawan di MinIO dan tabel `employee_documents` |

---

## 3. Struktur Tabel Database (`ubmi_db`)

| Tabel | Operasi | Kolom Terlibat | Keterangan |
|---|---|---|---|
| `employees` | `BACA`, `TULIS` | `id`, `branch_id`, `nik`, `nama_karyawan`, `avatar`, `alamat`, `hire_date`, `date_resign`, `area` | Field `avatar` menyimpan relative path ke S3/MinIO (mis. `avatars/xyz.jpg`) |
| `employee_documents` | `BACA`, `TULIS` | `id`, `employee_id`, `type`, `file_path`, `is_old`, `created_at`, `updated_at` | Menyimpan relasi dokumen digital karyawan |
| `employments` | `BACA` | `id`, `jabatan` | Relasi jabatan karyawan (`$employee->employment`) |
| `users` | `BACA` | `id`, `username`, `isactive`, `employee_id` | Akun login karyawan |
| `roles` & `model_has_roles` | `BACA` | Spatie permissions | Hak akses pengguna |

---

## 4. Struktur Antarmuka & Komponen Frontend

1. **`Sidebar.jsx`**:
   - Mengubah `<img src="/icons/icon-sidebar.webp?v=1" />` menjadi `<img src="/icons/logo-ubm.webp?v=3" />` dengan `object-contain drop-shadow-xs`.
2. **`ManPower.jsx`**:
   - **`ModalCropAvatar`**:
     - Menggunakan HTML5 Canvas native tanpa library eksternal.
     - Viewport crop persegi `280px` dengan lingkaran masking gelap `shadow-[0_0_0_999px_rgba(15,23,42,0.65)]`.
     - Pointer events (`onPointerDown`, `onPointerMove`, `onPointerUp`) dengan `setPointerCapture` untuk pengalaman drag foto yang sangat halus di desktop maupun HP.
     - Slider zoom 1x - 4x yang berpusat di tengah viewport.
     - Clamping (`jepit`) menjaga gambar tidak pernah meninggalkan celah kosong.
     - Ekspor canvas 512x512 JPEG quality 0.90, dikirim via Inertia `router.post(..., { forceFormData: true })`.
   - **`DocumentUploaderRow`**:
     - Menampilkan status 6 berkas dokumen (`ktp`, `pasfoto`, `kk`, `skck`, `ijazah`, `lamaran_kerja`).
     - Tampilan badge `Sudah Ada` / `Belum Ada` dengan ikon status.
     - Keterangan waktu pembaruan terakhir (**last update**) tanggal, jam, dan waktu relatif (misal: `Diperbarui: 16 Okt 2026 10:15 (2 jam yang lalu)`).
     - Tombol `Lihat File` (tab baru), `Ganti` (pilih file baru), dan `Hapus` (konfirmasi dialog).
   - **`DetailKaryawan`**:
     - Dialog profil responsif dengan tab `Berkas Dokumen` (counter n/6) dan `Data Pribadi`.
     - Menyediakan tombol aksi ganti/upload foto profil dan hapus foto profil langsung di dalam modal detail.
   - **Tabel Desktop & Kartu HP**:
     - Mengklik nama karyawan atau tombol "Detail" langsung membuka dialog detail karyawan.
     - Indikator ringkas jumlah berkas yang sudah diunggah pada tiap baris.
