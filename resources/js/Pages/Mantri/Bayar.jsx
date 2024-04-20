import LinkButton from "@/Components/LinkButton";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import dayjs from "dayjs";
import React, { useState } from "react";
import { NumericFormat } from "react-number-format";
import MobileLayout from "@/Layouts/MobileLayout";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import CurrencyInput from "react-currency-input-field";
import SelectList from "@/Components/SelectList";
import useServerFilter from "@/Hooks/useServerFilter";
import PrimaryButton from "@/Components/PrimaryButton";
import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";

const Bayar = ({ loan, ...props }) => {
    const { status_angsuran } = useServerFilter();
    // const { emps } = useServerFilter(null, null, null, props.mantri);
    // console.log(loan);\

    const statusAngsuran = status_angsuran.filter(
        (item) => item.value >= loan.status
    );
    console.log(loan);

    const { data, setData, post, processing, errors, reset } = useForm({
        danatitipan: false,
        jumlah: 0,
        status: loan.status,
        pembayaran_date: "",
    });

    console.log(errors);
    // const [loading, setLoading] = useState(false);
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
        post(route("mantriapps.bayarpost", loan.id), {
            onSuccess: () => reset(),
        });
    };

    let pinjaman = loan.pinjaman;
    return (
        <MobileLayout
            auth={props.auth}
            errors={props.errors}
            header="Buku Transaksi"
            loading={processing}
        >
            <Head title="Buku Transaksi" />
            <div className="bg-white/30 rounded shadow w-full p-3">
                <div className="flex w-full justify-between items-center">
                    <div className="font-semibold">Bayar Angsuran</div>
                    <div className="font-semibold">
                        <LinkButton
                            as="a"
                            href={props.back_button}
                            color="blue"
                            title={"Back"}
                        />
                    </div>
                </div>
                <div className="overflow-auto">
                    <div>
                        <div className="flex gap-3">
                            <div className="flex-1 flex justify-between items-center">
                                <div>Nasabah</div>
                                <div>:</div>
                            </div>
                            <div className="flex-[2]">{loan.customer.nama}</div>
                        </div>
                        <div className="flex gap-3">
                            <div className="flex-1 flex justify-between items-center">
                                <div>Alamat</div>
                                <div>:</div>
                            </div>
                            <div className="flex-[2]">
                                {loan.customer.alamat}
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="flex-1 flex justify-between items-center">
                                <div>NIK</div>
                                <div>:</div>
                            </div>
                            <div className="flex-[2]">{loan.customer.nik}</div>
                        </div>
                        <div className="flex gap-3">
                            <div className="flex-1 flex justify-between items-center">
                                <div>Kelompok | Mantri</div>
                                <div>:</div>
                            </div>
                            <div className="flex-[2]">
                                {loan.kelompok} | {loan.droper.nama_karyawan}
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="flex-1 flex justify-between items-center">
                                <div>Tanggal Drop</div>
                                <div>:</div>
                            </div>
                            <div className="flex-[2]">
                                {dayjs(loan.customer.tanggal_drop).format(
                                    "DD-MM-YYYY"
                                )}
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="flex-1 flex justify-between items-center">
                                <div>Pinjaman</div>
                                <div>:</div>
                            </div>
                            <div className="flex-[2]">
                                <NumericFormat
                                    value={loan.pinjaman}
                                    displayType={"text"}
                                    thousandSeparator={","}
                                    prefix={"Rp. "}
                                />
                                | {loan.status}
                            </div>
                        </div>
                    </div>
                    <div className="mt-3">
                        <div className="shadow text-xs rounded overflow-auto border max-h-[50vh]">
                            <table className="w-full bg-white">
                                <thead>
                                    <tr>
                                        <th className="p-2">No</th>
                                        <th className="p-2">Tanggal Angsur</th>
                                        <th className="p-2">Jumlah</th>
                                        <th className="p-2">Saldo</th>
                                        <th className="p-2">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loan.angsuran?.map((item, key) => {
                                        pinjaman = pinjaman - item.jumlah;
                                        return (
                                            <tr
                                                key={key}
                                                className="odd:bg-gray-200"
                                            >
                                                <td className="px-2 py-1">
                                                    {key + 1}
                                                </td>
                                                <td className="px-2 py-1">
                                                    {dayjs(
                                                        item.pembayaran_date
                                                    ).format("DD-MM-YY")}
                                                </td>
                                                <td className="px-2 py-1">
                                                    <NumericFormat
                                                        value={item.jumlah}
                                                        displayType={"text"}
                                                        thousandSeparator={","}
                                                        prefix={"Rp. "}
                                                    />
                                                </td>
                                                <td className="px-2 py-1">
                                                    <NumericFormat
                                                        value={pinjaman}
                                                        displayType={"text"}
                                                        thousandSeparator={","}
                                                        prefix={"Rp. "}
                                                    />
                                                </td>
                                                <td className="px-2 py-1">
                                                    {item.status == 1
                                                        ? "Normal"
                                                        : item.status == 2
                                                        ? "CM"
                                                        : item.status == 3
                                                        ? "MB"
                                                        : "ML"}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <form onSubmit={onSubmitCreate} className="mt-3">
                        <div>Input Data</div>
                        <div className="flex gap-3 flex-wrap">
                            <div className="flex-1">
                                <InputLabel value={"Tanggal"} />
                                <TextInput
                                    type="date"
                                    onChange={handleOnChange}
                                    max={props.batasan.maxdate}
                                    min={props.batasan.mindate}
                                    className="block mt-1 w-full"
                                    id="pembayaran_date"
                                    name="pembayaran_date"
                                    value={data.pembayaran_date}
                                />
                                <InputError
                                    message={errors.pembayaran_date}
                                    className="mt-2"
                                />
                            </div>
                            <div className="flex-1">
                                <InputLabel value={"Jumlah"} />
                                <CurrencyInput
                                    name="jumlah"
                                    id="jumlah"
                                    className={`border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm text-gray-800 dark:bg-gray-800 dark:text-gray-200 disabled:bg-black/10 dark:disabled:bg-white/10 block w-full mt-1`}
                                    allowDecimals={false}
                                    prefix="Rp. "
                                    required
                                    onValueChange={onHandleCurencyChange}
                                    value={data.jumlah}
                                    placeholder={
                                        "Inputkan angka tanpa sparator"
                                    }
                                />
                                <InputError
                                    message={errors.jumlah}
                                    className="mt-2"
                                />
                            </div>
                        </div>
                        <div className="mt-3">
                            <InputLabel value={"Status"} />
                            <div className="flex gap-3 items-center">
                                <div className="flex-[2]">
                                    <SelectList
                                        onChange={handleOnChange}
                                        options={statusAngsuran}
                                        className="block mt-1 w-full"
                                        id="status"
                                        name="status"
                                        value={data.status}
                                    />
                                    <InputError
                                        message={errors.status}
                                        className="mt-2"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="flex items-center">
                                        <Checkbox
                                            name="danatitipan"
                                            value={data.danatitipan}
                                            onChange={handleOnChange}
                                        />
                                        <span className="ml-2 text-sm text-gray-600">
                                            Dana Titipan?
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="mt-3">
                            <PrimaryButton title={"Submit"} type="submit" />
                        </div>
                    </form>
                </div>
            </div>
        </MobileLayout>
    );
};

export default Bayar;
// nama: "",
// nik: "",
// no_kk: "",
// alamat: "",
// mantri: "",
