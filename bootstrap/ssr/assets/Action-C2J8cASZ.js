import { jsx, Fragment, jsxs } from "react/jsx-runtime";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription } from "./dialog-DqsN44pN.js";
import { useState, useEffect } from "react";
import { A as Accordion, a as AccordionItem, b as AccordionTrigger, c as AccordionContent } from "./accordion-Bo7Hup67.js";
import { C as Card, a as CardHeader, b as CardTitle, d as CardContent } from "./card-DK9akThy.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-DpwcYzou.js";
import axios from "axios";
import RiwayatPengajuan from "./RiwayatPengajuan-C1LEAz5f.js";
import Acc from "./Acc-Da2yqG-0.js";
import ActionTable from "./ActionTable-DgcU1sbJ.js";
import StatusPengajuan from "./StatusPengajuan-BBMso_U9.js";
import RemoveLoan from "./RemoveLoan-EwLhVElw.js";
import "./Loading-DPcVnbEk.js";
import "react-dom";
import "./button-StO46bLt.js";
import "./label-e-KMhPKP.js";
import "@inertiajs/react";
import ChangeDetail from "./ChangeDetail-CbB0pkrV.js";
import "@radix-ui/react-dialog";
import "lucide-react";
import "./utils-H80jjgLf.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-accordion";
import "@radix-ui/react-icons";
import "@radix-ui/react-tabs";
import "./table-DgsbovDN.js";
import "@tanstack/react-table";
import "dayjs";
import "./BadgeStatus-BDnUSm56.js";
import "./badge-BDQK5pqs.js";
import "class-variance-authority";
import "./statusVariants-kLBpdvOH.js";
import "@radix-ui/react-slot";
import "react-currency-input-field";
import "./FormatNumbering-CTESXtjE.js";
import "react-number-format";
import "@headlessui/react";
import "@radix-ui/react-label";
import "./input-BH-oxdzi.js";
const Action = ({ show = false, onClosed, triggeredData }) => {
  const [data, setData] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [acc, setAcc] = useState();
  const [loading, setLoading] = useState(false);
  const [erorAxios, setErorAxios] = useState(false);
  useEffect(() => {
    setData(triggeredData);
    setAcc(triggeredData == null ? void 0 : triggeredData.request);
  }, [triggeredData]);
  const onNikSubmit = async (signal) => {
    var _a, _b;
    setLoading(true);
    setErorAxios();
    try {
      const { data: data2 } = await axios.post(
        route("transaction.nasabah_buku_transaksi"),
        { nik: triggeredData.nik },
        { signal }
        // 👈 inject signal buat cancel
      );
      setCustomerData(data2.data ?? []);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request dibatalkan");
      } else {
        setErorAxios(((_b = (_a = error.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || "Terjadi kesalahan");
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!(triggeredData == null ? void 0 : triggeredData.nik)) return;
    const controller = new AbortController();
    onNikSubmit(controller.signal);
    return () => {
      controller.abort();
    };
  }, [triggeredData]);
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(Dialog, { open: show, onOpenChange: (open) => open ? "" : onClosed(), children: /* @__PURE__ */ jsxs(DialogContent, { className: "flex w-[96vw] max-w-3xl flex-col gap-0 p-0 max-h-[90svh]", children: [
    /* @__PURE__ */ jsxs(DialogHeader, { className: "px-4 py-3 text-left border-b shrink-0", children: [
      /* @__PURE__ */ jsx(DialogTitle, { className: "pr-8 text-base", children: "Detail Pengajuan" }),
      /* @__PURE__ */ jsxs(DialogDescription, { className: "text-xs", children: [
        (data == null ? void 0 : data.nama) ? `${data.nama} · ` : "",
        "Kelompok ",
        (data == null ? void 0 : data.kelompok) ?? "-",
        " · ",
        (data == null ? void 0 : data.unit) ?? "-"
      ] })
    ] }),
    erorAxios && /* @__PURE__ */ jsx("div", { className: "px-4 py-2 text-xs border-b text-destructive bg-destructive/10 shrink-0", children: erorAxios }),
    /* @__PURE__ */ jsxs(
      Tabs,
      {
        defaultValue: "account",
        className: "flex flex-col flex-1 min-h-0 gap-0",
        children: [
          /* @__PURE__ */ jsxs(TabsList, { className: "grid w-full h-auto grid-cols-4 rounded-none shrink-0", children: [
            /* @__PURE__ */ jsx(TabsTrigger, { className: "text-[11px]", value: "account", children: "Action" }),
            /* @__PURE__ */ jsx(
              TabsTrigger,
              {
                className: "text-[11px]",
                disabled: loading,
                value: "history",
                children: loading ? "..." : "Crash Kantor"
              }
            ),
            /* @__PURE__ */ jsx(
              TabsTrigger,
              {
                className: "text-[11px]",
                disabled: loading,
                value: "crashubmml",
                children: loading ? "..." : "Crash (NT)"
              }
            ),
            /* @__PURE__ */ jsx(
              TabsTrigger,
              {
                className: "text-[11px]",
                disabled: loading,
                value: "crashubm",
                children: loading ? "..." : "Crash (T)"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs(
            TabsContent,
            {
              value: "account",
              className: "flex-1 min-h-0 px-4 py-3 mt-0 overflow-y-auto",
              children: [
                /* @__PURE__ */ jsxs(Card, { className: "relative mb-3", children: [
                  /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "ACC / Drop Jadi" }) }),
                  /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx(
                    Acc,
                    {
                      id: data == null ? void 0 : data.nomor_pengajuan,
                      triggeredData: data,
                      onClosed
                    }
                  ) })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "mb-3 overflow-hidden border rounded-lg", children: /* @__PURE__ */ jsx(ActionTable, { datas: data }) }),
                /* @__PURE__ */ jsxs(Card, { className: "relative mb-3", children: [
                  /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Riwayat" }) }),
                  /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx(StatusPengajuan, { data }) })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 lg:flex-row", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-full", children: /* @__PURE__ */ jsxs(Card, { className: "relative mb-3", children: [
                    /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Admin Edit" }) }),
                    /* @__PURE__ */ jsx(CardContent, { className: "space-y-2", children: /* @__PURE__ */ jsx("div", { children: data && /* @__PURE__ */ jsx(
                      ChangeDetail,
                      {
                        onClosed,
                        triggeredData
                      }
                    ) }) })
                  ] }) }),
                  /* @__PURE__ */ jsxs(Card, { className: "relative w-full", children: [
                    /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Remove Loan" }) }),
                    /* @__PURE__ */ jsxs(CardContent, { className: "space-y-2", children: [
                      /* @__PURE__ */ jsxs("div", { className: "w-full mb-3 text-start", children: [
                        /* @__PURE__ */ jsx("p", { className: "text-lg font-semibold text-red-500", children: "Hapus Pinjaman" }),
                        /* @__PURE__ */ jsxs("p", { className: "mb-1 text-xs italic font-light text-red-500", children: [
                          "Perhatian !!!, Jika pengajuan berstatus sukses, maka pengajuan sudah masuk dalam daftar angsuran, jika tetap dihapus akan mempengaruhi data pada angsuran, dan angsuran akan ikut terhapus.",
                          /* @__PURE__ */ jsx("br", {}),
                          " ( Penghapusan hanya bisa dilakukan 2hari dari tanggal drop (Mantri) dan 2bulan (Admin & Kepala))"
                        ] }),
                        /* @__PURE__ */ jsx("div", { className: "text-right", children: /* @__PURE__ */ jsx(
                          RemoveLoan,
                          {
                            triggeredId: data == null ? void 0 : data.nomor_pengajuan,
                            triggeredData: data,
                            onClosed
                          }
                        ) })
                      ] }),
                      /* @__PURE__ */ jsx(Accordion, { className: "mb-3", type: "single", collapsible: true, children: /* @__PURE__ */ jsxs(AccordionItem, { value: "item-1", children: [
                        /* @__PURE__ */ jsx(AccordionTrigger, { children: "Tambahan" }),
                        /* @__PURE__ */ jsx(AccordionContent, { children: /* @__PURE__ */ jsx("div", { className: "text-sm", children: /* @__PURE__ */ jsxs("ul", { className: "list-disc list-outside", children: [
                          /* @__PURE__ */ jsx("li", { children: "1. Jika ada kesalahan pada angsuran baru ( angsuran hari ini ) utamakan menghapus, dan buat angsuran lagi." }),
                          /* @__PURE__ */ jsx("li", { children: "2. Jika terjadi kesalahan Status * Tanggal, usahakan untuk ganti tanggal ( tanggal drop / tanggal request ) dan dan reset status setelah itu" }),
                          /* @__PURE__ */ jsx("li", { children: "3. Setelah mengganti Detail pada angsuran, dimohon untuk cek ulang, storting & dan transaksi lagi, dikarenakan perubahan pada detail, akan mempengaruhi laporan lainnya" }),
                          /* @__PURE__ */ jsx("li", { className: "text-red-500", children: "4. Reset Status Hanya Tersedia jika pinjaman adalah drop lama / pengajuan" })
                        ] }) }) })
                      ] }) })
                    ] })
                  ] })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            TabsContent,
            {
              value: "history",
              className: "flex-1 min-h-0 px-4 py-3 mt-0 overflow-y-auto",
              children: [
                /* @__PURE__ */ jsx("div", { className: "mb-1 text-sm font-medium", children: "Crash Antar Kelompok Dalam 1 Kantor" }),
                /* @__PURE__ */ jsx("div", { className: "overflow-x-auto scrollbar-thin", children: /* @__PURE__ */ jsx(RiwayatPengajuan, { data: customerData.history_branch }) })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            TabsContent,
            {
              value: "crashubmml",
              className: "flex-1 min-h-0 px-4 py-3 mt-0 overflow-y-auto",
              children: [
                /* @__PURE__ */ jsx("div", { className: "mb-1 text-sm font-medium", children: "Crash Kantor Lain Dalam UBM (Macet)" }),
                /* @__PURE__ */ jsx("div", { className: "overflow-x-auto scrollbar-thin", children: /* @__PURE__ */ jsx(RiwayatPengajuan, { data: customerData.history_macet_lain }) })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            TabsContent,
            {
              value: "crashubm",
              className: "flex-1 min-h-0 px-4 py-3 mt-0 overflow-y-auto",
              children: [
                /* @__PURE__ */ jsx("div", { className: "mb-1 text-sm font-medium", children: "Crash Kantor Lain Dalam UBM (Target)" }),
                /* @__PURE__ */ jsx("div", { className: "overflow-x-auto scrollbar-thin", children: /* @__PURE__ */ jsx(RiwayatPengajuan, { data: customerData.history_target }) })
              ]
            }
          )
        ]
      }
    )
  ] }) }) });
};
export {
  Action as default
};
