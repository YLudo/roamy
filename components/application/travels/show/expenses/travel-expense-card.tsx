import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCategoryLabel } from "@/lib/utils";

const TravelExpenseCard = ({ expense }: { expense: IExpense }) => {
    const { title, category, amount, date } = expense;

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>{title}</CardTitle>
                    <Badge>{getCategoryLabel(category)}</Badge>
                </div>
            </CardHeader>
            <CardContent>
            <p className="text-2xl font-bold">{amount.toFixed(2)} €</p>
            <p className="text-sm text-muted-foreground">
                {date ? (
                    new Date(date).toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
                ) : (
                    "Date non spécifié"
                )}
            </p>
            </CardContent>
        </Card>
    );
}

export default TravelExpenseCard;