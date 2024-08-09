import { Transition } from "@headlessui/react";
import React from "react";
import DropdownButton from "./shadcn/DropDownButton";
import ButtonMenu from "./ButtonMenu";
import { usePage } from "@inertiajs/react";
import { Button } from "@/shadcn/ui/button";
import MenuButton from "./shadcn/MenuButton";

const Sidebar = ({ isOpen }) => {
    const { auth } = usePage().props;
    const unitAkses = auth.user.permissions.some(
        (item) => item.name === "unit"
    );
    return (
        <aside
            className={`bg-white text-slate-900 w-64 fixed top-16 left-0 bottom-0 z-40 transition-all ease-in-out duration-300 border-r shadow ${
                isOpen ? "translate-x-0" : "-translate-x-64"
            }`}
        >
            <div className="py-4 px-4 font-semibold border-b">Apps Menu</div>
            <div className="p-4 space-y-4">
                <MenuButton
                    href={route("home")}
                    title={"Home"}
                    active={route().current("home")}
                />
                {unitAkses && (
                    <>
                        <MenuButton title="Data Karyawan" />

                        <DropdownButton
                            title="Transaksi Drop"
                            active={route().current("transaction.*")}
                            items={[
                                {
                                    id: 1,
                                    title: "Buku Transaksi",
                                    href: route("transaction.index"),
                                    active:
                                        route().current("transaction.*") &&
                                        !route().current(
                                            "transaction.index_open"
                                        ),
                                },
                                {
                                    id: 1,
                                    title: "Open Transaksi",
                                    href: route("transaction.index_open"),
                                    active: route().current(
                                        "transaction.index_open"
                                    ),
                                },
                            ]}
                        />
                        <DropdownButton
                            title="Buku Angsuran"
                            active={route().current("pinjaman.*")}
                            items={[
                                {
                                    id: 1,
                                    title: "Angsuran Normal",
                                    link: route("pinjaman.normal.index"),
                                    active: route().current(
                                        "pinjaman.normal.*"
                                    ),
                                },
                            ]}
                        />
                    </>
                )}

                <MenuButton
                    url={route("mantriapps.index")}
                    title={"Mantri Apps"}
                    active={route().current("mantriapps.*")}
                />
            </div>
        </aside>
    );
};

export default Sidebar;
