import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import SelectList from "@/Components/SelectList";
import TextInput from "@/Components/TextInput";
import { useForm } from "@inertiajs/react";
import React from "react";
import CurrencyInput from "react-currency-input-field";

const NewCustomer = ({
    setLoading,
    max_date,
    min_date,
    emps,
    nik,
    url = route("transaction.store"),
}) => {
    console.log(min_date);
    const { data, setData, post, processing, errors, reset } = useForm({
        transaction_date: max_date,
        tanggal_drop: "",
        nama: "",
        nik: nik,
        no_kk: "",
        alamat: "",
        mantri: "",
        pinjaman: "",
        type_create: "1",
        droplangsung: false,
    });

    const handleOnChange = (e) => {
        setData(
            e.target.name,
            e.target.type === "checkbox" ? e.target.checked : e.target.value
        );
    };

    const onHandleCurencyChange = (value, name) => {
        setData(name, value);
    };

    const onSubmitCreate = (e) => {
        e.preventDefault();
        post(url);
        setLoading(processing);
    };

    return (
        <form className="flex-1" onSubmit={onSubmitCreate}>
            <div className="text-lg font-semibold">
                Permintaan Pinjaman Baru (Nasabah Baru)
            </div>
            <div className="p-4">
                <div className="flex w-full gap-2 mb-1">
                    <div className="flex-1">
                        <InputLabel
                            htmlFor="transaction_date"
                            value="Tanggal Pengajuan"
                        />

                        <TextInput
                            id="transaction_date"
                            type="date"
                            name="transaction_date"
                            max={max_date}
                            value={data.transaction_date}
                            className="mt-1 block w-full"
                            onChange={handleOnChange}
                        />

                        <InputError
                            message={errors.transaction_date}
                            className="mt-2"
                        />
                    </div>
                    <div className="flex-1">
                        <InputLabel
                            htmlFor="tanggal_drop"
                            value="Tanggal Drop"
                        />

                        <TextInput
                            id="tanggal_drop"
                            type="date"
                            name="tanggal_drop"
                            min={min_date}
                            value={data.tanggal_drop}
                            className="mt-1 block w-full"
                            onChange={handleOnChange}
                        />

                        <InputError
                            message={errors.tanggal_drop}
                            className="mt-2"
                        />
                    </div>
                </div>
                <div className="mb-1">
                    <InputLabel htmlFor="nik" value="NIK Customer" />

                    <TextInput
                        id="nik"
                        type="text"
                        name="nik"
                        value={data.nik}
                        className="mt-1 block w-full"
                        readOnly={true}
                        onChange={handleOnChange}
                    />

                    <InputError message={errors.nik} className="mt-2" />
                </div>
                <div className="mb-1">
                    <InputLabel
                        optional
                        htmlFor="no_kk"
                        value="No KK Customer"
                    />

                    <TextInput
                        id="no_kk"
                        type="text"
                        name="no_kk"
                        required={false}
                        value={data.no_kk}
                        className="mt-1 block w-full"
                        onChange={handleOnChange}
                    />

                    <InputError message={errors.no_kk} className="mt-2" />
                </div>
                <div className="mb-1">
                    <InputLabel htmlFor="nama" value="Nama Customer" />

                    <TextInput
                        id="nama"
                        type="text"
                        name="nama"
                        value={data.nama}
                        className="mt-1 block w-full"
                        onChange={handleOnChange}
                    />

                    <InputError message={errors.nama} className="mt-2" />
                </div>
                <div className="mb-1">
                    <InputLabel htmlFor="alamat" value="Alamat Customer" />

                    <TextInput
                        id="alamat"
                        type="text"
                        name="alamat"
                        value={data.alamat}
                        className="mt-1 block w-full"
                        onChange={handleOnChange}
                    />

                    <InputError message={errors.alamat} className="mt-2" />
                </div>

                <div className="mb-1">
                    <InputLabel htmlFor="mantri" value="Mantri" />

                    <SelectList
                        id="mantri"
                        type="text"
                        name="mantri"
                        options={emps}
                        nullValue={true}
                        value={data.mantri}
                        className="mt-1 block w-full"
                        onChange={handleOnChange}
                    />

                    <InputError message={errors.mantri} className="mt-2" />
                </div>
                <div className="mb-1">
                    <InputLabel
                        htmlFor="pinjaman"
                        value={"Nominal Pinjaman"}
                        className="mb-1"
                    />
                    <CurrencyInput
                        name="pinjaman"
                        id="pinjaman"
                        className={`border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm text-gray-800 dark:bg-gray-800 dark:text-gray-200 disabled:bg-black/10 dark:disabled:bg-white/10 block w-full text-sm mt-2`}
                        allowDecimals={false}
                        prefix="Rp. "
                        min={1}
                        required
                        onValueChange={onHandleCurencyChange}
                        value={data.pinjaman}
                        placeholder={"Inputkan angka tanpa sparator"}
                    />
                    <InputError message={errors.pinjaman} className="mt-2" />
                </div>

                <div className="block mt-4">
                    <PrimaryButton
                        type="submit"
                        title={"Submit"}
                        color="green"
                    />
                </div>
            </div>
        </form>
    );
};

export default NewCustomer;
