import Loading from '@/Components/Loading';
import { Button } from '@/shadcn/ui/button';
import { Input } from '@/shadcn/ui/input';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/shadcn/ui/sheet';
import { router, useForm, usePage } from '@inertiajs/react';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import CurrencyInput from 'react-currency-input-field';
import axios from 'axios';

const rp = (n) => new Intl.NumberFormat('id-ID').format(Number(n) || 0);
const KELAS_INPUT =
  'flex w-full h-9 px-3 py-1 mt-1 text-sm text-right border rounded-md shadow-xs tabular-nums border-input focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring';
// Isian yang tidak bisa diubah: latar lebih gelap & tebal supaya jelas beda.
const KELAS_BEKU = 'bg-slate-200 font-bold text-slate-900 disabled:opacity-100 disabled:cursor-default';

/** Angka kecil berlabel untuk ringkasan. */
const Angka = ({ label, nilai, uang = true, kelas = '' }) => (
  <div className={`px-3 py-2 rounded-md bg-slate-50 ${kelas}`}>
    <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">{label}</div>
    <div className="text-sm font-semibold tabular-nums text-slate-900">{uang ? rp(nilai) : nilai}</div>
  </div>
);

/** Daftar transaksi yang masih harus diproses sebelum cek boleh disimpan. */
const DaftarTertunda = ({ judul, isi, tampilTanggal = false }) => (
  <div className="p-3 border rounded-lg border-amber-300 bg-amber-50">
    <div className="mb-2 text-sm font-semibold text-amber-900">{judul}</div>
    <ul className="space-y-1 text-sm">
      {isi.map((item, i) => (
        <li key={i} className="flex justify-between gap-2">
          <span className="truncate">{item.nama}</span>
          <span className="shrink-0 text-amber-800">
            {item.status}
            {tampilTanggal && ` · drop ${dayjs(item.tanggal_drop).format('DD-MM')}`}
          </span>
        </li>
      ))}
    </ul>
  </div>
);

