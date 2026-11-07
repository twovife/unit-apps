# Graph Report - unit-apps  (2026-09-02)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 2025 nodes · 7441 edges · 181 communities (69 shown, 64 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 349 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `81905ee5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- AuthenticatedLayout.jsx
- button.jsx
- utils-DzFuPzol.js
- cn
- table.jsx
- Action-BRfUe2Tq.js
- Branch
- button-MTjEwktD.js
- InputError.jsx
- ssr.js
- Carbon\Carbon
- AppHelper
- InputLabel-BhdXf1ED.js
- Illuminate\Support\Facades\DB
- NewAngsuran/Components/Action.jsx
- Illuminate\Database\Eloquent\Model
- TransactionLoan
- devDependencies
- cn
- label-F4MKz6SO.js
- dependencies
- Employee
- Illuminate\Http\Request
- TransactionDailyClosing
- TransactionLoanInstalment
- TransactionDailyRecap
- sidebar.jsx
- User
- Illuminate\Database\Seeder
- TransactionLoanOfficerGrouping
- FastCreateV2-CLoF8of8.js
- BukuTransaksiKepala.jsx
- AppSidebar.jsx
- components.json
- Inertia\Response
- MobileAppsMantriController
- LoanController.php
- EmailVerificationTest.php
- Illuminate\Database\Eloquent\Factories\Factory
- GlobalBranchFilter.jsx
- Sidebar.jsx
- RouteServiceProvider
- ClosingHarianController
- CountingBalance.php
- Illuminate\Http\RedirectResponse
- require
- package.json
- HitungAgregat
- AppServiceProvider
- ActionTable-C05_T-Rr.js
- TestCase
- Controller
- TransactionManageCustomer
- TransactionSaldoAdjustment
- composer.json
- require-dev
- scripts
- sheet.jsx
- HitungClosing.php
- web.php
- Ember
- AdminController
- TransactionLoanInstalmentController
- Loan
- Illuminate\Foundation\Testing\RefreshDatabase
- VIsBalanceLoanWithDailyReport
- RegisteredUserController.php
- TransactionDailyRecapController
- PasswordResetTest
- .handle
- LoanRequest
- Illuminate\Database\Migrations\Migration
- Illuminate\Database\Schema\Blueprint
- Illuminate\Support\Facades\Schema
- compilerOptions
- Kernel
- HandleInertiaRequests.php
- LoginRequest
- Customer
- config
- Dropdown.jsx
- Handler
- EmployeeBranch
- i
- psr-4
- logging.php
- KesiapanClosing.jsx
- SerahTerima.jsx
- PasswordConfirmationTest
- Authenticate
- TrustHosts
- EmployeeZone
- AuthServiceProvider
- CreatesApplication
- ExampleTest
- BatchInput/Index.jsx
- StatusPengajuan.jsx
- Kernel
- EncryptCookies
- PreventRequestsDuringMaintenance
- TrimStrings
- TrustProxies.php
- ValidateSignature
- VerifyCsrfToken
- autoload-dev
- keywords
- console.php
- clsx
- cmdk
- config/app.php
- sanctum.php
- date-fns
- dayjs
- entrypoint.sh
- entrypoint.dev.sh
- index.php
- input-otp
- lucide-react
- papaparse
- @radix-ui/react-dialog
- @radix-ui/react-icons
- @radix-ui/react-label
- @radix-ui/react-scroll-area
- @radix-ui/react-slot
- @radix-ui/react-tooltip
- react-day-picker
- react-number-format
- sweetalert2-react-content
- tailwind-merge
- tailwindcss-animate
- @tanstack/react-table
- vaul
- tailwind.config.js

## God Nodes (most connected - your core abstractions)
1. `cn()` - 130 edges
2. `cn()` - 104 edges
3. `TransactionLoan` - 91 edges
4. `AppHelper` - 78 edges
5. `TransactionLoanOfficerGrouping` - 67 edges
6. `Button` - 64 edges
7. `Authenticated()` - 54 edges
8. `Button` - 54 edges
9. `Loading()` - 51 edges
10. `TransactionDailyClosing` - 47 edges

