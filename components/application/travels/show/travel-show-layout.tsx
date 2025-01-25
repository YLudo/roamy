"use client";

import { getTravel } from "@/actions/travels";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import TravelShowHeader from "./travel-show-header";
import TravelShowContent from "./travel-show-content";
import { pusherClient } from "@/lib/pusher";

const TravelShowLayout = ({ travelId }: { travelId: string }) => {
    const [travel, setTravel] = useState<ITravel>({} as ITravel);
    const [isPending, startTransition] = useTransition();
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
                router.push("/travels");
            } else if (result.data) {
                setTravel(result.data);
            }
        })
    }, [router, travelId]);

    useEffect(() => {
        fetchTravel();
    }, [fetchTravel]);

    useEffect(() => {
        const channelName = `travel-${travel.id}`;
        const channel = pusherClient.subscribe(channelName);

        channel.bind("travel:update", () => {
            fetchTravel();
        })

        return () => {
            pusherClient.unsubscribe(channelName);
            pusherClient.unbind("travel:update");
        }
    }, [fetchTravel, travel.id])

    return (
        <section className="mt-4">
            <TravelShowHeader travel={travel} isLoading={isPending} />
            <TravelShowContent travel={travel} />
        </section>
    );
}

export default TravelShowLayout;