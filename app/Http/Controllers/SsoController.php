<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

/**
 * Masuk otomatis dari bossub (link sekali pakai). bossub menandatangani "u|exp|n|app" dengan
 * HMAC-SHA256 memakai SSO_SECRET yang sama di kedua server; link berlaku maksimal 2 menit dan
 * nonce-nya hanya bisa dipakai sekali. Syarat akses sama dengan login biasa (akun aktif).
 */
class SsoController extends Controller
{
    private const APP = 'unit_apps';

    public function masuk(Request $request): RedirectResponse
    {
        $secret = (string) config('services.sso.secret');
        abort_if($secret === '', 404);

        $userId = (string) $request->query('u');
        $exp = (int) $request->query('exp');
        $nonce = (string) $request->query('n');
        $harapan = hash_hmac('sha256', "{$userId}|{$exp}|{$nonce}|".self::APP, $secret);

        abort_unless(hash_equals($harapan, (string) $request->query('sig')), 403, 'Link masuk tidak valid.');
        abort_unless($exp >= now()->timestamp && $exp <= now()->addMinutes(2)->timestamp, 403, 'Link masuk sudah kedaluwarsa.');
        abort_unless(strlen($nonce) >= 16 && Cache::add('sso-nonce:'.$nonce, true, now()->addMinutes(5)), 403, 'Link masuk sudah dipakai.');

        $user = User::find($userId);
        abort_unless($user && $user->isactive, 403, 'Akun Anda tidak aktif.');

        Auth::login($user);
        $request->session()->regenerate();
        $request->session()->forget('url.intended');

        return redirect(RouteServiceProvider::HOME);
    }
}
