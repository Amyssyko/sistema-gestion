import { Typography } from "@material-tailwind/react"
import { useSession } from "next-auth/react"
import Link from "next/link"

import React, { use } from "react"
import Loading from "./Loading"

function NoAdmin() {
	const { data: session } = useSession()

	if (session?.user?.role === undefined) {
		return <Loading />
	}

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
