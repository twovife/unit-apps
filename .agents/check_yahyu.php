<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "=== EMPLOYEE NIK 1701022102950001 ===" . PHP_EOL;
$e = DB::table('employees')->where('nik', '1701022102950001')->first();
echo json_encode($e, JSON_PRETTY_PRINT) . PHP_EOL;

echo "=== USER yahyu ===" . PHP_EOL;
$u = DB::table('users')->where('username', 'yahyu')->first();
echo json_encode($u, JSON_PRETTY_PRINT) . PHP_EOL;

echo "=== CABANG ID {$e->branch_id} ===" . PHP_EOL;
$b = DB::table('branches')->where('id', $e->branch_id)->first();
echo json_encode($b, JSON_PRETTY_PRINT) . PHP_EOL;
