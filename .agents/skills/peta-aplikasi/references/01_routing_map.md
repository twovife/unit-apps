# Peta Routing: Route → Controller → Fungsi → View → Komponen → Action

Sumber: `routes/web.php`, `routes/auth.php`, `php artisan route:list`.
Legenda kolom **Action di view** = apa yang bisa dilakukan user di halaman itu dan route tujuannya.

> **PENTING**: `->middleware('role:...')` di `routes/web.php` baris 46 & 76 **tidak berfungsi** (dirantai setelah `->group()`). Terverifikasi: `route:list` menunjukkan **0 route** punya middleware `role`. Satu-satunya middleware nyata di semua route aplikasi adalah `auth`. Detail: `05_temuan_dan_jebakan.md`.

---

## A. AUTENTIKASI (`routes/auth.php`)

| Method | URI | Name | Controller@method | View | Catatan |
|---|---|---|---|---|---|
| GET | `/login` | `login` | `Auth\AuthenticatedSessionController@create` | `Auth/Login` | middleware `guest` |
| POST | `/login` | — | `AuthenticatedSessionController@store` | — | **Redirect kondisional**, lihat di bawah |
| POST | `/logout` | `logout` | `@destroy` | — | → `redirect('/login')` |
| GET/POST | `/register` | `register` | `Auth\RegisteredUserController` | `Auth/Register` | ⚠️ pakai middleware `auth`, bukan `guest` |
| GET/POST | `/forgot-password` | `password.request` / `password.email` | `PasswordResetLinkController` | `Auth/ForgotPassword` | |
| GET/POST | `/reset-password` | `password.reset` / `password.store` | `NewPasswordController` | `Auth/ResetPassword` | |
| PUT | `/password` | `password.update` | `PasswordController@update` | — | dari `Profile/Partials/UpdatePasswordForm` |
| GET/POST | `/confirm-password` | `password.confirm` | `ConfirmablePasswordController` | `Auth/ConfirmPassword` | |
| GET | `/verify-email` | `verification.notice` | `EmailVerificationPromptController` | `Auth/VerifyEmail` | |

### Alur login (`AuthenticatedSessionController@store`)
```
LoginRequest->authenticate()            (rate-limit + attempt; field: username)
  → session()->regenerate()
  → if (!$user->isactive)  → Auth::logout() + ValidationException 'username' =>
                             "Akun Anda tidak aktif. Silakan hubungi administrator."
  → if ($user->hasRole('mantri')) → redirect route('mobile_apps.index')     ← MANTRI KE MOBILE
  → else                          → redirect()->intended(RouteServiceProvider::HOME)
```

---

## B. GLOBAL

| Method | URI | Name | Controller | View | Action di view |
|---|---|---|---|---|---|
| GET | `/` | `home` | Closure | `Dashboard` | hanya `<AuthenticatedLayout>` kosong |
| POST | `/set-branch` | `set-branch` | `SetBranchController@__invoke` | — | dipanggil `Components/GlobalBranchFilter.jsx` |

**`SetBranchController`** — validasi `branch_id` `required|integer|exists:branches,id`, cek `Branch::getAllowedBranchIds($user)`; lolos → `Session::put("active_branch_id_{$user->id}")` + `back()->with('message')`; gagal → `back()->withErrors('Anda tidak memiliki akses ke cabang tersebut.')`.

---

## C. BUKU TRANSAKSI — prefix `/bukutransaksi`, name `transaction.*`

Controller: **`TransactionLoanController`** (1152 baris, `use PinjamanTrait`).

| Method | URI | Name | Method controller | View / Response |
|---|---|---|---|---|
| GET | `/bukutransaksi` | `index_buku_transaksi` | `index_buku_transaksi` | `BukuTransaksi/Web/TransaksiMantri` |
| POST | `/bukutransaksi/nik` | `nasabah_buku_transaksi` | `nasabah_buku_transaksi` | **JSON** (axios) |
| POST | `/bukutransaksi` | `store_buku_transaksi` | `store_buku_transaksi` | redirect |
| POST | `/bukutransaksi/batch` | `store_buku_transaksi_batch` | `store_buku_transaksi_batch` | redirect + `printUrl` |
| GET | `/bukutransaksi/fastcreate` | `fastcreate` | `fastcreatev2` | `BukuTransaksi/Web/FastCreateV2` |
| GET | `/bukutransaksi/fastcreatev2` | `fastcreatev2` | `fastcreatev2` | idem (dua nama, satu handler) |
| GET | `/bukutransaksi/inputmacet` | `inputmacet` | `inputmacet` | `BukuTransaksi/Web/InputMacet` |
| PUT | `/bukutransaksi/action/{transactionLoan}` | `action_buku_transaksi` | `action_buku_transaksi` | redirect (dulu 500 karena nama permission salah — **sudah diperbaiki 2026-08-02**, lihat `05` bagian Z) |
| PUT | `/bukutransaksi/updateEverything/{transactionLoan}` | `updateEverything` | `updateEverything` | redirect |

