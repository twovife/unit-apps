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

---

## AC — Brainstorming rombak agregasi: rancangan v2 (2026-08-12)

Sesi brainstorming 9 topik. **TIDAK ADA KODE YANG DIUBAH** — seluruh tabel disentuh **BACA** saja.
Keluarannya dokumentasi, plus verifikasi langsung ke `ubmi_db` yang **membatalkan tiga klaim**
dari rancangan 2026-08-05.

| Berkas | Perubahan |
|---|---|
| `.agents/agregasi_rekap.md` | **Ditulis ulang jadi v2.** Diagnosis tunggal, keputusan final 9 topik, struktur tabel, rumus 4 pintu, tahapan pengerjaan, §15 daftar klaim lama yang dibatalkan, §17 query rujukan |
| `.agents/skills/peta-aplikasi/references/02_database_schema.md` | Bagian `transaction_daily_recaps`: 6 kolom ditandai `VIRTUAL GENERATED` beserta ekspresinya — sebelumnya tertulis seolah kolom biasa yang bisa ditulis |
| `.agents/skills/peta-aplikasi/references/05_temuan_dan_jebakan.md` | Bagian **AA** (8 temuan baru) + catatan pengukuran di E3 |

**Tabel yang dibaca** (semua **BACA**, tidak ada TULIS): `transaction_loans`,
`transaction_loan_instalments`, `transaction_daily_recaps`, `transaction_sirculations`,
`transaction_out_reasons`, `transaction_white_offs`, `transaction_manage_customers`,
`transaction_customers`, `branches`, `employees`, `users`, `roles`, `permissions`,
`role_has_permissions`, `model_has_roles`, `information_schema.columns`.

### Tiga klaim rancangan 2026-08-05 yang DIBATALKAN

| Klaim lama | Kenyataan | Kalau diikuti |
|---|---|---|
| `sharingdo` "kolom mati, cuma nongol di `$fillable`" | `VIRTUAL GENERATED` `drop * 0.11`, menyuplai `debt` → `tunai` | tabel baru dibuat tanpa penggantinya → **`tunai` pincang** |
| Ember 4-vs-6 = "cacat struktural" di `generateStatusAngsuran()` | Bukan cacat: **6 ember penyimpanan, 4 kategori tampilan** (lancar = month1+month2+ccm) | fungsi lama "diperbaiki" padahal tugasnya memang begitu |
| Target tidak dibahas | **Sudah terimplementasi penuh** (`TransactionDailyRecap.php:62`, 133rb baris aktif 2026) | dibangun dari nol, padahal cukup menambal 2 penyakitnya |

### Temuan baru terverifikasi (detail + query di `05_temuan_dan_jebakan.md` bagian AA)

- **4.141 rantai `target` patah** dari 133.068 pasangan diuji (3,1%) — kembaran dari 8.703 storting-mismatch
- Penyebabnya **dua sumber kebenaran berebut** di `ceklist_kepala` (hook menghitung → controller menimpa dengan ketikan user), plus **cascade rekursif tanpa batas** lewat `increment()` yang memicu event `updating` berantai
- **6 kolom `transaction_daily_recaps` adalah GENERATED** (`sharingdo`, `titipan`, `debt`, `kred`, `tunai`, `masuk`) — ada di `$fillable` tapi ditolak MySQL. `tunai` **tidak punya ingatan**: berubah surut diam-diam saat `storting` dikoreksi
- **Tidak ada satu pun field untuk uang fisik / setoran mantri / selisih** di seluruh aplikasi
- **80 pinjaman ber-`drop_date` mustahil** (`0225-06-04`, `0025-07-12`, `1923-12-07`, satu `3026-07-07`), 25 drop masa depan, 151 rekap masa depan. Yang bertahun 0025 **selamanya ML**
- `transaction_sirculations`: **`month1_amount`/`month2_amount`/`ccm_amount` 0 baris terisi**, cakupan bolong **23%** (Juli 2026: 7.377 dari 9.540; 1.238 dari 1.590 kelompok)
- `previous_loan_id` baru **3 baris**, semuanya `open` → topup produksi masih tidak tertaut
- `status` `transaction_loans` ada **5 nilai** termasuk `open` (5.365) — dokumen lama menyebut `null`, padahal `null` tidak ada
- `transaction_out_reasons`: **MACET (id 5) 0 baris** — keputusan KM "macet tak tertagih" tidak pernah tercatat
- `hari` vs `drop_date` **cocok 100%** (691.721/691.721 pinjaman 2026) — invarian ini akan sengaja dilanggar mutasi, dan `AdminController@loan_balancing` wajib disesuaikan bersamaan

### Keputusan yang diambil (ringkas — lengkapnya di `agregasi_rekap.md`)

1. `tunai` **tetap generated column**; yang dikunci inputnya. Tambah `setoran_mantri` (uang fisik) + `selisih` generated. Kalkulator kasir **haram** menyentuh drop/storting.
2. Kunci mencakup **sumber + kolom manual** (`kasbon`, `transport`, `keluar`, `setoran_mantri`). Penegakan lewat **trigger DB**, bukan hanya hook model.
3. Agregat bulanan dipicu tanda tangan harian, aksinya **hitung ulang total, BUKAN increment**. Tanda tangan bulanan disyaratkan hari terkunci lengkap.
4. Target **tetap manual sekarang**; tambah `target_source` + laporan bayangan read-only; recount menyusul ±2 bulan.
5. Enam ember untuk penyimpanan, empat kategori untuk tampilan.
6. Tabel penyesuaian saldo **terpisah dari `transaction_white_offs`**; input **sisa saldo**, bukan "sudah terbayar"; dibatasi **hanya pinjaman yang sudah ML di bulan terakhir sistem lama** (`bulan(drop_date) ≤ bulan(mulai_pendataan_baru) − 6`) — himpunannya beku sejak migrasi dan hanya mengecil.
7. Mutasi: `grouping_id` tidak pernah diubah; mutasi masuk adalah **arus, bukan saldo awal**; harus terbagi **per ember**; hanya superuser.
8. Kalender kerja **nasional**; drop kena libur **mundur seminggu** (bukan lompat ke hari kerja terdekat, karena itu diam-diam memindahkan nasabah antar mantri).
9. **Cutover kantor percontohan 1 Oktober 2026**, 1–2 kantor.

### Yang SENGAJA tidak dikerjakan sesi ini

- **Tidak ada kode, tidak ada migrasi.** Tahap 0 (kolom `mulai_pendataan_baru` + gerbang pemilih tabel) menunggu persetujuan terpisah.
- **Tiga fungsi `generateStatusAngsuran*` tidak disentuh** — sudah dipastikan bukan cacat, dan alur lama masih memakainya.
- **`sharingdo` tidak dibuang** dari rencana tabel baru — rancangan lama menyuruh membuangnya, itu keliru.
- **4.141 rantai target patah tidak diperbaiki surut** — sesuai keputusan §13.1, agregat baru tidak boleh menyentuh tanggal sebelum migrasi; memperbaikinya surut akan melahirkan versi kedua dari bulan yang sudah ditandatangani.
- **80 tanggal mustahil tidak dibersihkan** — pembersihan data lama masuk lingkup validasi staf (Agustus–September), bukan perubahan kode.

---

## AD — Tahap 0: kolom batas + gerbang pemilih agregasi (2026-08-12)

Langkah pertama rombak agregasi (`.agents/agregasi_rekap.md` §12.2). **Sengaja tidak mengubah
perilaku apa pun** — memasang sakelarnya dulu, sebelum ada yang disambungkan ke sakelar itu.

| Berkas | Fungsi/Method | Route/Controller terdampak | Tabel | Dampak |
|---|---|---|---|---|
| `app/Helpers/AgregasiScope.php` **(BARU)** | `tanggalMulai`, `sudahMigrasi`, `pakaiAgregatBaru`, `batasPenyesuaian`, `bolehDisesuaikan`, `lupakanCache` | **belum ada** — belum dipanggil dari mana pun | `branches` — **BACA** | Gerbang tunggal penentu agregasi lama vs baru. Punya cache per-request supaya satu halaman yang memeriksa banyak tanggal/kelompok tidak query berulang |
| `app/Models/Branch.php` | — | semua yang memuat Branch | `branches` — BACA | Tambah `$casts` untuk `mulai_pendataan_baru` (date). Model ini sebelumnya tidak punya `$casts` sama sekali |
| `app_laravel/database/migrations/2026_08_12_090000_*` **(BARU)** | — | — | `branches` — **TULIS (DDL)** | Kolom `mulai_pendataan_baru` date nullable. Dibuat & dijalankan **dari `app_laravel`** sesuai aturan single source of truth. NULL untuk 157 kantor |

### Kenapa satu kelas, bukan `if` di tiap tempat

Rombakan ini menyentuh belasan titik baca (`RekapTrait:204/586/732`, `PinjamanTrait` `getLoan`/
`getLoanMantri`, `TransactionDailyRecapController@ceklist_kepala`/`@rekap_post`). Kalau tiap titik
mengecek `$branch->mulai_pendataan_baru` sendiri, satu yang terlewat berarti kantor yang sama dibaca
dari dua tabel berbeda di dua halaman berbeda — bug yang baru ketahuan berbulan-bulan kemudian.

### Terverifikasi

- Kolom ada, **157 kantor semuanya NULL**, `migrate:status` → `[21] Ran`, **0 pending**
- Jalur nyata (semua NULL): `pakaiAgregatBaru()` dan `bolehDisesuaikan()` → `false`; `branchId` null → `false`
- Jalur "sudah migrasi" diuji dengan **mem-prime cache lewat reflection — nol tulisan ke DB**.
  8 asersi lolos; `batasPenyesuaian` untuk migrasi 1 Okt 2026 = **30 April 2026**, persis tabel §7.5
  (ML September masuk, MB September tidak)
- `php -l` bersih, aplikasi tetap boot (87 route), kelas ter-autoload
- **`grep AgregasiScope` di `app/`, `resources/`, `routes/` → nol pemanggil**, sesuai definisi Tahap 0

### Yang SENGAJA tidak dikerjakan

- **Gerbang belum disambungkan** ke satu pun titik baca. Penyambungan menunggu Tahap 3 (mesin baru);
  menyambungkannya sekarang cuma menaburkan cabang kosong di 6 tempat.
- **`opening_date` tidak ikut di-cast.** Sempat kutambahkan lalu kubatalkan: kolom itu tidak dipakai
  di mana pun di unit-apps, dan cast-nya mengubah bentuk serialisasi JSON tanpa ada yang meminta —
  padahal Tahap 0 harus mengubah nol perilaku.
- **Test PHPUnit tidak dijalankan.** `phpunit.xml` punya `DB_CONNECTION` sqlite yang **dikomentari**
  (baris 24–25), jadi test akan menghantam `ubmi_db` produksi yang dipakai 2 aplikasi. Verifikasi
  dilakukan lewat tinker read-only. **Jangan jalankan `php artisan test` sebelum baris itu diaktifkan.**
- **Tidak ada kantor yang di-set migrasi.** Pengisian `mulai_pendataan_baru` adalah keputusan
  operasional per kantor (target: 1–2 kantor percontohan, 1 Okt 2026).

---

## AE — Gerbang input ML susulan: aturan + grain ditetapkan (2026-08-12)

Pelurusan arah sebelum Tahap 1 dikerjakan. **Dokumentasi saja, tidak ada kode yang diubah.**

| Berkas | Perubahan | Tabel |
|---|---|---|
| `.agents/agregasi_rekap.md` §13.3 | Ditulis ulang: gerbang input ML, grain `(grouping, hari)`, angka Juli 2026, kasus `Y` tidak terdefinisi | `transaction_loans`, `transaction_white_offs`, `transaction_sirculations` — **BACA** |
| `.agents/agregasi_rekap.md` §10.2, §13.2 | Penjelasan `awal_ml_belum_terinput` disesuaikan (teramati, bukan ditetapkan) | — |

