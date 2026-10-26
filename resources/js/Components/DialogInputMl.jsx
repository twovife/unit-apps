import { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { router } from '@inertiajs/react';
import { Button } from '@/shadcn/ui/button';
import { Input } from '@/shadcn/ui/input';
import { Label } from '@/shadcn/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/shadcn/ui/popover';
import { Calendar } from '@/shadcn/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { rpLengkap as rp, rpInput } from '@/lib/rupiah';

/**
 * Input ML (kantor migrasi): setoran nasabah macet lama dipecah dari MACET LAMA kelompok x
 * hari menjadi pinjaman atas nama nasabah itu (NIK diketik / NIK UB otomatis), langsung
 * diangsur lunas -> saldo MACET LAMA berkurang, total ML tetap. App\Helpers\PecahanMacetLama.
 * Kelompok & hari = filter halaman (tidak dipilih lagi). Tanggal bayar otomatis: hari tagih
 * itu minggu ini (belum dikunci).
 * Data & aturan: InputMlController.
 */
const HARI_KE = { minggu: 0, senin: 1, selasa: 2, rabu: 3, kamis: 4, jumat: 5, sabtu: 6 };
const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

/**
 * Tanggal drop nasabah ML: hanya hari tagih yang sama (Senin -> hanya Senin) dan sebelum
 * batas. <input type="date"> tidak bisa membatasi hari, jadi pakai kalender + pilih bulan/tahun.
 */
const TanggalDrop = ({ value, onChange, hari, batas }) => {
  const [buka, setBuka] = useState(false);
  const akhir = dayjs(batas).subtract(1, 'day');
  const [lihat, setLihat] = useState(() => (value ? dayjs(value) : akhir).startOf('month').toDate());
  const tahun = Array.from({ length: akhir.year() - 2015 + 1 }, (_, i) => akhir.year() - i);
  const mati = (d) => d.getDay() !== HARI_KE[hari] || !dayjs(d).isBefore(dayjs(batas), 'day');
  const geser = (b, t) => setLihat(new Date(t, b, 1));
  return (
    <Popover open={buka} onOpenChange={setBuka}>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" className="justify-between w-full font-normal">
          {value ? dayjs(value).format('dddd, DD MMM YYYY') : <span className="text-muted-foreground">Pilih tanggal ({hari})</span>}
          <CalendarIcon className="w-4 h-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2" align="start">
        <div className="flex gap-2 px-1">
          <select className="h-8 px-2 text-sm border rounded-md bg-background" value={lihat.getMonth()} onChange={(e) => geser(Number(e.target.value), lihat.getFullYear())}>
            {BULAN.map((b, i) => (
              <option key={b} value={i}>{b}</option>
            ))}
          </select>
          <select className="h-8 px-2 text-sm border rounded-md bg-background" value={lihat.getFullYear()} onChange={(e) => geser(lihat.getMonth(), Number(e.target.value))}>
            {tahun.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <Calendar
          mode="single"
          month={lihat}
          onMonthChange={setLihat}
          selected={value ? dayjs(value).toDate() : undefined}
          disabled={mati}
          onSelect={(d) => {
            if (!d) return;
            onChange(dayjs(d).format('YYYY-MM-DD'));
            setBuka(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
};

export default function DialogInputMl({ buka, onClosed, kelompok, hari }) {
  const [data, setData] = useState(null);
  const [galat, setGalat] = useState(null);
  const [isi, setIsi] = useState({ nama: '', nik: '', tanggal_drop: '', nominal: '', katrol: true });
  const [proses, setProses] = useState(false);

  const muat = () =>
    axios
      .get(route('input_ml.index'), { params: { kelompok, hari } })
      .then(({ data }) => setData(data))
      .catch((e) => setGalat(e.response?.data?.message ?? 'Data MACET LAMA gagal dimuat.'));

  useEffect(() => {
    if (!buka) return;
    setGalat(null);
    setIsi({ nama: '', nik: '', tanggal_drop: '', nominal: '', katrol: true });
    muat();
  }, [buka]);

  const ml = data?.macet_lama.find((m) => String(m.kelompok) === String(kelompok) && m.hari === hari);
  const ubah = (k, v) => setIsi((x) => ({ ...x, [k]: v }));
  const simpan = () =>
    router.post(route('input_ml.simpan'), { ...isi, loan_id: ml?.id, nominal: Number(isi.nominal) }, {
      preserveScroll: true,
      onStart: () => setProses(true),
      onFinish: () => setProses(false),
      onError: (e) => setGalat(Object.values(e)[0]),
      onSuccess: (p) => {
        if (Object.keys(p.props.errors ?? {}).length) return;
        setIsi({ nama: '', nik: '', tanggal_drop: '', nominal: '', katrol: true });
        setGalat(null);
        muat(); // sisa & riwayat terbaru; dialog tetap terbuka untuk setoran berikutnya
      },
    });

  return (
    <Dialog open={buka} onOpenChange={(o) => !o && !proses && onClosed()}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Input ML</DialogTitle>
          {/* Radix butuh Description untuk aksesibilitas; teks keterangan dibuang (mas 2026-10-26). */}
          <DialogDescription className="sr-only">Input ML</DialogDescription>
        </DialogHeader>

        {!data && !galat && <div className="text-sm text-slate-500">Memuat…</div>}
        {data && !ml && (
          <div className="p-3 text-sm rounded-md bg-amber-50 text-amber-800">
            Kelompok {kelompok} hari <span className="capitalize">{hari}</span> tidak punya pinjaman MACET LAMA.
          </div>
        )}
        {ml && (
          // Satu kolom, urutan isian ditentukan mas (2026-10-26): NIK, drop, nama, tanggal & nominal angsuran.
          <div className="grid gap-3">
            <div className="p-3 text-sm border rounded-md bg-slate-50">
              <div className="font-semibold text-slate-800">
                MACET LAMA · Kelompok {ml.kelompok} · <span className="capitalize">{ml.hari}</span>
              </div>
              <div className="text-slate-600">
                SALDO ML BELUM TERINPUT <b className="tabular-nums">{rp(ml.sisa)}</b>
              </div>
            </div>
            <div className="grid gap-1">
              <Label>NIK (ketik UB kalau tidak ada NIK)</Label>
              <Input value={isi.nik} placeholder="NIK atau UB" onChange={(e) => ubah('nik', e.target.value.toUpperCase().replace(/[^0-9A-Z]/g, ''))} />
            </div>
            <div className="grid gap-1">
              <Label>
                Tanggal drop (hari <span className="capitalize">{ml.hari}</span>, sebelum 1 Juni 2026)
              </Label>
              <TanggalDrop value={isi.tanggal_drop} onChange={(v) => ubah('tanggal_drop', v)} hari={ml.hari} batas={data.batas_drop} />
            </div>
            <div className="grid gap-1">
              <Label>Nama nasabah</Label>
              <Input value={isi.nama} onChange={(e) => ubah('nama', e.target.value)} />
            </div>
            <div className="grid gap-1">
              <Label>Tanggal angsuran</Label>
              {ml.tanggal_bayar ? (
                <Input value={dayjs(ml.tanggal_bayar).format('dddd, DD MMM YYYY')} disabled />
              ) : (
                <div className="p-2 text-sm font-medium rounded-md text-rose-700 bg-rose-50">
                  Hari {ml.hari} minggu ini belum tiba, libur, atau sudah dikunci kasir.
                </div>
              )}
            </div>
            <div className="grid gap-1">
              <Label>Nominal angsuran</Label>
              <Input
                inputMode="numeric"
                value={isi.nominal ? rpInput(isi.nominal) : ''}
                onChange={(e) => ubah('nominal', e.target.value.replace(/\D/g, ''))}
                placeholder={`maks ${rp(ml.sisa)}`}
              />
            </div>
            {/* Katrol = dana titipan (danatitipan); bawaan tercentang, boleh dilepas. */}
            <label className="flex items-center gap-2 text-sm font-bold text-red-600 cursor-pointer select-none">
              <input
                type="checkbox"
                className="w-4 h-4 accent-red-600"
                checked={isi.katrol}
                onChange={(e) => ubah('katrol', e.target.checked)}
              />
              KATROL
            </label>
          </div>
        )}
        {galat && <div className="p-2 text-sm rounded-md text-rose-700 bg-rose-50">{galat}</div>}

        {data?.riwayat?.length > 0 && (
          <div>
            <div className="mb-1 text-xs font-semibold text-slate-600">
              {ml?.tanggal_bayar && data.riwayat.some((r) => r.tanggal === ml.tanggal_bayar)
                ? `Input ML ${dayjs(ml.tanggal_bayar).format('DD MMM')} · Kel ${ml.kelompok} · ${ml.hari}`
                : `5 Input ML terakhir · Kel ${ml?.kelompok} · ${ml?.hari}`}
            </div>
            <div className="overflow-y-auto border rounded-md max-h-48">
              <table className="w-full text-xs">
                <tbody>
                  {data.riwayat.map((r) => {
                    const m = data.macet_lama.find((x) => x.id === r.loan_id);
                    return (
                      <tr key={r.id} className="border-t first:border-t-0">
                        <td className="px-2 py-1 whitespace-nowrap">{r.tanggal ? dayjs(r.tanggal).format('DD MMM') : '–'}</td>
                        <td className="px-2 py-1 whitespace-nowrap">{m ? `Kel ${m.kelompok} · ${m.hari}` : ''}</td>
                        <td className="px-2 py-1">
                          {r.nama} <span className="text-slate-400">{r.nik} · drop {dayjs(r.drop).format('DD-MM-YY')}</span>
                        </td>
                        <td className="px-2 py-1 text-right tabular-nums">{rp(r.nominal)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            disabled={proses || !ml?.tanggal_bayar || !isi.nik || !isi.nama.trim() || !isi.tanggal_drop || !Number(isi.nominal)}
            onClick={simpan}
          >
            {proses ? 'Menyimpan…' : 'Simpan setoran'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
