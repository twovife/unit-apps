<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmployeeBranch extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'branch_id',
        'employment_id',
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function employment()
    {
        return $this->belongsTo(Employment::class);
    }
}