## Surprising Connections (you probably didn't know these)
- `BatchUpdate()` --indirect_call--> `Authenticated()`  [INFERRED]
  bootstrap/ssr/assets/BatchUpdate-Nxa6MAWU.js → bootstrap/ssr/assets/AuthenticatedLayout-Cp-Ywcjq.js
- `Action()` --indirect_call--> `Checkbox()`  [INFERRED]
  bootstrap/ssr/assets/Action-DaTCdMbi.js → bootstrap/ssr/assets/Checkbox-DLnjqb3e.js
- `Approval()` --indirect_call--> `Checkbox()`  [INFERRED]
  bootstrap/ssr/assets/Approval-D9gJ0K-F.js → bootstrap/ssr/assets/Checkbox-DLnjqb3e.js
- `ApprovalAkhir()` --indirect_call--> `Checkbox()`  [INFERRED]
  bootstrap/ssr/assets/ApprovalAkhir-CoeltRBs.js → bootstrap/ssr/assets/Checkbox-DLnjqb3e.js
- `BayarAngsuran()` --indirect_call--> `Checkbox()`  [INFERRED]
  bootstrap/ssr/assets/BayarAngsuran-EwvV0On8.js → bootstrap/ssr/assets/Checkbox-DLnjqb3e.js

## Import Cycles
- None detected.

## Communities (181 total, 64 thin omitted)

### Community 0 - "AuthenticatedLayout.jsx"
Cohesion: 0.05
Nodes (39): FilterBar(), HARI_OPTIONS, KELOMPOK_OPTIONS, LinkButton(), DatePicker(), SearchComponent(), SelectList(), SweetAlert() (+31 more)

### Community 1 - "button.jsx"
Cohesion: 0.10
Nodes (40): Loading(), NoEditOverlay(), AppButton, appButtonVariants, HARI_KE_ANGKA, NAMA_BULAN, NAMA_HARI, TanggalKerja() (+32 more)

### Community 2 - "utils-DzFuPzol.js"
Cohesion: 0.10
Nodes (53): AccordionContent, AccordionItem, AccordionTrigger, AngsuranTableMobile(), Approval(), Authenticated(), BadgeStatus(), ButtonAngsuran() (+45 more)

### Community 3 - "cn"
Cohesion: 0.06
Nodes (71): AppSidebar(), GlobalBranchFilter(), Navbar(), SidebarSubMenuSection(), SweetAlert(), CardFooter, Command, CommandEmpty (+63 more)

### Community 4 - "table.jsx"
Cohesion: 0.15
Nodes (26): BadgeStatus(), variantMap, BargeStatus(), variantMap, FormatNumbering(), Approval(), STATUS, PemeriksaanAgregat() (+18 more)

### Community 5 - "Action-BRfUe2Tq.js"
Cohesion: 0.17
Nodes (35): Action(), Field(), LoanDetail(), StatusPinjaman(), tanggal(), Toaster(), Angsuran(), AngsuranByDate() (+27 more)

### Community 6 - "Branch"
Cohesion: 0.07
Nodes (13): GenerateClosingRows, TandaiMigrasi, VerifikasiAgregat, AgregasiScope, Carbon, AuthScope, PemeriksaAgregat, SerahTerima (+5 more)

### Community 7 - "button-MTjEwktD.js"
Cohesion: 0.17
Nodes (29): Action(), variantMap, BargeStatus(), variantMap, Content(), Index(), Index(), _Indexs() (+21 more)

### Community 8 - "InputError.jsx"
Cohesion: 0.13
Nodes (17): ApplicationLogo(), Checkbox(), DangerButton(), InputError(), InputLabel(), Modal(), PrimaryButton(), SecondaryButton() (+9 more)

### Community 9 - "ssr.js"
Cohesion: 0.13
Nodes (26): Acc(), Action(), BukuTransaksi(), Amount(), BukuTransaksiKepala(), ChangeDetail(), Create(), DeleteLoan() (+18 more)

