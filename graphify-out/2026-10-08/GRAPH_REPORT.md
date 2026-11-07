# Graph Report - unit-apps  (2026-10-06)

## Corpus Check
- 413 files · ~201,265 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1703 nodes · 4562 edges · 162 communities (75 shown, 43 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 259 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `aeb08d46`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- TransactionMonthlyClosing
- table.jsx
- Controller
- TransactionManageCustomer
- TestCase
- TransactionLockHistory
- AdminPanel/Index.jsx
- DaftarMigrasi
- App\Models\TransactionDailyClosing
- TransactionCustomer
- GlobalBranchFilter.jsx
- HitungAgregat
- Employee
- MigrasiController
- button.jsx
- EmailVerificationTest.php
- Loading.jsx
- User
- AuthenticatedLayout.jsx
- RBAC Multi-Cabang (rancangan)
- BukuTransaksiKepala.jsx
- TransactionLoanOfficerGrouping
- App\Http\Requests\Auth\LoginRequest
- Auto-pelunasan pinjaman lama saat top-up berhasil drop
- CountingBalance.php
- InputMacet.jsx
- Ghost permission (nama permission tak ada di tabel permissions)
- Illuminate\Foundation\Testing\RefreshDatabase
- app_laravel & unit-apps berbagi database ubmi_db
- Approval.jsx
- Mutasi
- transaction_daily_closings (agregat harian)
- AppServiceProvider
- utils.js
- Penyakit dua sumber kebenaran berebut (hook vs controller)
- Illuminate\Database\Eloquent\Model
- Inertia\Inertia
- NewAngsuran/Components/Action.jsx
- sidebar.jsx
- Kunci Reset & Hapus berdasarkan approval rekap (daily_kepala_approval)
- app/Rules/HariKerja.php (satu Rule, tujuh pintu)
- TransactionLoan
- AgregasiScope
- TransactionDailyRecap
- TransactionLoanInstalment
- AngsuranTable.jsx
- Loan
- Illuminate\Http\Request
- Illuminate\Database\Migrations\Migration
- Illuminate\Database\Schema\Blueprint
- Illuminate\Support\Facades\Schema
- Illuminate\Foundation\Application
- KesiapanClosing.jsx
- 8 Permission Inti
- Dropdown.jsx
- SerahTerima saldo awal (periksa / tetapkanZ / sahkan)
- Handler
- graphify — peta hubungan kode
- logging.php
- TargetBayangan.jsx
- Authenticate
- TrustHosts
- PasswordResetTest
- AuthServiceProvider
- TrustProxies.php
- ExampleTest
- AppBadge + appBadgeVariants
- Kernel
- EncryptCookies
- PreventRequestsDuringMaintenance
- TrimStrings
- Kernel
- ValidateSignature
- VerifyCsrfToken
- console.php
- config/app.php
- sanctum.php
- entrypoint.sh
- entrypoint.dev.sh
- TransactionSaldoAdjustment
- CrashAlert.jsx
- BargeStatus.jsx
- Carbon\Carbon
- NasabahMacet.jsx
- HariKerja
- StockTakeMl.jsx
- App\Http\Controllers\LoanController
- AuthScope
- .handle
- Branch
- InputError.jsx
- Illuminate\Support\Collection
- PenyesuaianSaldo.jsx
- SerahTerima.jsx
- cn
- Dashboard
- ApprovalAkhir.jsx
- TransactionDailyClosing
- Kesiapan.jsx
- Carbon
- Illuminate\Database\Eloquent\Factories\Factory
- AppHelper
- AdminController
- WorkDay
- .store
- BukuStortingMobile.jsx
- BukuTransaksi/Action.jsx
- KalenderKerjaController
- Harian.jsx
- TransactionSaldoAdjustment
- PasswordConfirmationTest
- CreatesApplication
- HandleInertiaRequests.php
- App\Models\TransactionLoan
- GenerateClosingRows
- AppButton.jsx
- TransactionLoan
- TransactionLoan

## God Nodes (most connected - your core abstractions)
1. `cn()` - 130 edges
2. `TransactionLoan` - 77 edges
3. `AppHelper` - 75 edges
4. `TransactionLoanOfficerGrouping` - 68 edges
5. `Button` - 68 edges
6. `User` - 45 edges
7. `Branch` - 41 edges
8. `TransactionLoanInstalment` - 37 edges
9. `Table` - 37 edges
10. `TableBody` - 37 edges

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

## Communities (162 total, 43 thin omitted)

### Community 0 - "TransactionMonthlyClosing"
Cohesion: 0.11
Nodes (5): GembokBulanan, ClosingBulananController, TransactionMonthlyClosing, App\Models\TransactionMonthlyClosing, TransactionMonthlyClosing

### Community 1 - "table.jsx"
Cohesion: 0.17
Nodes (17): BadgeStatus(), FormatNumbering(), MutasiNasabah(), rupiah(), Baris(), rupiah(), LENCANA, RiwayatPengajuan() (+9 more)

### Community 2 - "Controller"
Cohesion: 0.07
Nodes (34): AuthenticatedSessionController, ConfirmablePasswordController, EmailVerificationNotificationController, EmailVerificationPromptController, NewPasswordController, PasswordController, PasswordResetLinkController, RegisteredUserController (+26 more)

### Community 3 - "TransactionManageCustomer"
Cohesion: 0.15
Nodes (5): SiklusRekening, App\Models\TransactionManageCustomer, TransactionManageCustomer, App\Models\TransactionSiklus, TransactionSiklus

### Community 4 - "TestCase"
Cohesion: 0.22
Nodes (4): Illuminate\Foundation\Testing\TestCase, AuthenticationTest, ExampleTest, TestCase

### Community 5 - "TransactionLockHistory"
Cohesion: 0.22
Nodes (3): Carbon, TransactionMonthlyClosing, TransactionLockHistory

### Community 6 - "AdminPanel/Index.jsx"
Cohesion: 0.29
Nodes (13): AssignRoles(), MaintenerWorker(), Permission(), Role(), Card, CardContent, CardDescription, CardFooter (+5 more)

### Community 8 - "App\Models\TransactionDailyClosing"
Cohesion: 0.18
Nodes (6): App\Helpers\Gembok, Gembok, ClosingHarianController, Carbon, App\Models\TransactionDailyClosing, TransactionDailyClosing

### Community 9 - "TransactionCustomer"
Cohesion: 0.10
Nodes (11): App\Http\Controllers\MantriAppsController, Customer, TransactionCustomer, BatchInputSeeder, BatchInputV2Seeder, ChangeNasabahGroupingSeeder, KeubahSeeder, NasabahGrs3Seeder (+3 more)

### Community 10 - "GlobalBranchFilter.jsx"
Cohesion: 0.20
Nodes (10): GlobalBranchFilter(), Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator (+2 more)

### Community 12 - "Employee"
Cohesion: 0.14
Nodes (4): EmployeeController, Employee, GenerateEmpUserSeeder, Illuminate\Support\Facades\Hash

### Community 13 - "MigrasiController"
Cohesion: 0.17
Nodes (5): TargetBayangan, MigrasiController, Carbon, TransactionSaldoAdjustment, Collection

### Community 14 - "button.jsx"
Cohesion: 0.10
Nodes (7): SelectList(), useOptionGenerator(), FastCreateV2(), InputMacet(), AngsuranByDate(), NewNasabah(), Button

### Community 15 - "EmailVerificationTest.php"
Cohesion: 0.13
Nodes (8): EventServiceProvider, Illuminate\Auth\Events\Registered, Illuminate\Auth\Events\Verified, Illuminate\Auth\Listeners\SendEmailVerificationNotification, Illuminate\Foundation\Support\Providers\EventServiceProvider, Illuminate\Support\Facades\Event, Illuminate\Support\Facades\URL, EmailVerificationTest

### Community 16 - "Loading.jsx"
Cohesion: 0.15
Nodes (17): HARI_OPTIONS, KELOMPOK_OPTIONS, NAMA_BULAN, NAMA_HARI_PANJANG, Loading(), HARI_KE_ANGKA, NAMA_BULAN, NAMA_HARI (+9 more)

### Community 17 - "User"
Cohesion: 0.17
Nodes (10): App\Models\User, User, BelongsToThrough, Illuminate\Foundation\Auth\User, Illuminate\Notifications\Notifiable, Laravel\Sanctum\HasApiTokens, Spatie\Permission\Traits\HasPermissions, Spatie\Permission\Traits\HasRoles (+2 more)

### Community 18 - "AuthenticatedLayout.jsx"
Cohesion: 0.08
Nodes (11): Authenticated(), sidebarTerbuka(), MobileLayout(), EditableRow(), Permantri(), RekapContent(), Content(), STATUS (+3 more)

### Community 19 - "RBAC Multi-Cabang (rancangan)"
Cohesion: 0.14
Nodes (18): AuthScope::resolve(), employee_branches (pivot delegasi multi-cabang), employee_zones (pivot multi-zona staf kontrol), Global Branch Scope Flow, Modul F — Panel Admin & Multi-Cabang/Multi-Zona RBAC, SetBranchController (POST /set-branch), AuthScope (helper scope terpusat, rancangan), employment_permissions (mekanisme multi-cabang lama, DEPRECATED) (+10 more)

### Community 20 - "BukuTransaksiKepala.jsx"
Cohesion: 0.23
Nodes (10): AppBadge, appBadgeVariants, VARIAN_JENIS, VARIAN_STATUS, varianJenis(), varianStatus(), Action(), BukuTransaksiKepala() (+2 more)

### Community 21 - "TransactionLoanOfficerGrouping"
Cohesion: 0.08
Nodes (17): TransactionLoanOfficerGrouping, BatchInputAngsuranSeeder, DeleteAngsuranSeeder, EmploymentSeeder, GantiMantriSeeder, CompareSeeder, LunasinMLGantung, LunasinSeeder (+9 more)

### Community 22 - "App\Http\Requests\Auth\LoginRequest"
Cohesion: 0.13
Nodes (8): App\Http\Requests\Auth\LoginRequest, LoginRequest, ProfileUpdateRequest, Illuminate\Auth\Events\Lockout, Illuminate\Foundation\Http\FormRequest, Illuminate\Support\Facades\RateLimiter, Illuminate\Support\Str, Illuminate\Validation\Rule

### Community 23 - "Auto-pelunasan pinjaman lama saat top-up berhasil drop"
Cohesion: 0.16
Nodes (14): Auto-pelunasan pinjaman lama saat top-up berhasil drop, AppHelper::canDeleteLoan(), TransactionLoanController::checkpengajuan(), AppHelper::havePermissionByDate() dan bug E1, NoEditOverlay (pola overlay lama, ditinggalkan), Pola gerbang: kontrol tetap tampil, disabled + keterangan, transaction_loans.postponed_loan_id (Tundaan), transaction_loans.previous_loan_id (top-up / refinance) (+6 more)

### Community 24 - "CountingBalance.php"
Cohesion: 0.30
Nodes (7): CountingBalance, CountingCirculation, Illuminate\Bus\Queueable, Illuminate\Contracts\Queue\ShouldQueue, Illuminate\Foundation\Bus\Dispatchable, Illuminate\Queue\InteractsWithQueue, Illuminate\Queue\SerializesModels

### Community 25 - "InputMacet.jsx"
Cohesion: 0.13
Nodes (23): NAMA_HARI, KunciKasir(), Anomali(), ModalMigrasi(), Pratinjau(), rp(), tautan(), tgl() (+15 more)

### Community 26 - "Ghost permission (nama permission tak ada di tabel permissions)"
Cohesion: 0.15
Nodes (13): HandleInertiaRequests::share() prop global auth.roles, AuthScope::resolve() (dipakai memperbaiki getLoanMacet), BatchInputController dibatasi superuser (pastikanSuperuser), PinjamanTrait::getLoanMacet() / getLoanByDate(), Ghost permission (nama permission tak ada di tabel permissions), InputMacet.jsx + store_buku_transaksi_batch (jalur nasabah lama), Kuota ML sebagai PALANG, bukan perbandingan berulang, Alias middleware role: tidak terdaftar di Kernel (+5 more)

### Community 27 - "Illuminate\Foundation\Testing\RefreshDatabase"
Cohesion: 0.28
Nodes (3): Illuminate\Foundation\Testing\RefreshDatabase, PasswordUpdateTest, RegistrationTest

### Community 28 - "app_laravel & unit-apps berbagi database ubmi_db"
Cohesion: 0.23
Nodes (12): Jangan jalankan php artisan test (phpunit menghantam ubmi_db produksi), Aturan single source of truth: migrasi wajib dari app_laravel, app_laravel_laravel-network (external shared network), unit-app-service (PHP-FPM container), unit-vite (Node 20 dev server, port 5174), unit-web (nginx, port 8080), Urutan Eksekusi 4 Fase yang Backward-Compatible, Asumsi lama: 1 karyawan = 1 cabang (+4 more)

### Community 29 - "Approval.jsx"
Cohesion: 0.20
Nodes (11): PengajuanLink, Angka(), Approval(), rp(), SheetContent, SheetDescription, SheetFooter(), SheetHeader() (+3 more)

### Community 30 - "Mutasi"
Cohesion: 0.15
Nodes (5): Mutasi, MutasiNasabahController, App\Models\TransactionLoanMutation, TransactionLoanMutation, TransactionLoanMutation

### Community 31 - "transaction_daily_closings (agregat harian)"
Cohesion: 0.22
Nodes (11): Ember (6 ember penyimpanan, 4 kategori tampilan), Gembok harian ditegakkan lewat trigger DB, AppHelper::generateStatusAngsuran() (4 nilai, alur lama), Generated column STORED (bukan VIRTUAL) & keluar dari $fillable, HitungAgregat (mesin penghitung agregat harian), Hook rekap otomatis dicabut dari model, transaction_loans.pinjaman adalah generated column (nominal_drop * 1.3), transaction_daily_closings (agregat harian) (+3 more)

### Community 32 - "AppServiceProvider"
Cohesion: 0.24
Nodes (5): AppServiceProvider, BroadcastServiceProvider, Illuminate\Routing\UrlGenerator, Illuminate\Support\Facades\Broadcast, Illuminate\Support\ServiceProvider

### Community 33 - "utils.js"
Cohesion: 0.14
Nodes (14): DatePicker(), HARI_TO_DOW, showNominalByStatus(), buttonVariants, Calendar(), SelectContent, SelectItem, SelectLabel (+6 more)

### Community 34 - "Penyakit dua sumber kebenaran berebut (hook vs controller)"
Cohesion: 0.27
Nodes (10): Rancangan agregasi rekap v2, AgregasiScope (gerbang pemilih agregasi lama vs baru), TransactionDailyRecapController@ceklist_kepala (penulis rekap tunggal), Penyakit dua sumber kebenaran berebut (hook vs controller), Grain per (grouping, hari), bukan per mantri, WorkDay::tanggalRekapBulan() (hari kerja + tanggal berdata), WorkDay / work_days (kalender kerja nasional), ceklist_kepala (Approval Rekap oleh Pimpinan) (+2 more)

### Community 35 - "Illuminate\Database\Eloquent\Model"
Cohesion: 0.07
Nodes (21): App\Console\Commands\CountingDailyBalance, CountingDailyBalance, DebtRelief, EmployeeBranch, EmployeeZone, Employment, App\Models\EmploymentPermission, EmploymentPermission (+13 more)

### Community 36 - "Inertia\Inertia"
Cohesion: 0.18
Nodes (24): App\Helpers\AppHelper, App\Http\Controllers\AdminController, App\Http\Controllers\BatchInputController, App\Http\Controllers\EmployeeController, App\Http\Controllers\MobileAppsMantriController, MobileAppsMantriController, App\Http\Controllers\PindahResortController, App\Http\Controllers\TransactionDailyRecapController (+16 more)

### Community 37 - "NewAngsuran/Components/Action.jsx"
Cohesion: 0.14
Nodes (19): SearchComponent(), NAMA_BULAN, Action(), TableRekap(), TableRekapKasir(), TableRekapPerMantri(), TunaiMantri(), Action() (+11 more)

### Community 38 - "sidebar.jsx"
Cohesion: 0.12
Nodes (28): data, useIsMobile(), Separator, Sidebar, SidebarContent, SidebarContext, SidebarFooter, SidebarGroup (+20 more)

### Community 39 - "Kunci Reset & Hapus berdasarkan approval rekap (daily_kepala_approval)"
Cohesion: 0.22
Nodes (9): Aturan wajib pencatatan perubahan (fungsi, route, tabel), FilterBar (chip filter instan + localStorage), PinjamanTrait::getTransactionLoan(), Konsolidasi halaman Buku Transaksi jadi satu halaman responsif, Kunci Reset & Hapus berdasarkan approval rekap (daily_kepala_approval), SearchComponent (dropdown filter lama, remount via key), ERD Relasi Data & Otorisasi Transaksi, Pemutihan Pinjaman Macet (White-Off) (+1 more)

### Community 40 - "app/Rules/HariKerja.php (satu Rule, tujuh pintu)"
Cohesion: 0.25
Nodes (9): getLastDateForHari() (JS, lib/utils.js), AppHelper::getStortingShowDate() / getNumbDays() (PHP), app/Rules/HariKerja.php (satu Rule, tujuh pintu), Pelajaran: setiap tanggal turunan wajib dicari dan diperiksa, Bug TDZ useHariLibur di atas useForm, useHariLibur (mundurKeHariKerja / majuKeHariKerja), action_buku_transaksi (ACC / Drop / Tolak / Batal), generateUnknownNik / callUnknownNik (+1 more)

### Community 41 - "TransactionLoan"
Cohesion: 0.09
Nodes (4): KeluarTarget, TransactionLoan, GenerateTotalSeeder, DateTimeInterface

### Community 42 - "AgregasiScope"
Cohesion: 0.18
Nodes (4): AgregasiScope, Carbon, PenyesuaianSaldo, TransactionSaldoAdjustment

### Community 43 - "TransactionDailyRecap"
Cohesion: 0.11
Nodes (8): OnlineBranch, TransactionDailyRecap, TransactionSirculation, PinjamanTrait, RekapTrait, BalancingTargetSeeder, ChangeWrongDateGlobalSeeder, DailySeeder

### Community 44 - "TransactionLoanInstalment"
Cohesion: 0.10
Nodes (4): TransactionLoanInstalmentController, TransactionLoanInstalment, CompareSeeder, MoveAreaSeeder

### Community 45 - "AngsuranTable.jsx"
Cohesion: 0.28
Nodes (6): AngsuranTable(), BEKU, HARI_KE, namaPanjang(), urutBaris(), WARNA

### Community 47 - "Illuminate\Http\Request"
Cohesion: 0.10
Nodes (5): SetBranchController, TransactionDailyRecapController, TransactionLoanController, Illuminate\Http\Request, TransactionDailyRecap

### Community 53 - "8 Permission Inti"
Cohesion: 0.33
Nodes (6): 8 Permission Inti, Modul E — Administrasi Karyawan (Manpower), Matriks Otorisasi Berdasarkan Jabatan, Pemetaan 7 Role Baru, Desain permission inti baru (17 → 6/8), Prinsip: jabatan menentukan kemampuan, delegasi cabang menentukan jangkauan

### Community 55 - "SerahTerima saldo awal (periksa / tetapkanZ / sahkan)"
Cohesion: 0.50
Nodes (5): Cutover kantor percontohan Karawang 2, branches.mulai_pendataan_baru (batas migrasi per kantor), SerahTerima saldo awal (periksa / tetapkanZ / sahkan), transaction_monthly_closings (agregat bulanan), TutupBulanan::rakit() / kelengkapan()

### Community 56 - "Handler"
Cohesion: 0.33
Nodes (3): Handler, Illuminate\Foundation\Exceptions\Handler, Throwable

### Community 57 - "graphify — peta hubungan kode"
Cohesion: 0.22
Nodes (8): Aturan yang tidak boleh dilanggar, Graf menunjuk, bukan membuktikan, graphify — peta hubungan kode, Menjaganya tetap segar, Pakai yang sempit, jangan yang luas, unit-apps, Untuk apa dia benar-benar dipakai, Yang belum ada di graf

### Community 58 - "logging.php"
Cohesion: 0.40
Nodes (4): Monolog\Formatter\JsonFormatter, Monolog\Handler\NullHandler, Monolog\Handler\StreamHandler, Monolog\Handler\SyslogUdpHandler

### Community 62 - "PasswordResetTest"
Cohesion: 0.25
Nodes (3): Illuminate\Auth\Notifications\ResetPassword, Illuminate\Support\Facades\Notification, PasswordResetTest

### Community 67 - "AppBadge + appBadgeVariants"
Cohesion: 0.67
Nodes (3): AppBadge + appBadgeVariants, AppButton + appButtonVariants, statusVariants.js (VARIAN_STATUS / varianStatus)

### Community 72 - "Kernel"
Cohesion: 0.40
Nodes (3): Kernel, Illuminate\Console\Scheduling\Schedule, Illuminate\Foundation\Console\Kernel

### Community 124 - "BargeStatus.jsx"
Cohesion: 0.19
Nodes (9): variantMap, BargeStatus(), variantMap, GenerateUser(), ManPower(), TableRencana(), Badge(), badgeVariants (+1 more)

### Community 125 - "Carbon\Carbon"
Cohesion: 0.10
Nodes (18): CekSaldo, MaterialisasiTargetOtomatis, App\Helpers\AgregasiScope, App\Helpers\AuthScope, App\Helpers\Ember, App\Helpers\GembokBulanan, App\Helpers\HitungAgregat, App\Helpers\PemeriksaAgregat (+10 more)

### Community 126 - "NasabahMacet.jsx"
Cohesion: 0.47
Nodes (4): HARI, Kartu(), NasabahMacet(), rp()

### Community 128 - "HariKerja"
Cohesion: 0.15
Nodes (7): RedirectIfAuthenticated, App\Rules\HariKerja, HariKerja, Carbon, Closure, Illuminate\Contracts\Validation\ValidationRule, TransactionLoan

### Community 129 - "StockTakeMl.jsx"
Cohesion: 0.40
Nodes (3): rupiah(), STATUS, StockTakeMl()

### Community 133 - "Branch"
Cohesion: 0.17
Nodes (4): TandaiMigrasi, VerifikasiAgregat, PemeriksaAgregat, Branch

### Community 134 - "InputError.jsx"
Cohesion: 0.13
Nodes (13): ApplicationLogo(), Checkbox(), DangerButton(), InputError(), InputLabel(), Modal(), PrimaryButton(), SecondaryButton() (+5 more)

### Community 136 - "PenyesuaianSaldo.jsx"
Cohesion: 0.60
Nodes (3): KartuPinjaman(), PenyesuaianSaldo(), rupiah()

### Community 137 - "SerahTerima.jsx"
Cohesion: 0.60
Nodes (3): rupiah(), SelZ(), SerahTerima()

### Community 138 - "cn"
Cohesion: 0.12
Nodes (23): cn(), DrawerContent, DrawerDescription, DrawerFooter(), DrawerHeader(), DrawerOverlay, DrawerTitle, DropdownMenuCheckboxItem (+15 more)

### Community 139 - "Dashboard"
Cohesion: 0.50
Nodes (4): Dashboard(), rp(), statusKantor(), tgl()

### Community 140 - "ApprovalAkhir.jsx"
Cohesion: 0.60
Nodes (3): ApprovalAkhir(), namaBulan(), rp()

### Community 142 - "Kesiapan.jsx"
Cohesion: 0.38
Nodes (5): Angka(), GRUP, HARI, Kesiapan(), rp()

### Community 144 - "Illuminate\Database\Eloquent\Factories\Factory"
Cohesion: 0.24
Nodes (4): TransactionCustomerFactory, TransactionManageCustomerFactory, UserFactory, Illuminate\Database\Eloquent\Factories\Factory

### Community 145 - "AppHelper"
Cohesion: 0.08
Nodes (3): AppHelper, Int, User

### Community 146 - "AdminController"
Cohesion: 0.20
Nodes (3): AdminController, PindahResortController, Controller

### Community 147 - "WorkDay"
Cohesion: 0.12
Nodes (4): KalenderKerja, Carbon, WorkDay, self

### Community 149 - "BukuStortingMobile.jsx"
Cohesion: 0.60
Nodes (4): BukuStortingMobile(), jumlah(), rb(), ribuan

### Community 150 - "BukuTransaksi/Action.jsx"
Cohesion: 0.24
Nodes (6): Acc(), ChangeDetail(), RemoveLoan(), ReStatus(), StatusPengajuan(), tanggal()

### Community 152 - "Harian.jsx"
Cohesion: 0.83
Nodes (3): BarisKelompok(), Harian(), rupiah()

### Community 156 - "HandleInertiaRequests.php"
Cohesion: 0.40
Nodes (3): HandleInertiaRequests, Inertia\Middleware, Tightenco\Ziggy\Ziggy

### Community 157 - "App\Models\TransactionLoan"
Cohesion: 0.36
Nodes (4): CekPelunasan, TransactionLoan, App\Models\TransactionLoan, Staudenmeir\EloquentHasManyDeep\HasRelationships

## Knowledge Gaps
- **61 isolated node(s):** `LENCANA`, `variantMap`, `variantMap`, `HARI`, `STATUS` (+56 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 484 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **43 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AppHelper` connect `AppHelper` to `HariKerja`, `Inertia\Inertia`, `Branch`, `TransactionCustomer`, `TransactionLoan`, `TransactionDailyRecap`, `Employee`, `Illuminate\Http\Request`, `AdminController`, `.store`, `TransactionLoanOfficerGrouping`, `Handler`, `App\Models\TransactionLoan`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Why does `TransactionLoan` connect `TransactionLoan` to `Illuminate\Database\Eloquent\Model`, `Inertia\Inertia`, `TransactionCustomer`, `TransactionDailyRecap`, `TransactionLoanInstalment`, `User`, `AdminController`, `TransactionLoanOfficerGrouping`, `App\Models\TransactionLoan`, `Mutasi`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Why does `User` connect `User` to `Controller`, `Illuminate\Database\Eloquent\Model`, `TestCase`, `Branch`, `Employee`, `EmailVerificationTest.php`, `AdminController`, `WorkDay`, `App\Http\Requests\Auth\LoginRequest`, `PasswordConfirmationTest`, `Illuminate\Foundation\Testing\RefreshDatabase`, `PasswordResetTest`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Are the 14 inferred relationships involving `TransactionLoan` (e.g. with `.loan_balancing()` and `.monitoring_staff()`) actually correct?**
  _`TransactionLoan` has 14 INFERRED edges - model-reasoned connections that need verification._
- **Are the 29 inferred relationships involving `AppHelper` (e.g. with `.loan_balancing()` and `.monitoring_staff()`) actually correct?**
  _`AppHelper` has 29 INFERRED edges - model-reasoned connections that need verification._
- **What connects `LENCANA`, `variantMap`, `variantMap` to the rest of the system?**
  _61 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `TransactionMonthlyClosing` be split into smaller, more focused modules?**
  _Cohesion score 0.11384615384615385 - nodes in this community are weakly interconnected._