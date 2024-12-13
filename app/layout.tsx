import type { Metadata } from "next";
import "./globals.css";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";

const fontSans = FontSans({
	subsets: ["latin"],
	variable: "--font-sans"
});

export const metadata: Metadata = {
  	title: "Roamy",
  	description: "Votre compagnon de voyage collaboratif",
};

export default function RootLayout({
  	children,
}: Readonly<{
  	children: React.ReactNode;
}>) {
	return (
		<html lang="fr">
	  		<body
				className={cn(
					"min-h-screen font-sans antialiased",
					fontSans.variable
				)}
	  		>
				{children}
	  		</body>
		</html>
  	);
}
