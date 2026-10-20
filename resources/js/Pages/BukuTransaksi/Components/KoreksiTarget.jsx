import { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { router } from '@inertiajs/react';
import CurrencyInput from 'react-currency-input-field';
import { Button } from '@/shadcn/ui/button';
import { Input } from '@/shadcn/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';

const rp = (n) => new Intl.NumberFormat('id-ID').format(Number(n) || 0);
const KELAS = 'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm mt-1';

/**
 * Koreksi target / keluar satu tanggal (bulan berjalan) - KoreksiTarget di server.
 * Boleh walau hari itu sudah dikunci kasir; masuk tidak bisa diubah (ikut drop).
 * Pratinjau rantai diminta ulang tiap angka berubah, simpan menulis semuanya.
 */
const KoreksiTarget = ({ baris, onClosed }) => {
  const [target, setTarget] = useState('');
  const [keluar, setKeluar] = useState('');
  const [alasan, setAlasan] = useState('');
  const [pratinjau, setPratinjau] = useState(null);
  const [galat, setGalat] = useState('');
  const [proses, setProses] = useState(false);

  useEffect(() => {
    if (!baris) return;
    setTarget(String(baris.target ?? 0));
    setKeluar(String(baris.keluar ?? 0));
    setAlasan('');
    setGalat('');
  }, [baris]);

  useEffect(() => {
    if (!baris) return;
    const t = setTimeout(() => {
      axios
        .get(route('transaction.koreksi_target_pratinjau'), {
          params: { id: baris.grouping_id, date: dayjs(baris.tanggal).format('YYYY-MM-DD'), target: Number(target) || 0, keluar: Number(keluar) || 0 },
        })
        .then(({ data }) => {
          setPratinjau(data);
          setGalat('');
        })
        .catch((e) => {
          setPratinjau(null);
          setGalat(e.response?.data?.message ?? 'Pratinjau gagal dimuat.');
        });
    }, 300);
    return () => clearTimeout(t);
  }, [baris, target, keluar]);

  const simpan = () => {
    router.post(
      route('transaction.koreksi_target'),
      { id: baris.grouping_id, date: dayjs(baris.tanggal).format('YYYY-MM-DD'), target: Number(target) || 0, keluar: Number(keluar) || 0, alasan },
      {
        preserveScroll: true,
        // Drawer ACC KM tetap terbuka; props baru (buku_rencana) mengalir ke
        // Approval lewat efek [datas], jadi angkanya langsung ikut diperbarui.
        preserveState: true,
        onStart: () => setProses(true),
        onFinish: () => setProses(false),
        onSuccess: onClosed,
        onError: (e) => setGalat(Object.values(e)[0] ?? 'Gagal menyimpan.'),
      },
    );
  };

  const berubah = (pratinjau?.perubahan ?? []).filter((p) => p.lama !== p.baru);

  return (
    <Dialog open={!!baris} onOpenChange={(o) => !o && !proses && onClosed()}>
      <DialogContent className="max-w-md">
        {baris && (
          <>
            <DialogHeader>
              <DialogTitle>Koreksi Target — {dayjs(baris.tanggal).format('DD MMM YYYY')}</DialogTitle>
              <DialogDescription>
                Tanggal sebelumnya tidak berubah. Target tanggal sesudahnya dihitung ulang sampai tanggal terakhir. Masuk ikut drop, tidak bisa diubah.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 text-sm">
              <div className="grid grid-cols-3 gap-2">
                <label>
                  Target
                  <CurrencyInput className={KELAS} allowDecimals={false} allowNegativeValue={false} prefix="Rp "
                    value={target} onValueChange={(v) => setTarget(v ?? '')} />
                </label>
                <label>
                  Masuk
                  <CurrencyInput className={`${KELAS} bg-slate-100`} disabled prefix="Rp " value={baris.masuk ?? 0} />
                </label>
                <label>
                  Keluar
                  <CurrencyInput className={KELAS} allowDecimals={false} allowNegativeValue={false} prefix="Rp "
                    value={keluar} onValueChange={(v) => setKeluar(v ?? '')} />
                </label>
              </div>
              <Input placeholder="Alasan koreksi (wajib)" value={alasan} onChange={(e) => setAlasan(e.target.value)} />
              {galat && <div className="text-xs text-red-600">{galat}</div>}
              {pratinjau && (
                <div className="p-2 border rounded-md bg-slate-50">
                  <div className="mb-1 text-xs font-semibold text-slate-600">Target yang berubah ({berubah.length})</div>
                  {berubah.length === 0 ? (
                    <div className="text-xs text-slate-500">Tidak ada perubahan target.</div>
                  ) : (
                    <div className="max-h-48 space-y-0.5 overflow-y-auto text-xs tabular-nums">
                      {berubah.map((p) => (
                        <div key={p.tanggal} className="flex justify-between gap-2">
                          <span>{dayjs(p.tanggal).format('DD MMM')}</span>
                          <span>
                            {rp(p.lama)} → <b>{rp(p.baru)}</b>
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            <DialogFooter className="flex-row justify-between gap-2 sm:justify-between">
              <Button variant="outline" disabled={proses} onClick={onClosed}>
                Batal
              </Button>
              <Button disabled={proses || !!galat || alasan.trim().length < 5} onClick={simpan}>
                {proses ? 'Menyimpan…' : 'Simpan koreksi'}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default KoreksiTarget;