### Aturan yang ditetapkan user

| Kondisi | Input ML susulan |
|---|---|
| `ml_amount` = data nyata | **ditutup** |
| `ml_amount` > data nyata | **dibuka**, kuota = selisihnya |
| `ml_amount` < data nyata | **ditutup** |

Selisih yang tidak cocok **tidak dipaksa sama** — hanya dilaporkan. Yang dipakai cuma arahnya
(buka/tutup) dan besarnya (kuota). Penyesuaian ML tetap lewat `can-edit` bongkar-pasang superuser.

### MEMBATALKAN keputusan sebelumnya

Versi awal dokumen menyuruh kantor **menetapkan `Z` manual** (alasan: `Y` sudah melenceng dua arah,
jadi `Y − X` otomatis dianggap memindahkan kesalahan lama). Aturan di atas membatalkannya — `Z`
cukup teramati sebagai `Y − X` dan berfungsi sebagai kuota, karena selisihnya toh tidak dipaksa
cocok. **Satu langkah kerja manual hilang dari alur migrasi, dan tidak ada angka karangan yang
masuk sistem baru.**

### Grain: per (grouping, hari), BUKAN per mantri

Diverifikasi dengan menghitung dua-duanya untuk Juli 2026:

| | per grouping+hari | per mantri |
|---|---:|---:|
| Unit dinilai | 7.377 pasangan | 1.238 mantri |
| Dibuka (`Y>X`) | 4.268 (58%) — Rp 54,25 M | 855 (69%) — Rp 53,14 M |
| Ditutup (`Y=X`) | 2.208 (30%) | 226 (18%) |
| Ditutup (`Y<X`) | 901 (12%) — −Rp 3,71 M | 157 (13%) — −Rp 2,60 M |

**Menggabung per mantri menyembunyikan Rp 1,11 miliar** selisih hari — mantri yang Senin kelebihan
dan Rabu kekurangan terbaca "cocok" padahal dua-duanya salah. Itu pola penyakit §1 persis.
Dari 2.208 yang cocok, 1.412 karena dua-duanya nol; hanya 796 benar-benar cocok di angka bukan nol.

### Temuan tambahan: jalur nasabah lama yang sebenarnya

Sempat salah sasaran ke `BatchInputController` (menu upload global — **user konfirmasi sudah tidak
dipakai lagi**, dan akan dibatasi superuser saja). Jalur yang benar-benar dipakai staf:

- **`BukuTransaksi/Web/InputMacet.jsx`** — staf mengisi **sisa saldo**, frontend menghitung
  `angsuran[0].nominal = pinjaman − sisa_saldo` (`:170,175`). Ini "angsuran penyesuaian"-nya.
- Dikirim ke **`TransactionLoanController@store_buku_transaksi_batch`** (`:332`), yang membuat
  pinjaman `status='success'` + `nominal_drop` (**drop naik**, `:443-459`) lalu baris angsuran dari
  array (**storting naik**, `:461-478`).
- **`FastCreateV2.jsx` memakai endpoint yang sama** — mengubahnya menyentuh dua layar sekaligus.

Konfirmasi penting: staf **sudah** berpikir dalam "sisa saldo", jadi keputusan §7.4 (input sisa
saldo, bukan "sudah terbayar") memang cocok dengan kebiasaan yang ada — bukan cara baru.

Jejak `BatchInputController` (penanda `user_input=4955`, **batas atas** karena penanda yang sama
juga dipakai fallback id pimpinan/kasir): 98.317 pinjaman (Rp 54,0 M) dan 361.259 angsuran
(Rp 109,0 M), 184 kelompok, `drop_date` 2002–2026.

### Penguncian permanen: PALANG, bukan perbandingan berulang

`ml_amount` = **kuota**; data nyata mengisinya dari bawah; penuh → terkunci. Tapi penguncian harus
berupa palang, bukan perbandingan yang dievaluasi ulang tiap saat — karena `X` bergerak TURUN tiap
nasabah ML membayar. **Terverifikasi Juli 2026: ML membayar 19.347 kali senilai Rp 2,22 miliar dari
11.478 pinjaman** (pemutihan ML bulan itu: 0).

Tanpa palang: `X` menyentuh `Y` → tutup; bulan depan ML bayar 5jt → `X` turun → `Y > X` → **pintu
terbuka lagi dengan kuota 5jt**, padahal 5jt itu uang yang baru masuk, bukan nasabah belum terinput.
Aturan yang dimaksudkan mencegah data palsu malah jadi mesin pembuatnya.

Bentuk final: bandingkan `Y` vs `X` **sekali saat serah terima** → `sisa_kuota = maks(0, Y−X)`.
Setelah itu sisa kuota hanya berkurang. Nol = terkunci permanen, dan permanennya jadi sifat bawaan
cara hitung, bukan aturan yang harus dijaga.

Konsekuensi: `awal_ml_belum_terinput` **dibawa turun antar bulan, bukan dihitung ulang** —
pengecualian terhadap §11.2, karena sisa kuota menghitung orang yang justru tidak ada di portofolio.

### Persetujuan: TERJAWAB lewat pemisahan jalur

| | Input ML (`saldo_awal`) | Penyesuaian (3 jenis koreksi) |
|---|---|---|
| Pembatas | **kuota** (angka keras) | persetujuan orang kedua + log + laporan |
| Siapa | staf berakses biasa | `can-edit` bongkar-pasang superuser |
| Volume | ribuan baris | satuan |

`saldo_awal` **tidak butuh persetujuan orang kedua** — pembatasnya sudah kuota. Mewajibkan dua orang
untuk ribuan baris justru mendorong jalan pintas, dan jalan pintasnya adalah `inputmacet` lama yang
membuat drop palsu.

⚠️ Dicatat tegas di dokumen: penyesuaian **tidak punya kuota**, jadi tata kelolanya yang jadi
pembatas. Kalau `can-edit` suatu hari ditempelkan ke role supaya praktis, kuota berubah jadi hiasan.

Kuota **hanya boleh naik lewat `can-edit` + alasan tercatat** (jalur sama dengan buka kunci hari) —
supaya salah input yang menghabiskan kuota tetap bisa dipulihkan tanpa membuka jalur bebas.

### Yang masih TERBUKA

1. **229 pasangan grouping×hari punya ML nyata Rp 2,97 M tapi tanpa baris `transaction_sirculations`**
   → `Y` tidak terdefinisi. Diperlakukan `Y=0` (input ditutup) atau "belum ditetapkan" (kelompok
   tidak boleh migrasi sampai diisi)? Belum diputuskan.
2. Lingkup Tahap 1 — apakah `store_buku_transaksi_batch` ikut diubah, atau menunggu Tahap 3?

---

## AF — Tahap 1 (bagian 1): tabel penyesuaian saldo + kunci BatchInput (2026-08-12)

| Berkas | Fungsi/Method | Route terdampak | Tabel | Dampak |
|---|---|---|---|---|
| `app_laravel/database/migrations/2026_08_12_140000_*` **(BARU)** | — | — | `transaction_saldo_adjustments` — **TULIS (DDL)** | Tabel penyesuaian saldo. Dibuat dari `app_laravel` sesuai aturan |
| `app/Models/TransactionSaldoAdjustment.php` **(BARU)** | `ARAH`, `WAJIB_PERSETUJUAN`, `efek_saldo`, `butuhPersetujuan`, `sudahDisetujui`, `scopeBerlaku` | belum ada pemakai | `transaction_saldo_adjustments` | Model + pemetaan arah |
| `app/Models/TransactionLoan.php` | `saldo_adjustments()`, `saldo_awal()` **(BARU)** | semua yang memuat TransactionLoan | BACA | Dua relasi baru, dipasang persis di sebelah `white_off()` |
| `app/Http/Controllers/BatchInputController.php` | `pastikanSuperuser()` **(BARU)**, dipanggil di `index`, `store`, `validateData` | `batch_input.index`, `.store`, `.validateData` | tidak berubah | Batch upload global dibatasi superuser |

### Kenapa arah disimpan di satu konstanta

`nominal` selalu positif; arah terhadap saldo ditentukan `jenis` lewat `TransactionSaldoAdjustment::ARAH`
(`saldo_awal`/`duplikat`/`lebih_input` = −1, `kurang_input` = +1). Kalau tanda minus ditulis tersebar
di tiap tempat yang menghitung saldo, satu tempat yang salah tanda menghasilkan saldo meleset tanpa
ada yang tahu — jenis kesalahan paling sulit dilacak. Rumus pemakaian:
`saldo = pinjaman − angsuran − pemutihan + SUM(efek_saldo)`.

`scopeBerlaku()` menyaring koreksi yang belum disetujui, supaya penyesuaian yang menunggu orang kedua
tidak ikut menggeser saldo.

### BatchInput dibatasi superuser

Menu upload global sudah tidak dipakai operasional (konfirmasi user). Jalurnya membuat pinjaman
`status='success'` + `nominal_drop` (**drop naik**) plus angsuran sebesar selisih saldo (**storting
naik**) — dua-duanya uang yang tidak pernah bergerak di kas.

🔴 **Sengaja TIDAK memakai middleware `role:`.** Diverifikasi: alias `role` **tidak terdaftar sama
sekali** di `app/Http/Kernel.php` (`app('router')->getMiddleware()` → tidak ada). Jadi `role:` di
`routes/web.php` bukan cuma tidak menempel karena dirantai setelah `->group()` (temuan A1) — kalaupun
menempel, dia akan **melempar exception**, bukan menolak dengan rapi. Dipakai pengecekan eksplisit
`hasRole('superuser')` + `abort(403)`, sesuai idiom controller lain di proyek ini.

### Terverifikasi

- `php -l` bersih di 4 berkas; aplikasi tetap boot (87 route)
- Gerbang superuser diuji dengan user nyata: `supermario` → `true`, mantri `herikurnia_kdr` → `false`
- Ketiga method `BatchInputController` terjaga (`index`, `store`, `validateData`)
- Menu BatchInput **tidak punya link di Sidebar** — hanya dijangkau lewat URL langsung, jadi tidak
  ada menu yang perlu disembunyikan

### Yang SENGAJA belum dikerjakan

- **Migrasi belum dijalankan** — perintahnya di luar izin sesi ini. Sampai dijalankan,
  `TransactionSaldoAdjustment` belum bisa dipakai (tabelnya belum ada). `migrate:status` menunjukkan
  cuma migrasi ini yang tertunda.
- **Laporan stock-take X/Y/Z** — bagian berikutnya Tahap 1. Tidak bergantung pada tabel baru
  (murni membandingkan `transaction_loans` vs `transaction_sirculations`), jadi bisa dikerjakan
  paralel.
- **`store_buku_transaksi_batch` tidak disentuh** — perubahan `inputmacet`/`FastCreateV2` menunggu
  keputusan lingkup, dan tidak mendesak karena belum ada kantor yang migrasi sebelum 1 Okt.

---

## AG — Tahap 1 (bagian 2): laporan stock-take ML (2026-08-12)

