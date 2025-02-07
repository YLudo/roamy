import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Dispatch, SetStateAction } from "react";
import TravelExpensesEditForm from "./travel-expenses-edit-form";

interface TravelExpensesEditModalProps {
    expense: IExpense;
    isEditModalOpen: boolean;
    setIsEditModalOpen: Dispatch<SetStateAction<boolean>>;
}

const TravelExpensesEditModal = ({
    expense,
    isEditModalOpen,
    setIsEditModalOpen,
}: TravelExpensesEditModalProps) => {
    return (
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Modifier la dépense</DialogTitle>
                    <DialogDescription>
                        Remplacez les détails de votre dépense ci-dessous.
                    </DialogDescription>
                </DialogHeader>
                <TravelExpensesEditForm expense={expense} setIsEditModalOpen={setIsEditModalOpen} />
            </DialogContent>
        </Dialog>
    );
}

export default TravelExpensesEditModal;