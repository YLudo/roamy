import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeletionModalProps {
    isOpen: boolean;
    title: string;
    description: string;
    isLoading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
};

const DeletionModal = ({
    isOpen,
    title,
    description,
    isLoading = false,
    onConfirm,
    onCancel,
}: DeletionModalProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onCancel}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <p>{description}</p>
                <DialogFooter className="mt-4 flex justify-end gap-2">
                    <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
                        Annuler
                    </Button>
                    <Button variant="destructive" onClick={onConfirm} disabled={isLoading}>
                        {isLoading ? "Suppression..." : "Supprimer"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
export default DeletionModal;