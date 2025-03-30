import NextTravelCard from "./next-travel-card";

const DashboardLayout = () => {
    return (
        <section className="grid lg:grid-cols-3 mt-4 gap-4">
            <div className="space-y-4">
                <NextTravelCard />
            </div>
        </section>
    )
}

export default DashboardLayout;