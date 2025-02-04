import { getTotalExpenses } from "@/actions/expenses";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useCallback, useEffect, useState, useTransition } from "react";

const TravelShowBudget = ({ travelId }: { travelId: string }) => {
    const [totalExpenses, setTotalExpenses] = useState<number>(0.00);

    const [isPending, startTransition] = useTransition();

    const fetchTotalExpenses = useCallback(() => {
        startTransition(async () => {
            const result = await getTotalExpenses(travelId);
    
            if (result.error) {
                toast({
                    variant: "destructive",
                    title: "Oups !",
                    description: result.error,
                });
            } else if (result.data) {
                setTotalExpenses(result.data.totalExpenses);
            }
        })
    }, [travelId]);
    
    useEffect(() => {
        fetchTotalExpenses();
    }, [fetchTotalExpenses]);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-center">Total des dépenses</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
                {isPending ? (
                    <p className="font-bold text-4xl">Chargement...</p>
                ) : (
                    <p className="font-bold text-4xl">{totalExpenses.toFixed(2)}€</p>
                )}
            </CardContent>
        </Card>
    );
}

export default TravelShowBudget;