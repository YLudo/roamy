import { useCallback, useEffect, useState, useTransition } from "react";
import TravelDocumentsForm from "./travel-documents-form";
import { getDocuments } from "@/actions/documents";
import { toast } from "@/hooks/use-toast";
import { pusherClient } from "@/lib/pusher";
import TravelDocumentsList from "./travel-documents-list";

const TravelDocumentsLayout = ({ travel }: { travel: ITravel }) => {
    const [documents, setDocuments] = useState<IDocument[]>([]);
    const [isPending, startTransition] = useTransition();

    const fetchDocuments = useCallback(() => {
        startTransition(async () => {
            const result = await getDocuments(travel.id);

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
    }, [travel.id]);

    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments]);

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
                <TravelDocumentsList isLoading={isPending} documents={documents} />
            </div>
        </div>
    )
}

export default TravelDocumentsLayout;