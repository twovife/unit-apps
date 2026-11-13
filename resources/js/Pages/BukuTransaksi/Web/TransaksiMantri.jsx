import SearchComponent from '@/Components/shadcn/SearchComponent';
import FilterBar from '@/Components/FilterBar';
import { Button } from '@/shadcn/ui/button';
import { Head, usePage } from '@inertiajs/react';
import { ClipboardList, FilterIcon, PlusCircle } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Popover, PopoverContent, PopoverTrigger } from '@/shadcn/ui/popover';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/shadcn/ui/sheet';
import BukuTransaksi from '@/Pages/BukuTransaksi/BukuTransaksi';
import BukuTransaksiKepala from '@/Pages/BukuTransaksi/BukuTransaksiKepala';
import Create from './Create';
import Rencana from '@/Pages/BukuTransaksi/Rencana';
import DrawerAngsuran from '@/Pages/BukuTransaksi/Components/DrawerAngsuran';
import SatuanAngka from '@/Components/SatuanAngka';

const NAMA_BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

/**
 * Satu halaman untuk `/bukutransaksi`, dipakai di semua lebar layar - tidak
 * ada lagi route/halaman terpisah untuk mobile ("buku-transaksi-kepala").
 * Tampilan bercabang lewat CSS (`hidden lg:block` / `lg:hidden`), BUKAN
 * lewat deteksi device di server maupun JS - data yang dikirim server sama.
 *
 * Filter hari/bulan/kelompok memakai `FilterBar` yang SAMA di semua lebar
 * layar (dulu desktop masih pakai dropdown `SearchComponent` terpisah dari
 * mobile - sekarang disatukan). `SearchComponent` disisakan HANYA untuk
 * filter Unit/Wilayah (`canShowBranch`/`canShowGroupingBranch`) karena
 * opsinya perlu di-fetch dari server dan cuma relevan untuk role level
 * wilayah/pusat - bukan sesuatu yang perlu tampil sebagai chip instan.
 */
