# Rekap Sirkulasi Wilayah — rancangan

Status: jalan di lokal 2026-11-24. Belum dipush, migrasinya belum di prod.
Yang belum: ekspor (§5).

## Latar

Hari ini kasir melapor angka harian lewat WA ke staf kontrol wilayahnya, lalu
staf kontrol mengetik ulang ke Excel. Menu ini menggantikan Excel itu: angka WA
dicatat di aplikasi, dibandingkan dengan sistem (Rekap 2), dicek, dan dicatat
jejaknya.

## 1. Halaman

- Menu: **Laporan → Rekap Sirkulasi Wilayah**.
- Filter: wilayah + **bulan** (`?bulan=Y-m`), sama dengan Rekap 2. Staf kontrol
  terkunci ke wilayahnya sendiri (`AuthScope`); superuser/pusat bebas memilih.
- Isinya **sebulan penuh**: satu blok per tanggal, berurutan. Di atas ada deret
  tombol tanggal seperti Rekap 2 — mengklik melompat ke blok tanggal itu dan
  menyalakan tombolnya; hijau kalau semua kantor tanggal itu sudah dicek,
  kelabu kalau hari libur.

  Tombolnya **tidak** mengikuti posisi gulir. Sempat dibuat begitu dengan
  `IntersectionObserver`, lalu dibuang 2026-11-24: tiap layar bergeser,
  halaman dirender ulang dan 25 blok dibandingkan lagi.

- Baris filter menempel di `top-14`, tepat di bawah navbar (`h-14`). `top-0`
  membuatnya menutupi navbar saat digulir.

- **Halaman dibuka langsung di tanggal hari ini**, bukan di tanggal 1
  (permintaan mas 2026-11-24). Kalau bulan yang dipilih bukan bulan berjalan,
  tidak ada yang digeser.

- **Tanggal yang belum terjadi dikosongkan.** Barisnya tetap ada supaya
  bulannya utuh, tapi angkanya **tidak dikirim server** (`sistem` kosong,
  `diketik` null), selnya kosong di layar, tombol tanggalnya mati, dan
  `boleh_ubah` false. Angka sistem di tanggal mendatang cuma nol, dan nol yang
  dipamerkan terbaca seperti laporan kasir yang nol.

  Penjaganya ada di server juga: simpan dan cek menolak 422 untuk tanggal
  yang lebih besar dari hari ini.

  Tanggal mendatang juga tidak ikut hitungan "x dari y baris sudah dicek".
- Tidak ada gulir di dalam gulir: tabelnya hanya menggulir ke samping
  (`overflow-x-auto`), dan yang menempel cuma kolom Kantor.
- Kepala tiap blok: pita tanggal bergaya Rekap 2 — "Senin, 02-11-2026",
  latar kelabu, Senin merah muda — ditambah "hari kerja ke-n" dan
  "x/33 dicek".

### Bentuk tabel mengikuti Rekap 2

Permintaan mas 2026-11-24: semirip mungkin dengan Rekap 2, tabel dan warnanya.

- Nama kolom disamakan dengan `KOLOM_HARIAN` di Rekap 2: Jml Drop, Jml
  Storting, Sirkulasi, Angs CM, Jml CM, Saldo CM, dan seterusnya. Yang tidak
  ada di Rekap 2 cuma kolom persen.
- Warna blok **diimpor** dari `WARNA` di
  `Kasir/Rekap/Components/TableRekapKasir.jsx`, bukan disalin: drop biru,
  storting kuning, sirkulasi hijau, CM biru, MB kuning, ML merah. Yang
  berwarna cuma baris total; sel biasa putih, selang-seling kelabu, biru saat
  disinggahi.
- Ukuran & jarak sama: `text-xs tabular-nums`, kepala `px-3 py-2` di
  `bg-slate-100`, sel `px-3 py-1`.
