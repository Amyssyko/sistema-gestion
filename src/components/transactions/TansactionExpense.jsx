"use client"

import { useGlobalState } from "@/context/GlobalState"
import React from "react"

function TansactionExpense() {
	const { transactions } = useGlobalState()
	const amount = transactions.map((transaction) => transaction.valor)
	const ingresos = +amount
		.filter((item) => item > 0)
		.reduce((acc, item) => (acc += item), 0)
		.toFixed(2)
	const egresos =
		+amount
			.filter((item) => item < 0)
			.reduce((acc, item) => (acc += item), 0)
			.toFixed(2) * -1

	return (
		<>
			<h1 className="text-center text-3xl uppercase font-bold">Informacion de gastos</h1>
			<div className="w-1/2 m-auto text-xl font-semibold">
				<div className="flex justify-between my-7 ">
					<h4 className=""> Ingresos</h4>
					<span className="text-green-600 text-xl">{ingresos}</span>
				</div>
				<div className="flex justify-between my-7">
					<h4> Gastos</h4>
					<span className="text-red-800 text-xl">{egresos}</span>
				</div>
			</div>
		</>
	)
}

export default TansactionExpense
