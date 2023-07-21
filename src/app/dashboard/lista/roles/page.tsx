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
import { Layout } from "@/components/Layout"
import Loading from "@/components/Loading"
import NoAdmin from "@/components/NoAdmin"

const TABLE_HEAD = [
	"Cedula",
	"Nombre",
	"Apellido",
	"Email",
	"Telefono",
	"Provincia",
	"Ciudad",
	"Dirreción",
	"Rol",
	"Actualizar",
	"Eliminar",
]

export default function Page() {
	const { data: session } = useSession()
	const rol = session?.user.role

	const [usuarios, setUsuarios] = useState([])

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
				const response = await fetch("/api/v2/usuarios")
				const data = await response.json()
				setUsuarios(data)
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

	const handleDelete = async ({ id }: { id: Number }) => {
		try {
			const response: AxiosResponse = await axios.post(`/api/v2/usuarios/${id} `)
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
									Lista de Usuarios Registrados
								</Typography>
								<Typography color="gray" className="mt-1 font-normal">
									Información de todos los usuarios registradas
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
								{usuarios &&
									usuarios.map(
										(
											{ id, dni, nombre, apellido, calle, ciudad, provincia, telefono, email, role },
											index
										) => {
											const isLast = index === usuarios.length - 1
											const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50"

											return (
												<tr key={id}>
													<td className={classes}>
														<div className="flex items-center gap-3">
															<div className="flex flex-col">
																<Typography variant="small" color="blue-gray" className="font-normal ">
																	{dni}
																</Typography>
															</div>
														</div>
													</td>
													<td className={classes}>
														<div className="flex flex-col">
															<Typography variant="small" color="blue-gray" className="font-normal">
																{nombre}
															</Typography>
														</div>
													</td>
													<td className={classes}>
														<div className="flex flex-col">
															<Typography variant="small" color="blue-gray" className="font-normal">
																{apellido}
															</Typography>
														</div>
													</td>
													<td className={classes}>
														<div className="flex flex-col">
															<Typography variant="small" color="blue-gray" className="font-normal">
																{email}
															</Typography>
														</div>
													</td>
													<td className={classes}>
														<div className="flex flex-col">
															<Typography variant="small" color="blue-gray" className="font-normal">
																{telefono}
															</Typography>
														</div>
													</td>
													<td className={classes}>
														<div className="flex flex-col">
															<Typography variant="small" color="blue-gray" className="font-normal">
																{provincia}
															</Typography>
														</div>
													</td>
													<td className={classes}>
														<div className="flex flex-col">
															<Typography variant="small" color="blue-gray" className="font-normal">
																{ciudad}
															</Typography>
														</div>
													</td>
													<td className={classes}>
														<div className="flex flex-col">
															<Typography variant="small" color="blue-gray" className="font-normal">
																{calle}
															</Typography>
														</div>
													</td>
													<td className={classes}>
														<div className="flex flex-col">
															<Typography variant="small" color="blue-gray" className="font-normal">
																{role}
															</Typography>
														</div>
													</td>
													<td className={classes}>
														<Link href={`/dashboard/entidad/roles/${id}`}>
															<Button color="green" size="sm">
																<Tooltip content="Editar Usuario">
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
															<Tooltip content="Eliminar Usuario">
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
			</Layout>
		</div>
	)
}