### C1. `index_buku_transaksi` → `BukuTransaksi/Web/TransaksiMantri.jsx`
- **Sejak 2026-08-03: satu halaman ini melayani SEMUA lebar layar** (desktop maupun mobile browser) — tidak ada lagi halaman/route terpisah untuk mobile (`buku-transaksi-kepala` sudah dihapus). Cabang tampilan murni CSS (`hidden lg:block` vs `lg:hidden`), data dari server sama persis untuk kedua cabang.
- Data: `PinjamanTrait::getTransactionLoan($request, withPlan: true)`
- Props: `datas`, `buku_rencana`, `server_filter{month, wilayah, branch, userAuthorized, branch_id, kelompok, hari, closed_transaction}`
- Komponen anak:
  - **Desktop** (`hidden lg:block`): `@/Pages/BukuTransaksi/BukuTransaksi` (tabel) → `Action` → `Components/{Acc, ActionTable, RemoveLoan, ReStatus, ChangeDetail}` + `NewLoan/Components/RiwayatPengajuan`
  - **Mobile** (`lg:hidden`): `@/Pages/BukuTransaksi/BukuTransaksiKepala` (kartu, sama persis komponen yang dipakai menu Drop) → `Action` (sama)
  - `@/Pages/BukuTransaksi/Rencana` (tab rencana drop, sama di kedua lebar layar — masih tabel, belum ada versi kartu)
  - `./Create` → `@/Pages/NewLoan/NewNasabah`
  - Filter: `SearchComponent` (desktop, inline) + Popover (mobile, untuk branch/grouping) + `FilterBar` (mobile, chip hari/bulan/kelompok — sama seperti menu Drop) sekaligus di halaman yang sama
  - Radix `Tabs`/`Popover`, `FormatNumbering`, `BargeStatus`, `BadgeStatus`
- **Action di view**:
  | Aksi | Komponen | Verb → route |
  |---|---|---|
  | Cari nasabah by NIK | `BukuTransaksi/Action.jsx` | **axios POST** `transaction.nasabah_buku_transaksi` |
  | ACC / Tolak / Success / Gagal | `Components/Acc.jsx` | PUT `transaction.action_buku_transaksi` |
  | Tundaan (pindah tanggal drop, cuma saat status `acc`, aktif 2026-08-03 — lihat CHANGELOG bagian W) | `Components/Tundaan.jsx` (dipasang di `Acc.jsx`) | POST `transaction.tundaan_pengajuan` |
  | Ubah detail pinjaman | `Components/ChangeDetail.jsx` | PUT `transaction.updateEverything` |
  | Ubah status | `Components/ReStatus.jsx` | PUT `transaction.updateEverything` |
  | Hapus pinjaman | `Components/RemoveLoan.jsx` | DELETE `pinjaman.destroy_loan` |
  | Approve kepala | `Components/Approval.jsx` | POST `kasir.rekap.ceklist_kepala` |
  | Input pengajuan baru | `Create.jsx` → `NewNasabah` | POST `transaction.store_buku_transaksi` |

### C2. `nasabah_buku_transaksi` — endpoint axios pencarian NIK
- Validasi: `nik` → `required`, `digits:16`; pesan custom `"Harus Di isi"` / `"Angka Harus 16 Digit"`.
- Tidak ketemu → `response()->json(['data' => null, 'return_nik' => $nik])`.
- Ketemu → riwayat pinjaman dikelompokkan per `loan_officer_grouping`, dipecah jadi bucket: **cabang sendiri**, **cabang lain**, **cabang lain status ≥ 3 (macet)**, **cabang lain belum lunas**. Status dihitung `AppHelper::generateStatusAngsuran(drop_date, out_date ?? now)`.
- Dipanggil dari: `BukuTransaksi/Action.jsx`, `NewLoan/NewNasabah.jsx`, `BukuTransaksi/Web/FastCreateV2.jsx`, `BukuTransaksi/Web/InputMacet.jsx`. *(`NewLoan/BatchUpload.jsx` dihapus 2026-08-12 — berkas mati.)*

