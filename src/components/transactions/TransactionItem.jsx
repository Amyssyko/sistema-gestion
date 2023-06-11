import React from "react"
import { useGlobalState } from "@/context/GlobalState"

function TransactionItem({ transacion }) {
	const { deleteTransaction } = useGlobalState()

	return (
		<li className="bg-white/10 dark:text-white text-black px-3 py-1 justify-center items-center rounded-lg mb-2 w-full grid grid-cols-1 sm:grid-cols-6 md:grid-cols-6 lg:grid-cols-6 xl:grid-cols-6 2xl:grid-cols-6">
			<p className="col-span-1">{transacion.tipo}</p>
			<p className="col-span-1">{transacion.titulo}</p>
			<p className="col-span-1">{transacion.descripcion}</p>
			<p className="col-span-1">{transacion.fecha}</p>
			<span className="col-span-1">{transacion.valor}</span>
			<div className="col-span-1 flex justify-center items-center">
				<button
					className="bg-red-700 w-1/4 sm:w-10/12 md:w-3/4 lg:w-2/4 xl:w-2/5 2xl:w-3/2 hover:bg-red-300 focus:bg-black rounded-xl ring-black border  dark:text-white text-black text-sm"
					onClick={() => {
						deleteTransaction(transacion.id)
					}}
				>
					Eliminar
				</button>
			</div>
		</li>
	)
}

export default TransactionItem
