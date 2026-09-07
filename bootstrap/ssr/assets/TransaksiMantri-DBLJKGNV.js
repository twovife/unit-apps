import { jsxs, jsx } from "react/jsx-runtime";
import { usePage, Head } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { M as MobileLayout } from "./MobileLayout-Dkq47fl2.js";
import BukuTransaksiKepala from "./BukuTransaksiKepala-TVxcqwwQ.js";
import { F as FilterBar } from "./FilterBar-YtaCqrQo.js";
import "./AuthenticatedLayout-Lb160WPB.js";
import "./command-int9mZp7.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-DzFuPzol.js";
import "clsx";
import "tailwind-merge";
import "dayjs";
import "./button-MTjEwktD.js";
import "./input-BHD-__le.js";
import "@radix-ui/react-separator";
import "@radix-ui/react-dialog";
import "@radix-ui/react-icons";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-dropdown-menu";
import "cmdk";
import "lucide-react";
import "./dialog-8a8NNlps.js";
import "./popover-B9xSK2Gy.js";
import "@radix-ui/react-popover";
import "sweetalert2";
import "sweetalert2-react-content";
import "./Loading-DPcVnbEk.js";
import "react-dom";
import "@headlessui/react";
import "./FormatNumbering-CTESXtjE.js";
import "react-number-format";
import "./AppBadge-CfINLLYj.js";
import "./ActionTable-C05_T-Rr.js";
import "./Action-DARzEBfS.js";
import "./accordion-EOARN4Ag.js";
import "@radix-ui/react-accordion";
import "./card-WipCscFv.js";
import "./tabs-BAdW7Ajv.js";
import "@radix-ui/react-tabs";
import "axios";
import "./RiwayatPengajuan-xZzAsLuI.js";
import "./table-Dwx5kZ1B.js";
import "@tanstack/react-table";
import "./BadgeStatus-Cj6LHx_M.js";
import "./badge-CBTu05xj.js";
import "./Acc-3DkJHN15.js";
import "./Tundaan-Czn7wgWz.js";
import "./label-F4MKz6SO.js";
import "@radix-ui/react-label";
import "./TanggalKerja-cCQo_ce9.js";
import "./useHariLibur-C2p-tWwl.js";
import "./calendar-BJ3LWb_A.js";
import "react-day-picker";
import "date-fns/locale";
import "react-currency-input-field";
import "./StatusPengajuan-BBMso_U9.js";
import "./RemoveLoan-BCXe6fgS.js";
import "./ChangeDetail-fLOFxcJy.js";
const TransaksiMantri = ({ datas, buku_rencana, auth, ...props }) => {
  const [flatData, setFlatData] = useState([]);
  const { server_filter } = usePage().props;
  useEffect(() => {
    setFlatData(datas.flat());
  }, [datas]);
  return /* @__PURE__ */ jsxs(MobileLayout, { header: /* @__PURE__ */ jsx(Head, { children: "Buku Transaksi" }), children: [
    /* @__PURE__ */ jsx("div", { className: "mb-3", children: /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold tracking-tight", children: "Buku Transaksi" }) }),
    /* @__PURE__ */ jsx(
      FilterBar,
      {
        urlLink: route("mobile_apps.transaksi"),
        storageKey: "mobile_apps.transaksi",
        showHari: true,
        showMonth: true,
        showKelompok: server_filter.userAuthorized.canShowKelompok
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "space-y-3", children: datas && datas.map((item, index) => /* @__PURE__ */ jsx(BukuTransaksiKepala, { datas: item }, index)) })
  ] });
};
export {
  TransaksiMantri as default
};
