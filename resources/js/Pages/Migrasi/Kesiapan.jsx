import PilihBulan from '@/Components/shadcn/PilihBulan';
import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shadcn/ui/table';
import dayjs from 'dayjs';
import ModalMigrasi from './Components/ModalMigrasi';
import DrawerBukuStorting from '@/Pages/NewAngsuran/Components/DrawerBukuStorting';
import { rpAtauStrip as rp } from '@/lib/rupiah';

const HARI = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];


const Kartu = ({ judul, utama, bawah, nada = 'netral' }) => (
  <div
    className={`rounded-lg border bg-white p-4 ${
      { netral: 'border-slate-200', baik: 'border-emerald-200', ingat: 'border-amber-300' }[nada]
    }`}
  >
    <div className="text-xs font-medium tracking-wide uppercase text-slate-500">{judul}</div>
    <div className="mt-1 text-2xl font-semibold tabular-nums text-slate-900">{utama}</div>
    {bawah && <div className="mt-0.5 text-xs text-slate-500">{bawah}</div>}
  </div>
);

// Angka per kolom; 0 di kolom selisih ditampilkan '–' supaya yang meleset menonjol.
const Angka = ({ n, kelas = '', selisih = false, batas = false }) => (
  <TableCell
    className={`px-2 py-1.5 text-right tabular-nums whitespace-nowrap ${batas ? 'border-l' : ''} ${
      selisih && n ? 'font-semibold text-red-600 bg-red-50' : ''
    } ${kelas}`}
  >
    {selisih && !n ? <span className="text-slate-300">–</span> : rp(n)}
  </TableCell>
);

// Kelompok kolom: [kunci kategori, judul, judul kolom ketiga]
const GRUP = [
  ['lancar', 'Lancar', 'Selisih'],
  ['cm', 'CM', 'Selisih'],
  ['mb', 'MB', 'Selisih'],
];

