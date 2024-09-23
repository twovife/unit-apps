import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shadcn/ui/table';
import FormatNumbering from '@/Components/shadcn/FormatNumbering';
import dayjs from 'dayjs';
import { Button } from '@/shadcn/ui/button';
import Action from './Action';
import { Badge } from '@/shadcn/ui/badge';

const BukuStorting = ({ dateOfWeek, datas, sirkulasi }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (datas) {
      const mapingStortingData = datas.map((item, index) => {
        const resutl = () => {
          const instalmentsSum = {};

          const sirkulasiBefore = (item) => {
            switch (item.type) {
              case 'ml':
                return sirkulasi.ml_amount;
                break;
              case 'mb':
                return sirkulasi.mb_amount;
                break;
              case 'cm':
                return sirkulasi.cm_amount;
                break;
              default:
                return item.data.reduce(
                  (acc, item) => acc + item.saldo_sebelumnya,
                  0
                );
            }
          };

          const pinjamanSum = sirkulasiBefore(item);

          dateOfWeek.forEach((date) => {
            instalmentsSum[date] = 0;
          });

          let totalInstalment = 0;

          item.data.forEach((data) => {
            dateOfWeek.forEach((date) => {
              if (data.instalment[date] !== undefined) {
                totalInstalment += data.instalment[date];

                instalmentsSum[date] += data.instalment[date];
              }
            });
          });

          return {
            key: item.month,
            instalment: { ...instalmentsSum },
            sirkulasi: pinjamanSum,
            totalInstalment: totalInstalment,
            sirkulasiAfter: pinjamanSum - totalInstalment,
          };
        };
        return resutl();
      });

      setData(mapingStortingData);
    }
  }, [datas]);

  // console.log(data);

  const calculateInstalment = (data, keyToSum) => {
    const result = data.reduce(
      (acc, item) => acc + parseInt(item.instalment[keyToSum] ?? 0),
      0
    );

    return result;
  };

  const calculateTotals = (data, keyToSum) => {
    const result = data.reduce(
      (acc, item) => acc + parseInt(item[keyToSum] ?? 0),
      0
    );
    return result;
  };

  const [triggeredId, setTriggeredId] = useState(null);
  const [show, setShow] = useState(false);
  const onCreateShowOpen = (id) => {
    setTriggeredId(id);
    setShow(true);
  };

  const onClosedShowOpen = () => {
    setShow(false);
    setTriggeredId(null);
  };

  return (
    <div className="relative overflow-auto h-[60vh] lg:h-[85vh] scrollbar-thin">
      <Table className="text-xs rounded-lg">
        <TableHeader className="sticky top-0 left-0 z-10">
          <TableRow className="bg-gray-200">
            <TableHead className="text-center">Bulan</TableHead>
            <TableHead className="text-center">Sirkulasi</TableHead>
            {dateOfWeek.map((day, i) => (
              <TableHead className="text-center" key={i}>
                {dayjs(day).format('DD-MM-YY')}
              </TableHead>
            ))}
            <TableHead className="text-center">Angsuran</TableHead>
            <TableHead className="text-center">Saldo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data ? (
            data.map((row, i) => (
              <React.Fragment key={i}>
                <TableRow>
                  <TableCell>{row.key}</TableCell>
                  <TableCell>
                    <FormatNumbering value={row.sirkulasi} />
                  </TableCell>

                  {dateOfWeek.map((day, i) => (
                    <TableCell className="text-center" key={i}>
                      <FormatNumbering value={row.instalment[day]} />
                    </TableCell>
                  ))}
                  <TableCell>
                    <FormatNumbering value={row.totalInstalment} />
                  </TableCell>
                  <TableCell>
                    <FormatNumbering value={row.sirkulasiAfter} />
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))
          ) : (
            <TableRow>
              <TableCell>a</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Action
        datas={data}
        show={show}
        onClosed={onClosedShowOpen}
        triggeredId={triggeredId}
      />
    </div>
  );
};

export default BukuStorting;
