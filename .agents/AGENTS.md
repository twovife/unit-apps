# Aturan Pengembangan unit-apps (Aplikasi Transaksi Cabang UBMI)

## Arsitektur
- Aplikasi ini adalah **bagian dari ekosistem UBMI** bersama `app_laravel`.
- Keduanya berbagi **1 database** (`ubmi_db`) via Docker network `app_laravel_laravel-network`.
- PRD lengkap ada di: `/home/supermario/projects/app_laravel/projectplaner/PRD.md`

## Perintah Docker
- **Artisan**: `docker exec unit-app php artisan ...`
- **Build frontend**: `npm run build` (dari host, bukan dari dalam container)

## Frontend
- **Stack**: Laravel 11 + Inertia.js v1 + React 18 + JavaScript (JSX) + Tailwind CSS v4
- Menggunakan Radix primitives. Beberapa komponen Shadcn sudah diporting.
- Halaman menggunakan format `.jsx` di `resources/js/Pages/` (huruf besar P).
- Komponen di `resources/js/Components/` (huruf besar C).
- **Development (hot reload)**: Jalankan `docker compose up -d vite` untuk menyalakan Vite dev server (container `unit-vite`, port `5174`). Selama container ini aktif, edit `.jsx` langsung ter-refresh di browser (HMR) tanpa perlu build manual — sama seperti setup `app_laravel`.
- **Build produksi/final**: Setelah selesai coding (atau saat container `unit-vite` mati), tetap **WAJIB jalankan** `npm run build` dari host agar aset statis di `public/build` ter-update.

## Koneksi dengan app_laravel
- Shared database: `ubmi_db` (MariaDB)
- Shared tables: `users`, `employees`, `branches`, `employments`, `employee_branches`, `employee_zones`, dll.
- Shared roles/permissions: Spatie Permission (tabel `roles`, `permissions`, `model_has_roles`, `model_has_permissions`, `role_has_permissions`)
- Roles & permissions didefinisikan di: `/home/supermario/projects/app_laravel/database/seeders/RolesAndPermissionsSeeder.php`

## Gaya Komunikasi & Brainstorming
- Komunikasi dengan user menggunakan **Bahasa Indonesia**.
- Saat diajak **brainstorming**, AI **WAJIB bersifat kritis**, menganalisis celah/kemungkinan error dari berbagai sudut pandang, serta memberikan solusi yang **best practice** dan pragmatis (langsung ke sasaran/to-the-point) tanpa perlu terlalu formal atau muluk-muluk.

## Kode
- Jangan hapus komentar dan docstring yang sudah ada kecuali diminta user.
- **DILARANG KERAS** menjalankan perintah `php artisan migrate:fresh` (atau perintah lain yang bersifat merusak/reset database) KECUALI jika saya perintahkan secara eksplisit. Database ini dipakai bersama oleh 2 aplikasi.

## Konteks Aplikasi
- Untuk memahami keseluruhan fitur, alur kerja, dan entitas database dari aplikasi ini (serta hubungannya dengan `app_laravel`), **KAMU WAJIB MEMBACA** file `/home/supermario/projects/unit-apps/.agents/CONTEXT.md` sebelum memulai tugas yang kompleks atau jika membutuhkan pemahaman menyeluruh tentang aplikasi ini.
- **DOKUMENTASI ALUR (FLOW & TABEL):** Setiap kali AI diminta untuk membuat *flow* logika atau modul baru, AI **WAJIB** membuat sebuah file penjelasan (misalnya `implementation.md` atau `namamodul.md` di folder `.agents/`) yang merangkum keseluruhan rute, *controller*, struktur UI, **serta struktur/relasi tabel database** yang terlibat. Hal ini berfungsi agar agen AI di masa depan dapat dengan mudah membayangkan/memvisualisasikan relasi tabel, kerja kontroler, dan logika *flow* tanpa perlu membaca ulang seluruh kode dari awal.

- **CATATAN PERUBAHAN (WAJIB):** Setiap kali mengedit kode, AI **WAJIB** mencatat di `.agents/CHANGELOG.md`: **fungsi/method apa yang tersentuh, controller/route mana yang terdampak, dan tabel mana yang terlibat** (tandai `BACA` / `TULIS` / `BERHENTI-TULIS`). Catat juga apa yang sengaja TIDAK diubah beserta alasannya. Tanpa ini, agen berikutnya harus membaca ulang seluruh kode untuk menilai dampak sebuah perubahan.

- **PETA APLIKASI:** Sebelum tugas kompleks, baca `.agents/skills/peta-aplikasi/SKILL.md` — index peta Route → Controller → fungsi → View → komponen → axios → action, skema DB live, roles/permission, dan daftar jebakan terverifikasi.
