# Peta Frontend (React 18 + Inertia v1, JSX)

Root: `resources/js/`. Alias `@/` → `resources/js/`. Alias `@/shadcn/ui/*` → komponen Shadcn porting manual.

## 1. Pola arsitektur yang wajib dipahami

**Halaman yang di-render controller adalah pembungkus tipis.** Logika UI sesungguhnya ada di folder "inti".

```
Controller  →  Pages/WebView/**       (desktop, 13–124 baris — cuma layout + tab)
                    ↓ import
               Pages/BukuTransaksi/   Pages/NewAngsuran/   Pages/NewLoan/   Pages/Kasir/
                    ↑ import                    (INTI: 100–620 baris)
Controller  →  Pages/MobileApps/**    (mantri, layout mobile)
```
Artinya: **mengubah satu komponen inti otomatis mengubah tampilan desktop DAN mobile.** Selalu cek dua-duanya.

## 2. Layout

| File | Dipakai | Isi |
|---|---|---|
| `Layouts/AuthenticatedLayout.jsx` | semua halaman WebView/Admin | `SidebarProvider` → `Components/Sidebar` + `Navbar` + `SweetAlert` + `Loading` + `SidebarInset` |
| `Layouts/GuestLayout.jsx` | halaman Auth | |
| `Layouts/MobileLayout.jsx` | MobileApps | |

## 3. Peta halaman inti

### Buku Transaksi — `Pages/BukuTransaksi/`
| File | Peran |
|---|---|
| `BukuTransaksi.jsx` (226) | tabel utama pengajuan/drop; import `Action`, `FormatNumbering`, `BargeStatus`, `BadgeStatus` |
| `Rencana.jsx` (128) | tab rencana drop → link `pinjaman.index_pinjaman` |
| `Action.jsx` (260) | **dialog aksi per baris**; axios POST `transaction.nasabah_buku_transaksi`; import `RiwayatPengajuan`, `Acc`, `ActionTable`, `StatusPengajuan`, `RemoveLoan`, `ReStatus`, `ChangeDetail`, `NoEditOverlay`; gating pakai `auth.permissions` langsung (`can-edit`) |
| `Components/Acc.jsx` | ACC/Tolak/Success/Gagal → PUT `transaction.action_buku_transaksi`; render `Tundaan.jsx` saat status `acc` |
| `Components/Tundaan.jsx` (BARU 2026-08-03) | tombol + form 1 field (tanggal drop baru) → POST `transaction.tundaan_pengajuan` — lihat CHANGELOG bagian W |
| `Components/ChangeDetail.jsx` | ubah detail → PUT `transaction.updateEverything` |
| `Components/ReStatus.jsx` | ubah status → PUT `transaction.updateEverything` |
| `Components/RemoveLoan.jsx` | hapus → DELETE `pinjaman.destroy_loan` |
| `Components/Approval.jsx` | approve kepala → POST `kasir.rekap.ceklist_kepala` |
| `Components/ActionTable.jsx`, `DetailRiwayat.jsx` | tabel detail dalam dialog |
| `BukuTransaksiKepala.jsx` | **daftar nasabah tampilan kartu** — dipakai bersama oleh `BukuTransaksi/Mobile/TransaksiMantri` (`mobile_apps.transaksi`, menu "Drop") DAN cabang `lg:hidden` di `BukuTransaksi/Web/TransaksiMantri` (`transaction.index_buku_transaksi`, dipakai saat halaman itu dibuka di lebar mobile). Sejak 2026-08-01 berbentuk daftar kartu (bukan `<Table>`) dengan hierarki nama → Pengajuan → ACC → Drop Jadi. **Mengubahnya memengaruhi kedua tempat.** (Route terpisah `mobile_apps.buku_transaksi_kepala` sudah dihapus 2026-08-03 — digantikan sepenuhnya oleh cabang responsif di `Web/TransaksiMantri.jsx`.) |

