"use client"

import { useGlobalState } from "@/context/GlobalState"
import TransactionItem from "./TransactionItem"

function TransactionList() {
	const { transactions } = useGlobalState()

	return (
		<>
			<h3 className="text-center font-semibold text-2xl mt-8">Historial</h3>
			{transactions.length === 0 ? (
				<div className="flex justify-center items-center h-full">
					<h3 className=" text-3xl text-orange-950"> No existe datos</h3>
				</div>
			) : (
				<ul>
					{transactions.map((transacion) => (
						<TransactionItem transacion={transacion} key={transacion.id} />
					))}
				</ul>
			)}
		</>
	)
}

export default TransactionList
