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


    $employee = Employee::with([
      'username.rolelist',
      'employment',
      'documents' => fn($q) => $q->where('is_old', false)->orderBy('created_at', 'desc'),
    ])->where('branch_id', $branch_id)
      ->select('id', 'branch_id', 'nik', 'nama_karyawan', 'alamat', 'hire_date', 'area', 'janis_jaminan', 'date_resign', 'resign_status', 'resign_reson', 'employment_id', 'avatar')
      ->orderBy('date_resign')
      ->orderBy('employment_id')
      ->orderBy('area')
      ->get();


    // Foto profil & dokumen: disimpan di MinIO (disk s3). Di sini link sementara lewat s3_publik.
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
        'documents' => $item->documents->map(function ($doc) use ($foto) {
          $tglUpdate = $doc->updated_at ?? $doc->created_at;
          return [
            'id' => $doc->id,
            'type' => $doc->type,
            'file_path' => $doc->file_path,
            'url' => $foto($doc->file_path),
            'updated_at' => $tglUpdate ? $tglUpdate->format('d M Y H:i') : null,
            'human_updated' => $tglUpdate ? $tglUpdate->diffForHumans() : null,
          ];
        })->values(),
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
   * Hapus foto profil karyawan (khusus kasir / superuser cabang).
   */
  public function deleteAvatar(Employee $employee)
  {
    $user = auth()->user();
    abort_unless($user->hasAnyRole(['kasir', 'superuser']), 403, 'Hapus foto khusus kasir.');
    $boleh = Branch::getAllowedBranchIds($user);
    abort_unless($boleh === null || in_array((int) $employee->branch_id, $boleh), 403, 'Karyawan ini bukan cabang Anda.');

    $lama = $employee->getAttribute('avatar');
    $employee->forceFill(['avatar' => null])->save();

    if ($lama) {
      try {
        \Illuminate\Support\Facades\Storage::disk('s3')->delete($lama);
      } catch (\Throwable $e) {
        // Foto lama gagal dihapus tidak boleh menggagalkan proses reset.
      }
    }

    return back()->with('message', 'Foto profil berhasil dihapus.');
  }

  /**
   * Unggah dokumen berkas digital karyawan (KTP, KK, SKCK, Ijazah, Lamaran Kerja, Pasfoto).
   */
  public function uploadDocument(Request $request, Employee $employee)
  {
    $user = auth()->user();
    abort_unless($user->hasAnyRole(['kasir', 'superuser']), 403, 'Unggah dokumen khusus kasir.');
    $boleh = Branch::getAllowedBranchIds($user);
    abort_unless($boleh === null || in_array((int) $employee->branch_id, $boleh), 403, 'Karyawan ini bukan cabang Anda.');

    $request->validate([
      'type' => ['required', 'string', 'in:ktp,kk,skck,ijazah,lamaran_kerja,pasfoto'],
      'file' => ['required', 'file', 'mimes:jpeg,png,jpg,pdf', 'max:5120'],
    ], [
      'file.mimes' => 'File harus berupa foto (JPEG, PNG) atau dokumen PDF.',
      'file.max' => 'Ukuran file maksimal 5MB.',
    ]);

    try {
      $path = $request->file('file')->store('documents/' . $employee->id, 's3');
    } catch (\Throwable $e) {
      \Illuminate\Support\Facades\Log::error('Unggah dokumen karyawan gagal: ' . $e->getMessage(), ['employee' => $employee->id]);
      $path = false;
    }

    if (!$path) {
      return back()->withErrors('Gagal menyimpan file ke server penyimpanan.');
    }

    // Dokumen aktif jenis ini digantikan yang baru
    $existing = $employee->documents()->where('type', $request->type)->where('is_old', false)->first();
    if ($existing) {
      if ($existing->file_path) {
        try {
          \Illuminate\Support\Facades\Storage::disk('s3')->delete($existing->file_path);
        } catch (\Throwable $e) {}
      }
      $existing->delete();
    }

    \App\Models\EmployeeDocument::create([
      'employee_id' => $employee->id,
      'type' => $request->type,
      'file_path' => $path,
      'is_old' => false,
    ]);

    return back()->with('message', 'Dokumen berhasil diunggah.');
  }

  /**
   * Hapus dokumen berkas digital karyawan.
   */
  public function deleteDocument(Employee $employee, \App\Models\EmployeeDocument $document)
  {
    $user = auth()->user();
    abort_unless($user->hasAnyRole(['kasir', 'superuser']), 403, 'Hapus dokumen khusus kasir.');
    $boleh = Branch::getAllowedBranchIds($user);
    abort_unless($boleh === null || in_array((int) $employee->branch_id, $boleh), 403, 'Karyawan ini bukan cabang Anda.');
    abort_unless((int) $document->employee_id === (int) $employee->id, 404);

    if ($document->file_path) {
      try {
        \Illuminate\Support\Facades\Storage::disk('s3')->delete($document->file_path);
      } catch (\Throwable $e) {}
    }

    $document->delete();

    return back()->with('message', 'Dokumen berhasil dihapus.');
  }

  /**
   * Tampilkan dokumen digital karyawan secara inline di tab baru.
   */
  public function showDocument(Employee $employee, \App\Models\EmployeeDocument $document)
  {
    $user = auth()->user();
    abort_unless($user->hasPermissionTo('view-all-groups') || $user->hasAnyRole(['kasir', 'superuser']), 403, 'Akses ditolak.');
    $boleh = Branch::getAllowedBranchIds($user);
    abort_unless($boleh === null || in_array((int) $employee->branch_id, $boleh), 403, 'Karyawan ini bukan cabang Anda.');
    abort_unless((int) $document->employee_id === (int) $employee->id, 404);

    return \App\Support\Unggahan::tampilkan($document->file_path);
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
