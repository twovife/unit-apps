# Rombak Resort — Tahap 2 (Pratinjau, Terapkan, Batal) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Superuser bisa membuka draf rombak, melihat pratinjau yang dihitung server dari data asli, menerapkannya (pinjaman + transaksi bulan berjalan + rekening + MACET LAMA + closing + saldo awal + target pindah ke susunan baru), dan membatalkannya selama bulan itu belum ditutup — dengan bulan-bulan sebelumnya tetap utuh.

**Architecture:** Satu helper layanan `App\Helpers\RombakResort` (pratinjau / terapkan / batal) di atas fondasi tahap 1 (`Mutasi::catat`, `kelompokPada`, `hariPada`, `saring`). Controller `RombakResortController` menambah 3 endpoint; halaman `Admin/RombakResort.jsx` mengaktifkan tombol. Semua tulis dalam satu `DB::transaction`.

**Tech Stack:** Laravel 12, MariaDB 10.11, Inertia v1 1.3.0 + React.

**Spec:** `.agents/rombak_resort.md` (§3 K1–K17, §5, §7, §9, §10). Tahap 1: `.agents/rombak_resort_tahap1.md`, ledger `.superpowers/sdd/rombak_resort_tahap1/progress.md` (minor & ⚠️ yang ditandai tahap 2), audit `.superpowers/sdd/rombak_resort_tahap1/task-7-report.md` (T1–T4).

**Kasus uji utama:** draf #2 Babat 1 (branch 21, grouping kel 1–10), berlaku 2026-11-01, 58 baris peta, stash 0 — susunan buatan mas. Cadangan: `/home/supermario/backups/rombak_draf2_babat1_20261103.sql` (data-only dua tabel rombak). Babat 1: 3.144 pinjaman aktif, 46 MACET LAMA (NIK `ML00000000000001`), banyak resort pindah hari.

## Global Constraints

