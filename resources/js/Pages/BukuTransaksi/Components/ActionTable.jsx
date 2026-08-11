import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import AppBadge from '@/Components/shadcn/AppBadge';
import { varianJenis, varianStatus } from '@/Components/shadcn/statusVariants';

/**
 * Detail satu pengajuan.
 *
 * Dulu berupa <Table> 14 kolom untuk SATU baris data (dan kolom "Kelompok"
 * tercetak dua kali), sehingga di layar HP harus digeser menyamping dan tidak
 * ada yang menonjol. Sekarang berupa blok identitas + daftar label/nilai.
 */

const Field = ({ label, children }) => (
  <div className="min-w-0">
    <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
      {label}
    </div>
    <div className="text-sm leading-tight break-words text-foreground">
      {children || <span className="text-muted-foreground">&mdash;</span>}
    </div>
  </div>
);

const tanggal = (value, format = 'DD MMM YYYY') =>
  value ? dayjs(value).format(format) : null;

const ActionTable = ({ datas }) => {
  const [data, setData] = useState({});
  useEffect(() => {
    setData(datas ?? {});
  }, [datas]);

  return (
    <div>
      {/* Tingkat 1 - identitas nasabah, paling menonjol */}
      <div className="px-3 py-3 border-b bg-muted/40">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-bold leading-tight text-foreground">
            {data.nama || (
              <span className="text-muted-foreground">&mdash;</span>
            )}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            {data.is_tundaan && (
              <AppBadge variant="primary" size="base">
                TD
              </AppBadge>
            )}
            <AppBadge variant={varianJenis(data.drop_langsung)} size="base">
              {data.drop_langsung}
            </AppBadge>
            <AppBadge variant={varianStatus(data.status)} size="base">
              {data.status ?? 'open'}
            </AppBadge>
          </div>
        </div>
        <div className="mt-1 text-sm text-foreground">
          {data.alamat || (
            <span className="text-muted-foreground">&mdash;</span>
          )}
        </div>
        <div className="mt-0.5 text-xs tabular-nums text-muted-foreground">
          NIK {data.nik || '—'}
        </div>
      </div>

      {/* Tingkat 2 - detail pengajuan lainnya */}
      <div className="grid grid-cols-2 px-3 py-3 gap-x-4 gap-y-3 sm:grid-cols-3">
        <Field label="Nomor Pengajuan">{data.nomor_pengajuan}</Field>
        <Field label="Nomor Anggota">{data.nomor_anggota}</Field>
        <Field label="Pinjaman Ke">{data.pinjaman_ke}</Field>
        <Field label="Unit">{data.unit}</Field>
        <Field label="Kelompok">{data.kelompok}</Field>
        <Field label="Hari">
          <span className="capitalize">{data.hari}</span>
        </Field>
        <Field label="Tanggal Pengajuan">{tanggal(data.request_date)}</Field>
        <Field label="Tanggal Drop">{tanggal(data.tanggal_drop)}</Field>
        <Field label="Jenis">
          <span className="capitalize">{data.drop_langsung}</span>
        </Field>
      </div>
    </div>
  );
};

export default ActionTable;
