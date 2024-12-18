"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TravelActivites from "./travel-activities";
import TravelBudget from "./travel-budget";
import TravelDocuments from "./travel-documents";
import TravelSummary from "./travel-summary";

const TravelShowLayout = ({ travel }: { travel: Travel }) => {
    const router = useRouter();
    
    return (
        <section className="mt-6">
            <div className="flex items-center justify-between">
                <h1 className="font-bold text-xl">{travel.name}</h1>
                <Button onClick={() => router.push("/travels")}>Retour</Button>
            </div>
            <Tabs defaultValue="summary" className="w-full mt-4">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="summary">Résumé</TabsTrigger>
                    <TabsTrigger value="activities">Activités</TabsTrigger>
                    <TabsTrigger value="budget">Budget</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                </TabsList>
                <TabsContent value="summary">
                    <TravelSummary travel={travel} />
                </TabsContent>
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
        </section>
    );
}

export default TravelShowLayout;