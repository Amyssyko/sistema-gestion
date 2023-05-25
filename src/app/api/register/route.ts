"use server"
import prisma from "@/lib/prisma"
import * as bcrypt from "bcrypt"
import { NextResponse } from "next/server"
import Joi from "joi"
import { verificarCedula } from "udv-ec"

interface RequestBody {
	dni: string
	email: string
	password: string
}

export async function POST(request: Request) {
	const json: RequestBody = await request.json()

	try {
		if (!verificarCedula(json.dni)) {
			return new NextResponse(`${json.dni} no es valida`, { status: 400 })
		}

		const schema = Joi.object({
			dni: Joi.string().required().min(10),
			email: Joi.string()
				.email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "org"] } })
				.required()
				.min(5),
			password: Joi.string().required().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).min(6),
		})

		const { error } = schema.validate(json)
		if (error) {
			return new NextResponse(error.message, { status: 400 })
		}

		const driver = await prisma.chofer.create({
			data: { dni: json.dni, email: json.email, password: await bcrypt.hash(json.password, 10) },
		})

		const { password, ...result } = driver

		return new NextResponse(JSON.stringify(result), {
			status: 201,
			headers: { "Content-Type": "application/json" },
		})
	} catch (error: any) {
		if (error.code === "P2002") {
			return new NextResponse(`Usuario registrado`, {
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