### C3. `store_buku_transaksi` — input pengajuan satuan
Validasi: `isActiveMember` (boolean, required), `request_nominal` (required, integer, **min 100000**), `nik` (required, digits:16), `nama`/`alamat` (`required_if:isActiveMember,false`), `request_date` & `tanggal_drop` (required, date).

Gerbang berurutan (semua → `back()->withErrors`):
1. `AppHelper::havePermissionByPermission('can-create')` → *"Anda Tidak Mempunyai Akses Menambahkan"*
2. cek akses hapus → *"Anda Tidak Mempunyai Akses Menghapus"*
3. `dateName(request_date) !== dateName(tanggal_drop)` → *"Hari Tidak Sama"*
4. `dateName(tanggal_drop) === 'minggu'` → *"Tidak bisa input transaksi untuk hari Minggu"*

Lalu: `AppHelper::callUnknownNik()` (NIK prefix `UB`/`ML` → generate NIK sintetis unik) → `TransactionCustomer::firstOrCreate` → `manage_customer` → `loan()->create` dalam `DB::transaction`.
Sukses: role mantri → `redirect()->route('mobile_apps.transaksi', ['kelompok' => ...])`; selain itu → `back()->with('message','Berhasil Menambahkan Pengajuan')`.

### C4. `store_buku_transaksi_batch` — input massal (FastCreateV2 / BatchUpload / InputMacet)
Validasi tambahan: `kelompok` required. Gerbang: hari Minggu ditolak; duplikasi tanggal angsuran → *"Ada angsuran yang duplikat pada tanggal yang sama."*; hari angsuran beda → *"Hari Angsuran Tidak Sama"*; nominal negatif → *"Tidak Boleh Minus"*.
Sukses → `back()->with('message','BERHASIL DITAMBAHKAN')->with('printUrl', route('pinjaman.index_pinjaman_search', [...]))`. **`printUrl` di-share ke semua halaman lewat `HandleInertiaRequests`** dan dipakai untuk auto-buka halaman cetak.

### C5. `action_buku_transaksi` — ACC/Tolak/Success/Gagal
Validasi: `status` required; `approved_nominal` `required_if:status,acc`; `drop` `required_if:status,success`.
Efek per status: `acc` → set `user_check`,`check_date`,`approved_nominal`; `tolak`/`gagal` → set `user_check`,`check_date`; `success` → set `nominal_drop`, `user_drop`.
✅ Baris 578 dulu memanggil `'can create'` (spasi) yang tidak ada di DB → melempar `PermissionDoesNotExist`. **Diperbaiki 2026-08-02** jadi `can-create`; cek mantri di baris 580 kini pakai `hasRole('mantri')`.

---

## D. PINJAMAN — prefix `/pinjaman`, name `pinjaman.*`

Controller: **`TransactionLoanController`** (sama).

| Method | URI | Name | Method | View / Response |
|---|---|---|---|---|
| GET | `/pinjaman` | `index_pinjaman` | `index_pinjaman` | `WebView/Angsuran/Index` |
| GET | `/pinjaman/drop_date` | `index_pinjaman_search` | `index_pinjaman_search` | `WebView/Angsuran/SearchByDate` |
| GET | `/pinjaman/pinjaman-macet` | `index_pinjaman_macet` | `index_pinjaman_macet` | `WebView/Angsuran/SearchByDate` |
| GET | `/pinjaman/actionloan/{transactionLoan}` | `get_loan_pinjaman` | `get_loan_pinjaman` | **JSON** `{pinjaman, instalment, pemutihan}` |
| GET | `/pinjaman/checkpengajuan/{transactionLoan}` | `checkpengajuan` | `checkpengajuan` | **JSON** `{data}` |
| POST | `/pinjaman/get-synch-angsuran/{transactionLoan}` | `get_synch_angsuran` | `get_synch_angsuran` | JSON preview |
| POST | `/pinjaman/synch-angsuran/{transactionLoan}` | `synch_angsuran` | `synch_angsuran` | redirect |
| POST | `/pinjaman/actionloan/{transactionLoan}` | `bayar_pinjaman` | `bayar_pinjaman` | redirect |
| POST | `/pinjaman/store-pengajuan-lama/{transactionLoan}` | `store_pengajuan_lama` | `store_pengajuan_lama` | redirect |
| POST | `/pinjaman/white-off-loan/{transactionLoan}` | `white_off_loan` | `white_off_loan` | redirect |
| DELETE | `/pinjaman/actionloan/{transactionLoanInstalment}` | `destroy_angsuran` | `destroy_angsuran` | redirect |
| DELETE | `/pinjaman/deleteloan/{transactionLoan}` | `destroy_loan` | `destroy_loan` | redirect |

