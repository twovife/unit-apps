import React, { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { X } from 'lucide-react';
import TextInput from '@/Components/TextInput';
import BargeStatus from '@/Components/shadcn/BargeStatus';
import BadgeStatus from '@/Components/shadcn/BadgeStatus';
import Action from './Action';
import { Button } from '@/shadcn/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';

// Angka dalam ribuan: 650000 -> "650", 1300000 -> "1.300", 35500 -> "35,5".
const ribuan = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 1 });
const rb = (v) => ribuan.format((Number(v) || 0) / 1000);

const jumlah = (rows, key) => rows.reduce((t, r) => t + (Number(r[key]) || 0), 0);

// Angsuran wajib per minggu = pinjaman / 10 (= drop × 13%). Angsuran terakhir
// cukup sebesar sisanya, jadi dibatasi sisa sebelum bayar hari ini.
const wajib = (r) => Math.min(Number(r.pinjaman) / 10, Number(r.saldo) + Number(r.angs_today) + md(r));
// Pemutihan (MD) di tanggal terpilih - dianggap terbayar (nasabah dilunaskan).
const md = (r) => Number(r.md_hari_ini) || 0;

// Status hari ini: drop baru (belum bisa ditagih) / belum dicatat / dicatat
// tidak bayar (0) / bayar.
const statusHariIni = (r) =>
  r.drop_baru ? 'baru' : !r.is_paid ? 'belum' : Number(r.angs_today) > 0 || md(r) > 0 ? 'bayar' : 'tidak';

// Cara bayar hari ini (`instalment` dari server hanya berisi tanggal terpilih).
// Aturan sama dengan HitungAgregat::caraBayar: transfer > katrol > tunai.
const caraBayar = (r) => {
  const i = Object.values(r.instalment ?? {});
  if (i.some((x) => x.is_transfer)) return 'tf';
  if (i.some((x) => x.is_active)) return 'katrol';
  return 'tunai';
};

// Warna BARIS menurut angsuran hari ini (konsep 2026-10-11: latar yang berubah,
// bukan warna angka). Katrol dianggap terbayar -> hijau, ditandai "K".
const warnaBaris = (r) => {
  const s = statusHariIni(r);
  if (s === 'baru') return 'bg-gray-50 text-gray-400';
  if (s === 'belum') return 'bg-white';
  if (s === 'tidak') return 'bg-red-100 border-l-4 border-l-red-500';
  if (caraBayar(r) !== 'katrol' && Number(r.angs_today) + md(r) < wajib(r)) return 'bg-amber-100 border-l-4 border-l-amber-500';
  return 'bg-emerald-100 border-l-4 border-l-emerald-500';
};

// Warna ANGKA angsuran hari ini: senada dengan latar baris, lebih menyala.
const warnaAngka = (r) => {
  const s = statusHariIni(r);
  if (s === 'tidak') return 'text-red-600';
  if (caraBayar(r) !== 'katrol' && Number(r.angs_today) + md(r) < wajib(r)) return 'text-amber-600';
  return 'text-emerald-600';
};

// Urutan dalam grup: tanggal drop -> yang punya nomor anggota dulu (kecil ke
// besar, angka dibanding sebagai angka) -> yang belum punya nomor: nama A-Z.
const urut = (a, b) =>
  String(a.tanggal_drop).localeCompare(String(b.tanggal_drop)) ||
  !a.nomor_anggota - !b.nomor_anggota ||
  String(a.nomor_anggota ?? '').localeCompare(String(b.nomor_anggota ?? ''), 'id', { numeric: true }) ||
  String(a.nama).localeCompare(String(b.nama), 'id');

const FILTER = [
  ['semua', 'Semua'],
  ['belum', 'Belum'],
  ['bayar', 'Bayar'],
  ['tidak', 'Tidak bayar'],
];

// Dua baris per nasabah, satu template kolom untuk semua baris -> angka sejajar:
//   no.anggota | drop | nama   | ANGS (melebar 2 kolom, besar)
//   (TG)       |      | alamat | pinj | sisa   (kecil, abu)
const KOLOM = 'grid grid-cols-[2.2rem_2.4rem_1fr_3.2rem_3.2rem] gap-x-1 tabular-nums';
const ANGS = 'col-span-2 text-right pr-1';
const KECIL = 'text-[11px] text-gray-500';

