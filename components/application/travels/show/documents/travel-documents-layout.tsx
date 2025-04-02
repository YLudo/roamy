import { useCallback, useEffect, useState, useTransition } from "react";
import TravelDocumentsForm from "./travel-documents-form";
import { getDocuments } from "@/actions/documents";
import { toast } from "@/hooks/use-toast";
import { pusherClient } from "@/lib/pusher";
import TravelDocumentsList from "./travel-documents-list";
import TravelDocumentsFilters from "./travel-documents-filters";
import PaginationLayout from "@/components/application/pagination-layout";

const TravelDocumentsLayout = ({ travel }: { travel: ITravel }) => {
    const [documents, setDocuments] = useState<IDocument[]>([]);
    const [isPending, startTransition] = useTransition();

    const [filters, setFilters] = useState<DocumentsFilters>({
        title: "",
    });

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const itemsPerPage = 1;

    const fetchDocuments = useCallback(() => {
        const { title } = filters;

        startTransition(async () => {
            const result = await getDocuments(travel.id, title, currentPage, itemsPerPage);

            if (result.error) {
                toast({
                    variant: "destructive",
                    title: "Oups !",
                    description: result.error,
                });
            } else if (result.data) {
                setDocuments(result.data.documents);
                setTotalPages(result.data.totalPages);
            }
        })
    }, [filters, travel.id, currentPage]);

    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments, filters]);

    useEffect(() => {
        const channelName = `travel-${travel.id}`;
        const channel = pusherClient.subscribe(channelName);

        channel.bind("travel:new-document", () => fetchDocuments());
        channel.bind("travel:update-document", (data: { document: IDocument, updatedDocument: IDocument }) => {
            setDocuments((prev) => prev.map(document =>
                document.id === data.updatedDocument.id ? data.updatedDocument : document
            ));
        });

        channel.bind("travel:delete-document", (document: IDocument) => {
            setDocuments((prev) => prev.filter((d) => d.id !== document.id));
        });

        return () => {
            pusherClient.unbind("travel:new-document");
            pusherClient.unbind("travel:update-document");
            pusherClient.unbind("travel:delete-document");
            pusherClient.unsubscribe(channelName);
        }
    }, [fetchDocuments, travel.id]);

    return (
        <div className="mt-4 grid lg:grid-cols-3 gap-4">
            <TravelDocumentsForm travelId={travel.id} />
            <div className="lg:col-span-2">
                <TravelDocumentsFilters filters={filters} setFilters={setFilters} />
                <TravelDocumentsList isLoading={isPending} documents={documents} />
                <PaginationLayout
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            </div>
        </div>
    )
}

export default TravelDocumentsLayout;