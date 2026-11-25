import React from 'react';
import dayjs from 'dayjs';
import { Link, usePage } from '@inertiajs/react';
import { LockOpen } from 'lucide-react';

/**
 * Hari sejak Oktober yang belum dikunci, walau sudah ganti bulan - menahan
 * kunci hari sesudahnya. Tiap tanggal menuju Rekap 1 tanggal
 * itu, tempat tombol Kunci-nya. Data: server_filter.hari_terbuka
 * (Gembok::hariTerbuka); alur lama: hari belum dikunci sejak Oktober
 * (Gembok::belumDikunciLama, jenis='belum').
 */
const BannerHariTerbuka = ({ hari = [], jenis = 'dibuka' }) => {
  const { server_filter: sf } = usePage().props;
  if (!hari.length) return null;

  // Satu tanggal bisa terbuka di beberapa kelompok -> dikelompokkan per tanggal.
  const perTanggal = hari.reduce((a, h) => ((a[h.tanggal] ??= []).push(h), a), {});

  return (
    <div className="p-3 mb-3 text-sm border rounded-lg border-amber-300 bg-amber-50 text-amber-900">
      <div className="flex items-center gap-2 mb-1 font-semibold">
        <LockOpen className="w-4 h-4" />
        {hari.length} kelompok-hari sejak Oktober belum dikunci kasir
      </div>
      <p className="mb-2 text-xs">
        {jenis === 'belum'
          ? 'Tanggal & kelompok ini ada transaksinya tapi belum di-TTD kasir. Klik tanggal, lalu Kunci.'
          : 'Selama masih terbuka, hari sesudahnya tidak bisa dikunci. Klik tanggal, lalu Kunci.'}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {Object.entries(perTanggal).map(([tanggal, isi]) => (
          <Link
            key={tanggal}
            href={route('kasir.rekap.rekap_satu', {
              date: tanggal,
              ...(sf.branch_id ? { branch_id: sf.branch_id } : {}),
              ...(sf.wilayah ? { wilayah: sf.wilayah } : {}),
            })}
            title={isi.map((h) => `Kel ${h.kelompok}: ${h.alasan ?? 'belum dikunci'}`).join('\n')}
            className="px-2 py-1 text-xs font-medium bg-white rounded-md ring-1 ring-amber-300 hover:bg-amber-100"
          >
            {dayjs(tanggal).format('ddd, DD-MM-YY')} · Kel {isi.map((h) => h.kelompok).join(', ')}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BannerHariTerbuka;