- Baris total `bg-emerald-50 font-bold`, tiap kolomnya memakai warna bloknya.
- Chip tanggal memakai kelas yang sama dengan `TabelHarian`.
- Panel Sirkulasi Awal memakai `Accordion` shadcn dengan ikon dompet, seperti
  kartu "Saldo Awal Bulan" di Rekap 2. Dibuka sejak awal: Radix melepas isi
  panel yang tertutup, jadi kalau tertutup dia tidak ikut tercetak.
- Baris: satu per kantor di wilayah (kelompok 1–10 dijumlah), lalu baris
  **total wilayah**.
- Kolom per tanggal (urutan Excel mas), 17 kolom:

| Blok | Kolom |
|---|---|
| Sirkulasi | Drop, Jml Drop, Storting, Jml Storting, Saldo |
| Calon Macet | Angs, Jumlah, Saldo, % |
| Macet Baru | Angs, Jumlah, Saldo, % |
| Macet Lama | Angs, Jumlah, Saldo, % |

  Lalu tiga kolom penanda: Kasir, KM, Staf Kontrol (§4).

  **Saldo Lama dan Drop CM/MB tidak ada di tabel harian** (keputusan mas
  2026-11-24): angkanya tetap sepanjang bulan, jadi tempatnya di panel
  Sirkulasi Awal. Yang per tanggal hanya yang bergerak per tanggal.

### Panel Sirkulasi Awal

`<details>` bawaan browser, jadi buka-tutupnya tidak perlu state dan isinya
tetap bisa dicari dengan Ctrl+F.

Panel **Rekap Mingguan** sempat dibuat lalu **dihapus** atas permintaan mas
2026-11-24: satu bulan di layar baru punya satu minggu berisi, jadi barisnya
mengulang baris Sebulan dan tidak menambah apa pun.

- **Sirkulasi Awal <bulan>** — tertutup menampilkan total wilayah, dibuka
  menampilkan tiap kantor. Kolomnya, urutan permintaan mas 2026-11-24:
  Pemutihan | Drop Bln Lalu | Sirkulasi | Drop CM | CM | % | Drop MB | MB | % |
  ML | %.

- **Hari libur dianggap tidak ada** (aturan mas 2026-11-23). Tanggal yang bukan
  hari kerja menurut `WorkDay::hariKerja()` tetap bisa DILIHAT, tetapi tidak
  ada yang boleh diisi: layar mematikan isiannya dan server menolak simpan
  dengan 422.

  Halamannya sengaja tidak disembunyikan. Kalau hari libur ternyata ada
  angkanya, berarti ada transaksi tercatat di sana dan itu perlu ditelusuri —
  menyaring tanggalnya hanya akan menyembunyikan masalahnya. Banner di atas
  tabel mengatakan itu.

- **Saldo awal bulan diketik di HARI KERJA PERTAMA bulan itu**, bukan di
  tanggal 1. 1 November 2026 jatuh di hari Minggu, jadi tanggal 1 bisa saja
  bukan hari kerja. Kolomnya belum dibuat; ini aturannya untuk nanti.

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

### Menyimpan: autosave, tanpa tombol Simpan

Keputusan mas 2026-11-24, mengganti tombol "Simpan n isian". Satu sel dikirim
**saat kotaknya ditinggalkan** (blur atau Enter), dan hanya kalau angkanya
benar-benar berubah. Jadi satu sel = satu permintaan, bukan satu ketukan = satu
permintaan.

Balasannya **bukan halaman penuh melainkan tambalan JSON**: sebulan baris
kantor itu, berkunci `"tanggal|branch_id"`, berisi semua kolom angka ditambah
status tanda tangan. Layar menempelkannya ke barisnya. Memuat ulang halaman
berarti menghitung sebulan untuk 33 kantor — 2.403 ms dan 93 kueri — padahal
yang berubah satu kantor (§6).

Mengubah mutasi tanggal 5 menggeser kumulatif tanggal 6 ke atas. Karena
tambalannya sebulan, pergeseran itu **langsung terlihat** tanpa memuat ulang.

