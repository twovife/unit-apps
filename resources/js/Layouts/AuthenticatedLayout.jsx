import SweetAlert from '@/Components/SweetAlert';
import Loading from '@/Components/Loading';

import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { AppSidebar } from '@/Components/shadcn/AppSidebar';
import { Separator } from '@/shadcn/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/shadcn/ui/sidebar';
import DropdownProfile from '@/Components/shadcn/DropdownProfile';
import { WebSidebar } from '@/Components/shadcn/WebSidebar';

export default function Authenticated({ title, children, loading = false }) {
  const { errors, flash, auth } = usePage().props;
  const requiredPermission = ['unit staff', 'unit kasir'];
  const showSideBar = requiredPermission.some((permission) =>
    auth.permissions.includes(permission)
  );

  return (
    <SidebarProvider>
      {Object.keys(errors).length > 0 && (
        <SweetAlert type="error" message={errors[0]} keys={flash} />
      )}
      {flash.message && (
        <SweetAlert type="success" message={flash.message} keys={flash} />
      )}
      <Loading show={loading} />
      {showSideBar ? <WebSidebar /> : <AppSidebar />}
      <SidebarInset>
        <header className="flex items-center h-10 gap-2 border-b lg:h-16 shrink-0">
          <div className="flex items-center justify-between w-full px-3">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <Separator orientation="vertical" className="h-4 mr-2" />
            </div>
            <DropdownProfile />
          </div>
        </header>
        <Head title={title} />
        <div className="relative p-4 antialiased max-w-screen">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
