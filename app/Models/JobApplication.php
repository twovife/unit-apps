<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Lamaran kerja (tabel milik app_laravel, DB bersama). unit-apps hanya
 * mencatat & menghapus selama masih menunggu; terima / tolak oleh HRD di
 * app_laravel (JobApplicationController di sana).
 */
class JobApplication extends Model
{
    public const MENUNGGU = 'menunggu';
    public const DITERIMA = 'diterima';
    public const DITOLAK = 'ditolak';

    /** Sama dengan app_laravel JobApplication::DOC_TYPES (disalin ke employee_documents saat diterima). */
    public const DOC_TYPES = ['lamaran_kerja', 'ijazah', 'ktp', 'kk', 'skck'];

    protected $fillable = [
        'nama', 'nik', 'no_hp', 'alamat', 'tanggal_lamaran', 'employment_id', 'referensi_employee_id',
        'branch_input_id', 'penempatan_branch_id', 'catatan', 'status', 'created_by',
    ];

    protected $casts = [
        'tanggal_lamaran' => 'date',
        'decided_at' => 'datetime',
    ];

    public function documents()
    {
        return $this->hasMany(JobApplicationDocument::class, 'application_id');
    }

    public function employment()
    {
        return $this->belongsTo(Employment::class);
    }

    public function referensi()
    {
        return $this->belongsTo(Employee::class, 'referensi_employee_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
