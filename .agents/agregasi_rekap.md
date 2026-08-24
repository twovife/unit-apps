# Rombak Alur Rekap & Agregasi — Rancangan v2

> **STATUS: RANCANGAN — BELUM ADA KODE YANG DITULIS.**
> Versi 2, hasil brainstorming 2026-08-12 (menggantikan versi 2026-08-05).
> Tidak ada satu pun tabel/kolom baru di dokumen ini yang sudah ada di database.
> Untuk peta aplikasi yang **berjalan**, baca `.agents/skills/peta-aplikasi/references/`.
>
> ⚠️ Versi ini **membatalkan tiga klaim** dari versi 2026-08-05. Lihat §10 sebelum
> mengambil keputusan apa pun yang bersandar pada dokumen lama.

**Target cutover kantor percontohan: 1 Oktober 2026** (1–2 kantor).

---

## 1. Diagnosis tunggal

Semua kerusakan yang ditemukan — di lima tempat berbeda, oleh orang berbeda, selama
bertahun-tahun — lahir dari **satu pola yang sama**:

> **Ada dua angka yang harus cocok, tapi yang satu boleh disetel mengikuti yang lain
> sampai cocok. Jadi tidak ada yang pernah salah, dan tidak ada yang pernah ketahuan.**

| Gejala | Angka yang disetel | Mengikuti |
|---|---|---|
| 8.703 rekap harian 2026 sudah di-approve kepala tapi `storting`-nya tidak cocok dengan sumbernya | `storting` | uang fisik di laci kasir |
| **4.141 rantai target patah** (dari 133.068 pasangan yang diuji) | `target` ketikan user | menimpa hasil rumus |
| Ember ML melenceng dua arah (186 pasangan kelebihan Rp 6,19 M; 48 pasangan nol padahal ada orangnya) | `ml_amount` manual | tidak pernah dijodohkan dengan data |
| Nasabah lama dimasukkan lewat **drop palsu** | `drop` dikarang | agar sirkulasi bisa naik |

**Obatnya satu, dipakai berulang di seluruh rancangan ini:**

> Kalau dua angka harus cocok, keduanya wajib **tiba secara mandiri, lalu dibandingkan**.
> Bukan yang satu diturunkan dari yang lain. Selisihnya disimpan dan ditampilkan sebagai alarm.

Pola ini dipakai di empat tempat:

| Dihitung sistem | Diisi manusia | Selisihnya berarti |
|---|---|---|
| `tunai` (generated) | `setoran_mantri` | salah tulis / uang kurang setor |
| `target_hitung` | `target` ketikan KM | rantai target hanyut |
| `keluar_hitung` | `keluar` ketikan KM | kriteria keluar-target tidak dijalankan |
| `akhir(M)` dari portofolio | `awal(M+1)` dari portofolio | ember melompat / data tidak wajar |

Kalau salah satu sisi boleh menyetel sisi lain, alarmnya mati dan kita kembali ke keadaan sekarang.

---

## 2. Arsitektur tiga lapis

```
LAPIS 1 — SUMBER (fakta, bertanggal jujur)
  transaction_loans, transaction_loan_instalments
  → TIDAK ADA KOLOM BARU. Bentuknya tidak disentuh sama sekali.
  → INI yang dikunci. Kunci di sumbernya, bukan di angka hasilnya.

LAPIS 2 — AGREGAT (satu baris = satu kelompok, satu hari)
  turunan : drop, storting, 6 ember, do11, titipan9, tunai
            → generated / hitung ulang. Mustahil melenceng.
  manual  : kasbon, transport, keluar, setoran_mantri
            → sumber kebenaran sendiri, TIDAK diturunkan dari mana pun
            → karena itu WAJIB ikut dikunci (lihat §4)
  alarm   : selisih = setoran_mantri − tunai   (generated)

LAPIS 3 — BACA (rekap, dashboard)
  sirkulasi & target = jangkar + Σ arus
  → tidak menyimpan angka berantai, jadi koreksi masa lalu
    mengalir ke bawah GRATIS tanpa menulis ulang apa pun
```

**Kenapa kunci ada di lapis 1**: kalau sumber beku, semua turunan lapis 2 & 3 ikut beku
dengan sendirinya — tanpa perlu membekukan satu pun angka hasil hitungan.

**Tapi kolom manual lapis 2 tidak diturunkan dari lapis 1**, jadi mengunci sumber saja
**tidak cukup**. `kasbon` dan `transport` masuk ke rumus `tunai`; kalau keduanya masih
bisa diubah setelah kunci, tunai tetap bisa bergeser lewat pintu belakang meski angsuran
sudah ditolak.

---

## 3. Topik 1 — Kas harian & setoran mantri

### 3.1 Kenapa `tunai` tidak bisa "dibekukan"

`tunai` di `transaction_daily_recaps` adalah **VIRTUAL GENERATED column** — dihitung MySQL
saat dibaca, tidak pernah disimpan, tidak bisa ditulis:

```
sharingdo = `drop` * 0.11                        VIRTUAL GENERATED
titipan   = `drop` * 0.09                        VIRTUAL GENERATED
debt      = sharingdo + kasbon + storting        VIRTUAL GENERATED
kred      = `drop` + transport                   VIRTUAL GENERATED
tunai     = debt - kred                          VIRTUAL GENERATED
masuk     = `drop` * 0.13                        VIRTUAL GENERATED
```

Akibatnya hari ini: begitu `storting` berubah karena koreksi, **`tunai` hari itu ikut
berubah sendiri, diam-diam, surut, tanpa jejak.** Tanda tangan kasir tidak mengunci apa pun,
karena yang diteken itu bayangan dari angka lain.

**Keputusan: `tunai` TETAP generated column.** Menggantinya dengan kolom tersimpan justru
melahirkan penyakit yang sedang kita obati — kolom tersimpan bisa melenceng dari inputnya,
persis seperti 8.703 storting-mismatch itu. Yang membekukan tunai adalah **kunci di
inputnya**, bukan pembekuan tunai itu sendiri.

> Untuk tabel baru, pakai **`STORED`**, bukan `VIRTUAL`. Sifat "tidak bisa ditulis manual,
> selalu konsisten dengan input" tetap sama persis, tapi hasilnya sudah jadi saat dibaca —
> penting untuk dashboard yang menjumlah ribuan baris. Polanya sudah ada di sistem ini
> (`transaction_loans.pinjaman` sudah `STORED`).

### 3.2 Yang hilang saat pindah dari buku ke aplikasi

Di buku, kasir punya **dua angka berdampingan**: tunai hasil rumus, dan tunai hasil
menghitung uang. Uang fisik jadi **wasit** — kalau buku storting bilang 1,2 jt tapi kas
bilang 1 jt, yang diikuti adalah kas, lalu orang berburu salah tulisnya.

Waktu didigitalkan, **angka fisiknya tidak ikut dibawa**. `grep` seluruh aplikasi: tidak ada
satu pun field untuk uang fisik maupun selisih. Yang tersisa cuma sisi rumus — jadi wasitnya
hilang, alarmnya hilang, dan tunai patuh saja mengikuti storting yang salah.

Itu juga menjelaskan keluhan "tunai harus diubah setelah dibekukan": kasir sebenarnya tidak
mengubah tunai, dia **memaksa salah satu input** (biasanya storting) supaya tunai hasil rumus
cocok dengan uang di tangannya. Selisihnya terserap diam-diam ke storting.

### 3.3 Yang ditambahkan

| Kolom | Sifat | Aturan |
|---|---|---|
| `setoran_mantri` | **input kasir**, uang fisik yang diterima | satu kali sehari, boleh diedit **selama belum kunci**. `NULL` = belum dicatat, `0` = memang tidak menyetor — **wajib dibedakan** |
| `selisih` | `STORED GENERATED AS (setoran_mantri − tunai)` | jadi alarm; mustahil disetel manual |

Chaining generated column sudah terbukti jalan di tabel ini (`sharingdo`→`debt`→`tunai`),
jadi tidak ada yang baru secara teknis.

### 3.4 Alur setoran (dari praktik nyata)

```
1. Mantri pulang menagih
2. KASIR menghitung dengan KALKULATOR  → perkiraan tunai sementara
3. Mantri menyerahkan uang fisik       → setoran_mantri
4. Mantri melengkapi/mengecek pendataannya
5. Cek ke kepala mantri, lalu ke kasir → nilai tunai yang sebenarnya
6. selisih terekam untuk monitoring
7. Plus/minus diselesaikan DI LUAR alur ini (kasbon bulanan / uang pribadi)
```

### 3.5 ⛔ Kalkulator kasir HARAM menyentuh drop & storting

Kalkulator boleh membaca **`kasbon` dan `transport` saja** (dua-duanya sudah pasti di awal
hari, bukan hasil kerja mantri). **Tidak boleh membaca `drop` atau `storting`. Selamanya.**

Ini bukan pembatasan teknis, ini **inti solusinya**:

1. Saat mantri pulang, pendataannya **belum selesai** — agregasi masih kosong. Kalkulator
   yang membaca data akan bilang "setor 0", tidak berguna.
2. Lebih berbahaya: kalau angka setoran ditarik dari data, lalu data itu belakangan diisi
   mantri sendiri — mantri tinggal **menyesuaikan pendataannya supaya cocok dengan uang yang
   sudah dia setor**. Selisih akan selalu nol, dan kontrolnya jadi teater.

