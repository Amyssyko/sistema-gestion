import { LayoutHome } from "@/components/Layout/LayoutHome"
import React from "react"
import FormEgreso from "@/components/Form/FormEgreso"

function Page() {
	return (
		<LayoutHome>
			<div className="mx-auto max-w-screen-lg py-12">
				<FormEgreso />
			</div>
		</LayoutHome>
	)
}

export default Page
