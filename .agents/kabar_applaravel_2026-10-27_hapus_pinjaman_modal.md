# Kabar untuk sesi app_laravel — 2026-10-27

**unit-apps sekarang bisa menghapus baris `tb_capital_loans` (pinjaman modal) dari dashboard kasir.**

- Route: `DELETE dashboard-kasir/modal/pinjaman/{id}` (PembayaranKantorController::hapusPinjaman).
- Aturannya disalin dari app_laravel `TabunganController::destroyCapitalLoan`:
  - hanya jenis Pinjaman Modal (bukan Modal Awal);
  - hak input kantor; sumber `pusat` hanya `kasirpusat`;
  - bulan `loan_date` belum dikunci (`contribution_locks` module `modal`);
  - hanya transaksi TERAKHIR buku sumbernya (pinjaman vs angsuran, urut tanggal lalu created_at).
- Foto bukti `modal-pinjaman-bukti/{id}` ikut dihapus dari S3.
- Kartu Pinjaman Modal menampilkan "Tambah pinjaman bulan ini" (pinjaman ber-loan_date bulan itu).
- Tidak ada migrasi skema.

Kalau aturan hapus di app_laravel berubah, unit-apps perlu ikut diubah.
