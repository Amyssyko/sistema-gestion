import { Button, Card } from "@material-tailwind/react"
import { signIn, useSession, signOut } from "next-auth/react"
import React from "react"

function SignIn() {
	const { data: session } = useSession()
	const email = session?.user?.email

	if (email) {
		return (
			<Card className="w-auto">
				<Button
					onClick={() => signOut()}
					size="sm"
					className="mx-full shadow-md text-xs border rounded-lg bg-red-500 hover:bg-red-800  transition duration-0 hover:duration-150 ease-in-out text-white"
				>
					Cerrar Sesión
				</Button>
			</Card>
		)
	}

	return (
		<Card className="w-auto">
			<Button
				onClick={() => signIn()}
				size="sm"
				className="mx-full shadow-md text-xs  border rounded-lg bg-blue-500 hover:bg-blue-800 transition duration-0 hover:duration-150 ease-in-out text-white"
			>
				Iniciar Sesión
			</Button>
		</Card>
	)
}

export { SignIn }
