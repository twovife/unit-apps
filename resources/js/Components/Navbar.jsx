import Hamburger from "hamburger-react";
import React, { useState } from "react";
import ResponsiveNavLink from "./ResponsiveNavLink";
import Dropdown from "./Dropdown";

const Navbar = ({ toggleSidebar, isOpen, auth, header }) => {
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
    return (
        <nav className="bg-red-700 p-2 px-4 sticky top-0 w-full z-50 text-white">
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
        </nav>
    );
};

export default Navbar;
