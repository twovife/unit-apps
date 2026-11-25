# Rancangan: Rombak Resort

Status: **rancangan disepakati mas (2026-11-02), belum dikerjakan.**
Menggantikan arah "arus" di `agregasi_rekap.md` §8 (mutasi nasabah).

---

## 1. Latar

Kantor kadang menyusun ulang wilayah tarikannya di awal bulan. Tiga bentuk yang
terjadi di lapangan, semuanya dari mas:

1. **Gabung kelompok** (Sidoarjo 5, prod): 10 kelompok jadi 5 —
   kel 5 & 2 → kel 2, kel 9 & 10 → kel 5, dst. Satu kelompok utuh (6 hari)
   pindah ke kelompok lain di hari yang sama.
2. **Satu resort pindah**: kelompok 10 Senin digabung ke kelompok 1 Rabu.
   Semua sirkulasi K10 Senin ikut ke K1 Rabu. Harinya ikut berubah.
3. **Bongkar total**: 60 resort (10 kelompok × 6 hari) disusun ulang jadi
   30 resort baru (5 kelompok × 6 hari), seperti lego. Contoh:

   ```
   Kel 1  Senin   ← K3 Senin
          Selasa  ← K10 Sabtu
          Rabu    ← K1 Senin + K4 Jumat
          Kamis   ← K3 Kamis
          Jumat   ← K7 Jumat
          Sabtu   ← K1 Selasa + K2 Sabtu
   Kel 2  Senin   ← K2 Selasa + K2 Kamis
          ...
   ```

Syarat utama dari mas: **filter Oktober → nasabah tampil di kelompok lama;
filter November (bulan rombak) → nasabah tampil di kelompok baru.** Rekap
bulan sebelum rombak tidak boleh berubah.

## 2. Istilah

| Istilah | Arti |
|---|---|
| **Resort** | Satu (kelompok, hari). Kelompok 1 punya 6 resort: K1 Senin … K1 Sabtu. Satu resort = satu area tarikan. |
| **Resort asal** | Resort sebelum rombak (blok di menu). |
| **Resort tujuan** | Resort sesudah rombak (kotak di menu). |
| **Peta rombak** | Daftar `resort tujuan ← resort asal…` untuk satu kantor, berlaku mulai bulan M. |
| **Bulan berlaku (M)** | Bulan pertama susunan baru dipakai. Selalu tanggal 1. |

## 3. Keputusan

| # | Keputusan | Sumber |
|---|---|---|
| K1 | Satuan rombak = resort (kelompok × hari). | mas |
| K2 | Menu disusun dari sisi tujuan: kotak kelompok × hari, berisi blok resort asal. | mas |
| K3 | Satu tujuan boleh punya banyak asal (saldo dijumlah). Satu asal hanya ke satu tujuan. | mas / turunan |
| K4 | Semua perpindahan dihitung serentak dari susunan **sebelum** rombak. Rantai seperti K1 Sen→K1 Rab sambil K3 Sen→K1 Sen tidak memindah nasabah dua kali. | turunan |
| K5 | Resort yang tidak disebut tetap di tempatnya. Menu memberi peringatan (tidak memblokir) untuk resort yang tertinggal. | mas |
| K6 | **Cara B: timpa + catat.** Kolom kelompok & hari di `transaction_loans` diubah langsung; tiap perubahan dicatat di `transaction_loan_mutations`. | mas |
| K7 | Bulan sebelum M dibaca lewat catatan → tampil susunan lama. | mas |
| K8 | Superuser saja. Dipakai di laptop/PC. | mas |
| K9 | Drag-and-drop bawaan browser (tanpa library) + cara klik (klik blok, klik kotak). | mas / usul |
| K10 | Rancangan bisa disimpan sebagai **draf**. Alur: simpan draf → Submit → preview (server) → Submit lagi → berlaku. | mas |
| K11 | Isi blok: jumlah nasabah, saldo (sirkulasi), pecahan CM/MB/ML. | mas |
| K12 | Diterapkan telat (sesudah tgl 1 M): transaksi sejak tgl 1 M ikut pindah, closing harian M dihitung ulang, kunci kasir hari-hari itu dibuka. | mas |
| K13 | Saldo awal M per kelompok langsung susunan baru (bukan akhir M-1 + kolom mutasi). | mas |
| K14 | Target hari tagih pertama M untuk resort yang **berubah** = Σ round(nominal_drop × 13%) pinjaman yang belum lunas & belum keluar target. Ditandai `target_source = 'recount'`. Resort yang tidak berubah tetap memakai rantai. | mas |
| K15 | Bisa dibatalkan selama bulan M belum ditutup. | mas |
| K16 | Hanya kantor yang sudah migrasi (`mulai_pendataan_baru` terisi). | turunan |
| K17 | Pinjaman yang belum drop (`open`, `acc`) ikut pindah. | turunan |

