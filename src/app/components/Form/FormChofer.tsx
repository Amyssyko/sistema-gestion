"use client"
import axios, { AxiosResponse } from "axios"
import { useRouter } from "next/navigation"
import React, { useState, useEffect } from "react"
import toast, { Toaster } from "react-hot-toast"
import Input from "../Input"
interface FormProps {
	onSubmit: (data: FormData) => void
}

type Data = {
	id?: string
}

interface FormData {
	dni: string
	nombre: string
	apellido: string
	email: string
	password: string
	telefono: string
	provincia: string
	ciudad: string
	calle: string
}

const FormChofer: React.FC<Data> = ({ id }) => {
	const [formData, setFormData] = useState<FormData>({
		dni: "",
		nombre: "",
		apellido: "",
		email: "",
		password: "",
		telefono: "",
		provincia: "",
		ciudad: "",
		calle: "",
	})

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		const { name, value } = event.target
		setFormData((prevFormData) => ({ ...prevFormData, [name]: value }))
	}

	const router = useRouter()
	useEffect(() => {
		const getChoferData = async () => {
			try {
				const { data } = await axios.get("/api/choferes/" + id)
				setFormData({
					dni: data.dni,
					nombre: data.nombre,
					apellido: data.apellido,
					email: data.email,
					password: data.password,
					telefono: data.telefono,
					provincia: data.provincia,
					ciudad: data.ciudad,
					calle: data.calle,
				})
			} catch (error) {
				console.error(error)
			}
		}
		if (id) {
			getChoferData()
		}
	}, [id])

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		if (!id) {
			try {
				const response: AxiosResponse = await axios.post("/api/choferes", formData)

				if (response.status === 201) {
					console.log("registro creado")
					toast.success("Registro Creado", {
						duration: 4000,
						position: "top-right",

						// Custom Icon
						icon: "👏",

						// Change colors of success/error/loading icon
						iconTheme: {
							primary: "#000",
							secondary: "#fff",
						},
					})
				}
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

			router.refresh()
		}
	}

	const handleUpdate = async () => {
		try {
			const response: AxiosResponse = await axios.patch(`/api/choferes/${id}`, formData)
			//console.log(response)
			if (response.status === 200) {
				toast.success("Registro Actualizado", {
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
				console.log("registro actualizado")
			}
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

	const handleDelete = async () => {
		try {
			const response: AxiosResponse = await axios.post(`/api/choferes/${id}`)
			console.log(response)
			if (response.status === 200) {
				toast.success("Registro Eliminado", {
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
				console.log("registro eliminado")
				router.refresh()
			}
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
				console.log(`Error: ${error.response.data} (${error.response.status})`)
			} else if (error.request) {
				console.log(`Error de solicitud (${error.request.status})`)
			} else {
				console.log(`Error desconocido: ${error.message}`)
			}
		}
	}

	return (
		<form onSubmit={handleSubmit} className="grid  grid-rows-1 grid-cols-1 ">
			<div>
				<Input
					type={"text"}
					name={"dni"}
					id={"dni"}
					label={"Cedula:"}
					placeholder={"1700236521"}
					value={formData.dni}
					onChange={handleInputChange}
					//maxLength={10}
					//minLength={10}
				/>
			</div>
			<div>
				<Input
					type={"text"}
					name={"nombre"}
					id={"nombre"}
					label={"Nombre:"}
					placeholder={"Maria"}
					value={formData.nombre}
					onChange={handleInputChange}
				/>
			</div>
			<div>
				<Input
					type={"text"}
					name={"apellido"}
					id={"apellido"}
					label={"Apellido:"}
					placeholder={"Martinez"}
					value={formData.apellido}
					onChange={handleInputChange}
				/>
			</div>
			<div>
				<Input
					type={"email"}
					name={"email"}
					id={"email"}
					label={"Correo:"}
					placeholder={"email@gmail.com"}
					value={formData.email}
					onChange={handleInputChange}
				/>
			</div>
			<div>
				<Input
					type={"text"}
					name={"password"}
					id={"password"}
					label={"Contraseña:"}
					placeholder={"********"}
					value={formData.password}
					//minLength={8}
					onChange={handleInputChange}
				/>
			</div>
			<div>
				<Input
					type={"tel"}
					name={"telefono"}
					id={"telefono"}
					label={"Telefono:"}
					placeholder={"0912345678"}
					value={formData.telefono}
					//maxLength={10}
					//minLength={10}
					onChange={handleInputChange}
				/>
			</div>
			<div>
				<Input
					type={"text"}
					name={"provincia"}
					id={"provincia"}
					label={"Provincia:"}
					placeholder={"Cotopaxi"}
					value={formData.provincia}
					onChange={handleInputChange}
				/>
			</div>
			<div>
				<Input
					type={"text"}
					name={"ciudad"}
					id={"ciudad"}
					label={"Ciudad:"}
					placeholder={"Latacunga"}
					value={formData.ciudad}
					//minLength={3}
					//maxLength={50}
					onChange={handleInputChange}
				/>
			</div>
			<div>
				<Input
					type={"text"}
					name={"calle"}
					id={"calle"}
					label={"Calle:"}
					placeholder={"Av. Luis Torres..."}
					value={formData.calle}
					minLength={3}
					maxLength={50}
					onChange={handleInputChange}
				/>
			</div>
			{id ? (
				<div className="flex justify-between items-center mx-auto my-2">
					<button className=" bg-blue-800 rounded-md mr-1 w-auto" onClick={handleUpdate}>
						Actualizar
					</button>
					<button className=" bg-red-800 rounded-md ml-1 w-auto" onClick={handleDelete}>
						Eliminar
					</button>
				</div>
			) : (
				<div className="flex justify-center">
					<button
						className=" mt-4 bg-blue-500 py-2 px-6 rounded-md hover:bg-blue-600 border-spacing-2  w-4/12 sm:w-2/12 md:w-2/12 lg:w-24 xl:w-1/12 2xl:w-2/12  dark:text-white text-black"
						type="submit"
					>
						Guardar
					</button>
				</div>
			)}
		</form>
	)
}

export default FormChofer