> **Selisih hanya bermakna kalau kedua angkanya tiba secara mandiri.**
> Siapa pun yang di masa depan tergoda "mengoptimalkan" dengan mengisi kalkulator otomatis
> dari data: itu membatalkan seluruh gunanya.

Kalkulator disimpan di **tabel jejak terpisah**, bukan kolom di baris agregasi — dia artefak
*sebelum* data ada, bisa dijalankan berkali-kali, dan menaruhnya di baris agregasi
mengaburkan aturan "satu baris = kebenaran satu hari".

### 3.6 Log wajib merekam nilai tunai sebelum & sesudah

**Generated column tidak punya ingatan.** Begitu superuser membuka kunci dan `storting`
diubah, **angka tunai yang dulu diteken kasir hilang permanen** — bukan tertimpa, memang
tidak pernah tersimpan di mana pun.

Jadi log tidak cukup mencatat "storting diubah user X jam sekian". Log **wajib merekam nilai
tunai sebelum & sesudah**, karena tunai tidak bisa direkonstruksi ulang dari data setelahnya.

Log dipicu **hanya untuk baris yang sudah pernah terkunci** — di luar itu tidak perlu, dan
volumenya jadi kecil (koreksi pasca-kunci seharusnya jarang).

---

## 4. Topik 2 — Kunci, tanda tangan, rekalkulasi

### 4.1 Yang beku begitu kasir mengunci

```
LAPIS 1 (sumber):
  ❌ angsuran bertanggal itu tidak bisa dibuat / diubah / dihapus
  ❌ status pinjaman yang mengubah drop tanggal itu tidak bisa diubah
  ❌ pinjaman ber-drop_date tanggal itu tidak bisa dihapus

LAPIS 2 (kolom manual — TIDAK diturunkan dari lapis 1, jadi harus dikunci terpisah):
  ❌ kasbon, transport, keluar, setoran_mantri
```

Kalau `setoran_mantri` tidak ikut beku, orang bisa menyetelnya belakangan supaya selisih jadi
nol — celah yang persis sama dengan yang kita tutup di §3.5.

### 4.2 Penegakan: trigger DB, bukan hanya hook model

Hook model Eloquent **bocor** di tiga jalur yang sudah biasa dipakai di proyek ini:
`Model::where(...)->update()` (mass update tidak memicu event sama sekali), raw SQL /
`DB::statement()`, dan `php artisan tinker`.

**Trigger DB** (`BEFORE UPDATE`/`BEFORE DELETE` + `SIGNAL SQLSTATE '45000'`) jalan di level
engine, jadi mencakup **semua** jalur tulis lewat koneksi DB — Eloquent, mass update, raw
query, tinker. Isinya cukup membaca `kasir_lock_at` pada baris closing yang berkaitan.

**Plafon jujurnya**: trigger tidak bisa membedakan siapa manusianya — koneksi DB `unit-app`
itu satu user yang dipakai semua request. Orang yang lebih dulu `UPDATE kasir_lock_at = NULL`
lewat tinker lalu mengedit lalu mengunci lagi **tidak** akan tertangkap, karena secara state
kolom memang "sedang terbuka". Menutup itu butuh privilege separation di level DB user —
jauh lebih berat, biasanya hanya untuk tuntutan audit formal. Untuk tujuan "cegah kesalahan
manusia dan bug kode", trigger di `kasir_lock_at` sudah proporsional.

### 4.3 Syarat mengunci

```
✓ kepala sudah approve
✓ setoran_mantri sudah terisi (NULL = belum, 0 = sah kalau memang tidak beroperasi)
✓ baris closing SEBELUMNYA yang ADA sudah terkunci
  ATAU ini hari pertama sejak branches.mulai_pendataan_baru
```

**BUKAN** kas seimbang. Selisih fisik dibebankan ke penagih lewat pembukuan terpisah; kalau
kas seimbang jadi syarat, rantai penguncian jadi sandera masalah yang penyelesaiannya ada di
buku lain.

Rantai dibaca **"baris sebelumnya yang ADA"**, bukan "tanggal kemarin persis" — karena tidak
setiap tanggal kalender punya baris.

Efek sampingnya bagus: hari yang setoran atau pendataannya bolong **otomatis menahan rantai**,
jadi ketahuan besoknya, bukan berbulan-bulan kemudian. Ini akan terasa mengganggu di
minggu-minggu pertama karena membongkar berapa banyak hari yang selama ini menggantung tanpa
ketahuan — itu memang tujuannya.

### 4.4 Masalah nyata: tombol tutup buku merangkap dua tugas

Sekarang tombol tutup buku **menghitung** agregat bulanan **dan** mengunci sekaligus. Kalau
lupa ditekan, bukan cuma "belum terkunci" — angkanya **tidak pernah lahir**, bucket kosong,
dan bulan depan mulai dari nol. Kasir sering baru memeriksa di tanggal 3 bulan berikutnya.

**Pisahkan dua tugas itu:**

| | Sekarang | Rancangan |
|---|---|---|
| Menghitung agregat bulanan | hanya saat tombol ditekan | **selalu bisa dihitung**, tidak menunggu siapa pun |
| Mengunci / tanda tangan | tombol yang sama | tombol terpisah, tugasnya cuma mengesahkan |

Saldo awal dibaca sebagai:

```
awal(bulan M) = jangkar terakhir yang ADA + Σ arus sejak jangkar itu
```

Bukan `awal(M) = akhir(M−1)`. Kalau bulan M−1 belum ditutup, rumus lama macet; rumus ini
mundur satu langkah ke jangkar yang ada dan tetap menghasilkan angka benar. **Jangkar yang
hilang cuma bikin hitungannya lebih panjang, tidak pernah bikin salah.**

### 4.5 ⚠️ Pemicu tanda tangan harian: HITUNG ULANG, bukan TAMBAH

Agregat bulanan diperbarui saat **tanda tangan harian**. Tapi satu kata menentukan hidup-matinya:

| Aksi | Akibat |
|---|---|
| `bulanan += angka harian` | ⚠️ jadi saldo berjalan tersimpan — **bisa hanyut** |
| `bulanan = SUM(semua harian bulan itu)` | ✓ idempoten, **mustahil hanyut** |

Yang pertama **persis** mekanisme yang membuat 4.141 rantai target patah: penambahan bertahap
lewat hook, sekali terlewat atau dobel, tidak ada yang tahu selamanya.

Yang kedua tidak lebih mahal — menghitung ulang satu baris bulanan = menjumlahkan ±25 baris
harian untuk satu kelompok. Dijalankan sekali atau sepuluh kali hasilnya sama, jadi **koreksi
hari lampau otomatis membetulkan bulanannya sendiri** tanpa perlu ada yang menekan tombol.

**Dua aturan pelengkap:**

1. **Kelengkapan, bukan penyaringan.** Baris bulanan menjumlahkan **semua** hari, bukan hanya
   yang terkunci — plus penanda `24/25 hari terkunci`. Kalau disaring, satu hari yang terlewat
   hilang diam-diam dan kita kembali ke masalah awal.
2. **Tanda tangan bulanan disyaratkan `25/25`.** Ini yang membuat "lupa tutup buku" mustahil
   lolos — bukan karena ada yang mengingatkan, tapi karena pengesahannya tidak bisa jalan.

### 4.6 Rekalkulasi saat hari lampau dikoreksi

```
sumber tanggal D berubah
   ↓ hitung ulang baris harian (G, D)
   ↓ hitung ulang baris bulanan (G, hari-D, bulan-D)
   ↓ akhir bulan itu berubah → awal bulan berikutnya berubah
   ↓ ... sampai bulan berjalan
```

Ukurannya kecil: koreksi 6 bulan ke belakang = 6 baris bulanan per hari tagih; sekelompok
penuh (6 hari) = 36 baris. Aman dihitung langsung, tidak perlu antrian.

**Dua syarat wajib:**

1. **Pemicunya perubahan sumber, bukan aksi kunci.** Kalau hanya dipicu tombol kunci, edit di
   hari yang kebetulan belum terkunci tidak merambat — dan bulanannya diam-diam basi.
2. **Berhenti kalau ada yang terkunci di jalur rambatan.** Sistem **menyebutkan dulu** baris
   bulanan mana saja yang akan ikut terbuka, lalu menolak sampai dibuka resmi. Bukan menembus
   kunci demi konsistensi — itu membatalkan arti kunci.

Baris bulanan adalah **hasil hitung, bukan catatan** — menghitungnya ulang bukan menulis ulang
sejarah.

### 4.7 Unlock

**Yang berhak**: role `stafkontrol` / `pusat` / `superuser` **DAN** sedang dipegangi permission
`can-edit` (pola bongkar-pasang yang sudah ada di sistem — dipasang superuser saat perlu,
dicabut lagi). Role saja tidak cukup: `pusat` ada 30 orang.

`tunai` **tidak bisa diedit langsung** (generated). Yang diedit selalu inputnya. Ini justru
bagus — memaksa koreksi menunjuk ke penyebab, bukan menutup gejala.

---

## 5. Topik 3–5 — Target & keluar-target

### 5.1 Keadaan sekarang (terverifikasi, bukan dugaan)

Target **sudah terimplementasi penuh** — versi 2026-08-05 salah menganggapnya tidak ada.

```php
// TransactionDailyRecap.php:62 — di dalam hook static::updating
'target' => $recap->target + ($recap->drop * 0.13) - $recap->keluar
```

