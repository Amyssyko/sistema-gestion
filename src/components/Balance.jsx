"use client"

import { useGlobalState } from "@/context/GlobalState"

function Balance() {
	const { transactions } = useGlobalState()

	const amounts = transactions.map((transaction) => transaction.valor)
	const total = +amounts.reduce((acc, item) => (acc += item), 0).toFixed(2)

	return (
		<div className="flex justify-center items-center ">
			<h4 className="text-3xl ">
				Balance{" "}
				{total <= 0 ? (
					<pre className="ml-1 text-3xl text-center text-red-700 ">{JSON.stringify(total, null, 4)}</pre>
				) : (
					<pre className="ml-1 text-3xl text-center ">{JSON.stringify(total, null, 4)}</pre>
				)}
			</h4>
		</div>
	)
}

export default Balance
