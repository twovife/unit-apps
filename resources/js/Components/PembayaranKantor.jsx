import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { Link, router } from '@inertiajs/react';
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Landmark,
  PiggyBank,
  Plane,
  Plus,
  Receipt,
  Wallet,
  XCircle,
} from 'lucide-react';
import { Button } from '@/shadcn/ui/button';
import { Input } from '@/shadcn/ui/input';
import { Label } from '@/shadcn/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';

/**
 * Dashboard Kasir: tugas kasir hari ini + kartu pembayaran kantor aktif per
 * bulan, dengan input iuran Tabungan/BOP (gabungan) dan setoran Goro Umrah.
 * Data & aturan di PembayaranKantorController (salinan aturan app_laravel).
 */
const rp = (n) => 'Rp ' + new Intl.NumberFormat('id-ID').format(Number(n) || 0);
const tgl = (d) => (d ? dayjs(d).format('DD MMM YYYY') : '–');

// Link hanya kalau route-nya terdaftar (menu closed beta bisa belum ada).
const linkKe = (nama) => {
  try {
    return route().has(nama) ? route(nama) : null;
  } catch {
    return null;
  }
};

// Foto HP besar: kecilkan di browser (sisi terpanjang 1600px, JPEG 0.75, EXIF
// terbuang) seperti app_laravel Unggahan. PDF dikirim apa adanya.
const kecilkan = (file) =>
  !file || file.type === 'application/pdf'
    ? Promise.resolve(file)
    : new Promise((resolve) => {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
          const skala = Math.min(1, 1600 / Math.max(img.width, img.height));
          const c = document.createElement('canvas');
          c.width = Math.round(img.width * skala);
          c.height = Math.round(img.height * skala);
          const ctx = c.getContext('2d');
          ctx.fillStyle = '#fff';
          ctx.fillRect(0, 0, c.width, c.height);
          ctx.drawImage(img, 0, 0, c.width, c.height);
          URL.revokeObjectURL(url);
          c.toBlob((b) => resolve(b ? new File([b], 'bukti.jpg', { type: 'image/jpeg' }) : file), 'image/jpeg', 0.75);
        };
        img.onerror = () => {
          URL.revokeObjectURL(url);
          resolve(file);
        };
        img.src = url;
      });

