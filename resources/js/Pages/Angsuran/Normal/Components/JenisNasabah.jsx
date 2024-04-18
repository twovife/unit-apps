import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import SelectList from "@/Components/SelectList";
import { useForm } from "@inertiajs/react";
import React from "react";

const JenisNasabah = ({ loan }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        loan_notes: "",
    });
    const handleOnChange = (e) => {
        setData(
            e.target.name,
            e.target.type === "checkbox" ? e.target.checked : e.target.value
        );
    };
    const onSubmitCreate = (e) => {
        e.preventDefault();
        post(route("pinjaman.normal.nasabah", loan.id));
        reset();
    };
    return (
        <div className="mb-3">
            <div className="text-lg font-semibold mb-2">Jenis Nasabah</div>
            <form
                onSubmit={onSubmitCreate}
                className="overflow-hidden mb-3 rounded border border-black/5 shadow p-4 "
            >
                <InputLabel htmlFor="status" value="Status" />
                <div className="flex justify-between items-center w-full gap-3">
                    <div className="flex-[3]">
                        <SelectList
                            id="loan_notes"
                            type="date"
                            name="loan_notes"
                            value={data.loan_notes}
                            options={[
                                {
                                    id: 1,
                                    value: "10L",
                                    display: "10L",
                                },
                                {
                                    id: 2,
                                    value: "Beban Pemakaian",
                                    display: "Beban Pemakaian",
                                },
                                {
                                    id: 3,
                                    value: "CM LUNAS",
                                    display: "CM LUNAS",
                                },
                            ]}
                            nullValue={true}
                            className="mt-1 block w-full"
                            onChange={handleOnChange}
                        />
                    </div>
                    <div className="flex-[1]">
                        <PrimaryButton title={"Submit"} type="submit" />
                    </div>
                </div>

                <InputError message={errors.loan_notes} className="mt-2" />
            </form>
        </div>
    );
};

export default JenisNasabah;
