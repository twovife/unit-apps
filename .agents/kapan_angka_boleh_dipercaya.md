# Kapan angka agregasi boleh dipercaya

Status: final per 2026-11-24. Diverifikasi langsung ke basis data, bukan dibaca
dari kode saja. **Baca ini sebelum menulis kode apa pun yang membaca
`transaction_daily_closings` atau `transaction_monthly_closings`.**

Satu kalimat yang harus diingat:

> `transaction_daily_closings` hanya boleh dipercaya pada baris yang
> `kasir_lock_at`-nya terisi. Baris lain bisa berisi angka, dan angka itu bisa
> salah.

---

## 1. Siapa menulis apa

| Peristiwa | Yang berubah |
|---|---|
| Mantri input angsuran / drop | `transaction_loans`, `transaction_loan_instalments`. **Tidak** menyentuh tabel closing. |
| Kepala ACC (`kepala_approval_at`) | Hanya kolom itu. Angka tidak ditulis. |
| **Kasir kunci** (`kasir_lock_at`) | `ClosingHarianController::hitungUlangTurunan()` menulis drop & storting dari `HitungAgregat`, lalu barisnya dikunci. |
| Kasir buka kunci | `kasir_lock_at` dikosongkan, baris disegarkan sekali. |
| Kunci / buka hari mana pun | `susunBulanan()` jalan — lihat bagian 3. |

Tidak ada observer Eloquent dan tidak ada trigger basis data yang mengisi
drop/storting. Dicek 2026-11-24: `SHOW TRIGGERS` hanya memuat penjaga
(`tl_kunci_*`, `tli_kunci_*`, `tmc_kunci_*`, `two_beku_*`), bukan pengisi.
`tunai` satu-satunya kolom `STORED GENERATED`.

## 2. Baris yang belum terkunci bisa berisi angka — dan bisa salah

Jangan memakai "isinya bukan nol" sebagai tanda angka itu siap pakai.

Contoh nyata dari basis data lokal, kelompok 752, November 2026 (nol hari
terkunci di November):

```
tanggal      kunci  drop        dibuat               diubah
2026-11-02   -      1.600.000   05/11 12:56:45       05/11 12:56:45
2026-11-03   -      2.600.000   05/11 12:56:45       06/11 18:07:45
2026-11-04   -      1.500.000   05/11 12:56:45       06/11 18:12:24
```

Barisnya dibuat 5 November 12:56:45 — satu detik sebelum kunci **Oktober**
terakhir kelompok itu, 12:56:46. Yang mengisi bukan kunci November, melainkan
kunci hari Oktober (bagian 3).

Kolom `diubah` menunjukkan penyegaran berikutnya. Tanggal 3 terakhir disegarkan
6 November 18:07; kalau ada input untuk tanggal 3 pada tanggal 10, kolom itu
tetap 2.600.000 dan tidak ada yang memberi tahu.

Di November 2026 lokal: 33.834 baris, 23.391 terkunci, 10.443 belum. Dari yang
belum terkunci, **237 punya `drop > 0`** dan **446 punya `storting > 0`**.

## 3. Kenapa mengunci Oktober menyentuh `transaction_daily_closings` November

Karena `transaction_monthly_closings` **tidak** dihitung sendiri dari
transaksi. Arusnya dijumlah dari `transaction_daily_closings`:

```php
// TutupBulanan::arusDariHarian()
TransactionDailyClosing::query()
    ->whereBetween('date', [awal bulan, akhir bulan])
    ->groupBy(...)
    ->get([... SUM(`drop`), SUM(`storting`), SUM(`pemutihan`) ...]);
```

Rantainya:

1. Kunci 31 Oktober → saldo akhir Oktober berubah.
2. Saldo akhir Oktober = saldo awal November → `transaction_monthly_closings`
   periode November ditulis ulang.
3. Menulis ulang periode November = menjumlah `transaction_daily_closings`
   sepanjang November.
4. Supaya jumlahnya benar, baris November yang belum terkunci disegarkan dulu
   (`segarkanHariBelumTerkunci()`).

Loopnya berhenti di bulan berikutnya:
`$sampai = Carbon::now()->startOfMonth()->addMonthNoOverflow();`

`TutupBulanan` sengaja menjumlah **semua** hari, terkunci atau tidak — hari
yang terlewat tidak boleh hilang diam-diam. Itu sebabnya dia perlu menyegarkan
dulu. Pembaca lain tidak punya alasan itu.

## 4. Sesudah kunci dibuka, kolomnya menunggu

