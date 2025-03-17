import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from "lucide-react";

interface TravelDocumentCardProps {
    document: IDocument;
}

const TravelDocumentCard = ({ document }: TravelDocumentCardProps) => {
    const { title, description } = document;

    return (
        <Card className="flex flex-col">
            <CardHeader className="flex-grow">
                <CardTitle>{title}</CardTitle>
                {description && <CardDescription>{description}</CardDescription>}
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
    );
}

export default TravelDocumentCard;