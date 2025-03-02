import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getActivityStatus } from "@/lib/utils";
import { Calendar, Info, MapPin } from "lucide-react";

interface TravelActivityCardProps {
    activity: IActivity;
};

const TravelActivityCard = ({ activity }: TravelActivityCardProps) => {
    const { title, description, date, address } = activity;
    const { statusColor, statusLabel } = getActivityStatus(date!);

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>{title}</CardTitle>
                    <Badge variant={statusColor}>{statusLabel}</Badge>
                </div>
            </CardHeader>
            <CardContent className="text-sm space-y-4">
                <div className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-primary" />
                    <p>{description || "Aucune description spécifiée"}</p>
                </div>
                <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <p>{address || "Aucune adresse spécifiée"}</p>
                </div>
                <div className="flex items-start gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <p>{date || "Aucune date spécifiée"}</p>
                </div>
            </CardContent>
        </Card>
    );
}

export default TravelActivityCard;