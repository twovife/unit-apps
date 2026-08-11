import React, { useEffect, useMemo, useRef, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { Input } from '@/shadcn/ui/input';
import { Label } from '@/shadcn/ui/label';
import Loading from '@/Components/Loading';

/**
 * FilterBar - filter inline (bukan dropdown/popover) untuk halaman mobile.
 *
 * KONTRAK UTAMA - filter tidak pernah berubah sendiri:
 *  1. Query HANYA berubah sebagai akibat langsung dari interaksi manual
 *     (tap chip hari, ganti bulan, ganti kelompok). Tidak ada auto-submit
 *     berbasis timer, debounce, polling, atau efek yang ikut tanggal sistem.
 *  2. Tap pada nilai yang sudah aktif tidak mengirim apa pun.
 *  3. Pilihan terakhir disimpan di localStorage per halaman, lalu dipulihkan
 *     saat halaman dibuka lagi tanpa query string - sehingga data yang tampil
 *     tetap sesuai pilihan manual terakhir, bukan default server yang ikut
 *     bergeser mengikuti hari ini.
 *
 * Satu-satunya navigasi tanpa tap adalah pemulihan pilihan tersimpan pada
 * poin 3, dan itu hanya terjadi bila URL sama sekali tidak membawa parameter
 * filter. Matikan lewat prop `restoreOnMount={false}` bila tidak diinginkan.
 */

const HARI_OPTIONS = [
  { value: 'senin', short: 'Sen' },
  { value: 'selasa', short: 'Sel' },
  { value: 'rabu', short: 'Rab' },
  { value: 'kamis', short: 'Kam' },
  { value: 'jumat', short: 'Jum' },
  { value: 'sabtu', short: 'Sab' },
];

const KELOMPOK_OPTIONS = Array.from({ length: 10 }, (_, i) => i + 1);

const MONTH_PATTERN = /^\d{4}-\d{2}$/;

const FilterBar = ({
  urlLink,
  storageKey,
  showHari = true,
  showMonth = true,
  showKelompok = false,
  restoreOnMount = true,
  extraParams = {},
  children,
}) => {
  const { server_filter } = usePage().props;

  // Nilai filter yang SEDANG dipakai server untuk menghasilkan data di layar.
  const active = useMemo(
    () => ({
      hari: server_filter?.hari ?? '',
      month: server_filter?.month ?? '',
      kelompok: server_filter?.kelompok ?? '',
    }),
    [server_filter?.hari, server_filter?.month, server_filter?.kelompok],
  );

  // Cermin lokal dari `active`, dipakai untuk umpan balik optimistis supaya
  // chip langsung terlihat terpilih sementara request masih jalan.
  const [local, setLocal] = useState(active);
  const [loading, setLoading] = useState(false);
  const restoredRef = useRef(false);

  const lsKey = storageKey ? `filter:${storageKey}` : null;

  const readSaved = () => {
    if (!lsKey) return null;
    try {
      const raw = localStorage.getItem(lsKey);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const writeSaved = (value) => {
    if (!lsKey) return;
    try {
      localStorage.setItem(lsKey, JSON.stringify(value));
    } catch {
      /* localStorage penuh / diblokir - abaikan, filter tetap jalan */
    }
  };

  const managedKeys = useMemo(() => {
    const keys = [];
    if (showHari) keys.push('hari');
    if (showMonth) keys.push('month');
    if (showKelompok) keys.push('kelompok');
    return keys;
  }, [showHari, showMonth, showKelompok]);

  const buildParams = (source) => {
    const params = { ...extraParams };
    managedKeys.forEach((key) => {
      if (
        source[key] !== '' &&
        source[key] !== null &&
        source[key] !== undefined
      ) {
        params[key] = source[key];
      }
    });
    return params;
  };

  const go = (source, options = {}) => {
    router.get(urlLink, buildParams(source), {
      preserveScroll: true,
      onStart: () => setLoading(true),
      onFinish: () => setLoading(false),
      ...options,
    });
  };

  /**
   * Terapkan satu perubahan seketika. Dipanggil HANYA dari handler interaksi
   * pengguna - tidak pernah dari useEffect.
   */
  const applyNow = (key, value) => {
    if (String(active[key] ?? '') === String(value ?? '')) return; // tidak berubah
    const next = { ...local, [key]: value };
    setLocal(next);
    writeSaved(buildParams(next));
    go(next);
  };

  // Pemulihan pilihan tersimpan - sekali saja, dan hanya bila URL benar-benar
  // tidak membawa parameter filter (artinya kita masuk dari menu, bukan dari
  // hasil pilihan sebelumnya atau dari link yang sudah membawa filter).
  useEffect(() => {
    if (!restoreOnMount || restoredRef.current || !lsKey) return;
    restoredRef.current = true;

    const search = new URLSearchParams(window.location.search);
    if (managedKeys.some((key) => search.has(key))) return;

    const saved = readSaved();
    if (!saved) return;

    const berbeda = managedKeys.some(
      (key) => String(saved[key] ?? '') !== String(active[key] ?? ''),
    );
    if (!berbeda) return;

    go(saved, { replace: true });
  }, []);

  // Selaraskan cermin lokal setiap kali server mengirim filter aktif yang baru.
  // Murni menyalin nilai ke state - tidak memicu navigasi apa pun.
  useEffect(() => {
    setLocal(active);
  }, [active]);

  return (
    <div className="mb-3 border rounded-lg bg-card">
      <Loading show={loading} />

      {showHari && (
        <div className="px-3 pt-3">
          <Label className="text-[11px] uppercase tracking-wide text-muted-foreground">
            Hari
          </Label>
          <div className="grid grid-cols-6 gap-1 mt-1">
            {HARI_OPTIONS.map((opt) => {
              const dipilih = local.hari === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  disabled={loading}
                  onClick={() => applyNow('hari', opt.value)}
                  aria-pressed={dipilih}
                  className={[
                    'rounded-md border py-2 text-xs font-medium transition-colors',
                    'disabled:opacity-60',
                    dipilih
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-input bg-background text-foreground hover:bg-accent',
                  ].join(' ')}
                >
                  {opt.short}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-end gap-2 px-3 pt-3">
        {showMonth && (
          <div className="flex-1 min-w-36">
            <Label className="text-[11px] uppercase tracking-wide text-muted-foreground">
              Bulan
            </Label>
            <Input
              type="month"
              name="month"
              className="h-9 mt-1"
              disabled={loading}
              value={local.month ?? ''}
              onChange={(e) => {
                const value = e.target.value;
                // Selalu pantulkan ketikan ke input; kirim query hanya saat
                // nilainya sudah lengkap (YYYY-MM), supaya input setengah jadi
                // tidak memicu request.
                setLocal((prev) => ({ ...prev, month: value }));
                if (MONTH_PATTERN.test(value)) applyNow('month', value);
              }}
            />
          </div>
        )}

        {showKelompok && (
          <div className="w-28">
            <Label className="text-[11px] uppercase tracking-wide text-muted-foreground">
              Kelompok
            </Label>
            <select
              name="kelompok"
              disabled={loading}
              value={local.kelompok ?? ''}
              onChange={(e) => applyNow('kelompok', e.target.value)}
              className="flex items-center justify-between w-full h-9 mt-1 px-3 py-2 text-sm bg-transparent border rounded-md shadow-xs border-input focus:outline-hidden focus:ring-1 focus:ring-ring disabled:opacity-60"
            >
              {KELOMPOK_OPTIONS.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>
        )}

        {children}
      </div>

      <div className="pb-3" />
    </div>
  );
};

export default FilterBar;
