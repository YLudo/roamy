import { getPolls } from "@/actions/polls";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { useCallback, useEffect, useState, useTransition } from "react";
import TravelPollsList from "./travel-polls-list";
import TravelPollAddModal from "./add/travel-poll-add-modal";
import { pusherClient } from "@/lib/pusher";

const TravelPollsCard = ({ travelId }: { travelId: string }) => {
    const [polls, setPolls] = useState<IPoll[]>([]);
    const [isPending, startTransition] = useTransition();
    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

    const fetchPolls = useCallback(() => {
        startTransition(async () => {
            const result = await getPolls(travelId);

            if (result.error) {
                toast({
                    variant: "destructive",
                    title: "Oups !",
                    description: result.error,
                });
            } else if (result.data) {
                setPolls(result.data);
            }
        })
    }, [travelId]);

    useEffect(() => {
        fetchPolls();
    }, [fetchPolls]);

    useEffect(() => {
        const channelName = `travel-${travelId}`
        const channel = pusherClient.subscribe(channelName);

        channel.bind("travel:new-poll", () => fetchPolls());
        channel.bind("travel:new-vote", () => fetchPolls());
        channel.bind("travel:vote-updated", () => fetchPolls());
        channel.bind("travel:delete-poll", () => fetchPolls());

        return () => {
            pusherClient.unbind("travel:new-poll");
            pusherClient.unbind("travel:new-vote");
            pusherClient.unbind("travel:vote-updated");
            pusherClient.unbind("travel:delete-poll");
            pusherClient.unsubscribe(channelName);
        }
    }, [fetchPolls, travelId]);

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Sondages du voyage</CardTitle>
                            <CardDescription>Votez ou decidez ensemble des activités</CardDescription>
                        </div>
                        <Button
                            onClick={() => setIsAddModalOpen(true)}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Nouveau sondage
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <TravelPollsList isLoading={isPending} polls={polls} />
                </CardContent>
            </Card>
            {isAddModalOpen && (
                <TravelPollAddModal travelId={travelId} isAddModalOpen={isAddModalOpen} setIsAddModalOpen={setIsAddModalOpen} />
            )}
        </>
    );
}

export default TravelPollsCard;