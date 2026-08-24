# Katalog Fungsi Custom (buatan sendiri, bukan bawaan Laravel/Eloquent)

Semua yang di bawah ini ditulis tangan di proyek ini. Method boilerplate resource (`create/show/edit/update/destroy` yang kosong), method Auth scaffolding bawaan Breeze, dan relasi Eloquent standar **tidak** dimasukkan.

---

## 1. `app/Helpers/AppHelper.php` (398 baris) — 25 static method

### Generator NIK
| Fungsi | Isi |
|---|---|
| `callUnknownNik($request, $batch = false)` | **Pintu masuk**. Kalau 2 huruf awal NIK = `UB` atau `ML` → generate NIK sintetis dan ulangi sampai unik di `transaction_customers`. Selain itu kembalikan NIK asli. |
| `private generateUnknownNik($request)` | `branch_id(4) + area(2) + drop_date(ym) + random(6)` — ambil branch/area dari **user yang login** |
| `private generateUnknownNik2($request)` | `branch_id(4) + kelompok(2) + drop_date(dym) + random(4)` — ambil dari **request** (dipakai mode batch) |

### Tanggal & hari (bahasa Indonesia)
| Fungsi | Isi |
|---|---|
| `dateName($date)` | nama hari Indonesia huruf kecil (`'senin'`) — dipakai di **belasan** validasi |
| `getNumbDays($namaHari)` | `'senin'`→1 … `'sabtu'`→6, selain itu 0 |
| `getNumberToNameDays($angka)` | kebalikannya, 0/lainnya → `'minggu'` |
| `monthNumber($date)` / `monthName($date)` | `'Y-m'` / nama bulan Indonesia |
| `getStortingShowDate($req_day)` | tanggal setoran yang ditampilkan: hari ini kalau hari-nya cocok, kalau tidak → kemunculan hari itu sebelumnya |
| `getIsPaid($max_date, $req_day)` | 1/0, apakah angsuran periode berjalan sudah dibayar |
| `getFirstDayOfMonthID($dayNameID, $month)` | tanggal pertama hari tertentu dalam sebulan (peta nama hari ID→EN) |

### Status pinjaman (inti aturan bisnis)
Semua berbasis **selisih bulan** antara `drop_date` dan tanggal acuan (`startOfMonth` keduanya).
| Fungsi | Keluaran | Pemetaan |
|---|---|---|
| `generateStatusAngsuran($drop, $tgl)` | `int` | `<3`→1, `=3`→2, `=4`→3, `>4`→4 |
| `generateStatusAngsuranString($drop, $tgl)` | `string` | `<3`→`normal`, `3`→`cm`, `4`→`mb`, `>4`→`ml` |
| `generateStatusAngsuranString2($drop, $tgl)` | `string` | `1`→`n1`, `2`→`ccm`, `3`→`cm`, `4`→`mb`, `>4`→`ml` |
| `status_pinjaman($int)` | `string` | 1/null→`normal`, 2→`cm`, 3→`mb`, 4→`ml` |

> Istilah: `cm` = calon macet, `mb` = macet baru, `ml` = macet lama, `ccm` = calon-calon macet.
> ⚠️ `generateStatusAngsuran` (int) dan `status_pinjaman` (int→string) **tidak simetris**: int 2 = `cm` di keduanya, tapi `generateStatusAngsuranString` memetakan selisih 3 → `cm`. Cek konteks sebelum memakai.

