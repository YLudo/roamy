import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Calendar, Info, MapPin, MoreVertical, Pencil, Trash } from "lucide-react";
import { useState, useTransition } from "react";
import TravelActivitiesEditModal from "./edit/travel-activities-edit-modal";
import { deleteActivity } from "@/actions/activities";
import { toast } from "@/hooks/use-toast";
import DeletionModal from "@/components/application/deletion-modal";

interface TravelActivityCardProps {
    activity: IActivity;
};

const TravelActivityCard = ({ activity }: TravelActivityCardProps) => {
    const { title, description, date, address } = activity;

    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [isDeletingModalOpen, setIsDeletingModalOpen] = useState<boolean>(false);
    const [isPending, startTransition] = useTransition();

    const handleDelete = async () => {
        startTransition(async () => {
            const result = await deleteActivity(activity.travelId, activity.id);

            if (result.error) {
                toast({
                    variant: "destructive",
                    title: "Suppression de l'activité échouée !",
                    description: result.error,
                });
            } else {
                toast({
                    title: "Suppression de l'activité réussie !",
                    description: "Votre activité a été supprimée avec succès.",
                });
                setIsDeletingModalOpen(false);
            }
        });
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex justify-between">
                        <div>
                            <CardTitle className="text-xl font-bold">{title}</CardTitle>
                            {description && <CardDescription className="line-clamp-2 mt-1">{description}</CardDescription>}
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
                    {address && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <MapPin className="h-4 w-4 flex-shrink-0 text-primary" />
                            <span className="truncate">{address}</span>
                        </div>
                    )}

                    {date && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 flex-shrink-0 text-primary" />
                            <span>
                                {new Date(date).toLocaleDateString("fr-FR", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </span>
                        </div>
                    )}
                </CardContent>
                {!description && !address && !date && (
                    <CardFooter className="pt-0 text-sm text-muted-foreground italic">
                        <Info className="h-4 w-4 mr-2 text-primary" />
                        Aucune information supplémentaire
                    </CardFooter>
                )}
            </Card>
            {isEditModalOpen && (
                <TravelActivitiesEditModal
                    activity={activity}
                    isEditModalOpen={isEditModalOpen}
                    setIsEditModalOpen={setIsEditModalOpen}
                />
            )}
            {isDeletingModalOpen && (
                <DeletionModal
                    isOpen={isDeletingModalOpen}
                    title="Confirmer la suppression de l'activité"
                    description="Êtes-vous sûr de vouloir supprimer cette activité ? Cette action est irréversible."
                    isLoading={isPending}
                    onConfirm={handleDelete}
                    onCancel={() => setIsDeletingModalOpen(false)}
                />
            )}
        </>
    );
}

export default TravelActivityCard;