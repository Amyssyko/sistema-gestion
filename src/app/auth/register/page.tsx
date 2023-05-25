"use client"
import Input from "@/app/components/Input"
import axios, { AxiosResponse } from "axios"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "react-hot-toast"
import useError from "@/app/hooks/useError"

interface Registro {
	dni: string
	email: string
	password: string
	confirmPassword: string
}

const Page = ({}) => {
	const router = useRouter()
	const { error, isErrored, handleError, handleNotError } = useError()

	const [formRegistro, setformRegistro] = useState<Registro>({
		dni: "",
		email: "",
		password: "",
		confirmPassword: "",
	})

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		const { name, value } = event.target
		setformRegistro((prevFormData) => ({ ...prevFormData, [name]: value }))
	}

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		const { dni, email, password, confirmPassword } = formRegistro

		if (email.trim() === "" || password.trim() === "" || password.trim() === "") {
			handleError("Verifique que todos los campos sean completados.")
		} else if (password !== confirmPassword) {
			handleError("Verifique la contraseña")
		} else {
			handleNotError()

			try {
				const response: AxiosResponse = await axios.post("/api/register", { dni, email, password })
				//console.log(response)
				if (response.status === 201) {
					console.log("registro creado")
					toast.success("Registrado", {
						duration: 4000,
						position: "top-right",

						// Custom Icon
						icon: "✅",

						// Change colors of success/error/loading icon
						iconTheme: {
							primary: "#000",
							secondary: "#fff",
						},
					})
				}
				//router.push("/auth/login")
			} catch (error: any) {
				toast.error(error.response.data, {
					duration: 4000,
					position: "top-right",

					// Custom Icon
					icon: "❌",

					// Change colors of success/error/loading icon
					iconTheme: {
						primary: "#000",
						secondary: "#fff",
					},
				})
				if (error.response) {
					switch (error.response.status) {
						case 400:
						case 409:
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
							onChange={handleInputChange}
							value={formRegistro.email}
						/>
						<Input
							type={"text"}
							name={"dni"}
							id={"dni"}
							label={"Cedula:"}
							placeholder={"1700236521"}
							value={formRegistro.dni}
							onChange={handleInputChange}
							//maxLength={10}
							//minLength={10}
						/>
						<Input
							type={"password"}
							id={"password"}
							name={"password"}
							label={"Contraseña"}
							placeholder={"********"}
							onChange={handleInputChange}
							value={formRegistro.password}
						/>

						<Input
							type={"password"}
							id={"confirmPassword"}
							name={"confirmPassword"}
							label={"Verificar contraseña"}
							placeholder={"********"}
							onChange={handleInputChange}
							value={formRegistro.confirmPassword}
						/>
						{isErrored && <p className="text-red-800 text-xs">{error?.message}</p>}

						<div className="flex items-center mt-4">
							<button
								type="submit"
								className="w-full px-4 mx-24 py-2 tracking-wide text-white transition-colors duration-200 transform bg-sky-700 rounded-md hover:bg-sky-600 focus:outline-none focus:bg-sky-600"
							>
								Registrar
							</button>
						</div>
					</form>
					<div className="mt-4 text-grey-600">
						Ya tienes una cuenta?
						<span>
							<a className="text-sky-600 hover:text-sky-800  hover:underline ml-1" href="/auth/login">
								Iniciar Sesión
							</a>
						</span>
					</div>
				</div>
			</div>
		</>
	)
}

export default Page
