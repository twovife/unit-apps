# Auth, Role/Permission, Scope Cabang, Redirect & Validasi

## 1. Isi nyata tabel Spatie (dari DB live)

### 8 Role + jumlah user (per 2026-08-02)
| Role | Jumlah user | Permission yang dimiliki |
|---|---:|---|
| `superuser` | 1 | **semua 21** permission |
| `pusat` | 30 | `access-main-app`, `create-employees`, `edit-employees`, `lock-sksw`, `lock-tb`, `view-all-branches` |
| `stafkontrol` | 1 | `access-main-app`, `lock-sksw`, `lock-tb`, `view-all-groups`, `view-zone-branches`, **`can-create`**, **`can-approve`** |
| `pimpinan` | 145 | `can-approve`, `can-create`, `create-employees`, `edit-employees`, `view-all-groups`, `view-delegated-branches` |
| `kasir` | 314 | `can-approve`, `can-create`, `create-employees`, `edit-employees`, `view-all-groups` |
| `kepala-mantri` | 395 | `can-approve`, `can-create`, `view-all-groups` |
| `pengawas` | 0 | `can-approve`, **`can-create`**, `view-all-groups`, `view-delegated-branches` |
| `mantri` | 1.738 | `can-create` |

### Aturan 3 permission Unit Apps — ini kontraknya, jangan diubah tanpa keputusan bisnis
| Permission | Role pemegang | Maksud |
|---|---|---|
| `can-create` | mantri, kepala-mantri, pimpinan, pengawas, stafkontrol, kasir, superuser | Boleh mengajukan/menginput transaksi. **Role `pusat` TIDAK termasuk.** |
| `can-approve` | sama seperti di atas **minus mantri** | Boleh ACC/Tolak. Mantri tidak boleh meng-ACC pengajuannya sendiri. |
| `can-edit` | **superuser saja** | Permission **bongkar-pasang**: diberikan per-user lewat menu Hak Akses hanya saat perlu maintenance/koreksi data, lalu dicabut lagi. **Jangan tempelkan ke role.** Menggantikan peran `maintenance-worker` yang lama. |

### 21 Permission
```
access-main-app          can-approve              can-create               can-edit
bypass-sksw-lock         bypass-tb-lock           create-contributions-all create-contributions-zone
create-employees         delete-employees         edit-employees           kasirpusat
lock-sksw                unlock-sksw              lock-tb                  unlock-tb
maintenance-worker       view-all-branches        view-all-groups          view-delegated-branches
view-zone-branches
```
Semua `guard_name = web`. Didefinisikan di `app_laravel/database/seeders/RolesAndPermissionsSeeder.php` — **tambah permission baru dari sana**, bukan dari unit-apps.

> `maintenance-worker` masih ada di tabel tapi **sudah tidak dirujuk kode unit-apps** — seluruh pemakaiannya dipindah ke `can-edit` (2026-08-02). Aman dihapus kalau `app_laravel` juga tidak memakainya.

> ⚠️ **Seeder ≠ DB live.** Seeder mengawali dengan `truncate()` pada `permissions`, `roles`, `role_has_permissions`, **dan `model_has_roles`**, lalu meng-assign ulang role semua user dari `employment_id`. Menjalankannya akan membuang ±2.624 penetapan role yang ada (live per 2026-08-11; `role_has_permissions` = 53 baris, cocok persis dengan breakdown per-role di tabel atas). Untuk mengubah mapping permission pada DB yang sudah jalan, pakai sinkronisasi tertarget lewat tinker (`givePermissionTo`/`revokePermissionTo` + `forgetCachedPermissions()`), lihat bagian 8.

> Drift yang diketahui: seeder memberi `stafkontrol` permission `view-all-branches`, tapi DB live tidak punya. Belum disamakan.

---

## 2. Middleware — kondisi sebenarnya

`app/Http/Kernel.php` (struktur Laravel lawas, meski framework `^12.0`):
- group `web`: `EncryptCookies`, `AddQueuedCookiesToResponse`, `StartSession`, `ShareErrorsFromSession`, `VerifyCsrfToken`, `SubstituteBindings`, **`HandleInertiaRequests`**, `AddLinkHeadersForPreloadedAssets`
- alias: `auth`, `guest`, `signed`, `throttle`, `verified`, `can`, dst.

🔴 **Tidak ada satu pun route dengan middleware `role:`.** Di `routes/web.php` middleware dirantai **setelah** `->group()`:
```php
Route::prefix('bukutransaksi')->name('transaction.')->group(function () { ... })
  ->middleware('role:superuser|pimpinan|kasir|mantri|kepala-mantri|pengawas|stafkontrol'); // ← NO-OP
```
`->group()` mengembalikan Router, bukan RouteRegistrar — middleware-nya menguap. Terverifikasi: `php artisan route:list | grep -c "role:"` → **0**.

**Konsekuensi**: setiap user yang login bisa memanggil **setiap** route. Otorisasi sepenuhnya bergantung pada pengecekan di dalam controller. Kalau menambah route baru, **jangan andalkan pola yang ada** — pasang middleware di dalam `->group(function(){ ... })` atau cek eksplisit di controller.

