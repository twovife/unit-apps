import Hamburger from "hamburger-react";
import React, { useState } from "react";
import ResponsiveNavLink from "./ResponsiveNavLink";
import Dropdown from "./Dropdown";
import { CircleUser, Menu, Package2, UserRound } from "lucide-react";
import { Link } from "@inertiajs/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shadcn/ui/dropdown-menu";
import { Button } from "@/shadcn/ui/button";
import { PersonIcon } from "@radix-ui/react-icons";

const Navbar = ({ toggleSidebar, isOpen, auth, header }) => {
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
    return (
        <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-white px-4 md:px-6 z-50">
            <nav className="font-medium flex flex-row w-full items-center gap-5 text-sm lg:gap-6">
                <div className="flex items-center justify-start">
                    <Hamburger
                        distance={"md"}
                        toggled={isOpen}
                        toggle={toggleSidebar}
                        size={16}
                        rounded
                        color="#020617"
                    />
                    <p className="font-semibold hidden lg:block">UBMI APPS</p>
                </div>
                <div className="w-full flex-1 flex gap-6 underline">
                    <Link
                        href="#"
                        className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Home
                    </Link>
                    <Link
                        href="#"
                        className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Mantri Apps
                    </Link>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button className="flex items-center justify-center gap-3 text-sm">
                            {auth.user.username}
                            <UserRound className="h-4 w-4 animate-pulse" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>
                            {auth.user.employee.nama_karyawan}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Link href={route("profile.edit")}>Profile</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <a
                                target="_blank"
                                href="https://www.youtube.com/watch?v=HrHDfHy0lHk"
                            >
                                Support
                            </a>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Link
                                href={route("logout")}
                                method="post"
                                as="button"
                                replace="true"
                            >
                                Logout
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </nav>
            {/* <nav className="bg-red-700 p-2 px-4 sticky top-0 w-full z-50 text-white">
                <div className="flex items-center justify-between">
                    <div className="flex items-center justify-start">
                        <Hamburger
                            toggled={isOpen}
                            toggle={toggleSidebar}
                            size={16}
                            rounded
                            color="#020617"
                        />
                        <p className="font-semibold">UBMI APPS</p>
                    </div>
                    <p className="font-semibold text text-white leading-tight">
                        {header}
                    </p>

                    <div className="flex items-center sm:ml-6">
                        <div className="ml-3 relative">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <span className="inline-flex rounded-md">
                                        <button
                                            type="button"
                                            className="inline-flex items-center text-white border border-transparent text-sm leading-4 font-medium rounded-md bg-red-700 hover:text-gray-50 focus:outline-none transition ease-in-out duration-150"
                                        >
                                            {auth.user.username}

                                            <svg
                                                className="ml-2 -mr-0.5 h-4 w-4"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </span>
                                </Dropdown.Trigger>

                                <Dropdown.Content>
                                    <Dropdown.Link href={route("profile.edit")}>
                                        Profile
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href={route("logout")}
                                        method="post"
                                        as="button"
                                    >
                                        Log Out
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            </nav> */}
        </header>
    );
};

export default Navbar;
