import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import dayjs from 'dayjs';
import { Link, router } from '@inertiajs/react';
import {
  Car,
  CheckCircle2,
  ChevronRight,
  Circle,
  Landmark,
  PiggyBank,
  Plane,
  Plus,
  Receipt,
  Trash2,
  Wallet,
} from 'lucide-react';
import { Button } from '@/shadcn/ui/button';
import { Input } from '@/shadcn/ui/input';
import { Label } from '@/shadcn/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';
import VideoTutorialButton from '@/Components/VideoTutorialButton';
import DialogPindai, { bisaDipindai } from '@/Components/PindaiGambar';
import { rpLengkap as rp, rpInput as ribu } from '@/lib/rupiah';
import { konfirmasi } from '@/lib/konfirmasi';

/**
 * Dashboard Kasir: tugas kasir hari ini + kartu pembayaran kantor aktif per
 * bulan, dengan input iuran Tabungan/BOP (gabungan) dan setoran Goro Umrah.
 * Data & aturan di PembayaranKantorController (salinan aturan app_laravel).
 */
const tgl = (d) => (d ? dayjs(d).format('DD MMM YYYY') : '–');

// Link hanya kalau route-nya terdaftar (menu closed beta bisa belum ada).
const linkKe = (nama) => {
  try {
    return route().has(nama) ? route(nama) : null;
  } catch {
    return null;
  }
};

// Foto HP besar: kecilkan di browser (sisi terpanjang 1600px, JPEG 0.75, EXIF
// terbuang) seperti app_laravel Unggahan. PDF dikirim apa adanya.
export const kecilkan = (file) =>
  !file || file.type === 'application/pdf'
    ? Promise.resolve(file)
    : new Promise((resolve) => {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
          const skala = Math.min(1, 1600 / Math.max(img.width, img.height));
          const c = document.createElement('canvas');
          c.width = Math.round(img.width * skala);
          c.height = Math.round(img.height * skala);
          const ctx = c.getContext('2d');
          ctx.fillStyle = '#fff';
          ctx.fillRect(0, 0, c.width, c.height);
          ctx.drawImage(img, 0, 0, c.width, c.height);
          URL.revokeObjectURL(url);
          c.toBlob((b) => resolve(b ? new File([b], 'bukti.jpg', { type: 'image/jpeg' }) : file), 'image/jpeg', 0.75);
        };
        img.onerror = () => {
          URL.revokeObjectURL(url);
          resolve(file);
        };
        img.src = url;
      });

// Isian angka: tampil berpemisah ribuan (1.250.000), disimpan sebagai digit saja.
const MAKS_BUKTI = 2 * 1024 * 1024; // = Unggahan::MAKS_KB

/** Tanda besar di pojok kartu. */
const Tanda = ({ jenis, teks }) => {
  const gaya = {
    sudah: 'text-emerald-700 bg-emerald-50',
    kurang: 'text-amber-700 bg-amber-50',
    belum: 'text-rose-700 bg-rose-50',
    netral: 'text-slate-500 bg-slate-50',
  }[jenis];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-medium rounded-full whitespace-nowrap ${gaya}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {teks}
    </span>
  );
};

/** Tombol kecil "Detail" ke menu asal kartu; tidak tampil kalau menunya belum ada. */
const TombolDetail = ({ href }) =>
  href ? (
    <Link href={href} className="text-xs font-medium shrink-0 text-slate-400 hover:text-sky-700">
      Detail →
    </Link>
  ) : null;

// Warna per kartu: [border, latar header tipis, ikon] (kelas utuh supaya terbaca Tailwind).
const WARNA = {
  pink: ['border-pink-300', 'bg-pink-50/70', 'text-pink-600'],
  teal: ['border-teal-300', 'bg-teal-50/70', 'text-teal-600'],
  violet: ['border-violet-300', 'bg-violet-50/70', 'text-violet-600'],
  emerald: ['border-emerald-300', 'bg-emerald-50/70', 'text-emerald-600'],
  sky: ['border-sky-300', 'bg-sky-50/70', 'text-sky-600'],
};

const Kartu = ({ judul, ikon: Ikon, warna = 'sky', href, tanda, aksi, children }) => {
  const [garis, latar, ikon] = WARNA[warna] ?? WARNA.sky;
  return (
    <div className={`flex flex-col h-full p-5 bg-white border rounded-2xl ${garis}`}>
      {/* Header: latar tipis sewarna border, di dalam padding kartu (tidak selebar kartu). */}
      <div className={`flex items-center justify-between gap-2 px-3 py-2 mb-4 rounded-xl ${latar}`}>
        <div className="flex items-center min-w-0 gap-2.5">
          <span className={`flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-sm shrink-0 ${ikon}`}>
            <Ikon className="w-4 h-4" />
          </span>
          <h3 className="text-sm font-semibold truncate text-slate-800">{judul}</h3>
        </div>
        <TombolDetail href={href} />
      </div>
      {tanda && <div className="mb-3">{tanda}</div>}
      <div className="flex-1 space-y-1.5 text-sm">{children}</div>
      {aksi && <div className="pt-4 mt-4">{aksi}</div>}
    </div>
  );
};

const Baris = ({ label, nilai, tebal = false }) => (
  <div className="flex justify-between gap-3">
    <span className="text-slate-500">{label}</span>
    <span className={`tabular-nums text-right ${tebal ? 'font-semibold text-slate-900' : 'text-slate-700'}`}>{nilai}</span>
  </div>
);

