# Graph Report - unit-apps  (2026-09-09)

## Corpus Check
- 407 files · ~185,653 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1593 nodes · 4480 edges · 137 communities (62 shown, 31 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 173 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c583fc5a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- BukuTransaksi/Action.jsx
- NewAngsuran/Components/Action.jsx
- AuthenticatedLayout.jsx
- TransactionLoan
- WorkDay
- Illuminate\Http\Request
- Illuminate\Http\RedirectResponse
- AppHelper
- TransactionDailyClosing
- Illuminate\Database\Eloquent\Model
- cn
- HitungAgregat
- Employee
- MigrasiController
- TransactionLoanInstalment
- Sidebar.jsx
- Branch
- User
- TransactionMonthlyClosing
- RBAC Multi-Cabang (rancangan)
- BukuTransaksiKepala.jsx
- RegisteredUserController.php
- Illuminate\Database\Eloquent\Factories\Factory
- Auto-pelunasan pinjaman lama saat top-up berhasil drop
- CountingBalance.php
- GlobalBranchFilter.jsx
- Ghost permission (nama permission tak ada di tabel permissions)
- Carbon\Carbon
- app_laravel & unit-apps berbagi database ubmi_db
- LoginRequest
- AgregasiScope
- transaction_daily_closings (agregat harian)
- AppServiceProvider
- button.jsx
- Penyakit dua sumber kebenaran berebut (hook vs controller)
- NewNasabah.jsx
- TransactionDailyRecap
- Inertia\Inertia
- sheet.jsx
- Kunci Reset & Hapus berdasarkan approval rekap (daily_kepala_approval)
- app/Rules/HariKerja.php (satu Rule, tujuh pintu)
- App\Http\Controllers\TransactionDailyRecapController
- Loan
- TransactionManageCustomer
- Permantri.jsx
- Bulanan.jsx
- PenyesuaianSaldo.jsx
- TransactionCustomer
- Illuminate\Database\Migrations\Migration
- Illuminate\Database\Schema\Blueprint
- Illuminate\Support\Facades\Schema
- dropdown-menu.jsx
- App\Models\TransactionLoan
- 8 Permission Inti
- Dropdown.jsx
- SerahTerima saldo awal (periksa / tetapkanZ / sahkan)
- Handler
- graphify — peta hubungan kode
- logging.php
- LoanRequest
- Authenticate
- TrustHosts
- HandleInertiaRequests.php
- AuthServiceProvider
- SerahTerima.jsx
- ExampleTest
- AppBadge + appBadgeVariants
- Kernel
- EncryptCookies
- PreventRequestsDuringMaintenance
- TrimStrings
- EmployeeZone
- ValidateSignature
- VerifyCsrfToken
- console.php
- config/app.php
- sanctum.php
- entrypoint.sh
- entrypoint.dev.sh
- App\Http\Controllers\ProfileController
- BatchInput/Index.jsx
- TransactionSaldoAdjustment
- TargetBayangan.jsx
- RouteServiceProvider
- Controller
- sidebar.jsx
- App\Http\Controllers\LoanController
- Carbon
- Carbon
- TransactionLoanOfficerGrouping
- AdminPanel/Index.jsx
- Illuminate\Support\Collection
- RedirectIfAuthenticated.php

## God Nodes (most connected - your core abstractions)
1. `cn()` - 130 edges
2. `TransactionLoan` - 88 edges
3. `AppHelper` - 74 edges
4. `TransactionLoanOfficerGrouping` - 69 edges
5. `Button` - 68 edges
6. `TransactionDailyClosing` - 47 edges
7. `User` - 46 edges
8. `TransactionLoanInstalment` - 39 edges
9. `Branch` - 38 edges
10. `Table` - 37 edges

## Surprising Connections (you probably didn't know these)
- `AgregasiScope (gerbang pemilih agregasi lama vs baru)` --semantically_similar_to--> `AuthScope::resolve()`  [INFERRED] [semantically similar]
  .agents/CHANGELOG.md → flowproject/flowapps.md
- `transaction_saldo_adjustments (penyesuaian saldo)` --semantically_similar_to--> `Pemutihan Pinjaman Macet (White-Off)`  [INFERRED] [semantically similar]
  .agents/CHANGELOG.md → flowproject/flowapps.md
- `AuthScope::resolve() (dipakai memperbaiki getLoanMacet)` --conceptually_related_to--> `AuthScope::resolve()`  [INFERRED]
  .agents/CHANGELOG.md → flowproject/flowapps.md
- `transaction_daily_closings (agregat harian)` --semantically_similar_to--> `transaction_daily_recaps (rekap harian kasir)`  [INFERRED] [semantically similar]
  .agents/CHANGELOG.md → flowproject/flowapps.md
- `Auto-pelunasan pinjaman lama saat top-up berhasil drop` --shares_data_with--> `Modul B — Angsuran (Storting) & Pelunasan`  [INFERRED]
  .agents/CHANGELOG.md → flowproject/flowapps.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Global Branch Scope: session, permission, dan pivot multi-cabang** — flowproject_flowapps_authscope, flowproject_flowapps_8_permission_inti, flowproject_flowapps_employee_branches, flowproject_flowapps_employee_zones, flowproject_rekonstruksi_role_permission_global_branch_selector, flowproject_synchronization_flow_get_allowed_branch_ids, flowproject_flowapps_set_branch_controller [EXTRACTED 1.00]
- **Kolom penghubung siklus pinjaman (top-up, tundaan, pelunasan otomatis)** — _agents_changelog_previous_loan_id, _agents_changelog_postponed_loan_id, _agents_changelog_settled_by_loan_id, _agents_changelog_auto_pelunasan, _agents_changelog_reverse_auto_settlement, _agents_changelog_tundaan, _agents_changelog_sudah_diajukan_pengganti [EXTRACTED 1.00]
- **Penegakan kalender kerja di seluruh jalur tanggal** — _agents_changelog_work_day, _agents_changelog_hari_kerja_rule, _agents_changelog_use_hari_libur, _agents_changelog_tanggal_turunan, _agents_changelog_tanggal_rekap_bulan, _agents_changelog_get_last_date_for_hari [EXTRACTED 1.00]

## Communities (137 total, 31 thin omitted)

### Community 0 - "BukuTransaksi/Action.jsx"
Cohesion: 0.29
Nodes (6): Action(), StatusPengajuan(), tanggal(), AccordionContent, AccordionItem, AccordionTrigger

### Community 1 - "NewAngsuran/Components/Action.jsx"
Cohesion: 0.19
Nodes (20): BadgeStatus(), variantMap, BargeStatus(), variantMap, FormatNumbering(), StatusPinjaman(), Action(), LoanDetail() (+12 more)

### Community 2 - "AuthenticatedLayout.jsx"
Cohesion: 0.07
Nodes (13): SweetAlert(), Authenticated(), MobileLayout(), RekapContent(), Content(), Kelompok(), rupiah(), STATUS (+5 more)

### Community 3 - "TransactionLoan"
Cohesion: 0.10
Nodes (3): MutasiNasabahController, TransactionLoan, DateTimeInterface

### Community 4 - "WorkDay"
Cohesion: 0.09
Nodes (6): DaftarMigrasi, KalenderKerja, Carbon, KalenderKerjaController, WorkDay, Carbon

### Community 5 - "Illuminate\Http\Request"
Cohesion: 0.07
Nodes (8): AdminController, MobileAppsMantriController, App\Http\Controllers\TransactionLoanController, TransactionLoanController, TrustProxies, HariKerja, Illuminate\Http\Middleware\TrustProxies, Illuminate\Http\Request

### Community 6 - "Illuminate\Http\RedirectResponse"
Cohesion: 0.14
Nodes (10): AuthenticatedSessionController, ConfirmablePasswordController, EmailVerificationPromptController, NewPasswordController, PasswordResetLinkController, Illuminate\Auth\Events\PasswordReset, Illuminate\Http\RedirectResponse, Illuminate\Support\Facades\Password (+2 more)

### Community 7 - "AppHelper"
Cohesion: 0.09
Nodes (3): AppHelper, BatchInputV2Seeder, Int

### Community 8 - "TransactionDailyClosing"
Cohesion: 0.10
Nodes (5): Gembok, ClosingHarianController, Carbon, TransactionDailyClosing, TransactionLockHistory

### Community 9 - "Illuminate\Database\Eloquent\Model"
Cohesion: 0.10
Nodes (15): Customer, DebtRelief, EmployeeBranch, Employment, App\Models\EmploymentPermission, EmploymentPermission, Instalment, App\Models\OnlineBranch (+7 more)

### Community 10 - "cn"
Cohesion: 0.11
Nodes (26): DatePicker(), cn(), buttonVariants, Calendar(), DialogFooter(), DialogOverlay, DrawerContent, DrawerDescription (+18 more)

### Community 11 - "HitungAgregat"
Cohesion: 0.09
Nodes (6): HitungClosing, Carbon, Ember, HitungAgregat, Carbon, TutupBulanan

### Community 12 - "Employee"
Cohesion: 0.13
Nodes (4): EmployeeController, Employee, GenerateEmpUserSeeder, Illuminate\Support\Facades\Hash

### Community 13 - "MigrasiController"
Cohesion: 0.16
Nodes (5): AuthScope, TargetBayangan, MigrasiController, Carbon, TransactionSaldoAdjustment

### Community 14 - "TransactionLoanInstalment"
Cohesion: 0.10
Nodes (6): App\Http\Controllers\PindahResortController, PindahResortController, TransactionLoanInstalmentController, TransactionLoanInstalment, CompareSeeder, GantiMantriSeeder

### Community 15 - "Sidebar.jsx"
Cohesion: 0.17
Nodes (17): data, AppSidebar(), Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader (+9 more)

### Community 16 - "Branch"
Cohesion: 0.19
Nodes (6): GenerateClosingRows, TandaiMigrasi, VerifikasiAgregat, PemeriksaAgregat, Branch, Illuminate\Console\Command

### Community 17 - "User"
Cohesion: 0.05
Nodes (26): User, BelongsToThrough, Illuminate\Auth\Events\Verified, Illuminate\Auth\Notifications\ResetPassword, Illuminate\Contracts\Console\Kernel, Illuminate\Foundation\Auth\User, Illuminate\Foundation\Testing\RefreshDatabase, Illuminate\Foundation\Testing\TestCase (+18 more)

### Community 18 - "TransactionMonthlyClosing"
Cohesion: 0.12
Nodes (5): GembokBulanan, ClosingBulananController, App\Models\TransactionLockHistory, TransactionMonthlyClosing, Controller

### Community 19 - "RBAC Multi-Cabang (rancangan)"
Cohesion: 0.14
Nodes (18): AuthScope::resolve(), employee_branches (pivot delegasi multi-cabang), employee_zones (pivot multi-zona staf kontrol), Global Branch Scope Flow, Modul F — Panel Admin & Multi-Cabang/Multi-Zona RBAC, SetBranchController (POST /set-branch), AuthScope (helper scope terpusat, rancangan), employment_permissions (mekanisme multi-cabang lama, DEPRECATED) (+10 more)

### Community 20 - "BukuTransaksiKepala.jsx"
Cohesion: 0.22
Nodes (9): AppBadge, appBadgeVariants, VARIAN_JENIS, VARIAN_STATUS, varianJenis(), varianStatus(), BukuTransaksiKepala(), ActionTable() (+1 more)

### Community 21 - "RegisteredUserController.php"
Cohesion: 0.17
Nodes (6): RegisteredUserController, EventServiceProvider, Illuminate\Auth\Events\Registered, Illuminate\Auth\Listeners\SendEmailVerificationNotification, Illuminate\Foundation\Support\Providers\EventServiceProvider, Illuminate\Validation\Rules

### Community 22 - "Illuminate\Database\Eloquent\Factories\Factory"
Cohesion: 0.24
Nodes (4): TransactionCustomerFactory, TransactionManageCustomerFactory, UserFactory, Illuminate\Database\Eloquent\Factories\Factory

### Community 23 - "Auto-pelunasan pinjaman lama saat top-up berhasil drop"
Cohesion: 0.16
Nodes (14): Auto-pelunasan pinjaman lama saat top-up berhasil drop, AppHelper::canDeleteLoan(), TransactionLoanController::checkpengajuan(), AppHelper::havePermissionByDate() dan bug E1, NoEditOverlay (pola overlay lama, ditinggalkan), Pola gerbang: kontrol tetap tampil, disabled + keterangan, transaction_loans.postponed_loan_id (Tundaan), transaction_loans.previous_loan_id (top-up / refinance) (+6 more)

### Community 24 - "CountingBalance.php"
Cohesion: 0.14
Nodes (13): CountingDailyBalance, Kernel, CountingBalance, CountingCirculation, VIsBalanceDropWithDailyReport, VIsBalanceLoanWithDailyReport, Illuminate\Bus\Queueable, Illuminate\Console\Scheduling\Schedule (+5 more)

### Community 25 - "GlobalBranchFilter.jsx"
Cohesion: 0.20
Nodes (11): GlobalBranchFilter(), Navbar(), Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList (+3 more)

### Community 26 - "Ghost permission (nama permission tak ada di tabel permissions)"
Cohesion: 0.15
Nodes (13): HandleInertiaRequests::share() prop global auth.roles, AuthScope::resolve() (dipakai memperbaiki getLoanMacet), BatchInputController dibatasi superuser (pastikanSuperuser), PinjamanTrait::getLoanMacet() / getLoanByDate(), Ghost permission (nama permission tak ada di tabel permissions), InputMacet.jsx + store_buku_transaksi_batch (jalur nasabah lama), Kuota ML sebagai PALANG, bukan perbandingan berulang, Alias middleware role: tidak terdaftar di Kernel (+5 more)

### Community 27 - "Carbon\Carbon"
Cohesion: 0.20
Nodes (12): App\Helpers\AgregasiScope, App\Helpers\AuthScope, App\Helpers\Ember, App\Helpers\PemeriksaAgregat, App\Helpers\PenyesuaianSaldo, App\Helpers\SerahTerima, App\Helpers\TutupBulanan, App\Models\TransactionDailyClosing (+4 more)

### Community 28 - "app_laravel & unit-apps berbagi database ubmi_db"
Cohesion: 0.23
Nodes (12): Jangan jalankan php artisan test (phpunit menghantam ubmi_db produksi), Aturan single source of truth: migrasi wajib dari app_laravel, app_laravel_laravel-network (external shared network), unit-app-service (PHP-FPM container), unit-vite (Node 20 dev server, port 5174), unit-web (nginx, port 8080), Urutan Eksekusi 4 Fase yang Backward-Compatible, Asumsi lama: 1 karyawan = 1 cabang (+4 more)

### Community 30 - "AgregasiScope"
Cohesion: 0.16
Nodes (5): AgregasiScope, Carbon, Carbon, SerahTerima, self

### Community 31 - "transaction_daily_closings (agregat harian)"
Cohesion: 0.22
Nodes (11): Ember (6 ember penyimpanan, 4 kategori tampilan), Gembok harian ditegakkan lewat trigger DB, AppHelper::generateStatusAngsuran() (4 nilai, alur lama), Generated column STORED (bukan VIRTUAL) & keluar dari $fillable, HitungAgregat (mesin penghitung agregat harian), Hook rekap otomatis dicabut dari model, transaction_loans.pinjaman adalah generated column (nominal_drop * 1.3), transaction_daily_closings (agregat harian) (+3 more)

### Community 32 - "AppServiceProvider"
Cohesion: 0.24
Nodes (5): AppServiceProvider, BroadcastServiceProvider, Illuminate\Routing\UrlGenerator, Illuminate\Support\Facades\Broadcast, Illuminate\Support\ServiceProvider

### Community 33 - "button.jsx"
Cohesion: 0.13
Nodes (18): NAMA_HARI, MutasiNasabah(), rupiah(), Approval(), Create(), BarisKelompok(), Harian(), rupiah() (+10 more)

### Community 34 - "Penyakit dua sumber kebenaran berebut (hook vs controller)"
Cohesion: 0.27
Nodes (10): Rancangan agregasi rekap v2, AgregasiScope (gerbang pemilih agregasi lama vs baru), TransactionDailyRecapController@ceklist_kepala (penulis rekap tunggal), Penyakit dua sumber kebenaran berebut (hook vs controller), Grain per (grouping, hari), bukan per mantri, WorkDay::tanggalRekapBulan() (hari kerja + tanggal berdata), WorkDay / work_days (kalender kerja nasional), ceklist_kepala (Approval Rekap oleh Pimpinan) (+2 more)

### Community 35 - "NewNasabah.jsx"
Cohesion: 0.20
Nodes (10): LinkButton(), NoEditOverlay(), SelectList(), useOptionGenerator(), FastCreateV2(), InputMacet(), RiwayatPengajuan(), RiwayatPengajuanLain() (+2 more)

### Community 36 - "TransactionDailyRecap"
Cohesion: 0.11
Nodes (7): OnlineBranch, TransactionDailyRecap, TransactionSirculation, PinjamanTrait, RekapTrait, ChangeWrongDateGlobalSeeder, CompareSeeder

### Community 37 - "Inertia\Inertia"
Cohesion: 0.24
Nodes (8): App\Http\Controllers\EmployeeController, App\Http\Controllers\MantriAppsController, MantriAppsController, App\Http\Controllers\MobileAppsMantriController, SetBranchController, Illuminate\Foundation\Application, Illuminate\Support\Facades\Session, Inertia\Inertia

### Community 38 - "sheet.jsx"
Cohesion: 0.31
Nodes (7): SheetContent, SheetDescription, SheetFooter(), SheetHeader(), SheetOverlay, SheetTitle, sheetVariants

### Community 39 - "Kunci Reset & Hapus berdasarkan approval rekap (daily_kepala_approval)"
Cohesion: 0.22
Nodes (9): Aturan wajib pencatatan perubahan (fungsi, route, tabel), FilterBar (chip filter instan + localStorage), PinjamanTrait::getTransactionLoan(), Konsolidasi halaman Buku Transaksi jadi satu halaman responsif, Kunci Reset & Hapus berdasarkan approval rekap (daily_kepala_approval), SearchComponent (dropdown filter lama, remount via key), ERD Relasi Data & Otorisasi Transaksi, Pemutihan Pinjaman Macet (White-Off) (+1 more)

### Community 40 - "app/Rules/HariKerja.php (satu Rule, tujuh pintu)"
Cohesion: 0.25
Nodes (9): getLastDateForHari() (JS, lib/utils.js), AppHelper::getStortingShowDate() / getNumbDays() (PHP), app/Rules/HariKerja.php (satu Rule, tujuh pintu), Pelajaran: setiap tanggal turunan wajib dicari dan diperiksa, Bug TDZ useHariLibur di atas useForm, useHariLibur (mundurKeHariKerja / majuKeHariKerja), action_buku_transaksi (ACC / Drop / Tolak / Batal), generateUnknownNik / callUnknownNik (+1 more)

### Community 41 - "App\Http\Controllers\TransactionDailyRecapController"
Cohesion: 0.19
Nodes (14): App\Helpers\AppHelper, App\Http\Controllers\TransactionDailyRecapController, TransactionDailyRecapController, App\Models\Branch, App\Models\Employee, App\Models\TransactionCustomer, App\Models\TransactionDailyRecap, App\Models\TransactionLoanInstalment (+6 more)

### Community 44 - "Permantri.jsx"
Cohesion: 0.14
Nodes (18): FilterBar(), SearchComponent(), GenerateUser(), ManPower(), BukuTransaksi(), Rencana(), Action(), TableRekap() (+10 more)

### Community 46 - "PenyesuaianSaldo.jsx"
Cohesion: 0.60
Nodes (3): KartuPinjaman(), PenyesuaianSaldo(), rupiah()

### Community 47 - "TransactionCustomer"
Cohesion: 0.16
Nodes (5): App\Http\Controllers\BatchInputController, BatchInputController, TransactionCustomer, ChangeNasabahGroupingSeeder, NasabahGrs3Seeder

### Community 51 - "dropdown-menu.jsx"
Cohesion: 0.23
Nodes (9): DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut(), DropdownMenuSubContent (+1 more)

### Community 52 - "App\Models\TransactionLoan"
Cohesion: 0.17
Nodes (6): Mutasi, App\Models\TransactionLoan, App\Models\TransactionLoanMutation, TransactionLoanMutation, Staudenmeir\EloquentHasManyDeep\HasRelationships, TransactionLoanMutation

### Community 53 - "8 Permission Inti"
Cohesion: 0.33
Nodes (6): 8 Permission Inti, Modul E — Administrasi Karyawan (Manpower), Matriks Otorisasi Berdasarkan Jabatan, Pemetaan 7 Role Baru, Desain permission inti baru (17 → 6/8), Prinsip: jabatan menentukan kemampuan, delegasi cabang menentukan jangkauan

### Community 55 - "SerahTerima saldo awal (periksa / tetapkanZ / sahkan)"
Cohesion: 0.50
Nodes (5): Cutover kantor percontohan Karawang 2, branches.mulai_pendataan_baru (batas migrasi per kantor), SerahTerima saldo awal (periksa / tetapkanZ / sahkan), transaction_monthly_closings (agregat bulanan), TutupBulanan::rakit() / kelengkapan()

### Community 56 - "Handler"
Cohesion: 0.40
Nodes (3): Handler, Illuminate\Foundation\Exceptions\Handler, Throwable

### Community 57 - "graphify — peta hubungan kode"
Cohesion: 0.22
Nodes (8): Aturan yang tidak boleh dilanggar, Graf menunjuk, bukan membuktikan, graphify — peta hubungan kode, Menjaganya tetap segar, Pakai yang sempit, jangan yang luas, unit-apps, Untuk apa dia benar-benar dipakai, Yang belum ada di graf

### Community 58 - "logging.php"
Cohesion: 0.40
Nodes (4): Monolog\Formatter\JsonFormatter, Monolog\Handler\NullHandler, Monolog\Handler\StreamHandler, Monolog\Handler\SyslogUdpHandler

### Community 62 - "HandleInertiaRequests.php"
Cohesion: 0.40
Nodes (3): HandleInertiaRequests, Inertia\Middleware, Tightenco\Ziggy\Ziggy

### Community 64 - "SerahTerima.jsx"
Cohesion: 0.60
Nodes (3): rupiah(), SelZ(), SerahTerima()

### Community 67 - "AppBadge + appBadgeVariants"
Cohesion: 0.67
Nodes (3): AppBadge + appBadgeVariants, AppButton + appButtonVariants, statusVariants.js (VARIAN_STATUS / varianStatus)

### Community 122 - "App\Http\Controllers\ProfileController"
Cohesion: 0.12
Nodes (10): App\Http\Controllers\ProfileController, ProfileController, ProfileUpdateRequest, Illuminate\Auth\Events\Lockout, Illuminate\Contracts\Auth\MustVerifyEmail, Illuminate\Foundation\Http\FormRequest, Illuminate\Support\Facades\Auth, Illuminate\Support\Facades\Redirect (+2 more)

### Community 124 - "TransactionSaldoAdjustment"
Cohesion: 0.13
Nodes (3): PenyesuaianSaldo, TransactionSaldoAdjustment, TransactionLoan

### Community 126 - "RouteServiceProvider"
Cohesion: 0.25
Nodes (5): RouteServiceProvider, Illuminate\Cache\RateLimiting\Limit, Illuminate\Foundation\Support\Providers\RouteServiceProvider, Illuminate\Support\Facades\RateLimiter, Illuminate\Support\Facades\Route

### Community 128 - "Controller"
Cohesion: 0.17
Nodes (10): EmailVerificationNotificationController, PasswordController, VerifyEmailController, Controller, Illuminate\Foundation\Auth\Access\AuthorizesRequests, Illuminate\Foundation\Auth\EmailVerificationRequest, Illuminate\Foundation\Bus\DispatchesJobs, Illuminate\Foundation\Validation\ValidatesRequests (+2 more)

### Community 129 - "sidebar.jsx"
Cohesion: 0.13
Nodes (14): useIsMobile(), Separator, SidebarContext, SidebarGroupAction, SidebarGroupContent, SidebarInput, SidebarInset, SidebarMenuAction (+6 more)

### Community 133 - "TransactionLoanOfficerGrouping"
Cohesion: 0.07
Nodes (27): App\Http\Controllers\AdminController, TransactionLoanOfficerGrouping, BalancingDailyReport, BalancingTargetSeeder, BatchInputAngsuranSeeder, BatchInputSeeder, DailySeeder, DeleteAngsuranSeeder (+19 more)

### Community 134 - "AdminPanel/Index.jsx"
Cohesion: 0.06
Nodes (52): ApplicationLogo(), Checkbox(), DangerButton(), HARI_OPTIONS, KELOMPOK_OPTIONS, InputError(), InputLabel(), Loading() (+44 more)

### Community 136 - "RedirectIfAuthenticated.php"
Cohesion: 0.40
Nodes (3): RedirectIfAuthenticated, Closure, Illuminate\Contracts\Validation\ValidationRule

## Knowledge Gaps
- **46 isolated node(s):** `HARI_OPTIONS`, `KELOMPOK_OPTIONS`, `HARI_TO_DOW`, `variantMap`, `variantMap` (+41 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 444 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **31 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `TransactionLoan` connect `TransactionLoan` to `TransactionDailyRecap`, `Illuminate\Http\Request`, `TransactionLoanOfficerGrouping`, `AppHelper`, `App\Http\Controllers\TransactionDailyRecapController`, `Illuminate\Database\Eloquent\Model`, `TransactionManageCustomer`, `MigrasiController`, `TransactionLoanInstalment`, `TransactionCustomer`, `App\Models\TransactionLoan`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Why does `User` connect `User` to `Illuminate\Http\Request`, `TransactionLoanOfficerGrouping`, `Illuminate\Database\Eloquent\Model`, `TransactionManageCustomer`, `Employee`, `Branch`, `RegisteredUserController.php`, `App\Http\Controllers\ProfileController`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Why does `AppHelper` connect `AppHelper` to `TransactionLoan`, `TransactionDailyRecap`, `TransactionLoanOfficerGrouping`, `Illuminate\Http\Request`, `Inertia\Inertia`, `App\Http\Controllers\TransactionDailyRecapController`, `Employee`, `TransactionLoanInstalment`, `TransactionCustomer`, `App\Models\TransactionLoan`, `TransactionSaldoAdjustment`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Are the 14 inferred relationships involving `TransactionLoan` (e.g. with `.simpanPenyesuaian()` and `.cari()`) actually correct?**
  _`TransactionLoan` has 14 INFERRED edges - model-reasoned connections that need verification._
- **Are the 9 inferred relationships involving `AppHelper` (e.g. with `.getLoan()` and `.getLoanByDate()`) actually correct?**
  _`AppHelper` has 9 INFERRED edges - model-reasoned connections that need verification._
- **Are the 15 inferred relationships involving `TransactionLoanOfficerGrouping` (e.g. with `.bawaKolomManual()` and `.siapkanBaris()`) actually correct?**
  _`TransactionLoanOfficerGrouping` has 15 INFERRED edges - model-reasoned connections that need verification._
- **What connects `HARI_OPTIONS`, `KELOMPOK_OPTIONS`, `HARI_TO_DOW` to the rest of the system?**
  _46 weakly-connected nodes found - possible documentation gaps or missing edges._