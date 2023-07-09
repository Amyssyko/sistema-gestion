import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
	function isEmptyObject(obj: any): boolean {
		return Object.keys(obj).length === 0
	}

	const egresos = await prisma.egreso.findMany({ select: { monto: true, fecha: true } })

	if (isEmptyObject(egresos)) {
		return new NextResponse("No existe egresos", { status: 404 })
	}
	const formattedEgresos = egresos.map((bus: any) => {
		return {
			...bus,
			fecha: new Date(bus.fecha).toISOString().replace("T", " ").slice(0, 10),
		}
	})
	return NextResponse.json(formattedEgresos, { status: 200 })
}
