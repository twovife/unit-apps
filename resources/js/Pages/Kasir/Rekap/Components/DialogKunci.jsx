import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { router } from '@inertiajs/react';
import { Lock, PenLine } from 'lucide-react';
import { Button } from '@/shadcn/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';
import { angka, useModeRibuan } from '@/lib/modeAngka';
import SatuanAngka from '@/Components/SatuanAngka';

const rb = (n) => angka(n, { bulat: true });
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

/** Satu pinjaman di dialog: nama + keterangan status, bisa diklik ke buku drop. */
const BarisPinjaman = ({ l, ket, onKlik }) => {
  const isi = (
    <div className="flex justify-between gap-3 py-0.5">
      <span className="text-slate-700">
        <span className={onKlik ? 'underline decoration-dotted' : ''}>{l.nama ?? '—'}</span>
        <span className="ml-1 text-xs text-slate-500">— {ket}</span>
      </span>
      <span className="tabular-nums">{angka(l.nominal, { bulat: true })}</span>
    </div>
  );
  return onKlik ? (
    <button type="button" onClick={onKlik} className="block w-full text-left rounded hover:bg-white/70">
      {isi}
    </button>
  ) : (
    isi
  );
};

/**
 * Dialog Kunci Rekap 1 (alur baru): keterangan rekap hari itu lengkap, storting
 * per ember, status cek KM, dan yang akan diproses otomatis saat dikunci -
 * drop hari ini yang menggantung -> gagal, ACC KM otomatis kalau belum dicek.
 * Pengajuan (drop minggu depan) tidak disentuh. Data dari
 * kasir.rekap.pratinjau_kunci; angka kas dari baris Rekap 1 (`baris`).
 */
const DialogKunci = ({ baris, onClosed, onBukaDrop = null }) => {
  useModeRibuan();
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
  // Kantor belum migrasi: dialog sama, tapi aksinya TTD kasir (tanpa kunci alur baru).
  const migrasi = isi?.migrasi !== false;
  const aksi = migrasi ? 'dikunci' : 'ditandatangani';

  return (
    <Dialog open={!!baris} onOpenChange={(o) => !o && !proses && onClosed()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Kunci Kelompok {baris?.kelompok} — {baris ? dayjs(baris.tanggal).format('dddd, DD MMMM YYYY') : ''}
          </DialogTitle>
          <DialogDescription>
            Sesudah dikunci, transaksi hari ini tidak bisa diubah.{' '}
            <SatuanAngka />
          </DialogDescription>
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
              {migrasi && (
                <>
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
                </>
              )}
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
                    <div className="mb-1 font-medium text-amber-900">Belum dicek KM — akan di-ACC otomatis saat {aksi}.</div>
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
              judul="Drop & pengajuan"
              warna={isi.drop_gantung.length ? 'border-rose-300 bg-rose-50 sm:col-span-2' : 'sm:col-span-2'}
            >
              {isi.drop_gantung.length ? (
                <>
                  <div className="mb-1 font-medium text-rose-800">
                    Drop hari ini belum di-DROP / GAGAL ({isi.drop_gantung.length}) → digagalkan:
                  </div>
                  {isi.drop_gantung.map((l) => (
                    <BarisPinjaman
                      key={l.id}
                      l={l}
                      ket={l.status === 'acc' ? 'sudah ACC, belum di-DROP / GAGAL' : 'belum di-ACC, belum di-DROP / GAGAL'}
                      onKlik={onBukaDrop && (() => onBukaDrop(baris))}
                    />
                  ))}
                </>
              ) : (
                <div className="text-slate-600">Tidak ada drop hari ini yang menggantung.</div>
              )}
              {isi.pengajuan_open.length > 0 && (
                <div className="pt-2 mt-2 border-t">
                  <div className="mb-1 font-medium text-amber-800">
                    Pengajuan minggu depan belum di-ACC ({isi.pengajuan_open.length}) — tidak disentuh, masih bisa di-ACC / tolak
                    sesudahnya:
                  </div>
                  {isi.pengajuan_open.map((l) => (
                    <BarisPinjaman
                      key={l.id}
                      l={l}
                      ket={`belum di-ACC · drop ${dayjs(l.drop_date).format('DD-MM')}`}
                      onKlik={onBukaDrop && (() => onBukaDrop({ ...baris, tanggal: l.drop_date }))}
                    />
                  ))}
                </div>
              )}
              {onBukaDrop && (isi.drop_gantung.length > 0 || isi.pengajuan_open.length > 0) && (
                <div className="mt-1 text-xs text-slate-500">Klik nama untuk membuka buku drop tanggal itu.</div>
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
            {proses ? 'Memproses…' : 'Ya, kunci'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogKunci;
