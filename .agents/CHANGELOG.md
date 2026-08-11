# Catatan Perubahan unit-apps

**Aturan wajib**: setiap kali mengedit, catat di sini — **fungsi apa yang tersentuh, controller/route mana yang terpengaruh, dan tabel mana yang terlibat.** Tanpa ini, agen berikutnya harus membaca ulang seluruh kode untuk tahu dampak sebuah perubahan.

Format tiap entri:

| Berkas | Fungsi / Method | Route / Controller terdampak | Tabel tersentuh | Dampak |
|---|---|---|---|---|

Kolom **Tabel tersentuh** memakai penanda:
`BACA` = hanya query · `TULIS` = insert/update/delete · `BERHENTI-TULIS` = dulu ditulis, sekarang tidak lagi.

Peta lengkap aplikasi ada di `.agents/skills/peta-aplikasi/`.

---

# 2026-08-02

## A. Pembersihan nama permission + `auth.roles`

Latar: banyak nama permission di kode tidak ada di tabel `permissions`. `hasPermissionTo()` **melempar** untuk nama tak dikenal, `can()` / `hasAnyPermission()` / JS `includes()` **gagal diam**. Detail lengkap: `skills/peta-aplikasi/references/05_temuan_dan_jebakan.md` bagian Z.

| Berkas | Fungsi / Method | Route / Controller terdampak | Tabel tersentuh | Dampak |
|---|---|---|---|---|
| `app/Http/Middleware/HandleInertiaRequests.php` | `share()` | **SEMUA route** (middleware group `web`) | `roles`, `model_has_roles` — BACA | Menambah prop global `auth.roles`. Tanpa ini cek role di frontend mustahil |
| `app/Http/Controllers/TransactionLoanController.php` | `action_buku_transaksi()` | `PUT /bukutransaksi/action/{loan}` (`transaction.action_buku_transaksi`) | `transaction_loans` — TULIS · `permissions`, `roles` — BACA | `'can create'` → `can-create`; `'unit mantri'` → `hasRole('mantri')`. **Endpoint ini sebelumnya selalu 500** |
| `app/Http/Controllers/AdminController.php` | `index()`, `giveMaintenerWorker()` | `GET /admin-panel`, `POST /admin-panel/giveMaintenerWorker` | `permissions`, `model_has_permissions`, `users` — TULIS | `'maintenance worker'` → `can-edit`. **`/admin-panel` sebelumnya selalu 500** |
| `app/Helpers/AppHelper.php` | `get_closed_date()` | semua pemakai `server_filter.closed_transaction` (seluruh halaman daftar) | `permissions` — BACA | `maintenance-worker` → `can-edit` |
| `app/Helpers/AppHelper.php` | `getMantri()` | `store_buku_transaksi`, `store_pengajuan_lama`, `bayar_pinjaman` | `employees` — BACA | Cabang `hasAnyPermission(['unit pimpinan','unit mantri','unit km'])` dihapus. **Sengaja tidak jadi cek role** — mengaktifkannya mengubah atribusi `user_mantri` |
| `app_laravel/database/seeders/RolesAndPermissionsSeeder.php` | `run()` | — | `roles`, `permissions`, `role_has_permissions` | Mapping baru: `can-create` (+stafkontrol, +pengawas), `can-approve` (+stafkontrol), `can-edit` dicabut dari pimpinan & kasir |
| **DB live (via tinker, bukan seeder)** | — | — | `role_has_permissions` — TULIS (5 baris) | `+stafkontrol/can-create`, `+pengawas/can-create`, `+stafkontrol/can-approve`, `−pimpinan/can-edit`, `−kasir/can-edit`. `model_has_roles` **tidak disentuh** |

### Frontend — hook dihapus, 8 pemakai dipetakan ulang

`resources/js/Hooks/useFrontEndPermission.js` **DIHAPUS** (kelima flagnya selalu `false`).

| Berkas | Yang diubah | Route terdampak |
|---|---|---|
| `Pages/NewLoan/NewNasabah.jsx` | `isCreator`→`can-create`, `isCanShowKelompok`→`view-all-groups` | `transaction.fastcreate`, `transaction.index_buku_transaksi` |
| `Pages/WebView/BukuTransaksi/FastCreateV2.jsx` | `isCanShowKelompok`→`view-all-groups` | `transaction.fastcreatev2` |
| `Pages/WebView/BukuTransaksi/InputMacet.jsx` | idem (juga menentukan `initialKelompok`) | `transaction.inputmacet` |
| `Pages/NewAngsuran/Components/Action.jsx` | `isCreator`→`can-create`, `'maintenance worker'`→`can-edit` | `pinjaman.index_pinjaman` |
| `Pages/NewAngsuran/Components/Action22.jsx` | `isCreator`→`can-create` | `pinjaman.index_pinjaman` (via `BukuStorting`) |
| `Pages/NewAngsuran/Components/AngsuranTable.jsx` | `'maintenance worker'`→`can-edit` | `pinjaman.index_pinjaman` |
| `Pages/NewAngsuran/Components/DeleteAngsuran.jsx` | `'can create'`→`can-create` | `pinjaman.destroy_angsuran` |
| `Pages/NewAngsuran/Components/BayarAngsuran.jsx` | hapus import tak terpakai | — |
| `Pages/BukuTransaksi/Components/ChangeDetail.jsx` | `isMantri`→`roles.includes('mantri')` | `transaction.updateEverything` |
| `Pages/BukuTransaksi/Rencana.jsx` | `isUnit`→`can-approve` | `kasir.rekap.ceklist_kepala` |
| `Pages/BukuTransaksi/Components/Acc.jsx` | `isCreator`/`isMantri` → `can-approve` | `transaction.action_buku_transaksi` |
| `Components/Sidebar.jsx`, `Pages/Administrasi/ManPower/ManPower.jsx`, `Pages/Auth/Register.jsx` | `'superuser'`/`'can update pusat'` → `roles.includes('superuser')` | menu global, `administrasi.manpower.index`, `register` |
| `Pages/Profile/Edit.jsx` | `'unit mantri'` → `roles.includes('mantri')` | `profile.edit` |
| `Pages/WebView/Rekap/RekapDua.jsx`, `Pages/MobileApps/Rekap/RekapDua.jsx` | `'unit pimpinan'` → `roles.includes('pimpinan')` | `kasir.rekap.rekap_dua`, `mobile_apps.rekap_dua` (judul saja) |

**Sengaja ditinggalkan**: `'can update'` (4 titik, atas permintaan user) dan `'can show branch'`/`'can show kelompok'` di backend (17 titik, `can()` gagal-diam, sudah digantikan Global Branch Filter).

---

## B. Jejak pengaju/pengesah di dialog Action

| Berkas | Fungsi / Method | Route terdampak | Tabel tersentuh | Dampak |
|---|---|---|---|---|
| `app/Models/TransactionLoan.php` | relasi baru `pemeriksa()` (`user_check`), `pencair()` (`user_drop`) | — | `transaction_loans` → `employees` — BACA | Melengkapi `mantri()` & `userinput()` yang sudah ada |
| `app/Traits/PinjamanTrait.php` | `getTransactionLoan()` | `transaction.index_buku_transaksi`, `mobile_apps.transaksi`, `mobile_apps.buku_transaksi_kepala` | `transaction_loans`, `employees` — BACA | Eager-load 4 relasi employee (`:id,nama_karyawan`) → props `diajukan_oleh`, `diinput_oleh`, `acc_oleh`, `drop_oleh`, `diinput_pada`. Eager-load wajib, tanpa itu N+1 |

Frontend: `Pages/BukuTransaksi/Components/StatusPengajuan.jsx` (**BARU**) — timeline Diajukan → ACC → Drop, tiap tahap menampilkan nominal + siapa + kapan.

---

## C. Kunci Reset & Hapus berdasarkan approval rekap

| Berkas | Fungsi / Method | Route terdampak | Tabel tersentuh | Dampak |
|---|---|---|---|---|
| `app/Traits/PinjamanTrait.php` | `getTransactionLoan()` | 3 route yang sama seperti bagian B | `transaction_daily_recaps` — BACA | Query `$approvedRecapDates` (`daily_kepala_approval IS NOT NULL`), lalu prop `recap_approved` per pinjaman. Sekali query + `flip()` jadi lookup O(1) |
| `Pages/BukuTransaksi/Components/ChangeDetail.jsx` | gerbang tombol Reset Pinjaman | `transaction.updateEverything` (`updateType: resetdata`) | — | Butuh `can-approve`; terkunci bila `recap_approved` kecuali superuser. Tanpa izin → teks arahan, tombol hilang |
| `Pages/BukuTransaksi/Components/RemoveLoan.jsx` | gerbang tombol Hapus | `pinjaman.destroy_loan` | — | Terkunci total bila `recap_approved` — **tanpa** pengecualian superuser |

> ⚠️ Pembatasan ini **baru di UI**. `transaction.updateEverything` dan `pinjaman.destroy_loan` di server masih hanya mengecek `AppHelper::havePermissionByDate()` — belum ada cek `can-approve` maupun cek approval rekap. Masih bisa ditembus lewat request langsung.

---

## D. Hook rekap otomatis dicabut (alur rekap dibangun ulang)

| Berkas | Fungsi / Method | Route terdampak | Tabel tersentuh | Dampak |
|---|---|---|---|---|
| `app/Models/TransactionLoan.php` | `boot()` — hook `updating` **dihapus seluruhnya** | semua yang mengubah `status` pinjaman: `action_buku_transaksi`, `updateEverything`, `store_*` | `transaction_daily_recaps.drop` — **BERHENTI-TULIS** | Perpindahan status ke/dari `success` tidak lagi increment/decrement `drop` |
| `app/Models/TransactionLoan.php` | `boot()` — hook `deleting`, bagian decrement dibuang | `pinjaman.destroy_loan` | `transaction_daily_recaps.drop` — **BERHENTI-TULIS** | **Cascade delete angsuran TETAP ADA** — tanpa itu baris `transaction_loan_instalments` jadi yatim |
| `app/Models/TransactionLoanInstalment.php` | `boot()` — `creating` & `deleting`, bagian increment/decrement dibuang | `bayar_pinjaman`, `destroy_angsuran`, `synch_angsuran`, `store_buku_transaksi_batch`, Batch Input | `transaction_daily_recaps.storting` — **BERHENTI-TULIS** | **Perhitungan `total_angsuran` + status `LUNAS` TETAP ADA** (itu state pinjaman, bukan rekap) → `transaction_loans` — TULIS |

**Konsekuensi masa transisi**: `drop` & `storting` di `transaction_daily_recaps` tidak lagi terkoreksi otomatis. Satu-satunya penulis sekarang `TransactionDailyRecapController@ceklist_kepala`, yang menjumlah ulang dari sumber:

```
drop     = SUM(nominal_drop) pinjaman status 'success' pada tanggal itu
storting = SUM(nominal) angsuran pada tanggal itu
```

Terverifikasi: buat angsuran 12.345 → rekap tidak bergerak, `total_angsuran` parent tetap terhitung; setelah dihapus semuanya balik.

### Belum dikerjakan — menunggu penjelasan bertahap dari user

Rencana user: counting dipicu **saat KM ACC** (sudah ada di `ceklist_kepala`) **atau terjadwal jam 3 pagi**.

Kondisi terukur 2026-08-02:
- `CountingDailyBalance` + job `CountingBalance` + 2 SQL view (`v_is_balance_*`) **sudah ada**, tapi dijadwalkan `everySecond()`, `QUEUE_CONNECTION=sync`, dan **tidak ada crontab** → dorman. 681 `failed_jobs` semuanya `CountingBalance`.
- Drift saat ini: **33.489** baris (`drop`) + **71.675** baris (`storting`) ≈ 105rb. Sudah meleset **sebelum** hook dicabut.
- Query view: 23 detik (drop), 1 menit 45 detik (storting) — karena GROUP BY tanpa batas tanggal.

`TransactionDailyRecap::boot()` masih punya hook `updating` yang merambatkan `target` (`target + drop*0.13 - keluar`) — **belum disentuh**.

---

## E. Tampilan (tanpa dampak tabel)

| Berkas | Perubahan | Route terdampak |
|---|---|---|
| `Components/FilterBar.jsx` (**BARU**) | Filter inline chip hari, terapkan seketika, simpan `localStorage`, pulihkan sekali saat mount | `mobile_apps.transaksi` |
| `Pages/MobileApps/BukuTransaksiMantri/TransaksiMantri.jsx` | Popover+`SearchComponent` → `FilterBar`; buang scroll ganda | `mobile_apps.transaksi` |
| `Pages/MobileApps/BukuTransaksiKepala/TransaksiMantri.jsx` | buang scroll ganda | `mobile_apps.buku_transaksi_kepala` |
| `Pages/BukuTransaksi/BukuTransaksiKepala.jsx` | `<Table>` → daftar kartu; hierarki nama → Pengajuan → ACC → Drop Jadi; kepala tanggal `sticky top-14` | `mobile_apps.transaksi` **dan** `mobile_apps.buku_transaksi_kepala` (dipakai berdua) |
| `Pages/BukuTransaksi/Action.jsx` | Isi dialog dikeluarkan dari `<DialogDescription>` (`<p>`, bikin hydration mismatch SSR); `max-h-[90svh]` + scroll tunggal; judul jadi "Detail Pengajuan"; kartu Action naik ke paling atas | `transaction.index_buku_transaksi`, `mobile_apps.transaksi` |
| `Pages/BukuTransaksi/Components/ActionTable.jsx` | `<Table>` 14 kolom untuk 1 baris → blok identitas + daftar label/nilai | idem |

