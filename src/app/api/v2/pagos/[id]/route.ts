import Joi from "joi"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
	const id = Number(params.id)

	const pago = await prisma.pago.findUnique({
		where: {
			id,
		},
	})

	if (!pago) {
		return new NextResponse(`Pago ${id} no encontrado`, { status: 404 })
	}

	return NextResponse.json(pago, { status: 200 })
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
	const id = Number(params.id)
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
		const pago = await prisma.pago.update({
			where: { id },
			data: { valor, detalle, fecha, usuarioId },
		})

		return NextResponse.json(pago, { status: 201 })
	} catch (error) {
		if (error.code === "P2002") {
			return new NextResponse("Ya existe id", {
				status: 409,
			})
		}
		if (error.code === "P2003") {
			return new NextResponse("No existe Usuario", {
				status: 409,
			})
		}

		return new NextResponse(error.message, { status: 500 })
	}
}

//?metodo delete para eliminar
export async function POST(request: Request, { params }: { params: { id: string } }) {
	const id = Number(params.id)
	try {
		await prisma.pago.delete({ where: { id } })
		//! Retorna respuesta, codigo 204
		return new NextResponse(null, { status: 204 })
	} catch (error: any) {
		if (error.code === "P2025") {
			//! Retorna mensaje si no existe id del registro
			return new NextResponse("No existe registro de pago", { status: 404 })
		}

		return new NextResponse(error.message, { status: 500 })
	}
}
