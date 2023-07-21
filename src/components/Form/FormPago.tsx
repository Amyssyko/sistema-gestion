"use client"
import { useError } from "@/hooks/useError"
import { Input, Card, Typography, Button } from "@material-tailwind/react"
import axios, { AxiosError, AxiosResponse } from "axios"
import { useRouter } from "next/navigation"
import React, { useState, useEffect, ChangeEvent } from "react"
import toast from "react-hot-toast"
import Notification from "../Alert"

interface FormProps {
	onSubmit: (data: FormData) => void
}

type Data = {
	id?: number
}

interface FormData {
	valor: string
	detalle: string
	fecha: string
}

const FormIngreso: React.FC<Data> = ({ id }) => {
	const [usuarios, setUsuarios] = useState([])
	const [usuarioId, setUsuarioId] = useState("")

	const [formData, setFormData] = useState<FormData>({
		valor: "",
		detalle: "",
		fecha: "",
	})
	const { myError, handleError, isErrored } = useError()

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		const { name, value } = event.target
		setFormData((prevFormData) => ({ ...prevFormData, [name]: value }))
	}

	const handleSelect = (event: ChangeEvent<HTMLSelectElement>) => {
		setUsuarioId(event.target.value)
	}

	const router = useRouter()

	useEffect(() => {
		const fetchUsuarios = async () => {
			try {
				const response = await axios.get("/api/v2/usuarios")
				setUsuarios(response.data)
			} catch (error) {
				console.error("Error fetching usuarios:", error)
			}
		}

		fetchUsuarios()
	}, [])

	useEffect(() => {
		const fetchPagos = async () => {
			try {
				const { data } = await axios.get(`/api/v2/pagos/${id}`)
				setFormData({
					valor: data.valor,
					detalle: data.detalle,
					fecha: data.fecha.slice(0, 10),
				})
				setUsuarioId(data.usuarioId)
			} catch (error) {
				console.error(error)
			}
		}
		if (id) {
			fetchPagos()
		}
	}, [id])

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const { valor, detalle, fecha } = formData

		try {
			const response: AxiosResponse = await axios.post("/api/v2/pagos", {
				valor,
				detalle,
				fecha,
				usuarioId,
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
			router.push("/dashboard/lista/pagos")
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
		}
		router.refresh()
	}

	const handleUpdate = async (event: any) => {
		event.preventDefault()

		const { valor, detalle, fecha } = formData

		try {
			const response: AxiosResponse = await axios.patch(`/api/v2/pagos/${id}`, {
				valor,
				detalle,
				fecha,
				usuarioId,
			})

			if (response.status === 201) {
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
			router.push("/dashboard/lista/pagos")
		} catch (error: Error | AxiosError | any) {
			console.error(`${error.response.data} (${error.response.status})`)
			if (error.response && error.response.status) {
				handleError(error.response.data)

				/**toast.error(error.response.data, {
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
		<Card color="transparent" shadow={false} className="mx-auto my-12">
			<Typography variant="h4" color="blue-gray" className="mx-auto font-normal">
				{id ? `Registro de Pago de Usuario ${id}` : `Registro de Pago de Usuario`}
			</Typography>
			<Typography color="gray" className="mx-auto font-normal">
				{`Ingrese los detalles de pago`}
			</Typography>
			<form onSubmit={handleSubmit} className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96 mx-auto">
				<div className="mb-4 flex flex-col gap-6">
					<Input
						size="md"
						type={"text"}
						name={"detalle"}
						id={"detalle"}
						label={"Descripción"}
						value={formData.detalle}
						onChange={handleInputChange}
					/>

					<Input
						size="md"
						type={"number"}
						name={"valor"}
						id={"valor"}
						label={"Valor"}
						value={formData.valor}
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

					<label className="-mb-6 -mt-5 text-xs ml-3 text-gray-500">Usuarios</label>
					<select
						className="border border-gray-400 hover:bg-white hover:text-gray-400 text-gray-700 px-4 py-2 rounded-md"
						value={usuarioId}
						onChange={handleSelect}
					>
						<option className="text-red-800" value="">
							Selecione Usuario
						</option>
						{usuarios.map(({ id, nombre, apellido, dni }) => (
							<option className="text-black" key={id} value={id}>
								{nombre && apellido ? `${dni}  ${nombre} ${apellido}` : `${dni} `}
							</option>
						))}
					</select>
				</div>
				{isErrored && <Notification mensaje={myError?.message} />}

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
