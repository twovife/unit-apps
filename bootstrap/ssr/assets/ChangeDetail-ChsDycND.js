import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { L as Loading } from "./Loading-DPcVnbEk.js";
import { useState, useEffect } from "react";
import "clsx";
import "dayjs";
import { B as Button } from "./button-MTjEwktD.js";
import "./input-BHD-__le.js";
import "./label-F4MKz6SO.js";
import { usePage, useForm } from "@inertiajs/react";
import "react-currency-input-field";
import "react-dom";
import "@headlessui/react";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-DzFuPzol.js";
import "tailwind-merge";
import "@radix-ui/react-label";
const ChangeDetail = ({ triggeredData, onClosed }) => {
  var _a, _b, _c;
  const { auth } = usePage().props;
  const isMantri = (_a = auth == null ? void 0 : auth.roles) == null ? void 0 : _a.includes("mantri");
  const canApprove = (_b = auth == null ? void 0 : auth.permissions) == null ? void 0 : _b.includes("can-approve");
  const isSuperUser = (_c = auth == null ? void 0 : auth.roles) == null ? void 0 : _c.includes("superuser");
  const terkunciRekap = (triggeredData == null ? void 0 : triggeredData.recap_approved) && !isSuperUser;
  const terkunciPengganti = triggeredData == null ? void 0 : triggeredData.sudah_diajukan_pengganti;
  const bolehReset = canApprove && !terkunciRekap && !terkunciPengganti;
  const pesanTidakBisa = !canApprove ? "JIKA ADA KESALAHAN SAAT KLICK TOMBOL, BISA HUBUNGI KM / PIMPINAN UNTUK MENGUBAHNYA" : terkunciPengganti ? "Transaksi ini sudah diajukan (jadi dasar pengajuan/Tundaan lain yang masih berjalan), tidak bisa direset." : terkunciRekap ? "Rekap harian tanggal drop ini sudah di-ACC pimpinan, pinjaman tidak bisa direset lagi. Hubungi superuser bila memang harus diubah." : null;
  const { data, setData, put, processing, reset, transform, errors } = useForm({
    request_date: "",
    drop_date: "",
    request_nominal: "",
    approved_nominal: "",
    nominal_drop: "",
    drop_langsung: ""
  });
  const [errorClient, setErrorClient] = useState(null);
  useEffect(() => {
    if (triggeredData) {
      setData((prevData) => ({
        ...prevData,
        request_date: triggeredData.request_date,
        drop_date: triggeredData.tanggal_drop,
        drop_langsung: triggeredData.drop_langsung,
        request_nominal: triggeredData.drop_langsung == "baru" ? triggeredData.drop_jadi : triggeredData.request,
        approved_nominal: triggeredData.acc,
        nominal_drop: triggeredData.drop_jadi
      }));
    }
  }, [triggeredData]);
  const handleSubmit = (status) => {
    transform((data2) => ({
      ...data2,
      updateType: status
    }));
    put(route("transaction.updateEverything", triggeredData == null ? void 0 : triggeredData.nomor_pengajuan), {
      preventDefault: true,
      preserveState: true,
      onSuccess: () => {
        reset();
        onClosed();
      }
    });
  };
  return /* @__PURE__ */ jsxs("form", { onSubmit: (e) => e.preventDefault(), children: [
    isMantri && /* @__PURE__ */ jsx("p", { className: "mb-2 text-xs font-medium text-amber-600", children: "Hanya bisa dilakukan oleh Pimpinan / Staff" }),
    /* @__PURE__ */ jsx(Loading, { show: processing }),
    /* @__PURE__ */ jsx("div", { className: "mb-3", children: pesanTidakBisa ? /* @__PURE__ */ jsx(
      "div",
      {
        className: `text-xs font-medium leading-relaxed ${canApprove ? "text-destructive" : "text-amber-600"}`,
        children: pesanTidakBisa
      }
    ) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground", children: [
        "Jika ada kesalahan status, reset pinjaman agar status kembali",
        " ",
        /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground", children: "open" }),
        ", lalu lakukan ACC ulang."
      ] }),
      /* @__PURE__ */ jsx("div", { className: "text-xs text-yellow-500", children: "Setelah Transaksi Hari Ini Dikunci Pinjaman Tidak Bisa Direset Lagi" })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: (triggeredData == null ? void 0 : triggeredData.drop_langsung) == "lama" && canApprove && /* @__PURE__ */ jsx(
      Button,
      {
        onClick: () => handleSubmit("resetdata"),
        variant: "yellow",
        type: "submit",
        disabled: !bolehReset,
        children: "Reset Pinjaman"
      }
    ) })
  ] });
};
export {
  ChangeDetail as default
};
