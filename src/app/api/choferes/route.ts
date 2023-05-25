"use server"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import Joi from "joi"
import { verificarCedula } from "udv-ec"

export async function GET(request: Request) {
	function isEmptyObject(obj: any): boolean {
		return Object.keys(obj).length === 0
	}

	const drivers = await prisma.chofer.findMany()
	if (isEmptyObject(drivers)) {
		return new NextResponse("No existen datos de usuarios", { status: 201 })
	}
	return NextResponse.json(drivers)
}

export async function POST(request: Request) {
	const json = await request.json()

	try {
		if (!verificarCedula(json.dni)) {
			return new NextResponse(`${json.dni} no es valida`, { status: 400 })
		}

		const schema = Joi.object({
			dni: Joi.string().required().min(10),
			nombre: Joi.string().required().min(3),
			apellido: Joi.string().required().min(3),
			email: Joi.string()
				.email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "org"] } })
				.required()
				.min(5),
			password: Joi.string().required().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).min(6),
			telefono: Joi.string().required().min(10),
			provincia: Joi.string().required().min(3),
			ciudad: Joi.string().required().min(3),
			calle: Joi.string().required().min(3),
		})

		const { error } = schema.validate(json)
		if (error) {
			return new NextResponse(error.message, { status: 400 })
		}

		const driver = await prisma.chofer.create({
			data: json,
		})

		return new NextResponse(JSON.stringify(driver), {
			status: 201,
			headers: { "Content-Type": "application/json" },
		})
	} catch (error: any) {
		if (error.code === "P2002") {
			return new NextResponse(`Ya existe cedula "${json.dni}"`, {
				status: 409,
			})
		}
		if (error.code === "P2000") {
			return new NextResponse("Verifique los la información ingresada", {
				status: 400,
			})
		}
		return new NextResponse(error.message, { status: 500 })
	}
}