const Approval = ({
  show = false,
  onClosed,
  triggeredDate,
  staticData,
  datas,
  // Dipanggil sesudah ACC tersimpan (mis. menutup drawer ACC KM pembungkusnya).
  onSukses = null,
}) => {
  const { data, setData, post, reset, errors, processing, transform } = useForm({
    id: '',
    date: '',
    masuk: '',
    keluar: '',
    target: '',
    baru: '',
    lama: '',
    storting: '',
    drop: '',
    rencana: '',
    tanggal_rencana_minggu_depan: '',
    rencana_minggu_depan: '',
    target_minggu_depan: '',
    // Koreksi target (alur baru): diisi hanya kalau KM menekan Edit dan
    // angkanya berubah - server memutus rantai di tanggal ini.
    target_koreksi: '',
    alasan_koreksi: '',
  });
  // Target & keluar diubah langsung di form ACC (dua alur, mas 2026-10-20). Target
  // berubah -> koreksi + menjalar ke tanggal sesudahnya (KoreksiTarget, server).
  // can-approve selain stafkontrol; selain itu target hanya baca.
  const { auth: authKoreksi } = usePage().props;
  const bolehKoreksi = authKoreksi?.permissions?.includes('can-approve') && !authKoreksi?.roles?.includes('stafkontrol');
  const [pratinjau, setPratinjau] = useState(null);
  // Target baru bisa diketik sesudah klik "Edit" (cegah ubah tak sengaja).
  const [ubahTarget, setUbahTarget] = useState(false);
  useEffect(() => setUbahTarget(false), [show, triggeredDate]);
  const [galatKoreksi, setGalatKoreksi] = useState('');
  const [triggeredData, setTriggeredData] = useState([]);

  const [transaksiOpenHariIni, setTransaksiOpenHariIni] = useState([]);
  const [transaksiOpenMingguDepan, setTransaksiOpenMingguDepan] = useState([]);
  const [transaksiHariIni, setTransaksiHariIni] = useState({
    drop_hari_ini: 0,
    drop_jadi: 0,
    gagal: 0,
    open1: 0,

    pengajuan: 0,
    acc: 0,
    tolak: 0,
    open2: 0,
  });

  const [erorRequest, setErorRequest] = useState(false);
  useEffect(() => {
    const flaatenData = staticData?.flat(2) ?? [];

    const getSelecterDateRencanaDropData = datas?.filter(
      (item) => item.tanggal === triggeredDate
    );

    const triggeredData = Object.assign({}, getSelecterDateRencanaDropData[0]);
    setTriggeredData(triggeredData);

    if (triggeredData) {
      const filteredData = flaatenData.filter((item) => {
        return item.request_date === triggeredData.tanggal;
      });

      const filterCount = (array, condition) => array.filter(condition).length;

      const drop_today = filterCount(
        flaatenData,
        (item) =>
          item.tanggal_drop === triggeredData.tanggal && item.status !== 'tolak'
      );

      const drop_jadi = filterCount(
        flaatenData,
        (item) =>
          item.tanggal_drop === triggeredData.tanggal &&
          item.status === 'success'
      );

      const drop_gagal = filterCount(
        flaatenData,
        (item) =>
          item.tanggal_drop === triggeredData.tanggal && item.status === 'gagal'
      );

      const open1 = filterCount(
        flaatenData,
        (item) =>
          item.tanggal_drop === triggeredData.tanggal &&
          item.status !== 'gagal' &&
          item.status !== 'success' &&
          item.status !== 'tolak'
      );

      const pengajuan = filterCount(
        filteredData,
        (item) => item.tanggal_drop !== item.request_date
      );

      const acc = filterCount(
        filteredData,
        (item) =>
          item.tanggal_drop !== item.request_date && item.status === 'acc'
      );

      const tolak = filterCount(
        filteredData,
        (item) =>
          item.tanggal_drop !== item.request_date && item.status === 'tolak'
      );

      const open2 = filterCount(
        filteredData,
        (item) =>
          item.tanggal_drop !== item.request_date && item.status === 'open'
      );

      setTransaksiHariIni((prevSet) => ({
        ...prevSet,
        drop_hari_ini: drop_today,
        drop_jadi: drop_jadi,
        gagal: drop_gagal,
        open1: open1,
        pengajuan: pengajuan,
        acc: acc,
        tolak: tolak,
        open2: open2,
      }));

      const transaksiOpenToday = flaatenData.filter((item) => {
        return (
          item.tanggal_drop === triggeredData.tanggal &&
          (item.status == 'open' || item.status == 'acc')
        );
      });

      const transaksiOpenNextDay = flaatenData.filter((item) => {
        return (
          item.request_date === triggeredData.tanggal && item.status == 'open'
        );
      });

      setTransaksiOpenHariIni(transaksiOpenToday);
      setTransaksiOpenMingguDepan(transaksiOpenNextDay);

      let uniqueDropDatesString = null;
      let rencana = 0;

      // Minggu depan = hari tagih kerja berikutnya dari server (H+7, libur
      // dilompati) - sama dengan tempat server menaruh targetnya.
      uniqueDropDatesString = triggeredData.tanggal_depan ?? null;

      // Rencana = semua pengajuan (bukan drop langsung) yang drop-nya minggu
      // depan & masih hidup - menurut TANGGAL DROP, bukan tanggal pengajuan.
      // Tundaan dibuat ulang dengan request_date lama (mis. diajukan 28 Sep,
      // ditunda dari 5 ke 12 Okt) dan dulu hilang dari rencana ACC 5 Okt.
      // Sama dengan kolom Rencana di server (RekapTrait).
      rencana = flaatenData
        .filter(
          (item) =>
            item.tanggal_drop === uniqueDropDatesString &&
            item.tanggal_drop !== item.request_date &&
            // Rencana = sudah di-ACC, termasuk yang akhirnya gagal (sama dengan RekapTrait).
            ['open', 'acc', 'success', 'gagal'].includes(item.status),
        )
        .reduce((a, item) => a + (Number(item.acc) || 0), 0);

      setData({
        id: triggeredData.grouping_id,
        date: triggeredData.tanggal,
        target: triggeredData.target,
        masuk:
          triggeredData.drop !== 0 && triggeredData.masuk == 0
            ? triggeredData.drop * 0.13
            : triggeredData.masuk,
        keluar: triggeredData.keluar,
        baru: triggeredData.baru,
        lama: triggeredData.lama,
        storting: triggeredData.storting,
        drop: triggeredData.drop,
        rencana: triggeredData.rencana,

        tanggal_rencana_minggu_depan: uniqueDropDatesString,
        rencana_minggu_depan: rencana ?? 0,
        target_minggu_depan: 0,
      });

    }
  }, [datas, show, triggeredDate]);

  useEffect(() => {
    setData(
      'target_minggu_depan',
      parseInt(data.target) + (parseInt(data.masuk) - parseInt(data.keluar))
    );
  }, [data.target, data.masuk, data.keluar]);

  const [loading, setLoading] = useState(false);

  const onInputChange = (e) => {
    setData(
      e.target.name,
      e.target.type === 'checkbox' ? e.target.checked : e.target.value
    );
  };

  const onHandleCurencyChange = (value, name) => {
    setData(name, value);
  };

  const closedModal = () => {
    onClosed();
    reset();
    setErorRequest(false);
  };

  // Kantor migrasi -> alur baru (daily_closings), selain itu alur lama.
  const migrasi = usePage().props.server_filter?.migrasi;

  const onSubmitForm = (e) => {
    e.preventDefault();
    const opsi = {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        reset();
        onClosed();
        onSukses?.();
      },
    };

    // Hari sudah dikunci / TTD kasir: tidak di-ACC ulang, cukup koreksi target & keluar.
    if (terkunci) {
      router.post(route('transaction.koreksi_target'), {
        id: data.id, date: dayjs(data.date).format('YYYY-MM-DD'),
        target: Number(data.target) || 0, keluar: Number(data.keluar) || 0, alasan: data.alasan_koreksi,
      }, opsi);
      return;
    }

    const url = migrasi
      ? route('transaction.ceklist_kepala_baru')
      : route('kasir.rekap.ceklist_kepala');

    transform((d) => ({ ...d, target_koreksi: targetBerubah ? Number(d.target) || 0 : '' }));
    post(url, {
      // Jangan lompat ke atas daftar / ganti tab / minggu sesudah simpan.
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        reset();
        onClosed();
        onSukses?.();
      },
    });
  };

  const terkunci = !!triggeredData?.is_kasir;
  const targetBerubah = (Number(data.target) || 0) !== (Number(triggeredData?.target) || 0);
  const keluarBerubah = (Number(data.keluar) || 0) !== (Number(triggeredData?.keluar) || 0);
  const perluAlasan = targetBerubah || (terkunci && keluarBerubah);
  // Rantai dihitung ulang server: target berubah, atau keluar berubah pada hari yang
  // sudah pernah di-ACC / dikunci (ACC pertama biasa cukup menulis minggu depan).
  const menjalar = targetBerubah || ((terkunci || !!triggeredData?.at_approved) && keluarBerubah);

  // Pratinjau rantai (server) tiap target / keluar berubah - hanya kalau ada perubahan.
  useEffect(() => {
    setGalatKoreksi('');
    if (!show || !triggeredData?.grouping_id || !menjalar) {
      setPratinjau(null);
      return undefined;
    }
    const t = setTimeout(() => {
      axios
        .get(route('transaction.koreksi_target_pratinjau'), {
          params: { id: triggeredData.grouping_id, date: dayjs(triggeredData.tanggal).format('YYYY-MM-DD'),
            target: Number(data.target) || 0, keluar: Number(data.keluar) || 0 },
        })
        .then(({ data: h }) => setPratinjau(h.perubahan))
        .catch((er) => {
          setPratinjau(null);
          if (targetBerubah || terkunci) setGalatKoreksi(er.response?.data?.message ?? '');
        });
    }, 300);
    return () => clearTimeout(t);
  }, [show, data.target, data.keluar, triggeredData]); // eslint-disable-line react-hooks/exhaustive-deps

  const targetDasar = data.target;
  const targetMingguDepan = (parseInt(targetDasar) || 0) + ((parseInt(data.masuk) || 0) - (parseInt(data.keluar) || 0));
  const adaTertunda = transaksiOpenHariIni.length > 0 || transaksiOpenMingguDepan.length > 0;

  return (
    <Sheet open={show} onOpenChange={(open) => (open ? '' : closedModal())}>
      <SheetContent side="right" className="w-full p-0 overflow-y-auto sm:max-w-lg lg:max-w-none">
        <Loading show={loading || processing} />
        <SheetHeader className="px-5 py-4 pr-12 border-b">
          <SheetTitle>ACC KM</SheetTitle>
          <SheetDescription>
            {triggeredData?.tanggal ? dayjs(triggeredData.tanggal).format('dddd, DD MMMM YYYY') : ''} — cek transaksi
            hari ini &amp; isi rencana minggu depan.
          </SheetDescription>
        </SheetHeader>

        <div className="px-5 py-4 space-y-5">
          {triggeredData && (
            <section className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <Angka label="Target" nilai={data.target} />
                <Angka label="Drop" nilai={triggeredData.drop} />
                <Angka label="Storting" nilai={triggeredData.storting} />
                <Angka label="Baru" nilai={triggeredData.baru} />
                <Angka label="Lama" nilai={triggeredData.lama} />
                <Angka label="Rencana" nilai={triggeredData.rencana} />
              </div>


              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="p-3 border rounded-lg border-emerald-200">
                  <div className="mb-1 text-xs font-semibold uppercase text-emerald-700">Drop hari ini</div>
                  <div className="grid grid-cols-2 gap-y-0.5 tabular-nums">
                    <span className="text-slate-500">Total</span><span className="text-right">{transaksiHariIni.drop_hari_ini}</span>
                    <span className="text-slate-500">Sukses</span><span className="text-right">{transaksiHariIni.drop_jadi}</span>
                    <span className="text-slate-500">Gagal</span><span className="text-right">{transaksiHariIni.gagal}</span>
                    <span className="text-slate-500">Open</span><span className="text-right">{transaksiHariIni.open1}</span>
                  </div>
                </div>
                <div className="p-3 border rounded-lg border-sky-200">
                  <div className="mb-1 text-xs font-semibold uppercase text-sky-700">Pengajuan hari ini</div>
                  <div className="grid grid-cols-2 gap-y-0.5 tabular-nums">
                    <span className="text-slate-500">Total</span><span className="text-right">{transaksiHariIni.pengajuan}</span>
                    <span className="text-slate-500">ACC</span><span className="text-right">{transaksiHariIni.acc}</span>
                    <span className="text-slate-500">Tolak</span><span className="text-right">{transaksiHariIni.tolak}</span>
                    <span className="text-slate-500">Open</span><span className="text-right">{transaksiHariIni.open2}</span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {transaksiOpenHariIni.length > 0 && (
            <DaftarTertunda judul="Transaksi hari ini belum diselesaikan mantri — klik SUKSES / GAGAL" isi={transaksiOpenHariIni} />
          )}
          {transaksiOpenMingguDepan.length > 0 && (
            <DaftarTertunda
              judul="Pengajuan hari ini belum diselesaikan KM — klik ACC / TOLAK"
              isi={transaksiOpenMingguDepan}
              tampilTanggal
            />
          )}

          {!adaTertunda && (
            <form onSubmit={onSubmitForm} className="space-y-5">
              <section className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-900">Hari ini</h3>
                {/* Target hari ini: hanya baca; klik "Edit" (can-approve selain stafkontrol)
                    untuk mengubah - berubah -> alasan wajib, tanggal sesudahnya ikut dihitung
                    ulang. Alur lama tanpa target sama sekali -> langsung diisi (target pertama). */}
                <div className="text-sm">
                  <div className="flex items-center justify-between">
                    <span>Target</span>
                    {bolehKoreksi && !ubahTarget && (migrasi || triggeredData?.target) ? (
                      <button type="button" className="text-xs font-semibold text-blue-600 underline" onClick={() => setUbahTarget(true)}>
                        Edit
                      </button>
                    ) : null}
                  </div>
                  {(bolehKoreksi && ubahTarget) || (!migrasi && !triggeredData?.target) ? (
                    <CurrencyInput className={KELAS_INPUT} name="target" allowDecimals={false} allowNegativeValue={false}
                      prefix="Rp " required onValueChange={onHandleCurencyChange} value={data.target} />
                  ) : (
                    <CurrencyInput className={`${KELAS_INPUT} ${KELAS_BEKU}`} name="target" disabled prefix="Rp "
                      value={data.target ?? 0} />
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block text-sm">
                    Masuk
                    {/* Masuk ikut drop - tidak diketik. */}
                    <CurrencyInput className={`${KELAS_INPUT} ${KELAS_BEKU}`} name="masuk" disabled prefix="Rp "
                      value={data.masuk ?? 0} />
                  </label>
                  <label className="block text-sm">
                    Keluar
                    <CurrencyInput className={KELAS_INPUT} name="keluar" allowDecimals={false} allowNegativeValue={false}
                      prefix="Rp " required onValueChange={onHandleCurencyChange} value={data.keluar} />
                  </label>
                </div>
                {perluAlasan && (
                  <Input name="alasan_koreksi" required placeholder="Alasan ubah target / keluar (wajib)"
                    onChange={onInputChange} value={data.alasan_koreksi ?? ''} />
                )}
                {galatKoreksi && <small className="block text-red-600">{galatKoreksi}</small>}
                {pratinjau && pratinjau.length > 1 && (
                  <div className="p-2 text-xs border rounded-md bg-amber-50 border-amber-200">
                    <div className="mb-1 font-semibold text-amber-800">Target tanggal sesudahnya ikut berubah</div>
                    <div className="max-h-40 space-y-0.5 overflow-y-auto tabular-nums">
                      {pratinjau.slice(1).filter((p) => p.lama !== p.baru).map((p) => (
                        <div key={p.tanggal} className="flex justify-between gap-2">
                          <span>{dayjs(p.tanggal).format('DD MMM')}</span>
                          <span>{rp(p.lama)} → <b>{rp(p.baru)}</b></span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              <section className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-900">Minggu depan</h3>
                <label className="block text-sm">
                  Tanggal rencana drop
                  {/* Dari Kalender Kerja (server: TargetMingguan::tanggalDepan),
                      bukan dari pengajuan dan tidak diketik. */}
                  <Input
                    className={`mt-1 ${KELAS_BEKU}`}
                    name="tanggal_rencana_minggu_depan"
                    type="date"
                    readOnly
                    required
                    value={data.tanggal_rencana_minggu_depan ?? ''}
                  />
                  {!data.tanggal_rencana_minggu_depan && (
                    <small className="text-red-600">Tidak ada hari kerja dalam 8 minggu ke depan — periksa Kalender Kerja.</small>
                  )}
                </label>
                <label className="block text-sm">
                  Rencana drop
                  {/* Hanya dari pengajuan yang di-ACC - tidak diketik. */}
                  <CurrencyInput className={`${KELAS_INPUT} ${KELAS_BEKU}`} name="rencana_minggu_depan" disabled
                    prefix="Rp " value={data.rencana_minggu_depan ?? 0} />
                  {!Number(data.rencana_minggu_depan) && (
                    <small className="text-amber-700">Tidak ada pengajuan yang terinput.</small>
                  )}
                </label>
                <div className="flex items-center justify-between px-3 py-2 rounded-md bg-slate-50">
                  <span className="text-sm text-slate-600">Target minggu depan (target + masuk − keluar)</span>
                  <span className="font-semibold tabular-nums">Rp {rp(targetMingguDepan)}</span>
                </div>
              </section>

              <label className="flex items-start gap-2 text-sm text-slate-700">
                <input type="checkbox" required className="mt-0.5" />
                Storting, rencana, target, dan drop sudah saya cek dan sesuai; tidak ada transaksi yang masih open.
              </label>

              <Button type="submit" className="w-full" disabled={processing}>
                {terkunci ? 'Simpan koreksi (hari sudah dikunci kasir)' : 'Simpan ACC KM'}
              </Button>
            </form>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Approval;
