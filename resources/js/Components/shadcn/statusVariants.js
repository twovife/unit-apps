/**
 * Peta warna status pengajuan -> varian AppBadge / AppButton.
 *
 * Ditaruh di modul sendiri (bukan di dalam salah satu komponen) supaya tidak
 * terjadi impor melingkar: BukuTransaksiKepala -> Action -> ActionTable, dan
 * ketiganya butuh peta yang sama.
 */

/**
 * Status pengajuan, kolom `transaction_loans.status`.
 * Nilai `null` di DB diperlakukan sebagai `open`.
 */
export const VARIAN_STATUS = {
  open: 'primary', // biru   - baru diajukan, menunggu ACC
  acc: 'warning', // kuning - sudah di-ACC, menunggu drop
  success: 'submission', // hijau  - drop jadi
  tolak: 'black', // hitam  - ditolak saat pemeriksaan
  gagal: 'danger', // merah  - gagal saat pencairan
};

/**
 * Jenis drop, dari `drop_langsung`:
 *   'baru' = drop langsung (melompati tahap ACC)
 *   'lama' = lewat pengajuan
 */
export const VARIAN_JENIS = {
  baru: 'warning',
  lama: 'ghost',
};

/** Ambil varian status dengan penanganan null + nilai tak dikenal. */
export const varianStatus = (status) =>
  VARIAN_STATUS[status ?? 'open'] ?? 'ghost';

/** Ambil varian jenis drop dengan penanganan nilai tak dikenal. */
export const varianJenis = (jenis) => VARIAN_JENIS[jenis] ?? 'ghost';
