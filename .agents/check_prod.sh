ssh vps 'docker exec muv-php php -r "
require \"vendor/autoload.php\";
\$app = require_once \"bootstrap/app.php\";
\$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

\$user = App\Models\User::where(\"username\", \"yahyu\")->first();
echo \"=== USER yahyu ===\n\";
if (\$user) {
    echo \"ID: \" . \$user->id . \" | Username: \" . \$user->username . \" | Emp ID: \" . \$user->employee_id . \"\n\";
    echo \"Roles: \" . json_encode(\$user->roles->pluck(\"name\")) . \"\n\";
    echo \"Permissions: \" . json_encode(\$user->getAllPermissions()->pluck(\"name\")) . \"\n\";
    echo \"Allowed Branches: \" . json_encode(App\Models\Branch::getAllowedBranchIds(\$user)) . \"\n\";
} else {
    echo \"User yahyu tidak ditemukan!\n\";
}

\$emp = App\Models\Employee::where(\"nik\", \"1701022102950001\")->first();
echo \"=== EMPLOYEE NIK 1701022102950001 ===\n\";
if (\$emp) {
    echo \"ID: \" . \$emp->id . \" | Nama: \" . \$emp->nama_karyawan . \" | Branch: \" . \$emp->branch_id . \"\n\";
    echo \"Zones: \" . json_encode(DB::table(\"employee_zones\")->where(\"employee_id\", \$emp->id)->pluck(\"branch_id\")) . \"\n\";
    echo \"Branches: \" . json_encode(DB::table(\"employee_branches\")->where(\"employee_id\", \$emp->id)->pluck(\"branch_id\")) . \"\n\";
} else {
    echo \"Employee NIK 1701022102950001 tidak ditemukan!\n\";
}
"'
