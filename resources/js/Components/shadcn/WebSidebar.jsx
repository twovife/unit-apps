import * as React from 'react';
import { GalleryVerticalEnd } from 'lucide-react';

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

// This is sample data.
const data = {
  navMain: [
    {
      title: 'HOME',
      url: '#',
      items: [
        {
          title: 'WEB APPLICATION',
          url: '#',
        },
        {
          title: 'MANTRI APPLICATION',
          url: '#',
        },
      ],
    },
    {
      title: 'DATA KARYAWAN',
      url: '#',
    },
    {
      title: '#',
      url: '#',
      items: [
        {
          title: 'Buku Transaksi',
          url: '#',
        },
        {
          title: 'Fast Create',
          url: '#',
        },
        {
          title: 'Create ML',
          url: '#',
        },
      ],
    },
    {
      title: '#',
      url: '#',
      items: [
        {
          title: 'Angsuran Lancar',
          url: '#',
        },
        {
          title: 'Macet',
          url: '#',
        },
        {
          title: 'Perbulan',
          url: '#',
        },
      ],
    },
    {
      title: 'Rekap',
      url: '#',
      items: [
        {
          title: 'Rekap 1 & Tunai Mantri',
          url: '#',
        },
        {
          title: 'Rekap 2',
          url: '#',
        },
        {
          title: 'Rencana Drop',
          url: '#',
        },
        {
          title: 'Rekap Mantri',
          url: '#',
        },
      ],
    },
  ],
};

export function WebSidebar({ ...props }) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex items-center justify-center rounded-lg aspect-square size-8 bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Documentation</span>
                  <span className="">v1.0.0</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url} className="font-medium">
                    {item.title}
                  </a>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <SidebarMenuSub>
                    {item.items.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton asChild isActive={item.isActive}>
                          <a href={item.url}>{item.title}</a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
