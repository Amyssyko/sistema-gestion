import prisma from "@/lib/prisma"
import Joi from "joi"
import { NextResponse } from "next/server"
import bcrypt from "bcrypt"
import { signJwtAccessToken } from "@/lib/jwt"
interface RequestBody {
	email: string
	password: string
}

export async function POST(request: Request) {
	const json = await request.json()
	const { email, password } = json
	try {
		const schema = Joi.object({
			email: Joi.string().email().required().messages({
				"string.empty": "El correo es requerido",
			}),
			password: Joi.string().required().messages({
				"string.empty": "La contraseña es requerida",
			}),
		})

		const { error } = schema.validate({ email, password })
		if (error) {
			return new NextResponse(error.message, { status: 401 })
		}
		const data = await prisma.usuario.findUnique({
			where: { email },
		})

		if (data && (await bcrypt.compare(password, data.password))) {
			//Desectroctura los datos
			const { password, createdAt, updatedAt, ...userWithoutPerson } = data

			const accessToken = signJwtAccessToken(userWithoutPerson)
			const result = { ...userWithoutPerson, accessToken }

			return new Response(JSON.stringify(result), { status: 201 })
		} else {
			return new Response(JSON.stringify("Credenciales inválidas"), { status: 401 })
		}
	} catch (error: any) {
		console.error(error)
		return new NextResponse(error.message, { status: 500 })
	}
}
