"use client"

import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid"
import {
	Card,
	CardHeader,
	Typography,
	Button,
	CardBody,
	Avatar,
	IconButton,
	Tooltip,
} from "@material-tailwind/react"
import Link from "next/link"
import { useEffect, useState } from "react"
import axios, { AxiosError, AxiosResponse } from "axios"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Loading from "@/components/Loading"
import NoAdmin from "@/components/NoAdmin"
import { LayoutHome } from "@/components/Layout/LayoutHome"

const TABLE_HEAD = [
	"ID",
	"Fecha",
	"Descripción",
	"Monto",
	"Bus",
	"Proveedor",
	"Fecha Creacion",
	"Fecha Actualización",
	"Actualizar",
	"Eliminar",
]

export default function Page() {
	const { data: session } = useSession()
	const rol = session?.user.role

	const [egresos, setEgresos] = useState([])

	const router = useRouter()

	const Cargando = () => {
		if (session?.user.role === undefined) {
			return <Loading />
		}
	}
	const SinAcceso = () => {
		if (session?.user.role !== "admin" && session?.user.role !== "empleado") {
			return <NoAdmin />
		}
	}

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch("/api/v2/egresos")
				const data = await response.json()
				setEgresos(data)
			} catch (error: Error | AxiosError | any) {
				console.error(`${error?.response?.data} (${error?.response?.status})`)
				if (error.response && error.response.status) {
					toast.error(error.response.data, {
						duration: 4000,
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

	const handleDelete = async ({ id }: { id: Number }) => {
		try {
			const response: AxiosResponse = await axios.post(`/api/v2/egresos/${id} `)
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
				window.location.reload()
			}
		} catch (error: Error | AxiosError | any) {
			console.error(`${error.response.data} (${error.response.status})`)
			if (error.response && error.response.status) {
				toast.error(error.response.data, {
					duration: 4000,
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

	return (
		<div>
			{Cargando()}
			{SinAcceso()}
			<LayoutHome>
				<Card className="h-full  max-w-screen-2xl mx-auto ">
					<CardHeader floated={false} shadow={false} className="rounded-none">
						<div className="mb-8 flex items-center justify-center gap-8">
							<div>
								<Typography variant="h5" color="blue-gray" className="text-center">
									Lista de Egresos Registrados
								</Typography>
								<Typography color="gray" className="mt-1 font-normal">
									Información de todos los egresos registrados
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
								{egresos &&
									egresos.map(
										({ id, fecha, descripcion, monto, busId, proveedorId, createdAt, updatedAt }, index) => {
											const isLast = index === egresos.length - 1
											const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50"

											return (
												<tr key={id}>
													<td className={classes}>
														<div className="flex items-center gap-3">
															<div className="flex flex-col">
																<Typography variant="small" color="blue-gray" className="font-normal ">
																	{id}
																</Typography>
															</div>
														</div>
													</td>
													<td className={classes}>
														<div className="flex flex-col">
															<Typography variant="small" color="blue-gray" className="font-normal">
																{fecha}
															</Typography>
														</div>
													</td>
													<td className={classes}>
														<div className="flex flex-col">
															<Typography variant="small" color="blue-gray" className="font-normal">
																{descripcion}
															</Typography>
														</div>
													</td>
													<td className={classes}>
														<div className="flex flex-col">
															<Typography variant="small" color="blue-gray" className="font-normal">
																{monto}
															</Typography>
														</div>
													</td>
													<td className={classes}>
														<div className="flex flex-col">
															<Typography variant="small" color="blue-gray" className="font-normal">
																{busId}
															</Typography>
														</div>
													</td>
													<td className={classes}>
														<div className="flex flex-col">
															<Typography variant="small" color="blue-gray" className="font-normal">
																{proveedorId}
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
														<Link href={`/dashboard/entidad/egresos/${id}`}>
															<Button color="green" size="sm">
																<Tooltip content="Editar Egreso">
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
															onClick={() => handleDelete({ id })}
															size="sm"
															color="red"
														>
															<Tooltip content="Eliminar Egreso">
																<IconButton variant="text" color="blue-gray">
																	<TrashIcon className="h-4 w-4" />
																</IconButton>
															</Tooltip>
														</Button>
													</td>
												</tr>
											)
										}
									)}
							</tbody>
						</table>
					</CardBody>
				</Card>
			</LayoutHome>
		</div>
	)
}
