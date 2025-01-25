"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import TravelsHeader from "./travels-header";
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

    const [filters, setFilters] = useState<TravelFilters>({
        title: "",
        status: "all",
        order: "asc",
    });

    const fetchTravels = useCallback(() => {
        const { title, status, order } = filters;

        startTransition(async () => {
            const result = await getTravels(title, status, order);
            
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
    }, [filters]);

    useEffect(() => {
        fetchTravels();
    }, [fetchTravels]);

    useEffect(() => {
        if (!session?.user?.id) return;

        const channelName = `user-${session.user.id}`;
        const channel = pusherClient.subscribe(channelName);

        channel.bind("travels:update-list", (data: ITravel[]) => {
            setTravels(data);
        });

        channel.bind("travels:new", () => {
            fetchTravels();
        });

        return () => {
            pusherClient.unsubscribe(channelName);
            pusherClient.unbind("travels:update-list");
            pusherClient.unbind("travels:new");
        };
    }, [fetchTravels, session?.user?.id]);

    return (
        <section className="mt-4">
            <TravelsHeader />
            <TravelsFilters filters={filters} setFilters={setFilters} />
            <TravelsList isLoading={isPending} travels={travels} />
        </section>
    );
}

export default TravelsLayout;