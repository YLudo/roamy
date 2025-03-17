import { deleteDocument } from "@/actions/documents";
import DeletionModal from "@/components/application/deletion-modal";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { Download, MoreVertical, Pencil, Trash } from "lucide-react";
import { useState, useTransition } from "react";

interface TravelDocumentCardProps {
    document: IDocument;
}

const TravelDocumentCard = ({ document }: TravelDocumentCardProps) => {
    const { title, description } = document;

    const [isDeletingModalOpen, setIsDeletingModalOpen] = useState<boolean>(false);
    const [isPending, startTransition] = useTransition();

    const handleDelete = async () => {
        startTransition(async () => {
            const result = await deleteDocument(document.travelId, document.id);

            if (result.error) {
                toast({
                    variant: "destructive",
                    title: "Suppression du document échouée !",
                    description: result.error,
                });
            } else {
                toast({
                    title: "Suppression du document réussie !",
                    description: "Votre document a été supprimé avec succès.",
                });
                setIsDeletingModalOpen(false);
            }
        })
    }

    return (
        <>
            <Card className="flex flex-col">
                <CardHeader className="flex-grow">
                    <div className="flex justify-between">
                        <div>
                            <CardTitle>{title}</CardTitle>
                            {description && <CardDescription>{description}</CardDescription>}
                        </div>
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
                                >
                                    <Pencil className="mr-2 h-4 w-4" />
                                    <span>Modifier</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="text-destructive focus:bg-destructive focus:text-white cursor-pointer"
                                    onClick={() => setIsDeletingModalOpen(true)}
                                >
                                    <Trash className="mr-2 h-4 w-4" />
                                    <span>Supprimer</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardHeader>
                <CardFooter>
                    <Button
                        className="w-full"
                        aria-label={`Télécharger ${title}`}
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Télécharger
                    </Button>
                </CardFooter>
            </Card>
            {isDeletingModalOpen && (
                <DeletionModal
                    isOpen={isDeletingModalOpen}
                    title="Confirmer la suppression du document"
                    description="Êtes-vous sûr de vouloir supprimer ce document ? Cette action est irréversible."
                    isLoading={isPending}
                    onConfirm={handleDelete}
                    onCancel={() => setIsDeletingModalOpen(false)}
                />
            )}
        </>
    );
}

export default TravelDocumentCard;