<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\BatchInputController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\MobileAppsMantriController;
use App\Http\Controllers\PindahResortController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TransactionDailyRecapController;
use App\Http\Controllers\TransactionLoanController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/


Route::get('/', function () {
  // Video panduan pengumuman (MinIO, link sementara) - kosong kalau belum disetel.
  return Inertia::render('Dashboard', ['video' => \App\Helpers\VideoPengumuman::url()]);
})->middleware(['auth'])->name('home');
// Ringkasan pembayaran kantor di Home (JSON, per bulan, kantor aktif).
Route::get('/dashboard/pembayaran', [\App\Http\Controllers\PembayaranKantorController::class, 'ringkasan'])
  ->middleware(['auth'])->name('dashboard.pembayaran');
// Dashboard Kasir: halaman kartu pembayaran kantor (bukan di Home).
Route::get('/dashboard-kasir', [\App\Http\Controllers\PembayaranKantorController::class, 'halaman'])
  ->middleware(['auth'])->name('dashboard.kasir');
Route::middleware(['auth'])->controller(\App\Http\Controllers\PembayaranKantorController::class)
  ->prefix('dashboard-kasir')->name('dashboard.kasir.')->group(function () {
    Route::post('/iuran', 'bayarIuran')->name('iuran');
    Route::post('/umrah', 'setorUmrah')->name('umrah');
    Route::post('/modal', 'bayarModal')->name('modal');
    Route::get('/goro-umrah', 'detailUmrah')->name('goro_umrah');
    Route::get('/pinjaman-modal', 'detailModal')->name('pinjaman_modal');
    Route::get('/bukti/{modul}/{id}', 'bukti')->whereIn('modul', ['tb', 'bop', 'umrah', 'modal'])->whereNumber('id')->name('bukti');
  });

