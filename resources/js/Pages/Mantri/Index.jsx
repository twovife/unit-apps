import MobileLayout from "@/Layouts/MobileLayout";
import { Head, Link } from "@inertiajs/react";
import React, { useState } from "react";
import { AiFillCustomerService, AiOutlineUser } from "react-icons/ai";
import { IoPersonAddSharp } from "react-icons/io5";
import { BiExit, BiLaptop, BiMoney, BiMoneyWithdraw } from "react-icons/bi";
import { LuBookPlus } from "react-icons/lu";

const Index = ({ ...props }) => {
    const [loading, setloading] = useState(false);
    const unitAkses = props.auth.user.permissions.some(
        (item) => item.name === "unit"
    );
    return (
        <MobileLayout
            auth={props.auth}
            errors={props.errors}
            header="Buku Transaksi"
            loading={loading}
        >
            <Head title="Halaman Utama" />
            <div className="flex justify-center items-center gap-6 flex-wrap">
                <Link
                    as="a"
                    href={route("mantriapps.create")}
                    className="w-32 h-32 rounded p-3 flex flex-col justify-center items-center shadow hover:shadow-md focus:shadow-lg bg-gray-50/40 backdrop-blur border border-gray-200"
                >
                    <IoPersonAddSharp className="text-5xl" />
                    <p className="text-center leading-tight">
                        Pengajuan Pinjaman
                    </p>
                </Link>
                <Link
                    as="a"
                    href={route("mantriapps.drop")}
                    className="w-32 h-32 rounded p-3 flex flex-col justify-center items-center shadow hover:shadow-md focus:shadow-lg bg-gray-50/40 backdrop-blur border border-gray-200"
                >
                    <BiMoneyWithdraw className="text-5xl" />
                    <p className="text-center leading-tight">Daftar Drop</p>
                </Link>
                <Link
                    as="a"
                    href={route("mantriapps.angsur")}
                    className="w-32 h-32 rounded p-3 flex flex-col justify-center items-center shadow hover:shadow-md focus:shadow-lg bg-gray-50/40 backdrop-blur border border-gray-200"
                >
                    <BiMoney className="text-5xl" />
                    <p className="text-center leading-tight">Daftar Storting</p>
                </Link>
                <Link
                    as="a"
                    href={route("mantriapps.transaksi")}
                    className="w-32 h-32 rounded p-3 flex flex-col justify-center items-center shadow hover:shadow-md focus:shadow-lg bg-gray-50/40 backdrop-blur border border-gray-200"
                >
                    <LuBookPlus className="text-5xl" />
                    <p className="text-center leading-tight">Buku Transaksi</p>
                </Link>
                {unitAkses && (
                    <Link
                        href={route("home")}
                        className="w-32 h-32 rounded p-3 flex flex-col justify-center items-center shadow hover:shadow-md focus:shadow-lg bg-gray-50/40 backdrop-blur border border-gray-200"
                    >
                        <BiLaptop className="text-5xl" />
                        <p className="text-center leading-tight">Web Apps</p>
                    </Link>
                )}

                <Link
                    href={route("logout")}
                    method="post"
                    as="button"
                    className="w-32 h-32 rounded p-3 flex flex-col justify-center items-center shadow hover:shadow-md focus:shadow-lg bg-gray-50/40 backdrop-blur border border-gray-200"
                >
                    <BiExit className="text-5xl" />
                    <p className="text-center leading-tight">Logout</p>
                </Link>
            </div>
            <div className="mt-9">
                <div className="bg-gray-50/40 backdrop-blur rounded shadow border border-gray-200 p-2 w-full">
                    <div className="flex justify-start items-center gap-2">
                        <div className="flex-[3]">Nama</div>
                        <div className="flex-1">:</div>
                        <div className="flex-[5]">
                            {props.auth.user.employee.nama_karyawan}
                        </div>
                    </div>
                    <div className="flex justify-start items-center gap-2">
                        <div className="flex-[3]">Wilayah / Unit</div>
                        <div className="flex-1">:</div>
                        <div className="flex-[5]">
                            {props.auth.user.employee.branch.wilayah} /{" "}
                            {props.auth.user.employee.branch.unit}
                        </div>
                    </div>
                    <div className="flex justify-start items-center gap-2">
                        <div className="flex-[3]">Jabatan</div>
                        <div className="flex-1">:</div>
                        <div className="flex-[5]">
                            {props.auth.user.employee.jabatan}{" "}
                            {props.auth.user.employee.area != 0 ??
                                ` ${props.auth.user.employee.area}`}
                        </div>
                    </div>
                </div>
            </div>
        </MobileLayout>
    );
};

export default Index;
