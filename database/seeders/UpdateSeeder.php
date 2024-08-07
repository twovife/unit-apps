<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\TransactionCustomer;
use App\Models\TransactionLoan;
use Carbon\Carbon;
use Exception;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UpdateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        try {
            DB::beginTransaction();
            $customers = Customer::with("loan_request.loan")->get();


            $customers->map(function ($customer) {
                echo "memproses" . $customer->id . PHP_EOL;
                $nasabah = TransactionCustomer::create([
                    "nama" => $customer->nama,
                    "nik" => $customer->nik,
                    "no_kk" => $customer->no_kk,
                    "alamat" => $customer->alamat,
                ]);
                echo "nasabah baru" . $customer->id . PHP_EOL . "telah dibuat";

                if ($customer->loan_request->isNotEmpty()) {
                    $drop_before = 0;
                    $customer->loan_request->map(function ($transaksi) use ($nasabah, &$drop_before) {
                        $drop_before = $transaksi->loan?->drop ?? 0;
                        $manage =  $nasabah->manage_customer()->create([
                            "branch_id" => $transaksi->branch_id,
                            "kelompok" => $transaksi->kelompok,
                        ]);
                        if ($transaksi->status == "open") {
                            $loan = $manage->loan()->create([
                                "branch_id" => $transaksi->branch_id,
                                "old_id" => $transaksi->id,
                                "request_date" => $transaksi->transaction_date,
                                "user_mantri" => $transaksi->mantri,
                                "check_date" => null,
                                "user_check" => null,
                                "drop_date" => $transaksi->tanggal_drop,
                                "user_drop" => null,
                                "hari" => $transaksi->hari,
                                "pinjaman_ke" => null,
                                "status" => $transaksi->status,
                                "notes" => $transaksi->notes,
                                "user_input" => $transaksi->mantri,
                            ]);

                            $nominal = $loan->loan_nominal()->create([
                                "transaction_loan_id" => $transaksi->transaction_loan_id,
                                "drop_before" => $drop_before,
                                "request_nominal" => $transaksi->pinjaman,
                                "approved_nominal" => null,
                                "drop" => null,
                                "pinjaman" => null,
                            ]);
                        }
                        if ($transaksi->status == "tolak") {
                            $loan = $manage->loan()->create([
                                "branch_id" => $transaksi->branch_id,
                                "old_id" => $transaksi->id,
                                "request_date" => $transaksi->transaction_date,
                                "user_mantri" => $transaksi->mantri,
                                "check_date" => $transaksi->approved_date,
                                "user_check" => $transaksi->approved_by,
                                "drop_date" => $transaksi->tanggal_drop,
                                "user_drop" => null,
                                "hari" => $transaksi->hari,
                                "pinjaman_ke" => null,
                                "status" => $transaksi->status,
                                "notes" => $transaksi->notes,
                                "user_input" => $transaksi->mantri,
                            ]);
                            $nominal = $loan->loan_nominal()->create([
                                "transaction_loan_id" => $transaksi->transaction_loan_id,
                                "drop_before" => $drop_before,
                                "request_nominal" => $transaksi->pinjaman,
                                "approved_nominal" => null,
                                "drop" => null,
                                "pinjaman" => null,
                            ]);
                        }
                        if ($transaksi->status == "acc") {
                            $tanggal = Carbon::now()->format('Y-m-d');
                            $status = $transaksi->tanggal_drop > $tanggal ? "success" : "acc";
                            $loan = $manage->loan()->create([
                                "branch_id" => $transaksi->branch_id,
                                "old_id" => $transaksi->id,
                                "request_date" => $transaksi->transaction_date,
                                "user_mantri" => $transaksi->mantri,
                                "check_date" => $transaksi->approved_date,
                                "user_check" => $transaksi->approved_by,
                                "drop_date" => $transaksi->tanggal_drop,
                                "user_drop" =>  $status == "success" ? $transaksi->mantri : null,
                                "hari" => $transaksi->hari,
                                "pinjaman_ke" => null,
                                "status" => $status,
                                "notes" => $transaksi->notes,
                                "user_input" => $transaksi->mantri,
                            ]);


                            $nominal = $loan->loan_nominal()->create([
                                "transaction_loan_id" => $transaksi->transaction_loan_id,
                                "drop_before" => $drop_before,
                                "request_nominal" => $transaksi->pinjaman,
                                "approved_nominal" => $transaksi->loan?->drop,
                                "drop" =>  $status == "success" ?  $transaksi->loan?->drop : null,
                                "pinjaman" =>  $status == "success" ?  $transaksi->loan?->pinjaman : null,
                            ]);

                            // id, loan_id, pembayaran_date, jumlah, status, mantri, danatitipan, created_at, updated_at

                            if ($transaksi->loan?->angsuran->isNotEmpty()) {
                                $transaksi->loan->angsuran->map(function ($angsuran) use ($loan) {
                                    $loan->loan_instalment()->create([
                                        "transaction_date" => $angsuran->pembayaran_date,
                                        "nominal" => $angsuran->jumlah,
                                        "status" => $angsuran->status,
                                        "instalment_notes" => $angsuran->instalment_notes,
                                        "danatitipan" => $angsuran->danatitipan,
                                        "user_mantri" => $angsuran->mantri,
                                        "user_input" => $angsuran->mantri,
                                    ]);
                                });
                                echo "upload data angsuran";
                            }
                        }
                    });
                    echo "success" . $customer->id . PHP_EOL;
                } else {
                    echo "success with no loan" . $customer->id . PHP_EOL;
                }
            });
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            echo "failed" . $e;
        }
    }
}
