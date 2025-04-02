import { useCallback, useEffect, useState, useTransition } from "react";
import TravelBudget from "./travel-budget";
import TravelExpensesFilters from "./travel-expenses-filters";
import TravelExpensesForm from "./travel-expenses-form";
import TravelExpensesList from "./travel-expenses-list";
import { getExpenses } from "@/actions/expenses";
import { toast } from "@/hooks/use-toast";
import { pusherClient } from "@/lib/pusher";
import PaginationLayout from "@/components/application/pagination-layout";

const TravelExpensesLayout = ({ travel }: { travel: ITravel }) => {
    const [expenses, setExpenses] = useState<IExpense[]>([]);
    const [isPending, startTransition] = useTransition();

    const [filters, setFilters] = useState<ExpenseFilters>({
        title: "",
        category: "ALL",
        date: "asc",
    });

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const itemsPerPage = 1;
    
    const fetchExpenses = useCallback(() => {
        const { title, category, date } = filters;

        startTransition(async () => {
            const result = await getExpenses(travel.id, title, category, date, currentPage, itemsPerPage);
            
            if (result.error) {
                toast({
                    variant: "destructive",
                    title: "Oups !",
                    description: result.error,
                });
            } else if (result.data) {
                setExpenses(result.data.expenses.map(expense => ({
                    ...expense,
                    date: expense.date ? new Date(expense.date).toISOString() : null
                })));
                setTotalPages(result.data.totalPages);
            }
        })
    }, [filters, travel.id, currentPage]);

    useEffect(() => {
        fetchExpenses();
    }, [fetchExpenses, filters]);

    useEffect(() => {
        const channelName = `travel-${travel.id}`;
        const channel = pusherClient.subscribe(channelName);
            
        channel.bind("travel:new-expense", () => fetchExpenses());
        channel.bind("travel:delete-expense", (expense: IExpense) => {
            setExpenses((prev) => prev.filter((e) => e.id !== expense.id));
        });

        channel.bind("travel:update-expense", (data: { expense: IExpense, updatedExpense: IExpense }) => {
            setExpenses((prev) => prev.map(expense =>
                expense.id === data.updatedExpense.id ? {
                    ...data.updatedExpense,
                    date: data.updatedExpense.date ? new Date(data.updatedExpense.date).toISOString() : null
                } : expense
            ));
        });
            
        return () => {
            pusherClient.unbind("travel:update-expense");
            pusherClient.unbind("travel:delete-expense");
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
                <PaginationLayout
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            </div>
        </div>
    );
}

export default TravelExpensesLayout;