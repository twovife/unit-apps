import { j as jsxs, a as jsx, F as Fragment } from "../ssr.mjs";
import { I as InputError } from "./InputError-3b072368.mjs";
import { L as Loading } from "./Loading-95bc2f77.mjs";
import { B as Button } from "./button-bf6cf732.mjs";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from "./card-a7cc8935.mjs";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-c148af71.mjs";
import { I as Input } from "./input-a726a844.mjs";
import { L as Label } from "./label-7289427a.mjs";
import { usePage, useForm } from "@inertiajs/react";
import axios from "axios";
import { Search, X } from "lucide-react";
import { useState, useEffect } from "react";
import CurrencyInput from "react-currency-input-field";
import { u as useOptionGenerator, S as SelectList } from "./SelectComponent-359a9ab7.mjs";
import RiwayatPengajuan from "./RiwayatPengajuan-8dd18e74.mjs";
import dayjs from "dayjs";
import { C as Checkbox } from "./Checkbox-d7000d9c.mjs";
import { F as FormatNumbering } from "./FormatNumbering-9786ffbe.mjs";
import { u as useFrontEndPermission } from "./useFrontEndPermission-59a7cda0.mjs";
import { N as NoEditOverlay } from "./NoEditOverlay-fb1d5d5c.mjs";
import "react/jsx-runtime";
import "react-dom/server";
import "@inertiajs/react/server";
import "react-dom";
import "@headlessui/react";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-efa289ef.mjs";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-tabs";
import "@radix-ui/react-label";
import "@tanstack/react-table";
import "./BadgeStatus-34895a82.mjs";
import "./badge-ad1cae46.mjs";
import "react-number-format";
const NewNasabah = ({ onClosed, generateAngsuran = false, submitUrl }) => {
  const { printUrl } = usePage().props;
  const { isUnit, isMantri, isCanShowKelompok, isCreator } = useFrontEndPermission();
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
  console.log(data);
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
  const onNikSubmit = async (e) => {
    e.preventDefault();
    reset();
    setLoading(true);
    setErorAxios();
    await axios({
      method: "post",
      url: route("transaction.nasabah_buku_transaksi"),
      data: {
        nik
      }
    }).then(function({ data: data2 }) {
      setLoading(false);
      setData((prevData) => ({
        ...prevData,
        nik: data2.return_nik,
        isActiveMember: data2.data ? true : false
      }));
      if (data2.data) {
        setCustomerData(data2.data);
      } else {
        setCustomerData([]);
      }
    }).catch(function({ response }) {
      setErorAxios(response.data.message);
      setLoading(false);
    });
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
  const buttonValueClick = (e) => {
    const value = e.target.getAttribute("data-value");
    setData("request_nominal", value);
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col w-full gap-3 lg:flex-row", children: [
    /* @__PURE__ */ jsx(Loading, { show: loading || processing }),
    /* @__PURE__ */ jsxs("div", { className: "w-auto", children: [
      /* @__PURE__ */ jsxs("fieldset", { className: "min-w-[20vw] p-4 mb-3 border rounded-lg", children: [
        /* @__PURE__ */ jsx("legend", { className: "px-1 -ml-1 text-sm font-medium", children: "Cari Nasabah" }),
        /* @__PURE__ */ jsxs("form", { className: "w-full mb-3", onSubmit: onNikSubmit, children: [
          /* @__PURE__ */ jsx(Label, { optional: true, children: "NIK" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(
              Input,
              {
                type: "text",
                name: "nik",
                value: nik,
                onChange: onNikChange,
                placeholder: "Cek NIK"
              }
            ),
            /* @__PURE__ */ jsxs(Button, { className: "text-xs", size: "sm", children: [
              /* @__PURE__ */ jsx(Search, { className: "w-auto h-4 mr-1" }),
              "Cari"
            ] })
          ] }),
          erorAxios && /* @__PURE__ */ jsx(InputError, { message: erorAxios, className: "mt-1" }),
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: `font-semibold mt-1 ${nik.length == 16 ? "text-green-500" : "text-red-500"}`,
              children: [
                nik.length,
                " Digit"
              ]
            }
          ),
          /* @__PURE__ */ jsx("div", { children: newGenerate && /* @__PURE__ */ jsx("a", { href: newGenerate ?? "#", target: "_blank", children: "Lihat Transaksi Terakhir" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "relative", children: nik && data.nik == nik && /* @__PURE__ */ jsxs("fieldset", { className: "w-full p-4 border rounded-lg", children: [
        !isCreator && /* @__PURE__ */ jsx(NoEditOverlay, { value: "User Tidak Dapat Digunakan Untuk Menambah Pinjaman" }),
        /* @__PURE__ */ jsx("legend", { className: "px-1 -ml-1 text-sm font-medium", children: "Detail Pinjaman" }),
        /* @__PURE__ */ jsxs("form", { className: "w-full mb-3", onSubmit: onSubmitCreate, children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-5 lg:flex-row", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "w-full mb-3", children: [
                  /* @__PURE__ */ jsx(Label, { children: "Tanggal Pengajuan" }),
                  /* @__PURE__ */ jsx(
                    Input,
                    {
                      type: "date",
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
                    Input,
                    {
                      type: "date",
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
              data.request_date && data.request_date == data.tanggal_drop ? /* @__PURE__ */ jsx("div", { className: "w-full mb-3 font-semibold text-red-500", children: "DROP BARU" }) : /* @__PURE__ */ jsx("div", { className: "w-full mb-3 font-semibold text-red-500", children: "PENGAJUAN DROP" }),
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
                    className: "flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
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
              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap w-full gap-2 mb-3", children: [
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    size: "xs",
                    onClick: buttonValueClick,
                    "data-value": "500000",
                    children: "500.000"
                  }
                ),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    size: "xs",
                    onClick: buttonValueClick,
                    "data-value": "700000",
                    children: "700.000"
                  }
                ),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    size: "xs",
                    onClick: buttonValueClick,
                    "data-value": "1000000",
                    children: "1.000.000"
                  }
                ),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    type: "button",
                    variant: "destructive",
                    size: "xs",
                    onClick: buttonValueClick,
                    "data-value": "0",
                    children: "reset"
                  }
                )
              ] })
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
                        Input,
                        {
                          type: "date",
                          name: "transaction_date",
                          min: dayjs(data.tanggal_drop).add(1, "week").format("YYYY-MM-DD"),
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
                            className: "flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
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
              /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3 font-semibold text-red-500", children: [
                /* @__PURE__ */ jsx("div", { children: "Saldo Tersisa" }),
                /* @__PURE__ */ jsx(FormatNumbering, { value: calculatePinjaman })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-end", children: [
            generateAngsuran && data.tanggal_drop && /* @__PURE__ */ jsx(
              Button,
              {
                type: "button",
                onClick: addElement,
                className: "mr-3",
                variant: "outline",
                children: "Add Angsuran"
              }
            ),
            /* @__PURE__ */ jsx(Button, { children: "Submit" })
          ] })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "w-auto lg:w-full", children: /* @__PURE__ */ jsxs(Tabs, { defaultValue: "pengajuan", className: "w-auto", children: [
      /* @__PURE__ */ jsxs(TabsList, { className: "grid w-full grid-cols-2", children: [
        /* @__PURE__ */ jsx(TabsTrigger, { value: "pengajuan", children: "Riwayat Pinjaman" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "pinjaman", children: "Riwayat Lain" })
      ] }),
      /* @__PURE__ */ jsx(TabsContent, { value: "pengajuan", children: /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "Riwayat Unit" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Riwayat Pengajuan Nasabah sesuai dengan nik di satu unit" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { className: "space-y-2", children: /* @__PURE__ */ jsx("div", { className: "h-[50vh] border rounded-lg overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin", children: /* @__PURE__ */ jsx(RiwayatPengajuan, { data: customerData == null ? void 0 : customerData.history_branch }) }) })
      ] }) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "pinjaman", children: /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "Riwayat Lain" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Riwayat Pengajuan Nasabah sesuai dengan nik di unit selain unit ini" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { className: "space-y-2", children: /* @__PURE__ */ jsx("div", { className: "h-[50vh] border rounded-lg overflow-auto scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin", children: /* @__PURE__ */ jsx(RiwayatPengajuan, { data: customerData == null ? void 0 : customerData.history_lain }) }) })
      ] }) })
    ] }) })
  ] });
};
export {
  NewNasabah as default
};
