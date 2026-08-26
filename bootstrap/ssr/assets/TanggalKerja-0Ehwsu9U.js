import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from "react";
import dayjs from "dayjs";
import { u as useHariLibur } from "./useHariLibur-Da-oW-is.js";
import { CalendarIcon, CalendarOff } from "lucide-react";
import { c as cn } from "./utils-DzFuPzol.js";
import { B as Button } from "./button-MTjEwktD.js";
import { C as Calendar } from "./calendar-BJ3LWb_A.js";
import { P as Popover, a as PopoverTrigger, b as PopoverContent } from "./popover-B9xSK2Gy.js";
const NAMA_BULAN = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember"
];
const HARI_KE_ANGKA = {
  minggu: 0,
  senin: 1,
  selasa: 2,
  rabu: 3,
  kamis: 4,
  jumat: 5,
  sabtu: 6
};
const NAMA_HARI = [
  "minggu",
  "senin",
  "selasa",
  "rabu",
  "kamis",
  "jumat",
  "sabtu"
];
const TanggalKerja = ({
  name = "date",
  value,
  onChange,
  min,
  max,
  disabled = false,
  required = false,
  placeholder = "Pilih tanggal",
  /**
   * Kunci ke satu hari tagih. Boleh nama ("sabtu") atau angka dayjs 0-6.
   * Angka lebih aman dipakai pemanggil: nama hari bergantung locale dayjs yang
   * belum tentu terpasang, dan kalau meleset penguncian harinya diam-diam mati.
   * Kosong = hari kerja apa saja.
   */
  hariTagih = null,
  className
}) => {
  const [buka, setBuka] = useState(false);
  const terpilih = value ? dayjs(value).toDate() : null;
  const [bulanTampil, setBulanTampil] = useState(
    terpilih ?? (min ? dayjs(min).toDate() : /* @__PURE__ */ new Date())
  );
  const { libur, tahun, alasanLibur, hariKerja } = useHariLibur(bulanTampil);
  useEffect(() => {
    if (value) setBulanTampil(dayjs(value).toDate());
  }, [value]);
  const hariTagihAngka = hariTagih === null || hariTagih === void 0 || hariTagih === "" ? null : typeof hariTagih === "number" ? hariTagih : HARI_KE_ANGKA[String(hariTagih).toLowerCase()] ?? null;
  const tidakBoleh = (tgl) => {
    const d = dayjs(tgl);
    if (min && d.isBefore(dayjs(min), "day")) return true;
    if (max && d.isAfter(dayjs(max), "day")) return true;
    if (hariTagihAngka !== null && tgl.getDay() !== hariTagihAngka) return true;
    return !hariKerja(tgl);
  };
  const pilih = (tgl) => {
    if (!tgl || tidakBoleh(tgl)) return;
    onChange({ target: { name, value: dayjs(tgl).format("YYYY-MM-DD") } });
    setBuka(false);
  };
  const tanggalLibur = useMemo(
    () => Object.keys(libur).map((t) => dayjs(t).toDate()),
    [libur]
  );
  const alasanTerpilih = terpilih ? alasanLibur(terpilih) : null;
  return /* @__PURE__ */ jsxs("div", { className, children: [
    /* @__PURE__ */ jsxs(Popover, { open: buka, onOpenChange: disabled ? void 0 : setBuka, children: [
      /* @__PURE__ */ jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
        Button,
        {
          type: "button",
          variant: "outline",
          disabled,
          className: cn(
            "w-full justify-between font-normal",
            !value && "text-muted-foreground"
          ),
          children: [
            value ? dayjs(value).format("DD MMMM YYYY") : /* @__PURE__ */ jsx("span", { children: placeholder }),
            /* @__PURE__ */ jsx(CalendarIcon, { className: "w-4 h-4 opacity-60" })
          ]
        }
      ) }),
      /* @__PURE__ */ jsxs(PopoverContent, { className: "w-auto p-0", align: "start", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 px-3 pt-3", children: [
          /* @__PURE__ */ jsx(
            "select",
            {
              className: "flex-1 px-2 py-1 text-sm border rounded-md bg-background",
              value: dayjs(bulanTampil).month(),
              onChange: (e) => setBulanTampil(
                dayjs(bulanTampil).month(Number(e.target.value)).toDate()
              ),
              children: NAMA_BULAN.map((b, i) => /* @__PURE__ */ jsx("option", { value: i, children: b }, b))
            }
          ),
          /* @__PURE__ */ jsx(
            "select",
            {
              className: "px-2 py-1 text-sm border rounded-md bg-background tabular-nums",
              value: dayjs(bulanTampil).year(),
              onChange: (e) => setBulanTampil(
                dayjs(bulanTampil).year(Number(e.target.value)).toDate()
              ),
              children: Array.from(
                { length: tahun.maks - tahun.min + 1 },
                (_, i) => tahun.min + i
              ).map((t) => /* @__PURE__ */ jsx("option", { value: t, children: t }, t))
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          Calendar,
          {
            mode: "single",
            selected: terpilih ?? void 0,
            onSelect: pilih,
            month: bulanTampil,
            onMonthChange: setBulanTampil,
            disabled: tidakBoleh,
            modifiers: { libur: tanggalLibur },
            modifiersClassNames: {
              libur: "text-red-600 line-through opacity-70"
            }
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "px-3 pt-1 pb-3 space-y-1 text-xs border-t text-muted-foreground", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 pt-2", children: [
            /* @__PURE__ */ jsx(CalendarOff, { className: "w-3 h-3 text-red-600" }),
            /* @__PURE__ */ jsx("span", { children: "Tanggal bercoret = hari libur, tidak bisa dipilih" })
          ] }),
          hariTagihAngka !== null && /* @__PURE__ */ jsxs("div", { children: [
            "Hanya hari",
            " ",
            /* @__PURE__ */ jsx("b", { className: "capitalize", children: NAMA_HARI[hariTagihAngka] }),
            " — hari tagih kelompok tidak berubah"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      "input",
      {
        type: "hidden",
        name,
        value: value ?? "",
        required,
        readOnly: true
      }
    ),
    alasanTerpilih && /* @__PURE__ */ jsxs("p", { className: "mt-1 text-xs text-red-600", children: [
      "Tanggal ini libur (",
      alasanTerpilih,
      ") — pilih tanggal lain."
    ] })
  ] });
};
export {
  TanggalKerja as T
};
