import { filterTravels } from "@/actions/travels";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState, useTransition } from "react";

const DEBOUNCE_DELAY = 500;

const TravelsFilters = () => {
    const [title, setTitle] = useState<string>("");
    const [status, setStatus] = useState<string>("all");
    const [order, setOrder] = useState<"asc" | "desc">("asc");
    const [, startTransition] = useTransition();

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            startTransition(async () => {
                await filterTravels(title, status, order);
            });
        }, DEBOUNCE_DELAY);

        return () => clearTimeout(timeoutId);
    }, [title, status, order]);

    return (
        <div className="flex flex-col sm:flex-row mt-4 gap-4">
            <div className="flex-1">
                <Label htmlFor="destination" className="sr-only">Rechercher par titre</Label>
                <Input
                    id="destination"
                    placeholder="Rechercher un voyage..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <div className="flex-1">
                <Label htmlFor="status" className="sr-only">Filtrer par status</Label>
                <Select
                    value={status}
                    onValueChange={(val) => setStatus(val)}
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
                <Select value={order} onValueChange={(val: "asc" | "desc") => setOrder(val)}>
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