Gagal simpan: toast merah, lalu `router.reload({ only: ['hari'] })`, supaya
angka di layar tidak tertinggal lebih maju dari yang tersimpan.

### Yang dihitung sistem

- **Penyebut persen CM/MB = jumlah drop bulan rujukan, APA ADANYA**
  (keputusan mas 2026-11-24, mengganti aturan drop x 1,3 sebelumnya).
  CM memakai drop bulan **T−3**, MB memakai drop bulan **T−4**.
  Contoh mas: drop CM 10 juta dengan saldo CM 5 juta berarti 50%; sesudah ada
  yang membayar sehingga saldo tinggal 4 juta, jadi 40%. Penyebutnya tetap,
  pembilangnya berkurang tiap ada angsuran.

  Di basis data namanya tetap `saldo_lama_cm` / `saldo_lama_mb`, karena itu
  kolom yang dibekukan saat baris dicek.

  Pengali 1,3 **masih dipakai**, tapi hanya untuk sirkulasi
  (saldo awal + drop x 1,3 − storting), bukan untuk persen.

- **Sumber drop bulan rujukan: `transaction_loans`** (`status = 'success'`,
  `nominal_drop`), BUKAN `transaction_monthly_closings.drop` dan BUKAN tabel
  agregasi baru. Alasannya di §6. Angkanya tetap sebulan, jadi disimpan di
  `Cache::remember` berkunci wilayah + bulan rujukan. Diukur: satu wilayah
  (32 kantor) dua bulan = 0,9 detik.

- **% CM** = SALDO CM / jumlah drop bulan T−3.
- **% MB** = SALDO MB / jumlah drop bulan T−4.
- **% ML** = SALDO ML / SALDO (sirkulasi).
- Baris total wilayah = jumlah tiap kolom; % baris total dihitung dari jumlah
  pembilang / jumlah penyebut, **bukan** rata-rata persen kantor.

### Tanda selisih

**Satu jenis saja: angka tersimpan berbeda dari Rekap 2.** Sel diberi latar
merah (mas 2026-11-24; sebelumnya kuning), dan keterangannya (rupiah penuh) muncul saat kursor diarahkan. Tanpa
toleransi, beda Rp1 pun ditandai, dan **tidak menghalangi simpan** — angka
laporan kasir dicatat apa adanya supaya jejak salah lapor tidak hilang.

Pemeriksaan rantai kumulatif (kemarin + mutasi = hari ini) **dihapus**. Sejak
kumulatif dihitung dari mutasi sebulan, angkanya tidak mungkin bertengkar
dengan dirinya sendiri.

### Cara menghitung kumulatif

Dijumlah sejak tanggal 1, **bukan** dari baris kemarin. Alasannya: kalau hari
lalu dikoreksi, hari-hari sesudahnya harus ikut bergeser. Jadi tiap simpan
menghitung ulang sebulan untuk kantor itu.

**Yang dijumlah: angka yang diketik kalau ada, angka sistem kalau belum.**
Berlaku **per kolom**, bukan per tanggal. Dua hal yang dijaga aturan ini:

1. **Mengetik storting saja tidak boleh menolkan Jml Drop.** Barisnya cuma
   punya storting; kolom drop yang masih null memakai angka sistem hari itu.
   Lihat `.agents/uji/uji_hitung_ulang.php`.

2. **Koreksi menjalar ke bawah.** Tanggal 3 yang belum diisi tetap menyumbang
   angka sistemnya, jadi kumulatifnya dibangun di atas angka tanggal 2. Kalau
   tanggal 2 salah, Jml dan Saldo tanggal 3 ke bawah ikut selisih — dan itu
   memang yang mau dilihat staf kontrol (keputusan mas 2026-11-24).

   Contoh nyata, Kediri 1 November 2026: storting tanggal 2 dilaporkan
   25.455.000, sistem 25.456.000. Selisih Rp1.000 itu terbawa ke Jml Storting
   tanggal 3, 4, 5 dan seterusnya. Jml Drop tetap cocok dengan sistem, jadi
   tidak ditandai — yang merah hanya kolom yang benar-benar terpengaruh.

   Dijaga `.agents/uji/uji_kumulatif_bersambung.php`.

