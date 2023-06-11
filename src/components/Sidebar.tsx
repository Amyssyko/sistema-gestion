"use client"
import axios from "axios"
import classNames from "classnames"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React, { useState, useMemo } from "react"
import logo from "../app/favicon.ico"
import { ArticleIcon, CollapsIcon, HomeIcon, LogoIcon, LogoutIcon, UsersIcon, VideosIcon } from "../icons"
import { toast } from "react-hot-toast"
import SigninButton from "./SigninButton"

interface MenuItem {
	id: number
	label: string
	icon: React.FC<React.SVGProps<SVGSVGElement>>
	link: string
}
const menuItems: MenuItem[] = [
	{ id: 1, label: "Inicio", icon: HomeIcon, link: "/dashboard" },
	{ id: 2, label: "Chofer", icon: UsersIcon, link: "/dashboard/chofer" },
	{ id: 3, label: "Unidad", icon: ArticleIcon, link: "/dashboard/bus" },
	{ id: 4, label: "Transacciones", icon: ArticleIcon, link: "/dashboard/transaccion" },
	//{ id: 5, label: "Tramites", icon: ArticleIcon, link: "/dashboard/tramites" },
	{ id: 5, label: "Roles", icon: UsersIcon, link: "/auth/rol" },
]

const Sidebar: React.FC = () => {
	const [toggleCollapse, setToggleCollapse] = useState(false)
	const [isCollapsible, setIsCollapsible] = useState(false)

	const router = useRouter()

	const activeMenu = useMemo(() => menuItems.find((menu) => menu.link === router.pathname), [router.pathname])

	const wrapperClasses = classNames(
		"min-h-screen px-2 pt-8 pb-4 bg-light flex justify-between flex-col bg-sky-700 dark:bg-sky-950 text-orange-50",
		{
			["w-56"]: !toggleCollapse,
			["w-18"]: toggleCollapse,
		}
	)
	// desplazar botonm
	const collapseIconClasses = classNames("p-4 rounded bg-light-lighter absolute right-0", {
		"rotate-180": toggleCollapse,
	})

	//bar settings
	const getNavItemClasses = (menu: MenuItem) => {
		return classNames(
			"flex items-center cursor-pointer hover:bg-light-lighter  bg-sky-800 dark:bg-slate-900 my-1 rounded w-full overflow-hidden whitespace-nowrap",
			{
				["bg-light-lighter"]: activeMenu?.id === menu.id,
			}
		)
	}

	const onMouseOver = () => {
		setIsCollapsible(!isCollapsible)
	}

	const handleSidebarToggle = () => {
		setToggleCollapse(!toggleCollapse)
	}
	const logout = async () => {
		try {
			const response = await axios.post("/api/auth/logout")
			if (response.status === 200) {
				//alerta
			}
		} catch (error) {
			console.error(error)
			router.push("/auth/login")
		}
		router.push("/auth/login")
	}

	return (
		<div
			className={wrapperClasses}
			onMouseEnter={onMouseOver}
			onMouseLeave={onMouseOver}
			style={{ transition: "width 500ms cubic-bezier(0.2, 0, 0, 1) 0s" }}
		>
			<div className="flex flex-col">
				<div className="flex items-center justify-center relative ">
					<div className="grid justify-items-center  ">
						<Image className="rounded-full" src={logo} height="100" width="100" alt="logo" priority />

						<span
							className={classNames(" text-lg font-medium text-text ", {
								hidden: toggleCollapse,
							})}
						>
							Rio San Pablo
						</span>
					</div>
					{isCollapsible && (
						<button className={collapseIconClasses} onClick={handleSidebarToggle}>
							<CollapsIcon />
						</button>
					)}
				</div>

				<div className="flex flex-col items-start mt-36">
					{menuItems.map(({ icon: Icon, ...menu }) => {
						const classes = getNavItemClasses(menu)
						return (
							<div key={menu.id} className={classes}>
								<Link
									passHref
									href={menu.link}
									className="flex py-4 px-3 items-center w-full h-full hover:bg-blue-800  hover:shadow"
								>
									<div style={{ width: "2.5rem" }}>
										<Icon />
									</div>
									{!toggleCollapse && (
										<span
											className={classNames(
												"text-text-light text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-lg"
											)}
										>
											{menu.label}
										</span>
									)}
								</Link>
							</div>
						)
					})}
				</div>
			</div>
			<SigninButton />
			<div className={`${getNavItemClasses({})} px-3 py-3 hover:bg-red-600 flex justify-start `}>
				<div style={{ width: "2.5rem" }}>
					<LogoutIcon />
				</div>

				<button className=" relative" onClick={() => logout()}>
					{!toggleCollapse && (
						<span className={classNames("text-md font-medium text-text-light")}>Cerrar Sessión</span>
					)}
				</button>
			</div>
		</div>
	)
}

export default Sidebar
