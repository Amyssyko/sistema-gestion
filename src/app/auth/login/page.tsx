"use client"

import { toast } from "react-hot-toast"
import { signIn } from "next-auth/react"
import { Card, CardHeader, Input, Typography, CardFooter, Button, Alert } from "@material-tailwind/react"
import { useRouter } from "next/navigation"
import { useError } from "@/hooks/useError"
import { error } from "console"

interface Registro {
	email: string
	password: string
}

const Page = () => {
	const router = useRouter()

	const { myError, isErrored, handleError, resetError } = useError()

	const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		resetError()
		const formData = new FormData(event.currentTarget)
		const email = formData.get("email")
		const password = formData.get("password")
		//console.log(email + " " + password)
		// Validación en el frontend
		const isEmailEmpty = !email
		const isPasswordEmpty = !password

		const errorMessage =
			isEmailEmpty && isPasswordEmpty
				? "Ingrese las credenciales"
				: isEmailEmpty
				? "Email es requerida. "
				: isPasswordEmpty
				? "La contraseña es requerida."
				: ""

		if (errorMessage) {
			handleError(errorMessage)
			return
		}
		//console.log(email + " " + password)

		const result = await signIn("credentials", {
			email,
			password,
			redirect: false,
			callbackUrl: "/",
		})

		console.log(result)

		if (result?.error === "CredentialsSignin") {
			toast.error("Credenciales Invalidas", {
				duration: 1000,
				position: "top-right",

				// Custom Icon
				icon: "❌",

				// Change colors of success/error/loading icon
				iconTheme: {
					primary: "#000",
					secondary: "#fff",
				},
			})
			console.error("Credenciales Invalidas (401)")

			handleError("Credenciales Invalidas")
		}
		if (result?.url) {
			//console.log("usuario ingreso")
			router.push("/")
		}
	}

	return (
		<div
			className="bg-cover bg-center flex justify-center items-center w-full h-screen"
			style={{
				backgroundImage: "url(https://source.unsplash.com/random?wallpapers)",
				backgroundRepeat: "no-repeat",
				backgroundSize: "cover",
				backgroundPosition: "center",
			}}
		>
			<Card className="w-full max-w-[36rem] content-center">
				<div className="text-center my-12">
					<Typography variant="h3" color="black">
						Inicio de Sesión
					</Typography>
				</div>

				<form onSubmit={onSubmit} className="flex flex-col gap-4 border mx-24">
					<Input
						size="lg"
						name="email"
						id="email"
						label="Email"
						type="text"
						placeholder="example@example.com"
					/>
					<Input
						type="password"
						name="password"
						id="password"
						size="lg"
						label="Password"
						placeholder="********"
					/>
					<div className="flex w-full flex-col gap-2">
						{isErrored && (
							<Alert color={myError?.message == "Credenciales Invalidas" ? "red" : "orange"} variant="ghost">
								{myError?.message}
							</Alert>
						)}
					</div>
					<Button type="submit" className="mt-6" fullWidth>
						Ingresar
					</Button>
				</form>

				<CardFooter className="pt-0 flex justify-items-center flex-col">
					<Typography variant="small" className="mt-6 flex justify-center">
						¿No tienes una cuenta?
						<Typography as="a" href="auth/register" variant="small" color="blue" className="ml-1 font-bold">
							Registrarse
						</Typography>
					</Typography>
				</CardFooter>
			</Card>
		</div>
	)
}

export default Page
