import { jsxs, jsx } from "react/jsx-runtime";
import { A as Authenticated } from "./AuthenticatedLayout-BpUiURcU.js";
import { useState } from "react";
import { usePage, useForm, Head, router } from "@inertiajs/react";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-Dwx5kZ1B.js";
import { I as Input } from "./input-BHD-__le.js";
import { B as Button } from "./button-MTjEwktD.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-8a8NNlps.js";
import { Lock, LockOpen, Check } from "lucide-react";
import dayjs from "dayjs";
import "./command-int9mZp7.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-DzFuPzol.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-separator";
import "@radix-ui/react-dialog";
import "@radix-ui/react-icons";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-dropdown-menu";
import "cmdk";
import "./popover-B9xSK2Gy.js";
import "@radix-ui/react-popover";
import "sweetalert2";
import "sweetalert2-react-content";
import "./Loading-DPcVnbEk.js";
import "react-dom";
import "@headlessui/react";
const rupiah = (n) => n === null || n === void 0 ? "—" : new Intl.NumberFormat("id-ID").format(n);
const BarisKelompok = ({ d, bolehBuka, onBuka }) => {
  const { data, setData, put, processing } = useForm({
    kasbon: d.kasbon,
    transport: d.transport,
    keluar: d.keluar,
    setoran_mantri: d.setoran_mantri ?? ""
  });
  const simpan = () => put(route("closing.simpan_manual", d.id), {
    preserveScroll: true,
    // string kosong -> null: "belum dicatat" berbeda dari "nol"
    transform: (x) => ({
      ...x,
      setoran_mantri: x.setoran_mantri === "" ? null : x.setoran_mantri
    })
  });
  const aksi = (nama) => router.post(route(nama, d.id), {}, { preserveScroll: true });
  const beku = d.terkunci;
  return /* @__PURE__ */ jsxs(TableRow, { className: beku ? "bg-slate-50" : "", children: [
    /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: d.kelompok }),
    /* @__PURE__ */ jsx(TableCell, { className: "text-right tabular-nums", children: rupiah(d.drop) }),
    /* @__PURE__ */ jsx(TableCell, { className: "text-right tabular-nums", children: rupiah(d.storting) }),
    ["kasbon", "transport", "keluar", "setoran_mantri"].map((k) => /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(
      Input,
      {
        type: "number",
        disabled: beku,
        className: "w-28 text-right tabular-nums",
        placeholder: k === "setoran_mantri" ? "belum" : "0",
        value: data[k],
        onChange: (e) => setData(k, e.target.value),
        onBlur: () => !beku && simpan()
      }
    ) }, k)),
    /* @__PURE__ */ jsx(TableCell, { className: "text-right tabular-nums", children: rupiah(d.tunai) }),
    /* @__PURE__ */ jsx(
      TableCell,
      {
        className: `text-right font-medium tabular-nums ${d.selisih ? "text-red-600" : "text-slate-500"}`,
        children: rupiah(d.selisih)
      }
    ),
    /* @__PURE__ */ jsxs(TableCell, { children: [
      beku ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 rounded-md bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-700", children: [
          /* @__PURE__ */ jsx(Lock, { className: "size-3" }),
          " Terkunci"
        ] }),
        bolehBuka && /* @__PURE__ */ jsx(Button, { size: "xs", variant: "ghost", onClick: () => onBuka(d), children: /* @__PURE__ */ jsx(LockOpen, { className: "size-3.5" }) })
      ] }) : /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-1.5", children: [
        !d.kepala_approval_at ? /* @__PURE__ */ jsx(
          Button,
          {
            size: "xs",
            variant: "secondary",
            disabled: processing,
            onClick: () => aksi("closing.approve_kepala"),
            children: "Approve kepala"
          }
        ) : /* @__PURE__ */ jsxs(
          "span",
          {
            className: "inline-flex items-center gap-1 text-xs text-emerald-700",
            title: `oleh ${d.kepala_nama ?? "-"} · ${d.kepala_approval_at}`,
            children: [
              /* @__PURE__ */ jsx(Check, { className: "size-3.5" }),
              " kepala"
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            size: "xs",
            variant: "blue",
            disabled: processing || d.halangan.length > 0,
            title: d.halangan.join(" "),
            onClick: () => aksi("closing.kunci"),
            children: "Kunci"
          }
        )
      ] }),
      !beku && d.halangan.length > 0 && /* @__PURE__ */ jsx("div", { className: "mt-1 text-[11px] leading-tight text-amber-700", children: d.halangan.join(" ") })
    ] })
  ] });
};
const Harian = ({ datas = [], tertinggal = [], server_filter }) => {
  const { errors } = usePage().props;
  const [bukaUntuk, setBukaUntuk] = useState(null);
  const formBuka = useForm({ alasan: "" });
  const gantiTanggal = (nilai) => nilai && router.get(
    route("closing.harian"),
    { tanggal: nilai },
    { preserveState: true, preserveScroll: true }
  );
  const kirimBuka = (e) => {
    e.preventDefault();
    formBuka.post(route("closing.buka", bukaUntuk.id), {
      preserveScroll: true,
      onSuccess: () => {
        formBuka.reset();
        setBukaUntuk(null);
      }
    });
  };
  return /* @__PURE__ */ jsxs(Authenticated, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Closing Harian" }),
    /* @__PURE__ */ jsxs("div", { className: "p-4 space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-end justify-between gap-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("h1", { className: "text-lg font-semibold text-slate-900", children: [
            "Closing Harian — ",
            server_filter == null ? void 0 : server_filter.unit
          ] }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-slate-600", children: "Urutannya: kepala menyetujui → kasir mencatat setoran mantri → kasir mengunci. Hari sebelumnya harus terkunci lebih dulu." })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block mb-1 text-xs font-medium text-slate-600", children: "Tanggal" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              type: "date",
              className: "w-44",
              defaultValue: server_filter == null ? void 0 : server_filter.tanggal,
              onChange: (e) => gantiTanggal(e.target.value)
            }
          )
        ] })
      ] }),
      !(server_filter == null ? void 0 : server_filter.sudah_migrasi) && /* @__PURE__ */ jsxs("div", { className: "p-3 text-xs border rounded-lg border-amber-300 bg-amber-50 text-amber-900", children: [
        /* @__PURE__ */ jsx("b", { children: "Kantor ini belum ditandai migrasi." }),
        " Layar ini bisa dipakai untuk uji coba, tapi angka yang dikunci di sini belum menggantikan rekap lama — kedua alur masih berjalan sendiri-sendiri."
      ] }),
      (errors == null ? void 0 : errors[0]) && /* @__PURE__ */ jsx("div", { className: "p-3 text-sm border rounded-lg border-red-300 bg-red-50 text-red-800", children: errors[0] }),
      tertinggal.length > 0 && /* @__PURE__ */ jsxs("div", { className: "p-3 border rounded-lg border-slate-200 bg-slate-50", children: [
        /* @__PURE__ */ jsx("div", { className: "mb-1 text-xs font-semibold tracking-wide uppercase text-slate-500", children: "Hari terlama yang belum dikunci" }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: tertinggal.map((t) => /* @__PURE__ */ jsxs(
          "span",
          {
            className: "rounded-md border border-slate-300 bg-white px-2 py-0.5 text-xs text-slate-700",
            children: [
              "kel ",
              t.kelompok,
              ": ",
              /* @__PURE__ */ jsx("b", { children: dayjs(t.terlama).format("DD MMM") }),
              " ",
              /* @__PURE__ */ jsxs("span", { className: "text-slate-400", children: [
                "(",
                t.jumlah,
                " hari)"
              ] })
            ]
          },
          t.kelompok
        )) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto bg-white border rounded-lg", children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { children: "Kel" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Drop" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Storting" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Kasbon" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Transport" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Keluar" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Setoran mantri" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Tunai" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Selisih" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Aksi" })
        ] }) }),
        /* @__PURE__ */ jsxs(TableBody, { children: [
          datas.length === 0 && /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(
            TableCell,
            {
              colSpan: 10,
              className: "py-8 text-center text-slate-500",
              children: "Tidak ada kelompok di kantor ini."
            }
          ) }),
          datas.map(
            (d) => d.ada_baris ? /* @__PURE__ */ jsx(
              BarisKelompok,
              {
                d,
                bolehBuka: server_filter == null ? void 0 : server_filter.boleh_buka,
                onBuka: setBukaUntuk
              },
              d.grouping_id
            ) : /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: d.kelompok }),
              /* @__PURE__ */ jsxs(TableCell, { colSpan: 9, className: "text-xs text-amber-700", children: [
                "Baris hari ini belum dibangkitkan — jalankan",
                /* @__PURE__ */ jsx("code", { className: "mx-1", children: "closing:generate" }),
                "untuk periode ini."
              ] })
            ] }, d.grouping_id)
          )
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "p-3 text-xs border rounded-lg border-slate-200 bg-slate-50 text-slate-600", children: [
        /* @__PURE__ */ jsx("b", { children: "Drop dan storting tidak bisa diketik." }),
        " Keduanya dihitung dari angsuran dan pinjaman, jadi selalu bisa diperiksa ulang ke sumbernya. Yang diisi manusia hanya kasbon, transport, keluar, dan setoran mantri — dan ",
        /* @__PURE__ */ jsx("b", { children: "selisih" }),
        " di kolom terakhir adalah jarak antara uang yang benar-benar diserahkan mantri dengan tunai hasil rumus."
      ] })
    ] }),
    /* @__PURE__ */ jsx(Dialog, { open: !!bukaUntuk, onOpenChange: (o) => !o && setBukaUntuk(null), children: /* @__PURE__ */ jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsxs(DialogTitle, { children: [
        "Buka kunci kelompok ",
        bukaUntuk == null ? void 0 : bukaUntuk.kelompok
      ] }) }),
      /* @__PURE__ */ jsxs("form", { onSubmit: kirimBuka, className: "space-y-3", children: [
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-slate-600", children: [
          "Tunai yang tercatat saat dikunci adalah",
          " ",
          /* @__PURE__ */ jsx("b", { children: rupiah(bukaUntuk == null ? void 0 : bukaUntuk.tunai) }),
          ". Angka itu disimpan di jejak sebelum kunci dibuka — setelah inputnya berubah, dia tidak bisa ditemukan lagi dari mana pun."
        ] }),
        /* @__PURE__ */ jsx(
          Input,
          {
            autoFocus: true,
            placeholder: "Alasan membuka kunci",
            value: formBuka.data.alasan,
            onChange: (e) => formBuka.setData("alasan", e.target.value)
          }
        ),
        formBuka.errors.alasan && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-600", children: formBuka.errors.alasan }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              type: "button",
              variant: "ghost",
              onClick: () => setBukaUntuk(null),
              children: "Batal"
            }
          ),
          /* @__PURE__ */ jsx(Button, { type: "submit", disabled: formBuka.processing, children: "Buka kunci" })
        ] })
      ] })
    ] }) })
  ] });
};
export {
  Harian as default
};
