import Navbar from "@/components/layout/navbar";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex min-h-scree, flex-col">
            <Navbar />
            <main className="container mx-auto mt-2 p-4 flex-grow">
                {children}
            </main>
        </div>
    );
}