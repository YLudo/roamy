import { Skeleton } from "@/components/ui/skeleton";
import TravelPollCollapsible from "./travel-poll-collapsible";

interface TravelPollsListProps {
    isLoading: boolean;
    polls: IPoll[];
}

const TravelPollsList = ({ isLoading, polls }: TravelPollsListProps) => {
    if (isLoading) {
        return <Skeleton className="h-[150px] w-full rounded-lg" />
    }

    if (polls.length <= 0) {
        return (
            <div className="text-center py-8 bg-muted rounded-lg">
                <p className="text-muted-foreground">Vous n'avez pas encore de sondages !</p>
                <p className="text-muted-foreground">Veuillez ajouter un sondage pour commencer.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-4">
            {polls.map((poll, index) => (
                <TravelPollCollapsible key={index} poll={poll} />
            ))}
        </div>
    );
}

export default TravelPollsList;