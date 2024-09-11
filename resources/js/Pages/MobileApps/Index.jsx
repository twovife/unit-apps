import MobileLayout from '@/Layouts/MobileLayout';
import { Button } from '@/shadcn/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card';
import { Link } from '@inertiajs/react';
import { Notebook } from 'lucide-react';
import React from 'react';

const Index = () => {
  return (
    <MobileLayout>
      <Card className="mb-3">
        <CardHeader>
          <CardTitle>Menu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center justify-start gap-3 mb-3">
            <Button asChild size="icon2xl" variant="destructive">
              <Link className="flex flex-col">
                <Notebook />
                <div className="text-xs">Baru</div>
              </Link>
            </Button>
            <Button
              asChild
              size="icon2xl"
              variant={
                route().current('mobile_apps.pengajuan.*')
                  ? 'default'
                  : 'destructive'
              }
            >
              <Link
                href={route('mobile_apps.pengajuan.index_pengajuan')}
                className="flex flex-col"
              >
                <Notebook />
                <div className="text-xs">Transaksi</div>
              </Link>
            </Button>
            <Button asChild size="icon2xl" variant="destructive">
              <Link className="flex flex-col">
                <Notebook />
                <div className="text-xs">Rencana</div>
              </Link>
            </Button>
          </div>
          <div className="flex flex-wrap items-center justify-start gap-3">
            <Button asChild size="icon2xl" variant="destructive">
              <Link className="flex flex-col">
                <Notebook />
                <div className="text-xs">Angsuran</div>
              </Link>
            </Button>
            <Button asChild size="icon2xl" variant="destructive">
              <Link className="flex flex-col">
                <Notebook />
                <div className="text-xs">Macet</div>
              </Link>
            </Button>
            <Button asChild size="icon2xl" variant="destructive">
              <Link className="flex flex-col">
                <Notebook />
                <div className="text-xs">Storting</div>
              </Link>
            </Button>
            <Button asChild size="icon2xl" variant="destructive">
              <Link className="flex flex-col">
                <Notebook />
                <div className="text-xs">Rekap</div>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Detail Mantri</CardTitle>
        </CardHeader>
        <CardContent>asd</CardContent>
      </Card>
    </MobileLayout>
  );
};

export default Index;
