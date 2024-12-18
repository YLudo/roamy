import TravelCard from "./travel-card";

const TravelSummary = ({ travel }: { travel: Travel }) => {
    return (
        <div className="mt-4 grid grid-cols-3">
            <TravelCard travel={travel} isShowPage />
        </div>
    );
}

export default TravelSummary;