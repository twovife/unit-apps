import { jsx, jsxs } from "react/jsx-runtime";
import { I as InputError } from "./InputError-cRVTeK4i.js";
import { L as Loading } from "./Loading-DPcVnbEk.js";
import { B as Button } from "./button-MTjEwktD.js";
import { I as Input } from "./input-BHD-__le.js";
import { L as Label } from "./label-F4MKz6SO.js";
import { useForm } from "@inertiajs/react";
import axios from "axios";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import CurrencyInput from "react-currency-input-field";
import { g as getLastDateForHari } from "./utils-DzFuPzol.js";
import { F as FormatNumbering } from "./FormatNumbering-CTESXtjE.js";
import "react-dom";
import "@headlessui/react";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-label";
import "clsx";
import "tailwind-merge";
import "react-number-format";
const PengajuanLama = ({ isActive, triggeredId, triggeredPinjaman }) => {
  const { data, setData, errors, post, processing, reset } = useForm({
    request_date: getLastDateForHari(triggeredPinjaman == null ? void 0 : triggeredPinjaman.hari),
    tanggal_drop: "",
    request_nominal: 0,
    nomor_anggota: (triggeredPinjaman == null ? void 0 : triggeredPinjaman.nomor_anggota) ?? "",
    residential_address: (triggeredPinjaman == null ? void 0 : triggeredPinjaman.domisili) ?? "",
    type: "pengajuan"
    //type have pengajuan,baru,TD
  });
  const [existingPengajuan, setExistingPengajuan] = useState(null);
  const [mixDate, setMixDate] = useState();
  useEffect(() => {
    setMixDate(data.request_date);
    setData((prevData) => ({
      ...prevData,
      tanggal_drop: dayjs(data.request_date).add(1, "week").format("YYYY-MM-DD")
    }));
  }, [data.request_date]);
  const onInputChange = (e) => {
    const { name, value } = e.target;
    setData(name, value);
  };
  const onHandleCurencyChange = (value, name, float) => {
    setData(name, value);
  };
  const buttonValueClick = (e) => {
    const value = e.target.getAttribute("data-value");
    setData("request_nominal", value);
  };
  const getDataAxios = async () => {
    try {
      const response = await axios.get(
        route("pinjaman.checkpengajuan", triggeredId)
      );
      const { sudah_diajukan, pengajuan } = response.data.data;
      setExistingPengajuan(sudah_diajukan ? pengajuan : null);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (isActive && triggeredId) {
      getDataAxios();
    }
  }, [isActive, triggeredId]);
  const submitForm = (e) => {
    e.preventDefault();
    post(route("pinjaman.store_pengajuan_lama", triggeredId), {
      onSuccess: () => {
        reset();
        getDataAxios();
      }
      // preserveState: true,
    });
  };
  return /* @__PURE__ */ jsx("div", { children: existingPengajuan ? /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-sm", children: [
    /* @__PURE__ */ jsx("p", { className: "font-medium text-foreground", children: "Nasabah ini sudah diajukan pinjaman baru — tidak bisa diajukan lagi." }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2 p-3 border rounded-md bg-muted/40", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "text-[10px] font-medium uppercase tracking-wide text-muted-foreground", children: "Status" }),
        /* @__PURE__ */ jsx("div", { className: "capitalize", children: existingPengajuan.status })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "text-[10px] font-medium uppercase tracking-wide text-muted-foreground", children: "Tanggal Drop" }),
        /* @__PURE__ */ jsx("div", { children: dayjs(existingPengajuan.tanggal_drop).format("DD-MM-YYYY") })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "col-span-2", children: [
        /* @__PURE__ */ jsx("div", { className: "text-[10px] font-medium uppercase tracking-wide text-muted-foreground", children: existingPengajuan.status === "success" ? "Drop" : "Pengajuan" }),
        /* @__PURE__ */ jsx(
          FormatNumbering,
          {
            value: existingPengajuan.nominal_drop ?? existingPengajuan.request_nominal,
            className: "font-semibold"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      "a",
      {
        href: route("pinjaman.index_pinjaman", {
          date: existingPengajuan.tanggal_drop,
          kelompok: existingPengajuan.kelompok
        }),
        target: "_blank",
        rel: "noreferrer",
        className: "inline-block text-blue-500 underline",
        children: "Lihat Drop Hari Itu"
      }
    )
  ] }) : /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(Loading, { show: processing }),
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
      /* @__PURE__ */ jsx(InputError, { message: errors.request_date })
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
      /* @__PURE__ */ jsx(InputError, { message: errors.tanggal_drop })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "w-full mb-3", children: [
      /* @__PURE__ */ jsx(Label, { children: "Kelompok" }),
      /* @__PURE__ */ jsx(Input, { type: "text", value: (triggeredPinjaman == null ? void 0 : triggeredPinjaman.kelompok) ?? "", disabled: true })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "w-full mb-3", children: [
      /* @__PURE__ */ jsx(Label, { children: "Nomor Anggota" }),
      /* @__PURE__ */ jsx(
        Input,
        {
          type: "text",
          name: "nomor_anggota",
          required: true,
          value: data.nomor_anggota,
          onChange: onInputChange
        }
      ),
      /* @__PURE__ */ jsx(InputError, { message: errors.nomor_anggota })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "w-full mb-3", children: [
      /* @__PURE__ */ jsx(Label, { children: "Domisili Nasabah" }),
      /* @__PURE__ */ jsx(
        Input,
        {
          type: "text",
          name: "residential_address",
          value: data.residential_address,
          onChange: onInputChange,
          placeholder: triggeredPinjaman == null ? void 0 : triggeredPinjaman.alamat
        }
      ),
      /* @__PURE__ */ jsx(InputError, { message: errors.residential_address }),
      !data.residential_address && /* @__PURE__ */ jsxs("p", { className: "mt-1 text-xs text-muted-foreground", children: [
        "Kosong berarti pakai alamat identitas: ",
        (triggeredPinjaman == null ? void 0 : triggeredPinjaman.alamat) ?? "—"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "w-full mb-3", children: [
      /* @__PURE__ */ jsx(Label, { children: "Nominal Pinjaman" }),
      /* @__PURE__ */ jsx(
        CurrencyInput,
        {
          className: "flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-xs h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          name: "request_nominal",
          defaultValue: 0,
          allowDecimals: false,
          prefix: "Rp. ",
          min: 1,
          required: true,
          onValueChange: onHandleCurencyChange,
          value: data.request_nominal,
          placeholder: "Inputkan angka tanpa sparator"
        }
      ),
      /* @__PURE__ */ jsx(InputError, { message: errors.request_nominal })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap w-full gap-2 mb-3", children: [
      /* @__PURE__ */ jsx(
        Button,
        {
          type: "button",
          variant: "outline",
          size: "xs",
          onClick: buttonValueClick,
          "data-value": "400000",
          children: "400rb"
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          type: "button",
          variant: "outline",
          size: "xs",
          onClick: buttonValueClick,
          "data-value": "500000",
          children: "500rb"
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
          children: "700rb"
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          type: "button",
          variant: "outline",
          size: "xs",
          onClick: buttonValueClick,
          "data-value": "800000",
          children: "800rb"
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
          children: "1 Jt"
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          type: "button",
          variant: "outline",
          size: "xs",
          onClick: buttonValueClick,
          "data-value": "1500000",
          children: "1,5 Jt"
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
    /* @__PURE__ */ jsx("div", { className: "text-end", children: /* @__PURE__ */ jsx(Button, { type: "submit", onClick: submitForm, disabled: processing, children: "Submit" }) })
  ] }) });
};
export {
  PengajuanLama as default
};
