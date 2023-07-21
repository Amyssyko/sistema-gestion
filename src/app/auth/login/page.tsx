"use client"

import { toast } from "react-hot-toast"
import { signIn } from "next-auth/react"
import { Card, CardHeader, Input, Typography, CardFooter, Button, Alert } from "@material-tailwind/react"
import { useRouter } from "next/navigation"
import { useError } from "@/hooks/useError"
import { error } from "console"
import React from "react"
import Link from "next/link"
import { LayoutHome } from "@/components/Layout/LayoutHome"
import { env } from "process"
import Notification from "@/components/Alert"

const Page = () => {
	const router = useRouter()

	const { myError, isErrored, handleError, resetError } = useError()

	const [formValues, setFormValues] = React.useState({
		email: "",
		password: "",
	})

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target
		setFormValues((prevState) => ({
			...prevState,
			[name]: value,
		}))
	}

	const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		const { email, password } = formValues
		event.preventDefault()

		const isEmailEmpty = !email
		const isPasswordEmpty = !password

		const errorMessage =
			isEmailEmpty && isPasswordEmpty
				? "Ingrese sus credenciales"
				: isEmailEmpty
				? "Correo es requerido"
				: isPasswordEmpty
				? "La contraseña es requerida"
				: ""

		if (errorMessage) {
			handleError(errorMessage)
			return
		}

		const result = await signIn("credentials", {
			email,
			password,
			redirect: false,
			callbackUrl: env.NEXTAUTH_URL,
		})

		if (result?.error === "CredentialsSignin") {
			setFormValues({
				email: "",
				password: "",
			})
			toast.error("Credenciales Invalidas", {
				duration: 1000,
				position: "top-right",
				icon: "❌",
				iconTheme: {
					primary: "#000",
					secondary: "#fff",
				},
			})
			console.error("Credenciales Invalidas (401)")
			handleError("Credenciales Invalidas")
		}
		if (result?.url) {
			router.push("/")
			toast.success("Sesión Iniciada", {
				duration: 4000,
				position: "top-center",
				icon: "🚌",
				iconTheme: {
					primary: "#000",
					secondary: "#fff",
				},
			})
		}
	}

	return (
		<LayoutHome>
			<div
				className="bg-cover bg-center flex justify-center items-center w-full h-screen"
				style={{
					backgroundImage: "url(https://cdn.pixabay.com/photo/2014/09/04/15/35/collective-435584_1280.jpg)",
					backgroundRepeat: "no-repeat",
					backgroundSize: "cover",
					backgroundPosition: "center",
				}}
			>
				<Card className="w-full max-w-[36rem] content-center">
					<div className="text-center my-8">
						<Typography variant="h3" color="blue">
							Inicio de Sesión
						</Typography>
						<Typography color="gray" className="mt-1 font-normal">
							Ingrese sus credenciales
						</Typography>
					</div>

					<form onSubmit={onSubmit} className="flex flex-col gap-4 border mx-24">
						<Input
							size="lg"
							name="email"
							id="email"
							label="Email"
							type="text"
							value={formValues.email}
							onChange={handleInputChange}
							//placeholder="example@example.com"
						/>
						<Input
							size="lg"
							type="password"
							name="password"
							id="password"
							label="Contraseña"
							value={formValues.password}
							onChange={handleInputChange}
							//placeholder="********"
						/>
						<div className="flex w-full flex-col gap-2">
							{isErrored && <Notification mensaje={myError?.message} />}
						</div>
						<Button type="submit" className="mt-4" fullWidth>
							Ingresar
						</Button>
					</form>

					<CardFooter className="pt-0 flex justify-items-center flex-col">
						<Typography variant="small" className="mt-2 flex justify-center">
							¿No tienes una cuenta?
							<Link href="/auth/register">
								<Typography as="span" variant="small" color="blue" className="ml-1 font-bold">
									Registrarse
								</Typography>
							</Link>
						</Typography>
					</CardFooter>
				</Card>
			</div>
		</LayoutHome>
	)
}

export default Page
