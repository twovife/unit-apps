# Dokumentasi Alur: Form Pengajuan Pinjaman (1 Kolom Alamat)

Tanggal: 2026-10-16  
Pengembang / Asisten: Muvita  
Aplikasi: `unit-apps` (Ekosistem UBMI)  

---

## 1. Latar Belakang & Kebutuhan
Sebelumnya, form pengajuan pinjaman (`NewNasabah.jsx`) menampilkan dua field alamat terpisah:
- **Alamat KTP** (`alamat`)
- **Alamat domisili** (`residential_address`)

Hal ini membuat tampilan membingungkan dan redundan bagi mantri saat memasukkan pengajuan nasabah baru maupun lama.

User menginginkan:
> *"di pengajuan ini, alamat 1 kolom saja, jadi ketika itu nasabah baru, dia akan otomatis input 2 tabel, tapi klo nasabah lama dan alamatnya di timpa / diubah maka akan save alamat customer grouping tok"*

---

## 2. Logika Alur Bisnis

### A. Nasabah Baru (`isActiveMember == false`)
1. User menginputkan nama dan alamat pada 1 field **Alamat** (`name="alamat"`).
2. Backend secara otomatis menyimpan alamat tersebut ke **2 tabel**:
   - `transaction_customers.alamat` (tabel master identitas nasabah)
   - `transaction_manage_customers.residential_address` (tabel rekening customer grouping / per cabang & kelompok)

### B. Nasabah Lama (`isActiveMember == true`)
1. Saat NIK dicek via `nasabah_buku_transaksi`, field **Alamat** terisi otomatis dengan alamat nasabah yang ada (memprioritaskan domisili terakhir di cabang aktif, atau fallback ke alamat KTP).
2. Field **Alamat** tetap terbuka dan **dapat ditimpa / diubah** oleh user jika nasabah pindah tempat tinggal.
3. Jika alamat diubah / ditimpa:
   - Backend **HANYA** menyimpan perubahan alamat ke tabel `transaction_manage_customers.residential_address` (customer grouping).
   - Tabel master `transaction_customers.alamat` **TIDAK DIUBAH / TIDAK DISENTUH** sama sekali.

---

## 3. Rute & Controller Terdampak

| Method | URI | Controller & Method | Deskripsi |
|---|---|---|---|
| `POST` | `/transaction/nasabah-buku-transaksi` | `TransactionLoanController@nasabah_buku_transaksi` | Mengembalikan NIK, nama, dan alamat aktif (domisili cabang aktif atau alamat master KTP) |
| `POST` | `/transaction/store` | `TransactionLoanController@store` | Menyimpan pengajuan pinjaman: nasabah baru mengisi 2 tabel (`transaction_customers` & `transaction_manage_customers`); nasabah lama hanya mengupdate `transaction_manage_customers` |

---

## 4. Tabel Database Terlibat (`ubmi_db`)

| Tabel | Operasi | Kolom | Keterangan |
|---|---|---|---|
| `transaction_customers` | `BACA`, `TULIS` | `nik`, `nama`, `alamat` | Tabel master identitas nasabah; untuk nasabah lama, kolom `alamat` tidak diubah saat pengajuan baru |
| `transaction_manage_customers` | `BACA`, `TULIS` | `transaction_customer_id`, `transaction_loan_officer_grouping_id`, `day`, `residential_address` | Rekening nasabah per grouping; menyimpan domisili nasabah baru dan nasabah lama yang alamatnya ditimpa |
| `transaction_loans` | `TULIS` | Pinjaman baru | Record pengajuan pinjaman |
