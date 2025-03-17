import TravelDocumentsForm from "./travel-documents-form";

const TravelDocumentsLayout = ({ travel }: { travel: ITravel }) => {
    return (
        <div className="mt-4 grid lg:grid-cols-3 gap-4">
            <TravelDocumentsForm travelId={travel.id} />
            <div className="lg:col-span-2"></div>
        </div>
    )
}

export default TravelDocumentsLayout;