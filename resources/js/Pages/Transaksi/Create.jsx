import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import LinkButton from "@/Components/LinkButton";
import PrimaryButton from "@/Components/PrimaryButton";
import SelectList from "@/Components/SelectList";
import TextInput from "@/Components/TextInput";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import axios from "axios";
import dayjs from "dayjs";
import React, { useState } from "react";
import CurrencyInput from "react-currency-input-field";
import NewCustomer from "./Components/NewCustomer";
import OldCustomer from "./Components/OldCustomer";
import useServerFilter from "@/Hooks/useServerFilter";
import { NumericFormat } from "react-number-format";

const Create = ({ max_date, min_date, ...props }) => {
    const { emps } = useServerFilter(null, null, null, props.mantri);

    const [loading, setLoading] = useState(false);
    const [erorAxios, setErorAxios] = useState();
    const [nikData, setNikData] = useState();
    const [customerData, setCustomerData] = useState();
    const [nik, setNik] = useState();

    const onSubmitFindNik = (e) => {
        const nik = document.getElementById("nik").value;
        setLoading(true);
        setErorAxios();
        setNikData();
        setNik();
        axios({
            method: "post",
            url: route("transaction.getnik"),
            data: {
                nik: nik,
            },
        })
            .then(function ({ data }) {
                setNikData(data.data);
                setCustomerData(data.reqistered_customer);
                setNik(nik);
                setLoading(false);
            })
            .catch(function ({ response }) {
                setErorAxios(response.data.message);
                setNikData();
                setNik();
                setLoading(false);
            });
    };
    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            header="Buku Transaksi"
            loading={loading}
        >
            <Head title="Buku Transaksi" />

            <div className="relative">
                <div className="px-6 py-4 flex justify-end items-center">
                    <LinkButton
                        color="outline"
                        as="a"
                        href={props.back_to_index}
                        title="Back"
                    />
                </div>
                <div className="bg-white text-slate-700 ring-1 ring-slate-700 ring-opacity-5 shadow px-6 py-4 rounded-md">
                    <div className="flex justify-between items-start">
                        <div className="flex-[2]">
                            <div className="mb-3">
                                <InputLabel
                                    htmlFor="nik"
                                    value="Input Nik Customer"
                                />
                                <div className="flex items-center justify-start gap-3">
                                    <TextInput
                                        id="nik"
                                        type="text"
                                        name="nik"
                                        required
                                        className="mt-1 block"
                                        autoComplete="nik"
                                    />
                                    <PrimaryButton
                                        title={"Submit"}
                                        as="button"
                                        type="button"
                                        onClick={onSubmitFindNik}
                                    />
                                </div>
                                <InputError
                                    message={erorAxios}
                                    className="mt-2"
                                />
                            </div>
                            <div className="mb-3">
                                <div className="text-lg font-semibold">
                                    History Pinjaman Customer
                                </div>
                                <div className="overflow-hidden mb-3 rounded shadow p-4">
                                    <table className="w-full text-sm text-left text-gray-500">
                                        <thead className="text-xs text-gray-900 uppercase bg-gray-200 sticky top-0 whitespace-nowrap">
                                            <tr>
                                                <th className="px-3 py-2">
                                                    No
                                                </th>
                                                <th className="px-3 py-2">
                                                    Tanggal Drop
                                                </th>
                                                <th className="px-3 py-2">
                                                    Unit
                                                </th>
                                                <th className="px-3 py-2">
                                                    Kelompok
                                                </th>
                                                <th className="px-3 py-2">
                                                    Mantri
                                                </th>
                                                <th className="px-3 py-2">
                                                    Nama Customer
                                                </th>
                                                <th className="px-3 py-2">
                                                    Drop
                                                </th>
                                                <th className="px-3 py-2">
                                                    Lunas
                                                </th>
                                                <th className="px-3 py-2">
                                                    Status
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {nikData ? (
                                                nikData.map((element, key) => {
                                                    return (
                                                        <tr key={key}>
                                                            <td className="px-3 py-2">
                                                                {key + 1}
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                {dayjs(
                                                                    element.tanggal_drop
                                                                ).format(
                                                                    "DD-MM-YYYY"
                                                                )}
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                {element.unit}
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                {
                                                                    element.kelompok
                                                                }
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                {
                                                                    element.mantri_name
                                                                }
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                {
                                                                    element.customer_name
                                                                }
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                <NumericFormat
                                                                    value={
                                                                        element.drop
                                                                    }
                                                                    displayType={
                                                                        "text"
                                                                    }
                                                                    thousandSeparator={
                                                                        ","
                                                                    }
                                                                    prefix={
                                                                        "Rp. "
                                                                    }
                                                                />
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                {element.lunas}
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                {element.status ==
                                                                    "normal" ||
                                                                element.status ==
                                                                    "cm" ? (
                                                                    <span className="bg-green-400 px-5 py-1 uppercase rounded-lg text-white font-semibold">
                                                                        {
                                                                            element.status
                                                                        }
                                                                    </span>
                                                                ) : element.status ==
                                                                  "mb" ? (
                                                                    <span className="bg-yellow-400 px-5 py-1 uppercase rounded-lg text-white font-semibold">
                                                                        {
                                                                            element.status
                                                                        }
                                                                    </span>
                                                                ) : (
                                                                    <span className="bg-red-400 px-5 py-1 uppercase rounded-lg text-white font-semibold">
                                                                        {
                                                                            element.status
                                                                        }
                                                                    </span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            ) : (
                                                <tr>
                                                    <td colSpan={3}>
                                                        Data tidak ditemukan
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        {nik ? (
                            customerData ? (
                                <OldCustomer
                                    setLoading={setLoading}
                                    max_date={max_date}
                                    min_date={min_date}
                                    emps={emps}
                                    nik={nik}
                                    customer_id={customerData?.id}
                                />
                            ) : (
                                <NewCustomer
                                    setLoading={setLoading}
                                    max_date={max_date}
                                    min_date={min_date}
                                    emps={emps}
                                    nik={nik}
                                />
                            )
                        ) : (
                            ""
                        )}
                    </div>
                </div>
            </div>
        </Authenticated>
    );
};

export default Create;
// nama: "",
// nik: "",
// no_kk: "",
// alamat: "",
// mantri: "",
