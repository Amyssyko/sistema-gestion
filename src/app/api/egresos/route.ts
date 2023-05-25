import Joi from "joi"

import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
	function isEmptyObject(obj: any): boolean {
		return Object.keys(obj).length === 0
	}

	const expenses = await prisma.gasto.findMany()
	if (isEmptyObject(expenses)) {
		return new NextResponse("Expenses not exists", { status: 201 })
	}
	return NextResponse.json(expenses)
}

export async function POST(request: Request) {
	try {
		const json = await request.json()
		const schema = Joi.object({
			fecha: Joi.date().required(),
			descripcion: Joi.string().required(),
			monto: Joi.number().required(),
			id_bus: Joi.string().required(),
		})
		const { error, value } = schema.validate(json)

		const expense = await prisma.gasto.create({
			data: value,
		})

		if (error) {
			return new NextResponse("Invalid request body", { status: 400 })
		}

		return new NextResponse(JSON.stringify(expense), {
			status: 201,
			headers: { "Content-Type": "application/json" },
		})
	} catch (error: any) {
		if (error.code === "P2002") {
			return new NextResponse(`Expenses with ID already exists: ${error.meta.target}`, {
				status: 409,
			})
		}
		return new NextResponse(error.message, { status: 500 })
	}
}
