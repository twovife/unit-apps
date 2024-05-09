import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import MobileLayout from "@/Layouts/MobileLayout";
import axios from "axios";
import dayjs from "dayjs";
import React, { useState } from "react";
import { NumericFormat } from "react-number-format";
import OldCustomer from "../Transaksi/Components/OldCustomer";
import NewCustomer from "../Transaksi/Components/NewCustomer";
import useServerFilter from "@/Hooks/useServerFilter";
import LinkButton from "@/Components/LinkButton";

const Create = ({ max_date, min_date, ...props }) => {
    const { emps, kolompokMantri } = useServerFilter(
        null,
        null,
        null,
        props.mantri
    );

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
        <MobileLayout
            auth={props.auth}
            errors={props.errors}
            header="Buku Transaksi"
            loading={loading}
        >
            <>
                <div className="mb-3">
                    <InputLabel htmlFor="nik" value="Input Nik Customer" />
                    <div className="flex items-center justify-start gap-3 w-full">
                        <div className="w-full">
                            <TextInput
                                id="nik"
                                type="text"
                                name="nik"
                                required
                                className="mt-1 block w-full"
                                autoComplete="nik"
                            />
                        </div>
                        <PrimaryButton
                            title={"Cari"}
                            as="button"
                            type="button"
                            onClick={onSubmitFindNik}
                        />
                        <LinkButton
                            color="blue"
                            as="a"
                            href={route("mantriapps.index")}
                            title={"Home"}
                        />
                    </div>
                    <InputError message={erorAxios} className="mt-2" />
                </div>
                {nikData && (
                    <div className="mb-3">
                        <div className="mb-3">
                            <div className="flex">
                                <div className="flex-[3]">Nama Nasabah</div>
                                <div className="flex-1">:</div>
                                <div className="flex-[5]">
                                    {nikData?.[0]?.customer_name}
                                </div>
                            </div>
                            <div className="flex mb-3">
                                <div className="flex-[3]">NIK</div>
                                <div className="flex-1">:</div>
                                <div className="flex-[5]">
                                    {nikData?.[0]?.nik}
                                </div>
                            </div>
                        </div>
                        <div className="overflow-auto rounded shadow-sm max-h-[50vh] border-b-2">
                            <table className="text-sm w-full border">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <td className="py-1 px-2">Tgl Drop</td>
                                        <td className="py-1 px-2">
                                            Total Drop
                                        </td>
                                        <td className="py-1 px-2">Lunas</td>
                                        <td className="py-1 px-2">Status</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {nikData &&
                                        nikData.map((item, key) => (
                                            <tr
                                                key={key}
                                                className="even:bg-gray-100"
                                            >
                                                <td className="px-2 py-1">
                                                    {item.tanggal_drop
                                                        ? dayjs(
                                                              item.tanggal_drop
                                                          ).format("DD-MM-YY")
                                                        : ""}
                                                </td>
                                                <td className="px-2 py-1">
                                                    {" "}
                                                    <NumericFormat
                                                        value={item.drop}
                                                        displayType={"text"}
                                                        thousandSeparator={","}
                                                    />
                                                </td>
                                                <td className="px-2 py-1">
                                                    {item.lunas}
                                                </td>
                                                <td className="px-2 py-1">
                                                    {item.status}
                                                </td>
                                            </tr>
                                        ))}
                                    <tr></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                {nik ? (
                    customerData ? (
                        <OldCustomer
                            setLoading={setLoading}
                            max_date={max_date}
                            min_date={min_date}
                            emps={kolompokMantri}
                            nik={nik}
                            customer_id={customerData?.id}
                            url={route("mantriapps.store")}
                        />
                    ) : (
                        <NewCustomer
                            setLoading={setLoading}
                            max_date={max_date}
                            min_date={min_date}
                            emps={kolompokMantri}
                            nik={nik}
                            url={route("mantriapps.store")}
                        />
                    )
                ) : (
                    ""
                )}
            </>
        </MobileLayout>
    );
};

export default Create;
