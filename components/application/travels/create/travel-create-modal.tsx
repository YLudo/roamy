import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Dispatch, SetStateAction } from "react";
import TravelCreateForm from "./travel-create-form";

interface TravelCreateModalProps {
    isCreateModalOpen: boolean;
    setIsCreateModalOpen: Dispatch<SetStateAction<boolean>>;
}

const TravelCreateModal = ({
    isCreateModalOpen,
    setIsCreateModalOpen,
}: TravelCreateModalProps) => {
    return (
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
                <Button>Créer un voyage</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Créer un nouveau voyage</DialogTitle>
                    <DialogDescription>
                        Remplissez les détails de votre nouveau voyage ci-dessous.
                    </DialogDescription>
                </DialogHeader>
                <TravelCreateForm setIsCreateModalOpen={setIsCreateModalOpen} />
            </DialogContent>
        </Dialog>
    );
}

export default TravelCreateModal;