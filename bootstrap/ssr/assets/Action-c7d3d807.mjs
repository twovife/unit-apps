import { a as jsx, j as jsxs } from "../ssr.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-e17b5153.mjs";
import { useState, useEffect } from "react";
import { C as Card, a as CardHeader, b as CardTitle, d as CardContent } from "./card-a7cc8935.mjs";
import axios from "axios";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell, F as FormatNumbering } from "./FormatNumbering-9786ffbe.mjs";
import dayjs from "dayjs";
import { B as Badge } from "./badge-ad1cae46.mjs";
import BayarAngsuran from "./BayarAngsuran-55c0636e.mjs";
import JenisNasabah from "./JenisNasabah-ee724a10.mjs";
import DeleteAngsuran from "./DeleteAngsuran-bde03131.mjs";
import DeleteLoan from "./DeleteLoan-128b8268.mjs";
import { usePage } from "@inertiajs/react";
import { u as useFrontEndPermission } from "./useFrontEndPermission-59a7cda0.mjs";
import { N as NoEditOverlay } from "./NoEditOverlay-fb1d5d5c.mjs";
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
import "./input-a726a844.mjs";
import "react-currency-input-field";
import "./Checkbox-d7000d9c.mjs";
import "./button-bf6cf732.mjs";
import "@radix-ui/react-slot";
import "./Loading-95bc2f77.mjs";
import "react-dom";
import "@headlessui/react";
import "./InputError-3b072368.mjs";
import "./InputLabel-20ddd95c.mjs";
import "./PrimaryButton-e2c4c1f4.mjs";
import "./SelectList-8beaa241.mjs";
import "./TextInput-11198f62.mjs";
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
  return /* @__PURE__ */ jsx(Dialog, { open: show, onOpenChange: (open) => open ? "" : modalIsClosed(), children: /* @__PURE__ */ jsxs(
    DialogContent,
    {
      className: `w-[90vw] h-[90vh] overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin p-1 lg:p-6`,
      children: [
        /* @__PURE__ */ jsx(DialogHeader, { className: "max-h-10", children: /* @__PURE__ */ jsx(DialogTitle, { className: "p-2", children: "Isi Angsuran" }) }),
        /* @__PURE__ */ jsxs(Card, { className: "w-full", children: [
          /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Rincian Pinjaman" }) }),
          /* @__PURE__ */ jsx(CardContent, { className: "p-1 lg:p-5", children: /* @__PURE__ */ jsx("div", { className: "w-full overflow-auto", children: /* @__PURE__ */ jsxs(Table, { children: [
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
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(
                StatusPinjaman,
                {
                  value: customerData.lunas ? "Lunas" : "Belum"
                }
              ) })
            ] }) : /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { children: "Menunggu data . . ." }) }) })
          ] }) }) })
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
                /* @__PURE__ */ jsx(TableHead, { className: "hidden text-center lg:table-cell", children: "Dana Titipan" }),
                /* @__PURE__ */ jsx(TableHead, { className: "hidden text-center lg:table-cell", children: "Mantri" }),
                /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Status" })
              ] }) }),
              /* @__PURE__ */ jsx(TableBody, { children: Object.keys(customerData).length !== 0 ? instalment.map((item) => /* @__PURE__ */ jsxs(TableRow, { className: "text-center", children: [
                /* @__PURE__ */ jsx(TableCell, { children: (!closed_transaction || closed_transaction <= item.transaction_date) && /* @__PURE__ */ jsx(DeleteAngsuran, { id: item.id }) }),
                /* @__PURE__ */ jsx(TableCell, { className: "whitespace-nowrap", children: dayjs(item.transaction_date).format("DD-MM-YY") }),
                /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(FormatNumbering, { value: item.nominal }) }),
                /* @__PURE__ */ jsx(TableCell, { children: item.saldo }),
                /* @__PURE__ */ jsx(TableCell, { className: "hidden lg:block", children: item.danatitipan == "true" ? "Yes" : "" }),
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
      ]
    }
  ) });
};
export {
  Action as default
};
