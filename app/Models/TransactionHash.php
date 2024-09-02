<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;

class TransactionHash extends Model
{
  use HasFactory;

  protected $fillable = ['previous_block_hash', 'merkle_root'];

  public function setPreviousBlockHashAttribute($value)
  {
    $this->attributes['previous_block_hash'] = Hash::make($value);
  }

  // Mutator untuk kolom 'merkle_root'
  public function setMerkleRootAttribute($value)
  {
    $this->attributes['merkle_root'] = Hash::make($value);
  }
}
