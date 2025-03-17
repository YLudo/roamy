import { Skeleton } from "@/components/ui/skeleton";
import TravelActivityCard from "./travel-activity-card";

interface TravelActivitiesListProps {
    isLoading: boolean;
    activities: IActivity[];
};

const TravelActivitiesList = ({ isLoading, activities }: TravelActivitiesListProps) => {
    if (isLoading) {
        return <Skeleton className="lg:col-span-2 h-[150px] w-full rounded-xl mt-4" />
    }

    if (activities.length <= 0) {
        return (
            <div className="lg:col-span-2 mt-4 h-fit text-center py-8 bg-muted rounded-lg">
                <p className="text-muted-foreground">Vous n'avez pas encore d'activités !</p>
                <p className="text-muted-foreground">Veuillez ajouter une activité pour commencer.</p>
            </div>
        );
    }

    return (
        <div className="grid md:grid-cols-2 gap-4 mt-4">
            {activities.map((activity, index) => (
                <TravelActivityCard key={index} activity={activity} />
            ))}
        </div>
    );
}

export default TravelActivitiesList;