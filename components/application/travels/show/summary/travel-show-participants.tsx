"use client";

import { deleteParticipant, getParticipants, inviteParticipant } from "@/actions/participants";
import DeletionModal from "@/components/application/deletion-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { pusherClient } from "@/lib/pusher";
import { Loader2, X } from "lucide-react";
import { useCallback, useEffect, useState, useTransition } from "react";

const TravelShowParticipants = ({ travelId }: { travelId: string }) => {
    const [participants, setParticipants] = useState<{ id: string, name: string }[]>([]);
    const [newParticipant, setNewParticipant] = useState<string>("");

    const [isDeletingModalOpen, setIsDeletingModalOpen] = useState<boolean>(false);
    const [isParticipantToDelete, setIsParticipantToDelete] = useState<string | null>(null);

    const [isPending, startTransition] = useTransition();

    const fetchParticipants = useCallback(() => {
        startTransition(async () => {
            const result = await getParticipants(travelId);
    
            if (result.error) {
                toast({
                    variant: "destructive",
                    title: "Oups !",
                    description: result.error,
                });
            } else if (result.data) {
                setParticipants(result.data);
            }
        })
    }, [travelId]);
    
    useEffect(() => {
        fetchParticipants();
    }, [fetchParticipants]);

    useEffect(() => {
        const channelName = `travel-${travelId}`;
        const channel = pusherClient.subscribe(channelName);
    
        channel.bind("travel:new-participant", (participant: IParticipant) => {
            setParticipants((prev) => [...prev, {
                id: participant.userId,
                name: participant.user.name,
            }]);
        });

        channel.bind("travel:delete-participant", (participantId: string) => {
            setParticipants((prev) => prev.filter((participant) => participant.id !== participantId));
        });
    
        return () => {
            pusherClient.unbind("travel:delete-participant");
            pusherClient.unbind("travel:new-participant");
            pusherClient.unsubscribe(channelName);
        }
    }, [fetchParticipants, travelId])

    const handleAddParticipant = async () => {
        startTransition(async () => {
            const result = await inviteParticipant(travelId, newParticipant);

            if (result.error) {
                toast({
                    variant: "destructive",
                    title: "Invitation du participant échoué !",
                    description: result.error,
                });
            } else if (result.data) {
                toast({
                    title: "Invitation du participant réussi !",
                    description: "La participant a été invité avec succès.",
                });
                setNewParticipant("");
            }
        });
    };

    const handleDeleteParticipant = async () => {
        if (!isParticipantToDelete) return;

        startTransition(async () => {
            const result = await deleteParticipant(travelId, isParticipantToDelete);

            if (result.error) {
                toast({
                    variant: "destructive",
                    title: "Suppression du participant échouée !",
                    description: result.error,
                });
            } else if (result.data) {
                toast({
                    title: "Suppression du participant réussie !",
                    description: "La participant a été supprimé avec succès.",
                });
                setIsDeletingModalOpen(false);
                setIsParticipantToDelete(null);
            }
        });
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Liste des participants</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {participants.length > 0 ? (
                        <div className="flex items-center gap-4 flex-grow">
                            {participants.map((participant, index) => (
                                <Badge key={index} variant="secondary">
                                    {participant.name}
                                    <X 
                                        className="h-2 w-2 ml-2 cursor-pointer" 
                                        onClick={() => {
                                            setIsParticipantToDelete(participant.id);
                                            setIsDeletingModalOpen(true);
                                        }}
                                    />
                                </Badge>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">Il semblerait que vous soyez tout seul ici.</p>
                    )}
                    <div className="flex items-center gap-4">
                        <Input
                            type="text"
                            placeholder="Adresse e-mail du participant"
                            value={newParticipant}
                            onChange={(e) => setNewParticipant(e.target.value)}
                        />
                        <Button
                            onClick={handleAddParticipant}
                            disabled={isPending}
                        >
                            {isPending ? (
                                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                            ) : (
                                "Ajouter"
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
            {isDeletingModalOpen && (
                <DeletionModal
                    isOpen={isDeletingModalOpen}
                    title="Confirmer la suppression du participant"
                    description="Êtes-vous sûr de vouloir supprimer ce participant ? Cette action est irréversible."
                    isLoading={isPending}
                    onConfirm={handleDeleteParticipant}
                    onCancel={() => setIsDeletingModalOpen(false)}
                />
            )}
        </>
    );
}

export default TravelShowParticipants;