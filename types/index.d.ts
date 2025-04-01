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
    user: any;
    id: string;
    userId: string;
    travelId: string;
    user: IUser;
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

declare interface ActivityFilters {
    title: string;
    date: "asc" | "desc";
    view: "list" | "map";
}

declare interface IDocument {
    id: string;
    title: string;
    description?: string | null;
    url: string;
    travelId: string;
    createdAt: Date;
    updatedAt: Date;
}

declare interface DocumentsFilters {
    title: string;
}

declare interface IPoll {
    id: string;
    title: string;
    description?: string | null;
    hasVoted: boolean;
    pollOptions: IPollOption[];
    travelId: string;
    travel?: ITravel;
    userId: string;
    user?: IUser;
    createdAt: Date;
    updatedAt: Date;
}

declare interface IPollOption {
    id: string;
    text: string;
    votes: IVote[];
    pollId: string;
    poll: IPoll;
    createdAt: Date;
    updatedAt: Date;
}

declare interface IVote {
    id: string;
    pollOptionId: string;
    pollOption: IPollOption;
    userId: string;
    user: IUser;
    createdAt: Date;
    updatedAt: Date;
}

declare interface IPlaidItem {
    id: string;
    userId: string;
    accessToken: string;
    itemId: string;
    institutionId: string;
    institutionName: string;
    createdAt: Date;
    updatedAt: Date;
}

declare interface IPlaidAccount {
    id: string;
    itemId: string;
    accountId: string;
    name: string;
    mask: string;
    type: string;
    subtype: string;
    balanceAvailable: number;
    balanceCurrent: number;
    isCurrencyCode: string;
    createdAt: Date;
    updatedAt: Date;
}

declare interface IPlaidTransaction {
    id: string;
    accountId: string;
    transactionId: string;
    amount: number;
    date: Date;
    name: string;
    merchantName: string | null;
    category: string[];
    location: {
        address?: string;
        city?: string;
        country?: string;
        postalCode?: string;
        region?: string;
    } | null;
    paymentChannel: string;
    isoCurrencyCode: string;
    pending: boolean;
    createdAt: Date;
    updatedAt: Date;
}

declare interface IInvitation {
    id: string;
    status: "PENDING" | "ACCEPTED" | "DECLINED" | "EXPIRED";
    expiresAt: Date;
    travelId: string;
    travel?: ITravel;
    inviterId: string;
    inviter?: IUser;
    inviteeEmail: string;
    inviteeId?: string | null;
    invitee?: IUser;
    createdAt: Date;
    updatedAt: Date;
}