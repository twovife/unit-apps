import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { F as FormatNumbering } from "./FormatNumbering-CTESXtjE.js";
import dayjs from "dayjs";
import { A as AppBadge } from "./AppBadge-CfINLLYj.js";
import { v as varianJenis, a as varianStatus } from "./ActionTable-C05_T-Rr.js";
import Action from "./Action-BRGYrfG0.js";
import "react-number-format";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-DzFuPzol.js";
import "clsx";
import "tailwind-merge";
import "./dialog-8a8NNlps.js";
import "@radix-ui/react-dialog";
import "lucide-react";
import "./accordion-EOARN4Ag.js";
import "@radix-ui/react-accordion";
import "@radix-ui/react-icons";
import "./card-WipCscFv.js";
import "./tabs-BAdW7Ajv.js";
import "@radix-ui/react-tabs";
import "axios";
import "./RiwayatPengajuan-BgwqMR0N.js";
import "./table-Dwx5kZ1B.js";
import "@tanstack/react-table";
import "./BadgeStatus-Cj6LHx_M.js";
import "./badge-CBTu05xj.js";
import "./button-MTjEwktD.js";
import "./Acc-D3ukg6cl.js";
import "./Loading-DPcVnbEk.js";
import "react-dom";
import "@headlessui/react";
import "./Tundaan-DTErNWMQ.js";
import "./input-BHD-__le.js";
import "./label-F4MKz6SO.js";
import "@radix-ui/react-label";
import "@inertiajs/react";
import "react-currency-input-field";
import "./StatusPengajuan-BBMso_U9.js";
import "./RemoveLoan-BCXe6fgS.js";
import "./ChangeDetail-ChsDycND.js";
const Amount = ({ label, value, tone = "normal" }) => {
  const toneClass = {
    muted: "text-[13px] font-normal text-muted-foreground",
    normal: "text-[13px] font-medium text-foreground",
    strong: "text-base font-bold text-foreground"
  }[tone];
  return /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
    /* @__PURE__ */ jsx("div", { className: "text-[10px] font-medium uppercase tracking-wide text-muted-foreground", children: label }),
    value ? /* @__PURE__ */ jsx(
      FormatNumbering,
      {
        value,
        className: `text-start tabular-nums leading-tight ${toneClass}`
      }
    ) : /* @__PURE__ */ jsx("div", { className: `text-start leading-tight ${toneClass}`, children: "—" })
  ] });
};
const BukuTransaksiKepala = ({ datas }) => {
  var _a, _b;
  const [data, setData] = useState([]);
  useEffect(() => {
    setData(datas);
  }, [datas]);
  const calculateTotals = (data2) => {
    return data2.reduce(
      (acc, item) => {
        acc.request += item.request || 0;
        acc.drop += item.drop || 0;
        acc.drop_jadi += item.drop_jadi || 0;
        acc.acc += item.acc || 0;
        return acc;
      },
      {
        request: 0,
        drop: 0,
        acc: 0,
        drop_jadi: 0
      }
    );
  };
  const totals = calculateTotals(data);
  const [onCreateShow, setOnCreateShow] = useState(false);
  const [actionData, setActionData] = useState();
  const handleOnCreateShowOpen = (e) => {
    setOnCreateShow(true);
    setActionData(e);
  };
  const handleOnCreateShowClosed = (e) => {
    setOnCreateShow(false);
    setActionData();
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      Action,
      {
        show: onCreateShow,
        onClosed: handleOnCreateShowClosed,
        triggeredData: actionData
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "border rounded-lg", children: [
      /* @__PURE__ */ jsxs("div", { className: "sticky z-20 flex items-center justify-between gap-2 px-3 py-2 border-b top-14 rounded-t-lg bg-muted", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold whitespace-nowrap text-foreground", children: dayjs((_a = data[0]) == null ? void 0 : _a.tanggal_drop).format("DD-MM-YYYY") }),
        /* @__PURE__ */ jsxs("span", { className: "text-[11px] capitalize text-muted-foreground", children: [
          (_b = data[0]) == null ? void 0 : _b.hari,
          " · ",
          data.length,
          " nasabah"
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "divide-y", children: data && data.map((item) => /* @__PURE__ */ jsxs(
        "div",
        {
          role: "button",
          tabIndex: 0,
          onClick: () => handleOnCreateShowOpen(item),
          onKeyDown: (e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleOnCreateShowOpen(item);
            }
          },
          className: "w-full px-3 py-3 text-left transition-colors cursor-pointer hover:bg-accent/50 active:bg-accent",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-[15px] font-semibold leading-snug text-foreground", children: item.nama }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 shrink-0", children: [
                item.is_tundaan && /* @__PURE__ */ jsx(AppBadge, { variant: "primary", size: "sm", children: "TD" }),
                /* @__PURE__ */ jsx(
                  AppBadge,
                  {
                    variant: varianJenis(item.drop_langsung),
                    size: "sm",
                    children: item.drop_langsung
                  }
                ),
                /* @__PURE__ */ jsx(AppBadge, { variant: varianStatus(item.status), size: "sm", children: item.status ?? "open" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-0.5 truncate text-[11px] text-muted-foreground", children: [
              item.nik,
              item.alamat ? ` · ${item.alamat}` : ""
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2 mt-2", children: [
              /* @__PURE__ */ jsx(Amount, { label: "Pengajuan", value: item.request, tone: "muted" }),
              /* @__PURE__ */ jsx(Amount, { label: "ACC", value: item.acc, tone: "normal" }),
              /* @__PURE__ */ jsx("div", { className: "pl-2 border-l-2 border-primary/60", children: /* @__PURE__ */ jsx(
                Amount,
                {
                  label: "Drop Jadi",
                  value: item.drop_jadi,
                  tone: "strong"
                }
              ) })
            ] })
          ]
        },
        item.id
      )) }),
      /* @__PURE__ */ jsx("div", { className: "px-3 py-2 border-t rounded-b-lg bg-muted/60", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
        /* @__PURE__ */ jsx(
          Amount,
          {
            label: "Total Pengajuan",
            value: totals.request,
            tone: "muted"
          }
        ),
        /* @__PURE__ */ jsx(Amount, { label: "Total ACC", value: totals.acc, tone: "normal" }),
        /* @__PURE__ */ jsx("div", { className: "pl-2 border-l-2 border-primary/60", children: /* @__PURE__ */ jsx(
          Amount,
          {
            label: "Total Drop Jadi",
            value: totals.drop_jadi,
            tone: "strong"
          }
        ) })
      ] }) })
    ] })
  ] });
};
export {
  BukuTransaksiKepala as default
};