---

## F. Komponen tombol & badge seragam dengan app_laravel

| Berkas | Fungsi / Method | Route / Controller terdampak | Tabel tersentuh | Dampak |
|---|---|---|---|---|
| `resources/js/Components/shadcn/AppButton.jsx` (**BARU**) | `AppButton`, `appButtonVariants` | — (belum dipakai halaman mana pun) | — | 11 varian + 10 ukuran. Warna disalin persis dari `app_laravel/resources/js/components/ui/button.tsx` |
| `resources/js/Components/shadcn/AppBadge.jsx` (**BARU**) | `AppBadge`, `appBadgeVariants` | — (belum dipakai halaman mana pun) | — | Varian & ukuran sama persis dengan AppButton, tapi **gaya LEMBUT** (`from-*-50` + teks `*-700`) mengikuti `app_laravel/.../ui/badge.tsx` — badge di app_laravel memang bukan gradasi pekat |
| `resources/js/Pages/BukuTransaksi/Action.jsx` | urutan tab Action | `transaction.index_buku_transaksi`, `mobile_apps.transaksi` | — | Urutan jadi: **ACC/Drop Jadi** → **Detail nasabah** → **Riwayat** → Admin Edit / Remove Loan. Aksi dipisah dari bacaan |
| `resources/js/Pages/BukuTransaksi/Components/Acc.jsx` | 2 badge status | idem | — | Perbaiki `Tanggal2026-07-25` (JSX menggabung baris tanpa spasi) + sembunyikan bagian tanggal saat `check_date` null (drop langsung) |

**Peta warna AppButton ↔ app_laravel:**

| AppButton | app_laravel | Gradasi |
|---|---|---|
| `primary` | `default` | `blue-500` → `indigo-600` |
| `submission` | `success` | `emerald-400` → `teal-500` |
| `warning` | `warning` / `amber` | `amber-400` → `orange-500` |
| `danger` | `destructive` | `red-500` → `rose-600` |
| `black` | *(tidak ada)* | `zinc-700` → `zinc-900`, dibalik jadi terang di dark mode |
| `ghost` | `ghost` | zinc, tanpa gradasi |

Varian outline (`primaryOutline`, `submissionOutline`, `warningOutline`, `dangerOutline`, `blackOutline`): `border-2` warna identitas, terisi tipis saat hover. Berbeda dari `outline` app_laravel yang netral saat diam lalu jadi biru — di sini warna identitas sudah terlihat sejak diam supaya maknanya terbaca.

Ukuran: `xs` `sm` `base` `lg` `xl` + ikon `iconXs` `iconSm` `icon` `iconLg` `iconXl`.
Default: `variant="primary"`, `size="base"`.

**Peta warna AppBadge ↔ app_laravel** (gaya lembut, BUKAN gradasi pekat):

| AppBadge | app_laravel | Latar | Teks |
|---|---|---|---|
| `primary` | `default` | `blue-50` → `indigo-50` | `blue-700` |
| `submission` | `success` | `emerald-50` → `teal-50` | `emerald-700` |
| `warning` | `warning` | `amber-50` → `orange-50` | `amber-700` |
| `danger` | `destructive` | `red-50` → `rose-50` | `red-700` |
| `black` | *(tidak ada)* | `zinc-700` → `zinc-900` **pekat** | putih |
| `ghost` | *(tidak ada)* | transparan | `zinc-600` |

`black` sengaja dibuat pekat — kalau ikut pola `*-50` dia cuma jadi abu-abu muda dan tidak terbaca sebagai "hitam".
Hover pada badge hanya aktif bila dirender sebagai `<a>` lewat `asChild` (selektor `[a&]:hover:`), jadi badge diam tidak berkedip saat tersentuh kursor.

> `@/shadcn/ui/button` dan `@/shadcn/ui/badge` yang lama **TIDAK diubah** — masih dipakai puluhan berkas dengan nama varian berbeda (`green`, `yellow`, `destructiveoutline`, `destructiveoutline2`, `greenoutline`), termasuk `BadgeStatus` & `BargeStatus`. AppButton/AppBadge untuk kode baru; migrasi bertahap.

Terverifikasi lewat CSS hasil build: `.from-emerald-400{--tw-gradient-from:var(--color-emerald-400)}` identik di kedua proyek; seluruh kelas `from-*-50`/`to-*-50` badge juga ter-generate.

---

# 2026-08-03

## G. AppBadge dipasang di kartu nasabah + modal, warna dipertegas

| Berkas | Fungsi / Method | Route / Controller terdampak | Tabel tersentuh | Dampak |
|---|---|---|---|---|
| `resources/js/Components/shadcn/statusVariants.js` (**BARU**) | `VARIAN_STATUS`, `VARIAN_JENIS`, `varianStatus()`, `varianJenis()` | — | — | Peta status→varian AppBadge, dipisah jadi modul sendiri supaya tidak terjadi impor melingkar `BukuTransaksiKepala → Action → ActionTable → BukuTransaksiKepala` |
| `resources/js/Pages/BukuTransaksi/BukuTransaksiKepala.jsx` | badge status di kartu | `mobile_apps.transaksi`, `mobile_apps.buku_transaksi_kepala` (dipakai berdua) | — | `BadgeStatus`/`BargeStatus` → `AppBadge` (`size="sm"`, sebelumnya `xs` terlalu kecil). Lencana lepas `onClick` sendiri — kartu sudah bisa ditap, klik merambat ke atas |
| `resources/js/Pages/BukuTransaksi/Components/ActionTable.jsx` | badge status di modal Detail Pengajuan | `transaction.index_buku_transaksi`, `mobile_apps.transaksi` | — | idem, `size="base"`. Disamakan dengan kartu supaya record yang sama tidak tampil beda warna di dua tempat |
| `resources/js/Pages/BukuTransaksi/Components/Acc.jsx` | 2 badge status (bar hijau ACC/Drop Jadi) | idem | — | `Badge` polos yang **selalu hijau** (termasuk saat `tolak`/`gagal`) → `AppBadge` + `varianStatus()`, warnanya sekarang ikut status |
| `resources/js/Components/shadcn/AppBadge.jsx` | `appBadgeVariants` | — | — | Varian bawaan (`primary`, `submission`, `warning`, `danger`, `black`) diubah dari gaya **lembut** (`from-*-50`) jadi **pekat** (`from-*-500 to-*-600` + teks putih) — kurang menonjol di kartu. Gaya lembut asli app_laravel dipindah ke akhiran `Soft` (`primarySoft`, dst), tetap tersedia. Tambah `font-semibold uppercase tracking-wide` |

**Pemetaan status → warna** (halaman `/mobile_apps/transaksi` dan modal Detail Pengajuan): `open`=biru, `acc`=kuning, `success`=hijau, `tolak`=hitam, `gagal`=merah, `drop_langsung: baru`=kuning, `lama`=ghost.

> Cakupan sengaja dibatasi: `AppBadge` **hanya** dipakai 2 berkas di atas. `BadgeStatus`/`BargeStatus` lama di 18 berkas lain (tabel desktop, `Kasir/Rekap/*`, `RiwayatPengajuan*`, dst) **tidak disentuh** — user secara eksplisit minta ganti satu per satu, bukan sekaligus.

## H. Overlay diganti disabled+keterangan (bug gerbang pengawas)

**Bug yang diperbaiki**: kartu "Admin Edit" & "Remove Loan" di modal Action ditutup `<NoEditOverlay>` berbasis `can-edit`. Tapi `can-edit` sekarang **cuma milik superuser** (dicabut dari pimpinan/kasir di bagian A) — akibatnya **pengawas** (dan semua pemegang `can-approve` lain) melihat kartu Reset Pinjaman tertutup overlay padahal seharusnya berhak.

| Berkas | Fungsi / Method | Route / Controller terdampak | Tabel tersentuh | Dampak |
|---|---|---|---|---|
| `resources/js/Pages/BukuTransaksi/Action.jsx` | kartu Admin Edit & Remove Loan | `transaction.index_buku_transaksi`, `mobile_apps.transaksi` | — | 2 blok `{!canEdit && <NoEditOverlay/>}` dihapus, beserta variabel `canEdit` & import `NoEditOverlay` |
| `resources/js/Pages/BukuTransaksi/Components/Acc.jsx` | form ACC/Tolak, form Drop/Gagal | idem | — | `NoEditOverlay` → input `disabled` + `<AppButton disabled>` + teks amber. Tombol diganti `Button`→`AppButton` (`submission`/`danger`) |
| `resources/js/Pages/BukuTransaksi/Components/ChangeDetail.jsx` | gerbang tombol Reset Pinjaman | `transaction.updateEverything` | — | `NoEditOverlay` → `<p>` teks amber, elemen (tombol) tetap tampil |
| `resources/js/Pages/BukuTransaksi/Components/RemoveLoan.jsx` | gerbang tombol Hapus | `pinjaman.destroy_loan` | — | Overlay dibuang, diganti pola "tombol `disabled` + `<p>` alasan" — lihat bagian I untuk aturan barunya |

**Pola barunya, dipakai konsisten di keempat berkas**: kontrol **tetap tampil**, tidak `disabled=false → hilang`, ditemani teks `text-amber-600` (keterbatasan wajar) atau `text-destructive` (terkunci data — dipakai untuk kasus rekap sudah di-ACC). Tanpa akses sama sekali → tombol `disabled` + kalimat siapa yang harus dihubungi, **elemen tidak pernah hilang total**.

## I. Aturan Hapus Pinjaman ditegakkan di server, bukan cuma UI

Sebelumnya `destroy_loan` memakai `AppHelper::havePermissionByDate()` — fungsi bersama yang juga dipakai `destroy_angsuran`/`updateEverything`, dan punya bug lama (E1): untuk `kasir/pimpinan/kepala-mantri/pengawas` **selalu `true` tanpa syarat apa pun**, termasuk tidak pernah mengecek kunci rekap. Jadi sebelum perubahan ini, siapa pun berperan approver bisa menghapus pinjaman kapan saja — pembatasan rekap yang sudah dipasang di UI (bagian C, 2026-08-02) **tidak benar-benar ditegakkan server**.

| Berkas | Fungsi / Method | Route / Controller terdampak | Tabel tersentuh | Dampak |
|---|---|---|---|---|
| `app/Helpers/AppHelper.php` | `canDeleteLoan(TransactionLoan $loan): array` (**BARU**) | `pinjaman.destroy_loan` | `transaction_daily_recaps` — BACA | Gerbang khusus hapus, terpisah dari `havePermissionByDate()` (yang **tidak diubah**, masih dipakai `destroy_angsuran` & `updateEverything`) |
| `app/Http/Controllers/TransactionLoanController.php` | `destroy_loan()` | `DELETE pinjaman.destroy_loan` | `transaction_loans` — TULIS (lewat cascade delete di model, lihat bagian D) | `havePermissionByDate()` → `canDeleteLoan()` |
| `resources/js/Pages/BukuTransaksi/Components/RemoveLoan.jsx` | gerbang tombol Hapus | idem | — | Logika client disamakan persis dengan server (lihat aturan di bawah) — mencegah tombol tampak aktif padahal server akan menolak |

**Aturan `canDeleteLoan()`** (`status: bool, message?: string`):

| Role | Syarat boleh hapus |
|---|---|
| `mantri` | `drop_date` **ATAU** `request_date` pinjaman = **hari ini**. Selain itu ditolak — tanpa pengecualian apa pun (beda dari aturan lama 2 hari) |
| pemegang `can-approve` (kasir, pimpinan, kepala-mantri, pengawas, stafkontrol, superuser) | Rekap harian tanggal drop **belum** di-ACC kepala (`transaction_daily_recaps.daily_kepala_approval IS NULL`). Begitu terkunci, **tidak ada pengecualian** — termasuk superuser, beda dengan Reset Pinjaman yang mengecualikan superuser |
| lainnya (mis. `pusat`) | Selalu ditolak |

Terverifikasi lewat tinker dengan data nyata, 6 skenario:
```
Mantri + drop hari ini      -> {"status":true}
Mantri + drop lampau        -> {"status":false,"message":"Mantri hanya bisa menghapus..."}
KM + rekap belum di-ACC     -> {"status":true}
KM + rekap sudah di-ACC     -> {"status":false,"message":"Rekap harian... sudah di-ACC pimpinan..."}
Superuser + rekap di-ACC    -> {"status":false,...}   ← tanpa pengecualian, sesuai desain
Pusat (tanpa akses)         -> {"status":false,"message":"Anda tidak mempunyai akses..."}
```

---

## J. Konsolidasi folder halaman Buku Transaksi (Web/Mobile/MobileKepala jadi satu tempat)

Sebelum ini, 3 halaman Inertia yang menampilkan data **sama persis** (semua manggil `getTransactionLoan()` di `PinjamanTrait`) tersebar di 3 folder berbeda (`WebView/BukuTransaksi/`, `MobileApps/BukuTransaksiMantri/`, `MobileApps/BukuTransaksiKepala/`), terpisah dari komponen tampilan bersama yang sudah lebih dulu ada di `Pages/BukuTransaksi/` (`BukuTransaksi.jsx`, `BukuTransaksiKepala.jsx`, `Action.jsx`, dst). Ini murni pemindahan file (rename path) — tidak ada perubahan logika/tampilan apa pun.

**Struktur baru** (semua di bawah `resources/js/Pages/BukuTransaksi/`):

