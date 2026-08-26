import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { I as InputError } from "./InputError-cRVTeK4i.js";
import { L as Loading } from "./Loading-DPcVnbEk.js";
import { B as Button } from "./button-MTjEwktD.js";
import "./card-WipCscFv.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-BAdW7Ajv.js";
import { I as Input } from "./input-BHD-__le.js";
import { L as Label } from "./label-F4MKz6SO.js";
import { usePage, useForm } from "@inertiajs/react";
import axios from "axios";
import { Search, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import CurrencyInput from "react-currency-input-field";
import { u as useOptionGenerator, S as SelectList } from "./SelectComponent-DUhN-d41.js";
import RiwayatPengajuan from "./RiwayatPengajuan-xZzAsLuI.js";
import dayjs from "dayjs";
import { C as Checkbox } from "./Checkbox-DLnjqb3e.js";
import { F as FormatNumbering } from "./FormatNumbering-CTESXtjE.js";
import { N as NoEditOverlay } from "./NoEditOverlay-GIB1h_zq.js";
import { T as TanggalKerja } from "./TanggalKerja-0Ehwsu9U.js";
import "./table-Dwx5kZ1B.js";
import "./badge-CBTu05xj.js";
import "react-dom";
import "@headlessui/react";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-DzFuPzol.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-tabs";
import "@radix-ui/react-label";
import "@tanstack/react-table";
import "./BadgeStatus-Cj6LHx_M.js";
import "react-number-format";
import "./useHariLibur-Da-oW-is.js";
import "./calendar-BJ3LWb_A.js";
import "react-day-picker";
import "@radix-ui/react-icons";
import "./popover-B9xSK2Gy.js";
import "@radix-ui/react-popover";
const NewNasabah = ({
  onClosed,
  generateAngsuran = false,
  submitUrl,
  typeInput = "number"
}) => {
  var _a, _b;
  const { printUrl } = usePage().props;
  const { auth } = usePage().props;
  const isCreator = (_a = auth == null ? void 0 : auth.permissions) == null ? void 0 : _a.includes("can-create");
  const isCanShowKelompok = (_b = auth == null ? void 0 : auth.permissions) == null ? void 0 : _b.includes("view-all-groups");
  const [newGenerate, setNewGenerate] = useState(null);
  useEffect(() => {
    setNewGenerate(printUrl.url);
  }, [printUrl.timestamp]);
  const { optKelompok } = useOptionGenerator();
  const { data, setData, post, errors, processing, reset } = useForm({
    isActiveMember: false,
    nik: "",
    request_date: "",
    tanggal_drop: "",
    no_kk: "",
    nama: "",
    alamat: "",
    kelompok: "",
    request_nominal: 0,
    angsuran: []
  });
  const [elements, setElements] = useState([]);
  const [calculatePinjaman, setCalculatePinjaman] = useState(0);
  useEffect(() => {
    const totalPinjaman = parseInt(data.request_nominal ?? 0) * 1.3;
    const totalAngsuran = data.angsuran.reduce((acc, curr) => {
      const nominal = parseInt(curr.nominal, 10);
      return acc + (isNaN(nominal) ? 0 : nominal);
    }, 0);
    setCalculatePinjaman(totalPinjaman - totalAngsuran);
  }, [data.angsuran, data.request_nominal]);
  useEffect(() => {
    setElements([]);
  }, [data.tanggal_drop]);
  useEffect(() => {
    setData("angsuran", elements);
  }, [elements]);
  const addElement = () => {
    const lastTransactionDate = elements.length > 0 ? dayjs(elements[elements.length - 1].transaction_date).add(1, "week").format("YYYY-MM-DD") : data.tanggal_drop ? dayjs(data.tanggal_drop).add(1, "week").format("YYYY-MM-DD") : "";
    setElements([
      ...elements,
      { id: Date.now(), transaction_date: lastTransactionDate }
    ]);
  };
  const removeElement = (id) => {
    setElements(elements.filter((element) => element.id !== id));
  };
  const onInputElementChange = (id, name, value) => {
    setElements(
      elements.map(
        (element) => element.id === id ? { ...element, [name]: value } : element
      )
    );
  };
  const onHandleElementCurencyChange = (value, name, id) => {
    setElements(
      elements.map(
        (element) => element.id === id ? { ...element, [name]: value } : element
      )
    );
  };
  const [nik, setNik] = useState("");
  const [loading, setLoading] = useState(false);
  const [erorAxios, setErorAxios] = useState();
  const [customerData, setCustomerData] = useState([]);
  const [mixDate, setMixDate] = useState();
  useEffect(() => {
    setMixDate(data.request_date);
    setData((prevData) => ({
      ...prevData,
      tanggal_drop: dayjs(data.request_date).add(1, "week").format("YYYY-MM-DD")
    }));
  }, [data.request_date]);
  const onHandleCurencyChange = (value, name, float) => {
    setData(name, value);
  };
  const onInputChange = (e) => {
    const { name, value } = e.target;
    setData(name, value);
  };
  const onNikChange = (e) => {
    const { name, value } = e.target;
    setCustomerData([]);
    setNik(value);
  };
  const controllerRef = useRef(null);
  const onNikSubmit = async (e) => {
    var _a2, _b2;
    e.preventDefault();
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    const controller = new AbortController();
    controllerRef.current = controller;
    reset();
    setLoading(true);
    setErorAxios();
    try {
      const { data: data2 } = await axios.post(
        route("transaction.nasabah_buku_transaksi"),
        { nik },
        { signal: controller.signal }
      );
      setLoading(false);
      setData((prevData) => ({
        ...prevData,
        nik: data2.return_nik,
        isActiveMember: !!data2.data
      }));
      if (data2.data) {
        setCustomerData(data2.data);
      } else {
        setCustomerData([]);
      }
    } catch (error) {
      if (axios.isCancel(error)) ;
      else {
        setErorAxios(((_b2 = (_a2 = error.response) == null ? void 0 : _a2.data) == null ? void 0 : _b2.message) || "Terjadi kesalahan.");
        setLoading(false);
      }
    }
  };
  const modalIsClosed = (e) => {
    onClosed();
    reset();
  };
  const onSubmitCreate = (e) => {
    e.preventDefault();
    post(submitUrl, {
      onSuccess: () => {
        modalIsClosed();
      },
      replace: true
    });
  };
  const buttonValue = [
    { value: 3e5, label: "300rb" },
    { value: 4e5, label: "400rb" },
    { value: 5e5, label: "500rb" },
    { value: 7e5, label: "700rb" },
    { value: 8e5, label: "800rb" },
    { value: 1e6, label: "1 jt" },
    { value: 13e5, label: "1,3 jt" },
    { value: 15e5, label: "1,5 jt" },
    { value: 2e6, label: "2 jt" }
  ];
  const buttonValueClick = (e) => {
    const value = e.target.getAttribute("data-value");
    setData("request_nominal", value);
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col w-full gap-5 xl:flex-row", children: [
    /* @__PURE__ */ jsx(Loading, { show: loading || processing }),
    /* @__PURE__ */ jsxs("div", { className: "w-full xl:w-[30rem] xl:shrink-0 space-y-4", children: [
      /* @__PURE__ */ jsxs("fieldset", { className: "p-4 border rounded-lg bg-muted/20", children: [
        /* @__PURE__ */ jsx("legend", { className: "px-1 -ml-1 text-xs font-semibold tracking-wide uppercase text-muted-foreground", children: "Cek NIK Nasabah" }),
        /* @__PURE__ */ jsxs("form", { className: "w-full", onSubmit: onNikSubmit, children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "cari-nik", children: "NIK" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "cari-nik",
                type: typeInput,
                name: "nik",
                value: nik,
                onChange: onNikChange,
                placeholder: "16 digit NIK",
                className: "tabular-nums"
              }
            ),
            /* @__PURE__ */ jsxs(Button, { size: "sm", className: "shrink-0", children: [
              /* @__PURE__ */ jsx(Search, { className: "w-4 h-4 mr-1" }),
              "Cari"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mt-2", children: [
            /* @__PURE__ */ jsxs(
              "span",
              {
                className: `inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium tabular-nums ${nik.length === 16 ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`,
                children: [
                  nik.length,
                  " / 16 digit"
                ]
              }
            ),
            nik.length > 0 && nik.length !== 16 && /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "NIK harus tepat 16 digit" })
          ] }),
          erorAxios && /* @__PURE__ */ jsx(InputError, { message: erorAxios, className: "mt-2" }),
          newGenerate && /* @__PURE__ */ jsx(
            "a",
            {
              href: newGenerate ?? "#",
              target: "_blank",
              rel: "noreferrer",
              className: "inline-block mt-2 text-sm underline text-primary underline-offset-2",
              children: "Lihat transaksi terakhir"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        !(nik && data.nik == nik) && /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center gap-1 px-6 py-10 text-center border border-dashed rounded-lg", children: [
          /* @__PURE__ */ jsx(Search, { className: "w-5 h-5 mb-1 text-muted-foreground" }),
          /* @__PURE__ */ jsx("div", { className: "text-sm font-medium", children: "Belum ada nasabah dipilih" }),
          /* @__PURE__ */ jsx("p", { className: "max-w-xs text-xs text-muted-foreground", children: "Cari NIK di atas dulu. Detail pinjaman terbuka setelah nasabahnya ketemu." })
        ] }),
        nik && data.nik == nik && /* @__PURE__ */ jsxs("fieldset", { className: "w-full p-4 border rounded-lg", children: [
          !isCreator && /* @__PURE__ */ jsx(NoEditOverlay, { value: "User Tidak Dapat Digunakan Untuk Menambah Pinjaman" }),
          /* @__PURE__ */ jsx("legend", { className: "px-1 -ml-1 text-xs font-semibold tracking-wide uppercase text-muted-foreground", children: "Detail Pinjaman" }),
          /* @__PURE__ */ jsxs("form", { className: "w-full", onSubmit: onSubmitCreate, children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-5 lg:flex-row", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
                  /* @__PURE__ */ jsxs("div", { className: "w-full mb-3", children: [
                    /* @__PURE__ */ jsx(Label, { children: "Tanggal Pengajuan" }),
                    /* @__PURE__ */ jsx(
                      TanggalKerja,
                      {
                        name: "request_date",
                        required: true,
                        value: data.request_date,
                        onChange: onInputChange
                      }
                    ),
                    /* @__PURE__ */ jsx(InputError, { message: errors.request_date })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "w-full mb-3", children: [
                    /* @__PURE__ */ jsx(Label, { children: "Tanggal Drop" }),
                    /* @__PURE__ */ jsx(
                      TanggalKerja,
                      {
                        name: "tanggal_drop",
                        min: mixDate,
                        required: true,
                        value: data.tanggal_drop,
                        onChange: onInputChange
                      }
                    ),
                    /* @__PURE__ */ jsx(InputError, { message: errors.tanggal_drop })
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "w-full mb-3", children: data.request_date && data.request_date == data.tanggal_drop ? /* @__PURE__ */ jsx("span", { className: "inline-flex items-center rounded-md bg-amber-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-amber-800", children: "Drop baru — cair hari pengajuan" }) : /* @__PURE__ */ jsx("span", { className: "inline-flex items-center rounded-md bg-sky-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-sky-800", children: "Pengajuan drop" }) }),
                /* @__PURE__ */ jsxs("div", { className: "w-full mb-3", children: [
                  /* @__PURE__ */ jsx(Label, { optional: true, children: "NIK" }),
                  /* @__PURE__ */ jsx(
                    Input,
                    {
                      type: "text",
                      name: "nik",
                      value: data.nik,
                      disabled: true,
                      onChange: onInputChange
                    }
                  ),
                  /* @__PURE__ */ jsx(InputError, { message: errors.nik })
                ] }),
                !data.isActiveMember ? /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsxs("div", { className: "w-full mb-3", children: [
                    /* @__PURE__ */ jsx(Label, { optional: true, children: "NO KK" }),
                    /* @__PURE__ */ jsx(
                      Input,
                      {
                        type: "text",
                        name: "no_kk",
                        value: data.no_kk,
                        onChange: onInputChange
                      }
                    ),
                    /* @__PURE__ */ jsx(InputError, { message: errors.no_kk })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "w-full mb-3", children: [
                    /* @__PURE__ */ jsx(Label, { children: "Nama" }),
                    /* @__PURE__ */ jsx(
                      Input,
                      {
                        type: "text",
                        name: "nama",
                        value: data.nama,
                        onChange: onInputChange,
                        required: true
                      }
                    ),
                    /* @__PURE__ */ jsx(InputError, { message: errors.nama })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "w-full mb-3", children: [
                    /* @__PURE__ */ jsx(Label, { children: "Alamat" }),
                    /* @__PURE__ */ jsx(
                      Input,
                      {
                        type: "text",
                        name: "alamat",
                        value: data.alamat,
                        onChange: onInputChange,
                        required: true
                      }
                    ),
                    /* @__PURE__ */ jsx(InputError, { message: errors.alamat })
                  ] })
                ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsxs("div", { className: "w-full mb-3", children: [
                    /* @__PURE__ */ jsx(Label, { children: "Nama" }),
                    /* @__PURE__ */ jsx(
                      Input,
                      {
                        type: "text",
                        disabled: true,
                        value: customerData.nama ?? ""
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "w-full mb-3", children: [
                    /* @__PURE__ */ jsx(Label, { children: "Alamat" }),
                    /* @__PURE__ */ jsx(
                      Input,
                      {
                        type: "text",
                        disabled: true,
                        value: customerData.alamat ?? ""
                      }
                    )
                  ] })
                ] }),
                isCanShowKelompok && /* @__PURE__ */ jsxs("div", { className: "w-full mb-3", children: [
                  /* @__PURE__ */ jsx(Label, { children: "Kelompok" }),
                  /* @__PURE__ */ jsx(
                    SelectList,
                    {
                      value: data.kelompok,
                      options: optKelompok,
                      name: "kelompok",
                      nullvalue: true,
                      onChange: onInputChange
                    }
                  ),
                  /* @__PURE__ */ jsx(InputError, { message: errors.kelompok })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "w-full mb-3", children: [
                  /* @__PURE__ */ jsx(Label, { children: "Nominal Pinjaman" }),
                  /* @__PURE__ */ jsx(
                    CurrencyInput,
                    {
                      className: "flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-xs h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                      name: "request_nominal",
                      defaultValue: 0,
                      allowDecimals: false,
                      prefix: "Rp. ",
                      min: 1,
                      required: true,
                      onValueChange: onHandleCurencyChange,
                      value: data.request_nominal,
                      placeholder: "Inputkan angka tanpa sparator"
                    }
                  ),
                  /* @__PURE__ */ jsx(InputError, { message: errors.request_nominal })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "grid grid-cols-4 mb-3 gap-x-2 gap-y-1", children: buttonValue.map((button, key) => /* @__PURE__ */ jsx(
                  Button,
                  {
                    type: "button",
                    size: "xs",
                    "data-value": button.value,
                    onClick: buttonValueClick,
                    children: button.label
                  },
                  key
                )) })
              ] }),
              elements.length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                elements.map((element, key) => /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: "flex flex-col gap-3 mb-3 lg:flex-row",
                    children: [
                      /* @__PURE__ */ jsxs("div", { className: "w-full", children: [
                        /* @__PURE__ */ jsx(Label, { children: "Tanggal Storting" }),
                        /* @__PURE__ */ jsx(
                          TanggalKerja,
                          {
                            name: "transaction_date",
                            min: dayjs(data.tanggal_drop).add(1, "week").format("YYYY-MM-DD"),
                            hariTagih: data.tanggal_drop ? dayjs(data.tanggal_drop).day() : null,
                            required: true,
                            value: element.transaction_date,
                            onChange: (e) => onInputElementChange(
                              element.id,
                              e.target.name,
                              e.target.value
                            )
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "w-full", children: [
                        /* @__PURE__ */ jsx(Label, { children: "Nominal" }),
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-start gap-3", children: [
                          /* @__PURE__ */ jsx("div", { className: "flex-1 min-w-32", children: /* @__PURE__ */ jsx(
                            CurrencyInput,
                            {
                              className: "flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-xs h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                              name: "nominal",
                              defaultValue: 0,
                              allowDecimals: false,
                              prefix: "Rp. ",
                              min: 1,
                              required: true,
                              onValueChange: (value, name) => onHandleElementCurencyChange(
                                parseInt(value),
                                name,
                                element.id
                              ),
                              value: element.nominal,
                              placeholder: "Inputkan angka tanpa sparator"
                            }
                          ) }),
                          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-start gap-1", children: [
                            /* @__PURE__ */ jsx(
                              Checkbox,
                              {
                                name: "dana_titipan",
                                id: `dana_titipan_${element.id}`,
                                checked: element.isActiveMember,
                                onChange: (e) => onInputElementChange(
                                  element.id,
                                  e.target.name,
                                  e.target.checked
                                )
                              }
                            ),
                            /* @__PURE__ */ jsx(
                              Label,
                              {
                                htmlFor: `dana_titipan_${element.id}`,
                                className: "whitespace-nowrap",
                                nomb: true,
                                children: "Dana Titipan"
                              }
                            )
                          ] }),
                          /* @__PURE__ */ jsx(
                            Button,
                            {
                              onClick: () => removeElement(element.id),
                              type: "button",
                              size: "iconsm",
                              variant: "outline",
                              children: /* @__PURE__ */ jsx(X, { className: "w-auto h-3" })
                            }
                          )
                        ] })
                      ] })
                    ]
                  },
                  element.id
                )),
                /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: `flex items-center justify-end gap-3 rounded-md px-3 py-2 text-sm font-semibold tabular-nums ${calculatePinjaman === 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`,
                    children: [
                      /* @__PURE__ */ jsx("span", { children: "Saldo Tersisa" }),
                      /* @__PURE__ */ jsx(FormatNumbering, { value: calculatePinjaman })
                    ]
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-2 pt-3 mt-2 border-t", children: [
              generateAngsuran && data.tanggal_drop && /* @__PURE__ */ jsx(Button, { type: "button", onClick: addElement, variant: "outline", children: "Tambah Angsuran" }),
              /* @__PURE__ */ jsx(Button, { type: "button", variant: "ghost", onClick: modalIsClosed, children: "Batal" }),
              /* @__PURE__ */ jsx(Button, { children: "Simpan Pengajuan" })
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col w-full min-w-0 gap-3", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold", children: "Riwayat Pengajuan" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: (customerData == null ? void 0 : customerData.nama) ? `Rekam jejak ${customerData.nama} sebagai bahan pertimbangan.` : "Muncul setelah NIK ditemukan." })
      ] }),
      /* @__PURE__ */ jsxs(Tabs, { defaultValue: "pengajuan", className: "flex flex-col w-full min-w-0", children: [
        /* @__PURE__ */ jsxs(TabsList, { className: "grid w-full grid-cols-3", children: [
          /* @__PURE__ */ jsx(TabsTrigger, { value: "pengajuan", children: "Kantor ini" }),
          /* @__PURE__ */ jsx(TabsTrigger, { value: "pinjaman", children: "Kantor lain — macet" }),
          /* @__PURE__ */ jsx(TabsTrigger, { value: "pinjaman2", children: "Kantor lain — target" })
        ] }),
        /* @__PURE__ */ jsx(TabsContent, { value: "pengajuan", children: /* @__PURE__ */ jsx("div", { className: "overflow-auto border rounded-lg scrollbar-thin max-h-[55vh]", children: /* @__PURE__ */ jsx(RiwayatPengajuan, { data: customerData == null ? void 0 : customerData.history_branch }) }) }),
        /* @__PURE__ */ jsx(TabsContent, { value: "pinjaman", children: /* @__PURE__ */ jsx("div", { className: "overflow-auto border rounded-lg scrollbar-thin max-h-[55vh]", children: /* @__PURE__ */ jsx(RiwayatPengajuan, { data: customerData == null ? void 0 : customerData.history_macet_lain }) }) }),
        /* @__PURE__ */ jsx(TabsContent, { value: "pinjaman2", children: /* @__PURE__ */ jsx("div", { className: "overflow-auto border rounded-lg scrollbar-thin max-h-[55vh]", children: /* @__PURE__ */ jsx(RiwayatPengajuan, { data: customerData == null ? void 0 : customerData.history_target }) }) })
      ] })
    ] })
  ] });
};
export {
  NewNasabah as default
};
