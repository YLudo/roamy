import { useCallback, useEffect, useState, useTransition } from "react";
import TravelDocumentsForm from "./travel-documents-form";
import { getDocuments } from "@/actions/documents";
import { toast } from "@/hooks/use-toast";
import { pusherClient } from "@/lib/pusher";
import TravelDocumentsList from "./travel-documents-list";
import TravelDocumentsFilters from "./travel-documents-filters";

const TravelDocumentsLayout = ({ travel }: { travel: ITravel }) => {
    const [documents, setDocuments] = useState<IDocument[]>([]);
    const [isPending, startTransition] = useTransition();

    const [filters, setFilters] = useState<DocumentsFilters>({
        title: "",
    });

    const fetchDocuments = useCallback(() => {
        const { title } = filters;

        startTransition(async () => {
            const result = await getDocuments(travel.id, title);

            if (result.error) {
                toast({
                    variant: "destructive",
                    title: "Oups !",
                    description: result.error,
                });
            } else if (result.data) {
                setDocuments(result.data);
            }
        })
    }, [filters, travel.id]);

    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments, filters]);

    useEffect(() => {
        const channelName = `travel-${travel.id}`;
        const channel = pusherClient.subscribe(channelName);

        channel.bind("travel:new-document", () => fetchDocuments());

        return () => {
            pusherClient.unbind("travel:new-document");
            pusherClient.unsubscribe(channelName);
        }
    }, [fetchDocuments, travel.id]);

    return (
        <div className="mt-4 grid lg:grid-cols-3 gap-4">
            <TravelDocumentsForm travelId={travel.id} />
            <div className="lg:col-span-2">
                <TravelDocumentsFilters filters={filters} setFilters={setFilters} />
                <TravelDocumentsList isLoading={isPending} documents={documents} />
            </div>
        </div>
    )
}

export default TravelDocumentsLayout;