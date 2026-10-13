<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobApplicationDocument extends Model
{
    protected $fillable = ['application_id', 'type', 'file_path'];
}
