import { useEffect, useState } from 'react';
import InputError from '@/Components/InputError';
import { Head, useForm } from '@inertiajs/react';
import { Input } from '@/shadcn/ui/input';
import { Label } from '@/shadcn/ui/label';
import { Button } from '@/shadcn/ui/button';
import Loading from '@/Components/Loading';
import TombolPasangAplikasi from '@/Components/TombolPasangAplikasi';
import { Eye, EyeOff, Info, Lock, LogIn, Sparkles, User } from 'lucide-react';

export default function Login({ status }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    username: '',
    password: '',
  });
  const [lihat, setLihat] = useState(false);

  useEffect(() => () => reset('password'), []);

  const submit = (e) => {
    e.preventDefault();
    post(route('login'), { replace: true });
  };

  return (
    <div className="relative flex flex-col justify-between min-h-dvh bg-white text-slate-800 antialiased overflow-x-hidden selection:bg-red-600 selection:text-white lg:flex-row lg:items-stretch">
      <Head title="Masuk · UBMI DIGITAL" />
      <Loading show={processing} />

      {/* SISI KIRI (Desktop) / ATAS (Mobile): Branding Area */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 pt-10 pb-6 text-center sm:pt-14 sm:pb-8 lg:w-1/2 lg:min-h-dvh lg:p-14 lg:border-r lg:border-slate-100">
        {/* Logo UBM Mandiri */}
        <img
          src="/icons/logo-ubm.webp?v=3"
          alt="Logo UBM"
          className="w-auto h-24 sm:h-28 lg:h-36 object-contain drop-shadow-xs transition-transform duration-300 hover:scale-105"
        />

        {/* Nama Brand */}
        <h1 className="mt-3.5 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl lg:text-4xl lg:mt-5">
          UBMI <span className="text-red-600">DIGITAL</span>
        </h1>
        <p className="mt-1 text-xs font-semibold tracking-wider uppercase text-slate-400 sm:text-sm lg:text-base lg:mt-2">
          Aplikasi Pembukuan &amp; Transaksi Cabang
        </p>
      </div>

      {/* SISI KANAN (Desktop) / BAWAH (Mobile): Card Formulir Masuk */}
      <div className="relative z-10 w-full max-w-lg mx-auto sm:px-4 sm:pb-8 lg:w-1/2 lg:max-w-none lg:mx-0 lg:p-12 lg:flex lg:flex-col lg:items-center lg:justify-center lg:bg-slate-50/50">
        <div className="w-full min-h-[62vh] sm:min-h-0 flex flex-col justify-between p-8 sm:p-10 bg-white border-t sm:border border-slate-100 shadow-[0_-15px_45px_rgba(15,23,42,0.07)] sm:shadow-2xl rounded-t-[2.8rem] sm:rounded-3xl lg:max-w-md lg:rounded-3xl lg:border lg:shadow-xl lg:shadow-slate-200/50 lg:min-h-0">
          {/* Header Card */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-red-50 text-red-600">
                <Sparkles className="w-3.5 h-3.5" />
              </span>
              <span className="text-xs font-bold tracking-wider uppercase text-slate-400">
                Portal Masuk
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Welcome To <span className="text-red-600">UBMI DIGITAL</span>
            </h2>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Silakan masukkan username &amp; password akun tugas Anda.
            </p>
          </div>

          {status && (
            <div className="flex items-start gap-2.5 p-3 mb-5 text-sm border rounded-2xl text-amber-900 bg-amber-50 border-amber-200">
              <Info className="w-4 h-4 mt-0.5 shrink-0 text-amber-600" aria-hidden="true" />
              <span>{status}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={submit}>
            {/* Input Username */}
            <div className="space-y-1.5">
              <Label
                htmlFor="username"
                className="text-xs font-bold tracking-wide uppercase text-slate-600"
              >
                Username
              </Label>
              <div className="relative group">
                <div className="absolute -translate-y-1/2 pointer-events-none left-4 top-1/2 text-slate-400 group-focus-within:text-red-600 transition-colors">
                  <User className="w-5 h-5" aria-hidden="true" />
                </div>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Masukkan username"
                  required
                  autoComplete="username"
                  autoCapitalize="none"
                  autoFocus
                  className="h-12 pl-12 pr-4 text-sm font-medium bg-slate-50/70 hover:bg-slate-100/60 focus:bg-white border-slate-200/90 focus:border-red-600 focus:ring-4 focus:ring-red-600/15 rounded-2xl transition duration-200 text-slate-900 placeholder:text-slate-400"
                  value={data.username}
                  onChange={(e) => setData('username', e.target.value)}
                />
              </div>
              <InputError message={errors.username} />
            </div>

            {/* Input Password */}
            <div className="space-y-1.5">
              <Label
                htmlFor="password"
                className="text-xs font-bold tracking-wide uppercase text-slate-600"
              >
                Password
              </Label>
              <div className="relative group">
                <div className="absolute -translate-y-1/2 pointer-events-none left-4 top-1/2 text-slate-400 group-focus-within:text-red-600 transition-colors">
                  <Lock className="w-5 h-5" aria-hidden="true" />
                </div>
                <Input
                  id="password"
                  name="password"
                  type={lihat ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  className="h-12 pl-12 pr-12 text-sm font-medium bg-slate-50/70 hover:bg-slate-100/60 focus:bg-white border-slate-200/90 focus:border-red-600 focus:ring-4 focus:ring-red-600/15 rounded-2xl transition duration-200 text-slate-900 placeholder:text-slate-400"
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setLihat((v) => !v)}
                  className="absolute p-2 -translate-y-1/2 transition-colors rounded-xl right-2 top-1/2 text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  aria-label={lihat ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {lihat ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <InputError message={errors.password} />
            </div>

            {/* Tombol Masuk */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={processing}
                className="w-full h-12 text-sm font-bold text-white transition-all duration-200 rounded-full shadow-lg bg-red-600 hover:bg-red-700 active:bg-red-800 shadow-red-600/25 active:scale-[0.98] cursor-pointer"
              >
                <LogIn className="w-4 h-4 mr-1.5" aria-hidden="true" />
                <span>{processing ? 'Memproses...' : 'Masuk ke Aplikasi'}</span>
              </Button>
            </div>
          </form>

          {/* Footer Card */}
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100 text-xs text-slate-400">
            <span>© {new Date().getFullYear()} UBMI DIGITAL</span>
            <TombolPasangAplikasi />
          </div>
        </div>
      </div>
    </div>
  );
}
