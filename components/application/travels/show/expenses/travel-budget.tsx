import { getTotalExpenses } from "@/actions/expenses";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { pusherClient } from "@/lib/pusher";
import { useCallback, useEffect, useState, useTransition } from "react";

const TravelBudget = ({ travelId }: { travelId: string }) => {
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
                setTotalExpenses(result.data.total);
            }
        })
    }, [travelId]);
    
    useEffect(() => {
        fetchTotalExpenses();
    }, [fetchTotalExpenses, travelId]);

    useEffect(() => {
        const channelName = `travel-${travelId}`;
        const channel = pusherClient.subscribe(channelName);
        
        channel.bind("travel:new-expense", (newExpense: IExpense) => setTotalExpenses((prev) => prev + newExpense.amount));
        channel.bind("travel:delete-expense", (expense: IExpense) => setTotalExpenses((prev) => prev - expense.amount));
        channel.bind("travel:update-expense", (data: { expense: IExpense, updatedExpense: IExpense }) => {
            setTotalExpenses((prev) => prev - data.expense.amount + data.updatedExpense.amount);
        });
        
        return () => {
            pusherClient.unbind_all();
            pusherClient.unsubscribe(channelName);
        }
    }, [fetchTotalExpenses, travelId]);

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

export default TravelBudget;