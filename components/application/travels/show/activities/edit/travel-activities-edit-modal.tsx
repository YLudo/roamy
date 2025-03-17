import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Dispatch, SetStateAction } from "react";
import TravelActivitiesEditForm from "./travel-activities-edit-form";

interface TravelActivitiesEditModalProps {
    activity: IActivity;
    isEditModalOpen: boolean;
    setIsEditModalOpen: Dispatch<SetStateAction<boolean>>;
}

const TravelActivitiesEditModal = ({
    activity,
    isEditModalOpen,
    setIsEditModalOpen,
}: TravelActivitiesEditModalProps) => {
    return (
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Modifier l'activité</DialogTitle>
                    <DialogDescription>
                        Remplacez les détails de votre activité ci-dessous.
                    </DialogDescription>
                </DialogHeader>
                <TravelActivitiesEditForm activity={activity} setIsEditModalOpen={setIsEditModalOpen} />
            </DialogContent>
        </Dialog>
    );
}

export default TravelActivitiesEditModal;