import { createContext, useContext } from 'react';
import { usePage } from '@inertiajs/react';

// Komponen buku angsuran membaca filter (tanggal, is_locked, month,
// closed_transaction) dari props halaman. Saat dipakai di luar halamannya
// sendiri (drawer storting di ACC KM), filternya datang dari JSON dan
// disuntikkan lewat konteks ini.
export const FilterAngsuranContext = createContext(null);

export const useFilterAngsuran = () => {
  const dariKonteks = useContext(FilterAngsuranContext);
  const { server_filter } = usePage().props;
  return dariKonteks ?? server_filter ?? {};
};
