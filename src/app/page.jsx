import Balance from "@/app/components/Balance"
import ExpenseChart from "@/app/components/ExpenseChart"
import Header from "@/app/components/Header"
import TansactionExpense from "@/app/components/transactions/TansactionExpense"
import TransactionForm from "@/app/components/transactions/TransactionForm"
import TransactionList from "@/app/components/transactions/TransactionList"
import { GlobalProvider } from "@/app/context/GlobalState"

const Home = () => {
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
