"use client"
import { Layout } from "@/components/Layout"
import axios from "axios"
import { useSession } from "next-auth/react"
import React, { useEffect, useState } from "react"
import { BsPieChartFill } from "react-icons/bs"
import { VictoryPie } from "victory"
import { Typography } from "@material-tailwind/react"

interface DataPago {
	id: number
	valor: string
	detalle: string
	fecha: string
	usuarioId: number | null
	createdAt: string
	updatedAt: string
}

interface DataIngreso {
	id: number
	fecha: string
	descripcion: string
	monto: string
	busId: string
	createdAt: string
	updatedAt: string
}

interface DataEgreso {
	id: number
	descripcion: string
	monto: string
	fecha: string
	busId: string
	proveedorId: number
	createdAt: string
	updatedAt: string
}

function Page() {
	const { data: session } = useSession()
	const [ingresos, setIngresos] = useState<DataIngreso[]>([])
	const [egresos, setEgresos] = useState<DataEgreso[]>([])
	const [pagos, setPagos] = useState<DataPago[]>([])

	const totalIngreso = ingresos.reduce((accumulator, expense) => {
		return accumulator + Number(expense.monto)
	}, 0)
	const convertedtotalIngreso = totalIngreso.toFixed(2)
	const totalEgreso = egresos.reduce((accumulator, expense) => {
		return accumulator + Number(expense.monto)
	}, 0)
	const totalPago = pagos.reduce((accumulator, expense) => {
		return accumulator + Number(expense.valor)
	}, 0)

	const total = Number((totalPago + totalIngreso + totalEgreso).toPrecision(4))
	const porcentajePagos = Number(((totalPago / total) * 100).toPrecision(4))
	const porcentajeIngresos = Number(((totalIngreso / total) * 100).toPrecision(4))
	const porcentajeEgresos = Number(((totalEgreso / total) * 100).toPrecision(4))
	const totalGanancia = Number((totalIngreso - (totalEgreso + totalPago)).toPrecision(4))

	useEffect(() => {
		const getPagos = async () => {
			try {
				const dataPago = await axios.get("/api/v2/pagos")
				const dataIngreso = await axios.get("/api/v2/ingresos")
				const dataEgreso = await axios.get("/api/v2/egresos")
				setEgresos(dataEgreso.data)
				setIngresos(dataIngreso.data)
				setPagos(dataPago.data)
			} catch (error) {
				console.error(error)
			}
		}

		getPagos()
	}, [])

	if (totalEgreso === 0 && totalIngreso === 0 && totalPago === 0 && session?.user?.role === "admin") {
		return (
			<Layout>
				<div className="bg-zinc-90 p-8 mt-24">
					<div className=" flex flex-grow justify-between mx-auto px-64">
						<div>
							<Typography className="text-center" variant="h3" color="red" textGradient>
								Total Pagos a Choferes
							</Typography>
							<Typography className="text-center" variant="h4" color="blue" textGradient>
								0
							</Typography>
						</div>

						<div>
							<Typography className="text-center" variant="h3" color="red" textGradient>
								Total Egresos
							</Typography>
							<Typography className="text-center" variant="h4" color="blue" textGradient>
								0
							</Typography>
						</div>

						<div>
							<Typography className="text-center" variant="h3" color="red" textGradient>
								Total Ingresos
							</Typography>
							<Typography className="text-center" variant="h4" color="blue" textGradient>
								0
							</Typography>
						</div>

						<div>
							<Typography className="text-center" variant="h3" color="red" textGradient>
								Total Ganancias
							</Typography>
							<Typography className="text-center" variant="h4" color="blue" textGradient>
								0
							</Typography>
						</div>
					</div>
					<div className="h-full flex items-center justify-center w-full flex-col">
						<BsPieChartFill className="text-9xl text-orange-600" />
						<h1 className="text-1xl font-bold my-2 dark:text-gray-900 text-black">No existe datos</h1>
					</div>
				</div>
			</Layout>
		)
	}
	return (
		<Layout>
			<div className=" flex flex-grow justify-between mx-auto px-64 mt-24">
				<div>
					<Typography className="text-center text-yellow-700 " variant="h3" textGradient>
						Total Pagos a Choferes
					</Typography>
					<Typography className="text-center" variant="h4" color="blue" textGradient>
						{totalPago}
					</Typography>
				</div>

				<div>
					<Typography className="text-center text-orange-600" variant="h3" textGradient>
						Total Egresos
					</Typography>
					<Typography className="text-center" variant="h4" color="blue" textGradient>
						{totalEgreso}
					</Typography>
				</div>

				<div>
					<Typography className="text-center text-green-500" variant="h3" textGradient>
						Total Ingresos
					</Typography>
					<Typography className="text-center" variant="h4" color="blue" textGradient>
						{convertedtotalIngreso}
					</Typography>
				</div>

				<div>
					<Typography className="text-center" variant="h3" color="blue" textGradient>
						Total Ganancias
					</Typography>
					<Typography className="text-center" variant="h4" color="blue" textGradient>
						{totalGanancia}
					</Typography>
				</div>
			</div>

			<div className=" flex flex-col w-3/12 mx-auto">
				<VictoryPie
					animate={{
						duration: 2000,
					}}
					events={[
						{
							target: "data",
							eventHandlers: {
								onClick: () => {
									return [
										{
											target: "data",
											mutation: ({ style }) => {
												return style.fill === "#c43a31" ? null : { style: { fill: "#c43a31" } }
											},
										},
										{
											target: "labels",
											mutation: ({ text, ingreso }) => {
												return text === "selecionado" ? null : { text: ingreso }
											},
										},
									]
								},
							},
						},
					]}
					style={{
						data: {
							fillOpacity: 0.9,
							stroke: "black",
							strokeWidth: 3,
						},
						labels: {
							fontSize: 19,
							fill: "#060C52",
							fillOpacity: "0.7",
						},
					}}
					colorScale={["green", "orange", "gold"]}
					width={550}
					height={550}
					data={[
						{ x: `${convertedtotalIngreso} USD ${porcentajeIngresos.toFixed(2)}%`, y: porcentajeIngresos },
						{ x: `${totalEgreso} USD ${porcentajeEgresos.toFixed(2)}%`, y: porcentajeEgresos },
						{ x: `${totalPago} USD ${porcentajePagos.toFixed(2)}%`, y: porcentajePagos },
					]}
					innerRadius={40}
					labelRadius={70}
				/>
			</div>
		</Layout>
	)
}

export default Page
