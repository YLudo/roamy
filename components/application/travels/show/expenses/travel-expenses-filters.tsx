import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChangeEvent, Dispatch, SetStateAction } from "react";

interface TravelExpensesFiltersProps {
    filters: ExpenseFilters;
    setFilters: Dispatch<SetStateAction<ExpenseFilters>>;
}

const TravelExpensesFilters = ({ filters, setFilters }: TravelExpensesFiltersProps) => {
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFilters((prev) => ({ ...prev, title: e.target.value }));
    };
    
    const handleCategoryChange = (val: ExpenseFilters["category"]) => {
        setFilters((prev) => ({ ...prev, category: val }));
    };

    const handleDateChange = (val: ExpenseFilters["date"]) => {
        setFilters((prev) => ({ ...prev, date: val }));
    };
    
    return (
        <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
                <Label htmlFor="title" className="sr-only">Rechercher par titre</Label>
                <Input
                    id="destination"
                    placeholder="Rechercher un voyage..."
                    value={filters.title}
                    onChange={handleInputChange}
                />
            </div>
            <div className="flex-1">
                <Label htmlFor="category" className="sr-only">Rechercher par catégorie</Label>
                <Select
                    value={filters.category}
                    onValueChange={handleCategoryChange}
                >
                    <SelectTrigger id="category">
                        <SelectValue placeholder="Filtrer par catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">Tous</SelectItem>
                        <SelectItem value="ACCOMODATION">Hébergement</SelectItem>
                        <SelectItem value="MEAL">Repas</SelectItem>
                        <SelectItem value="ACTIVITY">Activité</SelectItem>
                        <SelectItem value="TRANSPORT">Transport</SelectItem>
                        <SelectItem value="OTHER">Autre</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex-1">
                <Label htmlFor="date" className="sr-only">Ordonner par date</Label>
                <Select
                    value={filters.date}
                    onValueChange={handleDateChange}
                >
                    <SelectTrigger id="date">
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

export default TravelExpensesFilters;