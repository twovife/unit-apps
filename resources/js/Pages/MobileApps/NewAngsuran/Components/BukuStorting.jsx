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
import ApprovalAkhir from './ApprovalAkhir';

const BukuStorting = ({ dateOfWeek, datas, sirkulasi }) => {
  const [data, setData] = useState([]);
  const [saldoSirkulas, setSaldoSirkulas] = useState(0);
  const [sirkulasiAkhir, setSirkulasiAkhir] = useState({
    ml: {
      sirkulasi: 0,
      angsuran: 0,
      saldo: 0,
    },
    mb: {
      sirkulasi: 0,
      angsuran: 0,
      saldo: 0,
    },
    ccm: {
      sirkulasi: 0,
      angsuran: 0,
      saldo: 0,
    },
    cm: {
      sirkulasi: 0,
      angsuran: 0,
      saldo: 0,
    },
    all: {
      surkulasi: 0,
      angsuran: 0,
      saldo: 0,
    },
  });

  useEffect(() => {
    if (datas) {
      const mapingStortingData = datas.map((item, index) => {
        const resutl = () => {
          const instalmentsSum = {};
          const getMaxMinDateObjects = (data) => {
            if (Array.isArray(data)) {
              if (data.length === 0) {
                return { max: {}, min: {} };
              } else if (data.length === 1) {
                return { max: {}, min: data[0] };
              } else {
                return data.reduce(
                  (result, current) => {
                    const currentDate = new Date(current.date);
                    const minDate = new Date(result.min.date);
                    const maxDate = new Date(result.max.date);

                    if (currentDate < minDate) result.min = current;
                    if (currentDate > maxDate) result.max = current;

                    return result;
                  },
                  { max: data[0], min: data[0] }
                );
              }
            } else {
              // Jika data bukan array
              return { max: {}, min: {} };
            }
          };

          const getSirkulasi = getMaxMinDateObjects(sirkulasi);
          setSaldoSirkulas(getSirkulasi.max?.amount ?? 0);

          const sirkulasiBefore = (item) => {
            switch (item.type) {
              case 'ml':
                return getSirkulasi.min?.ml_amount ?? 0;
                break;
              //   case 'mb':
              //     return item.data.reduce(
              //       (acc, item) => acc + item.saldo_sebelumnya,
              //       0
              //     );
              //     break;
              //   case 'cm':
              //     return item.data.reduce(
              //       (acc, item) => acc + item.saldo_sebelumnya,
              //       0
              //     );
              //     break;
              default:
                return item.data.reduce(
                  (acc, item) => acc + item.saldo_sebelumnya,
                  0
                );
            }
          };
          const sirkulasiBeforeOnDB = (item) => {
            switch (item.type) {
              case 'ml':
                return getSirkulasi.min?.ml_amount ?? 0;
                break;
              case 'mb':
                return item.data.reduce(
                  (acc, item) => acc + item.saldo_sebelumnya,
                  0
                );
                break;
              case 'cm':
                return item.data.reduce(
                  (acc, item) => acc + item.saldo_sebelumnya,
                  0
                );
                break;
              default:
                return item.data.reduce(
                  (acc, item) => acc + item.saldo_sebelumnya,
                  0
                );
            }
          };

          const sirkulasiAwalOnDatabase = sirkulasiBefore(item);
          const sirkulasiAwalOnDatabase2 = sirkulasiBeforeOnDB(item);

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

          setSirkulasiAkhir((prevSirkulasiAkhir) => ({
            ...prevSirkulasiAkhir,
            [item.type]: {
              sirkulasi: sirkulasiAwalOnDatabase,

              angsuran: totalInstalment,
              saldo: sirkulasiAwalOnDatabase - totalInstalment,
            },
          }));

          return {
            key: item.month,
            instalment: { ...instalmentsSum },
            sirkulasi: sirkulasiAwalOnDatabase,
            sirkulasii: sirkulasiAwalOnDatabase2,
            totalInstalment: totalInstalment,
            sirkulasiAfter: sirkulasiAwalOnDatabase - totalInstalment,
          };
        };
        return resutl();
      });

      setData(mapingStortingData);
    }
  }, [datas]);

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

  const [showApproval, setShowApproval] = useState(false);
  const onShowApproval = (id) => {
    setShowApproval(true);
  };

  const onClosedShowApproval = () => {
    setShowApproval(false);
  };
  return (
    <div className="relative overflow-auto h-[70vh] lg:h-[85vh] scrollbar-thin">
      <Table className="text-xs rounded-lg">
        <TableHeader className="sticky top-0 left-0 z-10">
          <TableRow className="bg-gray-200">
            <TableHead className="text-center">Bulan</TableHead>
            <TableHead className="text-center">Sirkulasi</TableHead>
            <TableHead className="text-center">Sirkulasi2</TableHead>
            {dateOfWeek.map((day, i) => (
              <TableHead className="text-center whitespace-nowrap" key={i}>
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
                  <TableCell>
                    <FormatNumbering value={row.sirkulasii} />
                  </TableCell>

                  {dateOfWeek.map((day, i) => (
                    <TableCell
                      className="text-center whitespace-normal"
                      key={i}
                    >
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
        <TableFooter>
          <TableRow>
            <TableCell rowSpan={2} className="text-center">
              Total
            </TableCell>
            <TableCell rowSpan={2} className="text-center">
              <FormatNumbering value={calculateTotals(data, 'sirkulasi')} />
            </TableCell>
            <TableCell rowSpan={2} className="text-center">
              <FormatNumbering value={calculateTotals(data, 'sirkulasii')} />
            </TableCell>
            {dateOfWeek.map((day, i) => (
              <TableCell rowSpan={2} className="text-center" key={i}>
                <FormatNumbering value={calculateInstalment(data, day)} />
              </TableCell>
            ))}
            <TableCell rowSpan={2} className="text-center">
              <FormatNumbering
                value={calculateTotals(data, 'totalInstalment')}
              />
            </TableCell>
            {calculateTotals(data, 'sirkulasiAfter') == saldoSirkulas ? (
              <TableCell rowSpan={2} className="text-center">
                <FormatNumbering
                  value={calculateTotals(data, 'sirkulasiAfter')}
                />
              </TableCell>
            ) : (
              <TableCell className="text-center">
                <FormatNumbering
                  value={calculateTotals(data, 'sirkulasiAfter')}
                />
              </TableCell>
            )}
          </TableRow>
          <TableRow>
            {saldoSirkulas &&
            calculateTotals(data, 'sirkulasiAfter') != saldoSirkulas ? (
              <TableCell className="text-center bg-red-500">
                <FormatNumbering value={saldoSirkulas} />
              </TableCell>
            ) : (
              ''
            )}
          </TableRow>
        </TableFooter>
      </Table>
      {/* <div className="flex items-center justify-end gap-3 mt-6">
        <div>Approval Akhir Bulan</div>
        <div>
          <Button onClick={onShowApproval} variant="green" size="sm">
            Approval
          </Button>
        </div>
      </div> */}

      <ApprovalAkhir
        show={showApproval}
        onClosed={onClosedShowApproval}
        datas={sirkulasiAkhir}
      />
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
