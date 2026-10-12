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
 * pada HP (seluruh layar hitam); formulir di kanan/bawah. `status` = pesan dari server (mis. sesi
 * habis, akun nonaktif) -> kotak info di atas formulir.
 */
// Isian kaca di HP, normal di desktop.
const KACA = 'bg-black/50 border-white/25 text-white placeholder:text-white/50 lg:bg-white lg:border-input lg:text-slate-900 lg:placeholder:text-slate-400';

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
    // HP: satu layar hitam - logo & nama di atas, kartu kaca di bawahnya.
    // min-h-dvh (bukan 100vh): di HP 100vh lebih tinggi dari layar yang
    // terlihat (bilah alamat), itu yang membuat halaman bisa digulir.
    // Desktop (lg): dibelah dua - panel merek kiri, formulir kanan di latar abu.
    <div className="relative flex flex-col overflow-hidden min-h-dvh bg-black lg:flex-row">
      <Head title="Masuk" />
      <Loading show={processing} />

      {/* HP: bola warna kabur di belakang kartu kaca (glassmorphism). */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none lg:hidden">
        <div className="absolute rounded-full -left-16 top-1/3 w-72 h-72 bg-sky-500/40 blur-3xl" />
        <div className="absolute rounded-full -right-20 top-1/2 w-72 h-72 bg-fuchsia-500/30 blur-3xl" />
        <div className="absolute rounded-full left-1/4 -bottom-16 w-64 h-64 bg-emerald-500/30 blur-3xl" />
      </div>

      {/* Panel merek */}
      <div className="relative flex flex-col items-center justify-center gap-2 px-6 pt-8 pb-5 text-white lg:w-1/2 lg:min-h-dvh lg:gap-5">
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_50%_0%,#334155,transparent_65%)] lg:bg-[radial-gradient(circle_at_30%_20%,#334155,transparent_60%)]"
        />
        <img src="/icons/icon-512.png" alt="UBMI" className="relative w-16 h-16 rounded-2xl lg:w-40 lg:h-40" />
        <div className="relative text-center">
          <h1 className="text-2xl font-extrabold tracking-wide lg:text-4xl">UBMI DIGITAL</h1>
          <p className="mt-1 text-sm text-slate-400 lg:text-base">Aplikasi Pembukuan Kantor</p>
        </div>
      </div>

      {/* Formulir */}
      <div className="flex flex-col items-center flex-1 px-4 pb-4 lg:justify-center lg:bg-slate-50 lg:pb-0">
        {/* HP: kartu kaca di atas latar gelap; desktop: kartu putih biasa. */}
        <div
          className="relative w-full max-w-sm p-5 text-white border shadow-2xl rounded-2xl sm:p-6 bg-white/10 border-white/20 backdrop-blur-xl
            lg:text-slate-900 lg:bg-white lg:border-slate-200 lg:shadow-sm lg:backdrop-blur-none
            [&_label]:text-white/90 lg:[&_label]:text-slate-900"
        >
          <div className="mb-5">
            <h2 className="text-lg font-semibold sm:text-xl">Masuk</h2>
            <p className="text-sm text-white/70 lg:text-slate-500">Gunakan username &amp; password akun Anda.</p>
          </div>

          {status && (
            <div className="flex gap-2 p-3 mb-4 text-sm border rounded-lg text-amber-100 bg-amber-500/20 border-amber-300/40 lg:text-amber-800 lg:bg-amber-50 lg:border-amber-200">
              <Info className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
              <span>{status}</span>
            </div>
          )}

          <form className="grid gap-4" onSubmit={submit}>
            <div className="grid gap-1.5">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-white/60 lg:text-slate-400" aria-hidden="true" />
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="username"
                  required
                  autoComplete="username"
                  autoCapitalize="none"
                  autoFocus
                  className={`h-11 pl-9 ${KACA}`}
                  value={data.username}
                  onChange={(e) => setData('username', e.target.value)}
                />
              </div>
              <InputError message={errors.username} />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-white/60 lg:text-slate-400" aria-hidden="true" />
                <Input
                  id="password"
                  name="password"
                  type={lihat ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  className={`h-11 pl-9 pr-10 ${KACA}`}
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setLihat((v) => !v)}
                  className="absolute p-1 -translate-y-1/2 rounded right-2 top-1/2 text-white/60 hover:text-white lg:text-slate-400 lg:hover:text-slate-700"
                  aria-label={lihat ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {lihat ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <InputError message={errors.password} />
            </div>

            <Button type="submit" disabled={processing} className="w-full gap-2 h-11 bg-white text-slate-900 hover:bg-white/90 lg:bg-primary lg:text-primary-foreground lg:hover:bg-primary/90">
              <LogIn className="w-4 h-4" aria-hidden="true" />
              Masuk
            </Button>
          </form>

          <div className="flex items-center justify-between pt-4 mt-5 text-xs border-t border-white/20 text-white/60 lg:border-slate-200 lg:text-slate-400">
            <span>© {new Date().getFullYear()} UBMI DIGITAL</span>
            <TombolPasangAplikasi />
          </div>
        </div>
      </div>
    </div>
  );
}
