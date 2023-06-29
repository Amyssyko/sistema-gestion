import React from "react"
import FormUsuario from "@/components/Form/FormUsuario"
import { Layout } from "@/components/Layout"

const Page = ({ params }) => {
	const id = Number(params.id)
	return (
		<Layout>
			<h1>{params.id}</h1>
			<FormUsuario id={id} />
		</Layout>
	)
}

export default Page
