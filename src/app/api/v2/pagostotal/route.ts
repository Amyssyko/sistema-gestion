import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
	const pagos = await prisma.pago.findMany({ select: { valor: true, fecha: true } })

	if (pagos.length === 0) {
		return new NextResponse("No existen pagos", { status: 404 })
	}

	const pagostotal = pagos.reduce((total, { valor }) => total + Number(valor), 0)

	return NextResponse.json({ pagostotal }, { status: 200 })
}
