import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface TravelShowHeaderProps {
    isLoading: boolean;
    travel: ITravel;
}

const TravelShowHeader = ({
    isLoading,
    travel,
}: TravelShowHeaderProps) => {
    const router = useRouter();

    if (isLoading) {
        return (
            <div className="flex items-center justify-between">
                <h1 className="font-bold text-xl">Chargement du voyage...</h1>
                <Button onClick={() => router.push("/travels")}>Retour</Button>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-between">
            <h1 className="font-bold text-xl">{travel.title}</h1>
            <Button onClick={() => router.push("/travels")}>Retour</Button>
        </div>
    );
}

export default TravelShowHeader;