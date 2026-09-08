# Graph Report - unit-apps  (2026-09-08)

## Corpus Check
- 408 files · ~183,654 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1591 nodes · 4510 edges · 134 communities (60 shown, 31 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 142 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a9ba620d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- utils.js
- button.jsx
- AuthenticatedLayout.jsx
- TransactionLoan
- Illuminate\Database\Seeder
- Illuminate\Http\Request
- Illuminate\Http\RedirectResponse
- AppHelper
- TransactionDailyClosing
- Illuminate\Database\Eloquent\Model
- cn
- HitungAgregat
- Employee
- MigrasiController
- WorkDay
- sidebar.jsx
- Illuminate\Console\Command
- User & Cakupan Cabang
- TransactionMonthlyClosing
- RBAC Multi-Cabang (rancangan)
- BukuTransaksi/Action.jsx
- EmailVerificationTest.php
- Illuminate\Database\Eloquent\Factories\Factory
- Auto-pelunasan pinjaman lama saat top-up berhasil drop
- CountingBalance.php
- GlobalBranchFilter.jsx
- Ghost permission (nama permission tak ada di tabel permissions)
- TransactionManageCustomer
- app_laravel & unit-apps berbagi database ubmi_db
- LoginRequest
- dropdown-menu.jsx
- transaction_daily_closings (agregat harian)
- AppServiceProvider
- TestCase
- Penyakit dua sumber kebenaran berebut (hook vs controller)
- routes/auth.php
- AgregasiScope
- Controller
- sheet.jsx
- Kunci Reset & Hapus berdasarkan approval rekap (daily_kepala_approval)
- app/Rules/HariKerja.php (satu Rule, tujuh pintu)
- VIsBalanceLoanWithDailyReport
- Loan
- Illuminate\Foundation\Testing\RefreshDatabase
- Permantri.jsx
- PasswordResetTest
- AdminPanel/Index.jsx
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
- TransactionLoanOfficerGrouping
- Authenticate
- TrustHosts
- NewPasswordController.php
- AuthServiceProvider
- CreatesApplication
- ExampleTest
- AppBadge + appBadgeVariants
- Kernel
- EncryptCookies
- PreventRequestsDuringMaintenance
- TrimStrings
- PasswordConfirmationTest
- ValidateSignature
- VerifyCsrfToken
- console.php
- config/app.php
- sanctum.php
- entrypoint.sh
- entrypoint.dev.sh
- App\Http\Controllers\ProfileController
- NewNasabah.jsx
- TransactionSaldoAdjustment
- DatePicker.jsx
- RouteServiceProvider
- EmployeeZone
- EmployeeBranch
- KesiapanClosing.jsx
- Carbon
- Carbon\Carbon
- InputError.jsx
- TrustProxies.php

## God Nodes (most connected - your core abstractions)
1. `cn()` - 130 edges
2. `TransactionLoan` - 90 edges
3. `AppHelper` - 77 edges
4. `TransactionLoanOfficerGrouping` - 70 edges
5. `Button` - 68 edges
6. `TransactionDailyClosing` - 47 edges
7. `User` - 46 edges
8. `Branch` - 41 edges
9. `TransactionLoanInstalment` - 41 edges
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

## Communities (134 total, 31 thin omitted)

### Community 0 - "utils.js"
Cohesion: 0.12
Nodes (26): Loading(), AppButton, appButtonVariants, HARI_KE_ANGKA, NAMA_BULAN, NAMA_HARI, TanggalKerja(), simpanan (+18 more)

### Community 1 - "button.jsx"
Cohesion: 0.07
Nodes (53): BadgeStatus(), variantMap, BargeStatus(), variantMap, FormatNumbering(), StatusPinjaman(), NAMA_HARI, MutasiNasabah() (+45 more)

### Community 2 - "AuthenticatedLayout.jsx"
Cohesion: 0.08
Nodes (12): Navbar(), AppSidebar(), SweetAlert(), Authenticated(), MobileLayout(), EditableRow(), ManPower(), Permantri() (+4 more)

### Community 3 - "TransactionLoan"
Cohesion: 0.06
Nodes (12): App\Http\Controllers\TransactionDailyRecapController, TransactionDailyRecapController, OnlineBranch, App\Models\TransactionDailyRecap, TransactionDailyRecap, TransactionLoan, TransactionSirculation, PinjamanTrait (+4 more)

### Community 4 - "Illuminate\Database\Seeder"
Cohesion: 0.05
Nodes (25): App\Http\Controllers\PindahResortController, PindahResortController, TransactionLoanInstalmentController, TransactionLoanInstalment, BalancingDailyReport, BalancingTargetSeeder, ChangeWrongDateGlobalSeeder, CompareSeeder (+17 more)

### Community 5 - "Illuminate\Http\Request"
Cohesion: 0.06
Nodes (11): AdminController, MobileAppsMantriController, SetBranchController, App\Http\Controllers\TransactionLoanController, TransactionLoanController, HandleInertiaRequests, HariKerja, Illuminate\Contracts\Validation\ValidationRule (+3 more)

### Community 6 - "Illuminate\Http\RedirectResponse"
Cohesion: 0.18
Nodes (8): AuthenticatedSessionController, ConfirmablePasswordController, EmailVerificationPromptController, PasswordResetLinkController, Illuminate\Http\RedirectResponse, Illuminate\Support\Facades\Auth, Illuminate\Validation\ValidationException, Inertia\Response

### Community 7 - "AppHelper"
Cohesion: 0.06
Nodes (8): AppHelper, TransactionCustomer, BatchInputSeeder, BatchInputV2Seeder, ChangeNasabahGroupingSeeder, NasabahGrs3Seeder, UpdateSeeder, Int

### Community 8 - "TransactionDailyClosing"
Cohesion: 0.16
Nodes (3): ClosingHarianController, Carbon, TransactionDailyClosing

### Community 9 - "Illuminate\Database\Eloquent\Model"
Cohesion: 0.13
Nodes (17): DebtRelief, App\Models\Employee, Employment, App\Models\EmploymentPermission, EmploymentPermission, Instalment, TransactionBranchDailyRecap, App\Models\TransactionCustomer (+9 more)

### Community 10 - "cn"
Cohesion: 0.13
Nodes (18): cn(), DialogFooter(), DialogOverlay, DrawerContent, DrawerDescription, DrawerFooter(), DrawerHeader(), DrawerOverlay (+10 more)

### Community 11 - "HitungAgregat"
Cohesion: 0.12
Nodes (4): HitungClosing, Carbon, Ember, HitungAgregat

### Community 12 - "Employee"
Cohesion: 0.09
Nodes (17): App\Http\Controllers\AdminController, App\Http\Controllers\BatchInputController, App\Http\Controllers\EmployeeController, EmployeeController, App\Http\Controllers\LoanController, App\Http\Controllers\MantriAppsController, App\Http\Controllers\MobileAppsMantriController, Employee (+9 more)

### Community 13 - "MigrasiController"
Cohesion: 0.12
Nodes (7): AuthScope, SerahTerima, TargetBayangan, MigrasiController, App\Models\TransactionMonthlyClosing, Carbon, TransactionSaldoAdjustment

### Community 14 - "WorkDay"
Cohesion: 0.09
Nodes (6): GenerateClosingRows, KalenderKerja, Carbon, KalenderKerjaController, WorkDay, Carbon

### Community 15 - "sidebar.jsx"
Cohesion: 0.12
Nodes (28): data, useIsMobile(), Separator, Sidebar, SidebarContent, SidebarContext, SidebarFooter, SidebarGroup (+20 more)

### Community 16 - "Illuminate\Console\Command"
Cohesion: 0.21
Nodes (5): TandaiMigrasi, VerifikasiAgregat, PemeriksaAgregat, Carbon, Illuminate\Console\Command

### Community 17 - "User & Cakupan Cabang"
Cohesion: 0.16
Nodes (8): User, BelongsToThrough, Illuminate\Foundation\Auth\User, Illuminate\Notifications\Notifiable, Laravel\Sanctum\HasApiTokens, Spatie\Permission\Traits\HasPermissions, Spatie\Permission\Traits\HasRoles, ProfileTest

### Community 18 - "TransactionMonthlyClosing"
Cohesion: 0.09
Nodes (6): GembokBulanan, Carbon, TutupBulanan, ClosingBulananController, TransactionMonthlyClosing, Controller

### Community 19 - "RBAC Multi-Cabang (rancangan)"
Cohesion: 0.14
Nodes (18): AuthScope::resolve(), employee_branches (pivot delegasi multi-cabang), employee_zones (pivot multi-zona staf kontrol), Global Branch Scope Flow, Modul F — Panel Admin & Multi-Cabang/Multi-Zona RBAC, SetBranchController (POST /set-branch), AuthScope (helper scope terpusat, rancangan), employment_permissions (mekanisme multi-cabang lama, DEPRECATED) (+10 more)

### Community 20 - "BukuTransaksi/Action.jsx"
Cohesion: 0.16
Nodes (12): AppBadge, appBadgeVariants, VARIAN_JENIS, VARIAN_STATUS, varianJenis(), varianStatus(), Action(), BukuTransaksiKepala() (+4 more)

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
Cohesion: 0.30
Nodes (7): CountingBalance, CountingCirculation, Illuminate\Bus\Queueable, Illuminate\Contracts\Queue\ShouldQueue, Illuminate\Foundation\Bus\Dispatchable, Illuminate\Queue\InteractsWithQueue, Illuminate\Queue\SerializesModels

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

### Community 35 - "routes/auth.php"
Cohesion: 0.22
Nodes (4): RegisteredUserController, Illuminate\Cache\RateLimiting\Limit, Illuminate\Support\Facades\RateLimiter, Illuminate\Support\Facades\Route

### Community 36 - "AgregasiScope"
Cohesion: 0.10
Nodes (7): AgregasiScope, Carbon, DaftarMigrasi, Carbon, Gembok, TransactionLockHistory, self

### Community 37 - "Controller"
Cohesion: 0.18
Nodes (10): EmailVerificationNotificationController, PasswordController, Controller, LoanController, MantriAppsController, Illuminate\Foundation\Auth\Access\AuthorizesRequests, Illuminate\Foundation\Bus\DispatchesJobs, Illuminate\Foundation\Validation\ValidatesRequests (+2 more)

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

### Community 43 - "Illuminate\Foundation\Testing\RefreshDatabase"
Cohesion: 0.28
Nodes (3): Illuminate\Foundation\Testing\RefreshDatabase, PasswordUpdateTest, RegistrationTest

### Community 44 - "Permantri.jsx"
Cohesion: 0.17
Nodes (18): FilterBar(), HARI_OPTIONS, KELOMPOK_OPTIONS, SearchComponent(), BukuTransaksi(), Rencana(), Create(), Action() (+10 more)

### Community 45 - "PasswordResetTest"
Cohesion: 0.25
Nodes (3): Illuminate\Auth\Notifications\ResetPassword, Illuminate\Support\Facades\Notification, PasswordResetTest

### Community 46 - "AdminPanel/Index.jsx"
Cohesion: 0.29
Nodes (11): AssignRoles(), MaintenerWorker(), Permission(), Role(), Card, CardContent, CardDescription, CardFooter (+3 more)

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

### Community 59 - "TransactionLoanOfficerGrouping"
Cohesion: 0.15
Nodes (5): BatchInputController, TransactionLoanOfficerGrouping, BatchInputAngsuranSeeder, LunasinMLGantung, SalahPemutihan

### Community 62 - "NewPasswordController.php"
Cohesion: 0.18
Nodes (5): NewPasswordController, Illuminate\Auth\Events\PasswordReset, Illuminate\Support\Facades\Password, Illuminate\Support\Str, Illuminate\Validation\Rules

### Community 67 - "AppBadge + appBadgeVariants"
Cohesion: 0.67
Nodes (3): AppBadge + appBadgeVariants, AppButton + appButtonVariants, statusVariants.js (VARIAN_STATUS / varianStatus)

### Community 122 - "App\Http\Controllers\ProfileController"
Cohesion: 0.22
Nodes (6): App\Http\Controllers\ProfileController, ProfileController, ProfileUpdateRequest, Illuminate\Contracts\Auth\MustVerifyEmail, Illuminate\Foundation\Http\FormRequest, Illuminate\Support\Facades\Redirect

### Community 123 - "NewNasabah.jsx"
Cohesion: 0.19
Nodes (10): LinkButton(), NoEditOverlay(), SelectList(), useOptionGenerator(), FastCreateV2(), InputMacet(), RiwayatPengajuan(), RiwayatPengajuanLain() (+2 more)

### Community 124 - "TransactionSaldoAdjustment"
Cohesion: 0.11
Nodes (3): PenyesuaianSaldo, TransactionSaldoAdjustment, TransactionLoan

### Community 125 - "DatePicker.jsx"
Cohesion: 0.22
Nodes (10): DatePicker(), buttonVariants, Calendar(), SelectContent, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton (+2 more)

### Community 126 - "RouteServiceProvider"
Cohesion: 0.21
Nodes (6): VerifyEmailController, RedirectIfAuthenticated, RouteServiceProvider, Closure, Illuminate\Foundation\Auth\EmailVerificationRequest, Illuminate\Foundation\Support\Providers\RouteServiceProvider

### Community 133 - "Carbon\Carbon"
Cohesion: 0.09
Nodes (22): App\Helpers\AgregasiScope, App\Helpers\AuthScope, App\Helpers\DaftarMigrasi, App\Helpers\Ember, Mutasi, App\Helpers\PemeriksaAgregat, App\Helpers\PenyesuaianSaldo, App\Helpers\SerahTerima (+14 more)

### Community 134 - "InputError.jsx"
Cohesion: 0.12
Nodes (19): ApplicationLogo(), Checkbox(), DangerButton(), InputError(), InputLabel(), Modal(), PrimaryButton(), SecondaryButton() (+11 more)

## Knowledge Gaps
- **46 isolated node(s):** `HARI_OPTIONS`, `KELOMPOK_OPTIONS`, `HARI_KE_ANGKA`, `NAMA_BULAN`, `NAMA_HARI` (+41 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 437 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **31 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `User` connect `User & Cakupan Cabang` to `TestCase`, `routes/auth.php`, `AgregasiScope`, `Illuminate\Http\Request`, `TransactionLoan`, `PasswordConfirmationTest`, `Illuminate\Database\Eloquent\Model`, `Illuminate\Foundation\Testing\RefreshDatabase`, `Employee`, `PasswordResetTest`, `EmailVerificationTest.php`, `App\Http\Controllers\ProfileController`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Why does `WorkDay` connect `WorkDay` to `AgregasiScope`, `Illuminate\Http\Request`, `Carbon\Carbon`, `TransactionDailyClosing`, `Illuminate\Database\Eloquent\Model`, `Employee`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Why does `TransactionLoan` connect `TransactionLoan` to `Illuminate\Database\Seeder`, `Illuminate\Http\Request`, `Carbon\Carbon`, `AppHelper`, `Illuminate\Database\Eloquent\Model`, `Employee`, `TransactionLoanOfficerGrouping`, `TransactionSaldoAdjustment`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Are the 9 inferred relationships involving `TransactionLoan` (e.g. with `.simpanPenyesuaian()` and `.cari()`) actually correct?**
  _`TransactionLoan` has 9 INFERRED edges - model-reasoned connections that need verification._
- **Are the 5 inferred relationships involving `AppHelper` (e.g. with `.getLoan()` and `.getLoanByDate()`) actually correct?**
  _`AppHelper` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Are the 8 inferred relationships involving `TransactionLoanOfficerGrouping` (e.g. with `.catat()` and `.index()`) actually correct?**
  _`TransactionLoanOfficerGrouping` has 8 INFERRED edges - model-reasoned connections that need verification._
- **What connects `HARI_OPTIONS`, `KELOMPOK_OPTIONS`, `HARI_KE_ANGKA` to the rest of the system?**
  _46 weakly-connected nodes found - possible documentation gaps or missing edges._