const AngsuranTableMobile = ({ datas }) => {
  const [filterName, setFilterName] = useState('');
  const [filterStatus, setFilterStatus] = useState('semua');
  const [triggeredId, setTriggeredId] = useState(null);
  const [show, setShow] = useState(false);
  const [dropBaru, setDropBaru] = useState(null);

  // Lunas yang tidak dibayar hari ini tidak perlu ditagih -> disembunyikan.
  const grup = useMemo(
    () => (datas ?? []).map((g) => ({ ...g, data: g.data.filter((r) => !(r.lunas && !r.is_paid)).sort(urut) })),
    [datas]
  );

  const semua = grup.flatMap((g) => g.data);
  const banyak = (s) => (s === 'semua' ? semua.length : semua.filter((r) => statusHariIni(r) === s).length);

  // Angka total = jumlah baris yang TAMPIL, supaya cocok dengan isi tabel.
  const tampil = (r) =>
    (!filterName || r.nama.toLowerCase().includes(filterName.toLowerCase())) &&
    (filterStatus === 'semua' || statusHariIni(r) === filterStatus);
  const grupTampil = grup.map((g) => ({ ...g, data: g.data.filter(tampil) })).filter((g) => g.data.length);
  const semuaTampil = grupTampil.flatMap((g) => g.data);

  const buka = (id) => {
    setTriggeredId(id);
    setShow(true);
  };

  return (
    // Satu scroll saja (halaman): filter tanggal/kelompok ikut tergulung, blok
    // chip + judul kolom menempel di bawah navbar (h-14), TOTAL di dasar layar.
    <div className="text-xs">
      <div className="sticky z-20 bg-white shadow-sm top-14">
        <div className="flex flex-wrap gap-1.5 px-2 pt-1">
          {FILTER.map(([nilai, label]) => (
            <button
              key={nilai}
              type="button"
              onClick={() => setFilterStatus(nilai)}
              className={`px-2.5 py-1 rounded-full border ${
                filterStatus === nilai ? 'bg-gray-900 text-white border-gray-900' : 'bg-white'
              } ${nilai === 'tidak' && filterStatus !== nilai ? 'text-red-600' : ''}`}
            >
              {label} {banyak(nilai)}
            </button>
          ))}
        </div>
        <div className="relative px-2 py-1.5">
          <TextInput
            type="text"
            placeholder="Cari nama"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            className="w-full pr-8 text-xs"
          />
          {filterName && (
            <X
              className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 right-4 top-1/2"
              onClick={() => setFilterName('')}
            />
          )}
        </div>
        <div className="px-2 pb-1 text-[10px] text-gray-500">
          Ketuk baris untuk bayar / lihat detail · angka dalam ribuan · Warna baris:{' '}
          <span className="px-1 rounded bg-emerald-100 text-emerald-800">sesuai</span>{' '}
          <span className="px-1 text-amber-800 rounded bg-amber-100">kurang</span>{' '}
          <span className="px-1 text-red-800 bg-red-100 rounded">0</span>{' '}
          · <b>K</b> katrol · <b>TF</b> transfer · <b className="text-red-600">MD</b> pemutihan ·{' '}
          <span className="px-1 text-gray-500 bg-white border rounded">belum</span>
        </div>

        <div className={`${KOLOM} px-2 py-1 text-gray-500 border-t`}>
          {/* No & Drop di tengah (dua baris); Nasabah satu label saja. */}
          <div className={`${KECIL} row-span-2 self-center text-center`}>No</div>
          <div className="self-center row-span-2 text-center">Drop</div>
          <div className="self-center row-span-2">Nasabah</div>
          <div className={`${ANGS} font-bold text-gray-800`}>Hari ini</div>
          <div className={`${KECIL} text-right`}>Pinj</div>
          <div className={`${KECIL} text-right`}>Sisa</div>
        </div>
      </div>

      {grupTampil.map((g, gi) => (
        <section key={gi} className="mt-4 first:mt-0">
          <div className="flex items-center gap-2 px-2 py-1.5 font-semibold text-white bg-gray-800">
            <BargeStatus value={g.type2} />
            <span className="truncate">{g.month}</span>
            <span className="ml-auto text-[11px] font-normal text-gray-300">{g.data.length} nasabah</span>
          </div>

          {g.data.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => (r.drop_baru ? setDropBaru(r) : buka(r.id))}
              className={`${KOLOM} w-full px-2 py-1.5 text-left border-b active:brightness-95 ${warnaBaris(r)}`}
            >
              <NoAnggota r={r} />
              <div className="text-center text-gray-500">{dayjs(r.tanggal_drop).format('DD-MM')}</div>
              <div className="min-w-0 text-sm font-semibold truncate">
                {r.nama}
                {r.notes && <BadgeStatus className="ml-1">{r.notes}</BadgeStatus>}
              </div>
              <div className={ANGS}>
                <Angs r={r} />
              </div>

              <div />
              <div className={`${KECIL} min-w-0 truncate`}>
                {r.alamat}
              </div>
              <div className={`${KECIL} text-right`}>{rb(r.pinjaman)}</div>
              {/* Sisa tebal & lebih gelap: angka yang paling sering dilihat. */}
              <div className={`${KECIL} text-right font-bold text-gray-800`}>
                {r.lunas ? <span className="text-green-700">lunas</span> : rb(r.saldo)}
              </div>
            </button>
          ))}

          <Jumlah label={`Jumlah ${g.month}`} rows={g.data} ml={g.type === 'ml'} />
        </section>
      ))}

      <Jumlah
        label={`TOTAL (${semuaTampil.length})`}
        rows={semuaTampil}
        total
        ml={grupTampil.length > 0 && grupTampil.every((g) => g.type === 'ml')}
      />

      <Dialog open={!!dropBaru} onOpenChange={(open) => !open && setDropBaru(null)}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle>Drop baru</DialogTitle>
            <DialogDescription>
              {dropBaru?.nama} di-drop hari ini, tidak bisa diangsur hari ini.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setDropBaru(null)}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Action
        datas={grup}
        show={show}
        onClosed={() => {
          setShow(false);
          setTriggeredId(null);
        }}
        triggeredId={triggeredId}
      />
    </div>
  );
};