### D1. `index_pinjaman` → `WebView/Angsuran/Index.jsx`
- Data: `PinjamanTrait::getLoan($request)`
- Rantai komponen: `WebView/Angsuran/Index` → `@/Pages/NewAngsuran/Angsuran` → `Components/AngsuranTable` (desktop) + `AngsuranTableMobile` + `BukuStorting` / `BukuStortingMobile` → `Components/Action` (dialog detail).
- `Components/Action.jsx` adalah **hub aksi angsuran**, dipakai tab "Buku Angsuran" **dan** "Buku Storting" sejak `Action22.jsx` digabung ke sini 2026-08-03 (lihat CHANGELOG bagian P). Buka dialog → **axios GET** `pinjaman.get_loan_pinjaman` → 2 Tab di atas ("Input Angsuran" = `BayarAngsuran`, "Detail Pinjaman" = grid label/nilai internal `LoanDetail`), lalu di bawahnya `Rincian Angsuran` (tabel), lalu 2 kolom `Pengajuan` + `JenisNasabah`. **`DeleteLoan`/"Hapus Pinjaman" sudah dihapus dari modal ini 2026-08-03** (bagian Q) — filenya `DeleteLoan.jsx` masih ada tapi jadi dead code, tidak diimport di manapun. `useIsMobile` juga sudah dibuang (bagian S) — tidak ada lagi cabang device, "Detail Pinjaman" selalu tampilan kartu. Gating pakai `auth.permissions` langsung (`can-create`), plus `NoEditOverlay`, `sonner` toast.

| Aksi | Komponen | Verb → route |
|---|---|---|
| Buka detail pinjaman | `NewAngsuran/Components/Action.jsx` | **axios GET** `pinjaman.get_loan_pinjaman` |
| Bayar angsuran (tab "Input Angsuran") | `BayarAngsuran.jsx` | POST `pinjaman.bayar_pinjaman` |
| Ubah jenis nasabah | `JenisNasabah.jsx` | POST `pinjaman.bayar_pinjaman` |
| Hapus angsuran | `DeleteAngsuran.jsx` | DELETE `pinjaman.destroy_angsuran` |
| Ajukan pinjaman baru (top-up/refinance, aktif 2026-08-03 — lihat CHANGELOG bagian U) | `Pengajuan.jsx` (gerbang) → `PengajuanLama.jsx` | **axios GET** `pinjaman.checkpengajuan` → POST `pinjaman.store_pengajuan_lama` |
| Sinkronisasi angsuran | `SyncAngsuran.jsx` | POST `pinjaman.get_synch_angsuran` (preview) → POST `pinjaman.synch_angsuran` |
| Pemutihan | `WhiteOff.jsx` | POST `pinjaman.white_off_loan` |
| Sirkulasi awal | `ApprovalAkhir.jsx` | POST `adminpanel.sirkulasiAwal` |

**Gerbang "Pengajuan" (`Pengajuan.jsx`, dulu `disabled={true}` permanen)**: cuma aktif kalau `saldo/pinjaman <= 0.4` DAN `status_pinjaman` (kategori umur tunggakan) masih `normal`/`cm` (bukan `mb`/`ml`). Saat submit, `store_pengajuan_lama()` membuat `TransactionLoan` baru dengan `previous_loan_id` menunjuk ke pinjaman lama — begitu pinjaman baru itu status-nya jadi `success`, `TransactionLoan::boot()` (hook `updating`) otomatis membuatkan 1 baris angsuran pelunasan pada pinjaman lama senilai sisa saldonya. Detail lengkap di `02_database_schema.md` (kolom `previous_loan_id`) dan CHANGELOG bagian U.

