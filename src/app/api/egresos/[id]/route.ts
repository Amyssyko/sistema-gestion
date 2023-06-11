import Joi from "joi"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
	const id = Number(params.id)

	const egreso = await prisma.egreso.findUnique({
		where: {
			id,
		},
	})

	if (!egreso) {
		return new NextResponse(`Egreso ${id} no encontrada `, { status: 404 })
	}
	const { createdAt, updatedAt, ...egresoWithoutData } = egreso

	return NextResponse.json(egresoWithoutData, { status: 200 })
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
	const id = Number(params.id)
	const { fecha, descripcion, monto, busId, proveedorId } = await request.json()
	const newDate = new Date(fecha)

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
			proveedorId: Joi.number().required().messages({
				"any.required": "El proveedor es requerida",
				"number.base": "El proveedor no tiene formato correcto",
				"number.empty": "El proveedor está vacio",
			}),
		})
		const { error } = schema.validate({ fecha, descripcion, monto, busId, proveedorId })
		if (error) {
			return new NextResponse(error.message, { status: 400 })
		}
		const updatedEgreso = await prisma.egreso.update({
			where: { id },
			data: { fecha: newDate, descripcion, monto, busId, proveedorId },
		})

		const { createdAt, updatedAt, ...egresoWithoutData } = updatedEgreso

		return NextResponse.json(egresoWithoutData, { status: 201 })
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

//Delete fix
export async function POST(request: Request, { params }: { params: { id: string } }) {
	const id = Number(params.id)
	try {
		const schema = Joi.object({
			id: Joi.number().required().messages({
				"any.required": "El id es requerido",
				"number.base": `El id tiene que ser un numero`,
				"number.empty": "El id está vacio",
			}),
		})
		const { error } = schema.validate({ id })
		if (error) {
			return new NextResponse(error.message, { status: 400 })
		}

		await prisma.egreso.delete({
			where: { id },
		})

		return new NextResponse(null, { status: 204 })
	} catch (error: any) {
		if (error.code === "P2025") {
			return new NextResponse(`No existe egreso ${id}`, { status: 404 })
		}
		return new NextResponse(error.message, { status: 500 })
	}
}
