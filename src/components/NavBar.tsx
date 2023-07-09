import React from "react"
import Link from "next/link"
import { Navbar, Collapse, Typography, Button, IconButton, List, ListItem } from "@material-tailwind/react"
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline"
import { useSession, signIn, signOut } from "next-auth/react"

function NavList() {
	return (
		<List className="mt-4 mb-6 p-0 lg:mt-0 lg:mb-0 lg:flex-row lg:p-1">
			<Typography as="div" variant="small" color="blue-gray" className="font-normal">
				<Link href={"/dashboard"}>
					<ListItem className="flex items-center gap-2 py-2 pr-4">
						<svg
							fill="currentColor"
							strokeWidth="0"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							height="1em"
							width="1em"
						>
							<path d="M4 13h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1zm-1 7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v4zm10 0a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v7zm1-10h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1z"></path>
						</svg>
						Dashboard
					</ListItem>
				</Link>
			</Typography>
			<Typography as="div" variant="small" color="blue-gray" className="font-normal">
				<Link href={"/ingresos"}>
					<ListItem className="flex items-center gap-2 py-2 pr-4">
						<svg
							fill="currentColor"
							strokeWidth="0"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 576 512"
							height="1em"
							width="1em"
						>
							<path d="M0 112.5v309.8c0 18 10.1 35 27 41.3 87 32.5 174 10.3 261-11.9 79.8-20.3 159.6-40.7 239.3-18.9 23 6.3 48.7-9.5 48.7-33.4V89.7c0-18-10.1-35-27-41.3-87-32.5-174-10.3-261 11.9-79.8 20.3-159.6 40.6-239.3 18.8C25.6 72.8 0 88.6 0 112.5zM288 352c-44.2 0-80-43-80-96s35.8-96 80-96 80 43 80 96-35.8 96-80 96zm-224 0c35.3 0 64 28.7 64 64H64v-64zm64-208c0 35.3-28.7 64-64 64v-64h64zm384 160v64h-64c0-35.3 28.7-64 64-64zM448 96h64v64c-35.3 0-64-28.7-64-64z"></path>
						</svg>
						Ingresos
					</ListItem>
				</Link>
			</Typography>
			<Typography as="div" variant="small" color="blue-gray" className="font-normal">
				<Link href={"/egresos"}>
					<ListItem className="flex items-center gap-2 py-2 pr-4">
						<svg
							fill="currentColor"
							strokeWidth="2"
							xmlns="http://www.w3.org/2000/svg"
							className="icon icon-tabler icon-tabler-moneybag"
							width="1em"
							height="1em"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
							<path d="M9.5 3h5a1.5 1.5 0 0 1 1.5 1.5a3.5 3.5 0 0 1 -3.5 3.5h-1a3.5 3.5 0 0 1 -3.5 -3.5a1.5 1.5 0 0 1 1.5 -1.5z"></path>
							<path d="M4 17v-1a8 8 0 1 1 16 0v1a4 4 0 0 1 -4 4h-8a4 4 0 0 1 -4 -4z"></path>
						</svg>
						Egresos
					</ListItem>
				</Link>
			</Typography>
		</List>
	)
}

export default function NavBar() {
	const [openNav, setOpenNav] = React.useState(false)
	const { data: session } = useSession()
	React.useEffect(() => {
		window.addEventListener("resize", () => window.innerWidth >= 960 && setOpenNav(false))
	}, [])
	return (
		<Navbar className="mx-auto max-w-screen-xl px-4 py-2">
			<div className="flex items-center justify-between text-blue-gray-900">
				<Link href={"/"}>
					<Typography as="span" className="mr-4 cursor-pointer py-1.5 lg:ml-2">
						Gestión Coop Turisma La Maná
					</Typography>{" "}
				</Link>
				<div className="hidden lg:block">
					<NavList />
				</div>
				<div className="hidden gap-2 lg:flex">
					{session?.user ? (
						<Button
							onClick={() => signOut()}
							variant="text"
							size="sm"
							className="text-red-800/80 hover:text-red-500/100"
						>
							Cerrar Sesión
						</Button>
					) : (
						<Button
							onClick={() => signIn()}
							variant="text"
							size="sm"
							className="text-black/80 hover:text-blue-500"
						>
							Iniciar Sesión
						</Button>
					)}

					<Link href={"/auth/register"}>
						<Button variant="gradient" size="sm">
							Registro
						</Button>
					</Link>
				</div>
				<IconButton
					variant="text"
					color="blue-gray"
					className="lg:hidden"
					onClick={() => setOpenNav(!openNav)}
				>
					{openNav ? (
						<XMarkIcon className="h-6 w-6" strokeWidth={2} />
					) : (
						<Bars3Icon className="h-6 w-6" strokeWidth={2} />
					)}
				</IconButton>
			</div>
			<Collapse open={openNav}>
				<NavList />
				<div className="flex w-full flex-nowrap items-center gap-2 lg:hidden">
					<Link href={"/auth/login"}>
						<Button variant="outlined" size="sm" color="blue-gray" fullWidth>
							Iniciar Sesión
						</Button>
					</Link>
					<Link href={"/auth/register"}>
						<Button variant="gradient" size="sm" fullWidth>
							Registro
						</Button>
					</Link>
				</div>
			</Collapse>
		</Navbar>
	)
}
