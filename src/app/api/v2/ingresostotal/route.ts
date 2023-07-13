import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
	const ingreso = await prisma.ingreso.findMany({ select: { monto: true, fecha: true } })

	if (ingreso.length === 0) {
		return new NextResponse("No existen ingresos", { status: 404 })
	}

	const ingresostotal = ingreso.reduce((total, { monto }) => total + Number(monto), 0)

	return NextResponse.json({ ingresostotal }, { status: 200 })
}
