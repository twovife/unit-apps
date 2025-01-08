import { a as jsx, j as jsxs } from "../ssr.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-97d8ecd0.mjs";
import { useState, useEffect } from "react";
import { C as Card, a as CardHeader, b as CardTitle, d as CardContent } from "./card-f356ad44.mjs";
import axios from "axios";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-8d30c177.mjs";
import dayjs from "dayjs";
import { F as FormatNumbering } from "./FormatNumbering-47cfa339.mjs";
import { B as Badge } from "./badge-ad1cae46.mjs";
import BayarAngsuran from "./BayarAngsuran-12102b3a.mjs";
import JenisNasabah from "./JenisNasabah-255e5d7a.mjs";
import DeleteAngsuran from "./DeleteAngsuran-aac95183.mjs";
import DeleteLoan from "./DeleteLoan-53e22530.mjs";
import { usePage } from "@inertiajs/react";
import { u as useFrontEndPermission } from "./useFrontEndPermission-59a7cda0.mjs";
import { N as NoEditOverlay } from "./NoEditOverlay-fb1d5d5c.mjs";
import { toast } from "sonner";
import { T as Toaster } from "./sonner-0ca6cfec.mjs";
import { u as useIsMobile } from "./use-mobile-f8f7682a.mjs";
import { Copy } from "lucide-react";
import { B as BadgeStatus } from "./BadgeStatus-1947fb26.mjs";
import { B as Button } from "./button-e7ccf50f.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "@radix-ui/react-dialog";
import "@radix-ui/react-icons";
import "./utils-efa289ef.mjs";
import "clsx";
import "tailwind-merge";
import "react-number-format";
import "class-variance-authority";
import "./label-7289427a.mjs";
import "@radix-ui/react-label";
import "./input-22e7db4a.mjs";
import "react-currency-input-field";
import "./Checkbox-d7000d9c.mjs";
import "./Loading-95bc2f77.mjs";
import "react-dom";
import "@headlessui/react";
import "./InputError-3b072368.mjs";
import "./InputLabel-20ddd95c.mjs";
import "./PrimaryButton-e2c4c1f4.mjs";
import "./SelectList-8beaa241.mjs";
import "./TextInput-11198f62.mjs";
import "next-themes";
import "@radix-ui/react-slot";
const StatusPinjaman = ({ value = "normal" }) => {
  const valielue = value == null ? void 0 : value.toLowerCase();
  switch (valielue) {
    case "normal":
      return /* @__PURE__ */ jsx(Badge, { variant: "outline", children: value });
    case "cm":
      return /* @__PURE__ */ jsx(Badge, { variant: "yellow", children: value });
    case "mb":
      return /* @__PURE__ */ jsx(Badge, { variant: "destructive", children: value });
    case "ml":
      return /* @__PURE__ */ jsx(Badge, { children: value });
    case "lunas":
      return /* @__PURE__ */ jsx(Badge, { variant: "green", children: value });
    case "belum":
      return /* @__PURE__ */ jsx(Badge, { variant: "outline", children: value });
    default:
      return /* @__PURE__ */ jsx(Badge, { children: value });
  }
};
const Action = ({ datas, show = false, onClosed, triggeredId }) => {
  const isMobile = useIsMobile();
  const {
    server_filter: { closed_transaction }
  } = usePage().props;
  const [loading, setLoading] = useState(false);
  const [erorAxios, setErorAxios] = useState(false);
  const { isCreator } = useFrontEndPermission();
  const [customerData, setCustomerData] = useState({});
  const [instalment, setInstalment] = useState([]);
  const onNikSubmit = async (triggeredId2) => {
    setLoading(true);
    setErorAxios();
    await axios({
      method: "get",
      url: route("pinjaman.get_loan_pinjaman", triggeredId2)
    }).then(function({ data }) {
      setLoading(false);
      setCustomerData(data.pinjaman);
      setInstalment(data.instalment);
    }).catch(function({ response }) {
      setErorAxios();
    });
  };
  const checkPengajuanUlang = async (triggeredId2) => {
    setLoading(true);
    setErorAxios();
    await axios({
      method: "get",
      url: route("pinjaman.checkpengajuan", triggeredId2)
    }).then(function({ data }) {
      setLoading(false);
      console.log(data);
    }).catch(function({ response }) {
      setErorAxios();
    });
  };
  useEffect(() => {
    if (triggeredId) {
      onNikSubmit(triggeredId);
    }
  }, [triggeredId, datas]);
  const modalIsClosed = () => {
    onClosed();
    setCustomerData({});
    setInstalment([]);
  };
  return /* @__PURE__ */ jsx(Dialog, { open: show, onOpenChange: (open) => open ? "" : modalIsClosed(), children: /* @__PURE__ */ jsxs(DialogContent, { className: `w-[95vw] p-1 lg:p-6`, children: [
    /* @__PURE__ */ jsxs(DialogHeader, { className: "max-h-10", children: [
      /* @__PURE__ */ jsx(DialogTitle, { className: "p-2", children: "Isi Angsuran" }),
      /* @__PURE__ */ jsx(
        Button,
        {
          type: "button",
          onClick: () => checkPengajuanUlang(triggeredId)
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "h-[80vh] overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin", children: [
      /* @__PURE__ */ jsxs(Card, { className: "w-full", children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Rincian Nasabah" }) }),
        /* @__PURE__ */ jsx(CardContent, { className: "p-1 lg:p-5", children: /* @__PURE__ */ jsxs("div", { className: "w-full overflow-auto", children: [
          /* @__PURE__ */ jsx(Toaster, {}),
          isMobile ? /* @__PURE__ */ jsx(MobileCardList, { customerData }) : /* @__PURE__ */ jsx(PinjamanWebTable, { customerData })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col w-full gap-3 mt-3 lg:flex-row", children: [
        /* @__PURE__ */ jsxs(Card, { className: "flex-[5]", children: [
          /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Rincian Angsuran" }) }),
          /* @__PURE__ */ jsx(CardContent, { className: "p-1 lg:p-5", children: /* @__PURE__ */ jsx("div", { className: "w-full overflow-auto", children: /* @__PURE__ */ jsxs(Table, { className: "text-xs", children: [
            /* @__PURE__ */ jsx(TableHeader, { className: "bg-gray-200", children: /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Action" }),
              /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Tanggal" }),
              /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Jumlah" }),
              /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Saldo" }),
              /* @__PURE__ */ jsx(TableHead, { className: "hidden text-center lg:table-cell", children: "Mantri" }),
              /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Status" })
            ] }) }),
            /* @__PURE__ */ jsx(TableBody, { children: Object.keys(customerData).length !== 0 ? instalment.map((item) => /* @__PURE__ */ jsxs(TableRow, { className: "text-center", children: [
              /* @__PURE__ */ jsx(TableCell, { children: (!closed_transaction || closed_transaction <= item.transaction_date) && /* @__PURE__ */ jsx(DeleteAngsuran, { id: item.id }) }),
              /* @__PURE__ */ jsx(TableCell, { className: "whitespace-nowrap", children: dayjs(item.transaction_date).format("DD-MM-YY") }),
              /* @__PURE__ */ jsx(
                TableCell,
                {
                  className: `${item.danatitipan == 1 ? "text-red-500 font-semibold" : ""}`,
                  children: /* @__PURE__ */ jsx(FormatNumbering, { value: item.nominal })
                }
              ),
              /* @__PURE__ */ jsx(TableCell, { children: item.saldo }),
              /* @__PURE__ */ jsx(TableCell, { className: "hidden lg:block", children: item.mantri }),
              /* @__PURE__ */ jsxs(TableCell, { children: [
                " ",
                /* @__PURE__ */ jsx(StatusPinjaman, { value: item.status })
              ] })
            ] })) : /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { children: "Menunggu data . . ." }) }) })
          ] }) }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex-[2] relative", children: [
          customerData.lunas == true ? /* @__PURE__ */ jsx(NoEditOverlay, { value: "Pinjaman Sudah Lunas" }) : !isCreator && /* @__PURE__ */ jsx(NoEditOverlay, { value: "User Tidak Dapat Digunakan Untuk Mengedit" }),
          /* @__PURE__ */ jsx(
            BayarAngsuran,
            {
              triggeredId: customerData.id,
              triggeredPinjaman: customerData,
              instalment
            }
          ),
          /* @__PURE__ */ jsx(JenisNasabah, { loan: customerData }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-3 p-3", children: [
            /* @__PURE__ */ jsx("div", { className: "font-semibold", children: "Hapus Pinjaman" }),
            /* @__PURE__ */ jsx(DeleteLoan, { id: customerData.id, onClosed: modalIsClosed })
          ] })
        ] })
      ] })
    ] })
  ] }) });
};
const PinjamanWebTable = ({ customerData }) => {
  return /* @__PURE__ */ jsxs(Table, { children: [
    /* @__PURE__ */ jsx(TableHeader, { className: "bg-gray-200", children: /* @__PURE__ */ jsxs(TableRow, { children: [
      /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Nomor" }),
      /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Nasabah" }),
      /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "NIK" }),
      /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Alamat" }),
      /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Unit" }),
      /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Kelompok" }),
      /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Hari" }),
      /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Tanggal Drop" }),
      /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Pinjaman" }),
      /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Nama Mantri" }),
      /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Status" }),
      /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Ket" }),
      /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Lunas" })
    ] }) }),
    /* @__PURE__ */ jsx(TableBody, { children: Object.keys(customerData).length !== 0 ? /* @__PURE__ */ jsxs(TableRow, { className: "text-center", children: [
      /* @__PURE__ */ jsx(TableCell, { children: customerData.id }),
      /* @__PURE__ */ jsx(TableCell, { children: customerData.nama }),
      /* @__PURE__ */ jsx(TableCell, { children: customerData.nik }),
      /* @__PURE__ */ jsx(TableCell, { children: customerData.alamat }),
      /* @__PURE__ */ jsx(TableCell, { children: customerData.branch }),
      /* @__PURE__ */ jsx(TableCell, { children: customerData.kelompok }),
      /* @__PURE__ */ jsx(TableCell, { children: customerData.hari }),
      /* @__PURE__ */ jsx(TableCell, { children: dayjs(customerData.tanggal_drop).format("DD-MM-YYYY") }),
      /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(FormatNumbering, { value: customerData.pinjaman }) }),
      /* @__PURE__ */ jsx(TableCell, { children: customerData.mantri }),
      /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(StatusPinjaman, { value: customerData.status_pinjaman }) }),
      /* @__PURE__ */ jsx(TableCell, { children: customerData.notes }),
      /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(StatusPinjaman, { value: customerData.lunas ? "Lunas" : "Belum" }) })
    ] }) : /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { children: "Menunggu data . . ." }) }) })
  ] });
};
const MobileCardList = ({ customerData }) => {
  const sooners = (value) => {
    toast("Nik Telah Dicopy");
    navigator.clipboard.writeText(value);
  };
  if (!customerData || customerData.length === 0) {
    return /* @__PURE__ */ jsx("p", { className: "text-center text-muted", children: "Data tidak tersedia." });
  }
  return /* @__PURE__ */ jsx("div", { className: "w-full max-w-md overflow-hidden text-xs bg-white rounded-lg shadow-lg", children: /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "pb-4 border-b", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-center text-red-500", children: customerData.nama }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-3", children: [
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-500", children: [
          "NIK: ",
          customerData.nik
        ] }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "text-blue-500",
            onClick: () => sooners(customerData.nik),
            children: /* @__PURE__ */ jsx(Copy, { className: "h-4" })
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "text-center", children: customerData.alamat })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-600", children: "Nomor:" }),
        /* @__PURE__ */ jsx("span", { className: "text-gray-800", children: customerData.id })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-600", children: "Status:" }),
        /* @__PURE__ */ jsx(BadgeStatus, { value: customerData.status_pinjaman })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-600", children: "Unit:" }),
        /* @__PURE__ */ jsx("span", { className: "text-gray-800", children: customerData.branch })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-600", children: "Kelompok:" }),
        /* @__PURE__ */ jsx("span", { className: "text-gray-800", children: customerData.kelompok })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-600", children: "Tanggal Drop:" }),
        /* @__PURE__ */ jsxs("span", { className: "text-gray-800", children: [
          customerData.hari,
          ", ",
          dayjs(customerData.tanggal_drop).format("DD-MM-YYYY")
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-600", children: "Pinjaman:" }),
        /* @__PURE__ */ jsx(
          "span",
          {
            className: `font-bold ${customerData.acc === "Ya" ? "text-green-600" : "text-red-600"}`,
            children: /* @__PURE__ */ jsx(
              FormatNumbering,
              {
                className: "text-center",
                value: customerData.pinjaman
              }
            )
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-600", children: "Mantri:" }),
        /* @__PURE__ */ jsx("span", { className: "text-gray-800", children: customerData.mantri })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-600", children: "Ket:" }),
        /* @__PURE__ */ jsx("span", { className: "text-gray-800", children: customerData.notes })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-600", children: "LUNAS:" }),
        /* @__PURE__ */ jsx(StatusPinjaman, { value: customerData.lunas ? "Lunas" : "Belum" })
      ] })
    ] })
  ] }) });
};
export {
  Action as default
};
