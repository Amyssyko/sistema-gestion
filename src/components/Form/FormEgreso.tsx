"use client"
import { useError } from "@/hooks/useError"
import { Input, Card, Typography, Button } from "@material-tailwind/react"
import axios, { AxiosError, AxiosResponse } from "axios"
import { useRouter } from "next/navigation"
import React, { useState, useEffect, ChangeEvent } from "react"
import toast from "react-hot-toast"
import Loading from "../Loading"
import NoAdmin from "../NoAdmin"
import { useSession } from "next-auth/react"

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
	const { data: session } = useSession()
	const rol = session?.user.role
	const Cargando = () => {
		if (session?.user.role === undefined) {
			setTimeout(() => {
				router.push("/")
			}, 4000)
			return <Loading />
		}
	}
	const SinAcceso = () => {
		if (session?.user.role !== "admin" && session?.user.role !== "empleado") {
			return <NoAdmin />
		}
	}

	const [buses, setBuses] = useState([])
	const [proveedores, setProveedores] = useState([])
	const [proveedorId, setProveedorId] = useState("")
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

	const handleChangeBus = (event: ChangeEvent<HTMLSelectElement>) => {
		setBusId(event.target.value)
	}
	const handleChangeProveedor = (event: ChangeEvent<HTMLSelectElement>) => {
		setProveedorId(event.target.value)
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
		const fetchProveedores = async () => {
			try {
				const response = await axios.get("/api/v2/proveedores")
				setProveedores(response.data)
			} catch (error) {
				console.error("Error fetching proveedores:", error)
			}
		}

		fetchProveedores()
	}, [])

	useEffect(() => {
		const getEgreso = async () => {
			try {
				const { data } = await axios.get(`/api/v2/egresos/${id}`)
				setFormData({
					fecha: data.fecha.slice(0, 10),
					descripcion: data.descripcion,
					monto: data.monto,
				})
				setBusId(data.busId)
				setProveedorId(data.proveedorId)
			} catch (error) {
				console.error(error)
			}
		}
		if (id) {
			getEgreso()
		}
	}, [id])

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const { fecha, descripcion, monto } = formData

		try {
			const response: AxiosResponse = await axios.post("/api/v2/egresos", {
				fecha,
				descripcion,
				monto,
				busId,
				proveedorId,
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
			if (rol === "admin") {
				return router.replace("/dashboard/lista/ingresos")
			}
			if (rol === "empleado") {
				return router.replace("/ingresos/lista")
			}
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

	const handleUpdate = async (event: any) => {
		event.preventDefault()

		const { fecha, descripcion, monto } = formData

		try {
			const response: AxiosResponse = await axios.patch(`/api/v2/egresos/${id}`, {
				fecha,
				descripcion,
				monto,
				busId,
				proveedorId,
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
			if (rol === "admin") {
				return router.replace("/dashboard/lista/egresos")
			}
			if (rol === "empleado") {
				return router.replace("/ingresos/lista")
			}
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
		<div>
			{Cargando()}
			{SinAcceso()}
			<Card color="transparent" shadow={false} className="mx-auto my-12">
				<Typography variant="h4" color="blue-gray" className="mx-auto font-normal">
					{id ? `Registro de Egreso de Bus ${busId}` : `Registro de Egreso de Bus`}
				</Typography>
				<Typography color="gray" className="mx-auto font-normal">
					{`Ingrese los detalles de engreso`}
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

						<label className="-mb-6 -mt-5 text-xs ml-4 text-blue-gray-400">Bus</label>
						<select
							className="border border-spacing-12 text-base border-gray-400 focus:border-blue-400 hover:bg-white hover:text-gray-600 text-blue-gray-400 px-4 py-2 rounded-md bg-white"
							value={busId}
							onChange={handleChangeBus}
						>
							<option value="">Selecione Bus</option>
							{buses.map(({ placa }) => (
								<option key={placa} value={placa}>
									{placa}
								</option>
							))}
						</select>

						<label className="-mb-6 -mt-5 text-xs ml-4 text-blue-gray-400">Proveedor</label>
						<select
							className="border border-spacing-12 text-base border-gray-400 focus:border-blue-400 hover:bg-white hover:text-gray-600 text-blue-gray-400 px-4 py-2 rounded-md bg-white"
							value={proveedorId}
							onChange={handleChangeProveedor}
						>
							<option value="">Selecione Proveedor</option>
							{proveedores.map(({ id, nombre }) => (
								<option key={id} value={id}>
									{nombre}
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
		</div>
	)
}

export default FormIngreso
