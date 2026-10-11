import { useEffect, useState } from 'react';
import InputError from '@/Components/InputError';
import { Head, useForm } from '@inertiajs/react';
import { Input } from '@/shadcn/ui/input';
import { Label } from '@/shadcn/ui/label';
import { Button } from '@/shadcn/ui/button';
import Loading from '@/Components/Loading';
import TombolPasangAplikasi from '@/Components/TombolPasangAplikasi';
import { Eye, EyeOff, Info, Lock, LogIn, User } from 'lucide-react';

/**
 * Halaman login: panel merek gelap (warna logo) di kiri pada desktop, di atas
 * pada HP; formulir di kanan/bawah. `status` = pesan dari server (mis. sesi
 * habis, akun nonaktif) -> kotak info di atas formulir.
 */
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
    <div className="flex flex-col min-h-screen bg-slate-50 lg:flex-row">
      <Head title="Log in" />
      <Loading show={processing} />

      {/* Panel merek */}
      <div className="relative flex flex-col items-center justify-center gap-4 px-6 pt-12 pb-16 overflow-hidden text-white bg-black lg:w-1/2 lg:min-h-screen lg:pb-12">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_20%,#334155,transparent_60%)]"
        />
        <img src="/icons/icon-512.png" alt="UBMI" className="relative w-24 h-24 rounded-2xl lg:w-40 lg:h-40" />
        <div className="relative text-center">
          <h1 className="text-2xl font-bold tracking-tight lg:text-4xl">UBMI Apps</h1>
          <p className="mt-1 text-sm text-slate-300 lg:text-base">Sistem transaksi &amp; pembukuan cabang</p>
        </div>
      </div>

      {/* Formulir */}
      <div className="flex items-start justify-center flex-1 px-4 -mt-8 lg:items-center lg:mt-0">
        <div className="w-full max-w-sm p-6 bg-white border shadow-lg rounded-2xl lg:shadow-sm">
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-slate-900">Masuk</h2>
            <p className="text-sm text-slate-500">Gunakan username &amp; password akun Anda.</p>
          </div>

          {status && (
            <div className="flex gap-2 p-3 mb-4 text-sm border rounded-lg text-amber-800 bg-amber-50 border-amber-200">
              <Info className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
              <span>{status}</span>
            </div>
          )}

          <form className="grid gap-4" onSubmit={submit}>
            <div className="grid gap-1.5">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-slate-400" aria-hidden="true" />
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="username"
                  required
                  autoComplete="username"
                  autoCapitalize="none"
                  autoFocus
                  className="h-11 pl-9"
                  value={data.username}
                  onChange={(e) => setData('username', e.target.value)}
                />
              </div>
              <InputError message={errors.username} />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-slate-400" aria-hidden="true" />
                <Input
                  id="password"
                  name="password"
                  type={lihat ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  className="h-11 pl-9 pr-10"
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setLihat((v) => !v)}
                  className="absolute p-1 -translate-y-1/2 rounded right-2 top-1/2 text-slate-400 hover:text-slate-700"
                  aria-label={lihat ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {lihat ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <InputError message={errors.password} />
            </div>

            <Button type="submit" disabled={processing} className="w-full gap-2 h-11">
              <LogIn className="w-4 h-4" aria-hidden="true" />
              Masuk
            </Button>
          </form>

          <div className="flex items-center justify-between pt-4 mt-5 text-xs border-t text-slate-400">
            <span>© {new Date().getFullYear()} UBMI</span>
            <TombolPasangAplikasi />
          </div>
        </div>
      </div>
    </div>
  );
}
