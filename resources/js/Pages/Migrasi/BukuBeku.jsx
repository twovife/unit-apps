import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import dayjs from 'dayjs';
import { UserPlus } from 'lucide-react';
import { Button } from '@/shadcn/ui/button';
import Angsuran from '@/Pages/NewAngsuran/Angsuran';
import DialogKoreksi, { KoreksiBekuContext } from './Components/DialogKoreksi';
import { angka, useModeRibuan } from '@/lib/modeAngka';

const KATEGORI = [
  ['lancar', 'Lancar'],
  ['cm', 'CM'],
  ['mb', 'MB'],
  ['ml', 'ML'],
];
const jumlah = (o) => (o ? Object.values(o).reduce((a, n) => a + (Number(n) || 0), 0) : null);

/**
 * Bucket serah terima bulan migrasi vs jumlah nasabah sekarang. Asli = sebelum
 * koreksi beku, sekarang = sesudah koreksi (bucket ikut digeser), nasabah = saldo
 * semua pinjaman per akhir bulan lalu (termasuk MACET LAMA).
 */
const BandingBucket = ({ b, kelompok, hari }) => {
  useModeRibuan();
  const rb = (n) => (n === null || n === undefined ? '—' : angka(n, { bulat: true }));
  const baris = [...KATEGORI, ['total', 'Total']].map(([k, label]) => {
    const ambil = (o) => (o ? (k === 'total' ? jumlah(o) : o[k]) : null);
    const s = ambil(b.sekarang);
    const n = ambil(b.nasabah);
    return { k, label, asli: ambil(b.asli), sekarang: s, nasabah: n, selisih: s === null ? null : n - s };
  });
  return (
    <div className="mb-3 overflow-x-auto bg-white border rounded-lg">
      <div className="px-3 py-2 text-sm font-semibold border-b bg-slate-50">
        Bucket {dayjs(b.periode).format('D MMM YYYY')} · kelompok {kelompok} · {hari}
      </div>
      <table className="w-full text-sm tabular-nums">
        <thead className="text-xs text-slate-600">
          <tr className="border-b">
            <th className="px-3 py-1.5 text-left font-medium">Kategori</th>
            <th className="px-3 py-1.5 text-right font-medium">Bucket asli (serah terima)</th>
            <th className="px-3 py-1.5 text-right font-medium">Bucket sekarang</th>
            <th className="px-3 py-1.5 text-right font-medium">Jumlah nasabah sekarang</th>
            <th className="px-3 py-1.5 text-right font-medium">Selisih (nasabah − bucket)</th>
          </tr>
        </thead>
        <tbody>
          {baris.map((r) => (
            <tr key={r.k} className={`border-b last:border-0 ${r.k === 'total' ? 'font-semibold bg-slate-50' : ''}`}>
              <td className="px-3 py-1.5">{r.label}</td>
              <td className="px-3 py-1.5 text-right text-slate-500">{rb(r.asli)}</td>
              <td className="px-3 py-1.5 text-right">{rb(r.sekarang)}</td>
              <td className="px-3 py-1.5 text-right">{rb(r.nasabah)}</td>
              <td className={`px-3 py-1.5 text-right ${r.selisih ? 'text-red-600 font-semibold' : 'text-emerald-700'}`}>
                {r.selisih === null ? '—' : r.selisih === 0 ? 'pas' : rb(r.selisih)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!b.sekarang && <div className="px-3 py-2 text-xs text-amber-800 bg-amber-50">{b.alasan.join(' ')}</div>}
    </div>
  );
};

/**
 * Buku Angsuran Beku (superuser): halaman /pinjaman yang sama persis (komponen
 * Angsuran), dibungkus KoreksiBekuContext - modal nasabah menampilkan tombol
 * koreksi untuk data sebelum migrasi. /pinjaman (client) tidak tersentuh.
 */
const BukuBeku = ({ datas, dateOfWeek, sirkulasi, beku }) => {
  const [buka, setBuka] = useState(null);
  const filter = { grouping_id: beku.grouping_id, kelompok: beku.kelompok, hari: beku.hari };

  return (
    <KoreksiBekuContext.Provider value={beku.mulai ? { mulai: beku.mulai, filter, macetLamaId: beku.macet_lama_id } : null}>
      <Head title="Buku Angsuran Beku" />
      {beku.mulai ? (
        <div className="p-2 mb-3 text-xs border rounded-md border-sky-300 bg-sky-50 text-sky-900">
          Mode koreksi data beku: data sebelum {dayjs(beku.mulai).format('DD MMM YYYY')} dikoreksi dari modal nasabah (tombol
          biru). Tiap koreksi dipratinjau, menghitung ulang saldo bulanan, dan tercatat di log.
        </div>
      ) : (
        <div className="p-2 mb-3 text-xs border rounded-md border-amber-300 bg-amber-50 text-amber-900">
          Kantor ini belum migrasi - tidak ada data beku. Ubah lewat menu biasa.
        </div>
      )}
      {beku.banding && <BandingBucket b={beku.banding} kelompok={beku.kelompok} hari={beku.hari} />}
      <Angsuran
        datas={datas}
        dateOfWeek={dateOfWeek}
        sirkulasi={sirkulasi}
        urlLink={route('migrasi.buku_beku')}
        localState={'migrasi_buku_beku'}
        judul="Buku Angsuran Beku"
        aksi={
          beku.mulai &&
          beku.grouping_id && (
            <Button size="sm" variant="outline" className="gap-1" onClick={() => setBuka({ aksi: 'tambah_pinjaman' })}>
              <UserPlus className="w-4 h-4" />
              Tambah nasabah
            </Button>
          )
        }
      />
      <DialogKoreksi buka={buka} onClosed={() => setBuka(null)} filter={filter} mulai={beku.mulai} />
    </KoreksiBekuContext.Provider>
  );
};

export default BukuBeku;
