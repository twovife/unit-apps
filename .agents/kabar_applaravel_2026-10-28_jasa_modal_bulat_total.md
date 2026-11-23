# Kabar untuk sesi app_laravel — 2026-10-28

**Aturan jasa pinjaman modal berubah (mas): pembulatan 1.000 sekarang di TOTAL per kantor, bukan per pinjaman.**

Kasus: Jember 6, sisa Hertawan 430.000.000 (dua pinjaman) tampil jasa 8.601.000, karena
tiap pinjaman dibulatkan ke atas sendiri-sendiri. Mas mau: 2% tepat, baru total yang dibulatkan.

Aturan baru (sudah di unit-apps `App\Helpers\JasaModal`, belum dideploy):
1. Jasa per pinjaman = 2% sisa pokok awal bulan, dibulatkan ke RUPIAH terdekat:
   `intdiv($sisa * 2 + 50, 100)` (dulu `intdiv($sisa * 2 + 99_999, 100_000) * 1_000`).
2. Total jasa seharusnya SEMUA pinjaman kantor bulan itu dibulatkan ke atas per 1.000.
3. Selisih pembulatan (< 1.000) ditambahkan ke SATU pinjaman: yang masih bersisa, Modal Awal
   dulu, lalu loan_date/id terbaru (= pinjaman yang jasanya ditarik paling dulu di alokasi).
   Jadi jumlah jasa per pinjaman = total yang dibulatkan.
4. Pinjaman tempo (jasa_bila_bayar, tidak wajib): 2% tepat ke rupiah, tidak ikut pembulatan.
5. Sumber Pusat tetap 0.

Yang perlu diubah di app_laravel: `TbCapitalLoan::jasaDari` (rumus 1) dan tempat jasa per
kantor dijumlah / dibagi ke pinjaman (pembagian slip, jasaWajibPada per kantor) supaya ikut
rumus 2–3. Kalau tidak, angka jasa app_laravel beda dengan unit-apps (selisih < 1.000 per pinjaman).

Tidak ada migrasi.
