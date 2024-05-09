import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import LinkButton from "@/Components/LinkButton";
import PrimaryButton from "@/Components/PrimaryButton";
import SelectList from "@/Components/SelectList";
import TextInput from "@/Components/TextInput";
import useServerFilter from "@/Hooks/useServerFilter";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import axios from "axios";
import dayjs from "dayjs";
import React, { useState } from "react";
import CurrencyInput from "react-currency-input-field";
import { NumericFormat } from "react-number-format";
import JenisNasabah from "./Components/JenisNasabah";
import ModalHapus from "./Components/ModalHapus";

const Newshow = ({ loan, instalment, ...props }) => {
    const { emps } = useServerFilter(null, null, null, props.mantri);
    const { status_angsuran } = useServerFilter();
    // const { emps } = useServerFilter(null, null, null, props.mantri);
    // console.log(loan);
    const [loading, setLoading] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [deletUrl, setDeletUrl] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        tanggal_pembayaran: "",
        jumlah: "",
        mantri: loan.mantri_id,
        danatitipan: false,
    });
    const handleOnChange = (e) => {
        setData(
            e.target.name,
            e.target.type === "checkbox" ? e.target.checked : e.target.value
        );
    };

    const onHandleCurencyChange = (value, name) => {
        setData(name, value);
    };

    const onSubmitCreate = (e) => {
        e.preventDefault();
        post(route("pinjaman.normal.update", loan.id));
        reset();
    };

    const onClickDelete = (params) => {
        setShowDelete(true);
        setDeletUrl(params);
    };

    const onHideDelete = () => {
        setShowDelete(false);
        setDeletUrl(null);
    };

    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            header="Buku Transaksi"
            loading={processing || loading}
        >
            <Head title="Buku Transaksi" />

            <div className="relative">
                <div className="px-6 py-4 flex justify-between items-center">
                    <button
                        onClick={() =>
                            onClickDelete(
                                route("pinjaman.normal.deleteLoan", loan.id)
                            )
                        }
                        className="border border-red-500 text-red-500 px-2 py-1 text-xs rounded"
                    >
                        Hapus Pinjaman
                    </button>
                    <LinkButton
                        color="outline"
                        as="a"
                        href={props.back_to_index}
                        title="Back"
                    />
                </div>
                <div className="bg-white text-slate-700 ring-1 ring-slate-700 ring-opacity-5 shadow px-6 py-4 rounded-md">
                    <div>
                        <div className="mb-3">
                            <div className="text-lg font-semibold mb-2">
                                Pengajuan Pinjaman
                            </div>
                            <div className="overflow-auto mb-3 rounded border border-black/5 shadow p-4">
                                <table className="w-full text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-900 uppercase bg-gray-200 sticky top-0 whitespace-nowrap text-center">
                                        <tr>
                                            <th className="px-3 py-2">
                                                Nomor Pinjaman
                                            </th>
                                            <th className="px-3 py-2">
                                                Nama Nasabah
                                            </th>
                                            <th className="px-3 py-2">NIK</th>
                                            <th className="px-3 py-2">Unit</th>
                                            <th className="px-3 py-2">
                                                Kelompok
                                            </th>
                                            <th className="px-3 py-2">Hari</th>
                                            <th className="px-3 py-2">
                                                Tanggal Drop
                                            </th>
                                            <th className="px-3 py-2">
                                                Pinjaman
                                            </th>
                                            <th className="px-3 py-2">
                                                Nama Mantri
                                            </th>
                                            <th className="px-3 py-2">
                                                Status
                                            </th>
                                            <th className="px-3 py-2">
                                                Jenis Nasabah
                                            </th>
                                            <th className="px-3 py-2">Lunas</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-center">
                                        {loan ? (
                                            <tr key={loan.nomor_pinjaman}>
                                                <td className="px-3 py-2">
                                                    {loan.nomor_pinjaman}
                                                </td>
                                                <td className="px-3 py-2">
                                                    {loan.nama_customer}
                                                </td>
                                                <td className="px-3 py-2">
                                                    {loan.nik_customer}
                                                </td>
                                                <td className="px-3 py-2 whitespace-nowrap">
                                                    {loan.unit}
                                                </td>
                                                <td className="px-3 py-2">
                                                    {loan.kelompok}
                                                </td>

                                                <td className="px-3 py-2">
                                                    {loan.hari}
                                                </td>
                                                <td className="px-3 py-2">
                                                    {dayjs(
                                                        loan.tanggal_drop
                                                    ).format("DD-MM-YYYY")}
                                                </td>

                                                <td className="px-3 py-2 whitespace-nowrap">
                                                    <NumericFormat
                                                        value={loan.pinjaman}
                                                        displayType={"text"}
                                                        thousandSeparator={","}
                                                        // prefix={"Rp. "}
                                                    />
                                                </td>

                                                <td className="px-3 py-2 whitespace-nowrap">
                                                    {loan.mantri}
                                                </td>
                                                <td className="px-3 py-2 whitespace-nowrap">
                                                    {loan.status}
                                                </td>
                                                <td className="px-3 py-2">
                                                    {loan.loan_notes}
                                                </td>
                                                <td className="px-3 py-2">
                                                    {loan.lunas}
                                                </td>
                                            </tr>
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
                        <div className="mb-3 lg:flex justify-between w-full gap-2">
                            <div className="mb-3 flex-[2] ">
                                <div className="text-lg font-semibold mb-2">
                                    History Pembayaran
                                </div>
                                <div className="overflow-hidden mb-3 rounded border border-black/5 shadow p-4">
                                    <div className="max-h-[50vh] overflow-auto">
                                        <table className="w-full text-sm text-left text-gray-500">
                                            <thead className="text-xs text-gray-900 uppercase bg-gray-200 sticky top-0 whitespace-nowrap z-20 text-center">
                                                <tr>
                                                    <th className="px-3 py-2">
                                                        Action
                                                    </th>
                                                    <th className="px-3 py-2">
                                                        Tanggal Pembayaran
                                                    </th>
                                                    <th className="px-3 py-2">
                                                        Jumlah
                                                    </th>

                                                    <th className="px-3 py-2">
                                                        Saldo
                                                    </th>
                                                    <th className="px-3 py-2">
                                                        Dana titipan
                                                    </th>
                                                    <th className="px-3 py-2">
                                                        Mantri
                                                    </th>

                                                    <th className="px-3 py-2">
                                                        Status
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="relative z-10 text-center">
                                                {instalment ? (
                                                    instalment.map(
                                                        (item, key) => (
                                                            <tr
                                                                key={key}
                                                                className="even:bg-gray-50 hover:bg-gray-200"
                                                            >
                                                                <td className="px-3 py-2">
                                                                    <button
                                                                        onClick={() =>
                                                                            onClickDelete(
                                                                                route(
                                                                                    "pinjaman.normal.deleteAngsuran",
                                                                                    item.id
                                                                                )
                                                                            )
                                                                        }
                                                                        className="bg-red-400 px-2 py-1 rounded text-white"
                                                                    >
                                                                        Hapus
                                                                    </button>
                                                                </td>
                                                                <td className="px-3 py-2">
                                                                    {dayjs(
                                                                        item.tanggal_pembayaran
                                                                    ).format(
                                                                        "DD-MM-YYYY"
                                                                    )}
                                                                </td>

                                                                <td className="px-3 py-2 text-end">
                                                                    <NumericFormat
                                                                        value={
                                                                            item.jumlah
                                                                        }
                                                                        displayType={
                                                                            "text"
                                                                        }
                                                                        thousandSeparator={
                                                                            ","
                                                                        }
                                                                        // prefix={
                                                                        //     "Rp. "
                                                                        // }
                                                                    />
                                                                </td>

                                                                <td className="px-3 py-2 text-end">
                                                                    <NumericFormat
                                                                        value={
                                                                            item.saldo
                                                                        }
                                                                        displayType={
                                                                            "text"
                                                                        }
                                                                        thousandSeparator={
                                                                            ","
                                                                        }
                                                                        // prefix={
                                                                        //     "Rp. "
                                                                        // }
                                                                    />
                                                                </td>

                                                                <td className="px-3 py-2">
                                                                    {
                                                                        item.danatitipan
                                                                    }
                                                                </td>
                                                                <td className="px-3 py-2 whitespace-nowrap">
                                                                    {
                                                                        item.mantri
                                                                    }
                                                                </td>
                                                                <td className="px-3 py-2">
                                                                    {
                                                                        item.status
                                                                    }
                                                                </td>
                                                            </tr>
                                                        )
                                                    )
                                                ) : (
                                                    <tr>
                                                        <td colSpan={3}>
                                                            Belum Ada Pembayaran
                                                            Ditemukan
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <ModalHapus
                                show={showDelete}
                                setShow={onHideDelete}
                                url={deletUrl}
                                loading={loading}
                                setLoading={setLoading}
                            />

                            <div className="mb-3 flex-1">
                                <div className="mb-3">
                                    <div className="text-lg font-semibold mb-2">
                                        Pembayaran Angsuran
                                    </div>
                                    <div className="overflow-hidden mb-3 rounded border border-black/5 shadow p-4">
                                        <form
                                            onSubmit={onSubmitCreate}
                                            className="max-h-[50vh] overflow-auto"
                                        >
                                            <div className="mb-1">
                                                <InputLabel
                                                    htmlFor="tanggal_pembayaran"
                                                    value="Tanggal Pembayaran"
                                                />

                                                <TextInput
                                                    id="tanggal_pembayaran"
                                                    type="date"
                                                    name="tanggal_pembayaran"
                                                    value={
                                                        data.tanggal_pembayaran
                                                    }
                                                    min={props.min_date}
                                                    max={props.max_date}
                                                    className="mt-1 block w-full"
                                                    autoComplete="tanggal_pembayaran"
                                                    isFocused={true}
                                                    onChange={handleOnChange}
                                                />

                                                <InputError
                                                    message={
                                                        errors.tanggal_pembayaran
                                                    }
                                                    className="mt-2"
                                                />
                                            </div>
                                            <div className="mb-1">
                                                <InputLabel
                                                    htmlFor="jumlah"
                                                    value={"Nominal jumlah"}
                                                    className="mb-1"
                                                />
                                                <CurrencyInput
                                                    name="jumlah"
                                                    id="jumlah"
                                                    className={`border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm text-gray-800 dark:bg-gray-800 dark:text-gray-200 disabled:bg-black/10 dark:disabled:bg-white/10 block w-full text-sm mt-2`}
                                                    allowDecimals={false}
                                                    prefix="Rp. "
                                                    min={1}
                                                    required
                                                    onValueChange={
                                                        onHandleCurencyChange
                                                    }
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
                                            <div className="mb-1">
                                                <InputLabel
                                                    htmlFor="mantri"
                                                    value="Mantri"
                                                />

                                                <SelectList
                                                    id="mantri"
                                                    type="text"
                                                    name="mantri"
                                                    options={emps}
                                                    nullValue={true}
                                                    value={data.mantri}
                                                    className="mt-1 block w-full"
                                                    onChange={handleOnChange}
                                                />

                                                <InputError
                                                    message={errors.mantri}
                                                    className="mt-2"
                                                />
                                            </div>
                                            <div className="mb-1 mt-3 flex justify-between items-center">
                                                <label className="flex items-center">
                                                    <Checkbox
                                                        name="danatitipan"
                                                        value={data.danatitipan}
                                                        onChange={
                                                            handleOnChange
                                                        }
                                                    />
                                                    <span className="ml-2 text-sm text-gray-600">
                                                        Dana Titipan?
                                                    </span>
                                                </label>
                                                <PrimaryButton
                                                    title={"Submit"}
                                                    type="submit"
                                                />
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <JenisNasabah loan={loan} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Authenticated>
    );
};

export default Newshow;
