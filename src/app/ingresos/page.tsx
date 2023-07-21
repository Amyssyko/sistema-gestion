"use client"
import { LayoutHome } from "@/components/Layout/LayoutHome"
import React from "react"
import FormIngreso from "@/components/Form/FormIngreso"
import NoAdmin from "@/components/NoAdmin"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

function Page() {
	const router = useRouter()
	const { data: session } = useSession()
	const rol = session?.user?.role

	if (rol !== "admin" && rol !== "empleado") {
		setTimeout(() => {
			router.push("/auth/login")
		}, 4000)
		return <NoAdmin />
	}
	return (
		<LayoutHome>
			<div className="mx-auto max-w-screen-lg py-12">
				<FormIngreso />
			</div>
		</LayoutHome>
	)
}

export default Page
