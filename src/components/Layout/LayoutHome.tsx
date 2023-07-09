"use client"
import { useEffect, useState } from "react"
import Footer from "../Footer"
import NavBar from "../NavBar"

export function LayoutHome({ children }) {
	return (
		<div className="w-full  bg-white flex flex-col">
			<NavBar />
			<div className="max-h-full  min-h-screen">{children}</div>
			<Footer />
		</div>
	)
}
