"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const TravelShowLayout = ({ travel }: { travel: Travel }) => {
    const router = useRouter();
    
    return (
        <section className="mt-6">
            <div className="flex items-center justify-between">
                <h1 className="font-bold text-xl">{travel.name}</h1>
                <Button onClick={() => router.push("/travels")}>Retour</Button>
            </div>
        </section>
    );
}

export default TravelShowLayout;