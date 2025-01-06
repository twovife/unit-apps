import * as React from 'react';
import {
  GalleryVerticalEnd,
  HandCoinsIcon,
  Home,
  Layers,
  Search,
  UserX,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from '@/shadcn/ui/sidebar';

import { Button } from '@/shadcn/ui/button';
import { Link } from '@inertiajs/react';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { Separator } from '@/shadcn/ui/separator';

// This is sample data.

export function AppSidebar({ ...props }) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">UBM APPS</span>
                  <span className="">DIGITAL APPS</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <p className="font-semibold text-gray-400">Menu Utama</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-16 w-full"
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
                  className="h-16 w-full"
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
                  className="h-16 w-full"
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
                  className="h-16 w-full"
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
                  className="h-16 w-full"
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
            <Separator orientation="horizontal" className="mt-2 w-full" />
            <p className="font-semibold text-gray-400">Menu Laporan</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-16 w-full"
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
                  className="h-16 w-full"
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
                  className="h-16 w-full"
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
                  className="h-16 w-full"
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
                  className="h-16 w-full"
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
            <Separator orientation="horizontal" className="mt-2 w-full" />
            <p className="font-semibold text-gray-400">Menu Pimpinan</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-16 w-full"
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
                  className="h-16 w-full"
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
                  className="h-16 w-full"
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
                  className="h-16 w-full"
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
                  className="h-16 w-full"
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
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
