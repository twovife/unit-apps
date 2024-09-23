<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  /**
   * Run the migrations.
   */
  public function up(): void
  {
    Schema::create('transaction_daily_recaps', function (Blueprint $table) {
      $table->id();
      $table->bigInteger('transaction_loan_officer_grouping_id')->nullable();

      $table->date('date')->nullable();

      $table->bigInteger('kasbon')->nullable();
      $table->bigInteger('transport')->nullable();
      $table->bigInteger('tunai')->nullable();
      $table->bigInteger('titipan')->nullable();

      $table->bigInteger('storting')->nullable();
      $table->bigInteger('drop')->nullable();
      $table->bigInteger('keluar')->nullable();
      $table->bigInteger('masuk')->nullable();
      $table->bigInteger('target')->nullable();

      $table->bigInteger('kurangan')->nullable();


      $table->timestamp('daily_kepala_approval')->nullable();
      $table->bigInteger('daily_kepala_approval_user')->nullable();

      $table->timestamp('daily_kasir_approval')->nullable();
      $table->bigInteger('daily_kasir_approval_user')->nullable();

      $table->timestamp('monthly_kepala_approval')->nullable();
      $table->bigInteger('monthly_kepala_approval_user')->nullable();

      $table->timestamp('monthly_kasir_approval')->nullable();
      $table->bigInteger('monthly_kasir_approval_user')->nullable();
      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('transaction_daily_recaps');
  }
};
