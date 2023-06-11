//"use client"
import React from "react"
import FormBus from "@/components/Form/FormBus"

const Page = ({ params }) => {
	return (
		<div>
			<h1>{params.id}</h1>
			<FormBus id={params.id} />
		</div>
	)
}

export default Page