### D2. `index_pinjaman_search` / `index_pinjaman_macet` → `WebView/Angsuran/SearchByDate.jsx`
Dua route, satu view. `PinjamanTrait::getLoanByDate` vs `getLoanMacet($request, dailyView: true)`.
View → `@/Pages/NewAngsuran/AngsuranByDate` → `Components/AngsuranByDateTable` → `Components/Action`. Juga meng-embed `BukuTransaksi/Web/InputMacet` untuk input macet inline.

### D3. `bayar_pinjaman` — jalur tulis paling ketat
Validasi: `type_transaksi` required; `nominal` & `transaction_date` `required_if:type_transaksi,bayar` + `date`.
Gerbang (urut, semua `back()->withErrors`):
1. `AppHelper::havePermissionByDate($transaction_date)` gagal → pesan dari helper
2. angsuran ditandatangani karyawan lain → *"Anda Tidak Boleh Mengubah Angsuran Yang Ditandatangani Oleh Karyawan Lain"*
3. `dateName(transaction_date) !== dateName(drop_date)` → *"Hari Tidak Sama"*
4. drop baru → *"Ini drop Baru, isi yang bulan sebelumnya (pelunasan)"*
5. `transaction_date < drop_date` → *"tanggal bayar tidak boleh kurang dari tanggal drop"*
6. sudah bayar hari ini → *"Angsuran Hari Ini Sudah Dibayar"*
7. lunas → *"Pinjaman Sudah Lunas"*
8. nominal minus → *"Angsuran Tidak Boleh Minus"*

`user_mantri` diisi `AppHelper::getMantri($transactionLoan->loan_officer_grouping)`; `status` diisi `generateStatusAngsuran(drop_date, transaction_date)`.

### D4. `destroy_angsuran` / `destroy_loan` / `updateEverything`
Ketiganya digerbangi `AppHelper::havePermissionByDate()` — **kunci berbasis waktu, bukan role**:
- role `mantri`: tanggal < `now - 2 hari` → ditolak *"Tanggal Sudah Lewat 2 Hari, Hubungi Pimpinan Untuk Merubah"*
- role `kasir|pimpinan|kepala-mantri|pengawas`: **selalu true** (dua cabang if mengembalikan `true` — lihat 05)
- role lain: ditolak *"User Tidak Punya Akses Merubah Data"*

`updateEverything` tambahan: tolak kalau ada angsuran bertanggal < drop_date baru → *"Pinjaman Mempunyai Angsuran Dengan Tanggal < Tanggal Drop yang diubah, Hubungi IT Untuk Mengubah"*.

---

## E. KASIR / REKAP — prefix `/kasir/rekap`, name `kasir.rekap.*`

Controller: **`TransactionDailyRecapController`** (`use RekapTrait`).

| Method | URI | Name | Method | Data dari | View |
|---|---|---|---|---|---|
| POST | `/kasir/rekap` | `rekap_post` | `rekap_post` | — | redirect |
| POST | `/kasir/rekap/ceklist-kepala` | `ceklist_kepala` | `ceklist_kepala` | — | redirect |
| GET | `/kasir/rekap/permantri` | `rekap_permantri` | `rekap_permantri` | `getRekapPermantriData` | `WebView/Rekap/RekapPerMantri` |
| GET | `/kasir/rekap/rencana` | `rencana_drop` | `rencana_drop` | `getRencanaDropKepalaData` | `WebView/RencanaDropKepala/Index` |
| GET | `/kasir/rekap/rekap-satu` | `rekap_satu` | `rekap_satu` | **`getRekapDuaData`** | `WebView/Rekap/RekapSatu` |
| GET | `/kasir/rekap/rekap-dua` | `rekap_dua` | `rekap_dua` | **`getDataRekapDua`** | `WebView/Rekap/RekapDua` |

⚠️ Penamaan **tertukar dan menyesatkan**: `rekap_satu()` memanggil `getRekapDuaData()`, `rekap_dua()` memanggil `getDataRekapDua()`. Jangan ubah tanpa cek dua-duanya.

**`rekap_post`** — input kasbon & transport. `firstOrNew` by `{transaction_loan_officer_grouping_id, date}`. Kalau `type == 2` dan `daily_kepala_approval` kosong → tolak *"Data belum di approve kepala"*. `type == 2` juga menstempel `daily_kasir_approval` + `daily_kasir_approval_user`. Dipanggil dari `Pages/Kasir/Rekap/Components/Action.jsx`.

