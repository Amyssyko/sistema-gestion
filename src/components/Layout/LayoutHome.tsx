"use client"
import { useEffect, useState } from "react"
import Footer from "../Footer"
import NavBar from "../NavBar"

export function LayoutHome({ children }) {
	return (
		<div className="w-auto  bg-white flex flex-col">
			<NavBar />
			<div className="h-auto">{children}</div>
			<Footer />
		</div>
	)
}
