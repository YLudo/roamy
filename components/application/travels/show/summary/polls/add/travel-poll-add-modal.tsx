import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Dispatch, SetStateAction } from "react";
import TravelPollAddForm from "./travel-poll-add-form";

interface TravelPollAddModalProps {
    travelId: string;
    isAddModalOpen: boolean;
    setIsAddModalOpen: Dispatch<SetStateAction<boolean>>;
}

const TravelPollAddModal = ({
    travelId,
    isAddModalOpen,
    setIsAddModalOpen
}: TravelPollAddModalProps) => {
    return (
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Ajouter un sondage</DialogTitle>
                    <DialogDescription>
                        Remplissez les détails du sondage ci-dessous.
                    </DialogDescription>
                </DialogHeader>
                <TravelPollAddForm travelId={travelId} setIsAddModalOpen={setIsAddModalOpen} />
            </DialogContent>
        </Dialog>
    );
}

export default TravelPollAddModal;