Jangkarnya kolom `target_on` (menunjuk balik ke tanggal sumber = minggu lalu, per hari tagih).
Di 2026: 133.056 baris ber-`target_on`, `keluar` terisi di 100.523 baris. Hidup dan dipakai.

**Dua penyakit di dalamnya:**

**(a) Dua sumber kebenaran berebut.** Di `TransactionDailyRecapController@ceklist_kepala`:

```
1. update(['keluar'=>…, 'drop'=>…])   → memicu hook yang MENGHITUNG target minggu depan
2. update(['target' => $request->target_minggu_depan])  → MENIMPANYA dengan ketikan user
```

Di alur normal yang manual menang; kalau `drop`/`keluar` diubah dari tempat lain, yang
otomatis menang. Tidak pernah dijodohkan.

**(b) Cascade rekursif diam-diam.** `$transactionAfter->increment('target', $delta)`
(`TransactionDailyRecap.php:79`) memicu event `updating` baris itu → blok `isDirty('target')`
jalan → increment baris berikutnya → seterusnya tanpa batas, semua di dalam satu DB transaction.

**Hasilnya**, diuji atas seluruh pasangan berantai 2026:

```
133.068 pasangan diuji → 128.927 cocok, 4.141 MELESET (3,1%)
```

### 5.2 Keputusan: target tetap manual sekarang

Aturan keluar-topup **sendiri belum seragam** — sebagian nasabah keluar target saat topup
*sukses*, sebagian sudah keluar sejak *pengajuan*. Data lama juga tidak punya penanda mana
nasabah hasil topup. Menurunkan target otomatis sekarang cuma memindahkan tebakan ke dalam kode.

**Jadi**: tetap plaintext + rantai + input KM, dengan **default otomatis yang masuk saat
kunci** kalau KM tidak mengisi. Tidak ada baris yang tertinggal tanpa target.

### 5.3 Dua hal yang dipasang SEKARANG supaya recount nanti murah

**(a) Kolom `target_source`** — `rantai` / `recount` / `manual`. Tanpa ini, saat recount hidup
nanti tidak ada cara membedakan target yang sudah bersumber valid dari warisan rantai, dan
recount tidak bisa dievaluasi. Menambah kolom sekarang gratis; menambahkannya nanti berarti
seluruh baris lama tidak punya nilai.

**(b) Laporan bayangan, read-only** — `target_rantai` vs `target_hitung` berdampingan, tidak
menulis apa pun. Gunanya memberi **ukuran** kapan recount layak dinyalakan: kalau selisihnya
menyempit tiap bulan, datanya membaik; kalau tidak, ada masalah lain yang harus dibereskan dulu.

### 5.4 Rumus target langsung (untuk laporan bayangan & recount)

Hitung target **dari isinya**, bukan dari saldo berjalan:

```
target_hitung(kelompok, hari, tanggal) =
  Σ (nominal_drop × 0,13)
  atas semua pinjaman di kelompok+hari itu yang:
    status 'success', belum lunas, bukan pemutihan,
    ember ∈ {month1, month2, ccm, cm},     ← MB & ML memang BUKAN target
    tidak sedang punya topup ber-ACC
```

Kelebihannya: **tidak mewarisi kesalahan.** Salah minggu lalu tidak menular ke minggu ini,
karena tidak dihitung dari minggu lalu.

### 5.5 Tombol recount — pola stok opname

Rantai selalu hanyut sedikit demi sedikit; opname berkala menyetel ulang hanyutan itu jadi nol.
Tombol **recount di awal bulan** menetapkan target dari sumber valid, dijalankan ±2 bulan lagi
setelah datanya terbukti bersih lewat laporan bayangan.

### 5.6 Keluar-target: mana yang bisa diturunkan

| Kriteria | Bisa diturunkan? | Dari mana |
|---|---|---|
| (a) Nasabah lunas | ✓ | `total_angsuran ≥ pinjaman`, `out_status='LUNAS'` (1.161.114 baris) |
| (b) Di-ACC topup (walau nasabah akhirnya menolak) | ⚠️ **lubang** | lihat di bawah |
| (c) Meninggal dunia | ✓ | `transaction_out_reasons_id = 4` (MD, 18.743 baris) + white_off |
| (d) Macet tak tertagih via persetujuan KM | ✗ **belum tercatat** | kode alasan ada (id 5 = MACET) tapi **0 baris pernah memakainya** |
| (e) CM → MB di tutup buku akhir bulan | ✓ | murni aritmetika tanggal |

**Lubang (b)**: kalau topup di-ACC lalu nasabah menolak, pinjaman baru jadi `gagal` — tapi
nasabah lama **tetap harus keluar target**. Masalahnya `check_date` terisi sama untuk
`acc`/`tolak`/`gagal`, jadi *"pernah di-ACC atau tidak"* tidak bisa dibaca dari data. Solusi
termurah: catat di pinjaman **lama** memakai kode alasan yang sudah tersedia — tanpa kolom baru.

**Catatan topup**: `previous_loan_id` sudah ada di skema (sejak 2026-08-03) tapi **baru terisi
3 baris, semuanya status `open`**. Fitur Pengajuan praktis belum dipakai produksi; topup
produksi masih dibuat tanpa tautan ke pinjaman lama.

### 5.7 Bentuk yang dipakai: hitung + input + selisih terlihat

`keluar` ketikan KM **tidak dihapus** — dia jadi pembanding, bukan penentu. Selisih antara yang
diketik dan yang dihitung jadi alarm, sama seperti `setoran_mantri` vs `tunai`. Ini memungkinkan
migrasi bertahap dari manual ke turunan seiring kualitas data membaik.

---

## 6. Topik 6 — Enam ember

### 6.1 Pembagian

```
selisih = bulan(angsuran.transaction_date) − bulan(pinjaman.drop_date)

  selisih 0   → month1  ┐
  selisih 1   → month2  ├─ ditampilkan sebagai "LANCAR"
  selisih 2   → ccm     ┘
  selisih 3   → cm       → CM  (bulan ke-4)
  selisih 4   → mb       → MB  (bulan ke-5)
  selisih ≥ 5 → ml       → ML  (di atas bulan 5)
```

**6 kolom penyimpanan, 4 kategori tampilan.** Bukan pilih salah satu — inilah yang versi
2026-08-05 salah baca sebagai "cacat struktural". Buku angsuran butuh granularitas per bulan
untuk penotalan horizontal per nasabah; buku rekap menampilkannya sebagai 4 kategori.

### 6.2 Aturan

1. Ember dihitung **saat penguncian**, langsung dari `drop_date` vs `transaction_date`.
   Keduanya permanen → hasilnya selalu sama, bisa dihitung ulang kapan saja.
2. **Satu fungsi saja** jadi acuan pembagian ember di alur baru.
3. Kolom `status` di `transaction_loan_instalments` **dibiarkan apa adanya** — masih dipakai
   alur lama. Tiga fungsi lama (`AppHelper::generateStatusAngsuran` `:239`,
   `generateStatusAngsuranString` `:261`, `generateStatusAngsuranString2` `:283`) **tidak
   disentuh**; keempat nilainya memang tidak cukup untuk 6 ember, tapi memadai untuk 4 kategori
   tampilan yang jadi tugasnya.

---

## 7. Topik 7a — Nasabah lama & penyesuaian saldo

### 7.1 Masalahnya

Nasabah yang pinjamannya sudah berjalan **sebelum masuk sistem** sekarang dimasukkan lewat
**drop palsu** → drop naik padahal tidak ada uang keluar dari laci → tunai hari itu bohong.

Akar teknisnya: `RekapTrait.php:204` (juga `:586`, `:732`) —
`sirkulasi_awal + (drop × 1,3) − storting`. **Sirkulasi cuma punya satu pintu masuk: drop.**
Tidak ada cara menaikkan sirkulasi tanpa membuat drop.

### 7.2 Tabel penyesuaian saldo — TERPISAH dari `transaction_white_offs`

`transaction_white_offs` **harus tetap murni** berisi pemutihan yang benar-benar terjadi —
angkanya dipakai menilai kinerja. Mencampur koreksi data ke sana membuat laporan pemutihan
menggelembung oleh peristiwa yang tidak pernah ada.

Bentuknya meniru pola `transaction_white_offs` (relasi, bukan kolom flag di pinjaman):

```
transaction_loan_id
transaction_loan_officer_grouping_id   -- cap kelompok, seperti white_off
jenis                                  -- lihat tabel di bawah
nominal            BIGINT              -- SELALU POSITIF, arah ditentukan `jenis`
berlaku_bulan      DATE                -- tgl 1
user_input, user_approve, approved_at
catatan            TEXT nullable
timestamps
```

| `jenis` | Arah saldo | Kasus |
|---|---|---|
| `saldo_awal` | mengurangi | nasabah lama masuk bawa saldo — **sekaligus mengecualikan pinjaman itu dari SEMUA penjumlahan drop, di bulan mana pun termasuk bulan `drop_date`-nya sendiri** |
| `duplikat` | menihilkan | satu orang terlanjur jadi dua pinjaman |
| `kurang_input` | menambah | nasabah tercatat kurang dari sebenarnya |
| `lebih_input` | mengurangi | nasabah tercatat lebih |

`nominal` selalu positif supaya tidak ada kecelakaan tanda minus, dan laporan bisa dipisah per
jenis tanpa menebak.

**Tidak membuat baris angsuran apa pun** → storting otomatis tidak terpengaruh, tanpa perlu
penyaringan di mana pun. Ikut dikecualikan dari potongan **do11 (11%)** dan **titipan9 (9%)**
untuk jenis `saldo_awal`, karena tidak ada uang yang benar-benar keluar (`RekapTrait.php:168-169`).

