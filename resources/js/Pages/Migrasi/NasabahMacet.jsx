import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shadcn/ui/table';
import { Button } from '@/shadcn/ui/button';
import CurrencyInput from 'react-currency-input-field';
import dayjs from 'dayjs';
import { ArrowLeft } from 'lucide-react';
import { rpAtauStrip as rp } from '@/lib/rupiah';

const HARI = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];
const PILIH = 'h-8 px-2 text-sm border rounded-md border-input bg-background';

const nadaZ = (z) => (z < 0 ? 'text-red-600' : z > 0 ? 'text-violet-700' : 'text-slate-900');

const Kartu = ({ judul, utama, nada = 'text-slate-900', children }) => (
  <div className="p-3 bg-white border rounded-lg border-slate-200">
    <div className="text-xs font-medium tracking-wide uppercase text-slate-500">{judul}</div>
    <div className={`mt-1 text-xl font-semibold tabular-nums ${nada}`}>{rp(utama)}</div>
    {children}
  </div>
);

/** Isian penyesuaian satu pinjaman: sisa saldo seharusnya + catatan (arah otomatis dari angkanya). */
const FormSesuai = ({ loan, onKetik }) => {
  const [sisa, setSisaAsli] = useState('');
  const setSisa = (v) => {
    setSisaAsli(v);
    onKetik(v);
  };
  const [catatan, setCatatan] = useState('');
  const [proses, setProses] = useState(false);

  const simpan = () =>
    router.post(
      route('migrasi.penyesuaian_saldo_simpan'),
      { loan_id: loan.id, sisa_saldo: sisa, catatan },
      {
        preserveScroll: true,
        onStart: () => setProses(true),
        onFinish: () => setProses(false),
        onSuccess: () => {
          setSisa('');
          setCatatan('');
        },
      },
    );

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <CurrencyInput
        className="w-32 h-8 px-2 text-sm text-right border rounded-md tabular-nums border-input"
        allowDecimals={false}
        allowNegativeValue={false}
        groupSeparator="."
        decimalSeparator=","
        placeholder="sisa saldo"
        value={sisa}
        onValueChange={(v) => setSisa(v ?? '')}
      />
      <input
        className="w-36 h-8 px-2 text-sm border rounded-md border-input"
        placeholder="catatan"
        value={catatan}
        onChange={(e) => setCatatan(e.target.value)}
      />
      <Button size="sm" className="h-8" disabled={proses || sisa === ''} onClick={simpan}>
        Simpan
      </Button>
    </div>
  );
};

