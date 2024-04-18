<?php

use App\Http\Controllers\LoanController;
use App\Http\Controllers\MantriAppsController;
use App\Http\Controllers\ProfileController;
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
        Route::prefix('transaction')->name('transaction.')->group(function () {
            Route::post('/nik', 'getCustomerLoan')->name('getnik');
            Route::get('/', 'index_transaction')->name('index');
            Route::get('/create', 'create_transaction')->name('create');
            Route::post('/', 'store_transaction')->name('store');
            Route::get('/{loanRequest}', 'show_transaction')->name('show');
            Route::put('/{loanRequest}', 'update_transaction')->name('update');
        })->middleware('permission:unit');

        Route::prefix('pinjaman')->name('pinjaman.')->group(function () {
            Route::prefix('normal')->name('normal.')->group(function () {
                Route::get('/', 'index_angsuran_normal')->name('index');
                Route::get('/create', 'create_angsuran_normal')->name('create');
                Route::post('/', 'store_angsuran_normal')->name('store');
                Route::get('/{loan}', 'show_angsuran_normal')->name('show');
                Route::post('/{loan}', 'update_angsuran_normal')->name('update');
                Route::post('/{loan}/nasabah', 'update_jenis_nasabah')->name('nasabah');
            });
        });
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
            Route::put('/show/{loanRequest}', 'mantri_update')->name('update');
            Route::get('/angsur', 'mantri_angsur')->name('angsur');
        });
    });


    Route::prefix('profile')->name('profile.')->group(function () {
        Route::get('/', [ProfileController::class, 'edit'])->name('edit');
        Route::patch('/', [ProfileController::class, 'update'])->name('update');
        Route::delete('/', [ProfileController::class, 'destroy'])->name('destroy');
    });
});

require __DIR__ . '/auth.php';
