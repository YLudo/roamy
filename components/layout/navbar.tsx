"use client";

import { getMenuList } from "@/lib/utils";
import { Plane } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation"
import SheetMenu from "@/components/layout/sheet-menu";
import UserNav from "@/components/layout/user-nav";

const Navbar = () => {
    const pathname = usePathname();
    const menuList = getMenuList(pathname);

    return (
        <section className="sticky top-0 z-10 w-full p-4 bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
            <div className="container mx-auto flex items-center justify-between">
                <SheetMenu />
                <span className="hidden md:flex gap-4 text-lg font-bold items-center"><Plane className="text-primary" /> Roamy</span>
                <div className="flex items-center gap-8">
                    <nav className="hidden md:flex items-center gap-8">
                        {menuList.map((menu, index) => (
                            <Link 
                                key={index} 
                                href={menu.href} 
                                className={menu.active ? 'text-primary' : 'text-muted-foreground'}
                            >
                                {menu.label}
                            </Link>
                        ))}
                    </nav>
                    <UserNav />
                </div>
            </div>
        </section>
    )
}

export default Navbar;