```
BukuTransaksi/
  Web/            <- pindahan dari WebView/BukuTransaksi/
    TransaksiMantri.jsx, Create.jsx, BatchUpload.jsx, FastCreateV2.jsx, InputMacet.jsx
  Mobile/         <- pindahan dari MobileApps/BukuTransaksiMantri/
    TransaksiMantri.jsx
  MobileKepala/   <- pindahan dari MobileApps/BukuTransaksiKepala/
    TransaksiMantri.jsx
  BukuTransaksi.jsx, BukuTransaksiKepala.jsx, Action.jsx, Rencana.jsx, Components/...  <- sudah di sini sebelumnya, tidak dipindah
```

| Berkas | Fungsi / Method | Route / Controller terdampak | Tabel tersentuh | Dampak |
|---|---|---|---|---|
| `app/Http/Controllers/TransactionLoanController.php` | `fastcreate()`, `fastcreatev2()`, `inputmacet()`, `index_buku_transaksi()` | `transaction.fastcreate`, `.fastcreatev2`, `.inputmacet`, `.index_buku_transaksi` | — | 4 string `Inertia::render('WebView/BukuTransaksi/...')` → `Inertia::render('BukuTransaksi/Web/...')` |
| `app/Http/Controllers/MobileAppsMantriController.php` | `transaksi()`, `buku_transaksi_kepala()` | `mobile_apps.transaksi`, `mobile_apps.buku_transaksi_kepala` | — | 2 string `Inertia::render('MobileApps/BukuTransaksi{Mantri,Kepala}/...')` → `Inertia::render('BukuTransaksi/{Mobile,MobileKepala}/...')` |
| `resources/js/Pages/NewAngsuran/AngsuranByDate.jsx` | import `InputMacet` | — | — | import relatif `../WebView/BukuTransaksi/InputMacet` → `../BukuTransaksi/Web/InputMacet` (satu-satunya pemakai lain di luar folder yang dipindah, ditemukan lewat grep) |
| 7 file halaman (`TransaksiMantri.jsx` × 3, `Create.jsx`, `BatchUpload.jsx`, `FastCreateV2.jsx`, `InputMacet.jsx`) | — | — | — | `git mv` ke lokasi baru, isi tidak diubah (semua import lain pakai alias `@/...`, tidak relatif — aman) |

Terverifikasi lewat `php artisan tinker`: memanggil ke-3 method controller utama (`index_buku_transaksi`, `transaksi`, `buku_transaksi_kepala`) dan 3 method Web lainnya (`fastcreate`, `fastcreatev2`, `inputmacet`) sebagai user superuser — semua mengembalikan Inertia response dengan `component` string yang cocok persis dengan path file baru, tanpa error. Folder lama (`WebView/BukuTransaksi/`, `MobileApps/BukuTransaksiMantri/`, `MobileApps/BukuTransaksiKepala/`) sudah kosong dan dihapus.

---

## K. Halaman Buku Transaksi digabung jadi satu (responsif), route mobile-kepala dihapus

Sebelumnya ada 3 halaman terpisah untuk data yang sama (`getTransactionLoan()`): `bukutransaksi` (tabel, desktop), `mobile_apps/transaksi` ("Drop", kartu, mantri), `mobile_apps/buku-transaksi-kepala` (kartu + tab rencana, khusus kepala/pimpinan via menu "Menu Kepala & Pimpinan"). Diringkas jadi **2 menu saja**: "Drop" tidak diubah sama sekali; `bukutransaksi` sekarang jadi satu halaman responsif (tabel di layar lebar, kartu + `FilterBar` + tab Rencana Drop di layar sempit — sama seperti tampilan "Drop"), dan route/halaman "mobile-kepala" dihapus total.

| Berkas | Fungsi / Method | Route / Controller terdampak | Tabel tersentuh | Dampak |
|---|---|---|---|---|
| `resources/js/Pages/BukuTransaksi/Web/TransaksiMantri.jsx` | seluruh komponen halaman | `transaction.index_buku_transaksi` | — | Ditulis ulang: tambah cabang `lg:hidden` (kartu `BukuTransaksiKepala` + `FilterBar`, sama pola dengan menu Drop, tanpa `max-h/overflow` supaya dokumen jadi satu-satunya area scroll) berdampingan dengan cabang `hidden lg:block` (tabel `BukuTransaksi` lama, scroll box `max-h-[70vh]` dipertahankan apa adanya). Filter/tombol Tambah Pengajuan tetap ada di kedua cabang. State `flatData` yang dihitung tapi tak pernah dipakai — dibuang |
| `app/Http/Controllers/MobileAppsMantriController.php` | `buku_transaksi_kepala()` (**DIHAPUS**) | `mobile_apps.buku_transaksi_kepala` (**route dihapus**) | — | Method & route mati total — sudah tidak ada satu pun yang butuh, cakupannya diserap `index_buku_transaksi` |
| `routes/web.php` | — | `Route::get('/buku-transaksi-kepala', ...)` (**dihapus**) | — | idem |
| `resources/js/Pages/BukuTransaksi/MobileKepala/TransaksiMantri.jsx` | — | — | — | **File & folder dihapus** (`git rm`) — tidak ada lagi route yang merender ini |
| `resources/js/Pages/MobileApps/Index.jsx` | tombol "Buku Transaksi" di fieldset "Menu Kepala & Pimpinan" | — | — | `route('mobile_apps.buku_transaksi_kepala')` → `route('transaction.index_buku_transaksi')` |

Terverifikasi lewat `tinker`: `index_buku_transaksi` & `transaksi` (Drop) tetap mengembalikan component path yang benar tanpa error; `method_exists(..., 'buku_transaksi_kepala')` → `false`; `route:list` tidak lagi memuat route tersebut. Vite HMR memproses `TransaksiMantri.jsx` tanpa error compile.

> **Catatan tersisa (tidak diubah, sengaja dibiarkan)**: `resources/js/Pages/MobileApps/_Index.jsx` — file duplikat yang sudah dipetakan sebelumnya sebagai TIDAK dirouting (lihat catatan lama di bagian bawah dokumen ini) — masih memanggil `route('mobile_apps.buku_transaksi_kepala')` yang sekarang sudah tidak ada. Karena file ini tidak pernah dirender (tidak ada `Inertia::render` yang menunjuknya), pemanggilan itu tidak pernah tereksekusi — tapi kalau suatu saat file ini dipakai lagi, baris itu akan error `route not found`. Sengaja tidak disentuh sesuai instruksi sebelumnya untuk tidak menghapus/mengubah duplikat itu.

## L. Filter `/bukutransaksi` disatukan (FilterBar di semua lebar layar, bukan cuma mobile)

Susulan bagian K: setelah halaman digabung, filter hari/bulan/kelompok-nya ternyata masih dua sistem berbeda — `FilterBar` (instan, chip) cuma tampil di `lg:hidden`, sedangkan desktop (`hidden lg:flex`) dan popover mobile masih pakai `SearchComponent` (dropdown + tombol submit) untuk hari/bulan/kelompok **juga**, jadi ada 2 kontrol tumpang tindih untuk hal yang sama di mobile. Diperbaiki: `FilterBar` sekarang satu-satunya kontrol hari/bulan/kelompok, tampil sama persis di semua lebar layar.

| Berkas | Fungsi/Bagian | Route/Controller terdampak | Tabel tersentuh | Dampak |
|---|---|---|---|---|
| `resources/js/Pages/BukuTransaksi/Web/TransaksiMantri.jsx` | header + blok filter | `transaction.index_buku_transaksi` | — | `SearchComponent` (hari/bulan/kelompok/branch/groupingBranch, 2 instance: desktop inline + popover mobile) dibuang. `FilterBar` sekarang tanpa `lg:hidden` (tampil di semua layar). `SearchComponent` disisakan **cuma** untuk filter Unit/Wilayah (`searchBranch`/`searchGroupingBranch`), dibungkus 1 Popover, tampil di semua lebar layar bila `canShowBranch`\|`canShowGroupingBranch` |

**Detail teknis yang perlu diingat kalau menyentuh berkas ini lagi:**
- `FilterBar` diberi `extraParams={{branch_id, wilayah}}` (dari `server_filter`, hanya diisi kalau ada nilainya) — supaya pilihan Unit/Wilayah yang sedang aktif tidak ikut hilang saat user cuma ganti hari/bulan lewat chip.
- `SearchComponent` (filter Unit) diberi `key={hari-month-kelompok}` supaya **remount**, bukan sekadar re-render, tiap kali `FilterBar` mengubah hari/bulan/kelompok — `SearchComponent` cuma membaca `server_filter` sekali saat mount (`useEffect` dep `[]`), jadi tanpa `key` baru dia bisa submit nilai hari/bulan yang sudah basi dan menimpa balik pilihan FilterBar yang baru saja dipilih user.

---

## M. Route `mobile_apps.buku-angsuran` dihapus — datanya duplikat `pinjaman.index_pinjaman`

`/mobile_apps/buku-angsuran` (menu "Buku Angsuran" di fieldset "Laporan", `/mobile_apps`) memakai `getLoan($request)` — persis fungsi yang sama dipakai `pinjaman.index_pinjaman` (menu "Angsuran Lancar" desktop). Dua route untuk data identik, cuma beda wrapper layout (`MobileLayout` vs `Authenticated` — sudah terbukti sama persis dari bagian K). Disisakan 2 halaman: `mobile_apps.angsuran` (data mantri harian, `getLoanMantri()`) dan `pinjaman.index_pinjaman`.

| Berkas | Fungsi / Method | Route / Controller terdampak | Tabel tersentuh | Dampak |
|---|---|---|---|---|
| `app/Http/Controllers/MobileAppsMantriController.php` | `buku_angsuran()` (**DIHAPUS**) | `mobile_apps.buku_angsuran` (**route dihapus**) | — | Method & route mati — cakupannya sudah diwakili `pinjaman.index_pinjaman` |
| `routes/web.php` | — | `Route::get('/buku-angsuran', ...)` (**dihapus**) | — | idem |
| `resources/js/Pages/MobileApps/BukuAngsuranMantri/Index.jsx` | — | — | — | **File & folder dihapus** (`git rm`) |
| `resources/js/Pages/MobileApps/Index.jsx` | tombol "Buku Angsuran" di fieldset "Laporan" | — | — | Tombol dihapus total (bukan dialihkan — sudah terwakili menu "Angsuran Lancar" desktop). Import `BookA` (lucide-react) ikut dibuang karena jadi tidak terpakai |

**Aturan bisnis `getLoanMantri()` (dipakai `mobile_apps.angsuran`, TIDAK diubah)** — dikonfirmasi user saat diskusi ini, sudah cocok dengan implementasi yang ada, jadi tidak ada perubahan logika: gabungan 2 bucket — pinjaman dalam **jendela 5 bulan berjalan** (termasuk yang sudah lunas, ditandai field `lunas`) + bucket **"ML"** (pinjaman lebih tua dari 5 bulan yang masih ada setoran bulan ini saja). Detail lengkap dicatat di `01_routing_map.md`.

Terverifikasi lewat `tinker`: `angsuran()` & `index_pinjaman()` tetap mengembalikan component yang benar tanpa error; `method_exists(..., 'buku_angsuran')` → `false`; route sudah tidak ada di `route:list`. `php -l` bersih.

---

## N. Filter `mobile_apps.angsuran` disamakan dengan Drop (`FilterBar`)

`NewAngsuran/Angsuran.jsx` dipakai 2 route sekarang (bagian M): `mobile_apps.angsuran` (`type='mobile'`) dan `pinjaman.index_pinjaman` (`type='desktop'`, default). Filternya masih dropdown `SearchComponent` lama di kedua sisi. Diperbaiki **hanya untuk `type === 'mobile'`** — pola sama seperti bagian L (`BukuTransaksi/Web/TransaksiMantri.jsx`).

| Berkas | Fungsi/Bagian | Route/Controller terdampak | Tabel tersentuh | Dampak |
|---|---|---|---|---|
| `resources/js/Pages/NewAngsuran/Angsuran.jsx` | header + blok filter | `mobile_apps.angsuran` | — | Cabang `type === 'mobile'`: dropdown `SearchComponent` (hari/bulan/kelompok/branch/groupingBranch) diganti `FilterBar` (chip instan, sama seperti Drop) + popover kecil "Unit" (`SearchComponent` cuma branch/groupingBranch, muncul kalau `canShowBranch`\|`canShowGroupingBranch`). Cabang `type === 'desktop'` (`pinjaman.index_pinjaman`) **TIDAK disentuh** — masih dropdown `SearchComponent` lama persis seperti sebelumnya, sesuai permintaan eksplisit (cuma `/mobile_apps/angsuran` yang diminta) |

Detail teknis sama seperti bagian L: `FilterBar` diberi `extraParams={branch_id, wilayah}` supaya pilihan Unit tidak hilang saat ganti hari/bulan; `SearchComponent` (popover Unit) diberi `key={hari-month-kelompok}` supaya remount dan tidak submit nilai basi.

Terverifikasi lewat `tinker`: `angsuran()` & `index_pinjaman()` tetap resolve ke component yang benar tanpa error (tidak ada perubahan di controller/route sama sekali, murni perubahan komponen React). Vite HMR memproses `Angsuran.jsx` tanpa error compile.

---

## O. Modal "Bayar" angsuran: Isi Angsuran naik ke atas, label KATROL, Rincian Nasabah gaya Drop

