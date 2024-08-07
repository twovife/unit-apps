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
        Schema::create('transaction_loans', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('transaction_manage_customers')->nullable();
            $table->bigInteger('old_id')->nullable();
            $table->bigInteger('branch_id')->nullable();
            $table->date('request_date')->nullable();
            $table->bigInteger('user_mantri')->nullable();
            $table->date('check_date')->nullable();
            $table->bigInteger('user_check')->nullable();
            $table->date('drop_date')->nullable();
            $table->bigInteger('user_drop')->nullable();
            $table->string('hari', 255)->nullable();
            $table->integer('pinjaman_ke')->nullable();
            $table->string('status', 255)->nullable();
            $table->string('notes')->nullable();
            $table->bigInteger('user_input')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaction_loans');
    }
};
