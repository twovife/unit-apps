import { memo, useMemo } from 'react';
import TabelWilayah from './TabelWilayah';

/** Dipakai semua tanggal yang belum punya tambalan, supaya acuannya sama. */
export const TANPA_TAMBALAN = Object.freeze({});

const judulTanggal = (t) =>
  new Date(t + 'T00:00:00').toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' });

/**
 * Satu blok tanggal. Dibungkus memo supaya mengetik di satu tanggal tidak
 * merender ulang 24 tanggal lainnya: satu wilayah sebulan bisa 825 baris dan
 * 4.125 kotak isian.
 *
 * Syaratnya acuan prop harus tetap. Tanggal tanpa tambalan menerima
 * TANPA_TAMBALAN yang sama, dan semua callback-nya dibungkus useCallback di
 * induk, dengan tanggal dikirim sebagai argumen, bukan ditutup di closure.
 */
function BlokHari({ hari, tambalan, aktif, bulanCm, bulanMb, onUbah, onCek, onBuka, onLog }) {
  // Angka hasil autosave (mutasi yang diketik + kumulatif yang dihitung ulang
  // server) dituang ke baris tanggal INI saja.
  const baris = useMemo(() => {
    if (!Object.keys(tambalan).length) {
      return hari.baris;
    }

    return hari.baris.map((b) =>
      tambalan[b.branch_id] ? { ...b, diketik: { ...(b.diketik ?? {}), ...tambalan[b.branch_id] } } : b,
    );
  }, [hari.baris, tambalan]);

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

      <TabelWilayah
        tanggal={hari.tanggal}
        baris={baris}
        bolehUbah={hari.boleh_ubah}
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
