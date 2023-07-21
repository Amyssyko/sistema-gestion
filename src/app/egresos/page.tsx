"use client"
import { LayoutHome } from "@/components/Layout/LayoutHome"
import React from "react"
import FormEgreso from "@/components/Form/FormEgreso"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import NoAdmin from "@/components/NoAdmin"

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
				<FormEgreso />
			</div>
		</LayoutHome>
	)
}

export default Page
