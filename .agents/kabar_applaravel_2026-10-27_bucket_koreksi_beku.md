# Kabar untuk sesi app_laravel — 2026-10-27

**transaction_sirculations (bucket) bulan migrasi sekarang bisa berubah dari unit-apps.**

- Koreksi Data Beku (unit-apps, superuser) punya centang "Bucket serah terima ikut dikoreksi"
  (bawaan tercentang). Kalau dicentang, baris `transaction_sirculations` tanggal 1 bulan migrasi
  untuk kelompok x hari itu digeser sebesar dampak koreksi ke saldo awal:
  `amount` (Δ total), `cm_amount`, `mb_amount`, `ml_amount`; `updated_at` ikut berubah.
- Bucket bulan sebelum migrasi tidak pernah disentuh.
- Jejak: kolom `bucket_*` di `transaction_koreksi_beku.dampak` + Log::info.
- Data prod yang sudah diubah (susulan, koreksi mas 27 Okt malam), Lawang 3 bucket 2026-10-01:
  - kel 6 selasa (grouping 1486): amount 12.345.000 → 12.215.000
  - kel 2 senin (grouping 1482): amount 10.926.000 → 10.991.000, cm_amount 2.261.000 → 2.326.000
- Tidak ada migrasi skema.

Kalau app_laravel menganggap bucket bulan migrasi tidak pernah berubah sesudah dibuat
(cache, laporan, rekonsiliasi), mohon dicek.
