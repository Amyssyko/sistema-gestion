import { NextResponse } from "next/server"
export async function GET(req, res) {
	return NextResponse.json({ message: " Hello" })
}
export async function POST(req, res) {
	return res.status(200).json({ message: " Hello" })
}
