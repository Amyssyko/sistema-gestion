import NextAuth from "next-auth"

declare module "next-auth" {
	interface Session {
		user: {
			dni: string | number
			role: string
			nombre?: string
			apellido?: string
			telefono?: string
			email: string
			provincia?: string
			ciudad?: string
			calle?: string
			accessToken?: string
		}
	}
}
