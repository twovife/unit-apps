# Rombak Alur Rekap & Agregasi (Harian + Bulanan)

> **STATUS: RANCANGAN — BELUM DIKERJAKAN.**
> Dokumen ini hasil brainstorming 2026-08-05. Tidak ada satu pun tabel/kolom di
> bawah ini yang sudah ada di database. Jangan diperlakukan sebagai peta aplikasi
> yang berjalan — untuk itu baca `.agents/skills/peta-aplikasi/references/`.

---

## 1. Kenapa dirombak

### 1.1 Masalah yang mau diselesaikan

| # | Masalah | Akibat sekarang |
|---|---|---|
| 1 | Nasabah lama belum terinput dimasukkan lewat **drop palsu** + angsuran penyesuaian H+7 | Drop & storting naik di hari yang tidak ada uangnya |
| 2 | Perpindahan nasabah dilakukan dengan **mengubah `transaction_loan_officer_grouping_id`** | Riwayat bulan lampau ikut pindah; nama nasabah hilang dari buku mantri lama |
| 3 | Rekap harian **tidak mengunci apa pun** | Transaksi hari yang sudah disahkan masih bisa berubah diam-diam |
| 4 | Ember ML punya **dua sumber** (`ml_amount` manual vs data nyata) yang tidak pernah dijodohkan | Angka sirkulasi ML bisa 0 padahal pinjamannya masih ada |
| 5 | Rekap global harus menarik data mentah | 131 kantor × jutaan baris → tidak mungkin dibuat dashboard |

### 1.2 Prinsip tunggal

> **Masa lalu cuma bisa ditambah, tidak bisa diubah.**

Turunannya:

- **Drop = peristiwa.** Terjadi sekali, di satu tanggal, di satu kelompok. Permanen, tidak pernah pindah.
- **Sirkulasi = keadaan.** Saldo yang sedang ditanggung. Boleh berpindah tangan.
- **Arus dijumlahkan, saldo tidak.** Drop/storting boleh di-SUM lintas hari. Sirkulasi dihitung `awal + arus = akhir`.

### 1.3 Akar masalah teknis

`RekapTrait.php` baris **204**, **586**, **732**:

```php
'sirkulasi' => (int) round($sirkulasi + ($totalDrop * 1.3) - ($totalStorting))
```

Sirkulasi cuma punya **satu pintu masuk**: drop. Tidak ada cara menaikkan sirkulasi
tanpa membuat drop. Itulah sebabnya nasabah lama terpaksa dimasukkan lewat drop palsu.
Perbaikannya: **tambah pintu masuk kedua** (`saldo_masuk`).

---

## 2. Peta tabel

### 2.1 Tabel BARU (5)

| Tabel | Grain | Isi |
|---|---|---|
| `work_days` | per tanggal | Kalender kerja dari staf pusat |
| `transaction_opening_balances` | per pinjaman | Nasabah lama masuk membawa saldo |
| `transaction_loan_mutations` | per pinjaman per perpindahan | Mutasi nasabah antar kelompok/hari |
| `transaction_daily_closings` | per kelompok per hari kerja | **Arus** harian + gembok |
| `transaction_monthly_closings` | per kelompok per hari tagih per bulan | **Arus + saldo** bulanan |

Ditambah 1 tabel jejak:

| Tabel | Isi |
|---|---|
| `transaction_lock_histories` | Jejak buka-tutup gembok (siapa, kapan, alasan) |

### 2.2 Kolom BARU di tabel lama (1)

| Tabel | Kolom | Guna |
|---|---|---|
| `branches` | `mulai_pendataan_baru` (date, nullable) | Penanda kantor sudah pindah flow. Sekaligus **jangkar rantai penguncian**. |

### 2.3 Tabel lama yang DIPENSIUNKAN (bukan dihapus)

| Tabel | Nasib |
|---|---|
| `transaction_daily_recaps` | Tetap melayani kantor yang **belum** migrasi. Untuk kantor yang sudah migrasi, berhenti ditulis. Dibiarkan sebagai arsip. |
| `transaction_sirculations` | Perannya diambil kolom `awal_*` / `akhir_*` di `transaction_monthly_closings`. Dibiarkan sebagai arsip. |

### 2.4 Tabel lama yang TIDAK BERUBAH SAMA SEKALI

`transaction_loans`, `transaction_loan_instalments`, `transaction_white_offs`,
`transaction_customers`, `transaction_manage_customers`,
`transaction_loan_officer_groupings`.

