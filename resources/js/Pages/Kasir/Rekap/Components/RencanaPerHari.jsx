import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import { Sisi, KIRI } from '@/Pages/Kasir/RencanaDrop/RencanaBersanding';
import { WARNA_KEPALA } from './TableRekapKasir';

const HARI = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];
const NAMA_HARI = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];
// Kolom Rencana = rencana yang diinput di tanggal itu untuk minggu depan.
const KOLOM = KIRI.map(([k, label, kelas]) => (k === 'rencana' ? ['p_rencana', 'Rencana', kelas] : [k, label, kelas]));

/**
 * Rekap Mantri - tab "Rencana Drop": satu kelompok, satu tabel per hari tagih,
 * dua kolom (Senin|Selasa, Rabu|Kamis, Jumat|Sabtu). Baris = tiap tanggal hari
 * itu di bulan ini. Data: props.rencana (getRencanaDropKepalaData satu kelompok).
 */
const RencanaPerHari = ({ rows = [], klik = {}, onAcc }) => {
  const hariIni = dayjs().format('YYYY-MM-DD');
  const perHari = useMemo(() => {
    const g = {};
    rows.forEach((r) => (g[NAMA_HARI[dayjs(r.tanggal).day()]] ??= []).push(r));
    return HARI.filter((h) => g[h]?.length).map((h) => ({ hari: h, rows: g[h] }));
  }, [rows]);

  if (!perHari.length) return <div className="py-6 text-sm text-center text-slate-500">Belum ada data.</div>;

  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {perHari.map(({ hari, rows: rs }) => (
        <Sisi
          key={hari}
          judul="Rencana Drop"
          subjudul={hari}
          rows={rs}
          kolom={KOLOM}
          // Tanggal sesudah hari ini belum punya isi -> kosongan.
          kosongBaris={(r) => r.tanggal > hariIni}
          klik={klik}
          warna={hari === 'senin' ? WARNA_KEPALA.merah : WARNA_KEPALA.biru}
          kolomKm
          onAcc={onAcc}
          kepalaPertama="Tanggal"
          isiPertama={(r) => dayjs(r.tanggal).format('DD-MM')}
          kunciBaris={(r) => r.tanggal}
        />
      ))}
    </div>
  );
};

export default RencanaPerHari;