### Otorisasi (rincian di `03_auth_roles_scope.md`)
| Fungsi | Catatan |
|---|---|
| `havePermissionByDate($date)` | kunci berbasis waktu per role → `['status'=>bool, 'message'=>?]`. Batas 2 bulan tidak berefek (E1) |
| `havePermissionByPermission($params)` | pembungkus `hasPermissionTo` — **melempar** kalau nama permission tak ada |
| `getCheckAuth($request)` | `Auth::check() && hasPermissionTo()` |
| `get_closed_date($date)` | batas bulan tertutup per role → `server_filter.closed_transaction` |
| `user_permission()` | nama **role pertama**, fallback `'mantri'` |
| `branch_permission($authorized, $branch_id)` | shim kompatibilitas UI lama; `branches` sengaja dikosongkan |
| `user_authorized($authorized)` | mengembalikan collection kosong (deprecated) |
| `getMantri($officerGrouping)` | pilih employee mantri: aktif (`date_resign` null) di `branch_id`+`area` → mantri pertama → employee user login |
| `getMantriNoauth($officerGrouping, $idpimpinan)` | versi tanpa `auth()`, untuk batch/seeder |
| `format()` | `new AppHelper()` — tak terpakai |

---

## 2. `app/Helpers/AuthScope.php` (89 baris) — 2 method

| Fungsi | Isi |
|---|---|
| `getActiveBranchId()` | baca session `active_branch_id_{userId}`, validasi ke `getAllowedBranchIds`, jatuh ke `getDefaultBranchId` dan tulis ulang session |
| `resolve()` | → `(object)['branch_id','wilayah','kelompok','allowed_branches','user']`. **Dipanggil oleh hampir semua jalur baca.** |

## 3. `app/Models/Branch.php` — 2 static method custom

| Fungsi | Isi |
|---|---|
| `getDefaultBranchId(?User)` | `view-zone-branches` → zona pertama; selain itu `employee->branch_id`; fallback cabang `wilayah=0` / id 1 |
| `getAllowedBranchIds(?User): array\|null` | `null` = semua (`view-all-branches`); `[]` = tanpa akses; selain itu gabungan cabang utama + `employee_zones` (kalau `view-zone-branches`) + `employee_branches` (kalau `view-delegated-branches`) |

---

## 4. `app/Traits/PinjamanTrait.php` (866 baris) — 5 method

Semua diawali `AuthScope::resolve()` dan diakhiri `return ['datas' => ..., 'server_filter' => [...]]`.

| Fungsi | Tanda tangan | Dipakai | Isi |
|---|---|---|---|
| `getTransactionLoan` | `($request, bool $withPlan = false, bool $sortDesc = false)` | `transaction.index_buku_transaksi` (withPlan — satu-satunya pemakai withPlan sejak `mobile_apps.buku_transaksi_kepala` dihapus 2026-08-03), `mobile_apps.transaksi` (sortDesc) | Ambil `TransactionLoan` yang `drop_date` **atau** `request_date` jatuh di bulan terpilih, difilter `grouping_id` + `hari`. Menghitung `pinjaman_ke` dari jumlah loan `success` milik nasabah yang sama. `withPlan` menambah props `buku_rencana`. |
| `getLoan` | `($request, $dailyView = false)` | `pinjaman.index_pinjaman` (satu-satunya pemakai sejak `mobile_apps.buku_angsuran` dihapus 2026-08-03 — datanya identik dengan `pinjaman.index_pinjaman`) | Buku angsuran/storting. Menarik ke belakang **4 bulan** (`subMonthNoOverflow(4)`). Kalau `$request->date` ada, `month` + `hari` diturunkan darinya. |
| `getLoanMantri` | `($request, $dailyView = true)` | `mobile_apps.angsuran` | Varian `getLoan` khusus tampilan mantri harian |
| `static getLoanByDate` | `($request)` | `pinjaman.index_pinjaman_search`, `mobile_apps.byDates` | Daftar per tanggal drop, dikelompokkan per bulan |
| `static getLoanMacet` | `($request, $dailyView = false)` | `pinjaman.index_pinjaman_macet` (true), `mobile_apps.macet` | Hanya pinjaman berstatus macet |

## 5. `app/Traits/RekapTrait.php` (760 baris) — 4 method aktif

