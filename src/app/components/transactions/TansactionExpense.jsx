"use client"

import { useGlobalState } from "@/app/context/GlobalState"
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

	console.log(ingresos)
	console.log(egresos)

	return (
		<>
			<h1 className="text-center text-3xl">Transaciones</h1>
			<div className="w-1/2 m-auto">
				<div className="flex justify-between my-7">
					<h4 className=""> Ingresos</h4>
					<span>{ingresos}</span>
				</div>
				<div className="flex justify-between my-7">
					<h4> Gastos</h4>
					<span>{egresos}</span>
				</div>
			</div>
		</>
	)
}

export default TansactionExpense
