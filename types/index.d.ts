interface Menu {
    href: string;
    label: string;
    icon: Icon;
    active: boolean;
};

interface Travel {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    destination: string;
    image: string;
    status: string;
    participants: number;
}