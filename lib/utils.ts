import { clsx, type ClassValue } from "clsx"
import { LayoutGrid, Plane } from "lucide-react"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getMenuList(pathname: string): IMenu[] {
	return [
		{
			href: '/',
			label: 'Tableau de bord',
			icon: LayoutGrid,
			active: pathname === '/',
		},
		{
			href: '/travels',
			label: 'Voyages',
			icon: Plane,
			active: pathname.includes('/travels'),
		},
	]
}