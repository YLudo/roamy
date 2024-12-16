import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface TravelCardProps {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    destination: string;
    image: string;
    status: string;
    participants: number;
}

const TravelCard = ({ name, startDate, endDate, destination, image, status, participants }: TravelCardProps) => {
    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>{name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{destination}</p>
                    </div>
                    <Badge>
                        {status}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-center space-x-4 mb-4">
                    <Image src={image} alt={name} width={100} height={100} className="rounded-md" />
                    <div>
                        <p className="text-sm">Du {new Date(startDate).toLocaleDateString()} au {new Date(endDate).toLocaleDateString()}</p>
                        <p className="text-sm">{participants} participants</p>
                    </div>
                </div>
                <Button className="w-full"><ExternalLink /> Voir le voyage</Button>
            </CardContent>
        </Card>
    );
}

export default TravelCard;