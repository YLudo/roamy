import { useCallback, useEffect, useState, useTransition } from "react";
import TravelActivitiesForm from "./travel-activities-form";
import { getActivities } from "@/actions/activities";
import { toast } from "@/hooks/use-toast";
import TravelActivitiesList from "./travel-activities-list";
import { pusherClient } from "@/lib/pusher";
import TravelActivitiesFilters from "./travel-activities-filters";

const TravelActivitiesLayout = ({ travel }: { travel: ITravel }) => {
    const [activities, setActivities] = useState<IActivity[]>([]);
    const [isPending, startTransition] = useTransition();

    const [filters, setFilters] = useState<ActivityFilters>({
        title: "",
        date: "asc",
    });

    const fetchActivities = useCallback(() => {
        const { title, date } = filters;

        startTransition(async () => {
            const result = await getActivities(travel.id, title, date);

            if (result.error) {
                toast({
                    variant: "destructive",
                    title: "Oups !",
                    description: result.error,
                });
            } else if (result.data) {
                setActivities(result.data.map(activity => ({
                    ...activity,
                    date: activity.date ? new Date(activity.date).toISOString() : null
                })));
            }
        })
    }, [filters, travel.id]);

    useEffect(() => {
        fetchActivities();
    }, [fetchActivities, filters]);

    useEffect(() => {
        const channelName = `travel-${travel.id}`;
        const channel = pusherClient.subscribe(channelName);

        channel.bind("travel:new-acitvity", () => fetchActivities());
        channel.bind("travel:update-activity", () => fetchActivities());

        return () => {
            pusherClient.unbind("travel:new-acitvity");
            pusherClient.unbind("travel:update-activity");
            pusherClient.unsubscribe(channelName);
        }
    }, [fetchActivities, travel.id]);

    return (
        <div className="mt-4 grid lg:grid-cols-3 gap-4">
            <div className="space-y-4">
                <TravelActivitiesForm travelId={travel.id} />
            </div>
            <div className="lg:col-span-2">
                <TravelActivitiesFilters filters={filters} setFilters={setFilters} />
                <TravelActivitiesList isLoading={isPending} activities={activities} />
            </div>
        </div>
    );
}

export default TravelActivitiesLayout;