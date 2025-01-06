import React, { useEffect, useMemo, useState } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shadcn/ui/card';

import FormatNumbering from '@/Components/shadcn/FormatNumbering';
import dayjs from 'dayjs';
import BargeStatus from '@/Components/shadcn/BargeStatus';
import BadgeStatus from '@/Components/shadcn/BadgeStatus';
import Action from './Action';
import { ScrollArea } from '@/shadcn/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Separator } from '@/shadcn/ui/separator';

const BukuTransaksiKepala = ({ datas }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(datas);
  }, [datas]);

  const calculateTotals = (data) => {
    return data.reduce(
      (acc, item) => {
        acc.request += item.request || 0;
        acc.drop += item.drop || 0;
        acc.drop_jadi += item.drop_jadi || 0;
        acc.acc += item.acc || 0;

        return acc;
      },
      {
        request: 0,
        drop: 0,
        acc: 0,
        drop_jadi: 0,
      }
    );
  };

  const totals = calculateTotals(data);

  // Declare a state variable to track the visibility of the "onCreateShow" component
  const [onCreateShow, setOnCreateShow] = useState(false);
  const [actionData, setActionData] = useState();

  // Event handler function to set the "onCreateShow" state variable to true
  const handleOnCreateShowOpen = (e) => {
    setOnCreateShow(true);
    setActionData(e);
  };

  // Event handler function to set the "onCreateShow" state variable to false
  const handleOnCreateShowClosed = (e) => {
    setOnCreateShow(false);
    setActionData();
  };

  return (
    <>
      <Action
        show={onCreateShow}
        onClosed={handleOnCreateShowClosed}
        triggeredData={actionData}
      />

      <div className="flex flex-col gap-2">
        <div className="p-3 py-1 text-lg font-semibold text-gray-800 bg-muted">
          {dayjs(data[0]?.tanggal_drop).format('DD-MM-YYYY')}
        </div>
        {data &&
          data.map((item, key) => (
            <Card
              key={item.key}
              className="overflow-hidden text-xs transition-all group"
            >
              <CardHeader
                className={`p-3 pl-1 shadow ${
                  item.drop_langsung == 'lama'
                    ? 'border-l-8 border-l-gray-600'
                    : 'border-l-8 border-l-green-400'
                }`}
              >
                <CardTitle>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="mr-3 text-base">{item.nama}</span>
                      <BadgeStatus value={item.drop_langsung} />
                    </div>
                    <BargeStatus
                      value={item.status}
                      onClick={() => handleOnCreateShowOpen(item)}
                    />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent
                className={`p-3 pl-1 text-sm shadow ${
                  item.drop_langsung == 'lama'
                    ? 'border-l-8 border-l-gray-600'
                    : 'border-l-8 border-l-green-400'
                }`}
              >
                <div className="font-semibold ">{item.nik}</div>
                <div className="break-words">{item.alamat}</div>
              </CardContent>
              <CardFooter
                className={`p-3 ${
                  item.drop_langsung == 'lama'
                    ? 'border-l-8 border-l-gray-600'
                    : 'border-l-8 border-l-green-400'
                }`}
              >
                <div className="flex w-full text-xs font-semibold text-center ">
                  <div className="flex-1 border-r-2 border-red-300">
                    <div>Pengajuan</div>
                    <div>
                      <FormatNumbering
                        className="text-center"
                        value={item.request}
                      />
                    </div>
                  </div>
                  <div className="flex-1 border-r-2 border-red-300">
                    <div>Acc</div>
                    <FormatNumbering className="text-center" value={item.acc} />
                  </div>
                  <div className="flex-1">
                    <div>Drop Jadi</div>
                    <FormatNumbering
                      className="text-center"
                      value={item.drop_jadi}
                    />
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        <div className="p-3 overflow-hidden text-sm border-l-8 rounded-lg shadow">
          <div className="flex w-full font-semibold text-center ">
            <div className="flex-1 border-r-2 border-red-300">
              <div>Pengajuan</div>
              <div>
                <FormatNumbering
                  className="text-center"
                  value={totals.request}
                />
              </div>
            </div>
            <div className="flex-1 border-r-2 border-red-300">
              <div>Acc</div>
              <FormatNumbering className="text-center" value={totals.acc} />
            </div>
            <div className="flex-1">
              <div>Drop Jadi</div>
              <FormatNumbering
                className="text-center"
                value={totals.drop_jadi}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BukuTransaksiKepala;
