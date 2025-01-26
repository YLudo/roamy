import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const TravelShowHeader = ({ travel }: { travel: ITravel}) => {
    const router = useRouter();

    return (
        <div className="flex items-center justify-between">
            <h1 className="font-bold text-xl">{travel.title}</h1>
            <Button onClick={() => router.push("/travels")}>Retour</Button>
        </div>
    );
}

export default TravelShowHeader;