**Tidak ada satu kolom pun ditambahkan ke tabel transaksi inti.** Ini disengaja —
seluruh rombakan terjadi di lapisan agregat, sumber datanya tidak disentuh.

---

## 3. Struktur tabel

### 3.1 `work_days` — kalender kerja

```
id
date              DATE, unique
is_libur          BOOLEAN default 0
keterangan        VARCHAR nullable    -- "Idul Fitri", "cuti bersama"
dibuat_oleh       -> employees.id
created_at, updated_at

INDEX (date)
```

- Dibuat **staf pusat / superuser**, sebulan sebelumnya.
- Minggu otomatis `is_libur = 1`.
- **Berlaku nasional** (keputusan sementara — lihat §11 poin 1).

### 3.2 `transaction_opening_balances` — nasabah lama bawa saldo

Meniru pola `transaction_white_offs` (relasi `hasOne`, bukan kolom flag di pinjaman).

```
id
transaction_loan_id                      -> transaction_loans.id, unique
transaction_loan_officer_grouping_id     -> cap kelompok, seperti white_off
berlaku_bulan     DATE      -- tgl 1 bulan masuk sistem, mis. 2026-08-01
nominal           BIGINT    -- SUDAH TERBAYAR sebelum masuk sistem
user_input        -> employees.id
catatan           TEXT nullable
created_at, updated_at

INDEX (transaction_loan_id), INDEX (transaction_loan_officer_grouping_id, berlaku_bulan)
```

**Aturan yang melekat:**

1. Pinjaman yang punya baris di sini **dikecualikan dari SEMUA penjumlahan drop**,
   di bulan mana pun — termasuk bulan `drop_date`-nya sendiri.
2. Ikut dikecualikan dari potongan **do11 (11%)** dan **titipan9 (9%)**, karena tidak
   ada uang yang benar-benar keluar.
3. **Tidak membuat baris angsuran apa pun** → storting otomatis tidak terpengaruh,
   tanpa perlu penyaringan di mana pun.
4. Pinjaman ini **tidak kelihatan di buku bulan mana pun sebelum `berlaku_bulan`**.
   `drop_date` tetap dipakai untuk menentukan **embernya**, bukan untuk menentukan
   sejak kapan dia muncul.
5. `nominal` diperlakukan sebagai **saldo pembukaan** — sudah terpotong sebelum
   `berlaku_bulan`, jadi di bulan masuk dia langsung tampil dengan sisa saldo yang
   benar tanpa ada pergerakan di tengah bulan.

**Contoh.** Bu Ani pinjam Feb 2026, drop 1.000.000 (pinjaman jadi 1.300.000),
sudah bayar 900.000, sisa 400.000. Diinput Agustus 2026.

```
transaction_loans     : drop_date=2026-02-09, nominal_drop=1.000.000,
                        pinjaman=1.300.000 (generated), status=success
opening_balance       : berlaku_bulan=2026-08-01, nominal=900.000

Hasil:
  saldo Bu Ani            = 1.300.000 - 900.000 = 400.000   ✓
  ember                   = ML (drop Feb, > 4 bulan)        ✓
  drop Februari           = TIDAK naik                       ✓
  drop Agustus            = TIDAK naik                       ✓
  do11 / titipan9         = TIDAK muncul                     ✓
  storting Agustus        = TIDAK naik (tak ada baris angsuran) ✓
  sirkulasi Agustus       = naik 400.000                     ✓
  buku Feb s/d Juli       = Bu Ani TIDAK ADA                 ✓
```

### 3.3 `transaction_loan_mutations` — mutasi nasabah

```
id
transaction_loan_id       -> transaction_loans.id
from_grouping_id, from_hari
to_grouping_id,   to_hari
berlaku_bulan     DATE      -- tgl 1 bulan berlaku
berlaku_sampai    DATE nullable  -- diisi otomatis kalau ada mutasi berikutnya
saldo_saat_mutasi BIGINT    -- dibekukan, bukti serah terima
user_input        -> employees.id
catatan           TEXT nullable
created_at, updated_at

INDEX (to_grouping_id, to_hari, berlaku_bulan, berlaku_sampai)
INDEX (transaction_loan_id, berlaku_bulan)
```

**`transaction_loans.transaction_loan_officer_grouping_id` TIDAK PERNAH DIUBAH.**
Ini yang menjamin angka drop tetap milik mantri lama dan buku bulan lampau utuh.

**Cara membacanya:**

```
isi kelompok B hari H pada bulan M =
      pinjaman WHERE grouping_id = B AND hari = H          (basis, seperti sekarang)
    − yang punya mutasi KELUAR berlaku ≤ M
    + yang punya mutasi MASUK ke B/H berlaku ≤ M (dan belum pindah lagi)
```

