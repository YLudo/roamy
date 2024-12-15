import { Button } from "@/components/ui/button";

const TravelsLayout = () => {
    return (
        <section className="mt-6">
            <div className="flex items-center justify-between">
                <h1 className="font-bold text-xl">Mes voyages</h1>
                <Button>Créer un voyage</Button>
            </div>
        </section>
    );
}

export default TravelsLayout;