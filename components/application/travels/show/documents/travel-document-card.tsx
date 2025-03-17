import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Download, MoreVertical, Pencil, Trash } from "lucide-react";

interface TravelDocumentCardProps {
    document: IDocument;
}

const TravelDocumentCard = ({ document }: TravelDocumentCardProps) => {
    const { title, description } = document;

    return (
        <Card className="flex flex-col">
            <CardHeader className="flex-grow">
                <div className="flex justify-between">
                    <div>
                        <CardTitle>{title}</CardTitle>
                        {description && <CardDescription>{description}</CardDescription>}
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Ouvrir le menu</span>
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                className="cursor-pointer"
                            >
                                <Pencil className="mr-2 h-4 w-4" />
                                <span>Modifier</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="text-destructive focus:bg-destructive focus:text-white cursor-pointer"
                            >
                                <Trash className="mr-2 h-4 w-4" />
                                <span>Supprimer</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
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