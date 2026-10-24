<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * A list of exception types with their corresponding custom log levels.
     *
     * @var array<class-string<\Throwable>, \Psr\Log\LogLevel::*>
     */
    protected $levels = [
        //
    ];

    /**
     * A list of the exception types that are not reported.
     *
     * @var array<int, class-string<\Throwable>>
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     *
     * @return void
     */
    public function register()
    {
        $this->reportable(function (Throwable $e) {
            //
        });

        // 419 (token CSRF kedaluwarsa, biasanya sesi habis): jangan tampilkan
        // halaman error di popup Inertia. Sesi habis -> ke login dengan pesan;
        // masih login (mis. token basi dari tab lain) -> kembali ke halaman tadi.
        // 303 supaya PUT/DELETE dari Inertia dilanjutkan sebagai GET.
        $this->renderable(function (\Symfony\Component\HttpKernel\Exception\HttpException $e, $request) {
            if ($e->getStatusCode() !== 419) {
                return null;
            }
            return auth()->check()
                ? back(303)->with('message', 'Halaman kedaluwarsa, silakan ulangi.')
                : redirect()->route('login', [], 303)->with('status', 'Sesi habis, silakan login lagi.');
        });
    }
}
