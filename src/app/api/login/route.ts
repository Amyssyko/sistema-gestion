import prisma from "@/lib/prisma"
import Joi from "joi"
import { NextResponse } from "next/server"
import * as bcrypt from "bcrypt"

interface RequestBody {
	email: string
	password: string
}

export async function POST(request: Request) {
	try {
		const { email, password }: RequestBody = await request.json()

		if (email.length === 0 || password.length === 0) {
			return new NextResponse("Ingrese informacion", { status: 400 })
		}
		const schema = Joi.object({
			email: Joi.string().required(),
			password: Joi.string().required(),
		})
		const { error } = schema.validate({ email, password })
		if (error) {
			return new NextResponse(error.message, { status: 400 })
		}
		const [data] = await prisma.chofer.findMany({
			where: {
				email: email,
			},
		})

		if (data && (await bcrypt.compare(password, data.password))) {
			const { password, createdAt, updatedAt, ...userWithoutPass } = data
			//console.log(userWithoutPass)
			return new Response(JSON.stringify(userWithoutPass))
		} else return new Response(JSON.stringify(null), { status: 401 })
		//if (!data) return new NextResponse(`No existe ${email}`, { status: 400 })
		//else if (data.password !== password) return new NextResponse(`Contraseña invalida`, { status: 400 })
	} catch (error: any) {
		console.log(error)

		return new NextResponse(error.message, { status: 500 })
	}
}

/*const postUserData = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		//console.log(typeof credentials?.email + " " + typeof credentials?.password) //string
		//console.log(credentials)

		if (credentials?.email == null) {
			console.log("no existe email")
			return res.status(300).json({ message: "User does not exist" })
		}

		if (credentials.password !== password) {
			console.log("failed password")
			return res.status(300).json({ message: "Incorrect password" })
		}
		const token = sign(
			{
				data: credentials,
			},
			"secret",
			{ expiresIn: "7d" }
		)

		const SerializedToken = serialize("MyToken", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 1000 * 60 * 60 * 24 * 2,
			path: "/",
		})

		res.setHeader("Set-Cookie", SerializedToken)

		//console.log(credentials)
		return res.status(200).json({
			message: "Login successful",
		})
	} catch (error: any) {
		return res.status(409).json({ message: error.message })
	}
}*/
