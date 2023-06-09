"use client"
import { Layout } from "@/components/Layout"
import Loading from "@/components/Loading"
import NoAdmin from "@/components/NoAdmin"
import axios from "axios"
import { useSession } from "next-auth/react"
import React, { useEffect, useState } from "react"
import { BsPieChartFill } from "react-icons/bs"
import { VictoryLabel, VictoryPie } from "victory"
import { Typography } from "@material-tailwind/react"

type Repo = {
	monto: number
}
function Page() {
	const { data: session } = useSession()
	const role = session?.user.role
	const [ingresos, setIngresos] = useState(0)
	const [egresos, setEgresos] = useState(0)
	const [pagos, setPagos] = useState(0)

	const total = pagos + ingresos + egresos
	const porcentajePagos = (pagos / total) * 100
	console.log(porcentajePagos)
	const porcentajeIngresos = (ingresos / total) * 100
	console.log(porcentajeIngresos)
	const porcentajeEgresos = (egresos / total) * 100
	console.log(porcentajeEgresos)
	const totalGanancia = ingresos - (pagos + egresos)

	useEffect(() => {
		const getPagos = async () => {
			try {
				const dataPagos = await axios.get("/api/v2/pagostotal")
				const dataIngreso = await axios.get("/api/v2/ingresostotal")
				const dataEgreso = await axios.get("/api/v2/egresostotal")
				setEgresos(dataEgreso.data.egresostotal)
				setIngresos(dataIngreso.data.ingresostotal)
				setPagos(dataPagos.data.pagostotal)
			} catch (error) {
				console.error(error)
			}
		}

		getPagos()
	}, [])

	const Cargando = () => {
		if (role === undefined) {
			return <Loading />
		} else if (role !== "admin") {
			return <NoAdmin />
		}
	}

	if (ingresos === 0 && egresos === 0 && pagos === 0) {
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
							<Typography className="text-center" variant="h3" color="blue" textGradient>
								Total Ingresos
							</Typography>
							<Typography className="text-center" variant="h4" color="blue" textGradient>
								0
							</Typography>
						</div>

						<div>
							<Typography className="text-center" variant="h3" color="blue" textGradient>
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
			<div className="w-full h-full">
				{Cargando()}

				<div className=" flex flex-grow justify-between mx-auto px-64 mt-24">
					<div>
						<Typography className="text-center text-yellow-700 " variant="h3" textGradient>
							Total Pagos a Choferes
						</Typography>
						<Typography className="text-center" variant="h4" color="blue" textGradient>
							{pagos.toFixed(2)}
						</Typography>
					</div>

					<div>
						<Typography className="text-center text-orange-600" variant="h3" textGradient>
							Total Egresos
						</Typography>
						<Typography className="text-center" variant="h4" color="blue" textGradient>
							{egresos.toFixed(2)}
						</Typography>
					</div>

					<div>
						<Typography className="text-center text-green-500" variant="h3" textGradient>
							Total Ingresos
						</Typography>
						<Typography className="text-center" variant="h4" color="blue" textGradient>
							{ingresos.toFixed(2)}
						</Typography>
					</div>

					<div>
						<Typography className="text-center" variant="h3" color="blue" textGradient>
							Total Ganancias
						</Typography>
						<Typography className="text-center" variant="h4" color="blue" textGradient>
							{totalGanancia.toFixed(2)}
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
							{ x: `${ingresos} USD ${porcentajeIngresos.toFixed(2)}%`, y: porcentajeIngresos },
							{ x: `${egresos} USD ${porcentajeEgresos.toFixed(2)}%`, y: porcentajeEgresos },
							{ x: `${pagos} USD ${porcentajePagos.toFixed(2)}%`, y: porcentajePagos },
						]}
						innerRadius={40}
						labelRadius={70}
					/>
				</div>
			</div>
		</Layout>
	)
}

export default Page