/** Tanda besar di pojok kartu. */
const Tanda = ({ jenis, teks }) => {
  const gaya = {
    sudah: ['bg-emerald-100 text-emerald-800', CheckCircle2],
    kurang: ['bg-amber-100 text-amber-800', AlertTriangle],
    belum: ['bg-rose-100 text-rose-800', XCircle],
    netral: ['bg-slate-100 text-slate-600', null],
  }[jenis];
  const Ikon = gaya[1];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${gaya[0]}`}>
      {Ikon && <Ikon className="w-3.5 h-3.5" />}
      {teks}
    </span>
  );
};

/** Tombol kecil "Detail" ke menu asal kartu; tidak tampil kalau menunya belum ada. */
const TombolDetail = ({ href }) =>
  href ? (
    <Link
      href={href}
      className="px-2 py-0.5 text-[11px] font-semibold rounded-md shrink-0 text-sky-700 ring-1 ring-sky-300 hover:bg-sky-50"
    >
      Detail
    </Link>
  ) : null;

const Kartu = ({ judul, ikon: Ikon, warna, href, tanda, aksi, children }) => (
  <div className="flex flex-col h-full p-4 bg-white border shadow-sm rounded-xl">
    <div className="flex items-start justify-between gap-2 mb-3">
      <div className="flex items-center min-w-0 gap-2">
        <span className={`flex items-center justify-center w-9 h-9 rounded-lg shrink-0 ${warna}`}>
          <Ikon className="w-5 h-5" />
        </span>
        <h3 className="font-semibold truncate text-slate-900">{judul}</h3>
        <TombolDetail href={href} />
      </div>
      {tanda}
    </div>
    <div className="flex-1 space-y-1 text-sm">{children}</div>
    {aksi && <div className="pt-3 mt-3 border-t">{aksi}</div>}
  </div>
);

const Baris = ({ label, nilai, tebal = false }) => (
  <div className="flex justify-between gap-3">
    <span className="text-slate-500">{label}</span>
    <span className={`tabular-nums text-right ${tebal ? 'font-semibold text-slate-900' : 'text-slate-700'}`}>{nilai}</span>
  </div>
);

const Riwayat = ({ isi = [] }) =>
  isi.length > 0 && (
    <div className="pt-2 mt-2 space-y-0.5 border-t border-dashed">
      {isi.map((r) => (
        <div key={r.id} className="flex items-center justify-between text-xs text-slate-600">
          <span>{tgl(r.tanggal)}</span>
          <span className="flex items-center gap-2 tabular-nums">
            {rp(r.nominal)}
            {r.bukti && (
              <a href={r.bukti} target="_blank" rel="noreferrer" className="inline-flex items-center gap-0.5 text-sky-700 hover:underline">
                <Receipt className="w-3 h-3" /> bukti
              </a>
            )}
          </span>
        </div>
      ))}
    </div>
  );

const tandaIuran = (d) =>
  d.status === 'lunas' ? (
    <Tanda jenis="sudah" teks={`Sudah bayar ${d.terakhir ? dayjs(d.terakhir).format('DD MMM') : ''}`} />
  ) : d.status === 'kurang' ? (
    <Tanda jenis="kurang" teks={`Kurang ${rp(d.kurang)}`} />
  ) : d.status === 'tenggang' ? (
    <Tanda jenis="netral" teks="Masa tenggang" />
  ) : (
    <Tanda jenis="belum" teks="Belum bayar" />
  );

const IsiIuran = ({ d }) => {
  const persen = Math.min(100, Math.round(((d.dibayar || 0) / (d.target || 1)) * 100));
  return (
    <>
      <div className="h-2 mb-2 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full ${d.status === 'lunas' ? 'bg-emerald-500' : 'bg-amber-400'}`} style={{ width: `${persen}%` }} />
      </div>
      <Baris label="Dibayar bulan ini" nilai={`${rp(d.dibayar)} / ${rp(d.target)}`} tebal />
      <Baris label="Akumulasi" nilai={rp(d.akumulasi)} />
      {d.terkunci && <div className="text-xs font-medium text-slate-500">🔒 Bulan ini sudah dikunci pusat.</div>}
      <Riwayat isi={d.riwayat} />
    </>
  );
};

