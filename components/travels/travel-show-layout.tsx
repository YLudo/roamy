"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import TravelCard from "./travel-card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TravelShowLayout = ({ travel }: { travel: Travel }) => {
    const router = useRouter();
    
    return (
        <section className="mt-6">
            <div className="flex items-center justify-between">
                <h1 className="font-bold text-xl">{travel.name}</h1>
                <Button onClick={() => router.push("/travels")}>Retour</Button>
            </div>
            <div className="grid lg:grid-cols-3 mt-4 gap-4">
                <TravelCard travel={travel} isShowPage />
                <div className="lg:col-span-2">
                    <Tabs defaultValue="itinerary" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="itinerary">Itinéraire</TabsTrigger>
                            <TabsTrigger value="budget">Budget</TabsTrigger>
                            <TabsTrigger value="documents">Documents</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            </div>
        </section>
    );
}

export default TravelShowLayout;