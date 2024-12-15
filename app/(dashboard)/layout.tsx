import Navbar from "@/components/layout/navbar";

const DashboardLayout = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	return (
		<>
			<Navbar />
			<section className="container mx-auto mt-6">
				{children}
			</section>
		</>
	);
}

export default DashboardLayout;