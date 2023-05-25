import { Toaster } from "react-hot-toast"
import "./globals.css"
import { Inter } from "next/font/google"
import Providers from "./components/Providers"
import SigninButton from "./components/SigninButton"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
	title: "Sistema Gestion de transporte de Turismo",
	description: "App de Gestion",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<Providers>
					<SigninButton />
					<div>{children}</div>
					<Toaster />
				</Providers>
			</body>
		</html>
	)
}
