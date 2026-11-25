# Graph Report - unit-apps  (2026-11-25)

## Corpus Check
- 537 files · ~349,686 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2731 nodes · 7204 edges · 216 communities (92 shown, 80 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 536 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2758d840`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- TransactionLoan
- NewAngsuran/Components/Action.jsx
- Illuminate\Database\Eloquent\Model
- InputError.jsx
- Handoff unit-apps — 15 Oktober 2026
- App\Models\Branch
- TbContributionController
- RombakResort
- User
- TransactionLoanInstalmentController
- TableRekap.jsx
- Employee
- input.jsx
- SkswUnitController
- TanggalKerja.jsx
- VehicleAssetController
- Carbon
- Mutasi
- button.jsx
- RBAC Multi-Cabang (rancangan)
- Carbon
- PembayaranKantorController
- ManPower.jsx
- Auto-pelunasan pinjaman lama saat top-up berhasil drop
- CountingBalance.php
- sheet.jsx
- Ghost permission (nama permission tak ada di tabel permissions)
- Controller
- app_laravel & unit-apps berbagi database ubmi_db
- SiklusRekening
- TransactionDailyRecap
- transaction_daily_closings (agregat harian)
- AppServiceProvider
- AuthScope
- Penyakit dua sumber kebenaran berebut (hook vs controller)
- EventServiceProvider.php
- AgregasiScope
- GantiNasabah
- PenyesuaianSaldo
- Kunci Reset & Hapus berdasarkan approval rekap (daily_kepala_approval)
- app/Rules/HariKerja.php (satu Rule, tujuh pintu)
- Loan
- Carbon\Carbon
- sidebar.jsx
- Illuminate\Http\Request
- Branch
- SavingDetailDrawer.jsx
- PembayaranKantor.jsx
- Illuminate\Database\Migrations\Migration
- Illuminate\Database\Schema\Blueprint
- Illuminate\Support\Facades\Schema
- Illuminate\Foundation\Application
- TransactionDailyRecapController
- 8 Permission Inti
- Illuminate\Database\Eloquent\Relations\BelongsTo
- SerahTerima saldo awal (periksa / tetapkanZ / sahkan)
- TransactionDailyClosing
- graphify — peta hubungan kode
- logging.php
- LoginRequest
- Authenticate
- TrustHosts
- kunciKirim.jsx
- AuthServiceProvider
- Illuminate\Database\Eloquent\Factories\Factory
- ExampleTest
- pindai.js
- AppBadge + appBadgeVariants
- Kernel
- EncryptCookies
- PreventRequestsDuringMaintenance
- TrimStrings
- Collection
- ValidateSignature
- VerifyCsrfToken
- console.php
- config/app.php
- sanctum.php
- entrypoint.sh
- entrypoint.dev.sh
- ProfileTest
- SavingBatch
- TableRekapKasir.jsx
- HitungAgregat
- VideoTutorialController
- Rekap Sirkulasi Wilayah — rancangan
- Rencana Implementasi — Rekap Sirkulasi Wilayah
- TabelWilayah.jsx
- RekapWilayahController
- TransactionSaldoAdjustment
- User
- AngsuranTableMobile.jsx
- TransactionMonthlyClosing
- RekapWilayah.jsx
- AuthenticatedLayout.jsx
- App\Http\Controllers\LoanController
- KalenderKerja
- VehicleLoanController
- Vehicles.jsx
- InvVehicle
- TransactionDailyRecap
- Carbon
- Carbon
- KoreksiBekuController
- TransactionMonthlyClosing
- VehicleAssetDetail.jsx
- Controller
- JasaModal
- Carbon
- CekPelunasan
- TransactionResortRombak
- BukuTransaksiKepala.jsx
- Kapan angka agregasi boleh dipercaya
- App\Models\TransactionDailyClosing
- TransactionLoanOfficerGrouping
- TransactionLoan
- Aturan Pengembangan unit-apps (Aplikasi Transaksi Cabang UBMI)
- cn
- Carbon
- rp
- AngsuranTable.jsx
- PerbaikanAngsuranController
- Rancangan: Rombak Resort
- TransactionDailyClosing
- SelisihMigrasi
- useModeRibuan
- TransactionLoan
- TransactionLoanInstalment
- TransactionWhiteOff
- TransactionMonthlyClosing
- TransactionLoan
- TestCase
- Carbon
- TransactionWhiteOff
- TransactionSaldoAdjustment
- InvAsset
- App\Helpers\SerahTerima
- App\Helpers\TargetBayangan
- TransactionLoanOfficerGrouping
- Carbon
- mantriapps-deploy.sh
- TransactionSaldoAdjustment
- App\Http\Controllers\PindahResortController
- TransactionLoan
- Carbon
- BranchChecklistController
- RombakResort.jsx
- Handler
- Peta berkas
- TransactionLoanOfficerGrouping
- TransactionLoan
- TransactionLoan
- CreatesApplication
- TransactionLoanMutation
- CrashAlert.jsx
- Carbon
- Carbon
- 3. Penempatan di Halaman Web
- Global Constraints
- TrustProxies.php
- Saving
- PasswordResetTest
- ekspor.js
- EmailVerificationTest.php
- TransactionDailyClosing
- HandleInertiaRequests.php
- Proposal: shorter production deploy downtime (parked, mas 2026-10-26)
- check_prod.sh
- kabar_applaravel_2026-10-27_bucket_koreksi_beku.md
- kabar_applaravel_2026-10-27_hapus_pinjaman_modal.md
- kabar_applaravel_2026-10-28_jasa_modal_bulat_total.md
- kabar_applaravel_2026-11-02_rombak_resort_migrasi.md

## God Nodes (most connected - your core abstractions)
1. `cn()` - 130 edges
2. `AppHelper` - 114 edges
3. `TransactionLoan` - 99 edges
4. `Button` - 77 edges
5. `rp()` - 65 edges
6. `TransactionLoanOfficerGrouping` - 54 edges
7. `Branch` - 44 edges
8. `User` - 41 edges
9. `AuthScope` - 40 edges
10. `DialogContent` - 40 edges

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

## Communities (216 total, 80 thin omitted)

### Community 0 - "TransactionLoan"
Cohesion: 0.04
Nodes (40): KeluarTarget, AdminController, TransactionCustomer, TransactionDailyRecap, TransactionLoan, TransactionLoanInstalment, TransactionLoanOfficerGrouping, TransactionSirculation (+32 more)

### Community 1 - "NewAngsuran/Components/Action.jsx"
Cohesion: 0.07
Nodes (41): BadgeStatus(), variantMap, BargeStatus(), variantMap, FormatNumbering(), StatusPengajuan(), tanggal(), bacaUrut() (+33 more)

### Community 2 - "Illuminate\Database\Eloquent\Model"
Cohesion: 0.05
Nodes (27): Customer, DebtRelief, EmployeeBranch, EmployeeZone, App\Models\Employment, Employment, App\Models\EmploymentPermission, EmploymentPermission (+19 more)

### Community 3 - "InputError.jsx"
Cohesion: 0.12
Nodes (12): ApplicationLogo(), DangerButton(), InputError(), InputLabel(), Modal(), PrimaryButton(), SecondaryButton(), Guest() (+4 more)

### Community 4 - "Handoff unit-apps — 15 Oktober 2026"
Cohesion: 0.12
Nodes (15): Aturan pinjaman modal baru (dari sesi app_laravel, 21 Oktober 2026; app_laravel masih lokal), Aturan yang wajib dipatuhi, Belum di-commit (lokal, 19 Oktober 2026) — mas: "nanti sekalian", Cara deploy (hanya kalau mas minta), Dashboard Kasir (`PembayaranKantorController`), Fitur Iuran / SKSW / Aset (sudah di-commit di v1.0.25), Handoff unit-apps — 15 Oktober 2026, Ide yang sudah ditawarkan, belum dikerjakan (+7 more)

### Community 5 - "App\Models\Branch"
Cohesion: 0.08
Nodes (22): App\Helpers\AuthScope, App\Helpers\RekapWilayah, VideoPengumuman, App\Http\Controllers\MantriAppsController, MantriAppsController, SsoController, App\Models\Branch, App\Models\ContributionLock (+14 more)

### Community 6 - "TbContributionController"
Cohesion: 0.20
Nodes (6): BopContributionController, Branch, Branch, TbContributionController, OpsBopContribution, TbContribution

### Community 7 - "RombakResort"
Cohesion: 0.09
Nodes (8): RombakResort, TargetMingguan, TransactionResortRombak, RombakResortController, App\Models\TransactionResortRombak, TransactionResortRombak, Illuminate\Support\Collection, TransactionResortRombak

### Community 8 - "User"
Cohesion: 0.18
Nodes (10): App\Models\User, User, BelongsToThrough, Illuminate\Foundation\Auth\User, Illuminate\Notifications\Notifiable, Laravel\Sanctum\HasApiTokens, Spatie\Permission\Models\Role, Spatie\Permission\Traits\HasPermissions (+2 more)

### Community 10 - "TableRekap.jsx"
Cohesion: 0.16
Nodes (14): jumlah(), persen(), persenTeks(), ribu(), seninDari(), TabelHarian(), KOLOM_HARIAN, KOLOM_HARIAN_PERSEN (+6 more)

### Community 11 - "Employee"
Cohesion: 0.10
Nodes (8): BatchInputController, LamaranKerjaController, Employee, App\Models\JobApplication, JobApplication, App\Models\JobApplicationDocument, GenerateEmpUserSeeder, JobApplication

### Community 12 - "input.jsx"
Cohesion: 0.07
Nodes (36): Loading(), SelectList(), SearchComponent(), SelectList(), TanggalKerja(), simpanan, useHariLibur(), useOptionGenerator() (+28 more)

### Community 13 - "SkswUnitController"
Cohesion: 0.28
Nodes (5): SkswUnitController, App\Models\Saving, Saving, SavingBatch, SavingTransaction

### Community 14 - "TanggalKerja.jsx"
Cohesion: 0.15
Nodes (14): DatePicker(), HARI, HARI_KE_ANGKA, NAMA_BULAN, NAMA_HARI, buttonVariants, Calendar(), SelectContent (+6 more)

### Community 15 - "VehicleAssetController"
Cohesion: 0.13
Nodes (8): VehicleAssetController, App\Models\InvAsset, InvAsset, HasMany, InvLocation, Illuminate\Database\Eloquent\Relations\HasOne, InvVehicle, InvVehicleTax

### Community 18 - "button.jsx"
Cohesion: 0.08
Nodes (32): PENGUMUMAN, PengumumanPembaruan(), URUTAN_SUDUT, dateLabel(), OfficeContributionPage(), periodLabel(), statusLabels, dalamAplikasi() (+24 more)

### Community 19 - "RBAC Multi-Cabang (rancangan)"
Cohesion: 0.14
Nodes (18): AuthScope::resolve(), employee_branches (pivot delegasi multi-cabang), employee_zones (pivot multi-zona staf kontrol), Global Branch Scope Flow, Modul F — Panel Admin & Multi-Cabang/Multi-Zona RBAC, SetBranchController (POST /set-branch), AuthScope (helper scope terpusat, rancangan), employment_permissions (mekanisme multi-cabang lama, DEPRECATED) (+10 more)

### Community 20 - "Carbon"
Cohesion: 0.08
Nodes (8): DaftarMigrasi, KoreksiBeku, TransactionSaldoAdjustment, PemeriksaanMigrasi, FilterGlobal, WorkDay, Carbon, TransactionLoanInstalment

### Community 21 - "PembayaranKantorController"
Cohesion: 0.12
Nodes (5): PembayaranKantorController, Unggahan, Branch, Illuminate\Http\UploadedFile, Response

### Community 22 - "ManPower.jsx"
Cohesion: 0.08
Nodes (18): AturSudut(), jepit(), konfirmasi(), KalenderKerja(), KartuNasabah(), VideoTutorial(), Index(), AkunKaryawan() (+10 more)

### Community 23 - "Auto-pelunasan pinjaman lama saat top-up berhasil drop"
Cohesion: 0.16
Nodes (14): Auto-pelunasan pinjaman lama saat top-up berhasil drop, AppHelper::canDeleteLoan(), TransactionLoanController::checkpengajuan(), AppHelper::havePermissionByDate() dan bug E1, NoEditOverlay (pola overlay lama, ditinggalkan), Pola gerbang: kontrol tetap tampil, disabled + keterangan, transaction_loans.postponed_loan_id (Tundaan), transaction_loans.previous_loan_id (top-up / refinance) (+6 more)

### Community 24 - "CountingBalance.php"
Cohesion: 0.14
Nodes (15): App\Console\Commands\CountingDailyBalance, CountingDailyBalance, Kernel, CountingBalance, CountingCirculation, VIsBalanceDropWithDailyReport, VIsBalanceLoanWithDailyReport, BalancingDailyReport (+7 more)

### Community 25 - "sheet.jsx"
Cohesion: 0.06
Nodes (39): HARI_OPTIONS, KELOMPOK_OPTIONS, NAMA_BULAN, NAMA_HARI_PANJANG, useMuatDrawer(), Angka(), Approval(), DrawerAngsuran() (+31 more)

### Community 26 - "Ghost permission (nama permission tak ada di tabel permissions)"
Cohesion: 0.15
Nodes (13): HandleInertiaRequests::share() prop global auth.roles, AuthScope::resolve() (dipakai memperbaiki getLoanMacet), BatchInputController dibatasi superuser (pastikanSuperuser), PinjamanTrait::getLoanMacet() / getLoanByDate(), Ghost permission (nama permission tak ada di tabel permissions), InputMacet.jsx + store_buku_transaksi_batch (jalur nasabah lama), Kuota ML sebagai PALANG, bukan perbandingan berulang, Alias middleware role: tidak terdaftar di Kernel (+5 more)

### Community 27 - "Controller"
Cohesion: 0.06
Nodes (35): AuthenticatedSessionController, ConfirmablePasswordController, EmailVerificationNotificationController, EmailVerificationPromptController, NewPasswordController, PasswordController, PasswordResetLinkController, RegisteredUserController (+27 more)

### Community 28 - "app_laravel & unit-apps berbagi database ubmi_db"
Cohesion: 0.23
Nodes (12): Jangan jalankan php artisan test (phpunit menghantam ubmi_db produksi), Aturan single source of truth: migrasi wajib dari app_laravel, app_laravel_laravel-network (external shared network), unit-app-service (PHP-FPM container), unit-vite (Node 20 dev server, port 5174), unit-web (nginx, port 8080), Urutan Eksekusi 4 Fase yang Backward-Compatible, Asumsi lama: 1 karyawan = 1 cabang (+4 more)

### Community 29 - "SiklusRekening"
Cohesion: 0.29
Nodes (3): SiklusRekening, App\Models\TransactionSiklus, TransactionSiklus

### Community 31 - "transaction_daily_closings (agregat harian)"
Cohesion: 0.22
Nodes (11): Ember (6 ember penyimpanan, 4 kategori tampilan), Gembok harian ditegakkan lewat trigger DB, AppHelper::generateStatusAngsuran() (4 nilai, alur lama), Generated column STORED (bukan VIRTUAL) & keluar dari $fillable, HitungAgregat (mesin penghitung agregat harian), Hook rekap otomatis dicabut dari model, transaction_loans.pinjaman adalah generated column (nominal_drop * 1.3), transaction_daily_closings (agregat harian) (+3 more)

### Community 32 - "AppServiceProvider"
Cohesion: 0.24
Nodes (5): AppServiceProvider, BroadcastServiceProvider, Illuminate\Routing\UrlGenerator, Illuminate\Support\Facades\Broadcast, Illuminate\Support\ServiceProvider

### Community 33 - "AuthScope"
Cohesion: 0.19
Nodes (4): AuthScope, MigrasiController, Carbon, Collection

### Community 34 - "Penyakit dua sumber kebenaran berebut (hook vs controller)"
Cohesion: 0.27
Nodes (10): Rancangan agregasi rekap v2, AgregasiScope (gerbang pemilih agregasi lama vs baru), TransactionDailyRecapController@ceklist_kepala (penulis rekap tunggal), Penyakit dua sumber kebenaran berebut (hook vs controller), Grain per (grouping, hari), bukan per mantri, WorkDay::tanggalRekapBulan() (hari kerja + tanggal berdata), WorkDay / work_days (kalender kerja nasional), ceklist_kepala (Approval Rekap oleh Pimpinan) (+2 more)

### Community 35 - "EventServiceProvider.php"
Cohesion: 0.25
Nodes (5): EventServiceProvider, Illuminate\Auth\Events\Registered, Illuminate\Auth\Listeners\SendEmailVerificationNotification, Illuminate\Foundation\Support\Providers\EventServiceProvider, Illuminate\Support\Facades\Event

### Community 36 - "AgregasiScope"
Cohesion: 0.20
Nodes (3): AgregasiScope, Carbon, InputMlController

### Community 37 - "GantiNasabah"
Cohesion: 0.32
Nodes (4): GantiNasabah, TransactionLoan, GantiNasabahController, TransactionManageCustomer

### Community 38 - "PenyesuaianSaldo"
Cohesion: 0.16
Nodes (3): PenyesuaianSaldo, TransactionSaldoAdjustment, self

### Community 39 - "Kunci Reset & Hapus berdasarkan approval rekap (daily_kepala_approval)"
Cohesion: 0.22
Nodes (9): Aturan wajib pencatatan perubahan (fungsi, route, tabel), FilterBar (chip filter instan + localStorage), PinjamanTrait::getTransactionLoan(), Konsolidasi halaman Buku Transaksi jadi satu halaman responsif, Kunci Reset & Hapus berdasarkan approval rekap (daily_kepala_approval), SearchComponent (dropdown filter lama, remount via key), ERD Relasi Data & Otorisasi Transaksi, Pemutihan Pinjaman Macet (White-Off) (+1 more)

### Community 40 - "app/Rules/HariKerja.php (satu Rule, tujuh pintu)"
Cohesion: 0.25
Nodes (9): getLastDateForHari() (JS, lib/utils.js), AppHelper::getStortingShowDate() / getNumbDays() (PHP), app/Rules/HariKerja.php (satu Rule, tujuh pintu), Pelajaran: setiap tanggal turunan wajib dicari dan diperiksa, Bug TDZ useHariLibur di atas useForm, useHariLibur (mundurKeHariKerja / majuKeHariKerja), action_buku_transaksi (ACC / Drop / Tolak / Batal), generateUnknownNik / callUnknownNik (+1 more)

### Community 42 - "Carbon\Carbon"
Cohesion: 0.08
Nodes (41): CekSaldo, MaterialisasiTargetOtomatis, VerifikasiAgregat, App\Helpers\AgregasiScope, App\Helpers\AppHelper, App\Helpers\Ember, App\Helpers\HitungAgregat, App\Helpers\JasaModal (+33 more)

### Community 43 - "sidebar.jsx"
Cohesion: 0.11
Nodes (27): AppSidebar(), useIsMobile(), IsiUtama(), Sidebar, SidebarContent, SidebarContext, SidebarFooter, SidebarGroup (+19 more)

### Community 44 - "Illuminate\Http\Request"
Cohesion: 0.04
Nodes (17): AppHelper, PecahanMacetLama, TransactionLoanController, RedirectIfAuthenticated, App\Models\TransactionLoan, TransactionManageCustomer, App\Rules\HariKerja, HariKerja (+9 more)

### Community 45 - "Branch"
Cohesion: 0.10
Nodes (8): TandaiMigrasi, EmployeeController, Branch, User, App\Models\Employee, Employee, EmployeeDocument, User

### Community 46 - "SavingDetailDrawer.jsx"
Cohesion: 0.29
Nodes (12): angka(), bulanMaks(), HapusTransaksi(), kirim(), MutasiKantor(), mutasiPertama(), periodePanjang(), periodePendek() (+4 more)

### Community 47 - "PembayaranKantor.jsx"
Cohesion: 0.07
Nodes (34): angka(), AngsuranMotor(), Bayar(), bulan(), Daftar(), Detail(), DialogBayar(), galatPertama() (+26 more)

### Community 52 - "TransactionDailyRecapController"
Cohesion: 0.13
Nodes (4): KoreksiTarget, TransactionDailyRecapController, TransactionDailyRecap, TransactionLoanOfficerGrouping

### Community 53 - "8 Permission Inti"
Cohesion: 0.33
Nodes (6): 8 Permission Inti, Modul E — Administrasi Karyawan (Manpower), Matriks Otorisasi Berdasarkan Jabatan, Pemetaan 7 Role Baru, Desain permission inti baru (17 → 6/8), Prinsip: jabatan menentukan kemampuan, delegasi cabang menentukan jangkauan

### Community 54 - "Illuminate\Database\Eloquent\Relations\BelongsTo"
Cohesion: 0.13
Nodes (6): InvVehicleLoanPayment, OpsBopContribution, SavingTransaction, TbContribution, Illuminate\Database\Eloquent\Builder, Illuminate\Database\Eloquent\Relations\BelongsTo

### Community 55 - "SerahTerima saldo awal (periksa / tetapkanZ / sahkan)"
Cohesion: 0.50
Nodes (5): Cutover kantor percontohan Karawang 2, branches.mulai_pendataan_baru (batas migrasi per kantor), SerahTerima saldo awal (periksa / tetapkanZ / sahkan), transaction_monthly_closings (agregat bulanan), TutupBulanan::rakit() / kelengkapan()

### Community 56 - "TransactionDailyClosing"
Cohesion: 0.14
Nodes (4): GenerateClosingRows, HitungClosing, Carbon, TransactionDailyClosing

### Community 57 - "graphify — peta hubungan kode"
Cohesion: 0.22
Nodes (8): Aturan yang tidak boleh dilanggar, Graf menunjuk, bukan membuktikan, graphify — peta hubungan kode, Menjaganya tetap segar, Pakai yang sempit, jangan yang luas, unit-apps, Untuk apa dia benar-benar dipakai, Yang belum ada di graf

### Community 58 - "logging.php"
Cohesion: 0.40
Nodes (4): Monolog\Formatter\JsonFormatter, Monolog\Handler\NullHandler, Monolog\Handler\StreamHandler, Monolog\Handler\SyslogUdpHandler

### Community 59 - "LoginRequest"
Cohesion: 0.29
Nodes (3): LoginRequest, ProfileUpdateRequest, Illuminate\Foundation\Http\FormRequest

### Community 62 - "kunciKirim.jsx"
Cohesion: 0.18
Nodes (4): dikunci, KunciKirim(), lepas(), ubah()

### Community 64 - "Illuminate\Database\Eloquent\Factories\Factory"
Cohesion: 0.24
Nodes (4): TransactionCustomerFactory, TransactionManageCustomerFactory, UserFactory, Illuminate\Database\Eloquent\Factories\Factory

### Community 66 - "pindai.js"
Cohesion: 0.29
Nodes (12): DialogPindai(), sudutBawaan(), bacaGambar(), BERKAS, cariSudut(), jarak(), luruskan(), muatScript() (+4 more)

### Community 67 - "AppBadge + appBadgeVariants"
Cohesion: 0.67
Nodes (3): AppBadge + appBadgeVariants, AppButton + appButtonVariants, statusVariants.js (VARIAN_STATUS / varianStatus)

### Community 97 - "TableRekapKasir.jsx"
Cohesion: 0.11
Nodes (19): BAWAAN, GRUP, ISI_LAMA, IsianSel(), KHUSUS_MIGRASI, KOLOM, KOLOM_ISI, TableRekapKasir() (+11 more)

### Community 98 - "HitungAgregat"
Cohesion: 0.11
Nodes (3): Ember, HitungAgregat, Carbon

### Community 100 - "Rekap Sirkulasi Wilayah — rancangan"
Cohesion: 0.07
Nodes (28): 1. Halaman, 2. Angka, 3. Penyimpanan, 4. Alur dan hak akses, 5. Ekspor, 6. Temuan dan risiko, Bentuk tabel mengikuti Rekap 2, Cara menghitung kumulatif (+20 more)

### Community 101 - "Rencana Implementasi — Rekap Sirkulasi Wilayah"
Cohesion: 0.14
Nodes (13): Batasan global, Catatan, Rencana Implementasi — Rekap Sirkulasi Wilayah, Struktur berkas, Tugas 1: Helper rumus (PHP murni), Tugas 2: Migrasi dua tabel (di app_laravel), Tugas 3: Angka sistem per wilayah per tanggal, Tugas 4: Model + halaman baca saja (+5 more)

### Community 122 - "TabelWilayah.jsx"
Cohesion: 0.20
Nodes (18): angka(), BLOK, fmt, KOLOM_AWAL, KOLOM_TURUNAN, nilai(), PECAHAN, persen() (+10 more)

### Community 123 - "RekapWilayahController"
Cohesion: 0.11
Nodes (6): RekapWilayah, RekapWilayahController, RegionalCirculationOpening, AngkaRekapWilayah, JsonResponse, RegionalCirculationRecap

### Community 126 - "AngsuranTableMobile.jsx"
Cohesion: 0.34
Nodes (13): Angs(), AngsuranTableMobile(), caraBayar(), FILTER, jumlah(), kolom(), md(), rb() (+5 more)

### Community 128 - "RekapWilayah.jsx"
Cohesion: 0.31
Nodes (9): BlokHari(), judulTanggal(), senin(), taksirTinggi(), TANPA_TAMBALAN, judulTanggal(), gabung(), namaBulan() (+1 more)

### Community 129 - "AuthenticatedLayout.jsx"
Cohesion: 0.17
Nodes (11): AlertAngsuranMotor(), MENU_VIDEO, Authenticated(), polos(), sidebarTerbuka(), KonfirmasiHost(), unduhPemindaiNanti(), SidebarInset (+3 more)

### Community 131 - "KalenderKerja"
Cohesion: 0.18
Nodes (3): KalenderKerja, KalenderKerjaController, WorkDay

### Community 132 - "VehicleLoanController"
Cohesion: 0.16
Nodes (4): VehicleLoanController, InvVehicleLoan, App\Models\InvVehicleLoanPayment, VehicleAssetController

### Community 133 - "Vehicles.jsx"
Cohesion: 0.13
Nodes (19): VehicleAssetDetail(), BPKB_OPTIONS, CADANGAN, formatTgl(), PIC_OPTIONS, stnkPada(), toDateInput(), VehicleAssetForm() (+11 more)

### Community 134 - "InvVehicle"
Cohesion: 0.18
Nodes (6): App\Models\InvVehicle, InvVehicle, App\Models\InvVehicleTax, InvVehicleTax, CarbonInterface, Illuminate\Database\Eloquent\Relations\HasMany

### Community 139 - "TransactionMonthlyClosing"
Cohesion: 0.07
Nodes (7): GembokBulanan, PemeriksaAgregat, TutupBulanan, ClosingBulananController, TransactionMonthlyClosing, static, TransactionMonthlyClosing

### Community 140 - "VehicleAssetDetail.jsx"
Cohesion: 0.13
Nodes (16): formatDate(), PIC_OPTIONS, sisaHari(), TanggalJatuhTempo(), GlobalBranchFilter(), tutup(), Command, CommandEmpty (+8 more)

### Community 141 - "Controller"
Cohesion: 0.31
Nodes (4): SetBranchController, UbahNasabahController, Controller, TransactionCustomer

### Community 146 - "BukuTransaksiKepala.jsx"
Cohesion: 0.23
Nodes (10): AppBadge, appBadgeVariants, VARIAN_JENIS, VARIAN_STATUS, varianJenis(), varianStatus(), Action(), BukuTransaksiKepala() (+2 more)

### Community 147 - "Kapan angka agregasi boleh dipercaya"
Cohesion: 0.20
Nodes (9): 1. Siapa menulis apa, 2. Baris yang belum terkunci bisa berisi angka — dan bisa salah, 3. Kenapa mengunci Oktober menyentuh `transaction_daily_closings` November, 4. Sesudah kunci dibuka, kolomnya menunggu, 5. Aturan membaca yang benar, 6. "Terkunci" artinya apa, dan tidak artinya apa, 7. Kosakata, Cara memeriksa ulang sendiri (+1 more)

### Community 148 - "App\Models\TransactionDailyClosing"
Cohesion: 0.11
Nodes (6): Gembok, TransactionDailyClosing, ClosingHarianController, TransactionDailyClosing, App\Models\TransactionDailyClosing, TransactionLockHistory

### Community 151 - "Aturan Pengembangan unit-apps (Aplikasi Transaksi Cabang UBMI)"
Cohesion: 0.22
Nodes (8): Arsitektur, Aturan Pengembangan unit-apps (Aplikasi Transaksi Cabang UBMI), Frontend, Gaya Komunikasi & Brainstorming, Kode, Koneksi dengan app_laravel, Konteks Aplikasi, Perintah Docker

### Community 152 - "cn"
Cohesion: 0.10
Nodes (29): AppButton, appButtonVariants, cn(), HARI_TO_DOW, DialogOverlay, DrawerContent, DrawerDescription, DrawerFooter() (+21 more)

### Community 154 - "rp"
Cohesion: 0.08
Nodes (33): fmt, rp(), rpAtauStrip(), rpLengkap(), Penjelasan(), RemoveLoan(), Ringkas(), DampakKoreksi() (+25 more)

### Community 155 - "AngsuranTable.jsx"
Cohesion: 0.09
Nodes (16): BULAN, DialogInputMl(), HARI_KE, PeringatanMacet(), SLIDE, SLIDE_MIGRASI, rpInput(), AngsuranTable() (+8 more)

### Community 157 - "Rancangan: Rombak Resort"
Cohesion: 0.10
Nodes (20): 10. Pemeriksa agregat, 11. Tidak dicakup, 12. Risiko & yang belum diperiksa, 13. Tahap, 1. Latar, 2. Istilah, 3. Keputusan, 4. Kenapa cara B (timpa), bukan A (arus) (+12 more)

### Community 159 - "SelisihMigrasi"
Cohesion: 0.30
Nodes (3): Carbon, SelisihMigrasi, SelisihMigrasiController

### Community 160 - "useModeRibuan"
Cohesion: 0.13
Nodes (20): angka(), fmtPenuh, fmtRibuan, kabari(), langganan(), modeRibuan(), pendengar, satuanAngka() (+12 more)

### Community 169 - "TestCase"
Cohesion: 0.15
Nodes (7): Illuminate\Foundation\Testing\RefreshDatabase, Illuminate\Foundation\Testing\TestCase, AuthenticationTest, PasswordUpdateTest, RegistrationTest, ExampleTest, TestCase

### Community 186 - "RombakResort.jsx"
Cohesion: 0.20
Nodes (15): asalnya(), Blok(), fmtSirk(), H3, HARI, jumlah(), KOLOM_SIRK, kunci() (+7 more)

### Community 187 - "Handler"
Cohesion: 0.33
Nodes (3): Handler, Illuminate\Foundation\Exceptions\Handler, Throwable

### Community 188 - "Peta berkas"
Cohesion: 0.12
Nodes (15): Global Constraints, Peta berkas, Rombak Resort — Tahap 1 (Fondasi) Implementation Plan, Selesai tahap 1 bila, Tambahan sesudah Task 7 (disetujui mas 2026-11-02), Task 10: Penulis bertanggal mundur mencap kelompok saat tanggal itu (N6), Task 1: Migrasi tabel rombak (app_laravel), Task 2: Helper `Mutasi` dibalik — "kelompok pada tanggal" + `catat` timpa (+7 more)

### Community 203 - "3. Penempatan di Halaman Web"
Cohesion: 0.15
Nodes (12): 1. Penyimpanan Aset Video di MinIO, 2. Arsitektur Kode & Alur Data, 3. Penempatan di Halaman Web, 4. Tabel Database Terlibat, A. Dashboard Kasir (`/dashboard-kasir`), B. Registri Aset Kendaraan (`/assets`), C. Lamaran Kerja (`/administrasi/lamaran`), D. Angsuran Lancar (`/mobile_apps/angsuran`) (+4 more)

### Community 206 - "Global Constraints"
Cohesion: 0.18
Nodes (10): Global Constraints, Rombak Resort — Tahap 2 (Pratinjau, Terapkan, Batal) Implementation Plan, Selesai tahap 2 bila, Task 1: "Hari Tidak Sama" membandingkan hari tagih pada tanggal itu (T1), Task 2: Kunci hari drop lampau memakai kelompok saat drop (T2), Task 3: `RombakResort::pratinjau` + endpoint + tampilan pratinjau, Task 4: `RombakResort::terapkan`, Task 5: `RombakResort::batal` (§9) (+2 more)

### Community 210 - "PasswordResetTest"
Cohesion: 0.25
Nodes (3): Illuminate\Auth\Notifications\ResetPassword, Illuminate\Support\Facades\Notification, PasswordResetTest

### Community 212 - "ekspor.js"
Cohesion: 0.23
Nodes (13): a, h, isi, formatKolom(), kepalaBertingkat(), lebar(), lembarAwal(), lembarHarian() (+5 more)

### Community 216 - "EmailVerificationTest.php"
Cohesion: 0.29
Nodes (3): Illuminate\Auth\Events\Verified, Illuminate\Support\Facades\URL, EmailVerificationTest

### Community 219 - "HandleInertiaRequests.php"
Cohesion: 0.40
Nodes (3): HandleInertiaRequests, Inertia\Middleware, Tightenco\Ziggy\Ziggy

### Community 222 - "Proposal: shorter production deploy downtime (parked, mas 2026-10-26)"
Cohesion: 0.50
Nodes (3): Cause of the 502 Bad Gateway, Options, cheapest first, Proposal: shorter production deploy downtime (parked, mas 2026-10-26)

## Knowledge Gaps
- **245 isolated node(s):** `Latar`, `Bentuk tabel mengikuti Rekap 2`, `Panel Sirkulasi Awal`, `Yang diketik staf kontrol`, `Menyimpan: autosave, tanpa tombol Simpan` (+240 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 801 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **80 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AppHelper` connect `Illuminate\Http\Request` to `TransactionLoan`, `AgregasiScope`, `App\Models\Branch`, `PenyesuaianSaldo`, `Carbon\Carbon`, `Employee`, `TransactionMonthlyClosing`, `Branch`, `TransactionDailyRecapController`, `Carbon`, `App\Models\TransactionDailyClosing`, `Handler`, `SelisihMigrasi`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Why does `User` connect `User` to `Illuminate\Database\Eloquent\Model`, `App\Models\Branch`, `Controller`, `TestCase`, `Employee`, `Illuminate\Http\Request`, `PasswordResetTest`, `EmailVerificationTest.php`, `LoginRequest`, `ProfileTest`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Why does `TransactionLoan` connect `TransactionLoan` to `AuthScope`, `Illuminate\Database\Eloquent\Model`, `PenyesuaianSaldo`, `RombakResort`, `Carbon\Carbon`, `Illuminate\Http\Request`, `Mutasi`, `Carbon`, `RekapWilayahController`, `SelisihMigrasi`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Are the 57 inferred relationships involving `AppHelper` (e.g. with `.buatPinjaman()` and `.cekHapusPinjaman()`) actually correct?**
  _`AppHelper` has 57 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Latar`, `Bentuk tabel mengikuti Rekap 2`, `Panel Sirkulasi Awal` to the rest of the system?**
  _245 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `TransactionLoan` be split into smaller, more focused modules?**
  _Cohesion score 0.035368217054263566 - nodes in this community are weakly interconnected._
- **Should `NewAngsuran/Components/Action.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07253086419753087 - nodes in this community are weakly interconnected._