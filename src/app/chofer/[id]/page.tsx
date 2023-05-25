//"use client"
import React from "react"
import Chofer from "../../components/Form/FormChofer"
import { Toaster } from "react-hot-toast"

const Page = ({ params }) => {
	return (
		<div>
			<h1>{params.id}</h1>
			<Chofer id={params.id} />
		</div>
	)
}

export default Page
