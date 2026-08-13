import { jsxs, jsx } from "react/jsx-runtime";
import { L as Loading } from "./Loading-DPcVnbEk.js";
import { B as Button } from "./button-MTjEwktD.js";
import { C as Card, a as CardHeader, b as CardTitle, d as CardContent } from "./card-WipCscFv.js";
import { A as Accordion, a as AccordionItem, c as AccordionContent } from "./accordion-EOARN4Ag.js";
import { useState } from "react";
import WhiteOff from "./WhiteOff-BL9r_Gno.js";
import PengajuanLama from "./PengajuanLama-N_52jNMR.js";
import "react-dom";
import "@headlessui/react";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-DzFuPzol.js";
import "clsx";
import "tailwind-merge";
import "dayjs";
import "@radix-ui/react-accordion";
import "@radix-ui/react-icons";
import "@inertiajs/react";
import "./input-BHD-__le.js";
import "./label-F4MKz6SO.js";
import "@radix-ui/react-label";
import "./InputError-cRVTeK4i.js";
import "react-currency-input-field";
import "axios";
import "./FormatNumbering-CTESXtjE.js";
import "react-number-format";
const canAjukanPengajuan = (triggeredPinjaman) => {
  const pinjaman = (triggeredPinjaman == null ? void 0 : triggeredPinjaman.pinjaman) ?? 0;
  const saldo = (triggeredPinjaman == null ? void 0 : triggeredPinjaman.saldo) ?? 0;
  if (pinjaman <= 0) return false;
  if (saldo / pinjaman > 0.4) return false;
  return ["normal", "cm"].includes(triggeredPinjaman == null ? void 0 : triggeredPinjaman.status_pinjaman);
};
const Pengajuan = ({ triggeredId, triggeredPinjaman, instalment }) => {
  var _a;
  const [activePanel, setActivePanel] = useState(null);
  const togglePanel = (panel) => {
    setActivePanel((prev) => prev === panel ? null : panel);
  };
  const pelunasan = ((_a = instalment.sort((a, b) => a.saldo - b.saldo)[0]) == null ? void 0 : _a.saldo) ?? 0;
  const bolehPengajuan = canAjukanPengajuan(triggeredPinjaman);
  return /* @__PURE__ */ jsxs(Card, { className: "relative w-full mb-3", children: [
    /* @__PURE__ */ jsx(Loading, { show: false }),
    /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Action" }) }),
    /* @__PURE__ */ jsxs(CardContent, { className: "relative", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3 mb-1", children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: activePanel == "item-1" ? "green" : "outline",
            onClick: () => togglePanel("item-1"),
            disabled: !bolehPengajuan,
            children: "Pengajuan"
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: activePanel == "item-2" ? "green" : "outline",
            onClick: () => togglePanel("item-2"),
            children: "Pemutihan"
          }
        )
      ] }),
      !bolehPengajuan && /* @__PURE__ */ jsx("p", { className: "mb-3 text-xs font-medium leading-relaxed text-amber-600", children: "Pengajuan cuma bisa dipakai kalau sisa saldo pinjaman ini sudah ≤40% dari pokok pinjaman dan belum masuk kategori MB/ML." }),
      /* @__PURE__ */ jsxs(
        Accordion,
        {
          type: "single",
          collapsible: true,
          value: activePanel,
          onValueChange: setActivePanel,
          children: [
            /* @__PURE__ */ jsx(AccordionItem, { borderless: true, value: "item-1", children: /* @__PURE__ */ jsx(AccordionContent, { children: activePanel == "item-1" && /* @__PURE__ */ jsx(
              PengajuanLama,
              {
                isActive: activePanel == "item-1",
                triggeredId,
                triggeredPinjaman
              }
            ) }) }),
            /* @__PURE__ */ jsx(AccordionItem, { borderless: true, value: "item-2", children: /* @__PURE__ */ jsx(AccordionContent, { children: activePanel == "item-2" && /* @__PURE__ */ jsx(
              WhiteOff,
              {
                triggeredId,
                nominalWhiteOff: pelunasan ?? 0
              }
            ) }) })
          ]
        }
      )
    ] })
  ] });
};
export {
  Pengajuan as default
};