### 7.3 ⛔ Yang TIDAK boleh dipakai untuk menyelesaikan duplikat

- **JANGAN lewat angsuran penyesuaian** → menaikkan storting → menaikkan tunai → **uang hantu
  di kas**. Ini mesin yang sama yang menghasilkan 8.703 mismatch.
- **JANGAN lewat pemutihan** → laporan pemutihan menggelembung oleh peristiwa yang tidak pernah
  terjadi, dan angka itu dipakai menilai kinerja.

Dedup lewat NIK **tidak akan pernah menutup** — ganti satu digit NIK dengan nama sama, duplikat
lolos. Jadi pencegahan bukan jawabannya; **penyesuaian yang harus disediakan resmi**. Yang bisa
dilakukan: peringatan saat input (*"NIK ini sudah punya saldo awal aktif di kelompok ini"*) dan
laporan pemantau duplikat, dideteksi lewat `transaction_customers.nik` / `transaction_customer_id`
— bukan lewat id pinjaman (duplikatnya bukan baris yang sama, melainkan **orang yang sama
dibuatkan dua pinjaman**).

### 7.4 Input = SISA SALDO, bukan "sudah terbayar berapa"

```
staf isi : sisa saldo = 400.000
sistem   : penyesuaian = pinjaman − angsuran_tercatat − 400.000
```

Buku kertas menampilkan **sisa saldo** — itu angka yang benar-benar ada di depan mata. "Total
yang sudah dibayar sejak 2024" adalah angka yang harus mereka hitung sendiri, dan setiap
hitungan manual adalah kesempatan salah. Dengan 870 ribu baris nasabah, bedanya besar.

Aturan pelengkap: pembayaran yang masuk **selama masa validasi tetap dicatat sebagai angsuran
biasa** di sistem lama. Karena staf mengisi sisa saldo (bukan akumulasi bayaran), tidak ada
risiko terhitung dobel — sistem yang menyelesaikan selisihnya.

### 7.5 🔒 Batasan cakupan — pagar terkuat rancangan ini

**Hanya pinjaman yang sudah ML di bulan terakhir sistem lama yang boleh disesuaikan.**

```
boleh_disesuaikan  ⟺  bulan(drop_date) ≤ bulan(mulai_pendataan_baru) − 6
```

Contoh, migrasi berlaku **1 Oktober 2026** (bulan terakhir sistem lama = September):

| Kondisi di September | `drop_date` | Bisa disesuaikan? |
|---|---|---|
| ML (selisih ≥ 5 bulan) | ≤ April 2026 | **ya** |
| MB (jadi ML di Oktober) | Mei 2026 | tidak |
| CM / lancar | Juni–September 2026 | tidak |
| drop setelah migrasi | ≥ Oktober | tidak, selamanya |

**Kenapa ini kuat**: `mulai_pendataan_baru` tetap, `drop_date` tetap → **himpunannya beku sejak
migrasi dan hanya bisa mengecil.** Tidak ada satu pun pinjaman baru yang bisa masuk daftar
bisa-disesuaikan. Anggotanya lunas, diputihkan, atau habis seiring waktu — dan fasilitas ini
**mati sendiri**. Ini alat migrasi berbatas waktu, bukan lubang permanen.

Cocok dengan temuan sebelumnya: 28.574 pinjaman bercap kelompok kacau, **0 di antaranya
menyentuh jendela 5 bulan terakhir** — kekacauannya memang seluruhnya di zona ML.

**Yang boleh disesuaikan cuma saldo.** Tidak pernah drop, tidak pernah storting, tidak pernah
tanggal. Arus kas dan rekap harian tidak bisa disentuh dari pintu ini sama sekali.

### 7.6 Pagar yang wajib menyertai (bukan menyusul)

Fasilitas ini adalah **lubang paling berbahaya di seluruh rancangan**. Seluruh desain bertujuan
membuat selisih *terlihat*; mekanisme yang menggeser saldo tanpa jejak kas adalah cara paling
rapi membuatnya *menghilang lagi*.

- **Akses bongkar-pasang**: hanya staf/kasir yang diberi akses oleh superuser (pola `can-edit`).
- **Pengaju ≠ penyetuju.**
- **Alasan dari daftar tetap**, bukan teks bebas — kalau bebas, semua akan diisi "koreksi" dan
  laporannya tidak bisa dibaca.
- **Laporan pemantau tetap**: total penyesuaian per mantri per bulan, per jenis. Angka sehat
  mengecil seiring waktu. Pola tidak wajar harus muncul sendiri, bukan menunggu ada yang curiga.
- **Ikut aturan kunci**: bulan yang sudah disahkan tidak bisa disesuaikan tanpa buka kunci + log.

**Risiko sisa yang diakui**: nasabah ML lama **masih ditagih**, dan setorannya uang nyata.
Mantri bisa menagih lalu menyesuaikan saldonya turun tanpa menyetor — hilang tanpa jejak, karena
penyesuaian memang tidak menyentuh kas. Laporan pemantau adalah penangkal utamanya.

### 7.7 Garis batas akuntansi

> **Sebelum `mulai_pendataan_baru`**: saldo **dinyatakan** (best effort, boleh disesuaikan —
> memang sudah berantakan dan belum memungkinkan diinput semua).
> **Sesudahnya**: saldo **diturunkan** dari transaksi nyata, tidak bisa disesuaikan sama sekali.

Ini jujur dan bisa dipertanggungjawabkan. Syaratnya batas itu **kelihatan di laporan** —
penyesuaian masuk ke **kolomnya sendiri** di agregat bulanan, tidak dilebur diam-diam ke saldo
awal. Pertanyaan *"sirkulasi naik 300jt bulan ini — dari drop atau dari penyesuaian data lama?"*
harus selalu bisa dijawab.

---

## 8. Topik 7b — Mutasi nasabah

### 8.1 Masalahnya

Perpindahan sekarang dilakukan dengan **meng-UPDATE `transaction_loan_officer_grouping_id`**.
Akibatnya, untuk Bu Sri (Mantri 3 / Selasa, drop 5 Mei, pindah ke Mantri 5 / Rabu per 1 Agustus):

- Buku Mantri 3 Selasa bulan **Mei–Juli**: Bu Sri **hilang**, padahal dulu memang ditagih di sana
- Drop Mei ikut pindah ke Mantri 5 → catatan drop kedua mantri salah surut
- Angsuran Mei–Juli punya cap kelompoknya sendiri → **tetap** di Mantri 3
- Hasilnya pinjaman di Mantri 5 tapi angsurannya di Mantri 3 → **inilah 28.574 baris kacau dari
  grouping 331 itu**

### 8.2 Bentuk baru

`transaction_loans.transaction_loan_officer_grouping_id` **TIDAK PERNAH DIUBAH.** Perpindahan
jadi baris tersendiri:

```
transaction_loan_id
from_grouping_id, from_hari
to_grouping_id,   to_hari
berlaku_bulan     DATE       -- SELALU tanggal 1
berlaku_sampai    DATE nullable  -- diisi OTOMATIS saat mutasi berikutnya dibuat
saldo_saat_mutasi BIGINT     -- dibekukan
user_input, catatan, timestamps
```

Membacanya:

```
isi kelompok B hari H pada bulan M =
      pinjaman WHERE grouping_id = B AND hari = H      (basis, secepat query sekarang)
    − yang punya mutasi KELUAR berlaku ≤ M
    + yang punya mutasi MASUK ke B/H berlaku ≤ M (dan belum pindah lagi)

posisi(nasabah, bulan M) = baris mutasi dengan
    berlaku_bulan ≤ M  AND  (berlaku_sampai IS NULL OR M < berlaku_sampai)
```

Pinjaman yang tidak pernah pindah — mayoritas mutlak — **tidak menyentuh tabel mutasi sama
sekali**.

| Buku | Bulan | Hasil |
|---|---|---|
| Mantri 3 / Selasa | Juli | mutasi belum berlaku → Bu Sri **masih ada** ✓ |
| Mantri 3 / Selasa | Agustus | mutasi berlaku → **keluar** ✓ |
| Mantri 5 / Rabu | Juli | belum berlaku → **belum ada** ✓ |
| Mantri 5 / Rabu | Agustus | → **masuk** ✓ |

`saldo_saat_mutasi` dibekukan untuk dua guna: **bukti serah terima**, dan **angka yang dipakai
kolom `mutasi_masuk`/`mutasi_keluar`** — dibekukan supaya kedua sisi pasti sama persis.

Umur pinjaman **tidak reset** — Bu Sri tetap CM di tangan Mantri 5, bukan kembali ke month1.

### 8.3 ⚠️ Mutasi masuk adalah ARUS, bukan saldo awal

Mutasi berlaku 1 Agustus, jadi naluri bilang taruh 400rb-nya di **`awal_*` Agustus** Mantri 5.
**Jangan.**

| Cara | Akibat |
|---|---|
| masuk ke `awal_*` Agustus | `akhir Juli ≠ awal Agustus` → **rantai antar bulan putus** |
| masuk ke `mutasi_masuk` (arus) | `awal Agustus = akhir Juli` tetap utuh ✓ |

Pemeriksaan `akhir bulan lalu == awal bulan ini` adalah **alat deteksi kesalahan terbaik** di
lapisan bulanan. Sekali dilanggar demi kerapian, alarmnya hilang.

