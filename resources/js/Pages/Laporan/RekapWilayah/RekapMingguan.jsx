import { angka, useModeRibuan } from '@/lib/modeAngka';

const KOLOM = [
  ['drop', 'Drop'],
  ['storting', 'Storting'],
  ['angsuran_cm', 'Angs CM'],
  ['angsuran_mb', 'Angs MB'],
  ['angsuran_ml', 'Angs ML'],
  ['sirkulasi', 'Sirkulasi Akhir'],
];

const tgl = (t) => new Date(t + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });

/**
 * Rekap per minggu satu wilayah, dari angka yang SUDAH tersimpan.
 *
 * Minggu dipatok Senin s/d Minggu, dipotong batas bulan, jadi minggu pertama
 * dan terakhir bisa pendek. Mutasi dijumlah; sirkulasi akhir minggu diambil
 * dari baris terakhir tiap kantor, bukan dijumlah, karena sirkulasi sudah
 * kumulatif sejak awal bulan.
 *
 * Tiap minggu bisa dibuka untuk melihat rinciannya per kantor.
 */
export default function RekapMingguan({ minggu = [], unitKantor = {} }) {
  useModeRibuan();

  if (!minggu.length) {
    return null;
  }

  const th = 'whitespace-nowrap px-1.5 py-1 text-right text-[10px] font-semibold uppercase tracking-tight text-slate-500';

  return (
    <details className="rounded-lg border bg-white shadow-sm">
      <summary className="cursor-pointer list-none px-3 py-2 text-[12px] font-semibold [&::-webkit-details-marker]:hidden">
        Rekap Mingguan
        <span className="ml-2 font-normal text-slate-400">{minggu.length} minggu · klik untuk membuka</span>
      </summary>

      <div className="overflow-x-auto border-t">
        <table className="w-full text-[11px]">
          <thead className="bg-slate-100">
            <tr>
              <th className={`${th} text-left`}>Minggu</th>
              {KOLOM.map(([k, j]) => (
                <th key={k} className={th}>{j}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {minggu.map((m) => (
              <tr key={m.mulai} className="border-t align-top">
                <td className="px-1.5 py-1">
                  <details>
                    <summary className="cursor-pointer whitespace-nowrap font-medium">
                      Minggu {m.ke}
                      <span className="ml-1 font-normal text-slate-400">
                        {tgl(m.mulai)}–{tgl(m.sampai)}
                      </span>
                    </summary>
                    <ul className="mt-1 space-y-0.5 text-[10px] text-slate-500">
                      {Object.entries(m.kantor).map(([id, v]) => (
                        <li key={id} className="whitespace-nowrap tabular-nums">
                          {unitKantor[id] ?? id}: drop {angka(v.drop)} · storting {angka(v.storting)} · angs{' '}
                          {angka(v.angsuran_cm + v.angsuran_mb + v.angsuran_ml)} · sirkulasi {angka(v.sirkulasi)}
                        </li>
                      ))}
                    </ul>
                  </details>
                </td>
                {KOLOM.map(([k]) => (
                  <td key={k} className={`whitespace-nowrap px-1.5 py-1 text-right tabular-nums ${k === 'sirkulasi' ? 'font-semibold' : ''}`}>
                    {angka(m.total[k])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t-2 bg-slate-100 font-semibold">
            <tr>
              <td className="px-1.5 py-1">Sebulan</td>
              {KOLOM.map(([k]) => (
                <td key={k} className="whitespace-nowrap px-1.5 py-1 text-right tabular-nums">
                  {/* Sirkulasi bukan jumlah mingguan: yang berlaku angka minggu terakhir. */}
                  {angka(k === 'sirkulasi' ? minggu[minggu.length - 1].total[k] : minggu.reduce((t, m) => t + m.total[k], 0))}
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </details>
  );
}
