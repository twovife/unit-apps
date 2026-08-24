<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\Employee;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class GenerateEmpUserSeeder extends Seeder
{
  /**
   * Run the database seeds.
   */
  public function run(): void
  {
    $branches = Branch::whereBetween('id', [146, 159])->get();

    $now = now();

    foreach ($branches as $branch) {
      $branchId = $branch->id;
      $branchCode = $branch->code;
      $suffix = "_" . strtolower($branchCode);
      // Generate pimpinan
      $pimpinan = Employee::create([
        'nip' => null,
        'nama_karyawan' => 'pimpinan',
        'nik' => $this->generateUniqueNIK(),
        'alamat' => null,
        'kota' => null,
        'hire_date' => '2025-03-01',
        'jabatan' => 'pimpinan',
        'area' => 0,
        'branch_id' => $branchId,
        'janis_jaminan' => null,
        'date_resign' => null,
        'resign_status' => null,
        'resign_reson' => null,
        'pencairan_simpanan_date' => null,
        'pencairan_simpanan_by' => null,
        'pencairan_simpanan_w_date' => null,
        'pencairan_simpanan_w_by' => null,
        'handover_jaminan' => null,
        'handover_jaminan_by' => null,
        'created_at' => $now,
        'updated_at' => $now,
        'employment_id' => 1,
      ]);

      $pimpinanUser = User::create([
        'employee_id' => $pimpinan->id,
        'username' => "pimpinan{$suffix}",
        'email' => "pimpinan{$branchId}@mantri.local",
        'password' => Hash::make('4343abab'),
        'isactive' => 1,
      ]);
      $pimpinanUser->assignRole('pimpinan');

      // Generate kepala mantri
      $kepalaMantri = Employee::create([
        'nip' => null,
        'nama_karyawan' => 'kepala mantri',
        'nik' => $this->generateUniqueNIK(),
        'alamat' => null,
        'kota' => null,
        'hire_date' => '2025-03-01',
        'jabatan' => 'kepala mantri',
        'area' => 0,
        'branch_id' => $branchId,
        'janis_jaminan' => null,
        'date_resign' => null,
        'resign_status' => null,
        'resign_reson' => null,
        'pencairan_simpanan_date' => null,
        'pencairan_simpanan_by' => null,
        'pencairan_simpanan_w_date' => null,
        'pencairan_simpanan_w_by' => null,
        'handover_jaminan' => null,
        'handover_jaminan_by' => null,
        'created_at' => $now,
        'updated_at' => $now,
        'employment_id' => 3,
      ]);

      $kepalaMantriUser = User::create([
        'employee_id' => $kepalaMantri->id,
        'username' => "km{$suffix}",
        'email' => "kepalamantri{$branchId}@mantri.local",
        'password' => Hash::make('4343abab'),
        'isactive' => 1,
      ]);
      $kepalaMantriUser->assignRole('km');

      // Generate staf
      $staf = Employee::create([
        'nip' => null,
        'nama_karyawan' => 'staf',
        'nik' => $this->generateUniqueNIK(),
        'alamat' => null,
        'kota' => null,
        'hire_date' => '2025-03-01',
        'jabatan' => 'staf',
        'area' => 0,
        'branch_id' => $branchId,
        'janis_jaminan' => null,
        'date_resign' => null,
        'resign_status' => null,
        'resign_reson' => null,
        'pencairan_simpanan_date' => null,
        'pencairan_simpanan_by' => null,
        'pencairan_simpanan_w_date' => null,
        'pencairan_simpanan_w_by' => null,
        'handover_jaminan' => null,
        'handover_jaminan_by' => null,
        'created_at' => $now,
        'updated_at' => $now,
        'employment_id' => 4,
      ]);

      $stafUser = User::create([
        'employee_id' => $staf->id,
        'username' => "staf{$suffix}",
        'email' => "staf{$branchId}@mantri.local",
        'password' => Hash::make('4343abab'),
        'isactive' => 1,
      ]);
      $stafUser->assignRole('staff');

      // Generate 10 mantri with area 1-10
      for ($area = 1; $area <= 10; $area++) {
        $mantri = Employee::create([
          'nip' => null,
          'nama_karyawan' => "mantri {$area}",
          'nik' => $this->generateUniqueNIK(),
          'alamat' => null,
          'kota' => null,
          'hire_date' => '2025-03-01',
          'jabatan' => 'mantri',
          'area' => $area,
          'branch_id' => $branchId,
          'janis_jaminan' => null,
          'date_resign' => null,
          'resign_status' => null,
          'resign_reson' => null,
          'pencairan_simpanan_date' => null,
          'pencairan_simpanan_by' => null,
          'pencairan_simpanan_w_date' => null,
          'pencairan_simpanan_w_by' => null,
          'handover_jaminan' => null,
          'handover_jaminan_by' => null,
          'created_at' => $now,
          'updated_at' => $now,
          'employment_id' => 6,
        ]);

        $mantriUser = User::create([
          'employee_id' => $mantri->id,
          'username' => "mantri{$area}{$suffix}",
          'email' => "mantri{$area}_{$branchCode}@mantri.local",
          'password' => Hash::make('4343abab'),
          'isactive' => 1,
        ]);
        $mantriUser->assignRole('mantri');
      }
    }
  }

  /**
   * Generate a unique 16-digit NIK starting with 00011
   */
  private function generateUniqueNIK(): string
  {
    do {
      $nik = '00011' . str_pad(mt_rand(0, 99999999999), 11, '0', STR_PAD_LEFT);
    } while (Employee::where('nik', $nik)->exists());

    return $nik;
  }
}
