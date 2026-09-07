# Graph Report - unit-apps  (2026-09-07)

## Corpus Check
- 396 files · ~172,091 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1509 nodes · 4278 edges · 122 communities (48 shown, 31 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 73 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

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
- Community 22
- Community 23
- Community 24
- Community 25
- Community 26
- Community 27
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
- Community 67
- Community 68
- Community 69
- Community 70
- Community 71
- Community 72
- Community 73
- Community 74
- Community 90
- Community 91
- Community 92
- Community 93
- Community 94

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
- `Kunci Reset & Hapus berdasarkan approval rekap (daily_kepala_approval)` --references--> `ceklist_kepala (Approval Rekap oleh Pimpinan)`  [INFERRED]
  .agents/CHANGELOG.md → flowproject/flowapps.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Kolom penghubung siklus pinjaman (top-up, tundaan, pelunasan otomatis)** — _agents_changelog_previous_loan_id, _agents_changelog_postponed_loan_id, _agents_changelog_settled_by_loan_id, _agents_changelog_auto_pelunasan, _agents_changelog_reverse_auto_settlement, _agents_changelog_tundaan, _agents_changelog_sudah_diajukan_pengganti [EXTRACTED 1.00]
- **Penegakan kalender kerja di seluruh jalur tanggal** — _agents_changelog_work_day, _agents_changelog_hari_kerja_rule, _agents_changelog_use_hari_libur, _agents_changelog_tanggal_turunan, _agents_changelog_tanggal_rekap_bulan, _agents_changelog_get_last_date_for_hari [EXTRACTED 1.00]
- **Global Branch Scope: session, permission, dan pivot multi-cabang** — flowproject_flowapps_authscope, flowproject_flowapps_8_permission_inti, flowproject_flowapps_employee_branches, flowproject_flowapps_employee_zones, flowproject_rekonstruksi_role_permission_global_branch_selector, flowproject_synchronization_flow_get_allowed_branch_ids, flowproject_flowapps_set_branch_controller [EXTRACTED 1.00]

## Communities (122 total, 31 thin omitted)

### Community 0 - "Komponen UI Dasar"
Cohesion: 0.05
Nodes (68): ApplicationLogo(), Checkbox(), DangerButton(), HARI_OPTIONS, KELOMPOK_OPTIONS, InputError(), InputLabel(), LinkButton() (+60 more)

### Community 1 - "Badge & Status Tampilan"
Cohesion: 0.09
Nodes (44): BadgeStatus(), variantMap, BargeStatus(), variantMap, FormatNumbering(), StatusPinjaman(), Approval(), StatusPengajuan() (+36 more)

### Community 2 - "Filter, Pencarian & Navigasi"
Cohesion: 0.05
Nodes (38): FilterBar(), Navbar(), SearchComponent(), SelectList(), AppSidebar(), SweetAlert(), useOptionGenerator(), Authenticated() (+30 more)

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
Cohesion: 0.13
Nodes (10): DebtRelief, Employment, EmploymentPermission, Instalment, TransactionBranchDailyRecap, TransactionOutReason, TransactionWhiteOff, UserZone (+2 more)

### Community 10 - "Pemilih Tanggal & Dialog"
Cohesion: 0.12
Nodes (24): DatePicker(), cn(), DialogFooter(), DialogOverlay, DrawerContent, DrawerDescription, DrawerFooter(), DrawerHeader() (+16 more)

### Community 11 - "Gerbang Agregasi Lama vs Baru"
Cohesion: 0.11
Nodes (8): AgregasiScope, Carbon, DaftarMigrasi, Carbon, HitungAgregat, Carbon, Carbon, self

### Community 12 - "Kueri Mantri & Karyawan"
Cohesion: 0.11
Nodes (6): EmployeeController, Employee, GenerateEmpUserSeeder, Faker\Core\Number, Illuminate\Bus\Batch, Spatie\Permission\Models\Role

### Community 13 - "Cakupan Auth & Pemeriksa Agregat"
Cohesion: 0.15
Nodes (4): AuthScope, PemeriksaAgregat, MigrasiController, Carbon

### Community 14 - "Kalender Kerja"
Cohesion: 0.12
Nodes (4): KalenderKerja, Carbon, KalenderKerjaController, WorkDay

### Community 15 - "Sidebar & Filter Cabang"
Cohesion: 0.19
Nodes (16): data, Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu (+8 more)

### Community 16 - "Serah Terima Saldo Awal"
Cohesion: 0.13
Nodes (3): SerahTerima, TutupBulanan, TransactionMonthlyClosing

### Community 17 - "User & Cakupan Cabang"
Cohesion: 0.16
Nodes (8): User, BelongsToThrough, Illuminate\Foundation\Auth\User, Illuminate\Notifications\Notifiable, Laravel\Sanctum\HasApiTokens, Spatie\Permission\Traits\HasPermissions, Spatie\Permission\Traits\HasRoles, ProfileTest

### Community 18 - "Sidebar shadcn & Responsif"
Cohesion: 0.13
Nodes (14): useIsMobile(), Separator, SidebarContext, SidebarGroupAction, SidebarGroupContent, SidebarInput, SidebarInset, SidebarMenuAction (+6 more)

### Community 19 - "RBAC Multi-Cabang (rancangan)"
Cohesion: 0.14
Nodes (18): AuthScope::resolve(), employee_branches (pivot delegasi multi-cabang), employee_zones (pivot multi-zona staf kontrol), Global Branch Scope Flow, Modul F — Panel Admin & Multi-Cabang/Multi-Zona RBAC, SetBranchController (POST /set-branch), AuthScope (helper scope terpusat, rancangan), employment_permissions (mekanisme multi-cabang lama, DEPRECATED) (+10 more)

### Community 20 - "Badge Aplikasi & Varian"
Cohesion: 0.23
Nodes (10): AppBadge, appBadgeVariants, VARIAN_JENIS, VARIAN_STATUS, varianJenis(), varianStatus(), Action(), BukuTransaksiKepala() (+2 more)

### Community 21 - "Event & Uji Autentikasi"
Cohesion: 0.13
Nodes (8): EventServiceProvider, Illuminate\Auth\Events\Registered, Illuminate\Auth\Events\Verified, Illuminate\Auth\Listeners\SendEmailVerificationNotification, Illuminate\Foundation\Support\Providers\EventServiceProvider, Illuminate\Support\Facades\Event, Illuminate\Support\Facades\URL, EmailVerificationTest

### Community 22 - "Community 22"
Cohesion: 0.16
Nodes (5): TransactionCustomerFactory, TransactionManageCustomerFactory, UserFactory, Illuminate\Database\Eloquent\Factories\Factory, Illuminate\Support\Str

### Community 23 - "Community 23"
Cohesion: 0.16
Nodes (14): Auto-pelunasan pinjaman lama saat top-up berhasil drop, AppHelper::canDeleteLoan(), TransactionLoanController::checkpengajuan(), AppHelper::havePermissionByDate() dan bug E1, NoEditOverlay (pola overlay lama, ditinggalkan), Pola gerbang: kontrol tetap tampil, disabled + keterangan, transaction_loans.postponed_loan_id (Tundaan), transaction_loans.previous_loan_id (top-up / refinance) (+6 more)

### Community 24 - "Community 24"
Cohesion: 0.30
Nodes (7): CountingBalance, CountingCirculation, Illuminate\Bus\Queueable, Illuminate\Contracts\Queue\ShouldQueue, Illuminate\Foundation\Bus\Dispatchable, Illuminate\Queue\InteractsWithQueue, Illuminate\Queue\SerializesModels

### Community 25 - "Community 25"
Cohesion: 0.22
Nodes (10): GlobalBranchFilter(), Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator (+2 more)

### Community 26 - "Community 26"
Cohesion: 0.15
Nodes (13): HandleInertiaRequests::share() prop global auth.roles, AuthScope::resolve() (dipakai memperbaiki getLoanMacet), BatchInputController dibatasi superuser (pastikanSuperuser), PinjamanTrait::getLoanMacet() / getLoanByDate(), Ghost permission (nama permission tak ada di tabel permissions), InputMacet.jsx + store_buku_transaksi_batch (jalur nasabah lama), Kuota ML sebagai PALANG, bukan perbandingan berulang, Alias middleware role: tidak terdaftar di Kernel (+5 more)

### Community 27 - "Community 27"
Cohesion: 0.17
Nodes (3): TransactionManageCustomer, Staudenmeir\EloquentHasManyDeep\HasRelationships, Znck\Eloquent\Traits\BelongsToThrough

### Community 28 - "Community 28"
Cohesion: 0.23
Nodes (12): Jangan jalankan php artisan test (phpunit menghantam ubmi_db produksi), Aturan single source of truth: migrasi wajib dari app_laravel, app_laravel_laravel-network (external shared network), unit-app-service (PHP-FPM container), unit-vite (Node 20 dev server, port 5174), unit-web (nginx, port 8080), Urutan Eksekusi 4 Fase yang Backward-Compatible, Asumsi lama: 1 karyawan = 1 cabang (+4 more)

### Community 29 - "Community 29"
Cohesion: 0.24
Nodes (4): GenerateClosingRows, TandaiMigrasi, VerifikasiAgregat, Illuminate\Console\Command

### Community 30 - "Community 30"
Cohesion: 0.23
Nodes (9): DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut(), DropdownMenuSubContent (+1 more)

### Community 31 - "Community 31"
Cohesion: 0.22
Nodes (11): Ember (6 ember penyimpanan, 4 kategori tampilan), Gembok harian ditegakkan lewat trigger DB, AppHelper::generateStatusAngsuran() (4 nilai, alur lama), Generated column STORED (bukan VIRTUAL) & keluar dari $fillable, HitungAgregat (mesin penghitung agregat harian), Hook rekap otomatis dicabut dari model, transaction_loans.pinjaman adalah generated column (nominal_drop * 1.3), transaction_daily_closings (agregat harian) (+3 more)

### Community 32 - "Community 32"
Cohesion: 0.24
Nodes (5): AppServiceProvider, BroadcastServiceProvider, Illuminate\Routing\UrlGenerator, Illuminate\Support\Facades\Broadcast, Illuminate\Support\ServiceProvider

### Community 33 - "Community 33"
Cohesion: 0.22
Nodes (4): Illuminate\Foundation\Testing\TestCase, AuthenticationTest, ExampleTest, TestCase

### Community 34 - "Community 34"
Cohesion: 0.27
Nodes (10): Rancangan agregasi rekap v2, AgregasiScope (gerbang pemilih agregasi lama vs baru), TransactionDailyRecapController@ceklist_kepala (penulis rekap tunggal), Penyakit dua sumber kebenaran berebut (hook vs controller), Grain per (grouping, hari), bukan per mantri, WorkDay::tanggalRekapBulan() (hari kerja + tanggal berdata), WorkDay / work_days (kalender kerja nasional), ceklist_kepala (Approval Rekap oleh Pimpinan) (+2 more)

### Community 35 - "Community 35"
Cohesion: 0.31
Nodes (4): CountingDailyBalance, VIsBalanceDropWithDailyReport, VIsBalanceLoanWithDailyReport, BalancingDailyReport

### Community 36 - "Community 36"
Cohesion: 0.29
Nodes (3): LoginRequest, ProfileUpdateRequest, Illuminate\Foundation\Http\FormRequest

### Community 38 - "Community 38"
Cohesion: 0.31
Nodes (7): SheetContent, SheetDescription, SheetFooter(), SheetHeader(), SheetOverlay, SheetTitle, sheetVariants

### Community 39 - "Community 39"
Cohesion: 0.22
Nodes (9): Aturan wajib pencatatan perubahan (fungsi, route, tabel), FilterBar (chip filter instan + localStorage), PinjamanTrait::getTransactionLoan(), Konsolidasi halaman Buku Transaksi jadi satu halaman responsif, Kunci Reset & Hapus berdasarkan approval rekap (daily_kepala_approval), SearchComponent (dropdown filter lama, remount via key), ERD Relasi Data & Otorisasi Transaksi, Pemutihan Pinjaman Macet (White-Off) (+1 more)

### Community 40 - "Community 40"
Cohesion: 0.25
Nodes (9): getLastDateForHari() (JS, lib/utils.js), AppHelper::getStortingShowDate() / getNumbDays() (PHP), app/Rules/HariKerja.php (satu Rule, tujuh pintu), Pelajaran: setiap tanggal turunan wajib dicari dan diperiksa, Bug TDZ useHariLibur di atas useForm, useHariLibur (mundurKeHariKerja / majuKeHariKerja), action_buku_transaksi (ACC / Drop / Tolak / Batal), generateUnknownNik / callUnknownNik (+1 more)

### Community 43 - "Community 43"
Cohesion: 0.28
Nodes (3): Illuminate\Foundation\Testing\RefreshDatabase, PasswordUpdateTest, RegistrationTest

### Community 45 - "Community 45"
Cohesion: 0.25
Nodes (3): Illuminate\Auth\Notifications\ResetPassword, Illuminate\Support\Facades\Notification, PasswordResetTest

### Community 51 - "Community 51"
Cohesion: 0.40
Nodes (3): Kernel, Illuminate\Console\Scheduling\Schedule, Illuminate\Foundation\Console\Kernel

### Community 53 - "Community 53"
Cohesion: 0.33
Nodes (6): 8 Permission Inti, Modul E — Administrasi Karyawan (Manpower), Matriks Otorisasi Berdasarkan Jabatan, Pemetaan 7 Role Baru, Desain permission inti baru (17 → 6/8), Prinsip: jabatan menentukan kemampuan, delegasi cabang menentukan jangkauan

### Community 55 - "Community 55"
Cohesion: 0.50
Nodes (5): Cutover kantor percontohan Karawang 2, branches.mulai_pendataan_baru (batas migrasi per kantor), SerahTerima saldo awal (periksa / tetapkanZ / sahkan), transaction_monthly_closings (agregat bulanan), TutupBulanan::rakit() / kelengkapan()

### Community 56 - "Community 56"
Cohesion: 0.40
Nodes (3): Handler, Illuminate\Foundation\Exceptions\Handler, Throwable

### Community 58 - "Community 58"
Cohesion: 0.40
Nodes (4): Monolog\Formatter\JsonFormatter, Monolog\Handler\NullHandler, Monolog\Handler\StreamHandler, Monolog\Handler\SyslogUdpHandler

### Community 67 - "Community 67"
Cohesion: 0.67
Nodes (3): AppBadge + appBadgeVariants, AppButton + appButtonVariants, statusVariants.js (VARIAN_STATUS / varianStatus)

## Knowledge Gaps
- **40 isolated node(s):** `entrypoint.dev.sh script`, `entrypoint.sh script`, `DropDownContext`, `HARI_OPTIONS`, `KELOMPOK_OPTIONS` (+35 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 408 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **31 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `TransactionLoan` connect `Pinjaman, Sirkulasi & Pindah Resort` to `Autentikasi Bawaan Laravel`, `Panel Admin & AuthScope`, `Perintah Konsol Agregasi`, `AppHelper (lima urusan tercampur)`, `Model Cabang & Kepegawaian`, `Community 27`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Why does `User` connect `User & Cakupan Cabang` to `Community 33`, `Autentikasi Bawaan Laravel`, `Community 36`, `Panel Admin & AuthScope`, `Perintah Konsol Agregasi`, `Model Cabang & Kepegawaian`, `Community 59`, `Gerbang Agregasi Lama vs Baru`, `Kueri Mantri & Karyawan`, `Community 45`, `Community 43`, `Event & Uji Autentikasi`, `Community 27`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Why does `AppHelper` connect `AppHelper (lima urusan tercampur)` to `Autentikasi Bawaan Laravel`, `Pinjaman, Sirkulasi & Pindah Resort`, `Panel Admin & AuthScope`, `Perintah Konsol Agregasi`, `Kueri Mantri & Karyawan`, `Community 27`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **What connects `entrypoint.dev.sh script`, `entrypoint.sh script`, `DropDownContext` to the rest of the system?**
  _40 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Komponen UI Dasar` be split into smaller, more focused modules?**
  _Cohesion score 0.051438757321110265 - nodes in this community are weakly interconnected._
- **Should `Badge & Status Tampilan` be split into smaller, more focused modules?**
  _Cohesion score 0.09425742574257426 - nodes in this community are weakly interconnected._
- **Should `Filter, Pencarian & Navigasi` be split into smaller, more focused modules?**
  _Cohesion score 0.05030525030525031 - nodes in this community are weakly interconnected._