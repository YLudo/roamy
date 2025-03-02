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
    participants?: IParticipant[];
    createdAt: Date;
    updatedAt: Date;
}

declare interface IParticipant {
    id: string;
    userId: string;
    travelId: string;
}

declare interface TravelFilters {
    title: string;
    status: "all" | "non_planned" | "upcoming" | "ongoing" | "completed";
    order: "asc" | "desc"; 
}

declare interface IExpense {
    id: string;
    title: string;
    category: "ACCOMODATION" | "MEAL" | "ACTIVITY" | "TRANSPORT" | "OTHER";
    amount: number;
    date: string | null;
    travelId: string;
    createdAt: Date;
    updatedAt: Date;
}

declare interface ExpenseFilters {
    title: string;
    category: "ALL" | "ACCOMODATION" | "MEAL" | "ACTIVITY" | "TRANSPORT" | "OTHER";
    date: "asc" | "desc";
}

declare interface IActivity {
    id: string;
    title: string;
    description?: string | null;
    address?: string | null;
    date?: string | null;
    travelId: string;
    createdAt: Date;
    updatedAt: Date;
}