---

## 3. `HandleInertiaRequests::share()` — props global di semua halaman

```php
'auth' => [
  'user'        => $request->user()->load('employee', 'employee.branch'),
  'permissions' => $request->user()->getAllPermissions()->pluck('name'),   // array string
  'roles'       => $request->user()->getRoleNames(),                       // array string
  'global_filter' => [                     // lazy closure
     'active_branch_id' => $scope->branch_id,
     'active_wilayah'   => $scope->wilayah,
     'active_kelompok'  => $scope->kelompok,
     'allowed_branches' => Branch[] {id, unit, type, wilayah},   // [] / semua cabang kalau null
  ],
],
'ziggy'    => [...Ziggy, 'location' => url],
'flash'    => ['message' => session('message'), 'timestamp' => now()],
'printUrl' => ['url' => session('printUrl'), 'timestamp' => now()],
```

**Aturan pakai di frontend**: cek **jabatan** → `auth.roles`; cek **kewenangan** → `auth.permissions`. Jangan campur. `roles` ditambahkan 2026-08-02 — sebelumnya frontend hanya menerima `permissions`, sehingga `permissions.includes('superuser')` / `('unit mantri')` selalu false karena keduanya role.

⚠️ `flash` hanya meneruskan key **`message`**. Controller yang memakai `->withError('...')` (tunggal, via magic `__call`) menulis ke session key `error` yang **tidak pernah dibaca frontend** → pesan hilang diam-diam. Yang benar: `->withErrors('...')` (masuk ke `errors` bawaan Inertia) atau `->with('message', ...)`.

`printUrl` dipakai untuk memicu halaman cetak setelah batch input sukses.

---

## 4. `AuthScope` — satu-satunya sumber scope data

`app/Helpers/AuthScope.php`

### `getActiveBranchId()`
```
session("active_branch_id_{$user->id}")
  → valid jika allowedBranches === null (akses semua) ATAU branch_id ada di dalamnya
  → kalau tidak valid/kosong: Branch::getDefaultBranchId($user), lalu di-Session::put ulang
```

### `resolve()` → object
| Field | Asal |
|---|---|
| `branch_id` | `getActiveBranchId()` |
| `wilayah` | `Branch::find(branch_id)->wilayah` (fallback 1) |
| `kelompok` | **punya `view-all-groups`** → `request('kelompok')`, kalau kosong ambil kelompok terkecil di cabang itu. **Tidak punya** → dipaksa `$user->employee->area` (mantri terkunci di areanya) |
| `allowed_branches` | `Branch::getAllowedBranchIds($user)` |
| `user` | `auth()->user()` |

### `Branch::getAllowedBranchIds($user)` → `array|null`
```
null                       = tanpa batas (punya view-all-branches → superuser, pusat)
[]                         = tidak ada akses (user tanpa employee)
selain itu, gabungan dari:
  1. employee->branch_id                                    (selalu, cabang utama)
  2. employee_zones.branch_id      jika punya view-zone-branches      (stafkontrol)
  3. employee_branches.branch_id   jika punya view-delegated-branches (pimpinan, pengawas)
```

### `Branch::getDefaultBranchId($user)`
punya `view-zone-branches` → zona pertama; selain itu → `employee->branch_id`; fallback → cabang `wilayah = 0` (pusat) atau id 1.

### Mengganti cabang aktif
`POST /set-branch` ← `Components/GlobalBranchFilter.jsx` (combobox di sidebar). Divalidasi ulang di server terhadap `getAllowedBranchIds`.

---

## 5. Gerbang otorisasi di dalam kode (yang benar-benar berjalan)

### `AppHelper::havePermissionByDate($date)` — kunci berbasis waktu
Dipakai `destroy_angsuran`, `destroy_loan`, `updateEverything`.
| Role | Aturan |
|---|---|
| `mantri` | `$date < now - 2 hari` → **tolak** *"Tanggal Sudah Lewat 2 Hari, Hubungi Pimpinan Untuk Merubah"* |
| `kasir`, `pimpinan`, `kepala-mantri`, `pengawas` | **selalu `true`** — kedua cabang `if` sama-sama return true, batas 2 bulan tidak berefek |
| lainnya (termasuk `superuser`, `pusat`, `stafkontrol`) | **tolak** *"User Tidak Punya Akses Merubah Data"* |

### `AppHelper::get_closed_date($date)` — batas bulan tertutup
| Kondisi | Hasil |
|---|---|
| role `superuser` / `stafkontrol` | `null` (tanpa batas) |
| permission `maintenance-worker` | `null` |
| role `kasir`/`pimpinan`/`kepala-mantri`/`pengawas` | awal bulan lalu (`$date - 1 bulan`, `startOfMonth`) |
| role `mantri` / lainnya | `$date` itu sendiri |
Nilainya keluar sebagai `server_filter.closed_transaction` dan dipakai UI untuk mengunci input (`NoEditOverlay`).

