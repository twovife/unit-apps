import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import "react";
import dayjs from "dayjs";
import { F as FormatNumbering } from "./FormatNumbering-CTESXtjE.js";
import "react-number-format";
const tanggal = (value) => value ? dayjs(value).format("DD MMM YYYY") : null;
const Tahap = ({ label, aktif, dilewati, nominal, oleh, pada }) => {
  const warna = dilewati ? "bg-muted text-muted-foreground border-muted-foreground/30" : aktif ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground border-input";
  return /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center shrink-0", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: `flex h-6 w-6 items-center justify-center rounded-full border text-[10px] font-bold ${warna}`,
          children: dilewati ? "–" : aktif ? "✓" : "•"
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "flex-1 w-px my-1 bg-border" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0 pb-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-between gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold uppercase tracking-wide text-foreground", children: label }),
        nominal ? /* @__PURE__ */ jsx(
          FormatNumbering,
          {
            value: nominal,
            className: "text-sm font-bold tabular-nums text-foreground"
          }
        ) : /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "—" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-0.5 text-[11px] leading-snug text-muted-foreground", children: dilewati ? /* @__PURE__ */ jsx("span", { className: "italic", children: "Dilewati (drop langsung)" }) : aktif ? /* @__PURE__ */ jsxs(Fragment, { children: [
        "oleh",
        " ",
        /* @__PURE__ */ jsx("span", { className: "font-medium text-foreground", children: oleh || "tidak tercatat" }),
        pada ? /* @__PURE__ */ jsxs(Fragment, { children: [
          " · ",
          /* @__PURE__ */ jsx("span", { className: "tabular-nums", children: pada })
        ] }) : " · tanggal tidak tercatat"
      ] }) : /* @__PURE__ */ jsx("span", { className: "italic", children: "Belum" }) })
    ] })
  ] });
};
const StatusPengajuan = ({ data }) => {
  if (!data) return null;
  const status = data.status ?? "open";
  const dropLangsung = data.drop_langsung === "baru";
  const sudahAcc = ["acc", "success"].includes(status);
  const sudahDrop = status === "success";
  const ditolak = status === "tolak";
  const gagal = status === "gagal";
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(
      Tahap,
      {
        label: "Diajukan",
        aktif: true,
        nominal: data.request,
        oleh: data.diajukan_oleh,
        pada: tanggal(data.request_date)
      }
    ),
    /* @__PURE__ */ jsx(
      Tahap,
      {
        label: ditolak ? "Ditolak" : "ACC",
        aktif: sudahAcc || ditolak,
        dilewati: dropLangsung && !sudahAcc && !ditolak,
        nominal: data.acc,
        oleh: data.acc_oleh,
        pada: tanggal(data.check_date)
      }
    ),
    /* @__PURE__ */ jsx(
      Tahap,
      {
        label: gagal ? "Gagal Drop" : "Drop Jadi",
        aktif: sudahDrop || gagal,
        nominal: data.drop_jadi,
        oleh: data.drop_oleh,
        pada: tanggal(data.tanggal_drop)
      }
    ),
    data.diinput_oleh && /* @__PURE__ */ jsxs("div", { className: "pt-2 mt-1 text-[11px] border-t text-muted-foreground", children: [
      "Diinput oleh",
      " ",
      /* @__PURE__ */ jsx("span", { className: "font-medium text-foreground", children: data.diinput_oleh }),
      data.diinput_pada ? ` · ${dayjs(data.diinput_pada).format("DD MMM YYYY HH:mm")}` : ""
    ] })
  ] });
};
export {
  StatusPengajuan as default
};