| Berkas | Fungsi/Method | Route | Tabel | Dampak |
|---|---|---|---|---|
| `app/Http/Controllers/MigrasiController.php` **(BARU)** | `stockTakeMl`, `susunBarisStockTake`, `saldoMlDariData`, `kuotaDinyatakan`, `tetapkanStatus`, `ringkas`, `ekspresiEfekPenyesuaian` | `migrasi.stock_take_ml` **(BARU)** | `transaction_loans`, `transaction_white_offs`, `transaction_saldo_adjustments`, `transaction_sirculations`, `transaction_loan_officer_groupings`, `branches` — **SEMUA BACA** | Laporan banding kuota vs data nyata per (kelompok, hari) |
| `resources/js/Pages/Migrasi/StockTakeMl.jsx` **(BARU)** | — | idem | — | Tabel + 4 kartu ringkasan + pemilih periode |
| `resources/js/Components/Sidebar.jsx` | grup "Persiapan Migrasi" | idem | — | Link menu, di dalam blok `unitAkses` |
| `routes/web.php` | prefix `migrasi` | idem | — | Otorisasi di controller, **bukan** middleware `role:` |

**Tidak ada satu pun penulisan.** Seluruh method di controller ini baca-saja.

### Keputusan yang tertanam di kode

- **Grain (kelompok, hari)** — bukan per mantri. Menggabungkan per mantri menyembunyikan Rp 1,11 M
  selisih antar hari yang saling meniadakan.
- **Batas ML dihitung `periode − 4 bulan`**, kondisi `drop_date < batas`. Untuk Juli 2026 → 1 Maret
  2026: drop Februari (selisih 5) masuk ML, drop Maret (selisih 4, masih MB) tidak.
- **`Y = null` dibedakan dari `Y = 0`** → status `belum_dinyatakan`. "Dinyatakan nol" beda dari
  "belum pernah dinyatakan", dan ±23% kelompok memang tidak punya baris sirkulasi.
- **Ekspresi arah penyesuaian dibangkitkan dari `TransactionSaldoAdjustment::ARAH`**, tidak ditulis
  ulang sebagai `CASE` di SQL — supaya tanda tetap punya satu sumber kebenaran.
- Komentar di `tetapkanStatus()` menegaskan perbandingan ini **hanya sah dipakai sekali saat serah
  terima**; kalau dijalankan ulang tiap bulan, pintunya terbuka lagi tiap nasabah ML membayar.

### Terverifikasi

- **Angka cocok dengan query manual**: cabang 52 (Genteng 1), kelompok 1 — jumat 3.370.000,
  kamis 11.676.000, rabu 9.231.000, sabtu 11.234.000, selasa 10.784.000, senin 12.957.000
- **HTTP kernel penuh** dengan sesi terautentikasi: `status 200`, komponen `Migrasi/StockTakeMl`,
  props berisi data (65.777 bytes)
- **Otorisasi menolak**: mantri `herikurnia_kdr` → `403` (tidak punya `view-all-groups`)
- Tanpa login → `302` ke `/login`, sama seperti route lain
- `npm run build` bersih, aset terbentuk di `public/build` dan `bootstrap/ssr`
- Waktu render ±2 detik untuk satu cabang penuh (10 kelompok × 6 hari = 60 baris)

### Catatan

- Halaman ini tetap berguna **setelah** migrasi (memantau sisa kuota), tapi angkanya di sana harus
  dibaca dari sisa kuota tersimpan, bukan dihitung ulang. Belum dikerjakan — `transaction_monthly_closings`
  baru ada di Tahap 2.
- Berkas JSX baru mengikuti gaya kutip ganda seperti berkas-berkas baru lain (`GlobalBranchFilter.jsx`).
  Proyek ini **tidak punya konfigurasi prettier** dan gayanya memang campur.

---

## AH — Hapus dua halaman BatchUpload yang mati (2026-08-12)

Penelusuran pemanggil `transaction.store_buku_transaksi_batch` menemukan **5 berkas**, ternyata
hanya 2 yang benar-benar hidup.

| Berkas | Dirender controller? | Nasib |
|---|---|---|
| `BukuTransaksi/Web/FastCreateV2.jsx` | ya (`fastcreatev2`, `:37`) | dipakai |
| `BukuTransaksi/Web/InputMacet.jsx` | ya (`inputmacet`, `:45`) | dipakai |
| `BukuTransaksi/Web/BatchUpload.jsx` | ya (`fastcreate`, `:26`) tapi **route-nya tidak pernah menunjuk ke sana** | **DIPERTAHANKAN** atas keputusan user |
| `NewLoan/BatchUpload.jsx` | tidak | **DIHAPUS** (525 baris) |
| `NewLoan/BatchUploadx.jsx` | tidak | **DIHAPUS** (517 baris) |

### Kenapa `BukuTransaksi/Web/BatchUpload.jsx` tidak terjangkau

`TransactionLoanController` punya dua method yang sekilas tampak sepasang:

```php
public function fastcreate()   { return Inertia::render('BukuTransaksi/Web/BatchUpload'); }   // :26
public function fastcreatev2() { return Inertia::render('BukuTransaksi/Web/FastCreateV2'); }  // :33
```

Tapi di `routes/web.php` **kedua** route menunjuk ke `fastcreatev2`:

```php
Route::get('/fastcreate',   "fastcreatev2")->name('fastcreate');
Route::get('/fastcreatev2', "fastcreatev2")->name('fastcreatev2');
```

Jadi `fastcreate()` **tidak pernah dipanggil**. Berkas & method sengaja dibiarkan (keputusan user),
tapi dicatat di sini supaya tidak dikira jalur hidup.

**Dampak untuk Tahap 3**: yang perlu disesuaikan saat `store_buku_transaksi_batch` diubah cuma
**dua layar** (FastCreateV2, InputMacet) — bukan lima seperti dugaan awal.

### Berkas yang diubah

| Berkas | Perubahan |
|---|---|
| `resources/js/Pages/NewLoan/BatchUpload.jsx` | **dihapus** |
| `resources/js/Pages/NewLoan/BatchUploadx.jsx` | **dihapus** |
| `references/01_routing_map.md` | daftar pemanggil `nasabah_buku_transaksi` + daftar view tanpa route disesuaikan |
| `references/05_temuan_dan_jebakan.md` | daftar berkas mati disesuaikan |

### Terverifikasi sebelum menghapus

- Tidak dirender `Inertia::render` mana pun
- Tidak diimport JSX mana pun
- Tidak disebut di `app/` maupun `routes/`
- Sapuan seluruh repo: rujukan tersisa **hanya di dokumentasi**, sudah ikut dirapikan
- `npm run build` bersih; aset `BatchUploadx` hilang dari `public/build` **dan** `bootstrap/ssr`;
  `FastCreateV2`, `InputMacet`, `BatchUpload`, `StockTakeMl` tetap terbangun; 88 route utuh

Catatan: entri CHANGELOG lama yang menyebut kedua berkas ini **sengaja tidak diedit** — itu catatan
sejarah, bukan peta kondisi sekarang.

### Yang SENGAJA tidak disentuh

- **`SuperUser/BatchUpdate.jsx`** — juga praktis mati (route `batchupdate` menunjuk
  `LoanController@batch_create` yang badan kelasnya kosong → 500, temuan A2). Di luar lingkup
  permintaan; belum dihapus.
- **Route `transaction.fastcreate`** tetap menunjuk `fastcreatev2`. Membetulkannya akan
  **menghidupkan** layar BatchUpload yang selama ini tidak pernah tampil — perubahan perilaku yang
  tidak diminta.

---

## AI — Perbaikan: gerbang BatchInput jangan jadi jalan buntu (2026-08-12)

**Regresi dari bagian AF**, dilaporkan user lewat tangkapan layar: setelah login sebagai
non-superuser, muncul layar 403 polos tanpa jalan keluar.

### Penyebab

`AuthenticatedSessionController@store` memakai `redirect()->intended(RouteServiceProvider::HOME)`.
Kalau sesi sebelumnya sempat menuju `/batch-input` (mis. tab lama, bookmark, atau sesi kadaluarsa
saat halaman itu terbuka), URL itu tersimpan sebagai *intended* — dan login berikutnya dilempar ke
sana. Dengan `abort(403)`, user non-superuser **terjebak di layar error tepat setelah login**, tanpa
tautan kembali. Pintu masuk aplikasi jadi buntu untuk mereka.

Tidak ada apa pun di aplikasi yang mengarahkan ke `/batch-input` (sudah disisir di `app/`, `routes/`,
`resources/js/`) — jadi murni dari `intended()`.

### Perbaikan

| Method | Dipanggil dari | Sebelum | Sesudah |
|---|---|---|---|
| `index()` | halaman biasa | `abort(403)` — jalan buntu | `redirect()->route('home')->with('message', ...)` |
| `store()` | **axios** | `abort(403)` — HTML di tengah `await axios.post` | `response()->json([...], 403)` |
| `validateData()` | **axios** | idem | `response()->json([...], 403)` |

`abort()` di endpoint axios juga salah bentuk: frontend memakai `await axios.post` dan mengharap JSON,
sementara `abort()` mengembalikan halaman error HTML. Pesan tolak dipusatkan di satu konstanta
`PESAN_TOLAK`.

Memakai `->with('message', ...)`, **bukan** `withError()` — `HandleInertiaRequests::share()` hanya
meneruskan `flash.message`, jadi `withError()` hilang diam-diam (temuan D1).

### Terverifikasi

- `/batch-input` sebagai mantri → **302 ke beranda** (bukan lagi 403 buntu); sebagai superuser → **200**
- `store` & `validateData` sebagai mantri → **403 `application/json`** dengan body pesan
- `php -l` bersih

### Pelajaran untuk gerbang berikutnya

`abort(403)` layak dipakai kalau halamannya memang tidak boleh ada di jangkauan user. Tapi untuk
menu yang **dulu terbuka lalu dibatasi**, tautan lama tetap beredar di bookmark, tab, dan
`intended()` — jadi penolakannya harus mengembalikan user ke tempat yang bisa dipakai, bukan
meninggalkannya di layar mati.

---

## AJ — Sinkronisasi angsuran dibatasi `can-edit` (2026-08-12)

| Berkas | Method | Route | Tabel | Dampak |
|---|---|---|---|---|
| `app/Http/Controllers/TransactionLoanController.php` | `get_synch_angsuran` | `pinjaman.get_synch_angsuran` | BACA | Tanpa `can-edit` → **403 JSON** (dipanggil axios) |
| idem | `synch_angsuran` | `pinjaman.synch_angsuran` | `transaction_loan_instalments` — TULIS | Tanpa `can-edit` → **302 back + errors** (dipanggil Inertia `useForm`) |
| idem | konstanta `PESAN_TOLAK_SYNCH` **(BARU)** | — | — | Pesan tolak dipusatkan |

**Tidak ada perubahan frontend.** Tombol Sync di `AngsuranTable.jsx:145` **sudah** disembunyikan lewat
`is_maintenaner` (`= permissions.includes('can-edit')`, `:19`). Yang bolong justru sisi server —
sebelumnya kedua method **tidak punya pengecekan izin sama sekali**, padahal endpoint bisa dipanggil
langsung tanpa lewat tombol.

### Kenapa ini mendesak

`synch_angsuran` jauh lebih destruktif daripada penyesuaian saldo yang justru dijaga ketat:

```php
$loan->loan_instalment()->delete();      // SELURUH riwayat angsuran dihapus
$transactionLoan->loan_instalment()->create([
  'transaction_date' => drop_date + 1 minggu,
  'nominal' => pinjaman - saldobefore,   // satu angsuran gelondongan
]);
// sisanya dibangun ulang dari isian form
```

- Tanggal asli, penginput asli, penanda dana titipan **hilang permanen**
- Storting bulan lampau **bergeser surut** — angsuran gelondongan bertanggal jauh ke belakang,
  untuk nasabah ML sering berbulan/bertahun lalu
- Sebelum perubahan ini: **siapa pun yang login** bisa memanggilnya

### Yang SENGAJA tidak diubah (keputusan user)

