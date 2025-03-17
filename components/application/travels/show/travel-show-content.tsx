import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TravelShowSummary from "./summary/travel-show-summary";
import TravelExpensesLayout from "./expenses/travel-expenses-layout";
import TravelActivitiesLayout from "./activities/travel-activities-layout";
import TravelDocumentsLayout from "./documents/travel-documents-layout";

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
                <TravelActivitiesLayout travel={travel} />
            </TabsContent>
            <TabsContent value="expenses">
                <TravelExpensesLayout travel={travel} />
            </TabsContent>
            <TabsContent value="documents">
                <TravelDocumentsLayout travel={travel} />
            </TabsContent>
        </Tabs>
    );
}

export default TravelShowContent;