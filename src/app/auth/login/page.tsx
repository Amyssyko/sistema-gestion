"use client"
import Input from "@/app/components/Input"

import axios, { AxiosResponse } from "axios"
import { useRef, useState } from "react"
import { toast, Toaster } from "react-hot-toast"
import useError from "@/app/hooks/useError"

interface Registro {
	email: string
	password: string
}

const Page = ({}) => {
	const { error, isErrored, handleError, handleNotError } = useError()

	const [formRegistro, setFormRegistro] = useState<Registro>({
		email: "",
		password: "",
	})

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		const { name, value } = event.target
		setFormRegistro((prevFormData) => ({ ...prevFormData, [name]: value }))
	}

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		const { email, password } = formRegistro
		if (email.trim() === "" || password.trim() === "") {
			handleError("Verifique que todos los campos sean completados.")
		} else {
			handleNotError()
			try {
				const response: AxiosResponse = await axios.post("/api/login", {
					email,
					password,
				})

				console.log(response)
				if (response.status === 200) {
					toast.success("Iniciando Sesión", {
						duration: 1000,
						position: "top-center",

						// Custom Icon
						icon: "✅",

						// Change colors of success/error/loading icon
						iconTheme: {
							primary: "#000",
							secondary: "#fff",
						},
					})
				}
			} catch (error: any) {
				/*toast.error(error.response.data, {
					duration: 2000,
					position: "top-right",

					// Custom Icon
					icon: "❌",

					// Change colors of success/error/loading icon
					iconTheme: {
						primary: "#000",
						secondary: "#fff",
					},
				}) */
				if (error.response) {
					switch (error.response.status) {
						case 401:
							handleError("Verifique sus credenciales")
						case 409:
							handleError("Verifique sus credenciales")
							console.log(`Error: ${error.response.data} (${error.response.status})`)
							break
						case 500:
							console.log(`Error en el servidor (${error.response.status})`)
							break
						default:
							console.log(`Error desconocido (${error.response.status})`)
					}
				} else if (error.request) {
					console.log(`Error de solicitud (${error.request.status})`)
				} else {
					console.log(`Error desconocido: ${error.message}`)
				}
			}
		}
	}

	return (
		<>
			<div className="flex flex-col items-center min-h-screen pt-6 sm:justify-center sm:pt-0 bg-gray-50 dark:bg-gray-950">
				<div>
					<a href="/">
						<h3 className="text-4xl font-bold text-sky-600">Logo</h3>
					</a>
				</div>
				<div className="w-full px-6 py-4 mt-6 overflow-hidden bg-white shadow-md sm:max-w-lg sm:rounded-lg">
					<form onSubmit={handleSubmit}>
						<Input
							type={"email"}
							id={"email"}
							name={"email"}
							label={"Correo"}
							placeholder={"email@example.com"}
							value={formRegistro.email}
							onChange={handleInputChange}
						/>

						<Input
							type={"password"}
							id={"password"}
							name={"password"}
							label={"Contraseña"}
							placeholder={"********"}
							value={formRegistro.password}
							onChange={handleInputChange}
						/>
						{isErrored && <p className="text-red-800 text-xs">{error?.message}</p>}

						<div className="flex items-center mt-4">
							<button
								type="submit"
								className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-sky-700 rounded-md hover:bg-sky-600 focus:outline-none focus:bg-sky-600"
							>
								Iniciar
							</button>
						</div>
					</form>
					<div className="mt-4 dark:text-gray-600">
						No tienes una cuenta?
						<span>
							<a className="text-sky-600 hover:underline ml-1" href="/auth/register">
								Registro
							</a>
						</span>
					</div>
				</div>
			</div>
		</>
	)
}

export default Page
