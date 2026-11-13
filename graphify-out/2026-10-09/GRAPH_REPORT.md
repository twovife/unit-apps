# Graph Report - unit-apps  (2026-10-09)

## Corpus Check
- 413 files · ~201,742 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1717 nodes · 4516 edges · 161 communities (71 shown, 46 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 261 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `06a04b9f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- TransactionCustomer
- table.jsx
- AuthenticatedLayout.jsx
- Kernel
- TableRekapKasir.jsx
- Mutasi
- utils.js
- NasabahMacet.jsx
- TransactionDailyClosing
- PenyesuaianSaldo.jsx
- cn
- HitungAgregat
- Employee
- TransactionLoanOfficerGrouping
- Controller
- EmailVerificationTest.php
- AdminPanel/Index.jsx
- User
- AdminController
- RBAC Multi-Cabang (rancangan)
- BukuTransaksiKepala.jsx
- TransactionLoanInstalment
- Illuminate\Foundation\Testing\RefreshDatabase
- Auto-pelunasan pinjaman lama saat top-up berhasil drop
- CountingBalance.php
- AngsuranTableMobile.jsx
- Ghost permission (nama permission tak ada di tabel permissions)
- AgregasiScope
- app_laravel & unit-apps berbagi database ubmi_db
- ApprovalAkhir.jsx
- self
- transaction_daily_closings (agregat harian)
- AppServiceProvider
- TestCase
- Penyakit dua sumber kebenaran berebut (hook vs controller)
- Illuminate\Database\Eloquent\Model
- TransactionManageCustomer
- BukuTransaksi/Action.jsx
- sidebar.jsx
- Kunci Reset & Hapus berdasarkan approval rekap (daily_kepala_approval)
- app/Rules/HariKerja.php (satu Rule, tujuh pintu)
- TransactionMonthlyClosing
- App\Models\TransactionMonthlyClosing
- PasswordResetTest
- Carbon
- Migrasi/Dashboard.jsx
- AngsuranTable.jsx
- Illuminate\Http\Request
- Illuminate\Database\Migrations\Migration
- Illuminate\Database\Schema\Blueprint
- Illuminate\Support\Facades\Schema
- Illuminate\Foundation\Application
- NewAngsuran/Components/Action.jsx
- 8 Permission Inti
- Dropdown.jsx
- SerahTerima saldo awal (periksa / tetapkanZ / sahkan)
- LoginRequest
- graphify — peta hubungan kode
- logging.php
- Handler
- Authenticate
- TrustHosts
- RouteServiceProvider
- AuthServiceProvider
- TrustProxies.php
- ExampleTest
- AppBadge + appBadgeVariants
- Kernel
- EncryptCookies
- PreventRequestsDuringMaintenance
- TrimStrings
- .handle
- ValidateSignature
- VerifyCsrfToken
- console.php
- config/app.php
- sanctum.php
- entrypoint.sh
- entrypoint.dev.sh
- LoanRequest
- CrashAlert.jsx
- Kesiapan.jsx
- TransactionDailyRecapController
- VIsBalanceDropWithDailyReport
- CekPelunasan
- StockTakeMl.jsx
- App\Http\Controllers\LoanController
- Branch
- Carbon\Carbon
- TransactionLockHistory
- InputError.jsx
- Illuminate\Support\Collection
- WorkDay
- Customer
- button.jsx
- MigrasiController
- Loan
- TransactionLoan
- EmployeeZone
- Carbon
- Illuminate\Database\Eloquent\Factories\Factory
- AppHelper
- .store
- Bulanan.jsx
- KesiapanClosing.jsx
- BukuStortingMobile.jsx
- CreatesApplication
- TransactionDailyClosing
- TransactionDailyClosing
- TransactionSaldoAdjustment
- TransactionDailyClosing
- HandleInertiaRequests.php
- TransactionDailyClosing
- GlobalBranchFilter.jsx
- TransactionMonthlyClosing
- TransactionLoan
- Carbon

## God Nodes (most connected - your core abstractions)
1. `cn()` - 130 edges
2. `AppHelper` - 86 edges
3. `TransactionLoan` - 78 edges
4. `TransactionLoanOfficerGrouping` - 67 edges
5. `Button` - 65 edges
6. `User` - 45 edges
7. `Branch` - 40 edges
8. `TransactionDailyClosing` - 39 edges
9. `TransactionLoanInstalment` - 37 edges
10. `Table` - 35 edges

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

## Communities (161 total, 46 thin omitted)

### Community 0 - "TransactionCustomer"
Cohesion: 0.14
Nodes (6): TransactionCustomer, BatchInputSeeder, BatchInputV2Seeder, ChangeNasabahGroupingSeeder, NasabahGrs3Seeder, UpdateSeeder

### Community 1 - "table.jsx"
Cohesion: 0.21
Nodes (14): BadgeStatus(), variantMap, BargeStatus(), variantMap, FormatNumbering(), Badge(), badgeVariants, Table (+6 more)

### Community 2 - "AuthenticatedLayout.jsx"
Cohesion: 0.08
Nodes (11): Authenticated(), sidebarTerbuka(), EditableRow(), ManPower(), Permantri(), RekapContent(), Content(), STATUS (+3 more)

### Community 3 - "Kernel"
Cohesion: 0.40
Nodes (3): Kernel, Illuminate\Console\Scheduling\Schedule, Illuminate\Foundation\Console\Kernel

### Community 4 - "TableRekapKasir.jsx"
Cohesion: 0.22
Nodes (6): GRUP, KOLOM, KOLOM_ISI, ribu, ribuBertanda, TableRekapKasir()

### Community 5 - "Mutasi"
Cohesion: 0.15
Nodes (5): Mutasi, MutasiNasabahController, App\Models\TransactionLoanMutation, TransactionLoanMutation, TransactionLoanMutation

### Community 6 - "utils.js"
Cohesion: 0.11
Nodes (18): HARI_OPTIONS, KELOMPOK_OPTIONS, NAMA_BULAN, NAMA_HARI_PANJANG, HARI_KE_ANGKA, NAMA_BULAN, NAMA_HARI, TanggalKerja() (+10 more)

### Community 7 - "NasabahMacet.jsx"
Cohesion: 0.47
Nodes (4): HARI, Kartu(), NasabahMacet(), rp()

### Community 8 - "TransactionDailyClosing"
Cohesion: 0.07
Nodes (8): Gembok, KalenderKerja, Carbon, ClosingHarianController, Carbon, KalenderKerjaController, TransactionDailyClosing, WorkDay

### Community 9 - "PenyesuaianSaldo.jsx"
Cohesion: 0.60
Nodes (3): KartuPinjaman(), PenyesuaianSaldo(), rupiah()

### Community 10 - "cn"
Cohesion: 0.07
Nodes (43): AppButton, appButtonVariants, DatePicker(), cn(), buttonVariants, Calendar(), DrawerContent, DrawerDescription (+35 more)

### Community 11 - "HitungAgregat"
Cohesion: 0.08
Nodes (4): Ember, HitungAgregat, TargetBayangan, TransactionSaldoAdjustment

### Community 12 - "Employee"
Cohesion: 0.14
Nodes (3): EmployeeController, Employee, GenerateEmpUserSeeder

### Community 13 - "TransactionLoanOfficerGrouping"
Cohesion: 0.12
Nodes (7): CekSaldo, MaterialisasiTargetOtomatis, TransactionLoanOfficerGrouping, TransactionSirculation, PinjamanTrait, RekapTrait, Illuminate\Console\Command

### Community 14 - "Controller"
Cohesion: 0.07
Nodes (31): AuthenticatedSessionController, ConfirmablePasswordController, EmailVerificationNotificationController, EmailVerificationPromptController, NewPasswordController, PasswordController, PasswordResetLinkController, RegisteredUserController (+23 more)

### Community 15 - "EmailVerificationTest.php"
Cohesion: 0.13
Nodes (8): EventServiceProvider, Illuminate\Auth\Events\Registered, Illuminate\Auth\Events\Verified, Illuminate\Auth\Listeners\SendEmailVerificationNotification, Illuminate\Foundation\Support\Providers\EventServiceProvider, Illuminate\Support\Facades\Event, Illuminate\Support\Facades\URL, EmailVerificationTest

### Community 16 - "AdminPanel/Index.jsx"
Cohesion: 0.21
Nodes (17): Loading(), SelectList(), GenerateUser(), AssignRoles(), MaintenerWorker(), Permission(), Role(), HARI_KE_ANGKA (+9 more)

### Community 17 - "User"
Cohesion: 0.16
Nodes (10): App\Models\User, User, BelongsToThrough, Illuminate\Foundation\Auth\User, Illuminate\Notifications\Notifiable, Laravel\Sanctum\HasApiTokens, Spatie\Permission\Traits\HasPermissions, Spatie\Permission\Traits\HasRoles (+2 more)

### Community 18 - "AdminController"
Cohesion: 0.17
Nodes (3): AdminController, PindahResortController, Controller

### Community 19 - "RBAC Multi-Cabang (rancangan)"
Cohesion: 0.14
Nodes (18): AuthScope::resolve(), employee_branches (pivot delegasi multi-cabang), employee_zones (pivot multi-zona staf kontrol), Global Branch Scope Flow, Modul F — Panel Admin & Multi-Cabang/Multi-Zona RBAC, SetBranchController (POST /set-branch), AuthScope (helper scope terpusat, rancangan), employment_permissions (mekanisme multi-cabang lama, DEPRECATED) (+10 more)

### Community 20 - "BukuTransaksiKepala.jsx"
Cohesion: 0.23
Nodes (10): AppBadge, appBadgeVariants, VARIAN_JENIS, VARIAN_STATUS, varianJenis(), varianStatus(), Action(), BukuTransaksiKepala() (+2 more)

### Community 21 - "TransactionLoanInstalment"
Cohesion: 0.10
Nodes (6): TransactionLoanInstalmentController, TransactionLoanInstalment, DeleteAngsuranSeeder, KeubahSeeder, MoveAreaSeeder, PindahTotalResotSeeder

### Community 22 - "Illuminate\Foundation\Testing\RefreshDatabase"
Cohesion: 0.24
Nodes (3): Illuminate\Foundation\Testing\RefreshDatabase, PasswordConfirmationTest, RegistrationTest

### Community 23 - "Auto-pelunasan pinjaman lama saat top-up berhasil drop"
Cohesion: 0.16
Nodes (14): Auto-pelunasan pinjaman lama saat top-up berhasil drop, AppHelper::canDeleteLoan(), TransactionLoanController::checkpengajuan(), AppHelper::havePermissionByDate() dan bug E1, NoEditOverlay (pola overlay lama, ditinggalkan), Pola gerbang: kontrol tetap tampil, disabled + keterangan, transaction_loans.postponed_loan_id (Tundaan), transaction_loans.previous_loan_id (top-up / refinance) (+6 more)

### Community 24 - "CountingBalance.php"
Cohesion: 0.30
Nodes (7): CountingBalance, CountingCirculation, Illuminate\Bus\Queueable, Illuminate\Contracts\Queue\ShouldQueue, Illuminate\Foundation\Bus\Dispatchable, Illuminate\Queue\InteractsWithQueue, Illuminate\Queue\SerializesModels

### Community 25 - "AngsuranTableMobile.jsx"
Cohesion: 0.13
Nodes (23): NAMA_HARI, Action(), Anomali(), ModalMigrasi(), Pratinjau(), rp(), tautan(), tgl() (+15 more)

### Community 26 - "Ghost permission (nama permission tak ada di tabel permissions)"
Cohesion: 0.15
Nodes (13): HandleInertiaRequests::share() prop global auth.roles, AuthScope::resolve() (dipakai memperbaiki getLoanMacet), BatchInputController dibatasi superuser (pastikanSuperuser), PinjamanTrait::getLoanMacet() / getLoanByDate(), Ghost permission (nama permission tak ada di tabel permissions), InputMacet.jsx + store_buku_transaksi_batch (jalur nasabah lama), Kuota ML sebagai PALANG, bukan perbandingan berulang, Alias middleware role: tidak terdaftar di Kernel (+5 more)

### Community 27 - "AgregasiScope"
Cohesion: 0.18
Nodes (4): AgregasiScope, Carbon, PenyesuaianSaldo, TransactionSaldoAdjustment

### Community 28 - "app_laravel & unit-apps berbagi database ubmi_db"
Cohesion: 0.23
Nodes (12): Jangan jalankan php artisan test (phpunit menghantam ubmi_db produksi), Aturan single source of truth: migrasi wajib dari app_laravel, app_laravel_laravel-network (external shared network), unit-app-service (PHP-FPM container), unit-vite (Node 20 dev server, port 5174), unit-web (nginx, port 8080), Urutan Eksekusi 4 Fase yang Backward-Compatible, Asumsi lama: 1 karyawan = 1 cabang (+4 more)

### Community 29 - "ApprovalAkhir.jsx"
Cohesion: 0.15
Nodes (15): PengajuanLink, Angka(), Approval(), rp(), NAMA_BULAN, ApprovalAkhir(), namaBulan(), rp() (+7 more)

### Community 30 - "self"
Cohesion: 0.15
Nodes (4): VerifikasiAgregat, PemeriksaAgregat, Carbon, self

### Community 31 - "transaction_daily_closings (agregat harian)"
Cohesion: 0.22
Nodes (11): Ember (6 ember penyimpanan, 4 kategori tampilan), Gembok harian ditegakkan lewat trigger DB, AppHelper::generateStatusAngsuran() (4 nilai, alur lama), Generated column STORED (bukan VIRTUAL) & keluar dari $fillable, HitungAgregat (mesin penghitung agregat harian), Hook rekap otomatis dicabut dari model, transaction_loans.pinjaman adalah generated column (nominal_drop * 1.3), transaction_daily_closings (agregat harian) (+3 more)

### Community 32 - "AppServiceProvider"
Cohesion: 0.24
Nodes (5): AppServiceProvider, BroadcastServiceProvider, Illuminate\Routing\UrlGenerator, Illuminate\Support\Facades\Broadcast, Illuminate\Support\ServiceProvider

### Community 33 - "TestCase"
Cohesion: 0.24
Nodes (4): Illuminate\Foundation\Testing\TestCase, PasswordUpdateTest, ExampleTest, TestCase

### Community 34 - "Penyakit dua sumber kebenaran berebut (hook vs controller)"
Cohesion: 0.27
Nodes (10): Rancangan agregasi rekap v2, AgregasiScope (gerbang pemilih agregasi lama vs baru), TransactionDailyRecapController@ceklist_kepala (penulis rekap tunggal), Penyakit dua sumber kebenaran berebut (hook vs controller), Grain per (grouping, hari), bukan per mantri, WorkDay::tanggalRekapBulan() (hari kerja + tanggal berdata), WorkDay / work_days (kalender kerja nasional), ceklist_kepala (Approval Rekap oleh Pimpinan) (+2 more)

### Community 35 - "Illuminate\Database\Eloquent\Model"
Cohesion: 0.14
Nodes (12): DebtRelief, EmployeeBranch, Employment, App\Models\EmploymentPermission, EmploymentPermission, Instalment, TransactionBranchDailyRecap, TransactionOutReason (+4 more)

### Community 36 - "TransactionManageCustomer"
Cohesion: 0.15
Nodes (5): SiklusRekening, App\Models\TransactionManageCustomer, TransactionManageCustomer, App\Models\TransactionSiklus, TransactionSiklus

### Community 37 - "BukuTransaksi/Action.jsx"
Cohesion: 0.10
Nodes (23): SearchComponent(), SelectList(), useOptionGenerator(), Acc(), ChangeDetail(), RemoveLoan(), ReStatus(), StatusPengajuan() (+15 more)

### Community 38 - "sidebar.jsx"
Cohesion: 0.13
Nodes (23): GlobalBranchFilter(), data, useIsMobile(), Sidebar, SidebarContent, SidebarContext, SidebarFooter, SidebarGroup (+15 more)

### Community 39 - "Kunci Reset & Hapus berdasarkan approval rekap (daily_kepala_approval)"
Cohesion: 0.22
Nodes (9): Aturan wajib pencatatan perubahan (fungsi, route, tabel), FilterBar (chip filter instan + localStorage), PinjamanTrait::getTransactionLoan(), Konsolidasi halaman Buku Transaksi jadi satu halaman responsif, Kunci Reset & Hapus berdasarkan approval rekap (daily_kepala_approval), SearchComponent (dropdown filter lama, remount via key), ERD Relasi Data & Otorisasi Transaksi, Pemutihan Pinjaman Macet (White-Off) (+1 more)

### Community 40 - "app/Rules/HariKerja.php (satu Rule, tujuh pintu)"
Cohesion: 0.25
Nodes (9): getLastDateForHari() (JS, lib/utils.js), AppHelper::getStortingShowDate() / getNumbDays() (PHP), app/Rules/HariKerja.php (satu Rule, tujuh pintu), Pelajaran: setiap tanggal turunan wajib dicari dan diperiksa, Bug TDZ useHariLibur di atas useForm, useHariLibur (mundurKeHariKerja / majuKeHariKerja), action_buku_transaksi (ACC / Drop / Tolak / Batal), generateUnknownNik / callUnknownNik (+1 more)

### Community 42 - "App\Models\TransactionMonthlyClosing"
Cohesion: 0.14
Nodes (8): App\Helpers\GembokBulanan, GembokBulanan, Carbon, TransactionMonthlyClosing, TutupBulanan, ClosingBulananController, App\Models\TransactionMonthlyClosing, TransactionMonthlyClosing

### Community 43 - "PasswordResetTest"
Cohesion: 0.25
Nodes (3): Illuminate\Auth\Notifications\ResetPassword, Illuminate\Support\Facades\Notification, PasswordResetTest

### Community 44 - "Carbon"
Cohesion: 0.23
Nodes (3): PemeriksaanMigrasi, TargetMingguan, Carbon

### Community 45 - "Migrasi/Dashboard.jsx"
Cohesion: 0.31
Nodes (8): Dashboard(), LENCANA, rp(), statusKantor(), tgl(), AccordionContent, AccordionItem, AccordionTrigger

### Community 46 - "AngsuranTable.jsx"
Cohesion: 0.28
Nodes (6): AngsuranTable(), BEKU, HARI_KE, namaPanjang(), urutBaris(), WARNA

### Community 47 - "Illuminate\Http\Request"
Cohesion: 0.14
Nodes (5): SetBranchController, TransactionLoanController, App\Models\TransactionLoan, Illuminate\Http\Request, TransactionLoan

### Community 52 - "NewAngsuran/Components/Action.jsx"
Cohesion: 0.17
Nodes (9): Action(), kategoriEmber(), LoanDetail(), rincianPerBulan(), tanggal(), WARNA_EMBER, FilterAngsuranContext, useFilterAngsuran() (+1 more)

### Community 53 - "8 Permission Inti"
Cohesion: 0.33
Nodes (6): 8 Permission Inti, Modul E — Administrasi Karyawan (Manpower), Matriks Otorisasi Berdasarkan Jabatan, Pemetaan 7 Role Baru, Desain permission inti baru (17 → 6/8), Prinsip: jabatan menentukan kemampuan, delegasi cabang menentukan jangkauan

### Community 55 - "SerahTerima saldo awal (periksa / tetapkanZ / sahkan)"
Cohesion: 0.50
Nodes (5): Cutover kantor percontohan Karawang 2, branches.mulai_pendataan_baru (batas migrasi per kantor), SerahTerima saldo awal (periksa / tetapkanZ / sahkan), transaction_monthly_closings (agregat bulanan), TutupBulanan::rakit() / kelengkapan()

### Community 56 - "LoginRequest"
Cohesion: 0.23
Nodes (4): LoginRequest, ProfileUpdateRequest, Illuminate\Foundation\Http\FormRequest, Illuminate\Validation\Rule

### Community 57 - "graphify — peta hubungan kode"
Cohesion: 0.22
Nodes (8): Aturan yang tidak boleh dilanggar, Graf menunjuk, bukan membuktikan, graphify — peta hubungan kode, Menjaganya tetap segar, Pakai yang sempit, jangan yang luas, unit-apps, Untuk apa dia benar-benar dipakai, Yang belum ada di graf

### Community 58 - "logging.php"
Cohesion: 0.40
Nodes (4): Monolog\Formatter\JsonFormatter, Monolog\Handler\NullHandler, Monolog\Handler\StreamHandler, Monolog\Handler\SyslogUdpHandler

### Community 59 - "Handler"
Cohesion: 0.33
Nodes (3): Handler, Illuminate\Foundation\Exceptions\Handler, Throwable

### Community 62 - "RouteServiceProvider"
Cohesion: 0.25
Nodes (3): RouteServiceProvider, Illuminate\Foundation\Support\Providers\RouteServiceProvider, AuthenticationTest

### Community 67 - "AppBadge + appBadgeVariants"
Cohesion: 0.67
Nodes (3): AppBadge + appBadgeVariants, AppButton + appButtonVariants, statusVariants.js (VARIAN_STATUS / varianStatus)

### Community 124 - "Kesiapan.jsx"
Cohesion: 0.38
Nodes (5): Angka(), GRUP, HARI, Kesiapan(), rp()

### Community 126 - "VIsBalanceDropWithDailyReport"
Cohesion: 0.36
Nodes (6): App\Console\Commands\CountingDailyBalance, CountingDailyBalance, VIsBalanceDropWithDailyReport, App\Models\VIsBalanceLoanWithDailyReport, VIsBalanceLoanWithDailyReport, BalancingDailyReport

### Community 129 - "StockTakeMl.jsx"
Cohesion: 0.40
Nodes (3): rupiah(), STATUS, StockTakeMl()

### Community 131 - "Branch"
Cohesion: 0.13
Nodes (6): GenerateClosingRows, TandaiMigrasi, DaftarMigrasi, Carbon, Branch, TransactionLoanOfficerGrouping

### Community 132 - "Carbon\Carbon"
Cohesion: 0.10
Nodes (41): App\Helpers\AgregasiScope, App\Helpers\AppHelper, App\Helpers\AuthScope, App\Helpers\DaftarMigrasi, App\Helpers\Ember, App\Helpers\PemeriksaAgregat, App\Helpers\SerahTerima, App\Helpers\TargetBayangan (+33 more)

### Community 134 - "InputError.jsx"
Cohesion: 0.11
Nodes (14): ApplicationLogo(), Checkbox(), DangerButton(), InputError(), InputLabel(), Modal(), PrimaryButton(), SecondaryButton() (+6 more)

### Community 136 - "WorkDay"
Cohesion: 0.13
Nodes (8): RedirectIfAuthenticated, Carbon, WorkDay, App\Rules\HariKerja, HariKerja, Carbon, Closure, Illuminate\Contracts\Validation\ValidationRule

### Community 138 - "button.jsx"
Cohesion: 0.12
Nodes (7): MutasiNasabah(), rupiah(), PemeriksaanAgregat(), rupiah(), rupiah(), TargetBayangan(), Button

### Community 139 - "MigrasiController"
Cohesion: 0.17
Nodes (5): AuthScope, MigrasiController, Carbon, TransactionSaldoAdjustment, Collection

### Community 141 - "TransactionLoan"
Cohesion: 0.05
Nodes (26): KeluarTarget, App\Models\OnlineBranch, OnlineBranch, TransactionDailyRecap, TransactionLoan, BalancingTargetSeeder, BatchInputAngsuranSeeder, ChangeWrongDateGlobalSeeder (+18 more)

### Community 144 - "Illuminate\Database\Eloquent\Factories\Factory"
Cohesion: 0.16
Nodes (5): TransactionCustomerFactory, TransactionManageCustomerFactory, UserFactory, Illuminate\Database\Eloquent\Factories\Factory, Illuminate\Support\Str

### Community 145 - "AppHelper"
Cohesion: 0.07
Nodes (4): AppHelper, TransactionLoan, Int, User

### Community 149 - "BukuStortingMobile.jsx"
Cohesion: 0.60
Nodes (4): BukuStortingMobile(), jumlah(), rb(), ribuan

### Community 156 - "HandleInertiaRequests.php"
Cohesion: 0.40
Nodes (3): HandleInertiaRequests, Inertia\Middleware, Tightenco\Ziggy\Ziggy

### Community 160 - "GlobalBranchFilter.jsx"
Cohesion: 0.29
Nodes (8): Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut()

## Knowledge Gaps
- **66 isolated node(s):** `GRUP`, `KOLOM`, `KOLOM_ISI`, `ribu`, `ribuBertanda` (+61 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 493 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **46 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `User` connect `User` to `TestCase`, `Illuminate\Database\Eloquent\Model`, `Carbon\Carbon`, `PasswordResetTest`, `Employee`, `TransactionLoan`, `Controller`, `EmailVerificationTest.php`, `AdminController`, `Illuminate\Foundation\Testing\RefreshDatabase`, `LoginRequest`, `RouteServiceProvider`, `self`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Why does `AppHelper` connect `AppHelper` to `TransactionCustomer`, `Branch`, `Carbon\Carbon`, `TransactionDailyClosing`, `WorkDay`, `App\Models\TransactionMonthlyClosing`, `Employee`, `TransactionLoanOfficerGrouping`, `TransactionLoan`, `Illuminate\Http\Request`, `AdminController`, `.store`, `Handler`, `TransactionDailyRecapController`, `self`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Why does `TransactionLoan` connect `TransactionLoan` to `TransactionCustomer`, `Illuminate\Database\Eloquent\Model`, `Carbon\Carbon`, `Mutasi`, `TransactionDailyClosing`, `TransactionLoanOfficerGrouping`, `Illuminate\Http\Request`, `User`, `AdminController`, `TransactionLoanInstalment`, `TransactionDailyRecapController`, `self`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Are the 34 inferred relationships involving `AppHelper` (e.g. with `.loan_balancing()` and `.monitoring_staff()`) actually correct?**
  _`AppHelper` has 34 INFERRED edges - model-reasoned connections that need verification._
- **Are the 15 inferred relationships involving `TransactionLoan` (e.g. with `.loan_balancing()` and `.monitoring_staff()`) actually correct?**
  _`TransactionLoan` has 15 INFERRED edges - model-reasoned connections that need verification._
- **What connects `GRUP`, `KOLOM`, `KOLOM_ISI` to the rest of the system?**
  _66 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `TransactionCustomer` be split into smaller, more focused modules?**
  _Cohesion score 0.14035087719298245 - nodes in this community are weakly interconnected._