Karena baris mutasi cuma ada untuk pinjaman yang benar-benar pernah pindah,
dua bagian koreksi itu ringan. Basisnya tetap query cepat yang sekarang.

**Granularitas: per nasabah.** Untuk mutasi borongan (satu hari dipangkas habis),
UI menyediakan "centang semua", tapi barisnya tetap satu per nasabah.

**Efek samping yang otomatis benar:**

- Sirkulasi kelompok asal turun, kelompok tujuan naik — karena isi daftarnya berubah.
- Ember bulan drop ikut terbawa apa adanya (drop Juni tetap masuk baris Juni),
  karena `drop_date` tidak diubah. Umur pinjaman **tidak reset**.
- Setoran lama tetap tercatat di kelompok lama, karena
  `transaction_loan_instalments` punya cap kelompoknya sendiri.

**Yang perlu diubah:** saat mantri baru menagih, angsuran baru harus dicap
kelompok **tujuan**. Sekarang cap itu disalin dari kolom pinjaman — harus diubah
supaya membaca hasil mutasi.

### 3.4 `transaction_daily_closings` — agregat HARIAN (arus)

```
id
transaction_loan_officer_grouping_id
date

-- ARUS hari itu (dihitung dari sumber saat pengesahan)
drop                BIGINT
storting            BIGINT
storting_month1     BIGINT
storting_month2     BIGINT
storting_ccm        BIGINT
storting_cm         BIGINT
storting_mb         BIGINT
storting_ml         BIGINT
pemutihan           BIGINT

-- INPUT MANUAL harian (bebas diubah SEBELUM terkunci)
kasbon              BIGINT   -- modal harian mantri (BUKAN kasbon bulanan)
transport           BIGINT
masuk, keluar       BIGINT
target              BIGINT
target_on           DATE     -- dari tanggal berapa target ini ditetapkan

-- KALKULASI TERSIMPAN (biar penjumlahan tinggal tambah, tanpa rumus)
do11                BIGINT   -- round(drop * 0.11)
titipan9            BIGINT   -- round(drop * 0.09)
debit               BIGINT   -- do11 + kasbon + storting
kredit              BIGINT   -- drop + transport
tunai               BIGINT   -- debit - kredit

-- PENGESAHAN
kepala_approval_at, kepala_approval_user
kasir_lock_at,      kasir_lock_user     -- terisi = SELURUH baris beku

created_at, updated_at

UNIQUE (transaction_loan_officer_grouping_id, date)
INDEX  (date, kasir_lock_at)
```

**Catatan:**

- **Tidak ada kolom sirkulasi di sini** — sirkulasi urusan bulanan.
- **Tidak ada kolom `hari`** — sudah tersirat dari `date`.
- `sharingdo` dari tabel lama **tidak dibawa** (kolom mati, cuma nongol di `$fillable`).
- Barisnya **dibuat massal** begitu kalender bulan depan ditetapkan, jadi tanggal itu
  pasti ada walau drop & storting masih nol — karena kasbon & transport toh selalu ada.

### 3.5 `transaction_monthly_closings` — agregat BULANAN (arus + saldo)

```
id
transaction_loan_officer_grouping_id
hari                    -- per hari tagih (senin..sabtu)
periode                 DATE  -- tgl 1, mis. 2026-08-01

-- SALDO AWAL (hasil pergeseran dari saldo akhir bulan lalu)
awal_month1, awal_month2, awal_ccm, awal_cm, awal_mb, awal_ml   BIGINT
awal_total                                                       BIGINT
awal_ml_belum_terinput                                           BIGINT

-- ARUS (dijumlah dari transaction_daily_closings)
drop                    BIGINT
storting                BIGINT
storting_month1 .. storting_ml                                   BIGINT
pemutihan               BIGINT
saldo_masuk             BIGINT  -- dari transaction_opening_balances bulan ini
mutasi_masuk            BIGINT  -- saldo yang masuk lewat mutasi
mutasi_keluar           BIGINT  -- saldo yang keluar lewat mutasi

-- SALDO AKHIR (dihitung)
akhir_month1 .. akhir_ml, akhir_total                            BIGINT

-- KALKULASI
do11, titipan9, debit, kredit, tunai                             BIGINT

-- PENGESAHAN BULANAN
kepala_approval_at, kepala_approval_user
kasir_lock_at,      kasir_lock_user

created_at, updated_at

UNIQUE (transaction_loan_officer_grouping_id, hari, periode)
INDEX  (periode, kasir_lock_at)
```

