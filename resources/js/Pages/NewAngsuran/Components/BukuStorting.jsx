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
import TutupBukuBaru from './TutupBukuBaru';
import { usePage } from '@inertiajs/react';

const BukuStorting = ({ dateOfWeek, datas, sirkulasi }) => {
  // Kantor migrasi: tutup buku = tanda tangan baris bulanan (sekali).
  const { tutup_buku: tb, server_filter } = usePage().props;
  const [data, setData] = useState([]);
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

          const sirkulasiAwalFunction = (params) => {
            switch (params.type) {
              case 'ml':
                return sirkulasi?.ml_amount ?? 0;
                break;
              default:
                return params.data.reduce(
                  (acc, itm) => acc + itm.saldo_sebelumnya,
                  0
                );
            }
          };

          const sirkulasiAwal = sirkulasiAwalFunction(item);

          dateOfWeek.forEach((date) => {
            instalmentsSum[date] = 0;
          });

          let totalInstalment = 0;

          const totalPemutihan = item.data.reduce(
            (total, item) => total + item.pemutihanThisMonth,
            0
          );

          item.data.forEach((data) => {
            dateOfWeek.forEach((date) => {
              if (data.instalment[date] !== undefined) {
                totalInstalment += data.instalment[date].total_nominal;
                instalmentsSum[date] += data.instalment[date].total_nominal;
              }
            });
          });

          setSirkulasiAkhir((prevSirkulasiAkhir) => ({
            ...prevSirkulasiAkhir,
            [item.type]: {
              sirkulasi: sirkulasiAwal,
              angsuran: totalInstalment,
              pemutihan: totalPemutihan,
              saldo: sirkulasiAwal - (totalInstalment + totalPemutihan),
            },
          }));

          return {
            key: item.month,
            instalment: { ...instalmentsSum },
            sirkulasi: sirkulasiAwal,
            totalInstalment: totalInstalment,
            totalPemutihan: totalPemutihan,
            sirkulasiAfter: sirkulasiAwal - (totalInstalment + totalPemutihan),
            type: item.type,
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

  const calculateTotals = (data, keyToSum, sumAll) => {
    const result = data.reduce((acc, item) => {
      if (sumAll && item.type === 'normal') {
        return acc;
      }
      return acc + parseInt(item[keyToSum] ?? 0);
    }, 0);
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
            <TableHead className="text-center">MD</TableHead>
            <TableHead className="text-center">Saldo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data ? (
            data.map((row, i) => (
              <React.Fragment key={i}>
                <TableRow>
                  <TableCell>{row.key}</TableCell>
                  <TableCell
                    className={`${row.type == 'normal' ? 'bg-green-200' : ''} `}
                  >
                    <FormatNumbering ribuan value={row.sirkulasi} />
                  </TableCell>

                  {dateOfWeek.map((day, i) => (
                    <TableCell className={`text-center`} key={i}>
                      <FormatNumbering ribuan value={row.instalment[day]} />
                    </TableCell>
                  ))}
                  <TableCell>
                    <FormatNumbering ribuan value={row.totalInstalment} />
                  </TableCell>
                  <TableCell>
                    <FormatNumbering ribuan value={row.totalPemutihan} />
                  </TableCell>
                  <TableCell>
                    <FormatNumbering ribuan value={row.sirkulasiAfter} />
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
            <TableCell className="text-center">
              <FormatNumbering ribuan
                value={calculateTotals(data, 'sirkulasi', true)}
              />
            </TableCell>
            <TableCell
              className="text-center"
              colspan={dateOfWeek.length + 3}
            ></TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="text-center">
              <FormatNumbering ribuan value={calculateTotals(data, 'sirkulasi')} />
            </TableCell>
            {dateOfWeek.map((day, i) => (
              <TableCell className="text-center" key={i}>
                <FormatNumbering ribuan value={calculateInstalment(data, day)} />
              </TableCell>
            ))}
            <TableCell className="text-center">
              <FormatNumbering ribuan
                value={calculateTotals(data, 'totalInstalment')}
              />
            </TableCell>
            <TableCell className="text-center">
              <FormatNumbering ribuan
                value={calculateTotals(data, 'totalPemutihan')}
              />
            </TableCell>

            <TableCell className="text-center">
              <FormatNumbering ribuan
                value={calculateTotals(data, 'sirkulasiAfter')}
              />
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      <div className="flex items-center justify-end gap-3 mt-6">
        <div>Tutup Buku Storting</div>
        <div>
          {tb?.ditutup_at ? (
            // Sudah ditutup: tombol hilang, tinggal keterangan (klik untuk lihat angkanya).
            <button
              type="button"
              onClick={onShowApproval}
              className="px-2 py-1 text-xs font-medium rounded-md bg-emerald-50 text-emerald-800 ring-1 ring-emerald-300"
            >
              Ditutup{tb.ditutup_oleh ? ` · ${tb.ditutup_oleh}` : ''} · {dayjs(tb.ditutup_at).format('DD-MM-YY')}
            </button>
          ) : (
            <Button onClick={onShowApproval} variant="green" size="sm">
              Tutup Buku
            </Button>
          )}
        </div>
      </div>

      {tb ? (
        <TutupBukuBaru tb={tb} month={server_filter.month} show={showApproval} onClosed={onClosedShowApproval} />
      ) : (
        <ApprovalAkhir
          show={showApproval}
          onClosed={onClosedShowApproval}
          datas={sirkulasiAkhir}
        />
      )}
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
