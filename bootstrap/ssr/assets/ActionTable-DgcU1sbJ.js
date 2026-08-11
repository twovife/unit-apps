import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { A as AppBadge, a as varianJenis, v as varianStatus } from "./statusVariants-kLBpdvOH.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-H80jjgLf.js";
import "clsx";
import "tailwind-merge";
const Field = ({ label, children }) => /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
  /* @__PURE__ */ jsx("div", { className: "text-[10px] font-medium uppercase tracking-wide text-muted-foreground", children: label }),
  /* @__PURE__ */ jsx("div", { className: "text-sm leading-tight break-words text-foreground", children: children || /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "—" }) })
] });
const tanggal = (value, format = "DD MMM YYYY") => value ? dayjs(value).format(format) : null;
const ActionTable = ({ datas }) => {
  const [data, setData] = useState({});
  useEffect(() => {
    setData(datas ?? {});
  }, [datas]);
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "px-3 py-3 border-b bg-muted/40", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold leading-tight text-foreground", children: data.nama || /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "—" }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 shrink-0", children: [
          /* @__PURE__ */ jsx(AppBadge, { variant: varianJenis(data.drop_langsung), size: "base", children: data.drop_langsung }),
          /* @__PURE__ */ jsx(AppBadge, { variant: varianStatus(data.status), size: "base", children: data.status ?? "open" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-1 text-sm text-foreground", children: data.alamat || /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "—" }) }),
      /* @__PURE__ */ jsxs("div", { className: "mt-0.5 text-xs tabular-nums text-muted-foreground", children: [
        "NIK ",
        data.nik || "—"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 px-3 py-3 gap-x-4 gap-y-3 sm:grid-cols-3", children: [
      /* @__PURE__ */ jsx(Field, { label: "Nomor Pengajuan", children: data.nomor_pengajuan }),
      /* @__PURE__ */ jsx(Field, { label: "Nomor Anggota", children: data.nomor_anggota }),
      /* @__PURE__ */ jsx(Field, { label: "Pinjaman Ke", children: data.pinjaman_ke }),
      /* @__PURE__ */ jsx(Field, { label: "Unit", children: data.unit }),
      /* @__PURE__ */ jsx(Field, { label: "Kelompok", children: data.kelompok }),
      /* @__PURE__ */ jsx(Field, { label: "Hari", children: /* @__PURE__ */ jsx("span", { className: "capitalize", children: data.hari }) }),
      /* @__PURE__ */ jsx(Field, { label: "Tanggal Pengajuan", children: tanggal(data.request_date) }),
      /* @__PURE__ */ jsx(Field, { label: "Tanggal Drop", children: tanggal(data.tanggal_drop) }),
      /* @__PURE__ */ jsx(Field, { label: "Jenis", children: /* @__PURE__ */ jsx("span", { className: "capitalize", children: data.drop_langsung }) })
    ] })
  ] });
};
export {
  ActionTable as default
};
