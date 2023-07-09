"use client"
import { useError } from "@/hooks/useError"
import { Input, Card, Typography, Button, Chip, Checkbox } from "@material-tailwind/react"
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
	password: string
	telefono: string
	provincia: string
	ciudad: string
	calle: string
}

const FormChofer: React.FC<Data> = ({ id }) => {
	const [isChecked, setIsChecked] = useState(false)

	const [buses, setBuses] = useState([])
	const [busPlaca, setBusPlaca] = useState("")
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

	const { myError, handleError, isErrored, resetError } = useError()

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		const { name, value } = event.target
		setFormData((prevFormData) => ({ ...prevFormData, [name]: value }))
	}

	const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
		setBusPlaca(event.target.value)
	}
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

	const router = useRouter()
	useEffect(() => {
		const getChoferData = async () => {
			try {
				const { data } = await axios.get(`/api/v2/usuarios/${id}`)
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
				setBusPlaca(data.busPlaca)
			} catch (error) {
				console.error(error)
			}
		}
		if (id) {
			getChoferData()
		}
	}, [id])

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		console.log(isChecked)
		event.preventDefault()
		const { dni, nombre, apellido, email, password, telefono, provincia, ciudad, calle } = formData

		if (!id) {
			try {
				const response: AxiosResponse = await axios.post("/api/v2/usuarios", {
					dni,
					nombre,
					apellido,
					email,
					password,
					telefono,
					provincia,
					ciudad,
					calle,
					busPlaca,
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
					password: "",
					telefono: "",
					provincia: "",
					ciudad: "",
					calle: "",
				})
				setBusPlaca("")
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
			setIsChecked(false)
		}
		window.location.reload()
	}

	const handleUpdate = async () => {
		const { dni, nombre, apellido, email, telefono, provincia, ciudad, calle } = formData
		console.log(String(busPlaca))
		try {
			const response: AxiosResponse = await axios.patch(`/api/v2/usuarios/${id}`, {
				dni,
				nombre,
				apellido,
				email,
				telefono,
				provincia,
				ciudad,
				calle,
				busPlaca,
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
			router.push("/dashboard/lista/usuarios")
		} catch (error: Error | AxiosError | any) {
			console.log(error)

			setFormData({
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
			setIsChecked(false)
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
			router.refresh()
		}
	}

	return (
		<Card color="transparent" shadow={false} className="mx-auto my-12">
			<Typography variant="h4" color="blue-gray" className="mx-auto font-normal">
				Registro de Choferes
			</Typography>
			<Typography color="gray" className="mx-auto font-normal">
				Ingrese los detalles del chofer a registrar
			</Typography>
			<form onSubmit={handleSubmit} className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96 mx-auto">
				<div className="mb-4 flex flex-col gap-6">
					<Input
						size="md"
						type={"text"}
						name={"dni"}
						id={"dni"}
						label={"Cedula"}
						value={formData.dni}
						onChange={handleInputChange}
					/>

					<Input
						size="md"
						type={"text"}
						name={"nombre"}
						id={"nombre"}
						label={"Nombre"}
						value={formData.nombre}
						onChange={handleInputChange}
					/>

					<Input
						size="md"
						type={"text"}
						name={"apellido"}
						id={"apellido"}
						label={"Apellido"}
						value={formData.apellido}
						onChange={handleInputChange}
					/>
					<Input
						size="md"
						type={"email"}
						name={"email"}
						id={"email"}
						label={"Correo"}
						value={formData.email}
						onChange={handleInputChange}
					/>
					<div className="flex flex-col">
						<Input
							disabled={isChecked}
							size="md"
							type={"text"}
							name={"password"}
							id={"password"}
							label={"Contraseña"}
							value={isChecked ? "" : formData.password}
							onChange={handleInputChange}
						/>
						<div className="ml-96 absolute mt-1">
							<Chip
								value="inhabilitar"
								variant="ghost"
								className="bg-white"
								icon={
									<Checkbox
										type="checkbox"
										value="true"
										onChange={(e) => setIsChecked(!isChecked)}
										id="check"
										name="check"
										color="green"
										ripple={false}
										containerProps={{ className: "p-0" }}
										className="border-gray-900 border-2 checked:bg-blue-900 checked:border-green-900 -ml-px before:hidden"
									/>
								}
							/>
						</div>
					</div>

					<Input
						size="md"
						type={"tel"}
						name={"telefono"}
						id={"telefono"}
						maxLength={10}
						label={"Telefono"}
						value={formData.telefono}
						onChange={handleInputChange}
					/>

					<Input
						size="md"
						type={"text"}
						name={"provincia"}
						id={"provincia"}
						label={"Provincia"}
						value={formData.provincia}
						onChange={handleInputChange}
					/>

					<Input
						size="md"
						type={"text"}
						name={"ciudad"}
						id={"ciudad"}
						label={"Ciudad"}
						value={formData.ciudad}
						onChange={handleInputChange}
					/>

					<Input
						size="md"
						type={"text"}
						name={"calle"}
						id={"calle"}
						label={"Dirreción"}
						value={formData.calle}
						minLength={3}
						maxLength={50}
						onChange={handleInputChange}
					/>

					<label className="-mb-6 -mt-5 text-xs ml-3 text-gray-500">Bus</label>
					<select
						className="border border-gray-400 hover:bg-white hover:text-gray-400 text-gray-700 px-4 py-2 rounded-md"
						value={busPlaca}
						onChange={handleSelectChange}
					>
						<option value="0">Selecione Bus</option>
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

export default FormChofer
