"use client"
import { useGlobalState } from "../context/GlobalState"

function Balance() {
	const { transactions } = useGlobalState()

	const amounts = transactions.map((transaction) => transaction.valor)
	const total = amounts.reduce((acc, item) => (acc += item), 0)
	console.log(total)
	console.log(amounts)
	return (
		<>
			<div className="flex justify-center items-center">
				<h4 className="text-3xl">Balance: </h4>
				<span className="text-1xl">{JSON.stringify(total, null, 2)}</span>
			</div>
		</>
	)
}

export default Balance
