"use client";

import { getInvitations } from "@/actions/participants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { pusherClient } from "@/lib/pusher";
import { Calendar, Check, User, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState, useTransition } from "react";

const InvitationsCard = () => {
    const { data: session } = useSession();
    const [invitations, setInvitations] = useState<IInvitation[]>([]);
    const [isPending, startTransition] = useTransition();

    const fetchInvitations = useCallback(() => {
        startTransition(async () => {
            const result = await getInvitations();

            if (result.error) {
                toast({
                    variant: "destructive",
                    title: "Oups !",
                    description: result.error,
                });
            } else if (result.data) {
                setInvitations(result.data);
            }
        })
    }, []);

    useEffect(() => {
        fetchInvitations();
    }, [fetchInvitations]);

    useEffect(() => {
        if (!session?.user?.id) return;

        const channelName = `user-${session.user.id}`;
        const channel = pusherClient.subscribe(channelName);

        channel.bind("invitations:new", () => fetchInvitations());

        return () => {
            pusherClient.unbind("invitations:new");
            pusherClient.unsubscribe(channelName);
        };
    }, [fetchInvitations, session?.user?.id]);

    if (isPending) {
        return <Skeleton className="h-[400px] w-full rounded-xl" />
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Invitations aux voyages</CardTitle>
                    <Badge>{invitations.length || 0}</Badge>
                </div>
            </CardHeader>
            <CardContent>
                {invitations.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">Aucune invitation en attente</p>
                ) : (
                    <ScrollArea className="max-h-[400px]">
                        <div className="space-y-4">
                            {invitations.map((invitation) => (
                                <div key={invitation.id} className="border rounded-lg p-4">
                                    <div className="space-y-4">
                                        <h3 className="font-medium">{invitation.travel?.title}</h3>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4 text-primary" />
                                                <span>Invité par {invitation.inviter.name}</span>
                                            </div>
                                            {invitation.travel?.startDate && invitation.travel.endDate && (
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-primary" />
                                                    <span>De {new Date(invitation.travel.startDate).toLocaleDateString()} à {new Date(invitation.travel.endDate).toLocaleDateString()}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex gap-2 justify-end">
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                            >
                                                <X className="h-4 w-4" />
                                                Refuser
                                            </Button>
                                            <Button
                                                size="sm"
                                            >
                                                <Check className="h-4 w-4" />
                                                Accepter
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                )}
            </CardContent>
        </Card>
    );
}

export default InvitationsCard;