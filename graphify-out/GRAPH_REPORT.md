# Graph Report - unit-apps  (2026-10-10)

## Corpus Check
- 418 files · ~205,289 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1744 nodes · 4598 edges · 164 communities (74 shown, 46 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 267 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ea0170cd`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- utils.js
- table.jsx
- Illuminate\Http\RedirectResponse
- .handle
- Table
- Mutasi
- BukuTransaksi/Action.jsx
- sidebar.jsx
- TransactionDailyClosing
- App\Http\Requests\Auth\LoginRequest
- AdminPanel/Index.jsx
- Illuminate\Database\Seeder
- Employee
- NewNasabah.jsx
- AngsuranTable.jsx
- AngsuranTableMobile.jsx
- HitungAgregat
- User
- BukuTransaksiKepala.jsx
- RBAC Multi-Cabang (rancangan)
- TestCase
- TransactionLoanInstalmentController
- TableHead
- Auto-pelunasan pinjaman lama saat top-up berhasil drop
- CountingBalance.php
- dialog.jsx
- Ghost permission (nama permission tak ada di tabel permissions)
- GenerateClosingRows
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
- TransactionDailyRecap
- App\Models\TransactionMonthlyClosing
- Illuminate\Foundation\Testing\RefreshDatabase
- TableHeader
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
- App\Http\Controllers\ProfileController
- TransactionLoanOfficerGrouping
- .store
- StockTakeMl.jsx
- App\Http\Controllers\LoanController
- button.jsx
- EmailVerificationTest.php
- TableRekapKasir.jsx
- InputError.jsx
- Illuminate\Support\Collection
- WorkDay
- Carbon
- AuthenticatedLayout.jsx
- MigrasiController
- KalenderKerja
- .handle
- Carbon
- Illuminate\Database\Eloquent\Factories\Factory
- AppHelper
- CreatesApplication
- TransactionLoan
- RouteServiceProvider
- TransactionDailyClosing
- Controller
- TransactionSaldoAdjustment
- TransactionDailyClosing
- HandleInertiaRequests.php
- TransactionDailyClosing
- PenyesuaianSaldo.jsx
- TransactionSaldoAdjustment
- LoginRequest
- TrustProxies.php
- TransactionMonthlyClosing
- TransactionLoan
- App\Models\TransactionDailyClosing
- BukuStortingMobile.jsx
- Carbon
- AuthenticationTest
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

## Communities (164 total, 46 thin omitted)

### Community 0 - "utils.js"
Cohesion: 0.13
Nodes (17): AppButton, appButtonVariants, DatePicker(), HARI_KE_ANGKA, NAMA_BULAN, NAMA_HARI, HARI_TO_DOW, buttonVariants (+9 more)

### Community 1 - "table.jsx"
Cohesion: 0.25
Nodes (8): BadgeStatus(), variantMap, BargeStatus(), variantMap, FormatNumbering(), TableBody, TableCell, TableRow

### Community 2 - "Illuminate\Http\RedirectResponse"
Cohesion: 0.16
Nodes (10): ConfirmablePasswordController, EmailVerificationPromptController, NewPasswordController, PasswordResetLinkController, Illuminate\Auth\Events\PasswordReset, Illuminate\Http\RedirectResponse, Illuminate\Support\Facades\Password, Illuminate\Validation\Rules (+2 more)

### Community 4 - "Table"
Cohesion: 0.18
Nodes (6): MutasiNasabah(), rupiah(), STATUS, rupiah(), TargetBayangan(), Table

### Community 5 - "Mutasi"
Cohesion: 0.15
Nodes (5): Mutasi, MutasiNasabahController, App\Models\TransactionLoanMutation, TransactionLoanMutation, TransactionLoanMutation

### Community 6 - "BukuTransaksi/Action.jsx"
Cohesion: 0.12
Nodes (22): HARI_OPTIONS, KELOMPOK_OPTIONS, NAMA_BULAN, NAMA_HARI_PANJANG, Loading(), TanggalKerja(), simpanan, useHariLibur() (+14 more)

### Community 7 - "sidebar.jsx"
Cohesion: 0.12
Nodes (28): data, useIsMobile(), Separator, Sidebar, SidebarContent, SidebarContext, SidebarFooter, SidebarGroup (+20 more)

### Community 8 - "TransactionDailyClosing"
Cohesion: 0.10
Nodes (4): Gembok, Carbon, TransactionDailyClosing, TransactionLockHistory

### Community 9 - "App\Http\Requests\Auth\LoginRequest"
Cohesion: 0.18
Nodes (5): AuthenticatedSessionController, App\Http\Requests\Auth\LoginRequest, Illuminate\Auth\Events\Lockout, Illuminate\Support\Facades\RateLimiter, Illuminate\Support\Str

### Community 10 - "AdminPanel/Index.jsx"
Cohesion: 0.30
Nodes (12): SelectList(), AssignRoles(), MaintenerWorker(), Permission(), Role(), Card, CardContent, CardDescription (+4 more)

### Community 11 - "Illuminate\Database\Seeder"
Cohesion: 0.07
Nodes (20): TransactionCustomer, TransactionLoanInstalment, BalancingTargetSeeder, BatchInputSeeder, BatchInputV2Seeder, ChangeNasabahGroupingSeeder, CompareSeeder, DeleteAngsuranSeeder (+12 more)

### Community 12 - "Employee"
Cohesion: 0.15
Nodes (3): EmployeeController, Employee, GenerateEmpUserSeeder

### Community 13 - "NewNasabah.jsx"
Cohesion: 0.22
Nodes (9): SearchComponent(), SelectList(), useOptionGenerator(), FastCreateV2(), InputMacet(), TableRencana(), TabsContent, TabsList (+1 more)

### Community 14 - "AngsuranTable.jsx"
Cohesion: 0.25
Nodes (7): AngsuranTable(), BEKU, HARI_KE, namaPanjang(), urutBaris(), WARNA, useFilterAngsuran()

### Community 15 - "AngsuranTableMobile.jsx"
Cohesion: 0.31
Nodes (9): Angs(), AngsuranTableMobile(), FILTER, jumlah(), rb(), ribuan, statusHariIni(), urut() (+1 more)

### Community 16 - "HitungAgregat"
Cohesion: 0.10
Nodes (5): Ember, HitungAgregat, PemeriksaanMigrasi, TargetMingguan, Carbon

### Community 17 - "User"
Cohesion: 0.16
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

### Community 22 - "TableHead"
Cohesion: 0.39
Nodes (4): ApprovalAkhir(), namaBulan(), rp(), TableHead

### Community 23 - "Auto-pelunasan pinjaman lama saat top-up berhasil drop"
Cohesion: 0.16
Nodes (14): Auto-pelunasan pinjaman lama saat top-up berhasil drop, AppHelper::canDeleteLoan(), TransactionLoanController::checkpengajuan(), AppHelper::havePermissionByDate() dan bug E1, NoEditOverlay (pola overlay lama, ditinggalkan), Pola gerbang: kontrol tetap tampil, disabled + keterangan, transaction_loans.postponed_loan_id (Tundaan), transaction_loans.previous_loan_id (top-up / refinance) (+6 more)

### Community 24 - "CountingBalance.php"
Cohesion: 0.30
Nodes (7): CountingBalance, CountingCirculation, Illuminate\Bus\Queueable, Illuminate\Contracts\Queue\ShouldQueue, Illuminate\Foundation\Bus\Dispatchable, Illuminate\Queue\InteractsWithQueue, Illuminate\Queue\SerializesModels

### Community 25 - "dialog.jsx"
Cohesion: 0.14
Nodes (17): NAMA_HARI, GenerateUser(), Anomali(), ModalMigrasi(), Pratinjau(), rp(), tautan(), tgl() (+9 more)

### Community 26 - "Ghost permission (nama permission tak ada di tabel permissions)"
Cohesion: 0.15
Nodes (13): HandleInertiaRequests::share() prop global auth.roles, AuthScope::resolve() (dipakai memperbaiki getLoanMacet), BatchInputController dibatasi superuser (pastikanSuperuser), PinjamanTrait::getLoanMacet() / getLoanByDate(), Ghost permission (nama permission tak ada di tabel permissions), InputMacet.jsx + store_buku_transaksi_batch (jalur nasabah lama), Kuota ML sebagai PALANG, bukan perbandingan berulang, Alias middleware role: tidak terdaftar di Kernel (+5 more)

### Community 28 - "app_laravel & unit-apps berbagi database ubmi_db"
Cohesion: 0.23
Nodes (12): Jangan jalankan php artisan test (phpunit menghantam ubmi_db produksi), Aturan single source of truth: migrasi wajib dari app_laravel, app_laravel_laravel-network (external shared network), unit-app-service (PHP-FPM container), unit-vite (Node 20 dev server, port 5174), unit-web (nginx, port 8080), Urutan Eksekusi 4 Fase yang Backward-Compatible, Asumsi lama: 1 karyawan = 1 cabang (+4 more)

### Community 29 - "Angsuran.jsx"
Cohesion: 0.15
Nodes (18): PengajuanLink, useMuatDrawer(), Angka(), Approval(), rp(), DrawerAngsuran(), NAMA_BULAN, DrawerBukuAngsuran() (+10 more)

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
Cohesion: 0.05
Nodes (28): App\Console\Commands\CountingDailyBalance, CountingDailyBalance, App\Helpers\GembokBulanan, Customer, DebtRelief, EmployeeBranch, EmployeeZone, Employment (+20 more)

### Community 36 - "TransactionManageCustomer"
Cohesion: 0.15
Nodes (4): SiklusRekening, TransactionManageCustomer, App\Models\TransactionSiklus, TransactionSiklus

### Community 37 - "Carbon\Carbon"
Cohesion: 0.10
Nodes (42): App\Helpers\AgregasiScope, App\Helpers\AppHelper, App\Helpers\DaftarMigrasi, App\Helpers\Ember, App\Helpers\Gembok, App\Helpers\PemeriksaAgregat, App\Helpers\SerahTerima, App\Helpers\TargetBayangan (+34 more)

### Community 38 - "cn"
Cohesion: 0.10
Nodes (27): cn(), DrawerContent, DrawerDescription, DrawerFooter(), DrawerHeader(), DrawerOverlay, DrawerTitle, DropdownMenuCheckboxItem (+19 more)

### Community 39 - "Kunci Reset & Hapus berdasarkan approval rekap (daily_kepala_approval)"
Cohesion: 0.22
Nodes (9): Aturan wajib pencatatan perubahan (fungsi, route, tabel), FilterBar (chip filter instan + localStorage), PinjamanTrait::getTransactionLoan(), Konsolidasi halaman Buku Transaksi jadi satu halaman responsif, Kunci Reset & Hapus berdasarkan approval rekap (daily_kepala_approval), SearchComponent (dropdown filter lama, remount via key), ERD Relasi Data & Otorisasi Transaksi, Pemutihan Pinjaman Macet (White-Off) (+1 more)

### Community 40 - "app/Rules/HariKerja.php (satu Rule, tujuh pintu)"
Cohesion: 0.25
Nodes (9): getLastDateForHari() (JS, lib/utils.js), AppHelper::getStortingShowDate() / getNumbDays() (PHP), app/Rules/HariKerja.php (satu Rule, tujuh pintu), Pelajaran: setiap tanggal turunan wajib dicari dan diperiksa, Bug TDZ useHariLibur di atas useForm, useHariLibur (mundurKeHariKerja / majuKeHariKerja), action_buku_transaksi (ACC / Drop / Tolak / Batal), generateUnknownNik / callUnknownNik (+1 more)

### Community 41 - "TransactionDailyRecap"
Cohesion: 0.10
Nodes (8): App\Models\OnlineBranch, OnlineBranch, TransactionDailyRecap, TransactionSirculation, PinjamanTrait, RekapTrait, ChangeWrongDateGlobalSeeder, DailySeeder

### Community 42 - "App\Models\TransactionMonthlyClosing"
Cohesion: 0.14
Nodes (7): GembokBulanan, Carbon, TransactionMonthlyClosing, TutupBulanan, ClosingBulananController, App\Models\TransactionMonthlyClosing, TransactionMonthlyClosing

### Community 43 - "Illuminate\Foundation\Testing\RefreshDatabase"
Cohesion: 0.28
Nodes (3): Illuminate\Foundation\Testing\RefreshDatabase, PasswordUpdateTest, RegistrationTest

### Community 45 - "TableHeader"
Cohesion: 0.25
Nodes (9): Dashboard(), LENCANA, rp(), statusKantor(), tgl(), AccordionContent, AccordionItem, AccordionTrigger (+1 more)

### Community 47 - "Illuminate\Http\Request"
Cohesion: 0.14
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
Cohesion: 0.14
Nodes (11): Action(), kategoriEmber(), LoanDetail(), namaPendek(), rincianPerBulan(), tanggal(), WARNA_EMBER, Badge() (+3 more)

### Community 64 - "Controller"
Cohesion: 0.16
Nodes (11): EmailVerificationNotificationController, PasswordController, RegisteredUserController, App\Http\Controllers\Controller, Controller, MantriAppsController, Illuminate\Foundation\Auth\Access\AuthorizesRequests, Illuminate\Foundation\Bus\DispatchesJobs (+3 more)

### Community 67 - "AppBadge + appBadgeVariants"
Cohesion: 0.67
Nodes (3): AppBadge + appBadgeVariants, AppButton + appButtonVariants, statusVariants.js (VARIAN_STATUS / varianStatus)

### Community 72 - "NasabahMacet.jsx"
Cohesion: 0.47
Nodes (4): HARI, Kartu(), NasabahMacet(), rp()

### Community 122 - "Kesiapan.jsx"
Cohesion: 0.38
Nodes (5): Angka(), GRUP, HARI, Kesiapan(), rp()

### Community 125 - "App\Http\Controllers\ProfileController"
Cohesion: 0.20
Nodes (7): App\Http\Controllers\ProfileController, ProfileController, ProfileUpdateRequest, Illuminate\Contracts\Auth\MustVerifyEmail, Illuminate\Foundation\Http\FormRequest, Illuminate\Support\Facades\Redirect, Illuminate\Validation\Rule

### Community 126 - "TransactionLoanOfficerGrouping"
Cohesion: 0.10
Nodes (12): CekSaldo, MaterialisasiTargetOtomatis, TandaiMigrasi, VerifikasiAgregat, DaftarMigrasi, Carbon, PindahResortController, Branch (+4 more)

### Community 129 - "StockTakeMl.jsx"
Cohesion: 0.40
Nodes (3): rupiah(), STATUS, StockTakeMl()

### Community 131 - "button.jsx"
Cohesion: 0.11
Nodes (8): Baris(), rupiah(), PemeriksaanAgregat(), rupiah(), rupiah(), SelZ(), SerahTerima(), Button

### Community 132 - "EmailVerificationTest.php"
Cohesion: 0.14
Nodes (7): EventServiceProvider, Illuminate\Auth\Events\Registered, Illuminate\Auth\Listeners\SendEmailVerificationNotification, Illuminate\Foundation\Support\Providers\EventServiceProvider, Illuminate\Support\Facades\Event, Illuminate\Support\Facades\URL, EmailVerificationTest

### Community 133 - "TableRekapKasir.jsx"
Cohesion: 0.17
Nodes (9): BAWAAN, GRUP, KOLOM, KOLOM_ISI, ribu, ribuBertanda, TableRekapKasir(), WARNA (+1 more)

### Community 134 - "InputError.jsx"
Cohesion: 0.16
Nodes (9): ApplicationLogo(), Checkbox(), DangerButton(), InputError(), InputLabel(), Modal(), PrimaryButton(), SecondaryButton() (+1 more)

### Community 136 - "WorkDay"
Cohesion: 0.16
Nodes (6): Carbon, WorkDay, App\Rules\HariKerja, HariKerja, Carbon, Illuminate\Contracts\Validation\ValidationRule

### Community 138 - "AuthenticatedLayout.jsx"
Cohesion: 0.07
Nodes (15): Authenticated(), sidebarTerbuka(), MobileLayout(), EditableRow(), ManPower(), Permantri(), RekapContent(), Content() (+7 more)

### Community 139 - "MigrasiController"
Cohesion: 0.05
Nodes (15): CekPelunasan, TransactionLoan, AgregasiScope, Carbon, AuthScope, PemeriksaAgregat, PenyesuaianSaldo, TransactionSaldoAdjustment (+7 more)

### Community 142 - ".handle"
Cohesion: 0.33
Nodes (3): FilterGlobal, RedirectIfAuthenticated, Closure

### Community 144 - "Illuminate\Database\Eloquent\Factories\Factory"
Cohesion: 0.24
Nodes (4): TransactionCustomerFactory, TransactionManageCustomerFactory, UserFactory, Illuminate\Database\Eloquent\Factories\Factory

### Community 145 - "AppHelper"
Cohesion: 0.07
Nodes (5): AppHelper, TransactionLoan, Int, TransactionLoanOfficerGrouping, User

### Community 148 - "TransactionLoan"
Cohesion: 0.06
Nodes (10): KeluarTarget, TransactionLoan, GenerateTotalSeeder, LunasinSeeder, asdfg, LunasSeeder, DateTimeInterface, self (+2 more)

### Community 149 - "RouteServiceProvider"
Cohesion: 0.28
Nodes (5): VerifyEmailController, RouteServiceProvider, Illuminate\Auth\Events\Verified, Illuminate\Foundation\Auth\EmailVerificationRequest, Illuminate\Foundation\Support\Providers\RouteServiceProvider

### Community 152 - "Controller"
Cohesion: 0.17
Nodes (3): AdminController, SetBranchController, Controller

### Community 156 - "HandleInertiaRequests.php"
Cohesion: 0.40
Nodes (3): HandleInertiaRequests, Inertia\Middleware, Tightenco\Ziggy\Ziggy

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
- **71 isolated node(s):** `NAMA_HARI`, `GRUP`, `KOLOM`, `WARNA`, `WARNA_KOLOM` (+66 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 502 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **46 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AppHelper` connect `AppHelper` to `.store`, `Carbon\Carbon`, `App\Models\TransactionDailyClosing`, `WorkDay`, `TransactionDailyRecap`, `App\Models\TransactionMonthlyClosing`, `Illuminate\Database\Seeder`, `Employee`, `Illuminate\Http\Request`, `TransactionLoan`, `TransactionDailyRecapController`, `Controller`, `Handler`, `TransactionLoanOfficerGrouping`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Why does `User` connect `User` to `Controller`, `Illuminate\Database\Eloquent\Model`, `EmailVerificationTest.php`, `Carbon\Carbon`, `AuthenticationTest`, `Employee`, `Illuminate\Foundation\Testing\RefreshDatabase`, `TransactionLoan`, `TestCase`, `PasswordResetTest`, `Controller`, `App\Http\Controllers\ProfileController`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `utils.js`, `GlobalBranchFilter.jsx`, `table.jsx`, `button.jsx`, `Table`, `BukuTransaksi/Action.jsx`, `sidebar.jsx`, `AdminPanel/Index.jsx`, `TableHeader`, `NewNasabah.jsx`, `BukuTransaksiKepala.jsx`, `TableHead`, `dialog.jsx`, `Angsuran.jsx`, `NewAngsuran/Components/Action.jsx`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Are the 34 inferred relationships involving `AppHelper` (e.g. with `.loan_balancing()` and `.monitoring_staff()`) actually correct?**
  _`AppHelper` has 34 INFERRED edges - model-reasoned connections that need verification._
- **Are the 15 inferred relationships involving `TransactionLoan` (e.g. with `.loan_balancing()` and `.monitoring_staff()`) actually correct?**
  _`TransactionLoan` has 15 INFERRED edges - model-reasoned connections that need verification._
- **What connects `NAMA_HARI`, `GRUP`, `KOLOM` to the rest of the system?**
  _71 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `utils.js` be split into smaller, more focused modules?**
  _Cohesion score 0.13405797101449277 - nodes in this community are weakly interconnected._