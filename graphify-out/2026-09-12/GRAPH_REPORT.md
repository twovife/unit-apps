# Graph Report - unit-apps  (2026-09-12)

## Corpus Check
- 409 files · ~186,395 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1604 nodes · 4476 edges · 146 communities (62 shown, 40 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 207 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `89a67cad`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Illuminate\Database\Seeder
- button.jsx
- AdminPanel/Index.jsx
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
- sidebar.jsx
- AgregasiScope
- User
- TransactionMonthlyClosing
- RBAC Multi-Cabang (rancangan)
- Acc.jsx
- EmailVerificationTest.php
- Illuminate\Database\Eloquent\Factories\Factory
- Auto-pelunasan pinjaman lama saat top-up berhasil drop
- CountingBalance.php
- MobileLayout.jsx
- Ghost permission (nama permission tak ada di tabel permissions)
- Customer
- app_laravel & unit-apps berbagi database ubmi_db
- LoginRequest
- dropdown-menu.jsx
- transaction_daily_closings (agregat harian)
- AppServiceProvider
- TransactionLoanOfficerGrouping
- Penyakit dua sumber kebenaran berebut (hook vs controller)
- GlobalBranchFilter.jsx
- LoginRequest.php
- TanggalKerja.jsx
- ProfileController
- Kunci Reset & Hapus berdasarkan approval rekap (daily_kepala_approval)
- app/Rules/HariKerja.php (satu Rule, tujuh pintu)
- Controller
- Illuminate\Foundation\Testing\RefreshDatabase
- TestCase
- InputMacet.jsx
- PasswordResetTest
- sheet.jsx
- Inertia\Inertia
- Illuminate\Database\Migrations\Migration
- Illuminate\Database\Schema\Blueprint
- Illuminate\Support\Facades\Schema
- TransactionDailyRecapController
- Mutasi
- 8 Permission Inti
- Dropdown.jsx
- SerahTerima saldo awal (periksa / tetapkanZ / sahkan)
- Handler
- graphify — peta hubungan kode
- logging.php
- RouteServiceProvider
- Authenticate
- TrustHosts
- WorkDay
- AuthServiceProvider
- .store
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
- EmployeeBranch
- BukuTransaksi/Action.jsx
- TransactionSaldoAdjustment
- App\Models\TransactionLoan
- TransactionLoanController.php
- PasswordConfirmationTest
- TransactionLoan
- App\Http\Controllers\LoanController
- Carbon
- Carbon
- TransactionLoanInstalmentController
- InputError.jsx
- Illuminate\Support\Collection
- TrustProxies.php
- .handle
- NewPasswordController.php
- routes/auth.php
- HandleInertiaRequests.php
- Loan
- KesiapanClosing.jsx
- LoanRequest
- VerifyEmailController.php
- TransactionLoan

## God Nodes (most connected - your core abstractions)
1. `cn()` - 130 edges
2. `TransactionLoan` - 74 edges
3. `AppHelper` - 72 edges
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

## Communities (146 total, 40 thin omitted)

### Community 0 - "Illuminate\Database\Seeder"
Cohesion: 0.08
Nodes (17): TransactionCustomer, BalancingTargetSeeder, BatchInputSeeder, ChangeNasabahGroupingSeeder, DailySeeder, CompareSeeder, LunasinSeeder, asdfg (+9 more)

### Community 1 - "button.jsx"
Cohesion: 0.05
Nodes (58): BadgeStatus(), variantMap, BargeStatus(), variantMap, FormatNumbering(), StatusPinjaman(), SweetAlert(), Authenticated() (+50 more)

### Community 2 - "AdminPanel/Index.jsx"
Cohesion: 0.25
Nodes (14): Checkbox(), AssignRoles(), MaintenerWorker(), Permission(), Role(), Card, CardContent, CardDescription (+6 more)

### Community 3 - "TransactionManageCustomer"
Cohesion: 0.14
Nodes (7): SiklusRekening, App\Models\TransactionManageCustomer, TransactionManageCustomer, App\Models\TransactionMonthlyClosing, App\Models\TransactionSiklus, TransactionSiklus, Znck\Eloquent\Traits\BelongsToThrough

### Community 4 - "KalenderKerja"
Cohesion: 0.20
Nodes (3): KalenderKerja, Carbon, KalenderKerjaController

### Community 5 - "Illuminate\Http\Request"
Cohesion: 0.11
Nodes (4): AdminController, MobileAppsMantriController, SetBranchController, Illuminate\Http\Request

### Community 6 - "Illuminate\Http\RedirectResponse"
Cohesion: 0.17
Nodes (8): AuthenticatedSessionController, ConfirmablePasswordController, EmailVerificationPromptController, PasswordResetLinkController, Illuminate\Http\RedirectResponse, Illuminate\Support\Facades\Password, Illuminate\Validation\ValidationException, Inertia\Response

### Community 7 - "AppHelper"
Cohesion: 0.07
Nodes (5): AppHelper, TransactionLoan, BatchInputAngsuranSeeder, BatchInputV2Seeder, Int

### Community 8 - "TransactionDailyClosing"
Cohesion: 0.10
Nodes (5): Gembok, ClosingHarianController, Carbon, TransactionDailyClosing, TransactionLockHistory

### Community 9 - "Illuminate\Database\Eloquent\Model"
Cohesion: 0.16
Nodes (14): DebtRelief, Employment, App\Models\EmploymentPermission, EmploymentPermission, Instalment, App\Models\OnlineBranch, TransactionBranchDailyRecap, App\Models\TransactionLockHistory (+6 more)

### Community 10 - "cn"
Cohesion: 0.10
Nodes (30): DatePicker(), cn(), HARI_TO_DOW, showNominalByStatus(), buttonVariants, Calendar(), DialogFooter(), DialogOverlay (+22 more)

### Community 11 - "HitungAgregat"
Cohesion: 0.11
Nodes (3): Ember, HitungAgregat, TargetBayangan

### Community 12 - "Employee"
Cohesion: 0.13
Nodes (4): EmployeeController, Employee, EmploymentSeeder, GenerateEmpUserSeeder

### Community 13 - "MigrasiController"
Cohesion: 0.13
Nodes (5): AuthScope, DaftarMigrasi, MigrasiController, Carbon, TransactionSaldoAdjustment

### Community 14 - "Carbon\Carbon"
Cohesion: 0.12
Nodes (17): GenerateClosingRows, TandaiMigrasi, VerifikasiAgregat, App\Helpers\AgregasiScope, App\Helpers\AuthScope, App\Helpers\Ember, App\Helpers\PemeriksaAgregat, PemeriksaAgregat (+9 more)

### Community 15 - "sidebar.jsx"
Cohesion: 0.10
Nodes (32): GlobalBranchFilter(), Navbar(), data, AppSidebar(), useIsMobile(), Separator, Sidebar, SidebarContent (+24 more)

### Community 16 - "AgregasiScope"
Cohesion: 0.14
Nodes (5): AgregasiScope, Carbon, Carbon, TutupBulanan, self

### Community 17 - "User"
Cohesion: 0.16
Nodes (8): User, BelongsToThrough, Illuminate\Foundation\Auth\User, Illuminate\Notifications\Notifiable, Laravel\Sanctum\HasApiTokens, Spatie\Permission\Traits\HasPermissions, Spatie\Permission\Traits\HasRoles, ProfileTest

### Community 18 - "TransactionMonthlyClosing"
Cohesion: 0.12
Nodes (4): GembokBulanan, SerahTerima, ClosingBulananController, TransactionMonthlyClosing

### Community 19 - "RBAC Multi-Cabang (rancangan)"
Cohesion: 0.14
Nodes (18): AuthScope::resolve(), employee_branches (pivot delegasi multi-cabang), employee_zones (pivot multi-zona staf kontrol), Global Branch Scope Flow, Modul F — Panel Admin & Multi-Cabang/Multi-Zona RBAC, SetBranchController (POST /set-branch), AuthScope (helper scope terpusat, rancangan), employment_permissions (mekanisme multi-cabang lama, DEPRECATED) (+10 more)

### Community 20 - "Acc.jsx"
Cohesion: 0.16
Nodes (13): AppBadge, appBadgeVariants, AppButton, appButtonVariants, VARIAN_JENIS, VARIAN_STATUS, varianJenis(), varianStatus() (+5 more)

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
Cohesion: 0.13
Nodes (14): CountingDailyBalance, Kernel, CountingBalance, CountingCirculation, VIsBalanceDropWithDailyReport, VIsBalanceLoanWithDailyReport, BalancingDailyReport, Illuminate\Bus\Queueable (+6 more)

### Community 25 - "MobileLayout.jsx"
Cohesion: 0.10
Nodes (6): MobileLayout(), Permantri(), Content(), Angsuran(), AngsuranByDate(), NewNasabah()

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

### Community 33 - "TransactionLoanOfficerGrouping"
Cohesion: 0.12
Nodes (7): Carbon, TransactionDailyRecap, TransactionLoanOfficerGrouping, TransactionSirculation, PinjamanTrait, RekapTrait, LunasinMLGantung

### Community 34 - "Penyakit dua sumber kebenaran berebut (hook vs controller)"
Cohesion: 0.27
Nodes (10): Rancangan agregasi rekap v2, AgregasiScope (gerbang pemilih agregasi lama vs baru), TransactionDailyRecapController@ceklist_kepala (penulis rekap tunggal), Penyakit dua sumber kebenaran berebut (hook vs controller), Grain per (grouping, hari), bukan per mantri, WorkDay::tanggalRekapBulan() (hari kerja + tanggal berdata), WorkDay / work_days (kalender kerja nasional), ceklist_kepala (Approval Rekap oleh Pimpinan) (+2 more)

### Community 35 - "GlobalBranchFilter.jsx"
Cohesion: 0.29
Nodes (8): Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut()

### Community 37 - "TanggalKerja.jsx"
Cohesion: 0.17
Nodes (15): NoEditOverlay(), HARI_KE_ANGKA, NAMA_BULAN, NAMA_HARI, TanggalKerja(), simpanan, useHariLibur(), getLastDateForHari() (+7 more)

### Community 38 - "ProfileController"
Cohesion: 0.25
Nodes (4): ProfileController, ProfileUpdateRequest, Illuminate\Foundation\Http\FormRequest, Illuminate\Validation\Rule

### Community 39 - "Kunci Reset & Hapus berdasarkan approval rekap (daily_kepala_approval)"
Cohesion: 0.22
Nodes (9): Aturan wajib pencatatan perubahan (fungsi, route, tabel), FilterBar (chip filter instan + localStorage), PinjamanTrait::getTransactionLoan(), Konsolidasi halaman Buku Transaksi jadi satu halaman responsif, Kunci Reset & Hapus berdasarkan approval rekap (daily_kepala_approval), SearchComponent (dropdown filter lama, remount via key), ERD Relasi Data & Otorisasi Transaksi, Pemutihan Pinjaman Macet (White-Off) (+1 more)

### Community 40 - "app/Rules/HariKerja.php (satu Rule, tujuh pintu)"
Cohesion: 0.25
Nodes (9): getLastDateForHari() (JS, lib/utils.js), AppHelper::getStortingShowDate() / getNumbDays() (PHP), app/Rules/HariKerja.php (satu Rule, tujuh pintu), Pelajaran: setiap tanggal turunan wajib dicari dan diperiksa, Bug TDZ useHariLibur di atas useForm, useHariLibur (mundurKeHariKerja / majuKeHariKerja), action_buku_transaksi (ACC / Drop / Tolak / Batal), generateUnknownNik / callUnknownNik (+1 more)

### Community 41 - "Controller"
Cohesion: 0.20
Nodes (9): EmailVerificationNotificationController, PasswordController, Controller, MantriAppsController, Illuminate\Foundation\Auth\Access\AuthorizesRequests, Illuminate\Foundation\Bus\DispatchesJobs, Illuminate\Foundation\Validation\ValidatesRequests, Illuminate\Routing\Controller (+1 more)

### Community 42 - "Illuminate\Foundation\Testing\RefreshDatabase"
Cohesion: 0.28
Nodes (3): Illuminate\Foundation\Testing\RefreshDatabase, PasswordUpdateTest, RegistrationTest

### Community 43 - "TestCase"
Cohesion: 0.22
Nodes (4): Illuminate\Foundation\Testing\TestCase, AuthenticationTest, ExampleTest, TestCase

### Community 44 - "InputMacet.jsx"
Cohesion: 0.14
Nodes (23): FilterBar(), HARI_OPTIONS, KELOMPOK_OPTIONS, LinkButton(), SearchComponent(), SelectList(), useOptionGenerator(), BukuTransaksi() (+15 more)

### Community 45 - "PasswordResetTest"
Cohesion: 0.25
Nodes (3): Illuminate\Auth\Notifications\ResetPassword, Illuminate\Support\Facades\Notification, PasswordResetTest

### Community 46 - "sheet.jsx"
Cohesion: 0.31
Nodes (7): SheetContent, SheetDescription, SheetFooter(), SheetHeader(), SheetOverlay, SheetTitle, sheetVariants

### Community 47 - "Inertia\Inertia"
Cohesion: 0.15
Nodes (18): App\Http\Controllers\AdminController, App\Http\Controllers\BatchInputController, App\Http\Controllers\EmployeeController, App\Http\Controllers\MantriAppsController, App\Http\Controllers\MobileAppsMantriController, App\Http\Controllers\PindahResortController, App\Http\Controllers\ProfileController, OnlineBranch (+10 more)

### Community 51 - "TransactionDailyRecapController"
Cohesion: 0.22
Nodes (3): TransactionDailyRecapController, Controller, TransactionDailyRecap

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

### Community 59 - "RouteServiceProvider"
Cohesion: 0.33
Nodes (4): RouteServiceProvider, Illuminate\Cache\RateLimiting\Limit, Illuminate\Foundation\Support\Providers\RouteServiceProvider, Illuminate\Support\Facades\RateLimiter

### Community 62 - "WorkDay"
Cohesion: 0.13
Nodes (7): RedirectIfAuthenticated, WorkDay, App\Rules\HariKerja, HariKerja, Carbon, Closure, Illuminate\Contracts\Validation\ValidationRule

### Community 67 - "AppBadge + appBadgeVariants"
Cohesion: 0.67
Nodes (3): AppBadge + appBadgeVariants, AppButton + appButtonVariants, statusVariants.js (VARIAN_STATUS / varianStatus)

### Community 123 - "BukuTransaksi/Action.jsx"
Cohesion: 0.20
Nodes (10): Loading(), SelectList(), GenerateUser(), ChangeDetail(), RemoveLoan(), ReStatus(), StatusPengajuan(), tanggal() (+2 more)

### Community 125 - "App\Models\TransactionLoan"
Cohesion: 0.18
Nodes (4): TransactionLoanController, App\Models\TransactionLoan, Staudenmeir\EloquentHasManyDeep\HasRelationships, TransactionLoan

### Community 126 - "TransactionLoanController.php"
Cohesion: 0.24
Nodes (15): App\Helpers\AppHelper, App\Http\Controllers\TransactionDailyRecapController, App\Models\Branch, App\Models\Employee, App\Models\TransactionCustomer, App\Models\TransactionDailyClosing, App\Models\TransactionDailyRecap, App\Models\TransactionLoanInstalment (+7 more)

### Community 129 - "TransactionLoan"
Cohesion: 0.06
Nodes (11): PindahResortController, TransactionLoan, TransactionLoanInstalment, CompareSeeder, DeleteAngsuranSeeder, GantiMantriSeeder, GenerateTotalSeeder, KeubahSeeder (+3 more)

### Community 134 - "InputError.jsx"
Cohesion: 0.14
Nodes (12): ApplicationLogo(), DangerButton(), InputError(), InputLabel(), Modal(), PrimaryButton(), SecondaryButton(), Guest() (+4 more)

### Community 138 - "NewPasswordController.php"
Cohesion: 0.33
Nodes (3): NewPasswordController, Illuminate\Auth\Events\PasswordReset, Illuminate\Validation\Rules

### Community 140 - "HandleInertiaRequests.php"
Cohesion: 0.40
Nodes (3): HandleInertiaRequests, Inertia\Middleware, Tightenco\Ziggy\Ziggy

## Knowledge Gaps
- **46 isolated node(s):** `variantMap`, `variantMap`, `STATUS`, `HARI_TO_DOW`, `InputOTPSeparator` (+41 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 449 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **40 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `User` connect `User` to `PasswordConfirmationTest`, `TransactionManageCustomer`, `Illuminate\Http\Request`, `ProfileController`, `Illuminate\Database\Eloquent\Model`, `Illuminate\Foundation\Testing\RefreshDatabase`, `routes/auth.php`, `Employee`, `TestCase`, `PasswordResetTest`, `Inertia\Inertia`, `AgregasiScope`, `EmailVerificationTest.php`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `button.jsx`, `AdminPanel/Index.jsx`, `GlobalBranchFilter.jsx`, `TanggalKerja.jsx`, `InputMacet.jsx`, `sheet.jsx`, `sidebar.jsx`, `Acc.jsx`, `dropdown-menu.jsx`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Why does `TransactionLoan` connect `TransactionLoan` to `Illuminate\Database\Seeder`, `TransactionLoanOfficerGrouping`, `TransactionManageCustomer`, `Illuminate\Http\Request`, `AppHelper`, `Illuminate\Database\Eloquent\Model`, `MigrasiController`, `Inertia\Inertia`, `Mutasi`, `App\Models\TransactionLoan`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Are the 14 inferred relationships involving `TransactionLoan` (e.g. with `.simpanPenyesuaian()` and `.cari()`) actually correct?**
  _`TransactionLoan` has 14 INFERRED edges - model-reasoned connections that need verification._
- **Are the 25 inferred relationships involving `AppHelper` (e.g. with `.action_buku_transaksi()` and `.bayar_pinjaman()`) actually correct?**
  _`AppHelper` has 25 INFERRED edges - model-reasoned connections that need verification._
- **Are the 18 inferred relationships involving `TransactionLoanOfficerGrouping` (e.g. with `.bawaKolomManual()` and `.siapkanBaris()`) actually correct?**
  _`TransactionLoanOfficerGrouping` has 18 INFERRED edges - model-reasoned connections that need verification._
- **What connects `variantMap`, `variantMap`, `STATUS` to the rest of the system?**
  _46 weakly-connected nodes found - possible documentation gaps or missing edges._