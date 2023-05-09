"use client"
import { VictoryPie, VictoryLabel } from "victory"
import { useGlobalState } from "../context/GlobalState"
import { BsPieChartFill } from "react-icons/bs"
const ExpenseChart = () => {
	const { transactions } = useGlobalState()
	console.log(transactions)

	const totalIncomes = transactions
		.filter((transaction) => transaction.valor > 0)
		.reduce((acc, transaction) => (acc += transaction.valor), 0)
		.toFixed(2)

	const totalExpenses =
		transactions
			.filter((transaction) => transaction.valor < 0)
			.reduce((acc, transaction) => (acc += transaction.valor), 0) * -1

	console.log({
		totalIncomes,
		totalExpenses,
	})

	const expensesPercentage = Math.round((totalExpenses / totalIncomes) * 100)
	const incomesPercentage = Math.round((totalIncomes / totalExpenses) * 100) //100 - expensesPercentage

	console.log({
		expensesPercentage,
		incomesPercentage,
	})

	if (totalIncomes === 0 && totalExpenses === 0) {
		return (
			<div className="bg-zinc-900 p-4 my-2">
				<div className="h-full flex items-center justify-center w-full flex-col">
					<BsPieChartFill className="text-9xl" />
					<h1 className="text-1xl font-bold my-2 text-gray-200">No existe datos</h1>
				</div>
			</div>
		)
	}

	return (
		<div>
			<VictoryPie
				animate={{
					duration: 3000,
				}}
				colorScale={["#e74c3c", "#2ecc71"]}
				data={[
					{ x: "Gastos", y: `${expensesPercentage}%` },
					{ x: "Ingresos", y: `${incomesPercentage}%` },
				]}
				labels={({ datum }) => datum.y}
				labelComponent={<VictoryLabel angle={0} style={{ fill: "blue" }} />}
			/>
		</div>
	)
}

export default ExpenseChart