`awal_ml_belum_terinput` adalah **satu-satunya angka yang masih ditetapkan manual**
di seluruh sistem baru. Lihat §7.

---

## 4. Enam ember — dan kenapa cara lama tidak bisa dipakai

### 4.1 Pembagian yang benar

```
selisih = bulan(angsuran.transaction_date) − bulan(pinjaman.drop_date)

  selisih 0    → month1
  selisih 1    → month2
  selisih 2    → ccm
  selisih 3    → cm
  selisih 4    → mb
  selisih ≥ 5  → ml
```

### 4.2 Kenapa TIDAK boleh pakai kolom `status` di angsuran

`AppHelper::generateStatusAngsuran()` (`AppHelper.php:239`) yang mencap `status`
cuma menghasilkan **4 nilai**:

```php
selisih < 3   → 1     ← melahap selisih 0, 1, DAN 2 sekaligus
selisih == 3  → 2     (cm)
selisih == 4  → 3     (mb)
selisih > 4   → 4     (ml)
```

Nilai `1` menggabung `month1` + `month2` + `ccm`. Jadi `WHERE status = ...`
**secara struktur tidak mungkin** memisahkan tiga ember pertama. Itu sebabnya
`RekapTrait` cuma pernah menanyakan status 2, 3, 4.

### 4.3 Masalah lain di fungsi ember yang ada

| Fungsi | Baris | Masalah |
|---|---|---|
| `generateStatusAngsuran()` | 239 | 4 nilai untuk 6 ember |
| `generateStatusAngsuranString()` | 261 | granularitas sama, duplikat |
| `generateStatusAngsuranString2()` | 283 | pakai nama `n1`/`normal`, tidak nyambung dengan kolom `month1_amount`/`month2_amount`; **`selisih == 0` tidak punya cabang**, jatuh ke `return "normal"` di ujung |

Tiga fungsi memetakan hal yang sama dengan pembagian berbeda → pasti melenceng
satu sama lain.

### 4.4 Aturan untuk sistem baru

1. Ember **dihitung saat penguncian** langsung dari `drop_date` vs `transaction_date`.
   Keduanya permanen → hasilnya selalu sama, bisa dihitung ulang kapan saja.
2. **Satu fungsi saja** yang jadi acuan pembagian ember.
3. Kolom `status` di `transaction_loan_instalments` **dibiarkan apa adanya** —
   jangan diubah, jangan dihapus, masih dipakai alur lama.

---

## 5. Flow HARIAN

```
┌─ H-30 ────────────────────────────────────────────────────┐
│ Staf pusat menetapkan work_days bulan depan                │
│   → Minggu otomatis libur, tanggal merah ditandai          │
└────────────────────────┬───────────────────────────────────┘
                         ↓
┌─ saat kalender ditetapkan ────────────────────────────────┐
│ Sistem membuat transaction_daily_closings MASSAL           │
│   satu baris per (kelompok × hari kerja), semua nol        │
│   → tanggal PASTI ADA walau nanti tidak ada transaksi      │
└────────────────────────┬───────────────────────────────────┘
                         ↓
┌─ sepanjang hari ──────────────────────────────────────────┐
│ Mantri/kasir mengisi: kasbon, transport, masuk, keluar     │
│ target sudah terisi dari ceklist minggu lalu               │
│ Transaksi drop & angsuran berjalan seperti biasa           │
│   → BEBAS diubah                                           │
└────────────────────────┬───────────────────────────────────┘
                         ↓
┌─ tutup hari, tahap 1: KEPALA ─────────────────────────────┐
│ Sistem menghitung ulang DARI SUMBER:                       │
│   drop     = SUM(nominal_drop) pinjaman success tgl itu    │
│              KECUALI yang punya opening_balance            │
│   storting = SUM(nominal) angsuran tgl itu                 │
│   storting_month1..ml = dipecah per selisih bulan          │
│   do11, titipan9, debit, kredit, tunai                     │
│ Kepala approve → kepala_approval_at terisi                 │
│   → MASIH bisa diubah                                      │
└────────────────────────┬───────────────────────────────────┘
                         ↓
┌─ tutup hari, tahap 2: KASIR (GEMBOK) ─────────────────────┐
│ Syarat:                                                    │
│   ✓ kepala sudah approve                                   │
│   ✓ baris rekap SEBELUMNYA (yang ada) sudah terkunci       │
│     ATAU ini hari pertama sejak branches.mulai_pendataan_baru │
│ Kasir kunci → kasir_lock_at terisi                         │
│   → SELURUH BARIS BEKU, PERMANEN                           │
└────────────────────────────────────────────────────────────┘
```

