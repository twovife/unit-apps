import React from 'react';
import { SidebarTrigger } from '@/shadcn/ui/sidebar';
import GlobalBranchFilter from './GlobalBranchFilter';

const Navbar = ({ header }) => {
  return (
    <header className="sticky top-0 z-30 flex items-center h-14 gap-4 px-4 bg-white border-b shrink-0 md:px-6">
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        <span className="font-semibold text-slate-800 text-sm hidden sm:inline-block">
          UBMI APPS
        </span>
      </div>
      <div className="flex flex-1 items-center justify-end gap-4">
        <GlobalBranchFilter compact />
      </div>
    </header>
  );
};

export default Navbar;
