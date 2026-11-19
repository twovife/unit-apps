<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployeeDocument extends Model
{
  protected $fillable = [
    'employee_id',
    'type',
    'file_path',
    'is_old',
  ];

  protected $casts = [
    'is_old' => 'boolean',
  ];

  public function employee()
  {
    return $this->belongsTo(Employee::class);
  }
}
