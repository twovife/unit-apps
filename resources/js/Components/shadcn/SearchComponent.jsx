import useOptionGenerator from "@/Hooks/useOptionGenerator";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import { useForm } from "@inertiajs/react";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import React, { useEffect, useState } from "react";
import Loading from "../Loading";

const SearchComponent = ({
    urlLink = route("home"),
    localState,
    searchDate = false,
    searchMonth = false,
    searchPlanText = false,
    planTextName = "search",

    searchWilayah = false,
    searchBranch = false,
    searchGroupingBranch = false,

    children,
}) => {
    const {
        selectedSearchParam,
        wilayah,
        selectedWilayah,
        setSelectedWilayah,
        filteredBranch,
        selectedBranch_id,
        selectedMonth,
        selectedDate,
    } = useOptionGenerator();
    console.log(selectedDate);

    const { data, setData, get, processing } = useForm({});
    const [loading, setLoading] = useState(false);
    const onSearchChange = (e) => {
        const { name, value } = e.target;
        if (searchPlanText) {
            if (name == planTextName) {
                setData((prevData) => {
                    const newData = { [name]: value };

                    for (const key in prevData) {
                        if (key !== name) {
                            newData[key] = "";
                        }
                    }
                    return newData;
                });
            } else {
                setData((prevData) => ({
                    ...prevData,
                    [name]: value,
                    [planTextName]: "",
                }));
            }
        } else {
            setData(name, value);
        }
    };

    const onWilayahChange = (e) => {
        //mengganti data.wilayah sekalian mengganti wilayah pada filter
        const { value } = e.target;
        setSelectedWilayah(value);
        setData({ branch_id: "" });
    };

    const onSubmitSearch = (e) => {
        e.preventDefault();
        get(urlLink);
    };

    const ResetFilter = (e) => {
        e.preventDefault();
        router.visit(urlLink, {
            onStart: (visit) => setLoading(true),
            onFinish: (visit) => setLoading(false),
        });
        localStorage.setItem(
            localState,
            JSON.stringify({ oldFilter: [], oldPage: 1 })
        );
    };

    useEffect(() => {
        const newData = {};

        if (selectedSearchParam) {
            newData[planTextName] = selectedSearchParam;
        } else {
            if (selectedBranch_id) {
                newData.branch_id = selectedBranch_id;
            }
            if (selectedDate) {
                newData.date = selectedDate;
            }
            if (selectedMonth) {
                newData.month = selectedMonth;
            }
            if (selectedWilayah) {
                newData.wilayah = selectedWilayah;
            }
        }

        if (Object.keys(newData).length > 0) {
            setData(newData);
        }
    }, []);

    useEffect(() => {
        setLoading(processing);
    }, [processing]);

    console.log(data);

    return (
        <>
            <Loading show={processing || loading} />
            <form
                className="flex w-full flex-col lg:flex-row gap-3 items-end lg:items-center justify-end"
                onSubmit={onSubmitSearch}
            >
                {searchDate && (
                    <Input
                        type="date"
                        name="date"
                        value={data.date}
                        onChange={onSearchChange}
                        placeholder="Name of your project"
                    />
                )}
                {searchMonth && (
                    <Input
                        type="month"
                        name="month"
                        value={data.month}
                        onChange={onSearchChange}
                        placeholder="Name of your project"
                    />
                )}
                <Button variant="outline" type="submit">
                    <MagnifyingGlassIcon className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Cari
                    </span>
                </Button>
            </form>
        </>
    );
};

export default SearchComponent;