## 4. Kenapa cara B (timpa), bukan A (arus)

Contoh: Bu Sri di K3 Senin, rombak November ke K1 Senin.

- **A (arus):** kolom pinjaman tetap K3. Setiap layar — input angsuran, buku
  storting mantri, target, rekap, Rencana, app_laravel — harus membaca catatan
  mutasi untuk tahu Bu Sri di K1. Fitur baru wajib ingat; lupa satu = angka
  salah diam-diam. Sampai sekarang baru 4 tempat yang sudah diajari.
- **B (timpa):** kolom pinjaman jadi K1. Semua layar bulan berjalan otomatis
  benar tanpa diubah. Hanya layar yang membuka **bulan lalu** yang perlu
  membaca catatan, dan jumlahnya sedikit (§8).

Kerja harian hampir semuanya di bulan berjalan, jadi B lebih kecil dan tidak
menjadi pajak permanen untuk fitur baru.

Yang membuat bulan lalu aman di B: banyak data sudah menyimpan kelompoknya
sendiri per baris (§8.1), jadi tidak ikut pindah saat kolom pinjaman ditimpa.

## 5. Model data

Semua migrasi ditulis & dijalankan dari **app_laravel** (aturan proyek), digabung
ke satu berkas migrasi terbaru yang belum di prod.

### 5.1 Tabel baru `transaction_resort_rombaks` (kepala)

| Kolom | Isi |
|---|---|
| `id` | |
| `branch_id` | Kantor. Wadah saja — isi peta memakai id kelompok (§11). |
| `berlaku_bulan` | Tanggal 1 bulan M. |
| `status` | `draf` / `diterapkan` / `dibatalkan` |
| `catatan` | Bebas. |
| `dibuat_oleh`, `diterapkan_oleh`, `dibatalkan_oleh` | employee id |
| `diterapkan_at`, `dibatalkan_at` | |
| `ringkasan` | JSON saat diterapkan: preview (jumlah nasabah, saldo per kotak) + `target_lama` per resort tujuan (untuk batal, K15). |
| timestamps | |

Satu kantor hanya boleh punya **satu** rombak `diterapkan` per bulan M.
Draf boleh banyak.

### 5.2 Tabel baru `transaction_resort_rombak_peta` (isi)

| Kolom | Isi |
|---|---|
| `rombak_id` | |
| `dari_grouping_id`, `dari_hari` | Resort asal. |
| `ke_grouping_id`, `ke_hari` | Resort tujuan. |

Unik: (`rombak_id`, `dari_grouping_id`, `dari_hari`) → menegakkan K3.
Baris yang `dari == ke` tidak disimpan (resort tidak pindah).

### 5.3 `transaction_loan_mutations` (sudah ada, 0 baris di prod)

Dipakai sebagai catatan per pinjaman. Tambah kolom `rombak_id` (nullable) supaya
batal tahu baris mana miliknya. `berlaku_bulan` = M, `dari_*` = susunan lama,
`ke_*` = susunan baru, `alasan` = "Rombak resort #id".

