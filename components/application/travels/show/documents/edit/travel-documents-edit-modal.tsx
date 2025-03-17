import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Dispatch, SetStateAction } from "react";
import TravelDocumentsEditForm from "./travel-documents-edit-form";

interface TravelDocumentsEditModalProps {
    document: IDocument;
    isEditModalOpen: boolean;
    setIsEditModalOpen: Dispatch<SetStateAction<boolean>>;
}

const TravelDocumentsEditModal = ({
    document,
    isEditModalOpen,
    setIsEditModalOpen,
}: TravelDocumentsEditModalProps) => {
    return (
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Modifier le document</DialogTitle>
                    <DialogDescription>
                        Remplacez les détails de votre document ci-dessous.
                    </DialogDescription>
                </DialogHeader>
                <TravelDocumentsEditForm document={document} setIsEditModalOpen={setIsEditModalOpen} />
            </DialogContent>
        </Dialog>
    );
}

export default TravelDocumentsEditModal;