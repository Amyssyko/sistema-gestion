import Joi from "joi"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
	//console.log(params)

	const id = params.id

	// Validate input
	if (!id || typeof id !== "string") {
		return new NextResponse("Invalid license plate", { status: 400 })
	}

	const bus = await prisma.bus.findUnique({
		where: {
			placa: id,
		},
	})

	if (!bus) {
		return new NextResponse("No bus license plate found", { status: 404 })
	}

	return NextResponse.json(bus)
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
	const id = params.id

	try {
		const { placa, modelo, capacidad, anio, id_chofer } = await request.json()
		//console.log({ placa, modelo, capacidad, anio, id_chofer })
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

		const updatedBus = await prisma.bus.update({
			where: { placa },
			data: { placa, modelo, capacidad: parsedCapacidad, anio: parsedAnio, id_chofer },
		})
		/*if (!updated_chofer) {
			return new NextResponse("No driver with DNI found", { status: 401 })
		}*/
		return NextResponse.json(updatedBus)
	} catch (error: any) {
		console.log(JSON.parse(error))
		if (error.code === "P2025") {
			return new NextResponse(`No bus with license plate found: ${id}`, { status: 404 })
		}
	}
}

//Delete fix
export async function POST(request: Request, { params }: { params: { id: string } }) {
	const id = params.id
	// Validate input
	if (!id || typeof id !== "string") {
		return new NextResponse("Invalid license plate", { status: 400 })
	}
	try {
		await prisma.bus.delete({
			where: { placa: id },
		})

		return new NextResponse(null, { status: 204 })
	} catch (error: any) {
		//console.log(error)
		if (error.code === "P2025") {
			return new NextResponse(`No bus with license plate found: ${id}`, { status: 404 })
		}

		return new NextResponse(error.message, { status: 500 })
	}
}
