# Rekap Sirkulasi Wilayah — rancangan

Status: disetujui mas 2026-11-23, belum diimplementasi.

## Latar

Hari ini kasir melapor angka harian lewat WA ke staf kontrol wilayahnya, lalu
staf kontrol mengetik ulang ke Excel. Menu ini menggantikan Excel itu: angka WA
dicatat di aplikasi, dibandingkan dengan sistem (Rekap 2), dicek, dan dicatat
jejaknya.

## 1. Halaman

- Menu: **Laporan → Rekap Sirkulasi Wilayah**.
- Filter: wilayah + tanggal. Staf kontrol terkunci ke wilayahnya sendiri
  (`AuthScope`); superuser/pusat bebas memilih.
- Kepala: tanggal + "HARI KERJA KE-n".
- Baris: satu per kantor di wilayah (kelompok 1–10 dijumlah), lalu baris
  **total wilayah**.
- Kolom (urutan Excel mas):

| Blok | Kolom |
|---|---|
| Sirkulasi | DROP, JUMLAH DROP, STORTING, JUMLAH STORTING, SALDO |
| Calon Macet | ANGS, JUMLAH, SALDO, %, SALDO LAMA |
| Macet Baru | ANGS, JUMLAH, SALDO, %, SALDO LAMA |
| Macet Lama | ANGS, JUMLAH, SALDO, % |

- Tanggal 1: tambahan kolom saldo awal bulan (sirkulasi, CM, MB, ML).

## 2. Angka

### Yang diketik staf kontrol

Mutasi harian **dan** kumulatif (keputusan mas): DROP, JUMLAH DROP, STORTING,
JUMLAH STORTING, SALDO, dan ANGS/JUMLAH/SALDO untuk CM, MB, ML. Tanggal 1
ditambah saldo awal bulan.

Semua sel itu **terisi lebih dulu dari Rekap 2** (`getDataRekapDua`,
`app/Traits/RekapTrait.php`, dijumlah per kantor). Staf kontrol menimpa dengan
angka WA kasir.

### Yang dihitung sistem

- **SALDO LAMA CM** = jumlah drop kantor pada bulan T−3 × 1,3.
- **SALDO LAMA MB** = jumlah drop kantor pada bulan T−4 × 1,3.
  (T = bulan tanggal yang dibuka. Batas bulan sama dengan `$dateOfCm` /
  `$dateOfMb` di `RekapTrait`. Tetap sepanjang bulan.)
- **Sumber drop bulan rujukan: `transaction_loans`** (`status = 'success'`,
  `nominal_drop`, disaring `Mutasi::saring` atas `drop_date`), BUKAN
  `transaction_monthly_closings.drop` dan BUKAN tabel agregasi baru
  (keputusan mas 2026-11-23). Alasannya di §6.
  Angkanya tetap sebulan, jadi disimpan di `Cache::remember` berkunci
  wilayah + bulan rujukan. Diukur: satu wilayah (32 kantor) dua bulan = 0,9
  detik.
- **% CM** = SALDO CM / SALDO LAMA CM.
- **% MB** = SALDO MB / SALDO LAMA MB.
- **% ML** = SALDO ML / SALDO (sirkulasi).
- Baris total wilayah = jumlah tiap kolom; % baris total dihitung dari jumlah
  pembilang / jumlah penyebut, **bukan** rata-rata persen kantor.

### Tanda selisih

Dua jenis, keduanya **hanya tanda di sel, simpan tetap boleh** (angka WA
dicatat apa adanya agar jejak salah lapor kasir tidak hilang):

1. **Beda dengan Rekap 2** — nilai diketik ≠ nilai sistem. Tooltip menunjukkan
   angka sistem.
2. **Tidak cocok dengan angka sendiri**:
   - JUMLAH hari ini ≠ JUMLAH hari kerja sebelumnya + mutasi hari ini
     (berlaku untuk drop, storting, angs CM/MB/ML).
   - SALDO sirkulasi hari ini ≠ saldo kemarin + DROP × 1,3 − STORTING.
   - Tanggal 1: pembanding "kemarin" adalah saldo awal bulan.

Tidak ada toleransi: beda Rp1 pun ditandai.

## 3. Penyimpanan

Migrasi ditulis dan dijalankan **dari app_laravel**, digabung ke satu berkas
migrasi terbaru yang belum di prod. Kabari sesi app_laravel.

### `regional_circulation_recaps`

| Kolom | Catatan |
|---|---|
| id | |
| branch_id | FK branches |
| tanggal | date |
| wilayah | salinan saat disimpan (kantor bisa pindah wilayah) |
| drop, total_drop, storting, total_storting, sirkulasi | bigint, nullable |
| angsuran_cm, total_angsuran_cm, saldo_cm | bigint, nullable |
| angsuran_mb, total_angsuran_mb, saldo_mb | bigint, nullable |
| angsuran_ml, total_angsuran_ml, saldo_ml | bigint, nullable |
| awal_sirkulasi, awal_cm, awal_mb, awal_ml | bigint, nullable; hanya tanggal 1 |
| saldo_lama_cm, saldo_lama_mb | bigint, nullable; diisi saat Cek |
| checked_by, checked_at | nullable; terisi = baris terkunci |
| timestamps | |

