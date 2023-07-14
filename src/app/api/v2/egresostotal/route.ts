import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
	const egreso = await prisma.egreso.findMany({ select: { monto: true, fecha: true } })

	if (egreso.length === 0) {
		return new NextResponse("No existen egresos", { status: 404 })
	}

	const egresostotal = egreso && egreso?.reduce((total, { monto }) => total + Number(monto), 0)

	return NextResponse.json(egresostotal, { status: 200 })
}
