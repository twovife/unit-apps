<?php

namespace App\Console;

use App\Console\Commands\CountingDailyBalance;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
  /**
   * Define the application's command schedule.
   *
   * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
   * @return void
   */


  protected $commands = [
    CountingDailyBalance::class
  ];

  protected function schedule(Schedule $schedule)
  {
    // $schedule->command('inspire')->hourly();
    $schedule->command('app:counting-daily-balance')->everySecond();

    // Bangkitkan baris agregat harian bulan DEPAN untuk kantor yang sudah
    // migrasi, dijalankan tiap hari.
    //
    // Kenapa dijadwalkan, bukan menunggu orang menjalankan perintah: itu
    // persis penyakit yang sedang kita obati satu tingkat lebih tinggi.
    // `transaction_sirculations` bolong di 4 kantor karena barisnya hanya
    // lahir kalau ada yang menekan tombol. Kalau baris bulan depan juga
    // menunggu seseorang ingat, kita cuma memindahkan masalahnya.
    //
    // Aman diulang tiap hari: closing:generate memakai firstOrCreate, jadi
    // baris yang sudah ada tidak disentuh - termasuk yang sudah terkunci.
    // Tanpa --branch, dia hanya menyentuh kantor yang sudah migrasi.
    $schedule->call(function () {
      $bulanDepan = now()->addMonthNoOverflow()->format('Y-m');
      \Illuminate\Support\Facades\Artisan::call('closing:generate', ['periode' => $bulanDepan]);
    })->dailyAt('01:00')->name('closing-generate-bulan-depan')->withoutOverlapping();
  }

  /**
   * Register the commands for the application.
   *
   * @return void
   */
  protected function commands()
  {
    $this->load(__DIR__ . '/Commands');

    require base_path('routes/console.php');
  }
}