Route::middleware('auth')->group(function () {

  Route::post('/set-branch', \App\Http\Controllers\SetBranchController::class)->name('set-branch');

  // Iuran 1 Juta, Iuran BOP, SKSW, Aset Kendaraan: hanya 5 peran ini (= menu sidebar,
  // mas 2026-10-15). Gerbang tulis yang lebih sempit tetap di controller masing-masing.
  Route::middleware('role:kasir|stafkontrol|pusat|pimpinan|superuser')->group(function () {
  Route::prefix('tabungan')->name('tabungan.')->controller(\App\Http\Controllers\TbContributionController::class)->group(function () {
    Route::get('/contributions', 'index')->name('contributions');
    Route::post('/contributions', 'store')->name('contributions.store');
    Route::delete('/contributions/{contribution}', 'destroy')->name('contributions.destroy');
    Route::get('/api/contributions/{branch}/history', 'history')->name('api.contributions.history');
  });

  Route::prefix('bop')->name('bop.')->controller(\App\Http\Controllers\BopContributionController::class)->group(function () {
    Route::get('/contributions', 'index')->name('contributions');
    Route::post('/contributions', 'store')->name('contributions.store');
    Route::delete('/contributions/{contribution}', 'destroy')->name('contributions.destroy');
    Route::get('/api/contributions/{branch}/history', 'history')->name('api.contributions.history');
  });

  Route::controller(\App\Http\Controllers\SkswUnitController::class)->prefix('sksw')->name('sksw.')->group(function () {
    Route::get('/unit', 'index')->name('unit');
    Route::get('/{saving}/detail', 'detail')->whereNumber('saving')->name('detail');
    // Input setoran bulanan SW/SK banyak karyawan (kasir/stafkontrol/pusat/superuser).
    Route::post('/setoran', 'setoran')->name('setoran');
    Route::post('/{saving}/transaksi', 'transaksi')->whereNumber('saving')->name('transaksi');
    Route::post('/{saving}/mutasi', 'mutasi')->whereNumber('saving')->name('mutasi');
    Route::delete('/transaksi/{transaction}', 'hapus')->whereNumber('transaction')->name('hapus');
  });

  Route::controller(\App\Http\Controllers\VehicleAssetController::class)->prefix('assets')->name('assets.')->group(function () {
    Route::get('/', 'index')->name('index');
    Route::post('/', 'store')->name('store');
    Route::get('/her', 'herList')->name('her');
    Route::post('/her/{vehicle}/confirm', 'confirmHer')->whereNumber('vehicle')->name('her.confirm');
    Route::delete('/her/tax/{tax}', 'cancelHer')->whereNumber('tax')->name('her.cancel');
    Route::get('/{asset}/detail', 'detailJson')->whereNumber('asset')->name('detail');
    Route::put('/{asset}', 'update')->whereNumber('asset')->name('update');
    Route::delete('/{asset}', 'destroy')->whereNumber('asset')->name('destroy');
    Route::post('/{asset}/mutate', 'mutate')->whereNumber('asset')->name('mutate');
    Route::post('/{asset}/maintenance', 'addMaintenance')->whereNumber('asset')->name('maintenance.store');
  });
  });

  Route::controller(BatchInputController::class)->name('batch_input.')->prefix('batch-input')->group(function () {
    Route::get('/', 'index')->name('index');
    Route::post('/', 'store')->name('store');
    Route::post('/check', 'validateData')->name('validateData');
  });

  Route::controller(PindahResortController::class)->group(function () {
    Route::get('/pindah-resort', 'PindahResort')->name('pindah_resort');
  });

  // Gate role WAJIB sebelum ->group() supaya menempel (dirantai sesudahnya tidak
  // berlaku ke route yang sudah terlanjur terdaftar). Alias 'role' didaftarkan di
  // app/Http/Kernel.php.
  Route::prefix('bukutransaksi')->name('transaction.')
    ->middleware('role:superuser|pimpinan|kasir|mantri|kepala-mantri|pengawas|stafkontrol')
    ->group(function () {
    Route::controller(TransactionLoanController::class)->group(function () {
      Route::get('/', "index_buku_transaksi")->name('index_buku_transaksi');
      // JSON daftar drop satu bulan (buku aktif) - dipakai muat-bulan-sebelumnya
      // (infinite back) di layar Buku Transaksi tanpa reload penuh.
      Route::get('/drop-bulan', "drop_bulan")->name('drop_bulan');
      // JSON buku angsuran harian untuk drawer storting di ACC KM.
      Route::get('/angsuran-hari', "angsuran_hari")->name('angsuran_hari');
      // Superuser: paksa materialisasi target auto untuk 1 buku (kelompok+hari
      // di cabang aktif) tanpa nunggu cron. Otorisasi superuser dicek controller.
      Route::post('/generate-target-auto', "generate_target_auto")->name('generate_target_auto');
      // Cek #1 pimpinan alur BARU (daily_closings): verifikasi drop/storting +
      // materialisasi target minggu depan (manual). Otorisasi dicek controller.
      Route::post('/ceklist-kepala-baru', "ceklist_kepala_baru")->name('ceklist_kepala_baru');
      Route::post('/nik', "nasabah_buku_transaksi")->name('nasabah_buku_transaksi');
      Route::post('/', "store_buku_transaksi")->name('store_buku_transaksi');
      Route::get('/fastcreate', "fastcreatev2")->name('fastcreate');
      Route::get('/inputmacet', "inputmacet")->name('inputmacet');
      Route::post('/batch', "store_buku_transaksi_batch")->name('store_buku_transaksi_batch');
      Route::put('/action/{transactionLoan}', "action_buku_transaksi")->name('action_buku_transaksi');
      Route::put('/updateEverything/{transactionLoan}', "updateEverything")->name('updateEverything');
      Route::post('/tundaan/{transactionLoan}', "tundaan_pengajuan")->name('tundaan_pengajuan');
    });
  });

  Route::prefix('pinjaman')->name('pinjaman.')->group(function () {
    Route::controller(TransactionLoanController::class)->group(function () {
      Route::get('/', "index_pinjaman")->name('index_pinjaman');
      // JSON buku angsuran bulanan untuk drawer storting di Rekap 1.
      Route::get('/buku-json', "buku_angsuran_json")->name('buku_angsuran_json');
      Route::get('/drop_date', "index_pinjaman_search")->name('index_pinjaman_search');
      Route::get('/pinjaman-macet', "index_pinjaman_macet")->name('index_pinjaman_macet');
      Route::get('/actionloan/{transactionLoan}', "get_loan_pinjaman")->name('get_loan_pinjaman');
      Route::get('/checkpengajuan/{transactionLoan}', "checkpengajuan")->name('checkpengajuan');
      Route::post('/actionloan/{transactionLoan}', "bayar_pinjaman")->name('bayar_pinjaman');
      Route::post('/store-pengajuan-lama/{transactionLoan}', "store_pengajuan_lama")->name('store_pengajuan_lama');
      Route::post('/white-off-loan/{transactionLoan}', "white_off_loan")->name('white_off_loan'); //router pemutihan
      Route::delete('/white-off/{transactionWhiteOff}', "destroy_white_off")->name('destroy_white_off');
      // Isi / ubah nomor anggota langsung dari buku angsuran (sel tabel).
      Route::post('/nomor-anggota/{transactionLoan}', "simpan_nomor_anggota")->name('simpan_nomor_anggota');
      Route::delete('/actionloan/{transactionLoanInstalment}', "destroy_angsuran")->name('destroy_angsuran');
      Route::delete('/deleteloan/{transactionLoan}', "destroy_loan")->name('destroy_loan');
    });
  });

  Route::prefix('administrasi')->name('administrasi.')->group(function () {
    Route::controller(EmployeeController::class)->prefix('manpower')->name('manpower.')->group(function () {
      Route::get('/', "index")->name('index');
      // Unggah foto profil karyawan (kasir / superuser), disimpan di MinIO avatars/.
      Route::post('/{employee}/avatar', "uploadAvatar")->name('avatar');
      // Hapus foto profil karyawan (kembali ke inisial nama).
      Route::delete('/{employee}/avatar', "deleteAvatar")->name('avatar.delete');
      // Dokumen karyawan (KTP, KK, SKCK, Ijazah, Lamaran Kerja, Pasfoto)
      Route::get('/{employee}/documents/{document}', "showDocument")->name('documents.show');
      Route::post('/{employee}/documents', "uploadDocument")->name('documents.upload');
      Route::delete('/{employee}/documents/{document}', "deleteDocument")->name('documents.destroy');
    });
    // Lamaran Kerja: catat pelamar & dokumen untuk cabang aktif; terima / tolak di app_laravel.
    Route::controller(\App\Http\Controllers\LamaranKerjaController::class)->prefix('lamaran')->name('lamaran.')->group(function () {
      Route::get('/', 'index')->name('index');
      Route::get('/cek-nik', 'cekNik')->name('cek_nik');
      Route::post('/', 'store')->name('store');
      Route::put('/{lamaran}', 'update')->name('update');
      Route::delete('/{lamaran}', 'destroy')->name('destroy');
      Route::post('/{lamaran}/dokumen', 'unggahDokumen')->name('unggah_dokumen');
      Route::get('/{lamaran}/dokumen/{dokumen}', 'lihatDokumen')->name('dokumen');
    });
  });

  // Perkakas persiapan migrasi ke alur agregasi baru (.agents/agregasi_rekap.md).
  // Otorisasi dicek di dalam controller, BUKAN lewat middleware 'role:' —
  // alias itu tidak terdaftar di app/Http/Kernel.php, dan merantai middleware
  // setelah ->group() juga tidak menempel (lihat 05_temuan_dan_jebakan.md A1).
  Route::prefix('migrasi')->name('migrasi.')->group(function () {
    // Kesiapan migrasi per kantor (superuser, baca-saja): bucket sistem vs sirkulasi lama + Z.
    Route::get('/kesiapan', [\App\Http\Controllers\MigrasiController::class, 'kesiapanMigrasi'])
      ->name('kesiapan');
    // Dashboard migrasi per wilayah (superuser); angka kesiapan dimuat per wilayah.
    Route::get('/dashboard', [\App\Http\Controllers\MigrasiController::class, 'dashboardMigrasi'])
      ->name('dashboard');
    Route::get('/dashboard/kantor/{branchId}', [\App\Http\Controllers\MigrasiController::class, 'dashboardKantor'])
      ->name('dashboard_kantor');
    // Nasabah macet belum lunas per kelompok x hari: tempat penyesuaian saldo (superuser).
    Route::get('/nasabah-macet', [\App\Http\Controllers\MigrasiController::class, 'nasabahMacet'])
      ->name('nasabah_macet');
    // Buat pinjaman MACET LAMA penampung Z satu kelompok x hari (superuser).
    Route::post('/kesiapan/macet-lama', [\App\Http\Controllers\MigrasiController::class, 'buatMacetLama'])
      ->name('buat_macet_lama');
    // Migrasikan kantor aktif ke pendataan baru (superuser, semua baris harus siap).
    Route::post('/kesiapan/migrasi', [\App\Http\Controllers\MigrasiController::class, 'jalankanMigrasi'])
      ->name('jalankan_migrasi');
    // Isi modal Migrasikan: anomali, usulan tanggal kunci, pratinjau (JSON).
    Route::get('/kesiapan/periksa', [\App\Http\Controllers\MigrasiController::class, 'periksaMigrasi'])
      ->name('periksa_migrasi');
    Route::post('/penyesuaian-saldo', [\App\Http\Controllers\MigrasiController::class, 'simpanPenyesuaian'])
      ->name('penyesuaian_saldo_simpan');
    // Koreksi Pasca Migrasi (superuser): koreksi angsuran sebelum tanggal migrasi + log.
    Route::get('/koreksi-beku', [\App\Http\Controllers\KoreksiBekuController::class, 'index'])
      ->name('koreksi_beku');
    Route::get('/koreksi-beku/tujuan', [\App\Http\Controllers\KoreksiBekuController::class, 'cariTujuan'])
      ->name('koreksi_beku_tujuan');
    Route::post('/koreksi-beku/pratinjau', [\App\Http\Controllers\KoreksiBekuController::class, 'pratinjau'])
      ->name('koreksi_beku_pratinjau');
    Route::post('/koreksi-beku', [\App\Http\Controllers\KoreksiBekuController::class, 'simpan'])
      ->name('koreksi_beku_simpan');
    Route::get('/koreksi-beku/log', [\App\Http\Controllers\KoreksiBekuController::class, 'log'])
      ->name('koreksi_beku_log');
  });

  // Buka kunci harian alur baru. Otorisasi dicek di controller.
  Route::controller(\App\Http\Controllers\ClosingHarianController::class)
    ->prefix('closing')->name('closing.')->group(function () {
      // Layar Closing Harian dicabut 2026-10-09; kunci lewat
      // Kasir -> Rekap (Cek Tunai Mantri), buka kunci dari drawer ACC KM.
      Route::post('/harian/{closing}/buka', 'buka')->name('buka');
    });
  // Tutup buku BULANAN alur baru (dari buku storting). Otorisasi di controller.
  Route::controller(\App\Http\Controllers\ClosingBulananController::class)
    ->prefix('closing/bulanan')->name('closing.bulanan.')->group(function () {
      // Tutup Buku Storting (satu langkah); layar Closing Bulanan dicabut.
      Route::post('/{closing}/tutup-buku', 'tutupBuku')->name('tutup_buku');
    });

  Route::prefix('kasir')->name('kasir.')->group(function () {
    Route::controller(TransactionDailyRecapController::class)->group(function () {
      Route::prefix('rekap')->name('rekap.')->group(function () {
        Route::post('/', "rekap_post")->name('rekap_post');
        // Setoran tunai (SU Lapangan) / transfer dari sel Rekap 1, alur baru.
        Route::post('/su-lapangan', "simpan_su_lapangan")->name('simpan_su_lapangan');
        // Dialog Kunci di Rekap 1 (alur baru): pratinjau JSON + kunci.
        Route::get('/pratinjau-kunci', "pratinjau_kunci")->name('pratinjau_kunci');
        Route::post('/kunci-hari', "kunci_hari")->name('kunci_hari');
        Route::post('/ceklist-kepala', "ceklist_kepala")->name('ceklist_kepala');
        Route::get('/permantri', "rekap_permantri")->name('rekap_permantri');
        // JSON detail per kelompok untuk drawer di Rekap 1 (tabel Global).
        Route::get('/permantri-json', "rekap_permantri_json")->name('rekap_permantri_json');
        Route::get('/rencana', "rencana_drop")->name('rencana_drop');
        Route::get('/rekap-satu', "rekap_satu")->name('rekap_satu');
        Route::get('/rekap-dua', "rekap_dua")->name('rekap_dua');
      });
    });
  });


  // Menu identik dengan web sudah dihapus (transaksi -> bukutransaksi, macet ->
  // pinjaman/pinjaman-macet, rekap-* -> kasir/rekap/*, rencana -> kasir/rekap/
  // rencana, byDates dibuang, landing dibuang). Sisa: input pengajuan + angsuran.
  Route::prefix('mobile_apps')->name('mobile_apps.')->group(function () {
    Route::controller(MobileAppsMantriController::class)->group(function () {
      Route::get('/create', "create")->name('create');
      Route::get('/angsuran', "angsuran")->name('angsuran');
      Route::get('/ml', "ml")->name('ml');
    });
  });

  // Kalender kerja nasional. Otorisasi (superuser) dicek di controller.
  Route::controller(\App\Http\Controllers\KalenderKerjaController::class)
    ->prefix('kalender-kerja')->name('kalender.')->group(function () {
      Route::get('/', 'index')->name('index');
      // Dipakai pemilih tanggal di layar input — bukan superuser-only,
      // otorisasinya dijelaskan di controller.
      Route::get('/libur', 'liburJson')->name('libur');
      Route::post('/', 'simpan')->name('simpan');
      Route::post('/terapkan-saran', 'terapkanSaran')->name('terapkan_saran');
    });

  // Mutasi nasabah — superuser saja, dicek di controller.
  Route::controller(\App\Http\Controllers\MutasiNasabahController::class)
    ->prefix('mutasi-nasabah')->name('mutasi_nasabah.')->group(function () {
      Route::get('/', 'index')->name('index');
      Route::post('/cari', 'cari')->name('cari');
      Route::post('/', 'simpan')->name('simpan');
    });

  // Panel admin: superuser saja. Tanpa gerbang ini user login mana pun bisa
  // memberi dirinya role (user-assign) atau izin buka kunci can-edit
  // (giveMaintenerWorker).
  Route::controller(AdminController::class)->prefix('admin-panel')->name('adminpanel.')
    ->middleware('role:superuser')->group(function () {
    Route::get('/', "index")->name('index');

    Route::post('/', "post_permission")->name('post_permission');
    Route::post('/role-assign', "role_assign")->name('role_assign');
    Route::post('/user-assign', "user_assign")->name('user_assign');
    Route::post('/giveMaintenerWorker', "giveMaintenerWorker")->name('giveMaintenerWorker');
  });
  // Tutup buku dari Approval Akhir (kasir/kepala) - di luar gerbang superuser.
  Route::post('/admin-panel/sirkulasiAwal', [AdminController::class, 'sirkulasiAwal'])->name('adminpanel.sirkulasiAwal');

  Route::prefix('profile')->name('profile.')->group(function () {
    Route::get('/', [ProfileController::class, 'edit'])->name('edit');
    Route::patch('/', [ProfileController::class, 'update'])->name('update');
    Route::delete('/', [ProfileController::class, 'destroy'])->name('destroy');
  });
});

require __DIR__ . '/auth.php';
