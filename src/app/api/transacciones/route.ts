import Joi from "joi"

import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
	function isEmptyObject(obj: any): boolean {
		return Object.keys(obj).length === 0
	}

	const expenses = await prisma.transacion.findMany()
	if (isEmptyObject(expenses)) {
		return new NextResponse("No existe movimientos", { status: 201 })
	}
	return NextResponse.json(expenses)
}

export async function POST(request: Request) {
	try {
		const { tipo, fecha, descripcion, monto, id_bus } = await request.json()

		const schema = Joi.object({
			tipo: Joi.string().required(),
			fecha: Joi.date().required(),
			descripcion: Joi.string().required(),
			monto: Joi.number().required(),
			id_bus: Joi.string().required(),
		})
		const { error, value } = schema.validate({ tipo, fecha, descripcion, monto, id_bus })
		if (error) {
			return new NextResponse(error.message, { status: 400 })
		}
		const expense = await prisma.transacion.create({
			data: value,
		})

		return new NextResponse(JSON.stringify(expense), {
			status: 201,
			headers: { "Content-Type": "application/json" },
		})
	} catch (error: any) {
		console.log(error.stack)
		if (error.code === "P2002") {
			return new NextResponse(`Registro ya existe: ${error.meta.target}`, {
				status: 409,
			})
		}
		return new NextResponse(error.message, { status: 500 })
	}
}
