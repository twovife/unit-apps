import React, { useLayoutEffect, useRef } from 'react';
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
  Car,
  ChevronsUpDown,
  ClipboardCheck,
  FilePenLine,
  FileSpreadsheet,
  HandCoins,
  Home,
  Layers,
  LayoutDashboard,
  LogOut,
  PiggyBank,
  PlusCircle,
  Search,
  ShieldCheck,
  Smartphone,
  UserRound,
  UserPlus,
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
                {subItem.fix && (
                  <span className="ml-auto rounded px-1 py-px text-[10px] font-semibold leading-none bg-emerald-100 text-emerald-700">
                    FIX
                  </span>
                )}
              </Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
        ))}
      </SidebarMenuSub>
    </div>
  );
};

// Posisi gulir sidebar. Sidebar dipasang ulang tiap pindah halaman Inertia
// (layout per halaman), jadi tanpa ini selalu loncat ke atas. Variabel modul
// bertahan selama aplikasi terbuka; muat ulang penuh kembali ke atas.
let posisiGulir = 0;

export default function AppSidebar({ ...props }) {
  const { auth } = usePage().props;
  const gulir = useRef(null);
  useLayoutEffect(() => {
    if (gulir.current) gulir.current.scrollTop = posisiGulir;
  }, []);

  const isSuperUser = auth?.roles?.includes('superuser');
  // Mantri hanya melihat: Input Mantri (Pengajuan, Drop, Angsuran, ML), Buku
  // (Transaksi, Angsuran Lancar, Macet) & Rekap Mantri. Peran lain melihat
  // semua kecuali menu superuser (mas 2026-10-10).
  const isMantri = auth?.roles?.includes('mantri') && !isSuperUser;
  // Iuran 1 Juta, Iuran BOP, SKSW, Aset Kendaraan (mas 2026-10-15).
  const bolehAdmKantor = ['kasir', 'stafkontrol', 'pusat', 'pimpinan', 'superuser'].some((r) => auth?.roles?.includes(r));

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
                <img src="/icons/logo-ubm.webp?v=3" alt="UBMI" className="object-contain size-9 drop-shadow-xs" />
                <div className="grid flex-1 text-sm leading-tight text-left">
                  <span className="font-bold tracking-tight truncate text-slate-900">
                    UBMI DIGITAL
                  </span>
                  <span className="text-xs font-medium truncate text-slate-500">
                    Aplikasi Pembukuan Kantor
                  </span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent ref={gulir} onScroll={(e) => (posisiGulir = e.currentTarget.scrollTop)} className="px-1 py-2">
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
            {auth?.permissions?.includes('view-all-groups') && (
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={route().current('dashboard.kasir')}
                  tooltip="Dashboard Kasir"
                >
                  <Link
                    href={route('dashboard.kasir')}
                    className="flex items-center gap-2.5 font-medium"
                  >
                    <LayoutDashboard className="size-4" />
                    <span>Dashboard Kasir</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
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
                link: route('transaction.index_buku_transaksi'),
                active: route().current('transaction.index_buku_transaksi'),
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
                link: route('mobile_apps.ml'),
                active: route().current('mobile_apps.ml'),
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
            ...(isMantri
              ? []
              : [
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
                ]),
            {
              id: 4,
              title: 'Rekap Mantri',
              link: route('kasir.rekap.rekap_permantri'),
              active: route().current('kasir.rekap.rekap_permantri'),
            },
          ]}
        />

        {/* FASTCREATE (dulu Input Staf) - di atas Administrasi Cabang. */}
        {!isMantri && (
          <SidebarSubMenuSection
            icon={BookOpen}
            title="FASTCREATE"
            items={[
              {
                id: 2,
                title: 'Input Pinjaman',
                link: route('transaction.fastcreate'),
                active: route().current('transaction.fastcreate'),
              },
            ]}
          />
        )}

        {/* Group: Operasional Cabang */}
        {!isMantri && (
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
              {(bolehAdmKantor || auth?.permissions?.includes('input-lamaran')) && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={route().current('administrasi.lamaran.index')}
                    tooltip="Lamaran Kerja"
                  >
                    <Link
                      href={route('administrasi.lamaran.index')}
                      className="flex items-center gap-2.5 font-medium"
                    >
                      <UserPlus className="size-4" />
                      <span>Lamaran Kerja</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              {/* Iuran 1 Juta, Iuran BOP, SKSW, Aset: sudah rilis, bukan closed beta lagi (mas 2026-10-15). */}
              {bolehAdmKantor && (
              <>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={route().current('tabungan.contributions')}
                  tooltip="Iuran Tabungan 1 Juta"
                >
                  <Link
                    href={route('tabungan.contributions')}
                    className="flex items-center gap-2.5 font-medium"
                  >
                    <PiggyBank className="size-4" />
                    <span>Iuran Tabungan 1 Juta</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={route().current('bop.contributions')}
                  tooltip="Iuran BOP"
                >
                  <Link
                    href={route('bop.contributions')}
                    className="flex items-center gap-2.5 font-medium"
                  >
                    <HandCoins className="size-4" />
                    <span>Iuran BOP</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={route().current('sksw.unit')}
                  tooltip="SKSW — Laporan Unit"
                >
                  <Link
                    href={route('sksw.unit')}
                    className="flex items-center gap-2.5 font-medium"
                  >
                    <FileSpreadsheet className="size-4" />
                    <span>SKSW — Laporan Unit</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={route().current('assets.index')}
                  tooltip="Aset Kendaraan"
                >
                  <Link
                    href={route('assets.index')}
                    className="flex items-center gap-2.5 font-medium"
                  >
                    <Car className="size-4" />
                    <span>Aset Kendaraan</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              </>
              )}
            </SidebarMenu>

            {/* Submenu: Persiapan Migrasi Agregasi - khusus superuser (mas 2026-10-10). */}
            {isSuperUser && (
            <SidebarSubMenuSection
              icon={ClipboardCheck}
              title="Persiapan Migrasi"
              items={[
                {
                  id: 99,
                  title: 'Dashboard Migrasi',
                  link: route('migrasi.dashboard'),
                  active: route().current('migrasi.dashboard'),
                  fix: true,
                },
                {
                  id: 0,
                  title: 'Kesiapan Migrasi',
                  link: route('migrasi.kesiapan'),
                  active: route().current('migrasi.kesiapan'),
                  fix: true,
                },
                {
                  id: 100,
                  title: 'Nasabah Macet',
                  link: route('migrasi.nasabah_macet'),
                  active: route().current('migrasi.nasabah_macet'),
                  fix: true,
                },
              ]}
            />
            )}

            {/* Koreksi Pasca Migrasi - khusus superuser (mas 2026-10-11). */}
            {isSuperUser && (
            <SidebarSubMenuSection
              icon={FilePenLine}
              title="Koreksi Pasca Migrasi"
              items={[
                {
                  id: 1,
                  title: 'Koreksi Data Beku',
                  link: route('migrasi.koreksi_beku'),
                  active: route().current('migrasi.koreksi_beku'),
                  fix: true,
                },
                {
                  id: 2,
                  title: 'Log Koreksi',
                  link: route('migrasi.koreksi_beku_log'),
                  active: route().current('migrasi.koreksi_beku_log'),
                  fix: true,
                },
              ]}
            />
            )}
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
                  id: 4,
                  title: 'Kalender Kerja',
                  link: route('kalender.index'),
                  active: route().current('kalender.index'),
                },
                {
                  id: 5,
                  title: 'Mutasi Nasabah',
                  link: route('mutasi_nasabah.index'),
                  active: route().current('mutasi_nasabah.index'),
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
