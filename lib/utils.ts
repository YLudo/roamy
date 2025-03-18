import { ExpenseCategory } from "@prisma/client"
import { clsx, type ClassValue } from "clsx"
import { isBefore, isSameDay } from "date-fns"
import { Bed, Utensils, Ticket, Bus, MoreHorizontal, LayoutGrid, Plane, DollarSign } from "lucide-react"
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
		{
			href: '/bank-accounts',
			label: 'Comptes bancaires',
			icon: DollarSign,
			active: pathname.includes('bank-accounts'),
		}
	]
}

export const getTravelStatus = (startDate: string, endDate: string): { statusLabel: string; statusColor: "outline" | "secondary" | "default" | "destructive" } => {
	const now = Date.now();
	const start = new Date(startDate).getTime();
	const end = new Date(endDate).getTime();

	if (!start || !end) {
		return { statusLabel: "Non planifié", statusColor: "outline" };
	}

	if (now < start) {
		return { statusLabel: "Planifié", statusColor: "secondary" };
	} else if (now >= start && now <= end) {
		return { statusLabel: "En cours", statusColor: "default" };
	}
	
	return { statusLabel: "Terminé", statusColor: "destructive" };
}

export const getExpenseCategoryIcon = (category: ExpenseCategory) => {
	switch (category) {
		case ExpenseCategory.ACCOMODATION:
		  	return Bed;
		case ExpenseCategory.MEAL:
		 	return Utensils;
		case ExpenseCategory.ACTIVITY:
		  	return Ticket;
		case ExpenseCategory.TRANSPORT:
		  	return Bus;
		case ExpenseCategory.OTHER:
		  	return MoreHorizontal;
		default:
			return null;
	}
};

export const getActivityStatus = (date: string): { statusLabel: string; statusColor: "outline" | "secondary" | "default" | "destructive" } => {
	const now = Date();
	const activityDate = new Date(date);

	if (!activityDate) {
		return { statusLabel: "Non planifié", statusColor: "outline" };
	}

	if (isSameDay(date, now)) {
        return { statusLabel: "Aujourd'hui", statusColor: "default" };
    } else if (isBefore(date, now)) {
        return { statusLabel: "Terminé", statusColor: "destructive" };
    } else {
        return { statusLabel: "A venir", statusColor: "outline" };
    }
}