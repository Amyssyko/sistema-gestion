"use client"
import { useError } from "@/hooks/useError"
import { Input, Card, Typography, Button } from "@material-tailwind/react"
import axios, { AxiosError, AxiosResponse } from "axios"
import { useRouter } from "next/navigation"
import React, { useState, useEffect, ChangeEvent } from "react"
import toast from "react-hot-toast"

interface FormProps {
	onSubmit: (data: FormData) => void
}

type Data = {
	id?: number
}

interface FormData {
	fecha: string
	descripcion: string
	monto: string
}

const FormIngreso: React.FC<Data> = ({ id }) => {
	const [buses, setBuses] = useState([])
	const [busId, setBusId] = useState("")
	const [formData, setFormData] = useState<FormData>({
		fecha: "",
		descripcion: "",
		monto: "",
	})

	const { myError, handleError, isErrored, resetError } = useError()

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		const { name, value } = event.target
		setFormData((prevFormData) => ({ ...prevFormData, [name]: value }))
	}

	const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
		setBusId(event.target.value)
	}
	const router = useRouter()

	useEffect(() => {
		const fetchPets = async () => {
			try {
				const response = await axios.get("/api/v2/buses")
				setBuses(response.data)
			} catch (error) {
				console.error("Error fetching buses:", error)
			}
		}

		fetchPets()
	}, [])

	useEffect(() => {
		const getChoferData = async () => {
			try {
				const { data } = await axios.get(`/api/v2/ingresos/${id}`)
				setFormData({
					fecha: data.fecha.slice(0, 10),
					descripcion: data.descripcion,
					monto: data.monto,
				})
				setBusId(data.busId)
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
		const { fecha, descripcion, monto } = formData

		try {
			const response: AxiosResponse = await axios.post("/api/v2/ingresos", {
				fecha,
				descripcion,
				monto,
				busId,
			})
			if (response.status === 201) {
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
			router.replace("/dashboard/lista/ingresos")
		} catch (error: Error | AxiosError | any) {
			setFormData({
				fecha: "",
				descripcion: "",
				monto: "",
			})
			setBusId("")
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

		const { fecha, descripcion, monto } = formData

		try {
			const response: AxiosResponse = await axios.patch(`/api/v2/ingresos/${id}`, {
				fecha,
				descripcion,
				monto,
				busId,
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
			router.push("/dashboard/lista/ingresos")
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
		<Card color="transparent" shadow={false} className="mx-auto my-12">
			<Typography variant="h4" color="blue-gray" className="mx-auto font-normal">
				{id ? `Registro de Ingresos de Bus ${busId}` : `Registro de Ingresos de Bus`}
			</Typography>
			<Typography color="gray" className="mx-auto font-normal">
				{`Ingrese los detalles de ingresos`}
			</Typography>
			<form onSubmit={handleSubmit} className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96 mx-auto">
				<div className="mb-4 flex flex-col gap-6">
					<Input
						size="md"
						type={"text"}
						name={"descripcion"}
						id={"descripcion"}
						label={"Descripción"}
						value={formData.descripcion}
						onChange={handleInputChange}
					/>

					<Input
						size="md"
						type={"date"}
						name={"fecha"}
						id={"fecha"}
						label={"Fecha"}
						value={formData.fecha}
						onChange={handleInputChange}
					/>
					<Input
						size="md"
						type={"number"}
						name={"monto"}
						id={"monto"}
						label={"Monto"}
						value={formData.monto}
						onChange={handleInputChange}
					/>

					<label className="-mb-6 -mt-5 text-xs ml-3 text-gray-500"> Bus</label>
					<select
						className="border border-gray-400 hover:bg-white hover:text-gray-400 text-gray-700 px-4 py-2 rounded-md"
						value={busId}
						onChange={handleSelectChange}
					>
						<option value="">Selecione Bus</option>
						{buses.map(({ placa }) => (
							<option key={placa} value={placa}>
								{placa}
							</option>
						))}
					</select>
				</div>

				{id ? (
					<div className="mt-6 flex justify-center">
						<Button className=" bg-green-800 rounded-md  mx-auto " onClick={handleUpdate}>
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

export default FormIngreso
