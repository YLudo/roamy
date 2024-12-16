"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import TravelCard from "./travel-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TravelActivites from "./travel-activities";
import TravelBudget from "./travel-budget";
import TravelDocuments from "./travel-documents";

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
                    <Tabs defaultValue="activities" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="activities">Activités</TabsTrigger>
                            <TabsTrigger value="budget">Budget</TabsTrigger>
                            <TabsTrigger value="documents">Documents</TabsTrigger>
                        </TabsList>
                        <TabsContent value="activities">
                            <TravelActivites travel={travel} />
                        </TabsContent>
                        <TabsContent value="budget">
                            <TravelBudget travel={travel} />
                        </TabsContent>
                        <TabsContent value="documents">
                            <TravelDocuments travel={travel} />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </section>
    );
}

export default TravelShowLayout;