Unik: (`branch_id`, `tanggal`). Nama kolom mengikuti `KOLOM_HARIAN` di
`resources/js/Pages/Kasir/Rekap/Components/TableRekap.jsx` agar mudah
dibandingkan.

Baris belum ada = belum diketik; layar menampilkan nilai Rekap 2 sebagai isian
awal. Baris dibuat saat simpan pertama.

**SALDO LAMA disimpan saat Cek**, supaya angka yang sudah ditandatangani tidak
bergeser bila drop lama dikoreksi. Sebelum Cek, layar menghitungnya langsung.

### `regional_circulation_recap_logs`

| Kolom | Catatan |
|---|---|
| id | |
| regional_circulation_recap_id | FK |
| user_id | |
| action | `ubah` / `cek` / `buka` |
| field | nullable; nama kolom untuk `ubah` |
| old_value, new_value | nullable |
| reason | nullable; wajib untuk `buka` |
| created_at | |

Satu baris log per kolom yang berubah.

## 4. Alur dan hak akses

- **Simpan**: per baris kantor. Tiap kolom yang berubah → log `ubah`.
- **Cek**: per baris kantor. Mengisi `checked_by`, `checked_at`, `saldo_lama_*`;
  log `cek`. Baris terkunci (input dinonaktifkan, server menolak ubah).
- **Buka**: wajib alasan. Mengosongkan `checked_by`/`checked_at`; log `buka`.
- Halaman wilayah **selesai** bila semua baris kantor sudah dicek. Tidak ada
  tombol tambahan.
- Yang boleh simpan/Cek/Buka: **stafkontrol** (hanya wilayahnya) dan
  **superuser**. Peran lain yang punya akses Laporan hanya melihat.
- Pemeriksaan wilayah di server memakai `AuthScope`; pelanggaran →
  `AppHelper::PESAN_BUKAN_WILAYAH`.
- Riwayat log per baris bisa dibuka dari baris itu (drawer).

## 5. Ekspor

- **Tahap awal**
  - PDF: cetak browser (`window.print()` + CSS `@media print`), tanpa library.
  - Excel `.xlsx`: library baru `exceljs`, header bertingkat dan format angka
    seperti Excel mas.
- **Paling akhir**: snapshot PNG tabel untuk WA, library `html-to-image`.

## 6. Temuan dan risiko

Hasil penyelidikan 2026-11-23, sebelum satu baris kode ditulis.

### Kenapa drop bulan rujukan tidak diambil dari closing

`transaction_monthly_closings.drop` sudah ada, tapi tidak dipakai:

- Isinya **hanya mulai periode 2026-10-01**. Untuk Rekap November, CM butuh
  drop Agustus dan MB butuh drop Juli — dua bulan itu tidak ada barisnya.
- Angkanya sudah **menyimpang** dari transaksinya. Drop Oktober:
  monthly closings 94.445.750.000, `transaction_loans` 95.280.550.000.
  Beda 834.800.000, seluruhnya dari dua kantor: **Sidoarjo 2** kurang
  527.300.000 dan **Solo 1** kurang 307.500.000. 139 kantor lain sama persis.
  Jadi kolom itu cetakan sesaat yang bisa ketinggalan bila drop dimasukkan
  atau dikoreksi sesudah closing dibuat.
- Memakai dua sumber (tabel baru untuk bulan lama, closing untuk bulan baru)
  membuat %CM melompat saat batas bulan bergeser, karena kedua sumber tidak
  sama. Itu sebabnya **tidak ada tabel agregasi baru** di rancangan ini.

Penyimpangan drop Oktober di Sidoarjo 2 dan Solo 1 adalah temuan terpisah dan
di luar lingkup menu ini, tapi perlu ditindaklanjuti: angka itu jadi jangkar
saldo awal bulan berikutnya.

### `transaction_daily_closings` belum bisa jadi sumber drop/storting

Dicek pada 2026-11-20: ada 1.363 baris dari 137 kantor, tetapi `SUM(drop)` dan
`SUM(storting)` keduanya **0**, dan tidak satu baris pun `drop > 0`. Barisnya
dibuat `closing:generate`, kolom agregatnya belum pernah diisi. Rekap 2 sendiri
juga tidak membacanya: drop dari `transaction_loans`, storting dari
`transaction_loan_instalments`, dan `daily_closings` hanya dipakai untuk
kasbon, transport, setoran, serta status kunci.

### Risiko lain

- `getDataRekapDua` menghitung sebulan penuh per kantor, jadi **jangan**
  dipanggil per kantor. Pakai satu kueri agregat per wilayah (Tugas 3).
- `AgregasiScope::pakaiAgregatBaru` sekarang benar untuk **139 dari 142**
  kantor aktif (bukan 37 lagi). Percabangan alur lama hanya menyangkut 3
  kantor, tapi tetap harus ada — saldo awal bulan diambil dari
  `transaction_monthly_closings` (alur baru) atau `transaction_sirculations`
  (alur lama).
- "HARI KERJA KE-n" — pakai `WorkDay::hariKerjaBulan`, sumber yang sama dengan
  rekap lain.

## Di luar lingkup

- Kasir mengisi sendiri di aplikasi (sumber tetap WA → staf kontrol).
- Notifikasi/pengingat ke kasir.
- Rekap lintas wilayah (level pusat).