> **Aturan umum**: apa pun yang terjadi DI DALAM bulan M adalah **arus bulan M**, tidak pernah
> mengubah `awal(M)`. Berlaku untuk mutasi, **pemutihan**, saldo masuk, dan penyesuaian.
> `awal` hanya boleh bergerak karena pergeseran ember dari bulan sebelumnya.

### 8.4 ⚠️ Mutasi harus terbagi per ember

Bu Sri drop Mei, pindah Agustus → di Agustus dia **CM**. 400rb-nya harus mendarat di **ember CM**
Mantri 5, bukan sebagai angka gelondongan. Kalau disimpan sebagai satu total, informasi embernya
**hilang permanen** dan pergeseran ember ke September tidak tahu 400rb itu harus naik kelas ke MB
dari mana.

Tidak perlu kolom baru: tiap baris mutasi menunjuk satu pinjaman, dan pinjaman punya `drop_date`
— embernya bisa dihitung saat agregat bulanan disusun.

### 8.5 Satu-satunya perubahan kode wajib

`TransactionLoanController.php:1089` menyalin cap kelompok angsuran dari kolom pinjaman:

```php
'transaction_loan_officer_grouping_id' => $transactionLoan->transaction_loan_officer_grouping_id,
```

Karena `grouping_id` pinjaman tidak pernah lagi diubah, angsuran Agustus Bu Sri akan bercap
**Mantri 3** padahal ditagih **Mantri 5** — **memproduksi ulang persis bug yang sedang diperbaiki.**

**Cap angsuran harus dibaca dari posisi mutasi pada bulan transaksi.** Angsuran **lama tidak ikut
dipindah** — Mei–Juli tetap bercap Mantri 3 karena memang Mantri 3 yang menagihnya. Itu bukan
cacat, itu yang membuat buku bulan lampau tetap utuh.

### 8.6 Syarat & wewenang

- **Hanya setelah bulan sebelumnya tutup buku** (penyaldoan horizontal selesai), `berlaku_bulan`
  **selalu tanggal 1**. Kalau boleh di tengah bulan, satu bulan punya dua pemilik dan penotalan
  horizontal per nasabah tidak punya tempat berlabuh.
- **Hanya superuser** yang boleh melakukan mutasi.

> **Risiko operasional**: 157 kantor, satu superuser. Kalau jalur resmi terasa lambat, orang akan
> kembali ke jalan lama (minta diubah langsung / menambal lewat drop & angsuran penyesuaian) —
> persis yang melahirkan grouping 331. **Yang dibatasi harus persetujuannya, bukan pengetikannya**:
> kantor (KM/pimpinan) mengajukan lengkap dengan daftar nasabah, superuser menyetujui borongan
> dalam satu layar.

### 8.7 ⚠️ Konsekuensi silang: invarian `hari` sengaja dilanggar

`hari` saat ini **100% cocok** dengan hari dari `drop_date` — **691.721 dari 691.721** pinjaman
success 2026. Mutasi **sengaja melanggar** ini (Bu Sri drop Selasa, ditagih Rabu). Itu memang tujuannya.

Masalahnya `AdminController@loan_balancing` dibuat justru untuk **mencari ketidakcocokan itu
sebagai kesalahan**. Begitu mutasi jalan, alat itu akan menandai setiap nasabah yang pernah pindah
sebagai data rusak — padahal benar. **Wajib disesuaikan bersamaan dengan mutasi, jangan menyusul**:
alat pemantau yang berbunyi palsu lebih berbahaya daripada tidak ada, karena orang belajar
mengabaikannya.

---

## 9. Topik 8 — Kalender kerja

### 9.1 Bentuk

```
work_days: id, date (unique), is_libur, keterangan, dibuat_oleh, timestamps
```

**Nasional, tanpa `branch_id`.** (Dugaan awal "libur tidak seragam antar kantor" **ditarik** —
transaksi tidak-nol saat Lebaran itu input semrawut, bukan variasi kantor.) Minggu otomatis libur.
Ditetapkan superuser untuk bulan depan.

### 9.2 Aturan

| Situasi | Perlakuan |
|---|---|
| Superuser lupa menetapkan | **jangan memblokir** — jatuh ke bawaan Senin–Sabtu, tandai "belum dikonfirmasi" |
| Kalender perlu diubah | boleh **selama tanggal itu belum bertransaksi dan belum terkunci** |
| Drop/pelunasan jatuh di hari libur | **mundur ke hari tagih yang sama minggu berikutnya** (17 Agt libur → 24 Agt). Hari tagih & kelompok selalu utuh. Tanggal libur **tidak bisa dipilih** di UI |
| Data lama yang terlanjur di hari libur | **dibiarkan** — validasi berlaku maju saja |

Pilihan "mundur seminggu" penting: karena `hari` selalu ikut hari dari `drop_date`, melompat ke
hari kerja terdekat akan **memindahkan nasabah ke kelompok-hari lain** — diam-diam jadi mutasi,
dan untuk topup itu melewati aturan "mutasi hanya superuser" tanpa ada yang berniat melanggar.

### 9.3 Guna yang lebih besar: menolak tanggal mustahil

Terverifikasi di produksi:

| Kasus | Jumlah |
|---|---:|
| `drop_date` tahun < 2015 atau > 2027 | **80** |
| `drop_date` di masa depan | 25 |
| baris rekap bertanggal masa depan | **151** |

Contoh nyata: `0225-06-04`, `0025-07-12`, `1923-12-07`, dan satu drop bertanggal **`3026-07-07`**.
Salah ketik tahun yang lolos tanpa satu pun penjagaan.

Dampaknya bukan kosmetik: pinjaman ber-`drop_date` tahun 0025 **selamanya ML** (selisih ribuan
bulan), saldonya ikut terhitung di sirkulasi, dan **tidak akan pernah bisa keluar dari ember ML
dengan cara apa pun**. Sebagian kekacauan ML isinya persis hal seperti ini.

Jadi kalender sebaiknya jadi **satu-satunya gerbang tanggal**: bukan cuma "libur atau tidak", tapi
"tanggal ini sah atau tidak" — ada di kalender, dalam rentang wajar, tidak di periode terkunci.

### 9.4 Temuan operasional: penutupan 13 hari

Aktivitas normal ±45.000 angsuran/hari. Periode Idul Fitri **16–28 Maret 2026** turun ke
**146–1.066/hari (0,3–2%)** selama **13 hari berturut-turut**. Rantai penguncian dan rantai target
mingguan harus tahan jeda selebar itu — targetmu yang berbasis mingguan akan melewati 2 siklus penagihan.

### 9.5 Kalender awal dibangkitkan dari data

Daftar libur de facto 2026 bisa diambil langsung dari data (hari kerja beraktivitas sangat rendah):
1 Jan, 16 Jan, 17 Feb, **16–28 Mar**, 3 Apr, 1 Mei, 14 Mei, 27 Mei, 1 Jun, 16 Jun. Jauh lebih murah
dan akurat menyodorkan kandidat ini ke superuser untuk dikonfirmasi ketimbang mengetik satu per satu.

---

## 10. Struktur tabel baru

### 10.1 `transaction_daily_closings` — agregat HARIAN

```
transaction_loan_officer_grouping_id, date          UNIQUE

-- TURUNAN (dihitung dari sumber saat pengesahan; STORED GENERATED bila memungkinkan)
drop, storting
storting_month1, storting_month2, storting_ccm, storting_cm, storting_mb, storting_ml
pemutihan
do11        = drop * 0.11        ← JANGAN dibuang, ini yang menyuplai tunai
titipan9    = drop * 0.09
debit       = do11 + kasbon + storting
kredit      = drop + transport
tunai       = debit - kredit

-- MANUAL (bebas diubah SEBELUM terkunci, WAJIB ikut dikunci sesudahnya)
kasbon, transport, keluar, target, target_on, target_source
setoran_mantri     BIGINT NULL   -- NULL = belum dicatat, 0 = memang tidak menyetor

-- ALARM
selisih     = setoran_mantri - tunai      STORED GENERATED

-- PENGESAHAN
kepala_approval_at / _user
kasir_lock_at / _user      -- terisi = SELURUH baris + sumbernya beku
```

Barisnya **dibuat massal** saat kalender bulan depan ditetapkan — tanggal itu pasti ada walau drop
& storting masih nol, karena kasbon & transport toh selalu ada.

### 10.2 `transaction_monthly_closings` — agregat BULANAN

```
transaction_loan_officer_grouping_id, hari, periode   UNIQUE   (periode = tgl 1)

-- JANGKAR
awal_month1..awal_ml, awal_total
awal_ml_belum_terinput        -- Z = Y - X saat serah terima, TERAMATI bukan ditetapkan (§13.3).
                              -- Setelah itu turun tiap nasabah lama diinput, dan jadi KUOTA
                              -- yang membatasi berapa banyak lagi yang boleh masuk.

-- ARUS (HITUNG ULANG PENUH tiap tanda tangan harian — BUKAN increment)
drop, storting, storting_month1..storting_ml
pemutihan, saldo_masuk, mutasi_masuk, mutasi_keluar

-- HASIL (dihitung dari PORTOFOLIO, bukan dari awal + arus)
akhir_month1..akhir_ml, akhir_total

-- KELENGKAPAN & PENGESAHAN
hari_kerja, hari_terkunci     -- tanda tangan disyaratkan hari_terkunci = hari_kerja
kepala_approval_at / _user, kasir_lock_at / _user
```

