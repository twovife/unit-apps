import React from 'react';

import { AppSidebar } from '@/Components/shadcn/AppSidebar';
import { Separator } from '@/shadcn/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/shadcn/ui/sidebar';
import { Button } from '@/shadcn/ui/button';
import DropdownProfile from '@/Components/shadcn/DropdownProfile';

const MobileLayout = ({ children, ...props }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
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

        <div className="relative p-4 antialiased">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default MobileLayout;
