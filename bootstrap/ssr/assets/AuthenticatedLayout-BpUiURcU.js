import { jsxs, jsx } from "react/jsx-runtime";
import { usePage, router, Link } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { C as Command, a as CommandInput, b as CommandList, c as CommandEmpty, d as CommandGroup, e as CommandItem, S as Sidebar, f as SidebarHeader, g as SidebarMenu, h as SidebarMenuItem, i as SidebarMenuButton, j as SidebarContent, k as SidebarGroup, l as SidebarGroupLabel, m as SidebarFooter, D as DropdownMenu, n as DropdownMenuTrigger, o as DropdownMenuContent, p as DropdownMenuLabel, q as DropdownMenuSeparator, r as DropdownMenuItem, s as SidebarRail, t as SidebarMenuSub, u as SidebarMenuSubItem, v as SidebarMenuSubButton, w as SidebarTrigger, x as SidebarProvider, y as SidebarInset } from "./command-int9mZp7.js";
import { ChevronsUpDown, Check, Home, Smartphone, Book, FileSpreadsheet, Users, BookOpen, HandCoins, ClipboardCheck, ShieldCheck, UserRound, LogOut } from "lucide-react";
import "clsx";
import "dayjs";
import { B as Button } from "./button-MTjEwktD.js";
import { P as Popover, a as PopoverTrigger, b as PopoverContent } from "./popover-B9xSK2Gy.js";
import { c as cn } from "./utils-DzFuPzol.js";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { L as Loading } from "./Loading-DPcVnbEk.js";
function GlobalBranchFilter({ compact = false }) {
  const { auth } = usePage().props;
  const globalFilter = auth.global_filter;
  const [open, setOpen] = useState(false);
  if (!globalFilter || !globalFilter.allowed_branches || globalFilter.allowed_branches.length <= 1) {
    return null;
  }
  const handleChange = (branchId) => {
    setOpen(false);
    router.post(route("set-branch"), { branch_id: branchId }, {
      preserveState: false,
      preserveScroll: true
    });
  };
  const activeBranch = globalFilter.allowed_branches.find(
    (b) => {
      var _a;
      return b.id.toString() === ((_a = globalFilter.active_branch_id) == null ? void 0 : _a.toString());
    }
  );
  const combobox = /* @__PURE__ */ jsxs(Popover, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
      Button,
      {
        variant: "outline",
        role: "combobox",
        "aria-expanded": open,
        className: cn(
          "justify-between font-normal",
          compact ? "w-48 sm:w-60 h-8 text-xs" : "w-full bg-sidebar-background text-sm"
        ),
        children: [
          /* @__PURE__ */ jsx("span", { className: "truncate", children: activeBranch ? `${activeBranch.unit} ${activeBranch.type ? `(${activeBranch.type})` : ""}` : "Pilih cabang..." }),
          /* @__PURE__ */ jsx(ChevronsUpDown, { className: "ml-2 h-4 w-4 shrink-0 opacity-50" })
        ]
      }
    ) }),
    /* @__PURE__ */ jsx(PopoverContent, { className: "w-[220px] p-0", align: "start", children: /* @__PURE__ */ jsxs(Command, { children: [
      /* @__PURE__ */ jsx(CommandInput, { placeholder: "Cari cabang..." }),
      /* @__PURE__ */ jsxs(CommandList, { children: [
        /* @__PURE__ */ jsx(CommandEmpty, { children: "Cabang tidak ditemukan." }),
        /* @__PURE__ */ jsx(CommandGroup, { children: globalFilter.allowed_branches.map((branch) => {
          var _a;
          return /* @__PURE__ */ jsxs(
            CommandItem,
            {
              value: branch.unit,
              onSelect: () => handleChange(branch.id),
              children: [
                /* @__PURE__ */ jsx(
                  Check,
                  {
                    className: cn(
                      "mr-2 h-4 w-4",
                      ((_a = globalFilter.active_branch_id) == null ? void 0 : _a.toString()) === branch.id.toString() ? "opacity-100" : "opacity-0"
                    )
                  }
                ),
                branch.unit,
                " ",
                branch.type ? `(${branch.type})` : ""
              ]
            },
            branch.id
          );
        }) })
      ] })
    ] }) })
  ] });
  if (compact) {
    return combobox;
  }
  return /* @__PURE__ */ jsxs("div", { className: "px-4 py-3 border-b border-gray-700/50 bg-sidebar-accent/30", children: [
    /* @__PURE__ */ jsx("label", { className: "block text-[10px] text-gray-400 mb-1 uppercase tracking-wider font-semibold", children: "Cabang Aktif" }),
    combobox
  ] });
}
const SidebarSubMenuSection = ({ icon: Icon, title, items }) => {
  return /* @__PURE__ */ jsxs("div", { className: "mt-2 first:mt-0", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 px-2 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider", children: [
      Icon && /* @__PURE__ */ jsx(Icon, { className: "size-3.5 shrink-0 text-slate-400" }),
      /* @__PURE__ */ jsx("span", { className: "truncate", children: title })
    ] }),
    /* @__PURE__ */ jsx(SidebarMenuSub, { className: "my-0.5 ml-3.5 border-l border-slate-200 pl-2 space-y-0.5", children: items.map((subItem) => /* @__PURE__ */ jsx(SidebarMenuSubItem, { children: /* @__PURE__ */ jsx(SidebarMenuSubButton, { asChild: true, isActive: subItem.active, children: /* @__PURE__ */ jsx(Link, { href: subItem.link, className: "font-medium text-xs py-1.5", children: subItem.title }) }) }, subItem.id || subItem.title)) })
  ] });
};
function AppSidebar({ ...props }) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r;
  const { auth } = usePage().props;
  const unitAkses = ((_a = auth == null ? void 0 : auth.permissions) == null ? void 0 : _a.includes("can-approve")) || ((_b = auth == null ? void 0 : auth.permissions) == null ? void 0 : _b.includes("view-all-groups")) || ((_c = auth == null ? void 0 : auth.permissions) == null ? void 0 : _c.includes("view-all-branches"));
  const isSuperUser = (_d = auth == null ? void 0 : auth.roles) == null ? void 0 : _d.includes("superuser");
  return /* @__PURE__ */ jsxs(Sidebar, { className: "border-r shadow-xs", ...props, children: [
    /* @__PURE__ */ jsx(SidebarHeader, { className: "px-3 py-3 border-b", children: /* @__PURE__ */ jsx(SidebarMenu, { children: /* @__PURE__ */ jsx(SidebarMenuItem, { children: /* @__PURE__ */ jsx(
      SidebarMenuButton,
      {
        size: "lg",
        asChild: true,
        className: "hover:bg-transparent",
        children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center text-sm font-bold text-white rounded-lg shadow-sm size-9 bg-slate-900", children: "UB" }),
          /* @__PURE__ */ jsxs("div", { className: "grid flex-1 text-sm leading-tight text-left", children: [
            /* @__PURE__ */ jsx("span", { className: "font-bold tracking-tight truncate text-slate-900", children: "UBMI APPS" }),
            /* @__PURE__ */ jsx("span", { className: "text-xs font-medium truncate text-slate-500", children: "Cabang Transaction" })
          ] })
        ] })
      }
    ) }) }) }),
    /* @__PURE__ */ jsxs(SidebarContent, { className: "px-1 py-2", children: [
      /* @__PURE__ */ jsxs(SidebarGroup, { children: [
        /* @__PURE__ */ jsx(SidebarGroupLabel, { className: "text-[11px] font-bold uppercase tracking-wider text-slate-400", children: "Navigasi Utama" }),
        /* @__PURE__ */ jsx(SidebarMenu, { children: /* @__PURE__ */ jsx(SidebarMenuItem, { children: /* @__PURE__ */ jsx(
          SidebarMenuButton,
          {
            asChild: true,
            isActive: route().current("home"),
            tooltip: "Home",
            children: /* @__PURE__ */ jsxs(
              Link,
              {
                href: route("home"),
                className: "flex items-center gap-2.5 font-medium",
                children: [
                  /* @__PURE__ */ jsx(Home, { className: "size-4" }),
                  /* @__PURE__ */ jsx("span", { children: "Home Web" })
                ]
              }
            )
          }
        ) }) }),
        /* @__PURE__ */ jsx(
          SidebarSubMenuSection,
          {
            icon: Smartphone,
            title: "Input Mantri",
            items: [
              {
                id: 2,
                title: "Pengajuan",
                link: route("mobile_apps.create"),
                active: route().current("mobile_apps.create")
              },
              {
                id: 3,
                title: "Drop",
                link: route("mobile_apps.transaksi"),
                active: route().current("mobile_apps.transaksi")
              },
              {
                id: 4,
                title: "Angsuran",
                link: route("mobile_apps.angsuran"),
                active: route().current("mobile_apps.angsuran")
              },
              {
                id: 5,
                title: "ML",
                link: route("mobile_apps.macet"),
                active: route().current("mobile_apps.macet")
              }
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        SidebarSubMenuSection,
        {
          icon: Book,
          title: "Buku",
          items: [
            {
              id: 1,
              title: "Buku Transaksi (ACC KM)",
              link: route("transaction.index_buku_transaksi"),
              active: route().current("transaction.index_buku_transaksi")
            },
            {
              id: 2,
              title: "Buku Angsuran Lancar",
              link: route("pinjaman.index_pinjaman"),
              active: route().current("pinjaman.index_pinjaman")
            },
            {
              id: 3,
              title: "Buku Macet",
              link: route("pinjaman.index_pinjaman_macet"),
              active: route().current("pinjaman.index_pinjaman_macet")
            }
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        SidebarSubMenuSection,
        {
          icon: FileSpreadsheet,
          title: "Buku Rekap",
          items: [
            {
              id: 1,
              title: "Rekap 1 & Tunai Mantri",
              link: route("kasir.rekap.rekap_satu"),
              active: route().current("kasir.rekap.rekap_satu")
            },
            {
              id: 2,
              title: ((_e = auth == null ? void 0 : auth.permissions) == null ? void 0 : _e.includes("view-all-groups")) ? "Rekap 2" : "Rekap Pimpinan",
              link: route("kasir.rekap.rekap_dua"),
              active: route().current("kasir.rekap.rekap_dua")
            },
            {
              id: 3,
              title: "Rencana Drop",
              link: route("kasir.rekap.rencana_drop"),
              active: route().current("kasir.rekap.rencana_drop")
            },
            {
              id: 4,
              title: "Rekap Mantri",
              link: route("kasir.rekap.rekap_permantri"),
              active: route().current("kasir.rekap.rekap_permantri")
            }
          ]
        }
      ),
      unitAkses && /* @__PURE__ */ jsxs(SidebarGroup, { className: "pt-2", children: [
        /* @__PURE__ */ jsx(SidebarGroupLabel, { className: "text-[11px] font-bold uppercase tracking-wider text-slate-400", children: "Administrasi Cabang" }),
        /* @__PURE__ */ jsx(SidebarMenu, { children: /* @__PURE__ */ jsx(SidebarMenuItem, { children: /* @__PURE__ */ jsx(
          SidebarMenuButton,
          {
            asChild: true,
            isActive: route().current("administrasi.manpower.index"),
            tooltip: "Data Karyawan",
            children: /* @__PURE__ */ jsxs(
              Link,
              {
                href: route("administrasi.manpower.index"),
                className: "flex items-center gap-2.5 font-medium",
                children: [
                  /* @__PURE__ */ jsx(Users, { className: "size-4" }),
                  /* @__PURE__ */ jsx("span", { children: "Data Karyawan" })
                ]
              }
            )
          }
        ) }) }),
        /* @__PURE__ */ jsx(
          SidebarSubMenuSection,
          {
            icon: BookOpen,
            title: "Input Staf",
            items: [
              {
                id: 2,
                title: "Input Pinjaman",
                link: route("transaction.fastcreate"),
                active: route().current("transaction.fastcreate")
              }
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          SidebarSubMenuSection,
          {
            icon: HandCoins,
            title: "Angsuran Cabang",
            items: [
              {
                id: 1,
                title: "Angsuran Lancar",
                link: route("pinjaman.index_pinjaman"),
                active: route().current("pinjaman.index_pinjaman")
              },
              {
                id: 2,
                title: "Macet",
                link: route("pinjaman.index_pinjaman_macet"),
                active: route().current("pinjaman.index_pinjaman_macet")
              },
              {
                id: 3,
                title: "Cari Angsuran",
                link: route("pinjaman.index_pinjaman_search"),
                active: route().current("pinjaman.index_pinjaman_search")
              }
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          SidebarSubMenuSection,
          {
            icon: ClipboardCheck,
            title: "Persiapan Migrasi",
            items: [
              {
                id: 1,
                title: "Stock-take ML",
                link: route("migrasi.stock_take_ml"),
                active: route().current("migrasi.stock_take_ml")
              },
              {
                id: 2,
                title: "Kesiapan Closing",
                link: route("migrasi.kesiapan_closing"),
                active: route().current("migrasi.kesiapan_closing")
              },
              {
                id: 3,
                title: "Closing Harian",
                link: route("closing.harian"),
                active: route().current("closing.harian")
              }
            ]
          }
        )
      ] }),
      isSuperUser && /* @__PURE__ */ jsxs(SidebarGroup, { className: "pt-2", children: [
        /* @__PURE__ */ jsx(SidebarGroupLabel, { className: "text-[11px] font-bold uppercase tracking-wider text-slate-400", children: "Pengaturan Admin" }),
        /* @__PURE__ */ jsx(
          SidebarSubMenuSection,
          {
            icon: ShieldCheck,
            title: "Admin Panel",
            items: [
              {
                id: 1,
                title: "Panel Utama",
                link: route("adminpanel.index"),
                active: route().current("adminpanel.index")
              },
              {
                id: 2,
                title: "Monitoring Staff",
                link: route("adminpanel.monitoring_staff"),
                active: route().current("adminpanel.monitoring_staff")
              },
              {
                id: 3,
                title: "Loan Balancing",
                link: route("adminpanel.loan_balancing"),
                active: route().current("adminpanel.loan_balancing")
              }
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx(SidebarFooter, { className: "p-2 border-t", children: /* @__PURE__ */ jsx(SidebarMenu, { children: /* @__PURE__ */ jsx(SidebarMenuItem, { children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [
      /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
        SidebarMenuButton,
        {
          size: "lg",
          className: "w-full justify-between data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center min-w-0 gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center text-xs font-semibold text-white rounded-full shadow-xs size-8 shrink-0 bg-slate-900", children: (_g = (_f = auth == null ? void 0 : auth.user) == null ? void 0 : _f.username) == null ? void 0 : _g.substring(0, 2).toUpperCase() }),
              /* @__PURE__ */ jsxs("div", { className: "grid flex-1 text-sm leading-tight text-left truncate", children: [
                /* @__PURE__ */ jsx("span", { className: "font-semibold truncate text-slate-900", children: ((_i = (_h = auth == null ? void 0 : auth.user) == null ? void 0 : _h.employee) == null ? void 0 : _i.nama_karyawan) || ((_j = auth == null ? void 0 : auth.user) == null ? void 0 : _j.username) }),
                /* @__PURE__ */ jsx("span", { className: "text-xs truncate text-slate-500", children: (_k = auth == null ? void 0 : auth.user) == null ? void 0 : _k.username })
              ] })
            ] }),
            /* @__PURE__ */ jsx(ChevronsUpDown, { className: "size-4 shrink-0 text-slate-400" })
          ]
        }
      ) }),
      /* @__PURE__ */ jsxs(
        DropdownMenuContent,
        {
          className: "w-56 rounded-lg",
          side: "top",
          align: "end",
          sideOffset: 8,
          children: [
            /* @__PURE__ */ jsx(DropdownMenuLabel, { className: "p-0 font-normal", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5 px-2 py-2 text-left text-sm", children: [
              /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center text-xs font-semibold text-white rounded-full size-8 shrink-0 bg-slate-900", children: (_m = (_l = auth == null ? void 0 : auth.user) == null ? void 0 : _l.username) == null ? void 0 : _m.substring(0, 2).toUpperCase() }),
              /* @__PURE__ */ jsxs("div", { className: "grid flex-1 text-sm leading-tight text-left truncate", children: [
                /* @__PURE__ */ jsx("span", { className: "font-semibold truncate text-slate-900", children: ((_o = (_n = auth == null ? void 0 : auth.user) == null ? void 0 : _n.employee) == null ? void 0 : _o.nama_karyawan) || ((_p = auth == null ? void 0 : auth.user) == null ? void 0 : _p.username) }),
                /* @__PURE__ */ jsx("span", { className: "text-xs truncate text-slate-500", children: ((_q = auth == null ? void 0 : auth.user) == null ? void 0 : _q.email) || ((_r = auth == null ? void 0 : auth.user) == null ? void 0 : _r.username) })
              ] })
            ] }) }),
            /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
            /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsxs(
              Link,
              {
                href: route("profile.edit"),
                className: "flex items-center w-full gap-2 cursor-pointer text-slate-700",
                children: [
                  /* @__PURE__ */ jsx(UserRound, { className: "size-4" }),
                  /* @__PURE__ */ jsx("span", { children: "Profile" })
                ]
              }
            ) }),
            /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
            /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsxs(
              Link,
              {
                href: route("logout"),
                method: "post",
                as: "button",
                replace: "true",
                className: "flex items-center w-full gap-2 text-red-600 cursor-pointer focus:text-red-600",
                children: [
                  /* @__PURE__ */ jsx(LogOut, { className: "size-4" }),
                  /* @__PURE__ */ jsx("span", { children: "Log Out" })
                ]
              }
            ) })
          ]
        }
      )
    ] }) }) }) }),
    /* @__PURE__ */ jsx(SidebarRail, {})
  ] });
}
const Navbar = ({ header }) => {
  return /* @__PURE__ */ jsxs("header", { className: "sticky top-0 z-30 flex items-center h-14 gap-4 px-4 bg-white border-b shrink-0 md:px-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx(SidebarTrigger, {}),
      /* @__PURE__ */ jsx("span", { className: "font-semibold text-slate-800 text-sm hidden sm:inline-block", children: "UBMI APPS" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-1 items-center justify-end gap-4", children: /* @__PURE__ */ jsx(GlobalBranchFilter, { compact: true }) })
  ] });
};
const SweetAlert = ({ type, message, keys }) => {
  const MySwal = withReactContent(Swal);
  useEffect(() => {
    MySwal.fire({
      position: "top-end",
      icon: type,
      title: message || (type === "error" ? "Terjadi Kesalahan Silahkan hub IT." : "Anda Telah Melakukan Perubahan"),
      showConfirmButton: false,
      timer: 2e3
    });
  }, [type, message, keys]);
  return null;
};
function Authenticated({ header, children, loading = false }) {
  const { errors, flash, auth } = usePage().props;
  return /* @__PURE__ */ jsxs(SidebarProvider, { children: [
    Object.keys(errors).length > 0 && /* @__PURE__ */ jsx(SweetAlert, { type: "error", message: errors[0], keys: flash }),
    flash.message && /* @__PURE__ */ jsx(SweetAlert, { type: "success", message: flash.message, keys: flash }),
    /* @__PURE__ */ jsx(Loading, { show: loading }),
    /* @__PURE__ */ jsx(AppSidebar, {}),
    /* @__PURE__ */ jsxs(SidebarInset, { children: [
      /* @__PURE__ */ jsx(Navbar, { auth, header }),
      /* @__PURE__ */ jsx("main", { className: "flex-1 px-4 py-6 md:px-6 bg-white min-h-[calc(100vh-3.5rem)]", children })
    ] })
  ] });
}
export {
  Authenticated as A
};