| Berkas | Fungsi / Method | Route / Controller terdampak | Tabel tersentuh | Dampak |
|---|---|---|---|---|
| `resources/js/Pages/NewAngsuran/Components/Action.jsx` | tata letak modal | `mobile_apps.angsuran`, `pinjaman.index_pinjaman`, `mobile_apps.byDates`, `mobile_apps.macet` (dipakai berempat) | — | `BayarAngsuran` ("Isi Angsuran") dipindah dari kolom kanan bawah ke **paling atas** modal — aksi utama saat modal dibuka lewat tombol "Bayar" jadi tidak perlu digulir |
| idem | `gateValue` (**BARU**) | idem | — | Gerbang `NoEditOverlay` ("Pinjaman Sudah Lunas" / "User Tidak Dapat Digunakan Untuk Mengedit") diekstrak jadi satu variabel, dipasang di **dua** pembungkus `relative` (form Isi Angsuran di atas + blok aksi di bawah). **Wajib begini** — kalau `BayarAngsuran` dipindah keluar tanpa membawa gerbangnya, form pembayaran jadi tidak terkunci lagi saat pinjaman sudah lunas / user tanpa `can-create` |
| idem | `MobileCardList` | idem | — | Rincian nasabah layar sempit dirombak mengikuti pola Drop (`BukuTransaksi/Components/ActionTable.jsx`): blok identitas menonjol (nama besar + badge status & lunas + alamat + NIK/copy), lalu nominal Pinjaman sebagai jangkar, lalu grid label/nilai 2 kolom. Sebelumnya daftar "label: nilai" rata kiri-kanan, nama merah di tengah, kartu putih `shadow-lg` bertumpuk di dalam Card, lebar dikunci `max-w-md`. Helper `Field` + `tanggal` ditambahkan (salinan pola dari `ActionTable.jsx`) |
| idem | pembungkus `CardContent` Rincian Nasabah | idem | — | `overflow-auto` sekarang **hanya** membungkus `PinjamanWebTable` (14 kolom, memang perlu geser samping). Cabang mobile tidak lagi dibungkus — pola scroll ganda yang sama sudah diperbaiki di bagian B |
| idem | import `BadgeStatus` | — | — | Dibuang, jadi tidak terpakai setelah `MobileCardList` dirombak |
| `resources/js/Pages/NewAngsuran/Components/BayarAngsuran.jsx` | checkbox dana titipan | `pinjaman.bayar_pinjaman` | `transaction_loan_instalments.danatitipan` — TULIS (lewat controller, tidak berubah) | Label tampilan `"Dana Titipan?"` → **`"KATROL"`** (+ `font-semibold`). **Nama field `danatitipan` sengaja TIDAK diubah** — itu nama kolom DB & key yang dibaca `TransactionLoanController::bayar_pinjaman()`; mengubahnya akan memutus penyimpanan |

**Cakupan yang perlu diketahui (belum dikerjakan, menunggu instruksi):**
- Perubahan tata letak (Isi Angsuran di atas + Rincian Nasabah gaya Drop) hanya di `Action.jsx` → tab **"Buku Angsuran"**. Tab **"Buku Storting"** memakai berkas terpisah `Action22.jsx` (duplikat nyaris identik, judul `"Isi Angsuransxx"`, tanpa `MobileCardList` sama sekali — layar sempit pun dapat tabel web) sehingga **masih tata letak lama**. Di halaman yang sama, dua tab jadi beda tampilan.
- Label **KATROL** ikut berubah di tab "Buku Storting" juga, karena `BayarAngsuran.jsx` dipakai bersama `Action.jsx` **dan** `Action22.jsx`.
- Label `"Dana Titipan"` masih ada di 4 berkas lain (`BukuTransaksi/Web/FastCreateV2.jsx`, `NewLoan/NewNasabah.jsx`, `NewLoan/BatchUpload.jsx`, `NewLoan/BatchUploadx.jsx`) — **tidak disentuh** sesuai aturan tidak mengubah halaman lain tanpa diminta.

**Temuan sampingan (tidak diubah, perlu keputusan)**: `TransactionLoanController::get_loan_pinjaman()` **tidak pernah mengirim** field `out_date` maupun `acc`, padahal dipakai tampilan — akibatnya "Keluar Target" selalu kosong (sekarang tampil `—`), dan di versi lama warna nominal Pinjaman selalu merah karena `customerData.acc === 'Ya'` tidak pernah benar. Pada versi baru nominal dibuat netral (bold `text-foreground`, ikut pola Drop) alih-alih merah menyesatkan.

---

## P. `Action22.jsx` digabung ke `Action.jsx` — tab Buku Storting sekarang dapat fitur yang sama dengan Buku Angsuran

Diminta user setelah bagian O: `Action22.jsx` (dipakai tab "Buku Storting") ternyata bukan cuma beda route, tapi **kehilangan fitur** dibanding `Action.jsx` (dipakai tab "Buku Angsuran") — walau fetch (`pinjaman.get_loan_pinjaman`) & submit bayar (`pinjaman.bayar_pinjaman`, lewat `BayarAngsuran.jsx` yang sudah dipakai bersama) datanya identik. User **eksplisit memilih "satukan penuh"** (bukan opsi pertahankan beda lewat prop) — jadi tab Buku Storting sekarang otomatis dapat semua fitur yang sebelumnya cuma ada di Buku Angsuran, dan kehilangan 1 fitur yang cuma ada di `Action22.jsx`.

| Berkas | Fungsi / Method | Route / Controller terdampak | Tabel tersentuh | Dampak |
|---|---|---|---|---|
| `resources/js/Pages/NewAngsuran/Components/Action22.jsx` | — | `pinjaman.index_pinjaman`, `mobile_apps.angsuran` (via tab Buku Storting) | — | **File dihapus** (`git rm`) — bukan legacy sebelumnya (aktif), sekarang benar-benar tidak dipakai |
| `resources/js/Pages/NewAngsuran/Components/BukuStorting.jsx` | import `Action` | idem | — | `from './Action22'` → `from './Action'` |
| `resources/js/Pages/NewAngsuran/Components/BukuStortingMobile.jsx` | import `Action` | idem | — | idem |

**Yang didapat tab Buku Storting (sebelumnya tidak ada di `Action22.jsx`):**
- Kartu mobile responsif (`isMobile` → `MobileCardList`, gaya Drop) — sebelumnya selalu tabel lebar 13 kolom di semua ukuran layar
- Komponen `Pengajuan` (pengajuan lama) — sebelumnya tidak dirender sama sekali
- `DeleteLoan` (tombol Hapus Pinjaman) — sebelumnya di-comment-out
- Tabel Pemutihan (kalau ada data write-off) — sebelumnya `pemutihan` tidak di-fetch sama sekali
- Kolom "Keluar Target" di tabel desktop
- Isi Angsuran di posisi paling atas modal (bagian O)

**Yang HILANG dari tab Buku Storting (cuma ada di `Action22.jsx`, sengaja tidak dipertahankan sesuai pilihan user):** link WhatsApp "Laporkan" untuk minta revisi data (nomor hardcode `6281233302284`). Kalau ternyata dibutuhkan lagi, tinggal ditambahkan ke `Action.jsx` (tidak perlu file terpisah).

Terverifikasi: `grep -rln "Action22"` di `resources/js` kosong (tidak ada import tersisa). Vite HMR memproses `BukuStorting.jsx`/`BukuStortingMobile.jsx` tanpa error, watcher mendeteksi `Action22.jsx` terhapus tanpa error compile.

---

## Q. Card "Action" + "Jenis Nasabah" dipindah jadi 1 baris di bawah, "Hapus Pinjaman" dihilangkan dari modal

Susulan langsung bagian O/P, di `Action.jsx` yang sama.

| Berkas | Fungsi / Method | Route / Controller terdampak | Tabel tersentuh | Dampak |
|---|---|---|---|---|
| `resources/js/Pages/NewAngsuran/Components/Action.jsx` | tata letak modal | `mobile_apps.angsuran`, `pinjaman.index_pinjaman`, `mobile_apps.byDates`, `mobile_apps.macet` (dipakai berempat, sekarang termasuk tab Buku Storting sejak bagian P) | — | Card **"Action"** (komponen `Pengajuan.jsx` — judul Card-nya literal "Action", bukan nama file) dan Card **"Jenis Nasabah"** (`JenisNasabah.jsx`) sebelumnya ditumpuk vertikal di kolom kanan (`flex-2`) sejajar `Rincian Angsuran`. Sekarang **dikeluarkan** dari situ, ditaruh di baris tersendiri di bagian paling bawah modal, **2 kolom selalu** (`grid grid-cols-2`, bukan `flex-col lg:flex-row` — user minta jangan sampai numpuk jadi 2 baris di layar sempit). `Rincian Angsuran` jadi lebar penuh (`w-full`), tidak lagi berbagi baris dengan kolom kanan |
| idem | tombol "Hapus Pinjaman" (`DeleteLoan`) | — | — | **Dihilangkan total** dari modal — bukan cuma dipindah. Import `DeleteLoan` dibuang dari `Action.jsx` |
| idem | `gateValue` (`NoEditOverlay`) | — | — | Tetap menggerbang Card Action + Jenis Nasabah di lokasi barunya (dipindah bareng, bukan ditinggal) |

> **Catatan untuk sesi berikutnya**: `resources/js/Pages/NewAngsuran/Components/DeleteLoan.jsx` (posting ke `pinjaman.destroy_loan`) sekarang **tidak diimport di manapun** — jadi dead code, sengaja **tidak dihapus filenya** (cuma dikeluarkan dari UI), ikuti pola konservatif sesi ini (file yang sudah tidak dipakai dibiarkan, bukan otomatis dihapus, kecuali diminta eksplisit). Kalau nanti dipastikan memang tidak akan dipakai lagi, baru dihapus fisik. Jangan disamakan dengan `BukuTransaksi/Components/RemoveLoan.jsx` — itu komponen hapus pinjaman yang MASIH aktif dipakai (dengan gerbang `canDeleteLoan()` yang jauh lebih lengkap, lihat bagian I) di halaman Buku Transaksi, bukan di modal Angsuran ini.

Terverifikasi: Vite HMR memproses `Action.jsx` tanpa error compile, struktur JSX seimbang (dicek manual, jumlah tag div/Card cocok).

**Susulan (screenshot user)**: efek langsung dari kartu jadi setengah lebar (2 kolom) — select "Status" di Card Jenis Nasabah kepotong jadi `"Pilih Sal"` karena sebelumnya select (`flex-3`) dan tombol Submit (`flex-1`) berdampingan dalam satu baris sempit.

| Berkas | Fungsi / Method | Route / Controller terdampak | Tabel tersentuh | Dampak |
|---|---|---|---|---|
| `resources/js/Pages/NewAngsuran/Components/JenisNasabah.jsx` | form Status | idem | — | Select `notes` + tombol Submit yang tadinya berdampingan (`flex-3`/`flex-1`) ditumpuk (`flex flex-col`), keduanya `w-full` — supaya teks placeholder select tidak terpotong berapa pun lebar kartunya, bukan cuma solusi sementara untuk lebar 2-kolom saat ini |

---

## R. Tanggal pembayaran di "Isi Angsuran" dikunci ke hari koleksi pinjaman (tidak bisa dipilih manual)

Field "Tanggal Pembayaran" tadinya default ke `server_filter.today` (tanggal hari ini apa adanya) dan bisa diubah bebas lewat date picker. Masalahnya: server (`bayar_pinjaman()`) menolak submit kalau nama hari `transaction_date` ≠ nama hari `drop_date` pinjaman ("Hari Tidak Sama") — jadi default `today` polos bisa langsung gagal submit kalau hari ini bukan hari koleksi pinjaman itu. Diminta user: kunci field-nya, jangan biarkan pilih tanggal lain sama sekali.

| Berkas | Fungsi / Method | Route / Controller terdampak | Tabel tersentuh | Dampak |
|---|---|---|---|---|
| `resources/js/Pages/NewAngsuran/Components/BayarAngsuran.jsx` | `getLastDateForHari()` (**BARU**) + `<Input transaction_date>` | `pinjaman.bayar_pinjaman` | — | Nilai default `transaction_date` sekarang dihitung dari `hari` pinjaman (bukan `server_filter.today` mentah) — meniru persis `AppHelper::getStortingShowDate()` di server (hari ini kalau cocok, kalau tidak mundur ke kejadian terakhir hari itu). Input diberi `disabled` + teks keterangan "Tanggal mengikuti hari drop pinjaman (...), tidak bisa diubah manual". `today` dari `server_filter` dibuang dari destructure karena tidak dipakai lagi |

**Detail teknis penting**: `getLastDateForHari()` di JS harus tetap sama persis dengan `AppHelper::getStortingShowDate()`/`getNumbDays()` di PHP — keduanya pakai angka hari 0(minggu)-6(sabtu), sama dengan `dayjs().day()`. Kalau salah satu diubah tanpa mengubah yang lain, submit angsuran bisa mulai gagal dengan pesan "Hari Tidak Sama" padahal user tidak melakukan apa-apa (karena field sudah `disabled`, dia tidak akan bisa memperbaikinya sendiri).

Terverifikasi: dicek manual 4 skenario offset hari (cocok hari ini, mundur 1-6 hari, lintas pekan) — hasil `getLastDateForHari()` cocok dengan logika `previous($dayOfWeek)` Carbon. Vite HMR memproses `BayarAngsuran.jsx` tanpa error compile. `data.transaction_date` tetap terkirim benar saat submit meski input `disabled` (Inertia `useForm` baca dari state React, bukan dari DOM input).

---

## S. "Isi Angsuran" + "Rincian Nasabah" digabung jadi Tab, "Detail Nasabah" tidak lagi tabel