Perilaku hapus-lalu-bangun-ulang **dibiarkan apa adanya**. Alasannya: menu ini dipakai sebagai alat
pembersih data selama Agustus, lalu **dihilangkan total setelah migrasi**. Distorsi storting masa lalu
tidak terbawa ke sistem baru karena agregat baru tidak pernah menghitung tanggal sebelum
`mulai_pendataan_baru` (§13.1) — jadi dia hanya mengotori arsip lama yang memang sudah tidak
diandalkan.

Usulan mencatat ringkasan angsuran lama sebelum `delete()` **ditolak user** dengan alasan yang sama.
Konsekuensi yang diterima sadar: kalau ada sengketa "setoran saya hilang", tidak ada jejak untuk
ditelusuri.

### Terverifikasi

- Mantri `herikurnia_kdr` (`can-edit=false`): `get_synch` → **403 `application/json`** dengan pesan;
  `synch` → **302** dan errors bag berisi pesan
- Superuser lolos penjaga (eksekusi menembus ke logika asli)
- `php -l` bersih; tidak ada perubahan JSX sehingga tidak perlu `npm run build`

### Konteks: kenapa tutup buku jadi gerbang migrasi

`AdminController@sirkulasiAwal` (`:129`) adalah **satu-satunya penulis** `transaction_sirculations`,
dan dia menulis baris untuk **bulan berikutnya** (`addMonthNoOverflow(1)`) dengan angka yang **diketik
manual** (`amount_next`, `cm_next`, `mb_next`, `ml_next`). Jadi baris Juli 2026 lahir saat seseorang
menutup buku Juni. Kalau tidak ada yang menjalankan, barisnya tidak pernah ada.

Adopsi tutup buku naik terus: **82 cabang (Jan) → 125 (Jul)** dari 157. Rencana user: kantor yang
menutup buku Agustus langsung termigrasi ke alur baru per September, dan mulai September agregat
bulanan dihitung dari agregat harian — **tidak lagi bergantung pada staf menutup buku**.

Efek sampingnya bagus: kriteria ini **menyeleksi dirinya sendiri**, sehingga kasus "belum dinyatakan"
(§13.3) berhenti butuh aturan khusus — belum tutup buku berarti belum memenuhi syarat.

> ⚠️ **Jebakan di alur yang jadi gerbang itu**: blok `catch` `sirkulasiAwal` (`AdminController.php:153`)
> berisi `ddd($e)` — dump-and-die, sehingga `return redirect()->back()->withErrors(...)` di bawahnya
> **tidak pernah tercapai**. Kalau tutup buku gagal, user tidak pernah tahu sebabnya. Belum diperbaiki.

### Sebaran kantor tanpa baris sirkulasi (Juli 2026)

Terkonsentrasi, bukan tersebar — 4 kantor menyumbang 212 dari 227 pasangan:

| Cabang | Pasangan bolong | Nasabah ML | Data nyata |
|---|---:|---:|---:|
| Sawojajar 2 | **60 (semua)** | 2.123 | Rp 927.296.930 |
| Kertosono 1 | 32 | 2.116 | Rp 892.674.500 |
| Salatiga 1 | **60 (semua)** | 1.380 | Rp 534.221.000 |
| Singosari 3 | **60 (semua)** | 1.041 | Rp 425.757.000 |
| 7 kantor lain | 1–5 masing-masing | 365 | Rp 192.685.000 |

Tiga kantor bolong 60/60 = **tidak punya baris sirkulasi Juli sama sekali**. Karawang 2 dan Genteng 1
(kandidat percontohan) **0 pasangan bolong** — tidak terdampak.

---

## AK — `ddd` di tutup buku dibuang + `is_maintenaner` diganti `canEdit` (2026-08-12)

| Berkas | Perubahan | Tabel |
|---|---|---|
| `app/Http/Controllers/AdminController.php` | `sirkulasiAwal()`: `ddd($e)` dihapus, diganti `Log::error` + `withErrors` berisi pesan asli; import `Log` ditambah | `transaction_sirculations` — TULIS (tidak berubah) |
| `resources/js/Pages/NewAngsuran/Components/AngsuranTable.jsx` | `is_maintenaner` → `canEdit` (2 kemunculan, `:20` & `:145`) | — |

### Kenapa `ddd` di sini penting

`ddd($e)` membuat `return redirect()->back()->withErrors('Sirkulasi Awal Error')` di bawahnya
**tidak pernah tercapai**. Kantor yang gagal menutup buku hanya melihat layar dump — atau respons
rusak kalau `APP_DEBUG=false` — dan tidak pernah tahu sebabnya.

Ini alur yang sebentar lagi jadi **gerbang migrasi** (§AJ): kegagalan diam-diam di sini berarti
kantornya tidak punya baris `transaction_sirculations`, tidak lolos syarat migrasi, dan tidak ada
yang bisa menjelaskan kenapa. Sekarang errornya masuk log lengkap dengan `grouping_id`, `hari`,
`month`, `user_id`, `line`, dan pesannya sampai ke user.

Penamaan `canEdit` mengikuti gaya camelCase yang dipakai flag izin lain (`unitAkses` di `Sidebar.jsx`).
Nama lama menyesatkan: mengesankan permission `maintenance-worker` yang **sudah tidak dirujuk kode
mana pun** sejak 2026-08-02, padahal yang dibaca `can-edit`.

### Terverifikasi

- `php -l` bersih; `npm run build` bersih
- Tidak ada lagi `is_maintenaner` di seluruh `resources/js/`
- Tidak ada lagi `ddd`/`dd` aktif di `AdminController@sirkulasiAwal`

### ⚠️ `dd`/`ddd` aktif LAIN yang BELUM disentuh — lebih banyak dari catatan lama

Dokumen `05_temuan_dan_jebakan.md` D2 hanya menyebut dua (`EmployeeController:117`,
`AdminController:153`). Penyisiran ulang menemukan **lima**, dan tiga di antaranya ada di alur
transaksi inti yang dipakai tiap hari:

| Lokasi | Method | Akibat kalau gagal |
|---|---|---|
| `TransactionLoanController:489` | `store_buku_transaksi_batch` | `dd($exception)` sebelum `withErrors` — **jalur input nasabah lama & FastCreateV2** |
| `TransactionLoanController:1142` | `bayar_pinjaman` | `dd($e)` sebelum `with('error', ...)` |
| `TransactionLoanController:1204` | `destroy_angsuran` | `ddd($e)` **sebelum `DB::rollBack()`** — rollback tidak pernah jalan |
| `EmployeeController:117` | `store` | `ddd($e)` sebelum `withErrors` |
| `AdminController:202` | `loan_balancing` | `dd($inBalanceDay)` — route debug, sudah tercatat sebagai temuan A5 |

Yang di `destroy_angsuran` paling serius: `ddd()` mendahului `DB::rollBack()`, jadi saat gagal
transaksinya **tidak pernah di-rollback secara eksplisit**.

**Sengaja tidak diperbaiki** — di luar lingkup yang diminta, dan menyentuh alur transaksi harian
(`bayar_pinjaman`, `destroy_angsuran`) butuh persetujuan terpisah.

---

## AL — Empat `dd`/`ddd` sisa di blok catch dibuang (2026-08-12)

Lanjutan AK. Semua `dd`/`ddd` di jalur penanganan error kini bersih.

| Berkas | Method | Perubahan |
|---|---|---|
| `TransactionLoanController.php` | `store_buku_transaksi_batch` | `dd($exception)` → `Log::error` (+ `nik`, `kelompok`, `user_id`, `line`) |
| idem | `bayar_pinjaman` | `dd($e)` → `Log::error`; **`with('error', ...)` → `withErrors(...)`** |
| idem | `destroy_angsuran` | `ddd($e)` dihapus, **urutan diperbaiki** — `DB::rollBack()` sekarang jalan lebih dulu |
| `EmployeeController.php` | `store` | `ddd($e)` → `Log::error` |

Pesan error sekarang menyertakan `$e->getMessage()` — mengikuti pola yang sudah dipakai
`store_buku_transaksi` (`:322`), supaya staf bisa melaporkan sebab yang konkret.

### Dua perbaikan yang lebih dari sekadar menghapus baris

**`destroy_angsuran` — urutan salah.** `ddd($e)` **mendahului** `DB::rollBack()`. Karena `ddd`
menghentikan eksekusi total, transaksinya **tidak pernah di-rollback secara eksplisit** saat gagal.
Sekarang `DB::rollBack()` dipanggil lebih dulu.

**`bayar_pinjaman` — errornya tidak akan tampil walau `dd` dibuang.** Baris di bawahnya memakai
`with('error', ...)`, sementara `HandleInertiaRequests::share()` **hanya meneruskan flash key
`message`** (temuan D1). Jadi menghapus `dd` saja tetap menyisakan kegagalan senyap — user melihat
aksi "berhasil" padahal gagal. Diganti `withErrors()`.

### Terverifikasi

- `php -l` bersih di kedua berkas; aplikasi boot, 88 route utuh
- `grep` `dd(`/`ddd(` aktif di `app/Http/Controllers`, `app/Traits`, `app/Models` → **tinggal satu**
  (`AdminController:202`, lihat di bawah)

> **Batas verifikasi**: jalur `catch`-nya **tidak diuji dengan kegagalan sungguhan** — memaksa error
> DB di database produksi bersama tidak sepadan risikonya. Percobaan lewat tinker justru terhalang
> gerbang izin `havePermissionByDate` (temuan E1: superuser ditolak) sebelum mencapai `try`.
> Verifikasi yang dilakukan: kompilasi + pembacaan diff.

### Yang SENGAJA tidak diubah

**`AdminController:202` — `dd($inBalanceDay)` di `loan_balancing`.** Ini **bukan** di blok catch:
dia pernyataan terakhir method, jadi dump itulah satu-satunya keluaran route tersebut. Membuangnya
membuat route mengembalikan kosong, bukan memperbaiki apa pun. Ini route debug yang tertinggal
(temuan A5) dan perlu diputuskan terpisah: dihapus rutenya, atau dijadikan halaman sungguhan.

---

## AM — Tahap 2: tabel agregat baru + perintah pembangkit (2026-08-12)

| Berkas | Isi | Tabel |
|---|---|---|
| `app_laravel/.../2026_08_12_160000_create_work_days_table.php` **(BARU)** | kalender kerja nasional | `work_days` — **TULIS (DDL)** |
| `app_laravel/.../2026_08_12_160100_create_transaction_daily_closings_table.php` **(BARU)** | agregat harian | `transaction_daily_closings` — **TULIS (DDL)** |
| `app_laravel/.../2026_08_12_160200_create_transaction_monthly_closings_table.php` **(BARU)** | agregat bulanan | `transaction_monthly_closings` — **TULIS (DDL)** |
| `app/Models/WorkDay.php` **(BARU)** | `hariKerja`, `tanggalWajar`, `hariKerjaBulan`, `sudahDikonfirmasi` | BACA |
| `app/Models/TransactionDailyClosing.php` **(BARU)** | `KOLOM_TURUNAN`, `KOLOM_MANUAL`, `terkunci()`, `setoranSudahDicatat()` | BACA/TULIS |
| `app/Models/TransactionMonthlyClosing.php` **(BARU)** | `EMBER`, `GESER_EMBER`, `akhirMenurutArus()`, `selisihArusVsPortofolio()`, `lengkap()`, `kuotaMlHabis()` | BACA/TULIS |
| `app/Console/Commands/GenerateClosingRows.php` **(BARU)** | `closing:generate {periode} [--branch=] [--dry-run]` | TULIS (baris nol) |

**Belum ada satu pun pembaca.** Ketiga tabel kosong dari sudut pandang aplikasi berjalan.

### Tiga jenis kolom dipisah tegas di daily_closings

