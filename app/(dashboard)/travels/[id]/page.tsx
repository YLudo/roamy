import TravelShowLayout from "@/components/travels/travel-show-layout";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from "next/link";

const TravelShowPage = async ({ params }: { params: { id: string }}) => {
    const { id } = params;

    const res = await fetch(`${process.env.API_URL}/travels/${id}`, {
        cache: "no-store",
    });

    const travel = await res.json();

    return (
        <>
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/">Tableau de bord</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/travels">Mes voyages</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{travel.name}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <TravelShowLayout travel={travel} />
        </>
    );
}

export default TravelShowPage;