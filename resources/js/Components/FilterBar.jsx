import React, { useEffect, useMemo, useRef, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { Input } from '@/shadcn/ui/input';
import { Label } from '@/shadcn/ui/label';
import Loading from '@/Components/Loading';
import TanggalKerja from '@/Components/shadcn/TanggalKerja';

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
 *     bergeser mengikuti hari ini. (Dimatikan oleh `todayFirst`.)
 *
 * Satu-satunya navigasi tanpa tap adalah pemulihan pilihan tersimpan pada
 * poin 3, dan itu hanya terjadi bila URL sama sekali tidak membawa parameter
 * filter. Matikan lewat prop `restoreOnMount={false}` bila tidak diinginkan.
 *
 * MODE `todayFirst` (postur "buku hari ini"): banner buku aktif di atas; chip
 * hari + bulan + kelompok dilipat di balik "Hari lain". Default terbuka = buku
 * hari ini (restore dimatikan). Kalau sedang meninjau hari lain, banner berubah
 * jadi peringatan + tombol "Hari Ini" untuk balik.
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

const NAMA_HARI_PANJANG = {
  senin: 'Senin', selasa: 'Selasa', rabu: 'Rabu',
  kamis: 'Kamis', jumat: 'Jumat', sabtu: 'Sabtu',
};
const NAMA_BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

const FilterBar = ({
  urlLink,
  storageKey,
  showHari = true,
  showMonth = true,
  showTanggal = false,
  showKelompok = false,
  restoreOnMount = true,
  // todayFirst: postur "buku hari ini". Banner buku aktif di atas, chip hari/
  // bulan/kelompok dilipat di balik "Hari lain". Default buka = buku hari ini
  // (restore localStorage dimatikan supaya server default = hari ini yang tampil).
  todayFirst = false,
  extraParams = {},
  children,
}) => {
  const { server_filter } = usePage().props;

  // Nilai filter yang SEDANG dipakai server untuk menghasilkan data di layar.
  const active = useMemo(
    () => ({
      hari: server_filter?.hari ?? '',
      month: server_filter?.month ?? '',
      date: server_filter?.tanggal ?? '',
      kelompok: server_filter?.kelompok ?? '',
    }),
    [
      server_filter?.hari,
      server_filter?.month,
      server_filter?.tanggal,
      server_filter?.kelompok,
    ],
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
    if (showTanggal) keys.push('date');
    if (showKelompok) keys.push('kelompok');
    return keys;
  }, [showHari, showMonth, showTanggal, showKelompok]);

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

  // "Hari ini" = weekday sekarang (Senin-Sabtu; Minggu tak ada buku -> null) +
  // bulan berjalan. Dihitung dari jam lokal, BUKAN dari server. Tidak pernah
  // auto-jalan; hanya saat tombol "Hari Ini" ditekan -> tetap patuh kontrak.
  const _now = new Date();
  const monthNow = `${_now.getFullYear()}-${String(_now.getMonth() + 1).padStart(2, '0')}`;
  const _jsDay = _now.getDay(); // 0=Minggu, 1=Senin, ... 6=Sabtu
  const todayHari =
    _jsDay >= 1 && _jsDay <= 6 ? HARI_OPTIONS[_jsDay - 1].value : null;

  // Loncat ke buku hari ini: set hari + (kalau dikelola) bulan, satu navigasi.
  const applyHariIni = () => {
    if (!todayHari) return;
    const berubah =
      String(active.hari ?? '') !== String(todayHari) ||
      (showMonth && String(active.month ?? '') !== String(monthNow));
    if (!berubah) return;
    const next = { ...local, hari: todayHari };
    if (showMonth) next.month = monthNow;
    setLocal(next);
    writeSaved(buildParams(next));
    go(next);
  };

  // Buku aktif = hari ini? (dipakai mode todayFirst untuk pilih banner).
  const isToday =
    String(local.hari ?? '') === String(todayHari ?? '') &&
    (!showMonth || String(local.month ?? '') === String(monthNow));

  const [openHariLain, setOpenHariLain] = useState(false);
  const autoOpenRef = useRef(false);
  // Kalau mendarat langsung di hari lain (mis. dari link berparameter), buka
  // picker sekali supaya user lihat sedang di mana - tanpa memicu navigasi.
  useEffect(() => {
    if (todayFirst && !autoOpenRef.current && !isToday) {
      autoOpenRef.current = true;
      setOpenHariLain(true);
    }
  }, [todayFirst, isToday]);

  const labelBulan = (m) => {
    const [y, mm] = String(m ?? '').split('-');
    return mm ? `${NAMA_BULAN[parseInt(mm, 10) - 1]} ${y}` : m || '-';
  };
  const hariAktifLabel = local.hari
    ? NAMA_HARI_PANJANG[local.hari] ?? local.hari
    : '-';
  const todayFull = todayHari
    ? `${NAMA_HARI_PANJANG[todayHari]}, ${_now.getDate()} ${NAMA_BULAN[_now.getMonth()]} ${_now.getFullYear()}`
    : null;

  // Pemulihan pilihan tersimpan - sekali saja, dan hanya bila URL benar-benar
  // tidak membawa parameter filter (artinya kita masuk dari menu, bukan dari
  // hasil pilihan sebelumnya atau dari link yang sudah membawa filter).
  useEffect(() => {
    // todayFirst sengaja TIDAK memulihkan pilihan tersimpan: default-nya buku
    // hari ini (server default), bukan buku terakhir yang dilihat.
    if (!restoreOnMount || todayFirst || restoredRef.current || !lsKey) return;
    restoredRef.current = true;

    const search = new URLSearchParams(window.location.search);
    if (managedKeys.some((key) => search.has(key))) return;

    const saved = readSaved();
    if (!saved) return;

    // Kelompok, hari, bulan & tanggal semuanya global (session server, sama
    // di semua menu, reset saat login ulang) - tidak ada lagi yang dipulihkan
    // per halaman dari localStorage.
    const pulih = { ...saved, kelompok: active.kelompok, hari: active.hari, month: active.month, date: active.date };
    const berbeda = managedKeys.some(
      (key) => String(pulih[key] ?? '') !== String(active[key] ?? ''),
    );
    if (!berbeda) return;

    go(pulih, { replace: true });
  }, []);

  // Selaraskan cermin lokal setiap kali server mengirim filter aktif yang baru.
  // Murni menyalin nilai ke state - tidak memicu navigasi apa pun.
  useEffect(() => {
    setLocal(active);
  }, [active]);

  // Chip hari (dipakai di kedua postur). Chip hari ini bertanda dot + ring.
  const chipsHari = showHari ? (
    <div className="grid grid-cols-6 gap-1 mt-1">
      {HARI_OPTIONS.map((opt) => {
        const dipilih = local.hari === opt.value;
        const iniHariIni = opt.value === todayHari;
        return (
          <button
            key={opt.value}
            type="button"
            disabled={loading}
            onClick={() => applyNow('hari', opt.value)}
            aria-pressed={dipilih}
            title={iniHariIni ? 'Hari ini' : undefined}
            className={[
              'relative rounded-md border py-2 text-xs font-medium transition-colors',
              'disabled:opacity-60',
              dipilih
                ? 'border-primary bg-primary text-primary-foreground'
                : iniHariIni
                  ? 'border-primary/60 ring-1 ring-primary/40 bg-background text-foreground hover:bg-accent'
                  : 'border-input bg-background text-foreground hover:bg-accent',
            ].join(' ')}
          >
            {opt.short}
            {iniHariIni && !dipilih && (
              <span
                className="absolute rounded-full top-0.5 right-0.5 h-1.5 w-1.5 bg-primary"
                aria-hidden="true"
              />
            )}
          </button>
        );
      })}
    </div>
  ) : null;

  const fieldBulan = showMonth ? (
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
          // Selalu pantulkan ketikan ke input; kirim query hanya saat nilainya
          // sudah lengkap (YYYY-MM), supaya input setengah jadi tak memicu request.
          setLocal((prev) => ({ ...prev, month: value }));
          if (MONTH_PATTERN.test(value)) applyNow('month', value);
        }}
      />
    </div>
  ) : null;

  const fieldKelompok = showKelompok ? (
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
  ) : null;

  return (
    <div className="mb-3 border rounded-lg bg-card">
      <Loading show={loading} />

      {todayFirst ? (
        <div className="p-3 space-y-3">
          {isToday ? (
            <div className="flex items-center gap-3 px-3 py-2.5 border rounded-lg border-primary/25 bg-primary/5">
              <span className="rounded-full h-2.5 w-2.5 bg-primary" aria-hidden="true" />
              <div>
                <div className="text-[10.5px] font-bold uppercase tracking-wider text-primary">
                  Hari ini · buku aktif
                </div>
                <div className="text-sm font-semibold">{todayFull}</div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2 px-3 py-2 border rounded-lg text-amber-700 border-amber-300 bg-amber-50 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-300">
              <span className="text-xs font-medium">
                &#8635; Meninjau: {hariAktifLabel}
                {showMonth ? ` · ${labelBulan(local.month)}` : ''}
              </span>
              {todayHari && (
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    setOpenHariLain(false);
                    applyHariIni();
                  }}
                  className="text-xs font-semibold underline disabled:opacity-60"
                >
                  Hari Ini
                </button>
              )}
            </div>
          )}

          {(showHari || showMonth || showKelompok) && (
            <div>
              <button
                type="button"
                disabled={loading}
                onClick={() => setOpenHariLain((o) => !o)}
                aria-expanded={openHariLain}
                className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold border border-dashed rounded-lg border-input bg-muted/40 text-muted-foreground hover:text-foreground disabled:opacity-60"
              >
                <span>Hari lain &amp; bulan</span>
                <span
                  className={`transition-transform ${openHariLain ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                >
                  &#9662;
                </span>
              </button>
              {openHariLain && (
                <div className="mt-2">
                  {showHari && (
                    <Label className="text-[11px] uppercase tracking-wide text-muted-foreground">
                      Hari
                    </Label>
                  )}
                  {chipsHari}
                  {(showMonth || showKelompok || children) && (
                    <div className="flex flex-wrap items-end gap-2 mt-3">
                      {fieldBulan}
                      {fieldKelompok}
                      {children}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <>
          {showHari && (
            <div className="px-3 pt-3">
              <div className="flex items-center justify-between">
                <Label className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  Hari
                </Label>
                {todayHari && (
                  <button
                    type="button"
                    disabled={loading}
                    onClick={applyHariIni}
                    className="text-[11px] font-medium text-primary hover:underline disabled:opacity-60"
                  >
                    Hari Ini
                  </button>
                )}
              </div>
              {chipsHari}
            </div>
          )}

          {/* Mode tanggal: tanggal + kelompok sejajar dalam satu baris. */}
          {showTanggal && (
            <div className="grid grid-cols-[1fr_auto] items-end gap-2 px-3 pt-3">
              <div className="min-w-0">
                <Label className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  Tanggal
                </Label>
                <div className="mt-1">
                  <TanggalKerja
                    name="date"
                    value={local.date || ''}
                    disabled={loading}
                    // Hari ini waktu lokal (locale 'sv' = YYYY-MM-DD). toISOString = UTC,
                    // sebelum 07.00 WIB hasilnya kemarin.
                    max={new Date().toLocaleDateString('sv')}
                    placeholder="Pilih tanggal tarikan"
                    onChange={(e) => applyNow('date', e.target.value)}
                  />
                </div>
              </div>
              {fieldKelompok}
            </div>
          )}

          {(fieldBulan || (!showTanggal && fieldKelompok) || children) && (
            <div className="flex flex-wrap items-end gap-2 px-3 pt-3">
              {fieldBulan}
              {!showTanggal && fieldKelompok}
              {children}
            </div>
          )}

          <div className="pb-3" />
        </>
      )}
    </div>
  );
};

export default FilterBar;
