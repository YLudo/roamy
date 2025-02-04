import TravelShowBudget from "./travel-show-budget";

const TravelShowExpenses = ({ travel }: { travel: ITravel }) => {
    return (
        <div className="mt-4 grid grid-cols-3">
            <TravelShowBudget travelId={travel.id} />
        </div>
    );
}

export default TravelShowExpenses;