// Baris jumlah dengan susunan kolom yang sama. Subtotal: latar hijau muda +
// garis atas hijau, beda jelas dari baris nasabah. Total: bar gelap yang
// menempel di dasar layar. ML: hanya angsuran hari ini (jumlah pinjaman &
// sisa ML tidak berguna dibaca).
const Jumlah = ({ label, rows, total = false, ml = false }) => (
  <div
    className={`${KOLOM} px-2 py-1.5 font-bold ${
      total ? 'sticky bottom-0 z-10 mt-4 bg-gray-900 text-white' : 'bg-emerald-100 text-emerald-950 border-t-2 border-emerald-500'
    }`}
  >
    <div className="min-w-0 col-span-3 truncate">{label}</div>
    <div className={`col-span-2 pr-1 text-base text-right ${total ? 'text-green-300' : 'text-green-700 bg-emerald-50'}`}>
      {rb(jumlah(rows, 'angs_today'))}
    </div>
    {!ml && (
      <>
        <div className="col-span-3" />
        <div className={`text-[11px] text-right ${total ? 'text-gray-300' : 'text-emerald-900/70'}`}>{rb(jumlah(rows, 'pinjaman'))}</div>
        <div className={`text-[11px] font-extrabold text-right ${total ? 'text-white' : 'text-gray-900'}`}>{rb(jumlah(rows, 'saldo'))}</div>
      </>
    )}
  </div>
);

// Nomor anggota: dilingkari kalau sudah keluar target, "TG" di bawahnya kalau masih target.
const NoAnggota = ({ r }) => (
  <div className="flex flex-col items-center row-span-2 gap-0.5 pt-0.5">
    <span
      className={`text-[11px] font-semibold leading-none truncate max-w-full ${
        r.keluar_target
          ? 'inline-flex items-center justify-center min-w-6 h-6 px-1 rounded-full border-2 border-red-600 text-red-600'
          : 'text-gray-800'
      }`}
    >
      {r.nomor_anggota || '–'}
    </span>
    {!r.keluar_target && <span className="text-[10px] font-bold text-blue-700">TG</span>}
  </div>
);

// Angsuran hari ini: "–" = belum dicatat, merah 0 = dicatat tidak bayar.
const Angs = ({ r }) => {
  const s = statusHariIni(r);

  if (s === 'baru') {
    return <span className="px-1.5 py-0.5 text-[10px] font-bold text-sky-700 bg-sky-100 rounded">BARU</span>;
  }

  if (s === 'belum') {
    return <span className="text-base text-gray-300">–</span>;
  }

  // Pemutihan hari itu: "MD -nominal" kecil di bawah angka angsuran.
  const tandaMd = md(r) > 0 && (
    <span className="block text-[11px] font-semibold leading-tight text-red-600">
      <span className="mr-0.5 text-[9px]">MD</span>-{rb(md(r))}
    </span>
  );
  if (Number(r.angs_today) === 0 && md(r) > 0) return tandaMd;

  return (
    // Angka paling mencolok di baris: tebal, warna senada latar (warnaAngka).
    // Tanda kecil di depan angka: K = katrol (dana titipan), TF = transfer.
    <>
      <span className={`text-lg font-extrabold ${warnaAngka(r)}`}>
        {caraBayar(r) !== 'tunai' && (
          <span className="mr-1 align-middle text-[10px] font-semibold text-gray-600">
            {caraBayar(r) === 'tf' ? 'TF' : 'K'}
          </span>
        )}
        {rb(r.angs_today)}
      </span>
      {tandaMd}
    </>
  );
};

export default AngsuranTableMobile;
