"use client"
import { Layout } from "@/components/Layout"
import Loading from "@/components/Loading"
import NoAdmin from "@/components/NoAdmin"
import axios from "axios"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"
import AxiosResponse from "axios"
import { BsPieChartFill } from "react-icons/bs"
import { VictoryChart, VictoryLabel, VictoryLine, VictoryPie, VictoryTheme } from "victory"
import { Typography } from "@material-tailwind/react"

type Repo = {
	monto: number
}
function Page() {
	const router = useRouter()
	const { data: session } = useSession()
	const [ingresos, setIngresos] = useState([])
	const [egresos, setEgresos] = useState([])

	const ingresostotal = ingresos
		.reduce((accumulator, current) => {
			return accumulator + parseFloat(current.monto)
		}, 0)
		.toFixed(2)

	const egresostotal = egresos
		.reduce((accumulator, current) => {
			return accumulator + parseFloat(current.monto)
		}, 0)
		.toFixed(2)

	const totalProp = ingresostotal - egresostotal
	const totalEgresos = Math.round((egresostotal / ingresostotal) * 100)
	const totalIngresos = 100 - totalEgresos
	useEffect(() => {
		const getEgresos = async () => {
			try {
				const dataEgreso = await axios.get("/api/v2/egresostotal")
				setEgresos(dataEgreso.data)
			} catch (error) {
				console.error(error)
			}
		}

		getEgresos()
	}, [])

	useEffect(() => {
		const getIngresos = async () => {
			try {
				const dataIngreso = await axios.get("/api/v2/ingresostotal")
				setIngresos(dataIngreso.data)
			} catch (error) {
				console.error(error)
			}
		}

		getIngresos()
	}, [])

	const Cargando = () => {
		if (session?.user?.role === undefined) {
			return <Loading />
		} else if (session?.user?.role !== "admin") {
			return <NoAdmin />
		}
	}

	if (ingresostotal === 0 && ingresostotal === 0) {
		return (
			<Layout>
				<div className="bg-zinc-90 p-8 my-24">
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
				<div className="  py-12">
					<div className=" flex flex-col">
						<Typography className="text-center" variant="h2" color="blue" textGradient>
							Total ganancias
						</Typography>
						<Typography className="text-center" variant="h4" color="blue" textGradient>
							{totalProp.toFixed(2)}
						</Typography>
					</div>

					<div className=" flex flex-col w-3/12 mx-auto">
						<VictoryPie
							style={{
								data: {
									fillOpacity: 0.9,
									stroke: "black",
									strokeWidth: 3,
								},
								labels: {
									fontSize: 25,
									fill: "blue",
									fillOpacity: "0.7",
									stroke: "blue",
								},
							}}
							colorScale={["#e74c3c", "#2ecc71"]}
							width={550}
							height={550}
							data={[
								{ x: `${ingresostotal} USD ${totalIngresos}%`, y: String(totalIngresos) },
								{ x: `${totalEgresos}% ${egresostotal} USD`, y: String(totalEgresos) },
							]}
							innerRadius={70}
							labelRadius={80}
						/>
					</div>
				</div>
			</div>
		</Layout>
	)
}

export default Page
