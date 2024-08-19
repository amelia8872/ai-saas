'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Sidebar from '@/components/Sidebar';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface MobileSidebarProps {
  apiLimitCount: number;
  isPro: boolean;
}

const MobileSidebar = ({
  apiLimitCount = 0,
  isPro = false,
}: MobileSidebarProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <Sheet>
      <SheetTrigger>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <Sidebar apiLimitCount={apiLimitCount} isPro={isPro} />
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
