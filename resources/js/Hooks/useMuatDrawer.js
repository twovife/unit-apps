import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { router } from '@inertiajs/react';

/**
 * Muat JSON untuk isi drawer, dengan siklus hidup yang bersih:
 * - permintaan lama dibatalkan (AbortController) saat target berganti,
 *   drawer ditutup, atau komponen dilepas - jawaban basi tidak menimpa isi;
 * - isi dikosongkan saat drawer ditutup, supaya data lama tidak ditahan
 *   di memori selama halaman terbuka;
 * - `muatUlangSesudahSimpan`: berlangganan router Inertia 'success' hanya
 *   selama drawer terbuka, dan berhenti berlangganan saat ditutup.
 *
 * `kunci` = string yang berubah kalau parameternya berubah.
 */
export default function useMuatDrawer(aktif, url, params, kunci, { muatUlangSesudahSimpan = false } = {}) {
  const [isi, setIsi] = useState(null);
  const [galat, setGalat] = useState(null);
  const pengendali = useRef(null);

  const muat = useCallback(() => {
    pengendali.current?.abort();
    if (!aktif) return;
    const c = new AbortController();
    pengendali.current = c;
    setGalat(null);
    axios
      .get(url, { params, signal: c.signal })
      .then(({ data }) => setIsi(data))
      .catch((e) => {
        if (!axios.isCancel(e)) setGalat('Data gagal dimuat.');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aktif, url, kunci]);

  useEffect(() => {
    setIsi(null);
    muat();
    return () => pengendali.current?.abort();
  }, [muat]);

  useEffect(() => {
    if (!aktif) setIsi(null);
  }, [aktif]);

  useEffect(
    () => (aktif && muatUlangSesudahSimpan ? router.on('success', muat) : undefined),
    [aktif, muatUlangSesudahSimpan, muat],
  );

  return { isi, galat };
}
