import Sidebar from "./Sidebar"

export function Layout({ children }) {
	return (
		<>
			<div className="min-h-screen flex">
				<Sidebar />
				<div className=" w-screen mx-auto h-screen border shadow-lg border-red-800">{children}</div>
			</div>
		</>
	)
}

{
	/*container mx-auto h-full flex  */
}