### `AppHelper::branch_permission($user, $branch_id)` — shim kompatibilitas
Mengembalikan `canShowGroupingBranch: false`, `canShowBranch: false`, `canShowKelompok: hasPermissionTo('view-all-groups')`, `canCreate: hasPermissionTo('can-create')`, `branches: collect()` (kosong — daftar cabang sekarang lewat `global_filter`).
`AppHelper::user_authorized()` mengembalikan collection kosong. `AppHelper::user_permission()` mengembalikan **nama role pertama** (fallback `'mantri'`).

### `AppHelper::getMantri($officerGrouping)`
Cari `Employee` di `branch_id` + `area` yang `date_resign IS NULL` → kalau tak ada, ambil employee pertama → kalau tetap kosong, pakai employee user yang login.

> Dulu diawali cabang `hasAnyPermission(['unit pimpinan','unit mantri','unit km'])` → id employee sendiri. Ketiga nama itu tidak pernah ada di DB sehingga cabang tersebut **tidak pernah jalan**; dihapus 2026-08-02. **Sengaja tidak diubah jadi cek role** — mengaktifkannya akan membuat `user_mantri` pada pinjaman baru terisi employee id si penginput (pimpinan/KM) alih-alih mantri area, mengubah atribusi data dan rekap per-mantri. Itu keputusan bisnis terpisah.

---

## 6. Gating di frontend

> `Hooks/useFrontEndPermission.js` **SUDAH DIHAPUS** (2026-08-02). Kelima flagnya (`isUnit`, `isMantri`, `isPusat`, `isCreator`, `isCanShowKelompok`) memeriksa nama yang tidak pernah ada di tabel `permissions` (`'unit'`, `'area'`, `'pusat'`, `'can create'`, `'can show kelompok'`) sehingga selalu `false` untuk semua user — gagal senyap, karena `Array.includes` tidak melempar. **Jangan dibuat ulang.** Baca `auth.permissions` / `auth.roles` langsung lewat `usePage()`.

Padanan yang dipakai sekarang:

| Flag lama | Sekarang | Lokasi |
|---|---|---|
| `isCreator` | `permissions.includes('can-create')` | NewNasabah, NewAngsuran/Action (dipakai bersama tab Buku Angsuran & Buku Storting sejak `Action22.jsx` digabung 2026-08-03) |
| `isCanShowKelompok` | `permissions.includes('view-all-groups')` | FastCreateV2, InputMacet, NewNasabah |
| `isMantri` | `roles.includes('mantri')` | ChangeDetail, Profile/Edit |
| `isUnit` | `permissions.includes('can-approve')` | Rencana.jsx:20 |
| `isPusat` | — dihapus, tidak dipakai | — |

### `Components/Sidebar.jsx`
```js
isPimpinan  = permissions.includes('can-approve')
           || permissions.includes('view-all-groups')
           || permissions.includes('view-all-branches')
isSuperUser = roles?.includes('superuser')   // ← ROLE, bukan permission
```
Judul menu rekap berubah tergantung `view-all-groups`.

### Cek berbasis role di frontend
`roles.includes('superuser')` → Sidebar:76, ManPower:97,119, Register:28
`roles.includes('mantri')` → Profile/Edit:10 (pilih MobileLayout), ChangeDetail:18
`roles.includes('pimpinan')` → WebView & MobileApps `Rekap/RekapDua` (hanya judul halaman)

---

## 7. Peta redirect

| Titik | Kondisi | Tujuan |
|---|---|---|
| `POST /login` | `!$user->isactive` | logout + `ValidationException` pada field `username` |
| `POST /login` | `hasRole('mantri')` | `route('mobile_apps.index')` |
| `POST /login` | selain itu | `redirect()->intended(RouteServiceProvider::HOME)` |
| `POST /logout` | — | `/login` |
| middleware `auth` | belum login | `route('login')` (`app/Http/Middleware/Authenticate.php`) |
| middleware `guest` | sudah login | `RouteServiceProvider::HOME` |
| `store_buku_transaksi` sukses | role `mantri` | `route('mobile_apps.transaksi', ['kelompok' => ...])` |
| `store_buku_transaksi` sukses | selain itu | `back()->with('message')` |
| `store_buku_transaksi_batch` sukses | — | `back()` + `printUrl` → `pinjaman.index_pinjaman_search` |
| Semua gerbang gagal | — | `back()->withErrors('<pesan Indonesia>')` |
| Semua exception DB | — | `DB::rollBack()` + `back()->withError(...)` / `with('error', ...)` ⚠️ tak tampil di UI |

## 8. Cara cek cepat

```bash
# permission tertentu ada atau tidak
docker exec unit-app php artisan tinker --execute="
  var_dump(Spatie\Permission\Models\Permission::where('name','can-create')->exists());"

# simulasi user + gerbang
docker exec unit-app php artisan tinker --execute="
  \$u = App\Models\User::role('kasir')->first();
  Illuminate\Support\Facades\Auth::login(\$u);
  var_dump(App\Helpers\AuthScope::resolve());
  var_dump(App\Helpers\AppHelper::havePermissionByDate('2026-07-01'));"

# cabang yang boleh diakses seorang user
docker exec unit-app php artisan tinker --execute="
  \$u = App\Models\User::find(1);
  print_r(App\Models\Branch::getAllowedBranchIds(\$u));"
```
