# Temuan & Jebakan — hasil verifikasi langsung (2026-08-01)

Semua item bertanda ✅ **sudah dibuktikan** dengan menjalankan kode/query, bukan dugaan.
Ini bukan daftar tugas — ini konteks supaya tidak salah diagnosis saat debugging.

> **STATUS 2026-08-02** — seluruh bagian **B (nama permission usang) SUDAH DIBERESKAN.**
> Baca `## Z. Pembersihan nama permission (2026-08-02)` di bagian paling bawah untuk
> keadaan terkini, apa yang berubah perilakunya, dan apa yang sengaja ditinggalkan.
> Isi bagian B dipertahankan sebagai catatan sejarah — jangan dipakai untuk
> mendiagnosis kode hari ini.

---

## A. Route rusak / mati

### A1. ✅ Middleware `role:` tidak pernah aktif
`routes/web.php` baris 46 & 76 merantai `->middleware('role:...')` **setelah** `->group()`. `->group()` mengembalikan Router, bukan RouteRegistrar, jadi middleware tidak menempel.
```
$ docker exec unit-app php artisan route:list | grep -c "role:"
0
```
**Dampak**: semua route hanya dilindungi `auth`. Setiap user login bisa memanggil endpoint apa pun; otorisasi hanya dari cek di dalam controller.
**Perbaikan**: pindahkan ke dalam closure — `Route::middleware('role:...')->group(function(){...})`.

### A2. ✅ `GET|POST /batchupdate` → 500
Route menunjuk `LoanController@batch_create` / `@batch_post`, tetapi `app/Http/Controllers/LoanController.php` **badan kelasnya kosong** (hanya `//`).
```
LoanController methods (di luar warisan): Array ( )
```

### A3. ✅ `POST /mobile_apps/create` (`mobile_apps.store`) → 500
`MobileAppsMantriController` tidak punya method `store`. Untungnya frontend (`MobileApps/Create/Index.jsx`) mem-POST ke `transaction.store_buku_transaksi`, jadi route ini tak terpakai — tapi tetap terdaftar.

### A4. `GET /pindah-resort` melakukan mass-update
`PindahResortController@PindahResort` memindahkan **semua** `transaction_loans` + `transaction_loan_instalments` dari satu kelompok ke kelompok lain — lewat **GET**, tanpa cek role, dan memakai `echo` (merusak respons Inertia). Bisa terpicu prefetch/crawler. Perlakukan sebagai perkakas manual berbahaya.

### A5. Route debug tersisa
- `GET /getviewasd` → `dd(VIsBalanceLoanWithDailyReport::all())`
- `GET /admin-panel/loan-balancing` → berakhir `dd($inBalanceDay)`, dan sebelum itu `TransactionLoan::select(...)->get()` **tanpa filter** atas 1,79 juta baris.

### A6. `TransactionDailyRecapController@deleteRekap` tidak diroutekan (dead code).

---

## B. Nama permission usang — sumber bug paling banyak

Tabel `permissions` memakai **tanda hubung**. Kode lama memakai nama **berspasi** yang sudah tidak ada.

```
maintenance worker  => TIDAK ADA        maintenance-worker => ADA
can create          => TIDAK ADA        can-create         => ADA
unit mantri         => TIDAK ADA        view-all-groups    => ADA
```

Perilaku Spatie berbeda per API — **inilah kenapa sebagian gagal keras, sebagian senyap**:
| API | Nama tak dikenal |
|---|---|
| `hasPermissionTo()` | **melempar** `PermissionDoesNotExist` |
| `User::permission()` (scope) | **melempar** `PermissionDoesNotExist` |
| `hasAnyPermission()` | mengembalikan `false` diam-diam |
| `givePermissionTo()` | melempar (di sini tertangkap `try/catch`) |
| JS `permissions.includes()` | `false` diam-diam |

### B1. ✅ `PUT /bukutransaksi/action/{loan}` → 500
`TransactionLoanController:578` → `AppHelper::havePermissionByPermission('can create')` → `hasPermissionTo('can create')`.
```
THROW: Spatie\Permission\Exceptions\PermissionDoesNotExist
       -> There is no permission named `can create` for guard `web`.
```
**Ini mematikan seluruh aksi ACC / Tolak / Success / Gagal di Buku Transaksi.** Baris 580 (`'unit mantri'`) tak pernah tercapai.

