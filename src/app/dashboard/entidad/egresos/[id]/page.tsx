import React from "react"
import { Layout } from "@/components/Layout"
import FormEgreso from "@/components/Form/FormEgreso"

const Page = ({ params }) => {
	const id = Number(params.id)
	return (
		<Layout>
			<h1>{params.id}</h1>
			<FormEgreso id={id} />
		</Layout>
	)
}

export default Page
