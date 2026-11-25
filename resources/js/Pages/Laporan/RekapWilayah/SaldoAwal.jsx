import { Wallet } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shadcn/ui/accordion';
import { angka, useModeRibuan } from '@/lib/modeAngka';
import { KOLOM_AWAL as KOLOM, nilai, persen, persenTeks, tandaSelisih } from './kolom';
import { IsianSel } from './TabelWilayah';

// Yang ikut ringkasan saat panel tertutup.
const RINGKAS = ['awal_sirkulasi', 'awal_cm', 'persen_cm', 'awal_mb', 'persen_mb', 'awal_ml', 'persen_ml'];

/**
 * Sirkulasi awal bulan satu wilayah. Tertutup menampilkan total wilayah saja;
 * dibuka menampilkan tiap kantor.
 *
 * Saldo awalnya dari Rekap 2 (transaction_monthly_closings untuk kantor alur
 * baru, transaction_sirculations untuk alur lama) dan tetap sepanjang bulan,
 * jadi tidak ikut berubah saat mutasi harian diketik.
 *
 * Drop bulan lalu dihitung dari transaction_loans, bukan dari
 * transaction_monthly_closings.drop: closing hanya ada sejak Oktober 2026 dan
 * tidak dipelihara untuk kantor alur lama (lihat spec §6).
 *
 * Empat kolom saldo (Sirkulasi, CM, MB, ML) BISA DIKETIK: itu saldo awal
 * versi laporan kantor, disimpan di regional_circulation_openings, satu baris
 * per kantor per bulan. Beda dari versi sistem ditandai merah, tidak
 * menghalangi simpan — persis aturan tabel harian.
 *
 * Kartu lipatnya Accordion shadcn, sama dengan "Saldo Awal Bulan" di Rekap 2.
 */
