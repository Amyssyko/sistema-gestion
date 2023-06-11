import Joi from "joi"

import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
	function isEmptyObject(obj: any): boolean {
		return Object.keys(obj).length === 0
	}

	const egresos = await prisma.egreso.findMany()
	if (isEmptyObject(egresos)) {
		return new NextResponse("No existe egresos", { status: 404 })
	}
	const filteredEgresos = egresos.map(({ createdAt, updatedAt, ...egresosWithoutData }) => egresosWithoutData)

	return NextResponse.json(filteredEgresos, { status: 200 })
}

export async function POST(request: Request) {
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

		const proveedor = await prisma.egreso.create({
			data: { fecha: newDate, descripcion, monto, busId, proveedorId },
		})

		const { createdAt, updatedAt, ...proveedorWithoutData } = proveedor

		return NextResponse.json(proveedorWithoutData, { status: 201 })
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
