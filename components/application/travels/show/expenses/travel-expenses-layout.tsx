import { useCallback, useEffect, useState, useTransition } from "react";
import TravelBudget from "./travel-budget";
import TravelExpensesFilters from "./travel-expenses-filters";
import TravelExpensesForm from "./travel-expenses-form";
import TravelExpensesList from "./travel-expenses-list";
import { getExpenses } from "@/actions/expenses";
import { toast } from "@/hooks/use-toast";
import { pusherClient } from "@/lib/pusher";

const TravelExpensesLayout = ({ travel }: { travel: ITravel }) => {
    const [expenses, setExpenses] = useState<IExpense[]>([]);
    const [isPending, startTransition] = useTransition();

    const [filters, setFilters] = useState<ExpenseFilters>({
        title: "",
        category: "ALL",
        date: "asc",
    });
    
    const fetchExpenses = useCallback(() => {
        const { title, category, date } = filters;

        startTransition(async () => {
            const result = await getExpenses(travel.id, title, category, date);
            
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
    }, [filters]);

    useEffect(() => {
        fetchExpenses();
    }, [fetchExpenses, filters]);

    useEffect(() => {
        const channelName = `travel-${travel.id}`;
        const channel = pusherClient.subscribe(channelName);
            
        channel.bind("travel:new-expense", () => fetchExpenses());
            
        return () => {
            pusherClient.unbind("travel:new-expense");
            pusherClient.unsubscribe(channelName);
        }
    }, [fetchExpenses, travel.id]);

    return (
        <div className="mt-4 grid lg:grid-cols-3 gap-4">
            <div className="space-y-4">
                <TravelBudget travelId={travel.id} />
                <TravelExpensesForm travelId={travel.id} />
            </div>
            <div className="lg:col-span-2">
                <TravelExpensesFilters filters={filters} setFilters={setFilters} />
                <TravelExpensesList isLoading={isPending} expenses={expenses} />
            </div>
        </div>
    );
}

export default TravelExpensesLayout;