### Community 10 - "Carbon\Carbon"
Cohesion: 0.08
Nodes (11): DaftarMigrasi, Carbon, KalenderKerja, Carbon, KalenderKerjaController, RedirectIfAuthenticated, WorkDay, Carbon (+3 more)

### Community 11 - "AppHelper"
Cohesion: 0.07
Nodes (5): AppHelper, BatchInputController, BatchInputV2Seeder, Int, self

### Community 12 - "InputLabel-BhdXf1ED.js"
Cohesion: 0.19
Nodes (24): BatchUpdate(), useServerFilter(), Checkbox(), ConfirmPassword(), DangerButton(), DeleteUserForm(), Modal(), SecondaryButton() (+16 more)

### Community 13 - "Illuminate\Support\Facades\DB"
Cohesion: 0.13
Nodes (11): TransactionCustomer, BatchInputSeeder, ChangeNasabahGroupingSeeder, NasabahGrs3Seeder, UpdateSeeder, Exception, Illuminate\Database\Console\Seeds\WithoutModelEvents, Illuminate\Support\Facades\DB (+3 more)

### Community 14 - "NewAngsuran/Components/Action.jsx"
Cohesion: 0.12
Nodes (19): StatusPinjaman(), NAMA_HARI, GenerateUser(), BarisKelompok(), Harian(), rupiah(), LoanDetail(), tanggal() (+11 more)

### Community 15 - "Illuminate\Database\Eloquent\Model"
Cohesion: 0.13
Nodes (10): DebtRelief, Employment, EmploymentPermission, Instalment, TransactionBranchDailyRecap, TransactionOutReason, TransactionWhiteOff, UserZone (+2 more)

### Community 16 - "TransactionLoan"
Cohesion: 0.08
Nodes (7): TransactionLoan, LunasinSeeder, asdfg, LunasSeeder, DateTimeInterface, Spatie\Permission\Models\Permission, Staudenmeir\EloquentHasManyDeep\HasRelationships

### Community 17 - "devDependencies"
Cohesion: 0.07
Nodes (29): autoprefixer, axios, @headlessui/react, @inertiajs/react, laravel-vite-plugin, devDependencies, autoprefixer, axios (+21 more)

### Community 18 - "cn"
Cohesion: 0.12
Nodes (23): cn(), DialogFooter(), DialogOverlay, DrawerContent, DrawerDescription, DrawerFooter(), DrawerHeader(), DrawerOverlay (+15 more)

### Community 19 - "label-F4MKz6SO.js"
Cohesion: 0.28
Nodes (16): AssignRoles(), Card, CardContent, CardDescription, CardHeader, CardTitle, GenerateUser(), Index() (+8 more)

### Community 20 - "dependencies"
Cohesion: 0.07
Nodes (27): class-variance-authority, hamburger-react, next-themes, dependencies, class-variance-authority, hamburger-react, next-themes, @radix-ui/react-accordion (+19 more)

### Community 21 - "Employee"
Cohesion: 0.12
Nodes (5): EmployeeController, Employee, GenerateEmpUserSeeder, Faker\Core\Number, Illuminate\Bus\Batch

### Community 22 - "Illuminate\Http\Request"
Cohesion: 0.17
Nodes (3): TransactionLoanController, HariKerja, Illuminate\Http\Request

### Community 23 - "TransactionDailyClosing"
Cohesion: 0.12
Nodes (3): Gembok, TransactionDailyClosing, TransactionLockHistory

### Community 24 - "TransactionLoanInstalment"
Cohesion: 0.11
Nodes (6): PindahResortController, TransactionLoanInstalment, DeleteAngsuranSeeder, GantiMantriSeeder, KeubahSeeder, MoveAreaSeeder

### Community 25 - "TransactionDailyRecap"
Cohesion: 0.15
Nodes (6): TransactionDailyRecap, TransactionSirculation, RekapTrait, BalancingTargetSeeder, CompareSeeder, PHPUnit\TextUI\Output\SummaryPrinter

### Community 26 - "sidebar.jsx"
Cohesion: 0.12
Nodes (16): useIsMobile(), Separator, SidebarContext, SidebarFooter, SidebarGroupAction, SidebarGroupContent, SidebarGroupLabel, SidebarInput (+8 more)

