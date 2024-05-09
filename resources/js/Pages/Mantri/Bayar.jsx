import LinkButton from "@/Components/LinkButton";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import dayjs from "dayjs";
import React, { useState } from "react";
import { NumericFormat } from "react-number-format";
import MobileLayout from "@/Layouts/MobileLayout";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import CurrencyInput from "react-currency-input-field";
import SelectList from "@/Components/SelectList";
import useServerFilter from "@/Hooks/useServerFilter";
import PrimaryButton from "@/Components/PrimaryButton";
import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";

const Bayar = ({ loan, ...props }) => {
    const { status_angsuran } = useServerFilter();
    // const { emps } = useServerFilter(null, null, null, props.mantri);
    // console.log(loan);\

    const statusAngsuran = status_angsuran.filter(
        (item) => item.value >= loan.status
    );

    const { data, setData, post, processing, errors, reset } = useForm({
        danatitipan: false,
        jumlah: 0,
        pembayaran_date: "",
    });

    console.log(errors);
    // const [loading, setLoading] = useState(false);
    const handleOnChange = (e) => {
        setData(
            e.target.name,
            e.target.type === "checkbox" ? e.target.checked : e.target.value
        );
    };
    const onHandleCurencyChange = (value, name) => {
        setData(name, parseInt(value));
    };

    const onSubmitCreate = (e) => {
        e.preventDefault();
        post(props.post_route, {
            onSuccess: () => reset(),
        });
    };

    let pinjaman = loan.pinjaman;
    return (
        <MobileLayout
            auth={props.auth}
            errors={props.errors}
            header="Angsuran Nasabah"
            loading={processing}
        >
            <Head title="Buku Transaksi" />
            <div className="bg-white/30 rounded shadow w-full p-3">
                <div className="flex w-full justify-between items-center">
                    <div className="font-semibold">Bayar Angsuran</div>
                    <div className="font-semibold">
                        <LinkButton
                            as="a"
                            href={props.back_button}
                            color="blue"
                            title={"Back"}
                        />
                    </div>
                </div>
                <div className="overflow-auto">
                    <div>
                        <div className="flex gap-3">
                            <div className="flex-1 flex justify-between items-center">
                                <div>Nomor</div>
                                <div>:</div>
                            </div>
                            <div className="flex-[2]">{loan.id}</div>
                        </div>
                        <div className="flex gap-3">
                            <div className="flex-1 flex justify-between items-center">
                                <div>Nasabah</div>
                                <div>:</div>
                            </div>
                            <div className="flex-[2]">{loan.customer.nama}</div>
                        </div>
                        <div className="flex gap-3">
                            <div className="flex-1 flex justify-between items-center">
                                <div>Alamat</div>
                                <div>:</div>
                            </div>
                            <div className="flex-[2]">
                                {loan.customer.alamat}
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="flex-1 flex justify-between items-center">
                                <div>NIK</div>
                                <div>:</div>
                            </div>
                            <div className="flex-[2]">{loan.customer.nik}</div>
                        </div>
                        <div className="flex gap-3">
                            <div className="flex-1 flex justify-between items-center">
                                <div>Kelompok | Mantri</div>
                                <div>:</div>
                            </div>
                            <div className="flex-[2]">
                                {loan.kelompok} | {loan.droper.nama_karyawan}
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="flex-1 flex justify-between items-center">
                                <div>Tanggal Drop</div>
                                <div>:</div>
                            </div>
                            <div className="flex-[2]">
                                {loan.hari} |{" "}
                                {dayjs(loan.tanggal_drop).format("DD-MM-YYYY")}
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="flex-1 flex justify-between items-center">
                                <div>Pinjaman</div>
                                <div>:</div>
                            </div>
                            <div className="flex-[2]">
                                <NumericFormat
                                    value={loan.pinjaman}
                                    displayType={"text"}
                                    thousandSeparator={","}
                                    prefix={"Rp. "}
                                />{" "}
                                |{" "}
                                {loan.status == 1 ? (
                                    <span className="text-green-500">
                                        Normal
                                    </span>
                                ) : loan.status == 2 ? (
                                    <span className="text-amber-500">CM</span>
                                ) : loan.status == 3 ? (
                                    <span className="text-red-500">MB</span>
                                ) : (
                                    <span className="text-white bg-black p-1">
                                        ML
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="mt-3">
                        <div className="shadow text-xs rounded overflow-auto border max-h-[50vh]">
                            <table className="w-full bg-white">
                                <thead>
                                    <tr className="text-center">
                                        <th className="p-2">No</th>
                                        <th className="p-2">Tanggal Angsur</th>
                                        <th className="p-2">Jumlah</th>
                                        <th className="p-2">Saldo</th>
                                    </tr>
                                </thead>
                                <tbody className="text-center">
                                    {loan.angsuran?.map((item, key) => {
                                        pinjaman = pinjaman - item.jumlah;
                                        return (
                                            <tr
                                                key={key}
                                                className="odd:bg-gray-200"
                                            >
                                                <td className="px-2 py-1">
                                                    {key + 1}
                                                </td>
                                                <td className="px-2 py-1">
                                                    {dayjs(
                                                        item.pembayaran_date
                                                    ).format("DD-MM-YY")}
                                                </td>
                                                <td className="px-2 py-1">
                                                    <NumericFormat
                                                        value={item.jumlah}
                                                        displayType={"text"}
                                                        thousandSeparator={","}
                                                    />
                                                </td>
                                                <td className="px-2 py-1">
                                                    <div className="flex justify-center gap-2">
                                                        <div className="text-end flex-1">
                                                            <NumericFormat
                                                                value={pinjaman}
                                                                displayType={
                                                                    "text"
                                                                }
                                                                thousandSeparator={
                                                                    ","
                                                                }
                                                            />
                                                        </div>
                                                        <div className="text-start flex-1">
                                                            {item.status ==
                                                            1 ? (
                                                                <span className="text-green-500">
                                                                    Normal
                                                                </span>
                                                            ) : item.status ==
                                                              2 ? (
                                                                <span className="text-amber-500">
                                                                    CM
                                                                </span>
                                                            ) : item.status ==
                                                              3 ? (
                                                                <span className="text-red-500">
                                                                    MB
                                                                </span>
                                                            ) : (
                                                                <span className="text-white bg-black p-1">
                                                                    ML
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {props.batasan.is_paid == 0 ? (
                        <form onSubmit={onSubmitCreate} className="mt-3">
                            <div>Input Data</div>
                            <div className="flex gap-3 flex-wrap">
                                <div className="flex-1">
                                    <InputLabel value={"Tanggal"} />
                                    <TextInput
                                        type="date"
                                        onChange={handleOnChange}
                                        max={props.batasan.maxdate}
                                        min={props.batasan.mindate}
                                        className="block mt-1 w-full"
                                        id="pembayaran_date"
                                        name="pembayaran_date"
                                        value={data.pembayaran_date}
                                    />
                                    <InputError
                                        message={errors.pembayaran_date}
                                        className="mt-2"
                                    />
                                </div>
                                <div className="flex-1">
                                    <InputLabel value={"Jumlah"} />
                                    <CurrencyInput
                                        name="jumlah"
                                        id="jumlah"
                                        className={`border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm text-gray-800 dark:bg-gray-800 dark:text-gray-200 disabled:bg-black/10 dark:disabled:bg-white/10 block w-full mt-1`}
                                        allowDecimals={false}
                                        prefix="Rp. "
                                        required
                                        onValueChange={onHandleCurencyChange}
                                        value={data.jumlah}
                                        placeholder={
                                            "Inputkan angka tanpa sparator"
                                        }
                                    />
                                    <InputError
                                        message={errors.jumlah}
                                        className="mt-2"
                                    />
                                </div>
                            </div>
                            <div className="mt-3 px-2">
                                <div className="inline-block">
                                    <label className="flex items-center justify-center font-bold">
                                        <Checkbox
                                            name="danatitipan"
                                            value={data.danatitipan}
                                            onChange={handleOnChange}
                                        />
                                        <span className="ml-2 text-sm text-gray-600">
                                            Dana Titipan?
                                        </span>
                                    </label>
                                </div>
                            </div>
                            <div className="mt-3 flex justify-between items-center">
                                <PrimaryButton title={"Submit"} type="submit" />
                                <a
                                    target="_blank"
                                    href={`https://api.whatsapp.com/send?phone=628563158592&text=Ralat%20Angsuran%20Nomor%20${loan.id}%20%2C%20(%20ganti%20ketik%20ralatnya%20dimana%20)`}
                                    className="text-xs py-1 px-2 border border-gray-600 focus:bg-gray-600 focus:text-white rounded flex justify-center items-center"
                                >
                                    <span>lapor</span>
                                </a>
                            </div>
                        </form>
                    ) : (
                        <div className="mt-3">
                            <div>Sudah Ada Pembayaran Untuk Hari Ini</div>
                            <small>
                                *Laporkan jika ada yang eror
                                <a
                                    target="_blank"
                                    href={`https://api.whatsapp.com/send?phone=628563158592&text=Ralat%20Angsuran%20Nomor%20${loan.id}%20%2C%20(%20ganti%20ketik%20ralatnya%20dimana%20)`}
                                    className="text-xs ml-1 text-blue-700 underline"
                                >
                                    <span>disini</span>
                                </a>
                            </small>
                        </div>
                    )}
                </div>
            </div>
        </MobileLayout>
    );
};

export default Bayar;
// nama: "",
// nik: "",
// no_kk: "",
// alamat: "",
// mantri: "",