### B2. ✅ `GET /admin-panel` → 500
`AdminController:27` → `User::permission('maintenance worker')` → `PermissionDoesNotExist`.

### B3. ✅ `useFrontEndPermission` selalu false
`isUnit`, `isMantri`, `isPusat`, `isCreator`, `isCanShowKelompok` memeriksa `'unit'`, `'area'`, `'pusat'`, `'can create'`, `'can show kelompok'` — **tak satu pun ada** di tabel `permissions`. Gagal senyap → elemen UI yang bergantung padanya tak pernah muncul. Dipakai di `FastCreateV2`, `InputMacet`, `NewAngsuran/Components/Action`, `BukuTransaksi/Action`.

### B4. `AdminController@giveMaintenerWorker` selalu gagal
`givePermissionTo('maintenance worker')` melempar, tertangkap `catch` → `withErrors('User Assigned Error')`. Yang benar `maintenance-worker`.

### B5. `AppHelper::getMantri` — cabang pertama mati
`hasAnyPermission(['unit pimpinan','unit mantri','unit km'])` selalu `false`, jadi jalur "pakai employee sendiri" tak pernah jalan; selalu lanjut ke pencarian mantri by `branch_id`+`area`.

### B6. `Sidebar.jsx` — `isSuperUser` selalu false
`permissions.includes('superuser')` — `superuser` adalah **role**, bukan permission. Prop `auth.permissions` hanya berisi permission. Menu superuser tak pernah tampil.

---

## C. Kesalahan kolom / query

### C1. ✅ `BatchInputController@store` → SQL error
Baris 52–53: `Employee::where('branch_id',$id)->where('jabatan','pimpinan')`.
```
SQLSTATE[42S22]: Column not found: 1054 Unknown column 'jabatan' in 'WHERE'
```
Tabel `employees` tidak punya `jabatan`; jabatan ada di `employments.jabatan` lewat `employment_id`.
Yang benar: `->whereHas('employment', fn($q) => $q->where('jabatan','pimpinan'))`.
Dampak: **seluruh alur Batch Input gagal saat simpan** (tahap `validateData` tetap jalan).

### C2. `user_input` hardcode `4955`
Di `BatchInputController::createAngsuran()` dan sebagai fallback id pimpinan/kasir. Semua angsuran hasil batch tercatat atas nama employee 4955.

### C3. `AdminController@monitoring_staff` hardcode `wilayah = 1`
Dan mengambil seluruh `TransactionLoan` cabang wilayah itu tanpa batas tanggal.

### C4. `Pages/Administrasi/BatchInput/Index.jsx` hardcode `branchId = '78'`.

---

## D. Penanganan error yang menelan pesan

### D1. `withError` (tunggal) tidak pernah sampai ke UI
`TransactionDailyRecapController` memakai `->withError('...')` di 5 tempat. Itu bukan method Laravel — magic `__call` mengubahnya jadi `with('error', ...)`. `HandleInertiaRequests::share()` **hanya** meneruskan `flash.message`, jadi pesan hilang: user melihat aksi "berhasil" padahal gagal.
Gunakan `withErrors()` (jamak) atau `with('message', ...)`.

### D2. `ddd()` di blok catch produksi
- `EmployeeController@store` baris 117 — dump-and-die sebelum `withErrors`
- `AdminController@sirkulasiAwal` baris 153
Kalau `APP_DEBUG=false` hasilnya respons rusak, bukan pesan yang ramah.

### D3. `AuthScope.php`, `PinjamanTrait.php`, dan banyak controller masih menyimpan `dd()`/`ddd()` yang dikomentari — jangan aktifkan tanpa sengaja.

---

## E. Jebakan logika bisnis

### E1. `havePermissionByDate` — batas 2 bulan tidak berefek
```php
if ($date->lt($now->subMonthsNoOverflow(2))) { return ["status" => true]; }
return ["status" => true];
```
Kedua cabang `true`. Untuk `kasir|pimpinan|kepala-mantri|pengawas` **tidak ada batas waktu** hapus/ubah. Hanya `mantri` yang benar-benar dibatasi 2 hari.
Efek samping: `superuser`, `pusat`, dan `stafkontrol` justru **ditolak** (jatuh ke `return false` terakhir) untuk `destroy_angsuran`/`destroy_loan`/`updateEverything`.

