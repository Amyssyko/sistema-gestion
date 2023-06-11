"use client"
import { Layout } from "@/components/Layout"
import { Spinner } from "@material-tailwind/react"
import { useSession } from "next-auth/react"
import React from "react"

function Page() {
	const { data: session } = useSession()

	if (session?.user?.role === undefined) {
		return (
			<div className="w-full h-screen bg-white dark:bg-gray-800 flex flex-col justify-items-center items-center justify-center">
				<Spinner className="h-14 w-14 mb-4" color="blue" />
				<h1 className=" animate-pulse  text-black dark:text-white">Cargando...</h1>{" "}
			</div>
		)
	}

	if (session?.user?.role !== "admin") {
		return (
			<div className="w-full h-screen bg-white">
				<h1 className="text-black">No eres Administrador</h1>
			</div>
		)
	}

	console.log(session?.user)
	return (
		<div>
			<Layout>
				<h1 className="text-red-800">hola</h1>
			</Layout>
		</div>
	)
}

export default Page
