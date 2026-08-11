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
        Schema::table('transaction_loans', function (Blueprint $table) {
            // Penghubung "pengajuan pelunasan" -> pinjaman lama yang mau
            // dilunaskan begitu pinjaman ini di-drop (status jadi success).
            // Tanpa FK constraint - mengikuti konvensi kolom id lain di tabel
            // ini (transaction_manage_customer_id dkk juga tanpa FK).
            $table->unsignedBigInteger('previous_loan_id')->nullable()->after('id');
            $table->index('previous_loan_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transaction_loans', function (Blueprint $table) {
            $table->dropIndex(['previous_loan_id']);
            $table->dropColumn('previous_loan_id');
        });
    }
};
