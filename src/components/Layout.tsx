"use client"
import SidebarAdmin from "./SidebarAdmin"
import Footer from "./Footer"

export function Layout({ children }) {
	return (
		<div className="w-full  bg-white flex flex-col">
			<SidebarAdmin />
			<div className="ml-64 min-h-screen max-h-full">{children}</div>
			<Footer />
		</div>
	)
}
