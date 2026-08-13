import { jsxs, jsx } from "react/jsx-runtime";
import { useMemo, useState, useRef, useEffect } from "react";
import { usePage, router } from "@inertiajs/react";
import { I as Input } from "./input-BHD-__le.js";
import { L as Label } from "./label-F4MKz6SO.js";
import { L as Loading } from "./Loading-DPcVnbEk.js";
const HARI_OPTIONS = [
  { value: "senin", short: "Sen" },
  { value: "selasa", short: "Sel" },
  { value: "rabu", short: "Rab" },
  { value: "kamis", short: "Kam" },
  { value: "jumat", short: "Jum" },
  { value: "sabtu", short: "Sab" }
];
const KELOMPOK_OPTIONS = Array.from({ length: 10 }, (_, i) => i + 1);
const MONTH_PATTERN = /^\d{4}-\d{2}$/;
const FilterBar = ({
  urlLink,
  storageKey,
  showHari = true,
  showMonth = true,
  showKelompok = false,
  restoreOnMount = true,
  extraParams = {},
  children
}) => {
  const { server_filter } = usePage().props;
  const active = useMemo(
    () => ({
      hari: (server_filter == null ? void 0 : server_filter.hari) ?? "",
      month: (server_filter == null ? void 0 : server_filter.month) ?? "",
      kelompok: (server_filter == null ? void 0 : server_filter.kelompok) ?? ""
    }),
    [server_filter == null ? void 0 : server_filter.hari, server_filter == null ? void 0 : server_filter.month, server_filter == null ? void 0 : server_filter.kelompok]
  );
  const [local, setLocal] = useState(active);
  const [loading, setLoading] = useState(false);
  const restoredRef = useRef(false);
  const lsKey = storageKey ? `filter:${storageKey}` : null;
  const readSaved = () => {
    if (!lsKey) return null;
    try {
      const raw = localStorage.getItem(lsKey);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };
  const writeSaved = (value) => {
    if (!lsKey) return;
    try {
      localStorage.setItem(lsKey, JSON.stringify(value));
    } catch {
    }
  };
  const managedKeys = useMemo(() => {
    const keys = [];
    if (showHari) keys.push("hari");
    if (showMonth) keys.push("month");
    if (showKelompok) keys.push("kelompok");
    return keys;
  }, [showHari, showMonth, showKelompok]);
  const buildParams = (source) => {
    const params = { ...extraParams };
    managedKeys.forEach((key) => {
      if (source[key] !== "" && source[key] !== null && source[key] !== void 0) {
        params[key] = source[key];
      }
    });
    return params;
  };
  const go = (source, options = {}) => {
    router.get(urlLink, buildParams(source), {
      preserveScroll: true,
      onStart: () => setLoading(true),
      onFinish: () => setLoading(false),
      ...options
    });
  };
  const applyNow = (key, value) => {
    if (String(active[key] ?? "") === String(value ?? "")) return;
    const next = { ...local, [key]: value };
    setLocal(next);
    writeSaved(buildParams(next));
    go(next);
  };
  useEffect(() => {
    if (!restoreOnMount || restoredRef.current || !lsKey) return;
    restoredRef.current = true;
    const search = new URLSearchParams(window.location.search);
    if (managedKeys.some((key) => search.has(key))) return;
    const saved = readSaved();
    if (!saved) return;
    const berbeda = managedKeys.some(
      (key) => String(saved[key] ?? "") !== String(active[key] ?? "")
    );
    if (!berbeda) return;
    go(saved, { replace: true });
  }, []);
  useEffect(() => {
    setLocal(active);
  }, [active]);
  return /* @__PURE__ */ jsxs("div", { className: "mb-3 border rounded-lg bg-card", children: [
    /* @__PURE__ */ jsx(Loading, { show: loading }),
    showHari && /* @__PURE__ */ jsxs("div", { className: "px-3 pt-3", children: [
      /* @__PURE__ */ jsx(Label, { className: "text-[11px] uppercase tracking-wide text-muted-foreground", children: "Hari" }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-6 gap-1 mt-1", children: HARI_OPTIONS.map((opt) => {
        const dipilih = local.hari === opt.value;
        return /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            disabled: loading,
            onClick: () => applyNow("hari", opt.value),
            "aria-pressed": dipilih,
            className: [
              "rounded-md border py-2 text-xs font-medium transition-colors",
              "disabled:opacity-60",
              dipilih ? "border-primary bg-primary text-primary-foreground" : "border-input bg-background text-foreground hover:bg-accent"
            ].join(" "),
            children: opt.short
          },
          opt.value
        );
      }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-end gap-2 px-3 pt-3", children: [
      showMonth && /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-36", children: [
        /* @__PURE__ */ jsx(Label, { className: "text-[11px] uppercase tracking-wide text-muted-foreground", children: "Bulan" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            type: "month",
            name: "month",
            className: "h-9 mt-1",
            disabled: loading,
            value: local.month ?? "",
            onChange: (e) => {
              const value = e.target.value;
              setLocal((prev) => ({ ...prev, month: value }));
              if (MONTH_PATTERN.test(value)) applyNow("month", value);
            }
          }
        )
      ] }),
      showKelompok && /* @__PURE__ */ jsxs("div", { className: "w-28", children: [
        /* @__PURE__ */ jsx(Label, { className: "text-[11px] uppercase tracking-wide text-muted-foreground", children: "Kelompok" }),
        /* @__PURE__ */ jsx(
          "select",
          {
            name: "kelompok",
            disabled: loading,
            value: local.kelompok ?? "",
            onChange: (e) => applyNow("kelompok", e.target.value),
            className: "flex items-center justify-between w-full h-9 mt-1 px-3 py-2 text-sm bg-transparent border rounded-md shadow-xs border-input focus:outline-hidden focus:ring-1 focus:ring-ring disabled:opacity-60",
            children: KELOMPOK_OPTIONS.map((k) => /* @__PURE__ */ jsx("option", { value: k, children: k }, k))
          }
        )
      ] }),
      children
    ] }),
    /* @__PURE__ */ jsx("div", { className: "pb-3" })
  ] });
};
export {
  FilterBar as F
};
