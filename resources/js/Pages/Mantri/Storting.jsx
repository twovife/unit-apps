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

const Storting = ({ data, server_filters, ...props }) => {
    const {
        serverFilters,
        onServerFilterChange,
        onServerFilterSubmit,
        loading,
        setLoading,
        mantriMantri,
        transaction_day,
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
            header="Angsuran Berjalan"
            loading={loading}
        >
            <div className="mb-3">
                <div className="lg:flex justify-between items-center w-full gap-1 flex-wrap">
                    <div className="flex-1">
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
                    <div className="flex-[2]">
                        <InputLabel htmlFor="hari" value="Hari" />
                        <div className="flex text-center items-center gap-1">
                            <div className="flex-1">
                                <SelectList
                                    id="hari"
                                    type="text"
                                    onChange={onServerFilterChange}
                                    name="hari"
                                    value={serverFilters.hari}
                                    options={transaction_day}
                                    className="mt-1 block w-full"
                                    autoComplete="hari"
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
                </div>
                <div className="w-full mt-3">
                    <TextInput
                        value={searchTerm}
                        onChange={handleSearchInputChange}
                        className="w-full"
                        placeholder="Masukkan NIK / Nama"
                    />
                </div>
            </div>
            <div className="overflow-auto rounded shadow-lg max-h-[50vh] border-b-2 border-2 border-white/50">
                <table className="text-sm w-full border">
                    <thead className="bg-gray-200">
                        <tr className="text-center">
                            <td className="p-2">Tgl</td>
                            <td className="p-2">Nasabah</td>
                            <td className="p-2">Pinjaman</td>
                            <td className="p-2">Status</td>
                        </tr>
                    </thead>
                    <tbody>
                        {data &&
                            filterTransactions().map((item, key) => (
                                <tr
                                    key={key}
                                    className={`text-xs ${
                                        item.is_paid
                                            ? "even:bg-green-100 bg-green-100"
                                            : "even:bg-gray-100"
                                    }`}
                                >
                                    <td className="px-2 py-1">
                                        <div className="mb-1 italic font-light">
                                            <span className="capitalize whitespace-nowrap">
                                                {item.tanggal_drop
                                                    ? dayjs(
                                                          item.tanggal_drop
                                                      ).format("DD-MM")
                                                    : ""}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-2 py-1">
                                        <div className="mb-1 font-semibold">
                                            {item.nama}
                                        </div>
                                        <div className="mb-1">{item.nik}</div>
                                        <div className="mb-1 font-light italic">
                                            {item.alamat}
                                        </div>
                                    </td>
                                    <td className="px-2 py-1 text-end">
                                        <div className="text-xs">
                                            <div className="flex justify-between gap-6">
                                                <div>Pinj</div>
                                                <NumericFormat
                                                    value={item.pinjaman}
                                                    displayType={"text"}
                                                    thousandSeparator={","}
                                                />
                                            </div>
                                            <div className="flex justify-between mb-1 border-b-black border-b-2">
                                                <div>Angs</div>
                                                <NumericFormat
                                                    value={item.total_angsuran}
                                                    displayType={"text"}
                                                    thousandSeparator={","}
                                                />
                                            </div>
                                            {item.saldo_ansuran == 0 ? (
                                                <div className="flex justify-between items-center">
                                                    <div>Sisa</div>
                                                    <div className="bg-green-500 font-bold px-2 py-1 rounded">
                                                        LUNAS
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex justify-between">
                                                    <div>Sisa</div>
                                                    <NumericFormat
                                                        value={
                                                            item.saldo_ansuran
                                                        }
                                                        displayType={"text"}
                                                        thousandSeparator={","}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-2 py-1 text-center">
                                        <Link
                                            className="bg-blue-500 px-2 py-1.5 hover:bg-blue-700 text-white hover:cursor-pointer rounded"
                                            href={route(
                                                "mantriapps.bayar",
                                                item.id
                                            )}
                                        >
                                            {item.status}
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </MobileLayout>
    );
};

export default Storting;
