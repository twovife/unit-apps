import { j as jsxs, a as jsx, F as Fragment } from "../ssr.mjs";
import * as React from "react";
import { useState, useEffect } from "react";
import { C as Card, a as CardHeader, b as CardTitle, d as CardContent, e as CardFooter } from "./card-f356ad44.mjs";
import { F as FormatNumbering } from "./FormatNumbering-47cfa339.mjs";
import dayjs from "dayjs";
import { B as BargeStatus } from "./BargeStatus-070c40e0.mjs";
import { B as BadgeStatus } from "./BadgeStatus-1947fb26.mjs";
import Action from "./Action-c7131abb.mjs";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { c as cn } from "./utils-efa289ef.mjs";
import "clsx";
import "./separator-6fdc070c.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react";
import "@inertiajs/react/server";
import "react-number-format";
import "./badge-ad1cae46.mjs";
import "class-variance-authority";
import "./button-e7ccf50f.mjs";
import "@radix-ui/react-slot";
import "./dialog-97d8ecd0.mjs";
import "@radix-ui/react-dialog";
import "@radix-ui/react-icons";
import "@radix-ui/react-accordion";
import "./tabs-c148af71.mjs";
import "@radix-ui/react-tabs";
import "axios";
import "./RiwayatPengajuan-aa3b808c.mjs";
import "./table-8d30c177.mjs";
import "@tanstack/react-table";
import "./Loading-95bc2f77.mjs";
import "react-dom";
import "@headlessui/react";
import "./ModalShowAngsuran-60a89e11.mjs";
import "tailwind-merge";
import "./Acc-711e7371.mjs";
import "./NoEditOverlay-fb1d5d5c.mjs";
import "./useFrontEndPermission-59a7cda0.mjs";
import "./label-7289427a.mjs";
import "@radix-ui/react-label";
import "react-currency-input-field";
import "./ActionTable-0d5c3717.mjs";
import "./use-mobile-f8f7682a.mjs";
import "lucide-react";
import "sonner";
import "./sonner-0ca6cfec.mjs";
import "next-themes";
import "./RemoveLoan-10a666cf.mjs";
import "./ChangeDetail-387ac0d8.mjs";
import "./input-22e7db4a.mjs";
import "@radix-ui/react-separator";
const ScrollArea = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  ScrollAreaPrimitive.Root,
  {
    ref,
    className: cn("relative overflow-hidden", className),
    ...props,
    children: [
      /* @__PURE__ */ jsx(ScrollAreaPrimitive.Viewport, { className: "h-full w-full rounded-[inherit]", children }),
      /* @__PURE__ */ jsx(ScrollBar, {}),
      /* @__PURE__ */ jsx(ScrollAreaPrimitive.Corner, {})
    ]
  }
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;
const ScrollBar = React.forwardRef(({ className, orientation = "vertical", ...props }, ref) => /* @__PURE__ */ jsx(
  ScrollAreaPrimitive.ScrollAreaScrollbar,
  {
    ref,
    orientation,
    className: cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(ScrollAreaPrimitive.ScrollAreaThumb, { className: "relative flex-1 rounded-full bg-border" })
  }
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;
const BukuTransaksiKepala = ({ datas }) => {
  var _a;
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
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
      /* @__PURE__ */ jsx("div", { className: "p-3 py-1 text-lg font-semibold text-gray-800 bg-muted", children: dayjs((_a = data[0]) == null ? void 0 : _a.tanggal_drop).format("DD-MM-YYYY") }),
      data && data.map((item, key) => /* @__PURE__ */ jsxs(
        Card,
        {
          className: "overflow-hidden text-xs transition-all group",
          children: [
            /* @__PURE__ */ jsx(
              CardHeader,
              {
                className: `p-3 pl-1 shadow ${item.drop_langsung == "lama" ? "border-l-8 border-l-gray-600" : "border-l-8 border-l-green-400"}`,
                children: /* @__PURE__ */ jsx(CardTitle, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("span", { className: "mr-3 text-base", children: item.nama }),
                    /* @__PURE__ */ jsx(BadgeStatus, { value: item.drop_langsung })
                  ] }),
                  /* @__PURE__ */ jsx(
                    BargeStatus,
                    {
                      value: item.status,
                      onClick: () => handleOnCreateShowOpen(item)
                    }
                  )
                ] }) })
              }
            ),
            /* @__PURE__ */ jsxs(
              CardContent,
              {
                className: `p-3 pl-1 text-sm shadow ${item.drop_langsung == "lama" ? "border-l-8 border-l-gray-600" : "border-l-8 border-l-green-400"}`,
                children: [
                  /* @__PURE__ */ jsx("div", { className: "font-semibold ", children: item.nik }),
                  /* @__PURE__ */ jsx("div", { className: "break-words", children: item.alamat })
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              CardFooter,
              {
                className: `p-3 ${item.drop_langsung == "lama" ? "border-l-8 border-l-gray-600" : "border-l-8 border-l-green-400"}`,
                children: /* @__PURE__ */ jsxs("div", { className: "flex w-full text-xs font-semibold text-center ", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex-1 border-r-2 border-red-300", children: [
                    /* @__PURE__ */ jsx("div", { children: "Pengajuan" }),
                    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
                      FormatNumbering,
                      {
                        className: "text-center",
                        value: item.request
                      }
                    ) })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex-1 border-r-2 border-red-300", children: [
                    /* @__PURE__ */ jsx("div", { children: "Acc" }),
                    /* @__PURE__ */ jsx(FormatNumbering, { className: "text-center", value: item.acc })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                    /* @__PURE__ */ jsx("div", { children: "Drop Jadi" }),
                    /* @__PURE__ */ jsx(
                      FormatNumbering,
                      {
                        className: "text-center",
                        value: item.drop_jadi
                      }
                    )
                  ] })
                ] })
              }
            )
          ]
        },
        item.key
      )),
      /* @__PURE__ */ jsx("div", { className: "p-3 overflow-hidden text-sm border-l-8 rounded-lg shadow", children: /* @__PURE__ */ jsxs("div", { className: "flex w-full font-semibold text-center ", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex-1 border-r-2 border-red-300", children: [
          /* @__PURE__ */ jsx("div", { children: "Pengajuan" }),
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
            FormatNumbering,
            {
              className: "text-center",
              value: totals.request
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 border-r-2 border-red-300", children: [
          /* @__PURE__ */ jsx("div", { children: "Acc" }),
          /* @__PURE__ */ jsx(FormatNumbering, { className: "text-center", value: totals.acc })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsx("div", { children: "Drop Jadi" }),
          /* @__PURE__ */ jsx(
            FormatNumbering,
            {
              className: "text-center",
              value: totals.drop_jadi
            }
          )
        ] })
      ] }) })
    ] })
  ] });
};
export {
  BukuTransaksiKepala as default
};
