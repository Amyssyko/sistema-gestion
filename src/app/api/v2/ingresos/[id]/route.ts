import Joi from "joi"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
	const id = Number(params.id)

	const ingreso = await prisma.ingreso.findUnique({
		where: {
			id,
		},
	})

	if (!ingreso) {
		return new NextResponse(`Egreso ${id} no encontrada `, { status: 404 })
	}
	const { createdAt, updatedAt, ...ingresoWithoutData } = ingreso

	return NextResponse.json(ingresoWithoutData, { status: 200 })
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
	const id = Number(params.id)
	const json = await request.json()

	const { descripcion, busId } = json
	const monto = Number(json.monto)
	const fecha = new Date(json.fecha)

	try {
		const schema = Joi.object({
			fecha: Joi.date().required().max("now").messages({
				"any.required": "La fecha es requerida",
				"date.base": "La fecha debe ser una válida",
				"date.empty": "La fecha no puede estar vacía",
				"date.max": "La fecha no puede ser posterior a la fecha actual",
			}),
			descripcion: Joi.string().required().messages({
				"any.required": "La descripcion es requerida",
				"string.base": "La descripcion debe usar caracteres válidos",
				"string.empty": "La descripcion está vacio",
			}),
			monto: Joi.number().required().messages({
				"any.required": "El monto requerido",
				"number.base": "El monto no es correcto",
				"number.empty": "El monto está vacio",
			}),
			busId: Joi.string().required().messages({
				"any.required": "El bus es requerida",
				"string.base": "El bus no tiene formato correcto",
				"string.empty": "El bus está vacio",
			}),
		})
		const { error } = schema.validate({ fecha, descripcion, monto, busId })
		if (error) {
			return new NextResponse(error.message, { status: 400 })
		}
		const updatedIngreso = await prisma.ingreso.update({
			where: { id },
			data: { fecha: newDate, descripcion, monto, busId },
		})

		const { createdAt, updatedAt, ...ingresoWithoutData } = updatedIngreso

		return NextResponse.json(ingresoWithoutData, { status: 201 })
	} catch (error) {
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
//?metodo delete para eliminar
export async function POST(request: Request, { params }: { params: { id: string } }) {
	const id = Number(params.id)

	try {
		await prisma.ingreso.delete({ where: { id } })
		//! Retorna respuesta, codigo 204
		return new NextResponse(null, { status: 204 })
	} catch (error: any) {
		if (error.code === "P2025") {
			//! Retorna mensaje si no existe id del registro
			return new NextResponse("No existe registro de ingreso", { status: 404 })
		}

		return new NextResponse(error.message, { status: 500 })
	}
}
