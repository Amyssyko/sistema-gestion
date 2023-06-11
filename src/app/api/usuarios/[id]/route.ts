import { NextResponse } from "next/server"
import Joi from "joi"
import { verificarCedula } from "udv-ec"
import prisma from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
	//console.log(params)

	const id = params.id

	// Validate input

	const user = await prisma.usuario.findUnique({
		where: { dni: id },
	})

	if (!user) {
		return new NextResponse(`No se encontró ${id}`, { status: 404 })
	}
	const { role, password, createdAt, updatedAt, ...userWithoutData } = user

	return NextResponse.json(userWithoutData, { status: 200 })
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
	const id = params.id

	let json = await request.json()
	const { nombre, apellido, email, telefono, provincia, ciudad, calle, busPlaca } = json

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
		telefono: Joi.string().required().min(10).min(10).min(10).max(10).messages({
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
				"string.pattern.base": "La matricula no valida",
				"any.required": "La matricula es requerido",
				"string.base": "La matricula debe ser solo números",
				"string.empty": "La matricula está vacio",
				"string.min": "La matricula debe tener al menos 7 caracteres",
				"string.max": "La matricula no puede tener más de 7 caracteres",
			}),
	})
	const { error } = schema.validate(json)
	if (error) {
		return new NextResponse(error.message, { status: 400 })
	}

	if (!verificarCedula(json.dni)) {
		return new NextResponse(`${json.dni} no es valida`, { status: 400 })
	}

	try {
		const updateUser = await prisma.usuario.update({
			where: { dni: id },
			data: { nombre, apellido, email, telefono, provincia, ciudad, calle, busPlaca },
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
			return new NextResponse(`No se encontró matricula ${busPlaca}`, { status: 404 })
		}

		return new NextResponse(error.message, { status: 500 })
	}
}

//Delete fix
export async function POST(request: Request, { params }: { params: { id: string } }) {
	const id = Number(params.id)
	// Validar entrada
	if (!id || isNaN(Number(id))) {
		return new NextResponse("Tipo no correcto", { status: 400 })
	}
	//console.log(id)
	try {
		await prisma.usuario.delete({
			where: { id },
		})
		return NextResponse.json(null, { status: 204 })
	} catch (error: any) {
		if (error.code === "P2025") {
			return new NextResponse(`No se encontró ${id}`, { status: 404 })
		}
		return new NextResponse(error.message, { status: 500 })
	}
}
