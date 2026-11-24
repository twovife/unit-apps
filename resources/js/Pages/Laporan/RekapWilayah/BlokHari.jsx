import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { gabung } from './kolom';
import TabelWilayah from './TabelWilayah';

/** Dipakai semua tanggal yang belum punya tambalan, supaya acuannya sama. */
export const TANPA_TAMBALAN = Object.freeze({});

const judulTanggal = (t) =>
  new Date(t + 'T00:00:00').toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' });

// Tinggi perkiraan tabel yang belum dipasang, supaya tinggi halaman dan posisi
// gulir tidak melompat saat blok dipasang. Baris 22px, kepala dua tingkat 40px.
const taksirTinggi = (jumlahBaris) => 40 + (jumlahBaris + 1) * 22;

/**
 * Satu blok tanggal.
 *
 * **Tabelnya baru dipasang saat bloknya mendekati layar.** Satu wilayah
 * sebulan itu 25 tanggal x 32 kantor = 800 baris, 16.800 sel, dan 4.000
 * <input> — kira-kira 39.000 simpul DOM. Chrome tersendat jauh di bawah itu:
 * mengetik tertunda dan gulir meninggalkan bidang kosong. Yang terpasang
 * sekarang cuma blok di sekitar layar, sekitar 100 baris.
 *
 * Pengamatnya milik blok ini sendiri dan state-nya lokal, jadi menggulir
 * hanya merender ulang blok yang masuk atau keluar — bukan halaman. (Pengamat
 * di tingkat halaman sudah dicoba dan dibuang: tiap layar bergeser, 25 blok
 * dibandingkan lagi.)
 *
 * Dibungkus memo supaya mengetik di satu tanggal tidak merender ulang tanggal
 * lain. Syaratnya acuan prop harus tetap: tanggal tanpa tambalan menerima
 * TANPA_TAMBALAN yang sama, dan semua callback dibungkus useCallback di induk,
 * dengan tanggal dikirim sebagai argumen, bukan ditutup di closure.
 */
function BlokHari({ hari, tambalan, aktif, pertama, bulanCm, bulanMb, onUbah, onCek, onBuka, onLog }) {
  // Balasan autosave / cek / buka (mutasi yang diketik, kumulatif yang
  // dihitung ulang server, dan status tanda tangan) dituang ke baris tanggal
  // INI saja.
  const baris = useMemo(() => {
    if (!Object.keys(tambalan).length) {
      return hari.baris;
    }

    return hari.baris.map((b) => gabung(b, tambalan[b.branch_id]));
  }, [hari.baris, tambalan]);

  const dicek = baris.filter((b) => b.terkunci).length;

  // Blok pertama dipasang langsung supaya halaman tidak berkedip saat dibuka.
  const [dekat, setDekat] = useState(!!pertama);
  const kotak = useRef(null);

  useEffect(() => {
    const el = kotak.current;
    if (!el) return undefined;

    // 800px: dipasang sebelum benar-benar terlihat, jadi gulir cepat pun tidak
    // sempat menampilkan tempat kosong.
    const pengamat = new IntersectionObserver(([e]) => setDekat(e.isIntersecting), {
      rootMargin: '800px 0px',
    });
    pengamat.observe(el);

    // Cetak butuh semuanya terpasang: blok yang belum dipasang akan tercetak
    // sebagai kotak kosong.
    const pasang = () => setDekat(true);
    window.addEventListener('beforeprint', pasang);

    return () => {
      pengamat.disconnect();
      window.removeEventListener('beforeprint', pasang);
    };
  }, []);

  return (
    <section
      id={`tgl-${hari.tanggal}`}
      className={`scroll-mt-36 space-y-1 ${pertama ? '' : 'print:break-before-page'}`}
    >
      <h2 className={`text-[13px] font-semibold ${aktif ? 'text-sky-700' : ''}`}>
        {judulTanggal(hari.tanggal)}
        <span className="ml-2 font-normal text-slate-400">
          {hari.hari_kerja_ke ? `hari kerja ke-${hari.hari_kerja_ke}` : 'bukan hari kerja'}
          {` · ${dicek}/${hari.baris.length} dicek`}
        </span>
      </h2>

      {hari.mendatang && (
        <p className="rounded border bg-slate-50 px-2 py-1 text-[11px] text-slate-500">
          Belum terjadi. Angkanya baru ada sesudah kasir melapor.
        </p>
      )}

      {!hari.mendatang && !hari.hari_kerja && (
        <p className="rounded border border-amber-300 bg-amber-50 px-2 py-1 text-[11px] text-amber-900">
          Bukan hari kerja, jadi tidak ada rekap yang diisi. Angka yang tampil murni dari sistem. Kalau tidak nol,
          berarti ada transaksi tercatat di hari libur dan itu perlu ditelusuri.
        </p>
      )}

      <div ref={kotak}>
        {dekat ? (
          <TabelWilayah
            tanggal={hari.tanggal}
            baris={baris}
            bolehUbah={hari.boleh_ubah}
            kosong={hari.mendatang}
            bulanCm={bulanCm}
            bulanMb={bulanMb}
            onUbah={onUbah}
            onCek={onCek}
            onBuka={onBuka}
            onLog={onLog}
          />
        ) : (
          <div
            className="rounded-lg border bg-white shadow-sm"
            style={{ height: taksirTinggi(baris.length) }}
          />
        )}
      </div>
    </section>
  );
}

export default memo(BlokHari);
