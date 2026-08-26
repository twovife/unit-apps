import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';

/**
 * Daftar hari libur untuk dipakai di sisi layar.
 *
 * Server tetap penjaga sebenarnya (App\Rules\HariKerja) — layar bisa dilewati.
 * Yang ini urusan lain: mencegah user sampai ke keadaan yang pasti ditolak.
 *
 * DUA PEMAKAIAN, DAN YANG KEDUA YANG PALING PENTING
 * -------------------------------------------------
 *   1. Mematikan tanggal libur di pemilih tanggal.
 *   2. MEMBETULKAN TANGGAL YANG DIHITUNG SENDIRI OLEH SISTEM. Beberapa layar
 *      tidak meminta user memilih tanggal — layar pelunasan menurunkannya dari
 *      hari tagih pinjaman, dan kolomnya dimatikan. Kalau hasil turunannya
 *      jatuh di hari libur, user melihat tanggal yang pasti ditolak server dan
 *      TIDAK PUNYA CARA MENGUBAHNYA. Buntu itu lahir justru karena gerbangnya
 *      dipasang; jadi yang menurunkan tanggal wajib ikut tahu kalender.
 *
 * Rentang yang sudah diambil diingat, jadi memakai hook ini di beberapa
 * komponen sekaligus tidak menghujani server.
 */

// Cache seumur halaman. Kalender jarang berubah, dan kalaupun berubah,
// muat ulang halaman sudah cukup — pemakainya menginput transaksi, bukan
// memantau kalender.
const simpanan = { libur: {}, rentang: new Set(), tahun: { min: 2015, maks: 2035 } };

export default function useHariLibur(sekitar) {
  const [libur, setLibur] = useState(simpanan.libur);
  const [tahun, setTahun] = useState(simpanan.tahun);
  const [siap, setSiap] = useState(simpanan.rentang.size > 0);
  const dibatalkan = useRef(false);

  useEffect(() => {
    dibatalkan.current = false;
    return () => {
      dibatalkan.current = true;
    };
  }, []);

  useEffect(() => {
    const acuan = sekitar ? dayjs(sekitar) : dayjs();
    if (!acuan.isValid()) return;

    const dari = acuan.subtract(2, 'month').startOf('month');
    const sampai = acuan.add(2, 'month').endOf('month');
    const kunci = `${dari.format('YYYY-MM')}..${sampai.format('YYYY-MM')}`;

    if (simpanan.rentang.has(kunci)) {
      setSiap(true);
      return;
    }

    simpanan.rentang.add(kunci);

    axios
      .get(route('kalender.libur'), {
        params: {
          dari: dari.format('YYYY-MM-DD'),
          sampai: sampai.format('YYYY-MM-DD'),
        },
      })
      .then(({ data }) => {
        simpanan.libur = { ...simpanan.libur, ...(data.libur ?? {}) };
        simpanan.tahun = {
          min: data.tahun_min ?? 2015,
          maks: data.tahun_maks ?? 2035,
        };
        if (dibatalkan.current) return;
        setLibur(simpanan.libur);
        setTahun(simpanan.tahun);
        setSiap(true);
      })
      .catch(() => {
        // Gagal mengambil kalender bukan alasan memblokir input. Hari Minggu
        // dan rentang tahun tetap dijaga di sisi layar, dan server tetap
        // menolak tanggal libur — user cuma kehilangan petunjuk visualnya.
        simpanan.rentang.delete(kunci);
        if (!dibatalkan.current) setSiap(true);
      });
  }, [sekitar ? dayjs(sekitar).format('YYYY-MM') : null]);

  const alasanLibur = useCallback(
    (tgl) => (tgl ? (libur[dayjs(tgl).format('YYYY-MM-DD')] ?? null) : null),
    [libur],
  );

  const hariKerja = useCallback(
    (tgl) => {
      const d = dayjs(tgl);
      if (!d.isValid()) return false;
      if (d.year() < tahun.min || d.year() > tahun.maks) return false;
      if (d.day() === 0) return false; // Minggu = bawaan kalau belum ditetapkan
      return !alasanLibur(tgl);
    },
    [alasanLibur, tahun],
  );

  /**
   * Mundur seminggu-seminggu sampai ketemu hari tagih yang benar-benar bekerja.
   *
   * Melompat lebih dari satu minggu kalau perlu, dan menyerah setelah 8 minggu
   * — mengembalikan tanggal asalnya, biarkan server yang menolak dengan pesan
   * yang jelas daripada layar mengarang tanggal yang jauh dan membingungkan.
   */
  const mundurKeHariKerja = useCallback(
    (tgl) => {
      if (!tgl) return tgl;

      // Hari Minggu tidak punya jawaban: mundur seminggu dari Minggu selalu
      // Minggu lagi. Dikembalikan apa adanya supaya server yang menolak dengan
      // pesan yang menjelaskan — lebih baik daripada layar diam-diam menggeser
      // ke hari tagih yang berbeda. Dalam pemakaian nyata tidak akan kena:
      // yang dioper ke sini selalu hari tagih pinjaman, dan tidak ada kelompok
      // yang menagih hari Minggu.
      if (dayjs(tgl).day() === 0) return dayjs(tgl).format('YYYY-MM-DD');

      let calon = dayjs(tgl);
      for (let i = 0; i < 8; i++) {
        if (hariKerja(calon)) return calon.format('YYYY-MM-DD');
        calon = calon.subtract(1, 'week');
      }
      return dayjs(tgl).format('YYYY-MM-DD');
    },
    [hariKerja],
  );

  return { libur, tahun, siap, alasanLibur, hariKerja, mundurKeHariKerja };
}
