import { useCallback, useEffect, useState, useTransition } from "react";
import TravelActivitiesForm from "./travel-activities-form";
import { getActivities } from "@/actions/activities";
import { toast } from "@/hooks/use-toast";
import TravelActivitiesList from "./travel-activities-list";
import { pusherClient } from "@/lib/pusher";
import TravelActivitiesFilters from "./travel-activities-filters";
import TravelActivitiesMap from "./travel-activities-map";
import PaginationLayout from "@/components/application/pagination-layout";

const TravelActivitiesLayout = ({ travel }: { travel: ITravel }) => {
    const [activities, setActivities] = useState<IActivity[]>([]);
    const [isPending, startTransition] = useTransition();

    const [filters, setFilters] = useState<ActivityFilters>({
        title: "",
        date: "asc",
        view: "list",
    });

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const itemsPerPage = 6;

    const fetchActivities = useCallback(() => {
        const { title, date } = filters;

        startTransition(async () => {
            const result = await getActivities(travel.id, title, date, currentPage, itemsPerPage);

            if (result.error) {
                toast({
                    variant: "destructive",
                    title: "Oups !",
                    description: result.error,
                });
            } else if (result.data) {
                setActivities(result.data.activities.map(activity => ({
                    ...activity,
                    date: activity.date ? new Date(activity.date).toISOString() : null
                })));
                setTotalPages(result.data.totalPages)
            }
        })
    }, [filters, travel.id, currentPage]);

    useEffect(() => {
        fetchActivities();
    }, [fetchActivities, filters]);

    useEffect(() => {
        const channelName = `travel-${travel.id}`;
        const channel = pusherClient.subscribe(channelName);

        channel.bind("travel:new-acitvity", () => fetchActivities());
        channel.bind("travel:update-activity", (data: { activity: IActivity, updatedActivity: IActivity }) => {
            setActivities((prev) => prev.map(activity => 
                activity.id === data.updatedActivity.id ? {
                    ...data.updatedActivity,
                    date: data.updatedActivity.date ? new Date(data.updatedActivity.date).toISOString() : null,
                } : activity
            ));
        });

        channel.bind("travel:delete-activity", (activity: IActivity) => {
            setActivities((prev) => prev.filter((a) => a.id !== activity.id));
        });

        return () => {
            pusherClient.unbind("travel:new-acitvity");
            pusherClient.unbind("travel:update-activity");
            pusherClient.unbind("travel:delete-activity");
            pusherClient.unsubscribe(channelName);
        }
    }, [fetchActivities, travel.id]);

    return (
        <div className="mt-4 grid lg:grid-cols-3 gap-4">
            <TravelActivitiesForm travelId={travel.id} />
            <div className="lg:col-span-2">
                <TravelActivitiesFilters filters={filters} setFilters={setFilters} />
                {filters.view === "list" ? (
                    <>
                        <TravelActivitiesList isLoading={isPending} activities={activities} />
                        <PaginationLayout
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={(page) => setCurrentPage(page)} 
                        />
                    </>
                ) : (
                    <TravelActivitiesMap isLoading={isPending} activities={activities} />
                )}
            </div>
        </div>
    );
}

export default TravelActivitiesLayout;