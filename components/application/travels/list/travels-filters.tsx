import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChangeEvent, Dispatch, SetStateAction } from "react";

interface TravelsFiltersProps {
    filters: TravelFilters;
    setFilters: Dispatch<SetStateAction<TravelFilters>>;
}

const TravelsFilters = ({ filters, setFilters }: TravelsFiltersProps) => {
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFilters((prev) => ({ ...prev, title: e.target.value }));
    };

    const handleStatusChange = (val: TravelFilters["status"]) => {
        setFilters((prev) => ({ ...prev, status: val }));
    };

    const handleOrderChange = (val: TravelFilters["order"]) => {
        setFilters((prev) => ({ ...prev, order: val}));
    };

    return (
        <div className="flex flex-col sm:flex-row mt-4 gap-4">
            <div className="flex-1">
                <Label htmlFor="destination" className="sr-only">Rechercher par titre</Label>
                <Input
                    id="destination"
                    placeholder="Rechercher un voyage..."
                    value={filters.title}
                    onChange={handleInputChange}
                />
            </div>
            <div className="flex-1">
                <Label htmlFor="status" className="sr-only">Filtrer par status</Label>
                <Select
                    value={filters.status}
                    onValueChange={handleStatusChange}
                >
                    <SelectTrigger id="status">
                        <SelectValue placeholder="Filtrer par statut" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tous</SelectItem>
                        <SelectItem value="non_planned">Non planifié</SelectItem>
                        <SelectItem value="upcoming">Planifié</SelectItem>
                        <SelectItem value="ongoing">En cours</SelectItem>
                        <SelectItem value="completed">Terminé</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex-1">
                <Label htmlFor="order" className="sr-only">Ordonner par date</Label>
                <Select value={filters.order} onValueChange={handleOrderChange}>
                    <SelectTrigger id="order">
                        <SelectValue placeholder="Ordonner par date" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="asc">Du plus récent</SelectItem>
                        <SelectItem value="desc">Du plus ancien</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}

export default TravelsFilters;