| Jenis | Contoh | Sifat |
|---|---|---|
| Turunan dari tabel LAIN | `drop`, `storting`, `storting_*`, `pemutihan` | dihitung aplikasi; **tidak bisa** generated (generated column hanya boleh merujuk kolom sebaris) |
| Input manual | `kasbon`, `transport`, `keluar`, `target`, `setoran_mantri` | sumber kebenaran sendiri → **wajib ikut dikunci**, karena mengunci tabel sumber tidak membekukannya padahal masuk rumus tunai |
| Generated STORED | `do11`, `titipan9`, `debit`, `kredit`, `tunai`, `selisih` | mustahil melenceng dari input sebaris |

**`STORED`, bukan `VIRTUAL`.** Sifat "mustahil melenceng" sama, tapi hasilnya sudah jadi saat dibaca —
tabel lama memakai `VIRTUAL` sehingga dihitung ulang tiap baris tiap kali dibaca, dan dashboard
menjumlah ribuan baris.

**Generated column TIDAK dimasukkan ke `$fillable`.** Tabel lama mencantumkan keenamnya di `$fillable`
padahal MySQL menolak penulisannya (error 1906) — jebakan yang ditemukan di bagian AC. Model baru
menghilangkannya sama sekali.

### Terverifikasi (setelah migrasi dijalankan user)

- Ketiga tabel terbentuk; **8 generated column terkonfirmasi `STORED GENERATED`** lewat
  `information_schema`
- `closing:generate 2026-10 --branch=90 --dry-run` → 270 harian + 60 bulanan, **0 baris ditulis**
- Dijalankan sungguhan → 270 harian (10 kelompok × 27 hari kerja) + 60 bulanan (10 × 6)
- **0 baris jatuh di hari Minggu** — bawaan kalender bekerja
- `hari_kerja` per hari tagih: Sen/Sel/Rab 4, Kam/Jum/Sab 5 = **27**, cocok dengan kalender
  Oktober 2026 sungguhan (1 Okt = Kamis)
- **Idempoten**: dijalankan ulang → tetap 270/60, tidak menggandakan
- Perhitungan generated diuji dengan angka nyata (drop 1jt, storting 500rb, kasbon 200rb,
  transport 50rb, setoran 745rb): `do11=110.000`, `titipan9=90.000`, `debit=810.000`,
  `kredit=1.050.000`, `tunai=-240.000`, `selisih=985.000` — **semua tepat**
- `selisih` = `NULL` selama `setoran_mantri` masih `NULL` (alarm belum berlaku sebelum kasir mencatat)
- **Penulisan generated column ditolak**: lewat `$fillable` diabaikan diam-diam; dipaksa lewat
  query builder → `SQLSTATE[HY000] 1906`
- Tanpa `--branch`, perintah tidak menghasilkan apa pun karena belum ada kantor bertanda migrasi
- Data uji sudah direset ke nol

### Catatan keadaan database

**270 baris harian + 60 bulanan untuk Karawang 2 periode Oktober 2026 dibiarkan ada.** Semuanya nol,
tidak ada yang membacanya (cabang 90 belum ditandai migrasi), dan `closing:generate` idempoten
sehingga aman dibangkitkan ulang. Kalau kantor percontohan ternyata bukan Karawang 2, baris ini
bisa dihapus tanpa akibat apa pun.

### Yang SENGAJA belum dikerjakan

- **Pengisian `work_days`** — kalender Oktober belum ditetapkan, jadi perintah jatuh ke bawaan
  Senin–Sabtu dan memperingatkan "BELUM dikonfirmasi". Menu penetapan kalender belum dibuat.
- **Perhitungan kolom turunan** (`drop`, `storting`, 6 ember, `pemutihan`) — itu mesin Tahap 3.
- **Gerbang `AgregasiScope` belum disambungkan** ke satu pun titik baca; alur lama utuh.

---

## AN — Data Agustus+ dihapus & stock-take mundur otomatis (2026-08-12)

### Penghapusan data atas permintaan user

Skenario uji: berpura-pura data berhenti di Juli 2026. **Tanpa cadangan (keputusan user).**

| Tabel | Terhapus | Maks tanggal sesudahnya | Sisa |
|---|---:|---|---:|
| `transaction_loans` | **7.035** | 2026-07-31 | 1.947.522 |
| `transaction_loan_instalments` | 5 | 2026-07-27 | 11.750.387 |
| `transaction_daily_recaps` | 1.262 | 2026-07-31 | 480.814 |
| `transaction_sirculations` | 561 | 2026-07-01 | 69.319 |

Semua dalam transaksi, kriteria `>= 2026-08-01`. Diperiksa dulu sebelum menghapus: **tidak ada**
white_off, penyesuaian saldo, `previous_loan_id`, `postponed_loan_id`, atau `settled_by_loan_id`
yang merujuk pinjaman sasaran — jadi tidak ada baris yatim.

**Yang ikut hilang, sudah disampaikan ke user sebelum eksekusi**: 6.239 pinjaman `acc` dan 705 `open`
— pengajuan yang belum cair, dibuat antara 25 April–2 Agustus. User memilih cakupan penuh sadar.
Yang benar-benar cair hanya 21 pinjaman (Rp 11,8 juta).

Efek samping menguntungkan: ikut terbawa 7 pinjaman bertanggal mustahil (2028-06, 2028-10, 2035-10,
`3026-07`) dan 1 baris rekap bertahun `3026` — yang selama ini nyangkut permanen di ember ML.

Tidak ada baris rekap Agustus yang sudah di-approve kepala/kasir, jadi **tidak ada angka bertanda
tangan yang hilang**.

Tabel baru tidak tersentuh: `daily_closings` 270, `monthly_closings` 60, `work_days` 0,
`saldo_adjustments` 0.

### Akibatnya pada laporan stock-take

Baris sirkulasi sebuah periode **lahir saat bulan SEBELUMNYA ditutup**. Karena baris Agustus terhapus,
di data sekarang **belum ada kantor yang menutup buku Juli** — dan halaman stock-take yang default-nya
mengambil bulan berjalan akan menampilkan semua kelompok sebagai "belum dinyatakan" dengan kolom
kuota kosong. Benar secara angka, tapi terbaca seperti halaman rusak.

| Berkas | Perubahan |
|---|---|
| `app/Http/Controllers/MigrasiController.php` | `periodeTerakhirBerdata()` **(BARU)**; `stockTakeMl` memakainya untuk periode bawaan; `server_filter` dapat `periode_diminta` + `periode_mundur` |
| `resources/js/Pages/Migrasi/StockTakeMl.jsx` | Panel kuning saat mundur: menyebut bulan yang diminta, alasannya, dan periode yang ditampilkan |

**Mundur hanya berlaku untuk BAWAAN.** Pilihan eksplisit user dihormati apa adanya — termasuk bulan
kosong, karena "kosong" itu sendiri jawaban yang mungkin sedang dicari. Ini bukan tambalan untuk
kondisi data sekarang saja: tiap awal bulan sebelum ada kantor menutup buku, halaman ini akan selalu
kosong sesaat.

### Terverifikasi

| Cara buka | Tampil | `periode_mundur` | Hasil |
|---|---|---|---|
| tanpa parameter | 2026-07 | `true` | 60 baris, 56 dibuka, 4 ditutup |
| pilih Agustus | 2026-08 | `false` | 60 baris, semua "belum dinyatakan" |
| pilih Juli | 2026-07 | `false` | sama dengan bawaan |

`php -l` bersih, prettier bersih, `npm run build` bersih.

---

## AO — Tahap 3 (bagian 1): mesin penghitung agregat harian (2026-08-12)

| Berkas | Isi | Tabel |
|---|---|---|
| `app/Helpers/Ember.php` **(BARU)** | `dari()`, `dariSelisih()`, `selisihBulan()`, `ekspresiSql()`, `kategori()`, konstanta `SEMUA`/`KATEGORI` | — |
| `app/Helpers/HitungAgregat.php` **(BARU)** | `harian()`, `harianBanyak()`, `kosong()` | `transaction_loans`, `_instalments`, `_white_offs`, `_saldo_adjustments` — **BACA** |
| `app/Console/Commands/HitungClosing.php` **(BARU)** | `closing:hitung {periode} [--branch=] [--tulis] [--rinci]` | `transaction_daily_closings` — TULIS (hanya dengan `--tulis`) |
| `app/Console/Commands/GenerateClosingRows.php` | pembuatan baris BULANAN dikeluarkan | — |

### Satu fungsi acuan ember — kenapa tidak memakai yang lama

`AppHelper` punya tiga fungsi serupa yang **sengaja dibiarkan** untuk alur lama. Ketiganya tidak bisa
dipakai di sini karena keluarannya cuma 4 nilai, dan nilai `1` melahap `month1`+`month2`+`ccm`
sekaligus — jadi secara struktur tidak bisa memisahkan tiga ember pertama.

`Ember` menyediakan versi PHP **dan** versi SQL (`ekspresiSql()`) yang dibangkitkan dari konstanta
yang sama, supaya keduanya tidak bisa menyimpang diam-diam. Versi SQL dipakai agar penjumlahan
jutaan angsuran tidak perlu ditarik ke PHP.

### Baris bulanan tidak lagi dibangkitkan di muka

Kolom `awal_*` berisi saldo awal; baris kosong berarti mengklaim "saldo awal nol" padahal yang benar
"belum ditetapkan" — pembedaan yang sama yang kita jaga di stock-take antara `Y=null` dan `Y=0`.
Barisnya akan lahir saat serah terima atau saat hari pertama dikunci. 60 baris uji yang terlanjur
dibuat sudah dihapus.

### Bug yang ditemukan saat pengujian, dan diperbaiki

Uji pertama menghasilkan **`drop = 0`** padahal sumbernya Rp 641,9 juta. Sebabnya: `storting()`
mengembalikan array hasil `kosong()` yang memuat `'drop' => 0`, lalu `array_merge` di `harianBanyak()`
**menimpa** nilai drop yang sudah dihitung. Diperbaiki dengan membuat `storting()` mengembalikan
kunci miliknya saja. Ditandai komentar di tempatnya supaya tidak terulang.

### Terverifikasi

**Ember — 8 kasus, versi PHP dan SQL sepakat semua**, termasuk batas geser bulan
(drop 31 Mei → angsuran 1 Juli = `ccm`, bukan `month2`) dan tanggal rusak (`0025-07-12` → `ml`).

**Mesin vs rekap lama, Karawang 2 Juli 2026 (270 baris):**

| | Mesin baru | Rekap lama | Selisih |
|---|---:|---:|---:|
| `drop` | 641.900.000 | 641.900.000 | **0** |
| `storting` | 690.985.000 | 691.290.000 | −305.000 |

**267 dari 270 baris cocok persis.** Tiga yang beda semuanya **angka lama LEBIH BESAR** dari
sumbernya. Ditelusuri satu (kel 6, 2026-07-04): sumber berisi 50 baris angsuran = Rp 3.666.000,
sedangkan rekap lama menulis Rp 3.886.000 — selisih Rp 220.000 tanpa dasar. Diperiksa juga tidak ada
angsuran bercap `NULL` maupun bercap kelompok lain yang tersembunyi. **Jadi mesin barunya benar dan
angka lamanya yang pernah disetel** — persis fenomena 8.703 mismatch yang sudah didokumentasikan.

**Setelah `--tulis` (220 baris berubah, 50 sisanya memang nol):**
- `drop` 641.900.000 dan `storting` 690.985.000 tersimpan tepat
- **jumlah 6 ember == storting → COCOK**
- generated column ikut terhitung benar: `do11` 70.609.000 (= drop × 0,11), `tunai` 119.694.000

### Keadaan data & yang belum dikerjakan

