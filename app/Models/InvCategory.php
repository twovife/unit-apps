<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class InvCategory extends Model
{
    public const KENDARAAN = 1;

    public function assets(): HasMany
    {
        return $this->hasMany(InvAsset::class, 'category_id');
    }
}