### Community 27 - "User"
Cohesion: 0.16
Nodes (8): User, BelongsToThrough, Illuminate\Foundation\Auth\User, Illuminate\Notifications\Notifiable, Laravel\Sanctum\HasApiTokens, Spatie\Permission\Traits\HasPermissions, Spatie\Permission\Traits\HasRoles, ProfileTest

### Community 28 - "Illuminate\Database\Seeder"
Cohesion: 0.13
Nodes (9): BalancingDailyReport, DailySeeder, EmploymentSeeder, CompareSeeder, GenerateTotalSeeder, LunasinMLGantung, SalahPemutihan, UpdateManageSeeder (+1 more)

### Community 29 - "TransactionLoanOfficerGrouping"
Cohesion: 0.14
Nodes (6): OnlineBranch, TransactionLoanOfficerGrouping, BatchInputAngsuranSeeder, ChangeWrongDateGlobalSeeder, PindahTotalResotSeeder, SirkulasiSeeder

### Community 30 - "FastCreateV2-CLoF8of8.js"
Cohesion: 0.29
Nodes (13): BatchUpload(), FastCreateV2(), InputMacet(), LinkButton(), NewNasabah(), NoEditOverlay(), PengajuanLama(), RiwayatPengajuan() (+5 more)

### Community 31 - "BukuTransaksiKepala.jsx"
Cohesion: 0.20
Nodes (10): AppBadge, appBadgeVariants, VARIAN_JENIS, VARIAN_STATUS, varianJenis(), varianStatus(), Action(), BukuTransaksiKepala() (+2 more)

### Community 32 - "AppSidebar.jsx"
Cohesion: 0.19
Nodes (14): data, Sidebar, SidebarContent, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, sidebarMenuButtonVariants (+6 more)

### Community 33 - "components.json"
Cohesion: 0.12
Nodes (16): aliases, components, hooks, lib, ui, utils, rsc, $schema (+8 more)

### Community 34 - "Inertia\Response"
Cohesion: 0.17
Nodes (7): ConfirmablePasswordController, NewPasswordController, PasswordResetLinkController, Illuminate\Auth\Events\PasswordReset, Illuminate\Support\Facades\Password, Illuminate\Validation\ValidationException, Inertia\Response

### Community 36 - "LoanController.php"
Cohesion: 0.16
Nodes (8): LoanController, ProfileController, ProfileUpdateRequest, Illuminate\Contracts\Auth\MustVerifyEmail, Illuminate\Foundation\Http\FormRequest, Illuminate\Support\Collection, Illuminate\Support\Facades\Redirect, Illuminate\Validation\Rule

### Community 37 - "EmailVerificationTest.php"
Cohesion: 0.13
Nodes (8): EventServiceProvider, Illuminate\Auth\Events\Registered, Illuminate\Auth\Events\Verified, Illuminate\Auth\Listeners\SendEmailVerificationNotification, Illuminate\Foundation\Support\Providers\EventServiceProvider, Illuminate\Support\Facades\Event, Illuminate\Support\Facades\URL, EmailVerificationTest

### Community 38 - "Illuminate\Database\Eloquent\Factories\Factory"
Cohesion: 0.16
Nodes (5): TransactionCustomerFactory, TransactionManageCustomerFactory, UserFactory, Illuminate\Database\Eloquent\Factories\Factory, Illuminate\Support\Str

### Community 39 - "GlobalBranchFilter.jsx"
Cohesion: 0.20
Nodes (11): GlobalBranchFilter(), Navbar(), Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList (+3 more)

### Community 40 - "Sidebar.jsx"
Cohesion: 0.21
Nodes (10): AppSidebar(), DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut() (+2 more)

### Community 41 - "RouteServiceProvider"
Cohesion: 0.18
Nodes (7): RouteServiceProvider, Illuminate\Auth\Events\Lockout, Illuminate\Cache\RateLimiting\Limit, Illuminate\Foundation\Support\Providers\RouteServiceProvider, Illuminate\Support\Facades\Auth, Illuminate\Support\Facades\RateLimiter, Illuminate\Support\Facades\Route