export default function SaldoAwal({ baris, bulan, bulanLalu, bulanCm, bulanMb, bolehUbah, onUbah, onCek, onBuka, onKantor, terbuka, onBukaPanel }) {
  useModeRibuan(); // ikut saklar ribuan di header

  const namaBulan = { lalu: bulanLalu, cm: bulanCm, mb: bulanMb };
  const total = (k) => baris.reduce((t, b) => t + Number(nilai(b, k) || 0), 0);

  // Persen total wilayah dari jumlah pembilang / jumlah penyebut, bukan
  // rata-rata persen tiap kantor.
  const selTotal = (c) => (c.bagi ? persenTeks(persen(total(c.atas), total(c.bagi))) : angka(total(c.k)));
  const selBaris = (b, c) =>
    c.bagi ? persenTeks(persen(Number(nilai(b, c.atas)), Number(nilai(b, c.bagi)))) : angka(nilai(b, c.k));

  const ket = (c) => c.ket ?? (c.bulan ? `Jumlah drop ${namaBulan[c.bulan] ?? '-'}` : undefined);

  return (
    // Dikendalikan induk: tombol "Awal" di deret tanggal membukanya. Radix
    // melepas isi panel yang tertutup, jadi yang tertutup tidak ikut tercetak.
    <Accordion
      type="single"
      collapsible
      id="sirkulasi-awal"
      value={terbuka ? 'awal' : ''}
      onValueChange={(v) => onBukaPanel?.(v === 'awal')}
      className="scroll-mt-36 overflow-hidden rounded-lg border bg-white"
    >
      <AccordionItem value="awal" className="border-b-0">
        {/* Kartu lipat yang sama dengan "Saldo Awal Bulan" di Rekap 2. */}
        <AccordionTrigger className="bg-slate-50 px-4 py-3 hover:bg-slate-100 hover:no-underline data-[state=open]:border-b">
          <span className="flex items-center gap-3 font-semibold text-slate-900">
            <Wallet className="h-5 w-5 shrink-0 text-sky-600" aria-hidden="true" />
            Saldo Awal {bulan}
          </span>
          <span className="ml-auto mr-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
            {KOLOM.filter((c) => RINGKAS.includes(c.k)).map((c) => (
              <span key={c.k} className="tabular-nums">
                {!c.bagi && <span className="text-slate-500">{c.j} </span>}
                <span className={c.bagi ? 'text-slate-400' : 'font-medium'}>
                  {c.bagi ? `(${selTotal(c)})` : selTotal(c)}
                </span>
              </span>
            ))}
          </span>
        </AccordionTrigger>

        <AccordionContent className="pb-0">
      <div className="overflow-x-auto">
        <table className="w-full text-xs tabular-nums">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Kantor</th>
              {KOLOM.map((c) => (
                <th key={c.k} title={ket(c)} className="whitespace-nowrap px-3 py-2 text-right font-medium">
                  {c.j}
                </th>
              ))}
              <th className="whitespace-nowrap border-l px-3 py-2 text-center font-medium">Staf Kontrol</th>
            </tr>
          </thead>
          <tbody>
            {baris.map((b) => (
              <tr key={b.branch_id} className="group border-t bg-white even:bg-slate-50 hover:bg-sky-50">
                <td className="whitespace-nowrap px-3 py-1 font-medium">
                  <button
                    type="button"
                    onClick={() => onKantor?.(b)}
                    title="Buka Rekap 2 kantor ini"
                    className="underline decoration-dotted underline-offset-2 hover:text-sky-700"
                  >
                    {b.unit}
                  </button>
                </td>
                {KOLOM.map((c) => {
                  const tanda = c.bagi ? null : tandaSelisih(b, c.k);
                  const bisaKetik = bolehUbah && c.ketik && !b.terkunci;

                  return (
                    <td
                      key={c.k}
                      title={tanda ?? ket(c)}
                      className={`whitespace-nowrap p-0 text-right ${tanda ? 'bg-red-100 text-red-900' : ''}`}
                    >
                      {bisaKetik ? (
                        <IsianSel
                          baris={b}
                          kolom={c.k}
                          judul={`Saldo awal ${c.j} menurut laporan kantor`}
                          tersimpan={b.diketik?.[c.k] ?? b.sistem?.[c.k] ?? null}
                          onUbah={(v) => onUbah(b.branch_id, c.k, v)}
                        />
                      ) : (
                        <span className={`block px-3 py-1 ${c.tebal ? 'font-semibold' : 'text-slate-500'}`}>
                          {selBaris(b, c)}
                        </span>
                      )}
                    </td>
                  );
                })}
                <td className="whitespace-nowrap border-l px-3 py-1 text-center text-[11px] text-slate-500">
                  {b.terkunci ? (
                    <span className="inline-flex items-center gap-1">
                      <span className="text-emerald-700" title={`${b.dicek_oleh ?? '-'} · ${b.dicek_pada ?? '-'}`}>
                        ✓ {b.dicek_oleh ?? '-'}
                      </span>
                      {bolehUbah && (
                        <button type="button" onClick={() => onBuka?.(b)} className="tanpa-cetak text-sky-600 underline">
                          buka
                        </button>
                      )}
                    </span>
                  ) : bolehUbah ? (
                    <button
                      type="button"
                      onClick={() => onCek?.(b)}
                      className="tanpa-cetak rounded border px-1.5 py-0.5 hover:bg-slate-100"
                    >
                      Cek
                    </button>
                  ) : (
                    <span className="text-slate-300">belum</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t bg-emerald-50 font-bold text-slate-900">
            <tr>
              <td className="px-3 py-1.5">Total Wilayah</td>
              {KOLOM.map((c) => (
                <td key={c.k} className="whitespace-nowrap px-3 py-1.5 text-right">
                  {selTotal(c)}
                </td>
              ))}
              <td className="border-l px-3 py-1.5" />
            </tr>
          </tfoot>
        </table>
      </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
