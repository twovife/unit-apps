import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import LinkButton from "@/Components/LinkButton";
import PrimaryButton from "@/Components/PrimaryButton";
import SelectList from "@/Components/SelectList";
import TextInput from "@/Components/TextInput";
import useServerFilter from "@/Hooks/useServerFilter";
import MobileLayout from "@/Layouts/MobileLayout";
import { Link } from "@inertiajs/react";
import dayjs from "dayjs";
import React, { useState } from "react";
import { NumericFormat } from "react-number-format";

const Drop = ({ data, branch, server_filters, ...props }) => {
    const {
        serverFilters,
        onServerFilterChange,
        onServerFilterSubmit,
        loading,
        setLoading,
        mantriMantri,
    } = useServerFilter(route().current(), server_filters);

    const mantri =
        server_filters.previledge == "mantri"
            ? [
                  {
                      id: 1,
                      value: server_filters.kelompok,
                      display: server_filters.kelompok,
                  },
              ]
            : mantriMantri;

    const [searchTerm, setSearchTerm] = useState("");

    const filterTransactions = () => {
        return data.filter((transaction) => {
            const searchValue = searchTerm.toLowerCase();
            return (
                transaction.nik.toLowerCase().includes(searchValue) ||
                transaction.nama.toLowerCase().includes(searchValue) ||
                transaction.id == searchValue
            );
        });
    };

    const handleSearchInputChange = (event) => {
        setSearchTerm(event.target.value);
    };
    return (
        <MobileLayout
            auth={props.auth}
            errors={props.errors}
            header="Drop Harians"
            loading={loading}
        >
            <div className="mb-3">
                <div className="w-full">
                    <InputLabel htmlFor="kelompok" value="Kelompok" />
                    <SelectList
                        id="kelompok"
                        type="text"
                        onChange={onServerFilterChange}
                        name="kelompok"
                        value={serverFilters.kelompok}
                        options={mantri}
                        className="mt-1 block w-full"
                        autoComplete="kelompok"
                    />
                </div>
                <div className="mt-3 w-full">
                    <InputLabel htmlFor="date" value="Tanggal Drop" />

                    <div className="flex text-center items-center gap-1">
                        <div className="flex-1">
                            <TextInput
                                id="date"
                                disabled={true}
                                type="date"
                                onChange={onServerFilterChange}
                                value={serverFilters.date}
                                name="date"
                                className="mt-1 block w-full"
                            />
                        </div>
                        <PrimaryButton
                            onClick={onServerFilterSubmit}
                            title={"Cari"}
                        />
                        <LinkButton
                            color="blue"
                            as="a"
                            href={route("mantriapps.index")}
                            title={"Home"}
                        />
                    </div>
                </div>
                <div className="w-full mt-3">
                    <TextInput
                        value={searchTerm}
                        onChange={handleSearchInputChange}
                        className="w-full"
                        placeHolder="Masukkan NIK / Nama"
                    />
                </div>
            </div>
            <div className="overflow-auto rounded shadow-sm max-h-[50vh] border-b-2">
                <table className="text-sm w-full border">
                    <thead className="bg-gray-200">
                        <tr className="text-center">
                            <td className="p-2">Tgl</td>
                            <td className="p-2">Nasabah</td>
                            <td className="p-2">Drop</td>
                            <td className="p-2">Status</td>
                            <td className="p-2">No. Trans</td>
                        </tr>
                    </thead>
                    <tbody>
                        {data &&
                            filterTransactions().map((item, key) => (
                                <tr
                                    key={key}
                                    className={`even:bg-gray-100 text-xs text-center ${
                                        item.id == props.id
                                            ? "bg-green-100"
                                            : ""
                                    }`}
                                >
                                    <td className="px-2 py-1 text-start">
                                        <div className="font-semibold text-sm"></div>
                                        <div className="mb-1 italic font-light whitespace-nowrap">
                                            <span className="capitalize">
                                                {item.hari},
                                            </span>
                                            {item.transaction_date
                                                ? dayjs(
                                                      item.transaction_date
                                                  ).format("DD-MM-YY")
                                                : ""}
                                            /
                                        </div>
                                        <div className="mb-1 italic font-light">
                                            <span className="capitalize">
                                                Drop :&nbsp;
                                                {item.tanggal_drop
                                                    ? dayjs(
                                                          item.tanggal_drop
                                                      ).format("DD-MM-YY")
                                                    : ""}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-2 py-1 text-start">
                                        <div className="mb-1 font-semibold">
                                            {item.nama}
                                        </div>
                                        <div className="mb-1">{item.nik}</div>
                                        <div className="mb-1 font-light italic">
                                            {item.alamat}
                                        </div>
                                    </td>
                                    <td className="px-2 py-1 text-end">
                                        <NumericFormat
                                            value={item.drop}
                                            displayType={"text"}
                                            thousandSeparator={","}
                                        />
                                    </td>
                                    <td className="px-2 py-1 text-center">
                                        <Link
                                            className={`${
                                                item.status == "acc"
                                                    ? `bg-green-500`
                                                    : item.status == "tolak"
                                                    ? `bg-red-500`
                                                    : `bg-blue-500`
                                            } px-2 py-1.5 hover:bg-blue-700 text-white hover:cursor-pointer rounded`}
                                            href={route(
                                                "mantriapps.show_drop",
                                                item.id
                                            )}
                                        >
                                            {item.status}
                                        </Link>
                                    </td>
                                    <td className="px-2 py-1">
                                        <div>{item.id}</div>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </MobileLayout>
    );
};

export default Drop;
