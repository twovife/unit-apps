# Graph Report - unit-apps  (2026-09-07)

## Corpus Check
- 397 files · ~172,555 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1518 nodes · 4286 edges · 122 communities (51 shown, 28 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 73 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `54f24cb8`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Komponen UI Dasar
- Badge & Status Tampilan
- Filter, Pencarian & Navigasi
- Autentikasi Bawaan Laravel
- Pinjaman, Sirkulasi & Pindah Resort
- Panel Admin & AuthScope
- Perintah Konsol Agregasi
- AppHelper (lima urusan tercampur)
- Gembok Closing Harian
- Model Cabang & Kepegawaian
- Pemilih Tanggal & Dialog
- Gerbang Agregasi Lama vs Baru
- Kueri Mantri & Karyawan
- Cakupan Auth & Pemeriksa Agregat
- Kalender Kerja
- Sidebar & Filter Cabang
- Serah Terima Saldo Awal
- User & Cakupan Cabang
- Sidebar shadcn & Responsif
- RBAC Multi-Cabang (rancangan)
- Badge Aplikasi & Varian
- Event & Uji Autentikasi
- Illuminate\Database\Eloquent\Factories\Factory
- Auto-pelunasan pinjaman lama saat top-up berhasil drop
- CountingBalance.php
- GlobalBranchFilter.jsx
- Ghost permission (nama permission tak ada di tabel permissions)
- TransactionManageCustomer
- app_laravel & unit-apps berbagi database ubmi_db
- Illuminate\Console\Command
- dropdown-menu.jsx
- transaction_daily_closings (agregat harian)
- AppServiceProvider
- AuthenticationTest
- Penyakit dua sumber kebenaran berebut (hook vs controller)
- VIsBalanceLoanWithDailyReport
- LoginRequest
- TransactionSaldoAdjustment
- sheet.jsx
- Kunci Reset & Hapus berdasarkan approval rekap (daily_kepala_approval)
- app/Rules/HariKerja.php (satu Rule, tujuh pintu)
- TransactionLoanInstalmentController
- Loan
- TestCase
- InputError.jsx
- PasswordResetTest
- AgregasiScope
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
- EmailVerificationTest.php
- Authenticate
- TrustHosts
- EmployeeZone
- AuthServiceProvider
- CreatesApplication
- ExampleTest
- AppBadge + appBadgeVariants
- Kernel
- EncryptCookies
- PreventRequestsDuringMaintenance
- TrimStrings
- TrustProxies.php
- ValidateSignature
- VerifyCsrfToken
- console.php
- config/app.php
- sanctum.php
- entrypoint.sh
- entrypoint.dev.sh

## God Nodes (most connected - your core abstractions)
1. `cn()` - 130 edges
2. `TransactionLoan` - 91 edges
3. `AppHelper` - 78 edges
4. `TransactionLoanOfficerGrouping` - 67 edges
5. `Button` - 64 edges
6. `TransactionDailyClosing` - 47 edges
7. `User` - 46 edges
8. `TransactionLoanInstalment` - 42 edges
9. `Branch` - 40 edges
10. `Controller` - 38 edges

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

## Communities (122 total, 28 thin omitted)

### Community 0 - "Komponen UI Dasar"
Cohesion: 0.06
Nodes (70): Checkbox(), FilterBar(), HARI_OPTIONS, KELOMPOK_OPTIONS, LinkButton(), Loading(), NoEditOverlay(), SelectList() (+62 more)

### Community 1 - "Badge & Status Tampilan"
Cohesion: 0.09
Nodes (45): BadgeStatus(), variantMap, BargeStatus(), variantMap, FormatNumbering(), StatusPinjaman(), GenerateUser(), Approval() (+37 more)

### Community 2 - "Filter, Pencarian & Navigasi"
Cohesion: 0.06
Nodes (14): Navbar(), AppSidebar(), SweetAlert(), Authenticated(), MobileLayout(), EditableRow(), ManPower(), Permantri() (+6 more)

### Community 3 - "Autentikasi Bawaan Laravel"
Cohesion: 0.05
Nodes (39): AuthenticatedSessionController, ConfirmablePasswordController, EmailVerificationNotificationController, EmailVerificationPromptController, NewPasswordController, PasswordController, PasswordResetLinkController, RegisteredUserController (+31 more)

### Community 4 - "Pinjaman, Sirkulasi & Pindah Resort"
Cohesion: 0.05
Nodes (12): PindahResortController, OnlineBranch, TransactionDailyRecap, TransactionLoan, TransactionLoanInstalment, TransactionLoanOfficerGrouping, TransactionSirculation, PinjamanTrait (+4 more)

### Community 5 - "Panel Admin & AuthScope"
Cohesion: 0.05
Nodes (15): AdminController, MobileAppsMantriController, SetBranchController, TransactionDailyRecapController, TransactionLoanController, HandleInertiaRequests, RedirectIfAuthenticated, HariKerja (+7 more)

### Community 6 - "Perintah Konsol Agregasi"
Cohesion: 0.07
Nodes (32): Branch, TransactionCustomer, Carbon\Carbon, BalancingTargetSeeder, BatchInputAngsuranSeeder, BatchInputSeeder, ChangeNasabahGroupingSeeder, ChangeWrongDateGlobalSeeder (+24 more)

### Community 7 - "AppHelper (lima urusan tercampur)"
Cohesion: 0.07
Nodes (4): AppHelper, BatchInputController, BatchInputV2Seeder, Int

### Community 8 - "Gembok Closing Harian"
Cohesion: 0.10
Nodes (5): Gembok, ClosingHarianController, Carbon, TransactionDailyClosing, TransactionLockHistory

### Community 9 - "Model Cabang & Kepegawaian"
Cohesion: 0.11
Nodes (11): DebtRelief, EmployeeBranch, Employment, EmploymentPermission, Instalment, TransactionBranchDailyRecap, TransactionOutReason, TransactionWhiteOff (+3 more)

### Community 10 - "Pemilih Tanggal & Dialog"
Cohesion: 0.12
Nodes (24): DatePicker(), cn(), buttonVariants, Calendar(), DrawerContent, DrawerDescription, DrawerFooter(), DrawerHeader() (+16 more)

### Community 11 - "Gerbang Agregasi Lama vs Baru"
Cohesion: 0.11
Nodes (4): HitungClosing, Carbon, Ember, HitungAgregat

### Community 12 - "Kueri Mantri & Karyawan"
Cohesion: 0.11
Nodes (6): EmployeeController, Employee, GenerateEmpUserSeeder, Faker\Core\Number, Illuminate\Bus\Batch, Spatie\Permission\Models\Role

### Community 13 - "Cakupan Auth & Pemeriksa Agregat"
Cohesion: 0.20
Nodes (3): AuthScope, MigrasiController, Carbon

### Community 14 - "Kalender Kerja"
Cohesion: 0.09
Nodes (7): DaftarMigrasi, Carbon, KalenderKerja, Carbon, KalenderKerjaController, WorkDay, self

### Community 15 - "Sidebar & Filter Cabang"
Cohesion: 0.11
Nodes (30): GlobalBranchFilter(), data, useIsMobile(), Separator, Sidebar, SidebarContent, SidebarContext, SidebarFooter (+22 more)

### Community 16 - "Serah Terima Saldo Awal"
Cohesion: 0.11
Nodes (4): SerahTerima, Carbon, TutupBulanan, TransactionMonthlyClosing

### Community 17 - "User & Cakupan Cabang"
Cohesion: 0.16
Nodes (8): User, BelongsToThrough, Illuminate\Foundation\Auth\User, Illuminate\Notifications\Notifiable, Laravel\Sanctum\HasApiTokens, Spatie\Permission\Traits\HasPermissions, Spatie\Permission\Traits\HasRoles, ProfileTest

### Community 18 - "Sidebar shadcn & Responsif"
Cohesion: 0.22
Nodes (6): AppButton, appButtonVariants, HARI_TO_DOW, showNominalByStatus(), Skeleton(), TooltipContent

### Community 19 - "RBAC Multi-Cabang (rancangan)"
Cohesion: 0.14
Nodes (18): AuthScope::resolve(), employee_branches (pivot delegasi multi-cabang), employee_zones (pivot multi-zona staf kontrol), Global Branch Scope Flow, Modul F — Panel Admin & Multi-Cabang/Multi-Zona RBAC, SetBranchController (POST /set-branch), AuthScope (helper scope terpusat, rancangan), employment_permissions (mekanisme multi-cabang lama, DEPRECATED) (+10 more)

### Community 20 - "Badge Aplikasi & Varian"
Cohesion: 0.19
Nodes (11): AppBadge, appBadgeVariants, VARIAN_JENIS, VARIAN_STATUS, varianJenis(), varianStatus(), Action(), BukuTransaksiKepala() (+3 more)

### Community 21 - "Event & Uji Autentikasi"
Cohesion: 0.25
Nodes (5): EventServiceProvider, Illuminate\Auth\Events\Registered, Illuminate\Auth\Listeners\SendEmailVerificationNotification, Illuminate\Foundation\Support\Providers\EventServiceProvider, Illuminate\Support\Facades\Event

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
Cohesion: 0.29
Nodes (8): Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut()

### Community 26 - "Ghost permission (nama permission tak ada di tabel permissions)"
Cohesion: 0.15
Nodes (13): HandleInertiaRequests::share() prop global auth.roles, AuthScope::resolve() (dipakai memperbaiki getLoanMacet), BatchInputController dibatasi superuser (pastikanSuperuser), PinjamanTrait::getLoanMacet() / getLoanByDate(), Ghost permission (nama permission tak ada di tabel permissions), InputMacet.jsx + store_buku_transaksi_batch (jalur nasabah lama), Kuota ML sebagai PALANG, bukan perbandingan berulang, Alias middleware role: tidak terdaftar di Kernel (+5 more)

### Community 27 - "TransactionManageCustomer"
Cohesion: 0.17
Nodes (3): TransactionManageCustomer, Staudenmeir\EloquentHasManyDeep\HasRelationships, Znck\Eloquent\Traits\BelongsToThrough

### Community 28 - "app_laravel & unit-apps berbagi database ubmi_db"
Cohesion: 0.23
Nodes (12): Jangan jalankan php artisan test (phpunit menghantam ubmi_db produksi), Aturan single source of truth: migrasi wajib dari app_laravel, app_laravel_laravel-network (external shared network), unit-app-service (PHP-FPM container), unit-vite (Node 20 dev server, port 5174), unit-web (nginx, port 8080), Urutan Eksekusi 4 Fase yang Backward-Compatible, Asumsi lama: 1 karyawan = 1 cabang (+4 more)

### Community 29 - "Illuminate\Console\Command"
Cohesion: 0.18
Nodes (6): CountingDailyBalance, GenerateClosingRows, VerifikasiAgregat, PemeriksaAgregat, Carbon, Illuminate\Console\Command

### Community 30 - "dropdown-menu.jsx"
Cohesion: 0.23
Nodes (9): DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut(), DropdownMenuSubContent (+1 more)

### Community 31 - "transaction_daily_closings (agregat harian)"
Cohesion: 0.22
Nodes (11): Ember (6 ember penyimpanan, 4 kategori tampilan), Gembok harian ditegakkan lewat trigger DB, AppHelper::generateStatusAngsuran() (4 nilai, alur lama), Generated column STORED (bukan VIRTUAL) & keluar dari $fillable, HitungAgregat (mesin penghitung agregat harian), Hook rekap otomatis dicabut dari model, transaction_loans.pinjaman adalah generated column (nominal_drop * 1.3), transaction_daily_closings (agregat harian) (+3 more)

### Community 32 - "AppServiceProvider"
Cohesion: 0.24
Nodes (5): AppServiceProvider, BroadcastServiceProvider, Illuminate\Routing\UrlGenerator, Illuminate\Support\Facades\Broadcast, Illuminate\Support\ServiceProvider

### Community 34 - "Penyakit dua sumber kebenaran berebut (hook vs controller)"
Cohesion: 0.27
Nodes (10): Rancangan agregasi rekap v2, AgregasiScope (gerbang pemilih agregasi lama vs baru), TransactionDailyRecapController@ceklist_kepala (penulis rekap tunggal), Penyakit dua sumber kebenaran berebut (hook vs controller), Grain per (grouping, hari), bukan per mantri, WorkDay::tanggalRekapBulan() (hari kerja + tanggal berdata), WorkDay / work_days (kalender kerja nasional), ceklist_kepala (Approval Rekap oleh Pimpinan) (+2 more)

### Community 35 - "VIsBalanceLoanWithDailyReport"
Cohesion: 0.36
Nodes (3): VIsBalanceDropWithDailyReport, VIsBalanceLoanWithDailyReport, BalancingDailyReport

### Community 36 - "LoginRequest"
Cohesion: 0.29
Nodes (3): LoginRequest, ProfileUpdateRequest, Illuminate\Foundation\Http\FormRequest

### Community 38 - "sheet.jsx"
Cohesion: 0.31
Nodes (7): SheetContent, SheetDescription, SheetFooter(), SheetHeader(), SheetOverlay, SheetTitle, sheetVariants

### Community 39 - "Kunci Reset & Hapus berdasarkan approval rekap (daily_kepala_approval)"
Cohesion: 0.22
Nodes (9): Aturan wajib pencatatan perubahan (fungsi, route, tabel), FilterBar (chip filter instan + localStorage), PinjamanTrait::getTransactionLoan(), Konsolidasi halaman Buku Transaksi jadi satu halaman responsif, Kunci Reset & Hapus berdasarkan approval rekap (daily_kepala_approval), SearchComponent (dropdown filter lama, remount via key), ERD Relasi Data & Otorisasi Transaksi, Pemutihan Pinjaman Macet (White-Off) (+1 more)

### Community 40 - "app/Rules/HariKerja.php (satu Rule, tujuh pintu)"
Cohesion: 0.25
Nodes (9): getLastDateForHari() (JS, lib/utils.js), AppHelper::getStortingShowDate() / getNumbDays() (PHP), app/Rules/HariKerja.php (satu Rule, tujuh pintu), Pelajaran: setiap tanggal turunan wajib dicari dan diperiksa, Bug TDZ useHariLibur di atas useForm, useHariLibur (mundurKeHariKerja / majuKeHariKerja), action_buku_transaksi (ACC / Drop / Tolak / Batal), generateUnknownNik / callUnknownNik (+1 more)

### Community 43 - "TestCase"
Cohesion: 0.15
Nodes (7): Illuminate\Foundation\Testing\RefreshDatabase, Illuminate\Foundation\Testing\TestCase, PasswordConfirmationTest, PasswordUpdateTest, RegistrationTest, ExampleTest, TestCase

### Community 44 - "InputError.jsx"
Cohesion: 0.13
Nodes (16): ApplicationLogo(), DangerButton(), InputError(), InputLabel(), Modal(), PrimaryButton(), SecondaryButton(), useServerFilter() (+8 more)

### Community 45 - "PasswordResetTest"
Cohesion: 0.25
Nodes (3): Illuminate\Auth\Notifications\ResetPassword, Illuminate\Support\Facades\Notification, PasswordResetTest

### Community 46 - "AgregasiScope"
Cohesion: 0.24
Nodes (3): TandaiMigrasi, AgregasiScope, Carbon

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

### Community 59 - "EmailVerificationTest.php"
Cohesion: 0.29
Nodes (3): Illuminate\Auth\Events\Verified, Illuminate\Support\Facades\URL, EmailVerificationTest

### Community 67 - "AppBadge + appBadgeVariants"
Cohesion: 0.67
Nodes (3): AppBadge + appBadgeVariants, AppButton + appButtonVariants, statusVariants.js (VARIAN_STATUS / varianStatus)

## Knowledge Gaps
- **46 isolated node(s):** `Aturan yang tidak boleh dilanggar`, `Pakai yang sempit, jangan yang luas`, `Untuk apa dia benar-benar dipakai`, `Graf menunjuk, bukan membuktikan`, `Menjaganya tetap segar` (+41 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 415 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **28 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `User` connect `User & Cakupan Cabang` to `AuthenticationTest`, `Autentikasi Bawaan Laravel`, `LoginRequest`, `Panel Admin & AuthScope`, `Perintah Konsol Agregasi`, `Model Cabang & Kepegawaian`, `EmailVerificationTest.php`, `TestCase`, `Kueri Mantri & Karyawan`, `PasswordResetTest`, `Kalender Kerja`, `TransactionManageCustomer`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Why does `TransactionLoan` connect `Pinjaman, Sirkulasi & Pindah Resort` to `Autentikasi Bawaan Laravel`, `Panel Admin & AuthScope`, `Perintah Konsol Agregasi`, `AppHelper (lima urusan tercampur)`, `Model Cabang & Kepegawaian`, `TransactionManageCustomer`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Why does `TransactionLoanOfficerGrouping` connect `Pinjaman, Sirkulasi & Pindah Resort` to `Autentikasi Bawaan Laravel`, `Panel Admin & AuthScope`, `Perintah Konsol Agregasi`, `AppHelper (lima urusan tercampur)`, `Gembok Closing Harian`, `Model Cabang & Kepegawaian`, `Gerbang Agregasi Lama vs Baru`, `AgregasiScope`, `Kalender Kerja`, `Illuminate\Console\Command`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **What connects `Aturan yang tidak boleh dilanggar`, `Pakai yang sempit, jangan yang luas`, `Untuk apa dia benar-benar dipakai` to the rest of the system?**
  _46 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Komponen UI Dasar` be split into smaller, more focused modules?**
  _Cohesion score 0.06368159203980099 - nodes in this community are weakly interconnected._
- **Should `Badge & Status Tampilan` be split into smaller, more focused modules?**
  _Cohesion score 0.0892929292929293 - nodes in this community are weakly interconnected._
- **Should `Filter, Pencarian & Navigasi` be split into smaller, more focused modules?**
  _Cohesion score 0.06386066763425254 - nodes in this community are weakly interconnected._