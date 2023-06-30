import React from "react"
import FormRol from "@/components/Form/FormRol"
import { Layout } from "@/components/Layout"

const Page = ({ params }) => {
	const id = Number(params.id)
	return (
		<Layout>
			<h1>{params.id}</h1>
			<FormRol id={id} />
		</Layout>
	)
}

export default Page
