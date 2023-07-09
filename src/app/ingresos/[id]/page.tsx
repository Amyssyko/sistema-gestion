import { LayoutHome } from "@/components/Layout/LayoutHome"
import React from "react"
import FormIngreso from "@/components/Form/FormIngreso"

const Page = ({ params }) => {
	const id = Number(params.id)
	return (
		<LayoutHome>
			<div className="mx-auto max-w-screen-lg py-12">
				<FormIngreso id={id} />
			</div>
		</LayoutHome>
	)
}

export default Page
