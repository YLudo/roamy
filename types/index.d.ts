declare interface IMenu {
    href: string;
    label: string;
    icon: Icon;
    active: boolean;
}

declare interface ITravel {
    id: string;
    title: string;
    startDate: string | null;
    endDate: string | null;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

declare interface TravelFilters {
    title: string;
    status: "all" | "non_planned" | "upcoming" | "ongoing" | "completed";
    order: "asc" | "desc"; 
}