### Angsuran — `Pages/NewAngsuran/`
| File | Peran |
|---|---|
| `Angsuran.jsx` (105) | dipakai `WebView/Angsuran/Index`; tab desktop/mobile → `AngsuranTable` + `AngsuranTableMobile` + `BukuStorting(Mobile)` |
| `AngsuranByDate.jsx` (95) | dipakai `WebView/Angsuran/SearchByDate`; → `AngsuranByDateTable`, embed `InputMacet` |
| `Components/Action.jsx` | **hub aksi angsuran**; axios GET `pinjaman.get_loan_pinjaman`; `sonner` toast, `useIsMobile`, `NoEditOverlay` |
| `Components/BayarAngsuran.jsx` | POST `pinjaman.bayar_pinjaman` |
| `Components/JenisNasabah.jsx` | POST `pinjaman.bayar_pinjaman` |
| `Components/DeleteAngsuran.jsx` | DELETE `pinjaman.destroy_angsuran` |
| `Components/DeleteLoan.jsx` | DELETE `pinjaman.destroy_loan` |
| `Components/PengajuanLama.jsx` | axios GET `pinjaman.checkpengajuan` → POST `pinjaman.store_pengajuan_lama` |
| `Components/SyncAngsuran.jsx` | POST `pinjaman.get_synch_angsuran` → POST `pinjaman.synch_angsuran` |
| `Components/WhiteOff.jsx` | POST `pinjaman.white_off_loan` |
| `Components/ApprovalAkhir.jsx` | POST `adminpanel.sirkulasiAwal` |
| `Components/{AngsuranTable, AngsuranByDateTable, AngsuranTableMobile, BukuStorting, BukuStortingMobile, ButtonAngsuran, Pengajuan}` | tabel & tombol |
| `Components/AngsuranTableMobilexxx.jsx` | **legacy, tidak diimport** |

`Components/Action22.jsx` **dihapus 2026-08-03** — dulu duplikat `Action.jsx` yang dipakai khusus tab "Buku Storting" (diimport `BukuStorting.jsx`/`BukuStortingMobile.jsx` dengan alias `Action`, sempat salah ditandai legacy di revisi awal dokumen ini karena itu). Sekarang `BukuStorting.jsx`/`BukuStortingMobile.jsx` ikut memakai `Action.jsx` yang sama dengan tab "Buku Angsuran" — lihat `CHANGELOG.md` bagian P.

### Pinjaman Baru — `Pages/NewLoan/`
| File | Peran |
|---|---|
| `NewNasabah.jsx` (569) | form pengajuan; axios POST `transaction.nasabah_buku_transaksi`; dipakai `BukuTransaksi/Web/Create` & `BatchUpload` |
| `BatchUpload.jsx` | input massal; axios → `transaction.store_buku_transaksi_batch` |
| `Components/RiwayatPengajuan*.jsx` (5 varian: `-`, `Lain`, `Macet`, `NonBranch`, `Ori`) | panel riwayat pinjaman nasabah |
| `Components/ModalShowAngsuran.jsx` | modal daftar angsuran |
| `BatchUploadx.jsx` | **legacy** |

### Kasir/Rekap — `Pages/Kasir/`
`Rekap/{RekapContent, Permantri}.jsx` + `Rekap/Components/{Action, TableRekap, TableRekapKasir, TableRekapPerMantri, TunaiMantri}.jsx`; `RencanaDrop/{Content, TableRekap}.jsx`.
Satu-satunya aksi tulis: `Rekap/Components/Action.jsx` → POST `kasir.rekap.rekap_post`.

### Admin Panel — `Pages/AdminPanel/`
`Index.jsx` (225, `useForm` → `adminpanel.role_assign`), `MonitoringStaff.jsx` (110, Accordion), `Components/{Permission, Role, AssignRoles, MaintenerWorker}.jsx`.

### Batch Input — `Pages/Administrasi/BatchInput/`
`Index.jsx` (508) — **satu-satunya halaman dengan parsing CSV** (`papaparse`) dan alur axios dua tahap (`validateData` → `store`). `EditableRow.jsx` untuk edit sel.
⚠️ `branchId` default hardcode `'78'`, `selectedHari` default `'SENIN'`.

### ManPower — `Pages/Administrasi/ManPower/`
`ManPower.jsx` (tabel karyawan, link `administrasi.manpower.index`), `GenerateUser.jsx` (POST `administrasi.manpower.store`).