/** Tugas kasir hari ini: kunci/TTD, ACC KM, iuran. */
const Tugas = ({ t }) => {
  const item = [
    {
      ok: t.kelompok > 0 && t.acc_km >= t.kelompok,
      teks: `ACC KM hari ini: ${t.acc_km}/${t.kelompok} kelompok`,
      href: linkKe('transaction.index_buku_transaksi'),
    },
    {
      ok: t.kelompok > 0 && t.kunci >= t.kelompok,
      teks: `${t.migrasi ? 'Kunci' : 'TTD'} kasir hari ini (Rekap 1): ${t.kunci}/${t.kelompok} kelompok`,
      href: linkKe('kasir.rekap.rekap_satu'),
    },
    { ok: t.iuran_tb >= t.target_tb, teks: `Iuran Tabungan 1 Juta bulan ini: ${rp(t.iuran_tb)} / ${rp(t.target_tb)}` },
    { ok: t.iuran_bop >= t.target_bop, teks: `Iuran BOP bulan ini: ${rp(t.iuran_bop)} / ${rp(t.target_bop)}` },
  ];
  return (
    <section className="p-4 bg-white border shadow-sm rounded-xl">
      <h3 className="flex items-center gap-2 mb-2 font-semibold text-slate-900">
        <ClipboardCheck className="w-5 h-5 text-slate-500" />
        Tugas kasir hari ini — {dayjs(t.tanggal).format('dddd, DD MMMM YYYY')}
      </h3>
      {!t.hari_kerja && <p className="mb-2 text-sm text-slate-500">Hari ini libur — tidak ada kunci harian.</p>}
      <ul className="grid gap-1.5 text-sm sm:grid-cols-2">
        {item.map((x, i) => (
          <li key={i} className="flex items-center gap-2">
            {x.ok ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-500 shrink-0" />}
            {x.href ? (
              <Link href={x.href} className={`hover:underline ${x.ok ? 'text-slate-600' : 'text-slate-900 font-medium'}`}>
                {x.teks}
              </Link>
            ) : (
              <span className={x.ok ? 'text-slate-600' : 'text-slate-900 font-medium'}>{x.teks}</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
};

/** Isian bukti transfer (wajib), dengan pratinjau nama file. */
const IsiBukti = ({ file, setFile, galat }) => {
  const ref = useRef(null);
  return (
    <div className="grid gap-1">
      <Label>Foto bukti transfer (wajib)</Label>
      <input ref={ref} type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      <Button type="button" variant="outline" className="justify-start gap-2" onClick={() => ref.current?.click()}>
        <Receipt className="w-4 h-4" />
        {file ? file.name : 'Pilih foto / PDF bukti'}
      </Button>
      {galat && <span className="text-xs text-red-600">{galat}</span>}
    </div>
  );
};

/** Bayar Tabungan 1 Juta + BOP sekaligus (satu bukti), = app_laravel IuranGabungan. */
const DialogIuran = ({ buka, onClosed, data, bulan }) => {
  const k = data?.kartu;
  const [isi, setIsi] = useState({});
  const [file, setFile] = useState(null);
  const [galat, setGalat] = useState({});
  const [proses, setProses] = useState(false);

  useEffect(() => {
    if (!buka || !k) return;
    const tbBoleh = !k.tabungan.tenggang && !k.tabungan.terkunci && k.tabungan.kurang > 0;
    const bopBoleh = !k.bop.tenggang && !k.bop.terkunci && k.bop.kurang > 0;
    setIsi({
      tb: tbBoleh,
      tb_amount: k.tabungan.kurang || '',
      bop: bopBoleh,
      bop_amount: k.bop.kurang || '',
      payment_date: dayjs().format('YYYY-MM-DD'),
      rekening_id: data.rekening?.[0]?.id ?? '',
      notes: '',
    });
    setFile(null);
    setGalat({});
  }, [buka]);

  const simpan = async () => {
    setProses(true);
    const bukti = await kecilkan(file);
    router.post(
      route('dashboard.kasir.iuran'),
      { ...isi, tb: isi.tb ? 1 : 0, bop: isi.bop ? 1 : 0, period: bulan, bukti },
      {
        forceFormData: true,
        preserveScroll: true,
        preserveState: true,
        onError: setGalat,
        onSuccess: onClosed,
        onFinish: () => setProses(false),
      },
    );
  };
  const ubah = (k2, v) => setIsi((x) => ({ ...x, [k2]: v }));

  return (
    <Dialog open={buka} onOpenChange={(o) => !o && !proses && onClosed()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Bayar iuran — {dayjs(bulan + '-01').format('MMMM YYYY')}</DialogTitle>
          <DialogDescription>Tabungan 1 Juta dan BOP bisa dibayar sekaligus dengan satu bukti transfer.</DialogDescription>
        </DialogHeader>
        {k && (
          <div className="grid gap-3">
            {[
              ['tb', 'Tabungan 1 Juta', k.tabungan],
              ['bop', 'BOP Pusat', k.bop],
            ].map(([kunci, label, d]) => (
              <div key={kunci} className="p-3 border rounded-lg">
                <label className="flex items-center gap-2 font-medium">
                  <input
                    type="checkbox"
                    checked={!!isi[kunci]}
                    disabled={d.tenggang || d.terkunci}
                    onChange={(e) => ubah(kunci, e.target.checked)}
                  />
                  {label}
                  <span className="ml-auto text-xs font-normal text-slate-500">
                    {d.tenggang ? 'masa tenggang' : d.terkunci ? 'dikunci pusat' : `kurang ${rp(d.kurang)}`}
                  </span>
                </label>
                {isi[kunci] && (
                  <Input
                    className="mt-2"
                    inputMode="numeric"
                    value={isi[`${kunci}_amount`]}
                    onChange={(e) => ubah(`${kunci}_amount`, e.target.value.replace(/\D/g, ''))}
                    placeholder="Nominal"
                  />
                )}
                {(galat[kunci] || galat[`${kunci}_amount`]) && (
                  <span className="text-xs text-red-600">{galat[kunci] || galat[`${kunci}_amount`]}</span>
                )}
              </div>
            ))}
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1">
                <Label>Tanggal bayar</Label>
                <Input type="date" max={dayjs().format('YYYY-MM-DD')} value={isi.payment_date ?? ''} onChange={(e) => ubah('payment_date', e.target.value)} />
                {galat.payment_date && <span className="text-xs text-red-600">{galat.payment_date}</span>}
              </div>
              <div className="grid gap-1">
                <Label>Rekening tujuan</Label>
                <select
                  className="h-9 px-2 text-sm border rounded-md border-input bg-background"
                  value={isi.rekening_id ?? ''}
                  onChange={(e) => ubah('rekening_id', e.target.value)}
                >
                  <option value="">—</option>
                  {(data.rekening ?? []).map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.nomor} · {r.atas_nama}
                    </option>
                  ))}
                </select>
                {galat.rekening_id && <span className="text-xs text-red-600">{galat.rekening_id}</span>}
              </div>
            </div>
            <IsiBukti file={file} setFile={setFile} galat={galat.bukti} />
            <div className="grid gap-1">
              <Label>Catatan</Label>
              <Input value={isi.notes ?? ''} onChange={(e) => ubah('notes', e.target.value)} />
            </div>
          </div>
        )}
        <DialogFooter className="flex-row justify-between gap-2 sm:justify-between">
          <Button variant="outline" disabled={proses} onClick={onClosed}>
            Batal
          </Button>
          <Button disabled={proses || !file || (!isi.tb && !isi.bop)} onClick={simpan}>
            {proses ? 'Menyimpan…' : 'Simpan pembayaran'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

/** Setoran Tabungan Goro Umrah. */
const DialogUmrah = ({ buka, onClosed }) => {
  const [isi, setIsi] = useState({});
  const [file, setFile] = useState(null);
  const [galat, setGalat] = useState({});
  const [proses, setProses] = useState(false);
  useEffect(() => {
    if (!buka) return;
    setIsi({ tanggal: dayjs().format('YYYY-MM-DD'), amount: '', notes: '' });
    setFile(null);
    setGalat({});
  }, [buka]);
  const simpan = async () => {
    setProses(true);
    const bukti = await kecilkan(file);
    router.post(route('dashboard.kasir.umrah'), { ...isi, bukti }, {
      forceFormData: true,
      preserveScroll: true,
      preserveState: true,
      onError: setGalat,
      onSuccess: onClosed,
      onFinish: () => setProses(false),
    });
  };
  const ubah = (k, v) => setIsi((x) => ({ ...x, [k]: v }));

  return (
    <Dialog open={buka} onOpenChange={(o) => !o && !proses && onClosed()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Setor Tabungan Goro Umrah</DialogTitle>
          <DialogDescription>Setoran kantor aktif, bukti transfer wajib.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1">
              <Label>Tanggal setor</Label>
              <Input type="date" max={dayjs().format('YYYY-MM-DD')} value={isi.tanggal ?? ''} onChange={(e) => ubah('tanggal', e.target.value)} />
              {galat.tanggal && <span className="text-xs text-red-600">{galat.tanggal}</span>}
            </div>
            <div className="grid gap-1">
              <Label>Nominal</Label>
              <Input inputMode="numeric" value={isi.amount ?? ''} onChange={(e) => ubah('amount', e.target.value.replace(/\D/g, ''))} />
              {galat.amount && <span className="text-xs text-red-600">{galat.amount}</span>}
            </div>
          </div>
          <IsiBukti file={file} setFile={setFile} galat={galat.bukti} />
          <div className="grid gap-1">
            <Label>Catatan</Label>
            <Input value={isi.notes ?? ''} onChange={(e) => ubah('notes', e.target.value)} />
          </div>
        </div>
        <DialogFooter className="flex-row justify-between gap-2 sm:justify-between">
          <Button variant="outline" disabled={proses} onClick={onClosed}>
            Batal
          </Button>
          <Button disabled={proses || !file || !isi.amount} onClick={simpan}>
            {proses ? 'Menyimpan…' : 'Simpan setoran'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

/** Angsuran pinjaman modal satu sumber. Tawan/Sherly: satu nominal, jasa 2% otomatis; Pusat: pokok + jasa. */
const DialogModal = ({ m, onClosed }) => {
  const [isi, setIsi] = useState({});
  const [file, setFile] = useState(null);
  const [galat, setGalat] = useState({});
  const [proses, setProses] = useState(false);
  useEffect(() => {
    if (!m) return;
    setIsi({ payment_date: dayjs().format('YYYY-MM-DD'), nominal: '', jasa: '', notes: '' });
    setFile(null);
    setGalat({});
  }, [m?.sumber]);
  const pusat = m?.sumber === 'pusat';
  const nominal = Number(isi.nominal) || 0;
  // Pratinjau pembagian; angka final dihitung ulang di server.
  const jasa = pusat ? Number(isi.jasa) || 0 : Math.min(m?.jasa_anjuran ?? 0, nominal);
  const pokok = pusat ? nominal : nominal - jasa;
  const simpan = async () => {
    setProses(true);
    const bukti = await kecilkan(file);
    router.post(route('dashboard.kasir.modal'), { ...isi, source: m.sumber, bukti }, {
      forceFormData: true,
      preserveScroll: true,
      preserveState: true,
      onError: setGalat,
      onSuccess: onClosed,
      onFinish: () => setProses(false),
    });
  };
  const ubah = (k, v) => setIsi((x) => ({ ...x, [k]: v }));

  return (
    <Dialog open={!!m} onOpenChange={(o) => !o && !proses && onClosed()}>
      <DialogContent className="max-w-md">
        {m && (
          <>
            <DialogHeader>
              <DialogTitle>Bayar {m.judul}</DialogTitle>
              <DialogDescription>
                Sisa pokok {rp(m.sisa)}. Dialokasikan ke pinjaman tertua lebih dulu.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1">
                  <Label>{pusat ? 'Angsuran pokok' : 'Nominal transfer'}</Label>
                  <Input inputMode="numeric" value={isi.nominal ?? ''} onChange={(e) => ubah('nominal', e.target.value.replace(/\D/g, ''))} />
                  {galat.nominal && <span className="text-xs text-red-600">{galat.nominal}</span>}
                </div>
                {pusat ? (
                  <div className="grid gap-1">
                    <Label>Jasa modal</Label>
                    <Input inputMode="numeric" value={isi.jasa ?? ''} onChange={(e) => ubah('jasa', e.target.value.replace(/\D/g, ''))} />
                  </div>
                ) : (
                  <div className="grid gap-1">
                    <Label>Tanggal bayar</Label>
                    <Input type="date" max={dayjs().format('YYYY-MM-DD')} value={isi.payment_date ?? ''} onChange={(e) => ubah('payment_date', e.target.value)} />
                  </div>
                )}
              </div>
              {pusat && (
                <div className="grid gap-1">
                  <Label>Tanggal bayar</Label>
                  <Input type="date" max={dayjs().format('YYYY-MM-DD')} value={isi.payment_date ?? ''} onChange={(e) => ubah('payment_date', e.target.value)} />
                </div>
              )}
              {galat.payment_date && <span className="text-xs text-red-600">{galat.payment_date}</span>}
              {nominal > 0 && (
                <div className="p-2 text-sm rounded-md bg-slate-50">
                  <Baris label={pusat ? 'Jasa modal' : 'Jasa modal (2% sisa)'} nilai={rp(jasa)} />
                  <Baris label="Masuk ke pokok" nilai={rp(pokok)} tebal />
                </div>
              )}
              <IsiBukti file={file} setFile={setFile} galat={galat.bukti} />
              <div className="grid gap-1">
                <Label>Catatan</Label>
                <Input value={isi.notes ?? ''} onChange={(e) => ubah('notes', e.target.value)} />
              </div>
            </div>
            <DialogFooter className="flex-row justify-between gap-2 sm:justify-between">
              <Button variant="outline" disabled={proses} onClick={onClosed}>
                Batal
              </Button>
              <Button disabled={proses || !file || !nominal} onClick={simpan}>
                {proses ? 'Menyimpan…' : 'Simpan pembayaran'}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default function PembayaranKantor() {
  const [bulan, setBulan] = useState(dayjs().format('YYYY-MM'));
  const [data, setData] = useState(null);
  const [galat, setGalat] = useState(null);
  const [muatUlang, setMuatUlang] = useState(0);
  const [dialog, setDialog] = useState(null); // 'iuran' | 'umrah'
  const [modalPilih, setModalPilih] = useState(null); // kartu pinjaman modal yang dibayar

  useEffect(() => {
    setGalat(null);
    const c = new AbortController();
    axios
      .get(route('dashboard.pembayaran'), { params: { bulan }, signal: c.signal })
      .then(({ data }) => setData(data))
      .catch((e) => !axios.isCancel(e) && setGalat('Ringkasan pembayaran gagal dimuat.'));
    return () => c.abort();
  }, [bulan, muatUlang]);

  const tutup = () => {
    setDialog(null);
    setMuatUlang((n) => n + 1); // angka kartu ikut terbarui sesudah simpan
  };

  const k = data?.kartu;
  const bayar = data?.boleh_bayar;

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
            <Building2 className="w-5 h-5 text-slate-500" />
            Dashboard Kasir {data?.unit ? `— ${data.unit}` : ''}
          </h2>
          <p className="text-sm text-slate-500">Tugas hari ini dan pembayaran kantor aktif per bulan.</p>
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

      {data?.tugas && <Tugas t={data.tugas} />}

      {k && (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {/* Tabungan 1 Juta + BOP satu kartu: satu tombol bayar (gabungan), dua link detail. */}
          <Kartu
            judul="Iuran Bulanan"
            ikon={PiggyBank}
            warna="bg-pink-100 text-pink-700"
            aksi={
              <div className="grid gap-2">
                {bayar && (
                  <Button size="sm" className="w-full gap-1" onClick={() => setDialog('iuran')}>
                    <Plus className="w-4 h-4" /> Bayar iuran
                  </Button>
                )}
              </div>
            }
          >
            {[
              ['Tabungan 1 Juta', k.tabungan, linkKe('tabungan.contributions')],
              ['BOP Pusat', k.bop, linkKe('bop.contributions')],
            ].map(([label, d, href], i) => (
              <div key={label} className={i > 0 ? 'pt-3 mt-3 border-t' : ''}>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800">{label}</span>
                    <TombolDetail href={href} />
                  </span>
                  {tandaIuran(d)}
                </div>
                <IsiIuran d={d} />
              </div>
            ))}
          </Kartu>
          <Kartu
            judul="Tabungan Goro Umrah"
            ikon={Plane}
            href={linkKe('dashboard.kasir.goro_umrah')}
            warna="bg-teal-100 text-teal-700"
            tanda={
              k.umrah.kali_bulan_ini > 0 ? (
                <Tanda jenis="sudah" teks={`Sudah setor ${k.umrah.kali_bulan_ini}x`} />
              ) : (
                <Tanda jenis="belum" teks="Belum setor" />
              )
            }
            aksi={
              bayar &&
              !k.umrah.terkunci && (
                <Button size="sm" className="w-full gap-1" onClick={() => setDialog('umrah')}>
                  <Plus className="w-4 h-4" /> Setor
                </Button>
              )
            }
          >
            <Baris label="Setoran bulan ini" nilai={rp(k.umrah.setoran_bulan_ini)} tebal />
            <Baris label="Total tabungan" nilai={rp(k.umrah.total)} />
            {k.umrah.terkunci && <div className="text-xs font-medium text-slate-500">🔒 Bulan ini sudah dikunci pusat.</div>}
            <Riwayat isi={k.umrah.riwayat} />
          </Kartu>
          {k.modal.map((m) => (
            <Kartu
              key={m.sumber}
              judul={m.judul}
              ikon={Landmark}
              href={linkKe('dashboard.kasir.pinjaman_modal') && route('dashboard.kasir.pinjaman_modal', { sumber: m.sumber })}
              warna="bg-violet-100 text-violet-700"
              aksi={
                m.boleh_bayar &&
                m.jumlah_aktif > 0 &&
                !m.terkunci_modal && (
                  <Button size="sm" className="w-full gap-1" onClick={() => setModalPilih(m)}>
                    <Plus className="w-4 h-4" /> Bayar angsuran
                  </Button>
                )
              }
              tanda={
                m.jumlah_aktif === 0 ? (
                  <Tanda jenis="netral" teks="Tidak ada pinjaman" />
                ) : m.sudah_bayar ? (
                  <Tanda jenis="sudah" teks={`Sudah bayar ${m.terakhir ? dayjs(m.terakhir).format('DD MMM') : ''}`} />
                ) : (
                  <Tanda jenis="belum" teks="Belum bayar" />
                )
              }
            >
              <Baris label="Sisa pokok" nilai={rp(m.sisa)} tebal />
              <Baris label="Pinjaman aktif" nilai={`${m.jumlah_aktif} pinjaman`} />
              <Baris label="Pokok dibayar bulan ini" nilai={rp(m.pokok_bulan_ini)} />
              <Baris label="Jasa modal bulan ini" nilai={rp(m.jasa_bulan_ini)} />
              {m.terkunci_modal && <div className="text-xs font-medium text-slate-500">🔒 Bulan ini sudah dikunci kasir pusat.</div>}
              <Riwayat isi={m.riwayat} />
            </Kartu>
          ))}
          <Kartu judul="SKSW" ikon={Wallet} warna="bg-emerald-100 text-emerald-700" href={linkKe('sksw.unit')}>
            <Baris label="Saldo SW" nilai={rp(k.sksw.saldo_sw)} tebal />
            <Baris label="Saldo SK" nilai={rp(k.sksw.saldo_sk)} tebal />
            <Baris label="Masuk bulan ini" nilai={rp(k.sksw.masuk)} />
            <Baris label="Keluar bulan ini" nilai={rp(k.sksw.keluar)} />
          </Kartu>
        </div>
      )}

      <DialogIuran buka={dialog === 'iuran'} onClosed={tutup} data={data} bulan={bulan} />
      <DialogUmrah buka={dialog === 'umrah'} onClosed={tutup} />
      <DialogModal
        m={modalPilih}
        onClosed={() => {
          setModalPilih(null);
          setMuatUlang((n) => n + 1);
        }}
      />
    </section>
  );
}
