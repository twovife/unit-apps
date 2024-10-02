import { j as jsxs, a as jsx } from "../ssr.mjs";
import { C as Checkbox } from "./Checkbox-d7000d9c.mjs";
import { I as InputLabel } from "./InputLabel-20ddd95c.mjs";
import { L as Loading } from "./Loading-7f1a61e6.mjs";
import { useState, useEffect } from "react";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell, F as FormatNumbering } from "./FormatNumbering-02c28a29.mjs";
import { B as Button } from "./button-5b8f0147.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-1c7227a2.mjs";
import { I as Input } from "./input-7eb6bb1b.mjs";
import { useForm } from "@inertiajs/react";
import { Label } from "@radix-ui/react-label";
import dayjs from "dayjs";
import "postcss";
import CurrencyInput from "react-currency-input-field";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "react-dom";
import "@headlessui/react";
import "./utils-e5930d84.mjs";
import "clsx";
import "tailwind-merge";
import "react-number-format";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-dialog";
import "@radix-ui/react-icons";
const Approval = ({ show = false, onClosed, triggeredData, staticData }) => {
  const { data, setData, post, reset, errors, processing } = useForm({
    id: "",
    date: "",
    masuk: "",
    keluar: "",
    target: "",
    baru: "",
    lama: "",
    storting: "",
    drop: "",
    rencana: "",
    tanggal_rencana_minggu_depan: "",
    rencana_minggu_depan: "",
    target_minggu_depan: ""
  });
  const [flaatenData, setFlaatenData] = useState();
  const [erorRequest, setErorRequest] = useState(false);
  useEffect(() => {
    const flaatenData2 = (staticData == null ? void 0 : staticData.flat(2)) ?? [];
    if (triggeredData) {
      const filteredData = flaatenData2.filter((item) => {
        return item.request_date === triggeredData.tanggal && item.tanggal_drop != item.request_date;
      });
      const uniqueDropDates = [
        ...new Set(filteredData.map((item) => item.tanggal_drop))
      ];
      const uniqueDropDatesString = uniqueDropDates.length === 1 ? uniqueDropDates[0] : uniqueDropDates.length === 0 ? setErorRequest(false) : setErorRequest(true);
      console.log(uniqueDropDatesString);
      const rencana = filteredData.reduce((a, item) => {
        return a + item.acc;
      }, 0);
      setData({
        id: triggeredData.grouping_id ?? null,
        date: triggeredData.tanggal,
        target: triggeredData.target,
        masuk: triggeredData.drop * 0.13,
        keluar: triggeredData.keluar ?? 0,
        baru: triggeredData.baru,
        lama: triggeredData.lama,
        storting: triggeredData.storting,
        drop: triggeredData.drop,
        rencana: triggeredData.rencana,
        tanggal_rencana_minggu_depan: uniqueDropDatesString ?? null,
        rencana_minggu_depan: rencana ?? 0,
        target_minggu_depan: 0
      });
      setFlaatenData(uniqueDropDatesString ?? null);
    }
  }, [triggeredData, show]);
  useEffect(() => {
    setData(
      "target_minggu_depan",
      parseInt(data.target) + (parseInt(data.masuk) - parseInt(data.keluar))
    );
  }, [data.target, data.masuk, data.keluar]);
  const [loading, setLoading] = useState(false);
  const onInputChange = (e) => {
    setData(
      e.target.name,
      e.target.type === "checkbox" ? e.target.checked : e.target.value
    );
  };
  const onHandleCurencyChange = (value, name) => {
    setData(name, value);
  };
  const closedModal = () => {
    onClosed();
    reset();
    setErorRequest(false);
  };
  const onSubmitForm = (e) => {
    e.preventDefault();
    post(route("kasir.rekap.ceklist_kepala"), {
      onSuccess: () => {
        reset();
        onClosed();
      }
    });
  };
  return /* @__PURE__ */ jsxs(Dialog, { open: show, onOpenChange: (open) => open ? "" : closedModal(), children: [
    /* @__PURE__ */ jsx(Loading, { show: loading || processing }),
    /* @__PURE__ */ jsxs(DialogContent, { className: "w-[90vw] h-[90vh] lg:h-auto lg:max-w-xl overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin", children: [
      /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Cek Transaksi" }) }),
      loading ? /* @__PURE__ */ jsx("div", { children: "Data Sedang Dimuat" }) : /* @__PURE__ */ jsxs("div", { children: [
        triggeredData && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs(Table, { className: "mb-3", children: [
            /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Total Transaksi" }),
              /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Transaksi Open" }),
              /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Transaksi Tolak" }),
              /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Transaksi Gagal" }),
              /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Transaksi Berhasil" })
            ] }) }),
            /* @__PURE__ */ jsx(TableBody, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(
                FormatNumbering,
                {
                  className: "text-center",
                  value: data.target
                }
              ) }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(
                FormatNumbering,
                {
                  className: "text-center",
                  value: triggeredData.drop
                }
              ) }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(
                FormatNumbering,
                {
                  className: "text-center",
                  value: triggeredData.storting
                }
              ) }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(
                FormatNumbering,
                {
                  className: "text-center",
                  value: triggeredData.baru
                }
              ) }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(
                FormatNumbering,
                {
                  className: "text-center",
                  value: triggeredData.baru
                }
              ) })
            ] }) })
          ] }),
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("h1", { className: "mb-1", children: "Transaksi Hari Ini" }),
          /* @__PURE__ */ jsxs(Table, { children: [
            /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Target" }),
              /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Drop" }),
              /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Storting" }),
              /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Baru" }),
              /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Lama" }),
              /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Rencana" })
            ] }) }),
            /* @__PURE__ */ jsx(TableBody, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(
                FormatNumbering,
                {
                  className: "text-center",
                  value: data.target
                }
              ) }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(
                FormatNumbering,
                {
                  className: "text-center",
                  value: triggeredData.drop
                }
              ) }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(
                FormatNumbering,
                {
                  className: "text-center",
                  value: triggeredData.storting
                }
              ) }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(
                FormatNumbering,
                {
                  className: "text-center",
                  value: triggeredData.baru
                }
              ) }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(
                FormatNumbering,
                {
                  className: "text-center",
                  value: triggeredData.lama
                }
              ) }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(
                FormatNumbering,
                {
                  className: "text-center",
                  value: triggeredData.rencana
                }
              ) })
            ] }) })
          ] })
        ] }),
        !(triggeredData == null ? void 0 : triggeredData.is_approved) && /* @__PURE__ */ jsxs("form", { onSubmit: onSubmitForm, children: [
          /* @__PURE__ */ jsxs("div", { className: "max-h-[60vh] overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin", children: [
            !(triggeredData == null ? void 0 : triggeredData.is_generated) && /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "target", children: "Target" }),
              /* @__PURE__ */ jsx(
                CurrencyInput,
                {
                  className: "flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                  name: "target",
                  readOnly: data.status_dayly_approval,
                  allowDecimals: false,
                  prefix: "Rp. ",
                  min: 1,
                  required: true,
                  onValueChange: onHandleCurencyChange,
                  value: data.target,
                  placeholder: "Inputkan angka tanpa sparator"
                }
              )
            ] }),
            /* @__PURE__ */ jsx("br", {}),
            /* @__PURE__ */ jsx("p", { className: "mb-1 italic font-thin text-gray-500", children: "Sebelum Ceklist, Diharapkan Semua Storting, Rencana, target dan drop sudah sesuai, tidak diperbolehkan ada transaksi yang masih Open" }),
            /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "masuk", children: "Masuk" }),
              /* @__PURE__ */ jsx(
                CurrencyInput,
                {
                  className: "flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                  name: "masuk",
                  readOnly: data.status_dayly_approval,
                  allowDecimals: false,
                  prefix: "Rp. ",
                  min: 1,
                  required: true,
                  onValueChange: onHandleCurencyChange,
                  value: data.masuk,
                  placeholder: "Inputkan angka tanpa sparator"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "keluar", children: "Keluar" }),
              /* @__PURE__ */ jsx(
                CurrencyInput,
                {
                  className: "flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                  name: "keluar",
                  readOnly: data.status_dayly_approval,
                  allowDecimals: false,
                  prefix: "Rp. ",
                  min: 1,
                  required: true,
                  onValueChange: onHandleCurencyChange,
                  value: data.keluar,
                  placeholder: "Inputkan angka tanpa sparator"
                }
              )
            ] }),
            /* @__PURE__ */ jsx("p", { className: "mb-3 font-semibold underline", children: "Transaksi Minggu Depan" }),
            /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "tanggal_minggu_depan", children: "Tanggal Rencana Drop Minggu Depan" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  name: "tanggal_rencana_minggu_depan",
                  readOnly: data.tanggal_rencana_minggu_depan,
                  min: dayjs(data.date).add("1", "week").format("YYYY-MM-DD"),
                  required: true,
                  onChange: onInputChange,
                  type: "date",
                  value: data.tanggal_rencana_minggu_depan,
                  placeholder: "Inputkan angka tanpa sparator"
                }
              ),
              erorRequest && /* @__PURE__ */ jsx("small", { className: "text-red-500 ", children: "Periksa Kembali, Pengajuan Memiliki 2 Tanggal Drop Yang Berbeda" }),
              data.tanggal_rencana_minggu_depan == null && /* @__PURE__ */ jsx("small", { className: "text-red-500 ", children: "Tidak Ada Pengajuan Untuk Minggu Depan, Isikan Tanggal Secara Manual" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "rencana_minggu_depan", children: "Rencana Drop Minggu Depan" }),
              /* @__PURE__ */ jsx(
                CurrencyInput,
                {
                  className: "flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                  name: "rencana_minggu_depan",
                  allowDecimals: false,
                  readOnly: data.status_dayly_approval,
                  prefix: "Rp. ",
                  min: 1,
                  required: true,
                  onValueChange: onHandleCurencyChange,
                  value: data.rencana_minggu_depan,
                  placeholder: "Inputkan angka tanpa sparator"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "target_minggu_depan", children: "Target Minggu Depan" }),
              /* @__PURE__ */ jsx(
                CurrencyInput,
                {
                  className: "flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                  name: "target_minggu_depan",
                  allowDecimals: false,
                  readOnly: data.status_dayly_approval,
                  prefix: "Rp. ",
                  min: 1,
                  required: true,
                  onValueChange: onHandleCurencyChange,
                  value: parseInt(data.target) + (parseInt(data.masuk) - parseInt(data.keluar)),
                  placeholder: "Inputkan angka tanpa sparator"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-start flex-1 gap-3 mb-1 whitespace-nowrap", children: [
              /* @__PURE__ */ jsx(
                Checkbox,
                {
                  readOnly: data.status_dayly_approval,
                  placeholder: "Select Permission",
                  id: "daily_kepala_approval",
                  required: true
                }
              ),
              /* @__PURE__ */ jsx(InputLabel, { htmlFor: "daily_kepala_approval", children: "Konfirmasi Jika Sudah Benar Semua" })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mb-3 text-right", children: /* @__PURE__ */ jsx(Button, { type: "submit", children: "Submit" }) })
        ] })
      ] })
    ] })
  ] });
};
export {
  Approval as default
};
