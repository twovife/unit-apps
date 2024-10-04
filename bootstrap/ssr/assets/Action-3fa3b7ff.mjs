import { a as jsx, j as jsxs } from "../ssr.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-1c7227a2.mjs";
import { useState, useEffect } from "react";
import { C as Card, a as CardHeader, b as CardTitle, d as CardContent } from "./card-1314102b.mjs";
import axios from "axios";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell, F as FormatNumbering } from "./FormatNumbering-02c28a29.mjs";
import dayjs from "dayjs";
import { S as StatusPinjaman } from "./StatusPinjaman-fa220d17.mjs";
import BayarAngsuran from "./BayarAngsuran-e454698f.mjs";
import JenisNasabah from "./JenisNasabah-5b778c2b.mjs";
import DeleteAngsuran from "./DeleteAngsuran-92011ff6.mjs";
import DeleteLoan from "./DeleteLoan-3a480ddc.mjs";
import { usePage } from "@inertiajs/react";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "@radix-ui/react-dialog";
import "@radix-ui/react-icons";
import "./utils-e5930d84.mjs";
import "clsx";
import "tailwind-merge";
import "react-number-format";
import "./badge-3e44e85b.mjs";
import "class-variance-authority";
import "./label-143f493c.mjs";
import "@radix-ui/react-label";
import "./input-7eb6bb1b.mjs";
import "react-currency-input-field";
import "./Checkbox-d7000d9c.mjs";
import "./button-5b8f0147.mjs";
import "@radix-ui/react-slot";
import "./Loading-306ada45.mjs";
import "react-dom";
import "@headlessui/react";
import "./InputError-3b072368.mjs";
import "./InputLabel-20ddd95c.mjs";
import "./PrimaryButton-e2c4c1f4.mjs";
import "./SelectList-8beaa241.mjs";
import "./TextInput-11198f62.mjs";
const Action = ({ datas, show = false, onClosed, triggeredId }) => {
  const {
    server_filter: { closed_transaction }
  } = usePage().props;
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
                /* @__PURE__ */ jsx(TableCell, { children: (!closed_transaction || closed_transaction < item.transaction_date) && /* @__PURE__ */ jsx(DeleteAngsuran, { id: item.id }) }),
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
                triggeredPinjaman: customerData.pinjaman,
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
