import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-8a8NNlps.js";
import { useState, useEffect } from "react";
import { C as Card, d as CardContent, a as CardHeader, b as CardTitle } from "./card-WipCscFv.js";
import axios from "axios";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-Dwx5kZ1B.js";
import dayjs from "dayjs";
import { F as FormatNumbering } from "./FormatNumbering-CTESXtjE.js";
import { B as Badge } from "./badge-CBTu05xj.js";
import BayarAngsuran from "./BayarAngsuran-Clafpzjb.js";
import JenisNasabah from "./JenisNasabah-B8ab0q_P.js";
import DeleteAngsuran from "./DeleteAngsuran-CW726sUL.js";
import { usePage } from "@inertiajs/react";
import { N as NoEditOverlay } from "./NoEditOverlay-GIB1h_zq.js";
import { Toaster as Toaster$1, toast } from "sonner";
import { useTheme } from "next-themes";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-BAdW7Ajv.js";
import { Copy } from "lucide-react";
import "./button-MTjEwktD.js";
import Pengajuan from "./Pengajuan-BGZhLqwe.js";
import "./Loading-DPcVnbEk.js";
import "react-dom";
import { g as getLastDateForHari } from "./utils-DzFuPzol.js";
import "@radix-ui/react-dialog";
import "react-number-format";
import "class-variance-authority";
import "./label-F4MKz6SO.js";
import "@radix-ui/react-label";
import "./input-BHD-__le.js";
import "react-currency-input-field";
import "./Checkbox-DLnjqb3e.js";
import "./InputError-cRVTeK4i.js";
import "./InputLabel-BhdXf1ED.js";
import "./PrimaryButton-BHWercwM.js";
import "./SelectList-DrCNDu1u.js";
import "./TextInput-GCtCMl-T.js";
import "@radix-ui/react-tabs";
import "@radix-ui/react-slot";
import "./accordion-EOARN4Ag.js";
import "@radix-ui/react-accordion";
import "@radix-ui/react-icons";
import "./WhiteOff-BL9r_Gno.js";
import "./PengajuanLama-N_52jNMR.js";
import "@headlessui/react";
import "clsx";
import "tailwind-merge";
const StatusPinjaman = ({ value = "normal" }) => {
  const valielue = value == null ? void 0 : value.toLowerCase();
  switch (valielue) {
    case "normal":
      return /* @__PURE__ */ jsx(Badge, { variant: "outline", children: value });
    case "cm":
      return /* @__PURE__ */ jsx(Badge, { variant: "yellow", children: value });
    case "mb":
      return /* @__PURE__ */ jsx(Badge, { variant: "destructive", children: value });
    case "ml":
      return /* @__PURE__ */ jsx(Badge, { children: value });
    case "lunas":
      return /* @__PURE__ */ jsx(Badge, { variant: "green", children: value });
    case "belum":
      return /* @__PURE__ */ jsx(Badge, { variant: "outline", children: value });
    default:
      return /* @__PURE__ */ jsx(Badge, { children: value });
  }
};
const Toaster = ({
  ...props
}) => {
  const { theme = "system" } = useTheme();
  return /* @__PURE__ */ jsx(
    Toaster$1,
    {
      theme,
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
const Action = ({ datas, show = false, onClosed, triggeredId }) => {
  var _a, _b;
  const {
    auth,
    server_filter: { closed_transaction }
  } = usePage().props;
  (_a = auth == null ? void 0 : auth.permissions) == null ? void 0 : _a.includes("can-edit");
  const [loading, setLoading] = useState(false);
  const [erorAxios, setErorAxios] = useState(false);
  const isCreator = (_b = auth == null ? void 0 : auth.permissions) == null ? void 0 : _b.includes("can-create");
  const [customerData, setCustomerData] = useState({});
  const [pemutihan, setPemutihan] = useState(null);
  const [instalment, setInstalment] = useState([]);
  const onNikSubmit = async (triggeredId2) => {
    setLoading(true);
    setErorAxios();
    await axios({
      method: "get",
      url: route("pinjaman.get_loan_pinjaman", triggeredId2)
    }).then(function({ data }) {
      setLoading(false);
      setCustomerData(data.pinjaman);
      setInstalment(data.instalment);
      setPemutihan(data.pemutihan);
    }).catch(function({ response }) {
      setErorAxios(true);
    });
  };
  useEffect(() => {
    if (triggeredId) {
      onNikSubmit(triggeredId);
    }
  }, [triggeredId, datas]);
  const modalIsClosed = () => {
    onClosed();
    setCustomerData({});
    setInstalment([]);
    setPemutihan(null);
  };
  const gateValue = customerData.lunas == true ? "Pinjaman Sudah Lunas" : !isCreator ? "User Tidak Dapat Digunakan Untuk Mengedit" : null;
  const pengganti = customerData.pengajuan_pengganti;
  const tanggalKoleksiHariIni = getLastDateForHari(customerData.hari);
  const menungguDropPengganti = pengganti && pengganti.drop_date === tanggalKoleksiHariIni;
  const angsuranGateValue = gateValue ?? (menungguDropPengganti ? `Menunggu hasil drop pengajuan pengganti (tanggal ${dayjs(pengganti.drop_date).format("DD-MM-YYYY")}) - input manual dikunci sementara supaya tidak bentrok dengan pelunasan otomatis.` : null);
  return /* @__PURE__ */ jsx(Dialog, { open: show, onOpenChange: (open) => open ? "" : modalIsClosed(), children: /* @__PURE__ */ jsxs(DialogContent, { className: `w-[95vw] p-1 lg:p-6`, children: [
    /* @__PURE__ */ jsx(DialogHeader, { className: "max-h-10", children: /* @__PURE__ */ jsx(DialogTitle, { className: "p-2", children: "Isi Angsurans" }) }),
    /* @__PURE__ */ jsxs("div", { className: "h-[80vh] overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin", children: [
      /* @__PURE__ */ jsx(Toaster, {}),
      /* @__PURE__ */ jsx(Card, { className: "w-full", children: /* @__PURE__ */ jsx(CardContent, { className: "p-1 pt-4 lg:p-5", children: /* @__PURE__ */ jsxs(Tabs, { defaultValue: "input", className: "w-full", children: [
        /* @__PURE__ */ jsxs(TabsList, { children: [
          /* @__PURE__ */ jsx(TabsTrigger, { value: "input", children: "Input Angsuran" }),
          /* @__PURE__ */ jsx(TabsTrigger, { value: "detail", children: "Detail Pinjaman" })
        ] }),
        /* @__PURE__ */ jsxs(TabsContent, { value: "input", className: "relative mt-3", children: [
          angsuranGateValue && /* @__PURE__ */ jsx(NoEditOverlay, { value: angsuranGateValue }),
          loading ? /* @__PURE__ */ jsx("div", { children: "Loading" }) : /* @__PURE__ */ jsx(
            BayarAngsuran,
            {
              triggeredId: customerData.id,
              triggeredPinjaman: customerData,
              instalment
            }
          )
        ] }),
        /* @__PURE__ */ jsx(TabsContent, { value: "detail", className: "mt-3", children: /* @__PURE__ */ jsx(LoanDetail, { customerData }) })
      ] }) }) }),
      /* @__PURE__ */ jsx("div", { className: "w-full mt-3", children: /* @__PURE__ */ jsxs(Card, { className: "w-full", children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Rincian Angsuran" }) }),
        /* @__PURE__ */ jsxs(CardContent, { className: "p-1 lg:p-5", children: [
          pemutihan && /* @__PURE__ */ jsx("div", { className: "w-full", children: /* @__PURE__ */ jsxs(Table, { className: "text-xs", children: [
            /* @__PURE__ */ jsx(TableHeader, { className: "bg-gray-200", children: /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Tanggal Pemutihan" }),
              /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Nominal Pemutihan" })
            ] }) }),
            /* @__PURE__ */ jsx(TableBody, { children: /* @__PURE__ */ jsxs(TableRow, { className: "text-center", children: [
              /* @__PURE__ */ jsx(TableCell, { children: dayjs(pemutihan.transaction_date).format(
                "DD-MM-YYYY"
              ) }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(
                FormatNumbering,
                {
                  className: "text-center",
                  value: pemutihan.nominal
                }
              ) })
            ] }) })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "w-full overflow-auto", children: /* @__PURE__ */ jsxs(Table, { className: "text-xs", children: [
            /* @__PURE__ */ jsx(TableHeader, { className: "bg-gray-200", children: /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Action" }),
              /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Tanggal" }),
              /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Jumlah" }),
              /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Saldo" }),
              /* @__PURE__ */ jsx(TableHead, { className: "hidden text-center lg:table-cell", children: "Mantri" }),
              /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Status" })
            ] }) }),
            /* @__PURE__ */ jsx(TableBody, { children: Object.keys(customerData).length !== 0 ? instalment.map((item) => /* @__PURE__ */ jsxs(TableRow, { className: "text-center", children: [
              /* @__PURE__ */ jsx(TableCell, { children: (!closed_transaction || closed_transaction <= item.transaction_date) && /* @__PURE__ */ jsx(DeleteAngsuran, { id: item.id }) }),
              /* @__PURE__ */ jsx(TableCell, { className: "whitespace-nowrap", children: dayjs(item.transaction_date).format("DD-MM-YY") }),
              /* @__PURE__ */ jsx(
                TableCell,
                {
                  className: `${item.danatitipan == 1 ? "text-red-500 font-semibold" : ""}`,
                  children: /* @__PURE__ */ jsx(FormatNumbering, { value: item.nominal })
                }
              ),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(FormatNumbering, { value: item.saldo }) }),
              /* @__PURE__ */ jsx(TableCell, { className: "hidden lg:block", children: item.mantri }),
              /* @__PURE__ */ jsxs(TableCell, { children: [
                " ",
                /* @__PURE__ */ jsx(StatusPinjaman, { value: item.status })
              ] })
            ] })) : erorAxios ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { className: "font-semibold text-red-500", children: "TERJADI KESALAHAN SAAT PENGAMBILAN DATA, MOHON REFRESH BROWSER" }) }) : /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { children: "Menunggu data . . ." }) }) })
          ] }) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "relative grid w-full grid-cols-1 gap-3 mt-3", children: [
        gateValue && /* @__PURE__ */ jsx(NoEditOverlay, { value: gateValue }),
        loading ? /* @__PURE__ */ jsx("div", { children: "Loading" }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("div", { className: "min-w-0", children: /* @__PURE__ */ jsx(
            Pengajuan,
            {
              triggeredId: customerData.id,
              triggeredPinjaman: customerData,
              instalment
            }
          ) }),
          /* @__PURE__ */ jsx("div", { className: "min-w-0", children: /* @__PURE__ */ jsx(JenisNasabah, { loan: customerData }) })
        ] })
      ] })
    ] })
  ] }) });
};
const Field = ({ label, children }) => /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
  /* @__PURE__ */ jsx("div", { className: "text-[10px] font-medium uppercase tracking-wide text-muted-foreground", children: label }),
  /* @__PURE__ */ jsx("div", { className: "text-sm leading-tight break-words text-foreground", children: children || /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "—" }) })
] });
const tanggal = (value, format = "DD MMM YYYY") => value ? dayjs(value).format(format) : null;
const LoanDetail = ({ customerData }) => {
  const sooners = (value) => {
    toast("Nik Telah Dicopy");
    navigator.clipboard.writeText(value);
  };
  if (!customerData || Object.keys(customerData).length === 0) {
    return /* @__PURE__ */ jsx("p", { className: "py-4 text-sm text-center text-muted-foreground", children: "Menunggu data . . ." });
  }
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "px-3 py-3 border-b bg-muted/40", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold leading-tight text-foreground", children: customerData.nama || /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "—" }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 shrink-0", children: [
          /* @__PURE__ */ jsx(StatusPinjaman, { value: customerData.status_pinjaman }),
          /* @__PURE__ */ jsx(StatusPinjaman, { value: customerData.lunas ? "Lunas" : "Belum" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-1 text-sm text-foreground", children: customerData.alamat || /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "—" }) }),
      /* @__PURE__ */ jsxs("div", { className: "mt-0.5 flex items-center gap-2 text-xs tabular-nums text-muted-foreground", children: [
        /* @__PURE__ */ jsxs("span", { children: [
          "NIK ",
          customerData.nik || "—"
        ] }),
        customerData.nik && /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            className: "text-blue-500",
            onClick: () => sooners(customerData.nik),
            children: /* @__PURE__ */ jsx(Copy, { className: "h-3.5 w-3.5" })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "px-3 py-3 border-b", children: [
      /* @__PURE__ */ jsx("div", { className: "text-[10px] font-medium uppercase tracking-wide text-muted-foreground", children: "Pinjaman" }),
      /* @__PURE__ */ jsx(
        FormatNumbering,
        {
          value: customerData.pinjaman,
          className: "text-base font-bold leading-tight text-start tabular-nums text-foreground"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 px-3 py-3 border-b gap-x-4 gap-y-3", children: [
      /* @__PURE__ */ jsx(Field, { label: "Nomor", children: customerData.id }),
      /* @__PURE__ */ jsx(Field, { label: "Pinjaman Ke", children: customerData.pinjaman_ke }),
      /* @__PURE__ */ jsx(Field, { label: "Unit", children: customerData.branch }),
      /* @__PURE__ */ jsx(Field, { label: "Kelompok", children: customerData.kelompok }),
      /* @__PURE__ */ jsx(Field, { label: "Hari", children: /* @__PURE__ */ jsx("span", { className: "capitalize", children: customerData.hari }) }),
      /* @__PURE__ */ jsx(Field, { label: "Mantri", children: customerData.mantri })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 px-3 py-3 border-b gap-x-4 gap-y-3", children: [
      /* @__PURE__ */ jsx(Field, { label: "Tanggal Pengajuan", children: tanggal(customerData.tanggal_pengajuan) }),
      /* @__PURE__ */ jsx(Field, { label: "Diinput Oleh", children: customerData.diinput_oleh }),
      /* @__PURE__ */ jsx(Field, { label: "Tanggal ACC", children: tanggal(customerData.tanggal_acc) }),
      /* @__PURE__ */ jsx(Field, { label: "ACC Oleh", children: customerData.acc_oleh }),
      /* @__PURE__ */ jsx(Field, { label: "Tanggal Drop", children: tanggal(customerData.tanggal_drop) }),
      /* @__PURE__ */ jsx(Field, { label: "Drop Oleh", children: customerData.drop_oleh })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 px-3 py-3 gap-x-4 gap-y-3", children: [
      /* @__PURE__ */ jsx(Field, { label: "Ket", children: customerData.notes }),
      /* @__PURE__ */ jsx(Field, { label: "Keluar Target", children: tanggal(customerData.out_date, "DD/MM") })
    ] })
  ] });
};
export {
  Action as default
};
