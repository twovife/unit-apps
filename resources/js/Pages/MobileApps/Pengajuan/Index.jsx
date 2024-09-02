import SearchComponent from '@/Components/shadcn/SearchComponent';
import MobileLayout from '@/Layouts/MobileLayout';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shadcn/ui/accordion';
import { Badge } from '@/shadcn/ui/badge';
import { Button } from '@/shadcn/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shadcn/ui/card';
import { Separator } from '@/shadcn/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shadcn/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shadcn/ui/tabs';
import { Link } from '@inertiajs/react';
import dayjs from 'dayjs';
import { CreditCard, Handshake, Notebook } from 'lucide-react';
import React from 'react';

const Index = ({ data, select_kelompok, select_branch, ...props }) => {
  console.log(data);

  const dateprev = dayjs().subtract(1, 'week').format('YYYY-MM-DD');
  console.log(dateprev);

  return (
    <MobileLayout>
      <Tabs defaultValue="prev" className="w-full">
        <div className="flex flex-col-reverse items-end gap-3 lg:flex-row">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="prev">Minggu Lalu</TabsTrigger>
            <TabsTrigger value="today">Hari Ini</TabsTrigger>
          </TabsList>
          <SearchComponent
            urlLink={route('mobile_apps.pengajuan.index_pengajuan')}
            searchDate={true}
            labelDate={'Pengajuan'}
            searchGroupingBranch={select_branch}
            searchKelompok={select_kelompok}
          />
        </div>
        <TabsContent value="prev">
          <Card>
            <CardHeader>
              <CardTitle>Pengajuan Minggu Lalu</CardTitle>
              <CardDescription>
                Pengajuan Tanggal :
                <span className="font-bold text-red-500">
                  {' '}
                  {dayjs().subtract(1, 'week').format('dddd')} ,
                </span>{' '}
                {dayjs().subtract(1, 'week').format('DD MMMM YYYY')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto scrollbar-thin">
                <Table className="text-xs">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead className="text-center">Drop</TableHead>
                      <TableHead className="text-center">Pengajuan</TableHead>
                      <TableHead className="text-center">Acc</TableHead>
                      <TableHead className="text-center">Jadi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data
                      .filter((item) => item.date == dateprev)
                      .map((rows) =>
                        rows.data.map((item) => (
                          <TableRow>
                            <TableCell>
                              <p>{item.nama} </p>
                              <p>{item.alamat}</p>
                            </TableCell>
                            <TableCell>
                              <div className="text-center">
                                <div>{item.drop}</div>
                                <Badge variant={'green'}>22/3</Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-center">
                                <div>1.000.000</div>
                                <div className="px-2.5 py-0.5">&nbsp;</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-center">
                                <div>1.000.000</div>
                                <Badge variant={'green'}>Acc</Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-center">
                                <div>1.000.000</div>
                                <Badge variant={'green'}>Acc</Badge>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="today">
          <Card>
            <CardHeader>
              <CardTitle>Pengajuan Minggu Lalu</CardTitle>
              <CardDescription>
                Pengajuan Tanggal :
                <span className="font-bold text-red-500">
                  {' '}
                  {dayjs().format('dddd')} ,
                </span>{' '}
                {dayjs().format('DD MMMM YYYY')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto scrollbar-thin">
                <Table className="text-xs">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead className="text-center">Drop</TableHead>
                      <TableHead className="text-center">Pengajuan</TableHead>
                      <TableHead className="text-center">Acc</TableHead>
                      <TableHead className="text-center">Jadi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <p>AZIZ NUR IHSAN SUKOWATI </p>
                        <p>AZIZ NUR IHSAN SUKOWATI</p>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <div>1.000.000</div>
                          <Badge variant={'green'}>22/3</Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <div>1.000.000</div>
                          <div className="px-2.5 py-0.5">&nbsp;</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <div>1.000.000</div>
                          <Badge variant={'green'}>Acc</Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <div>1.000.000</div>
                          <Badge variant={'green'}>Acc</Badge>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MobileLayout>
  );
};

export default Index;
