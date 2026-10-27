import React from 'react';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/shadcn/ui/button';
import { rp } from '@/lib/rupiah';

const KATEGORI = [
  ['lancar', 'Lancar'],
  ['cm', 'CM'],
  ['mb', 'MB'],
  ['ml', 'ML'],
];

const Selisih = ({ v }) =>
  v === 0 ? <span className="text-slate-300">0</span> : <span className={`font-semibold ${v > 0 ? 'text-emerald-700' : 'text-rose-600'}`}>{v > 0 ? '+' : ''}{rp(v)}</span>;

/**
 * Cek Selisih Migrasi (superuser): saldo awal bulan migrasi per kelompok x hari dibanding
 * bucket serah terima. Selisih ML -> tombol Sesuaikan MACET LAMA; lancar/CM/MB hanya
 * ditampilkan (cek manual). Logika: App\Helpers\SelisihMigrasi.
 */
export default function SelisihMigrasi({ semua_kantor, unit, migrasi, baris = [] }) {
  const ganti = (semua) => router.get(route('migrasi.selisih'), semua ? { semua_kantor: 1 } : {}, { preserveScroll: true });
  const sesuaikan = (b) => {
    const z = b.bucket.ml - b.sistem.ml;
    const arah = z > 0 ? `ditambah ${rp(z)}${b.macet_lama ? '' : ' (MACET LAMA baru dibuat)'}` : `dikurangi ${rp(-z)}`;
    if (!window.confirm(`${b.kantor} kel ${b.kelompok} ${b.hari}: MACET LAMA ${arah} supaya ML = bucket. Saldo bulanan tersimpan ikut disesuaikan. Lanjut?`)) return;
    router.post(route('migrasi.selisih_ml'), { grouping_id: b.grouping_id, hari: b.hari }, { preserveScroll: true });
  };

  return (
    <>
      <Head title="Cek Selisih Migrasi" />
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Cek Selisih Migrasi</h1>
          <p className="text-sm text-slate-500">
            Saldo awal bulan migrasi per kelompok & hari dibanding bucket serah terima. Hijau = sistem lebih besar, merah = sistem lebih kecil.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant={semua_kantor ? 'outline' : 'default'} size="sm" onClick={() => ganti(false)}>
            Kantor aktif{unit ? ` (${unit})` : ''}
          </Button>
          <Button variant={semua_kantor ? 'default' : 'outline'} size="sm" onClick={() => ganti(true)}>
            Semua kantor migrasi
          </Button>
        </div>
      </div>

      {!semua_kantor && !migrasi && (
        <div className="p-3 mb-3 text-sm rounded-md bg-amber-50 text-amber-800">Kantor aktif belum migrasi.</div>
      )}
      {baris.length === 0 && (semua_kantor || migrasi) && (
        <div className="p-3 text-sm rounded-md bg-emerald-50 text-emerald-800">Tidak ada selisih: semua saldo awal sama dengan bucket serah terima.</div>
      )}

      {baris.length > 0 && (
        <div className="overflow-x-auto bg-white border rounded-lg">
          <table className="w-full text-xs tabular-nums">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th rowSpan={2} className="px-2 py-1.5 text-left">Kantor</th>
                <th rowSpan={2} className="px-2 py-1.5">Kel</th>
                <th rowSpan={2} className="px-2 py-1.5 text-left">Hari</th>
                {KATEGORI.map(([k, label]) => (
                  <th key={k} colSpan={3} className="px-2 py-1 text-center border-l">{label}</th>
                ))}
                <th rowSpan={2} className="px-2 py-1.5 text-right border-l">MACET LAMA</th>
                <th rowSpan={2} className="px-2 py-1.5" />
              </tr>
              <tr>
                {KATEGORI.map(([k]) => (
                  <React.Fragment key={k}>
                    <th className="px-2 py-1 font-normal text-right border-l">Bucket</th>
                    <th className="px-2 py-1 font-normal text-right">Sistem</th>
                    <th className="px-2 py-1 font-normal text-right">Selisih</th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>
            <tbody>
              {baris.map((b) => (
                <tr key={`${b.grouping_id}-${b.hari}`} className="border-t">
                  <td className="px-2 py-1.5 whitespace-nowrap">{b.kantor}</td>
                  <td className="px-2 py-1.5 text-center">{b.kelompok}</td>
                  <td className="px-2 py-1.5 capitalize">{b.hari}</td>
                  {KATEGORI.map(([k]) => (
                    <React.Fragment key={k}>
                      <td className="px-2 py-1.5 text-right border-l">{rp(b.bucket[k])}</td>
                      <td className="px-2 py-1.5 text-right">{rp(b.sistem[k])}</td>
                      <td className="px-2 py-1.5 text-right">
                        <Selisih v={b.selisih[k]} />
                      </td>
                    </React.Fragment>
                  ))}
                  <td className="px-2 py-1.5 text-right border-l">{b.macet_lama ? rp(b.macet_lama.saldo) : '–'}</td>
                  <td className="px-2 py-1.5 text-right whitespace-nowrap">
                    {b.selisih.ml !== 0 ? (
                      <Button size="xs" variant="outline" onClick={() => sesuaikan(b)}>
                        Sesuaikan MACET LAMA
                      </Button>
                    ) : (
                      <span className="text-[11px] text-slate-500">cek manual</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
