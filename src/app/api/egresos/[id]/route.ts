import Joi from "joi"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
	const id = params.id

	// Validate input
	if (!id || typeof id !== "string") {
		return new NextResponse("Invalid ID expense", { status: 400 })
	}

	const expense = await prisma.gasto.findUnique({
		where: {
			id,
		},
	})

	if (!expense) {
		return new NextResponse(`No expense was found with ID: ${id}`, { status: 404 })
	}

	return NextResponse.json(expense)
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
	const id = params.id
	let expense = await request.json()
	const schema = Joi.object({
		id: Joi.string().required(),
		fecha: Joi.date().required(),
		descripcion: Joi.string().required(),
		monto: Joi.number().required(),
		id_bus: Joi.string().required(),
	})
	const { error, value } = schema.validate(expense)

	if (error) {
		return new NextResponse("Invalid request body", { status: 400 })
	}

	try {
		const updatedExpense = await prisma.gasto.update({
			where: { id },
			data: value,
		})
		/*if (!updated_chofer) {
			return new NextResponse("No driver with DNI found", { status: 401 })
		}*/
		return NextResponse.json(updatedExpense)
	} catch (error: any) {
		//console.log(error)
		if (error.code === "P2025") {
			return new NextResponse(`No expense was found with ID: ${id}`, { status: 404 })
		}
	}
}

//Delete fix
export async function POST(request: Request, { params }: { params: { id: string } }) {
	const id = params.id
	// Validate input
	if (!id || typeof id !== "string") {
		return new NextResponse("Invalid ID expense", { status: 400 })
	}
	try {
		await prisma.gasto.delete({
			where: { id },
		})

		return new NextResponse(null, { status: 204 })
	} catch (error: any) {
		if (error.code === "P2025") {
			return new NextResponse(`No expense was found with ID: ${id}`, { status: 404 })
		}

		return new NextResponse(error.message, { status: 500 })
	}
}