**Tanggal yang belum punya baris DIBUATKAN**, berisi kolom turunan saja;
kolom mutasinya dibiarkan null supaya selnya tetap tampil miring kelabu
alias "angka sistem, belum dilaporkan". Tanpa baris itu, kumulatifnya tidak
punya tempat disimpan dan tanggal itu jatuh ke kumulatif sistem apa adanya —
koreksi staf kontrol hilang di situ, lalu muncul lagi kalau tanggalnya diisi.

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

Kolomnya tidak ditampilkan di tabel harian, tapi tetap dikirim ke layar: dia
penyebut kolom % CM dan % MB.

### `regional_circulation_openings`

Saldo awal bulan yang **dilaporkan kantor**, satu baris per kantor per bulan —
bukan per hari tagih seperti rekap mantri (mas 2026-11-24). Mulai ditagih
**November 2026**; periode sebelum itu ditolak 422.

| Kolom | Catatan |
|---|---|
| id, branch_id, periode | periode = tanggal 1 bulan itu; unik (branch_id, periode) |
| wilayah | salinan, alasan sama dengan tabel harian |
| awal_sirkulasi, awal_cm, awal_mb, awal_ml | bigint, nullable |
| checked_by, checked_at | terisi = terkunci |
| timestamps | |

Kenapa tabel sendiri, bukan kolom di baris harian: angkanya tetap sepanjang
bulan. Menaruhnya di baris harian berarti mengulang angka yang sama 25 kali
dan harus memilih baris mana yang berlaku. Empat kolom `awal_*` di
`regional_circulation_recaps` jadi tidak terpakai; dibiarkan ada supaya tabel
lokal yang sudah berisi tidak perlu dibuang.

**Mengubahnya menggeser seluruh kumulatif bulan itu** — saldo awal titik
mulainya. `hitungUlangBulan()` membaca saldo awal dari sini dulu, baru jatuh
ke angka sistem kalau belum dilaporkan. Dijaga
`.agents/uji/uji_saldo_awal.php`: menaikkan saldo awal 1 juta menaikkan
sirkulasi akhir bulan tepat 1 juta.

Di layar: empat kolom saldo di panel **Sirkulasi Awal** bisa diketik, bedanya
dari angka sistem ditandai merah, aturan yang sama dengan tabel harian.

**Cek & Buka** di kolom paling kanan panel. Tidak berantai: saldo awal cuma
satu per bulan, tidak ada urutan yang bisa dilewati. Baris yang belum pernah
diketik dibuatkan dari angka sistem saat dicek. Buka wajib beralasan minimal
5 huruf.

Jebakan yang sempat kena: angka sistemnya **tidak boleh** diambil dengan
`untukWilayah($wilayah, $periode)`. Tanggal 1 bisa jatuh di hari libur —
1 November 2026 hari Minggu — dan tanggal bukan hari kerja tidak ada di
hasilnya, jadi saldo awalnya terisi nol. Pakai `untukBulan()` lalu ambil
tanggal pertama yang ada. Dijaga `.agents/uji/uji_cek_saldo_awal.php`.

Belum ada: log perubahan saldo awal. `regional_circulation_recap_logs`
menunjuk ke baris harian lewat `regional_circulation_recap_id`, jadi tidak
bisa dipakai apa adanya. Yang tercatat baru `checked_by` & `checked_at`.

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

- **Simpan**: autosave per sel (§2). Tiap kolom yang berubah satu log `ubah`.
  Satu permintaan boleh memuat beberapa tanggal sekaligus
  (`baris.*.tanggal`), jadi halaman sebulan tetap bisa dilayani satu endpoint.
