import InvitationsCard from "./invitations-card";
import NextTravelCard from "./next-travel-card";

const DashboardLayout = () => {
    return (
        <section className="mt-4">
            <h1 className="font-bold text-xl">Tableau de bord</h1>
            <div className="grid lg:grid-cols-3 mt-4 gap-4">
                <div className="space-y-4">
                    <NextTravelCard />
                    <InvitationsCard />
                </div>
            </div>
        </section>
    )
}

export default DashboardLayout;