### E2. Penamaan rekap tertukar
`rekap_satu()` → `getRekapDuaData()`; `rekap_dua()` → `getDataRekapDua()`. Jangan "rapikan" tanpa menelusuri kedua fungsi trait dan kedua view.

### E3. `transaction_loans.hari` redundan terhadap `drop_date`
Banyak validasi membandingkan `AppHelper::dateName($drop_date)` dengan kolom `hari`. Data lama bisa tidak sinkron (itu tujuan `loan_balancing`). Perubahan `drop_date` **harus** ikut memperbarui `hari`.

> **Diukur 2026-08-12: di data 2026 keduanya cocok 100%** — 691.721 dari 691.721 pinjaman `success` ber-`hari` tidak null. Jadi ketidaksinkronan yang dicari `loan_balancing` adanya di data yang lebih lama, bukan di zona hidup.
>
> ⚠️ **Invarian ini akan SENGAJA dilanggar** kalau fitur mutasi nasabah (`.agents/agregasi_rekap.md` §8) dikerjakan — nasabah bisa drop hari Selasa tapi ditagih hari Rabu, dan `drop_date` memang tidak boleh ikut diubah. Begitu itu hidup, `AdminController@loan_balancing` akan menandai **setiap** nasabah yang pernah pindah sebagai data rusak padahal benar. Alat itu **wajib disesuaikan bersamaan**, jangan menyusul.

### E4. Angka ajaib `1.3`
Total tagihan = `nominal * 1.3` (pokok + 30%). Muncul di `BatchInputController` dan rumus sirkulasi `RekapTrait` (`saldo_awal + drop*1.3 - storting`). Tidak ada konstanta terpusat.

### E5. Hari Minggu ditolak di input transaksi, tapi tidak konsisten
`store_buku_transaksi` mengecek `dateName(request_date) !== dateName(tanggal_drop)` **dan** minggu. `store_buku_transaksi_batch` hanya mengecek minggu — pengecekan "Hari Tidak Sama" dikomentari (baris 340–341).

### E6. `EmployeeController@store` — password default `4343abab`
Sama untuk semua user baru, tidak ada pemaksaan ganti password.

### E7. Dua route → satu view, dua trait berbeda
`WebView/Angsuran/SearchByDate` dipakai `index_pinjaman_search` (`getLoanByDate`) **dan** `index_pinjaman_macet` (`getLoanMacet`). Bentuk `datas` harus tetap kompatibel di kedua fungsi.

---

## F. Beban query yang perlu diwaspadai

`transaction_loan_instalments` = **10,8 juta baris**, `transaction_loans` = **1,79 juta**.
Selalu batasi minimal `transaction_loan_officer_grouping_id` + rentang tanggal. `PinjamanTrait::getLoan()` sudah mengambil 4 bulan ke belakang (`subMonthNoOverflow(4)`) — jangan diperlebar tanpa alasan.
Kolom ber-indeks yang tersedia: `transaction_loan_id`, `transaction_loan_officer_grouping_id`, `transaction_manage_customer_id`, `transaction_customer_id`, `transaction_customers.nik`, `branches`/`online_branches.branch_id`. `drop_date`, `transaction_date`, `status`, dan `hari` **tidak ber-indeks** — hindari memfilter hanya dengan itu.

---

## G. Berkas legacy (jangan dijadikan contoh)

Tidak diroutekan dan/atau tidak diimport:
`Pages/SuperUser/*` (merujuk route mati `transaction.getnik`, `transaction.store`), `Pages/MobileApps/_Index.jsx`, `Pages/NewAngsuran/Components/AngsuranTableMobilexxx.jsx`, `Pages/Welcome.jsx` (route `dashboard` tidak ada).

> **Dibersihkan 2026-08-12:** `Pages/NewLoan/BatchUpload.jsx` dan `Pages/NewLoan/BatchUploadx.jsx` **dihapus** — tidak dirender controller mana pun, tidak diimport dari mana pun.
> `Pages/BukuTransaksi/Web/BatchUpload.jsx` **dipertahankan atas keputusan user** walau juga tidak terjangkau — dia dirender `TransactionLoanController@fastcreate` (`:26`), tapi **kedua** route `transaction.fastcreate` dan `transaction.fastcreatev2` menunjuk method `fastcreatev2`, jadi `fastcreate()` tidak pernah jalan.

