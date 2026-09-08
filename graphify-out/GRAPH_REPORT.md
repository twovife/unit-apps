# Graph Report - unit-apps  (2026-09-08)

## Corpus Check
- 402 files · ~178,985 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1559 nodes · 4415 edges · 133 communities (53 shown, 37 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 131 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d0683e4b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- button.jsx
- table.jsx
- AuthenticatedLayout.jsx
- Controller
- TransactionLoan
- Illuminate\Http\Request
- Illuminate\Database\Seeder
- AppHelper
- TransactionDailyClosing
- Illuminate\Database\Eloquent\Model
- cn
- TransactionSaldoAdjustment
- Employee
- TransactionMonthlyClosing
- WorkDay
- Sidebar.jsx
- Branch
- User & Cakupan Cabang
- sidebar.jsx
- RBAC Multi-Cabang (rancangan)
- BukuTransaksiKepala.jsx
- EventServiceProvider.php
- Illuminate\Database\Eloquent\Factories\Factory
- Auto-pelunasan pinjaman lama saat top-up berhasil drop
- CountingBalance.php
- GlobalBranchFilter.jsx
- Ghost permission (nama permission tak ada di tabel permissions)
- TransactionManageCustomer
- app_laravel & unit-apps berbagi database ubmi_db
- MigrasiController
- dropdown-menu.jsx
- transaction_daily_closings (agregat harian)
- AppServiceProvider
- AuthenticationTest
- Penyakit dua sumber kebenaran berebut (hook vs controller)
- Permantri.jsx
- LoginRequest
- Carbon\Carbon
- sheet.jsx
- Kunci Reset & Hapus berdasarkan approval rekap (daily_kepala_approval)
- app/Rules/HariKerja.php (satu Rule, tujuh pintu)
- VIsBalanceLoanWithDailyReport
- Loan
- TestCase
- EmailVerificationTest.php
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
- Inertia\Inertia
- Authenticate
- TrustHosts
- MobileApps/Rekap/RekapPerMantri.jsx
- AuthServiceProvider
- CreatesApplication
- ExampleTest
- AppBadge + appBadgeVariants
- Kernel
- EncryptCookies
- PreventRequestsDuringMaintenance
- TrimStrings
- KesiapanClosing.jsx
- ValidateSignature
- VerifyCsrfToken
- console.php
- config/app.php
- sanctum.php
- entrypoint.sh
- entrypoint.dev.sh
- Instalment
- .handle
- TransactionLoanOfficerGrouping
- EmployeeBranch
- BatchInput/Index.jsx
- EmployeeZone
- TransactionWhiteOff
- ManPower/Index.jsx
- WebView/RencanaDropKepala/Index.jsx
- WebView/Angsuran/Index.jsx
- Carbon

## God Nodes (most connected - your core abstractions)
1. `cn()` - 130 edges
2. `TransactionLoan` - 89 edges
3. `AppHelper` - 77 edges
4. `TransactionLoanOfficerGrouping` - 67 edges
5. `Button` - 66 edges
6. `TransactionDailyClosing` - 47 edges
7. `User` - 46 edges
8. `TransactionLoanInstalment` - 41 edges
9. `Branch` - 40 edges
10. `Controller` - 37 edges

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

## Communities (133 total, 37 thin omitted)

### Community 0 - "button.jsx"
Cohesion: 0.05
Nodes (73): ApplicationLogo(), Checkbox(), DangerButton(), HARI_OPTIONS, KELOMPOK_OPTIONS, InputError(), InputLabel(), LinkButton() (+65 more)

### Community 1 - "table.jsx"
Cohesion: 0.08
Nodes (45): BadgeStatus(), variantMap, BargeStatus(), variantMap, FormatNumbering(), StatusPinjaman(), GenerateUser(), Approval() (+37 more)

### Community 2 - "AuthenticatedLayout.jsx"
Cohesion: 0.11
Nodes (8): SweetAlert(), Authenticated(), MobileLayout(), RekapContent(), AngsuranByDate(), DeleteUserForm(), UpdatePasswordForm(), UpdateProfileInformation()

### Community 3 - "Controller"
Cohesion: 0.06
Nodes (31): AuthenticatedSessionController, ConfirmablePasswordController, EmailVerificationNotificationController, EmailVerificationPromptController, NewPasswordController, PasswordController, PasswordResetLinkController, RegisteredUserController (+23 more)

### Community 4 - "TransactionLoan"
Cohesion: 0.04
Nodes (11): App\Http\Controllers\PindahResortController, PindahResortController, TransactionLoanInstalmentController, OnlineBranch, TransactionDailyRecap, TransactionLoan, TransactionLoanInstalment, TransactionSirculation (+3 more)

### Community 5 - "Illuminate\Http\Request"
Cohesion: 0.06
Nodes (12): AdminController, MobileAppsMantriController, TransactionDailyRecapController, TransactionLoanController, HandleInertiaRequests, RedirectIfAuthenticated, TrustProxies, Closure (+4 more)

### Community 6 - "Illuminate\Database\Seeder"
Cohesion: 0.09
Nodes (31): BalancingDailyReport, BalancingTargetSeeder, BatchInputAngsuranSeeder, BatchInputSeeder, ChangeNasabahGroupingSeeder, ChangeWrongDateGlobalSeeder, CompareSeeder, DailySeeder (+23 more)

### Community 8 - "TransactionDailyClosing"
Cohesion: 0.10
Nodes (5): Gembok, ClosingHarianController, Carbon, TransactionDailyClosing, TransactionLockHistory

### Community 9 - "Illuminate\Database\Eloquent\Model"
Cohesion: 0.16
Nodes (17): App\Models\Branch, DebtRelief, Employment, EmploymentPermission, App\Models\OnlineBranch, TransactionBranchDailyRecap, App\Models\TransactionDailyRecap, App\Models\TransactionLoan (+9 more)

### Community 10 - "cn"
Cohesion: 0.11
Nodes (26): DatePicker(), cn(), buttonVariants, Calendar(), DialogFooter(), DialogOverlay, DrawerContent, DrawerDescription (+18 more)

### Community 11 - "TransactionSaldoAdjustment"
Cohesion: 0.08
Nodes (7): Ember, HitungAgregat, PenyesuaianSaldo, Carbon, TransactionSaldoAdjustment, Carbon, TransactionLoan

### Community 12 - "Employee"
Cohesion: 0.12
Nodes (6): App\Helpers\AppHelper, EmployeeController, Employee, GenerateEmpUserSeeder, Faker\Core\Number, Illuminate\Bus\Batch

### Community 13 - "TransactionMonthlyClosing"
Cohesion: 0.11
Nodes (4): GembokBulanan, SerahTerima, ClosingBulananController, TransactionMonthlyClosing

### Community 14 - "WorkDay"
Cohesion: 0.11
Nodes (5): KalenderKerja, Carbon, KalenderKerjaController, WorkDay, Carbon

### Community 15 - "Sidebar.jsx"
Cohesion: 0.17
Nodes (17): data, AppSidebar(), Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader (+9 more)

### Community 16 - "Branch"
Cohesion: 0.19
Nodes (6): GenerateClosingRows, TandaiMigrasi, VerifikasiAgregat, PemeriksaAgregat, Branch, Illuminate\Console\Command

### Community 17 - "User & Cakupan Cabang"
Cohesion: 0.16
Nodes (8): User, BelongsToThrough, Illuminate\Foundation\Auth\User, Illuminate\Notifications\Notifiable, Laravel\Sanctum\HasApiTokens, Spatie\Permission\Traits\HasPermissions, Spatie\Permission\Traits\HasRoles, ProfileTest

### Community 18 - "sidebar.jsx"
Cohesion: 0.15
Nodes (13): useIsMobile(), SidebarContext, SidebarGroupAction, SidebarGroupContent, SidebarInput, SidebarInset, SidebarMenuAction, SidebarMenuBadge (+5 more)

### Community 19 - "RBAC Multi-Cabang (rancangan)"
Cohesion: 0.14
Nodes (18): AuthScope::resolve(), employee_branches (pivot delegasi multi-cabang), employee_zones (pivot multi-zona staf kontrol), Global Branch Scope Flow, Modul F — Panel Admin & Multi-Cabang/Multi-Zona RBAC, SetBranchController (POST /set-branch), AuthScope (helper scope terpusat, rancangan), employment_permissions (mekanisme multi-cabang lama, DEPRECATED) (+10 more)

### Community 20 - "BukuTransaksiKepala.jsx"
Cohesion: 0.19
Nodes (11): FilterBar(), AppBadge, appBadgeVariants, VARIAN_JENIS, VARIAN_STATUS, varianJenis(), varianStatus(), Action() (+3 more)

### Community 21 - "EventServiceProvider.php"
Cohesion: 0.25
Nodes (5): EventServiceProvider, Illuminate\Auth\Events\Registered, Illuminate\Auth\Listeners\SendEmailVerificationNotification, Illuminate\Foundation\Support\Providers\EventServiceProvider, Illuminate\Support\Facades\Event

### Community 22 - "Illuminate\Database\Eloquent\Factories\Factory"
Cohesion: 0.16
Nodes (5): TransactionCustomerFactory, TransactionManageCustomerFactory, UserFactory, Illuminate\Database\Eloquent\Factories\Factory, Illuminate\Support\Str

### Community 23 - "Auto-pelunasan pinjaman lama saat top-up berhasil drop"
Cohesion: 0.16
Nodes (14): Auto-pelunasan pinjaman lama saat top-up berhasil drop, AppHelper::canDeleteLoan(), TransactionLoanController::checkpengajuan(), AppHelper::havePermissionByDate() dan bug E1, NoEditOverlay (pola overlay lama, ditinggalkan), Pola gerbang: kontrol tetap tampil, disabled + keterangan, transaction_loans.postponed_loan_id (Tundaan), transaction_loans.previous_loan_id (top-up / refinance) (+6 more)

### Community 24 - "CountingBalance.php"
Cohesion: 0.30
Nodes (7): CountingBalance, CountingCirculation, Illuminate\Bus\Queueable, Illuminate\Contracts\Queue\ShouldQueue, Illuminate\Foundation\Bus\Dispatchable, Illuminate\Queue\InteractsWithQueue, Illuminate\Queue\SerializesModels

### Community 25 - "GlobalBranchFilter.jsx"
Cohesion: 0.20
Nodes (11): GlobalBranchFilter(), Navbar(), Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList (+3 more)

### Community 26 - "Ghost permission (nama permission tak ada di tabel permissions)"
Cohesion: 0.15
Nodes (13): HandleInertiaRequests::share() prop global auth.roles, AuthScope::resolve() (dipakai memperbaiki getLoanMacet), BatchInputController dibatasi superuser (pastikanSuperuser), PinjamanTrait::getLoanMacet() / getLoanByDate(), Ghost permission (nama permission tak ada di tabel permissions), InputMacet.jsx + store_buku_transaksi_batch (jalur nasabah lama), Kuota ML sebagai PALANG, bukan perbandingan berulang, Alias middleware role: tidak terdaftar di Kernel (+5 more)

### Community 27 - "TransactionManageCustomer"
Cohesion: 0.22
Nodes (3): TransactionManageCustomer, App\Models\TransactionMonthlyClosing, Znck\Eloquent\Traits\BelongsToThrough

### Community 28 - "app_laravel & unit-apps berbagi database ubmi_db"
Cohesion: 0.23
Nodes (12): Jangan jalankan php artisan test (phpunit menghantam ubmi_db produksi), Aturan single source of truth: migrasi wajib dari app_laravel, app_laravel_laravel-network (external shared network), unit-app-service (PHP-FPM container), unit-vite (Node 20 dev server, port 5174), unit-web (nginx, port 8080), Urutan Eksekusi 4 Fase yang Backward-Compatible, Asumsi lama: 1 karyawan = 1 cabang (+4 more)

### Community 29 - "MigrasiController"
Cohesion: 0.17
Nodes (3): AuthScope, MigrasiController, Controller

### Community 30 - "dropdown-menu.jsx"
Cohesion: 0.23
Nodes (9): DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut(), DropdownMenuSubContent (+1 more)

### Community 31 - "transaction_daily_closings (agregat harian)"
Cohesion: 0.22
Nodes (11): Ember (6 ember penyimpanan, 4 kategori tampilan), Gembok harian ditegakkan lewat trigger DB, AppHelper::generateStatusAngsuran() (4 nilai, alur lama), Generated column STORED (bukan VIRTUAL) & keluar dari $fillable, HitungAgregat (mesin penghitung agregat harian), Hook rekap otomatis dicabut dari model, transaction_loans.pinjaman adalah generated column (nominal_drop * 1.3), transaction_daily_closings (agregat harian) (+3 more)

### Community 32 - "AppServiceProvider"
Cohesion: 0.24
Nodes (5): AppServiceProvider, BroadcastServiceProvider, Illuminate\Routing\UrlGenerator, Illuminate\Support\Facades\Broadcast, Illuminate\Support\ServiceProvider

### Community 34 - "Penyakit dua sumber kebenaran berebut (hook vs controller)"
Cohesion: 0.27
Nodes (10): Rancangan agregasi rekap v2, AgregasiScope (gerbang pemilih agregasi lama vs baru), TransactionDailyRecapController@ceklist_kepala (penulis rekap tunggal), Penyakit dua sumber kebenaran berebut (hook vs controller), Grain per (grouping, hari), bukan per mantri, WorkDay::tanggalRekapBulan() (hari kerja + tanggal berdata), WorkDay / work_days (kalender kerja nasional), ceklist_kepala (Approval Rekap oleh Pimpinan) (+2 more)

### Community 35 - "Permantri.jsx"
Cohesion: 0.23
Nodes (14): SearchComponent(), BukuTransaksi(), Rencana(), Create(), Action(), TableRekap(), TableRekapKasir(), TableRekapPerMantri() (+6 more)

### Community 36 - "LoginRequest"
Cohesion: 0.29
Nodes (3): LoginRequest, ProfileUpdateRequest, Illuminate\Foundation\Http\FormRequest

### Community 37 - "Carbon\Carbon"
Cohesion: 0.16
Nodes (10): App\Helpers\AgregasiScope, App\Helpers\AuthScope, App\Helpers\DaftarMigrasi, DaftarMigrasi, Carbon, App\Helpers\PemeriksaAgregat, App\Helpers\SerahTerima, App\Helpers\TutupBulanan (+2 more)

### Community 38 - "sheet.jsx"
Cohesion: 0.31
Nodes (7): SheetContent, SheetDescription, SheetFooter(), SheetHeader(), SheetOverlay, SheetTitle, sheetVariants

### Community 39 - "Kunci Reset & Hapus berdasarkan approval rekap (daily_kepala_approval)"
Cohesion: 0.22
Nodes (9): Aturan wajib pencatatan perubahan (fungsi, route, tabel), FilterBar (chip filter instan + localStorage), PinjamanTrait::getTransactionLoan(), Konsolidasi halaman Buku Transaksi jadi satu halaman responsif, Kunci Reset & Hapus berdasarkan approval rekap (daily_kepala_approval), SearchComponent (dropdown filter lama, remount via key), ERD Relasi Data & Otorisasi Transaksi, Pemutihan Pinjaman Macet (White-Off) (+1 more)

### Community 40 - "app/Rules/HariKerja.php (satu Rule, tujuh pintu)"
Cohesion: 0.25
Nodes (9): getLastDateForHari() (JS, lib/utils.js), AppHelper::getStortingShowDate() / getNumbDays() (PHP), app/Rules/HariKerja.php (satu Rule, tujuh pintu), Pelajaran: setiap tanggal turunan wajib dicari dan diperiksa, Bug TDZ useHariLibur di atas useForm, useHariLibur (mundurKeHariKerja / majuKeHariKerja), action_buku_transaksi (ACC / Drop / Tolak / Batal), generateUnknownNik / callUnknownNik (+1 more)

### Community 41 - "VIsBalanceLoanWithDailyReport"
Cohesion: 0.36
Nodes (4): CountingDailyBalance, VIsBalanceDropWithDailyReport, App\Models\VIsBalanceLoanWithDailyreport, VIsBalanceLoanWithDailyReport

### Community 43 - "TestCase"
Cohesion: 0.15
Nodes (7): Illuminate\Foundation\Testing\RefreshDatabase, Illuminate\Foundation\Testing\TestCase, PasswordConfirmationTest, PasswordUpdateTest, RegistrationTest, ExampleTest, TestCase

### Community 44 - "EmailVerificationTest.php"
Cohesion: 0.29
Nodes (3): Illuminate\Auth\Events\Verified, Illuminate\Support\Facades\URL, EmailVerificationTest

### Community 45 - "PasswordResetTest"
Cohesion: 0.25
Nodes (3): Illuminate\Auth\Notifications\ResetPassword, Illuminate\Support\Facades\Notification, PasswordResetTest

### Community 46 - "self"
Cohesion: 0.18
Nodes (4): AgregasiScope, Carbon, Carbon, self

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

### Community 59 - "Inertia\Inertia"
Cohesion: 0.13
Nodes (20): App\Http\Controllers\AdminController, App\Http\Controllers\BatchInputController, App\Http\Controllers\EmployeeController, App\Http\Controllers\LoanController, LoanController, App\Http\Controllers\MantriAppsController, MantriAppsController, App\Http\Controllers\MobileAppsMantriController (+12 more)

### Community 67 - "AppBadge + appBadgeVariants"
Cohesion: 0.67
Nodes (3): AppBadge + appBadgeVariants, AppButton + appButtonVariants, statusVariants.js (VARIAN_STATUS / varianStatus)

### Community 124 - "TransactionLoanOfficerGrouping"
Cohesion: 0.11
Nodes (7): BatchInputController, App\Http\Controllers\TransactionLoanController, TransactionCustomer, TransactionLoanOfficerGrouping, HariKerja, BatchInputV2Seeder, Illuminate\Contracts\Validation\ValidationRule

## Knowledge Gaps
- **46 isolated node(s):** `HARI_OPTIONS`, `KELOMPOK_OPTIONS`, `HARI_KE_ANGKA`, `NAMA_BULAN`, `NAMA_HARI` (+41 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 426 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **37 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `TransactionLoan` connect `TransactionLoan` to `Illuminate\Http\Request`, `Illuminate\Database\Seeder`, `AppHelper`, `TransactionManageCustomer`, `Illuminate\Database\Eloquent\Model`, `Inertia\Inertia`, `TransactionLoanOfficerGrouping`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Why does `User` connect `User & Cakupan Cabang` to `AuthenticationTest`, `Controller`, `LoginRequest`, `Illuminate\Http\Request`, `TransactionManageCustomer`, `Illuminate\Database\Eloquent\Model`, `TestCase`, `Employee`, `EmailVerificationTest.php`, `self`, `PasswordResetTest`, `Inertia\Inertia`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Why does `AppHelper` connect `AppHelper` to `TransactionLoan`, `Illuminate\Http\Request`, `Illuminate\Database\Seeder`, `Illuminate\Database\Eloquent\Model`, `Employee`, `self`, `Inertia\Inertia`, `TransactionLoanOfficerGrouping`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `TransactionLoan` (e.g. with `.boot()` and `.getLoan()`) actually correct?**
  _`TransactionLoan` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Are the 5 inferred relationships involving `AppHelper` (e.g. with `.getLoan()` and `.getLoanByDate()`) actually correct?**
  _`AppHelper` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Are the 5 inferred relationships involving `TransactionLoanOfficerGrouping` (e.g. with `.index()` and `.getLoan()`) actually correct?**
  _`TransactionLoanOfficerGrouping` has 5 INFERRED edges - model-reasoned connections that need verification._
- **What connects `HARI_OPTIONS`, `KELOMPOK_OPTIONS`, `HARI_KE_ANGKA` to the rest of the system?**
  _46 weakly-connected nodes found - possible documentation gaps or missing edges._