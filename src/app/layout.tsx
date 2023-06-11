import { Toaster } from "react-hot-toast"
import "./globals.css"
import { Inter } from "next/font/google"
import Providers from "@/components/Providers"
const inter = Inter({ subsets: ["latin"] })


export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<Providers>
					<div>{children}</div>
					<Toaster />
				</Providers>
			</body>
		</html>
	)
}
