//"use client"
import React from "react"
import FormTransaccion from "../../components/Form/FormTransaccion"
import { Toaster } from "react-hot-toast"

const Page = ({ params }) => {
	return (
		<div>
			<h1>{params.id}</h1>
			<FormTransaccion id={params.id} />
		</div>
	)
}

export default Page
