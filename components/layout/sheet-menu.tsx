"use client";

import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet";
import { MenuIcon, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getMenuList } from "@/lib/utils";

const SheetMenu = () => {
    const pathname = usePathname();
    const menuList = getMenuList(pathname);
    return (
        <Sheet>
            <SheetTrigger className="md:hidden" asChild>
                <Button className="h-8" variant="outline" size="icon">
                    <MenuIcon size={20} />
                </Button>
            </SheetTrigger>
            <SheetContent className="sm:w-72 px-4 h-full flex flex-col" side="left">
                <SheetHeader>
                    <Button
                        className="flex justify-center items-center pb-2 pt-1"
                        variant="link"
                        asChild
                    >
                        <Link href="/" className="flex items-center gap-2">
                            <Plane className="w-6 h-6 mr-1 text-primary" />
                            <h1 className="font-bold text-lg">Roamy</h1>
                        </Link>
                    </Button>
                </SheetHeader>
                <nav className="w-full">
                    <ul className="flex flex-col items-start space-y-1 px-2">
                        {menuList.map((({ href, label, active, icon: Icon }, index) => (
                            <Button
                                key={index}
                                variant={active ? "secondary" : "ghost"}
                                className="w-full justify-start h-10"
                                asChild
                            >
                                <Link href={href}>
                                    <Icon size={18} /> {label}
                                </Link>
                            </Button>
                        )))}
                    </ul>
                </nav>
            </SheetContent>
        </Sheet>
    );
}

export default SheetMenu;