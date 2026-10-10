import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { router } from '@inertiajs/react';
import { Lock } from 'lucide-react';
import { Button } from '@/shadcn/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';

const rb = (n) => new Intl.NumberFormat('id-ID').format(Math.round((Number(n) || 0) / 1000));
const EMBER = [
  ['month1', 'Month 1'],
  ['month2', 'Month 2'],
  ['ccm', 'CCM'],
  ['cm', 'CM'],
  ['mb', 'MB'],
  ['ml', 'ML'],
];

const Baris = ({ label, nilai, tebal = false, kelas = '' }) => (
  <div className={`flex justify-between gap-3 py-0.5 ${tebal ? 'font-semibold' : ''} ${kelas}`}>
    <span className="text-slate-600">{label}</span>
    <span className="tabular-nums">{nilai}</span>
  </div>
);

const Kotak = ({ judul, children, warna = 'border-slate-200' }) => (
  <section className={`p-3 text-sm border rounded-lg ${warna}`}>
    <h3 className="mb-1 text-xs font-semibold uppercase text-slate-500">{judul}</h3>
    {children}
  </section>
);

/**
 * Dialog Kunci Rekap 1 (alur baru): keterangan rekap hari itu lengkap, storting
 * per ember, status cek KM, dan yang akan diproses otomatis saat dikunci -
 * drop hari ini yang menggantung -> gagal, ACC KM otomatis kalau belum dicek.
 * Pengajuan (drop minggu depan) tidak disentuh. Data dari
 * kasir.rekap.pratinjau_kunci; angka kas dari baris Rekap 1 (`baris`).
 */
const DialogKunci = ({ baris, onClosed }) => {
  const [isi, setIsi] = useState(null);
  const [galat, setGalat] = useState(null);
  const [proses, setProses] = useState(false);

  useEffect(() => {
    setIsi(null);
    setGalat(null);
    if (!baris) return;
    const c = new AbortController();
    axios
      .get(route('kasir.rekap.pratinjau_kunci'), { params: { id: baris.id, date: baris.tanggal }, signal: c.signal })
      .then(({ data }) => setIsi(data))
      .catch((e) => !axios.isCancel(e) && setGalat('Data gagal dimuat.'));
    return () => c.abort();
  }, [baris]);

  const kunci = () =>
    router.post(
      route('kasir.rekap.kunci_hari'),
      { id: baris.id, date: baris.tanggal },
      {
        preserveScroll: true,
        onStart: () => setProses(true),
        onFinish: () => setProses(false),
        onSuccess: () => onClosed(),
      },
    );

  const bisa = isi && !isi.terkunci && !isi.penghalang;

  return (
    <Dialog open={!!baris} onOpenChange={(o) => !o && !proses && onClosed()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Kunci Kelompok {baris?.kelompok} — {baris ? dayjs(baris.tanggal).format('dddd, DD MMMM YYYY') : ''}
          </DialogTitle>
          <DialogDescription>Sesudah dikunci, transaksi hari ini tidak bisa diubah. Angka dalam ribuan.</DialogDescription>
        </DialogHeader>

        {galat && <div className="text-sm text-red-600">{galat}</div>}
        {!isi && !galat && <div className="text-sm text-slate-500">Memuat…</div>}

        {isi && baris && (
          <div className="grid gap-3 sm:grid-cols-2">
            <Kotak judul="Rekap hari ini">
              <Baris label="Kasbon" nilai={rb(baris.kasbon)} />
              <Baris label="Storting" nilai={rb(baris.storting)} />
              <Baris label="DO 11%" nilai={rb(baris.do11)} />
              <Baris label="Drop" nilai={rb(baris.drop)} />
              <Baris label="Transport" nilai={rb(baris.transport)} />
              <Baris label="Tunai" nilai={rb(baris.tunai)} tebal />
              <Baris label="Titipan 9%" nilai={rb(baris.titipan9)} />
              <Baris label="Sisa Uang" nilai={rb(baris.sisa_uang)} tebal />
              <Baris label="SU Lapangan" nilai={rb(baris.su_lapangan ?? baris.storting_cash)} />
              <Baris label="Setor Transfer" nilai={rb(baris.setoran_transfer ?? baris.storting_transfer)} />
              <Baris label="Katrolan" nilai={rb(baris.setoran_katrol ?? baris.storting_katrol)} />
              <Baris
                label="-/+"
                nilai={rb(baris.selisih_uang)}
                tebal
                kelas={Number(baris.selisih_uang) < 0 ? 'text-rose-700' : Number(baris.selisih_uang) > 0 ? 'text-emerald-700' : ''}
              />
            </Kotak>

            <div className="space-y-3">
              <Kotak judul="Storting per ember">
                {EMBER.map(([k, label]) => (
                  <Baris key={k} label={label} nilai={rb(isi.storting[k])} />
                ))}
                <Baris label="Total" nilai={rb(isi.storting.total)} tebal kelas="border-t mt-1 pt-1" />
              </Kotak>

              <Kotak
                judul="Cek KM"
                warna={isi.cek_km ? 'border-emerald-300 bg-emerald-50' : 'border-amber-300 bg-amber-50'}
              >
                {isi.cek_km ? (
                  <div className="text-emerald-800">Sudah dicek KM.</div>
                ) : (
                  <>
                    <div className="mb-1 font-medium text-amber-900">Belum dicek KM — akan di-ACC otomatis saat dikunci.</div>
                    <Baris label="Target" nilai={rb(isi.target)} />
                    <Baris label="Masuk (13% drop)" nilai={rb(isi.masuk)} />
                    <Baris label="Keluar" nilai={rb(isi.keluar)} />
                    <Baris
                      label={`Target ${isi.tanggal_depan ? dayjs(isi.tanggal_depan).format('DD-MM') : 'minggu depan'}`}
                      nilai={rb(isi.target_depan)}
                      tebal
                    />
                  </>
                )}
              </Kotak>
            </div>

            <Kotak
              judul="Diproses otomatis saat dikunci"
              warna={isi.drop_gantung.length ? 'border-rose-300 bg-rose-50 sm:col-span-2' : 'sm:col-span-2'}
            >
              {isi.drop_gantung.length ? (
                <>
                  <div className="mb-1 font-medium text-rose-800">
                    {isi.drop_gantung.length} drop hari ini belum sukses → digagalkan:
                  </div>
                  {isi.drop_gantung.map((l) => (
                    <Baris key={l.id} label={`${l.nama ?? '—'} (${l.status})`} nilai={rb(l.nominal)} />
                  ))}
                </>
              ) : (
                <div className="text-slate-600">Tidak ada drop menggantung.</div>
              )}
              {isi.pengajuan_open.length > 0 && (
                <div className="pt-1 mt-2 text-xs border-t text-slate-500">
                  {isi.pengajuan_open.length} pengajuan minggu depan masih open — tidak disentuh, masih bisa di-ACC / tolak
                  sesudah kunci.
                </div>
              )}
            </Kotak>

            {isi.penghalang && (
              <div className="p-3 text-sm font-medium border rounded-lg sm:col-span-2 border-rose-300 bg-rose-50 text-rose-800">
                Belum bisa dikunci: {isi.penghalang}
              </div>
            )}
          </div>
        )}

        <DialogFooter className="flex-row justify-between gap-2 sm:justify-between">
          <Button variant="outline" disabled={proses} onClick={onClosed}>
            Batal
          </Button>
          <Button disabled={!bisa || proses} onClick={kunci}>
            <Lock className="w-4 h-4" />
            {proses ? 'Mengunci…' : 'Ya, kunci'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogKunci;
