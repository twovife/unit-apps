import { Link } from "@inertiajs/react";
import React, { useState } from "react";
import { BiSolidChevronDown } from "react-icons/bi";

const DropdownButton = ({ title, items, active }) => {
    const [isOpen, setIsOpen] = useState(active);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative">
            <button
                onClick={toggleDropdown}
                className={`flex items-center justify-between w-full px-4 py-2 text-left text-sm font-medium transition duration-300 ease-in-out border border-transparent rounded-md focus:outline-none ${
                    isOpen
                        ? `bg-red-100 text-gray-900  hover:text-gray-900 hover:bg-red-100`
                        : `text-gray-600 bg-white hover:text-gray-900 hover:bg-red-100`
                }`}
            >
                {title}
                <BiSolidChevronDown
                    className={`${
                        isOpen ? "transform rotate-180" : ""
                    } w-5 h-5 transition-all duration-300`}
                />
            </button>
            {isOpen && (
                <div className="w-full mt-2 origin-top-right rounded-md">
                    <div className="py-1 space-y-2">
                        {items.map((item, index) => (
                            <Link
                                href={item.link}
                                as="a"
                                key={index}
                                className={`block w-full px-4 py-2 text-sm text-gray-700 text-left rounded-md ring ring-red-500 ring-opacity-5 ${
                                    item.active
                                        ? `hover:bg-red-700 bg-red-600 text-white`
                                        : `hover:bg-red-100 bg-white text-slate-900`
                                }`}
                                onClick={() => {
                                    setIsOpen(false);
                                }}
                            >
                                {item["title"]}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DropdownButton;
