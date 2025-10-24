<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class CheckUserActive
{
  public function handle($request, Closure $next)
  {
    $user = Auth::user();

    if ($user && !$user->isactive) {
      Auth::logout();

      throw ValidationException::withMessages([
        'username' => 'Akun Anda tidak aktif. Silakan hubungi administrator.',
      ]);
    }

    return $next($request);
  }
}