**Kenapa `transaction_sirculations` yang lama tidak cukup** — grainnya sudah benar
(`grouping × hari × bulan`, kolom `day` terisi rapi merata senin–sabtu), tapi dari data 2026:

| Kolom | Terisi |
|---|---:|
| `amount`, `cm_amount`, `mb_amount`, `ml_amount` | 32rb–41rb |
| **`month1_amount`, `month2_amount`, `ccm_amount`** | **0** |

Tiga ember sehat **tidak pernah diisi** → pergeseran ember kehilangan tiga anak tangga pertamanya.
Ditambah tidak ada `akhir_*`, tidak ada kolom arus, tidak ada Z, tidak ada kolom pengesahan.
**Cakupan bolong ±23%** (Juli 2026: 7.377 dari 9.540 baris seharusnya; 1.238 dari 1.590 kelompok) —
sisanya tidak punya saldo awal sama sekali.

### 10.3 Tabel lain

| Tabel | Isi |
|---|---|
| `work_days` | §9.1 |
| `transaction_saldo_adjustments` | §7.2 |
| `transaction_loan_mutations` | §8.2 |
| `transaction_kasir_calculations` | jejak kalkulator kasir (§3.5) — **tidak boleh membaca drop/storting** |
| `transaction_lock_histories` | jejak buka-tutup kunci + **nilai tunai sebelum & sesudah** (§3.6) |

### 10.4 Kolom baru di tabel lama

| Tabel | Kolom | Guna |
|---|---|---|
| `branches` | `mulai_pendataan_baru` (date, nullable) | penanda kantor sudah pindah flow, **jangkar seluruh aturan batas** |

---

## 11. Rumus sirkulasi — empat pintu

```
sirkulasi_akhir = sirkulasi_awal
                + (drop × 1,3)     ← pintu 1: pinjaman baru
                + saldo_masuk      ← pintu 2: nasabah lama / penyesuaian
                + mutasi_masuk     ← pintu 3
                − mutasi_keluar
                − storting
                − pemutihan
```

Sekarang (`RekapTrait.php:204`, `:586`, `:732`) cuma pintu 1 — **itulah kenapa orang terpaksa
mengarang drop.**

**Drop dan sirkulasi adalah dua besaran berbeda yang kebetulan biasanya sejalan.** Begitu ada mutasi
atau nasabah lama masuk, keduanya berpisah — itu bukan anomali, itu memang seharusnya. Contoh:
kelompok CM drop 1 jt tapi menerima limpahan sirkulasi 1 jt → di rekap drop-nya tetap 1 jt, tapi
sirkulasi CM-nya 1 jt lebih. Mustahil direpresentasikan dengan rumus lama.

> ⚠️ **Begitu empat pintu hidup, `sirkulasi ≈ Σdrop × 1,3 − Σstorting` BERHENTI BERLAKU sebagai
> pemeriksaan.** Laporan validasi atau dashboard kewajaran mana pun **wajib menyertakan keempat
> pintu**. Kalau tidak, alarmnya berbunyi terus di kelompok yang datanya justru paling rapi, dan
> orang akan belajar mengabaikannya — lebih berbahaya daripada tidak ada alarm sama sekali.

### 11.1 Pergeseran ember (gampang salah)

Saldo akhir sebuah ember **bukan** jadi saldo awal ember yang sama bulan depan — **embernya naik kelas**:

```
akhir month1 → awal month2      akhir cm → awal mb
akhir month2 → awal ccm         akhir mb → awal ml
akhir ccm    → awal cm          akhir ml → awal ml     ← mentok
awal month1  = 0, diisi drop bulan berjalan
```

### 11.2 `awal` dan `akhir` HARUS dihitung terpisah

Kalau `awal(M+1)` cuma **disalin** dari `akhir(M)`, pemeriksaan rantai jadi **tautologi** — selalu
cocok, tidak pernah menangkap apa pun.

- `akhir(M)` = jumlahkan saldo portofolio nyata di akhir M, dipilah per ember
- `awal(M+1)` = jumlahkan saldo portofolio nyata di awal M+1, dengan ember yang sudah bergeser

Baru setelah itu dibandingkan. Kalau meleset: ada pinjaman yang embernya melompat, `drop_date`
diubah belakangan, atau mutasi tercatat sebelah.

> **Pengecualian: `awal_ml_belum_terinput` (sisa kuota) DIBAWA TURUN, bukan dihitung ulang.**
> Semua kolom `awal_*`/`akhir_*` lain diturunkan dari portofolio — tapi sisa kuota justru menghitung
> orang yang **tidak ada** di portofolio, jadi memang tidak bisa diturunkan dari sana.
>
> Ini bukan kelonggaran, ini keharusan: kalau tiap bulan sisa kuota dihitung ulang sebagai
> `ml_amount − data`, kebocoran di §13.3 masuk lagi lewat pintu belakang — kuota terisi ulang sendiri
> tiap kali nasabah ML membayar. Sisa kuota hanya berkurang lewat input, dan hanya bertambah lewat
> `can-edit` beralasan.

---

## 12. Tahapan pengerjaan

### 12.1 Prinsip: bangun sakelarnya dulu, baru isinya

Bahaya terbesar bukan tabel barunya, tapi **percabangan `if sudah migrasi` yang tersebar**. Sekali
dia ada di 15 tempat, satu yang terlewat berarti kantor yang sama dibaca dari dua tabel berbeda di
dua halaman berbeda — bug yang baru ketahuan berbulan-bulan kemudian.

**Satu gerbang, bukan lima belas percabangan.** Ikuti pola `AuthScope` di `app/Helpers/` (proyek ini
tidak punya `Services/`). Dengan semua `mulai_pendataan_baru` masih `NULL`, gerbangnya selalu
menjawab "pakai yang lama" → bisa dipasang ke produksi dan **dibuktikan tidak mengubah apa pun**.

**Titik yang harus lewat gerbang:**

| Berkas | Fungsi | Baris |
|---|---|---|
| `app/Traits/RekapTrait.php` | `getRekapDuaData` | 204 |
| `app/Traits/RekapTrait.php` | `getDataRekapDua` | 586 |
| `app/Traits/RekapTrait.php` | `getRekapPermantriData` | 732 |
| `app/Traits/PinjamanTrait.php` | `getLoan` | 322, 356, 384, 417 |
| `app/Traits/PinjamanTrait.php` | `getLoanMantri` | 550, 605 |
| `app/Http/Controllers/TransactionDailyRecapController.php` | `ceklist_kepala`, `rekap_post` | — |

Pemakai trait: `TransactionDailyRecapController`, `MobileAppsMantriController`, `TransactionLoanController`.

### 12.2 Urutan

