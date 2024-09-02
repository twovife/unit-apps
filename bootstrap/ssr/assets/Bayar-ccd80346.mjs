import { j as jsxs, a as jsx } from "../ssr.mjs";
import { L as LinkButton } from "./LinkButton-c1a6bd65.mjs";
import { useForm, Head } from "@inertiajs/react";
import dayjs from "dayjs";
import "react";
import { NumericFormat } from "react-number-format";
import { M as MobileLayout } from "./MobileLayout-f2211a20.mjs";
import { I as InputLabel } from "./InputLabel-20ddd95c.mjs";
import { T as TextInput } from "./TextInput-11198f62.mjs";
import CurrencyInput from "react-currency-input-field";
import { u as useServerFilter } from "./useServerFilter-295b27f7.mjs";
import { P as PrimaryButton } from "./PrimaryButton-e2c4c1f4.mjs";
import { C as Checkbox } from "./Checkbox-d7000d9c.mjs";
import { I as InputError } from "./InputError-3b072368.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "./Loading-649771fa.mjs";
import "react-dom";
import "@headlessui/react";
import "./SweetAlert-290d4aa4.mjs";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-icons";
import "./utils-efa289ef.mjs";
import "clsx";
import "tailwind-merge";
import "sweetalert2";
import "sweetalert2-react-content";
import "hamburger-react";
import "@radix-ui/react-dialog";
import "class-variance-authority";
import "./button-9a023ace.mjs";
import "@radix-ui/react-slot";
import "lucide-react";
const Bayar = ({ loan, ...props }) => {
  var _a;
  const { status_angsuran } = useServerFilter();
  status_angsuran.filter(
    (item) => item.value >= loan.status
  );
  const { data, setData, post, processing, errors, reset } = useForm({
    danatitipan: false,
    jumlah: 0,
    pembayaran_date: ""
  });
  console.log(errors);
  const handleOnChange = (e) => {
    setData(
      e.target.name,
      e.target.type === "checkbox" ? e.target.checked : e.target.value
    );
  };
  const onHandleCurencyChange = (value, name) => {
    setData(name, parseInt(value));
  };
  const onSubmitCreate = (e) => {
    e.preventDefault();
    post(props.post_route, {
      onSuccess: () => reset()
    });
  };
  let pinjaman = loan.pinjaman;
  return /* @__PURE__ */ jsxs(
    MobileLayout,
    {
      auth: props.auth,
      errors: props.errors,
      header: "Angsuran Nasabah",
      loading: processing,
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Buku Transaksi" }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white/30 rounded shadow w-full p-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex w-full justify-between items-center", children: [
            /* @__PURE__ */ jsx("div", { className: "font-semibold", children: "Bayar Angsuran" }),
            /* @__PURE__ */ jsx("div", { className: "font-semibold", children: /* @__PURE__ */ jsx(
              LinkButton,
              {
                as: "a",
                href: props.back_button,
                color: "blue",
                title: "Back"
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "overflow-auto", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex-1 flex justify-between items-center", children: [
                  /* @__PURE__ */ jsx("div", { children: "Nomor" }),
                  /* @__PURE__ */ jsx("div", { children: ":" })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "flex-[2]", children: loan.id })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex-1 flex justify-between items-center", children: [
                  /* @__PURE__ */ jsx("div", { children: "Nasabah" }),
                  /* @__PURE__ */ jsx("div", { children: ":" })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "flex-[2]", children: loan.customer.nama })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex-1 flex justify-between items-center", children: [
                  /* @__PURE__ */ jsx("div", { children: "Alamat" }),
                  /* @__PURE__ */ jsx("div", { children: ":" })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "flex-[2]", children: loan.customer.alamat })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex-1 flex justify-between items-center", children: [
                  /* @__PURE__ */ jsx("div", { children: "NIK" }),
                  /* @__PURE__ */ jsx("div", { children: ":" })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "flex-[2]", children: loan.customer.nik })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex-1 flex justify-between items-center", children: [
                  /* @__PURE__ */ jsx("div", { children: "Kelompok | Mantri" }),
                  /* @__PURE__ */ jsx("div", { children: ":" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex-[2]", children: [
                  loan.kelompok,
                  " | ",
                  loan.droper.nama_karyawan
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex-1 flex justify-between items-center", children: [
                  /* @__PURE__ */ jsx("div", { children: "Tanggal Drop" }),
                  /* @__PURE__ */ jsx("div", { children: ":" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex-[2]", children: [
                  loan.hari,
                  " |",
                  " ",
                  dayjs(loan.tanggal_drop).format("DD-MM-YYYY")
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex-1 flex justify-between items-center", children: [
                  /* @__PURE__ */ jsx("div", { children: "Pinjaman" }),
                  /* @__PURE__ */ jsx("div", { children: ":" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex-[2]", children: [
                  /* @__PURE__ */ jsx(
                    NumericFormat,
                    {
                      value: loan.pinjaman,
                      displayType: "text",
                      thousandSeparator: ",",
                      prefix: "Rp. "
                    }
                  ),
                  " ",
                  "|",
                  " ",
                  loan.status == 1 ? /* @__PURE__ */ jsx("span", { className: "text-green-500", children: "Normal" }) : loan.status == 2 ? /* @__PURE__ */ jsx("span", { className: "text-amber-500", children: "CM" }) : loan.status == 3 ? /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "MB" }) : /* @__PURE__ */ jsx("span", { className: "text-white bg-black p-1", children: "ML" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "mt-3", children: /* @__PURE__ */ jsx("div", { className: "shadow text-xs rounded overflow-auto border max-h-[50vh]", children: /* @__PURE__ */ jsxs("table", { className: "w-full bg-white", children: [
              /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "text-center", children: [
                /* @__PURE__ */ jsx("th", { className: "p-2", children: "No" }),
                /* @__PURE__ */ jsx("th", { className: "p-2", children: "Tanggal Angsur" }),
                /* @__PURE__ */ jsx("th", { className: "p-2", children: "Jumlah" }),
                /* @__PURE__ */ jsx("th", { className: "p-2", children: "Saldo" })
              ] }) }),
              /* @__PURE__ */ jsx("tbody", { className: "text-center", children: (_a = loan.angsuran) == null ? void 0 : _a.map((item, key) => {
                pinjaman = pinjaman - item.jumlah;
                return /* @__PURE__ */ jsxs(
                  "tr",
                  {
                    className: "odd:bg-gray-200",
                    children: [
                      /* @__PURE__ */ jsx("td", { className: "px-2 py-1", children: key + 1 }),
                      /* @__PURE__ */ jsx("td", { className: "px-2 py-1", children: dayjs(
                        item.pembayaran_date
                      ).format("DD-MM-YY") }),
                      /* @__PURE__ */ jsx("td", { className: "px-2 py-1", children: /* @__PURE__ */ jsx(
                        NumericFormat,
                        {
                          value: item.jumlah,
                          displayType: "text",
                          thousandSeparator: ","
                        }
                      ) }),
                      /* @__PURE__ */ jsx("td", { className: "px-2 py-1", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-center gap-2", children: [
                        /* @__PURE__ */ jsx("div", { className: "text-end flex-1", children: /* @__PURE__ */ jsx(
                          NumericFormat,
                          {
                            value: pinjaman,
                            displayType: "text",
                            thousandSeparator: ","
                          }
                        ) }),
                        /* @__PURE__ */ jsx("div", { className: "text-start flex-1", children: item.status == 1 ? /* @__PURE__ */ jsx("span", { className: "text-green-500", children: "Normal" }) : item.status == 2 ? /* @__PURE__ */ jsx("span", { className: "text-amber-500", children: "CM" }) : item.status == 3 ? /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "MB" }) : /* @__PURE__ */ jsx("span", { className: "text-white bg-black p-1", children: "ML" }) })
                      ] }) })
                    ]
                  },
                  key
                );
              }) })
            ] }) }) }),
            props.batasan.is_paid == 0 ? /* @__PURE__ */ jsxs("form", { onSubmit: onSubmitCreate, className: "mt-3", children: [
              /* @__PURE__ */ jsx("div", { children: "Input Data" }),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-3 flex-wrap", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsx(InputLabel, { value: "Tanggal" }),
                  /* @__PURE__ */ jsx(
                    TextInput,
                    {
                      type: "date",
                      onChange: handleOnChange,
                      max: props.batasan.maxdate,
                      min: props.batasan.mindate,
                      className: "block mt-1 w-full",
                      id: "pembayaran_date",
                      name: "pembayaran_date",
                      value: data.pembayaran_date
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    InputError,
                    {
                      message: errors.pembayaran_date,
                      className: "mt-2"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsx(InputLabel, { value: "Jumlah" }),
                  /* @__PURE__ */ jsx(
                    CurrencyInput,
                    {
                      name: "jumlah",
                      id: "jumlah",
                      className: `border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm text-gray-800 dark:bg-gray-800 dark:text-gray-200 disabled:bg-black/10 dark:disabled:bg-white/10 block w-full mt-1`,
                      allowDecimals: false,
                      prefix: "Rp. ",
                      required: true,
                      onValueChange: onHandleCurencyChange,
                      value: data.jumlah,
                      placeholder: "Inputkan angka tanpa sparator"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    InputError,
                    {
                      message: errors.jumlah,
                      className: "mt-2"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "mt-3 px-2", children: /* @__PURE__ */ jsx("div", { className: "inline-block", children: /* @__PURE__ */ jsxs("label", { className: "flex items-center justify-center font-bold", children: [
                /* @__PURE__ */ jsx(
                  Checkbox,
                  {
                    name: "danatitipan",
                    value: data.danatitipan,
                    onChange: handleOnChange
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "ml-2 text-sm text-gray-600", children: "Dana Titipan?" })
              ] }) }) }),
              /* @__PURE__ */ jsxs("div", { className: "mt-3 flex justify-between items-center", children: [
                /* @__PURE__ */ jsx(PrimaryButton, { title: "Submit", type: "submit" }),
                /* @__PURE__ */ jsx(
                  "a",
                  {
                    target: "_blank",
                    href: `https://api.whatsapp.com/send?phone=628563158592&text=Ralat%20Angsuran%20Nomor%20${loan.id}%20%2C%20(%20ganti%20ketik%20ralatnya%20dimana%20)`,
                    className: "text-xs py-1 px-2 border border-gray-600 focus:bg-gray-600 focus:text-white rounded flex justify-center items-center",
                    children: /* @__PURE__ */ jsx("span", { children: "lapor" })
                  }
                )
              ] })
            ] }) : /* @__PURE__ */ jsxs("div", { className: "mt-3", children: [
              /* @__PURE__ */ jsx("div", { children: "Sudah Ada Pembayaran Untuk Hari Ini" }),
              /* @__PURE__ */ jsxs("small", { children: [
                "*Laporkan jika ada yang eror",
                /* @__PURE__ */ jsx(
                  "a",
                  {
                    target: "_blank",
                    href: `https://api.whatsapp.com/send?phone=628563158592&text=Ralat%20Angsuran%20Nomor%20${loan.id}%20%2C%20(%20ganti%20ketik%20ralatnya%20dimana%20)`,
                    className: "text-xs ml-1 text-blue-700 underline",
                    children: /* @__PURE__ */ jsx("span", { children: "disini" })
                  }
                )
              ] })
            ] })
          ] })
        ] })
      ]
    }
  );
};
export {
  Bayar as default
};
