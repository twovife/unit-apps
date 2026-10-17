import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { router, usePage } from '@inertiajs/react';
import { Check, Lock, LockOpen, PanelRightOpen, X } from 'lucide-react';
import { angka, useModeRibuan } from '@/lib/modeAngka';
import { Button } from '@/shadcn/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';

// Rekap 1 (dan Rekap per Mantri): angka dalam ribuan. Urutan kolom mengikuti
// buku kasir: kasbon s/d tunai, titipan 9%, SU Lapangan, Sisa Uang,
// lalu -/+.
const GRUP = [
  {
    judul: 'REKAP 1',
    kolom: [
      ['kasbon', 'Kasbon'],
      ['storting', 'Storting'],
      ['do11', 'DO 11%'],
      ['debit', 'Debit'],
      ['drop', 'Drop'],
      ['transport', 'Transport'],
      ['kredit', 'Kredit'],
      ['tunai', 'Tunai', 'font-semibold'],
    ],
  },
  { judul: '', kolom: [['titipan9', 'Titipan 9%']] },
  // Titipan 9% + Tunai.
  { judul: '', kolom: [['sisa_uang', 'Sisa Uang', 'font-semibold']] },
  // Grup STORTING (cash / transfer / katrol) disembunyikan dulu (mas
  // 2026-10-09); datanya masih dikirim server: storting_cash/_transfer/_katrol.
  // Uang yang dibawa pulang mantri (setoran_tunai).
  { judul: '', kolom: [['su_lapangan', 'SU Lapangan', 'font-semibold']] },
  // Setoran lewat transfer (setoran_transfer).
  { judul: '', kolom: [['setoran_transfer', 'Setor Transfer']] },
  // Katrolan diketik kasir (setoran_katrol), ikut -/+.
  { judul: '', kolom: [['setoran_katrol', 'Katrolan']] },
  // SU Lapangan - Sisa Uang: merah = kurang, hijau = lebih.
  { judul: '', kolom: [['selisih_uang', '-/+', 'font-bold', true]] },
];
const KOLOM = GRUP.flatMap((g) => g.kolom);
// Warna blok kolom hanya di baris total: Kasbon s/d Tunai kuning, Sisa Uang
// hijau, -/+ merah, sisanya biru. Isi & kepala tabel netral (mas 2026-10-12:
// blok warna terlalu mencolok).
const NETRAL = 'bg-white group-even:bg-slate-50 group-hover:bg-sky-50';
const KEPALA = 'bg-slate-100 text-slate-700';
// Warna kepala asli untuk layar yang tetap berwarna (Rencana Drop).
export const WARNA_KEPALA = {
  kuning: 'bg-amber-200 text-amber-900',
  hijau: 'bg-emerald-200 text-emerald-900',
  merah: 'bg-rose-200 text-rose-900',
  biru: 'bg-sky-200 text-sky-900',
};
export const WARNA = {
  kuning: { sel: NETRAL, kepala: KEPALA, total: 'bg-amber-200' },
  hijau: { sel: NETRAL, kepala: KEPALA, total: 'bg-emerald-200' },
  merah: { sel: NETRAL, kepala: KEPALA, total: 'bg-rose-200' },
  biru: { sel: NETRAL, kepala: KEPALA, total: 'bg-sky-200' },
};
const WARNA_KOLOM = {
  // Bawaan biru untuk kolom yang tidak disebut di bawah.
  ...Object.fromEntries(KOLOM.map(([k]) => [k, WARNA.biru])),
  ...Object.fromEntries(GRUP[0].kolom.map(([k]) => [k, WARNA.kuning])),
  sisa_uang: WARNA.hijau,
  selisih_uang: WARNA.merah,
};
// Kolom yang bisa diisi kasir -> nama kolom di daily_closings.
// Rekap 1: kasir mengisi kasbon, transport, SU Lapangan, setor transfer.
// Angka bawaan setoran yang belum diisi kasir: storting hari itu per cara
// bayar. Tampil abu-abu miring; dibekukan saat kunci kasir.
const BAWAAN = { su_lapangan: 'storting_cash', setoran_transfer: 'storting_transfer', setoran_katrol: 'storting_katrol' };
// Kolom yang hanya ada di alur baru; kantor belum migrasi tidak menampilkannya.
const KHUSUS_MIGRASI = ['sisa_uang', 'su_lapangan', 'setoran_transfer', 'setoran_katrol', 'selisih_uang'];
// Isian yang tersedia untuk kantor belum migrasi.
const ISI_LAMA = ['kasbon', 'transport'];
const KOLOM_ISI = {
  kasbon: 'kasbon',
  transport: 'transport',
  su_lapangan: 'setoran_tunai',
  setoran_transfer: 'setoran_transfer',
  setoran_katrol: 'setoran_katrol',
};

