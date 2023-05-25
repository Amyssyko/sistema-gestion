"use client"
import axios, { AxiosResponse } from "axios"
import { useRouter } from "next/navigation"
import React, { useState, useEffect } from "react"
import toast, { Toaster } from "react-hot-toast"
import Input from "../Input"

interface FormProps {
	onSubmit: (data: FormData) => void
}

interface FormData {
	placa: string
	modelo: string
	capacidad: string
	anio: string
	id_chofer: string
}
interface Chofer {
	dni: string
	nombre: string
	apellido: string
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
		id_chofer: "",
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
		const getChoferData = async () => {
			try {
				const { data } = await axios.get("/api/buses/" + id)
				setFormData({
					placa: data.placa,
					modelo: data.modelo,
					capacidad: data.capacidad,
					anio: data.anio,
					id_chofer: data.id_chofer,
				})
			} catch (error) {
				console.error(error)
			}
		}

		if (id) {
			getChoferData()
		}
	}, [id])

	useEffect(() => {
		const getChoferes = async () => {
			try {
				const response = await axios.get("/api/choferes")
				setChoferes(response.data)
			} catch (error) {
				console.error("Error al obtener los choferes:", error)
			}
		}

		getChoferes()
	}, [])

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		console.log(formData)
		console.log(choferes)
		setFormData((prevFormData) => ({
			...prevFormData,
			id_chofer: selectedDNI,
		}))
		//onSubmit(formData)
		if (!id) {
			try {
				const response: AxiosResponse = await axios.post("/api/buses", formData)

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
		//console.log(selectedDNI)
		//console.log(formData.id_chofer)
		setFormData((prevFormData) => ({
			...prevFormData,
			id_chofer: selectedDNI,
		}))

		try {
			//console.log(formData)
			const response: AxiosResponse = await axios.patch(`/api/buses/${id}`, formData)

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
			const response: AxiosResponse = await axios.post(`/api/buses/${id}`)
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
			router.push("/bus")
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
			<Input
				type="text"
				name="placa"
				id="placa"
				label="Placa:"
				placeholder="ABC0001"
				value={formData.placa}
				onChange={handleInputChange}
			/>

			<Input
				type="text"
				name="modelo"
				id="modelo"
				label="Modelo:"
				placeholder="Mercedez Benz"
				value={formData.modelo}
				onChange={handleInputChange}
			/>

			<Input
				type="number"
				name="capacidad"
				id="capacidad"
				label="Capacidad Pasajeros:"
				placeholder="30"
				value={formData.capacidad}
				onChange={handleInputChange}
			/>

			<Input
				type="number"
				name="anio"
				id="anio"
				label="Año:"
				placeholder="2023"
				value={formData.anio}
				onChange={handleInputChange}
			/>

			<fieldset className="col-span-2">
				<label className="block mb-2 text-sm font-medium text-gray-950 dark:text-white" htmlFor="id_chofer">
					Chofer:
				</label>
				<select
					id="id_chofer"
					name="id_chofer"
					className="border text-sm rounded-lg block w-full p-2.5 bg-white/5 border-gray-600 placeholder-gray-500 text-gray-950 dark:text-white"
					value={selectedDNI}
					onChange={(event) => setSelectedDNI(event.target.value)}
				>
					<option disabled>Seleccionar DNI</option>
					{choferes.map((chofer) => (
						<option key={chofer.dni} value={chofer.dni}>
							{`${chofer.nombre} ${chofer.apellido}`}
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

export default FormBus
