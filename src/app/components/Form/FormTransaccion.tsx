"use client"
import axios, { AxiosResponse } from "axios"
import { useRouter } from "next/navigation"
import React, { useState, useEffect } from "react"
import toast from "react-hot-toast"
import Input from "../Input"
import TextArea from "../TextArea"

interface FormProps {
	onSubmit: (data: FormData) => void
}

interface FormData {
	tipo: string
	fecha: Date
	descripcion: string
	monto: number
	id_bus: string
}
interface Bus {
	placa: string
}
interface Data {
	id?: string
}

const FromTransaccion: React.FC<Data> = ({ id }) => {
	const [buses, setBuses] = useState<Bus[]>([])
	const [selectPlaca, setSelectPlaca] = useState("")
	const [selectTipo, setselectTipo] = useState("")

	const [formData, setFormData] = useState<FormData>({
		tipo: "",
		fecha: new Date(),
		descripcion: "",
		monto: 0.0,
		id_bus: "",
	})

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target
		setFormData((prevFormData) => ({
			...prevFormData,
			[name]: value,
		}))
	}

	const router = useRouter()
	useEffect(() => {
		const getBusData = async () => {
			try {
				const { data } = await axios.get("/api/transacciones/" + id)
				setFormData({
					id: data.id,
					tipo: data.tipo,
					fecha: new Date(data.fecha),
					descripcion: data.descripcion,
					monto: data.monto,
					id_bus: data.id_bus,
				})
			} catch (error) {
				console.error(error)
			}
		}

		if (id) {
			getBusData()
		}
	}, [id])

	useEffect(() => {
		const getBuses = async () => {
			try {
				const response = await axios.get("/api/buses")
				setBuses(response.data)
			} catch (error) {
				console.error("Error al obtener los buses:", error)
			}
		}

		getBuses()
	}, [])

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		//console.log(formData)
		//console.log(buses)
		setFormData((prevFormData) => ({
			...prevFormData,
			tipo: selectTipo,
			id_bus: selectPlaca,
		}))
		//onSubmit(formData)
		if (!id) {
			try {
				const response: AxiosResponse = await axios.post("/api/transacciones", formData)

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
		//console.log(selectPlaca)
		//console.log(formData.id_bus)
		setFormData((prevFormData) => ({
			...prevFormData,
			tipo: selectTipo,
			id_bus: selectPlaca,
		}))

		try {
			//console.log(formData)
			const response: AxiosResponse = await axios.patch(`/api/transacciones/${id}`, formData)

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
			const response: AxiosResponse = await axios.post(`/api/transacciones/${id}`)
			//console.log(response)

			if (response.status === 204) {
				//console.log("pasa")
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
			}
			router.push("/transaccion")
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
		<form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
			<fieldset className="col-span-2">
				<label className="block mb-2 text-sm font-medium text-gray-950 dark:text-white" htmlFor="tipo">
					Tipo:
				</label>
				<select
					id="tipo"
					name="tipo"
					className="border text-sm rounded-lg block w-full p-2.5 bg-white/5 border-gray-600 placeholder-gray-500 text-gray-950 dark:text-white"
					value={selectTipo}
					onChange={(event) => setselectTipo(event.target.value)}
				>
					<option disabled>Seleccionar Placa</option>
					<option id="tipo" value="INGRESO">
						INGRESO
					</option>
					<option id="tipo" value="EGRESO">
						EGRESO
					</option>
				</select>
			</fieldset>
			<Input
				type="date"
				name="fecha"
				id="fecha"
				label="Fecha:"
				placeholder="2023-12-12"
				value={formData.fecha}
				onChange={handleInputChange}
			/>

			<TextArea
				type="text"
				name="descripcion"
				id="descripcion"
				label="Capacidad Pasajeros:"
				placeholder="Detalles..."
				value={formData.descripcion}
				onChange={handleInputChange}
				rows={5}
				cols={5}
			/>

			<Input
				type="number"
				name="monto"
				id="monto"
				label="Valor:"
				placeholder="00.00"
				value={formData.monto}
				onChange={handleInputChange}
			/>

			<fieldset className="col-span-2">
				<label className="block mb-2 text-sm font-medium text-gray-950 dark:text-white" htmlFor="id_bus">
					Bus:
				</label>
				<select
					id="id_bus"
					name="id_bus"
					className="border text-sm rounded-lg block w-full p-2.5 bg-white/5 border-gray-600 placeholder-gray-500 text-gray-950 dark:text-white"
					value={selectPlaca}
					onChange={(event) => setSelectPlaca(event.target.value)}
				>
					<option disabled>Seleccionar DNI</option>
					{buses.map((bus) => (
						<option key={bus.placa} value={bus.placa}>
							{`${bus.placa}`}
						</option>
					))}
				</select>
			</fieldset>

			{id ? (
				<div className="flex justify-between items-center col-span-2">
					<button className="bg-blue-800 rounded-md mr-1 py-2 px-4" onClick={handleUpdate}>
						Actualizar
					</button>
					<button className="bg-red-800 rounded-md ml-1 py-2 px-4" onClick={handleDelete}>
						Eliminar
					</button>
				</div>
			) : (
				<div className="flex justify-center col-span-2">
					<button className="bg-blue-800 rounded-md py-2 px-4" type="submit">
						Guardar
					</button>
				</div>
			)}
		</form>
	)
}

export default FromTransaccion