### 5.1 Yang beku begitu `kasir_lock_at` terisi

```
❌ baris transaction_daily_closings tidak bisa di-update sama sekali
❌ angsuran bertanggal itu tidak bisa dibuat / dihapus / diubah
❌ status pinjaman yang mengubah drop tanggal itu tidak bisa diubah
❌ pinjaman yang drop_date-nya tanggal itu tidak bisa dihapus
```

**Keempatnya wajib dijaga.** Kalau cuma barisnya yang dibekukan sementara angsuran
masih bisa ditambah, angka terkunci langsung tidak cocok lagi dengan sumbernya.

**Penjaganya di HOOK MODEL, bukan controller** — supaya menu baru mana pun otomatis
ikut terjaga tanpa perlu ingat mengeceknya:

- `TransactionLoanInstalment::creating/updating/deleting`
- `TransactionLoan::updating` (status ke/dari `success`), `TransactionLoan::deleting`

### 5.2 Rantai penguncian

> Tanggal 1 dikunci ✓ → tanggal 2 lupa dikunci → **tanggal 3 tidak bisa dikunci**.
> Mau kunci tanggal 3, harus kunci tanggal 2 dulu.

Ini **disengaja**, supaya tidak ada hari yang terlewat. Skalanya terkendali:
1 kantor × 10 mantri × 23 hari kerja ≈ **230 penguncian/bulan**.

Karena tidak setiap hari kalender punya baris, aturannya dibaca
**"baris rekap sebelumnya yang ADA"**, bukan "tanggal kemarin persis".

Disarankan ada satu tampilan pemantau: **"tanggal terlama yang belum dikunci,
per kelompok"** — supaya yang tertinggal ketahuan hari itu juga.

### 5.3 Yang TIDAK menghalangi penguncian

**Selisih kas fisik.** Kalau uang di kasir tidak sama dengan `tunai` hasil hitungan,
selisihnya ditangani **pembukuan kasbon bulanan yang terpisah** (mantri menutup
kekurangannya). Penguncian tetap jalan — kalau tidak, rantai jadi sandera masalah
yang penyelesaiannya ada di buku lain.

> Catatan istilah: `kasbon` di tabel ini = **modal harian mantri**.
> Berbeda dengan **kasbon bulanan** yang menutup selisih kas.

### 5.4 Unlock

**Yang berhak:** role `stafkontrol`, `pusat`, `superuser`.

Dicatat di `transaction_lock_histories`: siapa membuka, kapan, alasannya, kapan
dikunci ulang.

**Tidak perlu membuka hari-hari sesudahnya**, karena angka yang disimpan adalah
**arus per hari** — storting tanggal 8 tidak dihitung dari tanggal 7.

**Satu pengecualian:** kalau koreksinya menghapus pinjaman yang angsurannya menjulur
ke hari-hari yang masih terkunci, hari-hari itu harus ikut dibuka. Aplikasi wajib
**mendeteksi dan menyebutkan tanggal mana saja yang perlu dibuka** sebelum eksekusi,
bukan gagal di tengah jalan.

---

## 6. Flow BULANAN

### 6.1 Kapan dibuat

Baris bulanan dibuat **saat hari kerja terakhir bulan itu dikunci** — jadi lahir
sudah final. Bulan berjalan tetap bisa dipantau lewat penjumlahan langsung dari
`transaction_daily_closings`, tapi tabel bulanan hanya berisi angka yang sudah final.

### 6.2 Rantai antar bulan

```
akhir_total bulan Agustus  ==  awal_total bulan September
```

Kalau tidak sama → ada yang salah, dan ketahuan **hari itu juga**.

### 6.3 Pergeseran ember (PENTING — gampang salah)

Saldo akhir sebuah ember **bukan** jadi saldo awal ember yang sama bulan depan.
Embernya **naik kelas**:

```
akhir Agustus month1  →  awal September month2
akhir Agustus month2  →  awal September ccm
akhir Agustus ccm     →  awal September cm
akhir Agustus cm      →  awal September mb
akhir Agustus mb      →  awal September ml
akhir Agustus ml      →  awal September ml      ← mentok, ml tetap ml
awal September month1 =  0, diisi drop bulan September
```

Pergeseran ini sekaligus jadi **alat periksa**: saldo tiap ember bulan depan bisa
ditebak dari bulan ini. Kalau meleset, berarti ada pinjaman yang embernya lompat
atau ada data yang tidak wajar (mis. `drop_date` diubah belakangan).

