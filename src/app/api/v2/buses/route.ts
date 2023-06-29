import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import Joi from "joi"
export async function GET(request: Request) {
	function isEmptyObject(obj: any): boolean {
		return Object.keys(obj).length === 0
	}

	const buses = await prisma.bus.findMany()

	if (isEmptyObject(buses)) {
		return new NextResponse("No existen buses ", { status: 404 })
	}

	const formattedBuses = buses.map((bus: any) => {
		return {
			...bus,
			createdAt: new Date(bus.createdAt).toISOString().replace("T", " ").slice(0, -8),
			updatedAt: new Date(bus.updatedAt).toISOString().replace("T", " ").slice(0, -8),
		}
	})

	return NextResponse.json(formattedBuses, { status: 200 })
}

export async function POST(request: Request) {
	const json = await request.json()
	const { placa, modelo } = json
	const capacidad = parseInt(json.capacidad)
	const anio = parseInt(json.anio)
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

		const bus = await prisma.bus.create({
			data: { placa, modelo, capacidad, anio },
		})

		return NextResponse.json(bus, { status: 201 })
	} catch (error: any) {
		if (error.code === "P2002") {
			return new NextResponse("Ya existe matrícula", {
				status: 409,
			})
		}
		return new NextResponse(error.message, { status: 500 })
	}
}