## 6. Menu

Route di bawah prefix superuser, misalnya `/rombak-resort`.

**Daftar:** rombak per kantor (draf / diterapkan / dibatalkan), tombol buat baru.

**Penyusun (draf):**

```
Sidoarjo 5 · berlaku mulai [Nov 2026]          [Simpan draf] [Submit]

          Senin          Selasa         Rabu         ...  Sabtu
Kel 1   ┌───────────┐  ┌───────────┐  ┌───────────┐
        │ K3 Sen    │  │ K10 Sab   │  │ K1 Sen    │
        │ 24 · 18jt │  │ 39 · 30jt │  │ K4 Jum    │
        │───────────│  │───────────│  │───────────│
        │ Σ 24·18jt │  │ Σ 39·30jt │  │ Σ 76·58jt │
        └───────────┘  └───────────┘  └───────────┘
...
Kel 10  (kosong)
```

- Awalnya setiap kotak berisi bloknya sendiri (susunan sekarang).
- Blok: label resort asal, jumlah nasabah, saldo, pecahan CM/MB/ML (K11).
  Angka diambil dari closing bulanan M-1 / `HitungAgregat::portofolio`
  per (grouping, hari) — sumber yang sama dengan rekap, bukan hitungan baru.
- Kotak: total blok di dalamnya.
- Pindah blok: drag bawaan browser, atau klik blok lalu klik kotak (K9).
- Blok bisa pindah ke hari lain.
- Peringatan non-blokir (K5): "K6 Senin: 45 nasabah tetap di kel 6".
- Hanya kelompok kantor itu yang tampil.

**Preview (Submit pertama):** server menghitung ulang dari data asli, bukan dari
angka di layar:
- total per kotak sesudah rombak;
- daftar resort yang pindah + jumlah pinjaman per status (aktif, open, acc);
- angsuran bulan M yang akan dipindah (kalau telat, K12);
- hari terkunci di bulan M yang akan dibuka;
- target recount per resort berubah (lama → baru);
- peringatan resort tertinggal.

**Submit kedua:** menerapkan (§7).

## 7. Penerapan

Satu `DB::transaction`. Urutan:

1. **Validasi.** Kantor sudah migrasi (K16); bulan M belum ditutup; tidak ada
   rombak `diterapkan` lain untuk kantor+M; semua id kelompok milik kantor ini;
   tiap resort asal hanya sekali (K3).
2. **Kumpulkan pinjaman** per resort asal dari susunan lama (K4): status
   `success` belum lunas (`pay_off_date` NULL), `open`, `acc` (K17). Lunas,
   keluar target, `gagal`, `tolak` tidak ikut — riwayatnya tetap di resort lama.
3. **Buka kunci** hari-hari bulan M yang terkunci kasir, untuk kelompok asal
   dan tujuan, lewat jalur resmi Gembok (dengan alasan "rombak resort #id").
   Wajib sebelum langkah 5: trigger `tli_kunci_before_update` menolak ubah
   angsuran di hari terkunci.
4. **Timpa pinjaman:** `transaction_loan_officer_grouping_id` dan `hari`.
   Catat satu baris `transaction_loan_mutations` per pinjaman (§5.3).
5. **Pindah transaksi bulan M** (hanya kalau diterapkan telat, K12):
   angsuran pinjaman-pinjaman itu dengan `transaction_date >= M` →
   kelompok baru. Tabel lain yang menyimpan kelompok per baris dan punya
   transaksi bulan M (`transaction_saldo_adjustments`, `transaction_white_offs`)
   diperlakukan sama — dicek saat implementasi.
6. **Hitung ulang closing harian bulan M** untuk semua kelompok asal & tujuan
   (pakai jalur yang sama dengan segarkan Gembok).
7. **Saldo awal bulan M** (`transaction_monthly_closings` M) dihitung ulang
   per kelompok dari susunan baru (K13).
