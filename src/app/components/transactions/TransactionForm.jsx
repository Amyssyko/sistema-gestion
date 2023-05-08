"use client"

import React, { useState } from "react"
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

		addTransaction({
			id: window.crypto.randomUUID(),
			tipo: detalle.tipo,
			titulo: detalle.titulo,
			descripcion: detalle.descripcion,
			fecha: detalle.fecha,
			valor: nuevovalor,
		})
		console.log(typeof nuevovalor)
	}

	const options = [
		{ value: "Ingreso", label: "Ingreso" },
		{ value: "Engreso", label: "Engreso" },
	]

	return (
		<>
			<h1 className="text-center text-2xl dark:text-white text-black font-bold">Transaciones</h1>
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
					/>
					<Input name={"fecha"} id={"fecha"} label={"Fecha"} type={"date"} onChange={handleInputChange} />
					<Input
						name={"valor"}
						id={"valor"}
						label={"Valor"}
						type={"number"}
						placeholder={"00.00"}
						step="0.01"
						onChange={handleInputChange}
					/>
					<div className="my-2 flex justify-center items-center">
						<button
							className=" bg-blue-800 border-spacing-2 rounded-xl w-3/12 sm:w-2/12 md:w-1/12 lg:w-1/12 xl:w-1/12 2xl:w-1/12 hover:bg-blue-400 focus:bg-yellow-200 dark:text-white text-black"
							type="submit"
						>
							Guardar
						</button>
					</div>
				</form>
			</div>
		</>
	)
}

export default TransactionForm