- **Tidak ada pengisian massal.** Tombol "Isi dari Rekap 2" sempat ada lalu
  dicabut (mas 2026-11-24): staf kontrol mengecek satu per satu, dan kalau
  angkanya memang sudah sama dengan rekap, tombol **Cek** yang membuat
  barisnya dari angka sistem. Mengisi sebulan sekaligus juga menghapus
  pembeda antara "kasir melapor sama dengan sistem" dan "belum ada laporan".

- **Cek**: per baris kantor, tombol di kolom paling kanan — itu tanda tangan
  staf kontrol. Mengisi `checked_by`, `checked_at`, `saldo_lama_*`; log `cek`.
  Baris terkunci: isiannya mati dan server menolak ubah.

  **Berantai**, seperti kunci kasir di Rekap 1: hari kerja sebelumnya di kantor
  yang sama harus sudah dicek lebih dulu, kalau tidak Cek ditolak 422 dengan
  menyebut tanggal yang tertinggal. Patokan mulainya **1 November 2026**
  (`RekapWilayahController::MULAI`), bukan awal data.

  Baris yang belum pernah diketik tetap boleh dicek: angkanya diambil dari
  Rekap 2 dan nol memang nol (aturan mas 2026-11-23). Barisnya dibuat saat Cek
  supaya yang ditandatangani tersimpan.
- **Buka**: wajib alasan minimal 5 huruf. Mengosongkan `checked_by`/`checked_at`;
  log `buka`. Sesudahnya kumulatif kantor itu dihitung ulang — barisnya tadi
  dilewati karena terkunci.
- **Cek dan Buka juga membalas tambalan JSON**, sama dengan autosave, jadi
  baris, hitungan "x/33 dicek", dan warna tombol tanggal berubah tanpa memuat
  ulang halaman.
- Halaman wilayah **selesai** bila semua baris kantor sudah dicek. Tidak ada
  tombol tambahan.

### Penanda TTD kasir & ACC KM

Dua kolom di kanan tiap baris, permintaan mas 2026-11-23: berapa kelompok dari
seluruh kelompok kantor itu yang sudah di-TTD kasir (`kasir_lock_at`) dan
di-ACC kepala mantri (`kepala_approval_at`), ditulis `n/m`. Hijau kalau lengkap,
kuning kalau sebagian, kelabu kalau belum ada. Tujuannya staf kontrol tahu
angka kantor itu sudah beku atau masih bisa bergerak sebelum menandatangani.
- **Sementara ini menunya superuser saja** (permintaan mas 2026-11-24).
  `PERAN_UBAH` dan `PERAN_LIHAT` dua-duanya `['superuser']`, dan butirnya di
  sidebar hanya muncul untuk superuser.

  Rancangannya tidak berubah dan kodenya sudah siap: yang boleh simpan/Cek/Buka
  **stafkontrol** (hanya wilayahnya, lewat `Branch::getAllowedBranchIds`) dan
  **superuser**, ditambah **pusat** yang hanya melihat. Membukanya nanti cukup
  mengembalikan isi dua konstanta itu dan syarat di sidebar.
- Pemeriksaan wilayah di server memakai `AuthScope`; pelanggaran →
  `AppHelper::PESAN_BUKAN_WILAYAH`.
- Riwayat log per baris bisa dibuka dari baris itu (drawer).

### Nama kantor membuka Rekap 2

**Nama kantor diklik** membuka **halaman Rekap 2 yang asli** untuk kantor itu,
di dalam **Sheet** shadcn yang menggeser dari kanan (bukan modal di tengah,
permintaan mas 2026-11-24 — sama dengan drawer buku di Rekap 1), lewat
`<iframe ?polos=1>`.

`?polos=1` adalah mode tanpa rangka di `AuthenticatedLayout`: sidebar dan
navbar tidak dirender. Dipakai halaman yang ditumpangkan di iframe, supaya
yang terlihat isinya saja, bukan aplikasi di dalam aplikasi.

