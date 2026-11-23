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

  **Belum diputuskan:** kalau tanggal 1 jatuh di hari libur, tanggal itu bukan
  hari kerja dan Rekap 2 tidak punya barisnya (1 November 2026 = Minggu). Perlu
  ditanyakan ke mas: saldo awal diketik di tanggal 1 walau libur, atau di hari
  kerja pertama bulan itu. Menyangkut Tugas 5, yang masih ditunda.

## 2. Angka

### Yang diketik staf kontrol

**Hanya mutasi hari itu** (keputusan mas 2026-11-23, mengganti keputusan
sebelumnya yang juga mengetik kumulatif): DROP, STORTING, ANGS CM, ANGS MB,
ANGS ML. Tanggal 1 ditambah saldo awal bulan.

JUMLAH DROP, JUMLAH STORTING, SALDO, dan JUMLAH/SALDO tiap ember **dihitung**,
tidak diketik.

**Tempatnya langsung di sel tabel** (keputusan mas; usulan drawer per kantor
ditolak). Kotak isiannya dicontek dari `IsianSel` di Rekap 1
(`resources/js/Pages/Kasir/Rekap/Components/TableRekapKasir.jsx`):

- Diketik dalam **ribuan**: 200 berarti 200.000. Akhiran `.000` tampil saat
  kotak sedang diisi.
- Angka sistem yang belum dikonfirmasi ditulis **miring kelabu**.
- Enter pindah ke kantor berikutnya di kolom yang sama, Escape membatalkan.
- Sel tabel memakai `angka()` dari `lib/modeAngka`, jadi ikut saklar ribuan di
  header seperti rekap lain.

Penahan salah kolom: kepala tabel menempel di atas, dan tiap isian membawa
nama blok serta kolomnya di `title`.

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

**Satu jenis saja: angka tersimpan berbeda dari Rekap 2.** Sel diberi latar
kuning, dan keterangannya (rupiah penuh) muncul saat kursor diarahkan. Tanpa
toleransi, beda Rp1 pun ditandai, dan **tidak menghalangi simpan** — angka
laporan kasir dicatat apa adanya supaya jejak salah lapor tidak hilang.

Pemeriksaan rantai kumulatif (kemarin + mutasi = hari ini) **dihapus**. Sejak
kumulatif dihitung dari mutasi sebulan, angkanya tidak mungkin bertengkar
dengan dirinya sendiri.

### Cara menghitung kumulatif

Dijumlah dari mutasi yang diketik sejak tanggal 1, **bukan** dari baris
kemarin. Alasannya: kalau hari lalu dikoreksi, hari-hari sesudahnya harus ikut
bergeser. Jadi tiap simpan menghitung ulang sebulan untuk kantor itu.

Baris yang sudah dicek **tidak diubah** — angkanya sudah ditandatangani.
Mutasinya tetap ikut dijumlah untuk hari-hari sesudahnya. Sudah diuji:
mengoreksi 2 November menggeser 3 November, tetapi tidak kalau 3 November
sudah dicek.

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
- Angkanya **tidak mencakup semua kantor**. Drop Oktober: monthly closings
  94.445.750.000, `transaction_loans` 95.280.550.000. Beda 834.800.000,
  seluruhnya dari dua kantor: **Sidoarjo 2** kurang 527.300.000 dan **Solo 1**
  kurang 307.500.000. 139 kantor lain sama persis.
  Sebabnya sudah ditelusuri: Sidoarjo 2 dan Solo 1 **masih alur lama**, jadi
  closing-nya memang tidak dipelihara. Bukan data rusak, tapi tetap berarti
  kolom itu tidak bisa dipakai sebagai sumber tunggal.
- Memakai dua sumber (tabel baru untuk bulan lama, closing untuk bulan baru)
  membuat %CM melompat saat batas bulan bergeser, karena kedua sumber tidak
  mencakup kantor yang sama. Itu sebabnya **tidak ada tabel agregasi baru** di
  rancangan ini.

### Drop & storting harian: closing untuk hari terkunci, hitung langsung untuk sisanya

`transaction_daily_closings.drop` dan `.storting` **terisi, tetapi hanya pada
baris yang sudah dikunci kasir** — trigger yang membekukannya saat kunci.
Dicek November 2026: 29.067 baris, 16.358 terkunci, drop pada baris terkunci
64.317.450.000 dari 65.145.150.000 sebulan. Baris yang belum dikunci masih 0,
itu sebabnya pemeriksaan satu tanggal yang belum terkunci tampak nol semua.

Jadi ikuti Rekap 2 apa adanya: hari yang sudah dikunci dibaca dari closing,
hari yang belum dihitung langsung lewat `HitungAgregat::harianBanyak`.
Batas "mulai hitung langsung" ditentukan **per kantor**, bukan per wilayah —
lihat §6 bagian risiko.

### Risiko lain

- `getDataRekapDua` menghitung sebulan penuh per kantor, jadi **jangan**
  dipanggil per kantor. Pakai satu kueri agregat per wilayah (Tugas 3).
- Wilayah terbesar berisi **33 kantor dan 320 kelompok** (wilayah 1 dan 10).
- **Batas hitung langsung per kantor, bukan per wilayah.** Rekap 2 memakai satu
  batas untuk satu kantor; kalau pola itu ditiru untuk satu wilayah, kantor
  yang paling tertinggal menarik semua kantor lain. Dicek 2026-11-23: Sidoarjo 5
  belum terkunci sejak 2 November, dan menghitung 19 hari untuk seluruh
  wilayah 1 memakan 2,66 detik, padahal 31 kantor lainnya angkanya sudah beku.
- Jangan memanggil `Collection::contains()` di dalam loop kelompok. 320
  kelompok dibanding 5.220 baris closing memakan 5,9 detik; pakai hasil
  `groupBy` yang sudah ada.
- `AgregasiScope::pakaiAgregatBaru` sekarang benar untuk **139 dari 142**
  kantor aktif (bukan 37 lagi). Yang masih alur lama: **Sidoarjo 2, Solo 1,
  dan Pusat**. Percabangannya tetap harus ada — saldo awal bulan diambil dari
  `transaction_monthly_closings` (alur baru) atau `transaction_sirculations`
  (alur lama).
- Mutasi kelompok (`Mutasi::saring`) **tidak perlu** di sini: dicek 2026-11-23,
  2.199 mutasi dan nol yang lintas kantor, jadi penjumlahan per kantor tidak
  berubah. Kalau nanti ada mutasi lintas kantor, drop harus disaring seperti
  di `RekapTrait`.
- "HARI KERJA KE-n" — pakai `WorkDay::hariKerjaBulan`, sumber yang sama dengan
  rekap lain.

## Di luar lingkup

- Kasir mengisi sendiri di aplikasi (sumber tetap WA → staf kontrol).
- Notifikasi/pengingat ke kasir.
- Rekap lintas wilayah (level pusat).
