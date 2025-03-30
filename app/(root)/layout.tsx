import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";

export default function ApplicationLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="container mx-auto mt-2 p-4 flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    );
}