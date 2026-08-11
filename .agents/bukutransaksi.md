# Flow Buku Transaksi (`/bukutransaksi`)

Dokumen ini berisi catatan mengenai alur (flow) dan rute yang tersedia pada modul **Buku Transaksi** di aplikasi `unit-apps`.

Modul ini dikendalikan oleh `TransactionLoanController` dan dibatasi oleh middleware otorisasi untuk role: `superuser`, `pimpinan`, `kasir`, `mantri`, `kepala-mantri`, `pengawas`, dan `stafkontrol`.

## Daftar Rute dan Fungsinya

Berikut adalah rute-rute yang terdaftar di bawah *prefix* `/bukutransaksi` (dengan name prefix `transaction.`):

### 1. Halaman Utama
- **Method & Route**: `GET /bukutransaksi`
- **Controller Action**: `index_buku_transaksi`
- **Fungsi**: Menampilkan halaman utama Buku Transaksi (kemungkinan berisi daftar nasabah, rekap harian, atau pencarian transaksi berdasarkan cabang/kelompok/hari).

### 2. Pencarian Nasabah
- **Method & Route**: `POST /bukutransaksi/nik`
- **Controller Action**: `nasabah_buku_transaksi`
- **Fungsi**: Digunakan untuk mencari atau memvalidasi data nasabah berdasarkan NIK (biasanya dipanggil melalui AJAX/Axios saat menginput data).

### 3. Pembuatan Transaksi Baru (Single)
- **Method & Route**: `POST /bukutransaksi`
- **Controller Action**: `store_buku_transaksi`
- **Fungsi**: Menyimpan data transaksi atau pinjaman baru ke dalam sistem untuk satu nasabah.

### 4. Pembuatan Transaksi Cepat (Fast Create)
- **Method & Route**: `GET /bukutransaksi/fastcreate` & `GET /bukutransaksi/fastcreatev2`
- **Controller Action**: `fastcreatev2`
- **Fungsi**: Menampilkan halaman antarmuka atau modal khusus untuk melakukan input transaksi secara cepat (versi terbaru menggunakan `fastcreatev2`).

### 5. Input Pinjaman Macet
- **Method & Route**: `GET /bukutransaksi/inputmacet`
- **Controller Action**: `inputmacet`
- **Fungsi**: Halaman khusus untuk mencatat atau menandai pinjaman-pinjaman yang berstatus macet.

### 6. Pembuatan Transaksi Massal (Batch)
- **Method & Route**: `POST /bukutransaksi/batch`
- **Controller Action**: `store_buku_transaksi_batch`
- **Fungsi**: Menerima array data dan menyimpan banyak transaksi sekaligus dalam satu *request* (berguna untuk sinkronisasi atau input massal oleh Kasir/Mantri).

### 7. Aksi Transaksi (Action)
- **Method & Route**: `PUT /bukutransaksi/action/{transactionLoan}`
- **Controller Action**: `action_buku_transaksi`
- **Fungsi**: Memperbarui status atau melakukan aksi parsial pada satu data transaksi (misalnya setujui, tolak, bayar angsuran, dll).

### 8. Update Keseluruhan Transaksi
- **Method & Route**: `PUT /bukutransaksi/updateEverything/{transactionLoan}`
- **Controller Action**: `updateEverything`
- **Fungsi**: Memperbarui seluruh kolom data pada satu objek `TransactionLoan` yang spesifik (full update).

---
*Catatan ini akan digunakan sebagai ingatan agen mengenai struktur route pada `/bukutransaksi`.*