const NasabahMacet = ({ datas = [], ringkasan, server_filter }) => {
  const f = server_filter ?? {};
  const ganti = (kunci, nilai) =>
    router.get(route('migrasi.nasabah_macet'), { kelompok: f.kelompok, hari: f.hari, [kunci]: nilai });

  // Pratinjau: sisa saldo yang sedang diketik (belum disimpan) per pinjaman.
  // Selisihnya dengan saldo sekarang menggeser ML data real, jadi Z ikut bergeser.
  const [ketik, setKetik] = useState({});
  const geser = datas.reduce((t, d) => (ketik[d.id] ? t + (Number(ketik[d.id]) - d.saldo_kini) : t), 0);
  const zSesudah = ringkasan?.z == null ? null : ringkasan.z - geser;

  return (
    <>
      <Head title="Nasabah Macet" />

      <div className="p-4 space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <Link
              href={route('migrasi.kesiapan')}
              className="inline-flex items-center gap-1 mb-1 text-xs font-medium text-slate-500 hover:text-slate-800"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Kesiapan Migrasi
            </Link>
            <h1 className="text-lg font-semibold text-slate-900">Nasabah Macet — {f.unit}</h1>
            <p className="max-w-3xl mt-1 text-sm text-slate-600">
              Pinjaman ember ML ({dayjs(f.periode).format('MMMM YYYY')}) yang belum lunas. Ketik <b>sisa saldo
              seharusnya</b> (sekarang) untuk menyesuaikan; selisihnya masuk tabel penyesuaian dan berlaku{' '}
              {dayjs(f.periode).format('MMMM YYYY')}, jadi ikut saldo awal di Kesiapan Migrasi. Lebih besar dari
              saldo sekarang = saldo ditambah, lebih kecil = dikurangi; langsung berlaku.
            </p>
          </div>
          <div className="flex items-end gap-2">
            <div>
              <label className="block mb-1 text-xs font-medium text-slate-600">Kelompok</label>
              <select className={PILIH} value={f.kelompok} onChange={(e) => ganti('kelompok', e.target.value)}>
                {(f.daftar_kelompok ?? []).map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 text-xs font-medium text-slate-600">Hari</label>
              <select className={`${PILIH} capitalize`} value={f.hari} onChange={(e) => ganti('hari', e.target.value)}>
                {HARI.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <Kartu judul="ML data real" utama={ringkasan?.sistem?.ml ?? 0} />
          <Kartu judul="ML bucket" utama={ringkasan?.lama?.ml} />
          <Kartu
            judul="Z (bucket − data real)"
            utama={ringkasan?.z}
            nada={nadaZ(ringkasan?.z)}
          >
            {geser !== 0 && zSesudah !== null && (
              <div className="pt-2 mt-2 text-sm border-t border-slate-100">
                <span className="text-slate-500">Sesudah isian ({geser > 0 ? '+' : ''}{rp(geser)}): </span>
                <span className={`font-semibold tabular-nums ${nadaZ(zSesudah)}`}>{rp(zSesudah)}</span>
                {zSesudah === 0 && <span className="ml-1 text-emerald-700">pas</span>}
              </div>
            )}
          </Kartu>
        </div>

        <div className="overflow-x-auto bg-white border rounded-lg">
          <Table className="text-sm">
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="px-2">Nasabah</TableHead>
                <TableHead className="px-2">Drop</TableHead>
                <TableHead className="px-2 text-right">Pinjaman</TableHead>
                <TableHead className="px-2 text-right">Angsuran</TableHead>
                <TableHead className="px-2 text-right">Pemutihan</TableHead>
                <TableHead className="px-2 text-right">Saldo 31 {dayjs(f.periode).subtract(1, 'day').format('MMM')}</TableHead>
                <TableHead className="px-2 text-right">Saldo sekarang</TableHead>
                <TableHead className="px-2">Penyesuaian</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {datas.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="py-6 text-center text-slate-500">
                    Tidak ada nasabah ML yang belum lunas di kelompok & hari ini.
                  </TableCell>
                </TableRow>
              )}
              {datas.map((d) => (
                <TableRow key={d.id} className="align-top">
                  <TableCell className="px-2 py-2">
                    <div className="font-medium">{d.nama}</div>
                    <div className="text-xs text-slate-500">{d.nik}</div>
                  </TableCell>
                  <TableCell className="px-2 py-2 whitespace-nowrap">{dayjs(d.drop_date).format('DD-MM-YYYY')}</TableCell>
                  <TableCell className="px-2 py-2 text-right tabular-nums">{rp(d.pinjaman)}</TableCell>
                  <TableCell className="px-2 py-2 text-right tabular-nums">{rp(d.angsuran)}</TableCell>
                  <TableCell className="px-2 py-2 text-right tabular-nums">{d.pemutihan ? rp(d.pemutihan) : '–'}</TableCell>
                  <TableCell className="px-2 py-2 text-right tabular-nums">{rp(d.saldo_awal)}</TableCell>
                  <TableCell className="px-2 py-2 font-semibold text-right tabular-nums">{rp(d.saldo_kini)}</TableCell>
                  <TableCell className="px-2 py-2 space-y-1.5">
                    {d.penyesuaian.map((a, i) => (
                      <div key={i} className="text-xs">
                        {a.jenis.replace('_', ' ')}{' '}
                        <span className="font-semibold tabular-nums">
                          {a.efek > 0 ? '+' : ''}
                          {rp(a.efek)}
                        </span>
                      </div>
                    ))}
                    {d.boleh ? (
                      <FormSesuai
                        loan={d}
                        onKetik={(v) => setKetik((k) => ({ ...k, [d.id]: v }))}
                      />
                    ) : (
                      <div className="text-xs text-slate-500">
                        Drop sesudah {dayjs(f.batas_penyesuaian).format('DD MMM YYYY')} — betulkan lewat input angsuran.
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default NasabahMacet;
