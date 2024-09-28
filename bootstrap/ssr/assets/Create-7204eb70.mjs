import { j as jsxs, a as jsx, F as Fragment } from "../ssr.mjs";
import { I as InputError } from "./InputError-3b072368.mjs";
import { L as Loading } from "./Loading-7f1a61e6.mjs";
import { B as Button } from "./button-6facd6da.mjs";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from "./card-c2e72800.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription } from "./dialog-e17b5153.mjs";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-c148af71.mjs";
import { I as Input } from "./input-a726a844.mjs";
import { L as Label } from "./label-cecd7064.mjs";
import { useForm } from "@inertiajs/react";
import axios from "axios";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import CurrencyInput from "react-currency-input-field";
import { u as useOptionGenerator, S as SelectList } from "./SelectComponent-359a9ab7.mjs";
import RiwayatPengajuan from "./RiwayatPengajuan-5127b537.mjs";
import dayjs from "dayjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "react-dom";
import "@headlessui/react";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-efa289ef.mjs";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-dialog";
import "@radix-ui/react-icons";
import "@radix-ui/react-tabs";
import "@radix-ui/react-label";
import "./FormatNumbering-23811b25.mjs";
import "react-number-format";
import "@tanstack/react-table";
import "./DetailRiwayat-378481c6.mjs";
const Create = ({ show = false, onClosed }) => {
  const { optKelompok } = useOptionGenerator();
  const { data, setData, post, errors, processing, reset } = useForm({
    isActiveMember: false,
    nik: ""
  });
  const [nik, setNik] = useState("");
  const [loading, setLoading] = useState(false);
  const [erorAxios, setErorAxios] = useState();
  const [customerData, setCustomerData] = useState([]);
  const [mixDate, setMixDate] = useState();
  useEffect(() => {
    setMixDate(data.request_date);
    setData((prevData) => ({
      ...prevData,
      tanggal_drop: dayjs(data.request_date).add(1, "week").format("YYYY-MM-DD")
    }));
  }, [data.request_date]);
  const onHandleCurencyChange = (value, name) => {
    setData(name, value);
  };
  const onInputChange = (e) => {
    const { name, value } = e.target;
    setData(name, value);
  };
  const onNikChange = (e) => {
    const { name, value } = e.target;
    setNik(value);
  };
  const onNikSubmit = async (e) => {
    e.preventDefault();
    reset();
    setLoading(true);
    setErorAxios();
    await axios({
      method: "post",
      url: route("transaction.nasabah_buku_transaksi"),
      data: {
        nik
      }
    }).then(function({ data: data2 }) {
      setLoading(false);
      setData((prevData) => ({
        ...prevData,
        nik: data2.return_nik,
        isActiveMember: data2.data ? true : false
      }));
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
  const modalIsClosed = (e) => {
    onClosed();
    reset();
  };
  const onSubmitCreate = (e) => {
    e.preventDefault();
    post(route("transaction.store_buku_transaksi"), {
      onSuccess: () => {
        onClosed();
        reset();
      }
    });
  };
  const buttonValueClick = (e) => {
    const value = e.target.getAttribute("data-value");
    setData("request_nominal", value);
  };
  return /* @__PURE__ */ jsxs(Dialog, { open: show, onOpenChange: (open) => open ? "" : modalIsClosed(), children: [
    /* @__PURE__ */ jsx(Loading, { show: loading || processing }),
    /* @__PURE__ */ jsxs(DialogContent, { className: "w-[90vw] h-[90vh] overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin", children: [
      /* @__PURE__ */ jsx(DialogHeader, { className: "max-h-10", children: /* @__PURE__ */ jsx(DialogTitle, { children: "Buat Pinjaman Baru" }) }),
      /* @__PURE__ */ jsx(DialogDescription, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col w-full gap-3 lg:flex-row", children: [
        /* @__PURE__ */ jsxs("div", { className: "w-auto", children: [
          /* @__PURE__ */ jsxs("fieldset", { className: "w-full p-4 mb-3 border rounded-lg", children: [
            /* @__PURE__ */ jsx("legend", { className: "px-1 -ml-1 text-sm font-medium", children: "Cari Nasabah" }),
            /* @__PURE__ */ jsxs("form", { className: "w-full mb-3", onSubmit: onNikSubmit, children: [
              /* @__PURE__ */ jsx(Label, { optional: true, children: "NIK" }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    type: "text",
                    name: "nik",
                    value: nik,
                    onChange: onNikChange,
                    placeholder: "Cek NIK"
                  }
                ),
                /* @__PURE__ */ jsxs(Button, { className: "text-xs", size: "sm", children: [
                  /* @__PURE__ */ jsx(Search, { className: "w-auto h-4 mr-1" }),
                  "Cari"
                ] })
              ] }),
              erorAxios && /* @__PURE__ */ jsx(InputError, { message: erorAxios, className: "mt-1" }),
              /* @__PURE__ */ jsxs(
                "div",
                {
                  className: `font-semibold mt-1 ${nik.length == 16 ? "text-green-500" : "text-red-500"}`,
                  children: [
                    nik.length,
                    " Digit"
                  ]
                }
              )
            ] })
          ] }),
          nik && data.nik == nik && /* @__PURE__ */ jsxs("fieldset", { className: "w-full p-4 border rounded-lg", children: [
            /* @__PURE__ */ jsx("legend", { className: "px-1 -ml-1 text-sm font-medium", children: "Detail Pinjaman" }),
            /* @__PURE__ */ jsxs("form", { className: "w-full mb-3", onSubmit: onSubmitCreate, children: [
              /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "w-full mb-3", children: [
                  /* @__PURE__ */ jsx(Label, { children: "Tanggal Pengajuan" }),
                  /* @__PURE__ */ jsx(
                    Input,
                    {
                      type: "date",
                      name: "request_date",
                      required: true,
                      value: data.request_date,
                      onChange: onInputChange
                    }
                  ),
                  /* @__PURE__ */ jsx(InputError, { value: errors.request_date })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "w-full mb-3", children: [
                  /* @__PURE__ */ jsx(Label, { children: "Tanggal Drop" }),
                  /* @__PURE__ */ jsx(
                    Input,
                    {
                      type: "date",
                      name: "tanggal_drop",
                      min: mixDate,
                      required: true,
                      value: data.tanggal_drop,
                      onChange: onInputChange
                    }
                  ),
                  /* @__PURE__ */ jsx(InputError, { value: errors.tanggal_drop })
                ] })
              ] }),
              data.request_date && data.request_date == data.tanggal_drop ? /* @__PURE__ */ jsx("div", { className: "w-full mb-3 font-semibold text-red-500", children: "DROP BARU" }) : /* @__PURE__ */ jsx("div", { className: "w-full mb-3 font-semibold text-red-500", children: "PENGAJUAN DROP" }),
              /* @__PURE__ */ jsxs("div", { className: "w-full mb-3", children: [
                /* @__PURE__ */ jsx(Label, { optional: true, children: "NIK" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    type: "text",
                    name: "nik",
                    value: data.nik,
                    disabled: true,
                    onChange: onInputChange
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { value: errors.nik })
              ] }),
              !data.isActiveMember && /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsxs("div", { className: "w-full mb-3", children: [
                  /* @__PURE__ */ jsx(Label, { optional: true, children: "NO KK" }),
                  /* @__PURE__ */ jsx(
                    Input,
                    {
                      type: "text",
                      name: "no_kk",
                      value: data.no_kk,
                      onChange: onInputChange
                    }
                  ),
                  /* @__PURE__ */ jsx(InputError, { value: errors.no_kk })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "w-full mb-3", children: [
                  /* @__PURE__ */ jsx(Label, { children: "Nama" }),
                  /* @__PURE__ */ jsx(
                    Input,
                    {
                      type: "text",
                      name: "nama",
                      value: data.nama,
                      onChange: onInputChange,
                      required: true
                    }
                  ),
                  /* @__PURE__ */ jsx(InputError, { value: errors.nama })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "w-full mb-3", children: [
                  /* @__PURE__ */ jsx(Label, { children: "Alamat" }),
                  /* @__PURE__ */ jsx(
                    Input,
                    {
                      type: "text",
                      name: "alamat",
                      value: data.alamat,
                      onChange: onInputChange,
                      required: true
                    }
                  ),
                  /* @__PURE__ */ jsx(InputError, { value: errors.alamat })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "w-full mb-3", children: [
                /* @__PURE__ */ jsx(Label, { children: "Kelompok" }),
                /* @__PURE__ */ jsx(
                  SelectList,
                  {
                    value: data.kelompok,
                    options: optKelompok,
                    name: "kelompok",
                    nullvalue: true,
                    onChange: onInputChange,
                    required: true
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { value: errors.kelompok })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "w-full mb-3", children: [
                /* @__PURE__ */ jsx(Label, { children: "Nominal Pinjaman" }),
                /* @__PURE__ */ jsx(
                  CurrencyInput,
                  {
                    className: "flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                    name: "request_nominal",
                    allowDecimals: false,
                    prefix: "Rp. ",
                    min: 1,
                    required: true,
                    onValueChange: onHandleCurencyChange,
                    value: data.request_nominal,
                    placeholder: "Inputkan angka tanpa sparator"
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { value: errors.request_nominal })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap w-full gap-2 mb-3", children: [
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    size: "xs",
                    onClick: buttonValueClick,
                    "data-value": "500000",
                    children: "500.000"
                  }
                ),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    size: "xs",
                    onClick: buttonValueClick,
                    "data-value": "700000",
                    children: "700.000"
                  }
                ),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    size: "xs",
                    onClick: buttonValueClick,
                    "data-value": "1000000",
                    children: "1.000.000"
                  }
                ),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    type: "button",
                    variant: "destructive",
                    size: "xs",
                    onClick: buttonValueClick,
                    "data-value": "0",
                    children: "reset"
                  }
                )
              ] }),
              /* @__PURE__ */ jsx("div", { className: "text-end", children: /* @__PURE__ */ jsx(Button, { children: "Submit" }) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "w-auto lg:w-3/4", children: /* @__PURE__ */ jsxs(Tabs, { defaultValue: "pengajuan", className: "w-auto", children: [
          /* @__PURE__ */ jsxs(TabsList, { className: "grid w-full grid-cols-2", children: [
            /* @__PURE__ */ jsx(TabsTrigger, { value: "pengajuan", children: "Riwayat Pinjaman" }),
            /* @__PURE__ */ jsx(TabsTrigger, { value: "pinjaman", children: "Ringkasan Pinjaman" })
          ] }),
          /* @__PURE__ */ jsx(TabsContent, { value: "pengajuan", children: /* @__PURE__ */ jsxs(Card, { children: [
            /* @__PURE__ */ jsxs(CardHeader, { children: [
              /* @__PURE__ */ jsx(CardTitle, { children: "Riwayat Pengajuan" }),
              /* @__PURE__ */ jsx(CardDescription, { children: "Riwayat Pengajuan Nasabah dilihat berdasarkan NIK yang tertera dari semua cabang" })
            ] }),
            /* @__PURE__ */ jsx(CardContent, { className: "space-y-2", children: /* @__PURE__ */ jsx("div", { className: "h-[50vh] border rounded-lg overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin", children: /* @__PURE__ */ jsx(RiwayatPengajuan, { data: customerData }) }) })
          ] }) }),
          /* @__PURE__ */ jsx(TabsContent, { value: "pinjaman", children: /* @__PURE__ */ jsxs(Card, { children: [
            /* @__PURE__ */ jsxs(CardHeader, { children: [
              /* @__PURE__ */ jsx(CardTitle, { children: "Ringkasan Pinjaman" }),
              /* @__PURE__ */ jsx(CardDescription, { children: "Ringkasan Analisa Nasabah" })
            ] }),
            /* @__PURE__ */ jsx(CardContent, { className: "space-y-2", children: /* @__PURE__ */ jsx("div", { children: "masih belum ada, update secara berkala" }) })
          ] }) })
        ] }) })
      ] }) })
    ] })
  ] });
};
export {
  Create as default
};