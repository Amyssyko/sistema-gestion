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
	try {
		const { email, password }: RequestBody = await request.json()
		console.log({ email, password })
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
			return new NextResponse(error.details[0].message, { status: 401 })
		}
		const data = await prisma.usuario.findUnique({
			where: { email },

			//rejectOnNotFound: false,
		})

		//console.log(data)
		if (data && (await bcrypt.compare(password, data.password))) {
			//Desectroctura los datos
			const { password, createdAt, updatedAt, ...userWithoutPerson } = data

			const accessToken = signJwtAccessToken(userWithoutPerson)
			//console.log(accessToken)
			const result = { ...userWithoutPerson, accessToken }
			console.log(result)
			return new Response(JSON.stringify(result), { status: 201 })
		} else {
			console.log("401")
			return new Response(JSON.stringify("Credenciales inválidas"), { status: 401 })
		}
	} catch (error: any) {
		console.log("Error Api Login")
		console.error(error)
		return new NextResponse(error.message, { status: 500 })
	}
}
