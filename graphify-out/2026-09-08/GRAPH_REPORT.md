# Graph Report - unit-apps  (2026-09-07)

## Corpus Check
- 400 files · ~176,241 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1541 nodes · 4345 edges · 129 communities (51 shown, 35 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 100 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6c904f16`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- button.jsx
- NewAngsuran/Components/Action.jsx
- AuthenticatedLayout.jsx
- Controller
- TransactionLoanInstalment
- Illuminate\Http\Request
- TransactionLoan
- AppHelper
- TransactionDailyClosing
- Illuminate\Database\Eloquent\Model
- cn
- Ember
- Employee
- TransactionMonthlyClosing
- WorkDay
- Sidebar.jsx
- Carbon\Carbon
- User & Cakupan Cabang
- sidebar.jsx
- RBAC Multi-Cabang (rancangan)
- BukuTransaksiKepala.jsx
- EmailVerificationTest.php
- Illuminate\Database\Eloquent\Factories\Factory
- Auto-pelunasan pinjaman lama saat top-up berhasil drop
- CountingBalance.php
- GlobalBranchFilter.jsx
- Ghost permission (nama permission tak ada di tabel permissions)
- TransactionManageCustomer
- app_laravel & unit-apps berbagi database ubmi_db
- Gembok
- dropdown-menu.jsx
- transaction_daily_closings (agregat harian)
- AppServiceProvider
- TestCase
- Penyakit dua sumber kebenaran berebut (hook vs controller)
- HitungAgregat
- LoginRequest
- TransactionSaldoAdjustment
- sheet.jsx
- Kunci Reset & Hapus berdasarkan approval rekap (daily_kepala_approval)
- app/Rules/HariKerja.php (satu Rule, tujuh pintu)
- RouteServiceProvider
- Loan
- Illuminate\Foundation\Testing\RefreshDatabase
- TransactionLoanInstalmentController
- PasswordResetTest
- self
- LoanRequest
- Illuminate\Database\Migrations\Migration
- Illuminate\Database\Schema\Blueprint
- Illuminate\Support\Facades\Schema
- Kernel
- Customer
- 8 Permission Inti
- Dropdown.jsx
- SerahTerima saldo awal (periksa / tetapkanZ / sahkan)
- Handler
- graphify — peta hubungan kode
- logging.php
- VerifyEmailController.php
- Authenticate
- TrustHosts
- HandleInertiaRequests.php
- AuthServiceProvider
- CreatesApplication
- ExampleTest
- AppBadge + appBadgeVariants
- Kernel
- EncryptCookies
- PreventRequestsDuringMaintenance
- TrimStrings
- TrustProxies.php
- ValidateSignature
- VerifyCsrfToken
- console.php
- config/app.php
- sanctum.php
- entrypoint.sh
- entrypoint.dev.sh
- RedirectIfAuthenticated.php
- .handle
- TransactionLoanOfficerGrouping
- EmployeeBranch
- PasswordConfirmationTest
- EmployeeZone
- TransactionWhiteOff

## God Nodes (most connected - your core abstractions)
1. `cn()` - 130 edges
2. `TransactionLoan` - 89 edges
3. `AppHelper` - 77 edges
4. `TransactionLoanOfficerGrouping` - 67 edges
5. `Button` - 65 edges
6. `TransactionDailyClosing` - 47 edges
7. `User` - 46 edges
8. `TransactionLoanInstalment` - 41 edges
9. `Branch` - 40 edges
10. `TransactionMonthlyClosing` - 39 edges

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

## Communities (129 total, 35 thin omitted)

### Community 0 - "button.jsx"
Cohesion: 0.05
Nodes (71): ApplicationLogo(), Checkbox(), DangerButton(), FilterBar(), HARI_OPTIONS, KELOMPOK_OPTIONS, InputError(), InputLabel() (+63 more)

### Community 1 - "NewAngsuran/Components/Action.jsx"
Cohesion: 0.06
Nodes (62): BadgeStatus(), variantMap, BargeStatus(), variantMap, FormatNumbering(), StatusPinjaman(), NAMA_HARI, GenerateUser() (+54 more)

### Community 2 - "AuthenticatedLayout.jsx"
Cohesion: 0.06
Nodes (17): Navbar(), AppSidebar(), SweetAlert(), Authenticated(), MobileLayout(), EditableRow(), ManPower(), Permantri() (+9 more)

### Community 3 - "Controller"
Cohesion: 0.09
Nodes (22): AuthenticatedSessionController, ConfirmablePasswordController, EmailVerificationNotificationController, EmailVerificationPromptController, NewPasswordController, PasswordController, PasswordResetLinkController, RegisteredUserController (+14 more)

### Community 4 - "TransactionLoanInstalment"
Cohesion: 0.09
Nodes (9): App\Http\Controllers\TransactionDailyRecapController, TransactionDailyRecap, TransactionLoanInstalment, TransactionSirculation, PinjamanTrait, RekapTrait, CompareSeeder, CompareSeeder (+1 more)

### Community 5 - "Illuminate\Http\Request"
Cohesion: 0.07
Nodes (6): AdminController, MobileAppsMantriController, TransactionDailyRecapController, TransactionLoanController, HariKerja, Illuminate\Http\Request

### Community 6 - "TransactionLoan"
Cohesion: 0.06
Nodes (20): TransactionLoan, BalancingDailyReport, BalancingTargetSeeder, BatchInputAngsuranSeeder, DailySeeder, GantiMantriSeeder, GenerateTotalSeeder, KeubahSeeder (+12 more)

### Community 7 - "AppHelper"
Cohesion: 0.06
Nodes (11): App\Helpers\AppHelper, AppHelper, TransactionCustomer, BatchInputSeeder, BatchInputV2Seeder, ChangeNasabahGroupingSeeder, NasabahGrs3Seeder, UpdateSeeder (+3 more)

### Community 8 - "TransactionDailyClosing"
Cohesion: 0.16
Nodes (3): ClosingHarianController, Carbon, TransactionDailyClosing

### Community 9 - "Illuminate\Database\Eloquent\Model"
Cohesion: 0.14
Nodes (18): App\Models\Branch, DebtRelief, Employment, EmploymentPermission, Instalment, App\Models\OnlineBranch, TransactionBranchDailyRecap, App\Models\TransactionDailyRecap (+10 more)

### Community 10 - "cn"
Cohesion: 0.12
Nodes (23): cn(), DialogFooter(), DialogOverlay, DrawerContent, DrawerDescription, DrawerFooter(), DrawerHeader(), DrawerOverlay (+15 more)

### Community 12 - "Employee"
Cohesion: 0.08
Nodes (25): CountingDailyBalance, App\Http\Controllers\AdminController, App\Http\Controllers\BatchInputController, App\Http\Controllers\EmployeeController, EmployeeController, App\Http\Controllers\LoanController, App\Http\Controllers\MantriAppsController, App\Http\Controllers\MobileAppsMantriController (+17 more)

### Community 13 - "TransactionMonthlyClosing"
Cohesion: 0.07
Nodes (8): AuthScope, GembokBulanan, SerahTerima, ClosingBulananController, MigrasiController, Carbon, TransactionMonthlyClosing, Controller

### Community 14 - "WorkDay"
Cohesion: 0.11
Nodes (5): KalenderKerja, Carbon, KalenderKerjaController, WorkDay, Carbon

### Community 15 - "Sidebar.jsx"
Cohesion: 0.19
Nodes (16): data, Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu (+8 more)

### Community 16 - "Carbon\Carbon"
Cohesion: 0.11
Nodes (14): GenerateClosingRows, TandaiMigrasi, VerifikasiAgregat, App\Helpers\AgregasiScope, AgregasiScope, App\Helpers\AuthScope, DaftarMigrasi, Carbon (+6 more)

### Community 17 - "User & Cakupan Cabang"
Cohesion: 0.16
Nodes (8): User, BelongsToThrough, Illuminate\Foundation\Auth\User, Illuminate\Notifications\Notifiable, Laravel\Sanctum\HasApiTokens, Spatie\Permission\Traits\HasPermissions, Spatie\Permission\Traits\HasRoles, ProfileTest

### Community 18 - "sidebar.jsx"
Cohesion: 0.13
Nodes (14): useIsMobile(), Separator, SidebarContext, SidebarGroupAction, SidebarGroupContent, SidebarInput, SidebarInset, SidebarMenuAction (+6 more)

### Community 19 - "RBAC Multi-Cabang (rancangan)"
Cohesion: 0.14
Nodes (18): AuthScope::resolve(), employee_branches (pivot delegasi multi-cabang), employee_zones (pivot multi-zona staf kontrol), Global Branch Scope Flow, Modul F — Panel Admin & Multi-Cabang/Multi-Zona RBAC, SetBranchController (POST /set-branch), AuthScope (helper scope terpusat, rancangan), employment_permissions (mekanisme multi-cabang lama, DEPRECATED) (+10 more)

### Community 20 - "BukuTransaksiKepala.jsx"
Cohesion: 0.22
Nodes (9): AppBadge, appBadgeVariants, VARIAN_JENIS, VARIAN_STATUS, varianJenis(), varianStatus(), BukuTransaksiKepala(), ActionTable() (+1 more)

### Community 21 - "EmailVerificationTest.php"
Cohesion: 0.13
Nodes (8): EventServiceProvider, Illuminate\Auth\Events\Registered, Illuminate\Auth\Events\Verified, Illuminate\Auth\Listeners\SendEmailVerificationNotification, Illuminate\Foundation\Support\Providers\EventServiceProvider, Illuminate\Support\Facades\Event, Illuminate\Support\Facades\URL, EmailVerificationTest

### Community 22 - "Illuminate\Database\Eloquent\Factories\Factory"
Cohesion: 0.24
Nodes (4): TransactionCustomerFactory, TransactionManageCustomerFactory, UserFactory, Illuminate\Database\Eloquent\Factories\Factory

### Community 23 - "Auto-pelunasan pinjaman lama saat top-up berhasil drop"
Cohesion: 0.16
Nodes (14): Auto-pelunasan pinjaman lama saat top-up berhasil drop, AppHelper::canDeleteLoan(), TransactionLoanController::checkpengajuan(), AppHelper::havePermissionByDate() dan bug E1, NoEditOverlay (pola overlay lama, ditinggalkan), Pola gerbang: kontrol tetap tampil, disabled + keterangan, transaction_loans.postponed_loan_id (Tundaan), transaction_loans.previous_loan_id (top-up / refinance) (+6 more)

### Community 24 - "CountingBalance.php"
Cohesion: 0.19
Nodes (10): CountingBalance, CountingCirculation, VIsBalanceDropWithDailyReport, App\Models\VIsBalanceLoanWithDailyreport, VIsBalanceLoanWithDailyReport, Illuminate\Bus\Queueable, Illuminate\Contracts\Queue\ShouldQueue, Illuminate\Foundation\Bus\Dispatchable (+2 more)

### Community 25 - "GlobalBranchFilter.jsx"
Cohesion: 0.22
Nodes (10): GlobalBranchFilter(), Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator (+2 more)

### Community 26 - "Ghost permission (nama permission tak ada di tabel permissions)"
Cohesion: 0.15
Nodes (13): HandleInertiaRequests::share() prop global auth.roles, AuthScope::resolve() (dipakai memperbaiki getLoanMacet), BatchInputController dibatasi superuser (pastikanSuperuser), PinjamanTrait::getLoanMacet() / getLoanByDate(), Ghost permission (nama permission tak ada di tabel permissions), InputMacet.jsx + store_buku_transaksi_batch (jalur nasabah lama), Kuota ML sebagai PALANG, bukan perbandingan berulang, Alias middleware role: tidak terdaftar di Kernel (+5 more)

### Community 28 - "app_laravel & unit-apps berbagi database ubmi_db"
Cohesion: 0.23
Nodes (12): Jangan jalankan php artisan test (phpunit menghantam ubmi_db produksi), Aturan single source of truth: migrasi wajib dari app_laravel, app_laravel_laravel-network (external shared network), unit-app-service (PHP-FPM container), unit-vite (Node 20 dev server, port 5174), unit-web (nginx, port 8080), Urutan Eksekusi 4 Fase yang Backward-Compatible, Asumsi lama: 1 karyawan = 1 cabang (+4 more)

### Community 30 - "dropdown-menu.jsx"
Cohesion: 0.23
Nodes (9): DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut(), DropdownMenuSubContent (+1 more)

### Community 31 - "transaction_daily_closings (agregat harian)"
Cohesion: 0.22
Nodes (11): Ember (6 ember penyimpanan, 4 kategori tampilan), Gembok harian ditegakkan lewat trigger DB, AppHelper::generateStatusAngsuran() (4 nilai, alur lama), Generated column STORED (bukan VIRTUAL) & keluar dari $fillable, HitungAgregat (mesin penghitung agregat harian), Hook rekap otomatis dicabut dari model, transaction_loans.pinjaman adalah generated column (nominal_drop * 1.3), transaction_daily_closings (agregat harian) (+3 more)

### Community 32 - "AppServiceProvider"
Cohesion: 0.24
Nodes (5): AppServiceProvider, BroadcastServiceProvider, Illuminate\Routing\UrlGenerator, Illuminate\Support\Facades\Broadcast, Illuminate\Support\ServiceProvider

### Community 33 - "TestCase"
Cohesion: 0.22
Nodes (4): Illuminate\Foundation\Testing\TestCase, AuthenticationTest, ExampleTest, TestCase

### Community 34 - "Penyakit dua sumber kebenaran berebut (hook vs controller)"
Cohesion: 0.27
Nodes (10): Rancangan agregasi rekap v2, AgregasiScope (gerbang pemilih agregasi lama vs baru), TransactionDailyRecapController@ceklist_kepala (penulis rekap tunggal), Penyakit dua sumber kebenaran berebut (hook vs controller), Grain per (grouping, hari), bukan per mantri, WorkDay::tanggalRekapBulan() (hari kerja + tanggal berdata), WorkDay / work_days (kalender kerja nasional), ceklist_kepala (Approval Rekap oleh Pimpinan) (+2 more)

### Community 36 - "LoginRequest"
Cohesion: 0.13
Nodes (6): ProfileController, LoginRequest, ProfileUpdateRequest, Illuminate\Auth\Events\Lockout, Illuminate\Foundation\Http\FormRequest, Illuminate\Support\Str

### Community 38 - "sheet.jsx"
Cohesion: 0.31
Nodes (7): SheetContent, SheetDescription, SheetFooter(), SheetHeader(), SheetOverlay, SheetTitle, sheetVariants

### Community 39 - "Kunci Reset & Hapus berdasarkan approval rekap (daily_kepala_approval)"
Cohesion: 0.22
Nodes (9): Aturan wajib pencatatan perubahan (fungsi, route, tabel), FilterBar (chip filter instan + localStorage), PinjamanTrait::getTransactionLoan(), Konsolidasi halaman Buku Transaksi jadi satu halaman responsif, Kunci Reset & Hapus berdasarkan approval rekap (daily_kepala_approval), SearchComponent (dropdown filter lama, remount via key), ERD Relasi Data & Otorisasi Transaksi, Pemutihan Pinjaman Macet (White-Off) (+1 more)

### Community 40 - "app/Rules/HariKerja.php (satu Rule, tujuh pintu)"
Cohesion: 0.25
Nodes (9): getLastDateForHari() (JS, lib/utils.js), AppHelper::getStortingShowDate() / getNumbDays() (PHP), app/Rules/HariKerja.php (satu Rule, tujuh pintu), Pelajaran: setiap tanggal turunan wajib dicari dan diperiksa, Bug TDZ useHariLibur di atas useForm, useHariLibur (mundurKeHariKerja / majuKeHariKerja), action_buku_transaksi (ACC / Drop / Tolak / Batal), generateUnknownNik / callUnknownNik (+1 more)

### Community 41 - "RouteServiceProvider"
Cohesion: 0.24
Nodes (5): RouteServiceProvider, Illuminate\Cache\RateLimiting\Limit, Illuminate\Foundation\Support\Providers\RouteServiceProvider, Illuminate\Support\Facades\RateLimiter, Illuminate\Support\Facades\Route

### Community 43 - "Illuminate\Foundation\Testing\RefreshDatabase"
Cohesion: 0.28
Nodes (3): Illuminate\Foundation\Testing\RefreshDatabase, PasswordUpdateTest, RegistrationTest

### Community 45 - "PasswordResetTest"
Cohesion: 0.25
Nodes (3): Illuminate\Auth\Notifications\ResetPassword, Illuminate\Support\Facades\Notification, PasswordResetTest

### Community 46 - "self"
Cohesion: 0.13
Nodes (4): Carbon, Carbon, TutupBulanan, self

### Community 51 - "Kernel"
Cohesion: 0.40
Nodes (3): Kernel, Illuminate\Console\Scheduling\Schedule, Illuminate\Foundation\Console\Kernel

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

### Community 59 - "VerifyEmailController.php"
Cohesion: 0.29
Nodes (3): VerifyEmailController, SetBranchController, Illuminate\Foundation\Auth\EmailVerificationRequest

### Community 62 - "HandleInertiaRequests.php"
Cohesion: 0.40
Nodes (3): HandleInertiaRequests, Inertia\Middleware, Tightenco\Ziggy\Ziggy

### Community 67 - "AppBadge + appBadgeVariants"
Cohesion: 0.67
Nodes (3): AppBadge + appBadgeVariants, AppButton + appButtonVariants, statusVariants.js (VARIAN_STATUS / varianStatus)

### Community 122 - "RedirectIfAuthenticated.php"
Cohesion: 0.40
Nodes (3): RedirectIfAuthenticated, Closure, Illuminate\Contracts\Validation\ValidationRule

### Community 124 - "TransactionLoanOfficerGrouping"
Cohesion: 0.11
Nodes (8): BatchInputController, App\Http\Controllers\PindahResortController, PindahResortController, OnlineBranch, TransactionLoanOfficerGrouping, ChangeWrongDateGlobalSeeder, DeleteAngsuranSeeder, LunasinMLGantung

## Knowledge Gaps
- **46 isolated node(s):** `HARI_OPTIONS`, `KELOMPOK_OPTIONS`, `HARI_KE_ANGKA`, `NAMA_BULAN`, `NAMA_HARI` (+41 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 425 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **35 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `User` connect `User & Cakupan Cabang` to `TestCase`, `Controller`, `LoginRequest`, `Illuminate\Http\Request`, `Illuminate\Database\Eloquent\Model`, `Illuminate\Foundation\Testing\RefreshDatabase`, `Employee`, `PasswordResetTest`, `self`, `EmailVerificationTest.php`, `TransactionManageCustomer`, `PasswordConfirmationTest`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Why does `TransactionLoanOfficerGrouping` connect `TransactionLoanOfficerGrouping` to `HitungAgregat`, `TransactionLoanInstalment`, `Illuminate\Http\Request`, `TransactionLoan`, `AppHelper`, `TransactionDailyClosing`, `Illuminate\Database\Eloquent\Model`, `Employee`, `TransactionMonthlyClosing`, `Carbon\Carbon`, `.handle`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Why does `TransactionLoan` connect `TransactionLoan` to `TransactionLoanInstalment`, `Illuminate\Http\Request`, `AppHelper`, `Illuminate\Database\Eloquent\Model`, `Employee`, `Carbon\Carbon`, `TransactionManageCustomer`, `TransactionLoanOfficerGrouping`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `TransactionLoan` (e.g. with `.boot()` and `.getLoan()`) actually correct?**
  _`TransactionLoan` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Are the 5 inferred relationships involving `AppHelper` (e.g. with `.getLoan()` and `.getLoanByDate()`) actually correct?**
  _`AppHelper` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Are the 5 inferred relationships involving `TransactionLoanOfficerGrouping` (e.g. with `.index()` and `.getLoan()`) actually correct?**
  _`TransactionLoanOfficerGrouping` has 5 INFERRED edges - model-reasoned connections that need verification._
- **What connects `HARI_OPTIONS`, `KELOMPOK_OPTIONS`, `HARI_KE_ANGKA` to the rest of the system?**
  _46 weakly-connected nodes found - possible documentation gaps or missing edges._