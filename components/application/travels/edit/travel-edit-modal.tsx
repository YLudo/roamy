import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pencil } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import TravelEditForm from "./travel-edit-form";

interface TravelEditModalProps {
    travel: ITravel;
    isEditModalOpen: boolean;
    setIsEditModalOpen: Dispatch<SetStateAction<boolean>>;
}

const TravelEditModal = ({
    travel,
    isEditModalOpen,
    setIsEditModalOpen,
}: TravelEditModalProps) => {
    return (
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogTrigger asChild>
                <Button
                    className="w-full"
                    variant="secondary"
                >
                    <Pencil className="mr-2 h-4 w-4" /> Modifier
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Modifier le voyage</DialogTitle>
                    <DialogDescription>
                        Remplacez les détails de votre voyage ci-dessous.
                    </DialogDescription>
                </DialogHeader>
                <TravelEditForm travel={travel} setIsEditModalOpen={setIsEditModalOpen} />
            </DialogContent>
        </Dialog>
    );
}

export default TravelEditModal;