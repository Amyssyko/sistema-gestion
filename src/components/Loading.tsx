import { Spinner, Typography } from "@material-tailwind/react"
import Link from "next/link"
import React from "react"

function Loading() {
	return (
		<div className="w-full h-screen flex flex-col justify-items-center items-center justify-center">
			<Spinner className="h-14 w-14 mb-4" color="blue" />
			<h1 className=" animate-pulse  text-black dark:text-black">Cargando...</h1>
			{/**<Link href="/">
				<Typography className="text-black mt-12 hover:text-blue-600 mx-auto hover:border hover:rounded-lg">{`Regresar`}</Typography>
			</Link> */}
		</div>
	)
}

export default Loading
