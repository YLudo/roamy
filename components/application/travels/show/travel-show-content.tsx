import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TravelShowSummary from "./summary/travel-show-summary";

const TravelShowContent = ({ travel, fetchTravel }: { travel: ITravel, fetchTravel: () => void }) => {
    return (
        <Tabs defaultValue="summary" onValueChange={fetchTravel} className="w-full mt-4">
            <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="summary">Résumé</TabsTrigger>
                <TabsTrigger value="activities">Activités</TabsTrigger>
                <TabsTrigger value="expenses">Dépenses</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>
            <TabsContent value="summary">
                <TravelShowSummary travel={travel} />
            </TabsContent>
            <TabsContent value="activities">
                <p>Activités en cours...</p>
            </TabsContent>
            <TabsContent value="expenses">
                <p>Dépenses en cours...</p>
            </TabsContent>
            <TabsContent value="documents">
                <p>Documents en cours...</p>
            </TabsContent>
        </Tabs>
    );
}

export default TravelShowContent;