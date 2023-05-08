"use client"

import { useGlobalState } from "@/app/context/GlobalState"
import TransactionItem from "./TransactionItem"

function TransactionList() {
	const { transactions } = useGlobalState()
	return (
		<>
			<h3>Historial</h3>
			<ul>
				{transactions.map((transacion) => (
					<TransactionItem transacion={transacion} key={transacion.id} />
				))}
			</ul>
		</>
	)
}

export default TransactionList