// Kosong = 0 (mas 2026-10-12); tanda – hanya untuk hari yang belum tiba.
const Angka = ({ n, bertanda = false, belum = false }) => {
  useModeRibuan();
  if (belum) return <span className="text-slate-300">–</span>;
  if (!Number(n)) return <span className="text-slate-400">0</span>;
  if (!bertanda) return angka(n);
  return (
    <span className={Number(n) < 0 ? 'text-red-600' : 'text-emerald-700'}>{Number(n) > 0 ? '+' : ''}{angka(n)}</span>
  );
};

/**
 * Kotak isian kasir di Rekap 1 (kasbon, transport, SU Lapangan, setor
 * transfer): memenuhi sel, untuk kantor alur baru & hari belum dikunci.
 * Diketik dalam RIBUAN (200 = 200.000, 37,5 = 37.500); "000" tampil sebagai
 * akhiran saat kotak sedang diisi. Bawaan & kosong = 0. Enter / pindah kotak menyimpan, hanya kalau
 * kasir benar-benar mengetik.
 */
const IsianSel = ({ r, k, kolom, kuning = false }) => {
  // Mode rupiah penuh (saklar header): akhiran .000 selalu tampil supaya isian
  // (tetap diketik dalam ribuan) tidak terbaca 1000x lebih kecil dari sel lain.
  const penuh = !useModeRibuan();
  const keRibu = (v) => (v ? Number(v) / 1000 : 0);
  // Belum diisi kasir -> angka bawaan dari angsuran (kalau kolom ini punya).
  const pakaiBawaan = (r[k] === null || r[k] === undefined) && BAWAAN[k];
  const awal = keRibu(pakaiBawaan ? r[BAWAAN[k]] : r[k]);
  const [nilai, setNilai] = useState(awal);
  const [diketik, setDiketik] = useState(false);
  useEffect(() => {
    setNilai(awal);
    setDiketik(false);
  }, [r[k], pakaiBawaan ? r[BAWAAN[k]] : null]);
  const simpan = () => {
    if (!diketik) return;
    setDiketik(false);
    const baru = Math.round((nilai === '' ? 0 : Number(nilai)) * 1000);
    if (baru === Number(r[k] ?? 0)) return;
    router.post(
      route('kasir.rekap.simpan_su_lapangan'),
      { id: r.id, date: r.tanggal, kolom, nilai: baru },
      { preserveScroll: true, preserveState: true },
    );
  };
  return (
    <div className="relative h-full">
      <input
        type="number"
        min={0}
        step="any"
        inputMode="decimal"
        placeholder="0"
        onFocus={(e) => e.currentTarget.select()}
        title={pakaiBawaan && !diketik ? 'Angka sistem (dari angsuran) — belum dikonfirmasi kasir' : undefined}
        className={`${pakaiBawaan && !diketik ? 'italic text-slate-400' : ''} peer block w-full h-full min-w-[7rem] py-1.5 pl-2 ${penuh ? 'pr-9' : 'pr-2'} focus:pr-9 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none text-right text-sm ${kuning ? 'bg-transparent' : 'bg-sky-50/60'} border-0 rounded-none outline-none tabular-nums focus:bg-white focus:ring-2 focus:ring-inset focus:ring-sky-500`}
        value={nilai}
        onChange={(e) => {
          setNilai(e.target.value);
          setDiketik(true);
        }}
        onBlur={simpan}
        onKeyDown={(e) => {
          if (e.key === 'Enter') e.currentTarget.blur();
          if (e.key === 'Escape') {
            setNilai(awal);
            setDiketik(false);
          }
        }}
      />
      {/* Akhiran .000 saat mengetik; di mode rupiah penuh selalu. */}
      <span className={`absolute ${penuh ? 'block' : 'hidden'} text-xs -translate-y-1/2 pointer-events-none right-2 top-1/2 text-slate-400 peer-focus:block`}>.000</span>
    </div>
  );
};

