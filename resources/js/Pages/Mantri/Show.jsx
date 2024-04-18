import LinkButton from "@/Components/LinkButton";
import { Head, router, usePage } from "@inertiajs/react";
import dayjs from "dayjs";
import React, { useState } from "react";
import { NumericFormat } from "react-number-format";
import MobileLayout from "@/Layouts/MobileLayout";

const Show = ({
    requesttoApprove,
    loanHistory,
    requestHistory,
    can_edit,
    ...props
}) => {
    // const { emps } = useServerFilter(null, null, null, props.mantri);
    const { progress } = usePage();
    console.log(progress);
    const [loading, setLoading] = useState(false);

    const handleAction = (params) => {
        router.put(
            route("mantriapps.update", requesttoApprove.id),
            {
                action: params,
            },
            // { only: requesttoApprove },
            {
                onStart: () => setLoading(true),
                onFinish: () => setLoading(false),
            }
        );
    };

    return (
        <MobileLayout
            auth={props.auth}
            errors={props.errors}
            header="Buku Transaksi"
            loading={loading}
        >
            <Head title="Buku Transaksi" />
            <div className="mb-3">
                <div className="mb-3 flex justify-between items-center">
                    <div className="font-semibold underline ">
                        Pengajuan Pinjaman
                    </div>
                    <LinkButton
                        color="blue"
                        as="a"
                        href={route("mantriapps.index")}
                        title={"Home"}
                    />
                </div>

                <div className="space-y-2 mb-3">
                    <div className="flex">
                        <div className="flex-[3]">Hari, Tanggal Pengajuan</div>
                        <div className="flex-[1]">:</div>
                        <div className="flex-[5]">
                            <span className="capitalize">
                                {requesttoApprove.hari}
                            </span>
                            ,&nbsp;
                            {dayjs(requesttoApprove.tanggal_pengajuan).format(
                                "DD-MM-YYYY"
                            )}
                        </div>
                    </div>
                    <div className="flex">
                        <div className="flex-[3]">Hari, Tanggal Drop</div>
                        <div className="flex-[1]">:</div>
                        <div className="flex-[5]">
                            <span className="capitalize">
                                {requesttoApprove.hari}
                            </span>
                            ,&nbsp;
                            {dayjs(requesttoApprove.tanggal_drop).format(
                                "DD-MM-YYYY"
                            )}
                        </div>
                    </div>

                    <div className="flex">
                        <div className="flex-[3]">Nomor Pinjaman</div>
                        <div className="flex-[1]">:</div>
                        <div className="flex-[5]">{requesttoApprove.id}</div>
                    </div>
                    <div className="flex">
                        <div className="flex-[3]">Nomor Nasabah</div>
                        <div className="flex-[1]">:</div>
                        <div className="flex-[5]">
                            {requesttoApprove.customer_name}
                            <span className="font-light italic text-gray-500">
                                &nbsp;({requesttoApprove.customer_nik})
                            </span>
                        </div>
                    </div>
                    <div className="flex">
                        <div className="flex-[3]">Alamat</div>
                        <div className="flex-[1]">:</div>
                        <div className="flex-[5]">
                            {requesttoApprove.customer_alamat}
                        </div>
                    </div>
                    <div className="flex">
                        <div className="flex-[3]">Permintaan Drop</div>
                        <div className="flex-[1]">:</div>
                        <div className="flex-[5]">
                            <NumericFormat
                                value={requesttoApprove.drop}
                                displayType={"text"}
                                thousandSeparator={","}
                                prefix={"Rp. "}
                            />
                        </div>
                    </div>
                    <div className="flex">
                        <div className="flex-[3]">Unit / Kelompok</div>
                        <div className="flex-[1]">:</div>
                        <div className="flex-[5]">
                            {requesttoApprove.unit} / Kelompok&nbsp;
                            {requesttoApprove.kelompok}
                        </div>
                    </div>
                    <div className="flex">
                        <div className="flex-[3]">Mantri</div>
                        <div className="flex-[1]">:</div>
                        <div className="flex-[5]">
                            {requesttoApprove.mantri_name}
                        </div>
                    </div>
                    <div className="flex">
                        <div className="flex-[3]">Pengajuan Ke</div>
                        <div className="flex-[1]">:</div>
                        <div className="flex-[5]">
                            {requesttoApprove.pengajuan_ke}
                        </div>
                    </div>
                    <div className="flex">
                        <div className="flex-[3]">Status</div>
                        <div className="flex-[1]">:</div>
                        <div className="flex-[5]">
                            <span
                                className={`px-2 py-1 rounded border ${
                                    requesttoApprove.status == "open"
                                        ? `bg-gray-200`
                                        : requesttoApprove.status == "acc"
                                        ? "bg-green-200"
                                        : requesttoApprove.status == "tolak"
                                        ? "bg-red-200"
                                        : "bg-gray-200"
                                }`}
                            >
                                {requesttoApprove.status}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end items-center">
                    {can_edit && requesttoApprove.status == "open" ? (
                        <div className="flex items-center justify-center gap-2">
                            <button
                                className="bg-green-200 py-1 px-2 rounded hover:bg-green-300 border border-green-300"
                                type="button"
                                onClick={() => handleAction(1)}
                            >
                                Terima
                            </button>
                            <button
                                className="bg-red-200 py-1 px-2 rounded hover:bg-red-300 border border-red-300"
                                type="button"
                                onClick={() => handleAction(2)}
                            >
                                Tolak
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center gap-2">
                            {requesttoApprove.status == "acc" ? (
                                <>
                                    <div className="text-green-600">Acc</div>

                                    {requesttoApprove.instalment == 0 && (
                                        <button
                                            className="bg-red-200 py-1 px-2 rounded hover:bg-red-300 border border-red-300"
                                            type="button"
                                            onClick={() => handleAction(3)}
                                        >
                                            Batalkan
                                        </button>
                                    )}
                                </>
                            ) : requesttoApprove.status == "tolak" ? (
                                <div>ditolak</div>
                            ) : (
                                ""
                            )}
                        </div>
                    )}
                </div>
            </div>
            <div className="relative">
                <div className="bg-white text-slate-700 ring-1 ring-slate-700 ring-opacity-5 shadow px-6 py-4 rounded-md">
                    <div>
                        <div className="mb-3">
                            <div className="text-lg font-semibold mb-2">
                                History Pinjaman
                            </div>
                            <div className="overflow-hidden mb-3 rounded border border-black/5 shadow p-4">
                                <table className="w-full text-xs text-left text-gray-500">
                                    <thead className="text-xs text-gray-900 uppercase bg-gray-200 sticky top-0 whitespace-nowrap">
                                        <tr>
                                            <th className="px-1 py-1">No</th>
                                            <th className="px-1 py-1">
                                                Tanggal
                                            </th>
                                            <th className="px-1 py-1">
                                                Unit / Mantri
                                            </th>

                                            <th className="px-1 py-1">Drop</th>
                                            <th className="px-1 py-1">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loanHistory ? (
                                            loanHistory.map((item, key) => (
                                                <tr
                                                    key={item.key}
                                                    className="even:bg-gray-50 hover:bg-gray-200"
                                                >
                                                    <td className="px-1 py-1">
                                                        {item.id}
                                                    </td>
                                                    <td className="px-1 py-1 whitespace-nowrap">
                                                        <div className="capitalize mb-1">
                                                            {item.hari},&nbsp;
                                                            {dayjs(
                                                                item.tanggal_pengajuan
                                                            ).format(
                                                                "DD-MM-YY"
                                                            )}
                                                        </div>
                                                        <div className="capitalize mb-1">
                                                            Drop :&nbsp;
                                                            {dayjs(
                                                                item.tanggal_drop
                                                            ).format(
                                                                "DD-MM-YY"
                                                            )}
                                                        </div>
                                                    </td>

                                                    <td className="px-1 py-1 whitespace-nowrap">
                                                        <div>{item.unit}</div>
                                                        <div>
                                                            {item.mantri_name}
                                                            &nbsp;
                                                            {item.kelompok}
                                                        </div>
                                                    </td>
                                                    <td className="px-1 py-1 whitespace-nowrap">
                                                        <NumericFormat
                                                            value={item.drop}
                                                            displayType={"text"}
                                                            thousandSeparator={
                                                                ","
                                                            }
                                                        />
                                                    </td>

                                                    <td className="px-1 py-1">
                                                        <span
                                                            className={`px-2 py-1 rounded ${
                                                                item.status ==
                                                                    "normal" ||
                                                                item.status ==
                                                                    "cm"
                                                                    ? `bg-green-200`
                                                                    : item.status ==
                                                                      "mb"
                                                                    ? "bg-yellow-200"
                                                                    : item.status ==
                                                                      "ml"
                                                                    ? "bg-red-200"
                                                                    : ""
                                                            }`}
                                                        >
                                                            {item.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
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
                        <div className="mb-3">
                            <div className="text-lg font-semibold mb-2">
                                History Pengajuan Sebelumnya
                            </div>
                            <div className="overflow-hidden mb-3 rounded border border-black/5 shadow p-4">
                                <table className="w-full text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-900 uppercase bg-gray-200 sticky top-0 whitespace-nowrap">
                                        <tr>
                                            <th className="px-3 py-2">No</th>
                                            <th className="px-3 py-2">
                                                Tanggal Drop
                                            </th>
                                            <th className="px-3 py-2">Unit</th>

                                            <th className="px-3 py-2">
                                                Mantri
                                            </th>

                                            <th className="px-3 py-2">Drop</th>
                                            <th className="px-3 py-2">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {requestHistory ? (
                                            requestHistory.map((item, key) => (
                                                <tr
                                                    key={item.key}
                                                    className="even:bg-gray-50 hover:bg-gray-200 text-xs"
                                                >
                                                    <td className="px-3 py-2">
                                                        {item.id}
                                                    </td>
                                                    <td className="px-3 py-2">
                                                        {item.hari},&nbsp;
                                                        {dayjs(
                                                            item.tanggal_pengajuan
                                                        ).format("DD-MM-YYYY")}
                                                    </td>
                                                    <td className="px-3 py-2 whitespace-nowrap">
                                                        {item.unit}
                                                    </td>
                                                    <td className="px-3 py-2">
                                                        {item.mantri_name} -{" "}
                                                        {item.kelompok}
                                                    </td>
                                                    <td className="px-3 py-2">
                                                        <NumericFormat
                                                            value={item.drop}
                                                            displayType={"text"}
                                                            thousandSeparator={
                                                                ","
                                                            }
                                                        />
                                                    </td>

                                                    <td className={`px-3 py-2`}>
                                                        <span
                                                            className={`px-2 py-1 rounded ${
                                                                item.status ==
                                                                "acc"
                                                                    ? `bg-green-200`
                                                                    : item.status ==
                                                                      "tolak"
                                                                    ? "bg-red-200"
                                                                    : ""
                                                            }`}
                                                        >
                                                            {item.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
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
                </div>
            </div>
        </MobileLayout>
    );
};

export default Show;
// nama: "",
// nik: "",
// no_kk: "",
// alamat: "",
// mantri: "",
