# Graph Report - unit-apps  (2026-09-17)

## Corpus Check
- 406 files · ~189,972 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1604 nodes · 4428 edges · 145 communities (68 shown, 33 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 219 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8d827533`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Bulanan.jsx
- table.jsx
- Illuminate\Http\RedirectResponse
- TransactionManageCustomer
- AuthenticatedLayout.jsx
- Illuminate\Http\Request
- NewPasswordController.php
- AppHelper
- TransactionDailyClosing
- Illuminate\Database\Eloquent\Model
- cn
- HitungAgregat
- Employee
- Branch
- SerahTerima.jsx
- Sidebar.jsx
- AuthenticatedSessionController.php
- User
- TransactionMonthlyClosing
- RBAC Multi-Cabang (rancangan)
- BukuTransaksiKepala.jsx
- EventServiceProvider.php
- Illuminate\Database\Eloquent\Factories\Factory
- Auto-pelunasan pinjaman lama saat top-up berhasil drop
- CountingBalance.php
- input.jsx
- Ghost permission (nama permission tak ada di tabel permissions)
- GlobalBranchFilter.jsx
- app_laravel & unit-apps berbagi database ubmi_db
- sheet.jsx
- AdminPanel/Index.jsx
- transaction_daily_closings (agregat harian)
- AppServiceProvider
- Penyakit dua sumber kebenaran berebut (hook vs controller)
- dropdown-menu.jsx
- Inertia\Response
- self
- LoginRequest
- Kunci Reset & Hapus berdasarkan approval rekap (daily_kepala_approval)
- app/Rules/HariKerja.php (satu Rule, tujuh pintu)
- RouteServiceProvider
- .store
- TestCase
- button.jsx
- Illuminate\Foundation\Testing\RefreshDatabase
- Illuminate\Database\Migrations\Migration
- Illuminate\Database\Schema\Blueprint
- Illuminate\Support\Facades\Schema
- Illuminate\Foundation\Application
- Mutasi
- 8 Permission Inti
- Dropdown.jsx
- SerahTerima saldo awal (periksa / tetapkanZ / sahkan)
- Handler
- graphify — peta hubungan kode
- logging.php
- .run
- Authenticate
- TrustHosts
- Illuminate\Console\Command
- AuthServiceProvider
- AdminController
- ExampleTest
- AppBadge + appBadgeVariants
- Kernel
- EncryptCookies
- PreventRequestsDuringMaintenance
- TrimStrings
- Controller
- ValidateSignature
- VerifyCsrfToken
- console.php
- config/app.php
- sanctum.php
- entrypoint.sh
- entrypoint.dev.sh
- PasswordResetTest
- NewNasabah.jsx
- TransactionLoan
- Kernel
- Inertia\Inertia
- App\Http\Controllers\LoanController
- Carbon
- Carbon
- TransactionLoan
- InputError.jsx
- Illuminate\Support\Collection
- NewAngsuran/Components/Action.jsx
- utils.js
- sidebar.jsx
- Carbon\Carbon
- HandleInertiaRequests.php
- WorkDay
- CreatesApplication
- StockTakeMl.jsx
- Components/TableRekap.jsx
- StatusPengajuan.jsx
- BukuTransaksi/Action.jsx
- EmailVerificationTest.php
- ProfileTest
- PenyesuaianSaldo.jsx

## God Nodes (most connected - your core abstractions)
1. `cn()` - 130 edges
2. `TransactionLoan` - 74 edges
3. `AppHelper` - 74 edges
4. `TransactionLoanOfficerGrouping` - 71 edges
5. `Button` - 68 edges
6. `TransactionDailyClosing` - 48 edges
7. `User` - 46 edges
8. `Branch` - 39 edges
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

## Communities (145 total, 33 thin omitted)

### Community 1 - "table.jsx"
Cohesion: 0.17
Nodes (15): BadgeStatus(), variantMap, BargeStatus(), variantMap, MutasiNasabah(), rupiah(), STATUS, rupiah() (+7 more)

### Community 2 - "Illuminate\Http\RedirectResponse"
Cohesion: 0.32
Nodes (3): EmailVerificationNotificationController, ProfileController, Illuminate\Http\RedirectResponse

### Community 3 - "TransactionManageCustomer"
Cohesion: 0.15
Nodes (4): SiklusRekening, TransactionManageCustomer, App\Models\TransactionSiklus, TransactionSiklus

### Community 4 - "AuthenticatedLayout.jsx"
Cohesion: 0.06
Nodes (17): SweetAlert(), Authenticated(), MobileLayout(), EditableRow(), ManPower(), BarisKelompok(), Harian(), rupiah() (+9 more)

### Community 5 - "Illuminate\Http\Request"
Cohesion: 0.08
Nodes (15): TransactionDailyRecapController, TransactionLoanController, RedirectIfAuthenticated, TrustProxies, App\Models\TransactionLoan, App\Rules\HariKerja, HariKerja, Closure (+7 more)

### Community 6 - "NewPasswordController.php"
Cohesion: 0.17
Nodes (6): PasswordResetLinkController, Illuminate\Auth\Events\PasswordReset, Illuminate\Support\Facades\Password, Illuminate\Support\Str, Illuminate\Validation\Rules, Illuminate\Validation\ValidationException

### Community 7 - "AppHelper"
Cohesion: 0.07
Nodes (7): AppHelper, TransactionLoan, App\Models\OnlineBranch, OnlineBranch, PinjamanTrait, Int, User

### Community 8 - "TransactionDailyClosing"
Cohesion: 0.10
Nodes (5): Gembok, ClosingHarianController, Carbon, TransactionDailyClosing, TransactionLockHistory

### Community 9 - "Illuminate\Database\Eloquent\Model"
Cohesion: 0.05
Nodes (30): App\Console\Commands\CountingDailyBalance, CountingDailyBalance, App\Http\Controllers\TransactionLoanController, Customer, DebtRelief, App\Models\Employee, EmployeeBranch, EmployeeZone (+22 more)

### Community 10 - "cn"
Cohesion: 0.12
Nodes (24): DatePicker(), cn(), buttonVariants, Calendar(), DrawerContent, DrawerDescription, DrawerFooter(), DrawerHeader() (+16 more)

### Community 11 - "HitungAgregat"
Cohesion: 0.07
Nodes (5): HitungClosing, Carbon, Ember, HitungAgregat, TransactionSaldoAdjustment

### Community 12 - "Employee"
Cohesion: 0.15
Nodes (3): EmployeeController, Employee, GenerateEmpUserSeeder

### Community 13 - "Branch"
Cohesion: 0.10
Nodes (10): App\Helpers\AgregasiScope, AgregasiScope, AuthScope, DaftarMigrasi, PenyesuaianSaldo, TargetBayangan, MigrasiController, Branch (+2 more)

### Community 14 - "SerahTerima.jsx"
Cohesion: 0.60
Nodes (3): rupiah(), SelZ(), SerahTerima()

### Community 15 - "Sidebar.jsx"
Cohesion: 0.17
Nodes (17): data, AppSidebar(), Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader (+9 more)

### Community 16 - "AuthenticatedSessionController.php"
Cohesion: 0.21
Nodes (7): AuthenticatedSessionController, App\Http\Requests\Auth\LoginRequest, App\Providers\RouteServiceProvider, Illuminate\Auth\Events\Lockout, Illuminate\Cache\RateLimiting\Limit, Illuminate\Support\Facades\RateLimiter, Illuminate\Support\Facades\Route

### Community 17 - "User"
Cohesion: 0.16
Nodes (9): User, BelongsToThrough, Illuminate\Foundation\Auth\User, Illuminate\Notifications\Notifiable, Laravel\Sanctum\HasApiTokens, Spatie\Permission\Models\Role, Spatie\Permission\Traits\HasPermissions, Spatie\Permission\Traits\HasRoles (+1 more)

### Community 18 - "TransactionMonthlyClosing"
Cohesion: 0.11
Nodes (4): GembokBulanan, SerahTerima, ClosingBulananController, TransactionMonthlyClosing

### Community 19 - "RBAC Multi-Cabang (rancangan)"
Cohesion: 0.14
Nodes (18): AuthScope::resolve(), employee_branches (pivot delegasi multi-cabang), employee_zones (pivot multi-zona staf kontrol), Global Branch Scope Flow, Modul F — Panel Admin & Multi-Cabang/Multi-Zona RBAC, SetBranchController (POST /set-branch), AuthScope (helper scope terpusat, rancangan), employment_permissions (mekanisme multi-cabang lama, DEPRECATED) (+10 more)

### Community 20 - "BukuTransaksiKepala.jsx"
Cohesion: 0.23
Nodes (10): AppBadge, appBadgeVariants, VARIAN_JENIS, VARIAN_STATUS, varianJenis(), varianStatus(), Action(), BukuTransaksiKepala() (+2 more)

### Community 21 - "EventServiceProvider.php"
Cohesion: 0.25
Nodes (5): EventServiceProvider, Illuminate\Auth\Events\Registered, Illuminate\Auth\Listeners\SendEmailVerificationNotification, Illuminate\Foundation\Support\Providers\EventServiceProvider, Illuminate\Support\Facades\Event

### Community 22 - "Illuminate\Database\Eloquent\Factories\Factory"
Cohesion: 0.24
Nodes (4): TransactionCustomerFactory, TransactionManageCustomerFactory, UserFactory, Illuminate\Database\Eloquent\Factories\Factory

### Community 23 - "Auto-pelunasan pinjaman lama saat top-up berhasil drop"
Cohesion: 0.16
Nodes (14): Auto-pelunasan pinjaman lama saat top-up berhasil drop, AppHelper::canDeleteLoan(), TransactionLoanController::checkpengajuan(), AppHelper::havePermissionByDate() dan bug E1, NoEditOverlay (pola overlay lama, ditinggalkan), Pola gerbang: kontrol tetap tampil, disabled + keterangan, transaction_loans.postponed_loan_id (Tundaan), transaction_loans.previous_loan_id (top-up / refinance) (+6 more)

### Community 24 - "CountingBalance.php"
Cohesion: 0.30
Nodes (7): CountingBalance, CountingCirculation, Illuminate\Bus\Queueable, Illuminate\Contracts\Queue\ShouldQueue, Illuminate\Foundation\Bus\Dispatchable, Illuminate\Queue\InteractsWithQueue, Illuminate\Queue\SerializesModels

### Community 25 - "input.jsx"
Cohesion: 0.17
Nodes (15): HARI_OPTIONS, KELOMPOK_OPTIONS, NAMA_BULAN, NAMA_HARI_PANJANG, LinkButton(), SelectList(), useOptionGenerator(), GenerateUser() (+7 more)

### Community 26 - "Ghost permission (nama permission tak ada di tabel permissions)"
Cohesion: 0.15
Nodes (13): HandleInertiaRequests::share() prop global auth.roles, AuthScope::resolve() (dipakai memperbaiki getLoanMacet), BatchInputController dibatasi superuser (pastikanSuperuser), PinjamanTrait::getLoanMacet() / getLoanByDate(), Ghost permission (nama permission tak ada di tabel permissions), InputMacet.jsx + store_buku_transaksi_batch (jalur nasabah lama), Kuota ML sebagai PALANG, bukan perbandingan berulang, Alias middleware role: tidak terdaftar di Kernel (+5 more)

### Community 27 - "GlobalBranchFilter.jsx"
Cohesion: 0.20
Nodes (11): GlobalBranchFilter(), Navbar(), Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList (+3 more)

### Community 28 - "app_laravel & unit-apps berbagi database ubmi_db"
Cohesion: 0.23
Nodes (12): Jangan jalankan php artisan test (phpunit menghantam ubmi_db produksi), Aturan single source of truth: migrasi wajib dari app_laravel, app_laravel_laravel-network (external shared network), unit-app-service (PHP-FPM container), unit-vite (Node 20 dev server, port 5174), unit-web (nginx, port 8080), Urutan Eksekusi 4 Fase yang Backward-Compatible, Asumsi lama: 1 karyawan = 1 cabang (+4 more)

### Community 29 - "sheet.jsx"
Cohesion: 0.24
Nodes (8): PengajuanLink, SheetContent, SheetDescription, SheetFooter(), SheetHeader(), SheetOverlay, SheetTitle, sheetVariants

### Community 30 - "AdminPanel/Index.jsx"
Cohesion: 0.30
Nodes (12): SelectList(), AssignRoles(), MaintenerWorker(), Permission(), Role(), JenisNasabah(), Card, CardContent (+4 more)

### Community 31 - "transaction_daily_closings (agregat harian)"
Cohesion: 0.22
Nodes (11): Ember (6 ember penyimpanan, 4 kategori tampilan), Gembok harian ditegakkan lewat trigger DB, AppHelper::generateStatusAngsuran() (4 nilai, alur lama), Generated column STORED (bukan VIRTUAL) & keluar dari $fillable, HitungAgregat (mesin penghitung agregat harian), Hook rekap otomatis dicabut dari model, transaction_loans.pinjaman adalah generated column (nominal_drop * 1.3), transaction_daily_closings (agregat harian) (+3 more)

### Community 32 - "AppServiceProvider"
Cohesion: 0.24
Nodes (5): AppServiceProvider, BroadcastServiceProvider, Illuminate\Routing\UrlGenerator, Illuminate\Support\Facades\Broadcast, Illuminate\Support\ServiceProvider

### Community 34 - "Penyakit dua sumber kebenaran berebut (hook vs controller)"
Cohesion: 0.27
Nodes (10): Rancangan agregasi rekap v2, AgregasiScope (gerbang pemilih agregasi lama vs baru), TransactionDailyRecapController@ceklist_kepala (penulis rekap tunggal), Penyakit dua sumber kebenaran berebut (hook vs controller), Grain per (grouping, hari), bukan per mantri, WorkDay::tanggalRekapBulan() (hari kerja + tanggal berdata), WorkDay / work_days (kalender kerja nasional), ceklist_kepala (Approval Rekap oleh Pimpinan) (+2 more)

### Community 35 - "dropdown-menu.jsx"
Cohesion: 0.23
Nodes (9): DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut(), DropdownMenuSubContent (+1 more)

### Community 36 - "Inertia\Response"
Cohesion: 0.16
Nodes (6): ConfirmablePasswordController, EmailVerificationPromptController, NewPasswordController, PasswordController, RegisteredUserController, Inertia\Response

### Community 37 - "self"
Cohesion: 0.13
Nodes (5): Carbon, App\Helpers\TutupBulanan, Carbon, TutupBulanan, self

### Community 38 - "LoginRequest"
Cohesion: 0.25
Nodes (4): LoginRequest, ProfileUpdateRequest, Illuminate\Foundation\Http\FormRequest, Illuminate\Validation\Rule

### Community 39 - "Kunci Reset & Hapus berdasarkan approval rekap (daily_kepala_approval)"
Cohesion: 0.22
Nodes (9): Aturan wajib pencatatan perubahan (fungsi, route, tabel), FilterBar (chip filter instan + localStorage), PinjamanTrait::getTransactionLoan(), Konsolidasi halaman Buku Transaksi jadi satu halaman responsif, Kunci Reset & Hapus berdasarkan approval rekap (daily_kepala_approval), SearchComponent (dropdown filter lama, remount via key), ERD Relasi Data & Otorisasi Transaksi, Pemutihan Pinjaman Macet (White-Off) (+1 more)

### Community 40 - "app/Rules/HariKerja.php (satu Rule, tujuh pintu)"
Cohesion: 0.25
Nodes (9): getLastDateForHari() (JS, lib/utils.js), AppHelper::getStortingShowDate() / getNumbDays() (PHP), app/Rules/HariKerja.php (satu Rule, tujuh pintu), Pelajaran: setiap tanggal turunan wajib dicari dan diperiksa, Bug TDZ useHariLibur di atas useForm, useHariLibur (mundurKeHariKerja / majuKeHariKerja), action_buku_transaksi (ACC / Drop / Tolak / Batal), generateUnknownNik / callUnknownNik (+1 more)

### Community 45 - "TestCase"
Cohesion: 0.22
Nodes (4): Illuminate\Foundation\Testing\TestCase, AuthenticationTest, ExampleTest, TestCase

### Community 46 - "button.jsx"
Cohesion: 0.14
Nodes (15): FilterBar(), SearchComponent(), NAMA_BULAN, Action(), TableRekap(), TableRekapKasir(), TunaiMantri(), TableRencana() (+7 more)

### Community 47 - "Illuminate\Foundation\Testing\RefreshDatabase"
Cohesion: 0.28
Nodes (3): Illuminate\Foundation\Testing\RefreshDatabase, PasswordUpdateTest, RegistrationTest

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

### Community 62 - "Illuminate\Console\Command"
Cohesion: 0.11
Nodes (9): GenerateClosingRows, MaterialisasiTargetOtomatis, TandaiMigrasi, VerifikasiAgregat, App\Helpers\PemeriksaAgregat, PemeriksaAgregat, Carbon, TargetMingguan (+1 more)

### Community 67 - "AppBadge + appBadgeVariants"
Cohesion: 0.67
Nodes (3): AppBadge + appBadgeVariants, AppButton + appButtonVariants, statusVariants.js (VARIAN_STATUS / varianStatus)

### Community 72 - "Controller"
Cohesion: 0.27
Nodes (9): VerifyEmailController, App\Http\Controllers\Controller, Controller, MantriAppsController, Illuminate\Foundation\Auth\Access\AuthorizesRequests, Illuminate\Foundation\Auth\EmailVerificationRequest, Illuminate\Foundation\Bus\DispatchesJobs, Illuminate\Foundation\Validation\ValidatesRequests (+1 more)

### Community 122 - "PasswordResetTest"
Cohesion: 0.25
Nodes (3): Illuminate\Auth\Notifications\ResetPassword, Illuminate\Support\Facades\Notification, PasswordResetTest

### Community 123 - "NewNasabah.jsx"
Cohesion: 0.12
Nodes (14): Checkbox(), Modal(), NoEditOverlay(), NAMA_HARI, KunciKasir(), CrashAlert(), isMacet(), NewNasabah() (+6 more)

### Community 125 - "TransactionLoan"
Cohesion: 0.05
Nodes (11): App\Http\Controllers\PindahResortController, PindahResortController, TransactionLoanInstalmentController, TransactionDailyRecap, TransactionLoan, TransactionLoanInstalment, TransactionLoanOfficerGrouping, TransactionSirculation (+3 more)

### Community 126 - "Kernel"
Cohesion: 0.40
Nodes (3): Kernel, Illuminate\Console\Scheduling\Schedule, Illuminate\Foundation\Console\Kernel

### Community 128 - "Inertia\Inertia"
Cohesion: 0.11
Nodes (24): App\Helpers\AppHelper, App\Helpers\AuthScope, App\Http\Controllers\EmployeeController, App\Http\Controllers\MantriAppsController, App\Http\Controllers\MobileAppsMantriController, MobileAppsMantriController, App\Http\Controllers\ProfileController, App\Http\Controllers\TransactionDailyRecapController (+16 more)

### Community 134 - "InputError.jsx"
Cohesion: 0.15
Nodes (11): ApplicationLogo(), DangerButton(), InputError(), InputLabel(), PrimaryButton(), SecondaryButton(), Guest(), DeleteAngsuran() (+3 more)

### Community 136 - "NewAngsuran/Components/Action.jsx"
Cohesion: 0.18
Nodes (10): FormatNumbering(), StatusPinjaman(), Action(), LoanDetail(), tanggal(), ApprovalAkhir(), Badge(), badgeVariants (+2 more)

### Community 137 - "utils.js"
Cohesion: 0.16
Nodes (19): Loading(), AppButton, appButtonVariants, HARI_KE_ANGKA, NAMA_BULAN, NAMA_HARI, TanggalKerja(), simpanan (+11 more)

### Community 138 - "sidebar.jsx"
Cohesion: 0.15
Nodes (13): useIsMobile(), SidebarContext, SidebarGroupAction, SidebarGroupContent, SidebarInput, SidebarInset, SidebarMenuAction, SidebarMenuBadge (+5 more)

### Community 139 - "Carbon\Carbon"
Cohesion: 0.07
Nodes (40): App\Helpers\DaftarMigrasi, App\Helpers\Ember, App\Helpers\PenyesuaianSaldo, App\Helpers\SerahTerima, App\Helpers\TargetBayangan, App\Http\Controllers\AdminController, App\Http\Controllers\BatchInputController, TransactionCustomer (+32 more)

### Community 140 - "HandleInertiaRequests.php"
Cohesion: 0.22
Nodes (5): SetBranchController, HandleInertiaRequests, Illuminate\Support\Facades\Session, Inertia\Middleware, Tightenco\Ziggy\Ziggy

### Community 141 - "WorkDay"
Cohesion: 0.11
Nodes (5): KalenderKerja, Carbon, KalenderKerjaController, WorkDay, Carbon

### Community 147 - "StockTakeMl.jsx"
Cohesion: 0.40
Nodes (3): rupiah(), STATUS, StockTakeMl()

### Community 148 - "Components/TableRekap.jsx"
Cohesion: 0.47
Nodes (4): TableRekapPerMantri(), AccordionContent, AccordionItem, AccordionTrigger

### Community 150 - "BukuTransaksi/Action.jsx"
Cohesion: 0.36
Nodes (4): Acc(), ChangeDetail(), RemoveLoan(), ReStatus()

### Community 152 - "EmailVerificationTest.php"
Cohesion: 0.29
Nodes (3): Illuminate\Auth\Events\Verified, Illuminate\Support\Facades\URL, EmailVerificationTest

### Community 155 - "PenyesuaianSaldo.jsx"
Cohesion: 0.60
Nodes (3): KartuPinjaman(), PenyesuaianSaldo(), rupiah()

## Knowledge Gaps
- **50 isolated node(s):** `STATUS`, `InputOTPSeparator`, `NAMA_HARI`, `variantMap`, `variantMap` (+45 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 451 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **33 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `User` connect `User` to `AdminController`, `Inertia\Inertia`, `Inertia\Response`, `self`, `LoginRequest`, `Illuminate\Database\Eloquent\Model`, `Carbon\Carbon`, `Employee`, `Branch`, `TestCase`, `Illuminate\Foundation\Testing\RefreshDatabase`, `EmailVerificationTest.php`, `ProfileTest`, `PasswordResetTest`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Why does `AppHelper` connect `AppHelper` to `Inertia\Inertia`, `AdminController`, `Illuminate\Http\Request`, `Carbon\Carbon`, `Employee`, `.store`, `.run`, `TransactionLoan`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `table.jsx`, `dropdown-menu.jsx`, `NewAngsuran/Components/Action.jsx`, `utils.js`, `sidebar.jsx`, `NewNasabah.jsx`, `button.jsx`, `Sidebar.jsx`, `BukuTransaksiKepala.jsx`, `Components/TableRekap.jsx`, `input.jsx`, `GlobalBranchFilter.jsx`, `sheet.jsx`, `AdminPanel/Index.jsx`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Are the 14 inferred relationships involving `TransactionLoan` (e.g. with `.simpanPenyesuaian()` and `.cari()`) actually correct?**
  _`TransactionLoan` has 14 INFERRED edges - model-reasoned connections that need verification._
- **Are the 26 inferred relationships involving `AppHelper` (e.g. with `.action_buku_transaksi()` and `.bayar_pinjaman()`) actually correct?**
  _`AppHelper` has 26 INFERRED edges - model-reasoned connections that need verification._
- **Are the 21 inferred relationships involving `TransactionLoanOfficerGrouping` (e.g. with `.handle()` and `.bawaKolomManual()`) actually correct?**
  _`TransactionLoanOfficerGrouping` has 21 INFERRED edges - model-reasoned connections that need verification._
- **What connects `STATUS`, `InputOTPSeparator`, `NAMA_HARI` to the rest of the system?**
  _50 weakly-connected nodes found - possible documentation gaps or missing edges._