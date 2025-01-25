"use client";

import { useEffect, useState, useTransition } from "react";
import TravelHeader from "./travel-header";
import TravelsList from "./travels-list";
import { getTravels } from "@/actions/travels";
import { toast } from "@/hooks/use-toast";
import TravelsFilters from "./travels-filters";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/lib/pusher";

const TravelsLayout = () => {
    const [travels, setTravels] = useState<ITravel[]>([]);
    const [isPending, startTransition] = useTransition();
    const { data: session } = useSession();

    useEffect(() => {
        startTransition(async () => {
            const result = await getTravels();
            
            if (result.error) {
                toast({
                    variant: "destructive",
                    title: "Oups !",
                    description: result.error,
                });
            } else if (result.data) {
                setTravels(result.data);
            }
        })
    }, []);

    useEffect(() => {
        if (!session?.user?.id) return;

        const channelName = `user-${session.user.id}`;
        const channel = pusherClient.subscribe(channelName);

        channel.bind("travels:update-list", (data: ITravel[]) => {
            setTravels(data);
        });

        channel.bind("travels:new", (newTravel: ITravel) => {
            setTravels((prev) => [...prev, newTravel]);
        });

        return () => {
            pusherClient.unsubscribe(channelName);
            pusherClient.unbind("travels:update-list");
        };
    }, [session?.user?.id]);

    return (
        <section className="mt-4">
            <TravelHeader />
            <TravelsFilters />
            <TravelsList isLoading={isPending} travels={travels} />
        </section>
    );
}

export default TravelsLayout;