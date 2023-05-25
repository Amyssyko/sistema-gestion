import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(reques: Request, { params }: { params: { id: string } }) {
	const data = reques.body

	const result = await prisma.chofer.findMany({
		where: {
			apellido: {
				search: "pilla",
			},
		},
	})
	return NextResponse.json(result)
}
