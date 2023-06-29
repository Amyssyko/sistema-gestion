//"use client"
import React from "react"
import FormBus from "@/components/Form/FormBus"
import { Layout } from "@/components/Layout"

const Page = ({ params }) => {
	return (
		<Layout>
			<FormBus id={params.id} />
		</Layout>
	)
}

export default Page