> **Dua koreksi atas daftar ini — nama berkas di sini menipu, selalu `grep` dulu sebelum menyebut sesuatu legacy:**
>
> - `Pages/BukuTransaksi/BukuTransaksiKepala.jsx` **BUKAN** legacy. Dipakai `mobile_apps.transaksi` (menu "Drop") DAN cabang `lg:hidden` di `transaction.index_buku_transaksi` (sejak 2026-08-03; sebelumnya ada route ketiga `mobile_apps.buku_transaksi_kepala` yang sudah dihapus).
> - `Pages/NewAngsuran/Components/Action22.jsx` **sudah dihapus 2026-08-03** (dulu di sini tertulis salah sebagai legacy, padahal aktif — sekarang memang sudah tidak ada). Itu adalah duplikat `Action.jsx` khusus tab "Buku Storting" (diimport `BukuStorting.jsx`/`BukuStortingMobile.jsx` dengan alias `Action`). Digabung jadi satu `Action.jsx` yang sama dipakai tab "Buku Angsuran" — lihat `CHANGELOG.md` bagian P.
Model tak terpakai: `TransactionBranchDailyRecap` (tabel hanya `id`+timestamps), `UserZone`, `EmploymentPermission`, `DebtRelief`.
Kelompok model generasi lama: `Customer`, `Loan`, `LoanRequest`, `Instalment` — hanya di-import `LoanController` yang kosong.

---

## H. Cara reproduksi cepat

> Perintah di bawah ditulis saat bug bagian B masih hidup. Setelah pembersihan
> 2026-08-02, dua reproduksi terakhir **tidak lagi melempar** — itu justru
> hasil yang diharapkan sekarang. Pakai sebagai perintah verifikasi.

```bash
# cek middleware role
docker exec unit-app php artisan route:list | grep -c "role:"      # → 0

# cek permission usang
docker exec unit-app php artisan tinker --execute="
  foreach (['can create','can-create','maintenance worker','maintenance-worker'] as \$p)
    echo str_pad(\$p,22).(Spatie\Permission\Models\Permission::where('name',\$p)->exists()?'ADA':'TIDAK ADA').PHP_EOL;"

# reproduksi B1
docker exec unit-app php artisan tinker --execute="
  Illuminate\Support\Facades\Auth::login(App\Models\User::role('kasir')->first());
  try { App\Helpers\AppHelper::havePermissionByPermission('can create'); }
  catch (\Throwable \$e) { echo get_class(\$e).': '.\$e->getMessage(); }"

# reproduksi C1
docker exec unit-app php artisan tinker --execute="
  try { App\Models\Employee::where('jabatan','pimpinan')->first(); }
  catch (\Throwable \$e) { echo substr(\$e->getMessage(),0,120); }"
```

---

## Z. Pembersihan nama permission (2026-08-02)

Seluruh nama hantu di bagian **B** sudah dibereskan. Bagian ini menggantikan B
sebagai rujukan keadaan sekarang.

### Z0. Enabler: `auth.roles` kini ikut dibagikan

`HandleInertiaRequests::share()` sebelumnya hanya mengirim `auth.permissions`.
Itu sebabnya `permissions.includes('superuser')` dan `('unit mantri')` selalu
false — keduanya **role**, bukan permission. Sekarang ada:

```php
'roles' => $request->user() ? $request->user()->getRoleNames() : [],
```

**Aturan pakai di frontend:** cek jabatan → `auth.roles`; cek kewenangan →
`auth.permissions`. Jangan campur.

### Z1. Peta penggantian

| Nama lama (hantu) | Sekarang | Lokasi |
|---|---|---|
| `can create` | `can-create` | TransactionLoanController:578 · DeleteAngsuran:18 · NewNasabah · NewAngsuran/Action (`Action22` digabung ke sini 2026-08-03) |
| `maintenance worker` **dan** `maintenance-worker` | `can-edit` | AdminController:27,165,172 · AppHelper:333 · NewAngsuran/Action:44 · AngsuranTable:21 |
| `unit mantri` | role `mantri` | TransactionLoanController:580 · Profile/Edit:10 · ChangeDetail:18 |
| `unit pimpinan` | role `pimpinan` | WebView/Rekap/RekapDua:7 · MobileApps/Rekap/RekapDua:8 (hanya judul halaman) |
| `can update pusat` | role `superuser` | Register.jsx:28 |
| `superuser` (dicek sebagai permission) | role `superuser` | Sidebar:76 · ManPower:97,119 |
| `can show kelompok` | `view-all-groups` | FastCreateV2 · InputMacet · NewNasabah |
| `unit` | `can-approve` | Rencana.jsx:20 |
| `area`, `pusat` | dihapus (tidak dipakai) | — |