| Fungsi | Dipakai | Isi |
|---|---|---|
| `getRencanaDropKepalaData` | `kasir.rekap.rencana_drop`, `mobile_apps.rencana_drop_kepala` | Rencana pencairan minggu berjalan |
| `getRekapPermantriData` | `kasir.rekap.rekap_permantri`, `mobile_apps.rekap_permantri` | Rekap per mantri/kelompok |
| `getRekapDuaData` | **`kasir.rekap.rekap_satu`**, `mobile_apps.rekap_satu` | Rekap harian + saldo sirkulasi |
| `getDataRekapDua` | **`kasir.rekap.rekap_dua`**, `mobile_apps.rekap_dua` | Rekap lanjutan |
| ~~`getDataRekapDua` versi lama~~ | — | dikomentari, baris 233–394 |

⚠️ Nama tertukar (lihat `05` E2). Rumus sirkulasi yang dipakai di sini:
`round(saldo_awal + (total_drop * 1.3) - total_storting)`.

---

## 6. Method custom per Controller

### `TransactionLoanController` (1152 baris) — 18 method, semuanya custom
**Baca (render Inertia)**: `index_buku_transaksi`, `fastcreate`, `fastcreatev2`, `inputmacet`, `index_pinjaman`, `index_pinjaman_search`, `index_pinjaman_macet`
**Baca (JSON/axios)**: `nasabah_buku_transaksi`, `get_instalment_nasabah` *(tidak diroutekan)*, `get_loan_pinjaman`, `checkpengajuan`, `get_synch_angsuran`
**Tulis**: `store_buku_transaksi`, `store_buku_transaksi_batch`, `store_pengajuan_lama`, `action_buku_transaksi`, `synch_angsuran`, `bayar_pinjaman`, `white_off_loan`, `updateEverything`, `destroy_angsuran`, `destroy_loan`, `delete_loan` *(tidak diroutekan)*

### `TransactionDailyRecapController` — `rekap_post`, `ceklist_kepala`, `deleteRekap` *(tidak diroutekan)* + 4 pembungkus trait
### `AdminController` — `index`, `monitoring_staff`, `post_permission`, `role_assign`, `user_assign`, `sirkulasiAwal`, `giveMaintenerWorker`, `loan_balancing`
### `BatchInputController` — `index`, `validateData`, `store`, `private createAngsuran`, `private generateStaticDatesByDay`
### `EmployeeController` — `index`, `store` (sisanya kosong)
### `MobileAppsMantriController` — 12 method, **semua hanya** `trait → Inertia::render` (tanpa logika)
### `SetBranchController` — `__invoke` (single action)
### `PindahResortController` — `PindahResort`
### `LoanController`, `MantriAppsController`, `TransactionLoanInstalmentController` — kosong / boilerplate belum diisi

---

## 7. Fungsi custom di frontend

| Berkas | Fungsi |
|---|---|
| ~~`Hooks/useFrontEndPermission.js`~~ | **DIHAPUS 2026-08-02** — semua flagnya selalu false. Pengganti: baca `auth.permissions` / `auth.roles` langsung (`03` bagian 6) |
| `Hooks/useOptionGenerator.js` | bangun opsi filter dari `server_filter` (wilayah 0–12, bulan, tanggal, kelompok, hari, employee) |
| `Hooks/useServerFilter.js` | state filter + navigasi `router.get`; konstanta `transaction_day` (senin–sabtu) & kelompok 1–10 |
| `Hooks/useFilterTable.js` | filter/sort sisi klien |
| `Hooks/use-mobile.jsx` | `useIsMobile()` |
| `Hooks/hideOrShow.js` | toggle visibilitas |
| `Components/shadcn/FormatNumbering.jsx` | format rupiah |
| `Components/shadcn/{BadgeStatus,BargeStatus,StatusPinjaman}.jsx` | render badge status pinjaman (`normal/cm/mb/ml`) |
| `Components/NoEditOverlay.jsx` | overlay kunci berdasarkan `closed_transaction` |
| `Components/GlobalBranchFilter.jsx` | combobox cabang → POST `set-branch` |
