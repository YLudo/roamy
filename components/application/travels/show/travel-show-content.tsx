import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TravelShowSummary from "./summary/travel-show-summary";

const TravelShowContent = ({ travel }: { travel: ITravel }) => {
    return (
        <Tabs defaultValue="summary" className="w-full mt-4">
            <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="summary">Résumé</TabsTrigger>
                <TabsTrigger value="activities">Activités</TabsTrigger>
                <TabsTrigger value="expenses">Dépenses</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>
            <TabsContent value="summary">
                <TravelShowSummary travel={travel} />
            </TabsContent>
        </Tabs>
    );
}

export default TravelShowContent;