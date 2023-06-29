"use client"
import { Button, Card, Input, Typography } from "@material-tailwind/react"
import axios, { AxiosError, AxiosResponse } from "axios"
import { useRouter } from "next/navigation"
import React, { useState, useEffect } from "react"
import toast from "react-hot-toast"

interface FormProps {
	onSubmit: (data: FormData) => void
}

interface FormData {
	placa: string
	modelo: string
	capacidad: string
	anio: string
}

interface Chofer {
	dni?: string
	nombre?: string
	apellido?: string
}

type Data = {
	id?: string
}

const FormBus: React.FC<Data> = ({ id }) => {
	const [choferes, setChoferes] = useState<Chofer[]>([])
	const [selectedDNI, setSelectedDNI] = useState("")

	const [formData, setFormData] = useState<FormData>({
		placa: "",
		modelo: "",
		capacidad: "",
		anio: "",
	})

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		const { name, value } = event.target
		setFormData((prevFormData) => ({ ...prevFormData, [name]: value }))
	}
	const router = useRouter()

	useEffect(() => {
		const getChoferData = async () => {
			try {
				const { data } = await axios.get(`/api/v2/buses/${id}`)
				setFormData({
					placa: data.placa,
					modelo: data.modelo,
					capacidad: data.capacidad,
					anio: data.anio,
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
		const { placa, modelo, capacidad, anio } = formData

		try {
			const response: AxiosResponse = await axios.post("/api/v2/buses", { placa, modelo, capacidad, anio })
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
			router.push("/dashboard/lista/buses")
		} catch (error: Error | AxiosError | any) {
			setFormData({ placa: "", modelo: "", capacidad: "", anio: "" })
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

	const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		const { placa, modelo, capacidad, anio } = formData

		try {
			const response: AxiosResponse = await axios.patch(`/api/v2/buses/${id}`, {
				placa,
				modelo,
				capacidad,
				anio,
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
			router.push("/dashboard/lista/buses")
		} catch (error: Error | AxiosError | any) {
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
		}
	}

	return (
		<Card color="transparent" shadow={false} className="mx-auto my-24">
			<Typography variant="h4" color="blue-gray" className="mx-auto font-normal">
				Registro de Choferes
			</Typography>
			<Typography color="gray" className="mx-auto font-normal">
				Ingrese los detalles del chofer a registrar
			</Typography>
			<form onSubmit={handleSubmit} className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96 mx-auto">
				<div className="mb-4 flex flex-col gap-6">
					<Input
						type="text"
						name="placa"
						id="placa"
						label="Placa"
						value={formData.placa}
						onChange={handleInputChange}
					/>

					<Input
						type="text"
						name="modelo"
						id="modelo"
						label="Modelo"
						value={formData.modelo}
						onChange={handleInputChange}
					/>
					<Input
						type="number"
						name="capacidad"
						id="capacidad"
						label="Capacidad Pasajeros"
						value={formData.capacidad}
						onChange={handleInputChange}
						min={20}
						max={45}
					/>

					<Input
						type="number"
						name="anio"
						id="anio"
						label="Año"
						value={formData.anio}
						onChange={handleInputChange}
						min={2000}
						max={2025}
					/>
				</div>

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