**`ceklist_kepala`** — approval kepala + target minggu depan. Validasi 9 field wajib: `id`, `date`, `keluar`, `baru`, `lama`, `rencana`, `tanggal_rencana_minggu_depan`, `rencana_minggu_depan`, `target_minggu_depan`. Menghitung ulang `drop` (`SUM nominal_drop` status success) dan `storting` (`SUM nominal` instalment) langsung dari DB, lalu `firstOrCreate` baris rekap minggu depan untuk menyimpan `target` + `target_on`. Dipanggil dari `Pages/BukuTransaksi/Components/Approval.jsx`.

**`deleteRekap`** — ada di controller tapi **tidak terdaftar di routes** (dead code).

Komponen halaman rekap: `Pages/Kasir/Rekap/{RekapContent, Permantri}` + `Components/{Action, TableRekap, TableRekapKasir, TableRekapPerMantri, TunaiMantri}`; rencana drop: `Pages/Kasir/RencanaDrop/{Content, TableRekap}`.

---

## F. MOBILE APPS (MANTRI) — prefix `/mobile_apps`, name `mobile_apps.*`

Controller: **`MobileAppsMantriController`** (`use RekapTrait, PinjamanTrait`). Semua method hanya: panggil trait → render. Tidak ada logika tulis.

| URI | Name | Data | View |
|---|---|---|---|
| GET `/mobile_apps` | `index` | — | `MobileApps/Index` (menu) |
| GET `/mobile_apps/create` | `create` | — | `MobileApps/Create/Index` |
| **POST** `/mobile_apps/create` | `store` | — | 🔴 **method `store` tidak ada → 500** |
| GET `/transaksi` | `transaksi` | `getTransactionLoan($r, false, sortDesc: true)` | `BukuTransaksi/Mobile/TransaksiMantri` |
| GET `/angsuran` | `angsuran` | `getLoanMantri($r, true)` | `MobileApps/Angsuran/Index` |
| GET `/macet` | `macet` | `getLoanMacet($r)` | `MobileApps/Angsuran/SearchByDate` |
| GET `/byDates` | `byDates` | `getLoanByDate($r)` | `MobileApps/Angsuran/SearchByDate` |
| GET `/rencana-drop-kepala` | `rencana_drop_kepala` | `getRencanaDropKepalaData` | `MobileApps/RencanaDropKepala/Index` |
| GET `/rekap-permantri` | `rekap_permantri` | `getRekapPermantriData` | `MobileApps/Rekap/RekapPerMantri` |
| GET `/rekap-satu` | `rekap_satu` | `getRekapDuaData` | `MobileApps/Rekap/RekapSatu` |
| GET `/rekap-dua` | `rekap_dua` | `getDataRekapDua` | `MobileApps/Rekap/RekapDua` |

**Action di view mobile**: `MobileApps/Create/Index.jsx` → POST `transaction.store_buku_transaksi` (bukan `mobile_apps.store`). Halaman lain hanya navigasi/filter (`router.get` ke route-nya sendiri). Navigasi: `Components/shadcn/SidebarMobile.jsx` + `Pages/Dashboard/MantriDashboard.jsx`.

**Aturan bisnis `getLoanMantri()` (dipakai `mobile_apps.angsuran`)**, dikonfirmasi user 2026-08-03: dua bucket digabung jadi satu `datas`:
- Bucket bulanan (`groupByMonth`): pinjaman `status='success'` dengan `drop_date` dalam **jendela 5 bulan** (bulan berjalan + 4 bulan ke belakang, `subMonthNoOverflow(4)`). Isinya nasabah yang masih dalam masa cicilan normal — termasuk yang sudah lunas (ditandai field `lunas`), bukan cuma yang belum lunas.
- Bucket `"ML"` (`dataMlGenerate`): pinjaman dengan `drop_date` **lebih tua** dari jendela 5 bulan itu (macet/lewat masa normal), TAPI **hanya yang punya cicilan tercatat bulan ini** (`whereHas('loan_instalment', ... nominal > 0`)). Nasabah ML tanpa setoran bulan ini tidak ikut muncul di sini.

Route terpisah `mobile_apps.buku-angsuran` (pakai `getLoan()`, bukan `getLoanMantri()`) **dihapus 2026-08-03** — data & tampilannya sama persis dengan `pinjaman.index_pinjaman` (`WebView/Angsuran/Index`), jadi cukup satu.

