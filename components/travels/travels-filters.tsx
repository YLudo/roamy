import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

const TravelsFilters = () => {
    return (
        <div className="flex flex-col sm:flex-row mt-4 gap-4">
            <div className="flex-1">
                <Label htmlFor="search" className="sr-only">Rechercher</Label>
                <Input id="search" placeholder="Rechercher un voyage..." />
            </div>
            <Select>
                <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="upcoming">A venir</SelectItem>
                    <SelectItem value="ongoing">En cours</SelectItem>
                    <SelectItem value="completed">Terminé</SelectItem>
                </SelectContent>
            </Select>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-[180px] justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 wh-4" />
                        Date
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" />
                </PopoverContent>
            </Popover>
        </div>
    );
}

export default TravelsFilters;