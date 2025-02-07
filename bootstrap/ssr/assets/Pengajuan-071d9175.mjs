import { j as jsxs, a as jsx } from "../ssr.mjs";
import { L as Loading } from "./Loading-95bc2f77.mjs";
import { B as Button } from "./button-bf6cf732.mjs";
import { C as Card, a as CardHeader, b as CardTitle, d as CardContent } from "./card-a7cc8935.mjs";
import { A as Accordion, a as AccordionItem, c as AccordionContent } from "./accordion-01051f31.mjs";
import { useState } from "react";
import WhiteOff from "./WhiteOff-86c8031e.mjs";
import PengajuanLama from "./PengajuanLama-ee984643.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react";
import "@inertiajs/react/server";
import "react-dom";
import "@headlessui/react";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-efa289ef.mjs";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-accordion";
import "@radix-ui/react-icons";
import "dayjs";
import "./input-a726a844.mjs";
import "./label-7289427a.mjs";
import "@radix-ui/react-label";
import "./InputError-3b072368.mjs";
import "react-currency-input-field";
const Pengajuan = ({ triggeredId, triggeredPinjaman, instalment }) => {
  var _a;
  const [activePanel, setActivePanel] = useState(null);
  const togglePanel = (panel) => {
    setActivePanel((prev) => prev === panel ? null : panel);
  };
  const pelunasan = ((_a = instalment.sort((a, b) => a.saldo - b.saldo)[0]) == null ? void 0 : _a.saldo) ?? 0;
  return /* @__PURE__ */ jsxs(Card, { className: "relative w-full mb-3", children: [
    /* @__PURE__ */ jsx(Loading, { show: false }),
    /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Action" }) }),
    /* @__PURE__ */ jsxs(CardContent, { className: "relative", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3 mb-3", children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: activePanel == "item-1" ? "green" : "outline",
            onClick: () => togglePanel("item-1"),
            disabled: true,
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
