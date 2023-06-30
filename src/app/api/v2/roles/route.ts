"use server"
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

export async function POST(request: Request) {
	const json = await request.json()

	const { dni, role, nombre, apellido, email, password, telefono, provincia, ciudad, calle } = json
	try {
		const schema = Joi.object({
			dni: Joi.string().required().min(10).max(10).messages({
				"any.required": "Cedula es requerida",
				"string.base": "La cédula solo contiene números",
				"string.empty": "La cédula está vacia",
				"string.min": "La cédula debe tener al menos 10 dígitos",
				"string.max": "La cédula no puede tener más de 10 dígitos",
			}),
			role: Joi.string().required().messages({
				"any.required": "Rol requerido",
				"string.base": "Rol tiene que ser solo letras",
				"string.empty": "Rol está vacio",
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
		})

		const { error, value } = schema.validate({
			dni,
			role,
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
			return new NextResponse(error.message, { status: 400 })
		}

		if (!verificarCedula(value.dni)) {
			return new NextResponse(`Cedula no es valida!`, { status: 400 })
		}

		const usuario = await prisma.usuario.create({
			data: {
				dni,
				role,
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
	} catch (error: any) {
		if (error.code === "P2002") {
			return new NextResponse(`Ya existe cedula "${json.dni}"`, {
				status: 409,
			})
		}

		return new NextResponse(error.message, { status: 500 })
	}
}
