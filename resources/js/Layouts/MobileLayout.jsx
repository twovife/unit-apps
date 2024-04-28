import Loading from "@/Components/Loading";
import SweetAlert from "@/Components/SweetAlert";
import { Link, usePage } from "@inertiajs/react";
import React from "react";
import {
    AiFillCustomerService,
    AiFillHome,
    AiOutlineUser,
} from "react-icons/ai";
import { BiExit, BiMoney, BiMoneyWithdraw } from "react-icons/bi";

const MobileLayout = ({ auth, header, children, loading = false }) => {
    const { errors, flash } = usePage().props;
    console.log(errors);
    return (
        <div className="antialiased relative z-10">
            {Object.keys(errors).length > 0 && (
                <SweetAlert type="error" flash={errors} />
            )}
            {flash?.message && <SweetAlert type="success" flash={flash} />}
            <Loading show={loading} />

            <div className="relative max-w-xl mx-auto h-screen">
                <img
                    src="/18529.jpg"
                    className="fixed z-0 h-screen w-full top-0 left-1/2 -translate-x-1/2 opacity-70"
                />
                <div className="sticky top-0 z-10 bg-red-500 text-white">
                    <div className="w-full flex items-center justify-between py-2 px-4">
                        <div className="flex justify-start items-center gap-1">
                            <span>
                                <AiFillHome />
                            </span>
                            <span>{header}</span>
                        </div>
                        <div>{auth.user.username}</div>
                    </div>
                </div>
                <div className="p-4 relative">{children}</div>
            </div>
        </div>
    );
};

export default MobileLayout;
