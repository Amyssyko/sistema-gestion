import Joi from "joi"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
	const id = params.id

	// Validate input
	if (!id || typeof id !== "string") {
		return new NextResponse("Invalid ID income", { status: 400 })
	}

	const expense = await prisma.transacion.findUnique({
		where: {
			id,
		},
	})

	if (!expense) {
		return new NextResponse(`No income was found with ID: ${id}`, { status: 404 })
	}

	return NextResponse.json(expense)
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
	const id = params.id

	try {
		const { id, tipo, fecha, descripcion, monto, id_bus } = await request.json()

		//	console.log({ id, tipo, fecha, descripcion, monto, id_bus })
		const schema = Joi.object({
			id: Joi.string().required(),
			tipo: Joi.string().required(),
			fecha: Joi.date().required(),
			descripcion: Joi.string().required(),
			monto: Joi.number().required(),
			id_bus: Joi.string().required(),
		})
		const { error, value } = schema.validate({ id, tipo, fecha, descripcion, monto, id_bus })
		if (error) {
			return new NextResponse(error.message, { status: 400 })
		}
		const updatedExpense = await prisma.transacion.update({
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
			return new NextResponse(`No income was found with ID: ${id}`, { status: 404 })
		}
	}
}

//Delete fix
export async function POST(request: Request, { params }: { params: { id: string } }) {
	const id = params.id
	// Validate input
	if (!id || typeof id !== "string") {
		return new NextResponse("id de transaccion invalido", { status: 400 })
	}
	try {
		await prisma.transacion.delete({
			where: { id },
		})

		return new NextResponse(null, { status: 204 })
	} catch (error: any) {
		if (error.code === "P2025") {
			return new NextResponse(`No fue encontrada la transaccion: ${id}`, { status: 404 })
		}

		return new NextResponse(error.message, { status: 500 })
	}
}
