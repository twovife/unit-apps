import { Button } from '@/shadcn/ui/button';
import { Link, usePage } from '@inertiajs/react';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { HandCoinsIcon, Home, Layers, UserX } from 'lucide-react';
import React from 'react';

const MantriDashboard = () => {
  return (
    <>
      <div className="grid gap-4 auto-rows-min md:grid-cols-3">
        <div className="flex items-center gap-3 font-sans rounded-xl aspect-21/9">
          <div className="flex flex-col justify-center flex-1 h-full p-4 bg-red-600 rounded-lg shadow ">
            <div className="text-xs font-semibold tracking-wider text-gray-200">
              RENCANA DROP
            </div>
            <div className="text-lg font-semibold text-gray-200">
              Rp. 4.000.000
            </div>
            <div className="text-end">
              <Button variant="destructiveoutline2" size="xs">
                Go
              </Button>
            </div>
          </div>
          <div className="flex flex-col justify-center flex-1 h-full p-4 rounded-lg shadow bg-gray-200/20">
            <div className="text-xs font-semibold tracking-wider text-gray-800">
              DROP HARI INI
            </div>
            <div className="text-lg font-semibold text-red-600">
              Rp. 4.000.000
            </div>
            <div className="text-xs leading-4 text-gray-500">
              <div className="flex">
                <div className="flex-[2]">Baru</div>
                <div className="flex-1">:</div>
                <div className="flex-[4]">2.000.000</div>
              </div>
              <div className="flex">
                <div className="flex-[2]">Lama</div>
                <div className="flex-1">:</div>
                <div className="flex-[4]">2.000.000</div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 font-sans rounded-xl aspect-21/9">
          <div className="flex flex-col justify-center flex-1 h-full p-4 rounded-lg shadow bg-gray-200/20">
            <div className="text-xs font-semibold tracking-wider text-gray-800">
              TARGET
            </div>
            <div className="text-lg font-semibold text-red-600">
              Rp. 4.000.000
            </div>
          </div>
          <div className="flex flex-col justify-center flex-1 h-full p-4 rounded-lg shadow bg-gray-200/20">
            <div className="text-xs font-semibold tracking-wider text-gray-800">
              STORTING HARI INI
            </div>
            <div className="text-lg font-semibold text-red-600">
              Rp. 4.000.000
            </div>
            <div className="text-end">
              <Button variant="destructiveoutline2" size="xs">
                Go
              </Button>
            </div>
          </div>
        </div>
        <div className="items-start hidden gap-3 p-4 font-sans shadow xl:flex rounded-xl xl:aspect-21/9"></div>
      </div>
      <div className="flex-1 rounded-xl bg-muted/50 md:min-h-min">
        <div className="grid w-full grid-cols-4 gap-3">
          <div className="text-center">
            <Button
              variant="outline"
              size="icon"
              className="w-full h-16"
              asChild
            >
              <Link
                className="flex flex-col justify-center"
                href={route('mobile_apps.index')}
              >
                <Home />
                <div className="text-xs">Home</div>
              </Link>
            </Button>
          </div>

          <div className="text-center">
            <Button
              variant="outline"
              size="icon"
              className="w-full h-16"
              asChild
            >
              <Link
                className="flex flex-col justify-center"
                href={route('mobile_apps.create')}
              >
                <MagnifyingGlassIcon className="h-7 w-7" />
                <div className="text-xs">Pengajuan</div>
              </Link>
            </Button>
          </div>
          <div className="text-center">
            <Button
              variant="outline"
              size="icon"
              className="w-full h-16"
              asChild
            >
              <Link
                className="flex flex-col justify-center"
                href={route('mobile_apps.transaksi')}
              >
                <Layers className="h-7 w-7" />
                <div className="text-xs">Drop</div>
              </Link>
            </Button>
          </div>

          <div className="text-center">
            <Button
              variant="outline"
              size="icon"
              className="w-full h-16"
              asChild
            >
              <Link
                className="flex flex-col justify-center"
                href={route('mobile_apps.angsuran')}
              >
                <HandCoinsIcon className="h-7 w-7" />
                <div className="text-xs">Angsuran</div>
              </Link>
            </Button>
          </div>
          <div className="text-center">
            <Button
              variant="outline"
              size="icon"
              className="w-full h-16"
              asChild
            >
              <Link
                className="flex flex-col justify-center"
                href={route('mobile_apps.macet')}
              >
                <UserX className="h-7 w-7" />
                <div className="text-xs">Macet</div>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MantriDashboard;
