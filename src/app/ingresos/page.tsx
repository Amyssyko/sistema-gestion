import { LayoutHome } from "@/components/Layout/LayoutHome"
import React from "react"
import FormIngreso from "@/components/Form/FormIngreso"

function Page() {
	return (
		<LayoutHome>
			<div className="mx-auto max-w-screen-lg py-12">
				<FormIngreso />
			</div>
		</LayoutHome>
	)
}

export default Page