| # | Tahap | Isi | Dibuktikan dengan |
|---|---|---|---|
| **0** | **Batas** | kolom `mulai_pendataan_baru` (semua `NULL`) + gerbang pemilih tabel | angka di semua halaman **identik** dengan sebelumnya |
| **1** | **Alat validasi** | tabel penyesuaian saldo, layar input **sisa saldo**, laporan stock-take X/Y/Z | staf bisa mulai kerja; alur lama tidak tersentuh |
| **2** | **Tabel baru, kosong** | `daily_closings`, `monthly_closings`, `work_days` + job generate sebulan | tabel ada, belum ada yang membaca |
| **3** | **Mesin baru** | turunan (drop/storting/6 ember), isian manual (kasbon/transport/**setoran**), kunci + log | gerbang bisa melayani kantor bertanda migrasi |
| **4** | **Cutover percontohan** | 1 Okt: tutup buku terakhir → portofolio → Z → set tanggal | `akhir(lama)` vs `awal(baru)` cocok |
| **5** | **Menyusul** | closing bulanan bertanda tangan, mutasi (+ perbaikan `loan_balancing`), kalender, recount target, dashboard | setelah percontohan terbukti sebulan |

**Tahap 0–2 tidak mengubah perilaku apa pun** — aman paralel dengan operasional. Risiko baru mulai tahap 3.

### 12.3 Yang wajib berhenti saat sebuah kantor migrasi

`transaction_daily_recaps` harus **berhenti ditulis**, bukan cuma berhenti dibaca — kalau tidak,
datanya terbelah di dua tabel dan tidak ada yang tahu mana yang benar. Termasuk memastikan hook
`TransactionDailyRecap::updating` (`:54`, perambatan target rekursif) tidak terpicu.

### 12.4 September: jalan berdampingan

Untuk kantor percontohan, jalankan **laporan pembanding** hitungan versi baru vs angka versi lama,
berdampingan, tiap hari. **Murni laporan — tidak menulis ke tabel baru sama sekali**, jadi tidak
melanggar aturan §13.1.

Gunanya: setiap selisih ketahuan **sebelum** jadi permanen. Kalau dua minggu cocok, cutover 1 Oktober
dilakukan dengan bukti, bukan harapan. Kalau tidak cocok, yang ketemu kemungkinan besar bug di mesin
baru — dan masih ada waktu.

---

## 13. Migrasi per kantor

### 13.1 ⛔ Agregat baru TIDAK PERNAH menyentuh tanggal sebelum `mulai_pendataan_baru`

Hitung mundur bukan "mengisi yang kosong" — hasilnya **tidak akan sama** dengan yang tercatat di
agregasi lama (kita tahu persis kenapa: 8.703 storting-mismatch, 4.141 target patah). Jadi hitung
mundur **melahirkan versi kedua dari bulan yang sudah ditandatangani**, dan dua-duanya akan beredar.
Itu lebih buruk daripada tidak punya datanya sama sekali.

Bulan lampau selamanya dibaca dari agregasi lama sebagai **arsip**.

**Konsekuensinya**: sistem closing **harus hidup di hari pertama**, tidak bisa ditunda —
`setoran_mantri` dan tanda tangan tidak bisa dibuat mundur.

### 13.2 Titik serah terima

Satu-satunya kali sistem lama & baru bertemu:

```
tutup buku terakhir sistem lama (30 Sep)
  → saldo akhir per kelompok, per hari tagih, per ember
    ← dihitung dari PORTOFOLIO NYATA, bukan dari transaction_sirculations
      (tabel itu tidak punya month1/month2/ccm, dan 23% kelompok tidak punya barisnya)
  → + Z (ML belum terinput) = Y - X, teramati per (grouping, hari) - lihat §13.3
      ↓
  awal_* bulan pertama sistem baru
```

Pemeriksaan `akhir(lama) == awal(baru)` dilakukan **sekali seumur hidup per kantor**. Kalau meleset,
**migrasinya ditunda — bukan angkanya dipaksa cocok.** Setelah itu keduanya tidak pernah bersentuhan lagi.

### 13.3 Stock-take ML & gerbang input susulan

> **Menggantikan aturan "Z ditetapkan manual" dari versi awal dokumen ini.** Lihat akhir bagian ini.

```
X = saldo ML dari data nyata   (dihitung sistem, naik tiap nasabah lama diinput)
Y = ml_amount lama             (angka berjalan di transaction_sirculations)
Z = Y − X                      (TERAMATI, bukan ditetapkan — berfungsi sebagai KUOTA)
```

**Grain: per `(grouping, hari)`, bukan per mantri.** Ini keputusan sadar, tiga alasan: `ml_amount`
memang sudah disimpan per `(grouping, day, bulan)` sehingga menggabungkannya membuang informasi;
sejalan dengan buku storting yang di-group per hari; dan input nasabahnya sendiri selalu jatuh ke
satu hari tertentu, jadi kuota harus bisa diperiksa di grain itu — kalau tidak, nasabah Senin bisa
memakai kuota Rabu.

> Diukur Juli 2026: menggabung per mantri **menyembunyikan Rp 1,11 miliar** selisih hari, karena
> mantri yang Senin-nya kelebihan dan Rabu-nya kurang akan terbaca "cocok" padahal dua-duanya salah.
> Itu persis pola penyakit di §1 — satu angka menyerap kesalahan angka lain sampai kelihatan rapi.

#### Gerbang input ML susulan — `ml_amount` sebagai KUOTA

`ml_amount` diperlakukan sebagai **kuota**: total ML yang menurut kantor seharusnya ada. Data nyata
mengisinya dari bawah. Begitu penuh, pintu ditutup.

| Kondisi saat serah terima | Input ML susulan | Alasan |
|---|---|---|
| `Y = X` | **DITUTUP** | kuota sudah penuh sejak awal |
| `Y > X` | **DIBUKA**, kuota = `Y − X` | selisihnya = nasabah yang orangnya belum masuk sistem |
| `Y < X` | **DITUTUP** | sistem sudah tahu lebih banyak dari angka berjalan; menambah malah memperburuk |

**Selisih yang tidak cocok TIDAK dipaksa sama.** Tidak ada penyesuaian otomatis — cukup dilaporkan
apa adanya. Yang dipakai dari selisih itu hanya **arahnya** (buka/tutup) dan **besarnya** (kuota).

#### ⚠️ Penguncian harus berupa PALANG, bukan perbandingan yang dievaluasi ulang

Ini yang paling gampang salah dikerjakan. Kalau sistem terus-menerus menanyakan *"apakah X sudah
sama dengan Y?"*, pintunya akan **buka-tutup sendiri**, karena `X` bergerak TURUN tiap kali nasabah
ML membayar:

```
Agustus  : Y = 100jt, X = 100jt   → cocok, pintu ditutup      ✓
September: ML membayar 5jt        → X turun jadi 95jt
           Y = 100jt > X = 95jt   → pintu TERBUKA LAGI, kuota 5jt   ✗
```

Rp 5 juta itu **bukan** "nasabah yang belum terinput" — itu uang yang baru saja masuk. Pintu terbuka
justru karena penagihan berhasil, dan staf dipersilakan menambah ML fiktif senilai setoran yang baru
diterima. Berulang tiap bulan. Aturan yang dimaksudkan mencegah data palsu malah jadi mesin
pembuatnya.

> Terverifikasi Juli 2026: nasabah ML membayar **19.347 kali senilai Rp 2,22 miliar** dari 11.478
> pinjaman. `X` memang menyusut terus — ini bukan kasus teoretis.

**Bentuk yang benar**: perbandingan `Y` vs `X` dilakukan **sekali saja saat serah terima**. Setelah
itu yang berjalan adalah sisa kuota yang **tidak punya satu pun jalur naik**:

```
Serah terima   : sisa_kuota = maks(0, Y − X)      ← sekali, per (grouping, hari)
Tiap input ML  : sisa_kuota berkurang sebesar saldo yang diinput
sisa_kuota = 0 : TERKUNCI PERMANEN
```

Penguncian permanennya jadi **sifat bawaan cara hitungnya**, bukan aturan tambahan yang harus
dijaga. Setoran ML dan pemutihan tidak lagi mengganggu apa pun, karena keduanya menyentuh `X`
sedangkan pintu dijaga `sisa_kuota`.

Rumahnya: `transaction_monthly_closings.awal_ml_belum_terinput` (§10.2), **dibawa turun antar bulan,
bukan dihitung ulang** — lihat pengecualian di §11.2.

#### Input ML vs Penyesuaian — dua jalur, dua pembatas

| | **Input ML** | **Penyesuaian** |
|---|---|---|
| Jenis | `saldo_awal` | `duplikat` / `kurang_input` / `lebih_input` |
| Kapan | selama kuota masih ada | kapan saja, termasuk setelah terkunci |
| Siapa | staf berakses biasa | **`can-edit`** bongkar-pasang superuser |
| Pembatas | **kuota** (angka keras) | persetujuan orang kedua + log + laporan pantau |
| Volume | ribuan baris | satuan, jarang |

**`saldo_awal` sengaja TIDAK butuh persetujuan orang kedua** — pembatasnya sudah kuota, dan kuota itu
berasal dari angka kantor sendiri. Mewajibkan dua orang untuk ribuan baris hanya akan mendorong orang
mencari jalan pintas, dan jalan pintas yang tersedia adalah `inputmacet` lama yang justru membuat
drop palsu. Yang butuh orang kedua adalah tiga jenis koreksi.

> ⚠️ **Penyesuaian tidak punya kuota — tata kelolanya yang jadi pembatas.** `kurang_input` bisa
> menambah saldo tanpa batas. Aman selama `can-edit` benar-benar dipasang-cabut dan jarang. Kalau
> suatu hari `can-edit` ditempelkan ke sebuah role supaya "praktis", **kuota di atas berubah jadi
> hiasan** — pintu depan terkunci, pintu samping terbuka lebar. Jangan disederhanakan.

#### Kuota hanya boleh naik lewat jalur bergembok

Kasusnya nyata: staf memasukkan nasabah Rp 5 jt, kuota turun 5 jt, lalu ketahuan orangnya dobel.
Kalau kuota tidak pernah bisa kembali, kantor kehilangan 5 jt kuota gara-gara salah ketik padahal
nasabah aslinya masih ada yang belum masuk.

**Aturan**: kuota boleh naik, **hanya lewat `can-edit` + alasan tercatat** — jalur yang sama dengan
membuka kunci hari (§4.7). Defaultnya tetap permanen; pengecualiannya selalu meninggalkan jejak.
Ini sekaligus jalan keluar untuk kelompok yang terlanjur terkunci karena salah hitung saat serah
terima.

#### Keadaan nyata (Juli 2026, 7.377 pasangan grouping×hari)

| Kasus | Pasangan | Selisih |
|---|---:|---:|
| `Y = X` → ditutup | 2.208 (30%) | 0 |
| `Y > X` → **dibuka** | 4.268 (58%) | **+Rp 54,25 M** |
| `Y < X` → ditutup | 901 (12%) | −Rp 3,71 M |

Dari 2.208 yang cocok, **1.412 karena dua-duanya nol** (kelompok itu memang tidak punya ML sama
sekali); hanya **796** yang benar-benar cocok di angka bukan nol.

#### ⚠️ Kasus yang BELUM tercakup aturan: `Y` tidak terdefinisi

**229 pasangan grouping×hari punya ML nyata Rp 2,97 M tapi tidak punya baris
`transaction_sirculations` sama sekali** — sisa dari cakupan bolong ±23% (§10.2). Di situ `Y` bukan
nol, melainkan **tidak ada**.

Dua bacaan, belum diputuskan:
- **Diperlakukan `Y = 0`** → jatuh ke kasus `Y < X` → input ditutup. Aman, tapi kalau kelompok itu
  sebenarnya masih punya ML belum terinput, pintunya terkunci tanpa alasan yang benar.
- **Diperlakukan "belum ditetapkan"** → kelompok itu **tidak boleh migrasi** sampai `Y` diisi.
  Sejalan dengan §13.2 (kalau serah terima tidak cocok, migrasi ditunda — bukan angka dipaksa cocok).

#### Yang berubah dari versi awal dokumen ini

Versi awal menyuruh kantor **menetapkan `Z` secara manual**, dengan alasan `Y` sudah melenceng dua
arah sehingga `Y − X` otomatis cuma memindahkan kesalahan lama. Aturan di atas **membatalkannya**:
`Z` tidak perlu dikarang sama sekali. Karena selisihnya tidak dipaksa cocok dan hanya dipakai sebagai
arah + kuota, tidak ada angka buatan yang masuk ke sistem baru — dan satu langkah kerja manual hilang
dari alur migrasi.

### 13.4 Rollout

- **1 Oktober 2026: 1–2 kantor percontohan.** Pilih yang **datanya paling rapi dan pimpinannya paling
  kooperatif** — bukan yang paling kacau. Kantor pertama untuk menemukan lubang di alurnya, bukan
  menyelesaikan masalah terbesar.
- Kantor lain menyusul per gelombang setelah alurnya terbukti sebulan.
- **Kantor yang belum migrasi tidak terganggu sama sekali**: `saldo_masuk = 0` membuat rumus baru
  menghasilkan angka **persis sama** dengan rumus lama — jadi perbaikan rumus aman dipasang duluan
  untuk semua kantor.

> **SEMUA MIGRASI DIBUAT & DIJALANKAN DARI `app_laravel`**, tidak pernah dari `unit-apps`.
> Database `ubmi_db` dipakai bersama dan tabel `migrations`-nya satu.

---

## 14. Yang SENGAJA tidak diubah

- **`transaction_loans` & `transaction_loan_instalments` — tidak ada kolom baru.** Seluruh rombakan
  di lapisan agregat; sumber datanya tidak disentuh.
- **Kolom `status` di angsuran + tiga fungsi `generateStatusAngsuran*`** (`AppHelper.php:239/261/283`)
  — dibiarkan, masih dipakai alur lama. Ember baru dihitung dari `drop_date` vs `transaction_date`.
- **`tunai` tetap generated column** — lihat §3.1.
- **`sharingdo` TIDAK dibuang** — dia menyuplai `debt` → `tunai`. Lihat §15.
- **`transaction_daily_recaps` & `transaction_sirculations`** — dipensiunkan **per kantor**, bukan
  dihapus; tetap melayani kantor yang belum migrasi dan jadi arsip bulan lampau.
- **Pelunasan otomatis top-up (`settled_by_loan_id`) tetap dihitung sebagai storting.** Jangan
  ditandai penyesuaian: di hari yang sama drop juga naik sebesar itu, keduanya saling meniadakan, kas
  tetap cocok. Kalau dikecualikan dari storting sementara drop tetap, rekapnya justru jadi pincang.
- **Data lama yang terlanjur bertanggal hari libur** — dibiarkan; validasi kalender berlaku maju saja.

---

## 15. Perubahan dari versi 2026-08-05

Tiga klaim di versi lama **dibatalkan** setelah verifikasi langsung ke `ubmi_db`:

| Klaim versi 2026-08-05 | Kenyataan | Kalau diikuti akibatnya |
|---|---|---|
| *(§3.4 versi lama)* *"`sharingdo` dari tabel lama tidak dibawa (kolom mati, cuma nongol di `$fillable`)"* | **VIRTUAL GENERATED** `drop * 0.11`, menyuplai `debt` → `tunai` | tabel baru dibuat tanpa penggantinya → **`tunai` langsung pincang** |
| *(§4.2 versi lama)* ember 4-vs-6 adalah *"cacat struktural"* di `generateStatusAngsuran()` | Bukan cacat — **6 ember penyimpanan, 4 kategori tampilan** (lancar = month1+month2+ccm). Beda lapis. | fungsi lama "diperbaiki" padahal sedang mengerjakan tugas yang benar |
| Target tidak dibahas sama sekali | **Sudah terimplementasi penuh** (`TransactionDailyRecap.php:62`, 133rb baris aktif 2026) | dibangun dari nol, padahal yang perlu cuma menambal 2 penyakitnya (§5.1) |

**Yang tetap berlaku dari versi lama**: prinsip masa-lalu-hanya-bisa-ditambah, rollout bertahap per
kantor, `mulai_pendataan_baru` sebagai jangkar, opening balance tanpa baris angsuran, mutasi tanpa
pernah mengubah `grouping_id`, syarat kunci (kepala approve + baris sebelumnya terkunci, bukan kas
seimbang), rumus empat pintu, pergeseran ember, stock-take X/Y/Z.

**Yang bertambah di v2**: diagnosis tunggal (§1), setoran mantri & kalkulator kasir (§3), pemisahan
hitung-vs-kunci (§4.4), hitung-ulang-bukan-tambah (§4.5), `target_source` & laporan bayangan (§5.3),
tabel penyesuaian saldo dengan batas ML (§7), mutasi per ember (§8.4), kalender sebagai gerbang
tanggal (§9.3), prinsip satu gerbang (§12.1), larangan hitung mundur (§13.1).

---

## 16. Yang BELUM diputuskan

1. **Kriteria keluar-target (d)** — macet tak tertagih via persetujuan KM: kode alasan sudah ada
   (`transaction_out_reasons` id 5 = MACET) tapi mekanisme pencatatannya belum, dan **0 baris pernah
   memakainya**.
2. **Penanda "pernah di-ACC"** untuk topup yang akhirnya ditolak nasabah (§5.6).
3. **Hari kerja nihil transaksi boleh dikunci?** Usulan: boleh — kasbon & transport tetap keluar.
   Kalau tidak boleh, rantai macet di hari sepi.
4. **Mantri cuti / kelompok kosong** — barisnya tetap dibuat nol, atau ada penanda "tidak beroperasi"?
   Berpengaruh ke rantai penguncian.
5. **Ember per jarak bulan kalender atau per urutan setoran?** Dengan jarak kalender (cara sekarang),
   pinjaman drop 27 Februari kena cap `cm` di Mei bukan karena menunggak, tapi semata karena drop-nya
   di ujung bulan.

---

## 17. Query rujukan

Semua angka di dokumen ini diverifikasi ke `ubmi_db` pada **2026-08-12**. Jalankan ulang untuk
memeriksa apakah masih berlaku — angka di versi 2026-08-05 sudah basi dalam seminggu.

```bash
D="/mnt/c/Program Files/Docker/Docker/resources/bin/docker.exe"   # WSL; di Linux cukup `docker`

# 4.141 rantai target patah dari 133.068 pasangan
"$D" exec laravel-db mysql -ularavel -psecret -N ubmi_db -e "
SELECT COUNT(*) pasangan,
  SUM(ABS(nxt.target-(prv.target+prv.drop*0.13-prv.keluar))<=1) cocok,
  SUM(ABS(nxt.target-(prv.target+prv.drop*0.13-prv.keluar))>1)  meleset
FROM transaction_daily_recaps nxt
JOIN transaction_daily_recaps prv
  ON prv.transaction_loan_officer_grouping_id=nxt.transaction_loan_officer_grouping_id
 AND prv.date=nxt.target_on
WHERE nxt.target_on IS NOT NULL AND nxt.date>='2026-01-01';"

# generated column di transaction_daily_recaps
"$D" exec laravel-db mysql -ularavel -psecret -N ubmi_db -e "
SELECT column_name, extra, generation_expression FROM information_schema.columns
WHERE table_schema='ubmi_db' AND table_name='transaction_daily_recaps'
  AND generation_expression<>'' ORDER BY ordinal_position;"

# ember month1/month2/ccm tidak pernah terisi
"$D" exec laravel-db mysql -ularavel -psecret -N ubmi_db -e "
SELECT COUNT(*) total, SUM(month1_amount<>0) m1, SUM(month2_amount<>0) m2, SUM(ccm_amount<>0) ccm,
       SUM(cm_amount<>0) cm, SUM(mb_amount<>0) mb, SUM(ml_amount<>0) ml
FROM transaction_sirculations WHERE date>='2026-01-01';"

# tanggal mustahil
"$D" exec laravel-db mysql -ularavel -psecret -N ubmi_db -e "
SELECT 'drop tahun ngawur' k, COUNT(*) v FROM transaction_loans
  WHERE YEAR(drop_date)>2027 OR YEAR(drop_date)<2015
UNION ALL SELECT 'rekap masa depan', COUNT(*) FROM transaction_daily_recaps WHERE date>CURDATE();"

# hari vs drop_date 100% cocok (invarian yang akan dilanggar mutasi)
"$D" exec laravel-db mysql -ularavel -psecret -N ubmi_db -e "
SELECT COUNT(*) total, SUM(LOWER(hari)=LOWER(CASE DAYOFWEEK(drop_date)
  WHEN 2 THEN 'senin' WHEN 3 THEN 'selasa' WHEN 4 THEN 'rabu' WHEN 5 THEN 'kamis'
  WHEN 6 THEN 'jumat' WHEN 7 THEN 'sabtu' WHEN 1 THEN 'minggu' END)) cocok
FROM transaction_loans WHERE status='success' AND drop_date>='2026-01-01' AND hari IS NOT NULL;"

# libur de facto (kandidat kalender awal)
"$D" exec laravel-db mysql -ularavel -psecret -N ubmi_db -e "
SELECT transaction_date, DAYNAME(transaction_date), COUNT(*) jml
FROM transaction_loan_instalments
WHERE transaction_date>='2026-01-01' AND DAYOFWEEK(transaction_date)<>1
GROUP BY transaction_date HAVING jml<2000 ORDER BY transaction_date;"
```
