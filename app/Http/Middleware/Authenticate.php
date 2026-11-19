<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate extends Middleware
{
    /**
     * Akun yang dinonaktifkan ditendang di request berikutnya, tidak menunggu
     * sesinya habis (isactive sebelumnya hanya dicek saat login).
     */
    public function handle($request, \Closure $next, ...$guards)
    {
        $user = $request->user();
        if ($user && !$user->isactive) {
            \Illuminate\Support\Facades\Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()->route('login', [], 303)
                ->with('status', 'Akun Anda tidak aktif. Silakan hubungi administrator.');
        }

        return parent::handle($request, $next, ...$guards);
    }

    /**
     * Get the path the user should be redirected to when they are not authenticated.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    protected function redirectTo($request)
    {
        if (! $request->expectsJson()) {
            return route('login');
        }
    }
}
