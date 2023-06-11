"use client"
import { signIn, signOut, useSession } from "next-auth/react"
import React from "react"

const SigninButton = () => {
	//console.log(useSession())
	const { data: session } = useSession()
	//console.log(session?.user)

	if (session && session.user) {
		return (
			<div className="flex gap-4 ml-auto">
				<p className="text-sky-600">email: {session?.user.email}</p>
				{session.user.name ? <p className="text-sky-600">nombre: {session?.user.name}</p> : ""}

				<button onClick={() => signOut()} className="text-red-600">
					Cerrar Sesión
				</button>
			</div>
		)
	}
	return (
		<button onClick={() => signIn()} className="text-green-600 ml-auto">
			Iniciar Sesión
		</button>
	)
}

export default SigninButton
