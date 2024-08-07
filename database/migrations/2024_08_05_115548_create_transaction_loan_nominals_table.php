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
        Schema::create('transaction_loan_nominals', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('transaction_loan_id')->nullable();
            $table->bigInteger('drop_before')->nullable();
            $table->bigInteger('request_nominal')->nullable();
            $table->bigInteger('approved_nominal')->nullable();
            $table->bigInteger('drop')->nullable();
            $table->bigInteger('pinjaman')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaction_loan_nominals');
    }
};
