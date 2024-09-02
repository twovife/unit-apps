import { j as jsxs, F as Fragment, a as jsx } from "../ssr.mjs";
import { u as useOptionGenerator, S as SelectList } from "./SelectComponent-359a9ab7.mjs";
import { B as Button } from "./button-9a023ace.mjs";
import { I as Input } from "./input-a726a844.mjs";
import { usePage, useForm, router } from "@inertiajs/react";
import { MagnifyingGlassIcon, ResetIcon } from "@radix-ui/react-icons";
import { useRef, useState, useEffect } from "react";
import { L as Loading } from "./Loading-649771fa.mjs";
import dayjs from "dayjs";
const SearchComponent = ({
  urlLink = route("home"),
  localState,
  searchDate = false,
  searchMonth = false,
  searchPlanText = false,
  planTextName = "search",
  searchHari = false,
  searchWilayah = false,
  searchGroupingBranch = false,
  searchKelompok = false,
  children,
  nexOrPrevious = null,
  setNexOrPrevious
}) => {
  const {
    selectedSearchParam,
    optWilayah,
    selectedWilayah,
    setSelectedWilayah,
    filteredBranch,
    selectedBranch_id,
    selectedMonth,
    selectedDate,
    selectedKelompok,
    optKelompok,
    dayOpt
  } = useOptionGenerator();
  const {
    server_filter: { hari, branch_id, month, date, wilayah, kelompok }
  } = usePage().props;
  const submitBtnRef = useRef(null);
  const { data, setData, get, processing } = useForm({});
  const [loading, setLoading] = useState(false);
  console.log(data);
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
          [planTextName]: ""
        }));
      }
    } else {
      if (isNaN(value)) {
        setData(name, value);
      } else {
        setData(name, parseInt(value));
      }
    }
  };
  const onWilayahChange = (e) => {
    const { value } = e.target;
    setSelectedWilayah(value);
    setData({ branch_id: "" });
  };
  const onSubmitSearch = (e) => {
    e.preventDefault();
    get(urlLink);
  };
  const resetFilter = (e) => {
    e.preventDefault();
    router.visit(urlLink, {
      onStart: (visit) => setLoading(true),
      onFinish: (visit) => setLoading(false)
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
      if (branch_id) {
        newData.branch_id = parseInt(branch_id);
      }
      if (date) {
        newData.date = date;
      }
      if (month) {
        newData.month = month;
      }
      if (wilayah) {
        newData.wilayah = parseInt(wilayah);
      }
      if (kelompok) {
        newData.kelompok = parseInt(kelompok);
      }
      if (hari) {
        newData.hari = hari;
      }
    }
    if (Object.keys(newData).length > 0) {
      setData(newData);
    }
  }, []);
  useEffect(() => {
    setLoading(processing);
  }, [processing]);
  useEffect(() => {
    if (nexOrPrevious) {
      if (nexOrPrevious == "next") {
        setData((prevData) => ({
          ...prevData,
          date: dayjs(prevData.date).add(1, "week").format("YYYY-MM-DD")
        }));
        setTimeout(() => {
          submitBtnRef.current.click();
        }, 500);
      } else if (nexOrPrevious == "previous") {
        setData((prevData) => ({
          ...prevData,
          date: dayjs(prevData.date).subtract(1, "week").format("YYYY-MM-DD")
        }));
        setTimeout(() => {
          submitBtnRef.current.click();
        }, 500);
      }
    }
    return () => {
      if (nexOrPrevious) {
        setNexOrPrevious(null);
      }
    };
  }, [nexOrPrevious]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Loading, { show: processing || loading }),
    /* @__PURE__ */ jsxs(
      "form",
      {
        className: "items-end justify-center w-full grid-cols-2 gap-3 lg:flex lg:justify-end",
        onSubmit: onSubmitSearch,
        children: [
          searchDate && /* @__PURE__ */ jsx("div", { className: "w-full", children: /* @__PURE__ */ jsx(
            Input,
            {
              className: "w-full",
              type: "date",
              name: "date",
              value: data.date,
              onChange: onSearchChange,
              placeholder: "Name of your project"
            }
          ) }),
          searchMonth && /* @__PURE__ */ jsx("div", { className: "w-full", children: /* @__PURE__ */ jsx(
            Input,
            {
              className: "w-full",
              type: "month",
              name: "month",
              value: data.month,
              onChange: onSearchChange,
              placeholder: "Name of your project"
            }
          ) }),
          searchKelompok && /* @__PURE__ */ jsx("div", { className: "w-full", children: /* @__PURE__ */ jsx(
            SelectList,
            {
              className: "w-full",
              value: data.kelompok,
              options: optKelompok,
              name: "kelompok",
              onChange: onSearchChange
            }
          ) }),
          searchWilayah && /* @__PURE__ */ jsx("div", { className: "w-full", children: /* @__PURE__ */ jsx(
            SelectList,
            {
              className: "w-full",
              value: data.wilayah,
              options: optWilayah,
              name: "wilayah",
              onChange: onSearchChange
            }
          ) }),
          searchHari && /* @__PURE__ */ jsx("div", { className: "w-full", children: /* @__PURE__ */ jsx(
            SelectList,
            {
              className: "w-full",
              value: data.hari,
              options: dayOpt,
              name: "hari",
              onChange: onSearchChange
            }
          ) }),
          searchGroupingBranch && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center w-full gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsx(
              SelectList,
              {
                valuetype: "number",
                value: selectedWilayah,
                options: optWilayah,
                name: "wilayah",
                required: "true",
                onChange: onWilayahChange
              }
            ) }),
            selectedWilayah !== "" && /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsx(
              SelectList,
              {
                value: data.branch_id,
                options: filteredBranch,
                name: "branch_id",
                required: "true",
                onChange: onSearchChange
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end col-span-2 gap-3", children: [
            /* @__PURE__ */ jsxs(Button, { ref: submitBtnRef, variant: "outline", type: "submit", children: [
              /* @__PURE__ */ jsx(MagnifyingGlassIcon, { className: "h-3.5 w-3.5" }),
              /* @__PURE__ */ jsx("span", { className: "sr-only sm:not-sr-only sm:whitespace-nowrap", children: "Cari" })
            ] }),
            /* @__PURE__ */ jsxs(Button, { variant: "outline", type: "button", onClick: resetFilter, children: [
              /* @__PURE__ */ jsx(ResetIcon, {}),
              /* @__PURE__ */ jsx("span", { className: "sr-only sm:not-sr-only sm:whitespace-nowrap", children: "Reset" })
            ] }),
            children
          ] })
        ]
      }
    )
  ] });
};
export {
  SearchComponent as S
};
