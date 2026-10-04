import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shadcn/ui/table";
import FormatNumbering from "@/Components/shadcn/FormatNumbering";
import dayjs from "dayjs";
import { Button } from "@/shadcn/ui/button";
import Action from "./Action";
import { Badge } from "@/shadcn/ui/badge";
import { usePage } from "@inertiajs/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const AngsuranTable = ({ dateOfWeek, datas }) => {
  // Rincian angsuran sebelum bulan terpilih (tombol di samping Saldo
  // Sebelumnya): tiap klik membuka SATU bulan lagi ke belakang, per tanggal
  // tagih + total bulannya; sisanya digabung di "≤ bulan", lalu koreksi
  // (MD/penyesuaian). Pinjaman - kolom total = Saldo Sebelumnya.
  const { server_filter } = usePage().props;
  const [jumlahBulan, setJumlahBulan] = useState(0);
  const rinci = jumlahBulan > 0;
  const MAKS_BULAN = 12;
  const namaBulan = (b) => b.toDate().toLocaleDateString("id-ID", { month: "short" });
  const HARI_KE = { minggu: 0, senin: 1, selasa: 2, rabu: 3, kamis: 4, jumat: 5, sabtu: 6 };
  const bulanRinci = Array.from({ length: jumlahBulan }, (_, i) => jumlahBulan - i).map((mundur) =>
    dayjs(server_filter?.month).subtract(mundur, "month"),
  );
  const awalRinci = bulanRinci[0]?.format("YYYY-MM");
  const tanggalTagih = (b) => {
    const hasil = [];
    for (let d = b.startOf("month"); d.month() === b.month(); d = d.add(1, "day")) {
      if (d.day() === HARI_KE[String(server_filter?.hari).toLowerCase()]) hasil.push(d.format("YYYY-MM-DD"));
    }
    return hasil;
  };
  // Kolom: { label, nilai(row), jenis: 'tgl' | 'total' | 'koreksi', d? }
  const kolomRinci = !rinci ? [] : [
    {
      label: `≤ ${namaBulan(bulanRinci[0].subtract(1, "month"))}`,
      jenis: "total",
      nilai: (r) => Object.entries(r.per_bulan ?? {}).reduce((t, [k, v]) => (k < awalRinci ? t + v : t), 0),
    },
    ...bulanRinci.flatMap((b) => [
      ...tanggalTagih(b).map((d) => ({
        label: dayjs(d).format("DD-MM"),
        jenis: "tgl",
        d,
        nilai: (r) => r.instalment?.[d]?.total_nominal ?? 0,
      })),
      { label: `Σ ${namaBulan(b)}`, jenis: "total", nilai: (r) => r.per_bulan?.[b.format("YYYY-MM")] ?? 0 },
    ]),
    {
      label: "MD/Peny",
      jenis: "koreksi",
      nilai: (r) =>
        (Number(r.pinjaman) || 0) -
        Object.values(r.per_bulan ?? {}).reduce((t, v) => t + v, 0) -
        (Number(r.saldo_sebelumnya) || 0),
    },
  ];

  const [data, setData] = useState([]);
  useEffect(() => {
    setData(datas);
  }, [datas]);

  const calculateInstalment = (data, keyToSum) => {
    const result = data.reduce(
      (acc, item) =>
        acc + parseInt(item.instalment[keyToSum]?.total_nominal ?? 0),
      0,
    );
    return result;
  };

  const calculateTotals = (data, keyToSum) => {
    const result = data.reduce(
      (acc, item) => acc + parseInt(item[keyToSum] ?? 0),
      0,
    );
    return result;
  };

  const [triggeredId, setTriggeredId] = useState(null);
  const [show, setShow] = useState(false);
  const onCreateShowOpen = (id) => {
    setTriggeredId(id);
    setShow(true);
  };
  const onClosedShowOpen = () => {
    setShow(false);
    setTriggeredId(null);
  };

  const [selectedId, setSelectedId] = useState([]);

  const handleRowClick = (id) => {
    setSelectedId((prevSelectedRows) => {
      if (prevSelectedRows.includes(id)) {
        // Jika ID sudah ada, hapus dari array (toggle)
        return prevSelectedRows.filter((rowId) => rowId !== id);
      } else {
        // Jika ID belum ada, tambahkan ke array
        return [...prevSelectedRows, id];
      }
    });
  };

  return (
    <div className="relative overflow-auto h-[60vh] lg:h-[85vh] scrollbar-thin">
      {/* table-fixed + w-full: kalau kolomnya muat, tabel melebar penuh layar; kalau rincian bulan dibuka dan jumlah lebar kolom melebihi layar, tabel ikut melebar dan bisa digeser. */}
      <Table className="w-full text-xs rounded-lg table-fixed">
        <TableHeader className="sticky top-0 left-0 z-10">
          <TableRow className="bg-gray-200">
            <TableHead className="w-10 text-center">No</TableHead>
            <TableHead className="text-center w-28">Tanggal</TableHead>
            <TableHead className="w-40 text-center">Nama Nasabah</TableHead>
            <TableHead className="w-36 text-center">NIK</TableHead>
            <TableHead className="w-24 text-center">Note</TableHead>
            <TableHead className="w-48 text-center">Alamat</TableHead>
            <TableHead className="w-14 text-center">Kelompok</TableHead>
            <TableHead className="w-14 text-center">Hari</TableHead>
            <TableHead className="w-12 text-center">Pnj Ke</TableHead>
            <TableHead className="w-12 text-center">X Angs</TableHead>
            <TableHead className="w-20 text-center border-x border-x-black">
              Pinjaman
            </TableHead>
            {rinci &&
              kolomRinci.map((k, i) => (
                <TableHead
                  key={i}
                  className={`w-16 text-center whitespace-nowrap border-x border-x-black ${k.jenis === "tgl" ? "" : "font-semibold"}`}
                  title={k.jenis === "koreksi" ? "Pemutihan & penyesuaian sebelum bulan ini" : undefined}
                >
                  {k.label}
                </TableHead>
              ))}
            <TableHead className="text-center w-28 border-x border-x-black">
              <div className="flex items-center justify-center gap-1">
                {jumlahBulan < MAKS_BULAN && (
                  <button
                    type="button"
                    className="p-0.5 rounded hover:bg-gray-300"
                    title="Buka satu bulan lagi ke belakang"
                    onClick={() => setJumlahBulan((n) => n + 1)}
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                )}
                Saldo Sebelumnya
                {rinci && (
                  <button
                    type="button"
                    className="p-0.5 rounded hover:bg-gray-300"
                    title="Tutup rincian"
                    onClick={() => setJumlahBulan(0)}
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </TableHead>
            {dateOfWeek.map((day, i) => (
              <TableHead
                className="w-16 text-center border-x border-x-black"
                key={i}
              >
                {dayjs(day).format("DD-MM")}
              </TableHead>
            ))}
            <TableHead className="w-20 text-center border-x border-x-black">
              Angsuran
            </TableHead>
            <TableHead className="w-16 text-center border-x border-x-black">
              (MD)
            </TableHead>
            <TableHead className="w-20 text-center border-x border-x-black">
              Saldo
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data ? (
            data.map((row, i) => (
              <React.Fragment key={i}>
                <TableRow>
                  <TableCell colSpan={15 + (dateOfWeek.length ?? 0) + kolomRinci.length}>
                    {row.month}
                  </TableCell>
                </TableRow>
                {row.data.map((subrow, i) => (
                  <TableRow
                    className={selectedId.includes(subrow.id) ? "bg-green-200" : "even:bg-gray-50"}
                    key={i}
                  >
                    <TableCell onClick={() => handleRowClick(subrow.id)}>
                      {i + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-between gap-2">
                        <div className="whitespace-nowrap">{dayjs(subrow.tanggal_drop).format("DD-MM")}</div>
                        <div>
                          <Button
                            size="xs"
                            onClick={() => onCreateShowOpen(subrow.id)}
                          >
                            Pay
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="truncate" title={subrow.nama}>{subrow.nama}</TableCell>
                    <TableCell className="text-center">{subrow.nik}</TableCell>
                    <TableCell className="text-center">
                      {subrow.lunas ? (
                        <span className="px-2 py-1 mr-1 text-xs text-white bg-green-400 border rounded">
                          Lunas
                        </span>
                      ) : (
                        ""
                      )}
                      {/* {subrow.status_pinjaman == 'normal' ? (
                        <span className="px-2 py-1 mr-1 text-xs border rounded">
                          {subrow.status_pinjaman}
                        </span>
                      ) : subrow.status_pinjaman == 'cm' ? (
                        <span className="px-2 py-1 mr-1 text-xs text-white bg-yellow-400 border rounded">
                          {subrow.status_pinjaman}
                        </span>
                      ) : subrow.status_pinjaman == 'mb' ? (
                        <span className="px-2 py-1 mr-1 text-xs text-white bg-red-400 border rounded">
                          {subrow.status_pinjaman}
                        </span>
                      ) : subrow.status_pinjaman == 'ml' ? (
                        <span className="px-2 py-1 mr-1 text-xs text-white bg-black border rounded">
                          {subrow.status_pinjaman}
                        </span>
                      ) : (
                        <div>{subrow.status_pinjaman}</div>
                      )} */}
                      {subrow.notes !== null ? (
                        <Badge>{subrow.notes}</Badge>
                      ) : (
                        ""
                      )}
                    </TableCell>
                    <TableCell className="truncate" title={subrow.alamat}>{subrow.alamat}</TableCell>
                    <TableCell className="text-center">
                      {subrow.kelompok}
                    </TableCell>
                    <TableCell className="text-center">{subrow.hari}</TableCell>
                    <TableCell className="text-center">
                      {subrow.pinjaman_ke}
                    </TableCell>
                    <TableCell className="text-center">
                      {subrow.x_angs}
                    </TableCell>
                    <TableCell
                      className={`bg-slate-200 hover:bg-slate-100 border-x border-x-black ${
                        selectedId.includes(subrow.id)
                          ? "bg-green-200 hover:bg-green-50"
                          : ""
                      }`}
                    >
                      <FormatNumbering ribuan value={subrow.pinjaman} />
                    </TableCell>
                    {rinci &&
                      kolomRinci.map((k, i) => {
                        const v = k.nilai(subrow);
                        const katrol = k.jenis === "tgl" && subrow.instalment?.[k.d]?.is_active;
                        return (
                          <TableCell
                            key={i}
                            className={`border-x border-x-black ${k.jenis === "tgl" ? "" : "font-semibold"} ${
                              (k.jenis === "koreksi" && v) || katrol ? "text-red-600 font-semibold" : ""
                            }`}
                          >
                            {v ? <FormatNumbering ribuan value={v} /> : <div className="text-center text-gray-300">–</div>}
                          </TableCell>
                        );
                      })}
                    <TableCell
                      className={`bg-blue-300 hover:bg-blue-100 border-x border-x-black ${
                        selectedId.includes(subrow.id)
                          ? "bg-green-200 hover:bg-green-50"
                          : ""
                      }`}
                    >
                      <FormatNumbering ribuan value={subrow.saldo_sebelumnya} />
                    </TableCell>
                    {dateOfWeek.map((day, i) => (
                      <TableCell
                        className={`border-x border-x-black ${
                          subrow.instalment[day]?.is_active
                            ? "text-red-500 font-semibold"
                            : ""
                        }`}
                        key={i}
                      >
                        <FormatNumbering ribuan
                          value={subrow.instalment[day]?.total_nominal}
                        />
                      </TableCell>
                    ))}
                    <TableCell
                      className={`bg-yellow-200 hover:bg-yellow-100 border-x border-x-black ${
                        selectedId.includes(subrow.id)
                          ? "bg-green-200 hover:bg-green-50"
                          : ""
                      }`}
                    >
                      <FormatNumbering ribuan value={subrow.angsuran} />
                    </TableCell>
                    <TableCell
                      className={`bg-gray-50 hover:bg-gray-100 border-x border-x-black ${
                        selectedId.includes(subrow.id)
                          ? "bg-green-200 hover:bg-green-50"
                          : ""
                      }`}
                    >
                      <FormatNumbering ribuan value={subrow.pemutihanThisMonth} />
                    </TableCell>
                    <TableCell
                      className={`bg-green-300 hover:bg-green-100 border-x border-x-black ${
                        selectedId.includes(subrow.id)
                          ? "bg-green-200 hover:bg-green-50"
                          : ""
                      }`}
                    >
                      <FormatNumbering ribuan value={subrow.saldo} />
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-gray-100">
                  <TableCell className="py-3" colSpan={10}>
                    ini nanti total
                  </TableCell>
                  <TableCell
                    className={`bg-slate-200 hover:bg-slate-100 border-x border-x-black`}
                  >
                    <FormatNumbering ribuan
                      value={calculateTotals(row.data, "pinjaman")}
                    />
                  </TableCell>
                  {rinci &&
                    kolomRinci.map((k, i) => (
                      <TableCell key={i} className="border-x border-x-black">
                        <FormatNumbering ribuan value={row.data.reduce((t, r) => t + k.nilai(r), 0)} />
                      </TableCell>
                    ))}
                  <TableCell
                    className={`bg-blue-300 hover:bg-blue-100 border-x border-x-black`}
                  >
                    <FormatNumbering ribuan
                      value={calculateTotals(row.data, "saldo_sebelumnya")}
                    />
                  </TableCell>
                  {dateOfWeek.map((day, i) => (
                    <TableCell className="border-x border-x-black" key={i}>
                      <FormatNumbering ribuan
                        value={calculateInstalment(row.data, day)}
                      />
                    </TableCell>
                  ))}
                  <TableCell
                    className={`bg-yellow-200 hover:bg-yellow-100 border-x border-x-black `}
                  >
                    <FormatNumbering ribuan
                      value={calculateTotals(row.data, "angsuran")}
                    />
                  </TableCell>
                  <TableCell
                    className={`bg-gray-50 hover:bg-gray-100 border-x border-x-black `}
                  >
                    <FormatNumbering ribuan
                      value={calculateTotals(row.data, "pemutihanThisMonth")}
                    />
                  </TableCell>
                  <TableCell
                    className={`bg-green-300 hover:bg-green-100 border-x border-x-black `}
                  >
                    <FormatNumbering ribuan
                      value={calculateTotals(row.data, "saldo")}
                    />
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))
          ) : (
            <TableRow>
              <TableCell>a</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Action
        datas={data}
        show={show}
        onClosed={onClosedShowOpen}
        triggeredId={triggeredId}
      />
    </div>
  );
};

export default AngsuranTable;
