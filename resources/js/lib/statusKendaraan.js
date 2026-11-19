import dayjs from 'dayjs';
// Status kendaraan dua tingkat (mas 2026-11-18): status aktif / nonaktif + kondisi.
export const KONDISI = {
  aktif: [['baik', 'Baik'], ['rusak', 'Rusak']],
  nonaktif: [['dijual', 'Dijual'], ['hilang', 'Hilang'], ['dihapus', 'Dihapus']],
};
const NAMA = Object.fromEntries([...KONDISI.aktif, ...KONDISI.nonaktif]);

/** "Aktif · Baik", "Nonaktif · Dijual", "Nonaktif · belum dipilih". */
export const labelStatus = (a) =>
  `${a?.status === 'aktif' ? 'Aktif' : 'Nonaktif'} · ${NAMA[a?.kondisi] ?? (a?.status === 'aktif' ? 'Baik' : 'belum dipilih')}`;

/** Kelas badge: hijau aktif baik, kuning aktif rusak, merah nonaktif. */
export const warnaStatus = (a) =>
  a?.status === 'aktif'
    ? a?.kondisi === 'rusak'
      ? 'border-amber-200 bg-amber-50 text-amber-800'
      : 'border-emerald-200 bg-emerald-50 text-emerald-700'
    : 'border-rose-200 bg-rose-50 text-rose-700';

/** Jarak hari ini ke tanggal sebagai "3 bulan 12 hari" (arah diabaikan; pemanggil menulis lewat / lagi). */
export const durasi = (tanggal) => {
  const a = dayjs().startOf('day');
  const b = dayjs(String(tanggal).slice(0, 10));
  const [dari, ke] = b.isBefore(a) ? [b, a] : [a, b];
  const bulan = ke.diff(dari, 'month');
  const hari = ke.diff(dari.add(bulan, 'month'), 'day');
  return [bulan ? `${bulan} bulan` : '', hari || !bulan ? `${hari} hari` : ''].filter(Boolean).join(' ');
};
