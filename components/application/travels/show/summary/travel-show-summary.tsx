import TravelCard from "../../travel-card";
import TravelShowParticipants from "./travel-show-participants";

const TravelShowSummary = ({ travel }: { travel: ITravel }) => {
    return (
        <div className="mt-4 grid lg:grid-cols-3">
            <div className="space-y-4">
                <TravelCard travel={travel} showActions />
                <TravelShowParticipants travelId={travel.id} />
            </div>
        </div>
    );
}

export default TravelShowSummary