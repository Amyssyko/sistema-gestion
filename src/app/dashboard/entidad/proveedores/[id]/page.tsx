//"use client"
import React from "react"
import FormProveedor from "@/components/Form/FormProveedor"
import { Layout } from "@/components/Layout"

const Page = ({ params }) => {
	const id = Number(params.id)
	return (
		<Layout>
			<FormProveedor id={id} />
		</Layout>
	)
}

export default Page
