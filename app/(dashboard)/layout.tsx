import Navbar from "@/components/layout/navbar";

const DashboardLayout = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	return (
		<>
			<Navbar />
			<main className="container mx-auto mt-2	 p-4">
				{children}
			</main>
		</>
	);
}

export default DashboardLayout;