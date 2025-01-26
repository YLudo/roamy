import { Skeleton } from "@/components/ui/skeleton";

const TravelShowSkeleton = () => {
    return (
        <>
            <Skeleton className="w-full mt-4 h-10" />
            <Skeleton className="w-full mt-4 h-10" />
            <Skeleton className="w-full mt-4 h-48" />
        </>
    );
}

export default TravelShowSkeleton;