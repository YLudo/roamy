import TravelCard from "../../travel-card";
import TravelPollsCard from "./polls/travel-polls-card";
import TravelShowParticipants from "./travel-show-participants";

const TravelShowSummary = ({ travel }: { travel: ITravel }) => {
    return (
        <div className="mt-4 grid lg:grid-cols-3 gap-4">
            <div className="space-y-4">
                <TravelCard travel={travel} showActions />
                <TravelShowParticipants travelId={travel.id} />
            </div>
            <div className="lg:col-span-2">
                <TravelPollsCard travelId={travel.id} />
            </div>
        </div>
    );
}

export default TravelShowSummary