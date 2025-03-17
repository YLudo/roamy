import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { List, Map } from "lucide-react";
import { ChangeEvent, Dispatch, SetStateAction } from "react";

interface TravelActivitiesFiltersProps {
    filters: ActivityFilters;
    setFilters: Dispatch<SetStateAction<ActivityFilters>>;
}

const TravelActivitiesFilters = ({ filters, setFilters }: TravelActivitiesFiltersProps) => {
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFilters((prev) => ({ ...prev, title: e.target.value }));
    };

    const handleDateChange = (val: ActivityFilters["date"]) => {
        setFilters((prev) => ({ ...prev, date: val }));
    };

    const handleViewChange = (val: string) => {
        if (val) {
            setFilters((prev) => ({ ...prev, view: val as "list" | "map" }))
        }
    }

    return (
        <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
                <Label htmlFor="title" className="sr-only">Rechercher par titre</Label>
                <Input
                    id="title"
                    placeholder="Rechercher une activité..."
                    value={filters.title}
                    onChange={handleInputChange}
                />
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
            <div className="flex justify-end">
                <ToggleGroup type="single" value={filters.view} onValueChange={handleViewChange}>
                    <ToggleGroupItem value="list" aria-label="Afficher en liste">
                        <List className="h-4 w-4 mr-2" />
                        Liste
                    </ToggleGroupItem>
                    <ToggleGroupItem value="map" aria-label="Afficher sur la carte">
                        <Map className="h-4 w-4 mr-2" />
                        Carte
                    </ToggleGroupItem>
                </ToggleGroup>
            </div>
        </div>
    );
}

export default TravelActivitiesFilters;