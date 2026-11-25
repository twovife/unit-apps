# Kabar untuk sesi app_laravel — migrasi rombak resort (2026-11-02)

Commit app_laravel `d5d8f4d` (branch `develop`, belum di-push):
`database/migrations/2026_11_03_100000_create_rombak_resort_tables.php`

- Tabel baru `transaction_resort_rombaks` (kepala rombak per kantor + bulan berlaku, status draf/diterapkan/dibatalkan).
- Tabel baru `transaction_resort_rombak_peta` (resort asal -> resort tujuan).
- Kolom baru `transaction_loan_mutations.rombak_id` (nullable, index).

Sudah dijalankan di DB lokal saja. **Jangan dijalankan di prod** sampai fitur rombak resort (unit-apps) siap rilis.

Dampak ke app_laravel nanti: rombak menimpa `transaction_loans.transaction_loan_officer_grouping_id` + `hari` mulai bulan berlaku. Layar app_laravel yang membaca kelompok pinjaman untuk **bulan lalu** perlu membaca lewat `transaction_loan_mutations` (kelompok pada tanggal X = `dari_grouping_id` mutasi paling awal dengan `berlaku_bulan > X`, kalau tidak ada kolom pinjaman). Rancangan: unit-apps `.agents/rombak_resort.md`.
