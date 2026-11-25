# Iuran Tabungan 1 Juta per Kantor

Fitur ini membawa menu `/tabungan/contributions` dari `app_laravel` ke `unit-apps`. UI mengikuti `AuthenticatedLayout` dan sidebar unit-apps. Data hanya untuk kantor aktif dari `AuthScope::resolve()` / GlobalBranchFilter (misalnya kantor aktif Gresik 3 hanya menampilkan iuran Gresik 3); tidak menampilkan daftar kantor lain atau accordion wilayah.

UI kontribusi berbagi komponen dengan Iuran BOP: [`.agents/bop_iuran.md`](./bop_iuran.md).

## Route dan alur

| Method | URI | Name | Handler | Perilaku |
|---|---|---|---|---|
| GET | `/tabungan/contributions` | `tabungan.contributions` | `TbContributionController@index` | Riwayat dan ringkasan periode untuk kantor aktif, default bulan berjalan |
| POST | `/tabungan/contributions` | `tabungan.contributions.store` | `TbContributionController@store` | Catat pembayaran iuran |
| DELETE | `/tabungan/contributions/{contribution}` | `tabungan.contributions.destroy` | `TbContributionController@destroy` | Hapus hanya transaksi iuran terbaru kantor |
| GET | `/tabungan/api/contributions/{branch}/history` | `tabungan.api.contributions.history` | `TbContributionController@history` | Ambil riwayat kantor untuk dialog |

Semua route berada di grup `auth`. Halaman memakai `AuthScope::resolve()` untuk mengambil kantor aktif dan memastikannya termasuk kantor yang boleh diakses user; endpoint riwayat juga memeriksa `Branch::getAllowedBranchIds()`. Menambah/menghapus mensyaratkan `create-contributions-all`, role `pusat`/`superuser`, atau `create-contributions-zone`/role `stafkontrol` dengan kantor berada di `employee_zones`. Otorisasi tulis diperiksa lagi di server.

## UI

- `resources/js/Components/Tabungan/OfficeContributionPage.jsx` bersama `resources/js/Pages/Tabungan/Contributions.jsx`: memakai layout/sidebar unit-apps, mengikuti filter kantor global, menampilkan ringkasan dan riwayat hanya untuk kantor aktif, dialog pembayaran, dan konfirmasi hapus.
- `resources/js/Components/Sidebar.jsx`: menu Iuran Tabungan 1 Juta pada grup Administrasi Cabang.
- Tombol pembayaran hanya tampil untuk kantor aktif di luar masa tenggang; pembaca hanya melihat kantor yang sedang dipilih dan memang diizinkan.

## Data bersama

`tb_contributions` didefinisikan dan dimigrasikan dari `app_laravel`; tidak ada perubahan skema di `unit-apps`.

| Tabel | Hubungan / pemakaian |
|---|---|
| `tb_contributions` | `branch_id` → `branches.id`; `created_by` → `users.id`; berisi `period` (`YYYY-MM`), `amount`, `payment_date`, dan `notes` |
| `branches` | kantor/unit, wilayah, status aktif, dan `opening_date` untuk masa tenggang |
| `employee_zones` | scope kantor stafkontrol |
| `employees`, `users` | nama pencatat iuran dan hak akses |

Tidak mengubah tabel lama, menu lain, atau alur global filter kantor.