Susulan bagian O/Q/R, di `Action.jsx`/`BayarAngsuran.jsx` yang sama.

| Berkas | Fungsi / Method | Route / Controller terdampak | Tabel tersentuh | Dampak |
|---|---|---|---|---|
| `resources/js/Pages/NewAngsuran/Components/Action.jsx` | blok atas modal | `mobile_apps.angsuran`, `pinjaman.index_pinjaman`, `mobile_apps.byDates`, `mobile_apps.macet` (dipakai berempat) | — | Form pembayaran + detail nasabah (dulu 2 Card terpisah ditumpuk) digabung jadi 1 `Tabs` di dalam 1 Card: tab **"Input Angsuran"** (dulu "Isi Angsuran") & tab **"Detail Nasabah"** (dulu "Rincian Nasabah") |
| idem | `CustomerDetail` (rename dari `MobileCardList`) | idem | — | Sekarang dipakai **di semua lebar layar** (bukan cabang khusus mobile lagi) — tabel 14 kolom `PinjamanWebTable` **dibuang total** (bukan cuma disembunyikan). `useIsMobile`/`isMobile` juga dibuang karena tidak ada lagi percabangan device |
| `resources/js/Pages/NewAngsuran/Components/BayarAngsuran.jsx` | pembungkus form | idem | — | `<Card><CardHeader><CardTitle>Isi Angsuran</CardTitle>...` → `<div>` polos (tanpa judul) — judulnya sekarang cukup dari label Tab, supaya tidak dobel & tidak jadi Card-di-dalam-Card |

Terverifikasi: `php -l` (n/a untuk jsx, dicek manual keseimbangan tag), Vite HMR akhirnya bersih setelah sempat ada 1 error transient "Expected corresponding JSX closing tag" di tengah proses edit bertahap (ketika tag pembuka `<div>` sudah diganti tapi tag penutup `</Card>` belum, sebelum edit kedua menyusul) — state akhir sudah valid, dikonfirmasi ulang lewat `npx prettier --check` dan HMR sukses berturut-turut.

---

## T. Tab "Detail Pinjaman" ditambah field proses lengkap (pinjaman ke, tanggal & user tiap tahap)

User menunjukkan tab ini isinya bukan cuma identitas nasabah tapi seharusnya seluruh riwayat pinjaman — diminta tambah `pinjaman_ke`, tanggal pengajuan/ACC/drop, dan siapa yang mengerjakan tiap tahap (input, ACC, drop).

| Berkas | Fungsi / Method | Route / Controller terdampak | Tabel tersentuh | Dampak |
|---|---|---|---|---|
| `app/Http/Controllers/TransactionLoanController.php` | `get_loan_pinjaman()` | `pinjaman.get_loan_pinjaman` (dipanggil `Action.jsx`) | `transaction_loans`, `employees` — BACA (eager-load `userinput`, `pemeriksa`, `pencair`, `manage_customer.loan`, sebelumnya tidak dimuat) | Response `pinjaman` ditambah: `pinjaman_ke`, `tanggal_pengajuan` (`request_date`, sebelumnya di-comment-out), `tanggal_acc` (`check_date`), `diinput_oleh`/`acc_oleh`/`drop_oleh` (nama karyawan dari relasi `userinput`/`pemeriksa`/`pencair`) |
| `resources/js/Pages/NewAngsuran/Components/Action.jsx` | `LoanDetail` (rename dari `CustomerDetail`) | idem | — | Grid label/nilai ditambah 2 baris blok baru: identitas & lokasi (+ Pinjaman Ke), riwayat proses (tanggal + siapa mengerjakan tiap tahap). Tab di-rename **"Detail Nasabah" → "Detail Pinjaman"** karena memang bukan cuma soal nasabah |

> **Temuan penting**: kolom `transaction_loans.pinjaman_ke` di database **selalu `NULL` untuk SEMUA 1.954.554 baris** — tidak pernah ditulis di manapun (dicek via tinker: `whereNotNull('pinjaman_ke')->count()` = 0). Tempat lain di kodebase (`PinjamanTrait::getTransactionLoan()`, dipakai Buku Transaksi) **tidak membaca kolom itu** — mereka menghitungnya on-the-fly: `manage_customer->loan->where('drop_date','<=',...)->where('status','success')->count()`. Saya ikuti pola yang sama di `get_loan_pinjaman()` (bukan baca `$loan->pinjaman_ke` langsung, yang akan selalu kosong). Terverifikasi lewat tinker dengan data nyata: nasabah dengan 1 pinjaman → `pinjaman_ke: 1`; nasabah dengan riwayat 15 pinjaman sukses → pinjaman terbarunya `pinjaman_ke: 15`.

Terverifikasi: `php -l` bersih, tinker dengan 2 skenario data nyata (nasabah baru & nasabah lama) mengembalikan semua field terisi benar. Vite HMR memproses `Action.jsx` tanpa error.

---

## U. Fitur "Pengajuan" (top-up/refinance) diaktifkan — gerbang saldo, domisili/nomor anggota, auto-lunas pinjaman lama

Fitur besar, melibatkan 2 migrasi skema baru. Card "Action" (`Pengajuan.jsx`) sebelumnya punya tombol "Pengajuan" yang **di-hardcode `disabled={true}`** — tidak pernah bisa dipakai. Formnya sendiri (`PengajuanLama.jsx`) dan endpoint-nya (`store_pengajuan_lama()`) sudah ada tapi belum lengkap dan punya bug urutan (lihat di bawah). Diaktifkan dengan tambahan: gerbang kelayakan, 2 field baru per manage_customer, dan auto-pelunasan pinjaman lama yang dipindah waktunya supaya tidak prematur.

**2 keputusan yang dikonfirmasi user sebelum dikerjakan:**
1. Auto-lunas membuat **baris angsuran beneran** (`TransactionLoanInstalment`) senilai sisa saldo — bukan cuma ubah status, supaya muncul jelas di riwayat angsuran.
2. Penandaan LUNAS + pembuatan baris angsuran itu dipindah dari **saat pengajuan disubmit** (perilaku lama, prematur) ke **saat pinjaman baru benar-benar berhasil di-drop** (status berubah jadi `success`).

### Migrasi baru

| Migrasi | Tabel | Kolom | Alasan |
|---|---|---|---|
| `2026_08_03_155940_add_nomor_anggota_to_transaction_manage_customers_table.php` | `transaction_manage_customers` | `nomor_anggota` (string, nullable di DB — 1,9jt+ baris lama tidak punya nilai; wajib ditegakkan di validasi form) | Manual input, per permintaan user |
| `2026_08_03_155941_add_previous_loan_id_to_transaction_loans_table.php` | `transaction_loans` | `previous_loan_id` (nullable, indexed, tanpa FK constraint — mengikuti konvensi kolom id lain di tabel ini) | Penghubung "pinjaman baru → pinjaman lama yang dilunaskan", **tidak ada mekanisme serupa sebelumnya** (`drop_before`/`drop_date_before` cuma snapshot nilai, bukan referensi ID) |

> **Temuan**: `transaction_manage_customers.residential_address` (nullable) **sudah ada** sejak migrasi Nov 2024 tapi **tidak pernah dipakai di manapun** — persis field "Domisili Nasabah" yang diminta. Tidak perlu migrasi baru untuk itu, tinggal disambungkan.

### Perubahan kode

| Berkas | Fungsi / Method | Route / Controller terdampak | Tabel tersentuh | Dampak |
|---|---|---|---|---|
| `app/Models/TransactionManageCustomer.php` | fillable | — | — | Tambah `nomor_anggota` |
| `app/Models/TransactionLoan.php` | fillable, relasi `previousLoan()` (**BARU**), hook `updating` (**BARU**) | `pinjaman.store_pengajuan_lama`, `transaction.action_buku_transaksi` | `transaction_loans` — TULIS, `transaction_loan_instalments` — TULIS (lewat hook) | Hook baru: begitu `status` berubah jadi `'success'` DAN `previous_loan_id` terisi → hitung sisa saldo pinjaman lama, buat 1 baris `TransactionLoanInstalment` senilai itu (tanggal = tanggal drop pinjaman baru, catatan otomatis), lalu set `transaction_out_reasons_id = 1` (LUNAS). `total_angsuran`/`out_date`/`out_status` pinjaman lama ikut terhitung ulang lewat hook `TransactionLoanInstalment::creating()` yang sudah ada (bagian D). **Bukan bagian dari alur rekap yang dihapus 2026-08-02** — dikomentari eksplisit di kode supaya tidak tertukar |
| `app/Http/Controllers/TransactionLoanController.php` | `store_pengajuan_lama()` | `pinjaman.store_pengajuan_lama` | `transaction_manage_customers` — TULIS (`nomor_anggota`, `residential_address`), `transaction_loans` — TULIS (`previous_loan_id` ditambahkan ke `create()`) | Validasi tambah `nomor_anggota` (required) & `residential_address` (nullable). **Baris `out_date`/`transaction_out_reasons_id` yang dulu di-set seketika saat submit — DIHAPUS** (pindah ke hook, lihat di atas) |
| idem | `get_loan_pinjaman()` | `pinjaman.get_loan_pinjaman` | `transaction_manage_customers` — BACA | Response ditambah `saldo` (dipakai gerbang kelayakan) dan `domisili` (`residential_address`); `nomor_anggota` diperbaiki dari `manage_customer->id` (ID mentah) jadi `manage_customer->nomor_anggota` (field baru) |
| `resources/js/Pages/NewAngsuran/Components/Pengajuan.jsx` | `canAjukanPengajuan()` (**BARU**) | — | — | Tombol "Pengajuan" tidak lagi `disabled={true}` permanen — gerbang: `saldo/pinjaman <= 0.4` DAN `status_pinjaman` masih `normal`/`cm` (bukan `mb`/`ml`). Tidak eligible → tombol `disabled` + teks `text-amber-600` menjelaskan syaratnya (pola gerbang konsisten dengan bagian H) |
| `resources/js/Pages/NewAngsuran/Components/PengajuanLama.jsx` | form | `pinjaman.store_pengajuan_lama`, `pinjaman.checkpengajuan` | — | Tambah 3 field: **Kelompok** (read-only, dari pinjaman yang sedang dibuka), **Nomor Anggota** (required), **Domisili Nasabah** (optional, placeholder + keterangan pakai alamat identitas kalau kosong). `request_date` default diganti dari `dayjs()` polos jadi `getLastDateForHari(hari)` (sama seperti bagian R — harus sehari dengan hari koleksi, kalau tidak server tolak "Hari Tidak Sama"). Import `axios` eksplisit ditambahkan (sebelumnya cuma jalan lewat `window.axios` global) |
| `resources/js/lib/utils.js` | `getLastDateForHari()` (**dipindah ke sini, BARU sebagai shared util**) | — | — | Diekstrak dari `BayarAngsuran.jsx` (bagian R) supaya dipakai bersama 2 form yang sama-sama butuh tanggal default sehari dengan hari koleksi pinjaman |

**Terverifikasi lewat tinker** (dibungkus transaksi, di-`rollBack()` di akhir — tidak ada perubahan permanen di data): pinjaman lama nyata (pinjaman=1.040.000, saldo=285.000, ≈27%) dibuatkan pinjaman baru dengan `previous_loan_id` mengarah ke situ, lalu disimulasikan drop sukses (`status` → `success`). Hasilnya persis sesuai desain: baris angsuran otomatis nominal **285.000** (pas sisa saldo) dengan catatan `"Pelunasan otomatis - digantikan pengajuan #<id>"`, pinjaman lama `total_angsuran` jadi penuh, `out_status` = `LUNAS`, `transaction_out_reasons_id` = `1`.

> **Belum dikerjakan (di luar cakupan yang diminta)**: field `nomor_anggota` yang baru belum ditambahkan ke tampilan tab "Detail Pinjaman" (`LoanDetail` di `Action.jsx`) — di sana masih menampilkan `customerData.id` (id pinjaman) sebagai "Nomor". Kalau mau `nomor_anggota` juga tampil di situ, perlu diminta terpisah.

### U.1 — Perbaikan pelanggaran "single source of truth database"

Kedua migrasi di atas **awalnya dibuat & dijalankan langsung dari `unit-apps`** (`docker exec unit-app php artisan migrate`) — melanggar aturan tertulis di `app_laravel/.agents/AGENTS.md`: *"Semua perubahan skema database (migration)... WAJIB dibuat dan dijalankan dari proyek app_laravel, karena app_laravel dan unit-apps berbagi 1 database yang sama."* User menegur & meminta diperbaiki.

**Konfirmasi**: `unit-apps` (`DB_HOST=laravel-db`) dan `app_laravel` (`DB_HOST=db`) memang benar-benar 1 database fisik `ubmi_db` yang sama — dicek lewat `DB::connection()->getDatabaseName()` dari kedua sisi, dan tabel `migrations`-nya **satu tabel yang sama** (2 migrasi baru tercatat batch 18, tepat setelah migrasi `app_laravel` batch 17).

**Perbaikan** (dipilih user: salin file ke app_laravel + tandai sudah jalan, tanpa re-run):
- 2 file migrasi disalin **persis sama** (nama file sama persis) ke `app_laravel/database/migrations/`.
- Tidak perlu manipulasi tabel `migrations` secara manual — karena nama filenya identik dan tabel `migrations`-nya memang satu yang sama, Laravel di sisi `app_laravel` otomatis mengenali keduanya sebagai **sudah dijalankan** (`php artisan migrate:status` dari `laravel-app` menampilkan `[18] Ran` untuk keduanya; `php artisan migrate --pretend` mengonfirmasi "Nothing to migrate" — tidak ada risiko duplicate-column).
- File migrasi di `unit-apps/database/migrations/` **tidak dihapus** (tidak diminta) — sekarang ada di kedua repo dengan isi identik.

