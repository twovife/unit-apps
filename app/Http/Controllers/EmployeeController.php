<?php

namespace App\Http\Controllers;

use App\Helpers\AppHelper;
use App\Models\Branch;
use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmployeeController extends Controller
{
  /**
   * Display a listing of the resource.
   */
  public function index(Request $request)
  {

    // Data karyawan (NIK, alamat) hanya untuk KM / kasir / pimpinan ke atas,
    // dan hanya cabang yang boleh diakses user - ?branch_id dari URL dulu
    // dipakai mentah, jadi siapa pun bisa membaca karyawan cabang mana pun.
    abort_unless(auth()->user()->hasPermissionTo('view-all-groups'), 403, 'Data karyawan untuk kepala mantri, kasir, dan pimpinan.');
    $scope = \App\Helpers\AuthScope::resolve();
    $boleh = Branch::getAllowedBranchIds(auth()->user());
    $branch_id = $request->filled('branch_id') && ($boleh === null || in_array((int) $request->branch_id, $boleh))
      ? (int) $request->branch_id
      : $scope->branch_id;
    $wilayah = $scope->wilayah;
    $kelompok = $scope->kelompok;
    $authorized = $scope->user;
    $userAuthorized = AppHelper::branch_permission($authorized, $branch_id);
    // dd($scope->branch_id);


    $employee = Employee::with('username.rolelist', 'employment')->where('branch_id', $branch_id)
      ->select('id', 'branch_id', 'nik', 'nama_karyawan', 'alamat', 'hire_date', 'area', 'janis_jaminan', 'date_resign', 'resign_status', 'resign_reson', 'employment_id', 'avatar')
      ->orderBy('date_resign')
      ->orderBy('employment_id')
      ->orderBy('area')
      ->get();


    // Foto profil: diunggah lewat app_laravel ke MinIO (disk s3, folder
    // avatars/). Di sini cukup link sementara lewat s3_publik; MinIO belum
    // disetel / gagal -> null, layar jatuh ke inisial nama.
    $disk = null;
    if (config('filesystems.disks.s3_publik.bucket')) {
      try {
        $disk = \Illuminate\Support\Facades\Storage::disk('s3_publik');
      } catch (\Throwable $e) {
        $disk = null;
      }
    }
    $foto = function (?string $path) use ($disk) {
      if (!$disk || !$path) {
        return null;
      }
      try {
        return $disk->temporaryUrl($path, now()->addHours(3));
      } catch (\Throwable $e) {
        return null;
      }
    };

    $data = $employee->map(function ($item) use ($foto) {
      $username = $item->username->first();
      $jabatanName = $item->employment?->jabatan ?? '-';
      return [
        'id' => $item->id,
        'branch_id' => $item->branch_id,
        'identity_id' => $item->nik,
        'employee_name' => $item->nama_karyawan,
        'avatar' => $foto($item->avatar),
        'username' => $username?->username,
        'rolelist' => $username?->rolelist->map(function ($role) {
          return [
            'name' => $role->name
          ];
        }),
        'username_status' => $username?->isactive,
        'address' => $item->alamat,
        'employment' => strtolower($jabatanName) === "mantri" ? ($jabatanName . " " . $item->area) : $jabatanName,
        'isActive' => $item->date_resign ? false : true,
        'resign_date' => $item->date_resign,
        'hire_date' => $item->hire_date,
      ];
    });

    // dd($data);

    return Inertia::render('WebView/ManPower/Index', [
      'datas' => $data,
      'server_filter' => [
        'wilayah' => $wilayah,
        'branch' => $userAuthorized['branches'],
        'userAuthorized' => $userAuthorized,
        'branch_id' => $branch_id
      ]
    ]);
  }

  /**
   * Show the form for creating a new resource.
   */
  public function create()
  {
    //
  }

  /**
   * Unggah foto profil (avatar) karyawan: kasir & superuser, karyawan di cabang
   * yang boleh diakses. Disimpan di MinIO folder avatars/ (disk s3) - tempat
   * yang sama dengan unggahan app_laravel - lalu foto lama dihapus.
   * Beda dengan pas foto berkas lamaran kerja (menyusul).
   */
  public function uploadAvatar(Request $request, Employee $employee)
  {
    $user = auth()->user();
    abort_unless($user->hasAnyRole(['kasir', 'superuser']), 403, 'Unggah foto khusus kasir.');
    $boleh = Branch::getAllowedBranchIds($user);
    abort_unless($boleh === null || in_array((int) $employee->branch_id, $boleh), 403, 'Karyawan ini bukan cabang Anda.');

    $request->validate(
      ['avatar' => ['required', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048']],
      ['avatar.max' => 'Ukuran foto maksimal 2MB.', 'avatar.image' => 'File harus berupa foto.']
    );

    try {
      $path = $request->file('avatar')->store('avatars', 's3');
    } catch (\Throwable $e) {
      \Illuminate\Support\Facades\Log::error('Unggah avatar gagal: ' . $e->getMessage(), ['employee' => $employee->id]);
      $path = false;
    }
    if (!$path) {
      return back()->withErrors('Gagal menyimpan foto ke server penyimpanan.');
    }

    $lama = $employee->getAttribute('avatar');
    $employee->forceFill(['avatar' => $path])->save();

    if ($lama) {
      try {
        \Illuminate\Support\Facades\Storage::disk('s3')->delete($lama);
      } catch (\Throwable $e) {
        // Foto lama gagal dihapus tidak boleh menggagalkan penggantian.
      }
    }

    return back()->with('message', 'Foto profil diperbarui.');
  }

  /**
   * Display the specified resource.
   */
  public function show(Employee $employee)
  {
    //
  }

  /**
   * Show the form for editing the specified resource.
   */
  public function edit(Employee $employee)
  {
    //
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(Request $request, Employee $employee)
  {
    //
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(Employee $employee)
  {
    //
  }
}
