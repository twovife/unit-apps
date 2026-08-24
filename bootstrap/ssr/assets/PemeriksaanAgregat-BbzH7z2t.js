import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { A as Authenticated } from "./AuthenticatedLayout-Lk4S3jcr.js";
import "react";
import { Head, router } from "@inertiajs/react";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-Dwx5kZ1B.js";
import { I as Input } from "./input-BHD-__le.js";
import { B as Button } from "./button-MTjEwktD.js";
import { RefreshCw, ShieldCheck, ShieldAlert } from "lucide-react";
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
import "./dialog-8a8NNlps.js";
import "./popover-B9xSK2Gy.js";
import "@radix-ui/react-popover";
import "sweetalert2";
import "sweetalert2-react-content";
import "./Loading-DPcVnbEk.js";
import "react-dom";
import "@headlessui/react";
const rupiah = (n) => new Intl.NumberFormat("id-ID").format(n ?? 0);
const Kartu = ({ judul, utama, bawah, nada = "netral" }) => /* @__PURE__ */ jsxs(
  "div",
  {
    className: `rounded-lg border p-4 ${{
      netral: "border-slate-200 bg-white",
      baik: "border-emerald-200 bg-emerald-50/40",
      ingat: "border-amber-300 bg-amber-50/60",
      buruk: "border-red-300 bg-red-50/60"
    }[nada]}`,
    children: [
      /* @__PURE__ */ jsx("div", { className: "text-xs font-medium tracking-wide uppercase text-slate-500", children: judul }),
      /* @__PURE__ */ jsx("div", { className: "mt-1 text-2xl font-semibold tabular-nums text-slate-900", children: utama }),
      bawah && /* @__PURE__ */ jsx("div", { className: "mt-0.5 text-xs text-slate-500", children: bawah })
    ]
  }
);
const PemeriksaanAgregat = ({ hasil, server_filter }) => {
  var _a;
  const bersih = !(hasil == null ? void 0 : hasil.beda_terkunci) && !(hasil == null ? void 0 : hasil.beda_bulanan);
  const adaBaris = ((hasil == null ? void 0 : hasil.baris) ?? 0) > 0;
  const periksaUlang = (periode) => router.get(
    route("migrasi.pemeriksaan"),
    { periode: periode ?? (server_filter == null ? void 0 : server_filter.periode) },
    { preserveScroll: true }
  );
  return /* @__PURE__ */ jsxs(Authenticated, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Pemeriksaan Agregat" }),
    /* @__PURE__ */ jsxs("div", { className: "p-4 space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-end justify-between gap-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("h1", { className: "text-lg font-semibold text-slate-900", children: [
            "Pemeriksaan Agregat — ",
            server_filter == null ? void 0 : server_filter.unit
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "max-w-3xl mt-1 text-sm text-slate-600", children: [
            "Menghitung ulang dari angsuran dan pinjaman, lalu membandingkannya dengan angka yang tersimpan. Ini satu-satunya cara",
            " ",
            /* @__PURE__ */ jsx("b", { children: "membuktikan" }),
            " — bukan menganggap — bahwa agregat masih cocok dengan detail inputannya."
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-end gap-2", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block mb-1 text-xs font-medium text-slate-600", children: "Periode" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                type: "month",
                className: "w-40",
                defaultValue: dayjs(server_filter == null ? void 0 : server_filter.periode).format("YYYY-MM"),
                onChange: (e) => periksaUlang(`${e.target.value}-01`)
              }
            )
          ] }),
          /* @__PURE__ */ jsxs(Button, { variant: "secondary", onClick: () => periksaUlang(), children: [
            /* @__PURE__ */ jsx(RefreshCw, { className: "size-4" }),
            " Periksa ulang"
          ] })
        ] })
      ] }),
      !(server_filter == null ? void 0 : server_filter.sudah_migrasi) && /* @__PURE__ */ jsxs("div", { className: "p-3 text-xs border rounded-lg border-amber-300 bg-amber-50 text-amber-900", children: [
        /* @__PURE__ */ jsx("b", { children: "Kantor ini belum migrasi." }),
        " Belum ada agregat baru yang perlu diperiksa — angka yang berlaku masih dari rekap lama."
      ] }),
      adaBaris && /* @__PURE__ */ jsxs(
        "div",
        {
          className: `flex items-start gap-3 rounded-lg border p-4 ${bersih ? "border-emerald-300 bg-emerald-50 text-emerald-900" : "border-red-300 bg-red-50 text-red-900"}`,
          children: [
            bersih ? /* @__PURE__ */ jsx(ShieldCheck, { className: "mt-0.5 size-5 shrink-0" }) : /* @__PURE__ */ jsx(ShieldAlert, { className: "mt-0.5 size-5 shrink-0" }),
            /* @__PURE__ */ jsx("div", { className: "text-sm", children: bersih ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("b", { children: "Bersih." }),
              " Seluruh angka yang sudah dikunci cocok dengan sumbernya."
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("b", { children: "Ada yang tidak cocok." }),
              " Rinciannya di bawah."
            ] }) })
          ]
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4", children: [
        /* @__PURE__ */ jsx(
          Kartu,
          {
            judul: "Baris diperiksa",
            utama: (hasil == null ? void 0 : hasil.baris) ?? 0,
            bawah: `${(hasil == null ? void 0 : hasil.terkunci) ?? 0} sudah dikunci`
          }
        ),
        /* @__PURE__ */ jsx(
          Kartu,
          {
            judul: "Hari terkunci meleset",
            utama: (hasil == null ? void 0 : hasil.beda_terkunci) ?? 0,
            bawah: "angka bertanda tangan vs sumbernya",
            nada: (hasil == null ? void 0 : hasil.beda_terkunci) ? "buruk" : "baik"
          }
        ),
        /* @__PURE__ */ jsx(
          Kartu,
          {
            judul: "Bulanan meleset",
            utama: (hasil == null ? void 0 : hasil.beda_bulanan) ?? 0,
            bawah: "bulanan vs jumlah hariannya",
            nada: (hasil == null ? void 0 : hasil.beda_bulanan) ? "ingat" : "baik"
          }
        ),
        /* @__PURE__ */ jsx(
          Kartu,
          {
            judul: "Belum ditetapkan",
            utama: (hasil == null ? void 0 : hasil.belum_final) ?? 0,
            bawah: "wajar — belum dikunci"
          }
        )
      ] }),
      (hasil == null ? void 0 : hasil.beda_terkunci) > 0 && /* @__PURE__ */ jsxs("div", { className: "p-3 text-xs border rounded-lg border-red-300 bg-red-50 text-red-800", children: [
        /* @__PURE__ */ jsx("b", { children: "Hari yang sudah dikunci semestinya mustahil berubah" }),
        " — trigger database menolak perubahan sumbernya. Kalau tetap meleset, berarti kuncinya pernah dibuka lalu sumbernya diubah tanpa hitung ulang, atau angka tersimpannya ditulis salah sejak awal."
      ] }),
      (hasil == null ? void 0 : hasil.beda_bulanan) > 0 && (hasil == null ? void 0 : hasil.beda_terkunci) === 0 && /* @__PURE__ */ jsx("div", { className: "p-3 text-xs border rounded-lg border-amber-300 bg-amber-50 text-amber-900", children: "Ada hari yang berubah setelah baris bulanannya disusun. Biasanya hilang sendiri begitu salah satu hari di bulan itu dikunci ulang." }),
      ((_a = hasil == null ? void 0 : hasil.rincian) == null ? void 0 : _a.length) > 0 && /* @__PURE__ */ jsx("div", { className: "overflow-x-auto bg-white border rounded-lg", children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { children: "Kelompok" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Tanggal" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Kolom" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Tersimpan" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Seharusnya" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Selisih" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: hasil.rincian.map((r, i) => /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: r.kelompok }),
          /* @__PURE__ */ jsx(TableCell, { className: "tabular-nums", children: dayjs(r.tanggal).format("DD MMM") }),
          /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs", children: r.kolom }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-right tabular-nums", children: rupiah(r.tersimpan) }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-right tabular-nums", children: rupiah(r.harusnya) }),
          /* @__PURE__ */ jsx(TableCell, { className: "font-medium text-right text-red-600 tabular-nums", children: rupiah(r.tersimpan - r.harusnya) })
        ] }, i)) })
      ] }) }),
      !adaBaris && (server_filter == null ? void 0 : server_filter.sudah_migrasi) && /* @__PURE__ */ jsx("div", { className: "p-8 text-sm text-center bg-white border rounded-lg text-slate-500", children: "Belum ada baris agregat untuk periode ini." }),
      /* @__PURE__ */ jsxs("div", { className: "p-3 text-xs border rounded-lg border-slate-200 bg-slate-50 text-slate-600", children: [
        /* @__PURE__ */ jsx("b", { children: 'Tidak ada tombol "perbaiki", dan itu disengaja.' }),
        " Memperbaiki diam-diam menghapus buktinya, dan pemeriksaan yang menyembuhkan dirinya sendiri tidak pernah melaporkan bahwa ada yang salah. Kalau angka terkunci meleset, yang benar adalah membuka kuncinya lewat jalur resmi — beralasan dan tercatat — lalu menguncinya ulang."
      ] })
    ] })
  ] });
};
export {
  PemeriksaanAgregat as default
};
