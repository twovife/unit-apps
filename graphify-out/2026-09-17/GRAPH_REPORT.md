# Graph Report - unit-apps  (2026-09-16)

## Corpus Check
- 406 files · ~189,982 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1604 nodes · 4429 edges · 156 communities (75 shown, 37 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 214 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `95f67583`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- WorkDay
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
- MigrasiController
- Illuminate\Database\Seeder
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
- .ceklist_kepala
- Penyakit dua sumber kebenaran berebut (hook vs controller)
- dropdown-menu.jsx
- Inertia\Response
- self
- LoginRequest
- Kunci Reset & Hapus berdasarkan approval rekap (daily_kepala_approval)
- app/Rules/HariKerja.php (satu Rule, tujuh pintu)
- RouteServiceProvider
- TransactionDailyRecap
- TransactionLoanInstalment
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
- TransactionCustomer
- Authenticate
- TrustHosts
- Branch
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
- TransactionSaldoAdjustment
- TransactionLoan
- Kernel
- App\Http\Controllers\TransactionLoanController
- TransactionLoanOfficerGrouping
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
- KalenderKerja
- CreatesApplication
- AgregasiScope
- TrustProxies.php
- Carbon
- Gembok
- StockTakeMl.jsx
- Components/TableRekap.jsx
- StatusPengajuan.jsx
- BukuTransaksi/Action.jsx
- .handle
- EmailVerificationTest.php
- ProfileTest
- App\Rules\HariKerja
- PenyesuaianSaldo.jsx

## God Nodes (most connected - your core abstractions)
1. `cn()` - 130 edges
2. `AppHelper` - 74 edges
3. `TransactionLoanOfficerGrouping` - 71 edges
4. `TransactionLoan` - 69 edges
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

## Communities (156 total, 37 thin omitted)

### Community 1 - "table.jsx"
Cohesion: 0.12
Nodes (19): MutasiNasabah(), rupiah(), Baris(), rupiah(), BarisKelompok(), Harian(), rupiah(), STATUS (+11 more)

### Community 2 - "Illuminate\Http\RedirectResponse"
Cohesion: 0.32
Nodes (3): EmailVerificationNotificationController, ProfileController, Illuminate\Http\RedirectResponse

### Community 3 - "TransactionManageCustomer"
Cohesion: 0.13
Nodes (7): SiklusRekening, App\Models\TransactionManageCustomer, TransactionManageCustomer, App\Models\TransactionMonthlyClosing, App\Models\TransactionSiklus, TransactionSiklus, Znck\Eloquent\Traits\BelongsToThrough

### Community 4 - "AuthenticatedLayout.jsx"
Cohesion: 0.07
Nodes (15): SweetAlert(), Authenticated(), MobileLayout(), EditableRow(), ManPower(), Permantri(), RekapContent(), Content() (+7 more)

### Community 5 - "Illuminate\Http\Request"
Cohesion: 0.10
Nodes (9): TransactionDailyRecapController, TransactionLoanController, App\Models\TransactionLoan, HariKerja, Controller, Illuminate\Http\Request, Staudenmeir\EloquentHasManyDeep\HasRelationships, TransactionDailyClosing (+1 more)

### Community 6 - "NewPasswordController.php"
Cohesion: 0.17
Nodes (6): PasswordResetLinkController, Illuminate\Auth\Events\PasswordReset, Illuminate\Support\Facades\Password, Illuminate\Support\Str, Illuminate\Validation\Rules, Illuminate\Validation\ValidationException

### Community 7 - "AppHelper"
Cohesion: 0.07
Nodes (7): AppHelper, TransactionLoan, App\Models\OnlineBranch, OnlineBranch, PinjamanTrait, Int, User

### Community 8 - "TransactionDailyClosing"
Cohesion: 0.16
Nodes (3): ClosingHarianController, Carbon, TransactionDailyClosing

### Community 9 - "Illuminate\Database\Eloquent\Model"
Cohesion: 0.05
Nodes (25): App\Console\Commands\CountingDailyBalance, CountingDailyBalance, App\Helpers\DaftarMigrasi, Customer, DebtRelief, EmployeeBranch, EmployeeZone, Employment (+17 more)

### Community 10 - "cn"
Cohesion: 0.12
Nodes (24): DatePicker(), cn(), buttonVariants, Calendar(), DrawerContent, DrawerDescription, DrawerFooter(), DrawerHeader() (+16 more)

### Community 11 - "HitungAgregat"
Cohesion: 0.12
Nodes (3): Ember, HitungAgregat, TargetMingguan

### Community 12 - "Employee"
Cohesion: 0.09
Nodes (12): App\Http\Controllers\EmployeeController, EmployeeController, App\Http\Controllers\MantriAppsController, App\Http\Controllers\ProfileController, Employee, GenerateEmpUserSeeder, Illuminate\Contracts\Auth\MustVerifyEmail, Illuminate\Support\Facades\Auth (+4 more)

### Community 13 - "MigrasiController"
Cohesion: 0.18
Nodes (3): AuthScope, MigrasiController, TransactionSaldoAdjustment

### Community 14 - "Illuminate\Database\Seeder"
Cohesion: 0.16
Nodes (9): BalancingDailyReport, BalancingTargetSeeder, ChangeWrongDateGlobalSeeder, EmploymentSeeder, GenerateTotalSeeder, MoveAreaSeeder, PindahTotalResotSeeder, Illuminate\Database\Seeder (+1 more)

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
Cohesion: 0.13
Nodes (3): GembokBulanan, ClosingBulananController, TransactionMonthlyClosing

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
Cohesion: 0.16
Nodes (3): Carbon, TutupBulanan, self

### Community 38 - "LoginRequest"
Cohesion: 0.25
Nodes (4): LoginRequest, ProfileUpdateRequest, Illuminate\Foundation\Http\FormRequest, Illuminate\Validation\Rule

### Community 39 - "Kunci Reset & Hapus berdasarkan approval rekap (daily_kepala_approval)"
Cohesion: 0.22
Nodes (9): Aturan wajib pencatatan perubahan (fungsi, route, tabel), FilterBar (chip filter instan + localStorage), PinjamanTrait::getTransactionLoan(), Konsolidasi halaman Buku Transaksi jadi satu halaman responsif, Kunci Reset & Hapus berdasarkan approval rekap (daily_kepala_approval), SearchComponent (dropdown filter lama, remount via key), ERD Relasi Data & Otorisasi Transaksi, Pemutihan Pinjaman Macet (White-Off) (+1 more)

### Community 40 - "app/Rules/HariKerja.php (satu Rule, tujuh pintu)"
Cohesion: 0.25
Nodes (9): getLastDateForHari() (JS, lib/utils.js), AppHelper::getStortingShowDate() / getNumbDays() (PHP), app/Rules/HariKerja.php (satu Rule, tujuh pintu), Pelajaran: setiap tanggal turunan wajib dicari dan diperiksa, Bug TDZ useHariLibur di atas useForm, useHariLibur (mundurKeHariKerja / majuKeHariKerja), action_buku_transaksi (ACC / Drop / Tolak / Batal), generateUnknownNik / callUnknownNik (+1 more)

### Community 42 - "TransactionDailyRecap"
Cohesion: 0.13
Nodes (6): TransactionDailyRecap, TransactionSirculation, RekapTrait, CompareSeeder, DailySeeder, CompareSeeder

### Community 43 - "TransactionLoanInstalment"
Cohesion: 0.10
Nodes (6): App\Http\Controllers\PindahResortController, PindahResortController, TransactionLoanInstalmentController, TransactionLoanInstalment, GantiMantriSeeder, UpdateManageSeeder

### Community 45 - "TestCase"
Cohesion: 0.22
Nodes (4): Illuminate\Foundation\Testing\TestCase, AuthenticationTest, ExampleTest, TestCase

### Community 46 - "button.jsx"
Cohesion: 0.15
Nodes (14): FilterBar(), SearchComponent(), NAMA_BULAN, Action(), TableRekap(), TableRekapKasir(), TunaiMantri(), TableRencana() (+6 more)

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

### Community 59 - "TransactionCustomer"
Cohesion: 0.15
Nodes (6): TransactionCustomer, BatchInputSeeder, BatchInputV2Seeder, ChangeNasabahGroupingSeeder, NasabahGrs3Seeder, UpdateSeeder

### Community 62 - "Branch"
Cohesion: 0.14
Nodes (8): GenerateClosingRows, MaterialisasiTargetOtomatis, TandaiMigrasi, VerifikasiAgregat, PemeriksaAgregat, Carbon, Branch, Illuminate\Console\Command

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
Cohesion: 0.08
Nodes (6): TransactionLoan, KeubahSeeder, LunasinMLGantung, asdfg, LunasSeeder, DateTimeInterface

### Community 126 - "Kernel"
Cohesion: 0.40
Nodes (3): Kernel, Illuminate\Console\Scheduling\Schedule, Illuminate\Foundation\Console\Kernel

### Community 128 - "App\Http\Controllers\TransactionLoanController"
Cohesion: 0.18
Nodes (17): App\Helpers\AppHelper, App\Helpers\AuthScope, App\Http\Controllers\MobileAppsMantriController, MobileAppsMantriController, App\Http\Controllers\TransactionDailyRecapController, App\Http\Controllers\TransactionLoanController, App\Models\Branch, App\Models\Employee (+9 more)

### Community 129 - "TransactionLoanOfficerGrouping"
Cohesion: 0.12
Nodes (6): TransactionLoanOfficerGrouping, BatchInputAngsuranSeeder, DeleteAngsuranSeeder, LunasinSeeder, SalahPemutihan, SirkulasiSeeder

### Community 134 - "InputError.jsx"
Cohesion: 0.15
Nodes (11): ApplicationLogo(), DangerButton(), InputError(), InputLabel(), PrimaryButton(), SecondaryButton(), Guest(), DeleteAngsuran() (+3 more)

### Community 136 - "NewAngsuran/Components/Action.jsx"
Cohesion: 0.17
Nodes (14): BadgeStatus(), variantMap, BargeStatus(), variantMap, FormatNumbering(), StatusPinjaman(), Action(), LoanDetail() (+6 more)

### Community 137 - "utils.js"
Cohesion: 0.16
Nodes (19): Loading(), AppButton, appButtonVariants, HARI_KE_ANGKA, NAMA_BULAN, NAMA_HARI, TanggalKerja(), simpanan (+11 more)

### Community 138 - "sidebar.jsx"
Cohesion: 0.15
Nodes (13): useIsMobile(), SidebarContext, SidebarGroupAction, SidebarGroupContent, SidebarInput, SidebarInset, SidebarMenuAction, SidebarMenuBadge (+5 more)

### Community 139 - "Carbon\Carbon"
Cohesion: 0.16
Nodes (15): App\Helpers\AgregasiScope, App\Helpers\Ember, App\Helpers\PemeriksaAgregat, App\Helpers\PenyesuaianSaldo, App\Helpers\SerahTerima, App\Helpers\TargetBayangan, App\Helpers\TutupBulanan, App\Http\Controllers\AdminController (+7 more)

### Community 140 - "HandleInertiaRequests.php"
Cohesion: 0.22
Nodes (5): SetBranchController, HandleInertiaRequests, Illuminate\Support\Facades\Session, Inertia\Middleware, Tightenco\Ziggy\Ziggy

### Community 141 - "KalenderKerja"
Cohesion: 0.18
Nodes (3): KalenderKerja, Carbon, KalenderKerjaController

### Community 143 - "AgregasiScope"
Cohesion: 0.24
Nodes (3): AgregasiScope, Carbon, SerahTerima

### Community 145 - "Carbon"
Cohesion: 0.25
Nodes (3): DaftarMigrasi, TargetBayangan, Carbon

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

### Community 154 - "App\Rules\HariKerja"
Cohesion: 0.40
Nodes (4): RedirectIfAuthenticated, App\Rules\HariKerja, Closure, Illuminate\Contracts\Validation\ValidationRule

### Community 155 - "PenyesuaianSaldo.jsx"
Cohesion: 0.60
Nodes (3): KartuPinjaman(), PenyesuaianSaldo(), rupiah()

## Knowledge Gaps
- **50 isolated node(s):** `variantMap`, `variantMap`, `InputOTPSeparator`, `NAMA_HARI`, `HARI_TO_DOW` (+45 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 451 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **37 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `User` connect `User` to `AdminController`, `TransactionManageCustomer`, `Inertia\Response`, `self`, `LoginRequest`, `Illuminate\Database\Eloquent\Model`, `Carbon\Carbon`, `Employee`, `TestCase`, `Illuminate\Foundation\Testing\RefreshDatabase`, `EmailVerificationTest.php`, `ProfileTest`, `PasswordResetTest`, `Branch`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Why does `TransactionLoan` connect `TransactionLoan` to `AdminController`, `TransactionLoanOfficerGrouping`, `.ceklist_kepala`, `TransactionManageCustomer`, `Illuminate\Http\Request`, `Illuminate\Database\Eloquent\Model`, `TransactionDailyRecap`, `Carbon\Carbon`, `TransactionLoanInstalment`, `MigrasiController`, `Illuminate\Database\Seeder`, `Mutasi`, `TransactionCustomer`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Why does `TransactionLoanOfficerGrouping` connect `TransactionLoanOfficerGrouping` to `App\Http\Controllers\TransactionLoanController`, `.ceklist_kepala`, `Illuminate\Http\Request`, `AppHelper`, `TransactionDailyClosing`, `Illuminate\Database\Eloquent\Model`, `TransactionDailyRecap`, `Carbon\Carbon`, `.store`, `TransactionLoanInstalment`, `Illuminate\Database\Seeder`, `Carbon`, `TransactionMonthlyClosing`, `Mutasi`, `.handle`, `TransactionCustomer`, `TransactionLoan`, `Branch`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Are the 26 inferred relationships involving `AppHelper` (e.g. with `.action_buku_transaksi()` and `.bayar_pinjaman()`) actually correct?**
  _`AppHelper` has 26 INFERRED edges - model-reasoned connections that need verification._
- **Are the 21 inferred relationships involving `TransactionLoanOfficerGrouping` (e.g. with `.handle()` and `.bawaKolomManual()`) actually correct?**
  _`TransactionLoanOfficerGrouping` has 21 INFERRED edges - model-reasoned connections that need verification._
- **Are the 9 inferred relationships involving `TransactionLoan` (e.g. with `.simpanPenyesuaian()` and `.cari()`) actually correct?**
  _`TransactionLoan` has 9 INFERRED edges - model-reasoned connections that need verification._
- **What connects `variantMap`, `variantMap`, `InputOTPSeparator` to the rest of the system?**
  _50 weakly-connected nodes found - possible documentation gaps or missing edges._