| Keadaan | Isi `transaction_daily_closings` | Yang tampil di rekap |
|---|---|---|
| sesudah dibuka, sebelum diubah | angka lama | dihitung langsung |
| sesudah angsuran/drop diubah | **angka lama, salah** | dihitung langsung, benar |
| sesudah dikunci lagi | ditulis ulang, benar | dibaca dari kolom |

Mengubah angsuran tidak memicu penulisan apa pun ke tabel closing. Baris itu
baru ditulis ulang kalau harinya dikunci lagi, atau ada hari lain di kelompok
dan bulan yang sama dikunci.

## 5. Aturan membaca yang benar

```
hari yang kasir_lock_at-nya TERISI  -> baca transaction_daily_closings
hari yang kasir_lock_at-nya KOSONG  -> hitung langsung lewat HitungAgregat,
                                       abaikan isi kolomnya
```

Rekap 2 (`RekapTrait::getDataRekapDua`) begitu. Rekap Sirkulasi Wilayah
(`AngkaRekapWilayah::alurBaru`) meniru persis, dengan satu perbedaan: batas
"mulai hitung langsung" ditentukan **per kantor**, bukan satu untuk seluruh
wilayah. Kalau disatukan, satu kantor yang tertinggal memaksa 31 kantor lain
dihitung ulang — diukur 2,66 detik untuk 19 hari di wilayah 1.

Gerbangnya `AgregasiScope::pakaiAgregatBaru($branchId, $periode)`. Per
2026-11-24, 140 kantor memakai `mulai_pendataan_baru = 2026-10-01`. Sebelum
tanggal itu alur lama: tabel closing tidak dipelihara, jadi membandingkannya
menghasilkan beda palsu.

## 6. "Terkunci" artinya apa, dan tidak artinya apa

Diuji 2026-11-24: seluruh baris terkunci Oktober & November dibandingkan dengan
hitungan ulang dari `transaction_loans` + `transaction_loan_instalments`.

```
2026-10-01 s/d 2026-10-31: terkunci=37.728  beda=0  selisih=Rp0
2026-11-01 s/d 2026-11-30: terkunci=23.391  beda=0  selisih=Rp0
```

61.119 baris, lima kolom per baris, nol beda. **Yang dibuktikan: angka beku
masih sama dengan sumbernya** — dan itu memang hampir pasti, karena trigger
`tl_kunci_before_update` menolak perubahan `status`, `nominal_drop`,
`drop_date`, dan pindah kelompok pada hari yang sudah terkunci. Jadi nol beda
itu bukti triggernya bekerja, bukan bukti angkanya benar.

Yang **tidak** dibuktikan, dan tidak bisa dibuktikan dari dalam sistem:

1. Transaksi yang tidak pernah diinput. Closing-nya nol beda terhadap sistem
   dan tetap kurang dari setoran sungguhan.
2. Transaksi yang salah sejak awal lalu dikunci — beku dalam keadaan salah,
   dan triggernya justru mempersulit pembetulan.
3. Kunci bisa dibuka. Superuser atau pemegang izin `lock-rekap` boleh buka,
   ubah, kunci lagi. Trigger juga mengizinkan pindah kelompok kalau ada
   barisnya di `transaction_loan_mutations`.

Kalimat yang tepat:

> Terkunci = angkanya tidak bisa bergerak diam-diam, dan sudah ditandatangani
> seseorang. Bukan "benar".

Satu-satunya pembanding dari luar sistem adalah laporan kasir lewat WA. Itulah
alasan Rekap Sirkulasi Wilayah menyimpan angka laporan **apa adanya** dan hanya
menandai selisihnya merah — kalau layar memaksa laporan cocok dengan sistem,
jejak kesalahannya hilang dan yang tersisa data rapi yang salah.

## 7. Kosakata

**Tabel** hanya untuk tabel basis data (`transaction_daily_closings`).
**Rekap** hanya untuk layar (Rekap 1, Rekap 2, Rekap Sirkulasi Wilayah).
Jangan menulis "baris bulanan" untuk entitas basis data — sebut nama tabelnya.

## Cara memeriksa ulang sendiri

```bash
# baris terkunci vs hitung ulang (butuh ditulis lagi; lihat bagian 6)
docker exec -u www-data -e HOME=/tmp unit-app php artisan tinker

# artisan di container JANGAN sebagai root: storage jadi milik root dan
# php-fpm galat "Permission denied". HOME=/tmp wajib, tanpa itu psysh menolak
# menulis /var/www/.config/psysh.
```
