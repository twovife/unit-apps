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
  Home,
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
                  <Link href={route('mobile_apps.index')}>
                    <Home />
                  </Link>
                </Button>
                <div className="text-center">Home</div>
              </div>
            </div>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default SidebarMobile;