---

## G. ADMINISTRASI

| Method | URI | Name | Controller@method | View |
|---|---|---|---|---|
| GET | `/administrasi/manpower` | `administrasi.manpower.index` | `EmployeeController@index` | `WebView/ManPower/Index` |
| POST | `/administrasi/manpower` | `administrasi.manpower.store` | `EmployeeController@store` | redirect |

**`index`** — `branch_id` dari `$request->branch_id ?? AuthScope::branch_id`. Ambil `Employee::with('username.rolelist','employment')` per cabang, urut `date_resign`, `employment_id`, `area`. Props: `datas` (id, identity_id, employee_name, username, rolelist, username_status, address, employment, isActive, resign_date, hire_date), `roles`, `server_filter`.
View → `@/Pages/Administrasi/ManPower/ManPower` → `GenerateUser.jsx`.

**`store`** (buat user login untuk karyawan) — `username` di-suffix `_{kode_cabang}` **sebelum** validasi. Validasi `id`, `branch_id`, `username` (`unique:users,username`), `role`. Membuat `users` dengan **password default `4343abab`** dan email `{username}@usberdigital.com`, `isactive=1`, lalu `syncRoles`.
🔴 Blok `catch` memanggil `ddd($e)` → dump-and-die, `withErrors` tak pernah tercapai.

`create/show/edit/update/destroy` ada tapi **kosong** dan tidak diroutekan.

---

## H. BATCH INPUT — prefix `/batch-input`, name `batch_input.*`

Controller: **`BatchInputController`**.

| Method | URI | Name | Method | Response |
|---|---|---|---|---|
| GET | `/batch-input` | `index` | `index` | `Administrasi/BatchInput/Index` |
| POST | `/batch-input/check` | `validateData` | `validateData` | JSON |
| POST | `/batch-input` | `store` | `store` | JSON |

View `Pages/Administrasi/BatchInput/Index.jsx` (508 baris) — parsing CSV pakai **`papaparse`**, tabel editable `EditableRow.jsx`, state lokal (`branchId` default hardcoded `'78'`, `selectedHari` default `'SENIN'`).
**Alur**: upload CSV → **axios POST** `batch_input.validateData` → tampilkan hasil validasi → **axios POST** `batch_input.store`.

Fungsi custom controller:
- `private createAngsuran($loan,$tanggal,$nominal,$mantriChoice,$mantri)` — skip kalau nominal ≤ 0; `user_input` **hardcode `4955`**.
- `private generateStaticDatesByDay($monthInput,$hariIndo)` — daftar tanggal untuk hari tertentu dalam sebulan.
- `store` — per baris: `TransactionCustomer::firstOrCreate(nik)` → `manage_customer()->firstOrCreate` → cabang: `drop_date < hari ini` → status `success` + generate angsuran (target `nominal * 1.3`, angsuran pertama H+7); selain itu pengajuan biasa.

🔴 `store` baris 52–53 query `Employee::where('jabatan', ...)` — **kolom `jabatan` tidak ada** di tabel `employees` (adanya `employment_id` → `employments.jabatan`). Terverifikasi melempar `SQLSTATE[42S22] Unknown column 'jabatan'`.

---

## I. ADMIN PANEL — prefix `/admin-panel`, name `adminpanel.*`

Controller: **`AdminController`**.

| Method | URI | Name | Method | View / Efek |
|---|---|---|---|---|
| GET | `/admin-panel` | `index` | `index` | `AdminPanel/Index` — 🔴 500, lihat 05 |
| GET | `/admin-panel/monitoring-staffs` | `monitoring_staff` | `monitoring_staff` | `AdminPanel/MonitoringStaff` |
| GET | `/admin-panel/loan-balancing` | `loan_balancing` | `loan_balancing` | 🔴 berakhir `dd()` |
| POST | `/admin-panel` | `post_permission` | `post_permission` | buat Role/Permission |
| POST | `/admin-panel/role-assign` | `role_assign` | `role_assign` | `$role->syncPermissions()` |
| POST | `/admin-panel/user-assign` | `user_assign` | `user_assign` | `$user->syncRoles()` |
| POST | `/admin-panel/giveMaintenerWorker` | `giveMaintenerWorker` | `giveMaintenerWorker` | give/revoke permission |
| POST | `/admin-panel/sirkulasiAwal` | `sirkulasiAwal` | `sirkulasiAwal` | isi saldo awal sirkulasi |

