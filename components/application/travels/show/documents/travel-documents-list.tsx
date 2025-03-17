import { Skeleton } from "@/components/ui/skeleton";
import TravelDocumentCard from "./travel-document-card";

interface TravelDocumentsListProps {
    isLoading: boolean;
    documents: IDocument[];
};

const TravelDocumentsList = ({ isLoading, documents }: TravelDocumentsListProps) => {
    if (isLoading) {
        return <Skeleton className="lg:col-span-2 h-[150px] w-full rounded-xl" />
    }

    if (documents.length <= 0) {
        return (
            <div className="lg:col-span-2 h-fit text-center py-8 bg-muted rounded-lg">
                <p className="text-muted-foreground">Vous n'avez pas encore de documents !</p>
                <p className="text-muted-foreground">Veuillez ajouter un document pour commencer.</p>
            </div>
        );
    }

    return (
        <div className="grid md:grid-cols-2 gap-4">
            {documents.map((document, index) => (
                <TravelDocumentCard key={index} document={document} />
            ))}
        </div>
    );
}

export default TravelDocumentsList;