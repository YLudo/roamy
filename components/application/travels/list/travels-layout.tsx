"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import TravelsHeader from "./travels-header";
import TravelsList from "./travels-list";
import { getTravels } from "@/actions/travels";
import { toast } from "@/hooks/use-toast";
import TravelsFilters from "./travels-filters";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/lib/pusher";
import PaginationLayout from "../../pagination-layout";

const TravelsLayout = () => {
    const [travels, setTravels] = useState<ITravel[]>([]);
    const [isPending, startTransition] = useTransition();
    const { data: session } = useSession();

    const [filters, setFilters] = useState<TravelFilters>({
        title: "",
        status: "all",
        order: "asc",
    });

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const itemsPerPage = 6;

    const fetchTravels = useCallback(() => {
        const { title, status, order } = filters;

        startTransition(async () => {
            const result = await getTravels(title, status, order, currentPage, itemsPerPage);
            
            if (result.error) {
                toast({
                    variant: "destructive",
                    title: "Oups !",
                    description: result.error,
                });
            } else if (result.data) {
                setTravels(result.data.travels);
                setTotalPages(result.data.totalPages);
            }
        })
    }, [filters, currentPage]);

    useEffect(() => {
        fetchTravels();
    }, [fetchTravels, filters]);

    useEffect(() => {
        if (!session?.user?.id) return;

        const channelName = `user-${session.user.id}`;
        const channel = pusherClient.subscribe(channelName);

        const handleUpdate = () => {
            fetchTravels();
        };

        channel.bind("travels:new", handleUpdate);
        channel.bind("travels:update-list", handleUpdate);

        return () => {
            pusherClient.unbind("travels:update-list");
            pusherClient.unbind("travels:new");
            pusherClient.unsubscribe(channelName);
        };
    }, [fetchTravels, session?.user?.id]);

    return (
        <section className="mt-4">
            <TravelsHeader />
            <TravelsFilters filters={filters} setFilters={setFilters} />
            <TravelsList isLoading={isPending} travels={travels} />
            <PaginationLayout
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
            />
        </section>
    );
}

export default TravelsLayout;