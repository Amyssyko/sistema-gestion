"use client"
import { Layout } from "@/components/Layout"
import Loading from "@/components/Loading"
import NoAdmin from "@/components/NoAdmin"
import { Spinner } from "@material-tailwind/react"
import { useSession } from "next-auth/react"
import React from "react"

function Page() {
	const { data: session } = useSession()
	if (session?.user?.role === undefined) {
		return <Loading />
	}
	if (session?.user?.role !== "admin") {
		return <NoAdmin />
	}

	return (
		<Layout>
			<div>
				<h1>Text</h1>
			</div>
		</Layout>
	)
}

export default Page
