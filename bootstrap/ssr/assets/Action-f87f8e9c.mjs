import { a as jsx, j as jsxs } from "../ssr.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-e17b5153.mjs";
import { useState, useEffect } from "react";
import { C as Card, a as CardHeader, b as CardTitle, d as CardContent } from "./card-c2e72800.mjs";
import axios from "axios";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-c01c1748.mjs";
import dayjs from "dayjs";
import { F as FormatNumbering } from "./FormatNumbering-4e9be903.mjs";
import { B as Badge } from "./badge-985735af.mjs";
import BayarAngsuran from "./BayarAngsuran-a92717ae.mjs";
import JenisNasabah from "./JenisNasabah-80bf75ad.mjs";
import DeleteAngsuran from "./DeleteAngsuran-be0bed71.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react";
import "@inertiajs/react/server";
import "@radix-ui/react-dialog";
import "@radix-ui/react-icons";
import "./utils-efa289ef.mjs";
import "clsx";
import "tailwind-merge";
import "react-number-format";
import "class-variance-authority";
import "./label-cecd7064.mjs";
import "@radix-ui/react-label";
import "./input-a726a844.mjs";
import "react-currency-input-field";
import "./Checkbox-d7000d9c.mjs";
import "./button-6facd6da.mjs";
import "@radix-ui/react-slot";
import "./Loading-649771fa.mjs";
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
  const [loading, setLoading] = useState(false);
  const [erorAxios, setErorAxios] = useState(false);
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
      className: `w-[90vw] h-[90vh] overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin`,
      children: [
        /* @__PURE__ */ jsx(DialogHeader, { className: "max-h-10", children: /* @__PURE__ */ jsx(DialogTitle, { children: "Isi Angsuran" }) }),
        /* @__PURE__ */ jsxs(Card, { className: "w-full", children: [
          /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Rincian Pinjaman" }) }),
          /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs(Table, { children: [
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
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col w-full gap-3 mt-3 lg:flex-row", children: [
          /* @__PURE__ */ jsxs(Card, { className: "flex-[5]", children: [
            /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Rincian Pinjaman" }) }),
            /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs(Table, { children: [
              /* @__PURE__ */ jsx(TableHeader, { className: "bg-gray-200", children: /* @__PURE__ */ jsxs(TableRow, { children: [
                /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Action" }),
                /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Tanggal Pembayaran" }),
                /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Jumlah" }),
                /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Saldo" }),
                /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Dana Titipan" }),
                /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Mantri" }),
                /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Status" })
              ] }) }),
              /* @__PURE__ */ jsx(TableBody, { children: Object.keys(customerData).length !== 0 ? instalment.map((item) => /* @__PURE__ */ jsxs(TableRow, { className: "text-center", children: [
                /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(DeleteAngsuran, { id: item.id }) }),
                /* @__PURE__ */ jsx(TableCell, { children: dayjs(item.transaction_date).format("DD-MM-YYYY") }),
                /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(FormatNumbering, { value: item.nominal }) }),
                /* @__PURE__ */ jsx(TableCell, { children: item.saldo }),
                /* @__PURE__ */ jsx(TableCell, { children: item.danatitipan == "true" ? "Yes" : "" }),
                /* @__PURE__ */ jsx(TableCell, { children: item.mantri }),
                /* @__PURE__ */ jsxs(TableCell, { children: [
                  " ",
                  /* @__PURE__ */ jsx(StatusPinjaman, { value: item.status })
                ] })
              ] })) : /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { children: "Menunggu data . . ." }) }) })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex-[2]", children: [
            /* @__PURE__ */ jsx(
              BayarAngsuran,
              {
                triggeredId: customerData.id,
                triggeredPinjaman: customerData.pinjaman
              }
            ),
            /* @__PURE__ */ jsx(JenisNasabah, { loan: customerData })
          ] })
        ] })
      ]
    }
  ) });
};
export {
  Action as default
};
