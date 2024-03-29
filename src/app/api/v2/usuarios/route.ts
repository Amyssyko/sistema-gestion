import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import Joi from "joi"
import { verificarCedula } from "udv-ec"
import * as bcrypt from "bcrypt"

export async function GET(request: Request) {
	function isEmptyObject(obj: any): boolean {
		return Object.keys(obj).length === 0
	}

	const users = await prisma.usuario.findMany()
	if (isEmptyObject(users)) {
		return new NextResponse("No existen datos de usuarios", { status: 201 })
	}

	return NextResponse.json(users, { status: 200 })
}

type BodyRequest = {
	dni: string
	nombre: string
	apellido: string
	email: string
	password: string
	telefono: string
	provincia: string
	ciudad: string
	calle: string
	busPlaca?: string
}

export async function POST(request: Request) {
	const json = await request.json()
	const { dni, nombre, apellido, email, password, telefono, provincia, ciudad, calle, busPlaca } = json

	try {
		const schema = Joi.object({
			dni: Joi.string().required().min(10).max(10).messages({
				"any.required": "Cedula es requerida",
				"string.base": "La cédula solo contiene números",
				"string.empty": "La cédula está vacia",
				"string.min": "La cédula debe tener al menos 10 dígitos",
				"string.max": "La cédula no puede tener más de 10 dígitos",
			}),
			nombre: Joi.string().required().messages({
				"any.required": "Nombre requerido",
				"string.base": "Nombre tiene que ser solo letras",
				"string.empty": "Nombre está vacio",
			}),
			apellido: Joi.string().required().messages({
				"any.required": "Apellido requerido",
				"string.base": "Apellido tiene que ser solo letras",
				"string.empty": "Apellido está vacio",
			}),
			email: Joi.string()
				.email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "org", "es", "ec"] } })
				.required()
				.messages({
					"any.required": "El email requerido",
					"string.base": "El email no es correcto",
					"string.empty": "El email está vacio",
					"string.email": "El email no es válido",
				}),
			telefono: Joi.string().required().min(10).max(10).messages({
				"any.required": "El telefono es requerido",
				"string.base": "El telefono debe ser solo números",
				"string.empty": "El telefono está vacio",
				"string.min": "El telefono debe tener al menos 10 dígitos",
				"string.max": "El telefono no puede tener más de 10 dígitos",
			}),
			password: Joi.string().required().messages({
				"any.required": "La contraseña requerida",
				"string.base": "La contraseña tiene que ser solo letras, numeros y caracteres",
				"string.empty": "La contraseña está vacio",
			}),
			provincia: Joi.string().required().messages({
				"any.required": "La provincia requerida",
				"string.base": "La provincia tiene que ser solo letras",
				"string.empty": "La provincia está vacio",
			}),
			ciudad: Joi.string().required().messages({
				"any.required": "La ciudad requerida",
				"string.base": "La ciudad no tiene formato correcto",
				"string.empty": "La ciudad está vacio",
			}),
			calle: Joi.string().required().messages({
				"any.required": "La calle requerida",
				"string.base": "La calle no tiene formato correcto",
				"string.empty": "La calle está vacio",
			}),
		})

		const { error } = schema.validate({
			dni,
			nombre,
			apellido,
			email,
			password,
			telefono,
			provincia,
			ciudad,
			calle,
		})
		if (error) {
			if (!verificarCedula(dni)) {
				return new NextResponse("Cedula no es valida!", { status: 400 })
			}
			return new NextResponse(error.message, { status: 400 })
		}

		if (!busPlaca) {
			const usuario = await prisma.usuario.create({
				data: {
					dni,
					nombre,
					apellido,
					email,
					password: await bcrypt.hash(json.password, 10),
					telefono,
					provincia,
					ciudad,
					calle,
				},
			})
			return NextResponse.json(usuario, { status: 200 })
		}

		const usuario = await prisma.usuario.create({
			data: {
				dni,
				nombre,
				apellido,
				email,
				password: await bcrypt.hash(json.password, 10),
				telefono,
				provincia,
				ciudad,
				calle,
				busPlaca,
			},
		})

		return NextResponse.json(usuario, { status: 200 })
	} catch (error: any) {
		if (error.code === "P2002") {
			return new NextResponse(`Ya existe cedula "${json.dni}"`, {
				status: 409,
			})
		}

		return new NextResponse(error.message, { status: 500 })
	}
}

