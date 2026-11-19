import { jsxs, jsx } from "react/jsx-runtime";
import { A as Authenticated } from "./AuthenticatedLayout-CLVnpQ7Y.js";
import { useState } from "react";
import { Head, router } from "@inertiajs/react";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-Dwx5kZ1B.js";
import { I as Input } from "./input-BHD-__le.js";
import { B as Button } from "./button-MTjEwktD.js";
import { ShieldCheck, ArrowRightLeft, ShieldAlert, Lock } from "lucide-react";
import "./command-int9mZp7.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-DzFuPzol.js";
import "clsx";
import "tailwind-merge";
import "dayjs";
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
const SelZ = ({ baris, bolehUbah }) => {
  const [nilai, setNilai] = useState(baris.z ?? "");
  const [sibuk, setSibuk] = useState(false);
  if (baris.sudah_serah_terima) {
    return /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 tabular-nums", children: [
      rupiah(baris.z),
      /* @__PURE__ */ jsx(Lock, { className: "w-3 h-3 text-slate-400" })
    ] });
  }
  if (!bolehUbah || !baris.monthly_id) {
    return /* @__PURE__ */ jsx("span", { className: "tabular-nums", children: rupiah(baris.z) });
  }
  const simpan = () => {
    const bersih = nilai === "" ? null : Number(nilai);
    if (bersih === (baris.z ?? null)) return;
    setSibuk(true);
    router.put(
      route("migrasi.serah_terima_z", baris.monthly_id),
      { z: bersih },
      {
        preserveScroll: true,
        preserveState: false,
        onFinish: () => setSibuk(false)
      }
    );
  };
  return /* @__PURE__ */ jsx(
    Input,
    {
      type: "number",
      min: "0",
      inputMode: "numeric",
      disabled: sibuk,
      value: nilai,
      placeholder: "belum diisi",
      onChange: (e) => setNilai(e.target.value),
      onBlur: simpan,
      onKeyDown: (e) => e.key === "Enter" && e.currentTarget.blur(),
      className: `h-8 w-32 text-right tabular-nums ${baris.z === null ? "border-amber-400 bg-amber-50/60" : ""}`
    }
  );
};
const SerahTerima = ({ hasil, server_filter }) => {
  const bolehUbah = !!(server_filter == null ? void 0 : server_filter.boleh_ubah);
  const rincian = (hasil == null ? void 0 : hasil.rincian) ?? [];
  const cocok = (hasil == null ? void 0 : hasil.beda) === 0 && rincian.length > 0;
  const siap = (hasil == null ? void 0 : hasil.z_belum_ditetapkan) === 0 && rincian.length > 0;
  const sahkan = () => {
    if (!window.confirm(
      "Sahkan serah terima?\n\nSesudah ini saldo awal periode ini tidak akan pernah dihitung ulang, dan Z tidak bisa diubah lagi. Nama Anda tercatat sebagai yang menerimanya."
    ))
      return;
    router.post(
      route("migrasi.serah_terima_sahkan"),
      { periode: server_filter == null ? void 0 : server_filter.periode },
      { preserveScroll: true }
    );
  };
  return /* @__PURE__ */ jsxs(Authenticated, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Serah Terima Saldo Awal" }),
    /* @__PURE__ */ jsxs("div", { className: "p-4 space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("h1", { className: "text-lg font-semibold text-slate-900", children: [
          "Serah Terima Saldo Awal — ",
          hasil == null ? void 0 : hasil.unit
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "max-w-3xl mt-1 text-sm text-slate-600", children: [
          "Satu-satunya kali sistem lama dan sistem baru bertemu, sekali seumur hidup per kantor. Dua angka dibandingkan, dan yang penting keduanya tiba ",
          /* @__PURE__ */ jsx("b", { children: "sendiri-sendiri" }),
          ": kiri dari tutup buku sistem lama, kanan dihitung langsung dari pinjaman dan angsuran tanpa pernah membaca tabel sirkulasi."
        ] })
      ] }),
      !(hasil == null ? void 0 : hasil.sudah_migrasi) && /* @__PURE__ */ jsx("div", { className: "p-3 text-sm border rounded-lg border-slate-300 bg-slate-50 text-slate-700", children: "Kantor ini belum memakai alur agregasi baru. Serah terima terjadi otomatis saat tutup buku pertama." }),
      (hasil == null ? void 0 : hasil.sudah_migrasi) && !(hasil == null ? void 0 : hasil.bulan_serah_terima) && /* @__PURE__ */ jsxs("div", { className: "p-3 text-sm border rounded-lg border-slate-300 bg-slate-50 text-slate-700", children: [
        "Periode ini bukan bulan serah terima. Kantor ini mulai memakai alur baru ",
        /* @__PURE__ */ jsx("b", { children: hasil == null ? void 0 : hasil.periode_migrasi }),
        " — hanya bulan itu yang punya saldo awal warisan sistem lama. Bulan sesudahnya saldo awalnya lahir dari bulan sebelumnya di sistem yang sama."
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4", children: [
        /* @__PURE__ */ jsx(
          Kartu,
          {
            judul: "Saldo awal (sistem baru)",
            utama: rupiah(hasil == null ? void 0 : hasil.awal_total),
            bawah: "dari pinjaman & angsuran"
          }
        ),
        /* @__PURE__ */ jsx(
          Kartu,
          {
            judul: "Tutup buku (sistem lama)",
            utama: rupiah(hasil == null ? void 0 : hasil.sirkulasi_total),
            bawah: "dari transaction_sirculations"
          }
        ),
        /* @__PURE__ */ jsx(
          Kartu,
          {
            judul: "Selisih",
            utama: rupiah(hasil == null ? void 0 : hasil.selisih_total),
            bawah: `${(hasil == null ? void 0 : hasil.beda) ?? 0} baris tidak cocok`,
            nada: cocok ? "baik" : "buruk"
          }
        ),
        /* @__PURE__ */ jsx(
          Kartu,
          {
            judul: "Z belum ditetapkan",
            utama: (hasil == null ? void 0 : hasil.z_belum_ditetapkan) ?? 0,
            bawah: siap ? "semua baris sudah diisi" : "wajib diisi sebelum diteken",
            nada: siap ? "baik" : "ingat"
          }
        )
      ] }),
      (hasil == null ? void 0 : hasil.sudah_serah_terima) ? /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2 p-3 text-sm border rounded-lg border-emerald-300 bg-emerald-50/60 text-emerald-900", children: [
        /* @__PURE__ */ jsx(ShieldCheck, { className: "w-4 h-4 mt-0.5 shrink-0" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("b", { children: "Sudah diserahterimakan" }),
          " pada ",
          hasil == null ? void 0 : hasil.serah_terima_at,
          ". Saldo awal periode ini tidak akan dihitung ulang lagi, walaupun ada pinjaman bertanggal mundur yang disisipkan ke bulan sebelumnya. Sisipan seperti itu tetap terlihat — tapi sebagai selisih pada",
          " ",
          /* @__PURE__ */ jsx("span", { className: "font-medium", children: "saldo akhir" }),
          ", bukan sebagai saldo awal yang diam-diam berubah."
        ] })
      ] }) : (hasil == null ? void 0 : hasil.bulan_serah_terima) && /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3 p-3 border rounded-lg border-slate-300 bg-slate-50", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2 text-sm text-slate-700", children: [
          /* @__PURE__ */ jsx(ArrowRightLeft, { className: "w-4 h-4 mt-0.5 shrink-0" }),
          /* @__PURE__ */ jsxs("div", { className: "max-w-2xl", children: [
            "Selisih ",
            /* @__PURE__ */ jsx("b", { children: "tidak memblokir" }),
            " tombol ini — kantorlah yang memutuskan apakah selisihnya bisa dipertanggungjawabkan. Kalau selisih memblokir, orang akan menyetel Z sampai nol supaya bisa lanjut, dan Z berhenti berarti apa pun. Yang menahan bukan sistem, melainkan tanda tangan yang tercatat namanya."
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          Button,
          {
            onClick: sahkan,
            disabled: !bolehUbah || !siap,
            title: !bolehUbah ? "Butuh izin can-edit dari superuser" : !siap ? "Masih ada Z yang belum ditetapkan" : void 0,
            children: "Sahkan serah terima"
          }
        )
      ] }),
      !cocok && rincian.length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2 p-3 text-sm border rounded-lg border-red-300 bg-red-50/60 text-red-900", children: [
        /* @__PURE__ */ jsx(ShieldAlert, { className: "w-4 h-4 mt-0.5 shrink-0" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("b", { children: [
            hasil == null ? void 0 : hasil.beda,
            " baris meleset."
          ] }),
          " Tidak ada tombol untuk menyamakannya, dan itu disengaja — kalau salah satu angka boleh disetel mengikuti yang lain, tidak ada yang pernah salah dan tidak ada yang pernah ketahuan. Yang benar adalah menelusuri sebabnya: biasanya tutup buku lama yang belum lengkap, atau pinjaman yang embernya melompat. Kalau tidak ketemu, tunda serah terimanya."
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto bg-white border rounded-lg border-slate-200", children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { children: "Kelompok" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Hari" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Sistem lama" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Sistem baru" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Selisih" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "month2" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "ccm" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "cm" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "mb" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "ml" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "ML belum terinput" })
        ] }) }),
        /* @__PURE__ */ jsxs(TableBody, { children: [
          rincian.length === 0 && /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 11, className: "py-8 text-center text-slate-500", children: "Tidak ada baris untuk periode ini." }) }),
          rincian.map((r) => /* @__PURE__ */ jsxs(
            TableRow,
            {
              className: r.selisih !== 0 ? "bg-red-50/50" : void 0,
              children: [
                /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: r.kelompok ?? "—" }),
                /* @__PURE__ */ jsx(TableCell, { className: "capitalize", children: r.hari }),
                /* @__PURE__ */ jsx(TableCell, { className: "text-right tabular-nums", children: rupiah(r.sirkulasi_total) }),
                /* @__PURE__ */ jsx(TableCell, { className: "text-right tabular-nums", children: rupiah(r.awal_total) }),
                /* @__PURE__ */ jsx(
                  TableCell,
                  {
                    className: `text-right tabular-nums ${r.selisih !== 0 ? "font-semibold text-red-700" : "text-slate-400"}`,
                    children: rupiah(r.selisih)
                  }
                ),
                /* @__PURE__ */ jsx(TableCell, { className: "text-right tabular-nums", children: rupiah(r.awal_month2) }),
                /* @__PURE__ */ jsx(TableCell, { className: "text-right tabular-nums", children: rupiah(r.awal_ccm) }),
                /* @__PURE__ */ jsx(TableCell, { className: "text-right tabular-nums", children: rupiah(r.awal_cm) }),
                /* @__PURE__ */ jsx(TableCell, { className: "text-right tabular-nums", children: rupiah(r.awal_mb) }),
                /* @__PURE__ */ jsx(TableCell, { className: "text-right tabular-nums", children: rupiah(r.awal_ml) }),
                /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsx(SelZ, { baris: r, bolehUbah }) })
              ]
            },
            `${r.grouping_id}|${r.hari}`
          ))
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("p", { className: "max-w-3xl text-xs text-slate-500", children: [
        /* @__PURE__ */ jsx("b", { children: "ML belum terinput (Z)" }),
        " adalah saldo nasabah macet lama yang belum pernah masuk sistem. Diketik kantor, bukan diturunkan dari",
        " ",
        /* @__PURE__ */ jsx("code", { children: "ml_amount" }),
        " lama — angka itu sendiri sudah terbukti melenceng ke dua arah, jadi menurunkan Z darinya berarti mewarisi kesalahannya dengan wajah meyakinkan. Kolom kosong berarti",
        " ",
        /* @__PURE__ */ jsx("b", { children: "belum ditetapkan" }),
        "; ketik ",
        /* @__PURE__ */ jsx("b", { children: "0" }),
        " kalau kantor sudah memeriksa dan memang tidak ada. Dua hal itu berbeda, dan hanya yang kedua yang membuat kantor siap diteken."
      ] })
    ] })
  ] });
};
export {
  SerahTerima as default
};
