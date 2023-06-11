import Joi from "joi"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
	const id = params.id
	const schema = Joi.object({
		id: Joi.string()
			.pattern(new RegExp(/[A-C,E,G-Z]{1}[A]{1}[A-Z]{1}\d{4}/))
			.required()
			.min(7)
			.max(7)
			.messages({
				"string.pattern.base": "La matricula no valida",
				"any.required": "La matricula es requerido",
				"string.base": "La matricula debe ser solo números",
				"string.empty": "La matricula está vacio",
				"string.min": "La matricula debe tener al menos 7 carácteres",
				"string.max": "La matricula no puede tener más de 7 carácteres",
			}),
	})

	const { error } = schema.validate({ id })
	if (error) {
		return new NextResponse(error.message, { status: 400 })
	}
	const bus = await prisma.bus.findUnique({
		where: {
			placa: id,
		},
	})

	if (!bus) {
		return new NextResponse(`Matricula no encontrada ${id}`, { status: 404 })
	}

	const { createdAt, updatedAt, ...busWithoutData } = bus
	return NextResponse.json(busWithoutData, { status: 200 })
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
	const id = params.id
	const { placa, modelo, capacidad, anio } = await request.json()
	const parsedCapacidad = parseInt(capacidad)
	const parsedAnio = parseInt(anio)
	try {
		const schema = Joi.object({
			placa: Joi.string()
				.pattern(new RegExp(/[A-C,E,G-Z]{1}[A]{1}[A-Z]{1}\d{4}/))
				.required()
				.min(7)
				.max(7)
				.messages({
					"string.pattern.base": "La matricula no valida",
					"any.required": "La matricula es requerido",
					"string.base": "La matricula debe ser solo números",
					"string.empty": "La matricula está vacio",
					"string.min": "La matricula debe tener al menos 7 caracteres",
					"string.max": "La matricula no puede tener más de 7 caracteres",
				}),
			modelo: Joi.string().required().messages({
				"any.required": "El modelo requerida",
				"string.base": "El modelo no tiene formato correcto",
				"string.empty": "El modelo está vacio",
			}),
			capacidad: Joi.number().required().min(20).max(60).messages({
				"any.required": "La capacidad es requerido",
				"number.base": "La capacidad debe ser solo números",
				"number.empty": "La capacidad está vacio",
				"number.min": "La capacidad debe ser al menos 20 pasajeros",
				"number.max": "La capacidad no puede ser más de 60 pasajeros",
			}),
			anio: Joi.number()
				.required()
				.min(2000)
				.max(1 + new Date().getFullYear())
				.messages({
					"any.required": "El año es requerido",
					"number.base": "El año debe no tiene el formato correcto",
					"number.empty": "El año está vacio",
					"number.min": `El año del bus tiene que ser mayor que ${anio}`,
					"number.max": `El año del bus tiene que ser igual o menor a ${1 + new Date().getFullYear()}`,
				}),
		})

		const { error } = schema.validate({ placa, modelo, capacidad, anio })
		if (error) {
			return new NextResponse(error.message, { status: 400 })
		}

		const updatedBus = await prisma.bus.update({
			where: { placa: id },
			data: { placa, modelo, capacidad: parsedCapacidad, anio: parsedAnio },
		})
		const { createdAt, updatedAt, ...busWithoutData } = updatedBus

		return NextResponse.json(busWithoutData, { status: 200 })
	} catch (error: any) {
		if (error.code === "P2025") {
			return new NextResponse(`No existe matrícula ${id}`, { status: 404 })
		}
	}
}

//Delete fix
export async function POST(request: Request, { params }: { params: { id: string } }) {
	const id = params.id

	try {
		const schema = Joi.object({
			id: Joi.string()
				.pattern(new RegExp(/[A-C,E,G-Z]{1}[A]{1}[A-Z]{1}\d{4}/))
				.required()
				.min(7)
				.max(7)
				.messages({
					"string.pattern.base": "La matricula no valida",
					"any.required": "La matricula es requerido",
					"string.base": "La matricula debe ser solo números",
					"string.empty": "La matricula está vacio",
					"string.min": "La matricula debe tener al menos 7 carácteres",
					"string.max": "La matricula no puede tener más de 7 carácteres",
				}),
		})

		const { error } = schema.validate({ id })
		if (error) {
			return new NextResponse(error.message, { status: 400 })
		}
		await prisma.bus.delete({
			where: { placa: id },
		})

		return new NextResponse(null, { status: 204 })
	} catch (error: any) {
		if (error.code === "P2025") {
			return new NextResponse(`No existe matrícula ${id}`, { status: 404 })
		}

		return new NextResponse(error.message, { status: 500 })
	}
}
