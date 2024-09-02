import Loading from '@/Components/Loading';
import SweetAlert from '@/Components/SweetAlert';
import { Link, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import {
  AiFillCustomerService,
  AiFillHome,
  AiOutlineUser,
  AiOutlineUserAdd,
} from 'react-icons/ai';
import { BiExit, BiMoney, BiMoneyWithdraw } from 'react-icons/bi';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shadcn/ui/dropdown-menu';
import Hamburger from 'hamburger-react';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shadcn/ui/sheet';
import { Button } from '@/shadcn/ui/button';
import { HandCoinsIcon, Handshake, UserRound } from 'lucide-react';
import SidebarMobile from '@/Components/shadcn/SidebarMobile';

const MobileLayout = ({ header, children, loading = false }) => {
  const { auth } = usePage().props;
  const { errors, flash } = usePage().props;
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);
  return (
    <div className="relative z-10 antialiased">
      {Object.keys(errors).length > 0 && (
        <SweetAlert type="error" flash={errors} />
      )}
      {flash?.message && <SweetAlert type="success" flash={flash} />}
      <Loading show={loading} />

      <div className="relative h-screen max-w-sm mx-auto">
        <div className="sticky top-0 z-50 flex items-center h-16 gap-4 px-3 bg-transparent">
          <nav className="flex flex-row items-center justify-between w-full gap-5 text-sm font-mediumlg:gap-6">
            <div className="flex items-center justify-start">
              <Hamburger
                distance={'md'}
                toggled={isOpen}
                toggle={toggleSidebar}
                size={16}
                rounded
                color="#020617"
              />
              <p className="hidden font-semibold lg:block">UBMI APPS</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="flex items-center justify-center gap-3 text-sm">
                  {auth.user.username}
                  <UserRound className="w-4 h-4 animate-pulse" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {auth.user.employee.nama_karyawan}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href={route('profile.edit')}>Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <a
                    target="_blank"
                    href="https://www.youtube.com/watch?v=HrHDfHy0lHk"
                  >
                    Support
                  </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    replace="true"
                  >
                    Logout
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <SidebarMobile setIsOpen={setIsOpen} isOpen={isOpen} />
          </nav>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default MobileLayout;
