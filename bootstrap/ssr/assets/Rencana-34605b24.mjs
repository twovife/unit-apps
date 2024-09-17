import { j as jsxs, a as jsx, F as Fragment } from "../ssr.mjs";
import { useState, useEffect, useMemo } from "react";
import { F as FormatNumbering, T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./FormatNumbering-1920aef2.mjs";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import "./button-6facd6da.mjs";
import dayjs from "dayjs";
import "./badge-985735af.mjs";
import Action from "./Action-fdf343a0.mjs";
import { B as BadgeStatus } from "./BadgeStatus-c949f052.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react";
import "@inertiajs/react/server";
import "./utils-efa289ef.mjs";
import "clsx";
import "tailwind-merge";
import "react-number-format";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./dialog-e17b5153.mjs";
import "@radix-ui/react-dialog";
import "@radix-ui/react-icons";
import "./card-c2e72800.mjs";
import "./tabs-c148af71.mjs";
import "@radix-ui/react-tabs";
import "axios";
import "./RiwayatPengajuan-f2055ce9.mjs";
import "lucide-react";
import "./DetailRiwayat-1f0bb428.mjs";
import "./Acc-5d12acbd.mjs";
import "./Loading-649771fa.mjs";
import "react-dom";
import "@headlessui/react";
import "./label-cecd7064.mjs";
import "@radix-ui/react-label";
import "react-currency-input-field";
import "./Tolak-83d689aa.mjs";
import "./DropJadi-a874114d.mjs";
import "./Gagal-5ba432cc.mjs";
const Rencana = ({ datas }) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    setData(datas);
  }, [datas]);
  console.log(data);
  const columns = useMemo(
    () => [
      {
        header: "Tgl Drop",
        accessorKey: "tanggal",
        cell: ({ getValue, cell }) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { children: dayjs(getValue()).format("DD-MM-YY") }),
          /* @__PURE__ */ jsx(BadgeStatus, { value: cell.row.original.drop_langsung })
        ] })
      },
      {
        header: "Status",
        type: "show",
        accessorKey: "status",
        cell: ({ getValue }) => getValue()
      },
      {
        header: "Nama",
        accessorKey: "nama",
        cell: ({ getValue }) => getValue()
      },
      {
        header: "Alamat",
        accessorKey: "alamat",
        cell: ({ getValue }) => getValue()
      },
      {
        header: "No Angt",
        accessorKey: "nomor_anggota",
        cell: ({ getValue }) => getValue()
      },
      {
        header: "Pinj ke",
        accessorKey: "pinjaman_ke",
        cell: ({ getValue }) => getValue()
      },
      {
        header: "Drop",
        accessorKey: "drop",
        cell: ({ getValue }) => /* @__PURE__ */ jsx(FormatNumbering, { value: getValue() })
      },
      {
        header: "Pengajuan",
        accessorKey: "request",
        cell: ({ getValue }) => /* @__PURE__ */ jsx(FormatNumbering, { value: getValue() })
      },
      {
        header: "Acc",
        accessorKey: "acc",
        cell: ({ getValue }) => /* @__PURE__ */ jsx(FormatNumbering, { value: getValue() })
      },
      {
        header: "Drop Jadi",
        accessorKey: "drop_jadi",
        cell: ({ getValue }) => /* @__PURE__ */ jsx(FormatNumbering, { value: getValue() })
      }
    ],
    []
  );
  useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    debugTable: true
  });
  const [onCreateShow, setOnCreateShow] = useState(false);
  const [actionData, setActionData] = useState();
  const handleOnCreateShowClosed = (e) => {
    setOnCreateShow(false);
    setActionData();
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      Action,
      {
        show: onCreateShow,
        onClosed: handleOnCreateShowClosed,
        triggeredData: actionData
      }
    ),
    /* @__PURE__ */ jsxs(Table, { className: "w-full table-auto", children: [
      /* @__PURE__ */ jsx(TableHeader, { className: "sticky top-0 z-10 bg-gray-100", children: /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Tanggal" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Kasbon" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Target" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Masuk" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Keluar" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Storting" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Drop" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Baru" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Lama" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Rencana" })
      ] }) }),
      /* @__PURE__ */ jsx(TableBody, { children: /* @__PURE__ */ jsxs(TableRow, { className: `text-center`, children: [
        /* @__PURE__ */ jsx(TableCell, { children: dayjs(data.tanggal).format("DD-MM-YYYY") }),
        /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(FormatNumbering, { value: data.kasbon }) }),
        /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(FormatNumbering, { value: data.target }) }),
        /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(FormatNumbering, { value: data.masuk }) }),
        /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(FormatNumbering, { value: data.keluar }) }),
        /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(FormatNumbering, { value: data.storting }) }),
        /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(FormatNumbering, { value: data.drop }) }),
        /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(FormatNumbering, { value: data.baru }) }),
        /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(FormatNumbering, { value: data.lama }) }),
        /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(FormatNumbering, { value: data.rencana }) })
      ] }) })
    ] })
  ] });
};
export {
  Rencana as default
};
