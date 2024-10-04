import { a as jsx, F as Fragment, j as jsxs } from "../ssr.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-1c7227a2.mjs";
import { useState, useEffect } from "react";
import { C as Card, a as CardHeader, b as CardTitle, d as CardContent } from "./card-1314102b.mjs";
import "./tabs-f70be525.mjs";
import axios from "axios";
import "./FormatNumbering-02c28a29.mjs";
import "./button-5b8f0147.mjs";
import "dayjs";
import Acc from "./Acc-b198099e.mjs";
import "./Loading-306ada45.mjs";
import { usePage } from "@inertiajs/react";
import DropJadi from "./DropJadi-f2602fac.mjs";
import Gagal from "./Gagal-ff4d95fe.mjs";
import DetailTableOnAction from "./DetailTableOnAction-ce80c62c.mjs";
import RemoveLoan from "./RemoveLoan-6d4e21d7.mjs";
import ReStatus from "./ReStatus-49da2205.mjs";
import ChangeDetail from "./ChangeDetail-b4731033.mjs";
import { B as Badge } from "./badge-3e44e85b.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "@radix-ui/react-dialog";
import "@radix-ui/react-icons";
import "./utils-e5930d84.mjs";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-tabs";
import "react-number-format";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./label-143f493c.mjs";
import "@radix-ui/react-label";
import "react-currency-input-field";
import "react-dom";
import "@headlessui/react";
import "./SelectList-8beaa241.mjs";
import "./input-7eb6bb1b.mjs";
const Action = ({ show = false, onClosed, triggeredData }) => {
  const { auth } = usePage().props;
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
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(Dialog, { open: show, onOpenChange: (open) => open ? "" : onClosed(), children: /* @__PURE__ */ jsxs(DialogContent, { className: "w-[90vw] h-[90vh] lg:h-auto overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin p-2", children: [
    erorAxios && /* @__PURE__ */ jsx("div", { children: "terjadi kesalahan saat memuat data" }),
    loading ? /* @__PURE__ */ jsx("div", { children: "Data Sedang Dimuat" }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Check Transaksi Mantri" }) }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Detail Pengajuan" }) }),
        /* @__PURE__ */ jsx(CardContent, { className: "p-1 space-y-2", children: /* @__PURE__ */ jsx("div", { className: "overflow-auto border rounded-lg scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin", children: /* @__PURE__ */ jsx(DetailTableOnAction, { datas: data }) }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 mt-3 lg:flex-row", children: [
        /* @__PURE__ */ jsxs(Card, { className: "w-full", children: [
          /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "ACC / DROP" }) }),
          /* @__PURE__ */ jsxs(CardContent, { className: "space-y-2", children: [
            (data == null ? void 0 : data.status) == "open" && auth.permissions.includes("can update") && /* @__PURE__ */ jsx("div", { className: "flex items-end justify-center gap-2 mx-auto mb-3", children: /* @__PURE__ */ jsx(
              Acc,
              {
                id: data == null ? void 0 : data.nomor_pengajuan,
                acc: data == null ? void 0 : data.request,
                onClosed
              }
            ) }),
            (data == null ? void 0 : data.status) !== "open" && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsxs(Badge, { size: "lg", variant: "green", children: [
                "Status Pengajuan = ",
                data == null ? void 0 : data.status,
                ", Pada Tanggal",
                data == null ? void 0 : data.check_date
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-end justify-center gap-2 mx-auto", children: [
                (data == null ? void 0 : data.status) === "acc" && /* @__PURE__ */ jsxs(Fragment, { children: [
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
                ] }),
                (data == null ? void 0 : data.status) === "success" || (data == null ? void 0 : data.status) === "gagal" && /* @__PURE__ */ jsxs(Badge, { size: "lg", variant: "green", children: [
                  "Status Pengajuan = ",
                  data == null ? void 0 : data.status,
                  ", Tanggal",
                  " ",
                  data == null ? void 0 : data.check_date
                ] })
              ] })
            ] })
          ] })
        ] }),
        auth.permissions.includes("can update") && /* @__PURE__ */ jsxs(Card, { className: "w-full", children: [
          /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Admin Edit" }) }),
          /* @__PURE__ */ jsx(CardContent, { className: "space-y-2", children: /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "w-full mb-3 text-start", children: [
              /* @__PURE__ */ jsx("p", { className: "font-semibold", children: "Hapus Pengajuan" }),
              /* @__PURE__ */ jsx("p", { className: "mb-1 text-xs italic font-light text-gray-500", children: "Jika Pengajuan Sudah Memiliki Angsuran maka akan terhapus semua" }),
              /* @__PURE__ */ jsx(
                RemoveLoan,
                {
                  triggeredId: data == null ? void 0 : data.nomor_pengajuan,
                  onClosed
                }
              )
            ] }),
            (data == null ? void 0 : data.drop_langsung) == "lama" && /* @__PURE__ */ jsxs("div", { className: "w-full mb-3 text-start", children: [
              /* @__PURE__ */ jsx("p", { className: "font-semibold ", children: "Restatus" }),
              /* @__PURE__ */ jsx("p", { className: "mb-1 text-xs italic font-light text-gray-500", children: "Jika Pengajuan Sudah Memiliki Angsuran maka akan terhapus semua" }),
              /* @__PURE__ */ jsx(
                ReStatus,
                {
                  triggeredId: data == null ? void 0 : data.nomor_pengajuan,
                  onClosed
                }
              )
            ] }),
            data && /* @__PURE__ */ jsx(
              ChangeDetail,
              {
                onClosed,
                triggeredData
              }
            )
          ] }) })
        ] })
      ] })
    ] })
  ] }) }) });
};
export {
  Action as default
};
