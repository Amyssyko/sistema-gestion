"use client"
import { useError } from "@/hooks/useError"
import { Button, Card, Input, Typography } from "@material-tailwind/react"
import axios, { AxiosError, AxiosResponse } from "axios"
import { useRouter } from "next/navigation"
import React, { useState, useEffect } from "react"
import toast from "react-hot-toast"
import Notification from "../Alert"

interface FormProps {
	onSubmit: (data: FormData) => void
}

interface FormData {
	nombre: string
	telefono: string
	email: string
	direccion: string
}

type Data = {
	id?: number
}

const FormBus: React.FC<Data> = ({ id }) => {
	const [formData, setFormData] = useState<FormData>({
		nombre: "",
		telefono: "",
		email: "",
		direccion: "",
	})

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		const { name, value } = event.target
		setFormData((prevFormData) => ({ ...prevFormData, [name]: value }))
	}
	const router = useRouter()
	const { myError, handleError, isErrored } = useError()

	useEffect(() => {
		const getChoferData = async () => {
			try {
				const { data } = await axios.get(`/api/v2/proveedores/${id}`)
				setFormData({
					nombre: data.nombre,
					telefono: data.telefono,
					email: data.email,
					direccion: data.direccion,
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
		const { nombre, telefono, email, direccion } = formData

		try {
			const response: AxiosResponse = await axios.post("/api/v2/proveedores", {
				nombre,
				telefono,
				email,
				direccion,
			})
			if (response.status === 201) {
				toast.success("Registro Creado", {
					duration: 4000,
					position: "top-right",
					icon: "✅",
					iconTheme: {
						primary: "#000",
						secondary: "#fff",
					},
				})
			}
			router.push("/dashboard/lista/proveedores")
		} catch (error: Error | AxiosError | any) {
			setFormData({ nombre: "", telefono: "", email: "", direccion: "" })
			console.error(`${error.response.data} (${error.response.status})`)
			if (error.response && error.response.status) {
				handleError(error.response.data)
				/**
				toast.error(error.response.data, {
					duration: 3000,
					position: "top-left",
					icon: "❌",
					iconTheme: {
						primary: "#000",
						secondary: "#fff",
					},
				})
 */
			}
		}
		router.refresh()
	}

	const handleUpdate = async (event: any) => {
		event.preventDefault()

		const { nombre, telefono, email, direccion } = formData

		try {
			const response: AxiosResponse = await axios.patch(`/api/v2/proveedores/${id}`, {
				nombre,
				telefono,
				email,
				direccion,
			})
			if (response.status === 200) {
				toast.success("Registro Actualizado", {
					duration: 4000,
					position: "top-right",
					icon: "✅",
					iconTheme: {
						primary: "#000",
						secondary: "#fff",
					},
				})
			}
			router.push("/dashboard/lista/proveedores")
		} catch (error: Error | AxiosError | any) {
			console.error(`${error.response.data} (${error.response.status})`)
			if (error.response && error.response.status) {
				handleError(error.response.data)
				/**
				toast.error(error.response.data, {
					duration: 3000,
					position: "top-left",
					icon: "❌",
					iconTheme: {
						primary: "#000",
						secondary: "#fff",
					},
				}) */
			}
			router.refresh()
		}
	}

	return (
		<Card color="transparent" shadow={false} className="mx-auto my-24">
			<Typography variant="h4" color="blue-gray" className="mx-auto font-normal">
				Registro de Proveedores
			</Typography>
			<Typography color="gray" className="mx-auto font-normal">
				Ingrese los detalles del proveedor a registrar
			</Typography>
			<form onSubmit={handleSubmit} className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96 mx-auto">
				<div className="mb-4 flex flex-col gap-6">
					<Input
						type="text"
						name="nombre"
						id="nombre"
						label="Proveedor"
						value={formData.nombre}
						onChange={handleInputChange}
					/>

					<Input
						type="text"
						name="telefono"
						id="telefono"
						label="Telefono"
						value={formData.telefono}
						onChange={handleInputChange}
						maxLength={10}
					/>
					<Input
						type="text"
						name="email"
						id="email"
						label="Correo"
						value={formData.email}
						onChange={handleInputChange}
					/>

					<Input
						type="text"
						name="direccion"
						id="direccion"
						label="Direccion"
						value={formData.direccion}
						onChange={handleInputChange}
						min={2000}
						max={2025}
					/>
				</div>
				{isErrored && <Notification mensaje={myError?.message} />}

				{id ? (
					<div className="mt-6 flex justify-center">
						<Button className=" bg-green-800 rounded-md  mx-auto " onClick={handleUpdate}>
							Actualizar
						</Button>
					</div>
				) : (
					<div className="flex justify-center col-span-2">
						<Button className="bg-blue-800 rounded-md py-2 px-4" type="submit">
							Guardar
						</Button>
					</div>
				)}
			</form>
		</Card>
	)
}

export default FormBus
