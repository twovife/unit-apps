import { Head, router, usePage } from '@inertiajs/react';
import { Lock, MapPin, Plus, Search, UserPlus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Badge } from '@/shadcn/ui/badge';
import { Button } from '@/shadcn/ui/button';
import { Input } from '@/shadcn/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shadcn/ui/table';
import Checkbox from '@/Components/Checkbox';
import VideoTutorialButton from '@/Components/VideoTutorialButton';
import SavingDetailDrawer from './Components/SavingDetailDrawer';
import { rp as rupiah } from '@/lib/rupiah';


const columns = [
  ['sw_awal', 'Saldo awal SW'],
  ['sk_awal', 'Saldo awal SK'],
  ['sw_debit', 'Debit SW'],
  ['sk_debit', 'Debit SK'],
  ['sw_kredit', 'Kredit SW'],
  ['sk_kredit', 'Kredit SK'],
  ['saldo_sw', 'Saldo SW'],
  ['saldo_sk', 'Saldo SK'],
  ['saldo_global', 'Saldo global'],
  ['sw_setoran', 'Setoran SW'],
  ['sk_setoran', 'Setoran SK'],
  ['sw_debit_mutasi', 'Mutasi masuk SW'],
  ['sk_debit_mutasi', 'Mutasi masuk SK'],
  ['sw_pengambilan', 'Pengambilan SW'],
  ['sk_pengambilan', 'Pengambilan SK'],
  ['sw_kredit_mutasi', 'Mutasi keluar SW'],
  ['sk_kredit_mutasi', 'Mutasi keluar SK'],
  ['sw_kredit_resign', 'Resign/MD SW'],
  ['sk_kredit_resign', 'Resign/MD SK'],
];

/** Input angka berpemisah ribuan (titik) dengan shortcut 'k' / 'K' (+000). */
function InputRupiah({ value, onChange, disabled, placeholder = '0', className = '' }) {
  const displayValue = value === '' || value === null || value === undefined ? '' : new Intl.NumberFormat('id-ID').format(Number(value) || 0);

  const handleKeyDown = (e) => {
    if (disabled) return;
    if (e.key === 'k' || e.key === 'K') {
      e.preventDefault();
      const current = typeof value === 'number' ? value : parseInt(String(value || '').replace(/\D/g, ''), 10) || 0;
      if (current > 0) {
        onChange(current * 1000);
      }
    }
  };

  const handleChange = (e) => {
    const raw = e.target.value;
    if (/[kK]/.test(raw)) {
      const numPart = parseInt(raw.replace(/\D/g, ''), 10) || 0;
      onChange(numPart * 1000);
      return;
    }
    const clean = raw.replace(/\D/g, '');
    onChange(clean === '' ? '' : parseInt(clean, 10));
  };

  return (
    <Input
      type="text"
      inputMode="numeric"
      disabled={disabled}
      placeholder={placeholder}
      value={displayValue}
      onKeyDown={handleKeyDown}
      onChange={handleChange}
      className={className}
    />
  );
}

