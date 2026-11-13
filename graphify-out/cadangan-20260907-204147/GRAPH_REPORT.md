# Graph Report - unit-apps  (2026-09-07)

## Corpus Check
- Large corpus: 424 files · ~612,282 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder.

## Summary
- 1715 nodes · 4477 edges · 175 communities (62 shown, 66 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 77 edges (avg confidence: 0.85)
- Token cost: 219,208 input · 12,000 output

## Community Hubs (Navigation)
- UI Komponen Umum
- Badge & Status Tampilan
- Perintah Konsol Agregasi
- Pinjaman & Pindah Resort
- Panel Admin & Middleware
- Layout & Navigasi
- Komponen Form Dasar
- AppHelper & Izin Tanggal
- Karyawan & Cakupan Auth
- Dependensi npm
- Sidebar & Filter Cabang
- Gembok Closing Harian
- Kalender Kerja & Job Harian
- Pemilih Tanggal & Drawer
- Mesin Hitung Agregat & Ember
- Model Cabang & Kepegawaian
- AuthScope & Perkakas Migrasi
- User & Cakupan Cabang
- RBAC Multi-Cabang (rancangan)
- Catatan Perubahan Buku Transaksi
- Konfigurasi shadcn
- Badge Aplikasi & Varian
- Aturan Gerbang & Pelunasan Otomatis
- Autentikasi Bawaan Laravel
- Event & Uji Autentikasi
- Serah Terima Saldo Awal
- Job Perhitungan Saldo
- Docker & Aturan Migrasi
- Community 28
- Community 29
- Community 30
- Community 31
- Community 32
- Community 33
- Community 34
- Community 35
- Community 36
- Community 37
- Community 38
- Community 39
- Community 40
- Community 41
- Community 42
- Community 43
- Community 44
- Community 45
- Community 46
- Community 47
- Community 48
- Community 49
- Community 50
- Community 51
- Community 52
- Community 53
- Community 54
- Community 55
- Community 56
- Community 57
- Community 58
- Community 59
- Community 60
- Community 61
- Community 62
- Community 63
- Community 64
- Community 65
- Community 66
- Community 67
- Community 68
- Community 69
- Community 70
- Community 71
- Community 72
- Community 73
- Community 74
- Community 75
- Community 76
- Community 77
- Community 78
- Community 79
- Community 80
- Community 81
- Community 82
- Community 84
- Community 85
- Community 86
- Community 87
- Community 88
- Community 89
- Community 90
- Community 91
- Community 92
- Community 108
- Community 109
- Community 110
- Community 111
- Community 112
- Community 113
- Community 114
- Community 115
- Community 116
- Community 117
- Community 118
- Community 119
- Community 120
- Community 121
- Community 122
- Community 123
- Community 124
- Community 125
- Community 126
- Community 127
- Community 128
- Community 129
- Community 130
- Community 131
- Community 132
- Community 133
- Community 134
- Community 135
- Community 136
- Community 137
- Community 138
- Community 139
- Community 140
- Community 141
- Community 142
- Community 151

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
- `AuthScope::resolve() (dipakai memperbaiki getLoanMacet)` --conceptually_related_to--> `AuthScope::resolve()`  [INFERRED]
  .agents/CHANGELOG.md → flowproject/flowapps.md
- `transaction_saldo_adjustments (penyesuaian saldo)` --semantically_similar_to--> `Pemutihan Pinjaman Macet (White-Off)`  [INFERRED] [semantically similar]
  .agents/CHANGELOG.md → flowproject/flowapps.md
- `transaction_daily_closings (agregat harian)` --semantically_similar_to--> `transaction_daily_recaps (rekap harian kasir)`  [INFERRED] [semantically similar]
  .agents/CHANGELOG.md → flowproject/flowapps.md
- `robots.txt Allow-All Policy` --conceptually_related_to--> `ubmiapps (README)`  [AMBIGUOUS]
  public/robots.txt → README.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Global Branch Scope: session, permission, dan pivot multi-cabang** — flowproject_flowapps_authscope, flowproject_flowapps_8_permission_inti, flowproject_flowapps_employee_branches, flowproject_flowapps_employee_zones, flowproject_rekonstruksi_role_permission_global_branch_selector, flowproject_synchronization_flow_get_allowed_branch_ids, flowproject_flowapps_set_branch_controller [EXTRACTED 1.00]
- **Kolom penghubung siklus pinjaman (top-up, tundaan, pelunasan otomatis)** — _agents_changelog_previous_loan_id, _agents_changelog_postponed_loan_id, _agents_changelog_settled_by_loan_id, _agents_changelog_auto_pelunasan, _agents_changelog_reverse_auto_settlement, _agents_changelog_tundaan, _agents_changelog_sudah_diajukan_pengganti [EXTRACTED 1.00]
- **Penegakan kalender kerja di seluruh jalur tanggal** — _agents_changelog_work_day, _agents_changelog_hari_kerja_rule, _agents_changelog_use_hari_libur, _agents_changelog_tanggal_turunan, _agents_changelog_tanggal_rekap_bulan, _agents_changelog_get_last_date_for_hari [EXTRACTED 1.00]
- **Hero/Login Banner Background Composition** — public_18529, public_18529_low_poly_triangle_mosaic, public_18529_crimson_to_white_gradient, public_18529_left_negative_space [INFERRED 0.85]

## Communities (175 total, 66 thin omitted)

### Community 0 - "UI Komponen Umum"
Cohesion: 0.06
Nodes (75): Checkbox(), FilterBar(), HARI_OPTIONS, KELOMPOK_OPTIONS, LinkButton(), Loading(), NoEditOverlay(), SelectList() (+67 more)

### Community 1 - "Badge & Status Tampilan"
Cohesion: 0.09
Nodes (47): BadgeStatus(), variantMap, BargeStatus(), variantMap, FormatNumbering(), StatusPinjaman(), GenerateUser(), BukuTransaksi() (+39 more)

### Community 2 - "Perintah Konsol Agregasi"
Cohesion: 0.07
Nodes (34): TandaiMigrasi, VerifikasiAgregat, PemeriksaAgregat, Carbon, Branch, TransactionLoanOfficerGrouping, Carbon\Carbon, BatchInputAngsuranSeeder (+26 more)

### Community 3 - "Pinjaman & Pindah Resort"
Cohesion: 0.04
Nodes (14): PindahResortController, TransactionLoanInstalmentController, OnlineBranch, TransactionDailyRecap, TransactionLoan, TransactionLoanInstalment, TransactionSirculation, PinjamanTrait (+6 more)

### Community 4 - "Panel Admin & Middleware"
Cohesion: 0.05
Nodes (13): AdminController, MobileAppsMantriController, SetBranchController, TransactionDailyRecapController, TransactionLoanController, RedirectIfAuthenticated, TrustProxies, HariKerja (+5 more)

### Community 5 - "Layout & Navigasi"
Cohesion: 0.06
Nodes (14): Navbar(), AppSidebar(), SweetAlert(), Authenticated(), MobileLayout(), EditableRow(), ManPower(), Permantri() (+6 more)

### Community 6 - "Komponen Form Dasar"
Cohesion: 0.13
Nodes (16): ApplicationLogo(), DangerButton(), InputError(), InputLabel(), Modal(), PrimaryButton(), SecondaryButton(), useServerFilter() (+8 more)

### Community 7 - "AppHelper & Izin Tanggal"
Cohesion: 0.06
Nodes (5): AppHelper, BatchInputController, TransactionCustomer, BatchInputV2Seeder, Int

### Community 8 - "Karyawan & Cakupan Auth"
Cohesion: 0.07
Nodes (16): EmployeeController, LoanController, MantriAppsController, HandleInertiaRequests, Employee, GenerateEmpUserSeeder, Faker\Core\Number, Illuminate\Bus\Batch (+8 more)

### Community 9 - "Dependensi npm"
Cohesion: 0.05
Nodes (40): autoprefixer, axios, @headlessui/react, @inertiajs/react, laravel-vite-plugin, author, devDependencies, autoprefixer (+32 more)

### Community 10 - "Sidebar & Filter Cabang"
Cohesion: 0.12
Nodes (28): GlobalBranchFilter(), data, Separator, Sidebar, SidebarContent, SidebarContext, SidebarFooter, SidebarGroup (+20 more)

### Community 11 - "Gembok Closing Harian"
Cohesion: 0.10
Nodes (5): Gembok, ClosingHarianController, Carbon, TransactionDailyClosing, TransactionLockHistory

### Community 12 - "Kalender Kerja & Job Harian"
Cohesion: 0.09
Nodes (9): CountingDailyBalance, KalenderKerjaController, VIsBalanceLoanWithDailyReport, WorkDay, Carbon, BalancingDailyReport, Illuminate\Support\Facades\Log, Inertia\Inertia (+1 more)

### Community 13 - "Pemilih Tanggal & Drawer"
Cohesion: 0.11
Nodes (24): DatePicker(), cn(), DrawerContent, DrawerDescription, DrawerFooter(), DrawerHeader(), DrawerOverlay, DrawerTitle (+16 more)

### Community 14 - "Mesin Hitung Agregat & Ember"
Cohesion: 0.09
Nodes (5): Ember, HitungAgregat, Carbon, TutupBulanan, self

### Community 15 - "Model Cabang & Kepegawaian"
Cohesion: 0.17
Nodes (9): DebtRelief, Employment, EmploymentPermission, TransactionBranchDailyRecap, TransactionOutReason, UserZone, VIsBalanceDropWithDailyReport, Illuminate\Database\Eloquent\Factories\HasFactory (+1 more)

### Community 16 - "AuthScope & Perkakas Migrasi"
Cohesion: 0.19
Nodes (3): AuthScope, MigrasiController, Carbon

### Community 17 - "User & Cakupan Cabang"
Cohesion: 0.16
Nodes (8): User, BelongsToThrough, Illuminate\Foundation\Auth\User, Illuminate\Notifications\Notifiable, Laravel\Sanctum\HasApiTokens, Spatie\Permission\Traits\HasPermissions, Spatie\Permission\Traits\HasRoles, ProfileTest

### Community 18 - "RBAC Multi-Cabang (rancangan)"
Cohesion: 0.14
Nodes (18): AuthScope::resolve(), employee_branches (pivot delegasi multi-cabang), employee_zones (pivot multi-zona staf kontrol), Global Branch Scope Flow, Modul F — Panel Admin & Multi-Cabang/Multi-Zona RBAC, SetBranchController (POST /set-branch), AuthScope (helper scope terpusat, rancangan), employment_permissions (mekanisme multi-cabang lama, DEPRECATED) (+10 more)

### Community 19 - "Catatan Perubahan Buku Transaksi"
Cohesion: 0.13
Nodes (17): Aturan wajib pencatatan perubahan (fungsi, route, tabel), Cutover kantor percontohan Karawang 2, FilterBar (chip filter instan + localStorage), PinjamanTrait::getTransactionLoan(), Konsolidasi halaman Buku Transaksi jadi satu halaman responsif, Kunci Reset & Hapus berdasarkan approval rekap (daily_kepala_approval), Kuota ML sebagai PALANG, bukan perbandingan berulang, branches.mulai_pendataan_baru (batas migrasi per kantor) (+9 more)

### Community 20 - "Konfigurasi shadcn"
Cohesion: 0.12
Nodes (16): aliases, components, hooks, lib, ui, utils, rsc, $schema (+8 more)

### Community 21 - "Badge Aplikasi & Varian"
Cohesion: 0.23
Nodes (10): AppBadge, appBadgeVariants, VARIAN_JENIS, VARIAN_STATUS, varianJenis(), varianStatus(), Action(), BukuTransaksiKepala() (+2 more)

### Community 22 - "Aturan Gerbang & Pelunasan Otomatis"
Cohesion: 0.16
Nodes (15): Auto-pelunasan pinjaman lama saat top-up berhasil drop, AppHelper::canDeleteLoan(), TransactionLoanController::checkpengajuan(), AppHelper::havePermissionByDate() dan bug E1, NoEditOverlay (pola overlay lama, ditinggalkan), Pola gerbang: kontrol tetap tampil, disabled + keterangan, transaction_loans.postponed_loan_id (Tundaan), transaction_loans.previous_loan_id (top-up / refinance) (+7 more)

### Community 23 - "Autentikasi Bawaan Laravel"
Cohesion: 0.17
Nodes (6): ConfirmablePasswordController, EmailVerificationPromptController, PasswordResetLinkController, Illuminate\Support\Facades\Password, Illuminate\Validation\ValidationException, Inertia\Response

### Community 24 - "Event & Uji Autentikasi"
Cohesion: 0.13
Nodes (8): EventServiceProvider, Illuminate\Auth\Events\Registered, Illuminate\Auth\Events\Verified, Illuminate\Auth\Listeners\SendEmailVerificationNotification, Illuminate\Foundation\Support\Providers\EventServiceProvider, Illuminate\Support\Facades\Event, Illuminate\Support\Facades\URL, EmailVerificationTest

### Community 26 - "Job Perhitungan Saldo"
Cohesion: 0.30
Nodes (7): CountingBalance, CountingCirculation, Illuminate\Bus\Queueable, Illuminate\Contracts\Queue\ShouldQueue, Illuminate\Foundation\Bus\Dispatchable, Illuminate\Queue\InteractsWithQueue, Illuminate\Queue\SerializesModels

### Community 27 - "Docker & Aturan Migrasi"
Cohesion: 0.21
Nodes (13): Jangan jalankan php artisan test (phpunit menghantam ubmi_db produksi), Aturan single source of truth: migrasi wajib dari app_laravel, app_laravel_laravel-network (external shared network), unit-app-service (PHP-FPM container), unit-vite (Node 20 dev server, port 5174), unit-web (nginx, port 8080), Urutan Eksekusi 4 Fase yang Backward-Compatible, Asumsi lama: 1 karyawan = 1 cabang (+5 more)

### Community 28 - "Community 28"
Cohesion: 0.17
Nodes (3): TransactionManageCustomer, Staudenmeir\EloquentHasManyDeep\HasRelationships, Znck\Eloquent\Traits\BelongsToThrough

### Community 29 - "Community 29"
Cohesion: 0.24
Nodes (4): LoginRequest, ProfileUpdateRequest, Illuminate\Auth\Events\Lockout, Illuminate\Foundation\Http\FormRequest

### Community 30 - "Community 30"
Cohesion: 0.17
Nodes (12): require, guzzlehttp/guzzle, inertiajs/inertia-laravel, laravel/framework, laravel/sanctum, laravel/tinker, php, predis/predis (+4 more)

### Community 31 - "Community 31"
Cohesion: 0.23
Nodes (9): DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut(), DropdownMenuSubContent (+1 more)

### Community 33 - "Community 33"
Cohesion: 0.24
Nodes (5): AuthenticatedSessionController, ProfileController, Illuminate\Contracts\Auth\MustVerifyEmail, Illuminate\Http\RedirectResponse, Illuminate\Support\Facades\Redirect

### Community 34 - "Community 34"
Cohesion: 0.24
Nodes (5): AppServiceProvider, BroadcastServiceProvider, Illuminate\Routing\UrlGenerator, Illuminate\Support\Facades\Broadcast, Illuminate\Support\ServiceProvider

### Community 35 - "Community 35"
Cohesion: 0.24
Nodes (4): TransactionCustomerFactory, TransactionManageCustomerFactory, UserFactory, Illuminate\Database\Eloquent\Factories\Factory

### Community 36 - "Community 36"
Cohesion: 0.22
Nodes (4): Illuminate\Foundation\Testing\TestCase, AuthenticationTest, ExampleTest, TestCase

### Community 37 - "Community 37"
Cohesion: 0.29
Nodes (8): Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut()

### Community 38 - "Community 38"
Cohesion: 0.27
Nodes (10): Rancangan agregasi rekap v2, AgregasiScope (gerbang pemilih agregasi lama vs baru), TransactionDailyRecapController@ceklist_kepala (penulis rekap tunggal), Penyakit dua sumber kebenaran berebut (hook vs controller), Grain per (grouping, hari), bukan per mantri, WorkDay::tanggalRekapBulan() (hari kerja + tanggal berdata), WorkDay / work_days (kalender kerja nasional), ceklist_kepala (Approval Rekap oleh Pimpinan) (+2 more)

### Community 39 - "Community 39"
Cohesion: 0.20
Nodes (10): HandleInertiaRequests::share() prop global auth.roles, AuthScope::resolve() (dipakai memperbaiki getLoanMacet), BatchInputController dibatasi superuser (pastikanSuperuser), PinjamanTrait::getLoanMacet() / getLoanByDate(), Ghost permission (nama permission tak ada di tabel permissions), InputMacet.jsx + store_buku_transaksi_batch (jalur nasabah lama), Alias middleware role: tidak terdaftar di Kernel, useFrontEndPermission hook (DIHAPUS, 5 flag selalu false) (+2 more)

### Community 40 - "Community 40"
Cohesion: 0.22
Nodes (10): Ember (6 ember penyimpanan, 4 kategori tampilan), Gembok harian ditegakkan lewat trigger DB, AppHelper::generateStatusAngsuran() (4 nilai, alur lama), Generated column STORED (bukan VIRTUAL) & keluar dari $fillable, HitungAgregat (mesin penghitung agregat harian), Hook rekap otomatis dicabut dari model, transaction_loans.pinjaman adalah generated column (nominal_drop * 1.3), transaction_daily_closings (agregat harian) (+2 more)

### Community 41 - "Community 41"
Cohesion: 0.24
Nodes (5): RouteServiceProvider, Illuminate\Cache\RateLimiting\Limit, Illuminate\Foundation\Support\Providers\RouteServiceProvider, Illuminate\Support\Facades\RateLimiter, Illuminate\Support\Facades\Route

### Community 42 - "Community 42"
Cohesion: 0.20
Nodes (4): NewPasswordController, Illuminate\Auth\Events\PasswordReset, Illuminate\Support\Str, Illuminate\Validation\Rules

### Community 44 - "Community 44"
Cohesion: 0.20
Nodes (9): description, extra, laravel, dont-discover, license, minimum-stability, name, prefer-stable (+1 more)

### Community 45 - "Community 45"
Cohesion: 0.20
Nodes (10): require-dev, barryvdh/laravel-debugbar, fakerphp/faker, laravel/breeze, laravel/pint, laravel/sail, mockery/mockery, nunomaduro/collision (+2 more)

### Community 46 - "Community 46"
Cohesion: 0.20
Nodes (10): scripts, post-autoload-dump, post-create-project-cmd, post-root-package-install, post-update-cmd, Illuminate\\Foundation\\ComposerScripts::postAutoloadDump, @php artisan key:generate --ansi, @php artisan package:discover --ansi (+2 more)

### Community 47 - "Community 47"
Cohesion: 0.31
Nodes (7): SheetContent, SheetDescription, SheetFooter(), SheetHeader(), SheetOverlay, SheetTitle, sheetVariants

### Community 48 - "Community 48"
Cohesion: 0.25
Nodes (9): getLastDateForHari() (JS, lib/utils.js), AppHelper::getStortingShowDate() / getNumbDays() (PHP), app/Rules/HariKerja.php (satu Rule, tujuh pintu), Pelajaran: setiap tanggal turunan wajib dicari dan diperiksa, Bug TDZ useHariLibur di atas useForm, useHariLibur (mundurKeHariKerja / majuKeHariKerja), action_buku_transaksi (ACC / Drop / Tolak / Batal), generateUnknownNik / callUnknownNik (+1 more)

### Community 49 - "Community 49"
Cohesion: 0.33
Nodes (6): EmailVerificationNotificationController, Controller, Illuminate\Foundation\Auth\Access\AuthorizesRequests, Illuminate\Foundation\Bus\DispatchesJobs, Illuminate\Foundation\Validation\ValidatesRequests, Illuminate\Routing\Controller

### Community 51 - "Community 51"
Cohesion: 0.22
Nodes (9): class-variance-authority, dependencies, class-variance-authority, @radix-ui/react-popover, @radix-ui/react-scroll-area, @tanstack/react-table, @radix-ui/react-popover, @radix-ui/react-scroll-area (+1 more)

### Community 52 - "Community 52"
Cohesion: 0.28
Nodes (3): Illuminate\Foundation\Testing\RefreshDatabase, PasswordUpdateTest, RegistrationTest

### Community 53 - "Community 53"
Cohesion: 0.25
Nodes (3): PasswordController, RegisteredUserController, Illuminate\Validation\Rules\Password

### Community 55 - "Community 55"
Cohesion: 0.25
Nodes (3): Illuminate\Auth\Notifications\ResetPassword, Illuminate\Support\Facades\Notification, PasswordResetTest

### Community 62 - "Community 62"
Cohesion: 0.29
Nodes (6): compilerOptions, baseUrl, paths, exclude, node_modules, public

### Community 63 - "Community 63"
Cohesion: 0.40
Nodes (3): Kernel, Illuminate\Console\Scheduling\Schedule, Illuminate\Foundation\Console\Kernel

### Community 66 - "Community 66"
Cohesion: 0.33
Nodes (6): pestphp/pest-plugin, config, allow-plugins, optimize-autoloader, preferred-install, sort-packages

### Community 67 - "Community 67"
Cohesion: 0.33
Nodes (6): 8 Permission Inti, Modul E — Administrasi Karyawan (Manpower), Matriks Otorisasi Berdasarkan Jabatan, Pemetaan 7 Role Baru, Desain permission inti baru (17 → 6/8), Prinsip: jabatan menentukan kemampuan, delegasi cabang menentukan jangkauan

### Community 68 - "Community 68"
Cohesion: 0.53
Nodes (6): Abstract Pink Low-Poly Background Asset (18529.jpg), Right-to-Left Crimson-to-White Gradient, Decorative Chrome Asset (No Semantic Content), Left-Side Negative Space Reserved for Overlay Content, Low-Poly Triangle Mosaic Pattern, public/ Static Asset Root

### Community 70 - "Community 70"
Cohesion: 0.40
Nodes (3): Handler, Illuminate\Foundation\Exceptions\Handler, Throwable

### Community 72 - "Community 72"
Cohesion: 0.40
Nodes (5): autoload, psr-4, App\\, Database\\Factories\\, Database\\Seeders\\

### Community 73 - "Community 73"
Cohesion: 0.40
Nodes (4): Monolog\Formatter\JsonFormatter, Monolog\Handler\NullHandler, Monolog\Handler\StreamHandler, Monolog\Handler\SyslogUdpHandler

### Community 84 - "Community 84"
Cohesion: 0.67
Nodes (3): AppBadge + appBadgeVariants, AppButton + appButtonVariants, statusVariants.js (VARIAN_STATUS / varianStatus)

### Community 91 - "Community 91"
Cohesion: 0.67
Nodes (3): autoload-dev, psr-4, Tests\\

### Community 92 - "Community 92"
Cohesion: 0.67
Nodes (3): keywords, framework, laravel

## Ambiguous Edges - Review These
- `ubmiapps (README)` → `robots.txt Allow-All Policy`  [AMBIGUOUS]
  public/robots.txt · relation: conceptually_related_to

## Knowledge Gaps
- **158 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+153 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 532 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **66 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `ubmiapps (README)` and `robots.txt Allow-All Policy`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `AppHelper` connect `AppHelper & Izin Tanggal` to `Perintah Konsol Agregasi`, `Pinjaman & Pindah Resort`, `Panel Admin & Middleware`, `Karyawan & Cakupan Auth`, `Kalender Kerja & Job Harian`, `Mesin Hitung Agregat & Ember`, `Community 28`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Why does `TransactionLoan` connect `Pinjaman & Pindah Resort` to `Perintah Konsol Agregasi`, `Panel Admin & Middleware`, `AppHelper & Izin Tanggal`, `Karyawan & Cakupan Auth`, `Kalender Kerja & Job Harian`, `Model Cabang & Kepegawaian`, `Community 28`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Why does `User` connect `User & Cakupan Cabang` to `Panel Admin & Middleware`, `Community 36`, `Karyawan & Cakupan Auth`, `Community 74`, `Kalender Kerja & Job Harian`, `Mesin Hitung Agregat & Ember`, `Model Cabang & Kepegawaian`, `Community 52`, `Community 53`, `Community 55`, `Event & Uji Autentikasi`, `Community 28`, `Community 29`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _158 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `UI Komponen Umum` be split into smaller, more focused modules?**
  _Cohesion score 0.05976782151278796 - nodes in this community are weakly interconnected._
- **Should `Badge & Status Tampilan` be split into smaller, more focused modules?**
  _Cohesion score 0.08827319587628867 - nodes in this community are weakly interconnected._