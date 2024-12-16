import TravelsLayout from "@/components/travels/travels-layout";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from "next/link";

const TravelsPage = async () => {
    const res = await fetch(`${process.env.API_URL}/travels`, {
        cache: "no-store",
    });
    const travels = await res.json();

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
                        <BreadcrumbPage>Mes voyages</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
                <TravelsLayout travels={travels} />
            </Breadcrumb>
        </>
    );
}

export default TravelsPage;