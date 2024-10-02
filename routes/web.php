<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\LoanController;
use App\Http\Controllers\MantriAppsController;
use App\Http\Controllers\MobileAppsMantriController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TransactionDailyRecapController;
use App\Http\Controllers\TransactionLoanController;
use App\Models\TransactionDailyRecap;
use App\Models\TransactionLoan;
use Illuminate\Foundation\Application;
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
  return Inertia::render('Dashboard');
})->middleware(['auth'])->name('home');

Route::middleware('auth')->group(function () {

  Route::controller(LoanController::class)->group(function () {
    // Route::prefix('transaction')->name('transaction.')->group(function () {
    //   Route::post('/nik', 'getCustomerLoan')->name('getnik');
    //   Route::get('/', 'index_transaction')->name('index');
    //   Route::get('/open', 'index_transaction_open')->name('index_open');
    //   Route::get('/create', 'create_transaction')->name('create');
    //   Route::post('/', 'store_transaction')->name('store');
    //   Route::get('/{loanRequest}', 'show_transaction')->name('show');
    //   Route::put('/{loanRequest}', 'update_transaction')->name('update');
    // })->middleware('permission:unit');

    // Route::prefix('pinjaman')->name('pinjaman.')->group(function () {
    //   Route::prefix('normal')->name('normal.')->group(function () {
    //     Route::get('/', 'index_angsuran_normal')->name('index');
    //     Route::get('/create', 'create_angsuran_normal')->name('create');
    //     Route::post('/', 'store_angsuran_normal')->name('store');
    //     Route::get('/{loan}', 'show_angsuran_normal')->name('show');
    //     Route::post('/{loan}', 'update_angsuran_normal')->name('update');
    //     Route::post('/{loan}/nasabah', 'update_jenis_nasabah')->name('nasabah');
    //     Route::delete('/{instalment}', 'deleteAngsuran')->name('deleteAngsuran');
    //     Route::delete('/{loan}/loan', 'deleteLoan')->name('deleteLoan');
    //   });
    // });

    Route::prefix('batchupdate')->name('batchupdate.')->group(function () {
      Route::get('/', 'batch_create')->name('batch_create');
      Route::post('/', 'batch_post')->name('batch_post');
    })->middleware('permission:unit');
  });

  Route::controller(MantriAppsController::class)->group(function () {
    Route::prefix('mantri-apps')->name('mantriapps.')->group(function () {
      Route::get('/', 'mantri_index')->name('index');
      Route::get('/create', 'mantri_create')->name('create');
      Route::post('/', 'mantri_store')->name('store');
      Route::get('/transaksi', 'mantri_transaksi')->name('transaksi');
      Route::get('/drop', 'mantri_drop')->name('drop');
      Route::get('/show/{loanRequest}', 'mantri_show')->name('show');
      Route::get('/show_drop/{loanRequest}', 'mantri_show_drop')->name('show_drop');
      Route::put('/show/{loanRequest}', 'mantri_update')->name('update');
      Route::get('/angsur', 'mantri_angsur')->name('angsur');
      Route::get('/ml', 'mantri_ml')->name('ml');

      Route::get('/bayar/{loan}', 'mantri_bayar_angsuran')->name('bayar');
      Route::post('/bayar/{loan}', 'mantri_bayar_angsuran_post')->name('bayarpost');

      Route::get('/bayarml/{loan}', 'mantri_bayar_angsuran_ml')->name('bayar_ml');
      Route::post('/bayarml/{loan}', 'mantri_bayar_angsuran_ml_post')->name('bayarmlpost');
    });
  });

  Route::prefix('bukutransaksi')->name('transaction.')->group(function () {
    Route::controller(TransactionLoanController::class)->group(function () {
      Route::get('/', "index_buku_transaksi")->name('index_buku_transaksi');
      Route::post('/nik', "nasabah_buku_transaksi")->name('nasabah_buku_transaksi');
      Route::post('/', "store_buku_transaksi")->name('store_buku_transaksi');
      Route::get('/fastcreate', "fastcreate")->name('fastcreate');
      Route::post('/batch', "store_buku_transaksi_batch")->name('store_buku_transaksi_batch');
      Route::put('/action/{transactionLoan}', "action_buku_transaksi")->name('action_buku_transaksi');
      Route::put('/updateEverything/{transactionLoan}', "updateEverything")->name('updateEverything');
    });
  });

  Route::prefix('pinjaman')->name('pinjaman.')->group(function () {
    Route::controller(TransactionLoanController::class)->group(function () {
      Route::get('/', "index_pinjaman")->name('index_pinjaman');
      Route::get('/drop_date', "index_pinjaman_search")->name('index_pinjaman_search');
      Route::get('/actionloan/{transactionLoan}', "get_loan_pinjaman")->name('get_loan_pinjaman');
      Route::post('/actionloan/{transactionLoan}', "bayar_pinjaman")->name('bayar_pinjaman');
      Route::delete('/actionloan/{transactionLoanInstalment}', "destroy_angsuran")->name('destroy_angsuran');
      Route::delete('/deleteloan/{transactionLoan}', "destroy_loan")->name('destroy_loan');
    });
  });

  Route::prefix('kasir')->name('kasir.')->group(function () {
    Route::controller(TransactionDailyRecapController::class)->group(function () {
      Route::prefix('rekap')->name('rekap.')->group(function () {
        Route::get('/', "rekap_index")->name('rekap_index');
        Route::post('/', "rekap_post")->name('rekap_post');
        Route::post('/ceklist-kepala', "ceklist_kepala")->name('ceklist_kepala');
        Route::get('/permantri', "rekap_permantri")->name('rekap_permantri');
        Route::get('/rencana', "rencana_drop")->name('rencana_drop');
      });
    });
  });


  Route::prefix('mobile_apps')->name('mobile_apps.')->group(function () {
    Route::controller(MobileAppsMantriController::class)->group(function () {
      Route::get('/', "index")->name('index');
      Route::get('/create', "create")->name('create');
      Route::post('/create', "store")->name('store');
      Route::get('/transaksi', "transaksi")->name('transaksi');
      Route::get('/angsuran', "angsuran")->name('angsuran');
      Route::get('/macet', "macet")->name('macet');
      Route::get('/buku-angsuran', "buku_angsuran")->name('buku_angsuran');
      Route::get('/buku-transaksi', "buku_transaksi")->name('buku_transaksi');
      Route::get('/buku-rekap', "buku_rekap")->name('buku_rekap');
    });
  });

  Route::controller(AdminController::class)->prefix('admin-panel')->name('adminpanel.')->group(function () {
    Route::get('/', "index")->name('index');
    Route::post('/', "post_permission")->name('post_permission');
    Route::post('/role-assign', "role_assign")->name('role_assign');
    Route::post('/user-assign', "user_assign")->name('user_assign');
    Route::post('/sirkulasiAwal', "sirkulasiAwal")->name('sirkulasiAwal');
  });

  Route::prefix('profile')->name('profile.')->group(function () {
    Route::get('/', [ProfileController::class, 'edit'])->name('edit');
    Route::patch('/', [ProfileController::class, 'update'])->name('update');
    Route::delete('/', [ProfileController::class, 'destroy'])->name('destroy');
  });
});

require __DIR__ . '/auth.php';
