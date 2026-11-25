<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployeeZone extends Model
{
    protected $fillable = [
        'employee_id',
        'branch_id',
    ];

    /**
     * Karyawan pemilik akses zona ini.
     */
    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    /**
     * Cabang yang bisa diakses.
     */
    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }
}
