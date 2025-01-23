import { Skeleton } from "@/components/ui/skeleton";
import TravelCard from "../travel-card";

interface TravelsListProps {
    isLoading: boolean;
    travels: ITravel[];
}

const TravelsList = ({
    isLoading,
    travels
}: TravelsListProps) => {

    if (isLoading) {
        return <Skeleton className="mt-4 h-[200px] w-full sm:w-1/2 lg:w-1/3 rounded-xl" />
    }

    if (travels.length <= 0) {
        return (
            <div className="mt-4 text-center py-8 bg-muted rounded-lg">
                <p className="text-muted-foreground">Vous n'avez pas encore de voyage planifié.</p>
                <p className="text-muted-foreground">Cliquez sur "Créer un voyage" pour commencer votre aventure !</p>
            </div>
        );
    }

    return (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 mt-4 gap-4">
            {travels.map((travel, index) => (
                <TravelCard key={index} travel={travel} />
            ))}
        </div>
    );
}

export default TravelsList;