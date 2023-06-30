import { Toaster } from "react-hot-toast"
import "./globals.css"
import { Inter } from "next/font/google"
import Providers from "@/components/Providers"
import Footer from "@/components/Footer"
const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="es">
			<body className={inter.className}>
				<Providers>
					<div className="bg-gray-50 dark:bg-blue-gray-50">{children}</div>
					<Toaster />
				</Providers>
			</body>
		</html>
	)
}
