# Registri Aset Kendaraan — unit-apps

Menu ini memindahkan registri kendaraan dan alur pengelolaannya ke unit-apps. Halaman memakai `AuthenticatedLayout` dan sidebar unit-apps.

## Scope kantor

- Sumber satu-satunya untuk kantor adalah `AuthScope::resolve()->branch_id`.
- Controller memastikan kantor aktif berada di daftar `allowed_branches` milik user; input `branch_id` query string tidak dibaca, termasuk contoh URL sumber `?branch_id=91`.
- Baris masuk daftar dan jadwal pajak hanya jika lokasi terbaru aset berada di kantor aktif. Perubahan pilihan kantor dilakukan melalui `GlobalBranchFilter` di sidebar.
- Pencarian nama, kode aset, dan plat nomor serta filter status tetap dibatasi kantor yang sama.
- Detail dan seluruh endpoint tulis memeriksa lagi bahwa lokasi terbaru kendaraan tetap berada di kantor aktif. Perubahan tujuan mutasi dibatasi ke daftar kantor yang diizinkan untuk user.

## Data dan tampilan

- `VehicleAssetController@index` mengirim ringkasan jumlah kendaraan, status aktif/bermasalah, dan nilai perolehan; daftar dipaginasi 25 baris per halaman.
- `Assets/Vehicles.jsx` menampilkan kantor aktif, empat kartu ringkasan, filter pencarian/status, tabel kode aset, plat, nama, pemakai, harga beli, tanggal pajak/STNK, status, serta tombol tambah/ubah.
- `Assets/VehicleTaxes.jsx` menampilkan jadwal pajak untuk bulan yang dipilih, tanggal jatuh tempo, status dan dialog pembayaran.
- `Components/Assets/VehicleAssetDetail.jsx` memuat detail, riwayat penempatan, pajak dan servis; mendukung mutasi lokasi, catat servis, hapus aset, dan pembatalan pajak.
- `Components/Assets/VehicleAssetForm.jsx` membuat atau mengubah kendaraan. Kendaraan baru otomatis ditempatkan di kantor aktif; plat/tanggal STNK/jatuh tempo existing hanya bisa diedit dengan permission koreksi khusus.
- Pembayaran pajak memakai transaksi DB dan row lock kendaraan; periode pajak dibuat satu per tahun, nominal pembayaran masuk ke periode terakhir. Tunggakan maksimal 10 periode. Pembatalan hanya untuk pembayaran paling akhir bila rantai tanggal masih konsisten.
- Relasi `InvAsset.currentLocation()` memilih lokasi dengan ID terbesar untuk setiap aset, sesuai alur aplikasi sumber.

## Tabel

Definisi skema tetap dimiliki `app_laravel`; unit-apps memakai tabel bersama berikut.

| Tabel | Kegunaan |
|---|---|
| `branches` | Nama/wilayah kantor aktif |
| `inv_categories` | Memilih kategori `Kendaraan` |
| `inv_assets` | Kode, nama, harga perolehan, dan status aset |
| `inv_vehicles` | Plat nomor dan tanggal pajak/STNK |
| `inv_locations` | Menentukan kantor dan pemakai aset saat ini |
| `inv_vehicle_taxes` | Riwayat pembayaran pajak dan perubahan masa STNK |
| `inv_maintenance_logs` | Riwayat biaya dan catatan servis |
| `users` | ID user pencatat konfirmasi pajak |

## Route

| Route | Fungsi |
|---|---|
| `GET /assets` (`assets.index`) | Registri dan ringkasan |
| `POST /assets` (`assets.store`) | Buat aset kendaraan pada kantor aktif |
| `GET /assets/her` (`assets.her`) | Jadwal pajak bulan terpilih |
| `POST /assets/her/{vehicle}/confirm` (`assets.her.confirm`) | Konfirmasi pembayaran pajak/HER |
| `DELETE /assets/her/tax/{tax}` (`assets.her.cancel`) | Batalkan pembayaran terakhir/hapus pajak warisan |
| `GET /assets/{asset}/detail` (`assets.detail`) | Muat detail terotorisasi untuk drawer |
| `PUT/DELETE /assets/{asset}` (`assets.update`, `assets.destroy`) | Ubah/hapus kendaraan |
| `POST /assets/{asset}/mutate` (`assets.mutate`) | Tambah riwayat lokasi/PIC |
| `POST /assets/{asset}/maintenance` (`assets.maintenance.store`) | Tambah catatan servis |

## Batas fitur

Tidak ada perubahan migration/seeder atau kode pada `app_laravel`. Delete aset menghapus riwayat cascading berdasarkan foreign key yang ada di database live; UI meminta konfirmasi sebelum aksi permanen. Pengelolaan hanya untuk aset kategori Kendaraan.
