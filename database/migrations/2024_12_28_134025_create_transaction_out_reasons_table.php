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
    Schema::create('transaction_out_reasons', function (Blueprint $table) {
      $table->id();
      $table->string('reason')->nullable();
      $table->timestamps();
    });

    Schema::table('transaction_loans', function (Blueprint $table) {
      $table->integer('transaction_out_reasons_id')->nullable(); // isinya BHT, LUNAS, PENGAJUAN, MACET, PEMUTIHAN
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('transaction_out_reasons');
  }
};
