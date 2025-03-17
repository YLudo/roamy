import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from "lucide-react";

interface TravelDocumentCardProps {
    document: IDocument;
}

const TravelDocumentCard = ({ document }: TravelDocumentCardProps) => {
    const { title } = document;

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
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