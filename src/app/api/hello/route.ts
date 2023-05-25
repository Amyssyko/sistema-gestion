//import prisma from "@/lib/prisma"

import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
	const data = await prisma.$queryRaw`SELECT NOW()`

	return NextResponse.json(`DB connected`)
}
