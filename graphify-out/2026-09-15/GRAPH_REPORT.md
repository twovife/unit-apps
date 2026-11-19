# Graph Report - unit-apps  (2026-09-15)

## Corpus Check
- 403 files · ~187,549 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1591 nodes · 4394 edges · 136 communities (58 shown, 34 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 208 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0707f1c8`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- RouteServiceProvider
- NewAngsuran/Components/Action.jsx
- Approval.jsx
- TransactionManageCustomer
- AgregasiScope
- Illuminate\Http\Request
- AuthenticatedSessionController.php
- AppHelper
- TransactionDailyClosing
- Illuminate\Database\Eloquent\Model
- cn
- HitungAgregat
- Employee
- MigrasiController
- TransactionLoan
- sidebar.jsx
- AdminPanel/Index.jsx
- User
- TransactionMonthlyClosing
- RBAC Multi-Cabang (rancangan)
- BukuTransaksiKepala.jsx
- EmailVerificationTest.php
- Illuminate\Database\Eloquent\Factories\Factory
- Auto-pelunasan pinjaman lama saat top-up berhasil drop
- CountingBalance.php
- PasswordConfirmationTest
- Ghost permission (nama permission tak ada di tabel permissions)
- NewPasswordController.php
- app_laravel & unit-apps berbagi database ubmi_db
- LoginRequest
- BukuTransaksi/Action.jsx
- transaction_daily_closings (agregat harian)
- AppServiceProvider
- TransactionLoanInstalment
- Penyakit dua sumber kebenaran berebut (hook vs controller)
- TransactionLoanMutation
- WorkDay
- App\Http\Controllers\ProfileController
- Kunci Reset & Hapus berdasarkan approval rekap (daily_kepala_approval)
- app/Rules/HariKerja.php (satu Rule, tujuh pintu)
- TransactionLoanOfficerGrouping
- Customer
- VIsBalanceLoanWithDailyReport
- TestCase
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
- Carbon\Carbon
- Authenticate
- TrustHosts
- Loan
- AuthServiceProvider
- ExampleTest
- AppBadge + appBadgeVariants
- Kernel
- EncryptCookies
- PreventRequestsDuringMaintenance
- TrimStrings
- Illuminate\Http\RedirectResponse
- ValidateSignature
- VerifyCsrfToken
- console.php
- config/app.php
- sanctum.php
- entrypoint.sh
- entrypoint.dev.sh
- PasswordResetTest
- Controller
- TransactionSaldoAdjustment
- Inertia\Response
- Kernel
- LoanRequest
- App\Http\Controllers\LoanController
- Carbon
- Carbon
- TransactionLoan
- AuthenticatedLayout.jsx
- Illuminate\Support\Collection
- Illuminate\Console\Command
- HandleInertiaRequests.php
- button.jsx
- CreatesApplication
- CrashAlert.jsx

## God Nodes (most connected - your core abstractions)
1. `cn()` - 130 edges
2. `TransactionLoan` - 74 edges
3. `AppHelper` - 73 edges
4. `TransactionLoanOfficerGrouping` - 68 edges
5. `Button` - 66 edges
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

## Communities (136 total, 34 thin omitted)

### Community 0 - "RouteServiceProvider"
Cohesion: 0.40
Nodes (3): RouteServiceProvider, Illuminate\Foundation\Support\Providers\RouteServiceProvider, Illuminate\Validation\ValidationException

### Community 1 - "NewAngsuran/Components/Action.jsx"
Cohesion: 0.07
Nodes (46): NoEditOverlay(), BadgeStatus(), variantMap, BargeStatus(), variantMap, FormatNumbering(), StatusPinjaman(), MutasiNasabah() (+38 more)

### Community 2 - "Approval.jsx"
Cohesion: 0.25
Nodes (9): Checkbox(), NAMA_HARI, BarisKelompok(), Harian(), rupiah(), DialogContent, DialogDescription, DialogHeader() (+1 more)

### Community 3 - "TransactionManageCustomer"
Cohesion: 0.15
Nodes (5): SiklusRekening, App\Models\TransactionManageCustomer, TransactionManageCustomer, App\Models\TransactionSiklus, TransactionSiklus

### Community 4 - "AgregasiScope"
Cohesion: 0.15
Nodes (5): AgregasiScope, Carbon, Carbon, TutupBulanan, self

### Community 5 - "Illuminate\Http\Request"
Cohesion: 0.07
Nodes (14): AdminController, MobileAppsMantriController, TransactionDailyRecapController, TransactionLoanController, TrustProxies, App\Models\TransactionLoan, App\Rules\HariKerja, HariKerja (+6 more)

### Community 6 - "AuthenticatedSessionController.php"
Cohesion: 0.21
Nodes (7): AuthenticatedSessionController, App\Http\Requests\Auth\LoginRequest, App\Providers\RouteServiceProvider, Illuminate\Auth\Events\Lockout, Illuminate\Cache\RateLimiting\Limit, Illuminate\Support\Facades\RateLimiter, Illuminate\Support\Facades\Route

### Community 7 - "AppHelper"
Cohesion: 0.06
Nodes (9): AppHelper, TransactionLoan, TransactionCustomer, BatchInputSeeder, BatchInputV2Seeder, NasabahGrs3Seeder, UpdateSeeder, Int (+1 more)

### Community 8 - "TransactionDailyClosing"
Cohesion: 0.10
Nodes (5): Gembok, ClosingHarianController, Carbon, TransactionDailyClosing, TransactionLockHistory

### Community 9 - "Illuminate\Database\Eloquent\Model"
Cohesion: 0.11
Nodes (16): DebtRelief, App\Models\Employee, EmployeeBranch, EmployeeZone, Employment, App\Models\EmploymentPermission, EmploymentPermission, Instalment (+8 more)

### Community 10 - "cn"
Cohesion: 0.06
Nodes (47): DatePicker(), cn(), Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList (+39 more)

### Community 11 - "HitungAgregat"
Cohesion: 0.12
Nodes (4): HitungClosing, Carbon, Ember, HitungAgregat

### Community 12 - "Employee"
Cohesion: 0.11
Nodes (4): BatchInputController, EmployeeController, Employee, GenerateEmpUserSeeder

### Community 13 - "MigrasiController"
Cohesion: 0.11
Nodes (7): AuthScope, DaftarMigrasi, TargetBayangan, MigrasiController, App\Models\TransactionMonthlyClosing, Carbon, TransactionSaldoAdjustment

### Community 14 - "TransactionLoan"
Cohesion: 0.05
Nodes (23): TransactionLoan, BalancingTargetSeeder, BatchInputAngsuranSeeder, ChangeNasabahGroupingSeeder, DailySeeder, DeleteAngsuranSeeder, EmploymentSeeder, GantiMantriSeeder (+15 more)

### Community 15 - "sidebar.jsx"
Cohesion: 0.09
Nodes (35): GlobalBranchFilter(), Navbar(), PengajuanLink, data, AppSidebar(), useIsMobile(), Separator, Sidebar (+27 more)

### Community 16 - "AdminPanel/Index.jsx"
Cohesion: 0.20
Nodes (19): FilterBar(), HARI_OPTIONS, KELOMPOK_OPTIONS, NAMA_BULAN, NAMA_HARI_PANJANG, AssignRoles(), MaintenerWorker(), Permission() (+11 more)

### Community 17 - "User"
Cohesion: 0.16
Nodes (9): User, BelongsToThrough, Illuminate\Foundation\Auth\User, Illuminate\Notifications\Notifiable, Laravel\Sanctum\HasApiTokens, Spatie\Permission\Traits\HasPermissions, Spatie\Permission\Traits\HasRoles, ProfileTest (+1 more)

### Community 18 - "TransactionMonthlyClosing"
Cohesion: 0.11
Nodes (4): GembokBulanan, SerahTerima, ClosingBulananController, TransactionMonthlyClosing

### Community 19 - "RBAC Multi-Cabang (rancangan)"
Cohesion: 0.14
Nodes (18): AuthScope::resolve(), employee_branches (pivot delegasi multi-cabang), employee_zones (pivot multi-zona staf kontrol), Global Branch Scope Flow, Modul F — Panel Admin & Multi-Cabang/Multi-Zona RBAC, SetBranchController (POST /set-branch), AuthScope (helper scope terpusat, rancangan), employment_permissions (mekanisme multi-cabang lama, DEPRECATED) (+10 more)

### Community 20 - "BukuTransaksiKepala.jsx"
Cohesion: 0.27
Nodes (8): VARIAN_JENIS, VARIAN_STATUS, varianJenis(), varianStatus(), Action(), BukuTransaksiKepala(), ActionTable(), tanggal()

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

### Community 26 - "Ghost permission (nama permission tak ada di tabel permissions)"
Cohesion: 0.15
Nodes (13): HandleInertiaRequests::share() prop global auth.roles, AuthScope::resolve() (dipakai memperbaiki getLoanMacet), BatchInputController dibatasi superuser (pastikanSuperuser), PinjamanTrait::getLoanMacet() / getLoanByDate(), Ghost permission (nama permission tak ada di tabel permissions), InputMacet.jsx + store_buku_transaksi_batch (jalur nasabah lama), Kuota ML sebagai PALANG, bukan perbandingan berulang, Alias middleware role: tidak terdaftar di Kernel (+5 more)

### Community 27 - "NewPasswordController.php"
Cohesion: 0.20
Nodes (4): NewPasswordController, Illuminate\Auth\Events\PasswordReset, Illuminate\Support\Str, Illuminate\Validation\Rules

### Community 28 - "app_laravel & unit-apps berbagi database ubmi_db"
Cohesion: 0.23
Nodes (12): Jangan jalankan php artisan test (phpunit menghantam ubmi_db produksi), Aturan single source of truth: migrasi wajib dari app_laravel, app_laravel_laravel-network (external shared network), unit-app-service (PHP-FPM container), unit-vite (Node 20 dev server, port 5174), unit-web (nginx, port 8080), Urutan Eksekusi 4 Fase yang Backward-Compatible, Asumsi lama: 1 karyawan = 1 cabang (+4 more)

### Community 30 - "BukuTransaksi/Action.jsx"
Cohesion: 0.10
Nodes (31): Loading(), AppBadge, appBadgeVariants, AppButton, appButtonVariants, HARI_KE_ANGKA, NAMA_BULAN, NAMA_HARI (+23 more)

### Community 31 - "transaction_daily_closings (agregat harian)"
Cohesion: 0.22
Nodes (11): Ember (6 ember penyimpanan, 4 kategori tampilan), Gembok harian ditegakkan lewat trigger DB, AppHelper::generateStatusAngsuran() (4 nilai, alur lama), Generated column STORED (bukan VIRTUAL) & keluar dari $fillable, HitungAgregat (mesin penghitung agregat harian), Hook rekap otomatis dicabut dari model, transaction_loans.pinjaman adalah generated column (nominal_drop * 1.3), transaction_daily_closings (agregat harian) (+3 more)

### Community 32 - "AppServiceProvider"
Cohesion: 0.24
Nodes (5): AppServiceProvider, BroadcastServiceProvider, Illuminate\Routing\UrlGenerator, Illuminate\Support\Facades\Broadcast, Illuminate\Support\ServiceProvider

### Community 33 - "TransactionLoanInstalment"
Cohesion: 0.11
Nodes (5): PindahResortController, TransactionLoanInstalmentController, TransactionLoanInstalment, CompareSeeder, UpdateManageSeeder

### Community 34 - "Penyakit dua sumber kebenaran berebut (hook vs controller)"
Cohesion: 0.27
Nodes (10): Rancangan agregasi rekap v2, AgregasiScope (gerbang pemilih agregasi lama vs baru), TransactionDailyRecapController@ceklist_kepala (penulis rekap tunggal), Penyakit dua sumber kebenaran berebut (hook vs controller), Grain per (grouping, hari), bukan per mantri, WorkDay::tanggalRekapBulan() (hari kerja + tanggal berdata), WorkDay / work_days (kalender kerja nasional), ceklist_kepala (Approval Rekap oleh Pimpinan) (+2 more)

### Community 37 - "WorkDay"
Cohesion: 0.09
Nodes (7): KalenderKerja, Carbon, KalenderKerjaController, RedirectIfAuthenticated, WorkDay, Carbon, Closure

### Community 38 - "App\Http\Controllers\ProfileController"
Cohesion: 0.20
Nodes (7): App\Http\Controllers\ProfileController, ProfileController, ProfileUpdateRequest, Illuminate\Contracts\Auth\MustVerifyEmail, Illuminate\Foundation\Http\FormRequest, Illuminate\Support\Facades\Redirect, Illuminate\Validation\Rule

### Community 39 - "Kunci Reset & Hapus berdasarkan approval rekap (daily_kepala_approval)"
Cohesion: 0.22
Nodes (9): Aturan wajib pencatatan perubahan (fungsi, route, tabel), FilterBar (chip filter instan + localStorage), PinjamanTrait::getTransactionLoan(), Konsolidasi halaman Buku Transaksi jadi satu halaman responsif, Kunci Reset & Hapus berdasarkan approval rekap (daily_kepala_approval), SearchComponent (dropdown filter lama, remount via key), ERD Relasi Data & Otorisasi Transaksi, Pemutihan Pinjaman Macet (White-Off) (+1 more)

### Community 40 - "app/Rules/HariKerja.php (satu Rule, tujuh pintu)"
Cohesion: 0.25
Nodes (9): getLastDateForHari() (JS, lib/utils.js), AppHelper::getStortingShowDate() / getNumbDays() (PHP), app/Rules/HariKerja.php (satu Rule, tujuh pintu), Pelajaran: setiap tanggal turunan wajib dicari dan diperiksa, Bug TDZ useHariLibur di atas useForm, useHariLibur (mundurKeHariKerja / majuKeHariKerja), action_buku_transaksi (ACC / Drop / Tolak / Batal), generateUnknownNik / callUnknownNik (+1 more)

### Community 41 - "TransactionLoanOfficerGrouping"
Cohesion: 0.11
Nodes (9): App\Models\OnlineBranch, OnlineBranch, TransactionDailyRecap, TransactionLoanOfficerGrouping, TransactionSirculation, PinjamanTrait, RekapTrait, ChangeWrongDateGlobalSeeder (+1 more)

### Community 44 - "VIsBalanceLoanWithDailyReport"
Cohesion: 0.31
Nodes (5): CountingDailyBalance, VIsBalanceDropWithDailyReport, App\Models\VIsBalanceLoanWithDailyreport, VIsBalanceLoanWithDailyReport, BalancingDailyReport

### Community 45 - "TestCase"
Cohesion: 0.22
Nodes (4): Illuminate\Foundation\Testing\TestCase, AuthenticationTest, ExampleTest, TestCase

### Community 47 - "Illuminate\Foundation\Testing\RefreshDatabase"
Cohesion: 0.28
Nodes (3): Illuminate\Foundation\Testing\RefreshDatabase, PasswordUpdateTest, RegistrationTest

### Community 52 - "Mutasi"
Cohesion: 0.24
Nodes (3): Mutasi, MutasiNasabahController, TransactionLoanMutation

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
Cohesion: 0.11
Nodes (37): App\Helpers\AgregasiScope, App\Helpers\AppHelper, App\Helpers\AuthScope, App\Helpers\Ember, App\Helpers\PemeriksaAgregat, App\Helpers\PenyesuaianSaldo, App\Helpers\SerahTerima, App\Helpers\TutupBulanan (+29 more)

### Community 67 - "AppBadge + appBadgeVariants"
Cohesion: 0.67
Nodes (3): AppBadge + appBadgeVariants, AppButton + appButtonVariants, statusVariants.js (VARIAN_STATUS / varianStatus)

### Community 72 - "Illuminate\Http\RedirectResponse"
Cohesion: 0.23
Nodes (5): ConfirmablePasswordController, EmailVerificationNotificationController, PasswordController, Illuminate\Http\RedirectResponse, Illuminate\Validation\Rules\Password

### Community 122 - "PasswordResetTest"
Cohesion: 0.25
Nodes (3): Illuminate\Auth\Notifications\ResetPassword, Illuminate\Support\Facades\Notification, PasswordResetTest

### Community 123 - "Controller"
Cohesion: 0.27
Nodes (9): VerifyEmailController, App\Http\Controllers\Controller, Controller, MantriAppsController, Illuminate\Foundation\Auth\Access\AuthorizesRequests, Illuminate\Foundation\Auth\EmailVerificationRequest, Illuminate\Foundation\Bus\DispatchesJobs, Illuminate\Foundation\Validation\ValidatesRequests (+1 more)

### Community 125 - "Inertia\Response"
Cohesion: 0.20
Nodes (5): EmailVerificationPromptController, PasswordResetLinkController, RegisteredUserController, Illuminate\Support\Facades\Password, Inertia\Response

### Community 126 - "Kernel"
Cohesion: 0.40
Nodes (3): Kernel, Illuminate\Console\Scheduling\Schedule, Illuminate\Foundation\Console\Kernel

### Community 134 - "AuthenticatedLayout.jsx"
Cohesion: 0.06
Nodes (26): ApplicationLogo(), DangerButton(), InputError(), InputLabel(), Modal(), PrimaryButton(), SecondaryButton(), SelectList() (+18 more)

### Community 139 - "Illuminate\Console\Command"
Cohesion: 0.17
Nodes (6): GenerateClosingRows, TandaiMigrasi, VerifikasiAgregat, PemeriksaAgregat, Carbon, Illuminate\Console\Command

### Community 140 - "HandleInertiaRequests.php"
Cohesion: 0.22
Nodes (5): SetBranchController, HandleInertiaRequests, Illuminate\Support\Facades\Session, Inertia\Middleware, Tightenco\Ziggy\Ziggy

### Community 141 - "button.jsx"
Cohesion: 0.14
Nodes (18): LinkButton(), SearchComponent(), SelectList(), useOptionGenerator(), FastCreateV2(), InputMacet(), NAMA_BULAN, Action() (+10 more)

## Knowledge Gaps
- **50 isolated node(s):** `NAMA_BULAN`, `variantMap`, `variantMap`, `STATUS`, `STATUS` (+45 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 449 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **34 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `TransactionLoan` connect `TransactionLoan` to `TransactionLoanInstalment`, `Illuminate\Http\Request`, `Illuminate\Database\Eloquent\Model`, `TransactionLoanOfficerGrouping`, `MigrasiController`, `User`, `Mutasi`, `Carbon\Carbon`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Why does `User` connect `User` to `AgregasiScope`, `Illuminate\Http\Request`, `App\Http\Controllers\ProfileController`, `Illuminate\Database\Eloquent\Model`, `Employee`, `TestCase`, `TransactionLoan`, `Illuminate\Foundation\Testing\RefreshDatabase`, `EmailVerificationTest.php`, `PasswordConfirmationTest`, `PasswordResetTest`, `Carbon\Carbon`, `Inertia\Response`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Why does `AppHelper` connect `AppHelper` to `Illuminate\Http\Request`, `TransactionLoanOfficerGrouping`, `Employee`, `TransactionLoan`, `Carbon\Carbon`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Are the 14 inferred relationships involving `TransactionLoan` (e.g. with `.simpanPenyesuaian()` and `.cari()`) actually correct?**
  _`TransactionLoan` has 14 INFERRED edges - model-reasoned connections that need verification._
- **Are the 25 inferred relationships involving `AppHelper` (e.g. with `.action_buku_transaksi()` and `.bayar_pinjaman()`) actually correct?**
  _`AppHelper` has 25 INFERRED edges - model-reasoned connections that need verification._
- **Are the 18 inferred relationships involving `TransactionLoanOfficerGrouping` (e.g. with `.bawaKolomManual()` and `.siapkanBaris()`) actually correct?**
  _`TransactionLoanOfficerGrouping` has 18 INFERRED edges - model-reasoned connections that need verification._
- **What connects `NAMA_BULAN`, `variantMap`, `variantMap` to the rest of the system?**
  _50 weakly-connected nodes found - possible documentation gaps or missing edges._