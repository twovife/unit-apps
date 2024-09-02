import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shadcn/ui/sheet';
import { Button } from '@/shadcn/ui/button';
import {
  HandCoinsIcon,
  Handshake,
  UserRound,
  UserRoundPlus,
  UserRoundPlusIcon,
  Wrench,
} from 'lucide-react';
import { Link } from '@inertiajs/react';

const SidebarMobile = ({ isOpen, setIsOpen }) => {
  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => (open ? '' : setIsOpen(false))}
    >
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Menu Aplikasi</SheetTitle>
          <SheetDescription>
            <div className="grid grid-cols-2 gap-3 p-3">
              <div className="w-full text-center">
                <Button
                  type="button"
                  asChild
                  size="iconxl"
                  variant="destructive"
                >
                  <Link href={route('mobile_apps.pengajuan.index_pengajuan')}>
                    <UserRoundPlusIcon />
                  </Link>
                </Button>
                <div className="text-center">Pengajuan</div>
              </div>
              <div className="w-full text-center">
                <Button asChild size="iconxl" variant="destructive">
                  <Link>
                    <Handshake />
                  </Link>
                </Button>
                <div className="text-center">Transaksi</div>
              </div>
              <div className="w-full text-center">
                <Button asChild size="iconxl" variant="destructive">
                  <Link>
                    <HandCoinsIcon />
                  </Link>
                </Button>
                <div className="text-center">Angsuran</div>
              </div>
              <div className="w-full text-center">
                <Button asChild size="iconxl" variant="destructive">
                  <Link>
                    <Wrench />
                  </Link>
                </Button>
                <div className="text-center">User</div>
              </div>
            </div>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default SidebarMobile;
