"use client"
import { VictoryPie, VictoryLabel, VictoryBar, VictorySharedEvents } from "victory"
import { useGlobalState } from "../context/GlobalState"
import { BsPieChartFill } from "react-icons/bs"
const ExpenseChart = () => {
	const { transactions } = useGlobalState()
	const total = transactions.reduce((acc, transaction) => (acc += transaction.valor), 0)
	/* */
	const ingresos = transactions
		.filter((transaction) => transaction.valor > 0)
		.reduce((acc, transaction) => (acc += transaction.valor), 0)
	//.toFixed(2)

	const egresos =
		transactions
			.filter((transaction) => transaction.valor < 0)
			.reduce((acc, transaction) => (acc += transaction.valor), 0) * -1

	const totalEgresos = Math.round((egresos / ingresos) * 100)
	const totalIngresos = 100 - totalEgresos

	if (ingresos === 0 && egresos === 0) {
		return (
			<div className="bg-zinc-90 p-8 my-5">
				<div className="h-full flex items-center justify-center w-full flex-col">
					<BsPieChartFill className="text-9xl" />
					<h1 className="text-1xl font-bold my-2 dark:text-gray-200 text-black">No existe datos</h1>
				</div>
			</div>
		)
	}

	return (
		<>
			<svg viewBox="-300 0 1000 380">
				<VictoryPie
					standalone={false}
					colorScale={["#e74c3c", "#2ecc71"]}
					width={400}
					height={400}
					data={[
						{ x: `${totalEgresos}%`, y: totalEgresos },
						{ x: `${totalIngresos}%`, y: totalIngresos },
					]}
					innerRadius={70}
					labelRadius={80}
					style={{ labels: { fontSize: 18, fill: "blue", animation: 200 } }}
				/>
				<VictoryLabel
					textAnchor="middle"
					style={{ fontSize: 16, fill: "blue" }}
					//backgroundStyle={[{ fill: "white", opacity: 0.2 }]}
					x={200}
					y={200}
					text="Gastos e Ingresos"
				/>
			</svg>
		</>
	)
}

export default ExpenseChart
