import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChangeEvent, Dispatch, SetStateAction } from "react";

interface TravelDocumentsFiltersProps {
    filters: DocumentsFilters;
    setFilters: Dispatch<SetStateAction<DocumentsFilters>>;
}

const TravelDocumentsFilters = ({ filters, setFilters }: TravelDocumentsFiltersProps) => {
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFilters((prev) => ({ ...prev, title: e.target.value }));
    };

    return (
        <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
                <Label htmlFor="title" className="sr-only">Rechercher par titre</Label>
                <Input
                    id="title"
                    placeholder="Rechercher un document..."
                    value={filters.title}
                    onChange={handleInputChange}
                />
            </div>
        </div>
    );
}

export default TravelDocumentsFilters;