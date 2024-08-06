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
            $table->integer('transaction_loan_id')->nullable();
            $table->integer('drop_before')->nullable();
            $table->integer('request_nominal')->nullable();
            $table->integer('approved_nominal')->nullable();
            $table->integer('drop')->nullable();
            $table->integer('pinjaman')->nullable();
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
