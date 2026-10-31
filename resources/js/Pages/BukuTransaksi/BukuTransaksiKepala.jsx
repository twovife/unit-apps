import React, { useEffect, useMemo, useState } from 'react';

import FormatNumbering from '@/Components/shadcn/FormatNumbering';
import dayjs from 'dayjs';
import AppBadge from '@/Components/shadcn/AppBadge';
import { varianJenis, varianStatus } from '@/Components/shadcn/statusVariants';
import Action from './Action';

/**
 * Satu sel nominal pada kartu nasabah.
 * `tone` menentukan tingkat penekanan visual:
 *  - muted  : nilai pendukung (Pengajuan) -> paling redup
 *  - normal : nilai antara (ACC)
 *  - strong : nilai hasil akhir (Drop Jadi) -> jangkar utama mata
 */
const Amount = ({ label, value, tone = 'normal' }) => {
  const toneClass = {
    muted: 'text-[13px] font-normal text-muted-foreground',
    normal: 'text-[13px] font-medium text-foreground',
    strong: 'text-base font-bold text-foreground',
  }[tone];

  return (
    <div className="min-w-0">
      <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      {value ? (
        <FormatNumbering
          value={value}
          className={`text-start tabular-nums leading-tight ${toneClass}`}
        />
      ) : (
        <div className={`text-start leading-tight ${toneClass}`}>&mdash;</div>
      )}
    </div>
  );
};

const BukuTransaksiKepala = ({ datas }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(datas);
  }, [datas]);

  const calculateTotals = (data) => {
    return data.reduce(
      (acc, item) => {
        acc.request += item.request || 0;
        acc.drop += item.drop || 0;
        acc.drop_jadi += item.drop_jadi || 0;
        acc.acc += item.acc || 0;

        return acc;
      },
      {
        request: 0,
        drop: 0,
        acc: 0,
        drop_jadi: 0,
      },
    );
  };

  const totals = calculateTotals(data);

  // Declare a state variable to track the visibility of the "onCreateShow" component
  const [onCreateShow, setOnCreateShow] = useState(false);
  const [actionData, setActionData] = useState();

  // Event handler function to set the "onCreateShow" state variable to true
  const handleOnCreateShowOpen = (e) => {
    setOnCreateShow(true);
    setActionData(e);
  };

  // Event handler function to set the "onCreateShow" state variable to false
  const handleOnCreateShowClosed = (e) => {
    setOnCreateShow(false);
    setActionData();
  };

  return (
    <>
      <Action
        show={onCreateShow}
        onClosed={handleOnCreateShowClosed}
        triggeredData={actionData}
      />

      {/* Kartu grup per tanggal. Sengaja TIDAK memakai overflow-hidden/auto:
          `overflow` selain visible akan membentuk scroll container baru dan
          membuat `sticky` di bawah ini berhenti bekerja terhadap scroll halaman. */}
      <div className="border rounded-lg">
        {/* Kepala tanggal - menempel di bawah Navbar (h-14) saat digulir */}
        <div className="sticky z-20 flex items-center justify-between gap-2 px-3 py-2 border-b top-14 rounded-t-lg bg-muted">
          <span className="text-sm font-semibold whitespace-nowrap text-foreground">
            {dayjs(data[0]?.tanggal_drop).format('DD-MM-YYYY')}
          </span>
          <span className="text-[11px] capitalize text-muted-foreground">
            {data[0]?.hari} &middot; {data.length} nasabah
          </span>
        </div>

        {/* Daftar nasabah sebagai kartu, bukan baris tabel */}
        <div className="divide-y">
          {data &&
            data.map((item) => (
              <div
                key={item.id}
                role="button"
                tabIndex={0}
                onClick={() => handleOnCreateShowOpen(item)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleOnCreateShowOpen(item);
                  }
                }}
                className="w-full px-3 py-3 text-left transition-colors cursor-pointer hover:bg-accent/50 active:bg-accent"
              >
                {/* Tingkat 1: nama nasabah + status */}
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-[15px] font-semibold leading-snug text-foreground">
                    {item.nama}
                  </h3>
                  {/* Kedua lencana sengaja tanpa onClick sendiri: seluruh
                      kartu sudah bisa ditap dan membuka dialog yang sama,
                      jadi klik di sini cukup merambat ke atas. */}
                  <div className="flex items-center gap-1 shrink-0">
                    {item.is_tundaan && (
                      <AppBadge variant="primary" size="sm">
                        TD
                      </AppBadge>
                    )}
                    <AppBadge
                      variant={varianJenis(item.drop_langsung)}
                      size="sm"
                    >
                      {item.drop_langsung}
                    </AppBadge>
                    <AppBadge variant={varianStatus(item.status)} size="sm">
                      {item.status ?? 'open'}
                    </AppBadge>
                  </div>
                </div>

                {/* Tingkat 3: identitas pendukung */}
                <div className="mt-0.5 truncate text-[11px] text-muted-foreground">
                  {item.nik}
                  {item.alamat ? ` · ${item.alamat}` : ''}
                </div>

                {/* Tingkat 2: alur nominal pengajuan -> ACC -> drop jadi */}
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <Amount label="Pengajuan" value={item.request} tone="muted" />
                  <Amount label="ACC" value={item.acc} tone="normal" />
                  <div className="pl-2 border-l-2 border-primary/60">
                    <Amount
                      label="Drop Jadi"
                      value={item.drop_jadi}
                      tone="strong"
                    />
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Total harian */}
        <div className="px-3 py-2 border-t rounded-b-lg bg-muted/60">
          <div className="grid grid-cols-3 gap-2">
            <Amount
              label="Total Pengajuan"
              value={totals.request}
              tone="muted"
            />
            <Amount label="Total ACC" value={totals.acc} tone="normal" />
            <div className="pl-2 border-l-2 border-primary/60">
              <Amount
                label="Total Drop Jadi"
                value={totals.drop_jadi}
                tone="strong"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BukuTransaksiKepala;
