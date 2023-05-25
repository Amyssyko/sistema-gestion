import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import Joi from "joi"
export async function GET(request: Request) {
	function isEmptyObject(obj: any): boolean {
		return Object.keys(obj).length === 0
	}

	const buses = await prisma.bus.findMany()
	if (isEmptyObject(buses)) {
		return new NextResponse("No existen buses ", { status: 201 })
	}
	return NextResponse.json(buses)
}

export async function POST(request: Request) {
	try {
		const { placa, modelo, capacidad, anio, id_chofer } = await request.json()

		const parsedCapacidad = parseInt(capacidad)
		const parsedAnio = parseInt(anio)
		const schema = Joi.object({
			placa: Joi.string().required().min(7),
			modelo: Joi.string().required().min(3),
			capacidad: Joi.number().required().min(1),
			anio: Joi.number().required(),
			id_chofer: Joi.string().required().min(10),
		})

		const { error } = schema.validate({ placa, modelo, capacidad, anio, id_chofer })
		if (error) {
			return new NextResponse(error.message, { status: 400 })
		}

		const licensePlate = await prisma.bus.create({
			data: { placa, modelo, capacidad: parsedCapacidad, anio: parsedAnio, id_chofer },
		})

		return new NextResponse(JSON.stringify(licensePlate), {
			status: 201,
			headers: { "Content-Type": "application/json" },
		})
	} catch (error: any) {
		//console.log(error)
		if (error.code === "P2002") {
			return new NextResponse(`Bus with license plate already exists: ${error.meta.target}`, {
				status: 409,
			})
		}
		return new NextResponse(error.message, { status: 500 })
	}
}
