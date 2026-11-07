# Graph Report - unit-apps  (2026-10-10)

## Corpus Check
- 417 files · ~204,863 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1741 nodes · 4586 edges · 175 communities (74 shown, 57 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 267 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e5a40c71`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- AgregasiScope
- table.jsx
- RegisteredUserController.php
- .handle
- TransactionMonthlyClosing
- Mutasi
- label.jsx
- sidebar.jsx
- TransactionDailyClosing
- AuthenticatedSessionController.php
- AdminPanel/Index.jsx
- Illuminate\Database\Seeder
- Employee
- button.jsx
- Ember
- DeleteLoan.jsx
- HitungAgregat
- User
- BukuTransaksiKepala.jsx
- RBAC Multi-Cabang (rancangan)
- TestCase
- TransactionLoanInstalmentController
- Illuminate\Http\RedirectResponse
- Auto-pelunasan pinjaman lama saat top-up berhasil drop
- CountingBalance.php
- AngsuranTableMobile.jsx
- Ghost permission (nama permission tak ada di tabel permissions)
- VIsBalanceDropWithDailyReport
- app_laravel & unit-apps berbagi database ubmi_db
- Angsuran.jsx
- TransactionDailyRecapController
- transaction_daily_closings (agregat harian)
- AppServiceProvider
- GlobalBranchFilter.jsx
- Penyakit dua sumber kebenaran berebut (hook vs controller)
- Illuminate\Database\Eloquent\Model
- TransactionManageCustomer
- Carbon\Carbon
- cn
- Kunci Reset & Hapus berdasarkan approval rekap (daily_kepala_approval)
- app/Rules/HariKerja.php (satu Rule, tujuh pintu)
- TransactionLoanOfficerGrouping
- App\Models\TransactionMonthlyClosing
- Illuminate\Foundation\Testing\RefreshDatabase
- Loan
- Migrasi/Dashboard.jsx
- KalenderKerjaController
- Illuminate\Http\Request
- Illuminate\Database\Migrations\Migration
- Illuminate\Database\Schema\Blueprint
- Illuminate\Support\Facades\Schema
- Illuminate\Foundation\Application
- PasswordResetTest
- 8 Permission Inti
- Dropdown.jsx
- SerahTerima saldo awal (periksa / tetapkanZ / sahkan)
- Kernel
- graphify — peta hubungan kode
- logging.php
- Handler
- Authenticate
- TrustHosts
- NewAngsuran/Components/Action.jsx
- AuthServiceProvider
- Controller
- ExampleTest
- AppBadge + appBadgeVariants
- Kernel
- EncryptCookies
- PreventRequestsDuringMaintenance
- TrimStrings
- NasabahMacet.jsx
- ValidateSignature
- VerifyCsrfToken
- console.php
- config/app.php
- sanctum.php
- entrypoint.sh
- entrypoint.dev.sh
- Kesiapan.jsx
- CrashAlert.jsx
- PenyesuaianSaldo
- App\Http\Controllers\ProfileController
- Branch
- Controller
- StockTakeMl.jsx
- App\Http\Controllers\LoanController
- Bulanan.jsx
- EmailVerificationTest.php
- TableRekapKasir.jsx
- InputError.jsx
- Illuminate\Support\Collection
- WorkDay
- Carbon
- AuthenticatedLayout.jsx
- MigrasiController
- KalenderKerja
- AuthScope
- .handle
- Carbon
- Illuminate\Database\Eloquent\Factories\Factory
- AppHelper
- CreatesApplication
- TransactionCustomer
- TransactionLoan
- RouteServiceProvider
- EmployeeBranch
- TransactionDailyClosing
- AdminController
- TransactionSaldoAdjustment
- TransactionDailyClosing
- TransactionDailyRecap
- HandleInertiaRequests.php
- Loading.jsx
- TransactionDailyClosing
- PenyesuaianSaldo.jsx
- LoanRequest
- TransactionSaldoAdjustment
- ProfileTest
- LoginRequest
- TrustProxies.php
- TransactionMonthlyClosing
- TransactionLoan
- App\Models\TransactionDailyClosing
- Customer
- BukuStortingMobile.jsx
- Carbon
- AuthenticationTest
- BatchInput/Index.jsx
- StatusPengajuan.jsx
- Carbon

## God Nodes (most connected - your core abstractions)
1. `cn()` - 130 edges
2. `AppHelper` - 86 edges
3. `TransactionLoan` - 78 edges
4. `TransactionLoanOfficerGrouping` - 67 edges
5. `Button` - 66 edges
6. `User` - 45 edges
7. `Branch` - 39 edges
8. `TransactionLoanInstalment` - 37 edges
9. `Table` - 35 edges
10. `TableBody` - 35 edges

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

## Communities (175 total, 57 thin omitted)

### Community 0 - "AgregasiScope"
Cohesion: 0.18
Nodes (3): AgregasiScope, Carbon, TargetBayangan

### Community 1 - "table.jsx"
Cohesion: 0.15
Nodes (19): BadgeStatus(), variantMap, BargeStatus(), variantMap, FormatNumbering(), rupiah(), TargetBayangan(), ApprovalAkhir() (+11 more)

### Community 2 - "RegisteredUserController.php"
Cohesion: 0.20
Nodes (8): NewPasswordController, RegisteredUserController, Illuminate\Auth\Events\PasswordReset, Illuminate\Support\Facades\Auth, Illuminate\Support\Facades\Password, Illuminate\Validation\Rules, Illuminate\Validation\ValidationException, Inertia\Response

### Community 5 - "Mutasi"
Cohesion: 0.15
Nodes (5): Mutasi, MutasiNasabahController, App\Models\TransactionLoanMutation, TransactionLoanMutation, TransactionLoanMutation

### Community 6 - "label.jsx"
Cohesion: 0.12
Nodes (21): HARI_OPTIONS, KELOMPOK_OPTIONS, NAMA_BULAN, NAMA_HARI_PANJANG, HARI_KE_ANGKA, NAMA_BULAN, NAMA_HARI, TanggalKerja() (+13 more)

### Community 7 - "sidebar.jsx"
Cohesion: 0.12
Nodes (28): data, useIsMobile(), Separator, Sidebar, SidebarContent, SidebarContext, SidebarFooter, SidebarGroup (+20 more)

### Community 9 - "AuthenticatedSessionController.php"
Cohesion: 0.15
Nodes (8): AuthenticatedSessionController, App\Http\Requests\Auth\LoginRequest, App\Providers\RouteServiceProvider, Illuminate\Auth\Events\Lockout, Illuminate\Cache\RateLimiting\Limit, Illuminate\Support\Facades\RateLimiter, Illuminate\Support\Facades\Route, Illuminate\Support\Str

### Community 10 - "AdminPanel/Index.jsx"
Cohesion: 0.28
Nodes (12): AssignRoles(), MaintenerWorker(), Permission(), Role(), RemoveLoan(), RiwayatPengajuan(), Card, CardContent (+4 more)

### Community 11 - "Illuminate\Database\Seeder"
Cohesion: 0.06
Nodes (21): TransactionLoanInstalment, BalancingTargetSeeder, BatchInputAngsuranSeeder, CompareSeeder, DailySeeder, EmploymentSeeder, GantiMantriSeeder, CompareSeeder (+13 more)

### Community 12 - "Employee"
Cohesion: 0.14
Nodes (3): EmployeeController, Employee, GenerateEmpUserSeeder

### Community 13 - "button.jsx"
Cohesion: 0.12
Nodes (14): SearchComponent(), SelectList(), useOptionGenerator(), MutasiNasabah(), rupiah(), FastCreateV2(), InputMacet(), TableRencana() (+6 more)

### Community 15 - "DeleteLoan.jsx"
Cohesion: 0.18
Nodes (7): DangerButton(), Modal(), SecondaryButton(), MobileLayout(), DeleteUserForm(), UpdatePasswordForm(), UpdateProfileInformation()

### Community 16 - "HitungAgregat"
Cohesion: 0.14
Nodes (4): HitungAgregat, PemeriksaanMigrasi, TargetMingguan, Carbon

### Community 17 - "User"
Cohesion: 0.17
Nodes (9): App\Models\User, User, BelongsToThrough, Illuminate\Foundation\Auth\User, Illuminate\Notifications\Notifiable, Laravel\Sanctum\HasApiTokens, Spatie\Permission\Traits\HasPermissions, Spatie\Permission\Traits\HasRoles (+1 more)

### Community 18 - "BukuTransaksiKepala.jsx"
Cohesion: 0.23
Nodes (10): AppBadge, appBadgeVariants, VARIAN_JENIS, VARIAN_STATUS, varianJenis(), varianStatus(), Action(), BukuTransaksiKepala() (+2 more)

### Community 19 - "RBAC Multi-Cabang (rancangan)"
Cohesion: 0.14
Nodes (18): AuthScope::resolve(), employee_branches (pivot delegasi multi-cabang), employee_zones (pivot multi-zona staf kontrol), Global Branch Scope Flow, Modul F — Panel Admin & Multi-Cabang/Multi-Zona RBAC, SetBranchController (POST /set-branch), AuthScope (helper scope terpusat, rancangan), employment_permissions (mekanisme multi-cabang lama, DEPRECATED) (+10 more)

### Community 20 - "TestCase"
Cohesion: 0.22
Nodes (4): Illuminate\Foundation\Testing\TestCase, PasswordConfirmationTest, ExampleTest, TestCase

### Community 22 - "Illuminate\Http\RedirectResponse"
Cohesion: 0.21
Nodes (5): ConfirmablePasswordController, EmailVerificationNotificationController, EmailVerificationPromptController, PasswordResetLinkController, Illuminate\Http\RedirectResponse

### Community 23 - "Auto-pelunasan pinjaman lama saat top-up berhasil drop"
Cohesion: 0.16
Nodes (14): Auto-pelunasan pinjaman lama saat top-up berhasil drop, AppHelper::canDeleteLoan(), TransactionLoanController::checkpengajuan(), AppHelper::havePermissionByDate() dan bug E1, NoEditOverlay (pola overlay lama, ditinggalkan), Pola gerbang: kontrol tetap tampil, disabled + keterangan, transaction_loans.postponed_loan_id (Tundaan), transaction_loans.previous_loan_id (top-up / refinance) (+6 more)

### Community 24 - "CountingBalance.php"
Cohesion: 0.33
Nodes (7): CountingBalance, CountingCirculation, Illuminate\Bus\Queueable, Illuminate\Contracts\Queue\ShouldQueue, Illuminate\Foundation\Bus\Dispatchable, Illuminate\Queue\InteractsWithQueue, Illuminate\Queue\SerializesModels

### Community 25 - "AngsuranTableMobile.jsx"
Cohesion: 0.12
Nodes (25): NAMA_HARI, GenerateUser(), Anomali(), ModalMigrasi(), Pratinjau(), rp(), tautan(), tgl() (+17 more)

### Community 26 - "Ghost permission (nama permission tak ada di tabel permissions)"
Cohesion: 0.15
Nodes (13): HandleInertiaRequests::share() prop global auth.roles, AuthScope::resolve() (dipakai memperbaiki getLoanMacet), BatchInputController dibatasi superuser (pastikanSuperuser), PinjamanTrait::getLoanMacet() / getLoanByDate(), Ghost permission (nama permission tak ada di tabel permissions), InputMacet.jsx + store_buku_transaksi_batch (jalur nasabah lama), Kuota ML sebagai PALANG, bukan perbandingan berulang, Alias middleware role: tidak terdaftar di Kernel (+5 more)

### Community 27 - "VIsBalanceDropWithDailyReport"
Cohesion: 0.31
Nodes (6): App\Console\Commands\CountingDailyBalance, CountingDailyBalance, VIsBalanceDropWithDailyReport, App\Models\VIsBalanceLoanWithDailyReport, VIsBalanceLoanWithDailyReport, BalancingDailyReport

### Community 28 - "app_laravel & unit-apps berbagi database ubmi_db"
Cohesion: 0.23
Nodes (12): Jangan jalankan php artisan test (phpunit menghantam ubmi_db produksi), Aturan single source of truth: migrasi wajib dari app_laravel, app_laravel_laravel-network (external shared network), unit-app-service (PHP-FPM container), unit-vite (Node 20 dev server, port 5174), unit-web (nginx, port 8080), Urutan Eksekusi 4 Fase yang Backward-Compatible, Asumsi lama: 1 karyawan = 1 cabang (+4 more)

### Community 29 - "Angsuran.jsx"
Cohesion: 0.12
Nodes (20): PengajuanLink, useMuatDrawer(), Angka(), Approval(), rp(), DrawerAngsuran(), NAMA_BULAN, DrawerBukuAngsuran() (+12 more)

### Community 31 - "transaction_daily_closings (agregat harian)"
Cohesion: 0.22
Nodes (11): Ember (6 ember penyimpanan, 4 kategori tampilan), Gembok harian ditegakkan lewat trigger DB, AppHelper::generateStatusAngsuran() (4 nilai, alur lama), Generated column STORED (bukan VIRTUAL) & keluar dari $fillable, HitungAgregat (mesin penghitung agregat harian), Hook rekap otomatis dicabut dari model, transaction_loans.pinjaman adalah generated column (nominal_drop * 1.3), transaction_daily_closings (agregat harian) (+3 more)

### Community 32 - "AppServiceProvider"
Cohesion: 0.24
Nodes (5): AppServiceProvider, BroadcastServiceProvider, Illuminate\Routing\UrlGenerator, Illuminate\Support\Facades\Broadcast, Illuminate\Support\ServiceProvider

### Community 33 - "GlobalBranchFilter.jsx"
Cohesion: 0.20
Nodes (10): GlobalBranchFilter(), Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator (+2 more)

### Community 34 - "Penyakit dua sumber kebenaran berebut (hook vs controller)"
Cohesion: 0.27
Nodes (10): Rancangan agregasi rekap v2, AgregasiScope (gerbang pemilih agregasi lama vs baru), TransactionDailyRecapController@ceklist_kepala (penulis rekap tunggal), Penyakit dua sumber kebenaran berebut (hook vs controller), Grain per (grouping, hari), bukan per mantri, WorkDay::tanggalRekapBulan() (hari kerja + tanggal berdata), WorkDay / work_days (kalender kerja nasional), ceklist_kepala (Approval Rekap oleh Pimpinan) (+2 more)

### Community 35 - "Illuminate\Database\Eloquent\Model"
Cohesion: 0.14
Nodes (13): DebtRelief, Employment, App\Models\EmploymentPermission, EmploymentPermission, Instalment, TransactionBranchDailyRecap, App\Models\TransactionLockHistory, TransactionLockHistory (+5 more)

### Community 36 - "TransactionManageCustomer"
Cohesion: 0.15
Nodes (5): SiklusRekening, App\Models\TransactionManageCustomer, TransactionManageCustomer, App\Models\TransactionSiklus, TransactionSiklus

### Community 37 - "Carbon\Carbon"
Cohesion: 0.12
Nodes (36): App\Helpers\AgregasiScope, App\Helpers\AppHelper, App\Helpers\DaftarMigrasi, App\Helpers\Ember, App\Helpers\Gembok, App\Helpers\SerahTerima, App\Helpers\TargetBayangan, App\Helpers\TutupBulanan (+28 more)

### Community 38 - "cn"
Cohesion: 0.08
Nodes (38): AppButton, appButtonVariants, DatePicker(), cn(), HARI_TO_DOW, buttonVariants, Calendar(), DrawerContent (+30 more)

### Community 39 - "Kunci Reset & Hapus berdasarkan approval rekap (daily_kepala_approval)"
Cohesion: 0.22
Nodes (9): Aturan wajib pencatatan perubahan (fungsi, route, tabel), FilterBar (chip filter instan + localStorage), PinjamanTrait::getTransactionLoan(), Konsolidasi halaman Buku Transaksi jadi satu halaman responsif, Kunci Reset & Hapus berdasarkan approval rekap (daily_kepala_approval), SearchComponent (dropdown filter lama, remount via key), ERD Relasi Data & Otorisasi Transaksi, Pemutihan Pinjaman Macet (White-Off) (+1 more)

### Community 40 - "app/Rules/HariKerja.php (satu Rule, tujuh pintu)"
Cohesion: 0.25
Nodes (9): getLastDateForHari() (JS, lib/utils.js), AppHelper::getStortingShowDate() / getNumbDays() (PHP), app/Rules/HariKerja.php (satu Rule, tujuh pintu), Pelajaran: setiap tanggal turunan wajib dicari dan diperiksa, Bug TDZ useHariLibur di atas useForm, useHariLibur (mundurKeHariKerja / majuKeHariKerja), action_buku_transaksi (ACC / Drop / Tolak / Batal), generateUnknownNik / callUnknownNik (+1 more)

### Community 41 - "TransactionLoanOfficerGrouping"
Cohesion: 0.09
Nodes (10): DaftarMigrasi, Carbon, App\Models\OnlineBranch, OnlineBranch, TransactionLoanOfficerGrouping, TransactionSirculation, PinjamanTrait, RekapTrait (+2 more)

### Community 42 - "App\Models\TransactionMonthlyClosing"
Cohesion: 0.14
Nodes (8): App\Helpers\GembokBulanan, GembokBulanan, Carbon, TransactionMonthlyClosing, TutupBulanan, ClosingBulananController, App\Models\TransactionMonthlyClosing, TransactionMonthlyClosing

### Community 43 - "Illuminate\Foundation\Testing\RefreshDatabase"
Cohesion: 0.28
Nodes (3): Illuminate\Foundation\Testing\RefreshDatabase, PasswordUpdateTest, RegistrationTest

### Community 45 - "Migrasi/Dashboard.jsx"
Cohesion: 0.30
Nodes (8): Dashboard(), LENCANA, rp(), statusKantor(), tgl(), AccordionContent, AccordionItem, AccordionTrigger

### Community 47 - "Illuminate\Http\Request"
Cohesion: 0.15
Nodes (3): TransactionLoanController, Illuminate\Http\Request, TransactionLoan

### Community 52 - "PasswordResetTest"
Cohesion: 0.25
Nodes (3): Illuminate\Auth\Notifications\ResetPassword, Illuminate\Support\Facades\Notification, PasswordResetTest

### Community 53 - "8 Permission Inti"
Cohesion: 0.33
Nodes (6): 8 Permission Inti, Modul E — Administrasi Karyawan (Manpower), Matriks Otorisasi Berdasarkan Jabatan, Pemetaan 7 Role Baru, Desain permission inti baru (17 → 6/8), Prinsip: jabatan menentukan kemampuan, delegasi cabang menentukan jangkauan

### Community 55 - "SerahTerima saldo awal (periksa / tetapkanZ / sahkan)"
Cohesion: 0.50
Nodes (5): Cutover kantor percontohan Karawang 2, branches.mulai_pendataan_baru (batas migrasi per kantor), SerahTerima saldo awal (periksa / tetapkanZ / sahkan), transaction_monthly_closings (agregat bulanan), TutupBulanan::rakit() / kelengkapan()

### Community 56 - "Kernel"
Cohesion: 0.40
Nodes (3): Kernel, Illuminate\Console\Scheduling\Schedule, Illuminate\Foundation\Console\Kernel

### Community 57 - "graphify — peta hubungan kode"
Cohesion: 0.22
Nodes (8): Aturan yang tidak boleh dilanggar, Graf menunjuk, bukan membuktikan, graphify — peta hubungan kode, Menjaganya tetap segar, Pakai yang sempit, jangan yang luas, unit-apps, Untuk apa dia benar-benar dipakai, Yang belum ada di graf

### Community 58 - "logging.php"
Cohesion: 0.40
Nodes (4): Monolog\Formatter\JsonFormatter, Monolog\Handler\NullHandler, Monolog\Handler\StreamHandler, Monolog\Handler\SyslogUdpHandler

### Community 59 - "Handler"
Cohesion: 0.33
Nodes (3): Handler, Illuminate\Foundation\Exceptions\Handler, Throwable

### Community 62 - "NewAngsuran/Components/Action.jsx"
Cohesion: 0.12
Nodes (15): Action(), kategoriEmber(), LoanDetail(), namaPendek(), rincianPerBulan(), tanggal(), WARNA_EMBER, AngsuranTable() (+7 more)

### Community 64 - "Controller"
Cohesion: 0.23
Nodes (10): PasswordController, App\Http\Controllers\Controller, Controller, MantriAppsController, Illuminate\Foundation\Auth\Access\AuthorizesRequests, Illuminate\Foundation\Bus\DispatchesJobs, Illuminate\Foundation\Validation\ValidatesRequests, Illuminate\Routing\Controller (+2 more)

### Community 67 - "AppBadge + appBadgeVariants"
Cohesion: 0.67
Nodes (3): AppBadge + appBadgeVariants, AppButton + appButtonVariants, statusVariants.js (VARIAN_STATUS / varianStatus)

### Community 72 - "NasabahMacet.jsx"
Cohesion: 0.47
Nodes (4): HARI, Kartu(), NasabahMacet(), rp()

### Community 122 - "Kesiapan.jsx"
Cohesion: 0.38
Nodes (5): Angka(), GRUP, HARI, Kesiapan(), rp()

### Community 124 - "PenyesuaianSaldo"
Cohesion: 0.26
Nodes (4): CekPelunasan, TransactionLoan, PenyesuaianSaldo, TransactionSaldoAdjustment

### Community 125 - "App\Http\Controllers\ProfileController"
Cohesion: 0.20
Nodes (7): App\Http\Controllers\ProfileController, ProfileController, ProfileUpdateRequest, Illuminate\Contracts\Auth\MustVerifyEmail, Illuminate\Foundation\Http\FormRequest, Illuminate\Support\Facades\Redirect, Illuminate\Validation\Rule

### Community 126 - "Branch"
Cohesion: 0.12
Nodes (10): CekSaldo, GenerateClosingRows, MaterialisasiTargetOtomatis, TandaiMigrasi, VerifikasiAgregat, App\Helpers\PemeriksaAgregat, PemeriksaAgregat, Carbon (+2 more)

### Community 128 - "Controller"
Cohesion: 0.22
Nodes (4): BatchInputController, PindahResortController, SetBranchController, Controller

### Community 129 - "StockTakeMl.jsx"
Cohesion: 0.40
Nodes (3): rupiah(), STATUS, StockTakeMl()

### Community 132 - "EmailVerificationTest.php"
Cohesion: 0.20
Nodes (6): EventServiceProvider, Illuminate\Auth\Events\Registered, Illuminate\Auth\Listeners\SendEmailVerificationNotification, Illuminate\Foundation\Support\Providers\EventServiceProvider, Illuminate\Support\Facades\Event, Illuminate\Support\Facades\URL

### Community 133 - "TableRekapKasir.jsx"
Cohesion: 0.18
Nodes (8): BAWAAN, GRUP, KOLOM, KOLOM_ISI, ribu, ribuBertanda, WARNA, WARNA_KOLOM

### Community 134 - "InputError.jsx"
Cohesion: 0.21
Nodes (6): ApplicationLogo(), Checkbox(), InputError(), InputLabel(), PrimaryButton(), Guest()

### Community 136 - "WorkDay"
Cohesion: 0.13
Nodes (8): RedirectIfAuthenticated, Carbon, WorkDay, App\Rules\HariKerja, HariKerja, Carbon, Closure, Illuminate\Contracts\Validation\ValidationRule

### Community 138 - "AuthenticatedLayout.jsx"
Cohesion: 0.06
Nodes (16): Authenticated(), sidebarTerbuka(), ManPower(), TableRekapKasir(), Permantri(), RekapContent(), Content(), Kelompok() (+8 more)

### Community 139 - "MigrasiController"
Cohesion: 0.16
Nodes (4): MigrasiController, Carbon, TransactionSaldoAdjustment, Collection

### Community 144 - "Illuminate\Database\Eloquent\Factories\Factory"
Cohesion: 0.24
Nodes (4): TransactionCustomerFactory, TransactionManageCustomerFactory, UserFactory, Illuminate\Database\Eloquent\Factories\Factory

### Community 145 - "AppHelper"
Cohesion: 0.07
Nodes (5): AppHelper, TransactionLoan, Int, TransactionLoanOfficerGrouping, User

### Community 147 - "TransactionCustomer"
Cohesion: 0.14
Nodes (6): TransactionCustomer, BatchInputSeeder, BatchInputV2Seeder, ChangeNasabahGroupingSeeder, NasabahGrs3Seeder, UpdateSeeder

### Community 148 - "TransactionLoan"
Cohesion: 0.08
Nodes (5): KeluarTarget, TransactionLoan, GenerateTotalSeeder, DateTimeInterface, self

### Community 149 - "RouteServiceProvider"
Cohesion: 0.24
Nodes (5): VerifyEmailController, RouteServiceProvider, Illuminate\Auth\Events\Verified, Illuminate\Foundation\Auth\EmailVerificationRequest, Illuminate\Foundation\Support\Providers\RouteServiceProvider

### Community 155 - "TransactionDailyRecap"
Cohesion: 0.29
Nodes (3): App\Models\TransactionDailyRecap, TransactionDailyRecap, Znck\Eloquent\Traits\BelongsToThrough

### Community 156 - "HandleInertiaRequests.php"
Cohesion: 0.40
Nodes (3): HandleInertiaRequests, Inertia\Middleware, Tightenco\Ziggy\Ziggy

### Community 157 - "Loading.jsx"
Cohesion: 0.43
Nodes (3): Loading(), SelectList(), ReStatus()

### Community 159 - "PenyesuaianSaldo.jsx"
Cohesion: 0.60
Nodes (3): KartuPinjaman(), PenyesuaianSaldo(), rupiah()

### Community 167 - "App\Models\TransactionDailyClosing"
Cohesion: 0.40
Nodes (3): ClosingHarianController, App\Models\TransactionDailyClosing, TransactionDailyClosing

### Community 169 - "BukuStortingMobile.jsx"
Cohesion: 0.60
Nodes (4): BukuStortingMobile(), jumlah(), rb(), ribuan

## Knowledge Gaps
- **70 isolated node(s):** `LENCANA`, `variantMap`, `variantMap`, `GRUP`, `HARI` (+65 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 501 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **57 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `User` connect `User` to `RegisteredUserController.php`, `Illuminate\Database\Eloquent\Model`, `EmailVerificationTest.php`, `ProfileTest`, `AuthenticationTest`, `Employee`, `Illuminate\Foundation\Testing\RefreshDatabase`, `TransactionLoan`, `TestCase`, `PasswordResetTest`, `AdminController`, `TransactionDailyRecap`, `App\Http\Controllers\ProfileController`, `Branch`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Why does `TransactionLoan` connect `TransactionLoan` to `Controller`, `Illuminate\Database\Eloquent\Model`, `Carbon\Carbon`, `Mutasi`, `App\Models\TransactionDailyClosing`, `TransactionLoanOfficerGrouping`, `Illuminate\Database\Seeder`, `TransactionCustomer`, `AdminController`, `TransactionDailyRecap`, `TransactionDailyRecapController`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Why does `AppHelper` connect `AppHelper` to `Controller`, `Carbon\Carbon`, `App\Models\TransactionDailyClosing`, `WorkDay`, `TransactionLoanOfficerGrouping`, `App\Models\TransactionMonthlyClosing`, `Illuminate\Database\Seeder`, `Employee`, `TransactionDailyRecap`, `Illuminate\Http\Request`, `TransactionCustomer`, `TransactionLoan`, `AdminController`, `Handler`, `TransactionDailyRecapController`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Are the 34 inferred relationships involving `AppHelper` (e.g. with `.loan_balancing()` and `.monitoring_staff()`) actually correct?**
  _`AppHelper` has 34 INFERRED edges - model-reasoned connections that need verification._
- **Are the 15 inferred relationships involving `TransactionLoan` (e.g. with `.loan_balancing()` and `.monitoring_staff()`) actually correct?**
  _`TransactionLoan` has 15 INFERRED edges - model-reasoned connections that need verification._
- **What connects `LENCANA`, `variantMap`, `variantMap` to the rest of the system?**
  _70 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Mutasi` be split into smaller, more focused modules?**
  _Cohesion score 0.14736842105263157 - nodes in this community are weakly interconnected._