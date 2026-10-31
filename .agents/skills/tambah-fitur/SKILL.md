---
name: tambah-fitur
description: "Menambahkan fitur baru atau membuat endpoint baru di aplikasi unit-apps yang membutuhkan modifikasi MVC, React, dan integrasi dengan database bersama."
---

# Skill: Tambah Fitur / Modul Baru di unit-apps

Gunakan panduan ini ketika diminta untuk membuat fitur baru, halaman baru, atau memodifikasi modul yang ada di dalam `unit-apps`.

## Langkah-langkah Implementasi

1. **Pemahaman Konteks Database (Sangat Penting)**
   - Karena aplikasi ini berbagi database (`ubmi_db`) dengan `app_laravel`, **JIKA INGIN MENAMBAHKAN KOLOM DI TABEL ATAU SEEDER, WAJIB DITAMBAHKAN DI APLIKASI `app_laravel`**, bukan di `unit-apps`.
   - Hindari penggunaan `php artisan migrate:fresh` karena dapat menghapus data yang dibagikan antar aplikasi.

2. **Backend (Laravel)**
   - Buat Controller di `app/Http/Controllers/`. Pastikan pengembalian *view* menggunakan Inertia, contoh: `return Inertia::render('NamaFolder/NamaFile', ['data' => $data]);`.
   - Daftarkan route di `routes/web.php` di dalam grup yang relevan (apakah dia di dalam *middleware* `auth`, atau butuh cek peran via Spatie Permission).
   - Pastikan Model yang dibuat ditaruh di `app/Models/` (jika berurusan dengan tabel transaksi cabang).

3. **Frontend (React & Inertia)**
   - Buat file tampilan di `resources/js/Pages/`. Nama file menggunakan ekstensi `.jsx` dengan huruf kapital di awal.
   - **STANDAR UI & REUSABLE COMPONENT:** Anda diwajibkan untuk mematuhi standar desain dari **[Shadcn UI](https://ui.shadcn.com/)**. Pastikan elemen UI yang umum (seperti *Filter*, *Card*, *Tombol/Button*, *Badge*, dll) dipisahkan menjadi komponen tersendiri di `resources/js/Components/`. **DILARANG KERAS** melakukan *hardcode* berulang di dalam halaman (*Pages*).
   - Gunakan Tailwind CSS (v4) secara utility-first sesuai pedoman Shadcn.

4. **Kompilasi Frontend (Vite)**
   - Kita menggunakan *Hot Reload*. Saat *development*, Anda tidak perlu selalu *build*. Cukup pastikan *User* menjalankan `npm run dev`.
   - Perintah `npm run build` hanya perlu dijalankan saat proses penyelesaian fitur untuk *production*.

5. **Performa Skala Besar (1000+ Concurrent Users)**
   - Aplikasi ini ditargetkan menangani 1000+ *user* online secara bersamaan.
   - **DILARANG KERAS** membuat *flow* atau *query* yang membebani server (contoh: N+1 query problem, select all table records tanpa *pagination* atau filter, kalkulasi kompleks di Controller tanpa caching/antrian). Pastikan *backend* bekerja seefisien mungkin.

5. **Pengujian (Testing)**
   - Akses rute/fitur baru melalui interaksi navigasi (atau secara langsung via URL).
   - Pastikan komponen React tidak *crash* dan berhasil mengambil data dari backend.
