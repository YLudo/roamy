import TravelCard from "../../travel-card";

const TravelShowSummary = ({ travel }: { travel: ITravel }) => {
    return (
        <div className="mt-4 grid grid-cols-3">
            <TravelCard travel={travel} showActions />
        </div>
    );
}

export default TravelShowSummary