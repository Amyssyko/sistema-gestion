"use client"

import React, { useState, useEffect } from "react"
import CustomSelect from "../Select"
import Input from "../Input"
import TextArea from "../TextArea"
import { useGlobalState } from "../../context/GlobalState"

function TransactionForm() {
	const { addTransaction } = useGlobalState()

	const [selectedOption, setSelectedOption] = useState(null)

	const [detalle, setDetalle] = useState({
		tipo: "",
		titulo: "",
		descripcion: "",
		fecha: "",
		valor: "",
	})

	const [editando, setEditando] = useState(false)

	const handleChange = (option) => {
		setSelectedOption(option)
		setDetalle({ ...detalle, tipo: option.value })
	}

	const handleInputChange = (event) => {
		const { name, value } = event.target
		setDetalle({ ...detalle, [name]: value })
	}

	const handleSubmit = (event) => {
		event.preventDefault()
		const nuevovalor = Number(
			selectedOption.value === "Engreso" ? -Math.abs(detalle.valor) : Math.abs(detalle.valor)
		)

		if (editando) {
			const transacciones = JSON.parse(localStorage.getItem("transacciones"))
			const index = transacciones.findIndex((transaction) => transaction.id === detalle.id)
			if (index >= 0) {
				transacciones[index] = {
					...detalle,
					valor: nuevovalor,
				}
				localStorage.setItem("transacciones", JSON.stringify(transacciones))
			}
		} else {
			addTransaction({
				id: window.crypto.randomUUID(),
				tipo: detalle.tipo,
				titulo: detalle.titulo,
				descripcion: detalle.descripcion,
				fecha: detalle.fecha,
				valor: nuevovalor,
			})
		}
		setDetalle({
			tipo: "",
			titulo: "",
			descripcion: "",
			fecha: "",
			valor: "",
		})
		setSelectedOption(null)
		setEditando(false)
	}

	const options = [
		{ value: "Ingreso", label: "Ingreso" },
		{ value: "Engreso", label: "Engreso" },
	]

	useEffect(() => {
		if (editando) {
			const transaccion = JSON.parse(localStorage.getItem("transaccion"))
			setDetalle(transaccion)
			setSelectedOption({
				value: transaccion.tipo,
				label: transaccion.tipo,
			})
		}
	}, [editando])

	return (
		<div className="mt-8">
			<h1 className="text-center text-2xl dark:text-sky-700 text-sky-600 font-bold">
				Datos de Ingresos y Egresos
			</h1>
			<div className="px-5 sm:px-8 md:px-12 lg:mx-46 xl:mx-86 xl:px-86 2xl:px-78 2xl:mx-96 my-auto">
				<form onSubmit={handleSubmit}>
					<CustomSelect
						id={"tipo"}
						name={"tipo"}
						label={"Tipo de Gastos"}
						options={options}
						onChange={handleChange}
						value={selectedOption}
						placeholder="Tipo de gasto"
						isMulti={false}
					/>
					<Input
						name={"titulo"}
						id={"titulo"}
						label={"Titulo"}
						type={"text"}
						placeholder={"Compra"}
						onChange={handleInputChange}
						value={detalle.titulo}
					/>
					<TextArea
						name={"descripcion"}
						id={"descripcion"}
						label={"Descripcion"}
						type={"text"}
						placeholder={"Describa acciones"}
						onChange={handleInputChange}
						rows={5}
						cols={5}
						value={detalle.descripcion}
					/>
					<Input
						name={"fecha"}
						id={"fecha"}
						label={"Fecha"}
						type={"date"}
						onChange={handleInputChange}
						value={detalle.fecha}
					/>
					<Input
						name={"valor"}
						id={"valor"}
						label={"Valor"}
						type={"number"}
						placeholder={"00.00"}
						step="0.01"
						onChange={handleInputChange}
						value={detalle.valor}
					/>
					<div className="flex justify-center items-baseline">
						<button
							className=" mt-4 bg-blue-500 py-2 px-6 rounded-md hover:bg-blue-600 border-spacing-2  w-4/12 sm:w-2/12 md:w-2/12 lg:w-24 xl:w-1/12 2xl:w-2/12  dark:text-white text-black"
							type="submit"
						>
							Guardar
						</button>
					</div>
				</form>
				<div className="flex justify-center items-baseline">
					<button
						className="bg-red-600 hover:bg-red-400 text-white font-bold py-2 px-4 rounded mt-8"
						onClick={() => {
							localStorage.clear()
							window.location.reload()
						}}
					>
						Eliminar todo el historial
					</button>
				</div>
			</div>
		</div>
	)
}

export default TransactionForm
