import { LayoutHome } from "@/components/Layout/LayoutHome"
import React from "react"
import FormEgreso from "@/components/Form/FormEgreso"

const Page = ({ params }) => {
	const id = Number(params.id)
	return (
		<LayoutHome>
			<div className="mx-auto max-w-screen-lg py-12">
				<FormEgreso id={id} />
			</div>
		</LayoutHome>
	)
}

export default Page