/** Pembayaran bulan ini (semua), dengan bukti dan tombol hapus kalau server mengizinkan (r.hapus = URL). */
const Riwayat = ({ isi = [], judul = 'Pembayaran bulan ini', kata = 'pembayaran' }) =>
  isi.length > 0 && (
    <div className="pt-2 mt-2 border-t border-dashed">
      <div className="mb-1 text-xs font-semibold text-slate-700">{judul}</div>
      <div className="space-y-0.5 max-h-40 overflow-y-auto">
        {isi.map((r) => (
          <div key={r.id} className="flex items-center justify-between gap-2 text-xs text-slate-600">
            <span className="truncate">
              {tgl(r.tanggal)}
              {r.keterangan && <span className="ml-1 text-slate-400">{r.keterangan}</span>}
            </span>
            <span className="flex items-center gap-2 tabular-nums shrink-0">
              {rp(r.nominal)}
              {r.bukti && (
                <a href={r.bukti} target="_blank" rel="noreferrer" className="inline-flex items-center gap-0.5 text-sky-700 hover:underline">
                  <Receipt className="w-3 h-3" /> bukti
                </a>
              )}
              {r.hapus && (
                <button
                  type="button"
                  title={`Hapus ${kata}`}
                  className="text-rose-600 hover:text-rose-800"
                  onClick={async () =>
                    (await konfirmasi(`Hapus ${kata} ${tgl(r.tanggal)} ${rp(r.nominal)}?`)) &&
                    router.delete(r.hapus, {
                      preserveScroll: true,
                      preserveState: true,
                      onSuccess: () => window.dispatchEvent(new Event('pembayaran-kantor:muat-ulang')),
                    })
                  }
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

const tandaIuran = (d) =>
  d.status === 'lunas' ? (
    <Tanda jenis="sudah" teks={`Sudah bayar ${d.terakhir ? dayjs(d.terakhir).format('DD MMM') : ''}`} />
  ) : d.status === 'kurang' ? (
    <Tanda jenis="kurang" teks={`Kurang ${rp(d.kurang)}`} />
  ) : d.status === 'tenggang' ? (
    <Tanda jenis="netral" teks="Masa tenggang" />
  ) : (
    <Tanda jenis="belum" teks="Belum bayar" />
  );

const IsiIuran = ({ d }) => {
  const persen = Math.min(100, Math.round(((d.dibayar || 0) / (d.target || 1)) * 100));
  return (
    <>
      <div className="h-2 mb-2 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full ${d.status === 'lunas' ? 'bg-emerald-500' : 'bg-amber-400'}`} style={{ width: `${persen}%` }} />
      </div>
      <Baris label="Dibayar bulan ini" nilai={`${rp(d.dibayar)} / ${rp(d.target)}`} tebal />
      <Baris label="Akumulasi" nilai={rp(d.akumulasi)} />
      {d.terkunci && <div className="text-xs font-medium text-slate-500">🔒 Bulan ini sudah dikunci pusat.</div>}
      <Riwayat isi={d.riwayat} />
    </>
  );
};

/** Satu baris tugas: lingkaran centang, judul, keterangan, nilai di kanan. */
const BarisTugas = ({ ok, judul, ket, nilai, href, children }) => {
  const isi = (
    <>
      {ok ? (
        <CheckCircle2 className="w-5 h-5 mt-0.5 text-emerald-500 shrink-0" />
      ) : (
        <Circle className="w-5 h-5 mt-0.5 text-slate-300 shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <div className={`text-sm font-medium ${ok ? 'text-slate-400 line-through decoration-slate-300' : 'text-slate-800'}`}>{judul}</div>
        {ket && <div className="text-xs text-slate-400">{ket}</div>}
        {children}
      </div>
      {nilai && <div className={`text-sm tabular-nums shrink-0 ${ok ? 'text-slate-400' : 'font-semibold text-slate-700'}`}>{nilai}</div>}
      {href && <ChevronRight className="w-4 h-4 mt-0.5 text-slate-300 shrink-0" />}
    </>
  );
  const kelas = 'flex items-start gap-3 px-4 py-3';
  return href ? <Link href={href} className={`${kelas} hover:bg-slate-50`}>{isi}</Link> : <div className={kelas}>{isi}</div>;
};

const MAKS_CHIP = 6;

/** Tugas harian: Rekap 1 (hari belum dikunci, hari ini) + iuran bulan ini. */
const Tugas = ({ t }) => {
  const [semua, setSemua] = useState(false);
  const perTanggal = Object.entries((t.belum_kunci ?? []).reduce((a, h) => ((a[h.tanggal] ??= []).push(h.kelompok), a), {}));
  const tampil = semua ? perTanggal : perTanggal.slice(0, MAKS_CHIP);
  const rekap1 = linkKe('kasir.rekap.rekap_satu');
  const kunci = t.migrasi ? 'Kunci' : 'TTD';
  const selesai = [perTanggal.length === 0, t.kelompok > 0 && t.acc_km >= t.kelompok, t.kelompok > 0 && t.kunci >= t.kelompok];
  return (
    <div className="bg-white border divide-y rounded-2xl border-slate-200/70 divide-slate-100">
      <div className="flex items-center justify-between px-4 py-3">
        <p className="text-xs text-slate-400">{t.hari_kerja ? dayjs(t.tanggal).format('dddd, DD MMMM YYYY') : 'Hari ini libur — tidak ada kunci harian'}</p>
        <span className="text-xs font-medium tabular-nums text-slate-500">
          {selesai.filter(Boolean).length}/{selesai.length} selesai
        </span>
      </div>
      <BarisTugas
        ok={selesai[0]}
        judul={`${kunci} hari sebelumnya`}
        ket={selesai[0] ? 'Semua hari sebelumnya sudah dikunci' : `${perTanggal.length} hari belum dikunci — klik tanggal untuk membuka Rekap 1`}
      >
        {perTanggal.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {tampil.map(([tanggal, kel]) => (
              <Link
                key={tanggal}
                href={route('kasir.rekap.rekap_satu', { date: tanggal })}
                title={`Kelompok ${kel.join(', ')}`}
                className="px-2.5 py-1 text-xs rounded-full bg-amber-50 text-amber-800 hover:bg-amber-100"
              >
                {dayjs(tanggal).format('ddd DD/MM')} · {kel.length} kel
              </Link>
            ))}
            {perTanggal.length > MAKS_CHIP && (
              <button type="button" onClick={() => setSemua(!semua)} className="px-1 text-xs text-slate-500 hover:text-slate-800">
                {semua ? 'ringkas' : `+${perTanggal.length - MAKS_CHIP} lagi`}
              </button>
            )}
          </div>
        )}
      </BarisTugas>
      <BarisTugas ok={selesai[1]} judul="ACC KM hari ini" ket="Rekap harian disetujui kepala mantri" nilai={`${t.acc_km}/${t.kelompok}`} href={linkKe('transaction.index_buku_transaksi')} />
      <BarisTugas ok={selesai[2]} judul={`${kunci} kasir hari ini`} ket="Rekap 1" nilai={`${t.kunci}/${t.kelompok}`} href={rekap1} />
    </div>
  );
};

/** Isian bukti transfer (wajib), dengan pratinjau nama file. */
export const IsiBukti = ({ file, setFile, galat }) => {
  const ref = useRef(null);
  const [pesan, setPesan] = useState('');
  const [filePindai, setFilePindai] = useState(null);
  // Foto dirapikan dulu (atur sudut -> pratinjau); tanpa sudut terdeteksi = gambar utuh,
  // jadi screenshot bukti transfer tidak terpotong. Lalu dikecilkan saat dikirim (kecilkan).
  const pilihMentah = (f) => {
    if (ref.current) ref.current.value = '';
    if (bisaDipindai(f)) return setFilePindai(f);
    pilih(f);
  };
  // PDF tidak bisa dikecilkan, jadi ukurannya dicek di sini.
  const pilih = (f) => {
    const besar = f && f.type === 'application/pdf' && f.size > MAKS_BUKTI;
    setPesan(besar ? 'PDF maksimal 2MB. Kirim sebagai foto saja.' : '');
    setFile(besar ? null : f ?? null);
    if (ref.current) ref.current.value = '';
  };
  return (
    <div className="grid gap-1">
      <Label>Foto bukti transfer (wajib, maks 2MB)</Label>
      <input ref={ref} type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => pilihMentah(e.target.files?.[0])} />
      <DialogPindai
        file={filePindai}
        onBatal={() => setFilePindai(null)}
        onPilih={(f) => {
          setFilePindai(null);
          pilih(f);
        }}
      />
      <Button type="button" variant="outline" className="justify-start gap-2" onClick={() => ref.current?.click()}>
        <Receipt className="w-4 h-4" />
        {file ? file.name : 'Pilih foto / PDF bukti'}
      </Button>
      {(pesan || galat) && <span className="text-xs text-red-600">{pesan || galat}</span>}
    </div>
  );
};

/** Bayar Tabungan 1 Juta + BOP sekaligus (satu bukti), = app_laravel IuranGabungan. */
const DialogIuran = ({ buka, onClosed, data, bulan }) => {
  const k = data?.kartu;
  const [isi, setIsi] = useState({});
  const [file, setFile] = useState(null);
  const [galat, setGalat] = useState({});
  const [proses, setProses] = useState(false);

  useEffect(() => {
    if (!buka || !k) return;
    const tbBoleh = !k.tabungan.tenggang && !k.tabungan.terkunci && k.tabungan.kurang > 0;
    const bopBoleh = !k.bop.tenggang && !k.bop.terkunci && k.bop.kurang > 0;
    setIsi({
      tb: tbBoleh,
      tb_amount: k.tabungan.kurang || '',
      bop: bopBoleh,
      bop_amount: k.bop.kurang || '',
      payment_date: dayjs().format('YYYY-MM-DD'),
      rekening_id: data.rekening?.[0]?.id ?? '',
      notes: '',
    });
    setFile(null);
    setGalat({});
  }, [buka]);

  const simpan = async () => {
    setProses(true);
    const t = toast.loading('Mengunggah bukti…');
    const bukti = await kecilkan(file);
    router.post(
      route('dashboard.kasir.iuran'),
      { ...isi, tb: isi.tb ? 1 : 0, bop: isi.bop ? 1 : 0, period: bulan, bukti },
      {
        forceFormData: true,
        preserveScroll: true,
        preserveState: true,
        onError: setGalat,
        onSuccess: onClosed,
        onFinish: () => {
        toast.dismiss(t);
        setProses(false);
      },
      },
    );
  };
  const ubah = (k2, v) => setIsi((x) => ({ ...x, [k2]: v }));

  return (
    <Dialog open={buka} onOpenChange={(o) => !o && !proses && onClosed()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Bayar iuran — {dayjs(bulan + '-01').format('MMMM YYYY')}</DialogTitle>
          <DialogDescription>Tabungan 1 Juta dan BOP bisa dibayar sekaligus dengan satu bukti transfer.</DialogDescription>
        </DialogHeader>
        {k && (
          <div className="grid gap-3">
            {[
              ['tb', 'Tabungan 1 Juta', k.tabungan],
              ['bop', 'BOP Pusat', k.bop],
            ].map(([kunci, label, d]) => (
              <div key={kunci} className="p-3 border rounded-lg">
                <label className="flex items-center gap-2 font-medium">
                  <input
                    type="checkbox"
                    checked={!!isi[kunci]}
                    disabled={d.tenggang || d.terkunci}
                    onChange={(e) => ubah(kunci, e.target.checked)}
                  />
                  {label}
                  <span className="ml-auto text-xs font-normal text-slate-500">
                    {d.tenggang ? 'masa tenggang' : d.terkunci ? 'dikunci pusat' : `kurang ${rp(d.kurang)}`}
                  </span>
                </label>
                {isi[kunci] && (
                  <Input
                    className="mt-2"
                    inputMode="numeric"
                    value={ribu(isi[`${kunci}_amount`])}
                    onChange={(e) => ubah(`${kunci}_amount`, e.target.value.replace(/\D/g, ''))}
                    placeholder="Nominal"
                  />
                )}
                {(galat[kunci] || galat[`${kunci}_amount`]) && (
                  <span className="text-xs text-red-600">{galat[kunci] || galat[`${kunci}_amount`]}</span>
                )}
              </div>
            ))}
            <div className="grid gap-1">
              <Label>Tanggal bayar</Label>
              <Input type="date" max={dayjs().format('YYYY-MM-DD')} value={isi.payment_date ?? ''} onChange={(e) => ubah('payment_date', e.target.value)} />
              {galat.payment_date && <span className="text-xs text-red-600">{galat.payment_date}</span>}
            </div>
            <PilihRekening daftar={data.rekening} nilai={isi.rekening_id} ubah={(v) => ubah('rekening_id', v)} galat={galat.rekening_id} />
            <IsiBukti file={file} setFile={setFile} galat={galat.bukti} />
            <div className="grid gap-1">
              <Label>Catatan</Label>
              <Input value={isi.notes ?? ''} onChange={(e) => ubah('notes', e.target.value)} />
            </div>
          </div>
        )}
        <DialogFooter className="flex-row justify-between gap-2 sm:justify-between">
          <Button variant="outline" disabled={proses} onClick={onClosed}>
            Batal
          </Button>
          <Button disabled={proses || !file || (!isi.tb && !isi.bop)} onClick={simpan}>
            {proses ? 'Menyimpan…' : 'Simpan pembayaran'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

/** Setoran Tabungan Goro Umrah. */
/** Pilihan rekening tujuan transfer (tabel rekening_tujuan), dipakai semua dialog bayar. */
const PilihRekening = ({ daftar = [], nilai, ubah, galat }) => {
  const terpilih = (daftar ?? []).find((r) => String(r.id) === String(nilai));
  return (
    <div className="grid gap-1.5 w-full">
      <Label>Rekening tujuan</Label>
      <select
        className="w-full h-9 px-3 text-sm border rounded-md border-input bg-background truncate focus:outline-none focus:ring-1 focus:ring-slate-900"
        value={nilai ?? ''}
        onChange={(e) => ubah(e.target.value)}
      >
        <option value="">— Pilih Rekening Tujuan —</option>
        {(daftar ?? []).map((r) => (
          <option key={r.id} value={r.id}>
            {r.nomor} · {r.atas_nama}
          </option>
        ))}
      </select>
      {terpilih && (
        <div className="rounded-lg bg-slate-50 border border-slate-200/90 p-2.5 text-xs space-y-1">
          <div className="flex items-center justify-between font-semibold text-slate-900">
            <span className="tabular-nums">{terpilih.nomor}</span>
            <span className="text-[11px] font-normal text-slate-500">a.n. {terpilih.atas_nama}</span>
          </div>
          {terpilih.keterangan && (
            <div className="pt-1 border-t border-slate-200/60 text-slate-600 break-words leading-relaxed text-[11px]">
              <span className="font-medium text-slate-500">Keterangan:</span> {terpilih.keterangan}
            </div>
          )}
        </div>
      )}
      {galat && <span className="text-xs text-red-600">{galat}</span>}
    </div>
  );
};

const DialogUmrah = ({ buka, onClosed, rekening }) => {
  const [isi, setIsi] = useState({});
  const [file, setFile] = useState(null);
  const [galat, setGalat] = useState({});
  const [proses, setProses] = useState(false);
  useEffect(() => {
    if (!buka) return;
    setIsi({ tanggal: dayjs().format('YYYY-MM-DD'), amount: '', rekening_id: rekening?.[0]?.id ?? '', notes: '' });
    setFile(null);
    setGalat({});
  }, [buka]);
  const simpan = async () => {
    setProses(true);
    const t = toast.loading('Mengunggah bukti…');
    const bukti = await kecilkan(file);
    router.post(route('dashboard.kasir.umrah'), { ...isi, bukti }, {
      forceFormData: true,
      preserveScroll: true,
      preserveState: true,
      onError: setGalat,
      onSuccess: onClosed,
      onFinish: () => {
        toast.dismiss(t);
        setProses(false);
      },
    });
  };
  const ubah = (k, v) => setIsi((x) => ({ ...x, [k]: v }));

  return (
    <Dialog open={buka} onOpenChange={(o) => !o && !proses && onClosed()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Setor Tabungan Goro Umrah</DialogTitle>
          <DialogDescription>Setoran kantor aktif, bukti transfer wajib.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1">
              <Label>Tanggal setor</Label>
              <Input type="date" max={dayjs().format('YYYY-MM-DD')} value={isi.tanggal ?? ''} onChange={(e) => ubah('tanggal', e.target.value)} />
              {galat.tanggal && <span className="text-xs text-red-600">{galat.tanggal}</span>}
            </div>
            <div className="grid gap-1">
              <Label>Nominal</Label>
              <Input inputMode="numeric" value={ribu(isi.amount)} onChange={(e) => ubah('amount', e.target.value.replace(/\D/g, ''))} />
              {galat.amount && <span className="text-xs text-red-600">{galat.amount}</span>}
            </div>
          </div>
          <PilihRekening daftar={rekening} nilai={isi.rekening_id} ubah={(v) => ubah('rekening_id', v)} galat={galat.rekening_id} />
          <IsiBukti file={file} setFile={setFile} galat={galat.bukti} />
          <div className="grid gap-1">
            <Label>Catatan</Label>
            <Input value={isi.notes ?? ''} onChange={(e) => ubah('notes', e.target.value)} />
          </div>
        </div>
        <DialogFooter className="flex-row justify-between gap-2 sm:justify-between">
          <Button variant="outline" disabled={proses} onClick={onClosed}>
            Batal
          </Button>
          <Button disabled={proses || !file || !isi.amount || !isi.rekening_id} onClick={simpan}>
            {proses ? 'Menyimpan…' : 'Simpan setoran'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

/** Jasa wajib bulan ini: merah kalau masih harus dibayar, hijau kalau sudah lunas. */
const JasaWajib = ({ nilai }) => <span className={nilai > 0 ? 'font-semibold text-red-600' : 'text-emerald-600'}>{rp(nilai)}</span>;

/** Angsuran pinjaman modal: satu nominal untuk semua pinjaman kantor. Pembagiannya dari server (JasaModal::alokasi), sama dengan yang disimpan. */
const DialogModal = ({ m, onClosed, rekening }) => {
  const [isi, setIsi] = useState({});
  const [file, setFile] = useState(null);
  const [galat, setGalat] = useState({});
  const [proses, setProses] = useState(false);
  const [bagi, setBagi] = useState(null);
  useEffect(() => {
    if (!m) return;
    setIsi({ payment_date: dayjs().format('YYYY-MM-DD'), nominal: '', rekening_id: rekening?.[0]?.id ?? '', notes: '' });
    setFile(null);
    setGalat({});
    setBagi(null);
  }, [m]);
  const nominal = Number(isi.nominal) || 0;
  useEffect(() => {
    if (!m || !nominal || !isi.payment_date) return setBagi(null);
    const c = new AbortController();
    const t = setTimeout(() => {
      axios
        .get(route('dashboard.kasir.modal.pratinjau'), { params: { nominal, payment_date: isi.payment_date }, signal: c.signal })
        .then(({ data }) => setBagi(data))
        .catch(() => {});
    }, 300);
    return () => {
      clearTimeout(t);
      c.abort();
    };
  }, [m, nominal, isi.payment_date]);
  const simpan = async () => {
    setProses(true);
    const t = toast.loading('Mengunggah bukti…');
    const bukti = await kecilkan(file);
    router.post(route('dashboard.kasir.modal'), { ...isi, bukti }, {
      forceFormData: true,
      preserveScroll: true,
      preserveState: true,
      onError: setGalat,
      onSuccess: onClosed,
      onFinish: () => {
        toast.dismiss(t);
        setProses(false);
      },
    });
  };
  const ubah = (k, v) => setIsi((x) => ({ ...x, [k]: v }));

  return (
    <Dialog open={!!m} onOpenChange={(o) => !o && !proses && onClosed()}>
      <DialogContent className="max-w-md">
        {m && (
          <>
            <DialogHeader>
              <DialogTitle>Bayar Pinjaman Modal</DialogTitle>
              <DialogDescription>
                Jasa wajib {rp(m.jasa_wajib ?? 0)}, sisa pokok {rp(m.sisa)}. Urutan: jasa Modal Awal, jasa pinjaman lain, pokok Modal Awal, pokok
                pinjaman lain; lebihnya ke pinjaman yang masih tempo.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1">
                  <Label>Nominal transfer</Label>
                  <Input inputMode="numeric" value={ribu(isi.nominal)} onChange={(e) => ubah('nominal', e.target.value.replace(/\D/g, ''))} />
                  {galat.nominal && <span className="text-xs text-red-600">{galat.nominal}</span>}
                </div>
                <div className="grid gap-1">
                  <Label>Tanggal bayar</Label>
                  <Input type="date" max={dayjs().format('YYYY-MM-DD')} value={isi.payment_date ?? ''} onChange={(e) => ubah('payment_date', e.target.value)} />
                </div>
              </div>
              {galat.payment_date && <span className="text-xs text-red-600">{galat.payment_date}</span>}
              {nominal > 0 && bagi && (
                <div className="p-2 text-sm rounded-md bg-slate-50">
                  {bagi.rincian.map((p) => (
                    <div key={p.id} className="py-1 border-b last:border-0">
                      <div className="font-medium text-slate-700">
                        {p.label}
                        {p.tempo && <span className="ml-1 text-xs text-amber-600">(tempo)</span>}
                      </div>
                      {p.jasa > 0 && <Baris label="· Jasa 2%" nilai={rp(p.jasa)} />}
                      {p.pokok > 0 && <Baris label="· Pokok" nilai={rp(p.pokok)} />}
                    </div>
                  ))}
                  {bagi.lebih > 0 && <div className="pt-1 text-xs font-medium text-red-600">Lebih {rp(bagi.lebih)} dari total sisa pokok + jasa.</div>}
                </div>
              )}
              <PilihRekening daftar={rekening} nilai={isi.rekening_id} ubah={(v) => ubah('rekening_id', v)} galat={galat.rekening_id} />
              <IsiBukti file={file} setFile={setFile} galat={galat.bukti} />
              <div className="grid gap-1">
                <Label>Catatan</Label>
                <Input value={isi.notes ?? ''} onChange={(e) => ubah('notes', e.target.value)} />
              </div>
            </div>
            <DialogFooter className="flex-row justify-between gap-2 sm:justify-between">
              <Button variant="outline" disabled={proses} onClick={onClosed}>
                Batal
              </Button>
              <Button disabled={proses || !file || !nominal || !isi.rekening_id || bagi?.lebih > 0} onClick={simpan}>
                {proses ? 'Menyimpan…' : 'Simpan pembayaran'}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

const sapaan = () => {
  const j = new Date().getHours();
  return j < 11 ? 'Selamat pagi' : j < 15 ? 'Selamat siang' : j < 18 ? 'Selamat sore' : 'Selamat malam';
};

/** Foto profil (MinIO, link sementara) atau inisial kalau tidak ada / gagal dimuat. */
const Foto = ({ p }) => {
  const [gagal, setGagal] = useState(false);
  return p.foto && !gagal ? (
    <img src={p.foto} alt={p.nama} onError={() => setGagal(true)} className="object-cover w-24 h-24 rounded-full ring-4 ring-white shadow-sm shrink-0" />
  ) : (
    <span className="flex items-center justify-center w-24 h-24 text-2xl font-semibold rounded-full ring-4 ring-white shadow-sm bg-sky-50 text-sky-700 shrink-0">
      {p.nama.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()}
    </span>
  );
};

export default function PembayaranKantor({ videos = {}, profil = null, samping = null }) {
  const [bulan, setBulan] = useState(dayjs().format('YYYY-MM'));
  const [tab, setTab] = useState('tugas');
  const [data, setData] = useState(null);
  const [galat, setGalat] = useState(null);
  const [muatUlang, setMuatUlang] = useState(0);
  const [dialog, setDialog] = useState(null); // 'iuran' | 'umrah'
  const [modalPilih, setModalPilih] = useState(null); // kartu pinjaman modal yang dibayar

  useEffect(() => {
    setGalat(null);
    const c = new AbortController();
    axios
      .get(route('dashboard.pembayaran'), { params: { bulan }, signal: c.signal })
      .then(({ data }) => setData(data))
      .catch((e) => !axios.isCancel(e) && setGalat('Ringkasan pembayaran gagal dimuat.'));
    return () => c.abort();
  }, [bulan, muatUlang]);

  // Sesudah hapus dari daftar Riwayat: muat ulang angka kartu.
  useEffect(() => {
    const ulang = () => setMuatUlang((n) => n + 1);
    window.addEventListener('pembayaran-kantor:muat-ulang', ulang);
    return () => window.removeEventListener('pembayaran-kantor:muat-ulang', ulang);
  }, []);

  const tutup = () => {
    setDialog(null);
    setMuatUlang((n) => n + 1); // angka kartu ikut terbarui sesudah simpan
  };

  const k = data?.kartu;
  const bayar = data?.boleh_bayar;

  return (
    <section className="grid items-start gap-6 lg:grid-cols-[1fr_18rem]">
      {/* Kolom kanan (desktop): kartu profil (+ isi tambahan, mis. pengumuman). Di HP tampil paling atas. */}
      <aside className="space-y-4 lg:sticky lg:top-4 lg:order-last">
        <div className="flex flex-col items-center p-6 text-center bg-white border rounded-2xl border-slate-200/70">
          {profil && <Foto p={profil} />}
          <h2 className="mt-4 text-lg font-semibold text-slate-900">{profil?.nama ?? 'Dashboard Kasir'}</h2>
          {profil?.jabatan && <p className="text-sm capitalize text-slate-500">{profil.jabatan}</p>}
          <dl className="w-full mt-5 space-y-2 text-sm text-left">
            {[
              ['Kantor', profil?.kantor ?? data?.unit],
              ['Wilayah', profil?.wilayah],
              ['Hari ini', dayjs().format('ddd, DD MMM YYYY')],
            ]
              .filter(([, v]) => v)
              .map(([l, v]) => (
                <div key={l} className="flex justify-between gap-2">
                  <dt className="text-slate-400">{l}</dt>
                  <dd className="font-medium text-right text-slate-700">{v}</dd>
                </div>
              ))}
          </dl>
          <div className="w-full pt-5 mt-5 border-t border-slate-100">
            <VideoTutorialButton videos={videos} menu="kasir" buttonText="Video Panduan" />
          </div>
        </div>
        {samping}
      </aside>

      <div className="min-w-0 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            {sapaan()}{profil ? `, ${profil.nama.split(' ')[0]}` : ''}
          </h1>
          <p className="text-sm text-slate-500">Yang perlu dikerjakan hari ini dan pembayaran kantor bulan ini.</p>
        </div>

        {galat && <div className="p-3 text-sm rounded-xl bg-rose-50 text-rose-700">{galat}</div>}
        {!k && !galat && <div className="text-sm text-slate-400">Memuat…</div>}

        <div className="flex items-center justify-between gap-3 border-b border-slate-200">
          <div className="flex gap-6" role="tablist">
            {[
              ['tugas', 'Tugas Harian'],
              ['bayar', 'Pembayaran Kantor'],
              ['pajak', `Pajak Kendaraan${k?.kendaraan?.length ? ` (${k.kendaraan.length})` : ''}`],
            ].map(([kunci, label]) => (
              <button
                key={kunci}
                type="button"
                role="tab"
                aria-selected={tab === kunci}
                onClick={() => setTab(kunci)}
                className={`-mb-px pb-2.5 text-sm font-medium border-b-2 ${tab === kunci ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-700'}`}
              >
                {label}
              </button>
            ))}
          </div>
          {tab === 'bayar' && k && (
            <input
              type="month"
              value={bulan}
              max={dayjs().format('YYYY-MM')}
              onChange={(e) => e.target.value && setBulan(e.target.value)}
              className="h-8 px-2 mb-2 text-sm bg-white border rounded-lg border-slate-200 text-slate-600"
              aria-label="Bulan"
            />
          )}
        </div>

        {tab === 'tugas' && data?.tugas && <Tugas t={data.tugas} />}

      {tab === 'bayar' && k && (
        <div className="grid gap-4 md:grid-cols-2">
          {/* Tabungan 1 Juta + BOP satu kartu: satu tombol bayar (gabungan), dua link detail. */}
          <Kartu
            judul="Iuran Bulanan"
            ikon={PiggyBank}
            warna="pink"
            aksi={
              <div className="grid gap-2">
                {bayar && (
                  <Button size="sm" className="w-full gap-1" onClick={() => setDialog('iuran')}>
                    <Plus className="w-4 h-4" /> Bayar iuran
                  </Button>
                )}
              </div>
            }
          >
            {[
              ['Tabungan 1 Juta', k.tabungan, linkKe('tabungan.contributions')],
              ['BOP Pusat', k.bop, linkKe('bop.contributions')],
            ].map(([label, d, href], i) => (
              <div key={label} className={i > 0 ? 'pt-3 mt-3 border-t' : ''}>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800">{label}</span>
                    <TombolDetail href={href} />
                  </span>
                  {tandaIuran(d)}
                </div>
                <IsiIuran d={d} />
              </div>
            ))}
          </Kartu>
          <Kartu
            judul="Tabungan Goro Umrah"
            ikon={Plane}
            warna="teal"
            href={linkKe('dashboard.kasir.goro_umrah')}
            tanda={
              k.umrah.kali_bulan_ini > 0 ? (
                <Tanda jenis="sudah" teks={`Sudah setor ${k.umrah.kali_bulan_ini}x`} />
              ) : (
                <Tanda jenis="belum" teks="Belum setor" />
              )
            }
            aksi={
              bayar &&
              !k.umrah.terkunci && (
                <Button size="sm" className="w-full gap-1" onClick={() => setDialog('umrah')}>
                  <Plus className="w-4 h-4" /> Setor
                </Button>
              )
            }
          >
            <Baris label="Setoran bulan ini" nilai={rp(k.umrah.setoran_bulan_ini)} tebal />
            <Baris label="Total tabungan" nilai={rp(k.umrah.total)} />
            {k.umrah.terkunci && <div className="text-xs font-medium text-slate-500">🔒 Bulan ini sudah dikunci pusat.</div>}
            <Riwayat isi={k.umrah.riwayat} />
          </Kartu>
          {/* Satu kartu Pinjaman Modal (mas 2026-10-21 revisi): per buku sisa + jasa 2% wajib bulan ini;
              pinjaman yang masih tempo 3 bulan belum wajib apa-apa. Satu tombol Bayar. */}
          {(({ modal: m }) => (
            <Kartu
              judul="Pinjaman Modal"
              ikon={Landmark}
              warna="violet"
              href={linkKe('dashboard.kasir.pinjaman_modal')}
              aksi={
                m.boleh_bayar &&
                m.jumlah_aktif > 0 &&
                !m.terkunci_modal && (
                  <Button size="sm" className="w-full gap-1" onClick={() => setModalPilih(m)}>
                    <Plus className="w-4 h-4" /> Bayar angsuran
                  </Button>
                )
              }
              tanda={
                m.jumlah_aktif === 0 ? (
                  <Tanda jenis="netral" teks="Tidak ada pinjaman" />
                ) : m.terakhir ? (
                  <Tanda jenis="sudah" teks={`Sudah bayar ${dayjs(m.terakhir).format('DD MMM')}`} />
                ) : (
                  <Tanda jenis="belum" teks="Belum bayar" />
                )
              }
            >
              {m.buku.map((b, i) => (
                <div key={b.kunci} className={i > 0 ? 'pt-2 mt-2 border-t' : ''}>
                  <Baris label={`Sisa ${b.judul}`} nilai={rp(b.sisa)} tebal />
                  {b.kunci === 'pusat' ? (
                    <Baris label="Jasa" nilai={<span className="text-slate-500">tidak ada</span>} />
                  ) : (
                    b.jasa_wajib !== null && <Baris label="Jasa 2% bulan ini" nilai={<JasaWajib nilai={b.jasa_wajib} />} />
                  )}
                  {b.tempo_sampai && (
                    <div className="text-xs text-amber-600">Ada pinjaman masih tempo, wajib mulai {dayjs(`${b.tempo_sampai}-01`).format('MMM YYYY')}.</div>
                  )}
                </div>
              ))}
              {m.jasa_wajib !== null && (
                <div className="flex items-center justify-between gap-2 px-2 py-1.5 mt-2 text-sm rounded-md bg-violet-50">
                  <span className="font-semibold text-violet-900">Total jasa wajib bulan ini</span>
                  <JasaWajib nilai={m.jasa_wajib} />
                </div>
              )}
              <Baris label="Total sisa pokok" nilai={rp(m.sisa)} tebal />
              <Baris label="Dibayar bulan ini (pokok / jasa)" nilai={`${rp(m.pokok_bulan_ini)} / ${rp(m.jasa_bulan_ini)}`} />
              {m.terkunci_modal && <div className="text-xs font-medium text-slate-500">🔒 Bulan ini sudah dikunci kasir pusat.</div>}
              <Riwayat isi={m.riwayat} />
              <Riwayat isi={m.pinjaman_baru} judul="Tambah pinjaman bulan ini" kata="pinjaman" />
            </Kartu>
          ))(k)}
          <Kartu judul="SKSW" ikon={Wallet} warna="emerald" href={linkKe('sksw.unit')}>
            <Baris label="Saldo SW" nilai={rp(k.sksw.saldo_sw)} tebal />
            <Baris label="Saldo SK" nilai={rp(k.sksw.saldo_sk)} tebal />
            <Baris label="Masuk bulan ini" nilai={rp(k.sksw.masuk)} />
            <Baris label="Keluar bulan ini" nilai={rp(k.sksw.keluar)} />
            <Riwayat isi={k.sksw.riwayat} />
          </Kartu>
        </div>
      )}

      {/* Pajak (her) kendaraan aktif kantor ini: lewat atau <= 30 hari lagi, dihitung dari hari ini. */}
      {tab === 'pajak' && k && (
      <Kartu
        judul="Pajak Kendaraan"
        ikon={Car}
        warna="sky"
        href={linkKe('assets.index')}
        tanda={
          k.kendaraan.length === 0 ? (
            <Tanda jenis="sudah" teks="Tidak ada yang jatuh tempo" />
          ) : k.kendaraan.some((v) => v.sisa_hari < 0) ? (
            <Tanda jenis="belum" teks={`${k.kendaraan.filter((v) => v.sisa_hari < 0).length} lewat jatuh tempo`} />
          ) : (
            <Tanda jenis="kurang" teks={`${k.kendaraan.length} jatuh tempo ≤ 30 hari`} />
          )
        }
      >
        {k.kendaraan.length === 0 ? (
          <div className="text-sm text-slate-500">Tidak ada kendaraan yang pajaknya lewat atau jatuh tempo 30 hari ke depan.</div>
        ) : (
          <div className="grid gap-x-8 gap-y-3 md:grid-cols-2">
            {k.kendaraan.map((v) => (
              <div key={v.asset_id} className="flex items-start justify-between gap-2 text-sm">
                <div className="min-w-0">
                  <div className="font-semibold truncate text-slate-800">
                    {v.plat} <span className="font-normal text-slate-500">{v.nama}</span>
                  </div>
                  <div className="text-xs truncate text-slate-500">{v.pengguna || 'Cadangan'}</div>
                </div>
                <div className={`text-right text-xs shrink-0 ${v.sisa_hari < 0 ? 'text-rose-600 font-semibold' : 'text-amber-600 font-semibold'}`}>
                  {tgl(v.tanggal)}
                  <div>{v.sisa_hari < 0 ? `lewat ${-v.sisa_hari} hari` : v.sisa_hari === 0 ? 'hari ini' : `${v.sisa_hari} hari lagi`}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Kartu>
      )}

      </div>

      <DialogIuran buka={dialog === 'iuran'} onClosed={tutup} data={data} bulan={bulan} />
      <DialogUmrah buka={dialog === 'umrah'} onClosed={tutup} rekening={data?.rekening} />
      <DialogModal
        m={modalPilih}
        rekening={data?.rekening}
        onClosed={() => {
          setModalPilih(null);
          setMuatUlang((n) => n + 1);
        }}
      />
    </section>
  );
}