**Bukan tiruan.** Sempat dibuat tabel sendiri — per kelompok, sebulan, lengkap
dengan kumulatif dan saldo — lalu dicabut 2026-11-24 ("susah klo gini").
Alasannya bukan cuma selera: dua tempat yang menghitung hal yang sama adalah
persis bahaya yang dijaga proyek ini, dan tiruannya perlu uji tersendiri hanya
untuk membuktikan dia masih sama dengan aslinya.

Caranya: Rekap 2 mengambil cabangnya dari paket filter global di session
(`AuthScope`), bukan dari parameter. Jadi rutenya mengganti cabang aktif,
memanggil `TransactionDailyRecapController::rekap_dua()`, lalu
**mengembalikan cabang semula** di blok `finally`. Melihat kantor lain tidak
memindahkan cabang aktif pengguna.

Aman karena `getDataRekapDua()` menghitung datanya saat itu juga, bukan nanti
waktu respons dirender. Diukur: 342 ms, dan cabang aktif kembali seperti
semula.

Di kepala drawer ada tautan "buka di tab baru" tanpa `polos`. Yang itu
**memang** memindahkan cabang aktif, karena halamannya berdiri sendiri.

## 5. Ekspor

Dua tombol di baris filter. Belum ada: snapshot PNG untuk WA (`html-to-image`),
ditunda mas ke paling akhir.

### Cetak / PDF

`window.print()` + CSS `@media print`, tanpa library PDF. Aturan cetaknya
**global**, di `resources/css/app.css`, karena menu laporan lain akan butuh
yang sama:

- A4 **landscape**, margin 8mm.
- Yang disembunyikan: sidebar shadcn (`div[data-variant='sidebar']`), navbar
  (`header`), toast sonner, dan apa pun berkelas **`.tanpa-cetak`**.
- `thead` jadi `table-header-group`, jadi kop tabel berulang di tiap halaman;
  `break-inside: avoid` pada baris.
- `print-color-adjust: exact`, supaya sel merah penanda selisih dan baris
  total tetap tercetak.

Yang khusus halaman ini:

