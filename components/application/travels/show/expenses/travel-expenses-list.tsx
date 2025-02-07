import TravelExpenseCard from "./travel-expense-card";
import { Skeleton } from "@/components/ui/skeleton";

interface TravelExpensesListProps {
    isLoading: boolean;
    expenses: IExpense[];
};

const TravelExpensesList = ({ isLoading, expenses }: TravelExpensesListProps) => {
    if (isLoading) {
        return <Skeleton className="lg:col-span-2 h-[150px] w-full rounded-xl mt-4" />
    }

    if (expenses.length <= 0) {
        return (
            <div className="lg:col-span-2 mt-4 h-fit text-center py-8 bg-muted rounded-lg">
                <p className="text-muted-foreground">Vous n'avez pas encore de dépenses !</p>
                <p className="text-muted-foreground">Veuillez ajouter une dépense pour commencer.</p>
            </div>
        );
    }

    return (
        <div className="grid md:grid-cols-2 gap-4 mt-4">
            {expenses.map((expense, index) => (
                <TravelExpenseCard key={index} expense={expense} />
            ))}
        </div>
    );
}

export default TravelExpensesList;