export async function PATCH(request: Request) {
	const json = await request.json()
	const { dni, nombre, apellido, email, password, telefono, provincia, ciudad, calle, busPlaca } = json
	try {
		const schema = Joi.object({
			dni: Joi.string().required().min(10).max(10).messages({
				"any.required": "Cedula es requerida",
				"string.base": "La cédula solo contiene números",
				"string.empty": "La cédula es contiene solo números",
				"string.min": "La cédula debe tener al menos 10 dígitos",
				"string.max": "La cédula no puede tener más de 10 dígitos",
			}),
			nombre: Joi.string().required().messages({
				"any.required": "Nombre requerido",
				"string.base": "Nombre tiene que ser solo letras",
				"string.empty": "Nombre está vacio",
			}),
			apellido: Joi.string().required().messages({
				"any.required": "Apellido requerido",
				"string.base": "Apellido tiene que ser solo letras",
				"string.empty": "Apellido está vacio",
			}),
			email: Joi.string()
				.email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "org", "es", "ec"] } })
				.required()
				.messages({
					"any.required": "El email requerido",
					"string.base": "El email no es correcto",
					"string.empty": "El email está vacio",
					"string.email": "El email no es válido",
				}),
			password: Joi.string().required().messages({
				"any.required": "La contraseña requerida",
				"string.base": "La contraseña tiene que ser solo letras, numeros y caracteres",
				"string.empty": "La contraseña está vacio",
			}),
			telefono: Joi.string().required().min(10).min(10).messages({
				"any.required": "El telefono es requerido",
				"string.base": "El telefono debe ser solo números",
				"string.empty": "El telefono está vacio",
				"string.min": "El telefono debe tener al menos 10 dígitos",
				"string.max": "El telefono no puede tener más de 10 dígitos",
			}),
			provincia: Joi.string().required().messages({
				"any.required": "La provincia requerida",
				"string.base": "La provincia tiene que ser solo letras",
				"string.empty": "La provincia está vacio",
			}),
			ciudad: Joi.string().required().messages({
				"any.required": "La ciudad requerida",
				"string.base": "La ciudad no tiene formato correcto",
				"string.empty": "La ciudad está vacio",
			}),
			calle: Joi.string().required().messages({
				"any.required": "La calle requerida",
				"string.base": "La calle no tiene formato correcto",
				"string.empty": "La calle está vacio",
			}),
			busPlaca: Joi.string()
				.pattern(new RegExp(/[A-C,E,G-Z]{1}[A]{1}[A-Z]{1}\d{4}/))
				.required()
				.min(7)
				.max(7)
				.messages({
					"any.required": "La matricula es requerido",
					"string.base": "La matricula debe ser solo números",
					"string.empty": "La matricula está vacio",
					"string.min": "La matricula debe tener al menos 7 caracteres",
					"string.max": "La matricula no puede tener más de 7 caracteres",
				}),
		})

		const { error } = schema.validate({
			dni,
			nombre,
			apellido,
			email,
			password,
			telefono,
			provincia,
			ciudad,
			calle,
			busPlaca,
		})
		if (error) {
			if (!verificarCedula(dni)) {
				return new NextResponse("Cedula no es valida!", { status: 400 })
			}
			return new NextResponse(error.message, { status: 400 })
		}

		const usuario = await prisma.usuario.update({
			where: { dni },
			data: {
				nombre,
				apellido,
				email,
				telefono,
				password: await bcrypt.hash(json.password, 10),
				provincia,
				ciudad,
				calle,
				busPlaca,
			},
		})

		if (usuario && (await bcrypt.compare(password, usuario.password))) {
			const { role, password, createdAt, updatedAt, ...userWithoutPerson } = usuario

			return NextResponse.json(userWithoutPerson, { status: 200 })
		} else {
			return new Response(JSON.stringify("Contraseña incorrecta"), { status: 401 })
		}
	} catch (error: any) {
		if (error.code === "P2002") {
			return new NextResponse(`Ya existe cedula "${json.dni}"`, {
				status: 409,
			})
		}

		return new NextResponse(error.message, { status: 500 })
	}
}