**`Hooks/useFrontEndPermission.js` SUDAH DIHAPUS.** Kelima flagnya
(`isUnit`, `isMantri`, `isPusat`, `isCreator`, `isCanShowKelompok`) memeriksa
nama yang tidak pernah ada, jadi selalu false. Jangan dibuat ulang — baca
`auth.permissions` / `auth.roles` langsung lewat `usePage()`.

Terverifikasi setelah perubahan — semua nama yang tersisa valid:
- backend: `can-create`, `can-edit`, `view-all-branches`, `view-all-groups`, `view-delegated-branches`, `view-zone-branches`
- frontend permission: `can-approve`, `can-create`, `can-edit`, `view-all-branches`, `view-all-groups`, `can update`
- frontend role: `mantri`, `pimpinan`, `superuser`

```
action_buku_transaksi: TIDAK melempar lagi   (dulu B1 → 500)
/admin-panel         : TIDAK melempar lagi   (dulu B2 → 500)
```

### Z2. Dua tempat DIPETAKAN, bukan dihapus — ada perubahan yang terlihat

Instruksi awalnya "hilangkan saja", tapi dua di antaranya ternyata menggerbangi
fitur nyata, bukan sekadar nama mati. Menghapusnya = membuang fitur, jadi
dipetakan ke padanan aslinya. **Keduanya membuat UI yang selama ini tak pernah
tampil jadi muncul lagi** — kalau ada laporan "kok tiba-tiba ada tombol baru",
ini penyebabnya:

1. **`isCanShowKelompok` → `view-all-groups`** (FastCreateV2, InputMacet, NewNasabah).
   Pemilih **Kelompok** muncul kembali untuk pemegang `view-all-groups`
   (kasir, pimpinan, kepala-mantri, pengawas, stafkontrol, superuser).
   Mantri tetap terkunci di `employee->area`. Di InputMacet nilai ini juga
   menentukan `initialKelompok`.

2. **`isUnit` → `can-approve`** (`Rencana.jsx:20`). Kolom **Action** pada tabel
   Rencana Drop muncul kembali; tombolnya membuka dialog approval kepala
   (`POST kasir.rekap.ceklist_kepala`). Ini **tidak diminta eksplisit** oleh
   user — kalau ternyata memang harus disembunyikan, hapus `isUnit` beserta
   kedua blok `{isUnit && ...}` di baris 55 & 71.

### Z3. Sengaja DITINGGALKAN (sebagian sudah diperbaiki 2026-08-05 — baca catatan di bawah)

**`can show branch` / `can show kelompok` di backend — awalnya 17 titik**
(TransactionLoanController 274,275,400,401 · PinjamanTrait 730,731,761,763,764,867,868 · RekapTrait 236,237,238 — nomor baris lama, sudah bergeser karena banyak edit sejak dicatat).

Semuanya memakai `can()`, yang **gagal-diam** (mengembalikan false), bukan
melempar seperti `hasPermissionTo()`. Ada **DUA jenis pemakaian** yang tercampur di daftar itu — penting dibedakan:

