import { deleteExpense } from "@/actions/expenses";
import DeletionModal from "@/components/application/deletion-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { getCategoryIcon } from "@/lib/utils";
import { MoreVertical, Pencil, Trash } from "lucide-react";
import { useState, useTransition } from "react";
import TravelExpensesEditModal from "./edit/travel-expenses-edit-modal";

const TravelExpenseCard = ({ expense }: { expense: IExpense }) => {
    const { title, category, amount, date } = expense;
    const Icon = getCategoryIcon(category);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeletingModalOpen, setIsDeletingModalOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleDelete = async () => {
        startTransition(async () => {
            const result = await deleteExpense(expense.travelId, expense.id);

            if (result.error) {
                toast({
                    variant: "destructive",
                    title: "Suppression de la dépense échouée !",
                    description: result.error,
                });
            } else {
                toast({
                    title: "Suppression de la dépense réussie !",
                    description: "Votre dépense a été supprimée avec succès.",
                });
                setIsDeletingModalOpen(false);
            }
        });
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">{Icon && <Icon className="w-5 h-5 text-primary" />}{title}</CardTitle>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Ouvrir le menu</span>
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() => setIsEditModalOpen(true)}
                                >
                                    <Pencil className="mr-2 h-4 w-4" />
                                    <span>Modifier</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                    className="text-destructive focus:bg-destructive focus:text-white hover:cursor-pointer"
                                    onClick={() => setIsDeletingModalOpen(true)}
                                >
                                    <Trash className="mr-2 h-4 w-4" />
                                    <span>Supprimer</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">{amount.toFixed(2)} €</p>
                    <p className="text-sm text-muted-foreground">
                        {date ? (
                            new Date(date).toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
                        ) : (
                            "Date non spécifié"
                        )}
                    </p>
                </CardContent>
            </Card>
            {isEditModalOpen && (
                <TravelExpensesEditModal 
                    expense={expense} 
                    isEditModalOpen={isEditModalOpen}
                    setIsEditModalOpen={setIsEditModalOpen}
                />
            )}
            {isDeletingModalOpen && (
                <DeletionModal
                    isOpen={isDeletingModalOpen}
                    title="Confirmer la suppression de la dépense"
                    description="Êtes-vous sûr de vouloir supprimer cette dépense ? Cette action est irréversible."
                    isLoading={isPending}
                    onConfirm={handleDelete}
                    onCancel={() => setIsDeletingModalOpen(false)}
                />
            )}
        </>
    );
}

export default TravelExpenseCard;