import Authenticated from '@/Layouts/AuthenticatedLayout';
import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shadcn/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shadcn/ui/table';
import { Button } from '@/shadcn/ui/button';

const rp = (n) => new Intl.NumberFormat('id-ID').format(Number(n) || 0);
const tgl = (d) => new Date(`${d}T00:00:00`).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

/** Status satu kantor: sudah migrasi > (belum dihitung) > tidak ada data > siap / belum siap. */
const statusKantor = (k, angka) => {
  if (k.mulai) return 'migrasi';
  if (!angka) return null;
  if (angka.gagal) return 'gagal';
  if (angka.baris === 0) return 'kosong';
  return angka.siap === angka.baris ? 'siap' : 'belum';
};

const LENCANA = {
  migrasi: ['Sudah migrasi', 'bg-sky-50 text-sky-700 ring-sky-600/20'],
  siap: ['Siap', 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'],
  belum: ['Belum siap', 'bg-amber-50 text-amber-800 ring-amber-600/30'],
  kosong: ['Tidak ada data', 'bg-slate-100 text-slate-600 ring-slate-500/20'],
  gagal: ['Gagal dihitung', 'bg-red-50 text-red-700 ring-red-600/20'],
};

const Lencana = ({ status }) => {
  if (!status) return <span className="text-xs text-slate-400">…</span>;
  const [label, kelas] = LENCANA[status];
  return <span className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${kelas}`}>{label}</span>;
};

const Dashboard = ({ wilayah = [], periode }) => {
  // angka[branchId] = ringkasan kesiapan; dimuat per wilayah saat dibuka.
  const [angka, setAngka] = useState({});
  const [memuat, setMemuat] = useState({});

  // Hitung semua kantor satu wilayah, 4 permintaan sekaligus; angka muncul satu per satu.
  const muat = async (w, segar = false) => {
    const antre = [...(wilayah.find((g) => g.wilayah === w)?.kantor ?? [])];
    setMemuat((m) => ({ ...m, [w]: true }));
    const pekerja = async () => {
      for (let k = antre.shift(); k; k = antre.shift()) {
        try {
          const { data } = await axios.get(route('migrasi.dashboard_kantor', k.id), { params: segar ? { segar: 1 } : {} });
          setAngka((a) => ({ ...a, [k.id]: data }));
        } catch {
          setAngka((a) => ({ ...a, [k.id]: { gagal: true } }));
        }
      }
    };
    await Promise.all([pekerja(), pekerja(), pekerja(), pekerja()]);
    setMemuat((m) => ({ ...m, [w]: false }));
  };

  const dibuka = (nilai) =>
    nilai.forEach((v) => {
      const w = Number(v);
      const grup = wilayah.find((g) => g.wilayah === w);
      if (!memuat[w] && grup?.kantor.some((k) => !angka[k.id])) muat(w);
    });

  const bukaKantor = (id) =>
    router.post(route('set-branch'), { branch_id: id }, { onSuccess: () => router.visit(route('migrasi.kesiapan')) });

  return (
    <Authenticated>
      <Head title="Dashboard Migrasi" />

      <div className="p-4 space-y-4">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Dashboard Migrasi</h1>
          <p className="max-w-3xl mt-1 text-sm text-slate-600">
            Status migrasi per wilayah. Kesiapan dihitung terhadap saldo awal {tgl(periode)} (aturan sama dengan layar
            Kesiapan Migrasi) saat wilayah dibuka, lalu disimpan 30 menit.
          </p>
        </div>

        <Accordion type="multiple" onValueChange={dibuka} className="bg-white border rounded-lg">
          {wilayah.map(({ wilayah: w, kantor }) => {
            const status = kantor.map((k) => statusKantor(k, angka[k.id]));
            const hitung = (s) => status.filter((x) => x === s).length;
            const sudahDihitung = status.every((s) => s !== null);

            return (
              <AccordionItem key={w} value={String(w)} className="px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-left">
                    <span className="font-semibold">
                      Wilayah {w}
                      {w === 0 && <span className="ml-1 text-xs font-normal text-slate-500">(Pusat, bukan kantor operasional)</span>}
                    </span>
                    <span className="text-xs text-slate-500">{kantor.length} kantor</span>
                    <span className="text-xs text-sky-700">{hitung('migrasi')} sudah migrasi</span>
                    {sudahDihitung ? (
                      <>
                        <span className="text-xs text-emerald-700">{hitung('siap')} siap</span>
                        <span className="text-xs text-amber-700">{hitung('belum')} belum siap</span>
                      </>
                    ) : (
                      <span className="text-xs text-slate-400">{memuat[w] ? 'menghitung…' : 'buka untuk menghitung kesiapan'}</span>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex justify-end mb-2">
                    <Button size="sm" variant="outline" disabled={memuat[w]} onClick={() => muat(w, true)}>
                      {memuat[w] ? 'Menghitung…' : 'Hitung ulang'}
                    </Button>
                  </div>
                  <div className="overflow-x-auto border rounded-md">
                    <Table className="text-sm">
                      <TableHeader className="bg-slate-50">
                        <TableRow>
                          <TableHead className="px-3">Kantor</TableHead>
                          <TableHead className="px-3">Status</TableHead>
                          <TableHead className="px-3 text-right">Siap</TableHead>
                          <TableHead className="px-3 text-right">Z total</TableHead>
                          <TableHead className="px-3 text-right">Z minus</TableHead>
                          <TableHead className="px-3 text-right">Tanpa bucket</TableHead>
                          <TableHead className="px-3 text-right">MACET LAMA</TableHead>
                          <TableHead className="px-3" />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {kantor.map((k, i) => {
                          const a = angka[k.id]?.gagal ? null : angka[k.id];
                          return (
                            <TableRow key={k.id}>
                              <TableCell className="px-3 font-medium">{k.unit}</TableCell>
                              <TableCell className="px-3">
                                <Lencana status={status[i]} />
                                {k.mulai && <div className="text-[11px] text-slate-500">mulai {tgl(k.mulai)}</div>}
                              </TableCell>
                              <TableCell className="px-3 text-right tabular-nums">{a ? `${a.siap} / ${a.baris}` : '…'}</TableCell>
                              <TableCell className="px-3 text-right tabular-nums">{a ? rp(a.z) : '…'}</TableCell>
                              <TableCell className={`px-3 text-right tabular-nums ${a?.z_minus ? 'font-semibold text-red-600' : ''}`}>
                                {a ? a.z_minus : '…'}
                              </TableCell>
                              <TableCell className={`px-3 text-right tabular-nums ${a?.tanpa_bucket ? 'font-semibold text-amber-700' : ''}`}>
                                {a ? a.tanpa_bucket : '…'}
                              </TableCell>
                              <TableCell className="px-3 text-right tabular-nums">{a ? a.macet_lama : '…'}</TableCell>
                              <TableCell className="px-3 text-right">
                                <Button size="sm" variant="ghost" className="h-7" onClick={() => bukaKantor(k.id)}>
                                  Buka
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </Authenticated>
  );
};

export default Dashboard;
