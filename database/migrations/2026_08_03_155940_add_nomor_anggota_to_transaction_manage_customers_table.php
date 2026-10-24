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
        Schema::table('transaction_manage_customers', function (Blueprint $table) {
            // Nullable di DB - 1,9jt+ baris lama tidak punya nilai ini.
            // Wajib diisi cuma ditegakkan di validasi form (bukan di kolom).
            $table->string('nomor_anggota')->nullable()->after('alternative_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transaction_manage_customers', function (Blueprint $table) {
            $table->dropColumn('nomor_anggota');
        });
    }
};
