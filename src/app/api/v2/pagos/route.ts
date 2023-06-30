import Joi from "joi"

import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
	function isEmptyObject(obj: any): boolean {
		return Object.keys(obj).length === 0
	}

	const pagos = await prisma.pago.findMany()
	if (isEmptyObject(pagos)) {
		return new NextResponse("No existe egresos", { status: 404 })
	}
	const formattedEgresos = pagos.map((pago: any) => {
		return {
			...pago,
			fecha: new Date(pago.createdAt).toISOString().replace("T", " ").slice(0, 10),
			createdAt: new Date(pago.createdAt).toISOString().replace("T", " ").slice(0, -8),
			updatedAt: new Date(pago.updatedAt).toISOString().replace("T", " ").slice(0, -8),
		}
	})
	return NextResponse.json(formattedEgresos, { status: 200 })
}

export async function POST(request: Request) {
	const json = await request.json()

	const { detalle } = json
	const usuarioId = Number(json.usuarioId)
	const valor = Number(json.valor)
	const fecha = new Date(json.fecha)

	try {
		const schema = Joi.object({
			fecha: Joi.date().required().max("now").messages({
				"any.required": "La fecha es requerida",
				"date.base": "La fecha debe ser una válida",
				"date.empty": "La fecha no puede estar vacía",
				"date.max": "La fecha no puede ser posterior a la fecha actual",
			}),
			detalle: Joi.string().required().messages({
				"any.required": "La detalle es requerida",
				"string.base": "La detalle debe usar caracteres válidos",
				"string.empty": "La detalle está vacio",
			}),
			valor: Joi.number().required().messages({
				"any.required": "El monto requerido",
				"number.base": "El monto no es correcto",
				"number.empty": "El monto está vacio",
			}),
			usuarioId: Joi.number().required().messages({
				"any.required": "El Usuario requerido",
				"number.base": "El Usuario no es correcto",
				"number.empty": "El Usuario está vacio",
			}),
		})
		const { error } = schema.validate({ valor, detalle, fecha, usuarioId })

		if (error) {
			return new NextResponse(error.message, { status: 400 })
		}

		const pago = await prisma.pago.create({
			data: { valor, detalle, fecha, usuarioId },
		})

		return NextResponse.json(pago, { status: 201 })
	} catch (error: any) {
		if (error.code === "P2002") {
			return new NextResponse("Ya existe id", {
				status: 409,
			})
		}
		if (error.code === "P2003") {
			return new NextResponse("No existe id", {
				status: 409,
			})
		}

		return new NextResponse(error.message, { status: 500 })
	}
}
