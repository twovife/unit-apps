import { memo, useMemo } from 'react';
import TabelWilayah from './TabelWilayah';

/** Dipakai semua tanggal yang tidak sedang diketik, supaya acuannya sama. */
export const TANPA_UBAHAN = Object.freeze({});

const judulTanggal = (t) =>
  new Date(t + 'T00:00:00').toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' });

/**
 * Satu blok tanggal. Dibungkus memo supaya mengetik di satu tanggal tidak
 * merender ulang 24 tanggal lainnya: satu wilayah sebulan bisa 825 baris dan
 * 4.125 kotak isian.
 *
 * Syaratnya acuan prop harus tetap. Tanggal yang tidak diketik menerima
 * TANPA_UBAHAN yang sama, dan semua callback-nya dibungkus useCallback di
 * induk, dengan tanggal dikirim sebagai argumen, bukan ditutup di closure.
 */
function BlokHari({ hari, ubahan, basi, aktif, bulanCm, bulanMb, onUbah, onCek, onBuka, onLog }) {
  // Angka yang diketik dituang ke baris tanggal INI saja.
  const baris = useMemo(() => {
    const kunci = Object.keys(ubahan);
    if (!kunci.length) {
      return hari.baris;
    }

    return hari.baris.map((b) => {
      const awalan = `${b.branch_id}|`;
      const milik = kunci.filter((k) => k.startsWith(awalan)).map((k) => [k.slice(awalan.length), ubahan[k]]);

      return milik.length ? { ...b, diketik: { ...(b.diketik ?? {}), ...Object.fromEntries(milik) } } : b;
    });
  }, [hari.baris, ubahan]);

  const belumSimpan = useMemo(
    () => new Set(Object.keys(ubahan).map((k) => Number(k.split('|')[0]))),
    [ubahan],
  );

  const dicek = hari.baris.filter((b) => b.terkunci).length;

  return (
    <section id={`tgl-${hari.tanggal}`} className="scroll-mt-28 space-y-1">
      <h2 className={`text-[13px] font-semibold ${aktif ? 'text-sky-700' : ''}`}>
        {judulTanggal(hari.tanggal)}
        <span className="ml-2 font-normal text-slate-400">
          {hari.hari_kerja_ke ? `hari kerja ke-${hari.hari_kerja_ke}` : 'bukan hari kerja'}
          {` · ${dicek}/${hari.baris.length} dicek`}
        </span>
      </h2>

      {!hari.hari_kerja && (
        <p className="rounded border border-amber-300 bg-amber-50 px-2 py-1 text-[11px] text-amber-900">
          Bukan hari kerja, jadi tidak ada rekap yang diisi. Angka yang tampil murni dari sistem. Kalau tidak nol,
          berarti ada transaksi tercatat di hari libur dan itu perlu ditelusuri.
        </p>
      )}

      {basi && (
        <p className="text-[11px] text-slate-400">
          Ada isian hari sebelumnya yang belum disimpan, jadi Jumlah dan Saldo di sini belum ikut berubah.
        </p>
      )}

      <TabelWilayah
        tanggal={hari.tanggal}
        baris={baris}
        bolehUbah={hari.boleh_ubah}
        belumSimpan={belumSimpan}
        basiSemua={basi}
        bulanCm={bulanCm}
        bulanMb={bulanMb}
        onUbah={onUbah}
        onCek={onCek}
        onBuka={onBuka}
        onLog={onLog}
      />
    </section>
  );
}

export default memo(BlokHari);
