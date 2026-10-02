import React from 'react';
import BargeStatus from '@/Components/shadcn/BargeStatus';

// Angka dalam ribuan, sama dengan Buku Angsuran mobile.
const ribuan = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 1 });
const rb = (v) => ribuan.format((Number(v) || 0) / 1000);
const jumlah = (rows, key) => rows.reduce((t, r) => t + (Number(r[key]) || 0), 0);

const KOLOM = 'grid grid-cols-[1fr_5rem_4.5rem] gap-x-2 items-center px-2 tabular-nums';

// Buku storting per hari ini: storting (angsuran masuk) dan MD (pemutihan) pada
// tanggal terpilih, per bulan drop. Tombol Approval Akhir Bulan sengaja tidak
// ada di versi mobile: komponen ini tidak menghitung saldo, sehingga approval dari
// sini mengirim saldo awal bulan depan = 0.
const BukuStortingMobile = ({ datas }) => {
  const grup = datas ?? [];
  const semua = grup.flatMap((g) => g.data);

  return (
    <div className="text-xs">
      <div className="px-2 pb-1 text-[10px] text-gray-500">Angka dalam ribuan · MD = pemutihan hari ini</div>

      <div className={`${KOLOM} py-1.5 text-gray-500 bg-gray-100 border-y`}>
        <div>Bulan</div>
        <div className="text-right">Storting hari ini</div>
        <div className="text-right">MD</div>
      </div>

      {grup.map((g, i) => (
        <div key={i} className={`${KOLOM} py-2 border-b`}>
          <div className="flex items-center min-w-0 gap-1.5">
            <BargeStatus value={g.type2} />
            <span className="truncate">{g.month}</span>
          </div>
          <div className="text-sm font-bold text-right text-green-700">{rb(jumlah(g.data, 'angs_today'))}</div>
          <div className="text-right">{rb(jumlah(g.data, 'md_hari_ini'))}</div>
        </div>
      ))}

      <div className={`${KOLOM} py-2 font-bold text-white bg-gray-900`}>
        <div>TOTAL</div>
        <div className="text-base text-right text-green-300">{rb(jumlah(semua, 'angs_today'))}</div>
        <div className="text-right">{rb(jumlah(semua, 'md_hari_ini'))}</div>
      </div>
    </div>
  );
};

export default BukuStortingMobile;
