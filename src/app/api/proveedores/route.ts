import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import Joi from "joi"
export async function GET(request: Request) {
	function isEmptyObject(obj: any): boolean {
		return Object.keys(obj).length === 0
	}

	const proveedor = await prisma.proveedor.findMany()
	if (isEmptyObject(proveedor)) {
		return new NextResponse("No existen proveedores ", { status: 404 })
	}

	const filteredProveedor = proveedor.map(
		({ createdAt, updatedAt, ...proveedorWithoutData }) => proveedorWithoutData
	)

	return NextResponse.json(filteredProveedor, { status: 200 })
}

export async function POST(request: Request) {
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

		const proveedor = await prisma.proveedor.create({
			data: { nombre, telefono, email, direccion },
		})

		const { createdAt, updatedAt, ...proveedorWithoutData } = proveedor

		return NextResponse.json(proveedorWithoutData, { status: 201 })
	} catch (error: any) {
		if (error.code === "P2002") {
			return new NextResponse(`Ya existe email`, {
				status: 409,
			})
		}

		return new NextResponse(error.message, { status: 500 })
	}
}
