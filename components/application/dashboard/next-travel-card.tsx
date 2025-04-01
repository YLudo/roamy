"use client";

import { getNextTravel } from "@/actions/dashboard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { Calendar, ExternalLink, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";

const NextTravelCard = () => {
    const [travel, setTravel] = useState<ITravel | null>(null);
    const [isPending, startTransition] = useTransition();

    const router = useRouter();

    const fetchNextTravel = useCallback(() => {
        startTransition(async () => {
            const result = await getNextTravel();

            if (result.error) {
                toast({
                    variant: "destructive",
                    title: "Oups !",
                    description: result.error,
                });
            } else if (result.data) {
                setTravel(result.data);
            }
        })
    }, []);

    useEffect(() => {
        fetchNextTravel();
    }, [fetchNextTravel]);

    if (isPending) {
        return <Skeleton className="h-[200px] w-full rounded-xl" />
    }

    if (!travel) {
        return (
            <Card>
                <CardContent className="text-center space-y-4 pt-6">
                    <div className="space-y-2">
                        <p className="font-bold">Aucun voyage à venir !</p>
                        <p className="text-muted-foreground">Planifiez votre prochain voyage pour le voir apparaître ici.</p>
                    </div>
                    <Button className="w-full" onClick={() => router.push("/travels")}>Créer un voyage</Button>
                </CardContent>
            </Card>
        );
    }
    
    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-semibold">{travel.title}</CardTitle>
                    <Badge className="text-xs px-2 py-1">Prochain voyage</Badge>
                </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-6">
                <div className="space-y-2">
                    {travel.startDate && travel.endDate ? (
                        <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                            <p>
                                Du {new Date(travel.startDate).toLocaleDateString()} au {new Date(travel.endDate).toLocaleDateString()}
                            </p>
                        </div>
                    ) : (
                        <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                            <p className="italic">Date non définie</p>
                        </div>
                    )}
                    <div className="flex items-center text-sm font-medium">
                        <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                        <p>{travel.participants ? travel.participants.length + 1 : 1} participant{travel.participants && travel.participants.length > 0 ? "s" : ""}</p>
                    </div>
                </div>
                <Button className="w-full" onClick={() => router.push(`/travels/${travel.id}`)}>
                    <ExternalLink /> Voir le voyage
                </Button>
            </CardContent>
        </Card>
    );
}

export default NextTravelCard;