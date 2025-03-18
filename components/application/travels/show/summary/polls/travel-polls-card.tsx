import { getPolls } from "@/actions/polls";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { useCallback, useEffect, useState, useTransition } from "react";
import TravelPollsList from "./travel-polls-list";

const TravelPollsCard = ({ travelId }: { travelId: string }) => {
    const [polls, setPolls] = useState<IPoll[]>([]);
    const [isPending, startTransition] = useTransition();

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

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Sondages du voyage</CardTitle>
                        <CardDescription>Votez ou decidez ensemble des activités</CardDescription>
                    </div>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Nouveau sondage
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <TravelPollsList isLoading={isPending} polls={polls} />
            </CardContent>
        </Card>
    );
}

export default TravelPollsCard;