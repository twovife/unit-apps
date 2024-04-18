import PrimaryButton from "@/Components/PrimaryButton";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import {
    AiFillCheckCircle,
    AiFillEdit,
    AiFillFilter,
    AiOutlineClose,
    AiOutlineSortAscending,
    AiOutlineSortDescending,
} from "react-icons/ai";
import TextInput from "@/Components/TextInput";
import LinkButton from "@/Components/LinkButton";
import useServerFilter from "@/Hooks/useServerFilter";
import useFilterTable from "@/Hooks/useFilterTable";
import SelectList from "@/Components/SelectList";

const Index = ({ loans, server_filters, ...props }) => {
    const {
        serverFilters,
        onServerFilterChange,
        onServerFilterSubmit,
        loading,
        setLoading,
        mantriMantri,
    } = useServerFilter(route().current(), server_filters);

    const itemsPerPage = 1000;
    const {
        filters,
        setFilters,
        orderData,
        setOrderData,
        currentPage,
        setCurrentPage,
        displayData,
        totalPages,
        handlePageChange,
        totals,
    } = useFilterTable({}, itemsPerPage, loans);

    const [showFilter, setShowFilter] = useState("");
    const [addFilter, setAddFilter] = useState({
        column: "",
        operators: "1",
        values: "",
    });

    const thisonclick = (column, format = "text") => {
        setShowFilter({ column, format });
    };

    useEffect(() => {
        const storedFilter = JSON.parse(
            localStorage.getItem("internal_storage_buku_transaksi")
        );
        if (storedFilter && Object.keys(storedFilter).length > 0) {
            setFilters(storedFilter);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(
            "internal_storage_buku_transaksi",
            JSON.stringify(filters)
        );
    }, [filters]);

    useEffect(() => {
        const log = (e) => {
            if (e.target.className.includes("filter_trigger")) {
                thisonclick(
                    e.target.getAttribute("data-item"),
                    e.target.getAttribute("data-format")
                );
                setAddFilter({
                    ...addFilter,
                    ["column"]: e.target.getAttribute("data-item"),
                });
            } else {
                thisonclick("");
            }
        };
        window.addEventListener("click", log);
        return () => {
            window.removeEventListener("click", log);
        };
    });

    const onSubmitFilter = () => {
        const updatedFilters = [...filters];

        // Cari indeks filter yang memiliki column yang sama dengan addFilter.column
        const indexToUpdate = updatedFilters.findIndex(
            (filter) => filter.column === addFilter.column
        );

        // Jika ada filter dengan column yang sama, gantikan filter tersebut
        if (indexToUpdate !== -1) {
            updatedFilters[indexToUpdate] = addFilter;
        } else {
            // Jika tidak ada filter dengan column yang sama, tambahkan filter baru
            updatedFilters.push(addFilter);
        }

        setFilters(updatedFilters);
    };

    const decrementFilter = (column) => {
        // Buat salinan dari daftar filter
        const updatedFilters = [...filters];
        // Cari indeks filter dengan column yang sesuai
        const decrementFilters = filters.filter(
            (filter) => filter.column !== column
        );
        setFilters(decrementFilters);
    };

    const handleInputFilter = (e) => {
        const { name, value, type } = e.target;
        let convertedValue = value;

        if (type === "number") {
            convertedValue = parseInt(value);
        }

        setAddFilter({
            ...addFilter,
            [name]: convertedValue,
        });
    };

    const headers = [
        {
            title: ["Tanggal", "Nomor Pinjaman", "Customer"],
            column: ["transaction_date", "id", "customer_nama"],
            format: ["date", "number", "text"],
            headClass: "sticky left-0 top-0 z-40 w-1/2 md:w-1/4",
            bodyClass: "sticky left-0 top-0 z-40 w-1/2 md:w-1/4",
        },
        {
            title: ["NIK"],
            column: ["customer_nik"],
            format: ["text"],
        },
        {
            title: ["Alamat"],
            column: ["customer_alamat"],
            format: ["text"],
        },
        {
            title: ["Kel"],
            column: ["kelompok"],
            format: ["text"],
        },
        {
            title: ["Hari"],
            column: ["hari"],
            format: ["text"],
        },
        {
            title: ["Pengajuan"],
            column: ["pinjaman"],
            format: ["money"],
        },
        {
            title: ["Tanggal Drop"],
            column: ["tanggal_drop"],
            format: ["date"],
        },
        {
            title: ["Status"],
            column: ["status"],
            format: ["text"],
        },
        {
            title: ["Diperiksa"],
            column: ["tanggal_approve"],
            format: ["date"],
        },
        {
            title: ["Oleh"],
            column: ["approver"],
            format: ["text"],
        },
        {
            title: ["Mantri"],
            column: ["droper"],
            format: ["text"],
            headClass: "bg-rose-200",
        },
    ];

    const filterModal = () => {
        return (
            <div
                className="fixed text-white top-1/2 left-1/2 -translate-x-1/2 w-1/3"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bg-white border border-gray-300 rounded-lg shadow-lg max-w-full w-full">
                    <div className="flex justify-end items-center text-2xl px-2 py-4">
                        <div className="flex-1 flex flex-col-reverse">
                            <input
                                name="column"
                                value={addFilter.column}
                                onChange={(e) =>
                                    setAddFilter({
                                        ...addFilter,
                                        column: e.target.value,
                                    })
                                }
                                className="border-0 border-b border-b-gray-400 text-black font-light text-sm px-1.5 py-1.5 focus:bg-gray-100 focus:outline-none focus:border-b-2 focus:border-b-blue-500 peer/column"
                            />
                            <label className="text-gray-400 text-xs font-semibold peer-focus/column:text-blue-500">
                                Column
                            </label>
                        </div>
                        <div className="flex-1 flex flex-col-reverse">
                            <select
                                name="operators"
                                value={addFilter.operators}
                                onChange={(e) =>
                                    setAddFilter({
                                        ...addFilter,
                                        operators: e.target.value,
                                    })
                                }
                                className="border-0 border-b border-b-gray-400 text-black font-light text-sm px-1.5 py-1.5 focus:outline-none focus:border-b-2 focus:border-b-blue-500 focus:ring-0 peer/operator"
                            >
                                <option value="1">contains</option>
                                <option value="2">equal</option>
                            </select>
                            <label className="text-gray-400 text-xs font-semibold peer-focus/operator:text-blue-500">
                                Operator
                            </label>
                        </div>
                        <div className="flex-1 flex flex-col-reverse">
                            <input
                                value={addFilter.values}
                                type={
                                    showFilter.format == "number"
                                        ? "number"
                                        : showFilter.format == "date"
                                        ? "date"
                                        : showFilter.format == "money"
                                        ? "number"
                                        : "text"
                                }
                                onChange={handleInputFilter}
                                name="values"
                                className="border-0 border-b border-b-gray-400 text-black font-light text-sm px-1.5 py-1.5 focus:bg-gray-100 focus:outline-none focus:border-b-2 focus:border-b-blue-500 peer/value"
                            />
                            <label className="text-gray-400 text-xs font-semibold peer-focus/value:text-blue-500">
                                Value
                            </label>
                        </div>
                        <div className="flex-1 flex items-center justify-center">
                            <button
                                onClick={onSubmitFilter}
                                className="text-black text-xs border border-main-500 hover:bg-main-500 hover:text-white focus:bg-main-500 focus:text-white p-2 rounded-lg"
                            >
                                Go
                            </button>
                            <button
                                onClick={() =>
                                    setOrderData({
                                        column: showFilter.column,
                                        orderby: "asc",
                                    })
                                }
                                className="text-black border border-main-500 hover:bg-main-500 hover:text-white focus:bg-main-500 focus:text-white p-1 rounded-lg ml-3"
                            >
                                <AiOutlineSortAscending />
                            </button>
                            <button
                                onClick={() =>
                                    setOrderData({
                                        column: showFilter.column,
                                        orderby: "desc",
                                    })
                                }
                                className="text-black border border-main-500 hover:bg-main-500 hover:text-white focus:bg-main-500 focus:text-white p-1 rounded-lg ml-1"
                            >
                                <AiOutlineSortDescending />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const tbodyGenerator = () => {
        if (displayData.length === 0) {
            return (
                <>
                    <tbody>
                        <tr>
                            <td colSpan="2">Data Not Found</td>
                        </tr>
                    </tbody>
                </>
            );
        }
        return (
            <tbody>
                {displayData.map((item, key) => {
                    return (
                        <tr
                            key={key}
                            className={`border-b text-xs ${
                                item.status == "acc"
                                    ? `bg-emerald-100 hover:bg-green-300 even:bg-green-200`
                                    : item.status == "tolak"
                                    ? `bg-rose-100 hover:bg-red-300 even:bg-rose-200`
                                    : `bg-white hover:bg-blue-50 even:bg-gray-100`
                            }`}
                        >
                            <td>
                                <div className="flex items-center justify-evenly">
                                    <div className="flex-1 py-1 px-4">
                                        {key + 1}
                                    </div>
                                    <Link
                                        as="a"
                                        href={route(
                                            "transaction.show",
                                            item.id
                                        )}
                                        className="flex-1"
                                    >
                                        <AiFillEdit />
                                    </Link>
                                </div>
                            </td>
                            {headers.map((head, keyy) => {
                                return (
                                    <td
                                        key={keyy}
                                        className={`${
                                            head.bodyClass
                                                ? `${head.bodyClass}  bg-inherit`
                                                : ` relative z-30`
                                        }`}
                                    >
                                        <div className="flex items-start justify-evenly">
                                            {head.column.map(
                                                (column, column_key) => {
                                                    if (
                                                        head.format[
                                                            column_key
                                                        ] == "date"
                                                    ) {
                                                        return (
                                                            <div
                                                                key={column_key}
                                                                className="flex-1 py-1 px-4"
                                                            >
                                                                {item[column]
                                                                    ? dayjs(
                                                                          item[
                                                                              column
                                                                          ]
                                                                      ).format(
                                                                          "DD-MM-YYYY"
                                                                      )
                                                                    : ""}
                                                            </div>
                                                        );
                                                    }
                                                    if (
                                                        head.format[
                                                            column_key
                                                        ] == "money"
                                                    ) {
                                                        return (
                                                            <div
                                                                key={column_key}
                                                                className="flex-1 py-1 px-4"
                                                            >
                                                                <NumericFormat
                                                                    value={
                                                                        item[
                                                                            column
                                                                        ]
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
                                                            </div>
                                                        );
                                                    }

                                                    return (
                                                        <div
                                                            key={column_key}
                                                            className="flex-1 py-1 px-4"
                                                        >
                                                            {item[column]}
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </div>
                                    </td>
                                );
                            })}
                        </tr>
                    );
                })}
            </tbody>
        );
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
                <div className="px-6 py-4 flex justify-end items-center gap-3">
                    <div>
                        <TextInput
                            type="date"
                            className="block w-full text-sm"
                            id="transaction_date"
                            name="transaction_date"
                            value={serverFilters.transaction_date}
                            onChange={onServerFilterChange}
                        />
                    </div>
                    <div>
                        <SelectList
                            type="date"
                            className="block w-full min-w-16 text-sm"
                            id="mantri"
                            name="mantri"
                            options={mantriMantri}
                            value={serverFilters.mantri}
                            onChange={onServerFilterChange}
                        />
                    </div>
                    <PrimaryButton
                        color="yellow"
                        title="Cari"
                        onClick={onServerFilterSubmit}
                    />
                    <LinkButton
                        href={route("transaction.index")}
                        title="Refresh"
                        onClick={onServerFilterSubmit}
                    />
                    <LinkButton
                        color="blue"
                        as="a"
                        href={route("transaction.create")}
                        title="Create"
                    />
                </div>
                {filters && (
                    <div className="inline-block space-y-1">
                        {filters.map((item) => {
                            if (item.column == "") {
                                return null;
                            }
                            return (
                                <div className="flex items-center justify-start space-y-2">
                                    <div className="border flex items-center rounded-md overflow-hidden">
                                        <div className="p-2 text-lg bg-green-400 text-white">
                                            <AiFillFilter />
                                        </div>
                                        <div className="px-3 text-sm text-main-500">
                                            <span className="mr-1 capitalize ">
                                                {item.column}
                                            </span>
                                            <span className="mr-1 capitalize ">
                                                {item.operators == 1
                                                    ? "Contains"
                                                    : "="}
                                            </span>
                                            <span>'{item.values}'</span>
                                        </div>
                                    </div>
                                    <div
                                        className="hover:border hover:bg-gray-300 hover:cursor-pointer rounded p-1 ml-2"
                                        onClick={() =>
                                            decrementFilter(item.column)
                                        }
                                    >
                                        <AiOutlineClose />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                <div className="bg-white text-slate-700 ring-1 ring-slate-700 ring-opacity-5 shadow px-6 py-4 rounded-md">
                    <div className="font-semibold text-lg">
                        Daftar Transaksi
                    </div>
                    <div className="mx-auto mb-6 overflow-auto ring-1 ring-black ring-opacity-5 rounded shadow">
                        <table className="w-full text-xs text-left text-gray-500 relative">
                            <thead className="text-gray-900 uppercase sticky top-0 whitespace-nowrap z-50">
                                <tr>
                                    <th className={`bg-gray-200 relative z-30`}>
                                        <div className="flex items-start justify-evenly">
                                            <div className="px-4 py-3 ">No</div>
                                        </div>
                                    </th>
                                    {headers.map((header, key) => (
                                        <th
                                            key={key}
                                            data-item={header.column}
                                            data-format={
                                                header.format ?? "text"
                                            }
                                            scope="col"
                                            className={`bg-gray-200 ${
                                                header.headClass ??
                                                ` relative z-30`
                                            }`}
                                        >
                                            <div className="flex items-start justify-evenly">
                                                {header.title.map(
                                                    (titles, keyy) => {
                                                        return (
                                                            <div
                                                                key={keyy}
                                                                data-item={
                                                                    header
                                                                        .column[
                                                                        keyy
                                                                    ]
                                                                }
                                                                data-format={
                                                                    header
                                                                        .format[
                                                                        keyy
                                                                    ] ?? "text"
                                                                }
                                                                className="flex-1 hover:bg-sky-300 hover:cursor-pointer px-4 py-3 filter_trigger"
                                                            >
                                                                {titles}
                                                                {/* {orderData.column ==
                                                                header.column && (
                                                                <span className="ml-1 text-blue-400 italic">
                                                                    {
                                                                        orderData.orderby
                                                                    }
                                                                </span>
                                                            )} */}
                                                                {showFilter.column ==
                                                                    header
                                                                        .column[
                                                                        keyy
                                                                    ] &&
                                                                    filterModal()}
                                                            </div>
                                                        );
                                                    }
                                                )}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            {tbodyGenerator()}
                        </table>
                    </div>
                </div>
            </div>
        </Authenticated>
    );
};

export default Index;
