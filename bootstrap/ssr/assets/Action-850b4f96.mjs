import { a as jsx, j as jsxs, F as Fragment } from "../ssr.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription } from "./dialog-e17b5153.mjs";
import * as React from "react";
import { useState, useEffect } from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { c as cn } from "./utils-efa289ef.mjs";
import { C as Card, a as CardHeader, b as CardTitle, d as CardContent, c as CardDescription } from "./card-c2e72800.mjs";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-c148af71.mjs";
import axios from "axios";
import RiwayatPengajuan from "./RiwayatPengajuan-d722b43c.mjs";
import Acc from "./Acc-843d6f90.mjs";
import ActionTable from "./ActionTable-1ff78795.mjs";
import RemoveLoan from "./RemoveLoan-5406e98a.mjs";
import "./Loading-95bc2f77.mjs";
import "./button-bf6cf732.mjs";
import "./label-7289427a.mjs";
import { usePage } from "@inertiajs/react";
import ChangeDetail from "./ChangeDetail-030b8497.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "@radix-ui/react-dialog";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-tabs";
import "./FormatNumbering-23811b25.mjs";
import "react-number-format";
import "@tanstack/react-table";
import "dayjs";
import "./BadgeStatus-34895a82.mjs";
import "./badge-ad1cae46.mjs";
import "class-variance-authority";
import "react-currency-input-field";
import "react-dom";
import "@headlessui/react";
import "@radix-ui/react-slot";
import "@radix-ui/react-label";
import "./input-a726a844.mjs";
const Accordion = AccordionPrimitive.Root;
const AccordionItem = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(AccordionPrimitive.Item, { ref, className: cn("border-b", className), ...props }));
AccordionItem.displayName = "AccordionItem";
const AccordionTrigger = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsx(AccordionPrimitive.Header, { className: "flex", children: /* @__PURE__ */ jsxs(
  AccordionPrimitive.Trigger,
  {
    ref,
    className: cn(
      "flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(
        ChevronDownIcon,
        {
          className: "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200"
        }
      )
    ]
  }
) }));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;
const AccordionContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsx(
  AccordionPrimitive.Content,
  {
    ref,
    className: "overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
    ...props,
    children: /* @__PURE__ */ jsx("div", { className: cn("pb-4 pt-0", className), children })
  }
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;
const Action = ({ show = false, onClosed, triggeredData }) => {
  const {
    server_filter: { closed_transaction },
    auth
  } = usePage().props;
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
      if (data2.data) {
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
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(Dialog, { open: show, onOpenChange: (open) => open ? "" : onClosed(), children: /* @__PURE__ */ jsxs(DialogContent, { className: "w-[90vw] h-[90vh] lg:h-auto overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin", children: [
    erorAxios && /* @__PURE__ */ jsx("div", { children: "terjadi kesalahan saat memuat data" }),
    loading ? /* @__PURE__ */ jsx("div", { children: "Data Sedang Dimuat" }) : /* @__PURE__ */ jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsx(DialogTitle, { children: "Check Transaksi Mantri" }),
      /* @__PURE__ */ jsx(DialogDescription, { children: /* @__PURE__ */ jsxs(Tabs, { defaultValue: "account", className: "w-full", children: [
        /* @__PURE__ */ jsxs(TabsList, { className: "grid w-full grid-cols-2", children: [
          /* @__PURE__ */ jsx(TabsTrigger, { value: "account", children: "Action" }),
          /* @__PURE__ */ jsx(TabsTrigger, { value: "history", children: "Riwayat" })
        ] }),
        /* @__PURE__ */ jsxs(TabsContent, { value: "account", children: [
          /* @__PURE__ */ jsxs(Card, { children: [
            /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Detail Pengajuan" }) }),
            /* @__PURE__ */ jsx(CardContent, { className: "space-y-2", children: /* @__PURE__ */ jsx("div", { className: "overflow-auto border rounded-lg scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin", children: /* @__PURE__ */ jsx(ActionTable, { datas: data }) }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 mt-3 lg:flex-row", children: [
            /* @__PURE__ */ jsxs("div", { className: "w-full", children: [
              /* @__PURE__ */ jsxs(Card, { className: "mb-3", children: [
                /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "ACC / DROP" }) }),
                /* @__PURE__ */ jsx(CardContent, { className: "space-y-2", children: /* @__PURE__ */ jsx("div", { className: "flex items-end justify-center gap-2 mx-auto mb-3", children: /* @__PURE__ */ jsx(
                  Acc,
                  {
                    id: data == null ? void 0 : data.nomor_pengajuan,
                    triggeredData: data,
                    onClosed
                  }
                ) }) })
              ] }),
              auth.permissions.includes("can update") && /* @__PURE__ */ jsxs(Card, { children: [
                /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Admin Edit" }) }),
                /* @__PURE__ */ jsx(CardContent, { className: "space-y-2", children: (triggeredData == null ? void 0 : triggeredData.tanggal_drop) <= closed_transaction ? /* @__PURE__ */ jsx("div", { children: "Data Sudah Di Approve Oleh Pimpinan, Tidak Bisa Diubah, Hubungi IT untuk mengubah" }) : /* @__PURE__ */ jsx("div", { children: data && /* @__PURE__ */ jsx(
                  ChangeDetail,
                  {
                    onClosed,
                    triggeredData
                  }
                ) }) })
              ] })
            ] }),
            /* @__PURE__ */ jsxs(Card, { className: "w-full", children: [
              /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Remove Loan" }) }),
              /* @__PURE__ */ jsxs(CardContent, { className: "space-y-2", children: [
                /* @__PURE__ */ jsxs("div", { className: "w-full mt-6 mb-3 text-start", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-lg font-semibold text-red-500", children: "Hapus Pinjaman" }),
                  /* @__PURE__ */ jsx("p", { className: "mb-1 text-xs italic font-light text-red-500", children: "Perhatian !!!, Jika pengajuan berstatus sukses, maka pengajuan sudah masuk dalam daftar angsuran, jika tetap dihapus akan mempengaruhi data pada angsuran, dan angsuran akan ikut terhapus" }),
                  /* @__PURE__ */ jsx("div", { className: "text-right", children: /* @__PURE__ */ jsx(
                    RemoveLoan,
                    {
                      triggeredId: data == null ? void 0 : data.nomor_pengajuan,
                      onClosed
                    }
                  ) })
                ] }),
                auth.permissions.includes("can update") && /* @__PURE__ */ jsx(
                  Accordion,
                  {
                    className: "mb-3",
                    type: "single",
                    collapsible: true,
                    children: /* @__PURE__ */ jsxs(AccordionItem, { value: "item-1", children: [
                      /* @__PURE__ */ jsx(AccordionTrigger, { children: "Tambahan" }),
                      /* @__PURE__ */ jsx(AccordionContent, { children: /* @__PURE__ */ jsx("div", { className: "text-sm", children: /* @__PURE__ */ jsxs("ul", { className: "list-disc list-outside", children: [
                        /* @__PURE__ */ jsx("li", { children: "1. Jika ada kesalahan pada angsuran baru ( angsuran hari ini ) utamakan menghapus, dan buat angsuran lagi." }),
                        /* @__PURE__ */ jsx("li", { children: "2. Jika terjadi kesalahan Status * Tanggal, usahakan untuk ganti tanggal ( tanggal drop / tanggal request ) dan dan reset status setelah itu" }),
                        /* @__PURE__ */ jsx("li", { children: "3. Setelah mengganti Detail pada angsuran, dimohon untuk cek ulang, storting & dan transaksi lagi, dikarenakan perubahan pada detail, akan mempengaruhi laporan lainnya" }),
                        /* @__PURE__ */ jsx("li", { className: "text-red-500", children: "4. Reset Status Hanya Tersedia jika pinjaman adalah drop lama / pengajuan" })
                      ] }) }) })
                    ] })
                  }
                )
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx(TabsContent, { value: "history", children: /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsx(CardTitle, { children: "Riwayat Pengajuan" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Riwayat Pengajuan Nasabah dilihat berdasarkan NIK yang tertera dari semua cabang" })
          ] }),
          /* @__PURE__ */ jsx(CardContent, { className: "space-y-2", children: /* @__PURE__ */ jsx("div", { className: "h-[50vh] border rounded-lg overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin", children: /* @__PURE__ */ jsx(
            RiwayatPengajuan,
            {
              data: customerData.history_branch
            }
          ) }) })
        ] }) })
      ] }) })
    ] })
  ] }) }) });
};
export {
  Action as default
};
