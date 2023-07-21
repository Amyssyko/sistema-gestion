"use client"
import SidebarAdmin from "./SidebarAdmin"
import Footer from "./Footer"
import { useSession } from "next-auth/react"
import NoAdmin from "./NoAdmin"
import { useRouter } from "next/navigation"
import Loading from "./Loading"

export function Layout({ children }) {
	const router = useRouter()

	const { data: session } = useSession()
	const rol = session?.user?.role
	if (!rol) {
		return <Loading />
	}

	if (rol !== "admin") {
		setTimeout(() => {
			router.push("/")
		}, 4000)
		return <NoAdmin />
	}

	return (
		<div className="min-w-screen max-w-full bg-white flex flex-col">
			<SidebarAdmin />
			<div className="ml-64 min-h-screen max-h-full">{children}</div>
			<Footer />
		</div>
	)
}
