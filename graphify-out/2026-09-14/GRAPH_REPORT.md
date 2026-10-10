# Graph Report - unit-apps  (2026-09-14)

## Corpus Check
- 411 files · ~187,485 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1611 nodes · 4478 edges · 142 communities (58 shown, 40 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 208 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6433c57f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- RouteServiceProvider
- button.jsx
- TransactionLoanOfficerGrouping
- TransactionManageCustomer
- KalenderKerja
- Illuminate\Http\Request
- Illuminate\Http\RedirectResponse
- AppHelper
- TransactionDailyClosing
- Illuminate\Database\Eloquent\Model
- cn
- HitungAgregat
- Employee
- MigrasiController
- Carbon\Carbon
- Sidebar.jsx
- Gembok
- User
- TransactionMonthlyClosing
- RBAC Multi-Cabang (rancangan)
- BukuTransaksiKepala.jsx
- EmailVerificationTest.php
- Illuminate\Database\Eloquent\Factories\Factory
- Auto-pelunasan pinjaman lama saat top-up berhasil drop
- CountingBalance.php
- AuthenticatedLayout.jsx
- Ghost permission (nama permission tak ada di tabel permissions)
- NewPasswordController.php
- app_laravel & unit-apps berbagi database ubmi_db
- AuthenticatedSessionController.php
- utils.js
- transaction_daily_closings (agregat harian)
- AppServiceProvider
- TransactionLoan
- Penyakit dua sumber kebenaran berebut (hook vs controller)
- GlobalBranchFilter.jsx
- Customer
- self
- App\Http\Controllers\ProfileController
- Kunci Reset & Hapus berdasarkan approval rekap (daily_kepala_approval)
- app/Rules/HariKerja.php (satu Rule, tujuh pintu)
- Controller
- Illuminate\Foundation\Testing\RefreshDatabase
- TestCase
- WorkDay
- PasswordResetTest
- sheet.jsx
- Carbon
- Illuminate\Database\Migrations\Migration
- Illuminate\Database\Schema\Blueprint
- Illuminate\Support\Facades\Schema
- PasswordConfirmationTest
- Mutasi
- 8 Permission Inti
- Dropdown.jsx
- SerahTerima saldo awal (periksa / tetapkanZ / sahkan)
- Handler
- graphify — peta hubungan kode
- logging.php
- routes/auth.php
- Authenticate
- TrustHosts
- Loan
- AuthServiceProvider
- VIsBalanceLoanWithDailyReport
- ExampleTest
- AppBadge + appBadgeVariants
- Kernel
- EncryptCookies
- PreventRequestsDuringMaintenance
- TrimStrings
- CreatesApplication
- ValidateSignature
- VerifyCsrfToken
- console.php
- config/app.php
- sanctum.php
- entrypoint.sh
- entrypoint.dev.sh
- .handle
- AgregasiScope
- TransactionSaldoAdjustment
- .store
- Kernel
- LoanRequest
- EmployeeZone
- App\Http\Controllers\LoanController
- Carbon
- Carbon
- TransactionLoan
- AdminPanel/Index.jsx
- Illuminate\Support\Collection
- TrustProxies.php
- AppButton.jsx
- Inertia\Response
- GenerateClosingRows
- HandleInertiaRequests.php
- sidebar.jsx

## God Nodes (most connected - your core abstractions)
1. `cn()` - 130 edges
2. `TransactionLoan` - 74 edges
3. `AppHelper` - 73 edges
4. `TransactionLoanOfficerGrouping` - 68 edges
5. `Button` - 68 edges
6. `TransactionDailyClosing` - 47 edges
7. `User` - 46 edges
8. `Branch` - 38 edges
9. `TransactionLoanInstalment` - 37 edges
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

## Communities (142 total, 40 thin omitted)

### Community 0 - "RouteServiceProvider"
Cohesion: 0.21
Nodes (6): VerifyEmailController, RedirectIfAuthenticated, RouteServiceProvider, Closure, Illuminate\Foundation\Auth\EmailVerificationRequest, Illuminate\Foundation\Support\Providers\RouteServiceProvider

### Community 1 - "button.jsx"
Cohesion: 0.06
Nodes (55): Checkbox(), BadgeStatus(), variantMap, BargeStatus(), variantMap, FormatNumbering(), StatusPinjaman(), NAMA_HARI (+47 more)

### Community 2 - "TransactionLoanOfficerGrouping"
Cohesion: 0.15
Nodes (5): TandaiMigrasi, TransactionLoanOfficerGrouping, TransactionSirculation, RekapTrait, SalahPemutihan

### Community 3 - "TransactionManageCustomer"
Cohesion: 0.15
Nodes (5): SiklusRekening, App\Models\TransactionManageCustomer, TransactionManageCustomer, App\Models\TransactionSiklus, TransactionSiklus

### Community 4 - "KalenderKerja"
Cohesion: 0.20
Nodes (3): KalenderKerja, Carbon, KalenderKerjaController

### Community 5 - "Illuminate\Http\Request"
Cohesion: 0.07
Nodes (12): AdminController, MobileAppsMantriController, TransactionDailyRecapController, TransactionLoanController, App\Models\TransactionLoan, App\Rules\HariKerja, HariKerja, Controller (+4 more)

### Community 6 - "Illuminate\Http\RedirectResponse"
Cohesion: 0.21
Nodes (5): AuthenticatedSessionController, EmailVerificationNotificationController, PasswordController, Illuminate\Http\RedirectResponse, Illuminate\Validation\Rules\Password

### Community 7 - "AppHelper"
Cohesion: 0.06
Nodes (10): AppHelper, TransactionLoan, TransactionCustomer, BatchInputSeeder, BatchInputV2Seeder, ChangeNasabahGroupingSeeder, NasabahGrs3Seeder, UpdateSeeder (+2 more)

### Community 8 - "TransactionDailyClosing"
Cohesion: 0.16
Nodes (3): ClosingHarianController, Carbon, TransactionDailyClosing

### Community 9 - "Illuminate\Database\Eloquent\Model"
Cohesion: 0.12
Nodes (18): DebtRelief, App\Models\Employee, EmployeeBranch, Employment, App\Models\EmploymentPermission, EmploymentPermission, Instalment, App\Models\OnlineBranch (+10 more)

### Community 10 - "cn"
Cohesion: 0.11
Nodes (25): cn(), DialogFooter(), DialogOverlay, DrawerContent, DrawerDescription, DrawerFooter(), DrawerHeader(), DrawerOverlay (+17 more)

### Community 12 - "Employee"
Cohesion: 0.13
Nodes (4): EmployeeController, Employee, EmploymentSeeder, GenerateEmpUserSeeder

### Community 13 - "MigrasiController"
Cohesion: 0.17
Nodes (4): AuthScope, MigrasiController, App\Models\TransactionMonthlyClosing, TransactionSaldoAdjustment

### Community 14 - "Carbon\Carbon"
Cohesion: 0.10
Nodes (37): VerifikasiAgregat, App\Helpers\AgregasiScope, App\Helpers\AppHelper, App\Helpers\AuthScope, App\Helpers\Ember, App\Helpers\PemeriksaAgregat, PemeriksaAgregat, App\Helpers\PenyesuaianSaldo (+29 more)

### Community 15 - "Sidebar.jsx"
Cohesion: 0.17
Nodes (17): data, AppSidebar(), Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader (+9 more)

### Community 17 - "User"
Cohesion: 0.16
Nodes (9): User, BelongsToThrough, Illuminate\Foundation\Auth\User, Illuminate\Notifications\Notifiable, Laravel\Sanctum\HasApiTokens, Spatie\Permission\Traits\HasPermissions, Spatie\Permission\Traits\HasRoles, ProfileTest (+1 more)

### Community 18 - "TransactionMonthlyClosing"
Cohesion: 0.13
Nodes (3): GembokBulanan, ClosingBulananController, TransactionMonthlyClosing

### Community 19 - "RBAC Multi-Cabang (rancangan)"
Cohesion: 0.14
Nodes (18): AuthScope::resolve(), employee_branches (pivot delegasi multi-cabang), employee_zones (pivot multi-zona staf kontrol), Global Branch Scope Flow, Modul F — Panel Admin & Multi-Cabang/Multi-Zona RBAC, SetBranchController (POST /set-branch), AuthScope (helper scope terpusat, rancangan), employment_permissions (mekanisme multi-cabang lama, DEPRECATED) (+10 more)

### Community 20 - "BukuTransaksiKepala.jsx"
Cohesion: 0.20
Nodes (10): AppBadge, appBadgeVariants, VARIAN_JENIS, VARIAN_STATUS, varianJenis(), varianStatus(), Action(), BukuTransaksiKepala() (+2 more)

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

### Community 25 - "AuthenticatedLayout.jsx"
Cohesion: 0.06
Nodes (26): SearchComponent(), SweetAlert(), Authenticated(), MobileLayout(), EditableRow(), ManPower(), Action(), TableRekap() (+18 more)

### Community 26 - "Ghost permission (nama permission tak ada di tabel permissions)"
Cohesion: 0.15
Nodes (13): HandleInertiaRequests::share() prop global auth.roles, AuthScope::resolve() (dipakai memperbaiki getLoanMacet), BatchInputController dibatasi superuser (pastikanSuperuser), PinjamanTrait::getLoanMacet() / getLoanByDate(), Ghost permission (nama permission tak ada di tabel permissions), InputMacet.jsx + store_buku_transaksi_batch (jalur nasabah lama), Kuota ML sebagai PALANG, bukan perbandingan berulang, Alias middleware role: tidak terdaftar di Kernel (+5 more)

### Community 27 - "NewPasswordController.php"
Cohesion: 0.18
Nodes (5): NewPasswordController, Illuminate\Auth\Events\PasswordReset, Illuminate\Support\Facades\Password, Illuminate\Support\Str, Illuminate\Validation\Rules

### Community 28 - "app_laravel & unit-apps berbagi database ubmi_db"
Cohesion: 0.23
Nodes (12): Jangan jalankan php artisan test (phpunit menghantam ubmi_db produksi), Aturan single source of truth: migrasi wajib dari app_laravel, app_laravel_laravel-network (external shared network), unit-app-service (PHP-FPM container), unit-vite (Node 20 dev server, port 5174), unit-web (nginx, port 8080), Urutan Eksekusi 4 Fase yang Backward-Compatible, Asumsi lama: 1 karyawan = 1 cabang (+4 more)

### Community 29 - "AuthenticatedSessionController.php"
Cohesion: 0.27
Nodes (4): LoginRequest, Illuminate\Auth\Events\Lockout, Illuminate\Support\Facades\Auth, Illuminate\Validation\ValidationException

### Community 30 - "utils.js"
Cohesion: 0.18
Nodes (12): DatePicker(), HARI_TO_DOW, showNominalByStatus(), buttonVariants, Calendar(), SelectContent, SelectItem, SelectLabel (+4 more)

### Community 31 - "transaction_daily_closings (agregat harian)"
Cohesion: 0.22
Nodes (11): Ember (6 ember penyimpanan, 4 kategori tampilan), Gembok harian ditegakkan lewat trigger DB, AppHelper::generateStatusAngsuran() (4 nilai, alur lama), Generated column STORED (bukan VIRTUAL) & keluar dari $fillable, HitungAgregat (mesin penghitung agregat harian), Hook rekap otomatis dicabut dari model, transaction_loans.pinjaman adalah generated column (nominal_drop * 1.3), transaction_daily_closings (agregat harian) (+3 more)

### Community 32 - "AppServiceProvider"
Cohesion: 0.24
Nodes (5): AppServiceProvider, BroadcastServiceProvider, Illuminate\Routing\UrlGenerator, Illuminate\Support\Facades\Broadcast, Illuminate\Support\ServiceProvider

### Community 33 - "TransactionLoan"
Cohesion: 0.04
Nodes (31): PindahResortController, TransactionLoanInstalmentController, OnlineBranch, TransactionDailyRecap, TransactionLoan, TransactionLoanInstalment, PinjamanTrait, BalancingDailyReport (+23 more)

### Community 34 - "Penyakit dua sumber kebenaran berebut (hook vs controller)"
Cohesion: 0.27
Nodes (10): Rancangan agregasi rekap v2, AgregasiScope (gerbang pemilih agregasi lama vs baru), TransactionDailyRecapController@ceklist_kepala (penulis rekap tunggal), Penyakit dua sumber kebenaran berebut (hook vs controller), Grain per (grouping, hari), bukan per mantri, WorkDay::tanggalRekapBulan() (hari kerja + tanggal berdata), WorkDay / work_days (kalender kerja nasional), ceklist_kepala (Approval Rekap oleh Pimpinan) (+2 more)

### Community 35 - "GlobalBranchFilter.jsx"
Cohesion: 0.20
Nodes (11): GlobalBranchFilter(), Navbar(), Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList (+3 more)

### Community 37 - "self"
Cohesion: 0.13
Nodes (5): Carbon, Carbon, Carbon, TutupBulanan, self

### Community 38 - "App\Http\Controllers\ProfileController"
Cohesion: 0.20
Nodes (7): App\Http\Controllers\ProfileController, ProfileController, ProfileUpdateRequest, Illuminate\Contracts\Auth\MustVerifyEmail, Illuminate\Foundation\Http\FormRequest, Illuminate\Support\Facades\Redirect, Illuminate\Validation\Rule

### Community 39 - "Kunci Reset & Hapus berdasarkan approval rekap (daily_kepala_approval)"
Cohesion: 0.22
Nodes (9): Aturan wajib pencatatan perubahan (fungsi, route, tabel), FilterBar (chip filter instan + localStorage), PinjamanTrait::getTransactionLoan(), Konsolidasi halaman Buku Transaksi jadi satu halaman responsif, Kunci Reset & Hapus berdasarkan approval rekap (daily_kepala_approval), SearchComponent (dropdown filter lama, remount via key), ERD Relasi Data & Otorisasi Transaksi, Pemutihan Pinjaman Macet (White-Off) (+1 more)

### Community 40 - "app/Rules/HariKerja.php (satu Rule, tujuh pintu)"
Cohesion: 0.25
Nodes (9): getLastDateForHari() (JS, lib/utils.js), AppHelper::getStortingShowDate() / getNumbDays() (PHP), app/Rules/HariKerja.php (satu Rule, tujuh pintu), Pelajaran: setiap tanggal turunan wajib dicari dan diperiksa, Bug TDZ useHariLibur di atas useForm, useHariLibur (mundurKeHariKerja / majuKeHariKerja), action_buku_transaksi (ACC / Drop / Tolak / Batal), generateUnknownNik / callUnknownNik (+1 more)

### Community 41 - "Controller"
Cohesion: 0.25
Nodes (7): ConfirmablePasswordController, Controller, MantriAppsController, Illuminate\Foundation\Auth\Access\AuthorizesRequests, Illuminate\Foundation\Bus\DispatchesJobs, Illuminate\Foundation\Validation\ValidatesRequests, Illuminate\Routing\Controller

### Community 42 - "Illuminate\Foundation\Testing\RefreshDatabase"
Cohesion: 0.28
Nodes (3): Illuminate\Foundation\Testing\RefreshDatabase, PasswordUpdateTest, RegistrationTest

### Community 43 - "TestCase"
Cohesion: 0.22
Nodes (4): Illuminate\Foundation\Testing\TestCase, AuthenticationTest, ExampleTest, TestCase

### Community 45 - "PasswordResetTest"
Cohesion: 0.25
Nodes (3): Illuminate\Auth\Notifications\ResetPassword, Illuminate\Support\Facades\Notification, PasswordResetTest

### Community 46 - "sheet.jsx"
Cohesion: 0.22
Nodes (8): PengajuanLink, SheetContent, SheetDescription, SheetFooter(), SheetHeader(), SheetOverlay, SheetTitle, sheetVariants

### Community 47 - "Carbon"
Cohesion: 0.22
Nodes (3): DaftarMigrasi, TargetBayangan, Carbon

### Community 52 - "Mutasi"
Cohesion: 0.15
Nodes (5): Mutasi, MutasiNasabahController, App\Models\TransactionLoanMutation, TransactionLoanMutation, TransactionLoanMutation

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

### Community 59 - "routes/auth.php"
Cohesion: 0.22
Nodes (4): RegisteredUserController, Illuminate\Cache\RateLimiting\Limit, Illuminate\Support\Facades\RateLimiter, Illuminate\Support\Facades\Route

### Community 64 - "VIsBalanceLoanWithDailyReport"
Cohesion: 0.36
Nodes (4): CountingDailyBalance, VIsBalanceDropWithDailyReport, App\Models\VIsBalanceLoanWithDailyreport, VIsBalanceLoanWithDailyReport

### Community 67 - "AppBadge + appBadgeVariants"
Cohesion: 0.67
Nodes (3): AppBadge + appBadgeVariants, AppButton + appButtonVariants, statusVariants.js (VARIAN_STATUS / varianStatus)

### Community 126 - "Kernel"
Cohesion: 0.40
Nodes (3): Kernel, Illuminate\Console\Scheduling\Schedule, Illuminate\Foundation\Console\Kernel

### Community 134 - "AdminPanel/Index.jsx"
Cohesion: 0.05
Nodes (59): ApplicationLogo(), DangerButton(), FilterBar(), HARI_OPTIONS, KELOMPOK_OPTIONS, InputError(), InputLabel(), LinkButton() (+51 more)

### Community 138 - "Inertia\Response"
Cohesion: 0.32
Nodes (3): EmailVerificationPromptController, PasswordResetLinkController, Inertia\Response

### Community 140 - "HandleInertiaRequests.php"
Cohesion: 0.22
Nodes (5): SetBranchController, HandleInertiaRequests, Illuminate\Support\Facades\Session, Inertia\Middleware, Tightenco\Ziggy\Ziggy

### Community 141 - "sidebar.jsx"
Cohesion: 0.13
Nodes (14): useIsMobile(), Separator, SidebarContext, SidebarGroupAction, SidebarGroupContent, SidebarInput, SidebarInset, SidebarMenuAction (+6 more)

## Knowledge Gaps
- **46 isolated node(s):** `variantMap`, `variantMap`, `NAMA_HARI`, `STATUS`, `STATUS` (+41 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 453 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **40 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `User` connect `User` to `self`, `App\Http\Controllers\ProfileController`, `Illuminate\Http\Request`, `Illuminate\Database\Eloquent\Model`, `Illuminate\Foundation\Testing\RefreshDatabase`, `TestCase`, `Employee`, `PasswordResetTest`, `Carbon\Carbon`, `PasswordConfirmationTest`, `EmailVerificationTest.php`, `routes/auth.php`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `button.jsx`, `GlobalBranchFilter.jsx`, `AdminPanel/Index.jsx`, `AppButton.jsx`, `sidebar.jsx`, `sheet.jsx`, `Sidebar.jsx`, `BukuTransaksiKepala.jsx`, `AuthenticatedLayout.jsx`, `utils.js`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Why does `TransactionLoan` connect `TransactionLoan` to `TransactionLoanOfficerGrouping`, `Illuminate\Http\Request`, `AppHelper`, `Illuminate\Database\Eloquent\Model`, `MigrasiController`, `Carbon\Carbon`, `User`, `Mutasi`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Are the 14 inferred relationships involving `TransactionLoan` (e.g. with `.simpanPenyesuaian()` and `.cari()`) actually correct?**
  _`TransactionLoan` has 14 INFERRED edges - model-reasoned connections that need verification._
- **Are the 25 inferred relationships involving `AppHelper` (e.g. with `.action_buku_transaksi()` and `.bayar_pinjaman()`) actually correct?**
  _`AppHelper` has 25 INFERRED edges - model-reasoned connections that need verification._
- **Are the 18 inferred relationships involving `TransactionLoanOfficerGrouping` (e.g. with `.bawaKolomManual()` and `.siapkanBaris()`) actually correct?**
  _`TransactionLoanOfficerGrouping` has 18 INFERRED edges - model-reasoned connections that need verification._
- **What connects `variantMap`, `variantMap`, `NAMA_HARI` to the rest of the system?**
  _46 weakly-connected nodes found - possible documentation gaps or missing edges._