**270 baris harian Karawang 2 Juli 2026 kini berisi angka**, bukan nol lagi. Itu data uji — cabang 90
belum ditandai migrasi, jadi tidak ada halaman yang membacanya. Sebelum kantor benar-benar migrasi,
baris ini harus dihapus dan dibangkitkan ulang untuk periode migrasi yang sebenarnya.

Belum dikerjakan di Tahap 3: **hitung ulang agregat bulanan** dari harian, **kunci + log**, dan
penyambungan gerbang `AgregasiScope` ke titik baca. Alur lama masih utuh sepenuhnya.

---

## AP — Tahap 3 (bagian 2): agregat bulanan (2026-08-12)

| Berkas | Isi | Tabel |
|---|---|---|
| `app/Helpers/HitungAgregat.php` | `portofolio()`, `saldoMasuk()`, `ekspresiEfekPenyesuaian()` **(BARU)** | `transaction_loans`, `_instalments`, `_white_offs`, `_saldo_adjustments` — BACA |
| `app/Helpers/TutupBulanan.php` **(BARU)** | `susun()`, `arusDariHarian()`, `kelengkapan()` | `transaction_daily_closings` BACA, `transaction_monthly_closings` TULIS |
| `app/Console/Commands/HitungClosing.php` | opsi `--bulanan` + `susunBulanan()` | idem |

### Pergeseran ember jatuh sendiri dari pemisahan dua parameter waktu

`portofolio()` memisahkan **`$asOf`** (saldo dihitung sampai tanggal ini) dari **`$bulanReferensi`**
(ember ditentukan relatif terhadap bulan ini). Karena dipisah:

```
akhir(P)  = asOf akhir P,  referensi P
awal(P+1) = asOf akhir P,  referensi P+1    <- saldo SAMA, ember naik kelas
```

Jadi pergeseran ember bukan langkah terpisah yang harus dijalankan dan bisa terlewat — dia
konsekuensi aritmetika dari cara membacanya. Dan karena kedua sisi memakai saldo yang sama persis,
`akhir_total(P) == awal_total(P+1)` wajib benar; kalau meleset, ada yang salah.

### Hitung ulang penuh, tidak pernah menambahkan

`TutupBulanan::susun()` selalu `= SUM(harian)`, bukan `+= angka harian`. Penambahan bertahap persis
mekanisme yang membuat 4.141 rantai target patah. Idempoten: dijalankan sekali atau sepuluh kali
hasilnya sama, jadi koreksi hari lampau otomatis membetulkan bulanannya. Baris bulanan yang sudah
**terkunci dilewati** — membukanya urusan alur unlock, bukan hitung ulang otomatis.

### Terverifikasi — Karawang 2, Juli 2026, 60 baris bulanan

**Arus bulanan == jumlah harian**, ketiganya cocok: drop 641.900.000, storting 690.985.000,
pemutihan 0.

**Saldo akhir lewat dua jalur berbeda sepakat**: portofolio **1.465.836.760** vs arus
(`awal + drop×1,3 + saldo_masuk + mutasi − storting − pemutihan`) **1.465.836.760** — **cocok di 60
dari 60 baris**. Keduanya dihitung lewat jalur yang tidak berbagi kode sama sekali, jadi
kecocokannya bukan tautologi.

**Pergeseran ember, akhir Juni → awal Juli (saldo identik, ember bergeser):**

| ember | akhir Juni | awal Juli | harapan |
|---|---:|---:|---:|
| month1 | 605.136.000 | 0 | 0 |
| month2 | 277.066.000 | 605.136.000 | 605.136.000 |
| ccm | 67.844.000 | 277.066.000 | 277.066.000 |
| cm | 14.040.000 | 67.844.000 | 67.844.000 |
| mb | 37.135.000 | 14.040.000 | 14.040.000 |
| ml | 321.130.760 | **358.265.760** | 358.265.760 *(= mb + ml)* |
| **TOTAL** | **1.322.351.760** | **1.322.351.760** | **SAMA** |

Harapan dibangkitkan dari konstanta `TransactionMonthlyClosing::GESER_EMBER`, bukan diketik ulang —
jadi ujinya tidak bisa lolos karena disesuaikan.

> Percobaan pertama melaporkan "mb→ml MELESET". Itu **kesalahan skrip uji**, bukan kode: ember `ml`
> menerima dari `mb` DAN `ml`, tapi asersinya menganggap pemetaan satu-ke-satu. Kodenya sejak awal
> benar.

### Yang belum & catatan keadaan

- **`mutasi_masuk`/`mutasi_keluar` masih 0** — tabel mutasi baru ada di Tahap 5. Untuk sekarang nol
  memang benar, karena belum ada mutasi.
- **Kunci + log belum dikerjakan**, jadi `hari_terkunci` selalu 0 dan tanda tangan bulanan belum bisa
  diuji.
- **Gerbang `AgregasiScope` masih belum tersambung** ke titik baca mana pun. Alur lama utuh.
- 60 baris bulanan + 270 harian Karawang 2 Juli 2026 **berisi angka uji**. Cabang 90 belum bertanda
  migrasi sehingga tidak terbaca halaman mana pun, tapi harus dihapus & dibangkitkan ulang sebelum
  kantor benar-benar migrasi.

---

## AQ — Tahap 3 (bagian 3): gembok + jejak (2026-08-12)

| Berkas | Isi | Tabel |
|---|---|---|
| `app_laravel/.../2026_08_12_170000_create_transaction_lock_histories_table.php` **(BARU)** | jejak buka-tutup | `transaction_lock_histories` — TULIS (DDL) |
| `app_laravel/.../2026_08_12_170100_add_closing_lock_triggers.php` **(BARU)** | **5 trigger penegak** | `transaction_loans`, `_instalments` — DDL |
| `app/Models/TransactionLockHistory.php` **(BARU)** | model jejak | — |
| `app/Helpers/Gembok.php` **(BARU)** | `bolehKunci()`, `kunci()`, `buka()`, `bolehBuka()`, `barisSebelumnyaBelumTerkunci()` | `transaction_daily_closings`, `_lock_histories` — TULIS |

### Penegakan di trigger, bukan hook model

Hook Eloquent bocor di tiga jalur yang **justru biasa dipakai di proyek ini**: mass update
(`->update()`/`->delete()` tidak memicu event sama sekali), raw SQL, dan tinker. Trigger jalan di
level engine sehingga mencakup semuanya.

**Plafon jujurnya**: trigger tidak bisa membedakan siapa manusianya — koneksi `unit-app` satu user
database untuk semua request. Orang yang lebih dulu `UPDATE ... SET kasir_lock_at=NULL` lewat tinker
lalu mengedit lalu mengunci lagi **tidak akan tertangkap**; secara state kolom, saat itu memang
sedang terbuka. Menutupnya butuh privilege separation di level user database. Untuk tujuan "cegah
kesalahan manusia dan bug kode", ini proporsional.

Catatan: database ini **sudah punya trigger sebelumnya** — `branches_AFTER_INSERT` (otomatis membuat
10 kelompok tiap cabang baru, itu sebabnya semua cabang punya persis 10) dan `loans_BEFORE_DELETE`.
Jadi polanya bukan hal baru di sini.

### Terverifikasi — uji tembus ke tanggal terkunci

**Ditolak** (`SQLSTATE[45000] 1644`):

| Jalur | Hasil |
|---|---|
| Eloquent `create()` | DITOLAK |
| Query builder `insert()` | **DITOLAK** ← bocor kalau cuma hook |
| Raw SQL `DB::insert()` | **DITOLAK** ← bocor kalau cuma hook |
| Mass `update()` / `delete()` angsuran | **DITOLAK** |
| Ubah `status` / `nominal_drop` pinjaman | DITOLAK |
| Hapus pinjaman | DITOLAK |

**Sengaja LOLOS** — gembok menjaga angka, bukan seluruh baris:

| Jalur | Hasil |
|---|---|
| Ubah `notes` pinjaman di tanggal terkunci | LOLOS |
| Insert angsuran di tanggal **tidak** terkunci | LOLOS |

### Terverifikasi — lapisan Gembok

- Syarat belum terpenuhi → `boleh=false` dengan alasan terurai ("Kepala belum menyetujui…",
  "Setoran mantri belum dicatat kasir.")
- Setelah kepala approve + setoran dicatat → `boleh=true`
- `kunci()` menulis `kasir_lock_at` + jejak; **`tunai_sebelum` terekam −1.590.000**
- **Rantai bekerja**: kunci 3 Juli ditolak karena "Hari sebelumnya (02 Jul 2026) belum dikunci."
- `buka()` oleh mantri → ditolak (butuh role **dan** `can-edit`)
- `buka()` tanpa alasan → ditolak
- `buka()` oleh superuser dengan alasan → berhasil, jejaknya lengkap:
  `kunci` tunai −1.590.000, lalu `buka` dengan alasan tercatat

Seluruh data uji sudah dibersihkan: 0 baris terkunci, 0 jejak, 0 approval.

### Yang SENGAJA bukan syarat mengunci

**Kas seimbang.** Selisih fisik dibebankan ke penagih lewat pembukuan terpisah; menjadikannya syarat
membuat rantai penguncian jadi sandera masalah yang penyelesaiannya ada di buku lain.

### Sisa Tahap 3

- **Rekalkulasi berantai** saat hari lampau dikoreksi (§4.6) — belum
- **UI**: tombol kunci/buka, layar pemantau hari yang belum terkunci — belum
- **Penyambungan gerbang `AgregasiScope`** ke titik baca — belum. Alur lama masih utuh sepenuhnya.

---

## AR — Tahap 3 (bagian 4): layar closing harian (2026-08-12)

| Berkas | Isi | Tabel |
|---|---|---|
| `app/Http/Controllers/ClosingHarianController.php` **(BARU)** | `index`, `simpanManual`, `approveKepala`, `kunci`, `buka`, `hariTertinggal()` | `transaction_daily_closings` TULIS, `_lock_histories` TULIS (lewat `Gembok`) |
| `resources/js/Pages/Closing/Harian.jsx` **(BARU)** | tabel per kelompok, isian manual, tombol aksi, dialog buka kunci | — |
| `routes/web.php` | prefix `closing` (5 route) | — |
| `resources/js/Components/Sidebar.jsx` | menu "Closing Harian" | — |

### Yang bisa & tidak bisa diketik di layar ini

`drop` dan `storting` **ditampilkan tapi tidak bisa diubah** — keduanya turunan dari angsuran &
pinjaman, jadi selalu bisa diperiksa ulang ke sumbernya. Yang diisi manusia hanya `kasbon`,
`transport`, `keluar`, `setoran_mantri`.

`setoran_mantri` memakai input kosong → `null`, **bukan 0**: "kasir belum mencatat serah terima"
berbeda dari "mantri memang tidak menyetor". Pembedaan yang sama dijaga di seluruh rancangan.

Kolom **selisih** (`setoran_mantri − tunai`) ditampilkan merah kalau bukan nol — itu alarm yang
selama ini tidak ada padanannya di aplikasi.

### Pemantau hari tertinggal

Chip per kelompok berisi hari terlama yang belum terkunci beserta jumlahnya. Karena rantai menuntut
hari sebelumnya terkunci, satu hari menggantung menahan seluruh sisanya — pemantau ini yang membuat
itu ketahuan hari itu juga, bukan berbulan-bulan kemudian.

Tombol **Kunci** dinonaktifkan selama masih ada halangan, dan alasannya ditulis di bawah tombol
(bukan disembunyikan di tooltip) supaya jelas apa yang kurang.

### Terverifikasi — HTTP kernel penuh

| Peran | Hasil |
|---|---|
| kasir | **200**, komponen `Closing/Harian` |
| mantri | **403** (tidak punya `can-approve`) |

### Terverifikasi — alur lengkap

