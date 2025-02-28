import TravelActivitiesForm from "./travel-activities-form";

const TravelActivitiesLayout = ({ travel }: { travel: ITravel }) => {
    return (
        <div className="mt-4 grid lg:grid-cols-3 gap-4">
            <div className="space-y-4">
                <TravelActivitiesForm travelId={travel.id} />
            </div>
            <div className="lg:col-span-2">

            </div>
        </div>
    );
}

export default TravelActivitiesLayout;