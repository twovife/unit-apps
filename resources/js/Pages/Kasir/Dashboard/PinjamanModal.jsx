import { Head, Link, router } from '@inertiajs/react';
import dayjs from 'dayjs';
import { ArrowLeft, Landmark, Plus, Receipt, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { rpLengkap as rp, rpInput } from '@/lib/rupiah';
import { IsiBukti, kecilkan } from '@/Components/PembayaranKantor';
import { Button } from '@/shadcn/ui/button';
import { Input } from '@/shadcn/ui/input';
import { Label } from '@/shadcn/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';

/** Detail Pinjaman Modal kantor aktif per sumber (baca-saja; bayar dari Dashboard Kasir). */
const tgl = (d) => (d ? dayjs(d).format('DD MMM YYYY') : '–');

/** Ringkasan satu kartu, gaya halaman Iuran Tabungan 1 Juta: ikon + judul kiri, angka kanan. */
const Ringkas = ({ r, judul, unit }) => {
  const persen = r.total_pinjaman > 0 ? Math.min(100, Math.round((r.total_pokok / r.total_pinjaman) * 100)) : 0;
  const isi = [
    ['Total pinjaman', r.total_pinjaman, ''],
    ['Pokok dibayar', r.total_pokok, 'text-emerald-700'],
    ['Jasa modal dibayar', r.total_jasa, ''],
    ...(r.jasa_wajib !== null && r.jasa_wajib !== undefined
      ? [['Jasa wajib bulan ini', r.jasa_wajib, r.jasa_wajib > 0 ? 'text-red-600' : 'text-emerald-700']]
      : []),
    ['Sisa pokok', r.sisa, 'text-violet-700'],
  ];

  return (
    <section className="flex flex-col gap-4 p-4 bg-white border shadow-sm rounded-xl lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-start min-w-0 gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg shrink-0 bg-violet-50 text-violet-700">
          <Landmark className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <h2 className="text-lg font-semibold truncate text-zinc-900">{unit}</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {judul} · {persen}% pokok sudah dibayar
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-5">
        {isi.map(([label, nilai, kelas]) => (
          <div key={label}>
            <div className="text-xs text-muted-foreground">{label}</div>
            <strong className={`text-sm tabular-nums ${kelas}`}>{rp(nilai)}</strong>
          </div>
        ))}
      </div>
    </section>
  );
};

/** Tambah pinjaman modal kantor aktif + bukti transfer masuk (PembayaranKantorController::tambahModal). */
const DialogTambah = ({ buka, tutup, sumber = [] }) => {
  const kosong = { source: sumber[0]?.kunci ?? '', amount: '', loan_date: dayjs().format('YYYY-MM-DD'), notes: '' };
  const [isi, setIsi] = useState(kosong);
  const [file, setFile] = useState(null);
  const [galat, setGalat] = useState({});
  const [proses, setProses] = useState(false);
  const ubah = (k, v) => setIsi((x) => ({ ...x, [k]: v }));
  const selesai = () => {
    setIsi(kosong);
    setFile(null);
    setGalat({});
    tutup();
  };
  const simpan = async () => {
    setProses(true);
    const bukti = await kecilkan(file);
    router.post(route('dashboard.kasir.modal.tambah'), { ...isi, bukti }, {
      forceFormData: true,
      preserveScroll: true,
      onError: setGalat,
      onSuccess: selesai,
      onFinish: () => setProses(false),
    });
  };

  return (
    <Dialog open={buka} onOpenChange={(o) => !o && !proses && selesai()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Tambah pinjaman modal</DialogTitle>
          <DialogDescription>Uang modal yang masuk ke kantor ini. Jasa 2% mulai bulan ke-4; Modal Awal dicatat pusat.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="grid gap-1">
            <Label>Sumber dana</Label>
            <select
              value={isi.source}
              onChange={(e) => ubah('source', e.target.value)}
              className="h-9 px-3 text-sm border rounded-md border-input bg-background"
            >
              {sumber.map((x) => (
                <option key={x.kunci} value={x.kunci}>
                  {x.judul}
                </option>
              ))}
            </select>
            {galat.source && <span className="text-xs text-red-600">{galat.source}</span>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1">
              <Label>Nominal</Label>
              <Input inputMode="numeric" value={rpInput(isi.amount)} onChange={(e) => ubah('amount', e.target.value.replace(/\D/g, ''))} />
              {galat.amount && <span className="text-xs text-red-600">{galat.amount}</span>}
            </div>
            <div className="grid gap-1">
              <Label>Tanggal masuk</Label>
              <Input type="date" max={dayjs().format('YYYY-MM-DD')} value={isi.loan_date} onChange={(e) => ubah('loan_date', e.target.value)} />
              {galat.loan_date && <span className="text-xs text-red-600">{galat.loan_date}</span>}
            </div>
          </div>
          <IsiBukti file={file} setFile={setFile} galat={galat.bukti} />
          <div className="grid gap-1">
            <Label>Catatan</Label>
            <Input value={isi.notes} onChange={(e) => ubah('notes', e.target.value)} />
          </div>
        </div>
        <DialogFooter className="flex-row justify-between gap-2 sm:justify-between">
          <Button variant="outline" disabled={proses} onClick={selesai}>
            Batal
          </Button>
          <Button disabled={proses || !file || !Number(isi.amount) || !isi.source} onClick={simpan}>
            {proses ? 'Menyimpan…' : 'Simpan pinjaman'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default function PinjamanModal({ unit, sumber, sumber_ada = [], ringkas, pinjaman = [], angsuran = [], boleh_tambah = false, sumber_tambah = [] }) {
  const [tambah, setTambah] = useState(false);
  // Tab buku = drawer app_laravel: Semua | Pusat | Hertawan | Sherly | Modal Awal.
  const judul = sumber_ada.find((x) => x.kunci === sumber)?.judul ?? 'Pinjaman Modal';
  const ke = (q) => router.get(route('dashboard.kasir.pinjaman_modal'), { sumber, ...q }, { preserveScroll: true });
  const lintasBuku = sumber === 'semua' || sumber === 'modal_awal';

  return (
    <>
      <Head title={judul} />
      <div className="space-y-4">
        <div>
          <Link href={route('dashboard.kasir')} className="inline-flex items-center gap-1 mb-1 text-xs font-medium text-slate-500 hover:text-slate-800">
            <ArrowLeft className="w-3.5 h-3.5" /> Dashboard Kasir
          </Link>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h1 className="flex items-center gap-2 text-xl font-semibold text-slate-900">
              <Landmark className="w-5 h-5 text-violet-600" /> {judul} — {unit}
            </h1>
            {boleh_tambah && sumber_tambah.length > 0 && (
              <Button size="sm" className="gap-1" onClick={() => setTambah(true)}>
                <Plus className="w-4 h-4" /> Tambah pinjaman modal
              </Button>
            )}
          </div>
        </div>
        <DialogTambah buka={tambah} tutup={() => setTambah(false)} sumber={sumber_tambah} />

        <div className="inline-flex p-1 rounded-lg bg-slate-100">
          {sumber_ada.map((x) => (
            <button
              key={x.kunci}
              type="button"
              onClick={() => ke({ sumber: x.kunci })}
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                x.kunci === sumber ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {x.judul.replace('Pinjaman Modal ', '')}
            </button>
          ))}
        </div>


        <Ringkas r={ringkas} judul={judul} unit={unit} />

        <section>
          <h2 className="mb-2 font-semibold text-slate-900">Daftar pinjaman</h2>
          <div className="overflow-x-auto bg-white border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-3 py-2 font-medium text-left">Tanggal</th>
                  {lintasBuku && <th className="px-3 py-2 font-medium text-left">Sumber / jenis</th>}
                  <th className="px-3 py-2 font-medium text-right">Pinjaman</th>
                  <th className="px-3 py-2 font-medium text-right">Pokok dibayar</th>
                  <th className="px-3 py-2 font-medium text-right">Sisa</th>
                  <th className="px-3 py-2 font-medium text-right">Jasa wajib bulan ini</th>
                  <th className="px-3 py-2 font-medium text-center">Status</th>
                  <th className="px-3 py-2 font-medium text-left">Catatan</th>
                </tr>
              </thead>
              <tbody>
                {pinjaman.length === 0 && (
                  <tr>
                    <td colSpan={lintasBuku ? 8 : 7} className="py-6 text-center text-slate-500">
                      Kantor ini tidak punya pinjaman di buku ini.
                    </td>
                  </tr>
                )}
                {pinjaman.map((l) => (
                  <tr key={l.id} className="border-t even:bg-slate-50">
                    <td className="px-3 py-2 whitespace-nowrap">{tgl(l.tanggal)}</td>
                    {lintasBuku && (
                      <td className="px-3 py-2 text-xs whitespace-nowrap text-slate-600">
                        {l.sumber.replace('Pinjaman Modal ', '')} · {l.jenis}
                      </td>
                    )}
                    <td className="px-3 py-2 text-right tabular-nums">{rp(l.jumlah)}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{rp(l.dibayar)}</td>
                    <td className="px-3 py-2 font-semibold text-right tabular-nums">{rp(l.sisa)}</td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {l.jasa_berlaku ? (
                        rp(l.jasa_wajib)
                      ) : l.wajib_mulai && l.sisa > 0 ? (
                        <span className="text-xs text-amber-600">tempo s/d {dayjs(`${l.wajib_mulai}-01`).subtract(1, 'month').format('MMM YY')}</span>
                      ) : (
                        '–'
                      )}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <span
                        className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                          l.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {l.status === 'paid' ? 'Lunas' : 'Aktif'}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-slate-600">
                      {l.catatan || '–'}
                      {l.bukti && (
                        <a href={l.bukti} target="_blank" rel="noreferrer" className="ml-2 text-xs font-medium text-sky-700 hover:underline">
                          bukti
                        </a>
                      )}
                      {/* Hapus pinjaman salah input: hanya transaksi terakhir sumbernya & bulan belum dikunci. */}
                      {l.hapus && (
                        <button
                          type="button"
                          title="Hapus pinjaman"
                          className="ml-2 align-middle text-rose-600 hover:text-rose-800"
                          onClick={() =>
                            window.confirm(`Hapus pinjaman ${tgl(l.tanggal)} ${rp(l.jumlah)}?`) &&
                            router.delete(l.hapus, { preserveScroll: true })
                          }
                        >
                          <Trash2 className="inline w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-slate-900">Riwayat angsuran</h2>
          <div className="overflow-x-auto bg-white border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-3 py-2 font-medium text-left">Tanggal</th>
                  <th className="px-3 py-2 font-medium text-right">Pokok</th>
                  <th className="px-3 py-2 font-medium text-right">Jasa modal</th>
                  <th className="px-3 py-2 font-medium text-left">Pinjaman</th>
                  <th className="px-3 py-2 font-medium text-left">Dicatat oleh</th>
                  <th className="px-3 py-2 font-medium text-center">Bukti</th>
                  <th className="px-3 py-2" />
                </tr>
              </thead>
              <tbody>
                {angsuran.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-slate-500">
                      Belum ada angsuran.
                    </td>
                  </tr>
                )}
                {angsuran.map((p) => {
                  const l = pinjaman.find((x) => x.id === p.pinjaman_id);
                  return (
                    <tr key={p.id} className="border-t even:bg-slate-50">
                      <td className="px-3 py-2 whitespace-nowrap">{tgl(p.tanggal)}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{rp(p.pokok)}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{rp(p.jasa)}</td>
                      <td className="px-3 py-2 text-xs text-slate-600">{l ? `${tgl(l.tanggal)} · ${rp(l.jumlah)}` : '–'}</td>
                      <td className="px-3 py-2 text-slate-600">{p.oleh || '–'}</td>
                      <td className="px-3 py-2 text-center">
                        {p.bukti ? (
                          <a href={p.bukti} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-sky-700 hover:underline">
                            <Receipt className="w-3.5 h-3.5" /> lihat
                          </a>
                        ) : (
                          '–'
                        )}
                      </td>
                      <td className="px-3 py-2 text-center">
                        {p.hapus && (
                          <button
                            type="button"
                            title="Hapus angsuran (satu slip)"
                            className="text-rose-600 hover:text-rose-800"
                            onClick={() =>
                              window.confirm(`Hapus angsuran ${tgl(p.tanggal)}? Semua bagian dari pembayaran yang sama ikut terhapus.`) &&
                              router.delete(p.hapus, { preserveScroll: true })
                            }
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}