### 6.4 Rumus saldo akhir

```
akhir_total = awal_total
            + (drop × 1.3)          ← pintu masuk lama
            + saldo_masuk           ← PINTU MASUK BARU (nasabah lama)
            + mutasi_masuk
            − mutasi_keluar
            − storting
            − pemutihan
```

Bandingkan dengan rumus sekarang di `RekapTrait.php:204` yang cuma punya
`sirkulasi_awal + (drop × 1.3) − storting`.

### 6.5 Ukuran

```
harian  : 1.590 kelompok × ~25 hari kerja  ≈ 40.000 baris / bulan
bulanan : 1.590 kelompok × 6 hari tagih    ≈  9.500 baris / bulan
```

Dashboard 131 kantor untuk satu bulan = menjumlahkan **9.500 baris**, bukan
1,95 juta pinjaman + 11,7 juta angsuran. Untuk setahun = 114.000 baris — masih
ringan, jadi **tidak perlu tabel tahunan**.

---

## 7. Ember ML — dua sumber yang tidak pernah dijodohkan

### 7.1 Masalahnya

Ember ML punya dua sumber yang berjalan sendiri-sendiri:

| | dari mana | dipakai di mana |
|---|---|---|
| `transaction_sirculations.ml_amount` | diisi tangan, dibawa bulan ke bulan | **angka sirkulasi awal** di Buku Storting |
| saldo pinjaman ember ML | dihitung dari data | **daftar nasabahnya** di Buku Angsuran |

Di halaman yang sama, **judul angkanya dari sumber A, daftar barisnya dari sumber B**,
dan tidak ada mekanisme yang memaksa keduanya bertemu.

Hasil pemeriksaan 426 pasangan (kelompok, hari) untuk Agustus 2026:

```
ml_amount = 0 TAPI ada pinjaman ML   :  48 pasangan → Rp   657.618.000 tak terwakili
ml_amount LEBIH BESAR dari data      : 186 pasangan → Rp 6.190.766.889
ml_amount LEBIH KECIL dari data      :  75 pasangan → Rp   310.115.000
cocok / dua-duanya nol               : 117 pasangan
```

### 7.2 Jalan keluar: ubah ARTI-nya, bukan datanya

```
SEKARANG : sirkulasi ML = ml_amount                        (dianggap SELURUH ML)
NANTI    : sirkulasi ML = saldo ML dari data nyata
                        + awal_ml_belum_terinput           (sisa yang orangnya belum masuk)
```

Yang berubah karena perubahan arti ini:

1. **Kasus "0 tapi ada orangnya" berhenti jadi kejanggalan.** Dengan arti baru,
   `awal_ml_belum_terinput = 0` berarti "semua ML sudah terinput" — justru keadaan
   akhir yang dituju.
2. **Angkanya mengoreksi diri.** Tiap nasabah lama diinput, sisi terhitung naik,
   sisa yang belum terinput turun sebesar itu. Total tidak berubah, tapi porsi yang
   bisa dipertanggungjawabkan makin besar.
3. **Selisihnya jadi punya nama dan terukur** — bukan lagi "entah kenapa tidak cocok".

### 7.3 Stock-take saat migrasi (WAJIB)

Karena dua sumber itu sudah menyimpang **dua arah**, angka lama tidak bisa dipakai
apa adanya. Di titik migrasi tiap kantor:

```
saldo ML dari data nyata   = X   (dihitung sistem)
ml_amount lama             = Y   (angka berjalan)
awal_ml_belum_terinput     = ?   (DITETAPKAN kantor — BUKAN Y − X otomatis)
```

Sengaja ditetapkan manual. Kalau `Y` sendiri sudah salah — dan datanya bilang begitu
untuk 29% kasus — menghitung otomatis cuma memindahkan kesalahan lama ke sistem baru
dengan wajah baru.

---

## 8. Flow MIGRASI per kantor

