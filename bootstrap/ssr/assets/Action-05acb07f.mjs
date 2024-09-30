import { a as jsx, F as Fragment, j as jsxs } from "../ssr.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription } from "./dialog-1c7227a2.mjs";
import { useState, useEffect } from "react";
import { C as Card, a as CardHeader, b as CardTitle, d as CardContent, c as CardDescription } from "./card-1314102b.mjs";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-f70be525.mjs";
import axios from "axios";
import RiwayatPengajuan from "./RiwayatPengajuan-561e2ee3.mjs";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-7c40bdcc.mjs";
import "./badge-3e44e85b.mjs";
import { F as FormatNumbering } from "./FormatNumbering-4e9be903.mjs";
import dayjs from "dayjs";
import Acc from "./Acc-ff1cd03b.mjs";
import Tolak from "./Tolak-4a7c0e59.mjs";
import DropJadi from "./DropJadi-a79f5698.mjs";
import Gagal from "./Gagal-434b7d12.mjs";
import { B as BargeStatus } from "./BargeStatus-66d07388.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react";
import "@inertiajs/react/server";
import "@radix-ui/react-dialog";
import "@radix-ui/react-icons";
import "./utils-e5930d84.mjs";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-tabs";
import "@tanstack/react-table";
import "./button-5b8f0147.mjs";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "lucide-react";
import "./DetailRiwayat-fae5eaf1.mjs";
import "react-number-format";
import "./Loading-7f1a61e6.mjs";
import "react-dom";
import "@headlessui/react";
import "./label-143f493c.mjs";
import "@radix-ui/react-label";
import "react-currency-input-field";
const Action = ({ show = false, onClosed, triggeredData }) => {
  console.log(triggeredData);
  const [data, setData] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [acc, setAcc] = useState();
  const [loading, setLoading] = useState(false);
  const [erorAxios, setErorAxios] = useState(false);
  useEffect(() => {
    setData(triggeredData);
    setAcc(triggeredData == null ? void 0 : triggeredData.request);
  }, [triggeredData]);
  const onNikSubmit = async (e) => {
    setLoading(true);
    setErorAxios();
    await axios({
      method: "post",
      url: route("transaction.nasabah_buku_transaksi"),
      data: {
        nik: triggeredData.nik
      }
    }).then(function({ data: data2 }) {
      setLoading(false);
      if (data2.falidate_nik) {
        setCustomerData(data2.data);
      } else {
        setCustomerData([]);
      }
    }).catch(function({ response }) {
      setErorAxios(response.data.message);
      setLoading(false);
    });
  };
  useEffect(() => {
    if (triggeredData == null ? void 0 : triggeredData.nik) {
      onNikSubmit();
    }
  }, [triggeredData]);
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(Dialog, { open: show, onOpenChange: (open) => open ? "" : onClosed(), children: /* @__PURE__ */ jsxs(DialogContent, { className: "h-[90vh] lg:h-auto overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin", children: [
    erorAxios && /* @__PURE__ */ jsx("div", { children: "terjadi kesalahan saat memuat data" }),
    loading ? /* @__PURE__ */ jsx("div", { children: "Data Sedang Dimuat" }) : /* @__PURE__ */ jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsx(DialogTitle, { children: "Check Transaksi Mantri" }),
      /* @__PURE__ */ jsx(DialogDescription, { children: /* @__PURE__ */ jsxs(Tabs, { defaultValue: "account", className: "w-full", children: [
        /* @__PURE__ */ jsxs(TabsList, { className: "grid w-full grid-cols-2", children: [
          /* @__PURE__ */ jsx(TabsTrigger, { value: "account", children: "Action" }),
          /* @__PURE__ */ jsx(TabsTrigger, { value: "password", children: "Riwayat Pinjaman" })
        ] }),
        /* @__PURE__ */ jsxs(TabsContent, { value: "account", children: [
          /* @__PURE__ */ jsxs(Card, { children: [
            /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Detail Pengajuan" }) }),
            /* @__PURE__ */ jsx(CardContent, { className: "space-y-2", children: /* @__PURE__ */ jsx("div", { className: "overflow-auto border rounded-lg scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin", children: detailTable(data) }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 mt-3 lg:flex-row", children: [
            /* @__PURE__ */ jsxs(Card, { className: "w-full", children: [
              /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Acc / Cek Kodham" }) }),
              /* @__PURE__ */ jsx(CardContent, { className: "space-y-2", children: /* @__PURE__ */ jsx("div", { className: "flex items-end justify-center gap-2 mx-auto lg:w-1/2", children: (data == null ? void 0 : data.status) === "open" ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(
                  Acc,
                  {
                    id: data == null ? void 0 : data.nomor_pengajuan,
                    acc: (data == null ? void 0 : data.acc) ?? (data == null ? void 0 : data.request),
                    onClosed
                  }
                ),
                /* @__PURE__ */ jsx(
                  Tolak,
                  {
                    id: data == null ? void 0 : data.nomor_pengajuan,
                    onClosed
                  }
                )
              ] }) : /* @__PURE__ */ jsxs("div", { children: [
                "Status Pengajuan = ",
                data == null ? void 0 : data.status,
                ", Tanggal",
                " ",
                data == null ? void 0 : data.check_date
              ] }) }) })
            ] }),
            (data == null ? void 0 : data.status) !== "open" && /* @__PURE__ */ jsxs(Card, { className: "w-full", children: [
              /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Drop Jadi" }) }),
              /* @__PURE__ */ jsx(CardContent, { className: "space-y-2", children: /* @__PURE__ */ jsx("div", { className: "flex items-end justify-center gap-2 mx-auto lg:w-1/2", children: (data == null ? void 0 : data.status) === "acc" ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(
                  DropJadi,
                  {
                    id: data == null ? void 0 : data.nomor_pengajuan,
                    drop_jadi: data == null ? void 0 : data.acc,
                    onClosed
                  }
                ),
                /* @__PURE__ */ jsx(
                  Gagal,
                  {
                    id: data == null ? void 0 : data.nomor_pengajuan,
                    onClosed
                  }
                )
              ] }) : /* @__PURE__ */ jsxs("div", { children: [
                "Status Pengajuan = ",
                data == null ? void 0 : data.status,
                ", Tanggal",
                " ",
                data == null ? void 0 : data.check_date
              ] }) }) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx(TabsContent, { value: "password", children: /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsx(CardTitle, { children: "Riwayat Pengajuan" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Riwayat Pengajuan Nasabah dilihat berdasarkan NIK yang tertera dari semua cabang" })
          ] }),
          /* @__PURE__ */ jsx(CardContent, { className: "space-y-2", children: /* @__PURE__ */ jsx("div", { className: "h-[50vh] border rounded-lg overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin", children: /* @__PURE__ */ jsx(RiwayatPengajuan, { data: customerData }) }) })
        ] }) })
      ] }) })
    ] })
  ] }) }) });
};
function detailTable(data) {
  return /* @__PURE__ */ jsxs(Table, { children: [
    /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
      /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Nomor Pengajuan" }),
      /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Tanggal Pengajuan" }),
      /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Status" }),
      /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Nama Nasabah" }),
      /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Unit" }),
      /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Pengajuan" }),
      /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Tgl Drop" }),
      /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Pinj Ke" }),
      /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Acc" }),
      /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Drop Jadi" })
    ] }) }),
    data && /* @__PURE__ */ jsx(TableBody, { children: /* @__PURE__ */ jsxs(TableRow, { className: "text-center", children: [
      /* @__PURE__ */ jsx(TableCell, { children: data.nomor_pengajuan }),
      /* @__PURE__ */ jsx(TableCell, { className: "text-start", children: data.tanggal_pengajuan }),
      /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(BargeStatus, { value: data.status }) }),
      /* @__PURE__ */ jsxs(TableCell, { className: "text-start", children: [
        /* @__PURE__ */ jsx("div", { children: data.nama }),
        /* @__PURE__ */ jsx("div", { children: data.nik }),
        /* @__PURE__ */ jsx("div", { children: data.alamat })
      ] }),
      /* @__PURE__ */ jsxs(TableCell, { className: "text-start", children: [
        /* @__PURE__ */ jsx("div", { className: "whitespace-nowrap", children: data.unit }),
        /* @__PURE__ */ jsxs("div", { children: [
          "Kel ",
          data.kelompok
        ] })
      ] }),
      /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(FormatNumbering, { value: data.request }) }),
      /* @__PURE__ */ jsx(TableCell, { children: dayjs(data.tanggal_drop).format("DD/MM") }),
      /* @__PURE__ */ jsx(TableCell, { children: data.pinjaman_ke }),
      /* @__PURE__ */ jsx(TableCell, { children: data.acc }),
      /* @__PURE__ */ jsx(TableCell, { children: data.drop_jadi })
    ] }) })
  ] });
}
export {
  Action as default
};
