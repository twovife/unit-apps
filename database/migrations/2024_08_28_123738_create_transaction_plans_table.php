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
    Schema::create('transaction_plans', function (Blueprint $table) {
      $table->id();
      $table->bigInteger('transaction_hash_id')->nullable();
      $table->date('plan_date')->nullable();
      $table->bigInteger('branch_id')->nullable();
      $table->integer('kelompok')->nullable();
      $table->bigInteger('kasbon')->nullable();
      $table->bigInteger('target')->nullable();
      $table->bigInteger('masuk')->nullable();
      $table->bigInteger('keluar')->nullable();
      $table->bigInteger('storting')->nullable();
      $table->bigInteger('drop')->nullable();
      $table->bigInteger('baru')->nullable();
      $table->bigInteger('lama')->nullable();
      $table->bigInteger('rencana')->nullable();
      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('transaction_plans');
  }
};
