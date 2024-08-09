import { Button } from "@/shadcn/ui/button";
import { Link } from "@inertiajs/react";
import { GitMerge, LayoutList, MenuIcon } from "lucide-react";
import React, { useState } from "react";
import { BiSolidChevronDown } from "react-icons/bi";

const DropdownButton = ({ title, items, active, className, icon }) => {
    const [isOpen, setIsOpen] = useState(active);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative">
            <Button
                variant={isOpen ? "" : "outline"}
                onClick={toggleDropdown}
                className={`${className} w-full flex justify-start items-center`}
            >
                {icon ? icon : <LayoutList className="mr-2 h-4 w-4" />}
                <div className="w-full flex-1 text-start">{title}</div>
                <BiSolidChevronDown
                    className={`${
                        isOpen ? "transform rotate-180" : ""
                    } w-5 h-5 transition-all duration-300`}
                />
            </Button>
            {isOpen && (
                <div className="w-full mt-2 origin-top-right rounded-md">
                    <div className="py-1 space-y-2">
                        {items.map((item, index) => (
                            <Button
                                asChild
                                variant={
                                    item.active ? "destructive" : "outline"
                                }
                                className={`${className} w-full flex justify-start items-center`}
                                onClick={() => setIsOpen(false)}
                            >
                                <Link href={item.href}>
                                    <GitMerge className="mr-2 h-4 w-4" />
                                    {item["title"]}
                                </Link>
                            </Button>

                            // <Button
                            //     asChild
                            //     variant={active ? "" : "outline"}
                            //     className="flex justify-start items-start"
                            // >
                            //     <Link
                            //         href={item.link}
                            //         as="a"
                            //         key={index}
                            //         className={`w-full flex justify-start items-center`}
                            //         onClick={() => {
                            //             setIsOpen(false);
                            //         }}
                            //     >
                            //         {item["title"]}
                            //     </Link>
                            // </Button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DropdownButton;
