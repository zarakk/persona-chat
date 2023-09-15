import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Sidebar } from "./Sidebar";
import { useProModal } from "@/hooks/use-pro-modal";
interface MobileSidebarProps {
  isPro: boolean;
}
export const MobileSidebar = ({ isPro }: MobileSidebarProps) => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-secondary pt-10 w-32">
        <Sidebar isPro={isPro} />
      </SheetContent>
    </Sheet>
  );
};
