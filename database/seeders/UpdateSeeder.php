<?php

namespace Database\Seeders;

use App\Models\Customer;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UpdateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $customers = Customer::with("loan_request.loan")->whereBetween('id', [1, 50])->get();

        $loan = $customers->map(function ($customer) {
            if ($customer->loan_request->isNotEmpty()) {
                $customer->loan_request;
            } else {
                echo "no" . $customer->id . PHP_EOL;
            }
        });
    }
}
