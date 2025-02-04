import TravelShowBudget from "./travel-show-budget";
import TravelShowExpensesForm from "./travel-show-expenses-form";

const TravelShowExpenses = ({ travel }: { travel: ITravel }) => {
    return (
        <div className="mt-4 grid grid-cols-3">
            <div className="space-y-4">
                <TravelShowBudget travelId={travel.id} />
                <TravelShowExpensesForm travelId={travel.id} />
            </div>
        </div>
    );
}

export default TravelShowExpenses;