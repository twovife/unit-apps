import React from 'react';
import dayjs from 'dayjs';

// Crash DALAM 1 KANTOR (dari history_branch). Kantor lain -> note saja, bukan
// di sini. Aturan:
//   - kelompok SAMA, hari BEDA  -> MERAH (rekening beda hari = crash)
//   - kelompok LAIN, kantor sama -> KUNING
//   (kelompok sama + hari sama = rekening yang sama / topup, bukan crash)
// MACET = status_id >= 3 (mb/ml) DAN belum lunas. Cuma penekanan pesan.
// Non-blocking: peringatan saja, input tetap boleh.
const isMacet = (r) => Number(r.status_id) >= 3 && r.lunas === 'belum_lunas';

export default function CrashAlert({ historyBranch = [], kelompok, tanggalDrop }) {
  if (!Array.isArray(historyBranch) || historyBranch.length === 0 || !kelompok) {
    return null;
  }

  const k = String(kelompok);
  const hari = tanggalDrop ? dayjs(tanggalDrop).day() : null; // 0..6, cocok Carbon dayOfWeek

  // Cuma rekening AKTIF (belum lunas) yang crash. Lunas lama diabaikan.
  const aktif = historyBranch.filter((r) => r.lunas === 'belum_lunas');

  const sameKelompok = aktif.filter((r) => String(r.kelompok) === k);
  const merah = sameKelompok.filter(
    (r) => hari === null || Number(r.day_num) !== hari,
  );
  const kuning = aktif.filter((r) => String(r.kelompok) !== k);

  const level = merah.length ? 'merah' : kuning.length ? 'kuning' : null;
  if (!level) return null;

  const rows = level === 'merah' ? merah : kuning;
  const adaMacet = rows.some(isMacet);

  const warna =
    level === 'merah'
      ? 'border-red-400 bg-red-50 text-red-800'
      : 'border-amber-400 bg-amber-50 text-amber-800';
  const judul =
    level === 'merah'
      ? `🔴 CRASH — NIK sudah ada di kelompok ${kelompok} kantor ini (hari lain)`
      : `🟡 Perhatian — NIK ada di kelompok lain kantor ini`;

  return (
    <div className={`mb-3 rounded-md border px-3 py-2 ${warna}`}>
      <div className="text-sm font-semibold">
        {judul}
        {adaMacet ? ' — ada yang MACET' : ''}
      </div>
      <ul className="mt-1 space-y-0.5 text-xs">
        {rows.map((r, i) => (
          <li key={i}>
            Kelompok {r.kelompok} · {r.day} · {r.status}
            {isMacet(r) ? ' · MACET' : ''} ·{' '}
            {r.lunas === 'lunas' ? 'lunas' : 'belum lunas'}
          </li>
        ))}
      </ul>
      <div className="mt-1 text-[11px] opacity-80">
        Boleh lanjut, tapi tekan crash dalam satu kantor.
      </div>
    </div>
  );
}
