---
name: debugging
description: "Menganalisis, memperbaiki bug, dan menyelesaikan error (terutama integrasi Laravel-React dan Shared Database) di unit-apps."
---

# Skill: Debugging & Perbaikan Error di unit-apps

Gunakan panduan ini ketika diminta untuk melakukan investigasi bug, *tracing* error, atau memperbaiki fitur yang berjalan tidak semestinya di `unit-apps`.

## Poin-poin Kritis Pengecekan

1. **Sinkronisasi React & Hot Reload**
   - Masalah: "Kode JSX sudah saya rubah tapi tampilannya tidak berubah."
   - Solusi: Pastikan `npm run dev` sedang berjalan untuk memanfaatkan *Hot Reload*. Anda tidak perlu selalu menjalankan `npm run build` setiap mengubah *file* (kecuali Anda ingin masuk ke *production*).

2. **Permasalahan Database Bersama (Shared Database `ubmi_db`)**
   - Masalah: Butuh penambahan kolom, *seeder*, atau mendapati *error* "Table or view not found".
   - Solusi: Ingat, **JIKA INGIN MENAMBAHKAN KOLOM ATAU SEEDER, TAMBAHKAN DI APLIKASI `app_laravel`**. `unit-apps` hanya membaca tabel yang sudah disiapkan oleh pusat. **Jangan pernah me-reset database**.

3. **Inertia.js Payload**
   - Masalah: Data dari Controller (Laravel) tidak terbaca di Props komponen React.
   - Solusi: Pastikan data dikirim dari *Controller* menggunakan `Inertia::render('Path/Ke/View', ['key' => $value])`. Di sisi React, ambil props dari parameter komponen utama `export default function NamaKomponen({ key }) { ... }`.

4. **Sesi Cabang (Set Branch)**
   - Masalah: Data yang muncul kosong atau merujuk ke cabang yang salah.
   - Solusi: Karena satu user bisa mengelola beberapa cabang, pastikan *session* / *cookie* untuk pengaktifan cabang (via route `set-branch`) sedang berjalan dengan benar dan dikirim sebagai header/konteks saat memanggil data transaksi.

## Langkah-langkah Perbaikan
1. Periksa `storage/logs/laravel.log` (jika error 500 terjadi).
2. Periksa Inspector browser (jika UI React rusak atau ada error JS).
3. Jika masalah pada UI, edit file `.jsx` terkait, pastikan `npm run dev` aktif untuk *hot-reload*, lalu periksa kembali tampilan browser.
4. Tuliskan deskripsi perbaikan dengan singkat namun merujuk pada integrasi *Inertia-React*.