```
┌─ 1. Kantor dinyatakan siap ───────────────────────────────┐
│ branches.mulai_pendataan_baru = 2026-09-01                │
│   → jadi jangkar rantai penguncian                        │
└────────────────────────┬───────────────────────────────────┘
                         ↓
┌─ 2. Stock-take ML ────────────────────────────────────────┐
│ Sistem tampilkan: saldo ML dari data (X) vs ml_amount (Y) │
│ Kantor menetapkan awal_ml_belum_terinput                   │
└────────────────────────┬───────────────────────────────────┘
                         ↓
┌─ 3. Saldo awal bulan pertama ─────────────────────────────┐
│ awal_month1..awal_ml diisi dari perhitungan data nyata     │
│ awal_ml_belum_terinput dari langkah 2                      │
└────────────────────────┬───────────────────────────────────┘
                         ↓
┌─ 4. Mulai alur baru ──────────────────────────────────────┐
│ work_days ditetapkan → daily_closings dibuat massal        │
│ Menu approval/kunci versi baru aktif untuk kantor ini      │
│ transaction_daily_recaps BERHENTI ditulis untuk kantor ini │
└────────────────────────┬───────────────────────────────────┘
                         ↓
┌─ 5. Input nasabah lama, bertahap ─────────────────────────┐
│ Tiap nasabah ML diinput lewat transaction_opening_balances │
│ awal_ml_belum_terinput diturunkan sebesar saldonya         │
│ Laporan rekonsiliasi memantau: terinput vs sisa            │
└────────────────────────────────────────────────────────────┘
```

**Data sebelum `mulai_pendataan_baru` tidak disentuh sama sekali.** Tetap dibaca
dari `transaction_daily_recaps` & `transaction_sirculations` sebagai arsip.

**Rollout bertahap per kantor, tidak perlu serentak.** Untuk kantor yang belum
migrasi, `saldo_masuk` = 0 sehingga rumus baru menghasilkan angka yang **persis sama**
dengan rumus lama — jadi perbaikan rumus aman dipasang duluan untuk semua kantor.

---

## 9. Perubahan kode

### 9.1 Rumus sirkulasi — tambah pintu masuk

| Berkas | Baris | Perubahan |
|---|---|---|
| `app/Traits/RekapTrait.php` | 204 | `+ saldo_masuk` |
| `app/Traits/RekapTrait.php` | 586 | `+ saldo_masuk` |
| `app/Traits/RekapTrait.php` | 732 | `+ saldo_masuk` |

### 9.2 Pengecualian nasabah bawaan dari DROP

| Berkas | Baris |
|---|---|
| `app/Traits/PinjamanTrait.php` | 185-190 (`baru`, `lama`, `drop`, `drop_validate`) |
| `app/Traits/RekapTrait.php` | 77-82, 149, 174 |

### 9.3 Pengecualian dari potongan 11% & titipan 9% — **WAJIB, gampang kelewat**

| Berkas | Baris |
|---|---|
| `app/Traits/RekapTrait.php` | 168-169 (`$do11`, `$titipan9`) |

Kalau kelewat, tiap nasabah lama yang diinput memunculkan **potongan hantu**.

### 9.4 Perhitungan saldo — tambah suku `opening_balance`

Baris-baris yang **sudah** menangani `pemutihan`, tinggal ditambah satu suku
di sebelahnya:

| Berkas | Baris |
|---|---|
| `app/Traits/PinjamanTrait.php` | 322, 356, 384, 417, 550, 605 |

### 9.5 Pembagian ember

| Berkas | Baris | Perubahan |
|---|---|---|
| `app/Helpers/AppHelper.php` | 239, 261, 283 | Buat **satu** fungsi baru 6 ember dari selisih bulan. Tiga fungsi lama **dibiarkan** untuk alur lama. |

### 9.6 Penjaga gembok (BARU)

| Berkas | Hook |
|---|---|
| `app/Models/TransactionLoanInstalment.php` | `creating`, `updating`, `deleting` |
| `app/Models/TransactionLoan.php` | `updating` (status ke/dari `success`), `deleting` |

### 9.7 Cap kelompok pada angsuran baru

| Berkas | Baris | Perubahan |
|---|---|---|
| `app/Http/Controllers/TransactionLoanController.php` | 1089 | `transaction_loan_officer_grouping_id` dibaca dari hasil mutasi, bukan dari kolom pinjaman |

### 9.8 Yang SENGAJA tidak diubah

- `transaction_loans`, `transaction_loan_instalments` — **tidak ada kolom baru**
- Kolom `status` di angsuran — dibiarkan, masih dipakai alur lama
- `AppHelper::generateStatusAngsuran()` dan dua saudaranya — dibiarkan
- `transaction_daily_recaps` & `transaction_sirculations` — dibiarkan sebagai arsip
- Pelunasan otomatis top-up (`settled_by_loan_id`) — **tetap dihitung sebagai
  storting**. Jangan ditandai penyesuaian: di hari yang sama drop juga naik sebesar
  itu, keduanya saling meniadakan, kas tetap cocok. Kalau dikecualikan dari storting
  sementara drop tetap, rekapnya justru jadi pincang.

