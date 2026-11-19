$branchName = 'Krian 2 Goro';
$branch = \App\Models\Branch::where('unit', $branchName)->first();
$user = \App\Models\User::whereHas('employee', function($q) use ($branch) {
    $q->where('branch_id', $branch->id);
})->first();

\Auth::login($user);
session(['branch_id' => $branch->id]);

$request = new \Illuminate\Http\Request();
$request->merge(['date' => '2026-07-06']);

$controller = new \App\Http\Controllers\TransactionDailyRecapController();
$data = $controller->getRekapDuaData($request);

echo "--- $branchName ---\n";
if (isset($data['datas']) && count($data['datas']) > 0) {
    $first = $data['datas'][0];
    echo "Saldo Awal CM : " . $first['sirkulasi'] . "\n";
    echo "Kasbon        : " . $first['kasbon'] . "\n";
    echo "Transport     : " . $first['transport'] . "\n";
    echo "Tunai DB      : " . $first['tunai_ondb'] . "\n";
} else {
    echo "No data found\n";
}

$branchName = 'Krian 3';
$branch = \App\Models\Branch::where('unit', $branchName)->first();
$user = \App\Models\User::whereHas('employee', function($q) use ($branch) {
    $q->where('branch_id', $branch->id);
})->first();

\Auth::login($user);
session(['branch_id' => $branch->id]);

$data = $controller->getRekapDuaData($request);

echo "--- $branchName ---\n";
if (isset($data['datas']) && count($data['datas']) > 0) {
    $first = $data['datas'][0];
    echo "Saldo Awal CM : " . $first['sirkulasi'] . "\n";
    echo "Kasbon        : " . $first['kasbon'] . "\n";
    echo "Transport     : " . $first['transport'] . "\n";
    echo "Tunai DB      : " . $first['tunai_ondb'] . "\n";
} else {
    echo "No data found\n";
}