1. Simpan manual → kasbon 500.000, transport 50.000, setoran `NULL`, **tunai −1.140.000** (generated ikut terhitung)
2. Kunci tanpa syarat → **ditolak**: *"Kepala belum menyetujui rekap hari ini. Setoran mantri belum dicatat kasir."*
3. Approve kepala + setoran 1.500.000 → **selisih 2.640.000** muncul
4. Kunci → berhasil
5. Edit setelah terkunci → **ditolak**, kasbon tetap 500.000
6. Data uji dibersihkan: 0 terkunci, 0 jejak

### Catatan

Layar menampilkan peringatan kuning kalau kantornya belum ditandai migrasi — angka yang dikunci di
sana belum menggantikan rekap lama, kedua alur masih berjalan sendiri-sendiri. Itu keadaan
sebenarnya sampai gerbang `AgregasiScope` disambungkan ke titik baca.

Sisa Tahap 3: **rekalkulasi berantai** saat hari lampau dikoreksi, dan **penyambungan gerbang**.

---

## AS — Laporan kesiapan closing lama (2026-08-12)

| Berkas | Isi | Tabel |
|---|---|---|
| `app/Http/Controllers/MigrasiController.php` | `kesiapanClosing()` **(BARU)** | `transaction_daily_recaps`, `_loan_officer_groupings`, `branches` — **BACA** |
| `resources/js/Pages/Migrasi/KesiapanClosing.jsx` **(BARU)** | deret hari per kelompok, titik putus ditandai | — |
| `routes/web.php`, `Sidebar.jsx` | route + menu `migrasi.kesiapan_closing` | — |

Baca-saja, tidak menulis apa pun.

### Berhenti di titik putus, bukan menghitung total

Rekap harian hanya bisa dipercaya **sebagai rangkaian**. Karena itu laporan menelusuri hari demi hari
dari tanggal 1 dan berhenti di hari pertama yang approval kepala **atau** kasirnya belum ada. Hari
sesudah titik putus ditandai *"di luar rantai"* — angkanya belum tentu salah, tapi tidak lagi bisa
ditelusuri sebagai rangkaian.

Bedanya besar: **"22 dari 27 hari terisi" terdengar bagus**, padahal kalau yang bolong justru hari
pertama, rantainya putus sejak awal.

### Temuan: Karawang 2, Juli 2026 — kesepuluh kelompok putus di HARI PERTAMA

| kelompok | hari ada | kepala | kasir | putus di |
|---|---:|---:|---:|---|
| 1 | 27 | 22 | 20 | **2026-07-01** |
| 2 | 27 | 22 | 20 | **2026-07-01** |
| 3–10 | 27 | 22 | 19 | **2026-07-01** |

Polanya seragam: **1 dan 2 Juli punya approval kepala tapi tidak ada kasir**, lalu 3 Juli ke atas
lengkap. Jadi walau 19–20 hari dari 27 terisi lengkap, `utuh_sampai` = **tidak ada** untuk semua
kelompok — rantainya tidak pernah dimulai.

Ini persis kondisi yang membuat closing bulanan lama tidak bisa dipercaya, dan alasan kenapa alur
baru menuntut hari sebelumnya terkunci sebelum hari berikutnya boleh dikunci.

### Terverifikasi

- HTTP kernel: **200** untuk user ber-`can-approve`
- Penandaan `di_luar_rantai` benar: 1 Juli (titik putus) → `diluar=0`; 2 Juli ke atas → `diluar=1`,
  termasuk hari-hari yang sebenarnya lengkap (3–4 Juli `lengkap=1 diluar=1`)
- `npm run build` bersih

---

## AT — Perintah menandai kantor migrasi (2026-08-12)

| Berkas | Isi | Tabel |
|---|---|---|
| `app/Console/Commands/TandaiMigrasi.php` **(BARU)** | `migrasi:tandai {tanggal} [--branch=*] [--semua] [--batal] [--dry-run]` | `branches` — **TULIS** (`mulai_pendataan_baru`) |

Sebelumnya **tidak ada satu baris kode pun** yang mengisi `mulai_pendataan_baru` — satu-satunya cara
adalah SQL tangan.

### Batas per kantor dipertahankan, bukan batas tanggal global

User mengusulkan batas tanggal global (semua transaksi mulai tanggal X pakai alur baru, tanpa peduli
kantor). Lebih sederhana, tapi memindahkan 157 kantor serentak membuang tiga pengaman:

1. **Gemboknya trigger database.** Kalau ada yang salah dan terlanjur terkunci, membukanya harus satu
   per satu dengan alasan tercatat — bukan sekadar mengembalikan kode.
2. **Kantor belum migrasi adalah pembanding.** `saldo_masuk = 0` membuat rumus baru menghasilkan
   angka identik dengan rumus lama. Kalau semua pindah, tidak ada lagi yang bisa dibandingkan.
3. **Serah terima harus benar di semua kantor sekaligus** — padahal 4 kantor bahkan belum punya baris
   sirkulasi sama sekali.

Perintah ini tetap bisa memindahkan semuanya (`--semua`) kalau sudah waktunya. Yang dihindari adalah
**tidak punya pilihan selain serentak**.

### Dua pagar yang ditegakkan

- **Tanggal wajib tanggal 1.** Agregat bulanan ber-grain per periode; kantor yang pindah di tengah
  bulan punya separuh bulan di tiap alur, dan saldo awalnya tidak punya titik pijak.
- **Kalau sudah ada hari TERKUNCI, tanggal tidak boleh digeser dan penandaan tidak boleh dibatalkan.**
  Hari terkunci berarti angkanya sudah disahkan dan sumbernya dibekukan trigger — memindahkan
  batasnya membuat data itu menggantung tanpa induk.

### Terverifikasi

| Uji | Hasil |
|---|---|
| `2026-09-15` (bukan tgl 1) | **ditolak** |
| `--dry-run` | menampilkan rencana, tidak menulis |
| Tandai Karawang 2 `2026-08-01` | berhasil |
| `pakaiAgregatBaru(90, 2026-07-31)` | **false** — tetap alur lama |
| `pakaiAgregatBaru(90, 2026-08-01)` | **true** — alur baru |
| `sudahMigrasi(89)` | **false** — cabang lain tidak terpengaruh |
| `batasPenyesuaian(90)` | **2026-02-28** (= bulan migrasi − 6, akhir bulan) |
| `closing:generate 2026-09` **tanpa `--branch`** | jalan, mengambil Karawang 2 saja |

### Keadaan data sekarang

- **Karawang 2 (cabang 90) DITANDAI MIGRASI per 2026-08-01** — ini keadaan uji coba
- Baris harian: Agustus 260, September 260. Baris bulanan: 0 (memang belum waktunya)
- Agustus & September belum punya data sumber sama sekali (drop/angsuran/rekap ≥ Agustus sudah dihapus)

### ⚠️ Lubang terbesar yang tersisa sebelum cutover sungguhan

**Serah terima saldo awal belum ada alatnya.** Perintah ini sengaja mencetak peringatan setelah
berhasil: tanpa mengisi `awal_*` per ember dan sisa kuota ML, saldo awal kantor itu **nol dan salah
sejak hari pertama**. Mesin hitungnya sudah ada (`HitungAgregat::portofolio()`), yang belum ada
layar/perintah yang menjalankannya di titik cutover — termasuk pemeriksaan §13.2
(`akhir(lama) == awal(baru)`, kalau meleset migrasinya ditunda).

---

## AU — Pendaftaran migrasi otomatis lewat tutup buku (2026-08-12)

Perubahan arah atas permintaan user: **tutup buku yang mendaftarkan kantor ke alur baru**, bukan
penandaan manual.

| Berkas | Isi | Tabel |
|---|---|---|
| `config/agregasi.php` **(BARU)** | `bulan_migrasi` dari `AGREGASI_BULAN_MIGRASI` | — |
| `app/Helpers/DaftarMigrasi.php` **(BARU)** | `bulanMigrasi()`, `cobaDaftarkan()`, `siapkanBaris()`, `kemajuan()` | `branches` TULIS, `transaction_daily_closings` TULIS |
| `app/Http/Controllers/AdminController.php` | `sirkulasiAwal()` memanggil `cobaDaftarkan()` setelah commit | idem |
| `app/Http/Controllers/ClosingHarianController.php` | `tanggalBawaan()` → hari **terlama belum terkunci** | BACA |
| `.env` | `AGREGASI_BULAN_MIGRASI=2026-08` (uji coba) | — |

### Kenapa tutup buku yang jadi pemicu

Menutup buku adalah bukti paling jujur bahwa kantor siap: pembukuan lamanya sudah tuntas sampai punya
saldo awal. Kantor yang belum menutup buku tidak punya saldo awal yang bisa dipakai, jadi
memindahkannya cuma memindahkan kekosongan. Ini juga sebabnya `transaction_sirculations` sah dipakai
sebagai penanda — barisnya **hanya lahir kalau ada yang benar-benar menutup buku**.

### Kenapa masih butuh setelan bulan migrasi

Tutup buku itu kegiatan bulanan biasa. Tanpa penentu, kantor yang menutup buku bulan depan pun ikut
terdaftar padahal belum ada yang memutuskan migrasinya dimulai. `config('agregasi.bulan_migrasi')`
yang menentukan sejak kapan tutup buku berlaku sebagai pendaftaran. **NULL = mati total**, dan itu
keadaan bawaan yang aman.

### Dipanggil setelah commit, dibungkus try sendiri

Tutup buku memanggil `cobaDaftarkan()` hingga **60× per kantor** (10 kelompok × 6 hari). Pekerjaan
beratnya hanya jalan sekali — panggilan kedua keluar dalam **1 ms**.

Dijalankan **setelah** `DB::commit()` dan dibungkus `try` terpisah: kalau pendaftarannya gagal, tutup
bukunya tetap sah. Menggagalkan tutup buku gara-gara urusan migrasi akan menahan pekerjaan harian
kantor.

### Terverifikasi

| Uji | Hasil |
|---|---|
| `bulan_migrasi` belum diset | `false` — tidak mendaftarkan apa pun |
| Tutup buku untuk periode **sebelum** bulan migrasi | `false` |
| Tutup buku untuk periode = bulan migrasi | **`true`**, 866 ms, 260 baris dibuat |
| Panggilan ke-2 (dari 60×) | `false`, **1 ms**, baris tetap 260 |
| Hitung mundur (diuji dengan Juli yang punya data sumber) | 270 baris terisi: **drop 641.900.000, storting 690.985.000** — sama persis dengan mesin hitung yang diverifikasi di AO |
| Generated column ikut terhitung | `do11` 70.609.000, `tunai` 119.694.000 |
| Tanggal bawaan Closing Harian | **2026-08-01** walau hari ini 2026-08-21 |
| `kemajuan()` | 1 dari 157 kantor |

### Tanggal bawaan: hari terlama belum terkunci

Bukan hari ini. Rantai penguncian menuntut hari sebelumnya terkunci lebih dulu, jadi pekerjaan kasir
selalu mengejar dari depan — membuka layar di hari ini berarti menatap hari yang belum bisa dikunci
sementara tunggakannya ada di belakang dan tidak kelihatan.

Ini sekaligus menjawab kebutuhan "berpura-pura tanggal 1 Agustus" **tanpa memalsukan tanggal apa pun**.

### Keadaan data

Karawang 2 terdaftar per 2026-08-01 lewat jalur otomatis, 260 baris harian Agustus (semuanya nol —
Agustus memang belum punya data sumber).

`migrasi:tandai` **tetap ada** sebagai jalur pengecualian (mendaftarkan paksa, membatalkan, atau
`--semua` saat sudah yakin), bukan lagi jalur utama.

### Belum dikerjakan

