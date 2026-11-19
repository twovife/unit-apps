import { router } from '@inertiajs/react';
import axios from 'axios';
import dayjs from 'dayjs';
import { Loader2, Receipt, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/shadcn/ui/badge';
import { Button } from '@/shadcn/ui/button';
import { Input } from '@/shadcn/ui/input';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/shadcn/ui/sheet';
import { rpLengkap as rp } from '@/lib/rupiah';
import { konfirmasi } from '@/lib/konfirmasi';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';
import { kecilkan } from '@/Components/PembayaranKantor';
import DialogPindai, { bisaDipindai } from '@/Components/PindaiGambar';

const bulan = (tgl) => (tgl ? dayjs(tgl).toDate().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }) : '—');
const tanggal = (tgl) => (tgl ? dayjs(tgl).toDate().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '—');
const angka = (v) => String(v ?? '').replace(/\D/g, '');
const ribuan = (v) => (v ? new Intl.NumberFormat('id-ID').format(v) : '');
const galatPertama = (e) => Object.values(e ?? {})[0] ?? 'Gagal menyimpan.';
const KELAS_TH = 'px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap';

/** Badge tagihan: merah = bulan lalu belum dibayar, kuning = tagihan bulan ini, hijau = sudah aman. */
const Tagihan = ({ k }) => {
  if (k.tenor === 0) return <span className="text-sm text-muted-foreground">Tidak ada angsuran</span>;
  if (k.status === 'lunas') return <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">Lunas {tanggal(k.lunas_at)}</Badge>;
  if (k.tunggakan > 1) return <Badge variant="outline" className="border-rose-200 bg-rose-50 text-rose-700">Telat {k.tunggakan - 1} bulan · {bulan(k.tagihan_berikut)}</Badge>;
  if (k.tunggakan === 1) return <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-800">Tagihan {bulan(k.tagihan_berikut)}</Badge>;
  return <span className="text-sm text-muted-foreground">Berikutnya {bulan(k.tagihan_berikut)}</span>;
};

/**
 * Angsuran Motor (mas 2026-11-19): satu komponen untuk menu Angsuran Motor & tab Dashboard
 * Kasir. Bayar = batch (centang banyak motor, satu tanggal transfer) atau satu unit dari
 * drawer; Input Awal = kontrak yang masih berjalan. Data dari assets.angsuran.data (kantor aktif).
 */