8. **Target recount** (K14) di hari tagih pertama M (lompat libur) tiap resort
   tujuan yang berubah. Simpan nilai lama ke `ringkasan.target_lama` (per resort tujuan — satu tujuan bisa punya banyak baris peta).
   Kalau hari itu sudah lewat dan rantai sudah jalan, rantai minggu-minggu
   sesudahnya dihitung ulang dari angka recount.
9. Status rombak → `diterapkan`, simpan `ringkasan`.
10. Kabari sesi app_laravel (aturan proyek) — tabel bersama berubah.

## 8. Bulan lalu tetap susunan lama

### 8.1 Sudah aman (kelompok tersimpan per baris, tidak ditimpa)

- Storting: `HitungAgregat::storting` membaca `transaction_loan_instalments`
  per baris.
- Penyesuaian saldo: `transaction_saldo_adjustments` per baris.
- Closing harian/bulanan bulan lalu: angka tersimpan.

### 8.2 Harus dibetulkan (membaca kelompok dari kolom pinjaman)

| Tempat | Dampak kalau tidak dibetulkan |
|---|---|
| `HitungAgregat::drop` | Drop bulan lalu pindah ke kelompok baru saat closing bulan lalu dihitung ulang. |
| `HitungAgregat::portofolio`, `saldoMasuk` | Saldo bulan lalu per kelompok bergeser. |
| `RekapTrait::getRekapDuaData`, `getRekapPermantriData`, `getRencanaDropKepalaData` | Drop/rencana bulan lalu tampil di kelompok baru. |
| `PinjamanTrait::getTransactionLoan`, `getLoanByDate` (+ 3 pemakai `penyesuaianBaca`) | Nama nasabah bulan lalu tampil di kelompok baru. |
| `TransactionLoanController::dataDaftarNasabah` | Daftar Nasabah bulan lalu tampil di kelompok baru. |

Daftar ini hasil penyisiran awal; implementasi wajib menyisir ulang
(`grep transaction_loan_officer_grouping_id` + `hari` di kueri pinjaman) dan
juga **app_laravel** — belum diperiksa.

### 8.3 Caranya: helper `Mutasi` dibalik arahnya

Sekarang (arus): "kelompok efektif bulan R = tujuan mutasi terakhir yang sudah
berlaku, kalau tidak ada → kolom pinjaman."

Jadi (timpa): "kelompok **pada** bulan R = **asal** mutasi paling awal yang
`berlaku_bulan > R`, kalau tidak ada → kolom pinjaman."

```sql
COALESCE(
  (SELECT m.dari_grouping_id FROM transaction_loan_mutations m
    WHERE m.transaction_loan_id = l.id AND m.berlaku_bulan > :R
    ORDER BY m.berlaku_bulan ASC, m.id ASC LIMIT 1),
  l.transaction_loan_officer_grouping_id
)
```

Sama untuk hari (`dari_hari`). Rumusnya tetap satu tempat
(`Mutasi::ekspresiEfektifSql`, `ekspresiHariEfektifSql`, `kelompokEfektif`,
`hariEfektif`, `penyesuaianBaca`). Pemakai yang sudah ada otomatis benar;
tempat di §8.2 tinggal memakai helper yang sama. Untuk bulan berjalan dan
sesudahnya subkueri tidak menemukan apa-apa → kolom pinjaman, hasil sama
persis dengan sekarang. Selama tabel mutasi kosong, semua pembacaan identik
dengan hari ini.

Menu Mutasi Nasabah per pinjaman yang lama (`MutasiNasabahController`, arah
arus) tidak cocok dengan arah baru — dicabut dari menu, atau diubah memakai
penerapan yang sama (timpa + catat) untuk satu pinjaman. Diputuskan di tahap 1.

## 9. Batal (K15)

Hanya kalau status `diterapkan` dan bulan M belum ditutup. Satu transaksi:

