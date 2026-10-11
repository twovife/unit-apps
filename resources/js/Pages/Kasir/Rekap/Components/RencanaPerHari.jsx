import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import { Sisi, KIRI, KANAN } from '@/Pages/Kasir/RencanaDrop/RencanaBersanding';
import { WARNA } from './TableRekapKasir';

const HARI = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];
const NAMA_HARI = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];

/**
 * Rekap Mantri - tab "Rencana per Hari": satu kelompok, satu kartu per hari
 * tagih (Senin, Selasa, ...). Template sama dengan Rencana Drop: kiri = hari
 * D (tiap tanggal hari itu di bulan ini), kanan = pasangannya minggu depan.
 * Data: props.rencana (getRencanaDropKepalaData, disaring kelompok).
 */
const RencanaPerHari = ({ rows = [], klik = {}, onAcc }) => {
  const hariIni = dayjs().format('YYYY-MM-DD');
  const perHari = useMemo(() => {
    const g = {};
    rows.forEach((r) => (g[NAMA_HARI[dayjs(r.tanggal).day()]] ??= []).push(r));
    return HARI.filter((h) => g[h]?.length).map((h) => ({ hari: h, rows: g[h] }));
  }, [rows]);

  if (!perHari.length) return <div className="py-6 text-sm text-center text-slate-500">Belum ada data.</div>;

  // Tanggal sesudah hari ini belum punya isi -> kosongan (per baris).
  const kosongBaris = (r) => r.tanggal > hariIni;

  return (
    <div className="space-y-4">
      {perHari.map(({ hari, rows: rs }) => (
        <div key={hari} className="grid gap-2 p-2 border rounded-xl bg-slate-100 lg:grid-cols-2">
          <Sisi
            judul="Hari pengajuan"
            subjudul={hari}
            rows={rs}
            kolom={KIRI}
            kosongBaris={kosongBaris}
            klik={klik}
            warna={hari === 'senin' ? WARNA.merah.kepala : WARNA.biru.kepala}
            kolomKm
            onAcc={onAcc}
            kepalaPertama="Tanggal"
            isiPertama={(r) => dayjs(r.tanggal).format('DD-MM')}
            kunciBaris={(r) => r.tanggal}
          />
          <Sisi
            judul="Hari drop"
            subjudul={`${hari} minggu depan`}
            rows={rs}
            kolom={KANAN}
            kosongBaris={kosongBaris}
            klik={klik}
            warna={WARNA.hijau.kepala}
            // Target minggu depan dibanding target hari ini.
            banding={{ p_target: 'target' }}
            kepalaPertama="Tanggal"
            isiPertama={(r) => (r.pasangan ? dayjs(r.pasangan).format('DD-MM') : '—')}
            kunciBaris={(r) => r.tanggal}
          />
        </div>
      ))}
    </div>
  );
};

export default RencanaPerHari;
