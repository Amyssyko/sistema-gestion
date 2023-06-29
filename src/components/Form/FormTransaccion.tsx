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
	id?: string
	tipo?: string
	fecha?: Date
	descripcion?: string
	monto?: number
	id_bus?: string
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
		setFormData((prevFormData) => ({
			...prevFormData,
			tipo: selectTipo,
			id_bus: selectPlaca,
		}))
		if (!id) {
			try {
				const response: AxiosResponse = await axios.post("/api/transacciones", formData)

				if (response.status === 201) {
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
		setFormData((prevFormData) => ({
			...prevFormData,
			tipo: selectTipo,
			id_bus: selectPlaca,
		}))

		try {
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

			if (response.status === 204) {
				toast.success("Registro Eliminado", {
					duration: 4000,
					position: "top-right",
					icon: "✅",
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
			<fieldset className="col-span-1">
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

			<fieldset className="col-span-1"></fieldset>
			<Input
				type="date"
				name="fecha"
				id="fecha"
				label="Fecha:"
				value={formData.fecha.toString()}
				onChange={handleInputChange}
			/>

			<Input
				type="number"
				name="monto"
				id="monto"
				label="Valor:"
				placeholder="00.00"
				step="0.01"
				value={formData.monto.toString()}
				onChange={handleInputChange}
			/>

			<fieldset className="col-span-1">
				<label className="block mb-2 text-sm font-medium text-gray-950 dark:text-white" htmlFor="id_bus">
					Bus:
				</label>
				<select
					id="id_bus"
					name="id_bus"
					className="block  placeholder-gray-900 border bg-white dark:bg-black text-gray-950 dark:text-white border-gray-600   text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-900 dark:focus:border-blue-900  "
					value={selectPlaca}
					onChange={(event) => setSelectPlaca(event.target.value)}
				>
					<option className="dark:bg-black  dark:text-white hover:bg-white hover:text-black" value={""}>
						Seleccione Chofer
					</option>
					{buses.map((bus) => (
						<option
							className="dark:bg-black  dark:text-white hover:bg-white hover:text-black"
							key={bus.placa}
							value={bus.placa}
						>
							{`${bus.placa}`}
						</option>
					))}
				</select>
			</fieldset>
			<div className=" col-span-1">
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
			</div>
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
