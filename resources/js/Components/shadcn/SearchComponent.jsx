import useOptionGenerator from '@/Hooks/useOptionGenerator';
import { Button } from '@/shadcn/ui/button';
import { Input } from '@/shadcn/ui/input';
import { router, useForm, usePage } from '@inertiajs/react';
import { MagnifyingGlassIcon, ResetIcon } from '@radix-ui/react-icons';
import React, { useEffect, useRef, useState } from 'react';
import Loading from '../Loading';
import SelectComponent from './SelectComponent';
import dayjs from 'dayjs';

const SearchComponent = ({
  urlLink = route('home'),
  localState,
  searchDate = false,
  searchMonth = false,
  searchPlanText = false,
  planTextName = 'search',

  searchHari = false,

  searchWilayah = false,
  searchGroupingBranch = false,
  searchKelompok = false,

  children,

  nexOrPrevious = null,
  setNexOrPrevious,
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
    dayOpt,
  } = useOptionGenerator();

  const {
    server_filter: { hari, branch_id, month, date, wilayah, kelompok },
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
              newData[key] = '';
            }
          }
          return newData;
        });
      } else {
        setData((prevData) => ({
          ...prevData,
          [name]: value,
          [planTextName]: '',
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
    setData({ branch_id: '' });
  };

  const onSubmitSearch = (e) => {
    e.preventDefault();
    get(urlLink);
  };

  const resetFilter = (e) => {
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
      if (nexOrPrevious == 'next') {
        setData((prevData) => ({
          ...prevData,
          date: dayjs(prevData.date).add(1, 'week').format('YYYY-MM-DD'),
        }));

        setTimeout(() => {
          submitBtnRef.current.click();
        }, 500);
      } else if (nexOrPrevious == 'previous') {
        setData((prevData) => ({
          ...prevData,
          date: dayjs(prevData.date).subtract(1, 'week').format('YYYY-MM-DD'),
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

  // console.log(typeof data.kelompok);

  return (
    <>
      <Loading show={processing || loading} />
      <form
        className="items-end justify-center w-full grid-cols-2 gap-3 lg:flex lg:justify-end"
        onSubmit={onSubmitSearch}
      >
        {searchDate && (
          <div className="w-full">
            <Input
              className="w-full"
              type="date"
              name="date"
              value={data.date}
              onChange={onSearchChange}
              placeholder="Name of your project"
            />
          </div>
        )}
        {searchMonth && (
          <div className="w-full">
            <Input
              className="w-full"
              type="month"
              name="month"
              value={data.month}
              onChange={onSearchChange}
              placeholder="Name of your project"
            />
          </div>
        )}
        {searchKelompok && (
          <div className="w-full">
            <SelectComponent
              className="w-full"
              value={data.kelompok}
              options={optKelompok}
              name="kelompok"
              onChange={onSearchChange}
            />
          </div>
        )}
        {searchWilayah && (
          <div className="w-full">
            <SelectComponent
              className="w-full"
              value={data.wilayah}
              options={optWilayah}
              name="wilayah"
              onChange={onSearchChange}
            />
          </div>
        )}

        {searchHari && (
          <div className="w-full">
            <SelectComponent
              className="w-full"
              value={data.hari}
              options={dayOpt}
              name="hari"
              // placeholder="Hari"
              onChange={onSearchChange}
            />
          </div>
        )}

        {searchGroupingBranch && (
          <div className="flex items-center justify-center w-full gap-3">
            <div className="flex-1">
              <SelectComponent
                valuetype="number"
                value={selectedWilayah}
                options={optWilayah}
                name="wilayah"
                required="true"
                onChange={onWilayahChange}
              />
            </div>

            {selectedWilayah !== '' && (
              <div className="flex-1">
                <SelectComponent
                  value={data.branch_id}
                  options={filteredBranch}
                  name="branch_id"
                  required="true"
                  onChange={onSearchChange}
                />
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-end col-span-2 gap-3">
          <Button ref={submitBtnRef} variant="outline" type="submit">
            <MagnifyingGlassIcon className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Cari
            </span>
          </Button>
          <Button variant="outline" type="button" onClick={resetFilter}>
            <ResetIcon />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Reset
            </span>
          </Button>
          {children}
        </div>
      </form>
    </>
  );
};

export default SearchComponent;
