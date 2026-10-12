import React, { useEffect, useState } from 'react';

import { Label } from '@/shadcn/ui/label';
import CurrencyInput from 'react-currency-input-field';
import { Button } from '@/shadcn/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';
import { Link, useForm } from '@inertiajs/react';
import { useFilterAngsuran } from '../FilterAngsuran';
import Loading from '@/Components/Loading';
import { getLastDateForHari } from '@/lib/utils';
import useHariLibur from '@/Hooks/useHariLibur';
import TanggalKerja from '@/Components/shadcn/TanggalKerja';
import dayjs from 'dayjs';

const BayarAngsuran = ({ triggeredId, triggeredPinjaman, instalment, pelunasanTertunda = false }) => {
  const [alertPelunasan, setAlertPelunasan] = useState(false);

  // Pinjaman yang sedang diajukan pelunasan: setiap sentuhan ke isian
  // angsuran dicegat dan diganti peringatan.
  const cegat = (e) => {
    if (!pelunasanTertunda) return;
    e.preventDefault();
    e.stopPropagation();
    e.target.blur?.();
    setAlertPelunasan(true);
  };

  const [triggeredData, setTriggeredData] = useState({});
  useEffect(() => {
    setTriggeredData(triggeredPinjaman);
  }, [triggeredPinjaman]);

  const {
    tanggal: tanggalTerpilih,
    is_locked: terkunci,
    month: bulanBuku,
  } = useFilterAngsuran();

  // Buku harian (HP) membawa tanggal di filter -> tanggal bayar terkunci ke
  // situ. Buku BULANAN (desktop /pinjaman) tidak punya tanggal: user memilih
  // tanggal tagih di bulan buku itu, paling jauh hari ini.
  const bulanan = !tanggalTerpilih && !!bulanBuku;
  const HARI_KE = { minggu: 0, senin: 1, selasa: 2, rabu: 3, kamis: 4, jumat: 5, sabtu: 6 };
  const awalBulan = bulanan ? dayjs(bulanBuku).startOf('month') : null;
  const batasAkhir = bulanan
    ? (dayjs(bulanBuku).endOf('month').isBefore(dayjs(), 'day') ? dayjs(bulanBuku).endOf('month') : dayjs())
    : null;
  // Tanggal tagih terakhir (hari tagih pinjaman) di bulan buku, <= hari ini.
  const tagihTerakhirBulan = (hari) => {
    let d = batasAkhir;
    while (d && !d.isBefore(awalBulan, 'day') && d.day() !== HARI_KE[String(hari).toLowerCase()]) d = d.subtract(1, 'day');
    return d && !d.isBefore(awalBulan, 'day') ? d.format('YYYY-MM-DD') : '';
  };

  const { mundurKeHariKerja, siap: kalenderSiap } = useHariLibur();

  const { data, setData, post, errors, processing, reset, recentlySuccessful } =
    useForm({
      type_transaksi: 'bayar',
      transaction_date: '',
      nominal: '0',
      danatitipan: false,
      is_transfer: false,
      id: '',
    });

  useEffect(() => {
    setData('id', triggeredId);
  }, [triggeredId, recentlySuccessful]);

  const setNominal = (v) => setData('nominal', String(v));
  const tambah = (v) => setData('nominal', String((parseInt(data.nominal) || 0) + v));

  const onSubmitForm = (e) => {
    e.preventDefault();
    if (pelunasanTertunda) {
      setAlertPelunasan(true);
      return;
    }
    post(route('pinjaman.bayar_pinjaman', data.id), {
      preserveScroll: true,
      onSuccess: () => {
        // transaction_date JANGAN di-reset: nilai awalnya '' dan efek yang
        // mengisinya tidak jalan lagi -> hapus lalu bayar ulang (modal masih
        // terbuka) terkirim tanpa tanggal dan ditolak.
        reset('nominal', 'danatitipan', 'is_transfer');
      },
    });
  };

  useEffect(() => {
    // Tanggalnya diturunkan dari hari tagih pinjaman dan kolomnya dimatikan,
    // jadi user tidak punya cara membetulkannya. Kalau hari tagih terakhir
    // ternyata libur, server akan menolaknya (App\Rules\HariKerja) dan
    // pembayaran jadi BUNTU. Karena itu yang menurunkan tanggal harus ikut
    // tahu kalender: mundur ke hari tagih terakhir yang benar-benar bekerja.
    setData((prev) => ({
      ...prev,
      transaction_date: tanggalTerpilih
        ? tanggalTerpilih
        : bulanan
          ? mundurKeHariKerja(tagihTerakhirBulan(triggeredPinjaman?.hari))
          : mundurKeHariKerja(getLastDateForHari(triggeredPinjaman?.hari)),
    }));
  }, [triggeredPinjaman?.hari, kalenderSiap, tanggalTerpilih, bulanBuku]);

  // Angka cepat dari pinjaman INI (angka saja, tanpa label), urut:
  //   bayaran terakhir (bukan 0) sebelum tanggal ini -> paling sering dibayar
  //   nasabah ini -> wajib (pinjaman / 10, angsuran
  //   terakhir cukup sebesar sisa) -> 2x wajib -> 3x wajib -> lunasi (sisa).
  // Angka dobel dibuang; yang melebihi sisa dibuang (server menolak bayar > sisa).
  const sisa = Math.max(Number(triggeredData?.saldo) || 0, 0);
  const wajib = Math.min(Math.round((Number(triggeredData?.pinjaman) || 0) / 10), sisa);
  const sering = (() => {
    const hitung = {};
    instalment.forEach((i) => Number(i.nominal) > 0 && (hitung[i.nominal] = (hitung[i.nominal] || 0) + 1));
    const [nominal] = Object.entries(hitung).sort((a, b) => b[1] - a[1])[0] ?? [];
    return Number(nominal) || 0;
  })();
  const bayarTerakhir = [...instalment]
    .filter((i) => Number(i.nominal) > 0 && String(i.transaction_date) < String(data.transaction_date))
    .sort((a, b) => String(b.transaction_date).localeCompare(String(a.transaction_date)))[0];
  const terakhir = Number(bayarTerakhir?.nominal ?? 0);

  // Cara bayar bawaan mengikuti bayaran terakhir (bukan 0): kemarin transfer ->
  // hari ini Transfer, selain itu Tunai. Katrol tidak pernah jadi bawaan.
  const transferTerakhir = !!bayarTerakhir?.is_transfer;
  // Diterapkan saat ganti pinjaman / data pertama tiba / sesudah simpan
  // berhasil - BUKAN tiap data dimuat ulang, supaya pilihan user tidak hilang
  // waktu server menolak.
  useEffect(() => {
    setData((prev) => ({ ...prev, is_transfer: transferTerakhir, danatitipan: false }));
  }, [transferTerakhir, triggeredId, recentlySuccessful]);
  const pilihan = [...new Set([terakhir, sering, wajib, wajib * 2, wajib * 3, sisa])].filter(
    (v) => v > 0 && v <= sisa,
  );
  const nol = Number(data.nominal || 0) === 0;
  const cara = data.is_transfer ? 'transfer' : data.danatitipan ? 'katrol' : 'tunai';
  // Katrol (dana titipan) hanya untuk pinjaman CM sampai ML: selisih bulan
  // kalender drop -> tanggal bayar >= 3 (aturan ember yang sama dgn Ember::dari).
  const selisihBulan = (a, b) => {
    const [y1, m1] = String(a).split('-').map(Number);
    const [y2, m2] = String(b).split('-').map(Number);
    return y2 * 12 + m2 - (y1 * 12 + m1);
  };
  const bolehKatrol =
    !!triggeredData?.tanggal_drop &&
    !!data.transaction_date &&
    selisihBulan(triggeredData.tanggal_drop, data.transaction_date) >= 3;

  const rp = (v) => (Number(v) || 0).toLocaleString('id-ID');
  // Tombol angka: 65000 -> "65 rb", 35500 -> "35,5 rb" (sama gaya dgn +1 rb).
  const rb = (v) => `${((Number(v) || 0) / 1000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} rb`;

  return (
    // Tanpa Card sendiri - sudah berada di dalam TabsContent "Input
    // Angsuran" (Action.jsx), pembungkus Card di sini dulu bikin kotak
    // bertumpuk (Card di dalam Card).
    <div className="relative w-full">
      <Loading show={processing} />
      <form onSubmit={onSubmitForm} className="space-y-3">
        <div>
          <Label htmlFor="tanggal_bayar">Tanggal bayar</Label>
          {bulanan ? (
            <>
              <TanggalKerja
                className="mt-1"
                name="transaction_date"
                value={data.transaction_date}
                onChange={(e) => setData('transaction_date', e.target.value)}
                hariTagih={triggeredPinjaman?.hari}
                // Tidak lagi terkunci ke bulan buku (mas 2026-10-13): mulai sesudah
                // tanggal drop, jadi angsuran bulan lalu bisa diinput dari buku ini.
                min={
                  triggeredData?.tanggal_drop
                    ? dayjs(triggeredData.tanggal_drop).add(1, 'day').format('YYYY-MM-DD')
                    : awalBulan.format('YYYY-MM-DD')
                }
                // Paling jauh HARI INI, bukan akhir bulan buku: buku bulan lalu
                // tetap bisa dipakai menginput angsuran bulan berjalan.
                max={dayjs().format('YYYY-MM-DD')}
              />
              <small className="block mt-1 text-[11px] text-muted-foreground">
                Pilih tanggal tagih sesudah tanggal drop sampai hari ini.
              </small>
              {data.transaction_date && !dayjs(data.transaction_date).isSame(awalBulan, 'month') && (
                <small className="block mt-1 text-[11px] font-medium text-amber-700">
                  Tanggal ini di luar bulan buku — angsurannya tampil di buku{' '}
                  {dayjs(data.transaction_date).format('MMMM YYYY')}, bukan di buku yang sedang dibuka.
                </small>
              )}
            </>
          ) : (
          <>
          {/* Tampil sebagai input supaya sejajar dengan isian lain, tapi tidak
              bisa diubah/diklik: tanggal mengikuti filter halaman. */}
          <input
            id="tanggal_bayar"
            type="text"
            readOnly
            tabIndex={-1}
            value={
              data.transaction_date
                ? new Date(`${data.transaction_date}T00:00:00`).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })
                : ''
            }
            className="flex w-full px-3 py-1 mt-1 text-sm border rounded-md shadow-xs pointer-events-none select-none h-9 border-input bg-muted text-muted-foreground"
          />
          <small className="block mt-1 text-[11px] text-muted-foreground">
            Ikut tanggal di filter atas, tidak bisa diubah di sini.
          </small>
          </>
          )}
        </div>

        <div className="space-y-3" onClickCapture={cegat} onFocusCapture={cegat}>
        <div>
          <Label htmlFor="nominal">Nominal angsuran</Label>
          <CurrencyInput
            id="nominal"
            className="flex w-full px-3 py-1 mt-1 text-sm border rounded-md shadow-xs h-9 tabular-nums border-input focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            name="nominal"
            allowDecimals={false}
            allowNegativeValue={false}
            prefix="Rp "
            groupSeparator="."
            decimalSeparator=","
            min={0}
            required
            disabled={terkunci}
            onValueChange={(value) => setData('nominal', value ?? '')}
            value={data.nominal}
            placeholder="0"
          />
          <small className="block mt-1 text-[11px] text-muted-foreground">
            Sisa saldo sekarang <b className="text-foreground tabular-nums">Rp {rp(sisa)}</b>
          </small>
          {errors.nominal && <p className="mt-1 text-xs text-red-600">{errors.nominal}</p>}
        </div>

        {/* Tombol nominal rata kanan: dekat jempol kanan di HP. */}
        <div className="flex flex-wrap justify-end gap-1.5">
          {pilihan.map((nilai) => (
            <Button
              key={nilai}
              type="button"
              variant="outline"
              size="xs"
              className="text-green-700 border-green-600 tabular-nums hover:bg-green-50 hover:text-green-800"
              onClick={() => setNominal(nilai)}
              disabled={terkunci}
            >
              {rb(nilai)}
            </Button>
          ))}
        </div>

        <div className="flex items-center justify-end gap-2">
          <span className="text-xs text-muted-foreground">Tambah</span>
          {[1000, 5000, 10000].map((v) => (
            <Button key={v} type="button" variant="outline" size="xs" onClick={() => tambah(v)} disabled={terkunci}>
              +{v / 1000} rb
            </Button>
          ))}
        </div>

        {/* Cara bayar: satu pilihan, karena katrol tidak mungkin transfer.
            Tunai = keduanya 0, Transfer = is_transfer, Katrol = danatitipan
            (dana titipan; nama kolom lama, tidak diubah). */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="inline-flex items-center h-9 p-0.5 rounded-md bg-muted">
            {[
              ['tunai', 'Tunai'],
              ['transfer', 'Transfer'],
              ['katrol', 'Katrol'],
            ].map(([nilai, label]) => (
              <button
                key={nilai}
                type="button"
                disabled={terkunci || (nilai === 'katrol' && !bolehKatrol)}
                title={nilai === 'katrol' && !bolehKatrol ? 'Katrol hanya untuk pinjaman CM sampai ML' : undefined}
                onClick={() =>
                  setData((prev) => ({ ...prev, is_transfer: nilai === 'transfer', danatitipan: nilai === 'katrol' }))
                }
                className={`h-8 px-3 text-sm rounded disabled:opacity-40 ${
                  cara === nilai ? 'bg-white shadow-sm font-semibold' : 'text-muted-foreground'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <Button
            disabled={processing || terkunci || data.nominal === ''}
            type="submit"
            variant={nol ? 'destructive' : 'default'}
            className="shrink-0"
          >
            Simpan
          </Button>
        </div>
        </div>
      </form>

      <Dialog open={alertPelunasan} onOpenChange={setAlertPelunasan}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle>Sedang diajukan pelunasan</DialogTitle>
            <DialogDescription>
              Angsuran ini ada di drop pelunasan, klik drop untuk mengisi pelunasan / gagalkan terlebih dahulu.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            {/* Buka buku drop di bulan + hari + kelompok pengajuan penggantinya,
                tempat drop / gagal pelunasan dikerjakan. */}
            <Button asChild>
              <Link
                href={route('transaction.index_buku_transaksi', {
                  kelompok: triggeredPinjaman?.kelompok,
                  hari: triggeredPinjaman?.hari,
                  month: String(triggeredPinjaman?.pengajuan_pengganti?.drop_date ?? '').slice(0, 7) || undefined,
                })}
              >
                Ke Drop
              </Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BayarAngsuran;
