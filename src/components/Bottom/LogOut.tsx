import { Button, Card } from "@material-tailwind/react"
import { signOut } from "next-auth/react"
import React from "react"

function LogOut() {
	return (
		<Card className="w-auto my-auto">
			<Button
				onClick={() => signOut()}
				size="sm"
				className="mx-auto w-auto shadow-md text-xs  border rounded-lg bg-white hover:bg-red-700 text-black/60"
			>
				Iniciar Sesión
			</Button>
		</Card>
	)
}

export { LogOut }
