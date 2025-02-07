import { a as jsx, j as jsxs } from "../ssr.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-e17b5153.mjs";
import { useState, useEffect } from "react";
import { C as Card, a as CardHeader, b as CardTitle, d as CardContent } from "./card-a7cc8935.mjs";
import axios from "axios";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-8d30c177.mjs";
import dayjs from "dayjs";
import { F as FormatNumbering } from "./FormatNumbering-47cfa339.mjs";
import { S as StatusPinjaman } from "./StatusPinjaman-b6a160c0.mjs";
import BayarAngsuran from "./BayarAngsuran-55c0636e.mjs";
import JenisNasabah from "./JenisNasabah-ee724a10.mjs";
import DeleteAngsuran from "./DeleteAngsuran-bde03131.mjs";
import "./TextInput-11198f62.mjs";
import { usePage } from "@inertiajs/react";
import "./button-bf6cf732.mjs";
import "./Loading-95bc2f77.mjs";
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
import "./badge-ad1cae46.mjs";
import "class-variance-authority";
import "./label-7289427a.mjs";
import "@radix-ui/react-label";
import "./input-a726a844.mjs";
import "react-currency-input-field";
import "./Checkbox-d7000d9c.mjs";
import "./InputError-3b072368.mjs";
import "./InputLabel-20ddd95c.mjs";
import "./PrimaryButton-e2c4c1f4.mjs";
import "./SelectList-8beaa241.mjs";
import "@radix-ui/react-slot";
import "react-dom";
import "@headlessui/react";
const xAction = ({ datas, show = false, onClosed, triggeredId }) => {
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
  const revisiAngsuranLink = `https://api.whatsapp.com/send?phone=6281233302284&text=saya%20dari%20%3A%20(%20ganti%20nama%20dan%20dari%20kantor%20mana%20)%0Aminta%20tolong%20untuk%20revisi%20data%20dengan%20nomor%20${triggeredId ?? null}.%0A(%20jangan%20hapus%20nomor%2C%20sebutkan%20revisi%20setelah%20nomor%20)`;
  return /* @__PURE__ */ jsx(Dialog, { open: show, onOpenChange: (open) => open ? "" : modalIsClosed(), children: /* @__PURE__ */ jsxs(DialogContent, { className: `w-[97vw] p-1 lg:p-6`, children: [
    /* @__PURE__ */ jsx(DialogHeader, { className: "max-h-10", children: /* @__PURE__ */ jsx(DialogTitle, { className: "p-2", children: "Isi Angsuransxx" }) }),
    /* @__PURE__ */ jsxs("div", { className: " h-[90vh] overflow-auto lg:scrollbar-thin scrollbar-none", children: [
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
            /* @__PURE__ */ jsx(TableCell, { children: dayjs(customerData.tanggal_drop).format(
              "DD-MM-YYYY"
            ) }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(FormatNumbering, { value: customerData.pinjaman }) }),
            /* @__PURE__ */ jsx(TableCell, { children: customerData.mantri }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(
              StatusPinjaman,
              {
                value: customerData.status_pinjaman
              }
            ) }),
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
          /* @__PURE__ */ jsxs("div", { className: "mt-3 text-red-400 text-tinny text-end", children: [
            "JIKA TERJADI KESALAHAN TERHADAP ANGSURAN INI, BISA LAPORKAN MELALUI TOMBOL DIBAWAH",
            /* @__PURE__ */ jsx("br", {}),
            /* @__PURE__ */ jsx(
              "a",
              {
                href: revisiAngsuranLink,
                target: "_blank",
                className: "text-blue-500 underline",
                children: "Laporkan"
              }
            )
          ] })
        ] })
      ] })
    ] })
  ] }) });
};
export {
  xAction as default
};