/** Input setoran bulanan SW/SK banyak karyawan sekaligus (sksw.setoran). */
function DialogSetoran({ open, onClose, rows, period }) {
  // Setoran SKSW per bulan: yang dipilih bulannya, dikirim sebagai tanggal 1.
  const bulanIni = new Date().toLocaleDateString('sv').slice(0, 7);
  const [bulan, setBulan] = useState(bulanIni);
  const [isi, setIsi] = useState({});
  const [checked, setChecked] = useState({});
  const [galat, setGalat] = useState(null);
  const [proses, setProses] = useState(false);

  useEffect(() => {
    if (!open) return;
    setBulan(period < bulanIni ? period : bulanIni);
    const initialIsi = {};
    const initialChecked = {};
    rows.forEach((r) => {
      const swSudah = Number(r.sw_setoran) > 0;
      const skSudah = Number(r.sk_setoran) > 0;
      initialIsi[r.saving_id] = {
        sw: swSudah ? '' : 200000,
        sk: 0,
      };
      initialChecked[r.saving_id] = true;
    });
    setIsi(initialIsi);
    setChecked(initialChecked);
    setGalat(null);
  }, [open, period, rows]);

  const ubah = (id, k, v) => setIsi((x) => ({ ...x, [id]: { ...(x[id] ?? {}), [k]: v } }));

  const toggleCheck = (id) => {
    setChecked((x) => ({ ...x, [id]: !x[id] }));
  };

  const allChecked = rows.length > 0 && rows.every((r) => checked[r.saving_id]);

  const toggleAll = () => {
    const nextState = !allChecked;
    const nextChecked = {};
    rows.forEach((r) => {
      nextChecked[r.saving_id] = nextState;
    });
    setChecked(nextChecked);
  };

  const items = useMemo(() => {
    return rows
      .filter((r) => checked[r.saving_id])
      .map((r) => {
        const v = isi[r.saving_id] ?? {};
        return {
          saving_id: Number(r.saving_id),
          sw: Number(v.sw) || 0,
          sk: Number(v.sk) || 0,
        };
      })
      .filter((v) => v.sw > 0 || v.sk > 0);
  }, [rows, checked, isi]);

  const totalSw = useMemo(() => items.reduce((a, v) => a + v.sw, 0), [items]);
  const totalSk = useMemo(() => items.reduce((a, v) => a + v.sk, 0), [items]);
  const totalSemua = totalSw + totalSk;

  const simpan = () => {
    setProses(true);
    router.post(route('sksw.setoran'), { transaction_date: `${bulan}-01`, items }, {
      preserveScroll: true,
      onError: (e) => setGalat(Object.values(e).join(' ')),
      onSuccess: onClose,
      onFinish: () => setProses(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && !proses && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">INPUT MASUKAN SKSW</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            ( menu intuk input pemasukan saja ) hilangkan centang untuk yang tidak setor
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
          <div className="grid gap-1">
            <label className="text-xs font-semibold text-slate-700" htmlFor="tgl-setoran">
              Bulan setoran
            </label>
            <Input
              id="tgl-setoran"
              type="month"
              max={bulanIni}
              value={bulan}
              onChange={(e) => e.target.value && setBulan(e.target.value)}
              className="w-40 h-8 text-xs bg-white"
            />
          </div>

          <div className="flex flex-wrap items-center sm:justify-end gap-2 text-xs">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-emerald-200 shadow-2xs">
              <span className="text-slate-500 font-medium">Total SW:</span>
              <strong className="text-emerald-700 tabular-nums">Rp {rupiah(totalSw)}</strong>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-sky-200 shadow-2xs">
              <span className="text-slate-500 font-medium">Total SK:</span>
              <strong className="text-sky-700 tabular-nums">Rp {rupiah(totalSk)}</strong>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 text-white shadow-2xs">
              <span className="text-slate-300">Total:</span>
              <strong className="tabular-nums">Rp {rupiah(totalSemua)}</strong>
              <span className="text-[11px] text-slate-300">({items.length} setor)</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto border rounded-md">
          <table className="w-full text-sm">
            <thead className="bg-muted/70 text-xs font-semibold">
              <tr>
                <th className="w-10 px-3 py-2 text-center">
                  <Checkbox
                    checked={allChecked}
                    onChange={toggleAll}
                    title="Centang / Hapus Semua Centang"
                  />
                </th>
                <th className="px-1.5 sm:px-2 py-2 text-left font-medium">Karyawan</th>
                <th className="px-1.5 sm:px-2 py-2 text-right font-medium w-28 sm:w-36">SW</th>
                <th className="px-1.5 sm:px-2 py-2 text-right font-medium w-28 sm:w-36">SK</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const swSudah = Number(r.sw_setoran) > 0;
                const skSudah = Number(r.sk_setoran) > 0;
                const isChecked = !!checked[r.saving_id];

                return (
                  <tr
                    key={r.saving_id}
                    className={`border-t transition-colors ${
                      !isChecked ? 'bg-slate-50/70 opacity-60' : 'hover:bg-slate-50/60'
                    }`}
                  >
                    <td className="w-8 sm:w-10 px-2 sm:px-3 py-1.5 text-center">
                      <Checkbox
                        checked={isChecked}
                        onChange={() => toggleCheck(r.saving_id)}
                      />
                    </td>
                    <td className="px-1.5 sm:px-2 py-1.5 min-w-0">
                      <div className="font-medium text-slate-900 text-xs sm:text-sm line-clamp-2 leading-tight">{r.employee.nama_karyawan}</div>
                      <div className="text-[10px] sm:text-[11px] text-muted-foreground truncate">
                        {[r.employee.jabatan, r.nomor_rekening].filter(Boolean).join(' · ')}
                      </div>
                    </td>
                    <td className="w-28 sm:w-36 px-1.5 sm:px-2 py-1.5">
                      <InputRupiah
                        disabled={swSudah || !isChecked}
                        placeholder={swSudah ? `sudah ${rupiah(r.sw_setoran)}` : '0'}
                        value={isi[r.saving_id]?.sw ?? ''}
                        onChange={(v) => ubah(r.saving_id, 'sw', v)}
                        className="text-right h-8 tabular-nums text-xs px-2"
                      />
                    </td>
                    <td className="w-28 sm:w-36 px-1.5 sm:px-2 py-1.5">
                      <InputRupiah
                        disabled={skSudah || !isChecked}
                        placeholder={skSudah ? `sudah ${rupiah(r.sk_setoran)}` : '0'}
                        value={isi[r.saving_id]?.sk ?? ''}
                        onChange={(v) => ubah(r.saving_id, 'sk', v)}
                        className="text-right h-8 tabular-nums text-xs px-2"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {galat && <div className="p-2 text-sm rounded-md bg-red-50 text-red-700">{galat}</div>}

        <DialogFooter className="flex-row justify-between gap-2 sm:justify-between">
          <Button variant="outline" disabled={proses} onClick={onClose}>
            Batal
          </Button>
          <Button disabled={proses || items.length === 0} onClick={simpan}>
            {proses ? 'Menyimpan…' : `Simpan ${items.length} setoran`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** Form pendaftaran rekening SKSW untuk pegawai baru (sksw.buka-rekening). */
function DialogBukaRekening({ open, onClose, unregisteredEmployees = [], branch }) {
  // Buka tabungan per bulan: yang dipilih bulannya, dikirim sebagai tanggal 1.
  const bulanIni = new Date().toLocaleDateString('sv').slice(0, 7);
  const [employeeId, setEmployeeId] = useState('');
  const [tglDaftar, setTglDaftar] = useState(bulanIni);
  const [nomorRekening, setNomorRekening] = useState('');
  const [saldoAwalSw, setSaldoAwalSw] = useState(0);
  const [saldoAwalSk, setSaldoAwalSk] = useState(0);
  const [proses, setProses] = useState(false);
  const [galat, setGalat] = useState(null);

  useEffect(() => {
    if (!open) return;
    setTglDaftar(bulanIni);
    setEmployeeId(unregisteredEmployees[0]?.id ? String(unregisteredEmployees[0].id) : '');
    setNomorRekening('');
    setSaldoAwalSw(0);
    setSaldoAwalSk(0);
    setGalat(null);
  }, [open, unregisteredEmployees]);

  const simpan = () => {
    if (!employeeId) {
      setGalat('Pilih pegawai terlebih dahulu.');
      return;
    }
    setProses(true);
    setGalat(null);
    router.post(
      route('sksw.buka-rekening'),
      {
        employee_id: employeeId,
        tgl_daftar: `${tglDaftar}-01`,
        nomor_rekening: nomorRekening || null,
        saldo_awal_sw: saldoAwalSw || 0,
        saldo_awal_sk: saldoAwalSk || 0,
      },
      {
        preserveScroll: true,
        onSuccess: () => {
          setProses(false);
          onClose();
        },
        onError: (errs) => {
          setProses(false);
          setGalat(Object.values(errs || {})[0] || 'Gagal membuka rekening.');
        },
      }
    );
  };

  const selectedEmp = unregisteredEmployees.find((e) => String(e.id) === String(employeeId));

  return (
    <Dialog open={open} onOpenChange={(o) => (!o ? onClose() : null)}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="size-5 text-emerald-600" />
            Buka Tabungan SKSW
          </DialogTitle>
          <DialogDescription>
            Daftarkan tabungan SKSW baru untuk pegawai aktif di {branch?.unit ?? 'kantor ini'}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {unregisteredEmployees.length === 0 ? (
            <div className="rounded-md bg-amber-50 p-3 text-sm text-amber-800">
              Semua pegawai aktif di kantor ini sudah memiliki tabungan SKSW.
            </div>
          ) : (
            <>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Pilih Pegawai *</label>
                <select
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-xs outline-none focus:ring-1 focus:ring-slate-900"
                >
                  <option value="" disabled>-- Pilih Pegawai --</option>
                  {unregisteredEmployees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.nama_karyawan} ({emp.jabatan || 'Tanpa Jabatan'})
                    </option>
                  ))}
                </select>
                {selectedEmp && (
                  <p className="text-[11px] text-muted-foreground">
                    Area: {selectedEmp.area || '-'} · Masuk: {selectedEmp.date_hire || '-'}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Bulan Daftar *</label>
                  <Input
                    type="month"
                    max={bulanIni}
                    value={tglDaftar}
                    onChange={(e) => e.target.value && setTglDaftar(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">No. Tabungan SKSW (Opsional)</label>
                  <Input
                    type="text"
                    placeholder="Auto / Kosongkan"
                    value={nomorRekening}
                    onChange={(e) => setNomorRekening(e.target.value)}
                  />
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3 space-y-3">
                <div className="text-xs font-medium text-slate-700">
                  Saldo Awal (Opsional jika membawa saldo)
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-500">Saldo Awal SW</label>
                    <InputRupiah
                      placeholder="0"
                      value={saldoAwalSw}
                      onChange={setSaldoAwalSw}
                      className="text-right h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-500">Saldo Awal SK</label>
                    <InputRupiah
                      placeholder="0"
                      value={saldoAwalSk}
                      onChange={setSaldoAwalSk}
                      className="text-right h-8 text-xs"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {galat && (
            <div className="rounded-md bg-red-50 p-2 text-xs text-red-700">
              {galat}
            </div>
          )}
        </div>

        <DialogFooter className="flex-row justify-between gap-2 sm:justify-between">
          <Button variant="outline" disabled={proses} onClick={onClose}>
            Batal
          </Button>
          <Button
            disabled={proses || unregisteredEmployees.length === 0 || !employeeId}
            onClick={simpan}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {proses ? 'Membuka Tabungan…' : 'Buka Tabungan SKSW'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function SkswUnit({ branch, period, batch, data = [], unregisteredEmployees = [], videos = {} }) {
  const [search, setSearch] = useState('');
  const [selectedSaving, setSelectedSaving] = useState(null);
  const [inputBuka, setInputBuka] = useState(false);
  const [bukaRekeningBuka, setBukaRekeningBuka] = useState(false);
  // Input setoran: kasir, staf kontrol, pusat, superuser; batch terkunci = tidak bisa (kecuali bypass).
  const { auth } = usePage().props;
  const bolehInput = ['kasir', 'stafkontrol', 'pusat', 'superuser'].some((r) => auth?.roles?.includes(r))
    && (batch?.status !== 'locked' || auth?.permissions?.includes('bypass-sksw-lock'));
  const filteredData = useMemo(() => {
    const needle = search.trim().toLocaleLowerCase('id-ID');
    return needle
      ? data.filter((row) => `${row.employee?.nama_karyawan ?? ''} ${row.nomor_rekening ?? ''}`.toLocaleLowerCase('id-ID').includes(needle))
      : data;
  }, [data, search]);

  const totals = useMemo(() => data.reduce((sum, row) => {
    columns.forEach(([key]) => {
      if (key !== 'saldo_global') sum[key] = (sum[key] ?? 0) + (Number(row[key]) || 0);
    });
    sum.saldo_global = (sum.saldo_global ?? 0) + row.saldo_sw + row.saldo_sk;
    return sum;
  }, {}), [data]);

  const changePeriod = (newPeriod) => {
    if (!newPeriod) return;
    router.get(route('sksw.unit'), { period: newPeriod }, { preserveState: true, preserveScroll: true, replace: true });
  };

  return (
    <>
      <Head title="SKSW — Laporan Unit" />
      <div className="mx-auto flex w-full max-w-[100vw] flex-col gap-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-bold">SKSW — Laporan Unit</h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-4" />
              {branch ? `${branch.unit}${branch.wilayah ? ` · Wilayah ${branch.wilayah}` : ''}` : 'Kantor aktif tidak tersedia'}
              {batch?.status === 'locked' && <Badge variant="secondary" className="ml-2 gap-1"><Lock className="size-3" /> Batch terkunci</Badge>}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <VideoTutorialButton videos={videos} menu="sksw" buttonText="Video Panduan" />
            <label className="sr-only" htmlFor="sksw-period">Periode laporan</label>
            <Input id="sksw-period" type="month" value={period} onChange={(event) => changePeriod(event.target.value)} className="w-44" />
            {branch && bolehInput && (
              <>
                <Button
                  variant="outline"
                  className="gap-1.5 border-emerald-300 text-emerald-800 hover:bg-emerald-50 hover:text-emerald-900"
                  onClick={() => setBukaRekeningBuka(true)}
                >
                  <UserPlus className="size-4 text-emerald-600" />
                  Buka Tabungan SKSW
                  {unregisteredEmployees.length > 0 && (
                    <span className="ml-1 inline-flex items-center justify-center rounded-full bg-emerald-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                      {unregisteredEmployees.length}
                    </span>
                  )}
                </Button>
                <Button className="gap-1" onClick={() => setInputBuka(true)}>
                  <Plus className="size-4" /> Input setoran
                </Button>
              </>
            )}
            <div className="relative">
              <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
              <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari karyawan / SKSW" className="w-56 pl-8" />
            </div>
          </div>
        </div>

        {unregisteredEmployees.length > 0 && bolehInput && (
          <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50/70 px-4 py-3 text-sm text-emerald-900">
            <div className="flex items-center gap-2">
              <UserPlus className="size-4 text-emerald-600 shrink-0" />
              <span>
                Ada <strong>{unregisteredEmployees.length} pegawai aktif</strong> di kantor ini yang belum memiliki tabungan SKSW.
              </span>
            </div>
            <Button
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1 h-7 text-xs"
              onClick={() => setBukaRekeningBuka(true)}
            >
              <UserPlus className="size-3.5" /> Buka Tabungan SKSW
            </Button>
          </div>
        )}

        {!branch ? (
          <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            Tidak ada kantor aktif yang dapat diakses. Pilih kantor melalui filter cabang global.
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-card shadow-xs">
            <div className="overflow-x-auto">
              <Table className="min-w-[1900px] text-xs border-collapse">
                <TableHeader>
                  <TableRow className="border-b border-slate-200 text-slate-800">
                    <TableHead rowSpan={2} className="sticky left-0 z-20 w-36 min-w-36 sm:w-56 sm:min-w-56 bg-slate-100 font-bold border-r border-slate-200 px-2 py-2 sm:px-3 shadow-[2px_0_6px_-2px_rgba(0,0,0,0.06)]">
                      Karyawan / SKSW
                    </TableHead>
                    <TableHead colSpan={2} className="text-center font-bold bg-slate-100/90 text-slate-800 border-r border-slate-200">
                      Saldo Awal
                    </TableHead>
                    <TableHead colSpan={2} className="text-center font-bold bg-emerald-100/90 text-emerald-950 border-r border-emerald-200">
                      Total Debit
                    </TableHead>
                    <TableHead colSpan={2} className="text-center font-bold bg-rose-100/90 text-rose-950 border-r border-rose-200">
                      Total Kredit
                    </TableHead>
                    <TableHead colSpan={3} className="text-center font-bold bg-sky-100/95 text-sky-950 border-r border-sky-200">
                      Saldo Akhir
                    </TableHead>
                    <TableHead colSpan={4} className="text-center font-semibold bg-emerald-50 text-emerald-900 border-r border-emerald-100">
                      Breakdown Debit
                    </TableHead>
                    <TableHead colSpan={6} className="text-center font-semibold bg-rose-50 text-rose-900 border-r border-rose-100">
                      Breakdown Kredit
                    </TableHead>
                  </TableRow>
                  <TableRow>
                    {columns.map(([key, label]) => {
                      let colHdr = 'bg-slate-100/80 text-slate-700 border-b border-slate-200';
                      if (['sw_debit', 'sk_debit'].includes(key)) {
                        colHdr = 'bg-emerald-100/70 text-emerald-950 font-semibold border-b border-emerald-200';
                      } else if (['sw_kredit', 'sk_kredit'].includes(key)) {
                        colHdr = 'bg-rose-100/70 text-rose-950 font-semibold border-b border-rose-200';
                      } else if (key === 'saldo_global') {
                        colHdr = 'bg-sky-200/90 text-sky-950 font-bold border-b border-sky-300';
                      } else if (['saldo_sw', 'saldo_sk'].includes(key)) {
                        colHdr = 'bg-sky-100/80 text-sky-950 font-semibold border-b border-sky-200';
                      } else if (['sw_setoran', 'sk_setoran', 'sw_debit_mutasi', 'sk_debit_mutasi'].includes(key)) {
                        colHdr = 'bg-emerald-50/90 text-emerald-900 border-b border-emerald-100';
                      } else if (['sw_pengambilan', 'sk_pengambilan', 'sw_kredit_mutasi', 'sk_kredit_mutasi', 'sw_kredit_resign', 'sk_kredit_resign'].includes(key)) {
                        colHdr = 'bg-rose-50/90 text-rose-900 border-b border-rose-100';
                      }
                      return (
                        <TableHead key={key} className={`min-w-28 text-right px-3 py-2 text-[11px] whitespace-nowrap ${colHdr}`}>
                          {label}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length ? filteredData.map((row, index) => (
                    <TableRow
                      key={row.saving_id}
                      className={`group transition-colors ${
                        !row.is_active
                          ? 'bg-red-50/70 hover:bg-red-100/70 text-slate-600'
                          : 'odd:bg-white even:bg-slate-50/80 hover:bg-amber-50/70'
                      }`}
                    >
                      <TableCell
                        className={`sticky left-0 z-10 border-r border-slate-200/90 w-36 min-w-36 max-w-36 sm:w-56 sm:min-w-56 sm:max-w-none px-2 py-2 sm:px-3 sm:py-2.5 shadow-[2px_0_6px_-2px_rgba(0,0,0,0.06)] ${
                          !row.is_active
                            ? 'bg-red-50/95 group-hover:bg-red-100'
                            : 'bg-white group-odd:bg-white group-even:bg-slate-50 group-hover:bg-amber-50'
                        }`}
                      >
                        <button type="button" className="text-left group/btn hover:underline cursor-pointer block w-full" onClick={() => setSelectedSaving(row)}>
                          <div className="flex items-start gap-1">
                            <span className="font-mono text-slate-400 shrink-0 text-[11px] sm:text-xs">{index + 1}.</span>
                            <div className="min-w-0 flex-1">
                              <span className="font-semibold text-slate-900 group-hover/btn:text-red-600 transition-colors line-clamp-2 leading-tight block">
                                {row.employee.nama_karyawan}
                              </span>
                              <span className="block text-[10px] sm:text-[11px] text-slate-500 mt-0.5 truncate leading-tight">
                                {[row.employee.jabatan, row.employee.area ? `Area ${row.employee.area}` : null, row.nomor_rekening].filter(Boolean).join(' · ')}
                              </span>
                              {row.employee.date_resign && <span className="inline-block mt-0.5 px-1 py-0.2 rounded text-[9px] font-bold bg-red-100 text-red-700">RESIGN</span>}
                            </div>
                          </div>
                        </button>
                      </TableCell>
                      {columns.map(([key]) => {
                        const value = key === 'saldo_global' ? row.saldo_sw + row.saldo_sk : row[key];
                        const num = Number(value) || 0;
                        let cellClass = 'text-slate-800 font-medium';
                        if (num === 0) {
                          cellClass = 'text-slate-400 font-normal';
                        } else if (['sw_debit', 'sk_debit'].includes(key)) {
                          cellClass = 'text-emerald-700 font-semibold bg-emerald-50/30';
                        } else if (['sw_kredit', 'sk_kredit'].includes(key)) {
                          cellClass = 'text-rose-700 font-semibold bg-rose-50/30';
                        } else if (key === 'saldo_global') {
                          cellClass = 'text-sky-950 font-bold bg-sky-100/60';
                        } else if (['saldo_sw', 'saldo_sk'].includes(key)) {
                          cellClass = 'text-sky-900 font-semibold bg-sky-50/40';
                        } else if (['sw_setoran', 'sk_setoran', 'sw_debit_mutasi', 'sk_debit_mutasi'].includes(key)) {
                          cellClass = 'text-emerald-700 font-medium';
                        } else if (['sw_pengambilan', 'sk_pengambilan', 'sw_kredit_mutasi', 'sk_kredit_mutasi', 'sw_kredit_resign', 'sk_kredit_resign'].includes(key)) {
                          cellClass = 'text-rose-700 font-medium';
                        }
                        return (
                          <TableCell key={key} className={`text-right tabular-nums px-3 py-2 whitespace-nowrap ${cellClass}`}>
                            {rupiah(value)}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={20} className="h-24 text-center text-muted-foreground">
                        {search ? 'Tidak ada karyawan yang cocok dengan pencarian.' : 'Tidak ada data karyawan atau transaksi pada periode ini.'}
                      </TableCell>
                    </TableRow>
                  )}
                  {data.length > 0 && (
                    <TableRow className="bg-slate-200/90 font-bold border-t-2 border-slate-300">
                      <TableCell className="sticky left-0 z-10 w-36 min-w-36 sm:w-56 sm:min-w-56 bg-slate-200 border-r border-slate-300 font-extrabold text-slate-900 px-2 py-2 sm:px-3 sm:py-2.5 shadow-[2px_0_6px_-2px_rgba(0,0,0,0.08)]">
                        TOTAL KANTOR
                      </TableCell>
                      {columns.map(([key]) => {
                        const isGlobal = key === 'saldo_global';
                        const isDebit = ['sw_debit', 'sk_debit'].includes(key);
                        const isKredit = ['sw_kredit', 'sk_kredit'].includes(key);
                        let totalExtra = 'text-slate-900 font-bold';
                        if (isGlobal) totalExtra = 'bg-sky-200 text-sky-950 font-extrabold';
                        else if (isDebit) totalExtra = 'text-emerald-900 font-bold bg-emerald-100/60';
                        else if (isKredit) totalExtra = 'text-rose-900 font-bold bg-rose-100/60';
                        return (
                          <TableCell key={key} className={`text-right tabular-nums px-3 py-2 whitespace-nowrap ${totalExtra}`}>
                            {rupiah(totals[key])}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
      <SavingDetailDrawer savingId={selectedSaving?.saving_id ?? null} employeeName={selectedSaving?.employee?.nama_karyawan} onClose={() => setSelectedSaving(null)} />
      <DialogSetoran open={inputBuka} onClose={() => setInputBuka(false)} rows={data.filter((r) => r.is_active)} period={period} />
      <DialogBukaRekening open={bukaRekeningBuka} onClose={() => setBukaRekeningBuka(false)} unregisteredEmployees={unregisteredEmployees} branch={branch} />
    </>
  );
}
