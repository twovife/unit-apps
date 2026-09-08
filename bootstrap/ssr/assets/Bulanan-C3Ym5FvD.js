import { jsxs, jsx } from "react/jsx-runtime";
import { A as Authenticated } from "./AuthenticatedLayout-CLVnpQ7Y.js";
import "react";
import { Head, router } from "@inertiajs/react";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-Dwx5kZ1B.js";
import { B as Button } from "./button-MTjEwktD.js";
import { ChevronLeft, ChevronRight, Lock, Check, LockOpen } from "lucide-react";
import "./command-int9mZp7.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-DzFuPzol.js";
import "clsx";
import "tailwind-merge";
import "dayjs";
import "./input-BHD-__le.js";
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
const rupiah = (n) => n === null || n === void 0 ? "—" : new Intl.NumberFormat("id-ID").format(n);
const Kartu = ({ judul, utama, bawah, nada = "netral" }) => /* @__PURE__ */ jsxs(
  "div",
  {
    className: `rounded-lg border p-4 ${{
      netral: "border-slate-200 bg-white",
      baik: "border-emerald-200 bg-emerald-50/40",
      ingat: "border-amber-300 bg-amber-50/60"
    }[nada]}`,
    children: [
      /* @__PURE__ */ jsx("div", { className: "text-xs font-medium tracking-wide uppercase text-slate-500", children: judul }),
      /* @__PURE__ */ jsx("div", { className: "mt-1 text-2xl font-semibold tabular-nums text-slate-900", children: utama }),
      bawah && /* @__PURE__ */ jsx("div", { className: "mt-0.5 text-xs text-slate-500", children: bawah })
    ]
  }
);
const Baris = ({ d, bolehBuka }) => {
  const aksi = (nama) => router.post(route(nama, d.id), {}, { preserveScroll: true });
  const buka = () => {
    const alasan = window.prompt(
      "Alasan membuka kunci bulan ini (tercatat):"
    );
    if (alasan && alasan.trim().length >= 5) {
      router.post(
        route("closing.bulanan.buka", d.id),
        { alasan },
        { preserveScroll: true }
      );
    } else if (alasan !== null) {
      window.alert("Alasan terlalu pendek.");
    }
  };
  return /* @__PURE__ */ jsxs(TableRow, { className: d.terkunci ? "bg-emerald-50/40" : void 0, children: [
    /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: d.kelompok ?? "—" }),
    /* @__PURE__ */ jsx(TableCell, { className: "capitalize", children: d.hari }),
    /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: /* @__PURE__ */ jsxs(
      "span",
      {
        className: `inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium tabular-nums ${d.lengkap ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-800"}`,
        children: [
          d.hari_terkunci,
          "/",
          d.hari_kerja
        ]
      }
    ) }),
    /* @__PURE__ */ jsx(TableCell, { className: "text-right tabular-nums", children: rupiah(d.awal_total) }),
    /* @__PURE__ */ jsx(TableCell, { className: "text-right tabular-nums", children: rupiah(d.drop) }),
    /* @__PURE__ */ jsx(TableCell, { className: "text-right tabular-nums", children: rupiah(d.storting) }),
    /* @__PURE__ */ jsx(TableCell, { className: "text-right tabular-nums font-medium", children: rupiah(d.akhir_total) }),
    /* @__PURE__ */ jsx(TableCell, { children: d.terkunci ? /* @__PURE__ */ jsxs("div", { className: "text-xs", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 font-medium text-emerald-700", children: [
        /* @__PURE__ */ jsx(Lock, { className: "w-3 h-3" }),
        " Terkunci"
      ] }),
      /* @__PURE__ */ jsx("div", { className: "text-slate-500", children: d.kasir_nama })
    ] }) : d.kepala_approval_at ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-xs text-slate-600", children: [
      /* @__PURE__ */ jsx(Check, { className: "w-3 h-3 text-sky-600" }),
      " Kepala setuju"
    ] }) : /* @__PURE__ */ jsx("span", { className: "text-xs text-slate-400", children: "belum diperiksa" }) }),
    /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: d.terkunci ? bolehBuka ? /* @__PURE__ */ jsxs(Button, { size: "xs", variant: "ghost", onClick: buka, children: [
      /* @__PURE__ */ jsx(LockOpen, { className: "w-3 h-3 mr-1" }),
      " Buka"
    ] }) : /* @__PURE__ */ jsx("span", { className: "text-xs text-slate-400", children: "—" }) : /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-1", children: [
      !d.kepala_approval_at && /* @__PURE__ */ jsx(
        Button,
        {
          size: "xs",
          variant: "outline",
          onClick: () => aksi("closing.bulanan.approve_kepala"),
          children: "Setujui"
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          size: "xs",
          disabled: d.halangan.length > 0,
          title: d.halangan.join(" ") || void 0,
          onClick: () => aksi("closing.bulanan.kunci"),
          children: "Kunci"
        }
      )
    ] }) })
  ] });
};
const Bulanan = ({ datas = [], server_filter }) => {
  const pindah = (periode) => router.get(
    route("closing.bulanan.index"),
    { periode },
    { preserveScroll: true }
  );
  const total = datas.length;
  const terkunci = datas.filter((d) => d.terkunci).length;
  const siap = datas.filter((d) => !d.terkunci && d.halangan.length === 0).length;
  const belumLengkap = datas.filter((d) => !d.lengkap).length;
  return /* @__PURE__ */ jsxs(Authenticated, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Closing Bulanan" }),
    /* @__PURE__ */ jsxs("div", { className: "p-4 space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-end justify-between gap-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("h1", { className: "text-lg font-semibold text-slate-900", children: [
            "Closing Bulanan — ",
            server_filter == null ? void 0 : server_filter.unit
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "max-w-3xl mt-1 text-sm text-slate-600", children: [
            "Tanda tangan akhir bulan. Angkanya tidak dihitung di sini — sudah tersusun tiap hari dikunci. Kasir ",
            /* @__PURE__ */ jsx("b", { children: "tidak bisa" }),
            " mengunci bulan selama masih ada hari kerja yang belum terkunci; itulah yang membuat lupa tutup buku mustahil lolos."
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "outline",
              size: "icon",
              onClick: () => pindah(server_filter == null ? void 0 : server_filter.sebelumnya),
              children: /* @__PURE__ */ jsx(ChevronLeft, { className: "w-4 h-4" })
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "min-w-[9rem] text-center text-sm font-medium", children: server_filter == null ? void 0 : server_filter.nama_periode }),
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "outline",
              size: "icon",
              onClick: () => pindah(server_filter == null ? void 0 : server_filter.berikutnya),
              children: /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4" })
            }
          )
        ] })
      ] }),
      !(server_filter == null ? void 0 : server_filter.sudah_migrasi) && /* @__PURE__ */ jsx("div", { className: "p-3 text-sm border rounded-lg border-slate-300 bg-slate-50 text-slate-700", children: "Kantor ini belum memakai alur agregasi baru, jadi belum ada closing bulanan untuk ditandatangani." }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4", children: [
        /* @__PURE__ */ jsx(Kartu, { judul: "Baris", utama: total, bawah: "kelompok × hari tagih" }),
        /* @__PURE__ */ jsx(
          Kartu,
          {
            judul: "Sudah dikunci",
            utama: terkunci,
            nada: total > 0 && terkunci === total ? "baik" : "netral"
          }
        ),
        /* @__PURE__ */ jsx(
          Kartu,
          {
            judul: "Siap dikunci",
            utama: siap,
            bawah: "lengkap & disetujui",
            nada: siap > 0 ? "baik" : "netral"
          }
        ),
        /* @__PURE__ */ jsx(
          Kartu,
          {
            judul: "Belum lengkap",
            utama: belumLengkap,
            bawah: "masih ada hari belum terkunci",
            nada: belumLengkap > 0 ? "ingat" : "baik"
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto bg-white border rounded-lg border-slate-200", children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { children: "Kelompok" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Hari" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Hari terkunci" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Saldo awal" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Drop" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Storting" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Saldo akhir" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Status" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Aksi" })
        ] }) }),
        /* @__PURE__ */ jsxs(TableBody, { children: [
          datas.length === 0 && /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(
            TableCell,
            {
              colSpan: 9,
              className: "py-8 text-center text-slate-500",
              children: "Belum ada baris bulanan untuk periode ini."
            }
          ) }),
          datas.map((d) => /* @__PURE__ */ jsx(Baris, { d, bolehBuka: server_filter == null ? void 0 : server_filter.boleh_buka }, d.id))
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("p", { className: "max-w-3xl text-xs text-slate-500", children: [
        /* @__PURE__ */ jsx("b", { children: "Hari terkunci" }),
        " hijau berarti setiap hari kerja bulan itu sudah dikunci di Closing Harian. Selama masih kuning (mis. 23/24), tombol Kunci mati — arahkan kursor ke tombolnya untuk melihat apa yang menahan. Membuka kunci bulan yang sudah diteken hanya bisa lewat stafkontrol/pusat/superuser yang berizin ",
        /* @__PURE__ */ jsx("code", { children: "can-edit" }),
        ", dan alasannya tercatat."
      ] })
    ] })
  ] });
};
export {
  Bulanan as default
};