---

## 10. Urutan pengerjaan

| # | Langkah | Tergantung | Risiko |
|---|---|---|---|
| 0 | Setop cara lama: tidak ada lagi UPDATE `grouping_id` manual & drop palsu | — | — |
| 1 | Migrasi `transaction_opening_balances` | — | nol, tabel baru kosong |
| 2 | Fungsi pembagian 6 ember | — | nol, fungsi baru |
| 3 | Rumus sirkulasi + pengecualian drop/potongan/saldo | 1, 2 | rendah — kantor lama hasilnya identik |
| 4 | Menu input nasabah lama | 1, 3 | rendah |
| 5 | Laporan rekonsiliasi ML | 4 | nol, baca saja |
| 6 | `work_days` + kalender | — | rendah |
| 7 | `transaction_daily_closings` + gembok | 2, 6 | **tinggi** — menyentuh menu harian |
| 8 | `transaction_monthly_closings` | 7 | sedang |
| 9 | `transaction_loan_mutations` + menu mutasi | 7 | sedang |
| 10 | Dashboard global 131 kantor | 8 | rendah |

> **SEMUA MIGRASI DIBUAT & DIJALANKAN DARI `app_laravel`**, tidak pernah dari
> `unit-apps`. Database `ubmi_db` dipakai bersama dan tabel `migrations`-nya satu.

---

## 11. Yang BELUM diputuskan

1. **Kalender berlaku nasional atau bisa beda per kantor?** Menentukan `work_days`
   cukup satu baris per tanggal, atau harus per tanggal per kantor.
2. **Hari kerja nihil transaksi boleh dikunci?** Usulan: boleh — kasbon & transport
   tetap keluar. Kalau tidak boleh, rantai macet di hari sepi.
3. **Kalender terlanjur salah** (tanggal 17 ditulis hari kerja padahal libur, barisnya
   sudah dibuat) — dihapus atau ditandai libur tapi baris dibiarkan kosong?
4. **Mantri cuti / kelompok kosong** — barisnya tetap dibuat dengan nol, atau ada
   penanda "tidak beroperasi"? Berpengaruh ke rantai.
5. **Selisih kas fisik perlu meninggalkan jejak di rekap harian?** Misal satu kolom
   `selisih` yang isinya nol kalau pas. Tanpa itu, hari yang ada kekurangan
   Rp 300rb terkunci seolah tidak terjadi apa-apa.
6. **Ember dihitung per jarak bulan kalender atau per urutan setoran?** Dengan jarak
   kalender (cara sekarang), pinjaman drop 27 Februari kena cap `cm` di bulan Mei
   bukan karena menunggak, tapi semata karena drop-nya di ujung bulan. Perlu
   diputuskan apakah ketimpangan ini diterima.

---

## 12. Rujukan temuan

Angka-angka di dokumen ini hasil pemeriksaan langsung ke `ubmi_db` pada 2026-08-05:

- `transaction_daily_recaps` punya kolom rincian ember (`month1_amount`…`ml_amount`)
  tapi **0 dari 482.076 baris pernah terisi**
- **8.703** dari 129.587 rekap harian 2026 yang sudah di-approve kepala, angka
  `storting`-nya tidak cocok dengan hitung ulang dari angsuran (880 dari 1.129
  kelompok terdampak)
- **28.574** pinjaman cap kelompok angsurannya beda dari pinjamannya — **100% berasal
  dari grouping_id 331** (bekas transit mutasi manual), tersebar ke 834 tujuan.
  **0** di antaranya menyentuh jendela 5 bulan terakhir → zona hidup bersih
- **23.424** baris angsuran tanpa cap kelompok sama sekali, Rp 19.036.383.490,
  semuanya sebelum November 2025, ±1 baris per pinjaman (pola impor nasabah lama).
  Karena capnya kosong, baris-baris ini **tidak pernah terhitung sebagai storting** —
  cara lama itu tanpa sengaja sudah melakukan yang kita inginkan
- Auto-isi `drop`/`storting` ke rekap **sudah dicabut 2026-08-02**
  (lihat komentar `TransactionLoan.php:54-70` dan `TransactionLoanInstalment.php:37`)
- **1.269 dari 1.275** kelompok menagih **6 hari seminggu**, jadi rekap harian memang
  benar-benar harian
- Halaman `/pinjaman` untuk **satu** kelompok saat ini ±1,6 detik / 15 query —
  alasan kenapa dashboard global tidak mungkin tanpa tabel agregat
