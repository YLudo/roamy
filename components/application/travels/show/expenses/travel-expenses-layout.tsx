import TravelBudget from "./travel-budget";
import TravelExpensesForm from "./travel-expenses-form";
import TravelExpensesList from "./travel-expenses-list";

const TravelExpensesLayout = ({ travel }: { travel: ITravel }) => {
    return (
        <div className="mt-4 grid lg:grid-cols-3 gap-4">
            <div className="space-y-4">
                <TravelBudget travelId={travel.id} />
                <TravelExpensesForm travelId={travel.id} />
            </div>
            <TravelExpensesList travelId={travel.id} />
        </div>
    );
}

export default TravelExpensesLayout;