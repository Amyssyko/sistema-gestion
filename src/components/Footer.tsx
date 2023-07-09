"use client"
import { Button, Chip, Tab, Tabs, Typography } from "@material-tailwind/react"
import { useSession, signOut, signIn } from "next-auth/react"
import Link from "next/link"

function Footer() {
	const { data: session } = useSession()

	return (
		<footer className="mx-auto my-auto w-full bg-white p-4 border-gray-400 border-t ">
			<div className="flex flex-col md:flex-row md:items-center md:justify-between">
				<svg
					strokeWidth="0"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					height="4em"
					width="3em"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="text-black animate-pulse"
				>
					<path
						fill="currentColor"
						d="M12.005 22.003c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10Zm-3.5-8v2h2.5v2h2v-2h1a2.5 2.5 0 0 0 0-5h-4a.5.5 0 1 1 0-1h5.5v-2h-2.5v-2h-2v2h-1a2.5 2.5 0 1 0 0 5h4a.5.5 0 0 1 0 1h-5.5Z"
					></path>
				</svg>
				<ul className="flex flex-wrap justify-center gap-y-2 gap-x-8 md:justify-end dark:text-black">
					<li>
						<Link href="/">
							<Typography
								as="span"
								color="blue-gray"
								className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500"
							>
								Inicio
							</Typography>
						</Link>
					</li>
					<li>
						<Link href="/ingresos">
							<Typography
								as="span"
								color="blue-gray"
								className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500"
							>
								Ingresos
							</Typography>
						</Link>
					</li>
					<li>
						<Link href="/egresos">
							<Typography
								as="span"
								color="blue-gray"
								className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500"
							>
								Egresos
							</Typography>
						</Link>
					</li>
					{session?.user && session?.user.role !== "empleado" ? (
						<li>
							<Link href="/dashboard">
								<Typography
									as="span"
									color="blue-gray"
									className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500"
								>
									Dashboard
								</Typography>
							</Link>
						</li>
					) : (
						""
					)}
				</ul>
			</div>
			<hr className="my-auto mx-auto border-blue-gray-50 " />
			<Typography color="blue-gray" className="text-center font-normal dark:text-black">
				{`© ${new Date().getFullYear()} Gestión Coop Turisma La Maná - UTC`}
			</Typography>
		</footer>
	)
}

export default Footer
