"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTravelStatus } from "@/lib/utils";
import { Calendar, ExternalLink, Pencil, Trash, Users } from "lucide-react";
import { useRouter } from "next/navigation";

interface TravelCardProps {
    travel: ITravel;
    showActions?: boolean;
}

const TravelCard = ({ travel, showActions }: TravelCardProps) => {
    const { id, title, startDate, endDate } = travel;
    const { statusLabel, statusColor } = getTravelStatus(startDate!, endDate!);

    const router = useRouter();

    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-semibold">{title}</CardTitle>
                    <Badge variant={statusColor} className="text-xs px-2 py-1">{statusLabel}</Badge>
                </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-6">
                <div className="space-y-2">
                    {startDate && endDate ? (
                        <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                            <p>
                                Du {new Date(startDate).toLocaleDateString()} au {new Date(endDate).toLocaleDateString()}
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
                        <p>1 participant</p>
                    </div>
                </div>
                {showActions ? (
                    <div className="flex gap-4">
                        <Button
                            className="w-full"
                            variant="secondary"
                        >
                            <Pencil className="mr-2 h-4 w-4" /> Modifier
                        </Button>
                        <Button
                            className="w-full"
                            variant="destructive"
                        >
                            <Trash className="mr-2 h-4 w-4" /> Supprimer
                        </Button>
                    </div>
                ) : (
                    <Button className="w-full" onClick={() => router.push(`/travels/${id}`)}>
                        <ExternalLink /> Voir le voyage
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}

export default TravelCard;