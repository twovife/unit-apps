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
        Schema::create('transaction_loan_instalments', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('transaction_loan_id')->nullable();
            $table->date('transaction_date')->nullable();
            $table->bigInteger('nominal')->nullable();
            $table->string('status')->nullable();
            $table->string('instalment_notes')->nullable();
            $table->bigInteger('user_input')->nullable();
            $table->bigInteger('user_mantri')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaction_loan_instalments');
    }
};
