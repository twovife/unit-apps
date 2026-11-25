---
name: peta-aplikasi
description: Peta lengkap unit-apps — Route → Controller@method → fungsi custom → View Inertia → komponen → axios/API → action di view, plus skema database, roles/permissions, AuthScope/branch filter, validasi & redirect. Baca ini SEBELUM menambah fitur, debugging, atau tracing alur data apa pun di unit-apps.
---

# Peta Aplikasi unit-apps

Index navigasi. Semua detail ada di `references/`. **Jangan menebak alur — buka file referensi yang relevan.**

| Butuh tahu... | Baca |
|---|---|
| Route mana → controller apa → view mana → tombol apa | `references/01_routing_map.md` |
| Tabel, kolom, relasi, jumlah baris nyata | `references/02_database_schema.md` |
| Siapa boleh apa, cabang aktif, redirect login | `references/03_auth_roles_scope.md` |
| Struktur Pages/Components/Hooks React | `references/04_frontend_map.md` |
| Jebakan & bug yang sudah terverifikasi | `references/05_temuan_dan_jebakan.md` |
| Fungsi buatan sendiri (helper/trait/controller/hook) | `references/06_fungsi_custom.md` |
| **Apa yang baru berubah & apa dampaknya** | **`../../CHANGELOG.md`** — baca ini DULU, isi referensi di bawah bisa tertinggal |

> **WAJIB**: setiap kali mengedit kode, catat di `.agents/CHANGELOG.md` — fungsi apa yang tersentuh, controller/route mana yang terdampak, tabel mana yang terlibat (`BACA`/`TULIS`/`BERHENTI-TULIS`), plus apa yang sengaja tidak diubah beserta alasannya.

## Ringkasan 30 detik

- **Stack**: Laravel **12** (struktur lawas `bootstrap/app.php` + `app/Http/Kernel.php`, bukan skeleton L11+), Inertia v1, React 18 JSX, Tailwind v4, Radix/Shadcn porting manual, Spatie Permission 6.16.
- **Database**: `ubmi_db` (MariaDB) **dipakai bersama** `app_laravel`. Container: `laravel-db`, user `laravel`/`secret`. Akses: `docker exec laravel-db mysql -ularavel -psecret ubmi_db`.
- **Artisan**: `docker exec unit-app php artisan ...`. **Frontend**: `npm run build` dari host, atau `docker compose up -d vite` (port 5174) untuk HMR.
- **Inti bisnis**: pinjaman mingguan per kelompok/mantri. **Tabel utama hanya dua: `transaction_loans` (1,95 jt baris) dan `transaction_loan_instalments` (10,8 jt baris)** — terpanas, selalu pikirkan indeks & scope sebelum query.
- ⛔ **`loans`, `loan_requests`, `instalments`, `customers` (model `Loan`, `LoanRequest`, `Instalment`, `Customer`) SUDAH TIDAK DIPAKAI** — skema generasi lama, berhenti ditulis sejak Sep–Okt 2024. Yang tersisa di kode cuma import mati di `LoanController` & `MantriAppsController` (dua-duanya badan kelasnya kosong). Jangan dijadikan acuan. Detail: `references/02_database_schema.md` bagian 3.

## Bentuk arsitektur yang wajib dipahami

**1. Semua scoping data lewat satu pintu: `AuthScope::resolve()`**
Hampir semua halaman baca dimulai dari sini, bukan dari `$request->branch_id`. Ia mengembalikan `{branch_id, wilayah, kelompok, allowed_branches, user}`. Cabang aktif disimpan di session key `active_branch_id_{userId}` dan diganti lewat `POST /set-branch`.

**2. Data halaman datang dari 2 Trait, bukan dari controller**
`PinjamanTrait` (5 fungsi) dan `RekapTrait` (4 fungsi) yang menyusun props. Controller cuma memanggil trait lalu `Inertia::render`. Kalau ada data salah di layar, **bug-nya hampir pasti di trait**, bukan di controller.

**3. Pages/WebView/** dan **Pages/MobileApps/** cuma pembungkus tipis
Isi sebenarnya ada di `Pages/BukuTransaksi/`, `Pages/NewAngsuran/`, `Pages/NewLoan/`, `Pages/Kasir/`. Satu komponen inti dipakai dua tampilan (desktop + mantri mobile). Ubah satu, dua-duanya terpengaruh.

**4. Dua jalur komunikasi ke server**
- **Inertia** (`useForm`, `router.*`) untuk semua yang mengubah data → server balas `redirect()->back()`.
- **axios** untuk baca data on-demand di dalam modal/dialog (cari NIK, buka detail pinjaman, sinkronisasi angsuran) → server balas `response()->json()`. Tidak ada REST API terpisah; endpoint axios adalah route web yang sama.

## Aturan kerja

- Komunikasi dengan user **Bahasa Indonesia**, kritis dan to-the-point (lihat `.agents/AGENTS.md`).
- **DILARANG** `migrate:fresh` atau perintah destruktif — database dipakai 2 aplikasi.
- Migration/seeder **dibuat dari `app_laravel`** (single source of truth).
- Setiap membuat modul/flow baru, **wajib** tambah/update file dokumentasi di `.agents/` (aturan `AGENTS.md`) — termasuk memperbarui referensi di skill ini.
- Konteks lintas-aplikasi: `app_laravel/.agents/skills/ubmi-project-context/`.