const TableRekapKasir = ({ datas = [], bacaSaja = false, onKlikKelompok = null, onKlikStorting = null, onKlikDrop = null, onKunci = null }) => {
  const { auth, server_filter } = usePage().props;
  const hariIni = dayjs().format('YYYY-MM-DD');

  const [barisBukaKunci, setBarisBukaKunci] = useState(null);
  const [alasanBuka, setAlasanBuka] = useState('');
  const [prosesBuka, setProsesBuka] = useState(false);

  // Superuser / can-edit yang boleh membuka kunci rekap
  const bolehBukaKunci = Boolean(
    auth?.roles?.includes('superuser') || auth?.permissions?.includes('can-edit')
  );

  const handleBukaKunci = () => {
    if (!barisBukaKunci || alasanBuka.trim().length < 5) return;
    router.post(
      route('kasir.rekap.buka_kunci'),
      { id: barisBukaKunci.id, date: barisBukaKunci.tanggal, alasan: alasanBuka.trim() },
      {
        preserveScroll: true,
        onStart: () => setProsesBuka(true),
        onFinish: () => setProsesBuka(false),
        onSuccess: () => {
          setBarisBukaKunci(null);
          setAlasanBuka('');
        },
      }
    );
  };

  // Kunci / TTD kasir: hanya kasir & pimpinan (+ superuser); hari ini mulai jam_kunci WIB.
  // Server memeriksa ulang dengan jam server (zona Asia/Jakarta).
  const bolehKunci = ['kasir', 'pimpinan', 'superuser'].some((x) => auth?.roles?.includes(x));
  const kunciBelumJam = (r) =>
    !!server_filter?.jam_kunci &&
    dayjs(r.tanggal).format('YYYY-MM-DD') === hariIni &&
    dayjs().format('HH:mm') < server_filter.jam_kunci;
  const belum = (r) => !!r.tanggal && dayjs(r.tanggal).format('YYYY-MM-DD') > hariIni;
  // Angka yang bisa diklik -> drawer buku-nya, tanggal ini disorot.
  const KLIK = {
    storting: [onKlikStorting, 'Buka buku angsuran, tanggal ini disorot'],
    drop: [onKlikDrop, 'Buka buku drop, tanggal ini disorot'],
  };
  // Kantor belum migrasi (mas 2026-10-12): kolom setoran tidak ada, kasir
  // hanya mengisi kasbon & transport (disimpan ke tabel lama).
  const migrasi = !!server_filter?.migrasi;
  const KOLOM_TAMPIL = migrasi ? KOLOM : KOLOM.filter(([k]) => !KHUSUS_MIGRASI.includes(k));
  // Sel isian aktif: baris harian. Alur baru: sampai dikunci kasir. Kantor
  // lama: TTD kasir hanya tanda tangan, kasbon & transport tetap bisa diedit.
  const bisaIsi = (r, k) =>
    !bacaSaja &&
    !!KOLOM_ISI[k] &&
    (migrasi ? !r.status_approve_kasir : ISI_LAMA.includes(k)) &&
    r.type == 'daily' && auth?.permissions?.includes('can-approve');
  const total = Object.fromEntries(
    KOLOM.map(([k]) => [k, datas.reduce((a, r) => a + (Number(r[k]) || 0), 0)]),
  );

  const terkunci = server_filter?.migrasi && !bacaSaja ? datas.filter((r) => r.type == 'daily' && r.status_approve_kasir).length : 0;

  return (
    <>
    {terkunci > 0 && (
      <div className="p-2 mb-2 text-sm border rounded-md border-slate-300 bg-slate-50 text-slate-700">
        {terkunci === datas.length
          ? 'Tanggal ini sudah dikunci kasir — isian tidak bisa diubah.'
          : `${terkunci} kelompok sudah dikunci kasir — isiannya tidak bisa diubah.`}
      </div>
    )}
    <div className="overflow-x-auto bg-white border rounded-lg">
      <table className="w-full text-sm tabular-nums">
        <thead className="sticky top-0 z-10 bg-slate-100 text-slate-700">
          <tr>
            {/* Rekap per mantri: baris = tanggal, bukan kelompok. */}
            <th className={`sticky left-0 z-20 px-3 py-2 text-left ${WARNA.biru.kepala}`}>
              {datas.length && datas.every((r) => r.type != 'daily') ? 'Tanggal' : 'Kelompok'}
            </th>
            {KOLOM_TAMPIL.map(([k, label]) => (
              <th
                key={k}
                className={`px-3 py-2 font-medium text-right whitespace-nowrap ${WARNA_KOLOM[k]?.kepala ?? ''}`}
              >
                {label}
              </th>
            ))}
            {onKunci && <th className="px-3 py-2 font-medium text-center whitespace-nowrap">Kunci</th>}
            {onKunci && <th className="px-3 py-2 font-medium text-center whitespace-nowrap">ACC KM</th>}
          </tr>
        </thead>
        <tbody>
          {datas.length === 0 && (
            <tr>
              <td colSpan={KOLOM_TAMPIL.length + 1 + (onKunci ? 2 : 0)} className="py-6 text-center text-slate-500">
                Belum ada data.
              </td>
            </tr>
          )}
          {datas.map((r, i) => (
            <tr key={i} className="bg-white border-t group even:bg-slate-50 hover:bg-sky-50">
              <td className={`sticky left-0 px-3 py-1.5 font-medium text-left whitespace-nowrap ${WARNA.biru.sel}`}>
                {r.type != 'daily' ? (
                  dayjs(r.tanggal).format('DD-MM')
                ) : onKlikKelompok ? (
                  <button
                    type="button"
                    onClick={() => onKlikKelompok(r)}
                    className="inline-flex items-center gap-1 font-semibold text-sky-700 hover:text-sky-900 hover:underline"
                    title="Detail tunai per hari kelompok ini"
                  >
                    {r.kelompok}
                    <PanelRightOpen className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                ) : (
                  r.kelompok
                )}
              </td>
              {KOLOM_TAMPIL.map(([k, , kelas, bertanda]) => (
                <td
                  key={k}
                  className={`${bisaIsi(r, k) ? 'p-0' : 'px-3 py-1.5'} text-right ${WARNA_KOLOM[k]?.sel ?? ''} ${kelas ?? ''}`}
                >
                  {bisaIsi(r, k) ? (
                    <IsianSel r={r} k={k} kolom={KOLOM_ISI[k]} kuning={!!WARNA_KOLOM[k]} />
                  ) : KLIK[k]?.[0] ? (
                    <button
                      type="button"
                      onClick={() => KLIK[k][0](r)}
                      className="text-sky-700 underline decoration-dotted hover:text-sky-900"
                      title={KLIK[k][1]}
                    >
                      <Angka n={r[k]} belum={belum(r)} />
                    </button>
                  ) : (
                    <Angka n={r[k]} bertanda={bertanda} belum={belum(r)} />
                  )}
                </td>
              ))}
              {onKunci && (
                <td className="px-2 py-1 text-center">
                  {r.type != 'daily' ? null : r.status_approve_kasir ? (
                    bolehBukaKunci ? (
                      <button
                        type="button"
                        onClick={() => {
                          setBarisBukaKunci(r);
                          setAlasanBuka('');
                        }}
                        title="Terkunci — Klik untuk Buka Kunci (Superuser)"
                        className="inline-flex items-center gap-1 h-7 px-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-300 rounded-md cursor-pointer transition-colors"
                      >
                        <Lock className="w-3.5 h-3.5 text-rose-600" />
                        <span>Terkunci</span>
                      </button>
                    ) : (
                      <span
                        title="Terkunci"
                        className="inline-flex items-center gap-1 h-7 px-2 text-xs font-medium text-slate-600 bg-slate-100 rounded-md"
                      >
                        <Lock className="w-3.5 h-3.5 text-slate-500" />
                        <span>Terkunci</span>
                      </span>
                    )
                  ) : (
                    <button
                      type="button"
                      disabled={!bolehKunci || kunciBelumJam(r)}
                      title={
                        !bolehKunci
                          ? 'Hanya kasir dan pimpinan'
                          : kunciBelumJam(r)
                            ? `Hari ini baru bisa dikunci mulai jam ${server_filter?.jam_kunci} WIB`
                            : undefined
                      }
                      onClick={() => onKunci(r)}
                      className="inline-flex items-center gap-1 h-7 px-2 text-xs font-semibold text-white rounded-md bg-slate-800 hover:bg-slate-700 disabled:opacity-40 cursor-pointer"
                    >
                      <LockOpen className="w-3.5 h-3.5" />
                      Kunci
                    </button>
                  )}
                </td>
              )}
              {/* ACC KM: centang = KM sudah mengecek; silang = belum, termasuk ACC
                  otomatis saat kunci / TTD kasir (alurnya tetap, tampilannya silang). */}
              {onKunci && (
                <td className="px-2 py-1 text-center">
                  {r.type != 'daily' ? null : r.status_approve_kepala && !r.kepala_otomatis ? (
                    <Check className="inline w-4 h-4 text-emerald-600" aria-label="Sudah ACC KM" />
                  ) : (
                    <X
                      className="inline w-4 h-4 text-rose-500"
                      aria-label={r.kepala_otomatis ? 'Belum dicek KM (ACC otomatis saat kunci / TTD)' : 'Belum ACC KM'}
                    />
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
        {datas.length > 0 && (
          <tfoot className="font-bold border-t-2 bg-slate-100 text-slate-900">
            <tr>
              <td className={`sticky left-0 px-3 py-2 text-left ${WARNA.biru.total}`}>Total</td>
              {KOLOM_TAMPIL.map(([k, , , bertanda]) => (
                <td key={k} className={`px-3 py-2 text-right ${WARNA_KOLOM[k]?.total ?? ''}`}>
                  <Angka n={total[k]} bertanda={bertanda} />
                </td>
              ))}
              {onKunci && <td />}
              {onKunci && <td />}
            </tr>
          </tfoot>
        )}
      </table>
    </div>

    {/* Dialog Buka Kunci untuk Superuser */}
    <Dialog open={!!barisBukaKunci} onOpenChange={(o) => !o && !prosesBuka && setBarisBukaKunci(null)}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-rose-700">
            <LockOpen className="w-5 h-5 text-rose-600" />
            Buka Kunci Rekap
          </DialogTitle>
          <DialogDescription>
            Buka kunci Rekap 1 untuk kelompok{' '}
            <strong className="text-slate-900">{barisBukaKunci?.kelompok}</strong> tanggal{' '}
            <strong className="text-slate-900">
              {barisBukaKunci?.tanggal ? dayjs(barisBukaKunci.tanggal).format('dddd, DD MMMM YYYY') : ''}
            </strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="py-2 space-y-3">
          <div className="p-3 text-xs border rounded-lg border-amber-200 bg-amber-50 text-amber-900">
            Setelah kunci dibuka, isian setoran/kasbon dan status transaksi kelompok ini dapat diubah kembali.
          </div>
          <div>
            <label className="block mb-1 text-xs font-medium text-slate-700">
              Alasan Buka Kunci <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={alasanBuka}
              onChange={(e) => setAlasanBuka(e.target.value)}
              placeholder="Tuliskan alasan mengapa kunci dibuka (min. 5 karakter)..."
              className="w-full px-3 py-2 text-sm border rounded-md border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            {alasanBuka.length > 0 && alasanBuka.trim().length < 5 && (
              <p className="mt-1 text-xs text-rose-500">Alasan minimal 5 karakter.</p>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            disabled={prosesBuka}
            onClick={() => {
              setBarisBukaKunci(null);
              setAlasanBuka('');
            }}
          >
            Batal
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={prosesBuka || alasanBuka.trim().length < 5}
            onClick={handleBukaKunci}
          >
            {prosesBuka ? 'Membuka...' : 'Buka Kunci'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
};

export default TableRekapKasir;
