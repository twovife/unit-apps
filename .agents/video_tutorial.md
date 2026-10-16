# Modul & Aset Video Tutorial (`MinIO Storage`)

Dokumentasi integrasi video tutorial pemakaian aplikasi di `unit-apps` yang disimpan di **MinIO Storage** (`ubmi-bucket/tutorial/`) dan diputar melalui popup dialog di antarmuka web.

---

## 1. Penyimpanan Aset Video di MinIO

Seluruh video tutorial disimpan di object storage MinIO (bucket: `ubmi-bucket`, direktori `tutorial/`) dengan rincian:

| File di MinIO | Asal File | Ukuran | Fitur Terkait |
|---|---|---|---|
| `tutorial/iuran.mp4` | `D:\nota tf\iuran.mp4` | ~19.9 MB | Iuran Tabungan 1 Juta & BOP Cabang |
| `tutorial/pinjamanmodal.mp4` | `D:\nota tf\pinjamanmodal.mp4` | ~23.3 MB | Pembayaran Pokok & Jasa Pinjaman Modal |
| `tutorial/sksw.mp4` | `D:\nota tf\sksw.mp4` | ~21.2 MB | Laporan, Setoran & Mutasi SKSW Unit |
| `tutorial/tabungangoro.mp4` | `D:\nota tf\tabungangoro.mp4` | ~11.7 MB | Setoran Tabungan Goro Umrah & Bukti Transfer |
| `tutorial/cekaset.mp4` | `D:\nota tf\cekaset.mp4` | ~20.6 MB | Registri Aset Kendaraan, Servis & Pajak/STNK |
| `tutorial/lamaran.mp4` | `D:\nota tf\lamaran.mp4` | ~23.7 MB | Pencatatan Lamaran Kerja & Upload Dokumen |

*Akses URL*: Menggunakan presigned temporary URL 3 jam via disk `s3_publik` (`AWS_PUBLIC_ENDPOINT`), sehingga file aman dan tidak terbuka secara publik tanpa izin.

---

## 2. Arsitektur Kode & Alur Data

### Helper Backend: `App\Helpers\VideoTutorial`
- Lokasi: `app/Helpers/VideoTutorial.php`
- Metode: `VideoTutorial::url(array|string|null $kunci)`
- Fungsi: Menghasilkan array `kunci => temporaryUrl` menggunakan disk `s3_publik`. Jika MinIO offline / gagal, fungsi menangani exception secara aman dengan log warning dan mengembalikan `[]`.

### Komponen Frontend: `VideoTutorialButton`
- Lokasi: `resources/js/Components/VideoTutorialButton.jsx`
- Fitur:
  - Tombol dengan ikon `PlayCircle` / `Video` bertuliskan "Video Panduan".
  - Mode **Single Video**: Langsung memutar video yang diberikan (judul & deskripsi dinamis).
  - Mode **Multi Video / Playlist**: Menampilkan tab pemilih video di bagian atas dialog player (misal di Dashboard Kasir yang memiliki 4 video).
  - Dialog responsif dengan pemutar HTML5 (`<video controls autoPlay playsInline>`).
  - Jika video kosong/tidak tersedia, tombol otomatis disembunyikan.

---

## 3. Penempatan di Halaman Web

### A. Dashboard Kasir (`/dashboard-kasir`)
- **Controller**: `PembayaranKantorController@halaman`
- **Route**: `dashboard.kasir`
- **View**: `resources/js/Pages/Kasir/Dashboard/Index.jsx` -> `resources/js/Components/PembayaranKantor.jsx`
- **Penempatan**: Tepat di sebelah judul Hero (`Dashboard Kasir — [Unit]`).
- **Daftar Video**:
  1. `iuran`: Panduan Iuran Bulanan (Tabungan & BOP)
  2. `pinjamanmodal`: Panduan Pembayaran Pinjaman Modal
  3. `sksw`: Panduan SKSW — Laporan & Setoran Unit
  4. `tabungangoro`: Panduan Setoran Tabungan Goro Umrah

### B. Registri Aset Kendaraan (`/assets`)
- **Controller**: `VehicleAssetController@index`
- **Route**: `assets.index`
- **View**: `resources/js/Pages/Assets/Vehicles.jsx`
- **Penempatan**: Di deretan tombol aksi header (bersebelahan dengan *Pajak Kendaraan* dan *Kendaraan Baru*).
- **Video**: `cekaset` (Panduan Pengelolaan Aset Kendaraan).

### C. Lamaran Kerja (`/administrasi/lamaran`)
- **Controller**: `LamaranKerjaController@index`
- **Route**: `administrasi.lamaran.index`
- **View**: `resources/js/Pages/Administrasi/Lamaran/Index.jsx`
- **Penempatan**: Di sebelah judul header `Lamaran Kerja`.
- **Video**: `lamaran` (Panduan Pencatatan Lamaran Kerja).

### D. Angsuran Lancar (`/mobile_apps/angsuran`)
- **Controller**: `MobileAppsMantriController@angsuran`
- **Route**: `mobile_apps.angsuran`
- **View**: `resources/js/Pages/MobileApps/Angsuran/Index.jsx` -> `resources/js/Pages/NewAngsuran/Angsuran.jsx`
- **Penempatan**: Di sebelah judul `Angsuran Lancar`.
- **Daftar Video**:
  1. `pelunasan`: Pengajuan Nasabah Lama Lewat Menu Angsuran (`pengumuman/pelunasan.mp4`)
  2. `input_angsuran`: Perubahan Tampilan Menu Angsuran (`pengumuman/input-angsuran.mp4`)

---

## 4. Tabel Database Terlibat
- **Tidak ada tabel baru**: Fitur ini sepenuhnya memanfaatkan MinIO S3 storage dan presigned URL generation tanpa mengubah skema tabel database `ubmi_db`.
