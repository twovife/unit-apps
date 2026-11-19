# Iuran BOP per Kantor

Iuran BOP di `unit-apps` mengikuti pola visual dan navigasi halaman Iuran Tabungan: layout/sidebar unit-apps, kantor aktif dari GlobalBranchFilter, ringkasan kantor tersebut, riwayat, input, dan hapus transaksi terbaru. Tidak ada daftar seluruh kantor atau accordion.

## Route dan alur

| Method | URI | Name | Handler | Perilaku |
|---|---|---|---|---|
| GET | `/bop/contributions` | `bop.contributions` | `BopContributionController@index` | Ringkasan/riwayat kantor aktif untuk periode terpilih |
| POST | `/bop/contributions` | `bop.contributions.store` | `BopContributionController@store` | Catat setoran BOP |
| DELETE | `/bop/contributions/{contribution}` | `bop.contributions.destroy` | `BopContributionController@destroy` | Hapus hanya transaksi terakhir kantor |
| GET | `/bop/api/contributions/{branch}/history` | `bop.api.contributions.history` | `BopContributionController@history` | JSON riwayat kantor |

Semua route berada di middleware `auth`. Halaman menggunakan `AuthScope::resolve()` dan memvalidasi scope kantor aktif. Endpoint riwayat membatasi kantor melalui `Branch::getAllowedBranchIds()`. Hak menambah/menghapus mengikuti `create-contributions-all` atau `create-contributions-zone` sesuai pola `BopController` di `app_laravel`; kantor zona mengikuti daftar allowed branch. Endpoint tulis memeriksa permission kembali di server.

Nominal acuan pelunasan BOP adalah Rp1.500.000. Kantor tutup atau yang masih dalam masa tenggang tidak dapat menerima setoran baru. Penghapusan menerapkan LIFO: hanya transaksi BOP terakhir kantor yang dapat dihapus.

## Frontend

- `resources/js/Components/Tabungan/OfficeContributionPage.jsx` adalah UI reusable untuk Tabungan dan BOP: filter periode, ringkasan satu kantor, daftar riwayat, dialog input, dan dialog konfirmasi hapus.
- `resources/js/Pages/Tabungan/Contributions.jsx` mengatur route Tabungan dan target Rp1.000.000.
- `resources/js/Pages/Tabungan/BopContributions.jsx` mengatur route BOP dan target Rp1.500.000.
- `resources/js/Components/Sidebar.jsx` menempatkan **Iuran Tabungan 1 Juta** dan **Iuran BOP** sebagai item tepat di bawah **Data Karyawan** dalam Administrasi Cabang.

## Tabel bersama

| Tabel | Pemakaian |
|---|---|
| `ops_bop_contributions` | Data BOP: kantor, periode, nominal, tanggal, catatan, pencatat |
| `branches` | Kantor aktif, wilayah, masa operasional dan scope |
| `employee_zones` | Scope kantor zona untuk permission staf kontrol |
| `employees`, `users` | Data pencatat dan hak akses |

Definisi skema `ops_bop_contributions` dimiliki `app_laravel`; `unit-apps` hanya memakai tabel tersebut. Tidak ada perubahan migration atau seeder.