> **Temuan tambahan**: ke-21 migrasi `unit-apps` yang sudah ada SEBELUM sesi ini ternyata **juga** tercatat pernah dijalankan langsung dari `unit-apps` (bukan cuma 2 migrasi baru ini) — jadi pelanggaran pola ini sudah terjadi berulang kali di masa lalu, bukan hal baru. Tidak diperbaiki mundur (di luar cakupan yang diminta), cuma dicatat sebagai konteks.

---

## V. Nasabah yang sudah diajukan tidak bisa diajukan lagi — `checkpengajuan()` diperbaiki total, dipakai `previous_loan_id`

`checkpengajuan()` sebelumnya rusak/tidak lengkap: `loan_out_status` dibaca dari `transaction_out_reasons_id` (tidak pernah benar-benar mendeteksi "sudah ada pengajuan pengganti"), dan `cek_pengajuan` (daftar pinjaman lain nasabah ini) dihitung tapi **tidak pernah dipakai di frontend** — makanya form pengajuan bisa disubmit berkali-kali untuk nasabah yang sama walau sudah punya pengajuan berjalan. Sekarang memakai `previous_loan_id` (bagian U) yang memang dibuat untuk hubungan ini.

| Berkas | Fungsi / Method | Route / Controller terdampak | Tabel tersentuh | Dampak |
|---|---|---|---|---|
| `app/Http/Controllers/TransactionLoanController.php` | `checkpengajuan()` — ditulis ulang total | `pinjaman.checkpengajuan` | `transaction_loans` — BACA (`previous_loan_id`, eager-load `loan_officer_grouping`) | Cek pinjaman dengan `previous_loan_id = id pinjaman ini` dan status **`open`/`acc`/`success`** (masih berjalan) → `{sudah_diajukan: true, pengajuan: {id, request_date, tanggal_drop, status, nominal_drop, request_nominal, kelompok}}`. Status `tolak`/`gagal` **TIDAK dihitung "sudah diajukan"** — kalau pengajuan penggantinya gagal/ditolak, nasabah boleh diajukan lagi |
| `resources/js/Pages/NewAngsuran/Components/PengajuanLama.jsx` | `existingPengajuan` (state, ganti `isActiveTarget` yang cuma boolean tanpa isi) | idem | — | Placeholder polos `"Ada Pengajuan"` diganti panel ringkasan: status, tanggal drop, nominal (drop kalau sudah `success`, request kalau masih `open`/`acc`) + link **"Lihat Drop Hari Itu"** ke `route('pinjaman.index_pinjaman', {date, kelompok})` (pola sama seperti link tanggal di `BukuTransaksi/Rencana.jsx`) |

Terverifikasi lewat tinker (dibungkus transaksi, di-rollback — tidak ada perubahan permanen), 3 skenario data nyata:
```
Belum ada pengganti          -> {"sudah_diajukan":false,"pengajuan":null}
Pengganti status 'open'      -> {"sudah_diajukan":true,"pengajuan":{...lengkap...}}
Pengganti ditolak ('tolak')  -> {"sudah_diajukan":false,"pengajuan":null}  <- boleh ajukan lagi
```

`php -l` bersih, Vite HMR memproses `PengajuanLama.jsx` tanpa error compile.

---

## W. Fitur "Tundaan" (pindah tanggal drop) + kunci input Angsuran saat pengganti masih pending

Fitur besar, 1 migrasi baru (dari `app_laravel`, mengikuti perbaikan bagian U.1). Di modal Drop (`BukuTransaksi/Action.jsx` → `Acc.jsx`, dipakai bersama `/mobile_apps/transaksi` & `/bukutransaksi` - dikonfirmasi 1 komponen, bukan 2), pengajuan yang sudah **`acc`** sekarang punya tombol **"Tundaan"** untuk memindah tanggal drop tanpa mengulang proses ACC.

### Migrasi baru (dari `app_laravel`, benar sejak awal kali ini)

| Migrasi | Kolom | Alasan |
|---|---|---|
| `2026_08_03_132507_add_postponed_loan_id_to_transaction_loans_table.php` | `transaction_loans.postponed_loan_id` (nullable, indexed, tanpa FK) | Penghubung "pengajuan baru hasil Tundaan → pengajuan lama yang ditunda". **Sengaja terpisah dari `previous_loan_id`** (top-up/refinance, bagian U) — kalau dipakai kolom yang sama, hook auto-pelunasan bisa salah nembak Tundaan sebagai pelunasan pinjaman lain (dikonfirmasi ke user sebelum dikerjakan). |

### Perubahan kode

| Berkas | Fungsi / Method | Route / Controller terdampak | Tabel tersentuh | Dampak |
|---|---|---|---|---|
| `app/Models/TransactionLoan.php` | fillable, relasi `postponedFrom()` (**BARU**) | — | — | Tidak ada hook baru di sini — Tundaan **tidak** memicu auto-pelunasan (itu cuma untuk `previous_loan_id`/top-up) |
| `app/Http/Controllers/TransactionLoanController.php` | `tundaan_pengajuan()` (**BARU**) | `POST transaction.tundaan_pengajuan` (**route baru**) | `transaction_loans` — TULIS | Cuma boleh saat status pengajuan `acc`. Bikin pengajuan baru: `postponed_loan_id` → pengajuan lama, `previous_loan_id` **disalin/diperpanjang** dari pengajuan lama (supaya kalau pengajuan ini sendiri adalah top-up, hook auto-pelunasan tetap menemukan pinjaman ASLI walau sudah berapa kali ditunda), `approved_nominal`/`user_check`/`check_date` diwariskan → status langsung **`acc`** lagi (KM tidak perlu approve ulang). Pengajuan lama **cuma diubah statusnya jadi `gagal`, TIDAK dihapus** |
| idem | `get_loan_pinjaman()` | `pinjaman.get_loan_pinjaman` | `transaction_loans` — BACA | Response ditambah `pengajuan_pengganti` (`{id, drop_date, status}` atau `null`) — pengajuan top-up yang masih `open`/`acc` untuk pinjaman ini, dipakai gerbang baru di Angsuran |
| `routes/web.php` | — | `POST /bukutransaksi/tundaan/{transactionLoan}` (**BARU**) | — | Middleware sama dengan route `bukutransaksi.*` lain (role superuser/pimpinan/kasir/mantri/kepala-mantri/pengawas/stafkontrol); gerbang akses sebenarnya di dalam method (`can-approve`) |
| `resources/js/Pages/BukuTransaksi/Components/Tundaan.jsx` (**BARU**) | tombol + form 1 field (tanggal drop baru, default +7 hari dari tanggal lama, editable, `min` = besok dari tanggal lama) | `transaction.tundaan_pengajuan` | — | Muncul sebagai tombol di `Acc.jsx` saat status `acc` DAN `can-approve` |
| `resources/js/Pages/BukuTransaksi/Components/Acc.jsx` | render `Tundaan` | idem | — | Tombol ditaruh sebaris dengan DROP/GAGAL (`flex-wrap` — form Tundaan yang terbuka jadi `w-full`, otomatis pindah baris) |
| `resources/js/Pages/NewAngsuran/Components/Action.jsx` | `angsuranGateValue` (**BARU**, terpisah dari `gateValue`) | — | — | Gerbang KHUSUS tab "Input Angsuran": kalau `pengajuan_pengganti` ada DAN `drop_date`-nya PAS sama dengan tanggal koleksi hari ini (`getLastDateForHari(hari)`) → input dikunci (`NoEditOverlay` + alasan). **Tidak memengaruhi** tab "Detail Pinjaman" atau kartu Pengajuan/Jenis Nasabah — keduanya tetap pakai `gateValue` lama |

**Alur lengkap** (kenapa perlu dikunci): pinjaman lama sedang di-top-up (fitur "Pengajuan", bagian U) → pengajuan penggantinya `open`/`acc` menunggu drop di tanggal X → **kalau tanggal X = tanggal koleksi hari ini**, input angsuran manual dikunci (mencegah bentrok dengan auto-pelunasan `TransactionLoan::boot()` kalau ternyata hari itu juga di-drop sukses) → kalau pengganti itu `gagal` (dengan/tanpa Tundaan sebelumnya), kunci lepas sendiri (boleh input manual, "soalnya kalau gagal kadang bayar tidak sama seperti sisa saldo" - alasan user) → kalau malah kena **Tundaan**, tanggal lama kebuka tapi tanggal baru (hasil Tundaan) yang gantian terkunci — siklus berulang sampai lunas atau gagal permanen.

**Terverifikasi lewat tinker** (2 uji, dibungkus transaksi + `rollBack()` — tidak ada perubahan permanen):
```
# Tundaan
loan acc dibuat, drop_date=2026-08-10 -> Tundaan ke 2026-08-17
loan lama: status=gagal (bukan dihapus)
loan baru: status=acc, drop_date=2026-08-17, approved_nominal & user_check terwarisi

# Kunci Angsuran
Belum ada pengganti           -> pengajuan_pengganti=null (bebas input)
Pengganti pending, tgl = hari ini -> pengajuan_pengganti={id,drop_date,status} (terkunci)
Pengganti gagal                -> pengajuan_pengganti=null lagi (bebas input lagi)
```

`php -l` bersih di semua berkas PHP, Vite HMR memproses semua berkas JS tanpa error compile.

---

## W.1 — Bug: tombol "Tundaan" cuma refresh, tidak membuat transaksi baru

User melaporkan: klik "Tunda ke Tanggal Ini" tidak menghasilkan apa-apa. Penyebab: `Tundaan.jsx` merender `<form>` sendiri untuk field tanggal, padahal komponen ini dipasang di dalam `<form>` milik `Acc.jsx` (`Acc.jsx` membungkus SELURUH kartu ACC/Drop dengan satu `<form onSubmit={(e) => e.preventDefault()}>`). **`<form>` bersarang tidak valid di HTML** — tombol submit di dalamnya bisa "diklaim" oleh form terluar (yang cuma `preventDefault()`, no-op), bukan memicu handler `Tundaan.jsx` sendiri.

| Berkas | Fungsi/Method | Route/Controller terdampak | Tabel tersentuh | Dampak |
|---|---|---|---|---|
| `resources/js/Pages/BukuTransaksi/Components/Tundaan.jsx` | render form | `transaction.tundaan_pengajuan` | — | `<form onSubmit={submit}>` → `<div>` biasa; submit ditangani manual lewat `onClick` di tombol (`type="button"`, bukan `type="submit"`) — tidak lagi bergantung pada event `submit` form yang ambigu saat bersarang. Error display juga digeneralisasi (`Object.values(errors)[0]` bukan cuma `errors.tanggal_drop`) supaya pesan dari guard `can-approve`/status `acc` di controller (yang di-`withErrors()` tanpa key field) ikut kelihatan, bukan cuma validasi tanggal |

Vite HMR memproses `Tundaan.jsx` tanpa error compile. Logika controller (`tundaan_pengajuan()`) tidak diubah — sudah diverifikasi benar lewat tinker di bagian W, masalahnya murni di penanganan submit form React/HTML.

---

## W.2 — Tundaan: status jadi 'open' (bukan 'acc'), badge "TD"

User: kadang nasabah yang ditunda malah ditolak KM saat itu juga — jadi pengajuan hasil Tundaan **tidak boleh** langsung `acc`, harus tetap lewat ACC/Tolak seperti pengajuan baru. Sekalian ditambah penanda visual supaya kelihatan mana pengajuan yang berasal dari Tundaan.

| Berkas | Fungsi/Method | Route/Controller terdampak | Tabel tersentuh | Dampak |
|---|---|---|---|---|
| `app/Http/Controllers/TransactionLoanController.php` | `tundaan_pengajuan()` | `transaction.tundaan_pengajuan` | `transaction_loans` — TULIS | Pengajuan baru sekarang dibuat **`status: 'open'`** (bukan `'acc'`) — `approved_nominal`/`user_check`/`check_date` TIDAK lagi diwariskan (dikosongkan), supaya form ACC di `Acc.jsx` benar-benar minta KM meninjau ulang dari nol, termasuk kemungkinan Tolak. `pinjaman` (kolom, bukan `pinjaman`-DTO) tetap tidak diisi di sini — memang selalu kosong sampai tahap `success`, konsisten dengan alur `store_buku_transaksi()` |
| `app/Traits/PinjamanTrait.php` | `getTransactionLoan()` | `transaction.index_buku_transaksi`, `mobile_apps.transaksi` | `transaction_loans` — BACA | Tambah field `is_tundaan` (`(bool) $drop->postponed_loan_id`) ke data yang dikirim ke `BukuTransaksiKepala.jsx`/`BukuTransaksi.jsx`/`ActionTable.jsx` |
| `resources/js/Pages/BukuTransaksi/BukuTransaksiKepala.jsx` | badge kartu | idem | — | Badge **"TD"** (`AppBadge variant="primary"`) muncul di depan badge jenis/status kalau `item.is_tundaan` |
| `resources/js/Pages/BukuTransaksi/Components/ActionTable.jsx` | badge tab "Detail Pinjaman" | idem | — | Sama, `AppBadge` — konsisten dengan kartu |
| `resources/js/Pages/BukuTransaksi/BukuTransaksi.jsx` | badge kolom "Tgl Drop" (tabel desktop) | idem | — | Badge "TD" pakai `BadgeStatus` (bukan `AppBadge`) — file ini belum dimigrasikan ke `AppBadge` (aturan sesi ini: satu per satu, cuma kalau diminta), jadi ikut pola lama supaya konsisten dengan badge lain di baris yang sama |
| `resources/js/Components/shadcn/BadgeStatus.jsx` | `variantMap` | — | — | Tambah key `td: 'blue'` — murni aditif, tidak mengubah pemetaan nilai lain yang sudah dipakai di banyak halaman lain |

