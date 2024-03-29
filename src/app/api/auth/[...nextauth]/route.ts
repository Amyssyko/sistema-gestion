import NextAuth from "next-auth/next"
import CredentialsProvider from "next-auth/providers/credentials"
import { env } from "process"
const handler = NextAuth({
	pages: {
		signIn: "/auth/login",
	},
	session: {
		strategy: "jwt",
	},
	providers: [
		CredentialsProvider({
			// The name to display on the sign in form (e.g. "Sign in with...")
			name: "Credentials",
			// `credentials` is used to generate a form on the sign in page.
			// You can specify which fields should be submitted, by adding keys to the `credentials` object.
			// e.g. domain, username, password, 2FA token, etc.
			// You can pass any HTML attribute to the <input> tag through the object.
			credentials: {
				email: { label: "Email", type: "text", placeholder: "jsmith" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials, req) {
				// Add logic here to look up the user from the credentials supplied

				const res = await fetch(`${env.NEXTAUTH_URL}/api/auth/login`, {
					method: "POST",
					body: JSON.stringify({
						email: credentials?.email,
						password: credentials?.password,
					}),
					headers: {
						"Content-Type": "application/json",
					},
				})

				if (!res.ok) {
					return null
				}
				const user = await res.json()

				if (res.ok && user) {
					// Any object returned will be saved in `user` property of the JWT
					return user
				} else {
					// If you return null then an error will be displayed advising the user to check their details.
					return null
					// You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
				}
			},
		}),
	],
	callbacks: {
		async jwt({ token, user, trigger, session }) {
			if (trigger === "update") {
				return { ...token, ...session.user }
			}
			return { ...token, ...user }
		},

		async session({ session, token }) {
			session.user = token as any
			return session
		},
	},
})

export { handler as GET, handler as POST }
