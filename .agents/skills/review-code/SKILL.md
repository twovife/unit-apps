---
name: review-code
description: "Mereview atau me-refactor kode di unit-apps dengan standar Laravel 11, React, dan Tailwind CSS."
---

# Skill: Review & Refactoring Kode di unit-apps

Gunakan panduan ini saat diminta untuk mereview, merapikan, atau me-refactor kode yang ada di aplikasi `unit-apps`.

## Prinsip Dasar
1. **Dilarang Menghapus Komentar/Docstring:** Jangan pernah menghapus komentar yang ada pada kode yang ada kecuali secara eksplisit disuruh oleh *User*.
2. **Standardisasi Laravel 11:** Pastikan penulisan Controller, Model, dan Route mengikuti standar Laravel 11 yang lebih *clean* (seperti penulisan *Route::controller()* grouping).
3. **Optimisasi React & Performa (1000+ User):** Jika mereview kode (baik *frontend* maupun *backend*), pastikan kode tersebut sanggup menangani skala 1000+ *user* online secara bersamaan. Hindari *looping query* di *Controller* dan cegah *re-render* berlebihan di React (manfaatkan `useMemo`, `useCallback`).
4. **Standar Komponen (Shadcn UI):** Selalu pastikan antarmuka merujuk pada pedoman **[Shadcn UI](https://ui.shadcn.com/)**. **WAJIB** memeriksa elemen UI seperti *Filter*, *Card*, *Badge*, *Button*, dll; pastikan elemen-elemen tersebut TIDAK di-hardcode secara berulang, melainkan diekstrak menjadi komponen *reusable*.
5. **Aturan Perubahan Database Bersama:** Jangan menyarankan penghapusan (*drop*) pada tabel *shared*. **ATURAN MUTLAK:** Jika dari review ditemukan kebutuhan penambahan kolom atau pembuatan *seeder*, arahkan agar penambahan tersebut dilakukan HANYA di aplikasi `app_laravel`.
6. **Development (Hot Reload):** Ingatkan untuk mengaktifkan `npm run dev` untuk efek *hot reload*. Tidak perlu selalu menjalankan `npm run build` setelah perbaikan kecil kecuali untuk di-*deploy* ke *production*.
