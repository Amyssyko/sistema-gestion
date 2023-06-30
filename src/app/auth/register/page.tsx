"use client"

import * as React from "react"
import { Card, Typography, Input, Button, Alert, CardFooter } from "@material-tailwind/react"

import axios, { AxiosResponse, AxiosError } from "axios"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"
import { useError } from "@/hooks/useError"
import { verificarCedula } from "udv-ec"
import Link from "next/link"

export default function SignUp() {
	const router = useRouter()

	const [formValues, setFormValues] = React.useState({
		email: "",
		password: "",
		dni: "",
		confirm_password: "",
	})
	const { myError, isErrored, handleError, resetError } = useError()

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target
		setFormValues((prevState) => ({
			...prevState,
			[name]: value,
		}))
	}

	const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		//resetError()
		const { email, dni, password, confirm_password } = formValues
		//const formData = new FormData(event.currentTarget)
		//const email = formData.get("email")
		//const password = formData.get("password")
		//const confirmPassword = formData.get("confirm_password")

		const isEmailEmpty = !email
		const isDni = !dni
		const isPasswordEmpty = !password
		const isconfirmPassword = !confirm_password
		const doPasswordsMatch = password === confirm_password

		const errorMessage =
			isEmailEmpty && isPasswordEmpty && doPasswordsMatch
				? "Verifique que todos los campos sean completados."
				: isEmailEmpty
				? "Correo requerido"
				: isDni
				? "Cedula requerida"
				: !verificarCedula(dni)
				? "Cedula Invalida"
				: isPasswordEmpty
				? "Contraseña requerida"
				: isconfirmPassword
				? "Contraseña de confirmacion requerida"
				: !doPasswordsMatch
				? "Contraseñas no coinciden"
				: ""

		if (errorMessage) {
			handleError(errorMessage)
			return
		}

		try {
			const response: AxiosResponse = await axios.post("/api/auth/register", {
				email,
				dni,
				password,
				confirm_password,
			})
			console.log(response)
			if (response.status === 201) {
				toast.success("Usuario registrado con éxito", {
					duration: 3000,
					position: "top-left",

					// Custom Icon
					icon: "✅",

					// Change colors of success/error/loading icon
					iconTheme: {
						primary: "#000",
						secondary: "#fff",
					},
				})
			}
			router.replace("/auth/login")
		} catch (error: Error | AxiosError | any) {
			console.error(error)
			handleError(error.response.data)
			setFormValues({
				email: "",
				dni: "",
				password: "",
				confirm_password: "",
			})

			console.error(`${error.response.data} (${error.response.status})`)
			if (error.response && error.response.status) {
				toast.error(error.response.data, {
					duration: 3000,
					position: "top-left",
					icon: "❌",
					iconTheme: {
						primary: "#000",
						secondary: "#fff",
					},
				})
			}

			router.refresh()
			//resetError()
		}
	}

	return (
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
				<div className="text-center my-12">
					<Typography variant="h3" color="blue">
						Registro
					</Typography>
					<Typography color="gray" className="mt-1 font-normal">
						Ingrese sus datos
					</Typography>
				</div>
				<form onSubmit={onSubmit} className="flex flex-col gap-4 border mx-24">
					<div className="mb-4 flex flex-col gap-6  ">
						<Input
							size="lg"
							name="email"
							id="email"
							label="Email"
							type="text"
							value={formValues.email}
							onChange={handleInputChange}
						/>
						<Input
							size="lg"
							name="dni"
							id="dni"
							label="Cedula"
							type="text"
							value={formValues.dni}
							onChange={handleInputChange}
						/>
						<Input
							type="password"
							name="password"
							id="password"
							size="lg"
							label="Contraseña"
							value={formValues.password}
							onChange={handleInputChange}
						/>
						<Input
							type="password"
							name="confirm_password"
							id="confirm_password"
							size="lg"
							label="Confirmar Contraseña"
							value={formValues.confirm_password}
							onChange={handleInputChange}
						/>
					</div>
					<div>
						{isErrored && (
							<Alert color="orange" variant="ghost" className=" text-sm">
								{myError?.message}
							</Alert>
						)}
					</div>
					<Button type="submit" className="mt-4" fullWidth>
						Registrar
					</Button>

					<CardFooter className="pt-0 flex justify-items-center flex-col">
						<Typography variant="small" className="mt-2 flex justify-center">
							¿Ya tienes una cuenta?
							<Link href="/auth/login">
								<Typography as="span" variant="small" color="blue" className="ml-1 font-bold">
									Inicia Sesion
								</Typography>
							</Link>
						</Typography>
					</CardFooter>
				</form>
			</Card>
		</div>
	)
}