const Kesiapan = ({ datas = [], ringkasan, server_filter }) => {
  const [hanyaBelum, setHanyaBelum] = useState(false);
  const [modal, setModal] = useState(false);
  const [storting, setStorting] = useState(null);
  const baris = hanyaBelum ? datas.filter((b) => !b.siap) : datas;
  const lancarSistem = (s) => s.month1 + s.month2 + s.ccm;
  // Data real = posisi hari terakhir bulan sebelumnya; bucket = baris sirkulasi tanggal 1 periode.
  const akhir = dayjs(server_filter?.periode).subtract(1, 'day').format('D MMM');
  const awal = dayjs(server_filter?.periode).format('D MMM');
  // Hari tagih terakhir bulan sebelumnya untuk hari ini - tanggal buku storting yang dibuka.
  const tanggalBuku = (hari) => {
    let d = dayjs(server_filter?.periode).subtract(1, 'day');
    while (HARI[d.day()] !== hari) d = d.subtract(1, 'day');
    return d.format('YYYY-MM-DD');
  };

  const gantiPeriode = (nilai) =>
    nilai && router.get(route('migrasi.kesiapan'), { periode: `${nilai}-01` }, { preserveScroll: true });

  return (
    <>
      <Head title="Kesiapan Migrasi" />

      <div className="p-4 space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">Kesiapan Migrasi — {server_filter?.unit}</h1>
            <p className="max-w-3xl mt-1 text-sm text-slate-600">
              Saldo awal {dayjs(server_filter?.periode).format('MMMM YYYY')} (= posisi akhir{' '}
              {dayjs(server_filter?.periode).subtract(1, 'month').format('MMMM')}, sebelum ada drop bulan ini) per
              kelompok &amp; hari: angka{' '}
              <b>data real</b> (sisa saldo dari daftar nasabah) dibanding <b>bucket</b> (sirkulasi lama yang dicatat
              kantor). Lancar, CM, dan MB harus sama persis; ML boleh lebih besar di bucket — selisihnya adalah{' '}
              <b>Z</b> (ML belum terinput). Layar
              ini hanya menunjukkan, tidak mengubah apa pun.
            </p>
          </div>
          <div>
            <label className="block mb-1 text-xs font-medium text-slate-600">Periode</label>
            <PilihBulan
              className="w-44"
              value={dayjs(server_filter?.periode).format('YYYY-MM')}
              onChange={(e) => gantiPeriode(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Kartu
            judul="Siap"
            utama={`${ringkasan?.siap ?? 0} / ${ringkasan?.baris ?? 0}`}
            bawah="kelompok × hari"
            nada={ringkasan?.siap === ringkasan?.baris ? 'baik' : 'ingat'}
          />
          <Kartu judul="Z total" utama={`Rp ${rp(ringkasan?.z)}`} bawah="ML belum terinput (Z positif)" />
          <Kartu
            judul="Z minus"
            utama={ringkasan?.z_minus ?? 0}
            bawah="ML data real lebih besar dari bucket"
            nada={ringkasan?.z_minus ? 'ingat' : 'netral'}
          />
          <Kartu
            judul="Status kantor"
            utama={server_filter?.sudah_migrasi ? 'Sudah migrasi' : 'Belum migrasi'}
          />
        </div>

        {/* Tombol migrasi: hanya kalau belum migrasi dan SEMUA kelompok x hari siap.
            Modal memeriksa anomali & tanggal kunci; server mengecek ulang semuanya. */}
        {server_filter?.sudah_migrasi ? (
          <div className="p-3 text-sm border rounded-lg border-sky-200 bg-sky-50 text-sky-900">
            <b>{server_filter?.unit}</b> sudah migrasi ke pendataan baru mulai{' '}
            <b>{dayjs(server_filter?.mulai).format('DD MMMM YYYY')}</b>.
          </div>
        ) : (
          ringkasan?.baris > 0 &&
          ringkasan?.siap === ringkasan?.baris && (
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 border rounded-lg border-emerald-300 bg-emerald-50">
              <div className="text-sm text-emerald-900">
                Semua <b>{ringkasan.baris}</b> kelompok × hari siap. Kantor ini bisa dimigrasikan ke pendataan baru
                mulai <b>{dayjs(server_filter?.periode).format('DD MMMM YYYY')}</b>.
              </div>
              <button
                type="button"
                className="px-4 py-2 text-sm font-semibold text-white rounded-md bg-emerald-600 hover:bg-emerald-700"
                onClick={() => setModal(true)}
              >
                Migrasikan kantor ini
              </button>
              <ModalMigrasi open={modal} onOpenChange={setModal} unit={server_filter?.unit} periode={server_filter?.periode} />
            </div>
          )
        )}

        <label className="inline-flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" checked={hanyaBelum} onChange={(e) => setHanyaBelum(e.target.checked)} />
          Tampilkan yang belum siap saja
        </label>

        <div className="overflow-x-auto bg-white border rounded-lg">
          <Table className="text-xs">
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead rowSpan={2} className="sticky left-0 z-10 px-2 bg-slate-50">Kel</TableHead>
                <TableHead rowSpan={2} className="px-2">Hari</TableHead>
                <TableHead colSpan={2} className="px-2 text-center border-l">Rincian lancar (data real)</TableHead>
                {GRUP.map(([k, judul]) => (
                  <TableHead key={k} colSpan={3} className="px-2 text-center border-l">{judul}</TableHead>
                ))}
                <TableHead colSpan={3} className="px-2 text-center border-l">ML</TableHead>
                <TableHead rowSpan={2} className="px-2 border-l">Status</TableHead>
              </TableRow>
              <TableRow>
                {[1, 2].map((mundur) => `Drop ${dayjs(server_filter?.periode).subtract(mundur, 'month').format('MMM')}`).map((j, i) => (
                  <TableHead key={j} className={`px-2 text-right ${i === 0 ? 'border-l' : ''}`}>{j}</TableHead>
                ))}
                {GRUP.map(([k, , ketiga]) => (
                  <React.Fragment key={k}>
                    <TableHead className="px-2 text-right border-l">Real {akhir}</TableHead>
                    <TableHead className="px-2 text-right">Bucket {awal}</TableHead>
                    <TableHead className="px-2 text-right">{ketiga}</TableHead>
                  </React.Fragment>
                ))}
                <TableHead className="px-2 text-right border-l">Real {akhir}</TableHead>
                <TableHead className="px-2 text-right">Bucket {awal}</TableHead>
                <TableHead className="px-2 text-right">Z</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {baris.map((b) => (
                <TableRow key={b.kunci} className={b.siap ? '' : 'bg-amber-50/50'}>
                  <TableCell className="sticky left-0 px-2 py-1.5 font-medium bg-inherit">{b.kelompok}</TableCell>
                  <TableCell className="px-2 py-1.5 capitalize">
                    {/* Buku Storting kelompok x hari ini (drawer), posisi hari tagih terakhir bulan sebelumnya. */}
                    <button
                      type="button"
                      onClick={() => setStorting({ kelompok: b.kelompok, hari: b.hari, tanggal: tanggalBuku(b.hari) })}
                      className="capitalize underline decoration-dotted text-sky-700 hover:text-sky-900"
                    >
                      {b.hari}
                    </button>
                  </TableCell>
                  <Angka n={b.sistem.month2} kelas="text-slate-500" batas />
                  <Angka n={b.sistem.ccm} kelas="text-slate-500" />
                  {GRUP.map(([k]) => (
                    <React.Fragment key={k}>
                      <Angka n={k === 'lancar' ? lancarSistem(b.sistem) : b.sistem[k]} kelas="font-medium" batas />
                      <Angka n={b.lama?.[k]} />
                      <Angka n={b.selisih?.[k]} selisih />
                    </React.Fragment>
                  ))}
                  <Angka n={b.sistem.ml} kelas="font-medium" batas />
                  <Angka n={b.lama?.ml} />
                  <Angka
                    n={b.z}
                    kelas={`font-semibold ${b.z < 0 ? 'text-red-600 bg-red-50' : b.z > 0 ? 'text-violet-700' : 'text-slate-300'}`}
                  />
                  <TableCell className="px-2 py-1.5 border-l whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {b.siap ? (
                        <span className="font-semibold text-emerald-700">Siap</span>
                      ) : (
                        <span className="text-amber-800">{b.alasan.join(' · ')}</span>
                      )}
                      {b.macet_lama ? (
                        <span className="text-[11px] text-violet-700">MACET LAMA ada</span>
                      ) : (
                        b.z > 0 && (
                          <button
                            type="button"
                            className="px-2 py-0.5 text-[11px] font-semibold text-white rounded-md bg-violet-600 hover:bg-violet-700"
                            onClick={() =>
                              confirm(`Buat MACET LAMA kelompok ${b.kelompok} ${b.hari} dengan saldo Rp ${rp(b.z)}?`) &&
                              router.post(
                                route('migrasi.buat_macet_lama'),
                                { kelompok: b.kelompok, hari: b.hari, periode: server_filter?.periode },
                                { preserveScroll: true },
                              )
                            }
                          >
                            Buat MACET LAMA
                          </button>
                        )
                      )}
                      <Link
                        href={route('migrasi.nasabah_macet', { kelompok: b.kelompok, hari: b.hari })}
                        className="px-2 py-0.5 ml-auto text-[11px] font-semibold border rounded-md text-violet-700 border-violet-300 hover:bg-violet-50"
                      >
                        Sesuaikan ML
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {ringkasan && (
                <TableRow className="font-semibold bg-slate-100">
                  <TableCell colSpan={2} className="sticky left-0 px-2 py-2 bg-slate-100">Total</TableCell>
                  <Angka n={ringkasan.sistem.month2} batas />
                  <Angka n={ringkasan.sistem.ccm} />
                  {GRUP.map(([k]) => (
                    <React.Fragment key={k}>
                      <Angka n={k === 'lancar' ? lancarSistem(ringkasan.sistem) : ringkasan.sistem[k]} batas />
                      <Angka n={ringkasan.lama[k]} />
                      <Angka
                        n={(k === 'lancar' ? lancarSistem(ringkasan.sistem) : ringkasan.sistem[k]) - ringkasan.lama[k]}
                        selisih
                      />
                    </React.Fragment>
                  ))}
                  <Angka n={ringkasan.sistem.ml} batas />
                  <Angka n={ringkasan.lama.ml} />
                  <Angka n={ringkasan.lama.ml - ringkasan.sistem.ml} />
                  <TableCell className="border-l" />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <DrawerBukuStorting target={storting} onClosed={() => setStorting(null)} />
    </>
  );
};

export default Kesiapan;
