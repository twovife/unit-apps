import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from '@/shadcn/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shadcn/ui/dropdown-menu';
import {
  Book,
  BookOpen,
  Calendar,
  ChevronsUpDown,
  ClipboardCheck,
  FileSpreadsheet,
  HandCoins,
  Home,
  Layers,
  LogOut,
  PlusCircle,
  Search,
  ShieldCheck,
  Smartphone,
  UserRound,
  Users,
  UserX,
} from 'lucide-react';
import GlobalBranchFilter from './GlobalBranchFilter';

const SidebarSubMenuSection = ({ icon: Icon, title, items }) => {
  return (
    <div className="mt-2 first:mt-0">
      <div className="flex items-center gap-2 px-2 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
        {Icon && <Icon className="size-3.5 shrink-0 text-slate-400" />}
        <span className="truncate">{title}</span>
      </div>
      <SidebarMenuSub className="my-0.5 ml-3.5 border-l border-slate-200 pl-2 space-y-0.5">
        {items.map((subItem) => (
          <SidebarMenuSubItem key={subItem.id || subItem.title}>
            <SidebarMenuSubButton asChild isActive={subItem.active}>
              <Link href={subItem.link} className="font-medium text-xs py-1.5">
                {subItem.title}
              </Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
        ))}
      </SidebarMenuSub>
    </div>
  );
};

