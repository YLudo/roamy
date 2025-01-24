import { Button } from "@/components/ui/button"

const TravelHeader = () => {
    return (
        <div className="flex items-center justify-between">
            <h1 className="font-bold text-xl">Mes voyages</h1>
            <Button>Créer un voyage</Button>
        </div>
    );
}

export default TravelHeader;