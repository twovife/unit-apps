import { router } from '@inertiajs/react';
import axios from 'axios';
import { ArrowRightLeft, Loader2, Plus, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@/shadcn/ui/button';
import { Input } from '@/shadcn/ui/input';
import { Label } from '@/shadcn/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/shadcn/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shadcn/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shadcn/ui/tabs';

/**
 * Drawer detail rekening SKSW, disalin dari app_laravel
 * resources/js/pages/sksw/components/saving-detail-drawer.tsx + saving-actions.tsx:
 * saldo, transaksi per bulan (hapus), rekap bulanan, Tambah Transaksi
 * (setoran / penarikan / pencairan resign) dan Mutasi Kantor.
 * Data: sksw.detail (JSON); aksi: sksw.transaksi / sksw.mutasi / sksw.hapus.
 */
const TX_TYPE_LABEL = { D: 'Setoran', K: 'Pengambilan', DM: 'Mutasi masuk', KM: 'Mutasi keluar', KRMD: 'Resign / MD' };
const rp = (n) => new Intl.NumberFormat('id-ID').format(Number(n) || 0);
const angka = (v) => String(v ?? '').replace(/\D/g, '');
const hariIni = () => new Date().toLocaleDateString('sv');
const tglPendek = (v) => {
  if (!v) return '-';
  const d = new Date(v);
  return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getFullYear()).slice(-2)}`;
};
const periodePanjang = (p) => {
  const [y, m] = (p || '').split('-');
  return y && m ? `${m}-${y}` : p || '-';
};
const periodePendek = (p) => {
  const [y, m] = (p || '').split('-');
  return y && m ? `${m}-${y.slice(-2)}` : p || '-';
};
// Mutasi tercatat sepasang; yang boleh dihapus cuma baris pertama (pasangannya ikut).
const mutasiPertama = (tx, semua) => !tx.mutasi_ref || semua.find((t) => t.mutasi_ref === tx.mutasi_ref)?.id === tx.id;
const PILIH = 'mt-1 w-full h-9 px-3 text-sm border rounded-md border-input bg-background';

function kirim(method, url, data, { onSelesai, setGalat, setProses }) {
  setProses(true);
  router[method](url, data, {
    preserveScroll: true,
    preserveState: true,
    onError: (e) => setGalat(e),
    onSuccess: () => onSelesai?.(),
    onFinish: () => setProses(false),
  });
}

function TambahTransaksi({ saving, onSelesai }) {
  const [buka, setBuka] = useState(false);
  const [isi, setIsi] = useState({});
  const [galat, setGalat] = useState({});
  const [proses, setProses] = useState(false);
  useEffect(() => {
    if (buka) {
      setIsi({ jenis: 'SW', transaction_type: 'D', transaction_date: hariIni(), nominal: '', note: '' });
      setGalat({});
    }
  }, [buka]);
  const debit = isi.transaction_type === 'D';
  const simpan = (e) => {
    e.preventDefault();
    const nominal = Number(isi.nominal) || 0;
    kirim('post', route('sksw.transaksi', saving.id), {
      jenis: isi.jenis,
      transaction_type: isi.transaction_type,
      transaction_date: isi.transaction_date,
      debit: debit ? nominal : 0,
      kredit: debit ? 0 : nominal,
      note: isi.note,
    }, { onSelesai: () => { setBuka(false); onSelesai(); }, setGalat, setProses });
  };
  const ubah = (k, v) => setIsi((x) => ({ ...x, [k]: v }));

  return (
    <>
      <Button size="sm" onClick={() => setBuka(true)}>
        <Plus className="w-4 h-4 mr-1.5" /> Tambah Transaksi
      </Button>
      <Dialog open={buka} onOpenChange={(o) => !o && !proses && setBuka(false)}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={simpan}>
            <DialogHeader>
              <DialogTitle>Tambah Transaksi</DialogTitle>
              <DialogDescription>
                Input transaksi SW atau SK untuk <strong>{saving.employee.nama_karyawan}</strong>.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Jenis</Label>
                  <select className={PILIH} value={isi.jenis} onChange={(e) => ubah('jenis', e.target.value)}>
                    <option value="SW">SW — Simpanan Wajib</option>
                    <option value="SK">SK — Simpanan Khusus</option>
                  </select>
                </div>
                <div>
                  <Label>Tipe Transaksi</Label>
                  <select className={PILIH} value={isi.transaction_type} onChange={(e) => ubah('transaction_type', e.target.value)}>
                    <option value="D">D — Setoran</option>
                    <option value="K">K — Penarikan</option>
                    <option value="KRMD">KRMD — Pencairan Resign</option>
                  </select>
                </div>
              </div>
              <div>
                <Label>Tanggal Transaksi</Label>
                <Input type="date" max={hariIni()} className="mt-1" value={isi.transaction_date ?? ''} onChange={(e) => ubah('transaction_date', e.target.value)} />
                {galat.transaction_date && <p className="text-sm text-destructive">{galat.transaction_date}</p>}
              </div>
              <div>
                <Label>{debit ? 'Nominal Debit (Masuk)' : 'Nominal Kredit (Keluar)'}</Label>
                <Input
                  inputMode="numeric"
                  className="mt-1 text-right tabular-nums"
                  placeholder="0"
                  value={isi.nominal ? rp(isi.nominal) : ''}
                  onChange={(e) => ubah('nominal', angka(e.target.value))}
                />
                {!debit && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Saldo {isi.jenis}: Rp {rp(isi.jenis === 'SW' ? saving.saldo_sw : saving.saldo_sk)}
                  </p>
                )}
                {(galat.debit || galat.kredit) && <p className="text-sm text-destructive">{galat.debit || galat.kredit}</p>}
              </div>
              <div>
                <Label>Catatan (Opsional)</Label>
                <Input className="mt-1" placeholder="Keterangan transaksi..." value={isi.note ?? ''} onChange={(e) => ubah('note', e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setBuka(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={proses || !isi.nominal}>
                Simpan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

function MutasiKantor({ saving, onSelesai }) {
  const [buka, setBuka] = useState(false);
  const [isi, setIsi] = useState({});
  const [galat, setGalat] = useState({});
  const [proses, setProses] = useState(false);
  const tujuan = saving.employee.branch;
  // Karyawan masih di kantor rekening: belum ada yang perlu dipindah.
  const belumDimutasi = !tujuan || tujuan.id === saving.branch?.id;
  useEffect(() => {
    if (buka) {
      setIsi({ transaction_date: hariIni(), note: '' });
      setGalat({});
    }
  }, [buka]);
  const simpan = (e) => {
    e.preventDefault();
    kirim('post', route('sksw.mutasi', saving.id), isi, { onSelesai: () => { setBuka(false); onSelesai(); }, setGalat, setProses });
  };

  return (
    <>
      <Button
        size="sm"
        variant="secondary"
        disabled={belumDimutasi}
        title={belumDimutasi ? 'Karyawan belum dimutasi; mutasikan dulu di menu Karyawan' : undefined}
        onClick={() => setBuka(true)}
      >
        <ArrowRightLeft className="w-4 h-4 mr-1.5" /> Mutasi Kantor
      </Button>
      <Dialog open={buka} onOpenChange={(o) => !o && !proses && setBuka(false)}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={simpan}>
            <DialogHeader>
              <DialogTitle>Mutasi Pindah Kantor</DialogTitle>
              <DialogDescription>
                Pindahkan seluruh saldo SW & SK untuk <strong>{saving.employee.nama_karyawan}</strong> ke kantor baru. Sistem akan
                otomatis memindahkan Rp {rp(saving.saldo_sw)} (SW) dan Rp {rp(saving.saldo_sk)} (SK).
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label>Tanggal Mutasi</Label>
                <Input type="date" max={hariIni()} className="mt-1" value={isi.transaction_date ?? ''} onChange={(e) => setIsi((x) => ({ ...x, transaction_date: e.target.value }))} />
                {galat.transaction_date && <p className="text-sm text-destructive">{galat.transaction_date}</p>}
              </div>
              <div>
                <Label>Kantor Tujuan</Label>
                <p className="px-3 py-2 mt-1 text-sm border rounded-md bg-muted/40">
                  {tujuan?.unit ?? '-'} <span className="text-xs text-muted-foreground">(kantor karyawan saat ini)</span>
                </p>
              </div>
              <div>
                <Label>Catatan (Opsional)</Label>
                <Input className="mt-1" placeholder="Keterangan mutasi..." value={isi.note ?? ''} onChange={(e) => setIsi((x) => ({ ...x, note: e.target.value }))} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setBuka(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={proses}>
                Proses Mutasi
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

function HapusTransaksi({ id, onSelesai }) {
  const [buka, setBuka] = useState(false);
  const [proses, setProses] = useState(false);
  const [galat, setGalat] = useState({});
  return (
    <>
      <Button variant="ghost" size="sm" className="h-7 px-2 text-destructive hover:text-destructive" title="Hapus transaksi" onClick={() => setBuka(true)}>
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
      <Dialog open={buka} onOpenChange={(o) => !o && !proses && setBuka(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Hapus Transaksi?</DialogTitle>
            <DialogDescription>
              Transaksi ini dihapus permanen dan saldo langsung menyesuaikan. Mutasi ikut terhapus beserta pasangannya. Tindakan ini tidak bisa
              dibatalkan.
            </DialogDescription>
          </DialogHeader>
          {Object.values(galat).length > 0 && <p className="text-sm text-destructive">{Object.values(galat)[0]}</p>}
          <DialogFooter>
            <Button variant="outline" onClick={() => setBuka(false)}>
              Batal
            </Button>
            <Button
              disabled={proses}
              className="text-white bg-destructive hover:bg-destructive/90"
              onClick={() => kirim('delete', route('sksw.hapus', id), {}, { onSelesai: () => { setBuka(false); onSelesai(); }, setGalat, setProses })}
            >
              Ya, Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function SavingDetailDrawer({ savingId, employeeName, onClose }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  const muat = useCallback(
    (spinner = true) => {
      if (!savingId) return;
      if (spinner) setLoading(true);
      axios
        .get(route('sksw.detail', savingId))
        .then(({ data }) => setDetail(data))
        .catch(() => setDetail(null))
        .finally(() => setLoading(false));
    },
    [savingId],
  );
  useEffect(() => {
    muat();
  }, [muat]);

  // Sesudah aksi: drawer dimuat ulang, tabel laporan di belakang ikut diperbarui.
  const selesai = () => {
    muat(false);
    router.reload({ only: ['data', 'batch'], preserveScroll: true });
  };

  const kelompok = useMemo(() => {
    const g = [];
    (detail?.transactions ?? []).forEach((tx) => {
      const p = (tx.transaction_date || '').slice(0, 7);
      const akhir = g[g.length - 1];
      if (akhir && akhir.period === p) akhir.items.push(tx);
      else g.push({ period: p, items: [tx] });
    });
    return g;
  }, [detail]);

  const saving = detail?.saving;
  const tampil = !loading && saving && savingId === saving.id;

  return (
    <Sheet open={!!savingId} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="flex flex-col w-full h-full gap-0 p-0 overflow-hidden sm:w-[94vw] sm:max-w-none lg:w-[680px]">
        <SheetHeader className="gap-1 px-5 py-4 pr-12 border-b">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <SheetTitle className="flex flex-wrap items-center gap-2 text-sm">
                {saving?.employee.nama_karyawan ?? employeeName ?? 'Detail Rekening'}
                {saving?.employee.date_resign && (
                  <span className="rounded-sm bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-700">RESIGN</span>
                )}
              </SheetTitle>
              <SheetDescription>
                {tampil ? [saving.branch?.unit, saving.employee.jabatan, saving.nomor_rekening].filter(Boolean).join(' · ') : 'Memuat data rekening...'}
              </SheetDescription>
            </div>
            {tampil && detail.boleh_input && (
              <div className="flex flex-wrap gap-2">
                <TambahTransaksi saving={saving} onSelesai={selesai} />
                <MutasiKantor saving={saving} onSelesai={selesai} />
              </div>
            )}
          </div>
        </SheetHeader>

        {!tampil ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="flex flex-col flex-1 min-h-0 gap-4 px-5 py-4">
            <div className="grid grid-cols-3 gap-2 p-3 text-center border rounded-lg bg-zinc-50">
              <div>
                <p className="text-[11px] text-muted-foreground">Saldo SW</p>
                <p className="text-sm font-semibold tabular-nums">Rp {rp(saving.saldo_sw)}</p>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground">Saldo SK</p>
                <p className="text-sm font-semibold tabular-nums">Rp {rp(saving.saldo_sk)}</p>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground">Total</p>
                <p className="text-sm font-bold text-emerald-600 tabular-nums">Rp {rp(saving.saldo_sw + saving.saldo_sk)}</p>
              </div>
            </div>

            <Tabs defaultValue="transaksi" className="flex flex-col flex-1 min-h-0">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="transaksi">Transaksi ({detail.transactions.length})</TabsTrigger>
                <TabsTrigger value="bulanan">Rekap Bulanan</TabsTrigger>
              </TabsList>

              <TabsContent value="transaksi" className="flex-1 min-h-0 pt-2 mt-0">
                <div className="h-full overflow-y-auto border rounded-md">
                  {kelompok.length === 0 ? (
                    <p className="py-8 text-xs text-center text-muted-foreground">Belum ada transaksi.</p>
                  ) : (
                    kelompok.map((g) => (
                      <div key={g.period}>
                        <div className="sticky top-0 z-10 px-3 py-1 text-[11px] font-semibold border-y bg-zinc-100 text-zinc-600 first:border-t-0">
                          {periodePanjang(g.period)}
                        </div>
                        <div className="divide-y">
                          {g.items.map((tx) => (
                            <div key={tx.id} className={`flex items-center justify-between gap-3 py-2 pr-3 pl-6 ${tx.voided_at ? 'bg-red-50/60 line-through opacity-70' : ''}`}>
                              <div className="min-w-0">
                                <p className="text-xs font-medium">
                                  <span className={tx.jenis === 'SW' ? 'text-sky-600' : 'text-violet-600'}>{tx.jenis}</span>
                                  {' · '}
                                  {TX_TYPE_LABEL[tx.transaction_type] ?? tx.transaction_type}
                                </p>
                                <p className="truncate pl-2 text-[11px] text-muted-foreground">
                                  {tglPendek(tx.transaction_date)}
                                  {tx.created_by_name ? ` · ${tx.created_by_name}` : ''}
                                  {tx.note ? ` · ${tx.note}` : ''}
                                </p>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                <p className={`text-xs font-semibold tabular-nums ${tx.debit > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                  {tx.debit > 0 ? '+' : '−'} Rp {rp(tx.debit > 0 ? tx.debit : tx.kredit)}
                                </p>
                                {detail.boleh_input && tx.can_void && !tx.voided_at && mutasiPertama(tx, detail.transactions) && (
                                  <HapusTransaksi id={tx.id} onSelesai={selesai} />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="bulanan" className="flex-1 min-h-0 pt-2 mt-0">
                <div className="h-full overflow-y-auto border rounded-md">
                  <Table className="text-xs">
                    <TableHeader className="sticky top-0 bg-zinc-50">
                      <TableRow>
                        <TableHead className="border-r">Bulan</TableHead>
                        <TableHead className="border-r">Unit</TableHead>
                        <TableHead className="text-right border-r">SW Saldo</TableHead>
                        <TableHead className="text-right">SK Saldo</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {detail.snapshot.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="h-20 text-center text-muted-foreground">
                            Belum ada mutasi.
                          </TableCell>
                        </TableRow>
                      ) : (
                        detail.snapshot.map((r) => (
                          <TableRow key={`${r.period}-${r.branch_unit}`}>
                            <TableCell className="border-r whitespace-nowrap">{periodePendek(r.period)}</TableCell>
                            <TableCell className="border-r text-muted-foreground">{r.branch_unit}</TableCell>
                            <TableCell className="text-right border-r tabular-nums">{rp(r.sw_saldo)}</TableCell>
                            <TableCell className="text-right tabular-nums">{rp(r.sk_saldo)}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
