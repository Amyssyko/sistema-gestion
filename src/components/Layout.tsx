"use client"
import { useEffect, useState } from "react"
import SidebarAdmin from "./SidebarAdmin"

export function Layout({ children }) {
	const [availableHeight, setAvailableHeight] = useState(0)
	const [isMobile, setIsMobile] = useState(false)
	const [sidebarOpen, setSidebarOpen] = useState(false)

	useEffect(() => {
		const calculateAvailableHeight = () => {
			const windowHeight = window.innerHeight
			const headerHeight = document.getElementById("header")?.offsetHeight || 0
			const footerHeight = document.getElementById("footer")?.offsetHeight || 0

			const availableHeight = windowHeight - headerHeight - footerHeight
			setAvailableHeight(availableHeight)
		}

		const handleResize = () => {
			const windowWidth = window.innerWidth
			setIsMobile(windowWidth <= 768)
			calculateAvailableHeight()
		}

		calculateAvailableHeight()

		window.addEventListener("resize", handleResize)

		return () => {
			window.removeEventListener("resize", handleResize)
		}
	}, [])

	const toggleSidebar = () => {
		setSidebarOpen(!sidebarOpen)
	}

	return (
		<div className="w-full h-screen bg-white flex flex-col">
			<SidebarAdmin />
			<div className="ml-64">{children}</div>
		</div>
	)
}

{
	/*container mx-auto h-full flex  */
}
