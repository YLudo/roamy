"use client";

import { getTravel } from "@/actions/travels";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { startTransition, useCallback, useEffect, useState } from "react";
import TravelShowHeader from "./travel-show-header";
import TravelShowContent from "./travel-show-content";
import { pusherClient } from "@/lib/pusher";
import TravelShowSkeleton from "./travel-show-skeleton";

const TravelShowLayout = ({ travelId }: { travelId: string }) => {
    const [travel, setTravel] = useState<ITravel>({} as ITravel);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const router = useRouter();

    const fetchTravel = useCallback(() => {
        startTransition(async () => {
            const result = await getTravel(travelId);
            if (result.error) {
                toast({
                    variant: "destructive",
                    title: "Oups !",
                    description: result.error,
                });
                
                startTransition(() => {
                    router.push("/travels");
                });
    
                return;
            } else if (result.data) {
                setTravel(result.data);
            }
            setIsLoading(false);
        })
    }, [router, travelId]);

    useEffect(() => {
        fetchTravel();
    }, [fetchTravel]);

    useEffect(() => {
        const channelName = `travel-${travel.id}`;
        const channel = pusherClient.subscribe(channelName);

        const handleUpdate = () => {
            fetchTravel();
        };

        channel.bind("travel:update", handleUpdate);

        return () => {
            pusherClient.unbind("travel:update");
            pusherClient.unsubscribe(channelName);
        }
    }, [fetchTravel, router, travel.id])

    if (isLoading) {
        return <TravelShowSkeleton />
    }

    return (
        <section className="mt-4">
            <TravelShowHeader travel={travel} />
            <TravelShowContent travel={travel} fetchTravel={fetchTravel} />
        </section>
    );
}

export default TravelShowLayout;