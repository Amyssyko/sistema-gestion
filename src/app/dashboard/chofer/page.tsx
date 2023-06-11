import FormChofer from "@/components/Form/FormChofer"
import { Layout } from "@/components/Layout"
import React from "react"
Layout
const Page = () => {
	return (
		<div>
			<Layout>
				<div className=" w-full">
					<div className="bg-red-800">Hoola</div>
					<div className="flex justify-evenly items-end">
						<FormChofer />
					</div>
				</div>
			</Layout>
		</div>
	)
}

export default Page
