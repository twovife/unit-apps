import { Transition } from "@headlessui/react";
import React from "react";
import DropdownButton from "./DropDownButton";
import ButtonMenu from "./ButtonMenu";
import { usePage } from "@inertiajs/react";

const Sidebar = ({ isOpen }) => {
    const { auth } = usePage().props;
    const unitAkses = auth.user.permissions.some(
        (item) => item.name === "unit"
    );
    return (
        <aside
            className={`bg-slate-50 text-slate-900 w-64 fixed top-14 left-0 bottom-0 z-40 transition-all ease-in-out duration-300 ${
                isOpen ? "translate-x-0" : "-translate-x-64"
            }`}
        >
            <div className="py-2 px-4 font-semibold">Apps Menu</div>
            <div className="p-4 space-y-4">
                <ButtonMenu
                    url={route("home")}
                    title={"Home"}
                    active={route().current("home")}
                />
                {unitAkses && (
                    <>
                        <ButtonMenu
                            url={route("batchupdate.batch_create")}
                            title={"Batch_data"}
                            active={route().current("batchupdate.*")}
                        />

                        <DropdownButton
                            title="Transaksi Drop"
                            active={route().current("transaction.*")}
                            items={[
                                {
                                    id: 1,
                                    title: "Buku Transaksi",
                                    link: route("transaction.index"),
                                    active:
                                        route().current("transaction.*") &&
                                        !route().current(
                                            "transaction.index_open"
                                        ),
                                },
                                {
                                    id: 1,
                                    title: "Open Transaksi",
                                    link: route("transaction.index_open"),
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

                <ButtonMenu
                    url={route("mantriapps.index")}
                    title={"Mantri Apps"}
                    active={route().current("mantriapps.*")}
                />
            </div>
        </aside>
    );
};

export default Sidebar;
