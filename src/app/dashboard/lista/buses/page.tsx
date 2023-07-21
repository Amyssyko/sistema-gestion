"use client"

import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid"
import {
	Card,
	CardHeader,
	Typography,
	Button,
	CardBody,
	IconButton,
	Tooltip,
	Spinner,
} from "@material-tailwind/react"
import Link from "next/link"
import { useEffect, useState } from "react"
import axios, { AxiosError, AxiosResponse } from "axios"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Layout } from "@/components/Layout"
import Loading from "@/components/Loading"
import NoAdmin from "@/components/NoAdmin"

const TABLE_HEAD = [
	"Placa",
	"Modelo",
	"Capacidad",
	"Año",
	"Fecha Creación",
	"Fecha Actualización",
	"Actualizar",
	"Eliminar",
]

export default function Page() {
	const { data: session } = useSession()
	const rol = session?.user.role

	const [buses, setBuses] = useState([])

	const router = useRouter()

	const Cargando = () => {
		if (session?.user?.role === undefined) {
			return <Loading />
		}
	}
	const SinAcceso = () => {
		if (session?.user?.role !== "admin") {
			return <NoAdmin />
		}
	}
	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch("/api/v2/buses")
				const data = await response.json()
				setBuses(data)
			} catch (error: Error | AxiosError | any) {
				console.error(`${error?.response?.data} (${error?.response?.status})`)
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
		}
		fetchData()
	}, [])

	const handleDelete = async ({ placa }: { placa: String }) => {
		try {
			const response: AxiosResponse = await axios.post(`/api/v2/buses/${placa} `)
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
		}
		window.location.reload()
	}

	return (
		<div>
			{Cargando()}
			{SinAcceso()}
			<Layout>
				<Card className="h-full w-full">
					<CardHeader floated={false} shadow={false} className="rounded-none">
						<div className="mb-8 flex items-center justify-center gap-8">
							<div>
								<Typography variant="h5" color="blue-gray" className="text-center">
									Lista de Buses
								</Typography>
								<Typography color="gray" className="mt-1 font-normal">
									Informacion de los buses registrados
								</Typography>
							</div>
						</div>
					</CardHeader>
					<CardBody className="overflow-scroll px-0">
						<table className="mt-4 w-full min-w-max table-auto text-left">
							<thead>
								<tr>
									{TABLE_HEAD.map((head) => (
										<th key={head} className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
											<Typography
												variant="small"
												color="blue-gray"
												className=" leading-none opacity-70 font-bold"
											>
												{head}
											</Typography>
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{buses &&
									buses.map(({ placa, modelo, capacidad, anio, createdAt, updatedAt }, index) => {
										const isLast = index === buses.length - 1
										const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50"

										return (
											<tr key={index}>
												<td className={classes}>
													<div className="flex items-center gap-3">
														<div className="flex flex-col">
															<Typography variant="small" color="blue-gray" className="font-normal ">
																{placa}
															</Typography>
														</div>
													</div>
												</td>
												<td className={classes}>
													<div className="flex flex-col">
														<Typography variant="small" color="blue-gray" className="font-normal">
															{modelo}
														</Typography>
													</div>
												</td>
												<td className={classes}>
													<div className="flex flex-col">
														<Typography variant="small" color="blue-gray" className="font-normal">
															{capacidad}
														</Typography>
													</div>
												</td>
												<td className={classes}>
													<div className="flex flex-col">
														<Typography variant="small" color="blue-gray" className="font-normal">
															{anio}
														</Typography>
													</div>
												</td>
												<td className={classes}>
													<div className="flex flex-col">
														<Typography variant="small" color="blue-gray" className="font-normal">
															{createdAt}
														</Typography>
													</div>
												</td>
												<td className={classes}>
													<div className="flex flex-col">
														<Typography variant="small" color="blue-gray" className="font-normal">
															{updatedAt}
														</Typography>
													</div>
												</td>

												<td className={classes}>
													<Link href={`/dashboard/entidad/buses/${placa}`}>
														<Button color="green" size="sm">
															<Tooltip content="Editar Bus">
																<IconButton variant="text" color="blue-gray">
																	<PencilIcon className="h-4 w-4" />
																</IconButton>
															</Tooltip>
														</Button>
													</Link>
												</td>
												<td className={classes}>
													<Button
														disabled={rol !== "admin"}
														onClick={() => handleDelete({ placa })}
														size="sm"
														color="red"
													>
														<Tooltip content="Eliminar Bus">
															<IconButton variant="text" color="blue-gray">
																<TrashIcon className="h-4 w-4" />
															</IconButton>
														</Tooltip>
													</Button>
												</td>
											</tr>
										)
									})}
							</tbody>
						</table>
					</CardBody>
				</Card>
			</Layout>
		</div>
	)
}
