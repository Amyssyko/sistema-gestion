"use client"

import { signOut } from "next-auth/react"
import React from "react"
import {
	Card,
	Typography,
	List,
	ListItem,
	ListItemPrefix,
	Accordion,
	AccordionHeader,
	AccordionBody,
	Avatar,
} from "@material-tailwind/react"
import { UserCircleIcon, PowerIcon, UserGroupIcon } from "@heroicons/react/24/solid"
import { ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/24/outline"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function SidebarAdmin() {
	const router = useRouter()
	const { data: session } = useSession()

	const [open, setOpen] = React.useState(0)
	const [openAlert, setOpenAlert] = React.useState(true)

	const handleOpen = (value: any) => {
		setOpen(open === value ? 0 : value)
	}

	return (
		<Card className="fixed top-14 left-2 h-[calc(100vh-11rem)] w-60 sm:w-60 md:w-60 lg:w-60 xl:w-60 2xl:w-60 p-2  ">
			<div className="mb-2 flex items-center gap-4 p-4">
				<Avatar src="https://source.unsplash.com/random?wallpapers" alt="brand" className="h-8 w-8" />
				<Typography variant="h5" color="gray">
					{session?.user.nombre && session?.user.apellido
						? `${session?.user.nombre} ${session?.user.apellido}`
						: "Bienvenido"}
				</Typography>
			</div>
			<List>
				<Accordion
					open={open === 1}
					icon={
						<ChevronDownIcon
							strokeWidth={2.5}
							className={`mx-auto h-4 w-4 transition-transform ${open === 1 ? "rotate-180" : ""}`}
						/>
					}
				>
					<ListItem className="p-0 " selected={open === 1}>
						<AccordionHeader onClick={() => handleOpen(1)} className="border-b-0 p-3">
							<ListItemPrefix>
								<svg
									fill="currentColor"
									strokeWidth="0"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 640 512"
									height="1em"
									width="1em"
								>
									<path d="M96 128a128 128 0 1 1 256 0 128 128 0 1 1-256 0zM0 482.3C0 383.8 79.8 304 178.3 304h91.4c98.5 0 178.3 79.8 178.3 178.3 0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM504 312v-64h-64c-13.3 0-24-10.7-24-24s10.7-24 24-24h64v-64c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24h-64v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"></path>
								</svg>
							</ListItemPrefix>
							<Typography color="blue-gray" className="mr-auto font-normal">
								Usuarios
							</Typography>
						</AccordionHeader>
					</ListItem>
					<AccordionBody className="py-1">
						<List className="p-0">
							<Link href={"/dashboard/entidad/usuarios"}>
								<ListItem className="text-xs hover:bg-blue-800 rounded-md shadow-xl bg-blue-300 ">
									<ListItemPrefix>
										<ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
									</ListItemPrefix>
									Registro Usuarios
								</ListItem>
							</Link>
							<Link href={"/dashboard/lista/usuarios"}>
								<ListItem className="text-xs hover:bg-blue-800 rounded-md shadow-xl bg-blue-300 ">
									<ListItemPrefix>
										<ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
									</ListItemPrefix>
									Lista de Usuarios
								</ListItem>
							</Link>
						</List>
					</AccordionBody>
				</Accordion>

				<Accordion
					open={open === 2}
					icon={
						<ChevronDownIcon
							strokeWidth={2.5}
							className={`mx-auto h-4 w-4 transition-transform ${open === 2 ? "rotate-180" : ""}`}
						/>
					}
				>
					<ListItem className="p-0" selected={open === 2}>
						<AccordionHeader onClick={() => handleOpen(2)} className="border-b-0 p-3">
							<ListItemPrefix>
								<svg
									fill="currentColor"
									strokeWidth="0"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 16 16"
									height="1em"
									width="1em"
								>
									<path d="M5 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm8 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-6-1a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2H7Zm1-6c-1.876 0-3.426.109-4.552.226A.5.5 0 0 0 3 4.723v3.554a.5.5 0 0 0 .448.497C4.574 8.891 6.124 9 8 9c1.876 0 3.426-.109 4.552-.226A.5.5 0 0 0 13 8.277V4.723a.5.5 0 0 0-.448-.497A44.303 44.303 0 0 0 8 4Zm0-1c-1.837 0-3.353.107-4.448.22a.5.5 0 1 1-.104-.994A44.304 44.304 0 0 1 8 2c1.876 0 3.426.109 4.552.226a.5.5 0 1 1-.104.994A43.306 43.306 0 0 0 8 3Z"></path>
									<path d="M15 8a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1V2.64c0-1.188-.845-2.232-2.064-2.372A43.61 43.61 0 0 0 8 0C5.9 0 4.208.136 3.064.268 1.845.408 1 1.452 1 2.64V4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1v3.5c0 .818.393 1.544 1 2v2a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5V14h6v1.5a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-2c.607-.456 1-1.182 1-2V8ZM8 1c2.056 0 3.71.134 4.822.261.676.078 1.178.66 1.178 1.379v8.86a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 11.5V2.64c0-.72.502-1.301 1.178-1.379A42.611 42.611 0 0 1 8 1Z"></path>
								</svg>
							</ListItemPrefix>
							<Typography color="blue-gray" className="mr-auto font-normal">
								Buses
							</Typography>
						</AccordionHeader>
					</ListItem>
					<AccordionBody className="py-1">
						<List className="p-0">
							<Link href={"/dashboard/entidad/buses"}>
								<ListItem className="text-xs hover:bg-blue-800 rounded-md shadow-xl bg-blue-300 ">
									<ListItemPrefix>
										<ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
									</ListItemPrefix>
									Registro Buses
								</ListItem>
							</Link>
							<Link href={"/dashboard/lista/buses"}>
								<ListItem className="text-xs hover:bg-blue-800 rounded-md shadow-xl bg-blue-300 ">
									<ListItemPrefix>
										<ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
									</ListItemPrefix>
									Lista de Buses
								</ListItem>
							</Link>
						</List>
					</AccordionBody>
				</Accordion>

				<Accordion
					open={open === 3}
					icon={
						<ChevronDownIcon
							strokeWidth={2.5}
							className={`mx-auto h-4 w-4 transition-transform ${open === 2 ? "rotate-180" : ""}`}
						/>
					}
				>
					<ListItem className="p-0" selected={open === 3}>
						<AccordionHeader onClick={() => handleOpen(3)} className="border-b-0 p-3">
							<ListItemPrefix>
								<svg
									fill="currentColor"
									strokeWidth="0"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 1024 1024"
									height="1em"
									width="1em"
								>
									<path d="M668.6 320c0-4.4-3.6-8-8-8h-54.5c-3 0-5.8 1.7-7.1 4.4l-84.7 168.8H511l-84.7-168.8a8 8 0 0 0-7.1-4.4h-55.7c-1.3 0-2.6.3-3.8 1-3.9 2.1-5.3 7-3.2 10.8l103.9 191.6h-57c-4.4 0-8 3.6-8 8v27.1c0 4.4 3.6 8 8 8h76v39h-76c-4.4 0-8 3.6-8 8v27.1c0 4.4 3.6 8 8 8h76V704c0 4.4 3.6 8 8 8h49.9c4.4 0 8-3.6 8-8v-63.5h76.3c4.4 0 8-3.6 8-8v-27.1c0-4.4-3.6-8-8-8h-76.3v-39h76.3c4.4 0 8-3.6 8-8v-27.1c0-4.4-3.6-8-8-8H564l103.7-191.6c.5-1.1.9-2.4.9-3.7zM157.9 504.2a352.7 352.7 0 0 1 103.5-242.4c32.5-32.5 70.3-58.1 112.4-75.9 43.6-18.4 89.9-27.8 137.6-27.8 47.8 0 94.1 9.3 137.6 27.8 42.1 17.8 79.9 43.4 112.4 75.9 10 10 19.3 20.5 27.9 31.4l-50 39.1a8 8 0 0 0 3 14.1l156.8 38.3c5 1.2 9.9-2.6 9.9-7.7l.8-161.5c0-6.7-7.7-10.5-12.9-6.3l-47.8 37.4C770.7 146.3 648.6 82 511.5 82 277 82 86.3 270.1 82 503.8a8 8 0 0 0 8 8.2h60c4.3 0 7.8-3.5 7.9-7.8zM934 512h-60c-4.3 0-7.9 3.5-8 7.8a352.7 352.7 0 0 1-103.5 242.4 352.57 352.57 0 0 1-112.4 75.9c-43.6 18.4-89.9 27.8-137.6 27.8s-94.1-9.3-137.6-27.8a352.57 352.57 0 0 1-112.4-75.9c-10-10-19.3-20.5-27.9-31.4l49.9-39.1a8 8 0 0 0-3-14.1l-156.8-38.3c-5-1.2-9.9 2.6-9.9 7.7l-.8 161.7c0 6.7 7.7 10.5 12.9 6.3l47.8-37.4C253.3 877.7 375.4 942 512.5 942 747 942 937.7 753.9 942 520.2a8 8 0 0 0-8-8.2z"></path>
								</svg>
							</ListItemPrefix>
							<Typography color="blue-gray" className="mr-auto font-normal">
								Transacciones
							</Typography>
						</AccordionHeader>
					</ListItem>
					<AccordionBody className="py-1">
						<List className="p-0">
							<Link href={"/dashboard/entidad/ingresos"}>
								<ListItem className="text-xs hover:bg-blue-800 rounded-md shadow-xl bg-blue-300 ">
									<ListItemPrefix>
										<ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
									</ListItemPrefix>
									Registro Ingresos
								</ListItem>
							</Link>
							<Link href={"/dashboard/lista/ingresos"}>
								<ListItem className="text-xs hover:bg-blue-800 rounded-md shadow-xl bg-blue-300 ">
									<ListItemPrefix>
										<ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
									</ListItemPrefix>
									Lista de Ingresos
								</ListItem>
							</Link>
							<Link href={"/dashboard/entidad/egresos"}>
								<ListItem className="text-xs hover:bg-blue-800 rounded-md shadow-xl bg-blue-300 ">
									<ListItemPrefix>
										<ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
									</ListItemPrefix>
									Registro Egresos
								</ListItem>
							</Link>
							<Link href={"/dashboard/lista/egresos"}>
								<ListItem className="text-xs hover:bg-blue-800 rounded-md shadow-xl bg-blue-300 ">
									<ListItemPrefix>
										<ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
									</ListItemPrefix>
									Lista de Egresos
								</ListItem>
							</Link>
							<Link href={"/dashboard/entidad/pagos"}>
								<ListItem className="text-xs hover:bg-blue-800 rounded-md shadow-xl bg-blue-300 ">
									<ListItemPrefix>
										<ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
									</ListItemPrefix>
									Registro Pagos
								</ListItem>
							</Link>
							<Link href={"/dashboard/lista/pagos"}>
								<ListItem className="text-xs hover:bg-blue-800 rounded-md shadow-xl bg-blue-300 ">
									<ListItemPrefix>
										<ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
									</ListItemPrefix>
									Lista de Pagos
								</ListItem>
							</Link>
						</List>
					</AccordionBody>
				</Accordion>

				<Accordion
					open={open === 4}
					icon={
						<ChevronDownIcon
							strokeWidth={2.5}
							className={`mx-auto h-4 w-4 transition-transform ${open === 4 ? "rotate-180" : ""}`}
						/>
					}
				>
					<ListItem className="p-0" selected={open === 4}>
						<AccordionHeader onClick={() => handleOpen(4)} className="border-b-0 p-3">
							<ListItemPrefix>
								<svg
									fill="currentColor"
									strokeWidth="0"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									height="1em"
									width="1em"
								>
									<path
										fill="currentColor"
										d="M12.001 22c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10Zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm1.334-8a1.5 1.5 0 0 0 0-3H10.5v3h2.834Zm0-5a3.5 3.5 0 1 1 0 7H10.5v3h-2V7h4.834Z"
									></path>
								</svg>
							</ListItemPrefix>
							<Typography color="blue-gray" className="mr-auto font-normal">
								Proveedores
							</Typography>
						</AccordionHeader>
					</ListItem>
					<AccordionBody className="py-1">
						<List className="p-0">
							<Link href={"/dashboard/entidad/proveedores"}>
								<ListItem className="text-xs hover:bg-blue-800 rounded-md shadow-xl bg-blue-300 ">
									<ListItemPrefix>
										<ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
									</ListItemPrefix>
									Registro de Proveedor
								</ListItem>
							</Link>

							<Link href={"/dashboard/lista/proveedores"}>
								<ListItem className="text-xs hover:bg-blue-800 rounded-md shadow-xl bg-blue-300 ">
									<ListItemPrefix>
										<ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
									</ListItemPrefix>
									Lista de Proveedores
								</ListItem>
							</Link>
						</List>
					</AccordionBody>
				</Accordion>

				<Accordion
					open={open === 5}
					icon={
						<ChevronDownIcon
							strokeWidth={2.5}
							className={`mx-auto h-4 w-4 transition-transform ${open === 4 ? "rotate-180" : ""}`}
						/>
					}
				>
					<ListItem className="p-0" selected={open === 5}>
						<AccordionHeader onClick={() => handleOpen(5)} className="border-b-0 p-3">
							<ListItemPrefix>
								<svg
									fill="currentColor"
									strokeWidth="0"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									height="1em"
									width="1em"
								>
									<path
										fill="currentColor"
										d="M12 14v2a6 6 0 0 0-6 6H4a8 8 0 0 1 8-8Zm0-1c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6Zm0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4Zm9 6h1v5h-8v-5h1v-1a3 3 0 1 1 6 0v1Zm-2 0v-1a1 1 0 1 0-2 0v1h2Z"
									></path>
								</svg>
							</ListItemPrefix>
							<Typography color="blue-gray" className="mr-auto font-normal">
								Administrador
							</Typography>
						</AccordionHeader>
					</ListItem>
					<AccordionBody className="py-1">
						<List className="p-0">
							<ListItem
								className="text-xs hover:bg-blue-800 rounded-md shadow-xl bg-blue-300 "
								onClick={() => {
									router.replace("/dashboard/lista-roles")
								}}
							>
								<ListItemPrefix>
									<ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
								</ListItemPrefix>
								Lista de Administradores
							</ListItem>
						</List>
					</AccordionBody>
				</Accordion>
				<hr className="my-2 border-blue-gray-50" />
				<ListItem>
					<ListItemPrefix>
						<UserCircleIcon className="h-5 w-5" />
					</ListItemPrefix>
					Profile
				</ListItem>
				<ListItem onClick={() => signOut()} className=" hover:text-red-800">
					<ListItemPrefix>
						<PowerIcon className="h-5 w-5" />
					</ListItemPrefix>
					Cerrar Sesion
				</ListItem>
			</List>
			{/* */}
		</Card>
	)
}
