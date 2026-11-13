# SKSW — Laporan Unit

Halaman baca-saja untuk melihat perputaran Simpanan Wajib (SW) dan Simpanan Khusus (SK) per karyawan di kantor aktif. Akses halaman dari **Administrasi Cabang → SKSW — Laporan Unit**. Kantor mengikuti GlobalBranchFilter, sedangkan pemilih bulan mengubah periode laporan.

## Alur

| Bagian | Implementasi |
|---|---|
| Halaman laporan | `GET /sksw/unit` → `SkswUnitController::index()` → `Pages/Sksw/Unit.jsx` |
| Data tabel | `SkswUnitController::reportForBranch()` membuat rekap saldo awal, debit/kredit bulanan, saldo akhir, dan breakdown transaksi untuk rekening yang memiliki transaksi pada periode atau saldo awal |
| Detail karyawan | Klik nama karyawan → axios `GET /sksw/{saving}/detail` → `SkswUnitController::detail()` → drawer menampilkan saldo kantor, histori transaksi 50 baris per halaman (termasuk pencatat dan batch), dan rekap bulanan |
| Scope kantor | `AuthScope::resolve()` membaca kantor aktif; backend memvalidasi lagi terhadap `Branch::getAllowedBranchIds()`. Parameter kantor dari browser tidak digunakan |
| Batas akses detail | Rekening harus memiliki relasi pada kantor aktif (rekening saat ini, transaksi, atau snapshot). Saldo, transaksi, dan rekap di drawer hanya berasal dari kantor tersebut |

## Perhitungan saldo awal

Untuk kantor dan periode yang dipilih, saldo awal memakai `saving_monthly_snapshots` periode sebelumnya apabila `saving_batches` periode sebelumnya berstatus `locked`. Jika batch sebelumnya tidak terkunci, saldo awal dihitung dari transaksi aktif (`voided_at IS NULL`) sebelum awal bulan. Saldo akhir tiap jenis adalah saldo awal + debit bulan berjalan − kredit bulan berjalan.

Semua agregasi transaksi dibatasi pada `branch_id` aktif dan rentang tanggal bulan yang dipilih. Baris laporan mengikuti urutan karyawan aktif terlebih dahulu, lalu jabatan, area, dan nama.

## Tabel bersama (dikelola `app_laravel`)

| Tabel | Penggunaan |
|---|---|
| `branches` | BACA: memvalidasi kantor aktif dan menampilkan nama kantor |
| `saving_batches` | BACA: mengetahui status batch periode dan menentukan sumber saldo awal |
| `saving_monthly_snapshots` | BACA: saldo awal dari batch terkunci dan otorisasi kepemilikan rekening |
| `saving_transactions` | BACA: saldo awal non-snapshot, agregat periode, histori, serta rekap bulanan; transaksi void dikecualikan dari perhitungan |
| `savings` | BACA: rekening tabungan/kunci rincian |
| `employees`, `employments` | BACA: nama, status kerja, jabatan, dan area untuk rincian |
| `users` | BACA: nama pencatat transaksi ditampilkan di rincian |

Model lokal `Saving`, `SavingBatch`, dan `SavingTransaction` hanya merupakan consumer model untuk tabel bersama. Tidak ada tabel/migrasi/seeder baru di `unit-apps`.

## Sengaja di luar cakupan

Tidak ada input cepat, mutasi rekening, pembatalan transaksi, maupun lock/unlock batch. Pengguna meminta laporan unit per kantor dengan rincian karyawan; semua route baru hanya membaca data.
