import PrimaryButton from '@/Components/PrimaryButton';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { NumericFormat } from 'react-number-format';
import {
  AiFillCheckCircle,
  AiFillEdit,
  AiFillFilter,
  AiOutlineClose,
  AiOutlineSortAscending,
  AiOutlineSortDescending,
  AiTwotoneEdit,
} from 'react-icons/ai';
import TextInput from '@/Components/TextInput';
import SelectList from '@/Components/SelectList';
import useServerFilter from '@/Hooks/useServerFilter';
import useFilterTable from '@/Hooks/useFilterTable';
import LinkButton from '@/Components/LinkButton';
import { BiEditAlt } from 'react-icons/bi';

const Index = ({ loans, server_filters, dateOfWeek, ...props }) => {
  const {
    transaction_date,
    transaction_day,
    serverFilters,
    onServerFilterChange,
    onServerFilterSubmit,
    loading,
    setLoading,
    mantriMantri,
  } = useServerFilter(route().current(), server_filters);

  const itemsPerPage = 1000;
  const {
    filters,
    setFilters,
    orderData,
    setOrderData,
    currentPage,
    setCurrentPage,
    displayData,
    totalPages,
    handlePageChange,
    totals,
  } = useFilterTable({}, itemsPerPage, loans);

  const [showFilter, setShowFilter] = useState('');
  const [addFilter, setAddFilter] = useState({
    column: '',
    operators: '1',
    values: '',
  });

  const thisonclick = (column, format = 'text') => {
    setShowFilter({ column, format });
  };

  useEffect(() => {
    const storedFilter = JSON.parse(
      localStorage.getItem('internal_storage_buku_transaksi')
    );
    if (storedFilter && Object.keys(storedFilter).length > 0) {
      setFilters(storedFilter);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      'internal_storage_buku_transaksi',
      JSON.stringify(filters)
    );
  }, [filters]);

  useEffect(() => {
    const log = (e) => {
      if (e.target.className.includes('filter_trigger')) {
        thisonclick(
          e.target.getAttribute('data-item'),
          e.target.getAttribute('data-format')
        );
        setAddFilter({
          ...addFilter,
          ['column']: e.target.getAttribute('data-item'),
        });
      } else {
        thisonclick('');
      }
    };
    window.addEventListener('click', log);
    return () => {
      window.removeEventListener('click', log);
    };
  });

  const onSubmitFilter = () => {
    const updatedFilters = [...filters];

    // Cari indeks filter yang memiliki column yang sama dengan addFilter.column
    const indexToUpdate = updatedFilters.findIndex(
      (filter) => filter.column === addFilter.column
    );

    // Jika ada filter dengan column yang sama, gantikan filter tersebut
    if (indexToUpdate !== -1) {
      updatedFilters[indexToUpdate] = addFilter;
    } else {
      // Jika tidak ada filter dengan column yang sama, tambahkan filter baru
      updatedFilters.push(addFilter);
    }

    setFilters(updatedFilters);
  };

  const decrementFilter = (column) => {
    // Buat salinan dari daftar filter
    const updatedFilters = [...filters];
    // Cari indeks filter dengan column yang sesuai
    const decrementFilters = filters.filter(
      (filter) => filter.column !== column
    );
    setFilters(decrementFilters);
  };

  const handleInputFilter = (e) => {
    const { name, value, type } = e.target;
    let convertedValue = value;

    if (type === 'number') {
      convertedValue = parseInt(value);
    }

    setAddFilter({
      ...addFilter,
      [name]: convertedValue,
    });
  };

  const filterModal = () => {
    return (
      <div
        className="fixed text-white -translate-x-1/2 top-1/2 left-1/2 lg:w-1/3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full max-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="flex flex-wrap items-center justify-end gap-3 px-2 py-4 text-2xl">
            <div className="flex flex-col-reverse flex-1">
              <input
                name="column"
                readOnly
                value={addFilter.column}
                onChange={(e) =>
                  setAddFilter({
                    ...addFilter,
                    column: e.target.value,
                  })
                }
                className="read-only:bg-gray-200 read-only:cursor-not-allowed border-0 border-b border-b-gray-400 text-black font-light text-sm px-1.5 py-1.5 focus:bg-gray-100 focus:outline-none focus:border-b-2 focus:border-b-blue-500 peer/column"
              />
              <label className="text-xs font-semibold text-gray-400 peer-focus/column:text-blue-500">
                Kolom
              </label>
            </div>
            <div className="flex flex-col-reverse flex-1">
              <select
                name="operators"
                value={addFilter.operators}
                onChange={(e) =>
                  setAddFilter({
                    ...addFilter,
                    operators: e.target.value,
                  })
                }
                className="border-0 border-b border-b-gray-400 text-black font-light text-sm px-1.5 py-1.5 focus:outline-none focus:border-b-2 focus:border-b-blue-500 focus:ring-0 peer/operator"
              >
                <option value="1">contains</option>
                <option value="2">equal</option>
              </select>
              <label className="text-xs font-semibold text-gray-400 peer-focus/operator:text-blue-500">
                Operator
              </label>
            </div>
            <div className="flex flex-col-reverse flex-1">
              <input
                value={addFilter.values}
                type={
                  showFilter.format == 'number'
                    ? 'number'
                    : showFilter.format == 'date'
                    ? 'date'
                    : showFilter.format == 'currency'
                    ? 'number'
                    : 'text'
                }
                onChange={handleInputFilter}
                name="values"
                className="border-0 border-b border-b-gray-400 text-black font-light text-sm px-1.5 py-1.5 focus:bg-gray-100 focus:outline-none focus:border-b-2 focus:border-b-blue-500 peer/value"
              />
              <label className="text-xs font-semibold text-gray-400 peer-focus/value:text-blue-500">
                Kata Kunci
              </label>
            </div>
            <div className="flex items-center justify-center flex-1">
              <button
                onClick={onSubmitFilter}
                className="p-2 text-xs text-black border rounded-lg border-main-500 hover:bg-main-500 hover:text-white focus:bg-main-500 focus:text-white"
              >
                Go
              </button>
              <button
                onClick={() =>
                  setOrderData({
                    column: showFilter.column,
                    orderby: 'asc',
                  })
                }
                className="p-1 ml-3 text-black border rounded-lg border-main-500 hover:bg-main-500 hover:text-white focus:bg-main-500 focus:text-white"
              >
                <AiOutlineSortAscending />
              </button>
              <button
                onClick={() =>
                  setOrderData({
                    column: showFilter.column,
                    orderby: 'desc',
                  })
                }
                className="p-1 ml-1 text-black border rounded-lg border-main-500 hover:bg-main-500 hover:text-white focus:bg-main-500 focus:text-white"
              >
                <AiOutlineSortDescending />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Authenticated
      auth={props.auth}
      errors={props.errors}
      header="Buku Transaksi"
      loading={loading}
    >
      <Head title="Buku Transaksi" />

      <div className="relative">
        <div className="flex flex-wrap items-center justify-end gap-3 px-6 py-4">
          <div>
            <TextInput
              option={transaction_date}
              type="month"
              className="block w-full text-sm"
              id="transaction_date"
              name="transaction_date"
              value={serverFilters.transaction_date}
              onChange={onServerFilterChange}
            />
          </div>
          <div>
            <SelectList
              options={transaction_day}
              type="date"
              className="block w-32 text-sm"
              id="transaction_day"
              name="transaction_day"
              value={serverFilters.transaction_day}
              onChange={onServerFilterChange}
            />
          </div>
          <div>
            <SelectList
              options={mantriMantri}
              type="date"
              className="block w-32 text-sm"
              id="mantri"
              name="mantri"
              value={serverFilters.mantri}
              onChange={onServerFilterChange}
            />
          </div>
          <PrimaryButton
            color="yellow"
            title="Cari"
            onClick={onServerFilterSubmit}
          />
        </div>
        {filters && (
          <div className="inline-block space-y-1">
            {filters.map((item) => {
              if (item.column == '') {
                return null;
              }
              return (
                <div className="flex items-center justify-start space-y-2">
                  <div className="flex items-center overflow-hidden border rounded-md">
                    <div className="p-2 text-lg text-white bg-green-400">
                      <AiFillFilter />
                    </div>
                    <div className="px-3 text-sm text-main-500">
                      <span className="mr-1 capitalize ">{item.column}</span>
                      <span className="mr-1 capitalize ">
                        {item.operators == 1 ? 'Contains' : '='}
                      </span>
                      <span>'{item.values}'</span>
                    </div>
                  </div>
                  <div
                    className="p-1 ml-2 rounded hover:border hover:bg-gray-300 hover:cursor-pointer"
                    onClick={() => decrementFilter(item.column)}
                  >
                    <AiOutlineClose />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="px-6 py-4 bg-white rounded-md shadow text-slate-700 ring-1 ring-slate-700 ring-opacity-5">
          <div className="text-lg font-semibold">Daftar Transaksi</div>
          <div className="max-h-screen mx-auto mb-6 rounded shadow ring-1 ring-black ring-opacity-5">
            <div className="overflow-auto max-h-[70vh]">
              <table className="relative w-full text-xs text-left text-gray-500">
                <thead className="sticky top-0 z-50 text-gray-900 uppercase whitespace-nowrap">
                  <tr className="text-center bg-gray-200">
                    <th className="top-0 left-0 z-40 bg-gray-200 lg:sticky">
                      <div className="flex items-start justify-start gap-1 w-96">
                        <div
                          data-item="nomor_pinjaman"
                          data-format={'text'}
                          className="flex-1 px-4 py-3 text-center hover:bg-sky-300 hover:cursor-pointer filter_trigger"
                        >
                          Nomor
                          {orderData.column == 'nomor_pinjaman' && (
                            <span className="ml-1 italic text-blue-400">
                              {orderData.orderby}
                            </span>
                          )}
                          {showFilter.column == 'nomor_pinjaman' &&
                            filterModal()}
                        </div>
                        <div
                          data-item="nama_customer"
                          data-format={'text'}
                          className="flex-[2] hover:bg-sky-300 hover:cursor-pointer px-4 py-3 filter_trigger text-center"
                        >
                          Nama Nasabah
                          {orderData.column == 'nama_customer' && (
                            <span className="ml-1 italic text-blue-400">
                              {orderData.orderby}
                            </span>
                          )}
                          {showFilter.column == 'nama_customer' &&
                            filterModal()}
                        </div>
                      </div>
                    </th>
                    <th className="relative z-30">
                      <div className="flex items-start justify-evenly">
                        <div
                          data-item="nik_customer"
                          data-format={'text'}
                          className="flex-1 px-4 py-3 hover:bg-sky-300 hover:cursor-pointer filter_trigger"
                        >
                          Nik
                          {orderData.column == 'nik_customer' && (
                            <span className="ml-1 italic text-blue-400">
                              {orderData.orderby}
                            </span>
                          )}
                          {showFilter.column == 'nik_customer' && filterModal()}
                        </div>
                      </div>
                    </th>
                    <th className="relative z-30">
                      <div className="flex items-start justify-evenly">
                        <div
                          data-item="alamat_customer"
                          data-format={'text'}
                          className="flex-1 px-4 py-3 hover:bg-sky-300 hover:cursor-pointer filter_trigger"
                        >
                          Note
                        </div>
                      </div>
                    </th>
                    <th className="relative z-30">
                      <div className="flex items-start justify-evenly">
                        <div
                          data-item="alamat_customer"
                          data-format={'text'}
                          className="flex-1 px-4 py-3 hover:bg-sky-300 hover:cursor-pointer filter_trigger"
                        >
                          Alamat
                          {orderData.column == 'alamat_customer' && (
                            <span className="ml-1 italic text-blue-400">
                              {orderData.orderby}
                            </span>
                          )}
                          {showFilter.column == 'alamat_customer' &&
                            filterModal()}
                        </div>
                      </div>
                    </th>
                    <th className="relative z-30">
                      <div className="flex items-start justify-evenly">
                        <div
                          data-item="kelompok"
                          data-format={'text'}
                          className="flex-1 px-4 py-3 hover:bg-sky-300 hover:cursor-pointer filter_trigger"
                        >
                          Kelompok
                          {orderData.column == 'kelompok' && (
                            <span className="ml-1 italic text-blue-400">
                              {orderData.orderby}
                            </span>
                          )}
                          {showFilter.column == 'kelompok' && filterModal()}
                        </div>
                      </div>
                    </th>
                    <th className="relative z-30">
                      <div className="flex items-start justify-evenly">
                        <div
                          data-item="hari"
                          data-format={'text'}
                          className="flex-1 px-4 py-3 hover:bg-sky-300 hover:cursor-pointer filter_trigger"
                        >
                          Hari
                          {orderData.column == 'hari' && (
                            <span className="ml-1 italic text-blue-400">
                              {orderData.orderby}
                            </span>
                          )}
                          {showFilter.column == 'hari' && filterModal()}
                        </div>
                      </div>
                    </th>
                    <th className="relative z-30">
                      <div className="flex items-start justify-evenly">
                        <div
                          data-item="tanggal_drop"
                          data-format={'date'}
                          className="flex-1 px-4 py-3 hover:bg-sky-300 hover:cursor-pointer filter_trigger"
                        >
                          Tanggal Drop
                          {orderData.column == 'tanggal_drop' && (
                            <span className="ml-1 italic text-blue-400">
                              {orderData.orderby}
                            </span>
                          )}
                          {showFilter.column == 'tanggal_drop' && filterModal()}
                        </div>
                      </div>
                    </th>
                    <th className="relative z-30">
                      <div className="flex items-start justify-evenly">
                        <div
                          data-item="pinjaman_ke"
                          data-format={'text'}
                          className="flex-1 px-4 py-3"
                        >
                          Pnj Ke
                          {orderData.column == 'pinjaman_ke' && (
                            <span className="ml-1 italic text-blue-400">
                              {orderData.orderby}
                            </span>
                          )}
                          {showFilter.column == 'pinjaman_ke' && filterModal()}
                        </div>
                      </div>
                    </th>
                    <th className="relative z-30">
                      <div className="flex items-start justify-evenly">
                        <div
                          data-item="jumlah_angsuran"
                          data-format={'text'}
                          className="flex-1 px-4 py-3"
                        >
                          jml Angsuran
                          {orderData.column == 'jumlah_angsuran' && (
                            <span className="ml-1 italic text-blue-400">
                              {orderData.orderby}
                            </span>
                          )}
                          {showFilter.column == 'jumlah_angsuran' &&
                            filterModal()}
                        </div>
                      </div>
                    </th>
                    <th className="relative z-30">
                      <div className="flex items-start justify-evenly">
                        <div
                          data-item="pinjaman"
                          data-format={'text'}
                          className="flex-1 px-4 py-3"
                        >
                          Pinjaman
                          {orderData.column == 'pinjaman' && (
                            <span className="ml-1 italic text-blue-400">
                              {orderData.orderby}
                            </span>
                          )}
                          {showFilter.column == 'pinjaman' && filterModal()}
                        </div>
                      </div>
                    </th>
                    <th className="relative z-30">
                      <div className="flex items-start justify-evenly">
                        <div
                          data-item="total_angsuran_bulan_lalu"
                          data-format={'text'}
                          className="flex-1 px-4 py-3"
                        >
                          Angs Bln Sebelumnya
                          {orderData.column == 'total_angsuran_bulan_lalu' && (
                            <span className="ml-1 italic text-blue-400">
                              {orderData.orderby}
                            </span>
                          )}
                          {showFilter.column == 'total_angsuran_bulan_lalu' &&
                            filterModal()}
                        </div>
                      </div>
                    </th>
                    <th className="relative z-30">
                      <div className="flex items-start justify-evenly">
                        <div
                          data-item="total_angsuran_bulan_ini"
                          data-format={'text'}
                          className="flex-1 px-4 py-3"
                        >
                          Saldo Sebelumnya
                          {orderData.column == 'total_angsuran_bulan_ini' && (
                            <span className="ml-1 italic text-blue-400">
                              {orderData.orderby}
                            </span>
                          )}
                          {showFilter.column == 'total_angsuran_bulan_ini' &&
                            filterModal()}
                        </div>
                      </div>
                    </th>
                    {dateOfWeek &&
                      dateOfWeek.map((item, key) => (
                        <th key={key}>
                          <div className="flex items-start justify-evenly">
                            <div className="flex-1 px-4 py-3">
                              {dayjs(item).format('DD-MM-YY')}
                            </div>
                          </div>
                        </th>
                      ))}
                    <th className="relative z-30">
                      <div className="flex items-start justify-evenly">
                        <div
                          data-item="total_angsuran_bulan_ini"
                          data-format={'text'}
                          className="flex-1 px-4 py-3"
                        >
                          Angsuran
                          {orderData.column == 'total_angsuran_bulan_ini' && (
                            <span className="ml-1 italic text-blue-400">
                              {orderData.orderby}
                            </span>
                          )}
                          {showFilter.column == 'total_angsuran_bulan_ini' &&
                            filterModal()}
                        </div>
                      </div>
                    </th>
                    <th className="relative z-30">
                      <div className="flex items-start justify-evenly">
                        <div
                          data-item="saldo_bulan_ini"
                          data-format={'text'}
                          className="flex-1 px-4 py-3"
                        >
                          Saldo
                          {orderData.column == 'saldo_bulan_ini' && (
                            <span className="ml-1 italic text-blue-400">
                              {orderData.orderby}
                            </span>
                          )}
                          {showFilter.column == 'saldo_bulan_ini' &&
                            filterModal()}
                        </div>
                      </div>
                    </th>
                    <th className="relative z-30">
                      <div className="flex items-start justify-evenly">
                        <div
                          data-item="status"
                          data-format={'text'}
                          className="flex-1 px-4 py-3 hover:bg-sky-300 hover:cursor-pointer filter_trigger"
                        >
                          Status
                          {orderData.column == 'status' && (
                            <span className="ml-1 italic text-blue-400">
                              {orderData.orderby}
                            </span>
                          )}
                          {showFilter.column == 'status' && filterModal()}
                        </div>
                      </div>
                    </th>
                    <th className="relative z-30">
                      <div className="flex items-start justify-evenly">
                        <div
                          data-item="lunas"
                          data-format={'text'}
                          className="flex-1 px-4 py-3 hover:bg-sky-300 hover:cursor-pointer filter_trigger"
                        >
                          Lunas
                          {orderData.column == 'lunas' && (
                            <span className="ml-1 italic text-blue-400">
                              {orderData.orderby}
                            </span>
                          )}
                          {showFilter.column == 'lunas' && filterModal()}
                        </div>
                      </div>
                    </th>
                    <th className="relative z-30">
                      <div className="flex items-start justify-evenly">
                        <div
                          data-item="jenis_nasabah"
                          data-format={'text'}
                          className="flex-1 px-4 py-3 hover:bg-sky-300 hover:cursor-pointer filter_trigger"
                        >
                          Jenis Nasabah
                          {orderData.column == 'jenis_nasabah' && (
                            <span className="ml-1 italic text-blue-400">
                              {orderData.orderby}
                            </span>
                          )}
                          {showFilter.column == 'jenis_nasabah' &&
                            filterModal()}
                        </div>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {displayData &&
                    displayData.map((item, key) => (
                      <tr key={key} className="bg-white even:bg-blue-50">
                        <td className="top-0 left-0 z-40 lg:sticky bg-inherit">
                          <div className="flex items-start justify-start gap-1">
                            <div className="flex items-center justify-between flex-1 w-full px-4 py-1">
                              <div>
                                <span>{key + 1}</span>
                                <span> | </span>
                                <span>{item.nomor_pinjaman}</span>
                              </div>
                              <Link
                                href={route('pinjaman.normal.show', item.id)}
                                className="p-1 text-sm font-semibold text-white bg-blue-400 rounded"
                              >
                                <BiEditAlt />
                              </Link>
                            </div>
                            <div className="flex-[2] py-1 px-4 text-start lg:whitespace-nowrap">
                              {item.nama_customer}
                            </div>
                          </div>
                        </td>
                        <td className="relative z-30">
                          <div className="flex items-start justify-evenly w-36">
                            <div className="flex-1 px-4 py-1">
                              {item.nik_customer}
                            </div>
                          </div>
                        </td>
                        <td className="relative z-30">
                          <div className="flex items-start justify-evenly w-36">
                            <div className="flex-1 px-4 py-1">
                              {item.lunas == 'lunas' ? (
                                <span className="px-2 py-1 mr-1 text-xs text-white bg-green-400 border rounded">
                                  Lunas
                                </span>
                              ) : (
                                ''
                              )}
                              {item.status == 'normal' ? (
                                <span className="px-2 py-1 mr-1 text-xs border rounded">
                                  {item.status}
                                </span>
                              ) : item.status == 'cm' ? (
                                <span className="px-2 py-1 mr-1 text-xs text-white bg-yellow-400 border rounded">
                                  {item.status}
                                </span>
                              ) : item.status == 'mb' ? (
                                <span className="px-2 py-1 mr-1 text-xs text-white bg-red-400 border rounded">
                                  {item.status}
                                </span>
                              ) : item.status == 'ml' ? (
                                <span className="px-2 py-1 mr-1 text-xs text-white bg-black border rounded">
                                  {item.status}
                                </span>
                              ) : (
                                <div>{item.status}</div>
                              )}

                              {/* className=
                                                            {`bg-white border-b hover:bg-blue-50 text-xs ${

                                                                "lunas"
                                                                    ? `bg-green-100 hover:bg-green-50 even:bg-emerald-50`
                                                                    : item.lunas ==
                                                                      "tolak"
                                                                    ? `bg-red-100 hover:bg-red-50 even:bg-rose-50`
                                                                    : `bg-white hover:bg-blue-50 even:bg-gray-50`
                                                            }`} */}
                            </div>
                          </div>
                        </td>
                        <td className="relative z-30">
                          <div className="flex items-start justify-evenly w-36">
                            <div className="flex-1 px-4 py-1">
                              {item.alamat_customer}
                            </div>
                          </div>
                        </td>
                        <td className="relative z-30">
                          <div className="flex items-start justify-evenly">
                            <div className="flex-1 px-4 py-1">
                              {item.kelompok}
                            </div>
                          </div>
                        </td>
                        <td className="relative z-30">
                          <div className="flex items-start justify-evenly">
                            <div className="flex-1 px-4 py-1">{item.hari}</div>
                          </div>
                        </td>
                        <td className="relative z-30">
                          <div className="flex items-start justify-evenly">
                            <div className="flex-1 px-4 py-1">
                              {dayjs(item.tanggal_drop).format('DD-MM-YYYY')}
                            </div>
                          </div>
                        </td>
                        <td className="relative z-30">
                          <div className="flex items-start justify-evenly">
                            <div className="flex-1 px-4 py-1">
                              {item.pinjaman_ke}
                            </div>
                          </div>
                        </td>
                        <td className="relative z-30">
                          <div className="flex items-start justify-evenly">
                            <div className="flex-1 px-4 py-1">
                              {item.jumlah_angsuran}
                            </div>
                          </div>
                        </td>
                        <td className="relative z-30">
                          <div className="flex items-start justify-evenly whitespace-nowrap text-end">
                            <div className="flex-1 px-4 py-1">
                              <NumericFormat
                                value={item.pinjaman}
                                displayType={'text'}
                                thousandSeparator={','}
                                prefix={'Rp. '}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="relative z-30">
                          <div className="flex items-start justify-evenly whitespace-nowrap text-end">
                            <div className="flex-1 px-4 py-1">
                              <NumericFormat
                                value={item.total_angsuran_bulan_lalu}
                                displayType={'text'}
                                thousandSeparator={','}
                                prefix={'Rp. '}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="relative z-30">
                          <div className="flex items-start justify-evenly whitespace-nowrap text-end">
                            <div className="flex-1 px-4 py-1">
                              <NumericFormat
                                value={item.saldo_bulan_lalu}
                                displayType={'text'}
                                thousandSeparator={','}
                                prefix={'Rp. '}
                              />
                            </div>
                          </div>
                        </td>
                        {dateOfWeek &&
                          dateOfWeek.map((dateweek, key) => (
                            <td key={key} className="relative z-30">
                              <div className="flex items-start justify-evenly whitespace-nowrap text-end">
                                <div className="flex-1 px-4 py-1">
                                  {(() => {
                                    const results = item.angsuran.find(
                                      (angs) => angs.pembayaran_date == dateweek
                                    );

                                    return (
                                      <NumericFormat
                                        value={results?.jumlah}
                                        displayType={'text'}
                                        thousandSeparator={','}
                                        prefix={'Rp. '}
                                      />
                                    );
                                  })()}
                                </div>
                              </div>
                            </td>
                          ))}
                        <td className="relative z-30">
                          <div className="flex items-start justify-evenly whitespace-nowrap text-end">
                            <div className="flex-1 px-4 py-1">
                              <NumericFormat
                                value={item.total_angsuran_bulan_ini}
                                displayType={'text'}
                                thousandSeparator={','}
                                prefix={'Rp. '}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="relative z-30">
                          <div className="flex items-start justify-evenly whitespace-nowrap text-end">
                            <div className="flex-1 px-4 py-1">
                              <NumericFormat
                                value={item.saldo_bulan_ini}
                                displayType={'text'}
                                thousandSeparator={','}
                                prefix={'Rp. '}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="relative z-30">
                          <div className="flex items-start justify-evenly">
                            <div className="flex-1 px-4 py-1">
                              {item.status}
                            </div>
                          </div>
                        </td>
                        <td className="relative z-30">
                          <div className="flex items-start justify-evenly">
                            <div className="flex-1 px-4 py-1">{item.lunas}</div>
                          </div>
                        </td>
                        <td className="relative z-30">
                          <div className="flex items-start justify-evenly">
                            <div className="flex-1 px-4 py-1">
                              {item.loan_notes}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
                {/* {tbodyGenerator()} */}
              </table>
            </div>
          </div>
        </div>
      </div>
    </Authenticated>
  );
};

export default Index;
