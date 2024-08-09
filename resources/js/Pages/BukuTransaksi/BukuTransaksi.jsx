import SearchComponent from "@/Components/shadcn/SearchComponent";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/shadcn/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shadcn/ui/dropdown-menu";
import { Input } from "@/shadcn/ui/input";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shadcn/ui/table";
import { Head } from "@inertiajs/react";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { File, ListFilter, PlusCircle } from "lucide-react";
import React from "react";

const BukuTransaksi = ({ props }) => {
    return (
        <Authenticated header={<Head>Buku Transaksi</Head>}>
            {/* <div class="space-y-2">
                <h1 class="scroll-m-20 text-3xl font-bold tracking-tight">
                    Buku Transaksi
                </h1>
                <p class="text-base text-muted-foreground">
                    <span>Buku Transaksi Cabang Per Kelompok Mantri</span>
                </p>
            </div> */}

            <div className="flex justify-between items-center mb-3">
                <div className="ml-auto flex items-center gap-2">
                    <SearchComponent
                        urlLink={route("transaction.index_buku_transaksi")}
                        localState={"transaction_index_buku_transaksi"}
                        searchDate={true}
                    />
                    <Button>
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Tambah Pengajuan
                        </span>
                    </Button>
                </div>
            </div>

            <Table className="border rounded">
                <TableCaption>A list of your recent invoices.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Invoice</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell className="font-medium">INV001</TableCell>
                        <TableCell>Paid</TableCell>
                        <TableCell>Credit Card</TableCell>
                        <TableCell className="text-right">$250.00</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </Authenticated>
    );
};

export default BukuTransaksi;
