import SearchComponent from '@/Components/shadcn/SearchComponent';
import MobileLayout from '@/Layouts/MobileLayout';
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
import { CreditCard, Handshake, Notebook } from 'lucide-react';
import React from 'react';

const Index = ({ data, select_kelompok, select_branch, ...props }) => {
  return (
    <MobileLayout>
      <Tabs defaultValue="prev" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="prev">Minggu Lalu</TabsTrigger>
          <TabsTrigger value="today">Hari Ini</TabsTrigger>
          <TabsTrigger value="select">Select</TabsTrigger>
        </TabsList>
        <TabsContent value="prev">
          <Card>
            <CardHeader>
              <CardTitle>Pengajuan Minggu Lalu</CardTitle>
              <CardDescription>
                Pengajuan Tanggal : 22-Agustus-2024
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table className="text-xs">
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Tgl Drop</TableHead>
                    <TableHead>Drop</TableHead>
                    <TableHead>Pengajuan</TableHead>
                    <TableHead>Acc</TableHead>
                    <TableHead>Jadi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>AZIZ NUR IHSAN SUKOWATI</TableCell>
                    <TableCell>1.000</TableCell>
                    <TableCell>500</TableCell>
                    <TableCell>500</TableCell>
                    <TableCell>
                      <div className="text-center">
                        <div>500</div>
                        <Badge variant={'green'}>Acc</Badge>
                      </div>
                    </TableCell>
                    <TableCell>500</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="today">Change your password here.</TabsContent>
        <TabsContent value="select">Change your password here.</TabsContent>
      </Tabs>
    </MobileLayout>
  );
};

export default Index;
