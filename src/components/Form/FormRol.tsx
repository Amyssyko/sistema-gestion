"use client"
import { useError } from "@/hooks/useError"
import { Input, Card, Typography, Button, Select, Option } from "@material-tailwind/react"
import axios, { AxiosError, AxiosResponse } from "axios"
import { useRouter } from "next/navigation"
import React, { useState, useEffect, ChangeEvent } from "react"
import toast, { Toaster } from "react-hot-toast"

interface FormProps {
	onSubmit: (data: FormData) => void
}

type Data = {
	id?: number
}

interface FormData {
	dni: string
	nombre: string
	apellido: string
	email: string
}

const FormRol: React.FC<Data> = ({ id }) => {
	const [roles, setRoles] = useState([])

	const [role, setRole] = useState("")
	const [formData, setFormData] = useState<FormData>({
		dni: "",
		nombre: "",
		apellido: "",
		email: "",
	})

	const { myError, handleError, isErrored, resetError } = useError()

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		const { name, value } = event.target
		setFormData((prevFormData) => ({ ...prevFormData, [name]: value }))
	}

	useEffect(() => {
		const fetchPets = async () => {
			try {
				const response = await axios.get("/api/v2/roles")
				setRoles(response.data)
			} catch (error) {
				console.error("Error fetching roles:", error)
			}
		}

		fetchPets()
	}, [])

	const router = useRouter()
	useEffect(() => {
		const getChoferData = async () => {
			try {
				const { data } = await axios.get(`/api/v2/roles/${id}`)
				setFormData({
					dni: data.dni,
					nombre: data.nombre,
					apellido: data.apellido,
					email: data.email,
				})
				setRole(data.role)
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
		const { dni, nombre, apellido, email } = formData

		if (!id) {
			try {
				const response: AxiosResponse = await axios.post("/api/v2/usuarios", {
					dni,
					nombre,
					apellido,
					email,
					role,
				})
				if (response.status === 200) {
					toast.success("Registro Creado", {
						duration: 4000,
						position: "top-right",
						icon: "👏",
						iconTheme: {
							primary: "#000",
							secondary: "#fff",
						},
					})
				}
				router.replace("/dashboard/lista/usuarios")
			} catch (error: Error | AxiosError | any) {
				setFormData({
					dni: "",
					nombre: "",
					apellido: "",
					email: "",
				})
				setRole("")
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
			}
			router.refresh()
		}

		try {
			const response: AxiosResponse = await axios.patch(`/api/v2/roles/${id}`, {
				dni,
				nombre,
				apellido,
				email,
				role,
			})
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
			}
			router.push("/dashboard/lista/roles")
		} catch (error: Error | AxiosError | any) {
			console.error(`${error.response.data} (${error.response.status})`)
			if (error.response && error.response.status) {
				handleError(error.response.data)
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
		}
	}

	return (
		<Card color="transparent" shadow={false} className="mx-auto my-12">
			<Typography variant="h4" color="blue-gray" className="mx-auto font-normal">
				Registro de Roles
			</Typography>
			<Typography color="gray" className="mx-auto font-normal">
				Ingrese los detalles de Roles
			</Typography>
			<form onSubmit={handleSubmit} className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96 mx-auto">
				<div className="mb-4 flex flex-col gap-6">
					<Input
						disabled
						size="md"
						type={"text"}
						name={"dni"}
						id={"dni"}
						label={"Cedula"}
						value={formData.dni}
						onChange={handleInputChange}
					/>

					<Input
						disabled
						size="md"
						type={"text"}
						name={"nombre"}
						id={"nombre"}
						label={"Nombre"}
						value={formData.nombre}
						onChange={handleInputChange}
					/>

					<Input
						disabled
						size="md"
						type={"text"}
						name={"apellido"}
						id={"apellido"}
						label={"Apellido"}
						value={formData.apellido}
						onChange={handleInputChange}
					/>

					<Input
						disabled
						size="md"
						type={"email"}
						name={"email"}
						id={"email"}
						label={"Correo"}
						value={formData.email}
						onChange={handleInputChange}
					/>

					<Select label="Roles" name="role" id="role" value={role} onChange={(e) => setRole(e)}>
						<Option value=""> Seleccione un Rol</Option>
						<Option value="admin"> admin</Option>
						<Option value="empleado"> empleado</Option>
					</Select>
				</div>

				{id ? (
					<div className="mt-6 flex justify-center">
						<Button className=" bg-green-800 rounded-md  mx-auto " type="submit">
							Actualizar
						</Button>
					</div>
				) : (
					<div className="flex justify-center">
						<Button
							className=" mt-4 bg-blue-500 py-2 px-6 rounded-md hover:bg-blue-800 border-spacing-2 mx-auto dark:text-white text-white"
							type="submit"
						>
							Guardar
						</Button>
					</div>
				)}
			</form>
		</Card>
	)
}

export default FormRol
