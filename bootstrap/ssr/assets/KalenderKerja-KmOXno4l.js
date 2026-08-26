import { jsxs, jsx } from "react/jsx-runtime";
import { A as Authenticated } from "./AuthenticatedLayout-Cp-Ywcjq.js";
import { useState } from "react";
import { Head, router } from "@inertiajs/react";
import { B as Button } from "./button-MTjEwktD.js";
import { I as Input } from "./input-BHD-__le.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-8a8NNlps.js";
import { ChevronLeft, ChevronRight, CalendarDays, Lightbulb, Lock } from "lucide-react";
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
import "./popover-B9xSK2Gy.js";
import "@radix-ui/react-popover";
import "sweetalert2";
import "sweetalert2-react-content";
import "./Loading-DPcVnbEk.js";
import "react-dom";
import "@headlessui/react";
const NAMA_HARI = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
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
const KalenderKerja = ({ kalender, server_filter }) => {
  const [dipilih, setDipilih] = useState(null);
  const [keterangan, setKeterangan] = useState("");
  const pindahBulan = (periode) => router.get(route("kalender.index"), { periode }, { preserveScroll: true });
  const buka = (h) => {
    setDipilih(h);
    setKeterangan(h.keterangan ?? "");
  };
  const tetapkan = (isLibur) => {
    router.post(
      route("kalender.simpan"),
      { tanggal: dipilih.tanggal, is_libur: isLibur, keterangan },
      { preserveScroll: true, onSuccess: () => setDipilih(null) }
    );
  };
  const terapkanSaran = () => {
    if (!window.confirm(
      `Terapkan ${kalender.jumlah_saran} saran untuk ${kalender.nama_periode}?

Hanya tanggal yang belum ditetapkan yang disentuh. Penetapan yang sudah ada adalah keputusan orang dan tidak akan ditimpa.`
    ))
      return;
    router.post(
      route("kalender.terapkan_saran"),
      { periode: `${kalender.periode}-01` },
      { preserveScroll: true }
    );
  };
  const hari = (kalender == null ? void 0 : kalender.hari) ?? [];
  const kotakKosongAwal = hari.length ? hari[0].urut_hari - 1 : 0;
  const sel = [...Array(kotakKosongAwal).fill(null), ...hari];
  return /* @__PURE__ */ jsxs(Authenticated, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Kalender Kerja" }),
    /* @__PURE__ */ jsxs("div", { className: "p-4 space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-end justify-between gap-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-lg font-semibold text-slate-900", children: "Kalender Kerja Nasional" }),
          /* @__PURE__ */ jsxs("p", { className: "max-w-3xl mt-1 text-sm text-slate-600", children: [
            "Berlaku untuk seluruh kantor sekaligus. Menentukan tanggal mana yang punya baris closing harian — dan karena tanda tangan bulanan mensyaratkan semua hari kerja terkunci, satu hari libur yang lupa ditandai membuat bulan itu ",
            /* @__PURE__ */ jsx("b", { children: "tidak akan pernah bisa ditutup" }),
            "."
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "outline",
              size: "icon",
              disabled: !(kalender == null ? void 0 : kalender.ada_bulan_sebelumnya),
              title: (kalender == null ? void 0 : kalender.ada_bulan_sebelumnya) ? void 0 : `Kalender hanya berlaku sejak ${kalender == null ? void 0 : kalender.nama_bulan_paling_awal}`,
              onClick: () => pindahBulan(server_filter == null ? void 0 : server_filter.sebelumnya),
              children: /* @__PURE__ */ jsx(ChevronLeft, { className: "w-4 h-4" })
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "min-w-[9rem] text-center text-sm font-medium", children: kalender == null ? void 0 : kalender.nama_periode }),
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "outline",
              size: "icon",
              onClick: () => pindahBulan(server_filter == null ? void 0 : server_filter.berikutnya),
              children: /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4" })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4", children: [
        /* @__PURE__ */ jsx(Kartu, { judul: "Hari kerja", utama: kalender == null ? void 0 : kalender.hari_kerja }),
        /* @__PURE__ */ jsx(Kartu, { judul: "Hari libur", utama: kalender == null ? void 0 : kalender.hari_libur }),
        /* @__PURE__ */ jsx(
          Kartu,
          {
            judul: "Belum ditetapkan",
            utama: kalender == null ? void 0 : kalender.belum_ditetapkan,
            bawah: "memakai bawaan Senin–Sabtu",
            nada: (kalender == null ? void 0 : kalender.belum_ditetapkan) > 0 ? "ingat" : "baik"
          }
        ),
        /* @__PURE__ */ jsx(
          Kartu,
          {
            judul: "Saran",
            utama: kalender == null ? void 0 : kalender.jumlah_saran,
            bawah: "Minggu dan libur bertanggal tetap"
          }
        )
      ] }),
      !(kalender == null ? void 0 : kalender.sudah_dikonfirmasi) && /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3 p-3 text-sm border rounded-lg border-amber-300 bg-amber-50/60 text-amber-900", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2", children: [
          /* @__PURE__ */ jsx(CalendarDays, { className: "w-4 h-4 mt-0.5 shrink-0" }),
          /* @__PURE__ */ jsxs("span", { className: "max-w-2xl", children: [
            /* @__PURE__ */ jsxs("b", { children: [
              kalender == null ? void 0 : kalender.nama_periode,
              " belum dikonfirmasi."
            ] }),
            " Alurnya tidak diblokir — semuanya jatuh ke bawaan Senin–Sabtu, jadi libur nasional apa pun di bulan ini masih terhitung hari kerja."
          ] })
        ] }),
        (kalender == null ? void 0 : kalender.jumlah_saran) > 0 && /* @__PURE__ */ jsxs(Button, { onClick: terapkanSaran, size: "sm", children: [
          /* @__PURE__ */ jsx(Lightbulb, { className: "w-4 h-4 mr-1.5" }),
          "Terapkan ",
          kalender.jumlah_saran,
          " saran"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-3 bg-white border rounded-lg border-slate-200", children: [
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-7 gap-1.5 mb-1.5", children: NAMA_HARI.map((n) => /* @__PURE__ */ jsx(
          "div",
          {
            className: "py-1 text-xs font-medium text-center text-slate-500",
            children: n
          },
          n
        )) }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-7 gap-1.5", children: sel.map(
          (h, i) => h === null ? /* @__PURE__ */ jsx("div", {}, `kosong-${i}`) : /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => buka(h),
              className: `relative min-h-[5.5rem] rounded-md border p-2 text-left transition hover:ring-2 hover:ring-slate-300 ${h.is_libur ? "border-red-200 bg-red-50/70" : "border-slate-200 bg-white"} ${!h.ditetapkan ? "border-dashed" : ""}`,
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
                  /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: `text-sm font-semibold tabular-nums ${h.is_libur ? "text-red-700" : "text-slate-900"}`,
                      children: h.tanggal_pendek
                    }
                  ),
                  h.closing_terkunci > 0 && /* @__PURE__ */ jsx(Lock, { className: "w-3 h-3 text-slate-400" })
                ] }),
                h.keterangan && /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: `mt-0.5 line-clamp-2 text-[10px] leading-tight ${h.ditetapkan ? "text-slate-600" : "text-amber-700"}`,
                    children: h.keterangan
                  }
                ),
                /* @__PURE__ */ jsx("div", { className: "absolute bottom-1.5 left-2 right-2 flex items-center justify-end text-[10px] text-slate-400", children: !h.ditetapkan && /* @__PURE__ */ jsx("span", { children: "bawaan" }) })
              ]
            },
            h.tanggal
          )
        ) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-4 text-xs text-slate-500", children: [
        /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsx("span", { className: "inline-block w-3 h-3 border rounded border-slate-200 bg-white" }),
          "hari kerja"
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsx("span", { className: "inline-block w-3 h-3 border rounded border-red-200 bg-red-50" }),
          "libur"
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsx("span", { className: "inline-block w-3 h-3 border border-dashed rounded border-slate-400" }),
          "belum ditetapkan (pakai bawaan)"
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsx(Lock, { className: "w-3 h-3" }),
          " ada closing terkunci"
        ] }),
        /* @__PURE__ */ jsx("span", { children: "klik tanggal untuk mengubah" })
      ] }),
      /* @__PURE__ */ jsx(Dialog, { open: !!dipilih, onOpenChange: (o) => !o && setDipilih(null), children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-md", children: [
        /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsxs(DialogTitle, { children: [
          dipilih == null ? void 0 : dipilih.nama_hari,
          ", ",
          dipilih == null ? void 0 : dipilih.tanggal
        ] }) }),
        dipilih && /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "p-2 text-sm rounded bg-slate-50", children: [
            /* @__PURE__ */ jsx("div", { className: "text-xs text-slate-500", children: "Sekarang" }),
            /* @__PURE__ */ jsxs("div", { className: "font-medium", children: [
              dipilih.is_libur ? "Libur" : "Hari kerja",
              !dipilih.ditetapkan && /* @__PURE__ */ jsx("span", { className: "text-slate-400", children: " (bawaan)" })
            ] })
          ] }),
          dipilih.disarankan_libur && !dipilih.ditetapkan && /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2 p-2 text-xs border rounded border-amber-300 bg-amber-50/60 text-amber-900", children: [
            /* @__PURE__ */ jsx(Lightbulb, { className: "w-3.5 h-3.5 mt-0.5 shrink-0" }),
            /* @__PURE__ */ jsxs("span", { children: [
              "Disarankan libur — ",
              dipilih.keterangan
            ] })
          ] }),
          dipilih.closing_baris > 0 && /* @__PURE__ */ jsxs("div", { className: "text-xs text-slate-600", children: [
            dipilih.closing_baris,
            " baris closing,",
            " ",
            dipilih.closing_terkunci,
            " terkunci, ",
            dipilih.closing_berisi,
            " ",
            "berisi angka."
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs text-slate-500", children: "Keterangan" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                value: keterangan,
                onChange: (e) => setKeterangan(e.target.value),
                placeholder: "mis. Hari Kemerdekaan RI",
                className: "mt-1"
              }
            )
          ] }),
          !dipilih.boleh_jadi_libur && /* @__PURE__ */ jsxs("div", { className: "p-2 text-xs border rounded border-red-300 bg-red-50/60 text-red-900", children: [
            "Tidak bisa dijadikan libur: ",
            dipilih.alasan_tolak
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                className: "flex-1",
                variant: "outline",
                onClick: () => tetapkan(false),
                children: "Hari kerja"
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                className: "flex-1",
                variant: "destructive",
                disabled: !dipilih.boleh_jadi_libur,
                onClick: () => tetapkan(true),
                children: "Libur"
              }
            )
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("p", { className: "max-w-3xl text-xs text-slate-500", children: [
        "Saran hanya berisi yang ",
        /* @__PURE__ */ jsx("b", { children: "pasti" }),
        ": hari Minggu dan libur bertanggal tetap (17 Agustus, 25 Desember, dan seterusnya). Yang tanggalnya bergeser tiap tahun — Idul Fitri, Nyepi, Waisak — sengaja tidak ditebak, karena tebakan yang salah tetap terlihat meyakinkan. Kalender juga hanya berlaku maju: bulan sebelum",
        " ",
        /* @__PURE__ */ jsx("b", { children: kalender == null ? void 0 : kalender.nama_bulan_paling_awal }),
        " tidak bisa dibuka, karena tidak ada agregat baru bertanggal sebelum itu yang membacanya."
      ] })
    ] })
  ] });
};
export {
  KalenderKerja as default
};