**Action di view** (`Pages/AdminPanel/`):
| Aksi | Komponen | Route |
|---|---|---|
| Buat permission | `Components/Permission.jsx` | POST `adminpanel.post_permission` (`type=permission`) |
| Buat role | `Components/Role.jsx` | POST `adminpanel.post_permission` (`type=role`) |
| Assign permission ke role | `Index.jsx` (`useForm`) | POST `adminpanel.role_assign` |
| Assign role ke user | `Components/AssignRoles.jsx` | POST `adminpanel.user_assign` |
| Toggle maintenance worker | `Components/MaintenerWorker.jsx` | POST `adminpanel.giveMaintenerWorker` |

`monitoring_staff` **hardcode `wilayah = 1`** dan mengambil seluruh `TransactionLoan` cabang wilayah itu tanpa batas tanggal (berat).
`sirkulasiAwal` — `firstOrCreate` `TransactionSirculation` pada awal bulan berikutnya, isi `amount`, `cm_amount`, `mb_amount`, `ml_amount`. Blok catch berisi `ddd($e)`.

---

## J. ROUTE LAIN / SISA

| Method | URI | Name | Status |
|---|---|---|---|
| GET | `/pindah-resort` | `pindah_resort` | `PindahResortController@PindahResort` — ⚠️ **GET yang melakukan mass-update**, pakai `echo`, tanpa gerbang role. Lihat 05. |
| GET | `/batchupdate` | `batchupdate.batch_create` | 🔴 `LoanController@batch_create` — **controller kosong**, 500 |
| POST | `/batchupdate` | `batchupdate.batch_post` | 🔴 idem |
| GET | `/getviewasd` | — | debug closure, `dd(VIsBalanceLoanWithDailyReport::all())` |
| GET/PATCH/DELETE | `/profile` | `profile.*` | `ProfileController` → `Profile/Edit` + 3 partial |
| GET | `/api/user` | — | `auth:sanctum`, satu-satunya route API |

**View tanpa route (legacy / hanya dipakai sebagai komponen):**
`Pages/SuperUser/*` (mereferensikan route mati `transaction.getnik`, `transaction.store`), `Pages/MobileApps/_Index.jsx`, `Pages/NewAngsuran/Components/AngsuranTableMobilexxx.jsx`, `Pages/Welcome.jsx` (route `dashboard` tidak ada — yang ada `home`).

`Pages/NewLoan/BatchUpload.jsx` dan `Pages/NewLoan/BatchUploadx.jsx` **sudah dihapus 2026-08-12** — dua-duanya tidak dirender controller mana pun dan tidak diimport dari mana pun.

`Pages/BukuTransaksi/Web/BatchUpload.jsx` **sengaja dipertahankan** walau juga tidak terjangkau: dia dirender `TransactionLoanController@fastcreate` (`:26`), tapi **kedua** route `transaction.fastcreate` dan `transaction.fastcreatev2` sama-sama menunjuk ke method `fastcreatev2`. Jadi `fastcreate()` tidak pernah dipanggil. Keputusan user 2026-08-12: berkasnya dibiarkan.

---

## Ringkasan endpoint axios (bukan Inertia)

| Route | Verb | Dipanggil dari | Balasan |
|---|---|---|---|
| `transaction.nasabah_buku_transaksi` | POST | Action.jsx, NewNasabah, BatchUpload, FastCreateV2, InputMacet | `{data, return_nik}` |
| `pinjaman.get_loan_pinjaman` | GET | NewAngsuran/Components/Action.jsx (dipakai bersama tab Buku Angsuran & Buku Storting sejak `Action22.jsx` digabung 2026-08-03) | `{pinjaman, instalment, pemutihan}` |
| `pinjaman.checkpengajuan` | GET | PengajuanLama.jsx | `{data}` |
| `pinjaman.get_synch_angsuran` | POST | SyncAngsuran.jsx | preview angsuran |
| `batch_input.validateData` | POST | BatchInput/Index.jsx | hasil validasi CSV |
| `batch_input.store` | POST | BatchInput/Index.jsx | hasil simpan |
| `transaction.store_buku_transaksi_batch` | POST | BatchUpload.jsx, InputMacet.jsx (via `axios({...})`) | redirect/JSON |