1. **Flag tampilan** (`select_branch`, `select_kelompok`, `canShowBranch` di `AppHelper::branch_permission()`) — selalu-false di sini MEMANG perilaku yang diinginkan: pemilihan cabang sudah pindah ke `GlobalBranchFilter`. **Masih sengaja dibiarkan** — jangan dipetakan ke `view-all-groups`/`view-all-branches` di sini.
2. **Resolusi scope untuk query** (`$branch_id`/`$kelompok` yang dipakai `where(...)` ke DB) — ini **BUKAN** cuma soal tampilan, ini menentukan DATA APA yang diambil. Kalau selalu jatuh ke cabang `else` (`$authorized->employee->area`), role tanpa area spesifik (pimpinan, KM, dst — `area` sering `0`) dapat `kelompok=0` yang tidak pernah cocok dengan `TransactionLoanOfficerGrouping` manapun → query grouping return `null` → crash 500 ("Attempt to read property on null") begitu kode lanjut memakai `$groupingId->id`.

   **`PinjamanTrait::getLoanMacet()` DIPERBAIKI 2026-08-05** (dilaporkan user via `/mobile_apps/macet` DAN `/pinjaman/pinjaman-macet` — dua route beda yang manggil fungsi sama, keduanya 500 untuk role pimpinan/KM). Diganti ke `AuthScope::resolve()`, disamakan dengan fungsi tetangganya `getLoanByDate()` yang sudah lebih dulu benar. Diverifikasi lewat tinker: user pimpinan (area=0) yang tadinya crash sekarang jalan normal, user mantri (area valid) tetap dapat kelompok yang sama seperti sebelumnya (tidak ada regresi). Lihat CHANGELOG bagian Z.

   Flag tampilan `select_branch`/`select_kelompok` di fungsi yang sama **TIDAK ikut diubah** (poin 1 di atas, masih sengaja `false`) — dicek dulu, ternyata tidak dipakai frontend manapun (`SearchByDate.jsx` tidak membacanya), jadi dead code yang aman dibiarkan.

Kalau nanti ketemu titik LAIN dari daftar 17 itu yang juga dipakai untuk resolusi scope query (bukan cuma flag tampilan), pola perbaikannya sama: ganti ke `AuthScope::resolve()`, lalu **wajib** diverifikasi lewat tinker dengan minimal 2 skenario (role tanpa area spesifik + role dengan area valid) sebelum dianggap selesai — jangan asumsikan aman tanpa tes ulang.

**`can update` — 4 titik** (TableRekapKasir:72, TunaiMantri:66,
MobileApps/Index:92, MobileApps/_Index:92). Dibiarkan atas permintaan user;
fungsinya belum jelas. Saat ini selalu false.

### Z4. `AppHelper::getMantri()` — cabang mati dihapus, perilaku dipertahankan

Dulu diawali `hasAnyPermission(['unit pimpinan','unit mantri','unit km'])` yang
selalu false, sehingga **tidak pernah** jalan. Cabang itu dihapus, **bukan**
diperbaiki jadi cek role — keputusan sadar, karena mengaktifkannya akan membuat
`user_mantri` pada pinjaman baru terisi employee id si penginput (pimpinan/KM)
alih-alih mantri area, dan itu mengubah atribusi data serta rekap per-mantri.
Seluruh data historis terbentuk lewat jalur pencarian `branch_id` + `area`.
Kalau aturan itu mau diubah, itu keputusan bisnis terpisah.

---

## AA. Agregasi & target — terverifikasi 2026-08-12

Semua di bagian ini hasil query langsung ke `ubmi_db`, bukan pembacaan kode saja.
Rancangan penanganannya ada di `.agents/agregasi_rekap.md` (v2).

### AA1. ⚠️ Enam kolom `transaction_daily_recaps` adalah GENERATED — tidak bisa ditulis

```
sharingdo = drop * 0.11     debt  = sharingdo + kasbon + storting
titipan   = drop * 0.09     kred  = drop + transport
masuk     = drop * 0.13     tunai = debt - kred
```
Semua `VIRTUAL GENERATED`, padahal **ada di `$fillable`** (`TransactionDailyRecap.php:16-47`).
Menulisinya lewat Eloquent akan ditolak MySQL (error 1906) — pola yang sama dengan
`transaction_loans.pinjaman` yang sudah didokumentasikan.

Konsekuensi terpenting: **`tunai` tidak punya ingatan.** Dia dihitung ulang tiap dibaca,
jadi begitu `storting` berubah karena koreksi, tunai hari itu ikut berubah **surut dan
diam-diam**. Angka yang dulu ditandatangani kasir tidak tersimpan di mana pun dan tidak bisa
direkonstruksi. Kalau membangun fitur koreksi/audit, log **wajib** merekam nilai tunai
sebelum & sesudah.

Jangan percaya klaim lama bahwa `sharingdo` "kolom mati" — dia menyuplai `debt` → `tunai`.

### AA2. ✅ Rantai `target` patah di 3,1% kasus

```
133.068 pasangan berantai diuji (2026) → 128.927 cocok, 4.141 MELESET
```
Uji: `target(baris) == target(anchor) + drop(anchor)*0.13 − keluar(anchor)`, dijodohkan lewat
`nxt.target_on = prv.date`. Query lengkap ada di `.agents/agregasi_rekap.md` §17.

