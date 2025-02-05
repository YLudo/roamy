import { getExpenses } from "@/actions/expenses";
import { toast } from "@/hooks/use-toast";
import { useCallback, useEffect, useState, useTransition } from "react";
import TravelExpenseCard from "./travel-expense-card";
import { Skeleton } from "@/components/ui/skeleton";
import { pusherClient } from "@/lib/pusher";

const TravelExpensesList = ({ travelId }: { travelId: string }) => {
    const [expenses, setExpenses] = useState<IExpense[]>([]);
    const [isPending, startTransition] = useTransition();
    
    const fetchExpenses = useCallback(() => {
        startTransition(async () => {
            const result = await getExpenses(travelId);
            
            if (result.error) {
                toast({
                    variant: "destructive",
                    title: "Oups !",
                    description: result.error,
                });
            } else if (result.data) {
                setExpenses(result.data.map(expense => ({
                    ...expense,
                    date: expense.date ? new Date(expense.date).toISOString() : null
                })));
            }
        })
    }, []);

    useEffect(() => {
        fetchExpenses();
    }, [fetchExpenses]);

     useEffect(() => {
            const channelName = `travel-${travelId}`;
            const channel = pusherClient.subscribe(channelName);
            
            channel.bind("travel:new-expense", () => fetchExpenses());
            
            return () => {
                pusherClient.unbind("travel:new-expense");
                pusherClient.unsubscribe(channelName);
            }
        }, [fetchExpenses, travelId]);
    
    if (isPending) {
        return <Skeleton className="lg:col-span-2 h-[150px] w-full rounded-xl" />
    }

    if (expenses.length <= 0) {
        return (
            <div className="lg:col-span-2 h-fit text-center py-8 bg-muted rounded-lg">
                <p className="text-muted-foreground">Vous n'avez pas encore de dépenses !</p>
                <p className="text-muted-foreground">Veuillez ajouter une dépense pour commencer.</p>
            </div>
        );
    }

    return (
        <div className="grid md:grid-cols-2 gap-4 h-fit lg:col-span-2">
            {expenses.map((expense, index) => (
                <TravelExpenseCard key={index} expense={expense} />
            ))}
        </div>
    );
}

export default TravelExpensesList;