1. Buka kunci hari bulan M yang terkunci di kelompok terkait.
2. Pinjaman di `transaction_loan_mutations` milik rombak ini → kembalikan
   kelompok & hari ke `dari_*`.
3. Angsuran (dan tabel per baris lain) bulan M milik pinjaman itu → kelompok
   lama. Termasuk angsuran yang masuk **sesudah** rombak diterapkan: angsuran
   itu tercatat di kelompok baru, ikut dikembalikan.
4. Pinjaman yang di-drop **sesudah** rombak langsung di resort baru tidak punya
   catatan mutasi → tidak dikembalikan. Preview batal menampilkan jumlahnya.
5. Closing harian M dihitung ulang, saldo awal M dihitung ulang, target
   dikembalikan dari `ringkasan.target_lama`.
6. Hapus baris mutasi milik rombak; status → `dibatalkan`.

## 10. Pemeriksa agregat

K13 membuat saldo awal M per kelompok ≠ saldo akhir M-1 per kelompok untuk
kantor yang dirombak. `PemeriksaAgregat` (dan pemeriksa sejenis) untuk kantor +
bulan yang punya rombak `diterapkan` memeriksa kesinambungan **di tingkat
total kantor** saja. Total kantor tetap sama karena rombak hanya di dalam satu
kantor.

## 11. Tidak dicakup

- **Pindah kantor / gabung kantor** — tidak sekarang, tapi kemungkinan akan
  ada. Pintunya dijaga terbuka:
  - `transaction_loans` tidak punya `branch_id`; kantor dibaca lewat kelompok.
    Pindah kantor = pindah ke kelompok milik kantor lain.
  - Peta & catatan memakai **id kelompok**, bukan nomor kelompok.
  - Yang nanti perlu: menu dua kantor, syarat keduanya migrasi, kunci & tutup
    bulan di dua kantor, pemeriksa total di tingkat gabungan (§10),
    `transaction_manage_customers` (menempel ke kelompok).
- Memecah satu resort ke beberapa tujuan (per nasabah).
- Membuat kelompok baru.
- Mengubah pembagian mantri ke kelompok.
- Kantor alur lama.

## 12. Risiko & yang belum diperiksa

- **`/pindah-resort` (`PindahResortController`) di prod** — GET, tanpa cek
  role: siapa pun yang login bisa memindah resort dan **seluruh** angsuran
  sepanjang sejarah ke kelompok lain, tanpa catatan untuk batal. Dihapus
  paling lambat saat menu ini jadi. Mas bisa minta dicabut lebih dulu.
- **app_laravel** — belum diperiksa layar mana yang membaca kelompok pinjaman
  untuk bulan lalu.
- `transaction_manage_customers` punya kolom kelompok — perlu diputuskan ikut
  ditimpa atau tidak (cek artinya saat tahap 1).
- Kantor besar: menimpa ribuan pinjaman + angsuran + hitung ulang closing satu
  bulan dalam satu transaksi — ukur waktu di salinan prod lokal sebelum rilis.
- Mantri kelompok yang dikosongkan masih punya akses ke kelompoknya — di luar
  cakupan (pembagian mantri), tapi perlu dikabarkan ke kantor.

## 13. Tahap

1. **Fondasi:** migrasi tabel (app_laravel), helper `Mutasi` dibalik, semua
   tempat §8.2 memakai helper. Uji: tanpa mutasi angka identik; dengan mutasi
   uji (transaksi di-rollback) bulan lalu tetap susunan lama.
2. **Penerapan + batal** (servis tanpa layar), diuji di salinan prod lokal
   dengan kasus Sidoarjo 5.
3. **Menu:** penyusun drag/klik, draf, preview, terapkan, batal.
4. **Pemeriksa agregat** (§10), cabut `/pindah-resort`, tentukan nasib menu
   Mutasi Nasabah lama, kabari app_laravel.
