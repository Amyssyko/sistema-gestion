import React from "react"
import { Layout } from "@/components/Layout"
import FormIngreso from "@/components/Form/FormIngreso"

const Page = ({ params }) => {
	const id = Number(params.id)
	return (
		<Layout>
			<h1>{params.id}</h1>
			<FormIngreso id={id} />
		</Layout>
	)
}

export default Page