**Menu pemantau migrasi** — `DaftarMigrasi::kemajuan()` sudah menyediakan datanya, layarnya belum ada.

---

## AV — Pemantau migrasi + penjadwal pembangkit baris (2026-08-12)

| Berkas | Isi | Tabel |
|---|---|---|
| `app/Http/Controllers/MigrasiController.php` | `pemantauMigrasi()`, `statusMigrasi()` **(BARU)** | `branches`, `transaction_sirculations`, `transaction_daily_closings` — **BACA** |
| `resources/js/Pages/Migrasi/Pemantau.jsx` **(BARU)** | 4 kartu ringkasan, saringan status, tabel 157 kantor | — |
| `app/Console/Kernel.php` | jadwal harian `closing-generate-bulan-depan` 01:00 | `transaction_daily_closings` — TULIS |
| `routes/web.php`, `Sidebar.jsx` | route + menu `migrasi.pemantau` | — |

Akses pemantau: `view-all-branches` (pusat & superuser) — ini pandangan nasional.

### Lubang yang ditutup penjadwal — penyakit yang sama, satu tingkat lebih tinggi

User menyoroti: *"kalau harus menunggu staf tutup buku manual, sering kali kasir lupa dan sirkulasi
bulan depannya tidak ada."*

Persis itu yang akan terulang: setelah kantor menyeberang Agustus, **tidak ada apa pun yang
membangkitkan baris September** — `closing:generate` harus dijalankan tangan. Sekarang dijadwalkan
tiap hari 01:00 untuk bulan depan.

Aman diulang tiap hari: `closing:generate` memakai `firstOrCreate`, jadi baris yang sudah ada tidak
disentuh termasuk yang sudah terkunci. Tanpa `--branch`, hanya menyentuh kantor yang sudah migrasi —
jadi selama belum ada yang menyeberang, penjadwal ini tidak menghasilkan apa pun.

### Tiga status, dan yang tengah itu alarm

| Status | Arti | Tindakan |
|---|---|---|
| `menyeberang` | sudah di alur baru | — |
| **`siap`** | **sudah tutup buku TAPI belum menyeberang** | **periksa log** — pendaftarannya semestinya otomatis, jadi ini bukan sekadar belum dikerjakan, ada yang gagal |
| `belum_tutup_buku` | belum mulai | kejar tutup bukunya |

Status `siap` sengaja diberi warna merah dan kartu tersendiri. Membedakannya dari "belum tutup buku"
itu inti gunanya: yang satu tinggal ditunggu, yang satu perlu ditelusuri.

Penanda "sudah tutup buku" dihitung dari baris `transaction_sirculations` untuk bulan migrasi —
barisnya **hanya lahir kalau ada yang benar-benar menutup buku**, jadi penanda yang jujur.

### Terverifikasi

- Penjadwal terdaftar: `closing-generate-bulan-depan`, `0 1 * * *`
- Pemantau: **200**, komponen `Migrasi/Pemantau`
- Ringkasan: bulan migrasi **2026-08**, menyeberang **1**, siap **0**, belum tutup buku **156**, total **157**
- `npm run build` bersih

> Catatan data uji: Karawang 2 tampil `menyeberang` dengan `tutup_buku=0`, karena saat pengujian aku
> memanggil `cobaDaftarkan()` langsung tanpa lewat `sirkulasiAwal` dan baris sirkulasi Agustus sudah
> terhapus lebih dulu. Di pemakaian sungguhan kombinasi itu mustahil — menyeberang mensyaratkan tutup
> buku.

### Alur lengkapnya sekarang

```
kantor tutup buku bulan sebelumnya
   └─ periode >= AGREGASI_BULAN_MIGRASI ?
        ├─ ya  → mulai_pendataan_baru diisi, baris sebulan dibangkitkan,
        │        hari yang sudah lewat langsung dihitung
        └─ tidak → berjalan seperti biasa

tiap hari 01:00 → baris bulan depan dibangkitkan untuk kantor yang sudah migrasi

Pemantau Migrasi → siapa sudah, siapa belum, siapa tersendat
```

---

## AW — Rekalkulasi disambungkan ke aksi, bukan ke penjadwal (2026-08-12)

Dua temuan user, dua-duanya benar.

### 🔴 RALAT: penjadwal yang kutambahkan di AV TIDAK AKAN PERNAH JALAN

Container `unit-app` **tidak menjalankan `schedule:run` sama sekali** — tidak ada cron, tidak ada
supervisor, tidak ada penyebutan schedule/cron di `docker-compose.yml`, `Dockerfile.dev`, maupun
`docker/entrypoint.dev.sh`.

Di AV aku menulis "terdaftar, 01:00 tiap hari". **Terdaftar memang benar, jalan tidak.** Efek
sampingnya: `app:counting-daily-balance` yang sudah ada di `Kernel.php` (`everySecond()`) juga
selama ini mati — bukan sesuatu yang aku sebabkan, tapi baru sekarang ketahuan.

Entri jadwalnya **tidak dihapus** (berguna kalau cron dipasang nanti), tapi **tidak lagi diandalkan**.

### Baris dibangkitkan saat dibutuhkan

`ClosingHarianController@index` sekarang memanggil `pastikanBarisAda()`: kalau bulan yang dilihat
belum punya baris dan kantornya sudah migrasi, barisnya dibuat saat itu juga.

Lebih dari sekadar menambal penjadwal yang mati — **sesuatu yang harus diingat seseorang adalah
persis penyakit yang sedang diobati**. Dibangkitkan saat dibutuhkan, dia tidak bisa terlewat.

Tidak membuat baris untuk bulan sebelum kantor migrasi, dan tidak menyentuh kantor yang belum migrasi.

### Rekalkulasi disambungkan ke tombol

Rancangan §4.5 sudah bilang agregat bulanan diperbarui saat tanda tangan harian. Mesinnya dibangun di
AO/AP tapi **hanya bisa dipanggil lewat perintah** — tidak pernah dari aksi. Sekarang:

| Aksi | Yang dijalankan |
|---|---|
| **Approve kepala** | hitung ulang turunan dari sumber **lebih dulu**, baru ditandai disetujui |
| **Kunci** | hitung ulang turunan lagi → kunci → **susun bulanan** |
| **Buka kunci** | buka → **susun bulanan** (jumlah hari terkunci berubah) |

Kenapa dihitung ulang **dua kali** (saat approve dan saat kunci): transaksi bisa masuk di antara
kepala melihat dan kasir mengunci. Yang disetujui harus angka saat itu, dan yang **dibekukan** harus
angka sebenarnya — bukan angka saat kepala melihat.

Kolom manual (`kasbon`, `transport`, `keluar`, `setoran_mantri`) tidak disentuh perhitungan ulang —
itu isian manusia, bukan turunan.

### Terverifikasi (skenario Juli, yang punya data sumber)

| Langkah | Hasil |
|---|---|
| Buka layar bulan tanpa baris | **270 baris dibangkitkan otomatis** |
| Sebelum approve | drop 0, storting 0 |
| **Sesudah approve kepala** | **drop 4.000.000, storting 1.970.000** — dihitung dari sumber |
| Sesudah kunci | **6 baris bulanan tersusun** |
| Baris bulanan `rabu` (1 Juli = Rabu) | drop 4.000.000, storting 1.970.000, `hari_kerja=5`, **`hari_terkunci=1`** |
| Hari lain | arus 0 (belum di-approve) tapi `awal_total`/`akhir_total` **tetap terisi** — dihitung dari portofolio, bukan dari arus |
| Buka kunci | `hari_terkunci` kembali **0**, jejak 2 baris (kunci + buka) |

Seluruh data uji dibersihkan; Karawang 2 dikembalikan ke skenario Agustus.

---

## AX — Alur diperbaiki + perintah verifikasi agregat (2026-08-12)

### Kepala hanya mengecek, kasir yang menetapkan

Koreksi user atas AW: persetujuan kepala **sebatas pengecekan**, tidak menghitung apa pun. Yang
memicu perhitungan adalah **kunci kasir**, dan setelah harian dihitung, bulanannya ikut.

| Aksi | Menulis? |
|---|---|
| Buka layar | **tidak** — angka dihitung hidup untuk ditampilkan saja |
| Approve kepala | **tidak** — murni menandai "saya sudah memeriksa" |
| **Kunci kasir** | **ya** — hitung turunan → simpan → susun bulanan |
| Buka kunci | ya — susun bulanan (jumlah hari terkunci berubah) |

Layar menandai angka hidup dengan `~` dan penjelasan bahwa yang menetapkannya adalah tombol Kunci.
Memisahkan begini membuat jelas siapa menyatakan apa: kepala menyatakan sudah memeriksa, kasir
menyatakan angkanya final.

`susunBulanan()` menyegarkan dulu hari-hari **belum terkunci** di bulan itu sebelum menjumlah — karena
baris bulanan menjumlahkan semua hari (§4.5), dan hari yang belum dikunci angkanya bisa basi. Hari
yang sudah terkunci tidak disentuh.

### `closing:verifikasi` — jawaban atas "apa yang menjamin angkanya cocok?"

| Berkas | Isi |
|---|---|
| `app/Console/Commands/VerifikasiAgregat.php` **(BARU)** | `closing:verifikasi {periode} [--branch=] [--rinci]` |

**Jaminan strukturalnya bertingkat, dan jujurnya begini:**

| Keadaan | Jaminan |
|---|---|
| Hari **terkunci** | **Kuat** — trigger database menolak perubahan sumber, jadi angkanya tidak bisa hanyut |
| Hari belum terkunci | **Tidak ada** — sumber masih bebas berubah, dan itu wajar |

Tapi jaminan trigger punya tiga celah: hari belum terkunci masih bebas; kunci dibuka lalu sumber
diubah lalu dikunci lagi tanpa hitung ulang; dan bug di kode perhitungan menulis angka salah yang
lalu dibekukan trigger dengan setia.

Perintah ini **menghitung ulang dari sumber lalu membandingkan** — satu-satunya cara *membuktikan*,
bukan menganggap. Baca-saja: tidak memperbaiki apa pun, karena memperbaiki diam-diam menghapus
buktinya.

### Dua jenis temuan dipisah — dan kenapa itu penting

Versi pertama melaporkan **1014 "meleset"** di keadaan yang sebenarnya bersih, karena menghitung
baris belum-terkunci yang memang belum pernah dihitung. Angka sebesar itu berbahaya: orang akan
belajar mengabaikannya — persis jebakan alarm palsu yang dihindari sejak §11.

Sekarang dipisah tiga:

| Jenis | Arti |
|---|---|
| **Hari terkunci meleset** | **paling serius** — angka bertanda tangan tidak cocok sumbernya |
| Bulanan ≠ jumlah harian | ada hari berubah setelah bulanan disusun; biasanya hilang sendiri saat dikunci ulang |
| Belum ditetapkan | **wajar**, ditandai abu-abu, tidak dihitung pelanggaran |

### Terverifikasi

| Uji | Hasil |
|---|---|
| Layar dibuka | drop 4.000.000 tampil, **DB tetap 0** — membaca tidak menulis |
| Approve kepala | DB **tetap 0**, ditandai disetujui |
| Kunci | DB jadi **4.000.000**, 6 baris bulanan tersusun |
| Verifikasi keadaan bersih | terkunci **cocok**, 1015 kolom "belum ditetapkan (wajar)" |
| Rusakkan baris **belum terkunci** | terkunci cocok, **bulanan 1 meleset** — label tepat |
| Rusakkan baris **terkunci** (`drop` +999.000) | **tertangkap**: tersimpan 4.999.000, harusnya 4.000.000, terkunci `ya` |

Seluruh data uji dibersihkan; Karawang 2 kembali ke skenario Agustus.
