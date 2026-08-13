import { jsxs, jsx } from "react/jsx-runtime";
import { A as Authenticated } from "./AuthenticatedLayout-BEPqRHWf.js";
import "react";
import { usePage, Head, router } from "@inertiajs/react";
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
const rupiah = (n) => n === null || n === void 0 ? "—" : new Intl.NumberFormat("id-ID").format(n);
const STATUS = {
  dibuka: {
    label: "Dibuka",
    kelas: "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
  },
  ditutup: {
    label: "Ditutup",
    kelas: "bg-slate-100 text-slate-600 ring-slate-500/20"
  },
  belum_dinyatakan: {
    label: "Belum dinyatakan",
    kelas: "bg-amber-50 text-amber-800 ring-amber-600/30"
  }
};
const Lencana = ({ status }) => {
  const s = STATUS[status] ?? STATUS.ditutup;
  return /* @__PURE__ */ jsx(
    "span",
    {
      className: `inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${s.kelas}`,
      children: s.label
    }
  );
};
const Kartu = ({ judul, utama, bawah, nada = "netral" }) => {
  const nadaKelas = {
    netral: "border-slate-200",
    baik: "border-emerald-200",
    ingat: "border-amber-300"
  }[nada];
  return /* @__PURE__ */ jsxs("div", { className: `rounded-lg border bg-white p-4 ${nadaKelas}`, children: [
    /* @__PURE__ */ jsx("div", { className: "text-xs font-medium tracking-wide uppercase text-slate-500", children: judul }),
    /* @__PURE__ */ jsx("div", { className: "mt-1 text-2xl font-semibold tabular-nums text-slate-900", children: utama }),
    bawah && /* @__PURE__ */ jsx("div", { className: "mt-0.5 text-xs text-slate-500", children: bawah })
  ] });
};
const StockTakeMl = ({ datas = [], ringkasan, server_filter }) => {
  var _a, _b, _c, _d, _e, _f;
  const { auth } = usePage().props;
  const gantiPeriode = (nilai) => {
    if (!nilai) return;
    router.get(
      route("migrasi.stock_take_ml"),
      { periode: `${nilai}-01` },
      { preserveState: true, preserveScroll: true }
    );
  };
  return /* @__PURE__ */ jsxs(Authenticated, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Stock-take ML" }),
    /* @__PURE__ */ jsxs("div", { className: "p-4 space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-end justify-between gap-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("h1", { className: "text-lg font-semibold text-slate-900", children: [
            "Stock-take ML — ",
            server_filter == null ? void 0 : server_filter.unit
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "max-w-3xl mt-1 text-sm text-slate-600", children: [
            "Membandingkan ",
            /* @__PURE__ */ jsx("b", { children: "kuota" }),
            " yang dinyatakan kantor (",
            /* @__PURE__ */ jsx("code", { children: "ml_amount" }),
            ") dengan ",
            /* @__PURE__ */ jsx("b", { children: "saldo ML dari data nyata" }),
            ", per kelompok per hari. Laporan ini tidak mengubah apa pun — angka yang tidak cocok dibiarkan apa adanya."
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex items-end gap-2", children: /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block mb-1 text-xs font-medium text-slate-600", children: "Periode" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              type: "month",
              className: "w-40",
              defaultValue: dayjs(server_filter == null ? void 0 : server_filter.periode).format("YYYY-MM"),
              onChange: (e) => gantiPeriode(e.target.value)
            }
          )
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4", children: [
        /* @__PURE__ */ jsx(
          Kartu,
          {
            judul: "Pintu dibuka",
            utama: ((_a = ringkasan == null ? void 0 : ringkasan.dibuka) == null ? void 0 : _a.baris) ?? 0,
            bawah: `kuota Rp ${rupiah(((_b = ringkasan == null ? void 0 : ringkasan.dibuka) == null ? void 0 : _b.kuota) ?? 0)}`,
            nada: "baik"
          }
        ),
        /* @__PURE__ */ jsx(
          Kartu,
          {
            judul: "Pintu ditutup",
            utama: ((_c = ringkasan == null ? void 0 : ringkasan.ditutup) == null ? void 0 : _c.baris) ?? 0,
            bawah: "kuota penuh atau data melebihi"
          }
        ),
        /* @__PURE__ */ jsx(
          Kartu,
          {
            judul: "Belum dinyatakan",
            utama: ((_d = ringkasan == null ? void 0 : ringkasan.belum_dinyatakan) == null ? void 0 : _d.baris) ?? 0,
            bawah: ((_e = ringkasan == null ? void 0 : ringkasan.belum_dinyatakan) == null ? void 0 : _e.baris) ? `ada data Rp ${rupiah(ringkasan.belum_dinyatakan.data_nyata)} tanpa baris sirkulasi` : "semua kelompok punya baris sirkulasi",
            nada: ((_f = ringkasan == null ? void 0 : ringkasan.belum_dinyatakan) == null ? void 0 : _f.baris) ? "ingat" : "netral"
          }
        ),
        /* @__PURE__ */ jsx(
          Kartu,
          {
            judul: "Status kantor",
            utama: (server_filter == null ? void 0 : server_filter.sudah_migrasi) ? "Sudah migrasi" : "Belum",
            bawah: (server_filter == null ? void 0 : server_filter.mulai_pendataan_baru) ? `mulai ${dayjs(server_filter.mulai_pendataan_baru).format("DD MMM YYYY")}` : "masih memakai agregasi lama"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-500", children: [
        "ML dihitung dari selisih 5 bulan — pinjaman dengan tanggal drop sebelum ",
        /* @__PURE__ */ jsx("b", { children: dayjs(server_filter == null ? void 0 : server_filter.batas_ml).format("D MMMM YYYY") }),
        "."
      ] }),
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto bg-white border rounded-lg", children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { children: "Kelompok" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Hari" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Nasabah ML" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Data nyata" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Kuota (ml_amount)" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Sisa kuota" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Status" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Keterangan" })
        ] }) }),
        /* @__PURE__ */ jsxs(TableBody, { children: [
          datas.length === 0 && /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(
            TableCell,
            {
              colSpan: 8,
              className: "py-8 text-center text-slate-500",
              children: "Tidak ada data untuk periode ini."
            }
          ) }),
          datas.map((d) => /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: d.kelompok }),
            /* @__PURE__ */ jsx(TableCell, { className: "capitalize", children: d.hari }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-right tabular-nums", children: d.jumlah_pinjaman_ml }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-right tabular-nums", children: rupiah(d.data_nyata) }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-right tabular-nums", children: rupiah(d.kuota_dinyatakan) }),
            /* @__PURE__ */ jsx(TableCell, { className: "font-medium text-right tabular-nums", children: rupiah(d.kuota_awal) }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Lencana, { status: d.status }) }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-xs text-slate-500", children: d.keterangan })
          ] }, `${d.grouping_id}-${d.hari}`))
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "p-3 text-xs border rounded-lg border-slate-200 bg-slate-50 text-slate-600", children: [
        /* @__PURE__ */ jsx("b", { children: "Cara membacanya." }),
        " Sisa kuota hanya ditetapkan",
        " ",
        /* @__PURE__ */ jsx("b", { children: "sekali, saat kantor migrasi" }),
        ". Sesudah itu angkanya cuma bisa berkurang seiring nasabah lama diinput. Perbandingan di halaman ini tidak dijalankan ulang tiap bulan — kalau dijalankan ulang, pintunya akan terbuka lagi setiap kali nasabah ML membayar, karena data nyata ikut turun."
      ] })
    ] })
  ] });
};
export {
  StockTakeMl as default
};