- Baris filter dan tombol **Cek**/**buka** diberi `.tanpa-cetak`.
- Tiap blok tanggal mulai di halaman baru (`print:break-before-page`), kecuali
  yang pertama.
- **Kotak isian tidak ikut tercetak.** Isinya diketik dalam ribuan, jadi di
  kertas akan terbaca 1.000x lebih kecil. Yang dicetak span `hidden print:block`
  berisi angka penuh; kotaknya `print:hidden`.
- Panel accordion dibuka lewat `beforeprint`: `<details>` yang tertutup tidak
  dirender, jadi kalau tidak dibuka isinya hilang dari kertas.

### Excel .xlsx

`exceljs@4.4.0`, diimpor **dinamis** (900 KB, dan yang mengekspor cuma staf
kontrol sekali sebulan). Satu berkas `rekap-wilayah-{wilayah}-{bulan}.xlsx`,
dua lembar:

| Lembar | Isi |
|---|---|
| Harian | satu baris per kantor per tanggal + baris total tiap tanggal |
| Sirkulasi Awal | kolom panel accordion, satu baris per kantor |

Lembar **Harian** memakai kepala bertingkat yang sama dengan layar (baris blok
dengan sel gabung, lalu judul kolom), tapi kepalanya ditulis **sekali di atas**
dan tanggalnya jadi kolom pertama — bukan diulang 25 kali. Jadi isinya masih
bisa disaring (`autoFilter`) dan dipivot, sementara susunan kolomnya tetap
seperti Excel mas.

Aturan angka:

- Angka ditulis sebagai **angka** dengan `numFmt '#,##0'`, bukan teks, jadi
  masih bisa dijumlah di Excel.
- Persen ditulis sebagai **pecahan** (0,4) dengan format `0.00%`. Kalau ditulis
  40, Excel menampilkannya 4000%.
- `null` jadi **sel kosong**, bukan 0: nol dan "belum diisi" beda artinya.
- Persen baris total dari jumlah pembilang / jumlah penyebut, sama dengan layar.

Yang diekspor adalah angka **sesudah autosave**, bukan angka saat halaman
dibuka: baris digabung dengan tambalan lewat `gabung()` di `kolom.js`, fungsi
yang sama dengan yang dipakai layar.


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

Penjelasan lengkapnya pindah ke `.agents/kapan_angka_boleh_dipercaya.md` —
berlaku untuk semua layar angka, bukan menu ini saja. Ringkasnya:

`transaction_daily_closings.drop` dan `.storting` **terisi, tetapi hanya pada
baris yang sudah dikunci kasir** — trigger yang membekukannya saat kunci.
Dicek November 2026: 29.067 baris, 16.358 terkunci, drop pada baris terkunci
64.317.450.000 dari 65.145.150.000 sebulan. Baris yang belum dikunci masih 0,
itu sebabnya pemeriksaan satu tanggal yang belum terkunci tampak nol semua.

Jadi ikuti Rekap 2 apa adanya: hari yang sudah dikunci dibaca dari closing,
hari yang belum dihitung langsung lewat `HitungAgregat::harianBanyak`.
Batas "mulai hitung langsung" ditentukan **per kantor**, bukan per wilayah —
lihat §6 bagian risiko.

### Kinerja: yang mahal dan jalan murahnya

Diukur 2026-11-24, wilayah 1, November 2026.

| Jalur | Waktu | Kueri |
|---|---|---|
| `untukBulan($wilayah, $t)` — 33 kantor sebulan | 2.403 ms | 93 |
| `untukBulan($wilayah, $t, $branchId)` — satu kantor | 60 ms | 24 |

Halaman sebulan: server 6,6 detik dingin / 2,5 detik hangat, 121 kueri, 40 MB
puncak, JSON 416 KB, 825 baris dan 4.125 kotak isian di layar.

Tiga hal yang membuat autosave tidak memberatkan:

1. **`untukBulan()` menerima `$branchId`** untuk menyempitkan ke satu kantor.
   Dipakai tombol Cek dan `barisDariSistem()`. Drop bulan rujukan tetap
   dihitung per wilayah karena sudah ditembolok 6 jam dan dipakai bersama
   halamannya.

   Jalur sempit bisa punya daftar tanggal **lebih pendek** daripada jalur penuh:
   tanggal libur yang isinya cuma ada di kantor lain tidak muncul. Aman untuk
   Cek karena Cek hanya jalan di hari kerja, tapi jangan dipakai untuk
   membandingkan "tanggal pertama" dua jalur.

2. **`hitungUlangBulan()` memakai jalur sempit yang sama**, bukan sebulan
   untuk 33 kantor.

3. **Tabel tanggal baru dipasang saat bloknya mendekati layar.** Satu wilayah
   sebulan itu 25 tanggal x 32 kantor = 800 baris, 16.800 sel, dan 4.000
   `<input>` — kira-kira **39.000 simpul DOM**. Chrome tersendat jauh di bawah
   itu: mengetik tertunda dan gulir meninggalkan bidang kosong. Yang terpasang
   sekarang cuma blok di sekitar layar, sekitar 100 baris; sisanya kotak
   setinggi taksiran supaya posisi gulir tidak melompat.

   Pengamatnya milik tiap blok dan state-nya lokal, jadi menggulir hanya
   merender ulang blok yang masuk atau keluar — bukan halaman.

   Dua hal yang ikut dari situ: `beforeprint` memasang semua blok, kalau tidak
   yang belum dipasang tercetak sebagai kotak kosong; dan tombol tanggal
   menggulir dua kali, karena tinggi tabel sebenarnya beda dari taksiran.

   `backdrop-blur` di baris filter dibuang: satu lapis blur yang digambar ulang
   tiap bingkai gulir, di atas halaman sepanjang ini.

4. **Satu tanggal dirender ulang, bukan sebulan.** Tiap tanggal jadi `BlokHari`
   yang dibungkus `memo`. Syaratnya acuan prop harus tetap: tanggal tanpa
   tambalan menerima objek beku `TANPA_TAMBALAN` yang sama, semua callback
   dibungkus `useCallback` dengan tanggal dikirim sebagai argumen (bukan ditutup
   di closure), dan kotak isian mengirim nilainya saat blur, bukan tiap ketukan.
   Mengetik di 5 November merender ulang 33 baris, bukan 825.

Angka jalur murah diuji ulang dengan `.agents/uji/uji_kantor_sempit.php`
(1.372 kolom, 0 beda terhadap jalur penuh).

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

## Pengujian

Tidak lewat phpunit — `php artisan test` menghantam `ubmi_db` produksi.
Sepuluh skrip yang bisa dijalankan ulang; yang menyentuh basis data berjalan
di dalam transaksi yang DIBATALKAN, jadi tidak meninggalkan data.

```bash
# rumus murni (persen, sirkulasi, bulan rujukan), tanpa DB
docker exec -u www-data -e HOME=/tmp unit-app php -d zend.assertions=1 .agents/uji/uji_rekap_wilayah.php

# kolom & turunan di sisi layar, node biasa
docker exec unit-vite node .agents/uji/uji_kolom_rekap_wilayah.mjs

# lembar .xlsx: kepala bertingkat, angka tetap angka, persen pecahan
docker exec unit-vite node .agents/uji/uji_ekspor_rekap_wilayah.mjs

# angka halaman harus sama dengan Rekap 2
docker exec -u www-data -e HOME=/tmp unit-app php artisan tinker .agents/uji/banding_rekap_wilayah.php

# untukBulan satu kantor harus sama dengan jalur penuh
docker exec -u www-data -e HOME=/tmp unit-app php artisan tinker .agents/uji/uji_kantor_sempit.php

# mengetik satu kolom tidak boleh menolkan kolom lain
docker exec -u www-data -e HOME=/tmp unit-app php artisan tinker .agents/uji/uji_hitung_ulang.php

# kumulatif meneruskan laporan, tidak dicampur angka sistem
docker exec -u www-data -e HOME=/tmp unit-app php artisan tinker .agents/uji/uji_kumulatif_bersambung.php

# saldo awal yang dilaporkan menggeser kumulatif sebulan
docker exec -u www-data -e HOME=/tmp unit-app php artisan tinker .agents/uji/uji_saldo_awal.php

# cek saldo awal: diisi dari sistem, terkunci, tolak ubah, buka wajib alasan
docker exec -u www-data -e HOME=/tmp unit-app php artisan tinker .agents/uji/uji_cek_saldo_awal.php

# cek harus urut, tidak boleh lompat tanggal, dan rantainya per kantor
docker exec -u www-data -e HOME=/tmp unit-app php artisan tinker .agents/uji/uji_rantai_cek.php
```

Hasil terakhir: banding 1.652 kolom 0 beda, jalur sempit 1.176 kolom 0 beda.

`banding_rekap_wilayah.php` memperingatkan kalau kolom hariannya nol semua —
salinan lokal berhenti 2026-11-16, jadi tanggal sesudah itu membandingkan nol
dengan nol dan tidak membuktikan apa pun.

**artisan di container jangan sebagai root.** `storage` jadi milik root dan
php-fpm galat `Permission denied`. Selalu `-u www-data -e HOME=/tmp`; tanpa
`HOME` psysh menolak menulis `/var/www/.config/psysh`.

## Di luar lingkup

- Kasir mengisi sendiri di aplikasi (sumber tetap WA → staf kontrol).
- Notifikasi/pengingat ke kasir.
- Rekap lintas wilayah (level pusat).
