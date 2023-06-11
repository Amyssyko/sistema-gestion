"use server"

import * as bcrypt from "bcrypt"
import { NextResponse } from "next/server"
import Joi from "joi"
import prisma from "@/lib/prisma"
import { verificarCedula } from "udv-ec"

interface RequestBody {
	dni: string
	email: string
	password: string
	confirm_password: string
}

export async function POST(request: Request) {
	const json: RequestBody = await request.json()
	console.log(`backend ${JSON.stringify(json)}`)

	const { dni, email, password, confirm_password } = json

	try {
		const schema = Joi.object({
			dni: Joi.string().required().min(10).max(10).messages({
				"number.base": "La cédula debe ser un número",
				"number.empty": "La cédula es requerida",
				"number.min": "La cédula debe tener al menos 10 dígitos",
				"number.max": "La cédula no puede tener más de 10 dígitos",
			}),
			email: Joi.string()
				.email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "org", "es", "ec"] } })
				.required()
				.messages({
					"string.empty": "El correo es requerido",
					"string.email": "El correo no es válido",
				}),
			password: Joi.string().required().pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z]).{8,}$")).messages({
				"string.empty": "La contraseña es requerida",
				"string.pattern.base":
					"La contraseña debe tener al menos 8 caracteres y contener al menos una letra mayúscula",
			}),
			confirm_password: Joi.string().required().valid(Joi.ref("password")).messages({
				"string.empty": "La confirmación de contraseña es requerida",
				"any.only": "Las contraseñas no coinciden",
			}),
		})

		const { error, value } = schema.validate(json)

		console.log(value)
		if (error) {
			console.log(error)
			return new NextResponse(error.message, { status: 400 })
		}
		if (!verificarCedula(dni)) {
			console.log(value?.dni)
			return new NextResponse("Cedula no valida", { status: 400 })
		}

		const user = await prisma.usuario.create({
			data: { dni, email, password: await bcrypt.hash(json.password, 10) },
		})

		const { password, ...result } = user
		console.log(result)
		return new NextResponse(JSON.stringify(result), {
			status: 201,
			headers: { "Content-Type": "application/json" },
		})
	} catch (error: any) {
		if (error.code === "P2002") {
			return new NextResponse(`Ya existe usuario registrado`, {
				status: 409,
			})
		}

		return new NextResponse(error.message, { status: 500 })
	}
}