- Migrasi hanya dari app_laravel (`docker exec laravel-app php artisan migrate --force`); berkas migrasi yang belum rilis `2026_11_03_100000_create_rombak_resort_tables.php` di-AMEND (aturan satu migrasi terbaru), lokal: rollback dengan berkas ter-commit dulu, baru edit, lalu migrate, lalu rollback+migrate lagi.
- **Jangan `php artisan test`.** Cek = skrip tinker `scripts/cek_rombak_tahap2.php` (baru; pola sama dengan `scripts/cek_rombak_tahap1.php`: guard `app()->environment('local')`, `DB::beginTransaction()` … `finally DB::rollBack()`, tanpa komentar `//` di akhir baris kode; jalankan `grep -v '^\s*//' scripts/cek_rombak_tahap2.php | tr '\n' ' ' | docker exec -i unit-app php artisan tinker 2>&1 | grep -E "OK|GAGAL|Error"`).
- `scripts/cek_rombak_tahap1.php` harus tetap `SEMUA OK` sesudah tiap task.
- DB lokal = salinan prod 2026-11-02; prod tidak disentuh. Today = 2026-11-03 → bulan berjalan November; `Mutasi::catat` hanya menerima bulan berjalan.
- Stage per nama berkas; tidak commit `.agents/*`, `public/build`, `bootstrap/ssr`, `graphify-out`; tidak push. Pesan commit diakhiri `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Indent: Helpers & controller Rombak 4 spasi (ikuti berkasnya), Traits/TransactionLoanController 2 spasi, JSX 2 spasi.
- Keputusan mas: MACET LAMA ganda di satu resort tujuan **digabung jadi satu** (2026-11-03). Transaksi bertanggal mundur dicatat di kelompok saat tanggal itu (tahap 1).

---

### Task 1: "Hari Tidak Sama" membandingkan hari tagih pada tanggal itu (T1)

**Files:** `app/Http/Controllers/TransactionLoanController.php` (`bayar_pinjaman` ± 1592, `white_off_loan` ± 1717, `store_pengajuan_lama` ± 923, edit drop ± 1891–1894); `scripts/cek_rombak_tahap2.php` (baru).

Aturan: validasi yang sekarang `dateName(<tanggal>) == dateName(drop_date)` menjadi `dateName(<tanggal>) == Mutasi::hariPada($loan, <tanggal>)` (perbandingan huruf kecil). Edit drop: bandingkan dengan hari tagih pinjaman pada tanggal drop baru. Tanpa mutasi, `hariPada` = kolom `hari` = hari drop → perilaku sama.

- [ ] Buat `scripts/cek_rombak_tahap2.php` (kerangka + guard lokal + rollback). Cek gagal: `catat` satu pinjaman aktif Babat 1 dari resort Senin ke hari Rabu (berlaku bulan ini), lalu `bayar_pinjaman` headless (user 40) bertanggal Rabu minggu ini → harus diterima dan angsuran tercatat; bertanggal Senin minggu lalu (bulan lalu, sebelum pindah) → diterima di kelompok lama; bertanggal Senin minggu ini → ditolak "Hari Tidak Sama".
- [ ] Ubah 4 tempat. Cek `SEMUA OK`. Commit "Day-of-week checks use the loan's collection day at that date".

### Task 2: Kunci hari drop lampau memakai kelompok saat drop (T2)

**Files:** app_laravel migrasi `2026_11_03_100000_create_rombak_resort_tables.php` (trigger `tl_kunci_before_update` dan `tl_kunci_before_delete`); `app/Models/TransactionLoan.php` (hook `updating`/`deleting`, ± 69–79); `app/Helpers/AppHelper.php` (`hariDropTerkunci`, `canDeleteLoan`, ± 565, 629–639).

Aturan: setiap pengecekan kunci kasir/beku untuk **hari drop** pinjaman memakai kelompok **pada drop_date**: SQL `COALESCE((SELECT m.dari_grouping_id FROM transaction_loan_mutations m WHERE m.transaction_loan_id = OLD.id AND m.berlaku_bulan > OLD.drop_date ORDER BY m.berlaku_bulan, m.id LIMIT 1), OLD.transaction_loan_officer_grouping_id)`; PHP `Mutasi::kelompokPada($loan, $loan->drop_date)`. Pengecualian grouping-change dari tahap 1 tetap. Migrasi tetap `CREATE OR REPLACE TRIGGER`, guard teks, `ganti()` paling awal di `up()`, `down()` mengembalikan persis.

- [ ] Cek gagal: pinjaman yang dipindah (berlaku bulan ini) dengan drop bulan lalu di hari yang terkunci di kelompok LAMA: ubah `nominal_drop` → harus ditolak trigger (sekarang lolos karena memeriksa kelompok baru); hook `updating` membuka kunci kelompok lama, bukan baru (pakai user superuser login).
- [ ] Amend migrasi (urutan rollback-edit-migrate-rollback-migrate), ubah hook & AppHelper. Cek tahap 1 + tahap 2 `SEMUA OK`. Commit per repo: app_laravel "Rombak resort: drop-day locks follow the resort at drop date", unit-apps "Drop-day lock checks use the resort at drop date".

### Task 3: `RombakResort::pratinjau` + endpoint + tampilan pratinjau

**Files:** `app/Helpers/RombakResort.php` (baru), `app/Http/Controllers/RombakResortController.php`, `routes/web.php`, `resources/js/Pages/Admin/RombakResort.jsx`, `app/Models/TransactionResortRombak.php`.

**Produces:**
- `RombakResort::periksa(TransactionResortRombak $r): array` — daftar galat (string) yang memblokir terapkan: kantor belum migrasi (K16); `berlaku_bulan` ≠ bulan berjalan; bulan itu sudah ditutup (pakai penanda tutup bulan yang dipakai `GembokBulanan`/`TutupBulanan`); ada rombak `diterapkan` lain untuk kantor+bulan; peta masih punya stash (ke_* NULL); id kelompok bukan milik kantor; asal dobel.
- `RombakResort::pratinjau(TransactionResortRombak $r): array` — hanya baca. Isi: `galat` (dari `periksa`), `kotak` per resort tujuan {nasabah, saldo, lancar, cm, mb, ml} sesudah rombak (dari `HitungAgregat::portofolio` akhir M-1/ref M seperti papan), `pindah` per resort asal {aktif, open, acc}, `angsuran_m` (jumlah & nominal angsuran bulan M milik pinjaman yang pindah), `hari_dibuka` (daftar kelompok×tanggal M yang terkunci dan akan dibuka), `target` per resort tujuan yang berubah {tanggal_pertama, lama, baru} (K14: Σ round(nominal_drop × 0.13) pinjaman belum lunas & belum keluar target — pakai definisi "keluar target" yang sudah ada di kode, cari `out_date`/`KeluarTarget`), `macet_lama` per resort tujuan dengan >1 MACET LAMA {pilihan id yang dipertahankan, id yang dilebur, saldo}, `rekening` {ditimpa, bentrok}.
- Route `POST /rombak-resort/{rombak}/pratinjau` → JSON (atau Inertia partial) untuk dialog.
- UI: tombol **Submit / Preview** aktif bila stash kosong → simpan draf dulu (kalau berubah) lalu tampilkan dialog pratinjau (galat merah di atas; tabel per kotak; daftar MACET LAMA yang dilebur; hari yang akan dibuka; target lama→baru).

- [ ] Cek: pratinjau draf #2 → `galat` kosong; total `kotak` = total portofolio kantor; jumlah resort tujuan dengan >1 MACET LAMA sesuai data (hitung independen dengan kueri di skrip); stash buatan → galat "stash".
- [ ] Commit "Rombak Resort: server preview of a draft".

### Task 4: `RombakResort::terapkan`

**Files:** `app/Helpers/RombakResort.php`, `scripts/cek_rombak_tahap2.php`.

**Produces:** `RombakResort::terapkan(TransactionResortRombak $r, $user): array` (ringkasan). Satu `DB::transaction`, gagal → tidak ada yang berubah. Urutan (spec §7, dilengkapi temuan):

1. `periksa()` kosong, kalau tidak lempar `RuntimeException` dengan galat pertama.
2. Kumpulkan pinjaman per resort asal dari susunan lama (K4) dengan **`RombakResort::pinjaman()`** (Task 3) — jangan menulis ulang seleksinya. Termasuk pinjaman yang lunas di bulan M atau sesudahnya (`pay_off_date >= M`), karena masih bagian saldo awal M (ruling 2026-11-03); yang lunas sebelum M tidak ikut.
3. Buka kunci hari bulan M (tanggal ≥ M dan ≤ hari ini) yang terkunci kasir di kelompok asal & tujuan lewat `Gembok::buka` (alasan "rombak resort #id"), catat di ringkasan.
4. Untuk tiap pinjaman: `Mutasi::catat($loan, ke_grouping, ke_hari, M, "Rombak resort #id", $user, $r->id)`.
5. Pindah baris per-baris bulan M milik pinjaman itu ke kelompok baru: angsuran `transaction_date >= M`, white off `transaction_date >= M`, penyesuaian saldo `berlaku_bulan >= M` (menutup ⚠️ saldoMasuk tahap 1). Catat jumlah di ringkasan.
6. Rekening (`transaction_manage_customers`) pinjaman yang pindah: timpa grouping + `day` ke tujuan, aturan bentrok sama dengan pratinjau; kalau rekening tujuan sudah ada → jangan timpa dan pinjaman tetap menunjuk rekening lamanya (ruling 2026-11-03: pengajuan berikutnya otomatis memakai rekening tujuan yang sudah ada), catat bentrok. Simpan nilai lama di ringkasan (untuk batal).
7. MACET LAMA: per resort tujuan dengan >1 pinjaman MACET LAMA (aktif) → pertahankan satu (id terkecil, sama dengan pratinjau), lebur saldo yang lain ke dalamnya. `PenyesuaianSaldo::oper` TIDAK bisa dipakai apa adanya (memposting di bulan migrasi dan mensyaratkan satu resort di bulan itu): buat varian yang memposting pasangan penyesuaian **berlaku M** dengan jenis/arah yang sama seperti `oper` (sisi `dari` turun, sisi `ke` naik, total tetap), tanpa syarat resort bulan migrasi. Saldo 0 dilewati. Catat pasangan id penyesuaian di ringkasan (untuk batal).
8. Hitung ulang closing harian bulan M untuk semua kelompok asal & tujuan (jalur yang dipakai Gembok saat segarkan / HitungClosing), lalu saldo awal bulan M (`TutupBulanan::susun` untuk kelompok terkait, periode M) — saldo awal langsung susunan baru (K13).
9. Target (K14): untuk resort tujuan yang berubah, hari tagih pertama M (lompat libur, `WorkDay`; sama dengan `RombakResort` pratinjau) → target = rumus recount, `target_source='recount'`; kalau baris closing hari itu belum ada, buat (pola `GenerateClosingRows`); simpan target lama di ringkasan; hari-hari tagih sesudahnya yang sudah lahir dari rantai dihitung ulang dari angka itu (`TargetMingguan::hitung`). Resort yang tidak berubah tidak disentuh.
10. Status `diterapkan`, `diterapkan_oleh`, `diterapkan_at`, `ringkasan`.

- [ ] Cek (draf #2, di dalam transaksi uji, lalu rollback): sesudah terapkan —
  - setiap pinjaman pindah punya satu mutasi `rombak_id` = 2 dan kolomnya = tujuan;
  - `HitungAgregat::portofolio` bulan lalu per kelompok **sama persis** dengan sebelum; `harianBanyak` bulan lalu sama;
  - total portofolio kantor bulan M = sebelum;
  - semua angsuran bulan M pinjaman pindah berkelompok tujuan; tidak ada angsuran bulan lalu yang berubah kelompok;
  - tiap resort tujuan punya ≤ 1 MACET LAMA bersaldo > 0, total saldo MACET LAMA kantor tetap;
  - saldo awal bulan M per kelompok (`transaction_monthly_closings`) = jumlah blok kotaknya (papan);
  - target hari pertama resort berubah = rumus, `target_source='recount'`;
  - `scripts/cek_rombak_tahap1.php` tetap `SEMUA OK` (dijalankan terpisah).
- [ ] Ukur waktu terapkan untuk Babat 1; laporkan.
- [ ] Commit "Rombak Resort: apply a remap".

### Task 5: `RombakResort::batal` (§9)

**Produces:** `RombakResort::batal(TransactionResortRombak $r, $user): array`. Syarat: status `diterapkan`, bulan M belum ditutup. Membalik langkah 4–10 dari catatan (`transaction_loan_mutations` ber-`rombak_id`, `ringkasan`): buka kunci hari M, pinjaman & baris per-baris bulan M kembali ke kelompok lama (termasuk yang masuk sesudah penerapan), rekening dikembalikan, oper MACET LAMA dibalik (oper balik nominal yang sama), closing M & saldo awal M dihitung ulang, target dikembalikan dari ringkasan, hapus mutasi rombak itu, status `dibatalkan`. Pinjaman yang di-drop sesudah penerapan langsung di resort baru tidak dikembalikan (catat jumlahnya).

- [ ] Cek: terapkan lalu batal di transaksi uji → kolom pinjaman, kelompok angsuran/white off/penyesuaian, rekening, saldo MACET LAMA, target, saldo awal M, portofolio bulan lalu & bulan ini semuanya sama dengan sebelum terapkan; tabel mutasi kosong.
- [ ] Commit "Rombak Resort: undo an applied remap".

### Task 6: Endpoint + tombol Terapkan & Batal; terapkan sungguhan di lokal

**Files:** controller, routes, `RombakResort.jsx`.

- `POST /rombak-resort/{rombak}/terapkan` (superuser; konfirmasi ketik nama kantor di UI), `POST /rombak-resort/{rombak}/batal`.
- Rombak `diterapkan`/`dibatalkan` dibuka hanya-baca (papan terkunci, tampil ringkasan). Tombol Batal hanya untuk `diterapkan` & bulan belum tutup.
- Sesudah lolos: cadangkan dulu DB lokal tabel terdampak? Tidak perlu — `batal` adalah jalan pulang; tetapi sebelum terapkan sungguhan, simpan dump data-only `transaction_resort_rombaks`, `transaction_resort_rombak_peta`, `transaction_loan_mutations` (kosong) ke `/home/supermario/backups/`.
- [ ] Terapkan draf #2 **sungguhan** di DB lokal (tanpa rollback), lewat endpoint (tinker, user 40) — supaya mas bisa melihat hasilnya di Rekap 1/2, Rencana, Daftar Nasabah, buku storting (Oktober susunan lama, November susunan baru). Jalankan `PemeriksaAgregat::periksa(21, '2026-11-01')` dan laporkan.
- [ ] Commit "Rombak Resort: apply and undo from the menu".

### Task 7: Pemeriksa agregat (§10) + sisa minor tahap 1

- `PemeriksaAgregat` (dan pemeriksa sejenis: cari "awal" vs "akhir bulan lalu") untuk kantor+bulan yang punya rombak `diterapkan`: kesinambungan diperiksa di tingkat total kantor.
- Minor tahap 1 yang dibereskan: `Mutasi::catat` guard `hari` null; docblock `TransactionLoanMutation` (hapus `berlaku_sampai` dari penjelasan, kolom tetap); `TransactionLoan.php:239-240` (pelunasan topup mencap `kelompokPada($previous, drop_date)`); `PenyesuaianSaldo.php:294` (guard mencakup semua kelompok dalam riwayat mutasi); kolom `hari` Daftar Nasabah menampilkan hari pada bulan itu (`hariSql`); header skrip cek tahap 1 menyebut `grep -v`.
- [ ] Cek tahap 1 & 2 `SEMUA OK`. Commit "Aggregate checker and loose ends for resort remaps".

## Selesai tahap 2 bila

- Kedua skrip cek `SEMUA OK`.
- Draf #2 Babat 1 sudah diterapkan sungguhan di lokal; laporan pemeriksa agregat bersih (atau selisih dijelaskan).
- Belum ada push/deploy.
