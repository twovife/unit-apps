import { router, usePage } from "@inertiajs/react";
import React, { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/shadcn/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/shadcn/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/shadcn/ui/popover";

export default function GlobalBranchFilter({ compact = false }) {
    const { auth } = usePage().props;
    const globalFilter = auth.global_filter;
    const [open, setOpen] = useState(false);

    if (!globalFilter || !globalFilter.allowed_branches || globalFilter.allowed_branches.length <= 1) {
        return null;
    }

    const handleChange = (branchId) => {
        setOpen(false);
        router.post(route('set-branch'), { branch_id: branchId }, {
            preserveState: false,
            preserveScroll: true,
        });
    };

    const activeBranch = globalFilter.allowed_branches.find(
        (b) => b.id.toString() === globalFilter.active_branch_id?.toString()
    );

    const combobox = (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "justify-between font-normal",
                        compact ? "w-48 sm:w-60 h-8 text-xs" : "w-full bg-sidebar-background text-sm"
                    )}
                >
                    <span className="truncate">
                        {activeBranch
                            ? `${activeBranch.unit} ${activeBranch.type ? `(${activeBranch.type})` : ''}`
                            : "Pilih cabang..."}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[220px] p-0" align="start">
                <Command>
                    <CommandInput placeholder="Cari cabang..." />
                    <CommandList>
                        <CommandEmpty>Cabang tidak ditemukan.</CommandEmpty>
                        <CommandGroup>
                            {globalFilter.allowed_branches.map((branch) => (
                                <CommandItem
                                    key={branch.id}
                                    value={branch.unit}
                                    onSelect={() => handleChange(branch.id)}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            globalFilter.active_branch_id?.toString() === branch.id.toString()
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                    {branch.unit} {branch.type ? `(${branch.type})` : ''}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );

    if (compact) {
        return combobox;
    }

    return (
        <div className="px-4 py-3 border-b border-gray-700/50 bg-sidebar-accent/30">
            <label className="block text-[10px] text-gray-400 mb-1 uppercase tracking-wider font-semibold">
                Cabang Aktif
            </label>
            {combobox}
        </div>
    );
}
