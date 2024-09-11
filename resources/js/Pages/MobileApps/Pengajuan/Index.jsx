import BargeStatus from '@/Components/shadcn/BargeStatus';
import FormatNumbering from '@/Components/shadcn/FormatNumbering';
import SearchComponent from '@/Components/shadcn/SearchComponent';
import MobileLayout from '@/Layouts/MobileLayout';
import { Button } from '@/shadcn/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shadcn/ui/card';
import { Dialog } from '@/shadcn/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/shadcn/ui/popover';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shadcn/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shadcn/ui/tabs';
import dayjs from 'dayjs';
import { FilterIcon } from 'lucide-react';
import React, { useState } from 'react';
import Action from './Components/Action';

const Index = ({ data, select_kelompok, select_branch, ...props }) => {
  const selectedDay = props.server_filter.date;
  const dateToday = dayjs(selectedDay).format('YYYY-MM-DD');
  const dateprev = dayjs(selectedDay).subtract(1, 'week').format('YYYY-MM-DD');

  const [actionPengajuan, setActionPengajuan] = useState(false);
  const [actionPengajuanTriggeredData, setActionPengajuanTriggeredData] =
    useState();

  const onOpenActionPengajuan = (id) => {
    setActionPengajuan(true);
    setActionPengajuanTriggeredData(id);
  };
  const onClosedActionPengajuan = () => {
    setActionPengajuan(false);
    setActionPengajuanTriggeredData();
  };

  return (
    <MobileLayout>
      <Tabs defaultValue={0} className="w-full">
        <div className="flex items-end justify-between gap-3">
          <TabsList className="grid w-auto grid-cols-2">
            {data.map((header, key) => (
              <TabsTrigger key={key} value={key}>
                {dayjs(header.date).format('DD-MM-YYYY')}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="hidden lg:inline-block">
            <SearchComponent
              urlLink={route('mobile_apps.pengajuan.index_pengajuan')}
              searchDate={true}
              labelDate={'Pengajuan'}
              searchGroupingBranch={select_branch}
              searchKelompok={select_kelompok}
            />
          </div>
          <div className="lg:hidden">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <FilterIcon className="h-4" />
                  Filter
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <SearchComponent
                  urlLink={route('mobile_apps.pengajuan.index_pengajuan')}
                  searchDate={true}
                  labelDate={'Pengajuan'}
                  searchGroupingBranch={select_branch}
                  searchKelompok={select_kelompok}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        {data.length
          ? data.map((item, key) => (
              <TabsContent value={key}>
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {item.date == selectedDay
                        ? 'Pengajuan Sekarang'
                        : 'Pengajuan Sebelumnya'}
                    </CardTitle>
                    <CardDescription>
                      <div>
                        Pengajuan Tanggal :
                        <span className="font-bold text-red-500">
                          {' '}
                          {dayjs(item.date).format('dddd')} ,
                        </span>{' '}
                        {dayjs(item.date).format('DD MMMM YYYY')}
                      </div>
                      <div>Kelompok {props.server_filter.kelompok ?? null}</div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-auto scrollbar-thin">
                      <Table className="text-xs">
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nama</TableHead>
                            <TableHead className="text-center">
                              Status
                            </TableHead>
                            <TableHead className="text-center">Drop</TableHead>
                            <TableHead className="text-center">
                              Pengajuan
                            </TableHead>
                            <TableHead className="text-center">Acc</TableHead>
                            <TableHead className="text-center">Jadi</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {item.data.map((row) => (
                            <TableRow>
                              <TableCell>
                                <p className="whitespace-nowrap">{row.nama} </p>
                                <p>{row.alamat}</p>
                              </TableCell>
                              <TableCell className="text-center">
                                <p>
                                  <BargeStatus
                                    onClick={() => onOpenActionPengajuan(row)}
                                    value={row.status}
                                  />
                                </p>
                              </TableCell>
                              <TableCell>
                                <FormatNumbering
                                  className="mb-0.5 text-center"
                                  value={row.drop}
                                />
                              </TableCell>
                              <TableCell>
                                <FormatNumbering
                                  className="mb-0.5 text-center"
                                  value={row.request}
                                />
                              </TableCell>
                              <TableCell>
                                <FormatNumbering
                                  className="mb-0.5 text-center"
                                  value={row.acc}
                                />
                              </TableCell>
                              <TableCell>
                                <FormatNumbering
                                  className="mb-0.5 text-center"
                                  value={row.drop_jadi}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))
          : 'Tidak Ada data dibulan ini'}
      </Tabs>
      <Dialog
        open={actionPengajuan}
        onOpenChange={(open) => (open ? '' : onClosedActionPengajuan())}
      >
        <Action
          show={actionPengajuan}
          onClosed={onClosedActionPengajuan}
          triggeredData={actionPengajuanTriggeredData}
        />
      </Dialog>
    </MobileLayout>
  );
};

export default Index;
