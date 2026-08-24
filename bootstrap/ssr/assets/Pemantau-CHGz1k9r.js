import { jsxs, jsx } from "react/jsx-runtime";
import { A as Authenticated } from "./AuthenticatedLayout-Lk4S3jcr.js";
import { useState } from "react";
import { Head } from "@inertiajs/react";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-Dwx5kZ1B.js";
import { I as Input } from "./input-BHD-__le.js";
import dayjs from "dayjs";
import "./command-int9mZp7.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-DzFuPzol.js";
import "clsx";
import "tailwind-merge";
import "./button-MTjEwktD.js";
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
const STATUS = {
  menyeberang: {
    label: "Sudah menyeberang",
    kelas: "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
  },
  siap: {
    label: "Sudah tutup buku, belum menyeberang",
    kelas: "bg-red-50 text-red-700 ring-red-600/20"
  },
  belum_tutup_buku: {
    label: "Belum tutup buku",
    kelas: "bg-amber-50 text-amber-800 ring-amber-600/30"
  }
};
const Lencana = ({ status }) => {
  const s = STATUS[status] ?? STATUS.belum_tutup_buku;
  return /* @__PURE__ */ jsx(
    "span",
    {
      className: `inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${s.kelas}`,
      children: s.label
    }
  );
};
const Kartu = ({ judul, utama, bawah, nada }) => /* @__PURE__ */ jsxs(
  "div",
  {
    className: `rounded-lg border p-4 ${nada === "baik" ? "border-emerald-200 bg-emerald-50/40" : nada === "buruk" ? "border-red-300 bg-red-50/60" : "border-slate-200 bg-white"}`,
    children: [
      /* @__PURE__ */ jsx("div", { className: "text-xs font-medium tracking-wide uppercase text-slate-500", children: judul }),
      /* @__PURE__ */ jsx("div", { className: "mt-1 text-2xl font-semibold tabular-nums text-slate-900", children: utama }),
      bawah && /* @__PURE__ */ jsx("div", { className: "mt-0.5 text-xs text-slate-500", children: bawah })
    ]
  }
);
const Pemantau = ({ datas = [], ringkasan }) => {
  const [cari, setCari] = useState("");
  const [saring, setSaring] = useState("semua");
  const tersaring = datas.filter((d) => {
    const cocokCari = !cari || d.unit.toLowerCase().includes(cari.toLowerCase());
    const cocokStatus = saring === "semua" || d.status === saring;
    return cocokCari && cocokStatus;
  });
  const persen = (ringkasan == null ? void 0 : ringkasan.total) ? Math.round(ringkasan.menyeberang / ringkasan.total * 100) : 0;
  return /* @__PURE__ */ jsxs(Authenticated, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Pemantau Migrasi" }),
    /* @__PURE__ */ jsxs("div", { className: "p-4 space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-lg font-semibold text-slate-900", children: "Pemantau Migrasi" }),
        /* @__PURE__ */ jsxs("p", { className: "max-w-3xl mt-1 text-sm text-slate-600", children: [
          "Kantor menyeberang ke alur baru dengan ",
          /* @__PURE__ */ jsx("b", { children: "menutup buku" }),
          " bulan sebelumnya. Yang perlu dilihat bukan cuma sudah atau belum, melainkan apa yang kurang."
        ] })
      ] }),
      !(ringkasan == null ? void 0 : ringkasan.bulan_migrasi) && /* @__PURE__ */ jsxs("div", { className: "p-3 text-xs border rounded-lg border-amber-300 bg-amber-50 text-amber-900", children: [
        /* @__PURE__ */ jsx("b", { children: "Bulan migrasi belum ditetapkan." }),
        " Selama",
        " ",
        /* @__PURE__ */ jsx("code", { children: "AGREGASI_BULAN_MIGRASI" }),
        " kosong, tutup buku berjalan seperti biasa dan tidak ada kantor yang berpindah."
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4", children: [
        /* @__PURE__ */ jsx(
          Kartu,
          {
            judul: "Bulan migrasi",
            utama: (ringkasan == null ? void 0 : ringkasan.bulan_migrasi) ? dayjs(`${ringkasan.bulan_migrasi}-01`).format("MMM YYYY") : "—",
            bawah: "dari AGREGASI_BULAN_MIGRASI"
          }
        ),
        /* @__PURE__ */ jsx(
          Kartu,
          {
            judul: "Sudah menyeberang",
            utama: `${(ringkasan == null ? void 0 : ringkasan.menyeberang) ?? 0} / ${(ringkasan == null ? void 0 : ringkasan.total) ?? 0}`,
            bawah: `${persen}% dari seluruh kantor`,
            nada: "baik"
          }
        ),
        /* @__PURE__ */ jsx(
          Kartu,
          {
            judul: "Belum tutup buku",
            utama: (ringkasan == null ? void 0 : ringkasan.belum_tutup_buku) ?? 0,
            bawah: "dikejar tutup bukunya"
          }
        ),
        /* @__PURE__ */ jsx(
          Kartu,
          {
            judul: "Perlu diperiksa",
            utama: (ringkasan == null ? void 0 : ringkasan.siap) ?? 0,
            bawah: "sudah tutup buku tapi belum menyeberang",
            nada: (ringkasan == null ? void 0 : ringkasan.siap) ? "buruk" : void 0
          }
        )
      ] }),
      (ringkasan == null ? void 0 : ringkasan.siap) > 0 && /* @__PURE__ */ jsxs("div", { className: "p-3 text-xs border rounded-lg border-red-300 bg-red-50 text-red-800", children: [
        /* @__PURE__ */ jsxs("b", { children: [
          ringkasan.siap,
          " kantor sudah menutup buku tapi belum menyeberang."
        ] }),
        " ",
        "Pendaftarannya semestinya jalan otomatis, jadi ini bukan sekadar belum dikerjakan — ada yang gagal. Periksa log dengan kata kunci",
        /* @__PURE__ */ jsx("code", { className: "mx-1", children: "Pendaftaran migrasi gagal" }),
        "."
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-end gap-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block mb-1 text-xs font-medium text-slate-600", children: "Cari kantor" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              className: "w-56",
              placeholder: "nama unit...",
              value: cari,
              onChange: (e) => setCari(e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex gap-1", children: [
          ["semua", "Semua"],
          ["menyeberang", "Menyeberang"],
          ["belum_tutup_buku", "Belum tutup buku"],
          ["siap", "Perlu diperiksa"]
        ].map(([nilai, label]) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setSaring(nilai),
            className: `rounded-md border px-2.5 py-1.5 text-xs font-medium ${saring === nilai ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 bg-white text-slate-700"}`,
            children: label
          },
          nilai
        )) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto bg-white border rounded-lg", children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { children: "Wil" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Kantor" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Status" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Mulai" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Kelompok tutup buku" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Baris closing" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Terkunci" })
        ] }) }),
        /* @__PURE__ */ jsxs(TableBody, { children: [
          tersaring.length === 0 && /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(
            TableCell,
            {
              colSpan: 7,
              className: "py-8 text-center text-slate-500",
              children: "Tidak ada kantor yang cocok."
            }
          ) }),
          tersaring.map((d) => /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableCell, { className: "tabular-nums text-slate-500", children: d.wilayah }),
            /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: d.unit }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Lencana, { status: d.status }) }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-xs tabular-nums", children: d.mulai ? dayjs(d.mulai).format("DD MMM YYYY") : "—" }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-right tabular-nums", children: d.kelompok_tutup_buku || "—" }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-right tabular-nums", children: d.baris_closing || "—" }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-right tabular-nums", children: d.terkunci || "—" })
          ] }, d.branch_id))
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "p-3 text-xs border rounded-lg border-slate-200 bg-slate-50 text-slate-600", children: [
        /* @__PURE__ */ jsx("b", { children: "Membaca kolomnya." }),
        " ",
        /* @__PURE__ */ jsx("i", { children: "Kelompok tutup buku" }),
        " menghitung baris sirkulasi yang lahir untuk bulan migrasi — barisnya hanya ada kalau seseorang benar-benar menutup buku, jadi angka nol berarti kantornya memang belum mulai. ",
        /* @__PURE__ */ jsx("i", { children: "Baris closing" }),
        " dan ",
        /* @__PURE__ */ jsx("i", { children: "terkunci" }),
        " ",
        "menunjukkan seberapa jauh kantor yang sudah menyeberang berjalan di alur baru."
      ] })
    ] })
  ] });
};
export {
  Pemantau as default
};