### Community 43 - "CountingBalance.php"
Cohesion: 0.30
Nodes (7): CountingBalance, CountingCirculation, Illuminate\Bus\Queueable, Illuminate\Contracts\Queue\ShouldQueue, Illuminate\Foundation\Bus\Dispatchable, Illuminate\Queue\InteractsWithQueue, Illuminate\Queue\SerializesModels

### Community 44 - "Illuminate\Http\RedirectResponse"
Cohesion: 0.22
Nodes (5): AuthenticatedSessionController, EmailVerificationNotificationController, EmailVerificationPromptController, PasswordController, Illuminate\Http\RedirectResponse

### Community 45 - "require"
Cohesion: 0.17
Nodes (12): require, guzzlehttp/guzzle, inertiajs/inertia-laravel, laravel/framework, laravel/sanctum, laravel/tinker, php, predis/predis (+4 more)

### Community 46 - "package.json"
Cohesion: 0.17
Nodes (11): author, license, main, name, private, repository, scripts, build (+3 more)

### Community 48 - "AppServiceProvider"
Cohesion: 0.24
Nodes (5): AppServiceProvider, BroadcastServiceProvider, Illuminate\Routing\UrlGenerator, Illuminate\Support\Facades\Broadcast, Illuminate\Support\ServiceProvider

### Community 49 - "ActionTable-C05_T-Rr.js"
Cohesion: 0.25
Nodes (10): ActionTable(), ActionTable$1, Field(), tanggal(), VARIAN_JENIS, VARIAN_STATUS, varianJenis(), varianStatus() (+2 more)

### Community 50 - "TestCase"
Cohesion: 0.22
Nodes (4): Illuminate\Foundation\Testing\TestCase, AuthenticationTest, ExampleTest, TestCase

### Community 51 - "Controller"
Cohesion: 0.31
Nodes (7): VerifyEmailController, Controller, Illuminate\Foundation\Auth\Access\AuthorizesRequests, Illuminate\Foundation\Auth\EmailVerificationRequest, Illuminate\Foundation\Bus\DispatchesJobs, Illuminate\Foundation\Validation\ValidatesRequests, Illuminate\Routing\Controller

### Community 54 - "composer.json"
Cohesion: 0.20
Nodes (9): description, extra, laravel, dont-discover, license, minimum-stability, name, prefer-stable (+1 more)

### Community 55 - "require-dev"
Cohesion: 0.20
Nodes (10): require-dev, barryvdh/laravel-debugbar, fakerphp/faker, laravel/breeze, laravel/pint, laravel/sail, mockery/mockery, nunomaduro/collision (+2 more)

### Community 56 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, post-autoload-dump, post-create-project-cmd, post-root-package-install, post-update-cmd, Illuminate\\Foundation\\ComposerScripts::postAutoloadDump, @php artisan key:generate --ansi, @php artisan package:discover --ansi (+2 more)

### Community 57 - "sheet.jsx"
Cohesion: 0.31
Nodes (7): SheetContent, SheetDescription, SheetFooter(), SheetHeader(), SheetOverlay, SheetTitle, sheetVariants

### Community 59 - "web.php"
Cohesion: 0.22
Nodes (4): MantriAppsController, SetBranchController, Illuminate\Foundation\Application, Illuminate\Support\Facades\Session

### Community 64 - "Illuminate\Foundation\Testing\RefreshDatabase"
Cohesion: 0.28
Nodes (3): Illuminate\Foundation\Testing\RefreshDatabase, PasswordUpdateTest, RegistrationTest

### Community 65 - "VIsBalanceLoanWithDailyReport"
Cohesion: 0.36
Nodes (3): CountingDailyBalance, VIsBalanceDropWithDailyReport, VIsBalanceLoanWithDailyReport

### Community 66 - "RegisteredUserController.php"
Cohesion: 0.25
Nodes (4): RegisteredUserController, Illuminate\Support\Facades\Hash, Illuminate\Validation\Rules, Illuminate\Validation\Rules\Password