### MobileApps — `Pages/MobileApps/`
`Index.jsx` = menu utama mantri (link ke semua route `mobile_apps.*` + `home`). `Create/Index.jsx` → POST `transaction.store_buku_transaksi`. Sisanya (`Angsuran/{Index,SearchByDate}`, `RencanaDropKepala`, `Rekap/{RekapSatu,RekapDua,RekapPerMantri}`) hanya menampilkan + filter `router.get` ke route-nya sendiri. (`BukuTransaksiMantri`/`BukuTransaksiKepala` sudah dipindah ke `Pages/BukuTransaksi/{Mobile,Web}` 2026-08-03; `BukuAngsuranMantri` sudah dihapus 2026-08-03 — lihat `01_routing_map.md`.)
`_Index.jsx` = **legacy** (duplikat `Index.jsx`).

## 4. Komponen bersama — `Components/`

| Komponen | Fungsi |
|---|---|
| `GlobalBranchFilter.jsx` | **combobox cabang aktif** → POST `set-branch`. Krusial: menentukan scope semua data |
| `Sidebar.jsx` | menu utama; gating `can-approve`/`view-all-groups`/`view-all-branches` |
| `NoEditOverlay.jsx` | overlay kunci input saat di luar `closed_transaction` |
| `SweetAlert.jsx` | konsumen `flash.message` |
| `Loading.jsx`, `Modal.jsx`, `SelectList.jsx`, `Checkbox.jsx`, `InputLabel.jsx`, `InputError.jsx`, `LinkButton.jsx`, `TextInput.jsx`, `Navbar.jsx`, `Dropdown.jsx`, `NavLink.jsx`, `ResponsiveNavLink.jsx`, `PrimaryButton.jsx`, `SecondaryButton.jsx`, `DangerButton.jsx`, `ButtonMenu.jsx`, `ApplicationLogo.jsx` | UI dasar |

`Components/shadcn/`: `AppSidebar`, `SidebarMobile`, `WebSidebar`, `SearchComponent`, `SelectComponent`, `DatePicker`, `FormatNumbering` (format rupiah), `BadgeStatus`, `BargeStatus` (typo, keduanya dipakai), `StatusPinjaman`, `DropdownProfile`, `DropDownButton`, `MenuButton`.

## 5. Hooks — `Hooks/`

| Hook | Fungsi |
|---|---|
| ~~`useFrontEndPermission.js`~~ | **DIHAPUS 2026-08-02** — semua flagnya selalu `false` (nama permission usang). Jangan dibuat ulang; baca `auth.permissions` / `auth.roles` langsung. Peta penggantinya di `03_auth_roles_scope.md` bagian 6 |
| `useOptionGenerator.js` | opsi filter (wilayah 0–12, bulan, tanggal, kelompok, hari, employee) dari `usePage().props.server_filter` |
| `useServerFilter.js` | state filter + `router.get` ke server; daftar `transaction_day` senin–sabtu, kelompok 1–10 |
| `useFilterTable.js` | filter/sort sisi klien |
| `use-mobile.jsx` | `useIsMobile()` breakpoint |
| `hideOrShow.js` | toggle visibilitas |

## 6. Kontrak props dari server

Hampir semua halaman daftar menerima bentuk yang sama:
```js
{
  datas: [...],                  // baris tabel
  buku_rencana: [...],           // hanya getTransactionLoan(withPlan: true)
  server_filter: {
    month, wilayah, branch, userAuthorized, branch_id, kelompok, hari,
    closed_transaction           // dari AppHelper::get_closed_date — pengunci UI
  }
}
```
Plus props global dari `HandleInertiaRequests`: `auth.user`, `auth.permissions`, `auth.global_filter`, `ziggy`, `flash.message`, `printUrl.url`.

## 7. Dua jalur komunikasi

**Inertia** (`useForm`, `router.post/put/delete`) — semua mutasi. Server balas `redirect()->back()`; error masuk `errors` otomatis.
**axios** — hanya baca on-demand dalam dialog/modal + alur batch. Server balas `response()->json()`. Tidak ada base URL/API client khusus; endpoint = route web + CSRF dari cookie. Daftar lengkap endpoint axios ada di akhir `01_routing_map.md`.

## 8. Build

```bash
docker compose up -d vite     # dev, container unit-vite port 5174, HMR
npm run build                 # WAJIB dari host sebelum selesai / saat vite mati
```
Ada juga SSR bundle di `bootstrap/ssr/` yang ikut ter-commit.
