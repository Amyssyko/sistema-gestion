import { NextResponse } from "next/server"
import Joi from "joi"
import { verificarCedula } from "udv-ec"
import prisma from "@/lib/prisma"
import * as bcrypt from "bcrypt"

export async function GET(request: Request, { params }: { params: { id: string } }) {
	const id = Number(params.id)
	const usuario = await prisma.usuario.findUnique({
		where: { id },
	})
	if (!usuario) {
		return new NextResponse(`No se encontró ${id}`, { status: 404 })
	}
	return NextResponse.json(usuario, { status: 200 })
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
	const id = Number(params.id)

	const json = await request.json()
	const { dni, nombre, apellido, email, password, telefono, provincia, ciudad, calle } = json
	const rol = json.role

	try {
		const schema = Joi.object({
			dni: Joi.string().required().min(10).max(10).messages({
				"any.required": "Cedula es requerida",
				"string.base": "La cédula solo contiene números",
				"string.empty": "La cédula está vacia",
				"string.min": "La cédula debe tener al menos 10 dígitos",
				"string.max": "La cédula no puede tener más de 10 dígitos",
			}),
			rol: Joi.string().required().messages({
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

		const { error, value } = schema.validate(json)

		if (!verificarCedula(json.dni)) {
			return new NextResponse(`${json.dni} no es valida`, { status: 400 })
		}

		const updateUser = await prisma.usuario.update({
			where: { id },
			data: {
				dni,
				role: rol,
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
		const { role, password, createdAt, updatedAt, ...userWithoutPerson } = updateUser
		return NextResponse.json(userWithoutPerson, { status: 200 })
	} catch (error: any) {
		//Si ya existe email en otra cuenta
		if (error.code === "P2002") {
			return new NextResponse(`Ya existe  el email ${email}`, { status: 409 })
		}
		// si no encuentra id
		if (error.code === "P2025") {
			return new NextResponse(`No se encontró "${id}"`, { status: 404 })
		}
		// si no encuentra matricula
		if (error.code === "P2003") {
			return new NextResponse(`No se encontró matricula ${id}`, { status: 404 })
		}

		return new NextResponse(error.message, { status: 500 })
	}
}

//?metodo delete para eliminar adopcion
export async function POST(request: Request, { params }: { params: { id: string | number } }) {
	const id = Number(params.id)
	try {
		const schema = Joi.object({
			id: Joi.number().required().messages({
				"any.required": "ID Adopcion es requerida",
				"number.base": "ID Adopcion solo contiene números",
				"number.empty": "ID Adopcion está vacio",
			}),
		})

		const { error } = schema.validate({ id })

		if (error) {
			//! Retorna error en la validacion
			return new NextResponse(error.message, { status: 400 })
		}
		await prisma.usuario.delete({ where: { id } })

		//! Retorna respuesta, codigo 204
		return new NextResponse(null, { status: 204 })
	} catch (error: any) {
		if (error.code === "P2025") {
			//! Retorna mensaje si no existe id del registro
			return new NextResponse("No existe registro de usuario", { status: 404 })
		}

		return new NextResponse(error.message, { status: 500 })
	}
}