export default function AppSidebar({ ...props }) {
  const { auth } = usePage().props;

  const unitAkses =
    auth?.permissions?.includes('can-approve') ||
    auth?.permissions?.includes('view-all-groups') ||
    auth?.permissions?.includes('view-all-branches');

  const isSuperUser = auth?.roles?.includes('superuser');

  return (
    <Sidebar className="border-r shadow-xs" {...props}>
      <SidebarHeader className="px-3 py-3 border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="hover:bg-transparent"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center text-sm font-bold text-white rounded-lg shadow-sm size-9 bg-slate-900">
                  UB
                </div>
                <div className="grid flex-1 text-sm leading-tight text-left">
                  <span className="font-bold tracking-tight truncate text-slate-900">
                    UBMI APPS
                  </span>
                  <span className="text-xs font-medium truncate text-slate-500">
                    Cabang Transaction
                  </span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-1 py-2">
        {/* Group: Navigasi Utama */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Navigasi Utama
          </SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={route().current('home')}
                tooltip="Home"
              >
                <Link
                  href={route('home')}
                  className="flex items-center gap-2.5 font-medium"
                >
                  <Home className="size-4" />
                  <span>Home Web</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          {/* Submenu Utama Pertama: Mantri Apps (Daftar Rute Mobile Apps) */}
          <SidebarSubMenuSection
            icon={Smartphone}
            title="Input Mantri"
            items={[
              {
                id: 2,
                title: 'Pengajuan',
                link: route('mobile_apps.create'),
                active: route().current('mobile_apps.create'),
              },
              {
                id: 3,
                title: 'Drop',
                link: route('mobile_apps.transaksi'),
                active: route().current('mobile_apps.transaksi'),
              },
              {
                id: 4,
                title: 'Angsuran',
                link: route('mobile_apps.angsuran'),
                active: route().current('mobile_apps.angsuran'),
              },
              {
                id: 5,
                title: 'ML',
                link: route('mobile_apps.macet'),
                active: route().current('mobile_apps.macet'),
              },
            ]}
          />
        </SidebarGroup>
        <SidebarSubMenuSection
          icon={Book}
          title={'Buku'}
          items={[
            {
              id: 1,
              title: 'Buku Transaksi (ACC KM)',
              link: route('transaction.index_buku_transaksi'),
              active: route().current('transaction.index_buku_transaksi'),
            },
            {
              id: 2,
              title: 'Buku Angsuran Lancar',
              link: route('pinjaman.index_pinjaman'),
              active: route().current('pinjaman.index_pinjaman'),
            },
            {
              id: 3,
              title: 'Buku Macet',
              link: route('pinjaman.index_pinjaman_macet'),
              active: route().current('pinjaman.index_pinjaman_macet'),
            },
          ]}
        />

        <SidebarSubMenuSection
          icon={FileSpreadsheet}
          title="Buku Rekap"
          items={[
            {
              id: 1,
              title: 'Rekap 1 & Tunai Mantri',
              link: route('kasir.rekap.rekap_satu'),
              active: route().current('kasir.rekap.rekap_satu'),
            },
            {
              id: 2,
              title: auth?.permissions?.includes('view-all-groups')
                ? 'Rekap 2'
                : 'Rekap Pimpinan',
              link: route('kasir.rekap.rekap_dua'),
              active: route().current('kasir.rekap.rekap_dua'),
            },
            {
              id: 3,
              title: 'Rencana Drop',
              link: route('kasir.rekap.rencana_drop'),
              active: route().current('kasir.rekap.rencana_drop'),
            },
            {
              id: 4,
              title: 'Rekap Mantri',
              link: route('kasir.rekap.rekap_permantri'),
              active: route().current('kasir.rekap.rekap_permantri'),
            },
          ]}
        />

        {/* Group: Operasional Cabang */}
        {unitAkses && (
          <SidebarGroup className="pt-2">
            <SidebarGroupLabel className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Administrasi Cabang
            </SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={route().current('administrasi.manpower.index')}
                  tooltip="Data Karyawan"
                >
                  <Link
                    href={route('administrasi.manpower.index')}
                    className="flex items-center gap-2.5 font-medium"
                  >
                    <Users className="size-4" />
                    <span>Data Karyawan</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>

            {/* Submenu: Buku Transaksi */}
            <SidebarSubMenuSection
              icon={BookOpen}
              title="Input Staf"
              items={[
                {
                  id: 2,
                  title: 'Input Pinjaman',
                  link: route('transaction.fastcreate'),
                  active: route().current('transaction.fastcreate'),
                },
              ]}
            />

            {/* Submenu: Angsuran Cabang */}
            <SidebarSubMenuSection
              icon={HandCoins}
              title="Angsuran Cabang"
              items={[
                {
                  id: 1,
                  title: 'Angsuran Lancar',
                  link: route('pinjaman.index_pinjaman'),
                  active: route().current('pinjaman.index_pinjaman'),
                },
                {
                  id: 2,
                  title: 'Macet',
                  link: route('pinjaman.index_pinjaman_macet'),
                  active: route().current('pinjaman.index_pinjaman_macet'),
                },
                {
                  id: 3,
                  title: 'Cari Angsuran',
                  link: route('pinjaman.index_pinjaman_search'),
                  active: route().current('pinjaman.index_pinjaman_search'),
                },
              ]}
            />

            {/* Submenu: Persiapan Migrasi Agregasi */}
            <SidebarSubMenuSection
              icon={ClipboardCheck}
              title="Persiapan Migrasi"
              items={[
                {
                  id: 1,
                  title: 'Stock-take ML',
                  link: route('migrasi.stock_take_ml'),
                  active: route().current('migrasi.stock_take_ml'),
                },
              ]}
            />
          </SidebarGroup>
        )}

        {/* Group: Administrator (Superuser) */}
        {isSuperUser && (
          <SidebarGroup className="pt-2">
            <SidebarGroupLabel className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Pengaturan Admin
            </SidebarGroupLabel>
            <SidebarSubMenuSection
              icon={ShieldCheck}
              title="Admin Panel"
              items={[
                {
                  id: 1,
                  title: 'Panel Utama',
                  link: route('adminpanel.index'),
                  active: route().current('adminpanel.index'),
                },
                {
                  id: 2,
                  title: 'Monitoring Staff',
                  link: route('adminpanel.monitoring_staff'),
                  active: route().current('adminpanel.monitoring_staff'),
                },
                {
                  id: 3,
                  title: 'Loan Balancing',
                  link: route('adminpanel.loan_balancing'),
                  active: route().current('adminpanel.loan_balancing'),
                },
              ]}
            />
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* Footer User Profile Card */}
      <SidebarFooter className="p-2 border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="w-full justify-between data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex items-center min-w-0 gap-3">
                    <div className="flex items-center justify-center text-xs font-semibold text-white rounded-full shadow-xs size-8 shrink-0 bg-slate-900">
                      {auth?.user?.username?.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="grid flex-1 text-sm leading-tight text-left truncate">
                      <span className="font-semibold truncate text-slate-900">
                        {auth?.user?.employee?.nama_karyawan ||
                          auth?.user?.username}
                      </span>
                      <span className="text-xs truncate text-slate-500">
                        {auth?.user?.username}
                      </span>
                    </div>
                  </div>
                  <ChevronsUpDown className="size-4 shrink-0 text-slate-400" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 rounded-lg"
                side="top"
                align="end"
                sideOffset={8}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2.5 px-2 py-2 text-left text-sm">
                    <div className="flex items-center justify-center text-xs font-semibold text-white rounded-full size-8 shrink-0 bg-slate-900">
                      {auth?.user?.username?.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="grid flex-1 text-sm leading-tight text-left truncate">
                      <span className="font-semibold truncate text-slate-900">
                        {auth?.user?.employee?.nama_karyawan ||
                          auth?.user?.username}
                      </span>
                      <span className="text-xs truncate text-slate-500">
                        {auth?.user?.email || auth?.user?.username}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href={route('profile.edit')}
                    className="flex items-center w-full gap-2 cursor-pointer text-slate-700"
                  >
                    <UserRound className="size-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    replace="true"
                    className="flex items-center w-full gap-2 text-red-600 cursor-pointer focus:text-red-600"
                  >
                    <LogOut className="size-4" />
                    <span>Log Out</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