const TransaksiMantri = ({ datas, buku_rencana }) => {
  const { server_filter, auth } = usePage().props;

  const [onCreateShow, setOnCreateShow] = useState(false);
  // Drawer ACC KM & drawer angsuran (dari kolom Storting). Status bukanya
  // disimpan di sessionStorage: simpan angsuran lewat Inertia memuat ulang
  // halaman ini, dan tanpa itu drawer tertutup tiap kali bayar/hapus.
  // Hanya berlaku untuk filter (hari/bulan/kelompok/unit) yang sama: ganti
  // filter = status drawer dibuang.
  const KUNCI_DRAWER = 'bukutransaksi.drawer';
  const filterDrawer = `${server_filter.hari}|${server_filter.month}|${server_filter.kelompok}|${server_filter.branch_id}`;
  const bacaDrawer = () => {
    try {
      const isi = JSON.parse(sessionStorage.getItem(KUNCI_DRAWER)) ?? {};
      return isi.filter === filterDrawer ? isi : {};
    } catch {
      return {};
    }
  };
  // ?acc=1 (tombol Cek Target di Rekap 2) langsung membuka drawer ACC KM.
  const dariLink = () => new URLSearchParams(window.location.search).has('acc');
  const [rencanaShow, setRencanaShowState] = useState(() => !!bacaDrawer().rencana || dariLink());
  const [angsuranTarget, setAngsuranTargetState] = useState(() => bacaDrawer().angsuran ?? null);
  const simpanDrawer = (ubah) => {
    try {
      sessionStorage.setItem(KUNCI_DRAWER, JSON.stringify({ ...bacaDrawer(), ...ubah, filter: filterDrawer }));
    } catch {
      /* tanpa storage: drawer tetap jalan, cuma tidak bertahan */
    }
  };
  const setRencanaShow = (v) => {
    setRencanaShowState(v);
    simpanDrawer({ rencana: v, ...(v ? {} : { angsuran: null }) });
    if (!v) setAngsuranTargetState(null);
  };
  const setAngsuranTarget = (t) => {
    setAngsuranTargetState(t);
    simpanDrawer({ angsuran: t });
  };
  // Filter berganti tanpa remount (FilterBar) -> tutup drawer & buang statusnya.
  const filterSebelum = useRef(filterDrawer);
  useEffect(() => {
    if (filterSebelum.current === filterDrawer) return;
    filterSebelum.current = filterDrawer;
    setRencanaShowState(false);
    setAngsuranTargetState(null);
    try {
      sessionStorage.removeItem(KUNCI_DRAWER);
    } catch {
      /* abaikan */
    }
  }, [filterDrawer]);
  // Sekali pakai: catat sebagai drawer terbuka lalu buang ?acc dari URL,
  // supaya muat ulang sesudah drawer ditutup tidak membukanya lagi.
  useEffect(() => {
    if (!dariLink()) return;
    simpanDrawer({ rencana: true });
    const url = new URL(window.location.href);
    url.searchParams.delete('acc');
    window.history.replaceState(window.history.state, '', url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleOnCreateShowOpen = () => setOnCreateShow(true);
  const handleOnCreateShowClosed = () => setOnCreateShow(false);

  const canFilterUnit =
    server_filter.userAuthorized.canShowBranch ||
    server_filter.userAuthorized.canShowGroupingBranch;

  // Buku yang sedang dibuka (dari 60: kelompok x hari). Diumumkan di header
  // supaya user tahu persis lagi di buku mana, bukan cuma judul generik.
  const [_thn, _bln] = String(server_filter.month ?? '').split('-');
  const bulanLabel = _bln ? `${NAMA_BULAN[parseInt(_bln, 10) - 1]} ${_thn}` : server_filter.month;
  const hariLabel = server_filter.hari
    ? server_filter.hari.charAt(0).toUpperCase() + server_filter.hari.slice(1)
    : '-';

  // Dibawa serta saat FilterBar bernavigasi, supaya pilihan Unit/Wilayah
  // yang sedang aktif tidak ikut hilang ketika user cuma ganti hari/bulan.
  const unitExtraParams = {};
  if (server_filter.branch_id) unitExtraParams.branch_id = server_filter.branch_id;
  if (server_filter.wilayah) unitExtraParams.wilayah = server_filter.wilayah;

  // Remount SearchComponent (filter Unit) tiap kali hari/bulan/kelompok
  // berubah lewat FilterBar - komponen itu cuma membaca server_filter SEKALI
  // saat mount, jadi tanpa key baru dia bisa submit nilai hari/bulan lama.
  const searchComponentKey = `${server_filter.hari}-${server_filter.month}-${server_filter.kelompok}`;

  // Mundur per bulan HANYA lewat klik (tanpa auto-muat saat scroll, keputusan
  // mas 2026-10-09): `datas` dari server = bulan berjalan (buku aktif).
  // Klik "Muat bulan sebelumnya" menyambung bulan-bulan lebih lama ke bawah,
  // tanpa reload penuh (endpoint transaction.drop_bulan). Reset tiap kali filter
  // (hari/bulan/kelompok) berubah lewat FilterBar -> server kirim datas baru.
  const [groups, setGroups] = useState(datas ?? []);
  const [rencanaGroups, setRencanaGroups] = useState(buku_rencana ?? []);
  const [oldest, setOldest] = useState(server_filter.month);
  const [loadingMore, setLoadingMore] = useState(false);
  const [bulanKosong, setBulanKosong] = useState(null);

  // Guard SINKRON: klik ganda cepat tidak boleh fetch bulan yang sama 2x
  // (baris dobel). `loadingMore` (state) telat update, ref langsung set.
  const loadingRef = useRef(false);

  useEffect(() => {
    setGroups(datas ?? []);
    setRencanaGroups(buku_rencana ?? []);
    setOldest(server_filter.month);
    setBulanKosong(null);
  }, [datas, buku_rencana, server_filter.month, server_filter.hari, server_filter.kelompok]);

  const bulanSebelum = (m) => {
    const [y, mo] = String(m).split('-').map(Number);
    const d = new Date(y, mo - 2, 1); // mo 1-based; mo-2 = bulan sebelumnya (0-based)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  };
  const labelBulanDari = (m) => {
    const [y, mo] = String(m).split('-');
    return mo ? `${NAMA_BULAN[parseInt(mo, 10) - 1]} ${y}` : m;
  };
  const targetSebelum = bulanSebelum(oldest);

  const muatSebelumnya = async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoadingMore(true);
    try {
      const { data } = await axios.get(route('transaction.drop_bulan'), {
        params: {
          month: targetSebelum,
          hari: server_filter.hari,
          kelompok: server_filter.kelompok,
          ...unitExtraParams,
        },
      });
      const more = data?.datas ?? [];
      const moreRencana = data?.buku_rencana ?? [];
      const kosong = more.length === 0;
      // De-dupe per tanggal: kalaupun ada fetch nyelip, tanggal yang sudah ada
      // tak ditambah dua kali. Drop (grup per tanggal) & rencana (baris per
      // tanggal) sama-sama disambung supaya kedua tab memanjang seiring.
      setGroups((g) => {
        const adaTanggal = new Set(g.map((it) => it?.[0]?.tanggal_drop));
        const baru = more.filter((it) => !adaTanggal.has(it?.[0]?.tanggal_drop));
        return [...g, ...baru];
      });
      setRencanaGroups((r) => {
        const adaTanggal = new Set(r.map((it) => it?.tanggal));
        const baru = moreRencana.filter((it) => !adaTanggal.has(it?.tanggal));
        return [...r, ...baru];
      });
      setOldest(targetSebelum);
      setBulanKosong(kosong ? targetSebelum : null);
    } catch {
      /* biarkan - tombol tetap bisa dicoba lagi */
    } finally {
      loadingRef.current = false;
      setLoadingMore(false);
    }
  };


  return (
    <>
      <div className="flex flex-row items-center justify-between gap-3 mb-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Buku Transaksi
          </h1>
          <p className="text-xs text-muted-foreground">
            Kelompok {server_filter.kelompok} · {hariLabel} · {bulanLabel}
          </p>
        </div>

        <div className="flex items-center justify-end gap-2">
          {canFilterUnit && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <FilterIcon className="h-4" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Unit
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <SearchComponent
                  key={searchComponentKey}
                  urlLink={route('transaction.index_buku_transaksi')}
                  localState={'transaction_index_buku_transaksi'}
                  searchBranch={server_filter.userAuthorized.canShowBranch}
                  searchGroupingBranch={
                    server_filter.userAuthorized.canShowGroupingBranch
                  }
                />
              </PopoverContent>
            </Popover>
          )}
          {auth?.can_create && (
            <Button type="button" onClick={handleOnCreateShowOpen}>
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Tambah Pengajuan
              </span>
            </Button>
          )}
        </div>
      </div>

      {/* Chip hari/bulan/kelompok - sama persis di desktop maupun mobile,
          sama seperti menu Drop. */}
      <div className="mb-3">
        <FilterBar
          urlLink={route('transaction.index_buku_transaksi')}
          storageKey="transaction.index_buku_transaksi"
          showHari={true}
          showMonth={true}
          showKelompok={server_filter.userAuthorized.canShowKelompok}
          todayFirst={true}
          extraParams={unitExtraParams}
        />
      </div>

      <Create show={onCreateShow} onClosed={handleOnCreateShowClosed} />

      {/* Menu ACC KM (rencana drop, cek KM, kunci kasir) - tepat di atas tabel, berlabel juga di HP. */}
      <div className="flex justify-end mb-2">
        {/* Tombol utama halaman ini - menonjol (isi hijau, teks putih), sama gaya dengan Buku Storting. */}
        <Button
          type="button"
          onClick={() => setRencanaShow(true)}
          className="gap-1.5 font-semibold text-white shadow-sm bg-emerald-600 hover:bg-emerald-700"
        >
          <ClipboardList className="w-4 h-4" />
          <span className="whitespace-nowrap">ACC KM</span>
        </Button>
      </div>

      <div className="w-full">

          {/* Desktop: tabel, dibungkus scroll box seperti sebelumnya */}
          <div
            className="hidden max-h-[70vh] lg:block border rounded-lg overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin"
          >
            {groups.map((item, index) => (
              <BukuTransaksi
                key={item?.[0]?.tanggal_drop ?? index}
                datas={item}
              />
            ))}
          </div>

          {/* Mobile: kartu seperti menu Drop. Tanpa max-h/overflow di sini -
              dokumen jadi satu-satunya area scroll (sama seperti Drop). */}
          <div className="space-y-3 lg:hidden">
            {groups.map((item, index) => (
              <BukuTransaksiKepala
                key={item?.[0]?.tanggal_drop ?? index}
                datas={item}
              />
            ))}
          </div>

          {/* Muat bulan sebelumnya - menyambung ke bawah, terus mundur. */}
          <div className="flex flex-col items-center gap-1 mt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={muatSebelumnya}
              disabled={loadingMore}
            >
              {loadingMore
                ? 'Memuat…'
                : `↑ Muat ${labelBulanDari(targetSebelum)}`}
            </Button>
            {bulanKosong && (
              <p className="text-xs text-muted-foreground">
                {labelBulanDari(bulanKosong)} tidak ada transaksi — bisa muat
                lebih lama lagi.
              </p>
            )}
          </div>
      </div>

      <Sheet open={rencanaShow} onOpenChange={setRencanaShow}>
        <SheetContent side="right" className="w-full p-0 overflow-y-auto sm:max-w-5xl lg:max-w-none">
          <SheetHeader className="px-5 py-4 pr-12 border-b">
            <SheetTitle>ACC KM</SheetTitle>
            <SheetDescription>
              Rencana drop kelompok {server_filter.kelompok} · {hariLabel} · {bulanLabel}. Tombol ACC membuka pengecekan; kunci kasir
              sesudah KM meng-ACC. <SatuanAngka />
            </SheetDescription>
          </SheetHeader>
          <div className="p-3 overflow-x-auto">
            <Rencana
              datas={rencanaGroups}
              dataTransaksi={groups}
              onStorting={(item) => setAngsuranTarget({ tanggal: item.tanggal, kelompok: item.kelompok })}
            />
          </div>
        </SheetContent>
      </Sheet>

      <DrawerAngsuran target={angsuranTarget} onClosed={() => setAngsuranTarget(null)} />
    </>
  );
};

export default TransaksiMantri;
