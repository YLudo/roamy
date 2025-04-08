"use client";

import { getTravel } from "@/actions/travels";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { startTransition, useCallback, useEffect, useState } from "react";
import TravelShowHeader from "./travel-show-header";
import TravelShowContent from "./travel-show-content";
import { pusherClient } from "@/lib/pusher";
import TravelShowSkeleton from "./travel-show-skeleton";
import TravelShowChat from "./travel-show-chat";

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

        channel.bind("travel:update", () => fetchTravel());
        channel.bind("travel:new-participant", (participant: IParticipant) => {
            setTravel((prev) => ({
                ...prev,
                participants: prev.participants ? [...prev.participants, participant] : [participant],
            }));
        });

        channel.bind("travel:delete-participant", (participantId: string) => {
            setTravel((prev) => ({
                ...prev,
                participants: prev.participants
                    ? prev.participants.filter(p => p.userId !== participantId)
                    : []
            }));
        });

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
            <TravelShowChat travelId={travel.id} />
        </section>
    );
}

export default TravelShowLayout;