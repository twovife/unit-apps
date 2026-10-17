import { Button } from '@/shadcn/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shadcn/ui/dropdown-menu';
import { Link, usePage } from '@inertiajs/react';
import { UserRound } from 'lucide-react';
import React from 'react';

const DropdownProfile = () => {
  const { auth } = usePage().props;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          className="flex items-center justify-center gap-3 text-sm"
        >
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

        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link
            className="w-full"
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
  );
};

export default DropdownProfile;