Terverifikasi lewat tinker (dibungkus transaksi + `rollBack()`): loan lama tetap `gagal`, loan baru `status=open` dengan `approved_nominal`/`user_check` `NULL` (bukan terwarisi lagi), `postponed_loan_id` tetap ter-set (jadi badge "TD" tetap terdeteksi walau statusnya sekarang `open`, bukan `acc`). Vite HMR bersih di semua berkas.

---

## X. Pinjaman yang sudah diajukan pengganti tidak bisa di-Reset / dihapus

Pinjaman yang sudah dijadikan dasar pengajuan lain yang masih aktif (top-up ATAU Tundaan) sekarang diblokir dari Reset Status & Hapus Pinjaman, di frontend MAUPUN backend (bukan cuma tombol disabled — endpoint-nya sendiri menolak).

| Berkas | Fungsi/Method | Route/Controller terdampak | Tabel tersentuh | Dampak |
|---|---|---|---|---|
| `app/Traits/PinjamanTrait.php` | `getTransactionLoan()` | `transaction.index_buku_transaksi`, `mobile_apps.transaksi` | `transaction_loans` — BACA (1 query batch untuk semua baris di halaman, bukan per-baris/N+1) | Tambah field `sudah_diajukan_pengganti` (bool) — true kalau ada pinjaman lain dengan `previous_loan_id`/`postponed_loan_id` = id pinjaman ini, status `open`/`acc`/`success` |
| `app/Helpers/AppHelper.php` | `sudahDiajukanPengganti()` (**BARU**), `canDeleteLoan()` | `pinjaman.destroy_loan` | `transaction_loans` — BACA | Gerbang baru dicek **paling awal**, sebelum aturan mantri/can-approve, tanpa pengecualian role apa pun |
| `app/Http/Controllers/TransactionLoanController.php` | `updateEverything()` — cabang `resetdata` | `transaction.updateEverything` | `transaction_loans` — BACA | Guard sama ditambahkan sebelum reset dieksekusi — server menolak walau request dikirim langsung (bypass tombol UI) |
| `resources/js/Pages/BukuTransaksi/Components/ChangeDetail.jsx` | `bolehReset` | idem | — | Kondisi ketiga: `!triggeredData?.sudah_diajukan_pengganti`. Pesan `text-destructive`: "Transaksi ini sudah diajukan..." |
| `resources/js/Pages/BukuTransaksi/Components/RemoveLoan.jsx` | gerbang `bolehHapus` | `pinjaman.destroy_loan` | — | Dicek **paling awal**, sebelum cabang mantri/can-approve — pesan sama, `severity: 'destructive'` |

> **Temuan sampingan saat verifikasi tinker**: kolom `transaction_loans.pinjaman` ternyata **generated column** (`nominal_drop * 1.3`, `STORED`) — tidak bisa ditulis manual lewat `create()`/`update()` (MySQL error 1906 kalau dicoba). Dicatat di `02_database_schema.md`.

Terverifikasi lewat tinker (dibungkus transaksi + `rollBack()`), 3 skenario data nyata:
```
Belum ada pengganti          -> canDeleteLoan={"status":true}
Pengganti status 'open'      -> canDeleteLoan={"status":false,"message":"Transaksi ini sudah diajukan..."}
Pengganti 'gagal'            -> canDeleteLoan={"status":true}  <- boleh dihapus lagi
```

`php -l` bersih di semua berkas PHP, Vite HMR memproses semua berkas JS tanpa error compile.

---

## X.1 — Keterangan gerbang Reset Pinjaman ditumpuk, dirapikan jadi 1 pesan saja

User: kalau ada beberapa alasan blokir (rekap terkunci, sudah diajukan pengganti) ditumpuk semua, jadi kebanyakan teks & membingungkan. Maunya: tombol bisa diklik → tampilkan keterangan dasar (cara pakai); tombol mati → tampilkan SATU alasan paling relevan saja, bukan semua yang berlaku sekaligus.

| Berkas | Fungsi/Method | Dampak |
|---|---|---|
| `resources/js/Pages/BukuTransaksi/Components/ChangeDetail.jsx` | `pesanTidakBisa` (**BARU**) | Sebelumnya: 2 baris keterangan dasar SELALU tampil saat `canApprove`, ditambah `terkunciRekap && (...)` dan `terkunciPengganti && (...)` yang bisa tampil BERSAMAAN → sampai 4 baris teks sekaligus. Sekarang: satu variabel prioritas (`!canApprove` → `terkunciPengganti` → `terkunciRekap` → `null`) - render **salah satu saja**: pesan blokir tunggal (kalau ada) ATAU 2 baris keterangan dasar (kalau tidak ada blokir sama sekali) |

`RemoveLoan.jsx` **tidak diubah** — sudah benar dari awal (if/else-if berurutan, cuma 1 `pesanTerkunci` yang pernah dirender, dan tanpa keterangan sama sekali saat tombol boleh diklik).

Vite HMR bersih.

---

## Y. Reset/Hapus pinjaman pemicu auto-pelunasan sekarang membongkar efeknya (bukan diblokir)

Saat mengaudit ulang alur Pengajuan/Tundaan (diminta user), ditemukan celah: kalau L2 (top-up yang sudah sukses drop dan sudah memicu auto-pelunasan di L1, bagian U) di-Reset atau dihapus, baris angsuran pelunasan yang sudah terlanjur dibuat di L1 **tidak ikut terhapus/dibatalkan** — L1 tetap tercatat LUNAS walau L2 penyebabnya sudah tidak valid lagi.

**Keputusan desain (dikonfirmasi user)**: BUKAN diblokir permanen — user menegaskan transaksi hari ini harus tetap bebas diubah selama belum ada sistem lock (menyusul, dibahas terpisah). Solusinya: bikin efek sampingnya **reversibel**, simetris dengan cara ia dibuat.

### Migrasi baru (dari `app_laravel`)

| Migrasi | Kolom | Alasan |
|---|---|---|
| `2026_08_04_072544_add_settled_by_loan_id_to_transaction_loan_instalments_table.php` | `transaction_loan_instalments.settled_by_loan_id` (nullable, indexed, tanpa FK) | Menandai baris angsuran yang dibuat OTOMATIS oleh hook pelunasan, isinya = id pinjaman yang memicunya. Dipakai mencari-balik secara presisi saat mau dibongkar — sebelumnya cuma ada `instalment_notes` (teks bebas, tidak bisa diquery presisi) |

### Perubahan kode

| Berkas | Fungsi/Method | Route/Controller terdampak | Tabel tersentuh | Dampak |
|---|---|---|---|---|
| `app/Models/TransactionLoanInstalment.php` | fillable | — | — | Tambah `settled_by_loan_id` |
| `app/Models/TransactionLoan.php` | hook `updating` (bagian pembuatan) | `transaction.action_buku_transaksi`, `pinjaman.store_pengajuan_lama` | `transaction_loan_instalments` — TULIS | Baris settlement yang dibuat sekarang ikut diberi `settled_by_loan_id` |
| idem | hook `updating` (**diperluas**) | `transaction.updateEverything` (resetdata) | `transaction_loan_instalments` — TULIS (hapus), `transaction_loans` — TULIS | Kalau `status` berubah **DARI** `'success'` (Reset Pinjaman mengembalikannya ke `'open'`) DAN `previous_loan_id` terisi → panggil `reverseAutoSettlement()`. Ditangkap otomatis lewat hook yang sudah ada (Reset di controller cuma `update()` biasa, tidak perlu diubah) |
| idem | hook `deleting` (**diperluas**) | `pinjaman.destroy_loan` | sama | Sebelum pinjaman ini benar-benar hilang, kalau `previous_loan_id` terisi → `reverseAutoSettlement()` dulu |
| idem | `reverseAutoSettlement()` (**BARU**, private static) | — | `transaction_loan_instalments` — BACA+HAPUS, `transaction_loans` — TULIS | Cari baris via `settled_by_loan_id = id pinjaman ini` → hapus (otomatis memicu `TransactionLoanInstalment::deleting()` yang sudah ada, menghitung ulang `total_angsuran`/`out_date`/`out_status` pinjaman lama) → bersihkan `transaction_out_reasons_id` pinjaman lama **hanya kalau nilainya masih `1`** (LUNAS - satu-satunya nilai yang kita sendiri yang set, jadi aman dibersihkan tanpa menimpa alasan keluar lain) |

**Tundaan tidak butuh logic ini** — dia tidak pernah membuat baris angsuran otomatis di pinjaman manapun (cuma pindah status + klon), jadi Reset/Hapus di jalur itu sudah otomatis konsisten.

Terverifikasi lewat tinker (dibungkus transaksi + `rollBack()`), 2 skenario penuh dengan data yang benar-benar dibuat (bukan cuma cek logic kosong):
```
# Reset
L2 sukses drop  -> L1: total_angsuran=650000, out_status=LUNAS, reason=1, baris settlement ADA (650000)
L2 di-Reset     -> L1: total_angsuran=0, out_status=NULL, reason=NULL, baris settlement TERHAPUS

# Hapus
L2 sukses drop  -> L1: total_angsuran=390000, reason=1
L2 dihapus      -> L1: total_angsuran=0, out_status=NULL, reason=NULL, baris settlement TERHAPUS, L2 sendiri terhapus
```

`php -l` bersih.

---

## Z. `/mobile_apps/macet` (dan kembarannya `/pinjaman/pinjaman-macet`) 500 — ghost permission bikin scope query jatuh ke kelompok invalid

User melaporkan `/mobile_apps/macet` error, curiga ada "2 menu macet". Benar — 2 route beda (`mobile_apps.macet` dan `pinjaman.index_pinjaman_macet`) sama-sama memanggil `PinjamanTrait::getLoanMacet()`, jadi sama-sama crash.

**Penyebab**: fungsi ini masih pakai `auth()->user()->can('can show branch')`/`can('can show kelompok')` — nama permission **ghost**, tidak pernah ada di tabel `permissions` (`can()` gagal-diam, selalu `false`, beda dari `hasPermissionTo()` yang melempar). Karena selalu `false`, kode selalu jatuh ke `$authorized->employee->area` untuk `$kelompok` — untuk role tanpa area spesifik (pimpinan, KM dst., `area` sering `0`), tidak ada `TransactionLoanOfficerGrouping` dengan `kelompok=0`, jadi query groupingnya `null`, lalu `$groupingId->id` di baris berikutnya → **500: "Attempt to read property 'id' on null"**. Dikonfirmasi dari `storage/logs/laravel.log`, error berulang untuk user pimpinan (`employee.area=0`).

| Berkas | Fungsi/Method | Route/Controller terdampak | Tabel tersentuh | Dampak |
|---|---|---|---|---|
| `app/Traits/PinjamanTrait.php` | `getLoanMacet()` | `mobile_apps.macet`, `pinjaman.index_pinjaman_macet` | `transaction_loans` — BACA | Resolusi `$branch_id`/`$wilayah`/`$kelompok` diganti dari ghost-permission ad-hoc jadi `AuthScope::resolve()` — disamakan dengan fungsi tetangganya `getLoanByDate()` yang sudah lebih dulu benar (dan tidak pernah dilaporkan error). Sekalian ditambah null-safety (`?->`) pada `OnlineBranch::where(...)->first()` yang juga berpotensi warning kalau cabang belum punya baris `OnlineBranch` |

> **Catatan penting**: perbaikan ini menyentuh pola (`can('can show branch'/'can show kelompok')`) yang di `05_temuan_dan_jebakan.md` bagian Z3 sebelumnya ditandai **"Sengaja DITINGGALKAN"** — TAPI catatan itu soal *flag tampilan* (`select_branch` dsb, yang memang sengaja selalu `false` sejak `GlobalBranchFilter`), bukan soal *resolusi scope untuk query* seperti kasus ini. Dokumen itu sudah saya perbarui membedakan dua jenis pemakaian ini secara eksplisit, supaya sesi berikutnya tidak salah kira "sudah dicek, jangan disentuh" untuk kasus yang sebenarnya beda (dan berpotensi crash).

Terverifikasi lewat tinker dengan user nyata yang error di log (`userId 1919`, role pimpinan, `employee.area=0`): kedua route sekarang render tanpa error. Diuji ulang juga dengan user mantri beneran (`area=1`) untuk pastikan tidak regresi — kelompok yang dipakai tetap sama seperti sebelumnya. `php -l` bersih.

---

## Z.1 — Filter `/mobile_apps/macet` & `/mobile_apps/byDates` disamakan dengan Drop/Angsuran (`FilterBar`)

`NewAngsuran/AngsuranByDate.jsx` dipakai 4 route sekaligus: `mobile_apps.macet`, `mobile_apps.byDates` (lewat `MobileApps/Angsuran/SearchByDate.jsx`) dan `pinjaman.index_pinjaman_macet`, `pinjaman.index_pinjaman_search` (lewat `WebView/Angsuran/SearchByDate.jsx`) — satu komponen, tapi tidak ada percabangan device sama sekali (beda dari `NewAngsuran/Angsuran.jsx`/`BukuTransaksi/Web/TransaksiMantri.jsx` yang sudah lebih dulu dibereskan). Masih dropdown `SearchComponent` di semua tempat.

