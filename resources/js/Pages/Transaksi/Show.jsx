import LinkButton from '@/Components/LinkButton';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import axios from 'axios';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import CurrencyInput from 'react-currency-input-field';
import NewCustomer from './Components/NewCustomer';
import OldCustomer from './Components/OldCustomer';
import useServerFilter from '@/Hooks/useServerFilter';
import { NumericFormat } from 'react-number-format';

const Show = ({ requesttoApprove, loanHistory, requestHistory, ...props }) => {
  // const { emps } = useServerFilter(null, null, null, props.mantri);
  const { progress } = usePage();
  const [loading, setLoading] = useState(false);

  const handleAction = (params) => {
    router.put(
      route('transaction.update', requesttoApprove.id),
      {
        action: params,
      },
      // { only: requesttoApprove },
      {
        onStart: () => setLoading(true),
        onFinish: () => setLoading(false),
      }
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
        <div className="flex items-center justify-end px-6 py-4">
          <LinkButton
            color="outline"
            as="a"
            href={props.back_to_index}
            title="Back"
          />
        </div>
        <div className="px-6 py-4 bg-white rounded-md shadow text-slate-700 ring-1 ring-slate-700 ring-opacity-5">
          <div>
            <div className="mb-3">
              <div className="mb-2 text-lg font-semibold">
                Pengajuan Pinjaman
              </div>
              <div className="p-4 mb-3 overflow-auto border rounded shadow border-black/5">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="sticky top-0 text-xs text-gray-900 uppercase bg-gray-200 whitespace-nowrap">
                    <tr>
                      <th className="px-3 py-2">Tanggal Pengajuan</th>
                      <th className="px-3 py-2">Nomor Pinjaman</th>
                      <th className="px-3 py-2">Nama Customer</th>
                      <th className="px-3 py-2">NIK</th>
                      <th className="px-3 py-2">Alamat</th>
                      <th className="px-3 py-2">Unit</th>
                      <th className="px-3 py-2">Kelompok</th>
                      <th className="px-3 py-2">Hari</th>
                      <th className="px-3 py-2">Drop</th>

                      <th className="px-3 py-2">Tanggal Drop</th>
                      <th className="px-3 py-2">Nama Mantri</th>
                      <th className="px-3 py-2">Pengajuan Ke</th>
                      <th className="px-3 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requesttoApprove ? (
                      <tr key={requesttoApprove.id}>
                        <td className="px-3 py-2">
                          {dayjs(requesttoApprove.tanggal_pengajuan).format(
                            'DD-MM-YYYY'
                          )}
                        </td>
                        <td className="px-3 py-2">{requesttoApprove.id}</td>
                        <td className="px-3 py-2">
                          {requesttoApprove.customer_name}
                        </td>
                        <td className="px-3 py-2">
                          {requesttoApprove.customer_nik}
                        </td>
                        <td className="px-3 py-2 max-w-36">
                          {requesttoApprove.customer_alamat}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {requesttoApprove.unit}
                        </td>
                        <td className="px-3 py-2">
                          {requesttoApprove.kelompok}
                        </td>
                        <td className="px-3 py-2">{requesttoApprove.hari}</td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <NumericFormat
                            value={requesttoApprove.drop}
                            displayType={'text'}
                            thousandSeparator={','}
                            prefix={'Rp. '}
                          />
                        </td>

                        <td className="px-3 py-2">
                          {dayjs(requesttoApprove.tanggal_drop).format(
                            'DD-MM-YYYY'
                          )}
                        </td>

                        <td className="px-3 py-2 whitespace-nowrap">
                          {requesttoApprove.mantri_name}
                        </td>
                        <td className="px-3 py-2">
                          {requesttoApprove.pengajuan_ke}
                        </td>
                        <td className="px-3 py-2">
                          {requesttoApprove.status == 'open' ? (
                            <div className="flex items-center justify-center gap-2">
                              <button
                                className="px-2 py-1 text-xs bg-green-200 rounded hover:bg-green-300"
                                type="button"
                                onClick={() => handleAction(1)}
                              >
                                Terima
                              </button>
                              <button
                                className="px-2 py-1 text-xs bg-red-200 rounded hover:bg-red-300"
                                type="button"
                                onClick={() => handleAction(2)}
                              >
                                Tolak
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-2">
                              {requesttoApprove.status == 'acc' ? (
                                <>
                                  <div className="text-green-600">Acc</div>

                                  {requesttoApprove.instalment == 0 && (
                                    <button
                                      className="px-2 py-1 text-xs bg-red-200 rounded hover:bg-red-300"
                                      type="button"
                                      onClick={() => handleAction(3)}
                                    >
                                      Batalkan
                                    </button>
                                  )}
                                </>
                              ) : requesttoApprove.status == 'tolak' ? (
                                <div>ditolak</div>
                              ) : (
                                ''
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    ) : (
                      <tr>
                        <td colSpan={3}>Data tidak ditemukan</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mb-3">
              <div className="mb-2 text-lg font-semibold">History Pinjaman</div>
              <div className="p-4 mb-3 overflow-auto border rounded shadow border-black/5">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="sticky top-0 text-xs text-gray-900 uppercase bg-gray-200 whitespace-nowrap">
                    <tr>
                      <th className="px-3 py-2">Nomor Pinjaman</th>
                      <th className="px-3 py-2">Tanggal Drop</th>

                      <th className="px-3 py-2">Hari</th>
                      <th className="px-3 py-2">Unit</th>
                      <th className="px-3 py-2">Kelompok</th>

                      <th className="px-3 py-2">Mantri</th>

                      <th className="px-3 py-2">Drop</th>

                      <th className="px-3 py-2">Pinjaman</th>
                      <th className="px-3 py-2">JML Angsuran</th>

                      <th className="px-3 py-2">Saldo</th>
                      <th className="px-3 py-2">Pinjaman Ke</th>
                      <th className="px-3 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loanHistory ? (
                      loanHistory.map((item, key) => (
                        <tr
                          key={item.key}
                          className="even:bg-gray-50 hover:bg-gray-200"
                        >
                          <td className="px-3 py-2">{item.id}</td>
                          <td className="px-3 py-2">
                            {dayjs(item.tanggal_pengajuan).format('DD-MM-YYYY')}
                          </td>

                          <td className="px-3 py-2">{item.hari}</td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            {item.unit}
                          </td>
                          <td className="px-3 py-2">{item.kelompok}</td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            {item.mantri_name}
                          </td>
                          <td className="px-3 py-2">
                            <NumericFormat
                              value={item.drop}
                              displayType={'text'}
                              thousandSeparator={','}
                              prefix={'Rp. '}
                            />
                          </td>
                          <td className="px-3 py-2">
                            <NumericFormat
                              value={item.pinjaman}
                              displayType={'text'}
                              thousandSeparator={','}
                              prefix={'Rp. '}
                            />
                          </td>

                          <td className="px-3 py-2 whitespace-nowrap">
                            {item.juml_pembayaran}
                          </td>

                          <td className="px-3 py-2 whitespace-nowrap">
                            <NumericFormat
                              value={item.saldo}
                              displayType={'text'}
                              thousandSeparator={','}
                              prefix={'Rp. '}
                            />
                          </td>

                          <td className="px-3 py-2 whitespace-nowrap">
                            {item.pinjaman_ke}
                          </td>

                          <td className="px-3 py-2">
                            <span
                              className={`px-2 py-1 rounded ${
                                item.status == 'normal' || item.status == 'cm'
                                  ? `bg-green-200`
                                  : item.status == 'mb'
                                  ? 'bg-yellow-200'
                                  : item.status == 'ml'
                                  ? 'bg-red-200'
                                  : ''
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3}>Data tidak ditemukan</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mb-3">
              <div className="mb-2 text-lg font-semibold">
                History Pengajuan Sebelumnya
              </div>
              <div className="p-4 mb-3 overflow-auto border rounded shadow border-black/5">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="sticky top-0 text-xs text-gray-900 uppercase bg-gray-200 whitespace-nowrap">
                    <tr>
                      <th className="px-3 py-2">Nomor Pinjaman</th>
                      <th className="px-3 py-2">Tanggal Drop</th>

                      <th className="px-3 py-2">Hari</th>
                      <th className="px-3 py-2">Unit</th>
                      <th className="px-3 py-2">Kelompok</th>

                      <th className="px-3 py-2">Mantri</th>

                      <th className="px-3 py-2">Drop</th>

                      <th className="px-3 py-2">Pinjaman Ke</th>
                      <th className="px-3 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requestHistory ? (
                      requestHistory.map((item, key) => (
                        <tr
                          key={item.key}
                          className="even:bg-gray-50 hover:bg-gray-200"
                        >
                          <td className="px-3 py-2">{item.id}</td>
                          <td className="px-3 py-2">
                            {dayjs(item.tanggal_pengajuan).format('DD-MM-YYYY')}
                          </td>

                          <td className="px-3 py-2">{item.hari}</td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            {item.unit}
                          </td>
                          <td className="px-3 py-2">{item.kelompok}</td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            {item.mantri_name}
                          </td>
                          <td className="px-3 py-2">
                            <NumericFormat
                              value={item.drop}
                              displayType={'text'}
                              thousandSeparator={','}
                              prefix={'Rp. '}
                            />
                          </td>

                          <td className="px-3 py-2 whitespace-nowrap">
                            {item.pengajuan_ke}
                          </td>

                          <td className={`px-3 py-2`}>
                            <span
                              className={`px-2 py-1 rounded ${
                                item.status == 'acc'
                                  ? `bg-green-200`
                                  : item.status == 'tolak'
                                  ? 'bg-red-200'
                                  : ''
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3}>Data tidak ditemukan</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Authenticated>
  );
};

export default Show;
// nama: "",
// nik: "",
// no_kk: "",
// alamat: "",
// mantri: "",
