import React from "react"
import FormChofer from "@/components/Form/FormChofer"

const Page = ({ params }) => {
	return (
		<div>
			<h1>{params.id}</h1>
			<FormChofer id={params.id} />
		</div>
	)
}

export default Page
