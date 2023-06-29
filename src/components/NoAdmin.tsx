import { Typography } from "@material-tailwind/react"
import Link from "next/link"

import React from "react"

function NoAdmin() {
	return (
		<div className="w-full h-screen flex flex-col items-center justify-center">
			<Typography className="text-red-800  text-4xl">{`Sin privilegios`}</Typography>
			<Link href="/">
				<Typography className="text-black mt-12 hover:text-blue-600 mx-auto hover:border hover:rounded-lg">{`Regresar`}</Typography>
			</Link>
		</div>
	)
}

export default NoAdmin
