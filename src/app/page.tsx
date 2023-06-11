"use client"
import Balance from "@/components/Balance"
import ExpenseChart from "@/components/ExpenseChart"
import TansactionExpense from "@/components/transactions/TansactionExpense"
import TransactionForm from "@/components/transactions/TransactionForm"
import TransactionList from "@/components/transactions/TransactionList"
import { GlobalProvider } from "../context/GlobalState"
import { useSession } from "next-auth/react"

export const metadata = {
	title: "Sistema Gestion de transporte de Turismo",
	description: "App de Gestion",
}

const Home = () => {
	const { data: session } = useSession()
	const { dni } = session?.user || {}
	console.log(session?.user)
	return (
		<>
			<GlobalProvider>
				{/**<Header /> */}
				<div className="grid min-h-screen">
					<div className="px-5 sm:px-8 md:px-12 lg:mx-46 xl:mx-86 2xl:mx-86 my-auto">
						<div className="flex justify-center items-center">
							<ExpenseChart />
						</div>
						<TansactionExpense />
						<Balance />
						<TransactionForm />
						<TransactionList />
					</div>
				</div>
			</GlobalProvider>
		</>
	)
}

export default Home