export default function AngsuranMotor() {
  const [data, setData] = useState(null);
  const [tab, setTab] = useState('kontrak');
  const [bayarBuka, setBayarBuka] = useState(false);
  const [tambahBuka, setTambahBuka] = useState(false);
  const [detail, setDetail] = useState(null);
  const muat = () => axios.get(route('assets.angsuran.data')).then(({ data: d }) => setData(d)).catch(() => toast.error('Gagal memuat angsuran motor.'));
  useEffect(() => { muat(); }, []);

  const berjalan = (data?.kontrak ?? []).filter((k) => k.status === 'berjalan');
  const tagihan = berjalan.filter((k) => k.tunggakan > 0);
  const TABS = [
    ['kontrak', 'Daftar Angsuran', berjalan.length],
    ['awal', 'Input Awal', 0],
  ];

  if (!data) return <div className="p-4 text-sm text-muted-foreground"><Loader2 className="mr-2 inline size-4 animate-spin" />Memuat angsuran motor…</div>;

  // Ringkasan bulan ini (semua kontrak berjalan kantor aktif).
  const bulanIni = dayjs().format('YYYY-MM');
  const dibayarIni = berjalan.concat((data.kontrak ?? []).filter((k) => k.status === 'lunas'))
    .reduce((t, k) => t + (k.bayar ?? []).filter(([p]) => p === bulanIni).reduce((u, [, , n]) => u + n, 0), 0);
  const sisaTotal = berjalan.reduce((t, k) => t + k.sisa, 0);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
        <Ringkas judul="Motor berjalan" nilai={berjalan.length} ket="kontrak angsuran aktif" />
        <Ringkas judul="Belum dibayar" nilai={tagihan.length} ket={`tagihan s/d ${bulan(`${bulanIni}-01`)}`} warna={tagihan.length ? 'text-rose-600' : 'text-emerald-600'} />
        <Ringkas judul="Dibayar bulan ini" nilai={rp(dibayarIni)} ket={bulan(`${bulanIni}-01`)} />
        <Ringkas judul="Sisa angsuran" nilai={rp(sisaTotal)} ket="semua motor berjalan" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex w-fit gap-1 rounded-xl bg-slate-100 p-1" role="tablist">
        {TABS.map(([k, label, n]) => (
          <button
            key={k}
            type="button"
            role="tab"
            aria-selected={tab === k}
            onClick={() => setTab(k)}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium ${tab === k ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            {label}
            {n > 0 && <span className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold ${k === 'bayar' ? 'bg-amber-400 text-amber-950' : 'bg-white/80 text-slate-700'}`}>{n}</span>}
          </button>
        ))}
      </div>
        <div className="flex gap-2">
        {/* Tambah motor yang terlewat (atau salah ditandai "tidak ada angsuran"). */}
        <Button variant="outline" onClick={() => setTambahBuka(true)} disabled={!data.bisa_tambah?.length}>+ Tambah Motor</Button>
        <Button onClick={() => setBayarBuka(true)} disabled={!berjalan.length} className="gap-1.5 bg-rose-600 hover:bg-rose-700">
          Bayar Angsuran
          {tagihan.length > 0 && <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[11px] font-bold text-rose-600">{tagihan.length}</span>}
        </Button>
        </div>
      </div>
      <DialogBayar buka={bayarBuka} onClosed={() => setBayarBuka(false)} daftar={berjalan} />
      <Dialog open={tambahBuka} onOpenChange={setTambahBuka}>
        <DialogContent className="flex max-h-[90vh] w-[calc(100vw-2rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-6xl">
          <DialogHeader className="border-b px-5 py-4 pr-12 text-left">
            <DialogTitle>Tambah Motor</DialogTitle>
            <DialogDescription>Motor kantor ini yang belum diinput sama sekali. Salah tandai "Tidak ada angsuran"? Hapus dulu dari tab Lunas di daftar, lalu input lagi di sini.</DialogDescription>
          </DialogHeader>
          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            <InputAwal kandidat={data.bisa_tambah ?? []} />
          </div>
        </DialogContent>
      </Dialog>

      <div className="rounded-xl border bg-white p-3 shadow-sm sm:p-4">
        {tab === 'kontrak' && <Daftar kontrak={data.kontrak} onDetail={setDetail} bolehHapusSemua={data.boleh_hapus_semua} />}
        {tab === 'awal' && <InputAwal kandidat={data.kandidat} onSelesai={() => { muat(); setTab('kontrak'); }} />}
      </div>

      <Detail k={detail} onClose={() => setDetail(null)} onUbah={() => { muat(); }} bolehHapusSemua={data.boleh_hapus_semua} />
    </div>
  );
}

/** Batch bayar: bawaannya tercentang semua yang punya tagihan s/d bulan ini. */
/** Dialog bayar batch (menu & navbar). daftar = kontrak berjalan; kosong = dimuat sendiri. */
export function DialogBayar({ buka, onClosed, daftar = null }) {
  const [isi, setIsi] = useState(daftar);
  useEffect(() => {
    if (!buka || daftar) return;
    setIsi(null);
    axios.get(route('assets.angsuran.data')).then(({ data }) => setIsi(data.kontrak.filter((k) => k.status === 'berjalan' && k.tenor > 0)));
  }, [buka]);
  const tampil = daftar ?? isi;
  return (
    <Dialog open={buka} onOpenChange={(o) => !o && onClosed()}>
      <DialogContent className="flex max-h-[90vh] w-[calc(100vw-2rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-4xl">
        <DialogHeader className="border-b px-5 py-4 pr-12 text-left">
          <DialogTitle>Bayar Angsuran Motor</DialogTitle>
          <DialogDescription>Centang motor yang dibayar, isi tanggal transfer, unggah bukti transfer.</DialogDescription>
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          {tampil ? <Bayar daftar={tampil} /> : <div className="text-sm text-muted-foreground">Memuat…</div>}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Bayar({ daftar }) {
  const [files, setFiles] = useState([]);
  const [galat, setGalat] = useState({});
  const [pilih, setPilih] = useState({});
  const [tgl, setTgl] = useState(dayjs().format('YYYY-MM-DD'));
  const [proses, setProses] = useState(false);
  useEffect(() => {
    setPilih(Object.fromEntries(daftar.filter((k) => k.tunggakan > 0).map((k) => [k.id, 1])));
  }, [daftar.length]);
  const dipilih = daftar.filter((k) => pilih[k.id]);
  const total = dipilih.reduce((t, k) => t + k.angsuran * pilih[k.id], 0);

  const simpan = async () => {
    setProses(true);
    const bukti = await Promise.all(files.map(kecilkan));
    router.post(route('assets.angsuran.bayar'), { tanggal_bayar: tgl, bukti, item: dipilih.map((k) => ({ loan_id: k.id, bulan: pilih[k.id] })) }, {
      forceFormData: true,
      preserveScroll: true,
      preserveState: true,
      // Muat ulang penuh: daftar, tombol navbar & dashboard ikut segar.
      onSuccess: () => window.location.reload(),
      onError: (e) => { setGalat(e); toast.error(galatPertama(e)); },
      onFinish: () => setProses(false),
    });
  };

  if (!daftar.length) return <Kosong>Belum ada angsuran motor berjalan. Isi lewat tab Input Awal.</Kosong>;

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="w-10 px-3 py-2"><input type="checkbox" className="size-4" checked={dipilih.length === daftar.length} onChange={(e) => setPilih(e.target.checked ? Object.fromEntries(daftar.map((k) => [k.id, 1])) : {})} /></th>
              <th className={KELAS_TH}>Plat</th>
              <th className={KELAS_TH}>Angsuran</th>
              <th className={KELAS_TH}>Terbayar</th>
              <th className={KELAS_TH}>Tagihan</th>
              <th className={`${KELAS_TH} text-right`}>Jumlah</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {daftar.map((k) => (
              <tr key={k.id} className={pilih[k.id] ? 'bg-sky-50/50' : ''}>
                <td className="px-3 py-2"><input type="checkbox" className="size-4" checked={!!pilih[k.id]} onChange={(e) => setPilih((p) => ({ ...p, [k.id]: e.target.checked ? 1 : 0 }))} /></td>
                <td className="whitespace-nowrap px-3 py-2">
                  <span className="font-mono font-bold">{k.plat ?? '—'}</span>
                  <div className="text-xs text-muted-foreground">{k.nama}{!k.aset_aktif && ' · nonaktif'}</div>
                </td>
                <td className="whitespace-nowrap px-3 py-2">{rp(k.angsuran)}</td>
                <td className="whitespace-nowrap px-3 py-2">{k.terbayar} / {k.tenor}</td>
                <td className="whitespace-nowrap px-3 py-2"><Tagihan k={k} /></td>
                <td className="whitespace-nowrap px-3 py-2 text-right font-medium">{pilih[k.id] ? rp(k.angsuran * pilih[k.id]) : '—'}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t-2 bg-slate-50 font-semibold tabular-nums">
            <tr>
              <td colSpan={5} className="px-3 py-2.5">Total ({dipilih.length} motor dipilih)</td>
              <td className="whitespace-nowrap px-3 py-2.5 text-right text-base">{rp(total)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="flex flex-wrap items-end justify-between gap-3 rounded-lg border bg-slate-50 p-3">
        <label className="space-y-1 text-sm">
          <span className="font-medium">Tanggal transfer</span>
          <Input type="date" value={tgl} max={dayjs().format('YYYY-MM-DD')} onChange={(e) => setTgl(e.target.value)} className="h-9 w-44" />
        </label>
        <div className="flex items-center gap-3">
          <div className="text-right text-sm">
            <div className="text-muted-foreground">{dipilih.length} motor</div>
            <div className="text-base font-bold">{rp(total)}</div>
          </div>
          <Button onClick={simpan} disabled={proses || !dipilih.length || !tgl || !files.length}>{proses ? 'Menyimpan…' : 'Bayar'}</Button>
        </div>
      </div>
      <MultiBukti files={files} setFiles={setFiles} judul="Bukti transfer" wajib galat={galat.bukti} />
    </div>
  );
}

/**
 * Daftar per bulan terpilih (bawaan bulan ini): angsuran bulan itu (sudah / belum dibayar),
 * terbayar s/d bulan itu, total angsuran & sisa per akhir bulan itu.
 */
function Daftar({ kontrak, onDetail, bolehHapusSemua }) {
  const [lihat, setLihat] = useState('berjalan');
  const [bln, setBln] = useState(dayjs().format('YYYY-MM'));
  // Penanda "Tidak ada angsuran" (tenor 0, status lunas) ikut tab Lunas / Semua.
  const isi = kontrak.filter((k) => lihat === 'semua' || k.status === lihat);
  const [pilih, setPilih] = useState([]);
  const [proses, setProses] = useState(false);
  useEffect(() => setPilih([]), [lihat]);
  const centang = (id) => setPilih((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const kirimHapus = async (rute, tanya) => {
    if (!(await konfirmasi(tanya))) return;
    setProses(true);
    router.post(route(rute), { id: pilih }, {
      preserveScroll: true,
      onSuccess: () => window.location.reload(),
      onError: (e) => toast.error(galatPertama(e)),
      onFinish: () => setProses(false),
    });
  };
  const hapusSemua = () => kirimHapus('assets.angsuran.hapus_batch', `Hapus SEMUA angsuran ${pilih.length} motor (kontrak + seluruh pembayarannya)? Motor kembali ke daftar "belum diinput".`);
  const hapusBulanIni = () => kirimHapus('assets.angsuran.hapus_bulan_ini', `Hapus angsuran ${bulan(dayjs().format('YYYY-MM-01'))} untuk ${pilih.length} motor? Angsuran bulan lain tetap.`);
  // Filter bulan hanya untuk angsuran yang berjalan; kontrak lunas selalu tampil angka akhirnya.
  const hitung = (k) => {
    if (k.status === 'lunas') {
      const total = k.bayar.reduce((t, [, , n]) => t + n, 0);
      return { ini: null, lunas: true, terbayar: k.bayar.length, total, sisa: k.total_harga - total };
    }
    const sd = k.bayar.filter(([p]) => p <= bln);
    const ini = k.bayar.find(([p]) => p === bln);
    const total = sd.reduce((t, [, , n]) => t + n, 0);
    return { ini, terbayar: sd.length, total, sisa: k.total_harga - total };
  };
  const baris = isi.map((k) => ({ k, h: hitung(k) }));
  const jumlah = baris.reduce((t, { h }) => ({ ini: t.ini + (h.ini?.[2] ?? 0), total: t.total + h.total, sisa: t.sisa + h.sisa }), { ini: 0, total: 0, sisa: 0 });

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2 border-b pb-3 text-sm">
        {[['berjalan', 'Berjalan'], ['lunas', 'Lunas'], ['semua', 'Semua']].map(([k, l]) => (
          <button key={k} type="button" onClick={() => setLihat(k)} className={`rounded-md border px-3 py-1 ${lihat === k ? 'border-slate-900 bg-slate-900 text-white' : 'hover:bg-slate-50'}`}>{l}</button>
        ))}
        {pilih.length > 0 && (
          <>
            <Button size="sm" variant="outline" className="gap-1.5 border-amber-300 text-amber-700 hover:bg-amber-50" disabled={proses} onClick={hapusBulanIni}>
              <Trash2 className="size-4" />Hapus angsuran bulan ini ({pilih.length})
            </Button>
            {bolehHapusSemua && (
              <Button size="sm" variant="outline" className="gap-1.5 border-rose-200 text-rose-600 hover:bg-rose-50" disabled={proses} onClick={hapusSemua}>
                <Trash2 className="size-4" />Hapus semua angsuran ({pilih.length})
              </Button>
            )}
          </>
        )}
        <label className={`ml-auto flex items-center gap-2 ${lihat === 'lunas' ? 'invisible' : ''}`}>
          <span className="text-muted-foreground">Bulan</span>
          <Input type="month" value={bln} onChange={(e) => setBln(e.target.value || dayjs().format('YYYY-MM'))} className="h-8 w-40" />
        </label>
      </div>
      {!isi.length ? <Kosong>Tidak ada angsuran.</Kosong> : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="w-10 px-3 py-2.5"><input type="checkbox" className="size-4" title="Pilih semua" checked={isi.length > 0 && pilih.length === isi.length} onChange={(e) => setPilih(e.target.checked ? isi.map((k) => k.id) : [])} /></th>
                {['Plat', 'Pemakai'].map((h) => <th key={h} className={KELAS_TH}>{h}</th>)}
                <th className={`${KELAS_TH} text-right`}>Angsuran</th>
                <th className={`${KELAS_TH} text-right`}>Total Harga</th>
                <th className={KELAS_TH}>{lihat === 'lunas' ? 'Status' : `Angsuran ${bulan(`${bln}-01`)}`}</th>
                <th className={KELAS_TH}>{lihat === 'lunas' ? 'Tanggal Lunas' : 'Tanggal Bayar'}</th>
                <th className={`${KELAS_TH} text-center`}>Terbayar / Tenor</th>
                <th className={`${KELAS_TH} text-right`}>Total Angsuran</th>
                <th className={`${KELAS_TH} text-right`}>Sisa Angsuran</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {baris.map(({ k, h }) => (
                <tr key={k.id} className={`cursor-pointer tabular-nums transition-colors hover:bg-sky-50/60 ${pilih.includes(k.id) ? 'bg-rose-50/60' : ''}`} onClick={() => onDetail(k)}>
                  <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}><input type="checkbox" className="size-4" checked={pilih.includes(k.id)} onChange={() => centang(k.id)} /></td>
                  <td className="whitespace-nowrap px-3 py-2.5.5"><span className="font-mono font-bold text-blue-700">{k.plat ?? '—'}</span><div className="text-xs text-muted-foreground">{k.nama}</div></td>
                  <td className="whitespace-nowrap px-3 py-2.5">{k.pemakai ?? '—'}</td>
                  {k.tenor === 0 ? (
                    <td colSpan={7} className="whitespace-nowrap px-3 py-2.5 text-center"><Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">Lunas · tidak ada angsuran</Badge></td>
                  ) : (<>
                  <td className="whitespace-nowrap px-3 py-2.5 text-right">{rp(k.angsuran)}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-right">{rp(k.total_harga)}</td>
                  <td className="whitespace-nowrap px-3 py-2.5">
                    {h.lunas ? (
                      <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">Lunas</Badge>
                    ) : h.ini ? (
                      <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">{rp(h.ini[2])}</Badge>
                    ) : h.terbayar >= k.tenor || !k.bayar.length || bln < k.bayar[0][0] ? (
                      <span className="text-muted-foreground">—</span>
                    ) : (
                      <Badge variant="outline" className="border-rose-200 bg-rose-50 text-rose-700">Belum dibayar</Badge>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2.5">{h.lunas ? tanggal(k.lunas_at) : h.ini ? tanggal(h.ini[1]) : <span className="text-muted-foreground">—</span>}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-center font-medium">{h.terbayar} / {k.tenor}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-right">{rp(h.total)}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-right font-semibold">{rp(h.sisa)}</td>
                  </>)}
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t-2 bg-slate-50 font-semibold tabular-nums">
              <tr>
                <td colSpan={5} className="px-3 py-2">Jumlah ({baris.length} motor)</td>
                <td className="whitespace-nowrap px-3 py-2.5">{rp(jumlah.ini)}</td>
                <td />
                <td />
                <td className="whitespace-nowrap px-3 py-2.5 text-right">{rp(jumlah.total)}</td>
                <td className="whitespace-nowrap px-3 py-2.5 text-right">{rp(jumlah.sisa)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}

/** Input awal kontrak berjalan: satu baris per kendaraan; baris kosong dilewati. */
export function InputAwal({ kandidat, onSelesai }) {
  const namaBulanIni = dayjs().toDate().toLocaleDateString('id-ID', { month: 'long' });
  const [nonaktif, setNonaktif] = useState(false);
  const [isi, setIsi] = useState({});
  const [proses, setProses] = useState(false);
  const tampil = kandidat.filter((a) => a.aktif || nonaktif);
  const ubah = (id, kolom, nilai) => setIsi((p) => ({ ...p, [id]: { ...p[id], [kolom]: nilai } }));
  // Isian global: diketik sekali, langsung mengisi kolom itu di semua baris yang tampil
  // (kecuali yang dicentang "Tidak ada angsuran"). Baris tetap bisa diubah satu-satu sesudahnya.
  const [semua, setSemua] = useState({});
  const [bukti, setBukti] = useState([]);
  const isiSemua = (kolom, nilai) => {
    setSemua((g) => ({ ...g, [kolom]: nilai }));
    setIsi((p) => {
      const baru = { ...p };
      tampil.forEach((a) => {
        if (!p[a.asset_id]?.lunas) baru[a.asset_id] = { ...p[a.asset_id], [kolom]: nilai };
      });
      return baru;
    });
  };
  const terisi = useMemo(() => tampil.filter((a) => {
    const r = isi[a.asset_id];
    return r && (r.lunas || r.angsuran || r.tenor || r.terbayar || r.tanggal_terakhir);
  }), [isi, tampil]);

  const simpan = async () => {
    setProses(true);
    // Foto bukti dikecilkan dulu (sama dengan Pembayaran Kantor); PDF apa adanya.
    const baris = await Promise.all(terisi.map(async (a) => {
      const r = isi[a.asset_id];
      if (r.lunas) return { asset_id: a.asset_id, lunas: true };
      return {
        asset_id: a.asset_id,
        angsuran: Number(r.angsuran || 0),
        tenor: Number(r.tenor || 0),
        terbayar: Number(r.terbayar || 0),
        tanggal_terakhir: r.tanggal_terakhir ?? '',
      };
    }));
    router.post(route('assets.angsuran.awal'), { baris, bukti: await Promise.all(bukti.map(kecilkan)) }, {
      forceFormData: true,
      preserveScroll: true,
      preserveState: true,
      // Sesudah simpan langsung ke menu Angsuran Motor (muat penuh: daftar & tombol navbar segar).
      onSuccess: () => { window.location.href = route('assets.angsuran.index'); },
      onError: (e) => toast.error(galatPertama(e)),
      onFinish: () => setProses(false),
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <p className="text-muted-foreground">Isi motor yang ada angsurannya (Angsuran ke = tenor berarti sudah lunas). Motor yang sudah lunas sebelum {namaBulanIni} (atau dibeli tunai): centang di kolom paling kanan. Baris kosong dilewati.</p>
        <label className="flex items-center gap-2"><input type="checkbox" className="size-4" checked={nonaktif} onChange={(e) => setNonaktif(e.target.checked)} />Tampilkan kendaraan nonaktif</label>
      </div>
      {!tampil.length ? <Kosong>Semua kendaraan sudah punya angsuran berjalan.</Kosong> : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-xs">
            <thead className="bg-slate-50">
              <tr>{['Nomor Plat', 'Angsuran', 'Tenor (bulan)', 'Angsuran ke', 'Tanggal Pembayaran', 'Total Angsuran', 'Total Harga', `Lunas sebelum ${namaBulanIni}`].map((h, n) => (
                <th key={h} className={`${KELAS_TH} text-xs ${n === 5 || n === 6 ? 'text-right' : ''} ${n === 7 ? 'text-center' : ''}`}>{h}</th>
              ))}</tr>
              <tr className="border-t bg-sky-50">
                <th className="px-3 py-2 text-left text-xs font-semibold text-sky-800">Isi semua ↓</th>
                <th className="px-3 py-2 text-left font-normal"><Input inputMode="numeric" className="h-8 px-2 text-xs md:text-xs w-32 bg-white" placeholder="0" value={ribuan(semua.angsuran)} onChange={(e) => isiSemua('angsuran', angka(e.target.value))} /></th>
                <th className="px-3 py-2 text-left font-normal"><Input inputMode="numeric" placeholder="0" className="h-8 px-2 text-xs md:text-xs w-20 bg-white" value={semua.tenor ?? ''} onChange={(e) => isiSemua('tenor', angka(e.target.value))} /></th>
                <th className="px-3 py-2 text-left font-normal"><Input inputMode="numeric" placeholder="0" className="h-8 px-2 text-xs md:text-xs w-20 bg-white" value={semua.terbayar ?? ''} onChange={(e) => isiSemua('terbayar', angka(e.target.value))} /></th>
                <th className="px-3 py-2 text-left font-normal"><Input type="date" className="h-8 px-2 text-xs md:text-xs w-40 bg-white" max={dayjs().format('YYYY-MM-DD')} value={semua.tanggal_terakhir ?? ''} onChange={(e) => isiSemua('tanggal_terakhir', e.target.value)} /></th>
                <th colSpan={2} className="px-3 py-2 text-left text-xs font-normal text-sky-800">Mengisi semua baris; tiap baris tetap bisa diubah.</th>
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {tampil.map((a) => {
                const r = isi[a.asset_id] ?? {};
                const ang = Number(r.angsuran || 0);
                const mati = !!r.lunas;
                return (
                  <tr key={a.asset_id} className={mati ? 'bg-slate-50 text-muted-foreground' : ''}>
                    <td className="whitespace-nowrap px-3 py-2"><span className="font-mono text-xs font-bold">{a.plat ?? '—'}</span><div className="text-[11px] text-muted-foreground">{a.nama}{!a.aktif && ` · nonaktif${a.kondisi ? ` (${a.kondisi})` : ''}`}</div></td>
                    <td className="px-3 py-2"><Input disabled={mati} inputMode="numeric" className="h-8 px-2 text-xs md:text-xs w-32" placeholder="0" value={ribuan(r.angsuran)} onChange={(e) => ubah(a.asset_id, 'angsuran', angka(e.target.value))} /></td>
                    <td className="px-3 py-2"><Input disabled={mati} inputMode="numeric" placeholder="0" className="h-8 px-2 text-xs md:text-xs w-20" value={r.tenor ?? ''} onChange={(e) => ubah(a.asset_id, 'tenor', angka(e.target.value))} /></td>
                    <td className="px-3 py-2"><Input disabled={mati} inputMode="numeric" placeholder="0" className="h-8 px-2 text-xs md:text-xs w-20" value={r.terbayar ?? ''} onChange={(e) => ubah(a.asset_id, 'terbayar', angka(e.target.value))} /></td>
                    <td className="px-3 py-2"><Input disabled={mati} type="date" className="h-8 px-2 text-xs md:text-xs w-40" max={dayjs().format('YYYY-MM-DD')} value={r.tanggal_terakhir ?? ''} onChange={(e) => ubah(a.asset_id, 'tanggal_terakhir', e.target.value)} /></td>
                    <td className="whitespace-nowrap px-3 py-2 text-right">{!mati && ang && r.terbayar ? rp(ang * Number(r.terbayar)) : '—'}</td>
                    <td className="whitespace-nowrap px-3 py-2 text-right font-medium">{!mati && ang && r.tenor ? rp(ang * Number(r.tenor)) : '—'}</td>
                    <td className="px-3 py-2 text-center">
                      <label className="inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap text-xs">
                        <input type="checkbox" className="size-4" checked={mati} onChange={(e) => ubah(a.asset_id, 'lunas', e.target.checked)} />
                        Centang jika lunas sebelum {namaBulanIni}
                      </label>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {/* Sekali unggah untuk semua motor yang diisi: satu slip bisa untuk beberapa motor. */}
      <div className="flex flex-wrap items-end justify-between gap-3 rounded-lg border bg-slate-50 p-3">
        <MultiBukti files={bukti} setFiles={setBukti} judul="Bukti transfer angsuran terakhir" wajib={terisi.some((a) => !isi[a.asset_id]?.lunas)} />
        <Button onClick={simpan} disabled={proses || !terisi.length || (terisi.some((a) => !isi[a.asset_id]?.lunas) && !bukti.length)}>{proses ? 'Menyimpan…' : `Simpan ${terisi.length || ''} motor`}</Button>
      </div>
    </div>
  );
}

/** Drawer satu kontrak: riwayat angsuran, bayar satu unit, batalkan angsuran terakhir. */
function Detail({ k, onClose, onUbah, bolehHapusSemua }) {
  const [riwayat, setRiwayat] = useState(null);
  const [files, setFiles] = useState([]);
  const [tgl, setTgl] = useState(dayjs().format('YYYY-MM-DD'));
  const [proses, setProses] = useState(false);
  const muat = () => k && axios.get(route('assets.angsuran.detail', k.id)).then(({ data }) => setRiwayat(data.pembayaran));
  useEffect(() => { setRiwayat(null); muat(); }, [k?.id]);

  const opsi = (pesan) => ({
    preserveScroll: true,
    preserveState: true,
    onSuccess: () => { toast.success(pesan); onUbah(); onClose(); },
    onError: (e) => toast.error(galatPertama(e)),
    onFinish: () => setProses(false),
  });
  const bayar = async () => {
    setProses(true);
    const bukti = await Promise.all(files.map(kecilkan));
    router.post(route('assets.angsuran.bayar'), { tanggal_bayar: tgl, bukti, item: [{ loan_id: k.id, bulan: 1 }] }, { ...opsi('Angsuran dibayar.'), forceFormData: true, onSuccess: () => window.location.reload() });
  };
  const hapusBulanIni = async () => {
    if (!(await konfirmasi(`Hapus angsuran ${bulan(dayjs().format('YYYY-MM-01'))} ${k.plat}? Angsuran bulan lain tetap.`))) return;
    setProses(true);
    router.post(route('assets.angsuran.hapus_bulan_ini'), { id: [k.id] }, { ...opsi('Angsuran bulan ini dihapus.'), onSuccess: () => window.location.reload() });
  };
  // Salah input: hapus kontrak + semua pembayarannya; motor kembali ke daftar belum diinput.
  const hapusKontrak = async () => {
    if (!(await konfirmasi(`Hapus SEMUA angsuran ${k.plat} (${k.terbayar} pembayaran ikut terhapus)? Motor ini kembali ke daftar "belum diinput".`))) return;
    setProses(true);
    router.delete(route('assets.angsuran.hapus_kontrak', k.id), { ...opsi('Angsuran dihapus.'), onSuccess: () => window.location.reload() });
  };
  const batal = async (p) => {
    if (!(await konfirmasi(`Batalkan angsuran ke-${p.angsuran_ke} (${bulan(p.periode)})?`))) return;
    setProses(true);
    router.delete(route('assets.angsuran.hapus', p.id), opsi('Angsuran dibatalkan.'));
  };

  return (
    <Sheet open={!!k} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-xl">
        <SheetHeader className="border-b px-5 py-4 pr-14 text-left">
          <SheetTitle>Angsuran {k?.plat}</SheetTitle>
          <SheetDescription>{k?.nama} · {rp(k?.angsuran)} × {k?.tenor} bulan = {rp(k?.total_harga)}</SheetDescription>
        </SheetHeader>
        {k && (
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5">
            <div className="grid grid-cols-3 gap-2 text-center text-sm">
              <div className="rounded-lg border p-2"><div className="text-xs text-muted-foreground">Terbayar</div><div className="font-bold">{k.terbayar} / {k.tenor}</div></div>
              <div className="rounded-lg border p-2"><div className="text-xs text-muted-foreground">Sudah dibayar</div><div className="font-bold">{rp(k.total_bayar)}</div></div>
              <div className="rounded-lg border p-2"><div className="text-xs text-muted-foreground">Sisa</div><div className="font-bold">{rp(k.sisa)}</div></div>
            </div>
            {k.status === 'berjalan' && (
              <div className="flex flex-wrap items-end gap-2 rounded-lg border bg-slate-50 p-3">
                <label className="space-y-1 text-sm">
                  <span className="font-medium">Bayar tagihan {bulan(k.tagihan_berikut)} · tanggal transfer</span>
                  <Input type="date" value={tgl} max={dayjs().format('YYYY-MM-DD')} onChange={(e) => setTgl(e.target.value)} className="h-9 w-44" />
                </label>
                <Button onClick={bayar} disabled={proses || !tgl || !files.length}>Bayar {rp(k.angsuran)}</Button>
                <div className="w-full"><MultiBukti files={files} setFiles={setFiles} judul="Bukti transfer" wajib /></div>
              </div>
            )}
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full text-sm">
                <thead className="bg-slate-50"><tr>{['Ke', 'Tagihan', 'Tgl Bayar', 'Nominal', ''].map((h) => <th key={h} className={KELAS_TH}>{h}</th>)}</tr></thead>
                <tbody className="divide-y">
                  {!riwayat ? <tr><td colSpan={5} className="p-4 text-center text-muted-foreground">Memuat…</td></tr> : riwayat.map((p, i) => (
                    <tr key={p.id}>
                      <td className="px-3 py-2 font-semibold">{p.angsuran_ke}</td>
                      <td className="whitespace-nowrap px-3 py-2">{bulan(p.periode)}{p.sumber === 'awal' && <span className="ml-1 text-xs text-muted-foreground">(input awal)</span>}</td>
                      <td className="whitespace-nowrap px-3 py-2">
                        {tanggal(p.tanggal_bayar)}
                        {p.oleh && <div className="text-xs text-muted-foreground">{p.oleh}</div>}
                        {p.bukti?.length > 0 && (
                          <div className="flex flex-wrap gap-x-2">
                            {p.bukti.map((url, n) => <a key={url} href={url} target="_blank" rel="noreferrer" className="text-xs font-medium text-sky-700 hover:underline">Bukti{p.bukti.length > 1 ? ` ${n + 1}` : ''}</a>)}
                          </div>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2">{rp(p.nominal)}</td>
                      <td className="px-3 py-2 text-right">
                        {i === 0 && riwayat.length > 1 && (
                          <Button size="sm" variant="ghost" className="text-destructive" disabled={proses} onClick={() => batal(p)}><Trash2 className="size-4" /></Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-wrap justify-end gap-2 border-t pt-3">
              {k.bayar?.length > 1 && k.bayar[k.bayar.length - 1][0] === dayjs().format('YYYY-MM') && (
                <Button variant="outline" size="sm" className="gap-1.5 border-amber-300 text-amber-700 hover:bg-amber-50" disabled={proses} onClick={hapusBulanIni}>
                  <Trash2 className="size-4" />Hapus angsuran bulan ini
                </Button>
              )}
              {bolehHapusSemua && (
                <Button variant="outline" size="sm" className="gap-1.5 border-rose-200 text-rose-600 hover:bg-rose-50" disabled={proses} onClick={hapusKontrak}>
                  <Trash2 className="size-4" />Hapus semua angsuran
                </Button>
              )}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

// Kartu angka ringkas di atas halaman.
const Ringkas = ({ judul, nilai, ket, warna = 'text-slate-900' }) => (
  <div className="rounded-xl border bg-white p-3 shadow-sm sm:p-4">
    <div className="text-xs font-medium text-muted-foreground">{judul}</div>
    <div className={`mt-1 text-lg font-bold tabular-nums sm:text-xl ${warna}`}>{nilai}</div>
    <div className="hidden text-xs text-muted-foreground sm:block">{ket}</div>
  </div>
);

/**
 * Unggah bukti sekali, boleh beberapa file (foto / PDF); satu daftar untuk semua motor yang
 * dibayar. Sama dengan unggahan lain: tiap foto lewat pemindai (atur sudut / potong / pratinjau)
 * satu per satu; PDF langsung (maks 2MB). Foto dikecilkan saat dikirim (kecilkan).
 */
export function MultiBukti({ files, setFiles, judul = 'Bukti transfer', wajib = false, galat }) {
  const [antre, setAntre] = useState([]); // foto yang menunggu dipindai, satu per satu
  const [pesan, setPesan] = useState('');
  const tambah = (f) => setFiles((lama) => [...(Array.isArray(lama) ? lama : files), f].slice(0, 10));
  const pilihMentah = (daftar) => {
    setPesan('');
    const foto = [];
    daftar.forEach((f) => {
      if (bisaDipindai(f)) foto.push(f);
      else if (f.type === 'application/pdf' && f.size > 2 * 1024 * 1024) setPesan('PDF maksimal 2MB. Kirim sebagai foto saja.');
      else tambah(f);
    });
    setAntre((a) => [...a, ...foto]);
  };
  const lanjut = () => setAntre((a) => a.slice(1));
  return (
    <div className="space-y-1 text-sm">
      <div className="font-medium">{judul}{wajib && <span className="text-rose-500"> *</span>}</div>
      <div className="flex flex-wrap items-center gap-1.5">
        {files.map((f, n) => (
          <span key={`${f.name}-${n}`} className="inline-flex max-w-48 items-center gap-1 rounded-md border border-emerald-300 bg-emerald-50 px-2 py-1 text-xs text-emerald-800">
            <Receipt className="size-3.5 shrink-0" />
            <span className="truncate">{f.name}</span>
            <button type="button" title="Hapus" className="text-emerald-700 hover:text-rose-600" onClick={() => setFiles(files.filter((_, i) => i !== n))}>✕</button>
          </span>
        ))}
        <label className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md border border-dashed bg-white px-3 text-xs text-slate-600 hover:bg-slate-50">
          <Receipt className="size-3.5" />
          {files.length ? 'Tambah foto / PDF' : 'Pilih foto / PDF bukti (bisa lebih dari satu)'}
          <input type="file" multiple accept="image/*,application/pdf" className="hidden" onChange={(e) => { pilihMentah(Array.from(e.target.files ?? [])); e.target.value = ''; }} />
        </label>
      </div>
      {(pesan || galat) && <div className="text-xs text-destructive">{pesan || galat}</div>}
      <DialogPindai file={antre[0] ?? null} onBatal={lanjut} onPilih={(f) => { tambah(f); lanjut(); }} />
    </div>
  );
}

const Kosong = ({ children }) => <div className="rounded-lg border p-6 text-center text-sm text-muted-foreground">{children}</div>;
