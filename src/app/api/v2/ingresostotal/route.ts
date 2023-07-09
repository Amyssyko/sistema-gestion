import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
	function isEmptyObject(obj: any): boolean {
		return Object.keys(obj).length === 0
	}

	const ingreso = await prisma.ingreso.findMany({ select: { monto: true, fecha: true } })

	if (isEmptyObject(ingreso)) {
		return new NextResponse("No existe egresos", { status: 404 })
	}
	const formattedIngresos = ingreso.map((bus: any) => {
		return {
			...bus,
			fecha: new Date(bus.fecha).toISOString().replace("T", " ").slice(0, 10),
		}
	})
	return NextResponse.json(formattedIngresos, { status: 200 })
}