| Berkas | Fungsi/Bagian | Route/Controller terdampak | Tabel tersentuh | Dampak |
|---|---|---|---|---|
| `resources/js/Pages/NewAngsuran/AngsuranByDate.jsx` | tambah prop `type` (default `'desktop'`) | `mobile_apps.macet`, `mobile_apps.byDates` | — | Cabang `type === 'mobile'`: dropdown `SearchComponent` diganti `FilterBar` (chip instan, hari/bulan/kelompok — `showMonth`/`showHari` mengikuti prop `searchMonth`/`searchHari` yang sudah ada, `searchMonth=false` untuk macet) + popover kecil "Unit" (`SearchComponent` cuma branch/groupingBranch). Cabang `type === 'desktop'` (`pinjaman.index_pinjaman_macet`, `pinjaman.index_pinjaman_search`) **TIDAK disentuh** — masih dropdown lama, sesuai pola yang sudah dipakai di `Angsuran.jsx` |
| `resources/js/Pages/MobileApps/Angsuran/SearchByDate.jsx` | `<AngsuranByDate type="mobile" .../>` | `mobile_apps.macet`, `mobile_apps.byDates` | — | Satu-satunya pemanggil yang mengirim `type="mobile"` — `WebView/Angsuran/SearchByDate.jsx` tidak diubah, otomatis tetap default `'desktop'` |

Detail teknis sama seperti bagian L/N: `FilterBar` diberi `extraParams={branch_id, wilayah}` supaya pilihan Unit tidak hilang saat ganti hari/bulan; `SearchComponent` (popover Unit) diberi `key={hari-month-kelompok}` supaya remount dan tidak submit nilai basi.

Vite HMR bersih di kedua berkas — tidak ada perubahan backend (route/controller `getLoanMacet()`/`getLoanByDate()` yang baru saja diperbaiki di bagian Z tidak disentuh lagi di sini).

---

## Z.2 — Cari nama di `/mobile_apps/macet` & `/mobile_apps/byDates`

User tanya apakah Laravel punya "search gaya baru" yang tahan typo (contoh: ketik "azis" ketemu "Aziz"). Laravel sendiri tidak punya ini bawaan — Scout (abstraksi search resmi Laravel) baru dapat toleransi typo kalau dipasangkan driver Algolia/Meilisearch/Typesense (infrastruktur baru).

Awalnya dicoba `SOUNDEX()` bawaan MySQL/MariaDB (pencocokan bunyi tanpa infra tambahan — S dan Z sama-sama kode SOUNDEX "2") sebagai `OR` tambahan di samping `LIKE`. **Dibatalkan atas permintaan user** — tanpa index, `SOUNDEX(nama) = SOUNDEX(?)` berarti MySQL menghitung ulang SOUNDEX tiap baris di seluruh tabel per pencarian (full scan), dan bikin index yang benar (generated column + index di atasnya) dianggap tidak sepadan usahanya untuk sekarang. **Jadi versi final: `LIKE` substring biasa saja, tanpa SOUNDEX.**

| Berkas | Fungsi/Method | Route/Controller terdampak | Tabel tersentuh | Dampak |
|---|---|---|---|---|
| `app/Traits/PinjamanTrait.php` | `getLoanMacet()`, `getLoanByDate()` | `mobile_apps.macet`, `mobile_apps.byDates`, `pinjaman.index_pinjaman_macet`, `pinjaman.index_pinjaman_search` (satu fungsi dipakai 4 route — filter ini otomatis berlaku di semua, termasuk desktop, karena ada di query backend bukan di komponen frontend yang sengaja dipisah per-device) | `transaction_loans`, `transaction_customers` — BACA | Tambah `->when($request->filled('nama'), ...)`: `whereHas('customer', ...)` dengan `WHERE nama LIKE '%...%'`. `nama` juga digemakan balik ke `server_filter` supaya frontend tahu apa yang sedang dicari |
| `resources/js/Pages/NewAngsuran/AngsuranByDate.jsx` | input "Cari nama nasabah..." (**BARU**, cabang `type === 'mobile'` saja) | idem (mobile) | — | Input teks dengan debounce 400ms (bukan pelanggaran kontrak "tanpa timer" `FilterBar` — debounce ini murni menunggu jeda ketikan USER, bukan timer/polling independen), submit via `router.get` sambil membawa serta hari/bulan/kelompok/branch/wilayah yang sedang aktif supaya tidak ke-reset. `nama` juga ditambahkan ke `unitExtraParams` supaya tetap ikut terbawa saat `FilterBar` dipakai untuk ganti hari/bulan. **Tidak perlu diubah** waktu SOUNDEX dibatalkan — frontend cuma kirim parameter `nama`, tidak tahu/peduli strategi pencocokan di backend |

**Cakupan**: filter `nama` di BACKEND otomatis aktif di 4 route (termasuk 2 desktop), karena satu fungsi trait yang sama. **Input pencariannya di FRONTEND cuma ditambahkan di cabang mobile** — desktop (`WebView/Angsuran/SearchByDate.jsx`) belum punya kotak pencarian, walau backend-nya sudah siap menerima parameter `nama` kalau nanti diminta ditambahkan di sana juga.

> **Kalau nanti mau typo-tolerant lagi**: opsi paling ringan tanpa infra baru adalah generated column `nama_soundex` (`GENERATED ALWAYS AS (SOUNDEX(nama)) STORED`) di `transaction_customers` + index di kolom itu — query jadi `WHERE nama_soundex = SOUNDEX(?)` yang bisa pakai index, bukan full scan. Belum dikerjakan, sengaja menunggu kalau memang dibutuhkan.

`php -l` bersih.

---

## Z.3 — Kotak "Cari nama" dipasang juga di cabang desktop

Backend (`nama` di `getLoanMacet()`/`getLoanByDate()`, bagian Z.2) sudah aktif di 4 route sejak awal, tapi kotak pencariannya di frontend baru dipasang di cabang mobile. Sekarang dipasang juga di cabang desktop.

| Berkas | Fungsi/Bagian | Dampak |
|---|---|---|
| `resources/js/Pages/NewAngsuran/AngsuranByDate.jsx` | cabang `type === 'desktop'` | Tambah kotak "Cari nama nasabah..." (persis komponen yang sama dengan cabang mobile — state `namaCari` & effect debounce-nya memang sudah didefinisikan di luar percabangan `type`, dipakai bersama) di atas baris filter dropdown `SearchComponent` yang sudah ada, dibatasi `max-w-sm` supaya tidak melebar penuh di layar besar. Dropdown `SearchComponent` untuk hari/bulan/kelompok/Unit **tidak diubah** |

Sekarang kotak pencarian aktif di semua 4 route (`mobile_apps.macet`, `mobile_apps.byDates`, `pinjaman.index_pinjaman_macet`, `pinjaman.index_pinjaman_search`).

Vite HMR bersih.

---

## Catatan: berkas yang SUDAH termodifikasi sebelum sesi ini

Bukan hasil kerja sesi 2026-08-02, jangan dikaitkan: `AuthenticatedSessionController.php`, `EmployeeController.php`, `Branch.php`, `Employee.php`, `RekapTrait.php`, `routes/web.php`, `AuthScope.php` (baru), `SetBranchController.php` (baru), `EmployeeBranch.php`/`EmployeeZone.php` (baru), `Navbar.jsx`, `AppSidebar.jsx`, `WebSidebar.jsx`, `AuthenticatedLayout.jsx`, `MobileLayout.jsx`, `dialog.jsx`, `popover.jsx`, `GlobalBranchFilter.jsx` (baru), `hooks/` (baru), `command.jsx` (baru).

---

## AA — Dokumen rancangan agregasi rekap (harian + bulanan)

Hasil brainstorming panjang 2026-08-05 soal rombak alur rekap/sirkulasi. **Belum ada kode/migrasi yang dikerjakan** — dokumen rancangan saja.

| Berkas | Isi | Tabel yang dibahas |
|---|---|---|
| `.agents/agregasi_rekap.md` (BARU) | Rancangan lengkap: 5 tabel baru (`work_days`, `transaction_opening_balances`, `transaction_loan_mutations`, `transaction_daily_closings`, `transaction_monthly_closings`) + 1 kolom baru (`branches.mulai_pendataan_baru`), flow harian/bulanan/migrasi, aturan gembok berantai, pembagian 6 ember, daftar perubahan kode beserta `file:baris` | BACA: `transaction_daily_recaps`, `transaction_sirculations`, `transaction_loans`, `transaction_loan_instalments`, `transaction_white_offs`, `branches`, `roles` — **tidak ada TULIS sama sekali** |

Sesuai kewajiban `.agents/AGENTS.md` §"DOKUMENTASI ALUR (FLOW & TABEL)".

### Temuan terverifikasi yang mendasari rancangan (query langsung ke `ubmi_db`)

- `transaction_daily_recaps` punya kolom rincian ember (`month1_amount`…`ml_amount`) tapi **0 dari 482.076 baris pernah terisi**
- **8.703** dari 129.587 rekap harian 2026 yang sudah di-approve kepala, `storting`-nya tidak cocok dengan hitung ulang dari angsuran (880/1.129 kelompok terdampak)
- **28.574** pinjaman cap kelompok angsurannya beda dari pinjamannya, **100% berasal dari grouping_id 331** (bekas transit mutasi manual) → 834 tujuan. **0** menyentuh jendela 5 bulan terakhir
- **23.424** baris angsuran tanpa cap kelompok (Rp 19,03 M), semua sebelum Nov 2025, ±1 baris/pinjaman — pola impor nasabah lama. Karena capnya kosong, **tidak pernah terhitung sebagai storting**
- **1.269 dari 1.275** kelompok menagih **6 hari seminggu** (bukan 1 hari/minggu)
- `AppHelper::generateStatusAngsuran()` (`AppHelper.php:239`) cuma punya **4 nilai** untuk **6 ember** — `selisih < 3` melahap `month1`+`month2`+`ccm`, jadi tiga ember pertama **mustahil** dipisah lewat kolom `status`
- Ember ML: dari 426 pasangan (kelompok,hari) Agustus 2026 — 48 pasangan `ml_amount`=0 padahal ada pinjaman ML (Rp 657 jt tak terwakili), 186 pasangan `ml_amount` > data (Rp 6,19 M), 75 pasangan `ml_amount` < data (Rp 310 jt)

### Yang SENGAJA tidak diubah (dan alasannya)

- `transaction_loans` & `transaction_loan_instalments` — **tidak ada kolom baru**. Seluruh rombakan di lapisan agregat, sumber data tidak disentuh
- Kolom `status` di angsuran + tiga fungsi `generateStatusAngsuran*` — dibiarkan, masih dipakai alur lama; ember baru dihitung dari `drop_date` vs `transaction_date`
- `transaction_daily_recaps` & `transaction_sirculations` — dipensiunkan per kantor, bukan dihapus; tetap melayani kantor yang belum migrasi
- Pelunasan otomatis top-up (`settled_by_loan_id`) — **tetap dihitung sebagai storting**, jangan ditandai penyesuaian: drop hari itu juga naik sebesar itu sehingga saling meniadakan

---

## AB — Verifikasi ulang peta-aplikasi terhadap DB live (2026-08-11)

User minta analisa menu + database untuk bikin gambaran relasi tabel. Dokumentasi `peta-aplikasi` ternyata sudah lengkap dari sesi-sesi sebelumnya (terakhir bagian AA, 2026-08-05) — bukan bikin baru dari nol, cukup verifikasi ulang ke `ubmi_db` live dan refresh angka yang basi.

| Berkas | Perubahan | Tabel tersentuh |
|---|---|---|
| `references/02_database_schema.md` | Refresh row count 9 tabel transaksi inti dari snapshot 08-01 → live 08-11 (semua naik wajar kecuali `transaction_white_offs` turun 18.876→18.813, belum ditelusuri sebabnya). Konfirmasi ulang 5 tabel legacy (`loans`, `loan_requests`, `instalments`, `customers`, `debt_reliefs`) row count-nya **identik persis** dengan snapshot lama — bukti kuat memang benar-benar mati, bukan cuma "jarang ditulis" | BACA saja — `transaction_loans`, `transaction_loan_instalments`, `transaction_manage_customers`, `transaction_customers`, `transaction_daily_recaps`, `transaction_sirculations`, `transaction_white_offs`, `employees`, `users`, + 5 tabel legacy |
| `references/03_auth_roles_scope.md` | Refresh `role_has_permissions` 43→53 dan `model_has_roles` 2.469→2.624. Per-role breakdown permission (tabel "8 Role") sudah cocok persis dengan live — tidak ada drift baru di situ, cuma angka total agregat yang belum sempat disinkron sebelumnya | BACA — `role_has_permissions`, `model_has_roles`, `roles`, `permissions` |

**Tidak ada kode yang diubah** — murni verifikasi dokumentasi. Cross-check routing (`routes/web.php`), model relations (`app/Models/*.php`), dan `AuthScope`/`Branch::getAllowedBranchIds` terhadap isi `01_routing_map.md`/`03_auth_roles_scope.md` — semuanya masih akurat, termasuk yang menyangkut `SetBranchController` dan restrukturisasi `Pages/BukuTransaksi/{Web,Mobile}` yang baru saja di-commit ke git (sebelumnya `.agents/` untracked, jadi dokumentasi ini sudah ada di working tree tapi belum pernah masuk riwayat git).
