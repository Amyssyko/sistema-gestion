import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import Joi from "joi"
import { verificarCedula } from "udv-ec"

export async function GET(request: Request, { params }: { params: { id: string } }) {
	//console.log(params)

	const id = params.id

	// Validate input

	const chofer = await prisma.chofer.findUnique({
		where: {
			dni: id,
		},
	})

	if (!chofer) {
		return new NextResponse("No driver driver DNI found", { status: 404 })
	}

	return NextResponse.json(chofer)
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
	const id = params.id

	let json = await request.json()

	if (!verificarCedula(json.dni)) {
		return new NextResponse(`${json.dni} no es valida`, { status: 400 })
	}
	//console.log(Object.keys(json.dni).length)
	if (json) {
		const schema = Joi.object({
			dni: Joi.string().required().min(10).max(10),
			nombre: Joi.string().required().min(3),
			apellido: Joi.string().required().min(3),
			email: Joi.string()
				.email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "org"] } })
				.required()
				.min(5),
			password: Joi.string().required().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).min(6),
			telefono: Joi.string().required().min(10).max(10),
			provincia: Joi.string().required().min(3),
			ciudad: Joi.string().required().min(3),
			calle: Joi.string().required().min(3),
		})
		const { error } = schema.validate(json)
		if (error) {
			return new NextResponse(error.message, { status: 400 })
		}
	}

	try {
		const updated_chofer = await prisma.chofer.update({
			where: { dni: id },
			data: json,
		})
		return NextResponse.json(updated_chofer, { status: 200 })
	} catch (error: any) {
		console.log(error)
		if (error.code === "P2025") {
			return new NextResponse(`No driver with DNI found "${json.dni}"`, { status: 404 })
		}
		if (error.code === "P2000") {
			return new NextResponse("Driver information incorrect", {
				status: 400,
			})
		}
		return new NextResponse(error.message, { status: 500 })
	}
}

//Delete fix
export async function POST(request: Request, { params }: { params: { id: string } }) {
	const id = params.id
	// Validate input
	if (!id || typeof id !== "string") {
		return new NextResponse("Invalid DNI", { status: 400 })
	}
	try {
		await prisma.chofer.delete({
			where: { dni: id },
		})

		return new NextResponse(null, { status: 200 })
	} catch (error: any) {
		if (error.code === "P2025") {
			return new NextResponse("No driver with DNI found", { status: 404 })
		}
		return new NextResponse(error.message, { status: 500 })
	}
}