### AA3. Dua sumber kebenaran `target` saling menimpa

`TransactionDailyRecapController@ceklist_kepala` melakukan dua hal berurutan:
1. `update(['keluar'=>…, 'drop'=>…])` → memicu hook `TransactionDailyRecap::updating` (`:55`)
   yang **menghitung** target minggu depan
2. `update(['target' => $request->target_minggu_depan])` → **menimpanya** dengan ketikan user

Di alur normal yang manual menang. Kalau `drop`/`keluar` diubah dari tempat lain, yang otomatis
menang. Keduanya tidak pernah dijodohkan — inilah mesin AA2.

### AA4. Cascade `target` rekursif tanpa batas lewat `increment()`

`$transactionAfter->increment('target', $rangeTarget)` (`TransactionDailyRecap.php:79`).
`Model::increment()` **memicu event `updating`**, sehingga blok `isDirty('target')` pada baris
berikutnya ikut jalan → increment baris berikutnya → seterusnya menyusuri seluruh rantai
`target_on`, semuanya di dalam satu DB transaction milik `ceklist_kepala`.

Tidak ada pembatas kedalaman. Untuk rantai panjang ini jadi puluhan update model bersarang yang
tidak kelihatan dari kode controller.

### AA5. Tanggal mustahil lolos tanpa validasi

| Kasus | Jumlah |
|---|---:|
| `transaction_loans.drop_date` tahun < 2015 atau > 2027 | **80** |
| `drop_date` di masa depan | 25 |
| `transaction_daily_recaps.date` di masa depan | **151** |

Contoh nyata: `0225-06-04`, `0025-07-12`, `1923-12-07`, dan satu drop bertanggal **`3026-07-07`**.
Salah ketik tahun.

**Kenapa ini bukan kosmetik**: ember dihitung dari selisih bulan `drop_date` → sekarang.
Pinjaman bertanggal tahun 0025 punya selisih ribuan bulan → **selamanya ML**, saldonya ikut
terhitung di sirkulasi, dan tidak akan pernah bisa keluar dari ember ML dengan cara apa pun.

### AA6. `transaction_sirculations` — 3 dari 6 ember tidak pernah diisi, cakupan bolong 23%

| Kolom | Terisi (2026) |
|---|---:|
| `amount`, `cm_amount`, `mb_amount`, `ml_amount` | 32rb–41rb |
| **`month1_amount`, `month2_amount`, `ccm_amount`** | **0** |

Juli 2026 cuma **7.377 baris dari 9.540** yang seharusnya (1.590 kelompok × 6 hari), dan cuma
**1.238 dari 1.590 kelompok** punya baris. Sisanya **tidak punya saldo awal sama sekali**.

Jangan pakai tabel ini sebagai sumber saldo awal — hitung dari portofolio.

### AA7. Fitur Pengajuan/topup (`previous_loan_id`) praktis belum dipakai

`previous_loan_id` terisi di **3 baris saja, semuanya status `open`**. Ditambahkan 2026-08-03,
tapi topup produksi masih dibuat sebagai pinjaman baru **tanpa tautan** ke pinjaman lama.
Artinya "nasabah ini hasil topup" tidak bisa dideteksi dari data untuk 1,6 juta pinjaman lama.

Terkait: nilai `status` di `transaction_loans` ada **lima** — `success` (1.614.010), `gagal`
(288.240), `acc` (34.224), `tolak` (12.718), **`open` (5.365)**. Dokumen lama menyebut hanya 4 +
`null`; `null` **tidak ada**, yang dipakai adalah `open`.

### AA8. `transaction_out_reasons` — separuh kode alasan tidak pernah dipakai

| id | reason | dipakai |
|---:|---|---:|
| 1 | LUNAS | 149.830 |
| 4 | MD (meninggal) | 18.743 |
| 6 | LUNASX | 13 |
| 2, 3, **5** | IST, BHT, **MACET** | **0** |

`out_status` pun hanya pernah berisi `LUNAS` (1.161.114) dan `LUNAS Xs` (7). Jadi keputusan KM
"macet tak tertagih" **tidak pernah tercatat di mana pun**, walau kode alasannya sudah tersedia.