### Community 68 - "PasswordResetTest"
Cohesion: 0.25
Nodes (3): Illuminate\Auth\Notifications\ResetPassword, Illuminate\Support\Facades\Notification, PasswordResetTest

### Community 74 - "compilerOptions"
Cohesion: 0.29
Nodes (6): compilerOptions, baseUrl, paths, exclude, node_modules, public

### Community 75 - "Kernel"
Cohesion: 0.40
Nodes (3): Kernel, Illuminate\Console\Scheduling\Schedule, Illuminate\Foundation\Console\Kernel

### Community 76 - "HandleInertiaRequests.php"
Cohesion: 0.40
Nodes (3): HandleInertiaRequests, Inertia\Middleware, Tightenco\Ziggy\Ziggy

### Community 79 - "config"
Cohesion: 0.33
Nodes (6): pestphp/pest-plugin, config, allow-plugins, optimize-autoloader, preferred-install, sort-packages

### Community 81 - "Handler"
Cohesion: 0.40
Nodes (3): Handler, Illuminate\Foundation\Exceptions\Handler, Throwable

### Community 83 - "i"
Cohesion: 0.50
Nodes (5): i(), n(), o(), u(), e2()

### Community 84 - "psr-4"
Cohesion: 0.40
Nodes (5): autoload, psr-4, App\\, Database\\Factories\\, Database\\Seeders\\

### Community 85 - "logging.php"
Cohesion: 0.40
Nodes (4): Monolog\Formatter\JsonFormatter, Monolog\Handler\NullHandler, Monolog\Handler\StreamHandler, Monolog\Handler\SyslogUdpHandler

### Community 87 - "SerahTerima.jsx"
Cohesion: 0.60
Nodes (3): rupiah(), SelZ(), SerahTerima()

### Community 105 - "autoload-dev"
Cohesion: 0.67
Nodes (3): autoload-dev, psr-4, Tests\\

### Community 106 - "keywords"
Cohesion: 0.67
Nodes (3): keywords, framework, laravel

## Knowledge Gaps
- **157 isolated node(s):** `HARI_OPTIONS`, `KELOMPOK_OPTIONS`, `HARI_KE_ANGKA`, `NAMA_BULAN`, `NAMA_HARI` (+152 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 533 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **64 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `TransactionLoan` connect `TransactionLoan` to `TransactionDailyRecapController`, `MobileAppsMantriController`, `AppHelper`, `Illuminate\Support\Facades\DB`, `Illuminate\Database\Eloquent\Model`, `TransactionLoanOfficerGrouping`, `TransactionManageCustomer`, `Illuminate\Http\Request`, `TransactionLoanInstalment`, `TransactionDailyRecap`, `web.php`, `Illuminate\Database\Seeder`, `AdminController`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **Why does `User` connect `User` to `Illuminate\Foundation\Testing\RefreshDatabase`, `RegisteredUserController.php`, `LoanController.php`, `EmailVerificationTest.php`, `PasswordResetTest`, `AppHelper`, `Illuminate\Support\Facades\DB`, `Illuminate\Database\Eloquent\Model`, `TestCase`, `TransactionManageCustomer`, `Employee`, `PasswordConfirmationTest`, `AdminController`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `AuthenticatedLayout.jsx`, `button.jsx`, `AppSidebar.jsx`, `table.jsx`, `GlobalBranchFilter.jsx`, `Sidebar.jsx`, `NewAngsuran/Components/Action.jsx`, `sheet.jsx`, `sidebar.jsx`, `BukuTransaksiKepala.jsx`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **What connects `HARI_OPTIONS`, `KELOMPOK_OPTIONS`, `HARI_KE_ANGKA` to the rest of the system?**
  _157 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `AuthenticatedLayout.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0547008547008547 - nodes in this community are weakly interconnected._
- **Should `button.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09907407407407408 - nodes in this community are weakly interconnected._
- **Should `utils-DzFuPzol.js` be split into smaller, more focused modules?**
  _Cohesion score 0.09873417721518987 - nodes in this community are weakly interconnected._