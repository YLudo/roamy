"use client";

import { useEffect, useState, useTransition } from "react";
import TravelHeader from "./travel-header";
import TravelsList from "./travels-list";
import { getTravels } from "@/actions/travels";
import { toast } from "@/hooks/use-toast";

const TravelsLayout = () => {
    const [travels, setTravels] = useState<ITravel[]>([]);
    const [isPending, startTransition] = useTransition();

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

    return (
        <section className="mt-4">
            <TravelHeader />
            <TravelsList isLoading={isPending} travels={travels} />
        </section>
    );
}

export default TravelsLayout;