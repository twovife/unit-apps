# Graph Report - unit-apps  (2026-09-08)

## Corpus Check
- 406 files · ~181,168 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1579 nodes · 4469 edges · 137 communities (56 shown, 38 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 130 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `85e428ed`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- button.jsx
- NewAngsuran/Components/Action.jsx
- Authenticated
- Illuminate\Http\RedirectResponse
- TransactionLoan
- Illuminate\Http\Request
- TransactionCustomer
- AppHelper
- TransactionDailyClosing
- Illuminate\Database\Eloquent\Model
- cn
- HitungAgregat
- Employee
- TransactionMonthlyClosing
- WorkDay
- Sidebar.jsx
- Branch
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
- MutasiNasabahController
- dropdown-menu.jsx
- transaction_daily_closings (agregat harian)
- AppServiceProvider
- TestCase
- Penyakit dua sumber kebenaran berebut (hook vs controller)
- Permantri.jsx
- App\Helpers\AppHelper
- Controller
- sheet.jsx
- Kunci Reset & Hapus berdasarkan approval rekap (daily_kepala_approval)
- app/Rules/HariKerja.php (satu Rule, tujuh pintu)
- VIsBalanceLoanWithDailyReport
- Loan
- Illuminate\Foundation\Testing\RefreshDatabase
- Gembok
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
- Carbon\Carbon
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
- KesiapanClosing.jsx
- ValidateSignature
- VerifyCsrfToken
- console.php
- config/app.php
- sanctum.php
- entrypoint.sh
- entrypoint.dev.sh
- .validate
- .handle
- TransactionLoanOfficerGrouping
- EmployeeBranch
- AuthenticatedLayout.jsx
- EmployeeZone
- TransactionLoanInstalmentController
- HandleInertiaRequests.php
- WebView/RencanaDropKepala/Index.jsx
- WebView/Angsuran/Index.jsx
- Carbon
- TransactionLoanMutation
- Edit.jsx
- PasswordConfirmationTest
- TrustProxies.php

## God Nodes (most connected - your core abstractions)
1. `cn()` - 130 edges
2. `TransactionLoan` - 91 edges
3. `AppHelper` - 77 edges
4. `TransactionLoanOfficerGrouping` - 69 edges
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

## Communities (137 total, 38 thin omitted)

### Community 0 - "button.jsx"
Cohesion: 0.06
Nodes (63): ApplicationLogo(), Checkbox(), DangerButton(), HARI_OPTIONS, KELOMPOK_OPTIONS, InputError(), InputLabel(), LinkButton() (+55 more)

### Community 1 - "NewAngsuran/Components/Action.jsx"
Cohesion: 0.06
Nodes (57): BadgeStatus(), variantMap, BargeStatus(), variantMap, FormatNumbering(), StatusPinjaman(), NAMA_HARI, GenerateUser() (+49 more)

### Community 2 - "Authenticated"
Cohesion: 0.13
Nodes (4): Authenticated(), MobileLayout(), RekapContent(), AngsuranByDate()

### Community 3 - "Illuminate\Http\RedirectResponse"
Cohesion: 0.08
Nodes (16): AuthenticatedSessionController, ConfirmablePasswordController, EmailVerificationNotificationController, EmailVerificationPromptController, PasswordController, PasswordResetLinkController, RegisteredUserController, RouteServiceProvider (+8 more)

### Community 4 - "TransactionLoan"
Cohesion: 0.04
Nodes (27): PindahResortController, TransactionLoan, TransactionLoanInstalment, BalancingDailyReport, BalancingTargetSeeder, BatchInputAngsuranSeeder, CompareSeeder, DailySeeder (+19 more)

### Community 5 - "Illuminate\Http\Request"
Cohesion: 0.07
Nodes (6): AdminController, MobileAppsMantriController, TransactionDailyRecapController, TransactionLoanController, HariKerja, Illuminate\Http\Request

### Community 6 - "TransactionCustomer"
Cohesion: 0.17
Nodes (5): TransactionCustomer, BatchInputSeeder, ChangeNasabahGroupingSeeder, NasabahGrs3Seeder, UpdateSeeder

### Community 7 - "AppHelper"
Cohesion: 0.08
Nodes (4): AppHelper, BatchInputController, BatchInputV2Seeder, Int

### Community 8 - "TransactionDailyClosing"
Cohesion: 0.16
Nodes (3): ClosingHarianController, Carbon, TransactionDailyClosing

### Community 9 - "Illuminate\Database\Eloquent\Model"
Cohesion: 0.15
Nodes (13): DebtRelief, Employment, EmploymentPermission, Instalment, TransactionBranchDailyRecap, App\Models\TransactionLockHistory, TransactionOutReason, App\Models\TransactionSaldoAdjustment (+5 more)

### Community 10 - "cn"
Cohesion: 0.12
Nodes (23): cn(), DialogFooter(), DialogOverlay, DrawerContent, DrawerDescription, DrawerFooter(), DrawerHeader(), DrawerOverlay (+15 more)

### Community 12 - "Employee"
Cohesion: 0.13
Nodes (4): EmployeeController, Employee, EmploymentSeeder, GenerateEmpUserSeeder

### Community 13 - "TransactionMonthlyClosing"
Cohesion: 0.05
Nodes (11): AuthScope, GembokBulanan, PenyesuaianSaldo, SerahTerima, ClosingBulananController, MigrasiController, App\Models\TransactionMonthlyClosing, TransactionMonthlyClosing (+3 more)

### Community 14 - "WorkDay"
Cohesion: 0.13
Nodes (4): KalenderKerja, Carbon, KalenderKerjaController, WorkDay

### Community 15 - "Sidebar.jsx"
Cohesion: 0.19
Nodes (16): data, Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu (+8 more)

### Community 16 - "Branch"
Cohesion: 0.10
Nodes (10): GenerateClosingRows, TandaiMigrasi, VerifikasiAgregat, AgregasiScope, DaftarMigrasi, Carbon, PemeriksaAgregat, Carbon (+2 more)

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

### Community 35 - "Permantri.jsx"
Cohesion: 0.21
Nodes (15): FilterBar(), SearchComponent(), BukuTransaksi(), Rencana(), Create(), Action(), TableRekap(), TableRekapKasir() (+7 more)

### Community 36 - "App\Helpers\AppHelper"
Cohesion: 0.11
Nodes (13): App\Helpers\AppHelper, App\Http\Controllers\ProfileController, ProfileController, LoginRequest, ProfileUpdateRequest, Faker\Core\Number, Illuminate\Auth\Events\Lockout, Illuminate\Bus\Batch (+5 more)

### Community 37 - "Controller"
Cohesion: 0.18
Nodes (10): VerifyEmailController, Controller, LoanController, MantriAppsController, SetBranchController, Illuminate\Foundation\Auth\Access\AuthorizesRequests, Illuminate\Foundation\Auth\EmailVerificationRequest, Illuminate\Foundation\Bus\DispatchesJobs (+2 more)

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

### Community 45 - "PasswordResetTest"
Cohesion: 0.25
Nodes (3): Illuminate\Auth\Notifications\ResetPassword, Illuminate\Support\Facades\Notification, PasswordResetTest

### Community 46 - "self"
Cohesion: 0.16
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

### Community 59 - "Carbon\Carbon"
Cohesion: 0.12
Nodes (33): App\Helpers\AgregasiScope, App\Helpers\AuthScope, App\Helpers\DaftarMigrasi, Mutasi, App\Helpers\PemeriksaAgregat, App\Helpers\SerahTerima, App\Helpers\TutupBulanan, App\Http\Controllers\AdminController (+25 more)

### Community 62 - "NewPasswordController.php"
Cohesion: 0.20
Nodes (4): NewPasswordController, Illuminate\Auth\Events\PasswordReset, Illuminate\Support\Str, Illuminate\Validation\Rules

### Community 67 - "AppBadge + appBadgeVariants"
Cohesion: 0.67
Nodes (3): AppBadge + appBadgeVariants, AppButton + appButtonVariants, statusVariants.js (VARIAN_STATUS / varianStatus)

### Community 122 - ".validate"
Cohesion: 0.22
Nodes (4): RedirectIfAuthenticated, Carbon, Closure, Illuminate\Contracts\Validation\ValidationRule

### Community 124 - "TransactionLoanOfficerGrouping"
Cohesion: 0.12
Nodes (8): App\Models\OnlineBranch, OnlineBranch, TransactionDailyRecap, TransactionLoanOfficerGrouping, TransactionSirculation, PinjamanTrait, RekapTrait, ChangeWrongDateGlobalSeeder

### Community 126 - "AuthenticatedLayout.jsx"
Cohesion: 0.13
Nodes (6): Navbar(), AppSidebar(), SweetAlert(), EditableRow(), ManPower(), Permantri()

### Community 129 - "HandleInertiaRequests.php"
Cohesion: 0.40
Nodes (3): HandleInertiaRequests, Inertia\Middleware, Tightenco\Ziggy\Ziggy

### Community 134 - "Edit.jsx"
Cohesion: 0.40
Nodes (3): DeleteUserForm(), UpdatePasswordForm(), UpdateProfileInformation()

## Knowledge Gaps
- **46 isolated node(s):** `HARI_OPTIONS`, `KELOMPOK_OPTIONS`, `HARI_KE_ANGKA`, `NAMA_BULAN`, `NAMA_HARI` (+41 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 437 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **38 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `User` connect `User & Cakupan Cabang` to `TestCase`, `Illuminate\Http\RedirectResponse`, `App\Helpers\AppHelper`, `Illuminate\Http\Request`, `PasswordConfirmationTest`, `TransactionManageCustomer`, `Illuminate\Database\Eloquent\Model`, `Illuminate\Foundation\Testing\RefreshDatabase`, `Employee`, `PasswordResetTest`, `self`, `EmailVerificationTest.php`, `Carbon\Carbon`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Why does `TransactionLoan` connect `TransactionLoan` to `Illuminate\Http\Request`, `TransactionCustomer`, `AppHelper`, `TransactionManageCustomer`, `Illuminate\Database\Eloquent\Model`, `Carbon\Carbon`, `TransactionLoanOfficerGrouping`, `MutasiNasabahController`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Why does `TransactionLoanOfficerGrouping` connect `TransactionLoanOfficerGrouping` to `TransactionLoan`, `Illuminate\Http\Request`, `TransactionCustomer`, `AppHelper`, `TransactionDailyClosing`, `Illuminate\Database\Eloquent\Model`, `.handle`, `TransactionMonthlyClosing`, `Branch`, `Carbon\Carbon`, `MutasiNasabahController`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Are the 8 inferred relationships involving `TransactionLoan` (e.g. with `.cari()` and `.simpan()`) actually correct?**
  _`TransactionLoan` has 8 INFERRED edges - model-reasoned connections that need verification._
- **Are the 5 inferred relationships involving `AppHelper` (e.g. with `.getLoan()` and `.getLoanByDate()`) actually correct?**
  _`AppHelper` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Are the 7 inferred relationships involving `TransactionLoanOfficerGrouping` (e.g. with `.catat()` and `.index()`) actually correct?**
  _`TransactionLoanOfficerGrouping` has 7 INFERRED edges - model-reasoned connections that need verification._
- **What connects `HARI_OPTIONS`, `KELOMPOK_OPTIONS`, `HARI_KE_ANGKA` to the rest of the system?**
  _46 weakly-connected nodes found - possible documentation gaps or missing edges._