# Graph Report - unit-apps  (2026-09-08)

## Corpus Check
- 406 files · ~182,395 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1581 nodes · 4479 edges · 130 communities (54 shown, 33 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 134 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `894d667a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- button.jsx
- table.jsx
- AuthenticatedLayout.jsx
- ConfirmablePasswordController
- TransactionLoan
- Illuminate\Http\Request
- Illuminate\Http\RedirectResponse
- AppHelper
- TransactionDailyClosing
- Illuminate\Database\Eloquent\Model
- cn
- HitungAgregat
- Employee
- TransactionSaldoAdjustment
- WorkDay
- sidebar.jsx
- Branch
- User & Cakupan Cabang
- TransactionMonthlyClosing
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
- LoginRequest
- dropdown-menu.jsx
- transaction_daily_closings (agregat harian)
- AppServiceProvider
- TestCase
- Penyakit dua sumber kebenaran berebut (hook vs controller)
- RouteServiceProvider
- HandleInertiaRequests.php
- Controller
- sheet.jsx
- Kunci Reset & Hapus berdasarkan approval rekap (daily_kepala_approval)
- app/Rules/HariKerja.php (satu Rule, tujuh pintu)
- VIsBalanceLoanWithDailyReport
- Loan
- Illuminate\Foundation\Testing\RefreshDatabase
- .store
- PasswordResetTest
- TutupBulanan
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
- Inertia\Response
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
- ProfileController
- Instalment
- PasswordResetLinkController
- EmployeeZone
- Carbon
- App\Models\TransactionLoan
- InputError.jsx
- TrustProxies.php

## God Nodes (most connected - your core abstractions)
1. `cn()` - 130 edges
2. `TransactionLoan` - 89 edges
3. `AppHelper` - 77 edges
4. `TransactionLoanOfficerGrouping` - 70 edges
5. `Button` - 67 edges
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

## Communities (130 total, 33 thin omitted)

### Community 0 - "button.jsx"
Cohesion: 0.06
Nodes (79): Checkbox(), FilterBar(), HARI_OPTIONS, KELOMPOK_OPTIONS, LinkButton(), Loading(), NoEditOverlay(), SelectList() (+71 more)

### Community 1 - "table.jsx"
Cohesion: 0.08
Nodes (45): BadgeStatus(), variantMap, BargeStatus(), variantMap, FormatNumbering(), StatusPinjaman(), MutasiNasabah(), rupiah() (+37 more)

### Community 2 - "AuthenticatedLayout.jsx"
Cohesion: 0.06
Nodes (12): SweetAlert(), Authenticated(), MobileLayout(), EditableRow(), ManPower(), Permantri(), RekapContent(), Content() (+4 more)

### Community 4 - "TransactionLoan"
Cohesion: 0.04
Nodes (13): App\Http\Controllers\PindahResortController, PindahResortController, TransactionLoanInstalmentController, App\Models\TransactionDailyRecap, TransactionDailyRecap, TransactionLoan, TransactionLoanInstalment, TransactionSirculation (+5 more)

### Community 5 - "Illuminate\Http\Request"
Cohesion: 0.06
Nodes (11): AdminController, MobileAppsMantriController, TransactionDailyRecapController, App\Http\Controllers\TransactionLoanController, TransactionLoanController, RedirectIfAuthenticated, HariKerja, Carbon (+3 more)

### Community 6 - "Illuminate\Http\RedirectResponse"
Cohesion: 0.18
Nodes (7): AuthenticatedSessionController, EmailVerificationNotificationController, PasswordController, VerifyEmailController, Illuminate\Foundation\Auth\EmailVerificationRequest, Illuminate\Http\RedirectResponse, Illuminate\Validation\Rules\Password

### Community 7 - "AppHelper"
Cohesion: 0.07
Nodes (5): AppHelper, OnlineBranch, PinjamanTrait, BatchInputV2Seeder, Int

### Community 8 - "TransactionDailyClosing"
Cohesion: 0.10
Nodes (5): Gembok, ClosingHarianController, Carbon, TransactionDailyClosing, TransactionLockHistory

### Community 9 - "Illuminate\Database\Eloquent\Model"
Cohesion: 0.11
Nodes (22): App\Models\Branch, DebtRelief, App\Models\Employee, EmployeeBranch, Employment, App\Models\EmploymentPermission, EmploymentPermission, App\Models\OnlineBranch (+14 more)

### Community 10 - "cn"
Cohesion: 0.10
Nodes (26): DatePicker(), cn(), DialogFooter(), DialogOverlay, DrawerContent, DrawerDescription, DrawerFooter(), DrawerHeader() (+18 more)

### Community 11 - "HitungAgregat"
Cohesion: 0.11
Nodes (3): Ember, HitungAgregat, Carbon

### Community 12 - "Employee"
Cohesion: 0.08
Nodes (22): App\Http\Controllers\AdminController, App\Http\Controllers\BatchInputController, App\Http\Controllers\EmployeeController, EmployeeController, App\Http\Controllers\LoanController, App\Http\Controllers\MantriAppsController, App\Http\Controllers\MobileAppsMantriController, App\Http\Controllers\ProfileController (+14 more)

### Community 13 - "TransactionSaldoAdjustment"
Cohesion: 0.09
Nodes (7): AuthScope, PenyesuaianSaldo, MigrasiController, App\Models\TransactionMonthlyClosing, TransactionSaldoAdjustment, Carbon, TransactionLoan

### Community 14 - "WorkDay"
Cohesion: 0.10
Nodes (7): DaftarMigrasi, Carbon, KalenderKerja, Carbon, KalenderKerjaController, WorkDay, self

### Community 15 - "sidebar.jsx"
Cohesion: 0.12
Nodes (28): data, AppSidebar(), useIsMobile(), Sidebar, SidebarContent, SidebarContext, SidebarFooter, SidebarGroup (+20 more)

### Community 16 - "Branch"
Cohesion: 0.13
Nodes (9): CountingDailyBalance, GenerateClosingRows, TandaiMigrasi, VerifikasiAgregat, AgregasiScope, Carbon, PemeriksaAgregat, Branch (+1 more)

### Community 17 - "User & Cakupan Cabang"
Cohesion: 0.16
Nodes (8): User, BelongsToThrough, Illuminate\Foundation\Auth\User, Illuminate\Notifications\Notifiable, Laravel\Sanctum\HasApiTokens, Spatie\Permission\Traits\HasPermissions, Spatie\Permission\Traits\HasRoles, ProfileTest

### Community 18 - "TransactionMonthlyClosing"
Cohesion: 0.10
Nodes (7): App\Helpers\AuthScope, GembokBulanan, SerahTerima, App\Helpers\TutupBulanan, ClosingBulananController, TransactionMonthlyClosing, Controller

### Community 19 - "RBAC Multi-Cabang (rancangan)"
Cohesion: 0.14
Nodes (18): AuthScope::resolve(), employee_branches (pivot delegasi multi-cabang), employee_zones (pivot multi-zona staf kontrol), Global Branch Scope Flow, Modul F — Panel Admin & Multi-Cabang/Multi-Zona RBAC, SetBranchController (POST /set-branch), AuthScope (helper scope terpusat, rancangan), employment_permissions (mekanisme multi-cabang lama, DEPRECATED) (+10 more)

### Community 20 - "BukuTransaksiKepala.jsx"
Cohesion: 0.23
Nodes (10): AppBadge, appBadgeVariants, VARIAN_JENIS, VARIAN_STATUS, varianJenis(), varianStatus(), Action(), BukuTransaksiKepala() (+2 more)

### Community 21 - "EmailVerificationTest.php"
Cohesion: 0.13
Nodes (8): EventServiceProvider, Illuminate\Auth\Events\Registered, Illuminate\Auth\Events\Verified, Illuminate\Auth\Listeners\SendEmailVerificationNotification, Illuminate\Foundation\Support\Providers\EventServiceProvider, Illuminate\Support\Facades\Event, Illuminate\Support\Facades\URL, EmailVerificationTest

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

### Community 28 - "app_laravel & unit-apps berbagi database ubmi_db"
Cohesion: 0.23
Nodes (12): Jangan jalankan php artisan test (phpunit menghantam ubmi_db produksi), Aturan single source of truth: migrasi wajib dari app_laravel, app_laravel_laravel-network (external shared network), unit-app-service (PHP-FPM container), unit-vite (Node 20 dev server, port 5174), unit-web (nginx, port 8080), Urutan Eksekusi 4 Fase yang Backward-Compatible, Asumsi lama: 1 karyawan = 1 cabang (+4 more)

### Community 29 - "LoginRequest"
Cohesion: 0.24
Nodes (4): LoginRequest, ProfileUpdateRequest, Illuminate\Auth\Events\Lockout, Illuminate\Foundation\Http\FormRequest

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

### Community 35 - "RouteServiceProvider"
Cohesion: 0.24
Nodes (5): RouteServiceProvider, Illuminate\Cache\RateLimiting\Limit, Illuminate\Foundation\Support\Providers\RouteServiceProvider, Illuminate\Support\Facades\RateLimiter, Illuminate\Support\Facades\Route

### Community 36 - "HandleInertiaRequests.php"
Cohesion: 0.29
Nodes (4): HandleInertiaRequests, Illuminate\Support\Facades\Session, Inertia\Middleware, Tightenco\Ziggy\Ziggy

### Community 37 - "Controller"
Cohesion: 0.19
Nodes (9): RegisteredUserController, Controller, LoanController, MantriAppsController, SetBranchController, Illuminate\Foundation\Auth\Access\AuthorizesRequests, Illuminate\Foundation\Bus\DispatchesJobs, Illuminate\Foundation\Validation\ValidatesRequests (+1 more)

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
Cohesion: 0.40
Nodes (3): VIsBalanceDropWithDailyReport, App\Models\VIsBalanceLoanWithDailyreport, VIsBalanceLoanWithDailyReport

### Community 43 - "Illuminate\Foundation\Testing\RefreshDatabase"
Cohesion: 0.28
Nodes (3): Illuminate\Foundation\Testing\RefreshDatabase, PasswordUpdateTest, RegistrationTest

### Community 45 - "PasswordResetTest"
Cohesion: 0.25
Nodes (3): Illuminate\Auth\Notifications\ResetPassword, Illuminate\Support\Facades\Notification, PasswordResetTest

### Community 46 - "TutupBulanan"
Cohesion: 0.20
Nodes (4): HitungClosing, Carbon, Carbon, TutupBulanan

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
Cohesion: 0.07
Nodes (35): App\Helpers\AgregasiScope, App\Helpers\DaftarMigrasi, App\Helpers\PemeriksaAgregat, App\Helpers\SerahTerima, TransactionCustomer, TransactionLoanOfficerGrouping, Carbon\Carbon, BalancingDailyReport (+27 more)

### Community 62 - "Inertia\Response"
Cohesion: 0.22
Nodes (6): EmailVerificationPromptController, NewPasswordController, Illuminate\Auth\Events\PasswordReset, Illuminate\Support\Facades\Password, Illuminate\Validation\Rules, Inertia\Response

### Community 67 - "AppBadge + appBadgeVariants"
Cohesion: 0.67
Nodes (3): AppBadge + appBadgeVariants, AppButton + appButtonVariants, statusVariants.js (VARIAN_STATUS / varianStatus)

### Community 133 - "App\Models\TransactionLoan"
Cohesion: 0.16
Nodes (6): Mutasi, App\Helpers\PenyesuaianSaldo, MutasiNasabahController, App\Models\TransactionLoan, TransactionLoanMutation, Staudenmeir\EloquentHasManyDeep\HasRelationships

### Community 134 - "InputError.jsx"
Cohesion: 0.13
Nodes (16): ApplicationLogo(), DangerButton(), InputError(), InputLabel(), Modal(), PrimaryButton(), SecondaryButton(), useServerFilter() (+8 more)

## Knowledge Gaps
- **46 isolated node(s):** `HARI_OPTIONS`, `KELOMPOK_OPTIONS`, `HARI_KE_ANGKA`, `NAMA_BULAN`, `NAMA_HARI` (+41 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 435 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **33 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `TransactionLoanOfficerGrouping` connect `TransactionLoanOfficerGrouping` to `TransactionLoan`, `App\Models\TransactionLoan`, `Illuminate\Http\Request`, `AppHelper`, `TransactionDailyClosing`, `Illuminate\Database\Eloquent\Model`, `HitungAgregat`, `Employee`, `.store`, `TutupBulanan`, `WorkDay`, `Branch`, `TransactionMonthlyClosing`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `button.jsx`, `table.jsx`, `sheet.jsx`, `sidebar.jsx`, `BukuTransaksiKepala.jsx`, `GlobalBranchFilter.jsx`, `dropdown-menu.jsx`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Why does `User` connect `User & Cakupan Cabang` to `TestCase`, `Controller`, `Illuminate\Http\Request`, `PasswordConfirmationTest`, `Illuminate\Database\Eloquent\Model`, `Illuminate\Foundation\Testing\RefreshDatabase`, `Employee`, `PasswordResetTest`, `WorkDay`, `EmailVerificationTest.php`, `TransactionManageCustomer`, `LoginRequest`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Are the 8 inferred relationships involving `TransactionLoan` (e.g. with `.cari()` and `.simpan()`) actually correct?**
  _`TransactionLoan` has 8 INFERRED edges - model-reasoned connections that need verification._
- **Are the 5 inferred relationships involving `AppHelper` (e.g. with `.getLoan()` and `.getLoanByDate()`) actually correct?**
  _`AppHelper` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Are the 8 inferred relationships involving `TransactionLoanOfficerGrouping` (e.g. with `.catat()` and `.index()`) actually correct?**
  _`TransactionLoanOfficerGrouping` has 8 INFERRED edges - model-reasoned connections that need verification._
- **What connects `HARI_OPTIONS`, `KELOMPOK_OPTIONS`, `HARI_KE_ANGKA` to the rest of the system?**
  _46 weakly-connected nodes found - possible documentation gaps or missing edges._