import Joi from "joi"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
	const id = Number(params.id)
	const schema = Joi.object({
		id: Joi.number().required().messages({
			"string.pattern.base": "El id no valida",
			"any.required": "El id es requerido",
			"number.base": `El id tiene que ser un numero`,
			"number.empty": "El id está vacio",
		}),
	})

	const { error } = schema.validate({ id })
	if (error) {
		return new NextResponse(error.message, { status: 400 })
	}
	const proveedor = await prisma.proveedor.findUnique({
		where: { id },
	})

	if (!proveedor) {
		return new NextResponse(`Matricula no encontrada ${id}`, { status: 404 })
	}

	return NextResponse.json(proveedor, { status: 200 })
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
	const id = Number(params.id)
	const { nombre, telefono, email, direccion } = await request.json()

	try {
		const schema = Joi.object({
			nombre: Joi.string().required().messages({
				"any.required": "Nombre requerido",
				"string.base": "Nombre tiene que ser solo letras",
				"string.empty": "Nombre está vacio",
			}),
			telefono: Joi.string().required().min(10).max(10).messages({
				"any.required": "El telefono es requerido",
				"string.base": "El telefono debe ser solo números",
				"string.empty": "El telefono está vacio",
				"string.min": "El telefono debe tener al menos 10 dígitos",
				"string.max": "El telefono no puede tener más de 10 dígitos",
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
			direccion: Joi.string().required().messages({
				"any.required": "La direccion requerida",
				"string.base": "La direccion no tiene formato correcto",
				"string.empty": "La direccion está vacio",
			}),
		})
		const { error } = schema.validate({ nombre, telefono, email, direccion })
		if (error) {
			return new NextResponse(error.message, { status: 400 })
		}

		const updatedBus = await prisma.proveedor.update({
			where: { id },
			data: { nombre, telefono, email, direccion },
		})

		return NextResponse.json(updatedBus, { status: 200 })
	} catch (error: any) {
		if (error.code === "P2025") {
			return new NextResponse(`No existe matrícula ${id}`, { status: 404 })
		}
	}
}

//?metodo delete para eliminar
export async function POST(request: Request, { params }: { params: { id: string } }) {
	const id = Number(params.id)
	try {
		await prisma.proveedor.delete({ where: { id } })
		//! Retorna respuesta, codigo 204
		return new NextResponse(null, { status: 204 })
	} catch (error: any) {
		if (error.code === "P2025") {
			//! Retorna mensaje si no existe id del registro
			return new NextResponse("No existe registro de proveedor", { status: 404 })
		}

		return new NextResponse(error.message, { status: 500 })
	}
}
