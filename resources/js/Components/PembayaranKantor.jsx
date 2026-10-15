import { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { Link } from '@inertiajs/react';
import { Banknote, Building2, HandCoins, Landmark, PiggyBank, Plane, Wallet } from 'lucide-react';

/**
 * Ringkasan pembayaran kantor aktif per bulan (halaman Dashboard Kasir). Data dari
 * dashboard.pembayaran (PembayaranKantorController); baca-saja - input di
 * menu masing-masing. Kartu yang menunya ada di route bisa diklik.
 */
const rp = (n) => 'Rp ' + new Intl.NumberFormat('id-ID').format(Number(n) || 0);
const tgl = (d) => (d ? dayjs(d).format('DD MMM YYYY') : '–');

const STATUS = {
  lunas: ['Lunas', 'bg-emerald-100 text-emerald-800'],
  kurang: ['Kurang', 'bg-amber-100 text-amber-800'],
  belum: ['Belum bayar', 'bg-rose-100 text-rose-800'],
  tenggang: ['Masa tenggang', 'bg-slate-100 text-slate-600'],
};

// Link hanya kalau route-nya terdaftar (menu closed beta bisa belum ada).
const linkKe = (nama) => {
  try {
    return route().has(nama) ? route(nama) : null;
  } catch {
    return null;
  }
};

const Kartu = ({ judul, ikon: Ikon, warna, href, children }) => {
  const isi = (
    <div className={`h-full p-4 bg-white border rounded-xl shadow-sm ${href ? 'hover:border-sky-300 hover:shadow transition' : ''}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className={`flex items-center justify-center w-9 h-9 rounded-lg ${warna}`}>
          <Ikon className="w-5 h-5" />
        </span>
        <h3 className="font-semibold text-slate-900">{judul}</h3>
      </div>
      <div className="space-y-1 text-sm">{children}</div>
    </div>
  );
  return href ? (
    <Link href={href} className="block h-full">
      {isi}
    </Link>
  ) : (
    isi
  );
};

const Baris = ({ label, nilai, tebal = false }) => (
  <div className="flex justify-between gap-3">
    <span className="text-slate-500">{label}</span>
    <span className={`tabular-nums text-right ${tebal ? 'font-semibold text-slate-900' : 'text-slate-700'}`}>{nilai}</span>
  </div>
);

const Iuran = ({ d }) => {
  const [label, kelas] = STATUS[d.status] ?? STATUS.belum;
  const persen = Math.min(100, Math.round(((d.dibayar || 0) / (d.target || 1)) * 100));
  return (
    <>
      <div className="flex items-center justify-between mb-1">
        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${kelas}`}>{label}</span>
        <span className="text-xs text-slate-500">target {rp(d.target)}</span>
      </div>
      <div className="h-2 mb-2 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full ${d.status === 'lunas' ? 'bg-emerald-500' : 'bg-amber-400'}`} style={{ width: `${persen}%` }} />
      </div>
      <Baris label="Dibayar bulan ini" nilai={rp(d.dibayar)} tebal />
      {d.kurang > 0 && d.status !== 'tenggang' && <Baris label="Kurang" nilai={rp(d.kurang)} />}
      <Baris label="Bayar terakhir" nilai={tgl(d.terakhir)} />
      <Baris label="Akumulasi" nilai={rp(d.akumulasi)} />
    </>
  );
};

export default function PembayaranKantor() {
  const [bulan, setBulan] = useState(dayjs().format('YYYY-MM'));
  const [data, setData] = useState(null);
  const [galat, setGalat] = useState(null);

  useEffect(() => {
    setGalat(null);
    const c = new AbortController();
    axios
      .get(route('dashboard.pembayaran'), { params: { bulan }, signal: c.signal })
      .then(({ data }) => setData(data))
      .catch((e) => !axios.isCancel(e) && setGalat('Ringkasan pembayaran gagal dimuat.'));
    return () => c.abort();
  }, [bulan]);

  const k = data?.kartu;

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
            <Building2 className="w-5 h-5 text-slate-500" />
            Pembayaran Kantor {data?.unit ? `— ${data.unit}` : ''}
          </h2>
          <p className="text-sm text-slate-500">Ringkasan per bulan untuk kantor aktif. Input lewat menu masing-masing.</p>
        </div>
        <input
          type="month"
          value={bulan}
          max={dayjs().format('YYYY-MM')}
          onChange={(e) => e.target.value && setBulan(e.target.value)}
          className="h-9 px-3 text-sm border rounded-md border-input bg-background"
          aria-label="Bulan"
        />
      </div>

      {galat && <div className="p-3 text-sm border rounded-lg border-rose-200 bg-rose-50 text-rose-700">{galat}</div>}
      {!k && !galat && <div className="text-sm text-slate-500">Memuat…</div>}

      {k && (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <Kartu judul="Tabungan 1 Juta" ikon={PiggyBank} warna="bg-pink-100 text-pink-700" href={linkKe('tabungan.contributions')}>
            <Iuran d={k.tabungan} />
          </Kartu>
          <Kartu judul="BOP Pusat" ikon={HandCoins} warna="bg-sky-100 text-sky-700" href={linkKe('bop.contributions')}>
            <Iuran d={k.bop} />
          </Kartu>
          <Kartu judul="BON Panjer" ikon={Banknote} warna="bg-amber-100 text-amber-700">
            <Baris label="Sisa bon" nilai={rp(k.bon_panjer.sisa)} tebal />
            <Baris label="Bon aktif" nilai={`${k.bon_panjer.jumlah_aktif} bon · ${k.bon_panjer.karyawan} karyawan`} />
            <Baris label="Bon baru bulan ini" nilai={rp(k.bon_panjer.pinjaman_baru)} />
            <Baris label="Dibayar bulan ini" nilai={rp(k.bon_panjer.bayar_bulan_ini)} />
          </Kartu>
          <Kartu judul="Pinjaman Modal" ikon={Landmark} warna="bg-violet-100 text-violet-700">
            <Baris label="Sisa pokok" nilai={rp(k.modal.sisa)} tebal />
            <Baris label="Pinjaman aktif" nilai={`${k.modal.jumlah_aktif} pinjaman`} />
            <Baris label="Pokok dibayar bulan ini" nilai={rp(k.modal.pokok_bulan_ini)} />
            <Baris label="Jasa modal bulan ini" nilai={rp(k.modal.jasa_bulan_ini)} />
          </Kartu>
          <Kartu judul="SKSW" ikon={Wallet} warna="bg-emerald-100 text-emerald-700" href={linkKe('sksw.unit')}>
            <Baris label="Saldo SW" nilai={rp(k.sksw.saldo_sw)} tebal />
            <Baris label="Saldo SK" nilai={rp(k.sksw.saldo_sk)} tebal />
            <Baris label="Masuk bulan ini" nilai={rp(k.sksw.masuk)} />
            <Baris label="Keluar bulan ini" nilai={rp(k.sksw.keluar)} />
          </Kartu>
          <Kartu judul="Tabungan Goro Umrah" ikon={Plane} warna="bg-teal-100 text-teal-700">
            <Baris label="Setoran bulan ini" nilai={rp(k.umrah.setoran_bulan_ini)} tebal />
            <Baris label="Jumlah setor" nilai={`${k.umrah.kali_bulan_ini} kali`} />
            <Baris label="Setor terakhir" nilai={tgl(k.umrah.terakhir)} />
            <Baris label="Total tabungan" nilai={rp(k.umrah.total)} />
          </Kartu>
        </div>
      )}
    </section>
  );
}
